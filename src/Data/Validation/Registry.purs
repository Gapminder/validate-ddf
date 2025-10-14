-- | Registry module that stores all validation error codes and their descriptions
-- | This centralizes all error messages for better maintainability and i18n support
-- | Uses typed parameters for type safety
module Data.Validation.Registry where

import Prelude

-- | Parameter record types for common error patterns
type FieldError = { field :: String }
type ConceptError = { concept :: String }
type ConceptIdError = { conceptId :: String }
type DomainError = { domain :: String }
type SetError = { set :: String }
type DomainSetError = { domain :: String, set :: String }
type EntityError = { entity :: String }
type IndicatorPkeysError = { indicator :: String, pkeys :: String }
type HeadersError = { headers :: String }
type HeaderError = { header :: String }
type HeaderDomainError = { header :: String, domain :: String }
type FilepathError = { filepath :: String }
type ParseError = { error :: String }
type InputError = { input :: String }
type ValueError = { value :: String }
type ValueReasonError = { value :: String, reason :: String }
type ResourcesError = { resources :: String }
type KeyError = { key :: String }
type FieldsError = { fields :: String }

-- | Error code type representing all possible validation errors
-- | Each error has its required parameters embedded in the constructor
data ErrorCode
  -- Concept Errors (E1xxx)
  = E1001_ConceptFieldMustExist FieldError
  | E1002_ConceptFieldMustNotBeEmpty FieldError
  | E1003_ReservedConceptId ConceptIdError
  | E1004_NoConceptsInDataset
  | E1005_ConceptNotFound ConceptError
  | E1006_MultipleConceptDefinition ConceptError
  | E1007_ConceptDomainInvalid DomainError
  | E1008_ConceptIdTooLong
  -- Entity Errors (E2xxx)
  | E2001_EntityMustHaveId
  | E2002_EntityDomainNotDefined DomainError
  | E2003_EntityDomainNotValid ConceptError
  | E2004_EntitySetNotDefined SetError
  | E2005_EntitySetNoDomain SetError
  | E2006_EntitySetWrongDomain DomainSetError
  | E2007_EntitySetNotInConcepts ConceptError
  | E2008_EntityIsHeaderMustBeTrue DomainError
  | E2009_MultipleEntityDefinition EntityError
  | E2010_EntityValueNotUnique
  -- DataPoint Errors (E3xxx)
  | E3001_DatapointHeadersMismatch
  | E3002_DatapointDuplicated
  | E3003_NoValidCsvForIndicator IndicatorPkeysError
  -- CSV/File Errors (E4xxx)
  | E4001_NotCsvFile
  | E4002_EmptyCsv
  | E4003_HeaderLengthMismatch
  | E4004_DuplicatedHeaders HeadersError
  | E4005_UnexpectedHeader HeaderDomainError
  | E4006_InvalidHeader HeadersError
  | E4007_FileMustHaveField FieldError
  | E4008_FileMustHaveOneOfFields FieldsError
  | E4009_FileDoesNotExist FilepathError
  | E4010_ErrorParsingFile ParseError
  | E4011_BadCsvRow
  | E4012_TranslationOfTranslationNotAllowed FilepathError
  | E4013_NotTranslationFile
  | E4014_HeaderNotInConceptList HeaderError
  | E4015_EntitySetHeaderNotValid SetError
  | E4016_EntitySetNotInDomain DomainSetError
  -- Value Errors (E5xxx)
  | E5001_ValueMustNotBeEmpty
  | E5002_NotBooleanValue
  | E5003_NotNumber InputError
  | E5004_NotValidTimeValue InputError
  | E5005_InvalidIdentifier ValueError
  | E5006_IdentifierTooLong
  | E5007_InvalidValue ValueReasonError
  -- DataPackage Errors (E6xxx)
  | E6001_NoDatapackage
  | E6002_MissingFileInResourceList ResourcesError
  | E6003_DuplicatedFilePath FilepathError
  | E6004_ResourceInconsistent
  -- General Errors (E7xxx)
  | E7001_NoDdfCsvFiles
  | E7002_NoConceptsFile
  | E7003_KeyNotFound KeyError

derive instance eqErrorCode :: Eq ErrorCode
derive instance ordErrorCode :: Ord ErrorCode

instance showErrorCode :: Show ErrorCode where
  show = formatError

