-- | This module defines DDF csv file naming conventions

module Data.DDF.Csv.FileInfo where

import Prelude

import Control.Alt ((<|>))
import Data.Array as A
import Data.Array.NonEmpty (NonEmptyArray)
import Data.DDF.Atoms.Identifier (identifier)
import Data.Either (Either(..))
import Data.Generic.Rep (class Generic)
import Data.Hashable (class Hashable, hash)
import Data.List (List(..))
import Data.List.Types (NonEmptyList)
import Data.Maybe (Maybe(..))
import Data.Set as Set
import Data.Show.Generic (genericShow)
import Data.String (Pattern(..), split, stripSuffix)
import Data.String.NonEmpty (NonEmptyString(..), toString)
import Data.String.NonEmpty as NES
import Data.String.Utils as Str
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, andThen, invalid, toEither)
import Node.Path (FilePath, basename)
import Node.Path as Path
import StringParser (Parser, choice, eof, runParser, sepBy1, sepEndBy1, string, try)

-- | file info are information contains in file name.
-- | it consists of 3 parts
-- | the full file path, the collection info object and resource name
-- | resource name is useful in datapackage.
type FileInfo =
  { filepath :: String
  , collectionInfo :: CollectionInfo
  }

makeFileInfo :: String -> CollectionInfo -> FileInfo
makeFileInfo filepath collectionInfo = { filepath, collectionInfo }

-- | collection info
-- | there are 5 collections in DDF
-- | Entities, DataPoints and Concepts
-- | and Synonyms, Metadata.
-- | There is also Translations for ddfcsv
-- | So we will have 6 type of collection.
data CollectionInfo
  = Concepts
  | Entities Ent
  | DataPoints DP
  | Synonyms NonEmptyString
  | Translations Target
  | Other NonEmptyString -- TODO: add metadata

type Ent = { domain :: NonEmptyString, set :: Maybe NonEmptyString }

type DP = -- TODO: constrains should be a list of list, because multiple items in the constrains is allowed.
  { indicator :: NonEmptyString
  , pkeys :: NonEmptyList NonEmptyString
  , constrains :: NonEmptyList (Maybe NonEmptyString) -- length of pkeys should equal to length of constrains.
  }

type Target =
  { path :: FilePath
  , language :: String
  }

instance showCollection :: Show CollectionInfo where
  show Concepts = "concepts"
  show (Entities e) = case e.set of
    Nothing -> "entity_domain: " <> show e.domain
    Just s -> "entity_domain: " <> show e.domain <> "; entnty_set: " <> show s
  show (DataPoints d) = "datapoints: " <> show d.indicator <> ", by: " <> (NES.joinWith "," d.pkeys)
  show (Synonyms s) = "synonyms for " <> toString s
  show (Translations t) = "translation for " <> _.path t <> " in " <> _.language t
  show (Other x) = "custom collection: " <> show x

-- | some constants
--
data CollectionConstant
  = CONCEPTS
  | ENTITIES
  | DATAPOINTS
  | SYNONYMS
  | TRANSLATIONS
  | OTHERS

derive instance genericCollectionConstant :: Generic CollectionConstant _

instance showCollectionConstant :: Show CollectionConstant where
  show = genericShow

derive instance eqCollectionConstant :: Eq CollectionConstant
derive instance ordCollectionConstant :: Ord CollectionConstant
instance hashableCollectionConstant :: Hashable CollectionConstant where
  hash x = hash $ show x

--
-- end

-- | get the collection type.
getCollectionType :: CollectionInfo -> CollectionConstant
getCollectionType Concepts = CONCEPTS
getCollectionType (Entities _) = ENTITIES
getCollectionType (DataPoints _) = DATAPOINTS
getCollectionType (Synonyms _) = SYNONYMS
getCollectionType (Translations _) = TRANSLATIONS
getCollectionType (Other _) = OTHERS

-- | define Eq instance for collection info, useful to group the files
instance eqCollection :: Eq CollectionInfo where
  eq a b = getCollectionType a == getCollectionType b

-- | define Ord instance for collection info, useful to sort and group the files
instance ordCollection :: Ord CollectionInfo where
  compare a b = compare (getCollectionType a) (getCollectionType b)

-- | compare the collection of datapoints, for sorting and grouping indicator files.
compareDP :: CollectionInfo -> CollectionInfo -> Ordering
compareDP (DataPoints dp1) (DataPoints dp2)
  | (dp1.indicator == dp2.indicator) = compare dp1.pkeys dp2.pkeys
  | otherwise = compare dp1.indicator dp2.indicator
compareDP _ _ = EQ -- otherfiles are grouped together

isConceptFile :: FileInfo -> Boolean
isConceptFile { collectionInfo } = getCollectionType collectionInfo == CONCEPTS

isEntitiesFile :: FileInfo -> Boolean
isEntitiesFile { collectionInfo } = getCollectionType collectionInfo == ENTITIES

isDataPointsFile :: FileInfo -> Boolean
isDataPointsFile { collectionInfo } = getCollectionType collectionInfo == DATAPOINTS

filepath :: FileInfo -> FilePath
filepath = _.filepath

collection :: FileInfo -> CollectionInfo
collection = _.collectionInfo

