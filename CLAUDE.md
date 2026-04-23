# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is `validate-ddf`, a validator for DDF (Data Description Format) datasets written in PureScript. It validates DDF datasets (structured data with concepts, entities, and datapoints) and can optionally generate `datapackage.json` files.

## Key Commands

### Build & Development

- `npm run build` - Build the project (runs `spago build`)
- `npm run test` - Run tests (runs `spago test`)
- `npm run clean` - Clean build artifacts

### Bundling for Distribution

- `npm run bundle-app` - Build CLI application bundle (outputs to `dist/app.js`)
- `npm run bundle-module` - Build library module bundle (outputs to `dist/lib.js`)

Both bundles must be rebuilt after making changes to PureScript source files.

### Running the Validator

**IMPORTANT**: When developing/testing, always use `spago run` to run the current working version:
- `spago run <path>` - Validate a DDF dataset using current code
- `spago run -- --no-warning <path>` - Suppress warnings
- `spago run -- -m datapackage <path>` - Use datapackage mode
- `spago run -- -p <path>` - Generate `datapackage.json` after successful validation
- `spago run -- --fix <path>` - Auto-fix BOM/CRLF format issues in CSV files

The globally installed `validate-ddf` command uses the published npm package and should only be used as a fallback when spago build fails:
- `validate-ddf [PATH]` - Validate using installed version (NOT recommended for development)
- `validate-ddf --no-warning [PATH]` - Suppress warnings, show only errors
- `validate-ddf -m datapackage [PATH]` - Use datapackage mode
- `validate-ddf -p [PATH]` - Generate `datapackage.json` after successful validation

### Publishing

When creating a new version:

1. `npm version patch` (or `minor`/`major`)
2. Update version string in `src/Main.purs` (line 74)
3. `npm run bundle-app && npm run bundle-module`
4. `npm publish`

## Architecture

### Language & Build System

- Written in **PureScript**
- Build tool: **Spago** (use the spago@next package)
- PureScript files are in `src/` and `test/`, JavaScript shims are in `src/` for Node.js interop
- Uses `purs-backend-es` for bundling PureScript to optimized ES modules

### Entry Points

- **CLI**: `src/cli.js` → imports `dist/app.js` (compiled from `src/Main.purs`)
- **JS API**: `src/index.js` → exports `validate` function from `dist/lib.js`

### Core Architecture

#### Main Validation Flow (`src/App/Validation/FileNameBased.purs`)

The validation flow is based on the idea of "Parse, not validate". We parse the entire dataset from ground up.

The validator processes DDF datasets in this order:

1. **File Discovery**: Find all DDF CSV files matching naming conventions (e.g., `ddf--concepts.csv`, `ddf--entities--geo.csv`)
2. **CSV file parsing**: read csv files. this will ignore bad csv rows. and check if the headers in csv matches those indicated by filename.
3. **Concepts Validation**: Parse and validate concept definitions (required, must exist)
4. **Entities Validation**: Parse and validate entity domains and sets
5. **Concepts/Entities Validation within dataset**: Parse a `BaseDataset` using concepts/entities from above steps. For example, even though a concept is good on its own, it may be incorrect in a dataset because some of its property fields is not defined as concept.
6. **Datapoints Validation**: Parse datapoint files using the concept/entities info from a BaseDataset.
7. **Synonyms & Translations**: Validate supplementary files with info from BaseDataSet
8. **DataPackage Verification**: Check if the existing datapackage.json is correct, optionally create a new datapackage.json

#### Validation System (`src/Data/Validation/`)

We used serval data structure for the validation process.

- **V type**: This is the applicative style validation, we use it for indivadual checkings for its pure nature. For example parsing a single value in csv is done using `V`
- **ValidationT monad transformer**: When combining multiple validations, we need more flexible way to control the behaviour, that's when a monad transformer shines. For example we will want to emit some errors but continue with the validation process. This can not be done using `V`

The codebase uses `ValidationT Messages Aff a` throughout:

- `ValidationT` accumulates validation messages (errors/warnings)
- `Aff` provides async I/O (file reading)
- Can emit errors and continue (`emitErrorsAndContinue`) or stop (`emitErrorsAndStop`)

##### Error Handling: Issue vs Message

- **Issue**: Structured error data using centralized error registry (Registry.purs). Used in validation logic with `V Issues a`. Create using helper functions like `mkIssue`, `mkIssueWithValue`, etc.
- **Message**: Presentation layer for user-facing output. Used in `ValidationT Messages Aff a`. Converted from Issue via `messageFromIssue` only at presentation boundaries.

#### CSV Parsing (`src/Data/Csv/`)

