module Data.JSON.DataPackage where

import Prelude

import Control.Monad.Except (runExcept)
import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.DDF.Csv.CsvFile (CsvFile, getPrimaryKey, getPrimaryKeyAndValues)
import Data.DDF.Csv.FileInfo as FI
import Data.DDF.DataSet (DataSet(..))
import Data.Either (Either(..))
import Data.Foldable (for_, sequence_, traverse_)
import Data.Function (on)
import Data.HashMap (HashMap)
import Data.HashMap as HM
import Data.HashSet (HashSet)
import Data.HashSet as HS
import Data.List (List)
import Data.List as List
import Data.List.NonEmpty as NEL
import Data.Map (SemigroupMap, Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Nullable (Nullable)
import Data.Set (Set)
import Data.Set as Set
import Data.String (joinWith)
import Data.String as Str
import Data.String.NonEmpty.Internal (NonEmptyString(..))
import Data.String.NonEmpty.Internal as NES
import Data.Tuple (Tuple(..), snd)
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, invalid)
import Debug (trace)
import Effect (Effect)
import Effect.Console (log)
import Foreign (Foreign, unsafeToForeign)
import Foreign.Index (readProp)
import Node.Encoding as Encoding
import Node.FS.Sync (exists, readFile, readTextFile)
import Node.Path (FilePath)
import Node.Path as PATH
import Node.Path as Path
import Partial.Unsafe (unsafeCrashWith, unsafePartial)
import Utils (dupsBy, unsafeLookup)
import Yoga.JSON (E)
import Yoga.JSON as JSON
import Yoga.JSON.Error (renderHumanError)

type DataPackage =
  { name :: Maybe String
  , title :: Maybe String
  , description :: Maybe String
  , author :: Maybe String
  , license :: Maybe String
  , language :: Maybe { "id" :: String, "name" :: Maybe String }
  , created :: Maybe String
  , translations :: Maybe (Array { "id" :: String, "name" :: Maybe String })
  , version :: Maybe String
  -- below are calculated from all files
  , resources :: Array Resource
  , ddfSchema ::
      { concepts :: Array DdfSchema
      , entities :: Array DdfSchema
      , datapoints :: Array DdfSchema
      , synonyms :: Array DdfSchema
      }
  }

type Resource =
  { path :: NonEmptyString
  , name :: NonEmptyString
  , schema :: FileSchema
  }

type FileSchema =
  { primaryKey :: NonEmptyArray NonEmptyString
  , fields :: Array FieldSchema
  }

type FieldSchema =
  { name :: NonEmptyString
  , constraints :: Maybe { enum :: Array NonEmptyString }
  }

makeFieldSchema :: NonEmptyString -> Maybe NonEmptyString -> FieldSchema
makeFieldSchema name constraint =
  let
    constraints = case constraint of
      Nothing -> Nothing
      Just v -> Just { enum: [ v ] }
  in
    { name, constraints }

type DdfSchema =
  { primaryKey :: Array String
  , value :: Nullable String
  , resources :: Array String
  }

makeDdfSchema :: Array String -> Nullable String -> Array String -> DdfSchema
makeDdfSchema primaryKey value resources = { primaryKey, value, resources }

datapackageExists :: FilePath -> Effect (V Issues FilePath)
datapackageExists path = do
  let
    datapackagePath = Path.concat [ path, "datapackage.json" ]
  dpExists <- exists datapackagePath
  if dpExists then
    pure $ pure datapackagePath
  else
    pure $ invalid [ Issue $ "no datapackage in this folder" ]

