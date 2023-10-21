const At = new Error("request for lock canceled");
var xt = function(r, e, t, s) {
  function n(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function u(a) {
      try {
        l(s.next(a));
      } catch (c) {
        o(c);
      }
    }
    function h(a) {
      try {
        l(s.throw(a));
      } catch (c) {
        o(c);
      }
    }
    function l(a) {
      a.done ? i(a.value) : n(a.value).then(u, h);
    }
    l((s = s.apply(r, e || [])).next());
  });
};
class It {
  constructor(e, t = At) {
    this._value = e, this._cancelError = t, this._weightedQueues = [], this._weightedWaiters = [];
  }
  acquire(e = 1) {
    if (e <= 0)
      throw new Error(`invalid weight ${e}: must be positive`);
    return new Promise((t, s) => {
      this._weightedQueues[e - 1] || (this._weightedQueues[e - 1] = []), this._weightedQueues[e - 1].push({ resolve: t, reject: s }), this._dispatch();
    });
  }
  runExclusive(e, t = 1) {
    return xt(this, void 0, void 0, function* () {
      const [s, n] = yield this.acquire(t);
      try {
        return yield e(s);
      } finally {
        n();
      }
    });
  }
  waitForUnlock(e = 1) {
    if (e <= 0)
      throw new Error(`invalid weight ${e}: must be positive`);
    return new Promise((t) => {
      this._weightedWaiters[e - 1] || (this._weightedWaiters[e - 1] = []), this._weightedWaiters[e - 1].push(t), this._dispatch();
    });
  }
  isLocked() {
    return this._value <= 0;
  }
  getValue() {
    return this._value;
  }
  setValue(e) {
    this._value = e, this._dispatch();
  }
  release(e = 1) {
    if (e <= 0)
      throw new Error(`invalid weight ${e}: must be positive`);
    this._value += e, this._dispatch();
  }
  cancel() {
    this._weightedQueues.forEach((e) => e.forEach((t) => t.reject(this._cancelError))), this._weightedQueues = [];
  }
  _dispatch() {
    var e;
    for (let t = this._value; t > 0; t--) {
      const s = (e = this._weightedQueues[t - 1]) === null || e === void 0 ? void 0 : e.shift();
      if (!s)
        continue;
      const n = this._value, i = t;
      this._value -= t, t = this._value + 1, s.resolve([n, this._newReleaser(i)]);
    }
    this._drainUnlockWaiters();
  }
  _newReleaser(e) {
    let t = !1;
    return () => {
      t || (t = !0, this.release(e));
    };
  }
  _drainUnlockWaiters() {
    for (let e = this._value; e > 0; e--)
      this._weightedWaiters[e - 1] && (this._weightedWaiters[e - 1].forEach((t) => t()), this._weightedWaiters[e - 1] = []);
  }
}
var Ot = function(r, e, t, s) {
  function n(i) {
    return i instanceof t ? i : new t(function(o) {
      o(i);
    });
  }
  return new (t || (t = Promise))(function(i, o) {
    function u(a) {
      try {
        l(s.next(a));
      } catch (c) {
        o(c);
      }
    }
    function h(a) {
      try {
        l(s.throw(a));
      } catch (c) {
        o(c);
      }
    }
    function l(a) {
      a.done ? i(a.value) : n(a.value).then(u, h);
    }
    l((s = s.apply(r, e || [])).next());
  });
};
class kt {
  constructor(e) {
    this._semaphore = new It(1, e);
  }
  acquire() {
    return Ot(this, void 0, void 0, function* () {
      const [, e] = yield this._semaphore.acquire();
      return e;
    });
  }
  runExclusive(e) {
    return this._semaphore.runExclusive(() => e());
  }
  isLocked() {
    return this._semaphore.isLocked();
  }
  waitForUnlock() {
    return this._semaphore.waitForUnlock();
  }
  release() {
    this._semaphore.isLocked() && this._semaphore.release();
  }
  cancel() {
    return this._semaphore.cancel();
  }
}
const Ce = {}, Lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ce
}, Symbol.toStringTag, { value: "Module" }));
var H = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Dt(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Ae(r) {
  if (r.__esModule)
    return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function s() {
      return this instanceof s ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(s) {
    var n = Object.getOwnPropertyDescriptor(r, s);
    Object.defineProperty(t, s, n.get ? n : {
      enumerable: !0,
      get: function() {
        return r[s];
      }
    });
  }), t;
}
var he = { exports: {} };
const E = /* @__PURE__ */ Ae(Lt);
var ot = { exports: {} }, q = {}, xe = {};
xe.parse = function(r, e) {
  return new Ie(r, e).parse();
};
class Ie {
  constructor(e, t) {
    this.source = e, this.transform = t || Bt, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
  }
  isEof() {
    return this.position >= this.source.length;
  }
  nextCharacter() {
    var e = this.source[this.position++];
    return e === "\\" ? {
      value: this.source[this.position++],
      escaped: !0
    } : {
      value: e,
      escaped: !1
    };
  }
  record(e) {
    this.recorded.push(e);
  }
  newEntry(e) {
    var t;
    (this.recorded.length > 0 || e) && (t = this.recorded.join(""), t === "NULL" && !e && (t = null), t !== null && (t = this.transform(t)), this.entries.push(t), this.recorded = []);
  }
  consumeDimensions() {
    if (this.source[0] === "[")
      for (; !this.isEof(); ) {
        var e = this.nextCharacter();
        if (e.value === "=")
          break;
      }
  }
  parse(e) {
    var t, s, n;
    for (this.consumeDimensions(); !this.isEof(); )
      if (t = this.nextCharacter(), t.value === "{" && !n)
        this.dimension++, this.dimension > 1 && (s = new Ie(this.source.substr(this.position - 1), this.transform), this.entries.push(s.parse(!0)), this.position += s.position - 2);
      else if (t.value === "}" && !n) {
        if (this.dimension--, !this.dimension && (this.newEntry(), e))
          return this.entries;
      } else
        t.value === '"' && !t.escaped ? (n && this.newEntry(!0), n = !n) : t.value === "," && !n ? this.newEntry() : this.record(t.value);
    if (this.dimension !== 0)
      throw new Error("array dimension not balanced");
    return this.entries;
  }
}
function Bt(r) {
  return r;
}
var Qt = xe, ut = {
  create: function(r, e) {
    return {
      parse: function() {
        return Qt.parse(r, e);
      }
    };
  }
}, qt = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, Ft = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, Nt = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, $t = /^-?infinity$/, jt = function(e) {
  if ($t.test(e))
    return Number(e.replace("i", "I"));
  var t = qt.exec(e);
  if (!t)
    return Ut(e) || null;
  var s = !!t[8], n = parseInt(t[1], 10);
  s && (n = ct(n));
  var i = parseInt(t[2], 10) - 1, o = t[3], u = parseInt(t[4], 10), h = parseInt(t[5], 10), l = parseInt(t[6], 10), a = t[7];
  a = a ? 1e3 * parseFloat(a) : 0;
  var c, f = Gt(e);
  return f != null ? (c = new Date(Date.UTC(n, i, o, u, h, l, a)), Pe(n) && c.setUTCFullYear(n), f !== 0 && c.setTime(c.getTime() - f)) : (c = new Date(n, i, o, u, h, l, a), Pe(n) && c.setFullYear(n)), c;
};
function Ut(r) {
  var e = Ft.exec(r);
  if (e) {
    var t = parseInt(e[1], 10), s = !!e[4];
    s && (t = ct(t));
    var n = parseInt(e[2], 10) - 1, i = e[3], o = new Date(t, n, i);
    return Pe(t) && o.setFullYear(t), o;
  }
}
function Gt(r) {
  if (r.endsWith("+00"))
    return 0;
  var e = Nt.exec(r.split(" ")[1]);
  if (e) {
    var t = e[1];
    if (t === "Z")
      return 0;
    var s = t === "-" ? -1 : 1, n = parseInt(e[2], 10) * 3600 + parseInt(e[3] || 0, 10) * 60 + parseInt(e[4] || 0, 10);
    return n * s * 1e3;
  }
}
function ct(r) {
  return -(r - 1);
}
function Pe(r) {
  return r >= 0 && r < 100;
}
var Wt = Kt, Ht = Object.prototype.hasOwnProperty;
function Kt(r) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e];
    for (var s in t)
      Ht.call(t, s) && (r[s] = t[s]);
  }
  return r;
}
var Vt = Wt, zt = U;
function U(r) {
  if (!(this instanceof U))
    return new U(r);
  Vt(this, or(r));
}
var Yt = ["seconds", "minutes", "hours", "days", "months", "years"];
U.prototype.toPostgres = function() {
  var r = Yt.filter(this.hasOwnProperty, this);
  return this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"), r.length === 0 ? "0" : r.map(function(e) {
    var t = this[e] || 0;
    return e === "seconds" && this.milliseconds && (t = (t + this.milliseconds / 1e3).toFixed(6).replace(/\.?0+$/, "")), t + " " + e;
  }, this).join(" ");
};
var Jt = {
  years: "Y",
  months: "M",
  days: "D",
  hours: "H",
  minutes: "M",
  seconds: "S"
}, Zt = ["years", "months", "days"], Xt = ["hours", "minutes", "seconds"];
U.prototype.toISOString = U.prototype.toISO = function() {
  var r = Zt.map(t, this).join(""), e = Xt.map(t, this).join("");
  return "P" + r + "T" + e;
  function t(s) {
    var n = this[s] || 0;
    return s === "seconds" && this.milliseconds && (n = (n + this.milliseconds / 1e3).toFixed(6).replace(/0+$/, "")), n + Jt[s];
  }
};
var Oe = "([+-]?\\d+)", er = Oe + "\\s+years?", tr = Oe + "\\s+mons?", rr = Oe + "\\s+days?", sr = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?", nr = new RegExp([er, tr, rr, sr].map(function(r) {
  return "(" + r + ")?";
}).join("\\s*")), qe = {
  years: 2,
  months: 4,
  days: 6,
  hours: 9,
  minutes: 10,
  seconds: 11,
  milliseconds: 12
}, ir = ["hours", "minutes", "seconds", "milliseconds"];
function ar(r) {
  var e = r + "000000".slice(r.length);
  return parseInt(e, 10) / 1e3;
}
function or(r) {
  if (!r)
    return {};
  var e = nr.exec(r), t = e[8] === "-";
  return Object.keys(qe).reduce(function(s, n) {
    var i = qe[n], o = e[i];
    return !o || (o = n === "milliseconds" ? ar(o) : parseInt(o, 10), !o) || (t && ~ir.indexOf(n) && (o *= -1), s[n] = o), s;
  }, {});
}
var ur = function(e) {
  if (/^\\x/.test(e))
    return new Buffer(e.substr(2), "hex");
  for (var t = "", s = 0; s < e.length; )
    if (e[s] !== "\\")
      t += e[s], ++s;
    else if (/[0-7]{3}/.test(e.substr(s + 1, 3)))
      t += String.fromCharCode(parseInt(e.substr(s + 1, 3), 8)), s += 4;
    else {
      for (var n = 1; s + n < e.length && e[s + n] === "\\"; )
        n++;
      for (var i = 0; i < Math.floor(n / 2); ++i)
        t += "\\";
      s += Math.floor(n / 2) * 2;
    }
  return new Buffer(t, "binary");
}, V = xe, z = ut, Z = jt, ht = zt, lt = ur;
function ee(r) {
  return function(t) {
    return t === null ? t : r(t);
  };
}
function ft(r) {
  return r === null ? r : r === "TRUE" || r === "t" || r === "true" || r === "y" || r === "yes" || r === "on" || r === "1";
}
function cr(r) {
  return r ? V.parse(r, ft) : null;
}
function hr(r) {
  return parseInt(r, 10);
}
function le(r) {
  return r ? V.parse(r, ee(hr)) : null;
}
function lr(r) {
  return r ? V.parse(r, ee(function(e) {
    return dt(e).trim();
  })) : null;
}
var fr = function(r) {
  if (!r)
    return null;
  var e = z.create(r, function(t) {
    return t !== null && (t = ke(t)), t;
  });
  return e.parse();
}, fe = function(r) {
  if (!r)
    return null;
  var e = z.create(r, function(t) {
    return t !== null && (t = parseFloat(t)), t;
  });
  return e.parse();
}, k = function(r) {
  if (!r)
    return null;
  var e = z.create(r);
  return e.parse();
}, de = function(r) {
  if (!r)
    return null;
  var e = z.create(r, function(t) {
    return t !== null && (t = Z(t)), t;
  });
  return e.parse();
}, dr = function(r) {
  if (!r)
    return null;
  var e = z.create(r, function(t) {
    return t !== null && (t = ht(t)), t;
  });
  return e.parse();
}, pr = function(r) {
  return r ? V.parse(r, ee(lt)) : null;
}, pe = function(r) {
  return parseInt(r, 10);
}, dt = function(r) {
  var e = String(r);
  return /^\d+$/.test(e) ? e : r;
}, Fe = function(r) {
  return r ? V.parse(r, ee(JSON.parse)) : null;
}, ke = function(r) {
  return r[0] !== "(" ? null : (r = r.substring(1, r.length - 1).split(","), {
    x: parseFloat(r[0]),
    y: parseFloat(r[1])
  });
}, mr = function(r) {
  if (r[0] !== "<" && r[1] !== "(")
    return null;
  for (var e = "(", t = "", s = !1, n = 2; n < r.length - 1; n++) {
    if (s || (e += r[n]), r[n] === ")") {
      s = !0;
      continue;
    } else if (!s)
      continue;
    r[n] !== "," && (t += r[n]);
  }
  var i = ke(e);
  return i.radius = parseFloat(t), i;
}, yr = function(r) {
  r(20, dt), r(21, pe), r(23, pe), r(26, pe), r(700, parseFloat), r(701, parseFloat), r(16, ft), r(1082, Z), r(1114, Z), r(1184, Z), r(600, ke), r(651, k), r(718, mr), r(1e3, cr), r(1001, pr), r(1005, le), r(1007, le), r(1028, le), r(1016, lr), r(1017, fr), r(1021, fe), r(1022, fe), r(1231, fe), r(1014, k), r(1015, k), r(1008, k), r(1009, k), r(1040, k), r(1041, k), r(1115, de), r(1182, de), r(1185, de), r(1186, ht), r(1187, dr), r(17, lt), r(114, JSON.parse.bind(JSON)), r(3802, JSON.parse.bind(JSON)), r(199, Fe), r(3807, Fe), r(3907, k), r(2951, k), r(791, k), r(1183, k), r(1270, k);
}, vr = {
  init: yr
}, O = 1e6;
function _r(r) {
  var e = r.readInt32BE(0), t = r.readUInt32BE(4), s = "";
  e < 0 && (e = ~e + (t === 0), t = ~t + 1 >>> 0, s = "-");
  var n = "", i, o, u, h, l, a;
  {
    if (i = e % O, e = e / O >>> 0, o = 4294967296 * i + t, t = o / O >>> 0, u = "" + (o - O * t), t === 0 && e === 0)
      return s + u + n;
    for (h = "", l = 6 - u.length, a = 0; a < l; a++)
      h += "0";
    n = h + u + n;
  }
  {
    if (i = e % O, e = e / O >>> 0, o = 4294967296 * i + t, t = o / O >>> 0, u = "" + (o - O * t), t === 0 && e === 0)
      return s + u + n;
    for (h = "", l = 6 - u.length, a = 0; a < l; a++)
      h += "0";
    n = h + u + n;
  }
  {
    if (i = e % O, e = e / O >>> 0, o = 4294967296 * i + t, t = o / O >>> 0, u = "" + (o - O * t), t === 0 && e === 0)
      return s + u + n;
    for (h = "", l = 6 - u.length, a = 0; a < l; a++)
      h += "0";
    n = h + u + n;
  }
  return i = e % O, o = 4294967296 * i + t, u = "" + o % O, s + u + n;
}
var wr = _r, gr = wr, g = function(r, e, t, s, n) {
  t = t || 0, s = s || !1, n = n || function(d, m, y) {
    return d * Math.pow(2, y) + m;
  };
  var i = t >> 3, o = function(d) {
    return s ? ~d & 255 : d;
  }, u = 255, h = 8 - t % 8;
  e < h && (u = 255 << 8 - e & 255, h = e), t && (u = u >> t % 8);
  var l = 0;
  t % 8 + e >= 8 && (l = n(0, o(r[i]) & u, h));
  for (var a = e + t >> 3, c = i + 1; c < a; c++)
    l = n(l, o(r[c]), 8);
  var f = (e + t) % 8;
  return f > 0 && (l = n(l, o(r[a]) >> 8 - f, f)), l;
}, pt = function(r, e, t) {
  var s = Math.pow(2, t - 1) - 1, n = g(r, 1), i = g(r, t, 1);
  if (i === 0)
    return 0;
  var o = 1, u = function(l, a, c) {
    l === 0 && (l = 1);
    for (var f = 1; f <= c; f++)
      o /= 2, (a & 1 << c - f) > 0 && (l += o);
    return l;
  }, h = g(r, e, t + 1, !1, u);
  return i == Math.pow(2, t + 1) - 1 ? h === 0 ? n === 0 ? 1 / 0 : -1 / 0 : NaN : (n === 0 ? 1 : -1) * Math.pow(2, i - s) * h;
}, br = function(r) {
  return g(r, 1) == 1 ? -1 * (g(r, 15, 1, !0) + 1) : g(r, 15, 1);
}, Ne = function(r) {
  return g(r, 1) == 1 ? -1 * (g(r, 31, 1, !0) + 1) : g(r, 31, 1);
}, Sr = function(r) {
  return pt(r, 23, 8);
}, Er = function(r) {
  return pt(r, 52, 11);
}, Cr = function(r) {
  var e = g(r, 16, 32);
  if (e == 49152)
    return NaN;
  for (var t = Math.pow(1e4, g(r, 16, 16)), s = 0, n = g(r, 16), i = 0; i < n; i++)
    s += g(r, 16, 64 + 16 * i) * t, t /= 1e4;
  var o = Math.pow(10, g(r, 16, 48));
  return (e === 0 ? 1 : -1) * Math.round(s * o) / o;
}, $e = function(r, e) {
  var t = g(e, 1), s = g(e, 63, 1), n = new Date((t === 0 ? 1 : -1) * s / 1e3 + 9466848e5);
  return r || n.setTime(n.getTime() + n.getTimezoneOffset() * 6e4), n.usec = s % 1e3, n.getMicroSeconds = function() {
    return this.usec;
  }, n.setMicroSeconds = function(i) {
    this.usec = i;
  }, n.getUTCMicroSeconds = function() {
    return this.usec;
  }, n;
}, W = function(r) {
  var e = g(r, 32);
  g(r, 32, 32);
  for (var t = g(r, 32, 64), s = 96, n = [], i = 0; i < e; i++)
    n[i] = g(r, 32, s), s += 32, s += 32;
  var o = function(h) {
    var l = g(r, 32, s);
    if (s += 32, l == 4294967295)
      return null;
    var a;
    if (h == 23 || h == 20)
      return a = g(r, l * 8, s), s += l * 8, a;
    if (h == 25)
      return a = r.toString(this.encoding, s >> 3, (s += l << 3) >> 3), a;
    console.log("ERROR: ElementType not implemented: " + h);
  }, u = function(h, l) {
    var a = [], c;
    if (h.length > 1) {
      var f = h.shift();
      for (c = 0; c < f; c++)
        a[c] = u(h, l);
      h.unshift(f);
    } else
      for (c = 0; c < h[0]; c++)
        a[c] = o(l);
    return a;
  };
  return u(n, t);
}, Pr = function(r) {
  return r.toString("utf8");
}, Mr = function(r) {
  return r === null ? null : g(r, 8) > 0;
}, Tr = function(r) {
  r(20, gr), r(21, br), r(23, Ne), r(26, Ne), r(1700, Cr), r(700, Sr), r(701, Er), r(16, Mr), r(1114, $e.bind(null, !1)), r(1184, $e.bind(null, !0)), r(1e3, W), r(1007, W), r(1016, W), r(1008, W), r(1009, W), r(25, Pr);
}, Rr = {
  init: Tr
}, Ar = {
  BOOL: 16,
  BYTEA: 17,
  CHAR: 18,
  INT8: 20,
  INT2: 21,
  INT4: 23,
  REGPROC: 24,
  TEXT: 25,
  OID: 26,
  TID: 27,
  XID: 28,
  CID: 29,
  JSON: 114,
  XML: 142,
  PG_NODE_TREE: 194,
  SMGR: 210,
  PATH: 602,
  POLYGON: 604,
  CIDR: 650,
  FLOAT4: 700,
  FLOAT8: 701,
  ABSTIME: 702,
  RELTIME: 703,
  TINTERVAL: 704,
  CIRCLE: 718,
  MACADDR8: 774,
  MONEY: 790,
  MACADDR: 829,
  INET: 869,
  ACLITEM: 1033,
  BPCHAR: 1042,
  VARCHAR: 1043,
  DATE: 1082,
  TIME: 1083,
  TIMESTAMP: 1114,
  TIMESTAMPTZ: 1184,
  INTERVAL: 1186,
  TIMETZ: 1266,
  BIT: 1560,
  VARBIT: 1562,
  NUMERIC: 1700,
  REFCURSOR: 1790,
  REGPROCEDURE: 2202,
  REGOPER: 2203,
  REGOPERATOR: 2204,
  REGCLASS: 2205,
  REGTYPE: 2206,
  UUID: 2950,
  TXID_SNAPSHOT: 2970,
  PG_LSN: 3220,
  PG_NDISTINCT: 3361,
  PG_DEPENDENCIES: 3402,
  TSVECTOR: 3614,
  TSQUERY: 3615,
  GTSVECTOR: 3642,
  REGCONFIG: 3734,
  REGDICTIONARY: 3769,
  JSONB: 3802,
  REGNAMESPACE: 4089,
  REGROLE: 4096
}, xr = vr, Ir = Rr, Or = ut, kr = Ar;
q.getTypeParser = Lr;
q.setTypeParser = Dr;
q.arrayParser = Or;
q.builtins = kr;
var K = {
  text: {},
  binary: {}
};
function je(r) {
  return String(r);
}
function Lr(r, e) {
  return e = e || "text", K[e] && K[e][r] || je;
}
function Dr(r, e, t) {
  typeof e == "function" && (t = e, e = "text"), K[e][r] = t;
}
xr.init(function(r, e) {
  K.text[r] = e;
});
Ir.init(function(r, e) {
  K.binary[r] = e;
});
(function(r) {
  r.exports = {
    // database host. defaults to localhost
    host: "localhost",
    // database user's name
    user: process.platform === "win32" ? process.env.USERNAME : process.env.USER,
    // name of database to connect
    database: void 0,
    // database user's password
    password: null,
    // a Postgres connection string to be used instead of setting individual connection items
    // NOTE:  Setting this value will cause it to override any other value (such as database or user) defined
    // in the defaults object.
    connectionString: void 0,
    // database port
    port: 5432,
    // number of rows to return at a time from a prepared statement's
    // portal. 0 will return all rows at once
    rows: 0,
    // binary result mode
    binary: !1,
    // Connection pool options - see https://github.com/brianc/node-pg-pool
    // number of connections to use in connection pool
    // 0 will disable connection pooling
    max: 10,
    // max milliseconds a client can go unused before it is removed
    // from the pool and destroyed
    idleTimeoutMillis: 3e4,
    client_encoding: "",
    ssl: !1,
    application_name: void 0,
    fallback_application_name: void 0,
    options: void 0,
    parseInputDatesAsUTC: !1,
    // max milliseconds any query using this connection will execute for before timing out in error.
    // false=unlimited
    statement_timeout: !1,
    // Abort any statement that waits longer than the specified duration in milliseconds while attempting to acquire a lock.
    // false=unlimited
    lock_timeout: !1,
    // Terminate any session with an open transaction that has been idle for longer than the specified duration in milliseconds
    // false=unlimited
    idle_in_transaction_session_timeout: !1,
    // max milliseconds to wait for query to complete (client side)
    query_timeout: !1,
    connect_timeout: 0,
    keepalives: 1,
    keepalives_idle: 0
  };
  var e = q, t = e.getTypeParser(20, "text"), s = e.getTypeParser(1016, "text");
  r.exports.__defineSetter__("parseInt8", function(n) {
    e.setTypeParser(20, "text", n ? e.getTypeParser(23, "text") : t), e.setTypeParser(1016, "text", n ? e.getTypeParser(1007, "text") : s);
  });
})(ot);
var te = ot.exports;
const Br = te;
function Qr(r) {
  var e = r.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return '"' + e + '"';
}
function mt(r) {
  for (var e = "{", t = 0; t < r.length; t++)
    t > 0 && (e = e + ","), r[t] === null || typeof r[t] > "u" ? e = e + "NULL" : Array.isArray(r[t]) ? e = e + mt(r[t]) : r[t] instanceof Buffer ? e += "\\\\x" + r[t].toString("hex") : e += Qr(X(r[t]));
  return e = e + "}", e;
}
var X = function(r, e) {
  if (r == null)
    return null;
  if (r instanceof Buffer)
    return r;
  if (ArrayBuffer.isView(r)) {
    var t = Buffer.from(r.buffer, r.byteOffset, r.byteLength);
    return t.length === r.byteLength ? t : t.slice(r.byteOffset, r.byteOffset + r.byteLength);
  }
  return r instanceof Date ? Br.parseInputDatesAsUTC ? Nr(r) : Fr(r) : Array.isArray(r) ? mt(r) : typeof r == "object" ? qr(r, e) : r.toString();
};
function qr(r, e) {
  if (r && typeof r.toPostgres == "function") {
    if (e = e || [], e.indexOf(r) !== -1)
      throw new Error('circular reference detected while preparing "' + r + '" for query');
    return e.push(r), X(r.toPostgres(X), e);
  }
  return JSON.stringify(r);
}
function T(r, e) {
  for (r = "" + r; r.length < e; )
    r = "0" + r;
  return r;
}
function Fr(r) {
  var e = -r.getTimezoneOffset(), t = r.getFullYear(), s = t < 1;
  s && (t = Math.abs(t) + 1);
  var n = T(t, 4) + "-" + T(r.getMonth() + 1, 2) + "-" + T(r.getDate(), 2) + "T" + T(r.getHours(), 2) + ":" + T(r.getMinutes(), 2) + ":" + T(r.getSeconds(), 2) + "." + T(r.getMilliseconds(), 3);
  return e < 0 ? (n += "-", e *= -1) : n += "+", n += T(Math.floor(e / 60), 2) + ":" + T(e % 60, 2), s && (n += " BC"), n;
}
function Nr(r) {
  var e = r.getUTCFullYear(), t = e < 1;
  t && (e = Math.abs(e) + 1);
  var s = T(e, 4) + "-" + T(r.getUTCMonth() + 1, 2) + "-" + T(r.getUTCDate(), 2) + "T" + T(r.getUTCHours(), 2) + ":" + T(r.getUTCMinutes(), 2) + ":" + T(r.getUTCSeconds(), 2) + "." + T(r.getUTCMilliseconds(), 3);
  return s += "+00:00", t && (s += " BC"), s;
}
function $r(r, e, t) {
  return r = typeof r == "string" ? { text: r } : r, e && (typeof e == "function" ? r.callback = e : r.values = e), t && (r.callback = t), r;
}
const jr = function(r) {
  return '"' + r.replace(/"/g, '""') + '"';
}, Ur = function(r) {
  for (var e = !1, t = "'", s = 0; s < r.length; s++) {
    var n = r[s];
    n === "'" ? t += n + n : n === "\\" ? (t += n + n, e = !0) : t += n;
  }
  return t += "'", e === !0 && (t = " E" + t), t;
};
var re = {
  prepareValue: function(e) {
    return X(e);
  },
  normalizeQueryConfig: $r,
  escapeIdentifier: jr,
  escapeLiteral: Ur
}, Me = { exports: {} }, me, Ue;
function Gr() {
  if (Ue)
    return me;
  Ue = 1;
  const r = E;
  function e(o) {
    return r.createHash("md5").update(o, "utf-8").digest("hex");
  }
  function t(o, u, h) {
    var l = e(u + o), a = e(Buffer.concat([Buffer.from(l), h]));
    return "md5" + a;
  }
  function s(o) {
    return r.createHash("sha256").update(o).digest();
  }
  function n(o, u) {
    return r.createHmac("sha256", o).update(u).digest();
  }
  async function i(o, u, h) {
    return r.pbkdf2Sync(o, u, h, 32, "sha256");
  }
  return me = {
    postgresMd5PasswordHash: t,
    randomBytes: r.randomBytes,
    deriveKey: i,
    sha256: s,
    hmacSha256: n,
    md5: e
  }, me;
}
var ye, Ge;
function Wr() {
  if (Ge)
    return ye;
  Ge = 1;
  const r = E;
  ye = {
    postgresMd5PasswordHash: o,
    randomBytes: n,
    deriveKey: l,
    sha256: u,
    hmacSha256: h,
    md5: i
  };
  const e = r.webcrypto || globalThis.crypto, t = e.subtle, s = new TextEncoder();
  function n(a) {
    return e.getRandomValues(Buffer.alloc(a));
  }
  async function i(a) {
    try {
      return r.createHash("md5").update(a, "utf-8").digest("hex");
    } catch {
      const f = typeof a == "string" ? s.encode(a) : a, d = await t.digest("MD5", f);
      return Array.from(new Uint8Array(d)).map((m) => m.toString(16).padStart(2, "0")).join("");
    }
  }
  async function o(a, c, f) {
    var d = await i(c + a), m = await i(Buffer.concat([Buffer.from(d), f]));
    return "md5" + m;
  }
  async function u(a) {
    return await t.digest("SHA-256", a);
  }
  async function h(a, c) {
    const f = await t.importKey("raw", a, { name: "HMAC", hash: "SHA-256" }, !1, ["sign"]);
    return await t.sign("HMAC", f, s.encode(c));
  }
  async function l(a, c, f) {
    const d = await t.importKey("raw", s.encode(a), "PBKDF2", !1, ["deriveBits"]), m = { name: "PBKDF2", hash: "SHA-256", salt: c, iterations: f };
    return await t.deriveBits(m, d, 32 * 8, ["deriveBits"]);
  }
  return ye;
}
const Hr = parseInt(process.versions && process.versions.node && process.versions.node.split(".")[0]) < 15;
Hr ? Me.exports = Gr() : Me.exports = Wr();
var yt = Me.exports;
const F = yt;
function Kr(r) {
  if (r.indexOf("SCRAM-SHA-256") === -1)
    throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
  const e = F.randomBytes(18).toString("base64");
  return {
    mechanism: "SCRAM-SHA-256",
    clientNonce: e,
    response: "n,,n=*,r=" + e,
    message: "SASLInitialResponse"
  };
}
async function Vr(r, e, t) {
  if (r.message !== "SASLInitialResponse")
    throw new Error("SASL: Last message was not SASLInitialResponse");
  if (typeof e != "string")
    throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
  if (e === "")
    throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");
  if (typeof t != "string")
    throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
  const s = Jr(t);
  if (s.nonce.startsWith(r.clientNonce)) {
    if (s.nonce.length === r.clientNonce.length)
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
  } else
    throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
  var n = "n=*,r=" + r.clientNonce, i = "r=" + s.nonce + ",s=" + s.salt + ",i=" + s.iteration, o = "c=biws,r=" + s.nonce, u = n + "," + i + "," + o, h = Buffer.from(s.salt, "base64"), l = await F.deriveKey(e, h, s.iteration), a = await F.hmacSha256(l, "Client Key"), c = await F.sha256(a), f = await F.hmacSha256(c, u), d = Xr(Buffer.from(a), Buffer.from(f)).toString("base64"), m = await F.hmacSha256(l, "Server Key"), y = await F.hmacSha256(m, u);
  r.message = "SASLResponse", r.serverSignature = Buffer.from(y).toString("base64"), r.response = o + ",p=" + d;
}
function zr(r, e) {
  if (r.message !== "SASLResponse")
    throw new Error("SASL: Last message was not SASLResponse");
  if (typeof e != "string")
    throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
  const { serverSignature: t } = Zr(e);
  if (t !== r.serverSignature)
    throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
}
function Yr(r) {
  if (typeof r != "string")
    throw new TypeError("SASL: text must be a string");
  return r.split("").map((e, t) => r.charCodeAt(t)).every((e) => e >= 33 && e <= 43 || e >= 45 && e <= 126);
}
function vt(r) {
  return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(r);
}
function _t(r) {
  if (typeof r != "string")
    throw new TypeError("SASL: attribute pairs text must be a string");
  return new Map(
    r.split(",").map((e) => {
      if (!/^.=/.test(e))
        throw new Error("SASL: Invalid attribute pair entry");
      const t = e[0], s = e.substring(2);
      return [t, s];
    })
  );
}
function Jr(r) {
  const e = _t(r), t = e.get("r");
  if (t) {
    if (!Yr(t))
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
  } else
    throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
  const s = e.get("s");
  if (s) {
    if (!vt(s))
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
  } else
    throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
  const n = e.get("i");
  if (n) {
    if (!/^[1-9][0-9]*$/.test(n))
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
  } else
    throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
  const i = parseInt(n, 10);
  return {
    nonce: t,
    salt: s,
    iteration: i
  };
}
function Zr(r) {
  const t = _t(r).get("v");
  if (t) {
    if (!vt(t))
      throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
  } else
    throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
  return {
    serverSignature: t
  };
}
function Xr(r, e) {
  if (!Buffer.isBuffer(r))
    throw new TypeError("first argument must be a Buffer");
  if (!Buffer.isBuffer(e))
    throw new TypeError("second argument must be a Buffer");
  if (r.length !== e.length)
    throw new Error("Buffer lengths must match");
  if (r.length === 0)
    throw new Error("Buffers cannot be empty");
  return Buffer.from(r.map((t, s) => r[s] ^ e[s]));
}
var es = {
  startSession: Kr,
  continueSession: Vr,
  finalizeSession: zr
}, ts = q;
function se(r) {
  this._types = r || ts, this.text = {}, this.binary = {};
}
se.prototype.getOverrides = function(r) {
  switch (r) {
    case "text":
      return this.text;
    case "binary":
      return this.binary;
    default:
      return {};
  }
};
se.prototype.setTypeParser = function(r, e, t) {
  typeof e == "function" && (t = e, e = "text"), this.getOverrides(e)[r] = t;
};
se.prototype.getTypeParser = function(r, e) {
  return e = e || "text", this.getOverrides(e)[r] || this._types.getTypeParser(r, e);
};
var wt = se;
function Te(r) {
  if (r.charAt(0) === "/") {
    const u = r.split(" ");
    return { host: u[0], database: u[1] };
  }
  const e = {};
  let t, s = !1;
  / |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r) && (r = encodeURI(r).replace(/\%25(\d\d)/g, "%$1"));
  try {
    t = new URL(r, "postgres://base");
  } catch {
    t = new URL(r.replace("@/", "@___DUMMY___/"), "postgres://base"), s = !0;
  }
  for (const u of t.searchParams.entries())
    e[u[0]] = u[1];
  if (e.user = e.user || decodeURIComponent(t.username), e.password = e.password || decodeURIComponent(t.password), t.protocol == "socket:")
    return e.host = decodeURI(t.pathname), e.database = t.searchParams.get("db"), e.client_encoding = t.searchParams.get("encoding"), e;
  const n = s ? "" : t.hostname;
  e.host ? n && /^%2f/i.test(n) && (t.pathname = n + t.pathname) : e.host = decodeURIComponent(n), e.port || (e.port = t.port);
  const i = t.pathname.slice(1) || null;
  e.database = i ? decodeURI(i) : null, (e.ssl === "true" || e.ssl === "1") && (e.ssl = !0), e.ssl === "0" && (e.ssl = !1), (e.sslcert || e.sslkey || e.sslrootcert || e.sslmode) && (e.ssl = {});
  const o = e.sslcert || e.sslkey || e.sslrootcert ? E : null;
  switch (e.sslcert && (e.ssl.cert = o.readFileSync(e.sslcert).toString()), e.sslkey && (e.ssl.key = o.readFileSync(e.sslkey).toString()), e.sslrootcert && (e.ssl.ca = o.readFileSync(e.sslrootcert).toString()), e.sslmode) {
    case "disable": {
      e.ssl = !1;
      break;
    }
    case "prefer":
    case "require":
    case "verify-ca":
    case "verify-full":
      break;
    case "no-verify": {
      e.ssl.rejectUnauthorized = !1;
      break;
    }
  }
  return e;
}
var rs = Te;
Te.parse = Te;
var ss = E, gt = te, We = rs.parse, I = function(r, e, t) {
  return t === void 0 ? t = process.env["PG" + r.toUpperCase()] : t === !1 || (t = process.env[t]), e[r] || t || gt[r];
}, ns = function() {
  switch (process.env.PGSSLMODE) {
    case "disable":
      return !1;
    case "prefer":
    case "require":
    case "verify-ca":
    case "verify-full":
      return !0;
    case "no-verify":
      return { rejectUnauthorized: !1 };
  }
  return gt.ssl;
}, $ = function(r) {
  return "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}, L = function(r, e, t) {
  var s = e[t];
  s != null && r.push(t + "=" + $(s));
};
let is = class {
  constructor(e) {
    e = typeof e == "string" ? We(e) : e || {}, e.connectionString && (e = Object.assign({}, e, We(e.connectionString))), this.user = I("user", e), this.database = I("database", e), this.database === void 0 && (this.database = this.user), this.port = parseInt(I("port", e), 10), this.host = I("host", e), Object.defineProperty(this, "password", {
      configurable: !0,
      enumerable: !1,
      writable: !0,
      value: I("password", e)
    }), this.binary = I("binary", e), this.options = I("options", e), this.ssl = typeof e.ssl > "u" ? ns() : e.ssl, typeof this.ssl == "string" && this.ssl === "true" && (this.ssl = !0), this.ssl === "no-verify" && (this.ssl = { rejectUnauthorized: !1 }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", {
      enumerable: !1
    }), this.client_encoding = I("client_encoding", e), this.replication = I("replication", e), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = I("application_name", e, "PGAPPNAME"), this.fallback_application_name = I("fallback_application_name", e, !1), this.statement_timeout = I("statement_timeout", e, !1), this.lock_timeout = I("lock_timeout", e, !1), this.idle_in_transaction_session_timeout = I("idle_in_transaction_session_timeout", e, !1), this.query_timeout = I("query_timeout", e, !1), e.connectionTimeoutMillis === void 0 ? this.connect_timeout = process.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e.connectionTimeoutMillis / 1e3), e.keepAlive === !1 ? this.keepalives = 0 : e.keepAlive === !0 && (this.keepalives = 1), typeof e.keepAliveInitialDelayMillis == "number" && (this.keepalives_idle = Math.floor(e.keepAliveInitialDelayMillis / 1e3));
  }
  getLibpqConnectionString(e) {
    var t = [];
    L(t, this, "user"), L(t, this, "password"), L(t, this, "port"), L(t, this, "application_name"), L(t, this, "fallback_application_name"), L(t, this, "connect_timeout"), L(t, this, "options");
    var s = typeof this.ssl == "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
    if (L(t, s, "sslmode"), L(t, s, "sslca"), L(t, s, "sslkey"), L(t, s, "sslcert"), L(t, s, "sslrootcert"), this.database && t.push("dbname=" + $(this.database)), this.replication && t.push("replication=" + $(this.replication)), this.host && t.push("host=" + $(this.host)), this.isDomainSocket)
      return e(null, t.join(" "));
    this.client_encoding && t.push("client_encoding=" + $(this.client_encoding)), ss.lookup(this.host, function(n, i) {
      return n ? e(n, null) : (t.push("hostaddr=" + $(i)), e(null, t.join(" ")));
    });
  }
};
var bt = is, as = q, He = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;
let os = class {
  constructor(e, t) {
    this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t, this.RowCtor = null, this.rowAsArray = e === "array", this.rowAsArray && (this.parseRow = this._parseRowAsArray), this._prebuiltEmptyResultObject = null;
  }
  // adds a command complete message
  addCommandComplete(e) {
    var t;
    e.text ? t = He.exec(e.text) : t = He.exec(e.command), t && (this.command = t[1], t[3] ? (this.oid = parseInt(t[2], 10), this.rowCount = parseInt(t[3], 10)) : t[2] && (this.rowCount = parseInt(t[2], 10)));
  }
  _parseRowAsArray(e) {
    for (var t = new Array(e.length), s = 0, n = e.length; s < n; s++) {
      var i = e[s];
      i !== null ? t[s] = this._parsers[s](i) : t[s] = null;
    }
    return t;
  }
  parseRow(e) {
    for (var t = { ...this._prebuiltEmptyResultObject }, s = 0, n = e.length; s < n; s++) {
      var i = e[s], o = this.fields[s].name;
      i !== null && (t[o] = this._parsers[s](i));
    }
    return t;
  }
  addRow(e) {
    this.rows.push(e);
  }
  addFields(e) {
    this.fields = e, this.fields.length && (this._parsers = new Array(e.length));
    for (var t = 0; t < e.length; t++) {
      var s = e[t];
      this._types ? this._parsers[t] = this._types.getTypeParser(s.dataTypeID, s.format || "text") : this._parsers[t] = as.getTypeParser(s.dataTypeID, s.format || "text");
    }
    this._createPrebuiltEmptyResultObject();
  }
  _createPrebuiltEmptyResultObject() {
    for (var e = {}, t = 0; t < this.fields.length; t++)
      e[this.fields[t].name] = null;
    this._prebuiltEmptyResultObject = { ...e };
  }
};
var us = os;
const { EventEmitter: cs } = E, Ke = us, Ve = re;
let hs = class extends cs {
  constructor(e, t, s) {
    super(), e = Ve.normalizeQueryConfig(e, t, s), this.text = e.text, this.values = e.values, this.rows = e.rows, this.types = e.types, this.name = e.name, this.binary = e.binary, this.portal = e.portal || "", this.callback = e.callback, this._rowMode = e.rowMode, process.domain && e.callback && (this.callback = process.domain.bind(e.callback)), this._result = new Ke(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = !1, this._canceledDueToError = !1, this._promise = null;
  }
  requiresPreparation() {
    return this.name || this.rows ? !0 : !this.text || !this.values ? !1 : this.values.length > 0;
  }
  _checkForMultirow() {
    this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new Ke(this._rowMode, this.types), this._results.push(this._result));
  }
  // associates row metadata from the supplied
  // message with this query object
  // metadata used when parsing row results
  handleRowDescription(e) {
    this._checkForMultirow(), this._result.addFields(e.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
  }
  handleDataRow(e) {
    let t;
    if (!this._canceledDueToError) {
      try {
        t = this._result.parseRow(e.fields);
      } catch (s) {
        this._canceledDueToError = s;
        return;
      }
      this.emit("row", t, this._result), this._accumulateRows && this._result.addRow(t);
    }
  }
  handleCommandComplete(e, t) {
    this._checkForMultirow(), this._result.addCommandComplete(e), this.rows && t.sync();
  }
  // if a named prepared statement is created with empty query text
  // the backend will send an emptyQuery message but *not* a command complete message
  // since we pipeline sync immediately after execute we don't need to do anything here
  // unless we have rows specified, in which case we did not pipeline the intial sync call
  handleEmptyQuery(e) {
    this.rows && e.sync();
  }
  handleError(e, t) {
    if (this._canceledDueToError && (e = this._canceledDueToError, this._canceledDueToError = !1), this.callback)
      return this.callback(e);
    this.emit("error", e);
  }
  handleReadyForQuery(e) {
    if (this._canceledDueToError)
      return this.handleError(this._canceledDueToError, e);
    if (this.callback)
      try {
        this.callback(null, this._results);
      } catch (t) {
        process.nextTick(() => {
          throw t;
        });
      }
    this.emit("end", this._results);
  }
  submit(e) {
    if (typeof this.text != "string" && typeof this.name != "string")
      return new Error("A query must have either text or a name. Supplying neither is unsupported.");
    const t = e.parsedStatements[this.name];
    return this.text && t && this.text !== t ? new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? new Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e) : e.query(this.text), null);
  }
  hasBeenParsed(e) {
    return this.name && e.parsedStatements[this.name];
  }
  handlePortalSuspended(e) {
    this._getRows(e, this.rows);
  }
  _getRows(e, t) {
    e.execute({
      portal: this.portal,
      rows: t
    }), t ? e.flush() : e.sync();
  }
  // http://developer.postgresql.org/pgdocs/postgres/protocol-flow.html#PROTOCOL-FLOW-EXT-QUERY
  prepare(e) {
    this.isPreparedStatement = !0, this.hasBeenParsed(e) || e.parse({
      text: this.text,
      name: this.name,
      types: this.types
    });
    try {
      e.bind({
        portal: this.portal,
        statement: this.name,
        values: this.values,
        binary: this.binary,
        valueMapper: Ve.prepareValue
      });
    } catch (t) {
      this.handleError(t, e);
      return;
    }
    e.describe({
      type: "P",
      name: this.portal || ""
    }), this._getRows(e, this.rows);
  }
  handleCopyInResponse(e) {
    e.sendCopyFail("No source stream defined");
  }
  // eslint-disable-next-line no-unused-vars
  handleCopyData(e, t) {
  }
};
var ls = hs, Le = {}, p = {};
Object.defineProperty(p, "__esModule", { value: !0 });
p.NoticeMessage = p.DataRowMessage = p.CommandCompleteMessage = p.ReadyForQueryMessage = p.NotificationResponseMessage = p.BackendKeyDataMessage = p.AuthenticationMD5Password = p.ParameterStatusMessage = p.ParameterDescriptionMessage = p.RowDescriptionMessage = p.Field = p.CopyResponse = p.CopyDataMessage = p.DatabaseError = p.copyDone = p.emptyQuery = p.replicationStart = p.portalSuspended = p.noData = p.closeComplete = p.bindComplete = p.parseComplete = void 0;
p.parseComplete = {
  name: "parseComplete",
  length: 5
};
p.bindComplete = {
  name: "bindComplete",
  length: 5
};
p.closeComplete = {
  name: "closeComplete",
  length: 5
};
p.noData = {
  name: "noData",
  length: 5
};
p.portalSuspended = {
  name: "portalSuspended",
  length: 5
};
p.replicationStart = {
  name: "replicationStart",
  length: 4
};
p.emptyQuery = {
  name: "emptyQuery",
  length: 4
};
p.copyDone = {
  name: "copyDone",
  length: 4
};
class fs extends Error {
  constructor(e, t, s) {
    super(e), this.length = t, this.name = s;
  }
}
p.DatabaseError = fs;
class ds {
  constructor(e, t) {
    this.length = e, this.chunk = t, this.name = "copyData";
  }
}
p.CopyDataMessage = ds;
class ps {
  constructor(e, t, s, n) {
    this.length = e, this.name = t, this.binary = s, this.columnTypes = new Array(n);
  }
}
p.CopyResponse = ps;
class ms {
  constructor(e, t, s, n, i, o, u) {
    this.name = e, this.tableID = t, this.columnID = s, this.dataTypeID = n, this.dataTypeSize = i, this.dataTypeModifier = o, this.format = u;
  }
}
p.Field = ms;
class ys {
  constructor(e, t) {
    this.length = e, this.fieldCount = t, this.name = "rowDescription", this.fields = new Array(this.fieldCount);
  }
}
p.RowDescriptionMessage = ys;
class vs {
  constructor(e, t) {
    this.length = e, this.parameterCount = t, this.name = "parameterDescription", this.dataTypeIDs = new Array(this.parameterCount);
  }
}
p.ParameterDescriptionMessage = vs;
class _s {
  constructor(e, t, s) {
    this.length = e, this.parameterName = t, this.parameterValue = s, this.name = "parameterStatus";
  }
}
p.ParameterStatusMessage = _s;
class ws {
  constructor(e, t) {
    this.length = e, this.salt = t, this.name = "authenticationMD5Password";
  }
}
p.AuthenticationMD5Password = ws;
class gs {
  constructor(e, t, s) {
    this.length = e, this.processID = t, this.secretKey = s, this.name = "backendKeyData";
  }
}
p.BackendKeyDataMessage = gs;
class bs {
  constructor(e, t, s, n) {
    this.length = e, this.processId = t, this.channel = s, this.payload = n, this.name = "notification";
  }
}
p.NotificationResponseMessage = bs;
class Ss {
  constructor(e, t) {
    this.length = e, this.status = t, this.name = "readyForQuery";
  }
}
p.ReadyForQueryMessage = Ss;
class Es {
  constructor(e, t) {
    this.length = e, this.text = t, this.name = "commandComplete";
  }
}
p.CommandCompleteMessage = Es;
class Cs {
  constructor(e, t) {
    this.length = e, this.fields = t, this.name = "dataRow", this.fieldCount = t.length;
  }
}
p.DataRowMessage = Cs;
class Ps {
  constructor(e, t) {
    this.length = e, this.message = t, this.name = "notice";
  }
}
p.NoticeMessage = Ps;
var ne = {}, ie = {};
Object.defineProperty(ie, "__esModule", { value: !0 });
ie.Writer = void 0;
class Ms {
  constructor(e = 256) {
    this.size = e, this.offset = 5, this.headerPosition = 0, this.buffer = Buffer.allocUnsafe(e);
  }
  ensure(e) {
    var t = this.buffer.length - this.offset;
    if (t < e) {
      var s = this.buffer, n = s.length + (s.length >> 1) + e;
      this.buffer = Buffer.allocUnsafe(n), s.copy(this.buffer);
    }
  }
  addInt32(e) {
    return this.ensure(4), this.buffer[this.offset++] = e >>> 24 & 255, this.buffer[this.offset++] = e >>> 16 & 255, this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
  }
  addInt16(e) {
    return this.ensure(2), this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
  }
  addCString(e) {
    if (!e)
      this.ensure(1);
    else {
      var t = Buffer.byteLength(e);
      this.ensure(t + 1), this.buffer.write(e, this.offset, "utf-8"), this.offset += t;
    }
    return this.buffer[this.offset++] = 0, this;
  }
  addString(e = "") {
    var t = Buffer.byteLength(e);
    return this.ensure(t), this.buffer.write(e, this.offset), this.offset += t, this;
  }
  add(e) {
    return this.ensure(e.length), e.copy(this.buffer, this.offset), this.offset += e.length, this;
  }
  join(e) {
    if (e) {
      this.buffer[this.headerPosition] = e;
      const t = this.offset - (this.headerPosition + 1);
      this.buffer.writeInt32BE(t, this.headerPosition + 1);
    }
    return this.buffer.slice(e ? 0 : 5, this.offset);
  }
  flush(e) {
    var t = this.join(e);
    return this.offset = 5, this.headerPosition = 0, this.buffer = Buffer.allocUnsafe(this.size), t;
  }
}
ie.Writer = Ms;
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.serialize = void 0;
const De = ie, b = new De.Writer(), Ts = (r) => {
  b.addInt16(3).addInt16(0);
  for (const s of Object.keys(r))
    b.addCString(s).addCString(r[s]);
  b.addCString("client_encoding").addCString("UTF8");
  var e = b.addCString("").flush(), t = e.length + 4;
  return new De.Writer().addInt32(t).add(e).flush();
}, Rs = () => {
  const r = Buffer.allocUnsafe(8);
  return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
}, As = (r) => b.addCString(r).flush(
  112
  /* startup */
), xs = function(r, e) {
  return b.addCString(r).addInt32(Buffer.byteLength(e)).addString(e), b.flush(
    112
    /* startup */
  );
}, Is = function(r) {
  return b.addString(r).flush(
    112
    /* startup */
  );
}, Os = (r) => b.addCString(r).flush(
  81
  /* query */
), St = [], ks = (r) => {
  const e = r.name || "";
  e.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", e, e.length), console.error("This can cause conflicts and silent errors executing queries"));
  const t = r.types || St;
  for (var s = t.length, n = b.addCString(e).addCString(r.text).addInt16(s), i = 0; i < s; i++)
    n.addInt32(t[i]);
  return b.flush(
    80
    /* parse */
  );
}, j = new De.Writer(), Ls = function(r, e) {
  for (let t = 0; t < r.length; t++) {
    const s = e ? e(r[t], t) : r[t];
    s == null ? (b.addInt16(
      0
      /* STRING */
    ), j.addInt32(-1)) : s instanceof Buffer ? (b.addInt16(
      1
      /* BINARY */
    ), j.addInt32(s.length), j.add(s)) : (b.addInt16(
      0
      /* STRING */
    ), j.addInt32(Buffer.byteLength(s)), j.addString(s));
  }
}, Ds = (r = {}) => {
  const e = r.portal || "", t = r.statement || "", s = r.binary || !1, n = r.values || St, i = n.length;
  return b.addCString(e).addCString(t), b.addInt16(i), Ls(n, r.valueMapper), b.addInt16(i), b.add(j.flush()), b.addInt16(
    s ? 1 : 0
    /* STRING */
  ), b.flush(
    66
    /* bind */
  );
}, Bs = Buffer.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), Qs = (r) => {
  if (!r || !r.portal && !r.rows)
    return Bs;
  const e = r.portal || "", t = r.rows || 0, s = Buffer.byteLength(e), n = 4 + s + 1 + 4, i = Buffer.allocUnsafe(1 + n);
  return i[0] = 69, i.writeInt32BE(n, 1), i.write(e, 5, "utf-8"), i[s + 5] = 0, i.writeUInt32BE(t, i.length - 4), i;
}, qs = (r, e) => {
  const t = Buffer.allocUnsafe(16);
  return t.writeInt32BE(16, 0), t.writeInt16BE(1234, 4), t.writeInt16BE(5678, 6), t.writeInt32BE(r, 8), t.writeInt32BE(e, 12), t;
}, Be = (r, e) => {
  const s = 4 + Buffer.byteLength(e) + 1, n = Buffer.allocUnsafe(1 + s);
  return n[0] = r, n.writeInt32BE(s, 1), n.write(e, 5, "utf-8"), n[s] = 0, n;
}, Fs = b.addCString("P").flush(
  68
  /* describe */
), Ns = b.addCString("S").flush(
  68
  /* describe */
), $s = (r) => r.name ? Be(68, `${r.type}${r.name || ""}`) : r.type === "P" ? Fs : Ns, js = (r) => {
  const e = `${r.type}${r.name || ""}`;
  return Be(67, e);
}, Us = (r) => b.add(r).flush(
  100
  /* copyFromChunk */
), Gs = (r) => Be(102, r), ae = (r) => Buffer.from([r, 0, 0, 0, 4]), Ws = ae(
  72
  /* flush */
), Hs = ae(
  83
  /* sync */
), Ks = ae(
  88
  /* end */
), Vs = ae(
  99
  /* copyDone */
), zs = {
  startup: Ts,
  password: As,
  requestSsl: Rs,
  sendSASLInitialResponseMessage: xs,
  sendSCRAMClientFinalMessage: Is,
  query: Os,
  parse: ks,
  bind: Ds,
  execute: Qs,
  describe: $s,
  close: js,
  flush: () => Ws,
  sync: () => Hs,
  end: () => Ks,
  copyData: Us,
  copyDone: () => Vs,
  copyFail: Gs,
  cancel: qs
};
ne.serialize = zs;
var oe = {}, ue = {};
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.BufferReader = void 0;
const Ys = Buffer.allocUnsafe(0);
class Js {
  constructor(e = 0) {
    this.offset = e, this.buffer = Ys, this.encoding = "utf-8";
  }
  setBuffer(e, t) {
    this.offset = e, this.buffer = t;
  }
  int16() {
    const e = this.buffer.readInt16BE(this.offset);
    return this.offset += 2, e;
  }
  byte() {
    const e = this.buffer[this.offset];
    return this.offset++, e;
  }
  int32() {
    const e = this.buffer.readInt32BE(this.offset);
    return this.offset += 4, e;
  }
  string(e) {
    const t = this.buffer.toString(this.encoding, this.offset, this.offset + e);
    return this.offset += e, t;
  }
  cstring() {
    const e = this.offset;
    let t = e;
    for (; this.buffer[t++] !== 0; )
      ;
    return this.offset = t, this.buffer.toString(this.encoding, e, t - 1);
  }
  bytes(e) {
    const t = this.buffer.slice(this.offset, this.offset + e);
    return this.offset += e, t;
  }
}
ue.BufferReader = Js;
var Zs = H && H.__importDefault || function(r) {
  return r && r.__esModule ? r : { default: r };
};
Object.defineProperty(oe, "__esModule", { value: !0 });
oe.Parser = void 0;
const S = p, Xs = ue, en = Zs(E), Re = 1, tn = 4, ze = Re + tn, Ye = Buffer.allocUnsafe(0);
class rn {
  constructor(e) {
    if (this.buffer = Ye, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new Xs.BufferReader(), (e == null ? void 0 : e.mode) === "binary")
      throw new Error("Binary mode not supported yet");
    this.mode = (e == null ? void 0 : e.mode) || "text";
  }
  parse(e, t) {
    this.mergeBuffer(e);
    const s = this.bufferOffset + this.bufferLength;
    let n = this.bufferOffset;
    for (; n + ze <= s; ) {
      const i = this.buffer[n], o = this.buffer.readUInt32BE(n + Re), u = Re + o;
      if (u + n <= s) {
        const h = this.handlePacket(n + ze, i, o, this.buffer);
        t(h), n += u;
      } else
        break;
    }
    n === s ? (this.buffer = Ye, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = s - n, this.bufferOffset = n);
  }
  mergeBuffer(e) {
    if (this.bufferLength > 0) {
      const t = this.bufferLength + e.byteLength;
      if (t + this.bufferOffset > this.buffer.byteLength) {
        let n;
        if (t <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength)
          n = this.buffer;
        else {
          let i = this.buffer.byteLength * 2;
          for (; t >= i; )
            i *= 2;
          n = Buffer.allocUnsafe(i);
        }
        this.buffer.copy(n, 0, this.bufferOffset, this.bufferOffset + this.bufferLength), this.buffer = n, this.bufferOffset = 0;
      }
      e.copy(this.buffer, this.bufferOffset + this.bufferLength), this.bufferLength = t;
    } else
      this.buffer = e, this.bufferOffset = 0, this.bufferLength = e.byteLength;
  }
  handlePacket(e, t, s, n) {
    switch (t) {
      case 50:
        return S.bindComplete;
      case 49:
        return S.parseComplete;
      case 51:
        return S.closeComplete;
      case 110:
        return S.noData;
      case 115:
        return S.portalSuspended;
      case 99:
        return S.copyDone;
      case 87:
        return S.replicationStart;
      case 73:
        return S.emptyQuery;
      case 68:
        return this.parseDataRowMessage(e, s, n);
      case 67:
        return this.parseCommandCompleteMessage(e, s, n);
      case 90:
        return this.parseReadyForQueryMessage(e, s, n);
      case 65:
        return this.parseNotificationMessage(e, s, n);
      case 82:
        return this.parseAuthenticationResponse(e, s, n);
      case 83:
        return this.parseParameterStatusMessage(e, s, n);
      case 75:
        return this.parseBackendKeyData(e, s, n);
      case 69:
        return this.parseErrorMessage(e, s, n, "error");
      case 78:
        return this.parseErrorMessage(e, s, n, "notice");
      case 84:
        return this.parseRowDescriptionMessage(e, s, n);
      case 116:
        return this.parseParameterDescriptionMessage(e, s, n);
      case 71:
        return this.parseCopyInMessage(e, s, n);
      case 72:
        return this.parseCopyOutMessage(e, s, n);
      case 100:
        return this.parseCopyData(e, s, n);
      default:
        en.default.fail(`unknown message code: ${t.toString(16)}`);
    }
  }
  parseReadyForQueryMessage(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.string(1);
    return new S.ReadyForQueryMessage(t, n);
  }
  parseCommandCompleteMessage(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.cstring();
    return new S.CommandCompleteMessage(t, n);
  }
  parseCopyData(e, t, s) {
    const n = s.slice(e, e + (t - 4));
    return new S.CopyDataMessage(t, n);
  }
  parseCopyInMessage(e, t, s) {
    return this.parseCopyMessage(e, t, s, "copyInResponse");
  }
  parseCopyOutMessage(e, t, s) {
    return this.parseCopyMessage(e, t, s, "copyOutResponse");
  }
  parseCopyMessage(e, t, s, n) {
    this.reader.setBuffer(e, s);
    const i = this.reader.byte() !== 0, o = this.reader.int16(), u = new S.CopyResponse(t, n, i, o);
    for (let h = 0; h < o; h++)
      u.columnTypes[h] = this.reader.int16();
    return u;
  }
  parseNotificationMessage(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.int32(), i = this.reader.cstring(), o = this.reader.cstring();
    return new S.NotificationResponseMessage(t, n, i, o);
  }
  parseRowDescriptionMessage(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.int16(), i = new S.RowDescriptionMessage(t, n);
    for (let o = 0; o < n; o++)
      i.fields[o] = this.parseField();
    return i;
  }
  parseField() {
    const e = this.reader.cstring(), t = this.reader.int32(), s = this.reader.int16(), n = this.reader.int32(), i = this.reader.int16(), o = this.reader.int32(), u = this.reader.int16() === 0 ? "text" : "binary";
    return new S.Field(e, t, s, n, i, o, u);
  }
  parseParameterDescriptionMessage(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.int16(), i = new S.ParameterDescriptionMessage(t, n);
    for (let o = 0; o < n; o++)
      i.dataTypeIDs[o] = this.reader.int32();
    return i;
  }
  parseDataRowMessage(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.int16(), i = new Array(n);
    for (let o = 0; o < n; o++) {
      const u = this.reader.int32();
      i[o] = u === -1 ? null : this.reader.string(u);
    }
    return new S.DataRowMessage(t, i);
  }
  parseParameterStatusMessage(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.cstring(), i = this.reader.cstring();
    return new S.ParameterStatusMessage(t, n, i);
  }
  parseBackendKeyData(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.int32(), i = this.reader.int32();
    return new S.BackendKeyDataMessage(t, n, i);
  }
  parseAuthenticationResponse(e, t, s) {
    this.reader.setBuffer(e, s);
    const n = this.reader.int32(), i = {
      name: "authenticationOk",
      length: t
    };
    switch (n) {
      case 0:
        break;
      case 3:
        i.length === 8 && (i.name = "authenticationCleartextPassword");
        break;
      case 5:
        if (i.length === 12) {
          i.name = "authenticationMD5Password";
          const u = this.reader.bytes(4);
          return new S.AuthenticationMD5Password(t, u);
        }
        break;
      case 10:
        i.name = "authenticationSASL", i.mechanisms = [];
        let o;
        do
          o = this.reader.cstring(), o && i.mechanisms.push(o);
        while (o);
        break;
      case 11:
        i.name = "authenticationSASLContinue", i.data = this.reader.string(t - 8);
        break;
      case 12:
        i.name = "authenticationSASLFinal", i.data = this.reader.string(t - 8);
        break;
      default:
        throw new Error("Unknown authenticationOk message type " + n);
    }
    return i;
  }
  parseErrorMessage(e, t, s, n) {
    this.reader.setBuffer(e, s);
    const i = {};
    let o = this.reader.string(1);
    for (; o !== "\0"; )
      i[o] = this.reader.cstring(), o = this.reader.string(1);
    const u = i.M, h = n === "notice" ? new S.NoticeMessage(t, u) : new S.DatabaseError(u, t, n);
    return h.severity = i.S, h.code = i.C, h.detail = i.D, h.hint = i.H, h.position = i.P, h.internalPosition = i.p, h.internalQuery = i.q, h.where = i.W, h.schema = i.s, h.table = i.t, h.column = i.c, h.dataType = i.d, h.constraint = i.n, h.file = i.F, h.line = i.L, h.routine = i.R, h;
  }
}
oe.Parser = rn;
(function(r) {
  Object.defineProperty(r, "__esModule", { value: !0 }), r.DatabaseError = r.serialize = r.parse = void 0;
  const e = p;
  Object.defineProperty(r, "DatabaseError", { enumerable: !0, get: function() {
    return e.DatabaseError;
  } });
  const t = ne;
  Object.defineProperty(r, "serialize", { enumerable: !0, get: function() {
    return t.serialize;
  } });
  const s = oe;
  function n(i, o) {
    const u = new s.Parser();
    return i.on("data", (h) => u.parse(h, o)), new Promise((h) => i.on("end", () => h()));
  }
  r.parse = n;
})(Le);
var Qe = {};
const sn = {}, nn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sn
}, Symbol.toStringTag, { value: "Module" })), an = /* @__PURE__ */ Ae(nn);
Qe.getStream = function(e) {
  const t = E;
  if (typeof t.Socket == "function")
    return new t.Socket();
  {
    const { CloudflareSocket: s } = an;
    return new s(e);
  }
};
Qe.getSecureStream = function(e) {
  var t = E;
  return t.connect ? t.connect(e) : (e.socket.startTls(e), e.socket);
};
var on = E.EventEmitter;
const { parse: un, serialize: M } = Le, { getStream: cn, getSecureStream: hn } = Qe, ln = M.flush(), fn = M.sync(), dn = M.end();
let pn = class extends on {
  constructor(e) {
    super(), e = e || {}, this.stream = e.stream || cn(e.ssl), typeof this.stream == "function" && (this.stream = this.stream(e)), this._keepAlive = e.keepAlive, this._keepAliveInitialDelayMillis = e.keepAliveInitialDelayMillis, this.lastBuffer = !1, this.parsedStatements = {}, this.ssl = e.ssl || !1, this._ending = !1, this._emitMessage = !1;
    var t = this;
    this.on("newListener", function(s) {
      s === "message" && (t._emitMessage = !0);
    });
  }
  connect(e, t) {
    var s = this;
    this._connecting = !0, this.stream.setNoDelay(!0), this.stream.connect(e, t), this.stream.once("connect", function() {
      s._keepAlive && s.stream.setKeepAlive(!0, s._keepAliveInitialDelayMillis), s.emit("connect");
    });
    const n = function(i) {
      s._ending && (i.code === "ECONNRESET" || i.code === "EPIPE") || s.emit("error", i);
    };
    if (this.stream.on("error", n), this.stream.on("close", function() {
      s.emit("end");
    }), !this.ssl)
      return this.attachListeners(this.stream);
    this.stream.once("data", function(i) {
      var o = i.toString("utf8");
      switch (o) {
        case "S":
          break;
        case "N":
          return s.stream.end(), s.emit("error", new Error("The server does not support SSL connections"));
        default:
          return s.stream.end(), s.emit("error", new Error("There was an error establishing an SSL connection"));
      }
      const u = {
        socket: s.stream
      };
      s.ssl !== !0 && (Object.assign(u, s.ssl), "key" in s.ssl && (u.key = s.ssl.key));
      var h = E;
      h.isIP && h.isIP(t) === 0 && (u.servername = t);
      try {
        s.stream = hn(u);
      } catch (l) {
        return s.emit("error", l);
      }
      s.attachListeners(s.stream), s.stream.on("error", n), s.emit("sslconnect");
    });
  }
  attachListeners(e) {
    un(e, (t) => {
      var s = t.name === "error" ? "errorMessage" : t.name;
      this._emitMessage && this.emit("message", t), this.emit(s, t);
    });
  }
  requestSsl() {
    this.stream.write(M.requestSsl());
  }
  startup(e) {
    this.stream.write(M.startup(e));
  }
  cancel(e, t) {
    this._send(M.cancel(e, t));
  }
  password(e) {
    this._send(M.password(e));
  }
  sendSASLInitialResponseMessage(e, t) {
    this._send(M.sendSASLInitialResponseMessage(e, t));
  }
  sendSCRAMClientFinalMessage(e) {
    this._send(M.sendSCRAMClientFinalMessage(e));
  }
  _send(e) {
    return this.stream.writable ? this.stream.write(e) : !1;
  }
  query(e) {
    this._send(M.query(e));
  }
  // send parse message
  parse(e) {
    this._send(M.parse(e));
  }
  // send bind message
  bind(e) {
    this._send(M.bind(e));
  }
  // send execute message
  execute(e) {
    this._send(M.execute(e));
  }
  flush() {
    this.stream.writable && this.stream.write(ln);
  }
  sync() {
    this._ending = !0, this._send(fn);
  }
  ref() {
    this.stream.ref();
  }
  unref() {
    this.stream.unref();
  }
  end() {
    if (this._ending = !0, !this._connecting || !this.stream.writable) {
      this.stream.end();
      return;
    }
    return this.stream.write(dn, () => {
      this.stream.end();
    });
  }
  close(e) {
    this._send(M.close(e));
  }
  describe(e) {
    this._send(M.describe(e));
  }
  sendCopyFromChunk(e) {
    this._send(M.copyData(e));
  }
  endCopyFrom() {
    this._send(M.copyDone());
  }
  sendCopyFail(e) {
    this._send(M.copyFail(e));
  }
};
var Et = pn, J = { exports: {} }, ve = { exports: {} }, _e, Je;
function mn() {
  if (Je)
    return _e;
  Je = 1;
  const { Transform: r } = E, { StringDecoder: e } = E, t = Symbol("last"), s = Symbol("decoder");
  function n(l, a, c) {
    let f;
    if (this.overflow) {
      if (f = this[s].write(l).split(this.matcher), f.length === 1)
        return c();
      f.shift(), this.overflow = !1;
    } else
      this[t] += this[s].write(l), f = this[t].split(this.matcher);
    this[t] = f.pop();
    for (let d = 0; d < f.length; d++)
      try {
        o(this, this.mapper(f[d]));
      } catch (m) {
        return c(m);
      }
    if (this.overflow = this[t].length > this.maxLength, this.overflow && !this.skipOverflow) {
      c(new Error("maximum buffer reached"));
      return;
    }
    c();
  }
  function i(l) {
    if (this[t] += this[s].end(), this[t])
      try {
        o(this, this.mapper(this[t]));
      } catch (a) {
        return l(a);
      }
    l();
  }
  function o(l, a) {
    a !== void 0 && l.push(a);
  }
  function u(l) {
    return l;
  }
  function h(l, a, c) {
    switch (l = l || /\r?\n/, a = a || u, c = c || {}, arguments.length) {
      case 1:
        typeof l == "function" ? (a = l, l = /\r?\n/) : typeof l == "object" && !(l instanceof RegExp) && !l[Symbol.split] && (c = l, l = /\r?\n/);
        break;
      case 2:
        typeof l == "function" ? (c = a, a = l, l = /\r?\n/) : typeof a == "object" && (c = a, a = u);
    }
    c = Object.assign({}, c), c.autoDestroy = !0, c.transform = n, c.flush = i, c.readableObjectMode = !0;
    const f = new r(c);
    return f[t] = "", f[s] = new e("utf8"), f.matcher = l, f.mapper = a, f.maxLength = c.maxLength, f.skipOverflow = c.skipOverflow || !1, f.overflow = !1, f._destroy = function(d, m) {
      this._writableState.errorEmitted = !1, m(d);
    }, f;
  }
  return _e = h, _e;
}
var Ze;
function yn() {
  return Ze || (Ze = 1, function(r) {
    var e = E, t = E.Stream, s = mn(), n = E, i = 5432, o = process.platform === "win32", u = process.stderr, h = 56, l = 7, a = 61440, c = 32768;
    function f(_) {
      return (_ & a) == c;
    }
    var d = ["host", "port", "database", "user", "password"], m = d.length, y = d[m - 1];
    function v() {
      var _ = u instanceof t && u.writable === !0;
      if (_) {
        var w = Array.prototype.slice.call(arguments).concat(`
`);
        u.write(n.format.apply(n, w));
      }
    }
    Object.defineProperty(r.exports, "isWin", {
      get: function() {
        return o;
      },
      set: function(_) {
        o = _;
      }
    }), r.exports.warnTo = function(_) {
      var w = u;
      return u = _, w;
    }, r.exports.getFileName = function(_) {
      var w = _ || process.env, A = w.PGPASSFILE || (o ? e.join(w.APPDATA || "./", "postgresql", "pgpass.conf") : e.join(w.HOME || "./", ".pgpass"));
      return A;
    }, r.exports.usePgPass = function(_, w) {
      return Object.prototype.hasOwnProperty.call(process.env, "PGPASSWORD") ? !1 : o ? !0 : (w = w || "<unkn>", f(_.mode) ? _.mode & (h | l) ? (v('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', w), !1) : !0 : (v('WARNING: password file "%s" is not a plain file', w), !1));
    };
    var R = r.exports.match = function(_, w) {
      return d.slice(0, -1).reduce(function(A, x, B) {
        return B == 1 && Number(_[x] || i) === Number(w[x]) ? A && !0 : A && (w[x] === "*" || w[x] === _[x]);
      }, !0);
    };
    r.exports.getPassword = function(_, w, A) {
      var x, B = w.pipe(s());
      function Q(D) {
        var N = P(D);
        N && Y(N) && R(_, N) && (x = N[y], B.end());
      }
      var C = function() {
        w.destroy(), A(x);
      }, G = function(D) {
        w.destroy(), v("WARNING: error on reading file: %s", D), A(void 0);
      };
      w.on("error", G), B.on("data", Q).on("end", C).on("error", G);
    };
    var P = r.exports.parseLine = function(_) {
      if (_.length < 11 || _.match(/^\s+#/))
        return null;
      for (var w = "", A = "", x = 0, B = 0, Q = {}, C = !1, G = function(N, Tt, Rt) {
        var ce = _.substring(Tt, Rt);
        Object.hasOwnProperty.call(process.env, "PGPASS_NO_DEESCAPE") || (ce = ce.replace(/\\([:\\])/g, "$1")), Q[d[N]] = ce;
      }, D = 0; D < _.length - 1; D += 1) {
        if (w = _.charAt(D + 1), A = _.charAt(D), C = x == m - 1, C) {
          G(x, B);
          break;
        }
        D >= 0 && w == ":" && A !== "\\" && (G(x, B, D + 1), B = D + 2, x += 1);
      }
      return Q = Object.keys(Q).length === m ? Q : null, Q;
    }, Y = r.exports.isValidEntry = function(_) {
      for (var w = {
        // host
        0: function(C) {
          return C.length > 0;
        },
        // port
        1: function(C) {
          return C === "*" ? !0 : (C = Number(C), isFinite(C) && C > 0 && C < 9007199254740992 && Math.floor(C) === C);
        },
        // database
        2: function(C) {
          return C.length > 0;
        },
        // username
        3: function(C) {
          return C.length > 0;
        },
        // password
        4: function(C) {
          return C.length > 0;
        }
      }, A = 0; A < d.length; A += 1) {
        var x = w[A], B = _[d[A]] || "", Q = x(B);
        if (!Q)
          return !1;
      }
      return !0;
    };
  }(ve)), ve.exports;
}
var Xe;
function vn() {
  if (Xe)
    return J.exports;
  Xe = 1;
  var r = E, e = yn();
  return J.exports = function(t, s) {
    var n = e.getFileName();
    r.stat(n, function(i, o) {
      if (i || !e.usePgPass(o, n))
        return s(void 0);
      var u = r.createReadStream(n);
      e.getPassword(t, u, s);
    });
  }, J.exports.warnTo = e.warnTo, J.exports;
}
var _n = E.EventEmitter, et = re, we = es, wn = wt, gn = bt, Ct = ls, bn = te, Sn = Et;
const En = yt;
let Pt = class extends _n {
  constructor(e) {
    super(), this.connectionParameters = new gn(e), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(this, "password", {
      configurable: !0,
      enumerable: !1,
      writable: !0,
      value: this.connectionParameters.password
    }), this.replication = this.connectionParameters.replication;
    var t = e || {};
    this._Promise = t.Promise || H.Promise, this._types = new wn(t.types), this._ending = !1, this._ended = !1, this._connecting = !1, this._connected = !1, this._connectionError = !1, this._queryable = !0, this.connection = t.connection || new Sn({
      stream: t.stream,
      ssl: this.connectionParameters.ssl,
      keepAlive: t.keepAlive || !1,
      keepAliveInitialDelayMillis: t.keepAliveInitialDelayMillis || 0,
      encoding: this.connectionParameters.client_encoding || "utf8"
    }), this.queryQueue = [], this.binary = t.binary || bn.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || !1, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", {
      enumerable: !1
    }), this._connectionTimeoutMillis = t.connectionTimeoutMillis || 0;
  }
  _errorAllQueries(e) {
    const t = (s) => {
      process.nextTick(() => {
        s.handleError(e, this.connection);
      });
    };
    this.activeQuery && (t(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t), this.queryQueue.length = 0;
  }
  _connect(e) {
    var t = this, s = this.connection;
    if (this._connectionCallback = e, this._connecting || this._connected) {
      const n = new Error("Client has already been connected. You cannot reuse a client.");
      process.nextTick(() => {
        e(n);
      });
      return;
    }
    this._connecting = !0, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
      s._ending = !0, s.stream.destroy(new Error("timeout expired"));
    }, this._connectionTimeoutMillis)), this.host && this.host.indexOf("/") === 0 ? s.connect(this.host + "/.s.PGSQL." + this.port) : s.connect(this.port, this.host), s.on("connect", function() {
      t.ssl ? s.requestSsl() : s.startup(t.getStartupConf());
    }), s.on("sslconnect", function() {
      s.startup(t.getStartupConf());
    }), this._attachListeners(s), s.once("end", () => {
      const n = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
      clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(n), this._ended = !0, this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(n) : this._handleErrorEvent(n) : this._connectionError || this._handleErrorEvent(n)), process.nextTick(() => {
        this.emit("end");
      });
    });
  }
  connect(e) {
    if (e) {
      this._connect(e);
      return;
    }
    return new this._Promise((t, s) => {
      this._connect((n) => {
        n ? s(n) : t();
      });
    });
  }
  _attachListeners(e) {
    e.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e.on("authenticationSASL", this._handleAuthSASL.bind(this)), e.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e.on("backendKeyData", this._handleBackendKeyData.bind(this)), e.on("error", this._handleErrorEvent.bind(this)), e.on("errorMessage", this._handleErrorMessage.bind(this)), e.on("readyForQuery", this._handleReadyForQuery.bind(this)), e.on("notice", this._handleNotice.bind(this)), e.on("rowDescription", this._handleRowDescription.bind(this)), e.on("dataRow", this._handleDataRow.bind(this)), e.on("portalSuspended", this._handlePortalSuspended.bind(this)), e.on("emptyQuery", this._handleEmptyQuery.bind(this)), e.on("commandComplete", this._handleCommandComplete.bind(this)), e.on("parseComplete", this._handleParseComplete.bind(this)), e.on("copyInResponse", this._handleCopyInResponse.bind(this)), e.on("copyData", this._handleCopyData.bind(this)), e.on("notification", this._handleNotification.bind(this));
  }
  // TODO(bmc): deprecate pgpass "built in" integration since this.password can be a function
  // it can be supplied by the user if required - this is a breaking change!
  _checkPgPass(e) {
    const t = this.connection;
    if (typeof this.password == "function")
      this._Promise.resolve().then(() => this.password()).then((s) => {
        if (s !== void 0) {
          if (typeof s != "string") {
            t.emit("error", new TypeError("Password must be a string"));
            return;
          }
          this.connectionParameters.password = this.password = s;
        } else
          this.connectionParameters.password = this.password = null;
        e();
      }).catch((s) => {
        t.emit("error", s);
      });
    else if (this.password !== null)
      e();
    else
      try {
        vn()(this.connectionParameters, (n) => {
          n !== void 0 && (this.connectionParameters.password = this.password = n), e();
        });
      } catch (s) {
        this.emit("error", s);
      }
  }
  _handleAuthCleartextPassword(e) {
    this._checkPgPass(() => {
      this.connection.password(this.password);
    });
  }
  _handleAuthMD5Password(e) {
    this._checkPgPass(async () => {
      try {
        const t = await En.postgresMd5PasswordHash(this.user, this.password, e.salt);
        this.connection.password(t);
      } catch (t) {
        this.emit("error", t);
      }
    });
  }
  _handleAuthSASL(e) {
    this._checkPgPass(() => {
      try {
        this.saslSession = we.startSession(e.mechanisms), this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response);
      } catch (t) {
        this.connection.emit("error", t);
      }
    });
  }
  async _handleAuthSASLContinue(e) {
    try {
      await we.continueSession(this.saslSession, this.password, e.data), this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
    } catch (t) {
      this.connection.emit("error", t);
    }
  }
  _handleAuthSASLFinal(e) {
    try {
      we.finalizeSession(this.saslSession, e.data), this.saslSession = null;
    } catch (t) {
      this.connection.emit("error", t);
    }
  }
  _handleBackendKeyData(e) {
    this.processID = e.processID, this.secretKey = e.secretKey;
  }
  _handleReadyForQuery(e) {
    this._connecting && (this._connecting = !1, this._connected = !0, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
    const { activeQuery: t } = this;
    this.activeQuery = null, this.readyForQuery = !0, t && t.handleReadyForQuery(this.connection), this._pulseQueryQueue();
  }
  // if we receieve an error event or error message
  // during the connection process we handle it here
  _handleErrorWhileConnecting(e) {
    if (!this._connectionError) {
      if (this._connectionError = !0, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback)
        return this._connectionCallback(e);
      this.emit("error", e);
    }
  }
  // if we're connected and we receive an error event from the connection
  // this means the socket is dead - do a hard abort of all queries and emit
  // the socket error on the client as well
  _handleErrorEvent(e) {
    if (this._connecting)
      return this._handleErrorWhileConnecting(e);
    this._queryable = !1, this._errorAllQueries(e), this.emit("error", e);
  }
  // handle error messages from the postgres backend
  _handleErrorMessage(e) {
    if (this._connecting)
      return this._handleErrorWhileConnecting(e);
    const t = this.activeQuery;
    if (!t) {
      this._handleErrorEvent(e);
      return;
    }
    this.activeQuery = null, t.handleError(e, this.connection);
  }
  _handleRowDescription(e) {
    this.activeQuery.handleRowDescription(e);
  }
  _handleDataRow(e) {
    this.activeQuery.handleDataRow(e);
  }
  _handlePortalSuspended(e) {
    this.activeQuery.handlePortalSuspended(this.connection);
  }
  _handleEmptyQuery(e) {
    this.activeQuery.handleEmptyQuery(this.connection);
  }
  _handleCommandComplete(e) {
    this.activeQuery.handleCommandComplete(e, this.connection);
  }
  _handleParseComplete(e) {
    this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
  }
  _handleCopyInResponse(e) {
    this.activeQuery.handleCopyInResponse(this.connection);
  }
  _handleCopyData(e) {
    this.activeQuery.handleCopyData(e, this.connection);
  }
  _handleNotification(e) {
    this.emit("notification", e);
  }
  _handleNotice(e) {
    this.emit("notice", e);
  }
  getStartupConf() {
    var e = this.connectionParameters, t = {
      user: e.user,
      database: e.database
    }, s = e.application_name || e.fallback_application_name;
    return s && (t.application_name = s), e.replication && (t.replication = "" + e.replication), e.statement_timeout && (t.statement_timeout = String(parseInt(e.statement_timeout, 10))), e.lock_timeout && (t.lock_timeout = String(parseInt(e.lock_timeout, 10))), e.idle_in_transaction_session_timeout && (t.idle_in_transaction_session_timeout = String(parseInt(e.idle_in_transaction_session_timeout, 10))), e.options && (t.options = e.options), t;
  }
  cancel(e, t) {
    if (e.activeQuery === t) {
      var s = this.connection;
      this.host && this.host.indexOf("/") === 0 ? s.connect(this.host + "/.s.PGSQL." + this.port) : s.connect(this.port, this.host), s.on("connect", function() {
        s.cancel(e.processID, e.secretKey);
      });
    } else
      e.queryQueue.indexOf(t) !== -1 && e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
  }
  setTypeParser(e, t, s) {
    return this._types.setTypeParser(e, t, s);
  }
  getTypeParser(e, t) {
    return this._types.getTypeParser(e, t);
  }
  // escapeIdentifier and escapeLiteral moved to utility functions & exported
  // on PG
  // re-exported here for backwards compatibility
  escapeIdentifier(e) {
    return et.escapeIdentifier(e);
  }
  escapeLiteral(e) {
    return et.escapeLiteral(e);
  }
  _pulseQueryQueue() {
    if (this.readyForQuery === !0)
      if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
        this.readyForQuery = !1, this.hasExecuted = !0;
        const e = this.activeQuery.submit(this.connection);
        e && process.nextTick(() => {
          this.activeQuery.handleError(e, this.connection), this.readyForQuery = !0, this._pulseQueryQueue();
        });
      } else
        this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
  }
  query(e, t, s) {
    var n, i, o, u, h;
    if (e == null)
      throw new TypeError("Client was passed a null or undefined query");
    return typeof e.submit == "function" ? (o = e.query_timeout || this.connectionParameters.query_timeout, i = n = e, typeof t == "function" && (n.callback = n.callback || t)) : (o = this.connectionParameters.query_timeout, n = new Ct(e, t, s), n.callback || (i = new this._Promise((l, a) => {
      n.callback = (c, f) => c ? a(c) : l(f);
    }).catch((l) => {
      throw Error.captureStackTrace(l), l;
    }))), o && (h = n.callback, u = setTimeout(() => {
      var l = new Error("Query read timeout");
      process.nextTick(() => {
        n.handleError(l, this.connection);
      }), h(l), n.callback = () => {
      };
      var a = this.queryQueue.indexOf(n);
      a > -1 && this.queryQueue.splice(a, 1), this._pulseQueryQueue();
    }, o), n.callback = (l, a) => {
      clearTimeout(u), h(l, a);
    }), this.binary && !n.binary && (n.binary = !0), n._result && !n._result._types && (n._result._types = this._types), this._queryable ? this._ending ? (process.nextTick(() => {
      n.handleError(new Error("Client was closed and is not queryable"), this.connection);
    }), i) : (this.queryQueue.push(n), this._pulseQueryQueue(), i) : (process.nextTick(() => {
      n.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
    }), i);
  }
  ref() {
    this.connection.ref();
  }
  unref() {
    this.connection.unref();
  }
  end(e) {
    if (this._ending = !0, !this.connection._connecting || this._ended)
      if (e)
        e();
      else
        return this._Promise.resolve();
    if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), e)
      this.connection.once("end", e);
    else
      return new this._Promise((t) => {
        this.connection.once("end", t);
      });
  }
};
Pt.Query = Ct;
var Cn = Pt, ge, tt;
function Pn() {
  if (tt)
    return ge;
  tt = 1;
  const r = E.EventEmitter, e = function() {
  }, t = (l, a) => {
    const c = l.findIndex(a);
    return c === -1 ? void 0 : l.splice(c, 1)[0];
  };
  class s {
    constructor(a, c, f) {
      this.client = a, this.idleListener = c, this.timeoutId = f;
    }
  }
  class n {
    constructor(a) {
      this.callback = a;
    }
  }
  function i() {
    throw new Error("Release called on client which has already been released to the pool.");
  }
  function o(l, a) {
    if (a)
      return { callback: a, result: void 0 };
    let c, f;
    const d = function(y, v) {
      y ? c(y) : f(v);
    }, m = new l(function(y, v) {
      f = y, c = v;
    }).catch((y) => {
      throw Error.captureStackTrace(y), y;
    });
    return { callback: d, result: m };
  }
  function u(l, a) {
    return function c(f) {
      f.client = a, a.removeListener("error", c), a.on("error", () => {
        l.log("additional client error after disconnection due to error", f);
      }), l._remove(a), l.emit("error", f, a);
    };
  }
  class h extends r {
    constructor(a, c) {
      super(), this.options = Object.assign({}, a), a != null && "password" in a && Object.defineProperty(this.options, "password", {
        configurable: !0,
        enumerable: !1,
        writable: !0,
        value: a.password
      }), a != null && a.ssl && a.ssl.key && Object.defineProperty(this.options.ssl, "key", {
        enumerable: !1
      }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || !1, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
      }, this.Client = this.options.Client || c || Mt().Client, this.Promise = this.options.Promise || H.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = !1, this.ended = !1;
    }
    _isFull() {
      return this._clients.length >= this.options.max;
    }
    _pulseQueue() {
      if (this.log("pulse queue"), this.ended) {
        this.log("pulse queue ended");
        return;
      }
      if (this.ending) {
        this.log("pulse queue on ending"), this._idle.length && this._idle.slice().map((c) => {
          this._remove(c.client);
        }), this._clients.length || (this.ended = !0, this._endCallback());
        return;
      }
      if (!this._pendingQueue.length) {
        this.log("no queued requests");
        return;
      }
      if (!this._idle.length && this._isFull())
        return;
      const a = this._pendingQueue.shift();
      if (this._idle.length) {
        const c = this._idle.pop();
        clearTimeout(c.timeoutId);
        const f = c.client;
        f.ref && f.ref();
        const d = c.idleListener;
        return this._acquireClient(f, a, d, !1);
      }
      if (!this._isFull())
        return this.newClient(a);
      throw new Error("unexpected condition");
    }
    _remove(a) {
      const c = t(this._idle, (f) => f.client === a);
      c !== void 0 && clearTimeout(c.timeoutId), this._clients = this._clients.filter((f) => f !== a), a.end(), this.emit("remove", a);
    }
    connect(a) {
      if (this.ending) {
        const d = new Error("Cannot use a pool after calling end on the pool");
        return a ? a(d) : this.Promise.reject(d);
      }
      const c = o(this.Promise, a), f = c.result;
      if (this._isFull() || this._idle.length) {
        if (this._idle.length && process.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis)
          return this._pendingQueue.push(new n(c.callback)), f;
        const d = (v, R, P) => {
          clearTimeout(y), c.callback(v, R, P);
        }, m = new n(d), y = setTimeout(() => {
          t(this._pendingQueue, (v) => v.callback === d), m.timedOut = !0, c.callback(new Error("timeout exceeded when trying to connect"));
        }, this.options.connectionTimeoutMillis);
        return this._pendingQueue.push(m), f;
      }
      return this.newClient(new n(c.callback)), f;
    }
    newClient(a) {
      const c = new this.Client(this.options);
      this._clients.push(c);
      const f = u(this, c);
      this.log("checking client timeout");
      let d, m = !1;
      this.options.connectionTimeoutMillis && (d = setTimeout(() => {
        this.log("ending client due to timeout"), m = !0, c.connection ? c.connection.stream.destroy() : c.end();
      }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), c.connect((y) => {
        if (d && clearTimeout(d), c.on("error", f), y)
          this.log("client failed to connect", y), this._clients = this._clients.filter((v) => v !== c), m && (y.message = "Connection terminated due to connection timeout"), this._pulseQueue(), a.timedOut || a.callback(y, void 0, e);
        else {
          if (this.log("new client connected"), this.options.maxLifetimeSeconds !== 0) {
            const v = setTimeout(() => {
              this.log("ending client due to expired lifetime"), this._expired.add(c), this._idle.findIndex((P) => P.client === c) !== -1 && this._acquireClient(
                c,
                new n((P, Y, _) => _()),
                f,
                !1
              );
            }, this.options.maxLifetimeSeconds * 1e3);
            v.unref(), c.once("end", () => clearTimeout(v));
          }
          return this._acquireClient(c, a, f, !0);
        }
      });
    }
    // acquire a client for a pending work item
    _acquireClient(a, c, f, d) {
      d && this.emit("connect", a), this.emit("acquire", a), a.release = this._releaseOnce(a, f), a.removeListener("error", f), c.timedOut ? d && this.options.verify ? this.options.verify(a, a.release) : a.release() : d && this.options.verify ? this.options.verify(a, (m) => {
        if (m)
          return a.release(m), c.callback(m, void 0, e);
        c.callback(void 0, a, a.release);
      }) : c.callback(void 0, a, a.release);
    }
    // returns a function that wraps _release and throws if called more than once
    _releaseOnce(a, c) {
      let f = !1;
      return (d) => {
        f && i(), f = !0, this._release(a, c, d);
      };
    }
    // release a client back to the poll, include an error
    // to remove it from the pool
    _release(a, c, f) {
      if (a.on("error", c), a._poolUseCount = (a._poolUseCount || 0) + 1, this.emit("release", f, a), f || this.ending || !a._queryable || a._ending || a._poolUseCount >= this.options.maxUses) {
        a._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(a), this._pulseQueue();
        return;
      }
      if (this._expired.has(a)) {
        this.log("remove expired client"), this._expired.delete(a), this._remove(a), this._pulseQueue();
        return;
      }
      let m;
      this.options.idleTimeoutMillis && (m = setTimeout(() => {
        this.log("remove idle client"), this._remove(a);
      }, this.options.idleTimeoutMillis), this.options.allowExitOnIdle && m.unref()), this.options.allowExitOnIdle && a.unref(), this._idle.push(new s(a, c, m)), this._pulseQueue();
    }
    query(a, c, f) {
      if (typeof a == "function") {
        const m = o(this.Promise, a);
        return setImmediate(function() {
          return m.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
        }), m.result;
      }
      typeof c == "function" && (f = c, c = void 0);
      const d = o(this.Promise, f);
      return f = d.callback, this.connect((m, y) => {
        if (m)
          return f(m);
        let v = !1;
        const R = (P) => {
          v || (v = !0, y.release(P), f(P));
        };
        y.once("error", R), this.log("dispatching query");
        try {
          y.query(a, c, (P, Y) => {
            if (this.log("query dispatched"), y.removeListener("error", R), !v)
              return v = !0, y.release(P), P ? f(P) : f(void 0, Y);
          });
        } catch (P) {
          return y.release(P), f(P);
        }
      }), d.result;
    }
    end(a) {
      if (this.log("ending"), this.ending) {
        const f = new Error("Called end on pool more than once");
        return a ? a(f) : this.Promise.reject(f);
      }
      this.ending = !0;
      const c = o(this.Promise, a);
      return this._endCallback = c.callback, this._pulseQueue(), c.result;
    }
    get waitingCount() {
      return this._pendingQueue.length;
    }
    get idleCount() {
      return this._idle.length;
    }
    get expiredCount() {
      return this._clients.reduce((a, c) => a + (this._expired.has(c) ? 1 : 0), 0);
    }
    get totalCount() {
      return this._clients.length;
    }
  }
  return ge = h, ge;
}
var be = { exports: {} };
const Mn = {}, Tn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Mn
}, Symbol.toStringTag, { value: "Module" })), Rn = /* @__PURE__ */ Ae(Tn);
var Se = { exports: {} }, rt;
function An() {
  if (rt)
    return Se.exports;
  rt = 1;
  var r = E.EventEmitter, e = E, t = re, s = Se.exports = function(i, o, u) {
    r.call(this), i = t.normalizeQueryConfig(i, o, u), this.text = i.text, this.values = i.values, this.name = i.name, this.callback = i.callback, this.state = "new", this._arrayMode = i.rowMode === "array", this._emitRowEvents = !1, this.on(
      "newListener",
      (function(h) {
        h === "row" && (this._emitRowEvents = !0);
      }).bind(this)
    );
  };
  e.inherits(s, r);
  var n = {
    /* eslint-disable quote-props */
    sqlState: "code",
    statementPosition: "position",
    messagePrimary: "message",
    context: "where",
    schemaName: "schema",
    tableName: "table",
    columnName: "column",
    dataTypeName: "dataType",
    constraintName: "constraint",
    sourceFile: "file",
    sourceLine: "line",
    sourceFunction: "routine"
  };
  return s.prototype.handleError = function(i) {
    var o = this.native.pq.resultErrorFields();
    if (o)
      for (var u in o) {
        var h = n[u] || u;
        i[h] = o[u];
      }
    this.callback ? this.callback(i) : this.emit("error", i), this.state = "error";
  }, s.prototype.then = function(i, o) {
    return this._getPromise().then(i, o);
  }, s.prototype.catch = function(i) {
    return this._getPromise().catch(i);
  }, s.prototype._getPromise = function() {
    return this._promise ? this._promise : (this._promise = new Promise(
      (function(i, o) {
        this._once("end", i), this._once("error", o);
      }).bind(this)
    ), this._promise);
  }, s.prototype.submit = function(i) {
    this.state = "running";
    var o = this;
    this.native = i.native, i.native.arrayMode = this._arrayMode;
    var u = function(a, c, f) {
      if (i.native.arrayMode = !1, setImmediate(function() {
        o.emit("_done");
      }), a)
        return o.handleError(a);
      o._emitRowEvents && (f.length > 1 ? c.forEach((d, m) => {
        d.forEach((y) => {
          o.emit("row", y, f[m]);
        });
      }) : c.forEach(function(d) {
        o.emit("row", d, f);
      })), o.state = "end", o.emit("end", f), o.callback && o.callback(null, f);
    };
    if (process.domain && (u = process.domain.bind(u)), this.name) {
      this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", this.name, this.name.length), console.error("This can cause conflicts and silent errors executing queries"));
      var h = (this.values || []).map(t.prepareValue);
      if (i.namedQueries[this.name]) {
        if (this.text && i.namedQueries[this.name] !== this.text) {
          const a = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
          return u(a);
        }
        return i.native.execute(this.name, h, u);
      }
      return i.native.prepare(this.name, this.text, h.length, function(a) {
        return a ? u(a) : (i.namedQueries[o.name] = o.text, o.native.execute(o.name, h, u));
      });
    } else if (this.values) {
      if (!Array.isArray(this.values)) {
        const a = new Error("Query values must be an array");
        return u(a);
      }
      var l = this.values.map(t.prepareValue);
      i.native.query(this.text, l, u);
    } else
      i.native.query(this.text, u);
  }, Se.exports;
}
var st;
function xn() {
  if (st)
    return be.exports;
  st = 1;
  var r;
  try {
    r = Rn;
  } catch (u) {
    throw u;
  }
  var e = wt, t = E.EventEmitter, s = E, n = bt, i = An(), o = be.exports = function(u) {
    t.call(this), u = u || {}, this._Promise = u.Promise || H.Promise, this._types = new e(u.types), this.native = new r({
      types: this._types
    }), this._queryQueue = [], this._ending = !1, this._connecting = !1, this._connected = !1, this._queryable = !0;
    var h = this.connectionParameters = new n(u);
    u.nativeConnectionString && (h.nativeConnectionString = u.nativeConnectionString), this.user = h.user, Object.defineProperty(this, "password", {
      configurable: !0,
      enumerable: !1,
      writable: !0,
      value: h.password
    }), this.database = h.database, this.host = h.host, this.port = h.port, this.namedQueries = {};
  };
  return o.Query = i, s.inherits(o, t), o.prototype._errorAllQueries = function(u) {
    const h = (l) => {
      process.nextTick(() => {
        l.native = this.native, l.handleError(u);
      });
    };
    this._hasActiveQuery() && (h(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(h), this._queryQueue.length = 0;
  }, o.prototype._connect = function(u) {
    var h = this;
    if (this._connecting) {
      process.nextTick(() => u(new Error("Client has already been connected. You cannot reuse a client.")));
      return;
    }
    this._connecting = !0, this.connectionParameters.getLibpqConnectionString(function(l, a) {
      if (h.connectionParameters.nativeConnectionString && (a = h.connectionParameters.nativeConnectionString), l)
        return u(l);
      h.native.connect(a, function(c) {
        if (c)
          return h.native.end(), u(c);
        h._connected = !0, h.native.on("error", function(f) {
          h._queryable = !1, h._errorAllQueries(f), h.emit("error", f);
        }), h.native.on("notification", function(f) {
          h.emit("notification", {
            channel: f.relname,
            payload: f.extra
          });
        }), h.emit("connect"), h._pulseQueryQueue(!0), u();
      });
    });
  }, o.prototype.connect = function(u) {
    if (u) {
      this._connect(u);
      return;
    }
    return new this._Promise((h, l) => {
      this._connect((a) => {
        a ? l(a) : h();
      });
    });
  }, o.prototype.query = function(u, h, l) {
    var a, c, f, d, m;
    if (u == null)
      throw new TypeError("Client was passed a null or undefined query");
    if (typeof u.submit == "function")
      f = u.query_timeout || this.connectionParameters.query_timeout, c = a = u, typeof h == "function" && (u.callback = h);
    else if (f = this.connectionParameters.query_timeout, a = new i(u, h, l), !a.callback) {
      let y, v;
      c = new this._Promise((R, P) => {
        y = R, v = P;
      }).catch((R) => {
        throw Error.captureStackTrace(R), R;
      }), a.callback = (R, P) => R ? v(R) : y(P);
    }
    return f && (m = a.callback, d = setTimeout(() => {
      var y = new Error("Query read timeout");
      process.nextTick(() => {
        a.handleError(y, this.connection);
      }), m(y), a.callback = () => {
      };
      var v = this._queryQueue.indexOf(a);
      v > -1 && this._queryQueue.splice(v, 1), this._pulseQueryQueue();
    }, f), a.callback = (y, v) => {
      clearTimeout(d), m(y, v);
    }), this._queryable ? this._ending ? (a.native = this.native, process.nextTick(() => {
      a.handleError(new Error("Client was closed and is not queryable"));
    }), c) : (this._queryQueue.push(a), this._pulseQueryQueue(), c) : (a.native = this.native, process.nextTick(() => {
      a.handleError(new Error("Client has encountered a connection error and is not queryable"));
    }), c);
  }, o.prototype.end = function(u) {
    var h = this;
    this._ending = !0, this._connected || this.once("connect", this.end.bind(this, u));
    var l;
    return u || (l = new this._Promise(function(a, c) {
      u = (f) => f ? c(f) : a();
    })), this.native.end(function() {
      h._errorAllQueries(new Error("Connection terminated")), process.nextTick(() => {
        h.emit("end"), u && u();
      });
    }), l;
  }, o.prototype._hasActiveQuery = function() {
    return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
  }, o.prototype._pulseQueryQueue = function(u) {
    if (this._connected && !this._hasActiveQuery()) {
      var h = this._queryQueue.shift();
      if (!h) {
        u || this.emit("drain");
        return;
      }
      this._activeQuery = h, h.submit(this);
      var l = this;
      h.once("_done", function() {
        l._pulseQueryQueue();
      });
    }
  }, o.prototype.cancel = function(u) {
    this._activeQuery === u ? this.native.cancel(function() {
    }) : this._queryQueue.indexOf(u) !== -1 && this._queryQueue.splice(this._queryQueue.indexOf(u), 1);
  }, o.prototype.ref = function() {
  }, o.prototype.unref = function() {
  }, o.prototype.setTypeParser = function(u, h, l) {
    return this._types.setTypeParser(u, h, l);
  }, o.prototype.getTypeParser = function(u, h) {
    return this._types.getTypeParser(u, h);
  }, be.exports;
}
var Ee, nt;
function it() {
  return nt || (nt = 1, Ee = xn()), Ee;
}
var at;
function Mt() {
  return at || (at = 1, function(r) {
    var e = Cn, t = te, s = Et, n = Pn();
    const { DatabaseError: i } = Le, { escapeIdentifier: o, escapeLiteral: u } = re, h = (a) => class extends n {
      constructor(f) {
        super(f, a);
      }
    };
    var l = function(a) {
      this.defaults = t, this.Client = a, this.Query = this.Client.Query, this.Pool = h(this.Client), this._pools = [], this.Connection = s, this.types = q, this.DatabaseError = i, this.escapeIdentifier = o, this.escapeLiteral = u;
    };
    typeof process.env.NODE_PG_FORCE_NATIVE < "u" ? r.exports = new l(it()) : (r.exports = new l(e), Object.defineProperty(r.exports, "native", {
      configurable: !0,
      enumerable: !1,
      get() {
        var a = null;
        try {
          a = new l(it());
        } catch (c) {
          if (c.code !== "MODULE_NOT_FOUND")
            throw c;
        }
        return Object.defineProperty(r.exports, "native", {
          value: a
        }), a;
      }
    }));
  }(he)), he.exports;
}
var In = Mt();
const On = /* @__PURE__ */ Dt(In), { Client: kn } = On, Ln = new kt();
class $n {
  constructor(e, t) {
    this.inTransaction = !1, this.patchesDir = t, this.dbh = new kn(e);
  }
  async connect() {
    await this.dbh.connect();
  }
  async close() {
    await this.dbh.end();
  }
  async patch(e = !0) {
    await this.run("CREATE TABLE IF NOT EXISTS public.db_patches ( id TEXT PRIMARY KEY);", []);
    const t = Ce.readdirSync(this.patchesDir), s = (await this.getMany("public.db_patches")).map((n) => n.id);
    for (const n of t) {
      if (s.includes(n)) {
        e && console.info(`➡ skipping already applied db patch: ${n}`);
        continue;
      }
      const o = Ce.readFileSync(`${this.patchesDir}/${n}`, "utf-8").split(";").map((u) => u.trim()).filter((u) => !!u);
      try {
        try {
          await this.run("BEGIN");
          for (const u of o)
            await this.run(u);
          await this.run("COMMIT");
        } catch (u) {
          throw await this.run("ROLLBACK"), u;
        }
        await this.insert("public.db_patches", { id: n }), console.info(`✓ applied db patch: ${n}`);
      } catch (u) {
        console.error(`✖ unable to apply patch: ${n} ${u}`);
        return;
      }
    }
  }
  _buildWhere(e, t = 1) {
    const s = [], n = [];
    for (const i of Object.keys(e)) {
      if (e[i] === null) {
        s.push(i + " IS NULL");
        continue;
      }
      if (typeof e[i] == "object") {
        for (const o of Object.keys(e[i])) {
          if (o === "$nin") {
            e[i][o].length > 0 ? (s.push(i + " NOT IN (" + e[i][o].map(() => `$${t++}`) + ")"), n.push(...e[i][o])) : s.push("TRUE");
            continue;
          }
          if (o === "$in") {
            e[i][o].length > 0 ? (s.push(i + " IN (" + e[i][o].map(() => `$${t++}`) + ")"), n.push(...e[i][o])) : s.push("FALSE");
            continue;
          }
          if (o === "$gte") {
            s.push(i + ` >= $${t++}`), n.push(e[i][o]);
            continue;
          }
          if (o === "$lte") {
            s.push(i + ` <= $${t++}`), n.push(e[i][o]);
            continue;
          }
          if (o === "$gt") {
            s.push(i + ` > $${t++}`), n.push(e[i][o]);
            continue;
          }
          if (o === "$lt") {
            s.push(i + ` < $${t++}`), n.push(e[i][o]);
            continue;
          }
          if (o === "$ne") {
            e[i][o] === null ? s.push(i + " IS NOT NULL") : (s.push(i + ` != $${t++}`), n.push(e[i][o]));
            continue;
          }
          if (o === "$ilike") {
            s.push(i + ` ilike $${t++}`), n.push(e[i][o]);
            continue;
          }
          throw new Error("not implemented: " + o + " " + JSON.stringify(e[i]));
        }
        continue;
      }
      s.push(i + ` = $${t++}`), n.push(e[i]);
    }
    return {
      sql: s.length > 0 ? " WHERE " + s.join(" AND ") : "",
      values: n,
      $i: t
    };
  }
  _buildOrderBy(e) {
    const t = [];
    for (const s of e) {
      const n = Object.keys(s)[0];
      t.push(n + " " + (s[n] > 0 ? "ASC" : "DESC"));
    }
    return t.length > 0 ? " ORDER BY " + t.join(", ") : "";
  }
  _buildLimit(e) {
    const t = [], s = parseInt(`${e.limit}`, 10), n = parseInt(`${e.offset}`, 10);
    return s >= 0 && t.push(` LIMIT ${s}`), n >= 0 && t.push(` OFFSET ${n}`), t.join("");
  }
  async _get(e, t = []) {
    try {
      return (await this.dbh.query(e, t)).rows[0] || null;
    } catch (s) {
      throw console.info("_get", e, t), console.error(s), s;
    }
  }
  async txn(e) {
    if (this.inTransaction)
      return await e();
    this.inTransaction = !0;
    const t = await Ln.runExclusive(async () => {
      await this.dbh.query("BEGIN");
      try {
        const s = await e();
        return await this.dbh.query("COMMIT"), s;
      } catch (s) {
        return await this.dbh.query("ROLLBACK"), console.error(s), null;
      }
    });
    return this.inTransaction = !1, t;
  }
  async run(e, t = []) {
    try {
      return await this.dbh.query(e, t);
    } catch (s) {
      throw console.info("run", e, t), console.error(s), s;
    }
  }
  async _getMany(e, t = []) {
    try {
      return (await this.dbh.query(e, t)).rows || [];
    } catch (s) {
      throw console.info("_getMany", e, t), console.error(s), s;
    }
  }
  async get(e, t = {}, s = []) {
    const n = this._buildWhere(t), i = this._buildOrderBy(s), o = "SELECT * FROM " + e + n.sql + i;
    return await this._get(o, n.values);
  }
  async getMany(e, t = {}, s = [], n = { offset: -1, limit: -1 }) {
    const i = this._buildWhere(t), o = this._buildOrderBy(s), u = this._buildLimit(n), h = "SELECT * FROM " + e + i.sql + o + u;
    return await this._getMany(h, i.values);
  }
  async count(e, t = {}) {
    const s = this._buildWhere(t), n = "SELECT COUNT(*)::int AS count FROM " + e + s.sql, i = await this._get(n, s.values);
    return (i == null ? void 0 : i.count) || 0;
  }
  async delete(e, t = {}) {
    const s = this._buildWhere(t), n = "DELETE FROM " + e + s.sql;
    return await this.run(n, s.values);
  }
  async exists(e, t) {
    return !!await this.get(e, t);
  }
  async upsert(e, t, s, n = null) {
    return this.txn(async () => await this.exists(e, s) ? (await this.update(e, t, s), n === null ? 0 : (await this.get(e, s))[n]) : await this.insert(e, t, n));
  }
  async insert(e, t, s = null) {
    const n = Object.keys(t), i = n.map((h) => t[h]);
    let o = 1, u = "INSERT INTO " + e + " (" + n.join(",") + ") VALUES (" + n.map(() => `$${o++}`).join(",") + ")";
    return s ? (u += ` RETURNING ${s}`, (await this.run(u, i)).rows[0][s]) : (await this.run(u, i), 0);
  }
  async update(e, t, s = {}) {
    const n = Object.keys(t);
    if (n.length === 0)
      return;
    let i = 1;
    const o = n.map((a) => t[a]), u = " SET " + n.map((a) => `${a} = $${i++}`).join(","), h = this._buildWhere(s, i), l = "UPDATE " + e + u + h.sql;
    await this.run(l, [...o, ...h.values]);
  }
}
export {
  $n as default
};
