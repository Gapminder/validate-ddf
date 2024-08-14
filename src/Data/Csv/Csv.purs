module Data.Csv
  ( CsvRow(..)
  , RawCsvContent
  , createRawContent
  , filterBadRows
  , getLineNo
  , getRow
  , parseCsvContent
  , readCsv
  , readCsv'
  , readAndParseCsv
  )
  where

import Prelude

import Data.Array (head, length, partition, range, replicate, tail, take, zip)
import Data.DDF.Csv.FileInfo (FileInfo(..), filepath)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Sequence.NonEmpty (Seq)
import Data.Traversable (for_, sequence, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, invalid)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (logShow)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.Path (FilePath)

-- | CsvRow is a tuple of line number and row content
newtype CsvRow =
  CsvRow (Tuple Int (Array String))

instance showCsvRow :: Show CsvRow where
  show (CsvRow (Tuple i x)) =
    show rec
    where
    rec = { line: i, record: x }

derive instance newtypeCsvRow :: Newtype CsvRow _

-- | Split headers and data rows
type RawCsvContent =
  { headers :: Maybe (Array String)
  , rows :: Maybe (Array CsvRow)
  }

-- CsvContent: convert csv rows to columns

type CsvColumn = Array String

type CsvContent =
  { headers :: Array String
  , index :: Array Int
  , columns :: Array (Array String)
  }

foreign import parseCsvImpl :: String -> EffectFnAff (Array (Array String))

-- | Read entire csv
readCsv :: FilePath -> Aff (Array (Array String)) -- NOTE: this will not handle exceptions from the js side.
readCsv x = do
  csvContent <- readTextFile UTF8 x
  fromEffectFnAff $ parseCsvImpl csvContent

readCsv' :: FileInfo -> Aff (Array (Array String))
readCsv' = filepath >>> readCsv

getRow :: CsvRow -> (Array String)
getRow (CsvRow tpl) = snd tpl

getLineNo :: CsvRow -> Int
getLineNo (CsvRow tpl) = fst tpl

toCsvRow :: Array (Array String) -> Array CsvRow
toCsvRow [] = []
toCsvRow xs =
  let
    idxs = range 2 ((length xs) + 1) -- idx starts from 2, excluding header row

    tuples = zip idxs xs

    mkRow tpls = CsvRow tpls
  in
    map mkRow tuples

createRawContent :: (Array (Array String)) -> RawCsvContent
createRawContent recs = { headers: headers, rows: rows }
  where
  headers = head recs

  rows = toCsvRow <$> tail recs


-- | a function to filter bad rows from csv rows
filterBadRows :: RawCsvContent -> (Tuple (Array Int) RawCsvContent)
filterBadRows rcsv@{ headers, rows } = case headers of
  Nothing -> Tuple [] rcsv
  Just hs ->
    case rows of
      Nothing -> Tuple [] rcsv
      Just rs -> Tuple (map getLineNo no) {headers: headers, rows: Just yes}
        where
        headerLength = length hs
        func row =
          if (length $ getRow row) == headerLength then true
          else false
        {yes, no} = partition func rs


foreign import rowsToColumnsImpl :: Array (Array String) -> Array (Array String)

-- | parse csv content
-- | Note that the rowsToColumnsImpl function will fill undefined values with ''
-- | This happens when the length of data row is shorter than header row.
-- | So you should run filterBadRows first if you want to drop all bad rows.
parseCsvContent :: RawCsvContent -> CsvContent
parseCsvContent { headers, rows } = case headers of
  Nothing -> { headers: [], index: [], columns: [] }
  Just hs ->
    case rows of
      Nothing -> { headers: hs, index: [], columns: emptyCols }
        where
        emptyCols = replicate (length hs) []
      Just rs -> { headers: hs, index: idxs, columns: cols }
        where
          idxs = map getLineNo rs
          rowsData = map getRow rs
          cols = rowsToColumnsImpl rowsData

readAndParseCsv :: FilePath -> Aff CsvContent
readAndParseCsv fp = do
  rows <- readCsv fp
  let
    rawContent = createRawContent rows
    Tuple _ rawContent' = filterBadRows rawContent
  pure $ parseCsvContent rawContent'
