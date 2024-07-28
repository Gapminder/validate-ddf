module Utils.GC where

import Prelude

import Effect (Effect)

-- | Force garbage collection.
-- | Requires node to be run with the --force-gc flag.
foreign import gc :: Effect Unit