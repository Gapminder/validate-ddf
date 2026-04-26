module Data.Csv
  ( CsvColumn
  , FormatIssue(..)
  , RawCsvContent
  , foldRows
  , parseCsvContent
  , parseFormatIssues
  , readAndParseCsv
  , readCsv
  , readCsv'
  , iterRows
  , myTest
  ) where

import Prelude

import Control.Promise (Promise, toAff, toAffE)
import Data.Array as Arr
import Data.Array.NonEmpty as NEA
import Data.DDF.Csv.FileInfo (FileInfo(..), filepath)
import Data.Function (on)
import Data.List (List)
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromJust)
import Data.Newtype (class Newtype)
import Data.Set as Set
import Data.Traversable (for, for_, sequence, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, invalid)
import Debug (trace, traceTime)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (logShow)
import Effect.Console (log)
import Foreign (Foreign, unsafeFromForeign)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile)
import Node.Path (FilePath)
import Partial.Unsafe (unsafePartial)
import Utils (findDupsL, unsafeLookup)
import Yoga.JSON as JSON

-- | Type of byte-level format issue found in a CSV file.
data FormatIssue = BOM | CRLF | ENCODING

derive instance Eq FormatIssue
derive instance Ord FormatIssue
instance Show FormatIssue where
  show BOM = "BOM"
  show CRLF = "CRLF"
  show ENCODING = "ENCODING"

-- | Parse a raw format issue string from the FFI into a FormatIssue.
parseFormatIssues :: Array String -> Array FormatIssue
parseFormatIssues = Arr.catMaybes <<< map fromString
  where
  fromString = case _ of
    "BOM" -> Just BOM
    "CRLF" -> Just CRLF
    "ENCODING" -> Just ENCODING
    _ -> Nothing

-- | we will use array of columns to store csv data
type CsvColumn = Array String

-- | this is the type we get from csv parsing FFI function
type RawCsvContent =
  { headers :: Array String
  , index :: Array Int
  , columns :: Array CsvColumn
  , badrows :: Array { lineNo :: Int, expected :: Int, actual :: Int }
  , formatIssues :: Array String
  }

-- CsvContent
type CsvContent =
  { headers :: Array String
  , index :: Array Int
  , columns :: Array CsvColumn
  }

-- important: Please make sure the return type match RawCsvContent as there are no parsing here
foreign import parseCsvImpl :: String -> Boolean -> Effect (Promise Foreign)

-- | Read entire csv. Pass fixFormat=true to auto-fix BOM/CRLF in place.
readCsv :: FilePath -> Boolean -> Aff RawCsvContent
readCsv path fixFormat = do
  f <- toAffE $ parseCsvImpl path fixFormat
  pure $ unsafeFromForeign f

readCsv' :: Boolean -> FileInfo -> Aff RawCsvContent
readCsv' fixFormat = filepath >>> flip readCsv fixFormat

foreign import rowsToColumnsImpl :: Array (Array String) -> Array (Array String)

parseCsvContent :: RawCsvContent -> CsvContent
parseCsvContent { headers, index, columns } = { headers, index, columns }

-- | read and parse the csv file. if fixFormat=True, it will fix format issues in place.
readAndParseCsv :: FilePath -> Boolean -> Aff CsvContent
readAndParseCsv fp fixFormat = do
  csv <- readCsv fp fixFormat
  pure $ parseCsvContent csv

-- | iter each row on a function
iterRows :: forall a. CsvContent -> ((Map String String) -> a) -> Array a
iterRows { headers, columns, index } func =
  case Arr.length index of
    0 -> [] -- empty file, return empty array
    n ->
      let
        func' i =
          let
            xs = map (\c -> unsafePartial $ Arr.unsafeIndex c i) columns
            rowmap = Map.fromFoldable $ Arr.zip headers xs
          in
            func rowmap
        idxs = Arr.range 0 (n - 1)
      in
        map func' idxs

-- | fold over each row
foldRows :: forall a. CsvContent -> ((Map String String) -> a -> a) -> a -> a
foldRows { headers, columns, index } func a =
  case Arr.length index of
    0 -> a -- empty file, return initial accumulator
    n ->
      let
        func' i acc =
          let
            xs = map (\c -> unsafePartial $ Arr.unsafeIndex c i) columns
            rowmap = Map.fromFoldable $ Arr.zip headers xs
          in
            func rowmap acc
        idxs = Arr.range 0 (n - 1)
      in
        Arr.foldr func' a idxs

-- TODO: good to implement some common operators, such as drop duplicates

-- for testing
myTest :: Effect Unit
myTest = launchAff_ do
  c <- readCsv
    "/home/semio/src/work/gapminder/datasets/repo/github.com/open-numbers/ddf--open_numbers/ddf--synonyms--geo.csv"
    false
  liftEffect $ logShow c.badrows
