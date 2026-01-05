module Data.DataPackage where

import Prelude

import Data.Array ((:))
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Csv (foldRows, readAndParseCsv)
import Data.DDF.Concept as Concept
import Data.DDF.DataSet (DataSet(..), genSetMemberships, getDomainForEntitySet)
import Data.DDF.DataSet as DataSet
import Data.Function (on)
import Data.HashMap as HM
import Data.HashSet (HashSet)
import Data.HashSet as HS
import Data.JSDate (now, toISOString, toUTCString)
import Data.JSON.DataPackage (DataPackage, DdfSchema, Resource, makeDdfSchema)
import Data.List (List)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromJust)
import Data.Nullable (Nullable, notNull, null)
import Data.Set (Set)
import Data.Set as Set
import Data.String.NonEmpty as NES
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..), snd)
import Debug (trace, traceTime)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Node.Encoding as Encoding
import Node.FS.Aff (readTextFile)
import Node.FS.Sync (exists)
import Node.Path (FilePath)
import Node.Path as PATH
import Partial.Unsafe (unsafeCrashWith, unsafePartial)
import Yoga.JSON as JSON

empty :: DataPackage
empty =
  { name: Nothing
  , title: Nothing
  , description: Nothing
  , author: Nothing
  , license: Nothing
  , language: Just { "id": "en-US", "name": Just "English" }
  , created: Nothing
  , translations: Nothing
  , version: Nothing
  -- below are calculated from all files
  , resources: []
  , ddfSchema:
      { concepts: []
      , entities: []
      , datapoints: []
      , synonyms: []
      }
  }

-- TODO: add a way to do a basic validation and then create datapackage. It will be faster to run.

