module App.Validation.DataPackageBased where

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
import Data.String.NonEmpty as NES
import Data.Traversable (for, traverse, traverse_)
import Data.Tuple (Tuple(..))
import Data.Validation.Issue (Issue(..), mkIssue, mkIssueWithMessage)
import Data.Validation.Registry (ErrorCode(..))
import Data.Validation.Result (Messages, hasError, messageFromIssue, setError)
import Data.Validation.Semigroup (toEither)
import Data.Validation.ValidationT (Validation, ValidationT, getState, vError)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Console (log)
import Node.Encoding as Encoding
import Node.FS.Aff (readTextFile)
import Node.Path (FilePath)
import Node.Path as PATH
import Partial.Unsafe (unsafePartial)
import Utils (getFiles)

-- TODO: maybe we don't need to force the file name should match ddf filename standard?

-- | read all files
readAllFileInfoForValidation :: FilePath -> Array Resource -> Validation Messages (Array FileInfo)
readAllFileInfoForValidation root rs = do
  let
    -- get filenames
    fs = map
      ( _.path
          >>> NES.toString
          >>> (\x -> PATH.concat [ root, x ])
      )
      rs
    -- just yield the right ones, ignore lefts
    ddfFiles = Arr.catMaybes $ map (\f -> hush $ FI.fromFilePath root f) fs

  when (isNothing $ Arr.head ddfFiles)
    $ vError
        [ (setError <<< messageFromIssue)
            $ mkIssueWithMessage E_GENERAL
                "No ddf csv files in this folder. Please begin with a ddf--concepts.csv file."
        ]

  pure ddfFiles

-- | read datapackage and get all resources
readDataPackageResources :: FilePath -> ValidationT Messages Aff (Array Resource)
readDataPackageResources path = do
  datapackage <- liftEffect $ datapackageExists path
  case toEither datapackage of
    Left issues -> do
      emitErrorsAndContinue issues
      pure []
    Right dpath -> do
      content <- lift $ readTextFile Encoding.UTF8 dpath
      case toEither $ DataPackage.parseDataPackageResources content of
        Left issues -> do
          emitErrorsAndContinue issues
          pure []
        Right res -> pure res

-- | main validation process
validate :: FilePath -> ValidationT Messages Aff (Tuple DataSet (Array Resource))
validate path = do
  lift $ liftEffect $ log "reading file list..."

  resources <- readDataPackageResources path
  ddfFiles <- readAllFileInfoForValidation path resources

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
        emitErrorsAndStop [ mkIssue E_DATASET_NO_CONCEPT ]
      Just xs -> pure $ NEA.toArray xs
  -- validate csv files, create valid concepts
  conceptFileInfos' <- traverse validateFileExists conceptFileInfos
  conceptCsvFiles <- readAndParseCsvFiles false $ Arr.catMaybes conceptFileInfos'
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
  entityFileInfos' <- traverse validateFileExists entityFileInfos
  entityCsvFiles <- readAndParseCsvFiles false $ Arr.catMaybes entityFileInfos'
  entities <- for entityCsvFiles (\x -> validateEntities x)
  -- generate resources for datapackage
  let
    entityResources = DataPackage.createResources path entityCsvFiles

  -- create a base dataset from concepts and entities
  ds <- validateBaseDataSet (Arr.concat concepts) (Arr.concat entities)
  -- validate all headers in concepts and entities files
  -- this will emit errors
  traverse_ (\c -> validateCsvHeaders ds c) conceptCsvFiles
  traverse_ (\c -> validateCsvHeaders ds c) entityCsvFiles

  -- if there are errors, stop here
  msgs <- getState
  if (hasError msgs) then
    pure (Tuple ds [])
  else do
    -- also validate all values in concepts/entities csv files
    -- this will emit warnings
    traverse_ (\c -> validateCsvFileWithDataSet ds c) entityCsvFiles
    traverse_ (\c -> validateCsvFileWithDataSet ds c) conceptCsvFiles

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
      group' <- traverse validateFileExists group
      dpscsvFiles <- readAndParseCsvFiles false $ NEA.catMaybes group'
      validateDatapointsFileGroup indicator pkeys ds dpscsvFiles
      pure $ DataPackage.createResources path dpscsvFiles
    let
      datapointResources = Arr.concat datapointResources_

    -- FIXME: synonyms and translations were not in resources generated by ddf_utils.
    -- check synonym files
    --
    synonymFileInfos <-
      case HM.lookup FI.SYNONYMS fileMap of
        Nothing -> pure []
        Just xs -> do
          lift $ liftEffect $ log "validating synonym files..."
          pure $ NEA.toArray xs
    synonymCsvFiles <- readAndParseCsvFiles false synonymFileInfos
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
    translationCsvFiles <- readAndParseCsvFiles false translationFileInfos
    traverse_ (\c -> validateCsvFileWithDataSet ds c) translationCsvFiles
    -- we don't generate datapackage resources for translations

    -- check datapackage.json
    --
    let
      actualResources = conceptResources <> entityResources <> datapointResources <> synonymResources
      expectedResources = resources
    case toEither $ DataPackage.compareResources expectedResources actualResources of
      Left issues -> emitErrorsAndContinue issues
      Right _ -> pure unit

    pure (Tuple ds actualResources)

