module Test.Unit.Header where

import Prelude

import Data.DDF.Atoms.Header (Header, isEntitySetHeader, parseEntityHeader, parseGeneralHeader, unsafeCreate)
import Data.Foldable (for_)
import Data.Validation.Semigroup (isValid)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotSatisfy, shouldSatisfy)

spec :: Spec Unit
spec =
  describe "Header Parsing" do
    describe "General Headers" do
      it "should accept valid lowercase identifier headers" do
        let
          validHeaders =
            [ "concept"
            , "concept_type"
            , "name"
            , "geo"
            , "population"
            , "year"
            , "a"
            , "test_value_123"
            ]
        for_ validHeaders \h -> do
          parseGeneralHeader h `shouldSatisfy` isValid

      it "should reject headers with special characters" do
        let
          invalidHeaders =
            [ "test-header"
            , "test header"
            , "test@value"
            , "test.value"
            , "test$var"
            ]
        for_ invalidHeaders \h -> do
          parseGeneralHeader h `shouldNotSatisfy` isValid

      it "should accept uppercase headers" do
        let
          validHeaders =
            [ "Concept"
            , "CONCEPT"
            , "Name"
            , "TEST"
            ]
        for_ validHeaders \h -> do
          parseGeneralHeader h `shouldSatisfy` isValid

      it "should reject empty headers" do
        parseGeneralHeader "" `shouldNotSatisfy` isValid

      it "should reject headers with is-- prefix" do
        -- General headers should not accept is-- prefix
        -- (those are only valid in entity headers)
        parseGeneralHeader "is--country" `shouldNotSatisfy` isValid

    describe "Entity Headers" do
      it "should accept valid identifier headers" do
        let
          validHeaders =
            [ "geo"
            , "name"
            , "latitude"
            , "longitude"
            , "entity_set"
            ]
        for_ validHeaders \h -> do
          parseEntityHeader h `shouldSatisfy` isValid

      it "should accept is-- prefix headers" do
        let
          validIsHeaders =
            [ "is--country"
            , "is--region"
            , "is--geo"
            , "is--city"
            , "is--world_4region"
            ]
        for_ validIsHeaders \h -> do
          parseEntityHeader h `shouldSatisfy` isValid

      it "should reject invalid is-- headers" do
        let
          invalidHeaders =
            [ "is--" -- missing identifier after is--
            , "is--test-value" -- hyphen not allowed
            ]
        for_ invalidHeaders \h -> do
          parseEntityHeader h `shouldNotSatisfy` isValid

      it "should accept is-- headers with uppercase" do
        let
          validHeaders =
            [ "is--Country" -- uppercase now allowed
            , "is--World_4Region"
            ]
        for_ validHeaders \h -> do
          parseEntityHeader h `shouldSatisfy` isValid

      it "should reject headers with special characters" do
        let
          invalidHeaders =
            [ "test-header"
            , "test header"
            , "test@value"
            ]
        for_ invalidHeaders \h -> do
          parseEntityHeader h `shouldNotSatisfy` isValid

      it "should reject empty headers" do
        parseEntityHeader "" `shouldNotSatisfy` isValid

    describe "Header Utilities" do
      it "should detect is-- entity set headers" do
        let header = unsafeCreate "is--country"
        isEntitySetHeader header `shouldEqual` true

      it "should detect regular headers as not entity set headers" do
        let
          regularHeaders =
            [ "name"
            , "geo"
            , "concept_type"
            , "population"
            ]
        for_ regularHeaders \h -> do
          let header = unsafeCreate h
          isEntitySetHeader header `shouldEqual` false

      it "should handle edge case: header starting with 'is' but not 'is--'" do
        let header = unsafeCreate "island"
        isEntitySetHeader header `shouldEqual` false
