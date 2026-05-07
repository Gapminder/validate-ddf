-- | defines what is valid concept without additional context.
-- | for valid concept within the context of dataset, see
-- | Data.DDF.DataSet
module Data.DDF.Concept where

import Prelude

import Data.Array as Arr
import Data.DDF.Atoms.Header (Header(..))
import Data.Either (Either(..))
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Internal (ItemInfo, iteminfo)
import Data.List (elem)
import Data.Map (Map)
import Data.Map as M
import Data.Map.Extra (mapKeys)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, unwrap)
import Data.String (Pattern(..), Replacement(..))
import Data.String as Str
import Data.Traversable (traverse, traverse_)
import Data.Validation.Issue (Issue(..), Issues, mkIssue, mkIssueWithMessage, withConcept, withConceptField, withMessage)
import Data.Validation.Registry (ErrorCode(..))
import Data.Validation.Semigroup (V, andThen, invalid, toEither)
import Data.String.NonEmpty (toString)
import Safe.Coerce (coerce)

-- | Each Concept MUST have an Id and concept type.
-- | Fixed fields (domain, drill_up, scales, tags) are pre-parsed from CSV
-- | and stored explicitly. Custom properties go into the props map.
newtype Concept = Concept
  { conceptId :: Identifier
  , conceptType :: ConceptType
  , domain :: Maybe Identifier
  , drill_up :: Maybe (Array Identifier)
  -- scales and tags are fixed properties that required by open numbers datasets.
  -- they are not part of DDF spec, and are likely be updated/removed in the future.
  , scales :: Maybe (Array Identifier)
  , tags :: Maybe (Array Identifier)
  , props :: Props
  , _info :: Maybe ItemInfo -- additional information to use in the app, not in DDF data model
  }

derive instance newtypeConcept :: Newtype Concept _

instance eqConcept :: Eq Concept where
  eq (Concept a) (Concept b) = a.conceptId == b.conceptId

instance showConcept :: Show Concept where
  show (Concept a) = show a

-- | Properties type for custom / user-defined concept properties.
-- | Fixed fields (domain, drill_up, scales, tags) are stored in dedicated
-- | fields above and removed from props during parsing.
type Props = Map Identifier String

-- | Types of concept
data ConceptType
  = StringC
  | MeasureC
  | BooleanC
  | IntervalC
  | EntityDomainC
  | EntitySetC
  | RoleC
  | CompositeC
  | TimeC
  | CustomC Identifier -- The custom type

instance showConceptType :: Show ConceptType where
  show StringC = "string"
  show MeasureC = "measure"
  show BooleanC = "boolean"
  show IntervalC = "interval"
  show EntityDomainC = "entity_domain"
  show EntitySetC = "enitty_set"
  show RoleC = "role"
  show CompositeC = "composite"
  show TimeC = "time"
  show (CustomC x) = "custom type: " <> Id.value x

derive instance eqConceptType :: Eq ConceptType

-- | parse concept type from string
parseConceptType :: String -> V Issues ConceptType
parseConceptType x = ado
  cid <- Id.parseId x
  let
    res = case toString $ unwrap cid of
      "string" -> StringC
      "measure" -> MeasureC
      "boolean" -> BooleanC
      "interval" -> IntervalC
      "entity_domain" -> EntityDomainC
      "entity_set" -> EntitySetC
      "role" -> RoleC
      "composite" -> CompositeC
      "time" -> TimeC
      _ -> CustomC cid
  in res

-- FIXME: I think drill_up and domain should be reserved concepts.
-- | reserved keywords which can not used as concept id
reservedConcepts :: Array Identifier
reservedConcepts = map Id.unsafeCreate [ "concept", "concept_type" ]

-- | create concept with default empty fixed fields
concept :: Identifier -> ConceptType -> Props -> Concept
concept conceptId conceptType props =
  Concept
    { conceptId
    , conceptType
    , domain: Nothing
    , drill_up: Nothing
    , scales: Nothing
    , tags: Nothing
    , props
    , _info: Nothing
    }

