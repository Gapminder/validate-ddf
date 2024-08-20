module Data.Csv
  ( CsvColumn
  , RawCsvContent
  , foldRows
  , parseCsvContent
  , readAndParseCsv
  , readCsv
  , readCsv'
  , iterRows
  , myTest
  ) where

import Prelude

import Control.Promise (Promise, toAff, toAffE)
import Data.Array (head, length, partition, range, replicate, tail, take, zip)
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


-- | we will use array of columns to store csv data
type CsvColumn = Array String

-- | this is the type we get from csv parsing FFI function
type RawCsvContent =
  { headers :: Array String
  , index :: Array Int
  , columns :: Array CsvColumn
  , badrows :: Array Int
  }

-- CsvContent
type CsvContent =
  { headers :: Array String
  , index :: Array Int
  , columns :: Array CsvColumn
  }

-- improtant: Please make sure the return type match RawCsvContent as there are no parsing here
foreign import parseCsvImpl :: String -> Effect (Promise Foreign)

-- | Read entire csv
readCsv :: FilePath -> Aff RawCsvContent
readCsv path = do
  f <- toAffE $ parseCsvImpl path
  pure $ unsafeFromForeign f

readCsv' :: FileInfo -> Aff RawCsvContent
readCsv' = filepath >>> readCsv

foreign import rowsToColumnsImpl :: Array (Array String) -> Array (Array String)

parseCsvContent :: RawCsvContent -> CsvContent
parseCsvContent { headers, index, columns } = { headers, index, columns }

readAndParseCsv :: FilePath -> Aff CsvContent
readAndParseCsv fp = do
  csv <- readCsv fp
  pure $ parseCsvContent csv

-- | iter each row on a function
iterRows :: forall a. CsvContent -> ((Map String String) -> a) -> Array a
iterRows { headers, columns, index } func =
  let
    func' i =
      let
        xs = map (\c -> unsafePartial $ Arr.unsafeIndex c i) columns
        rowmap = Map.fromFoldable $ Arr.zip headers xs
      in
        func rowmap
    idxs = Arr.range 0 $ (Arr.length index) - 1
  in
    map func' idxs

-- | fold over each row
foldRows :: forall a. CsvContent -> ((Map String String) -> a -> a) -> a -> a
foldRows { headers, columns, index } func a =
  let
    func' i acc =
      let
        xs = map (\c -> unsafePartial $ Arr.unsafeIndex c i) columns
        rowmap = Map.fromFoldable $ Arr.zip headers xs
      in
        func rowmap acc
    idxs = Arr.range 0 $ (Arr.length index) - 1
  in
    Arr.foldr func' a idxs

-- TODO: good to implement some common operators, such as drop duplicates

-- for testing
myTest :: Effect Unit
myTest = launchAff_ do
  c <- readCsv "/home/semio/src/work/gapminder/datasets/repo/github.com/open-numbers/ddf--open_numbers/ddf--synonyms--geo.csv"
  liftEffect $ logShow c.badrows
