-- | This module defines csv files in DDF csv model.
-- | Files are in csv format with a mandatory header row on the first line.
-- | And the file name should reflect what are primary keys in the file, so they must exist
-- | Note that the parser in this module don't check values in the csv rows other than headers.
module Data.DDF.Csv.CsvFile
  ( CsvContent
  , CsvFile
  , CsvFileInput
  , CsvColumn
  , UnvalidatedCsvContent
  , parseCsvFile
  , getPrimaryKey
  , getPrimaryKeyAndValues
  ) where

import Prelude
import StringParser

import Control.Alt ((<|>))
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray, nub)
import Data.Array.NonEmpty as NEA
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.DDF.Atoms.Header (Header, headerVal, parseEntityHeader, parseGeneralHeader)
import Data.DDF.Atoms.Header as Hd
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Csv.FileInfo (CollectionInfo(..), DP, FileInfo(..), parseFileInfo)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.Csv.FileInfo as FileInfo
import Data.Either (Either(..), fromLeft, fromRight, isLeft)
import Data.Function (on)
import Data.Generic.Rep (class Generic)
import Data.List (List)
import Data.List as List
import Data.List.NonEmpty as NEL
import Data.List.Types (NonEmptyList)
import Data.Map (Map(..))
import Data.Map as Map
import Data.Maybe (Maybe(..), fromJust)
import Data.Newtype (class Newtype, unwrap)
import Data.Sequence (Seq)
import Data.Sequence as Sq
import Data.Set as S
import Data.Set as Set
import Data.Show.Generic (genericShow)
import Data.String as Str
import Data.String.NonEmpty (join1With, toString)
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.String.Utils (startsWith)
import Data.Traversable (class Foldable, sequence, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues, updateFilePath)
import Data.Validation.Semigroup (V, andThen, invalid, isValid, toEither)
import Data.Validation.ValidationT (Validation, vError, vWarning)
import Debug (trace, traceTime)
import Node.Path (FilePath)
import Partial.Unsafe (unsafeCrashWith, unsafePartial)
import Safe.Coerce (coerce)
import Utils (findDupsL, unsafeIndex, unsafeLookup)

-- FIXME: use newtype
-- | csv file combines file name info and file content
type CsvFile =
  { fileInfo :: FileInfo -- the info come from file name
  , csvContent :: CsvContent -- the data come from file content
  }

type CsvColumn = Array String

-- | CsvContent is the data read from a csv file.
type CsvContent =
  { headers :: NonEmptyArray Header -- must have header
  , index :: Array Int
  , columns :: NonEmptyArray CsvColumn -- must be same length of headers
  }

-- | input data
type UnvalidatedCsvContent =
  { headers :: Array String
  , index :: Array Int
  , columns :: Array (Array String)
  }

type CsvFileInput =
  { fileInfo :: FileInfo
  , csvContent :: UnvalidatedCsvContent
  }

-- | intermediate type for validating csv content
type NonEmptyRawCsvContent' =
  { headers :: NonEmptyArray String
  , index :: Array Int
  , columns :: NonEmptyArray CsvColumn
  }

-- | intermediate type for validating csv content
type NonEmptyRawCsvContent =
  { headers :: NonEmptyArray Header
  , index :: Array Int
  , columns :: NonEmptyArray CsvColumn
  }

-- getters / setters
mkCsvContent :: NonEmptyArray Header -> Array Int -> NonEmptyArray CsvColumn -> CsvContent
mkCsvContent headers index columns = { headers, index, columns }

mkCsvFile :: FileInfo -> CsvContent -> CsvFile
mkCsvFile fileInfo csvContent = { fileInfo, csvContent }

getCsvContent :: CsvFile -> CsvContent
getCsvContent { csvContent } = csvContent

getFileInfo :: CsvFile -> FileInfo
getFileInfo { fileInfo } = fileInfo

