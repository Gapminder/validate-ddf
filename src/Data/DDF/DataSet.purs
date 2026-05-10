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
import Data.DDF.Internal (pathAndRow)
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
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.String.NonEmpty (toString)
import Data.String.NonEmpty as NES
import Data.String.NonEmpty as NES
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.String.Utils as Str
import Data.Traversable (for, for_, sequence, sequence_, traverse, traverse_)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues, getContextValue, mkIssue, toInvaildItem, updateMessage, withConceptField, withEntity, withFileLocation, withMessage, withRowInfo)
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
    map Id.value $ Conc.getDomain theConcept

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
    domainNames = map Conc.getId allDomainConcepts

    check c =
      let
        Tuple fp i = pathAndRow $ Conc.getInfo c
        conceptId = Id.value $ Conc.getId c
      in
        case Conc.getDomain c of
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

validScales :: Array Identifier
validScales = map Id.unsafeCreate [ "linear", "log", "time", "ordinal", "point", "svg", "rank" ]

-- | Check element validity for concept list fields (format checked in Concept.purs):
-- | - drill_up: entity set IDs must exist in the same domain
-- | - scales: values must be from a fixed list
checkListFields :: ConceptDB -> V Issues ConceptDB
checkListFields concepts =
  for_ (HM.values concepts)
    ( \c ->
        let
          Tuple fp i = pathAndRow $ Conc.getInfo c
          checkDrillUp =
            case Conc.getDrillUp c of
              Nothing -> pure unit
              Just vals
                | Arr.null vals -> pure unit
                | otherwise ->
                    case Conc.getDomain c of
                      Nothing ->
                        invalid
                          [ mkIssue E_DATASET_CONCEPT_MISSING_DOMAIN
                              # withConceptField (Id.value $ Conc.getId c) "domain"
                              # withFileLocation fp i
                              # withMessage "drill_up requires a domain"
                          ]
                      Just domain ->
                        withRowInfo fp i
                          $ traverse_
                              (\x -> lookupSetWithInDomain concepts x domain)
                              vals

          checkScales =
            case Conc.getScales c of
              Nothing -> pure unit
              Just vals ->
                withRowInfo fp i
                  $ traverse_
                      ( \x ->
                          if x `Arr.elem` validScales then
                            pure unit
                          else
                            invalid
                              [ mkIssue E_DATASET_CONCEPT_SCALES_INVALID
                                  # withMessage ("\"" <> Id.value x <> "\"")
                              ]
                      )
                      vals

        in
          checkDrillUp *> checkScales
    )
    `andThen` (\_ -> pure concepts)

-- | Validate each tag value against entities in the "tag" entity domain.
-- | Skips silently if no "tag" entity domain is present in the dataset.
checkTagValues :: ConceptDB -> EntityDB -> V Issues EntityDB
checkTagValues concepts entities =
  let
    specialTags = map Id.unsafeCreate [ "_none", "_root" ]
    tagEntities =
      case HM.lookup "tag" entities of
        Nothing -> HS.empty
        Just es -> HS.fromArray $ map Ent.getId es
  in
    if HS.isEmpty tagEntities then
      pure entities
    else
      for_ (HM.values concepts)
        ( \c ->
            case Conc.getTags c of
              Nothing -> pure unit
              Just vals ->
                let
                  Tuple fp i = pathAndRow $ Conc.getInfo c
                  checkItem x =
                    if x `Arr.elem` specialTags || HS.member x tagEntities then
                      pure unit
                    else
                      invalid
                        [ mkIssue E_DATASET_CONCEPT_TAGS_INVALID
                            # withMessage ("\"" <> Id.value x <> "\"")
                        ]
                in
                  withRowInfo fp i
                    $ traverse_ checkItem vals
        )
        `andThen` (\_ -> pure entities)

-- | entity sets and domains for a entity should be defined in concepts
checkDomainAndSetExists :: ConceptDB -> EntityDB -> V Issues EntityDB
checkDomainAndSetExists concepts entities =
  let
    run :: String -> Array Entity -> V Issues Unit
    run domain ents =
      let
        -- Get file context from first entity in the domain
        -- Use line 1 (header line) since domain comes from filename/header
        firstEntity = Arr.head ents
        mbFileContext = case firstEntity of
          Just e ->
            let
              Tuple fp _ = pathAndRow $ Ent.getItemInfo e
            in
              Just $ Tuple fp 1
          Nothing -> Nothing
      in
        lookupDomain concepts domain mbFileContext
          `andThen`
            ( \_ -> for_ ents \e ->
                let
                  domainId = Id.unsafeCreate domain
                  Tuple fp i = pathAndRow $ Ent.getItemInfo e
                in
                  traverse_ (\x -> withRowInfo fp i $ lookupSetWithInDomain concepts x domainId) (Ent.getEntitySets e)
            )
  in
    (sequence $ HM.toArrayBy run entities)
      `andThen` (\_ -> pure entities)