-- | Convert error code to string code (e.g., "E1001")
errorCodeStr :: ErrorCode -> String
errorCodeStr = case _ of
  E1001_ConceptFieldMustExist _ -> "E1001"
  E1002_ConceptFieldMustNotBeEmpty _ -> "E1002"
  E1003_ReservedConceptId _ -> "E1003"
  E1004_NoConceptsInDataset -> "E1004"
  E1005_ConceptNotFound _ -> "E1005"
  E1006_MultipleConceptDefinition _ -> "E1006"
  E1007_ConceptDomainInvalid _ -> "E1007"
  E1008_ConceptIdTooLong -> "E1008"
  E2001_EntityMustHaveId -> "E2001"
  E2002_EntityDomainNotDefined _ -> "E2002"
  E2003_EntityDomainNotValid _ -> "E2003"
  E2004_EntitySetNotDefined _ -> "E2004"
  E2005_EntitySetNoDomain _ -> "E2005"
  E2006_EntitySetWrongDomain _ -> "E2006"
  E2007_EntitySetNotInConcepts _ -> "E2007"
  E2008_EntityIsHeaderMustBeTrue _ -> "E2008"
  E2009_MultipleEntityDefinition _ -> "E2009"
  E2010_EntityValueNotUnique -> "E2010"
  E3001_DatapointHeadersMismatch -> "E3001"
  E3002_DatapointDuplicated -> "E3002"
  E3003_NoValidCsvForIndicator _ -> "E3003"
  E4001_NotCsvFile -> "E4001"
  E4002_EmptyCsv -> "E4002"
  E4003_HeaderLengthMismatch -> "E4003"
  E4004_DuplicatedHeaders _ -> "E4004"
  E4005_UnexpectedHeader _ -> "E4005"
  E4006_InvalidHeader _ -> "E4006"
  E4007_FileMustHaveField _ -> "E4007"
  E4008_FileMustHaveOneOfFields _ -> "E4008"
  E4009_FileDoesNotExist _ -> "E4009"
  E4010_ErrorParsingFile _ -> "E4010"
  E4011_BadCsvRow -> "E4011"
  E4012_TranslationOfTranslationNotAllowed _ -> "E4012"
  E4013_NotTranslationFile -> "E4013"
  E4014_HeaderNotInConceptList _ -> "E4014"
  E4015_EntitySetHeaderNotValid _ -> "E4015"
  E4016_EntitySetNotInDomain _ -> "E4016"
  E5001_ValueMustNotBeEmpty -> "E5001"
  E5002_NotBooleanValue -> "E5002"
  E5003_NotNumber _ -> "E5003"
  E5004_NotValidTimeValue _ -> "E5004"
  E5005_InvalidIdentifier _ -> "E5005"
  E5006_IdentifierTooLong -> "E5006"
  E5007_InvalidValue _ -> "E5007"
  E6001_NoDatapackage -> "E6001"
  E6002_MissingFileInResourceList _ -> "E6002"
  E6003_DuplicatedFilePath _ -> "E6003"
  E6004_ResourceInconsistent -> "E6004"
  E7001_NoDdfCsvFiles -> "E7001"
  E7002_NoConceptsFile -> "E7002"
  E7003_KeyNotFound _ -> "E7003"

-- | Format an error code into a human-readable message
formatError :: ErrorCode -> String
formatError code =
  errorCodeStr code <> " " <> errorMessage code

