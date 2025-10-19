module Test.Unit.Csv where

import Prelude

import Data.Array as Arr
import Data.Csv (readCsv)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (writeTextFile)
import Node.Path (resolve)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec =
  describe "CSV Reading" do
    describe "Row Index Tracking" do
      it "should start row index at 2 (first data row after header)" do
        -- Create a temporary test CSV file
        let
          csvContent = "header1,header2,header3\nvalue1,value2,value3\nvalue4,value5,value6\nvalue7,value8,value9"
          testFilePath = "/tmp/test-csv-row-index.csv"

        -- Write test file
        writeTextFile UTF8 testFilePath csvContent

        -- Read the CSV
        result <- readCsv testFilePath

        -- Verify headers are correct
        result.headers `shouldEqual` [ "header1", "header2", "header3" ]

        -- Verify row indices correspond to actual CSV file line numbers:
        -- Line 1: header row (not in index array)
        -- Line 2: first data row (should be index[0] = 2)
        -- Line 3: second data row (should be index[1] = 3)
        -- Line 4: third data row (should be index[2] = 4)
        -- This is important for error messages to show the correct line number
        result.index `shouldEqual` [ 2, 3, 4 ]

        -- Verify the number of data rows
        (Arr.length result.index) `shouldEqual` 3

        -- Verify column data
        (Arr.length result.columns) `shouldEqual` 3
        result.columns `shouldEqual`
          [ [ "value1", "value4", "value7" ]
          , [ "value2", "value5", "value8" ]
          , [ "value3", "value6", "value9" ]
          ]

      it "should handle empty CSV (header only)" do
        let
          csvContent = "header1,header2,header3"
          testFilePath = "/tmp/test-csv-empty.csv"

        writeTextFile UTF8 testFilePath csvContent
        result <- readCsv testFilePath

        -- Should have headers
        result.headers `shouldEqual` [ "header1", "header2", "header3" ]

        -- Should have empty index (no data rows)
        result.index `shouldEqual` []

        -- Should have empty columns
        result.columns `shouldEqual` [ [], [], [] ]

      it "should handle CSV with bad rows (mismatched column count)" do
        let
          -- Line 1: h1,h2,h3 (header)
          -- Line 2: v1,v2,v3 (valid data row)
          -- Line 3: bad1,bad2 (invalid - only 2 columns)
          -- Line 4: v4,v5,v6 (valid data row)
          csvContent = "h1,h2,h3\nv1,v2,v3\nbad1,bad2\nv4,v5,v6"
          testFilePath = "/tmp/test-csv-badrows.csv"

        writeTextFile UTF8 testFilePath csvContent
        result <- readCsv testFilePath

        -- Should have headers
        result.headers `shouldEqual` [ "h1", "h2", "h3" ]

        -- Bad row (line 3) should not be in the index array
        -- Only valid rows at lines 2 and 4 should be in the index
        result.index `shouldEqual` [ 2, 4 ]

        -- Bad row at line 3 should be tracked in badrows
        result.badrows `shouldEqual` [ 3 ]

        -- Should only have valid rows in columns
        result.columns `shouldEqual`
          [ [ "v1", "v4" ]
          , [ "v2", "v5" ]
          , [ "v3", "v6" ]
          ]
