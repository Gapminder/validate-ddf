-- | Registry module that stores all validation error codes and their descriptions
-- | This centralizes all error messages for better maintainability and i18n support
module Data.Validation.Registry
  ( ErrorCode(..)
  , ErrorContext
  , FileContext
  , ValueContext
  , ConceptContext
  , EntityContext
  , DatapointContext
  , CsvContext
  , DatasetContext
  , emptyContext
  , mkFileContext
  , mkValueContext
  , mkConceptContext
  , mkConceptContextWithField
  , mkEntityContext
  , mkEntityContextWithSet
  , mkDatapointContext
  , mkCsvContext
  , mkDatasetContext
  , errorCodeToString
  , errorMessageTemplate
  , formatErrorMessage
  , formatError
  , errorSuggestion
  ) where

import Prelude

import Data.Maybe (Maybe(..))
import Data.String (joinWith)
import Node.Path (FilePath)

-- | Structured context types - each contains required fields (no Maybe inside)

-- | File location context - where in a file the error occurred
type FileContext =
  { filepath :: FilePath
  , lineNo :: Int
  }

-- | Value context - for errors related to specific values
type ValueContext =
  { value :: String
  }

-- | Concept context - for concept-related errors
type ConceptContext =
  { concept :: String
  , field :: Maybe String -- Optional field name within concept
  }

-- | Entity context - for entity-related errors
type EntityContext =
  { entity :: String
  , domain :: String
  , set :: Maybe String -- Sets are optional
  }

-- | Datapoint context - for datapoint-related errors
type DatapointContext =
  { indicator :: String
  , pkeys :: Array String
  }

-- | CSV context - for CSV structure errors (headers, columns)
type CsvContext =
  { header :: String -- The problematic header
  }

-- | Dataset context - for dataset-level errors
type DatasetContext =
  { message :: String -- Custom dataset-level message
  }

-- | Main error context - composed of optional sub-contexts
-- | Only the top-level fields are Maybe, enforcing completeness of sub-contexts
type ErrorContext =
  { fileContext :: Maybe FileContext
  , valueContext :: Maybe ValueContext
  , conceptContext :: Maybe ConceptContext
  , entityContext :: Maybe EntityContext
  , datapointContext :: Maybe DatapointContext
  , csvContext :: Maybe CsvContext
  , datasetContext :: Maybe DatasetContext
  , message :: Maybe String -- Additional freeform message/reason
  }

-- | Empty error context - use as starting point
emptyContext :: ErrorContext
emptyContext =
  { fileContext: Nothing
  , valueContext: Nothing
  , conceptContext: Nothing
  , entityContext: Nothing
  , datapointContext: Nothing
  , csvContext: Nothing
  , datasetContext: Nothing
  , message: Nothing
  }

-- | Helper constructors for creating contexts

mkFileContext :: FilePath -> Int -> FileContext
mkFileContext filepath lineNo = { filepath, lineNo }

mkValueContext :: String -> ValueContext
mkValueContext value = { value }

mkConceptContext :: String -> ConceptContext
mkConceptContext concept = { concept, field: Nothing }

mkConceptContextWithField :: String -> String -> ConceptContext
mkConceptContextWithField concept field = { concept, field: Just field }

mkEntityContext :: String -> String -> EntityContext
mkEntityContext entity domain = { entity, domain, set: Nothing }

mkEntityContextWithSet :: String -> String -> String -> EntityContext
mkEntityContextWithSet entity domain set = { entity, domain, set: Just set }

mkDatapointContext :: String -> Array String -> DatapointContext
mkDatapointContext indicator pkeys = { indicator, pkeys }

mkCsvContext :: String -> CsvContext
mkCsvContext header = { header }

mkDatasetContext :: String -> DatasetContext
mkDatasetContext message = { message }

