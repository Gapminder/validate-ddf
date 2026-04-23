-- | Progress output for CLI and JS API.
-- | A module-level handler slot determines where progress messages go:
-- |   - Default (CLI): overwrite the current terminal line (TTY only)
-- |   - setProgressHandler: route to any Effect-wrapped callback
-- |   - resetProgressHandler: restore the TTY default
module Utils.Progress where

import Prelude
import Effect (Effect)

-- | Overwrite the current terminal line with a progress message.
-- | Routes through the active handler (default: TTY stdout overwrite).
foreign import progress :: String -> Effect Unit

-- | Clear the progress line (TTY default only — custom handlers manage their own display).
foreign import clearProgress :: Effect Unit

-- | Replace the progress handler with a custom callback.
-- | The callback receives the same message strings shown in the terminal.
-- | Call resetProgressHandler when done to restore default behaviour.
foreign import setProgressHandler :: (String -> Effect Unit) -> Effect Unit

-- | Restore the default TTY progress handler.
foreign import resetProgressHandler :: Effect Unit
