// output-es/runtime.js
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

// output-es/Data.Function/index.js
var $$const = (a) => (v) => a;

// output-es/Type.Proxy/index.js
var $$$Proxy = () => ({ tag: "Proxy" });
var $$Proxy = /* @__PURE__ */ $$$Proxy();

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

// output-es/Control.Apply/index.js
var identity = (x) => x;

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

// output-es/Data.Ordering/index.js
var $Ordering = (tag) => tag;
var LT = /* @__PURE__ */ $Ordering("LT");
var GT = /* @__PURE__ */ $Ordering("GT");
var EQ = /* @__PURE__ */ $Ordering("EQ");

// output-es/Data.Maybe/index.js
var $Maybe = (tag, _1) => ({ tag, _1 });
var Nothing = /* @__PURE__ */ $Maybe("Nothing");
var Just = (value0) => $Maybe("Just", value0);
var isNothing = (v2) => {
  if (v2.tag === "Nothing") {
    return true;
  }
  if (v2.tag === "Just") {
    return false;
  }
  fail();
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

// output-es/Control.Monad.State.Trans/index.js
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
var traverse_ = (dictApplicative) => {
  const $0 = dictApplicative.Apply0();
  return (dictFoldable) => (f) => dictFoldable.foldr((x) => {
    const $1 = f(x);
    return (b) => $0.apply($0.Functor0().map((v) => identity)($1))(b);
  })(dictApplicative.pure());
};
var for_ = (dictApplicative) => {
  const traverse_1 = traverse_(dictApplicative);
  return (dictFoldable) => {
    const $0 = traverse_1(dictFoldable);
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

// output-es/Data.Ord/index.js
var ordString = { compare: /* @__PURE__ */ ordStringImpl(LT)(EQ)(GT), Eq0: () => eqString };
var ordInt = { compare: /* @__PURE__ */ ordIntImpl(LT)(EQ)(GT), Eq0: () => eqInt };

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
  return function(apply4) {
    return function(map2) {
      return function(pure) {
        return function(f) {
          return function(array) {
            function go(bot, top) {
              switch (top - bot) {
                case 0:
                  return pure([]);
                case 1:
                  return map2(array1)(f(array[bot]));
                case 2:
                  return apply4(map2(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply4(apply4(map2(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top - bot) / 4) * 2;
                  return apply4(map2(concat22)(go(bot, pivot)))(go(pivot, top));
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
var identity2 = (x) => x;
var traversableArray = {
  traverse: (dictApplicative) => {
    const Apply0 = dictApplicative.Apply0();
    return traverseArrayImpl(Apply0.apply)(Apply0.Functor0().map)(dictApplicative.pure);
  },
  sequence: (dictApplicative) => traversableArray.traverse(dictApplicative)(identity2),
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
  return function(foldr, xs) {
    return listToArray(foldr(curryCons)(emptyList)(xs));
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

// output-es/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
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

// output-es/Node.Encoding/index.js
var $Encoding = (tag) => tag;
var UTF8 = /* @__PURE__ */ $Encoding("UTF8");

// output-es/Data.Nullable/foreign.js
function nullable(a, r, f) {
  return a == null ? r : f(a);
}

// output-es/Data.EuclideanRing/foreign.js
var intMod = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
  };
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

// output-es/Data.Int/foreign.js
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

// output-es/Node.FS.Constants/foreign.js
import { constants } from "node:fs";
var f_OK = constants.F_OK;
var r_OK = constants.R_OK;
var w_OK = constants.W_OK;
var x_OK = constants.X_OK;
var copyFile_EXCL = constants.COPYFILE_EXCL;
var copyFile_FICLONE = constants.COPYFILE_FICLONE;
var copyFile_FICLONE_FORCE = constants.COPYFILE_FICLONE_FORCE;

// output-es/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

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

// output-es/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}

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
var drop = function(n) {
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
var charAt2 = /* @__PURE__ */ _charAt(Just)(Nothing);

// output-es/Data.String.Common/foreign.js
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

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
    return $Maybe("Just", { head: (((cu0 - 55296 | 0) * 1024 | 0) + (cu1 - 56320 | 0) | 0) + 65536 | 0, tail: drop(2)(s) });
  }
  return $Maybe("Just", { head: cu0, tail: drop(1)(s) });
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
  return { before, after: drop(length2(before))(s) };
};

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
  link,
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
var normalize_options = function(opts) {
  const options = {};
  for (const opt in opts) {
    options[underscore(opt)] = opts[opt];
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
        throw new Error(`Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`);
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
        throw new Error(`Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`);
      }
    } else {
      throw new Error(`Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`);
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
  if (options.trim === true && opts.ltrim !== false) {
    options.ltrim = true;
  } else if (options.ltrim !== true) {
    options.ltrim = false;
  }
  if (options.trim === true && opts.rtrim !== false) {
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
        throw new Error(`Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`);
      }
    } else {
      throw new Error(`Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`);
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
        throw new Error(`Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`);
      }
    } else {
      throw new Error(`Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`);
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
  constructor(opts = {}) {
    super({ ...{ readableObjectMode: true }, ...opts, encoding: null });
    this.api = transform({ on_skip: (err, chunk) => {
      this.emit("skip", err, chunk);
    }, ...opts });
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
    const argument = arguments[i];
    const type = typeof argument;
    if (data === void 0 && (typeof argument === "string" || Buffer.isBuffer(argument))) {
      data = argument;
    } else if (options === void 0 && is_object(argument)) {
      options = argument;
    } else if (callback === void 0 && type === "function") {
      callback = argument;
    } else {
      throw new CsvError("CSV_INVALID_ARGUMENT", [
        "Invalid argument:",
        `got ${JSON.stringify(argument)} at index ${i}`
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
var readCsv$p = (x) => readCsv(x._1);
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

// output-es/Data.Semigroup/foreign.js
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
var semigroupArray = { append: concatArray };

// output-es/Data.Monoid/index.js
var monoidArray = { mempty: [], Semigroup0: () => semigroupArray };

// output-es/Data.List/index.js
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

// output-es/Data.List.NonEmpty/index.js
var zipWith3 = (f) => (v) => (v1) => $NonEmpty(f(v._1)(v1._1), zipWith2(f)(v._2)(v1._2));

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
    return $Either("Right", { result: v1._1, suffix: { substring: drop(1)(v.substring), position: v.position + 1 | 0 } });
  }
  if (v1.tag === "Nothing") {
    return $Either("Left", { pos: v.position, error: "Unexpected EOF" });
  }
  fail();
};

// output-es/StringParser.CodePoints/index.js
var elem2 = /* @__PURE__ */ (() => {
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
    if (elem2(toCharCode(v12.result))(rangeImpl(65, 90))) {
      return $Either("Right", { result: v12.result, suffix: v12.suffix });
    }
    return $Either("Left", { pos: v12.suffix.position, error: "Expected an upper case character but found " + showCharImpl(v12.result) });
  });
  if (v1.tag === "Left") {
    return $Either("Left", { pos: s.position, error: v1._1.error });
  }
  return v1;
};
var string = (pattern) => (v) => {
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
    if (elem2(toCharCode(v12.result))(rangeImpl(97, 122))) {
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
var lookup = (dictOrd) => (k) => {
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
var keys = /* @__PURE__ */ (() => {
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
var fromFoldable = (dictOrd) => (dictFoldable) => dictFoldable.foldl((m) => (v) => insert(dictOrd)(v._1)(v._2)(m))(Leaf2);
var fromFoldableWith = (dictOrd) => (dictFoldable) => (f) => {
  const f$p = insertWith(dictOrd)((b) => (a) => f(a)(b));
  return dictFoldable.foldl((m) => (v) => f$p(v._1)(v._2)(m))(Leaf2);
};
var $$delete = (dictOrd) => (k) => {
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
var elem3 = /* @__PURE__ */ (() => {
  const any1 = foldableArray.foldMap((() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })());
  return (x) => any1(($0) => x === $0);
})();
var apply = /* @__PURE__ */ (() => applyV(semigroupArray).apply)();
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
  if (elem3(conceptId)(arrayMap(value)(reservedConcepts))) {
    return $Either("Left", [$Issue("Issue", conceptId + " can not be use as concept Id")]);
  }
  return $Either("Right", conceptId);
};
var isEntitySet = (v) => v.conceptType.tag === "EntitySetC";
var isEntityDomain = (v) => v.conceptType.tag === "EntityDomainC";
var hasFieldAndGetValue = (field) => (input) => {
  const v = lookup(ordId)(field === "" ? "undefined_id" : field)(input);
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
  const $0 = apply(apply((() => {
    const $02 = notReserved(input.conceptId);
    const $12 = (() => {
      if ($02.tag === "Left") {
        return $Either("Left", $02._1);
      }
      if ($02.tag === "Right") {
        return parseId($02._1);
      }
      fail();
    })();
    if ($12.tag === "Left") {
      return $Either("Left", $12._1);
    }
    if ($12.tag === "Right") {
      return $Either("Right", concept($12._1));
    }
    fail();
  })())(parseConceptType(input.conceptType)))($Either(
    "Right",
    mapKeysWith(ordId)((x) => (y) => x)(unsafeCoerce)(input.props)
  ));
  const $1 = (() => {
    if ($0.tag === "Left") {
      return $Either("Left", $0._1);
    }
    if ($0.tag === "Right") {
      return checkMandatoryField($0._1);
    }
    fail();
  })();
  if ($1.tag === "Left") {
    return $Either("Left", $1._1);
  }
  if ($1.tag === "Right") {
    return $Either("Right", { ...$1._1, _info: input._info });
  }
  fail();
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
  return function(apply4, map2, f) {
    var buildFrom = function(x, ys) {
      return apply4(map2(consList)(f(x)))(ys);
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

// output-es/Data.Show.Generic/foreign.js
var intercalate = function(separator) {
  return function(xs) {
    return xs.join(separator);
  };
};

// output-es/Data.Show.Generic/index.js
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

// output-es/Data.DDF.Atoms.Header/index.js
var unsafeCreate2 = (x) => {
  if (x === "") {
    return "undefined_id";
  }
  return x;
};
var is_header = (s) => {
  const $0 = string("is--")(s);
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

// output-es/Data.Set/index.js
var foldableSet = {
  foldMap: (dictMonoid) => {
    const foldMap1 = foldableList.foldMap(dictMonoid);
    return (f) => {
      const $0 = foldMap1(f);
      return (x) => $0(keys(x));
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
    return (x$1) => $0(keys(x$1));
  },
  foldr: (f) => (x) => {
    const $0 = foldableList.foldr(f)(x);
    return (x$1) => $0(keys(x$1));
  }
};
var map = (dictOrd) => (f) => foldableSet.foldl((m) => (a) => insert(dictOrd)(f(a))()(m))(Leaf2);

// output-es/Data.String.NonEmpty.Internal/index.js
var toString = (v) => v;
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

// output-es/Data.String.Utils/foreign.js
function startsWithImpl(searchString, s) {
  return s.startsWith(searchString);
}

// output-es/Foreign/foreign.js
var isArray = Array.isArray || function(value2) {
  return Object.prototype.toString.call(value2) === "[object Array]";
};

// output-es/Node.FS.Stats/foreign.js
var isDirectoryImpl = (s) => s.isDirectory();
var isFileImpl = (s) => s.isFile();

// output-es/Node.Path/foreign.js
import path from "path";
var normalize = path.normalize;
function concat3(segments) {
  return path.join.apply(this, segments);
}
var basename = path.basename;
var extname = path.extname;
var sep = path.sep;
var delimiter = path.delimiter;
var parse3 = path.parse;
var isAbsolute = path.isAbsolute;

// output-es/Utils/index.js
var unsafeLookup = (dictShow) => (dictOrd) => (k) => (m) => {
  const v = lookup(dictOrd)(k)(m);
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
    return _pure([f, ...acc]);
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
var fromFoldable1 = /* @__PURE__ */ foldrArray(Cons)(Nil);
var fromFoldable3 = /* @__PURE__ */ fromFoldable(ordHeader)(foldableArray);
var sequence = /* @__PURE__ */ (() => traversableArray.traverse(applicativeV)(identity2))();
var show2 = /* @__PURE__ */ (() => showArrayImpl(showNonEmptyString.show))();
var fromFoldable4 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordString)(a)()(m))(Leaf2);
var fromFoldable7 = /* @__PURE__ */ fromFoldable(ordString)(foldableNonEmptyList);
var fromFoldable8 = /* @__PURE__ */ fromFoldable(ordString)(foldableArray);
var elem4 = /* @__PURE__ */ (() => {
  const any1 = foldableNonEmptyList.foldMap((() => {
    const semigroupDisj1 = { append: (v) => (v1) => v || v1 };
    return { mempty: false, Semigroup0: () => semigroupDisj1 };
  })());
  return (x) => any1(($0) => x === $0);
})();
var apply2 = /* @__PURE__ */ (() => applyV(semigroupArray).apply)();
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
    return $Either("Left", [$Issue("InvalidCSV", "Empty Csv")]);
  }
  return $Either("Left", [$Issue("InvalidCSV", "Empty Csv")]);
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
    listMap(snd)(findDupsL((x) => (y) => ordString.compare(x._1)(y._1))(fromFoldable1(sort1(zipWithImpl(
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
  const columnMap = fromFoldable3(zipWithImpl(Tuple, v.headers, v.columns));
  const dups = findDupsForColumns([header])(columnMap);
  if (dups.length === 0) {
    return applicativeV.pure(v);
  }
  const fp = fileInfo._1;
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
  const columnMap = fromFoldable3(zipWithImpl(Tuple, v.headers, v.columns));
  const dups = findDupsForColumns(keyHeaders)(columnMap);
  if (dups.length === 0) {
    return applicativeV.pure(v);
  }
  const fp = fileInfo._1;
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
  const $0 = sequence(arrayMap(parseGeneralHeader)(input.headers));
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
  const $0 = sequence(arrayMap(parseEntityHeader)(input.headers));
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
    zipWith2(checkOneColumn)(values(fromFoldable7(zipWith3(Tuple)($0)(v.constrains))))(values(filterKeys(ordString)((k) => elem4(k)($0))(fromFoldable8(zipWithImpl(
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
  if (v.fileInfo._2.tag === "Concepts") {
    return apply2((() => {
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
          return headersExists(["concept", "concept_type"])($2._1);
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
  if (v.fileInfo._2.tag === "Entities") {
    return apply2((() => {
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
        if (v.fileInfo._2._1.set.tag === "Just") {
          return [v.fileInfo._2._1.set._1, v.fileInfo._2._1.domain];
        }
        if (v.fileInfo._2._1.set.tag === "Nothing") {
          return [v.fileInfo._2._1.domain];
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
  if (v.fileInfo._2.tag === "DataPoints") {
    const keysArr = fromFoldable11($NonEmpty(
      v.fileInfo._2._1.pkeys._1,
      listMap(toString)(v.fileInfo._2._1.pkeys._2)
    ));
    return apply2((() => {
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
      const $3 = headersExists([v.fileInfo._2._1.indicator, ...keysArr]);
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
          return constrainsAreMet(v.fileInfo._1)(v.fileInfo._2._1)($4._1);
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
  return $Either("Left", [NotImplemented]);
};

// output-es/Data.DDF.Csv.FileInfo/index.js
var $CollectionInfo = (tag, _1) => ({ tag, _1 });
var $FileInfo = (_1, _2, _3) => ({ tag: "FileInfo", _1, _2, _3 });
var choice = /* @__PURE__ */ (() => foldlArray(altParser.alt)((v) => $Either("Left", { pos: v.position, error: "Nothing to parse" })))();
var Concepts = /* @__PURE__ */ $CollectionInfo("Concepts");
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
    const $1 = string("-")(v1.suffix);
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
var eqCollection = {
  eq: (v) => (v1) => {
    if (v.tag === "Concepts") {
      return v1.tag === "Concepts";
    }
    if (v.tag === "Entities") {
      return v1.tag === "Entities";
    }
    if (v.tag === "DataPoints") {
      return v1.tag === "DataPoints";
    }
    return v.tag === "Other" && v1.tag === "Other" && v._1 === v1._1;
  }
};
var ordCollection = {
  compare: (v) => (v1) => {
    if (v.tag === "Concepts") {
      if (v1.tag === "Concepts") {
        return EQ;
      }
      return GT;
    }
    if (v.tag === "Entities") {
      if (v1.tag === "Concepts") {
        return LT;
      }
      if (v1.tag === "Entities") {
        return EQ;
      }
      return GT;
    }
    if (v.tag === "DataPoints") {
      if (v1.tag === "DataPoints") {
        return EQ;
      }
      if (v1.tag === "Concepts") {
        return LT;
      }
      if (v1.tag === "Entities") {
        return LT;
      }
      return GT;
    }
    if (v.tag === "Other") {
      if (v1.tag === "Other") {
        return ordString.compare(v._1)(v1._1);
      }
      return LT;
    }
    fail();
  },
  Eq0: () => eqCollection
};
var ddfFileBegin = (x) => {
  const $0 = string("ddf--")(x);
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
    const $1 = string("entities--")(v1.suffix);
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
    const $1 = string("entities--")(v1.suffix);
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
        const $4 = string("--")(v1$2.suffix);
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
    const $1 = string("datapoints--")(v1.suffix);
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
        const $4 = string("--by--")(v1$2.suffix);
        if ($4.tag === "Left") {
          return $Either("Left", $4._1);
        }
        if ($4.tag === "Right") {
          const $5 = sepBy1(pkey)(string("--"))($4._1.suffix);
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
          })()((v1$3) => $Either(
            "Right",
            {
              result: $CollectionInfo(
                "DataPoints",
                {
                  indicator: v1$2.result,
                  pkeys: $NonEmpty(v1$3.result._1._1, listMap(fst)(v1$3.result._2)),
                  constrains: $NonEmpty(v1$3.result._1._2, listMap(snd)(v1$3.result._2))
                }
              ),
              suffix: v1$3.suffix
            }
          ));
        }
        fail();
      });
    });
  });
};
var c2 = (s) => {
  const $0 = string("ddf--concepts--")(s);
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
    const v2 = string("discrete")(v1.suffix);
    const $2 = (() => {
      if (v2.tag === "Left") {
        if (v1.suffix.position === v2._1.pos) {
          return string("continuous")(v1.suffix);
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
  const $0 = string("ddf--concepts")(x);
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
var validateFileInfo = (fp) => {
  const v = stripSuffix(".csv")(basename(fp));
  if (v.tag === "Nothing") {
    return $Either("Left", [$Issue("InvalidCSV", "not a csv file")]);
  }
  if (v.tag === "Just") {
    const $0 = { substring: v._1, position: 0 };
    const v1 = (() => {
      const v2 = conceptFile($0);
      const $1 = (() => {
        if (v2.tag === "Left") {
          if ($0.position === v2._1.pos) {
            const v2$1 = entityFile($0);
            if (v2$1.tag === "Left") {
              if ($0.position === v2$1._1.pos) {
                return datapointFile($0);
              }
              return $Either("Left", { error: v2$1._1.error, pos: v2$1._1.pos });
            }
            return v2$1;
          }
          return $Either("Left", { error: v2._1.error, pos: v2._1.pos });
        }
        return v2;
      })();
      if ($1.tag === "Left") {
        return $Either("Left", $1._1);
      }
      if ($1.tag === "Right") {
        return $Either("Right", $1._1.result);
      }
      fail();
    })();
    if (v1.tag === "Right") {
      return $Either("Right", $FileInfo(fp, v1._1, v._1));
    }
    if (v1.tag === "Left") {
      return $Either("Left", [$Issue("InvalidCSV", "error parsing file: " + v1._1.error)]);
    }
  }
  fail();
};

// output-es/Data.DDF.Csv.Utils/index.js
var fromFoldable2 = /* @__PURE__ */ fromFoldable(ordHeader)(foldableArray);
var pop2 = /* @__PURE__ */ pop(ordHeader);
var fromFoldable12 = /* @__PURE__ */ fromFoldable(ordId)(foldableArray);
var fromFoldable112 = /* @__PURE__ */ (() => {
  const $0 = foldable1NonEmptyList.Foldable0().foldr;
  return (x) => fromFoldableImpl($0, x);
})();
var createEntityInput = (v) => {
  if (v.fileInfo._2.tag === "Entities") {
    const $0 = v.fileInfo._2._1.domain;
    const $1 = v.fileInfo._2._1.set;
    const $2 = v.csvContent.headers;
    const fp = v.fileInfo._1;
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
        const $3 = pop2(entityCol)(fromFoldable2(zipWithImpl(Tuple, $2, v2._2)));
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
  return $Either(
    "Left",
    [
      $Issue(
        "Issue",
        "can not create entity input for file: " + v.fileInfo._1 + "; collection: " + showCollection.show(v.fileInfo._2)
      )
    ]
  );
};
var createDataPointsInput = (v) => {
  if (v.fileInfo._2.tag === "DataPoints") {
    const fp = v.fileInfo._1;
    return $Either(
      "Right",
      {
        indicatorId: v.fileInfo._2._1.indicator,
        by: fromFoldable112($NonEmpty(v.fileInfo._2._1.pkeys._1, listMap(unsafeCoerce)(v.fileInfo._2._1.pkeys._2))),
        itemInfo: arrayMap((x) => $ItemInfo(fp, x))(v.csvContent.index),
        values: fromFoldable12(zipWithImpl(Tuple, arrayMap(unsafeCoerce)(v.csvContent.headers), v.csvContent.columns))
      }
    );
  }
  return $Either(
    "Left",
    [
      $Issue(
        "Issue",
        "can not create datapoint input for file: " + v.fileInfo._1 + "; collection: " + showCollection.show(v.fileInfo._2)
      )
    ]
  );
};
var createConceptInput = (v) => {
  const rows = zipWithImpl(Tuple, v.csvContent.index, transpose(v.csvContent.columns));
  const headers_ = arrayMap(unsafeCoerce)(v.csvContent.headers);
  if (v.fileInfo._2.tag === "Concepts") {
    return $Either(
      "Right",
      foldrArray((v2) => (acc) => {
        const rowMap = fromFoldable2(zipWithImpl(Tuple, headers_, v2._2));
        return snoc(acc)({
          conceptId: unsafeLookup(showHeader)(ordHeader)("concept")(rowMap),
          conceptType: unsafeLookup(showHeader)(ordHeader)("concept_type")(rowMap),
          props: $$delete(ordHeader)("concept_type")($$delete(ordHeader)("concept")(rowMap)),
          _info: $Maybe("Just", $ItemInfo(v.fileInfo._1, v2._1))
        });
      })([])(rows)
    );
  }
  return $Either(
    "Left",
    [
      $Issue(
        "Issue",
        "can not create concept input for file: " + v.fileInfo._1 + "; collection: " + showCollection.show(v.fileInfo._2)
      )
    ]
  );
};

// output-es/Data.Array.NonEmpty/index.js
var toArray2 = (v) => v;
var uncons2 = (x) => {
  const $0 = unconsImpl((v) => Nothing, (x$1) => (xs) => $Maybe("Just", { head: x$1, tail: xs }), x);
  if ($0.tag === "Just") {
    return $0._1;
  }
  fail();
};

// output-es/Data.Map/index.js
var keys2 = /* @__PURE__ */ (() => functorMap.map((v) => {
}))();

// output-es/Data.DDF.DataPoint/index.js
var eq12 = /* @__PURE__ */ (() => eqArrayImpl(eqId.eq))();
var fromFoldable32 = /* @__PURE__ */ foldlArray((m) => (a) => insert(ordId)(a)()(m))(Leaf2);
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
  const v = uncons2(inputs);
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
  const $0 = headersMatchesData(fromFoldable32(snoc(v.by)(v.indicatorId)))(keys2(v.values));
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
MapNode.prototype.lookup = function lookup2(Nothing2, Just2, keyEquals, key, keyHash, shift) {
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
        return empty;
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
MapNode.prototype.itraverse = function(pure, apply4, f) {
  var m = pure(this.travHelper());
  for (var i = 0; i < popCount(this.datamap) * 2; ) {
    var k = this.content[i++];
    var v = this.content[i++];
    m = apply4(m)(f(k)(v));
  }
  for (; i < this.content.length; i++)
    m = apply4(m)(this.content[i].itraverse(pure, apply4, f));
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
Collision.prototype.itraverse = function(pure, apply4, f) {
  var m = pure(this.travHelper());
  for (var i = 0; i < this.keys.length; i++)
    m = apply4(m)(f(this.keys[i])(this.values[i]));
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
    return empty;
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
    return empty;
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
var empty = new MapNode(0, 0, []);
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
var lookup3 = (dictHashable) => {
  const eq = dictHashable.Eq0().eq;
  return (k) => lookupPurs(Nothing, Just, eq, k, dictHashable.hash(k));
};
var member = (dictHashable) => {
  const lookup1 = lookup3(dictHashable);
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
var keys3 = /* @__PURE__ */ toArrayBy($$const);

// output-es/Data.DDF.Atoms.Value/index.js
var $Value = (tag, _1) => ({ tag, _1 });
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
var fromFoldable5 = /* @__PURE__ */ fromFoldable(ordId)(foldableArray);
var apply3 = /* @__PURE__ */ (() => applyV(semigroupArray).apply)();
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
        const $0 = drop(length2(take2(4)(v1._1)))(v1._1);
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
  const $0 = apply3(apply3(apply3((() => {
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
  })()))(applicativeV2.pure(fromFoldable5(v1._2)));
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return applicativeV2.pure({ ...$0._1, _info: v._info });
  }
  fail();
};

// output-es/Data.HashSet/index.js
var identity9 = (x) => x;
var fromArray2 = (dictHashable) => fromArrayPurs(dictHashable.Eq0().eq, dictHashable.hash)(identity9)((v) => {
});

// output-es/Data.DDF.DataSet/index.js
var applicativeV3 = /* @__PURE__ */ (() => {
  const applyV1 = applyV(semigroupArray);
  return { pure: (x) => $Either("Right", x), Apply0: () => applyV1 };
})();
var fromArrayBy = /* @__PURE__ */ fromArrayPurs(eqStringImpl, hashString);
var identity10 = (x) => x;
var traverse_2 = /* @__PURE__ */ traverse_(applicativeV3)(foldableArray);
var lookup4 = /* @__PURE__ */ lookup3(hashableString);
var for_2 = /* @__PURE__ */ for_(applicativeV3)(foldableArray);
var fromArray3 = /* @__PURE__ */ fromArray2(hashableString);
var compare = /* @__PURE__ */ (() => ordTuple(ordId)(ordString).compare)();
var fromArray1 = /* @__PURE__ */ fromArrayPurs(eqStringImpl, hashString)(fst)(snd);
var unsafeLookupHM = (dictHashable) => {
  const lookup1 = lookup3(dictHashable);
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
var parseColumnValues = (vp) => (vals) => (iteminfo) => traverse_2((v) => {
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
})(values2(fromArrayBy(fst)(identity10)(zipWithImpl(Tuple, vals, iteminfo))));
var getValueParser = (v) => (k) => {
  const v1 = lookup4(k)(v._valueParsers);
  if (v1.tag === "Just") {
    return applicativeV3.pure(v1._1);
  }
  if (v1.tag === "Nothing") {
    return $Either("Left", [$Issue("Issue", "no such concept in dataset: " + k)]);
  }
  fail();
};
var parseDataPoints2 = (v) => (v1) => for_2(snoc(v1.by)(v1.indicatorId))((c) => {
  const $0 = getValueParser(v)(c);
  if ($0.tag === "Left") {
    return $Either("Left", $0._1);
  }
  if ($0.tag === "Right") {
    return parseColumnValues($0._1)(unsafeLookup(showId2)(ordId)(c)(v1.values))(v1.itemInfo);
  }
  fail();
});
var getEntities = (v) => (v1) => (v2) => {
  if (v2.tag === "Nothing") {
    return lookup4(v1)(v.entities);
  }
  if (v2.tag === "Just") {
    const v3 = lookup4(v1)(v.entities);
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
  const $0 = lookup4(k)(dataset.concepts);
  if ($0.tag === "Just") {
    return lookup(ordId)("domain")($0._1.props);
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
      const v2 = lookup4(k)(v.entities);
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
      return parseDomainVal(k)(empty);
    }
    if (v2.tag === "Just") {
      const v3 = getEntities(v)(v2._1)($Maybe("Just", k));
      if (v3.tag === "Nothing") {
        return parseDomainVal(k)(empty);
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
var checkConceptDomain = (input) => {
  const domainNames = arrayMap((x) => x.conceptId)(filterImpl(isEntityDomain, input));
  const $0 = traverse_2((c) => {
    const v = lookup(ordId)("domain")(c.props);
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
    return applicativeV3.pure(fromArrayBy((x) => x.conceptId)(identity10)($1._1));
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
      const $12 = parseEntityDomains($0._1)(entitiesInput);
      const $2 = (() => {
        if ($12.tag === "Left") {
          return $Either("Left", $12._1);
        }
        if ($12.tag === "Right") {
          return applicativeV3.pure($12._1);
        }
        fail();
      })();
      if ($2.tag === "Left") {
        return $Either("Left", $2._1);
      }
      if ($2.tag === "Right") {
        return applicativeV3.pure({ concepts: $0._1, entities: $2._1, datapoints: empty, _valueParsers: empty });
      }
    }
    fail();
  })();
  if ($1.tag === "Left") {
    return $Either("Left", $1._1);
  }
  if ($1.tag === "Right") {
    const $2 = $1._1;
    return applicativeV3.pure({ ...$2, _valueParsers: fromArray1(arrayMap((x) => $Tuple(x, makeValueParser($2)(x)))(keys3($2.concepts))) });
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

// output-es/App.Validations/index.js
var applicativeV4 = /* @__PURE__ */ (() => {
  const applyV1 = applyV(semigroupArray);
  return { pure: (x) => $Either("Right", x), Apply0: () => applyV1 };
})();
var sequence2 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeV4)(identity2))();
var identity11 = (x) => x;
var emitErrorsAndStop = (dictMonad) => {
  const vError2 = vError(dictMonad);
  return (issues) => vError2(arrayMap((x) => ({ ...messageFromIssue(x), isWarning: false }))(issues));
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
  const vWarning3 = vWarning(dictMonad)(monoidArray);
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
          }).bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), file: "", isWarning: false, lineNo: -1 }))($22._1)))(() => $0.pure(acc));
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
          }).bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), file: input._info._1._1, isWarning: false, lineNo: input._info._1._2 }))($22._1)))(() => $0.pure(acc));
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
        }).bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), file: fail(), isWarning: false, lineNo: fail() }))($2._1)))(() => $0.pure(acc));
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
  const vWarning3 = vWarning(dictMonad)(monoidArray);
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
          }).bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), file: "", isWarning: false, lineNo: -1 }))($22._1)))(() => $0.pure(acc));
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
          }).bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), file: input._info._1._1, isWarning: false, lineNo: input._info._1._2 }))($22._1)))(() => $0.pure(acc));
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
        }).bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), file: fail(), isWarning: false, lineNo: fail() }))($2._1)))(() => $0.pure(acc));
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
  const vWarning3 = vWarning(dictMonad)(monoidArray);
  return (issues) => bindExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), isWarning: false }))(issues)))(() => applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  }).pure());
};
var validateDataPoints = (csvfiles) => (dictMonad) => {
  const $0 = applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const $1 = sequence2(arrayMap(createDataPointsInput)(csvfiles));
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
  const vWarning3 = vWarning(dictMonad)(monoidArray);
  const $1 = v._1;
  const fp = $1._1;
  return bindVT2.bind(dropAndWarnBadCsvRows(fp)(v._2)(dictMonad))((rawcsv$p) => {
    const $2 = parseCsvFile({ fileInfo: $1, csvContent: parseCsvContent(rawcsv$p) });
    if ($2.tag === "Right") {
      return $0.pure($Maybe("Just", $2._1));
    }
    if ($2.tag === "Left") {
      return bindVT2.bind(vWarning3(arrayMap((x) => ({ ...messageFromIssue(x), file: fp, isWarning: false }))($2._1)))(() => $0.pure(Nothing));
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
    }).bind(dictTraversable.traverse(applicativeVT2)((x) => validateCsvFile(x)(dictMonad))(xs))((rs) => applicativeVT2.pure(mapMaybe(identity11)(fromFoldableImpl(
      $0,
      rs
    ))));
  };
};
var checkNonEmptyArray = (name2) => (xs) => (dictMonad) => {
  if (xs.length > 0) {
    return applicativeExceptT({
      Applicative0: () => applicativeStateT(dictMonad),
      Bind1: () => bindStateT(dictMonad)
    }).pure(xs);
  }
  return vError(dictMonad)([
    messageFromIssue($Issue("Issue", "expect " + name2 + " has at least one item"))
  ]);
};

