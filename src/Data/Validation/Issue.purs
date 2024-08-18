module Data.Validation.Issue where

import Prelude

import Data.List (List)
import Node.Path (FilePath)
import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Data.Validation.Semigroup (V, validation, invalid)


type Msg = String


-- | The issue type
data Issue
  = NotImplemented
  | Issue Msg
  | InvalidValue String Msg
  | InvalidCSV Msg
  | InvalidItem FilePath Int Msg

instance showId :: Show Issue where
  show NotImplemented = "Not Implemented"
  show (Issue msg) = msg
  show (InvalidValue str msg) = "invalid value " <> show str <> ": " <> msg
  show (InvalidCSV msg) = msg
  show (InvalidItem _ _ msg) = msg

type Issues = Array Issue


-- | when we want to add file and row to the issue, we should change it to InvalidItem
toInvaildItem :: FilePath -> Int -> Issue -> Issue
toInvaildItem _ _ NotImplemented = NotImplemented
toInvaildItem fp row issue = InvalidItem fp row (show issue)

-- | run a validation with row info
withRowInfo :: forall a. FilePath -> Int -> V Issues a -> V Issues a
withRowInfo fp row =
  validation (\issues -> invalid $ map (toInvaildItem fp row) issues) pure

-- | update the file of an invalid item
updateFilePath :: forall a. FilePath -> V Issues a -> V Issues a
updateFilePath fp =
  let
    update (InvalidItem _ i msg) = InvalidItem fp i msg
    update other = other
  in
    validation (\issues -> invalid $ map update issues) pure

-- | extract the invalid value from InvalidValue
extractInvalidValue :: Issue -> String
extractInvalidValue (InvalidValue str _) = str
extractInvalidValue _ = ""

-- | update message
updateMessage :: Issue -> (Msg -> Msg) -> Issue
updateMessage (Issue m) f = Issue (f m)
updateMessage (InvalidValue v m) f = InvalidValue v (f m)
updateMessage (InvalidCSV m) f = InvalidCSV (f m)
updateMessage (InvalidItem fp v m) f = InvalidItem fp v (f m)
updateMessage x _ = x