-- | Error code type representing all possible validation errors
-- | Simple enum without embedded parameters - all context goes in ErrorContext
data ErrorCode
  -- Value Errors
  = E_VAL_ID
  | W_VAL_ID
  | E_VAL_NUM
  | E_VAL_TIME
  | E_VAL_JSON
  | E_VAL_BOOL
  | E_VAL_STR
  | E_VAL_CONSTRAINT_FILENAME
  | E_VAL_CONSTRAINT_DOMAIN
  | E_VAL_EMPTY
  -- Concept Errors
  | E_CONCEPT_ID_RESERVED
  | E_CONCEPT_ID_INVALID
  | E_CONCEPT_ID_EMPTY
  | W_CONCEPT_ID_TOOLONG
  | E_CONCEPT_TIME_INVALID
  | E_CONCEPT_FIELD_EMPTY
  | E_CONCEPT_FIELD_MISSING
  -- Entity Errors
  | E_ENTITY_INCONSISTENT_DOMAIN
  | E_ENTITY_ID_EMPTY
  -- Datapoints Errors
  -- other types, e.g. Synonyms and Translations
  -- Dataset Errors
  | E_DATASET_NO_CONCEPT
  | E_DATASET_CONCEPT_DUPLICATED
  | E_DATASET_CONCEPT_NOT_FOUND
  | E_DATASET_CONCEPT_INVALID_DOMAIN
  | E_DATASET_CONCEPT_MISSING_DOMAIN
  | E_DATASET_ENTITYSET_UNDEFINED
  | E_DATASET_ENTITY_DRILLUP_INVALID
  | E_DATASET_ENTITYDOMAIN_INVAILD
  | E_DATASET_ENTITY_DUPLICATED
  -- Datapackage Errors
  | E_DATAPACKAGE_NOT_FOUND
  | E_DATAPACKAGE_PARSE_ERROR
  | E_DATAPACKAGE_RESOURCE_MISSING
  | E_DATAPACKAGE_RESOURCE_DUPLICATED
  | E_DATAPACKAGE_SCHEMA_MISMATCH
  -- CSV Errors
  | E_CSV_EMPTY
  | E_CSV_HEADER_COLUMN_MISMATCH
  | E_CSV_HEADER_INVALID
  | E_CSV_HEADER_MISSING
  | E_CSV_HEADER_CONFLICT
  | E_CSV_HEADER_UNEXPECTED
  | E_CSV_HEADER_DUPLICATED
  | E_CSV_HEADER_CONSTRAINT
  | E_CSV_ROW_DUPLICATED
  | E_CSV_ROW_BAD
  -- CSV format errors (byte-level)
  | W_CSV_FORMAT_BOM
  | W_CSV_FORMAT_CRLF
  | E_CSV_FORMAT_ENCODING
  -- Others
  | E_GENERAL
  | W_GENERAL

derive instance eqErrorCode :: Eq ErrorCode
derive instance ordErrorCode :: Ord ErrorCode

instance showErrorCode :: Show ErrorCode where
  show = errorCodeToString

