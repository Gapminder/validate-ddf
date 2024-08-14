-- | this is the validation process which we begin by loading all
-- | csv files that match the ddf csv naming conventions.
module App.Validation.FileNameBased where

import App.Validation.Common
import Prelude

import Control.Monad.Trans.Class (lift)
import Data.Array as Arr
import Data.Array.NonEmpty as NEA
import Data.DDF.Csv.FileInfo (CollectionInfo(..), FileInfo, getCollectionType)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.DataSet (DataSet(..))
import Data.Either (Either(..), hush)
import Data.Function (on)
import Data.HashMap (HashMap)
import Data.HashMap as HM
import Data.JSON.DataPackage (Resource, datapackageExists)
import Data.JSON.DataPackage as DataPackage
import Data.Maybe (Maybe(..), fromJust, isNothing)
import Data.Traversable (for, traverse_)
import Data.Tuple (Tuple(..))
import Data.Validation.Issue (Issue(..))
import Data.Validation.Result (Messages, hasError, messageFromIssue, setError)
import Data.Validation.Semigroup (toEither)
import Data.Validation.ValidationT (Validation, ValidationT, getState, vError)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Console (log)
import Node.Encoding as Encoding
import Node.FS.Aff (readTextFile)
import Node.Path (FilePath)
import Partial.Unsafe (unsafePartial)
import Utils (getFiles)


-- | read all files
readAllFileInfoForValidation :: FilePath -> Array FilePath -> Validation Messages (Array FileInfo)
readAllFileInfoForValidation root fs = do
  let
    -- parse filenames
    -- just yield the right ones, ignore lefts
    ddfFiles = Arr.catMaybes $ map (\f -> hush $ FI.fromFilePath root f) fs

  when (isNothing $ Arr.head ddfFiles)
    $ vError
        [ (setError <<< messageFromIssue)
            $ Issue "No ddf csv files in this folder. Please begin with a ddf--concepts.csv file."
        ]

  pure ddfFiles


-- | read datapackage and get all resources
readDataPackageResources :: FilePath -> ValidationT Messages Aff (Array Resource)
readDataPackageResources path = do
  datapackage <- liftEffect $ datapackageExists path
  case toEither datapackage of
    Left issues -> emitErrorsAndStop issues
    Right dpath -> do
      content <- lift $ readTextFile Encoding.UTF8 dpath
      case toEither $ DataPackage.parseDataPackageResources content of
        Left issues -> emitErrorsAndStop issues
        Right res -> pure res


-- | main validation process
validate :: FilePath -> ValidationT Messages Aff DataSet
validate path = do
  lift $ liftEffect $ log "reading file list..."

  let
    ignored = [ ".git", "etl", "assets", "langsplit" ]
  fs <- lift $ getFiles path ignored

  ddfFiles <- readAllFileInfoForValidation path fs

  lift $ liftEffect $ log "validating concepts and entities..."

  let
    -- group files by their collection. e.g concept files / entity files
    groupfunc = compare `on` FI.collection
    fileGroups = Arr.groupAllBy groupfunc ddfFiles
    fileMap =
      HM.fromArrayBy
        (getCollectionType <<< FI.collection <<< NEA.head)
        identity
        fileGroups

  -- filter concept files
  -- we must have concept files in a dataset.
  conceptFileInfos <-
    case HM.lookup FI.CONCEPTS fileMap of
      Nothing ->
        emitErrorsAndStop [ Issue "No concepts file in folder. Please add ddf--concepts.csv" ]
      Just xs -> pure $ NEA.toArray xs
  -- validate csv files, create valid concepts
  conceptCsvFiles <- readAndParseCsvFiles conceptFileInfos
  concepts <- for conceptCsvFiles (\x -> validateConcepts x)
  -- generate resources for datapackage
  let
    conceptResources = DataPackage.createResources path conceptCsvFiles

  -- filter entity files
  entityFileInfos <-
    case HM.lookup FI.ENTITIES fileMap of
      Nothing -> pure []
      Just xs -> pure $ NEA.toArray xs
  -- validate csv files, create valid entities
  entityCsvFiles <- readAndParseCsvFiles entityFileInfos
  entities <- for entityCsvFiles (\x -> validateEntities x)
  -- generate resources for datapackage
  let
    entityResources = DataPackage.createResources path entityCsvFiles

  -- create a base dataset from concepts and entities
  ds <- validateBaseDataSet (Arr.concat concepts) (Arr.concat entities)

  -- if there are errors, stop here
  msgs <- getState
  when (hasError msgs) do
    _ <- vError
      [ setError <<< messageFromIssue $
          Issue "Validation stopped because of errors."
      ]
    pure unit

  -- validate each indicators. First we will need to find all csv files for the indicator
  datapointFiles <-
    case HM.lookup FI.DATAPOINTS fileMap of
      Nothing -> pure []
      Just xs -> do
        lift $ liftEffect $ log "validating datapoints..."
        pure $ NEA.toArray xs

  let
    getIndicatorAndPkey fi =
      case FI.collection fi of
        (DataPoints dp) -> Just $ Tuple dp.indicator dp.pkeys
        otherwise -> Nothing

    -- If we will change this line, be sure to also double check the unsafePartial line below.
    datapointFileGroups = Arr.groupAllBy (compare `on` getIndicatorAndPkey) datapointFiles

  datapointResources_ <- for datapointFileGroups \group -> do
    let
      -- we have veritified on last step so we can use the fromJust function.
      (Tuple indicator pkeys) = unsafePartial $ fromJust $ getIndicatorAndPkey $ NEA.head group

    -- lift $ liftEffect $ log $ "indicator: "
    --   <> show (toString indicator)
    --   <> ", by: "
    --   <> (Str.joinWith ", " $ Arr.fromFoldable (map toString pkeys))
    --   <> ", total files: "
    --   <> show (NEA.length group)

    -- read all csv files for the group
    dpscsvFiles <- readAndParseCsvFiles $ NEA.toArray group
    validateDatapointsFileGroup indicator pkeys ds dpscsvFiles
    pure $ DataPackage.createResources path dpscsvFiles
  let
    datapointResources = Arr.concat datapointResources_

  -- check synonym files
  --
  synonymFileInfos <-
    case HM.lookup FI.SYNONYMS fileMap of
      Nothing -> pure []
      Just xs -> do
        lift $ liftEffect $ log "validating synonym files..."
        pure $ NEA.toArray xs
  synonymCsvFiles <- readAndParseCsvFiles synonymFileInfos
  traverse_ (\c -> validateCsvFileWithDataSet ds c) synonymCsvFiles
  -- generate resources for datapackage
  let
    synonymResources = DataPackage.createResources path synonymCsvFiles

  -- check translation files
  --
  translationFileInfos <-
    case HM.lookup FI.TRANSLATIONS fileMap of
      Nothing -> pure []
      Just xs -> do
        lift $ liftEffect $ log "validating translation files..."
        pure $ NEA.toArray xs
  translationCsvFiles <- readAndParseCsvFiles translationFileInfos
  traverse_ (\c -> validateCsvFileWithDataSet ds c) translationCsvFiles
  -- we don't generate datapackage resources for translations

  -- check datapackage.json
  --
  let
    actualResources = conceptResources <> entityResources <> datapointResources <> synonymResources
  expectedResources <- readDataPackageResources path
  case toEither $ DataPackage.compareResources expectedResources actualResources of
    Left issues -> emitWarningsAndContinue issues
    Right _ -> pure unit

  pure ds

