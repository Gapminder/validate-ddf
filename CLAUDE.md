# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`validate-ddf` is a **DDF dataset validator** written in **PureScript**. It reads a directory of CSV files structured according to the DDF (Data Description Format) naming conventions, parses and validates them in layers (concepts → entities → datapoints → synonyms → datapackage), and reports structured errors and warnings.

The validator implements a **"parse, don't validate"** philosophy: rather than checking a pre-built structure, it builds the dataset from scratch and reports every structural or semantic problem found along the way.

**Key DDF concepts** (see `doc/` for full specs):
- **Concepts**: every column header used anywhere must be declared in `ddf--concepts.csv` with a `concept_type`
- **Entities**: single-dimensional lookups; entity domains enumerate all possible values; entity sets are named subsets
- **DataPoints**: multi-dimensional measurements — indicator values keyed by one or more entity/time dimensions
- **Identifiers**: must match `[A-Za-z0-9_]+`, max 64 chars; column headers follow the same rule plus the `is--<id>` prefix form for entity set membership

---

## Key Commands

### Build & Development

```bash
npm run build          # spago build
npm run test           # spago test
npm run clean          # rm -rf node_modules output .spago dist/*.js *.lock .cache
```

### Bundling for Distribution

```bash
npm run bundle-app     # → dist/app.js  (CLI entry point)
npm run bundle-module  # → dist/lib.js  (JS library)
```

**Always rebuild bundles after changing PureScript source files.**

### Running the Validator

**During development — use `spago run` (runs current source, not installed package):**

```bash
spago run -- <path>                    # validate a dataset
spago run -- --no-warning <path>       # errors only
spago run -- -m datapackage <path>     # datapackage mode
spago run -- -p <path>                 # validate + generate datapackage.json
spago run -- --fix <path>              # validate + auto-fix BOM/CRLF issues
```

The globally installed `validate-ddf` command uses the published npm package — only use it as a fallback.

### Publishing

1. `npm version patch` (or `minor`/`major`)
2. Update version string in `src/Main.purs` (search for the version literal)
3. `npm run bundle-app && npm run bundle-module`
4. `npm publish`

---

## Project Structure

```
src/
├── Main.purs                              # CLI entry: arg parsing, runMain, JS API export
├── cli.js                                 # Shebang wrapper → imports dist/app.js
├── index.js                               # npm library entry → exports validate() from dist/lib.js
├── App/
│   ├── Cli.purs                           # CLI option parsing (options-applicative)
│   └── Validation/
│       ├── FileNameBased.purs             # Main validation pipeline (the orchestrator)
│       ├── DataPackageBased.purs          # Datapackage-first validation mode
│       └── Common.purs                    # Shared helpers: readCsvs, checkFormat, emit*
├── Utils/                                 # getFiles, arrayOfRight, path utilities
└── Data/
    ├── Csv/
    │   ├── Csv.purs / Csv.js              # CSV reading FFI (csv-parse/sync); RawCsvContent type
    │   └── FileCheck.purs / FileCheck.js  # BOM/CRLF/UTF-8 byte-level detection and fixing
    ├── DDF/
    │   ├── Atoms/
    │   │   ├── Identifier.purs            # Identifier newtype + parser (alphanumeric + _)
    │   │   ├── Header.purs                # Header parser (identifier or is--<identifier>)
    │   │   ├── Boolean.purs               # "TRUE"/"FALSE"/"true"/"false" validator
    │   │   └── Value.purs                 # Value parsing (string, number, time, JSON)
    │   ├── Csv/
    │   │   ├── FileInfo.purs              # Filename parser → CollectionInfo (Concepts/Entities/DataPoints/...)
    │   │   ├── CsvFile.purs               # CsvFile type; parseCsvFile (headers × rows)
    │   │   └── Utils.purs                 # createConceptInput / createEntityInput / createDataPointsInput
    │   ├── Concept.purs                   # Concept type + parseConcept + reservedConcepts
    │   ├── Entity.purs                    # Entity type + parseEntity
    │   ├── DataPoint.purs                 # DataPoints type + parseDataPoints + merge
    │   ├── DataSet.purs                   # DataSet (concepts+entities HashMap) + parseBaseDataSet
    │   ├── Internal.purs                  # Shared internal helpers (pathAndRow, etc.)
    │   └── Metadata.purs                  # (stub)
    ├── DataPackage/
    │   └── DataPackage.purs               # generateDataPackage (builds datapackage.json from DataSet)
    ├── JSON/
    │   └── DataPackage.purs               # datapackageExists; parseDataPackageResources; writeDataPackage
    ├── Validation/
    │   ├── Registry.purs                  # ALL error codes (ErrorCode enum) + message templates
    │   ├── Issue.purs                     # Issue type (CodedIssue ErrorCode ErrorContext); mkIssue helpers
    │   ├── Result.purs                    # Message type (presentation layer); messageFromIssue; setError
    │   ├── ValidationT.purs               # ValidationT monad transformer; runValidationT; vWarning/vError
    │   └── Env.purs                       # Env helpers
    └── Map/Extra.purs                     # mapKeys / mapKeysWith
test/
├── Main.purs                              # Test suite entry (purescript-spec)
├── Test/
│   ├── Unit/                              # Unit tests: Identifier, Header, FileInfo, Concept, Entity, Value, Csv
│   ├── Integration/                       # Integration tests: ValidDatasets, CsvErrors, DatasetErrors, DatapackageErrors, DatapointErrors
│   └── Helpers/                           # Shared test helpers
└── datasets/                              # Integration test DDF datasets
    ├── valid-minimal/                     # Smallest passing dataset
    ├── valid-*/                           # Other valid datasets
    └── error-*/                           # Datasets with specific intentional errors
doc/
├── 00 - DDF documentation index.md       # DDF overview (from Google Docs)
├── 01 - DDF Data Model.md                # DDF conceptual model
├── 02 - DDFcsv format.md                 # DDFcsv file format spec (MUST/SHOULD language)
├── api-reference.md                       # OLD JS API — ignore, not relevant to this codebase
├── developer-guide.md                     # OLD JS dev guide — ignore
└── user-guide.md                          # OLD JS CLI guide — ignore
```

