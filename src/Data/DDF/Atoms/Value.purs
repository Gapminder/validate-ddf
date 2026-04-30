module Data.DDF.Atoms.Value where

import Prelude

import Data.Array as Arr
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.Either (Either(..))
import Data.Generic.Rep (class Generic)
import Data.HashSet (HashSet)
import Data.HashSet as HS
import Data.Int as Int
import Data.List (List)
import Data.Map (Map)
import Data.Maybe (Maybe(..), isJust)
import Data.Number as Num
import Data.Show.Generic (genericShow)
import Data.String as Str
import Data.String.NonEmpty (NonEmptyString, fromString)
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.Validation.Issue (Issue(..), Issues, mkIssueWithValue, withConcept, withMessage)
import Data.Validation.Registry (ErrorCode(..))
import Data.Validation.Semigroup (V, invalid)
import Foreign (MultipleErrors)
import Partial.Unsafe (unsafeCrashWith)
import Yoga.JSON as JSON
import Yoga.JSON.Error (renderHumanError)

-- | types of values, which appear in table cells.
data Value
  = DomainVal NonEmptyString -- string in a domain
  | StrVal String -- normal string
  | NumVal Number -- numbers
  | BoolVal Boolean -- boolean
  | TimeVal String -- string in time format
  | ListVal (Array String) -- a list of strings
  | JsonListVal (Array String) -- a list of strings, encoded in json
  | JsonVal String -- random json string

derive instance genericValue :: Generic Value _

instance showValue :: Show Value where
  show = genericShow

derive instance eqValue :: Eq Value

instance ordValue :: Ord Value where
  compare (DomainVal x) (DomainVal y) = compare x y
  compare (StrVal x) (StrVal y) = compare x y
  compare (NumVal x) (NumVal y) = compare x y
  compare (BoolVal x) (BoolVal y) = compare x y
  compare (TimeVal x) (TimeVal y) = compare x y
  compare (ListVal x) (ListVal y) = compare x y
  compare (JsonVal x) (JsonVal y) = compare x y
  -- TODO: is there safe method to do ord?
  compare _ _ = unsafeCrashWith "the comparsion failed because we are comparing different types of value"

-- type Properties = Map Identifier Value

type ValueParser = String -> V Issues Value

isEmpty :: Value -> Boolean
isEmpty (DomainVal _) = true
isEmpty (StrVal x) = Str.null x
isEmpty (NumVal _) = true
isEmpty (BoolVal _) = true
isEmpty (TimeVal x) = Str.null x
isEmpty (ListVal x) = Arr.null x
isEmpty (JsonListVal x) = Arr.null x
isEmpty (JsonVal x) = Str.null x

getListValues :: Value -> Array String
getListValues (ListVal x) = x
getListValues (JsonListVal x) = x
getListValues _ = []

-- | check if string is empty
-- TODO: see if we can trace the field which the value is in
parseNonEmptyString :: String -> V Issues NonEmptyString
parseNonEmptyString input =
  case fromString input of
    Nothing -> invalid [ mkIssueWithValue E_VAL_EMPTY input ]
    Just str -> pure str

-- | parse a concept value — the value MUST be one of the concept IDs provided.
parseConceptVal :: HashSet String -> String -> V Issues Value
parseConceptVal conceptVals input =
  let
    msg = show input <> " is not a valid concept in this dataset."
    addMessage issue = issue # withMessage msg
  in
    case fromString input of
      Nothing -> invalid $ [ mkIssueWithValue E_VAL_CONSTRAINT_CONCEPT input # addMessage ]
      Just s ->
        if HS.member input conceptVals then
          pure $ DomainVal s
        else
          invalid $ [ mkIssueWithValue E_VAL_CONSTRAINT_CONCEPT input # addMessage ]

-- | parse a domain value
-- | When `allowEmpty` is true, empty strings are accepted and returned as `StrVal ""`.
parseDomainVal :: Boolean -> String -> HashSet String -> String -> V Issues Value
parseDomainVal allowEmpty domain domainVals input =
  let
    msg = show input <> " is not valid value in " <> domain <> " domain."
    addMessage issue = issue # withMessage msg
  in
    case fromString input of
      Nothing ->
        if allowEmpty then
          pure $ StrVal ""
        else
          invalid $ [ mkIssueWithValue E_VAL_CONSTRAINT_DOMAIN input # addMessage ]
      Just s ->
        if HS.member input domainVals then
          pure $ DomainVal s
        else
          invalid $ [ mkIssueWithValue E_VAL_CONSTRAINT_DOMAIN input # addMessage ]

-- | parse a domain value with constraint
parseConstrainedDomainVal :: HashSet String -> String -> V Issues Value
parseConstrainedDomainVal constraint input =
  let
    constraint_str = Str.joinWith ", " $ HS.toArray constraint
    msg = show input <> " is not valid value within the constraints [ " <> constraint_str <> " ]"
    addMessage issue = issue # withMessage msg
  in
    case fromString input of
      Nothing -> invalid $ [ mkIssueWithValue E_VAL_CONSTRAINT_FILENAME input # addMessage ]
      Just s ->
        if HS.member input constraint then
          pure $ DomainVal s
        else
          invalid $ [ mkIssueWithValue E_VAL_CONSTRAINT_FILENAME input # addMessage ]

parseStrVal :: String -> V Issues Value
parseStrVal x = pure $ StrVal x

-- | just return string value
parseStrVal' :: String -> Value
parseStrVal' = StrVal

parseBoolVal :: String -> V Issues Value
parseBoolVal "TRUE" = pure $ BoolVal true
parseBoolVal "true" = pure $ BoolVal true
parseBoolVal "True" = pure $ BoolVal true
parseBoolVal "FALSE" = pure $ BoolVal false
parseBoolVal "false" = pure $ BoolVal false
parseBoolVal "False" = pure $ BoolVal false
parseBoolVal x = invalid [ mkIssueWithValue E_VAL_BOOL x ]

-- Num.fromString use parseFloat() from js which allows whitespace prefix and other chars at
-- the end.
-- TODO: Need to find a better way or write my own
parseNumVal :: String -> V Issues Value
parseNumVal input =
  case Num.fromString input of
    Nothing -> invalid [ mkIssueWithValue E_VAL_NUM input ]
    Just n -> pure $ NumVal n

-- TODO add more complex time parser.
parseTimeVal :: ValueParser
parseTimeVal input =
  if (inputlen <= 4) && (inputlen >= 3) && (isJust $ Int.fromString input) then
    pure $ TimeVal input
  else
    invalid [ mkIssueWithValue E_VAL_TIME input ]
  where
  inputlen = Str.length input

-- | parse a json list (mostly for drill ups), which is a list of string in Json format.
parseJsonListVal :: ValueParser
parseJsonListVal input =
  if Str.null input then -- empty string is valid too.

    pure $ JsonListVal []
  else
    let
      output :: Either MultipleErrors (Array String)
      output = JSON.readJSON input
    in
      case output of
        Left errs ->
          invalid $ Arr.fromFoldable issues
          where
          issues = (\err -> mkIssueWithValue E_VAL_JSON input # withMessage (renderHumanError err)) <$> errs
        Right s -> pure $ JsonListVal s
