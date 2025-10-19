module Test.Unit.Identifier where

import Prelude

import Data.Array as Arr
import Data.DDF.Atoms.Identifier (isLongerThan64Chars, parseId)
import Data.Foldable (for_)
import Data.List.Lazy (repeat, take)
import Data.String.CodeUnits (fromCharArray)
import Data.Validation.Semigroup (andThen, isValid)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldNotSatisfy, shouldSatisfy)

spec :: Spec Unit
spec =
  describe "Identifier Parsing" do
    describe "Valid Identifiers" do
      it "should accept single lowercase character identifiers" do
        let
          validIds =
            [ "a"
            , "x"
            , "_"
            ]
        for_ validIds \s -> do
          parseId s `shouldSatisfy` isValid

      it "should accept lowercase alphanumeric identifiers" do
        let
          validIds =
            [ "abc"
            , "abc123"
            , "test123"
            , "id1"
            ]
        for_ validIds \s -> do
          parseId s `shouldSatisfy` isValid

      it "should accept identifiers with underscores" do
        let
          validIds =
            [ "a_bc_123"
            , "test_value"
            , "_leading"
            , "trailing_"
            , "_middle_"
            , "multi_word_identifier"
            ]
        for_ validIds \s -> do
          parseId s `shouldSatisfy` isValid

    describe "Invalid Identifiers" do
      it "should reject uppercase and mixed case identifiers" do
        let
          invalidIds =
            [ "Z" -- single uppercase
            , "AAA" -- all uppercase
            , "ABC" -- all uppercase
            , "mixedCase" -- camelCase
            , "PascalCase" -- PascalCase
            , "camelCase" -- camelCase
            , "SCREAMING_SNAKE_CASE" -- all uppercase
            , "Test" -- first letter uppercase
            ]
        for_ invalidIds \s -> do
          parseId s `shouldNotSatisfy` isValid
      it "should reject empty strings" do
        parseId "" `shouldNotSatisfy` isValid

      it "should reject identifiers with special characters" do
        let
          invalidIds =
            [ "c?d"
            , "a-b-c"
            , "test@value"
            , "id.name"
            , "value#1"
            , "test value" -- space
            , "id$var"
            , "test%20"
            ]
        for_ invalidIds \s -> do
          parseId s `shouldNotSatisfy` isValid

      it "should reject identifiers with hyphens" do
        let
          invalidIds =
            [ "a-b"
            , "test-id"
            , "kebab-case"
            ]
        for_ invalidIds \s -> do
          parseId s `shouldNotSatisfy` isValid

      it "should reject identifiers with spaces" do
        let
          invalidIds =
            [ "test value"
            , " leading"
            , "trailing "
            , "mid dle"
            ]
        for_ invalidIds \s -> do
          parseId s `shouldNotSatisfy` isValid

    describe "Length Validation" do
      it "should accept identifiers up to 64 characters" do
        let
          id64 = fromCharArray $ Arr.fromFoldable $ take 64 $ repeat 'a'
          output = parseId id64 `andThen` isLongerThan64Chars
        output `shouldSatisfy` isValid

      it "should warn about identifiers longer than 64 characters" do
        let
          id65 = fromCharArray $ Arr.fromFoldable $ take 65 $ repeat 'a'
          output = parseId id65 `andThen` isLongerThan64Chars
        output `shouldNotSatisfy` isValid

      it "should warn about very long identifiers" do
        let
          id100 = fromCharArray $ Arr.fromFoldable $ take 100 $ repeat 'x'
          output = parseId id100 `andThen` isLongerThan64Chars
        output `shouldNotSatisfy` isValid
