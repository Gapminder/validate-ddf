module Main where

import Prelude

import App.Cli (CliOptions, ValidationMode(..))
import App.Cli as Cli
import App.DataPackage (generateDataPackage)
import App.Validation.DataPackageBased as VDP
import App.Validation.FileNameBased as VFN
import Control.Promise (Promise)
import Control.Promise as Promise
import Data.Array as Arr
import Data.JSON.DataPackage (writeDataPackage)
import Data.JSON.StableStringify (stableStringify)
import Data.Maybe (Maybe(..), fromJust)
import Data.String (joinWith)
import Data.Tuple (Tuple(..))
import Data.Validation.Result (hasError, showMessage)
import Data.Validation.ValidationT (runValidationT)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Effect.Console (log)
import Foreign (Foreign)
import Node.Encoding as Encoding
import Node.FS.Aff (writeTextFile)
import Node.Path (FilePath)
import Node.Path as Path
import Node.Process (setExitCode)
import Options.Applicative (execParser)
import Partial.Unsafe (unsafePartial)
import Yoga.JSON as JSON

-- | js promise for the validation
validate' :: FilePath -> Effect (Promise Foreign)
validate' fp = Promise.fromAff do
  (Tuple msgs _) <- runValidationT $ VFN.validate fp
  pure $ JSON.write msgs

-- | a function that accepts cli options and run the validation
runMain :: CliOptions -> Effect Unit
runMain opts = launchAff_ do
  let
    path = _.targetPath opts
    noWarning = _.noWarning opts
    mode = _.mode opts
    gendp = _.generateDP opts

  liftEffect $ log "v0.1.4"
  (Tuple msgs res) <- case mode of
    FileNameBased -> runValidationT $ VFN.validate path
    DataPackageBased -> runValidationT $ VDP.validate path
  let
    msgsToShow =
      if noWarning then Arr.filter (\x -> not $ _.isWarning x) msgs
      else msgs
    msgsStr = joinWith "\n" $ map showMessage msgsToShow
  liftEffect $ log msgsStr
  if hasError msgs then do
    liftEffect $ log "❌ Dataset is invalid"
    liftEffect $ setExitCode 1
  else do
    liftEffect $ log "✅ Dataset is valid"

  -- then if we should generate datapackage
  when gendp do
    case res of
      Just (Tuple dataset resources) -> do
        if (Arr.null resources) then do
          liftEffect $ log "no valid resources to generate datapackage.json"
          liftEffect $ setExitCode 1
        else do
          liftEffect $ log "generating datapackage.json..."
          datapackage <- generateDataPackage path dataset resources
          let
            dpPath = Path.concat [ path, "datapackage.json" ]
          writeTextFile Encoding.UTF8 dpPath $ JSON.writePrettyJSON 4 $ writeDataPackage datapackage
          liftEffect $ log "Done!"
          pure unit
      Nothing -> do
        liftEffect $ log "can not generate datapackage because there are errors in dataset"
        liftEffect $ setExitCode 1
        pure unit


-- | main function to run under terminals
main :: Effect Unit
main = runMain =<< execParser Cli.opts