lookupDomain :: ConceptDB -> String -> Maybe (Tuple FilePath Int) -> V Issues Unit
lookupDomain concepts x mbFileContext = case HM.lookup x concepts of
  Nothing ->
    let
      issue = mkIssue E_DATASET_ENTITYDOMAIN_INVAILD # withConceptField x "domain"
      issueWithContext = case mbFileContext of
        Just (Tuple fp i) -> issue # withFileLocation fp i
        Nothing -> issue
    in
      invalid [ issueWithContext ]
  Just v -> case Conc.getType v of
    Conc.EntityDomainC -> pure unit
    _ ->
      let
        issue = mkIssue E_DATASET_CONCEPT_INVALID_DOMAIN # withConceptField x "concept_type"
        issueWithContext = case mbFileContext of
          Just (Tuple fp i) -> issue # withFileLocation fp i
          Nothing -> issue
      in
        invalid [ issueWithContext ]

-- lookupSet :: ConceptDB -> String -> V Issues Unit
-- lookupSet concepts x = case HM.lookup x concepts of
--   Nothing -> invalid [ Issue $ "entity set " <> x <> " is not defined in concepts." ]
--   Just v -> case Conc.getType v of
--     Conc.EntitySetC -> pure unit
--     _ -> invalid [ Issue $ "concept " <> x <> " is not an entity set in dataset." ]