-- | set additional infos
setInfo :: (Maybe ItemInfo) -> Concept -> Concept
setInfo info (Concept c) = Concept (c { _info = info })

getInfo :: Concept -> ItemInfo
getInfo (Concept c) =
  case c._info of
    Nothing -> iteminfo "" (-1)
    Just info -> info

-- | get concept id
getId :: Concept -> Identifier
getId (Concept x) = x.conceptId

getType :: Concept -> ConceptType
getType (Concept x) = x.conceptType

isEntitySet :: Concept -> Boolean
isEntitySet (Concept c) =
  case c.conceptType of
    EntitySetC -> true
    _ -> false

isEntityDomain :: Concept -> Boolean
isEntityDomain (Concept c) =
  case c.conceptType of
    EntityDomainC -> true
    _ -> false

getProp :: Concept -> String -> Maybe String
getProp (Concept c) p =
  M.lookup (Id.unsafeCreate p) c.props

-- | Fixed field accessors
getDomain :: Concept -> Maybe Identifier
getDomain (Concept c) = c.domain

getDrillUp :: Concept -> Maybe (Array Identifier)
getDrillUp (Concept c) = c.drill_up

getScales :: Concept -> Maybe (Array Identifier)
getScales (Concept c) = c.scales

getTags :: Concept -> Maybe (Array Identifier)
getTags (Concept c) = c.tags

-- | The unvalidated concept record, which comes from reading csvfile.
type ConceptInput =
  { conceptId :: String
  , props :: Map Header String
  , _info :: Maybe ItemInfo
  }

