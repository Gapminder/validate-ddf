module Test.Helpers where

import Prelude

import App.Validation.FileNameBased as VFN
import Data.Array as Arr
import Data.Either (isLeft, isRight)
import Data.Tuple (Tuple(..))
import Data.Validation.Registry (ErrorCode, errorCodeToString)
import Data.Validation.ValidationT (runValidationT)
import Effect.Aff (Aff)
import Test.Spec.Assertions (shouldContain, shouldSatisfy)

-- | Helper function to expect a valid dataset
expectValid :: String -> Aff Unit
expectValid path = do
  Tuple msgs _ <- runValidationT $ VFN.validate path false false
  let
    hasErrors = Arr.any (\m -> not m.isWarning) msgs
  hasErrors `shouldSatisfy` (_ == false)

-- | Helper function to expect a specific error code in dataset validation
expectError :: ErrorCode -> String -> Aff Unit
expectError expectedCode path = do
  Tuple msgs _ <- runValidationT $ VFN.validate path false false
  let
    errorCodes = map _.errorCode msgs
    expectedCodeStr = errorCodeToString expectedCode
  errorCodes `shouldContain` expectedCodeStr