-- | create resources objects from csv files. This will also handle conflicting names of resources
createResources :: FilePath -> Array CsvFile -> Array Resource
createResources root xs = snd $ Arr.foldl go (Tuple HM.empty []) xs
  where
  go
    :: (Tuple (HashMap String Int) (Array Resource))
    -> CsvFile
    -> (Tuple (HashMap String Int) (Array Resource))
  go (Tuple seenNames res) csvfile@{ fileInfo, csvContent } =
    let
      { headers } = csvContent
      headers' = map unwrap headers
      fp = PATH.relative root $ FI.filepath fileInfo
      basename = Path.basenameWithoutExt fp ".csv"

      resCount = case HM.lookup basename seenNames of
        Nothing -> 0
        Just v -> v + 1

      resName = case resCount of
        0 -> basename
        n -> basename <> "-" <> (show n)

      primaryKeys = getPrimaryKey csvfile

      fieldSchemas = case FI.collection fileInfo of
        FI.DataPoints dp ->
          let
            constraints = NEA.fromFoldable1 $ NEL.zip dp.pkeys dp.constraints
            others = NEA.difference headers' (NEA.fromFoldable1 dp.pkeys)

            part1 = map (\(Tuple h c) -> makeFieldSchema h c) constraints
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


-- | read datapackage.json content, and only read the resources part.
parseDataPackageResources :: String -> V Issues (Array Resource)
parseDataPackageResources content = do
  let
    resources = do
      json <- JSON.parseJSON content
      prop <- readProp "resources" json
      JSON.read' prop

  case runExcept resources of
    Left e -> invalid
      [ Issue $
          "failed to read datapackage resources. Reason: "
            <> joinWith "\n" (Arr.fromFoldable $ map renderHumanError e)
      ]
    Right x -> pure x

-- | read datapackage.json content
parseDataPackage :: String -> V Issues DataPackage
parseDataPackage content =
  case JSON.readJSON content of
    Left e -> invalid
      [ Issue $
          "failed to read datapackage. Reason: "
            <> (joinWith "\n" $ Arr.fromFoldable $ map renderHumanError e)
      ]
    Right x -> pure x

-- | use this function to fix the field order in output json file.
writeDataPackage :: DataPackage -> Foreign
writeDataPackage dp =
  let
    name = JSON.write dp.name
    title = JSON.write dp.title
    description = JSON.write dp.description
    author = JSON.write dp.author
    license = JSON.write dp.license
    language = JSON.write dp.language
    created = JSON.write dp.created
    translations = JSON.write dp.translations
    version = JSON.write dp.version
    resources = JSON.write dp.resources
    ddfSchema = JSON.write dp.ddfSchema

    dp' = { name, title, description, author, license, language, created, translations, version, resources, ddfSchema }
  in
    unsafeToForeign dp'


-- | compare 2 set of resources
compareResources :: Array Resource -> Array Resource -> V Issues Unit
compareResources expected actual =
  let
    expectedSorted = Arr.sortBy (compare `on` _.path) expected
    actualSorted = Arr.sortBy (compare `on` _.path) actual
    expectedPaths = map _.path expectedSorted
    actualPaths = map _.path actualSorted
  in
    if expectedPaths /= actualPaths then
      let
        items = Arr.difference expectedPaths actualPaths
        itemsStr = Str.joinWith ", " $ map NES.toString items
      in
        invalid [ Issue $ "datapackage.json: Missing file in resource list. Expected following resources exist: " <> itemsStr ]
    else
      sequence_ $ Arr.zipWith compareOneResource expectedSorted actualSorted

compareOneResource :: Resource -> Resource -> V Issues Unit
compareOneResource x y =
  if x.path /= y.path then
    -- NOTE: we shouldn't compare 2 resource with different paths. maybe should use unsafeCrash here.
    invalid
      [ Issue $
          "datapackage.json: tried to compare resources with different path: "
            <> NES.toString x.path
            <> " and "
            <> NES.toString y.path
      ]
  else if x.schema /= y.schema then
    invalid
      [ Issue $
          "datapackage.json: schema differs from local file for resource: " <> NES.toString x.path
      ]
  else
    pure unit

noDuplicatedResources :: Array Resource -> V Issues Unit
noDuplicatedResources xs =
  case dupsBy (compare `on` _.path) xs of
    [] -> pure unit
    dups -> invalid issues
      where
      items = Arr.nubBy (compare `on` _.path) dups
      issues = map
        ( \x ->
            Issue $ "datapackage.json: duplicated file path: "
              <> (NES.toString $ _.path x)
        )
        items

