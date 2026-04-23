-- | Progress output for CLI.
-- | Writes a progress message by overwriting the current line in place,
-- | using carriage return and ANSI clear-to-EOL.
-- | Both functions do nothing when stdout is not a TTY (e.g. piped output).
module Utils.Progress where

import Prelude
import Effect (Effect)

-- | Overwrite the current terminal line with a progress message.
foreign import progress :: String -> Effect Unit

-- | Clear the progress line. Call once a section completes.
foreign import clearProgress :: Effect Unit
