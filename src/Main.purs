module Main where

import Prelude

import App.Cli (CliOptions, ValidationMode(..))
import App.Cli as Cli
import App.Validation.DataPackageBased as VDP
import App.Validation.FileNameBased as VFN
import Control.Promise (Promise)
import Control.Promise as Promise
import Data.Array as Arr
import Data.DataPackage (generateDataPackage)
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
import Utils.Progress (resetProgressHandler, setProgressHandler)
import Yoga.JSON as JSON

-- | validation options
type ValidateOptions = { onlyErrors :: Boolean, generateDP :: Boolean, targetPath :: FilePath }

-- | Set a custom progress callback for use by the JS API.
-- | The callback receives a progress message string (e.g. "validating datapoints: 3/30 indicator groups").
-- | Call resetProgressCallback when done.
setProgressCallback :: (String -> Effect Unit) -> Effect Unit
setProgressCallback = setProgressHandler

-- | Reset the progress handler back to the default TTY behaviour.
resetProgressCallback :: Effect Unit
resetProgressCallback = resetProgressHandler

-- | validation function to be exposed to javascript side.
validate' :: ValidateOptions -> Effect (Promise Foreign)
validate' opts = Promise.fromAff do
  let
    path = opts.targetPath
    onlyErrors = opts.onlyErrors
    gendp = opts.generateDP -- when true, emit warnings for datapackage errors

  (Tuple msgs res) <- runValidationT $ VFN.validate path gendp false
  let
    msgsToShow =
      if onlyErrors then Arr.filter (\x -> not $ _.isWarning x) msgs
      else msgs

  when gendp do
    case res of
      Just (Tuple dataset resources) -> do
        unless (Arr.null resources) do
          datapackage <- generateDataPackage path dataset resources
          let
            dpPath = Path.concat [ path, "datapackage.json" ]
          writeTextFile Encoding.UTF8 dpPath $ JSON.writePrettyJSON 4 $ writeDataPackage datapackage
      Nothing -> pure unit

  let
    success = not $ hasError msgs
  pure $ JSON.write $ Tuple success msgsToShow

-- | a function that accepts cli options and run the validation
runMain :: CliOptions -> Effect Unit
runMain opts = launchAff_ do
  let
    path = _.targetPath opts
    noWarning = _.noWarning opts
    mode = _.mode opts
    gendp = _.generateDP opts -- when true, emit warnings for datapackage errors
    fixFormat = _.fixFormat opts

  liftEffect $ log "v2.2.0"
  (Tuple msgs res) <- case mode of
    FileNameBased -> runValidationT $ VFN.validate path gendp fixFormat
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
