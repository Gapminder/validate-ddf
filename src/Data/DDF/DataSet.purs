-- | DataSet consists of Concepts, Entities and DataPoints.
-- | The DataSet type in this module uses Hashmap for better performance
-- | please check the parseConcepts/parseEntities/parseDataPoints methods
-- | for validation rules.

module Data.DDF.DataSet
  ( ConceptDB
  , DataPointsDB
  , DataSet(..)
  , EntityDB
  , ValueParser
  , ValueParserDB
  , basedataset
  , genSetMemberships
  , getConcept
  , getConcepts
  , getDomainForEntitySet
  , getEntities
  , parseBaseDataSet
  , parseConcepts
  , parseCsvFileValues
  , parseDataPoints
  , parseEntityDomains
  , queryDomainAndSet
  ) where

import Data.DDF.Atoms.Value
import Prelude

import Control.Monad.ST as ST
import Control.Monad.ST.Internal as STI
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Bifunctor (lmap)
import Data.DDF.Atoms.Header (headerVal)
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Atoms.Value as Value
import Data.DDF.Concept (Concept(..), ConceptType(..))
import Data.DDF.Concept as Conc
import Data.DDF.Csv.CsvFile (CsvFile)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.DataPoint (DataPoints(..))
import Data.DDF.Entity (Entity(..), getEntitySets)
import Data.DDF.Entity as Ent
import Data.DDF.Internal (ItemInfo, pathAndRow)
import Data.Either (Either(..))
import Data.Function (on)
import Data.HashMap (HashMap)
import Data.HashMap as HM
import Data.HashSet (HashSet)
import Data.HashSet as HS
import Data.Hashable (class Hashable)
import Data.List.NonEmpty (NonEmptyList)
import Data.List.NonEmpty as NEL
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromJust)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.String.NonEmpty (toString)
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.String.Utils as Str
import Data.Traversable (for, for_, sequence, sequence_, traverse, traverse_)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues, mkIssue, mkIssueWithMessage, toInvaildItem, updateMessage, withConceptField, withEntity, withFileLocation, withRowInfo)
import Data.Validation.Registry (ErrorCode(..))
import Data.Validation.Semigroup (V, andThen, invalid, isValid, toEither, validation)
import Debug (trace)
import Node.Path (FilePath)
import Partial.Unsafe (unsafeCrashWith, unsafePartial)
import Utils (dupsBy, unsafeIndex, unsafeLookup)

type ConceptDB = HashMap String Concept
type EntityDB = HashMap String (Array Entity)
type DataPointsDB = HashMap (Tuple String (Set String)) DataPoints
-- | ValueParser is a function to parse a value in this dataset.
type ValueParser = String -> (V Issues Value)
type ValueParserDB = HashMap String ValueParser

newtype DataSet =
  DataSet
    { concepts :: ConceptDB
    , entities :: EntityDB
    , datapoints :: DataPointsDB
    , _valueParsers :: ValueParserDB
    }

derive instance newtypeDataSet :: Newtype DataSet _

instance showDataSet :: Show DataSet where
  show (DataSet x) =
    "concepts: \n"
      <> show x.concepts
      <> "\nentities: \n"
      <> show x.entities

getConcept :: DataSet -> String -> Maybe Concept
getConcept (DataSet { concepts }) k = HM.lookup k concepts

getConcepts :: DataSet -> ConceptDB
getConcepts (DataSet x) = x.concepts

getEntities :: DataSet -> String -> Maybe String -> Maybe (Array Entity)
getEntities (DataSet { entities }) domain Nothing =
  HM.lookup domain entities
getEntities (DataSet { entities }) domain (Just set) =
  case HM.lookup domain entities of
    Nothing -> Nothing
    Just es ->
      -- build a map of entity name -> array of entity set names
      let
        entitySetsOfEntities = map (\e -> Tuple e (map Id.value $ Ent.getEntitySets e)) es
        filtered = Arr.filter (\x -> set `Arr.elem` (snd x)) entitySetsOfEntities
      in
        Just $ map fst filtered

