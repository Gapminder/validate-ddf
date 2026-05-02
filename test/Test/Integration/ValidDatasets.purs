module Test.Integration.ValidDatasets where

import Prelude

import Test.Helpers (expectValid)
import Test.Spec (Spec, describe, it)

spec :: Spec Unit
spec =
  describe "Valid Datasets" do
    it "valid-minimal: should pass validation with minimal DDF dataset" do
      expectValid "test/datasets/valid-minimal"
    it "valid-empty-datapoint-file: should pass validation with empty datapoint file" do
      expectValid "test/datasets/valid-empty-datapoint-file"
    it "valid-with-drill-up-scales-tags: should pass validation with drill_up, scales, and tags" do
      expectValid "test/datasets/valid-with-drill-up-scales-tags"