-- | Look up and parse the concept_type field (required).
parseConceptTypeFromProps :: Maybe String -> String -> V Issues ConceptType
parseConceptTypeFromProps Nothing conceptId =
  invalid [ mkIssue E_CONCEPT_FIELD_MISSING # withConceptField conceptId "concept_type" ]
parseConceptTypeFromProps (Just v) _ = parseConceptType v

-- | Look up and parse the domain field (optional).
-- | Returns Nothing if absent or empty, Just the parsed identifier otherwise.
parseDomainField :: Maybe String -> String -> V Issues (Maybe Identifier)
parseDomainField Nothing _ = pure Nothing
parseDomainField (Just val) _ | Str.null val = pure Nothing
parseDomainField (Just val) _ = Id.parseId val <#> Just

-- | Look up and parse a list field (optional): drill_up, scales, tags.
-- | Each whitespace-separated token is validated as an identifier.
-- | Returns Nothing if absent.
parseListField :: String -> ErrorCode -> Maybe String -> String -> V Issues (Maybe (Array Identifier))
parseListField _ _ Nothing _ = pure Nothing
parseListField fieldName errorCode (Just val) conceptId =
  let
    parts = Arr.filter (not Str.null) $ Str.split (Pattern " ") val
    parsed = traverse Id.parseId parts
  in
    case toEither parsed of
      Right ids -> pure (Just ids)
      Left _ ->
        invalid
          [ mkIssue errorCode
              # withConceptField conceptId fieldName
              # withMessage ("value: " <> csvDisplay val)
          ]

-- | convert a ConceptInput into valid Concept or errors.
-- | Fixed fields are looked up from props and parsed; fixed keys are
-- | removed to leave custom properties; independent checks become
-- | applicative to accumulate all errors.
parseConcept :: ConceptInput -> V Issues Concept
parseConcept input =
  let
    props = mapKeys coerce input.props :: Map Identifier String
    fixedKeys = map Id.unsafeCreate [ "concept_type", "domain", "drill_up", "scales", "tags" ]
    lookup_ key = M.lookup (Id.unsafeCreate key) props
    remainingProps = Arr.foldl (flip M.delete) props fixedKeys

    parsed = ado
      parsedId <- notReserved input.conceptId `andThen` Id.parseId
      parsedType <- parseConceptTypeFromProps (lookup_ "concept_type") input.conceptId
      domain <- parseDomainField (lookup_ "domain") input.conceptId
      drill_up <- parseListField "drill_up" E_CONCEPT_DRILLUP_FORMAT (lookup_ "drill_up") input.conceptId
      scales <- parseListField "scales" E_CONCEPT_SCALES_FORMAT (lookup_ "scales") input.conceptId
      tags <- parseListField "tags" E_CONCEPT_TAGS_FORMAT (lookup_ "tags") input.conceptId
      let
        c = Concept
          { conceptId: parsedId
          , conceptType: parsedType
          , domain
          , drill_up
          , scales
          , tags
          , props: remainingProps
          , _info: Nothing
          }
      in c
  in
    parsed
      `andThen` \c -> ado
        _ <- checkMandatoryField c
        _ <- checkRestrictedConecptIds c
        in setInfo input._info c

-- | some concept type require a column exists
-- | for example if concept type is entity_set, then it
-- | must have non empty domain.
checkMandatoryField :: Concept -> V Issues Concept
checkMandatoryField input@(Concept c) =
  case c.conceptType of
    EntitySetC -> case c.domain of
      Nothing ->
        invalid
          [ mkIssue E_CONCEPT_FIELD_MISSING
              # withConceptField (Id.value c.conceptId) "domain"
          ]
      Just _ -> pure input
    _ -> pure input

-- | some concept type has restricted possible concept ID values
-- | for example if concept type is time, then concept ID must
-- | be in [year, month, day, week, quarter, time]
checkRestrictedConecptIds :: Concept -> V Issues Concept
checkRestrictedConecptIds input@(Concept c) = case c.conceptType of
  TimeC ->
    let
      possibleTimeConcepts = map Id.unsafeCreate [ "year", "month", "day", "week", "quarter", "time" ]
    in
      case c.conceptId `elem` possibleTimeConcepts of
        true -> pure input
        false -> invalid
          [ mkIssue E_CONCEPT_TIME_INVALID
              # withConcept (Id.value c.conceptId)
          ]
  _ -> pure input

-- | Re-encode a parsed CSV field value for display in error messages,
-- | so users can search for it in the raw CSV file.
csvDisplay :: String -> String
csvDisplay s =
  if Str.contains (Pattern "\"") s || Str.contains (Pattern ",") s then
    "\"" <> Str.replaceAll (Pattern "\"") (Replacement "\"\"") s <> "\""
  else
    s

hasProp :: String -> Props -> Boolean
hasProp f props = M.member (Id.unsafeCreate f) props

-- | WS server have issue when concept Id is too long
conceptIdTooLong :: Concept -> V Issues Concept
conceptIdTooLong conc@(Concept c) = ado
  Id.isLongerThan64Chars c.conceptId
  in
    conc

-- | check if concept id is not reversed keyword
notReserved :: String -> V Issues String
notReserved conceptId =
  if conceptId `elem` reservedConcepts_ then
    invalid [ mkIssue E_CONCEPT_ID_RESERVED # withConcept conceptId ]
  else
    pure conceptId
  where
  reservedConcepts_ = map Id.value reservedConcepts

-- TODO:
-- parseConceptWithValueParsers :: create valid concept, then parse property columns.
-- checkCustomTypeConcept -> get a warning if there is a custom concept type.

-- | unsafe create, useful for testing.
unsafeCreate :: String -> String -> Map String String -> ItemInfo -> Concept
unsafeCreate concept_id concept_type props_ info =
  Concept
    { conceptId: conceptId
    , conceptType: conceptType
    , domain: Nothing
    , drill_up: Nothing
    , scales: Nothing
    , tags: Nothing
    , props: props
    , _info: Just info
    }
  where
  conceptId = Id.unsafeCreate concept_id
  conceptType = unsafeCreateConceptType concept_type
  props = mapKeys Id.unsafeCreate $ props_

unsafeCreateConceptType :: String -> ConceptType
unsafeCreateConceptType x =
  case x of
    "string" -> StringC
    "meaeure" -> MeasureC
    "bollean" -> BooleanC
    "interval" -> IntervalC
    "entity_domain" -> EntityDomainC
    "entity_set" -> EntitySetC
    "role" -> RoleC
    "composite" -> CompositeC
    "time" -> TimeC
    _ -> CustomC $ Id.unsafeCreate x