getPrimaryKey :: CsvFile -> NonEmptyArray NonEmptyString
getPrimaryKey { fileInfo, csvContent } =
  case FI.collection fileInfo of
    FI.Concepts -> NEA.singleton $ unsafePartial $ NES.unsafeFromString "concept"
    FI.Entities { domain, set } -> case set of
      Nothing -> NEA.singleton domain
      Just s ->
        if s `NEA.elem` headers' then
          NEA.singleton s
        else
          NEA.singleton domain
    FI.DataPoints dp -> NEA.fromFoldable1 dp.pkeys
    FI.Synonyms x -> NEA.snoc' [ (unsafePartial $ NES.unsafeFromString "concept") ] $ x
    FI.Translations _ -> unsafeCrashWith "do not gererate resources for translation files."
    FI.Other x -> NEA.singleton x
  where
  { headers } = csvContent
  headers' = map unwrap headers

getPrimaryKeyAndValues :: CsvFile -> Tuple (NonEmptyArray NonEmptyString) (Array NonEmptyString)
getPrimaryKeyAndValues csvfile@{ csvContent } =
  let
    pkeys = getPrimaryKey csvfile
    headers = map unwrap $ _.headers csvContent
    values = NEA.difference headers pkeys
  in
    Tuple pkeys values

-- below are functions to parse from CsvFileInput -> CsvFile
--
-- | function that checks if first list is subset of second list
-- | use this to check if required columns are existed.
hasCols :: forall t a. Foldable t => Ord a => Eq a => t a -> t a -> Boolean
hasCols expected actual =
  let
    expectedSet = S.fromFoldable expected

    actualSet = S.fromFoldable actual
  in
    S.subset expectedSet actualSet

-- | check if csv file has headers
notEmptyCsv :: UnvalidatedCsvContent -> V Issues NonEmptyRawCsvContent'
notEmptyCsv input =
  let
    headers' = NEA.fromArray input.headers
    columns' = NEA.fromArray input.columns
  in
    case (Tuple headers' columns') of
      (Tuple (Just hs) (Just cs)) ->
        if NEA.length hs == NEA.length cs then
          pure { headers: hs, index: input.index, columns: cs }
        else
          invalid [ InvalidCSV "header length doesn't match column length" ]
      (Tuple (Just hs) Nothing) ->
        pure { headers: hs, index: input.index, columns: NEA.replicate (NEA.length hs) [] }
      _ -> invalid [ InvalidCSV "Empty Csv. You should at least put headers in the file." ]

-- | check all columns are valid identifiers
colsAreValidIds :: NonEmptyRawCsvContent' -> V Issues NonEmptyRawCsvContent
colsAreValidIds input =
  let
    res = sequence $ map parseGeneralHeader input.headers
  in
    case toEither res of
      Right hs ->
        let
          headerValues = map headerVal hs

          is_headers = NEA.filter (startsWith "is--" <<< toString) headerValues
        in
          case is_headers of
            [] -> pure $ input { headers = hs }
            xs -> invalid [ InvalidCSV $ "these headers are not valid Ids: " <> show xs ]
      Left errs -> invalid errs

-- | check all columns are valid headers (including is-- headers)
colsAreValidHeaders :: NonEmptyRawCsvContent' -> V Issues NonEmptyRawCsvContent
colsAreValidHeaders input =
  let
    res = sequence $ map parseEntityHeader input.headers
  in
    case toEither res of
      Right hs -> pure $ input { headers = hs }
      Left errs -> invalid errs

-- | check required headers
headersExists :: Array String -> NonEmptyRawCsvContent -> V Issues NonEmptyRawCsvContent
headersExists expected csvcontent =
  let
    -- requiredFields = A.fromFoldable expected
    actual = map (headerVal >>> toString) $ Arr.fromFoldable csvcontent.headers
  in
    if hasCols expected actual then
      pure csvcontent
    else
      invalid [ InvalidCSV $ "file MUST have following field: " <> show expected ]

