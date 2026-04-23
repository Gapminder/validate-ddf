module Test.Unit.Entity where

import Prelude

import Data.DDF.Atoms.Header as Hd
import Data.DDF.Entity (parseEntity)
import Data.DDF.Internal (iteminfo)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.String.NonEmpty (unsafeFromString)
import Data.Tuple (Tuple(..))
import Data.Validation.Semigroup (isValid)
import Partial.Unsafe (unsafePartial)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldNotSatisfy, shouldSatisfy)

spec :: Spec Unit
spec =
  describe "Entity Parsing" do
    describe "Valid Entities" do
      it "should accept entity with valid id and domain" do
        let
          input =
            { entityId: "swe"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.empty
            , _info: Just $ iteminfo "ddf--entities--geo.csv" 1
            }
        parseEntity input `shouldSatisfy` isValid

      it "should accept entity with entity set" do
        let
          input =
            { entityId: "swe"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Just $ unsafePartial $ unsafeFromString "country"
            , props: Map.empty
            , _info: Nothing
            }
        parseEntity input `shouldSatisfy` isValid

      it "should accept entity with properties" do
        let
          input =
            { entityId: "swe"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Sweden"
                , Tuple (Hd.unsafeCreate "latitude") "62.0"
                , Tuple (Hd.unsafeCreate "longitude") "15.0"
                ]
            , _info: Nothing
            }
        parseEntity input `shouldSatisfy` isValid

      it "should accept entity with is-- headers set to true" do
        let
          input =
            { entityId: "swe"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Sweden"
                , Tuple (Hd.unsafeCreate "is--country") "true"
                , Tuple (Hd.unsafeCreate "is--geo") "true"
                ]
            , _info: Nothing
            }
        parseEntity input `shouldSatisfy` isValid

      it "should accept entity with is-- headers set to false" do
        let
          input =
            { entityId: "stockholm"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Stockholm"
                , Tuple (Hd.unsafeCreate "is--country") "FALSE"
                , Tuple (Hd.unsafeCreate "is--city") "TRUE"
                ]
            , _info: Nothing
            }
        parseEntity input `shouldSatisfy` isValid

      it "should accept entity with lowercase identifier" do
        let
          input =
            { entityId: "test_entity_123"
            , entityDomain: unsafePartial $ unsafeFromString "test_domain"
            , entitySet: Nothing
            , props: Map.empty
            , _info: Nothing
            }
        parseEntity input `shouldSatisfy` isValid

    describe "Invalid Entities" do
      it "should reject entity with empty id" do
        let
          input =
            { entityId: ""
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.empty
            , _info: Nothing
            }
        parseEntity input `shouldNotSatisfy` isValid

      it "should reject entity with invalid identifier (hyphen)" do
        let
          input =
            { entityId: "test-entity"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.empty
            , _info: Nothing
            }
        parseEntity input `shouldNotSatisfy` isValid

      it "should reject entity with invalid identifier (special chars)" do
        let
          input =
            { entityId: "test@entity"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.empty
            , _info: Nothing
            }
        parseEntity input `shouldNotSatisfy` isValid

      it "should accept entity with uppercase identifier" do
        let
          input =
            { entityId: "SWE"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.empty
            , _info: Nothing
            }
        parseEntity input `shouldSatisfy` isValid

      it "should reject entity with invalid boolean in is-- header" do
        let
          input =
            { entityId: "swe"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "is--country") "yes" -- invalid boolean
                ]
            , _info: Nothing
            }
        parseEntity input `shouldNotSatisfy` isValid

      it "should reject entity with is--domain set to false" do
        let
          input =
            { entityId: "swe"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "is--geo") "false" -- domain must be true
                ]
            , _info: Nothing
            }
        parseEntity input `shouldNotSatisfy` isValid
