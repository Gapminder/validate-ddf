module Data.DDF.Internal where

import Prelude

import Data.DDF.Atoms.Identifier (Identifier)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, invalid)
import Node.Path (FilePath)

-- | ItemInfo is the additional info to carry with an item (e.g Concept)
-- type ItemInfo =
--   { fileIdx :: Int
--   , row :: Int
--   }

-- getItemFilePath :: Map Int FilePath -> ItemInfo -> V Issues FilePath
-- getItemFilePath m info =
--   case Map.lookup info.fileIdx m of
--     Just fp -> pure fp
--     Nothing -> invalid [ Issue $ "failed to lookup file path with id" <> show info.fileIdx ]


data ItemInfo = ItemInfo FilePath Int

instance showItemInfo :: Show ItemInfo where
  show (ItemInfo fp i) = "item at " <> show fp <> ", line " <> show i


pathAndRow :: ItemInfo -> Tuple FilePath Int
pathAndRow (ItemInfo fp i) = (Tuple fp i)


iteminfo :: FilePath -> Int -> ItemInfo
iteminfo fp i = ItemInfo fp i