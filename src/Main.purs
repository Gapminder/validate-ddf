module Main where

import App.Validations
import Debug
import Prelude

import Control.Monad.Trans.Class (lift)
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Csv (createRawContent, readCsv, readCsv')
import Data.DDF.Atoms.Header (headerVal)
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Concept (Concept(..))
import Data.DDF.Csv.CsvFile (CsvFile)
import Data.DDF.Csv.FileInfo (CollectionInfo(..), FileInfo(..), getCollectionFiles, isConceptFile, isDataPointsFile, isEntitiesFile, getCollectionType)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.Csv.Utils (createDataPointsInput)
import Data.DDF.DataPoint (mergeDataPointsInput, parseDataPoints)
import Data.DDF.DataSet (DataSet(..), parseBaseDataSet)
import Data.DDF.DataSet as DS
import Data.DDF.DataSet as DataSet
import Data.DDF.DataSet as DatatSet
import Data.Either (Either(..), hush)
import Data.Function (on)
import Data.HashMap (HashMap)
import Data.HashMap as HM
import Data.JSON.DataPackage (datapackageExists)
import Data.List.Types (NonEmptyList)
import Data.Maybe (Maybe(..), fromJust, fromMaybe, isNothing)
import Data.String (joinWith)
import Data.String as Str
import Data.String.NonEmpty (toString)
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.Traversable (sequence, for)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..))
import Data.Validation.Result (Messages, hasError, messageFromIssue, setError, showMessage)
import Data.Validation.Semigroup (V, andThen, invalid, isValid, toEither)
import Data.Validation.ValidationT (ValidationT, Validation, runValidationT, vError, vWarning)
import Effect (Effect)
import Effect.Aff (Aff, launchAff, launchAff_)
import Effect.Class (liftEffect)
import Effect.Console (log, logShow)
import Node.Path (FilePath)
import Node.Process (argv)
import Partial.Unsafe (unsafePartial)
import Utils (getFiles)
import Utils.GC (gc)

-- | read all files
readAllFileInfoForValidation :: Array FilePath -> Validation Messages (Array FileInfo)
readAllFileInfoForValidation fs = do
  let
    -- parse filenames
    -- just yield the right ones, ignore lefts
    ddfFiles = Arr.catMaybes $ map (\f -> hush $ FI.fromFilePath f) fs

  when (isNothing $ Arr.head ddfFiles)
    $ vError
        [ (setError <<< messageFromIssue)
            $ Issue "No csv files in this folder. Please begin with a ddf--concepts.csv file."
        ]

  pure ddfFiles

-- | read csv data from file
readAndParseCsvFiles :: Array FileInfo -> ValidationT Messages Aff (Array CsvFile)
readAndParseCsvFiles files = do
  csvRows <- lift $ sequence $ readCsv' <$> files
  let
    csvContents = map createRawContent csvRows
  validateCsvFiles $ Arr.zip files csvContents


validate :: FilePath -> ValidationT Messages Aff (HashMap String Concept)
validate path = do
  lift $ liftEffect $ log "reading file list..."

  let
    ignored = [ ".git", "etl", "lang", "assets" ]
  fs <- lift $ getFiles path ignored

  ddfFiles <- readAllFileInfoForValidation fs

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

  -- filter entity files
  entityFileInfos <-
    case HM.lookup FI.ENTITIES fileMap of
      Nothing -> pure []
      Just xs -> pure $ NEA.toArray xs
  -- validate csv files, create valid entities
  entityCsvFiles <- readAndParseCsvFiles entityFileInfos
  entities <- for entityCsvFiles (\x -> validateEntities x)

  -- create a base dataset from concepts and entities
  ds <- validateBaseDataSet (Arr.concat concepts) (Arr.concat entities)

  -- validate each indicators. First we will need to find all csv files for the indicator
  datapointFiles <-
    case HM.lookup FI.DATAPOINTS fileMap of
      Nothing -> pure []
      Just xs -> pure $ NEA.toArray xs

  let
    getIndicatorAndPkey fi =
      case FI.collection fi of
        (DataPoints dp) -> Just $ Tuple dp.indicator dp.pkeys
        otherwise -> Nothing

    -- If we will change this line, be sure to also double check the unsafePartial line below.
    datapointFileGroups = Arr.groupAllBy (compare `on` getIndicatorAndPkey) datapointFiles

  lift $ liftEffect $ log "validating datapoints..."

  _ <- for datapointFileGroups \group -> do
    let
      -- we have veritified on last step so we can use the fromJust function.
      (Tuple indicator pkeys) = unsafePartial $ fromJust $ getIndicatorAndPkey $ NEA.head group

    lift $ liftEffect $ log $ "indicator: "
      <> show (toString indicator)
      <> ", by: "
      <> (Str.joinWith ", " $ Arr.fromFoldable (map toString pkeys))
      <> ", total files: "
      <> show (NEA.length group)

    -- read all csv files for the group
    dpscsvFiles <- readAndParseCsvFiles $ NEA.toArray group
    validateDatapointsFileGroup indicator pkeys ds dpscsvFiles

  -- check synonym files
  --
  synonymFileInfos <-
    case HM.lookup FI.SYNONYMS fileMap of
      Nothing -> pure []
      Just xs -> pure $ NEA.toArray xs
  synonymCsvFiles <- readAndParseCsvFiles synonymFileInfos
  -- NEXT: parse with DataSet

  pure $ DS.getConcepts ds

-- | validate one indicator group (indicator with same primary keys)
validateDatapointsFileGroup :: NonEmptyString -> NonEmptyList NonEmptyString -> DataSet -> Array CsvFile -> Validation Messages Unit
validateDatapointsFileGroup indicator pkeys ds csvfiles =
  case NEA.fromArray csvfiles of
    Nothing -> do
      vWarning $
        [ messageFromIssue
            $ Issue
            $ "No valid csv file for "
                <> (toString indicator)
                <> " by "
                <> (NES.joinWith "," (Arr.fromFoldable pkeys))
        ]
    Just dpfs -> do
      -- validate all datapoints, first without dataset info, then with dataset info.
      validateDataPoints dpfs >>=
        ( \dps ->
            case dps of
              Nothing -> pure unit
              Just dps' -> validateDataPointsWithDataSet ds dps'
        )

--
runMain :: FilePath -> Effect Unit
runMain path = launchAff_ do
  liftEffect $ log "v0.0.9dev"
  (Tuple msgs ds) <- runValidationT $ validate path
  let
    allmsgs = joinWith "\n" $ map showMessage msgs
  liftEffect $ log allmsgs
  case ds of
    Just ds_ -> do
      -- liftEffect $ logShow ds_
      if hasError msgs then
        liftEffect $ log "❌ Dataset is invalid"
      else
        liftEffect $ log "✅ Dataset is valid"
    Nothing -> liftEffect $ log "❌ Dataset is invalid"

-- main
main :: Effect Unit
main = do
  -- get path
  path <- argv
  case path Arr.!! 2 of
    Nothing -> runMain "./"
    Just fp -> runMain fp
