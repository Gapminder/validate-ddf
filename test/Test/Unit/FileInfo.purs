module Test.Unit.FileInfo where

import Prelude

import Data.DDF.Csv.FileInfo (parseFileInfo)
import Data.Foldable (for_)
import Data.Validation.Semigroup (isValid)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldNotSatisfy, shouldSatisfy)

spec :: Spec Unit
spec =
  describe "DDF Filename Parsing" do
    describe "Concept Files" do
      it "should accept basic concept file" do
        let
          validFiles =
            [ "ddf--concepts.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should accept concept file with discrete/continuous suffix" do
        let
          validFiles =
            [ "ddf--concepts--discrete.csv"
            , "ddf--concepts--continuous.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should accept concept files in subdirectories" do
        let
          validFiles =
            [ "folder/ddf--concepts.csv"
            , "data/ddf--concepts--discrete.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should reject concept files with invalid suffix" do
        let
          invalidFiles =
            [ "ddf--concepts--main.csv"
            , "ddf--concepts--other.csv"
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

    describe "Entity Files" do
      it "should accept entity files with domain only" do
        let
          validFiles =
            [ "ddf--entities--geo.csv"
            , "ddf--entities--company.csv"
            , "ddf--entities--project.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should accept entity files with domain and set" do
        let
          validFiles =
            [ "ddf--entities--geo--country.csv"
            , "ddf--entities--geo--region.csv"
            , "ddf--entities--company--tech_company.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should reject entity files with missing domain" do
        let
          invalidFiles =
            [ "ddf--entities.csv"
            , "ddf--entities--.csv"
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

      it "should reject entity files with invalid identifiers" do
        let
          invalidFiles =
            [ "ddf--entities--Geo.csv" -- uppercase
            , "ddf--entities--geo-country.csv" -- hyphen instead of --
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

    describe "Datapoint Files" do
      it "should accept datapoint files with single dimension" do
        let
          validFiles =
            [ "ddf--datapoints--population--by--geo.csv"
            , "ddf--datapoints--gdp--by--country.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should accept datapoint files with multiple dimensions" do
        let
          validFiles =
            [ "ddf--datapoints--population--by--geo--time.csv"
            , "ddf--datapoints--income--by--country--year--age.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should accept datapoint files with constraints" do
        let
          validFiles =
            [ "ddf--datapoints--indicator--by--geo-geo--time.csv"
            , "ddf--datapoints--value--by--country-swe--year.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should reject datapoint files with missing indicator" do
        let
          invalidFiles =
            [ "ddf--datapoints--by--geo.csv"
            , "ddf--datapoints----by--geo.csv"
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

      it "should reject datapoint files with wrong format" do
        let
          invalidFiles =
            [ "ddf--datapoints--indicator--geo.csv" -- missing --by--
            , "ddf--datapoints--indicator-by-geo.csv" -- single hyphen instead of --
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

    describe "Synonym Files" do
      it "should accept synonym files" do
        let
          validFiles =
            [ "ddf--synonyms--geo.csv"
            , "ddf--synonyms--country.csv"
            , "ddf--synonyms--company_name.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should reject synonym files with missing concept" do
        let
          invalidFiles =
            [ "ddf--synonyms.csv"
            , "ddf--synonyms--.csv"
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

    describe "Translation Files" do
      it "should accept translation files in lang subdirectories" do
        let
          validFiles =
            [ "lang/en-US/ddf--concepts.csv"
            , "lang/zh-CN/ddf--entities--geo.csv"
            , "lang/es/ddf--datapoints--population--by--geo.csv"
            ]
        for_ validFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should treat files not in lang directory as regular DDF files" do
        -- Files in other directories (not lang/) are parsed as regular DDF files
        -- if they have valid DDF filename format
        let
          regularFiles =
            [ "translations/en/ddf--concepts.csv" -- valid concepts file
            , "data/ddf--entities--geo.csv" -- valid entity file
            ]
        for_ regularFiles \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

    describe "Invalid Files" do
      it "should reject non-CSV files" do
        let
          invalidFiles =
            [ "ddf--concepts.txt"
            , "ddf--concepts"
            , ".gitignore"
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

      it "should reject files without ddf-- prefix" do
        let
          invalidFiles =
            [ "concepts.csv"
            , "datapoints.csv"
            , "entities.csv"
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

      it "should reject files with only ddf prefix" do
        let
          invalidFiles =
            [ "ddf.csv"
            , "ddf--.csv"
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid

      it "should accept any CSV file in lang subdirectories as translation file" do
        -- Translation files are identified by being in lang/ directory,
        -- not by their filename format
        let
          validTranslations =
            [ "lang/en/test.csv"
            , "lang/zh-CN/custom.csv"
            , "lang/es/data.csv"
            ]
        for_ validTranslations \f -> do
          parseFileInfo "./" f `shouldSatisfy` isValid

      it "should reject CSV files directly in lang directory (need language subdirectory)" do
        let
          invalidFiles =
            [ "lang/test.csv" -- missing language subdirectory
            ]
        for_ invalidFiles \f -> do
          parseFileInfo "./" f `shouldNotSatisfy` isValid
