module Test.Integration.CsvErrors where

import Prelude

import Data.Validation.Registry (ErrorCode(..))
import Test.Helpers (expectError)
import Test.Spec (Spec, describe, it, pending)

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
