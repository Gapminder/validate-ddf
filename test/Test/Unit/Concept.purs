module Test.Unit.Concept where

import Prelude

import Data.DDF.Atoms.Header as Hd
import Data.DDF.Concept (parseConcept)
import Data.DDF.Internal (iteminfo)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.Validation.Semigroup (isValid)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldNotSatisfy, shouldSatisfy)

spec :: Spec Unit
spec =
  describe "Concept Parsing" do
    describe "Valid Concepts" do
      it "should accept valid measure concept" do
        let
          input =
            { conceptId: "population"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Population"
                , Tuple (Hd.unsafeCreate "concept_type") "measure"
                ]
            , _info: Just $ iteminfo "ddf--concepts.csv" 1
            }
        parseConcept input `shouldSatisfy` isValid

      it "should accept valid string concept" do
        let
          input =
            { conceptId: "name"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Name"
                , Tuple (Hd.unsafeCreate "concept_type") "string"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldSatisfy` isValid

      it "should accept valid entity_domain concept" do
        let
          input =
            { conceptId: "geo"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Geography"
                , Tuple (Hd.unsafeCreate "concept_type") "entity_domain"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldSatisfy` isValid

      it "should accept valid entity_set concept with domain" do
        let
          input =
            { conceptId: "country"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Country"
                , Tuple (Hd.unsafeCreate "concept_type") "entity_set"
                , Tuple (Hd.unsafeCreate "domain") "geo"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldSatisfy` isValid

      it "should accept valid time concept with valid name" do
        let
          input =
            { conceptId: "year"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Year"
                , Tuple (Hd.unsafeCreate "concept_type") "time"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldSatisfy` isValid

      it "should accept all valid time concept names" do
        let
          validTimeNames = [ "year", "month", "day", "week", "quarter", "time" ]
          mkInput name =
            { conceptId: name
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") name
                , Tuple (Hd.unsafeCreate "concept_type") "time"
                ]
            , _info: Nothing
            }
        -- All valid time concepts should parse successfully
        parseConcept (mkInput "year") `shouldSatisfy` isValid
        parseConcept (mkInput "month") `shouldSatisfy` isValid
        parseConcept (mkInput "day") `shouldSatisfy` isValid
        parseConcept (mkInput "week") `shouldSatisfy` isValid
        parseConcept (mkInput "quarter") `shouldSatisfy` isValid
        parseConcept (mkInput "time") `shouldSatisfy` isValid

    describe "Invalid Concepts" do
      it "should reject concept with missing concept_type" do
        let
          input =
            { conceptId: "testing"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Testing"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid

      it "should reject concept with reserved ID 'concept'" do
        let
          input =
            { conceptId: "concept"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "concept_type") "string"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid

      it "should reject concept with reserved ID 'concept_type'" do
        let
          input =
            { conceptId: "concept_type"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "concept_type") "string"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid

      it "should reject time concept with invalid name" do
        let
          input =
            { conceptId: "anno" -- not a valid time concept name
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Year"
                , Tuple (Hd.unsafeCreate "concept_type") "time"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid

      it "should reject entity_set without domain field" do
        let
          input =
            { conceptId: "country"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Country"
                , Tuple (Hd.unsafeCreate "concept_type") "entity_set"
                -- missing domain field
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid

      it "should reject entity_set with empty domain" do
        let
          input =
            { conceptId: "country"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Country"
                , Tuple (Hd.unsafeCreate "concept_type") "entity_set"
                , Tuple (Hd.unsafeCreate "domain") "" -- empty domain
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid

      it "should reject concept with empty concept_type" do
        let
          input =
            { conceptId: "testing"
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Testing"
                , Tuple (Hd.unsafeCreate "concept_type") "" -- empty
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid

      it "should reject concept with invalid identifier in conceptId" do
        let
          input =
            { conceptId: "test-concept" -- hyphen not allowed
            , props: Map.fromFoldable
                [ Tuple (Hd.unsafeCreate "name") "Test Concept"
                , Tuple (Hd.unsafeCreate "concept_type") "measure"
                ]
            , _info: Nothing
            }
        parseConcept input `shouldNotSatisfy` isValid
