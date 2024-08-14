module App.Validation.Common where

import Prelude

import Control.Monad.Trans.Class (lift)
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Csv (RawCsvContent, createRawContent, parseCsvContent, readCsv')
import Data.Csv as C
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Concept (Concept(..), getId, getInfo, parseConcept, reservedConcepts)
import Data.DDF.Csv.CsvFile (CsvFile, parseCsvFile)
import Data.DDF.Csv.FileInfo (FileInfo)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.Csv.Utils (createConceptInput, createDataPointsInput, createEntityInput)
import Data.DDF.DataPoint (DataPoints(..), mergeDataPointsInput, parseDataPoints)
import Data.DDF.DataSet (DataSet(..), parseBaseDataSet)
import Data.DDF.DataSet as DataSet
import Data.DDF.Entity (Entity(..), parseEntity)
import Data.DDF.Internal (pathAndRow)
import Data.Either (Either(..))
import Data.HashMap as HM
import Data.List.Types (NonEmptyList)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.String as Str
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.Traversable (class Traversable, for, sequence, traverse)
import Data.Tuple (Tuple(..))
import Data.Validation.Issue (Issue(..), Issues, withRowInfo)
import Data.Validation.Result (Messages, messageFromIssue, setError, setFile, setLineNo)
import Data.Validation.Semigroup (andThen, toEither)
import Data.Validation.ValidationT (ValidationT, Validation, vError, vWarning)
import Effect.Aff (Aff)
import Node.Path (FilePath)

-- | emit warnings and continue the validation
emitWarningsAndContinue :: forall m. Monad m => Issues -> ValidationT Messages m Unit
emitWarningsAndContinue issues = do
  vWarning msgs
  pure unit
  where
  msgs = map messageFromIssue issues

-- | emit errors and continue the validation
emitErrorsAndContinue :: forall m. Monad m => Issues -> ValidationT Messages m Unit
emitErrorsAndContinue issues = do
  vWarning msgs
  pure unit
  where
  msgs = map (setError <<< messageFromIssue) issues


-- | emit errors and stop the validation
emitErrorsAndStop :: forall x m. Monad m => Issues -> ValidationT Messages m x
emitErrorsAndStop issues = do
  vError msgs
  where
  msgs = map (setError <<< messageFromIssue) issues


-- | read csv data from file
readAndParseCsvFiles :: Array FileInfo -> ValidationT Messages Aff (Array CsvFile)
readAndParseCsvFiles files = do
  csvRows <- lift $ sequence $ readCsv' <$> files
  let
    csvContents = map createRawContent csvRows
  validateCsvFiles $ Arr.zip files csvContents

-- | validte csv content, drop bad csv rows
dropAndWarnBadCsvRows ::
  FilePath
  -> RawCsvContent
  -> Validation Messages RawCsvContent
dropAndWarnBadCsvRows fp content = do
  let
    (Tuple badIdx content') = C.filterBadRows content
    makemsg idx =
      ( setLineNo idx
          <<< setFile fp
          <<< messageFromIssue
      ) $ Issue "Bad Csv row"
    msgs = map makemsg badIdx
  vWarning msgs
  pure content'

-- | parse csv file info and csv data into a valid CsvFile
validateCsvFile ::
  (Tuple FileInfo RawCsvContent)
  -> Validation Messages (Maybe CsvFile)
validateCsvFile (Tuple fi rawcsv) = do
  let
    fp = FI.filepath fi
  -- skip bad csv rows
  rawcsv' <- dropAndWarnBadCsvRows fp rawcsv

  let
    csvFileInput = { fileInfo: fi, csvContent: parseCsvContent rawcsv'}

  case toEither $ parseCsvFile csvFileInput of
    Right validFile -> do
      pure $ Just validFile
    Left errs -> do
      -- FIXME: should we do warning or error?
      vWarning msgs
      pure Nothing
      where
      msgs = map (setError <<< setFile fp <<< messageFromIssue) errs

validateCsvFiles :: forall t. Traversable t =>
  (t (Tuple FileInfo RawCsvContent))
  -> Validation Messages (Array CsvFile)
validateCsvFiles xs = do
  rs <- for xs (\x -> validateCsvFile x)
  pure $ Arr.mapMaybe identity $ Arr.fromFoldable rs

-- | parse a CsvFile, create an array of valid concepts
validateConcepts :: CsvFile -> Validation Messages (Array Concept)
validateConcepts csvfile =
  let
    conceptInputs = createConceptInput csvfile
  in
    case toEither conceptInputs of
      -- There is only one possible issue:
      -- calling createConceptInput on non-concepts files
      -- that's an error on the source code. We should stop
      Left issues -> emitErrorsAndStop issues
      Right inputs ->
        Arr.foldM
          ( \acc input -> do
              let
                (Tuple fp i) = case input._info of
                  Nothing -> (Tuple "" (-1))
                  Just info -> pathAndRow info
                concept = parseConcept input
              case toEither concept of
                Left errs -> do
                  _ <- vWarning msgs
                  pure acc
                  where
                  msgs = map
                    ( setLineNo i
                        <<< setFile fp
                        <<< setError
                        <<< messageFromIssue
                    )
                    errs
                Right vconc -> pure $ Arr.snoc acc vconc
          )
          []
          inputs

validateEntities :: CsvFile -> Validation Messages (Array Entity)
validateEntities csvfile =
  let
    entityInputs = createEntityInput csvfile
  in
    case toEither entityInputs of
      Left issues -> emitErrorsAndStop issues
      Right inputs ->
        Arr.foldM go [] inputs
        where
          go acc input =
            let
              (Tuple fp i) = case input._info of
                Nothing -> (Tuple "" (-1))
                Just info -> pathAndRow info
            in
              case toEither $ parseEntity input of
                Left errs -> do
                  _ <- vWarning msgs
                  pure acc
                  where
                  msgs = map
                    ( setLineNo i
                        <<< setFile fp
                        <<< setError
                        <<< messageFromIssue
                    )
                    errs
                Right vent -> pure $ Arr.snoc acc vent


validateBaseDataSet :: (Array Concept) -> (Array Entity) -> Validation Messages DataSet
validateBaseDataSet conceptsInput entitiesInput =
  case toEither $ parseBaseDataSet conceptsInput entitiesInput of
    Right ds -> pure ds
    Left errs -> do
      emitErrorsAndStop errs

-- | validate one indicator group (indicator with same primary keys)
validateDatapointsFileGroup :: NonEmptyString -> NonEmptyList NonEmptyString -> DataSet -> Array CsvFile -> Validation Messages Unit
validateDatapointsFileGroup indicator pkeys ds csvfiles =
  case NEA.fromArray csvfiles of
    Nothing -> do
      vWarning $
        [ messageFromIssue
            $ Issue
            $ "No valid csv file for "
                <> (NES.toString indicator)
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

-- | take a list of csv files (They must have same indicator and primary keys)
-- | and produce datapoint input
validateDataPoints :: NonEmptyArray CsvFile -> Validation Messages (Maybe DataPoints)
validateDataPoints csvfiles = do
  let
    dpsResult =
      (sequence $ map createDataPointsInput csvfiles)
        `andThen`
          mergeDataPointsInput
        `andThen`
          parseDataPoints
  case toEither dpsResult of
    Left errs -> do
      emitErrorsAndContinue errs
      pure Nothing
    Right dps ->
      pure $ Just dps

validateDataPointsWithDataSet :: DataSet -> DataPoints -> Validation Messages Unit
validateDataPointsWithDataSet ds dps =
  let
    result = DataSet.parseDataPoints ds dps
  in
    case toEither result of
      Left errs ->
        emitErrorsAndContinue errs
      Right _ -> pure unit


validateCsvFileWithDataSet :: DataSet -> CsvFile -> Validation Messages Unit
validateCsvFileWithDataSet ds csvfile =
  let
    res = DataSet.parseCsvFileValues ds csvfile
  in
    case toEither res of
      Left errs ->
        emitWarningsAndContinue errs
      Right _ -> pure unit


-- Below are Validation for Warnings


-- | Warn if Csv Headers are not in concept list
validateCsvHeaders :: DataSet -> CsvFile -> Validation Messages Unit
validateCsvHeaders (DataSet ds) { csvContent, fileInfo } = do
  let
    headers = map unwrap $ csvContent.headers
    concepts = HM.keys ds.concepts
    reserved = map unwrap reservedConcepts
    filepath = FI.filepath fileInfo

  _ <- for headers
    ( \h -> do
        let
          hstr = NES.toString h
          predicate = (Str.take 4 hstr == "is--")
            || (h `Arr.elem` reserved)
            || (hstr `Arr.elem` concepts)
        when (not predicate)
          $ vWarning
          $
            [ setFile filepath <<< messageFromIssue
                $ Issue
                $ hstr <> " is not in concept list but it's in the header."
            ]
    )
  pure unit

-- | Warn if concept length is longer then 64 chars
validateConceptLength :: DataSet -> Validation Messages Unit
validateConceptLength (DataSet ds) = do
  let
    concepts = HM.values ds.concepts
    check concept =
      let
        (Tuple filepath row) = pathAndRow $ getInfo concept
      in
        withRowInfo filepath row
          $ Id.isLongerThan64Chars
          $ getId concept

    res = traverse check concepts

  case toEither res of
    Left errs -> do
      vWarning msgs
      where
      msgs = map messageFromIssue errs
    Right _ -> pure unit


