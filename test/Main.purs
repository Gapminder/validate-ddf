module Test.Main where

import Debug
import Prelude

import App.Cli (ValidationMode(..))
import App.Validation.FileNameBased as VFN
import Data.Array as Arr
import Data.Csv (readCsvPlain)
import Data.Csv as Csv
import Data.DDF.Atoms.Header as Hd
import Data.DDF.Atoms.Identifier (isLongerThan64Chars, parseId)
import Data.DDF.Atoms.Identifier as Id
import Data.DDF.Atoms.Value (parseNumVal, parseStrVal, parseTimeVal)
import Data.DDF.Concept (ConceptInput, parseConcept)
import Data.DDF.Concept as Conc
import Data.DDF.Csv.CsvFile (parseCsvFile)
import Data.DDF.Csv.FileInfo (parseFileInfo)
import Data.DDF.Entity (parseEntity)
import Data.DDF.Internal (iteminfo)
import Data.Either (isLeft, isRight)
import Data.Foldable (for_)
import Data.List.Lazy (repeat, take)
import Data.List.NonEmpty (NonEmptyList(..))
import Data.List.NonEmpty as NEL
import Data.Map as Map
import Data.Maybe (Maybe(..), fromJust, isJust, isNothing)
import Data.String.CodeUnits (fromCharArray)
import Data.String.NonEmpty (fromString, unsafeFromString)
import Data.Traversable (sequence)
import Data.Tuple (Tuple(..))
import Data.Validation.Issue (Issue(..), Issues)
import Data.Validation.Semigroup (andThen, isValid)
import Data.Validation.ValidationT (runValidationT, runValidationTEither)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Main as M
import Node.Path (resolve)
import Partial.Unsafe (unsafePartial)
import Test.Integration.CsvErrors as CsvErrorsTests
import Test.Integration.DatapackageErrors as DatapackageErrorsTests
import Test.Integration.DatapointErrors as DatapointErrorsTests
import Test.Integration.DatasetErrors as DatasetErrorsTests
import Test.Integration.ValidDatasets as ValidDatasetsTests
import Test.Spec (Spec, describe, describeOnly, it, itOnly, pending)
import Test.Spec.Assertions (fail, shouldContain, shouldEqual, shouldNotContain, shouldNotSatisfy, shouldSatisfy)
import Test.Spec.Reporter.Console (consoleReporter)
import Test.Spec.Runner (runSpecPure)
import Test.Unit.Concept as ConceptTests
import Test.Unit.Csv as CsvTests
import Test.Unit.Entity as EntityTests
import Test.Unit.FileInfo as FileInfoTests
import Test.Unit.Header as HeaderTests
import Test.Unit.Identifier as IdentifierTests
import Test.Unit.Value as ValueTests
import Utils (getFiles)

testMain :: Effect Unit
testMain = do
  path <- resolve [] "test/datasets/ddf--test--new"
  M.runMain { targetPath: path, noWarning: false, mode: FileNameBased, generateDP: true, fixFormat: false }

