module Utils where

import Prelude

import Data.Array (concat, concatMap, elem, filter, filterA, partition)
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.Either (Either(..))
import Data.Function (on)
import Data.List (List(..), singleton, (:))
import Data.List as L
import Data.List.NonEmpty as NEL
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), joinWith)
import Data.Traversable (for) as Tra
import Data.Traversable (sequence, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Effect (Effect)
import Effect.Aff (Aff, attempt, launchAff, launchAff_, message, joinFiber)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log, logShow)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (readTextFile, readdir, writeTextFile, stat)
import Node.FS.Stats (isDirectory, isFile)
import Node.Path (FilePath, basename, extname)
import Node.Path as Path
import Partial.Unsafe (unsafeCrashWith, unsafePartial)

-- | get all csv files from a directory recursively
getFiles :: FilePath -> Array String -> Aff (Array FilePath)
getFiles x excl = do
  allFiles <- readdir x
  let
    fsToGo =
      Arr.filter (\f -> not $ f `elem` excl)
        >>> map (\f -> Path.concat [ x, f ])
        $ allFiles

    isCsvFile path = extname (basename path) == ".csv"

    go f st acc
      | (isFile st && isCsvFile f) = pure $ Arr.cons f acc
      | (isDirectory st) = do
          dirfs <- getFiles f []
          pure $ acc <> dirfs
      | otherwise = pure acc
  Arr.foldM
    ( \acc f -> do
        st <- stat f
        go f st acc
    )
    []
    fsToGo

arrayOfRight :: forall a b. Either a b -> Array b
arrayOfRight (Right b) = [ b ]
arrayOfRight _ = []

arrayOfLeft :: forall a b. Either a b -> Array a
arrayOfLeft (Left a) = [ a ]
arrayOfLeft _ = []

listOfRight :: forall a b. Either a b -> List b
listOfRight (Right b) = singleton b
listOfRight _ = Nil

listOfLeft :: forall a b. Either a b -> List a
listOfLeft (Left a) = singleton a
listOfLeft _ = Nil

-- | Given a list, calculate duplicated items by some comparing function.
-- | return all duplicated items
dupsBy :: forall a. (a -> a -> Ordering) -> Array a -> Array a
dupsBy func lst =
  let
    sorted = Arr.sortBy func lst
  in
    findDups func sorted

findDups :: forall a. (a -> a -> Ordering) -> Array a -> Array a
findDups func = go []
  where
  go acc lst = case Arr.take 2 lst of
    [ a, b ] ->
      let
        remain = Arr.drop 1 lst
      in
        if func a b == EQ then
          go (Arr.snoc acc b) remain
        else
          go acc remain
    _ -> acc

-- | Given a list, calculate duplicated items by some comparing function.
-- | return all duplicated items
dupsByL :: forall a. (a -> a -> Ordering) -> List a -> List a
dupsByL func lst =
  let
    sorted = L.sortBy func lst
  in
    findDupsL func sorted

findDupsL :: forall a. (a -> a -> Ordering) -> List a -> List a
findDupsL func = go L.Nil
  where
  go acc (x : y : xs) =
    if func x y == EQ then go (L.snoc acc y) (y : xs)
    else go acc (y : xs)
  go acc _ = acc


unsafeLookup :: forall k v. Show k => Ord k => k -> Map k v -> v
unsafeLookup k m =
  case M.lookup k m of
    Just x -> x
    Nothing -> unsafeCrashWith $
      "looked up a key which is not existed in the Map: " <> show k

unsafeIndex :: forall a. Array a -> Int -> a
unsafeIndex a i =
  unsafePartial $ Arr.unsafeIndex a i


-- | create a counter
-- counter :: forall a. Ord a => Eq a => NonEmptyArray a -> NonEmptyArray (Tuple a Int)
-- counter xs = map (\x -> (Tuple (NArr.head x) (NArr.length x))) <<< NArr.group <<< NArr.sort $ xs
-- -- | check if there are duplicated entries in a list
-- checkDups :: forall a. Show a => Eq a => Ord a => NonEmptyArray a -> V Errors (NonEmptyArray a)
-- checkDups xs =
--   let
--     ns = counter xs
--     hasDups = NArr.filter (\x -> (snd x) > 1) ns
--   in
--     case Arr.head hasDups of
--       Nothing -> pure xs
--       Just _ -> do
--         let
--           allDups = map fst hasDups
--           msg = "duplicated entry: " <> show allDups
--         invalid [ Error msg ]
