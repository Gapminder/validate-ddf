module Data.Validation.Issue where

import Prelude

import Data.List (List)
import Data.Maybe (Maybe(..))
import Node.Path (FilePath)
import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Data.Validation.Semigroup (V, validation, invalid)
import Data.Validation.Registry (ErrorCode, formatError)
import Data.Validation.Registry as Registry

type Msg = String

-- | Context information for where an error occurred
type ErrorContext =
  { filepath :: Maybe FilePath
  , lineNo :: Maybe Int
  , value :: Maybe String -- For invalid values
  }

-- | Empty error context
emptyContext :: ErrorContext
emptyContext = { filepath: Nothing, lineNo: Nothing, value: Nothing }

-- | Create context with filepath and line number
withLocation :: FilePath -> Int -> ErrorContext
withLocation fp line = { filepath: Just fp, lineNo: Just line, value: Nothing }

-- | Create context with invalid value
withValue :: String -> ErrorContext
withValue val = { filepath: Nothing, lineNo: Nothing, value: Just val }

-- | Create context with filepath, line number, and value
withLocationAndValue :: FilePath -> Int -> String -> ErrorContext
withLocationAndValue fp line val = { filepath: Just fp, lineNo: Just line, value: Just val }

-- | The issue type
-- | Supports both old-style (with inline messages) and new-style (with error codes)
data Issue
  = NotImplemented
  | Issue Msg
  | InvalidValue String Msg
  | InvalidCSV Msg
  | InvalidItem FilePath Int Msg
  -- New-style: single constructor with error code and context
  | CodedIssue ErrorCode ErrorContext

instance showId :: Show Issue where
  show NotImplemented = "Not Implemented"
  show (Issue msg) = msg
  show (InvalidValue str msg) = "invalid value " <> show str <> ": " <> msg
  show (InvalidCSV msg) = msg
  show (InvalidItem _ _ msg) = msg
  show (CodedIssue code ctx) =
    case ctx.value of
      Just val -> "invalid value " <> show val <> ": " <> formatError code
      Nothing -> formatError code

type Issues = Array Issue

-- | when we want to add file and row to the issue, we should change it to InvalidItem
toInvaildItem :: FilePath -> Int -> Issue -> Issue
toInvaildItem _ _ NotImplemented = NotImplemented
toInvaildItem fp row (CodedIssue code ctx) =
  CodedIssue code (ctx { filepath = Just fp, lineNo = Just row })
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
    update (CodedIssue code ctx) = CodedIssue code (ctx { filepath = Just fp })
    update other = other
  in
    validation (\issues -> invalid $ map update issues) pure

-- | extract the invalid value from InvalidValue
extractInvalidValue :: Issue -> String
extractInvalidValue (InvalidValue str _) = str
extractInvalidValue (CodedIssue _ ctx) = case ctx.value of
  Just val -> val
  Nothing -> ""
extractInvalidValue _ = ""

-- | update message
updateMessage :: Issue -> (Msg -> Msg) -> Issue
updateMessage (Issue m) f = Issue (f m)
updateMessage (InvalidValue v m) f = InvalidValue v (f m)
updateMessage (InvalidCSV m) f = InvalidCSV (f m)
updateMessage (InvalidItem fp v m) f = InvalidItem fp v (f m)
updateMessage x _ = x
