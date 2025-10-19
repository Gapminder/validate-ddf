module Test.Integration.DatapointErrors where

import Prelude

import Data.Validation.Registry (ErrorCode(..))
import Test.Helpers (expectValid)
import Test.Spec (Spec, describe, it)

{-
  Note: There are no specific datapoint error codes in the Registry.
  Datapoint validation errors are covered by:
  - CSV errors (E_CSV_*) - for file structure issues
  - Dataset errors (E_DATASET_*) - for missing concepts/entities
  - Value errors (W_VAL_*, E_VAL_*) - for invalid values (tested at unit level)

  This module verifies that valid datapoint files pass validation.
  Error cases are tested in CsvErrors.purs and DatasetErrors.purs.
-}

spec :: Spec Unit
spec =
  describe "Datapoint File Validation" do
    it "valid-minimal: should accept valid datapoint file" do
      expectValid "test/datasets/valid-minimal"
