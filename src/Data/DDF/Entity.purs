module Data.DDF.Entity where

import Prelude

import Data.Array as Arr
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEA
import Data.DDF.Atoms.Boolean (parseBoolean)
import Data.DDF.Atoms.Header (Header(..), headerVal)
import Data.DDF.Atoms.Identifier (Identifier)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Atoms.Value (Value, parseStrVal')
import Data.DDF.Internal (ItemInfo, iteminfo, pathAndRow)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromJust, isNothing)
import Data.Newtype (unwrap)
import Data.String (Pattern(..))
import Data.String as Str
import Data.String.NonEmpty.Internal (NonEmptyString(..), stripPrefix, toString)
import Data.Traversable (sequence, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (V, invalid, isValid, andThen)
import Debug (trace)
import Partial.Unsafe (unsafePartial)
import Safe.Coerce (coerce)

-- | Entity type.
-- | Entity MUST have id, entity_domain.
-- | Entity MAY have entity_set, which can have multiple values
newtype Entity = Entity
  { entityId :: Identifier
  , entityDomain :: Identifier
  , entitySets :: Array Identifier
  , props :: Props
  , _info :: Maybe ItemInfo
  }

instance eqEntity :: Eq Entity where
  eq (Entity a) (Entity b) = (a.entityId == b.entityId) && (a.entityDomain == b.entityDomain)

instance showEntity :: Show Entity where
  show (Entity x) = "Entity " <> Id.value x.entityId <> " of " <> Id.value x.entityDomain

-- | Properties type
-- | The key MUST be vaild Ideitifier
-- the Key MUST be valid identifier
-- We will validate values in the properties (such as domain)
-- while we parse entire dataset, so just use String here
type Props = Map Identifier String

entity :: Identifier -> Identifier -> Array Identifier -> Props -> Entity
entity entityId entityDomain entitySets props = Entity { entityId, entityDomain, entitySets, props, _info }
  where
  _info = Nothing

getId :: Entity -> Identifier
getId (Entity e) = e.entityId

getItemInfo :: Entity -> ItemInfo
getItemInfo (Entity e) = case e._info of
  Nothing -> iteminfo "" (-1)
  Just info -> info

getDomain :: Entity -> Identifier
getDomain (Entity e) = e.entityDomain

getDomainAndId :: Entity -> Tuple Identifier Identifier
getDomainAndId (Entity e) = Tuple e.entityDomain e.entityId -- FIXME: change value order

getDomainAndSets :: Entity -> NonEmptyArray Identifier
getDomainAndSets (Entity e) = NEA.cons' e.entityDomain e.entitySets

getEntitySets :: Entity -> Array Identifier
getEntitySets (Entity e) = e.entitySets

getIdAndFile :: Entity -> Tuple Identifier String
getIdAndFile (Entity e) = Tuple e.entityId fp
  where
  fp = case e._info of
    Nothing -> ""
    Just x -> fst $ pathAndRow x

setInfo :: Maybe ItemInfo -> Entity -> Entity
setInfo _info (Entity e) = Entity (e { _info = _info })

-- | Entity input from CsvFile
-- | The entityDomain and entitySet field comes from file name, so they are already nonempty
-- | entitySet might be absent.
type EntityInput =
  { entityId :: String
  , entityDomain :: NonEmptyString
  , entitySet :: Maybe NonEmptyString
  , props :: Map Header String
  , _info :: Maybe ItemInfo
  }

-- | entity ID MUST be valid Identifier
validEntityId :: String -> V Issues Identifier
validEntityId = Id.parseId

-- because entity domain and entity set are validated in early processes
-- no need to do more things.
validEntityDomainId :: NonEmptyString -> V Issues Identifier
validEntityDomainId = pure <<< coerce

validEntitySetId :: NonEmptyString -> V Issues Identifier
validEntitySetId = pure <<< coerce

-- | split entity properties input, separate is--entity_set header and others
-- FIXME: This should be done in CSVfile parsing stage?
splitEntAndProps
  :: Map Header String
  -> Tuple (Array (Tuple Identifier String)) (Array (Tuple Identifier String))
splitEntAndProps props =
  let
    isIsHeader (Tuple header _) =
      let
        headerStr = headerVal header
      in
        case stripPrefix (Pattern "is--") headerStr of
          Nothing -> false
          Just _ -> true

    isHeaderToIdentifier header = Id.unsafeCreate $ Str.drop 4 $ toString $ headerVal header

    headerToIdentifier header = Id.unsafeCreate $ toString $ headerVal header

    { yes, no } = Arr.partition isIsHeader $ M.toUnfoldableUnordered props

    yes_ = map (\(Tuple h v) -> Tuple (isHeaderToIdentifier h) v) yes

    no_ = map (\(Tuple h v) -> Tuple (headerToIdentifier h) v) no
  in
    Tuple yes_ no_

-- | try to parse all is--headers and find all sets memberships
getEntitySetsFromHeaders :: Array (Tuple Identifier String) -> V Issues (Array Identifier)
getEntitySetsFromHeaders lst =
  entitySetWithTureValue
    `andThen` (\xs -> pure $ Arr.catMaybes xs)
  where
  entitySetWithTureValue = traverse collectTrueItem lst

  collectTrueItem (Tuple header value) =
    parseBoolean value
      `andThen`
      (\v ->
        if v then
          pure $ Just header
        else
          pure Nothing
      )

-- | Entity sets prased from csv headers might contains the domain. we should drop that
-- | also we should validate: is--domain for a domain must be TRUE.
removeIsDomainProp :: NonEmptyString -> Array (Tuple Identifier String) -> V Issues (Array (Tuple Identifier String))
removeIsDomainProp domain xs =
  case Arr.elemIndex domain (map (fst >>> Id.value1) xs) of
    Nothing -> pure xs
    Just i ->
      let
        val = unsafePartial $ Arr.unsafeIndex xs i
        xs' = unsafePartial $ fromJust $ Arr.deleteAt i xs
      in
        parseBoolean (snd val)
          `andThen`
        (\v ->
          if v then
            pure xs'
          else
            invalid [ Issue $ "is--" <> toString domain <> " must be TRUE for " <> toString domain <> " domain." ]
        )

parseEntity :: EntityInput -> V Issues Entity
parseEntity { entityId: eid, entityDomain: edm, entitySet: es, props: props, _info } =
  if Str.null eid then
    invalid [ Issue $ "entity MUST have an entity id" ]
  else
    let
      validEdomain = validEntityDomainId edm
      Tuple esets propsLst = splitEntAndProps props
      validEsets =
        -- get all true values from is-- header
        getEntitySetsFromHeaders esets
        -- combine the sets from filename and sets from file headers.
          `andThen`
            ( \parsed ->
                case es of
                  Nothing -> pure parsed
                  Just es' -> pure $ Arr.nub $ Arr.cons (coerce es') parsed
            )
      validEid = validEntityId eid
      propsMinusIsHeaders = M.fromFoldable propsLst
    in
      ( entity
          <$> validEid
          <*> validEdomain
          <*> validEsets
          <*> (pure propsMinusIsHeaders)
      )
        `andThen`
          (\e -> pure $ setInfo _info e)
