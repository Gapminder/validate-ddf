module Test.Unit.Value where

import Prelude

import Data.DDF.Atoms.Value (parseBoolVal, parseJsonListVal, parseNumVal, parseStrVal, parseTimeVal)
import Data.Foldable (for_)
import Data.Validation.Semigroup (isValid)
import Effect.Aff (Aff)
import Test.Spec (Spec, describe, it, pending)
import Test.Spec.Assertions (shouldNotSatisfy, shouldSatisfy)

spec :: Spec Unit
spec =
  describe "Value Parsing" do
    describe "Number Values" do
      it "should reject invalid numbers" do
        let
          invalidNums =
            [ "xx"
            , "x1"
            , "?4?"
            , "abc"
            ]
        for_ invalidNums \s -> do
          parseNumVal s `shouldNotSatisfy` isValid

      pending "should reject numbers with trailing garbage (requires stricter parsing in purescript-numbers)"
      -- These currently pass because Num.fromString uses parseFloat()
      -- which stops at invalid characters: "12.34.56" -> 12.34, "1,234" -> 1.0
      -- Need to fix upstream in purescript-numbers to use Number() instead
      -- do
      --   let
      --     invalidNums =
      --       [ "12.34.56"  -- multiple dots
      --       , "123abc"    -- trailing letters
      --       , "123.45x"   -- trailing char after decimal
      --       , "1,234"     -- comma separator (parseFloat stops at comma)
      --       , "  123  "   -- whitespace (depending on desired behavior)
      --       ]
      --   for_ invalidNums \s -> do
      --     parseNumVal s `shouldNotSatisfy` isValid

      it "should accept valid numbers" do
        let
          validNums =
            [ "123"
            , "0"
            , "-42"
            , "3.14"
            , "-0.5"
            , "1e10"
            , "1.5e-3"
            ]
        for_ validNums \s -> do
          parseNumVal s `shouldSatisfy` isValid

      it "should reject empty string for number" do
        parseNumVal "" `shouldNotSatisfy` isValid

    describe "Time Values" do
      it "should accept valid 3-4 digit years" do
        let
          validTimes =
            [ "2023"
            , "999"
            , "1000"
            , "1990"
            , "0001"
            ]
        for_ validTimes \s -> do
          parseTimeVal s `shouldSatisfy` isValid

      it "should reject invalid time values" do
        let
          invalidTimes =
            [ "99" -- too short
            , "12" -- too short
            , "" -- empty string
            , "abc"
            , "20x3"
            , "12345" -- too long
            ]
        for_ invalidTimes \s -> do
          parseTimeVal s `shouldNotSatisfy` isValid

      pending "should support more complex time formats (ISO dates, quarters, etc.)"

    describe "String Values" do
      it "should accept any string value" do
        let
          validStrings =
            [ "hello"
            , "123"
            , ""
            , "special!@#$%"
            , "unicode 你好"
            ]
        for_ validStrings \s -> do
          parseStrVal s `shouldSatisfy` isValid

    describe "Boolean Values" do
      it "should accept valid boolean values" do
        let
          validBools =
            [ "true"
            , "false"
            , "TRUE"
            , "FALSE"
            , "True"
            , "False"
            ]
        for_ validBools \s -> do
          parseBoolVal s `shouldSatisfy` isValid

      it "should reject invalid boolean values" do
        let
          invalidBools =
            [ "yes"
            , "no"
            , "1"
            , "0"
            , "t"
            , "f"
            , "" -- empty string
            , "T"
            , "F"
            ]
        for_ invalidBools \s -> do
          parseBoolVal s `shouldNotSatisfy` isValid

    describe "JSON List Values" do
      it "should accept valid JSON arrays of strings" do
        let
          validJsonLists =
            [ "[]"
            , "[\"a\", \"b\", \"c\"]"
            , "[\"single\"]"
            , "[\"geo\", \"country\", \"region\"]"
            ]
        for_ validJsonLists \s -> do
          parseJsonListVal s `shouldSatisfy` isValid

      it "should reject invalid JSON" do
        let
          invalidJson =
            [ "{"
            , "}"
            , "[1, 2,"
            , "[a, b, c]" -- unquoted strings
            , "{\"key\": \"value\"}" -- object, not array
            , "undefined"
            ]
        for_ invalidJson \s -> do
          parseJsonListVal s `shouldNotSatisfy` isValid

      it "should accept empty string for JSON list" do
        parseJsonListVal "" `shouldSatisfy` isValid

      pending "should support general JSON value parsing (not just string arrays)"
