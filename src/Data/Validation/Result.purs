module Data.Validation.Result where

import Prelude

import Data.Array (find)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Data.String (null)
import Data.Validation.Issue (Issue(..))
import Data.Validation.Registry (errorCodeToString, errorSuggestion, formatErrorMessage)

-- | message that contains context information and the issue.
type Message =
  { message :: String
  , file :: String
  , lineNo :: Int
  , errorCode :: String
  , suggestions :: String
  , isWarning :: Boolean
  }

type Messages = Array Message

setFile :: String -> Message -> Message
setFile f m = m { file = f }

setLineNo :: Int -> Message -> Message
setLineNo i m = m { lineNo = i }

setError :: Message -> Message
setError m = m { isWarning = false }

messageFromIssue :: Issue -> Message
messageFromIssue (CodedIssue code ctx) =
  let
    msg = formatErrorMessage code ctx
    fp = case ctx.fileContext of
      Just { filepath } -> filepath
      Nothing -> ""
    ln = case ctx.fileContext of
      Just { lineNo } -> lineNo
      Nothing -> -1
    errCode = errorCodeToString code
    suggestion = case ctx.suggestion of
      Just s -> s
      Nothing -> errorSuggestion code
  in
    { message: msg
    , file: fp
    , lineNo: ln
    , errorCode: errCode
    , suggestions: suggestion
    , isWarning: true
    }
messageFromIssue issue =
  { message: show issue
  , file: ""
  , lineNo: -1
  , errorCode: ""
  , suggestions: ""
  , isWarning: true
  }

hasError :: Array Message -> Boolean
hasError msgs =
  case find (\msg -> not $ msg.isWarning) msgs of
    Nothing -> false
    Just _ -> true

showMessage :: Message -> String
showMessage { message, file, lineNo, errorCode, suggestions, isWarning } =
  let
    statstr = if isWarning then "[WARN] " else "[ERR] "
    filestr = if null file then "" else file <> ":"
    linestr = if lineNo == -1 then "" else (show lineNo) <> ":"
    codestr = if null errorCode then "" else errorCode <> ": "
    messagestr = message
    suggestionstr = if null suggestions then "" else "\n  Suggestion: " <> suggestions
    mainLine =
      if (null filestr) && (null linestr) then
        statstr <> codestr <> messagestr
      else
        statstr <> filestr <> linestr <> " " <> codestr <> messagestr
  in
    -- FIXME: think about how to show suggestion in commandline
    mainLine