-- | check if one and only one of the headers exists. Also return the matched header
oneOfHeaderExists :: Array String -> NonEmptyRawCsvContent -> V Issues (Tuple String NonEmptyRawCsvContent)
oneOfHeaderExists expected csvcontent =
  let
    actual = map (headerVal >>> toString) $ Arr.fromFoldable csvcontent.headers

    intersection = Arr.intersect expected actual
  in
    if Arr.length intersection /= 1 then
      invalid [ InvalidCSV $ "file MUST have one and only one of follwoing field: " <> show expected ]
    else
      pure $ Tuple (unsafeIndex intersection 0) csvcontent

-- | check if csv file has duplicated headers
noDupCols :: NonEmptyRawCsvContent -> V Issues NonEmptyRawCsvContent
noDupCols input =
  if nub input.headers == input.headers then
    pure input
  else
    let
      counter = map (\x -> (Tuple (NEA.head x) (NEA.length x))) <<< NEA.group <<< NEA.sort $ input.headers

      dups = NEA.filter (\x -> (snd x) > 1) counter
    in
      invalid [ InvalidCSV $ "duplicated headers: " <> show dups ]

-- | check datapoints columns constrains
constrainsAreMet :: FilePath -> DP -> NonEmptyRawCsvContent -> V Issues NonEmptyRawCsvContent
constrainsAreMet fp { pkeys, constrains } input@{ headers, columns, index } =
  let
    constrainsMap = Map.fromFoldable $ NEL.zip pkeys constrains
    columnMap = Map.fromFoldable $ NEA.zip (map headerVal headers) columns
    -- only keep pkeys columns
    columnMap' = Map.filterKeys (\k -> k `NEL.elem` pkeys) columnMap
    -- Maps are ordered so we can just zip their values
    res = List.zipWith checkOneColumn (Map.values constrainsMap) (Map.values columnMap')
  in
    case Arr.concat $ Arr.fromFoldable res of
      [] -> pure input
      xs ->
        let
          mkissue (Tuple i x) =
            let
              row = unsafeIndex index i
              msg = "constrain violation: " <> x
            in
              InvalidItem fp row msg
        in
          invalid $ mkissue <$> xs

findInvalid :: CsvColumn -> String -> Int
findInvalid col x = unsafePartial $ fromJust $ Arr.elemIndex x col

checkOneColumn :: Maybe NonEmptyString -> CsvColumn -> Array (Tuple Int String)
checkOneColumn val col =
  case val of
    Nothing -> []
    Just v ->
      let
        res = Set.difference (Set.fromFoldable col) (Set.singleton $ toString v)
      in
        if Set.isEmpty res then
          []
        else
          -- Note: this will only return the first row of invalid value.
          Arr.fromFoldable $ Set.map (\x -> Tuple (findInvalid col x) x) res

-- | check duplicated keys in csv.
noDuplicatedByKey :: String -> FileInfo -> NonEmptyRawCsvContent -> V Issues NonEmptyRawCsvContent
noDuplicatedByKey key fileInfo input@{ headers, columns, index } =
  let
    header = Hd.unsafeCreate key
    keys = NEA.singleton header
    columnMap = Map.fromFoldable (NEA.zip headers columns)
    dups = findDupsForColumns keys columnMap
  in
    case dups of
      [] -> pure input
      xs -> invalid $ mkIssue <$> xs
        where
        fp = FI.filepath fileInfo
        mkIssue x =
          InvalidItem fp row msg
          where
          val = unsafeIndex (unsafeLookup header columnMap) x
          row = unsafeIndex index x
          msg = "Duplicated " <> key <> ": " <> val

-- | check duplicated keys in csv.
noDuplicatedByKeys :: NonEmptyArray String -> FileInfo -> NonEmptyRawCsvContent -> V Issues NonEmptyRawCsvContent
noDuplicatedByKeys keys fileInfo input@{ headers, columns, index } =
  let
    columnMap = Map.fromFoldable (NEA.zip headers columns)
    keyHeaders = (map Hd.unsafeCreate keys)
    dups = findDupsForColumns keyHeaders columnMap
  in
    case dups of
      [] -> pure input
      xs -> invalid $ mkIssue <$> xs
        where
        fp = FI.filepath fileInfo
        mkIssue x =
          InvalidItem fp row msg
          where
          row = unsafeIndex index x
          vals = map (\col -> unsafeIndex col x) $ map (\k -> unsafeLookup k columnMap) keyHeaders
          valsStr = Str.joinWith "," $ NEA.toArray vals
          msg = "Duplicated key combination: " <> valsStr

findDupsForColumns :: NonEmptyArray Header -> Map Header (Array String) -> Array Int
findDupsForColumns headers values =
  let
    colsToCheck = map (\h -> unsafeLookup h values) headers
    size = Arr.length $ NEA.head colsToCheck
    range = Arr.range 0 size

    func a b = a <> "," <> b
    sortingKeys = Arr.sort $ Arr.zip (NEA.foldl1 (Arr.zipWith func) colsToCheck) range
    dups = findDupsL (compare `on` fst) $ List.fromFoldable sortingKeys
  in
    Arr.fromFoldable $ map snd dups

-- | main validation entry point
-- | 1. check if the primary key column exists
-- | 2. check if all columns are valid headers
-- | 3. check if columns have duplicates
-- | 4. check if csv content has duplicated rows by key columns.
parseCsvFile :: CsvFileInput -> V Issues CsvFile
parseCsvFile { fileInfo, csvContent } =
  case FileInfo.collection fileInfo of
    Concepts ->
      let
        required = [ "concept" ]

        vc =
          notEmptyCsv csvContent
            `andThen`
              colsAreValidIds
            `andThen`
              noDupCols
            `andThen`
              headersExists required
            `andThen`
              noDuplicatedByKey "concept" fileInfo
      in
        mkCsvFile <$> pure fileInfo <*> vc
    Entities { domain, set } ->
      let
        required = case set of
          Just s -> [ toString s, toString domain ]
          Nothing -> [ toString domain ]

        vc =
          notEmptyCsv csvContent
            `andThen`
              colsAreValidHeaders -- Identifier + is--identifier headers
            `andThen`
              noDupCols
            `andThen`
              oneOfHeaderExists required
            `andThen`
              (\(Tuple key c) -> noDuplicatedByKey key fileInfo c)
      in
        mkCsvFile <$> pure fileInfo <*> vc
    DataPoints dp ->
      let
        keysArr = NEA.fromFoldable1 (toString <$> dp.pkeys)
        required = [ toString dp.indicator ] <> (NEA.toArray keysArr)
        fp = FI.filepath fileInfo

        vc =
          notEmptyCsv csvContent
            `andThen`
              colsAreValidIds
            `andThen`
              noDupCols
            `andThen`
              headersExists required
            `andThen`
              constrainsAreMet fp dp
            `andThen`
              noDuplicatedByKeys keysArr fileInfo
      in
        mkCsvFile <$> pure fileInfo <*> vc
    Synonyms concept ->
      let
        required = [ "synonym", toString concept ]
        vc =
          notEmptyCsv csvContent
            `andThen`
              colsAreValidIds
            `andThen`
              noDupCols
            `andThen`
              headersExists required
            `andThen`
              noDuplicatedByKey "synonym" fileInfo
      in
        mkCsvFile <$> pure fileInfo <*> vc
    Translations target ->
      parseFileInfo "./" target.path
        `andThen`
          -- validate base on the inner fileinfo.
          ( \fi -> case FI.collection fi of
              -- invalid: translation of translation
              Translations _ -> invalid [ Issue $ FI.filepath fileInfo <> ": translation of translation is not allowed" ]
              _ -> parseCsvFile { fileInfo: fi, csvContent: csvContent }
          )
        `andThen` -- we will use the parsed csv content and the original fileinfo
          (\{ csvContent: vc } -> pure $ mkCsvFile fileInfo vc)
    otherwise -> invalid [ NotImplemented ]