-- | Convert error code to string identifier (e.g., "E_VAL_NUM")
errorCodeToString :: ErrorCode -> String
errorCodeToString = case _ of
  E_VAL_ID -> "E_VAL_ID"
  W_VAL_ID -> "W_VAL_ID"
  E_VAL_NUM -> "E_VAL_NUM"
  E_VAL_TIME -> "E_VAL_TIME"
  E_VAL_JSON -> "E_VAL_JSON"
  E_VAL_BOOL -> "E_VAL_BOOL"
  E_VAL_STR -> "E_VAL_STR"
  E_VAL_CONSTRAINT_FILENAME -> "E_VAL_CONSTRAINT_FILENAME"
  E_VAL_CONSTRAINT_DOMAIN -> "E_VAL_CONSTRAINT_DOMAIN"
  E_VAL_EMPTY -> "E_VAL_EMPTY"
  E_CONCEPT_ID_RESERVED -> "E_CONCEPT_ID_RESERVED"
  E_CONCEPT_ID_INVALID -> "E_CONCEPT_ID_INVALID"
  E_CONCEPT_ID_EMPTY -> "E_CONCEPT_ID_EMPTY"
  W_CONCEPT_ID_TOOLONG -> "W_CONCEPT_ID_TOOLONG"
  E_CONCEPT_TIME_INVALID -> "E_CONCEPT_TIME_INVALID"
  E_CONCEPT_FIELD_EMPTY -> "E_CONCEPT_FIELD_EMPTY"
  E_CONCEPT_FIELD_MISSING -> "E_CONCEPT_FIELD_MISSING"
  E_ENTITY_INCONSISTENT_DOMAIN -> "E_ENTITY_INCONSISTENT_DOMAIN"
  E_ENTITY_ID_EMPTY -> "E_ENTITY_ID_EMPTY"
  E_DATASET_NO_CONCEPT -> "E_DATASET_NO_CONCEPT"
  E_DATASET_CONCEPT_DUPLICATED -> "E_DATASET_CONCEPT_DUPLICATED"
  E_DATASET_CONCEPT_NOT_FOUND -> "E_DATASET_CONCEPT_NOT_FOUND"
  E_DATASET_CONCEPT_INVALID_DOMAIN -> "E_DATASET_CONCEPT_INVALID_DOMAIN"
  E_DATASET_CONCEPT_MISSING_DOMAIN -> "E_DATASET_CONCEPT_MISSING_DOMAIN"
  E_DATASET_ENTITYSET_UNDEFINED -> "E_DATASET_ENTITYSET_UNDEFINED"
  E_DATASET_ENTITY_DRILLUP_INVALID -> "E_DATASET_ENTITY_DRILLUP_INVALID"
  E_DATASET_ENTITYDOMAIN_INVAILD -> "E_DATASET_ENTITYDOMAIN_INVAILD"
  E_DATASET_ENTITY_DUPLICATED -> "E_DATASET_ENTITY_DUPLICATED"
  E_DATAPACKAGE_NOT_FOUND -> "E_DATAPACKAGE_NOT_FOUND"
  E_DATAPACKAGE_PARSE_ERROR -> "E_DATAPACKAGE_PARSE_ERROR"
  E_DATAPACKAGE_RESOURCE_MISSING -> "E_DATAPACKAGE_RESOURCE_MISSING"
  E_DATAPACKAGE_RESOURCE_DUPLICATED -> "E_DATAPACKAGE_RESOURCE_DUPLICATED"
  E_DATAPACKAGE_SCHEMA_MISMATCH -> "E_DATAPACKAGE_SCHEMA_MISMATCH"
  E_CSV_EMPTY -> "E_CSV_EMPTY"
  E_CSV_HEADER_COLUMN_MISMATCH -> "E_CSV_HEADER_COLUMN_MISMATCH"
  E_CSV_HEADER_INVALID -> "E_CSV_HEADER_INVALID"
  E_CSV_HEADER_MISSING -> "E_CSV_HEADER_MISSING"
  E_CSV_HEADER_CONFLICT -> "E_CSV_HEADER_CONFLICT"
  E_CSV_HEADER_UNEXPECTED -> "E_CSV_HEADER_UNEXPECTED"
  E_CSV_HEADER_DUPLICATED -> "E_CSV_HEADER_DUPLICATED"
  E_CSV_HEADER_CONSTRAINT -> "E_CSV_HEADER_CONSTRAINT"
  E_CSV_ROW_DUPLICATED -> "E_CSV_ROW_DUPLICATED"
  E_CSV_ROW_BAD -> "E_CSV_ROW_BAD"
  W_CSV_FORMAT_BOM -> "W_CSV_FORMAT_BOM"
  W_CSV_FORMAT_CRLF -> "W_CSV_FORMAT_CRLF"
  E_CSV_FORMAT_ENCODING -> "E_CSV_FORMAT_ENCODING"
  E_GENERAL -> "E_GENERAL"
  W_GENERAL -> "W_GENERAL"

