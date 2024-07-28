-- | Definition of datapoint

module Data.DDF.DataPoint where

import Data.DDF.Atoms.Value
import Prelude

import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.DDF.Atoms.Header (Header)
import Data.DDF.Atoms.Identifier (Identifier, parseId, parseId')
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Csv.CsvFile (CsvFile)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.Internal (ItemInfo(..), pathAndRow)
import Data.Foldable (class Foldable, foldMap)
import Data.FoldableWithIndex (findMapWithIndex, foldlWithIndex)
import Data.Function (on)
import Data.List (List)
import Data.List as List
import Data.List.NonEmpty (NonEmptyList)
import Data.List.NonEmpty as NEL
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, over)
import Data.Sequence as Seq
import Data.Set (Set)
import Data.Set as Set
import Data.String as Str
import Data.String.NonEmpty (NonEmptyString, fromString, join1With, joinWith, toString)
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.Traversable (sequence, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues, withRowInfo)
import Data.Validation.Semigroup (V, andThen, invalid)
import Debug (trace)
import Partial.Unsafe (unsafeCrashWith, unsafePartial)
import Utils (dupsBy, dupsByL, findDups, findDupsL, unsafeIndex, unsafeLookup)

-- | Datapoints contain multidimensional data.
-- | Data in DDF is stored in key-value pairs called DataPoints.
-- | The key consists of two or more dimensions while the value consists of one indicators
newtype DataPoints = DataPoints
  { indicatorId :: Identifier
  , by :: NonEmptyArray Identifier  -- the primary keys. use `by` to make it consistent with filename pattern.
  -- values are store in columns. where the column order is [*by, indicatorId]
  -- we will parse all values later, for now they should just be strings.
  , values :: Map Identifier (Array String) 
  , itemInfo :: Array ItemInfo
  }

derive instance newtypeDataPoints :: Newtype DataPoints _

instance showDataPoints :: Show DataPoints where
  show (DataPoints { indicatorId, by, values }) =
    "Indicator " <> Id.value indicatorId 
    <> " by " <> (toString (join1With "," $ map Id.value1 by))
    <> "\n" <> "values: \n" <> keysLine <> "\n" <> samplesLines'
    where
    keys = M.keys values
    samples = List.transpose $ map List.fromFoldable $ map (Arr.take 5) $ M.values values
    keysLine = Str.joinWith "\t" $ map Id.value $ Arr.fromFoldable keys
    samplesLines = map (\x -> Str.joinWith "\t" $ Arr.fromFoldable x) samples
    samplesLines' = Str.joinWith "\n" $ Arr.fromFoldable samplesLines


datapoints :: 
  Identifier 
  -> NonEmptyArray Identifier 
  -> Map Identifier (Array String) 
  -> Array ItemInfo
  -> DataPoints
datapoints indicatorId by values itemInfo =
  DataPoints { indicatorId, by, values, itemInfo }


type DataPointsInput =
  { indicatorId :: Identifier  -- we read indicatorId from filenames, so it's valid already
  , by :: NonEmptyArray Identifier -- primary keys are also from filenames
  , values :: Map Identifier (Array String)  -- all data in columns.
  , itemInfo :: Array ItemInfo
  }

unsafeGetRow :: Array (Array String) -> Int -> (Array String)
unsafeGetRow xxs i = 
  map (flip unsafeIndex $ i) xxs


mergeDataPointsInput :: NonEmptyArray DataPointsInput -> V Issues DataPointsInput
mergeDataPointsInput inputs =
  let 
    { head, tail } = NEA.uncons inputs

    go x acc = 
      case acc of 
        Nothing -> Nothing
        Just acc' -> mergeTwoDataPointsInput acc' x
  in
    case Arr.foldr go (Just head) tail of
      Nothing -> invalid [ Issue "cannot merge datapoints inputs with different indicator id and keys" ]
      Just res -> pure res

mergeTwoDataPointsInput :: DataPointsInput -> DataPointsInput -> Maybe DataPointsInput
mergeTwoDataPointsInput a b =
  if (a.indicatorId == b.indicatorId) && (a.by == b.by) then
    let
      newvalues = M.unionWith (<>) a.values b.values
      newiteminfo = a.itemInfo <> b.itemInfo
    in 
      Just { indicatorId: a.indicatorId, by: a.by, values: newvalues, itemInfo: newiteminfo }
  else
    Nothing


-- | check if provided headers match actual data columns.
-- | this is redundant check because we have checked in csv parsing steps.
headersMatchesData 
  :: Set Identifier
  -> Set Identifier
  -> V Issues Unit
headersMatchesData expected actual = 
  if expected == actual then
    pure unit
  else
    invalid [Issue $ "headers mismatch" ]

-- | only need to test one thing: duplicated rows.
parseDataPoints :: DataPointsInput -> V Issues DataPoints
parseDataPoints input@{ indicatorId, by, values, itemInfo } =
  let
    expectedCols = Set.fromFoldable $ NEA.snoc by indicatorId
    actualCols = M.keys values
  in
    headersMatchesData expectedCols actualCols
      `andThen`
    (\_ -> case findDupsForColumns by values of 
      [] -> pure $ datapoints indicatorId by values itemInfo
      dups -> invalid issues
        where
        items = map (unsafeIndex itemInfo) dups
        mkissue info =
          let
            (Tuple fp row) = pathAndRow info
          in
            InvalidItem fp row "Duplicated datapoints"
        issues = map mkissue items
    )
  
findDupsForColumns :: NonEmptyArray Identifier -> Map Identifier (Array String) -> Array Int
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

