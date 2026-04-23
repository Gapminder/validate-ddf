module App.Cli
  ( opts
  , CliOptions
  , ValidationMode(..)
  ) where

import Options.Applicative
import Prelude

import Data.Either (Either(..))
import Node.Path (FilePath)

-- Note optparse exports a Parser data type and it's different from the Parser from string-parsers
-- But they work in similar way.

type CliOptions =
  { targetPath :: FilePath
  , noWarning :: Boolean
  , mode :: ValidationMode
  , generateDP :: Boolean
  , fixFormat :: Boolean
  }

data ValidationMode = FileNameBased | DataPackageBased

parseValidationMode :: ReadM ValidationMode
parseValidationMode = eitherReader $ \s ->
  case s of
    "filenames" -> Right FileNameBased
    "datapackage" -> Right DataPackageBased
    _ -> Left "mode should be either filenames or datapackage"

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
  mode <- option parseValidationMode
    ( long "mode"
        <> short 'm'
        <> value FileNameBased
        <> help "configure how validator find files (filenames or datapackage, default filenames)"
    )
  generateDP <- flag false true
    ( long "generate-datapackage"
        <> short 'p'
        <> help "whether to generate a datapackage.json after validation. (default false)"
    )
  fixFormat <- switch
    ( long "fix"
        <> short 'f'
        <> help "auto-fix format issues (BOM, CRLF) in CSV files"
    )
  in
    { targetPath, noWarning, mode, generateDP, fixFormat }

opts :: ParserInfo CliOptions
opts = info (cliOptions <**> helper)
  ( fullDesc
      <> progDesc "validate DDF dataset at PATH (default to current working dir)"
      <> header "validate-ddf - DDF dataset validator"
  )
