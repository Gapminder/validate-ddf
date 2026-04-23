module Test.Unit.Identifier where

import Prelude

import Data.Array as Arr
import Data.DDF.Atoms.Identifier (isLongerThan64Chars, parseId)
import Data.Either (fromLeft)
import Data.Foldable (for_)
import Data.List.Lazy (repeat, take)
import Data.Maybe (Maybe(..))
import Data.String (contains)
import Data.String.CodeUnits (fromCharArray)
import Data.String.Pattern (Pattern(..))
import Data.Validation.Issue (Issues)
import Data.Validation.Semigroup (andThen, isValid, toEither)
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

    describe "Error Messages" do
      let
        getMsg :: String -> String
        getMsg s =
          let
            issues = fromLeft [] $ toEither $ parseId s
          in
            case Arr.head issues of
              Nothing -> ""
              Just issue -> show issue

      it "should report the offending character and its position" do
        -- uppercase in the middle: 2584R015 — 'R' is at position 5
        getMsg "2584R015" `shouldSatisfy` contains (Pattern "unexpected character 'R' at position 5")
        -- uppercase at start: ABC — 'A' is at position 1
        getMsg "ABC" `shouldSatisfy` contains (Pattern "unexpected character 'A' at position 1")
        -- hyphen: kebab-case — '-' is at position 6
        getMsg "kebab-case" `shouldSatisfy` contains (Pattern "unexpected character '-' at position 6")
        -- space: test value — ' ' is at position 5
        getMsg "test value" `shouldSatisfy` contains (Pattern "unexpected character ' ' at position 5")

      it "should include the full identifier value in the message" do
        getMsg "2584R015" `shouldSatisfy` contains (Pattern "\"2584R015\"")
        getMsg "BadId" `shouldSatisfy` contains (Pattern "\"BadId\"")

      it "should report unexpected end of string for empty input" do
        getMsg "" `shouldSatisfy` contains (Pattern "unexpected end of string")

      it "should include the allowed character hint" do
        let hint = "identifiers may only contain lowercase letters (a-z), digits (0-9), and underscores"
        getMsg "2584R015" `shouldSatisfy` contains (Pattern hint)
        getMsg "ABC" `shouldSatisfy` contains (Pattern hint)
        getMsg "" `shouldSatisfy` contains (Pattern hint)
