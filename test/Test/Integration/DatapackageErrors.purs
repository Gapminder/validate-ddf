module Test.Integration.DatapackageErrors where

import Prelude

import Data.Validation.Registry (ErrorCode(..))
import Test.Helpers (expectError)
import Test.Spec (Spec, describe, it, pending)

spec :: Spec Unit
spec =
  describe "Datapackage Errors" do
    describe "Datapackage Validation Errors" do
      pending "error-datapackage-not-found: should detect E_DATAPACKAGE_NOT_FOUND (may not be reachable)"

      it "error-datapackage-parse-error: should detect E_DATAPACKAGE_PARSE_ERROR" do
        expectError E_DATAPACKAGE_PARSE_ERROR "test/datasets/error-datapackage-parse-error"

      it "error-datapackage-resource-missing: should detect E_DATAPACKAGE_RESOURCE_MISSING" do
        expectError E_DATAPACKAGE_RESOURCE_MISSING "test/datasets/error-datapackage-resource-missing"

      pending
        "error-datapackage-resource-duplicated: should detect E_DATAPACKAGE_RESOURCE_DUPLICATED (may not be reachable)"

      it "error-datapackage-schema-mismatch: should detect E_DATAPACKAGE_SCHEMA_MISMATCH" do
        expectError E_DATAPACKAGE_SCHEMA_MISMATCH "test/datasets/error-datapackage-schema-mismatch"
