-- | Byte-level format checks on CSV files: BOM, CRLF, and UTF-8 validity.
module Data.Csv.FileCheck
  ( FormatIssue(..)
  , checkFileFormat
  , fixFileFormat
  ) where

import Prelude

import Data.Array as Arr
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Uncurried (EffectFn1, runEffectFn1)
import Node.Path (FilePath)

-- | Type of format issue found in a CSV file.
data FormatIssue = BOM | CRLF | ENCODING

derive instance Eq FormatIssue
derive instance Ord FormatIssue
instance Show FormatIssue where
  show BOM = "BOM"
  show CRLF = "CRLF"
  show ENCODING = "ENCODING"

-- | Parse the raw string from FFI into a FormatIssue.
fromString :: String -> Maybe FormatIssue
fromString = case _ of
  "BOM" -> Just BOM
  "CRLF" -> Just CRLF
  "ENCODING" -> Just ENCODING
  _ -> Nothing

foreign import checkFileFormatImpl :: EffectFn1 FilePath (Array String)
foreign import fixFileFormatImpl :: EffectFn1 FilePath Unit

-- | Returns an array of format issues found in the file.
-- | An empty array means the file is correctly formatted.
checkFileFormat :: FilePath -> Effect (Array FormatIssue)
checkFileFormat fp = do
  strs <- runEffectFn1 checkFileFormatImpl fp
  pure $ Arr.catMaybes $ map fromString strs

-- | Fixes format issues in-place: strips UTF-8 BOM and converts CRLF to LF.
fixFileFormat :: FilePath -> Effect Unit
fixFileFormat fp = runEffectFn1 fixFileFormatImpl fp
