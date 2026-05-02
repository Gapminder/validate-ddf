module Data.Validation.Issue where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.List (List)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Data.Validation.Registry
  ( ConceptContext
  , CsvContext
  , DatapointContext
  , DatasetContext
  , EntityContext
  , ErrorCode
  , ErrorContext
  , FileContext
  , ValueContext
  , emptyContext
  , formatError
  , mkConceptContext
  , mkConceptContextWithField
  , mkCsvContext
  , mkDatapointContext
  , mkDatasetContext
  , mkEntityContext
  , mkEntityContextWithSet
  , mkFileContext
  , mkValueContext
  )
import Data.Validation.Registry as Registry
import Data.Validation.Semigroup (V, invalid, validation)
import Node.Path (FilePath)

type Msg = String

-- | The issue type - single constructor with error code and context
data Issue
  = CodedIssue ErrorCode ErrorContext
  | NotImplemented

instance showId :: Show Issue where
  show (CodedIssue code ctx) = formatIssue code ctx
  show NotImplemented = "Not Implemented"

-- | Format an issue with location information if present
formatIssue :: ErrorCode -> ErrorContext -> String
formatIssue code ctx =
  let
    -- Base error message
    baseMsg = formatError code ctx

    -- Add location prefix if available
    locPrefix = case ctx.fileContext of
      Just { filepath, lineNo } -> filepath <> ":" <> show lineNo <> " - "
      Nothing -> ""

    -- Add value wrapper if present
    withValueWrapper = case ctx.valueContext of
      Just { value } -> "invalid value " <> show value <> ": " <> baseMsg
      Nothing -> baseMsg
  in
    locPrefix <> withValueWrapper

type Issues = Array Issue

-- Helper functions for creating issues with common patterns

-- | Create a simple issue with just an error code
mkIssue :: ErrorCode -> Issue
mkIssue code = CodedIssue code emptyContext

-- | Create an issue with a value
mkIssueWithValue :: ErrorCode -> String -> Issue
mkIssueWithValue code val =
  CodedIssue code $
    emptyContext { valueContext = Just $ mkValueContext val }

-- | Create an issue with a custom message (for E_GENERAL/W_GENERAL)
mkIssueWithMessage :: ErrorCode -> String -> Issue
mkIssueWithMessage code msg =
  CodedIssue code $ emptyContext { message = Just msg }

-- Helper functions for updating issue context

-- | Update error context for an issue
updateContext :: (ErrorContext -> ErrorContext) -> Issue -> Issue
updateContext f (CodedIssue code ctx) = CodedIssue code (f ctx)
updateContext _ issue = issue

-- | Add file context to an issue
withFileContext :: FileContext -> Issue -> Issue
withFileContext fc = updateContext (\ctx -> ctx { fileContext = Just fc })

-- | Add value context to an issue
withValueContext :: ValueContext -> Issue -> Issue
withValueContext vc = updateContext (\ctx -> ctx { valueContext = Just vc })

-- | Add concept context to an issue
withConceptContext :: ConceptContext -> Issue -> Issue
withConceptContext cc = updateContext (\ctx -> ctx { conceptContext = Just cc })

-- | Add entity context to an issue
withEntityContext :: EntityContext -> Issue -> Issue
withEntityContext ec = updateContext (\ctx -> ctx { entityContext = Just ec })

-- | Add datapoint context to an issue
withDatapointContext :: DatapointContext -> Issue -> Issue
withDatapointContext dc = updateContext (\ctx -> ctx { datapointContext = Just dc })

-- | Add CSV context to an issue
withCsvContext :: CsvContext -> Issue -> Issue
withCsvContext cc = updateContext (\ctx -> ctx { csvContext = Just cc })

-- | Add dataset context to an issue
withDatasetContext :: DatasetContext -> Issue -> Issue
withDatasetContext dc = updateContext (\ctx -> ctx { datasetContext = Just dc })

-- | Add additional message to an issue
withMessage :: String -> Issue -> Issue
withMessage msg = updateContext (\ctx -> ctx { message = Just msg })

-- | Add per-issue suggestion (overrides the static errorSuggestion for this code)
withSuggestion :: String -> Issue -> Issue
withSuggestion s = updateContext (\ctx -> ctx { suggestion = Just s })

-- Convenience helpers that build contexts from primitives

-- | Add file location (filepath + line number) to an issue
withFileLocation :: FilePath -> Int -> Issue -> Issue
withFileLocation fp ln = withFileContext (mkFileContext fp ln)

-- | Add value to an issue
withValue :: String -> Issue -> Issue
withValue val = withValueContext (mkValueContext val)

-- | Add concept to an issue
withConcept :: String -> Issue -> Issue
withConcept concept = withConceptContext (mkConceptContext concept)

-- | Add concept with field to an issue
withConceptField :: String -> String -> Issue -> Issue
withConceptField concept field =
  withConceptContext (mkConceptContextWithField concept field)

-- | Add entity to an issue
withEntity :: String -> String -> Issue -> Issue
withEntity entity domain = withEntityContext (mkEntityContext entity domain)

-- | Add entity with set to an issue
withEntitySet :: String -> String -> String -> Issue -> Issue
withEntitySet entity domain set =
  withEntityContext (mkEntityContextWithSet entity domain set)

-- | Add CSV header to an issue
withHeader :: String -> Issue -> Issue
withHeader header = withCsvContext (mkCsvContext header)

-- Deprecated helper functions (kept for backward compatibility)

-- | Add file and row to the issue
toInvaildItem :: FilePath -> Int -> Issue -> Issue
toInvaildItem fp row (CodedIssue code ctx) =
  CodedIssue code (ctx { fileContext = Just $ mkFileContext fp row })
toInvaildItem _ _ NotImplemented = NotImplemented

-- | run a validation with row info
withRowInfo :: forall a. FilePath -> Int -> V Issues a -> V Issues a
withRowInfo fp row =
  validation (\issues -> invalid $ map (toInvaildItem fp row) issues) pure

-- | update the file of an invalid item
updateFilePath :: forall a. FilePath -> V Issues a -> V Issues a
updateFilePath fp =
  let
    update (CodedIssue code ctx) =
      let
        newFileContext = case ctx.fileContext of
          Just fc -> Just $ fc { filepath = fp }
          Nothing -> Just $ mkFileContext fp 0
      in
        CodedIssue code (ctx { fileContext = newFileContext })
    update other = other
  in
    validation (\issues -> invalid $ map update issues) pure

-- | extract the invalid value from issue context
extractInvalidValue :: Issue -> String
extractInvalidValue (CodedIssue _ ctx) = case ctx.valueContext of
  Just { value } -> value
  Nothing -> ""
extractInvalidValue _ = ""

-- | update message (deprecated - use withMessage instead)
updateMessage :: Issue -> (Msg -> Msg) -> Issue
updateMessage (CodedIssue code ctx) f =
  let
    newMsg = case ctx.message of
      Just m -> Just (f m)
      Nothing -> Just (f "")
  in
    CodedIssue code (ctx { message = newMsg })
updateMessage x _ = x
