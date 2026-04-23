# validate-ddf

`validate-ddf` is a **DDF dataset validator** written in **PureScript**. It reads a directory of CSV files structured according to the DDF (Data Description Format) naming conventions, parses and validates them in layers (concepts → entities → datapoints → synonyms → datapackage), and reports structured errors and warnings.

# CLI usage

1. install
   - `npm install -g @gapminder/validate-ddf`
2. run validate-ddf on target path

``` shell
$ validate-ddf -h
validate-ddf - DDF dataset validator

Usage: validate-ddf [--no-warning] [PATH] [-m|--mode ARG]
                       [-p|--generate-datapackage] [-f|--fix]
  validate DDF dataset at PATH (default to current working dir)

Available options:
  --no-warning             don't show warnings
  PATH                     The dataset path to validate
  -m,--mode ARG            configure how validator find files (filenames or
                           datapackage, default filenames)
  -p,--generate-datapackage
                           whether to generate a datapackage.json after
                           validation. (default false)
  -f,--fix                 auto-fix format issues (BOM, CRLF) in CSV files
  -h,--help                Show this help text
```

There are 2 modes: filenames and datapackage. In filenames mode, the
validator will enumerate all files in a given folder and try to find
all the filenames that match ddf standard. In datapackage mode, the
validator will read all files in the resources list in datapackage.json.

# JS usage in another app
`npm install @gapminder/validate-ddf`

``` js
import { validate } from "@gapminder/validate-ddf";

const { success, errors } = await validate("/path/to/dataset", {
  onlyErrors: false,
  generateDP: false,
  onProgress: (msg) => console.log(msg),
  // e.g. "checking format: 12/245"
  // e.g. "validating datapoints: 7/30 indicator groups"
});
```


## how to build

1. install purescript and spago
    - `npm install -g purescript`
    - `npm install -g spago`
2. install dependencies in the project folder
   - `npm install`
   - `spago install`
3. run `npm run build` (which will run `spago build`)
4. build and create bundles `npm run bundle`

### run test

- run `npm test`

### create new version
1. update version in package.json
2. update version in src/Main.purs
3. build the app and module bundles: `npm run bundle`, see if tests look good `npm test` 
4. `npm publish`
