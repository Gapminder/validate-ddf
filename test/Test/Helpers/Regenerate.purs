module Test.Helpers.Regenerate where

import Prelude

import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)

foreign import regenerateBadCsvFilesImpl :: Effect Unit

regenerateBadCsvFiles :: Aff Unit
regenerateBadCsvFiles = liftEffect regenerateBadCsvFilesImpl