-- | generate datapackage
generateDataPackage :: FilePath -> DataSet -> Array Resource -> Aff DataPackage
generateDataPackage root dataset resources = do
  -- read existing datapackage
  let
    dpPath = PATH.concat [ root, "datapackage.json" ]

  origDP <- (liftEffect $ exists dpPath) >>= \r -> case r of
    true -> do
      content <- readTextFile Encoding.UTF8 dpPath
      case JSON.readJSON_ content of
        Nothing -> pure empty
        Just x -> pure x
    false -> pure empty

  created <- liftEffect $ now >>= toISOString

  let
    ddfSchema =
      { concepts: []
      , entities: []
      , datapoints: []
      , synonyms: []
      }
    -- setMemberships cache
    setMemberships = genSetMemberships dataset

    -- a function to query primary key availablity
    whichSets :: DataSet -> String -> String -> Maybe (Array String)
    whichSets ds conceptName value =
      if conceptName == "concept" then Just $ Arr.singleton "concept"
      else do
        concept <- DataSet.getConcept ds conceptName
        case Concept.getType concept of
          ct
            | ct `Arr.elem` [ Concept.EntityDomainC, Concept.EntitySetC ] -> do
                domainName <- DataSet.getDomainForEntitySet ds conceptName
                subMap <- HM.lookup domainName setMemberships
                res <- HM.lookup value subMap
                pure $ Arr.fromFoldable res
            | otherwise -> pure $ Arr.singleton conceptName

    -- a function to extract possible combinations from entitysets from csv row
    getPkeyCombinations
      :: Array String
      -> (Map String String)
      -> (Tuple (HashSet (List String)) (HashSet (Array String)))
      -> (Tuple (HashSet (List String)) (HashSet (Array String)))
    getPkeyCombinations keys rowMap acc =
      let
        Tuple seenValues res = acc
        filtered = Map.filterKeys (\x -> x `Arr.elem` keys) rowMap
        values = Map.values filtered
      in
        case values `HS.member` seenValues of
          true -> acc
          false ->
            let
              seenValues' = HS.insert values seenValues
              possibleKeys = Map.mapMaybeWithKey (\k v -> whichSets dataset k v) filtered
              -- TODO: improve below
              t = Arr.fromFoldable $ Map.values possibleKeys
              allCombinations = HS.fromArray $ permutations t
              res' = res <> allCombinations
            in
              Tuple seenValues' res'

    -- a function to run on every csv resource
    func schemaAcc res = do
      let
        fullPath = PATH.concat [ root, NES.toString res.path ]
      csvContent@{ headers, columns } <- readAndParseCsv fullPath

      let
        primaryKeys = map NES.toString $ NEA.toArray res.schema.primaryKey
        { yes, no } = Arr.partition (isDomainOrSet dataset) primaryKeys
        -- csvContent' = case dropDuplicatesBy csvContent yes of
        --   Nothing -> csvContent
        --   Just x -> x
        values = case Arr.difference headers primaryKeys of
          [] -> [ null ]
          xs -> map notNull xs
        resName = NES.toString res.name
        combinationsForEntityDomains =
          if Arr.length yes == 0 then HS.empty
          else
            snd $
              foldRows csvContent
                ( \row acc ->
                    getPkeyCombinations yes row acc
                )
                (Tuple HS.empty HS.empty)
        t1 = Arr.fromFoldable $ combinationsForEntityDomains
        t2 = permutations $ Arr.mapMaybe (\x -> whichSets dataset x "") $ no
        allCombinations = permConcat t1 t2
        schema = (\pk v -> makeDdfSchema pk v [ resName ]) <$> allCombinations <*> values

      case primaryKeys of
        [ "concept" ] -> pure schemaAcc { concepts = (Arr.fromFoldable schema) <> schemaAcc.concepts }
        [ _ ] -> pure schemaAcc { entities = (Arr.fromFoldable schema) <> schemaAcc.entities }
        [ a, b ]
          | (a == "synonym" || b == "synonym") -> pure schemaAcc
              { synonyms = (Arr.fromFoldable schema) <> schemaAcc.synonyms }
        otherwise -> pure schemaAcc { datapoints = (Arr.fromFoldable schema) <> schemaAcc.datapoints }

  ddfSchema' <- Arr.foldM func ddfSchema resources
  let
    ddfSchemaRes =
      { concepts: groupByAndMergeSchema ddfSchema'.concepts
      , entities: groupByAndMergeSchema ddfSchema'.entities
      , datapoints: groupByAndMergeSchema ddfSchema'.datapoints
      , synonyms: groupByAndMergeSchema ddfSchema'.synonyms
      }

  pure origDP { created = Just created, resources = resources, ddfSchema = ddfSchemaRes }

groupByAndMergeSchema :: Array DdfSchema -> Array DdfSchema
groupByAndMergeSchema xs =
  let
    groupKey { primaryKey, value } = { primaryKey, value }
    groups = Arr.groupAllBy (compare `on` groupKey) xs
    merge schemas =
      let
        { primaryKey, value } = NEA.head schemas
        resources = map _.resources schemas
        resources' = Arr.concat $ NEA.toArray resources
      in
        makeDdfSchema primaryKey value resources'
  in
    map merge groups

isDomainOrSet :: DataSet -> String -> Boolean
isDomainOrSet dataset concept =
  let
    conceptType = do
      theConcept <- DataSet.getConcept dataset concept
      pure $ Concept.getType theConcept
  in
    case conceptType of
      Just Concept.EntityDomainC -> true
      Just Concept.EntitySetC -> true
      _ -> false

permutations :: forall a. Array (Array a) -> Array (Array a)
permutations xss = case Arr.unsnoc xss of
  Nothing -> [ [] ]
  Just { init, last } -> do
    x <- last
    ys <- permutations init
    pure $ Arr.snoc ys x

permConcat :: forall a. Array (Array a) -> Array (Array a) -> Array (Array a)
permConcat xs [] = xs
permConcat [] ys = ys
permConcat xs ys = do
  x <- xs
  y <- ys
  pure $ x <> y
