module Test.Integration.DatasetErrors where

import Prelude

import Data.Validation.Registry (ErrorCode(..))
import Test.Helpers (expectError)
import Test.Spec (Spec, describe, it, pending)

spec :: Spec Unit
spec =
  describe "Dataset-Level Errors" do
    describe "Concept Errors" do
      it "error-concept-duplicated-across-files: should detect E_DATASET_CONCEPT_DUPLICATED" do
        expectError E_DATASET_CONCEPT_DUPLICATED "test/datasets/error-concept-duplicated-across-files"

      it "error-no-concepts: should detect E_DATASET_NO_CONCEPT" do
        expectError E_DATASET_NO_CONCEPT "test/datasets/error-no-concepts"

      it "error-dataset-concept-not-found: should detect E_DATASET_CONCEPT_NOT_FOUND" do
        expectError E_DATASET_CONCEPT_NOT_FOUND "test/datasets/error-dataset-concept-not-found"

      it "error-dataset-concept-invalid-domain: should detect E_DATASET_CONCEPT_INVALID_DOMAIN" do
        expectError E_DATASET_CONCEPT_INVALID_DOMAIN "test/datasets/error-dataset-concept-invalid-domain"

      pending
        "error-dataset-concept-missing-domain: should detect E_DATASET_CONCEPT_MISSING_DOMAIN (may not be reachable)"

    describe "Entity Errors" do
      it "error-entity-duplicated: should detect E_CSV_ROW_DUPLICATED (CSV dup check precedes dataset check)" do
        expectError E_CSV_ROW_DUPLICATED "test/datasets/error-entity-duplicated"

      it "error-dataset-entityset-undefined: should detect E_DATASET_ENTITYSET_UNDEFINED" do
        expectError E_DATASET_ENTITYSET_UNDEFINED "test/datasets/error-dataset-entityset-undefined"

      it "error-dataset-entitydomain-invalid: should detect E_DATASET_ENTITYDOMAIN_INVAILD" do
        expectError E_DATASET_ENTITYDOMAIN_INVAILD "test/datasets/error-dataset-entitydomain-invalid"

      it "error-dataset-drillup-json-format: should detect E_CONCEPT_DRILLUP_FORMAT for JSON-array drill_up" do
        expectError E_CONCEPT_DRILLUP_FORMAT "test/datasets/error-drillup-json-format"

    describe "List Field Errors" do
      it "error-scales-json-format: should detect E_CONCEPT_SCALES_FORMAT for JSON-array scales" do
        expectError E_CONCEPT_SCALES_FORMAT "test/datasets/error-scales-json-format"

      it "error-scales-invalid-value: should detect E_DATASET_CONCEPT_SCALES_INVALID for unknown scale value" do
        expectError E_DATASET_CONCEPT_SCALES_INVALID "test/datasets/error-scales-invalid-value"

      it "error-tags-comma-format: should detect E_CONCEPT_TAGS_FORMAT for comma-separated tags" do
        expectError E_CONCEPT_TAGS_FORMAT "test/datasets/error-tags-comma-format"

      it "error-tags-unknown-value: should detect E_DATASET_CONCEPT_TAGS_INVALID for tag not in entity domain" do
        expectError E_DATASET_CONCEPT_TAGS_INVALID "test/datasets/error-tags-unknown-value"