-- | Get the base error message template for an error code (without context)
errorMessageTemplate :: ErrorCode -> String
errorMessageTemplate = case _ of
  E_VAL_ID -> "invalid identifier"
  W_VAL_ID -> "identifier longer than 64 characters"
  E_VAL_NUM -> "invalid number value"
  E_VAL_TIME -> "invalid time value"
  E_VAL_JSON -> "invalid JSON value"
  E_VAL_BOOL -> "invalid boolean value"
  E_VAL_STR -> "invalid string value"
  E_VAL_CONSTRAINT_FILENAME -> "value violates filename constraint"
  E_VAL_CONSTRAINT_DOMAIN -> "value violates domain constraint"
  E_VAL_EMPTY -> "value is empty"
  E_CONCEPT_ID_RESERVED -> "concept ID is a reserved word"
  E_CONCEPT_ID_INVALID -> "concept ID contains invalid characters"
  E_CONCEPT_ID_EMPTY -> "concept ID is empty"
  W_CONCEPT_ID_TOOLONG -> "concept ID is longer than 64 characters"
  E_CONCEPT_TIME_INVALID -> "time concept must be one of: year, month, day, week, quarter, time"
  E_CONCEPT_FIELD_EMPTY -> "concept field is empty"
  E_CONCEPT_FIELD_MISSING -> "required concept field is missing"
  E_ENTITY_INCONSISTENT_DOMAIN -> "entity has inconsistent domain"
  E_ENTITY_ID_EMPTY -> "entity ID is empty"
  E_DATASET_NO_CONCEPT -> "dataset has no concepts file"
  E_DATASET_CONCEPT_DUPLICATED -> "duplicate concept found in dataset"
  E_DATASET_CONCEPT_NOT_FOUND -> "concept not found in dataset"
  E_DATASET_CONCEPT_INVALID_DOMAIN -> "concept has invalid domain"
  E_DATASET_CONCEPT_MISSING_DOMAIN -> "concept is missing domain field"
  E_DATASET_ENTITYSET_UNDEFINED -> "entity set is not defined"
  E_DATASET_ENTITY_DRILLUP_INVALID -> "entity drill_up is invalid"
  E_DATASET_ENTITYDOMAIN_INVAILD -> "entity domain is invalid"
  E_DATASET_ENTITY_DUPLICATED -> "duplicate entity found in dataset"
  E_DATAPACKAGE_NOT_FOUND -> "datapackage.json not found"
  E_DATAPACKAGE_PARSE_ERROR -> "failed to parse datapackage.json or its resources"
  E_DATAPACKAGE_RESOURCE_MISSING -> "resource file missing from datapackage"
  E_DATAPACKAGE_RESOURCE_DUPLICATED -> "duplicated resource in datapackage"
  E_DATAPACKAGE_SCHEMA_MISMATCH -> "schema in datapackage differs from actual file"
  E_CSV_EMPTY -> "CSV file is empty"
  E_CSV_HEADER_COLUMN_MISMATCH -> "CSV header count doesn't match column count"
  E_CSV_HEADER_INVALID -> "CSV header is invalid"
  E_CSV_HEADER_MISSING -> "required CSV header is missing"
  E_CSV_HEADER_CONFLICT -> "CSV header conflicts with another header"
  E_CSV_HEADER_UNEXPECTED -> "unexpected CSV header"
  E_CSV_HEADER_DUPLICATED -> "duplicate CSV header"
  E_CSV_HEADER_CONSTRAINT -> "CSV header violates constraint"
  E_CSV_ROW_DUPLICATED -> "duplicate row in CSV"
  E_CSV_ROW_BAD -> "inconsistent column count"
  W_CSV_FORMAT_BOM -> "file has a UTF-8 BOM — per DDF spec the encoding SHOULD NOT use a BOM"
  W_CSV_FORMAT_CRLF -> "file uses Windows line endings (CRLF) — per DDF spec LF line endings are preferred"
  E_CSV_FORMAT_ENCODING -> "file is not valid UTF-8 — DDF spec requires UTF-8 encoding"
  E_GENERAL -> "validation error"
  W_GENERAL -> "validation warning"

-- | Format error message with context interpolation
formatErrorMessage :: ErrorCode -> ErrorContext -> String
formatErrorMessage code ctx =
  let
    baseMsg = errorMessageTemplate code

    -- Helper to build context suffix
    parts = []

    -- Add concept context if present
    withConcept = case ctx.conceptContext of
      Just { concept, field } ->
        let
          conceptPart = "concept: " <> concept
          fieldPart = case field of
            Just f -> ", field: " <> f
            Nothing -> ""
        in
          parts <> [ conceptPart <> fieldPart ]
      Nothing -> parts

    -- Add entity context if present
    withEntity = case ctx.entityContext of
      Just { entity, domain, set } ->
        let
          entityPart = "entity: " <> entity
          domainPart = ", domain: " <> domain
          setPart = case set of
            Just s -> ", set: " <> s
            Nothing -> ""
        in
          withConcept <> [ entityPart <> domainPart <> setPart ]
      Nothing -> withConcept

    -- Add datapoint context if present
    withDatapoint = case ctx.datapointContext of
      Just { indicator, pkeys } ->
        let
          indicatorPart = "indicator: " <> indicator
          pkeysPart = if pkeys == [] then "" else ", pkeys: " <> show pkeys
        in
          withEntity <> [ indicatorPart <> pkeysPart ]
      Nothing -> withEntity

    -- Add CSV context if present
    withCsv = case ctx.csvContext of
      Just { header } -> withDatapoint <> [ "header: " <> header ]
      Nothing -> withDatapoint

    -- Add dataset context if present
    withDataset = case ctx.datasetContext of
      Just { message: msg } -> withCsv <> [ msg ]
      Nothing -> withCsv

    -- Build context suffix
    contextSuffix =
      if withDataset == [] then ""
      else " (" <> joinWith ", " withDataset <> ")"

    -- Add additional message if present
    messageSuffix = case ctx.message of
      Just m -> ": " <> m
      Nothing -> ""

    -- Special handling for E_GENERAL/W_GENERAL - message overrides template
    finalMsg = case code of
      E_GENERAL -> case ctx.message of
        Just m -> m
        Nothing -> baseMsg <> contextSuffix
      W_GENERAL -> case ctx.message of
        Just m -> m
        Nothing -> baseMsg <> contextSuffix
      _ -> baseMsg <> contextSuffix <> messageSuffix
  in
    finalMsg