---

## Architecture

### Language & Build System

- **PureScript** with **Spago 1.x** (`spago.yaml`, registry-based — no `spago.dhall`)
- **purs-backend-es** for bundling optimised ES modules
- **Node.js v24**, `"type": "module"` in `package.json`
- FFI: two files — `Csv.js` (csv-parse) and `FileCheck.js` (BOM/CRLF/UTF-8 byte detection)
- `npm run bundle-*` works because npm adds `node_modules/.bin` (esbuild) to PATH

### Entry Points

- **CLI**: `src/cli.js` → `dist/app.js` (compiled from `src/Main.purs`)
- **JS API** (`src/index.js` → `dist/lib.js`):
  ```javascript
  import { validate } from "validate-ddf";
  const result = await validate("./path/to/dataset", { onlyErrors: false, generateDP: false });
  // result.success / result.errors
  ```

### Main Validation Pipeline (`App/Validation/FileNameBased.purs`)

```
1. File discovery     getFiles path (ignoring: .git, etl, assets, langsplit)
2. Filename parsing   FI.fromFilePath → CollectionInfo (Concepts | Entities | DataPoints | ...)
3. Format check       checkAndFixFileFormat per CSV (BOM/CRLF/encoding)
4. Concept files      readCsv → parseCsvFile → parseConcept → build HashMap
5. Entity files       readCsv → parseCsvFile → parseEntity → build HashMap
6. BaseDataSet        parseBaseDataSet (cross-validates concepts × entities)
7. DataPoint files    readCsv → parseCsvFile → parseDataPoints (using BaseDataSet)
8. Synonyms           (validated using BaseDataSet)
9. DataPackage        verify existing datapackage.json; optionally generate new one
```

### Validation System

Two tiers, used in different contexts:

**`V Issues a`** (from `Data.Validation.Semigroup`) — pure, accumulating
- Used at the leaf level: parsing a single value, identifier, concept, entity record
- Chain results with `andThen`; combine independent checks with `ado ... in`

**`ValidationT Messages Aff a`** — effectful, stateful
- Used at the file/dataset/pipeline level
- `vWarning msgs` — appends to state, continues execution
- `vError msgs` — throws (stops this branch), appends to state
- `emitErrorsAndContinue` — marks issues as errors but doesn't stop
- `emitWarningsAndContinue` — marks issues as warnings and continues
- `runValidationT` → `Aff (Tuple Messages (Maybe a))`
- `runValidationTEither` → `Aff (Either Messages a)` (used in tests)

### Error System

**`Issue`** (internal) — structured, typed:
```purescript
data Issue = CodedIssue ErrorCode ErrorContext | NotImplemented

type ErrorContext =
  { fileContext      :: Maybe FileContext       -- filepath + lineNo
  , valueContext     :: Maybe ValueContext       -- the bad value string
  , conceptContext   :: Maybe ConceptContext     -- concept + optional field
  , entityContext    :: Maybe EntityContext      -- entity + domain + optional set
  , datapointContext :: Maybe DatapointContext   -- indicator + pkeys
  , csvContext       :: Maybe CsvContext         -- problematic header string
  , datasetContext   :: Maybe DatasetContext     -- freeform message
  , message          :: Maybe String             -- additional detail
  }
```

Create with helpers: `mkIssue`, `mkIssueWithValue`, `mkIssueWithMessage`, then pipe through `withFileLocation`, `withValue`, `withMessage`, `withConceptField`, etc.

**`Message`** (presentation) — flat record for output:
```purescript
type Message =
  { message :: String, file :: String, lineNo :: Int
  , errorCode :: String, suggestions :: String, isWarning :: Boolean }
```

Convert `Issue → Message` via `messageFromIssue` **only at presentation boundaries**. `messageFromIssue` always produces `isWarning: true`; call `setError` to make it fatal.

