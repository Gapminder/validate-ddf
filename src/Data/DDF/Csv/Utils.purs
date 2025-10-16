module Data.DDF.Csv.Utils
  ( createConceptInput
  , createDataPointsInput
  , createEntityInput
  ) where

import Prelude

import Data.Array as A
import Data.Array as Arr
import Data.Array.NonEmpty as NEA
import Data.Array.NonEmpty.Internal (NonEmptyArray)
-- import Data.Csv (CsvRow(..), getLineNo, getRow)
import Data.DDF.Atoms.Header (Header(..))
import Data.DDF.Atoms.Header as Hd
import Data.DDF.Atoms.Identifier (Identifier, parseId')
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Concept (ConceptInput)
import Data.DDF.Csv.CsvFile (CsvColumn, CsvContent, CsvFile)
import Data.DDF.Csv.FileInfo (CollectionInfo(..), FileInfo(..))
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.DataPoint (DataPointsInput)
import Data.DDF.Entity (EntityInput)
import Data.DDF.Internal (iteminfo, pathAndRow)
import Data.List.NonEmpty (NonEmptyList)
import Data.List.NonEmpty as NEL
import Data.Map (Map)
import Data.Map as M
import Data.Map.Extra (lookupV, popV)
import Data.Maybe (Maybe(..), fromJust)
import Data.Set as Set
import Data.String.NonEmpty (NonEmptyString, toString)
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.Traversable (sequence)
import Data.Tuple (Tuple(..))
import Data.Validation.Issue (Issue(..), Issues, mkIssueWithMessage)
import Data.Validation.Registry (ErrorCode(..))
import Data.Validation.Semigroup (V, andThen, invalid)
import Partial.Unsafe (unsafePartial)
import Safe.Coerce (coerce)
import Utils (unsafeLookup)

-- Utils

-- | create ConceptInput for Concept parsing
createConceptInput
  :: CsvFile
  -> V Issues (Array ConceptInput)
createConceptInput { fileInfo, csvContent } =
  let
    fp = FI.filepath fileInfo
    { headers, index, columns } = csvContent
    rows = Arr.zip index $ (Arr.transpose <<< NEA.toArray) columns
    headers_ = map coerce (NEA.toArray headers)
  in
    case FI.collection fileInfo of
      FI.Concepts -> pure $ Arr.foldr func [] rows
        where
        func (Tuple idx row) acc =
          let
            rowMap = M.fromFoldable $ Arr.zip headers_ row
            -- we have validated the key column "concept" exist in csv parsing
            conceptId = unsafeLookup (Hd.unsafeCreate "concept") rowMap
            props = M.delete (Hd.unsafeCreate "concept") rowMap
            _info = Just $ iteminfo fp idx
          in
            Arr.snoc acc { conceptId, props, _info }
      _ -> invalid [ mkIssueWithMessage E_GENERAL $ "can not create concept input for " <> show fileInfo ]

-- | create EntityInput for Entity parsing
createEntityInput
  :: CsvFile
  -> V Issues (Array EntityInput)
createEntityInput { fileInfo, csvContent } =
  case FI.collection fileInfo of
    FI.Entities { domain, set } ->
      pure $ Arr.foldr go [] rows
      where
      { headers, index, columns } = csvContent
      fp = FI.filepath fileInfo
      rows = Arr.zip index $ (Arr.transpose <<< NEA.toArray) $ columns

      entityCol = case set of
        Nothing -> Header domain
        Just s ->
          if (Header s) `NEA.elem` headers then
            Header s
          else
            Header domain
      entityDomain = domain
      entitySet = set
      go (Tuple i row) acc =
        let
          propsMap = M.fromFoldable $ A.zip (NEA.toArray headers) row
          Tuple entityId props = unsafePartial $ fromJust $ M.pop entityCol propsMap
          _info = Just $ iteminfo fp i
        in
          Arr.snoc acc { entityId, entityDomain, entitySet, props, _info }
    _ -> invalid [ mkIssueWithMessage E_GENERAL $ "can not create entity input for " <> show fileInfo ]

-- | create DataPointsInput for DataPoint parsing
createDataPointsInput
  :: CsvFile
  -> V Issues DataPointsInput
createDataPointsInput { fileInfo, csvContent } =
  case FI.collection fileInfo of
    FI.DataPoints dp ->
      let
        { headers, index, columns } = csvContent
        { indicator, pkeys, constraints } = dp

        indicatorId = coerce indicator
        by = NEA.fromFoldable1 $ map coerce pkeys

        values = M.fromFoldable $ NEA.zip (map coerce headers) columns

        fp = FI.filepath fileInfo
        itemInfo = map (\x -> iteminfo fp x) index
      in
        pure { indicatorId, by, itemInfo, values }
    _ -> invalid [ mkIssueWithMessage E_GENERAL $ "can not create datapoint input for " <> show fileInfo ]