lookupSetWithInDomain :: ConceptDB -> Identifier -> Identifier -> V Issues Unit
lookupSetWithInDomain concepts set domain =
  let
    setStr = Id.value set
    domainStr = Id.value domain
  in
    lookupDomain concepts domainStr Nothing
      `andThen`
        ( \_ -> case HM.lookup setStr concepts of
            Nothing -> invalid [ mkIssue E_DATASET_ENTITYSET_UNDEFINED # withConceptField setStr "entity_set" ]
            Just v -> case Conc.getType v of
              Conc.EntitySetC -> case Conc.getDomain v of
                Nothing -> invalid [ mkIssue E_DATASET_CONCEPT_MISSING_DOMAIN # withConceptField setStr "domain" ]
                Just d ->
                  if d == domain then
                    pure unit
                  else
                    invalid [ mkIssue E_DATASET_CONCEPT_INVALID_DOMAIN # withConceptField setStr "domain" ]
              _ -> invalid [ mkIssue E_DATASET_CONCEPT_INVALID_DOMAIN # withConceptField setStr "concept_type" ]

        )

-- | Parse a base dataset from concepts and entities input.
-- | The validation follows these steps:
-- |   1. Parse concepts independently (non-empty, no duplicates, entity sets have valid domains)
-- |   2. Parse entity domains and validate them against concepts
-- |   3. Validate concept fields that may reference entities (tags, scales, drill_up)
-- |   4. Build value parsers for datapoint validation
parseBaseDataSet :: ConceptsInput -> EntitiesInput -> V Issues DataSet
parseBaseDataSet conceptsInput entitiesInput =
  let
    parseEntities :: ConceptDB -> V Issues { cdb :: ConceptDB, edb :: EntityDB }
    parseEntities cdb =
      parseEntityDomains cdb entitiesInput
        `andThen` checkDomainAndSetExists cdb
        `andThen` \edb -> pure { cdb, edb }

    validateFields :: { cdb :: ConceptDB, edb :: EntityDB } -> V Issues DataSet
    validateFields { cdb, edb } =
      checkListFields cdb
        `andThen` \_ ->
          checkTagValues cdb edb
            `andThen` \_ ->
              pure (basedataset cdb edb)
                `andThen` buildValueParsers
  in
    parseConcepts conceptsInput
      `andThen` parseEntities
      `andThen` validateFields

-- | Build value parsers for each concept in the dataset.
-- | These parsers are used to validate datapoint values and CSV file columns.
-- | The "concept" and "concept_type" reserved columns are added manually.
buildValueParsers :: DataSet -> V Issues DataSet
buildValueParsers dataset@(DataSet ds) =
  let
    ps = map (\x -> Tuple x (makeValueParser dataset x))
      $ HM.keys
      $ getConcepts dataset
    ps' = ps <>
      [ Tuple "concept"
          ( Value.parseConceptVal
              $ HS.fromArray
              $ HM.keys ds.concepts
          )
      , Tuple "concept_type" Value.parseStrVal
      ]
  in
    pure $ DataSet (ds { _valueParsers = HM.fromArray ps' })

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
        parseDomainVal true k entvals
        where
        entities = case HM.lookup k ds.entities of
          Nothing -> []
          Just es -> es
        entvals = HS.fromArray $ map (Ent.getId >>> Id.value) entities
      EntitySetC -> case getDomainForEntitySet dataset k of
        Nothing -> parseDomainVal true k HS.empty
        Just domain -> case getEntities dataset domain (Just k) of
          Nothing -> parseDomainVal true k HS.empty
          Just ents ->
            parseDomainVal true k entvals
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
parseDataPoints :: DataSet -> DataPoints -> V Issues Unit
parseDataPoints ds (DataPoints dp) =
  let
    conceptsInDp = NEA.snoc dp.by dp.indicatorId
    -- Get file path from first item for error reporting
    mbFileContext = case Arr.head dp.itemInfo of
      Just info ->
        let
          Tuple fp _ = pathAndRow info
        in
          Just $ Tuple fp 1 -- Line 1 because concepts come from filename/header
      Nothing -> Nothing
    rowInfo = map pathAndRow dp.itemInfo
  in
    for_ conceptsInDp \c ->
      let
        -- Only wrap the parser lookup with line 1 — "concept not found" errors
        -- have no file context yet. parseColumnValues sets its own per-row contexts.
        parserResult = case mbFileContext of
          Just (Tuple fp ln) -> withRowInfo fp ln (getValueParser ds (Id.value c))
          Nothing -> getValueParser ds (Id.value c)
      in
        parserResult `andThen`
          (\vp -> parseColumnValues (Id.value1 c) vp false (unsafeLookup c dp.values) rowInfo)

-- | check if concept exists in the dataset
conceptExists :: DataSet -> Identifier -> V Issues Identifier
conceptExists (DataSet { concepts }) concept =
  case HM.lookup (Id.value concept) concepts of
    Nothing -> invalid [ mkIssue E_DATASET_CONCEPT_NOT_FOUND # withConceptField (Id.value concept) "concept" ]
    Just _ -> pure concept

-- | Parse column values using the provided value parser.
-- | Deduplicates by value before validating, so each unique value is only checked once.
-- | Error messages include column name and count of rows with the same invalid value.
parseColumnValues :: NonEmptyString -> ValueParser -> Boolean -> Array String -> Array (Tuple FilePath Int) -> V Issues Unit
parseColumnValues colName parser allowEmpty vals rowInfo =
  traverse_ run uniqueValues
  where
  uniqueValues = HM.values $ HM.fromArrayBy fst identity $ Arr.zip vals rowInfo

  run (Tuple v (Tuple fp i)) =
    if v == "" && allowEmpty then
      pure unit
    else
      let
        res = withRowInfo fp i (parser v `andThen` (\_ -> pure unit))
        func =
          map
            ( \issue ->
                case getContextValue issue of
                  Nothing -> issue -- impossible path because value parser should always have value in context.
                  Just contextVal ->
                    let
                      count = Arr.length $ Arr.filter (_ == contextVal) vals
                      colNameStr = NES.toString colName
                      extra =
                        if count > 1 then
                          "with " <> show (count - 1) <> " similar situations in column \"" <> colNameStr <> "\""
                        else
                          "in column \"" <> colNameStr <> "\""
                    in
                      updateMessage issue
                        ( \m ->
                            m <> " (" <> extra <> ") "
                        )
            )
      in
        lmap func res

-- | Parse CSV column values with column value parsers from DataSet.
parseCsvFileValues :: DataSet -> Boolean -> CsvFile -> V Issues Unit
parseCsvFileValues ds allowEmpty { fileInfo, csvContent } =
  let
    { index, headers, columns } = csvContent
    fp = FI.filepath fileInfo

    run (Tuple concept vals) =
      getValueParser ds (toString concept)
        `andThen`
          (\vp -> parseColumnValues concept vp allowEmpty vals (map (\i -> Tuple fp i) index))

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