- Uses Node.js `csv-parse` library (FFI via JavaScript)

## Testing

Tests are in `test/Main.purs` using `purescript-spec`. The test suite includes:

- **Unit tests**: Low-level parsers (identifiers, values, filenames) in `test/Test/Unit/`
  - Test individual parsing/validation functions with mock data
  - No file I/O, fast and focused
  - Covers: Value, Identifier, Header, FileInfo, Concept, Entity parsing
- **Integration tests**: Full dataset validation in `test/Test/Integration/`
  - Test complete DDF datasets with all files
  - Validates concepts, entities, datapoints working together
  - Tests in: `test/datasets/` (new) and `test/fixtures/` (legacy)

### Running Tests

- `npm test` or `spago test` - Run all tests
- `spago test -- --example TEXT` or `spago test -- -e TEXT` - Run only tests whose names include the given text
- `spago test -- --example-matches REGEX` or `spago test -- -E REGEX` - Run only tests whose names match the given regex

Note: The `--` separates spago arguments from test runner arguments.

Examples:
```bash
spago test -- -e "Identifier"       # Run only Identifier tests
spago test -- -e "Value Parsing"    # Run only Value Parsing tests
spago test -- -E "should reject"    # Run all tests matching "should reject"
spago test -- -e "Integration"      # Run only integration tests
```

### Creating Integration Test Datasets

Integration tests require full DDF datasets with `datapackage.json`.

#### Creating Valid Test Datasets

1. Create a new directory: `test/datasets/valid-<name>/`
2. Create DDF CSV files following naming conventions:
   - `ddf--concepts.csv` - Define all concepts (including column headers like "domain")
   - `ddf--entities--<domain>[--<set>].csv` - Entity data
   - `ddf--datapoints--<indicator>--by--<dims>.csv` - Datapoint data
3. **Generate datapackage.json**: Run `validate-ddf -p test/datasets/valid-<name>/`
   - This validates the dataset AND generates `datapackage.json` automatically
   - Fix any validation errors and regenerate until it passes

**Important**:
- Entity set concepts need a `domain` field pointing to their entity domain
- All column headers used in CSV files must be defined as concepts
- Even in FileNameBased mode, `datapackage.json` is required

#### Creating Invalid Test Datasets (for error testing)

1. Copy a valid dataset folder (with datapackage.json): `cp -r test/datasets/valid-minimal test/datasets/error-<specific-error>`
2. Edit CSV files to introduce the specific error you want to test
3. Usually no need to modify `datapackage.json` (unless testing datapackage errors)

#### Integration Test Pattern

```purescript
-- test/Test/Integration/ValidDatasets.purs
it "valid-minimal: should pass validation" do
  let path = "test/datasets/valid-minimal"
  res <- runValidationTEither $ VFN.validate path false false
  res `shouldSatisfy` isRight

-- For invalid datasets
it "error-empty-entity-id: should fail validation" do
  let path = "test/datasets/error-empty-entity-id"
  res <- runValidationTEither $ VFN.validate path false false
  res `shouldSatisfy` isLeft
```

### Debugging Individual Datasets

Run validation on a specific dataset:

```purescript
testMain = do
  path <- resolve [] "test/datasets/valid-minimal"
  M.runMain { targetPath: path, noWarning: false, mode: FileNameBased, generateDP: true, fixFormat: false }
```

Or use the CLI:
```bash
spago run test/datasets/valid-minimal        # Validate
spago run -p test/datasets/valid-minimal     # Validate and generate datapackage.json
```

## DDF Dataset Structure

here is a base description of DDF Dataset Structure

A DDF dataset consists of CSV files following naming conventions:

- `ddf--concepts.csv` - Defines all concepts (dimensions, measures, metadata)
- `ddf--entities--{domain}[--{set}].csv` - Entity instances
- `ddf--datapoints--{indicator}--by--{dims}.csv` - Indicator values
- `ddf--synonyms--{domain}.csv` - Alternative names for entities
- Translation files (language subdirectories)

The validator ignores folders: `.git`, `etl`, `assets`, `langsplit`

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

- When updating version: remember to update BOTH `package.json` AND `src/Main.purs:74`
- PureScript uses dot-syntax for record field access but different syntax for updating records
- The codebase branch is `purescript` (branched from older JavaScript version)
- npm test will emit many lines, remember to first show the tail to see a summary
- use https://pursuit.purescript.org to check library API doc

### coding style

- try to avoid very long lines, break it into smaller trunks. For example, use let...in to create some temp variables.
- perfer the `$` operator to writting in parentheses
- remember to run `purs-tidy format-in-place "file.purs"` to format file after finishing a task