-- | Get the error message (without the code prefix)
errorMessage :: ErrorCode -> String
errorMessage = case _ of
  E1001_ConceptFieldMustExist { field } -> "field " <> field <> " MUST exist for concept"
  E1002_ConceptFieldMustNotBeEmpty { field } -> "field " <> field <> " MUST not be empty"
  E1003_ReservedConceptId { conceptId } -> conceptId <> " can not be use as concept Id"
  E1004_NoConceptsInDataset -> "Data set must have at least one concept"
  E1005_ConceptNotFound { concept } -> "no such concept in dataset: " <> concept
  E1006_MultipleConceptDefinition { concept } -> "Multiple definition found: " <> concept
  E1007_ConceptDomainInvalid { domain } -> "the domain of the entity set is not a valid domain: " <> domain
  E1008_ConceptIdTooLong -> "longer than 64 chars"
  E2001_EntityMustHaveId -> "entity MUST have an entity id"
  E2002_EntityDomainNotDefined { domain } -> "domain " <> domain <> " is not defined in concepts, but there is a entity domain file for it"
  E2003_EntityDomainNotValid { concept } -> "concept " <> concept <> " is not an entity domain in dataset"
  E2004_EntitySetNotDefined { set } -> "the entity set " <> set <> " is not defined in concepts"
  E2005_EntitySetNoDomain { set } -> "entity set " <> set <> " doesn't belong to any domain"
  E2006_EntitySetWrongDomain { domain, set } -> "entity set " <> set <> " doesn't belong to " <> domain <> " domain"
  E2007_EntitySetNotInConcepts { concept } -> "concept " <> concept <> " is not an entity set in dataset"
  E2008_EntityIsHeaderMustBeTrue { domain } -> "is--" <> domain <> " must be TRUE for " <> domain <> " domain"
  E2009_MultipleEntityDefinition { entity } -> "Multiple definition found: " <> entity
  E2010_EntityValueNotUnique -> "entity value is not unique"
  E3001_DatapointHeadersMismatch -> "headers mismatch"
  E3002_DatapointDuplicated -> "Duplicated datapoints"
  E3003_NoValidCsvForIndicator { indicator, pkeys } -> "No valid csv file for " <> indicator <> " by " <> pkeys
  E4001_NotCsvFile -> "not a csv file"
  E4002_EmptyCsv -> "Empty Csv. You should at least put headers in the file."
  E4003_HeaderLengthMismatch -> "header length doesn't match column length"
  E4004_DuplicatedHeaders { headers } -> "duplicated headers: " <> headers
  E4005_UnexpectedHeader { header, domain } -> "unexpected header: " <> header <> " for " <> domain <> " domain"
  E4006_InvalidHeader { headers } -> "these headers are not valid Ids: " <> headers
  E4007_FileMustHaveField { field } -> "file MUST have following field: " <> field
  E4008_FileMustHaveOneOfFields { fields } -> "file MUST have one and only one of following field: " <> fields
  E4009_FileDoesNotExist { filepath } -> filepath <> " does not exist, skipping"
  E4010_ErrorParsingFile { error } -> "error parsing file: " <> error
  E4011_BadCsvRow -> "Bad Csv row"
  E4012_TranslationOfTranslationNotAllowed { filepath } -> filepath <> ": translation of translation is not allowed"
  E4013_NotTranslationFile -> "not a translation file"
  E4014_HeaderNotInConceptList { header } -> header <> " is not in concept list but it's in the header"
  E4015_EntitySetHeaderNotValid { set } -> set <> " is not a valid concept"
  E4016_EntitySetNotInDomain { domain, set } -> set <> " is not a entity_set in " <> domain <> " domain"
  E5001_ValueMustNotBeEmpty -> "value must be not empty"
  E5002_NotBooleanValue -> "not a boolean value"
  E5003_NotNumber { input } -> input <> " is not a number"
  E5004_NotValidTimeValue { input } -> input <> " is not a valid time value"
  E5005_InvalidIdentifier { value } -> "invalid identifier: " <> value
  E5006_IdentifierTooLong -> "longer than 64 chars"
  E5007_InvalidValue { value, reason } -> "invalid value " <> value <> ": " <> reason
  E6001_NoDatapackage -> "no datapackage in this folder"
  E6002_MissingFileInResourceList { resources } -> "datapackage.json: Missing file in resource list. Expected following resources exist: " <> resources
  E6003_DuplicatedFilePath { filepath } -> "datapackage.json: duplicated file path: " <> filepath
  E6004_ResourceInconsistent -> "datapackage.json: resources are inconsistent with local files"
  E7001_NoDdfCsvFiles -> "No ddf csv files in this folder. Please begin with a ddf--concepts.csv file."
  E7002_NoConceptsFile -> "No concepts file in folder. Please add ddf--concepts.csv"
  E7003_KeyNotFound { key } -> "key not found: " <> key

-- | Helper functions for creating parameter records
-- | These make error construction more convenient

fieldError :: String -> FieldError
fieldError field = { field }

conceptError :: String -> ConceptError
conceptError concept = { concept }

conceptIdError :: String -> ConceptIdError
conceptIdError conceptId = { conceptId }

domainError :: String -> DomainError
domainError domain = { domain }

setError :: String -> SetError
setError set = { set }

domainSetError :: String -> String -> DomainSetError
domainSetError domain set = { domain, set }

entityError :: String -> EntityError
entityError entity = { entity }

indicatorPkeysError :: String -> String -> IndicatorPkeysError
indicatorPkeysError indicator pkeys = { indicator, pkeys }

headersError :: String -> HeadersError
headersError headers = { headers }

headerError :: String -> HeaderError
headerError header = { header }

headerDomainError :: String -> String -> HeaderDomainError
headerDomainError header domain = { header, domain }

filepathError :: String -> FilepathError
filepathError filepath = { filepath }

parseError :: String -> ParseError
parseError error = { error }

inputError :: String -> InputError
inputError input = { input }

valueError :: String -> ValueError
valueError value = { value }

valueReasonError :: String -> String -> ValueReasonError
valueReasonError value reason = { value, reason }

resourcesError :: String -> ResourcesError
resourcesError resources = { resources }

keyError :: String -> KeyError
keyError key = { key }

fieldsError :: String -> FieldsError
fieldsError fields = { fields }
