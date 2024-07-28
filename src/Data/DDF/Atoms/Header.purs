module Data.DDF.Atoms.Header where

import Prelude
import StringParser

import Control.Alt ((<|>))
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.Either (Either(..), fromLeft, fromRight, isLeft)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, unwrap)
import Data.Newtype (class Newtype, unwrap)
import Data.Show.Generic (genericShow)
import Data.String (Pattern(..), take)
import Data.String.NonEmpty (fromString, join1With, toString, stripPrefix)
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, andThen, invalid, isValid, toEither)


newtype Header
  = Header NonEmptyString

derive instance newtypeHeader :: Newtype Header _

derive instance genericHeader :: Generic Header _

derive instance eqHeader :: Eq Header

derive instance ordHeader :: Ord Header

instance showHeader :: Show Header where
  show = genericShow

headerVal :: Header -> NonEmptyString
headerVal = unwrap

-- | parse is--entity_set headers
is_header :: Parser NonEmptyString
is_header = do
  begin <- string "is--"
  val <- Id.identifier
  pure $ (NonEmptyString begin) <> val

-- | parse valid entity file header
entityHeader :: Parser NonEmptyString
entityHeader = do
  h <- is_header <|> Id.identifier
  void $ eof
  pure h

-- | parse other file header
generalHeader :: Parser NonEmptyString
generalHeader = do
  h <- Id.identifier
  void $ eof
  pure h

-- | run general header parser
parseGeneralHeader :: String -> V Issues Header
parseGeneralHeader x = case runParser generalHeader x of
  Right str -> pure $ Header str
  Left e -> invalid [ err ]
    where
    pos = show $ e.pos

    msg = "invalid header: " <> x <> ", " <> e.error <> "at pos " <> pos

    err = InvalidCSV msg

-- | run entity header parser
parseEntityHeader :: String -> V Issues Header
parseEntityHeader x = case runParser entityHeader x of
  Right str -> pure $ Header str
  Left e -> invalid [ err ]
    where
    pos = show $ e.pos

    msg = "invalid header: " <> x <> ", " <> e.error <> "at pos " <> pos

    err = InvalidCSV msg


-- | unsafe create an id, because we won't check the string.
-- | only use this when you know what you are doning
unsafeCreate :: String -> Header
unsafeCreate x = case fromString x of
  Just a -> Header a
  Nothing -> Header $ NonEmptyString "undefined_id"

-- | check if the header is is--entity_set header
isEntitySetHeader :: Header -> Boolean
isEntitySetHeader (Header x) =
  (take 4 $ toString x) == "is--"