-- FIXME: I should use NonEmptyStrings here and the above functions
getDomainForEntitySet :: DataSet -> String -> Maybe String
getDomainForEntitySet dataset k = do
  theConcept <- getConcept dataset k
  if Conc.getType theConcept == Conc.EntityDomainC then
    pure $ Conc.getId >>> Id.value $ theConcept
  else
    Conc.getProp theConcept "domain"

-- | given a concept and a value, return which domain/set the value belongs to
-- | if the concept is string/time type, then it will return the concept name itself
-- | if the concept is measure, it will be nothing.
queryDomainAndSet :: DataSet -> NonEmptyString -> NonEmptyString -> Maybe (NonEmptyArray NonEmptyString)
queryDomainAndSet dataset conceptname value = do
  let
    conceptname' = NES.toString conceptname

  theConcept <- getConcept dataset conceptname'

  case Conc.getType theConcept of
    Conc.EntityDomainC -> do
      domain <- getEntities dataset conceptname' Nothing
      let
        filtered = Arr.filter (\x -> (Id.value1 $ Ent.getId x) == value) domain
        allSets = map (\x -> map Id.value1 $ Ent.getEntitySets x) filtered
      Just $ NEA.snoc' (Arr.concat allSets) conceptname
    Conc.EntitySetC -> do
      domainName <- getDomainForEntitySet dataset conceptname'
      domain <- getEntities dataset domainName (Just conceptname')
      let
        filtered = Arr.filter (\x -> (Id.value1 $ Ent.getId x) == value) domain
        allSets = map (\x -> map Id.value1 $ Ent.getEntitySets x) filtered
      Just $ NEA.snoc' (Arr.concat allSets) $ unsafePartial $ NES.unsafeFromString domainName
    Conc.TimeC -> Just $ NEA.singleton conceptname
    _ -> Nothing

-- | generate a dictionary for set memberships
genSetMemberships :: DataSet -> HashMap String (HashMap String (HashSet String))
genSetMemberships (DataSet { entities }) = map func entities
  where
  func es =
    let
      groups = Arr.groupAllBy (compare `on` Ent.getId) es
      getKey = NEA.head >>> Ent.getId >>> Id.value
      getValues xs =
        let
          allSets = map (Ent.getDomainAndSets >>> NEA.toArray >>> HS.fromArray) xs
        in
          HS.map Id.value $ HS.unions allSets
    in
      HM.fromArrayBy getKey getValues groups

type ConceptsInput = Array Concept
type EntitiesInput = Array Entity

-- | parse an array of concepts. Rules:
-- | 1. there must be at least 1 concept
-- | 2. concept ids should be unique
-- | 3. entity sets' domain must be valid ids
parseConcepts :: ConceptsInput -> V Issues ConceptDB
parseConcepts input =
  checkNonEmptyConcepts input
    `andThen`
      checkDuplicatedConcepts
    `andThen`
      checkConceptDomain
    `andThen`
      ( \good ->
          pure $ HM.fromArrayBy (Conc.getId >>> Id.value) identity good
      )

checkNonEmptyConcepts :: ConceptsInput -> V Issues ConceptsInput
checkNonEmptyConcepts input =
  if Arr.null input then
    invalid [ mkIssue E_DATASET_NO_CONCEPT ]
  else
    pure input

makeIssue :: Concept -> Issue
makeIssue c =
  let
    (Tuple filepath row) = pathAndRow $ Conc.getInfo c
    conceptId = Id.value $ Conc.getId c
  in
    mkIssue E_DATASET_CONCEPT_DUPLICATED
      # withConceptField conceptId "concept"
      # withFileLocation filepath row

checkDuplicatedConcepts :: ConceptsInput -> V Issues ConceptsInput
checkDuplicatedConcepts input =
  let
    dups = dupsBy (compare `on` Conc.getId) input
  in
    if Arr.length dups == 0 then
      pure input
    else
      invalid (makeIssue <$> dups)

checkConceptDomain :: ConceptsInput -> V Issues ConceptsInput
checkConceptDomain input =
  let
    allDomainConcepts = Arr.filter Conc.isEntityDomain input
    allSetConcepts = Arr.filter Conc.isEntitySet input
    domainNames = map (Conc.getId >>> Id.value) allDomainConcepts

    check c =
      let
        Tuple fp i = pathAndRow $ Conc.getInfo c
        conceptId = Id.value $ Conc.getId c
      in
        case Conc.getProp c "domain" of
          Just domain ->
            if domain `Arr.elem` domainNames then
              pure unit
            else
              invalid
                [ mkIssue E_DATASET_CONCEPT_INVALID_DOMAIN # withConceptField conceptId "domain" # withFileLocation fp i
                ]
          Nothing ->
            invalid
              [ mkIssue E_DATASET_CONCEPT_MISSING_DOMAIN # withConceptField conceptId "domain" # withFileLocation fp i ]
  in
    traverse_ check allSetConcepts `andThen` (\_ -> pure input)

-- FIXME: use a consistent name for Concept.getInfo and Entity.getIteminfo functions
makeIssue' :: Entity -> Issue
makeIssue' e =
  let
    info = Ent.getItemInfo e
    (Tuple filepath row) = pathAndRow info
    entityId = Id.value $ Ent.getId e
    domain = Id.value $ Ent.getDomain e
  in
    mkIssue E_DATASET_ENTITY_DUPLICATED
      # withEntity entityId domain
      # withFileLocation filepath row

-- | parse entity domains from an array of entities. Rules:
-- | 1. multiple definitions are allowed in different files
-- | 2. multiple definitions are not allowed in the same file.
parseEntityDomains :: ConceptDB -> EntitiesInput -> V Issues EntityDB
parseEntityDomains conceptdb input =
  checkDuplicatedEntities input
    `andThen`
      ( \good ->
          let
            domainGroups = Arr.groupAllBy (compare `on` Ent.getDomain) good
          in
            -- FIXME: we should double check multiple definitions of same entity
            -- see if they have conflicts of definition.
            pure $ HM.fromArrayBy (NEA.head >>> Ent.getDomain >>> Id.value) NEA.toArray domainGroups
      )

checkDuplicatedEntities :: EntitiesInput -> V Issues EntitiesInput
checkDuplicatedEntities input =
  let
    dups = dupsBy (compare `on` Ent.getIdAndFile) input
  in
    if Arr.length dups == 0 then
      pure input
    else
      invalid (makeIssue' <$> dups)

basedataset :: ConceptDB -> EntityDB -> DataSet
basedataset cdb edb = DataSet
  { concepts: cdb
  , entities: edb
  , datapoints: HM.empty
  , _valueParsers: HM.empty
  }

-- | check some property fields
-- | 1. drillup should be entity set in the same domain
-- | 1.1 (TODO) detect cycle dependencies in drillups
checkDrillup :: ConceptDB -> V Issues ConceptDB
checkDrillup concepts =
  for_ (HM.values concepts)
    ( \c ->
        case Conc.getProp c "drill_up" of
          Nothing -> pure unit
          Just drillup ->
            let
              Tuple fp i = pathAndRow $ Conc.getInfo c
              domain = unsafePartial $ fromJust $ Conc.getProp c "domain"
            in
              withRowInfo fp i $
                parseJsonListVal drillup
                  `andThen`
                    (\lst -> traverse_ (\x -> lookupSetWithInDomain concepts x domain) (Value.getListValues lst))
    )
    `andThen` (\_ -> pure concepts)

-- | entity sets and domains for a entity should be defined in concepts
checkDomainAndSetExists :: ConceptDB -> EntityDB -> V Issues EntityDB
checkDomainAndSetExists concepts entities =
  let
    run :: String -> Array Entity -> V Issues Unit
    run domain ents =
      lookupDomain concepts domain
        `andThen`
          ( \_ -> for_ ents \e ->
              let
                sets = Id.value <$> Ent.getEntitySets e
                Tuple fp i = pathAndRow $ Ent.getItemInfo e
              in
                traverse_ (\x -> withRowInfo fp i $ lookupSetWithInDomain concepts x domain) sets
          )
  in
    (sequence $ HM.toArrayBy run entities)
      `andThen` (\_ -> pure entities)

lookupDomain :: ConceptDB -> String -> V Issues Unit
lookupDomain concepts x = case HM.lookup x concepts of
  Nothing -> invalid
    [ mkIssue E_DATASET_ENTITYDOMAIN_INVAILD # withConceptField x "domain" ]
  Just v -> case Conc.getType v of
    Conc.EntityDomainC -> pure unit
    _ -> invalid [ mkIssue E_DATASET_CONCEPT_INVALID_DOMAIN # withConceptField x "concept_type" ]

-- lookupSet :: ConceptDB -> String -> V Issues Unit
-- lookupSet concepts x = case HM.lookup x concepts of
--   Nothing -> invalid [ Issue $ "entity set " <> x <> " is not defined in concepts." ]
--   Just v -> case Conc.getType v of
--     Conc.EntitySetC -> pure unit
--     _ -> invalid [ Issue $ "concept " <> x <> " is not an entity set in dataset." ]

lookupSetWithInDomain :: ConceptDB -> String -> String -> V Issues Unit
lookupSetWithInDomain concepts set domain =
  lookupDomain concepts domain
    `andThen`
      ( \_ -> case HM.lookup set concepts of
          Nothing -> invalid [ mkIssue E_DATASET_ENTITYSET_UNDEFINED # withConceptField set "entity_set" ]
          Just v -> case Conc.getType v of
            Conc.EntitySetC -> case Conc.getProp v "domain" of
              Nothing -> invalid [ mkIssue E_DATASET_CONCEPT_MISSING_DOMAIN # withConceptField set "domain" ]
              Just d ->
                if d == domain then
                  pure unit
                else
                  invalid [ mkIssue E_DATASET_CONCEPT_INVALID_DOMAIN # withConceptField set "domain" ]
            _ -> invalid [ mkIssue E_DATASET_CONCEPT_INVALID_DOMAIN # withConceptField set "concept_type" ]

      )

-- | parse a base dataset
parseBaseDataSet :: ConceptsInput -> EntitiesInput -> V Issues DataSet
-- FIXME: How should I use types to make the requirements more clear?
parseBaseDataSet conceptsInput entitiesInput =
  parseConcepts conceptsInput
    `andThen`
      checkDrillup
    `andThen`
      ( \cdb ->
          parseEntityDomains cdb entitiesInput
            `andThen`
              checkDomainAndSetExists cdb
            `andThen`
              (\edb -> pure $ basedataset cdb edb)
      )
    `andThen`
      ( \dataset@(DataSet ds) ->
          let
            ps = map (\x -> Tuple x (makeValueParser dataset x))
              (HM.keys $ getConcepts dataset)
            -- Add concept parser
            ps' = ps <>
              -- append concept and concept_type parser.
              -- because they are reversed concepts they won't be in
              -- concept table.
              [ Tuple "concept"
                  ( Value.parseDomainVal "concept"
                      $ HS.fromArray
                      $ HM.keys ds.concepts
                  )
              , Tuple "concept_type" Value.parseStrVal
              ]
          in
            pure $ DataSet (ds { _valueParsers = HM.fromArray ps' })
      )

unsafeLookupHM :: forall k v. Hashable k => Show k => k -> HashMap k v -> v
unsafeLookupHM k m = case HM.lookup k m of
  Nothing -> unsafeCrashWith $ "error finding key: " <> show k
  Just x -> x

-- | unsafe function, only works if we know the key exists in the DataSet.
makeValueParser :: DataSet -> String -> ValueParser
makeValueParser dataset@(DataSet ds) k =
  let
    conc = unsafeLookupHM k ds.concepts
  in
    case Conc.getType conc of
      StringC -> parseStrVal
      MeasureC -> parseNumVal
      BooleanC -> parseBoolVal
      IntervalC -> parseStrVal
      EntityDomainC ->
        parseDomainVal k entvals
        where
        entities = case HM.lookup k ds.entities of
          Nothing -> []
          Just es -> es
        entvals = HS.fromArray $ map (Ent.getId >>> Id.value) entities
      EntitySetC -> case getDomainForEntitySet dataset k of
        Nothing -> parseDomainVal k HS.empty
        Just domain -> case getEntities dataset domain (Just k) of
          Nothing -> parseDomainVal k HS.empty
          Just ents ->
            parseDomainVal k entvals
            where
            entvals = HS.fromArray $ map (Ent.getId >>> Id.value) ents
      RoleC -> parseStrVal
      CompositeC -> parseStrVal
      TimeC -> parseTimeVal
      (CustomC _) -> parseStrVal

getValueParser :: DataSet -> String -> V Issues ValueParser
getValueParser (DataSet ds) k =
  case HM.lookup k ds._valueParsers of
    Just v -> pure v
    Nothing -> invalid [ mkIssue E_DATASET_CONCEPT_NOT_FOUND # withConceptField k "concept" ]

-- | parseDataPoints based on the concepts and entities in the dataset.
-- | I thik it's not very necessary to store it into DataSet for validation
parseDataPoints :: DataSet -> DataPoints -> V Issues Unit
parseDataPoints ds (DataPoints dp) =
  let
    conceptsInDp = NEA.snoc dp.by dp.indicatorId
  in
    for_ conceptsInDp \c ->
      getValueParser ds (Id.value c)
        `andThen`
          (\vp -> parseColumnValues vp (unsafeLookup c dp.values) (dp.itemInfo))

-- | check if concept exists in the dataset
conceptExists :: DataSet -> Identifier -> V Issues Identifier
conceptExists (DataSet { concepts }) concept =
  case HM.lookup (Id.value concept) concepts of
    Nothing -> invalid [ mkIssue E_DATASET_CONCEPT_NOT_FOUND # withConceptField (Id.value concept) "concept" ]
    Just _ -> pure concept

parseColumnValues :: ValueParser -> Array String -> Array ItemInfo -> V Issues Unit
parseColumnValues parser vals iteminfo = traverse_ run allValues
  where
  -- find all unique values
  allValues = HM.values $ HM.fromArrayBy fst identity $ Arr.zip vals iteminfo

  run (Tuple v it) =
    let
      (Tuple fp i) = pathAndRow it
    in
      withRowInfo fp i (parser v `andThen` (\_ -> pure unit))

-- | For Synonyms and Translations, we only need to parse all values in the columns.
parseCsvFileValues :: DataSet -> CsvFile -> V Issues Unit
parseCsvFileValues ds { fileInfo, csvContent } =
  let
    { index, headers, columns } = csvContent
    fp = FI.filepath fileInfo

    run (Tuple concept vals) =
      getValueParser ds (toString concept)
        `andThen`
          (\vp -> parseColumnValues' fp concept vp vals index)

    -- filter out is-- headers
    targetHeaders (Tuple h _) =
      let
        h' = NES.toString h
      in
        if (Str.startsWith "is--" h') then false
        else true

    filtered = NEA.filter targetHeaders $ NEA.zip (map headerVal headers) columns
  in
    traverse_ run filtered

parseColumnValues' :: FilePath -> NonEmptyString -> ValueParser -> Array String -> Array Int -> V Issues Unit
parseColumnValues' fp concept parser vals index = traverse_ run allValues
  where
  allValues = HM.values $ HM.fromArrayBy fst identity $ Arr.zip vals index

  run (Tuple v i) =
    let
      res = withRowInfo fp i (parser v `andThen` (\_ -> pure unit))
      -- function to update the error message with column names.
      func = map
        ( \issue -> updateMessage issue
            ( \m ->
                "in column " <> (NES.toString concept) <> ": " <> m
            )
        )
    in
      lmap func res