-- | Format the full error with code prefix and message
formatError :: ErrorCode -> ErrorContext -> String
formatError code ctx =
  errorCodeToString code <> ": " <> formatErrorMessage code ctx

-- | Get suggestion for an error code
-- | Returns empty string for now - to be populated later
errorSuggestion :: ErrorCode -> String
errorSuggestion = case _ of
  E_VAL_ID -> ""
  W_VAL_ID -> ""
  E_VAL_NUM -> ""
  E_VAL_TIME -> ""
  E_VAL_JSON -> ""
  E_VAL_BOOL -> ""
  E_VAL_STR -> ""
  E_VAL_CONSTRAINT_FILENAME -> ""
  E_VAL_CONSTRAINT_DOMAIN -> "Please consult the entity domain file for all valid values."
  E_VAL_EMPTY -> ""
  E_CONCEPT_ID_RESERVED -> ""
  E_CONCEPT_ID_INVALID -> ""
  E_CONCEPT_ID_EMPTY -> ""
  W_CONCEPT_ID_TOOLONG -> ""
  E_CONCEPT_TIME_INVALID -> ""
  E_CONCEPT_FIELD_EMPTY -> ""
  E_CONCEPT_FIELD_MISSING -> ""
  E_ENTITY_INCONSISTENT_DOMAIN -> ""
  E_ENTITY_ID_EMPTY -> ""
  E_DATASET_NO_CONCEPT -> ""
  E_DATASET_CONCEPT_DUPLICATED -> ""
  E_DATASET_CONCEPT_NOT_FOUND -> ""
  E_DATASET_CONCEPT_INVALID_DOMAIN -> ""
  E_DATASET_CONCEPT_MISSING_DOMAIN -> ""
  E_DATASET_ENTITYSET_UNDEFINED -> ""
  E_DATASET_ENTITY_DRILLUP_INVALID -> ""
  E_DATASET_ENTITYDOMAIN_INVAILD -> ""
  E_DATASET_ENTITY_DUPLICATED -> ""
  E_DATAPACKAGE_NOT_FOUND -> ""
  E_DATAPACKAGE_PARSE_ERROR -> ""
  E_DATAPACKAGE_RESOURCE_MISSING -> ""
  E_DATAPACKAGE_RESOURCE_DUPLICATED -> ""
  E_DATAPACKAGE_SCHEMA_MISMATCH -> ""
  E_CSV_EMPTY -> ""
  E_CSV_HEADER_COLUMN_MISMATCH -> ""
  E_CSV_HEADER_INVALID -> ""
  E_CSV_HEADER_MISSING -> ""
  E_CSV_HEADER_CONFLICT -> ""
  E_CSV_HEADER_UNEXPECTED -> ""
  E_CSV_HEADER_DUPLICATED -> ""
  E_CSV_HEADER_CONSTRAINT -> ""
  E_CSV_ROW_DUPLICATED -> ""
  E_CSV_ROW_BAD -> ""
  W_CSV_FORMAT_BOM -> "run validate-ddf --fix to auto-fix this issue"
  W_CSV_FORMAT_CRLF -> "run validate-ddf --fix to auto-fix this issue"
  E_CSV_FORMAT_ENCODING -> "convert the file to UTF-8 encoding"
  E_GENERAL -> ""
  W_GENERAL -> ""
