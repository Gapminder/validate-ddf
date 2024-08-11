// output-es/runtime.js
function binding(init) {
  let state = 0;
  let value2;
  return () => {
    if (state === 2) {
      return value2;
    }
    if (state === 1) {
      throw new Error("Binding demanded before initialized");
    }
    state = 1;
    value2 = init();
    state = 2;
    return value2;
  };
}
function fail() {
  throw new Error("Failed pattern match");
}
function intDiv(x, y) {
  if (y > 0)
    return Math.floor(x / y);
  if (y < 0)
    return -Math.floor(x / -y);
  return 0;
}

// output-es/Record.Unsafe/foreign.js
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};

// output-es/Type.Proxy/index.js
var $$$Proxy = () => ({ tag: "Proxy" });
var $$Proxy = /* @__PURE__ */ $$$Proxy();

// output-es/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};
var showCharImpl = function(c) {
  var code = c.charCodeAt(0);
  if (code < 32 || code === 127) {
    switch (c) {
      case "\x07":
        return "'\\a'";
      case "\b":
        return "'\\b'";
      case "\f":
        return "'\\f'";
      case "\n":
        return "'\\n'";
      case "\r":
        return "'\\r'";
      case "	":
        return "'\\t'";
      case "\v":
        return "'\\v'";
    }
    return "'\\" + code.toString(10) + "'";
  }
  return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
};
var showStringImpl = function(s) {
  var l = s.length;
  return '"' + s.replace(
    /[\0-\x1F\x7F"\\]/g,
    function(c, i) {
      switch (c) {
        case '"':
        case "\\":
          return "\\" + c;
        case "\x07":
          return "\\a";
        case "\b":
          return "\\b";
        case "\f":
          return "\\f";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "	":
          return "\\t";
        case "\v":
          return "\\v";
      }
      var k = i + 1;
      var empty3 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
      return "\\" + c.charCodeAt(0).toString(10) + empty3;
    }
  ) + '"';
};
var showArrayImpl = function(f) {
  return function(xs) {
    var ss = [];
    for (var i = 0, l = xs.length; i < l; i++) {
      ss[i] = f(xs[i]);
    }
    return "[" + ss.join(",") + "]";
  };
};

// output-es/Data.Show/index.js
var showString = { show: showStringImpl };

// output-es/Data.Generic.Rep/index.js
var $NoArguments = () => ({ tag: "NoArguments" });
var $Sum = (tag, _1) => ({ tag, _1 });
var NoArguments = /* @__PURE__ */ $NoArguments();

// output-es/Data.Ordering/index.js
var $Ordering = (tag) => tag;
var LT = /* @__PURE__ */ $Ordering("LT");
var GT = /* @__PURE__ */ $Ordering("GT");
var EQ = /* @__PURE__ */ $Ordering("EQ");

// output-es/Data.Maybe/index.js
var $Maybe = (tag, _1) => ({ tag, _1 });
var Nothing = /* @__PURE__ */ $Maybe("Nothing");
var Just = (value0) => $Maybe("Just", value0);
var monoidMaybe = (dictSemigroup) => {
  const semigroupMaybe1 = {
    append: (v) => (v1) => {
      if (v.tag === "Nothing") {
        return v1;
      }
      if (v1.tag === "Nothing") {
        return v;
      }
      if (v.tag === "Just" && v1.tag === "Just") {
        return $Maybe("Just", dictSemigroup.append(v._1)(v1._1));
      }
      fail();
    }
  };
  return { mempty: Nothing, Semigroup0: () => semigroupMaybe1 };
};
var isNothing = (v2) => {
  if (v2.tag === "Nothing") {
    return true;
  }
  if (v2.tag === "Just") {
    return false;
  }
  fail();
};
var functorMaybe = {
  map: (v) => (v1) => {
    if (v1.tag === "Just") {
      return $Maybe("Just", v(v1._1));
    }
    return Nothing;
  }
};
var ordMaybe = (dictOrd) => {
  const $0 = dictOrd.Eq0();
  const eqMaybe1 = {
    eq: (x) => (y) => {
      if (x.tag === "Nothing") {
        return y.tag === "Nothing";
      }
      return x.tag === "Just" && y.tag === "Just" && $0.eq(x._1)(y._1);
    }
  };
  return {
    compare: (x) => (y) => {
      if (x.tag === "Nothing") {
        if (y.tag === "Nothing") {
          return EQ;
        }
        return LT;
      }
      if (y.tag === "Nothing") {
        return GT;
      }
      if (x.tag === "Just" && y.tag === "Just") {
        return dictOrd.compare(x._1)(y._1);
      }
      fail();
    },
    Eq0: () => eqMaybe1
  };
};
var applyMaybe = {
  apply: (v) => (v1) => {
    if (v.tag === "Just") {
      if (v1.tag === "Just") {
        return $Maybe("Just", v._1(v1._1));
      }
      return Nothing;
    }
    if (v.tag === "Nothing") {
      return Nothing;
    }
    fail();
  },
  Functor0: () => functorMaybe
};

// output-es/ExitCodes/index.js
var $ExitCode = (tag) => tag;
var Success = /* @__PURE__ */ $ExitCode("Success");
var $$Error = /* @__PURE__ */ $ExitCode("Error");
var MisuseOfShellBuiltins = /* @__PURE__ */ $ExitCode("MisuseOfShellBuiltins");
var CLIUsageError = /* @__PURE__ */ $ExitCode("CLIUsageError");
var DataFormatError = /* @__PURE__ */ $ExitCode("DataFormatError");
var CannotOpenInput = /* @__PURE__ */ $ExitCode("CannotOpenInput");
var AddresseeUnknown = /* @__PURE__ */ $ExitCode("AddresseeUnknown");
var HostNameUnknown = /* @__PURE__ */ $ExitCode("HostNameUnknown");
var ServiceUnavailable = /* @__PURE__ */ $ExitCode("ServiceUnavailable");
var InternalSoftwareError = /* @__PURE__ */ $ExitCode("InternalSoftwareError");
var SystemError = /* @__PURE__ */ $ExitCode("SystemError");
var CriticalOSFileMissing = /* @__PURE__ */ $ExitCode("CriticalOSFileMissing");
var CannotCreateOutputFile = /* @__PURE__ */ $ExitCode("CannotCreateOutputFile");
var IOError = /* @__PURE__ */ $ExitCode("IOError");
var TemporaryFailure = /* @__PURE__ */ $ExitCode("TemporaryFailure");
var RemoteError = /* @__PURE__ */ $ExitCode("RemoteError");
var PermissionDenied = /* @__PURE__ */ $ExitCode("PermissionDenied");
var ConfigurationError = /* @__PURE__ */ $ExitCode("ConfigurationError");
var CannotExecute = /* @__PURE__ */ $ExitCode("CannotExecute");
var CommandNotFound = /* @__PURE__ */ $ExitCode("CommandNotFound");
var InvalidExitArgument = /* @__PURE__ */ $ExitCode("InvalidExitArgument");
var SIGHUP = /* @__PURE__ */ $ExitCode("SIGHUP");
var SIGINT = /* @__PURE__ */ $ExitCode("SIGINT");
var SIGQUIT = /* @__PURE__ */ $ExitCode("SIGQUIT");
var SIGILL = /* @__PURE__ */ $ExitCode("SIGILL");
var SIGABRT = /* @__PURE__ */ $ExitCode("SIGABRT");
var SIGFPE = /* @__PURE__ */ $ExitCode("SIGFPE");
var SIGKILL = /* @__PURE__ */ $ExitCode("SIGKILL");
var SIGSEGV = /* @__PURE__ */ $ExitCode("SIGSEGV");
var SIGPIPE = /* @__PURE__ */ $ExitCode("SIGPIPE");
var SIGALRM = /* @__PURE__ */ $ExitCode("SIGALRM");
var SIGTERM = /* @__PURE__ */ $ExitCode("SIGTERM");
var eqExitCode = {
  eq: (x) => (y) => {
    if (x === "Success") {
      return y === "Success";
    }
    if (x === "Error") {
      return y === "Error";
    }
    if (x === "MisuseOfShellBuiltins") {
      return y === "MisuseOfShellBuiltins";
    }
    if (x === "CLIUsageError") {
      return y === "CLIUsageError";
    }
    if (x === "DataFormatError") {
      return y === "DataFormatError";
    }
    if (x === "CannotOpenInput") {
      return y === "CannotOpenInput";
    }
    if (x === "AddresseeUnknown") {
      return y === "AddresseeUnknown";
    }
    if (x === "HostNameUnknown") {
      return y === "HostNameUnknown";
    }
    if (x === "ServiceUnavailable") {
      return y === "ServiceUnavailable";
    }
    if (x === "InternalSoftwareError") {
      return y === "InternalSoftwareError";
    }
    if (x === "SystemError") {
      return y === "SystemError";
    }
    if (x === "CriticalOSFileMissing") {
      return y === "CriticalOSFileMissing";
    }
    if (x === "CannotCreateOutputFile") {
      return y === "CannotCreateOutputFile";
    }
    if (x === "IOError") {
      return y === "IOError";
    }
    if (x === "TemporaryFailure") {
      return y === "TemporaryFailure";
    }
    if (x === "RemoteError") {
      return y === "RemoteError";
    }
    if (x === "PermissionDenied") {
      return y === "PermissionDenied";
    }
    if (x === "ConfigurationError") {
      return y === "ConfigurationError";
    }
    if (x === "CannotExecute") {
      return y === "CannotExecute";
    }
    if (x === "CommandNotFound") {
      return y === "CommandNotFound";
    }
    if (x === "InvalidExitArgument") {
      return y === "InvalidExitArgument";
    }
    if (x === "SIGHUP") {
      return y === "SIGHUP";
    }
    if (x === "SIGINT") {
      return y === "SIGINT";
    }
    if (x === "SIGQUIT") {
      return y === "SIGQUIT";
    }
    if (x === "SIGILL") {
      return y === "SIGILL";
    }
    if (x === "SIGABRT") {
      return y === "SIGABRT";
    }
    if (x === "SIGFPE") {
      return y === "SIGFPE";
    }
    if (x === "SIGKILL") {
      return y === "SIGKILL";
    }
    if (x === "SIGSEGV") {
      return y === "SIGSEGV";
    }
    if (x === "SIGPIPE") {
      return y === "SIGPIPE";
    }
    if (x === "SIGALRM") {
      return y === "SIGALRM";
    }
    return x === "SIGTERM" && y === "SIGTERM";
  }
};
var ordExitCode = {
  compare: (x) => (y) => {
    if (x === "Success") {
      if (y === "Success") {
        return EQ;
      }
      return LT;
    }
    if (y === "Success") {
      return GT;
    }
    if (x === "Error") {
      if (y === "Error") {
        return EQ;
      }
      return LT;
    }
    if (y === "Error") {
      return GT;
    }
    if (x === "MisuseOfShellBuiltins") {
      if (y === "MisuseOfShellBuiltins") {
        return EQ;
      }
      return LT;
    }
    if (y === "MisuseOfShellBuiltins") {
      return GT;
    }
    if (x === "CLIUsageError") {
      if (y === "CLIUsageError") {
        return EQ;
      }
      return LT;
    }
    if (y === "CLIUsageError") {
      return GT;
    }
    if (x === "DataFormatError") {
      if (y === "DataFormatError") {
        return EQ;
      }
      return LT;
    }
    if (y === "DataFormatError") {
      return GT;
    }
    if (x === "CannotOpenInput") {
      if (y === "CannotOpenInput") {
        return EQ;
      }
      return LT;
    }
    if (y === "CannotOpenInput") {
      return GT;
    }
    if (x === "AddresseeUnknown") {
      if (y === "AddresseeUnknown") {
        return EQ;
      }
      return LT;
    }
    if (y === "AddresseeUnknown") {
      return GT;
    }
    if (x === "HostNameUnknown") {
      if (y === "HostNameUnknown") {
        return EQ;
      }
      return LT;
    }
    if (y === "HostNameUnknown") {
      return GT;
    }
    if (x === "ServiceUnavailable") {
      if (y === "ServiceUnavailable") {
        return EQ;
      }
      return LT;
    }
    if (y === "ServiceUnavailable") {
      return GT;
    }
    if (x === "InternalSoftwareError") {
      if (y === "InternalSoftwareError") {
        return EQ;
      }
      return LT;
    }
    if (y === "InternalSoftwareError") {
      return GT;
    }
    if (x === "SystemError") {
      if (y === "SystemError") {
        return EQ;
      }
      return LT;
    }
    if (y === "SystemError") {
      return GT;
    }
    if (x === "CriticalOSFileMissing") {
      if (y === "CriticalOSFileMissing") {
        return EQ;
      }
      return LT;
    }
    if (y === "CriticalOSFileMissing") {
      return GT;
    }
    if (x === "CannotCreateOutputFile") {
      if (y === "CannotCreateOutputFile") {
        return EQ;
      }
      return LT;
    }
    if (y === "CannotCreateOutputFile") {
      return GT;
    }
    if (x === "IOError") {
      if (y === "IOError") {
        return EQ;
      }
      return LT;
    }
    if (y === "IOError") {
      return GT;
    }
    if (x === "TemporaryFailure") {
      if (y === "TemporaryFailure") {
        return EQ;
      }
      return LT;
    }
    if (y === "TemporaryFailure") {
      return GT;
    }
    if (x === "RemoteError") {
      if (y === "RemoteError") {
        return EQ;
      }
      return LT;
    }
    if (y === "RemoteError") {
      return GT;
    }
    if (x === "PermissionDenied") {
      if (y === "PermissionDenied") {
        return EQ;
      }
      return LT;
    }
    if (y === "PermissionDenied") {
      return GT;
    }
    if (x === "ConfigurationError") {
      if (y === "ConfigurationError") {
        return EQ;
      }
      return LT;
    }
    if (y === "ConfigurationError") {
      return GT;
    }
    if (x === "CannotExecute") {
      if (y === "CannotExecute") {
        return EQ;
      }
      return LT;
    }
    if (y === "CannotExecute") {
      return GT;
    }
    if (x === "CommandNotFound") {
      if (y === "CommandNotFound") {
        return EQ;
      }
      return LT;
    }
    if (y === "CommandNotFound") {
      return GT;
    }
    if (x === "InvalidExitArgument") {
      if (y === "InvalidExitArgument") {
        return EQ;
      }
      return LT;
    }
    if (y === "InvalidExitArgument") {
      return GT;
    }
    if (x === "SIGHUP") {
      if (y === "SIGHUP") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGHUP") {
      return GT;
    }
    if (x === "SIGINT") {
      if (y === "SIGINT") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGINT") {
      return GT;
    }
    if (x === "SIGQUIT") {
      if (y === "SIGQUIT") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGQUIT") {
      return GT;
    }
    if (x === "SIGILL") {
      if (y === "SIGILL") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGILL") {
      return GT;
    }
    if (x === "SIGABRT") {
      if (y === "SIGABRT") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGABRT") {
      return GT;
    }
    if (x === "SIGFPE") {
      if (y === "SIGFPE") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGFPE") {
      return GT;
    }
    if (x === "SIGKILL") {
      if (y === "SIGKILL") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGKILL") {
      return GT;
    }
    if (x === "SIGSEGV") {
      if (y === "SIGSEGV") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGSEGV") {
      return GT;
    }
    if (x === "SIGPIPE") {
      if (y === "SIGPIPE") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGPIPE") {
      return GT;
    }
    if (x === "SIGALRM") {
      if (y === "SIGALRM") {
        return EQ;
      }
      return LT;
    }
    if (y === "SIGALRM") {
      return GT;
    }
    if (x === "SIGTERM" && y === "SIGTERM") {
      return EQ;
    }
    fail();
  },
  Eq0: () => eqExitCode
};
var enumExitCode = {
  succ: (v) => {
    if (v === "Success") {
      return $Maybe("Just", $$Error);
    }
    if (v === "Error") {
      return $Maybe("Just", MisuseOfShellBuiltins);
    }
    if (v === "MisuseOfShellBuiltins") {
      return $Maybe("Just", CLIUsageError);
    }
    if (v === "CLIUsageError") {
      return $Maybe("Just", DataFormatError);
    }
    if (v === "DataFormatError") {
      return $Maybe("Just", CannotOpenInput);
    }
    if (v === "CannotOpenInput") {
      return $Maybe("Just", AddresseeUnknown);
    }
    if (v === "AddresseeUnknown") {
      return $Maybe("Just", HostNameUnknown);
    }
    if (v === "HostNameUnknown") {
      return $Maybe("Just", ServiceUnavailable);
    }
    if (v === "ServiceUnavailable") {
      return $Maybe("Just", InternalSoftwareError);
    }
    if (v === "InternalSoftwareError") {
      return $Maybe("Just", SystemError);
    }
    if (v === "SystemError") {
      return $Maybe("Just", CriticalOSFileMissing);
    }
    if (v === "CriticalOSFileMissing") {
      return $Maybe("Just", CannotCreateOutputFile);
    }
    if (v === "CannotCreateOutputFile") {
      return $Maybe("Just", IOError);
    }
    if (v === "IOError") {
      return $Maybe("Just", TemporaryFailure);
    }
    if (v === "TemporaryFailure") {
      return $Maybe("Just", RemoteError);
    }
    if (v === "RemoteError") {
      return $Maybe("Just", PermissionDenied);
    }
    if (v === "PermissionDenied") {
      return $Maybe("Just", ConfigurationError);
    }
    if (v === "ConfigurationError") {
      return $Maybe("Just", CannotExecute);
    }
    if (v === "CannotExecute") {
      return $Maybe("Just", CommandNotFound);
    }
    if (v === "CommandNotFound") {
      return $Maybe("Just", InvalidExitArgument);
    }
    if (v === "InvalidExitArgument") {
      return $Maybe("Just", SIGHUP);
    }
    if (v === "SIGHUP") {
      return $Maybe("Just", SIGINT);
    }
    if (v === "SIGINT") {
      return $Maybe("Just", SIGQUIT);
    }
    if (v === "SIGQUIT") {
      return $Maybe("Just", SIGILL);
    }
    if (v === "SIGILL") {
      return $Maybe("Just", SIGABRT);
    }
    if (v === "SIGABRT") {
      return $Maybe("Just", SIGFPE);
    }
    if (v === "SIGFPE") {
      return $Maybe("Just", SIGKILL);
    }
    if (v === "SIGKILL") {
      return $Maybe("Just", SIGSEGV);
    }
    if (v === "SIGSEGV") {
      return $Maybe("Just", SIGPIPE);
    }
    if (v === "SIGPIPE") {
      return $Maybe("Just", SIGALRM);
    }
    if (v === "SIGALRM") {
      return $Maybe("Just", SIGTERM);
    }
    if (v === "SIGTERM") {
      return Nothing;
    }
    fail();
  },
  pred: (v) => {
    if (v === "Success") {
      return Nothing;
    }
    if (v === "Error") {
      return $Maybe("Just", Success);
    }
    if (v === "MisuseOfShellBuiltins") {
      return $Maybe("Just", $$Error);
    }
    if (v === "CLIUsageError") {
      return $Maybe("Just", MisuseOfShellBuiltins);
    }
    if (v === "DataFormatError") {
      return $Maybe("Just", CLIUsageError);
    }
    if (v === "CannotOpenInput") {
      return $Maybe("Just", DataFormatError);
    }
    if (v === "AddresseeUnknown") {
      return $Maybe("Just", CannotOpenInput);
    }
    if (v === "HostNameUnknown") {
      return $Maybe("Just", AddresseeUnknown);
    }
    if (v === "ServiceUnavailable") {
      return $Maybe("Just", HostNameUnknown);
    }
    if (v === "InternalSoftwareError") {
      return $Maybe("Just", ServiceUnavailable);
    }
    if (v === "SystemError") {
      return $Maybe("Just", InternalSoftwareError);
    }
    if (v === "CriticalOSFileMissing") {
      return $Maybe("Just", SystemError);
    }
    if (v === "CannotCreateOutputFile") {
      return $Maybe("Just", CriticalOSFileMissing);
    }
    if (v === "IOError") {
      return $Maybe("Just", CannotCreateOutputFile);
    }
    if (v === "TemporaryFailure") {
      return $Maybe("Just", IOError);
    }
    if (v === "RemoteError") {
      return $Maybe("Just", TemporaryFailure);
    }
    if (v === "PermissionDenied") {
      return $Maybe("Just", RemoteError);
    }
    if (v === "ConfigurationError") {
      return $Maybe("Just", PermissionDenied);
    }
    if (v === "CannotExecute") {
      return $Maybe("Just", ConfigurationError);
    }
    if (v === "CommandNotFound") {
      return $Maybe("Just", CannotExecute);
    }
    if (v === "InvalidExitArgument") {
      return $Maybe("Just", CommandNotFound);
    }
    if (v === "SIGHUP") {
      return $Maybe("Just", InvalidExitArgument);
    }
    if (v === "SIGINT") {
      return $Maybe("Just", SIGHUP);
    }
    if (v === "SIGQUIT") {
      return $Maybe("Just", SIGINT);
    }
    if (v === "SIGILL") {
      return $Maybe("Just", SIGQUIT);
    }
    if (v === "SIGABRT") {
      return $Maybe("Just", SIGILL);
    }
    if (v === "SIGFPE") {
      return $Maybe("Just", SIGABRT);
    }
    if (v === "SIGKILL") {
      return $Maybe("Just", SIGFPE);
    }
    if (v === "SIGSEGV") {
      return $Maybe("Just", SIGKILL);
    }
    if (v === "SIGPIPE") {
      return $Maybe("Just", SIGSEGV);
    }
    if (v === "SIGALRM") {
      return $Maybe("Just", SIGPIPE);
    }
    if (v === "SIGTERM") {
      return $Maybe("Just", SIGALRM);
    }
    fail();
  },
  Ord0: () => ordExitCode
};
var boundedExitCode = { bottom: Success, top: SIGTERM, Ord0: () => ordExitCode };
var boundedEnumExitCode = {
  cardinality: 32,
  toEnum: (v) => {
    if (v === 0) {
      return $Maybe("Just", Success);
    }
    if (v === 1) {
      return $Maybe("Just", $$Error);
    }
    if (v === 2) {
      return $Maybe("Just", MisuseOfShellBuiltins);
    }
    if (v === 64) {
      return $Maybe("Just", CLIUsageError);
    }
    if (v === 65) {
      return $Maybe("Just", DataFormatError);
    }
    if (v === 66) {
      return $Maybe("Just", CannotOpenInput);
    }
    if (v === 67) {
      return $Maybe("Just", AddresseeUnknown);
    }
    if (v === 68) {
      return $Maybe("Just", HostNameUnknown);
    }
    if (v === 69) {
      return $Maybe("Just", ServiceUnavailable);
    }
    if (v === 70) {
      return $Maybe("Just", InternalSoftwareError);
    }
    if (v === 71) {
      return $Maybe("Just", SystemError);
    }
    if (v === 72) {
      return $Maybe("Just", CriticalOSFileMissing);
    }
    if (v === 73) {
      return $Maybe("Just", CannotCreateOutputFile);
    }
    if (v === 74) {
      return $Maybe("Just", IOError);
    }
    if (v === 75) {
      return $Maybe("Just", TemporaryFailure);
    }
    if (v === 76) {
      return $Maybe("Just", RemoteError);
    }
    if (v === 77) {
      return $Maybe("Just", PermissionDenied);
    }
    if (v === 78) {
      return $Maybe("Just", ConfigurationError);
    }
    if (v === 126) {
      return $Maybe("Just", CannotExecute);
    }
    if (v === 127) {
      return $Maybe("Just", CommandNotFound);
    }
    if (v === 128) {
      return $Maybe("Just", InvalidExitArgument);
    }
    if (v === 129) {
      return $Maybe("Just", SIGHUP);
    }
    if (v === 130) {
      return $Maybe("Just", SIGINT);
    }
    if (v === 131) {
      return $Maybe("Just", SIGQUIT);
    }
    if (v === 132) {
      return $Maybe("Just", SIGILL);
    }
    if (v === 134) {
      return $Maybe("Just", SIGABRT);
    }
    if (v === 136) {
      return $Maybe("Just", SIGFPE);
    }
    if (v === 137) {
      return $Maybe("Just", SIGKILL);
    }
    if (v === 139) {
      return $Maybe("Just", SIGSEGV);
    }
    if (v === 141) {
      return $Maybe("Just", SIGPIPE);
    }
    if (v === 142) {
      return $Maybe("Just", SIGALRM);
    }
    if (v === 143) {
      return $Maybe("Just", SIGTERM);
    }
    return Nothing;
  },
  fromEnum: (v) => {
    if (v === "Success") {
      return 0;
    }
    if (v === "Error") {
      return 1;
    }
    if (v === "MisuseOfShellBuiltins") {
      return 2;
    }
    if (v === "CLIUsageError") {
      return 64;
    }
    if (v === "DataFormatError") {
      return 65;
    }
    if (v === "CannotOpenInput") {
      return 66;
    }
    if (v === "AddresseeUnknown") {
      return 67;
    }
    if (v === "HostNameUnknown") {
      return 68;
    }
    if (v === "ServiceUnavailable") {
      return 69;
    }
    if (v === "InternalSoftwareError") {
      return 70;
    }
    if (v === "SystemError") {
      return 71;
    }
    if (v === "CriticalOSFileMissing") {
      return 72;
    }
    if (v === "CannotCreateOutputFile") {
      return 73;
    }
    if (v === "IOError") {
      return 74;
    }
    if (v === "TemporaryFailure") {
      return 75;
    }
    if (v === "RemoteError") {
      return 76;
    }
    if (v === "PermissionDenied") {
      return 77;
    }
    if (v === "ConfigurationError") {
      return 78;
    }
    if (v === "CannotExecute") {
      return 126;
    }
    if (v === "CommandNotFound") {
      return 127;
    }
    if (v === "InvalidExitArgument") {
      return 128;
    }
    if (v === "SIGHUP") {
      return 129;
    }
    if (v === "SIGINT") {
      return 130;
    }
    if (v === "SIGQUIT") {
      return 131;
    }
    if (v === "SIGILL") {
      return 132;
    }
    if (v === "SIGABRT") {
      return 134;
    }
    if (v === "SIGFPE") {
      return 136;
    }
    if (v === "SIGKILL") {
      return 137;
    }
    if (v === "SIGSEGV") {
      return 139;
    }
    if (v === "SIGPIPE") {
      return 141;
    }
    if (v === "SIGALRM") {
      return 142;
    }
    if (v === "SIGTERM") {
      return 143;
    }
    fail();
  },
  Bounded0: () => boundedExitCode,
  Enum1: () => enumExitCode
};

// output-es/Data.Function/index.js
var $$const = (a) => (v) => a;
var applyFlipped = (x) => (f) => f(x);

// output-es/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output-es/Data.Functor/index.js
var functorArray = { map: arrayMap };

// output-es/Control.Apply/foreign.js
var arrayApply = function(fs) {
  return function(xs) {
    var l = fs.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i = 0; i < l; i++) {
      var f = fs[i];
      for (var j = 0; j < k; j++) {
        result[n++] = f(xs[j]);
      }
    }
    return result;
  };
};

// output-es/Control.Apply/index.js
var identity = (x) => x;
var applyArray = { apply: arrayApply, Functor0: () => functorArray };

// output-es/Control.Applicative/index.js
var applicativeArray = { pure: (x) => [x], Apply0: () => applyArray };

// output-es/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output-es/Data.Either/index.js
var $Either = (tag, _1) => ({ tag, _1 });
var Left = (value0) => $Either("Left", value0);
var Right = (value0) => $Either("Right", value0);
var functorEither = {
  map: (f) => (m) => {
    if (m.tag === "Left") {
      return $Either("Left", m._1);
    }
    if (m.tag === "Right") {
      return $Either("Right", f(m._1));
    }
    fail();
  }
};

// output-es/Data.Identity/index.js
var Identity = (x) => x;
var functorIdentity = { map: (f) => (m) => f(m) };
var applyIdentity = { apply: (v) => (v1) => v(v1), Functor0: () => functorIdentity };
var bindIdentity = { bind: (v) => (f) => f(v), Apply0: () => applyIdentity };
var applicativeIdentity = { pure: Identity, Apply0: () => applyIdentity };
var monadIdentity = { Applicative0: () => applicativeIdentity, Bind1: () => bindIdentity };

// output-es/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};

// output-es/Effect/index.js
var applyEffect = {
  apply: (f) => (a) => () => {
    const f$p = f();
    const a$p = a();
    return applicativeEffect.pure(f$p(a$p))();
  },
  Functor0: () => functorEffect
};
var applicativeEffect = { pure: pureE, Apply0: () => applyEffect };
var functorEffect = {
  map: (f) => (a) => () => {
    const a$p = a();
    return f(a$p);
  }
};

// output-es/Control.Monad.Rec.Class/index.js
var $Step = (tag, _1) => ({ tag, _1 });
var Loop = (value0) => $Step("Loop", value0);

// output-es/Data.Tuple/index.js
var $Tuple = (_1, _2) => ({ tag: "Tuple", _1, _2 });
var Tuple = (value0) => (value12) => $Tuple(value0, value12);
var snd = (v) => v._2;
var fst = (v) => v._1;
var ordTuple = (dictOrd) => {
  const $0 = dictOrd.Eq0();
  return (dictOrd1) => {
    const $1 = dictOrd1.Eq0();
    const eqTuple2 = { eq: (x) => (y) => $0.eq(x._1)(y._1) && $1.eq(x._2)(y._2) };
    return {
      compare: (x) => (y) => {
        const v = dictOrd.compare(x._1)(y._1);
        if (v === "LT") {
          return LT;
        }
        if (v === "GT") {
          return GT;
        }
        return dictOrd1.compare(x._2)(y._2);
      },
      Eq0: () => eqTuple2
    };
  };
};

// output-es/Control.Monad.Except.Trans/index.js
var bindExceptT = (dictMonad) => ({
  bind: (v) => (k) => dictMonad.Bind1().bind(v)((v2) => {
    if (v2.tag === "Left") {
      return dictMonad.Applicative0().pure($Either("Left", v2._1));
    }
    if (v2.tag === "Right") {
      return k(v2._1);
    }
    fail();
  }),
  Apply0: () => applyExceptT(dictMonad)
});
var applyExceptT = (dictMonad) => {
  const $0 = dictMonad.Bind1().Apply0().Functor0();
  const functorExceptT1 = {
    map: (f) => $0.map((m) => {
      if (m.tag === "Left") {
        return $Either("Left", m._1);
      }
      if (m.tag === "Right") {
        return $Either("Right", f(m._1));
      }
      fail();
    })
  };
  return {
    apply: (() => {
      const $1 = bindExceptT(dictMonad);
      return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeExceptT(dictMonad).pure(f$p(a$p))));
    })(),
    Functor0: () => functorExceptT1
  };
};
var applicativeExceptT = (dictMonad) => ({ pure: (x) => dictMonad.Applicative0().pure($Either("Right", x)), Apply0: () => applyExceptT(dictMonad) });
var monadStateExceptT = (dictMonadState) => {
  const Monad0 = dictMonadState.Monad0();
  const monadExceptT1 = { Applicative0: () => applicativeExceptT(Monad0), Bind1: () => bindExceptT(Monad0) };
  return { state: (f) => Monad0.Bind1().bind(dictMonadState.state(f))((a) => Monad0.Applicative0().pure($Either("Right", a))), Monad0: () => monadExceptT1 };
};
var monadThrowExceptT = (dictMonad) => {
  const monadExceptT1 = { Applicative0: () => applicativeExceptT(dictMonad), Bind1: () => bindExceptT(dictMonad) };
  return { throwError: (x) => dictMonad.Applicative0().pure($Either("Left", x)), Monad0: () => monadExceptT1 };
};
var altExceptT = (dictSemigroup) => (dictMonad) => {
  const Bind1 = dictMonad.Bind1();
  const $0 = dictMonad.Applicative0();
  const $1 = Bind1.Apply0().Functor0();
  const functorExceptT1 = {
    map: (f) => $1.map((m) => {
      if (m.tag === "Left") {
        return $Either("Left", m._1);
      }
      if (m.tag === "Right") {
        return $Either("Right", f(m._1));
      }
      fail();
    })
  };
  return {
    alt: (v) => (v1) => Bind1.bind(v)((rm2) => {
      if (rm2.tag === "Right") {
        return $0.pure($Either("Right", rm2._1));
      }
      if (rm2.tag === "Left") {
        const $2 = rm2._1;
        return Bind1.bind(v1)((rn) => {
          if (rn.tag === "Right") {
            return $0.pure($Either("Right", rn._1));
          }
          if (rn.tag === "Left") {
            return $0.pure($Either("Left", dictSemigroup.append($2)(rn._1)));
          }
          fail();
        });
      }
      fail();
    }),
    Functor0: () => functorExceptT1
  };
};

// output-es/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init) {
    return function(xs) {
      var acc = init;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output-es/Data.Foldable/index.js
var identity2 = (x) => x;
var traverse_ = (dictApplicative) => {
  const $0 = dictApplicative.Apply0();
  return (dictFoldable) => (f) => dictFoldable.foldr((x) => {
    const $1 = f(x);
    return (b) => $0.apply($0.Functor0().map((v) => identity)($1))(b);
  })(dictApplicative.pure());
};
var for_ = (dictApplicative) => {
  const traverse_12 = traverse_(dictApplicative);
  return (dictFoldable) => {
    const $0 = traverse_12(dictFoldable);
    return (b) => (a) => $0(a)(b);
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableArray.foldr((x) => (acc) => dictMonoid.Semigroup0().append(f(x))(acc))(mempty);
  }
};

// output-es/Data.Number/foreign.js
var isFiniteImpl = isFinite;
function fromStringImpl(str, isFinite2, just, nothing) {
  var num = parseFloat(str);
  if (isFinite2(num)) {
    return just(num);
  } else {
    return nothing;
  }
}
var round = Math.round;

// output-es/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
var toNumber = function(n) {
  return n;
};
var fromStringAsImpl = function(just) {
  return function(nothing) {
    return function(radix) {
      var digits;
      if (radix < 11) {
        digits = "[0-" + (radix - 1).toString() + "]";
      } else if (radix === 11) {
        digits = "[0-9a]";
      } else {
        digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
      }
      var pattern = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
      return function(s) {
        if (pattern.test(s)) {
          var i = parseInt(s, radix);
          return (i | 0) === i ? just(i) : nothing;
        } else {
          return nothing;
        }
      };
    };
  };
};

// output-es/Data.Int/index.js
var fromStringAs = /* @__PURE__ */ fromStringAsImpl(Just)(Nothing);
var fromString = /* @__PURE__ */ fromStringAs(10);
var fromNumber = /* @__PURE__ */ fromNumberImpl(Just)(Nothing);
var unsafeClamp = (x) => {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  if (x >= toNumber(2147483647)) {
    return 2147483647;
  }
  if (x <= toNumber(-2147483648)) {
    return -2147483648;
  }
  const $0 = fromNumber(x);
  if ($0.tag === "Nothing") {
    return 0;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};

// output-es/Data.EuclideanRing/foreign.js
var intMod = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
  };
};

// output-es/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output-es/Data.Semigroup/index.js
var semigroupString = { append: concatString };
var semigroupArray = { append: concatArray };

// output-es/Data.Monoid/index.js
var monoidArray = { mempty: [], Semigroup0: () => semigroupArray };
var monoidRecord = () => (dictMonoidRecord) => {
  const semigroupRecord1 = { append: dictMonoidRecord.SemigroupRecord0().appendRecord($$Proxy) };
  return { mempty: dictMonoidRecord.memptyRecord($$Proxy), Semigroup0: () => semigroupRecord1 };
};

// output-es/Data.String.Common/foreign.js
var split = function(sep2) {
  return function(s) {
    return s.split(sep2);
  };
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

// output-es/Effect.Exception/foreign.js
function message(e) {
  return e.message;
}
function catchException(c) {
  return function(t) {
    return function() {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
}

// output-es/Control.Monad.Error.Class/index.js
var $$try = (dictMonadError) => {
  const Monad0 = dictMonadError.MonadThrow0().Monad0();
  return (a) => dictMonadError.catchError(Monad0.Bind1().Apply0().Functor0().map(Right)(a))((x) => Monad0.Applicative0().pure($Either("Left", x)));
};

// output-es/Control.Monad.ST.Uncurried/foreign.js
var runSTFn2 = function runSTFn22(fn) {
  return function(a) {
    return function(b) {
      return function() {
        return fn(a, b);
      };
    };
  };
};

// output-es/Data.Array.ST/foreign.js
var sortByImpl = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2, fromOrdering, xs) {
    if (xs.length < 2)
      return xs;
    mergeFromTo(compare2, fromOrdering, xs, xs.slice(0), 0, xs.length);
    return xs;
  };
}();
var pushImpl = function(a, xs) {
  return xs.push(a);
};

// output-es/Data.Array.ST/index.js
var push = /* @__PURE__ */ runSTFn2(pushImpl);

// output-es/Data.Array.ST.Iterator/index.js
var $Iterator = (_1, _2) => ({ tag: "Iterator", _1, _2 });
var pushWhile = (p) => (iter) => (array) => () => {
  let $$break = false;
  const $0 = iter._2;
  while ((() => {
    const $1 = $$break;
    return !$1;
  })()) {
    const i = $0.value;
    const mx = iter._1(i);
    if (mx.tag === "Just" && p(mx._1)) {
      array.push(mx._1);
      iter._2.value;
      const $1 = iter._2.value;
      iter._2.value = $1 + 1 | 0;
      continue;
    }
    $$break = true;
  }
};
var iterate = (iter) => (f) => () => {
  let $$break = false;
  const $0 = iter._2;
  while ((() => {
    const $1 = $$break;
    return !$1;
  })()) {
    const i = $0.value;
    const $1 = $0.value;
    $0.value = $1 + 1 | 0;
    const mx = iter._1(i);
    if (mx.tag === "Just") {
      f(mx._1)();
      continue;
    }
    if (mx.tag === "Nothing") {
      $$break = true;
      continue;
    }
    fail();
  }
};

// output-es/Data.FunctorWithIndex/foreign.js
var mapWithIndexArray = function(f) {
  return function(xs) {
    var l = xs.length;
    var result = Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(i)(xs[i]);
    }
    return result;
  };
};

// output-es/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqIntImpl = refEq;
var eqCharImpl = refEq;
var eqStringImpl = refEq;
var eqArrayImpl = function(f) {
  return function(xs) {
    return function(ys) {
      if (xs.length !== ys.length)
        return false;
      for (var i = 0; i < xs.length; i++) {
        if (!f(xs[i])(ys[i]))
          return false;
      }
      return true;
    };
  };
};

// output-es/Data.Eq/index.js
var eqUnit = { eq: (v) => (v1) => true };
var eqString = { eq: eqStringImpl };
var eqInt = { eq: eqIntImpl };
var eqChar = { eq: eqCharImpl };

// output-es/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;
var ordStringImpl = unsafeCompareImpl;
var ordCharImpl = unsafeCompareImpl;

// output-es/Data.Ord/index.js
var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };
var ordChar = { compare: /* @__PURE__ */ ordCharImpl(LT)(EQ)(GT), Eq0: () => eqChar };

// output-es/Unsafe.Coerce/foreign.js
var unsafeCoerce = function(x) {
  return x;
};

// output-es/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat22(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply6) {
    return function(map2) {
      return function(pure3) {
        return function(f) {
          return function(array) {
            function go(bot, top) {
              switch (top - bot) {
                case 0:
                  return pure3([]);
                case 1:
                  return map2(array1)(f(array[bot]));
                case 2:
                  return apply6(map2(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply6(apply6(map2(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply6(map2(concat22)(go(bot, pivot)))(go(pivot, top));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output-es/Data.Traversable/index.js
var identity3 = (x) => x;
var traversableArray = {
  traverse: (dictApplicative) => {
    const Apply0 = dictApplicative.Apply0();
    return traverseArrayImpl(Apply0.apply)(Apply0.Functor0().map)(dictApplicative.pure);
  },
  sequence: (dictApplicative) => traversableArray.traverse(dictApplicative)(identity3),
  Functor0: () => functorArray,
  Foldable1: () => foldableArray
};

// output-es/Data.Array/foreign.js
var rangeImpl = function(start, end) {
  var step = start > end ? -1 : 1;
  var result = new Array(step * (end - start) + 1);
  var i = start, n = 0;
  while (i !== end) {
    result[n++] = i;
    i += step;
  }
  result[n] = i;
  return result;
};
var replicateFill = function(count, value2) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value2);
};
var replicatePolyfill = function(count, value2) {
  var result = [];
  var n = 0;
  for (var i = 0; i < count; i++) {
    result[n++] = value2;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons2(head, tail) {
    this.head = head;
    this.tail = tail;
  }
  var emptyList = {};
  function curryCons(head) {
    return function(tail) {
      return new Cons2(head, tail);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr2, xs) {
    return listToArray(foldr2(curryCons)(emptyList)(xs));
  };
}();
var unconsImpl = function(empty3, next, xs) {
  return xs.length === 0 ? empty3({}) : next(xs[0])(xs.slice(1));
};
var findIndexImpl = function(just, nothing, f, xs) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (f(xs[i]))
      return just(i);
  }
  return nothing;
};
var _deleteAt = function(just, nothing, i, l) {
  if (i < 0 || i >= l.length)
    return nothing;
  var l1 = l.slice();
  l1.splice(i, 1);
  return just(l1);
};
var reverse = function(l) {
  return l.slice().reverse();
};
var concat = function(xss) {
  if (xss.length <= 1e4) {
    return Array.prototype.concat.apply([], xss);
  }
  var result = [];
  for (var i = 0, l = xss.length; i < l; i++) {
    var xs = xss[i];
    for (var j = 0, m = xs.length; j < m; j++) {
      result.push(xs[j]);
    }
  }
  return result;
};
var filterImpl = function(f, xs) {
  return xs.filter(f);
};
var partitionImpl = function(f, xs) {
  var yes = [];
  var no = [];
  for (var i = 0; i < xs.length; i++) {
    var x = xs[i];
    if (f(x))
      yes.push(x);
    else
      no.push(x);
  }
  return { yes, no };
};
var sortByImpl2 = function() {
  function mergeFromTo(compare2, fromOrdering, xs1, xs2, from, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from + (to - from >> 1);
    if (mid - from > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, from, mid);
    if (to - mid > 1)
      mergeFromTo(compare2, fromOrdering, xs2, xs1, mid, to);
    i = from;
    j = mid;
    k = from;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare2(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare2, fromOrdering, xs) {
    var out;
    if (xs.length < 2)
      return xs;
    out = xs.slice(0);
    mergeFromTo(compare2, fromOrdering, out, xs.slice(0), 0, xs.length);
    return out;
  };
}();
var sliceImpl = function(s, e, l) {
  return l.slice(s, e);
};
var zipWithImpl = function(f, xs, ys) {
  var l = xs.length < ys.length ? xs.length : ys.length;
  var result = new Array(l);
  for (var i = 0; i < l; i++) {
    result[i] = f(xs[i])(ys[i]);
  }
  return result;
};

// output-es/Data.Array/index.js
var zipWith = ($0) => ($1) => ($2) => zipWithImpl($0, $1, $2);
var sortBy = (comp) => ($0) => sortByImpl2(
  comp,
  (v) => {
    if (v === "GT") {
      return 1;
    }
    if (v === "EQ") {
      return 0;
    }
    if (v === "LT") {
      return -1;
    }
    fail();
  },
  $0
);
var sortWith = (dictOrd) => (f) => sortBy((x) => (y) => dictOrd.compare(f(x))(f(y)));
var snoc = (xs) => (x) => (() => {
  const $0 = push(x);
  return () => {
    const result = [...xs];
    $0(result)();
    return result;
  };
})()();
var last = (xs) => {
  const $0 = xs.length - 1 | 0;
  if ($0 >= 0 && $0 < xs.length) {
    return $Maybe("Just", xs[$0]);
  }
  return Nothing;
};
var unsnoc = (xs) => applyMaybe.apply(xs.length === 0 ? Nothing : $Maybe(
  "Just",
  (() => {
    const $0 = sliceImpl(0, xs.length - 1 | 0, xs);
    return (v1) => ({ init: $0, last: v1 });
  })()
))(last(xs));
var nubBy = (comp) => (xs) => {
  const indexedAndSorted = sortBy((x) => (y) => comp(x._2)(y._2))(mapWithIndexArray(Tuple)(xs));
  if (0 < indexedAndSorted.length) {
    return arrayMap(snd)(sortWith(ordInt)(fst)((() => {
      const result = [indexedAndSorted[0]];
      for (const v1 of indexedAndSorted) {
        const $0 = comp((() => {
          const $02 = last(result);
          if ($02.tag === "Just") {
            return $02._1._2;
          }
          fail();
        })())(v1._2);
        if ($0 === "LT" || $0 === "GT" || $0 !== "EQ") {
          result.push(v1);
        }
      }
      return result;
    })()));
  }
  return [];
};
var groupBy = (op) => (xs) => {
  const result = [];
  const $0 = { value: 0 };
  const iter = $Iterator(
    (v) => {
      if (v >= 0 && v < xs.length) {
        return $Maybe("Just", xs[v]);
      }
      return Nothing;
    },
    $0
  );
  iterate(iter)((x) => () => {
    const sub1 = [];
    sub1.push(x);
    pushWhile(op(x))(iter)(sub1)();
    result.push(sub1);
  })();
  return result;
};
var groupAllBy = (cmp) => {
  const $0 = groupBy((x) => (y) => cmp(x)(y) === "EQ");
  return (x) => $0(sortBy(cmp)(x));
};
var transpose = (xs) => {
  const go = (go$a0$copy) => (go$a1$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const idx = go$a0, allArrays = go$a1;
      const v = foldlArray((acc) => (nextArr) => {
        if (idx >= 0 && idx < nextArr.length) {
          const $0 = nextArr[idx];
          return $Maybe(
            "Just",
            (() => {
              if (acc.tag === "Nothing") {
                return [$0];
              }
              if (acc.tag === "Just") {
                return snoc(acc._1)($0);
              }
              fail();
            })()
          );
        }
        return acc;
      })(Nothing)(xs);
      if (v.tag === "Nothing") {
        go$c = false;
        go$r = allArrays;
        continue;
      }
      if (v.tag === "Just") {
        go$a0 = idx + 1 | 0;
        go$a1 = snoc(allArrays)(v._1);
        continue;
      }
      fail();
    }
    return go$r;
  };
  return go(0)([]);
};
var foldM = (dictMonad) => (f) => (b) => ($0) => unconsImpl((v) => dictMonad.Applicative0().pure(b), (a) => (as) => dictMonad.Bind1().bind(f(b)(a))((b$p) => foldM(dictMonad)(f)(b$p)(as)), $0);
var find = (f) => (xs) => {
  const $0 = findIndexImpl(Just, Nothing, f, xs);
  if ($0.tag === "Just") {
    return $Maybe("Just", xs[$0._1]);
  }
  return Nothing;
};
var intersectBy = (eq2) => (xs) => (ys) => filterImpl(
  (x) => {
    const $0 = findIndexImpl(Just, Nothing, eq2(x), ys);
    if ($0.tag === "Nothing") {
      return false;
    }
    if ($0.tag === "Just") {
      return true;
    }
    fail();
  },
  xs
);
var elem = (dictEq) => (a) => (arr) => {
  const $0 = findIndexImpl(Just, Nothing, (v) => dictEq.eq(v)(a), arr);
  if ($0.tag === "Nothing") {
    return false;
  }
  if ($0.tag === "Just") {
    return true;
  }
  fail();
};
var drop = (n) => (xs) => {
  if (n < 1) {
    return xs;
  }
  return sliceImpl(n, xs.length, xs);
};
var cons = (x) => (xs) => [x, ...xs];
var concatMap = (b) => (a) => arrayBind(a)(b);
var mapMaybe = (f) => concatMap((x) => {
  const $0 = f(x);
  if ($0.tag === "Nothing") {
    return [];
  }
  if ($0.tag === "Just") {
    return [$0._1];
  }
  fail();
});

// output-es/Data.NonEmpty/index.js
var $NonEmpty = (_1, _2) => ({ tag: "NonEmpty", _1, _2 });
var foldable1NonEmpty = (dictFoldable) => {
  const foldableNonEmpty1 = {
    foldMap: (dictMonoid) => {
      const foldMap1 = dictFoldable.foldMap(dictMonoid);
      return (f) => (v) => dictMonoid.Semigroup0().append(f(v._1))(foldMap1(f)(v._2));
    },
    foldl: (f) => (b) => (v) => dictFoldable.foldl(f)(f(b)(v._1))(v._2),
    foldr: (f) => (b) => (v) => f(v._1)(dictFoldable.foldr(f)(b)(v._2))
  };
  return {
    foldMap1: (dictSemigroup) => (f) => (v) => dictFoldable.foldl((s) => (a1) => dictSemigroup.append(s)(f(a1)))(f(v._1))(v._2),
    foldr1: (f) => (v) => {
      const $0 = f(v._1);
      const $1 = dictFoldable.foldr((a1) => {
        const $12 = f(a1);
        return (x) => $Maybe(
          "Just",
          (() => {
            if (x.tag === "Nothing") {
              return a1;
            }
            if (x.tag === "Just") {
              return $12(x._1);
            }
            fail();
          })()
        );
      })(Nothing)(v._2);
      if ($1.tag === "Nothing") {
        return v._1;
      }
      if ($1.tag === "Just") {
        return $0($1._1);
      }
      fail();
    },
    foldl1: (f) => (v) => dictFoldable.foldl(f)(v._1)(v._2),
    Foldable0: () => foldableNonEmpty1
  };
};
var ordNonEmpty = (dictOrd1) => {
  const $0 = dictOrd1.Eq10();
  return (dictOrd) => {
    const compare11 = dictOrd1.compare1(dictOrd);
    const $1 = dictOrd.Eq0();
    const eq11 = $0.eq1($1);
    const eqNonEmpty2 = { eq: (x) => (y) => $1.eq(x._1)(y._1) && eq11(x._2)(y._2) };
    return {
      compare: (x) => (y) => {
        const v = dictOrd.compare(x._1)(y._1);
        if (v === "LT") {
          return LT;
        }
        if (v === "GT") {
          return GT;
        }
        return compare11(x._2)(y._2);
      },
      Eq0: () => eqNonEmpty2
    };
  };
};

// output-es/Data.List.Types/index.js
var $List = (tag, _1, _2) => ({ tag, _1, _2 });
var Nil = /* @__PURE__ */ $List("Nil");
var Cons = (value0) => (value12) => $List("Cons", value0, value12);
var listMap = (f) => {
  const chunkedRevMap = (chunkedRevMap$a0$copy) => (chunkedRevMap$a1$copy) => {
    let chunkedRevMap$a0 = chunkedRevMap$a0$copy, chunkedRevMap$a1 = chunkedRevMap$a1$copy, chunkedRevMap$c = true, chunkedRevMap$r;
    while (chunkedRevMap$c) {
      const v = chunkedRevMap$a0, v1 = chunkedRevMap$a1;
      if (v1.tag === "Cons" && v1._2.tag === "Cons" && v1._2._2.tag === "Cons") {
        chunkedRevMap$a0 = $List("Cons", v1, v);
        chunkedRevMap$a1 = v1._2._2._2;
        continue;
      }
      const reverseUnrolledMap = (reverseUnrolledMap$a0$copy) => (reverseUnrolledMap$a1$copy) => {
        let reverseUnrolledMap$a0 = reverseUnrolledMap$a0$copy, reverseUnrolledMap$a1 = reverseUnrolledMap$a1$copy, reverseUnrolledMap$c = true, reverseUnrolledMap$r;
        while (reverseUnrolledMap$c) {
          const v2 = reverseUnrolledMap$a0, v3 = reverseUnrolledMap$a1;
          if (v2.tag === "Cons" && v2._1.tag === "Cons" && v2._1._2.tag === "Cons" && v2._1._2._2.tag === "Cons") {
            reverseUnrolledMap$a0 = v2._2;
            reverseUnrolledMap$a1 = $List("Cons", f(v2._1._1), $List("Cons", f(v2._1._2._1), $List("Cons", f(v2._1._2._2._1), v3)));
            continue;
          }
          reverseUnrolledMap$c = false;
          reverseUnrolledMap$r = v3;
        }
        return reverseUnrolledMap$r;
      };
      chunkedRevMap$c = false;
      chunkedRevMap$r = reverseUnrolledMap(v)((() => {
        if (v1.tag === "Cons") {
          if (v1._2.tag === "Cons") {
            if (v1._2._2.tag === "Nil") {
              return $List("Cons", f(v1._1), $List("Cons", f(v1._2._1), Nil));
            }
            return Nil;
          }
          if (v1._2.tag === "Nil") {
            return $List("Cons", f(v1._1), Nil);
          }
        }
        return Nil;
      })());
    }
    return chunkedRevMap$r;
  };
  return chunkedRevMap(Nil);
};
var functorNonEmptyList = { map: (f) => (m) => $NonEmpty(f(m._1), listMap(f)(m._2)) };
var foldableList = {
  foldr: (f) => (b) => {
    const $0 = foldableList.foldl((b$1) => (a) => f(a)(b$1))(b);
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1;
        if (v1.tag === "Nil") {
          go$c = false;
          go$r = v;
          continue;
        }
        if (v1.tag === "Cons") {
          go$a0 = $List("Cons", v1._1, v);
          go$a1 = v1._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    const $1 = go(Nil);
    return (x) => $0($1(x));
  },
  foldl: (f) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const b = go$a0, v = go$a1;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = b;
          continue;
        }
        if (v.tag === "Cons") {
          go$a0 = f(b)(v._1);
          go$a1 = v._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go;
  },
  foldMap: (dictMonoid) => {
    const mempty = dictMonoid.mempty;
    return (f) => foldableList.foldl((acc) => {
      const $0 = dictMonoid.Semigroup0().append(acc);
      return (x) => $0(f(x));
    })(mempty);
  }
};
var foldableNonEmptyList = {
  foldMap: (dictMonoid) => {
    const foldMap1 = foldableList.foldMap(dictMonoid);
    return (f) => (v) => dictMonoid.Semigroup0().append(f(v._1))(foldMap1(f)(v._2));
  },
  foldl: (f) => (b) => (v) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const b$1 = go$a0, v$1 = go$a1;
        if (v$1.tag === "Nil") {
          go$c = false;
          go$r = b$1;
          continue;
        }
        if (v$1.tag === "Cons") {
          go$a0 = f(b$1)(v$1._1);
          go$a1 = v$1._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(f(b)(v._1))(v._2);
  },
  foldr: (f) => (b) => (v) => f(v._1)(foldableList.foldr(f)(b)(v._2))
};
var semigroupNonEmptyList = { append: (v) => (as$p) => $NonEmpty(v._1, foldableList.foldr(Cons)($List("Cons", as$p._1, as$p._2))(v._2)) };
var unfoldable1List = {
  unfoldr1: (f) => (b) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const source2 = go$a0, memo = go$a1;
        const v = f(source2);
        if (v._2.tag === "Just") {
          go$a0 = v._2._1;
          go$a1 = $List("Cons", v._1, memo);
          continue;
        }
        if (v._2.tag === "Nothing") {
          const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
            let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
            while (go$1$c) {
              const b$1 = go$1$a0, v$1 = go$1$a1;
              if (v$1.tag === "Nil") {
                go$1$c = false;
                go$1$r = b$1;
                continue;
              }
              if (v$1.tag === "Cons") {
                go$1$a0 = $List("Cons", v$1._1, b$1);
                go$1$a1 = v$1._2;
                continue;
              }
              fail();
            }
            return go$1$r;
          };
          go$c = false;
          go$r = go$1(Nil)($List("Cons", v._1, memo));
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(b)(Nil);
  }
};
var unfoldableList = {
  unfoldr: (f) => (b) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const source2 = go$a0, memo = go$a1;
        const v = f(source2);
        if (v.tag === "Nothing") {
          const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
            let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
            while (go$1$c) {
              const b$1 = go$1$a0, v$1 = go$1$a1;
              if (v$1.tag === "Nil") {
                go$1$c = false;
                go$1$r = b$1;
                continue;
              }
              if (v$1.tag === "Cons") {
                go$1$a0 = $List("Cons", v$1._1, b$1);
                go$1$a1 = v$1._2;
                continue;
              }
              fail();
            }
            return go$1$r;
          };
          go$c = false;
          go$r = go$1(Nil)(memo);
          continue;
        }
        if (v.tag === "Just") {
          go$a0 = v._1._2;
          go$a1 = $List("Cons", v._1._1, memo);
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(b)(Nil);
  },
  Unfoldable10: () => unfoldable1List
};
var foldable1NonEmptyList = /* @__PURE__ */ foldable1NonEmpty(foldableList);
var eq1List = {
  eq1: (dictEq) => (xs) => (ys) => {
    const go = (v) => (v1) => (v2) => {
      if (!v2) {
        return false;
      }
      if (v.tag === "Nil") {
        return v1.tag === "Nil" && v2;
      }
      return v.tag === "Cons" && v1.tag === "Cons" && go(v._2)(v1._2)(v2 && dictEq.eq(v1._1)(v._1));
    };
    return go(xs)(ys)(true);
  }
};
var ord1List = {
  compare1: (dictOrd) => (xs) => (ys) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0, v1 = go$a1;
        if (v.tag === "Nil") {
          if (v1.tag === "Nil") {
            go$c = false;
            go$r = EQ;
            continue;
          }
          go$c = false;
          go$r = LT;
          continue;
        }
        if (v1.tag === "Nil") {
          go$c = false;
          go$r = GT;
          continue;
        }
        if (v.tag === "Cons" && v1.tag === "Cons") {
          const v2 = dictOrd.compare(v._1)(v1._1);
          if (v2 === "EQ") {
            go$a0 = v._2;
            go$a1 = v1._2;
            continue;
          }
          go$c = false;
          go$r = v2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go(xs)(ys);
  },
  Eq10: () => eq1List
};
var ordNonEmpty2 = /* @__PURE__ */ ordNonEmpty(ord1List);

// output-es/Data.List/index.js
var span = (v) => (v1) => {
  if (v1.tag === "Cons" && v(v1._1)) {
    const v2 = span(v)(v1._2);
    return { init: $List("Cons", v1._1, v2.init), rest: v2.rest };
  }
  return { init: Nil, rest: v1 };
};
var reverse2 = /* @__PURE__ */ (() => {
  const go = (go$a0$copy) => (go$a1$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0, v1 = go$a1;
      if (v1.tag === "Nil") {
        go$c = false;
        go$r = v;
        continue;
      }
      if (v1.tag === "Cons") {
        go$a0 = $List("Cons", v1._1, v);
        go$a1 = v1._2;
        continue;
      }
      fail();
    }
    return go$r;
  };
  return go(Nil);
})();
var zipWith2 = (f) => (xs) => (ys) => {
  const go = (go$a0$copy) => (go$a1$copy) => (go$a2$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0, v1 = go$a1, v2 = go$a2;
      if (v.tag === "Nil") {
        go$c = false;
        go$r = v2;
        continue;
      }
      if (v1.tag === "Nil") {
        go$c = false;
        go$r = v2;
        continue;
      }
      if (v.tag === "Cons" && v1.tag === "Cons") {
        go$a0 = v._2;
        go$a1 = v1._2;
        go$a2 = $List("Cons", f(v._1)(v1._1), v2);
        continue;
      }
      fail();
    }
    return go$r;
  };
  return reverse2(go(xs)(ys)(Nil));
};
var manyRec = (dictMonadRec) => (dictAlternative) => {
  const Alt0 = dictAlternative.Plus1().Alt0();
  const $0 = dictAlternative.Applicative0();
  return (p) => dictMonadRec.tailRecM((acc) => dictMonadRec.Monad0().Bind1().bind(Alt0.alt(Alt0.Functor0().map(Loop)(p))($0.pure($Step(
    "Done",
    void 0
  ))))((aa) => $0.pure((() => {
    if (aa.tag === "Loop") {
      return $Step("Loop", $List("Cons", aa._1, acc));
    }
    if (aa.tag === "Done") {
      return $Step("Done", reverse2(acc));
    }
    fail();
  })())))(Nil);
};

// output-es/Data.String.Unsafe/foreign.js
var charAt = function(i) {
  return function(s) {
    if (i >= 0 && i < s.length)
      return s.charAt(i);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
};

// output-es/Data.String.CodeUnits/foreign.js
var fromCharArray = function(a) {
  return a.join("");
};
var toCharArray = function(s) {
  return s.split("");
};
var singleton = function(c) {
  return c;
};
var _charAt = function(just) {
  return function(nothing) {
    return function(i) {
      return function(s) {
        return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
      };
    };
  };
};
var length2 = function(s) {
  return s.length;
};
var _indexOf = function(just) {
  return function(nothing) {
    return function(x) {
      return function(s) {
        var i = s.indexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};
var take = function(n) {
  return function(s) {
    return s.substr(0, n);
  };
};
var drop2 = function(n) {
  return function(s) {
    return s.substring(n);
  };
};
var splitAt = function(i) {
  return function(s) {
    return { before: s.substring(0, i), after: s.substring(i) };
  };
};

// output-es/Data.String.CodeUnits/index.js
var stripSuffix = (v) => (str) => {
  const v1 = splitAt(length2(str) - length2(v) | 0)(str);
  if (v1.after === v) {
    return $Maybe("Just", v1.before);
  }
  return Nothing;
};
var stripPrefix = (v) => (str) => {
  const v1 = splitAt(length2(v))(str);
  if (v1.before === v) {
    return $Maybe("Just", v1.after);
  }
  return Nothing;
};
var indexOf = /* @__PURE__ */ _indexOf(Just)(Nothing);
var charAt2 = /* @__PURE__ */ _charAt(Just)(Nothing);

// output-es/Data.Unfoldable1/foreign.js
var unfoldr1ArrayImpl = function(isNothing2) {
  return function(fromJust3) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value2 = b;
            while (true) {
              var tuple = f(value2);
              result.push(fst2(tuple));
              var maybe = snd2(tuple);
              if (isNothing2(maybe))
                return result;
              value2 = fromJust3(maybe);
            }
          };
        };
      };
    };
  };
};

// output-es/Data.Unfoldable1/index.js
var fromJust = (v) => {
  if (v.tag === "Just") {
    return v._1;
  }
  fail();
};
var unfoldable1Array = { unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust)(fst)(snd) };

// output-es/Data.Unfoldable/foreign.js
var unfoldrArrayImpl = function(isNothing2) {
  return function(fromJust3) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value2 = b;
            while (true) {
              var maybe = f(value2);
              if (isNothing2(maybe))
                return result;
              var tuple = fromJust3(maybe);
              result.push(fst2(tuple));
              value2 = snd2(tuple);
            }
          };
        };
      };
    };
  };
};

// output-es/Data.Unfoldable/index.js
var fromJust2 = (v) => {
  if (v.tag === "Just") {
    return v._1;
  }
  fail();
};
var unfoldableArray = {
  unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust2)(fst)(snd),
  Unfoldable10: () => unfoldable1Array
};

// output-es/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output-es/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}

// output-es/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";
var _unsafeCodePointAt0 = function(fallback) {
  return hasCodePointAt ? function(str) {
    return str.codePointAt(0);
  } : fallback;
};
var _singleton = function(fallback) {
  return hasFromCodePoint ? String.fromCodePoint : fallback;
};
var _take = function(fallback) {
  return function(n) {
    if (hasStringIterator) {
      return function(str) {
        var accum = "";
        var iter = str[Symbol.iterator]();
        for (var i = 0; i < n; ++i) {
          var o = iter.next();
          if (o.done)
            return accum;
          accum += o.value;
        }
        return accum;
      };
    }
    return fallback(n);
  };
};
var _toCodePointArray = function(fallback) {
  return function(unsafeCodePointAt02) {
    if (hasArrayFrom) {
      return function(str) {
        return Array.from(str, unsafeCodePointAt02);
      };
    }
    return fallback;
  };
};

// output-es/Data.String.CodePoints/index.js
var uncons = (s) => {
  const v = length2(s);
  if (v === 0) {
    return Nothing;
  }
  if (v === 1) {
    return $Maybe("Just", { head: toCharCode(charAt(0)(s)), tail: "" });
  }
  const cu1 = toCharCode(charAt(1)(s));
  const cu0 = toCharCode(charAt(0)(s));
  if (55296 <= cu0 && cu0 <= 56319 && 56320 <= cu1 && cu1 <= 57343) {
    return $Maybe("Just", { head: (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0, tail: drop2(2)(s) });
  }
  return $Maybe("Just", { head: cu0, tail: drop2(1)(s) });
};
var unconsButWithTuple = (s) => {
  const $0 = uncons(s);
  if ($0.tag === "Just") {
    return $Maybe("Just", $Tuple($0._1.head, $0._1.tail));
  }
  return Nothing;
};
var toCodePointArrayFallback = (s) => unfoldableArray.unfoldr(unconsButWithTuple)(s);
var unsafeCodePointAt0Fallback = (s) => {
  const cu0 = toCharCode(charAt(0)(s));
  if (55296 <= cu0 && cu0 <= 56319 && length2(s) > 1) {
    const cu1 = toCharCode(charAt(1)(s));
    if (56320 <= cu1 && cu1 <= 57343) {
      return (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0;
    }
  }
  return cu0;
};
var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
var indexOf2 = (p) => (s) => {
  const $0 = indexOf(p)(s);
  if ($0.tag === "Just") {
    return $Maybe("Just", toCodePointArray(take($0._1)(s)).length);
  }
  return Nothing;
};
var fromCharCode2 = (x) => singleton((() => {
  if (x >= 0 && x <= 65535) {
    return fromCharCode(x);
  }
  if (x < 0) {
    return "\0";
  }
  return "\uFFFF";
})());
var singletonFallback = (v) => {
  if (v <= 65535) {
    return fromCharCode2(v);
  }
  return fromCharCode2(intDiv(v - 65536 | 0, 1024) + 55296 | 0) + fromCharCode2(intMod(v - 65536 | 0)(1024) + 56320 | 0);
};
var singleton2 = /* @__PURE__ */ _singleton(singletonFallback);
var takeFallback = (v) => (v1) => {
  if (v < 1) {
    return "";
  }
  const v2 = uncons(v1);
  if (v2.tag === "Just") {
    return singleton2(v2._1.head) + takeFallback(v - 1 | 0)(v2._1.tail);
  }
  return v1;
};
var take2 = /* @__PURE__ */ _take(takeFallback);
var splitAt2 = (i) => (s) => {
  const before = take2(i)(s);
  return { before, after: drop2(length2(before))(s) };
};

// output-es/Data.String.Regex/foreign.js
var regexImpl = function(left) {
  return function(right) {
    return function(s1) {
      return function(s2) {
        try {
          return right(new RegExp(s1, s2));
        } catch (e) {
          return left(e.message);
        }
      };
    };
  };
};
var split2 = function(r) {
  return function(s) {
    return s.split(r);
  };
};

// output-es/Data.String.Regex/index.js
var regex = (s) => (f) => regexImpl(Left)(Right)(s)((f.global ? "g" : "") + (f.ignoreCase ? "i" : "") + (f.multiline ? "m" : "") + (f.dotAll ? "s" : "") + (f.sticky ? "y" : "") + (f.unicode ? "u" : ""));

// output-es/Data.String.Regex.Flags/index.js
var noFlags = { global: false, ignoreCase: false, multiline: false, dotAll: false, sticky: false, unicode: false };

// output-es/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output-es/Options.Applicative.Internal.Utils/index.js
var whitespaceRegex = /* @__PURE__ */ (() => {
  const v = regex("\\s+")(noFlags);
  if (v.tag === "Left") {
    return _crashWith("whitespaceRegex: `\\s+` seems to be invlaid, err: " + v._1);
  }
  if (v.tag === "Right") {
    return v._1;
  }
  fail();
})();
var startsWith = (p) => (s) => {
  const $0 = indexOf2(p)(s);
  if ($0.tag === "Nothing") {
    return false;
  }
  return $0.tag === "Just" && $0._1 === 0;
};
var apApplyFlipped = (dictApply) => (a) => (b) => dictApply.apply(dictApply.Functor0().map(applyFlipped)(a))(b);

// output-es/Data.Show.Generic/foreign.js
var intercalate = function(separator) {
  return function(xs) {
    return xs.join(separator);
  };
};

// output-es/Data.Show.Generic/index.js
var genericShowArgsNoArguments = { genericShowArgs: (v) => [] };
var genericShowConstructor = (dictGenericShowArgs) => (dictIsSymbol) => ({
  "genericShow'": (v) => {
    const ctor = dictIsSymbol.reflectSymbol($$Proxy);
    const v1 = dictGenericShowArgs.genericShowArgs(v);
    if (v1.length === 0) {
      return ctor;
    }
    return "(" + intercalate(" ")([ctor, ...v1]) + ")";
  }
});

// output-es/Data.Lazy/foreign.js
var defer = function(thunk) {
  var v = null;
  return function() {
    if (thunk === void 0)
      return v;
    v = thunk();
    thunk = void 0;
    return v;
  };
};
var force = function(l) {
  return l();
};

// output-es/Text.PrettyPrint.Leijen/index.js
var $Doc = (tag, _1, _2) => ({ tag, _1, _2 });
var $Docs = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var $LazySimpleDoc = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var $SimpleDoc = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var max2 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === "LT") {
    return y;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return x;
  }
  fail();
};
var min2 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === "LT") {
    return x;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return y;
  }
  fail();
};
var SFail = /* @__PURE__ */ $SimpleDoc("SFail");
var SEmpty = /* @__PURE__ */ $SimpleDoc("SEmpty");
var SFail$p = /* @__PURE__ */ $LazySimpleDoc("SFail'");
var SEmpty$p = /* @__PURE__ */ $LazySimpleDoc("SEmpty'");
var Fail = /* @__PURE__ */ $Doc("Fail");
var Empty = /* @__PURE__ */ $Doc("Empty");
var Line = /* @__PURE__ */ $Doc("Line");
var Nil3 = /* @__PURE__ */ $Docs("Nil");
var text = (v) => {
  if (v === "") {
    return Empty;
  }
  return $Doc("Text", toCodePointArray(v).length, v);
};
var forceSimpleDoc = (v) => {
  if (v.tag === "SFail'") {
    return SFail;
  }
  if (v.tag === "SEmpty'") {
    return SEmpty;
  }
  if (v.tag === "SChar'") {
    return $SimpleDoc("SChar", v._1, forceSimpleDoc(force(v._2)));
  }
  if (v.tag === "SText'") {
    return $SimpleDoc("SText", v._1, v._2, forceSimpleDoc(force(v._3)));
  }
  if (v.tag === "SLine'") {
    return $SimpleDoc("SLine", v._1, forceSimpleDoc(force(v._2)));
  }
  fail();
};
var renderFits = (fits) => (rfrac) => (w) => (headNode) => {
  const r = max2(0)(min2(w)(unsafeClamp(round(toNumber(w) * rfrac))));
  const nicest$p = (n) => (k) => (i) => (ds) => (x) => (y) => {
    const x$p = best(n)(k)($Docs("Cons", i, x, ds));
    if (fits(w)(min2(n)(k))(min2(w - k | 0)((r - k | 0) + n | 0))(x$p)) {
      return x$p;
    }
    return best(n)(k)($Docs("Cons", i, y, ds));
  };
  const best = (v) => (v1) => (v2) => {
    if (v2.tag === "Nil") {
      return SEmpty$p;
    }
    if (v2.tag === "Cons") {
      if (v2._2.tag === "Fail") {
        return SFail$p;
      }
      if (v2._2.tag === "Empty") {
        return best(v)(v1)(v2._3);
      }
      if (v2._2.tag === "Char") {
        const k$p = v1 + 1 | 0;
        return $LazySimpleDoc("SChar'", v2._2._1, defer((v3) => best(v)(k$p)(v2._3)));
      }
      if (v2._2.tag === "Text") {
        const k$p = v1 + v2._2._1 | 0;
        return $LazySimpleDoc("SText'", v2._2._1, v2._2._2, defer((v3) => best(v)(k$p)(v2._3)));
      }
      if (v2._2.tag === "Line") {
        return $LazySimpleDoc("SLine'", v2._1, defer((v3) => best(v2._1)(v2._1)(v2._3)));
      }
      if (v2._2.tag === "FlatAlt") {
        return best(v)(v1)($Docs("Cons", v2._1, v2._2._1, v2._3));
      }
      if (v2._2.tag === "Cat") {
        return best(v)(v1)($Docs("Cons", v2._1, v2._2._1, $Docs("Cons", v2._1, v2._2._2, v2._3)));
      }
      if (v2._2.tag === "Nest") {
        return best(v)(v1)($Docs("Cons", v2._1 + v2._2._1 | 0, v2._2._2, v2._3));
      }
      if (v2._2.tag === "Union") {
        return nicest$p(v)(v1)(v2._1)(v2._3)(v2._2._1)(v2._2._2);
      }
      if (v2._2.tag === "Column") {
        return best(v)(v1)($Docs("Cons", v2._1, v2._2._1(v1), v2._3));
      }
      if (v2._2.tag === "Columns") {
        return best(v)(v1)($Docs("Cons", v2._1, v2._2._1($Maybe("Just", w)), v2._3));
      }
      if (v2._2.tag === "Nesting") {
        return best(v)(v1)($Docs("Cons", v2._1, v2._2._1(v2._1), v2._3));
      }
    }
    fail();
  };
  return forceSimpleDoc(best(0)(0)($Docs("Cons", 0, headNode, Nil3)));
};
var foldr1 = (dictMonoid) => {
  const mempty = dictMonoid.mempty;
  return (f) => (x) => {
    const $0 = unsnoc(x);
    if ($0.tag === "Nothing") {
      return mempty;
    }
    if ($0.tag === "Just") {
      return foldrArray(f)($0._1.last)($0._1.init);
    }
    fail();
  };
};
var flatten = (v) => {
  if (v.tag === "FlatAlt") {
    return v._2;
  }
  if (v.tag === "Cat") {
    return $Doc("Cat", flatten(v._1), flatten(v._2));
  }
  if (v.tag === "Nest") {
    return $Doc("Nest", v._1, flatten(v._2));
  }
  if (v.tag === "Line") {
    return Fail;
  }
  if (v.tag === "Union") {
    return flatten(v._1);
  }
  if (v.tag === "Column") {
    return $Doc("Column", (x) => flatten(v._1(x)));
  }
  if (v.tag === "Columns") {
    return $Doc("Columns", (x) => flatten(v._1(x)));
  }
  if (v.tag === "Nesting") {
    return $Doc("Nesting", (x) => flatten(v._1(x)));
  }
  return v;
};
var softline = /* @__PURE__ */ $Doc(
  "Union",
  /* @__PURE__ */ flatten(/* @__PURE__ */ $Doc("FlatAlt", Line, /* @__PURE__ */ $Doc("Char", " "))),
  /* @__PURE__ */ $Doc("FlatAlt", Line, /* @__PURE__ */ $Doc("Char", " "))
);
var fits1 = (fits1$a0$copy) => (fits1$a1$copy) => (fits1$a2$copy) => (fits1$a3$copy) => {
  let fits1$a0 = fits1$a0$copy, fits1$a1 = fits1$a1$copy, fits1$a2 = fits1$a2$copy, fits1$a3 = fits1$a3$copy, fits1$c = true, fits1$r;
  while (fits1$c) {
    const v = fits1$a0, v1 = fits1$a1, v2 = fits1$a2, v3 = fits1$a3;
    if (v2 < 0) {
      fits1$c = false;
      fits1$r = false;
      continue;
    }
    if (v3.tag === "SFail'") {
      fits1$c = false;
      fits1$r = false;
      continue;
    }
    if (v3.tag === "SEmpty'") {
      fits1$c = false;
      fits1$r = true;
      continue;
    }
    if (v3.tag === "SChar'") {
      fits1$a0 = v;
      fits1$a1 = v1;
      fits1$a2 = v2 - 1 | 0;
      fits1$a3 = force(v3._2);
      continue;
    }
    if (v3.tag === "SText'") {
      fits1$a0 = v;
      fits1$a1 = v1;
      fits1$a2 = v2 - v3._1 | 0;
      fits1$a3 = force(v3._3);
      continue;
    }
    if (v3.tag === "SLine'") {
      fits1$c = false;
      fits1$r = true;
      continue;
    }
    fail();
  }
  return fits1$r;
};
var displayS = (v) => {
  if (v.tag === "SFail") {
    return _crashWith("@SFail@ can not appear uncaught in a rendered @SimpleDoc@");
  }
  if (v.tag === "SEmpty") {
    return "";
  }
  if (v.tag === "SChar") {
    return fromCharArray([v._1]) + displayS(v._2);
  }
  if (v.tag === "SText") {
    return v._2 + displayS(v._3);
  }
  if (v.tag === "SLine") {
    return (v._1 <= 0 ? "\n" : "\n" + fromCharArray(replicateImpl(v._1, " "))) + displayS(v._2);
  }
  fail();
};
var beside = (x) => (y) => $Doc("Cat", x, y);
var docSemigroup = { append: beside };
var docMonoid = { mempty: Empty, Semigroup0: () => docSemigroup };
var foldr11 = /* @__PURE__ */ foldr1(docMonoid);
var string = /* @__PURE__ */ (() => {
  const $0 = arrayMap(text);
  const $1 = split("\n");
  return (x) => foldlArray((v) => (v1) => {
    if (v.init) {
      return { init: false, acc: v1 };
    }
    return { init: false, acc: $Doc("Cat", v.acc, $Doc("Cat", $Doc("FlatAlt", Line, $Doc("Char", " ")), v1)) };
  })({ init: true, acc: Empty })($0($1(x))).acc;
})();
var fillBreak = (f) => (x) => $Doc(
  "Column",
  (k1) => $Doc(
    "Cat",
    x,
    $Doc(
      "Column",
      (k2) => {
        const $0 = k2 - k1 | 0;
        if ($0 > f) {
          return $Doc("Nest", f, $Doc("FlatAlt", Line, Empty));
        }
        const $1 = f - $0 | 0;
        const $2 = $1 <= 0 ? "" : fromCharArray(replicateImpl($1, " "));
        if ($2 === "") {
          return Empty;
        }
        return $Doc("Text", toCodePointArray($2).length, $2);
      }
    )
  )
);
var appendWithSpace = (x) => (y) => $Doc("Cat", x, $Doc("Cat", $Doc("Char", " "), y));
var hsep = /* @__PURE__ */ foldr11(appendWithSpace);
var appendWithLinebreak = (x) => (y) => $Doc("Cat", x, $Doc("Cat", $Doc("FlatAlt", Line, Empty), y));
var vcat = /* @__PURE__ */ foldr11(appendWithLinebreak);
var appendWithLine = (x) => (y) => $Doc("Cat", x, $Doc("Cat", $Doc("FlatAlt", Line, $Doc("Char", " ")), y));
var indent = (i) => (d) => {
  const $0 = i <= 0 ? "" : fromCharArray(replicateImpl(i, " "));
  return $Doc(
    "Column",
    (k) => $Doc(
      "Nesting",
      (i$1) => $Doc("Nest", k - i$1 | 0, $Doc("Nest", i, $Doc("Cat", $0 === "" ? Empty : $Doc("Text", toCodePointArray($0).length, $0), d)))
    )
  );
};

// output-es/Options.Applicative.Help.Chunk/index.js
var chunkMonoid = (dictSemigroup) => {
  const chunkSemigroup1 = {
    append: (v1) => (v2) => {
      if (v1.tag === "Nothing") {
        return v2;
      }
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v1.tag === "Just" && v2.tag === "Just") {
        return $Maybe("Just", dictSemigroup.append(v1._1)(v2._1));
      }
      fail();
    }
  };
  return { mempty: Nothing, Semigroup0: () => chunkSemigroup1 };
};
var mempty1 = /* @__PURE__ */ (() => chunkMonoid(docSemigroup).mempty)();
var vcatChunks = /* @__PURE__ */ foldrArray((v1) => (v2) => {
  if (v1.tag === "Nothing") {
    return v2;
  }
  if (v2.tag === "Nothing") {
    return v1;
  }
  if (v1.tag === "Just" && v2.tag === "Just") {
    return $Maybe(
      "Just",
      $Doc(
        "Cat",
        v1._1,
        $Doc("Cat", $Doc("FlatAlt", Line, $Doc("Char", " ")), v2._1)
      )
    );
  }
  fail();
})(mempty1);
var vsepChunks = /* @__PURE__ */ foldrArray((v1) => (v2) => {
  if (v1.tag === "Nothing") {
    return v2;
  }
  if (v2.tag === "Nothing") {
    return v1;
  }
  if (v1.tag === "Just" && v2.tag === "Just") {
    return $Maybe(
      "Just",
      $Doc(
        "Cat",
        v1._1,
        $Doc(
          "Cat",
          $Doc("FlatAlt", Line, $Doc("Char", " ")),
          $Doc(
            "Cat",
            Empty,
            $Doc("Cat", $Doc("FlatAlt", Line, $Doc("Char", " ")), v2._1)
          )
        )
      )
    );
  }
  fail();
})(mempty1);
var chunkBesideOrBelow = (v1) => (v2) => {
  if (v1.tag === "Nothing") {
    return v2;
  }
  if (v2.tag === "Nothing") {
    return v1;
  }
  if (v1.tag === "Just" && v2.tag === "Just") {
    return $Maybe("Just", $Doc("Cat", v1._1, $Doc("Cat", softline, v2._1)));
  }
  fail();
};
var listToChunk = (dictMonoid) => {
  const mempty23 = chunkMonoid(dictMonoid.Semigroup0()).mempty;
  const fold12 = foldableArray.foldMap(dictMonoid)(identity2);
  return (v) => {
    if (v.length === 0) {
      return mempty23;
    }
    return $Maybe("Just", fold12(v));
  };
};
var stringChunk = (v) => {
  if (v === "") {
    return mempty1;
  }
  return $Maybe("Just", v === "" ? Empty : $Doc("Text", toCodePointArray(v).length, v));
};
var paragraph = /* @__PURE__ */ (() => {
  const $0 = foldrArray((x) => {
    const $02 = stringChunk(x);
    return (v2) => {
      if ($02.tag === "Nothing") {
        return v2;
      }
      if (v2.tag === "Nothing") {
        return $02;
      }
      if ($02.tag === "Just" && v2.tag === "Just") {
        return $Maybe("Just", $Doc("Cat", $02._1, $Doc("Cat", softline, v2._1)));
      }
      fail();
    };
  })(mempty1);
  return (x) => $0(x === "" ? [] : split2(whitespaceRegex)(x));
})();
var tabulate$p = (v) => (v1) => {
  if (v1.length === 0) {
    return mempty1;
  }
  return $Maybe(
    "Just",
    vcat(arrayMap((v2) => indent(2)($Doc(
      "Cat",
      fillBreak(v)(v2._1),
      $Doc("Cat", $Doc("Char", " "), v2._2)
    )))(v1))
  );
};

// output-es/Data.CatQueue/index.js
var $CatQueue = (_1, _2) => ({ tag: "CatQueue", _1, _2 });
var uncons2 = (uncons$a0$copy) => {
  let uncons$a0 = uncons$a0$copy, uncons$c = true, uncons$r;
  while (uncons$c) {
    const v = uncons$a0;
    if (v._1.tag === "Nil") {
      if (v._2.tag === "Nil") {
        uncons$c = false;
        uncons$r = Nothing;
        continue;
      }
      uncons$a0 = $CatQueue(reverse2(v._2), Nil);
      continue;
    }
    if (v._1.tag === "Cons") {
      uncons$c = false;
      uncons$r = $Maybe("Just", $Tuple(v._1._1, $CatQueue(v._1._2, v._2)));
      continue;
    }
    fail();
  }
  return uncons$r;
};

// output-es/Data.CatList/index.js
var $CatList = (tag, _1, _2) => ({ tag, _1, _2 });
var CatNil = /* @__PURE__ */ $CatList("CatNil");
var link = (v) => (v1) => {
  if (v.tag === "CatNil") {
    return v1;
  }
  if (v1.tag === "CatNil") {
    return v;
  }
  if (v.tag === "CatCons") {
    return $CatList("CatCons", v._1, $CatQueue(v._2._1, $List("Cons", v1, v._2._2)));
  }
  fail();
};
var foldr = (k) => (b) => (q) => {
  const foldl = (foldl$a0$copy) => (foldl$a1$copy) => (foldl$a2$copy) => {
    let foldl$a0 = foldl$a0$copy, foldl$a1 = foldl$a1$copy, foldl$a2 = foldl$a2$copy, foldl$c = true, foldl$r;
    while (foldl$c) {
      const v = foldl$a0, v1 = foldl$a1, v2 = foldl$a2;
      if (v2.tag === "Nil") {
        foldl$c = false;
        foldl$r = v1;
        continue;
      }
      if (v2.tag === "Cons") {
        foldl$a0 = v;
        foldl$a1 = v(v1)(v2._1);
        foldl$a2 = v2._2;
        continue;
      }
      fail();
    }
    return foldl$r;
  };
  const go = (go$a0$copy) => (go$a1$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const xs = go$a0, ys = go$a1;
      const v = uncons2(xs);
      if (v.tag === "Nothing") {
        go$c = false;
        go$r = foldl((x) => (i) => i(x))(b)(ys);
        continue;
      }
      if (v.tag === "Just") {
        go$a0 = v._1._2;
        go$a1 = $List("Cons", k(v._1._1), ys);
        continue;
      }
      fail();
    }
    return go$r;
  };
  return go(q)(Nil);
};
var uncons3 = (v) => {
  if (v.tag === "CatNil") {
    return Nothing;
  }
  if (v.tag === "CatCons") {
    return $Maybe("Just", $Tuple(v._1, v._2._1.tag === "Nil" && v._2._2.tag === "Nil" ? CatNil : foldr(link)(CatNil)(v._2)));
  }
  fail();
};
var snoc2 = (cat) => (a) => {
  if (cat.tag === "CatNil") {
    return $CatList("CatCons", a, $CatQueue(Nil, Nil));
  }
  if (cat.tag === "CatCons") {
    return $CatList(
      "CatCons",
      cat._1,
      $CatQueue(
        cat._2._1,
        $List("Cons", $CatList("CatCons", a, $CatQueue(Nil, Nil)), cat._2._2)
      )
    );
  }
  fail();
};

// output-es/Control.Monad.Free/index.js
var $Free = (_1, _2) => ({ tag: "Free", _1, _2 });
var $FreeView = (tag, _1, _2) => ({ tag, _1, _2 });
var toView = (toView$a0$copy) => {
  let toView$a0 = toView$a0$copy, toView$c = true, toView$r;
  while (toView$c) {
    const v = toView$a0;
    if (v._1.tag === "Return") {
      const v2 = uncons3(v._2);
      if (v2.tag === "Nothing") {
        toView$c = false;
        toView$r = $FreeView("Return", v._1._1);
        continue;
      }
      if (v2.tag === "Just") {
        toView$a0 = (() => {
          const $0 = v2._1._1(v._1._1);
          return $Free(
            $0._1,
            (() => {
              if ($0._2.tag === "CatNil") {
                return v2._1._2;
              }
              if (v2._1._2.tag === "CatNil") {
                return $0._2;
              }
              if ($0._2.tag === "CatCons") {
                return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v2._1._2, $0._2._2._2)));
              }
              fail();
            })()
          );
        })();
        continue;
      }
      fail();
    }
    if (v._1.tag === "Bind") {
      toView$c = false;
      toView$r = $FreeView(
        "Bind",
        v._1._1,
        (a) => {
          const $0 = v._1._2(a);
          return $Free(
            $0._1,
            (() => {
              if ($0._2.tag === "CatNil") {
                return v._2;
              }
              if (v._2.tag === "CatNil") {
                return $0._2;
              }
              if ($0._2.tag === "CatCons") {
                return $CatList("CatCons", $0._2._1, $CatQueue($0._2._2._1, $List("Cons", v._2, $0._2._2._2)));
              }
              fail();
            })()
          );
        }
      );
      continue;
    }
    fail();
  }
  return toView$r;
};
var resume$p = (k) => (j) => (f) => {
  const v = toView(f);
  if (v.tag === "Return") {
    return j(v._1);
  }
  if (v.tag === "Bind") {
    return k(v._1)(v._2);
  }
  fail();
};
var freeMonad = { Applicative0: () => freeApplicative, Bind1: () => freeBind };
var freeFunctor = { map: (k) => (f) => freeBind.bind(f)((x) => freeApplicative.pure(k(x))) };
var freeBind = { bind: (v) => (k) => $Free(v._1, snoc2(v._2)(k)), Apply0: () => freeApply };
var freeApply = {
  apply: (f) => (a) => $Free(f._1, snoc2(f._2)((f$p) => $Free(a._1, snoc2(a._2)((a$p) => freeApplicative.pure(f$p(a$p)))))),
  Functor0: () => freeFunctor
};
var freeApplicative = { pure: (x) => $Free($FreeView("Return", x), CatNil), Apply0: () => freeApply };
var freeMonadRec = {
  tailRecM: (k) => (a) => {
    const $0 = k(a);
    return $Free(
      $0._1,
      snoc2($0._2)((v) => {
        if (v.tag === "Loop") {
          return freeMonadRec.tailRecM(k)(v._1);
        }
        if (v.tag === "Done") {
          return $Free($FreeView("Return", v._1), CatNil);
        }
        fail();
      })
    );
  },
  Monad0: () => freeMonad
};

// output-es/Control.Monad.Reader.Trans/index.js
var bindReaderT = (dictBind) => {
  const $0 = dictBind.Apply0();
  const $1 = $0.Functor0();
  const applyReaderT1 = (() => {
    const functorReaderT1 = {
      map: (x) => {
        const $2 = $1.map(x);
        return (v) => (x$1) => $2(v(x$1));
      }
    };
    return { apply: (v) => (v1) => (r) => $0.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
  })();
  return { bind: (v) => (k) => (r) => dictBind.bind(v(r))((a) => k(a)(r)), Apply0: () => applyReaderT1 };
};
var monadReaderT = (dictMonad) => {
  const $0 = dictMonad.Applicative0();
  const $1 = $0.Apply0();
  const applicativeReaderT1 = (() => {
    const $2 = $1.Functor0();
    const functorReaderT1 = {
      map: (x) => {
        const $3 = $2.map(x);
        return (v) => (x$1) => $3(v(x$1));
      }
    };
    const applyReaderT1 = { apply: (v) => (v1) => (r) => $1.apply(v(r))(v1(r)), Functor0: () => functorReaderT1 };
    return {
      pure: (x) => {
        const $3 = $0.pure(x);
        return (v) => $3;
      },
      Apply0: () => applyReaderT1
    };
  })();
  const bindReaderT1 = bindReaderT(dictMonad.Bind1());
  return { Applicative0: () => applicativeReaderT1, Bind1: () => bindReaderT1 };
};

// output-es/Options.Applicative.Types/index.js
var $ArgPolicy = (tag) => tag;
var $Backtracking = (tag) => tag;
var $Context = (_1, _2) => ({ tag: "Context", _1, _2 });
var $IsCmdStart = (tag) => tag;
var $MultPE = (_1, _2) => ({ tag: "MultPE", _1, _2 });
var $OptName = (tag, _1) => ({ tag, _1 });
var $OptReader = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var $OptTree = (tag, _1) => ({ tag, _1 });
var $OptVisibility = (tag) => tag;
var $ParseError = (tag, _1, _2) => ({ tag, _1, _2 });
var $Parser = (tag, _1, _2) => ({ tag, _1, _2 });
var $ParserResult = (tag, _1) => ({ tag, _1 });
var $SomeParser = (_1) => ({ tag: "SomeParser", _1 });
var apply = /* @__PURE__ */ (() => {
  const $0 = applyExceptT(monadIdentity);
  return (v) => (v1) => (r) => $0.apply(v(r))(v1(r));
})();
var bind = /* @__PURE__ */ (() => bindReaderT(bindExceptT(monadIdentity)).bind)();
var Internal = /* @__PURE__ */ $OptVisibility("Internal");
var Hidden = /* @__PURE__ */ $OptVisibility("Hidden");
var Visible = /* @__PURE__ */ $OptVisibility("Visible");
var CmdStart = /* @__PURE__ */ $IsCmdStart("CmdStart");
var CmdCont = /* @__PURE__ */ $IsCmdStart("CmdCont");
var Backtrack = /* @__PURE__ */ $Backtracking("Backtrack");
var Intersperse = /* @__PURE__ */ $ArgPolicy("Intersperse");
var NoIntersperse = /* @__PURE__ */ $ArgPolicy("NoIntersperse");
var AllPositionals = /* @__PURE__ */ $ArgPolicy("AllPositionals");
var NilP = (value0) => $Parser("NilP", value0);
var ShowHelpText = /* @__PURE__ */ $ParseError("ShowHelpText");
var ExpectsArgError = (value0) => $ParseError("ExpectsArgError", value0);
var readerAsk = /* @__PURE__ */ (() => applicativeExceptT(monadIdentity).pure)();
var readMFunctor = {
  map: (f) => (v) => (x) => {
    const $0 = v(x);
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return $Either("Right", f($0._1));
    }
    fail();
  }
};
var readMApply = { apply: (v) => (v1) => apply(v)(v1), Functor0: () => readMFunctor };
var readMApplicative = {
  pure: /* @__PURE__ */ (() => {
    const $0 = applicativeExceptT(monadIdentity);
    return (x) => {
      const $1 = $0.pure(x);
      return (v) => $1;
    };
  })(),
  Apply0: () => readMApply
};
var parseErrorSemigroup = { append: (v) => (m) => m };
var optVisibilityEq = {
  eq: (x) => (y) => {
    if (x === "Internal") {
      return y === "Internal";
    }
    if (x === "Hidden") {
      return y === "Hidden";
    }
    return x === "Visible" && y === "Visible";
  }
};
var optVisibilityOrd = {
  compare: (x) => (y) => {
    if (x === "Internal") {
      if (y === "Internal") {
        return EQ;
      }
      return LT;
    }
    if (y === "Internal") {
      return GT;
    }
    if (x === "Hidden") {
      if (y === "Hidden") {
        return EQ;
      }
      return LT;
    }
    if (y === "Hidden") {
      return GT;
    }
    if (x === "Visible" && y === "Visible") {
      return EQ;
    }
    fail();
  },
  Eq0: () => optVisibilityEq
};
var optNameEq = {
  eq: (x) => (y) => {
    if (x.tag === "OptShort") {
      return y.tag === "OptShort" && x._1 === y._1;
    }
    return x.tag === "OptLong" && y.tag === "OptLong" && x._1 === y._1;
  }
};
var optNameOrd = {
  compare: (x) => (y) => {
    if (x.tag === "OptShort") {
      if (y.tag === "OptShort") {
        return ordChar.compare(x._1)(y._1);
      }
      return LT;
    }
    if (y.tag === "OptShort") {
      return GT;
    }
    if (x.tag === "OptLong" && y.tag === "OptLong") {
      return ordString.compare(x._1)(y._1);
    }
    fail();
  },
  Eq0: () => optNameEq
};
var completerSemigroup = {
  append: (v) => (v1) => (s) => {
    const $0 = v(s);
    const $1 = v1(s);
    return () => {
      const a$p = $0();
      const a$p$1 = $1();
      return [...a$p, ...a$p$1];
    };
  }
};
var completerMonoid = { mempty: (v) => () => [], Semigroup0: () => completerSemigroup };
var parserFunctor = {
  map: (v) => (v1) => {
    if (v1.tag === "NilP") {
      return $Parser("NilP", v(v1._1));
    }
    if (v1.tag === "OptP") {
      return $Parser("OptP", optionFunctor.map(v)(v1._1));
    }
    if (v1.tag === "MultP") {
      return $Parser("MultP", $MultPE(parserFunctor.map((v3) => (x) => v(v3(x)))(v1._1._1), v1._1._2));
    }
    if (v1.tag === "AltP") {
      return $Parser("AltP", parserFunctor.map(v)(v1._1), parserFunctor.map(v)(v1._2));
    }
    if (v1.tag === "BindP") {
      return $Parser(
        "BindP",
        $Free(v1._1._1, snoc2(v1._1._2)((x) => $Free($FreeView("Return", v(x)), CatNil)))
      );
    }
    fail();
  }
};
var optionFunctor = { map: (f) => (o) => ({ ...o, optMain: optReaderFunctor.map(f)(o.optMain) }) };
var optReaderFunctor = {
  map: (v) => (v1) => {
    if (v1.tag === "OptReader") {
      const $0 = v1._2;
      return $OptReader(
        "OptReader",
        v1._1,
        {
          ...$0,
          crReader: (x) => {
            const $1 = $0.crReader(x);
            if ($1.tag === "Left") {
              return $Either("Left", $1._1);
            }
            if ($1.tag === "Right") {
              return $Either("Right", v($1._1));
            }
            fail();
          }
        },
        v1._3
      );
    }
    if (v1.tag === "FlagReader") {
      return $OptReader("FlagReader", v1._1, v(v1._2));
    }
    if (v1.tag === "ArgReader") {
      const $0 = v1._1;
      return $OptReader(
        "ArgReader",
        {
          ...$0,
          crReader: (x) => {
            const $1 = $0.crReader(x);
            if ($1.tag === "Left") {
              return $Either("Left", $1._1);
            }
            if ($1.tag === "Right") {
              return $Either("Right", v($1._1));
            }
            fail();
          }
        }
      );
    }
    if (v1.tag === "CmdReader") {
      return $OptReader(
        "CmdReader",
        v1._1,
        v1._2,
        (x) => {
          const $0 = v1._3(x);
          if ($0.tag === "Just") {
            return $Maybe("Just", { ...$0._1, infoParser: parserFunctor.map(v)($0._1.infoParser) });
          }
          return Nothing;
        }
      );
    }
    fail();
  }
};
var parserApply = { apply: (a) => (b) => $Parser("MultP", $MultPE(a, b)), Functor0: () => parserFunctor };
var manyM = (p) => freeMonadRec.tailRecM((acc) => $Free(
  $FreeView(
    "Bind",
    $Parser("AltP", parserFunctor.map(Loop)(p), $Parser("NilP", $Step("Done", void 0))),
    (x) => $Free($FreeView("Return", x), CatNil)
  ),
  snoc2(CatNil)((aa) => $Free(
    $FreeView(
      "Return",
      (() => {
        if (aa.tag === "Loop") {
          return $Step("Loop", $List("Cons", aa._1, acc));
        }
        if (aa.tag === "Done") {
          return $Step("Done", reverse2(acc));
        }
        fail();
      })()
    ),
    CatNil
  ))
))(Nil);

// output-es/Options.Applicative.Builder.Internal/index.js
var $DefaultProp = (_1, _2) => ({ tag: "DefaultProp", _1, _2 });
var $Mod = (_1, _2, _3) => ({ tag: "Mod", _1, _2, _3 });
var identity7 = (x) => x;
var Mod = (value0) => (value12) => (value2) => $Mod(value0, value12, value2);
var optionFieldsHasName = { name: (n) => (fields) => ({ ...fields, optNames: [n, ...fields.optNames] }) };
var modSemigroup = {
  append: (v) => (v1) => $Mod((x) => v1._1(v._1(x)), $DefaultProp(v1._2._1.tag === "Nothing" ? v._2._1 : v1._2._1, v1._2._2.tag === "Nothing" ? v._2._2 : v1._2._2), (x) => v1._3(v._3(x)))
};
var modMonoid = { mempty: /* @__PURE__ */ $Mod(identity7, /* @__PURE__ */ $DefaultProp(Nothing, Nothing), identity7), Semigroup0: () => modSemigroup };
var optionMod = /* @__PURE__ */ Mod(identity7)(/* @__PURE__ */ $DefaultProp(Nothing, Nothing));
var internal = /* @__PURE__ */ optionMod((p) => ({ ...p, propVisibility: Internal }));
var baseProps = /* @__PURE__ */ (() => ({
  propMetaVar: "",
  propVisibility: Visible,
  propHelp: chunkMonoid(docSemigroup).mempty,
  propShowDefault: Nothing,
  propDescMod: Nothing
}))();
var mkOption = (d) => (g) => (rdr) => ({ optMain: rdr, optProps: { ...g(baseProps), propShowDefault: applyMaybe.apply(d._2)(d._1) } });
var mkParser = (v) => (g) => (rdr) => {
  const o = $Parser("OptP", mkOption(v)(g)(rdr));
  if (v._1.tag === "Nothing") {
    return o;
  }
  if (v._1.tag === "Just") {
    return $Parser("AltP", o, $Parser("NilP", v._1._1));
  }
  fail();
};

// output-es/Options.Applicative.Builder/index.js
var identity8 = (x) => x;
var mempty12 = /* @__PURE__ */ (() => chunkMonoid(docSemigroup).mempty)();
var min3 = (x) => (y) => {
  const v = optVisibilityOrd.compare(x)(y);
  if (v === "LT") {
    return x;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return y;
  }
  fail();
};
var mempty2 = /* @__PURE__ */ (() => monoidRecord()({
  memptyRecord: (v) => ({ argCompleter: completerMonoid.mempty }),
  SemigroupRecord0: () => ({ appendRecord: (v) => (ra) => (rb) => ({ argCompleter: completerSemigroup.append(ra.argCompleter)(rb.argCompleter) }) })
}).mempty)();
var fold = /* @__PURE__ */ (() => foldableArray.foldMap(modMonoid)(identity2))();
var option = (r) => (m) => {
  const $0 = optionMod((p) => ({ ...p, propMetaVar: "ARG" }));
  const $1 = m._1($0._1({ optNames: [], optCompleter: completerMonoid.mempty, optNoArgError: ExpectsArgError }));
  return mkParser($DefaultProp(
    m._2._1.tag === "Nothing" ? $0._2._1 : m._2._1,
    m._2._2.tag === "Nothing" ? $0._2._2 : m._2._2
  ))((x) => m._3($0._3(x)))($OptReader("OptReader", $1.optNames, { crCompleter: $1.optCompleter, crReader: r }, $1.optNoArgError));
};
var hidden = /* @__PURE__ */ optionMod((p) => ({ ...p, propVisibility: min3(Hidden)(p.propVisibility) }));
var flag$p = (actv) => (v) => mkParser(v._2)(v._3)((() => {
  const $0 = v._1({ flagNames: [], flagActive: actv });
  return $OptReader("FlagReader", $0.flagNames, $0.flagActive);
})());
var eitherReader = (f) => bind(readerAsk)((x) => {
  const $0 = f(x);
  if ($0.tag === "Left") {
    const $1 = monadThrowExceptT(monadIdentity).throwError($ParseError("ErrorMsg", $0._1));
    return (v) => $1;
  }
  if ($0.tag === "Right") {
    return readMApplicative.pure($0._1);
  }
  fail();
});
var $$int = /* @__PURE__ */ eitherReader((s) => {
  const v = fromString(s);
  if (v.tag === "Nothing") {
    return $Either("Left", "Can't parse as Int: `" + showStringImpl(s) + "`");
  }
  if (v.tag === "Just") {
    return $Either("Right", v._1);
  }
  fail();
});
var defaultPrefs = {
  prefMultiSuffix: "",
  prefDisambiguate: false,
  prefShowHelpOnError: false,
  prefShowHelpOnEmpty: false,
  prefBacktrack: Backtrack,
  prefColumns: 80
};
var argument = (p) => (v) => mkParser(v._2)(v._3)($OptReader(
  "ArgReader",
  { crCompleter: v._1(mempty2).argCompleter, crReader: p }
));
var abortOption = (err) => (m) => {
  const $0 = fold([
    $Mod(
      (p) => ({ ...p, optNoArgError: (v) => err }),
      $DefaultProp(Nothing, Nothing),
      identity7
    ),
    $Mod(
      identity8,
      $DefaultProp($Maybe("Just", identity8), Nothing),
      identity8
    ),
    optionMod((p) => ({ ...p, propMetaVar: "" }))
  ]);
  return option((() => {
    const $1 = monadThrowExceptT(monadIdentity).throwError(err);
    return (v) => $1;
  })())($Mod(
    (x) => m._1($0._1(x)),
    $DefaultProp(m._2._1.tag === "Nothing" ? $0._2._1 : m._2._1, m._2._2.tag === "Nothing" ? $0._2._2 : m._2._2),
    (x) => m._3($0._3(x))
  ));
};

// output-es/Node.Encoding/index.js
var $Encoding = (tag) => tag;
var UTF8 = /* @__PURE__ */ $Encoding("UTF8");

// output-es/Data.Nullable/foreign.js
function nullable(a, r, f) {
  return a == null ? r : f(a);
}

// output-es/Effect.Uncurried/foreign.js
var runEffectFn1 = function runEffectFn12(fn) {
  return function(a) {
    return function() {
      return fn(a);
    };
  };
};

// output-es/Foreign.Object/foreign.js
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});

// output-es/Node.Process/foreign.js
import process from "process";
var abortImpl = process.abort ? () => process.abort() : null;
var argv = () => process.argv.slice();
var channelRefImpl = process.channel && process.channel.ref ? () => process.channel.ref() : null;
var channelUnrefImpl = process.channel && process.channel.unref ? () => process.channel.unref() : null;
var debugPort = process.debugPort;
var disconnectImpl = process.disconnect ? () => process.disconnect() : null;
var exitImpl = (code) => process.exit(code);
var setExitCodeImpl = (code) => {
  process.exitCode = code;
};
var pid = process.pid;
var platformStr = process.platform;
var ppid = process.ppid;
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var stdinIsTTY = process.stdinIsTTY;
var stdoutIsTTY = process.stdoutIsTTY;
var stderrIsTTY = process.stderrIsTTY;
var version = process.version;

// output-es/Node.Stream/foreign.js
var writeStringImpl = (w, str, enc) => w.write(str, enc);

// output-es/Node.Stream/index.js
var writeString = (w) => (enc) => (str) => {
  const $0 = (() => {
    if (enc === "ASCII") {
      return "ascii";
    }
    if (enc === "UTF8") {
      return "utf8";
    }
    if (enc === "UTF16LE") {
      return "utf16le";
    }
    if (enc === "UCS2") {
      return "ucs2";
    }
    if (enc === "Base64") {
      return "base64";
    }
    if (enc === "Base64Url") {
      return "base64url";
    }
    if (enc === "Latin1") {
      return "latin1";
    }
    if (enc === "Binary") {
      return "binary";
    }
    if (enc === "Hex") {
      return "hex";
    }
    fail();
  })();
  return () => writeStringImpl(w, str, $0);
};

// output-es/Data.Semigroup.Foldable/index.js
var minimum = (dictOrd) => {
  const semigroupMin = {
    append: (v) => (v1) => {
      const v$1 = dictOrd.compare(v)(v1);
      if (v$1 === "LT") {
        return v;
      }
      if (v$1 === "EQ") {
        return v;
      }
      if (v$1 === "GT") {
        return v1;
      }
      fail();
    }
  };
  return (dictFoldable1) => dictFoldable1.foldMap1(semigroupMin)(unsafeCoerce);
};

// output-es/Data.Array.NonEmpty.Internal/foreign.js
var foldl1Impl = function(f, xs) {
  var acc = xs[0];
  var len = xs.length;
  for (var i = 1; i < len; i++) {
    acc = f(acc)(xs[i]);
  }
  return acc;
};
var traverse1Impl = function() {
  function Cont(fn) {
    this.fn = fn;
  }
  var emptyList = {};
  var ConsCell = function(head, tail) {
    this.head = head;
    this.tail = tail;
  };
  function finalCell(head) {
    return new ConsCell(head, emptyList);
  }
  function consList(x) {
    return function(xs) {
      return new ConsCell(x, xs);
    };
  }
  function listToArray(list) {
    var arr = [];
    var xs = list;
    while (xs !== emptyList) {
      arr.push(xs.head);
      xs = xs.tail;
    }
    return arr;
  }
  return function(apply6, map2, f) {
    var buildFrom = function(x, ys) {
      return apply6(map2(consList)(f(x)))(ys);
    };
    var go = function(acc, currentLen, xs) {
      if (currentLen === 0) {
        return acc;
      } else {
        var last3 = xs[currentLen - 1];
        return new Cont(function() {
          var built = go(buildFrom(last3, acc), currentLen - 1, xs);
          return built;
        });
      }
    };
    return function(array) {
      var acc = map2(finalCell)(f(array[array.length - 1]));
      var result = go(acc, array.length - 1, array);
      while (result instanceof Cont) {
        result = result.fn();
      }
      return map2(listToArray)(result);
    };
  };
}();

// output-es/Data.Array.NonEmpty/index.js
var max3 = (x) => (y) => {
  const v = ordInt.compare(x)(y);
  if (v === "LT") {
    return y;
  }
  if (v === "EQ") {
    return x;
  }
  if (v === "GT") {
    return x;
  }
  fail();
};
var toArray2 = (v) => v;
var uncons4 = (x) => {
  const $0 = unconsImpl((v) => Nothing, (x$1) => (xs) => $Maybe("Just", { head: x$1, tail: xs }), x);
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};

// output-es/Control.Monad.State.Trans/index.js
var evalStateT = (dictFunctor) => (v) => (s) => dictFunctor.map(fst)(v(s));
var bindStateT = (dictMonad) => ({ bind: (v) => (f) => (s) => dictMonad.Bind1().bind(v(s))((v1) => f(v1._1)(v1._2)), Apply0: () => applyStateT(dictMonad) });
var applyStateT = (dictMonad) => {
  const $0 = dictMonad.Bind1().Apply0().Functor0();
  const functorStateT1 = { map: (f) => (v) => (s) => $0.map((v1) => $Tuple(f(v1._1), v1._2))(v(s)) };
  return {
    apply: (() => {
      const $1 = bindStateT(dictMonad);
      return (f) => (a) => $1.bind(f)((f$p) => $1.bind(a)((a$p) => applicativeStateT(dictMonad).pure(f$p(a$p))));
    })(),
    Functor0: () => functorStateT1
  };
};
var applicativeStateT = (dictMonad) => ({ pure: (a) => (s) => dictMonad.Applicative0().pure($Tuple(a, s)), Apply0: () => applyStateT(dictMonad) });
var monadStateStateT = (dictMonad) => {
  const monadStateT1 = { Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) };
  return { state: (f) => (x) => dictMonad.Applicative0().pure(f(x)), Monad0: () => monadStateT1 };
};

// output-es/Options.Applicative.Internal/index.js
var $ComplResult = (tag, _1, _2) => ({ tag, _1, _2 });
var $TStep = (tag, _1, _2) => ({ tag, _1, _2 });
var monadReaderT2 = /* @__PURE__ */ monadReaderT(monadIdentity);
var monadStateT = { Applicative0: () => applicativeStateT(monadReaderT2), Bind1: () => bindStateT(monadReaderT2) };
var apply2 = /* @__PURE__ */ (() => applyExceptT(monadStateT).apply)();
var bind2 = /* @__PURE__ */ (() => bindExceptT(monadStateT).bind)();
var pure = /* @__PURE__ */ (() => applicativeExceptT(monadStateT).pure)();
var alt = /* @__PURE__ */ (() => altExceptT(parseErrorSemigroup)(monadStateT).alt)();
var lift1 = (m) => bindStateT(monadReaderT2).bind(m)((a) => applicativeStateT(monadReaderT2).pure($Either(
  "Right",
  a
)));
var modify_ = /* @__PURE__ */ (() => {
  const $0 = monadStateStateT(monadReaderT2);
  return (f) => $0.state((s) => $Tuple(void 0, f(s)));
})();
var throwError = /* @__PURE__ */ (() => monadThrowExceptT(monadStateT).throwError)();
var identity11 = (x) => x;
var TNil = /* @__PURE__ */ $TStep("TNil");
var ComplResult = (value0) => $ComplResult("ComplResult", value0);
var runListT = (dictMonad) => (xs) => dictMonad.Bind1().bind(xs)((s) => {
  if (s.tag === "TNil") {
    return dictMonad.Applicative0().pure(Nil);
  }
  if (s.tag === "TCons") {
    const $0 = Cons(s._1);
    return dictMonad.Bind1().bind(runListT(dictMonad)(s._2))((a$p) => dictMonad.Applicative0().pure($0(a$p)));
  }
  fail();
});
var runCompletion = (v) => (prefs) => {
  const v1 = v(prefs);
  if (v1.tag === "ComplResult") {
    return Nothing;
  }
  if (v1.tag === "ComplParser") {
    return $Maybe("Just", $Either("Left", $Tuple(v1._1, v1._2)));
  }
  if (v1.tag === "ComplOption") {
    return $Maybe("Just", $Either("Right", v1._1));
  }
  fail();
};
var pFunctor = {
  map: (f) => (v) => (s) => {
    const $0 = v(s);
    return (x) => {
      const $1 = $0(x);
      return $Tuple(
        (() => {
          if ($1._1.tag === "Left") {
            return $Either("Left", $1._1._1);
          }
          if ($1._1.tag === "Right") {
            return $Either("Right", f($1._1._1));
          }
          fail();
        })(),
        $1._2
      );
    };
  }
};
var pApply = { apply: (v) => (v1) => apply2(v)(v1), Functor0: () => pFunctor };
var pBind = { bind: (v) => (k) => bind2(v)((a) => k(a)), Apply0: () => pApply };
var pApplicative = { pure: (a) => pure(a), Apply0: () => pApply };
var pMonad = { Applicative0: () => pApplicative, Bind1: () => pBind };
var pAlt = { alt: (v) => (v1) => alt(v)(v1), Functor0: () => pFunctor };
var pMonadP$lazy = /* @__PURE__ */ binding(() => ({
  enterContext: (name2) => (pinfo) => lift1(modify_(cons($Context(name2, pinfo)))),
  exitContext: lift1(modify_(drop(1))),
  getPrefs: lift1((s) => monadReaderT2.Bind1().bind(Identity)((x) => monadReaderT2.Applicative0().pure($Tuple(x, s)))),
  missingArgP: (e) => (v) => pMonadP$lazy().errorP(e),
  exitP: (i) => (v) => (p) => {
    const $0 = throwError($ParseError("MissingError", i, $SomeParser(p)));
    return (x) => {
      if (x.tag === "Nothing") {
        return $0;
      }
      if (x.tag === "Just") {
        return pure(x._1);
      }
      fail();
    };
  },
  errorP: (x) => throwError(x),
  Monad0: () => pMonad,
  Alt1: () => pAlt
}));
var pMonadP = /* @__PURE__ */ pMonadP$lazy();
var complResultMonad = { Applicative0: () => complResultApplicative, Bind1: () => complResultBind };
var complResultFunctor = { map: (f) => (a) => complResultBind.bind(a)((a$p) => complResultApplicative.pure(f(a$p))) };
var complResultBind = {
  bind: (m) => (f) => {
    if (m.tag === "ComplResult") {
      return f(m._1);
    }
    if (m.tag === "ComplParser") {
      return $ComplResult("ComplParser", m._1, m._2);
    }
    if (m.tag === "ComplOption") {
      return $ComplResult("ComplOption", m._1);
    }
    fail();
  },
  Apply0: () => complResultApply
};
var complResultApply = {
  apply: (f) => (a) => {
    if (f.tag === "ComplResult") {
      if (a.tag === "ComplResult") {
        return complResultApplicative.pure(f._1(a._1));
      }
      if (a.tag === "ComplParser") {
        return $ComplResult("ComplParser", a._1, a._2);
      }
      if (a.tag === "ComplOption") {
        return $ComplResult("ComplOption", a._1);
      }
      fail();
    }
    if (f.tag === "ComplParser") {
      return $ComplResult("ComplParser", f._1, f._2);
    }
    if (f.tag === "ComplOption") {
      return $ComplResult("ComplOption", f._1);
    }
    fail();
  },
  Functor0: () => complResultFunctor
};
var complResultApplicative = { pure: ComplResult, Apply0: () => complResultApply };
var monadReaderT1 = /* @__PURE__ */ monadReaderT(complResultMonad);
var alt1 = /* @__PURE__ */ (() => altExceptT(parseErrorSemigroup)(monadReaderT1).alt)();
var apply1 = /* @__PURE__ */ (() => applyExceptT(monadReaderT1).apply)();
var pure2 = /* @__PURE__ */ (() => applicativeExceptT(monadReaderT1).pure)();
var bind1 = /* @__PURE__ */ (() => bindExceptT(monadReaderT1).bind)();
var lift3 = (m) => monadReaderT1.Bind1().bind(m)((a) => monadReaderT1.Applicative0().pure($Either("Right", a)));
var completionFunctor = {
  map: (f) => (v) => (x) => {
    const $0 = v(x);
    if ($0.tag === "ComplResult") {
      return $ComplResult(
        "ComplResult",
        (() => {
          if ($0._1.tag === "Left") {
            return $Either("Left", $0._1._1);
          }
          if ($0._1.tag === "Right") {
            return $Either("Right", f($0._1._1));
          }
          fail();
        })()
      );
    }
    if ($0.tag === "ComplParser") {
      return $ComplResult("ComplParser", $0._1, $0._2);
    }
    if ($0.tag === "ComplOption") {
      return $ComplResult("ComplOption", $0._1);
    }
    fail();
  }
};
var completionAlt = { alt: (v) => (v1) => alt1(v)(v1), Functor0: () => completionFunctor };
var completionApply = { apply: (v) => (v1) => apply1(v)(v1), Functor0: () => completionFunctor };
var completionApplicative = { pure: (a) => pure2(a), Apply0: () => completionApply };
var completionBind = { bind: (v) => (k) => bind1(v)((a) => k(a)), Apply0: () => completionApply };
var completionMonad = { Applicative0: () => completionApplicative, Bind1: () => completionBind };
var completionMonadP = {
  enterContext: (v) => (v1) => pure2(),
  exitContext: /* @__PURE__ */ pure2(),
  getPrefs: /* @__PURE__ */ lift3(ComplResult),
  missingArgP: (v) => (x) => lift3((v$1) => $ComplResult("ComplOption", x)),
  exitP: (v) => (a) => (p) => (v1) => lift3((v$1) => $ComplResult("ComplParser", $SomeParser(p), a)),
  errorP: (x) => monadThrowExceptT(monadReaderT1).throwError(x),
  Monad0: () => completionMonad,
  Alt1: () => completionAlt
};
var bimapTStep = (v) => (v1) => (v2) => {
  if (v2.tag === "TNil") {
    return TNil;
  }
  if (v2.tag === "TCons") {
    return $TStep("TCons", v(v2._1), v1(v2._2));
  }
  fail();
};
var listTFunctor = (dictMonad) => ({
  map: (f) => (v) => {
    const $0 = bimapTStep(f)(listTFunctor(dictMonad).map(f));
    return dictMonad.Bind1().bind(v)((a$p) => dictMonad.Applicative0().pure($0(a$p)));
  }
});
var listTAlt = (dictMonad) => {
  const listTFunctor1 = listTFunctor(dictMonad);
  return {
    alt: (xs) => (ys) => dictMonad.Bind1().bind(xs)((s) => {
      if (s.tag === "TNil") {
        return ys;
      }
      if (s.tag === "TCons") {
        return dictMonad.Applicative0().pure($TStep("TCons", s._1, listTAlt(dictMonad).alt(s._2)(ys)));
      }
      fail();
    }),
    Functor0: () => listTFunctor1
  };
};
var listTPlus = (dictMonad) => {
  const listTAlt1 = listTAlt(dictMonad);
  return { empty: dictMonad.Applicative0().pure(TNil), Alt0: () => listTAlt1 };
};
var hoistList = (dictMonad) => foldrArray((x) => (xt) => dictMonad.Applicative0().pure($TStep("TCons", x, xt)))(listTPlus(dictMonad).empty);
var listTMonadTrans = {
  lift: (dictMonad) => {
    const empty3 = listTPlus(dictMonad).empty;
    return (x) => dictMonad.Bind1().bind(x)((a$p) => dictMonad.Applicative0().pure($TStep("TCons", a$p, empty3)));
  }
};
var cut = (dictMonad) => listTMonadTrans.lift({
  Applicative0: () => applicativeStateT(dictMonad),
  Bind1: () => bindStateT(dictMonad)
})(monadStateStateT(dictMonad).state((v) => $Tuple(void 0, true)));
var nondetTMonadTrans = {
  lift: (dictMonad) => {
    const $0 = listTMonadTrans.lift({ Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) });
    return (x) => $0((s) => dictMonad.Bind1().bind(x)((x$1) => dictMonad.Applicative0().pure($Tuple(x$1, s))));
  }
};
var listTBind = (dictMonad) => ({
  bind: (xs) => (f) => dictMonad.Bind1().bind(xs)((s) => {
    if (s.tag === "TNil") {
      return dictMonad.Applicative0().pure(TNil);
    }
    if (s.tag === "TCons") {
      return listTAlt(dictMonad).alt(f(s._1))(listTBind(dictMonad).bind(s._2)(f));
    }
    fail();
  }),
  Apply0: () => listTApply(dictMonad)
});
var listTApply = (dictMonad) => {
  const listTFunctor1 = listTFunctor(dictMonad);
  return {
    apply: (() => {
      const $0 = listTBind(dictMonad);
      return (f) => (a) => $0.bind(f)((f$p) => $0.bind(a)((a$p) => listTApplicative(dictMonad).pure(f$p(a$p))));
    })(),
    Functor0: () => listTFunctor1
  };
};
var listTApplicative = (dictMonad) => ({
  pure: (() => {
    const $0 = hoistList(dictMonad);
    return (x) => $0([x]);
  })(),
  Apply0: () => listTApply(dictMonad)
});
var listTAlternative = (dictMonad) => {
  const listTApplicative1 = listTApplicative(dictMonad);
  const listTPlus1 = listTPlus(dictMonad);
  return { Applicative0: () => listTApplicative1, Plus1: () => listTPlus1 };
};
var nondetTAltOp = (dictMonad) => {
  const monadStateT1 = { Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) };
  const listTBind1 = listTBind(monadStateT1);
  const lift6 = listTMonadTrans.lift(monadStateT1);
  const $$get = monadStateStateT(dictMonad).state((s) => $Tuple(s, s));
  const $0 = listTAlternative(monadStateT1);
  const empty3 = $0.Plus1().empty;
  return (m1) => (m2) => listTAlt(monadStateT1).alt(m1)(listTBind1.bind(lift6($$get))((s) => listTBind1.bind(!s ? $0.Applicative0().pure() : empty3)(() => m2)));
};
var nondetTFunctor = (dictMonad) => ({ map: (f) => listTFunctor({ Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) }).map(f) });
var nondetTAlt = (dictMonad) => {
  const nondetTFunctor1 = nondetTFunctor(dictMonad);
  return {
    alt: (v) => (v1) => listTAlt({ Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) }).alt(v)(v1),
    Functor0: () => nondetTFunctor1
  };
};
var nondetTPlus = (dictMonad) => {
  const nondetTAlt1 = nondetTAlt(dictMonad);
  return {
    empty: listTPlus({ Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) }).empty,
    Alt0: () => nondetTAlt1
  };
};
var nondetTApply = (dictMonad) => {
  const nondetTFunctor1 = nondetTFunctor(dictMonad);
  return {
    apply: (v) => (v1) => listTApply({ Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) }).apply(v)(v1),
    Functor0: () => nondetTFunctor1
  };
};
var nondetTApplicative = (dictMonad) => {
  const nondetTApply1 = nondetTApply(dictMonad);
  return {
    pure: (x) => listTApplicative({ Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) }).pure(x),
    Apply0: () => nondetTApply1
  };
};
var nondetTBind = (dictMonad) => {
  const nondetTApply1 = nondetTApply(dictMonad);
  return {
    bind: (v) => (f) => listTBind({ Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) }).bind(v)((x) => f(x)),
    Apply0: () => nondetTApply1
  };
};
var takeListT = (dictMonad) => {
  const empty3 = listTPlus(dictMonad).empty;
  return (v) => {
    if (v === 0) {
      return (v$1) => empty3;
    }
    const $0 = bimapTStep(identity11)(takeListT(dictMonad)(v - 1 | 0));
    return (x) => dictMonad.Bind1().bind(x)((a$p) => dictMonad.Applicative0().pure($0(a$p)));
  };
};
var disamb = (dictMonad) => {
  const Bind1 = dictMonad.Bind1();
  const evalStateT2 = evalStateT(Bind1.Apply0().Functor0());
  const monadStateT1 = { Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) };
  const takeListT1 = takeListT(monadStateT1);
  return (allow_amb) => (xs) => Bind1.bind(evalStateT2(runListT(monadStateT1)(takeListT1(allow_amb ? 1 : 2)(xs)))(false))((xs$p) => dictMonad.Applicative0().pure(xs$p.tag === "Cons" && xs$p._2.tag === "Nil" ? $Maybe("Just", xs$p._1) : Nothing));
};

// output-es/Options.Applicative.Common/index.js
var $OptWord = (_1, _2) => ({ tag: "OptWord", _1, _2 });
var any = /* @__PURE__ */ (() => foldableArray.foldMap((() => {
  const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
  return { mempty: false, Semigroup0: () => semigroupDisj1 };
})()))();
var elem2 = /* @__PURE__ */ (() => {
  const any1 = foldableArray.foldMap((() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })());
  return (x) => any1((y) => {
    if (x.tag === "OptShort") {
      return y.tag === "OptShort" && x._1 === y._1;
    }
    return x.tag === "OptLong" && y.tag === "OptLong" && x._1 === y._1;
  });
})();
var simplify = (v) => {
  if (v.tag === "Leaf") {
    return $OptTree("Leaf", v._1);
  }
  if (v.tag === "MultNode") {
    const v1 = arrayBind(v._1)((x) => {
      const $0 = simplify(x);
      if ($0.tag === "MultNode") {
        return $0._1;
      }
      return [$0];
    });
    if (v1.length === 1) {
      return v1[0];
    }
    return $OptTree("MultNode", v1);
  }
  if (v.tag === "AltNode") {
    const v1 = arrayBind(v._1)((x) => {
      const $0 = simplify(x);
      if ($0.tag === "AltNode") {
        return $0._1;
      }
      if ($0.tag === "MultNode" && $0._1.length === 0) {
        return [];
      }
      return [$0];
    });
    if (v1.length === 0) {
      return $OptTree("MultNode", []);
    }
    if (v1.length === 1) {
      return v1[0];
    }
    return $OptTree("AltNode", v1);
  }
  fail();
};
var showOption = (v) => {
  if (v.tag === "OptLong") {
    return "--" + v._1;
  }
  if (v.tag === "OptShort") {
    return fromCharArray(["-", v._1]);
  }
  fail();
};
var parseWord = /* @__PURE__ */ (() => {
  const $0 = foldrArray(Cons)(Nil);
  return (x) => {
    const $1 = $0(toCharArray(x));
    if ($1.tag === "Cons" && $1._1 === "-") {
      if ($1._2.tag === "Cons" && $1._2._1 === "-") {
        return $Maybe(
          "Just",
          (() => {
            const v2 = span((v3) => v3 !== "=")($1._2._2);
            if (v2.rest.tag === "Nil") {
              return $OptWord(
                $OptName("OptLong", fromCharArray(fromFoldableImpl(foldableList.foldr, $1._2._2))),
                Nothing
              );
            }
            if (v2.rest.tag === "Cons") {
              return $OptWord(
                $OptName("OptLong", fromCharArray(fromFoldableImpl(foldableList.foldr, v2.init))),
                $Maybe("Just", fromCharArray(fromFoldableImpl(foldableList.foldr, v2.rest._2)))
              );
            }
            fail();
          })()
        );
      }
      if ($1._2.tag === "Nil") {
        return Nothing;
      }
      if ($1._2.tag === "Cons") {
        return $Maybe(
          "Just",
          $OptWord(
            $OptName("OptShort", $1._2._1),
            $1._2._2.tag !== "Nil" ? $Maybe("Just", fromCharArray(fromFoldableImpl(foldableList.foldr, $1._2._2))) : Nothing
          )
        );
      }
      fail();
    }
    return Nothing;
  };
})();
var isOptionPrefix = (v) => (v1) => {
  if (v.tag === "OptShort") {
    return v1.tag === "OptShort" && v._1 === v1._1;
  }
  return v.tag === "OptLong" && v1.tag === "OptLong" && startsWith(v._1)(v1._1);
};
var optMatches = (dictMonadP) => {
  const Monad0 = dictMonadP.Monad0();
  const bindStateT2 = bindStateT(Monad0);
  const monadStateStateT2 = monadStateStateT(Monad0);
  const $$get = monadStateStateT2.state((s) => $Tuple(s, s));
  const $0 = applicativeStateT(Monad0);
  const $1 = dictMonadP.Monad0().Applicative0().pure;
  return (disambiguate) => (opt) => (v) => {
    if (opt.tag === "OptReader") {
      const $2 = (disambiguate ? any(isOptionPrefix(v._1))(opt._1) : elem2(v._1)(opt._1)) ? $Maybe("Just", void 0) : Nothing;
      if ($2.tag === "Just") {
        return $Maybe(
          "Just",
          bindStateT2.bind($$get)((args) => {
            const missing_arg = dictMonadP.missingArgP(opt._3(showOption(v._1)))(opt._2.crCompleter);
            return bindStateT2.bind((() => {
              if (v._2.tag === "Nothing") {
                if (args.tag === "Nil") {
                  return (s) => Monad0.Bind1().bind(missing_arg)((x) => Monad0.Applicative0().pure($Tuple(x, s)));
                }
                if (args.tag === "Cons") {
                  return $0.pure($Tuple(args._1, args._2));
                }
                fail();
              }
              if (v._2.tag === "Just") {
                return $0.pure($Tuple(v._2._1, args));
              }
              fail();
            })())((v1) => {
              const $3 = v1._1;
              const $4 = v1._2;
              return bindStateT2.bind(monadStateStateT2.state((v$1) => $Tuple(void 0, $4)))(() => {
                const $5 = opt._2.crReader($3);
                if ($5.tag === "Right") {
                  const $6 = $1($5._1);
                  return (s) => Monad0.Bind1().bind($6)((x) => Monad0.Applicative0().pure($Tuple(x, s)));
                }
                if ($5.tag === "Left") {
                  const $6 = dictMonadP.errorP($5._1.tag === "ErrorMsg" ? $ParseError("ErrorMsg", "option " + showOption(v._1) + ": " + $5._1._1) : $5._1);
                  return (s) => Monad0.Bind1().bind($6)((x) => Monad0.Applicative0().pure($Tuple(x, s)));
                }
                fail();
              });
            });
          })
        );
      }
      if ($2.tag === "Nothing") {
        return Nothing;
      }
      fail();
    }
    if (opt.tag === "FlagReader" && (disambiguate ? any(isOptionPrefix(v._1))(opt._1) : elem2(v._1)(opt._1)) && ((() => {
      if (v._1.tag === "OptShort") {
        return true;
      }
      if (v._1.tag === "OptLong") {
        return false;
      }
      fail();
    })() || (() => {
      if (v._2.tag === "Nothing") {
        return true;
      }
      if (v._2.tag === "Just") {
        return false;
      }
      fail();
    })())) {
      return $Maybe(
        "Just",
        bindStateT2.bind($$get)((args) => bindStateT2.bind((() => {
          if (v._2.tag === "Just") {
            const $2 = $List("Cons", fromCharArray(["-", ...toCharArray(v._2._1)]), args);
            return monadStateStateT2.state((v$1) => $Tuple(void 0, $2));
          }
          return monadStateStateT2.state((v$1) => $Tuple(void 0, args));
        })())(() => $0.pure(opt._2)))
      );
    }
    return Nothing;
  };
};
var evalParser = (v) => {
  if (v.tag === "NilP") {
    return $Maybe("Just", v._1);
  }
  if (v.tag === "OptP") {
    return Nothing;
  }
  if (v.tag === "MultP") {
    return applyMaybe.apply(evalParser(v._1._1))(evalParser(v._1._2));
  }
  if (v.tag === "AltP") {
    const $0 = evalParser(v._1);
    const $1 = evalParser(v._2);
    if ($0.tag === "Nothing") {
      return $1;
    }
    return $0;
  }
  if (v.tag === "BindP") {
    return resume$p((p) => (k) => {
      const $0 = evalParser(p);
      if ($0.tag === "Just") {
        return evalParser($Parser("BindP", k($0._1)));
      }
      if ($0.tag === "Nothing") {
        return Nothing;
      }
      fail();
    })(Just)(v._1);
  }
  fail();
};
var searchParser = (dictMonad) => {
  const nondetTPlus2 = nondetTPlus(dictMonad);
  const empty3 = nondetTPlus2.empty;
  const $0 = nondetTFunctor(dictMonad);
  const nondetTAltOp2 = nondetTAltOp(dictMonad);
  const oneOf1 = foldrArray(nondetTPlus2.Alt0().alt)(nondetTPlus2.empty);
  return (v) => (v1) => {
    if (v1.tag === "NilP") {
      return empty3;
    }
    if (v1.tag === "OptP") {
      return v(v1._1);
    }
    if (v1.tag === "MultP") {
      const $1 = v1._1._1;
      const $2 = v1._1._2;
      return nondetTAltOp2($0.map((p1$p) => $Parser("MultP", $MultPE(p1$p, $2)))(searchParser(dictMonad)(v)($1)))($0.map((p2$p) => $Parser(
        "MultP",
        $MultPE($1, p2$p)
      ))(searchParser(dictMonad)(v)($2)));
    }
    if (v1.tag === "AltP") {
      return oneOf1([searchParser(dictMonad)(v)(v1._1), searchParser(dictMonad)(v)(v1._2)]);
    }
    if (v1.tag === "BindP") {
      return resume$p((p) => (k) => oneOf1([
        $0.map((p$p) => $Parser(
          "BindP",
          $Free(
            $FreeView("Bind", p$p, (x) => $Free($FreeView("Return", x), CatNil)),
            snoc2(CatNil)(k)
          )
        ))(searchParser(dictMonad)(v)(p)),
        (() => {
          const v2 = evalParser(p);
          if (v2.tag === "Nothing") {
            return empty3;
          }
          if (v2.tag === "Just") {
            return searchParser(dictMonad)(v)($Parser("BindP", k(v2._1)));
          }
          fail();
        })()
      ]))((v$1) => empty3)(v1._1);
    }
    fail();
  };
};
var searchOpt = (dictMonadP) => {
  const $0 = dictMonadP.Monad0();
  const monadStateT2 = { Applicative0: () => applicativeStateT($0), Bind1: () => bindStateT($0) };
  const searchParser1 = searchParser(monadStateT2);
  const optMatches1 = optMatches(dictMonadP);
  const lift2 = nondetTMonadTrans.lift(monadStateT2);
  const $1 = dictMonadP.Alt1().Functor0();
  const empty3 = nondetTPlus(monadStateT2).empty;
  return (pprefs) => (w) => searchParser1((opt) => {
    const v = optMatches1(pprefs.prefDisambiguate && optVisibilityOrd.compare(opt.optProps.propVisibility)(Internal) === "GT")(opt.optMain)(w);
    if (v.tag === "Just") {
      return lift2((s) => $1.map((v1) => $Tuple($Parser("NilP", v1._1), v1._2))(v._1(s)));
    }
    if (v.tag === "Nothing") {
      return empty3;
    }
    fail();
  });
};
var stepParser = (dictMonadP) => {
  const searchOpt1 = searchOpt(dictMonadP);
  return (v) => (v1) => (v2) => (v3) => {
    if (v1 === "AllPositionals") {
      return searchArg(dictMonadP)(v)(v2)(v3);
    }
    if (v1 === "ForwardOptions") {
      const v42 = parseWord(v2);
      if (v42.tag === "Just") {
        return nondetTAlt((() => {
          const $0 = dictMonadP.Monad0();
          return { Applicative0: () => applicativeStateT($0), Bind1: () => bindStateT($0) };
        })()).alt(searchOpt1(v)(v42._1)(v3))(searchArg(dictMonadP)(v)(v2)(v3));
      }
      if (v42.tag === "Nothing") {
        return searchArg(dictMonadP)(v)(v2)(v3);
      }
      fail();
    }
    const v4 = parseWord(v2);
    if (v4.tag === "Just") {
      return searchOpt1(v)(v4._1)(v3);
    }
    if (v4.tag === "Nothing") {
      return searchArg(dictMonadP)(v)(v2)(v3);
    }
    fail();
  };
};
var searchArg = (dictMonadP) => {
  const Monad0 = dictMonadP.Monad0();
  const monadStateT2 = { Applicative0: () => applicativeStateT(Monad0), Bind1: () => bindStateT(Monad0) };
  const searchParser1 = searchParser(monadStateT2);
  const $0 = nondetTApplicative(monadStateT2);
  const cut2 = cut(monadStateT2);
  const lift2 = nondetTMonadTrans.lift(monadStateT2);
  const bindStateT2 = bindStateT(Monad0);
  const $1 = applyStateT(Monad0);
  const monadStateStateT2 = monadStateStateT(Monad0);
  const $$get = monadStateStateT2.state((s) => $Tuple(s, s));
  const $2 = dictMonadP.Alt1().Functor0();
  const Apply0 = Monad0.Bind1().Apply0();
  const exitContext = dictMonadP.exitContext;
  const $3 = nondetTFunctor(monadStateT2);
  const empty3 = nondetTPlus(monadStateT2).empty;
  const $4 = dictMonadP.Monad0().Applicative0().pure;
  return (prefs) => (arg) => searchParser1((opt) => nondetTBind(monadStateT2).bind(opt.optMain.tag === "ArgReader" ? cut2 : $0.pure())(() => {
    if (opt.optMain.tag === "CmdReader") {
      const $5 = opt.optMain._3(arg);
      if ($5.tag === "Just") {
        if (prefs.prefBacktrack === "NoBacktrack") {
          const $6 = $5._1;
          return lift2(bindStateT2.bind($1.apply($1.Functor0().map($$const)($$get))(monadStateStateT2.state((v) => $Tuple(void 0, Nil))))((args) => {
            const $7 = Apply0.apply(Apply0.Functor0().map($$const)(Apply0.apply(Apply0.Functor0().map((v) => identity)(dictMonadP.enterContext(arg)($6)))(runParserInfo(dictMonadP)($6)(args))))(exitContext);
            return (s) => $2.map((v1) => $Tuple($Parser("NilP", v1._1), v1._2))(Monad0.Bind1().bind($7)((x) => Monad0.Applicative0().pure($Tuple(
              x,
              s
            ))));
          }));
        }
        if (prefs.prefBacktrack === "Backtrack") {
          const $6 = $5._1;
          return $3.map(NilP)(lift2((args) => Apply0.apply(Apply0.Functor0().map($$const)(Apply0.apply(Apply0.Functor0().map((v) => identity)(dictMonadP.enterContext(arg)($6)))(runParser(dictMonadP)($6.infoPolicy)(CmdStart)($6.infoParser)(args))))(exitContext)));
        }
        if (prefs.prefBacktrack === "SubparserInline") {
          const $6 = $5._1;
          return lift2(bindStateT2.bind((() => {
            const $7 = dictMonadP.enterContext(arg)($6);
            return (s) => Monad0.Bind1().bind($7)((x) => Monad0.Applicative0().pure($Tuple(x, s)));
          })())(() => applicativeStateT(Monad0).pure($6.infoParser)));
        }
        fail();
      }
      if ($5.tag === "Nothing") {
        return empty3;
      }
      fail();
    }
    if (opt.optMain.tag === "ArgReader") {
      const $5 = opt.optMain._1.crReader(arg);
      const $6 = (() => {
        if ($5.tag === "Left") {
          return dictMonadP.errorP($5._1);
        }
        if ($5.tag === "Right") {
          return $4($5._1);
        }
        fail();
      })();
      return $3.map(NilP)(lift2((s) => Monad0.Bind1().bind($6)((x) => Monad0.Applicative0().pure($Tuple(x, s)))));
    }
    return empty3;
  }));
};
var runParserInfo = (dictMonadP) => (i) => runParserFully(dictMonadP)(i.infoPolicy)(i.infoParser);
var runParserFully = (dictMonadP) => {
  const Monad0 = dictMonadP.Monad0();
  return (policy) => (p) => (args) => Monad0.Bind1().bind(runParser(dictMonadP)(policy)(CmdStart)(p)(args))((v) => {
    if (v._2.tag === "Nil") {
      return Monad0.Applicative0().pure(v._1);
    }
    if (v._2.tag === "Cons") {
      return dictMonadP.errorP($ParseError(
        "UnexpectedError",
        v._2._1,
        $SomeParser($Parser("NilP", void 0))
      ));
    }
    fail();
  });
};
var runParser = (dictMonadP) => {
  const Monad0 = dictMonadP.Monad0();
  const disamb2 = disamb({
    Applicative0: () => applicativeStateT(Monad0),
    Bind1: () => bindStateT(Monad0)
  });
  const $0 = Monad0.Bind1();
  const getPrefs = dictMonadP.getPrefs;
  const pure4 = dictMonadP.Monad0().Applicative0().pure;
  return (policy) => (isCmdStart) => (p) => (args) => {
    const result = applyMaybe.apply((() => {
      const $1 = evalParser(p);
      if ($1.tag === "Just") {
        return $Maybe("Just", Tuple($1._1));
      }
      return Nothing;
    })())($Maybe("Just", args));
    if (args.tag === "Nil") {
      return dictMonadP.exitP(isCmdStart)(policy)(p)(result);
    }
    if (args.tag === "Cons") {
      if (args._1 === "--" && (policy === "Intersperse" || policy === "NoIntersperse" || policy !== "AllPositionals")) {
        return runParser(dictMonadP)(AllPositionals)(CmdCont)(p)(args._2);
      }
      const $1 = args._1;
      const $2 = args._2;
      return $0.bind(getPrefs)((prefs) => $0.bind(disamb2(!prefs.prefDisambiguate)(stepParser(dictMonadP)(prefs)(policy)($1)(p))($2))((v) => {
        if (v._1.tag === "Nothing") {
          const $3 = dictMonadP.errorP($ParseError("UnexpectedError", $1, $SomeParser(p)));
          if (result.tag === "Nothing") {
            return $3;
          }
          if (result.tag === "Just") {
            return pure4(result._1);
          }
          fail();
        }
        if (v._1.tag === "Just") {
          return runParser(dictMonadP)((() => {
            if (policy === "NoIntersperse") {
              if ((() => {
                const $3 = parseWord($1);
                if ($3.tag === "Nothing") {
                  return false;
                }
                if ($3.tag === "Just") {
                  return true;
                }
                fail();
              })()) {
                return NoIntersperse;
              }
              return AllPositionals;
            }
            return policy;
          })())(CmdCont)(v._1._1)(v._2);
        }
        fail();
      }));
    }
    fail();
  };
};
var treeMapParser = (g) => {
  const hasArg = (v) => {
    if (v.tag === "NilP") {
      return false;
    }
    if (v.tag === "OptP") {
      return v._1.optMain.tag === "ArgReader";
    }
    if (v.tag === "MultP") {
      return hasArg(v._1._1) || hasArg(v._1._2);
    }
    if (v.tag === "AltP") {
      return hasArg(v._1) || hasArg(v._2);
    }
    if (v.tag === "BindP") {
      return resume$p((p) => (v1) => hasArg(p))((v$1) => false)(v._1);
    }
    fail();
  };
  const go = (v) => (v1) => (v2) => (v3) => (v4) => {
    if (v4.tag === "NilP") {
      return $OptTree("MultNode", []);
    }
    if (v4.tag === "OptP") {
      if (optVisibilityOrd.compare(v4._1.optProps.propVisibility)(Internal) === "GT") {
        return $OptTree("Leaf", v3({ hinfoMulti: v, hinfoDefault: v1, hinfoUnreachableArgs: v2 })(v4._1));
      }
      return $OptTree("MultNode", []);
    }
    if (v4.tag === "MultP") {
      return $OptTree("MultNode", [go(v)(v1)(v2)(v3)(v4._1._1), go(v)(v1)(v2 || hasArg(v4._1._1))(v3)(v4._1._2)]);
    }
    if (v4.tag === "AltP") {
      const $02 = evalParser(v4._1);
      const d$p = v1 || (() => {
        const $1 = evalParser(v4._2);
        return (() => {
          if ($02.tag === "Nothing") {
            return false;
          }
          if ($02.tag === "Just") {
            return true;
          }
          fail();
        })() || (() => {
          if ($1.tag === "Nothing") {
            return false;
          }
          if ($1.tag === "Just") {
            return true;
          }
          fail();
        })();
      })();
      return $OptTree("AltNode", [go(v)(d$p)(v2)(v3)(v4._1), go(v)(d$p)(v2)(v3)(v4._2)]);
    }
    if (v4.tag === "BindP") {
      return resume$p((p) => (k) => {
        const go$p = go(true)(v1)(v2)(v3)(p);
        const v5 = evalParser(p);
        if (v5.tag === "Nothing") {
          return go$p;
        }
        if (v5.tag === "Just") {
          return $OptTree("MultNode", [go$p, go(true)(v1)(v2)(v3)($Parser("BindP", k(v5._1)))]);
        }
        fail();
      })((v$1) => $OptTree("MultNode", []))(v4._1);
    }
    fail();
  };
  const $0 = go(false)(false)(false)(g);
  return (x) => simplify($0(x));
};
var mapParser = (f) => {
  const flatten2 = (v) => {
    if (v.tag === "Leaf") {
      return [v._1];
    }
    if (v.tag === "MultNode") {
      return arrayBind(v._1)(flatten2);
    }
    if (v.tag === "AltNode") {
      return arrayBind(v._1)(flatten2);
    }
    fail();
  };
  const $0 = treeMapParser(f);
  return (x) => flatten2($0(x));
};

// output-es/Options.Applicative.BashCompletion/index.js
var $Richness = (tag, _1, _2) => ({ tag, _1, _2 });
var fromFoldable = /* @__PURE__ */ foldrArray(Cons)(Nil);
var identity12 = (x) => x;
var fold2 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidArray)(identity2))();
var sequence = /* @__PURE__ */ (() => traversableArray.traverse(applicativeEffect)(identity3))();
var unLines = (xs) => foldlArray((v) => (v1) => {
  if (v.init) {
    return { init: false, acc: v1 };
  }
  return { init: false, acc: v.acc + "\n" + v1 };
})({ init: true, acc: "" })(xs).acc;
var fromFoldable1 = ($0) => fromFoldableImpl(foldableList.foldr, $0);
var Standard = /* @__PURE__ */ $Richness("Standard");
var Enriched = (value0) => (value12) => $Richness("Enriched", value0, value12);
var zshCompletionScript = (prog) => (progn) => {
  const $0 = [
    "#compdef " + progn,
    "",
    "local request",
    "local completions",
    "local word",
    "local index=$((CURRENT - 1))",
    "",
    "request=(--bash-completion-enriched --bash-completion-index $index)",
    "for arg in ${words[@]}; do",
    "  request=(${request[@]} --bash-completion-word $arg)",
    "done",
    "",
    "IFS=$'\\n' completions=($( " + prog + ' "${request[@]}" ))',
    "",
    "for word in $completions; do",
    "  local -a parts",
    "",
    "  # Split the line at a tab if there is one.",
    "  IFS=$'\\t' parts=($( echo $word ))",
    "",
    "  if [[ -n $parts[2] ]]; then",
    '     if [[ $word[1] == "-" ]]; then',
    '       local desc=("$parts[1] ($parts[2])")',
    "       compadd -d desc -- $parts[1]",
    "     else",
    '       local desc=($(print -f  "%-019s -- %s" $parts[1] $parts[2]))',
    "       compadd -l -d desc -- $parts[1]",
    "     fi",
    "  else",
    "    compadd -f -- $word",
    "  fi",
    "done"
  ];
  return () => $0;
};
var fishCompletionScript = (prog) => (progn) => {
  const $0 = [
    " function _" + progn,
    "    set -l cl (commandline --tokenize --current-process)",
    "    # Hack around fish issue #3934",
    "    set -l cn (commandline --tokenize --cut-at-cursor --current-process)",
    "    set -l cn (count $cn)",
    "    set -l tmpline --bash-completion-enriched --bash-completion-index $cn",
    "    for arg in $cl",
    "      set tmpline $tmpline --bash-completion-word $arg",
    "    end",
    "    for opt in (" + prog + " $tmpline)",
    "      if test -d $opt",
    '        echo -E "$opt/"',
    "      else",
    '        echo -E "$opt"',
    "      end",
    "    end",
    "end",
    "",
    "complete --no-files --command " + progn + " --arguments '(_" + progn + ")'"
  ];
  return () => $0;
};
var bashCompletionScript = (prog) => (progn) => {
  const $0 = [
    "_" + progn + "()",
    "{",
    "    local CMDLINE",
    "    local IFS=$'\\n'",
    "    CMDLINE=(--bash-completion-index $COMP_CWORD)",
    "",
    "    for arg in ${COMP_WORDS[@]}; do",
    "        CMDLINE=(${CMDLINE[@]} --bash-completion-word $arg)",
    "    done",
    "",
    "    COMPREPLY=( $(" + prog + ' "${CMDLINE[@]}") )',
    "}",
    "",
    "complete -o filenames -F _" + progn + " " + progn
  ];
  return () => $0;
};
var arraySplitAt = (idx) => (arr) => {
  if (idx === 0) {
    return { init: [], rest: arr };
  }
  return { init: sliceImpl(0, idx, arr), rest: sliceImpl(idx, arr.length, arr) };
};
var bashCompletionQuery = (pinfo) => (pprefs) => (richness) => (ws) => (i) => (v) => {
  const v1 = arraySplitAt(i)(ws);
  const v2 = 0 < v1.rest.length ? $Maybe("Just", v1.rest[0]) : Nothing;
  const is_completion = (() => {
    if (v2.tag === "Just") {
      return startsWith(v2._1);
    }
    if (v2.tag === "Nothing") {
      return (v$1) => true;
    }
    fail();
  })();
  const $0 = arrayMap(showOption);
  const add_opt_help1 = (opt) => {
    if (richness.tag === "Standard") {
      return identity12;
    }
    if (richness.tag === "Enriched") {
      const $1 = richness._1;
      return arrayMap((o) => {
        if (opt.optProps.propHelp.tag === "Nothing") {
          return o;
        }
        if (opt.optProps.propHelp.tag === "Just") {
          const $2 = displayS(renderFits(fits1)(1)($1)(opt.optProps.propHelp._1));
          const $3 = $2 === "" ? [] : split("\n")($2);
          return o + "	" + (() => {
            if ($3.length > 0) {
              const $4 = uncons4($3);
              if ($4.tail.length === 0) {
                return $4.head;
              }
              return $4.head + "...";
            }
            return "";
          })();
        }
        fail();
      });
    }
    fail();
  };
  const v2$1 = runCompletion(runParserFully(completionMonadP)(pinfo.infoPolicy)(pinfo.infoParser)(fromFoldable(sliceImpl(
    1,
    v1.init.length,
    v1.init
  ))))(pprefs);
  if (v2$1.tag === "Just") {
    if (v2$1._1.tag === "Left") {
      const $1 = v2$1._1._1._2;
      const $2 = sequence(mapParser((hinfo) => (opt) => {
        if (opt.optMain.tag === "OptReader") {
          if ($1 === "Intersperse" || $1 === "NoIntersperse" || $1 !== "AllPositionals") {
            const $22 = add_opt_help1(opt)(filterImpl(is_completion, $0(opt.optMain._1)));
            return () => $22;
          }
          return () => [];
        }
        if (opt.optMain.tag === "FlagReader") {
          if ($1 === "Intersperse" || $1 === "NoIntersperse" || $1 !== "AllPositionals") {
            const $22 = add_opt_help1(opt)(filterImpl(is_completion, $0(opt.optMain._1)));
            return () => $22;
          }
          return () => [];
        }
        if (opt.optMain.tag === "ArgReader") {
          if (hinfo.hinfoUnreachableArgs) {
            return () => [];
          }
          return opt.optMain._1.crCompleter(0 < v1.rest.length ? v1.rest[0] : "");
        }
        if (opt.optMain.tag === "CmdReader") {
          if (hinfo.hinfoUnreachableArgs) {
            return () => [];
          }
          const $22 = (() => {
            if (richness.tag === "Standard") {
              return identity12;
            }
            if (richness.tag === "Enriched") {
              const $23 = richness._2;
              return arrayMap((cmd) => {
                const $3 = opt.optMain._3(cmd);
                const $4 = (() => {
                  if ($3.tag === "Just") {
                    return $3._1.infoProgDesc;
                  }
                  if ($3.tag === "Nothing") {
                    return Nothing;
                  }
                  fail();
                })();
                if ($4.tag === "Nothing") {
                  return cmd;
                }
                if ($4.tag === "Just") {
                  const $5 = displayS(renderFits(fits1)(1)($23)($4._1));
                  const $6 = $5 === "" ? [] : split("\n")($5);
                  return cmd + "	" + (() => {
                    if ($6.length > 0) {
                      const $7 = uncons4($6);
                      if ($7.tail.length === 0) {
                        return $7.head;
                      }
                      return $7.head + "...";
                    }
                    return "";
                  })();
                }
                fail();
              });
            }
            fail();
          })()(filterImpl(is_completion, opt.optMain._2));
          return () => $22;
        }
        fail();
      })(v2$1._1._1._1._1));
      return () => {
        const a$p = $2();
        return fold2(a$p);
      };
    }
    if (v2$1._1.tag === "Right") {
      return v2$1._1._1(0 < v1.rest.length ? v1.rest[0] : "");
    }
    fail();
  }
  if (v2$1.tag === "Nothing") {
    return () => [];
  }
  fail();
};
var bashCompletionParser = (pinfo) => (pprefs) => $Parser(
  "AltP",
  parserFunctor.map((opts2) => ({
    execCompletion: (progn) => {
      const $0 = opts2(progn);
      return () => {
        const a$p = $0();
        return unLines(a$p);
      };
    }
  }))($Parser(
    "MultP",
    $MultPE(
      $Parser(
        "MultP",
        $MultPE(
          parserFunctor.map(bashCompletionQuery(pinfo)(pprefs))($Parser(
            "AltP",
            $Parser(
              "MultP",
              $MultPE(
                $Parser(
                  "MultP",
                  $MultPE(
                    flag$p(Enriched)($Mod(
                      (x) => internal._1({
                        ...x,
                        flagNames: [$OptName("OptLong", "bash-completion-enriched"), ...x.flagNames]
                      }),
                      $DefaultProp(
                        internal._2._1.tag === "Nothing" ? Nothing : internal._2._1,
                        internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
                      ),
                      (x) => internal._3(x)
                    )),
                    option($$int)($Mod(
                      (x) => internal._1({
                        ...x,
                        optNames: [$OptName("OptLong", "bash-completion-option-desc-length"), ...x.optNames]
                      }),
                      $DefaultProp(
                        $Maybe("Just", 40),
                        internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
                      ),
                      (x) => internal._3(x)
                    ))
                  )
                ),
                option($$int)($Mod(
                  (x) => internal._1({
                    ...x,
                    optNames: [$OptName("OptLong", "bash-completion-command-desc-length"), ...x.optNames]
                  }),
                  $DefaultProp(
                    $Maybe("Just", 40),
                    internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
                  ),
                  (x) => internal._3(x)
                ))
              )
            ),
            $Parser("NilP", Standard)
          )),
          parserFunctor.map(fromFoldable1)($Parser(
            "BindP",
            manyM(option(readerAsk)($Mod(
              (x) => internal._1({ ...x, optNames: [$OptName("OptLong", "bash-completion-word"), ...x.optNames] }),
              $DefaultProp(
                internal._2._1.tag === "Nothing" ? Nothing : internal._2._1,
                internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
              ),
              (x) => internal._3(x)
            )))
          ))
        )
      ),
      option($$int)($Mod(
        (x) => internal._1({ ...x, optNames: [$OptName("OptLong", "bash-completion-index"), ...x.optNames] }),
        $DefaultProp(
          internal._2._1.tag === "Nothing" ? Nothing : internal._2._1,
          internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
        ),
        (x) => internal._3(x)
      ))
    )
  )),
  $Parser(
    "AltP",
    parserFunctor.map((opts2) => ({
      execCompletion: (progn) => {
        const $0 = opts2(progn);
        return () => {
          const a$p = $0();
          return unLines(a$p);
        };
      }
    }))(parserFunctor.map(bashCompletionScript)(option(readerAsk)($Mod(
      (x) => internal._1({ ...x, optNames: [$OptName("OptLong", "bash-completion-script"), ...x.optNames] }),
      $DefaultProp(
        internal._2._1.tag === "Nothing" ? Nothing : internal._2._1,
        internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
      ),
      (x) => internal._3(x)
    )))),
    $Parser(
      "AltP",
      parserFunctor.map((opts2) => ({
        execCompletion: (progn) => {
          const $0 = opts2(progn);
          return () => {
            const a$p = $0();
            return unLines(a$p);
          };
        }
      }))(parserFunctor.map(fishCompletionScript)(option(readerAsk)($Mod(
        (x) => internal._1({ ...x, optNames: [$OptName("OptLong", "fish-completion-script"), ...x.optNames] }),
        $DefaultProp(
          internal._2._1.tag === "Nothing" ? Nothing : internal._2._1,
          internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
        ),
        (x) => internal._3(x)
      )))),
      parserFunctor.map((opts2) => ({
        execCompletion: (progn) => {
          const $0 = opts2(progn);
          return () => {
            const a$p = $0();
            return unLines(a$p);
          };
        }
      }))(parserFunctor.map(zshCompletionScript)(option(readerAsk)($Mod(
        (x) => internal._1({ ...x, optNames: [$OptName("OptLong", "zsh-completion-script"), ...x.optNames] }),
        $DefaultProp(
          internal._2._1.tag === "Nothing" ? Nothing : internal._2._1,
          internal._2._2.tag === "Nothing" ? Nothing : internal._2._2
        ),
        (x) => internal._3(x)
      ))))
    )
  )
);

// output-es/Options.Applicative.Help.Types/index.js
var chunkMonoid2 = /* @__PURE__ */ chunkMonoid(docSemigroup);
var parserHelpMonoid = /* @__PURE__ */ monoidRecord()(/* @__PURE__ */ (() => {
  const Semigroup0 = chunkMonoid2.Semigroup0();
  const Semigroup0$1 = chunkMonoid2.Semigroup0();
  const Semigroup0$2 = chunkMonoid2.Semigroup0();
  const Semigroup0$3 = chunkMonoid2.Semigroup0();
  const Semigroup0$4 = chunkMonoid2.Semigroup0();
  const Semigroup0$5 = chunkMonoid2.Semigroup0();
  const semigroupRecordCons1 = {
    appendRecord: (v) => (ra) => (rb) => ({
      helpBody: Semigroup0.append(ra.helpBody)(rb.helpBody),
      helpError: Semigroup0$1.append(ra.helpError)(rb.helpError),
      helpFooter: Semigroup0$2.append(ra.helpFooter)(rb.helpFooter),
      helpHeader: Semigroup0$3.append(ra.helpHeader)(rb.helpHeader),
      helpSuggestions: Semigroup0$4.append(ra.helpSuggestions)(rb.helpSuggestions),
      helpUsage: Semigroup0$5.append(ra.helpUsage)(rb.helpUsage)
    })
  };
  return {
    memptyRecord: (v) => ({
      helpBody: chunkMonoid2.mempty,
      helpError: chunkMonoid2.mempty,
      helpFooter: chunkMonoid2.mempty,
      helpHeader: chunkMonoid2.mempty,
      helpSuggestions: chunkMonoid2.mempty,
      helpUsage: chunkMonoid2.mempty
    }),
    SemigroupRecord0: () => semigroupRecordCons1
  };
})());
var helpText = (v) => {
  const $0 = vsepChunks([v.helpError, v.helpSuggestions, v.helpHeader, v.helpUsage, v.helpBody, v.helpFooter]);
  if ($0.tag === "Nothing") {
    return Empty;
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};

// output-es/Options.Applicative.Help.Core/index.js
var fold3 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidArray)(identity2))();
var chunkMonoid3 = /* @__PURE__ */ chunkMonoid(docSemigroup);
var listToChunk2 = /* @__PURE__ */ listToChunk(docMonoid);
var identity13 = (x) => x;
var mempty22 = /* @__PURE__ */ (() => $Tuple(monoidMaybe(semigroupString).mempty, chunkMonoid3.mempty))();
var intersperse2 = (sep2) => {
  const $0 = mapWithIndexArray((idx) => (e) => {
    if (idx === 0) {
      return [e];
    }
    return [sep2, e];
  });
  return (x) => fold3($0(x));
};
var optDesc = (pprefs) => (style) => (info2) => (opt) => {
  const suffix = info2.hinfoMulti ? stringChunk(pprefs.prefMultiSuffix) : chunkMonoid3.mempty;
  const descs = arrayMap((x) => string(showOption(x)))(sortBy(optNameOrd.compare)((() => {
    if (opt.optMain.tag === "OptReader") {
      return opt.optMain._1;
    }
    if (opt.optMain.tag === "FlagReader") {
      return opt.optMain._1;
    }
    return [];
  })()));
  return (() => {
    if (opt.optProps.propDescMod.tag === "Nothing") {
      return identity13;
    }
    if (opt.optProps.propDescMod.tag === "Just") {
      return functorMaybe.map(opt.optProps.propDescMod._1);
    }
    fail();
  })()((() => {
    const $0 = listToChunk2(intersperse2(style.descSep)(descs));
    const $1 = stringChunk(opt.optProps.propMetaVar);
    const $2 = (() => {
      if ($0.tag === "Nothing") {
        return $1;
      }
      if ($1.tag === "Nothing") {
        return $0;
      }
      if ($0.tag === "Just" && $1.tag === "Just") {
        return $Maybe("Just", $Doc("Cat", $0._1, $Doc("Cat", $Doc("Char", " "), $1._1)));
      }
      fail();
    })();
    if ((() => {
      if (info2.hinfoDefault && !style.descOptional) {
        return true;
      }
      if (opt.optProps.propVisibility === "Hidden") {
        return !style.descHidden;
      }
      return opt.optProps.propVisibility !== "Visible";
    })()) {
      return chunkMonoid3.mempty;
    }
    if ((() => {
      if ($2.tag === "Nothing") {
        return true;
      }
      if ($2.tag === "Just") {
        return false;
      }
      fail();
    })() || !style.descSurround) {
      if ($2.tag === "Nothing") {
        return suffix;
      }
      if (suffix.tag === "Nothing") {
        return $2;
      }
      if ($2.tag === "Just" && suffix.tag === "Just") {
        return $Maybe("Just", $Doc("Cat", $2._1, suffix._1));
      }
      fail();
    }
    if (info2.hinfoDefault) {
      const $32 = $2.tag === "Just" ? $Maybe(
        "Just",
        $Doc(
          "Cat",
          $Doc("Char", "["),
          $Doc("Cat", $2._1, $Doc("Char", "]"))
        )
      ) : Nothing;
      if ($32.tag === "Nothing") {
        return suffix;
      }
      if (suffix.tag === "Nothing") {
        return $32;
      }
      if ($32.tag === "Just" && suffix.tag === "Just") {
        return $Maybe("Just", $Doc("Cat", $32._1, suffix._1));
      }
      fail();
    }
    if (sliceImpl(1, descs.length, descs).length === 0) {
      if ($2.tag === "Nothing") {
        return suffix;
      }
      if (suffix.tag === "Nothing") {
        return $2;
      }
      if ($2.tag === "Just" && suffix.tag === "Just") {
        return $Maybe("Just", $Doc("Cat", $2._1, suffix._1));
      }
      fail();
    }
    const $3 = $2.tag === "Just" ? $Maybe(
      "Just",
      $Doc(
        "Cat",
        $Doc("Char", "("),
        $Doc("Cat", $2._1, $Doc("Char", ")"))
      )
    ) : Nothing;
    if ($3.tag === "Nothing") {
      return suffix;
    }
    if (suffix.tag === "Nothing") {
      return $3;
    }
    if ($3.tag === "Just" && suffix.tag === "Just") {
      return $Maybe("Just", $Doc("Cat", $3._1, suffix._1));
    }
    fail();
  })());
};
var fullDesc = (pprefs) => {
  const style = { descSep: string(","), descHidden: true, descOptional: true, descSurround: false };
  const $0 = mapParser((info2) => (opt) => {
    const n = optDesc(pprefs)(style)(info2)(opt);
    if (opt.optProps.propShowDefault.tag === "Just") {
      if ((() => {
        if (n.tag === "Nothing") {
          return false;
        }
        if (n.tag === "Just") {
          return true;
        }
        fail();
      })() && (() => {
        if (opt.optProps.propHelp.tag === "Nothing") {
          return false;
        }
        if (opt.optProps.propHelp.tag === "Just") {
          return true;
        }
        fail();
      })()) {
        return $Maybe(
          "Just",
          $Tuple(
            (() => {
              if (n.tag === "Nothing") {
                return Empty;
              }
              if (n.tag === "Just") {
                return n._1;
              }
              fail();
            })(),
            (() => {
              if (opt.optProps.propHelp.tag === "Nothing") {
                const $02 = $Doc(
                  "Cat",
                  $Doc("Char", "("),
                  $Doc(
                    "Cat",
                    $Doc(
                      "Cat",
                      string("default:"),
                      $Doc("Cat", $Doc("Char", " "), string(opt.optProps.propShowDefault._1))
                    ),
                    $Doc("Char", ")")
                  )
                );
                return $Doc("Column", (k) => $Doc("Nesting", (i) => $Doc("Nest", k - i | 0, $02)));
              }
              if (opt.optProps.propHelp.tag === "Just") {
                const $02 = $Doc(
                  "Cat",
                  opt.optProps.propHelp._1,
                  $Doc(
                    "Cat",
                    $Doc("Char", " "),
                    $Doc(
                      "Cat",
                      $Doc("Char", "("),
                      $Doc(
                        "Cat",
                        $Doc(
                          "Cat",
                          string("default:"),
                          $Doc("Cat", $Doc("Char", " "), string(opt.optProps.propShowDefault._1))
                        ),
                        $Doc("Char", ")")
                      )
                    )
                  )
                );
                return $Doc("Column", (k) => $Doc("Nesting", (i) => $Doc("Nest", k - i | 0, $02)));
              }
              fail();
            })()
          )
        );
      }
      return Nothing;
    }
    if ((() => {
      if (n.tag === "Nothing") {
        return false;
      }
      if (n.tag === "Just") {
        return true;
      }
      fail();
    })() && (() => {
      if (opt.optProps.propHelp.tag === "Nothing") {
        return false;
      }
      if (opt.optProps.propHelp.tag === "Just") {
        return true;
      }
      fail();
    })()) {
      return $Maybe(
        "Just",
        $Tuple(
          (() => {
            if (n.tag === "Nothing") {
              return Empty;
            }
            if (n.tag === "Just") {
              return n._1;
            }
            fail();
          })(),
          (() => {
            if (opt.optProps.propHelp.tag === "Nothing") {
              return $Doc(
                "Column",
                (k) => $Doc("Nesting", (i) => $Doc("Nest", k - i | 0, Empty))
              );
            }
            const $02 = (() => {
              if (opt.optProps.propHelp.tag === "Nothing") {
                return Empty;
              }
              if (opt.optProps.propHelp.tag === "Just") {
                return opt.optProps.propHelp._1;
              }
              fail();
            })();
            return $Doc("Column", (k) => $Doc("Nesting", (i) => $Doc("Nest", k - i | 0, $02)));
          })()
        )
      );
    }
    return Nothing;
  });
  return (x) => tabulate$p(24)(mapMaybe((x$1) => x$1)($0(x)));
};
var fold_tree = (v) => {
  if (v.tag === "Leaf") {
    return v._1;
  }
  if (v.tag === "MultNode") {
    return foldrArray((x) => chunkBesideOrBelow(fold_tree(x)))(chunkMonoid3.mempty)(v._1);
  }
  if (v.tag === "AltNode") {
    const $0 = filterImpl(
      (x) => {
        if (x.tag === "Nothing") {
          return false;
        }
        if (x.tag === "Just") {
          return true;
        }
        fail();
      },
      arrayMap(fold_tree)(v._1)
    );
    if ($0.length === 1) {
      return $0[0];
    }
    const $1 = foldrArray((v1) => (v2) => {
      if (v1.tag === "Nothing") {
        return v2;
      }
      if (v2.tag === "Nothing") {
        return v1;
      }
      if (v1.tag === "Just" && v2.tag === "Just") {
        return $Maybe(
          "Just",
          $Doc(
            "Cat",
            v1._1,
            $Doc(
              "Cat",
              softline,
              $Doc("Cat", $Doc("Char", "|"), $Doc("Cat", softline, v2._1))
            )
          )
        );
      }
      fail();
    })(chunkMonoid3.mempty)($0);
    if ($1.tag === "Just") {
      return $Maybe(
        "Just",
        $Doc(
          "Cat",
          $Doc("Char", "("),
          $Doc("Cat", $1._1, $Doc("Char", ")"))
        )
      );
    }
    return Nothing;
  }
  fail();
};
var cmdDesc = /* @__PURE__ */ mapParser((v) => (opt) => {
  if (opt.optMain.tag === "CmdReader") {
    return $Tuple(
      opt.optMain._1,
      tabulate$p(24)(arrayBind(reverse(opt.optMain._2))((cmd) => arrayBind((() => {
        const $0 = opt.optMain._3(cmd);
        if ($0.tag === "Just") {
          return [$0._1.infoProgDesc];
        }
        return [];
      })())((d) => [
        $Tuple(
          string(cmd),
          (() => {
            const $0 = (() => {
              if (d.tag === "Nothing") {
                return Empty;
              }
              if (d.tag === "Just") {
                return d._1;
              }
              fail();
            })();
            return $Doc("Column", (k) => $Doc("Nesting", (i) => $Doc("Nest", k - i | 0, $0)));
          })()
        )
      ])))
    );
  }
  return mempty22;
});
var briefDesc$p = (showOptional) => (pprefs) => {
  const $0 = treeMapParser(optDesc(pprefs)({
    descSep: string("|"),
    descHidden: false,
    descOptional: showOptional,
    descSurround: true
  }));
  return (x) => fold_tree($0(x));
};
var parserUsage = (pprefs) => (p) => (progn) => hsep([
  string("Usage:"),
  string(progn),
  (() => {
    const $0 = briefDesc$p(true)(pprefs)(p);
    const $1 = (() => {
      if ($0.tag === "Nothing") {
        return Empty;
      }
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })();
    return $Doc("Column", (k) => $Doc("Nesting", (i) => $Doc("Nest", k - i | 0, $1)));
  })()
]);
var parserHelp = (pprefs) => (p) => ({
  ...parserHelpMonoid.mempty,
  helpBody: vsepChunks([
    (() => {
      const $0 = fullDesc(pprefs)(p);
      if ($0.tag === "Just") {
        return $Maybe(
          "Just",
          $Doc(
            "Cat",
            string("Available options:"),
            $Doc("Cat", $Doc("FlatAlt", Line, $Doc("Char", " ")), $0._1)
          )
        );
      }
      return Nothing;
    })(),
    ...arrayMap((arr) => {
      const v = uncons4(arr);
      const $0 = (() => {
        if (v.head._1.tag === "Nothing") {
          return "Available commands:";
        }
        if (v.head._1.tag === "Just") {
          return v.head._1._1;
        }
        fail();
      })();
      const $1 = vcatChunks([v.head._2, ...arrayMap(snd)(v.tail)]);
      if ($1.tag === "Just") {
        return $Maybe(
          "Just",
          $Doc(
            "Cat",
            string($0),
            $Doc("Cat", $Doc("FlatAlt", Line, $Doc("Char", " ")), $1._1)
          )
        );
      }
      return Nothing;
    })(groupBy((x) => (y) => {
      if (x._1.tag === "Nothing") {
        return y._1.tag === "Nothing";
      }
      return x._1.tag === "Just" && y._1.tag === "Just" && x._1._1 === y._1._1;
    })(cmdDesc(p)))
  ])
});

// output-es/Data.Function.Memoize/index.js
var $NatTrie = (_1, _2, _3) => ({ tag: "NatTrie", _1, _2, _3 });
var tabulateNat = {
  tabulate: (f) => {
    const walk = (v) => (v1) => {
      if (v.tag === "Nil") {
        return v1._1;
      }
      if (v.tag === "Cons") {
        if (!v._1) {
          const $0 = v1._2;
          const $1 = walk(v._2);
          return defer((v$1) => force($1(force($0))));
        }
        if (v._1) {
          const $0 = v1._3;
          const $1 = walk(v._2);
          return defer((v$1) => force($1(force($0))));
        }
      }
      fail();
    };
    const build = (n) => $NatTrie(defer((v) => f(n)), defer((v) => build(n * 2 | 0)), defer((v) => build((n * 2 | 0) + 1 | 0)));
    const trie = build(0);
    const bits$p = (bits$p$a0$copy) => (bits$p$a1$copy) => {
      let bits$p$a0 = bits$p$a0$copy, bits$p$a1 = bits$p$a1$copy, bits$p$c = true, bits$p$r;
      while (bits$p$c) {
        const v = bits$p$a0, v1 = bits$p$a1;
        if (v1 === 0) {
          bits$p$c = false;
          bits$p$r = v;
          continue;
        }
        bits$p$a0 = $List("Cons", (v1 & 1) !== 0, v);
        bits$p$a1 = v1 >>> 1;
      }
      return bits$p$r;
    };
    const bits = bits$p(Nil);
    return (n) => walk(bits(n))(trie);
  }
};
var tabulateTuple = (dictTabulate) => (dictTabulate1) => ({
  tabulate: (f) => {
    const f$p = dictTabulate.tabulate((a) => dictTabulate1.tabulate((b) => f($Tuple(a, b))));
    return (v) => {
      const $0 = v._2;
      const $1 = f$p(v._1);
      return defer((v$1) => force(force($1)($0)));
    };
  }
});
var memoize = (dictTabulate) => (f) => {
  const $0 = dictTabulate.tabulate(f);
  return (x) => force($0(x));
};
var memoize2 = (dictTabulate) => (dictTabulate1) => {
  const memoize1 = memoize(tabulateTuple(dictTabulate)(dictTabulate1));
  return (f) => {
    const $0 = memoize1((v) => f(v._1)(v._2));
    return (a) => (b) => $0($Tuple(a, b));
  };
};

// output-es/Options.Applicative.Help.Levenshtein/index.js
var memoize22 = /* @__PURE__ */ memoize2(tabulateNat)(tabulateNat);
var minimum2 = /* @__PURE__ */ minimum(ordInt)(/* @__PURE__ */ foldable1NonEmpty(foldableArray));
var editDistance = (dictEq) => (xs) => (ys) => {
  const dist = (v) => (v1) => {
    if (v === 0) {
      return v1;
    }
    if (v1 === 0) {
      return v;
    }
    return minimum2($NonEmpty(
      dist$p$lazy()(v - 1 | 0)(v1) + 1 | 0,
      [dist$p$lazy()(v)(v1 - 1 | 0) + 1 | 0, dictEq.eq(xs[v - 1 | 0])(ys[v1 - 1 | 0]) ? dist$p$lazy()(v - 1 | 0)(v1 - 1 | 0) : 1 + dist$p$lazy()(v - 1 | 0)(v1 - 1 | 0) | 0]
    ));
  };
  const dist$p$lazy = binding(() => memoize22((a) => (b) => dist(a)(b)));
  const dist$p = dist$p$lazy();
  return dist$p(xs.length)(ys.length);
};

// output-es/Options.Applicative.Extra/index.js
var unWords = (xs) => foldlArray((v) => (v1) => {
  if (v.init) {
    return { init: false, acc: v1 };
  }
  return { init: false, acc: v.acc + " " + v1 };
})({ init: true, acc: "" })(xs).acc;
var fold4 = /* @__PURE__ */ (() => foldableArray.foldMap(monoidArray)(identity2))();
var mempty13 = /* @__PURE__ */ (() => chunkMonoid(docSemigroup).mempty)();
var fold1 = /* @__PURE__ */ (() => foldableArray.foldMap(parserHelpMonoid)(identity2))();
var fromFoldable2 = /* @__PURE__ */ foldrArray(Cons)(Nil);
var renderFailure = (failure) => (progn) => {
  const v = failure(progn);
  return $Tuple(
    displayS(renderFits(fits1)(1)(v._2._2._1)(helpText(v._1))),
    v._2._1
  );
};
var parserFailure = (pprefs) => (pinfo) => (msg) => (ctx) => {
  const suggestion_help = {
    ...parserHelpMonoid.mempty,
    helpSuggestions: (() => {
      if (msg.tag === "UnexpectedError") {
        const $0 = msg._1;
        const good = filterImpl(
          (a) => editDistance(eqChar)(toCharArray(a))(toCharArray($0)) < 3,
          fold4(mapParser((v) => (v1) => {
            if (v1.optMain.tag === "OptReader") {
              return arrayMap(showOption)(v1.optMain._1);
            }
            if (v1.optMain.tag === "FlagReader") {
              return arrayMap(showOption)(v1.optMain._1);
            }
            if (v1.optMain.tag === "ArgReader") {
              return [];
            }
            if (v1.optMain.tag === "CmdReader") {
              if (v.hinfoUnreachableArgs) {
                return [];
              }
              return v1.optMain._2;
            }
            fail();
          })(msg._2._1))
        );
        return applyMaybe.apply((() => {
          const $1 = good.length < 2 ? stringChunk("Did you mean this?") : stringChunk("Did you mean one of these?");
          if ($1.tag === "Just") {
            return $Maybe("Just", appendWithLine($1._1));
          }
          return Nothing;
        })())((() => {
          const $1 = vcatChunks(arrayMap(stringChunk)(good));
          if ($1.tag === "Just") {
            return $Maybe("Just", indent(4)($1._1));
          }
          return Nothing;
        })());
      }
      return mempty13;
    })()
  };
  const show_full_help = (() => {
    if (msg.tag === "ShowHelpText") {
      return true;
    }
    if (msg.tag === "MissingError" && msg._1 === "CmdStart" && pprefs.prefShowHelpOnEmpty) {
      return true;
    }
    return pprefs.prefShowHelpOnError;
  })();
  const exit_code = (() => {
    if (msg.tag === "ErrorMsg") {
      return pinfo.infoFailureCode;
    }
    if (msg.tag === "MissingError") {
      return pinfo.infoFailureCode;
    }
    if (msg.tag === "ExpectsArgError") {
      return pinfo.infoFailureCode;
    }
    if (msg.tag === "UnexpectedError") {
      return pinfo.infoFailureCode;
    }
    if (msg.tag === "ShowHelpText") {
      return Success;
    }
    if (msg.tag === "InfoMsg") {
      return Success;
    }
    fail();
  })();
  const error_help = {
    ...parserHelpMonoid.mempty,
    helpError: (() => {
      if (msg.tag === "ShowHelpText") {
        return mempty13;
      }
      if (msg.tag === "ErrorMsg") {
        return stringChunk(msg._1);
      }
      if (msg.tag === "InfoMsg") {
        return stringChunk(msg._1);
      }
      if (msg.tag === "MissingError") {
        if (msg._1 === "CmdStart" && pprefs.prefShowHelpOnEmpty) {
          return mempty13;
        }
        const $0 = stringChunk("Missing:");
        const $1 = briefDesc$p(false)(pprefs)(msg._2._1);
        if ($0.tag === "Nothing") {
          return $1;
        }
        if ($1.tag === "Nothing") {
          return $0;
        }
        if ($0.tag === "Just" && $1.tag === "Just") {
          return $Maybe("Just", $Doc("Cat", $0._1, $Doc("Cat", $Doc("Char", " "), $1._1)));
        }
        fail();
      }
      if (msg.tag === "ExpectsArgError") {
        return stringChunk("The option `" + msg._1 + "` expects an argument.");
      }
      if (msg.tag === "UnexpectedError") {
        return stringChunk(startsWith("-")(msg._1) ? "Invalid option `" + msg._1 + "'" : "Invalid argument `" + msg._1 + "'");
      }
      fail();
    })()
  };
  return (progn) => $Tuple(
    (() => {
      const $0 = (names, pinfo$p) => fold1([
        (() => {
          const $02 = { ...parserHelpMonoid.mempty, helpHeader: pinfo$p.infoHeader };
          const f = { ...parserHelpMonoid.mempty, helpFooter: pinfo$p.infoFooter };
          if (show_full_help) {
            return fold1([$02, f, parserHelp(pprefs)(pinfo$p.infoParser)]);
          }
          return parserHelpMonoid.mempty;
        })(),
        msg.tag === "InfoMsg" ? parserHelpMonoid.mempty : {
          ...parserHelpMonoid.mempty,
          helpUsage: vcatChunks([
            $Maybe("Just", parserUsage(pprefs)(pinfo$p.infoParser)(unWords([progn, ...names]))),
            pinfo$p.infoProgDesc.tag === "Just" ? $Maybe("Just", indent(2)(pinfo$p.infoProgDesc._1)) : Nothing
          ])
        },
        suggestion_help,
        error_help
      ]);
      if (0 < ctx.length) {
        return $0(reverse(arrayMap((v) => v._1)(ctx)), ctx[0]._2);
      }
      return $0([], pinfo);
    })(),
    $Tuple(exit_code, $Tuple(pprefs.prefColumns, void 0))
  );
};
var helper = /* @__PURE__ */ (() => abortOption(ShowHelpText)(foldableArray.foldMap(modMonoid)(identity2)([
  $Mod(
    optionFieldsHasName.name($OptName("OptLong", "help")),
    $DefaultProp(Nothing, Nothing),
    identity7
  ),
  $Mod(
    optionFieldsHasName.name($OptName("OptShort", "h")),
    $DefaultProp(Nothing, Nothing),
    identity7
  ),
  optionMod((p) => ({ ...p, propHelp: paragraph("Show this help text") })),
  hidden
])))();
var getProgName = () => {
  const a$p = argv();
  const $0 = 1 < a$p.length ? last(split("/")(a$p[1])) : Nothing;
  if ($0.tag === "Nothing") {
    return "";
  }
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};
var getArgs = () => {
  const a$p = argv();
  return sliceImpl(2, a$p.length, a$p);
};
var exitSuccess = /* @__PURE__ */ (() => {
  const $0 = boundedEnumExitCode.fromEnum(Success);
  return () => exitImpl($0);
})();
var handleParseResult = (v) => {
  if (v.tag === "Success") {
    const $0 = v._1;
    return () => $0;
  }
  if (v.tag === "Failure") {
    const $0 = v._1;
    return () => {
      const progn = getProgName();
      const v1 = renderFailure($0)(progn);
      writeString(v1._2 === "Success" ? stdout : stderr)(UTF8)(v1._1 + "\n")();
      return exitImpl(boundedEnumExitCode.fromEnum(v1._2));
    };
  }
  if (v.tag === "CompletionInvoked") {
    const $0 = v._1;
    return () => {
      const progn = getProgName();
      const msg = $0.execCompletion(progn)();
      writeString(stdout)(UTF8)(msg)();
      return exitSuccess();
    };
  }
  fail();
};
var execParserPure = (pprefs) => (pinfo) => (args) => {
  const v = runParserFully(pMonadP)(pinfo.infoPolicy)($Parser(
    "AltP",
    parserFunctor.map(Left)(bashCompletionParser(pinfo)(pprefs)),
    parserFunctor.map(Right)(pinfo.infoParser)
  ))(fromFoldable2(args))([])(pprefs);
  if (v._1.tag === "Right") {
    if (v._1._1.tag === "Right") {
      return $ParserResult("Success", v._1._1._1);
    }
    if (v._1._1.tag === "Left") {
      return $ParserResult("CompletionInvoked", v._1._1._1);
    }
    fail();
  }
  if (v._1.tag === "Left") {
    return $ParserResult("Failure", parserFailure(pprefs)(pinfo)(v._1._1)(v._2));
  }
  fail();
};

// output-es/App.Cli/index.js
var cliOptions = /* @__PURE__ */ (() => $Parser(
  "MultP",
  $MultPE(
    $Parser(
      "MultP",
      $MultPE(
        $Parser(
          "MultP",
          $MultPE(
            parserFunctor.map((v) => (v1) => (v2) => (v3) => ({ targetPath: v1, noWarning: v, mode: v2, generateDP: v3 }))($Parser(
              "AltP",
              flag$p(true)((() => {
                const $0 = optionMod((p) => ({ ...p, propHelp: paragraph("don't show warnings") }));
                return $Mod(
                  (x) => $0._1({ ...x, flagNames: [$OptName("OptLong", "no-warning"), ...x.flagNames] }),
                  $DefaultProp(
                    $0._2._1.tag === "Nothing" ? Nothing : $0._2._1,
                    $0._2._2.tag === "Nothing" ? Nothing : $0._2._2
                  ),
                  (x) => $0._3(x)
                );
              })()),
              $Parser("NilP", false)
            )),
            argument(readerAsk)((() => {
              const $0 = optionMod((p) => ({ ...p, propMetaVar: "PATH" }));
              const $1 = optionMod((p) => ({ ...p, propHelp: paragraph("The dataset path to validate") }));
              const $2 = $1._2._1.tag === "Nothing" ? $Maybe("Just", "./") : $1._2._1;
              const $3 = $1._2._2.tag === "Nothing" ? Nothing : $1._2._2;
              return $Mod(
                (x) => $1._1($0._1(x)),
                $DefaultProp($2.tag === "Nothing" ? $0._2._1 : $2, $3.tag === "Nothing" ? $0._2._2 : $3),
                (x) => $1._3($0._3(x))
              );
            })())
          )
        ),
        option(readerAsk)((() => {
          const $0 = optionMod((p) => ({ ...p, propHelp: paragraph("configure how validator find files (filenames or datapackage, default filenames)") }));
          const $1 = $0._2._1.tag === "Nothing" ? $Maybe("Just", "filenames") : $0._2._1;
          const $2 = $0._2._2.tag === "Nothing" ? Nothing : $0._2._2;
          const $3 = $1.tag === "Nothing" ? Nothing : $1;
          const $4 = $2.tag === "Nothing" ? Nothing : $2;
          return $Mod(
            (x) => $0._1({ ...x, optNames: [$OptName("OptShort", "m"), $OptName("OptLong", "mode"), ...x.optNames] }),
            $DefaultProp($3.tag === "Nothing" ? Nothing : $3, $4.tag === "Nothing" ? Nothing : $4),
            (x) => $0._3(x)
          );
        })())
      )
    ),
    $Parser(
      "AltP",
      flag$p(true)((() => {
        const $0 = optionMod((p) => ({ ...p, propHelp: paragraph("whether to generate a datapackage.json after validation. (default false)") }));
        const $1 = $0._2._1.tag === "Nothing" ? Nothing : $0._2._1;
        const $2 = $0._2._2.tag === "Nothing" ? Nothing : $0._2._2;
        return $Mod(
          (x) => $0._1({
            ...x,
            flagNames: [$OptName("OptShort", "p"), $OptName("OptLong", "generate-datapackage"), ...x.flagNames]
          }),
          $DefaultProp($1.tag === "Nothing" ? Nothing : $1, $2.tag === "Nothing" ? Nothing : $2),
          (x) => $0._3(x)
        );
      })()),
      $Parser("NilP", false)
    )
  )
))();
var opts = {
  infoFailureCode: $$Error,
  infoFooter: mempty12,
  infoFullDesc: true,
  infoHeader: /* @__PURE__ */ paragraph("validate-ddf - DDF dataset validator"),
  infoParser: /* @__PURE__ */ apApplyFlipped(parserApply)(cliOptions)(helper),
  infoPolicy: Intersperse,
  infoProgDesc: /* @__PURE__ */ paragraph("validate DDF dataset at PATH (default to current working dir)")
};

// output-es/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler2(error3) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error3) {
      setTimeout(function() {
        throw error3;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error3) {
      return left(error3);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error3) {
      k(left(error3))();
      return nonCanceler2;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size5 = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size5 !== 0) {
        size5--;
        thunk = queue[ix];
        queue[ix] = void 0;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size5 === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size5) % limit] = cb;
        size5++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error3) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step = aff;
    var fail2 = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run2(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step = bhead(step);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail2 = util.left(e);
              step = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail2 = step;
              step = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step = util.fromRight(step);
            }
            break;
          case CONTINUE:
            switch (step.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step._2;
                status = CONTINUE;
                step = step._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step = util.right(step._1);
                } else {
                  status = STEP_BIND;
                  step = step._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step = runSync(util.left, util.right, step._1);
                break;
              case ASYNC:
                status = PENDING;
                step = runAsync(util.left, step._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step = result2;
                      run2(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail2 = util.left(step._1);
                step = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step._1) {
                  tmp.run();
                }
                step = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step = sequential(util, supervisor, step._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step = interrupt || fail2 || step;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail2) {
                    status = CONTINUE;
                    step = attempt._2(util.fromLeft(fail2));
                    fail2 = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail2) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step = util.fromRight(step);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail2 === null) {
                    result = util.fromRight(step);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail2), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail2) {
                    step = attempt._1.failed(util.fromLeft(fail2))(attempt._2);
                  } else {
                    step = attempt._1.completed(util.fromRight(step))(attempt._2);
                  }
                  fail2 = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail2), attempts, interrupt);
                  status = CONTINUE;
                  step = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step = attempt._1;
                  fail2 = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            if (interrupt && fail2) {
              setTimeout(function() {
                throw util.fromLeft(fail2);
              }, 0);
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join2) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join2.rethrow;
          join2.handler(step)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join2;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error3, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(void 0))();
          return function() {
          };
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(void 0));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error3);
            status = COMPLETED;
            step = interrupt;
            run2(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error3);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step(error3)), attempts, interrupt);
              }
              status = RETURN;
              step = null;
              fail2 = null;
              run2(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error3);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step = null;
              fail2 = null;
            }
        }
        return canceler;
      };
    }
    function join(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run2(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run2(runTick);
            });
          } else {
            run2(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill(error3, par2, cb2) {
      var step = par2;
      var head = null;
      var tail = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step.tag) {
            case FORKED:
              if (step._3 === EMPTY) {
                tmp = fibers[step._1];
                kills2[count++] = tmp.kill(error3, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head === null) {
                break loop;
              }
              step = head._2;
              if (tail === null) {
                head = null;
              } else {
                head = tail._1;
                tail = tail._2;
              }
              break;
            case MAP:
              step = step._2;
              break;
            case APPLY:
            case ALT:
              if (head) {
                tail = new Aff2(CONS, head, tail);
              }
              head = step;
              step = step._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(void 0))();
      } else {
        kid = 0;
        tmp = count;
        for (; kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join(result, head, tail) {
      var fail2, step, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail2 = result;
        step = null;
      } else {
        step = result;
        fail2 = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head === null) {
            cb(fail2 || step)();
            return;
          }
          if (head._3 !== EMPTY) {
            return;
          }
          switch (head.tag) {
            case MAP:
              if (fail2 === null) {
                head._3 = util.right(head._1(util.fromRight(step)));
                step = head._3;
              } else {
                head._3 = fail2;
              }
              break;
            case APPLY:
              lhs = head._1._3;
              rhs = head._2._3;
              if (fail2) {
                head._3 = fail2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail2 === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(fail2, null, null);
                    } else {
                      join(fail2, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head._3 = step;
              }
              break;
            case ALT:
              lhs = head._1._3;
              rhs = head._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail2 = step === lhs ? rhs : lhs;
                step = null;
                head._3 = fail2;
              } else {
                head._3 = step;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step === lhs ? head._2 : head._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail === null) {
                      join(step, null, null);
                    } else {
                      join(step, tail._1, tail._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail === null) {
            head = null;
          } else {
            head = tail._1;
            tail = tail._2;
          }
        }
    }
    function resolve2(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run2() {
      var status = CONTINUE;
      var step = par;
      var head = null;
      var tail = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step.tag) {
                case MAP:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(MAP, step._1, EMPTY, EMPTY);
                  step = step._2;
                  break;
                case APPLY:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(APPLY, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                case ALT:
                  if (head) {
                    tail = new Aff2(CONS, head, tail);
                  }
                  head = new Aff2(ALT, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step;
                  step = new Aff2(FORKED, fid, new Aff2(CONS, head, tail), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve2(step)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head === null) {
                break loop;
              }
              if (head._1 === EMPTY) {
                head._1 = step;
                status = CONTINUE;
                step = head._2;
                head._2 = EMPTY;
              } else {
                head._2 = step;
                step = head;
                if (tail === null) {
                  head = null;
                } else {
                  head = tail._1;
                  tail = tail._2;
                }
              }
          }
        }
      root = step;
      for (fid = 0; fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error3, cb2) {
      interrupt = util.left(error3);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error3, root, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler2;
          };
        });
      };
    }
    run2();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler2;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _catchError(aff) {
  return function(k) {
    return Aff.Catch(aff, k);
  };
}
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value2) {
        return Aff.Pure(f(value2));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
var makeAff = Aff.Async;
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
    }
  }
  return function(right, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right()));
        return function() {
          return Aff.Sync(function() {
            return right(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;

// output-es/Effect.Aff/index.js
var functorAff = { map: _map };
var ffiUtil = {
  isLeft: (v) => {
    if (v.tag === "Left") {
      return true;
    }
    if (v.tag === "Right") {
      return false;
    }
    fail();
  },
  fromLeft: (v) => {
    if (v.tag === "Left") {
      return v._1;
    }
    if (v.tag === "Right") {
      return _crashWith("unsafeFromLeft: Right");
    }
    fail();
  },
  fromRight: (v) => {
    if (v.tag === "Right") {
      return v._1;
    }
    if (v.tag === "Left") {
      return _crashWith("unsafeFromRight: Left");
    }
    fail();
  },
  left: Left,
  right: Right
};
var monadAff = { Applicative0: () => applicativeAff, Bind1: () => bindAff };
var bindAff = { bind: _bind, Apply0: () => applyAff };
var applyAff = { apply: (f) => (a) => _bind(f)((f$p) => _bind(a)((a$p) => applicativeAff.pure(f$p(a$p)))), Functor0: () => functorAff };
var applicativeAff = { pure: _pure, Apply0: () => applyAff };
var monadThrowAff = { throwError: _throwError, Monad0: () => monadAff };
var monadErrorAff = { catchError: _catchError, MonadThrow0: () => monadThrowAff };
var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
var runAff = (k) => (aff) => {
  const $0 = _makeFiber(ffiUtil, _bind($$try2(aff))((x) => _liftEffect(k(x))));
  return () => {
    const fiber = $0();
    fiber.run();
    return fiber;
  };
};
var nonCanceler = /* @__PURE__ */ (() => {
  const $0 = _pure();
  return (v) => $0;
})();

// output-es/Effect.Aff.Compat/index.js
var fromEffectFnAff = (v) => makeAff((k) => () => {
  const v1 = v((x) => k($Either("Left", x))(), (x) => k($Either("Right", x))());
  return (e) => makeAff((k2) => () => {
    v1(e, (x) => k2($Either("Left", x))(), (x) => k2($Either("Right", x))());
    return nonCanceler;
  });
});

// output-es/Node.FS.Constants/foreign.js
import { constants } from "node:fs";
var f_OK = constants.F_OK;
var r_OK = constants.R_OK;
var w_OK = constants.W_OK;
var x_OK = constants.X_OK;
var copyFile_EXCL = constants.COPYFILE_EXCL;
var copyFile_FICLONE = constants.COPYFILE_FICLONE;
var copyFile_FICLONE_FORCE = constants.COPYFILE_FICLONE_FORCE;

// output-es/Node.FS.Async/foreign.js
import {
  access,
  copyFile,
  mkdtemp,
  rename,
  truncate,
  chown,
  chmod,
  stat,
  lstat,
  link as link2,
  symlink,
  readlink,
  realpath,
  unlink,
  rmdir,
  rm,
  mkdir,
  readdir,
  utimes,
  readFile,
  writeFile,
  appendFile,
  open,
  read as read2,
  write as write2,
  close
} from "node:fs";

// output-es/Node.FS.Async/index.js
var handleCallback = (cb) => (err, a) => {
  const v = nullable(err, Nothing, Just);
  if (v.tag === "Nothing") {
    return cb($Either("Right", a))();
  }
  if (v.tag === "Just") {
    return cb($Either("Left", v._1))();
  }
  fail();
};
var readTextFile = (encoding) => (file) => (cb) => {
  const $0 = {
    encoding: (() => {
      if (encoding === "ASCII") {
        return "ASCII";
      }
      if (encoding === "UTF8") {
        return "UTF8";
      }
      if (encoding === "UTF16LE") {
        return "UTF16LE";
      }
      if (encoding === "UCS2") {
        return "UCS2";
      }
      if (encoding === "Base64") {
        return "Base64";
      }
      if (encoding === "Base64Url") {
        return "Base64Url";
      }
      if (encoding === "Latin1") {
        return "Latin1";
      }
      if (encoding === "Binary") {
        return "Binary";
      }
      if (encoding === "Hex") {
        return "Hex";
      }
      fail();
    })()
  };
  return () => readFile(file, $0, handleCallback(cb));
};
var readdir2 = (file) => (cb) => () => readdir(file, handleCallback(cb));
var stat2 = (file) => (cb) => () => stat(file, handleCallback(cb));

// output-es/Node.FS.Aff/index.js
var toAff1 = (f) => (a) => {
  const $0 = f(a);
  return makeAff((k) => {
    const $1 = $0(k);
    return () => {
      $1();
      return nonCanceler;
    };
  });
};
var toAff2 = (f) => (a) => (b) => {
  const $0 = f(a)(b);
  return makeAff((k) => {
    const $1 = $0(k);
    return () => {
      $1();
      return nonCanceler;
    };
  });
};

// node_modules/csv-parse/lib/index.js
import { Transform } from "stream";

// node_modules/csv-parse/lib/utils/is_object.js
var is_object = function(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

// node_modules/csv-parse/lib/api/CsvError.js
var CsvError = class extends Error {
  constructor(code, message2, options, ...contexts) {
    if (Array.isArray(message2))
      message2 = message2.join(" ").trim();
    super(message2);
    if (Error.captureStackTrace !== void 0) {
      Error.captureStackTrace(this, CsvError);
    }
    this.code = code;
    for (const context of contexts) {
      for (const key in context) {
        const value2 = context[key];
        this[key] = Buffer.isBuffer(value2) ? value2.toString(options.encoding) : value2 == null ? value2 : JSON.parse(JSON.stringify(value2));
      }
    }
  }
};

// node_modules/csv-parse/lib/api/normalize_columns_array.js
var normalize_columns_array = function(columns) {
  const normalizedColumns = [];
  for (let i = 0, l = columns.length; i < l; i++) {
    const column = columns[i];
    if (column === void 0 || column === null || column === false) {
      normalizedColumns[i] = { disabled: true };
    } else if (typeof column === "string") {
      normalizedColumns[i] = { name: column };
    } else if (is_object(column)) {
      if (typeof column.name !== "string") {
        throw new CsvError("CSV_OPTION_COLUMNS_MISSING_NAME", [
          "Option columns missing name:",
          `property "name" is required at position ${i}`,
          "when column is an object literal"
        ]);
      }
      normalizedColumns[i] = column;
    } else {
      throw new CsvError("CSV_INVALID_COLUMN_DEFINITION", [
        "Invalid column definition:",
        "expect a string or a literal object,",
        `got ${JSON.stringify(column)} at position ${i}`
      ]);
    }
  }
  return normalizedColumns;
};

// node_modules/csv-parse/lib/utils/ResizeableBuffer.js
var ResizeableBuffer = class {
  constructor(size5 = 100) {
    this.size = size5;
    this.length = 0;
    this.buf = Buffer.allocUnsafe(size5);
  }
  prepend(val) {
    if (Buffer.isBuffer(val)) {
      const length3 = this.length + val.length;
      if (length3 >= this.size) {
        this.resize();
        if (length3 >= this.size) {
          throw Error("INVALID_BUFFER_STATE");
        }
      }
      const buf = this.buf;
      this.buf = Buffer.allocUnsafe(this.size);
      val.copy(this.buf, 0);
      buf.copy(this.buf, val.length);
      this.length += val.length;
    } else {
      const length3 = this.length++;
      if (length3 === this.size) {
        this.resize();
      }
      const buf = this.clone();
      this.buf[0] = val;
      buf.copy(this.buf, 1, 0, length3);
    }
  }
  append(val) {
    const length3 = this.length++;
    if (length3 === this.size) {
      this.resize();
    }
    this.buf[length3] = val;
  }
  clone() {
    return Buffer.from(this.buf.slice(0, this.length));
  }
  resize() {
    const length3 = this.length;
    this.size = this.size * 2;
    const buf = Buffer.allocUnsafe(this.size);
    this.buf.copy(buf, 0, 0, length3);
    this.buf = buf;
  }
  toString(encoding) {
    if (encoding) {
      return this.buf.slice(0, this.length).toString(encoding);
    } else {
      return Uint8Array.prototype.slice.call(this.buf.slice(0, this.length));
    }
  }
  toJSON() {
    return this.toString("utf8");
  }
  reset() {
    this.length = 0;
  }
};
var ResizeableBuffer_default = ResizeableBuffer;

// node_modules/csv-parse/lib/api/init_state.js
var np = 12;
var cr = 13;
var nl = 10;
var space = 32;
var tab = 9;
var init_state = function(options) {
  return {
    bomSkipped: false,
    bufBytesStart: 0,
    castField: options.cast_function,
    commenting: false,
    error: void 0,
    enabled: options.from_line === 1,
    escaping: false,
    escapeIsQuote: Buffer.isBuffer(options.escape) && Buffer.isBuffer(options.quote) && Buffer.compare(options.escape, options.quote) === 0,
    expectedRecordLength: Array.isArray(options.columns) ? options.columns.length : void 0,
    field: new ResizeableBuffer_default(20),
    firstLineToHeaders: options.cast_first_line_to_header,
    needMoreDataSize: Math.max(
      options.comment !== null ? options.comment.length : 0,
      ...options.delimiter.map((delimiter2) => delimiter2.length),
      options.quote !== null ? options.quote.length : 0
    ),
    previousBuf: void 0,
    quoting: false,
    stop: false,
    rawBuffer: new ResizeableBuffer_default(100),
    record: [],
    recordHasError: false,
    record_length: 0,
    recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 0 : Math.max(...options.record_delimiter.map((v) => v.length)),
    trimChars: [Buffer.from(" ", options.encoding)[0], Buffer.from("	", options.encoding)[0]],
    wasQuoting: false,
    wasRowDelimiter: false,
    timchars: [
      Buffer.from(Buffer.from([cr], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([nl], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([np], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([space], "utf8").toString(), options.encoding),
      Buffer.from(Buffer.from([tab], "utf8").toString(), options.encoding)
    ]
  };
};

// node_modules/csv-parse/lib/utils/underscore.js
var underscore = function(str) {
  return str.replace(/([A-Z])/g, function(_, match2) {
    return "_" + match2.toLowerCase();
  });
};

// node_modules/csv-parse/lib/api/normalize_options.js
var normalize_options = function(opts2) {
  const options = {};
  for (const opt in opts2) {
    options[underscore(opt)] = opts2[opt];
  }
  if (options.encoding === void 0 || options.encoding === true) {
    options.encoding = "utf8";
  } else if (options.encoding === null || options.encoding === false) {
    options.encoding = null;
  } else if (typeof options.encoding !== "string" && options.encoding !== null) {
    throw new CsvError("CSV_INVALID_OPTION_ENCODING", [
      "Invalid option encoding:",
      "encoding must be a string or null to return a buffer,",
      `got ${JSON.stringify(options.encoding)}`
    ], options);
  }
  if (options.bom === void 0 || options.bom === null || options.bom === false) {
    options.bom = false;
  } else if (options.bom !== true) {
    throw new CsvError("CSV_INVALID_OPTION_BOM", [
      "Invalid option bom:",
      "bom must be true,",
      `got ${JSON.stringify(options.bom)}`
    ], options);
  }
  options.cast_function = null;
  if (options.cast === void 0 || options.cast === null || options.cast === false || options.cast === "") {
    options.cast = void 0;
  } else if (typeof options.cast === "function") {
    options.cast_function = options.cast;
    options.cast = true;
  } else if (options.cast !== true) {
    throw new CsvError("CSV_INVALID_OPTION_CAST", [
      "Invalid option cast:",
      "cast must be true or a function,",
      `got ${JSON.stringify(options.cast)}`
    ], options);
  }
  if (options.cast_date === void 0 || options.cast_date === null || options.cast_date === false || options.cast_date === "") {
    options.cast_date = false;
  } else if (options.cast_date === true) {
    options.cast_date = function(value2) {
      const date = Date.parse(value2);
      return !isNaN(date) ? new Date(date) : value2;
    };
  } else if (typeof options.cast_date !== "function") {
    throw new CsvError("CSV_INVALID_OPTION_CAST_DATE", [
      "Invalid option cast_date:",
      "cast_date must be true or a function,",
      `got ${JSON.stringify(options.cast_date)}`
    ], options);
  }
  options.cast_first_line_to_header = null;
  if (options.columns === true) {
    options.cast_first_line_to_header = void 0;
  } else if (typeof options.columns === "function") {
    options.cast_first_line_to_header = options.columns;
    options.columns = true;
  } else if (Array.isArray(options.columns)) {
    options.columns = normalize_columns_array(options.columns);
  } else if (options.columns === void 0 || options.columns === null || options.columns === false) {
    options.columns = false;
  } else {
    throw new CsvError("CSV_INVALID_OPTION_COLUMNS", [
      "Invalid option columns:",
      "expect an array, a function or true,",
      `got ${JSON.stringify(options.columns)}`
    ], options);
  }
  if (options.group_columns_by_name === void 0 || options.group_columns_by_name === null || options.group_columns_by_name === false) {
    options.group_columns_by_name = false;
  } else if (options.group_columns_by_name !== true) {
    throw new CsvError("CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME", [
      "Invalid option group_columns_by_name:",
      "expect an boolean,",
      `got ${JSON.stringify(options.group_columns_by_name)}`
    ], options);
  } else if (options.columns === false) {
    throw new CsvError("CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME", [
      "Invalid option group_columns_by_name:",
      "the `columns` mode must be activated."
    ], options);
  }
  if (options.comment === void 0 || options.comment === null || options.comment === false || options.comment === "") {
    options.comment = null;
  } else {
    if (typeof options.comment === "string") {
      options.comment = Buffer.from(options.comment, options.encoding);
    }
    if (!Buffer.isBuffer(options.comment)) {
      throw new CsvError("CSV_INVALID_OPTION_COMMENT", [
        "Invalid option comment:",
        "comment must be a buffer or a string,",
        `got ${JSON.stringify(options.comment)}`
      ], options);
    }
  }
  if (options.comment_no_infix === void 0 || options.comment_no_infix === null || options.comment_no_infix === false) {
    options.comment_no_infix = false;
  } else if (options.comment_no_infix !== true) {
    throw new CsvError("CSV_INVALID_OPTION_COMMENT", [
      "Invalid option comment_no_infix:",
      "value must be a boolean,",
      `got ${JSON.stringify(options.comment_no_infix)}`
    ], options);
  }
  const delimiter_json = JSON.stringify(options.delimiter);
  if (!Array.isArray(options.delimiter))
    options.delimiter = [options.delimiter];
  if (options.delimiter.length === 0) {
    throw new CsvError("CSV_INVALID_OPTION_DELIMITER", [
      "Invalid option delimiter:",
      "delimiter must be a non empty string or buffer or array of string|buffer,",
      `got ${delimiter_json}`
    ], options);
  }
  options.delimiter = options.delimiter.map(function(delimiter2) {
    if (delimiter2 === void 0 || delimiter2 === null || delimiter2 === false) {
      return Buffer.from(",", options.encoding);
    }
    if (typeof delimiter2 === "string") {
      delimiter2 = Buffer.from(delimiter2, options.encoding);
    }
    if (!Buffer.isBuffer(delimiter2) || delimiter2.length === 0) {
      throw new CsvError("CSV_INVALID_OPTION_DELIMITER", [
        "Invalid option delimiter:",
        "delimiter must be a non empty string or buffer or array of string|buffer,",
        `got ${delimiter_json}`
      ], options);
    }
    return delimiter2;
  });
  if (options.escape === void 0 || options.escape === true) {
    options.escape = Buffer.from('"', options.encoding);
  } else if (typeof options.escape === "string") {
    options.escape = Buffer.from(options.escape, options.encoding);
  } else if (options.escape === null || options.escape === false) {
    options.escape = null;
  }
  if (options.escape !== null) {
    if (!Buffer.isBuffer(options.escape)) {
      throw new Error(`Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`);
    }
  }
  if (options.from === void 0 || options.from === null) {
    options.from = 1;
  } else {
    if (typeof options.from === "string" && /\d+/.test(options.from)) {
      options.from = parseInt(options.from);
    }
    if (Number.isInteger(options.from)) {
      if (options.from < 0) {
        throw new Error(`Invalid Option: from must be a positive integer, got ${JSON.stringify(opts2.from)}`);
      }
    } else {
      throw new Error(`Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`);
    }
  }
  if (options.from_line === void 0 || options.from_line === null) {
    options.from_line = 1;
  } else {
    if (typeof options.from_line === "string" && /\d+/.test(options.from_line)) {
      options.from_line = parseInt(options.from_line);
    }
    if (Number.isInteger(options.from_line)) {
      if (options.from_line <= 0) {
        throw new Error(`Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts2.from_line)}`);
      }
    } else {
      throw new Error(`Invalid Option: from_line must be an integer, got ${JSON.stringify(opts2.from_line)}`);
    }
  }
  if (options.ignore_last_delimiters === void 0 || options.ignore_last_delimiters === null) {
    options.ignore_last_delimiters = false;
  } else if (typeof options.ignore_last_delimiters === "number") {
    options.ignore_last_delimiters = Math.floor(options.ignore_last_delimiters);
    if (options.ignore_last_delimiters === 0) {
      options.ignore_last_delimiters = false;
    }
  } else if (typeof options.ignore_last_delimiters !== "boolean") {
    throw new CsvError("CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS", [
      "Invalid option `ignore_last_delimiters`:",
      "the value must be a boolean value or an integer,",
      `got ${JSON.stringify(options.ignore_last_delimiters)}`
    ], options);
  }
  if (options.ignore_last_delimiters === true && options.columns === false) {
    throw new CsvError("CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS", [
      "The option `ignore_last_delimiters`",
      "requires the activation of the `columns` option"
    ], options);
  }
  if (options.info === void 0 || options.info === null || options.info === false) {
    options.info = false;
  } else if (options.info !== true) {
    throw new Error(`Invalid Option: info must be true, got ${JSON.stringify(options.info)}`);
  }
  if (options.max_record_size === void 0 || options.max_record_size === null || options.max_record_size === false) {
    options.max_record_size = 0;
  } else if (Number.isInteger(options.max_record_size) && options.max_record_size >= 0) {
  } else if (typeof options.max_record_size === "string" && /\d+/.test(options.max_record_size)) {
    options.max_record_size = parseInt(options.max_record_size);
  } else {
    throw new Error(`Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`);
  }
  if (options.objname === void 0 || options.objname === null || options.objname === false) {
    options.objname = void 0;
  } else if (Buffer.isBuffer(options.objname)) {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty buffer`);
    }
    if (options.encoding === null) {
    } else {
      options.objname = options.objname.toString(options.encoding);
    }
  } else if (typeof options.objname === "string") {
    if (options.objname.length === 0) {
      throw new Error(`Invalid Option: objname must be a non empty string`);
    }
  } else if (typeof options.objname === "number") {
  } else {
    throw new Error(`Invalid Option: objname must be a string or a buffer, got ${options.objname}`);
  }
  if (options.objname !== void 0) {
    if (typeof options.objname === "number") {
      if (options.columns !== false) {
        throw Error("Invalid Option: objname index cannot be combined with columns or be defined as a field");
      }
    } else {
      if (options.columns === false) {
        throw Error("Invalid Option: objname field must be combined with columns or be defined as an index");
      }
    }
  }
  if (options.on_record === void 0 || options.on_record === null) {
    options.on_record = void 0;
  } else if (typeof options.on_record !== "function") {
    throw new CsvError("CSV_INVALID_OPTION_ON_RECORD", [
      "Invalid option `on_record`:",
      "expect a function,",
      `got ${JSON.stringify(options.on_record)}`
    ], options);
  }
  if (options.on_skip !== void 0 && options.on_skip !== null && typeof options.on_skip !== "function") {
    throw new Error(`Invalid Option: on_skip must be a function, got ${JSON.stringify(options.on_skip)}`);
  }
  if (options.quote === null || options.quote === false || options.quote === "") {
    options.quote = null;
  } else {
    if (options.quote === void 0 || options.quote === true) {
      options.quote = Buffer.from('"', options.encoding);
    } else if (typeof options.quote === "string") {
      options.quote = Buffer.from(options.quote, options.encoding);
    }
    if (!Buffer.isBuffer(options.quote)) {
      throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`);
    }
  }
  if (options.raw === void 0 || options.raw === null || options.raw === false) {
    options.raw = false;
  } else if (options.raw !== true) {
    throw new Error(`Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`);
  }
  if (options.record_delimiter === void 0) {
    options.record_delimiter = [];
  } else if (typeof options.record_delimiter === "string" || Buffer.isBuffer(options.record_delimiter)) {
    if (options.record_delimiter.length === 0) {
      throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
        "Invalid option `record_delimiter`:",
        "value must be a non empty string or buffer,",
        `got ${JSON.stringify(options.record_delimiter)}`
      ], options);
    }
    options.record_delimiter = [options.record_delimiter];
  } else if (!Array.isArray(options.record_delimiter)) {
    throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
      "Invalid option `record_delimiter`:",
      "value must be a string, a buffer or array of string|buffer,",
      `got ${JSON.stringify(options.record_delimiter)}`
    ], options);
  }
  options.record_delimiter = options.record_delimiter.map(function(rd, i) {
    if (typeof rd !== "string" && !Buffer.isBuffer(rd)) {
      throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
        "Invalid option `record_delimiter`:",
        "value must be a string, a buffer or array of string|buffer",
        `at index ${i},`,
        `got ${JSON.stringify(rd)}`
      ], options);
    } else if (rd.length === 0) {
      throw new CsvError("CSV_INVALID_OPTION_RECORD_DELIMITER", [
        "Invalid option `record_delimiter`:",
        "value must be a non empty string or buffer",
        `at index ${i},`,
        `got ${JSON.stringify(rd)}`
      ], options);
    }
    if (typeof rd === "string") {
      rd = Buffer.from(rd, options.encoding);
    }
    return rd;
  });
  if (typeof options.relax_column_count === "boolean") {
  } else if (options.relax_column_count === void 0 || options.relax_column_count === null) {
    options.relax_column_count = false;
  } else {
    throw new Error(`Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`);
  }
  if (typeof options.relax_column_count_less === "boolean") {
  } else if (options.relax_column_count_less === void 0 || options.relax_column_count_less === null) {
    options.relax_column_count_less = false;
  } else {
    throw new Error(`Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`);
  }
  if (typeof options.relax_column_count_more === "boolean") {
  } else if (options.relax_column_count_more === void 0 || options.relax_column_count_more === null) {
    options.relax_column_count_more = false;
  } else {
    throw new Error(`Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`);
  }
  if (typeof options.relax_quotes === "boolean") {
  } else if (options.relax_quotes === void 0 || options.relax_quotes === null) {
    options.relax_quotes = false;
  } else {
    throw new Error(`Invalid Option: relax_quotes must be a boolean, got ${JSON.stringify(options.relax_quotes)}`);
  }
  if (typeof options.skip_empty_lines === "boolean") {
  } else if (options.skip_empty_lines === void 0 || options.skip_empty_lines === null) {
    options.skip_empty_lines = false;
  } else {
    throw new Error(`Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`);
  }
  if (typeof options.skip_records_with_empty_values === "boolean") {
  } else if (options.skip_records_with_empty_values === void 0 || options.skip_records_with_empty_values === null) {
    options.skip_records_with_empty_values = false;
  } else {
    throw new Error(`Invalid Option: skip_records_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_records_with_empty_values)}`);
  }
  if (typeof options.skip_records_with_error === "boolean") {
  } else if (options.skip_records_with_error === void 0 || options.skip_records_with_error === null) {
    options.skip_records_with_error = false;
  } else {
    throw new Error(`Invalid Option: skip_records_with_error must be a boolean, got ${JSON.stringify(options.skip_records_with_error)}`);
  }
  if (options.rtrim === void 0 || options.rtrim === null || options.rtrim === false) {
    options.rtrim = false;
  } else if (options.rtrim !== true) {
    throw new Error(`Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`);
  }
  if (options.ltrim === void 0 || options.ltrim === null || options.ltrim === false) {
    options.ltrim = false;
  } else if (options.ltrim !== true) {
    throw new Error(`Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`);
  }
  if (options.trim === void 0 || options.trim === null || options.trim === false) {
    options.trim = false;
  } else if (options.trim !== true) {
    throw new Error(`Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`);
  }
  if (options.trim === true && opts2.ltrim !== false) {
    options.ltrim = true;
  } else if (options.ltrim !== true) {
    options.ltrim = false;
  }
  if (options.trim === true && opts2.rtrim !== false) {
    options.rtrim = true;
  } else if (options.rtrim !== true) {
    options.rtrim = false;
  }
  if (options.to === void 0 || options.to === null) {
    options.to = -1;
  } else {
    if (typeof options.to === "string" && /\d+/.test(options.to)) {
      options.to = parseInt(options.to);
    }
    if (Number.isInteger(options.to)) {
      if (options.to <= 0) {
        throw new Error(`Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts2.to)}`);
      }
    } else {
      throw new Error(`Invalid Option: to must be an integer, got ${JSON.stringify(opts2.to)}`);
    }
  }
  if (options.to_line === void 0 || options.to_line === null) {
    options.to_line = -1;
  } else {
    if (typeof options.to_line === "string" && /\d+/.test(options.to_line)) {
      options.to_line = parseInt(options.to_line);
    }
    if (Number.isInteger(options.to_line)) {
      if (options.to_line <= 0) {
        throw new Error(`Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts2.to_line)}`);
      }
    } else {
      throw new Error(`Invalid Option: to_line must be an integer, got ${JSON.stringify(opts2.to_line)}`);
    }
  }
  return options;
};

// node_modules/csv-parse/lib/api/index.js
var isRecordEmpty = function(record) {
  return record.every((field) => field == null || field.toString && field.toString().trim() === "");
};
var cr2 = 13;
var nl2 = 10;
var boms = {
  "utf8": Buffer.from([239, 187, 191]),
  "utf16le": Buffer.from([255, 254])
};
var transform = function(original_options = {}) {
  const info2 = {
    bytes: 0,
    comment_lines: 0,
    empty_lines: 0,
    invalid_field_length: 0,
    lines: 1,
    records: 0
  };
  const options = normalize_options(original_options);
  return {
    info: info2,
    original_options,
    options,
    state: init_state(options),
    __needMoreData: function(i, bufLen, end) {
      if (end)
        return false;
      const { encoding, escape, quote } = this.options;
      const { quoting, needMoreDataSize, recordDelimiterMaxLength } = this.state;
      const numOfCharLeft = bufLen - i - 1;
      const requiredLength = Math.max(
        needMoreDataSize,
        recordDelimiterMaxLength === 0 ? Buffer.from("\r\n", encoding).length : recordDelimiterMaxLength,
        quoting ? (escape === null ? 0 : escape.length) + quote.length : 0,
        quoting ? quote.length + recordDelimiterMaxLength : 0
      );
      return numOfCharLeft < requiredLength;
    },
    parse: function(nextBuf, end, push2, close2) {
      const { bom, comment_no_infix, encoding, from_line, ltrim, max_record_size, raw, relax_quotes, rtrim, skip_empty_lines, to, to_line } = this.options;
      let { comment, escape, quote, record_delimiter } = this.options;
      const { bomSkipped, previousBuf, rawBuffer, escapeIsQuote } = this.state;
      let buf;
      if (previousBuf === void 0) {
        if (nextBuf === void 0) {
          close2();
          return;
        } else {
          buf = nextBuf;
        }
      } else if (previousBuf !== void 0 && nextBuf === void 0) {
        buf = previousBuf;
      } else {
        buf = Buffer.concat([previousBuf, nextBuf]);
      }
      if (bomSkipped === false) {
        if (bom === false) {
          this.state.bomSkipped = true;
        } else if (buf.length < 3) {
          if (end === false) {
            this.state.previousBuf = buf;
            return;
          }
        } else {
          for (const encoding2 in boms) {
            if (boms[encoding2].compare(buf, 0, boms[encoding2].length) === 0) {
              const bomLength = boms[encoding2].length;
              this.state.bufBytesStart += bomLength;
              buf = buf.slice(bomLength);
              this.options = normalize_options({ ...this.original_options, encoding: encoding2 });
              ({ comment, escape, quote } = this.options);
              break;
            }
          }
          this.state.bomSkipped = true;
        }
      }
      const bufLen = buf.length;
      let pos;
      for (pos = 0; pos < bufLen; pos++) {
        if (this.__needMoreData(pos, bufLen, end)) {
          break;
        }
        if (this.state.wasRowDelimiter === true) {
          this.info.lines++;
          this.state.wasRowDelimiter = false;
        }
        if (to_line !== -1 && this.info.lines > to_line) {
          this.state.stop = true;
          close2();
          return;
        }
        if (this.state.quoting === false && record_delimiter.length === 0) {
          const record_delimiterCount = this.__autoDiscoverRecordDelimiter(buf, pos);
          if (record_delimiterCount) {
            record_delimiter = this.options.record_delimiter;
          }
        }
        const chr = buf[pos];
        if (raw === true) {
          rawBuffer.append(chr);
        }
        if ((chr === cr2 || chr === nl2) && this.state.wasRowDelimiter === false) {
          this.state.wasRowDelimiter = true;
        }
        if (this.state.escaping === true) {
          this.state.escaping = false;
        } else {
          if (escape !== null && this.state.quoting === true && this.__isEscape(buf, pos, chr) && pos + escape.length < bufLen) {
            if (escapeIsQuote) {
              if (this.__isQuote(buf, pos + escape.length)) {
                this.state.escaping = true;
                pos += escape.length - 1;
                continue;
              }
            } else {
              this.state.escaping = true;
              pos += escape.length - 1;
              continue;
            }
          }
          if (this.state.commenting === false && this.__isQuote(buf, pos)) {
            if (this.state.quoting === true) {
              const nextChr = buf[pos + quote.length];
              const isNextChrTrimable = rtrim && this.__isCharTrimable(buf, pos + quote.length);
              const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos + quote.length, nextChr);
              const isNextChrDelimiter = this.__isDelimiter(buf, pos + quote.length, nextChr);
              const isNextChrRecordDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRecordDelimiter(buf, pos + quote.length) : this.__isRecordDelimiter(nextChr, buf, pos + quote.length);
              if (escape !== null && this.__isEscape(buf, pos, chr) && this.__isQuote(buf, pos + escape.length)) {
                pos += escape.length - 1;
              } else if (!nextChr || isNextChrDelimiter || isNextChrRecordDelimiter || isNextChrComment || isNextChrTrimable) {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                pos += quote.length - 1;
                continue;
              } else if (relax_quotes === false) {
                const err = this.__error(
                  new CsvError("CSV_INVALID_CLOSING_QUOTE", [
                    "Invalid Closing Quote:",
                    `got "${String.fromCharCode(nextChr)}"`,
                    `at line ${this.info.lines}`,
                    "instead of delimiter, record delimiter, trimable character",
                    "(if activated) or comment"
                  ], this.options, this.__infoField())
                );
                if (err !== void 0)
                  return err;
              } else {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                this.state.field.prepend(quote);
                pos += quote.length - 1;
              }
            } else {
              if (this.state.field.length !== 0) {
                if (relax_quotes === false) {
                  const info3 = this.__infoField();
                  const bom2 = Object.keys(boms).map((b) => boms[b].equals(this.state.field.toString()) ? b : false).filter(Boolean)[0];
                  const err = this.__error(
                    new CsvError("INVALID_OPENING_QUOTE", [
                      "Invalid Opening Quote:",
                      `a quote is found on field ${JSON.stringify(info3.column)} at line ${info3.lines}, value is ${JSON.stringify(this.state.field.toString(encoding))}`,
                      bom2 ? `(${bom2} bom)` : void 0
                    ], this.options, info3, {
                      field: this.state.field
                    })
                  );
                  if (err !== void 0)
                    return err;
                }
              } else {
                this.state.quoting = true;
                pos += quote.length - 1;
                continue;
              }
            }
          }
          if (this.state.quoting === false) {
            const recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos);
            if (recordDelimiterLength !== 0) {
              const skipCommentLine = this.state.commenting && (this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0);
              if (skipCommentLine) {
                this.info.comment_lines++;
              } else {
                if (this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1 : 0) >= from_line) {
                  this.state.enabled = true;
                  this.__resetField();
                  this.__resetRecord();
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                if (skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0) {
                  this.info.empty_lines++;
                  pos += recordDelimiterLength - 1;
                  continue;
                }
                this.info.bytes = this.state.bufBytesStart + pos;
                const errField = this.__onField();
                if (errField !== void 0)
                  return errField;
                this.info.bytes = this.state.bufBytesStart + pos + recordDelimiterLength;
                const errRecord = this.__onRecord(push2);
                if (errRecord !== void 0)
                  return errRecord;
                if (to !== -1 && this.info.records >= to) {
                  this.state.stop = true;
                  close2();
                  return;
                }
              }
              this.state.commenting = false;
              pos += recordDelimiterLength - 1;
              continue;
            }
            if (this.state.commenting) {
              continue;
            }
            if (comment !== null && (comment_no_infix === false || this.state.record.length === 0 && this.state.field.length === 0)) {
              const commentCount = this.__compareBytes(comment, buf, pos, chr);
              if (commentCount !== 0) {
                this.state.commenting = true;
                continue;
              }
            }
            const delimiterLength = this.__isDelimiter(buf, pos, chr);
            if (delimiterLength !== 0) {
              this.info.bytes = this.state.bufBytesStart + pos;
              const errField = this.__onField();
              if (errField !== void 0)
                return errField;
              pos += delimiterLength - 1;
              continue;
            }
          }
        }
        if (this.state.commenting === false) {
          if (max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size) {
            return this.__error(
              new CsvError("CSV_MAX_RECORD_SIZE", [
                "Max Record Size:",
                "record exceed the maximum number of tolerated bytes",
                `of ${max_record_size}`,
                `at line ${this.info.lines}`
              ], this.options, this.__infoField())
            );
          }
        }
        const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(buf, pos);
        const rappend = rtrim === false || this.state.wasQuoting === false;
        if (lappend === true && rappend === true) {
          this.state.field.append(chr);
        } else if (rtrim === true && !this.__isCharTrimable(buf, pos)) {
          return this.__error(
            new CsvError("CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE", [
              "Invalid Closing Quote:",
              "found non trimable byte after quote",
              `at line ${this.info.lines}`
            ], this.options, this.__infoField())
          );
        } else {
          if (lappend === false) {
            pos += this.__isCharTrimable(buf, pos) - 1;
          }
          continue;
        }
      }
      if (end === true) {
        if (this.state.quoting === true) {
          const err = this.__error(
            new CsvError("CSV_QUOTE_NOT_CLOSED", [
              "Quote Not Closed:",
              `the parsing is finished with an opening quote at line ${this.info.lines}`
            ], this.options, this.__infoField())
          );
          if (err !== void 0)
            return err;
        } else {
          if (this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0) {
            this.info.bytes = this.state.bufBytesStart + pos;
            const errField = this.__onField();
            if (errField !== void 0)
              return errField;
            const errRecord = this.__onRecord(push2);
            if (errRecord !== void 0)
              return errRecord;
          } else if (this.state.wasRowDelimiter === true) {
            this.info.empty_lines++;
          } else if (this.state.commenting === true) {
            this.info.comment_lines++;
          }
        }
      } else {
        this.state.bufBytesStart += pos;
        this.state.previousBuf = buf.slice(pos);
      }
      if (this.state.wasRowDelimiter === true) {
        this.info.lines++;
        this.state.wasRowDelimiter = false;
      }
    },
    __onRecord: function(push2) {
      const { columns, group_columns_by_name, encoding, info: info3, from, relax_column_count, relax_column_count_less, relax_column_count_more, raw, skip_records_with_empty_values } = this.options;
      const { enabled, record } = this.state;
      if (enabled === false) {
        return this.__resetRecord();
      }
      const recordLength = record.length;
      if (columns === true) {
        if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
          this.__resetRecord();
          return;
        }
        return this.__firstLineToColumns(record);
      }
      if (columns === false && this.info.records === 0) {
        this.state.expectedRecordLength = recordLength;
      }
      if (recordLength !== this.state.expectedRecordLength) {
        const err = columns === false ? new CsvError("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH", [
          "Invalid Record Length:",
          `expect ${this.state.expectedRecordLength},`,
          `got ${recordLength} on line ${this.info.lines}`
        ], this.options, this.__infoField(), {
          record
        }) : new CsvError("CSV_RECORD_INCONSISTENT_COLUMNS", [
          "Invalid Record Length:",
          `columns length is ${columns.length},`,
          `got ${recordLength} on line ${this.info.lines}`
        ], this.options, this.__infoField(), {
          record
        });
        if (relax_column_count === true || relax_column_count_less === true && recordLength < this.state.expectedRecordLength || relax_column_count_more === true && recordLength > this.state.expectedRecordLength) {
          this.info.invalid_field_length++;
          this.state.error = err;
        } else {
          const finalErr = this.__error(err);
          if (finalErr)
            return finalErr;
        }
      }
      if (skip_records_with_empty_values === true && isRecordEmpty(record)) {
        this.__resetRecord();
        return;
      }
      if (this.state.recordHasError === true) {
        this.__resetRecord();
        this.state.recordHasError = false;
        return;
      }
      this.info.records++;
      if (from === 1 || this.info.records >= from) {
        const { objname } = this.options;
        if (columns !== false) {
          const obj = {};
          for (let i = 0, l = record.length; i < l; i++) {
            if (columns[i] === void 0 || columns[i].disabled)
              continue;
            if (group_columns_by_name === true && obj[columns[i].name] !== void 0) {
              if (Array.isArray(obj[columns[i].name])) {
                obj[columns[i].name] = obj[columns[i].name].concat(record[i]);
              } else {
                obj[columns[i].name] = [obj[columns[i].name], record[i]];
              }
            } else {
              obj[columns[i].name] = record[i];
            }
          }
          if (raw === true || info3 === true) {
            const extRecord = Object.assign(
              { record: obj },
              raw === true ? { raw: this.state.rawBuffer.toString(encoding) } : {},
              info3 === true ? { info: this.__infoRecord() } : {}
            );
            const err = this.__push(
              objname === void 0 ? extRecord : [obj[objname], extRecord],
              push2
            );
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(
              objname === void 0 ? obj : [obj[objname], obj],
              push2
            );
            if (err) {
              return err;
            }
          }
        } else {
          if (raw === true || info3 === true) {
            const extRecord = Object.assign(
              { record },
              raw === true ? { raw: this.state.rawBuffer.toString(encoding) } : {},
              info3 === true ? { info: this.__infoRecord() } : {}
            );
            const err = this.__push(
              objname === void 0 ? extRecord : [record[objname], extRecord],
              push2
            );
            if (err) {
              return err;
            }
          } else {
            const err = this.__push(
              objname === void 0 ? record : [record[objname], record],
              push2
            );
            if (err) {
              return err;
            }
          }
        }
      }
      this.__resetRecord();
    },
    __firstLineToColumns: function(record) {
      const { firstLineToHeaders } = this.state;
      try {
        const headers = firstLineToHeaders === void 0 ? record : firstLineToHeaders.call(null, record);
        if (!Array.isArray(headers)) {
          return this.__error(
            new CsvError("CSV_INVALID_COLUMN_MAPPING", [
              "Invalid Column Mapping:",
              "expect an array from column function,",
              `got ${JSON.stringify(headers)}`
            ], this.options, this.__infoField(), {
              headers
            })
          );
        }
        const normalizedHeaders = normalize_columns_array(headers);
        this.state.expectedRecordLength = normalizedHeaders.length;
        this.options.columns = normalizedHeaders;
        this.__resetRecord();
        return;
      } catch (err) {
        return err;
      }
    },
    __resetRecord: function() {
      if (this.options.raw === true) {
        this.state.rawBuffer.reset();
      }
      this.state.error = void 0;
      this.state.record = [];
      this.state.record_length = 0;
    },
    __onField: function() {
      const { cast, encoding, rtrim, max_record_size } = this.options;
      const { enabled, wasQuoting } = this.state;
      if (enabled === false) {
        return this.__resetField();
      }
      let field = this.state.field.toString(encoding);
      if (rtrim === true && wasQuoting === false) {
        field = field.trimRight();
      }
      if (cast === true) {
        const [err, f] = this.__cast(field);
        if (err !== void 0)
          return err;
        field = f;
      }
      this.state.record.push(field);
      if (max_record_size !== 0 && typeof field === "string") {
        this.state.record_length += field.length;
      }
      this.__resetField();
    },
    __resetField: function() {
      this.state.field.reset();
      this.state.wasQuoting = false;
    },
    __push: function(record, push2) {
      const { on_record } = this.options;
      if (on_record !== void 0) {
        const info3 = this.__infoRecord();
        try {
          record = on_record.call(null, record, info3);
        } catch (err) {
          return err;
        }
        if (record === void 0 || record === null) {
          return;
        }
      }
      push2(record);
    },
    __cast: function(field) {
      const { columns, relax_column_count } = this.options;
      const isColumns = Array.isArray(columns);
      if (isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length) {
        return [void 0, void 0];
      }
      if (this.state.castField !== null) {
        try {
          const info3 = this.__infoField();
          return [void 0, this.state.castField.call(null, field, info3)];
        } catch (err) {
          return [err];
        }
      }
      if (this.__isFloat(field)) {
        return [void 0, parseFloat(field)];
      } else if (this.options.cast_date !== false) {
        const info3 = this.__infoField();
        return [void 0, this.options.cast_date.call(null, field, info3)];
      }
      return [void 0, field];
    },
    __isCharTrimable: function(buf, pos) {
      const isTrim = (buf2, pos2) => {
        const { timchars } = this.state;
        loop1:
          for (let i = 0; i < timchars.length; i++) {
            const timchar = timchars[i];
            for (let j = 0; j < timchar.length; j++) {
              if (timchar[j] !== buf2[pos2 + j])
                continue loop1;
            }
            return timchar.length;
          }
        return 0;
      };
      return isTrim(buf, pos);
    },
    __isFloat: function(value2) {
      return value2 - parseFloat(value2) + 1 >= 0;
    },
    __compareBytes: function(sourceBuf, targetBuf, targetPos, firstByte) {
      if (sourceBuf[0] !== firstByte)
        return 0;
      const sourceLength = sourceBuf.length;
      for (let i = 1; i < sourceLength; i++) {
        if (sourceBuf[i] !== targetBuf[targetPos + i])
          return 0;
      }
      return sourceLength;
    },
    __isDelimiter: function(buf, pos, chr) {
      const { delimiter: delimiter2, ignore_last_delimiters } = this.options;
      if (ignore_last_delimiters === true && this.state.record.length === this.options.columns.length - 1) {
        return 0;
      } else if (ignore_last_delimiters !== false && typeof ignore_last_delimiters === "number" && this.state.record.length === ignore_last_delimiters - 1) {
        return 0;
      }
      loop1:
        for (let i = 0; i < delimiter2.length; i++) {
          const del = delimiter2[i];
          if (del[0] === chr) {
            for (let j = 1; j < del.length; j++) {
              if (del[j] !== buf[pos + j])
                continue loop1;
            }
            return del.length;
          }
        }
      return 0;
    },
    __isRecordDelimiter: function(chr, buf, pos) {
      const { record_delimiter } = this.options;
      const recordDelimiterLength = record_delimiter.length;
      loop1:
        for (let i = 0; i < recordDelimiterLength; i++) {
          const rd = record_delimiter[i];
          const rdLength = rd.length;
          if (rd[0] !== chr) {
            continue;
          }
          for (let j = 1; j < rdLength; j++) {
            if (rd[j] !== buf[pos + j]) {
              continue loop1;
            }
          }
          return rd.length;
        }
      return 0;
    },
    __isEscape: function(buf, pos, chr) {
      const { escape } = this.options;
      if (escape === null)
        return false;
      const l = escape.length;
      if (escape[0] === chr) {
        for (let i = 0; i < l; i++) {
          if (escape[i] !== buf[pos + i]) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    __isQuote: function(buf, pos) {
      const { quote } = this.options;
      if (quote === null)
        return false;
      const l = quote.length;
      for (let i = 0; i < l; i++) {
        if (quote[i] !== buf[pos + i]) {
          return false;
        }
      }
      return true;
    },
    __autoDiscoverRecordDelimiter: function(buf, pos) {
      const { encoding } = this.options;
      const rds = [
        Buffer.from("\r\n", encoding),
        Buffer.from("\n", encoding),
        Buffer.from("\r", encoding)
      ];
      loop:
        for (let i = 0; i < rds.length; i++) {
          const l = rds[i].length;
          for (let j = 0; j < l; j++) {
            if (rds[i][j] !== buf[pos + j]) {
              continue loop;
            }
          }
          this.options.record_delimiter.push(rds[i]);
          this.state.recordDelimiterMaxLength = rds[i].length;
          return rds[i].length;
        }
      return 0;
    },
    __error: function(msg) {
      const { encoding, raw, skip_records_with_error } = this.options;
      const err = typeof msg === "string" ? new Error(msg) : msg;
      if (skip_records_with_error) {
        this.state.recordHasError = true;
        if (this.options.on_skip !== void 0) {
          this.options.on_skip(err, raw ? this.state.rawBuffer.toString(encoding) : void 0);
        }
        return void 0;
      } else {
        return err;
      }
    },
    __infoDataSet: function() {
      return {
        ...this.info,
        columns: this.options.columns
      };
    },
    __infoRecord: function() {
      const { columns, raw, encoding } = this.options;
      return {
        ...this.__infoDataSet(),
        error: this.state.error,
        header: columns === true,
        index: this.state.record.length,
        raw: raw ? this.state.rawBuffer.toString(encoding) : void 0
      };
    },
    __infoField: function() {
      const { columns } = this.options;
      const isColumns = Array.isArray(columns);
      return {
        ...this.__infoRecord(),
        column: isColumns === true ? columns.length > this.state.record.length ? columns[this.state.record.length].name : null : this.state.record.length,
        quoting: this.state.wasQuoting
      };
    }
  };
};

// node_modules/csv-parse/lib/index.js
var Parser = class extends Transform {
  constructor(opts2 = {}) {
    super({ ...{ readableObjectMode: true }, ...opts2, encoding: null });
    this.api = transform({ on_skip: (err, chunk) => {
      this.emit("skip", err, chunk);
    }, ...opts2 });
    this.state = this.api.state;
    this.options = this.api.options;
    this.info = this.api.info;
  }
  _transform(buf, _, callback) {
    if (this.state.stop === true) {
      return;
    }
    const err = this.api.parse(buf, false, (record) => {
      this.push(record);
    }, () => {
      this.push(null);
      this.end();
      this.on("end", this.destroy);
    });
    if (err !== void 0) {
      this.state.stop = true;
    }
    callback(err);
  }
  _flush(callback) {
    if (this.state.stop === true) {
      return;
    }
    const err = this.api.parse(void 0, true, (record) => {
      this.push(record);
    }, () => {
      this.push(null);
      this.on("end", this.destroy);
    });
    callback(err);
  }
};
var parse = function() {
  let data, options, callback;
  for (const i in arguments) {
    const argument2 = arguments[i];
    const type = typeof argument2;
    if (data === void 0 && (typeof argument2 === "string" || Buffer.isBuffer(argument2))) {
      data = argument2;
    } else if (options === void 0 && is_object(argument2)) {
      options = argument2;
    } else if (callback === void 0 && type === "function") {
      callback = argument2;
    } else {
      throw new CsvError("CSV_INVALID_ARGUMENT", [
        "Invalid argument:",
        `got ${JSON.stringify(argument2)} at index ${i}`
      ], options || {});
    }
  }
  const parser = new Parser(options);
  if (callback) {
    const records = options === void 0 || options.objname === void 0 ? [] : {};
    parser.on("readable", function() {
      let record;
      while ((record = this.read()) !== null) {
        if (options === void 0 || options.objname === void 0) {
          records.push(record);
        } else {
          records[record[0]] = record[1];
        }
      }
    });
    parser.on("error", function(err) {
      callback(err, void 0, parser.api.__infoDataSet());
    });
    parser.on("end", function() {
      callback(void 0, records, parser.api.__infoDataSet());
    });
  }
  if (data !== void 0) {
    const writer = function() {
      parser.write(data);
      parser.end();
    };
    if (typeof setImmediate === "function") {
      setImmediate(writer);
    } else {
      setTimeout(writer, 0);
    }
  }
  return parser;
};

// output-es/Data.Csv/foreign.js
function parseCsvImpl(csvLine) {
  return function(onError, onSuccess) {
    parse(csvLine, {
      bom: true,
      quote: '"',
      columns: false,
      relax_column_count: true
    }, function(err, records) {
      if (err) {
        onError(err);
      }
      onSuccess(records);
    });
    return function(cancelError, onCancelerError, onCancelerSuccess) {
      onCancelerSuccess();
    };
  };
}
function rowsToColumnsImpl(rows) {
  if (rows.length === 0)
    return [];
  const numColumns = rows[0].length;
  const columns = Array(numColumns).fill().map(() => []);
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < numColumns; j++) {
      var value2 = rows[i][j];
      if (typeof value2 === "undefined") {
        columns[j].push("");
      } else {
        columns[j].push(rows[i][j]);
      }
    }
  }
  return columns;
}

// output-es/Data.Csv/index.js
var toCsvRow = (v) => {
  if (v.length === 0) {
    return [];
  }
  return arrayMap((tpls) => tpls)(zipWithImpl(Tuple, rangeImpl(2, v.length + 1 | 0), v));
};
var readCsv = (x) => _bind(toAff2(readTextFile)(UTF8)(x))((csvContent) => fromEffectFnAff(parseCsvImpl(csvContent)));
var readCsv$p = (x) => readCsv(x.filepath);
var getRow = (v) => v._2;
var getLineNo = (v) => v._1;
var parseCsvContent = (v) => {
  if (v.headers.tag === "Nothing") {
    return { headers: [], index: [], columns: [] };
  }
  if (v.headers.tag === "Just") {
    if (v.rows.tag === "Nothing") {
      return { headers: v.headers._1, index: [], columns: replicateImpl(v.headers._1.length, []) };
    }
    if (v.rows.tag === "Just") {
      return { headers: v.headers._1, index: arrayMap(getLineNo)(v.rows._1), columns: rowsToColumnsImpl(arrayMap(getRow)(v.rows._1)) };
    }
  }
  fail();
};
var filterBadRows = (v) => {
  if (v.headers.tag === "Nothing") {
    return $Tuple([], v);
  }
  if (v.headers.tag === "Just") {
    if (v.rows.tag === "Nothing") {
      return $Tuple([], v);
    }
    if (v.rows.tag === "Just") {
      const headerLength = v.headers._1.length;
      const v1 = partitionImpl((row) => row._2.length === headerLength, v.rows._1);
      return $Tuple(arrayMap(getLineNo)(v1.no), { headers: v.headers, rows: $Maybe("Just", v1.yes) });
    }
  }
  fail();
};
var createRawContent = (recs) => ({
  headers: 0 < recs.length ? $Maybe("Just", recs[0]) : Nothing,
  rows: (() => {
    const $0 = unconsImpl((v) => Nothing, (v) => (xs) => $Maybe("Just", xs), recs);
    if ($0.tag === "Just") {
      return $Maybe("Just", toCsvRow($0._1));
    }
    return Nothing;
  })()
});

// output-es/Data.Hashable/foreign.js
function hashString(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = 31 * h + s.charCodeAt(i) | 0;
  }
  return h;
}

// output-es/Data.Hashable/index.js
var hashableString = { hash: hashString, Eq0: () => eqString };

// output-es/Data.Validation.Issue/index.js
var $Issue = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var NotImplemented = /* @__PURE__ */ $Issue("NotImplemented");
var showId = {
  show: (v) => {
    if (v.tag === "NotImplemented") {
      return "Not Implemented";
    }
    if (v.tag === "Issue") {
      return v._1;
    }
    if (v.tag === "InvalidValue") {
      return "invalid value " + showStringImpl(v._1) + ": " + v._2;
    }
    if (v.tag === "InvalidCSV") {
      return v._1;
    }
    if (v.tag === "InvalidItem") {
      return v._3;
    }
    fail();
  }
};
var toInvaildItem = (v) => (v1) => (v2) => {
  if (v2.tag === "NotImplemented") {
    return NotImplemented;
  }
  return $Issue("InvalidItem", v, v1, showId.show(v2));
};
var withRowInfo = (fp) => (row) => (v2) => {
  if (v2.tag === "Left") {
    return $Either("Left", arrayMap(toInvaildItem(fp)(row))(v2._1));
  }
  if (v2.tag === "Right") {
    return $Either("Right", v2._1);
  }
  fail();
};

// output-es/Data.List.NonEmpty/index.js
var zipWith4 = (f) => (v) => (v1) => $NonEmpty(f(v._1)(v1._1), zipWith2(f)(v._2)(v1._2));

// output-es/StringParser.Parser/index.js
var functorParser = {
  map: (f) => (v) => (x) => {
    const $0 = v(x);
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return $Either("Right", { result: f($0._1.result), suffix: $0._1.suffix });
    }
    fail();
  }
};
var applyParser = {
  apply: (v) => (v1) => (s) => {
    const $0 = v(s);
    return (() => {
      if ($0.tag === "Left") {
        const $1 = $0._1;
        return (v$1) => $Either("Left", $1);
      }
      if ($0.tag === "Right") {
        const $1 = $0._1;
        return (f) => f($1);
      }
      fail();
    })()((v2) => {
      const $1 = v1(v2.suffix);
      return (() => {
        if ($1.tag === "Left") {
          const $2 = $1._1;
          return (v$1) => $Either("Left", $2);
        }
        if ($1.tag === "Right") {
          const $2 = $1._1;
          return (f) => f($2);
        }
        fail();
      })()((v3) => $Either("Right", { result: v2.result(v3.result), suffix: v3.suffix }));
    });
  },
  Functor0: () => functorParser
};
var bindParser = {
  bind: (v) => (f) => (s) => {
    const $0 = v(s);
    return (() => {
      if ($0.tag === "Left") {
        const $1 = $0._1;
        return (v$1) => $Either("Left", $1);
      }
      if ($0.tag === "Right") {
        const $1 = $0._1;
        return (f$1) => f$1($1);
      }
      fail();
    })()((v1) => f(v1.result)(v1.suffix));
  },
  Apply0: () => applyParser
};
var applicativeParser = { pure: (a) => (s) => $Either("Right", { result: a, suffix: s }), Apply0: () => applyParser };
var monadParser = { Applicative0: () => applicativeParser, Bind1: () => bindParser };
var monadRecParser = {
  tailRecM: (f) => (a) => (str) => {
    const $0 = (st) => {
      const $02 = f(st.state)(st.str);
      if ($02.tag === "Left") {
        return $Either("Left", $02._1);
      }
      if ($02.tag === "Right") {
        return $Either(
          "Right",
          (() => {
            if ($02._1.result.tag === "Loop") {
              return $Step("Loop", { state: $02._1.result._1, str: $02._1.suffix });
            }
            if ($02._1.result.tag === "Done") {
              return $Step("Done", { result: $02._1.result._1, suffix: $02._1.suffix });
            }
            fail();
          })()
        );
      }
      fail();
    };
    const $1 = (v) => {
      if (v.tag === "Left") {
        return $Step("Done", $Either("Left", v._1));
      }
      if (v.tag === "Right") {
        if (v._1.tag === "Loop") {
          return $Step("Loop", $0(v._1._1));
        }
        if (v._1.tag === "Done") {
          return $Step("Done", $Either("Right", v._1._1));
        }
      }
      fail();
    };
    const go = (go$a0$copy) => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Loop") {
          go$a0 = $1(v._1);
          continue;
        }
        if (v.tag === "Done") {
          go$c = false;
          go$r = v._1;
          continue;
        }
        fail();
      }
      return go$r;
    };
    return go($1($0({ state: a, str })));
  },
  Monad0: () => monadParser
};
var altParser = {
  alt: (v) => (v1) => (s) => {
    const v2 = v(s);
    if (v2.tag === "Left") {
      if (s.position === v2._1.pos) {
        return v1(s);
      }
      return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
    }
    return v2;
  },
  Functor0: () => functorParser
};
var plusParser = { empty: (v) => $Either("Left", { pos: v.position, error: "No alternative" }), Alt0: () => altParser };
var alternativeParser = { Applicative0: () => applicativeParser, Plus1: () => plusParser };

// output-es/StringParser.Combinators/index.js
var many = /* @__PURE__ */ (() => {
  const $0 = manyRec(monadRecParser)(alternativeParser);
  return (x) => $0((s) => {
    const v1 = x(s);
    if (v1.tag === "Right") {
      if (s.position < v1._1.suffix.position) {
        return $Either("Right", v1._1);
      }
      return $Either("Left", { pos: s.position, error: "Consumed no input." });
    }
    return v1;
  });
})();
var many1 = (p) => applyParser.apply((x) => {
  const $0 = p(x);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return $Either(
      "Right",
      {
        result: (() => {
          const $1 = $0._1.result;
          return (t) => $NonEmpty($1, t);
        })(),
        suffix: $0._1.suffix
      }
    );
  }
  fail();
})(many(p));
var sepBy1 = (p) => (sep2) => (s) => {
  const $0 = p(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = v1.result;
    const $2 = many(applyParser.apply((x) => {
      const $22 = sep2(x);
      if ($22.tag === "Left") {
        return $Either("Left", $22._1);
      }
      if ($22.tag === "Right") {
        return $Either("Right", { result: identity, suffix: $22._1.suffix });
      }
      fail();
    })(p))(v1.suffix);
    return (() => {
      if ($2.tag === "Left") {
        const $3 = $2._1;
        return (v) => $Either("Left", $3);
      }
      if ($2.tag === "Right") {
        const $3 = $2._1;
        return (f) => f($3);
      }
      fail();
    })()((v1$1) => $Either("Right", { result: $NonEmpty($1, v1$1.result), suffix: v1$1.suffix }));
  });
};

// output-es/StringParser.CodeUnits/index.js
var anyChar = (v) => {
  const v1 = charAt2(0)(v.substring);
  if (v1.tag === "Just") {
    return $Either("Right", { result: v1._1, suffix: { substring: drop2(1)(v.substring), position: v.position + 1 | 0 } });
  }
  if (v1.tag === "Nothing") {
    return $Either("Left", { pos: v.position, error: "Unexpected EOF" });
  }
  fail();
};

// output-es/StringParser.CodePoints/index.js
var elem3 = /* @__PURE__ */ (() => {
  const any1 = foldableArray.foldMap((() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })());
  return (x) => any1(($0) => x === $0);
})();
var upperCaseChar = (s) => {
  const $0 = anyChar(s);
  const v1 = (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v12) => {
    if (elem3(toCharCode(v12.result))(rangeImpl(65, 90))) {
      return $Either("Right", { result: v12.result, suffix: v12.suffix });
    }
    return $Either("Left", { pos: v12.suffix.position, error: "Expected an upper case character but found " + showCharImpl(v12.result) });
  });
  if (v1.tag === "Left") {
    return $Either("Left", { pos: s.position, error: v1._1.error });
  }
  return v1;
};
var string2 = (pattern) => (v) => {
  const length3 = toCodePointArray(pattern).length;
  const v1 = splitAt2(length3)(v.substring);
  if (v1.before === pattern) {
    return $Either("Right", { result: pattern, suffix: { substring: v1.after, position: v.position + length3 | 0 } });
  }
  return $Either("Left", { pos: v.position, error: "Expected '" + pattern + "'." });
};
var lowerCaseChar = (s) => {
  const $0 = anyChar(s);
  const v1 = (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v12) => {
    if (elem3(toCharCode(v12.result))(rangeImpl(97, 122))) {
      return $Either("Right", { result: v12.result, suffix: v12.suffix });
    }
    return $Either("Left", { pos: v12.suffix.position, error: "Expected a lower case character but found " + showCharImpl(v12.result) });
  });
  if (v1.tag === "Left") {
    return $Either("Left", { pos: s.position, error: v1._1.error });
  }
  return v1;
};
var eof = (s) => {
  if (0 < toCodePointArray(s.substring).length) {
    return $Either("Left", { pos: s.position, error: "Expected EOF" });
  }
  return $Either("Right", { result: void 0, suffix: s });
};
var anyLetter = (s) => {
  const v2 = lowerCaseChar(s);
  if (v2.tag === "Left") {
    if (s.position === v2._1.pos) {
      const v2$1 = upperCaseChar(s);
      if (v2$1.tag === "Left") {
        if (s.position === v2$1._1.pos) {
          return $Either("Left", { pos: s.position, error: "Expected a letter" });
        }
        return $Either("Left", { error: v2$1._1.error, pos: v2$1._1.pos });
      }
      return v2$1;
    }
    return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
  }
  return v2;
};
var anyDigit = (s) => {
  const $0 = anyChar(s);
  const v1 = (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v12) => {
    if (v12.result >= "0" && v12.result <= "9") {
      return $Either("Right", { result: v12.result, suffix: v12.suffix });
    }
    return $Either("Left", { pos: v12.suffix.position, error: "Character " + showCharImpl(v12.result) + " is not a digit" });
  });
  if (v1.tag === "Left") {
    return $Either("Left", { pos: s.position, error: v1._1.error });
  }
  return v1;
};
var anyCodePoint = (v) => {
  const v1 = uncons(v.substring);
  if (v1.tag === "Nothing") {
    return $Either("Left", { pos: v.position, error: "Unexpected EOF" });
  }
  if (v1.tag === "Just") {
    return $Either("Right", { result: v1._1.head, suffix: { substring: v1._1.tail, position: v.position + 1 | 0 } });
  }
  fail();
};
var anyChar2 = (s) => {
  const $0 = anyCodePoint(s);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    if ($0._1.result >= 0 && $0._1.result <= 65535) {
      if ($0._1.result > 65535) {
        return $Either("Left", { pos: $0._1.suffix.position, error: "Code point " + showIntImpl($0._1.result) + " is not a character" });
      }
      return $Either("Right", { result: fromCharCode($0._1.result), suffix: $0._1.suffix });
    }
    return $Either("Left", { pos: $0._1.suffix.position, error: "Code point " + showIntImpl($0._1.result) + " is not a character" });
  }
  fail();
};
var satisfy = (f) => (s) => {
  const $0 = anyChar2(s);
  const v1 = (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f$1) => f$1($1);
    }
    fail();
  })()((v12) => {
    if (f(v12.result)) {
      return $Either("Right", { result: v12.result, suffix: v12.suffix });
    }
    return $Either("Left", { pos: v12.suffix.position, error: "Character " + showCharImpl(v12.result) + " did not satisfy predicate" });
  });
  if (v1.tag === "Left") {
    return $Either("Left", { pos: s.position, error: v1._1.error });
  }
  return v1;
};
var $$char = (c) => {
  const $0 = satisfy((v) => v === c);
  const $1 = "Could not match character " + showCharImpl(c);
  return (s) => {
    const v2 = $0(s);
    if (v2.tag === "Left") {
      if (s.position === v2._1.pos) {
        return $Either("Left", { pos: s.position, error: $1 });
      }
      return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
    }
    return v2;
  };
};

// output-es/Data.DDF.Atoms.Identifier/index.js
var value = (v) => v;
var unsafeCreate = (x) => {
  if (x === "") {
    return "undefined_id";
  }
  return x;
};
var showId2 = { show: (v) => "(Id " + showStringImpl(v) + ")" };
var eqId = { eq: (x) => (y) => x === y };
var ordId = { compare: (x) => (y) => ordString.compare(x)(y), Eq0: () => eqId };
var alphaNum = (s) => {
  const v2 = anyLetter(s);
  if (v2.tag === "Left") {
    if (s.position === v2._1.pos) {
      const v2$1 = anyDigit(s);
      if (v2$1.tag === "Left") {
        if (s.position === v2$1._1.pos) {
          return $Either("Left", { pos: s.position, error: "expect alphanumeric value" });
        }
        return $Either("Left", { error: v2$1._1.error, pos: v2$1._1.pos });
      }
      return v2$1;
    }
    return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
  }
  return v2;
};
var alphaNumAnd_ = /* @__PURE__ */ (() => {
  const $0 = $$char("_");
  return (s) => {
    const v2 = alphaNum(s);
    if (v2.tag === "Left") {
      if (s.position === v2._1.pos) {
        const v2$1 = $0(s);
        if (v2$1.tag === "Left") {
          if (s.position === v2$1._1.pos) {
            return $Either("Left", { pos: s.position, error: "expect alphanumeric and underscore _" });
          }
          return $Either("Left", { error: v2$1._1.error, pos: v2$1._1.pos });
        }
        return v2$1;
      }
      return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
    }
    return v2;
  };
})();
var identifier = /* @__PURE__ */ (() => {
  const $0 = foldable1NonEmptyList.Foldable0().foldr;
  return (s) => {
    const $1 = many1(alphaNumAnd_)(s);
    return (() => {
      if ($1.tag === "Left") {
        const $2 = $1._1;
        return (v) => $Either("Left", $2);
      }
      if ($1.tag === "Right") {
        const $2 = $1._1;
        return (f) => f($2);
      }
      fail();
    })()((v1) => {
      const $2 = fromFoldableImpl($0, v1.result);
      return $Either(
        "Right",
        {
          result: (() => {
            if ($2.length === 0) {
              fail();
            }
            return fromCharArray($2);
          })(),
          suffix: v1.suffix
        }
      );
    });
  };
})();
var identifier$p = /* @__PURE__ */ (() => applyParser.apply((x) => {
  const $0 = identifier(x);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return $Either(
      "Right",
      {
        result: (() => {
          const $1 = $0._1.result;
          return (v) => $1;
        })(),
        suffix: $0._1.suffix
      }
    );
  }
  fail();
})(eof))();
var parseId = (x) => {
  const $0 = identifier$p({ substring: x, position: 0 });
  if ($0.tag === "Left") {
    return $Either("Left", [$Issue("InvalidValue", x, $0._1.error + "at pos " + showIntImpl($0._1.pos))]);
  }
  if ($0.tag === "Right") {
    return $Either("Right", $0._1.result);
  }
  fail();
};

// output-es/Data.DDF.Internal/index.js
var $ItemInfo = (_1, _2) => ({ tag: "ItemInfo", _1, _2 });

// output-es/Data.Map.Internal/index.js
var $$$Map = (tag, _1, _2, _3, _4, _5, _6) => ({ tag, _1, _2, _3, _4, _5, _6 });
var $MapIter = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var $MapIterStep = (tag, _1, _2, _3) => ({ tag, _1, _2, _3 });
var $Split = (_1, _2, _3) => ({ tag: "Split", _1, _2, _3 });
var $SplitLast = (_1, _2, _3) => ({ tag: "SplitLast", _1, _2, _3 });
var Leaf2 = /* @__PURE__ */ $$$Map("Leaf");
var IterLeaf = /* @__PURE__ */ $MapIter("IterLeaf");
var IterDone = /* @__PURE__ */ $MapIterStep("IterDone");
var unsafeNode = (k, v, l, r) => {
  if (l.tag === "Leaf") {
    if (r.tag === "Leaf") {
      return $$$Map("Node", 1, 1, k, v, l, r);
    }
    if (r.tag === "Node") {
      return $$$Map("Node", 1 + r._1 | 0, 1 + r._2 | 0, k, v, l, r);
    }
    fail();
  }
  if (l.tag === "Node") {
    if (r.tag === "Leaf") {
      return $$$Map("Node", 1 + l._1 | 0, 1 + l._2 | 0, k, v, l, r);
    }
    if (r.tag === "Node") {
      return $$$Map("Node", l._1 > r._1 ? 1 + l._1 | 0 : 1 + r._1 | 0, (1 + l._2 | 0) + r._2 | 0, k, v, l, r);
    }
  }
  fail();
};
var unsafeBalancedNode = (k, v, l, r) => {
  if (l.tag === "Leaf") {
    if (r.tag === "Leaf") {
      return $$$Map("Node", 1, 1, k, v, Leaf2, Leaf2);
    }
    if (r.tag === "Node" && r._1 > 1) {
      if (r._5.tag === "Node" && (() => {
        if (r._6.tag === "Leaf") {
          return r._5._1 > 0;
        }
        if (r._6.tag === "Node") {
          return r._5._1 > r._6._1;
        }
        fail();
      })()) {
        return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
      }
      return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
    }
    return unsafeNode(k, v, l, r);
  }
  if (l.tag === "Node") {
    if (r.tag === "Node") {
      if (r._1 > (l._1 + 1 | 0)) {
        if (r._5.tag === "Node" && (() => {
          if (r._6.tag === "Leaf") {
            return r._5._1 > 0;
          }
          if (r._6.tag === "Node") {
            return r._5._1 > r._6._1;
          }
          fail();
        })()) {
          return unsafeNode(r._5._3, r._5._4, unsafeNode(k, v, l, r._5._5), unsafeNode(r._3, r._4, r._5._6, r._6));
        }
        return unsafeNode(r._3, r._4, unsafeNode(k, v, l, r._5), r._6);
      }
      if (l._1 > (r._1 + 1 | 0)) {
        if (l._6.tag === "Node" && (() => {
          if (l._5.tag === "Leaf") {
            return 0 <= l._6._1;
          }
          if (l._5.tag === "Node") {
            return l._5._1 <= l._6._1;
          }
          fail();
        })()) {
          return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
        }
        return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
      }
      return unsafeNode(k, v, l, r);
    }
    if (r.tag === "Leaf" && l._1 > 1) {
      if (l._6.tag === "Node" && (() => {
        if (l._5.tag === "Leaf") {
          return 0 <= l._6._1;
        }
        if (l._5.tag === "Node") {
          return l._5._1 <= l._6._1;
        }
        fail();
      })()) {
        return unsafeNode(l._6._3, l._6._4, unsafeNode(l._3, l._4, l._5, l._6._5), unsafeNode(k, v, l._6._6, r));
      }
      return unsafeNode(l._3, l._4, l._5, unsafeNode(k, v, l._6, r));
    }
    return unsafeNode(k, v, l, r);
  }
  fail();
};
var unsafeSplit = (comp, k, m) => {
  if (m.tag === "Leaf") {
    return $Split(Nothing, Leaf2, Leaf2);
  }
  if (m.tag === "Node") {
    const v = comp(k)(m._3);
    if (v === "LT") {
      const v1 = unsafeSplit(comp, k, m._5);
      return $Split(v1._1, v1._2, unsafeBalancedNode(m._3, m._4, v1._3, m._6));
    }
    if (v === "GT") {
      const v1 = unsafeSplit(comp, k, m._6);
      return $Split(v1._1, unsafeBalancedNode(m._3, m._4, m._5, v1._2), v1._3);
    }
    if (v === "EQ") {
      return $Split($Maybe("Just", m._4), m._5, m._6);
    }
  }
  fail();
};
var unsafeSplitLast = (k, v, l, r) => {
  if (r.tag === "Leaf") {
    return $SplitLast(k, v, l);
  }
  if (r.tag === "Node") {
    const v1 = unsafeSplitLast(r._3, r._4, r._5, r._6);
    return $SplitLast(v1._1, v1._2, unsafeBalancedNode(k, v, l, v1._3));
  }
  fail();
};
var unsafeJoinNodes = (v, v1) => {
  if (v.tag === "Leaf") {
    return v1;
  }
  if (v.tag === "Node") {
    const v2 = unsafeSplitLast(v._3, v._4, v._5, v._6);
    return unsafeBalancedNode(v2._1, v2._2, v2._3, v1);
  }
  fail();
};
var unsafeDifference = (comp, l, r) => {
  if (l.tag === "Leaf") {
    return Leaf2;
  }
  if (r.tag === "Leaf") {
    return l;
  }
  if (r.tag === "Node") {
    const v = unsafeSplit(comp, r._3, l);
    return unsafeJoinNodes(unsafeDifference(comp, v._2, r._5), unsafeDifference(comp, v._3, r._6));
  }
  fail();
};
var unsafeUnionWith = (comp, app, l, r) => {
  if (l.tag === "Leaf") {
    return r;
  }
  if (r.tag === "Leaf") {
    return l;
  }
  if (r.tag === "Node") {
    const v = unsafeSplit(comp, r._3, l);
    const l$p = unsafeUnionWith(comp, app, v._2, r._5);
    const r$p = unsafeUnionWith(comp, app, v._3, r._6);
    if (v._1.tag === "Just") {
      return unsafeBalancedNode(r._3, app(v._1._1)(r._4), l$p, r$p);
    }
    if (v._1.tag === "Nothing") {
      return unsafeBalancedNode(r._3, r._4, l$p, r$p);
    }
  }
  fail();
};
var pop = (dictOrd) => {
  const compare2 = dictOrd.compare;
  return (k) => (m) => {
    const v = unsafeSplit(compare2, k, m);
    if (v._1.tag === "Just") {
      return $Maybe("Just", $Tuple(v._1._1, unsafeJoinNodes(v._2, v._3)));
    }
    return Nothing;
  };
};
var lookup2 = (dictOrd) => (k) => {
  const go = (go$a0$copy) => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === "Leaf") {
        go$c = false;
        go$r = Nothing;
        continue;
      }
      if (v.tag === "Node") {
        const v1 = dictOrd.compare(k)(v._3);
        if (v1 === "LT") {
          go$a0 = v._5;
          continue;
        }
        if (v1 === "GT") {
          go$a0 = v._6;
          continue;
        }
        if (v1 === "EQ") {
          go$c = false;
          go$r = $Maybe("Just", v._4);
          continue;
        }
      }
      fail();
    }
    return go$r;
  };
  return go;
};
var stepUnorderedCps = (next) => (done) => {
  const go = (go$a0$copy) => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === "IterLeaf") {
        go$c = false;
        go$r = done();
        continue;
      }
      if (v.tag === "IterEmit") {
        go$c = false;
        go$r = next(v._1, v._2, v._3);
        continue;
      }
      if (v.tag === "IterNode") {
        go$a0 = (() => {
          if (v._1.tag === "Leaf") {
            return v._2;
          }
          if (v._1.tag === "Node") {
            if (v._1._5.tag === "Leaf") {
              if (v._1._6.tag === "Leaf") {
                return $MapIter("IterEmit", v._1._3, v._1._4, v._2);
              }
              return $MapIter("IterEmit", v._1._3, v._1._4, $MapIter("IterNode", v._1._6, v._2));
            }
            if (v._1._6.tag === "Leaf") {
              return $MapIter("IterEmit", v._1._3, v._1._4, $MapIter("IterNode", v._1._5, v._2));
            }
            return $MapIter("IterEmit", v._1._3, v._1._4, $MapIter("IterNode", v._1._5, $MapIter("IterNode", v._1._6, v._2)));
          }
          fail();
        })();
        continue;
      }
      fail();
    }
    return go$r;
  };
  return go;
};
var stepUnfoldrUnordered = /* @__PURE__ */ stepUnorderedCps((k, v, next) => $Maybe("Just", $Tuple($Tuple(k, v), next)))((v) => Nothing);
var stepAscCps = (next) => (done) => {
  const go = (go$a0$copy) => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === "IterLeaf") {
        go$c = false;
        go$r = done();
        continue;
      }
      if (v.tag === "IterEmit") {
        go$c = false;
        go$r = next(v._1, v._2, v._3);
        continue;
      }
      if (v.tag === "IterNode") {
        go$a0 = (() => {
          const go$1 = (go$1$a0$copy) => (go$1$a1$copy) => {
            let go$1$a0 = go$1$a0$copy, go$1$a1 = go$1$a1$copy, go$1$c = true, go$1$r;
            while (go$1$c) {
              const iter = go$1$a0, v$1 = go$1$a1;
              if (v$1.tag === "Leaf") {
                go$1$c = false;
                go$1$r = iter;
                continue;
              }
              if (v$1.tag === "Node") {
                if (v$1._6.tag === "Leaf") {
                  go$1$a0 = $MapIter("IterEmit", v$1._3, v$1._4, iter);
                  go$1$a1 = v$1._5;
                  continue;
                }
                go$1$a0 = $MapIter("IterEmit", v$1._3, v$1._4, $MapIter("IterNode", v$1._6, iter));
                go$1$a1 = v$1._5;
                continue;
              }
              fail();
            }
            return go$1$r;
          };
          return go$1(v._2)(v._1);
        })();
        continue;
      }
      fail();
    }
    return go$r;
  };
  return go;
};
var stepAsc = /* @__PURE__ */ stepAscCps((k, v, next) => $MapIterStep("IterNext", k, v, next))((v) => IterDone);
var eqMapIter = (dictEq) => (dictEq1) => ({
  eq: (() => {
    const go = (a) => (b) => {
      const v = stepAsc(a);
      if (v.tag === "IterNext") {
        const v2 = stepAsc(b);
        return v2.tag === "IterNext" && dictEq.eq(v._1)(v2._1) && dictEq1.eq(v._2)(v2._2) && go(v._3)(v2._3);
      }
      if (v.tag === "IterDone") {
        return true;
      }
      fail();
    };
    return go;
  })()
});
var stepUnfoldr = /* @__PURE__ */ stepAscCps((k, v, next) => $Maybe("Just", $Tuple($Tuple(k, v), next)))((v) => Nothing);
var insertWith = (dictOrd) => (app) => (k) => (v) => {
  const go = (v1) => {
    if (v1.tag === "Leaf") {
      return $$$Map("Node", 1, 1, k, v, Leaf2, Leaf2);
    }
    if (v1.tag === "Node") {
      const v2 = dictOrd.compare(k)(v1._3);
      if (v2 === "LT") {
        return unsafeBalancedNode(v1._3, v1._4, go(v1._5), v1._6);
      }
      if (v2 === "GT") {
        return unsafeBalancedNode(v1._3, v1._4, v1._5, go(v1._6));
      }
      if (v2 === "EQ") {
        return $$$Map("Node", v1._1, v1._2, k, app(v1._4)(v), v1._5, v1._6);
      }
    }
    fail();
  };
  return go;
};
var insert = (dictOrd) => (k) => (v) => {
  const go = (v1) => {
    if (v1.tag === "Leaf") {
      return $$$Map("Node", 1, 1, k, v, Leaf2, Leaf2);
    }
    if (v1.tag === "Node") {
      const v2 = dictOrd.compare(k)(v1._3);
      if (v2 === "LT") {
        return unsafeBalancedNode(v1._3, v1._4, go(v1._5), v1._6);
      }
      if (v2 === "GT") {
        return unsafeBalancedNode(v1._3, v1._4, v1._5, go(v1._6));
      }
      if (v2 === "EQ") {
        return $$$Map("Node", v1._1, v1._2, k, v, v1._5, v1._6);
      }
    }
    fail();
  };
  return go;
};
var functorMap = {
  map: (f) => {
    const go = (v) => {
      if (v.tag === "Leaf") {
        return Leaf2;
      }
      if (v.tag === "Node") {
        return $$$Map("Node", v._1, v._2, v._3, f(v._4), go(v._5), go(v._6));
      }
      fail();
    };
    return go;
  }
};
var keys2 = /* @__PURE__ */ (() => {
  const go = (m$p, z$p) => {
    if (m$p.tag === "Leaf") {
      return z$p;
    }
    if (m$p.tag === "Node") {
      return go(m$p._5, $List("Cons", m$p._3, go(m$p._6, z$p)));
    }
    fail();
  };
  return (m) => go(m, Nil);
})();
var values = /* @__PURE__ */ (() => {
  const go = (m$p, z$p) => {
    if (m$p.tag === "Leaf") {
      return z$p;
    }
    if (m$p.tag === "Node") {
      return go(m$p._5, $List("Cons", m$p._4, go(m$p._6, z$p)));
    }
    fail();
  };
  return (m) => go(m, Nil);
})();
var filterKeys = (dictOrd) => (f) => {
  const go = (v) => {
    if (v.tag === "Leaf") {
      return Leaf2;
    }
    if (v.tag === "Node") {
      if (f(v._3)) {
        return unsafeBalancedNode(v._3, v._4, go(v._5), go(v._6));
      }
      return unsafeJoinNodes(go(v._5), go(v._6));
    }
    fail();
  };
  return go;
};
var eqMap = (dictEq) => (dictEq1) => ({
  eq: (xs) => (ys) => {
    if (xs.tag === "Leaf") {
      return ys.tag === "Leaf";
    }
    if (xs.tag === "Node") {
      return ys.tag === "Node" && xs._2 === ys._2 && eqMapIter(dictEq)(dictEq1).eq($MapIter("IterNode", xs, IterLeaf))($MapIter("IterNode", ys, IterLeaf));
    }
    fail();
  }
});
var fromFoldable3 = (dictOrd) => (dictFoldable) => dictFoldable.foldl((m) => (v) => insert(dictOrd)(v._1)(v._2)(m))(Leaf2);
var fromFoldableWith = (dictOrd) => (dictFoldable) => (f) => {
  const f$p = insertWith(dictOrd)((b) => (a) => f(a)(b));
  return dictFoldable.foldl((m) => (v) => f$p(v._1)(v._2)(m))(Leaf2);
};
var $$delete2 = (dictOrd) => (k) => {
  const go = (v) => {
    if (v.tag === "Leaf") {
      return Leaf2;
    }
    if (v.tag === "Node") {
      const v1 = dictOrd.compare(k)(v._3);
      if (v1 === "LT") {
        return unsafeBalancedNode(v._3, v._4, go(v._5), v._6);
      }
      if (v1 === "GT") {
        return unsafeBalancedNode(v._3, v._4, v._5, go(v._6));
      }
      if (v1 === "EQ") {
        return unsafeJoinNodes(v._5, v._6);
      }
    }
    fail();
  };
  return go;
};

// output-es/Data.Map.Extra/index.js
var mapKeysWith = (dictOrd) => (c) => (f) => (m) => fromFoldableWith(dictOrd)(foldableList)(c)(listMap((v) => $Tuple(
  f(v._1),
  v._2
))(unfoldableList.unfoldr(stepUnfoldr)($MapIter("IterNode", m, IterLeaf))));

// output-es/Data.Validation.Semigroup/index.js
var applyV = (dictSemigroup) => ({
  apply: (v) => (v1) => {
    if (v.tag === "Left") {
      if (v1.tag === "Left") {
        return $Either("Left", dictSemigroup.append(v._1)(v1._1));
      }
      return $Either("Left", v._1);
    }
    if (v1.tag === "Left") {
      return $Either("Left", v1._1);
    }
    if (v.tag === "Right" && v1.tag === "Right") {
      return $Either("Right", v._1(v1._1));
    }
    fail();
  },
  Functor0: () => functorEither
});

// output-es/Data.DDF.Concept/index.js
var $ConceptType = (tag, _1) => ({ tag, _1 });
var elem4 = /* @__PURE__ */ (() => {
  const any1 = foldableArray.foldMap((() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })());
  return (x) => any1(($0) => x === $0);
})();
var pop2 = /* @__PURE__ */ pop(ordId);
var apply3 = /* @__PURE__ */ (() => applyV(semigroupArray).apply)();
var StringC = /* @__PURE__ */ $ConceptType("StringC");
var MeasureC = /* @__PURE__ */ $ConceptType("MeasureC");
var BooleanC = /* @__PURE__ */ $ConceptType("BooleanC");
var IntervalC = /* @__PURE__ */ $ConceptType("IntervalC");
var EntityDomainC = /* @__PURE__ */ $ConceptType("EntityDomainC");
var EntitySetC = /* @__PURE__ */ $ConceptType("EntitySetC");
var RoleC = /* @__PURE__ */ $ConceptType("RoleC");
var CompositeC = /* @__PURE__ */ $ConceptType("CompositeC");
var TimeC = /* @__PURE__ */ $ConceptType("TimeC");
var reservedConcepts = /* @__PURE__ */ arrayMap(unsafeCreate)(["concept", "concept_type"]);
var parseConceptType = (x) => {
  const $0 = parseId(x);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return $Either(
      "Right",
      (() => {
        if ($0._1 === "string") {
          return StringC;
        }
        if ($0._1 === "measure") {
          return MeasureC;
        }
        if ($0._1 === "boolean") {
          return BooleanC;
        }
        if ($0._1 === "interval") {
          return IntervalC;
        }
        if ($0._1 === "entity_domain") {
          return EntityDomainC;
        }
        if ($0._1 === "entity_set") {
          return EntitySetC;
        }
        if ($0._1 === "role") {
          return RoleC;
        }
        if ($0._1 === "composite") {
          return CompositeC;
        }
        if ($0._1 === "time") {
          return TimeC;
        }
        return $ConceptType("CustomC", $0._1);
      })()
    );
  }
  fail();
};
var notReserved = (conceptId) => {
  if (elem4(conceptId)(arrayMap(value)(reservedConcepts))) {
    return $Either("Left", [$Issue("Issue", conceptId + " can not be use as concept Id")]);
  }
  return $Either("Right", conceptId);
};
var isEntitySet = (v) => v.conceptType.tag === "EntitySetC";
var isEntityDomain = (v) => v.conceptType.tag === "EntityDomainC";
var hasFieldAndPopValue = (field) => (input) => {
  const v = pop2(field === "" ? "undefined_id" : field)(input);
  if (v.tag === "Nothing") {
    return $Either("Left", [$Issue("Issue", "field " + field + " MUST exist for concept")]);
  }
  if (v.tag === "Just") {
    return $Either("Right", v._1);
  }
  fail();
};
var hasFieldAndGetValue = (field) => (input) => {
  const v = lookup2(ordId)(field === "" ? "undefined_id" : field)(input);
  if (v.tag === "Nothing") {
    return $Either("Left", [$Issue("Issue", "field " + field + " MUST exist for concept")]);
  }
  if (v.tag === "Just") {
    return $Either("Right", v._1);
  }
  fail();
};
var concept = (conceptId) => (conceptType) => (props) => ({ conceptId, conceptType, props, _info: Nothing });
var checkMandatoryField = (v) => {
  if (v.conceptType.tag === "EntitySetC") {
    const $0 = hasFieldAndGetValue("domain")(v.props);
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      if ($0._1 === "") {
        return $Either("Left", [$Issue("Issue", "field domain MUST not be empty")]);
      }
      return $Either("Right", v);
    }
    fail();
  }
  return $Either("Right", v);
};
var parseConcept = (input) => {
  const $0 = hasFieldAndPopValue("concept_type")(mapKeysWith(ordId)((x) => (y) => x)(unsafeCoerce)(input.props));
  const $1 = (() => {
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return apply3(apply3((() => {
        const $12 = notReserved(input.conceptId);
        const $22 = (() => {
          if ($12.tag === "Left") {
            return $Either("Left", $12._1);
          }
          if ($12.tag === "Right") {
            return parseId($12._1);
          }
          fail();
        })();
        if ($22.tag === "Left") {
          return $Either("Left", $22._1);
        }
        if ($22.tag === "Right") {
          return $Either("Right", concept($22._1));
        }
        fail();
      })())(parseConceptType($0._1._1)))($Either("Right", $0._1._2));
    }
    fail();
  })();
  const $2 = (() => {
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return checkMandatoryField($1._1);
    }
    fail();
  })();
  if ($2.tag === "Left") {
    return $Either("Left", $2._1);
  }
  if ($2.tag === "Right") {
    return $Either("Right", { ...$2._1, _info: input._info });
  }
  fail();
};

// output-es/Data.DDF.Atoms.Header/index.js
var unsafeCreate2 = (x) => {
  if (x === "") {
    return "undefined_id";
  }
  return x;
};
var is_header = (s) => {
  const $0 = string2("is--")(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = v1.result;
    const $2 = identifier(v1.suffix);
    return (() => {
      if ($2.tag === "Left") {
        const $3 = $2._1;
        return (v) => $Either("Left", $3);
      }
      if ($2.tag === "Right") {
        const $3 = $2._1;
        return (f) => f($3);
      }
      fail();
    })()((v1$1) => $Either("Right", { result: $1 + v1$1.result, suffix: v1$1.suffix }));
  });
};
var showHeader = {
  show: /* @__PURE__ */ (() => {
    const $0 = genericShowConstructor({ genericShowArgs: (v) => ["(NonEmptyString.unsafeFromString " + showStringImpl(v) + ")"] })({
      reflectSymbol: () => "Header"
    });
    return (x) => $0["genericShow'"](x);
  })()
};
var generalHeader = (s) => {
  const $0 = identifier(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = eof(v1.suffix);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", { result: v1.result, suffix: $1._1.suffix });
    }
    fail();
  });
};
var parseGeneralHeader = (x) => {
  const $0 = generalHeader({ substring: x, position: 0 });
  if ($0.tag === "Left") {
    return $Either("Left", [$Issue("InvalidCSV", "invalid header: " + x + ", " + $0._1.error + "at pos " + showIntImpl($0._1.pos))]);
  }
  if ($0.tag === "Right") {
    return $Either("Right", $0._1.result);
  }
  fail();
};
var eqHeader = { eq: (x) => (y) => x === y };
var ordHeader = { compare: (x) => (y) => ordString.compare(x)(y), Eq0: () => eqHeader };
var entityHeader = (s) => {
  const v2 = is_header(s);
  const $0 = (() => {
    if (v2.tag === "Left") {
      if (s.position === v2._1.pos) {
        return identifier(s);
      }
      return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
    }
    return v2;
  })();
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = eof(v1.suffix);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", { result: v1.result, suffix: $1._1.suffix });
    }
    fail();
  });
};
var parseEntityHeader = (x) => {
  const $0 = entityHeader({ substring: x, position: 0 });
  if ($0.tag === "Left") {
    return $Either("Left", [$Issue("InvalidCSV", "invalid header: " + x + ", " + $0._1.error + "at pos " + showIntImpl($0._1.pos))]);
  }
  if ($0.tag === "Right") {
    return $Either("Right", $0._1.result);
  }
  fail();
};

// output-es/Data.String.Utils/foreign.js
function startsWithImpl(searchString, s) {
  return s.startsWith(searchString);
}

// output-es/Node.Path/foreign.js
import path from "path";
var normalize = path.normalize;
function concat3(segments) {
  return path.join.apply(this, segments);
}
function relative(from) {
  return (to) => path.relative(from, to);
}
var basename = path.basename;
var extname = path.extname;
var sep = path.sep;
var delimiter = path.delimiter;
var parse2 = path.parse;
var isAbsolute = path.isAbsolute;

// output-es/Data.DDF.Csv.FileInfo/index.js
var $CollectionConstant = (tag) => tag;
var $CollectionInfo = (tag, _1) => ({ tag, _1 });
var choice = /* @__PURE__ */ (() => foldlArray(altParser.alt)((v) => $Either("Left", { pos: v.position, error: "Nothing to parse" })))();
var Concepts = /* @__PURE__ */ $CollectionInfo("Concepts");
var CONCEPTS = /* @__PURE__ */ $CollectionConstant("CONCEPTS");
var ENTITIES = /* @__PURE__ */ $CollectionConstant("ENTITIES");
var DATAPOINTS = /* @__PURE__ */ $CollectionConstant("DATAPOINTS");
var SYNONYMS = /* @__PURE__ */ $CollectionConstant("SYNONYMS");
var TRANSLATIONS = /* @__PURE__ */ $CollectionConstant("TRANSLATIONS");
var OTHERS = /* @__PURE__ */ $CollectionConstant("OTHERS");
var showCollection = {
  show: (v) => {
    if (v.tag === "Concepts") {
      return "concepts";
    }
    if (v.tag === "Entities") {
      if (v._1.set.tag === "Nothing") {
        return "entity_domain: (NonEmptyString.unsafeFromString " + showStringImpl(v._1.domain) + ")";
      }
      if (v._1.set.tag === "Just") {
        return "entity_domain: (NonEmptyString.unsafeFromString " + showStringImpl(v._1.domain) + "); entnty_set: (NonEmptyString.unsafeFromString " + showStringImpl(v._1.set._1) + ")";
      }
      fail();
    }
    if (v.tag === "DataPoints") {
      const go = (go$a0$copy) => (go$a1$copy) => {
        let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
        while (go$c) {
          const b = go$a0, v$1 = go$a1;
          if (v$1.tag === "Nil") {
            go$c = false;
            go$r = b;
            continue;
          }
          if (v$1.tag === "Cons") {
            go$a0 = b.init ? { init: false, acc: v$1._1 } : { init: false, acc: b.acc + "," + v$1._1 };
            go$a1 = v$1._2;
            continue;
          }
          fail();
        }
        return go$r;
      };
      return "datapoints: (NonEmptyString.unsafeFromString " + showStringImpl(v._1.indicator) + "), by: " + go({ init: false, acc: v._1.pkeys._1 })(v._1.pkeys._2).acc;
    }
    if (v.tag === "Synonyms") {
      return "synonyms for " + v._1;
    }
    if (v.tag === "Translations") {
      return "translation for " + v._1.path + " in " + v._1.language;
    }
    if (v.tag === "Other") {
      return "custom collection: (NonEmptyString.unsafeFromString " + showStringImpl(v._1) + ")";
    }
    fail();
  }
};
var pkeyWithConstrain = (s) => {
  const $0 = identifier(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = string2("-")(v1.suffix);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      const $2 = identifier($1._1.suffix);
      return (() => {
        if ($2.tag === "Left") {
          const $3 = $2._1;
          return (v) => $Either("Left", $3);
        }
        if ($2.tag === "Right") {
          const $3 = $2._1;
          return (f) => f($3);
        }
        fail();
      })()((v1$1) => $Either("Right", { result: $Tuple(v1.result, $Maybe("Just", v1$1.result)), suffix: v1$1.suffix }));
    }
    fail();
  });
};
var pkeyNoConstrain = (s) => {
  const $0 = identifier(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => $Either("Right", { result: $Tuple(v1.result, Nothing), suffix: v1.suffix }));
};
var pkey = /* @__PURE__ */ choice([
  (s) => {
    const v1 = pkeyWithConstrain(s);
    if (v1.tag === "Left") {
      return $Either("Left", { pos: s.position, error: v1._1.error });
    }
    return v1;
  },
  (s) => {
    const v1 = pkeyNoConstrain(s);
    if (v1.tag === "Left") {
      return $Either("Left", { pos: s.position, error: v1._1.error });
    }
    return v1;
  }
]);
var isTranslationFile = (root) => (fp) => startsWithImpl(concat3([normalize(root), "lang"]), normalize(fp));
var translationFile = (root) => (fp) => {
  if (isTranslationFile(root)(fp)) {
    const v = sliceImpl(0, 3, split(sep)(relative(root)(fp)));
    if (v.length === 3 && v[0] === "lang") {
      return $Either("Right", $CollectionInfo("Translations", { path: relative(concat3([root, "lang", v[1]]))(fp), language: v[1] }));
    }
    return $Either("Left", [$Issue("InvalidCSV", "not enough segments to extract target language apd target path for translation file " + fp)]);
  }
  return $Either("Left", [$Issue("InvalidCSV", "not a translation file")]);
};
var getCollectionType = (v) => {
  if (v.tag === "Concepts") {
    return CONCEPTS;
  }
  if (v.tag === "Entities") {
    return ENTITIES;
  }
  if (v.tag === "DataPoints") {
    return DATAPOINTS;
  }
  if (v.tag === "Synonyms") {
    return SYNONYMS;
  }
  if (v.tag === "Translations") {
    return TRANSLATIONS;
  }
  if (v.tag === "Other") {
    return OTHERS;
  }
  fail();
};
var genericCollectionConstant = {
  to: (x) => {
    if (x.tag === "Inl") {
      return CONCEPTS;
    }
    if (x.tag === "Inr") {
      if (x._1.tag === "Inl") {
        return ENTITIES;
      }
      if (x._1.tag === "Inr") {
        if (x._1._1.tag === "Inl") {
          return DATAPOINTS;
        }
        if (x._1._1.tag === "Inr") {
          if (x._1._1._1.tag === "Inl") {
            return SYNONYMS;
          }
          if (x._1._1._1.tag === "Inr") {
            if (x._1._1._1._1.tag === "Inl") {
              return TRANSLATIONS;
            }
            if (x._1._1._1._1.tag === "Inr") {
              return OTHERS;
            }
          }
        }
      }
    }
    fail();
  },
  from: (x) => {
    if (x === "CONCEPTS") {
      return $Sum("Inl", NoArguments);
    }
    if (x === "ENTITIES") {
      return $Sum("Inr", $Sum("Inl", NoArguments));
    }
    if (x === "DATAPOINTS") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments)));
    }
    if (x === "SYNONYMS") {
      return $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))));
    }
    if (x === "TRANSLATIONS") {
      return $Sum(
        "Inr",
        $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inl", NoArguments))))
      );
    }
    if (x === "OTHERS") {
      return $Sum(
        "Inr",
        $Sum("Inr", $Sum("Inr", $Sum("Inr", $Sum("Inr", NoArguments))))
      );
    }
    fail();
  }
};
var showCollectionConstant = {
  show: /* @__PURE__ */ (() => {
    const $0 = genericShowConstructor(genericShowArgsNoArguments)({ reflectSymbol: () => "CONCEPTS" });
    const $1 = genericShowConstructor(genericShowArgsNoArguments)({ reflectSymbol: () => "ENTITIES" });
    const $2 = (() => {
      const $22 = (() => {
        const $23 = genericShowConstructor(genericShowArgsNoArguments)({ reflectSymbol: () => "DATAPOINTS" });
        const $3 = (() => {
          const $32 = genericShowConstructor(genericShowArgsNoArguments)({ reflectSymbol: () => "SYNONYMS" });
          const $4 = (() => {
            const $42 = genericShowConstructor(genericShowArgsNoArguments)({ reflectSymbol: () => "TRANSLATIONS" });
            const $5 = (() => {
              const $52 = genericShowConstructor(genericShowArgsNoArguments)({ reflectSymbol: () => "OTHERS" });
              return {
                "genericShow'": (v) => {
                  if (v.tag === "Inl") {
                    return $42["genericShow'"](v._1);
                  }
                  if (v.tag === "Inr") {
                    return $52["genericShow'"](v._1);
                  }
                  fail();
                }
              };
            })();
            return {
              "genericShow'": (v) => {
                if (v.tag === "Inl") {
                  return $32["genericShow'"](v._1);
                }
                if (v.tag === "Inr") {
                  return $5["genericShow'"](v._1);
                }
                fail();
              }
            };
          })();
          return {
            "genericShow'": (v) => {
              if (v.tag === "Inl") {
                return $23["genericShow'"](v._1);
              }
              if (v.tag === "Inr") {
                return $4["genericShow'"](v._1);
              }
              fail();
            }
          };
        })();
        return {
          "genericShow'": (v) => {
            if (v.tag === "Inl") {
              return $1["genericShow'"](v._1);
            }
            if (v.tag === "Inr") {
              return $3["genericShow'"](v._1);
            }
            fail();
          }
        };
      })();
      return {
        "genericShow'": (v) => {
          if (v.tag === "Inl") {
            return $0["genericShow'"](v._1);
          }
          if (v.tag === "Inr") {
            return $22["genericShow'"](v._1);
          }
          fail();
        }
      };
    })();
    return (x) => $2["genericShow'"](genericCollectionConstant.from(x));
  })()
};
var eqCollectionConstant = {
  eq: (x) => (y) => {
    if (x === "CONCEPTS") {
      return y === "CONCEPTS";
    }
    if (x === "ENTITIES") {
      return y === "ENTITIES";
    }
    if (x === "DATAPOINTS") {
      return y === "DATAPOINTS";
    }
    if (x === "SYNONYMS") {
      return y === "SYNONYMS";
    }
    if (x === "TRANSLATIONS") {
      return y === "TRANSLATIONS";
    }
    return x === "OTHERS" && y === "OTHERS";
  }
};
var hashableCollectionConstant = { hash: (x) => hashString(showCollectionConstant.show(x)), Eq0: () => eqCollectionConstant };
var ordCollectionConstant = {
  compare: (x) => (y) => {
    if (x === "CONCEPTS") {
      if (y === "CONCEPTS") {
        return EQ;
      }
      return LT;
    }
    if (y === "CONCEPTS") {
      return GT;
    }
    if (x === "ENTITIES") {
      if (y === "ENTITIES") {
        return EQ;
      }
      return LT;
    }
    if (y === "ENTITIES") {
      return GT;
    }
    if (x === "DATAPOINTS") {
      if (y === "DATAPOINTS") {
        return EQ;
      }
      return LT;
    }
    if (y === "DATAPOINTS") {
      return GT;
    }
    if (x === "SYNONYMS") {
      if (y === "SYNONYMS") {
        return EQ;
      }
      return LT;
    }
    if (y === "SYNONYMS") {
      return GT;
    }
    if (x === "TRANSLATIONS") {
      if (y === "TRANSLATIONS") {
        return EQ;
      }
      return LT;
    }
    if (y === "TRANSLATIONS") {
      return GT;
    }
    if (x === "OTHERS" && y === "OTHERS") {
      return EQ;
    }
    fail();
  },
  Eq0: () => eqCollectionConstant
};
var ddfFileBegin = (x) => {
  const $0 = string2("ddf--")(x);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return $Either("Right", { result: void 0, suffix: $0._1.suffix });
  }
  fail();
};
var e1 = (s) => {
  const $0 = ddfFileBegin(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = string2("entities--")(v1.suffix);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      const $2 = identifier($1._1.suffix);
      return (() => {
        if ($2.tag === "Left") {
          const $3 = $2._1;
          return (v) => $Either("Left", $3);
        }
        if ($2.tag === "Right") {
          const $3 = $2._1;
          return (f) => f($3);
        }
        fail();
      })()((v1$1) => {
        const $3 = v1$1.result;
        const $4 = eof(v1$1.suffix);
        return (() => {
          if ($4.tag === "Left") {
            const $5 = $4._1;
            return (v) => $Either("Left", $5);
          }
          if ($4.tag === "Right") {
            const $5 = $4._1;
            return (f) => f($5);
          }
          fail();
        })()((v1$2) => $Either("Right", { result: $CollectionInfo("Entities", { domain: $3, set: Nothing }), suffix: v1$2.suffix }));
      });
    }
    fail();
  });
};
var e2 = (s) => {
  const $0 = ddfFileBegin(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = string2("entities--")(v1.suffix);
    const $2 = (() => {
      if ($1.tag === "Left") {
        return $Either("Left", $1._1);
      }
      if ($1.tag === "Right") {
        return $Either("Right", { result: void 0, suffix: $1._1.suffix });
      }
      fail();
    })();
    return (() => {
      if ($2.tag === "Left") {
        const $3 = $2._1;
        return (v) => $Either("Left", $3);
      }
      if ($2.tag === "Right") {
        const $3 = $2._1;
        return (f) => f($3);
      }
      fail();
    })()((v1$1) => {
      const $3 = identifier(v1$1.suffix);
      return (() => {
        if ($3.tag === "Left") {
          const $4 = $3._1;
          return (v) => $Either("Left", $4);
        }
        if ($3.tag === "Right") {
          const $4 = $3._1;
          return (f) => f($4);
        }
        fail();
      })()((v1$2) => {
        const $4 = string2("--")(v1$2.suffix);
        if ($4.tag === "Left") {
          return $Either("Left", $4._1);
        }
        if ($4.tag === "Right") {
          const $5 = identifier($4._1.suffix);
          return (() => {
            if ($5.tag === "Left") {
              const $6 = $5._1;
              return (v) => $Either("Left", $6);
            }
            if ($5.tag === "Right") {
              const $6 = $5._1;
              return (f) => f($6);
            }
            fail();
          })()((v1$3) => {
            const $6 = v1$3.result;
            const $7 = eof(v1$3.suffix);
            return (() => {
              if ($7.tag === "Left") {
                const $8 = $7._1;
                return (v) => $Either("Left", $8);
              }
              if ($7.tag === "Right") {
                const $8 = $7._1;
                return (f) => f($8);
              }
              fail();
            })()((v1$4) => $Either("Right", { result: $CollectionInfo("Entities", { domain: v1$2.result, set: $Maybe("Just", $6) }), suffix: v1$4.suffix }));
          });
        }
        fail();
      });
    });
  });
};
var entityFile = /* @__PURE__ */ choice([
  (s) => {
    const v1 = e2(s);
    if (v1.tag === "Left") {
      return $Either("Left", { pos: s.position, error: v1._1.error });
    }
    return v1;
  },
  (s) => {
    const v1 = e1(s);
    if (v1.tag === "Left") {
      return $Either("Left", { pos: s.position, error: v1._1.error });
    }
    return v1;
  }
]);
var synonymFile = (s) => {
  const $0 = ddfFileBegin(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = string2("synonyms--")(v1.suffix);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      const $2 = identifier($1._1.suffix);
      return (() => {
        if ($2.tag === "Left") {
          const $3 = $2._1;
          return (v) => $Either("Left", $3);
        }
        if ($2.tag === "Right") {
          const $3 = $2._1;
          return (f) => f($3);
        }
        fail();
      })()((v1$1) => {
        const $3 = v1$1.result;
        const $4 = eof(v1$1.suffix);
        return (() => {
          if ($4.tag === "Left") {
            const $5 = $4._1;
            return (v) => $Either("Left", $5);
          }
          if ($4.tag === "Right") {
            const $5 = $4._1;
            return (f) => f($5);
          }
          fail();
        })()((v1$2) => $Either("Right", { result: $CollectionInfo("Synonyms", $3), suffix: v1$2.suffix }));
      });
    }
    fail();
  });
};
var datapointFile = (s) => {
  const $0 = ddfFileBegin(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = string2("datapoints--")(v1.suffix);
    const $2 = (() => {
      if ($1.tag === "Left") {
        return $Either("Left", $1._1);
      }
      if ($1.tag === "Right") {
        return $Either("Right", { result: void 0, suffix: $1._1.suffix });
      }
      fail();
    })();
    return (() => {
      if ($2.tag === "Left") {
        const $3 = $2._1;
        return (v) => $Either("Left", $3);
      }
      if ($2.tag === "Right") {
        const $3 = $2._1;
        return (f) => f($3);
      }
      fail();
    })()((v1$1) => {
      const $3 = identifier(v1$1.suffix);
      return (() => {
        if ($3.tag === "Left") {
          const $4 = $3._1;
          return (v) => $Either("Left", $4);
        }
        if ($3.tag === "Right") {
          const $4 = $3._1;
          return (f) => f($4);
        }
        fail();
      })()((v1$2) => {
        const $4 = string2("--by--")(v1$2.suffix);
        if ($4.tag === "Left") {
          return $Either("Left", $4._1);
        }
        if ($4.tag === "Right") {
          const $5 = sepBy1(pkey)(string2("--"))($4._1.suffix);
          return (() => {
            if ($5.tag === "Left") {
              const $6 = $5._1;
              return (v) => $Either("Left", $6);
            }
            if ($5.tag === "Right") {
              const $6 = $5._1;
              return (f) => f($6);
            }
            fail();
          })()((v1$3) => {
            const $6 = v1$3.result;
            const $7 = eof(v1$3.suffix);
            return (() => {
              if ($7.tag === "Left") {
                const $8 = $7._1;
                return (v) => $Either("Left", $8);
              }
              if ($7.tag === "Right") {
                const $8 = $7._1;
                return (f) => f($8);
              }
              fail();
            })()((v1$4) => $Either(
              "Right",
              {
                result: $CollectionInfo(
                  "DataPoints",
                  {
                    indicator: v1$2.result,
                    pkeys: $NonEmpty($6._1._1, listMap(fst)($6._2)),
                    constrains: $NonEmpty($6._1._2, listMap(snd)($6._2))
                  }
                ),
                suffix: v1$4.suffix
              }
            ));
          });
        }
        fail();
      });
    });
  });
};
var c2 = (s) => {
  const $0 = string2("ddf--concepts--")(s);
  return (() => {
    if ($0.tag === "Left") {
      const $1 = $0._1;
      return (v) => $Either("Left", $1);
    }
    if ($0.tag === "Right") {
      const $1 = $0._1;
      return (f) => f($1);
    }
    fail();
  })()((v1) => {
    const $1 = v1.result;
    const v2 = string2("discrete")(v1.suffix);
    const $2 = (() => {
      if (v2.tag === "Left") {
        if (v1.suffix.position === v2._1.pos) {
          return string2("continuous")(v1.suffix);
        }
        return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
      }
      return v2;
    })();
    return (() => {
      if ($2.tag === "Left") {
        const $3 = $2._1;
        return (v) => $Either("Left", $3);
      }
      if ($2.tag === "Right") {
        const $3 = $2._1;
        return (f) => f($3);
      }
      fail();
    })()((v1$1) => {
      const $3 = eof(v1$1.suffix);
      if ($3.tag === "Left") {
        return $Either("Left", $3._1);
      }
      if ($3.tag === "Right") {
        return $Either("Right", { result: $1 + v1$1.result, suffix: $3._1.suffix });
      }
      fail();
    });
  });
};
var c1 = /* @__PURE__ */ (() => applyParser.apply((x) => {
  const $0 = string2("ddf--concepts")(x);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return $Either(
      "Right",
      {
        result: (() => {
          const $1 = $0._1.result;
          return (v) => $1;
        })(),
        suffix: $0._1.suffix
      }
    );
  }
  fail();
})(eof))();
var conceptFile = /* @__PURE__ */ (() => applyParser.apply((() => {
  const $0 = choice([
    (s) => {
      const v1 = c1(s);
      if (v1.tag === "Left") {
        return $Either("Left", { pos: s.position, error: v1._1.error });
      }
      return v1;
    },
    (s) => {
      const v1 = c2(s);
      if (v1.tag === "Left") {
        return $Either("Left", { pos: s.position, error: v1._1.error });
      }
      return v1;
    }
  ]);
  return (x) => {
    const $1 = $0(x);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return $Either("Right", { result: identity, suffix: $1._1.suffix });
    }
    fail();
  };
})())((s) => $Either("Right", { result: Concepts, suffix: s })))();
var validateFileInfo = (root) => (fp) => {
  const v = stripSuffix(".csv")(basename(fp));
  if (v.tag === "Nothing") {
    return $Either("Left", [$Issue("InvalidCSV", "not a csv file")]);
  }
  if (v.tag === "Just") {
    if (isTranslationFile(root)(fp)) {
      const $02 = translationFile(root)(fp);
      if ($02.tag === "Left") {
        return $Either("Left", $02._1);
      }
      if ($02.tag === "Right") {
        return $Either("Right", { filepath: fp, collectionInfo: $02._1 });
      }
      fail();
    }
    const $0 = choice([
      (s) => {
        const v1 = conceptFile(s);
        if (v1.tag === "Left") {
          return $Either("Left", { pos: s.position, error: v1._1.error });
        }
        return v1;
      },
      (s) => {
        const v1 = entityFile(s);
        if (v1.tag === "Left") {
          return $Either("Left", { pos: s.position, error: v1._1.error });
        }
        return v1;
      },
      (s) => {
        const v1 = datapointFile(s);
        if (v1.tag === "Left") {
          return $Either("Left", { pos: s.position, error: v1._1.error });
        }
        return v1;
      },
      (s) => {
        const v1 = synonymFile(s);
        if (v1.tag === "Left") {
          return $Either("Left", { pos: s.position, error: v1._1.error });
        }
        return v1;
      }
    ])({ substring: v._1, position: 0 });
    if ($0.tag === "Left") {
      return $Either("Left", [$Issue("InvalidCSV", "error parsing file: " + $0._1.error)]);
    }
    if ($0.tag === "Right") {
      return $Either("Right", { filepath: fp, collectionInfo: $0._1.result });
    }
  }
  fail();
};

// output-es/Data.Set/index.js
var foldableSet = {
  foldMap: (dictMonoid) => {
    const foldMap1 = foldableList.foldMap(dictMonoid);
    return (f) => {
      const $0 = foldMap1(f);
      return (x) => $0(keys2(x));
    };
  },
  foldl: (f) => (x) => {
    const go = (go$a0$copy) => (go$a1$copy) => {
      let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
      while (go$c) {
        const b = go$a0, v = go$a1;
        if (v.tag === "Nil") {
          go$c = false;
          go$r = b;
          continue;
        }
        if (v.tag === "Cons") {
          go$a0 = f(b)(v._1);
          go$a1 = v._2;
          continue;
        }
        fail();
      }
      return go$r;
    };
    const $0 = go(x);
    return (x$1) => $0(keys2(x$1));
  },
  foldr: (f) => (x) => {
    const $0 = foldableList.foldr(f)(x);
    return (x$1) => $0(keys2(x$1));
  }
};
var map = (dictOrd) => (f) => foldableSet.foldl((m) => (a) => insert(dictOrd)(f(a))()(m))(Leaf2);

// output-es/Data.String.NonEmpty.Internal/index.js
var toString3 = (v) => v;
var showNonEmptyString = { show: (v) => "(NonEmptyString.unsafeFromString " + showStringImpl(v) + ")" };
var stripPrefix2 = (pat) => (a) => {
  const $0 = stripPrefix(pat)(a);
  if ($0.tag === "Just") {
    if ($0._1 === "") {
      return Nothing;
    }
    return $Maybe("Just", $0._1);
  }
  if ($0.tag === "Nothing") {
    return Nothing;
  }
  fail();
};

// output-es/Foreign/foreign.js
function tagOf(value2) {
  return Object.prototype.toString.call(value2).slice(8, -1);
}
var isArray = Array.isArray || function(value2) {
  return Object.prototype.toString.call(value2) === "[object Array]";
};

// output-es/Foreign/index.js
var $ForeignError = (tag, _1, _2) => ({ tag, _1, _2 });
var ErrorAtIndex = (value0) => (value12) => $ForeignError("ErrorAtIndex", value0, value12);
var readArray = (dictMonad) => (value2) => {
  if (isArray(value2)) {
    return applicativeExceptT(dictMonad).pure(value2);
  }
  return monadThrowExceptT(dictMonad).throwError($NonEmpty($ForeignError("TypeMismatch", "array", tagOf(value2)), Nil));
};
var unsafeReadTagged = (dictMonad) => (tag) => (value2) => {
  if (tagOf(value2) === tag) {
    return applicativeExceptT(dictMonad).pure(value2);
  }
  return monadThrowExceptT(dictMonad).throwError($NonEmpty($ForeignError("TypeMismatch", tag, tagOf(value2)), Nil));
};
var readString = (dictMonad) => unsafeReadTagged(dictMonad)("String");

// output-es/Node.FS.Stats/foreign.js
var isDirectoryImpl = (s) => s.isDirectory();
var isFileImpl = (s) => s.isFile();

// output-es/Utils/index.js
var unsafeLookup = (dictShow) => (dictOrd) => (k) => (m) => {
  const v = lookup2(dictOrd)(k)(m);
  if (v.tag === "Just") {
    return v._1;
  }
  if (v.tag === "Nothing") {
    return _crashWith("looked up a key which is not existed in the Map: " + dictShow.show(k));
  }
  fail();
};
var getFiles = (x) => (excl) => _bind(toAff1(readdir2)(x))((allFiles) => foldM(monadAff)((acc) => (f) => _bind(toAff1(stat2)(f))((st) => {
  if (isFileImpl(st) && extname(basename(f)) === ".csv") {
    return _pure(snoc(acc)(f));
  }
  if (isDirectoryImpl(st)) {
    return _bind(getFiles(f)([]))((dirfs) => _pure([...acc, ...dirfs]));
  }
  return _pure(acc);
}))([])(arrayMap((f) => concat3([x, f]))(filterImpl((f) => !elem(eqString)(f)(excl), allFiles))));
var findDupsL = (func) => {
  const go = (go$a0$copy) => (go$a1$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0, v1 = go$a1;
      if (v1.tag === "Cons" && v1._2.tag === "Cons") {
        if (func(v1._1)(v1._2._1) === "EQ") {
          go$a0 = foldableList.foldr(Cons)($List("Cons", v1._2._1, Nil))(v);
          go$a1 = $List("Cons", v1._2._1, v1._2._2);
          continue;
        }
        go$a0 = v;
        go$a1 = $List("Cons", v1._2._1, v1._2._2);
        continue;
      }
      go$c = false;
      go$r = v;
    }
    return go$r;
  };
  return go(Nil);
};
var findDups = (func) => {
  const go = (go$a0$copy) => (go$a1$copy) => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const acc = go$a0, lst = go$a1;
      const v = sliceImpl(0, 2, lst);
      if (v.length === 2) {
        const remain = sliceImpl(1, lst.length, lst);
        if (func(v[0])(v[1]) === "EQ") {
          go$a0 = snoc(acc)(v[1]);
          go$a1 = remain;
          continue;
        }
        go$a0 = acc;
        go$a1 = remain;
        continue;
      }
      go$c = false;
      go$r = acc;
    }
    return go$r;
  };
  return go([]);
};

// output-es/Data.DDF.Csv.CsvFile/index.js
var show = /* @__PURE__ */ showArrayImpl(showStringImpl);
var applicativeV = /* @__PURE__ */ (() => {
  const applyV1 = applyV(semigroupArray);
  return { pure: (x) => $Either("Right", x), Apply0: () => applyV1 };
})();
var eq1 = /* @__PURE__ */ (() => eqArrayImpl(eqHeader.eq))();
var show1 = /* @__PURE__ */ showArrayImpl((v) => "(Tuple " + showHeader.show(v._1) + " " + showIntImpl(v._2) + ")");
var sort1 = /* @__PURE__ */ (() => {
  const compare2 = ordTuple(ordString)(ordInt).compare;
  return (xs) => sortBy(compare2)(xs);
})();
var fromFoldable12 = /* @__PURE__ */ foldrArray(Cons)(Nil);
var fromFoldable32 = /* @__PURE__ */ fromFoldable3(ordHeader)(foldableArray);
var sequence2 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeV)(identity3))();
var show2 = /* @__PURE__ */ (() => showArrayImpl(showNonEmptyString.show))();
var fromFoldable4 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordString)(a)()(m))(Leaf2);
var fromFoldable7 = /* @__PURE__ */ fromFoldable3(ordString)(foldableNonEmptyList);
var fromFoldable8 = /* @__PURE__ */ fromFoldable3(ordString)(foldableArray);
var elem5 = /* @__PURE__ */ (() => {
  const any1 = foldableNonEmptyList.foldMap((() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })());
  return (x) => any1(($0) => x === $0);
})();
var apply4 = /* @__PURE__ */ (() => applyV(semigroupArray).apply)();
var fromFoldable11 = /* @__PURE__ */ (() => {
  const $0 = foldable1NonEmptyList.Foldable0().foldr;
  return (x) => fromFoldableImpl($0, x);
})();
var oneOfHeaderExists = (expected) => (csvcontent) => {
  const intersection = intersectBy(eqStringImpl)(expected)(arrayMap((x) => x)(fromFoldableImpl(
    foldrArray,
    csvcontent.headers
  )));
  if (intersection.length !== 1) {
    return $Either("Left", [$Issue("InvalidCSV", "file MUST have one and only one of follwoing field: " + show(expected))]);
  }
  return applicativeV.pure($Tuple(intersection[0], csvcontent));
};
var notEmptyCsv = (input) => {
  if (input.headers.length > 0) {
    if (input.columns.length > 0) {
      if (input.headers.length === input.columns.length) {
        return applicativeV.pure({ headers: input.headers, index: input.index, columns: input.columns });
      }
      return $Either("Left", [$Issue("InvalidCSV", "header length doesn't match column length")]);
    }
    return applicativeV.pure({ headers: input.headers, index: input.index, columns: replicateImpl(max3(1)(input.headers.length), []) });
  }
  return $Either("Left", [$Issue("InvalidCSV", "Empty Csv. You should at least put headers in the file.")]);
};
var noDupCols = (input) => {
  if (eq1(nubBy(ordHeader.compare)(input.headers))(input.headers)) {
    return applicativeV.pure(input);
  }
  return $Either(
    "Left",
    [
      $Issue(
        "InvalidCSV",
        "duplicated headers: " + show1(filterImpl(
          (x) => x._2 > 1,
          arrayMap((x) => $Tuple(
            (() => {
              if (0 < x.length) {
                return x[0];
              }
              fail();
            })(),
            x.length
          ))(groupBy(eqHeader.eq)(sortBy(ordHeader.compare)(input.headers)))
        ))
      )
    ]
  );
};
var hasCols = (dictFoldable) => (dictOrd) => {
  const fromFoldable10 = dictFoldable.foldl((m) => (a) => insert(dictOrd)(a)()(m))(Leaf2);
  const compare2 = dictOrd.compare;
  return (dictEq) => (expected) => (actual) => unsafeDifference(compare2, fromFoldable10(expected), fromFoldable10(actual)).tag === "Leaf";
};
var hasCols1 = /* @__PURE__ */ hasCols(foldableArray)(ordString)(eqString);
var headersExists = (expected) => (csvcontent) => {
  if (hasCols1(expected)(arrayMap((x) => x)(fromFoldableImpl(foldrArray, csvcontent.headers)))) {
    return applicativeV.pure(csvcontent);
  }
  return $Either("Left", [$Issue("InvalidCSV", "file MUST have following field: " + show(expected))]);
};
var findInvalid = (col) => (x) => {
  const $0 = findIndexImpl(Just, Nothing, (v) => v === x, col);
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};
var findDupsForColumns = (headers) => (values3) => {
  const colsToCheck = arrayMap((h) => unsafeLookup(showHeader)(ordHeader)(h)(values3))(headers);
  return fromFoldableImpl(
    foldableList.foldr,
    listMap(snd)(findDupsL((x) => (y) => ordString.compare(x._1)(y._1))(fromFoldable12(sort1(zipWithImpl(
      Tuple,
      foldl1Impl(zipWith((a) => (b) => a + "," + b), colsToCheck),
      rangeImpl(
        0,
        (() => {
          if (0 < colsToCheck.length) {
            return colsToCheck[0].length;
          }
          fail();
        })()
      )
    )))))
  );
};
var noDuplicatedByKey = (key) => (fileInfo) => (v) => {
  const header = key === "" ? "undefined_id" : key;
  const columnMap = fromFoldable32(zipWithImpl(Tuple, v.headers, v.columns));
  const dups = findDupsForColumns([header])(columnMap);
  if (dups.length === 0) {
    return applicativeV.pure(v);
  }
  const fp = fileInfo.filepath;
  return $Either(
    "Left",
    arrayMap((x) => $Issue(
      "InvalidItem",
      fp,
      v.index[x],
      "Duplicated " + key + ": " + unsafeLookup(showHeader)(ordHeader)(header)(columnMap)[x]
    ))(dups)
  );
};
var noDuplicatedByKeys = (keys5) => (fileInfo) => (v) => {
  const keyHeaders = arrayMap(unsafeCreate2)(keys5);
  const columnMap = fromFoldable32(zipWithImpl(Tuple, v.headers, v.columns));
  const dups = findDupsForColumns(keyHeaders)(columnMap);
  if (dups.length === 0) {
    return applicativeV.pure(v);
  }
  const fp = fileInfo.filepath;
  return $Either(
    "Left",
    arrayMap((x) => $Issue(
      "InvalidItem",
      fp,
      v.index[x],
      "Duplicated key combination: " + joinWith(",")(arrayMap((col) => col[x])(arrayMap((k) => unsafeLookup(showHeader)(ordHeader)(k)(columnMap))(keyHeaders)))
    ))(dups)
  );
};
var colsAreValidIds = (input) => {
  const $0 = sequence2(arrayMap(parseGeneralHeader)(input.headers));
  if ($0.tag === "Right") {
    const is_headers = filterImpl((x) => startsWithImpl("is--", x), arrayMap(unsafeCoerce)($0._1));
    if (is_headers.length === 0) {
      return applicativeV.pure({ ...input, headers: $0._1 });
    }
    return $Either("Left", [$Issue("InvalidCSV", "these headers are not valid Ids: " + show2(is_headers))]);
  }
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  fail();
};
var colsAreValidHeaders = (input) => {
  const $0 = sequence2(arrayMap(parseEntityHeader)(input.headers));
  if ($0.tag === "Right") {
    return applicativeV.pure({ ...input, headers: $0._1 });
  }
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  fail();
};
var checkOneColumn = (val) => (col) => {
  if (val.tag === "Nothing") {
    return [];
  }
  if (val.tag === "Just") {
    const res = unsafeDifference(
      ordString.compare,
      fromFoldable4(col),
      $$$Map("Node", 1, 1, val._1, void 0, Leaf2, Leaf2)
    );
    if (res.tag === "Leaf") {
      return [];
    }
    return fromFoldableImpl(
      foldableSet.foldr,
      map(ordTuple(ordInt)(ordString))((x) => $Tuple(findInvalid(col)(x), x))(res)
    );
  }
  fail();
};
var constrainsAreMet = (fp) => (v) => (v1) => {
  const $0 = v.pkeys;
  const v2 = concat(fromFoldableImpl(
    foldableList.foldr,
    zipWith2(checkOneColumn)(values(fromFoldable7(zipWith4(Tuple)($0)(v.constrains))))(values(filterKeys(ordString)((k) => elem5(k)($0))(fromFoldable8(zipWithImpl(
      Tuple,
      arrayMap(unsafeCoerce)(v1.headers),
      v1.columns
    )))))
  ));
  if (v2.length === 0) {
    return applicativeV.pure(v1);
  }
  return $Either("Left", arrayMap((v3) => $Issue("InvalidItem", fp, v1.index[v3._1], "constrain violation: " + v3._2))(v2));
};
var parseCsvFile = (v) => {
  if (v.fileInfo.collectionInfo.tag === "Concepts") {
    return apply4((() => {
      const $0 = applicativeV.pure(v.fileInfo);
      if ($0.tag === "Left") {
        return $Either("Left", $0._1);
      }
      if ($0.tag === "Right") {
        return $Either(
          "Right",
          (() => {
            const $1 = $0._1;
            return (csvContent) => ({ fileInfo: $1, csvContent });
          })()
        );
      }
      fail();
    })())((() => {
      const $0 = notEmptyCsv(v.csvContent);
      const $1 = (() => {
        if ($0.tag === "Left") {
          return $Either("Left", $0._1);
        }
        if ($0.tag === "Right") {
          return colsAreValidIds($0._1);
        }
        fail();
      })();
      const $2 = (() => {
        if ($1.tag === "Left") {
          return $Either("Left", $1._1);
        }
        if ($1.tag === "Right") {
          return noDupCols($1._1);
        }
        fail();
      })();
      const $3 = (() => {
        if ($2.tag === "Left") {
          return $Either("Left", $2._1);
        }
        if ($2.tag === "Right") {
          return headersExists(["concept"])($2._1);
        }
        fail();
      })();
      if ($3.tag === "Left") {
        return $Either("Left", $3._1);
      }
      if ($3.tag === "Right") {
        return noDuplicatedByKey("concept")(v.fileInfo)($3._1);
      }
      fail();
    })());
  }
  if (v.fileInfo.collectionInfo.tag === "Entities") {
    return apply4((() => {
      const $0 = applicativeV.pure(v.fileInfo);
      if ($0.tag === "Left") {
        return $Either("Left", $0._1);
      }
      if ($0.tag === "Right") {
        return $Either(
          "Right",
          (() => {
            const $1 = $0._1;
            return (csvContent) => ({ fileInfo: $1, csvContent });
          })()
        );
      }
      fail();
    })())((() => {
      const $0 = notEmptyCsv(v.csvContent);
      const $1 = (() => {
        if ($0.tag === "Left") {
          return $Either("Left", $0._1);
        }
        if ($0.tag === "Right") {
          return colsAreValidHeaders($0._1);
        }
        fail();
      })();
      const $2 = (() => {
        if ($1.tag === "Left") {
          return $Either("Left", $1._1);
        }
        if ($1.tag === "Right") {
          return noDupCols($1._1);
        }
        fail();
      })();
      const $3 = oneOfHeaderExists((() => {
        if (v.fileInfo.collectionInfo._1.set.tag === "Just") {
          return [v.fileInfo.collectionInfo._1.set._1, v.fileInfo.collectionInfo._1.domain];
        }
        if (v.fileInfo.collectionInfo._1.set.tag === "Nothing") {
          return [v.fileInfo.collectionInfo._1.domain];
        }
        fail();
      })());
      const $4 = (() => {
        if ($2.tag === "Left") {
          return $Either("Left", $2._1);
        }
        if ($2.tag === "Right") {
          return $3($2._1);
        }
        fail();
      })();
      if ($4.tag === "Left") {
        return $Either("Left", $4._1);
      }
      if ($4.tag === "Right") {
        return noDuplicatedByKey($4._1._1)(v.fileInfo)($4._1._2);
      }
      fail();
    })());
  }
  if (v.fileInfo.collectionInfo.tag === "DataPoints") {
    const keysArr = fromFoldable11($NonEmpty(
      v.fileInfo.collectionInfo._1.pkeys._1,
      listMap(toString3)(v.fileInfo.collectionInfo._1.pkeys._2)
    ));
    return apply4((() => {
      const $0 = applicativeV.pure(v.fileInfo);
      if ($0.tag === "Left") {
        return $Either("Left", $0._1);
      }
      if ($0.tag === "Right") {
        return $Either(
          "Right",
          (() => {
            const $1 = $0._1;
            return (csvContent) => ({ fileInfo: $1, csvContent });
          })()
        );
      }
      fail();
    })())((() => {
      const $0 = notEmptyCsv(v.csvContent);
      const $1 = (() => {
        if ($0.tag === "Left") {
          return $Either("Left", $0._1);
        }
        if ($0.tag === "Right") {
          return colsAreValidIds($0._1);
        }
        fail();
      })();
      const $2 = (() => {
        if ($1.tag === "Left") {
          return $Either("Left", $1._1);
        }
        if ($1.tag === "Right") {
          return noDupCols($1._1);
        }
        fail();
      })();
      const $3 = headersExists([v.fileInfo.collectionInfo._1.indicator, ...keysArr]);
      const $4 = (() => {
        if ($2.tag === "Left") {
          return $Either("Left", $2._1);
        }
        if ($2.tag === "Right") {
          return $3($2._1);
        }
        fail();
      })();
      const $5 = (() => {
        if ($4.tag === "Left") {
          return $Either("Left", $4._1);
        }
        if ($4.tag === "Right") {
          return constrainsAreMet(v.fileInfo.filepath)(v.fileInfo.collectionInfo._1)($4._1);
        }
        fail();
      })();
      if ($5.tag === "Left") {
        return $Either("Left", $5._1);
      }
      if ($5.tag === "Right") {
        return noDuplicatedByKeys(keysArr)(v.fileInfo)($5._1);
      }
      fail();
    })());
  }
  if (v.fileInfo.collectionInfo.tag === "Synonyms") {
    return apply4((() => {
      const $0 = applicativeV.pure(v.fileInfo);
      if ($0.tag === "Left") {
        return $Either("Left", $0._1);
      }
      if ($0.tag === "Right") {
        return $Either(
          "Right",
          (() => {
            const $1 = $0._1;
            return (csvContent) => ({ fileInfo: $1, csvContent });
          })()
        );
      }
      fail();
    })())((() => {
      const $0 = notEmptyCsv(v.csvContent);
      const $1 = (() => {
        if ($0.tag === "Left") {
          return $Either("Left", $0._1);
        }
        if ($0.tag === "Right") {
          return colsAreValidIds($0._1);
        }
        fail();
      })();
      const $2 = (() => {
        if ($1.tag === "Left") {
          return $Either("Left", $1._1);
        }
        if ($1.tag === "Right") {
          return noDupCols($1._1);
        }
        fail();
      })();
      const $3 = (() => {
        if ($2.tag === "Left") {
          return $Either("Left", $2._1);
        }
        if ($2.tag === "Right") {
          return headersExists(["synonym", v.fileInfo.collectionInfo._1])($2._1);
        }
        fail();
      })();
      if ($3.tag === "Left") {
        return $Either("Left", $3._1);
      }
      if ($3.tag === "Right") {
        return noDuplicatedByKey("synonym")(v.fileInfo)($3._1);
      }
      fail();
    })());
  }
  if (v.fileInfo.collectionInfo.tag === "Translations") {
    const $0 = validateFileInfo("./")(v.fileInfo.collectionInfo._1.path);
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      if ($0._1.collectionInfo.tag === "Translations") {
        return $Either("Left", [$Issue("Issue", v.fileInfo.filepath + ": translation of translation is not allowed")]);
      }
      if (parseCsvFile({ fileInfo: $0._1, csvContent: v.csvContent }).tag === "Left") {
        return $Either("Left", parseCsvFile({ fileInfo: $0._1, csvContent: v.csvContent })._1);
      }
      if (parseCsvFile({ fileInfo: $0._1, csvContent: v.csvContent }).tag === "Right") {
        return applicativeV.pure({ fileInfo: v.fileInfo, csvContent: parseCsvFile({ fileInfo: $0._1, csvContent: v.csvContent })._1.csvContent });
      }
    }
    fail();
  }
  return $Either("Left", [NotImplemented]);
};

// output-es/Data.DDF.Csv.Utils/index.js
var fromFoldable5 = /* @__PURE__ */ fromFoldable3(ordHeader)(foldableArray);
var pop3 = /* @__PURE__ */ pop(ordHeader);
var show3 = (record) => "{ collectionInfo: " + showCollection.show(record.collectionInfo) + ", filepath: " + showStringImpl(record.filepath) + " }";
var fromFoldable13 = /* @__PURE__ */ fromFoldable3(ordId)(foldableArray);
var fromFoldable112 = /* @__PURE__ */ (() => {
  const $0 = foldable1NonEmptyList.Foldable0().foldr;
  return (x) => fromFoldableImpl($0, x);
})();
var createEntityInput = (v) => {
  if (v.fileInfo.collectionInfo.tag === "Entities") {
    const $0 = v.fileInfo.collectionInfo._1.domain;
    const $1 = v.fileInfo.collectionInfo._1.set;
    const $2 = v.csvContent.headers;
    const fp = v.fileInfo.filepath;
    const entityCol = (() => {
      if ($1.tag === "Nothing") {
        return $0;
      }
      if ($1.tag === "Just") {
        if (elem(eqHeader)($1._1)($2)) {
          return $1._1;
        }
        return $0;
      }
      fail();
    })();
    return $Either(
      "Right",
      foldrArray((v2) => (acc) => {
        const $3 = pop3(entityCol)(fromFoldable5(zipWithImpl(Tuple, $2, v2._2)));
        const v3 = (() => {
          if ($3.tag === "Just") {
            return $3._1;
          }
          fail();
        })();
        return snoc(acc)({ entityId: v3._1, entityDomain: $0, entitySet: $1, props: v3._2, _info: $Maybe("Just", $ItemInfo(fp, v2._1)) });
      })([])(zipWithImpl(Tuple, v.csvContent.index, transpose(v.csvContent.columns)))
    );
  }
  return $Either("Left", [$Issue("Issue", "can not create entity input for " + show3(v.fileInfo))]);
};
var createDataPointsInput = (v) => {
  if (v.fileInfo.collectionInfo.tag === "DataPoints") {
    const fp = v.fileInfo.filepath;
    return $Either(
      "Right",
      {
        indicatorId: v.fileInfo.collectionInfo._1.indicator,
        by: fromFoldable112($NonEmpty(
          v.fileInfo.collectionInfo._1.pkeys._1,
          listMap(unsafeCoerce)(v.fileInfo.collectionInfo._1.pkeys._2)
        )),
        itemInfo: arrayMap((x) => $ItemInfo(fp, x))(v.csvContent.index),
        values: fromFoldable13(zipWithImpl(Tuple, arrayMap(unsafeCoerce)(v.csvContent.headers), v.csvContent.columns))
      }
    );
  }
  return $Either("Left", [$Issue("Issue", "can not create datapoint input for " + show3(v.fileInfo))]);
};
var createConceptInput = (v) => {
  const rows = zipWithImpl(Tuple, v.csvContent.index, transpose(v.csvContent.columns));
  const headers_ = arrayMap(unsafeCoerce)(v.csvContent.headers);
  if (v.fileInfo.collectionInfo.tag === "Concepts") {
    return $Either(
      "Right",
      foldrArray((v2) => (acc) => {
        const rowMap = fromFoldable5(zipWithImpl(Tuple, headers_, v2._2));
        return snoc(acc)({
          conceptId: unsafeLookup(showHeader)(ordHeader)("concept")(rowMap),
          props: $$delete2(ordHeader)("concept")(rowMap),
          _info: $Maybe("Just", $ItemInfo(v.fileInfo.filepath, v2._1))
        });
      })([])(rows)
    );
  }
  return $Either("Left", [$Issue("Issue", "can not create concept input for " + show3(v.fileInfo))]);
};

// output-es/Data.Map/index.js
var keys3 = /* @__PURE__ */ (() => functorMap.map((v) => {
}))();

// output-es/Data.DDF.DataPoint/index.js
var eq12 = /* @__PURE__ */ (() => eqArrayImpl(eqId.eq))();
var fromFoldable33 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordId)(a)()(m))(Leaf2);
var mergeTwoDataPointsInput = (a) => (b) => {
  if (a.indicatorId === b.indicatorId && eq12(a.by)(b.by)) {
    return $Maybe(
      "Just",
      {
        indicatorId: a.indicatorId,
        by: a.by,
        values: unsafeUnionWith(ordId.compare, concatArray, a.values, b.values),
        itemInfo: [...a.itemInfo, ...b.itemInfo]
      }
    );
  }
  return Nothing;
};
var mergeDataPointsInput = (inputs) => {
  const v = uncons4(inputs);
  const v1 = foldrArray((x) => (acc) => {
    if (acc.tag === "Nothing") {
      return Nothing;
    }
    if (acc.tag === "Just") {
      return mergeTwoDataPointsInput(acc._1)(x);
    }
    fail();
  })($Maybe("Just", v.head))(v.tail);
  if (v1.tag === "Nothing") {
    return $Either("Left", [$Issue("Issue", "cannot merge datapoints inputs with different indicator id and keys")]);
  }
  if (v1.tag === "Just") {
    return $Either("Right", v1._1);
  }
  fail();
};
var headersMatchesData = (expected) => (actual) => {
  if (eqMap(eqId)(eqUnit).eq(expected)(actual)) {
    return $Either("Right", void 0);
  }
  return $Either("Left", [$Issue("Issue", "headers mismatch")]);
};
var parseDataPoints = (v) => {
  const $0 = headersMatchesData(fromFoldable33(snoc(v.by)(v.indicatorId)))(keys3(v.values));
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return $Either("Right", { indicatorId: v.indicatorId, by: v.by, values: v.values, itemInfo: v.itemInfo });
  }
  fail();
};

// output-es/Data.HashMap/foreign.js
function MapNode(datamap, nodemap, content) {
  this.datamap = datamap;
  this.nodemap = nodemap;
  this.content = content;
}
MapNode.prototype.lookup = function lookup3(Nothing2, Just2, keyEquals, key, keyHash, shift) {
  var bit = mask(keyHash, shift);
  if ((this.datamap & bit) !== 0) {
    var i = index3(this.datamap, bit);
    if (keyEquals(key)(this.content[i * 2]))
      return Just2(this.content[i * 2 + 1]);
    return Nothing2;
  }
  if ((this.nodemap & bit) !== 0) {
    return this.content[this.content.length - 1 - index3(this.nodemap, bit)].lookup(Nothing2, Just2, keyEquals, key, keyHash, shift + 5);
  }
  return Nothing2;
};
function remove2insert1Mut(a, removeIndex, insertIndex, v1) {
  for (var i = removeIndex; i < insertIndex; i++)
    a[i] = a[i + 2];
  a[i++] = v1;
  for (; i < a.length - 1; i++)
    a[i] = a[i + 1];
  a.length = a.length - 1;
}
MapNode.prototype.insertMut = function insertMut(keyEquals, hashFunction, key, keyHash, value2, shift) {
  var bit = mask(keyHash, shift);
  var i = index3(this.datamap, bit);
  if ((this.datamap & bit) !== 0) {
    var k = this.content[i * 2];
    if (keyEquals(k)(key)) {
      this.content[i * 2 + 1] = value2;
    } else {
      var newNode = binaryNode(k, hashFunction(k), this.content[i * 2 + 1], key, keyHash, value2, shift + 5);
      this.datamap = this.datamap ^ bit;
      this.nodemap = this.nodemap | bit;
      remove2insert1Mut(this.content, i * 2, this.content.length - index3(this.nodemap, bit) - 2, newNode);
    }
  } else if ((this.nodemap & bit) !== 0) {
    var n = this.content.length - 1 - index3(this.nodemap, bit);
    this.content[n].insertMut(keyEquals, hashFunction, key, keyHash, value2, shift + 5);
  } else {
    this.datamap = this.datamap | bit;
    this.content.splice(i * 2, 0, key, value2);
  }
};
MapNode.prototype.insert = function insert2(keyEquals, hashFunction, key, keyHash, value2, shift) {
  var bit = mask(keyHash, shift);
  var i = index3(this.datamap, bit);
  if ((this.datamap & bit) !== 0) {
    var k = this.content[i * 2];
    if (keyEquals(k)(key))
      return new MapNode(this.datamap, this.nodemap, overwriteTwoElements(this.content, i * 2, key, value2));
    var newNode = binaryNode(k, hashFunction(k), this.content[i * 2 + 1], key, keyHash, value2, shift + 5);
    return new MapNode(this.datamap ^ bit, this.nodemap | bit, remove2insert1(this.content, i * 2, this.content.length - index3(this.nodemap, bit) - 2, newNode));
  }
  if ((this.nodemap & bit) !== 0) {
    var n = this.content.length - 1 - index3(this.nodemap, bit);
    return new MapNode(
      this.datamap,
      this.nodemap,
      copyAndOverwriteOrExtend1(
        this.content,
        n,
        this.content[n].insert(keyEquals, hashFunction, key, keyHash, value2, shift + 5)
      )
    );
  }
  return new MapNode(this.datamap | bit, this.nodemap, insert22(this.content, i * 2, key, value2));
};
MapNode.prototype.insertWith = function insertWith2(keyEquals, hashFunction, f, key, keyHash, value2, shift) {
  var bit = mask(keyHash, shift);
  var i = index3(this.datamap, bit);
  if ((this.datamap & bit) !== 0) {
    var k = this.content[i * 2];
    if (keyEquals(k)(key))
      return new MapNode(this.datamap, this.nodemap, overwriteTwoElements(this.content, i * 2, key, f(this.content[i * 2 + 1])(value2)));
    var newNode = binaryNode(k, hashFunction(k), this.content[i * 2 + 1], key, keyHash, value2, shift + 5);
    return new MapNode(this.datamap ^ bit, this.nodemap | bit, remove2insert1(this.content, i * 2, this.content.length - index3(this.nodemap, bit) - 2, newNode));
  }
  if ((this.nodemap & bit) !== 0) {
    var n = this.content.length - 1 - index3(this.nodemap, bit);
    return new MapNode(
      this.datamap,
      this.nodemap,
      copyAndOverwriteOrExtend1(
        this.content,
        n,
        this.content[n].insertWith(keyEquals, hashFunction, f, key, keyHash, value2, shift + 5)
      )
    );
  }
  return new MapNode(this.datamap | bit, this.nodemap, insert22(this.content, i * 2, key, value2));
};
MapNode.prototype.delet = function delet(keyEquals, key, keyHash, shift) {
  var bit = mask(keyHash, shift);
  if ((this.datamap & bit) !== 0) {
    var dataIndex = index3(this.datamap, bit);
    if (keyEquals(this.content[dataIndex * 2])(key)) {
      if (this.nodemap === 0 && this.content.length === 2)
        return empty2;
      return new MapNode(this.datamap ^ bit, this.nodemap, remove2(this.content, dataIndex * 2));
    }
    return this;
  }
  if ((this.nodemap & bit) !== 0) {
    var nodeIndex = index3(this.nodemap, bit);
    var recNode = this.content[this.content.length - 1 - nodeIndex];
    var recRes = recNode.delet(keyEquals, key, keyHash, shift + 5);
    if (recNode === recRes)
      return this;
    if (recRes.isSingleton()) {
      if (this.content.length === 1) {
        recRes.datamap = this.nodemap;
        return recRes;
      }
      return new MapNode(
        this.datamap | bit,
        this.nodemap ^ bit,
        insert2remove1(this.content, 2 * index3(this.datamap, bit), recRes.content[0], recRes.content[1], this.content.length - 1 - nodeIndex)
      );
    }
    return new MapNode(this.datamap, this.nodemap, copyAndOverwriteOrExtend1(this.content, this.content.length - 1 - nodeIndex, recRes));
  }
  return this;
};
MapNode.prototype.toArrayBy = function(f, res) {
  for (var i = 0; i < popCount(this.datamap) * 2; ) {
    var k = this.content[i++];
    var v = this.content[i++];
    res.push(f(k)(v));
  }
  for (; i < this.content.length; i++)
    this.content[i].toArrayBy(f, res);
};
MapNode.prototype.isSingleton = function() {
  return this.nodemap === 0 && this.content.length === 2;
};
MapNode.prototype.eq = function(kf, vf, that) {
  if (this === that)
    return true;
  if (this.constructor !== that.constructor || this.nodemap !== that.nodemap || this.datamap !== that.datamap)
    return false;
  for (var i = 0; i < popCount(this.datamap) * 2; ) {
    if (kf(this.content[i])(that.content[i]))
      i++;
    else
      return false;
    if (vf(this.content[i])(that.content[i]))
      i++;
    else
      return false;
  }
  for (; i < this.content.length; i++)
    if (!this.content[i].eq(kf, vf, that.content[i]))
      return false;
  return true;
};
MapNode.prototype.hash = function(vhash) {
  var h = this.datamap;
  for (var i = 0; i < popCount(this.datamap); i++)
    h = h * 31 + vhash(this.content[i * 2 + 1]) | 0;
  for (var j = 0; j < popCount(this.nodemap); j++)
    h = h * 31 + this.content[this.content.length - j - 1].hash(vhash) | 0;
  return h;
};
MapNode.prototype.size = function() {
  var res = popCount(this.datamap);
  for (var i = res * 2; i < this.content.length; i++)
    res += this.content[i].size();
  return res;
};
MapNode.prototype.imap = function(f) {
  var newContent = this.content.slice();
  for (var i = 0; i < popCount(this.datamap) * 2; ) {
    var k = this.content[i++];
    var v = this.content[i++];
    newContent[i - 2] = k;
    newContent[i - 1] = f(k)(v);
  }
  for (; i < this.content.length; i++)
    newContent[i] = this.content[i].imap(f);
  return new MapNode(this.datamap, this.nodemap, newContent);
};
MapNode.prototype.ifoldMap = function(m, mappend, f) {
  for (var i = 0; i < popCount(this.datamap) * 2; ) {
    var k = this.content[i++];
    var v = this.content[i++];
    m = mappend(m)(f(k)(v));
  }
  for (; i < this.content.length; i++)
    m = this.content[i].ifoldMap(m, mappend, f);
  return m;
};
function lowestBit(n) {
  return n & -n;
}
function mergeState(bit, thisnode, thisdata, thatnode, thatdata) {
  var state = 0;
  state |= (bit & thisnode) !== 0 ? 1 : 0;
  state |= (bit & thisdata) !== 0 ? 2 : 0;
  state |= (bit & thatnode) !== 0 ? 4 : 0;
  state |= (bit & thatdata) !== 0 ? 8 : 0;
  return state;
}
MapNode.prototype.unionWith = function(eq, hash, f, that, shift) {
  if (this.constructor !== that.constructor)
    throw "Trying to union a MapNode with something else";
  var thisDataIndex, thatDataIndex, thisNodeIndex, thatNodeIndex;
  var datamap = 0;
  var nodemap = 0;
  var data = [];
  var nodes = [];
  var skipmap = this.datamap | this.nodemap | that.datamap | that.nodemap;
  while (skipmap !== 0) {
    var bit = lowestBit(skipmap);
    skipmap &= ~bit;
    switch (mergeState(bit, this.nodemap, this.datamap, that.nodemap, that.datamap)) {
      case 1:
        thisNodeIndex = index3(this.nodemap, bit);
        nodemap |= bit;
        nodes.push(this.content[this.content.length - thisNodeIndex - 1]);
        break;
      case 2:
        thisDataIndex = index3(this.datamap, bit);
        datamap |= bit;
        data.push(this.content[thisDataIndex * 2], this.content[thisDataIndex * 2 + 1]);
        break;
      case 4:
        thatNodeIndex = index3(that.nodemap, bit);
        nodemap |= bit;
        nodes.push(that.content[that.content.length - thatNodeIndex - 1]);
        break;
      case 5:
        thisNodeIndex = index3(this.nodemap, bit);
        thatNodeIndex = index3(that.nodemap, bit);
        nodemap |= bit;
        nodes.push(
          this.content[this.content.length - thisNodeIndex - 1].unionWith(eq, hash, f, that.content[that.content.length - thatNodeIndex - 1], shift + 5)
        );
        break;
      case 6:
        thisDataIndex = index3(this.datamap, bit);
        thatNodeIndex = index3(that.nodemap, bit);
        var k = this.content[thisDataIndex * 2];
        var v = this.content[thisDataIndex * 2 + 1];
        var hk = hash(k);
        var flippedF = function(a) {
          return function(b) {
            return f(b)(a);
          };
        };
        nodemap |= bit;
        nodes.push(that.content[that.content.length - thatNodeIndex - 1].insertWith(eq, hash, flippedF, k, hk, v, shift + 5));
        break;
      case 8:
        thatDataIndex = index3(that.datamap, bit);
        datamap |= bit;
        data.push(that.content[thatDataIndex * 2], that.content[thatDataIndex * 2 + 1]);
        break;
      case 9:
        thatDataIndex = index3(that.datamap, bit);
        thisNodeIndex = index3(this.nodemap, bit);
        var k = that.content[thatDataIndex * 2];
        var v = that.content[thatDataIndex * 2 + 1];
        var hk = hash(k);
        nodemap |= bit;
        nodes.push(this.content[this.content.length - thisNodeIndex - 1].insertWith(eq, hash, f, k, hk, v, shift + 5));
        break;
      case 10:
        thisDataIndex = index3(this.datamap, bit);
        thatDataIndex = index3(that.datamap, bit);
        if (eq(this.content[thisDataIndex * 2])(that.content[thatDataIndex * 2])) {
          datamap |= bit;
          data.push(this.content[thisDataIndex * 2], f(this.content[thisDataIndex * 2 + 1])(that.content[thatDataIndex * 2 + 1]));
        } else {
          nodemap |= bit;
          nodes.push(binaryNode(
            this.content[thisDataIndex * 2],
            hash(this.content[thisDataIndex * 2]),
            this.content[thisDataIndex * 2 + 1],
            that.content[thatDataIndex * 2],
            hash(that.content[thatDataIndex * 2]),
            that.content[thatDataIndex * 2 + 1],
            shift + 5
          ));
        }
        break;
    }
  }
  return new MapNode(datamap, nodemap, data.concat(nodes.reverse()));
};
MapNode.prototype.intersectionWith = function(Nothing2, Just2, eq, hash, f, that, shift) {
  if (this.constructor !== that.constructor)
    throw "Trying to intersect a MapNode with something else";
  var thisDataIndex, thatDataIndex, thisNodeIndex, thatNodeIndex;
  var datamap = 0;
  var nodemap = 0;
  var data = [];
  var nodes = [];
  var skipmap = (this.datamap | this.nodemap) & (that.datamap | that.nodemap);
  while (skipmap !== 0) {
    var bit = lowestBit(skipmap);
    skipmap &= ~bit;
    switch (mergeState(bit, this.nodemap, this.datamap, that.nodemap, that.datamap)) {
      case 5:
        thisNodeIndex = index3(this.nodemap, bit);
        thatNodeIndex = index3(that.nodemap, bit);
        var recRes = this.content[this.content.length - thisNodeIndex - 1].intersectionWith(Nothing2, Just2, eq, hash, f, that.content[that.content.length - thatNodeIndex - 1], shift + 5);
        if (isEmpty2(recRes))
          continue;
        if (recRes.isSingleton()) {
          datamap |= bit;
          data.push(recRes.content[0], recRes.content[1]);
        } else {
          nodemap |= bit;
          nodes.push(recRes);
        }
        break;
      case 6:
        thisDataIndex = index3(this.datamap, bit);
        thatNodeIndex = index3(that.nodemap, bit);
        var k = this.content[thisDataIndex * 2];
        var v = this.content[thisDataIndex * 2 + 1];
        var hk = hash(k);
        var res = that.content[that.content.length - thatNodeIndex - 1].lookup(Nothing2, Just2, eq, k, hk, shift + 5);
        if (res !== Nothing2) {
          datamap |= bit;
          data.push(k, f(v)(res.value0));
        }
        break;
      case 9:
        thatDataIndex = index3(that.datamap, bit);
        thisNodeIndex = index3(this.nodemap, bit);
        var k = that.content[thatDataIndex * 2];
        var v = that.content[thatDataIndex * 2 + 1];
        var hk = hash(k);
        var res = this.content[this.content.length - thisNodeIndex - 1].lookup(Nothing2, Just2, eq, k, hk, shift + 5);
        if (res !== Nothing2) {
          datamap |= bit;
          data.push(k, f(res.value0)(v));
        }
        break;
      case 10:
        thisDataIndex = index3(this.datamap, bit);
        thatDataIndex = index3(that.datamap, bit);
        if (eq(this.content[thisDataIndex * 2])(that.content[thatDataIndex * 2])) {
          datamap |= bit;
          data.push(this.content[thisDataIndex * 2], f(this.content[thisDataIndex * 2 + 1])(that.content[thatDataIndex * 2 + 1]));
        }
        break;
    }
  }
  return new MapNode(datamap, nodemap, data.concat(nodes.reverse()));
};
MapNode.prototype.filterWithKey = function filterWithKey(f) {
  var datamap = 0;
  var nodemap = 0;
  var data = [];
  var nodes = [];
  var skipmap = this.datamap | this.nodemap;
  while (skipmap !== 0) {
    var bit = lowestBit(skipmap);
    skipmap &= ~bit;
    if ((this.datamap & bit) !== 0) {
      var dataIndex = index3(this.datamap, bit);
      var k = this.content[dataIndex * 2];
      var v = this.content[dataIndex * 2 + 1];
      if (f(k)(v)) {
        datamap |= bit;
        data.push(k, v);
      }
    } else {
      var nodeIndex = index3(this.nodemap, bit);
      var node = this.content[this.content.length - nodeIndex - 1].filterWithKey(f);
      if (isEmpty2(node))
        continue;
      if (node.isSingleton()) {
        datamap |= bit;
        data.push(node.content[0], node.content[1]);
      } else {
        nodemap |= bit;
        nodes.push(node);
      }
    }
  }
  return new MapNode(datamap, nodemap, data.concat(nodes.reverse()));
};
MapNode.prototype.travHelper = function() {
  function go(vi, vm2, ni, nm, copy) {
    if (vi < vm2)
      return function(v) {
        return go(vi + 1, vm2, ni, nm, function() {
          var res = copy();
          res.content[vi * 2 + 1] = v;
          return res;
        });
      };
    if (ni < nm)
      return function(n) {
        return go(vi, vm2, ni + 1, nm, function() {
          var res = copy();
          res.content[vm2 * 2 + ni] = n;
          return res;
        });
      };
    return copy();
  }
  var vm = popCount(this.datamap);
  var self = this;
  return go(0, vm, 0, this.content.length - vm * 2, function() {
    return new MapNode(self.datamap, self.nodemap, self.content.slice());
  });
};
MapNode.prototype.ifoldMap = function(m, mappend, f) {
  for (var i = 0; i < popCount(this.datamap) * 2; ) {
    var k = this.content[i++];
    var v = this.content[i++];
    m = mappend(m)(f(k)(v));
  }
  for (; i < this.content.length; i++)
    m = this.content[i].ifoldMap(m, mappend, f);
  return m;
};
MapNode.prototype.itraverse = function(pure3, apply6, f) {
  var m = pure3(this.travHelper());
  for (var i = 0; i < popCount(this.datamap) * 2; ) {
    var k = this.content[i++];
    var v = this.content[i++];
    m = apply6(m)(f(k)(v));
  }
  for (; i < this.content.length; i++)
    m = apply6(m)(this.content[i].itraverse(pure3, apply6, f));
  return m;
};
MapNode.prototype.any = function(predicate) {
  for (var i = 1; i < popCount(this.datamap) * 2; i = i + 2) {
    var v = this.content[i];
    if (predicate(v)) {
      return true;
    }
  }
  i--;
  for (; i < this.content.length; i++) {
    if (this.content[i].any(predicate)) {
      return true;
    }
  }
  return false;
};
function Collision(keys5, values3) {
  this.keys = keys5;
  this.values = values3;
}
Collision.prototype.lookup = function collisionLookup(Nothing2, Just2, keyEquals, key, keyHash, shift) {
  for (var i = 0; i < this.keys.length; i++)
    if (keyEquals(key)(this.keys[i]))
      return Just2(this.values[i]);
  return Nothing2;
};
Collision.prototype.insert = function collisionInsert(keyEquals, hashFunction, key, keyHash, value2, shift) {
  var i = 0;
  for (; i < this.keys.length; i++)
    if (keyEquals(key)(this.keys[i]))
      break;
  return new Collision(
    copyAndOverwriteOrExtend1(this.keys, i, key),
    copyAndOverwriteOrExtend1(this.values, i, value2)
  );
};
Collision.prototype.insertMut = function collisionInsertMut(keyEquals, hashFunction, key, keyHash, value2, shift) {
  var i = 0;
  for (; i < this.keys.length; i++)
    if (keyEquals(key)(this.keys[i]))
      break;
  this.keys[i] = key;
  this.values[i] = value2;
};
Collision.prototype.insertWith = function collisionInsert2(keyEquals, hashFunction, f, key, keyHash, value2, shift) {
  var i = 0;
  for (; i < this.keys.length; i++)
    if (keyEquals(key)(this.keys[i]))
      return new Collision(
        copyAndOverwriteOrExtend1(this.keys, i, key),
        copyAndOverwriteOrExtend1(this.values, i, f(this.values[i])(value2))
      );
  return new Collision(
    copyAndOverwriteOrExtend1(this.keys, i, key),
    copyAndOverwriteOrExtend1(this.values, i, value2)
  );
};
Collision.prototype.delet = function collisionDelete(keyEquals, key, keyHash, shift) {
  var i = 0;
  for (; i < this.keys.length; i++)
    if (keyEquals(key)(this.keys[i]))
      break;
  if (i === this.keys.length)
    return this;
  if (this.keys.length === 2)
    return new MapNode(1 << (keyHash & 31), 0, [this.keys[1 - i], this.values[1 - i]]);
  return new Collision(remove1(this.keys, i), remove1(this.values, i));
};
Collision.prototype.toArrayBy = function(f, res) {
  for (var i = 0; i < this.keys.length; i++)
    res.push(f(this.keys[i])(this.values[i]));
};
Collision.prototype.isSingleton = function() {
  return false;
};
Collision.prototype.eq = function(kf, vf, that) {
  if (this.constructor !== that.constructor || this.keys.length !== that.keys.length)
    return false;
  outer:
    for (var i = 0; i < this.keys.length; i++) {
      for (var j = 0; j < that.keys.length; j++) {
        if (kf(this.keys[i])(that.keys[j])) {
          if (vf(this.values[i])(that.values[j]))
            continue outer;
          else
            return false;
        }
      }
    }
  return true;
};
Collision.prototype.hash = function(vhash) {
  var h = 0;
  for (var i = 0; i < this.values.length; i++)
    h += vhash(this.values[i]);
  return h;
};
Collision.prototype.size = function() {
  return this.keys.length;
};
Collision.prototype.imap = function(f) {
  var newValues = this.values.slice();
  for (var i = 0; i < this.values.length; i++)
    newValues[i] = f(this.keys[i])(this.values[i]);
  return new Collision(this.keys, newValues);
};
Collision.prototype.ifoldMap = function(m, mappend, f) {
  for (var i = 0; i < this.keys.length; i++)
    m = mappend(m)(f(this.keys[i])(this.values[i]));
  return m;
};
Collision.prototype.travHelper = function() {
  function go(i, m, copy) {
    if (i < m)
      return function(v) {
        return go(i + 1, m, function() {
          var res = copy();
          res.values[i] = v;
          return res;
        });
      };
    return copy();
  }
  var self = this;
  return go(0, this.keys.length, function() {
    return new Collision(self.keys, self.values.slice());
  });
};
Collision.prototype.itraverse = function(pure3, apply6, f) {
  var m = pure3(this.travHelper());
  for (var i = 0; i < this.keys.length; i++)
    m = apply6(m)(f(this.keys[i])(this.values[i]));
  return m;
};
Collision.prototype.unionWith = function(eq, hash, f, that, shift) {
  if (that.constructor !== Collision)
    throw "Trying to union a Collision with something else";
  var keys5 = [];
  var values3 = [];
  var added = Array(that.keys.length).fill(false);
  outer:
    for (var i = 0; i < this.keys.length; i++) {
      for (var j = 0; j < that.keys.length; j++) {
        if (eq(this.keys[i])(that.keys[j])) {
          keys5.push(this.keys[i]);
          values3.push(f(this.values[i])(that.values[j]));
          added[j] = true;
          continue outer;
        }
      }
      keys5.push(this.keys[i]);
      values3.push(this.values[i]);
      added[j] = true;
    }
  for (var k = 0; k < that.keys.length; k++) {
    if (!added[k]) {
      keys5.push(that.keys[k]);
      values3.push(that.values[k]);
    }
  }
  return new Collision(keys5, values3);
};
Collision.prototype.intersectionWith = function(Nothing2, Just2, eq, hash, f, that, shift) {
  if (that.constructor !== Collision)
    throw "Trying to intersect a Collision with something else";
  var keys5 = [];
  var values3 = [];
  outer:
    for (var i = 0; i < this.keys.length; i++) {
      for (var j = 0; j < that.keys.length; j++) {
        if (eq(this.keys[i])(that.keys[j])) {
          keys5.push(this.keys[i]);
          values3.push(f(this.values[i])(that.values[j]));
          continue outer;
        }
      }
    }
  if (keys5.length === 0)
    return empty2;
  if (keys5.length === 1)
    return new MapNode(1, 0, [keys5[0], values3[0]]);
  return new Collision(keys5, values3);
};
Collision.prototype.filterWithKey = function collisionFilterWithKey(f) {
  var keys5 = [];
  var values3 = [];
  for (var i = 0; i < this.keys.length; i++) {
    var k = this.keys[i];
    var v = this.values[i];
    if (f(k)(v)) {
      keys5.push(k);
      values3.push(v);
    }
  }
  if (keys5.length === 0)
    return empty2;
  if (keys5.length === 1)
    return new MapNode(1, 0, [keys5[0], values3[0]]);
  return new Collision(keys5, values3);
};
Collision.prototype.any = function(predicate) {
  for (var i = 0; i < this.keys.length; i++) {
    if (predicate(this.values[i])) {
      return true;
    }
  }
  return false;
};
function mask(keyHash, shift) {
  return 1 << (keyHash >>> shift & 31);
}
function index3(map2, bit) {
  return popCount(map2 & bit - 1);
}
function popCount(n) {
  n = n - (n >> 1 & 1431655765);
  n = (n & 858993459) + (n >> 2 & 858993459);
  return (n + (n >> 4) & 252645135) * 16843009 >> 24;
}
function binaryNode(k1, kh1, v1, k2, kh2, v2, s) {
  if (s >= 32)
    return new Collision([k1, k2], [v1, v2]);
  var b1 = kh1 >>> s & 31;
  var b2 = kh2 >>> s & 31;
  if (b1 !== b2)
    return new MapNode(1 << b1 | 1 << b2, 0, b1 >>> 0 < b2 >>> 0 ? [k1, v1, k2, v2] : [k2, v2, k1, v1]);
  return new MapNode(0, 1 << b1, [binaryNode(k1, kh1, v1, k2, kh2, v2, s + 5)]);
}
function overwriteTwoElements(a, index4, v1, v2) {
  var res = a.slice();
  res[index4] = v1;
  res[index4 + 1] = v2;
  return res;
}
function remove2(a, index4) {
  var res = a.slice();
  res.splice(index4, 2);
  return res;
}
function remove1(a, index4) {
  var res = a.slice();
  res.splice(index4, 1);
  return res;
}
function copyAndOverwriteOrExtend1(a, index4, v) {
  var res = a.slice();
  res[index4] = v;
  return res;
}
function remove2insert1(a, removeIndex, insertIndex, v1) {
  var res = new Array(a.length - 1);
  for (var i = 0; i < removeIndex; i++)
    res[i] = a[i];
  for (; i < insertIndex; i++)
    res[i] = a[i + 2];
  res[i++] = v1;
  for (; i < res.length; i++)
    res[i] = a[i + 1];
  return res;
}
function insert22(a, index4, v1, v2) {
  var res = new Array(a.length + 2);
  for (var i = 0; i < index4; i++)
    res[i] = a[i];
  res[i++] = v1;
  res[i++] = v2;
  for (; i < res.length; i++)
    res[i] = a[i - 2];
  return res;
}
function insert2remove1(a, insertIndex, v1, v2, removeIndex) {
  var res = new Array(a.length + 1);
  for (var i = 0; i < insertIndex; i++)
    res[i] = a[i];
  res[i++] = v1;
  res[i++] = v2;
  for (; i < removeIndex + 2; i++)
    res[i] = a[i - 2];
  for (; i < res.length; i++)
    res[i] = a[i - 1];
  return res;
}
var empty2 = new MapNode(0, 0, []);
function lookupPurs(Nothing2, Just2, keyEquals, key, keyHash) {
  return function(m) {
    return m.lookup(Nothing2, Just2, keyEquals, key, keyHash, 0);
  };
}
function fromArrayPurs(keyEquals, hashFunction) {
  return function(kf) {
    return function(vf) {
      return function(a) {
        var m = new MapNode(0, 0, []);
        for (var i = 0; i < a.length; i++) {
          var x = a[i];
          var k = kf(x);
          m.insertMut(keyEquals, hashFunction, k, hashFunction(k), vf(x), 0);
        }
        return m;
      };
    };
  };
}
function toArrayBy(f) {
  return function(m) {
    var res = [];
    m.toArrayBy(f, res);
    return res;
  };
}
function isEmpty2(m) {
  return m.datamap === 0 && m.nodemap === 0;
}

// output-es/Data.HashMap/index.js
var values2 = /* @__PURE__ */ toArrayBy((v) => (v1) => v1);
var lookup4 = (dictHashable) => {
  const eq = dictHashable.Eq0().eq;
  return (k) => lookupPurs(Nothing, Just, eq, k, dictHashable.hash(k));
};
var member = (dictHashable) => {
  const lookup1 = lookup4(dictHashable);
  return (k) => {
    const $0 = lookup1(k);
    return (x) => {
      const $1 = $0(x);
      if ($1.tag === "Nothing") {
        return false;
      }
      if ($1.tag === "Just") {
        return true;
      }
      fail();
    };
  };
};
var keys4 = /* @__PURE__ */ toArrayBy($$const);

// output-es/Record.Builder/foreign.js
function unsafeInsert(l) {
  return function(a) {
    return function(rec) {
      rec[l] = a;
      return rec;
    };
  };
}

// output-es/Record.Builder/index.js
var insert3 = () => () => (dictIsSymbol) => (l) => (a) => (r1) => unsafeInsert(dictIsSymbol.reflectSymbol(l))(a)(r1);

// output-es/Yoga.JSON/foreign.js
function reviver(key, value2) {
  if (key === "big") {
    return BigInt(value2);
  }
  return value2;
}
var _parseJSON = (payload) => JSON.parse(payload, reviver);

// output-es/Yoga.JSON/index.js
var identity16 = (x) => x;
var bindExceptT2 = /* @__PURE__ */ bindExceptT(monadIdentity);
var writeForeignString = { writeImpl: unsafeCoerce };
var writeForeignInt = { writeImpl: unsafeCoerce };
var writeForeignFieldsNilRowR = { writeImplFields: (v) => (v1) => identity16 };
var writeForeignBoolean = { writeImpl: unsafeCoerce };
var readForeignString = { readImpl: /* @__PURE__ */ readString(monadIdentity) };
var writeForeignFieldsCons = (dictIsSymbol) => (dictWriteForeign) => (dictWriteForeignFields) => () => () => () => ({
  writeImplFields: (v) => (rec) => {
    const $0 = insert3()()(dictIsSymbol)($$Proxy)(dictWriteForeign.writeImpl(unsafeGet(dictIsSymbol.reflectSymbol($$Proxy))(rec)));
    const $1 = dictWriteForeignFields.writeImplFields($$Proxy)(rec);
    return (x) => $0($1(x));
  }
});
var sequenceCombining = (dictMonoid) => {
  const mempty = dictMonoid.mempty;
  return (dictFoldable) => (dictApplicative) => dictFoldable.foldl((acc) => (elem6) => {
    if (acc.tag === "Left") {
      if (elem6.tag === "Left") {
        return $Either("Left", semigroupNonEmptyList.append(acc._1)(elem6._1));
      }
      if (elem6.tag === "Right") {
        return $Either("Left", acc._1);
      }
      fail();
    }
    if (acc.tag === "Right") {
      if (elem6.tag === "Right") {
        return $Either("Right", dictMonoid.Semigroup0().append(acc._1)(dictApplicative.pure(elem6._1)));
      }
      if (elem6.tag === "Left") {
        return $Either("Left", elem6._1);
      }
    }
    fail();
  })($Either("Right", mempty));
};
var sequenceCombining1 = /* @__PURE__ */ sequenceCombining(monoidArray)(foldableArray)(applicativeArray);
var readAtIdx = (dictReadForeign) => (i) => (f) => {
  const $0 = functorNonEmptyList.map(ErrorAtIndex(i));
  const $1 = dictReadForeign.readImpl(f);
  if ($1.tag === "Right") {
    return $Either("Right", $1._1);
  }
  if ($1.tag === "Left") {
    return $Either("Left", $0($1._1));
  }
  fail();
};
var readForeignArray = (dictReadForeign) => ({
  readImpl: (() => {
    const $0 = mapWithIndexArray(readAtIdx(dictReadForeign));
    return (a) => bindExceptT2.bind(readArray(monadIdentity)(a))((x) => sequenceCombining1($0(x)));
  })()
});
var parseJSON = /* @__PURE__ */ (() => {
  const $0 = runEffectFn1(_parseJSON);
  return (x) => {
    const $1 = (() => {
      const $12 = $0(x);
      return catchException((x$1) => () => $Either("Left", x$1))(() => {
        const a$p = $12();
        return $Either("Right", a$p);
      });
    })()();
    if ($1.tag === "Left") {
      return $Either("Left", $NonEmpty($ForeignError("ForeignError", message($1._1)), Nil));
    }
    if ($1.tag === "Right") {
      return $Either("Right", $1._1);
    }
    fail();
  };
})();

// output-es/Yoga.JSON.Error/index.js
var toJSONPath = (fe) => {
  const go = (v) => {
    if (v.tag === "ForeignError") {
      return "";
    }
    if (v.tag === "TypeMismatch") {
      return "";
    }
    if (v.tag === "ErrorAtIndex") {
      return "[" + showIntImpl(v._1) + "]" + go(v._2);
    }
    if (v.tag === "ErrorAtProperty") {
      if (v._2.tag === "TypeMismatch" && v._2._2 === "undefined") {
        return "";
      }
      return "." + v._1 + go(v._2);
    }
    fail();
  };
  return "$" + go(fe);
};
var errorToJSON = (err) => {
  const path2 = toJSONPath(err);
  const go = (go$a0$copy) => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === "ForeignError") {
        go$c = false;
        go$r = { path: path2, message: v._1 };
        continue;
      }
      if (v.tag === "TypeMismatch") {
        if (v._2 === "Undefined") {
          go$c = false;
          go$r = { path: path2, message: "Must provide a value of type '" + v._1 + "'" };
          continue;
        }
        if (v._2 === "undefined") {
          go$c = false;
          go$r = { path: path2, message: "Must provide a value of type '" + v._1 + "'" };
          continue;
        }
        go$c = false;
        go$r = { path: path2, message: "Must provide a value of type '" + v._1 + "' instead of '" + v._2 + "'" };
        continue;
      }
      if (v.tag === "ErrorAtIndex") {
        go$a0 = v._2;
        continue;
      }
      if (v.tag === "ErrorAtProperty") {
        go$a0 = v._2;
        continue;
      }
      fail();
    }
    return go$r;
  };
  return go(err);
};

// output-es/Data.DDF.Atoms.Value/index.js
var $Value = (tag, _1) => ({ tag, _1 });
var readJSON = /* @__PURE__ */ (() => {
  const $0 = readForeignArray(readForeignString).readImpl;
  return (x) => bindExceptT2.bind(parseJSON(x))($0);
})();
var member2 = /* @__PURE__ */ member(hashableString);
var parseTimeVal = (input) => {
  const inputlen = toCodePointArray(input).length;
  if (inputlen <= 4 && (() => {
    const $0 = fromString(input);
    return inputlen >= 3 && (() => {
      if ($0.tag === "Nothing") {
        return false;
      }
      if ($0.tag === "Just") {
        return true;
      }
      fail();
    })();
  })()) {
    return $Either("Right", $Value("TimeVal", input));
  }
  return $Either("Left", [$Issue("Issue", showStringImpl(input) + " is not a valid time value.")]);
};
var parseStrVal = (x) => $Either("Right", $Value("StrVal", x));
var parseNumVal = (input) => {
  const v = fromStringImpl(input, isFiniteImpl, Just, Nothing);
  if (v.tag === "Nothing") {
    return $Either("Left", [$Issue("Issue", input + " is not a number.")]);
  }
  if (v.tag === "Just") {
    return $Either("Right", $Value("NumVal", v._1));
  }
  fail();
};
var parseJsonListVal = (input) => {
  if (input === "") {
    return $Either("Right", $Value("JsonListVal", []));
  }
  const output = readJSON(input);
  if (output.tag === "Left") {
    return $Either(
      "Left",
      fromFoldableImpl(
        foldableNonEmptyList.foldr,
        $NonEmpty(
          $Issue(
            "Issue",
            (() => {
              const $0 = errorToJSON(output._1._1);
              return $0.message + " at " + $0.path;
            })()
          ),
          listMap((x) => $Issue(
            "Issue",
            (() => {
              const $0 = errorToJSON(x);
              return $0.message + " at " + $0.path;
            })()
          ))(output._1._2)
        )
      )
    );
  }
  if (output.tag === "Right") {
    return $Either("Right", $Value("JsonListVal", output._1));
  }
  fail();
};
var parseDomainVal = (domainName) => (domain) => (input) => {
  if (input === "") {
    return $Either("Left", [$Issue("Issue", showStringImpl(input) + " is not a valid value in " + domainName + " domain.")]);
  }
  if (member2(input)(domain)) {
    return $Either("Right", $Value("DomainVal", input));
  }
  return $Either("Left", [$Issue("Issue", showStringImpl(input) + " is not a valid value in " + domainName + " domain.")]);
};
var parseBoolVal = (v) => {
  if (v === "TRUE") {
    return $Either("Right", $Value("BoolVal", true));
  }
  if (v === "true") {
    return $Either("Right", $Value("BoolVal", true));
  }
  if (v === "FALSE") {
    return $Either("Right", $Value("BoolVal", false));
  }
  if (v === "false") {
    return $Either("Right", $Value("BoolVal", false));
  }
  return $Either("Left", [$Issue("Issue", "not a boolean value: " + showStringImpl(v))]);
};

// output-es/Data.DDF.Entity/index.js
var applicativeV2 = /* @__PURE__ */ (() => {
  const applyV1 = applyV(semigroupArray);
  return { pure: (x) => $Either("Right", x), Apply0: () => applyV1 };
})();
var toUnfoldableUnordered = /* @__PURE__ */ (() => {
  const $0 = unfoldableArray.unfoldr(stepUnfoldrUnordered);
  return (x) => $0($MapIter("IterNode", x, IterLeaf));
})();
var traverse = /* @__PURE__ */ (() => traversableArray.traverse(applicativeV2))();
var fromFoldable6 = /* @__PURE__ */ fromFoldable3(ordId)(foldableArray);
var apply5 = /* @__PURE__ */ (() => applyV(semigroupArray).apply)();
var splitEntAndProps = (props) => {
  const v = partitionImpl(
    (v2) => {
      const v1 = stripPrefix2("is--")(v2._1);
      if (v1.tag === "Nothing") {
        return false;
      }
      if (v1.tag === "Just") {
        return true;
      }
      fail();
    },
    toUnfoldableUnordered(props)
  );
  return $Tuple(
    arrayMap((v1) => $Tuple(
      (() => {
        const $0 = drop2(length2(take2(4)(v1._1)))(v1._1);
        if ($0 === "") {
          return "undefined_id";
        }
        return $0;
      })(),
      v1._2
    ))(v.yes),
    arrayMap((v1) => $Tuple(v1._1 === "" ? "undefined_id" : v1._1, v1._2))(v.no)
  );
};
var removeIsDomainProp = (domain) => (xs) => {
  const v = findIndexImpl(Just, Nothing, (v2) => v2 === domain, arrayMap((x) => x._1)(xs));
  if (v.tag === "Nothing") {
    return applicativeV2.pure(xs);
  }
  if (v.tag === "Just") {
    const $0 = _deleteAt(Just, Nothing, v._1, xs);
    const xs$p = (() => {
      if ($0.tag === "Just") {
        return $0._1;
      }
      fail();
    })();
    const $1 = xs[v._1];
    if ($1._2 === "TRUE") {
      return applicativeV2.pure(xs$p);
    }
    if ($1._2 === "true") {
      return applicativeV2.pure(xs$p);
    }
    if ($1._2 === "FALSE") {
      return $Either("Left", [$Issue("Issue", "is--" + domain + " must be TRUE for " + domain + " domain.")]);
    }
    if ($1._2 === "false") {
      return $Either("Left", [$Issue("Issue", "is--" + domain + " must be TRUE for " + domain + " domain.")]);
    }
    return $Either("Left", [$Issue("InvalidValue", $1._2, "not a boolean value")]);
  }
  fail();
};
var getEntitySetsFromHeaders = (lst) => {
  const $0 = traverse((v) => {
    if (v._2 === "TRUE") {
      return applicativeV2.pure($Maybe("Just", v._1));
    }
    if (v._2 === "true") {
      return applicativeV2.pure($Maybe("Just", v._1));
    }
    if (v._2 === "FALSE") {
      return applicativeV2.pure(Nothing);
    }
    if (v._2 === "false") {
      return applicativeV2.pure(Nothing);
    }
    return $Either("Left", [$Issue("InvalidValue", v._2, "not a boolean value")]);
  })(lst);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return applicativeV2.pure(mapMaybe((x) => x)($0._1));
  }
  fail();
};
var entity = (entityId) => (entityDomain) => (entitySets) => (props) => ({ entityId, entityDomain, entitySets, props, _info: Nothing });
var parseEntity = (v) => {
  if (v.entityId === "") {
    return $Either("Left", [$Issue("Issue", "entity MUST have an entity id")]);
  }
  const v1 = splitEntAndProps(v.props);
  const $0 = apply5(apply5(apply5((() => {
    const $02 = parseId(v.entityId);
    if ($02.tag === "Left") {
      return $Either("Left", $02._1);
    }
    if ($02.tag === "Right") {
      return $Either("Right", entity($02._1));
    }
    fail();
  })())(applicativeV2.pure(v.entityDomain)))((() => {
    const $02 = removeIsDomainProp(v.entityDomain)(v1._1);
    const $1 = (() => {
      if ($02.tag === "Left") {
        return $Either("Left", $02._1);
      }
      if ($02.tag === "Right") {
        return getEntitySetsFromHeaders($02._1);
      }
      fail();
    })();
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      if (v.entitySet.tag === "Nothing") {
        return applicativeV2.pure($1._1);
      }
      if (v.entitySet.tag === "Just") {
        return applicativeV2.pure(nubBy(ordId.compare)([v.entitySet._1, ...$1._1]));
      }
    }
    fail();
  })()))(applicativeV2.pure(fromFoldable6(v1._2)));
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return applicativeV2.pure({ ...$0._1, _info: v._info });
  }
  fail();
};

// output-es/Data.HashSet/index.js
var identity17 = (x) => x;
var fromArray2 = (dictHashable) => fromArrayPurs(dictHashable.Eq0().eq, dictHashable.hash)(identity17)((v) => {
});

// output-es/Data.DDF.DataSet/index.js
var applicativeV3 = /* @__PURE__ */ (() => {
  const applyV1 = applyV(semigroupArray);
  return { pure: (x) => $Either("Right", x), Apply0: () => applyV1 };
})();
var fromArrayBy = /* @__PURE__ */ fromArrayPurs(eqStringImpl, hashString);
var identity18 = (x) => x;
var traverse_2 = /* @__PURE__ */ traverse_(applicativeV3);
var traverse_1 = /* @__PURE__ */ traverse_2(foldableArray);
var lookup5 = /* @__PURE__ */ lookup4(hashableString);
var traverse_22 = /* @__PURE__ */ traverse_2(foldableArray);
var for_2 = /* @__PURE__ */ for_(applicativeV3);
var for_1 = /* @__PURE__ */ for_2(foldableArray);
var fromArray3 = /* @__PURE__ */ fromArray2(hashableString);
var compare = /* @__PURE__ */ (() => ordTuple(ordId)(ordString).compare)();
var for_22 = /* @__PURE__ */ for_2(foldableArray);
var sequence3 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeV3)(identity3))();
var fromArray1 = /* @__PURE__ */ fromArrayPurs(eqStringImpl, hashString)(fst)(snd);
var unsafeLookupHM = (dictHashable) => {
  const lookup1 = lookup4(dictHashable);
  return (dictShow) => (k) => (m) => {
    const v = lookup1(k)(m);
    if (v.tag === "Nothing") {
      return _crashWith("error finding key: " + dictShow.show(k));
    }
    if (v.tag === "Just") {
      return v._1;
    }
    fail();
  };
};
var unsafeLookupHM1 = /* @__PURE__ */ unsafeLookupHM(hashableString)(showString);
var parseColumnValues$p = (fp) => (concept2) => (vp) => (vals) => (index4) => traverse_1((v) => {
  const res = vp(v._1);
  if (res.tag === "Right") {
    return applicativeV3.pure();
  }
  return withRowInfo(fp)(v._2)((() => {
    if (res.tag === "Left") {
      return $Either("Left", res._1);
    }
    if (res.tag === "Right") {
      return applicativeV3.pure();
    }
    fail();
  })());
})(values2(fromArrayBy(fst)(identity18)(zipWithImpl(Tuple, vals, index4))));
var parseColumnValues = (vp) => (vals) => (iteminfo) => traverse_1((v) => {
  const res = vp(v._1);
  if (res.tag === "Right") {
    return applicativeV3.pure();
  }
  return withRowInfo(v._2._1)(v._2._2)((() => {
    if (res.tag === "Left") {
      return $Either("Left", res._1);
    }
    if (res.tag === "Right") {
      return applicativeV3.pure();
    }
    fail();
  })());
})(values2(fromArrayBy(fst)(identity18)(zipWithImpl(Tuple, vals, iteminfo))));
var lookupDomain = (concepts) => (x) => {
  const v = lookup5(x)(concepts);
  if (v.tag === "Nothing") {
    return $Either("Left", [$Issue("Issue", "domain " + x + " is not defined in concepts, but there is a entity domain file for it.")]);
  }
  if (v.tag === "Just") {
    if (v._1.conceptType.tag === "EntityDomainC") {
      return applicativeV3.pure();
    }
    return $Either("Left", [$Issue("Issue", "concept " + x + " is not an entity domain in dataset.")]);
  }
  fail();
};
var lookupSetWithInDomain = (concepts) => ($$set) => (domain) => {
  const $0 = lookupDomain(concepts)(domain);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    const v1 = lookup5($$set)(concepts);
    if (v1.tag === "Nothing") {
      return $Either("Left", [$Issue("Issue", "entity set " + $$set + " is not defined in concepts.")]);
    }
    if (v1.tag === "Just") {
      if (v1._1.conceptType.tag === "EntitySetC") {
        const v4 = lookup2(ordId)("domain")(v1._1.props);
        if (v4.tag === "Nothing") {
          return $Either("Left", [$Issue("Issue", "entity set " + $$set + " doesn't belong to any domain.")]);
        }
        if (v4.tag === "Just") {
          if (v4._1 === domain) {
            return applicativeV3.pure();
          }
          return $Either("Left", [$Issue("Issue", "entity set " + $$set + " doesn't belong to " + domain + " domain.")]);
        }
        fail();
      }
      return $Either("Left", [$Issue("Issue", "concept " + $$set + " is not an entity set in dataset.")]);
    }
  }
  fail();
};
var getValueParser = (v) => (k) => {
  const v1 = lookup5(k)(v._valueParsers);
  if (v1.tag === "Just") {
    return applicativeV3.pure(v1._1);
  }
  if (v1.tag === "Nothing") {
    return $Either("Left", [$Issue("Issue", "no such concept in dataset: " + k)]);
  }
  fail();
};
var parseCsvFileValues = (ds) => (v) => {
  const $0 = v.csvContent.index;
  const fp = v.fileInfo.filepath;
  return traverse_22((v1) => {
    const $1 = getValueParser(ds)(v1._1);
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return parseColumnValues$p(fp)(v1._1)($1._1)(v1._2)($0);
    }
    fail();
  })(zipWithImpl(Tuple, arrayMap(unsafeCoerce)(v.csvContent.headers), v.csvContent.columns));
};
var parseDataPoints2 = (v) => (v1) => for_1(snoc(v1.by)(v1.indicatorId))((c) => {
  const $0 = getValueParser(v)(c);
  const $1 = (() => {
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return parseColumnValues($0._1)(unsafeLookup(showId2)(ordId)(c)(v1.values))(v1.itemInfo);
    }
    fail();
  })();
  if ($1.tag === "Left") {
    return $Either(
      "Left",
      (() => {
        const samplefile = v1.itemInfo[0]._1;
        return arrayMap((e) => {
          if (e.tag === "NotImplemented") {
            return NotImplemented;
          }
          return $Issue("InvalidItem", samplefile, 0, showId.show(e));
        })($1._1);
      })()
    );
  }
  if ($1.tag === "Right") {
    return $Either("Right", $1._1);
  }
  fail();
});
var getEntities = (v) => (v1) => (v2) => {
  if (v2.tag === "Nothing") {
    return lookup5(v1)(v.entities);
  }
  if (v2.tag === "Just") {
    const v3 = lookup5(v1)(v.entities);
    if (v3.tag === "Nothing") {
      return Nothing;
    }
    if (v3.tag === "Just") {
      return $Maybe(
        "Just",
        arrayMap(fst)(filterImpl(
          (x) => elem(eqString)(v2._1)(x._2),
          arrayMap((e) => $Tuple(e, arrayMap(value)(e.entitySets)))(v3._1)
        ))
      );
    }
  }
  fail();
};
var getDomainForEntitySet = (dataset) => (k) => {
  const $0 = lookup5(k)(dataset.concepts);
  if ($0.tag === "Just") {
    return lookup2(ordId)("domain")($0._1.props);
  }
  if ($0.tag === "Nothing") {
    return Nothing;
  }
  fail();
};
var makeValueParser = (v) => (k) => {
  const $0 = unsafeLookupHM1(k)(v.concepts);
  if ($0.conceptType.tag === "StringC") {
    return parseStrVal;
  }
  if ($0.conceptType.tag === "MeasureC") {
    return parseNumVal;
  }
  if ($0.conceptType.tag === "BooleanC") {
    return parseBoolVal;
  }
  if ($0.conceptType.tag === "IntervalC") {
    return parseStrVal;
  }
  if ($0.conceptType.tag === "EntityDomainC") {
    return parseDomainVal(k)(fromArray3(arrayMap((x) => x.entityId)((() => {
      const v2 = lookup5(k)(v.entities);
      if (v2.tag === "Nothing") {
        return [];
      }
      if (v2.tag === "Just") {
        return v2._1;
      }
      fail();
    })())));
  }
  if ($0.conceptType.tag === "EntitySetC") {
    const v2 = getDomainForEntitySet(v)(k);
    if (v2.tag === "Nothing") {
      return parseDomainVal(k)(empty2);
    }
    if (v2.tag === "Just") {
      const v3 = getEntities(v)(v2._1)($Maybe("Just", k));
      if (v3.tag === "Nothing") {
        return parseDomainVal(k)(empty2);
      }
      if (v3.tag === "Just") {
        return parseDomainVal(k)(fromArray3(arrayMap((x) => x.entityId)(v3._1)));
      }
    }
    fail();
  }
  if ($0.conceptType.tag === "RoleC") {
    return parseStrVal;
  }
  if ($0.conceptType.tag === "CompositeC") {
    return parseStrVal;
  }
  if ($0.conceptType.tag === "TimeC") {
    return parseTimeVal;
  }
  if ($0.conceptType.tag === "CustomC") {
    return parseStrVal;
  }
  fail();
};
var checkDuplicatedEntities = (input) => {
  const dups = findDups((x) => (y) => compare($Tuple(
    x.entityId,
    (() => {
      if (x._info.tag === "Nothing") {
        return "";
      }
      if (x._info.tag === "Just") {
        return x._info._1._1;
      }
      fail();
    })()
  ))($Tuple(
    y.entityId,
    (() => {
      if (y._info.tag === "Nothing") {
        return "";
      }
      if (y._info.tag === "Just") {
        return y._info._1._1;
      }
      fail();
    })()
  )))(sortBy((x) => (y) => compare($Tuple(
    x.entityId,
    (() => {
      if (x._info.tag === "Nothing") {
        return "";
      }
      if (x._info.tag === "Just") {
        return x._info._1._1;
      }
      fail();
    })()
  ))($Tuple(
    y.entityId,
    (() => {
      if (y._info.tag === "Nothing") {
        return "";
      }
      if (y._info.tag === "Just") {
        return y._info._1._1;
      }
      fail();
    })()
  )))(input));
  if (dups.length === 0) {
    return applicativeV3.pure(input);
  }
  return $Either(
    "Left",
    arrayMap((e) => {
      const $0 = (() => {
        if (e._info.tag === "Nothing") {
          return $ItemInfo("", -1);
        }
        if (e._info.tag === "Just") {
          return e._info._1;
        }
        fail();
      })();
      return $Issue("InvalidItem", $0._1, $0._2, "Multiple definition found: " + e.entityId);
    })(dups)
  );
};
var parseEntityDomains = (conceptdb) => (input) => {
  const $0 = checkDuplicatedEntities(input);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return applicativeV3.pure(fromArrayBy((x) => {
      if (0 < x.length) {
        return x[0].entityDomain;
      }
      fail();
    })(toArray2)(groupAllBy((x) => (y) => ordString.compare(x.entityDomain)(y.entityDomain))($0._1)));
  }
  fail();
};
var checkDuplicatedConcepts = (input) => {
  const dups = findDups((x) => (y) => ordString.compare(x.conceptId)(y.conceptId))(sortBy((x) => (y) => ordString.compare(x.conceptId)(y.conceptId))(input));
  if (dups.length === 0) {
    return applicativeV3.pure(input);
  }
  return $Either(
    "Left",
    arrayMap((c) => {
      const $0 = (() => {
        if (c._info.tag === "Nothing") {
          return $ItemInfo("", -1);
        }
        if (c._info.tag === "Just") {
          return c._info._1;
        }
        fail();
      })();
      return $Issue("InvalidItem", $0._1, $0._2, "Multiple definition found: " + c.conceptId);
    })(dups)
  );
};
var checkDrillup = (concepts) => {
  const $0 = for_22(values2(concepts))((c) => {
    const v = lookup2(ordId)("drill_up")(c.props);
    if (v.tag === "Nothing") {
      return applicativeV3.pure();
    }
    if (v.tag === "Just") {
      const $02 = (() => {
        if (c._info.tag === "Nothing") {
          return $ItemInfo("", -1);
        }
        if (c._info.tag === "Just") {
          return c._info._1;
        }
        fail();
      })();
      const $1 = lookup2(ordId)("domain")(c.props);
      const domain = (() => {
        if ($1.tag === "Just") {
          return $1._1;
        }
        fail();
      })();
      return withRowInfo($02._1)($02._2)((() => {
        const $2 = parseJsonListVal(v._1);
        if ($2.tag === "Left") {
          return $Either("Left", $2._1);
        }
        if ($2.tag === "Right") {
          return traverse_1((x) => lookupSetWithInDomain(concepts)(x)(domain))((() => {
            if ($2._1.tag === "ListVal") {
              return $2._1._1;
            }
            if ($2._1.tag === "JsonListVal") {
              return $2._1._1;
            }
            return [];
          })());
        }
        fail();
      })());
    }
    fail();
  });
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return applicativeV3.pure(concepts);
  }
  fail();
};
var checkDomainAndSetExists = (concepts) => (entities) => {
  const $0 = sequence3(toArrayBy((domain) => (ents) => {
    const $02 = lookupDomain(concepts)(domain);
    if ($02.tag === "Left") {
      return $Either("Left", $02._1);
    }
    if ($02.tag === "Right") {
      return for_22(ents)((e) => {
        const $1 = (() => {
          if (e._info.tag === "Nothing") {
            return "";
          }
          if (e._info.tag === "Just") {
            return e._info._1._1;
          }
          fail();
        })();
        return traverse_1((x) => withRowInfo($1)(0)(lookupSetWithInDomain(concepts)(x)(domain)))(arrayMap(value)(e.entitySets));
      });
    }
    fail();
  })(entities));
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return applicativeV3.pure(entities);
  }
  fail();
};
var checkConceptDomain = (input) => {
  const domainNames = arrayMap((x) => x.conceptId)(filterImpl(isEntityDomain, input));
  const $0 = traverse_1((c) => {
    const v = lookup2(ordId)("domain")(c.props);
    if (v.tag === "Just") {
      const $02 = (() => {
        if (c._info.tag === "Nothing") {
          return $ItemInfo("", -1);
        }
        if (c._info.tag === "Just") {
          return c._info._1;
        }
        fail();
      })();
      const msg = "the domain of the entity set is not a vaild domain: " + v._1;
      if (elem(eqString)(v._1)(domainNames)) {
        return applicativeV3.pure();
      }
      return $Either("Left", [$Issue("InvalidItem", $02._1, $02._2, msg)]);
    }
    if (v.tag === "Nothing") {
      const $02 = (() => {
        if (c._info.tag === "Nothing") {
          return $ItemInfo("", -1);
        }
        if (c._info.tag === "Just") {
          return c._info._1;
        }
        fail();
      })();
      return $Either("Left", [$Issue("InvalidItem", $02._1, $02._2, "the entity must have domain property.")]);
    }
    fail();
  })(filterImpl(isEntitySet, input));
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return applicativeV3.pure(input);
  }
  fail();
};
var parseConcepts = (input) => {
  if (input.length === 0) {
    return $Either("Left", [$Issue("Issue", "Data set must have at least one concept")]);
  }
  const $0 = (() => {
    if (applicativeV3.pure(input).tag === "Left") {
      return $Either("Left", applicativeV3.pure(input)._1);
    }
    if (applicativeV3.pure(input).tag === "Right") {
      return checkDuplicatedConcepts(applicativeV3.pure(input)._1);
    }
    fail();
  })();
  const $1 = (() => {
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return checkConceptDomain($0._1);
    }
    fail();
  })();
  if ($1.tag === "Left") {
    return $Either("Left", $1._1);
  }
  if ($1.tag === "Right") {
    return applicativeV3.pure(fromArrayBy((x) => x.conceptId)(identity18)($1._1));
  }
  fail();
};
var parseBaseDataSet = (conceptsInput) => (entitiesInput) => {
  const $0 = parseConcepts(conceptsInput);
  const $1 = (() => {
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return checkDrillup($0._1);
    }
    fail();
  })();
  const $2 = (() => {
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      const $22 = parseEntityDomains($1._1)(entitiesInput);
      const $3 = (() => {
        if ($22.tag === "Left") {
          return $Either("Left", $22._1);
        }
        if ($22.tag === "Right") {
          return checkDomainAndSetExists($1._1)($22._1);
        }
        fail();
      })();
      if ($3.tag === "Left") {
        return $Either("Left", $3._1);
      }
      if ($3.tag === "Right") {
        return applicativeV3.pure({ concepts: $1._1, entities: $3._1, datapoints: empty2, _valueParsers: empty2 });
      }
    }
    fail();
  })();
  if ($2.tag === "Left") {
    return $Either("Left", $2._1);
  }
  if ($2.tag === "Right") {
    const $3 = $2._1;
    return applicativeV3.pure({
      ...$3,
      _valueParsers: fromArray1(snoc(arrayMap((x) => $Tuple(x, makeValueParser($3)(x)))(keys4($3.concepts)))($Tuple(
        "concept",
        parseDomainVal("concept")(fromArray3(keys4($3.concepts)))
      )))
    });
  }
  fail();
};

// output-es/Data.Validation.Result/index.js
var showMessage = (v) => {
  const statstr = v.isWarning ? "[WARN] " : "[ERR] ";
  const linestr = v.lineNo === -1 ? "" : showIntImpl(v.lineNo) + ":";
  const filestr = v.file === "" ? "" : v.file + ":";
  if (filestr === "" && linestr === "") {
    return statstr + v.message;
  }
  return statstr + filestr + linestr + " " + v.message;
};
var messageFromIssue = (v) => {
  if (v.tag === "InvalidItem") {
    return { message: v._3, file: v._1, lineNo: v._2, isWarning: true };
  }
  return { message: showId.show(v), file: "", lineNo: -1, isWarning: true };
};
var hasError = (msgs) => {
  const v = find((msg) => !msg.isWarning)(msgs);
  if (v.tag === "Nothing") {
    return false;
  }
  if (v.tag === "Just") {
    return true;
  }
  fail();
};

// output-es/Data.Validation.ValidationT/index.js
var vWarning = (dictMonad) => {
  const $0 = monadStateExceptT(monadStateStateT(dictMonad));
  return (dictMonoid) => (e) => $0.state((s) => $Tuple(void 0, dictMonoid.Semigroup0().append(s)(e)));
};
var vError = (dictMonad) => monadThrowExceptT({
  Applicative0: () => applicativeStateT(dictMonad),
  Bind1: () => bindStateT(dictMonad)
}).throwError;
var runValidationT = (dictMonad) => (dictMonoid) => {
  const mempty = dictMonoid.mempty;
  return (v) => dictMonad.Bind1().bind(v(mempty))((v1) => dictMonad.Applicative0().pure((() => {
    if (v1._1.tag === "Left") {
      return $Tuple(dictMonoid.Semigroup0().append(v1._2)(v1._1._1), Nothing);
    }
    if (v1._1.tag === "Right") {
      return $Tuple(v1._2, $Maybe("Just", v1._1._1));
    }
    fail();
  })()));
};
var monadtransVT = {
  lift: (dictMonad) => (x) => bindStateT(dictMonad).bind((s) => dictMonad.Bind1().bind(x)((x$1) => dictMonad.Applicative0().pure($Tuple(x$1, s))))((a) => applicativeStateT(dictMonad).pure($Either(
    "Right",
    a
  )))
};
var monadVT = (dictMonad) => {
  const $0 = { Applicative0: () => applicativeStateT(dictMonad), Bind1: () => bindStateT(dictMonad) };
  return { Applicative0: () => applicativeExceptT($0), Bind1: () => bindExceptT($0) };
};
var getState = (dictMonad) => {
  const $$get = monadStateStateT(dictMonad).state((s) => $Tuple(s, s));
  return (dictMonoid) => bindStateT(dictMonad).bind($$get)((a) => applicativeStateT(dictMonad).pure($Either(
    "Right",
    a
  )));
};

// output-es/App.Validations/index.js
var applicativeV4 = /* @__PURE__ */ (() => {
  const applyV1 = applyV(semigroupArray);
  return { pure: (x) => $Either("Right", x), Apply0: () => applyV1 };
})();
var sequence4 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeV4)(identity3))();
var identity19 = (x) => x;
var emitWarningsAndContinue = (dictMonad) => {
  const vWarning2 = vWarning(dictMonad)(monoidArray);
  return (issues) => bindExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).bind(vWarning2(arrayMap(messageFromIssue)(issues)))(() => applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).pure());
};
var validateCsvFileWithDataSet = (ds) => (csvfile) => (dictMonad) => {
  const $0 = parseCsvFileValues(ds)(csvfile);
  if ($0.tag === "Left") {
    return emitWarningsAndContinue(dictMonad)($0._1);
  }
  if ($0.tag === "Right") {
    return applicativeExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    }).pure();
  }
  fail();
};
var emitErrorsAndStop = (dictMonad) => {
  const vError3 = vError(dictMonad);
  return (issues) => vError3(arrayMap((x) => ({ ...messageFromIssue(x), isWarning: false }))(issues));
};
var validateBaseDataSet = (conceptsInput) => (entitiesInput) => (dictMonad) => {
  const $0 = parseBaseDataSet(conceptsInput)(entitiesInput);
  if ($0.tag === "Right") {
    return applicativeExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    }).pure($0._1);
  }
  if ($0.tag === "Left") {
    return emitErrorsAndStop(dictMonad)($0._1);
  }
  fail();
};
var validateConcepts = (csvfile) => (dictMonad) => {
  const vWarning2 = vWarning(dictMonad)(monoidArray);
  const $0 = applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const $1 = createConceptInput(csvfile);
  if ($1.tag === "Left") {
    return emitErrorsAndStop(dictMonad)($1._1);
  }
  if ($1.tag === "Right") {
    return foldM(monadVT(dictMonad))((acc) => (input) => {
      if (input._info.tag === "Nothing") {
        const $22 = parseConcept(input);
        if ($22.tag === "Left") {
          return bindExceptT({
            Applicative0: () => applicativeStateT(dictMonad),
            Bind1: () => bindStateT(dictMonad)
          }).bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), file: "", isWarning: false, lineNo: -1 }))($22._1)))(() => $0.pure(acc));
        }
        if ($22.tag === "Right") {
          return $0.pure(snoc(acc)($22._1));
        }
        fail();
      }
      if (input._info.tag === "Just") {
        const $22 = parseConcept(input);
        if ($22.tag === "Left") {
          return bindExceptT({
            Applicative0: () => applicativeStateT(dictMonad),
            Bind1: () => bindStateT(dictMonad)
          }).bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), file: input._info._1._1, isWarning: false, lineNo: input._info._1._2 }))($22._1)))(() => $0.pure(acc));
        }
        if ($22.tag === "Right") {
          return $0.pure(snoc(acc)($22._1));
        }
        fail();
      }
      const $2 = parseConcept(input);
      if ($2.tag === "Left") {
        return bindExceptT({
          Applicative0: () => applicativeStateT(dictMonad),
          Bind1: () => bindStateT(dictMonad)
        }).bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), file: fail(), isWarning: false, lineNo: fail() }))($2._1)))(() => $0.pure(acc));
      }
      if ($2.tag === "Right") {
        return $0.pure(snoc(acc)($2._1));
      }
      fail();
    })([])($1._1);
  }
  fail();
};
var validateEntities = (csvfile) => (dictMonad) => {
  const vWarning2 = vWarning(dictMonad)(monoidArray);
  const $0 = applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const $1 = createEntityInput(csvfile);
  if ($1.tag === "Left") {
    return emitErrorsAndStop(dictMonad)($1._1);
  }
  if ($1.tag === "Right") {
    return foldM(monadVT(dictMonad))((acc) => (input) => {
      if (input._info.tag === "Nothing") {
        const $22 = parseEntity(input);
        if ($22.tag === "Left") {
          return bindExceptT({
            Applicative0: () => applicativeStateT(dictMonad),
            Bind1: () => bindStateT(dictMonad)
          }).bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), file: "", isWarning: false, lineNo: -1 }))($22._1)))(() => $0.pure(acc));
        }
        if ($22.tag === "Right") {
          return $0.pure(snoc(acc)($22._1));
        }
        fail();
      }
      if (input._info.tag === "Just") {
        const $22 = parseEntity(input);
        if ($22.tag === "Left") {
          return bindExceptT({
            Applicative0: () => applicativeStateT(dictMonad),
            Bind1: () => bindStateT(dictMonad)
          }).bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), file: input._info._1._1, isWarning: false, lineNo: input._info._1._2 }))($22._1)))(() => $0.pure(acc));
        }
        if ($22.tag === "Right") {
          return $0.pure(snoc(acc)($22._1));
        }
        fail();
      }
      const $2 = parseEntity(input);
      if ($2.tag === "Left") {
        return bindExceptT({
          Applicative0: () => applicativeStateT(dictMonad),
          Bind1: () => bindStateT(dictMonad)
        }).bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), file: fail(), isWarning: false, lineNo: fail() }))($2._1)))(() => $0.pure(acc));
      }
      if ($2.tag === "Right") {
        return $0.pure(snoc(acc)($2._1));
      }
      fail();
    })([])($1._1);
  }
  fail();
};
var emitErrorsAndContinue = (dictMonad) => {
  const vWarning2 = vWarning(dictMonad)(monoidArray);
  return (issues) => bindExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), isWarning: false }))(issues)))(() => applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).pure());
};
var validateDataPoints = (csvfiles) => (dictMonad) => {
  const $0 = applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const $1 = sequence4(arrayMap(createDataPointsInput)(csvfiles));
  const $2 = (() => {
    if ($1.tag === "Left") {
      return $Either("Left", $1._1);
    }
    if ($1.tag === "Right") {
      return mergeDataPointsInput($1._1);
    }
    fail();
  })();
  const v = (() => {
    if ($2.tag === "Left") {
      return $Either("Left", $2._1);
    }
    if ($2.tag === "Right") {
      return parseDataPoints($2._1);
    }
    fail();
  })();
  if (v.tag === "Left") {
    return bindExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    }).bind(emitErrorsAndContinue(dictMonad)(v._1))(() => $0.pure(Nothing));
  }
  if (v.tag === "Right") {
    return $0.pure($Maybe("Just", v._1));
  }
  fail();
};
var validateDataPointsWithDataSet = (ds) => (dps) => (dictMonad) => {
  const $0 = parseDataPoints2(ds)(dps);
  if ($0.tag === "Left") {
    return emitErrorsAndContinue(dictMonad)($0._1);
  }
  if ($0.tag === "Right") {
    return applicativeExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    }).pure();
  }
  fail();
};
var dropAndWarnBadCsvRows = (fp) => (content) => (dictMonad) => {
  const v = filterBadRows(content);
  const $0 = v._2;
  return bindExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).bind(vWarning(dictMonad)(monoidArray)(arrayMap((idx) => ({ ...messageFromIssue($Issue("Issue", "Bad Csv row")), file: fp, lineNo: idx }))(v._1)))(() => applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).pure($0));
};
var validateCsvFile = (v) => (dictMonad) => {
  const bindVT2 = bindExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const $0 = applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const vWarning2 = vWarning(dictMonad)(monoidArray);
  const $1 = v._1;
  const fp = $1.filepath;
  return bindVT2.bind(dropAndWarnBadCsvRows(fp)(v._2)(dictMonad))((rawcsv$p) => {
    const $2 = parseCsvFile({ fileInfo: $1, csvContent: parseCsvContent(rawcsv$p) });
    if ($2.tag === "Right") {
      return $0.pure($Maybe("Just", $2._1));
    }
    if ($2.tag === "Left") {
      return bindVT2.bind(vWarning2(arrayMap((x) => ({ ...messageFromIssue(x), file: fp, isWarning: false }))($2._1)))(() => $0.pure(Nothing));
    }
    fail();
  });
};
var validateCsvFiles = (dictTraversable) => {
  const $0 = dictTraversable.Foldable1().foldr;
  return (xs) => (dictMonad) => {
    const applicativeVT2 = applicativeExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    });
    return bindExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    }).bind(dictTraversable.traverse(applicativeVT2)((x) => validateCsvFile(x)(dictMonad))(xs))((rs) => applicativeVT2.pure(mapMaybe(identity19)(fromFoldableImpl(
      $0,
      rs
    ))));
  };
};

// output-es/Control.Promise/foreign.js
function promise(f) {
  return function() {
    return new Promise(function(success, error3) {
      var succF = function(s) {
        return function() {
          return success(s);
        };
      };
      var failF = function(s) {
        return function() {
          return error3(s);
        };
      };
      try {
        f(succF)(failF)();
      } catch (e) {
        error3(e);
      }
    });
  };
}

// output-es/Control.Promise/index.js
var fromAff = (aff) => promise((succ) => (err) => {
  const $0 = runAff((v2) => {
    if (v2.tag === "Left") {
      return err(v2._1);
    }
    if (v2.tag === "Right") {
      return succ(v2._1);
    }
    fail();
  })(aff);
  return () => {
    $0();
  };
});

// output-es/Effect.Console/foreign.js
var log2 = function(s) {
  return function() {
    console.log(s);
  };
};

// output-es/Main/index.js
var joinWith2 = (splice) => (xs) => foldlArray((v) => (v1) => {
  if (v.init) {
    return { init: false, acc: v1 };
  }
  return { init: false, acc: v.acc + splice + v1 };
})({ init: true, acc: "" })(xs).acc;
var bindVT = /* @__PURE__ */ bindExceptT({
  Applicative0: () => applicativeStateT(monadAff),
  Bind1: () => bindStateT(monadAff)
});
var sequence5 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeAff)(identity3))();
var validateCsvFiles2 = /* @__PURE__ */ validateCsvFiles(traversableArray);
var fromArrayBy2 = /* @__PURE__ */ (() => fromArrayPurs(eqCollectionConstant.eq, hashableCollectionConstant.hash))();
var identity20 = (x) => x;
var lookup6 = /* @__PURE__ */ lookup4(hashableCollectionConstant);
var emitErrorsAndStop2 = /* @__PURE__ */ emitErrorsAndStop(monadAff);
var applicativeVT = /* @__PURE__ */ applicativeExceptT({
  Applicative0: () => applicativeStateT(monadAff),
  Bind1: () => bindStateT(monadAff)
});
var $$for = /* @__PURE__ */ (() => {
  const traverse2 = traversableArray.traverse(applicativeVT);
  return (x) => (f) => traverse2(f)(x);
})();
var getState2 = /* @__PURE__ */ getState(monadAff)(monoidArray);
var vError2 = /* @__PURE__ */ vError(monadAff);
var compare1 = /* @__PURE__ */ (() => ordMaybe(ordTuple(ordString)(ordNonEmpty2(ordString))).compare)();
var traverse_3 = /* @__PURE__ */ traverse_(applicativeVT)(foldableArray);
var runValidationT2 = /* @__PURE__ */ runValidationT(monadAff)(monoidArray);
var write3 = /* @__PURE__ */ (() => {
  const $0 = writeForeignFieldsCons({ reflectSymbol: () => "file" })(writeForeignString)(writeForeignFieldsCons({ reflectSymbol: () => "isWarning" })(writeForeignBoolean)(writeForeignFieldsCons({
    reflectSymbol: () => "lineNo"
  })(writeForeignInt)(writeForeignFieldsCons({ reflectSymbol: () => "message" })(writeForeignString)(writeForeignFieldsNilRowR)()()())()()())()()())()()();
  return (xs) => arrayMap((rec) => $0.writeImplFields($$Proxy)(rec)({}))(xs);
})();
var validateDatapointsFileGroup = (indicator) => (pkeys) => (ds) => (csvfiles) => (dictMonad) => {
  if (csvfiles.length > 0) {
    return bindExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    }).bind(validateDataPoints(csvfiles)(dictMonad))((dps) => {
      if (dps.tag === "Nothing") {
        return applicativeExceptT({
          Applicative0: () => applicativeStateT(dictMonad),
          Bind1: () => bindStateT(dictMonad)
        }).pure();
      }
      if (dps.tag === "Just") {
        return validateDataPointsWithDataSet(ds)(dps._1)(dictMonad);
      }
      fail();
    });
  }
  return vWarning(dictMonad)(monoidArray)([
    messageFromIssue($Issue(
      "Issue",
      "No valid csv file for " + indicator + " by " + joinWith2(",")(fromFoldableImpl(foldableNonEmptyList.foldr, pkeys))
    ))
  ]);
};
var readAndParseCsvFiles = (files) => bindVT.bind(monadtransVT.lift(monadAff)(sequence5(arrayMap(readCsv$p)(files))))((csvRows) => validateCsvFiles2(zipWithImpl(
  Tuple,
  files,
  arrayMap(createRawContent)(csvRows)
))(monadAff));
var readAllFileInfoForValidation = (root) => (fs) => (dictMonad) => {
  const applicativeVT1 = applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const ddfFiles = mapMaybe((x) => x)(arrayMap((f) => {
    const $0 = validateFileInfo(root)(f);
    if ($0.tag === "Left") {
      return Nothing;
    }
    if ($0.tag === "Right") {
      return $Maybe("Just", $0._1);
    }
    fail();
  })(fs));
  return bindExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).bind(0 < ddfFiles.length ? applicativeVT1.pure() : vError(dictMonad)([
    {
      ...messageFromIssue($Issue("Issue", "No csv files in this folder. Please begin with a ddf--concepts.csv file.")),
      isWarning: false
    }
  ]))(() => applicativeVT1.pure(ddfFiles));
};
var validate = (path2) => bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("reading file list..."))))(() => bindVT.bind(monadtransVT.lift(monadAff)(getFiles(path2)([
  ".git",
  "etl",
  "assets",
  "langsplit"
])))((fs) => bindVT.bind(readAllFileInfoForValidation(path2)(fs)(monadAff))((ddfFiles) => bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("validating concepts and entities..."))))(() => {
  const fileMap = fromArrayBy2((x) => getCollectionType((() => {
    if (0 < x.length) {
      return x[0].collectionInfo;
    }
    fail();
  })()))(identity20)(groupAllBy((x) => (y) => ordCollectionConstant.compare(getCollectionType(x.collectionInfo))(getCollectionType(y.collectionInfo)))(ddfFiles));
  return bindVT.bind((() => {
    const v = lookup6(CONCEPTS)(fileMap);
    if (v.tag === "Nothing") {
      return emitErrorsAndStop2([$Issue("Issue", "No concepts file in folder. Please add ddf--concepts.csv")]);
    }
    if (v.tag === "Just") {
      return applicativeVT.pure(v._1);
    }
    fail();
  })())((conceptFileInfos) => bindVT.bind(readAndParseCsvFiles(conceptFileInfos))((conceptCsvFiles) => bindVT.bind($$for(conceptCsvFiles)((x) => validateConcepts(x)(monadAff)))((concepts) => bindVT.bind((() => {
    const v = lookup6(ENTITIES)(fileMap);
    if (v.tag === "Nothing") {
      return applicativeVT.pure([]);
    }
    if (v.tag === "Just") {
      return applicativeVT.pure(v._1);
    }
    fail();
  })())((entityFileInfos) => bindVT.bind(readAndParseCsvFiles(entityFileInfos))((entityCsvFiles) => bindVT.bind($$for(entityCsvFiles)((x) => validateEntities(x)(monadAff)))((entities) => bindVT.bind(validateBaseDataSet(concat(concepts))(concat(entities))(monadAff))((ds) => bindVT.bind(getState2)((msgs) => bindVT.bind((() => {
    const $0 = bindVT.bind(vError2([
      { ...messageFromIssue($Issue("Issue", "Validation stopped because of errors.")), isWarning: false }
    ]))(() => applicativeVT.pure());
    if (hasError(msgs)) {
      return $0;
    }
    return applicativeVT.pure();
  })())(() => bindVT.bind((() => {
    const v = lookup6(DATAPOINTS)(fileMap);
    if (v.tag === "Nothing") {
      return applicativeVT.pure([]);
    }
    if (v.tag === "Just") {
      const $0 = v._1;
      return bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("validating datapoints..."))))(() => applicativeVT.pure($0));
    }
    fail();
  })())((datapointFiles) => bindVT.bind($$for(groupAllBy((x) => (y) => compare1(x.collectionInfo.tag === "DataPoints" ? $Maybe("Just", $Tuple(x.collectionInfo._1.indicator, x.collectionInfo._1.pkeys)) : Nothing)(y.collectionInfo.tag === "DataPoints" ? $Maybe("Just", $Tuple(y.collectionInfo._1.indicator, y.collectionInfo._1.pkeys)) : Nothing))(datapointFiles))((group3) => {
    const $0 = (() => {
      if (0 < group3.length) {
        return group3[0];
      }
      fail();
    })();
    if ($0.collectionInfo.tag === "DataPoints") {
      const $1 = $0.collectionInfo._1.indicator;
      const $2 = $0.collectionInfo._1.pkeys;
      return bindVT.bind(readAndParseCsvFiles(group3))((dpscsvFiles) => validateDatapointsFileGroup($1)($2)(ds)(dpscsvFiles)(monadAff));
    }
    fail();
  }))(() => bindVT.bind((() => {
    const v = lookup6(SYNONYMS)(fileMap);
    if (v.tag === "Nothing") {
      return applicativeVT.pure([]);
    }
    if (v.tag === "Just") {
      const $0 = v._1;
      return bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("validating synonym files..."))))(() => applicativeVT.pure($0));
    }
    fail();
  })())((synonymFileInfos) => bindVT.bind(readAndParseCsvFiles(synonymFileInfos))((synonymCsvFiles) => bindVT.bind(traverse_3((c) => validateCsvFileWithDataSet(ds)(c)(monadAff))(synonymCsvFiles))(() => bindVT.bind((() => {
    const v = lookup6(TRANSLATIONS)(fileMap);
    if (v.tag === "Nothing") {
      return applicativeVT.pure([]);
    }
    if (v.tag === "Just") {
      const $0 = v._1;
      return bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("validating translation files..."))))(() => applicativeVT.pure($0));
    }
    fail();
  })())((translationFileInfos) => bindVT.bind(readAndParseCsvFiles(translationFileInfos))((translationCsvFiles) => bindVT.bind(traverse_3((c) => validateCsvFileWithDataSet(ds)(c)(monadAff))(translationCsvFiles))(() => applicativeVT.pure(fileMap))))))))))))))))));
}))));
var runMain = (opts2) => {
  const path2 = opts2.targetPath;
  const noWarning = opts2.noWarning;
  const $0 = _makeFiber(
    ffiUtil,
    _bind(_liftEffect(log2("v0.1.0")))(() => _bind(runValidationT2(validate(path2)))((v) => {
      const $02 = v._2;
      const $1 = v._1;
      return _bind(_liftEffect(log2(joinWith("\n")(arrayMap(showMessage)(noWarning ? filterImpl((x) => !x.isWarning, $1) : $1)))))(() => _bind((() => {
        if ($02.tag === "Just") {
          if (hasError($1)) {
            return _liftEffect(log2("\u274C Dataset is invalid"));
          }
          return _liftEffect(log2("\u2705 Dataset is valid"));
        }
        if ($02.tag === "Nothing") {
          return _liftEffect(log2("\u274C Dataset is invalid"));
        }
        fail();
      })())(() => {
        const $2 = _liftEffect(() => setExitCodeImpl(1));
        if (hasError($1)) {
          return $2;
        }
        return _pure();
      }));
    }))
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
};
var validate$p = (fp) => fromAff(_bind(runValidationT2(validate(fp)))((v) => _pure(write3(v._1))));
var main = () => {
  const a$p = getArgs();
  const $0 = handleParseResult(execParserPure(defaultPrefs)(opts)(a$p))();
  return runMain($0)();
};
export {
  applicativeVT,
  bindVT,
  compare1,
  emitErrorsAndStop2 as emitErrorsAndStop,
  $$for as for,
  fromArrayBy2 as fromArrayBy,
  getState2 as getState,
  identity20 as identity,
  joinWith2 as joinWith,
  lookup6 as lookup,
  main,
  readAllFileInfoForValidation,
  readAndParseCsvFiles,
  runMain,
  runValidationT2 as runValidationT,
  sequence5 as sequence,
  traverse_3 as traverse_,
  vError2 as vError,
  validate,
  validate$p,
  validateCsvFiles2 as validateCsvFiles,
  validateDatapointsFileGroup,
  write3 as write
};
