-- | defines what is valid concept without additional context.
-- | for valid concept within the context of dataset, see
-- | Data.DDF.DataSet
module Data.DDF.Concept where

import Prelude

import Data.DDF.Atoms.Header (Header(..))
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Atoms.Value (Value, ValueParser, isEmpty, parseStrVal')
import Data.DDF.Internal (ItemInfo, iteminfo)
import Data.List (elem)
import Data.Map (Map)
import Data.Map as M
import Data.Map.Extra (mapKeys)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, unwrap)
import Data.String as Str
import Data.String.NonEmpty (NonEmptyString, toString)
import Data.Tuple (Tuple(..))
import Data.Validation.Issue (Issue(..), Issues, mkIssue, mkIssueWithMessage, withConcept, withConceptField)
import Data.Validation.Registry (ErrorCode(..))
import Data.Validation.Semigroup (V, andThen, invalid)
import Safe.Coerce (coerce)

-- | Each Concept MUST have an Id and concept type.
newtype Concept = Concept
  { conceptId :: Identifier
  , conceptType :: ConceptType
  , props :: Props
  , _info :: Maybe ItemInfo -- additional information to use in the app, not in DDF data model
  }

derive instance newtypeConcept :: Newtype Concept _

instance eqConcept :: Eq Concept where
  eq (Concept a) (Concept b) = a.conceptId == b.conceptId

instance showConcept :: Show Concept where
  show (Concept a) = show a

-- | Properties type
-- the Key MUST be valid identifier
-- We will validate values in the properties (such as domain)
-- while we parse entire dataset, so just use String here
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

-- | create concept
concept :: Identifier -> ConceptType -> Props -> Concept
concept conceptId conceptType props = Concept { conceptId, conceptType, props, _info }
  where
  _info = Nothing

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

-- | The unvalidated concept record, which comes from reading csvfile.
type ConceptInput =
  { conceptId :: String
  , props :: Map Header String
  , _info :: Maybe ItemInfo
  }

-- | ConceptInput with props converted to Map Identifier String
type ConceptInput' =
  { conceptId :: String
  , props :: Map Identifier String
  , _info :: Maybe ItemInfo
  }

-- | convert a ConceptInput into valid Concept or errors
parseConcept :: ConceptInput -> V Issues Concept
parseConcept input =
  let
    -- coerce Header to Identifier because they are both string
    -- FIXME: double check the Header -> Identifier convertion.
    props = mapKeys coerce input.props :: Map Identifier String
    input' = { conceptId: input.conceptId, props: props, _info: input._info }
  in
    hasFieldAndPopValue input' "concept_type"
      `andThen`
        ( \(Tuple conceptTypeStr input'') ->
            concept
              <$>
                ( notReserved input.conceptId
                    `andThen` Id.parseId
                )
              <*> parseConceptType conceptTypeStr
              <*> pure input''.props
        )
      `andThen`
        checkMandatoryField
      `andThen`
        checkRestrictedConecptIds
      `andThen`
        (\c -> pure $ setInfo input._info c)

-- | some concept type require a column exists
-- | for example if concept type is entity_set, then it
-- | must have non empty domain.
checkMandatoryField :: Concept -> V Issues Concept
checkMandatoryField input@(Concept c) =
  let
    input' = { conceptId: Id.value c.conceptId, props: c.props, _info: c._info }
  in
    case c.conceptType of
      EntitySetC -> ado
        hasFieldAndGetValue input' "domain"
          `andThen`
            nonEmptyField input' "domain"
        in input
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

hasFieldAndGetValue :: ConceptInput' -> String -> V Issues String
hasFieldAndGetValue input field =
  case M.lookup (Id.unsafeCreate field) input.props of
    Nothing -> invalid [ mkIssue E_CONCEPT_FIELD_MISSING # withConceptField input.conceptId field ]
    Just v -> pure v

hasFieldAndPopValue :: ConceptInput' -> String -> V Issues (Tuple String ConceptInput')
hasFieldAndPopValue input field =
  case M.pop (Id.unsafeCreate field) input.props of
    Nothing -> invalid [ mkIssue E_CONCEPT_FIELD_MISSING # withConceptField input.conceptId field ]
    Just (Tuple v props') -> pure $ Tuple v (input { props = props' })

nonEmptyField :: ConceptInput' -> String -> String -> V Issues String
nonEmptyField input field value =
  if Str.null value then
    invalid [ mkIssue E_CONCEPT_FIELD_EMPTY # withConceptField input.conceptId field ]
  else
    pure value

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