// output-es/Effect.Console/foreign.js
var log2 = function(s) {
  return function() {
    console.log(s);
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
var keys4 = Object.keys || toArrayWithKey(function(k) {
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

// output-es/Main/index.js
var bindVT = /* @__PURE__ */ bindExceptT({
  Applicative0: () => applicativeStateT(monadAff),
  Bind1: () => bindStateT(monadAff)
});
var sequence3 = /* @__PURE__ */ (() => traversableArray.traverse(applicativeAff)(identity2))();
var validateCsvFiles2 = /* @__PURE__ */ validateCsvFiles(traversableArray);
var applicativeVT = /* @__PURE__ */ applicativeExceptT({
  Applicative0: () => applicativeStateT(monadAff),
  Bind1: () => bindStateT(monadAff)
});
var for1 = /* @__PURE__ */ (() => {
  const traverse2 = traversableArray.traverse(applicativeVT);
  return (x) => (f) => traverse2(f)(x);
})();
var compare1 = /* @__PURE__ */ (() => ordMaybe(ordTuple(ordString)(ordNonEmpty2(ordString))).compare)();
var for2 = /* @__PURE__ */ (() => {
  const traverse2 = traversableArray.traverse(applicativeVT);
  return (x) => (f) => traverse2(f)(x);
})();
var vWarning2 = /* @__PURE__ */ vWarning(monadAff)(monoidArray);
var joinWith2 = (splice) => (xs) => foldlArray((v) => (v1) => {
  if (v.init) {
    return { init: false, acc: v1 };
  }
  return { init: false, acc: v.acc + splice + v1 };
})({ init: true, acc: "" })(xs).acc;
var runValidationT2 = /* @__PURE__ */ runValidationT(monadAff)(monoidArray);
var readAllFileInfoForValidation = (fs) => (dictMonad) => {
  const applicativeVT1 = applicativeExceptT({
    Applicative0: () => applicativeStateT(dictMonad),
    Bind1: () => bindStateT(dictMonad)
  });
  const ddfFiles = mapMaybe((x) => x)(arrayMap((f) => {
    const $0 = validateFileInfo(f);
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
  "lang",
  "assets"
])))((fs) => bindVT.bind(readAllFileInfoForValidation(fs)(monadAff))((ddfFiles) => bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("validating concepts and entities..."))))(() => {
  const fileGroups = groupAllBy((x) => (y) => ordCollection.compare(x._2)(y._2))(ddfFiles);
  return bindVT.bind(checkNonEmptyArray("concept csvs")(filterImpl(
    (x) => {
      if (0 < x.length) {
        return x[0]._2.tag === "Concepts";
      }
      fail();
    },
    fileGroups
  ))(monadAff))((conceptFiles_) => {
    const $0 = (() => {
      if (0 < conceptFiles_.length) {
        return conceptFiles_[0];
      }
      fail();
    })();
    return bindVT.bind(monadtransVT.lift(monadAff)(sequence3(arrayMap(readCsv$p)($0))))((conceptCsvRows) => bindVT.bind(validateCsvFiles2(zipWithImpl(
      Tuple,
      $0,
      arrayMap(createRawContent)(conceptCsvRows)
    ))(monadAff))((conceptCsvFiles) => bindVT.bind(for1(conceptCsvFiles)((x) => validateConcepts(x)(monadAff)))((concepts) => {
      const entityFiles = arrayBind(filterImpl(
        (x) => {
          if (0 < x.length) {
            return x[0]._2.tag === "Entities";
          }
          fail();
        },
        fileGroups
      ))(toArray2);
      return bindVT.bind(monadtransVT.lift(monadAff)(sequence3(arrayMap(readCsv$p)(entityFiles))))((entityCsvRows) => bindVT.bind(validateCsvFiles2(zipWithImpl(
        Tuple,
        entityFiles,
        arrayMap(createRawContent)(entityCsvRows)
      ))(monadAff))((entityCsvFiles) => bindVT.bind(for1(entityCsvFiles)((x) => validateEntities(x)(monadAff)))((entities) => bindVT.bind(validateBaseDataSet(concat(concepts))(concat(entities))(monadAff))((ds) => {
        const datapointFileGroups = groupAllBy((x) => (y) => compare1(x._2.tag === "DataPoints" ? $Maybe("Just", $Tuple(x._2._1.indicator, x._2._1.pkeys)) : Nothing)(y._2.tag === "DataPoints" ? $Maybe("Just", $Tuple(y._2._1.indicator, y._2._1.pkeys)) : Nothing))(arrayBind(filterImpl(
          (x) => {
            if (0 < x.length) {
              return x[0]._2.tag === "DataPoints";
            }
            fail();
          },
          fileGroups
        ))(toArray2));
        return bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("validating datapoints..."))))(() => bindVT.bind(for1(datapointFileGroups)((group3) => {
          const $1 = (() => {
            if (0 < group3.length) {
              return group3[0];
            }
            fail();
          })();
          const $2 = $1._2.tag === "DataPoints" ? $Maybe("Just", $Tuple($1._2._1.indicator, $1._2._1.pkeys)) : Nothing;
          const v = (() => {
            if ($2.tag === "Just") {
              return $2._1;
            }
            fail();
          })();
          const $3 = v._1;
          const $4 = v._2;
          return bindVT.bind(monadtransVT.lift(monadAff)(_liftEffect(log2("indicator: " + showStringImpl($3) + ", by: " + joinWith(", ")(fromFoldableImpl(
            foldableNonEmptyList.foldr,
            $NonEmpty($4._1, listMap(toString)($4._2))
          )) + ", total files: " + showIntImpl(group3.length)))))(() => bindVT.bind(for2(group3)((f) => bindVT.bind(monadtransVT.lift(monadAff)(readCsv(f._1)))((csvrows) => bindVT.bind(validateCsvFile($Tuple(
            f,
            createRawContent(csvrows)
          ))(monadAff))((dpcsvfile) => applicativeVT.pure(dpcsvfile)))))((dpsCsvFiles) => bindVT.bind((() => {
            const $5 = mapMaybe((x) => x)(dpsCsvFiles);
            if ($5.length > 0) {
              return bindVT.bind(validateDataPoints($5)(monadAff))((dps) => {
                if (dps.tag === "Nothing") {
                  return applicativeVT.pure();
                }
                if (dps.tag === "Just") {
                  return validateDataPointsWithDataSet(ds)(dps._1)(monadAff);
                }
                fail();
              });
            }
            return vWarning2([
              messageFromIssue($Issue(
                "Issue",
                "No valid csv file for " + $3 + " by " + joinWith2(",")(fromFoldableImpl(foldableNonEmptyList.foldr, $4))
              ))
            ]);
          })())(() => applicativeVT.pure())));
        }))(() => applicativeVT.pure(ds.concepts)));
      }))));
    })));
  });
}))));
var runMain = (path2) => {
  const $0 = _makeFiber(
    ffiUtil,
    _bind(_liftEffect(log2("v0.0.8")))(() => _bind(runValidationT2(validate(path2)))((v) => {
      const $02 = v._2;
      const $1 = v._1;
      return _bind(_liftEffect(log2(joinWith("\n")(arrayMap(showMessage)($1)))))(() => {
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
      });
    }))
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
};
var main = () => {
  const path2 = argv();
  if (2 < path2.length) {
    return runMain(path2[2])();
  }
  return runMain("./")();
};
export {
  applicativeVT,
  bindVT,
  compare1,
  for1,
  for2,
  joinWith2 as joinWith,
  main,
  readAllFileInfoForValidation,
  runMain,
  runValidationT2 as runValidationT,
  sequence3 as sequence,
  vWarning2 as vWarning,
  validate,
  validateCsvFiles2 as validateCsvFiles
};