-- | filter a collection from array of fileinfos
getCollectionFiles :: String -> Array FileInfo -> Array FileInfo
getCollectionFiles "concepts" = A.filter isConceptFile
getCollectionFiles "entities" = A.filter isEntitiesFile
getCollectionFiles "datapoints" = A.filter isDataPointsFile
getCollectionFiles _ = \_ -> [] -- partical function

--
-- Below are parsers for ddf file names
--
ddfFileBegin :: Parser Unit
ddfFileBegin = void $ string "ddf--"

-- ddfFileEnd :: Parser Unit
-- ddfFileEnd = string "" *> eof
-- Parse concept file name
-- | concept file name format 1
c1 :: Parser String
c1 = string "ddf--concepts" <* eof

-- | concept file name format 2
c2 :: Parser String
c2 = do
  p1 <- string "ddf--concepts--"
  p2 <- string "discrete" <|> string "continuous"
  void $ eof
  pure $ p1 <> p2

conceptFile :: Parser CollectionInfo
conceptFile = choice [ try c1, try c2 ] *> pure Concepts

-- parse Entity file name
-- | entity domain without set info
e1 :: Parser CollectionInfo
e1 = do
  ddfFileBegin
  void $ string "entities--"
  domain <- identifier
  eof
  pure $ Entities { domain: domain, set: Nothing }

-- | entity domain with set info
e2 :: Parser CollectionInfo
e2 = do
  ddfFileBegin
  void $ string "entities--"
  domain <- identifier
  void $ string "--"
  -- TODO: support multiple entity sets in same file.
  eset <- identifier
  eof
  pure $ Entities { domain: domain, set: Just eset }

entityFile ∷ Parser CollectionInfo
entityFile = choice [ try e2, try e1 ]

-- datapoint file parsers
--
pkeyWithConstrain :: Parser (Tuple NonEmptyString (Maybe NonEmptyString))
pkeyWithConstrain = do
  key <- identifier
  -- TODO: support multiple constrains
  void $ string "-"
  constrain <- identifier
  pure $ Tuple key (Just constrain)

pkeyNoConstrain :: Parser (Tuple NonEmptyString (Maybe NonEmptyString))
pkeyNoConstrain = do
  key <- identifier
  pure (Tuple key Nothing)

pkey :: Parser (Tuple NonEmptyString (Maybe NonEmptyString))
pkey = choice [ try pkeyWithConstrain, try pkeyNoConstrain ]

datapointFile :: Parser CollectionInfo
datapointFile = do
  ddfFileBegin
  void $ string "datapoints--"
  -- TODO: support multiple indicators
  indicator <- identifier
  void $ string "--by--"
  dims <- sepBy1 pkey (string "--")
  eof
  let
    pkeys = map fst dims

    constrains = map snd dims
  pure $ DataPoints { indicator, pkeys, constrains }

-- | Synonyms file parsers
--
synonymFile :: Parser CollectionInfo
synonymFile = do
  ddfFileBegin
  void $ string "synonyms--"
  conceptName <- identifier
  eof
  pure $ Synonyms conceptName

getName :: String -> Maybe String
getName = stripSuffix (Pattern ".csv")

-- | Translation files parsers
-- | we only need to analysis the target file so we don't do string parsing here.
translationFile :: FilePath -> FilePath -> V Issues CollectionInfo
translationFile root fp =
  if isTranslationFile root fp then
    let
      -- isTranslationFile will check if fp startswith root
      -- so we can get the relative path from root to fp without issue.
      relpath = Path.relative root fp
      segments = split (Pattern Path.sep) relpath
    in
      case A.take 3 segments of
        [ "lang", language, _ ] ->
          let
            targetpath = Path.relative (Path.concat [ root, "lang", language ]) fp
          in
            pure $ Translations { path: targetpath, language: language }
        _ -> invalid
          [ InvalidCSV $
              "not enough segments to extract target language apd target path for translation file " <> fp
          ]
  else
    invalid [ InvalidCSV "not a translation file" ]

isTranslationFile :: FilePath -> FilePath -> Boolean
isTranslationFile root fp =
  Str.startsWith langpath fp'
  where
  root' = Path.normalize root
  fp' = Path.normalize fp
  langpath = Path.concat [ root', "lang" ]

validateFileInfo :: FilePath -> FilePath -> V Issues FileInfo
validateFileInfo root fp = case getName $ basename fp of
  Nothing -> invalid [ InvalidCSV "not a csv file" ]
  Just fn ->
    if isTranslationFile root fp then
      translationFile root fp
        `andThen`
          (\ci -> pure $ makeFileInfo fp ci)
    else
      let
        fileParser = choice
          [ try conceptFile
          , try entityFile
          , try datapointFile
          , try synonymFile
          ]
      in
        case runParser fileParser fn of
          Right ci -> pure $ makeFileInfo fp ci
          Left err -> invalid [ InvalidCSV $ "error parsing file: " <> err.error ]

parseFileInfo :: FilePath -> FilePath -> V Issues FileInfo
parseFileInfo = validateFileInfo

fromFilePath :: FilePath -> FilePath -> Either Issues FileInfo
fromFilePath root fp = toEither $ validateFileInfo root fp
