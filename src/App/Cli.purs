module App.Cli
  ( opts
  , CliOptions
  ) where

import Options.Applicative
import Prelude
import Node.Path (FilePath)

-- Note optparse exports a Parser data type and it's different from the Parser from string-parsers
-- But they work in similar way.

type CliOptions =
  { targetPath :: FilePath
  , noWarning :: Boolean
  , mode :: String
  , generateDP :: Boolean
  }

data ValidationMode = FileNames | DataPackage

cliOptions :: Parser CliOptions
cliOptions = ado
  noWarning <- switch
    ( long "no-warning"
        <> help "don't show warnings"
    )
  targetPath <- argument str
    ( metavar "PATH"
        <> value "./"
        <> help "The dataset path to validate"
    )
  mode <- option str -- TODO: use ValidationMode
    ( long "mode"
        <> short 'm'
        <> value "filenames"
        <> help "configure how validator find files (filenames or datapackage, default filenames)"
    )
  generateDP <- flag false true
    ( long "generate-datapackage"
        <> short 'p'
        <> help "whether to generate a datapackage.json after validation. (default false)"
    )
  in
    { targetPath, noWarning, mode, generateDP }

opts :: ParserInfo CliOptions
opts = info (cliOptions <**> helper)
  ( fullDesc
      <> progDesc "validate DDF dataset at PATH (default to current working dir)"
      <> header "validate-ddf - DDF dataset validator"
  )
