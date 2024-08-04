-- | FFI binding for json-stable-stringify npm package to provide sorting of keys

module Data.JSON.StableStringify where

import Prelude

import Data.Function.Uncurried (Fn2, runFn2)
import Foreign (Foreign)
import Foreign.Object (Object)

foreign import stableStringifyImpl :: Fn2 Int Foreign String

stableStringify :: Int -> Foreign -> String
stableStringify = runFn2 stableStringifyImpl