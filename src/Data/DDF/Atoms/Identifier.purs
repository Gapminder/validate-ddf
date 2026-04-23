module Data.DDF.Atoms.Identifier where

import Data.Validation.Semigroup
import Prelude
import StringParser

import Control.Alt ((<|>))
import Data.Array.NonEmpty (fromFoldable1)
import Data.Either (Either(..))
import Data.Hashable (class Hashable, hash)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, unwrap)
import Data.String as Str
import Data.String.CodeUnits as SCU
import Data.String.NonEmpty.CodeUnits (charAt, fromNonEmptyCharArray)
import Data.String.NonEmpty.Internal (NonEmptyString(..), fromString, toString)
import Data.Validation.Issue (Issue(..), Issues, mkIssueWithValue, withMessage)
import Data.Validation.Registry (ErrorCode(..))

-- | identifiers are strings, but MUST be non empty and
-- | and consisted with alphanumeric chars and underscores.
newtype Identifier = Id NonEmptyString

derive instance newtypeId :: Newtype Identifier _

derive instance eqId :: Eq Identifier

derive instance ordId :: Ord Identifier

instance hashableId :: Hashable Identifier where
  hash (Id (NonEmptyString x)) = hash x

instance showId :: Show Identifier where
  show (Id x) = "(Id " <> (show $ toString x) <> ")"

value :: Identifier -> String
value (Id x) = toString $ x

value1 :: Identifier -> NonEmptyString
value1 (Id x) = x

-- | parse lower case alphanum strings
alphaNum :: Parser Char
alphaNum =
  lowerCaseChar <|> anyDigit
    <?> "expect lowercase alphanumeric value"

-- | parse lower case alphanum strings also allow underscores inside
alphaNumAnd_ :: Parser Char
alphaNumAnd_ =
  alphaNum <|> char '_'
    <?> "expect alphanumeric and underscore(_)"

-- | parse identifier strings.
-- | note this parser doesn't parse whole string, it's used in parsing ddf filenames
identifier :: Parser NonEmptyString
identifier = do
  chars <- many1 alphaNumAnd_
  pure $ stringFromChars chars
  where
  stringFromChars = fromNonEmptyCharArray <<< fromFoldable1

-- | check if the whole string is an identifer
identifier' :: Parser NonEmptyString
identifier' = identifier <* eof

-- | parse an id
parseId :: String -> V Issues Identifier
parseId x = case runParser identifier' x of
  Right str -> pure $ Id str
  Left e ->
    let
      suffix = " — identifiers may only contain lowercase letters (a-z), digits (0-9), and underscores"
      charMsg = case SCU.charAt e.pos x of
        Nothing -> "unexpected end of string"
        Just c -> "unexpected character '" <> SCU.singleton c <> "' at position " <> show (e.pos + 1)
      msg = "\"" <> x <> "\": " <> charMsg <> suffix
    in
      invalid [ mkIssueWithValue E_VAL_ID x # withMessage msg ]

-- | parse an id, when the id is non empty string
parseId' :: NonEmptyString -> V Issues Identifier
parseId' = parseId <<< toString

-- | check if identifier longer than 64 chars
-- | idenfitier longer than 64 chars is know to break WS server
isLongerThan64Chars :: Identifier -> V Issues Identifier
isLongerThan64Chars a =
  let
    str = unwrap a
  in
    case charAt 64 str of
      Nothing -> pure a
      Just _ ->
        invalid [ mkIssueWithValue W_VAL_ID trimedstr ]
        where
        trimedstr = (Str.take 15 $ toString str) <> "..."

-- | parse an id, return Either instead
create :: String -> Either Issues Identifier
create x = toEither $ parseId x

-- | unsafe create an id, because we won't check the string.
-- | only use this when you know what you are doning
unsafeCreate :: String -> Identifier
unsafeCreate x = case fromString x of
  Just a -> Id a
  Nothing -> Id $ NonEmptyString "undefined_id"
