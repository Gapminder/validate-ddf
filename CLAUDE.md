# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is `ddf-validation-ng`, a validator for DDF (Data Description Format) datasets written in PureScript. It validates DDF datasets (structured data with concepts, entities, and datapoints) and can optionally generate `datapackage.json` files.

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
- `validate-ddf-ng [PATH]` - Validate a DDF dataset (default: current directory)
- `validate-ddf-ng --no-warning [PATH]` - Suppress warnings, show only errors
- `validate-ddf-ng -m datapackage [PATH]` - Use datapackage mode (reads from `datapackage.json`)
- `validate-ddf-ng -p [PATH]` - Generate `datapackage.json` after successful validation

### Publishing
When creating a new version:
1. `npm version patch` (or `minor`/`major`)
2. Update version string in `src/Main.purs` (line 74)
3. `npm run bundle-app && npm run bundle-module`
4. `npm publish`

## Architecture

### Language & Build System
- Written in **PureScript** (functional programming language that compiles to JavaScript)
- Build tool: **Spago** (PureScript package manager and build tool)
- PureScript files are in `src/` and `test/`, JavaScript shims are in `src/` for Node.js interop
- Uses `purs-backend-es` for bundling PureScript to optimized ES modules

### Entry Points
- **CLI**: `src/cli.js` → imports `dist/app.js` (compiled from `src/Main.purs`)
- **JS API**: `src/index.js` → exports `validate` function from `dist/lib.js`

### Core Architecture

#### 1. Validation Modes
There are two validation modes (defined in `src/App/Cli.purs`):
- **FileNameBased** (default): Discovers DDF files by scanning directory and matching filename patterns
- **DataPackageBased**: Reads file list from existing `datapackage.json`

#### 2. Main Validation Flow (`src/App/Validation/FileNameBased.purs`)
The validator processes DDF datasets in this order:
1. **File Discovery**: Find all DDF CSV files matching naming conventions (e.g., `ddf--concepts.csv`, `ddf--entities--geo.csv`)
2. **Concepts Validation**: Parse and validate concept definitions (required, must exist)
3. **Entities Validation**: Parse and validate entity domains and sets
4. **Base Dataset Creation**: Build a `DataSet` with concepts and entities (`src/Data/DDF/DataSet.purs`)
5. **Datapoints Validation**: Validate datapoint files grouped by indicator
6. **Synonyms & Translations**: Validate supplementary files
7. **DataPackage Verification**: Compare expected vs actual resources if `datapackage.json` exists

#### 3. Core Data Types (`src/Data/DDF/`)
- **Concept** (`Concept.purs`): Defines dimensions, measures, entity domains/sets, and metadata
- **Entity** (`Entity.purs`): Instances of entity domains (e.g., countries, regions)
- **DataPoints** (`DataPoint.purs`): Indicator values indexed by dimensions
- **DataSet** (`DataSet.purs`): Container holding concepts, entities, and their relationships
  - Uses `HashMap` for efficient lookups
  - Provides `ValueParser` functions for each concept type
  - Validates cross-references (e.g., entity sets reference valid domains)

#### 4. Validation System (`src/Data/Validation/`)
- Uses a **ValidationT monad transformer** (`ValidationT.purs`) over Aff (asynchronous effects)
- **Issue types** (`Issue.purs`):
  - `Issue Msg` - General validation error
  - `InvalidValue String Msg` - Invalid value with the actual value
  - `InvalidCSV Msg` - CSV parsing/structure errors
  - `InvalidItem FilePath Int Msg` - Error at specific file/line
- **V type** (from `purescript-validation`): Accumulates errors without short-circuiting
- Errors and warnings are collected throughout validation, allowing multiple issues to be reported at once

#### 5. CSV Parsing (`src/Data/Csv/`)
- Uses Node.js `csv-parse` library (FFI via JavaScript)
- Validates:
  - File naming conventions match DDF standard
  - Headers match expected concepts in dataset
  - Column values conform to concept types (string, measure, boolean, time, entity domain/set)

#### 6. DataPackage Generation (`src/App/DataPackage.purs`)
- Generates Frictionless Data Package specifications
- Creates resource descriptors for each CSV file
- Can be used to migrate datasets to datapackage-based validation

### Important Patterns

#### ValueParser Pattern
Each concept in a dataset gets a `ValueParser` function (type: `String -> V Issues Value`) that validates string values according to the concept's type. These are generated in `src/Data/DDF/DataSet.purs` (`makeValueParser` function) and stored in the DataSet for reuse.

#### Validation Monad Pattern
The codebase uses `ValidationT Messages Aff a` throughout:
- `ValidationT` accumulates validation messages (errors/warnings)
- `Aff` provides async I/O (file reading)
- Can emit errors and continue (`emitErrorsAndContinue`) or stop (`emitErrorsAndStop`)

#### File Grouping Pattern
Files are grouped by their collection type (concepts, entities, datapoints, synonyms, translations) using `FileInfo.collection` field. Datapoint files are further grouped by indicator and primary keys.

## Testing

Tests are in `test/Main.purs` using `purescript-spec`. The test suite includes:
- **Unit tests**: Low-level parsers (identifiers, values, filenames)
- **Integration tests**: Full dataset validation against fixtures in `test/fixtures/`
- **Fixture organization**:
  - `good-folder-*` - Valid datasets that should pass
  - `rules-cases/*` - Invalid datasets testing specific error conditions

Run individual test datasets for debugging:
```purescript
testMain = do
  path <- resolve [] "test/datasets/ddf--test--new"
  M.runMain { targetPath: path, noWarning: false, mode: FileNameBased, generateDP: true }
```

## DDF Dataset Structure

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
import { validate } from 'ddf-validation-ng';

const result = await validate('./path/to/dataset', {
  onlyErrors: false,      // true to hide warnings
  generateDP: false       // true to generate datapackage.json
});

// result.success: "Validation successful." or null
// result.errors: array of error/warning messages or null
```

## Development Notes

- When updating version: remember to update BOTH `package.json` AND `src/Main.purs:74`
- The validator uses a two-pass approach: first pass validates structure and builds the dataset, second pass validates values
- PureScript uses dot-syntax for record field access but different syntax for updating records
- The codebase branch is `purescript` (branched from older JavaScript version)
