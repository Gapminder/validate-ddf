module Test.Integration.CsvErrors where

import Prelude

import Data.Array as Arr
import Data.Csv (readCsv)
import Data.Csv.FileCheck (FormatIssue(..), checkFileFormat, fixFileFormat)
import Data.Foldable (for_)
import Data.Validation.Registry (ErrorCode(..))
import Effect.Class (liftEffect)
import Test.Helpers (expectError)
import Test.Helpers.Regenerate (regenerateBadCsvFiles)
import Test.Spec (Spec, before_, describe, it, pending)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual, shouldSatisfy)

spec :: Spec Unit
spec =
  describe "CSV File Errors" do
    describe "CSV Structure Errors" do
      it "error-csv-empty: should detect E_CSV_EMPTY" do
        expectError E_CSV_EMPTY "test/datasets/error-csv-empty"

      it "error-csv-header-duplicated: should detect E_CSV_HEADER_DUPLICATED" do
        expectError E_CSV_HEADER_DUPLICATED "test/datasets/error-csv-header-duplicated"

      it "error-csv-header-missing: should detect E_CSV_HEADER_MISSING" do
        expectError E_CSV_HEADER_MISSING "test/datasets/error-csv-header-missing"

      it "error-csv-header-unexpected: should detect E_CSV_HEADER_UNEXPECTED" do
        expectError E_CSV_HEADER_UNEXPECTED "test/datasets/error-csv-header-unexpected"

      it "error-csv-header-invalid: should detect E_CSV_HEADER_INVALID" do
        expectError E_CSV_HEADER_INVALID "test/datasets/error-csv-header-invalid"

      it "error-csv-row-duplicated: should detect E_CSV_ROW_DUPLICATED" do
        expectError E_CSV_ROW_DUPLICATED "test/datasets/error-csv-row-duplicated"

      pending "error-csv-header-column-mismatch: should detect E_CSV_HEADER_COLUMN_MISMATCH (may not be reachable)"
      pending "error-csv-header-conflict: should detect E_CSV_HEADER_CONFLICT (not implemented)"
      pending "error-csv-header-constraint: should detect E_CSV_HEADER_CONSTRAINT (not implemented)"

    describe "CSV Byte-level Format Errors" do
      before_ regenerateBadCsvFiles do
        describe "Phase 1: issues detected in fresh files" do
          it "geo.csv — BOM detected" do
            issues <- liftEffect $ checkFileFormat "test/datasets/ddf--test--bad-csv/ddf--entities--geo.csv"
            issues `shouldSatisfy` Arr.elem BOM

          it "region.csv — CRLF detected" do
            issues <- liftEffect $ checkFileFormat "test/datasets/ddf--test--bad-csv/ddf--entities--geo--region.csv"
            issues `shouldSatisfy` Arr.elem CRLF

          it "country.csv — invalid encoding detected" do
            issues <- liftEffect $ checkFileFormat "test/datasets/ddf--test--bad-csv/ddf--entities--geo--country.csv"
            issues `shouldSatisfy` Arr.elem ENCODING

          it "concepts.csv — clean baseline, no format issues" do
            issues <- liftEffect $ checkFileFormat "test/datasets/ddf--test--bad-csv/ddf--concepts.csv"
            issues `shouldEqual` []

          it "place.csv — badrows detected (inconsistent column count)" do
            csv <- readCsv "test/datasets/ddf--test--bad-csv/ddf--entities--geo--place.csv"
            csv.badrows `shouldNotEqual` []

        describe "Phase 2: after fix" do
          before_
            ( liftEffect $ for_
                [ "test/datasets/ddf--test--bad-csv/ddf--entities--geo.csv"
                , "test/datasets/ddf--test--bad-csv/ddf--entities--geo--region.csv"
                , "test/datasets/ddf--test--bad-csv/ddf--entities--geo--country.csv"
                ]
                fixFileFormat
            )
            do
              it "geo.csv — no format issues after fix" do
                issues <- liftEffect $ checkFileFormat "test/datasets/ddf--test--bad-csv/ddf--entities--geo.csv"
                issues `shouldEqual` []

              it "region.csv — no format issues after fix" do
                issues <- liftEffect $ checkFileFormat "test/datasets/ddf--test--bad-csv/ddf--entities--geo--region.csv"
                issues `shouldEqual` []

              it "country.csv — no format issues after fix" do
                issues <- liftEffect $ checkFileFormat "test/datasets/ddf--test--bad-csv/ddf--entities--geo--country.csv"
                issues `shouldEqual` []

              it "place.csv — badrows persist after fix (format fix cannot repair CSV structure)" do
                csv <- readCsv "test/datasets/ddf--test--bad-csv/ddf--entities--geo--place.csv"
                csv.badrows `shouldNotEqual` []
