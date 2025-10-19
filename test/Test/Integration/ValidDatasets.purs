module Test.Integration.ValidDatasets where

import Prelude

import Test.Helpers (expectValid)
import Test.Spec (Spec, describe, it)

spec :: Spec Unit
spec =
  describe "Valid Datasets" do
    it "valid-minimal: should pass validation with minimal DDF dataset" do
      expectValid "test/datasets/valid-minimal"
