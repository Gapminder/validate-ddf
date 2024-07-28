module Main where

import App.Validations
import Debug
import Prelude

import Control.Monad.Trans.Class (lift)
import Data.Array as Arr
import Data.Array.NonEmpty as NEA
import Data.Csv (createRawContent, readCsv, readCsv')
import Data.DDF.Atoms.Header (headerVal)
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Concept (Concept(..))
import Data.DDF.Csv.FileInfo (CollectionInfo(..), FileInfo(..), getCollectionFiles, isConceptFile, isDataPointsFile, isEntitiesFile)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.Csv.Utils (createDataPointsInput)
import Data.DDF.DataPoint (mergeDataPointsInput, parseDataPoints)
import Data.DDF.DataSet (parseBaseDataSet)
import Data.DDF.DataSet as DS
import Data.DDF.DataSet as DataSet
import Data.DDF.DataSet as DatatSet
import Data.Either (Either(..), hush)
import Data.Function (on)
import Data.HashMap (HashMap)
import Data.HashMap as HM
import Data.JSON.DataPackage (datapackageExists)
import Data.Maybe (Maybe(..), fromJust, fromMaybe, isNothing)
import Data.String (joinWith)
import Data.String as Str
import Data.String.NonEmpty (toString)
import Data.String.NonEmpty as NES
import Data.Traversable (sequence, for)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..))
import Data.Validation.Result (Messages, hasError, messageFromIssue, setError, showMessage)
import Data.Validation.Semigroup (V, andThen, invalid, isValid, toEither)
import Data.Validation.ValidationT (Validation, ValidationT, runValidationT, vError, vWarning)
import Effect (Effect)
import Effect.Aff (Aff, launchAff, launchAff_)
import Effect.Class (liftEffect)
import Effect.Console (log, logShow)
import Node.Path (FilePath)
import Node.Process (argv)
import Partial.Unsafe (unsafePartial)
import Utils (getFiles)
import Utils.GC (gc)

-- testrun :: FilePath -> Effect Unit
-- testrun path = launchAff_ do
--   -- list all csv files in the folder
--   fs <- getFiles path [ ".git", "etl", "lang", "assets" ]
--   liftEffect $ log "reading file list..."
--   _ <- traceM fs
--   pure unit

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
    -- FIXME: use a hashmap
    groupfunc = compare `on` FI.collection
    fileGroups = Arr.groupAllBy groupfunc ddfFiles

  -- filter concept files
  -- we must have concept files in a dataset.
  conceptFiles_ <- checkNonEmptyArray "concept csvs" $
    Arr.filter (isConceptFile <<< NEA.head) fileGroups

  let
    conceptFiles = NEA.toArray $ NEA.head conceptFiles_
  -- validate csv files, create valid concepts
  conceptCsvRows <- lift $ sequence $ readCsv' <$> conceptFiles
  let
    conceptCsvContent = map createRawContent conceptCsvRows
  conceptCsvFiles <- validateCsvFiles $ Arr.zip conceptFiles conceptCsvContent
  concepts <- for conceptCsvFiles (\x -> validateConcepts x)

  -- filter entity files
  let
    entityFiles = Arr.concatMap NEA.toArray $
      Arr.filter (isEntitiesFile <<< NEA.head) fileGroups

  -- validate csv files, create valid entities
  entityCsvRows <- lift $ sequence $ readCsv' <$> entityFiles
  let
    entityCsvContent = map createRawContent entityCsvRows
  entityCsvFiles <- validateCsvFiles $ Arr.zip entityFiles entityCsvContent
  entities <- for entityCsvFiles (\x -> validateEntities x)

  -- create a base dataset from concepts and entities
  ds <- validateBaseDataSet (Arr.concat concepts) (Arr.concat entities)

  -- validate each indicators. First we will need to find all csv files for the indicator
  let
    datapointFiles = Arr.concatMap NEA.toArray $
      Arr.filter (isDataPointsFile <<< NEA.head) fileGroups

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
    dpsCsvFiles <- for group
      ( \f -> do
          csvrows <- lift $ readCsv' f
          let
            rawcsv = createRawContent csvrows
          dpcsvfile <- validateCsvFile (Tuple f rawcsv)
          pure dpcsvfile
      )
    let
      goodDpsFiles = NEA.catMaybes dpsCsvFiles

    case NEA.fromArray goodDpsFiles of
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
    -- lift $ liftEffect gc
    pure unit
  -- lift $ liftEffect $ logShow $ Arr.head datapointCsvFiles
  pure $ DS.getConcepts ds

-- separated steps
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

runMain :: FilePath -> Effect Unit
runMain path = launchAff_ do
  liftEffect $ log "v0.0.8dev"
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