main :: Effect Unit
main = launchAff_ $ runSpecPure [ consoleReporter ] do
  describe "ddf-validation" do
    describe "Unit Tests" do
      ValueTests.spec
      IdentifierTests.spec
      HeaderTests.spec
      FileInfoTests.spec
      ConceptTests.spec
      EntityTests.spec
      CsvTests.spec
    describe "Integration Tests" do
      ValidDatasetsTests.spec
      DatasetErrorsTests.spec
      CsvErrorsTests.spec
      DatapackageErrorsTests.spec
      DatapointErrorsTests.spec
    -- FIXME: move below tests
    describe "low level" do
      it "identifier - v" do
        let
          validIds =
            [ "abc"
            , "a_bc_123"
            , "a"
            ]
        for_ validIds \s -> do
          let output = parseId s
          output `shouldSatisfy` isValid
        let
          inValidIds =
            [ ""
            , "c?d"
            , "a-b-c"
            ]
        for_ inValidIds \s -> do
          let output = parseId s
          output `shouldNotSatisfy` isValid
      it "identifier - should not longer than 64 chars" do
        let
          input = fromCharArray $ Arr.fromFoldable $ take 65 $ repeat 'a'
          output = parseId input `andThen` isLongerThan64Chars
        output `shouldNotSatisfy` isValid
      it "filenames - ddf file" do
        let
          validFiles =
            [ "ddf--concepts.csv"
            , "ddf--concepts--discrete.csv"
            , "ddf--entities--geo.csv"
            , "ddf--entities--geo--country.csv"
            , "ddf--datapoints--indicator--by--geo.csv"
            , "ddf--datapoints--indicator--by--geo-geo--time.csv"
            , "folder/ddf--concepts.csv"
            , "ddf--synonyms--geo.csv"
            , "lang/en-US/ddf--concepts.csv"
            ]
        for_ validFiles \f -> do
          let
            root = "./"
            output = parseFileInfo root f
          output `shouldSatisfy` isValid
        let
          invalidFiles =
            [ "ddf.csv"
            , "datapoints.csv"
            , ".gitignore"
            , "ddf--concepts--main.csv"
            , "ddf--datapoints--indicator--geo.csv"
            , "lang/test.csv"
            ]
        for_ invalidFiles \f -> do
          let
            root = "./"
            output = parseFileInfo root f
          output `shouldNotSatisfy` isValid
      it "filenames vs headers" do
        let
          fileName = "ddf--concepts.csv"
          csvContent =
            { headers: [ "concept", "concept_type", "name" ]
            , columns: [ [ "geo", "entity_domain", "Geo" ] ]
            , index: [ 2 ]
            }
          output = ado
            fileInfo <- parseFileInfo "./" fileName
            in parseCsvFile { fileInfo: fileInfo, csvContent: csvContent }
        output `shouldSatisfy` isValid
      it "concept validation - one concept" do
        let
          input =
            { conceptId: "testing"
            , props: Map.fromFoldable
                [ ( Tuple
                      (Hd.unsafeCreate "name")
                      "testing_name"
                  )
                , ( Tuple
                      (Hd.unsafeCreate "concept_type")
                      "measure"
                  )
                ]
            , _info: Just $ iteminfo "a.csv" 1
            }
          output = parseConcept input
        output `shouldSatisfy` isValid
      it "concept validation - time concept" do
        let
          input =
            { conceptId: "anno"
            , props: Map.fromFoldable
                [ ( Tuple
                      (Hd.unsafeCreate "Year")
                      "testing_name"
                  )
                , ( Tuple
                      (Hd.unsafeCreate "concept_type")
                      "time"
                  )
                ]
            , _info: Nothing
            }
          output = parseConcept input
        output `shouldNotSatisfy` isValid
      it "entity validation - one entity" do
        let
          input =
            { entityId: "swe"
            , entityDomain: unsafePartial $ unsafeFromString "geo"
            , entitySet: Nothing
            , props: Map.empty
            , _info: Just $ iteminfo "a.csv" 1
            }
          output = parseEntity input
        output `shouldSatisfy` isValid
      -- IO things
      it "read csv file" do
        let filename = "test/datasets/ddf--test--new/ddf--concepts.csv"
        output <- sequence $ readCsvPlain <$> [ filename ]
        (output Arr.!! 0)
          `shouldSatisfy` isJust
      it "list all csv files in a folder" do
        let dirname = "test/datasets/ddf--test--new/"
        files <- getFiles dirname [ "etl" ]
        files `shouldContain` (dirname <> "ddf--concepts.csv")
    -- many of below rules are from old ddf-validation code,
    -- TODO: needs cleanup
    describe "DDF Rules Checking" do
      -- good datasets
      it "good datasets" do
        let
          goodDatasets =
            [ "test/fixtures/good-folder-dp"
            , "test/fixtures/rules-cases/non-unique-entity-value-2"
            , "test/fixtures/rules-cases/non-unique-entity-value-3"
            , "test/fixtures/good-folder-unpop-wpp_population"
            , "test/fixtures/rules-cases/unexisting-constraint-value-2"
            , "test/fixtures/rules-cases/entity-value-as-entity-name"
            ]
        for_ goodDatasets \p -> do
          res <- runValidationTEither $ VFN.validate p false false
          res `shouldSatisfy` isRight

      -- below are bad datasets
      -- TODO check if correct error was raised
      -- general
      it "synonym key duplication" do
        let dirname = "test/fixtures/rules-cases/duplicated-synonym-key"
        res <- runValidationTEither $ VFN.validate dirname false false
        res `shouldSatisfy` isLeft
      it "inconsistent synonym key" do
        let dirname = "test/fixtures/rules-cases/inconsistent-synonym-key"
        res <- runValidationTEither $ VFN.validate dirname false false
        res `shouldSatisfy` isLeft
      it "identifier" do
        let dirname = "test/fixtures/rules-cases/incorrect-identifier"
        res <- runValidationTEither $ VFN.validate dirname false false
        res `shouldSatisfy` isLeft
      pending "json field"
      pending "unexpected data"
      -- entity
      it "empty entity id" do
        let
          dirnames =
            [ "test/fixtures/rules-cases/empty-entity-id"
            ]
        for_ dirnames \dirname -> do
          res <- runValidationTEither $ VFN.validate dirname false false
          res `shouldSatisfy` isLeft
      pending "incorrect boolean entity"
      --  FIXME: "test/fixtures/rules-cases/incorrect-boolean-entity" boolean value raised warnings, not errors
      -- maybe warnings are good enough?
      it "non unique entity value" do
        let
          dirnames =
            [ "test/fixtures/rules-cases/non-unique-entity-value"
            ]
        for_ dirnames \dirname -> do
          res <- runValidationTEither $ VFN.validate dirname false false
          res `shouldSatisfy` isLeft
      it "wrong entity is-- header" do
        let
          dirnames =
            [ "test/fixtures/rules-cases/wrong-entity-is-header"
            , "test/fixtures/rules-cases/wrong-entity-is-header-2"
            ]
        for_ dirnames \dirname -> do
          res <- runValidationTEither $ VFN.validate dirname false false
          res `shouldSatisfy` isLeft
      it "wrong entity is-- header value" do
        let
          dirnames =
            [ "test/fixtures/rules-cases/empty-entity-id"
            ]
        for_ dirnames \dirname -> do
          res <- runValidationTEither $ VFN.validate dirname false false
          res `shouldSatisfy` isLeft
      pending "unexisting constraint value"
      -- datapoint
      pending "constraints violation"
      pending "duplicated datapoints"
      pending "measure value not numeric"
      pending "unexpected entity value"
      pending "unexpected time value"
      -- concept
      pending "concept id not unique"
      pending "concept mandatory field missing"
      pending "concept not found"
      pending "empty concept id"
      pending "invalid drill up"
      pending "non concept header"
      -- translation
      pending "duplicated translation datapoint key"
      pending "duplicated translation key"
      pending "unexpected translation datapoint data"
      pending "unexpected translation header"
      pending "unexpected translation data"
    describe "Datapackage Rules Checking" do
      pending "not a datapackage"
      pending "wrong datapoint header"
      pending "datapoint without indicator"
      it "resource inconsistent with local file data" do
        let
          dirnames =
            [ "test/fixtures/rules-cases/datapackage-confused-fields"
            ]
        for_ dirnames \dirname -> do
          res <- runValidationTEither $ VFN.validate dirname false false
          res `shouldSatisfy` isLeft
      pending "incorrect field"
      pending "incorrect file"
      pending "incorrect primary key"
      pending "non concept field"
      pending "non unique resource file"
      pending "non unique resource name"
      pending "same key-value concept"
    describe "CLI Features" do
      it "check folder" do
        liftEffect $ testMain
