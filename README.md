# ddf-validation-ng

## how to run validation

1. install ddf-validation-ng
   - `npm install -g ddf-validation-ng`
2. run ddf-validation-ng on target path

``` shell
$ validate-ddf-ng -h
validate-ddf - DDF dataset validator

Usage: validate-ddf-ng [--no-warning] [PATH] [-m|--mode ARG]
                       [-p|--generate-datapackage]
  validate DDF dataset at PATH (default to current working dir)

Available options:
  --no-warning             don't show warnings
  PATH                     The dataset path to validate
  -m,--mode ARG            configure how validator find files (filenames or
                           datapackage, default filenames)
  -p,--generate-datapackage
                           whether to generate a datapackage.json after
                           validation. (default false)
  -h,--help                Show this help text
```

There are 2 modes: filenames and datapackage. In filenames mode, the
validator will enumerate all files in a given folder and try to find
all the filenames that match ddf standard. In datapackage mode, the
validator will read all files in the resources list in datapackage.json.

## how to build

1. install purescript and spago
    - `npm install -g purescript`
    - `npm install -g spago`
2. to install dependencies
   - `npm install`
   - `spago install`
3. run `npm run build` (which will run `spago build`)

## how to create new version
1. build the app and module bundle
    - `npm run bundle-app`
    - `npm run bundle-module`
2. `npm publish`
