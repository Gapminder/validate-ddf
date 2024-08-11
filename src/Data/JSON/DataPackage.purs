module Data.JSON.DataPackage where

import Prelude

import Control.Monad.Except (runExcept)
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.DDF.Csv.CsvFile (CsvFile)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.DataSet (DataSet(..))
import Data.Either (Either(..))
import Data.HashMap (HashMap)
import Data.HashMap as HM
import Data.List (List)
import Data.List.NonEmpty as NEL
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.String (joinWith)
import Data.String as Str
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.String.NonEmpty.Internal as NES
import Data.Tuple (Tuple(..), snd)
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, invalid)
import Effect (Effect)
import Foreign (Foreign)
import Foreign.Index (readProp)
import Node.Encoding as Encoding
import Node.FS.Sync (exists, readFile, readTextFile)
import Node.Path (FilePath)
import Node.Path as PATH
import Node.Path as Path
import Partial.Unsafe (unsafeCrashWith, unsafePartial)
import Yoga.JSON as JSON
import Yoga.JSON.Error (renderHumanError)

type DataPackage = Record
  ( resources :: Array Resource
  , ddfSchema ::
      { concepts :: Array DdfSchema
      , entities :: Array DdfSchema
      , datapoints :: Array DdfSchema
      , synonyms :: Array DdfSchema
      }
  -- above are calculated from all files. Below are basic infos
  , name :: String
  , title :: String
  , description :: String
  , author :: String
  , license :: String
  , language :: { "id" :: String }
  , created :: String
  )

type Resource =
  { path :: NonEmptyString
  , name :: NonEmptyString
  , schema :: FileSchema
  }

type FileSchema =
  { primaryKey :: Array NonEmptyString
  , fields :: Array FieldSchema
  }

type FieldSchema =
  { name :: NonEmptyString
  , constrains :: Maybe { enum :: Array NonEmptyString }
  }

makeFieldSchema :: NonEmptyString -> Maybe NonEmptyString -> FieldSchema
makeFieldSchema name constrain =
  let
    constrains = case constrain of
      Nothing -> Nothing
      Just v -> Just { enum: [ v ] }
  in
    { name, constrains }

type DdfSchema =
  { primaryKeys :: Array String
  , value :: Maybe String
  , resources :: Array String
  }

datapackageExists :: FilePath -> Effect (V Issues FilePath)
datapackageExists path = do
  let
    datapackagePath = Path.concat [ path, "datapackage.json" ]

    v true = pure path

    v false = invalid [ Issue $ "no datapackage in this folder" ]
  dpExisted <- exists datapackagePath
  pure $ v dpExisted

-- empty :: DataPackage ()
-- empty =
--   { resources: []
--   , ddfSchema:
--       { concepts: []
--       , entities: []
--       , datapoints: []
--       , synonyms: []
--       }
--   }

-- | create resources objects from csv files. This will also handle conflicting names of resources
createResources :: FilePath -> Array CsvFile -> Array Resource
createResources root xs = snd $ Arr.foldl go (Tuple HM.empty []) xs
  where
  go
    :: (Tuple (HashMap String Int) (Array Resource))
    -> CsvFile
    -> (Tuple (HashMap String Int) (Array Resource))
  go (Tuple seenNames res) { fileInfo, csvContent } =
    let
      { headers } = csvContent
      fp = PATH.relative root $ FI.filepath fileInfo
      basename = Path.basenameWithoutExt fp ".csv"

      headers' :: NonEmptyArray NonEmptyString
      headers' = map unwrap headers

      resCount = case HM.lookup basename seenNames of
        Nothing -> 0
        Just v -> v + 1

      resName = case resCount of
        0 -> basename
        n -> basename <> "-" <> (show n)

      primaryKeys = case FI.collection fileInfo of
        FI.Concepts -> [ unsafePartial $ NES.unsafeFromString "concept" ]
        FI.Entities { domain, set } -> case set of
          Nothing -> [ domain ]
          Just s ->
            if s `NEA.elem` headers' then
              [ s ]
            else
              [ domain ]
        FI.DataPoints dp -> Arr.fromFoldable dp.pkeys
        FI.Synonyms x -> [ unsafePartial $ NES.unsafeFromString "concept", x ]
        FI.Translations _ -> unsafeCrashWith "do not gererate resources for translation files."
        FI.Other x -> [ x ]

      fieldSchemas = case FI.collection fileInfo of
        FI.DataPoints dp ->
          let
            constrains = NEA.fromFoldable1 $ NEL.zip dp.pkeys dp.constrains
            others = NEA.difference headers' (NEA.fromFoldable1 dp.pkeys)

            part1 = map (\(Tuple h c) -> makeFieldSchema h c) constrains
            part2 = map (\h -> makeFieldSchema h Nothing) others
          in
            case NEA.fromArray part2 of
              Nothing -> part1
              Just p2 -> part1 <> p2
        _ -> map (\h -> makeFieldSchema h Nothing) headers'

      schema = { fields: NEA.toArray fieldSchemas, primaryKey: primaryKeys }

      seenNames' = HM.insert basename resCount seenNames

      res' = Arr.snoc res $
        { name: unsafePartial $ NES.unsafeFromString resName
        , path: unsafePartial $ NES.unsafeFromString fp
        , schema: schema
        }
    in
      (Tuple seenNames' res')

-- TODO: add ddfSchema generation.
-- 1. create mapping domain id -> domain entity -> all sets
-- 2. create a mapping primary key and value -> resource list
-- 2.1 for each row, find the sets for all entity columns. and produce available primary keys combinations.
-- 2.2 check if there are value columns, if no, then output null for value
-- 2.3 group by same primary key and value, combine resource paths to a list
-- 3. create Tuple String (Array DdfSchema)
-- I think I have to read all csv files again. So it sould be Aff (Tuple String ...) for output
createDdfSchema :: FilePath -> DataSet -> Array Resource -> Tuple String (Array DdfSchema)
createDdfSchema root ds resources = Tuple "wip" []

-- NEXT: try to read datapackage.json, and only read the resources part.
-- And then we can do all validations we need.
readDataPackage :: FilePath -> Effect (Either String (Array Resource))
readDataPackage fp = do
  content <- readTextFile Encoding.UTF8 fp
  let
    resources = do
      json <- JSON.parseJSON content
      prop <- readProp "resources" json
      JSON.read' prop

  case runExcept resources of
    Left e -> pure $ Left $ joinWith "\n" $ Arr.fromFoldable $ map renderHumanError e
    Right x -> pure $ Right x


-- | compare 2 set of resources
-- it's not easy to report line number in json.
-- things to consider
-- when to check datapackage (base on mode!)
-- how to compare resources?
compareResources :: Array Resource -> Array Resource -> V Issues Unit
compareResources res1 res2 = pure unit


-- step1: validate missing files: consturct a tuple of same length array of resource
-- step2: zip 2 resource, compare each item's primary key and fields.