**All error codes** live in `Data.Validation.Registry` as the `ErrorCode` enum. The prefix tells you the category:
- `E_VAL_*` — value parsing errors (identifier, number, time, boolean, JSON)
- `E_CONCEPT_*` / `W_CONCEPT_*` — concept-level errors
- `E_ENTITY_*` — entity-level errors
- `E_DATASET_*` — cross-file dataset errors
- `E_DATAPACKAGE_*` — datapackage.json errors
- `E_CSV_*` / `W_CSV_FORMAT_*` — CSV structure and byte-format errors
- `E_GENERAL` / `W_GENERAL` — catch-all

NOTE: when working on a new type of error/warning, please prefer creating a new error code over using the catch-all ones.

---

## Testing

### Running Tests

```bash
npm test                                  # all tests
spago test -- -e "Identifier"             # filter by name substring
spago test -- -E "should reject"          # filter by regex
```

### Test Structure

- **Unit** (`test/Test/Unit/`): pure parser tests — no file I/O, fast
  - `Identifier.purs`, `Header.purs`, `FileInfo.purs`, `Concept.purs`, `Entity.purs`, `Value.purs`, `Csv.purs`
- **Integration** (`test/Test/Integration/`): full dataset validation
  - `ValidDatasets.purs` — datasets that should pass
  - `CsvErrors.purs`, `DatasetErrors.purs`, `DatapackageErrors.purs`, `DatapointErrors.purs` — datasets with specific errors

### Integration Test Pattern

```purescript
-- valid dataset
it "valid-minimal: should pass validation" do
  let path = "test/datasets/valid-minimal"
  res <- runValidationTEither $ VFN.validate path false false
  res `shouldSatisfy` isRight

-- invalid dataset
it "error-empty-entity-id: should detect E_ENTITY_ID_EMPTY" do
  let path = "test/datasets/error-empty-entity-id"
  res <- runValidationTEither $ VFN.validate path false false
  res `shouldSatisfy` isLeft
```

### Creating Integration Test Datasets

**Valid dataset:**
1. Create `test/datasets/valid-<name>/` with DDF CSV files
2. Run `spago run -- -p test/datasets/valid-<name>/` to validate and auto-generate `datapackage.json`
3. Fix errors, regenerate until clean

**Invalid dataset (for error testing):**
1. `cp -r test/datasets/valid-minimal test/datasets/error-<specific-error>`
2. Edit CSV to introduce the specific defect — no need to modify `datapackage.json` unless testing datapackage errors

**Important constraints:**
- Every column header used anywhere must be declared as a concept in `ddf--concepts.csv`
- Entity set concepts need `domain` pointing to their entity domain
- `datapackage.json` is required even in FileNameBased mode

---

## DDF Format Reference

The `doc/` folder has the full specs. Quick reference for what the validator checks:

### File naming conventions

| Collection | Filename pattern |
|------------|-----------------|
| Concepts | `ddf--concepts.csv` or `ddf--concepts--<tag>.csv` |
| Entity domain | `ddf--entities--<domain>.csv` |
| Entity set | `ddf--entities--<domain>--<set>.csv` |
| DataPoints | `ddf--datapoints--<indicators>--by--<dimensions>.csv` |
| Synonyms | `ddf--synonyms--<synonym_set>.csv` |

Files not matching any pattern emit `W_GENERAL` and are skipped.

### Identifiers

`[A-Za-z0-9_]+`, max 64 characters. Applies to concept IDs, entity IDs, column headers, and filename segments.  
Column headers may additionally use the `is--<identifier>` form (entity set membership columns).

### Concept types

`string`, `measure`, `boolean`, `interval`, `time`, `entity_domain`, `entity_set`, `role`, `composite`, or any custom string.  
`entity_set` concepts must have a `domain` property pointing to an `entity_domain` concept.

### DataPoints

Key = two or more entity/time dimensions, value = one or more indicators. One file can only contain datapoints with the same key (same set of dimensions).

### Encoding / format

UTF-8 required; BOM not recommended (warning); CRLF not recommended (warning); missing values = empty field.

---

## Coding Style

- Avoid long lines — use `let ... in` to break up expressions
- Prefer `$` over nested parentheses
- Prefer pattern matching over `if .. then .. else`
- After completing a task, format the file: `npx purs-tidy format-in-place "src/Foo.purs"`
- Check the [Pursuit docs](https://pursuit.purescript.org) for library APIs


## JavaScript API

The library exports a `validate` function (defined in `src/index.js`):

```javascript
import { validate } from "validate-ddf";

const result = await validate("./path/to/dataset", {
  onlyErrors: false, // true to hide warnings
  generateDP: false, // true to generate datapackage.json
});

// result.success: "Validation successful." or null
// result.errors: array of error/warning messages or null
```

## Development Notes

- When making a new version: remember to update the version string in BOTH `package.json` AND `src/Main.purs` (search for lines like `liftEffect $ log "v2.1.0"`)
- PureScript uses dot-syntax for record field access but different syntax for updating records
- npm test will emit many lines, remember to first show the tail to see a summary
- use https://pursuit.purescript.org to check library API doc

### coding style

- try to avoid very long lines, break it into smaller trunks. For example, use let...in to create some temp variables.
- perfer the `$` operator to writting in parentheses
- remember to run `purs-tidy format-in-place "file.purs"` to format file after updating a purs file.
