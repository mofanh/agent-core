'use strict';

var child_process = require('child_process');
var events = require('events');
var index_js = require('@modelcontextprotocol/sdk/client/index.js');
var stdio_js = require('@modelcontextprotocol/sdk/client/stdio.js');
var url = require('url');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var fs$1 = require('fs/promises');
var index_js$1 = require('@modelcontextprotocol/sdk/server/index.js');
var stdio_js$1 = require('@modelcontextprotocol/sdk/server/stdio.js');
var types_js = require('@modelcontextprotocol/sdk/types.js');

function _OverloadYield(e, d) {
  this.v = e, this.k = d;
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _asyncIterator(r) {
  var n,
    t,
    o,
    e = 2;
  for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
    if (t && null != (n = r[t])) return n.call(r);
    if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
    t = "@@asyncIterator", o = "@@iterator";
  }
  throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(r) {
  function AsyncFromSyncIteratorContinuation(r) {
    if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
    var n = r.done;
    return Promise.resolve(r.value).then(function (r) {
      return {
        value: r,
        done: n
      };
    });
  }
  return AsyncFromSyncIterator = function (r) {
    this.s = r, this.n = r.next;
  }, AsyncFromSyncIterator.prototype = {
    s: null,
    n: null,
    next: function () {
      return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
    },
    return: function (r) {
      var n = this.s.return;
      return void 0 === n ? Promise.resolve({
        value: r,
        done: true
      }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
    },
    throw: function (r) {
      var n = this.s.return;
      return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
    }
  }, new AsyncFromSyncIterator(r);
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _awaitAsyncGenerator(e) {
  return new _OverloadYield(e, 0);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _get() {
  return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = _superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return _regeneratorDefine(u, "_invoke", function (r, n, o) {
      var i,
        c,
        u,
        f = 0,
        p = o || [],
        y = false,
        G = {
          p: 0,
          n: 0,
          v: e,
          a: d,
          f: d.bind(e, 4),
          d: function (t, r) {
            return i = t, c = 0, u = e, G.n = r, a;
          }
        };
      function d(r, n) {
        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
          var o,
            i = p[t],
            d = G.p,
            l = i[2];
          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
        }
        if (o || r > 1) return a;
        throw y = true, n;
      }
      return function (o, p, l) {
        if (f > 1) throw TypeError("Generator is already running");
        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
          try {
            if (f = 2, i) {
              if (c || (o = "next"), t = i[o]) {
                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u = t.value, c < 2 && (c = 0);
              } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
              i = e;
            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
          } catch (t) {
            i = e, c = 1, u = t;
          } finally {
            f = 1;
          }
        }
        return {
          value: t,
          done: y
        };
      };
    }(r, o, i), true), u;
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function () {
      return this;
    }), t),
    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function () {
    return this;
  }), _regeneratorDefine(u, "toString", function () {
    return "[object Generator]";
  }), (_regenerator = function () {
    return {
      w: i,
      m: f
    };
  })();
}
function _regeneratorDefine(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  _regeneratorDefine = function (e, r, n, t) {
    function o(r, n) {
      _regeneratorDefine(e, r, function (e) {
        return this._invoke(r, n, e);
      });
    }
    r ? i ? i(e, r, {
      value: n,
      enumerable: !t,
      configurable: !t,
      writable: !t
    }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
  }, _regeneratorDefine(e, r, n, t);
}
function _regeneratorValues(e) {
  if (null != e) {
    var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"],
      r = 0;
    if (t) return t.call(e);
    if ("function" == typeof e.next) return e;
    if (!isNaN(e.length)) return {
      next: function () {
        return e && r >= e.length && (e = void 0), {
          value: e && e[r++],
          done: !e
        };
      }
    };
  }
  throw new TypeError(typeof e + " is not iterable");
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
  return t;
}
function _superPropGet(t, o, e, r) {
  var p = _get(_getPrototypeOf(t.prototype ), o, e);
  return 2 & r && "function" == typeof p ? function (t) {
    return p.apply(e, t);
  } : p;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapAsyncGenerator(e) {
  return function () {
    return new AsyncGenerator(e.apply(this, arguments));
  };
}
function AsyncGenerator(e) {
  var r, t;
  function resume(r, t) {
    try {
      var n = e[r](t),
        o = n.value,
        u = o instanceof _OverloadYield;
      Promise.resolve(u ? o.v : o).then(function (t) {
        if (u) {
          var i = "return" === r ? "return" : "next";
          if (!o.k || t.done) return resume(i, t);
          t = e[i](t).value;
        }
        settle(n.done ? "return" : "normal", t);
      }, function (e) {
        resume("throw", e);
      });
    } catch (e) {
      settle("throw", e);
    }
  }
  function settle(e, n) {
    switch (e) {
      case "return":
        r.resolve({
          value: n,
          done: true
        });
        break;
      case "throw":
        r.reject(n);
        break;
      default:
        r.resolve({
          value: n,
          done: false
        });
    }
    (r = r.next) ? resume(r.key, r.arg) : t = null;
  }
  this._invoke = function (e, n) {
    return new Promise(function (o, u) {
      var i = {
        key: e,
        arg: n,
        resolve: o,
        reject: u,
        next: null
      };
      t ? t = t.next = i : (r = t = i, resume(e, n));
    });
  }, "function" != typeof e.return && (this.return = void 0);
}
AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () {
  return this;
}, AsyncGenerator.prototype.next = function (e) {
  return this._invoke("next", e);
}, AsyncGenerator.prototype.throw = function (e) {
  return this._invoke("throw", e);
}, AsyncGenerator.prototype.return = function (e) {
  return this._invoke("return", e);
};

/**
 * 发起 LLM 流式请求
 * @param {object} options
 * @param {function} options.requestImpl - 外部注入的请求实现 (必须返回 AsyncIterable/ReadableStream)
 * @param {any} options.payload - 请求参数
 * @returns {AsyncGenerator} - 返回流式响应
 */
function llmStreamRequest(_x) {
  return _llmStreamRequest.apply(this, arguments);
}
function _llmStreamRequest() {
  _llmStreamRequest = _wrapAsyncGenerator(function (_ref) {
    var requestImpl = _ref.requestImpl,
      payload = _ref.payload;
    return /*#__PURE__*/_regenerator().m(function _callee() {
      var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (!(typeof requestImpl !== 'function')) {
              _context.n = 1;
              break;
            }
            throw new Error('llmStreamRequest 需要外部传入 requestImpl 实现');
          case 1:
            // 假设 requestImpl 返回 AsyncIterable
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context.p = 2;
            _iterator = _asyncIterator(requestImpl(payload));
          case 3:
            _context.n = 4;
            return _awaitAsyncGenerator(_iterator.next());
          case 4:
            if (!(_iteratorAbruptCompletion = !(_step = _context.v).done)) {
              _context.n = 6;
              break;
            }
            chunk = _step.value;
            _context.n = 5;
            return chunk;
          case 5:
            _iteratorAbruptCompletion = false;
            _context.n = 3;
            break;
          case 6:
            _context.n = 8;
            break;
          case 7:
            _context.p = 7;
            _t = _context.v;
            _didIteratorError = true;
            _iteratorError = _t;
          case 8:
            _context.p = 8;
            _context.p = 9;
            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context.n = 10;
              break;
            }
            _context.n = 10;
            return _awaitAsyncGenerator(_iterator["return"]());
          case 10:
            _context.p = 10;
            if (!_didIteratorError) {
              _context.n = 11;
              break;
            }
            throw _iteratorError;
          case 11:
            return _context.f(10);
          case 12:
            return _context.f(8);
          case 13:
            return _context.a(2);
        }
      }, _callee, null, [[9,, 10, 12], [2, 7, 8, 13]]);
    })();
  });
  return _llmStreamRequest.apply(this, arguments);
}

/**
 * LLM 可扩展库
 * 支持多种 LLM 服务提供商的统一接口
 */
var LLM = /*#__PURE__*/function () {
  /**
   * 构造函数
   * @param {object} config - LLM 配置
   * @param {function} config.requestHandler - 请求处理函数
   * @param {function} [config.connectionChecker] - 连接检查函数
   * @param {string} [config.provider] - 服务提供商名称
   * @param {object} [config.options] - 额外配置选项
   */
  function LLM(config) {
    _classCallCheck(this, LLM);
    if (!config || typeof config.requestHandler !== 'function') {
      throw new Error('必须提供 requestHandler 函数');
    }
    this.provider = config.provider || 'unknown';
    this.requestHandler = config.requestHandler;
    this.connectionChecker = config.connectionChecker || this._defaultConnectionChecker.bind(this);
    this.options = config.options || {};
    this.isConnected = false;
    this.lastConnectionCheck = null;
  }

  /**
   * 默认连接检查函数
   * @returns {Promise<boolean>}
   */
  return _createClass(LLM, [{
    key: "_defaultConnectionChecker",
    value: (function () {
      var _defaultConnectionChecker2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var testPayload;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              // 尝试发送一个简单的测试请求
              testPayload = {
                messages: [{
                  role: 'user',
                  content: 'test'
                }],
                max_tokens: 1,
                stream: false
              };
              _context.n = 1;
              return this.requestHandler(testPayload);
            case 1:
              return _context.a(2, true);
            case 2:
              _context.p = 2;
              _context.v;
              return _context.a(2, false);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function _defaultConnectionChecker() {
        return _defaultConnectionChecker2.apply(this, arguments);
      }
      return _defaultConnectionChecker;
    }()
    /**
     * 检查连接状态
     * @param {boolean} [force=false] - 是否强制检查（忽略缓存）
     * @returns {Promise<boolean>}
     */
    )
  }, {
    key: "isConnect",
    value: (function () {
      var _isConnect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var force,
          now,
          cacheExpiry,
          _args2 = arguments,
          _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              force = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : false;
              now = Date.now();
              cacheExpiry = 60000; // 1分钟缓存
              // 如果不强制检查且缓存未过期，返回缓存结果
              if (!(!force && this.lastConnectionCheck && now - this.lastConnectionCheck < cacheExpiry)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, this.isConnected);
            case 1:
              _context2.p = 1;
              _context2.n = 2;
              return this.connectionChecker();
            case 2:
              this.isConnected = _context2.v;
              this.lastConnectionCheck = now;
              return _context2.a(2, this.isConnected);
            case 3:
              _context2.p = 3;
              _t2 = _context2.v;
              console.warn("[".concat(this.provider, "] \u8FDE\u63A5\u68C0\u67E5\u5931\u8D25:"), _t2.message);
              this.isConnected = false;
              this.lastConnectionCheck = now;
              return _context2.a(2, false);
          }
        }, _callee2, this, [[1, 3]]);
      }));
      function isConnect() {
        return _isConnect.apply(this, arguments);
      }
      return isConnect;
    }()
    /**
     * 发送请求
     * @param {object} payload - 请求负载
     * @param {object} [options] - 请求选项
     * @returns {Promise<any>} 响应结果
     */
    )
  }, {
    key: "post",
    value: (function () {
      var _post = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(payload) {
        var options,
          mergedOptions,
          connected,
          result,
          chunks,
          _iteratorAbruptCompletion,
          _didIteratorError,
          _iteratorError,
          _iterator,
          _step,
          chunk,
          _args3 = arguments,
          _t3,
          _t4;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              mergedOptions = _objectSpread2(_objectSpread2({}, this.options), options); // 如果启用了连接检查
              if (!(mergedOptions.checkConnection !== false)) {
                _context3.n = 2;
                break;
              }
              _context3.n = 1;
              return this.isConnect();
            case 1:
              connected = _context3.v;
              if (connected) {
                _context3.n = 2;
                break;
              }
              throw new Error("[".concat(this.provider, "] \u65E0\u6CD5\u8FDE\u63A5\u5230\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u914D\u7F6E"));
            case 2:
              _context3.p = 2;
              _context3.n = 3;
              return this.requestHandler(payload, mergedOptions);
            case 3:
              result = _context3.v;
              if (!(result && typeof result[Symbol.asyncIterator] === 'function' && !payload.stream)) {
                _context3.n = 16;
                break;
              }
              // 非流式请求但返回了生成器，收集所有结果
              chunks = [];
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context3.p = 4;
              _iterator = _asyncIterator(result);
            case 5:
              _context3.n = 6;
              return _iterator.next();
            case 6:
              if (!(_iteratorAbruptCompletion = !(_step = _context3.v).done)) {
                _context3.n = 8;
                break;
              }
              chunk = _step.value;
              chunks.push(chunk);
            case 7:
              _iteratorAbruptCompletion = false;
              _context3.n = 5;
              break;
            case 8:
              _context3.n = 10;
              break;
            case 9:
              _context3.p = 9;
              _t3 = _context3.v;
              _didIteratorError = true;
              _iteratorError = _t3;
            case 10:
              _context3.p = 10;
              _context3.p = 11;
              if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                _context3.n = 12;
                break;
              }
              _context3.n = 12;
              return _iterator["return"]();
            case 12:
              _context3.p = 12;
              if (!_didIteratorError) {
                _context3.n = 13;
                break;
              }
              throw _iteratorError;
            case 13:
              return _context3.f(12);
            case 14:
              return _context3.f(10);
            case 15:
              return _context3.a(2, chunks[chunks.length - 1]);
            case 16:
              return _context3.a(2, result);
            case 17:
              _context3.p = 17;
              _t4 = _context3.v;
              console.error("[".concat(this.provider, "] \u8BF7\u6C42\u5931\u8D25:"), _t4.message);
              throw _t4;
            case 18:
              return _context3.a(2);
          }
        }, _callee3, this, [[11,, 12, 14], [4, 9, 10, 15], [2, 17]]);
      }));
      function post(_x3) {
        return _post.apply(this, arguments);
      }
      return post;
    }()
    /**
     * 流式请求
     * @param {object} payload - 请求负载
     * @param {object} [options] - 请求选项
     * @returns {AsyncGenerator} 流式响应
     */
    )
  }, {
    key: "stream",
    value: (function () {
      var _stream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(payload) {
        var options,
          streamPayload,
          _args4 = arguments;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
              streamPayload = _objectSpread2(_objectSpread2({}, payload), {}, {
                stream: true
              });
              return _context4.a(2, this.post(streamPayload, options));
          }
        }, _callee4, this);
      }));
      function stream(_x4) {
        return _stream.apply(this, arguments);
      }
      return stream;
    }()
    /**
     * 获取提供商信息
     * @returns {object} 提供商信息
     */
    )
  }, {
    key: "getProviderInfo",
    value: function getProviderInfo() {
      return {
        provider: this.provider,
        connected: this.isConnected,
        lastCheck: this.lastConnectionCheck ? new Date(this.lastConnectionCheck) : null,
        options: this.options
      };
    }

    /**
     * 更新配置
     * @param {object} newOptions - 新的配置选项
     */
  }, {
    key: "updateOptions",
    value: function updateOptions(newOptions) {
      this.options = _objectSpread2(_objectSpread2({}, this.options), newOptions);
    }
  }]);
}();

/**
 * LLM 工厂类 - 用于创建不同提供商的 LLM 实例
 */
var LLMFactory = /*#__PURE__*/function () {
  function LLMFactory() {
    _classCallCheck(this, LLMFactory);
  }
  return _createClass(LLMFactory, null, [{
    key: "register",
    value:
    /**
     * 注册提供商
     * @param {string} name - 提供商名称
     * @param {function} requestHandler - 请求处理函数
     * @param {function} [connectionChecker] - 连接检查函数
     * @param {object} [defaultOptions] - 默认选项
     */
    function register(name, requestHandler, connectionChecker) {
      var defaultOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      this.providers.set(name, {
        requestHandler: requestHandler,
        connectionChecker: connectionChecker,
        defaultOptions: defaultOptions
      });
    }

    /**
     * 创建 LLM 实例
     * @param {string} provider - 提供商名称
     * @param {object} [options] - 配置选项
     * @returns {LLM} LLM 实例
     */
  }, {
    key: "create",
    value: function create(provider) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var providerConfig = this.providers.get(provider);
      if (!providerConfig) {
        throw new Error("\u672A\u77E5\u7684 LLM \u63D0\u4F9B\u5546: ".concat(provider));
      }
      return new LLM({
        provider: provider,
        requestHandler: providerConfig.requestHandler,
        connectionChecker: providerConfig.connectionChecker,
        options: _objectSpread2(_objectSpread2({}, providerConfig.defaultOptions), options)
      });
    }

    /**
     * 获取已注册的提供商列表
     * @returns {string[]} 提供商名称列表
     */
  }, {
    key: "getProviders",
    value: function getProviders() {
      return Array.from(this.providers.keys());
    }
  }]);
}();

/**
 * 星火大模型请求处理函数
 */
_defineProperty(LLMFactory, "providers", new Map());
function sparkRequestHandler(_x) {
  return _sparkRequestHandler.apply(this, arguments);
}

/**
 * OpenAI 兼容的请求处理函数
 */
function _sparkRequestHandler() {
  _sparkRequestHandler = _wrapAsyncGenerator(function (payload) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return /*#__PURE__*/_regenerator().m(function _callee5() {
      var apiKey, baseUrl, response, decoder, buffer, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, chunk, lines, _iterator4, _step4, line, data, _t6, _t7;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            apiKey = options.apiKey || process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau';
            baseUrl = options.baseUrl || 'https://spark-api-open.xf-yun.com/v1/chat/completions';
            _context5.n = 1;
            return _awaitAsyncGenerator(fetch(baseUrl, {
              method: 'POST',
              headers: _objectSpread2({
                'Authorization': "Bearer ".concat(apiKey),
                'Content-Type': 'application/json'
              }, options.headers),
              body: JSON.stringify(payload)
            }));
          case 1:
            response = _context5.v;
            if (response.ok) {
              _context5.n = 2;
              break;
            }
            throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
          case 2:
            if (payload.stream) {
              _context5.n = 4;
              break;
            }
            _context5.n = 3;
            return _awaitAsyncGenerator(response.json());
          case 3:
            return _context5.a(2, _context5.v);
          case 4:
            if (response.body) {
              _context5.n = 5;
              break;
            }
            throw new Error('No response body');
          case 5:
            decoder = new TextDecoder('utf-8');
            buffer = '';
            _iteratorAbruptCompletion2 = false;
            _didIteratorError2 = false;
            _context5.p = 6;
            _iterator2 = _asyncIterator(response.body);
          case 7:
            _context5.n = 8;
            return _awaitAsyncGenerator(_iterator2.next());
          case 8:
            if (!(_iteratorAbruptCompletion2 = !(_step2 = _context5.v).done)) {
              _context5.n = 19;
              break;
            }
            chunk = _step2.value;
            buffer += decoder.decode(chunk, {
              stream: true
            });
            lines = buffer.split('\n');
            buffer = lines.pop();
            _iterator4 = _createForOfIteratorHelper(lines);
            _context5.p = 9;
            _iterator4.s();
          case 10:
            if ((_step4 = _iterator4.n()).done) {
              _context5.n = 15;
              break;
            }
            line = _step4.value;
            if (!line.startsWith('data:')) {
              _context5.n = 14;
              break;
            }
            data = line.slice(5).trim();
            if (!(data === '[DONE]')) {
              _context5.n = 11;
              break;
            }
            return _context5.a(2);
          case 11:
            _context5.p = 11;
            _context5.n = 12;
            return JSON.parse(data);
          case 12:
            _context5.n = 14;
            break;
          case 13:
            _context5.p = 13;
            _context5.v;
          case 14:
            _context5.n = 10;
            break;
          case 15:
            _context5.n = 17;
            break;
          case 16:
            _context5.p = 16;
            _t6 = _context5.v;
            _iterator4.e(_t6);
          case 17:
            _context5.p = 17;
            _iterator4.f();
            return _context5.f(17);
          case 18:
            _iteratorAbruptCompletion2 = false;
            _context5.n = 7;
            break;
          case 19:
            _context5.n = 21;
            break;
          case 20:
            _context5.p = 20;
            _t7 = _context5.v;
            _didIteratorError2 = true;
            _iteratorError2 = _t7;
          case 21:
            _context5.p = 21;
            _context5.p = 22;
            if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
              _context5.n = 23;
              break;
            }
            _context5.n = 23;
            return _awaitAsyncGenerator(_iterator2["return"]());
          case 23:
            _context5.p = 23;
            if (!_didIteratorError2) {
              _context5.n = 24;
              break;
            }
            throw _iteratorError2;
          case 24:
            return _context5.f(23);
          case 25:
            return _context5.f(21);
          case 26:
            return _context5.a(2);
        }
      }, _callee5, null, [[22,, 23, 25], [11, 13], [9, 16, 17, 18], [6, 20, 21, 26]]);
    })();
  });
  return _sparkRequestHandler.apply(this, arguments);
}
function openaiRequestHandler(_x2) {
  return _openaiRequestHandler.apply(this, arguments);
}

// 注册内置提供商
function _openaiRequestHandler() {
  _openaiRequestHandler = _wrapAsyncGenerator(function (payload) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return /*#__PURE__*/_regenerator().m(function _callee6() {
      var apiKey, baseUrl, response, decoder, buffer, _iteratorAbruptCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, chunk, lines, _iterator5, _step5, line, data, _t9, _t0;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            apiKey = options.apiKey || process.env.OPENAI_API_KEY;
            baseUrl = options.baseUrl || 'https://api.openai.com/v1/chat/completions';
            if (apiKey) {
              _context6.n = 1;
              break;
            }
            throw new Error('OpenAI API Key 未设置');
          case 1:
            _context6.n = 2;
            return _awaitAsyncGenerator(fetch(baseUrl, {
              method: 'POST',
              headers: _objectSpread2({
                'Authorization': "Bearer ".concat(apiKey),
                'Content-Type': 'application/json'
              }, options.headers),
              body: JSON.stringify(payload)
            }));
          case 2:
            response = _context6.v;
            if (response.ok) {
              _context6.n = 3;
              break;
            }
            throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
          case 3:
            if (payload.stream) {
              _context6.n = 5;
              break;
            }
            _context6.n = 4;
            return _awaitAsyncGenerator(response.json());
          case 4:
            return _context6.a(2, _context6.v);
          case 5:
            if (response.body) {
              _context6.n = 6;
              break;
            }
            throw new Error('No response body');
          case 6:
            decoder = new TextDecoder('utf-8');
            buffer = '';
            _iteratorAbruptCompletion3 = false;
            _didIteratorError3 = false;
            _context6.p = 7;
            _iterator3 = _asyncIterator(response.body);
          case 8:
            _context6.n = 9;
            return _awaitAsyncGenerator(_iterator3.next());
          case 9:
            if (!(_iteratorAbruptCompletion3 = !(_step3 = _context6.v).done)) {
              _context6.n = 20;
              break;
            }
            chunk = _step3.value;
            buffer += decoder.decode(chunk, {
              stream: true
            });
            lines = buffer.split('\n');
            buffer = lines.pop();
            _iterator5 = _createForOfIteratorHelper(lines);
            _context6.p = 10;
            _iterator5.s();
          case 11:
            if ((_step5 = _iterator5.n()).done) {
              _context6.n = 16;
              break;
            }
            line = _step5.value;
            if (!line.startsWith('data:')) {
              _context6.n = 15;
              break;
            }
            data = line.slice(5).trim();
            if (!(data === '[DONE]')) {
              _context6.n = 12;
              break;
            }
            return _context6.a(2);
          case 12:
            _context6.p = 12;
            _context6.n = 13;
            return JSON.parse(data);
          case 13:
            _context6.n = 15;
            break;
          case 14:
            _context6.p = 14;
            _context6.v;
          case 15:
            _context6.n = 11;
            break;
          case 16:
            _context6.n = 18;
            break;
          case 17:
            _context6.p = 17;
            _t9 = _context6.v;
            _iterator5.e(_t9);
          case 18:
            _context6.p = 18;
            _iterator5.f();
            return _context6.f(18);
          case 19:
            _iteratorAbruptCompletion3 = false;
            _context6.n = 8;
            break;
          case 20:
            _context6.n = 22;
            break;
          case 21:
            _context6.p = 21;
            _t0 = _context6.v;
            _didIteratorError3 = true;
            _iteratorError3 = _t0;
          case 22:
            _context6.p = 22;
            _context6.p = 23;
            if (!(_iteratorAbruptCompletion3 && _iterator3["return"] != null)) {
              _context6.n = 24;
              break;
            }
            _context6.n = 24;
            return _awaitAsyncGenerator(_iterator3["return"]());
          case 24:
            _context6.p = 24;
            if (!_didIteratorError3) {
              _context6.n = 25;
              break;
            }
            throw _iteratorError3;
          case 25:
            return _context6.f(24);
          case 26:
            return _context6.f(22);
          case 27:
            return _context6.a(2);
        }
      }, _callee6, null, [[23,, 24, 26], [12, 14], [10, 17, 18, 19], [7, 21, 22, 27]]);
    })();
  });
  return _openaiRequestHandler.apply(this, arguments);
}
LLMFactory.register('spark', sparkRequestHandler, null, {
  checkConnection: true,
  timeout: 30000
});
LLMFactory.register('openai', openaiRequestHandler, null, {
  checkConnection: true,
  timeout: 30000
});

// 便捷的创建函数
function createSparkLLM() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return LLMFactory.create('spark', options);
}
function createOpenAILLM() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return LLMFactory.create('openai', options);
}

// 导出向后兼容的函数
var sparkStreamRequest = sparkRequestHandler;

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  LLM: LLM,
  LLMFactory: LLMFactory,
  createOpenAILLM: createOpenAILLM,
  createSparkLLM: createSparkLLM,
  default: LLM,
  openaiRequestHandler: openaiRequestHandler,
  sparkRequestHandler: sparkRequestHandler,
  sparkStreamRequest: sparkStreamRequest
});

// Logger 日志类
var Logger = /*#__PURE__*/function () {
  function Logger() {
    var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'info';
    _classCallCheck(this, Logger);
    this.level = level;
  }
  return _createClass(Logger, [{
    key: "info",
    value: function info() {
      if (['info', 'debug'].includes(this.level)) {
        var _console;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        (_console = console).info.apply(_console, ['[INFO]'].concat(args));
      }
    }
  }, {
    key: "warn",
    value: function warn() {
      if (['warn', 'info', 'debug'].includes(this.level)) {
        var _console2;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        (_console2 = console).warn.apply(_console2, ['[WARN]'].concat(args));
      }
    }
  }, {
    key: "error",
    value: function error() {
      var _console3;
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      (_console3 = console).error.apply(_console3, ['[ERROR]'].concat(args));
    }
  }, {
    key: "debug",
    value: function debug() {
      if (this.level === 'debug') {
        var _console4;
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }
        (_console4 = console).debug.apply(_console4, ['[DEBUG]'].concat(args));
      }
    }
  }]);
}();

/**
 * Prompt 构建器类
 */
var PromptBuilder = /*#__PURE__*/function () {
  function PromptBuilder() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, PromptBuilder);
    this.logger = options.logger || new Logger('PromptBuilder');
    this.templates = new Map();
    this.globalVariables = new Map();
    this.middlewares = [];

    // 默认模板
    this.loadDefaultTemplates();
  }

  /**
   * 加载默认模板
   */
  return _createClass(PromptBuilder, [{
    key: "loadDefaultTemplates",
    value: function loadDefaultTemplates() {
      // 基础对话模板
      this.registerTemplate('chat', {
        system: '你是一个有用的AI助手。',
        user: '{{content}}',
        assistant: null
      });

      // 任务执行模板
      this.registerTemplate('task', {
        system: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u4EFB\u52A1\u6267\u884C\u52A9\u624B\u3002\u8BF7\u6839\u636E\u4EE5\u4E0B\u4EFB\u52A1\u63CF\u8FF0\u6267\u884C\u76F8\u5E94\u64CD\u4F5C\uFF1A\n\n\u4EFB\u52A1\u7C7B\u578B\uFF1A{{taskType}}\n\u4EFB\u52A1\u63CF\u8FF0\uFF1A{{description}}\n\u671F\u671B\u8F93\u51FA\uFF1A{{expectedOutput}}\n\n\u8BF7\u6309\u7167\u4EE5\u4E0B\u683C\u5F0F\u56DE\u590D\uFF1A\n1. \u7406\u89E3\u786E\u8BA4\uFF1A\u7B80\u8FF0\u4F60\u5BF9\u4EFB\u52A1\u7684\u7406\u89E3\n2. \u6267\u884C\u6B65\u9AA4\uFF1A\u5217\u51FA\u5177\u4F53\u7684\u6267\u884C\u6B65\u9AA4\n3. \u7ED3\u679C\u8F93\u51FA\uFF1A\u63D0\u4F9B\u6700\u7EC8\u7ED3\u679C",
        user: '任务详情：{{taskDetails}}',
        assistant: null
      });

      // 数据分析模板
      this.registerTemplate('analysis', {
        system: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u6570\u636E\u5206\u6790\u5E08\u3002\u8BF7\u5BF9\u63D0\u4F9B\u7684\u6570\u636E\u8FDB\u884C\u6DF1\u5165\u5206\u6790\uFF1A\n\n\u5206\u6790\u7EF4\u5EA6\uFF1A{{dimensions}}\n\u6570\u636E\u7C7B\u578B\uFF1A{{dataType}}\n\u5206\u6790\u76EE\u6807\uFF1A{{objective}}",
        user: '数据内容：{{data}}',
        assistant: null
      });

      // MCP 服务器交互模板
      this.registerTemplate('mcp', {
        system: "\u4F60\u662F\u4E00\u4E2A MCP (Model Context Protocol) \u670D\u52A1\u5668\u7684\u63A5\u53E3\u52A9\u624B\u3002\n\u4F60\u9700\u8981\u6839\u636E\u7528\u6237\u7684\u8BF7\u6C42\u751F\u6210\u76F8\u5E94\u7684 MCP \u8C03\u7528\u6307\u4EE4\u3002\n\n\u53EF\u7528\u7684 MCP \u5DE5\u5177\uFF1A{{availableTools}}\n\u5F53\u524D\u4E0A\u4E0B\u6587\uFF1A{{context}}",
        user: '用户请求：{{userRequest}}\n期望操作：{{expectedAction}}',
        assistant: null
      });

      // 流程链模板
      this.registerTemplate('workflow', {
        system: "\u4F60\u662F\u4E00\u4E2A\u5DE5\u4F5C\u6D41\u7A0B\u7BA1\u7406\u5668\u3002\u5F53\u524D\u5904\u4E8E\u6D41\u7A0B\u7684\u7B2C {{stepNumber}} \u6B65\u3002\n\n\u6D41\u7A0B\u540D\u79F0\uFF1A{{workflowName}}\n\u5F53\u524D\u6B65\u9AA4\uFF1A{{currentStep}}\n\u524D\u7F6E\u7ED3\u679C\uFF1A{{previousResults}}\n\u4E0B\u4E00\u6B65\u9AA4\uFF1A{{nextStep}}",
        user: '当前输入：{{input}}',
        assistant: null
      });
    }

    /**
     * 注册新的模板
     * @param {string} name - 模板名称
     * @param {Object} template - 模板对象
     */
  }, {
    key: "registerTemplate",
    value: function registerTemplate(name, template) {
      this.templates.set(name, template);
      this.logger.info("\u6CE8\u518C\u6A21\u677F: ".concat(name));
    }

    /**
     * 设置全局变量
     * @param {string} key - 变量名
     * @param {any} value - 变量值
     */
  }, {
    key: "setGlobalVariable",
    value: function setGlobalVariable(key, value) {
      this.globalVariables.set(key, value);
    }

    /**
     * 添加中间件
     * @param {Function} middleware - 中间件函数
     */
  }, {
    key: "use",
    value: function use(middleware) {
      this.middlewares.push(middleware);
    }

    /**
     * 构建 prompt
     * @param {Object} config - 配置对象
     * @returns {Object} 构建好的 prompt 对象
     */
  }, {
    key: "build",
    value: function build(config) {
      try {
        // 验证配置
        this.validateConfig(config);

        // 获取模板
        var template = this.getTemplate(config.template);

        // 合并变量
        var variables = this.mergeVariables(config);

        // 应用中间件
        var context = {
          config: config,
          template: template,
          variables: variables
        };
        var _iterator = _createForOfIteratorHelper(this.middlewares),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var middleware = _step.value;
            context = middleware(context) || context;
          }

          // 构建消息
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        var messages = this.buildMessages(context.template, context.variables);

        // 添加额外配置
        var prompt = {
          messages: messages,
          template: config.template,
          timestamp: new Date().toISOString(),
          metadata: config.metadata || {}
        };

        // 应用后处理
        return this.postProcess(prompt, config);
      } catch (error) {
        this.logger.error('构建 prompt 失败:', error);
        throw error;
      }
    }

    /**
     * 验证配置对象
     * @param {Object} config - 配置对象
     */
  }, {
    key: "validateConfig",
    value: function validateConfig(config) {
      if (!config || _typeof(config) !== 'object') {
        throw new Error('配置对象不能为空');
      }
      if (!config.template) {
        throw new Error('必须指定模板名称');
      }
      if (!this.templates.has(config.template)) {
        throw new Error("\u672A\u627E\u5230\u6A21\u677F: ".concat(config.template));
      }
    }

    /**
     * 获取模板
     * @param {string} templateName - 模板名称
     * @returns {Object} 模板对象
     */
  }, {
    key: "getTemplate",
    value: function getTemplate(templateName) {
      return this.templates.get(templateName);
    }

    /**
     * 合并变量
     * @param {Object} config - 配置对象
     * @returns {Object} 合并后的变量对象
     */
  }, {
    key: "mergeVariables",
    value: function mergeVariables(config) {
      var variables = new Map();

      // 添加全局变量
      var _iterator2 = _createForOfIteratorHelper(this.globalVariables),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            _key = _step2$value[0],
            _value = _step2$value[1];
          variables.set(_key, _value);
        }

        // 添加配置中的变量
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (config.variables) {
        for (var _i = 0, _Object$entries = Object.entries(config.variables); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          variables.set(key, value);
        }
      }

      // 添加动态变量
      variables.set('timestamp', new Date().toISOString());
      variables.set('date', new Date().toLocaleDateString());
      variables.set('time', new Date().toLocaleTimeString());
      return Object.fromEntries(variables);
    }

    /**
     * 构建消息数组
     * @param {Object} template - 模板对象
     * @param {Object} variables - 变量对象
     * @returns {Array} 消息数组
     */
  }, {
    key: "buildMessages",
    value: function buildMessages(template, variables) {
      var messages = [];

      // 系统消息
      if (template.system) {
        messages.push({
          role: 'system',
          content: this.interpolate(template.system, variables)
        });
      }

      // 用户消息
      if (template.user) {
        messages.push({
          role: 'user',
          content: this.interpolate(template.user, variables)
        });
      }

      // 助手消息（如果有预设回复）
      if (template.assistant) {
        messages.push({
          role: 'assistant',
          content: this.interpolate(template.assistant, variables)
        });
      }
      return messages;
    }

    /**
     * 字符串插值 - 替换模板中的变量
     * @param {string} template - 模板字符串
     * @param {Object} variables - 变量对象
     * @returns {string} 插值后的字符串
     */
  }, {
    key: "interpolate",
    value: function interpolate(template, variables) {
      var _this = this;
      if (typeof template !== 'string') {
        return template;
      }
      return template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
        if (key in variables) {
          var value = variables[key];
          return _typeof(value) === 'object' ? JSON.stringify(value, null, 2) : String(value);
        }
        _this.logger.warn("\u672A\u627E\u5230\u53D8\u91CF: ".concat(key));
        return match; // 保留原始占位符
      });
    }

    /**
     * 后处理
     * @param {Object} prompt - prompt 对象
     * @param {Object} config - 配置对象
     * @returns {Object} 处理后的 prompt 对象
     */
  }, {
    key: "postProcess",
    value: function postProcess(prompt, config) {
      // 应用配置中的后处理选项
      if (config.maxTokens) {
        prompt.maxTokens = config.maxTokens;
      }
      if (config.temperature !== undefined) {
        prompt.temperature = config.temperature;
      }
      if (config.stream !== undefined) {
        prompt.stream = config.stream;
      }

      // 添加追踪信息
      if (config.traceId) {
        prompt.metadata.traceId = config.traceId;
      }
      return prompt;
    }

    /**
     * 获取所有模板名称
     * @returns {Array} 模板名称数组
     */
  }, {
    key: "getTemplateNames",
    value: function getTemplateNames() {
      return Array.from(this.templates.keys());
    }

    /**
     * 获取模板信息
     * @param {string} name - 模板名称
     * @returns {Object} 模板信息
     */
  }, {
    key: "getTemplateInfo",
    value: function getTemplateInfo(name) {
      var template = this.templates.get(name);
      if (!template) {
        return null;
      }
      return {
        name: name,
        hasSystem: !!template.system,
        hasUser: !!template.user,
        hasAssistant: !!template.assistant,
        variables: this.extractVariables(template)
      };
    }

    /**
     * 提取模板中的变量
     * @param {Object} template - 模板对象
     * @returns {Array} 变量名数组
     */
  }, {
    key: "extractVariables",
    value: function extractVariables(template) {
      var variables = new Set();
      var regex = /\{\{(\w+)\}\}/g;
      for (var _i2 = 0, _Object$entries2 = Object.entries(template); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2);
          _Object$entries2$_i[0];
          var content = _Object$entries2$_i[1];
        if (typeof content === 'string') {
          var match = void 0;
          while ((match = regex.exec(content)) !== null) {
            variables.add(match[1]);
          }
        }
      }
      return Array.from(variables);
    }
  }]);
}();

/**
 * 创建 prompt 构建器实例
 * @param {Object} options - 选项
 * @returns {PromptBuilder} 构建器实例
 */
function createPromptBuilder() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new PromptBuilder(options);
}

/**
 * 快速构建 prompt
 * @param {string} template - 模板名称
 * @param {Object} variables - 变量对象
 * @param {Object} options - 选项
 * @returns {Object} 构建好的 prompt
 */
function buildPrompt(template) {
  var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var builder = new PromptBuilder(options);
  return builder.build(_objectSpread2({
    template: template,
    variables: variables
  }, options));
}

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PromptBuilder: PromptBuilder,
  buildPrompt: buildPrompt,
  createPromptBuilder: createPromptBuilder,
  default: PromptBuilder
});

/**
 * 预定义的 Prompt 模板配置
 * 包含各种常用的 prompt 模板和配置
 */

/**
 * 任务类型枚举
 */
var TaskTypes = {
  CHAT: 'chat',
  ANALYSIS: 'analysis',
  TASK_EXECUTION: 'task',
  MCP_INTERACTION: 'mcp',
  WORKFLOW: 'workflow',
  CODE_GENERATION: 'code',
  TRANSLATION: 'translation',
  SUMMARIZATION: 'summary'
};

/**
 * 基础模板配置
 */
var BaseTemplates = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, TaskTypes.CHAT, {
  system: '你是一个有用、准确且友善的AI助手。请用清晰、简洁的方式回答用户的问题。',
  user: '{{content}}',
  variables: ['content']
}), TaskTypes.ANALYSIS, {
  system: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u6570\u636E\u5206\u6790\u5E08\u3002\u8BF7\u5BF9\u63D0\u4F9B\u7684\u6570\u636E\u8FDB\u884C\u6DF1\u5165\u5206\u6790\uFF1A\n\n\u5206\u6790\u8981\u6C42\uFF1A\n- \u6570\u636E\u7C7B\u578B\uFF1A{{dataType}}\n- \u5206\u6790\u7EF4\u5EA6\uFF1A{{dimensions}}\n- \u5206\u6790\u76EE\u6807\uFF1A{{objective}}\n- \u671F\u671B\u683C\u5F0F\uFF1A{{outputFormat}}\n\n\u8BF7\u63D0\u4F9B\uFF1A\n1. \u6570\u636E\u6982\u89C8\u548C\u8D28\u91CF\u8BC4\u4F30\n2. \u5173\u952E\u53D1\u73B0\u548C\u8D8B\u52BF\n3. \u6DF1\u5165\u6D1E\u5BDF\u548C\u5EFA\u8BAE\n4. \u6570\u636E\u53EF\u89C6\u5316\u5EFA\u8BAE\uFF08\u5982\u9002\u7528\uFF09",
  user: "\u8BF7\u5206\u6790\u4EE5\u4E0B\u6570\u636E\uFF1A\n\n{{data}}\n\n{{#additionalContext}}\n\u9644\u52A0\u4E0A\u4E0B\u6587\uFF1A{{additionalContext}}\n{{/additionalContext}}",
  variables: ['dataType', 'dimensions', 'objective', 'outputFormat', 'data', 'additionalContext']
}), TaskTypes.TASK_EXECUTION, {
  system: "\u4F60\u662F\u4E00\u4E2A\u9AD8\u6548\u7684\u4EFB\u52A1\u6267\u884C\u52A9\u624B\u3002\u8BF7\u6839\u636E\u4EE5\u4E0B\u4EFB\u52A1\u4FE1\u606F\u6267\u884C\u76F8\u5E94\u64CD\u4F5C\uFF1A\n\n\u4EFB\u52A1\u4FE1\u606F\uFF1A\n- \u4EFB\u52A1\u7C7B\u578B\uFF1A{{taskType}}\n- \u4F18\u5148\u7EA7\uFF1A{{priority}}\n- \u622A\u6B62\u65F6\u95F4\uFF1A{{deadline}}\n- \u671F\u671B\u8F93\u51FA\uFF1A{{expectedOutput}}\n\n\u6267\u884C\u539F\u5219\uFF1A\n1. \u51C6\u786E\u7406\u89E3\u4EFB\u52A1\u9700\u6C42\n2. \u5236\u5B9A\u6E05\u6670\u7684\u6267\u884C\u8BA1\u5212\n3. \u63D0\u4F9B\u9AD8\u8D28\u91CF\u7684\u7ED3\u679C\n4. \u6CE8\u660E\u4EFB\u4F55\u9650\u5236\u6216\u5047\u8BBE",
  user: "\u4EFB\u52A1\u63CF\u8FF0\uFF1A{{description}}\n\n{{#constraints}}\n\u7EA6\u675F\u6761\u4EF6\uFF1A{{constraints}}\n{{/constraints}}\n\n{{#resources}}\n\u53EF\u7528\u8D44\u6E90\uFF1A{{resources}}\n{{/resources}}",
  variables: ['taskType', 'priority', 'deadline', 'expectedOutput', 'description', 'constraints', 'resources']
}), TaskTypes.MCP_INTERACTION, {
  system: "\u4F60\u662F\u4E00\u4E2A MCP (Model Context Protocol) \u670D\u52A1\u5668\u7684\u667A\u80FD\u63A5\u53E3\u3002\u4F60\u9700\u8981\uFF1A\n\n1. \u7406\u89E3\u7528\u6237\u7684\u8BF7\u6C42\u610F\u56FE\n2. \u9009\u62E9\u5408\u9002\u7684 MCP \u5DE5\u5177\n3. \u751F\u6210\u6B63\u786E\u7684\u8C03\u7528\u53C2\u6570\n4. \u5904\u7406\u8FD4\u56DE\u7ED3\u679C\n\n\u53EF\u7528\u5DE5\u5177\uFF1A{{availableTools}}\n\u5F53\u524D\u4F1A\u8BDDID\uFF1A{{sessionId}}\n\u4E0A\u4E0B\u6587\u4FE1\u606F\uFF1A{{context}}",
  user: "\u7528\u6237\u8BF7\u6C42\uFF1A{{userRequest}}\n\n\u671F\u671B\u64CD\u4F5C\uFF1A{{expectedAction}}\n\n{{#previousResults}}\n\u524D\u7F6E\u7ED3\u679C\uFF1A{{previousResults}}\n{{/previousResults}}",
  variables: ['availableTools', 'sessionId', 'context', 'userRequest', 'expectedAction', 'previousResults']
}), TaskTypes.WORKFLOW, {
  system: "\u4F60\u662F\u4E00\u4E2A\u5DE5\u4F5C\u6D41\u7A0B\u7BA1\u7406\u5668\u3002\u5F53\u524D\u6267\u884C\u5DE5\u4F5C\u6D41\u7A0B\u4E2D\u7684\u4E00\u4E2A\u6B65\u9AA4\uFF1A\n\n\u5DE5\u4F5C\u6D41\u4FE1\u606F\uFF1A\n- \u6D41\u7A0B\u540D\u79F0\uFF1A{{workflowName}}\n- \u5F53\u524D\u6B65\u9AA4\uFF1A{{currentStep}} / {{totalSteps}}\n- \u6B65\u9AA4\u63CF\u8FF0\uFF1A{{stepDescription}}\n- \u6D41\u7A0B\u72B6\u6001\uFF1A{{workflowStatus}}\n\n\u524D\u7F6E\u6761\u4EF6\uFF1A{{prerequisites}}\n\u6210\u529F\u6807\u51C6\uFF1A{{successCriteria}}",
  user: "\u6B65\u9AA4\u8F93\u5165\uFF1A{{stepInput}}\n\n{{#previousStepResults}}\n\u524D\u5E8F\u6B65\u9AA4\u7ED3\u679C\uFF1A{{previousStepResults}}\n{{/previousStepResults}}\n\n{{#nextStepRequirements}}\n\u4E0B\u4E00\u6B65\u9700\u6C42\uFF1A{{nextStepRequirements}}\n{{/nextStepRequirements}}",
  variables: ['workflowName', 'currentStep', 'totalSteps', 'stepDescription', 'workflowStatus', 'prerequisites', 'successCriteria', 'stepInput', 'previousStepResults', 'nextStepRequirements']
}), TaskTypes.CODE_GENERATION, {
  system: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u8F6F\u4EF6\u5F00\u53D1\u5DE5\u7A0B\u5E08\u3002\u8BF7\u6839\u636E\u8981\u6C42\u751F\u6210\u9AD8\u8D28\u91CF\u7684\u4EE3\u7801\uFF1A\n\n\u5F00\u53D1\u73AF\u5883\uFF1A\n- \u7F16\u7A0B\u8BED\u8A00\uFF1A{{language}}\n- \u6846\u67B6/\u5E93\uFF1A{{framework}}\n- \u4EE3\u7801\u98CE\u683C\uFF1A{{codeStyle}}\n- \u76EE\u6807\u5E73\u53F0\uFF1A{{targetPlatform}}\n\n\u7F16\u7801\u539F\u5219\uFF1A\n1. \u4EE3\u7801\u7B80\u6D01\u3001\u53EF\u8BFB\u6027\u5F3A\n2. \u9075\u5FAA\u6700\u4F73\u5B9E\u8DF5\n3. \u5305\u542B\u5FC5\u8981\u7684\u6CE8\u91CA\n4. \u8003\u8651\u9519\u8BEF\u5904\u7406\n5. \u63D0\u4F9B\u4F7F\u7528\u793A\u4F8B",
  user: "\u9700\u6C42\u63CF\u8FF0\uFF1A{{requirements}}\n\n{{#specifications}}\n\u6280\u672F\u89C4\u683C\uFF1A{{specifications}}\n{{/specifications}}\n\n{{#constraints}}\n\u6280\u672F\u7EA6\u675F\uFF1A{{constraints}}\n{{/constraints}}\n\n{{#examples}}\n\u53C2\u8003\u793A\u4F8B\uFF1A{{examples}}\n{{/examples}}",
  variables: ['language', 'framework', 'codeStyle', 'targetPlatform', 'requirements', 'specifications', 'constraints', 'examples']
}), TaskTypes.TRANSLATION, {
  system: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u7FFB\u8BD1\u4E13\u5BB6\u3002\u8BF7\u63D0\u4F9B\u51C6\u786E\u3001\u81EA\u7136\u7684\u7FFB\u8BD1\uFF1A\n\n\u7FFB\u8BD1\u8BBE\u7F6E\uFF1A\n- \u6E90\u8BED\u8A00\uFF1A{{sourceLanguage}}\n- \u76EE\u6807\u8BED\u8A00\uFF1A{{targetLanguage}}\n- \u7FFB\u8BD1\u98CE\u683C\uFF1A{{translationStyle}}\n- \u9886\u57DF\u4E13\u4E1A\u6027\uFF1A{{domain}}\n\n\u7FFB\u8BD1\u539F\u5219\uFF1A\n1. \u4FDD\u6301\u539F\u6587\u7684\u51C6\u786E\u6027\u548C\u5B8C\u6574\u6027\n2. \u7B26\u5408\u76EE\u6807\u8BED\u8A00\u7684\u8868\u8FBE\u4E60\u60EF\n3. \u8003\u8651\u6587\u5316\u80CC\u666F\u548C\u8BED\u5883\n4. \u4E13\u4E1A\u672F\u8BED\u4FDD\u6301\u4E00\u81F4\u6027",
  user: "\u8BF7\u7FFB\u8BD1\u4EE5\u4E0B\u5185\u5BB9\uFF1A\n\n{{sourceText}}\n\n{{#context}}\n\u4E0A\u4E0B\u6587\u4FE1\u606F\uFF1A{{context}}\n{{/context}}\n\n{{#glossary}}\n\u672F\u8BED\u5BF9\u7167\uFF1A{{glossary}}\n{{/glossary}}",
  variables: ['sourceLanguage', 'targetLanguage', 'translationStyle', 'domain', 'sourceText', 'context', 'glossary']
}), TaskTypes.SUMMARIZATION, {
  system: "\u4F60\u662F\u4E00\u4E2A\u4E13\u4E1A\u7684\u5185\u5BB9\u603B\u7ED3\u4E13\u5BB6\u3002\u8BF7\u6839\u636E\u8981\u6C42\u63D0\u4F9B\u9AD8\u8D28\u91CF\u7684\u603B\u7ED3\uFF1A\n\n\u603B\u7ED3\u8981\u6C42\uFF1A\n- \u603B\u7ED3\u7C7B\u578B\uFF1A{{summaryType}}\n- \u76EE\u6807\u957F\u5EA6\uFF1A{{targetLength}}\n- \u5173\u6CE8\u91CD\u70B9\uFF1A{{focusAreas}}\n- \u76EE\u6807\u53D7\u4F17\uFF1A{{targetAudience}}\n\n\u603B\u7ED3\u539F\u5219\uFF1A\n1. \u51C6\u786E\u63D0\u53D6\u5173\u952E\u4FE1\u606F\n2. \u4FDD\u6301\u903B\u8F91\u7ED3\u6784\u6E05\u6670\n3. \u8BED\u8A00\u7B80\u6D01\u660E\u4E86\n4. \u7A81\u51FA\u91CD\u8981\u89C2\u70B9",
  user: "\u8BF7\u603B\u7ED3\u4EE5\u4E0B\u5185\u5BB9\uFF1A\n\n{{originalContent}}\n\n{{#additionalRequirements}}\n\u9644\u52A0\u8981\u6C42\uFF1A{{additionalRequirements}}\n{{/additionalRequirements}}\n\n{{#keyPoints}}\n\u5173\u952E\u8981\u70B9\uFF1A{{keyPoints}}\n{{/keyPoints}}",
  variables: ['summaryType', 'targetLength', 'focusAreas', 'targetAudience', 'originalContent', 'additionalRequirements', 'keyPoints']
});

/**
 * 中间件配置
 */
var MiddlewareConfigs = {
  // 变量验证中间件
  variableValidator: function variableValidator() {
    var requiredVars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return function (context) {
      var variables = context.variables;
      var missing = requiredVars.filter(function (varName) {
        return !(varName in variables);
      });
      if (missing.length > 0) {
        throw new Error("\u7F3A\u5C11\u5FC5\u9700\u7684\u53D8\u91CF: ".concat(missing.join(', ')));
      }
      return context;
    };
  },
  // 内容长度限制中间件
  contentLimiter: function contentLimiter() {
    var maxLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
    return function (context) {
      var template = context.template;
        context.variables;
      for (var _i = 0, _Object$entries = Object.entries(template); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          role = _Object$entries$_i[0],
          content = _Object$entries$_i[1];
        if (typeof content === 'string' && content.length > maxLength) {
          throw new Error("".concat(role, " \u5185\u5BB9\u8D85\u8FC7\u957F\u5EA6\u9650\u5236 (").concat(maxLength, " \u5B57\u7B26)"));
        }
      }
      return context;
    };
  },
  // 敏感词过滤中间件
  contentFilter: function contentFilter() {
    var bannedWords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return function (context) {
      var variables = context.variables;
      var found = [];
      for (var _i2 = 0, _Object$entries2 = Object.entries(variables); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          key = _Object$entries2$_i[0],
          value = _Object$entries2$_i[1];
        if (typeof value === 'string') {
          var _iterator = _createForOfIteratorHelper(bannedWords),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var word = _step.value;
              if (value.toLowerCase().includes(word.toLowerCase())) {
                found.push("".concat(key, ": ").concat(word));
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
      if (found.length > 0) {
        throw new Error("\u68C0\u6D4B\u5230\u654F\u611F\u8BCD: ".concat(found.join(', ')));
      }
      return context;
    };
  },
  // 时间戳注入中间件
  timestampInjector: function timestampInjector() {
    return function (context) {
      var now = new Date();
      context.variables = _objectSpread2(_objectSpread2({}, context.variables), {}, {
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('zh-CN'),
        time: now.toLocaleTimeString('zh-CN'),
        unixTimestamp: Math.floor(now.getTime() / 1000)
      });
      return context;
    };
  },
  // 追踪信息中间件
  traceInjector: function traceInjector(traceId) {
    return function (context) {
      context.variables = _objectSpread2(_objectSpread2({}, context.variables), {}, {
        traceId: traceId || "trace_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9))
      });
      return context;
    };
  }
};

/**
 * 预设配置组合
 */
var PresetConfigs = {
  // 基础配置
  basic: {
    middlewares: [MiddlewareConfigs.timestampInjector()]
  },
  // 严格模式配置
  strict: {
    middlewares: [MiddlewareConfigs.contentLimiter(5000), MiddlewareConfigs.contentFilter(['hack', 'crack', 'attack']), MiddlewareConfigs.timestampInjector()]
  },
  // 调试模式配置
  debug: {
    middlewares: [MiddlewareConfigs.traceInjector(), MiddlewareConfigs.timestampInjector()]
  },
  // 生产环境配置
  production: {
    middlewares: [MiddlewareConfigs.contentLimiter(8000), MiddlewareConfigs.contentFilter(['hack', 'crack', 'attack', 'spam']), MiddlewareConfigs.timestampInjector()]
  }
};

/**
 * 工具函数
 */
var PromptUtils = {
  /**
   * 创建变量映射
   * @param {Object} data - 原始数据
   * @param {Object} mapping - 字段映射
   * @returns {Object} 映射后的变量对象
   */
  mapVariables: function mapVariables(data, mapping) {
    var variables = {};
    for (var _i3 = 0, _Object$entries3 = Object.entries(mapping); _i3 < _Object$entries3.length; _i3++) {
      var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
        templateVar = _Object$entries3$_i[0],
        dataKey = _Object$entries3$_i[1];
      if (dataKey in data) {
        variables[templateVar] = data[dataKey];
      }
    }
    return variables;
  },
  /**
   * 合并配置对象
   * @param {Object} base - 基础配置
   * @param {Object} override - 覆盖配置
   * @returns {Object} 合并后的配置
   */
  mergeConfigs: function mergeConfigs(base, override) {
    return _objectSpread2(_objectSpread2(_objectSpread2({}, base), override), {}, {
      variables: _objectSpread2(_objectSpread2({}, base.variables), override.variables),
      metadata: _objectSpread2(_objectSpread2({}, base.metadata), override.metadata)
    });
  },
  /**
   * 验证模板配置
   * @param {Object} template - 模板对象
   * @returns {boolean} 是否有效
   */
  validateTemplate: function validateTemplate(template) {
    if (!template || _typeof(template) !== 'object') {
      return false;
    }

    // 至少需要 system 或 user 角色
    return !!(template.system || template.user);
  },
  /**
   * 提取所有变量名
   * @param {string} text - 模板文本
   * @returns {Array} 变量名数组
   */
  extractVariables: function extractVariables(text) {
    if (typeof text !== 'string') {
      return [];
    }
    var regex = /\{\{(\w+)\}\}/g;
    var variables = [];
    var match;
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  }
};

// 汇总所有模板为 PROMPT_TEMPLATES
var PROMPT_TEMPLATES = {
  TaskTypes: TaskTypes,
  BaseTemplates: BaseTemplates,
  MiddlewareConfigs: MiddlewareConfigs,
  PresetConfigs: PresetConfigs,
  PromptUtils: PromptUtils
};

// 便捷的创建函数
function createSystemPrompt(template) {
  var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return PromptUtils.processTemplate(template, variables);
}
function createUserPrompt(template) {
  var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return PromptUtils.processTemplate(template, variables);
}
function createAssistantPrompt(template) {
  var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return PromptUtils.processTemplate(template, variables);
}
function createFunctionPrompt(template) {
  var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return PromptUtils.processTemplate(template, variables);
}

/**
 * MCP (Model Context Protocol) 类型定义
 * 基于 codex-rs/mcp-types 实现
 * 
 * @fileoverview 提供完整的 MCP 协议类型定义（JavaScript 版本）
 */

// 协议版本和常量
var MCP_SCHEMA_VERSION = '2025-06-18';
var JSONRPC_VERSION = '2.0';

// ============================================================================
// 错误代码常量
// ============================================================================

var JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // MCP 特定错误代码
  MCP_INVALID_TOOL: -32e3,
  MCP_TOOL_EXECUTION_ERROR: -32001,
  MCP_RESOURCE_NOT_FOUND: -32002,
  MCP_PERMISSION_DENIED: -32003
};

// ============================================================================
// 工厂函数和验证器
// ============================================================================

/**
 * 创建 JSON-RPC 请求
 * @param {string} method - 方法名
 * @param {any} [params] - 参数
 * @param {string|number} [id] - 请求ID
 * @returns {Object} JSON-RPC请求对象
 */
function createJsonRpcRequest(method, params, id) {
  var request = {
    jsonrpc: JSONRPC_VERSION,
    method: method
  };
  if (params !== undefined) {
    request.params = params;
  }
  if (id !== undefined) {
    request.id = id;
  }
  return request;
}

/**
 * 创建 JSON-RPC 响应
 * @param {string|number} id - 请求ID
 * @param {any} [result] - 结果
 * @param {Object} [error] - 错误对象
 * @returns {Object} JSON-RPC响应对象
 */
function createJsonRpcResponse(id, result, error) {
  var response = {
    jsonrpc: JSONRPC_VERSION,
    id: id
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result || null;
  }
  return response;
}

/**
 * 创建 JSON-RPC 错误对象
 * @param {number} code - 错误代码
 * @param {string} message - 错误消息
 * @param {any} [data] - 错误数据
 * @returns {Object} 错误对象
 */
function createJsonRpcError(code, message, data) {
  var error = {
    code: code,
    message: message
  };
  if (data !== undefined) {
    error.data = data;
  }
  return error;
}

/**
 * 创建文本内容块
 * @param {string} text - 文本内容
 * @param {Object} [annotations] - 注解
 * @returns {Object} 文本内容对象
 */
function createTextContent(text, annotations) {
  var content = {
    type: 'text',
    text: text
  };
  if (annotations) {
    content.annotations = annotations;
  }
  return content;
}

/**
 * 创建图片内容块
 * @param {string} data - base64编码的图片数据
 * @param {string} mimeType - MIME类型
 * @param {Object} [annotations] - 注解
 * @returns {Object} 图片内容对象
 */
function createImageContent(data, mimeType, annotations) {
  var content = {
    type: 'image',
    data: data,
    mimeType: mimeType
  };
  if (annotations) {
    content.annotations = annotations;
  }
  return content;
}

/**
 * 创建工具定义
 * @param {string} name - 工具名称
 * @param {Object} inputSchema - 输入Schema
 * @param {string} [title] - 工具标题
 * @param {string} [description] - 工具描述
 * @returns {Object} 工具对象
 */
function createTool(name, inputSchema, title, description) {
  var tool = {
    name: name,
    inputSchema: inputSchema
  };
  if (title) tool.title = title;
  if (description) tool.description = description;
  return tool;
}

/**
 * 创建工具调用结果
 * @param {Array} content - 内容数组
 * @param {boolean} [isError] - 是否错误
 * @param {any} [structuredContent] - 结构化内容
 * @returns {Object} 工具调用结果
 */
function createCallToolResult(content, isError, structuredContent) {
  var result = {
    content: content
  };
  if (isError !== undefined) result.isError = isError;
  if (structuredContent !== undefined) result.structuredContent = structuredContent;
  return result;
}

// ============================================================================
// 验证函数
// ============================================================================

/**
 * 验证是否为有效的JSON-RPC消息
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
function isValidJsonRpcMessage(obj) {
  return obj && _typeof(obj) === 'object' && obj.jsonrpc === JSONRPC_VERSION;
}

/**
 * 验证是否为有效的JSON-RPC请求
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
function isValidJsonRpcRequest(obj) {
  return isValidJsonRpcMessage(obj) && typeof obj.method === 'string' && obj.id !== undefined;
}

/**
 * 验证是否为有效的JSON-RPC响应
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
function isValidJsonRpcResponse(obj) {
  return isValidJsonRpcMessage(obj) && obj.id !== undefined && (obj.result !== undefined || obj.error !== undefined);
}

/**
 * 验证是否为有效的工具定义
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
function isValidTool(obj) {
  return obj && _typeof(obj) === 'object' && typeof obj.name === 'string' && obj.inputSchema && _typeof(obj.inputSchema) === 'object';
}

// ============================================================================
// MCP 方法常量
// ============================================================================

var MCP_METHODS = {
  // 初始化
  INITIALIZE: 'initialize',
  INITIALIZED: 'notifications/initialized',
  // 工具相关
  TOOLS_LIST: 'tools/list',
  TOOLS_CALL: 'tools/call',
  // 资源相关
  RESOURCES_LIST: 'resources/list',
  RESOURCES_READ: 'resources/read',
  RESOURCES_SUBSCRIBE: 'resources/subscribe',
  RESOURCES_UNSUBSCRIBE: 'resources/unsubscribe',
  // Prompt相关
  PROMPTS_LIST: 'prompts/list',
  PROMPTS_GET: 'prompts/get',
  // 通用
  PING: 'ping',
  // 通知
  CANCELLED: 'notifications/cancelled',
  PROGRESS: 'notifications/progress',
  ROOTS_LIST_CHANGED: 'notifications/roots/list_changed',
  RESOURCES_LIST_CHANGED: 'notifications/resources/list_changed',
  RESOURCES_UPDATED: 'notifications/resources/updated',
  TOOLS_LIST_CHANGED: 'notifications/tools/list_changed',
  PROMPTS_LIST_CHANGED: 'notifications/prompts/list_changed'
};

/**
 * MCP客户端配置
 * @typedef {Object} MCPClientConfig
 * @property {string} transport - 传输方式: 'stdio' | 'http'
 * @property {string} [command] - 命令行程序 (stdio模式)
 * @property {string[]} [args] - 命令行参数 (stdio模式)
 * @property {Object} [env] - 环境变量 (stdio模式)
 * @property {string} [url] - HTTP端点 (http模式)
 * @property {number} [timeout] - 请求超时时间(毫秒)
 * @property {Object} [logger] - 日志实例
 */

/**
 * MCP客户端类
 * 
 * 功能特性：
 * - 支持stdio和HTTP传输
 * - JSON-RPC协议处理
 * - 请求/响应配对
 * - 自动重连机制
 * - 事件驱动架构
 */
var MCPClient = /*#__PURE__*/function (_EventEmitter) {
  /**
   * 构造函数
   * @param {MCPClientConfig} config - 客户端配置
   */
  function MCPClient(config) {
    var _this;
    _classCallCheck(this, MCPClient);
    _this = _callSuper(this, MCPClient);
    _this.config = _objectSpread2({
      transport: 'stdio',
      timeout: 30000
    }, config);
    _this.logger = _this.config.logger || new Logger('MCPClient');

    // 连接状态
    _this.connected = false;
    _this.initialized = false;

    // 请求管理
    _this.requestId = 1;
    _this.pendingRequests = new Map();

    // 传输层
    _this.transport = null;
    _this.process = null; // for stdio mode

    // 事件处理
    _this.setupEventHandlers();
    return _this;
  }

  /**
   * 设置事件处理器
   * @private
   */
  _inherits(MCPClient, _EventEmitter);
  return _createClass(MCPClient, [{
    key: "setupEventHandlers",
    value: function setupEventHandlers() {
      var _this2 = this;
      this.on('error', function (error) {
        _this2.logger.error('MCP Client error:', error);
      });
      this.on('disconnect', function () {
        _this2.connected = false;
        _this2.initialized = false;
        _this2.logger.info('MCP Client disconnected');
      });
    }

    /**
     * 连接到MCP服务器
     * @returns {Promise<void>}
     */
  }, {
    key: "connect",
    value: (function () {
      var _connect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!this.connected) {
                _context.n = 1;
                break;
              }
              throw new Error('Client is already connected');
            case 1:
              _context.p = 1;
              if (!(this.config.transport === 'stdio')) {
                _context.n = 3;
                break;
              }
              _context.n = 2;
              return this.connectStdio();
            case 2:
              _context.n = 6;
              break;
            case 3:
              if (!(this.config.transport === 'http')) {
                _context.n = 5;
                break;
              }
              _context.n = 4;
              return this.connectHttp();
            case 4:
              _context.n = 6;
              break;
            case 5:
              throw new Error("Unsupported transport: ".concat(this.config.transport));
            case 6:
              this.connected = true;
              this.emit('connect');
              this.logger.info('MCP Client connected');
              _context.n = 8;
              break;
            case 7:
              _context.p = 7;
              _t = _context.v;
              this.logger.error('Failed to connect:', _t);
              throw _t;
            case 8:
              return _context.a(2);
          }
        }, _callee, this, [[1, 7]]);
      }));
      function connect() {
        return _connect.apply(this, arguments);
      }
      return connect;
    }()
    /**
     * 连接到stdio传输
     * @private
     */
    )
  }, {
    key: "connectStdio",
    value: (function () {
      var _connectStdio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _this3 = this;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (this.config.command) {
                _context2.n = 1;
                break;
              }
              throw new Error('Command is required for stdio transport');
            case 1:
              return _context2.a(2, new Promise(function (resolve, reject) {
                try {
                  _this3.process = child_process.spawn(_this3.config.command, _this3.config.args || [], {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    env: _objectSpread2(_objectSpread2({}, process.env), _this3.config.env)
                  });
                  _this3.process.on('error', function (error) {
                    _this3.logger.error('Process error:', error);
                    _this3.emit('error', error);
                    reject(error);
                  });
                  _this3.process.on('exit', function (code, signal) {
                    _this3.logger.info("Process exited with code ".concat(code, ", signal ").concat(signal));
                    _this3.emit('disconnect');
                  });

                  // 设置输出处理
                  _this3.setupStdioHandlers();

                  // 等待进程启动
                  setTimeout(function () {
                    if (_this3.process && !_this3.process.killed) {
                      resolve();
                    } else {
                      reject(new Error('Process failed to start'));
                    }
                  }, 100);
                } catch (error) {
                  reject(error);
                }
              }));
          }
        }, _callee2, this);
      }));
      function connectStdio() {
        return _connectStdio.apply(this, arguments);
      }
      return connectStdio;
    }()
    /**
     * 设置stdio处理器
     * @private
     */
    )
  }, {
    key: "setupStdioHandlers",
    value: function setupStdioHandlers() {
      var _this4 = this;
      if (!this.process) return;
      var buffer = '';
      this.process.stdout.on('data', function (data) {
        buffer += data.toString();

        // 处理行分隔的JSON消息
        var lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留不完整的行
        var _iterator = _createForOfIteratorHelper(lines),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var line = _step.value;
            if (line.trim()) {
              _this4.handleMessage(line.trim());
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
      this.process.stderr.on('data', function (data) {
        _this4.logger.debug('Server stderr:', data.toString());
      });
    }

    /**
     * 连接到HTTP传输 
     * @private
     */
  }, {
    key: "connectHttp",
    value: (function () {
      var _connectHttp = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              if (this.config.url) {
                _context3.n = 1;
                break;
              }
              throw new Error('URL is required for http transport');
            case 1:
              // HTTP传输的实现
              // 这里可以使用fetch或其他HTTP客户端
              this.transport = {
                type: 'http',
                url: this.config.url
              };
            case 2:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function connectHttp() {
        return _connectHttp.apply(this, arguments);
      }
      return connectHttp;
    }()
    /**
     * 处理接收到的消息
     * @param {string} message - JSON消息字符串
     * @private
     */
    )
  }, {
    key: "handleMessage",
    value: function handleMessage(message) {
      try {
        var data = JSON.parse(message);
        this.logger.debug('Received message:', data);
        if (data.jsonrpc !== JSONRPC_VERSION) {
          this.logger.warn('Invalid JSON-RPC version:', data.jsonrpc);
          return;
        }

        // 处理响应
        if (data.id !== undefined && (data.result !== undefined || data.error !== undefined)) {
          this.handleResponse(data);
        }
        // 处理通知
        else if (data.method && data.id === undefined) {
          this.handleNotification(data);
        }
        // 处理其他消息类型
        else {
          this.logger.debug('Unhandled message type:', data);
        }
      } catch (error) {
        this.logger.error('Failed to parse message:', error, 'Raw message:', message);
      }
    }

    /**
     * 处理响应消息
     * @param {Object} response - 响应对象
     * @private
     */
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      var requestId = response.id;
      var pending = this.pendingRequests.get(requestId);
      if (pending) {
        this.pendingRequests["delete"](requestId);
        clearTimeout(pending.timeout);
        if (response.error) {
          pending.reject(new Error("MCP Error ".concat(response.error.code, ": ").concat(response.error.message)));
        } else {
          pending.resolve(response.result);
        }
      } else {
        this.logger.warn('Received response for unknown request ID:', requestId);
      }
    }

    /**
     * 处理通知消息
     * @param {Object} notification - 通知对象
     * @private
     */
  }, {
    key: "handleNotification",
    value: function handleNotification(notification) {
      this.emit('notification', notification);

      // 处理特定通知
      switch (notification.method) {
        case MCP_METHODS.INITIALIZED:
          this.initialized = true;
          this.emit('initialized');
          break;
        case MCP_METHODS.TOOLS_LIST_CHANGED:
          this.emit('toolsChanged');
          break;
        case MCP_METHODS.RESOURCES_LIST_CHANGED:
          this.emit('resourcesChanged');
          break;
        default:
          this.logger.debug('Unhandled notification:', notification.method);
      }
    }

    /**
     * 发送请求
     * @param {string} method - 请求方法
     * @param {any} [params] - 请求参数
     * @param {number} [timeout] - 超时时间
     * @returns {Promise<any>} 响应结果
     */
  }, {
    key: "sendRequest",
    value: (function () {
      var _sendRequest = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(method, params, timeout) {
        var _this5 = this;
        var requestId, request;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              if (this.connected) {
                _context4.n = 1;
                break;
              }
              throw new Error('Client is not connected');
            case 1:
              requestId = this.requestId++;
              request = createJsonRpcRequest(method, params, requestId);
              return _context4.a(2, new Promise(function (resolve, reject) {
                // 设置超时
                var timeoutMs = timeout || _this5.config.timeout;
                var timeoutHandle = setTimeout(function () {
                  _this5.pendingRequests["delete"](requestId);
                  reject(new Error("Request timeout after ".concat(timeoutMs, "ms")));
                }, timeoutMs);

                // 存储待处理请求
                _this5.pendingRequests.set(requestId, {
                  resolve: resolve,
                  reject: reject,
                  timeout: timeoutHandle
                });

                // 发送请求
                _this5.sendMessage(request)["catch"](reject);
              }));
          }
        }, _callee4, this);
      }));
      function sendRequest(_x, _x2, _x3) {
        return _sendRequest.apply(this, arguments);
      }
      return sendRequest;
    }()
    /**
     * 发送消息
     * @param {Object} message - 要发送的消息
     * @private
     */
    )
  }, {
    key: "sendMessage",
    value: (function () {
      var _sendMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(message) {
        var _this6 = this;
        var messageStr, response;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              messageStr = JSON.stringify(message);
              this.logger.debug('Sending message:', messageStr);
              if (!(this.config.transport === 'stdio')) {
                _context5.n = 2;
                break;
              }
              if (!(!this.process || !this.process.stdin)) {
                _context5.n = 1;
                break;
              }
              throw new Error('Process stdin not available');
            case 1:
              return _context5.a(2, new Promise(function (resolve, reject) {
                _this6.process.stdin.write(messageStr + '\n', function (error) {
                  if (error) {
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              }));
            case 2:
              if (!(this.config.transport === 'http')) {
                _context5.n = 4;
                break;
              }
              _context5.n = 3;
              return fetch(this.transport.url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: messageStr
              });
            case 3:
              response = _context5.v;
              if (response.ok) {
                _context5.n = 4;
                break;
              }
              throw new Error("HTTP error: ".concat(response.status));
            case 4:
              return _context5.a(2);
          }
        }, _callee5, this);
      }));
      function sendMessage(_x4) {
        return _sendMessage.apply(this, arguments);
      }
      return sendMessage;
    }()
    /**
     * 初始化客户端
     * @param {Object} params - 初始化参数
     * @returns {Promise<Object>} 初始化结果
     */
    )
  }, {
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var params,
          initParams,
          result,
          _args6 = arguments;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              params = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
              initParams = _objectSpread2({
                protocolVersion: '2024-11-05',
                capabilities: {
                  roots: {
                    listChanged: true
                  },
                  sampling: {},
                  experimental: {}
                },
                clientInfo: {
                  name: 'agent-core-mcp-client',
                  version: '1.0.0'
                }
              }, params);
              _context6.n = 1;
              return this.sendRequest(MCP_METHODS.INITIALIZE, initParams);
            case 1:
              result = _context6.v;
              _context6.n = 2;
              return this.sendNotification(MCP_METHODS.INITIALIZED);
            case 2:
              return _context6.a(2, result);
          }
        }, _callee6, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * 发送通知
     * @param {string} method - 通知方法
     * @param {any} [params] - 通知参数
     */
    )
  }, {
    key: "sendNotification",
    value: (function () {
      var _sendNotification = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(method, params) {
        var notification;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              notification = _objectSpread2({
                jsonrpc: JSONRPC_VERSION,
                method: method
              }, params && {
                params: params
              });
              _context7.n = 1;
              return this.sendMessage(notification);
            case 1:
              return _context7.a(2);
          }
        }, _callee7, this);
      }));
      function sendNotification(_x5, _x6) {
        return _sendNotification.apply(this, arguments);
      }
      return sendNotification;
    }()
    /**
     * 断开连接
     */
    )
  }, {
    key: "disconnect",
    value: (function () {
      var _disconnect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var _iterator2, _step2, _step2$value, id, pending;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              if (this.connected) {
                _context8.n = 1;
                break;
              }
              return _context8.a(2);
            case 1:
              // 清理待处理请求
              _iterator2 = _createForOfIteratorHelper(this.pendingRequests);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _step2$value = _slicedToArray(_step2.value, 2), id = _step2$value[0], pending = _step2$value[1];
                  clearTimeout(pending.timeout);
                  pending.reject(new Error('Client disconnected'));
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              this.pendingRequests.clear();

              // 关闭传输
              if (this.process) {
                this.process.kill();
                this.process = null;
              }
              this.connected = false;
              this.initialized = false;
              this.emit('disconnect');
            case 2:
              return _context8.a(2);
          }
        }, _callee8, this);
      }));
      function disconnect() {
        return _disconnect.apply(this, arguments);
      }
      return disconnect;
    }()
    /**
     * 获取连接状态
     * @returns {boolean} 是否已连接
     */
    )
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.connected;
    }

    /**
     * 获取初始化状态  
     * @returns {boolean} 是否已初始化
     */
  }, {
    key: "isInitialized",
    value: function isInitialized() {
      return this.initialized;
    }

    // ==================== 便捷方法 ====================

    /**
     * 获取工具列表
     * @returns {Promise<Array>} 工具列表
     */
  }, {
    key: "listTools",
    value: function () {
      var _listTools = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var result;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return this.sendRequest(MCP_METHODS.TOOLS_LIST);
            case 1:
              result = _context9.v;
              return _context9.a(2, result.tools || []);
          }
        }, _callee9, this);
      }));
      function listTools() {
        return _listTools.apply(this, arguments);
      }
      return listTools;
    }()
    /**
     * 调用工具
     * @param {string} name - 工具名称
     * @param {Object} [args] - 工具参数
     * @returns {Promise<Object>} 工具调用结果
     */
  }, {
    key: "callTool",
    value: (function () {
      var _callTool = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(name, args) {
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              _context0.n = 1;
              return this.sendRequest(MCP_METHODS.TOOLS_CALL, {
                name: name,
                arguments: args
              });
            case 1:
              return _context0.a(2, _context0.v);
          }
        }, _callee0, this);
      }));
      function callTool(_x7, _x8) {
        return _callTool.apply(this, arguments);
      }
      return callTool;
    }()
    /**
     * 获取资源列表
     * @returns {Promise<Array>} 资源列表
     */
    )
  }, {
    key: "listResources",
    value: (function () {
      var _listResources = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var result;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return this.sendRequest(MCP_METHODS.RESOURCES_LIST);
            case 1:
              result = _context1.v;
              return _context1.a(2, result.resources || []);
          }
        }, _callee1, this);
      }));
      function listResources() {
        return _listResources.apply(this, arguments);
      }
      return listResources;
    }()
    /**
     * 读取资源
     * @param {string} uri - 资源URI
     * @returns {Promise<Object>} 资源内容
     */
    )
  }, {
    key: "readResource",
    value: (function () {
      var _readResource = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(uri) {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return this.sendRequest(MCP_METHODS.RESOURCES_READ, {
                uri: uri
              });
            case 1:
              return _context10.a(2, _context10.v);
          }
        }, _callee10, this);
      }));
      function readResource(_x9) {
        return _readResource.apply(this, arguments);
      }
      return readResource;
    }()
    /**
     * 获取Prompt列表
     * @returns {Promise<Array>} Prompt列表
     */
    )
  }, {
    key: "listPrompts",
    value: (function () {
      var _listPrompts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        var result;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              _context11.n = 1;
              return this.sendRequest(MCP_METHODS.PROMPTS_LIST);
            case 1:
              result = _context11.v;
              return _context11.a(2, result.prompts || []);
          }
        }, _callee11, this);
      }));
      function listPrompts() {
        return _listPrompts.apply(this, arguments);
      }
      return listPrompts;
    }()
    /**
     * 获取Prompt
     * @param {string} name - Prompt名称
     * @param {Object} [args] - Prompt参数
     * @returns {Promise<Object>} Prompt内容
     */
    )
  }, {
    key: "getPrompt",
    value: (function () {
      var _getPrompt = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(name, args) {
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              _context12.n = 1;
              return this.sendRequest(MCP_METHODS.PROMPTS_GET, {
                name: name,
                arguments: args
              });
            case 1:
              return _context12.a(2, _context12.v);
          }
        }, _callee12, this);
      }));
      function getPrompt(_x0, _x1) {
        return _getPrompt.apply(this, arguments);
      }
      return getPrompt;
    }()
    /**
     * Ping服务器
     * @returns {Promise<Object>} Ping结果
     */
    )
  }, {
    key: "ping",
    value: (function () {
      var _ping = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              _context13.n = 1;
              return this.sendRequest(MCP_METHODS.PING);
            case 1:
              return _context13.a(2, _context13.v);
          }
        }, _callee13, this);
      }));
      function ping() {
        return _ping.apply(this, arguments);
      }
      return ping;
    }())
  }]);
}(events.EventEmitter);

/**
 * MCP服务器配置
 * @typedef {Object} MCPServerConfig
 * @property {string} name - 服务器名称
 * @property {string} transport - 传输方式
 * @property {string} [command] - 命令行程序
 * @property {string[]} [args] - 命令行参数
 * @property {Object} [env] - 环境变量
 * @property {string} [url] - HTTP端点
 * @property {number} [maxRetries] - 最大重试次数
 * @property {number} [retryDelay] - 重试延迟(毫秒)
 * @property {boolean} [autoReconnect] - 是否自动重连
 * @property {Object} [capabilities] - 服务器能力
 */

/**
 * 连接管理器配置
 * @typedef {Object} MCPConnectionManagerConfig
 * @property {MCPServerConfig[]} servers - MCP服务器列表
 * @property {number} [maxConnections] - 最大连接数
 * @property {number} [connectionTimeout] - 连接超时时间
 * @property {number} [healthCheckInterval] - 健康检查间隔
 * @property {string} [loadBalanceStrategy] - 负载均衡策略: 'round-robin' | 'random' | 'least-connections'
 * @property {Object} [logger] - 日志实例
 */

/**
 * 连接状态枚举
 */
var CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  INITIALIZING: 'initializing',
  READY: 'ready',
  ERROR: 'error',
  RECONNECTING: 'reconnecting'
};

/**
 * 连接信息
 * @typedef {Object} ConnectionInfo
 * @property {string} name - 连接名称
 * @property {MCPClient} client - MCP客户端实例
 * @property {string} status - 连接状态
 * @property {Date} connectedAt - 连接时间
 * @property {Date} lastActivity - 最后活动时间
 * @property {number} requestCount - 请求计数
 * @property {number} errorCount - 错误计数
 * @property {number} retryCount - 重试计数
 * @property {MCPServerConfig} config - 服务器配置
 */

/**
 * MCP连接管理器
 * 
 * 功能特性：
 * - 管理多个MCP服务器连接
 * - 连接池和负载均衡
 * - 自动重连和故障转移
 * - 健康检查和监控
 * - 工具发现和路由
 */
var MCPConnectionManager = /*#__PURE__*/function (_EventEmitter) {
  /**
   * 构造函数
   * @param {MCPConnectionManagerConfig} config - 管理器配置
   */
  function MCPConnectionManager(config) {
    var _this;
    _classCallCheck(this, MCPConnectionManager);
    _this = _callSuper(this, MCPConnectionManager);
    _this.config = _objectSpread2({
      maxConnections: 10,
      connectionTimeout: 30000,
      healthCheckInterval: 60000,
      // 1分钟
      loadBalanceStrategy: 'round-robin'
    }, config);
    _this.logger = _this.config.logger || new Logger('MCPConnectionManager');

    // 连接管理
    _this.connections = new Map(); // name -> ConnectionInfo
    _this.toolRegistry = new Map(); // toolName -> connectionName[]
    _this.nextConnectionIndex = 0; // for round-robin

    // 状态管理
    _this.isShuttingDown = false;
    _this.healthCheckTimer = null;

    // 设置事件处理
    _this.setupEventHandlers();
    return _this;
  }

  /**
   * 设置事件处理器
   * @private
   */
  _inherits(MCPConnectionManager, _EventEmitter);
  return _createClass(MCPConnectionManager, [{
    key: "setupEventHandlers",
    value: function setupEventHandlers() {
      var _this2 = this;
      this.on('error', function (error) {
        _this2.logger.error('Connection Manager error:', error);
      });
    }

    /**
     * 初始化管理器
     * @returns {Promise<void>}
     */
  }, {
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this3 = this;
        var connectionPromises, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              this.logger.info('Initializing MCP Connection Manager');
              _context.p = 1;
              // 启动所有配置的连接
              connectionPromises = this.config.servers.map(function (serverConfig) {
                return _this3.addConnection(serverConfig);
              });
              _context.n = 2;
              return Promise.allSettled(connectionPromises);
            case 2:
              // 启动健康检查
              this.startHealthCheck();

              // 初始化工具注册表
              _context.n = 3;
              return this.refreshToolRegistry();
            case 3:
              this.logger.info("Initialized with ".concat(this.connections.size, " connections"));
              this.emit('initialized');
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _t = _context.v;
              this.logger.error('Failed to initialize:', _t);
              throw _t;
            case 5:
              return _context.a(2);
          }
        }, _callee, this, [[1, 4]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * 添加连接
     * @param {MCPServerConfig} serverConfig - 服务器配置
     * @returns {Promise<ConnectionInfo>}
     */
    )
  }, {
    key: "addConnection",
    value: (function () {
      var _addConnection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(serverConfig) {
        var name, connectionInfo, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              name = serverConfig.name;
              if (!this.connections.has(name)) {
                _context2.n = 1;
                break;
              }
              throw new Error("Connection '".concat(name, "' already exists"));
            case 1:
              if (!(this.connections.size >= this.config.maxConnections)) {
                _context2.n = 2;
                break;
              }
              throw new Error("Maximum connections limit (".concat(this.config.maxConnections, ") reached"));
            case 2:
              connectionInfo = {
                name: name,
                client: null,
                status: CONNECTION_STATUS.DISCONNECTED,
                connectedAt: null,
                lastActivity: new Date(),
                requestCount: 0,
                errorCount: 0,
                retryCount: 0,
                config: _objectSpread2({
                  maxRetries: 3,
                  retryDelay: 5000,
                  autoReconnect: true
                }, serverConfig)
              };
              this.connections.set(name, connectionInfo);
              _context2.p = 3;
              _context2.n = 4;
              return this.connectServer(connectionInfo);
            case 4:
              this.emit('connectionAdded', connectionInfo);
              return _context2.a(2, connectionInfo);
            case 5:
              _context2.p = 5;
              _t2 = _context2.v;
              this.logger.error("Failed to add connection '".concat(name, "':"), _t2);
              this.connections["delete"](name);
              throw _t2;
            case 6:
              return _context2.a(2);
          }
        }, _callee2, this, [[3, 5]]);
      }));
      function addConnection(_x) {
        return _addConnection.apply(this, arguments);
      }
      return addConnection;
    }()
    /**
     * 连接到服务器
     * @param {ConnectionInfo} connectionInfo - 连接信息
     * @private
     */
    )
  }, {
    key: "connectServer",
    value: (function () {
      var _connectServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(connectionInfo) {
        var name, config, client, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              name = connectionInfo.name, config = connectionInfo.config;
              _context3.p = 1;
              connectionInfo.status = CONNECTION_STATUS.CONNECTING;
              this.emit('connectionStatusChanged', name, CONNECTION_STATUS.CONNECTING);

              // 创建客户端
              client = new MCPClient({
                transport: config.transport,
                command: config.command,
                args: config.args,
                env: config.env,
                url: config.url,
                timeout: this.config.connectionTimeout,
                logger: this.logger
              }); // 设置客户端事件处理
              this.setupClientEventHandlers(client, connectionInfo);

              // 连接客户端
              _context3.n = 2;
              return client.connect();
            case 2:
              connectionInfo.status = CONNECTION_STATUS.CONNECTED;
              this.emit('connectionStatusChanged', name, CONNECTION_STATUS.CONNECTED);

              // 初始化客户端
              connectionInfo.status = CONNECTION_STATUS.INITIALIZING;
              _context3.n = 3;
              return client.initialize();
            case 3:
              // 更新连接信息
              connectionInfo.client = client;
              connectionInfo.status = CONNECTION_STATUS.READY;
              connectionInfo.connectedAt = new Date();
              connectionInfo.retryCount = 0;
              this.emit('connectionStatusChanged', name, CONNECTION_STATUS.READY);
              this.logger.info("Connected to MCP server '".concat(name, "'"));
              _context3.n = 5;
              break;
            case 4:
              _context3.p = 4;
              _t3 = _context3.v;
              connectionInfo.status = CONNECTION_STATUS.ERROR;
              connectionInfo.errorCount++;
              this.emit('connectionStatusChanged', name, CONNECTION_STATUS.ERROR);
              throw _t3;
            case 5:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 4]]);
      }));
      function connectServer(_x2) {
        return _connectServer.apply(this, arguments);
      }
      return connectServer;
    }()
    /**
     * 设置客户端事件处理器
     * @param {MCPClient} client - 客户端实例
     * @param {ConnectionInfo} connectionInfo - 连接信息
     * @private
     */
    )
  }, {
    key: "setupClientEventHandlers",
    value: function setupClientEventHandlers(client, connectionInfo) {
      var _this4 = this;
      var name = connectionInfo.name;
      client.on('disconnect', function () {
        connectionInfo.status = CONNECTION_STATUS.DISCONNECTED;
        _this4.emit('connectionStatusChanged', name, CONNECTION_STATUS.DISCONNECTED);

        // 自动重连
        if (connectionInfo.config.autoReconnect && !_this4.isShuttingDown) {
          _this4.scheduleReconnect(connectionInfo);
        }
      });
      client.on('error', function (error) {
        connectionInfo.errorCount++;
        _this4.logger.error("Client error for '".concat(name, "':"), error);
        _this4.emit('connectionError', name, error);
      });
      client.on('toolsChanged', function () {
        _this4.refreshToolRegistry();
      });
    }

    /**
     * 安排重连
     * @param {ConnectionInfo} connectionInfo - 连接信息
     * @private
     */
  }, {
    key: "scheduleReconnect",
    value: function scheduleReconnect(connectionInfo) {
      var _this5 = this;
      var name = connectionInfo.name,
        config = connectionInfo.config;
      if (connectionInfo.retryCount >= config.maxRetries) {
        this.logger.error("Max retries reached for connection '".concat(name, "'"));
        return;
      }
      connectionInfo.retryCount++;
      connectionInfo.status = CONNECTION_STATUS.RECONNECTING;
      this.emit('connectionStatusChanged', name, CONNECTION_STATUS.RECONNECTING);
      var delay = config.retryDelay * Math.pow(2, connectionInfo.retryCount - 1); // 指数退避

      setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              if (!(!_this5.isShuttingDown && _this5.connections.has(name))) {
                _context4.n = 4;
                break;
              }
              _context4.p = 1;
              _context4.n = 2;
              return _this5.connectServer(connectionInfo);
            case 2:
              _context4.n = 4;
              break;
            case 3:
              _context4.p = 3;
              _t4 = _context4.v;
              _this5.logger.error("Reconnect failed for '".concat(name, "':"), _t4);
              _this5.scheduleReconnect(connectionInfo);
            case 4:
              return _context4.a(2);
          }
        }, _callee4, null, [[1, 3]]);
      })), delay);
    }

    /**
     * 移除连接
     * @param {string} name - 连接名称
     * @returns {Promise<void>}
     */
  }, {
    key: "removeConnection",
    value: (function () {
      var _removeConnection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(name) {
        var connectionInfo, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              connectionInfo = this.connections.get(name);
              if (connectionInfo) {
                _context5.n = 1;
                break;
              }
              throw new Error("Connection '".concat(name, "' not found"));
            case 1:
              _context5.p = 1;
              if (!connectionInfo.client) {
                _context5.n = 2;
                break;
              }
              _context5.n = 2;
              return connectionInfo.client.disconnect();
            case 2:
              _context5.n = 4;
              break;
            case 3:
              _context5.p = 3;
              _t5 = _context5.v;
              this.logger.error("Error disconnecting '".concat(name, "':"), _t5);
            case 4:
              this.connections["delete"](name);
              this.emit('connectionRemoved', name);

              // 更新工具注册表
              _context5.n = 5;
              return this.refreshToolRegistry();
            case 5:
              return _context5.a(2);
          }
        }, _callee5, this, [[1, 3]]);
      }));
      function removeConnection(_x3) {
        return _removeConnection.apply(this, arguments);
      }
      return removeConnection;
    }()
    /**
     * 获取可用连接
     * @param {string} [toolName] - 工具名称（可选，用于工具路由）
     * @returns {ConnectionInfo|null}
     */
    )
  }, {
    key: "getAvailableConnection",
    value: function getAvailableConnection(toolName) {
      var _this6 = this;
      // 如果指定了工具名称，尝试找到支持该工具的连接
      if (toolName) {
        var _availableConnections = this.toolRegistry.get(toolName);
        if (_availableConnections && _availableConnections.length > 0) {
          return this.selectConnection(_availableConnections.map(function (name) {
            return _this6.connections.get(name);
          }));
        }
      }

      // 否则从所有可用连接中选择
      var availableConnections = Array.from(this.connections.values()).filter(function (conn) {
        return conn.status === CONNECTION_STATUS.READY;
      });
      return this.selectConnection(availableConnections);
    }

    /**
     * 根据负载均衡策略选择连接
     * @param {ConnectionInfo[]} connections - 可选连接列表
     * @returns {ConnectionInfo|null}
     * @private
     */
  }, {
    key: "selectConnection",
    value: function selectConnection(connections) {
      if (!connections || connections.length === 0) {
        return null;
      }
      switch (this.config.loadBalanceStrategy) {
        case 'round-robin':
          var selected = connections[this.nextConnectionIndex % connections.length];
          this.nextConnectionIndex++;
          return selected;
        case 'random':
          return connections[Math.floor(Math.random() * connections.length)];
        case 'least-connections':
          return connections.reduce(function (min, conn) {
            return conn.requestCount < min.requestCount ? conn : min;
          });
        default:
          return connections[0];
      }
    }

    /**
     * 执行工具调用
     * @param {string} toolName - 工具名称
     * @param {Object} [args] - 工具参数
     * @returns {Promise<Object>} 工具调用结果
     */
  }, {
    key: "callTool",
    value: (function () {
      var _callTool = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(toolName, args) {
        var connection, result, _t6;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              connection = this.getAvailableConnection(toolName);
              if (connection) {
                _context6.n = 1;
                break;
              }
              throw new Error("No available connection for tool '".concat(toolName, "'"));
            case 1:
              _context6.p = 1;
              connection.requestCount++;
              connection.lastActivity = new Date();
              _context6.n = 2;
              return connection.client.callTool(toolName, args);
            case 2:
              result = _context6.v;
              this.emit('toolCalled', {
                toolName: toolName,
                args: args,
                result: result,
                connection: connection.name
              });
              return _context6.a(2, result);
            case 3:
              _context6.p = 3;
              _t6 = _context6.v;
              connection.errorCount++;
              this.logger.error("Tool call failed for '".concat(toolName, "' on '").concat(connection.name, "':"), _t6);
              throw _t6;
            case 4:
              return _context6.a(2);
          }
        }, _callee6, this, [[1, 3]]);
      }));
      function callTool(_x4, _x5) {
        return _callTool.apply(this, arguments);
      }
      return callTool;
    }()
    /**
     * 获取所有可用工具
     * @returns {Promise<Array>} 工具列表
     */
    )
  }, {
    key: "getAllTools",
    value: (function () {
      var _getAllTools = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var _this7 = this;
        var toolsMap, _iterator, _step, _loop, _t8;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              toolsMap = new Map();
              _iterator = _createForOfIteratorHelper(this.connections);
              _context8.p = 1;
              _loop = /*#__PURE__*/_regenerator().m(function _loop() {
                var _step$value, name, connectionInfo, tools, _t7;
                return _regenerator().w(function (_context7) {
                  while (1) switch (_context7.p = _context7.n) {
                    case 0:
                      _step$value = _slicedToArray(_step.value, 2), name = _step$value[0], connectionInfo = _step$value[1];
                      if (!(connectionInfo.status === CONNECTION_STATUS.READY)) {
                        _context7.n = 4;
                        break;
                      }
                      _context7.p = 1;
                      _context7.n = 2;
                      return connectionInfo.client.listTools();
                    case 2:
                      tools = _context7.v;
                      tools.forEach(function (tool) {
                        if (!toolsMap.has(tool.name)) {
                          toolsMap.set(tool.name, _objectSpread2(_objectSpread2({}, tool), {}, {
                            connections: [name]
                          }));
                        } else {
                          toolsMap.get(tool.name).connections.push(name);
                        }
                      });
                      _context7.n = 4;
                      break;
                    case 3:
                      _context7.p = 3;
                      _t7 = _context7.v;
                      _this7.logger.error("Failed to get tools from '".concat(name, "':"), _t7);
                    case 4:
                      return _context7.a(2);
                  }
                }, _loop, null, [[1, 3]]);
              });
              _iterator.s();
            case 2:
              if ((_step = _iterator.n()).done) {
                _context8.n = 4;
                break;
              }
              return _context8.d(_regeneratorValues(_loop()), 3);
            case 3:
              _context8.n = 2;
              break;
            case 4:
              _context8.n = 6;
              break;
            case 5:
              _context8.p = 5;
              _t8 = _context8.v;
              _iterator.e(_t8);
            case 6:
              _context8.p = 6;
              _iterator.f();
              return _context8.f(6);
            case 7:
              return _context8.a(2, Array.from(toolsMap.values()));
          }
        }, _callee7, this, [[1, 5, 6, 7]]);
      }));
      function getAllTools() {
        return _getAllTools.apply(this, arguments);
      }
      return getAllTools;
    }()
    /**
     * 刷新工具注册表
     * @private
     */
    )
  }, {
    key: "refreshToolRegistry",
    value: (function () {
      var _refreshToolRegistry = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var _this8 = this;
        var _iterator2, _step2, _loop2, _t0;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              this.toolRegistry.clear();
              _iterator2 = _createForOfIteratorHelper(this.connections);
              _context0.p = 1;
              _loop2 = /*#__PURE__*/_regenerator().m(function _loop2() {
                var _step2$value, name, connectionInfo, tools, _t9;
                return _regenerator().w(function (_context9) {
                  while (1) switch (_context9.p = _context9.n) {
                    case 0:
                      _step2$value = _slicedToArray(_step2.value, 2), name = _step2$value[0], connectionInfo = _step2$value[1];
                      if (!(connectionInfo.status === CONNECTION_STATUS.READY)) {
                        _context9.n = 4;
                        break;
                      }
                      _context9.p = 1;
                      _context9.n = 2;
                      return connectionInfo.client.listTools();
                    case 2:
                      tools = _context9.v;
                      tools.forEach(function (tool) {
                        if (!_this8.toolRegistry.has(tool.name)) {
                          _this8.toolRegistry.set(tool.name, []);
                        }
                        _this8.toolRegistry.get(tool.name).push(name);
                      });
                      _context9.n = 4;
                      break;
                    case 3:
                      _context9.p = 3;
                      _t9 = _context9.v;
                      _this8.logger.error("Failed to refresh tools from '".concat(name, "':"), _t9);
                    case 4:
                      return _context9.a(2);
                  }
                }, _loop2, null, [[1, 3]]);
              });
              _iterator2.s();
            case 2:
              if ((_step2 = _iterator2.n()).done) {
                _context0.n = 4;
                break;
              }
              return _context0.d(_regeneratorValues(_loop2()), 3);
            case 3:
              _context0.n = 2;
              break;
            case 4:
              _context0.n = 6;
              break;
            case 5:
              _context0.p = 5;
              _t0 = _context0.v;
              _iterator2.e(_t0);
            case 6:
              _context0.p = 6;
              _iterator2.f();
              return _context0.f(6);
            case 7:
              this.emit('toolRegistryUpdated', this.toolRegistry);
            case 8:
              return _context0.a(2);
          }
        }, _callee8, this, [[1, 5, 6, 7]]);
      }));
      function refreshToolRegistry() {
        return _refreshToolRegistry.apply(this, arguments);
      }
      return refreshToolRegistry;
    }()
    /**
     * 启动健康检查
     * @private
     */
    )
  }, {
    key: "startHealthCheck",
    value: function startHealthCheck() {
      var _this9 = this;
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
      }
      this.healthCheckTimer = setInterval(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return _this9.performHealthCheck();
            case 1:
              return _context1.a(2);
          }
        }, _callee9);
      })), this.config.healthCheckInterval);
    }

    /**
     * 执行健康检查
     * @private
     */
  }, {
    key: "performHealthCheck",
    value: (function () {
      var _performHealthCheck = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _iterator3, _step3, _step3$value, name, connectionInfo, _t1, _t10;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _iterator3 = _createForOfIteratorHelper(this.connections);
              _context10.p = 1;
              _iterator3.s();
            case 2:
              if ((_step3 = _iterator3.n()).done) {
                _context10.n = 7;
                break;
              }
              _step3$value = _slicedToArray(_step3.value, 2), name = _step3$value[0], connectionInfo = _step3$value[1];
              if (!(connectionInfo.status === CONNECTION_STATUS.READY)) {
                _context10.n = 6;
                break;
              }
              _context10.p = 3;
              _context10.n = 4;
              return connectionInfo.client.ping();
            case 4:
              connectionInfo.lastActivity = new Date();
              _context10.n = 6;
              break;
            case 5:
              _context10.p = 5;
              _t1 = _context10.v;
              this.logger.warn("Health check failed for '".concat(name, "':"), _t1);
              connectionInfo.errorCount++;

              // 如果ping失败，标记为错误状态并尝试重连
              connectionInfo.status = CONNECTION_STATUS.ERROR;
              this.emit('connectionStatusChanged', name, CONNECTION_STATUS.ERROR);
              if (connectionInfo.config.autoReconnect) {
                this.scheduleReconnect(connectionInfo);
              }
            case 6:
              _context10.n = 2;
              break;
            case 7:
              _context10.n = 9;
              break;
            case 8:
              _context10.p = 8;
              _t10 = _context10.v;
              _iterator3.e(_t10);
            case 9:
              _context10.p = 9;
              _iterator3.f();
              return _context10.f(9);
            case 10:
              return _context10.a(2);
          }
        }, _callee0, this, [[3, 5], [1, 8, 9, 10]]);
      }));
      function performHealthCheck() {
        return _performHealthCheck.apply(this, arguments);
      }
      return performHealthCheck;
    }()
    /**
     * 获取连接状态
     * @returns {Object} 连接状态摘要
     */
    )
  }, {
    key: "getStatus",
    value: function getStatus() {
      var status = {
        totalConnections: this.connections.size,
        readyConnections: 0,
        errorConnections: 0,
        connectingConnections: 0,
        connections: {}
      };
      var _iterator4 = _createForOfIteratorHelper(this.connections),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _step4$value = _slicedToArray(_step4.value, 2),
            name = _step4$value[0],
            info = _step4$value[1];
          status.connections[name] = {
            status: info.status,
            connectedAt: info.connectedAt,
            lastActivity: info.lastActivity,
            requestCount: info.requestCount,
            errorCount: info.errorCount,
            retryCount: info.retryCount
          };
          switch (info.status) {
            case CONNECTION_STATUS.READY:
              status.readyConnections++;
              break;
            case CONNECTION_STATUS.ERROR:
              status.errorConnections++;
              break;
            case CONNECTION_STATUS.CONNECTING:
            case CONNECTION_STATUS.INITIALIZING:
            case CONNECTION_STATUS.RECONNECTING:
              status.connectingConnections++;
              break;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      return status;
    }

    /**
     * 关闭管理器
     * @returns {Promise<void>}
     */
  }, {
    key: "shutdown",
    value: (function () {
      var _shutdown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        var _this0 = this;
        var disconnectPromises;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              this.logger.info('Shutting down MCP Connection Manager');
              this.isShuttingDown = true;

              // 停止健康检查
              if (this.healthCheckTimer) {
                clearInterval(this.healthCheckTimer);
                this.healthCheckTimer = null;
              }

              // 关闭所有连接
              disconnectPromises = Array.from(this.connections.values()).map(/*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(connectionInfo) {
                  var _t11;
                  return _regenerator().w(function (_context11) {
                    while (1) switch (_context11.p = _context11.n) {
                      case 0:
                        _context11.p = 0;
                        if (!connectionInfo.client) {
                          _context11.n = 1;
                          break;
                        }
                        _context11.n = 1;
                        return connectionInfo.client.disconnect();
                      case 1:
                        _context11.n = 3;
                        break;
                      case 2:
                        _context11.p = 2;
                        _t11 = _context11.v;
                        _this0.logger.error("Error disconnecting '".concat(connectionInfo.name, "':"), _t11);
                      case 3:
                        return _context11.a(2);
                    }
                  }, _callee1, null, [[0, 2]]);
                }));
                return function (_x6) {
                  return _ref3.apply(this, arguments);
                };
              }());
              _context12.n = 1;
              return Promise.allSettled(disconnectPromises);
            case 1:
              this.connections.clear();
              this.toolRegistry.clear();
              this.emit('shutdown');
              this.logger.info('MCP Connection Manager shutdown complete');
            case 2:
              return _context12.a(2);
          }
        }, _callee10, this);
      }));
      function shutdown() {
        return _shutdown.apply(this, arguments);
      }
      return shutdown;
    }())
  }]);
}(events.EventEmitter);

/**
 * 工具执行上下文
 * @typedef {Object} ToolExecutionContext
 * @property {string} toolName - 工具名称
 * @property {Object} args - 工具参数
 * @property {string} connectionName - 连接名称
 * @property {Date} startTime - 开始时间
 * @property {string} [sessionId] - 会话ID
 * @property {Object} [metadata] - 元数据
 */

/**
 * 工具执行结果
 * @typedef {Object} ToolExecutionResult
 * @property {boolean} success - 是否成功
 * @property {Object} [data] - 结果数据
 * @property {string} [error] - 错误信息
 * @property {number} duration - 执行时间(毫秒)
 * @property {ToolExecutionContext} context - 执行上下文
 */

/**
 * 工具验证规则
 * @typedef {Object} ToolValidationRule
 * @property {string} field - 字段名
 * @property {string} type - 类型: 'string' | 'number' | 'boolean' | 'object' | 'array'
 * @property {boolean} [required] - 是否必需
 * @property {any} [default] - 默认值
 * @property {function} [validator] - 自定义验证函数
 * @property {string} [pattern] - 正则表达式模式 (string类型)
 * @property {number} [min] - 最小值 (number类型)
 * @property {number} [max] - 最大值 (number类型)
 * @property {Array} [enum] - 枚举值
 */

/**
 * MCP工具系统
 * 
 * 功能特性：
 * - 工具发现和注册
 * - 参数验证
 * - 结果处理和转换
 * - 工具链执行
 * - 性能监控
 */
var MCPToolSystem = /*#__PURE__*/function (_EventEmitter) {
  /**
   * 构造函数
   * @param {Object} config - 配置选项
   * @param {Object} config.connectionManager - MCP连接管理器实例
   * @param {Object} [config.logger] - 日志实例
   * @param {boolean} [config.enableValidation] - 是否启用参数验证
   * @param {boolean} [config.enableMetrics] - 是否启用性能指标
   */
  function MCPToolSystem(config) {
    var _this;
    _classCallCheck(this, MCPToolSystem);
    _this = _callSuper(this, MCPToolSystem);
    _this.connectionManager = config.connectionManager;
    _this.logger = config.logger || new Logger('MCPToolSystem');
    _this.enableValidation = config.enableValidation !== false;
    _this.enableMetrics = config.enableMetrics !== false;

    // 工具注册表和缓存
    _this.toolRegistry = new Map(); // toolName -> ToolDefinition
    _this.validationRules = new Map(); // toolName -> ValidationRule[]
    _this.resultProcessors = new Map(); // toolName -> function
    _this.executionHistory = []; // 执行历史
    _this.metrics = new Map(); // 性能指标

    // 设置事件处理
    _this.setupEventHandlers();
    return _this;
  }

  /**
   * 设置事件处理器
   * @private
   */
  _inherits(MCPToolSystem, _EventEmitter);
  return _createClass(MCPToolSystem, [{
    key: "setupEventHandlers",
    value: function setupEventHandlers() {
      var _this2 = this;
      this.connectionManager.on('toolRegistryUpdated', function () {
        _this2.refreshToolRegistry();
      });
      this.connectionManager.on('initialized', function () {
        _this2.refreshToolRegistry();
      });
    }

    /**
     * 初始化工具系统
     * @returns {Promise<void>}
     */
  }, {
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              this.logger.info('Initializing MCP Tool System');
              _context.n = 1;
              return this.refreshToolRegistry();
            case 1:
              this.logger.info("Initialized with ".concat(this.toolRegistry.size, " tools"));
              this.emit('initialized');
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * 刷新工具注册表
     * @private
     */
    )
  }, {
    key: "refreshToolRegistry",
    value: (function () {
      var _refreshToolRegistry = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var tools, _iterator, _step, tool, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return this.connectionManager.getAllTools();
            case 1:
              tools = _context2.v;
              this.toolRegistry.clear();
              _iterator = _createForOfIteratorHelper(tools);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  tool = _step.value;
                  this.toolRegistry.set(tool.name, _objectSpread2(_objectSpread2({}, tool), {}, {
                    registeredAt: new Date()
                  }));

                  // 从inputSchema生成验证规则
                  if (this.enableValidation && tool.inputSchema) {
                    this.generateValidationRules(tool.name, tool.inputSchema);
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              this.emit('toolRegistryUpdated', this.toolRegistry);
              this.logger.debug("Updated tool registry with ".concat(tools.length, " tools"));
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _t = _context2.v;
              this.logger.error('Failed to refresh tool registry:', _t);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function refreshToolRegistry() {
        return _refreshToolRegistry.apply(this, arguments);
      }
      return refreshToolRegistry;
    }()
    /**
     * 从JSON Schema生成验证规则
     * @param {string} toolName - 工具名称
     * @param {Object} schema - JSON Schema
     * @private
     */
    )
  }, {
    key: "generateValidationRules",
    value: function generateValidationRules(toolName, schema) {
      var rules = [];
      if (schema.properties) {
        for (var _i = 0, _Object$entries = Object.entries(schema.properties); _i < _Object$entries.length; _i++) {
          var _schema$required;
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            fieldName = _Object$entries$_i[0],
            fieldSchema = _Object$entries$_i[1];
          var rule = {
            field: fieldName,
            type: fieldSchema.type || 'any',
            required: ((_schema$required = schema.required) === null || _schema$required === void 0 ? void 0 : _schema$required.includes(fieldName)) || false,
            "default": fieldSchema["default"]
          };

          // 添加类型特定的验证
          if (fieldSchema.type === 'string') {
            if (fieldSchema.pattern) rule.pattern = fieldSchema.pattern;
            if (fieldSchema.minLength) rule.minLength = fieldSchema.minLength;
            if (fieldSchema.maxLength) rule.maxLength = fieldSchema.maxLength;
            if (fieldSchema["enum"]) rule["enum"] = fieldSchema["enum"];
          } else if (fieldSchema.type === 'number' || fieldSchema.type === 'integer') {
            if (fieldSchema.minimum !== undefined) rule.min = fieldSchema.minimum;
            if (fieldSchema.maximum !== undefined) rule.max = fieldSchema.maximum;
          }
          rules.push(rule);
        }
      }
      this.validationRules.set(toolName, rules);
    }

    /**
     * 注册自定义验证规则
     * @param {string} toolName - 工具名称
     * @param {ToolValidationRule[]} rules - 验证规则
     */
  }, {
    key: "setValidationRules",
    value: function setValidationRules(toolName, rules) {
      this.validationRules.set(toolName, rules);
      this.logger.debug("Set custom validation rules for tool '".concat(toolName, "'"));
    }

    /**
     * 注册结果处理器
     * @param {string} toolName - 工具名称
     * @param {function} processor - 结果处理函数
     */
  }, {
    key: "setResultProcessor",
    value: function setResultProcessor(toolName, processor) {
      this.resultProcessors.set(toolName, processor);
      this.logger.debug("Set result processor for tool '".concat(toolName, "'"));
    }

    /**
     * 验证工具参数
     * @param {string} toolName - 工具名称
     * @param {Object} args - 参数对象
     * @returns {Object} 验证结果 { valid: boolean, errors: string[], processedArgs: Object }
     */
  }, {
    key: "validateArgs",
    value: function validateArgs(toolName) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var rules = this.validationRules.get(toolName);
      if (!rules || !this.enableValidation) {
        return {
          valid: true,
          errors: [],
          processedArgs: args
        };
      }
      var errors = [];
      var processedArgs = _objectSpread2({}, args);
      var _iterator2 = _createForOfIteratorHelper(rules),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var rule = _step2.value;
          var field = rule.field,
            type = rule.type,
            required = rule.required,
            defaultValue = rule["default"];
          var value = processedArgs[field];

          // 检查必需字段
          if (required && (value === undefined || value === null)) {
            errors.push("Field '".concat(field, "' is required"));
            continue;
          }

          // 设置默认值
          if (value === undefined && defaultValue !== undefined) {
            processedArgs[field] = defaultValue;
            continue;
          }

          // 跳过可选的空值
          if (value === undefined || value === null) {
            continue;
          }

          // 类型验证
          if (!this.validateType(value, type)) {
            errors.push("Field '".concat(field, "' must be of type '").concat(type, "'"));
            continue;
          }

          // 特定类型验证
          var typeError = this.validateTypeSpecific(field, value, rule);
          if (typeError) {
            errors.push(typeError);
          }

          // 自定义验证器
          if (rule.validator && typeof rule.validator === 'function') {
            try {
              var customError = rule.validator(value, field, processedArgs);
              if (customError) {
                errors.push(customError);
              }
            } catch (error) {
              errors.push("Validation error for '".concat(field, "': ").concat(error.message));
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return {
        valid: errors.length === 0,
        errors: errors,
        processedArgs: processedArgs
      };
    }

    /**
     * 验证值的类型
     * @param {any} value - 值
     * @param {string} expectedType - 期望类型
     * @returns {boolean}
     * @private
     */
  }, {
    key: "validateType",
    value: function validateType(value, expectedType) {
      switch (expectedType) {
        case 'string':
          return typeof value === 'string';
        case 'number':
          return typeof value === 'number' && !isNaN(value);
        case 'integer':
          return Number.isInteger(value);
        case 'boolean':
          return typeof value === 'boolean';
        case 'object':
          return _typeof(value) === 'object' && value !== null && !Array.isArray(value);
        case 'array':
          return Array.isArray(value);
        case 'any':
          return true;
        default:
          return true;
      }
    }

    /**
     * 类型特定验证
     * @param {string} field - 字段名
     * @param {any} value - 值
     * @param {ToolValidationRule} rule - 验证规则
     * @returns {string|null} 错误消息或null
     * @private
     */
  }, {
    key: "validateTypeSpecific",
    value: function validateTypeSpecific(field, value, rule) {
      if (rule.type === 'string') {
        if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
          return "Field '".concat(field, "' does not match pattern '").concat(rule.pattern, "'");
        }
        if (rule.minLength && value.length < rule.minLength) {
          return "Field '".concat(field, "' must be at least ").concat(rule.minLength, " characters");
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return "Field '".concat(field, "' must be at most ").concat(rule.maxLength, " characters");
        }
        if (rule["enum"] && !rule["enum"].includes(value)) {
          return "Field '".concat(field, "' must be one of: ").concat(rule["enum"].join(', '));
        }
      } else if (rule.type === 'number' || rule.type === 'integer') {
        if (rule.min !== undefined && value < rule.min) {
          return "Field '".concat(field, "' must be at least ").concat(rule.min);
        }
        if (rule.max !== undefined && value > rule.max) {
          return "Field '".concat(field, "' must be at most ").concat(rule.max);
        }
      }
      return null;
    }

    /**
     * 调用工具
     * @param {string} toolName - 工具名称
     * @param {Object} [args] - 工具参数
     * @param {Object} [options] - 调用选项
     * @param {string} [options.sessionId] - 会话ID
     * @param {Object} [options.metadata] - 元数据
     * @param {boolean} [options.skipValidation] - 跳过验证
     * @returns {Promise<ToolExecutionResult>}
     */
  }, {
    key: "callTool",
    value: (function () {
      var _callTool = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(toolName) {
        var args,
          options,
          startTime,
          context,
          validation,
          rawResult,
          processedResult,
          duration,
          result,
          _duration,
          _result,
          _args3 = arguments,
          _t2;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              args = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
              startTime = new Date();
              context = {
                toolName: toolName,
                args: args,
                startTime: startTime,
                sessionId: options.sessionId,
                metadata: options.metadata
              };
              _context3.p = 1;
              if (this.toolRegistry.has(toolName)) {
                _context3.n = 2;
                break;
              }
              throw new Error("Tool '".concat(toolName, "' not found"));
            case 2:
              if (options.skipValidation) {
                _context3.n = 4;
                break;
              }
              validation = this.validateArgs(toolName, args);
              if (validation.valid) {
                _context3.n = 3;
                break;
              }
              throw new Error("Validation failed: ".concat(validation.errors.join(', ')));
            case 3:
              context.args = validation.processedArgs;
            case 4:
              this.emit('toolCallStarted', context);

              // 执行工具调用
              _context3.n = 5;
              return this.connectionManager.callTool(toolName, context.args);
            case 5:
              rawResult = _context3.v;
              context.connectionName = rawResult.connection;

              // 处理结果
              _context3.n = 6;
              return this.processResult(toolName, rawResult);
            case 6:
              processedResult = _context3.v;
              duration = Date.now() - startTime.getTime();
              result = {
                success: true,
                data: processedResult,
                duration: duration,
                context: context
              }; // 记录执行历史
              this.recordExecution(result);

              // 更新指标
              if (this.enableMetrics) {
                this.updateMetrics(toolName, duration, true);
              }
              this.emit('toolCallCompleted', result);
              return _context3.a(2, result);
            case 7:
              _context3.p = 7;
              _t2 = _context3.v;
              _duration = Date.now() - startTime.getTime();
              _result = {
                success: false,
                error: _t2.message,
                duration: _duration,
                context: context
              };
              this.recordExecution(_result);
              if (this.enableMetrics) {
                this.updateMetrics(toolName, _duration, false);
              }
              this.emit('toolCallFailed', _result);
              throw _t2;
            case 8:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 7]]);
      }));
      function callTool(_x) {
        return _callTool.apply(this, arguments);
      }
      return callTool;
    }()
    /**
     * 处理工具调用结果
     * @param {string} toolName - 工具名称
     * @param {Object} rawResult - 原始结果
     * @returns {Promise<any>} 处理后的结果
     * @private
     */
    )
  }, {
    key: "processResult",
    value: (function () {
      var _processResult = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(toolName, rawResult) {
        var processor, _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              processor = this.resultProcessors.get(toolName);
              if (!(processor && typeof processor === 'function')) {
                _context4.n = 4;
                break;
              }
              _context4.p = 1;
              _context4.n = 2;
              return processor(rawResult);
            case 2:
              return _context4.a(2, _context4.v);
            case 3:
              _context4.p = 3;
              _t3 = _context4.v;
              this.logger.warn("Result processor failed for '".concat(toolName, "':"), _t3);
              return _context4.a(2, rawResult);
            case 4:
              return _context4.a(2, rawResult);
          }
        }, _callee4, this, [[1, 3]]);
      }));
      function processResult(_x2, _x3) {
        return _processResult.apply(this, arguments);
      }
      return processResult;
    }()
    /**
     * 执行工具链
     * @param {Array} toolChain - 工具链定义
     * @param {Object} [initialData] - 初始数据
     * @param {Object} [options] - 选项
     * @returns {Promise<Array>} 工具链执行结果
     */
    )
  }, {
    key: "executeToolChain",
    value: (function () {
      var _executeToolChain = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(toolChain) {
        var initialData,
          options,
          results,
          currentData,
          _iterator3,
          _step3,
          step,
          tool,
          _step$args,
          args,
          dataMapping,
          mappedArgs,
          _i2,
          _Object$entries2,
          _Object$entries2$_i,
          targetField,
          sourceField,
          result,
          _args5 = arguments,
          _t4,
          _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              initialData = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
              options = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
              results = [];
              currentData = initialData;
              _iterator3 = _createForOfIteratorHelper(toolChain);
              _context5.p = 1;
              _iterator3.s();
            case 2:
              if ((_step3 = _iterator3.n()).done) {
                _context5.n = 8;
                break;
              }
              step = _step3.value;
              tool = step.tool, _step$args = step.args, args = _step$args === void 0 ? {} : _step$args, dataMapping = step.dataMapping; // 数据映射：将前一步的结果映射到当前步骤的参数
              mappedArgs = _objectSpread2({}, args);
              if (dataMapping && typeof dataMapping === 'function') {
                mappedArgs = _objectSpread2(_objectSpread2({}, mappedArgs), dataMapping(currentData, results));
              } else if (dataMapping && _typeof(dataMapping) === 'object') {
                for (_i2 = 0, _Object$entries2 = Object.entries(dataMapping); _i2 < _Object$entries2.length; _i2++) {
                  _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2), targetField = _Object$entries2$_i[0], sourceField = _Object$entries2$_i[1];
                  if (currentData[sourceField] !== undefined) {
                    mappedArgs[targetField] = currentData[sourceField];
                  }
                }
              }
              _context5.p = 3;
              _context5.n = 4;
              return this.callTool(tool, mappedArgs, options);
            case 4:
              result = _context5.v;
              results.push(result);

              // 更新当前数据为最新结果
              if (result.success && result.data) {
                currentData = _objectSpread2(_objectSpread2({}, currentData), result.data);
              }
              _context5.n = 7;
              break;
            case 5:
              _context5.p = 5;
              _t4 = _context5.v;
              this.logger.error("Tool chain failed at step ".concat(results.length + 1, " (").concat(tool, "):"), _t4);

              // 根据配置决定是否继续执行
              if (!options.continueOnError) {
                _context5.n = 6;
                break;
              }
              results.push({
                success: false,
                error: _t4.message,
                context: {
                  toolName: tool,
                  args: mappedArgs
                }
              });
              _context5.n = 7;
              break;
            case 6:
              throw _t4;
            case 7:
              _context5.n = 2;
              break;
            case 8:
              _context5.n = 10;
              break;
            case 9:
              _context5.p = 9;
              _t5 = _context5.v;
              _iterator3.e(_t5);
            case 10:
              _context5.p = 10;
              _iterator3.f();
              return _context5.f(10);
            case 11:
              return _context5.a(2, results);
          }
        }, _callee5, this, [[3, 5], [1, 9, 10, 11]]);
      }));
      function executeToolChain(_x4) {
        return _executeToolChain.apply(this, arguments);
      }
      return executeToolChain;
    }()
    /**
     * 记录执行历史
     * @param {ToolExecutionResult} result - 执行结果
     * @private
     */
    )
  }, {
    key: "recordExecution",
    value: function recordExecution(result) {
      this.executionHistory.push(_objectSpread2(_objectSpread2({}, result), {}, {
        timestamp: new Date()
      }));

      // 限制历史记录数量
      if (this.executionHistory.length > 1000) {
        this.executionHistory = this.executionHistory.slice(-500);
      }
    }

    /**
     * 更新性能指标
     * @param {string} toolName - 工具名称
     * @param {number} duration - 执行时间
     * @param {boolean} success - 是否成功
     * @private
     */
  }, {
    key: "updateMetrics",
    value: function updateMetrics(toolName, duration, success) {
      if (!this.metrics.has(toolName)) {
        this.metrics.set(toolName, {
          totalCalls: 0,
          successCalls: 0,
          errorCalls: 0,
          totalDuration: 0,
          avgDuration: 0,
          minDuration: Infinity,
          maxDuration: 0
        });
      }
      var metrics = this.metrics.get(toolName);
      metrics.totalCalls++;
      if (success) {
        metrics.successCalls++;
      } else {
        metrics.errorCalls++;
      }
      metrics.totalDuration += duration;
      metrics.avgDuration = metrics.totalDuration / metrics.totalCalls;
      metrics.minDuration = Math.min(metrics.minDuration, duration);
      metrics.maxDuration = Math.max(metrics.maxDuration, duration);
    }

    /**
     * 获取工具列表
     * @returns {Array} 工具列表
     */
  }, {
    key: "getTools",
    value: function getTools() {
      return Array.from(this.toolRegistry.values());
    }

    /**
     * 获取工具定义
     * @param {string} toolName - 工具名称
     * @returns {Object|null} 工具定义
     */
  }, {
    key: "getTool",
    value: function getTool(toolName) {
      return this.toolRegistry.get(toolName) || null;
    }

    /**
     * 获取性能指标
     * @param {string} [toolName] - 工具名称（可选）
     * @returns {Object} 性能指标
     */
  }, {
    key: "getMetrics",
    value: function getMetrics(toolName) {
      if (toolName) {
        return this.metrics.get(toolName) || null;
      }
      return Object.fromEntries(this.metrics);
    }

    /**
     * 获取执行历史
     * @param {Object} [filter] - 过滤条件
     * @param {number} [limit] - 限制数量
     * @returns {Array} 执行历史
     */
  }, {
    key: "getExecutionHistory",
    value: function getExecutionHistory() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
      var history = this.executionHistory;

      // 应用过滤条件
      if (filter.toolName) {
        history = history.filter(function (h) {
          return h.context.toolName === filter.toolName;
        });
      }
      if (filter.success !== undefined) {
        history = history.filter(function (h) {
          return h.success === filter.success;
        });
      }
      if (filter.since) {
        history = history.filter(function (h) {
          return h.timestamp >= filter.since;
        });
      }
      return history.slice(-limit);
    }

    /**
     * 清空执行历史
     */
  }, {
    key: "clearHistory",
    value: function clearHistory() {
      this.executionHistory = [];
      this.logger.debug('Cleared execution history');
    }

    /**
     * 重置指标
     */
  }, {
    key: "resetMetrics",
    value: function resetMetrics() {
      this.metrics.clear();
      this.logger.debug('Reset performance metrics');
    }
  }]);
}(events.EventEmitter);

/**
 * 创建简单的MCP客户端
 * @param {Object} config - 客户端配置
 * @returns {MCPClient} MCP客户端实例
 */
function createMCPClient(config) {
  return new MCPClient(config);
}

/**
 * 创建MCP连接管理器
 * @param {Object} config - 管理器配置
 * @returns {MCPConnectionManager} 连接管理器实例
 */
function createMCPConnectionManager(config) {
  return new MCPConnectionManager(config);
}

/**
 * 创建完整的MCP系统（包含连接管理器和工具系统）
 * @param {Object} config - 系统配置
 * @param {Array} config.servers - MCP服务器配置列表
 * @param {Object} [config.manager] - 连接管理器配置
 * @param {Object} [config.toolSystem] - 工具系统配置
 * @returns {Object} 包含connectionManager和toolSystem的对象
 */
function createMCPSystem(config) {
  var servers = config.servers,
    _config$manager = config.manager,
    manager = _config$manager === void 0 ? {} : _config$manager,
    _config$toolSystem = config.toolSystem,
    toolSystem = _config$toolSystem === void 0 ? {} : _config$toolSystem;

  // 创建连接管理器
  var connectionManager = new MCPConnectionManager(_objectSpread2({
    servers: servers
  }, manager));

  // 创建工具系统
  var tools = new MCPToolSystem(_objectSpread2({
    connectionManager: connectionManager
  }, toolSystem));
  return {
    connectionManager: connectionManager,
    toolSystem: tools,
    // 初始化方法
    initialize: function initialize() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return connectionManager.initialize();
            case 1:
              _context.n = 2;
              return tools.initialize();
            case 2:
              return _context.a(2);
          }
        }, _callee);
      }))();
    },
    // 便捷方法
    callTool: function callTool(toolName, args, options) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return tools.callTool(toolName, args, options);
            case 1:
              return _context2.a(2, _context2.v);
          }
        }, _callee2);
      }))();
    },
    getTools: function getTools() {
      return tools.getTools();
    },
    executeToolChain: function executeToolChain(toolChain, initialData, options) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return tools.executeToolChain(toolChain, initialData, options);
            case 1:
              return _context3.a(2, _context3.v);
          }
        }, _callee3);
      }))();
    },
    getStatus: function getStatus() {
      var connectionStatus = connectionManager.getStatus();
      return {
        healthy: connectionStatus.readyConnections > 0,
        connections: connectionStatus.connections,
        totalConnections: connectionStatus.totalConnections,
        readyConnections: connectionStatus.readyConnections,
        tools: {
          totalTools: tools.getTools().length,
          metrics: tools.getMetrics()
        }
      };
    },
    shutdown: function shutdown() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return connectionManager.shutdown();
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      }))();
    }
  };
}

/**
 * 预设的工具链模板
 */
var TOOL_CHAIN_TEMPLATES = {
  /**
   * 网页分析工具链
   */
  WEB_ANALYSIS: [{
    tool: 'fetch_page',
    args: {
      url: null
    },
    // url will be provided at runtime
    dataMapping: function dataMapping(data) {
      return {
        url: data.url
      };
    }
  }, {
    tool: 'extract_text',
    dataMapping: function dataMapping(data, results) {
      var _results$;
      return {
        html: (_results$ = results[0]) === null || _results$ === void 0 || (_results$ = _results$.data) === null || _results$ === void 0 ? void 0 : _results$.html
      };
    }
  }, {
    tool: 'analyze_content',
    dataMapping: function dataMapping(data, results) {
      var _results$2;
      return {
        text: (_results$2 = results[1]) === null || _results$2 === void 0 || (_results$2 = _results$2.data) === null || _results$2 === void 0 ? void 0 : _results$2.text
      };
    }
  }],
  /**
   * DOM操作工具链
   */
  DOM_MANIPULATION: [{
    tool: 'find_elements',
    args: {
      selector: null
    },
    dataMapping: function dataMapping(data) {
      return {
        selector: data.selector
      };
    }
  }, {
    tool: 'click_element',
    dataMapping: function dataMapping(data, results) {
      var _results$3;
      return {
        element: (_results$3 = results[0]) === null || _results$3 === void 0 || (_results$3 = _results$3.data) === null || _results$3 === void 0 || (_results$3 = _results$3.elements) === null || _results$3 === void 0 ? void 0 : _results$3[0]
      };
    }
  }],
  /**
   * 文件处理工具链
   */
  FILE_PROCESSING: [{
    tool: 'read_file',
    args: {
      path: null
    },
    dataMapping: function dataMapping(data) {
      return {
        path: data.path
      };
    }
  }, {
    tool: 'process_content',
    dataMapping: function dataMapping(data, results) {
      var _results$4;
      return {
        content: (_results$4 = results[0]) === null || _results$4 === void 0 || (_results$4 = _results$4.data) === null || _results$4 === void 0 ? void 0 : _results$4.content
      };
    }
  }, {
    tool: 'write_file',
    args: {
      path: null
    },
    dataMapping: function dataMapping(data, results) {
      var _results$5;
      return {
        path: data.outputPath || data.path,
        content: (_results$5 = results[1]) === null || _results$5 === void 0 || (_results$5 = _results$5.data) === null || _results$5 === void 0 ? void 0 : _results$5.processedContent
      };
    }
  }]
};

/**
 * 默认配置
 */
var DEFAULT_CONFIG = {
  client: {
    transport: 'stdio',
    timeout: 30000
  },
  manager: {
    maxConnections: 10,
    connectionTimeout: 30000,
    healthCheckInterval: 60000,
    loadBalanceStrategy: 'round-robin'
  },
  toolSystem: {
    enableValidation: true,
    enableMetrics: true
  }
};

// 默认导出
var index = {
  MCPClient: MCPClient,
  MCPConnectionManager: MCPConnectionManager,
  MCPToolSystem: MCPToolSystem,
  CONNECTION_STATUS: CONNECTION_STATUS,
  createMCPClient: createMCPClient,
  createMCPConnectionManager: createMCPConnectionManager,
  createMCPSystem: createMCPSystem,
  TOOL_CHAIN_TEMPLATES: TOOL_CHAIN_TEMPLATES,
  DEFAULT_CONFIG: DEFAULT_CONFIG
};

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CONNECTION_STATUS: CONNECTION_STATUS,
  DEFAULT_CONFIG: DEFAULT_CONFIG,
  JSONRPC_ERROR_CODES: JSONRPC_ERROR_CODES,
  JSONRPC_VERSION: JSONRPC_VERSION,
  MCPClient: MCPClient,
  MCPConnectionManager: MCPConnectionManager,
  MCPToolSystem: MCPToolSystem,
  MCP_METHODS: MCP_METHODS,
  MCP_SCHEMA_VERSION: MCP_SCHEMA_VERSION,
  TOOL_CHAIN_TEMPLATES: TOOL_CHAIN_TEMPLATES,
  createCallToolResult: createCallToolResult,
  createImageContent: createImageContent,
  createJsonRpcError: createJsonRpcError,
  createJsonRpcRequest: createJsonRpcRequest,
  createJsonRpcResponse: createJsonRpcResponse,
  createMCPClient: createMCPClient,
  createMCPConnectionManager: createMCPConnectionManager,
  createMCPSystem: createMCPSystem,
  createTextContent: createTextContent,
  createTool: createTool,
  default: index,
  isValidJsonRpcMessage: isValidJsonRpcMessage,
  isValidJsonRpcRequest: isValidJsonRpcRequest,
  isValidJsonRpcResponse: isValidJsonRpcResponse,
  isValidTool: isValidTool
});

/**
 * MCP 浏览器客户端类
 */
var MCPBrowserClient = /*#__PURE__*/function () {
  function MCPBrowserClient() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, MCPBrowserClient);
    this.config = _objectSpread2({
      command: config.command || 'node',
      args: config.serverPath ? [config.serverPath] : ['-e', "\n        import { startMCPBrowserServer } from '@mofanh/agent-core/mcp/browser-server.js';\n        startMCPBrowserServer();\n      "],
      timeout: config.timeout || 30000
    }, config);
    this.client = new index_js.Client({
      name: 'browser-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });
    this.transport = null;
    this.isConnected = false;
  }

  /**
   * 连接到 MCP 浏览器服务器
   */
  return _createClass(MCPBrowserClient, [{
    key: "connect",
    value: (function () {
      var _connect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              // 创建传输层 - StdioClientTransport 会自动启动服务器进程
              this.transport = new stdio_js.StdioClientTransport({
                command: this.config.command,
                args: this.config.args
              });

              // 连接客户端
              _context.n = 1;
              return this.client.connect(this.transport);
            case 1:
              this.isConnected = true;
              console.log('🔗 已连接到 MCP 浏览器服务器');
              return _context.a(2, true);
            case 2:
              _context.p = 2;
              _t = _context.v;
              console.error('❌ 连接 MCP 浏览器服务器失败:', _t);
              this.isConnected = false;
              throw new Error('无法连接到 MCP 浏览器服务器');
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function connect() {
        return _connect.apply(this, arguments);
      }
      return connect;
    }()
    /**
     * 断开连接
     */
    )
  }, {
    key: "disconnect",
    value: (function () {
      var _disconnect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              if (!(this.isConnected && this.client)) {
                _context2.n = 1;
                break;
              }
              _context2.n = 1;
              return this.client.close();
            case 1:
              this.isConnected = false;
              console.log('🔌 已断开 MCP 浏览器服务器连接');
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _t2 = _context2.v;
              console.error('❌ 断开连接时出错:', _t2);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function disconnect() {
        return _disconnect.apply(this, arguments);
      }
      return disconnect;
    }()
    /**
     * 确保连接状态
     */
    )
  }, {
    key: "ensureConnected",
    value: (function () {
      var _ensureConnected = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              if (this.isConnected) {
                _context3.n = 1;
                break;
              }
              _context3.n = 1;
              return this.connect();
            case 1:
              if (this.isConnected) {
                _context3.n = 2;
                break;
              }
              throw new Error('无法连接到 MCP 浏览器服务器');
            case 2:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function ensureConnected() {
        return _ensureConnected.apply(this, arguments);
      }
      return ensureConnected;
    }()
    /**
     * 获取可用工具列表
     */
    )
  }, {
    key: "listTools",
    value: (function () {
      var _listTools = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var response, _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.n = 1;
              return this.ensureConnected();
            case 1:
              _context4.p = 1;
              _context4.n = 2;
              return this.client.listTools();
            case 2:
              response = _context4.v;
              return _context4.a(2, response.tools);
            case 3:
              _context4.p = 3;
              _t3 = _context4.v;
              console.error('❌ 获取工具列表失败:', _t3);
              throw _t3;
            case 4:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 3]]);
      }));
      function listTools() {
        return _listTools.apply(this, arguments);
      }
      return listTools;
    }()
    /**
     * 调用浏览器工具
     */
    )
  }, {
    key: "callTool",
    value: (function () {
      var _callTool = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(name) {
        var args,
          _response$content$2,
          response,
          _response$content$,
          resultText,
          _args5 = arguments,
          _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              args = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
              _context5.n = 1;
              return this.ensureConnected();
            case 1:
              _context5.p = 1;
              _context5.n = 2;
              return this.client.callTool({
                name: name,
                arguments: args
              });
            case 2:
              response = _context5.v;
              if (!response.isError) {
                _context5.n = 3;
                break;
              }
              throw new Error("\u5DE5\u5177\u8C03\u7528\u5931\u8D25: ".concat(((_response$content$ = response.content[0]) === null || _response$content$ === void 0 ? void 0 : _response$content$.text) || '未知错误'));
            case 3:
              // 解析响应内容
              resultText = (_response$content$2 = response.content[0]) === null || _response$content$2 === void 0 ? void 0 : _response$content$2.text;
              if (!resultText) {
                _context5.n = 6;
                break;
              }
              _context5.p = 4;
              return _context5.a(2, JSON.parse(resultText));
            case 5:
              _context5.p = 5;
              _context5.v;
              return _context5.a(2, {
                success: true,
                data: resultText
              });
            case 6:
              return _context5.a(2, {
                success: true,
                data: null
              });
            case 7:
              _context5.p = 7;
              _t5 = _context5.v;
              console.error("\u274C \u8C03\u7528\u5DE5\u5177 ".concat(name, " \u5931\u8D25:"), _t5);
              throw _t5;
            case 8:
              return _context5.a(2);
          }
        }, _callee5, this, [[4, 5], [1, 7]]);
      }));
      function callTool(_x) {
        return _callTool.apply(this, arguments);
      }
      return callTool;
    }() // 便捷方法
    /**
     * 导航到指定URL
     */
    )
  }, {
    key: "navigate",
    value: function () {
      var _navigate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(url) {
        var options,
          _args6 = arguments;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              options = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
              _context6.n = 1;
              return this.callTool('browser_navigate', _objectSpread2({
                url: url
              }, options));
            case 1:
              return _context6.a(2, _context6.v);
          }
        }, _callee6, this);
      }));
      function navigate(_x2) {
        return _navigate.apply(this, arguments);
      }
      return navigate;
    }()
    /**
     * 提取页面内容
     */
  }, {
    key: "extract",
    value: (function () {
      var _extract = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(selector) {
        var options,
          _args7 = arguments;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
              _context7.n = 1;
              return this.callTool('browser_extract', _objectSpread2({
                selector: selector
              }, options));
            case 1:
              return _context7.a(2, _context7.v);
          }
        }, _callee7, this);
      }));
      function extract(_x3) {
        return _extract.apply(this, arguments);
      }
      return extract;
    }()
    /**
     * 点击元素
     */
    )
  }, {
    key: "click",
    value: (function () {
      var _click = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(selector) {
        var options,
          _args8 = arguments;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              options = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
              _context8.n = 1;
              return this.callTool('browser_click', _objectSpread2({
                selector: selector
              }, options));
            case 1:
              return _context8.a(2, _context8.v);
          }
        }, _callee8, this);
      }));
      function click(_x4) {
        return _click.apply(this, arguments);
      }
      return click;
    }()
    /**
     * 输入文本
     */
    )
  }, {
    key: "type",
    value: (function () {
      var _type = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(selector, text) {
        var options,
          _args9 = arguments;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              options = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
              _context9.n = 1;
              return this.callTool('browser_type', _objectSpread2({
                selector: selector,
                text: text
              }, options));
            case 1:
              return _context9.a(2, _context9.v);
          }
        }, _callee9, this);
      }));
      function type(_x5, _x6) {
        return _type.apply(this, arguments);
      }
      return type;
    }()
    /**
     * 截图
     */
    )
  }, {
    key: "screenshot",
    value: (function () {
      var _screenshot = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var options,
          _args0 = arguments;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              options = _args0.length > 0 && _args0[0] !== undefined ? _args0[0] : {};
              _context0.n = 1;
              return this.callTool('browser_screenshot', options);
            case 1:
              return _context0.a(2, _context0.v);
          }
        }, _callee0, this);
      }));
      function screenshot() {
        return _screenshot.apply(this, arguments);
      }
      return screenshot;
    }()
    /**
     * 执行JavaScript
     */
    )
  }, {
    key: "evaluate",
    value: (function () {
      var _evaluate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(code) {
        var options,
          _args1 = arguments;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              options = _args1.length > 1 && _args1[1] !== undefined ? _args1[1] : {};
              _context1.n = 1;
              return this.callTool('browser_evaluate', _objectSpread2({
                code: code
              }, options));
            case 1:
              return _context1.a(2, _context1.v);
          }
        }, _callee1, this);
      }));
      function evaluate(_x7) {
        return _evaluate.apply(this, arguments);
      }
      return evaluate;
    }()
    /**
     * 获取当前URL
     */
    )
  }, {
    key: "getCurrentUrl",
    value: (function () {
      var _getCurrentUrl = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return this.callTool('browser_get_url');
            case 1:
              return _context10.a(2, _context10.v);
          }
        }, _callee10, this);
      }));
      function getCurrentUrl() {
        return _getCurrentUrl.apply(this, arguments);
      }
      return getCurrentUrl;
    }())
  }]);
}();

/**
 * 创建 MCP 浏览器客户端
 */
function createMCPBrowserClient() {
  return _createMCPBrowserClient.apply(this, arguments);
}
function _createMCPBrowserClient() {
  _createMCPBrowserClient = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
    var config,
      client,
      _args11 = arguments;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          config = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : {};
          client = new MCPBrowserClient(config);
          _context11.n = 1;
          return client.connect();
        case 1:
          return _context11.a(2, client);
      }
    }, _callee11);
  }));
  return _createMCPBrowserClient.apply(this, arguments);
}

/**
 * 浏览器实例管理器
 * 负责创建、管理和销毁浏览器实例
 */
var BrowserInstance = /*#__PURE__*/function (_EventEmitter) {
  /**
   * 构造函数
   * @param {Object} config - 配置选项
   * @param {string} config.engine - 浏览器引擎 (puppeteer|playwright)
   * @param {boolean} config.headless - 是否无头模式
   * @param {Object} config.viewport - 默认视口配置
   * @param {Array} config.args - 浏览器启动参数
   * @param {number} config.timeout - 默认超时时间
   */
  function BrowserInstance() {
    var _this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, BrowserInstance);
    _this = _callSuper(this, BrowserInstance);
    _this.config = _objectSpread2({
      engine: config.engine || BROWSER_ENGINES.PUPPETEER,
      headless: config.headless !== false,
      // 默认无头模式
      viewport: config.viewport || {
        width: 1920,
        height: 1080
      },
      args: config.args || [],
      timeout: config.timeout || 30000
    }, config);
    _this.logger = new Logger('BrowserInstance');
    _this.browser = null;
    _this.pages = new Map(); // pageId -> page instance
    _this.currentPageId = null;
    _this.isInitialized = false;

    // 性能监控
    _this.metrics = {
      pagesCreated: 0,
      pagesClosed: 0,
      startTime: null,
      lastActivity: Date.now()
    };
    return _this;
  }

  /**
   * 初始化浏览器实例
   * @returns {Promise<void>}
   */
  _inherits(BrowserInstance, _EventEmitter);
  return _createClass(BrowserInstance, [{
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!this.isInitialized) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              this.logger.info("\u521D\u59CB\u5316\u6D4F\u89C8\u5668\u5F15\u64CE: ".concat(this.config.engine));
              this.metrics.startTime = Date.now();
              _context.p = 2;
              if (!(this.config.engine === BROWSER_ENGINES.PUPPETEER)) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return this.initializePuppeteer();
            case 3:
              _context.n = 7;
              break;
            case 4:
              if (!(this.config.engine === BROWSER_ENGINES.PLAYWRIGHT)) {
                _context.n = 6;
                break;
              }
              _context.n = 5;
              return this.initializePlaywright();
            case 5:
              _context.n = 7;
              break;
            case 6:
              throw new Error("\u4E0D\u652F\u6301\u7684\u6D4F\u89C8\u5668\u5F15\u64CE: ".concat(this.config.engine));
            case 7:
              this.isInitialized = true;
              this.emit('initialized', {
                engine: this.config.engine
              });
              this.logger.info('浏览器实例初始化完成');
              _context.n = 9;
              break;
            case 8:
              _context.p = 8;
              _t = _context.v;
              this.logger.error('浏览器实例初始化失败:', _t);
              this.emit('error', _t);
              throw _t;
            case 9:
              return _context.a(2);
          }
        }, _callee, this, [[2, 8]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * 初始化 Puppeteer
     * @private
     */
    )
  }, {
    key: "initializePuppeteer",
    value: (function () {
      var _initializePuppeteer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _this2 = this;
        var puppeteer, browserArgs;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return import('puppeteer');
            case 1:
              puppeteer = _context2.v;
              _context2.n = 3;
              break;
            case 2:
              _context2.p = 2;
              _context2.v;
              throw new Error('Puppeteer 未安装。请运行: npm install puppeteer');
            case 3:
              browserArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'].concat(_toConsumableArray(this.config.args));
              _context2.n = 4;
              return puppeteer.launch({
                headless: this.config.headless,
                args: browserArgs,
                timeout: this.config.timeout
              });
            case 4:
              this.browser = _context2.v;
              // 监听浏览器关闭事件
              this.browser.on('disconnected', function () {
                _this2.emit('disconnected');
                _this2.isInitialized = false;
              });
            case 5:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function initializePuppeteer() {
        return _initializePuppeteer.apply(this, arguments);
      }
      return initializePuppeteer;
    }()
    /**
     * 初始化 Playwright
     * @private
     */
    )
  }, {
    key: "initializePlaywright",
    value: (function () {
      var _initializePlaywright = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var _this3 = this;
        var playwright;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return import('playwright');
            case 1:
              playwright = _context3.v;
              _context3.n = 3;
              break;
            case 2:
              _context3.p = 2;
              _context3.v;
              throw new Error('Playwright 未安装。请运行: npm install playwright');
            case 3:
              _context3.n = 4;
              return playwright.chromium.launch({
                headless: this.config.headless,
                args: this.config.args,
                timeout: this.config.timeout
              });
            case 4:
              this.browser = _context3.v;
              // 监听浏览器关闭事件
              this.browser.on('disconnected', function () {
                _this3.emit('disconnected');
                _this3.isInitialized = false;
              });
            case 5:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 2]]);
      }));
      function initializePlaywright() {
        return _initializePlaywright.apply(this, arguments);
      }
      return initializePlaywright;
    }()
    /**
     * 创建新页面
     * @param {Object} options - 页面选项
     * @returns {Promise<Object>} 页面实例和ID
     */
    )
  }, {
    key: "newPage",
    value: (function () {
      var _newPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var _this4 = this;
        var options,
          page,
          pageId,
          viewport,
          _args4 = arguments;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              options = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
              if (this.isInitialized) {
                _context4.n = 1;
                break;
              }
              _context4.n = 1;
              return this.initialize();
            case 1:
              _context4.n = 2;
              return this.browser.newPage();
            case 2:
              page = _context4.v;
              pageId = "page_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)); // 设置视口
              viewport = options.viewport || this.config.viewport;
              if (!viewport) {
                _context4.n = 3;
                break;
              }
              _context4.n = 3;
              return page.setViewport(viewport);
            case 3:
              if (!options.userAgent) {
                _context4.n = 4;
                break;
              }
              _context4.n = 4;
              return page.setUserAgent(options.userAgent);
            case 4:
              if (!(options.blockResources && options.blockResources.length > 0)) {
                _context4.n = 5;
                break;
              }
              _context4.n = 5;
              return this.setupResourceBlocking(page, options.blockResources);
            case 5:
              // 存储页面实例
              this.pages.set(pageId, page);
              this.currentPageId = pageId;
              this.metrics.pagesCreated++;
              this.metrics.lastActivity = Date.now();

              // 监听页面关闭事件
              page.on('close', function () {
                _this4.pages["delete"](pageId);
                _this4.metrics.pagesClosed++;
                if (_this4.currentPageId === pageId) {
                  _this4.currentPageId = null;
                }
              });
              this.emit('pageCreated', {
                pageId: pageId,
                page: page
              });
              this.logger.debug("\u521B\u5EFA\u65B0\u9875\u9762: ".concat(pageId));
              return _context4.a(2, {
                page: page,
                pageId: pageId
              });
          }
        }, _callee4, this);
      }));
      function newPage() {
        return _newPage.apply(this, arguments);
      }
      return newPage;
    }()
    /**
     * 获取当前页面
     * @returns {Promise<Object>} 当前页面实例
     */
    )
  }, {
    key: "getCurrentPage",
    value: (function () {
      var _getCurrentPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var _yield$this$newPage, page;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              if (!(!this.currentPageId || !this.pages.has(this.currentPageId))) {
                _context5.n = 2;
                break;
              }
              _context5.n = 1;
              return this.newPage();
            case 1:
              _yield$this$newPage = _context5.v;
              page = _yield$this$newPage.page;
              _yield$this$newPage.pageId;
              return _context5.a(2, page);
            case 2:
              return _context5.a(2, this.pages.get(this.currentPageId));
          }
        }, _callee5, this);
      }));
      function getCurrentPage() {
        return _getCurrentPage.apply(this, arguments);
      }
      return getCurrentPage;
    }()
    /**
     * 根据ID获取页面
     * @param {string} pageId - 页面ID
     * @returns {Object|null} 页面实例
     */
    )
  }, {
    key: "getPage",
    value: function getPage(pageId) {
      return this.pages.get(pageId) || null;
    }

    /**
     * 关闭页面
     * @param {string} pageId - 页面ID
     * @returns {Promise<void>}
     */
  }, {
    key: "closePage",
    value: (function () {
      var _closePage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(pageId) {
        var page;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              page = this.pages.get(pageId);
              if (!page) {
                _context6.n = 2;
                break;
              }
              _context6.n = 1;
              return page.close();
            case 1:
              this.pages["delete"](pageId);
              if (this.currentPageId === pageId) {
                this.currentPageId = null;
              }
              this.logger.debug("\u5173\u95ED\u9875\u9762: ".concat(pageId));
            case 2:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function closePage(_x) {
        return _closePage.apply(this, arguments);
      }
      return closePage;
    }()
    /**
     * 设置资源阻止
     * @param {Object} page - 页面实例
     * @param {Array} blockedResources - 要阻止的资源类型
     * @private
     */
    )
  }, {
    key: "setupResourceBlocking",
    value: (function () {
      var _setupResourceBlocking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(page, blockedResources) {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return page.setRequestInterception(true);
            case 1:
              page.on('request', function (request) {
                var resourceType = request.resourceType();
                if (blockedResources.includes(resourceType)) {
                  request.abort();
                } else {
                  request["continue"]();
                }
              });
            case 2:
              return _context7.a(2);
          }
        }, _callee7);
      }));
      function setupResourceBlocking(_x2, _x3) {
        return _setupResourceBlocking.apply(this, arguments);
      }
      return setupResourceBlocking;
    }()
    /**
     * 获取浏览器信息
     * @returns {Object} 浏览器信息
     */
    )
  }, {
    key: "getBrowserInfo",
    value: (function () {
      var _getBrowserInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var version, userAgent, _t4;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              if (this.browser) {
                _context8.n = 1;
                break;
              }
              return _context8.a(2, null);
            case 1:
              _context8.p = 1;
              _context8.n = 2;
              return this.browser.version();
            case 2:
              version = _context8.v;
              _context8.n = 3;
              return this.browser.userAgent();
            case 3:
              userAgent = _context8.v;
              return _context8.a(2, {
                engine: this.config.engine,
                version: version,
                userAgent: userAgent,
                isConnected: this.browser.isConnected(),
                pagesCount: this.pages.size,
                metrics: _objectSpread2({}, this.metrics)
              });
            case 4:
              _context8.p = 4;
              _t4 = _context8.v;
              this.logger.error('获取浏览器信息失败:', _t4);
              return _context8.a(2, null);
          }
        }, _callee8, this, [[1, 4]]);
      }));
      function getBrowserInfo() {
        return _getBrowserInfo.apply(this, arguments);
      }
      return getBrowserInfo;
    }()
    /**
     * 检查浏览器健康状态
     * @returns {Promise<boolean>} 是否健康
     */
    )
  }, {
    key: "isHealthy",
    value: (function () {
      var _isHealthy = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var testPage, _t5;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              if (!(!this.browser || !this.browser.isConnected())) {
                _context9.n = 1;
                break;
              }
              return _context9.a(2, false);
            case 1:
              _context9.n = 2;
              return this.browser.newPage();
            case 2:
              testPage = _context9.v;
              _context9.n = 3;
              return testPage.close();
            case 3:
              return _context9.a(2, true);
            case 4:
              _context9.p = 4;
              _t5 = _context9.v;
              this.logger.error('浏览器健康检查失败:', _t5);
              return _context9.a(2, false);
          }
        }, _callee9, this, [[0, 4]]);
      }));
      function isHealthy() {
        return _isHealthy.apply(this, arguments);
      }
      return isHealthy;
    }()
    /**
     * 关闭所有页面
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "closeAllPages",
    value: (function () {
      var _closeAllPages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _this5 = this;
        var closePromises;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              closePromises = Array.from(this.pages.values()).map(function (page) {
                return page.close()["catch"](function (err) {
                  return _this5.logger.warn('关闭页面失败:', err);
                });
              });
              _context0.n = 1;
              return Promise.allSettled(closePromises);
            case 1:
              this.pages.clear();
              this.currentPageId = null;
              this.logger.info('已关闭所有页面');
            case 2:
              return _context0.a(2);
          }
        }, _callee0, this);
      }));
      function closeAllPages() {
        return _closeAllPages.apply(this, arguments);
      }
      return closeAllPages;
    }()
    /**
     * 销毁浏览器实例
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "destroy",
    value: (function () {
      var _destroy = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var _t6;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              this.logger.info('开始销毁浏览器实例');
              _context1.p = 1;
              _context1.n = 2;
              return this.closeAllPages();
            case 2:
              if (!this.browser) {
                _context1.n = 4;
                break;
              }
              _context1.n = 3;
              return this.browser.close();
            case 3:
              this.browser = null;
            case 4:
              this.isInitialized = false;
              this.emit('destroyed');
              this.logger.info('浏览器实例已销毁');
              _context1.n = 6;
              break;
            case 5:
              _context1.p = 5;
              _t6 = _context1.v;
              this.logger.error('销毁浏览器实例失败:', _t6);
              throw _t6;
            case 6:
              return _context1.a(2);
          }
        }, _callee1, this, [[1, 5]]);
      }));
      function destroy() {
        return _destroy.apply(this, arguments);
      }
      return destroy;
    }()
    /**
     * 获取性能指标
     * @returns {Object} 性能指标
     */
    )
  }, {
    key: "getMetrics",
    value: function getMetrics() {
      return _objectSpread2(_objectSpread2({}, this.metrics), {}, {
        uptime: this.metrics.startTime ? Date.now() - this.metrics.startTime : 0,
        activePagesCount: this.pages.size,
        timeSinceLastActivity: Date.now() - this.metrics.lastActivity
      });
    }
  }]);
}(events.EventEmitter);

/**
 * 浏览器安全策略
 * 提供URL验证、脚本安全检查、资源控制等安全功能
 */
var BrowserSecurityPolicy = /*#__PURE__*/function () {
  /**
   * 构造函数
   * @param {Object} config - 安全配置
   * @param {Array} config.allowedDomains - 允许的域名列表
   * @param {Array} config.blockResources - 阻止的资源类型
   * @param {number} config.maxExecutionTime - 最大执行时间
   * @param {string} config.maxMemory - 最大内存使用
   * @param {boolean} config.allowScriptExecution - 是否允许脚本执行
   * @param {Array} config.blockedPatterns - 阻止的脚本模式
   */
  function BrowserSecurityPolicy() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, BrowserSecurityPolicy);
    this.config = _objectSpread2({
      allowedDomains: config.allowedDomains || ['*'],
      blockResources: config.blockResources || ['image', 'font'],
      maxExecutionTime: config.maxExecutionTime || 30000,
      maxMemory: config.maxMemory || '512MB',
      allowScriptExecution: config.allowScriptExecution !== false,
      blockedPatterns: config.blockedPatterns || []
    }, config);
    this.logger = new Logger('BrowserSecurityPolicy');

    // 默认危险脚本模式
    this.dangerousPatterns = [/eval\s*\(/gi, /Function\s*\(/gi, /document\.write/gi, /window\.location\s*=/gi, /location\.href\s*=/gi, /XMLHttpRequest/gi, /fetch\s*\(/gi, /WebSocket/gi, /localStorage/gi, /sessionStorage/gi, /indexedDB/gi, /alert\s*\(/gi, /confirm\s*\(/gi, /prompt\s*\(/gi];

    // 合并用户自定义的阻止模式
    if (this.config.blockedPatterns.length > 0) {
      var _this$dangerousPatter;
      (_this$dangerousPatter = this.dangerousPatterns).push.apply(_this$dangerousPatter, _toConsumableArray(this.config.blockedPatterns));
    }
  }

  /**
   * 验证工具操作是否被允许
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @returns {Promise<boolean>} 是否允许执行
   * @throws {Error} 如果操作被拒绝
   */
  return _createClass(BrowserSecurityPolicy, [{
    key: "validateOperation",
    value: (function () {
      var _validateOperation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(toolName, args) {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              this.logger.debug("\u9A8C\u8BC1\u5DE5\u5177\u64CD\u4F5C: ".concat(toolName), args);
              _context.p = 1;
              if (!args.url) {
                _context.n = 2;
                break;
              }
              _context.n = 2;
              return this.validateUrl(args.url);
            case 2:
              if (!(toolName === BROWSER_TOOLS.EVALUATE)) {
                _context.n = 3;
                break;
              }
              _context.n = 3;
              return this.validateScript(args.code);
            case 3:
              if (!args.selector) {
                _context.n = 4;
                break;
              }
              _context.n = 4;
              return this.validateSelector(args.selector);
            case 4:
              if (!args.timeout) {
                _context.n = 5;
                break;
              }
              _context.n = 5;
              return this.validateTimeout(args.timeout);
            case 5:
              _context.n = 6;
              return this.validateToolSpecific(toolName, args);
            case 6:
              this.logger.debug("\u5DE5\u5177\u64CD\u4F5C\u9A8C\u8BC1\u901A\u8FC7: ".concat(toolName));
              return _context.a(2, true);
            case 7:
              _context.p = 7;
              _t = _context.v;
              this.logger.warn("\u5DE5\u5177\u64CD\u4F5C\u9A8C\u8BC1\u5931\u8D25: ".concat(toolName), _t.message);
              throw _t;
            case 8:
              return _context.a(2);
          }
        }, _callee, this, [[1, 7]]);
      }));
      function validateOperation(_x, _x2) {
        return _validateOperation.apply(this, arguments);
      }
      return validateOperation;
    }()
    /**
     * 验证URL是否被允许
     * @param {string} url - 要验证的URL
     * @returns {Promise<boolean>} 是否允许
     * @throws {Error} 如果URL被拒绝
     */
    )
  }, {
    key: "validateUrl",
    value: (function () {
      var _validateUrl = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(url) {
        var urlObj, hostname, port, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              urlObj = new URL(url);
              hostname = urlObj.hostname; // 检查协议
              if (['http:', 'https:'].includes(urlObj.protocol)) {
                _context2.n = 1;
                break;
              }
              throw new Error("\u4E0D\u652F\u6301\u7684\u534F\u8BAE: ".concat(urlObj.protocol));
            case 1:
              if (this.isAllowedDomain(hostname)) {
                _context2.n = 2;
                break;
              }
              throw new Error("\u57DF\u540D\u4E0D\u5728\u5141\u8BB8\u5217\u8868\u4E2D: ".concat(hostname));
            case 2:
              // 检查端口（避免访问内部服务）
              port = urlObj.port;
              if (!(port && this.isBlockedPort(parseInt(port)))) {
                _context2.n = 3;
                break;
              }
              throw new Error("\u4E0D\u5141\u8BB8\u8BBF\u95EE\u7AEF\u53E3: ".concat(port));
            case 3:
              return _context2.a(2, true);
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              if (!(_t2 instanceof TypeError)) {
                _context2.n = 5;
                break;
              }
              throw new Error("\u65E0\u6548\u7684URL: ".concat(url));
            case 5:
              throw _t2;
            case 6:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 4]]);
      }));
      function validateUrl(_x3) {
        return _validateUrl.apply(this, arguments);
      }
      return validateUrl;
    }()
    /**
     * 检查域名是否被允许
     * @param {string} hostname - 主机名
     * @returns {boolean} 是否允许
     */
    )
  }, {
    key: "isAllowedDomain",
    value: function isAllowedDomain(hostname) {
      // 如果允许所有域名
      if (this.config.allowedDomains.includes('*')) {
        return true;
      }

      // 检查精确匹配
      if (this.config.allowedDomains.includes(hostname)) {
        return true;
      }

      // 检查通配符匹配
      return this.config.allowedDomains.some(function (domain) {
        if (domain.startsWith('*.')) {
          var baseDomain = domain.slice(2);
          return hostname === baseDomain || hostname.endsWith('.' + baseDomain);
        }
        return false;
      });
    }

    /**
     * 检查端口是否被阻止
     * @param {number} port - 端口号
     * @returns {boolean} 是否被阻止
     */
  }, {
    key: "isBlockedPort",
    value: function isBlockedPort(port) {
      // 阻止常见的内部服务端口
      var blockedPorts = [22,
      // SSH
      23,
      // Telnet
      25,
      // SMTP
      53,
      // DNS
      135,
      // RPC
      139,
      // NetBIOS
      445,
      // SMB
      993,
      // IMAPS
      995,
      // POP3S
      1433,
      // SQL Server
      3306,
      // MySQL
      3389,
      // RDP
      5432,
      // PostgreSQL
      6379,
      // Redis
      27017 // MongoDB
      ];
      return blockedPorts.includes(port);
    }

    /**
     * 验证JavaScript代码是否安全
     * @param {string} code - 要验证的代码
     * @returns {Promise<boolean>} 是否安全
     * @throws {Error} 如果代码包含危险操作
     */
  }, {
    key: "validateScript",
    value: (function () {
      var _validateScript = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(code) {
        var _iterator, _step, pattern, maxNestingLevel, nestingLevel, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              if (this.config.allowScriptExecution) {
                _context3.n = 1;
                break;
              }
              throw new Error('脚本执行已被禁用');
            case 1:
              if (!(!code || typeof code !== 'string')) {
                _context3.n = 2;
                break;
              }
              throw new Error('无效的脚本代码');
            case 2:
              if (!(code.length > 10000)) {
                _context3.n = 3;
                break;
              }
              throw new Error('脚本代码过长，最大允许10000字符');
            case 3:
              // 检查危险模式
              _iterator = _createForOfIteratorHelper(this.dangerousPatterns);
              _context3.p = 4;
              _iterator.s();
            case 5:
              if ((_step = _iterator.n()).done) {
                _context3.n = 7;
                break;
              }
              pattern = _step.value;
              if (!pattern.test(code)) {
                _context3.n = 6;
                break;
              }
              throw new Error("\u811A\u672C\u5305\u542B\u4E0D\u88AB\u5141\u8BB8\u7684\u64CD\u4F5C: ".concat(pattern.source));
            case 6:
              _context3.n = 5;
              break;
            case 7:
              _context3.n = 9;
              break;
            case 8:
              _context3.p = 8;
              _t3 = _context3.v;
              _iterator.e(_t3);
            case 9:
              _context3.p = 9;
              _iterator.f();
              return _context3.f(9);
            case 10:
              // 检查嵌套深度（防止复杂的恶意代码）
              maxNestingLevel = 10;
              nestingLevel = this.calculateNestingLevel(code);
              if (!(nestingLevel > maxNestingLevel)) {
                _context3.n = 11;
                break;
              }
              throw new Error("\u811A\u672C\u5D4C\u5957\u5C42\u7EA7\u8FC7\u6DF1: ".concat(nestingLevel, " > ").concat(maxNestingLevel));
            case 11:
              return _context3.a(2, true);
          }
        }, _callee3, this, [[4, 8, 9, 10]]);
      }));
      function validateScript(_x4) {
        return _validateScript.apply(this, arguments);
      }
      return validateScript;
    }()
    /**
     * 计算代码嵌套层级
     * @param {string} code - 代码字符串
     * @returns {number} 嵌套层级
     */
    )
  }, {
    key: "calculateNestingLevel",
    value: function calculateNestingLevel(code) {
      var currentLevel = 0;
      var maxLevel = 0;
      var _iterator2 = _createForOfIteratorHelper(code),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _char = _step2.value;
          if (_char === '{' || _char === '(' || _char === '[') {
            currentLevel++;
            maxLevel = Math.max(maxLevel, currentLevel);
          } else if (_char === '}' || _char === ')' || _char === ']') {
            currentLevel--;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return maxLevel;
    }

    /**
     * 验证CSS选择器是否安全
     * @param {string} selector - CSS选择器
     * @returns {Promise<boolean>} 是否安全
     * @throws {Error} 如果选择器不安全
     */
  }, {
    key: "validateSelector",
    value: (function () {
      var _validateSelector = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(selector) {
        var dangerousSelectorPatterns, _i, _dangerousSelectorPat, pattern;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              if (!(!selector || typeof selector !== 'string')) {
                _context4.n = 1;
                break;
              }
              throw new Error('无效的选择器');
            case 1:
              if (!(selector.length > 1000)) {
                _context4.n = 2;
                break;
              }
              throw new Error('选择器过长，最大允许1000字符');
            case 2:
              // 检查危险的选择器模式
              dangerousSelectorPatterns = [/javascript:/gi, /data:/gi, /vbscript:/gi, /<script/gi, /onload=/gi, /onclick=/gi, /onerror=/gi];
              _i = 0, _dangerousSelectorPat = dangerousSelectorPatterns;
            case 3:
              if (!(_i < _dangerousSelectorPat.length)) {
                _context4.n = 5;
                break;
              }
              pattern = _dangerousSelectorPat[_i];
              if (!pattern.test(selector)) {
                _context4.n = 4;
                break;
              }
              throw new Error("\u9009\u62E9\u5668\u5305\u542B\u4E0D\u5B89\u5168\u7684\u5185\u5BB9: ".concat(pattern.source));
            case 4:
              _i++;
              _context4.n = 3;
              break;
            case 5:
              return _context4.a(2, true);
          }
        }, _callee4);
      }));
      function validateSelector(_x5) {
        return _validateSelector.apply(this, arguments);
      }
      return validateSelector;
    }()
    /**
     * 验证超时时间是否合理
     * @param {number} timeout - 超时时间（毫秒）
     * @returns {Promise<boolean>} 是否合理
     * @throws {Error} 如果超时时间不合理
     */
    )
  }, {
    key: "validateTimeout",
    value: (function () {
      var _validateTimeout = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(timeout) {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              if (!(typeof timeout !== 'number' || timeout < 0)) {
                _context5.n = 1;
                break;
              }
              throw new Error('无效的超时时间');
            case 1:
              if (!(timeout > this.config.maxExecutionTime)) {
                _context5.n = 2;
                break;
              }
              throw new Error("\u8D85\u65F6\u65F6\u95F4\u8FC7\u957F: ".concat(timeout, "ms > ").concat(this.config.maxExecutionTime, "ms"));
            case 2:
              return _context5.a(2, true);
          }
        }, _callee5, this);
      }));
      function validateTimeout(_x6) {
        return _validateTimeout.apply(this, arguments);
      }
      return validateTimeout;
    }()
    /**
     * 工具特定的验证逻辑
     * @param {string} toolName - 工具名称
     * @param {Object} args - 工具参数
     * @returns {Promise<boolean>} 是否通过验证
     */
    )
  }, {
    key: "validateToolSpecific",
    value: (function () {
      var _validateToolSpecific = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(toolName, args) {
        var _t4;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _t4 = toolName;
              _context6.n = _t4 === BROWSER_TOOLS.TYPE ? 1 : _t4 === BROWSER_TOOLS.SCREENSHOT ? 2 : _t4 === BROWSER_TOOLS.CLICK ? 3 : 4;
              break;
            case 1:
              return _context6.a(2, this.validateTypeOperation(args));
            case 2:
              return _context6.a(2, this.validateScreenshotOperation(args));
            case 3:
              return _context6.a(2, this.validateClickOperation(args));
            case 4:
              return _context6.a(2, true);
            case 5:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function validateToolSpecific(_x7, _x8) {
        return _validateToolSpecific.apply(this, arguments);
      }
      return validateToolSpecific;
    }()
    /**
     * 验证文本输入操作
     * @param {Object} args - 参数
     * @returns {Promise<boolean>} 是否允许
     */
    )
  }, {
    key: "validateTypeOperation",
    value: (function () {
      var _validateTypeOperation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(args) {
        var text;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              text = args.text;
              if (!(!text || typeof text !== 'string')) {
                _context7.n = 1;
                break;
              }
              throw new Error('无效的输入文本');
            case 1:
              if (!(text.length > 10000)) {
                _context7.n = 2;
                break;
              }
              throw new Error('输入文本过长，最大允许10000字符');
            case 2:
              if (!/<script|javascript:|data:/gi.test(text)) {
                _context7.n = 3;
                break;
              }
              throw new Error('输入文本包含不安全的内容');
            case 3:
              return _context7.a(2, true);
          }
        }, _callee7);
      }));
      function validateTypeOperation(_x9) {
        return _validateTypeOperation.apply(this, arguments);
      }
      return validateTypeOperation;
    }()
    /**
     * 验证截图操作
     * @param {Object} args - 参数
     * @returns {Promise<boolean>} 是否允许
     */
    )
  }, {
    key: "validateScreenshotOperation",
    value: (function () {
      var _validateScreenshotOperation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(args) {
        var quality, format;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              quality = args.quality, format = args.format; // 验证图片质量
              if (!(quality !== undefined)) {
                _context8.n = 1;
                break;
              }
              if (!(typeof quality !== 'number' || quality < 1 || quality > 100)) {
                _context8.n = 1;
                break;
              }
              throw new Error('图片质量必须在1-100之间');
            case 1:
              if (!(format && !['png', 'jpeg', 'jpg'].includes(format.toLowerCase()))) {
                _context8.n = 2;
                break;
              }
              throw new Error('不支持的图片格式');
            case 2:
              return _context8.a(2, true);
          }
        }, _callee8);
      }));
      function validateScreenshotOperation(_x0) {
        return _validateScreenshotOperation.apply(this, arguments);
      }
      return validateScreenshotOperation;
    }()
    /**
     * 验证点击操作
     * @param {Object} args - 参数
     * @returns {Promise<boolean>} 是否允许
     */
    )
  }, {
    key: "validateClickOperation",
    value: (function () {
      var _validateClickOperation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(args) {
        var button;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              button = args.button; // 验证鼠标按键
              if (!(button && !['left', 'right', 'middle'].includes(button))) {
                _context9.n = 1;
                break;
              }
              throw new Error('无效的鼠标按键');
            case 1:
              return _context9.a(2, true);
          }
        }, _callee9);
      }));
      function validateClickOperation(_x1) {
        return _validateClickOperation.apply(this, arguments);
      }
      return validateClickOperation;
    }()
    /**
     * 获取安全策略配置
     * @returns {Object} 配置信息
     */
    )
  }, {
    key: "getConfig",
    value: function getConfig() {
      return _objectSpread2(_objectSpread2({}, this.config), {}, {
        dangerousPatternsCount: this.dangerousPatterns.length
      });
    }

    /**
     * 更新安全策略配置
     * @param {Object} newConfig - 新配置
     */
  }, {
    key: "updateConfig",
    value: function updateConfig(newConfig) {
      this.config = _objectSpread2(_objectSpread2({}, this.config), newConfig);
      this.logger.info('安全策略配置已更新');
    }
  }]);
}();

var BrowserInstancePool$1 = /*#__PURE__*/function (_EventEmitter) {
  function BrowserInstancePool() {
    var _this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, BrowserInstancePool);
    _this = _callSuper(this, BrowserInstancePool);
    _this.config = _objectSpread2({
      maxInstances: config.maxInstances || 3,
      maxIdleTime: config.maxIdleTime || 5 * 60 * 1000,
      // 5分钟
      maxReuseCount: config.maxReuseCount || 100,
      warmupInstances: config.warmupInstances || 1,
      engine: config.engine || 'puppeteer',
      launchOptions: config.launchOptions || {
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    }, config);
    _this.instances = new Map(); // instanceId -> InstanceInfo
    _this.availableInstances = new Set(); // 可用实例ID集合
    _this.busyInstances = new Set(); // 忙碌实例ID集合
    _this.cleanupTimer = null;
    _this.stats = {
      created: 0,
      destroyed: 0,
      hits: 0,
      misses: 0,
      totalReuseCount: 0
    };
    _this.startCleanupTimer();
    return _this;
  }

  /**
   * 获取浏览器实例
   * @param {Object} options - 获取选项
   * @returns {Promise<Object>} 实例信息 {browser, instanceId, returnInstance}
   */
  _inherits(BrowserInstancePool, _EventEmitter);
  return _createClass(BrowserInstancePool, [{
    key: "getInstance",
    value: (function () {
      var _getInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this2 = this;
        var options,
          availableId,
          instance,
          instanceId,
          _instance,
          _args = arguments,
          _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              _context.p = 1;
              // 优先从池中获取可用实例
              availableId = this.getAvailableInstance();
              if (!availableId) {
                _context.n = 2;
                break;
              }
              instance = this.instances.get(availableId);
              this.markInstanceBusy(availableId);
              this.stats.hits++;
              this.emit('instanceAcquired', {
                instanceId: availableId,
                fromPool: true,
                poolSize: this.instances.size
              });
              return _context.a(2, {
                browser: instance.browser,
                instanceId: availableId,
                returnInstance: function returnInstance() {
                  return _this2.returnInstance(availableId);
                }
              });
            case 2:
              if (!(this.instances.size < this.config.maxInstances)) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return this.createNewInstance();
            case 3:
              instanceId = _context.v;
              this.markInstanceBusy(instanceId);
              this.stats.misses++;
              _instance = this.instances.get(instanceId);
              this.emit('instanceAcquired', {
                instanceId: instanceId,
                fromPool: false,
                poolSize: this.instances.size
              });
              return _context.a(2, {
                browser: _instance.browser,
                instanceId: instanceId,
                returnInstance: function returnInstance() {
                  return _this2.returnInstance(instanceId);
                }
              });
            case 4:
              // 达到最大实例数，等待可用实例
              this.stats.misses++;
              _context.n = 5;
              return this.waitForAvailableInstance(options.timeout || 30000);
            case 5:
              return _context.a(2, _context.v);
            case 6:
              _context.p = 6;
              _t = _context.v;
              this.emit('error', {
                operation: 'getInstance',
                error: _t
              });
              throw _t;
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[1, 6]]);
      }));
      function getInstance() {
        return _getInstance.apply(this, arguments);
      }
      return getInstance;
    }()
    /**
     * 归还实例到池中
     * @param {string} instanceId - 实例ID
     */
    )
  }, {
    key: "returnInstance",
    value: (function () {
      var _returnInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(instanceId) {
        var instance, isHealthy, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              instance = this.instances.get(instanceId);
              if (instance) {
                _context2.n = 1;
                break;
              }
              console.warn("\u5C1D\u8BD5\u5F52\u8FD8\u4E0D\u5B58\u5728\u7684\u5B9E\u4F8B: ".concat(instanceId));
              return _context2.a(2);
            case 1:
              _context2.n = 2;
              return this.checkInstanceHealth(instance);
            case 2:
              isHealthy = _context2.v;
              if (!(!isHealthy || instance.reuseCount >= this.config.maxReuseCount)) {
                _context2.n = 4;
                break;
              }
              _context2.n = 3;
              return this.destroyInstance(instanceId);
            case 3:
              return _context2.a(2);
            case 4:
              _context2.n = 5;
              return this.cleanupInstance(instance);
            case 5:
              // 标记为可用
              this.markInstanceAvailable(instanceId);
              instance.lastReturnTime = Date.now();
              instance.reuseCount++;
              this.stats.totalReuseCount++;
              this.emit('instanceReturned', {
                instanceId: instanceId,
                reuseCount: instance.reuseCount,
                poolSize: this.instances.size
              });
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t2 = _context2.v;
              console.error("\u5F52\u8FD8\u5B9E\u4F8B\u5931\u8D25: ".concat(instanceId), _t2);
              _context2.n = 7;
              return this.destroyInstance(instanceId);
            case 7:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 6]]);
      }));
      function returnInstance(_x) {
        return _returnInstance.apply(this, arguments);
      }
      return returnInstance;
    }()
    /**
     * 创建新的浏览器实例
     * @returns {Promise<string>} 实例ID
     */
    )
  }, {
    key: "createNewInstance",
    value: (function () {
      var _createNewInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var _this3 = this;
        var instanceId, browser, puppeteer, _yield$import, chromium, instance, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              instanceId = "browser_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
              _context3.p = 1;
              if (!(this.config.engine === 'puppeteer')) {
                _context3.n = 4;
                break;
              }
              _context3.n = 2;
              return import('puppeteer');
            case 2:
              puppeteer = _context3.v;
              _context3.n = 3;
              return puppeteer.launch(this.config.launchOptions);
            case 3:
              browser = _context3.v;
              _context3.n = 8;
              break;
            case 4:
              if (!(this.config.engine === 'playwright')) {
                _context3.n = 7;
                break;
              }
              _context3.n = 5;
              return import('playwright');
            case 5:
              _yield$import = _context3.v;
              chromium = _yield$import.chromium;
              _context3.n = 6;
              return chromium.launch(this.config.launchOptions);
            case 6:
              browser = _context3.v;
              _context3.n = 8;
              break;
            case 7:
              throw new Error("\u4E0D\u652F\u6301\u7684\u6D4F\u89C8\u5668\u5F15\u64CE: ".concat(this.config.engine));
            case 8:
              instance = {
                browser: browser,
                instanceId: instanceId,
                createdTime: Date.now(),
                lastUsedTime: Date.now(),
                lastReturnTime: Date.now(),
                reuseCount: 0,
                engine: this.config.engine
              };
              this.instances.set(instanceId, instance);
              this.stats.created++;

              // 设置浏览器断开连接监听
              browser.on('disconnected', function () {
                console.warn("\u6D4F\u89C8\u5668\u5B9E\u4F8B\u65AD\u5F00\u8FDE\u63A5: ".concat(instanceId));
                _this3.destroyInstance(instanceId);
              });
              this.emit('instanceCreated', {
                instanceId: instanceId,
                engine: this.config.engine,
                poolSize: this.instances.size
              });
              return _context3.a(2, instanceId);
            case 9:
              _context3.p = 9;
              _t3 = _context3.v;
              console.error("\u521B\u5EFA\u6D4F\u89C8\u5668\u5B9E\u4F8B\u5931\u8D25:", _t3);
              this.instances["delete"](instanceId);
              throw _t3;
            case 10:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 9]]);
      }));
      function createNewInstance() {
        return _createNewInstance.apply(this, arguments);
      }
      return createNewInstance;
    }()
    /**
     * 销毁浏览器实例
     * @param {string} instanceId - 实例ID
     */
    )
  }, {
    key: "destroyInstance",
    value: (function () {
      var _destroyInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(instanceId) {
        var instance, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              instance = this.instances.get(instanceId);
              if (instance) {
                _context4.n = 1;
                break;
              }
              return _context4.a(2);
            case 1:
              _context4.p = 1;
              _context4.n = 2;
              return instance.browser.close();
            case 2:
              _context4.n = 4;
              break;
            case 3:
              _context4.p = 3;
              _t4 = _context4.v;
              console.warn("\u5173\u95ED\u6D4F\u89C8\u5668\u5B9E\u4F8B\u5931\u8D25: ".concat(instanceId), _t4);
            case 4:
              this.instances["delete"](instanceId);
              this.availableInstances["delete"](instanceId);
              this.busyInstances["delete"](instanceId);
              this.stats.destroyed++;
              this.emit('instanceDestroyed', {
                instanceId: instanceId,
                reuseCount: instance.reuseCount,
                poolSize: this.instances.size
              });
            case 5:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 3]]);
      }));
      function destroyInstance(_x2) {
        return _destroyInstance.apply(this, arguments);
      }
      return destroyInstance;
    }()
    /**
     * 获取可用实例ID
     * @returns {string|null}
     */
    )
  }, {
    key: "getAvailableInstance",
    value: function getAvailableInstance() {
      var _iterator = _createForOfIteratorHelper(this.availableInstances),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var instanceId = _step.value;
          var instance = this.instances.get(instanceId);
          if (instance && instance.reuseCount < this.config.maxReuseCount) {
            return instanceId;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return null;
    }

    /**
     * 标记实例为忙碌状态
     * @param {string} instanceId
     */
  }, {
    key: "markInstanceBusy",
    value: function markInstanceBusy(instanceId) {
      this.availableInstances["delete"](instanceId);
      this.busyInstances.add(instanceId);
      var instance = this.instances.get(instanceId);
      if (instance) {
        instance.lastUsedTime = Date.now();
      }
    }

    /**
     * 标记实例为可用状态
     * @param {string} instanceId
     */
  }, {
    key: "markInstanceAvailable",
    value: function markInstanceAvailable(instanceId) {
      this.busyInstances["delete"](instanceId);
      this.availableInstances.add(instanceId);
    }

    /**
     * 等待可用实例
     * @param {number} timeout - 超时时间(ms)
     * @returns {Promise<Object>}
     */
  }, {
    key: "waitForAvailableInstance",
    value: (function () {
      var _waitForAvailableInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var _this4 = this;
        var timeout,
          _args6 = arguments;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              timeout = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : 30000;
              return _context6.a(2, new Promise(function (resolve, reject) {
                var timeoutId = setTimeout(function () {
                  _this4.removeListener('instanceReturned', _onInstanceReturned);
                  reject(new Error('等待可用浏览器实例超时'));
                }, timeout);
                var _onInstanceReturned = /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
                    var result, _t5;
                    return _regenerator().w(function (_context5) {
                      while (1) switch (_context5.p = _context5.n) {
                        case 0:
                          clearTimeout(timeoutId);
                          _this4.removeListener('instanceReturned', _onInstanceReturned);
                          _context5.p = 1;
                          _context5.n = 2;
                          return _this4.getInstance();
                        case 2:
                          result = _context5.v;
                          resolve(result);
                          _context5.n = 4;
                          break;
                        case 3:
                          _context5.p = 3;
                          _t5 = _context5.v;
                          reject(_t5);
                        case 4:
                          return _context5.a(2);
                      }
                    }, _callee5, null, [[1, 3]]);
                  }));
                  return function onInstanceReturned() {
                    return _ref.apply(this, arguments);
                  };
                }();
                _this4.once('instanceReturned', _onInstanceReturned);
              }));
          }
        }, _callee6);
      }));
      function waitForAvailableInstance() {
        return _waitForAvailableInstance.apply(this, arguments);
      }
      return waitForAvailableInstance;
    }()
    /**
     * 检查实例健康状态
     * @param {Object} instance - 实例对象
     * @returns {Promise<boolean>}
     */
    )
  }, {
    key: "checkInstanceHealth",
    value: (function () {
      var _checkInstanceHealth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(instance) {
        var page, _t6;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              if (!(!instance.browser.isConnected || !instance.browser.isConnected())) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2, false);
            case 1:
              _context7.n = 2;
              return instance.browser.newPage();
            case 2:
              page = _context7.v;
              _context7.n = 3;
              return page.close();
            case 3:
              return _context7.a(2, true);
            case 4:
              _context7.p = 4;
              _t6 = _context7.v;
              console.warn("\u5B9E\u4F8B\u5065\u5EB7\u68C0\u67E5\u5931\u8D25: ".concat(instance.instanceId), _t6);
              return _context7.a(2, false);
          }
        }, _callee7, null, [[0, 4]]);
      }));
      function checkInstanceHealth(_x3) {
        return _checkInstanceHealth.apply(this, arguments);
      }
      return checkInstanceHealth;
    }()
    /**
     * 清理实例状态
     * @param {Object} instance - 实例对象
     */
    )
  }, {
    key: "cleanupInstance",
    value: (function () {
      var _cleanupInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(instance) {
        var pages, i, firstPage, _t7, _t8, _t9;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return instance.browser.pages();
            case 1:
              pages = _context8.v;
              i = 1;
            case 2:
              if (!(i < pages.length)) {
                _context8.n = 7;
                break;
              }
              _context8.p = 3;
              _context8.n = 4;
              return pages[i].close();
            case 4:
              _context8.n = 6;
              break;
            case 5:
              _context8.p = 5;
              _t7 = _context8.v;
              console.warn("\u5173\u95ED\u9875\u9762\u5931\u8D25:", _t7);
            case 6:
              i++;
              _context8.n = 2;
              break;
            case 7:
              if (!(pages.length > 0)) {
                _context8.n = 12;
                break;
              }
              firstPage = pages[0];
              _context8.p = 8;
              _context8.n = 9;
              return firstPage["goto"]('about:blank');
            case 9:
              _context8.n = 10;
              return firstPage.setViewport({
                width: 1920,
                height: 1080
              });
            case 10:
              _context8.n = 12;
              break;
            case 11:
              _context8.p = 11;
              _t8 = _context8.v;
              console.warn("\u91CD\u7F6E\u9875\u9762\u5931\u8D25:", _t8);
            case 12:
              _context8.n = 14;
              break;
            case 13:
              _context8.p = 13;
              _t9 = _context8.v;
              console.warn("\u6E05\u7406\u5B9E\u4F8B\u72B6\u6001\u5931\u8D25: ".concat(instance.instanceId), _t9);
            case 14:
              return _context8.a(2);
          }
        }, _callee8, null, [[8, 11], [3, 5], [0, 13]]);
      }));
      function cleanupInstance(_x4) {
        return _cleanupInstance.apply(this, arguments);
      }
      return cleanupInstance;
    }()
    /**
     * 启动定期清理任务
     */
    )
  }, {
    key: "startCleanupTimer",
    value: function startCleanupTimer() {
      var _this5 = this;
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
      }
      this.cleanupTimer = setInterval(function () {
        _this5.performCleanup();
      }, 60 * 1000); // 每分钟检查一次
    }

    /**
     * 执行清理任务
     */
  }, {
    key: "performCleanup",
    value: (function () {
      var _performCleanup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var now, instancesToDestroy, _iterator2, _step2, _step2$value, _instanceId, instance, _i, _instancesToDestroy, instanceId;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              now = Date.now();
              instancesToDestroy = [];
              _iterator2 = _createForOfIteratorHelper(this.instances);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _step2$value = _slicedToArray(_step2.value, 2), _instanceId = _step2$value[0], instance = _step2$value[1];
                  // 清理空闲时间过长的实例
                  if (this.availableInstances.has(_instanceId) && now - instance.lastReturnTime > this.config.maxIdleTime) {
                    instancesToDestroy.push(_instanceId);
                  }

                  // 清理重用次数过多的实例
                  if (instance.reuseCount >= this.config.maxReuseCount) {
                    instancesToDestroy.push(_instanceId);
                  }
                }

                // 销毁需要清理的实例
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              _i = 0, _instancesToDestroy = instancesToDestroy;
            case 1:
              if (!(_i < _instancesToDestroy.length)) {
                _context9.n = 3;
                break;
              }
              instanceId = _instancesToDestroy[_i];
              _context9.n = 2;
              return this.destroyInstance(instanceId);
            case 2:
              _i++;
              _context9.n = 1;
              break;
            case 3:
              this.emit('cleanupCompleted', {
                destroyedCount: instancesToDestroy.length,
                poolSize: this.instances.size
              });
            case 4:
              return _context9.a(2);
          }
        }, _callee9, this);
      }));
      function performCleanup() {
        return _performCleanup.apply(this, arguments);
      }
      return performCleanup;
    }()
    /**
     * 预热实例池
     */
    )
  }, {
    key: "warmup",
    value: (function () {
      var _warmup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _this6 = this;
        var warmupCount, promises, i;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              warmupCount = Math.min(this.config.warmupInstances, this.config.maxInstances);
              promises = [];
              for (i = 0; i < warmupCount; i++) {
                promises.push(this.createNewInstance().then(function (instanceId) {
                  _this6.markInstanceAvailable(instanceId);
                }));
              }
              _context0.n = 1;
              return Promise.all(promises);
            case 1:
              this.emit('warmupCompleted', {
                instanceCount: warmupCount,
                poolSize: this.instances.size
              });
            case 2:
              return _context0.a(2);
          }
        }, _callee0, this);
      }));
      function warmup() {
        return _warmup.apply(this, arguments);
      }
      return warmup;
    }()
    /**
     * 获取池统计信息
     * @returns {Object} 统计信息
     */
    )
  }, {
    key: "getStats",
    value: function getStats() {
      return _objectSpread2(_objectSpread2({}, this.stats), {}, {
        poolSize: this.instances.size,
        availableCount: this.availableInstances.size,
        busyCount: this.busyInstances.size,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        avgReuseCount: this.stats.totalReuseCount / this.stats.destroyed || 0
      });
    }

    /**
     * 销毁整个实例池
     */
  }, {
    key: "destroy",
    value: (function () {
      var _destroy = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var _this7 = this;
        var destroyPromises;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              if (this.cleanupTimer) {
                clearInterval(this.cleanupTimer);
                this.cleanupTimer = null;
              }
              destroyPromises = Array.from(this.instances.keys()).map(function (instanceId) {
                return _this7.destroyInstance(instanceId);
              });
              _context1.n = 1;
              return Promise.all(destroyPromises);
            case 1:
              this.emit('poolDestroyed', {
                finalStats: this.getStats()
              });
            case 2:
              return _context1.a(2);
          }
        }, _callee1, this);
      }));
      function destroy() {
        return _destroy.apply(this, arguments);
      }
      return destroy;
    }())
  }]);
}(events.EventEmitter);

var BrowserToolMonitor$1 = /*#__PURE__*/function (_EventEmitter) {
  function BrowserToolMonitor() {
    var _config$alertThreshol, _config$alertThreshol2, _config$alertThreshol3;
    var _this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, BrowserToolMonitor);
    _this = _callSuper(this, BrowserToolMonitor);
    _this.config = _objectSpread2({
      enabled: config.enabled !== false,
      metricsRetention: config.metricsRetention || 24 * 60 * 60 * 1000,
      // 24小时
      alertThresholds: _objectSpread2({
        errorRate: ((_config$alertThreshol = config.alertThresholds) === null || _config$alertThreshol === void 0 ? void 0 : _config$alertThreshol.errorRate) || 0.1,
        // 10%错误率
        avgExecutionTime: ((_config$alertThreshol2 = config.alertThresholds) === null || _config$alertThreshol2 === void 0 ? void 0 : _config$alertThreshol2.avgExecutionTime) || 30000,
        // 30秒
        timeoutRate: ((_config$alertThreshol3 = config.alertThresholds) === null || _config$alertThreshol3 === void 0 ? void 0 : _config$alertThreshol3.timeoutRate) || 0.05
      }, config.alertThresholds)
    }, config);
    _this.metrics = {
      toolExecutions: new Map(),
      // toolName -> ExecutionMetrics
      globalStats: {
        totalExecutions: 0,
        totalErrors: 0,
        totalTimeouts: 0,
        totalDuration: 0,
        startTime: Date.now()
      },
      recentExecutions: [],
      // 最近执行的记录（用于趋势分析）
      alerts: [] // 警报记录
    };
    _this.cleanupTimer = null;
    if (_this.config.enabled) {
      _this.startMetricsCleanup();
    }
    return _this;
  }

  /**
   * 开始监控工具执行
   * @param {string} toolName - 工具名称
   * @param {Object} context - 执行上下文
   * @returns {Object} 监控会话对象
   */
  _inherits(BrowserToolMonitor, _EventEmitter);
  return _createClass(BrowserToolMonitor, [{
    key: "startExecution",
    value: function startExecution(toolName) {
      var _this2 = this;
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!this.config.enabled) {
        return {
          finish: function finish() {},
          error: function error() {},
          timeout: function timeout() {}
        };
      }
      var executionId = "".concat(toolName, "_").concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6));
      var startTime = Date.now();
      var memoryUsage = this.getMemoryUsage();
      var execution = {
        executionId: executionId,
        toolName: toolName,
        startTime: startTime,
        context: _objectSpread2({}, context),
        memoryStart: memoryUsage,
        status: 'running'
      };

      // 初始化工具指标
      if (!this.metrics.toolExecutions.has(toolName)) {
        this.metrics.toolExecutions.set(toolName, {
          toolName: toolName,
          totalExecutions: 0,
          successCount: 0,
          errorCount: 0,
          timeoutCount: 0,
          totalDuration: 0,
          minDuration: Infinity,
          maxDuration: 0,
          avgDuration: 0,
          errorRate: 0,
          timeoutRate: 0,
          recentExecutions: [],
          memoryUsage: {
            min: Infinity,
            max: 0,
            avg: 0,
            total: 0
          }
        });
      }
      var toolMetrics = this.metrics.toolExecutions.get(toolName);
      toolMetrics.totalExecutions++;
      this.metrics.globalStats.totalExecutions++;
      this.emit('executionStarted', {
        executionId: executionId,
        toolName: toolName,
        startTime: startTime,
        context: context
      });
      return {
        finish: function finish() {
          var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          return _this2.finishExecution(execution, result);
        },
        error: function error(_error) {
          return _this2.errorExecution(execution, _error);
        },
        timeout: function timeout() {
          return _this2.timeoutExecution(execution);
        }
      };
    }

    /**
     * 完成工具执行监控
     * @param {Object} execution - 执行对象
     * @param {Object} result - 执行结果
     */
  }, {
    key: "finishExecution",
    value: function finishExecution(execution) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var endTime = Date.now();
      var duration = endTime - execution.startTime;
      var memoryEnd = this.getMemoryUsage();
      var memoryDelta = memoryEnd.heapUsed - execution.memoryStart.heapUsed;
      execution.endTime = endTime;
      execution.duration = duration;
      execution.memoryEnd = memoryEnd;
      execution.memoryDelta = memoryDelta;
      execution.result = result;
      execution.status = 'success';
      var toolMetrics = this.metrics.toolExecutions.get(execution.toolName);

      // 更新成功统计
      toolMetrics.successCount++;
      toolMetrics.totalDuration += duration;
      toolMetrics.minDuration = Math.min(toolMetrics.minDuration, duration);
      toolMetrics.maxDuration = Math.max(toolMetrics.maxDuration, duration);
      toolMetrics.avgDuration = toolMetrics.totalDuration / toolMetrics.totalExecutions;

      // 更新内存使用统计
      var memUsage = toolMetrics.memoryUsage;
      memUsage.min = Math.min(memUsage.min, memoryEnd.heapUsed);
      memUsage.max = Math.max(memUsage.max, memoryEnd.heapUsed);
      memUsage.total += memoryEnd.heapUsed;
      memUsage.avg = memUsage.total / toolMetrics.totalExecutions;

      // 更新全局统计
      this.metrics.globalStats.totalDuration += duration;

      // 更新最近执行记录
      this.addRecentExecution(execution);
      toolMetrics.recentExecutions.push(_objectSpread2(_objectSpread2({}, execution), {}, {
        timestamp: endTime
      }));

      // 保持最近执行记录的数量限制
      if (toolMetrics.recentExecutions.length > 100) {
        toolMetrics.recentExecutions = toolMetrics.recentExecutions.slice(-100);
      }

      // 计算错误率和超时率
      this.updateRates(toolMetrics);

      // 检查性能警报
      this.checkPerformanceAlerts(execution.toolName, toolMetrics);
      this.emit('executionCompleted', {
        executionId: execution.executionId,
        toolName: execution.toolName,
        duration: duration,
        memoryDelta: memoryDelta,
        result: result
      });
    }

    /**
     * 记录工具执行错误
     * @param {Object} execution - 执行对象
     * @param {Error} error - 错误对象
     */
  }, {
    key: "errorExecution",
    value: function errorExecution(execution, error) {
      var endTime = Date.now();
      var duration = endTime - execution.startTime;
      execution.endTime = endTime;
      execution.duration = duration;
      execution.error = error;
      execution.status = 'error';
      var toolMetrics = this.metrics.toolExecutions.get(execution.toolName);
      toolMetrics.errorCount++;
      this.metrics.globalStats.totalErrors++;

      // 更新最近执行记录
      this.addRecentExecution(execution);

      // 更新错误率
      this.updateRates(toolMetrics);

      // 检查错误率警报
      this.checkErrorAlerts(execution.toolName, toolMetrics);
      this.emit('executionError', {
        executionId: execution.executionId,
        toolName: execution.toolName,
        duration: duration,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      });
    }

    /**
     * 记录工具执行超时
     * @param {Object} execution - 执行对象
     */
  }, {
    key: "timeoutExecution",
    value: function timeoutExecution(execution) {
      var endTime = Date.now();
      var duration = endTime - execution.startTime;
      execution.endTime = endTime;
      execution.duration = duration;
      execution.status = 'timeout';
      var toolMetrics = this.metrics.toolExecutions.get(execution.toolName);
      toolMetrics.timeoutCount++;
      this.metrics.globalStats.totalTimeouts++;

      // 更新最近执行记录
      this.addRecentExecution(execution);

      // 更新超时率
      this.updateRates(toolMetrics);

      // 检查超时率警报
      this.checkTimeoutAlerts(execution.toolName, toolMetrics);
      this.emit('executionTimeout', {
        executionId: execution.executionId,
        toolName: execution.toolName,
        duration: duration
      });
    }

    /**
     * 添加到最近执行记录
     * @param {Object} execution - 执行对象
     */
  }, {
    key: "addRecentExecution",
    value: function addRecentExecution(execution) {
      this.metrics.recentExecutions.push(_objectSpread2(_objectSpread2({}, execution), {}, {
        timestamp: execution.endTime || Date.now()
      }));

      // 保持最近执行记录的数量限制
      if (this.metrics.recentExecutions.length > 1000) {
        this.metrics.recentExecutions = this.metrics.recentExecutions.slice(-1e3);
      }
    }

    /**
     * 更新错误率和超时率
     * @param {Object} toolMetrics - 工具指标
     */
  }, {
    key: "updateRates",
    value: function updateRates(toolMetrics) {
      var total = toolMetrics.totalExecutions;
      toolMetrics.errorRate = total > 0 ? toolMetrics.errorCount / total : 0;
      toolMetrics.timeoutRate = total > 0 ? toolMetrics.timeoutCount / total : 0;
    }

    /**
     * 检查性能警报
     * @param {string} toolName - 工具名称
     * @param {Object} toolMetrics - 工具指标
     */
  }, {
    key: "checkPerformanceAlerts",
    value: function checkPerformanceAlerts(toolName, toolMetrics) {
      var thresholds = this.config.alertThresholds;

      // 检查平均执行时间
      if (toolMetrics.avgDuration > thresholds.avgExecutionTime) {
        this.createAlert('performance', {
          toolName: toolName,
          metric: 'avgExecutionTime',
          value: toolMetrics.avgDuration,
          threshold: thresholds.avgExecutionTime,
          message: "\u5DE5\u5177 ".concat(toolName, " \u5E73\u5747\u6267\u884C\u65F6\u95F4 ").concat(toolMetrics.avgDuration, "ms \u8D85\u8FC7\u9608\u503C ").concat(thresholds.avgExecutionTime, "ms")
        });
      }
    }

    /**
     * 检查错误率警报
     * @param {string} toolName - 工具名称
     * @param {Object} toolMetrics - 工具指标
     */
  }, {
    key: "checkErrorAlerts",
    value: function checkErrorAlerts(toolName, toolMetrics) {
      var thresholds = this.config.alertThresholds;
      if (toolMetrics.errorRate > thresholds.errorRate && toolMetrics.totalExecutions >= 10) {
        this.createAlert('error_rate', {
          toolName: toolName,
          metric: 'errorRate',
          value: toolMetrics.errorRate,
          threshold: thresholds.errorRate,
          message: "\u5DE5\u5177 ".concat(toolName, " \u9519\u8BEF\u7387 ").concat((toolMetrics.errorRate * 100).toFixed(2), "% \u8D85\u8FC7\u9608\u503C ").concat((thresholds.errorRate * 100).toFixed(2), "%")
        });
      }
    }

    /**
     * 检查超时率警报
     * @param {string} toolName - 工具名称
     * @param {Object} toolMetrics - 工具指标
     */
  }, {
    key: "checkTimeoutAlerts",
    value: function checkTimeoutAlerts(toolName, toolMetrics) {
      var thresholds = this.config.alertThresholds;
      if (toolMetrics.timeoutRate > thresholds.timeoutRate && toolMetrics.totalExecutions >= 10) {
        this.createAlert('timeout_rate', {
          toolName: toolName,
          metric: 'timeoutRate',
          value: toolMetrics.timeoutRate,
          threshold: thresholds.timeoutRate,
          message: "\u5DE5\u5177 ".concat(toolName, " \u8D85\u65F6\u7387 ").concat((toolMetrics.timeoutRate * 100).toFixed(2), "% \u8D85\u8FC7\u9608\u503C ").concat((thresholds.timeoutRate * 100).toFixed(2), "%")
        });
      }
    }

    /**
     * 创建警报
     * @param {string} type - 警报类型
     * @param {Object} data - 警报数据
     */
  }, {
    key: "createAlert",
    value: function createAlert(type, data) {
      var alert = _objectSpread2({
        id: "alert_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6)),
        type: type,
        timestamp: Date.now(),
        level: this.getAlertLevel(type, data)
      }, data);
      this.metrics.alerts.push(alert);

      // 保持警报记录数量限制
      if (this.metrics.alerts.length > 500) {
        this.metrics.alerts = this.metrics.alerts.slice(-500);
      }
      this.emit('alert', alert);
    }

    /**
     * 获取警报级别
     * @param {string} type - 警报类型
     * @param {Object} data - 警报数据
     * @returns {string} 警报级别
     */
  }, {
    key: "getAlertLevel",
    value: function getAlertLevel(type, data) {
      switch (type) {
        case 'error_rate':
          return data.value > 0.3 ? 'critical' : data.value > 0.2 ? 'high' : 'medium';
        case 'timeout_rate':
          return data.value > 0.2 ? 'high' : 'medium';
        case 'performance':
          return data.value > 60000 ? 'high' : 'medium';
        default:
          return 'medium';
      }
    }

    /**
     * 获取内存使用情况
     * @returns {Object} 内存使用信息
     */
  }, {
    key: "getMemoryUsage",
    value: function getMemoryUsage() {
      if (typeof process !== 'undefined' && process.memoryUsage) {
        return process.memoryUsage();
      }
      return {
        heapUsed: 0,
        heapTotal: 0
      };
    }

    /**
     * 获取工具性能统计
     * @param {string} toolName - 工具名称（可选）
     * @returns {Object} 性能统计
     */
  }, {
    key: "getStats",
    value: function getStats() {
      var toolName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (toolName) {
        var toolMetrics = this.metrics.toolExecutions.get(toolName);
        if (!toolMetrics) {
          return null;
        }
        return _objectSpread2(_objectSpread2({}, toolMetrics), {}, {
          recentExecutions: toolMetrics.recentExecutions.slice(-10) // 只返回最近10次
        });
      }

      // 返回全局统计
      var globalStats = _objectSpread2({}, this.metrics.globalStats);
      globalStats.avgDuration = globalStats.totalExecutions > 0 ? globalStats.totalDuration / globalStats.totalExecutions : 0;
      globalStats.errorRate = globalStats.totalExecutions > 0 ? globalStats.totalErrors / globalStats.totalExecutions : 0;
      globalStats.timeoutRate = globalStats.totalExecutions > 0 ? globalStats.totalTimeouts / globalStats.totalExecutions : 0;
      globalStats.uptime = Date.now() - globalStats.startTime;
      return {
        global: globalStats,
        tools: Array.from(this.metrics.toolExecutions.values()).map(function (tool) {
          return {
            toolName: tool.toolName,
            totalExecutions: tool.totalExecutions,
            successCount: tool.successCount,
            errorCount: tool.errorCount,
            timeoutCount: tool.timeoutCount,
            avgDuration: tool.avgDuration,
            errorRate: tool.errorRate,
            timeoutRate: tool.timeoutRate,
            memoryUsage: tool.memoryUsage
          };
        }),
        alerts: this.metrics.alerts.slice(-20),
        // 最近20个警报
        recentExecutions: this.metrics.recentExecutions.slice(-50) // 最近50次执行
      };
    }

    /**
     * 获取性能趋势数据
     * @param {string} toolName - 工具名称
     * @param {number} timeRange - 时间范围(毫秒)
     * @returns {Object} 趋势数据
     */
  }, {
    key: "getTrends",
    value: function getTrends(toolName) {
      var timeRange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60 * 60 * 1000;
      // 默认1小时
      var now = Date.now();
      var startTime = now - timeRange;
      var toolMetrics = this.metrics.toolExecutions.get(toolName);
      if (!toolMetrics) {
        return null;
      }
      var recentExecutions = toolMetrics.recentExecutions.filter(function (exec) {
        return exec.timestamp >= startTime;
      });
      if (recentExecutions.length === 0) {
        return {
          noData: true
        };
      }

      // 按时间段分组统计
      var timeSlots = 10; // 分成10个时间段
      var slotDuration = timeRange / timeSlots;
      var trends = [];
      var _loop = function _loop() {
        var slotStart = startTime + i * slotDuration;
        var slotEnd = slotStart + slotDuration;
        var slotExecutions = recentExecutions.filter(function (exec) {
          return exec.timestamp >= slotStart && exec.timestamp < slotEnd;
        });
        var successCount = slotExecutions.filter(function (exec) {
          return exec.status === 'success';
        }).length;
        var errorCount = slotExecutions.filter(function (exec) {
          return exec.status === 'error';
        }).length;
        var timeoutCount = slotExecutions.filter(function (exec) {
          return exec.status === 'timeout';
        }).length;
        var avgDuration = slotExecutions.length > 0 ? slotExecutions.reduce(function (sum, exec) {
          return sum + exec.duration;
        }, 0) / slotExecutions.length : 0;
        trends.push({
          timestamp: slotStart,
          totalExecutions: slotExecutions.length,
          successCount: successCount,
          errorCount: errorCount,
          timeoutCount: timeoutCount,
          avgDuration: avgDuration,
          errorRate: slotExecutions.length > 0 ? errorCount / slotExecutions.length : 0
        });
      };
      for (var i = 0; i < timeSlots; i++) {
        _loop();
      }
      return {
        toolName: toolName,
        timeRange: timeRange,
        trends: trends,
        summary: {
          totalExecutions: recentExecutions.length,
          avgDuration: recentExecutions.reduce(function (sum, exec) {
            return sum + exec.duration;
          }, 0) / recentExecutions.length,
          errorRate: recentExecutions.filter(function (exec) {
            return exec.status === 'error';
          }).length / recentExecutions.length
        }
      };
    }

    /**
     * 重置指标数据
     * @param {string} toolName - 工具名称（可选，不提供则重置所有）
     */
  }, {
    key: "resetMetrics",
    value: function resetMetrics() {
      var toolName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (toolName) {
        this.metrics.toolExecutions["delete"](toolName);
      } else {
        this.metrics.toolExecutions.clear();
        this.metrics.globalStats = {
          totalExecutions: 0,
          totalErrors: 0,
          totalTimeouts: 0,
          totalDuration: 0,
          startTime: Date.now()
        };
        this.metrics.recentExecutions = [];
        this.metrics.alerts = [];
      }
      this.emit('metricsReset', {
        toolName: toolName
      });
    }

    /**
     * 启动指标清理定时器
     */
  }, {
    key: "startMetricsCleanup",
    value: function startMetricsCleanup() {
      var _this3 = this;
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
      }
      this.cleanupTimer = setInterval(function () {
        _this3.cleanupOldMetrics();
      }, 60 * 60 * 1000); // 每小时清理一次
    }

    /**
     * 清理过期的指标数据
     */
  }, {
    key: "cleanupOldMetrics",
    value: function cleanupOldMetrics() {
      var now = Date.now();
      var retention = this.config.metricsRetention;

      // 清理过期的最近执行记录
      this.metrics.recentExecutions = this.metrics.recentExecutions.filter(function (exec) {
        return now - exec.timestamp <= retention;
      });

      // 清理过期的工具执行记录
      var _iterator = _createForOfIteratorHelper(this.metrics.toolExecutions),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            toolName = _step$value[0],
            toolMetrics = _step$value[1];
          toolMetrics.recentExecutions = toolMetrics.recentExecutions.filter(function (exec) {
            return now - exec.timestamp <= retention;
          });
        }

        // 清理过期的警报
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.metrics.alerts = this.metrics.alerts.filter(function (alert) {
        return now - alert.timestamp <= retention;
      });
      this.emit('metricsCleanup', {
        recentExecutionsCount: this.metrics.recentExecutions.length,
        alertsCount: this.metrics.alerts.length
      });
    }

    /**
     * 销毁监控器
     */
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
      }
      this.removeAllListeners();
      this.emit('monitorDestroyed', {
        finalStats: this.getStats()
      });
    }
  }]);
}(events.EventEmitter);

/**
 * 安全配置常量
 */
var SECURITY_LEVELS = {
  STRICT: 'strict',
  // 严格模式：最高安全级别
  NORMAL: 'normal',
  // 正常模式：平衡安全性和功能性  
  PERMISSIVE: 'permissive' // 宽松模式：最大功能性
};
var RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * 浏览器工具安全管理器
 */
var BrowserSecurityManager = /*#__PURE__*/function () {
  function BrowserSecurityManager() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, BrowserSecurityManager);
    this.config = _objectSpread2({
      securityLevel: config.securityLevel || SECURITY_LEVELS.NORMAL,
      enableSandbox: config.enableSandbox !== false,
      maxExecutionTime: config.maxExecutionTime || 30000,
      // 30秒
      maxMemoryUsage: config.maxMemoryUsage || 512 * 1024 * 1024,
      // 512MB
      allowedDomains: config.allowedDomains || [],
      // 空数组表示允许所有域名
      blockedDomains: config.blockedDomains || ['localhost', '127.0.0.1', '0.0.0.0', '::1'],
      trustedOrigins: config.trustedOrigins || [],
      enableContentSecurityPolicy: config.enableContentSecurityPolicy !== false,
      enableNetworkInterception: config.enableNetworkInterception !== false,
      auditLog: config.auditLog !== false
    }, config);
    this.sessionTokens = new Map();
    this.executionLimits = new Map();
    this.auditLogs = [];
    this.blockedActions = new Set();

    // 预定义的危险函数/方法
    this.dangerousFunctions = new Set(['eval', 'Function', 'setTimeout', 'setInterval', 'require', 'import', 'fetch', 'XMLHttpRequest', 'WebSocket', 'Worker', 'SharedWorker', 'ServiceWorker']);

    // 预定义的敏感选择器
    this.sensitiveSelectors = new Set(['input[type="password"]', 'input[type="email"]', 'input[type="tel"]', '[data-sensitive]', '.password', '.sensitive', '.private']);
    this.initialize();
  }

  /**
   * 初始化安全管理器
   */
  return _createClass(BrowserSecurityManager, [{
    key: "initialize",
    value: function initialize() {
      this.setupSecurityPolicies();
      this.loadSecurityRules();
      if (this.config.auditLog) {
        this.startAuditLogging();
      }
      console.log("\uD83D\uDD12 \u6D4F\u89C8\u5668\u5B89\u5168\u7BA1\u7406\u5668\u5DF2\u521D\u59CB\u5316 (\u5B89\u5168\u7EA7\u522B: ".concat(this.config.securityLevel, ")"));
    }

    /**
     * 设置安全策略
     */
  }, {
    key: "setupSecurityPolicies",
    value: function setupSecurityPolicies() {
      // 根据安全级别调整策略
      switch (this.config.securityLevel) {
        case SECURITY_LEVELS.STRICT:
          this.config.maxExecutionTime = Math.min(this.config.maxExecutionTime, 15000);
          this.config.maxMemoryUsage = Math.min(this.config.maxMemoryUsage, 256 * 1024 * 1024);
          this.config.enableSandbox = true;
          this.config.enableContentSecurityPolicy = true;
          this.config.enableNetworkInterception = true;
          break;
        case SECURITY_LEVELS.PERMISSIVE:
          this.config.maxExecutionTime = Math.max(this.config.maxExecutionTime, 60000);
          this.config.enableContentSecurityPolicy = false;
          this.config.enableNetworkInterception = false;
          break;
      }
    }

    /**
     * 加载安全规则
     */
  }, {
    key: "loadSecurityRules",
    value: function loadSecurityRules() {
      var _this = this;
      try {
        // 尝试加载自定义安全规则文件
        var rulesFile = path.join(process.cwd(), 'browser-security-rules.json');
        if (fs.existsSync(rulesFile)) {
          var rules = JSON.parse(fs.readFileSync(rulesFile, 'utf-8'));
          if (rules.allowedDomains) {
            var _this$config$allowedD;
            (_this$config$allowedD = this.config.allowedDomains).push.apply(_this$config$allowedD, _toConsumableArray(rules.allowedDomains));
          }
          if (rules.blockedDomains) {
            var _this$config$blockedD;
            (_this$config$blockedD = this.config.blockedDomains).push.apply(_this$config$blockedD, _toConsumableArray(rules.blockedDomains));
          }
          if (rules.dangerousFunctions) {
            rules.dangerousFunctions.forEach(function (fn) {
              return _this.dangerousFunctions.add(fn);
            });
          }
          if (rules.sensitiveSelectors) {
            rules.sensitiveSelectors.forEach(function (sel) {
              return _this.sensitiveSelectors.add(sel);
            });
          }
          console.log('🔒 已加载自定义安全规则');
        }
      } catch (error) {
        console.warn('加载安全规则失败:', error.message);
      }
    }

    /**
     * 验证URL安全性
     */
  }, {
    key: "validateURL",
    value: function validateURL(url$1) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'navigation';
      var result = {
        isValid: false,
        riskLevel: RISK_LEVELS.LOW,
        violations: [],
        sanitizedUrl: null
      };
      try {
        var parsedUrl = new url.URL(url$1);
        result.sanitizedUrl = parsedUrl.href;

        // 协议检查
        if (!['http:', 'https:', 'file:'].includes(parsedUrl.protocol)) {
          result.violations.push({
            type: 'protocol',
            message: "\u4E0D\u5B89\u5168\u7684\u534F\u8BAE: ".concat(parsedUrl.protocol),
            severity: RISK_LEVELS.HIGH
          });
          result.riskLevel = RISK_LEVELS.HIGH;
        }

        // 域名黑名单检查
        if (this.config.blockedDomains.includes(parsedUrl.hostname)) {
          result.violations.push({
            type: 'blocked_domain',
            message: "\u57DF\u540D\u5728\u9ED1\u540D\u5355\u4E2D: ".concat(parsedUrl.hostname),
            severity: RISK_LEVELS.CRITICAL
          });
          result.riskLevel = RISK_LEVELS.CRITICAL;
        }

        // 域名白名单检查（如果配置了白名单）
        if (this.config.allowedDomains.length > 0 && !this.config.allowedDomains.includes(parsedUrl.hostname)) {
          result.violations.push({
            type: 'domain_not_allowed',
            message: "\u57DF\u540D\u4E0D\u5728\u767D\u540D\u5355\u4E2D: ".concat(parsedUrl.hostname),
            severity: RISK_LEVELS.HIGH
          });
          result.riskLevel = RISK_LEVELS.HIGH;
        }

        // 本地IP检查
        if (this.isLocalIP(parsedUrl.hostname)) {
          result.violations.push({
            type: 'local_ip',
            message: "\u68C0\u6D4B\u5230\u672C\u5730IP\u5730\u5740: ".concat(parsedUrl.hostname),
            severity: RISK_LEVELS.MEDIUM
          });
          result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
        }

        // 端口检查
        if (parsedUrl.port && this.isDangerousPort(parsedUrl.port)) {
          result.violations.push({
            type: 'dangerous_port',
            message: "\u5371\u9669\u7AEF\u53E3: ".concat(parsedUrl.port),
            severity: RISK_LEVELS.MEDIUM
          });
          result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
        }

        // 路径检查
        if (this.containsSuspiciousPath(parsedUrl.pathname)) {
          result.violations.push({
            type: 'suspicious_path',
            message: "\u53EF\u7591\u8DEF\u5F84: ".concat(parsedUrl.pathname),
            severity: RISK_LEVELS.MEDIUM
          });
          result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
        }

        // 安全级别检查
        result.isValid = this.isUrlAllowedBySecurityLevel(result.riskLevel);
      } catch (error) {
        result.violations.push({
          type: 'invalid_url',
          message: "URL\u683C\u5F0F\u65E0\u6548: ".concat(error.message),
          severity: RISK_LEVELS.HIGH
        });
        result.riskLevel = RISK_LEVELS.HIGH;
      }

      // 记录审计日志
      this.logSecurityEvent('url_validation', {
        url: url$1,
        context: context,
        result: result.isValid,
        riskLevel: result.riskLevel,
        violations: result.violations
      });
      return result;
    }

    /**
     * 验证选择器安全性
     */
  }, {
    key: "validateSelector",
    value: function validateSelector(selector) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'extraction';
      var result = {
        isValid: false,
        riskLevel: RISK_LEVELS.LOW,
        violations: [],
        sanitizedSelector: selector
      };

      // 检查是否为敏感选择器
      if (this.sensitiveSelectors.has(selector) || Array.from(this.sensitiveSelectors).some(function (sensitiveSelector) {
        return selector.includes(sensitiveSelector.replace(/^\w+/, '').replace(/\[.*\]$/, ''));
      })) {
        result.violations.push({
          type: 'sensitive_selector',
          message: "\u654F\u611F\u6570\u636E\u9009\u62E9\u5668: ".concat(selector),
          severity: RISK_LEVELS.HIGH
        });
        result.riskLevel = RISK_LEVELS.HIGH;
      }

      // 检查XSS向量
      if (this.containsXSSVector(selector)) {
        result.violations.push({
          type: 'xss_vector',
          message: "\u9009\u62E9\u5668\u5305\u542B\u6F5C\u5728XSS\u5411\u91CF",
          severity: RISK_LEVELS.CRITICAL
        });
        result.riskLevel = RISK_LEVELS.CRITICAL;
      }

      // 检查CSS注入
      if (this.containsCSSInjection(selector)) {
        result.violations.push({
          type: 'css_injection',
          message: "\u9009\u62E9\u5668\u5305\u542BCSS\u6CE8\u5165\u98CE\u9669",
          severity: RISK_LEVELS.MEDIUM
        });
        result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
      }

      // 净化选择器
      result.sanitizedSelector = this.sanitizeSelector(selector);
      result.isValid = this.isSelectorAllowedBySecurityLevel(result.riskLevel);
      this.logSecurityEvent('selector_validation', {
        selector: selector,
        context: context,
        result: result.isValid,
        riskLevel: result.riskLevel,
        violations: result.violations
      });
      return result;
    }

    /**
     * 验证JavaScript代码安全性
     */
  }, {
    key: "validateJavaScript",
    value: function validateJavaScript(code) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'evaluation';
      var result = {
        isValid: false,
        riskLevel: RISK_LEVELS.LOW,
        violations: [],
        sanitizedCode: code
      };

      // 检查危险函数
      var foundDangerousFunctions = Array.from(this.dangerousFunctions).filter(function (fn) {
        return code.includes(fn);
      });
      if (foundDangerousFunctions.length > 0) {
        result.violations.push({
          type: 'dangerous_functions',
          message: "\u4EE3\u7801\u5305\u542B\u5371\u9669\u51FD\u6570: ".concat(foundDangerousFunctions.join(', ')),
          severity: RISK_LEVELS.CRITICAL
        });
        result.riskLevel = RISK_LEVELS.CRITICAL;
      }

      // 检查网络请求
      if (this.containsNetworkRequests(code)) {
        result.violations.push({
          type: 'network_requests',
          message: '代码包含网络请求',
          severity: RISK_LEVELS.HIGH
        });
        result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.HIGH);
      }

      // 检查DOM操作
      if (this.containsDangerousDOMOperations(code)) {
        result.violations.push({
          type: 'dangerous_dom',
          message: '代码包含危险DOM操作',
          severity: RISK_LEVELS.MEDIUM
        });
        result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
      }

      // 检查代码复杂度
      if (this.isCodeTooComplex(code)) {
        result.violations.push({
          type: 'complex_code',
          message: '代码过于复杂',
          severity: RISK_LEVELS.MEDIUM
        });
        result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
      }

      // 净化代码
      result.sanitizedCode = this.sanitizeJavaScript(code);
      result.isValid = this.isJavaScriptAllowedBySecurityLevel(result.riskLevel);
      this.logSecurityEvent('javascript_validation', {
        codeLength: code.length,
        context: context,
        result: result.isValid,
        riskLevel: result.riskLevel,
        violations: result.violations
      });
      return result;
    }

    /**
     * 创建安全执行会话
     */
  }, {
    key: "createSecureSession",
    value: function createSecureSession() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var sessionId = this.generateSessionId();
      var token = this.generateSecureToken();
      var session = {
        id: sessionId,
        token: token,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        config: {
          maxExecutionTime: options.maxExecutionTime || this.config.maxExecutionTime,
          maxMemoryUsage: options.maxMemoryUsage || this.config.maxMemoryUsage,
          permissions: options.permissions || ['navigate', 'extract', 'interact'],
          sandbox: options.sandbox !== false && this.config.enableSandbox
        },
        stats: {
          operationsCount: 0,
          totalExecutionTime: 0,
          memoryPeak: 0
        }
      };
      this.sessionTokens.set(sessionId, session);
      this.executionLimits.set(sessionId, {
        startTime: Date.now(),
        operationCount: 0
      });
      this.logSecurityEvent('session_created', {
        sessionId: sessionId,
        config: session.config
      });
      return {
        sessionId: sessionId,
        token: token,
        config: session.config
      };
    }

    /**
     * 验证会话权限
     */
  }, {
    key: "validateSessionPermission",
    value: function validateSessionPermission(sessionId, operation) {
      var session = this.sessionTokens.get(sessionId);
      if (!session) {
        return {
          allowed: false,
          reason: 'Invalid session',
          riskLevel: RISK_LEVELS.HIGH
        };
      }

      // 检查会话是否过期
      var sessionAge = Date.now() - session.createdAt;
      if (sessionAge > 24 * 60 * 60 * 1000) {
        // 24小时过期
        this.sessionTokens["delete"](sessionId);
        return {
          allowed: false,
          reason: 'Session expired',
          riskLevel: RISK_LEVELS.MEDIUM
        };
      }

      // 检查操作权限
      if (!session.config.permissions.includes(operation)) {
        return {
          allowed: false,
          reason: "Operation not permitted: ".concat(operation),
          riskLevel: RISK_LEVELS.HIGH
        };
      }

      // 检查执行时间限制
      var executionTime = Date.now() - this.executionLimits.get(sessionId).startTime;
      if (executionTime > session.config.maxExecutionTime) {
        return {
          allowed: false,
          reason: 'Execution time limit exceeded',
          riskLevel: RISK_LEVELS.MEDIUM
        };
      }

      // 检查操作频率
      var limits = this.executionLimits.get(sessionId);
      limits.operationCount++;
      if (limits.operationCount > 100) {
        // 单会话最多100个操作
        return {
          allowed: false,
          reason: 'Operation count limit exceeded',
          riskLevel: RISK_LEVELS.MEDIUM
        };
      }

      // 更新会话活动时间
      session.lastActivity = Date.now();
      session.stats.operationsCount++;
      return {
        allowed: true,
        sessionInfo: session
      };
    }

    /**
     * 监控执行环境
     */
  }, {
    key: "monitorExecution",
    value: function monitorExecution(sessionId, callback) {
      var _this2 = this;
      var session = this.sessionTokens.get(sessionId);
      if (!session) {
        throw new Error('Invalid session for monitoring');
      }
      var startTime = process.hrtime.bigint();
      var startMemory = process.memoryUsage().heapUsed;

      // 创建监控包装器
      var monitoredCallback = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
          var result,
            endTime,
            endMemory,
            executionTime,
            memoryUsed,
            _args = arguments,
            _t;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.p = _context.n) {
              case 0:
                _context.p = 0;
                _context.n = 1;
                return callback.apply(void 0, _args);
              case 1:
                result = _context.v;
                // 记录执行统计
                endTime = process.hrtime.bigint();
                endMemory = process.memoryUsage().heapUsed;
                executionTime = Number(endTime - startTime) / 1000000; // 转换为毫秒
                memoryUsed = endMemory - startMemory;
                session.stats.totalExecutionTime += executionTime;
                session.stats.memoryPeak = Math.max(session.stats.memoryPeak, memoryUsed);

                // 检查资源使用
                if (!(memoryUsed > session.config.maxMemoryUsage)) {
                  _context.n = 2;
                  break;
                }
                _this2.logSecurityEvent('memory_limit_exceeded', {
                  sessionId: sessionId,
                  memoryUsed: memoryUsed,
                  limit: session.config.maxMemoryUsage
                });
                throw new Error('Memory usage limit exceeded');
              case 2:
                return _context.a(2, result);
              case 3:
                _context.p = 3;
                _t = _context.v;
                _this2.logSecurityEvent('execution_error', {
                  sessionId: sessionId,
                  error: _t.message
                });
                throw _t;
              case 4:
                return _context.a(2);
            }
          }, _callee, null, [[0, 3]]);
        }));
        return function monitoredCallback() {
          return _ref.apply(this, arguments);
        };
      }();
      return monitoredCallback;
    }

    /**
     * 生成CSP头
     */
  }, {
    key: "generateCSPHeader",
    value: function generateCSPHeader() {
      if (!this.config.enableContentSecurityPolicy) {
        return null;
      }
      var directives = ["default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: https:", "connect-src 'self'", "font-src 'self'", "object-src 'none'", "media-src 'self'", "frame-src 'none'"];
      if (this.config.securityLevel === SECURITY_LEVELS.STRICT) {
        directives.push("base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'");
      }
      return directives.join('; ');
    }

    /**
     * 工具函数：检查是否为本地IP
     */
  }, {
    key: "isLocalIP",
    value: function isLocalIP(hostname) {
      var localPatterns = [/^127\./, /^192\.168\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^::1$/, /^fe80:/, /^localhost$/i];
      return localPatterns.some(function (pattern) {
        return pattern.test(hostname);
      });
    }

    /**
     * 工具函数：检查是否为危险端口
     */
  }, {
    key: "isDangerousPort",
    value: function isDangerousPort(port) {
      var dangerousPorts = [22,
      // SSH
      23,
      // Telnet
      25,
      // SMTP
      53,
      // DNS
      135,
      // RPC
      139,
      // NetBIOS
      445,
      // SMB
      1433,
      // SQL Server
      3306,
      // MySQL
      3389,
      // RDP
      5432,
      // PostgreSQL
      6379,
      // Redis
      27017 // MongoDB
      ];
      return dangerousPorts.includes(parseInt(port));
    }

    /**
     * 工具函数：检查路径是否可疑
     */
  }, {
    key: "containsSuspiciousPath",
    value: function containsSuspiciousPath(pathname) {
      var suspiciousPatterns = [/\/\.\./,
      // 目录遍历
      /\/admin/i, /\/config/i, /\/private/i, /\/internal/i, /\/debug/i, /\/test/i];
      return suspiciousPatterns.some(function (pattern) {
        return pattern.test(pathname);
      });
    }

    /**
     * 工具函数：检查XSS向量
     */
  }, {
    key: "containsXSSVector",
    value: function containsXSSVector(input) {
      var xssPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /eval\s*\(/i, /expression\s*\(/i];
      return xssPatterns.some(function (pattern) {
        return pattern.test(input);
      });
    }

    /**
     * 工具函数：检查CSS注入
     */
  }, {
    key: "containsCSSInjection",
    value: function containsCSSInjection(input) {
      var cssInjectionPatterns = [/expression\s*\(/i, /javascript\s*:/i, /@import/i, /binding\s*:/i];
      return cssInjectionPatterns.some(function (pattern) {
        return pattern.test(input);
      });
    }

    /**
     * 工具函数：检查网络请求
     */
  }, {
    key: "containsNetworkRequests",
    value: function containsNetworkRequests(code) {
      var networkPatterns = [/fetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /\.get\s*\(/, /\.post\s*\(/, /axios\./, /\$\.ajax/];
      return networkPatterns.some(function (pattern) {
        return pattern.test(code);
      });
    }

    /**
     * 工具函数：检查危险DOM操作
     */
  }, {
    key: "containsDangerousDOMOperations",
    value: function containsDangerousDOMOperations(code) {
      var dangerousDOMPatterns = [/innerHTML\s*=/, /outerHTML\s*=/, /document\.write/, /\.setAttribute\s*\(\s*['"]on/, /createElement\s*\(\s*['"]script/];
      return dangerousDOMPatterns.some(function (pattern) {
        return pattern.test(code);
      });
    }

    /**
     * 工具函数：检查代码复杂度
     */
  }, {
    key: "isCodeTooComplex",
    value: function isCodeTooComplex(code) {
      // 简单的复杂度检查：行数和字符数
      var lines = code.split('\n').length;
      var chars = code.length;
      return lines > 50 || chars > 2000;
    }

    /**
     * 工具函数：净化选择器
     */
  }, {
    key: "sanitizeSelector",
    value: function sanitizeSelector(selector) {
      // 移除潜在危险的字符
      return selector.replace(/[<>]/g, '').replace(/javascript:/gi, '').replace(/on\w+\s*=/gi, '');
    }

    /**
     * 工具函数：净化JavaScript代码
     */
  }, {
    key: "sanitizeJavaScript",
    value: function sanitizeJavaScript(code) {
      // 基本的代码净化
      var sanitized = code;

      // 移除危险函数调用（如果安全级别要求）
      if (this.config.securityLevel === SECURITY_LEVELS.STRICT) {
        Array.from(this.dangerousFunctions).forEach(function (fn) {
          var regex = new RegExp("\\b".concat(fn, "\\s*\\("), 'gi');
          sanitized = sanitized.replace(regex, "/* BLOCKED: ".concat(fn, "( */"));
        });
      }
      return sanitized;
    }

    /**
     * 工具函数：检查安全级别允许性
     */
  }, {
    key: "isUrlAllowedBySecurityLevel",
    value: function isUrlAllowedBySecurityLevel(riskLevel) {
      switch (this.config.securityLevel) {
        case SECURITY_LEVELS.STRICT:
          return riskLevel === RISK_LEVELS.LOW;
        case SECURITY_LEVELS.NORMAL:
          return riskLevel !== RISK_LEVELS.CRITICAL;
        case SECURITY_LEVELS.PERMISSIVE:
          return true;
        default:
          return riskLevel !== RISK_LEVELS.CRITICAL;
      }
    }
  }, {
    key: "isSelectorAllowedBySecurityLevel",
    value: function isSelectorAllowedBySecurityLevel(riskLevel) {
      return this.isUrlAllowedBySecurityLevel(riskLevel);
    }
  }, {
    key: "isJavaScriptAllowedBySecurityLevel",
    value: function isJavaScriptAllowedBySecurityLevel(riskLevel) {
      switch (this.config.securityLevel) {
        case SECURITY_LEVELS.STRICT:
          return riskLevel === RISK_LEVELS.LOW;
        case SECURITY_LEVELS.NORMAL:
          return riskLevel !== RISK_LEVELS.CRITICAL;
        case SECURITY_LEVELS.PERMISSIVE:
          return riskLevel !== RISK_LEVELS.CRITICAL;
        // 即使宽松模式也不允许关键风险
        default:
          return riskLevel !== RISK_LEVELS.CRITICAL;
      }
    }

    /**
     * 工具函数：生成会话ID
     */
  }, {
    key: "generateSessionId",
    value: function generateSessionId() {
      return 'session_' + crypto.randomBytes(16).toString('hex');
    }

    /**
     * 工具函数：生成安全令牌
     */
  }, {
    key: "generateSecureToken",
    value: function generateSecureToken() {
      return crypto.randomBytes(32).toString('hex');
    }

    /**
     * 记录安全事件
     */
  }, {
    key: "logSecurityEvent",
    value: function logSecurityEvent(eventType, details) {
      if (!this.config.auditLog) {
        return;
      }
      var logEntry = {
        timestamp: new Date().toISOString(),
        type: eventType,
        details: details,
        securityLevel: this.config.securityLevel
      };
      this.auditLogs.push(logEntry);

      // 保持审计日志大小在合理范围
      if (this.auditLogs.length > 1000) {
        this.auditLogs = this.auditLogs.slice(-500);
      }

      // 如果是高风险事件，立即输出警告
      if (details.riskLevel === RISK_LEVELS.CRITICAL || details.riskLevel === RISK_LEVELS.HIGH) {
        console.warn("\uD83D\uDEA8 \u5B89\u5168\u4E8B\u4EF6 [".concat(eventType, "]:"), details);
      }
    }

    /**
     * 启动审计日志
     */
  }, {
    key: "startAuditLogging",
    value: function startAuditLogging() {
      console.log('🔍 安全审计日志已启动');
    }

    /**
     * 获取安全统计
     */
  }, {
    key: "getSecurityStats",
    value: function getSecurityStats() {
      var eventTypes = {};
      var riskLevels = {};
      this.auditLogs.forEach(function (log) {
        eventTypes[log.type] = (eventTypes[log.type] || 0) + 1;
        if (log.details.riskLevel) {
          riskLevels[log.details.riskLevel] = (riskLevels[log.details.riskLevel] || 0) + 1;
        }
      });
      return {
        totalEvents: this.auditLogs.length,
        activeSessions: this.sessionTokens.size,
        blockedActions: this.blockedActions.size,
        eventsByType: eventTypes,
        riskLevelDistribution: riskLevels,
        securityLevel: this.config.securityLevel,
        recentHighRiskEvents: this.auditLogs.filter(function (log) {
          return log.details.riskLevel === RISK_LEVELS.HIGH || log.details.riskLevel === RISK_LEVELS.CRITICAL;
        }).slice(-10)
      };
    }

    /**
     * 清理过期会话
     */
  }, {
    key: "cleanupExpiredSessions",
    value: function cleanupExpiredSessions() {
      var _this3 = this;
      var now = Date.now();
      var expiredSessions = [];
      this.sessionTokens.forEach(function (session, sessionId) {
        var sessionAge = now - session.lastActivity;
        if (sessionAge > 60 * 60 * 1000) {
          // 1小时未活动
          expiredSessions.push(sessionId);
        }
      });
      expiredSessions.forEach(function (sessionId) {
        _this3.sessionTokens["delete"](sessionId);
        _this3.executionLimits["delete"](sessionId);
      });
      if (expiredSessions.length > 0) {
        console.log("\uD83D\uDD12 \u6E05\u7406\u4E86 ".concat(expiredSessions.length, " \u4E2A\u8FC7\u671F\u4F1A\u8BDD"));
      }
      return expiredSessions.length;
    }

    /**
     * 清理资源
     */
  }, {
    key: "cleanup",
    value: function cleanup() {
      this.sessionTokens.clear();
      this.executionLimits.clear();
      this.auditLogs.length = 0;
      this.blockedActions.clear();
      console.log('🔒 安全管理器已清理');
    }
  }]);
}();

/**
 * 创建浏览器安全管理器
 */
function createBrowserSecurityManager() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new BrowserSecurityManager(config);
}

// 导出默认安全配置
var DEFAULT_SECURITY_CONFIG = {
  securityLevel: SECURITY_LEVELS.NORMAL,
  enableSandbox: true,
  maxExecutionTime: 30000,
  maxMemoryUsage: 512 * 1024 * 1024,
  allowedDomains: [],
  blockedDomains: ['localhost', '127.0.0.1', '0.0.0.0', '::1'],
  trustedOrigins: [],
  enableContentSecurityPolicy: true,
  enableNetworkInterception: true,
  auditLog: true
};

/**
 * 浏览器工具管理器
 * 负责管理浏览器实例、工具注册、安全策略和工具执行
 */
var BrowserToolManager = /*#__PURE__*/function (_EventEmitter) {
  /**
   * 构造函数
   * @param {Object} config - 配置选项
   * @param {string} config.engine - 浏览器引擎
   * @param {boolean} config.headless - 是否无头模式
   * @param {Object} config.viewport - 默认视口
   * @param {Object} config.security - 安全策略配置
   * @param {number} config.timeout - 默认超时时间
   * @param {boolean} config.enabled - 是否启用浏览器工具
   */
  function BrowserToolManager() {
    var _config$instancePool, _config$instancePool2, _config$instancePool3, _config$instancePool4, _config$instancePool5, _config$monitoring, _config$monitoring2, _config$monitoring3, _config$security, _config$security2, _config$security3, _config$security4, _config$security5, _config$security6, _config$security7;
    var _this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, BrowserToolManager);
    _this = _callSuper(this, BrowserToolManager);
    _this.config = _objectSpread2(_defineProperty({
      enabled: config.enabled !== false,
      engine: config.engine || 'puppeteer',
      headless: config.headless !== false,
      viewport: config.viewport || {
        width: 1920,
        height: 1080
      },
      timeout: config.timeout || 30000,
      security: config.security || {},
      // 实例池配置
      instancePool: _objectSpread2({
        maxInstances: ((_config$instancePool = config.instancePool) === null || _config$instancePool === void 0 ? void 0 : _config$instancePool.maxInstances) || 3,
        maxIdleTime: ((_config$instancePool2 = config.instancePool) === null || _config$instancePool2 === void 0 ? void 0 : _config$instancePool2.maxIdleTime) || 5 * 60 * 1000,
        maxReuseCount: ((_config$instancePool3 = config.instancePool) === null || _config$instancePool3 === void 0 ? void 0 : _config$instancePool3.maxReuseCount) || 100,
        warmupInstances: ((_config$instancePool4 = config.instancePool) === null || _config$instancePool4 === void 0 ? void 0 : _config$instancePool4.warmupInstances) || 1,
        enabled: ((_config$instancePool5 = config.instancePool) === null || _config$instancePool5 === void 0 ? void 0 : _config$instancePool5.enabled) !== false
      }, config.instancePool),
      // 监控配置
      monitoring: _objectSpread2({
        enabled: ((_config$monitoring = config.monitoring) === null || _config$monitoring === void 0 ? void 0 : _config$monitoring.enabled) !== false,
        metricsRetention: ((_config$monitoring2 = config.monitoring) === null || _config$monitoring2 === void 0 ? void 0 : _config$monitoring2.metricsRetention) || 24 * 60 * 60 * 1000,
        alertThresholds: _objectSpread2({
          errorRate: 0.1,
          avgExecutionTime: 30000,
          timeoutRate: 0.05
        }, (_config$monitoring3 = config.monitoring) === null || _config$monitoring3 === void 0 ? void 0 : _config$monitoring3.alertThresholds)
      }, config.monitoring)
    }, "security", _objectSpread2(_objectSpread2({}, DEFAULT_SECURITY_CONFIG), {}, {
      securityLevel: ((_config$security = config.security) === null || _config$security === void 0 ? void 0 : _config$security.securityLevel) || SECURITY_LEVELS.NORMAL,
      enableSandbox: ((_config$security2 = config.security) === null || _config$security2 === void 0 ? void 0 : _config$security2.enableSandbox) !== false,
      maxExecutionTime: ((_config$security3 = config.security) === null || _config$security3 === void 0 ? void 0 : _config$security3.maxExecutionTime) || 30000,
      maxMemoryUsage: ((_config$security4 = config.security) === null || _config$security4 === void 0 ? void 0 : _config$security4.maxMemoryUsage) || 512 * 1024 * 1024,
      allowedDomains: ((_config$security5 = config.security) === null || _config$security5 === void 0 ? void 0 : _config$security5.allowedDomains) || [],
      blockedDomains: ((_config$security6 = config.security) === null || _config$security6 === void 0 ? void 0 : _config$security6.blockedDomains) || ['localhost', '127.0.0.1'],
      auditLog: ((_config$security7 = config.security) === null || _config$security7 === void 0 ? void 0 : _config$security7.auditLog) !== false
    }, config.security)), config);
    _this.logger = new Logger('BrowserToolManager');

    // 浏览器实例管理
    if (_this.config.instancePool.enabled) {
      _this.instancePool = new BrowserInstancePool$1(_objectSpread2(_objectSpread2({}, _this.config.instancePool), {}, {
        engine: _this.config.engine,
        launchOptions: {
          headless: _this.config.headless,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
          defaultViewport: _this.config.viewport
        }
      }));
    } else {
      _this.browserInstance = null; // 传统单实例模式
    }

    // 性能监控
    _this.monitor = new BrowserToolMonitor$1(_this.config.monitoring);

    // 安全管理器
    _this.securityManager = createBrowserSecurityManager(_this.config.security);
    _this.securityPolicy = new BrowserSecurityPolicy(_this.config.security);
    _this.tools = new Map();
    _this.executionHistory = [];
    _this.isInitialized = false;

    // 传统性能监控（保持向后兼容）
    _this.metrics = {
      toolsExecuted: 0,
      totalExecutionTime: 0,
      successCount: 0,
      errorCount: 0,
      timeoutCount: 0
    };

    // 初始化工具注册
    _this.registerDefaultTools();
    return _this;
  }

  /**
   * 注册默认工具
   * @private
   */
  _inherits(BrowserToolManager, _EventEmitter);
  return _createClass(BrowserToolManager, [{
    key: "registerDefaultTools",
    value: function registerDefaultTools() {
      // 延迟加载工具类以避免循环依赖
      this.toolLoaders = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, BROWSER_TOOLS.NAVIGATE, function () {
        return Promise.resolve().then(function () { return navigateTool; }).then(function (m) {
          return m.NavigateTool;
        });
      }), BROWSER_TOOLS.CLICK, function () {
        return Promise.resolve().then(function () { return clickTool; }).then(function (m) {
          return m.ClickTool;
        });
      }), BROWSER_TOOLS.EXTRACT, function () {
        return Promise.resolve().then(function () { return extractTool; }).then(function (m) {
          return m.ExtractTool;
        });
      }), BROWSER_TOOLS.TYPE, function () {
        return Promise.resolve().then(function () { return typeTool; }).then(function (m) {
          return m.TypeTool;
        });
      }), BROWSER_TOOLS.SCREENSHOT, function () {
        return Promise.resolve().then(function () { return screenshotTool; }).then(function (m) {
          return m.ScreenshotTool;
        });
      }), BROWSER_TOOLS.EVALUATE, function () {
        return Promise.resolve().then(function () { return evaluateTool; }).then(function (m) {
          return m.EvaluateTool;
        });
      });
      this.logger.info("\u5DF2\u6CE8\u518C ".concat(Object.keys(this.toolLoaders).length, " \u4E2A\u6D4F\u89C8\u5668\u5DE5\u5177"));
    }

    /**
     * 初始化工具管理器
     * @returns {Promise<void>}
     */
  }, {
    key: "initialize",
    value: (function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!this.isInitialized) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              if (this.config.enabled) {
                _context.n = 2;
                break;
              }
              this.logger.info('浏览器工具已禁用');
              return _context.a(2);
            case 2:
              this.logger.info('初始化浏览器工具管理器');
              _context.p = 3;
              if (!this.instancePool) {
                _context.n = 5;
                break;
              }
              this.logger.info('使用浏览器实例池模式');

              // 设置实例池事件监听
              this.setupInstancePoolEventHandlers();

              // 预热实例池
              _context.n = 4;
              return this.instancePool.warmup();
            case 4:
              this.logger.info("\u5B9E\u4F8B\u6C60\u9884\u70ED\u5B8C\u6210\uFF0C\u5F53\u524D\u5B9E\u4F8B\u6570: ".concat(this.instancePool.getStats().poolSize));
              _context.n = 6;
              break;
            case 5:
              this.logger.info('使用单浏览器实例模式');

              // 初始化单个浏览器实例
              this.browserInstance = new BrowserInstance(this.config);

              // 监听浏览器事件
              this.setupBrowserEventHandlers();
            case 6:
              // 设置监控事件监听
              this.setupMonitorEventHandlers();

              // 预加载常用工具
              _context.n = 7;
              return this.preloadTools([BROWSER_TOOLS.NAVIGATE, BROWSER_TOOLS.EXTRACT]);
            case 7:
              this.isInitialized = true;
              this.emit('initialized');
              this.logger.info('浏览器工具管理器初始化完成');
              _context.n = 9;
              break;
            case 8:
              _context.p = 8;
              _t = _context.v;
              this.logger.error('浏览器工具管理器初始化失败:', _t);
              this.emit('error', _t);
              throw _t;
            case 9:
              return _context.a(2);
          }
        }, _callee, this, [[3, 8]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * 设置实例池事件处理器
     * @private
     */
    )
  }, {
    key: "setupInstancePoolEventHandlers",
    value: function setupInstancePoolEventHandlers() {
      var _this2 = this;
      this.instancePool.on('instanceCreated', function (data) {
        _this2.logger.debug("\u521B\u5EFA\u65B0\u6D4F\u89C8\u5668\u5B9E\u4F8B: ".concat(data.instanceId, ", \u6C60\u5927\u5C0F: ").concat(data.poolSize));
        _this2.emit('instanceCreated', data);
      });
      this.instancePool.on('instanceDestroyed', function (data) {
        _this2.logger.debug("\u9500\u6BC1\u6D4F\u89C8\u5668\u5B9E\u4F8B: ".concat(data.instanceId, ", \u91CD\u7528\u6B21\u6570: ").concat(data.reuseCount));
        _this2.emit('instanceDestroyed', data);
      });
      this.instancePool.on('instanceAcquired', function (data) {
        _this2.logger.debug("\u83B7\u53D6\u6D4F\u89C8\u5668\u5B9E\u4F8B: ".concat(data.instanceId, ", \u6765\u6E90\u6C60: ").concat(data.fromPool));
      });
      this.instancePool.on('instanceReturned', function (data) {
        _this2.logger.debug("\u5F52\u8FD8\u6D4F\u89C8\u5668\u5B9E\u4F8B: ".concat(data.instanceId, ", \u91CD\u7528\u6B21\u6570: ").concat(data.reuseCount));
      });
      this.instancePool.on('cleanupCompleted', function (data) {
        _this2.logger.debug("\u5B9E\u4F8B\u6C60\u6E05\u7406\u5B8C\u6210, \u9500\u6BC1: ".concat(data.destroyedCount, ", \u6C60\u5927\u5C0F: ").concat(data.poolSize));
      });
      this.instancePool.on('error', function (data) {
        _this2.logger.error('实例池错误:', data.error);
        _this2.emit('instancePoolError', data);
      });
    }

    /**
     * 设置监控事件处理器
     * @private
     */
  }, {
    key: "setupMonitorEventHandlers",
    value: function setupMonitorEventHandlers() {
      var _this3 = this;
      this.monitor.on('alert', function (alert) {
        _this3.logger.warn("\u6027\u80FD\u8B66\u62A5 [".concat(alert.level, "]: ").concat(alert.message));
        _this3.emit('performanceAlert', alert);
      });
      this.monitor.on('executionCompleted', function (data) {
        _this3.logger.debug("\u5DE5\u5177\u6267\u884C\u5B8C\u6210: ".concat(data.toolName, ", \u8017\u65F6: ").concat(data.duration, "ms"));
      });
      this.monitor.on('executionError', function (data) {
        _this3.logger.warn("\u5DE5\u5177\u6267\u884C\u9519\u8BEF: ".concat(data.toolName, ", \u9519\u8BEF: ").concat(data.error.message));
      });
      this.monitor.on('executionTimeout', function (data) {
        _this3.logger.warn("\u5DE5\u5177\u6267\u884C\u8D85\u65F6: ".concat(data.toolName, ", \u8017\u65F6: ").concat(data.duration, "ms"));
      });
    }

    /**
     * 设置浏览器事件处理器
     * @private
     */
  }, {
    key: "setupBrowserEventHandlers",
    value: function setupBrowserEventHandlers() {
      var _this4 = this;
      this.browserInstance.on('initialized', function () {
        _this4.emit('browserReady');
      });
      this.browserInstance.on('disconnected', function () {
        _this4.emit('browserDisconnected');
        _this4.logger.warn('浏览器连接已断开');
      });
      this.browserInstance.on('error', function (error) {
        _this4.emit('browserError', error);
        _this4.logger.error('浏览器错误:', error);
      });
    }

    /**
     * 预加载工具类
     * @param {Array<string>} toolNames - 要预加载的工具名称
     * @private
     */
  }, {
    key: "preloadTools",
    value: (function () {
      var _preloadTools = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(toolNames) {
        var _this5 = this;
        var loadPromises;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              loadPromises = toolNames.map(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(toolName) {
                  var ToolClass, _t2;
                  return _regenerator().w(function (_context2) {
                    while (1) switch (_context2.p = _context2.n) {
                      case 0:
                        _context2.p = 0;
                        _context2.n = 1;
                        return _this5.toolLoaders[toolName]();
                      case 1:
                        ToolClass = _context2.v;
                        _this5.tools.set(toolName, new ToolClass());
                        _this5.logger.debug("\u9884\u52A0\u8F7D\u5DE5\u5177: ".concat(toolName));
                        _context2.n = 3;
                        break;
                      case 2:
                        _context2.p = 2;
                        _t2 = _context2.v;
                        _this5.logger.warn("\u9884\u52A0\u8F7D\u5DE5\u5177\u5931\u8D25: ".concat(toolName), _t2);
                      case 3:
                        return _context2.a(2);
                    }
                  }, _callee2, null, [[0, 2]]);
                }));
                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }());
              _context3.n = 1;
              return Promise.allSettled(loadPromises);
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function preloadTools(_x) {
        return _preloadTools.apply(this, arguments);
      }
      return preloadTools;
    }()
    /**
     * 获取工具实例
     * @param {string} toolName - 工具名称
     * @returns {Promise<Object>} 工具实例
     * @private
     */
    )
  }, {
    key: "getToolInstance",
    value: (function () {
      var _getToolInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(toolName) {
        var toolLoader, ToolClass, toolInstance, _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              if (!this.tools.has(toolName)) {
                _context4.n = 1;
                break;
              }
              return _context4.a(2, this.tools.get(toolName));
            case 1:
              toolLoader = this.toolLoaders[toolName];
              if (toolLoader) {
                _context4.n = 2;
                break;
              }
              throw new Error("\u672A\u77E5\u7684\u6D4F\u89C8\u5668\u5DE5\u5177: ".concat(toolName));
            case 2:
              _context4.p = 2;
              _context4.n = 3;
              return toolLoader();
            case 3:
              ToolClass = _context4.v;
              toolInstance = new ToolClass();
              this.tools.set(toolName, toolInstance);
              return _context4.a(2, toolInstance);
            case 4:
              _context4.p = 4;
              _t3 = _context4.v;
              throw new Error("\u52A0\u8F7D\u5DE5\u5177\u5931\u8D25: ".concat(toolName, " - ").concat(_t3.message));
            case 5:
              return _context4.a(2);
          }
        }, _callee4, this, [[2, 4]]);
      }));
      function getToolInstance(_x3) {
        return _getToolInstance.apply(this, arguments);
      }
      return getToolInstance;
    }()
    /**
     * 执行本地工具（参考 codex 的 handle_function_call 逻辑）
     * @param {string} toolName - 工具名称
     * @param {Object} args - 工具参数
     * @param {string} callId - 调用ID
     * @returns {Promise<Object>} 执行结果
     */
    )
  }, {
    key: "executeLocalTool",
    value: (function () {
      var _executeLocalTool = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(toolName, args, callId) {
        var startTime, context, monitorSession, browserContext, securitySession, permissionCheck, urlValidation, selectorValidation, codeValidation, tool, toolContext, result, duration, _duration, isTimeout, _t4, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              startTime = Date.now();
              context = {
                toolName: toolName,
                args: args,
                callId: callId,
                startTime: new Date(startTime),
                status: TOOL_STATUS.PENDING
              };
              this.logger.info("\u6267\u884C\u6D4F\u89C8\u5668\u5DE5\u5177: ".concat(toolName), {
                callId: callId,
                args: args
              });

              // 开始性能监控
              monitorSession = this.monitor.startExecution(toolName, {
                callId: callId,
                args: args
              });
              browserContext = null;
              _context5.p = 1;
              if (this.isInitialized) {
                _context5.n = 2;
                break;
              }
              _context5.n = 2;
              return this.initialize();
            case 2:
              // 安全验证
              context.status = TOOL_STATUS.RUNNING;

              // 现代安全管理器验证
              securitySession = this.securityManager.createSecureSession({
                maxExecutionTime: this.config.security.maxExecutionTime,
                permissions: ['navigate', 'extract', 'interact', 'evaluate']
              });
              permissionCheck = this.securityManager.validateSessionPermission(securitySession.sessionId, this.getOperationTypeFromTool(toolName), args);
              if (permissionCheck.allowed) {
                _context5.n = 3;
                break;
              }
              throw new Error("\u5B89\u5168\u7B56\u7565\u963B\u6B62\u64CD\u4F5C: ".concat(permissionCheck.reason));
            case 3:
              if (!args.url) {
                _context5.n = 5;
                break;
              }
              urlValidation = this.securityManager.validateURL(args.url, 'navigation');
              if (urlValidation.isValid) {
                _context5.n = 4;
                break;
              }
              throw new Error("URL\u5B89\u5168\u9A8C\u8BC1\u5931\u8D25: ".concat(urlValidation.violations.map(function (v) {
                return v.message;
              }).join(', ')));
            case 4:
              args.url = urlValidation.sanitizedUrl;
            case 5:
              if (!args.selector) {
                _context5.n = 7;
                break;
              }
              selectorValidation = this.securityManager.validateSelector(args.selector, 'extraction');
              if (selectorValidation.isValid) {
                _context5.n = 6;
                break;
              }
              throw new Error("\u9009\u62E9\u5668\u5B89\u5168\u9A8C\u8BC1\u5931\u8D25: ".concat(selectorValidation.violations.map(function (v) {
                return v.message;
              }).join(', ')));
            case 6:
              args.selector = selectorValidation.sanitizedSelector;
            case 7:
              if (!args.code) {
                _context5.n = 9;
                break;
              }
              codeValidation = this.securityManager.validateJavaScript(args.code, 'evaluation');
              if (codeValidation.isValid) {
                _context5.n = 8;
                break;
              }
              throw new Error("JavaScript\u4EE3\u7801\u5B89\u5168\u9A8C\u8BC1\u5931\u8D25: ".concat(codeValidation.violations.map(function (v) {
                return v.message;
              }).join(', ')));
            case 8:
              args.code = codeValidation.sanitizedCode;
            case 9:
              _context5.n = 10;
              return this.securityPolicy.validateOperation(toolName, args);
            case 10:
              _context5.n = 11;
              return this.getBrowserContext();
            case 11:
              browserContext = _context5.v;
              _context5.n = 12;
              return this.getToolInstance(toolName);
            case 12:
              tool = _context5.v;
              // 执行工具
              toolContext = _objectSpread2(_objectSpread2({}, context), {}, {
                browser: browserContext.browser,
                securityPolicy: this.securityPolicy,
                timeout: args.timeout || this.config.timeout
              });
              _context5.n = 13;
              return this.executeWithTimeout(function () {
                return tool.execute(toolContext);
              }, toolContext.timeout);
            case 13:
              result = _context5.v;
              // 记录成功执行
              duration = Date.now() - startTime;
              context.status = TOOL_STATUS.SUCCESS;
              context.duration = duration;
              context.result = result;
              this.recordExecution(context);
              this.updateMetrics('success', duration);

              // 完成监控
              monitorSession.finish(result);
              this.emit('toolExecuted', {
                success: true,
                toolName: toolName,
                callId: callId,
                duration: duration,
                result: result
              });
              this.logger.info("\u5DE5\u5177\u6267\u884C\u6210\u529F: ".concat(toolName), {
                callId: callId,
                duration: duration
              });
              return _context5.a(2, {
                success: true,
                data: result,
                duration: duration,
                toolName: toolName,
                callId: callId
              });
            case 14:
              _context5.p = 14;
              _t4 = _context5.v;
              _duration = Date.now() - startTime;
              isTimeout = _t4.name === 'TimeoutError';
              context.status = isTimeout ? TOOL_STATUS.TIMEOUT : TOOL_STATUS.FAILED;
              context.duration = _duration;
              context.error = _t4.message;
              this.recordExecution(context);
              this.updateMetrics(isTimeout ? 'timeout' : 'error', _duration);

              // 记录监控错误
              if (isTimeout) {
                monitorSession.timeout();
              } else {
                monitorSession.error(_t4);
              }
              this.emit('toolExecuted', {
                success: false,
                toolName: toolName,
                callId: callId,
                duration: _duration,
                error: _t4.message
              });
              this.logger.error("\u5DE5\u5177\u6267\u884C\u5931\u8D25: ".concat(toolName), {
                callId: callId,
                duration: _duration,
                error: _t4.message
              });
              throw new Error("\u6D4F\u89C8\u5668\u5DE5\u5177\u6267\u884C\u5931\u8D25: ".concat(_t4.message));
            case 15:
              _context5.p = 15;
              if (!(browserContext && browserContext.returnInstance)) {
                _context5.n = 19;
                break;
              }
              _context5.p = 16;
              _context5.n = 17;
              return browserContext.returnInstance();
            case 17:
              _context5.n = 19;
              break;
            case 18:
              _context5.p = 18;
              _t5 = _context5.v;
              this.logger.warn('归还浏览器实例失败:', _t5);
            case 19:
              return _context5.f(15);
            case 20:
              return _context5.a(2);
          }
        }, _callee5, this, [[16, 18], [1, 14, 15, 20]]);
      }));
      function executeLocalTool(_x4, _x5, _x6) {
        return _executeLocalTool.apply(this, arguments);
      }
      return executeLocalTool;
    }()
    /**
     * 获取浏览器上下文
     * @returns {Promise<Object>} 浏览器上下文
     * @private
     */
    )
  }, {
    key: "getBrowserContext",
    value: (function () {
      var _getBrowserContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              if (!this.instancePool) {
                _context6.n = 2;
                break;
              }
              _context6.n = 1;
              return this.instancePool.getInstance();
            case 1:
              return _context6.a(2, _context6.v);
            case 2:
              _context6.n = 3;
              return this.ensureBrowserInstance();
            case 3:
              return _context6.a(2, {
                browser: this.browserInstance,
                returnInstance: function returnInstance() {
                  return Promise.resolve();
                } // 单实例模式不需要归还
              });
            case 4:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function getBrowserContext() {
        return _getBrowserContext.apply(this, arguments);
      }
      return getBrowserContext;
    }()
    /**
     * 带超时的执行包装器
     * @param {Function} fn - 要执行的函数
     * @param {number} timeout - 超时时间
     * @returns {Promise<*>} 执行结果
     * @private
     */
    )
  }, {
    key: "executeWithTimeout",
    value: (function () {
      var _executeWithTimeout = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(fn, timeout) {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              return _context8.a(2, new Promise(/*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(resolve, reject) {
                  var timeoutId, result, _t6;
                  return _regenerator().w(function (_context7) {
                    while (1) switch (_context7.p = _context7.n) {
                      case 0:
                        timeoutId = setTimeout(function () {
                          var error = new Error("\u5DE5\u5177\u6267\u884C\u8D85\u65F6: ".concat(timeout, "ms"));
                          error.name = 'TimeoutError';
                          reject(error);
                        }, timeout);
                        _context7.p = 1;
                        _context7.n = 2;
                        return fn();
                      case 2:
                        result = _context7.v;
                        clearTimeout(timeoutId);
                        resolve(result);
                        _context7.n = 4;
                        break;
                      case 3:
                        _context7.p = 3;
                        _t6 = _context7.v;
                        clearTimeout(timeoutId);
                        reject(_t6);
                      case 4:
                        return _context7.a(2);
                    }
                  }, _callee7, null, [[1, 3]]);
                }));
                return function (_x9, _x0) {
                  return _ref2.apply(this, arguments);
                };
              }()));
          }
        }, _callee8);
      }));
      function executeWithTimeout(_x7, _x8) {
        return _executeWithTimeout.apply(this, arguments);
      }
      return executeWithTimeout;
    }()
    /**
     * 确保浏览器实例可用
     * @private
     */
    )
  }, {
    key: "ensureBrowserInstance",
    value: (function () {
      var _ensureBrowserInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var isHealthy;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              if (this.browserInstance) {
                _context9.n = 1;
                break;
              }
              throw new Error('浏览器实例未初始化');
            case 1:
              _context9.n = 2;
              return this.browserInstance.isHealthy();
            case 2:
              isHealthy = _context9.v;
              if (isHealthy) {
                _context9.n = 3;
                break;
              }
              this.logger.warn('浏览器实例不健康，尝试重新初始化');
              _context9.n = 3;
              return this.browserInstance.initialize();
            case 3:
              return _context9.a(2);
          }
        }, _callee9, this);
      }));
      function ensureBrowserInstance() {
        return _ensureBrowserInstance.apply(this, arguments);
      }
      return ensureBrowserInstance;
    }()
    /**
     * 记录执行历史
     * @param {Object} context - 执行上下文
     * @private
     */
    )
  }, {
    key: "recordExecution",
    value: function recordExecution(context) {
      this.executionHistory.push(_objectSpread2(_objectSpread2({}, context), {}, {
        timestamp: new Date()
      }));

      // 保持历史记录在合理范围内
      if (this.executionHistory.length > 1000) {
        this.executionHistory = this.executionHistory.slice(-500);
      }
    }

    /**
     * 更新性能指标
     * @param {string} type - 结果类型 (success|error|timeout)
     * @param {number} duration - 执行时间
     * @private
     */
  }, {
    key: "updateMetrics",
    value: function updateMetrics(type, duration) {
      this.metrics.toolsExecuted++;
      this.metrics.totalExecutionTime += duration;
      switch (type) {
        case 'success':
          this.metrics.successCount++;
          break;
        case 'error':
          this.metrics.errorCount++;
          break;
        case 'timeout':
          this.metrics.timeoutCount++;
          break;
      }
    }

    /**
     * 获取工具定义列表（用于注册到工具系统）
     * @returns {Array} 工具定义列表
     */
  }, {
    key: "getToolDefinitions",
    value: function getToolDefinitions() {
      return getSupportedTools();
    }

    /**
     * 检查工具是否可用
     * @param {string} toolName - 工具名称
     * @returns {boolean} 是否可用
     */
  }, {
    key: "isToolAvailable",
    value: function isToolAvailable(toolName) {
      return this.config.enabled && this.toolLoaders.hasOwnProperty(toolName);
    }

    /**
     * 获取性能指标
     * @returns {Object} 性能指标
     */
  }, {
    key: "getMetrics",
    value: function getMetrics() {
      var avgExecutionTime = this.metrics.toolsExecuted > 0 ? this.metrics.totalExecutionTime / this.metrics.toolsExecuted : 0;
      var traditionalMetrics = _objectSpread2(_objectSpread2({}, this.metrics), {}, {
        avgExecutionTime: avgExecutionTime,
        successRate: this.metrics.toolsExecuted > 0 ? (this.metrics.successCount / this.metrics.toolsExecuted * 100).toFixed(2) + '%' : '0%',
        browserMetrics: this.browserInstance ? this.browserInstance.getMetrics() : null
      });

      // 新的监控指标
      var monitorStats = this.monitor.getStats();

      // 实例池指标
      var instancePoolStats = this.instancePool ? this.instancePool.getStats() : null;

      // 安全指标
      var securityStats = this.getSecurityStats();
      return {
        traditional: traditionalMetrics,
        monitoring: monitorStats,
        instancePool: instancePoolStats,
        security: securityStats,
        combined: {
          totalExecutions: monitorStats.global.totalExecutions,
          successRate: (1 - monitorStats.global.errorRate) * 100,
          avgExecutionTime: monitorStats.global.avgDuration,
          errorRate: monitorStats.global.errorRate * 100,
          timeoutRate: monitorStats.global.timeoutRate * 100,
          uptime: monitorStats.global.uptime,
          securityLevel: securityStats.config.securityLevel,
          activeSessions: securityStats.manager.activeSessions
        }
      };
    }

    /**
     * 获取工具性能统计
     * @param {string} toolName - 工具名称（可选）
     * @returns {Object} 工具性能统计
     */
  }, {
    key: "getToolStats",
    value: function getToolStats() {
      var toolName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.monitor.getStats(toolName);
    }

    /**
     * 获取性能趋势数据
     * @param {string} toolName - 工具名称
     * @param {number} timeRange - 时间范围(毫秒)
     * @returns {Object} 趋势数据
     */
  }, {
    key: "getPerformanceTrends",
    value: function getPerformanceTrends(toolName, timeRange) {
      return this.monitor.getTrends(toolName, timeRange);
    }

    /**
     * 重置监控指标
     * @param {string} toolName - 工具名称（可选）
     */
  }, {
    key: "resetMetrics",
    value: function resetMetrics() {
      var toolName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.monitor.resetMetrics(toolName);
      if (!toolName) {
        // 重置传统指标
        this.metrics = {
          toolsExecuted: 0,
          totalExecutionTime: 0,
          successCount: 0,
          errorCount: 0,
          timeoutCount: 0
        };
        this.executionHistory = [];
      }
    }

    /**
     * 获取执行历史
     * @param {number} limit - 限制数量
     * @returns {Array} 执行历史
     */
  }, {
    key: "getExecutionHistory",
    value: function getExecutionHistory() {
      var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
      return this.executionHistory.slice(-limit);
    }

    /**
     * 从工具名称映射到操作类型
     * @param {string} toolName - 工具名称
     * @returns {string} 操作类型
     */
  }, {
    key: "getOperationTypeFromTool",
    value: function getOperationTypeFromTool(toolName) {
      var _operationMap;
      var operationMap = (_operationMap = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_operationMap, BROWSER_TOOLS.NAVIGATE, 'navigate'), BROWSER_TOOLS.EXTRACT, 'extract'), BROWSER_TOOLS.CLICK, 'interact'), BROWSER_TOOLS.TYPE, 'interact'), BROWSER_TOOLS.SCROLL, 'interact'), BROWSER_TOOLS.WAIT, 'interact'), BROWSER_TOOLS.SCREENSHOT, 'capture'), BROWSER_TOOLS.PDF, 'capture'), BROWSER_TOOLS.EVALUATE, 'evaluate'), BROWSER_TOOLS.GET_CONTENT, 'extract'), _defineProperty(_operationMap, BROWSER_TOOLS.SET_VIEWPORT, 'interact'));
      return operationMap[toolName] || 'unknown';
    }

    /**
     * 获取安全统计
     * @returns {Object} 安全统计信息
     */
  }, {
    key: "getSecurityStats",
    value: function getSecurityStats() {
      return {
        manager: this.securityManager.getSecurityStats(),
        policy: this.securityPolicy.getStats ? this.securityPolicy.getStats() : null,
        config: {
          securityLevel: this.config.security.securityLevel,
          sandboxEnabled: this.config.security.enableSandbox,
          auditLogEnabled: this.config.security.auditLog
        }
      };
    }

    /**
     * 清理资源
     * @returns {Promise<void>}
     */
  }, {
    key: "cleanup",
    value: (function () {
      var _cleanup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _t7;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              this.logger.info('开始清理浏览器工具管理器资源');
              _context0.p = 1;
              if (!this.instancePool) {
                _context0.n = 3;
                break;
              }
              _context0.n = 2;
              return this.instancePool.destroy();
            case 2:
              this.instancePool = null;
              _context0.n = 5;
              break;
            case 3:
              if (!this.browserInstance) {
                _context0.n = 5;
                break;
              }
              _context0.n = 4;
              return this.browserInstance.destroy();
            case 4:
              this.browserInstance = null;
            case 5:
              // 清理监控器
              if (this.monitor) {
                this.monitor.destroy();
              }

              // 清理安全管理器
              if (this.securityManager) {
                this.securityManager.cleanup();
              }
              this.tools.clear();
              this.executionHistory = [];
              this.isInitialized = false;
              this.emit('cleanup');
              this.logger.info('浏览器工具管理器资源清理完成');
              _context0.n = 7;
              break;
            case 6:
              _context0.p = 6;
              _t7 = _context0.v;
              this.logger.error('清理浏览器工具管理器资源失败:', _t7);
              throw _t7;
            case 7:
              return _context0.a(2);
          }
        }, _callee0, this, [[1, 6]]);
      }));
      function cleanup() {
        return _cleanup.apply(this, arguments);
      }
      return cleanup;
    }()
    /**
     * 获取健康状态
     * @returns {Promise<Object>} 健康状态信息
     */
    )
  }, {
    key: "getHealthStatus",
    value: (function () {
      var _getHealthStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var isManagerHealthy, isBrowserHealthy, _t8, _t9, _t0, _t1, _t10, _t11, _t12, _t13;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              isManagerHealthy = this.isInitialized && this.config.enabled;
              if (!this.browserInstance) {
                _context1.n = 2;
                break;
              }
              _context1.n = 1;
              return this.browserInstance.isHealthy();
            case 1:
              _t8 = _context1.v;
              _context1.n = 3;
              break;
            case 2:
              _t8 = false;
            case 3:
              isBrowserHealthy = _t8;
              _t9 = {
                initialized: this.isInitialized,
                enabled: this.config.enabled,
                toolsRegistered: Object.keys(this.toolLoaders).length,
                toolsLoaded: this.tools.size
              };
              _t0 = isBrowserHealthy;
              if (!this.browserInstance) {
                _context1.n = 5;
                break;
              }
              _context1.n = 4;
              return this.browserInstance.getBrowserInfo();
            case 4:
              _t1 = _context1.v;
              _context1.n = 6;
              break;
            case 5:
              _t1 = null;
            case 6:
              _t10 = _t1;
              _t11 = {
                healthy: _t0,
                info: _t10
              };
              _t12 = this.getMetrics();
              _t13 = isManagerHealthy && isBrowserHealthy;
              return _context1.a(2, {
                manager: _t9,
                browser: _t11,
                metrics: _t12,
                overall: _t13
              });
          }
        }, _callee1, this);
      }));
      function getHealthStatus() {
        return _getHealthStatus.apply(this, arguments);
      }
      return getHealthStatus;
    }())
  }]);
}(events.EventEmitter);

var toolManager = /*#__PURE__*/Object.freeze({
  __proto__: null,
  BrowserToolManager: BrowserToolManager
});

var BrowserToolChain = /*#__PURE__*/function (_EventEmitter) {
  function BrowserToolChain(toolManager) {
    var _this;
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, BrowserToolChain);
    _this = _callSuper(this, BrowserToolChain);
    _this.toolManager = toolManager;
    _this.config = _objectSpread2({
      maxConcurrency: config.maxConcurrency || 3,
      defaultTimeout: config.defaultTimeout || 60000,
      retryAttempts: config.retryAttempts || 2,
      retryDelay: config.retryDelay || 1000,
      continueOnError: config.continueOnError || false
    }, config);
    _this.chains = new Map(); // chainId -> ChainExecution
    _this.templates = new Map(); // templateName -> ChainTemplate

    // 注册内置模板
    _this.registerBuiltinTemplates();
    return _this;
  }

  /**
   * 注册内置工具链模板
   * @private
   */
  _inherits(BrowserToolChain, _EventEmitter);
  return _createClass(BrowserToolChain, [{
    key: "registerBuiltinTemplates",
    value: function registerBuiltinTemplates() {
      // 页面分析模板
      this.registerTemplate('page-analysis', {
        name: 'page-analysis',
        description: '完整的页面分析流程',
        steps: [{
          id: 'navigate',
          tool: 'browser.navigate',
          params: {
            url: '{{url}}',
            waitFor: '{{waitSelector}}'
          }
        }, {
          id: 'screenshot',
          tool: 'browser.screenshot',
          params: {
            format: 'png',
            fullPage: true
          },
          dependsOn: ['navigate']
        }, {
          id: 'extract-title',
          tool: 'browser.extract',
          params: {
            selector: 'title',
            attribute: 'text'
          },
          dependsOn: ['navigate']
        }, {
          id: 'extract-content',
          tool: 'browser.extract',
          params: {
            selector: '{{contentSelector}}',
            attribute: 'text',
            multiple: true
          },
          dependsOn: ['navigate']
        }],
        variables: {
          url: {
            required: true,
            type: 'string'
          },
          waitSelector: {
            required: false,
            type: 'string',
            "default": 'body'
          },
          contentSelector: {
            required: false,
            type: 'string',
            "default": 'p, h1, h2, h3'
          }
        }
      });

      // 表单填写模板
      this.registerTemplate('form-filling', {
        name: 'form-filling',
        description: '自动化表单填写流程',
        steps: [{
          id: 'navigate',
          tool: 'browser.navigate',
          params: {
            url: '{{url}}',
            waitFor: '{{formSelector}}'
          }
        }, {
          id: 'fill-fields',
          tool: 'browser.type',
          params: {
            selector: '{{fieldSelector}}',
            text: '{{fieldValue}}',
            clear: true
          },
          dependsOn: ['navigate'],
          repeat: '{{fields}}' // 支持重复执行
        }, {
          id: 'submit',
          tool: 'browser.click',
          params: {
            selector: '{{submitSelector}}'
          },
          dependsOn: ['fill-fields']
        }, {
          id: 'verify',
          tool: 'browser.extract',
          params: {
            selector: '{{successSelector}}',
            attribute: 'text'
          },
          dependsOn: ['submit'],
          optional: true
        }],
        variables: {
          url: {
            required: true,
            type: 'string'
          },
          formSelector: {
            required: false,
            type: 'string',
            "default": 'form'
          },
          fields: {
            required: true,
            type: 'array'
          },
          submitSelector: {
            required: true,
            type: 'string'
          },
          successSelector: {
            required: false,
            type: 'string'
          }
        }
      });

      // 数据采集模板
      this.registerTemplate('data-scraping', {
        name: 'data-scraping',
        description: '数据采集和分页处理',
        steps: [{
          id: 'navigate',
          tool: 'browser.navigate',
          params: {
            url: '{{url}}'
          }
        }, {
          id: 'extract-data',
          tool: 'browser.extract',
          params: {
            selector: '{{dataSelector}}',
            attribute: '{{dataAttribute}}',
            multiple: true
          },
          dependsOn: ['navigate']
        }, {
          id: 'check-next',
          tool: 'browser.evaluate',
          params: {
            code: 'document.querySelector("{{nextSelector}}") !== null'
          },
          dependsOn: ['extract-data']
        }, {
          id: 'next-page',
          tool: 'browser.click',
          params: {
            selector: '{{nextSelector}}'
          },
          dependsOn: ['check-next'],
          condition: 'prev.result === true',
          loop: true
        }],
        variables: {
          url: {
            required: true,
            type: 'string'
          },
          dataSelector: {
            required: true,
            type: 'string'
          },
          dataAttribute: {
            required: false,
            type: 'string',
            "default": 'text'
          },
          nextSelector: {
            required: false,
            type: 'string',
            "default": '.next'
          }
        }
      });
    }

    /**
     * 注册工具链模板
     * @param {string} name - 模板名称
     * @param {Object} template - 模板定义
     */
  }, {
    key: "registerTemplate",
    value: function registerTemplate(name, template) {
      this.templates.set(name, _objectSpread2(_objectSpread2({}, template), {}, {
        createdAt: new Date(),
        usageCount: 0
      }));
    }

    /**
     * 获取模板列表
     * @returns {Array} 模板列表
     */
  }, {
    key: "getTemplates",
    value: function getTemplates() {
      return Array.from(this.templates.values());
    }

    /**
     * 执行工具链
     * @param {Object} chainConfig - 工具链配置
     * @returns {Promise<Object>} 执行结果
     */
  }, {
    key: "executeChain",
    value: (function () {
      var _executeChain = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(chainConfig) {
        var chainId, chain, endTime, result, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              chainId = "chain_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6));
              chain = {
                id: chainId,
                config: chainConfig,
                startTime: Date.now(),
                status: 'running',
                steps: new Map(),
                results: new Map(),
                errors: [],
                completedSteps: new Set(),
                failedSteps: new Set()
              };
              this.chains.set(chainId, chain);
              _context.p = 1;
              this.emit('chainStarted', {
                chainId: chainId,
                config: chainConfig
              });
              if (!chainConfig.template) {
                _context.n = 3;
                break;
              }
              _context.n = 2;
              return this.executeFromTemplate(chain, chainConfig.template, chainConfig.variables);
            case 2:
              _context.v;
              _context.n = 6;
              break;
            case 3:
              if (!chainConfig.steps) {
                _context.n = 5;
                break;
              }
              _context.n = 4;
              return this.executeCustomSteps(chain, chainConfig.steps);
            case 4:
              _context.v;
              _context.n = 6;
              break;
            case 5:
              throw new Error('工具链配置缺少 template 或 steps');
            case 6:
              endTime = Date.now();
              chain.endTime = endTime;
              chain.duration = endTime - chain.startTime;
              chain.status = 'completed';
              result = {
                success: true,
                chainId: chainId,
                duration: chain.duration,
                stepsExecuted: chain.completedSteps.size,
                stepsFailed: chain.failedSteps.size,
                results: Object.fromEntries(chain.results),
                summary: this.generateChainSummary(chain)
              };
              this.emit('chainCompleted', {
                chainId: chainId,
                result: result
              });
              return _context.a(2, result);
            case 7:
              _context.p = 7;
              _t = _context.v;
              chain.status = 'failed';
              chain.error = _t.message;
              chain.endTime = Date.now();
              chain.duration = chain.endTime - chain.startTime;
              this.emit('chainFailed', {
                chainId: chainId,
                error: _t.message
              });
              throw new Error("\u5DE5\u5177\u94FE\u6267\u884C\u5931\u8D25: ".concat(_t.message));
            case 8:
              return _context.a(2);
          }
        }, _callee, this, [[1, 7]]);
      }));
      function executeChain(_x) {
        return _executeChain.apply(this, arguments);
      }
      return executeChain;
    }()
    /**
     * 使用模板执行工具链
     * @param {Object} chain - 工具链对象
     * @param {string} templateName - 模板名称
     * @param {Object} variables - 变量值
     * @returns {Promise<Array>} 执行步骤
     * @private
     */
    )
  }, {
    key: "executeFromTemplate",
    value: (function () {
      var _executeFromTemplate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(chain, templateName) {
        var variables,
          template,
          processedSteps,
          _args2 = arguments;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              variables = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              template = this.templates.get(templateName);
              if (template) {
                _context2.n = 1;
                break;
              }
              throw new Error("\u672A\u627E\u5230\u6A21\u677F: ".concat(templateName));
            case 1:
              // 验证变量
              this.validateVariables(template.variables, variables);

              // 处理模板步骤
              processedSteps = this.processTemplateSteps(template.steps, variables); // 更新模板使用次数
              template.usageCount++;
              _context2.n = 2;
              return this.executeSteps(chain, processedSteps);
            case 2:
              return _context2.a(2, _context2.v);
          }
        }, _callee2, this);
      }));
      function executeFromTemplate(_x2, _x3) {
        return _executeFromTemplate.apply(this, arguments);
      }
      return executeFromTemplate;
    }()
    /**
     * 执行自定义步骤
     * @param {Object} chain - 工具链对象
     * @param {Array} steps - 步骤列表
     * @returns {Promise<Array>} 执行结果
     * @private
     */
    )
  }, {
    key: "executeCustomSteps",
    value: (function () {
      var _executeCustomSteps = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(chain, steps) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.executeSteps(chain, steps);
            case 1:
              return _context3.a(2, _context3.v);
          }
        }, _callee3, this);
      }));
      function executeCustomSteps(_x4, _x5) {
        return _executeCustomSteps.apply(this, arguments);
      }
      return executeCustomSteps;
    }()
    /**
     * 执行步骤列表
     * @param {Object} chain - 工具链对象
     * @param {Array} steps - 步骤列表
     * @returns {Promise<Array>} 执行结果
     * @private
     */
    )
  }, {
    key: "executeSteps",
    value: (function () {
      var _executeSteps = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(chain, steps) {
        var _this2 = this;
        var stepMap, executionOrder, _iterator, _step, batch, batchPromises, batchResults, i, stepId, result, _t2;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              stepMap = new Map(steps.map(function (step) {
                return [step.id, step];
              }));
              executionOrder = this.calculateExecutionOrder(steps);
              _iterator = _createForOfIteratorHelper(executionOrder);
              _context4.p = 1;
              _iterator.s();
            case 2:
              if ((_step = _iterator.n()).done) {
                _context4.n = 8;
                break;
              }
              batch = _step.value;
              batchPromises = batch.map(function (stepId) {
                return _this2.executeStep(chain, stepMap.get(stepId));
              });
              _context4.n = 3;
              return Promise.allSettled(batchPromises);
            case 3:
              batchResults = _context4.v;
              i = 0;
            case 4:
              if (!(i < batch.length)) {
                _context4.n = 7;
                break;
              }
              stepId = batch[i];
              result = batchResults[i];
              if (!(result.status === 'fulfilled')) {
                _context4.n = 5;
                break;
              }
              chain.completedSteps.add(stepId);
              chain.results.set(stepId, result.value);
              _context4.n = 6;
              break;
            case 5:
              chain.failedSteps.add(stepId);
              chain.errors.push({
                stepId: stepId,
                error: result.reason.message,
                timestamp: Date.now()
              });

              // 检查是否继续执行
              if (this.config.continueOnError) {
                _context4.n = 6;
                break;
              }
              throw new Error("\u6B65\u9AA4 ".concat(stepId, " \u6267\u884C\u5931\u8D25: ").concat(result.reason.message));
            case 6:
              i++;
              _context4.n = 4;
              break;
            case 7:
              _context4.n = 2;
              break;
            case 8:
              _context4.n = 10;
              break;
            case 9:
              _context4.p = 9;
              _t2 = _context4.v;
              _iterator.e(_t2);
            case 10:
              _context4.p = 10;
              _iterator.f();
              return _context4.f(10);
            case 11:
              return _context4.a(2, steps);
          }
        }, _callee4, this, [[1, 9, 10, 11]]);
      }));
      function executeSteps(_x6, _x7) {
        return _executeSteps.apply(this, arguments);
      }
      return executeSteps;
    }()
    /**
     * 执行单个步骤
     * @param {Object} chain - 工具链对象
     * @param {Object} step - 步骤定义
     * @returns {Promise<*>} 执行结果
     * @private
     */
    )
  }, {
    key: "executeStep",
    value: (function () {
      var _executeStep = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(chain, step) {
        var stepId, startTime, result, duration, _duration, retryAttempts, _t3;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              stepId = step.id;
              startTime = Date.now();
              _context5.p = 1;
              this.emit('stepStarted', {
                chainId: chain.id,
                stepId: stepId,
                step: step
              });

              // 检查条件
              if (!(step.condition && !this.evaluateCondition(step.condition, chain))) {
                _context5.n = 2;
                break;
              }
              this.emit('stepSkipped', {
                chainId: chain.id,
                stepId: stepId,
                reason: 'condition not met'
              });
              return _context5.a(2, {
                skipped: true,
                reason: 'condition not met'
              });
            case 2:
              if (!step.repeat) {
                _context5.n = 4;
                break;
              }
              _context5.n = 3;
              return this.executeRepeatedStep(chain, step);
            case 3:
              return _context5.a(2, _context5.v);
            case 4:
              _context5.n = 5;
              return this.toolManager.executeLocalTool(step.tool, step.params, "".concat(chain.id, "_").concat(stepId));
            case 5:
              result = _context5.v;
              duration = Date.now() - startTime;
              this.emit('stepCompleted', {
                chainId: chain.id,
                stepId: stepId,
                duration: duration,
                result: result
              });
              return _context5.a(2, result);
            case 6:
              _context5.p = 6;
              _t3 = _context5.v;
              _duration = Date.now() - startTime;
              this.emit('stepFailed', {
                chainId: chain.id,
                stepId: stepId,
                duration: _duration,
                error: _t3.message
              });

              // 尝试重试
              if (!(step.retryAttempts || this.config.retryAttempts > 0)) {
                _context5.n = 8;
                break;
              }
              retryAttempts = step.retryAttempts || this.config.retryAttempts;
              _context5.n = 7;
              return this.retryStep(chain, step, _t3, retryAttempts);
            case 7:
              return _context5.a(2, _context5.v);
            case 8:
              throw _t3;
            case 9:
              return _context5.a(2);
          }
        }, _callee5, this, [[1, 6]]);
      }));
      function executeStep(_x8, _x9) {
        return _executeStep.apply(this, arguments);
      }
      return executeStep;
    }()
    /**
     * 执行重复步骤
     * @param {Object} chain - 工具链对象
     * @param {Object} step - 步骤定义
     * @returns {Promise<Array>} 执行结果数组
     * @private
     */
    )
  }, {
    key: "executeRepeatedStep",
    value: (function () {
      var _executeRepeatedStep = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(chain, step) {
        var repeatData, results, i, item, instanceParams, result, _t4;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              repeatData = this.resolveRepeatData(step.repeat, chain);
              results = [];
              i = 0;
            case 1:
              if (!(i < repeatData.length)) {
                _context6.n = 7;
                break;
              }
              item = repeatData[i];
              instanceParams = this.replaceVariables(step.params, item);
              _context6.p = 2;
              _context6.n = 3;
              return this.toolManager.executeLocalTool(step.tool, instanceParams, "".concat(chain.id, "_").concat(step.id, "_").concat(i));
            case 3:
              result = _context6.v;
              results.push(result);
              _context6.n = 6;
              break;
            case 4:
              _context6.p = 4;
              _t4 = _context6.v;
              if (this.config.continueOnError) {
                _context6.n = 5;
                break;
              }
              throw _t4;
            case 5:
              results.push({
                error: _t4.message,
                index: i
              });
            case 6:
              i++;
              _context6.n = 1;
              break;
            case 7:
              return _context6.a(2, results);
          }
        }, _callee6, this, [[2, 4]]);
      }));
      function executeRepeatedStep(_x0, _x1) {
        return _executeRepeatedStep.apply(this, arguments);
      }
      return executeRepeatedStep;
    }()
    /**
     * 重试步骤执行
     * @param {Object} chain - 工具链对象
     * @param {Object} step - 步骤定义
     * @param {Error} lastError - 上次的错误
     * @param {number} attemptsLeft - 剩余重试次数
     * @returns {Promise<*>} 执行结果
     * @private
     */
    )
  }, {
    key: "retryStep",
    value: (function () {
      var _retryStep = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(chain, step, lastError, attemptsLeft) {
        var retryDelay, _t5;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              if (!(attemptsLeft <= 0)) {
                _context7.n = 1;
                break;
              }
              throw lastError;
            case 1:
              retryDelay = step.retryDelay || this.config.retryDelay;
              _context7.n = 2;
              return new Promise(function (resolve) {
                return setTimeout(resolve, retryDelay);
              });
            case 2:
              this.emit('stepRetry', {
                chainId: chain.id,
                stepId: step.id,
                attemptsLeft: attemptsLeft,
                lastError: lastError.message
              });
              _context7.p = 3;
              _context7.n = 4;
              return this.executeStep(chain, step);
            case 4:
              return _context7.a(2, _context7.v);
            case 5:
              _context7.p = 5;
              _t5 = _context7.v;
              _context7.n = 6;
              return this.retryStep(chain, step, _t5, attemptsLeft - 1);
            case 6:
              return _context7.a(2, _context7.v);
          }
        }, _callee7, this, [[3, 5]]);
      }));
      function retryStep(_x10, _x11, _x12, _x13) {
        return _retryStep.apply(this, arguments);
      }
      return retryStep;
    }()
    /**
     * 计算执行顺序
     * @param {Array} steps - 步骤列表
     * @returns {Array<Array>} 批次执行顺序
     * @private
     */
    )
  }, {
    key: "calculateExecutionOrder",
    value: function calculateExecutionOrder(steps) {
      new Map(steps.map(function (step) {
        return [step.id, step];
      }));
      var visited = new Set();
      var batches = [];
      while (visited.size < steps.length) {
        var batch = [];
        var _iterator2 = _createForOfIteratorHelper(steps),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var step = _step2.value;
            if (visited.has(step.id)) continue;

            // 检查依赖是否已完成
            var dependencies = step.dependsOn || [];
            var dependenciesComplete = dependencies.every(function (dep) {
              return visited.has(dep);
            });
            if (dependenciesComplete) {
              batch.push(step.id);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        if (batch.length === 0) {
          throw new Error('检测到循环依赖或无法解决的依赖关系');
        }
        batch.forEach(function (stepId) {
          return visited.add(stepId);
        });
        batches.push(batch);
      }
      return batches;
    }

    /**
     * 验证模板变量
     * @param {Object} templateVariables - 模板变量定义
     * @param {Object} providedVariables - 提供的变量值
     * @private
     */
  }, {
    key: "validateVariables",
    value: function validateVariables(templateVariables, providedVariables) {
      for (var _i = 0, _Object$entries = Object.entries(templateVariables); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          definition = _Object$entries$_i[1];
        if (definition.required && !(name in providedVariables)) {
          throw new Error("\u7F3A\u5C11\u5FC5\u9700\u7684\u53D8\u91CF: ".concat(name));
        }
        if (name in providedVariables) {
          var value = providedVariables[name];
          var type = definition.type;
          if (type && !this.validateVariableType(value, type)) {
            throw new Error("\u53D8\u91CF ".concat(name, " \u7C7B\u578B\u9519\u8BEF\uFF0C\u671F\u671B ").concat(type, "\uFF0C\u5B9E\u9645 ").concat(_typeof(value)));
          }
        }
      }
    }

    /**
     * 验证变量类型
     * @param {*} value - 变量值
     * @param {string} expectedType - 期望类型
     * @returns {boolean} 是否匹配
     * @private
     */
  }, {
    key: "validateVariableType",
    value: function validateVariableType(value, expectedType) {
      switch (expectedType) {
        case 'string':
          return typeof value === 'string';
        case 'number':
          return typeof value === 'number';
        case 'boolean':
          return typeof value === 'boolean';
        case 'array':
          return Array.isArray(value);
        case 'object':
          return _typeof(value) === 'object' && value !== null && !Array.isArray(value);
        default:
          return true;
      }
    }

    /**
     * 处理模板步骤（替换变量）
     * @param {Array} steps - 步骤列表
     * @param {Object} variables - 变量值
     * @returns {Array} 处理后的步骤
     * @private
     */
  }, {
    key: "processTemplateSteps",
    value: function processTemplateSteps(steps, variables) {
      var _this3 = this;
      return steps.map(function (step) {
        return _objectSpread2(_objectSpread2({}, step), {}, {
          params: _this3.replaceVariables(step.params, variables)
        });
      });
    }

    /**
     * 替换变量
     * @param {Object} obj - 要处理的对象
     * @param {Object} variables - 变量值
     * @returns {Object} 处理后的对象
     * @private
     */
  }, {
    key: "replaceVariables",
    value: function replaceVariables(obj, variables) {
      var _this4 = this;
      if (typeof obj === 'string') {
        return obj.replace(/\{\{(\w+)\}\}/g, function (match, varName) {
          return variables[varName] !== undefined ? variables[varName] : match;
        });
      }
      if (Array.isArray(obj)) {
        return obj.map(function (item) {
          return _this4.replaceVariables(item, variables);
        });
      }
      if (_typeof(obj) === 'object' && obj !== null) {
        var result = {};
        for (var _i2 = 0, _Object$entries2 = Object.entries(obj); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            key = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];
          result[key] = this.replaceVariables(value, variables);
        }
        return result;
      }
      return obj;
    }

    /**
     * 评估条件
     * @param {string} condition - 条件表达式
     * @param {Object} chain - 工具链对象
     * @returns {boolean} 条件结果
     * @private
     */
  }, {
    key: "evaluateCondition",
    value: function evaluateCondition(condition, chain) {
      // 简单的条件评估器
      // 支持 prev.result === true 等表达式
      try {
        var context = {
          prev: chain.results.size > 0 ? Array.from(chain.results.values()).pop() : null,
          results: Object.fromEntries(chain.results)
        };

        // 简单的表达式评估（生产环境需要更安全的实现）
        return new Function('context', "with(context) { return ".concat(condition, "; }"))(context);
      } catch (error) {
        console.warn('条件评估失败:', condition, error);
        return false;
      }
    }

    /**
     * 解析重复数据
     * @param {string|Array} repeatConfig - 重复配置
     * @param {Object} chain - 工具链对象
     * @returns {Array} 重复数据
     * @private
     */
  }, {
    key: "resolveRepeatData",
    value: function resolveRepeatData(repeatConfig, chain) {
      if (Array.isArray(repeatConfig)) {
        return repeatConfig;
      }
      if (typeof repeatConfig === 'string') {
        // 从链结果中获取数据
        var steps = Array.from(chain.results.keys());
        var lastStep = steps[steps.length - 1];
        var lastResult = chain.results.get(lastStep);
        if (lastResult && Array.isArray(lastResult.data)) {
          return lastResult.data;
        }
      }
      return [];
    }

    /**
     * 生成工具链摘要
     * @param {Object} chain - 工具链对象
     * @returns {Object} 摘要信息
     * @private
     */
  }, {
    key: "generateChainSummary",
    value: function generateChainSummary(chain) {
      var totalSteps = chain.completedSteps.size + chain.failedSteps.size;
      return {
        totalSteps: totalSteps,
        completedSteps: chain.completedSteps.size,
        failedSteps: chain.failedSteps.size,
        successRate: totalSteps > 0 ? (chain.completedSteps.size / totalSteps * 100).toFixed(2) + '%' : '0%',
        errors: chain.errors.length,
        duration: chain.duration
      };
    }

    /**
     * 获取工具链状态
     * @param {string} chainId - 工具链ID
     * @returns {Object|null} 工具链状态
     */
  }, {
    key: "getChainStatus",
    value: function getChainStatus(chainId) {
      var chain = this.chains.get(chainId);
      if (!chain) return null;
      return {
        id: chain.id,
        status: chain.status,
        startTime: chain.startTime,
        endTime: chain.endTime,
        duration: chain.duration,
        completedSteps: Array.from(chain.completedSteps),
        failedSteps: Array.from(chain.failedSteps),
        currentResults: Object.fromEntries(chain.results),
        errors: chain.errors
      };
    }

    /**
     * 取消工具链执行
     * @param {string} chainId - 工具链ID
     */
  }, {
    key: "cancelChain",
    value: function cancelChain(chainId) {
      var chain = this.chains.get(chainId);
      if (chain && chain.status === 'running') {
        chain.status = 'cancelled';
        chain.endTime = Date.now();
        chain.duration = chain.endTime - chain.startTime;
        this.emit('chainCancelled', {
          chainId: chainId
        });
      }
    }

    /**
     * 获取执行统计
     * @returns {Object} 统计信息
     */
  }, {
    key: "getStats",
    value: function getStats() {
      var chains = Array.from(this.chains.values());
      return {
        totalChains: chains.length,
        completedChains: chains.filter(function (c) {
          return c.status === 'completed';
        }).length,
        failedChains: chains.filter(function (c) {
          return c.status === 'failed';
        }).length,
        runningChains: chains.filter(function (c) {
          return c.status === 'running';
        }).length,
        templates: Array.from(this.templates.values()).map(function (t) {
          return {
            name: t.name,
            usageCount: t.usageCount
          };
        })
      };
    }
  }]);
}(events.EventEmitter);

/**
 * 浏览器工具基类
 * 所有具体工具都应该继承此类
 */
var BaseBrowserTool = /*#__PURE__*/function (_EventEmitter) {
  /**
   * 构造函数
   * @param {string} toolName - 工具名称
   */
  function BaseBrowserTool(toolName) {
    var _this;
    _classCallCheck(this, BaseBrowserTool);
    _this = _callSuper(this, BaseBrowserTool);
    _this.toolName = toolName;
    _this.logger = new Logger("BrowserTool:".concat(toolName));
    return _this;
  }

  /**
   * 执行工具的主方法
   * @param {Object} context - 执行上下文
   * @param {string} context.toolName - 工具名称
   * @param {Object} context.args - 工具参数
   * @param {string} context.callId - 调用ID
   * @param {Date} context.startTime - 开始时间
   * @param {Object} context.browser - 浏览器实例
   * @param {Object} context.securityPolicy - 安全策略
   * @param {number} context.timeout - 超时时间
   * @returns {Promise<Object>} 执行结果
   */
  _inherits(BaseBrowserTool, _EventEmitter);
  return _createClass(BaseBrowserTool, [{
    key: "execute",
    value: (function () {
      var _execute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(context) {
        var toolName, args, callId, browser, page, result, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              toolName = context.toolName, args = context.args, callId = context.callId, browser = context.browser, context.timeout;
              this.logger.info("\u5F00\u59CB\u6267\u884C\u5DE5\u5177: ".concat(toolName), {
                callId: callId,
                args: args
              });
              _context.p = 1;
              _context.n = 2;
              return this.preExecute(context);
            case 2:
              _context.n = 3;
              return this.getCurrentPage(browser);
            case 3:
              page = _context.v;
              context.page = page;

              // 执行具体工具逻辑
              _context.n = 4;
              return this.doExecute(context);
            case 4:
              result = _context.v;
              _context.n = 5;
              return this.postExecute(context, result);
            case 5:
              this.logger.info("\u5DE5\u5177\u6267\u884C\u6210\u529F: ".concat(toolName), {
                callId: callId,
                result: result
              });
              return _context.a(2, result);
            case 6:
              _context.p = 6;
              _t = _context.v;
              this.logger.error("\u5DE5\u5177\u6267\u884C\u5931\u8D25: ".concat(toolName), {
                callId: callId,
                error: _t.message
              });
              throw _t;
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[1, 6]]);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }()
    /**
     * 执行前的预处理
     * @param {Object} context - 执行上下文
     * @returns {Promise<void>}
     * @protected
     */
    )
  }, {
    key: "preExecute",
    value: (function () {
      var _preExecute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(context) {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.validateArgs(context.args);
            case 1:
              if (context.browser) {
                _context2.n = 2;
                break;
              }
              throw new Error('浏览器实例不可用');
            case 2:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function preExecute(_x2) {
        return _preExecute.apply(this, arguments);
      }
      return preExecute;
    }()
    /**
     * 获取当前页面实例
     * @param {Object} browser - 浏览器实例
     * @returns {Promise<Object>} 页面实例
     * @protected
     */
    )
  }, {
    key: "getCurrentPage",
    value: (function () {
      var _getCurrentPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(browser) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return browser.getCurrentPage();
            case 1:
              return _context3.a(2, _context3.v);
          }
        }, _callee3);
      }));
      function getCurrentPage(_x3) {
        return _getCurrentPage.apply(this, arguments);
      }
      return getCurrentPage;
    }()
    /**
     * 执行具体工具逻辑（子类必须实现）
     * @param {Object} context - 执行上下文
     * @returns {Promise<Object>} 执行结果
     * @protected
     * @abstract
     */
    )
  }, {
    key: "doExecute",
    value: (function () {
      var _doExecute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(context) {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              throw new Error('子类必须实现 doExecute 方法');
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      }));
      function doExecute(_x4) {
        return _doExecute.apply(this, arguments);
      }
      return doExecute;
    }()
    /**
     * 执行后的后处理
     * @param {Object} context - 执行上下文
     * @param {Object} result - 执行结果
     * @returns {Promise<void>}
     * @protected
     */
    )
  }, {
    key: "postExecute",
    value: (function () {
      var _postExecute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(context, result) {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              return _context5.a(2);
          }
        }, _callee5);
      }));
      function postExecute(_x5, _x6) {
        return _postExecute.apply(this, arguments);
      }
      return postExecute;
    }()
    /**
     * 验证参数（子类可以重写）
     * @param {Object} args - 工具参数
     * @returns {Promise<void>}
     * @protected
     */
    )
  }, {
    key: "validateArgs",
    value: (function () {
      var _validateArgs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(args) {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              if (!(!args || _typeof(args) !== 'object')) {
                _context6.n = 1;
                break;
              }
              throw new Error('无效的工具参数');
            case 1:
              return _context6.a(2);
          }
        }, _callee6);
      }));
      function validateArgs(_x7) {
        return _validateArgs.apply(this, arguments);
      }
      return validateArgs;
    }()
    /**
     * 等待页面加载完成
     * @param {Object} page - 页面实例
     * @param {Object} options - 等待选项
     * @returns {Promise<void>}
     * @protected
     */
    )
  }, {
    key: "waitForPageLoad",
    value: (function () {
      var _waitForPageLoad = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(page) {
        var options,
          _options$waitUntil,
          waitUntil,
          _options$timeout,
          timeout,
          _args7 = arguments,
          _t2;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
              _options$waitUntil = options.waitUntil, waitUntil = _options$waitUntil === void 0 ? 'networkidle2' : _options$waitUntil, _options$timeout = options.timeout, timeout = _options$timeout === void 0 ? 30000 : _options$timeout;
              _context7.p = 1;
              _context7.n = 2;
              return page.waitForLoadState(waitUntil, {
                timeout: timeout
              });
            case 2:
              _context7.n = 6;
              break;
            case 3:
              _context7.p = 3;
              _t2 = _context7.v;
              if (!page.waitForNavigation) {
                _context7.n = 5;
                break;
              }
              _context7.n = 4;
              return page.waitForNavigation({
                waitUntil: waitUntil,
                timeout: timeout
              });
            case 4:
              _context7.n = 6;
              break;
            case 5:
              throw _t2;
            case 6:
              return _context7.a(2);
          }
        }, _callee7, null, [[1, 3]]);
      }));
      function waitForPageLoad(_x8) {
        return _waitForPageLoad.apply(this, arguments);
      }
      return waitForPageLoad;
    }()
    /**
     * 等待元素出现
     * @param {Object} page - 页面实例
     * @param {string} selector - 选择器
     * @param {Object} options - 等待选项
     * @returns {Promise<Object>} 元素
     * @protected
     */
    )
  }, {
    key: "waitForElement",
    value: (function () {
      var _waitForElement = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(page, selector) {
        var options,
          _options$timeout2,
          timeout,
          _options$visible,
          visible,
          _args8 = arguments;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              options = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
              _options$timeout2 = options.timeout, timeout = _options$timeout2 === void 0 ? 30000 : _options$timeout2, _options$visible = options.visible, visible = _options$visible === void 0 ? false : _options$visible;
              _context8.p = 1;
              if (!visible) {
                _context8.n = 3;
                break;
              }
              _context8.n = 2;
              return page.waitForSelector(selector, {
                visible: true,
                timeout: timeout
              });
            case 2:
              return _context8.a(2, _context8.v);
            case 3:
              _context8.n = 4;
              return page.waitForSelector(selector, {
                timeout: timeout
              });
            case 4:
              return _context8.a(2, _context8.v);
            case 5:
              _context8.n = 7;
              break;
            case 6:
              _context8.p = 6;
              _context8.v;
              throw new Error("\u7B49\u5F85\u5143\u7D20\u8D85\u65F6: ".concat(selector, " (").concat(timeout, "ms)"));
            case 7:
              return _context8.a(2);
          }
        }, _callee8, null, [[1, 6]]);
      }));
      function waitForElement(_x9, _x0) {
        return _waitForElement.apply(this, arguments);
      }
      return waitForElement;
    }()
    /**
     * 安全地获取元素属性
     * @param {Object} page - 页面实例
     * @param {string} selector - 选择器
     * @param {string} attribute - 属性名
     * @returns {Promise<string|null>} 属性值
     * @protected
     */
    )
  }, {
    key: "getElementAttribute",
    value: (function () {
      var _getElementAttribute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(page, selector, attribute) {
        var element, _t4;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              _context9.n = 1;
              return page.$(selector);
            case 1:
              element = _context9.v;
              if (element) {
                _context9.n = 2;
                break;
              }
              return _context9.a(2, null);
            case 2:
              _context9.n = 3;
              return element.getAttribute(attribute);
            case 3:
              return _context9.a(2, _context9.v);
            case 4:
              _context9.p = 4;
              _t4 = _context9.v;
              this.logger.warn("\u83B7\u53D6\u5143\u7D20\u5C5E\u6027\u5931\u8D25: ".concat(selector, ".").concat(attribute), _t4);
              return _context9.a(2, null);
          }
        }, _callee9, this, [[0, 4]]);
      }));
      function getElementAttribute(_x1, _x10, _x11) {
        return _getElementAttribute.apply(this, arguments);
      }
      return getElementAttribute;
    }()
    /**
     * 安全地获取元素文本
     * @param {Object} page - 页面实例
     * @param {string} selector - 选择器
     * @returns {Promise<string|null>} 文本内容
     * @protected
     */
    )
  }, {
    key: "getElementText",
    value: (function () {
      var _getElementText = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(page, selector) {
        var element, _t5;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              _context0.n = 1;
              return page.$(selector);
            case 1:
              element = _context0.v;
              if (element) {
                _context0.n = 2;
                break;
              }
              return _context0.a(2, null);
            case 2:
              _context0.n = 3;
              return element.textContent();
            case 3:
              return _context0.a(2, _context0.v);
            case 4:
              _context0.p = 4;
              _t5 = _context0.v;
              this.logger.warn("\u83B7\u53D6\u5143\u7D20\u6587\u672C\u5931\u8D25: ".concat(selector), _t5);
              return _context0.a(2, null);
          }
        }, _callee0, this, [[0, 4]]);
      }));
      function getElementText(_x12, _x13) {
        return _getElementText.apply(this, arguments);
      }
      return getElementText;
    }()
    /**
     * 检查元素是否存在
     * @param {Object} page - 页面实例
     * @param {string} selector - 选择器
     * @returns {Promise<boolean>} 是否存在
     * @protected
     */
    )
  }, {
    key: "elementExists",
    value: (function () {
      var _elementExists = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(page, selector) {
        var element;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              _context1.n = 1;
              return page.$(selector);
            case 1:
              element = _context1.v;
              return _context1.a(2, element !== null);
            case 2:
              _context1.p = 2;
              _context1.v;
              return _context1.a(2, false);
          }
        }, _callee1, null, [[0, 2]]);
      }));
      function elementExists(_x14, _x15) {
        return _elementExists.apply(this, arguments);
      }
      return elementExists;
    }()
    /**
     * 检查元素是否可见
     * @param {Object} page - 页面实例
     * @param {string} selector - 选择器
     * @returns {Promise<boolean>} 是否可见
     * @protected
     */
    )
  }, {
    key: "elementVisible",
    value: (function () {
      var _elementVisible = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(page, selector) {
        var element;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _context10.p = 0;
              _context10.n = 1;
              return page.$(selector);
            case 1:
              element = _context10.v;
              if (element) {
                _context10.n = 2;
                break;
              }
              return _context10.a(2, false);
            case 2:
              _context10.n = 3;
              return element.isVisible();
            case 3:
              return _context10.a(2, _context10.v);
            case 4:
              _context10.p = 4;
              _context10.v;
              return _context10.a(2, false);
          }
        }, _callee10, null, [[0, 4]]);
      }));
      function elementVisible(_x16, _x17) {
        return _elementVisible.apply(this, arguments);
      }
      return elementVisible;
    }()
    /**
     * 滚动到元素位置
     * @param {Object} page - 页面实例
     * @param {string} selector - 选择器
     * @returns {Promise<void>}
     * @protected
     */
    )
  }, {
    key: "scrollToElement",
    value: (function () {
      var _scrollToElement = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(page, selector) {
        var element, _t8;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              _context11.p = 0;
              _context11.n = 1;
              return page.$(selector);
            case 1:
              element = _context11.v;
              if (!element) {
                _context11.n = 2;
                break;
              }
              _context11.n = 2;
              return element.scrollIntoViewIfNeeded();
            case 2:
              _context11.n = 4;
              break;
            case 3:
              _context11.p = 3;
              _t8 = _context11.v;
              this.logger.warn("\u6EDA\u52A8\u5230\u5143\u7D20\u5931\u8D25: ".concat(selector), _t8);
            case 4:
              return _context11.a(2);
          }
        }, _callee11, this, [[0, 3]]);
      }));
      function scrollToElement(_x18, _x19) {
        return _scrollToElement.apply(this, arguments);
      }
      return scrollToElement;
    }()
    /**
     * 格式化工具执行结果
     * @param {Object} data - 原始数据
     * @param {Object} metadata - 元数据
     * @returns {Object} 格式化后的结果
     * @protected
     */
    )
  }, {
    key: "formatResult",
    value: function formatResult(data) {
      var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return {
        success: true,
        toolName: this.toolName,
        data: data,
        metadata: _objectSpread2({
          timestamp: new Date().toISOString()
        }, metadata)
      };
    }

    /**
     * 创建错误结果
     * @param {string} message - 错误消息
     * @param {Object} details - 错误详情
     * @returns {Object} 错误结果
     * @protected
     */
  }, {
    key: "createError",
    value: function createError(message) {
      var details = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return {
        success: false,
        toolName: this.toolName,
        error: message,
        details: _objectSpread2({
          timestamp: new Date().toISOString()
        }, details)
      };
    }
  }]);
}(events.EventEmitter);

/**
 * Selector Utilities
 * 
 * @fileoverview 选择器相关的工具函数
 */

/**
 * 验证CSS选择器格式
 * @param {string} selector - CSS选择器
 * @returns {boolean} 是否有效
 */
function isValidCSSSelector(selector) {
  if (!selector || typeof selector !== 'string') {
    return false;
  }
  try {
    // 尝试使用 CSS.supports 验证选择器
    if (typeof CSS !== 'undefined' && CSS.supports) {
      return CSS.supports('selector(' + selector + ')');
    }

    // 备用验证：检查基本格式
    return /^[a-zA-Z0-9\s\.\#\[\]\:\-\>\+\~\(\)\,\*\"\'=]+$/.test(selector);
  } catch (error) {
    return false;
  }
}

/**
 * 验证XPath选择器格式
 * @param {string} selector - XPath选择器
 * @returns {boolean} 是否有效
 */
function isValidXPathSelector(selector) {
  if (!selector || typeof selector !== 'string') {
    return false;
  }

  // XPath通常以 / 或 // 开头，或者包含XPath函数
  return /^(\/\/|\/|\.|\.\.|\w+\()/gi.test(selector) || /contains\(|text\(\)|@\w+|following-sibling|preceding-sibling/gi.test(selector);
}

/**
 * 自动检测选择器类型
 * @param {string} selector - 选择器字符串
 * @returns {string} 选择器类型 ('css' | 'xpath' | 'unknown')
 */
function detectSelectorType(selector) {
  if (!selector || typeof selector !== 'string') {
    return 'unknown';
  }

  // 检查是否为XPath
  if (isValidXPathSelector(selector)) {
    return 'xpath';
  }

  // 检查是否为CSS
  if (isValidCSSSelector(selector)) {
    return 'css';
  }
  return 'unknown';
}

/**
 * 标准化选择器
 * @param {string} selector - 原始选择器
 * @returns {Object} 标准化后的选择器信息
 */
function normalizeSelector(selector) {
  var type = detectSelectorType(selector);
  return {
    original: selector,
    type: type,
    normalized: selector.trim(),
    isValid: type !== 'unknown'
  };
}

/**
 * 构建复合选择器
 * @param {Array<string>} selectors - 选择器数组
 * @param {string} combinator - 组合符 (',' | ' ' | '>' | '+' | '~')
 * @returns {string} 组合后的选择器
 */
function combineSelectors(selectors) {
  var combinator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
  if (!Array.isArray(selectors) || selectors.length === 0) {
    return '';
  }
  var validSelectors = selectors.filter(function (s) {
    return isValidCSSSelector(s);
  });
  if (validSelectors.length === 0) {
    throw new Error('没有有效的CSS选择器');
  }
  return validSelectors.join(" ".concat(combinator, " "));
}

/**
 * 生成常用的选择器模式
 */
var SelectorPatterns = {
  /**
   * 按文本内容查找元素
   * @param {string} text - 文本内容
   * @param {string} tag - 标签名 (可选)
   * @returns {string} XPath选择器
   */
  byText: function byText(text) {
    var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
    var escapedText = text.replace(/'/g, "\\'");
    return "//".concat(tag, "[contains(text(), '").concat(escapedText, "')]");
  },
  /**
   * 按精确文本查找元素
   * @param {string} text - 精确文本
   * @param {string} tag - 标签名 (可选)
   * @returns {string} XPath选择器
   */
  byExactText: function byExactText(text) {
    var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
    var escapedText = text.replace(/'/g, "\\'");
    return "//".concat(tag, "[text()='").concat(escapedText, "']");
  },
  /**
   * 按属性值查找元素
   * @param {string} attribute - 属性名
   * @param {string} value - 属性值
   * @param {string} tag - 标签名 (可选)
   * @returns {string} CSS选择器
   */
  byAttribute: function byAttribute(attribute, value) {
    var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var escapedValue = value.replace(/"/g, '\\"');
    return "".concat(tag, "[").concat(attribute, "=\"").concat(escapedValue, "\"]");
  },
  /**
   * 按属性包含查找元素
   * @param {string} attribute - 属性名
   * @param {string} value - 包含的值
   * @param {string} tag - 标签名 (可选)
   * @returns {string} CSS选择器
   */
  byAttributeContains: function byAttributeContains(attribute, value) {
    var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var escapedValue = value.replace(/"/g, '\\"');
    return "".concat(tag, "[").concat(attribute, "*=\"").concat(escapedValue, "\"]");
  },
  /**
   * 按类名查找元素
   * @param {string} className - 类名
   * @param {string} tag - 标签名 (可选)
   * @returns {string} CSS选择器
   */
  byClass: function byClass(className) {
    var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return "".concat(tag, ".").concat(className);
  },
  /**
   * 按ID查找元素
   * @param {string} id - ID值
   * @returns {string} CSS选择器
   */
  byId: function byId(id) {
    return "#".concat(id);
  },
  /**
   * 按占位符文本查找输入框
   * @param {string} placeholder - 占位符文本
   * @returns {string} CSS选择器
   */
  byPlaceholder: function byPlaceholder(placeholder) {
    var escapedPlaceholder = placeholder.replace(/"/g, '\\"');
    return "input[placeholder=\"".concat(escapedPlaceholder, "\"], textarea[placeholder=\"").concat(escapedPlaceholder, "\"]");
  },
  /**
   * 按标签名和索引查找元素
   * @param {string} tag - 标签名
   * @param {number} index - 索引（从1开始）
   * @returns {string} CSS选择器
   */
  byTagAndIndex: function byTagAndIndex(tag, index) {
    return "".concat(tag, ":nth-child(").concat(index, ")");
  },
  /**
   * 查找可见的元素
   * @param {string} baseSelector - 基础选择器
   * @returns {string} CSS选择器
   */
  visible: function visible(baseSelector) {
    return "".concat(baseSelector, ":not([hidden]):not([style*=\"display: none\"]):not([style*=\"visibility: hidden\"])");
  },
  /**
   * 查找可点击的元素
   * @returns {string} CSS选择器
   */
  clickable: function clickable() {
    return 'a, button, input[type="button"], input[type="submit"], [onclick], [role="button"], [tabindex]:not([tabindex="-1"])';
  },
  /**
   * 查找输入元素
   * @returns {string} CSS选择器
   */
  inputs: function inputs() {
    return 'input, textarea, select, [contenteditable="true"]';
  }
};

/**
 * 选择器构建器类
 */
var SelectorBuilder = /*#__PURE__*/function () {
  function SelectorBuilder() {
    _classCallCheck(this, SelectorBuilder);
    this.parts = [];
  }

  /**
   * 添加标签选择器
   * @param {string} tag - 标签名
   * @returns {SelectorBuilder} 链式调用
   */
  return _createClass(SelectorBuilder, [{
    key: "tag",
    value: function tag(_tag) {
      this.parts.push(_tag);
      return this;
    }

    /**
     * 添加ID选择器
     * @param {string} id - ID值
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "id",
    value: function id(_id) {
      this.parts.push("#".concat(_id));
      return this;
    }

    /**
     * 添加类选择器
     * @param {string} className - 类名
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "class",
    value: function _class(className) {
      this.parts.push(".".concat(className));
      return this;
    }

    /**
     * 添加属性选择器
     * @param {string} attribute - 属性名
     * @param {string} value - 属性值 (可选)
     * @param {string} operator - 操作符 ('=', '*=', '^=', '$=', '~=', '|=')
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "attribute",
    value: function attribute(_attribute) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
      if (value === null) {
        this.parts.push("[".concat(_attribute, "]"));
      } else {
        var escapedValue = value.replace(/"/g, '\\"');
        this.parts.push("[".concat(_attribute).concat(operator, "\"").concat(escapedValue, "\"]"));
      }
      return this;
    }

    /**
     * 添加后代选择器
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "descendant",
    value: function descendant() {
      this.parts.push(' ');
      return this;
    }

    /**
     * 添加子元素选择器
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "child",
    value: function child() {
      this.parts.push(' > ');
      return this;
    }

    /**
     * 添加相邻兄弟选择器
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "adjacentSibling",
    value: function adjacentSibling() {
      this.parts.push(' + ');
      return this;
    }

    /**
     * 添加通用兄弟选择器
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "generalSibling",
    value: function generalSibling() {
      this.parts.push(' ~ ');
      return this;
    }

    /**
     * 添加伪类选择器
     * @param {string} pseudoClass - 伪类名
     * @param {string} value - 伪类参数 (可选)
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "pseudo",
    value: function pseudo(pseudoClass) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (value === null) {
        this.parts.push(":".concat(pseudoClass));
      } else {
        this.parts.push(":".concat(pseudoClass, "(").concat(value, ")"));
      }
      return this;
    }

    /**
     * 构建最终的选择器
     * @returns {string} CSS选择器
     */
  }, {
    key: "build",
    value: function build() {
      return this.parts.join('');
    }

    /**
     * 重置构建器
     * @returns {SelectorBuilder} 链式调用
     */
  }, {
    key: "reset",
    value: function reset() {
      this.parts = [];
      return this;
    }
  }]);
}();

/**
 * 创建选择器构建器实例
 * @returns {SelectorBuilder} 构建器实例
 */
function createSelectorBuilder() {
  return new SelectorBuilder();
}

/**
 * 页面导航工具类
 */
var NavigateTool = /*#__PURE__*/function (_BaseBrowserTool) {
  function NavigateTool(browserInstance, securityPolicy) {
    _classCallCheck(this, NavigateTool);
    return _callSuper(this, NavigateTool, ['navigate', browserInstance, securityPolicy]);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  _inherits(NavigateTool, _BaseBrowserTool);
  return _createClass(NavigateTool, [{
    key: "getParameterSchema",
    value: function getParameterSchema() {
      return {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: '要导航到的URL',
            pattern: '^https?://.*'
          },
          waitForSelector: {
            type: 'string',
            description: '等待出现的CSS选择器 (可选)',
            "default": null
          },
          waitForNavigation: {
            type: 'boolean',
            description: '是否等待页面完全加载',
            "default": true
          },
          timeout: {
            type: 'number',
            description: '超时时间（毫秒）',
            "default": 30000,
            minimum: 1000,
            maximum: 120000
          },
          userAgent: {
            type: 'string',
            description: '自定义User-Agent (可选)',
            "default": null
          },
          referer: {
            type: 'string',
            description: '引用页面URL (可选)',
            "default": null
          },
          extraHeaders: {
            type: 'object',
            description: '额外的HTTP头部 (可选)',
            "default": null,
            additionalProperties: {
              type: 'string'
            }
          }
        },
        required: ['url'],
        additionalProperties: false
      };
    }

    /**
     * 验证参数
     * @param {Object} params - 工具参数
     * @returns {Object} 验证结果
     */
  }, {
    key: "validateParameters",
    value: function validateParameters(params) {
      var baseValidation = _superPropGet(NavigateTool, "validateParameters", this, 3)([params]);
      if (!baseValidation.valid) {
        return baseValidation;
      }
      var url = params.url,
        waitForSelector = params.waitForSelector,
        timeout = params.timeout,
        userAgent = params.userAgent,
        referer = params.referer,
        extraHeaders = params.extraHeaders;

      // 验证URL格式
      try {
        var urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          return {
            valid: false,
            error: '只支持HTTP和HTTPS协议的URL'
          };
        }
      } catch (error) {
        return {
          valid: false,
          error: "\u65E0\u6548\u7684URL\u683C\u5F0F: ".concat(error.message)
        };
      }

      // 验证等待选择器
      if (waitForSelector && !isValidCSSSelector(waitForSelector)) {
        return {
          valid: false,
          error: '无效的CSS选择器格式'
        };
      }

      // 验证超时时间
      if (timeout && (timeout < 1000 || timeout > 120000)) {
        return {
          valid: false,
          error: '超时时间必须在1秒到120秒之间'
        };
      }

      // 验证User-Agent
      if (userAgent && (typeof userAgent !== 'string' || userAgent.length > 1000)) {
        return {
          valid: false,
          error: 'User-Agent必须是字符串且长度不超过1000字符'
        };
      }

      // 验证Referer
      if (referer) {
        try {
          new URL(referer);
        } catch (error) {
          return {
            valid: false,
            error: "\u65E0\u6548\u7684Referer URL: ".concat(error.message)
          };
        }
      }

      // 验证额外头部
      if (extraHeaders) {
        if (_typeof(extraHeaders) !== 'object' || Array.isArray(extraHeaders)) {
          return {
            valid: false,
            error: 'extraHeaders必须是对象'
          };
        }
        for (var _i = 0, _Object$entries = Object.entries(extraHeaders); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];
          if (typeof key !== 'string' || typeof value !== 'string') {
            return {
              valid: false,
              error: 'extraHeaders的键值都必须是字符串'
            };
          }

          // 检查是否为禁止的头部
          var forbiddenHeaders = ['host', 'content-length', 'connection', 'authorization'];
          if (forbiddenHeaders.includes(key.toLowerCase())) {
            return {
              valid: false,
              error: "\u4E0D\u5141\u8BB8\u8BBE\u7F6E\u5934\u90E8: ".concat(key)
            };
          }
        }
      }
      return {
        valid: true
      };
    }

    /**
     * 执行页面导航
     * @param {Object} params - 工具参数
     * @returns {Promise<Object>} 执行结果
     */
  }, {
    key: "executeInternal",
    value: (function () {
      var _executeInternal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(params) {
        var url, waitForSelector, _params$waitForNaviga, waitForNavigation, _params$timeout, timeout, userAgent, referer, extraHeaders, page, headers, startTime, navigationPromise, response, navigationResponse, navigationTime, selectorFound, pageInfo, currentUrl, _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              url = params.url, waitForSelector = params.waitForSelector, _params$waitForNaviga = params.waitForNavigation, waitForNavigation = _params$waitForNaviga === void 0 ? true : _params$waitForNaviga, _params$timeout = params.timeout, timeout = _params$timeout === void 0 ? 30000 : _params$timeout, userAgent = params.userAgent, referer = params.referer, extraHeaders = params.extraHeaders;
              _context.n = 1;
              return this.browserInstance.getCurrentPage();
            case 1:
              page = _context.v;
              _context.p = 2;
              if (!userAgent) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return page.setUserAgent(userAgent);
            case 3:
              this.logger.debug('设置User-Agent:', userAgent);
            case 4:
              if (!(extraHeaders || referer)) {
                _context.n = 6;
                break;
              }
              headers = _objectSpread2({}, extraHeaders);
              if (referer) {
                headers['Referer'] = referer;
              }
              _context.n = 5;
              return page.setExtraHTTPHeaders(headers);
            case 5:
              logger.debug('设置HTTP头部:', headers);
            case 6:
              // 记录导航开始
              startTime = Date.now();
              logger.info("\u5F00\u59CB\u5BFC\u822A\u5230: ".concat(url));

              // 执行导航
              navigationPromise = waitForNavigation ? page.waitForNavigation({
                waitUntil: 'networkidle0',
                timeout: timeout
              }) : Promise.resolve();
              _context.n = 7;
              return Promise.all([page["goto"](url, {
                waitUntil: waitForNavigation ? 'domcontentloaded' : 'networkidle0',
                timeout: timeout
              }), navigationPromise]);
            case 7:
              response = _context.v;
              navigationResponse = response[0];
              navigationTime = Date.now() - startTime;
              logger.info("\u9875\u9762\u5BFC\u822A\u5B8C\u6210\uFF0C\u8017\u65F6: ".concat(navigationTime, "ms"));

              // 检查响应状态
              if (navigationResponse && !navigationResponse.ok()) {
                logger.warn("\u9875\u9762\u54CD\u5E94\u72B6\u6001\u7801: ".concat(navigationResponse.status()));
              }

              // 等待指定选择器出现
              selectorFound = false;
              if (!waitForSelector) {
                _context.n = 11;
                break;
              }
              _context.p = 8;
              _context.n = 9;
              return page.waitForSelector(waitForSelector, {
                visible: true,
                timeout: Math.min(timeout, 10000) // 选择器等待时间最多10秒
              });
            case 9:
              selectorFound = true;
              logger.debug("\u9009\u62E9\u5668\u5DF2\u51FA\u73B0: ".concat(waitForSelector));
              _context.n = 11;
              break;
            case 10:
              _context.p = 10;
              _t = _context.v;
              logger.warn("\u7B49\u5F85\u9009\u62E9\u5668\u8D85\u65F6: ".concat(waitForSelector), _t.message);
              // 选择器超时不算失败，继续执行
            case 11:
              _context.n = 12;
              return this.getPageInfo(page);
            case 12:
              pageInfo = _context.v;
              return _context.a(2, {
                success: true,
                data: {
                  url: page.url(),
                  finalUrl: page.url(),
                  title: pageInfo.title,
                  statusCode: navigationResponse ? navigationResponse.status() : null,
                  loadTime: navigationTime,
                  selectorFound: selectorFound,
                  waitedForSelector: waitForSelector,
                  pageInfo: {
                    url: pageInfo.url,
                    title: pageInfo.title,
                    description: pageInfo.description,
                    keywords: pageInfo.keywords,
                    viewport: pageInfo.viewport,
                    readyState: pageInfo.readyState
                  }
                },
                timestamp: new Date().toISOString(),
                executionTime: navigationTime
              });
            case 13:
              _context.p = 13;
              _t2 = _context.v;
              logger.error('页面导航失败:', _t2);

              // 尝试获取当前页面状态用于错误诊断
              currentUrl = 'unknown';
              _context.p = 14;
              currentUrl = page.url();
              _context.n = 15;
              return page.title();
            case 15:
              _context.v;
              _context.n = 17;
              break;
            case 16:
              _context.p = 16;
              _context.v;
            case 17:
              throw new Error("\u9875\u9762\u5BFC\u822A\u5931\u8D25: ".concat(_t2.message, " (\u5F53\u524D\u9875\u9762: ").concat(currentUrl, ")"));
            case 18:
              return _context.a(2);
          }
        }, _callee, this, [[14, 16], [8, 10], [2, 13]]);
      }));
      function executeInternal(_x) {
        return _executeInternal.apply(this, arguments);
      }
      return executeInternal;
    }()
    /**
     * 获取页面基本信息
     * @param {Object} page - Puppeteer页面对象
     * @returns {Promise<Object>} 页面信息
     */
    )
  }, {
    key: "getPageInfo",
    value: (function () {
      var _getPageInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(page) {
        var info, _t4, _t5, _t6, _t7;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return page.evaluate(function () {
                var getMetaContent = function getMetaContent(name) {
                  var meta = document.querySelector("meta[name=\"".concat(name, "\"], meta[property=\"").concat(name, "\"]"));
                  return meta ? meta.getAttribute('content') : null;
                };
                return {
                  url: window.location.href,
                  title: document.title,
                  description: getMetaContent('description') || getMetaContent('og:description'),
                  keywords: getMetaContent('keywords'),
                  viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    devicePixelRatio: window.devicePixelRatio
                  },
                  readyState: document.readyState,
                  referrer: document.referrer,
                  lastModified: document.lastModified,
                  characterSet: document.characterSet,
                  contentType: document.contentType
                };
              });
            case 1:
              info = _context2.v;
              return _context2.a(2, info);
            case 2:
              _context2.p = 2;
              _t4 = _context2.v;
              logger.warn('获取页面信息失败:', _t4.message);
              _t5 = page.url();
              _context2.n = 3;
              return page.title()["catch"](function () {
                return 'Unknown';
              });
            case 3:
              _t6 = _context2.v;
              _t7 = {
                width: 0,
                height: 0,
                devicePixelRatio: 1
              };
              return _context2.a(2, {
                url: _t5,
                title: _t6,
                description: null,
                keywords: null,
                viewport: _t7,
                readyState: 'unknown'
              });
          }
        }, _callee2, null, [[0, 2]]);
      }));
      function getPageInfo(_x2) {
        return _getPageInfo.apply(this, arguments);
      }
      return getPageInfo;
    }()
    /**
     * 获取工具使用提示
     * @returns {string} 使用提示
     */
    )
  }, {
    key: "getUsageHint",
    value: function getUsageHint() {
      return "\n\u9875\u9762\u5BFC\u822A\u5DE5\u5177\u4F7F\u7528\u8BF4\u660E:\n- url: \u5FC5\u9700\uFF0C\u8981\u5BFC\u822A\u5230\u7684\u5B8C\u6574URL\uFF08\u652F\u6301HTTP/HTTPS\uFF09\n- waitForSelector: \u53EF\u9009\uFF0C\u7B49\u5F85\u51FA\u73B0\u7684CSS\u9009\u62E9\u5668\n- waitForNavigation: \u53EF\u9009\uFF0C\u662F\u5426\u7B49\u5F85\u9875\u9762\u5B8C\u5168\u52A0\u8F7D\uFF08\u9ED8\u8BA4true\uFF09\n- timeout: \u53EF\u9009\uFF0C\u8D85\u65F6\u65F6\u95F4\uFF0C1-120\u79D2\uFF08\u9ED8\u8BA430\u79D2\uFF09\n- userAgent: \u53EF\u9009\uFF0C\u81EA\u5B9A\u4E49\u6D4F\u89C8\u5668\u6807\u8BC6\n- referer: \u53EF\u9009\uFF0C\u5F15\u7528\u9875\u9762URL\n- extraHeaders: \u53EF\u9009\uFF0C\u989D\u5916\u7684HTTP\u8BF7\u6C42\u5934\n\n\u793A\u4F8B:\n{\n  \"url\": \"https://example.com\",\n  \"waitForSelector\": \".main-content\",\n  \"timeout\": 15000\n}\n    ".trim();
    }
  }]);
}(BaseBrowserTool);

var navigateTool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  NavigateTool: NavigateTool
});

/**
 * 元素点击工具类
 */
var ClickTool = /*#__PURE__*/function (_BaseBrowserTool) {
  function ClickTool(browserInstance, securityPolicy) {
    _classCallCheck(this, ClickTool);
    return _callSuper(this, ClickTool, ['click', browserInstance, securityPolicy]);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  _inherits(ClickTool, _BaseBrowserTool);
  return _createClass(ClickTool, [{
    key: "getParameterSchema",
    value: function getParameterSchema() {
      return {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: '要点击的元素选择器（CSS或XPath）'
          },
          selectorType: {
            type: 'string',
            description: '选择器类型',
            "enum": ['css', 'xpath', 'auto'],
            "default": 'auto'
          },
          index: {
            type: 'number',
            description: '当有多个匹配元素时，点击第几个（从0开始）',
            "default": 0,
            minimum: 0
          },
          clickType: {
            type: 'string',
            description: '点击类型',
            "enum": ['left', 'right', 'middle', 'double'],
            "default": 'left'
          },
          waitForElement: {
            type: 'boolean',
            description: '是否等待元素出现',
            "default": true
          },
          waitForNavigation: {
            type: 'boolean',
            description: '点击后是否等待页面导航',
            "default": false
          },
          scrollIntoView: {
            type: 'boolean',
            description: '点击前是否滚动到元素可见位置',
            "default": true
          },
          timeout: {
            type: 'number',
            description: '超时时间（毫秒）',
            "default": 10000,
            minimum: 1000,
            maximum: 60000
          },
          offset: {
            type: 'object',
            description: '点击偏移量（相对于元素中心）',
            properties: {
              x: {
                type: 'number',
                "default": 0
              },
              y: {
                type: 'number',
                "default": 0
              }
            },
            "default": {
              x: 0,
              y: 0
            }
          },
          modifiers: {
            type: 'array',
            description: '按键修饰符',
            items: {
              type: 'string',
              "enum": ['Alt', 'Control', 'Meta', 'Shift']
            },
            "default": []
          },
          force: {
            type: 'boolean',
            description: '是否强制点击（即使元素不可见）',
            "default": false
          }
        },
        required: ['selector'],
        additionalProperties: false
      };
    }

    /**
     * 验证参数
     * @param {Object} params - 工具参数
     * @returns {Object} 验证结果
     */
  }, {
    key: "validateParameters",
    value: function validateParameters(params) {
      var baseValidation = _superPropGet(ClickTool, "validateParameters", this, 3)([params]);
      if (!baseValidation.valid) {
        return baseValidation;
      }
      var selector = params.selector,
        _params$selectorType = params.selectorType,
        selectorType = _params$selectorType === void 0 ? 'auto' : _params$selectorType,
        _params$index = params.index,
        index = _params$index === void 0 ? 0 : _params$index,
        _params$timeout = params.timeout,
        timeout = _params$timeout === void 0 ? 10000 : _params$timeout,
        _params$offset = params.offset,
        offset = _params$offset === void 0 ? {
          x: 0,
          y: 0
        } : _params$offset,
        _params$modifiers = params.modifiers,
        modifiers = _params$modifiers === void 0 ? [] : _params$modifiers;

      // 验证选择器
      if (!selector || typeof selector !== 'string') {
        return {
          valid: false,
          error: '选择器必须是非空字符串'
        };
      }

      // 验证选择器类型和格式
      if (selectorType === 'css' && !isValidCSSSelector(selector)) {
        return {
          valid: false,
          error: '无效的CSS选择器格式'
        };
      }
      if (selectorType === 'xpath' && !isValidXPathSelector(selector)) {
        return {
          valid: false,
          error: '无效的XPath选择器格式'
        };
      }
      if (selectorType === 'auto') {
        var detectedType = detectSelectorType(selector);
        if (detectedType === 'unknown') {
          return {
            valid: false,
            error: '无法识别选择器类型，请指定selectorType'
          };
        }
      }

      // 验证索引
      if (index < 0 || !Number.isInteger(index)) {
        return {
          valid: false,
          error: 'index必须是非负整数'
        };
      }

      // 验证超时时间
      if (timeout < 1000 || timeout > 60000) {
        return {
          valid: false,
          error: '超时时间必须在1-60秒之间'
        };
      }

      // 验证偏移量
      if (offset && (_typeof(offset) !== 'object' || typeof offset.x !== 'number' || typeof offset.y !== 'number')) {
        return {
          valid: false,
          error: 'offset必须包含数字类型的x和y属性'
        };
      }

      // 验证修饰符
      if (modifiers && Array.isArray(modifiers)) {
        var validModifiers = ['Alt', 'Control', 'Meta', 'Shift'];
        var _iterator = _createForOfIteratorHelper(modifiers),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var modifier = _step.value;
            if (!validModifiers.includes(modifier)) {
              return {
                valid: false,
                error: "\u65E0\u6548\u7684\u4FEE\u9970\u7B26: ".concat(modifier)
              };
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return {
        valid: true
      };
    }

    /**
     * 执行点击操作
     * @param {Object} params - 工具参数
     * @returns {Promise<Object>} 执行结果
     */
  }, {
    key: "executeInternal",
    value: (function () {
      var _executeInternal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(params) {
        var selector, _params$selectorType2, selectorType, _params$index2, index, _params$clickType, clickType, _params$waitForElemen, waitForElement, _params$waitForNaviga, waitForNavigation, _params$scrollIntoVie, scrollIntoView, _params$timeout2, timeout, _params$offset2, offset, _params$modifiers2, modifiers, _params$force, force, page, startTime, finalSelectorType, element, elementInfo, boundingBox, clickX, clickY, navigationPromise, clickOptions, _iterator2, _step2, modifier, _iterator3, _step3, _modifier, executionTime, afterClickInfo, _t, _t2, _t4, _t5, _t6, _t7, _t8, _t9, _t0, _t1, _t10, _t11, _t12, _t13, _t14;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              selector = params.selector, _params$selectorType2 = params.selectorType, selectorType = _params$selectorType2 === void 0 ? 'auto' : _params$selectorType2, _params$index2 = params.index, index = _params$index2 === void 0 ? 0 : _params$index2, _params$clickType = params.clickType, clickType = _params$clickType === void 0 ? 'left' : _params$clickType, _params$waitForElemen = params.waitForElement, waitForElement = _params$waitForElemen === void 0 ? true : _params$waitForElemen, _params$waitForNaviga = params.waitForNavigation, waitForNavigation = _params$waitForNaviga === void 0 ? false : _params$waitForNaviga, _params$scrollIntoVie = params.scrollIntoView, scrollIntoView = _params$scrollIntoVie === void 0 ? true : _params$scrollIntoVie, _params$timeout2 = params.timeout, timeout = _params$timeout2 === void 0 ? 10000 : _params$timeout2, _params$offset2 = params.offset, offset = _params$offset2 === void 0 ? {
                x: 0,
                y: 0
              } : _params$offset2, _params$modifiers2 = params.modifiers, modifiers = _params$modifiers2 === void 0 ? [] : _params$modifiers2, _params$force = params.force, force = _params$force === void 0 ? false : _params$force;
              _context.n = 1;
              return this.browserInstance.getCurrentPage();
            case 1:
              page = _context.v;
              startTime = Date.now();
              _context.p = 2;
              // 确定选择器类型
              finalSelectorType = selectorType === 'auto' ? detectSelectorType(selector) : selectorType;
              logger.info("\u5F00\u59CB\u70B9\u51FB\u5143\u7D20: ".concat(selector, " (\u7C7B\u578B: ").concat(finalSelectorType, ", \u7D22\u5F15: ").concat(index, ")"));

              // 等待元素出现
              if (!waitForElement) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return this.waitForElementBySelector(page, selector, finalSelectorType, index, timeout);
            case 3:
              element = _context.v;
              _context.n = 6;
              break;
            case 4:
              _context.n = 5;
              return this.findElementBySelector(page, selector, finalSelectorType, index);
            case 5:
              element = _context.v;
            case 6:
              if (element) {
                _context.n = 7;
                break;
              }
              throw new Error("\u672A\u627E\u5230\u5339\u914D\u7684\u5143\u7D20: ".concat(selector));
            case 7:
              if (force) {
                _context.n = 10;
                break;
              }
              _context.n = 8;
              return this.getElementInfo(element);
            case 8:
              elementInfo = _context.v;
              if (elementInfo.visible) {
                _context.n = 9;
                break;
              }
              throw new Error('元素不可见，无法点击');
            case 9:
              if (!elementInfo.enabled) {
                logger.warn('元素已禁用，但仍将尝试点击');
              }
            case 10:
              if (!scrollIntoView) {
                _context.n = 12;
                break;
              }
              _context.n = 11;
              return element.scrollIntoView();
            case 11:
              logger.debug('已滚动到元素位置');

              // 等待滚动完成
              _context.n = 12;
              return page.waitForTimeout(100);
            case 12:
              _context.n = 13;
              return element.boundingBox();
            case 13:
              boundingBox = _context.v;
              if (!(!boundingBox && !force)) {
                _context.n = 14;
                break;
              }
              throw new Error('无法获取元素位置信息');
            case 14:
              // 计算点击坐标
              clickX = boundingBox ? boundingBox.x + boundingBox.width / 2 + offset.x : 0;
              clickY = boundingBox ? boundingBox.y + boundingBox.height / 2 + offset.y : 0; // 设置导航等待
              navigationPromise = waitForNavigation ? page.waitForNavigation({
                waitUntil: 'networkidle0',
                timeout: timeout
              }) : Promise.resolve(); // 执行点击
              clickOptions = {
                button: this.getClickButton(clickType),
                clickCount: clickType === 'double' ? 2 : 1,
                delay: clickType === 'double' ? 0 : undefined
              }; // 添加修饰符
              if (!(modifiers.length > 0)) {
                _context.n = 21;
                break;
              }
              _iterator2 = _createForOfIteratorHelper(modifiers);
              _context.p = 15;
              _iterator2.s();
            case 16:
              if ((_step2 = _iterator2.n()).done) {
                _context.n = 18;
                break;
              }
              modifier = _step2.value;
              _context.n = 17;
              return page.keyboard.down(modifier);
            case 17:
              _context.n = 16;
              break;
            case 18:
              _context.n = 20;
              break;
            case 19:
              _context.p = 19;
              _t = _context.v;
              _iterator2.e(_t);
            case 20:
              _context.p = 20;
              _iterator2.f();
              return _context.f(20);
            case 21:
              _context.p = 21;
              if (!boundingBox) {
                _context.n = 23;
                break;
              }
              _context.n = 22;
              return page.mouse.click(clickX, clickY, clickOptions);
            case 22:
              _context.v;
              _context.n = 25;
              break;
            case 23:
              _context.n = 24;
              return element.click(clickOptions);
            case 24:
              _context.v;
            case 25:
              _context.p = 25;
              if (!(modifiers.length > 0)) {
                _context.n = 32;
                break;
              }
              _iterator3 = _createForOfIteratorHelper(modifiers.reverse());
              _context.p = 26;
              _iterator3.s();
            case 27:
              if ((_step3 = _iterator3.n()).done) {
                _context.n = 29;
                break;
              }
              _modifier = _step3.value;
              _context.n = 28;
              return page.keyboard.up(_modifier);
            case 28:
              _context.n = 27;
              break;
            case 29:
              _context.n = 31;
              break;
            case 30:
              _context.p = 30;
              _t2 = _context.v;
              _iterator3.e(_t2);
            case 31:
              _context.p = 31;
              _iterator3.f();
              return _context.f(31);
            case 32:
              return _context.f(25);
            case 33:
              if (!waitForNavigation) {
                _context.n = 37;
                break;
              }
              _context.p = 34;
              _context.n = 35;
              return navigationPromise;
            case 35:
              logger.debug('页面导航完成');
              _context.n = 37;
              break;
            case 36:
              _context.p = 36;
              _context.v;
              logger.warn('等待导航超时，继续执行');
            case 37:
              executionTime = Date.now() - startTime;
              logger.info("\u70B9\u51FB\u64CD\u4F5C\u5B8C\u6210\uFF0C\u8017\u65F6: ".concat(executionTime, "ms"));

              // 获取点击后的页面状态
              _context.n = 38;
              return this.getClickResult(page, element);
            case 38:
              afterClickInfo = _context.v;
              _t4 = selector;
              _t5 = finalSelectorType;
              _t6 = index;
              _t7 = clickType;
              _t8 = {
                x: clickX,
                y: clickY
              };
              _context.n = 39;
              return this.getElementInfo(element);
            case 39:
              _t9 = _context.v;
              _t0 = afterClickInfo;
              _t1 = modifiers;
              _t10 = waitForNavigation;
              _t11 = {
                selector: _t4,
                selectorType: _t5,
                index: _t6,
                clickType: _t7,
                coordinates: _t8,
                elementInfo: _t9,
                afterClick: _t0,
                modifiers: _t1,
                navigationOccurred: _t10
              };
              _t12 = new Date().toISOString();
              _t13 = executionTime;
              return _context.a(2, {
                success: true,
                data: _t11,
                timestamp: _t12,
                executionTime: _t13
              });
            case 40:
              _context.p = 40;
              _t14 = _context.v;
              logger.error('点击操作失败:', _t14);
              throw new Error("\u70B9\u51FB\u64CD\u4F5C\u5931\u8D25: ".concat(_t14.message));
            case 41:
              return _context.a(2);
          }
        }, _callee, this, [[34, 36], [26, 30, 31, 32], [21,, 25, 33], [15, 19, 20, 21], [2, 40]]);
      }));
      function executeInternal(_x) {
        return _executeInternal.apply(this, arguments);
      }
      return executeInternal;
    }()
    /**
     * 根据选择器查找元素
     * @param {Object} page - Puppeteer页面对象
     * @param {string} selector - 选择器
     * @param {string} selectorType - 选择器类型
     * @param {number} index - 元素索引
     * @returns {Promise<Object>} 元素对象
     */
    )
  }, {
    key: "findElementBySelector",
    value: (function () {
      var _findElementBySelector = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(page, selector, selectorType, index) {
        var elements, _elements;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!(selectorType === 'xpath')) {
                _context2.n = 2;
                break;
              }
              _context2.n = 1;
              return page.$x(selector);
            case 1:
              elements = _context2.v;
              return _context2.a(2, elements[index] || null);
            case 2:
              _context2.n = 3;
              return page.$$(selector);
            case 3:
              _elements = _context2.v;
              return _context2.a(2, _elements[index] || null);
            case 4:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function findElementBySelector(_x2, _x3, _x4, _x5) {
        return _findElementBySelector.apply(this, arguments);
      }
      return findElementBySelector;
    }()
    /**
     * 等待元素出现并返回
     * @param {Object} page - Puppeteer页面对象
     * @param {string} selector - 选择器
     * @param {string} selectorType - 选择器类型
     * @param {number} index - 元素索引
     * @param {number} timeout - 超时时间
     * @returns {Promise<Object>} 元素对象
     */
    )
  }, {
    key: "waitForElementBySelector",
    value: (function () {
      var _waitForElementBySelector = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(page, selector, selectorType, index, timeout) {
        var elements, _elements2;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              if (!(selectorType === 'xpath')) {
                _context3.n = 3;
                break;
              }
              _context3.n = 1;
              return page.waitForXPath(selector, {
                visible: true,
                timeout: timeout
              });
            case 1:
              _context3.n = 2;
              return page.$x(selector);
            case 2:
              elements = _context3.v;
              return _context3.a(2, elements[index] || null);
            case 3:
              _context3.n = 4;
              return page.waitForSelector(selector, {
                visible: true,
                timeout: timeout
              });
            case 4:
              _context3.n = 5;
              return page.$$(selector);
            case 5:
              _elements2 = _context3.v;
              return _context3.a(2, _elements2[index] || null);
            case 6:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function waitForElementBySelector(_x6, _x7, _x8, _x9, _x0) {
        return _waitForElementBySelector.apply(this, arguments);
      }
      return waitForElementBySelector;
    }()
    /**
     * 获取元素信息
     * @param {Object} element - 元素对象
     * @returns {Promise<Object>} 元素信息
     */
    )
  }, {
    key: "getElementInfo",
    value: (function () {
      var _getElementInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(element) {
        var info, _t15;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return element.evaluate(function (el) {
                var rect = el.getBoundingClientRect();
                var computedStyle = window.getComputedStyle(el);
                return {
                  tagName: el.tagName.toLowerCase(),
                  id: el.id,
                  className: el.className,
                  text: el.textContent ? el.textContent.trim() : '',
                  visible: rect.width > 0 && rect.height > 0 && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none',
                  enabled: !el.disabled && !el.hasAttribute('disabled'),
                  bounds: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                  },
                  attributes: Array.from(el.attributes).reduce(function (acc, attr) {
                    acc[attr.name] = attr.value;
                    return acc;
                  }, {}),
                  isClickable: el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT' || el.onclick !== null || el.hasAttribute('onclick') || computedStyle.cursor === 'pointer'
                };
              });
            case 1:
              info = _context4.v;
              return _context4.a(2, info);
            case 2:
              _context4.p = 2;
              _t15 = _context4.v;
              logger.warn('获取元素信息失败:', _t15.message);
              return _context4.a(2, {
                tagName: 'unknown',
                visible: false,
                enabled: false,
                isClickable: false
              });
          }
        }, _callee4, null, [[0, 2]]);
      }));
      function getElementInfo(_x1) {
        return _getElementInfo.apply(this, arguments);
      }
      return getElementInfo;
    }()
    /**
     * 获取点击操作结果
     * @param {Object} page - Puppeteer页面对象
     * @param {Object} element - 被点击的元素
     * @returns {Promise<Object>} 点击结果信息
     */
    )
  }, {
    key: "getClickResult",
    value: (function () {
      var _getClickResult = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(page, element) {
        var pageInfo, _t16;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return page.evaluate(function () {
                return {
                  url: window.location.href,
                  title: document.title,
                  activeElementTag: document.activeElement ? document.activeElement.tagName : null,
                  scrollPosition: {
                    x: window.scrollX,
                    y: window.scrollY
                  }
                };
              });
            case 1:
              pageInfo = _context5.v;
              return _context5.a(2, pageInfo);
            case 2:
              _context5.p = 2;
              _t16 = _context5.v;
              logger.warn('获取点击结果失败:', _t16.message);
              return _context5.a(2, {
                url: 'unknown',
                title: 'unknown',
                activeElementTag: null,
                scrollPosition: {
                  x: 0,
                  y: 0
                }
              });
          }
        }, _callee5, null, [[0, 2]]);
      }));
      function getClickResult(_x10, _x11) {
        return _getClickResult.apply(this, arguments);
      }
      return getClickResult;
    }()
    /**
     * 获取点击按钮类型
     * @param {string} clickType - 点击类型
     * @returns {string} Puppeteer按钮类型
     */
    )
  }, {
    key: "getClickButton",
    value: function getClickButton(clickType) {
      switch (clickType) {
        case 'right':
          return 'right';
        case 'middle':
          return 'middle';
        case 'left':
        case 'double':
        default:
          return 'left';
      }
    }

    /**
     * 获取工具使用提示
     * @returns {string} 使用提示
     */
  }, {
    key: "getUsageHint",
    value: function getUsageHint() {
      return "\n\u5143\u7D20\u70B9\u51FB\u5DE5\u5177\u4F7F\u7528\u8BF4\u660E:\n- selector: \u5FC5\u9700\uFF0C\u8981\u70B9\u51FB\u7684\u5143\u7D20\u9009\u62E9\u5668\uFF08CSS\u6216XPath\uFF09\n- selectorType: \u53EF\u9009\uFF0C\u9009\u62E9\u5668\u7C7B\u578B (css/xpath/auto\uFF0C\u9ED8\u8BA4auto)\n- index: \u53EF\u9009\uFF0C\u5339\u914D\u591A\u4E2A\u5143\u7D20\u65F6\u7684\u7D22\u5F15\uFF08\u9ED8\u8BA40\uFF09\n- clickType: \u53EF\u9009\uFF0C\u70B9\u51FB\u7C7B\u578B (left/right/middle/double\uFF0C\u9ED8\u8BA4left)\n- waitForElement: \u53EF\u9009\uFF0C\u662F\u5426\u7B49\u5F85\u5143\u7D20\u51FA\u73B0\uFF08\u9ED8\u8BA4true\uFF09\n- waitForNavigation: \u53EF\u9009\uFF0C\u70B9\u51FB\u540E\u662F\u5426\u7B49\u5F85\u9875\u9762\u5BFC\u822A\uFF08\u9ED8\u8BA4false\uFF09\n- scrollIntoView: \u53EF\u9009\uFF0C\u70B9\u51FB\u524D\u662F\u5426\u6EDA\u52A8\u5230\u5143\u7D20\uFF08\u9ED8\u8BA4true\uFF09\n- timeout: \u53EF\u9009\uFF0C\u8D85\u65F6\u65F6\u95F41-60\u79D2\uFF08\u9ED8\u8BA410\u79D2\uFF09\n- offset: \u53EF\u9009\uFF0C\u70B9\u51FB\u504F\u79FB\u91CF {x: 0, y: 0}\n- modifiers: \u53EF\u9009\uFF0C\u6309\u952E\u4FEE\u9970\u7B26 ['Alt', 'Control', 'Meta', 'Shift']\n- force: \u53EF\u9009\uFF0C\u662F\u5426\u5F3A\u5236\u70B9\u51FB\u4E0D\u53EF\u89C1\u5143\u7D20\uFF08\u9ED8\u8BA4false\uFF09\n\n\u793A\u4F8B:\n{\n  \"selector\": \"button.submit-btn\",\n  \"clickType\": \"left\",\n  \"waitForNavigation\": true\n}\n\n{\n  \"selector\": \"//button[contains(text(), '\u63D0\u4EA4')]\",\n  \"selectorType\": \"xpath\",\n  \"modifiers\": [\"Control\"]\n}\n    ".trim();
    }
  }]);
}(BaseBrowserTool);

var clickTool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ClickTool: ClickTool
});

/**
 * 内容提取工具类
 */
var ExtractTool = /*#__PURE__*/function (_BaseBrowserTool) {
  function ExtractTool(browserInstance, securityPolicy) {
    _classCallCheck(this, ExtractTool);
    return _callSuper(this, ExtractTool, ['extract', browserInstance, securityPolicy]);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  _inherits(ExtractTool, _BaseBrowserTool);
  return _createClass(ExtractTool, [{
    key: "getParameterSchema",
    value: function getParameterSchema() {
      return {
        type: 'object',
        properties: {
          selectors: {
            oneOf: [{
              type: 'string',
              description: '单个选择器'
            }, {
              type: 'array',
              description: '多个选择器数组',
              items: {
                type: 'string'
              },
              minItems: 1
            }, {
              type: 'object',
              description: '命名选择器对象',
              additionalProperties: {
                type: 'string'
              }
            }]
          },
          selectorType: {
            type: 'string',
            description: '选择器类型',
            "enum": ['css', 'xpath', 'auto'],
            "default": 'auto'
          },
          extractType: {
            type: 'string',
            description: '提取类型',
            "enum": ['text', 'html', 'attributes', 'all'],
            "default": 'text'
          },
          attributes: {
            type: 'array',
            description: '要提取的属性列表',
            items: {
              type: 'string'
            },
            "default": []
          },
          multiple: {
            type: 'boolean',
            description: '是否提取所有匹配的元素',
            "default": false
          },
          waitForElements: {
            type: 'boolean',
            description: '是否等待元素出现',
            "default": true
          },
          timeout: {
            type: 'number',
            description: '超时时间（毫秒）',
            "default": 10000,
            minimum: 1000,
            maximum: 60000
          },
          includeMetadata: {
            type: 'boolean',
            description: '是否包含元素元数据',
            "default": false
          },
          textOptions: {
            type: 'object',
            description: '文本提取选项',
            properties: {
              trim: {
                type: 'boolean',
                description: '是否去除首尾空白',
                "default": true
              },
              normalizeWhitespace: {
                type: 'boolean',
                description: '是否标准化空白字符',
                "default": true
              },
              includeHidden: {
                type: 'boolean',
                description: '是否包含隐藏元素的文本',
                "default": false
              }
            },
            "default": {}
          },
          pagination: {
            type: 'object',
            description: '分页提取选项',
            properties: {
              enabled: {
                type: 'boolean',
                description: '是否启用分页提取',
                "default": false
              },
              maxPages: {
                type: 'number',
                description: '最大页数',
                "default": 5,
                minimum: 1,
                maximum: 20
              },
              nextButtonSelector: {
                type: 'string',
                description: '下一页按钮选择器'
              },
              waitAfterClick: {
                type: 'number',
                description: '点击后等待时间（毫秒）',
                "default": 2000
              }
            },
            "default": {}
          }
        },
        required: ['selectors'],
        additionalProperties: false
      };
    }

    /**
     * 验证参数
     * @param {Object} params - 工具参数
     * @returns {Object} 验证结果
     */
  }, {
    key: "validateParameters",
    value: function validateParameters(params) {
      var baseValidation = _superPropGet(ExtractTool, "validateParameters", this, 3)([params]);
      if (!baseValidation.valid) {
        return baseValidation;
      }
      var selectors = params.selectors,
        _params$selectorType = params.selectorType,
        selectorType = _params$selectorType === void 0 ? 'auto' : _params$selectorType,
        _params$attributes = params.attributes,
        attributes = _params$attributes === void 0 ? [] : _params$attributes,
        _params$timeout = params.timeout,
        timeout = _params$timeout === void 0 ? 10000 : _params$timeout,
        _params$pagination = params.pagination,
        pagination = _params$pagination === void 0 ? {} : _params$pagination;

      // 验证选择器
      if (!selectors) {
        return {
          valid: false,
          error: '必须提供selectors参数'
        };
      }

      // 验证选择器格式
      var selectorsList = this.normalizeSelectors(selectors);
      var _iterator = _createForOfIteratorHelper(selectorsList),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var selector = _step.value;
          if (selectorType === 'css' && !isValidCSSSelector(selector)) {
            return {
              valid: false,
              error: "\u65E0\u6548\u7684CSS\u9009\u62E9\u5668: ".concat(selector)
            };
          }
          if (selectorType === 'xpath' && !isValidXPathSelector(selector)) {
            return {
              valid: false,
              error: "\u65E0\u6548\u7684XPath\u9009\u62E9\u5668: ".concat(selector)
            };
          }
          if (selectorType === 'auto') {
            var detectedType = detectSelectorType(selector);
            if (detectedType === 'unknown') {
              return {
                valid: false,
                error: "\u65E0\u6CD5\u8BC6\u522B\u9009\u62E9\u5668\u7C7B\u578B: ".concat(selector)
              };
            }
          }
        }

        // 验证属性列表
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (attributes && !Array.isArray(attributes)) {
        return {
          valid: false,
          error: 'attributes必须是字符串数组'
        };
      }

      // 验证超时时间
      if (timeout < 1000 || timeout > 60000) {
        return {
          valid: false,
          error: '超时时间必须在1-60秒之间'
        };
      }

      // 验证分页选项
      if (pagination.enabled) {
        if (!pagination.nextButtonSelector) {
          return {
            valid: false,
            error: '启用分页时必须提供nextButtonSelector'
          };
        }
        if (pagination.maxPages && (pagination.maxPages < 1 || pagination.maxPages > 20)) {
          return {
            valid: false,
            error: 'maxPages必须在1-20之间'
          };
        }
      }
      return {
        valid: true
      };
    }

    /**
     * 执行内容提取
     * @param {Object} params - 工具参数
     * @returns {Promise<Object>} 执行结果
     */
  }, {
    key: "executeInternal",
    value: (function () {
      var _executeInternal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(params) {
        var selectors, _params$selectorType2, selectorType, _params$extractType, extractType, _params$attributes2, attributes, _params$multiple, multiple, _params$waitForElemen, waitForElements, _params$timeout2, timeout, _params$includeMetada, includeMetadata, _params$textOptions, textOptions, _params$pagination2, pagination, page, startTime, selectorData, results, totalElements, paginationResults, extractResults, executionTime, _t, _t2, _t3, _t4, _t5, _t6, _t7, _t8, _t9, _t0, _t1;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              selectors = params.selectors, _params$selectorType2 = params.selectorType, selectorType = _params$selectorType2 === void 0 ? 'auto' : _params$selectorType2, _params$extractType = params.extractType, extractType = _params$extractType === void 0 ? 'text' : _params$extractType, _params$attributes2 = params.attributes, attributes = _params$attributes2 === void 0 ? [] : _params$attributes2, _params$multiple = params.multiple, multiple = _params$multiple === void 0 ? false : _params$multiple, _params$waitForElemen = params.waitForElements, waitForElements = _params$waitForElemen === void 0 ? true : _params$waitForElemen, _params$timeout2 = params.timeout, timeout = _params$timeout2 === void 0 ? 10000 : _params$timeout2, _params$includeMetada = params.includeMetadata, includeMetadata = _params$includeMetada === void 0 ? false : _params$includeMetada, _params$textOptions = params.textOptions, textOptions = _params$textOptions === void 0 ? {} : _params$textOptions, _params$pagination2 = params.pagination, pagination = _params$pagination2 === void 0 ? {} : _params$pagination2;
              _context.n = 1;
              return this.browserInstance.getCurrentPage();
            case 1:
              page = _context.v;
              startTime = Date.now();
              _context.p = 2;
              logger.info("\u5F00\u59CB\u63D0\u53D6\u5185\u5BB9: ".concat(JSON.stringify(selectors)));

              // 标准化选择器
              selectorData = this.parseSelectors(selectors);
              results = {};
              totalElements = 0; // 执行分页提取或单页提取
              if (!pagination.enabled) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return this.extractWithPagination(page, selectorData, {
                selectorType: selectorType,
                extractType: extractType,
                attributes: attributes,
                multiple: multiple,
                waitForElements: waitForElements,
                timeout: timeout,
                includeMetadata: includeMetadata,
                textOptions: textOptions
              }, pagination);
            case 3:
              paginationResults = _context.v;
              Object.assign(results, paginationResults.data);
              totalElements = paginationResults.totalElements;
              _context.n = 6;
              break;
            case 4:
              _context.n = 5;
              return this.extractFromPage(page, selectorData, {
                selectorType: selectorType,
                extractType: extractType,
                attributes: attributes,
                multiple: multiple,
                waitForElements: waitForElements,
                timeout: timeout,
                includeMetadata: includeMetadata,
                textOptions: textOptions
              });
            case 5:
              extractResults = _context.v;
              Object.assign(results, extractResults.data);
              totalElements = extractResults.totalElements;
            case 6:
              executionTime = Date.now() - startTime;
              logger.info("\u5185\u5BB9\u63D0\u53D6\u5B8C\u6210\uFF0C\u5171\u63D0\u53D6 ".concat(totalElements, " \u4E2A\u5143\u7D20\uFF0C\u8017\u65F6: ").concat(executionTime, "ms"));
              _t = results;
              _t2 = totalElements;
              _t3 = extractType;
              _t4 = selectorType;
              _t5 = pagination.enabled;
              _context.n = 7;
              return this.getPageInfo(page);
            case 7:
              _t6 = _context.v;
              _t7 = {
                totalElements: _t2,
                extractType: _t3,
                selectorType: _t4,
                paginationUsed: _t5,
                pageInfo: _t6
              };
              _t8 = {
                results: _t,
                metadata: _t7
              };
              _t9 = new Date().toISOString();
              _t0 = executionTime;
              return _context.a(2, {
                success: true,
                data: _t8,
                timestamp: _t9,
                executionTime: _t0
              });
            case 8:
              _context.p = 8;
              _t1 = _context.v;
              logger.error('内容提取失败:', _t1);
              throw new Error("\u5185\u5BB9\u63D0\u53D6\u5931\u8D25: ".concat(_t1.message));
            case 9:
              return _context.a(2);
          }
        }, _callee, this, [[2, 8]]);
      }));
      function executeInternal(_x) {
        return _executeInternal.apply(this, arguments);
      }
      return executeInternal;
    }()
    /**
     * 从单页提取内容
     * @param {Object} page - Puppeteer页面对象
     * @param {Object} selectorData - 选择器数据
     * @param {Object} options - 提取选项
     * @returns {Promise<Object>} 提取结果
     */
    )
  }, {
    key: "extractFromPage",
    value: (function () {
      var _extractFromPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(page, selectorData, options) {
        var results, totalElements, _i, _Object$entries, _Object$entries$_i, key, selector, extractResult, _t10;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              results = {};
              totalElements = 0;
              _i = 0, _Object$entries = Object.entries(selectorData);
            case 1:
              if (!(_i < _Object$entries.length)) {
                _context2.n = 6;
                break;
              }
              _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], selector = _Object$entries$_i[1];
              _context2.p = 2;
              _context2.n = 3;
              return this.extractBySelector(page, selector, options);
            case 3:
              extractResult = _context2.v;
              results[key] = extractResult;
              totalElements += extractResult.elements ? extractResult.elements.length : extractResult.element ? 1 : 0;
              _context2.n = 5;
              break;
            case 4:
              _context2.p = 4;
              _t10 = _context2.v;
              logger.warn("\u9009\u62E9\u5668 ".concat(key, " \u63D0\u53D6\u5931\u8D25:"), _t10.message);
              results[key] = {
                success: false,
                error: _t10.message,
                selector: selector,
                elements: []
              };
            case 5:
              _i++;
              _context2.n = 1;
              break;
            case 6:
              return _context2.a(2, {
                data: results,
                totalElements: totalElements
              });
          }
        }, _callee2, this, [[2, 4]]);
      }));
      function extractFromPage(_x2, _x3, _x4) {
        return _extractFromPage.apply(this, arguments);
      }
      return extractFromPage;
    }()
    /**
     * 分页提取内容
     * @param {Object} page - Puppeteer页面对象
     * @param {Object} selectorData - 选择器数据
     * @param {Object} extractOptions - 提取选项
     * @param {Object} paginationOptions - 分页选项
     * @returns {Promise<Object>} 提取结果
     */
    )
  }, {
    key: "extractWithPagination",
    value: (function () {
      var _extractWithPagination = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(page, selectorData, extractOptions, paginationOptions) {
        var _paginationOptions$ma, maxPages, nextButtonSelector, _paginationOptions$wa, waitAfterClick, allResults, totalElements, currentPage, _i2, _Object$keys, key, pageResults, _i3, _Object$entries2, _Object$entries2$_i, _key, result, _allResults$_key$elem, nextButton, isClickable, _t11;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _paginationOptions$ma = paginationOptions.maxPages, maxPages = _paginationOptions$ma === void 0 ? 5 : _paginationOptions$ma, nextButtonSelector = paginationOptions.nextButtonSelector, _paginationOptions$wa = paginationOptions.waitAfterClick, waitAfterClick = _paginationOptions$wa === void 0 ? 2000 : _paginationOptions$wa;
              allResults = {};
              totalElements = 0;
              currentPage = 1; // 初始化结果结构
              for (_i2 = 0, _Object$keys = Object.keys(selectorData); _i2 < _Object$keys.length; _i2++) {
                key = _Object$keys[_i2];
                allResults[key] = {
                  success: true,
                  selector: selectorData[key],
                  elements: [],
                  pages: []
                };
              }
            case 1:
              if (!(currentPage <= maxPages)) {
                _context3.n = 13;
                break;
              }
              logger.info("\u63D0\u53D6\u7B2C ".concat(currentPage, " \u9875\u5185\u5BB9"));

              // 提取当前页内容
              _context3.n = 2;
              return this.extractFromPage(selectorData, extractOptions);
            case 2:
              pageResults = _context3.v;
              // 合并结果
              for (_i3 = 0, _Object$entries2 = Object.entries(pageResults.data); _i3 < _Object$entries2.length; _i3++) {
                _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2), _key = _Object$entries2$_i[0], result = _Object$entries2$_i[1];
                if (result.success && result.elements) {
                  (_allResults$_key$elem = allResults[_key].elements).push.apply(_allResults$_key$elem, _toConsumableArray(result.elements));
                  allResults[_key].pages.push({
                    page: currentPage,
                    count: result.elements.length,
                    url: page.url()
                  });
                  totalElements += result.elements.length;
                }
              }

              // 尝试点击下一页
              if (!(currentPage < maxPages)) {
                _context3.n = 12;
                break;
              }
              _context3.p = 3;
              _context3.n = 4;
              return page.$(nextButtonSelector);
            case 4:
              nextButton = _context3.v;
              if (nextButton) {
                _context3.n = 5;
                break;
              }
              logger.info('未找到下一页按钮，分页结束');
              return _context3.a(3, 13);
            case 5:
              _context3.n = 6;
              return nextButton.evaluate(function (el) {
                var style = window.getComputedStyle(el);
                return !el.disabled && style.display !== 'none' && style.visibility !== 'hidden';
              });
            case 6:
              isClickable = _context3.v;
              if (isClickable) {
                _context3.n = 7;
                break;
              }
              logger.info('下一页按钮不可点击，分页结束');
              return _context3.a(3, 13);
            case 7:
              _context3.n = 8;
              return nextButton.click();
            case 8:
              _context3.n = 9;
              return page.waitForTimeout(waitAfterClick);
            case 9:
              _context3.n = 10;
              return page.waitForLoadState('networkidle');
            case 10:
              _context3.n = 12;
              break;
            case 11:
              _context3.p = 11;
              _t11 = _context3.v;
              logger.warn("\u7B2C ".concat(currentPage, " \u9875\u5BFC\u822A\u5931\u8D25:"), _t11.message);
              return _context3.a(3, 13);
            case 12:
              currentPage++;
              _context3.n = 1;
              break;
            case 13:
              return _context3.a(2, {
                data: allResults,
                totalElements: totalElements
              });
          }
        }, _callee3, this, [[3, 11]]);
      }));
      function extractWithPagination(_x5, _x6, _x7, _x8) {
        return _extractWithPagination.apply(this, arguments);
      }
      return extractWithPagination;
    }()
    /**
     * 根据选择器提取内容
     * @param {Object} page - Puppeteer页面对象
     * @param {string} selector - 选择器
     * @param {Object} options - 提取选项
     * @returns {Promise<Object>} 提取结果
     */
    )
  }, {
    key: "extractBySelector",
    value: (function () {
      var _extractBySelector = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(page, selector, options) {
        var _options$selectorType, selectorType, _options$extractType, extractType, _options$attributes, attributes, _options$multiple, multiple, _options$waitForEleme, waitForElements, _options$timeout, timeout, _options$includeMetad, includeMetadata, _options$textOptions, textOptions, finalSelectorType, elements, extractedElements, elementsToProcess, i, element, elementData;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _options$selectorType = options.selectorType, selectorType = _options$selectorType === void 0 ? 'auto' : _options$selectorType, _options$extractType = options.extractType, extractType = _options$extractType === void 0 ? 'text' : _options$extractType, _options$attributes = options.attributes, attributes = _options$attributes === void 0 ? [] : _options$attributes, _options$multiple = options.multiple, multiple = _options$multiple === void 0 ? false : _options$multiple, _options$waitForEleme = options.waitForElements, waitForElements = _options$waitForEleme === void 0 ? true : _options$waitForEleme, _options$timeout = options.timeout, timeout = _options$timeout === void 0 ? 10000 : _options$timeout, _options$includeMetad = options.includeMetadata, includeMetadata = _options$includeMetad === void 0 ? false : _options$includeMetad, _options$textOptions = options.textOptions, textOptions = _options$textOptions === void 0 ? {} : _options$textOptions; // 确定选择器类型
              finalSelectorType = selectorType === 'auto' ? detectSelectorType(selector) : selectorType; // 等待元素出现
              if (!waitForElements) {
                _context4.n = 3;
                break;
              }
              if (!(finalSelectorType === 'xpath')) {
                _context4.n = 2;
                break;
              }
              _context4.n = 1;
              return page.waitForXPath(selector, {
                visible: true,
                timeout: timeout
              });
            case 1:
              _context4.n = 3;
              break;
            case 2:
              _context4.n = 3;
              return page.waitForSelector(selector, {
                visible: true,
                timeout: timeout
              });
            case 3:
              if (!(finalSelectorType === 'xpath')) {
                _context4.n = 5;
                break;
              }
              _context4.n = 4;
              return page.$x(selector);
            case 4:
              elements = _context4.v;
              _context4.n = 7;
              break;
            case 5:
              _context4.n = 6;
              return page.$$(selector);
            case 6:
              elements = _context4.v;
            case 7:
              if (!(elements.length === 0)) {
                _context4.n = 8;
                break;
              }
              return _context4.a(2, {
                success: false,
                selector: selector,
                elements: [],
                error: '未找到匹配的元素'
              });
            case 8:
              // 提取内容
              extractedElements = [];
              elementsToProcess = multiple ? elements : [elements[0]];
              i = 0;
            case 9:
              if (!(i < elementsToProcess.length)) {
                _context4.n = 12;
                break;
              }
              element = elementsToProcess[i];
              _context4.n = 10;
              return this.extractElementData(element, extractType, attributes, textOptions, includeMetadata);
            case 10:
              elementData = _context4.v;
              elementData.index = i;
              extractedElements.push(elementData);
            case 11:
              i++;
              _context4.n = 9;
              break;
            case 12:
              return _context4.a(2, {
                success: true,
                selector: selector,
                selectorType: finalSelectorType,
                elements: extractedElements,
                count: extractedElements.length
              });
          }
        }, _callee4, this);
      }));
      function extractBySelector(_x9, _x0, _x1) {
        return _extractBySelector.apply(this, arguments);
      }
      return extractBySelector;
    }()
    /**
     * 提取单个元素的数据
     * @param {Object} element - 元素对象
     * @param {string} extractType - 提取类型
     * @param {Array} attributes - 属性列表
     * @param {Object} textOptions - 文本选项
     * @param {boolean} includeMetadata - 是否包含元数据
     * @returns {Promise<Object>} 元素数据
     */
    )
  }, {
    key: "extractElementData",
    value: (function () {
      var _extractElementData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(element, extractType, attributes, textOptions, includeMetadata) {
        var data, extractedData, metadata, _t12;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              data = {};
              _context5.p = 1;
              _context5.n = 2;
              return element.evaluate(function (el, options) {
                var extractType = options.extractType,
                  attributes = options.attributes,
                  textOptions = options.textOptions;
                var result = {};

                // 提取文本
                if (extractType === 'text' || extractType === 'all') {
                  var text = textOptions.includeHidden ? el.textContent : el.innerText || el.textContent;
                  if (text && textOptions.trim) {
                    text = text.trim();
                  }
                  if (text && textOptions.normalizeWhitespace) {
                    text = text.replace(/\s+/g, ' ');
                  }
                  result.text = text || '';
                }

                // 提取HTML
                if (extractType === 'html' || extractType === 'all') {
                  result.html = el.outerHTML;
                  result.innerHTML = el.innerHTML;
                }

                // 提取属性
                if (extractType === 'attributes' || extractType === 'all' || attributes.length > 0) {
                  result.attributes = {};
                  if (attributes.length > 0) {
                    // 提取指定属性
                    var _iterator2 = _createForOfIteratorHelper(attributes),
                      _step2;
                    try {
                      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                        var attr = _step2.value;
                        result.attributes[attr] = el.getAttribute(attr);
                      }
                    } catch (err) {
                      _iterator2.e(err);
                    } finally {
                      _iterator2.f();
                    }
                  } else {
                    // 提取所有属性
                    var _iterator3 = _createForOfIteratorHelper(el.attributes),
                      _step3;
                    try {
                      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                        var _attr = _step3.value;
                        result.attributes[_attr.name] = _attr.value;
                      }
                    } catch (err) {
                      _iterator3.e(err);
                    } finally {
                      _iterator3.f();
                    }
                  }
                }
                return result;
              }, {
                extractType: extractType,
                attributes: attributes,
                textOptions: textOptions
              });
            case 2:
              extractedData = _context5.v;
              Object.assign(data, extractedData);

              // 添加元数据
              if (!includeMetadata) {
                _context5.n = 4;
                break;
              }
              _context5.n = 3;
              return element.evaluate(function (el) {
                var rect = el.getBoundingClientRect();
                var computedStyle = window.getComputedStyle(el);
                return {
                  tagName: el.tagName.toLowerCase(),
                  id: el.id,
                  className: el.className,
                  bounds: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                  },
                  visible: rect.width > 0 && rect.height > 0 && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none',
                  computedStyle: {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    position: computedStyle.position,
                    zIndex: computedStyle.zIndex
                  }
                };
              });
            case 3:
              metadata = _context5.v;
              data.metadata = metadata;
            case 4:
              _context5.n = 6;
              break;
            case 5:
              _context5.p = 5;
              _t12 = _context5.v;
              logger.warn('提取元素数据失败:', _t12.message);
              data.error = _t12.message;
            case 6:
              return _context5.a(2, data);
          }
        }, _callee5, null, [[1, 5]]);
      }));
      function extractElementData(_x10, _x11, _x12, _x13, _x14) {
        return _extractElementData.apply(this, arguments);
      }
      return extractElementData;
    }()
    /**
     * 标准化选择器
     * @param {*} selectors - 选择器输入
     * @returns {Array<string>} 选择器数组
     */
    )
  }, {
    key: "normalizeSelectors",
    value: function normalizeSelectors(selectors) {
      if (typeof selectors === 'string') {
        return [selectors];
      }
      if (Array.isArray(selectors)) {
        return selectors;
      }
      if (_typeof(selectors) === 'object') {
        return Object.values(selectors);
      }
      return [];
    }

    /**
     * 解析选择器为键值对
     * @param {*} selectors - 选择器输入
     * @returns {Object} 选择器键值对
     */
  }, {
    key: "parseSelectors",
    value: function parseSelectors(selectors) {
      if (typeof selectors === 'string') {
        return {
          main: selectors
        };
      }
      if (Array.isArray(selectors)) {
        var result = {};
        selectors.forEach(function (selector, index) {
          result["selector_".concat(index)] = selector;
        });
        return result;
      }
      if (_typeof(selectors) === 'object') {
        return selectors;
      }
      return {};
    }

    /**
     * 获取页面信息
     * @param {Object} page - Puppeteer页面对象
     * @returns {Promise<Object>} 页面信息
     */
  }, {
    key: "getPageInfo",
    value: (function () {
      var _getPageInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(page) {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return page.evaluate(function () {
                return {
                  url: window.location.href,
                  title: document.title,
                  timestamp: new Date().toISOString()
                };
              });
            case 1:
              return _context6.a(2, _context6.v);
            case 2:
              _context6.p = 2;
              _context6.v;
              return _context6.a(2, {
                url: 'unknown',
                title: 'unknown',
                timestamp: new Date().toISOString()
              });
          }
        }, _callee6, null, [[0, 2]]);
      }));
      function getPageInfo(_x15) {
        return _getPageInfo.apply(this, arguments);
      }
      return getPageInfo;
    }()
    /**
     * 获取工具使用提示
     * @returns {string} 使用提示
     */
    )
  }, {
    key: "getUsageHint",
    value: function getUsageHint() {
      return "\n\u5185\u5BB9\u63D0\u53D6\u5DE5\u5177\u4F7F\u7528\u8BF4\u660E:\n- selectors: \u5FC5\u9700\uFF0C\u9009\u62E9\u5668\uFF08\u5B57\u7B26\u4E32\u3001\u6570\u7EC4\u6216\u5BF9\u8C61\uFF09\n- selectorType: \u53EF\u9009\uFF0C\u9009\u62E9\u5668\u7C7B\u578B (css/xpath/auto\uFF0C\u9ED8\u8BA4auto)\n- extractType: \u53EF\u9009\uFF0C\u63D0\u53D6\u7C7B\u578B (text/html/attributes/all\uFF0C\u9ED8\u8BA4text)\n- attributes: \u53EF\u9009\uFF0C\u8981\u63D0\u53D6\u7684\u5C5E\u6027\u5217\u8868\n- multiple: \u53EF\u9009\uFF0C\u662F\u5426\u63D0\u53D6\u6240\u6709\u5339\u914D\u5143\u7D20\uFF08\u9ED8\u8BA4false\uFF09\n- waitForElements: \u53EF\u9009\uFF0C\u662F\u5426\u7B49\u5F85\u5143\u7D20\u51FA\u73B0\uFF08\u9ED8\u8BA4true\uFF09\n- timeout: \u53EF\u9009\uFF0C\u8D85\u65F6\u65F6\u95F41-60\u79D2\uFF08\u9ED8\u8BA410\u79D2\uFF09\n- includeMetadata: \u53EF\u9009\uFF0C\u662F\u5426\u5305\u542B\u5143\u7D20\u5143\u6570\u636E\uFF08\u9ED8\u8BA4false\uFF09\n- textOptions: \u53EF\u9009\uFF0C\u6587\u672C\u63D0\u53D6\u9009\u9879\n- pagination: \u53EF\u9009\uFF0C\u5206\u9875\u63D0\u53D6\u8BBE\u7F6E\n\n\u793A\u4F8B:\n{\n  \"selectors\": \".product-title\",\n  \"multiple\": true,\n  \"extractType\": \"text\"\n}\n\n{\n  \"selectors\": {\n    \"title\": \"h1\",\n    \"price\": \".price\",\n    \"description\": \".description\"\n  },\n  \"extractType\": \"all\"\n}\n\n{\n  \"selectors\": [\"//h1\", \"//p[@class='content']\"],\n  \"selectorType\": \"xpath\",\n  \"pagination\": {\n    \"enabled\": true,\n    \"nextButtonSelector\": \".next-page\",\n    \"maxPages\": 3\n  }\n}\n    ".trim();
    }
  }]);
}(BaseBrowserTool);

var extractTool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ExtractTool: ExtractTool
});

/**
 * 文本输入工具类
 */
var TypeTool = /*#__PURE__*/function (_BaseBrowserTool) {
  function TypeTool(browserInstance, securityPolicy) {
    _classCallCheck(this, TypeTool);
    return _callSuper(this, TypeTool, ['type', browserInstance, securityPolicy]);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  _inherits(TypeTool, _BaseBrowserTool);
  return _createClass(TypeTool, [{
    key: "getParameterSchema",
    value: function getParameterSchema() {
      return {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
            description: '目标输入元素的选择器（CSS或XPath）'
          },
          text: {
            type: 'string',
            description: '要输入的文本内容'
          },
          selectorType: {
            type: 'string',
            description: '选择器类型',
            "enum": ['css', 'xpath', 'auto'],
            "default": 'auto'
          },
          index: {
            type: 'number',
            description: '当有多个匹配元素时，选择第几个（从0开始）',
            "default": 0,
            minimum: 0
          },
          clearBefore: {
            type: 'boolean',
            description: '输入前是否清空原有内容',
            "default": true
          },
          typeSpeed: {
            type: 'number',
            description: '打字速度（字符间延迟毫秒数）',
            "default": 0,
            minimum: 0,
            maximum: 1000
          },
          waitForElement: {
            type: 'boolean',
            description: '是否等待元素出现',
            "default": true
          },
          focusFirst: {
            type: 'boolean',
            description: '输入前是否先聚焦元素',
            "default": true
          },
          pressEnter: {
            type: 'boolean',
            description: '输入完成后是否按回车键',
            "default": false
          },
          timeout: {
            type: 'number',
            description: '超时时间（毫秒）',
            "default": 10000,
            minimum: 1000,
            maximum: 60000
          },
          validateInput: {
            type: 'boolean',
            description: '是否验证输入结果',
            "default": true
          },
          inputMode: {
            type: 'string',
            description: '输入模式',
            "enum": ['type', 'paste', 'setValue'],
            "default": 'type'
          }
        },
        required: ['selector', 'text'],
        additionalProperties: false
      };
    }

    /**
     * 验证参数
     * @param {Object} params - 工具参数
     * @returns {Object} 验证结果
     */
  }, {
    key: "validateParameters",
    value: function validateParameters(params) {
      var baseValidation = _superPropGet(TypeTool, "validateParameters", this, 3)([params]);
      if (!baseValidation.valid) {
        return baseValidation;
      }
      var selector = params.selector,
        text = params.text,
        _params$selectorType = params.selectorType,
        selectorType = _params$selectorType === void 0 ? 'auto' : _params$selectorType,
        _params$index = params.index,
        index = _params$index === void 0 ? 0 : _params$index,
        _params$typeSpeed = params.typeSpeed,
        typeSpeed = _params$typeSpeed === void 0 ? 0 : _params$typeSpeed,
        _params$timeout = params.timeout,
        timeout = _params$timeout === void 0 ? 10000 : _params$timeout;

      // 验证选择器
      if (!selector || typeof selector !== 'string') {
        return {
          valid: false,
          error: '选择器必须是非空字符串'
        };
      }

      // 验证选择器类型和格式
      if (selectorType === 'css' && !isValidCSSSelector(selector)) {
        return {
          valid: false,
          error: '无效的CSS选择器格式'
        };
      }
      if (selectorType === 'xpath' && !isValidXPathSelector(selector)) {
        return {
          valid: false,
          error: '无效的XPath选择器格式'
        };
      }
      if (selectorType === 'auto') {
        var detectedType = detectSelectorType(selector);
        if (detectedType === 'unknown') {
          return {
            valid: false,
            error: '无法识别选择器类型，请指定selectorType'
          };
        }
      }

      // 验证文本内容
      if (typeof text !== 'string') {
        return {
          valid: false,
          error: '文本内容必须是字符串'
        };
      }

      // 验证索引
      if (index < 0 || !Number.isInteger(index)) {
        return {
          valid: false,
          error: 'index必须是非负整数'
        };
      }

      // 验证打字速度
      if (typeSpeed < 0 || typeSpeed > 1000) {
        return {
          valid: false,
          error: '打字速度必须在0-1000毫秒之间'
        };
      }

      // 验证超时时间
      if (timeout < 1000 || timeout > 60000) {
        return {
          valid: false,
          error: '超时时间必须在1-60秒之间'
        };
      }
      return {
        valid: true
      };
    }

    /**
     * 执行文本输入操作
     * @param {Object} params - 工具参数
     * @returns {Promise<Object>} 执行结果
     */
  }, {
    key: "executeInternal",
    value: (function () {
      var _executeInternal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(params) {
        var selector, text, _params$selectorType2, selectorType, _params$index2, index, _params$clearBefore, clearBefore, _params$typeSpeed2, typeSpeed, _params$waitForElemen, waitForElement, _params$focusFirst, focusFirst, _params$pressEnter, pressEnter, _params$timeout2, timeout, _params$validateInput, validateInput, _params$inputMode, inputMode, page, startTime, finalSelectorType, element, elementInfo, beforeValue, afterValue, validationResult, executionTime, _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              selector = params.selector, text = params.text, _params$selectorType2 = params.selectorType, selectorType = _params$selectorType2 === void 0 ? 'auto' : _params$selectorType2, _params$index2 = params.index, index = _params$index2 === void 0 ? 0 : _params$index2, _params$clearBefore = params.clearBefore, clearBefore = _params$clearBefore === void 0 ? true : _params$clearBefore, _params$typeSpeed2 = params.typeSpeed, typeSpeed = _params$typeSpeed2 === void 0 ? 0 : _params$typeSpeed2, _params$waitForElemen = params.waitForElement, waitForElement = _params$waitForElemen === void 0 ? true : _params$waitForElemen, _params$focusFirst = params.focusFirst, focusFirst = _params$focusFirst === void 0 ? true : _params$focusFirst, _params$pressEnter = params.pressEnter, pressEnter = _params$pressEnter === void 0 ? false : _params$pressEnter, _params$timeout2 = params.timeout, timeout = _params$timeout2 === void 0 ? 10000 : _params$timeout2, _params$validateInput = params.validateInput, validateInput = _params$validateInput === void 0 ? true : _params$validateInput, _params$inputMode = params.inputMode, inputMode = _params$inputMode === void 0 ? 'type' : _params$inputMode;
              _context.n = 1;
              return this.browserInstance.getCurrentPage();
            case 1:
              page = _context.v;
              startTime = Date.now();
              _context.p = 2;
              // 确定选择器类型
              finalSelectorType = selectorType === 'auto' ? detectSelectorType(selector) : selectorType;
              logger.info("\u5F00\u59CB\u6587\u672C\u8F93\u5165: \"".concat(text, "\" \u5230\u5143\u7D20 ").concat(selector, " (\u7D22\u5F15: ").concat(index, ")"));

              // 等待元素出现
              if (!waitForElement) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return this.waitForElementBySelector(page, selector, finalSelectorType, index, timeout);
            case 3:
              element = _context.v;
              _context.n = 6;
              break;
            case 4:
              _context.n = 5;
              return this.findElementBySelector(page, selector, finalSelectorType, index);
            case 5:
              element = _context.v;
            case 6:
              if (element) {
                _context.n = 7;
                break;
              }
              throw new Error("\u672A\u627E\u5230\u5339\u914D\u7684\u5143\u7D20: ".concat(selector));
            case 7:
              _context.n = 8;
              return this.getElementInfo(element);
            case 8:
              elementInfo = _context.v;
              // 验证元素是否可输入
              if (!this.isInputElement(elementInfo)) {
                logger.warn("\u5143\u7D20\u53EF\u80FD\u4E0D\u652F\u6301\u6587\u672C\u8F93\u5165: ".concat(elementInfo.tagName));
              }

              // 检查元素是否可见和启用
              if (elementInfo.visible) {
                _context.n = 9;
                break;
              }
              throw new Error('目标元素不可见');
            case 9:
              if (elementInfo.enabled) {
                _context.n = 10;
                break;
              }
              throw new Error('目标元素已禁用');
            case 10:
              _context.n = 11;
              return element.scrollIntoView();
            case 11:
              _context.n = 12;
              return page.waitForTimeout(100);
            case 12:
              if (!focusFirst) {
                _context.n = 15;
                break;
              }
              _context.n = 13;
              return element.focus();
            case 13:
              _context.n = 14;
              return page.waitForTimeout(100);
            case 14:
              logger.debug('已聚焦目标元素');
            case 15:
              _context.n = 16;
              return this.getElementValue(element);
            case 16:
              beforeValue = _context.v;
              if (!(clearBefore && beforeValue)) {
                _context.n = 18;
                break;
              }
              _context.n = 17;
              return this.clearElementContent(element, elementInfo);
            case 17:
              logger.debug('已清空元素原有内容');
            case 18:
              _t = inputMode;
              _context.n = _t === 'paste' ? 19 : _t === 'setValue' ? 21 : _t === 'type' ? 23 : 23;
              break;
            case 19:
              _context.n = 20;
              return this.pasteText(page, text);
            case 20:
              _context.v;
              return _context.a(3, 25);
            case 21:
              _context.n = 22;
              return this.setElementValue(element, text);
            case 22:
              _context.v;
              return _context.a(3, 25);
            case 23:
              _context.n = 24;
              return this.typeText(element, text, typeSpeed);
            case 24:
              _context.v;
              return _context.a(3, 25);
            case 25:
              if (!pressEnter) {
                _context.n = 28;
                break;
              }
              _context.n = 26;
              return page.keyboard.press('Enter');
            case 26:
              _context.n = 27;
              return page.waitForTimeout(100);
            case 27:
              logger.debug('已按下回车键');
            case 28:
              _context.n = 29;
              return this.getElementValue(element);
            case 29:
              afterValue = _context.v;
              // 验证输入结果
              validationResult = {
                success: true,
                message: '输入成功'
              };
              if (validateInput) {
                validationResult = this.validateInputResult(text, afterValue, clearBefore);
              }
              executionTime = Date.now() - startTime;
              logger.info("\u6587\u672C\u8F93\u5165\u5B8C\u6210\uFF0C\u8017\u65F6: ".concat(executionTime, "ms"));
              return _context.a(2, {
                success: true,
                data: {
                  selector: selector,
                  selectorType: finalSelectorType,
                  index: index,
                  inputText: text,
                  inputMode: inputMode,
                  beforeValue: beforeValue,
                  afterValue: afterValue,
                  elementInfo: elementInfo,
                  validation: validationResult,
                  settings: {
                    clearBefore: clearBefore,
                    typeSpeed: typeSpeed,
                    pressEnter: pressEnter,
                    focusFirst: focusFirst
                  }
                },
                timestamp: new Date().toISOString(),
                executionTime: executionTime
              });
            case 30:
              _context.p = 30;
              _t2 = _context.v;
              logger.error('文本输入失败:', _t2);
              throw new Error("\u6587\u672C\u8F93\u5165\u5931\u8D25: ".concat(_t2.message));
            case 31:
              return _context.a(2);
          }
        }, _callee, this, [[2, 30]]);
      }));
      function executeInternal(_x) {
        return _executeInternal.apply(this, arguments);
      }
      return executeInternal;
    }()
    /**
     * 根据选择器查找元素
     * @param {Object} page - Puppeteer页面对象
     * @param {string} selector - 选择器
     * @param {string} selectorType - 选择器类型
     * @param {number} index - 元素索引
     * @returns {Promise<Object>} 元素对象
     */
    )
  }, {
    key: "findElementBySelector",
    value: (function () {
      var _findElementBySelector = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(page, selector, selectorType, index) {
        var elements, _elements;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!(selectorType === 'xpath')) {
                _context2.n = 2;
                break;
              }
              _context2.n = 1;
              return page.$x(selector);
            case 1:
              elements = _context2.v;
              return _context2.a(2, elements[index] || null);
            case 2:
              _context2.n = 3;
              return page.$$(selector);
            case 3:
              _elements = _context2.v;
              return _context2.a(2, _elements[index] || null);
            case 4:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function findElementBySelector(_x2, _x3, _x4, _x5) {
        return _findElementBySelector.apply(this, arguments);
      }
      return findElementBySelector;
    }()
    /**
     * 等待元素出现并返回
     * @param {Object} page - Puppeteer页面对象
     * @param {string} selector - 选择器
     * @param {string} selectorType - 选择器类型
     * @param {number} index - 元素索引
     * @param {number} timeout - 超时时间
     * @returns {Promise<Object>} 元素对象
     */
    )
  }, {
    key: "waitForElementBySelector",
    value: (function () {
      var _waitForElementBySelector = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(page, selector, selectorType, index, timeout) {
        var elements, _elements2;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              if (!(selectorType === 'xpath')) {
                _context3.n = 3;
                break;
              }
              _context3.n = 1;
              return page.waitForXPath(selector, {
                visible: true,
                timeout: timeout
              });
            case 1:
              _context3.n = 2;
              return page.$x(selector);
            case 2:
              elements = _context3.v;
              return _context3.a(2, elements[index] || null);
            case 3:
              _context3.n = 4;
              return page.waitForSelector(selector, {
                visible: true,
                timeout: timeout
              });
            case 4:
              _context3.n = 5;
              return page.$$(selector);
            case 5:
              _elements2 = _context3.v;
              return _context3.a(2, _elements2[index] || null);
            case 6:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function waitForElementBySelector(_x6, _x7, _x8, _x9, _x0) {
        return _waitForElementBySelector.apply(this, arguments);
      }
      return waitForElementBySelector;
    }()
    /**
     * 获取元素信息
     * @param {Object} element - 元素对象
     * @returns {Promise<Object>} 元素信息
     */
    )
  }, {
    key: "getElementInfo",
    value: (function () {
      var _getElementInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(element) {
        var info, _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return element.evaluate(function (el) {
                var rect = el.getBoundingClientRect();
                var computedStyle = window.getComputedStyle(el);
                return {
                  tagName: el.tagName.toLowerCase(),
                  type: el.type,
                  id: el.id,
                  className: el.className,
                  placeholder: el.placeholder,
                  maxLength: el.maxLength,
                  readOnly: el.readOnly,
                  disabled: el.disabled,
                  visible: rect.width > 0 && rect.height > 0 && computedStyle.visibility !== 'hidden' && computedStyle.display !== 'none',
                  enabled: !el.disabled && !el.hasAttribute('disabled'),
                  bounds: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                  }
                };
              });
            case 1:
              info = _context4.v;
              return _context4.a(2, info);
            case 2:
              _context4.p = 2;
              _t3 = _context4.v;
              logger.warn('获取元素信息失败:', _t3.message);
              return _context4.a(2, {
                tagName: 'unknown',
                visible: false,
                enabled: false
              });
          }
        }, _callee4, null, [[0, 2]]);
      }));
      function getElementInfo(_x1) {
        return _getElementInfo.apply(this, arguments);
      }
      return getElementInfo;
    }()
    /**
     * 判断元素是否为输入元素
     * @param {Object} elementInfo - 元素信息
     * @returns {boolean} 是否为输入元素
     */
    )
  }, {
    key: "isInputElement",
    value: function isInputElement(elementInfo) {
      var inputTags = ['input', 'textarea', 'select'];
      var inputTypes = ['text', 'password', 'email', 'search', 'url', 'tel', 'number'];
      if (inputTags.includes(elementInfo.tagName)) {
        if (elementInfo.tagName === 'input') {
          return !elementInfo.type || inputTypes.includes(elementInfo.type);
        }
        return true;
      }

      // 检查 contenteditable 元素
      return elementInfo.contentEditable === 'true';
    }

    /**
     * 获取元素当前值
     * @param {Object} element - 元素对象
     * @returns {Promise<string>} 元素值
     */
  }, {
    key: "getElementValue",
    value: (function () {
      var _getElementValue = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(element) {
        var value, _t4;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return element.evaluate(function (el) {
                if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                  return el.value || '';
                }
                if (el.tagName.toLowerCase() === 'select') {
                  var _el$selectedOptions$;
                  return ((_el$selectedOptions$ = el.selectedOptions[0]) === null || _el$selectedOptions$ === void 0 ? void 0 : _el$selectedOptions$.text) || '';
                }
                if (el.isContentEditable) {
                  return el.textContent || '';
                }
                return el.textContent || '';
              });
            case 1:
              value = _context5.v;
              return _context5.a(2, value);
            case 2:
              _context5.p = 2;
              _t4 = _context5.v;
              logger.warn('获取元素值失败:', _t4.message);
              return _context5.a(2, '');
          }
        }, _callee5, null, [[0, 2]]);
      }));
      function getElementValue(_x10) {
        return _getElementValue.apply(this, arguments);
      }
      return getElementValue;
    }()
    /**
     * 清空元素内容
     * @param {Object} element - 元素对象
     * @param {Object} elementInfo - 元素信息
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "clearElementContent",
    value: (function () {
      var _clearElementContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(element, elementInfo) {
        var _t5;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              if (!['input', 'textarea'].includes(elementInfo.tagName)) {
                _context6.n = 3;
                break;
              }
              _context6.n = 1;
              return element.click({
                clickCount: 3
              });
            case 1:
              _context6.n = 2;
              return element.press('Backspace');
            case 2:
              _context6.n = 4;
              break;
            case 3:
              if (!elementInfo.contentEditable) {
                _context6.n = 4;
                break;
              }
              _context6.n = 4;
              return element.evaluate(function (el) {
                el.textContent = '';
              });
            case 4:
              _context6.n = 6;
              break;
            case 5:
              _context6.p = 5;
              _t5 = _context6.v;
              logger.warn('清空元素内容失败:', _t5.message);
            case 6:
              return _context6.a(2);
          }
        }, _callee6, null, [[0, 5]]);
      }));
      function clearElementContent(_x11, _x12) {
        return _clearElementContent.apply(this, arguments);
      }
      return clearElementContent;
    }()
    /**
     * 输入文本
     * @param {Object} element - 元素对象
     * @param {string} text - 要输入的文本
     * @param {number} typeSpeed - 打字速度
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "typeText",
    value: (function () {
      var _typeText = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(element, text, typeSpeed) {
        var _iterator, _step, _char, _t6;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              if (!(typeSpeed > 0)) {
                _context7.n = 9;
                break;
              }
              // 逐字符输入
              _iterator = _createForOfIteratorHelper(text);
              _context7.p = 1;
              _iterator.s();
            case 2:
              if ((_step = _iterator.n()).done) {
                _context7.n = 5;
                break;
              }
              _char = _step.value;
              _context7.n = 3;
              return element.type(_char);
            case 3:
              _context7.n = 4;
              return new Promise(function (resolve) {
                return setTimeout(resolve, typeSpeed);
              });
            case 4:
              _context7.n = 2;
              break;
            case 5:
              _context7.n = 7;
              break;
            case 6:
              _context7.p = 6;
              _t6 = _context7.v;
              _iterator.e(_t6);
            case 7:
              _context7.p = 7;
              _iterator.f();
              return _context7.f(7);
            case 8:
              _context7.n = 10;
              break;
            case 9:
              _context7.n = 10;
              return element.type(text);
            case 10:
              return _context7.a(2);
          }
        }, _callee7, null, [[1, 6, 7, 8]]);
      }));
      function typeText(_x13, _x14, _x15) {
        return _typeText.apply(this, arguments);
      }
      return typeText;
    }()
    /**
     * 粘贴文本
     * @param {Object} page - 页面对象
     * @param {string} text - 要粘贴的文本
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "pasteText",
    value: (function () {
      var _pasteText = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(page, text) {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return page.evaluate(function (textToPaste) {
                navigator.clipboard.writeText(textToPaste);
              }, text);
            case 1:
              _context8.n = 2;
              return page.keyboard.down('Control');
            case 2:
              _context8.n = 3;
              return page.keyboard.press('v');
            case 3:
              _context8.n = 4;
              return page.keyboard.up('Control');
            case 4:
              return _context8.a(2);
          }
        }, _callee8);
      }));
      function pasteText(_x16, _x17) {
        return _pasteText.apply(this, arguments);
      }
      return pasteText;
    }()
    /**
     * 设置元素值
     * @param {Object} element - 元素对象
     * @param {string} text - 要设置的文本
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "setElementValue",
    value: (function () {
      var _setElementValue = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(element, text) {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return element.evaluate(function (el, value) {
                if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                  el.value = value;
                  el.dispatchEvent(new Event('input', {
                    bubbles: true
                  }));
                  el.dispatchEvent(new Event('change', {
                    bubbles: true
                  }));
                } else if (el.isContentEditable) {
                  el.textContent = value;
                  el.dispatchEvent(new Event('input', {
                    bubbles: true
                  }));
                }
              }, text);
            case 1:
              return _context9.a(2);
          }
        }, _callee9);
      }));
      function setElementValue(_x18, _x19) {
        return _setElementValue.apply(this, arguments);
      }
      return setElementValue;
    }()
    /**
     * 验证输入结果
     * @param {string} expectedText - 期望的文本
     * @param {string} actualValue - 实际值
     * @param {boolean} clearBefore - 是否清空了原有内容
     * @returns {Object} 验证结果
     */
    )
  }, {
    key: "validateInputResult",
    value: function validateInputResult(expectedText, actualValue, clearBefore) {
      if (clearBefore) {
        // 如果清空了原有内容，应该完全匹配
        if (actualValue === expectedText) {
          return {
            success: true,
            message: '输入验证成功'
          };
        } else {
          return {
            success: false,
            message: "\u8F93\u5165\u9A8C\u8BC1\u5931\u8D25: \u671F\u671B \"".concat(expectedText, "\", \u5B9E\u9645 \"").concat(actualValue, "\"")
          };
        }
      } else {
        // 如果没有清空，检查是否包含输入的文本
        if (actualValue.includes(expectedText)) {
          return {
            success: true,
            message: '输入验证成功（追加模式）'
          };
        } else {
          return {
            success: false,
            message: "\u8F93\u5165\u9A8C\u8BC1\u5931\u8D25: \u5B9E\u9645\u503C \"".concat(actualValue, "\" \u4E0D\u5305\u542B\u671F\u671B\u6587\u672C \"").concat(expectedText, "\"")
          };
        }
      }
    }

    /**
     * 获取工具使用提示
     * @returns {string} 使用提示
     */
  }, {
    key: "getUsageHint",
    value: function getUsageHint() {
      return "\n\u6587\u672C\u8F93\u5165\u5DE5\u5177\u4F7F\u7528\u8BF4\u660E:\n- selector: \u5FC5\u9700\uFF0C\u76EE\u6807\u8F93\u5165\u5143\u7D20\u7684\u9009\u62E9\u5668\uFF08CSS\u6216XPath\uFF09\n- text: \u5FC5\u9700\uFF0C\u8981\u8F93\u5165\u7684\u6587\u672C\u5185\u5BB9\n- selectorType: \u53EF\u9009\uFF0C\u9009\u62E9\u5668\u7C7B\u578B (css/xpath/auto\uFF0C\u9ED8\u8BA4auto)\n- index: \u53EF\u9009\uFF0C\u591A\u4E2A\u5339\u914D\u5143\u7D20\u65F6\u7684\u7D22\u5F15\uFF08\u9ED8\u8BA40\uFF09\n- clearBefore: \u53EF\u9009\uFF0C\u8F93\u5165\u524D\u662F\u5426\u6E05\u7A7A\u539F\u6709\u5185\u5BB9\uFF08\u9ED8\u8BA4true\uFF09\n- typeSpeed: \u53EF\u9009\uFF0C\u6253\u5B57\u901F\u5EA6\uFF08\u5B57\u7B26\u95F4\u5EF6\u8FDF\u6BEB\u79D2\u6570\uFF0C\u9ED8\u8BA40\uFF09\n- waitForElement: \u53EF\u9009\uFF0C\u662F\u5426\u7B49\u5F85\u5143\u7D20\u51FA\u73B0\uFF08\u9ED8\u8BA4true\uFF09\n- focusFirst: \u53EF\u9009\uFF0C\u8F93\u5165\u524D\u662F\u5426\u5148\u805A\u7126\u5143\u7D20\uFF08\u9ED8\u8BA4true\uFF09\n- pressEnter: \u53EF\u9009\uFF0C\u8F93\u5165\u5B8C\u6210\u540E\u662F\u5426\u6309\u56DE\u8F66\u952E\uFF08\u9ED8\u8BA4false\uFF09\n- timeout: \u53EF\u9009\uFF0C\u8D85\u65F6\u65F6\u95F41-60\u79D2\uFF08\u9ED8\u8BA410\u79D2\uFF09\n- validateInput: \u53EF\u9009\uFF0C\u662F\u5426\u9A8C\u8BC1\u8F93\u5165\u7ED3\u679C\uFF08\u9ED8\u8BA4true\uFF09\n- inputMode: \u53EF\u9009\uFF0C\u8F93\u5165\u6A21\u5F0F (type/paste/setValue\uFF0C\u9ED8\u8BA4type)\n\n\u793A\u4F8B:\n{\n  \"selector\": \"input[name='username']\",\n  \"text\": \"john_doe\",\n  \"clearBefore\": true\n}\n\n{\n  \"selector\": \"//textarea[@placeholder='\u8BF7\u8F93\u5165\u5185\u5BB9']\",\n  \"selectorType\": \"xpath\",\n  \"text\": \"\u8FD9\u662F\u4E00\u6BB5\u6D4B\u8BD5\u6587\u672C\",\n  \"typeSpeed\": 50,\n  \"pressEnter\": true\n}\n\n{\n  \"selector\": \"#editor\",\n  \"text\": \"\u5FEB\u901F\u8F93\u5165\u5185\u5BB9\",\n  \"inputMode\": \"setValue\",\n  \"validateInput\": false\n}\n    ".trim();
    }
  }]);
}(BaseBrowserTool);

var typeTool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TypeTool: TypeTool
});

/**
 * 屏幕截图工具类
 */
var ScreenshotTool = /*#__PURE__*/function (_BaseBrowserTool) {
  function ScreenshotTool(browserInstance, securityPolicy) {
    _classCallCheck(this, ScreenshotTool);
    return _callSuper(this, ScreenshotTool, ['screenshot', browserInstance, securityPolicy]);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  _inherits(ScreenshotTool, _BaseBrowserTool);
  return _createClass(ScreenshotTool, [{
    key: "getParameterSchema",
    value: function getParameterSchema() {
      return {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: '截图类型',
            "enum": ['fullPage', 'viewport', 'element'],
            "default": 'viewport'
          },
          selector: {
            type: 'string',
            description: '元素选择器（当type为element时必需）'
          },
          selectorType: {
            type: 'string',
            description: '选择器类型',
            "enum": ['css', 'xpath', 'auto'],
            "default": 'auto'
          },
          index: {
            type: 'number',
            description: '元素索引（当有多个匹配元素时）',
            "default": 0,
            minimum: 0
          },
          format: {
            type: 'string',
            description: '图片格式',
            "enum": ['png', 'jpeg', 'webp'],
            "default": 'png'
          },
          quality: {
            type: 'number',
            description: '图片质量（仅JPEG和WebP格式）',
            "default": 80,
            minimum: 1,
            maximum: 100
          },
          filePath: {
            type: 'string',
            description: '保存文件路径（可选，不提供则返回base64）'
          },
          clip: {
            type: 'object',
            description: '自定义裁剪区域',
            properties: {
              x: {
                type: 'number',
                minimum: 0
              },
              y: {
                type: 'number',
                minimum: 0
              },
              width: {
                type: 'number',
                minimum: 1
              },
              height: {
                type: 'number',
                minimum: 1
              }
            }
          },
          waitForElement: {
            type: 'boolean',
            description: '是否等待元素出现（仅element类型）',
            "default": true
          },
          hideElements: {
            type: 'array',
            description: '要隐藏的元素选择器数组',
            items: {
              type: 'string'
            },
            "default": []
          },
          scrollToElement: {
            type: 'boolean',
            description: '截图前是否滚动到元素（仅element类型）',
            "default": true
          },
          addPadding: {
            type: 'object',
            description: '元素截图时添加的内边距',
            properties: {
              top: {
                type: 'number',
                "default": 0
              },
              right: {
                type: 'number',
                "default": 0
              },
              bottom: {
                type: 'number',
                "default": 0
              },
              left: {
                type: 'number',
                "default": 0
              }
            },
            "default": {}
          },
          retina: {
            type: 'boolean',
            description: '是否使用高分辨率（2倍像素密度）',
            "default": false
          },
          timeout: {
            type: 'number',
            description: '超时时间（毫秒）',
            "default": 10000,
            minimum: 1000,
            maximum: 60000
          }
        },
        additionalProperties: false
      };
    }

    /**
     * 验证参数
     * @param {Object} params - 工具参数
     * @returns {Object} 验证结果
     */
  }, {
    key: "validateParameters",
    value: function validateParameters(params) {
      var baseValidation = _superPropGet(ScreenshotTool, "validateParameters", this, 3)([params]);
      if (!baseValidation.valid) {
        return baseValidation;
      }
      var _params$type = params.type,
        type = _params$type === void 0 ? 'viewport' : _params$type,
        selector = params.selector,
        _params$selectorType = params.selectorType,
        selectorType = _params$selectorType === void 0 ? 'auto' : _params$selectorType,
        _params$quality = params.quality,
        quality = _params$quality === void 0 ? 80 : _params$quality,
        _params$format = params.format,
        format = _params$format === void 0 ? 'png' : _params$format,
        filePath = params.filePath,
        clip = params.clip,
        _params$timeout = params.timeout,
        timeout = _params$timeout === void 0 ? 10000 : _params$timeout;

      // 验证截图类型
      if (type === 'element' && !selector) {
        return {
          valid: false,
          error: '元素截图必须提供selector参数'
        };
      }

      // 验证选择器
      if (selector) {
        if (selectorType === 'css' && !isValidCSSSelector(selector)) {
          return {
            valid: false,
            error: '无效的CSS选择器格式'
          };
        }
        if (selectorType === 'xpath' && !isValidXPathSelector(selector)) {
          return {
            valid: false,
            error: '无效的XPath选择器格式'
          };
        }
        if (selectorType === 'auto') {
          var detectedType = detectSelectorType(selector);
          if (detectedType === 'unknown') {
            return {
              valid: false,
              error: '无法识别选择器类型，请指定selectorType'
            };
          }
        }
      }

      // 验证图片质量
      if ((format === 'jpeg' || format === 'webp') && (quality < 1 || quality > 100)) {
        return {
          valid: false,
          error: '图片质量必须在1-100之间'
        };
      }

      // 验证文件路径
      if (filePath) {
        try {
          var parsedPath = path.parse(filePath);
          if (!parsedPath.dir || !parsedPath.name) {
            return {
              valid: false,
              error: '无效的文件路径'
            };
          }
        } catch (error) {
          return {
            valid: false,
            error: "\u6587\u4EF6\u8DEF\u5F84\u89E3\u6790\u5931\u8D25: ".concat(error.message)
          };
        }
      }

      // 验证裁剪区域
      if (clip) {
        var x = clip.x,
          y = clip.y,
          width = clip.width,
          height = clip.height;
        if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
          return {
            valid: false,
            error: '裁剪区域的坐标和尺寸必须是数字'
          };
        }
        if (x < 0 || y < 0 || width <= 0 || height <= 0) {
          return {
            valid: false,
            error: '裁剪区域的坐标不能为负数，尺寸必须大于0'
          };
        }
      }

      // 验证超时时间
      if (timeout < 1000 || timeout > 60000) {
        return {
          valid: false,
          error: '超时时间必须在1-60秒之间'
        };
      }
      return {
        valid: true
      };
    }

    /**
     * 执行截图操作
     * @param {Object} params - 工具参数
     * @returns {Promise<Object>} 执行结果
     */
  }, {
    key: "executeInternal",
    value: (function () {
      var _executeInternal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(params) {
        var _params$type2, type, selector, _params$selectorType2, selectorType, _params$index, index, _params$format2, format, _params$quality2, quality, filePath, clip, _params$waitForElemen, waitForElement, _params$hideElements, hideElements, _params$scrollToEleme, scrollToElement, _params$addPadding, addPadding, _params$retina, retina, _params$timeout2, timeout, page, startTime, screenshotOptions, screenshotData, elementInfo, result, fileInfo, dataUrl, base64Data, pageInfo, executionTime, _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _params$type2 = params.type, type = _params$type2 === void 0 ? 'viewport' : _params$type2, selector = params.selector, _params$selectorType2 = params.selectorType, selectorType = _params$selectorType2 === void 0 ? 'auto' : _params$selectorType2, _params$index = params.index, index = _params$index === void 0 ? 0 : _params$index, _params$format2 = params.format, format = _params$format2 === void 0 ? 'png' : _params$format2, _params$quality2 = params.quality, quality = _params$quality2 === void 0 ? 80 : _params$quality2, filePath = params.filePath, clip = params.clip, _params$waitForElemen = params.waitForElement, waitForElement = _params$waitForElemen === void 0 ? true : _params$waitForElemen, _params$hideElements = params.hideElements, hideElements = _params$hideElements === void 0 ? [] : _params$hideElements, _params$scrollToEleme = params.scrollToElement, scrollToElement = _params$scrollToEleme === void 0 ? true : _params$scrollToEleme, _params$addPadding = params.addPadding, addPadding = _params$addPadding === void 0 ? {} : _params$addPadding, _params$retina = params.retina, retina = _params$retina === void 0 ? false : _params$retina, _params$timeout2 = params.timeout, timeout = _params$timeout2 === void 0 ? 10000 : _params$timeout2;
              _context.n = 1;
              return this.browserInstance.getCurrentPage();
            case 1:
              page = _context.v;
              startTime = Date.now();
              _context.p = 2;
              logger.info("\u5F00\u59CB\u622A\u56FE: \u7C7B\u578B=".concat(type, ", \u683C\u5F0F=").concat(format));

              // 设置设备像素比
              if (!retina) {
                _context.n = 3;
                break;
              }
              _context.n = 3;
              return page.setViewport(_objectSpread2(_objectSpread2({}, page.viewport()), {}, {
                deviceScaleFactor: 2
              }));
            case 3:
              if (!(hideElements.length > 0)) {
                _context.n = 4;
                break;
              }
              _context.n = 4;
              return this.hideElements(page, hideElements);
            case 4:
              screenshotOptions = {
                type: format,
                encoding: filePath ? 'binary' : 'base64'
              }; // 添加质量参数（仅适用于JPEG和WebP）
              if (format === 'jpeg' || format === 'webp') {
                screenshotOptions.quality = quality;
              }
              elementInfo = null; // 根据截图类型执行不同的截图操作
              _t = type;
              _context.n = _t === 'fullPage' ? 5 : _t === 'viewport' ? 7 : _t === 'element' ? 9 : 11;
              break;
            case 5:
              screenshotOptions.fullPage = true;
              _context.n = 6;
              return page.screenshot(screenshotOptions);
            case 6:
              screenshotData = _context.v;
              return _context.a(3, 12);
            case 7:
              if (clip) {
                screenshotOptions.clip = clip;
              }
              _context.n = 8;
              return page.screenshot(screenshotOptions);
            case 8:
              screenshotData = _context.v;
              return _context.a(3, 12);
            case 9:
              _context.n = 10;
              return this.screenshotElement(page, selector, selectorType, index, screenshotOptions, {
                waitForElement: waitForElement,
                scrollToElement: scrollToElement,
                addPadding: addPadding,
                timeout: timeout
              });
            case 10:
              result = _context.v;
              screenshotData = result.data;
              elementInfo = result.elementInfo;
              return _context.a(3, 12);
            case 11:
              throw new Error("\u4E0D\u652F\u6301\u7684\u622A\u56FE\u7C7B\u578B: ".concat(type));
            case 12:
              if (!(hideElements.length > 0)) {
                _context.n = 13;
                break;
              }
              _context.n = 13;
              return this.showElements(page, hideElements);
            case 13:
              // 保存文件或返回base64数据
              fileInfo = null;
              dataUrl = null;
              if (!filePath) {
                _context.n = 15;
                break;
              }
              _context.n = 14;
              return this.saveScreenshotToFile(screenshotData, filePath);
            case 14:
              fileInfo = {
                path: filePath,
                size: screenshotData.length,
                format: format.toUpperCase()
              };
              logger.info("\u622A\u56FE\u5DF2\u4FDD\u5B58\u5230: ".concat(filePath));
              _context.n = 16;
              break;
            case 15:
              // 返回base64数据
              base64Data = screenshotData.toString('base64');
              dataUrl = "data:image/".concat(format, ";base64,").concat(base64Data);
            case 16:
              _context.n = 17;
              return this.getPageInfo(page);
            case 17:
              pageInfo = _context.v;
              executionTime = Date.now() - startTime;
              logger.info("\u622A\u56FE\u5B8C\u6210\uFF0C\u8017\u65F6: ".concat(executionTime, "ms"));
              return _context.a(2, {
                success: true,
                data: {
                  type: type,
                  format: format,
                  selector: selector,
                  selectorType: selector ? selectorType === 'auto' ? detectSelectorType(selector) : selectorType : null,
                  elementInfo: elementInfo,
                  fileInfo: fileInfo,
                  dataUrl: dataUrl,
                  pageInfo: pageInfo,
                  settings: {
                    quality: format === 'jpeg' || format === 'webp' ? quality : null,
                    retina: retina,
                    clip: clip,
                    hideElements: hideElements.length,
                    padding: addPadding
                  },
                  metadata: {
                    timestamp: new Date().toISOString(),
                    viewport: page.viewport(),
                    url: page.url()
                  }
                },
                timestamp: new Date().toISOString(),
                executionTime: executionTime
              });
            case 18:
              _context.p = 18;
              _t2 = _context.v;
              logger.error('截图操作失败:', _t2);
              throw new Error("\u622A\u56FE\u64CD\u4F5C\u5931\u8D25: ".concat(_t2.message));
            case 19:
              return _context.a(2);
          }
        }, _callee, this, [[2, 18]]);
      }));
      function executeInternal(_x) {
        return _executeInternal.apply(this, arguments);
      }
      return executeInternal;
    }()
    /**
     * 截取元素截图
     * @param {Object} page - 页面对象
     * @param {string} selector - 选择器
     * @param {string} selectorType - 选择器类型
     * @param {number} index - 元素索引
     * @param {Object} screenshotOptions - 截图选项
     * @param {Object} options - 其他选项
     * @returns {Promise<Object>} 截图数据和元素信息
     */
    )
  }, {
    key: "screenshotElement",
    value: (function () {
      var _screenshotElement = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(page, selector, selectorType, index, screenshotOptions, options) {
        var waitForElement, scrollToElement, addPadding, timeout, finalSelectorType, element, elements, _elements, _elements2, _elements3, elementInfo, screenshotClip, padding, screenshotData;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              waitForElement = options.waitForElement, scrollToElement = options.scrollToElement, addPadding = options.addPadding, timeout = options.timeout; // 确定选择器类型
              finalSelectorType = selectorType === 'auto' ? detectSelectorType(selector) : selectorType; // 查找元素
              if (!waitForElement) {
                _context2.n = 7;
                break;
              }
              if (!(finalSelectorType === 'xpath')) {
                _context2.n = 3;
                break;
              }
              _context2.n = 1;
              return page.waitForXPath(selector, {
                visible: true,
                timeout: timeout
              });
            case 1:
              _context2.n = 2;
              return page.$x(selector);
            case 2:
              elements = _context2.v;
              element = elements[index] || null;
              _context2.n = 6;
              break;
            case 3:
              _context2.n = 4;
              return page.waitForSelector(selector, {
                visible: true,
                timeout: timeout
              });
            case 4:
              _context2.n = 5;
              return page.$$(selector);
            case 5:
              _elements = _context2.v;
              element = _elements[index] || null;
            case 6:
              _context2.n = 11;
              break;
            case 7:
              if (!(finalSelectorType === 'xpath')) {
                _context2.n = 9;
                break;
              }
              _context2.n = 8;
              return page.$x(selector);
            case 8:
              _elements2 = _context2.v;
              element = _elements2[index] || null;
              _context2.n = 11;
              break;
            case 9:
              _context2.n = 10;
              return page.$$(selector);
            case 10:
              _elements3 = _context2.v;
              element = _elements3[index] || null;
            case 11:
              if (element) {
                _context2.n = 12;
                break;
              }
              throw new Error("\u672A\u627E\u5230\u5339\u914D\u7684\u5143\u7D20: ".concat(selector));
            case 12:
              if (!scrollToElement) {
                _context2.n = 14;
                break;
              }
              _context2.n = 13;
              return element.scrollIntoView();
            case 13:
              _context2.n = 14;
              return page.waitForTimeout(500);
            case 14:
              _context2.n = 15;
              return this.getElementBoundingBox(element);
            case 15:
              elementInfo = _context2.v;
              // 计算带内边距的截图区域
              screenshotClip = _objectSpread2({}, elementInfo);
              if (addPadding && Object.keys(addPadding).length > 0) {
                padding = {
                  top: addPadding.top || 0,
                  right: addPadding.right || 0,
                  bottom: addPadding.bottom || 0,
                  left: addPadding.left || 0
                };
                screenshotClip.x = Math.max(0, screenshotClip.x - padding.left);
                screenshotClip.y = Math.max(0, screenshotClip.y - padding.top);
                screenshotClip.width = screenshotClip.width + padding.left + padding.right;
                screenshotClip.height = screenshotClip.height + padding.top + padding.bottom;
              }

              // 执行元素截图
              screenshotOptions.clip = screenshotClip;
              _context2.n = 16;
              return page.screenshot(screenshotOptions);
            case 16:
              screenshotData = _context2.v;
              return _context2.a(2, {
                data: screenshotData,
                elementInfo: _objectSpread2(_objectSpread2({}, elementInfo), {}, {
                  actualClip: screenshotClip,
                  padding: addPadding
                })
              });
          }
        }, _callee2, this);
      }));
      function screenshotElement(_x2, _x3, _x4, _x5, _x6, _x7) {
        return _screenshotElement.apply(this, arguments);
      }
      return screenshotElement;
    }()
    /**
     * 隐藏指定元素
     * @param {Object} page - 页面对象
     * @param {Array<string>} selectors - 要隐藏的元素选择器数组
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "hideElements",
    value: (function () {
      var _hideElements = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(page, selectors) {
        var _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return page.evaluate(function (selectorList) {
                selectorList.forEach(function (selector) {
                  var elements = document.querySelectorAll(selector);
                  elements.forEach(function (el) {
                    el.style.visibility = 'hidden';
                    el.setAttribute('data-screenshot-hidden', 'true');
                  });
                });
              }, selectors);
            case 1:
              logger.debug("\u5DF2\u9690\u85CF ".concat(selectors.length, " \u79CD\u5143\u7D20"));
              _context3.n = 3;
              break;
            case 2:
              _context3.p = 2;
              _t3 = _context3.v;
              logger.warn('隐藏元素失败:', _t3.message);
            case 3:
              return _context3.a(2);
          }
        }, _callee3, null, [[0, 2]]);
      }));
      function hideElements(_x8, _x9) {
        return _hideElements.apply(this, arguments);
      }
      return hideElements;
    }()
    /**
     * 显示之前隐藏的元素
     * @param {Object} page - 页面对象
     * @param {Array<string>} selectors - 元素选择器数组
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "showElements",
    value: (function () {
      var _showElements = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(page, selectors) {
        var _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return page.evaluate(function () {
                var hiddenElements = document.querySelectorAll('[data-screenshot-hidden="true"]');
                hiddenElements.forEach(function (el) {
                  el.style.visibility = '';
                  el.removeAttribute('data-screenshot-hidden');
                });
              });
            case 1:
              logger.debug('已恢复隐藏的元素');
              _context4.n = 3;
              break;
            case 2:
              _context4.p = 2;
              _t4 = _context4.v;
              logger.warn('恢复隐藏元素失败:', _t4.message);
            case 3:
              return _context4.a(2);
          }
        }, _callee4, null, [[0, 2]]);
      }));
      function showElements(_x0, _x1) {
        return _showElements.apply(this, arguments);
      }
      return showElements;
    }()
    /**
     * 获取元素边界框信息
     * @param {Object} element - 元素对象
     * @returns {Promise<Object>} 边界框信息
     */
    )
  }, {
    key: "getElementBoundingBox",
    value: (function () {
      var _getElementBoundingBox = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(element) {
        var boundingBox, elementInfo, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return element.boundingBox();
            case 1:
              boundingBox = _context5.v;
              if (boundingBox) {
                _context5.n = 2;
                break;
              }
              throw new Error('无法获取元素边界框');
            case 2:
              _context5.n = 3;
              return element.evaluate(function (el) {
                return {
                  tagName: el.tagName.toLowerCase(),
                  id: el.id,
                  className: el.className,
                  text: el.textContent ? el.textContent.trim().substring(0, 100) : ''
                };
              });
            case 3:
              elementInfo = _context5.v;
              return _context5.a(2, _objectSpread2({
                x: Math.round(boundingBox.x),
                y: Math.round(boundingBox.y),
                width: Math.round(boundingBox.width),
                height: Math.round(boundingBox.height)
              }, elementInfo));
            case 4:
              _context5.p = 4;
              _t5 = _context5.v;
              logger.warn('获取元素边界框失败:', _t5.message);
              throw _t5;
            case 5:
              return _context5.a(2);
          }
        }, _callee5, null, [[0, 4]]);
      }));
      function getElementBoundingBox(_x10) {
        return _getElementBoundingBox.apply(this, arguments);
      }
      return getElementBoundingBox;
    }()
    /**
     * 保存截图到文件
     * @param {Buffer} screenshotData - 截图数据
     * @param {string} filePath - 文件路径
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "saveScreenshotToFile",
    value: (function () {
      var _saveScreenshotToFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(screenshotData, filePath) {
        var directory, _t6;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              // 确保目录存在
              directory = path.dirname(filePath);
              _context6.n = 1;
              return fs$1.mkdir(directory, {
                recursive: true
              });
            case 1:
              _context6.n = 2;
              return fs$1.writeFile(filePath, screenshotData);
            case 2:
              _context6.n = 4;
              break;
            case 3:
              _context6.p = 3;
              _t6 = _context6.v;
              logger.error('保存截图文件失败:', _t6);
              throw new Error("\u4FDD\u5B58\u622A\u56FE\u6587\u4EF6\u5931\u8D25: ".concat(_t6.message));
            case 4:
              return _context6.a(2);
          }
        }, _callee6, null, [[0, 3]]);
      }));
      function saveScreenshotToFile(_x11, _x12) {
        return _saveScreenshotToFile.apply(this, arguments);
      }
      return saveScreenshotToFile;
    }()
    /**
     * 获取页面信息
     * @param {Object} page - 页面对象
     * @returns {Promise<Object>} 页面信息
     */
    )
  }, {
    key: "getPageInfo",
    value: (function () {
      var _getPageInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(page) {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              _context7.n = 1;
              return page.evaluate(function () {
                return {
                  url: window.location.href,
                  title: document.title,
                  viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                  },
                  scroll: {
                    x: window.scrollX,
                    y: window.scrollY
                  }
                };
              });
            case 1:
              return _context7.a(2, _context7.v);
            case 2:
              _context7.p = 2;
              _context7.v;
              return _context7.a(2, {
                url: 'unknown',
                title: 'unknown',
                viewport: {
                  width: 0,
                  height: 0
                },
                scroll: {
                  x: 0,
                  y: 0
                }
              });
          }
        }, _callee7, null, [[0, 2]]);
      }));
      function getPageInfo(_x13) {
        return _getPageInfo.apply(this, arguments);
      }
      return getPageInfo;
    }()
    /**
     * 获取工具使用提示
     * @returns {string} 使用提示
     */
    )
  }, {
    key: "getUsageHint",
    value: function getUsageHint() {
      return "\n\u5C4F\u5E55\u622A\u56FE\u5DE5\u5177\u4F7F\u7528\u8BF4\u660E:\n- type: \u53EF\u9009\uFF0C\u622A\u56FE\u7C7B\u578B (fullPage/viewport/element\uFF0C\u9ED8\u8BA4viewport)\n- selector: \u5143\u7D20\u9009\u62E9\u5668\uFF08\u5F53type\u4E3Aelement\u65F6\u5FC5\u9700\uFF09\n- selectorType: \u53EF\u9009\uFF0C\u9009\u62E9\u5668\u7C7B\u578B (css/xpath/auto\uFF0C\u9ED8\u8BA4auto)\n- index: \u53EF\u9009\uFF0C\u5143\u7D20\u7D22\u5F15\uFF08\u9ED8\u8BA40\uFF09\n- format: \u53EF\u9009\uFF0C\u56FE\u7247\u683C\u5F0F (png/jpeg/webp\uFF0C\u9ED8\u8BA4png)\n- quality: \u53EF\u9009\uFF0C\u56FE\u7247\u8D28\u91CF1-100\uFF08\u4EC5JPEG\u548CWebP\uFF0C\u9ED8\u8BA480\uFF09\n- filePath: \u53EF\u9009\uFF0C\u4FDD\u5B58\u6587\u4EF6\u8DEF\u5F84\uFF08\u4E0D\u63D0\u4F9B\u5219\u8FD4\u56DEbase64\uFF09\n- clip: \u53EF\u9009\uFF0C\u81EA\u5B9A\u4E49\u88C1\u526A\u533A\u57DF {x, y, width, height}\n- waitForElement: \u53EF\u9009\uFF0C\u662F\u5426\u7B49\u5F85\u5143\u7D20\u51FA\u73B0\uFF08\u9ED8\u8BA4true\uFF09\n- hideElements: \u53EF\u9009\uFF0C\u8981\u9690\u85CF\u7684\u5143\u7D20\u9009\u62E9\u5668\u6570\u7EC4\n- scrollToElement: \u53EF\u9009\uFF0C\u662F\u5426\u6EDA\u52A8\u5230\u5143\u7D20\uFF08\u9ED8\u8BA4true\uFF09\n- addPadding: \u53EF\u9009\uFF0C\u5143\u7D20\u622A\u56FE\u5185\u8FB9\u8DDD {top, right, bottom, left}\n- retina: \u53EF\u9009\uFF0C\u662F\u5426\u4F7F\u7528\u9AD8\u5206\u8FA8\u7387\uFF08\u9ED8\u8BA4false\uFF09\n- timeout: \u53EF\u9009\uFF0C\u8D85\u65F6\u65F6\u95F41-60\u79D2\uFF08\u9ED8\u8BA410\u79D2\uFF09\n\n\u793A\u4F8B:\n{\n  \"type\": \"viewport\",\n  \"format\": \"png\",\n  \"filePath\": \"./screenshots/page.png\"\n}\n\n{\n  \"type\": \"element\",\n  \"selector\": \".header\",\n  \"format\": \"jpeg\",\n  \"quality\": 90,\n  \"addPadding\": {\"top\": 10, \"bottom\": 10}\n}\n\n{\n  \"type\": \"fullPage\",\n  \"hideElements\": [\".ads\", \".popup\"],\n  \"retina\": true\n}\n    ".trim();
    }
  }]);
}(BaseBrowserTool);

var screenshotTool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ScreenshotTool: ScreenshotTool
});

/**
 * JavaScript执行工具类
 */
var EvaluateTool = /*#__PURE__*/function (_BaseBrowserTool) {
  function EvaluateTool(browserInstance, securityPolicy) {
    _classCallCheck(this, EvaluateTool);
    return _callSuper(this, EvaluateTool, ['evaluate', browserInstance, securityPolicy]);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  _inherits(EvaluateTool, _BaseBrowserTool);
  return _createClass(EvaluateTool, [{
    key: "getParameterSchema",
    value: function getParameterSchema() {
      return {
        type: 'object',
        properties: {
          script: {
            type: 'string',
            description: '要执行的JavaScript代码'
          },
          args: {
            type: 'array',
            description: '传递给脚本的参数数组',
            items: {},
            "default": []
          },
          returnValue: {
            type: 'boolean',
            description: '是否返回执行结果',
            "default": true
          },
          async: {
            type: 'boolean',
            description: '是否为异步脚本',
            "default": false
          },
          timeout: {
            type: 'number',
            description: '执行超时时间（毫秒）',
            "default": 5000,
            minimum: 100,
            maximum: 30000
          },
          sandbox: {
            type: 'boolean',
            description: '是否在沙箱环境中执行',
            "default": true
          },
          allowDangerousAPIs: {
            type: 'boolean',
            description: '是否允许危险的API调用',
            "default": false
          },
          injectLibraries: {
            type: 'array',
            description: '要注入的库名称数组',
            items: {
              type: 'string'
            },
            "default": []
          },
          context: {
            type: 'string',
            description: '执行上下文',
            "enum": ['page', 'element', 'worker'],
            "default": 'page'
          },
          selector: {
            type: 'string',
            description: '元素选择器（当context为element时使用）'
          },
          selectorType: {
            type: 'string',
            description: '选择器类型',
            "enum": ['css', 'xpath', 'auto'],
            "default": 'auto'
          },
          waitForResult: {
            type: 'boolean',
            description: '是否等待执行完成',
            "default": true
          }
        },
        required: ['script'],
        additionalProperties: false
      };
    }

    /**
     * 验证参数
     * @param {Object} params - 工具参数
     * @returns {Object} 验证结果
     */
  }, {
    key: "validateParameters",
    value: function validateParameters(params) {
      var baseValidation = _superPropGet(EvaluateTool, "validateParameters", this, 3)([params]);
      if (!baseValidation.valid) {
        return baseValidation;
      }
      var script = params.script,
        _params$timeout = params.timeout,
        timeout = _params$timeout === void 0 ? 5000 : _params$timeout,
        _params$context = params.context,
        context = _params$context === void 0 ? 'page' : _params$context,
        selector = params.selector,
        _params$injectLibrari = params.injectLibraries,
        injectLibraries = _params$injectLibrari === void 0 ? [] : _params$injectLibrari;

      // 验证脚本内容
      if (!script || typeof script !== 'string') {
        return {
          valid: false,
          error: '脚本内容必须是非空字符串'
        };
      }
      if (script.length > 50000) {
        return {
          valid: false,
          error: '脚本内容长度不能超过50KB'
        };
      }

      // 验证超时时间
      if (timeout < 100 || timeout > 30000) {
        return {
          valid: false,
          error: '超时时间必须在100毫秒到30秒之间'
        };
      }

      // 验证上下文
      if (context === 'element' && !selector) {
        return {
          valid: false,
          error: '使用element上下文时必须提供selector'
        };
      }

      // 验证注入库
      if (injectLibraries.length > 0) {
        var allowedLibraries = ['jquery', 'lodash', 'moment', 'axios'];
        var _iterator = _createForOfIteratorHelper(injectLibraries),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var lib = _step.value;
            if (!allowedLibraries.includes(lib)) {
              return {
                valid: false,
                error: "\u4E0D\u652F\u6301\u7684\u5E93: ".concat(lib, "\u3002\u652F\u6301\u7684\u5E93: ").concat(allowedLibraries.join(', '))
              };
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      // 安全验证
      var securityCheck = this.validateScriptSecurity(script, params.allowDangerousAPIs);
      if (!securityCheck.valid) {
        return securityCheck;
      }
      return {
        valid: true
      };
    }

    /**
     * 验证脚本安全性
     * @param {string} script - 脚本内容
     * @param {boolean} allowDangerousAPIs - 是否允许危险API
     * @returns {Object} 验证结果
     */
  }, {
    key: "validateScriptSecurity",
    value: function validateScriptSecurity(script) {
      var allowDangerousAPIs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // 危险的API和模式列表
      var dangerousPatterns = [/eval\s*\(/, /Function\s*\(/, /setTimeout\s*\(/, /setInterval\s*\(/, /XMLHttpRequest/, /fetch\s*\(/, /import\s*\(/, /require\s*\(/, /process\./, /global\./, /window\.location\s*=/, /document\.write\s*\(/, /innerHTML\s*=/, /outerHTML\s*=/, /execCommand/, /open\s*\(/, /close\s*\(/];
      var maliciousPatterns = [/<script/i, /javascript:/i, /data:text\/html/i, /alert\s*\(/, /confirm\s*\(/, /prompt\s*\(/];

      // 检查恶意模式（始终禁止）
      for (var _i = 0, _maliciousPatterns = maliciousPatterns; _i < _maliciousPatterns.length; _i++) {
        var pattern = _maliciousPatterns[_i];
        if (pattern.test(script)) {
          return {
            valid: false,
            error: "\u811A\u672C\u5305\u542B\u6F5C\u5728\u6076\u610F\u4EE3\u7801: ".concat(pattern.toString())
          };
        }
      }

      // 检查危险API（可配置）
      if (!allowDangerousAPIs) {
        var _iterator2 = _createForOfIteratorHelper(dangerousPatterns),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _pattern = _step2.value;
            if (_pattern.test(script)) {
              return {
                valid: false,
                error: "\u811A\u672C\u5305\u542B\u5371\u9669API: ".concat(_pattern.toString(), "\u3002\u5982\u9700\u4F7F\u7528\uFF0C\u8BF7\u8BBE\u7F6EallowDangerousAPIs\u4E3Atrue")
              };
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      return {
        valid: true
      };
    }

    /**
     * 执行JavaScript代码
     * @param {Object} params - 工具参数
     * @returns {Promise<Object>} 执行结果
     */
  }, {
    key: "executeInternal",
    value: (function () {
      var _executeInternal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(params) {
        var script, _params$args, args, _params$returnValue, returnValue, _params$async, isAsync, _params$timeout2, timeout, _params$sandbox, sandbox, _params$injectLibrari2, injectLibraries, _params$context2, context, selector, _params$selectorType, selectorType, _params$waitForResult, waitForResult, page, startTime, result, executionTime, _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              script = params.script, _params$args = params.args, args = _params$args === void 0 ? [] : _params$args, _params$returnValue = params.returnValue, returnValue = _params$returnValue === void 0 ? true : _params$returnValue, _params$async = params.async, isAsync = _params$async === void 0 ? false : _params$async, _params$timeout2 = params.timeout, timeout = _params$timeout2 === void 0 ? 5000 : _params$timeout2, _params$sandbox = params.sandbox, sandbox = _params$sandbox === void 0 ? true : _params$sandbox, params.allowDangerousAPIs, _params$injectLibrari2 = params.injectLibraries, injectLibraries = _params$injectLibrari2 === void 0 ? [] : _params$injectLibrari2, _params$context2 = params.context, context = _params$context2 === void 0 ? 'page' : _params$context2, selector = params.selector, _params$selectorType = params.selectorType, selectorType = _params$selectorType === void 0 ? 'auto' : _params$selectorType, _params$waitForResult = params.waitForResult, waitForResult = _params$waitForResult === void 0 ? true : _params$waitForResult;
              _context.n = 1;
              return this.browserInstance.getCurrentPage();
            case 1:
              page = _context.v;
              startTime = Date.now();
              _context.p = 2;
              logger.info("\u5F00\u59CB\u6267\u884CJavaScript: \u4E0A\u4E0B\u6587=".concat(context, ", \u5F02\u6B65=").concat(isAsync));

              // 注入依赖库
              if (!(injectLibraries.length > 0)) {
                _context.n = 3;
                break;
              }
              _context.n = 3;
              return this.injectLibraries(page, injectLibraries);
            case 3:
              _t = context;
              _context.n = _t === 'page' ? 4 : _t === 'element' ? 6 : _t === 'worker' ? 8 : 10;
              break;
            case 4:
              _context.n = 5;
              return this.executeInPageContext(page, script, args, {
                returnValue: returnValue,
                isAsync: isAsync,
                timeout: timeout,
                sandbox: sandbox,
                waitForResult: waitForResult
              });
            case 5:
              result = _context.v;
              return _context.a(3, 11);
            case 6:
              _context.n = 7;
              return this.executeInElementContext(page, script, selector, selectorType, args, {
                returnValue: returnValue,
                isAsync: isAsync,
                timeout: timeout,
                sandbox: sandbox,
                waitForResult: waitForResult
              });
            case 7:
              result = _context.v;
              return _context.a(3, 11);
            case 8:
              _context.n = 9;
              return this.executeInWorkerContext(page, script, args, {
                returnValue: returnValue,
                isAsync: isAsync,
                timeout: timeout,
                waitForResult: waitForResult
              });
            case 9:
              result = _context.v;
              return _context.a(3, 11);
            case 10:
              throw new Error("\u4E0D\u652F\u6301\u7684\u6267\u884C\u4E0A\u4E0B\u6587: ".concat(context));
            case 11:
              executionTime = Date.now() - startTime;
              logger.info("JavaScript\u6267\u884C\u5B8C\u6210\uFF0C\u8017\u65F6: ".concat(executionTime, "ms"));
              return _context.a(2, {
                success: true,
                data: {
                  script: script.length > 200 ? script.substring(0, 200) + '...' : script,
                  context: context,
                  selector: selector,
                  result: returnValue ? result : null,
                  executionInfo: {
                    executionTime: executionTime,
                    isAsync: isAsync,
                    sandbox: sandbox,
                    argsCount: args.length,
                    injectedLibraries: injectLibraries
                  },
                  pageInfo: {
                    url: page.url(),
                    timestamp: new Date().toISOString()
                  }
                },
                timestamp: new Date().toISOString(),
                executionTime: executionTime
              });
            case 12:
              _context.p = 12;
              _t2 = _context.v;
              logger.error('JavaScript执行失败:', _t2);
              throw new Error("JavaScript\u6267\u884C\u5931\u8D25: ".concat(_t2.message));
            case 13:
              return _context.a(2);
          }
        }, _callee, this, [[2, 12]]);
      }));
      function executeInternal(_x) {
        return _executeInternal.apply(this, arguments);
      }
      return executeInternal;
    }()
    /**
     * 在页面上下文中执行脚本
     * @param {Object} page - 页面对象
     * @param {string} script - 脚本内容
     * @param {Array} args - 参数数组
     * @param {Object} options - 执行选项
     * @returns {Promise<*>} 执行结果
     */
    )
  }, {
    key: "executeInPageContext",
    value: (function () {
      var _executeInPageContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(page, script, args, options) {
        var returnValue, isAsync, timeout, sandbox;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              returnValue = options.returnValue, isAsync = options.isAsync, timeout = options.timeout, sandbox = options.sandbox, options.waitForResult;
              if (!sandbox) {
                _context2.n = 2;
                break;
              }
              _context2.n = 1;
              return this.executeInSandbox(page, script, args, {
                returnValue: returnValue,
                isAsync: isAsync,
                timeout: timeout
              });
            case 1:
              return _context2.a(2, _context2.v);
            case 2:
              if (!isAsync) {
                _context2.n = 4;
                break;
              }
              _context2.n = 3;
              return page.evaluateHandle.apply(page, [new Function('...args', "return (async () => { ".concat(script, " })(...arguments)"))].concat(_toConsumableArray(args)));
            case 3:
              return _context2.a(2, _context2.v);
            case 4:
              _context2.n = 5;
              return page.evaluate.apply(page, [new Function('...args', script)].concat(_toConsumableArray(args)));
            case 5:
              return _context2.a(2, _context2.v);
            case 6:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function executeInPageContext(_x2, _x3, _x4, _x5) {
        return _executeInPageContext.apply(this, arguments);
      }
      return executeInPageContext;
    }()
    /**
     * 在元素上下文中执行脚本
     * @param {Object} page - 页面对象
     * @param {string} script - 脚本内容
     * @param {string} selector - 元素选择器
     * @param {string} selectorType - 选择器类型
     * @param {Array} args - 参数数组
     * @param {Object} options - 执行选项
     * @returns {Promise<*>} 执行结果
     */
    )
  }, {
    key: "executeInElementContext",
    value: (function () {
      var _executeInElementContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(page, script, selector, selectorType, args, options) {
        var isAsync, timeout, element, elements, _element, _element2;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              options.returnValue, isAsync = options.isAsync, timeout = options.timeout; // 查找元素
              if (!(selectorType === 'xpath')) {
                _context3.n = 3;
                break;
              }
              _context3.n = 1;
              return page.waitForXPath(selector, {
                timeout: timeout
              });
            case 1:
              _context3.n = 2;
              return page.$x(selector);
            case 2:
              elements = _context3.v;
              element = elements[0];
              _context3.n = 6;
              break;
            case 3:
              _context3.n = 4;
              return page.waitForSelector(selector, {
                timeout: timeout
              });
            case 4:
              _context3.n = 5;
              return page.$(selector);
            case 5:
              element = _context3.v;
            case 6:
              if (element) {
                _context3.n = 7;
                break;
              }
              throw new Error("\u672A\u627E\u5230\u5143\u7D20: ".concat(selector));
            case 7:
              if (!isAsync) {
                _context3.n = 9;
                break;
              }
              _context3.n = 8;
              return (_element = element).evaluateHandle.apply(_element, [new Function('element', '...args', "return (async () => { ".concat(script, " })(element, ...arguments)"))].concat(_toConsumableArray(args)));
            case 8:
              return _context3.a(2, _context3.v);
            case 9:
              _context3.n = 10;
              return (_element2 = element).evaluate.apply(_element2, [new Function('element', '...args', script)].concat(_toConsumableArray(args)));
            case 10:
              return _context3.a(2, _context3.v);
            case 11:
              return _context3.a(2);
          }
        }, _callee3);
      }));
      function executeInElementContext(_x6, _x7, _x8, _x9, _x0, _x1) {
        return _executeInElementContext.apply(this, arguments);
      }
      return executeInElementContext;
    }()
    /**
     * 在Worker上下文中执行脚本
     * @param {Object} page - 页面对象
     * @param {string} script - 脚本内容
     * @param {Array} args - 参数数组
     * @param {Object} options - 执行选项
     * @returns {Promise<*>} 执行结果
     */
    )
  }, {
    key: "executeInWorkerContext",
    value: (function () {
      var _executeInWorkerContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(page, script, args, options) {
        var timeout, workerScript, result;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              options.returnValue, timeout = options.timeout; // 创建Web Worker执行脚本
              workerScript = "\n      self.onmessage = function(e) {\n        try {\n          const args = e.data.args;\n          const result = (function(...args) { \n            ".concat(script, " \n          })(...args);\n          \n          self.postMessage({ \n            success: true, \n            result: result \n          });\n        } catch (error) {\n          self.postMessage({ \n            success: false, \n            error: error.message \n          });\n        }\n      };\n    ");
              _context4.n = 1;
              return page.evaluate(function (workerCode, scriptArgs, timeoutMs) {
                return new Promise(function (resolve, reject) {
                  var blob = new Blob([workerCode], {
                    type: 'application/javascript'
                  });
                  var worker = new Worker(URL.createObjectURL(blob));
                  var timeoutId = setTimeout(function () {
                    worker.terminate();
                    reject(new Error('Worker执行超时'));
                  }, timeoutMs);
                  worker.onmessage = function (e) {
                    clearTimeout(timeoutId);
                    worker.terminate();
                    if (e.data.success) {
                      resolve(e.data.result);
                    } else {
                      reject(new Error(e.data.error));
                    }
                  };
                  worker.onerror = function (error) {
                    clearTimeout(timeoutId);
                    worker.terminate();
                    reject(new Error('Worker执行错误: ' + error.message));
                  };
                  worker.postMessage({
                    args: scriptArgs
                  });
                });
              }, workerScript, args, timeout);
            case 1:
              result = _context4.v;
              return _context4.a(2, result);
          }
        }, _callee4);
      }));
      function executeInWorkerContext(_x10, _x11, _x12, _x13) {
        return _executeInWorkerContext.apply(this, arguments);
      }
      return executeInWorkerContext;
    }()
    /**
     * 在沙箱中执行脚本
     * @param {Object} page - 页面对象
     * @param {string} script - 脚本内容
     * @param {Array} args - 参数数组
     * @param {Object} options - 执行选项
     * @returns {Promise<*>} 执行结果
     */
    )
  }, {
    key: "executeInSandbox",
    value: (function () {
      var _executeInSandbox = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(page, script, args, options) {
        var isAsync, sandboxScript;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              options.returnValue, isAsync = options.isAsync, options.timeout; // 创建沙箱环境
              sandboxScript = "\n      (function() {\n        'use strict';\n        \n        // \u521B\u5EFA\u53D7\u9650\u7684\u5168\u5C40\u5BF9\u8C61\n        const sandbox = {\n          console: console,\n          Math: Math,\n          Date: Date,\n          JSON: JSON,\n          Object: Object,\n          Array: Array,\n          String: String,\n          Number: Number,\n          Boolean: Boolean,\n          RegExp: RegExp,\n          Error: Error,\n          TypeError: TypeError,\n          ReferenceError: ReferenceError,\n          // \u5141\u8BB8\u7684DOM\u8BBF\u95EE\n          document: {\n            querySelector: document.querySelector.bind(document),\n            querySelectorAll: document.querySelectorAll.bind(document),\n            getElementById: document.getElementById.bind(document),\n            getElementsByClassName: document.getElementsByClassName.bind(document),\n            getElementsByTagName: document.getElementsByTagName.bind(document)\n          },\n          window: {\n            innerWidth: window.innerWidth,\n            innerHeight: window.innerHeight,\n            location: {\n              href: window.location.href,\n              host: window.location.host,\n              pathname: window.location.pathname\n            }\n          }\n        };\n\n        // \u5728\u6C99\u7BB1\u4E2D\u6267\u884C\u7528\u6237\u811A\u672C\n        const userFunction = new Function('sandbox', '...args', \n          'with (sandbox) { return (' + ".concat(JSON.stringify(isAsync ? 'async ' : ''), " + 'function() { ' + \n          ").concat(JSON.stringify(script), " + ' })(); }'\n        );\n\n        return userFunction(sandbox, ...arguments);\n      })\n    ");
              if (!isAsync) {
                _context5.n = 2;
                break;
              }
              _context5.n = 1;
              return page.evaluate.apply(page, [sandboxScript].concat(_toConsumableArray(args)));
            case 1:
              return _context5.a(2, _context5.v);
            case 2:
              _context5.n = 3;
              return page.evaluate.apply(page, [sandboxScript].concat(_toConsumableArray(args)));
            case 3:
              return _context5.a(2, _context5.v);
            case 4:
              return _context5.a(2);
          }
        }, _callee5);
      }));
      function executeInSandbox(_x14, _x15, _x16, _x17) {
        return _executeInSandbox.apply(this, arguments);
      }
      return executeInSandbox;
    }()
    /**
     * 注入依赖库
     * @param {Object} page - 页面对象
     * @param {Array<string>} libraries - 库名称数组
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "injectLibraries",
    value: (function () {
      var _injectLibraries = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(page, libraries) {
        var libraryUrls, _iterator3, _step3, lib, _t3, _t4;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              libraryUrls = {
                jquery: 'https://code.jquery.com/jquery-3.6.0.min.js',
                lodash: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
                moment: 'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js',
                axios: 'https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js'
              };
              _iterator3 = _createForOfIteratorHelper(libraries);
              _context6.p = 1;
              _iterator3.s();
            case 2:
              if ((_step3 = _iterator3.n()).done) {
                _context6.n = 7;
                break;
              }
              lib = _step3.value;
              if (!libraryUrls[lib]) {
                _context6.n = 6;
                break;
              }
              _context6.p = 3;
              _context6.n = 4;
              return page.addScriptTag({
                url: libraryUrls[lib]
              });
            case 4:
              logger.debug("\u5DF2\u6CE8\u5165\u5E93: ".concat(lib));
              _context6.n = 6;
              break;
            case 5:
              _context6.p = 5;
              _t3 = _context6.v;
              logger.warn("\u6CE8\u5165\u5E93 ".concat(lib, " \u5931\u8D25:"), _t3.message);
            case 6:
              _context6.n = 2;
              break;
            case 7:
              _context6.n = 9;
              break;
            case 8:
              _context6.p = 8;
              _t4 = _context6.v;
              _iterator3.e(_t4);
            case 9:
              _context6.p = 9;
              _iterator3.f();
              return _context6.f(9);
            case 10:
              return _context6.a(2);
          }
        }, _callee6, null, [[3, 5], [1, 8, 9, 10]]);
      }));
      function injectLibraries(_x18, _x19) {
        return _injectLibraries.apply(this, arguments);
      }
      return injectLibraries;
    }()
    /**
     * 获取工具使用提示
     * @returns {string} 使用提示
     */
    )
  }, {
    key: "getUsageHint",
    value: function getUsageHint() {
      return "\nJavaScript\u6267\u884C\u5DE5\u5177\u4F7F\u7528\u8BF4\u660E:\n- script: \u5FC5\u9700\uFF0C\u8981\u6267\u884C\u7684JavaScript\u4EE3\u7801\n- args: \u53EF\u9009\uFF0C\u4F20\u9012\u7ED9\u811A\u672C\u7684\u53C2\u6570\u6570\u7EC4\n- returnValue: \u53EF\u9009\uFF0C\u662F\u5426\u8FD4\u56DE\u6267\u884C\u7ED3\u679C\uFF08\u9ED8\u8BA4true\uFF09\n- async: \u53EF\u9009\uFF0C\u662F\u5426\u4E3A\u5F02\u6B65\u811A\u672C\uFF08\u9ED8\u8BA4false\uFF09\n- timeout: \u53EF\u9009\uFF0C\u6267\u884C\u8D85\u65F6\u65F6\u95F4100-30000\u6BEB\u79D2\uFF08\u9ED8\u8BA45000\uFF09\n- sandbox: \u53EF\u9009\uFF0C\u662F\u5426\u5728\u6C99\u7BB1\u73AF\u5883\u4E2D\u6267\u884C\uFF08\u9ED8\u8BA4true\uFF09\n- allowDangerousAPIs: \u53EF\u9009\uFF0C\u662F\u5426\u5141\u8BB8\u5371\u9669API\uFF08\u9ED8\u8BA4false\uFF09\n- injectLibraries: \u53EF\u9009\uFF0C\u8981\u6CE8\u5165\u7684\u5E93 ['jquery', 'lodash', 'moment', 'axios']\n- context: \u53EF\u9009\uFF0C\u6267\u884C\u4E0A\u4E0B\u6587 (page/element/worker\uFF0C\u9ED8\u8BA4page)\n- selector: \u5143\u7D20\u9009\u62E9\u5668\uFF08\u5F53context\u4E3Aelement\u65F6\u4F7F\u7528\uFF09\n- selectorType: \u53EF\u9009\uFF0C\u9009\u62E9\u5668\u7C7B\u578B (css/xpath/auto\uFF0C\u9ED8\u8BA4auto)\n- waitForResult: \u53EF\u9009\uFF0C\u662F\u5426\u7B49\u5F85\u6267\u884C\u5B8C\u6210\uFF08\u9ED8\u8BA4true\uFF09\n\n\u793A\u4F8B:\n{\n  \"script\": \"return document.title;\",\n  \"returnValue\": true\n}\n\n{\n  \"script\": \"console.log('Hello', name); return name.toUpperCase();\",\n  \"args\": [\"World\"],\n  \"sandbox\": false\n}\n\n{\n  \"script\": \"this.style.backgroundColor = 'yellow'; return this.tagName;\",\n  \"context\": \"element\",\n  \"selector\": \".highlight\"\n}\n\n{\n  \"script\": \"const result = []; for(let i = 0; i < 1000000; i++) { result.push(i); } return result.length;\",\n  \"context\": \"worker\",\n  \"timeout\": 10000\n}\n\n\u5B89\u5168\u9650\u5236:\n- \u6C99\u7BB1\u6A21\u5F0F\u4E0B\u7981\u6B62\u8BBF\u95EE\u5371\u9669API\n- \u9ED8\u8BA4\u7981\u6B62eval\u3001setTimeout\u3001fetch\u7B49\n- \u811A\u672C\u957F\u5EA6\u9650\u523650KB\n- \u6267\u884C\u65F6\u95F4\u9650\u523630\u79D2\n    ".trim();
    }
  }]);
}(BaseBrowserTool);

var evaluateTool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  EvaluateTool: EvaluateTool
});

// 浏览器工具常量定义（参考 codex 的本地工具命名）
var BROWSER_TOOLS = {
  NAVIGATE: 'browser.navigate',
  CLICK: 'browser.click',
  EXTRACT: 'browser.extract',
  TYPE: 'browser.type',
  SCREENSHOT: 'browser.screenshot',
  EVALUATE: 'browser.evaluate'
};

// 浏览器引擎类型
var BROWSER_ENGINES = {
  PUPPETEER: 'puppeteer',
  PLAYWRIGHT: 'playwright'
};

// 工具执行状态
var TOOL_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
  TIMEOUT: 'timeout'
};

/**
 * 创建浏览器工具管理器
 * @param {Object} config - 配置选项
 * @returns {BrowserToolManager} 浏览器工具管理器实例
 */
function createBrowserToolManager(config) {
  return new BrowserToolManager(config);
}

/**
 * 获取支持的工具列表
 * @returns {Array} 工具定义列表
 */
function getSupportedTools() {
  return [{
    name: BROWSER_TOOLS.NAVIGATE,
    description: 'Navigate to a web page and optionally wait for specific elements',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Target URL to navigate to'
        },
        waitFor: {
          type: 'string',
          description: 'CSS selector to wait for (optional)'
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          "default": 30000
        },
        viewport: {
          type: 'object',
          description: 'Viewport configuration',
          properties: {
            width: {
              type: 'number',
              "default": 1920
            },
            height: {
              type: 'number',
              "default": 1080
            }
          }
        }
      },
      required: ['url']
    }
  }, {
    name: BROWSER_TOOLS.CLICK,
    description: 'Click on an element specified by selector',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'CSS selector or XPath'
        },
        waitForSelector: {
          type: 'boolean',
          description: 'Wait for element to appear',
          "default": true
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          "default": 30000
        },
        button: {
          type: 'string',
          description: 'Mouse button',
          "enum": ['left', 'right', 'middle'],
          "default": 'left'
        }
      },
      required: ['selector']
    }
  }, {
    name: BROWSER_TOOLS.EXTRACT,
    description: 'Extract content from the current page',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'CSS selector for content extraction'
        },
        attribute: {
          type: 'string',
          description: 'Attribute to extract',
          "default": 'text'
        },
        multiple: {
          type: 'boolean',
          description: 'Extract multiple elements',
          "default": false
        },
        format: {
          type: 'string',
          description: 'Output format',
          "enum": ['text', 'json', 'html'],
          "default": 'text'
        }
      },
      required: ['selector']
    }
  }, {
    name: BROWSER_TOOLS.TYPE,
    description: 'Type text into an input element',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Input element selector'
        },
        text: {
          type: 'string',
          description: 'Text to type'
        },
        clear: {
          type: 'boolean',
          description: 'Clear input before typing',
          "default": true
        },
        delay: {
          type: 'number',
          description: 'Typing delay in milliseconds',
          "default": 0
        }
      },
      required: ['selector', 'text']
    }
  }, {
    name: BROWSER_TOOLS.SCREENSHOT,
    description: 'Take a screenshot of the current page or specific element',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Element selector (optional, defaults to full page)'
        },
        format: {
          type: 'string',
          description: 'Image format',
          "enum": ['png', 'jpeg'],
          "default": 'png'
        },
        quality: {
          type: 'number',
          description: 'Image quality (1-100)',
          "default": 90
        },
        fullPage: {
          type: 'boolean',
          description: 'Capture full page',
          "default": true
        }
      }
    }
  }, {
    name: BROWSER_TOOLS.EVALUATE,
    description: 'Execute JavaScript code in the browser context',
    parameters: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'JavaScript code to execute'
        },
        args: {
          type: 'array',
          description: 'Arguments to pass to the code',
          "default": []
        },
        timeout: {
          type: 'number',
          description: 'Execution timeout in milliseconds',
          "default": 30000
        },
        returnType: {
          type: 'string',
          description: 'Return value type',
          "enum": ['json', 'text', 'binary'],
          "default": 'json'
        }
      },
      required: ['code']
    }
  }];
}

/**
 * 创建浏览器实例池
 * @param {Object} config - 配置选项
 * @returns {BrowserInstancePool} 浏览器实例池
 */
function createBrowserInstancePool(config) {
  return new BrowserInstancePool(config);
}

/**
 * 创建浏览器工具监控器
 * @param {Object} config - 配置选项
 * @returns {BrowserToolMonitor} 浏览器工具监控器
 */
function createBrowserToolMonitor(config) {
  return new BrowserToolMonitor(config);
}

/**
 * 创建浏览器工具链
 * @param {BrowserToolManager} toolManager - 工具管理器
 * @param {Object} config - 配置选项
 * @returns {BrowserToolChain} 浏览器工具链
 */
function createBrowserToolChain(toolManager, config) {
  return new BrowserToolChain(toolManager, config);
}

/**
 * 创建完整的浏览器工具系统
 * @param {Object} config - 配置选项
 * @returns {Object} 完整的浏览器工具系统
 */
function createBrowserToolSystem() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var toolManager = new BrowserToolManager(config);
  var toolChain = new BrowserToolChain(toolManager, config.toolChain);
  return {
    toolManager: toolManager,
    toolChain: toolChain,
    instancePool: toolManager.instancePool,
    monitor: toolManager.monitor,
    initialize: function initialize() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return toolManager.initialize();
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }))();
    },
    cleanup: function cleanup() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return toolManager.cleanup();
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }))();
    },
    getStats: function getStats() {
      return {
        toolManager: toolManager.getMetrics(),
        toolChain: toolChain.getStats()
      };
    }
  };
}

/**
 * MCP 浏览器服务器类
 */
var MCPBrowserServer = /*#__PURE__*/function () {
  function MCPBrowserServer() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, MCPBrowserServer);
    this.config = _objectSpread2({
      headless: false,
      devtools: true,
      timeout: 30000
    }, config);
    this.server = new index_js$1.Server({
      name: 'browser-automation-server',
      version: '1.0.0',
      description: '浏览器自动化 MCP 服务器，支持页面导航、内容提取、元素交互等功能'
    }, {
      capabilities: {
        tools: {}
      }
    });
    this.toolSystem = null;
    this.setupHandlers();
  }

  /**
   * 设置 MCP 处理器
   */
  return _createClass(MCPBrowserServer, [{
    key: "setupHandlers",
    value: function setupHandlers() {
      var _this = this;
      // 工具列表处理器
      this.server.setRequestHandler(types_js.ListToolsRequestSchema, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              return _context.a(2, {
                tools: [{
                  name: 'browser_navigate',
                  description: '导航到指定URL',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      url: {
                        type: 'string',
                        description: '要导航到的URL'
                      },
                      waitFor: {
                        type: 'string',
                        description: '等待的CSS选择器（可选）'
                      },
                      timeout: {
                        type: 'number',
                        description: '超时时间（毫秒）',
                        "default": 30000
                      }
                    },
                    required: ['url']
                  }
                }, {
                  name: 'browser_extract',
                  description: '从页面提取内容',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      selector: {
                        type: 'string',
                        description: 'CSS选择器'
                      },
                      attribute: {
                        type: 'string',
                        description: '要提取的属性',
                        "default": 'text'
                      },
                      multiple: {
                        type: 'boolean',
                        description: '是否提取多个元素',
                        "default": false
                      }
                    },
                    required: ['selector']
                  }
                }, {
                  name: 'browser_click',
                  description: '点击页面元素',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      selector: {
                        type: 'string',
                        description: 'CSS选择器'
                      },
                      waitForSelector: {
                        type: 'boolean',
                        description: '是否等待元素出现',
                        "default": true
                      },
                      timeout: {
                        type: 'number',
                        description: '超时时间（毫秒）',
                        "default": 30000
                      }
                    },
                    required: ['selector']
                  }
                }, {
                  name: 'browser_type',
                  description: '在输入框中输入文本',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      selector: {
                        type: 'string',
                        description: '输入框的CSS选择器'
                      },
                      text: {
                        type: 'string',
                        description: '要输入的文本'
                      },
                      clear: {
                        type: 'boolean',
                        description: '输入前是否清空',
                        "default": true
                      }
                    },
                    required: ['selector', 'text']
                  }
                }, {
                  name: 'browser_screenshot',
                  description: '截取页面截图',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      selector: {
                        type: 'string',
                        description: '元素选择器（可选，截取特定元素）'
                      },
                      format: {
                        type: 'string',
                        description: '图片格式',
                        "enum": ['png', 'jpeg'],
                        "default": 'png'
                      },
                      quality: {
                        type: 'number',
                        description: '图片质量（1-100）',
                        "default": 90
                      },
                      fullPage: {
                        type: 'boolean',
                        description: '是否截取整页',
                        "default": false
                      }
                    }
                  }
                }, {
                  name: 'browser_evaluate',
                  description: '在页面中执行JavaScript代码',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        description: '要执行的JavaScript代码'
                      },
                      timeout: {
                        type: 'number',
                        description: '执行超时时间（毫秒）',
                        "default": 30000
                      }
                    },
                    required: ['code']
                  }
                }, {
                  name: 'browser_get_url',
                  description: '获取当前页面URL',
                  inputSchema: {
                    type: 'object',
                    properties: {}
                  }
                }]
              });
          }
        }, _callee);
      })));

      // 工具调用处理器
      this.server.setRequestHandler(types_js.CallToolRequestSchema, /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(request) {
          var _request$params, name, args, result, _t, _t2;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.p = _context2.n) {
              case 0:
                _request$params = request.params, name = _request$params.name, args = _request$params.arguments;
                _context2.p = 1;
                if (_this.toolSystem) {
                  _context2.n = 2;
                  break;
                }
                _context2.n = 2;
                return _this.initializeBrowserSystem();
              case 2:
                _t = name;
                _context2.n = _t === 'browser_navigate' ? 3 : _t === 'browser_extract' ? 5 : _t === 'browser_click' ? 7 : _t === 'browser_type' ? 9 : _t === 'browser_screenshot' ? 11 : _t === 'browser_evaluate' ? 13 : _t === 'browser_get_url' ? 15 : 17;
                break;
              case 3:
                _context2.n = 4;
                return _this.toolSystem.toolManager.executeTool('browser.navigate', args);
              case 4:
                result = _context2.v;
                return _context2.a(3, 18);
              case 5:
                _context2.n = 6;
                return _this.toolSystem.toolManager.executeTool('browser.extract', args);
              case 6:
                result = _context2.v;
                return _context2.a(3, 18);
              case 7:
                _context2.n = 8;
                return _this.toolSystem.toolManager.executeTool('browser.click', args);
              case 8:
                result = _context2.v;
                return _context2.a(3, 18);
              case 9:
                _context2.n = 10;
                return _this.toolSystem.toolManager.executeTool('browser.type', args);
              case 10:
                result = _context2.v;
                return _context2.a(3, 18);
              case 11:
                _context2.n = 12;
                return _this.toolSystem.toolManager.executeTool('browser.screenshot', args);
              case 12:
                result = _context2.v;
                return _context2.a(3, 18);
              case 13:
                _context2.n = 14;
                return _this.toolSystem.toolManager.executeTool('browser.evaluate', args);
              case 14:
                result = _context2.v;
                return _context2.a(3, 18);
              case 15:
                _context2.n = 16;
                return _this.getCurrentUrl();
              case 16:
                result = _context2.v;
                return _context2.a(3, 18);
              case 17:
                throw new Error("\u672A\u77E5\u7684\u5DE5\u5177: ".concat(name));
              case 18:
                return _context2.a(2, {
                  content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                  }]
                });
              case 19:
                _context2.p = 19;
                _t2 = _context2.v;
                return _context2.a(2, {
                  content: [{
                    type: 'text',
                    text: JSON.stringify({
                      success: false,
                      error: _t2.message,
                      stack: _t2.stack
                    }, null, 2)
                  }],
                  isError: true
                });
            }
          }, _callee2, null, [[1, 19]]);
        }));
        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
    }

    /**
     * 初始化浏览器工具系统
     */
  }, {
    key: "initializeBrowserSystem",
    value: (function () {
      var _initializeBrowserSystem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              this.toolSystem = createBrowserToolSystem(this.config);
              _context3.n = 1;
              return this.toolSystem.initialize();
            case 1:
              console.error('🚀 浏览器工具系统已初始化');
            case 2:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function initializeBrowserSystem() {
        return _initializeBrowserSystem.apply(this, arguments);
      }
      return initializeBrowserSystem;
    }()
    /**
     * 获取当前页面URL
     */
    )
  }, {
    key: "getCurrentUrl",
    value: (function () {
      var _getCurrentUrl = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              if (this.toolSystem) {
                _context4.n = 1;
                break;
              }
              throw new Error('浏览器工具系统未初始化');
            case 1:
              _context4.n = 2;
              return this.toolSystem.toolManager.executeTool('browser.evaluate', {
                code: 'return window.location.href;'
              });
            case 2:
              return _context4.a(2, _context4.v);
          }
        }, _callee4, this);
      }));
      function getCurrentUrl() {
        return _getCurrentUrl.apply(this, arguments);
      }
      return getCurrentUrl;
    }()
    /**
     * 启动服务器
     */
    )
  }, {
    key: "start",
    value: (function () {
      var _start = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var transport;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              transport = new stdio_js$1.StdioServerTransport();
              _context5.n = 1;
              return this.server.connect(transport);
            case 1:
              console.error('🔧 MCP 浏览器服务器已启动');
            case 2:
              return _context5.a(2);
          }
        }, _callee5, this);
      }));
      function start() {
        return _start.apply(this, arguments);
      }
      return start;
    }()
    /**
     * 停止服务器
     */
    )
  }, {
    key: "stop",
    value: (function () {
      var _stop = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              if (!this.toolSystem) {
                _context6.n = 1;
                break;
              }
              _context6.n = 1;
              return this.toolSystem.cleanup();
            case 1:
              _context6.n = 2;
              return this.server.close();
            case 2:
              console.error('🛑 MCP 浏览器服务器已停止');
            case 3:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function stop() {
        return _stop.apply(this, arguments);
      }
      return stop;
    }())
  }]);
}();

/**
 * 创建并启动 MCP 浏览器服务器
 */
function createMCPBrowserServer() {
  return _createMCPBrowserServer.apply(this, arguments);
}

/**
 * 命令行启动入口
 */
function _createMCPBrowserServer() {
  _createMCPBrowserServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var config,
      server,
      _args7 = arguments;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          config = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
          server = new MCPBrowserServer(config);
          return _context7.a(2, server);
      }
    }, _callee7);
  }));
  return _createMCPBrowserServer.apply(this, arguments);
}
function startMCPBrowserServer() {
  return _startMCPBrowserServer.apply(this, arguments);
}
function _startMCPBrowserServer() {
  _startMCPBrowserServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var server;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          server = new MCPBrowserServer({
            headless: process.env.HEADLESS !== 'false',
            devtools: process.env.DEVTOOLS === 'true'
          }); // 处理进程退出
          process.on('SIGINT', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
            return _regenerator().w(function (_context8) {
              while (1) switch (_context8.n) {
                case 0:
                  console.error('🔄 收到退出信号，正在关闭服务器...');
                  _context8.n = 1;
                  return server.stop();
                case 1:
                  process.exit(0);
                case 2:
                  return _context8.a(2);
              }
            }, _callee8);
          })));
          _context9.n = 1;
          return server.start();
        case 1:
          return _context9.a(2);
      }
    }, _callee9);
  }));
  return _startMCPBrowserServer.apply(this, arguments);
}

var _excluded = ["llm", "mcp", "prompt", "preset"];

// 预设配置，适配日志等级
var PRESET_CONFIGS = {
  basic: {
    name: 'basic',
    description: '基础配置',
    logger: new Logger('info')
  },
  performance: {
    name: 'performance',
    description: '性能优化配置',
    logger: new Logger('warn')
  },
  debug: {
    name: 'debug',
    description: '调试配置',
    logger: new Logger('debug')
  }
};

// AgentCore 主类
var AgentCore = /*#__PURE__*/function (_EventEmitter) {
  function AgentCore() {
    var _this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, AgentCore);
    _this = _callSuper(this, AgentCore);
    _this.config = config;
    _this.initialized = false;
    _this.llm = null; // LLM 实例
    _this.promptBuilder = null; // Prompt 构建器
    _this.mcpSystem = null; // MCP 系统
    _this.browserToolManager = null; // 浏览器工具管理器
    return _this;
  }
  _inherits(AgentCore, _EventEmitter);
  return _createClass(AgentCore, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this2 = this;
        var _yield$import, PromptBuilder, _i, _Object$entries, _Object$entries$_i, name, template, _yield$import2, LLM, LLMFactory, _yield$import3, createMCPSystem, _yield$import4, BrowserToolManager, browserTools, _iterator, _step, tool, _t, _t2, _t3;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              this.initialized = true;

              // 初始化 Prompt 构建器
              if (!this.config.prompt) {
                _context.n = 2;
                break;
              }
              _context.n = 1;
              return Promise.resolve().then(function () { return index$2; });
            case 1:
              _yield$import = _context.v;
              PromptBuilder = _yield$import.PromptBuilder;
              this.promptBuilder = new PromptBuilder(this.config.prompt);

              // 注册自定义模板
              if (this.config.prompt.customTemplates) {
                for (_i = 0, _Object$entries = Object.entries(this.config.prompt.customTemplates); _i < _Object$entries.length; _i++) {
                  _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), name = _Object$entries$_i[0], template = _Object$entries$_i[1];
                  this.promptBuilder.registerTemplate(name, template);
                }
              }
            case 2:
              if (!this.config.llm) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return Promise.resolve().then(function () { return index$3; });
            case 3:
              _yield$import2 = _context.v;
              LLM = _yield$import2.LLM;
              LLMFactory = _yield$import2.LLMFactory;
              if (this.config.llm.provider && LLMFactory.getProviders().includes(this.config.llm.provider)) {
                // 使用工厂模式创建已注册的提供商
                this.llm = LLMFactory.create(this.config.llm.provider, this.config.llm.options);
              } else if (this.config.llm.requestHandler) {
                // 直接使用配置创建
                this.llm = new LLM(this.config.llm);
              } else {
                // 兼容旧版本配置或自定义处理器
                this.llm = new LLM({
                  requestHandler: this.config.llm.requestImpl || this.config.llm.requestHandler,
                  provider: this.config.llm.provider || 'custom',
                  options: this.config.llm.options || {}
                });
              }
            case 4:
              if (!this.config.mcp) {
                _context.n = 9;
                break;
              }
              _context.n = 5;
              return Promise.resolve().then(function () { return index$1; });
            case 5:
              _yield$import3 = _context.v;
              createMCPSystem = _yield$import3.createMCPSystem;
              _context.p = 6;
              _context.n = 7;
              return createMCPSystem({
                servers: this.config.mcp.servers || [],
                manager: this.config.mcp.manager || {},
                toolSystem: this.config.mcp.toolSystem || {}
              });
            case 7:
              this.mcpSystem = _context.v;
              // 监听 MCP 事件
              this.mcpSystem.connectionManager.on('connectionStatusChanged', function (name, status) {
                _this2.emit('mcpConnectionChanged', {
                  name: name,
                  status: status
                });
              });
              this.mcpSystem.toolSystem.on('toolCalled', function (event) {
                _this2.emit('mcpToolCalled', event);
              });
              _context.n = 9;
              break;
            case 8:
              _context.p = 8;
              _t = _context.v;
              console.warn('MCP 系统初始化失败:', _t.message);
              this.mcpSystem = null;
            case 9:
              if (!(this.config.browser && this.config.browser.enabled)) {
                _context.n = 21;
                break;
              }
              _context.n = 10;
              return Promise.resolve().then(function () { return toolManager; });
            case 10:
              _yield$import4 = _context.v;
              BrowserToolManager = _yield$import4.BrowserToolManager;
              _context.p = 11;
              this.browserToolManager = new BrowserToolManager(this.config.browser);

              // 监听浏览器工具事件
              this.browserToolManager.on('initialized', function () {
                _this2.emit('browserToolsReady');
              });
              this.browserToolManager.on('toolExecuted', function (event) {
                _this2.emit('browserToolExecuted', event);
              });
              this.browserToolManager.on('error', function (error) {
                _this2.emit('browserToolError', error);
              });

              // 初始化浏览器工具管理器
              _context.n = 12;
              return this.browserToolManager.initialize();
            case 12:
              if (!(this.mcpSystem && this.mcpSystem.toolSystem)) {
                _context.n = 19;
                break;
              }
              browserTools = this.browserToolManager.getToolDefinitions();
              _iterator = _createForOfIteratorHelper(browserTools);
              _context.p = 13;
              _iterator.s();
            case 14:
              if ((_step = _iterator.n()).done) {
                _context.n = 16;
                break;
              }
              tool = _step.value;
              _context.n = 15;
              return this.mcpSystem.toolSystem.registerLocalTool(tool.name, tool);
            case 15:
              _context.n = 14;
              break;
            case 16:
              _context.n = 18;
              break;
            case 17:
              _context.p = 17;
              _t2 = _context.v;
              _iterator.e(_t2);
            case 18:
              _context.p = 18;
              _iterator.f();
              return _context.f(18);
            case 19:
              _context.n = 21;
              break;
            case 20:
              _context.p = 20;
              _t3 = _context.v;
              console.warn('浏览器工具系统初始化失败:', _t3.message);
              this.browserToolManager = null;
            case 21:
              return _context.a(2);
          }
        }, _callee, this, [[13, 17, 18, 19], [11, 20], [6, 8]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
  }, {
    key: "execute",
    value: function () {
      var _execute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(task) {
        var processedTask, prompt, llmResult, _processedTask, toolName, _processedTask$args, args, callId, toolResult, _processedTask2, _toolName, _processedTask2$args, _args2, _callId, _toolResult, _processedTask3, _toolName2, _processedTask3$args, _args3, _processedTask3$optio, _options, _toolResult2, _processedTask4, toolChain, _processedTask4$initi, initialData, _processedTask4$optio, _options2, chainResult, _t4, _t5, _t6, _t7;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              if (this.initialized) {
                _context2.n = 1;
                break;
              }
              throw new Error('AgentCore 未初始化，请先调用 initialize()');
            case 1:
              processedTask = task; // 1. 构建 prompt（如果任务需要）
              if (task.buildPrompt && this.promptBuilder) {
                prompt = this.promptBuilder.build(task.buildPrompt);
                processedTask = _objectSpread2(_objectSpread2({}, task), {}, {
                  payload: _objectSpread2(_objectSpread2({}, task.payload), {}, {
                    messages: prompt.messages
                  })
                });
              }

              // 2. LLM 处理
              if (!(processedTask.type === 'llm' && this.llm)) {
                _context2.n = 5;
                break;
              }
              _context2.n = 2;
              return this.llm.post(processedTask.payload);
            case 2:
              llmResult = _context2.v;
              if (!(processedTask.onComplete && typeof processedTask.onComplete === 'function')) {
                _context2.n = 4;
                break;
              }
              _context2.n = 3;
              return processedTask.onComplete(llmResult, this);
            case 3:
              return _context2.a(2, _context2.v);
            case 4:
              return _context2.a(2, llmResult);
            case 5:
              if (!(processedTask.type === 'browser_tool' && this.browserToolManager)) {
                _context2.n = 13;
                break;
              }
              _processedTask = processedTask, toolName = _processedTask.toolName, _processedTask$args = _processedTask.args, args = _processedTask$args === void 0 ? {} : _processedTask$args, callId = _processedTask.callId, _processedTask.options;
              _context2.p = 6;
              _context2.n = 7;
              return this.browserToolManager.executeLocalTool(toolName, args, callId);
            case 7:
              toolResult = _context2.v;
              if (!(processedTask.onComplete && typeof processedTask.onComplete === 'function')) {
                _context2.n = 9;
                break;
              }
              _context2.n = 8;
              return processedTask.onComplete(toolResult, this);
            case 8:
              return _context2.a(2, _context2.v);
            case 9:
              return _context2.a(2, toolResult);
            case 10:
              _context2.p = 10;
              _t4 = _context2.v;
              if (!(processedTask.onError && typeof processedTask.onError === 'function')) {
                _context2.n = 12;
                break;
              }
              _context2.n = 11;
              return processedTask.onError(_t4, this);
            case 11:
              return _context2.a(2, _context2.v);
            case 12:
              throw _t4;
            case 13:
              if (!(processedTask.type === 'tool_call')) {
                _context2.n = 21;
                break;
              }
              _processedTask2 = processedTask, _toolName = _processedTask2.toolName, _processedTask2$args = _processedTask2.args, _args2 = _processedTask2$args === void 0 ? {} : _processedTask2$args, _callId = _processedTask2.callId;
              _context2.p = 14;
              _context2.n = 15;
              return this.handleToolCall(_toolName, _args2, _callId);
            case 15:
              _toolResult = _context2.v;
              if (!(processedTask.onComplete && typeof processedTask.onComplete === 'function')) {
                _context2.n = 17;
                break;
              }
              _context2.n = 16;
              return processedTask.onComplete(_toolResult, this);
            case 16:
              return _context2.a(2, _context2.v);
            case 17:
              return _context2.a(2, _toolResult);
            case 18:
              _context2.p = 18;
              _t5 = _context2.v;
              if (!(processedTask.onError && typeof processedTask.onError === 'function')) {
                _context2.n = 20;
                break;
              }
              _context2.n = 19;
              return processedTask.onError(_t5, this);
            case 19:
              return _context2.a(2, _context2.v);
            case 20:
              throw _t5;
            case 21:
              if (!(processedTask.type === 'mcp_tool' && this.mcpSystem)) {
                _context2.n = 29;
                break;
              }
              _processedTask3 = processedTask, _toolName2 = _processedTask3.toolName, _processedTask3$args = _processedTask3.args, _args3 = _processedTask3$args === void 0 ? {} : _processedTask3$args, _processedTask3$optio = _processedTask3.options, _options = _processedTask3$optio === void 0 ? {} : _processedTask3$optio;
              _context2.p = 22;
              _context2.n = 23;
              return this.mcpSystem.callTool(_toolName2, _args3, _options);
            case 23:
              _toolResult2 = _context2.v;
              if (!(processedTask.onComplete && typeof processedTask.onComplete === 'function')) {
                _context2.n = 25;
                break;
              }
              _context2.n = 24;
              return processedTask.onComplete(_toolResult2, this);
            case 24:
              return _context2.a(2, _context2.v);
            case 25:
              return _context2.a(2, _toolResult2);
            case 26:
              _context2.p = 26;
              _t6 = _context2.v;
              if (!(processedTask.onError && typeof processedTask.onError === 'function')) {
                _context2.n = 28;
                break;
              }
              _context2.n = 27;
              return processedTask.onError(_t6, this);
            case 27:
              return _context2.a(2, _context2.v);
            case 28:
              throw _t6;
            case 29:
              if (!(processedTask.type === 'mcp_chain' && this.mcpSystem)) {
                _context2.n = 37;
                break;
              }
              _processedTask4 = processedTask, toolChain = _processedTask4.toolChain, _processedTask4$initi = _processedTask4.initialData, initialData = _processedTask4$initi === void 0 ? {} : _processedTask4$initi, _processedTask4$optio = _processedTask4.options, _options2 = _processedTask4$optio === void 0 ? {} : _processedTask4$optio;
              _context2.p = 30;
              _context2.n = 31;
              return this.mcpSystem.executeToolChain(toolChain, initialData, _options2);
            case 31:
              chainResult = _context2.v;
              if (!(processedTask.onComplete && typeof processedTask.onComplete === 'function')) {
                _context2.n = 33;
                break;
              }
              _context2.n = 32;
              return processedTask.onComplete(chainResult, this);
            case 32:
              return _context2.a(2, _context2.v);
            case 33:
              return _context2.a(2, chainResult);
            case 34:
              _context2.p = 34;
              _t7 = _context2.v;
              if (!(processedTask.onError && typeof processedTask.onError === 'function')) {
                _context2.n = 36;
                break;
              }
              _context2.n = 35;
              return processedTask.onError(_t7, this);
            case 35:
              return _context2.a(2, _context2.v);
            case 36:
              throw _t7;
            case 37:
              if (!(processedTask.type === 'hybrid' && this.llm && this.mcpSystem)) {
                _context2.n = 39;
                break;
              }
              _context2.n = 38;
              return this.executeHybridTask(processedTask);
            case 38:
              return _context2.a(2, _context2.v);
            case 39:
              return _context2.a(2, {
                status: 'completed',
                task: processedTask
              });
          }
        }, _callee2, this, [[30, 34], [22, 26], [14, 18], [6, 10]]);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }()
    /**
     * 处理工具调用（参考 codex-rs 的 handle_function_call 逻辑）
     * @param {string} toolName - 工具名称
     * @param {Object} args - 工具参数
     * @param {string} callId - 调用ID
     * @returns {Promise<Object>} 工具执行结果
     */
  }, {
    key: "handleToolCall",
    value: (function () {
      var _handleToolCall = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(toolName, args, callId) {
        var mcpResult, _t8, _t9;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              if (this.initialized) {
                _context3.n = 1;
                break;
              }
              throw new Error('AgentCore 未初始化，请先调用 initialize()');
            case 1:
              if (!(this.browserToolManager && this.browserToolManager.isToolAvailable(toolName))) {
                _context3.n = 5;
                break;
              }
              _context3.p = 2;
              _context3.n = 3;
              return this.browserToolManager.executeLocalTool(toolName, args, callId);
            case 3:
              return _context3.a(2, _context3.v);
            case 4:
              _context3.p = 4;
              _t8 = _context3.v;
              return _context3.a(2, {
                success: false,
                error: _t8.message,
                toolName: toolName,
                callId: callId
              });
            case 5:
              if (!(this.mcpSystem && this.mcpSystem.toolSystem)) {
                _context3.n = 10;
                break;
              }
              _context3.p = 6;
              _context3.n = 7;
              return this.mcpSystem.toolSystem.callTool(toolName, args, {
                callId: callId
              });
            case 7:
              mcpResult = _context3.v;
              return _context3.a(2, {
                success: true,
                data: mcpResult,
                toolName: toolName,
                callId: callId
              });
            case 8:
              _context3.p = 8;
              _t9 = _context3.v;
              if (!(_t9.message.includes('Unknown tool') || _t9.message.includes('not found'))) {
                _context3.n = 9;
                break;
              }
              return _context3.a(2, {
                success: false,
                error: "unsupported tool: ".concat(toolName),
                toolName: toolName,
                callId: callId
              });
            case 9:
              return _context3.a(2, {
                success: false,
                error: _t9.message,
                toolName: toolName,
                callId: callId
              });
            case 10:
              return _context3.a(2, {
                success: false,
                error: "unsupported tool: ".concat(toolName),
                toolName: toolName,
                callId: callId
              });
          }
        }, _callee3, this, [[6, 8], [2, 4]]);
      }));
      function handleToolCall(_x2, _x3, _x4) {
        return _handleToolCall.apply(this, arguments);
      }
      return handleToolCall;
    }()
    /**
     * 执行混合任务：LLM和MCP协作
     * @private
     */
    )
  }, {
    key: "executeHybridTask",
    value: (function () {
      var _executeHybridTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(task) {
        var workflow, initialPrompt, finalPrompt, currentData, results, llmResult, _iterator2, _step2, step, _prompt, _llmResult, args, toolResult, mappedChain, chainResult, prompt, finalResult, _t0;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              workflow = task.workflow, initialPrompt = task.initialPrompt, finalPrompt = task.finalPrompt;
              currentData = {};
              results = []; // 1. 初始LLM调用获取计划或参数
              if (!initialPrompt) {
                _context4.n = 2;
                break;
              }
              _context4.n = 1;
              return this.llm.post(initialPrompt);
            case 1:
              llmResult = _context4.v;
              currentData = {
                llmResult: llmResult
              };
              results.push({
                type: 'llm',
                result: llmResult
              });
            case 2:
              // 2. 执行工作流步骤
              _iterator2 = _createForOfIteratorHelper(workflow || []);
              _context4.p = 3;
              _iterator2.s();
            case 4:
              if ((_step2 = _iterator2.n()).done) {
                _context4.n = 11;
                break;
              }
              step = _step2.value;
              if (!(step.type === 'llm')) {
                _context4.n = 6;
                break;
              }
              _prompt = this.buildDynamicPrompt(step.prompt, currentData);
              _context4.n = 5;
              return this.llm.post(_prompt);
            case 5:
              _llmResult = _context4.v;
              currentData = _objectSpread2(_objectSpread2({}, currentData), {}, _defineProperty({}, step.name || 'llmResult', _llmResult));
              results.push({
                type: 'llm',
                name: step.name,
                result: _llmResult
              });
              _context4.n = 10;
              break;
            case 6:
              if (!(step.type === 'mcp_tool')) {
                _context4.n = 8;
                break;
              }
              args = this.buildDynamicArgs(step.args, currentData);
              _context4.n = 7;
              return this.mcpSystem.callTool(step.toolName, args);
            case 7:
              toolResult = _context4.v;
              currentData = _objectSpread2(_objectSpread2({}, currentData), {}, _defineProperty({}, step.name || 'toolResult', toolResult));
              results.push({
                type: 'mcp_tool',
                name: step.name,
                result: toolResult
              });
              _context4.n = 10;
              break;
            case 8:
              if (!(step.type === 'mcp_chain')) {
                _context4.n = 10;
                break;
              }
              mappedChain = this.buildDynamicToolChain(step.toolChain, currentData);
              _context4.n = 9;
              return this.mcpSystem.executeToolChain(mappedChain, currentData);
            case 9:
              chainResult = _context4.v;
              currentData = _objectSpread2(_objectSpread2({}, currentData), {}, _defineProperty({}, step.name || 'chainResult', chainResult));
              results.push({
                type: 'mcp_chain',
                name: step.name,
                result: chainResult
              });
            case 10:
              _context4.n = 4;
              break;
            case 11:
              _context4.n = 13;
              break;
            case 12:
              _context4.p = 12;
              _t0 = _context4.v;
              _iterator2.e(_t0);
            case 13:
              _context4.p = 13;
              _iterator2.f();
              return _context4.f(13);
            case 14:
              if (!finalPrompt) {
                _context4.n = 16;
                break;
              }
              prompt = this.buildDynamicPrompt(finalPrompt, currentData);
              _context4.n = 15;
              return this.llm.post(prompt);
            case 15:
              finalResult = _context4.v;
              results.push({
                type: 'llm_final',
                result: finalResult
              });
              return _context4.a(2, finalResult);
            case 16:
              return _context4.a(2, {
                results: results,
                finalData: currentData
              });
          }
        }, _callee4, this, [[3, 12, 13, 14]]);
      }));
      function executeHybridTask(_x5) {
        return _executeHybridTask.apply(this, arguments);
      }
      return executeHybridTask;
    }()
    /**
     * 构建动态Prompt
     * @private
     */
    )
  }, {
    key: "buildDynamicPrompt",
    value: function buildDynamicPrompt(promptTemplate, data) {
      if (typeof promptTemplate === 'function') {
        return promptTemplate(data);
      }
      if (typeof promptTemplate === 'string') {
        // 简单的模板替换
        return promptTemplate.replace(/\{\{(\w+)\}\}/g, function (match, key) {
          return data[key] || match;
        });
      }
      return promptTemplate;
    }

    /**
     * 构建动态参数
     * @private
     */
  }, {
    key: "buildDynamicArgs",
    value: function buildDynamicArgs(argsTemplate, data) {
      if (typeof argsTemplate === 'function') {
        return argsTemplate(data);
      }
      if (_typeof(argsTemplate) === 'object') {
        var result = {};
        for (var _i2 = 0, _Object$entries2 = Object.entries(argsTemplate); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            key = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];
          if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
            var dataKey = value.slice(2, -2);
            result[key] = data[dataKey];
          } else {
            result[key] = value;
          }
        }
        return result;
      }
      return argsTemplate;
    }

    /**
     * 构建动态工具链
     * @private
     */
  }, {
    key: "buildDynamicToolChain",
    value: function buildDynamicToolChain(chainTemplate, data) {
      var _this3 = this;
      return chainTemplate.map(function (step) {
        return _objectSpread2(_objectSpread2({}, step), {}, {
          args: _this3.buildDynamicArgs(step.args, data)
        });
      });
    }
  }, {
    key: "executeBatch",
    value: function () {
      var _executeBatch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(tasks) {
        var results,
          _iterator3,
          _step3,
          task,
          result,
          _t1,
          _t10;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              results = [];
              _iterator3 = _createForOfIteratorHelper(tasks);
              _context5.p = 1;
              _iterator3.s();
            case 2:
              if ((_step3 = _iterator3.n()).done) {
                _context5.n = 7;
                break;
              }
              task = _step3.value;
              _context5.p = 3;
              _context5.n = 4;
              return this.execute(task);
            case 4:
              result = _context5.v;
              results.push({
                success: true,
                result: result
              });
              _context5.n = 6;
              break;
            case 5:
              _context5.p = 5;
              _t1 = _context5.v;
              results.push({
                success: false,
                error: _t1.message
              });
            case 6:
              _context5.n = 2;
              break;
            case 7:
              _context5.n = 9;
              break;
            case 8:
              _context5.p = 8;
              _t10 = _context5.v;
              _iterator3.e(_t10);
            case 9:
              _context5.p = 9;
              _iterator3.f();
              return _context5.f(9);
            case 10:
              return _context5.a(2, results);
          }
        }, _callee5, this, [[3, 5], [1, 8, 9, 10]]);
      }));
      function executeBatch(_x6) {
        return _executeBatch.apply(this, arguments);
      }
      return executeBatch;
    }()
  }, {
    key: "executeStream",
    value: function () {
      var _executeStream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(task) {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              if (this.initialized) {
                _context7.n = 1;
                break;
              }
              throw new Error('AgentCore 未初始化，请先调用 initialize()');
            case 1:
              if (!(task.type === 'llm' && this.llm)) {
                _context7.n = 2;
                break;
              }
              return _context7.a(2, this.llm.post(task.payload));
            case 2:
              return _context7.a(2, _wrapAsyncGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
                return _regenerator().w(function (_context6) {
                  while (1) switch (_context6.n) {
                    case 0:
                      _context6.n = 1;
                      return {
                        status: 'completed',
                        task: task
                      };
                    case 1:
                      return _context6.a(2);
                  }
                }, _callee6);
              }))());
          }
        }, _callee7, this);
      }));
      function executeStream(_x7) {
        return _executeStream.apply(this, arguments);
      }
      return executeStream;
    }()
  }, {
    key: "getHealth",
    value: function () {
      var _getHealth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var health, llmConnected, mcpStatus, browserHealth, _t11, _t12;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              health = {
                status: this.initialized ? 'healthy' : 'not_initialized',
                timestamp: new Date().toISOString(),
                components: {}
              }; // 检查 LLM 连接状态
              if (!this.llm) {
                _context8.n = 4;
                break;
              }
              _context8.p = 1;
              _context8.n = 2;
              return this.llm.isConnect();
            case 2:
              llmConnected = _context8.v;
              health.components.llm = {
                status: llmConnected ? 'connected' : 'disconnected',
                connected: llmConnected
              };
              _context8.n = 4;
              break;
            case 3:
              _context8.p = 3;
              _t11 = _context8.v;
              health.components.llm = {
                status: 'error',
                error: _t11.message
              };
            case 4:
              // 检查 MCP 系统状态
              if (this.mcpSystem) {
                try {
                  mcpStatus = this.mcpSystem.getStatus();
                  health.components.mcp = {
                    status: mcpStatus.readyConnections > 0 ? 'connected' : 'disconnected',
                    totalConnections: mcpStatus.totalConnections,
                    readyConnections: mcpStatus.readyConnections,
                    errorConnections: mcpStatus.errorConnections,
                    connectingConnections: mcpStatus.connectingConnections
                  };
                } catch (error) {
                  health.components.mcp = {
                    status: 'error',
                    error: error.message
                  };
                }
              }

              // 检查浏览器工具状态
              if (!this.browserToolManager) {
                _context8.n = 8;
                break;
              }
              _context8.p = 5;
              _context8.n = 6;
              return this.browserToolManager.getHealthStatus();
            case 6:
              browserHealth = _context8.v;
              health.components.browser = {
                status: browserHealth.overall ? 'healthy' : 'unhealthy',
                manager: browserHealth.manager,
                browser: browserHealth.browser,
                metrics: browserHealth.metrics
              };
              _context8.n = 8;
              break;
            case 7:
              _context8.p = 7;
              _t12 = _context8.v;
              health.components.browser = {
                status: 'error',
                error: _t12.message
              };
            case 8:
              return _context8.a(2, health);
          }
        }, _callee8, this, [[5, 7], [1, 3]]);
      }));
      function getHealth() {
        return _getHealth.apply(this, arguments);
      }
      return getHealth;
    }()
  }, {
    key: "getCapabilities",
    value: function () {
      var _getCapabilities = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var capabilities, tools, browserTools;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              capabilities = {
                core: ['execute', 'executeBatch', 'executeStream', 'getHealth', 'handleToolCall'],
                llm: this.llm ? ['post', 'isConnect', 'streamRequest'] : [],
                prompt: this.promptBuilder ? ['build', 'getTemplates', 'addTemplate'] : [],
                mcp: this.mcpSystem ? ['callTool', 'executeToolChain', 'getTools', 'getStatus'] : [],
                browser: this.browserToolManager ? ['executeLocalTool', 'getToolDefinitions', 'getMetrics'] : []
              }; // 添加可用的MCP工具列表
              if (this.mcpSystem) {
                try {
                  tools = this.mcpSystem.getTools();
                  capabilities.mcpTools = tools.map(function (tool) {
                    return {
                      name: tool.name,
                      title: tool.title,
                      description: tool.description
                    };
                  });
                } catch (error) {
                  capabilities.mcpTools = [];
                }
              }

              // 添加可用的浏览器工具列表
              if (this.browserToolManager) {
                try {
                  browserTools = this.browserToolManager.getToolDefinitions();
                  capabilities.browserTools = browserTools.map(function (tool) {
                    return {
                      name: tool.name,
                      description: tool.description,
                      parameters: tool.parameters
                    };
                  });
                } catch (error) {
                  capabilities.browserTools = [];
                }
              }
              return _context9.a(2, capabilities);
          }
        }, _callee9, this);
      }));
      function getCapabilities() {
        return _getCapabilities.apply(this, arguments);
      }
      return getCapabilities;
    }()
  }, {
    key: "shutdown",
    value: function () {
      var _shutdown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _t13, _t14;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              this.initialized = false;

              // 关闭浏览器工具管理器
              if (!this.browserToolManager) {
                _context0.n = 5;
                break;
              }
              _context0.p = 1;
              _context0.n = 2;
              return this.browserToolManager.cleanup();
            case 2:
              _context0.n = 4;
              break;
            case 3:
              _context0.p = 3;
              _t13 = _context0.v;
              console.warn('浏览器工具管理器关闭时出错:', _t13.message);
            case 4:
              this.browserToolManager = null;
            case 5:
              if (!this.mcpSystem) {
                _context0.n = 10;
                break;
              }
              _context0.p = 6;
              _context0.n = 7;
              return this.mcpSystem.shutdown();
            case 7:
              _context0.n = 9;
              break;
            case 8:
              _context0.p = 8;
              _t14 = _context0.v;
              console.warn('MCP系统关闭时出错:', _t14.message);
            case 9:
              this.mcpSystem = null;
            case 10:
              this.llm = null;
              this.promptBuilder = null;
            case 11:
              return _context0.a(2);
          }
        }, _callee0, this, [[6, 8], [1, 3]]);
      }));
      function shutdown() {
        return _shutdown.apply(this, arguments);
      }
      return shutdown;
    }() // ==================== MCP 便捷方法 ====================
    /**
     * 调用MCP工具
     * @param {string} toolName - 工具名称
     * @param {Object} args - 工具参数
     * @param {Object} options - 调用选项
     * @returns {Promise<Object>} 工具调用结果
     */
  }, {
    key: "callTool",
    value: function () {
      var _callTool = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(toolName) {
        var args,
          options,
          _args11 = arguments;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              args = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : {};
              options = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : {};
              if (this.mcpSystem) {
                _context1.n = 1;
                break;
              }
              throw new Error('MCP系统未初始化');
            case 1:
              _context1.n = 2;
              return this.mcpSystem.callTool(toolName, args, options);
            case 2:
              return _context1.a(2, _context1.v);
          }
        }, _callee1, this);
      }));
      function callTool(_x8) {
        return _callTool.apply(this, arguments);
      }
      return callTool;
    }()
    /**
     * 执行工具链
     * @param {Array} toolChain - 工具链定义
     * @param {Object} initialData - 初始数据
     * @param {Object} options - 执行选项
     * @returns {Promise<Array>} 工具链执行结果
     */
  }, {
    key: "executeToolChain",
    value: (function () {
      var _executeToolChain = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(toolChain) {
        var initialData,
          options,
          _args12 = arguments;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              initialData = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {};
              options = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : {};
              if (this.mcpSystem) {
                _context10.n = 1;
                break;
              }
              throw new Error('MCP系统未初始化');
            case 1:
              _context10.n = 2;
              return this.mcpSystem.executeToolChain(toolChain, initialData, options);
            case 2:
              return _context10.a(2, _context10.v);
          }
        }, _callee10, this);
      }));
      function executeToolChain(_x9) {
        return _executeToolChain.apply(this, arguments);
      }
      return executeToolChain;
    }()
    /**
     * 获取可用工具列表
     * @returns {Array} 工具列表
     */
    )
  }, {
    key: "getTools",
    value: function getTools() {
      if (!this.mcpSystem) {
        return [];
      }
      return this.mcpSystem.getTools();
    }

    /**
     * 获取MCP系统状态
     * @returns {Object} 系统状态
     */
  }, {
    key: "getMCPStatus",
    value: function getMCPStatus() {
      if (!this.mcpSystem) {
        return {
          status: 'not_initialized'
        };
      }
      return this.mcpSystem.getStatus();
    }
  }]);
}(events.EventEmitter);

// 快速启动
function quickStart() {
  return _quickStart.apply(this, arguments);
}

// 页面分析 - 现在使用真实的MCP工具
function _quickStart() {
  _quickStart = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
    var preset,
      options,
      agent,
      _args13 = arguments;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          preset = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : 'basic';
          options = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : {};
          agent = new AgentCore(_objectSpread2(_objectSpread2({}, PRESET_CONFIGS[preset]), options));
          _context11.n = 1;
          return agent.initialize();
        case 1:
          if (!options.task) {
            _context11.n = 2;
            break;
          }
          return _context11.a(2, agent.execute(options.task));
        case 2:
          return _context11.a(2, agent);
      }
    }, _callee11);
  }));
  return _quickStart.apply(this, arguments);
}
function analyzePage(_x0) {
  return _analyzePage.apply(this, arguments);
}

// DOM 操作 - 现在使用真实的MCP工具
function _analyzePage() {
  _analyzePage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(url) {
    var agent,
      _t15;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _context12.p = 1;
          _context12.n = 2;
          return createMCPAgent({
            servers: [{
              name: 'web',
              transport: 'stdio',
              command: 'web-mcp-server'
            }]
          });
        case 2:
          agent = _context12.v;
          _context12.n = 3;
          return agent.executeToolChain([{
            tool: 'fetch_page',
            args: {
              url: url
            }
          }, {
            tool: 'extract_page_info',
            dataMapping: function dataMapping(data, results) {
              var _results$;
              return {
                html: (_results$ = results[0]) === null || _results$ === void 0 || (_results$ = _results$.data) === null || _results$ === void 0 ? void 0 : _results$.content
              };
            }
          }, {
            tool: 'analyze_dom_structure',
            dataMapping: function dataMapping(data, results) {
              var _results$2;
              return {
                html: (_results$2 = results[0]) === null || _results$2 === void 0 || (_results$2 = _results$2.data) === null || _results$2 === void 0 ? void 0 : _results$2.content
              };
            }
          }], {
            url: url
          });
        case 3:
          return _context12.a(2, _context12.v);
        case 4:
          _context12.p = 4;
          _t15 = _context12.v;
          // 如果MCP工具不可用，返回模拟数据
          console.warn('MCP工具不可用，返回模拟数据:', _t15.message);
          return _context12.a(2, {
            pageInfo: {
              url: url,
              title: 'Demo Page',
              description: '模拟页面分析结果',
              status: 'simulated'
            },
            domStructure: '<html>...</html>'
          });
      }
    }, _callee12, null, [[1, 4]]);
  }));
  return _analyzePage.apply(this, arguments);
}
function manipulateDOM(_x1) {
  return _manipulateDOM.apply(this, arguments);
}

// 批量处理 - 现在支持真实的MCP任务
function _manipulateDOM() {
  _manipulateDOM = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(url) {
    var actions,
      agent,
      results,
      _iterator4,
      _step4,
      action,
      result,
      _args15 = arguments,
      _t16,
      _t17,
      _t18;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          actions = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : [];
          _context13.p = 1;
          _context13.n = 2;
          return createMCPAgent({
            servers: [{
              name: 'dom',
              transport: 'stdio',
              command: 'dom-mcp-server'
            }]
          });
        case 2:
          agent = _context13.v;
          results = []; // 首先导航到页面
          _context13.n = 3;
          return agent.callTool('navigate', {
            url: url
          });
        case 3:
          // 执行每个动作
          _iterator4 = _createForOfIteratorHelper(actions);
          _context13.p = 4;
          _iterator4.s();
        case 5:
          if ((_step4 = _iterator4.n()).done) {
            _context13.n = 15;
            break;
          }
          action = _step4.value;
          result = void 0;
          _t16 = action.type;
          _context13.n = _t16 === 'click' ? 6 : _t16 === 'fill' ? 8 : _t16 === 'wait' ? 10 : 12;
          break;
        case 6:
          _context13.n = 7;
          return agent.callTool('click_element', {
            selector: action.selector
          });
        case 7:
          result = _context13.v;
          return _context13.a(3, 13);
        case 8:
          _context13.n = 9;
          return agent.callTool('fill_input', {
            selector: action.selector,
            value: action.value
          });
        case 9:
          result = _context13.v;
          return _context13.a(3, 13);
        case 10:
          _context13.n = 11;
          return agent.callTool('wait', {
            duration: action.duration
          });
        case 11:
          result = _context13.v;
          return _context13.a(3, 13);
        case 12:
          result = {
            error: "Unknown action type: ".concat(action.type)
          };
        case 13:
          results.push({
            action: action,
            result: result
          });
        case 14:
          _context13.n = 5;
          break;
        case 15:
          _context13.n = 17;
          break;
        case 16:
          _context13.p = 16;
          _t17 = _context13.v;
          _iterator4.e(_t17);
        case 17:
          _context13.p = 17;
          _iterator4.f();
          return _context13.f(17);
        case 18:
          return _context13.a(2, {
            url: url,
            actions: results,
            status: 'completed'
          });
        case 19:
          _context13.p = 19;
          _t18 = _context13.v;
          console.warn('DOM操作工具不可用，返回模拟结果:', _t18.message);
          return _context13.a(2, {
            url: url,
            actions: actions.map(function (action) {
              return {
                action: action,
                result: {
                  status: 'simulated',
                  message: 'DOM 操作已模拟执行'
                }
              };
            }),
            status: 'simulated'
          });
      }
    }, _callee13, null, [[4, 16, 17, 18], [1, 19]]);
  }));
  return _manipulateDOM.apply(this, arguments);
}
function batchProcess(_x10) {
  return _batchProcess.apply(this, arguments);
}

// 创建 agent（支持预设名或自定义配置）
function _batchProcess() {
  _batchProcess = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(tasks) {
    var results,
      _iterator5,
      _step5,
      task,
      result,
      _task$data,
      _t19,
      _t20;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          results = [];
          _iterator5 = _createForOfIteratorHelper(tasks);
          _context14.p = 1;
          _iterator5.s();
        case 2:
          if ((_step5 = _iterator5.n()).done) {
            _context14.n = 11;
            break;
          }
          task = _step5.value;
          _context14.p = 3;
          result = void 0;
          if (!(task.task === 'analyze_page')) {
            _context14.n = 5;
            break;
          }
          _context14.n = 4;
          return analyzePage(task.target, task.options);
        case 4:
          result = _context14.v;
          _context14.n = 8;
          break;
        case 5:
          if (!(task.task === 'fill_form')) {
            _context14.n = 7;
            break;
          }
          _context14.n = 6;
          return manipulateDOM(task.target, [{
            type: 'fill',
            selector: '#email',
            value: ((_task$data = task.data) === null || _task$data === void 0 ? void 0 : _task$data.email) || ''
          }]);
        case 6:
          result = _context14.v;
          _context14.n = 8;
          break;
        case 7:
          // 通用任务处理
          result = _objectSpread2(_objectSpread2({}, task), {}, {
            status: 'done'
          });
        case 8:
          results.push({
            task: task,
            result: result,
            success: true,
            timestamp: new Date().toISOString()
          });
          _context14.n = 10;
          break;
        case 9:
          _context14.p = 9;
          _t19 = _context14.v;
          results.push({
            task: task,
            error: _t19.message,
            success: false,
            timestamp: new Date().toISOString()
          });
        case 10:
          _context14.n = 2;
          break;
        case 11:
          _context14.n = 13;
          break;
        case 12:
          _context14.p = 12;
          _t20 = _context14.v;
          _iterator5.e(_t20);
        case 13:
          _context14.p = 13;
          _iterator5.f();
          return _context14.f(13);
        case 14:
          return _context14.a(2, results);
      }
    }, _callee14, null, [[3, 9], [1, 12, 13, 14]]);
  }));
  return _batchProcess.apply(this, arguments);
}
function createAgent(presetOrConfig) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof presetOrConfig === 'string') {
    var config = _objectSpread2(_objectSpread2({}, PRESET_CONFIGS[presetOrConfig]), options);
    return new AgentCore(config);
  }
  return new AgentCore(_objectSpread2(_objectSpread2({}, presetOrConfig), options));
}

// 创建带 LLM 的 Agent
function createLLMAgent(provider) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var llmConfig;
  if (typeof provider === 'string') {
    // 使用预注册的提供商
    llmConfig = {
      provider: provider,
      options: options
    };
  } else if (typeof provider === 'function') {
    // 直接传入请求处理函数
    llmConfig = {
      requestHandler: provider,
      provider: options.provider || 'custom',
      options: options.options || {}
    };
  } else {
    // 完整配置对象
    llmConfig = provider;
  }
  var config = _objectSpread2(_objectSpread2({}, PRESET_CONFIGS[options.preset || 'basic']), {}, {
    llm: llmConfig
  }, options);
  return new AgentCore(config);
}

// 便捷的创建函数
function createSparkAgent() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return createLLMAgent('spark', options);
}
function createOpenAIAgent() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return createLLMAgent('openai', options);
}

// 创建带 MCP 的 Agent
function createMCPAgent(_x11) {
  return _createMCPAgent.apply(this, arguments);
}

// 创建完整的智能代理 (LLM + MCP)
function _createMCPAgent() {
  _createMCPAgent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(mcpConfig) {
    var agentOptions,
      config,
      agent,
      _args17 = arguments;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          agentOptions = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : {};
          config = _objectSpread2(_objectSpread2({}, PRESET_CONFIGS[agentOptions.preset || 'basic']), {}, {
            mcp: mcpConfig
          }, agentOptions);
          agent = new AgentCore(config);
          _context15.n = 1;
          return agent.initialize();
        case 1:
          return _context15.a(2, agent);
      }
    }, _callee15);
  }));
  return _createMCPAgent.apply(this, arguments);
}
function createSmartAgent() {
  return _createSmartAgent.apply(this, arguments);
}

// 预设的智能代理配置
function _createSmartAgent() {
  _createSmartAgent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
    var config,
      _config$llm,
      llm,
      _config$mcp,
      mcp,
      _config$prompt,
      prompt,
      _config$preset,
      preset,
      otherOptions,
      agentConfig,
      agent,
      _args18 = arguments;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          config = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : {};
          _config$llm = config.llm, llm = _config$llm === void 0 ? {} : _config$llm, _config$mcp = config.mcp, mcp = _config$mcp === void 0 ? {} : _config$mcp, _config$prompt = config.prompt, prompt = _config$prompt === void 0 ? {} : _config$prompt, _config$preset = config.preset, preset = _config$preset === void 0 ? 'basic' : _config$preset, otherOptions = _objectWithoutProperties(config, _excluded);
          agentConfig = _objectSpread2(_objectSpread2({}, PRESET_CONFIGS[preset]), {}, {
            llm: llm,
            mcp: mcp,
            prompt: prompt
          }, otherOptions);
          agent = new AgentCore(agentConfig);
          _context16.n = 1;
          return agent.initialize();
        case 1:
          return _context16.a(2, agent);
      }
    }, _callee16);
  }));
  return _createSmartAgent.apply(this, arguments);
}
var SMART_AGENT_PRESETS = {
  // 网页操作代理
  webAgent: {
    mcp: {
      servers: [{
        name: 'web',
        transport: 'stdio',
        command: 'web-mcp-server',
        args: ['--headless']
      }, {
        name: 'dom',
        transport: 'stdio',
        command: 'dom-mcp-server'
      }]
    },
    llm: {
      provider: 'openai',
      options: {
        model: 'gpt-4'
      }
    }
  },
  // 文件处理代理
  fileAgent: {
    mcp: {
      servers: [{
        name: 'file',
        transport: 'stdio',
        command: 'file-mcp-server'
      }, {
        name: 'text',
        transport: 'stdio',
        command: 'text-processor-server'
      }]
    },
    llm: {
      provider: 'openai',
      options: {
        model: 'gpt-4'
      }
    }
  },
  // 数据分析代理
  dataAgent: {
    mcp: {
      servers: [{
        name: 'data',
        transport: 'stdio',
        command: 'data-analysis-server'
      }, {
        name: 'chart',
        transport: 'stdio',
        command: 'chart-generator-server'
      }]
    },
    llm: {
      provider: 'openai',
      options: {
        model: 'gpt-4'
      }
    }
  },
  // 全能代理
  universalAgent: {
    mcp: {
      servers: [{
        name: 'web',
        transport: 'stdio',
        command: 'web-mcp-server'
      }, {
        name: 'file',
        transport: 'stdio',
        command: 'file-mcp-server'
      }, {
        name: 'data',
        transport: 'stdio',
        command: 'data-analysis-server'
      }, {
        name: 'system',
        transport: 'stdio',
        command: 'system-mcp-server'
      }],
      manager: {
        loadBalanceStrategy: 'least-connections',
        healthCheckInterval: 30000
      }
    },
    llm: {
      provider: 'openai',
      options: {
        model: 'gpt-4'
      }
    }
  }
};

// 使用预设创建智能代理
function createPresetAgent(_x12) {
  return _createPresetAgent.apply(this, arguments);
}

// 高级工作流执行器
function _createPresetAgent() {
  _createPresetAgent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(presetName) {
    var _overrides$mcp, _preset$mcp;
    var overrides,
      preset,
      config,
      _args19 = arguments;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          overrides = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : {};
          preset = SMART_AGENT_PRESETS[presetName];
          if (preset) {
            _context17.n = 1;
            break;
          }
          throw new Error("Unknown preset: ".concat(presetName));
        case 1:
          config = _objectSpread2(_objectSpread2(_objectSpread2({}, preset), overrides), {}, {
            // 深度合并MCP配置
            mcp: _objectSpread2(_objectSpread2(_objectSpread2({}, preset.mcp), overrides.mcp), {}, {
              servers: ((_overrides$mcp = overrides.mcp) === null || _overrides$mcp === void 0 ? void 0 : _overrides$mcp.servers) || ((_preset$mcp = preset.mcp) === null || _preset$mcp === void 0 ? void 0 : _preset$mcp.servers)
            })
          });
          _context17.n = 2;
          return createSmartAgent(config);
        case 2:
          return _context17.a(2, _context17.v);
      }
    }, _callee17);
  }));
  return _createPresetAgent.apply(this, arguments);
}
function executeWorkflow(_x13) {
  return _executeWorkflow.apply(this, arguments);
}
function _executeWorkflow() {
  _executeWorkflow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(workflowDefinition) {
    var options,
      _options$agentPreset,
      agentPreset,
      _options$agentConfig,
      agentConfig,
      sessionId,
      _options$timeout,
      timeout,
      agent,
      result,
      _args20 = arguments;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          options = _args20.length > 1 && _args20[1] !== undefined ? _args20[1] : {};
          _options$agentPreset = options.agentPreset, agentPreset = _options$agentPreset === void 0 ? 'universalAgent' : _options$agentPreset, _options$agentConfig = options.agentConfig, agentConfig = _options$agentConfig === void 0 ? {} : _options$agentConfig, sessionId = options.sessionId, _options$timeout = options.timeout, timeout = _options$timeout === void 0 ? 300000 : _options$timeout; // 创建代理
          _context18.n = 1;
          return createPresetAgent(agentPreset, agentConfig);
        case 1:
          agent = _context18.v;
          _context18.p = 2;
          _context18.n = 3;
          return Promise.race([agent.execute({
            type: 'hybrid',
            workflow: workflowDefinition.steps,
            initialPrompt: workflowDefinition.initialPrompt,
            finalPrompt: workflowDefinition.finalPrompt,
            sessionId: sessionId
          }), new Promise(function (_, reject) {
            return setTimeout(function () {
              return reject(new Error('Workflow timeout'));
            }, timeout);
          })]);
        case 3:
          result = _context18.v;
          return _context18.a(2, {
            success: true,
            result: result,
            workflowId: workflowDefinition.id,
            executedAt: new Date().toISOString()
          });
        case 4:
          _context18.p = 4;
          _context18.n = 5;
          return agent.shutdown();
        case 5:
          return _context18.f(4);
        case 6:
          return _context18.a(2);
      }
    }, _callee18, null, [[2,, 4, 6]]);
  }));
  return _executeWorkflow.apply(this, arguments);
}

exports.AgentCore = AgentCore;
exports.BROWSER_ENGINES = BROWSER_ENGINES;
exports.BROWSER_TOOLS = BROWSER_TOOLS;
exports.BaseBrowserTool = BaseBrowserTool;
exports.BrowserInstance = BrowserInstance;
exports.BrowserInstancePool = BrowserInstancePool$1;
exports.BrowserSecurityManager = BrowserSecurityManager;
exports.BrowserSecurityPolicy = BrowserSecurityPolicy;
exports.BrowserToolChain = BrowserToolChain;
exports.BrowserToolManager = BrowserToolManager;
exports.BrowserToolMonitor = BrowserToolMonitor$1;
exports.CONNECTION_STATUS = CONNECTION_STATUS;
exports.ClickTool = ClickTool;
exports.DEFAULT_SECURITY_CONFIG = DEFAULT_SECURITY_CONFIG;
exports.EvaluateTool = EvaluateTool;
exports.ExtractTool = ExtractTool;
exports.LLM = LLM;
exports.LLMFactory = LLMFactory;
exports.MCPBrowserClient = MCPBrowserClient;
exports.MCPBrowserServer = MCPBrowserServer;
exports.MCPClient = MCPClient;
exports.MCPConnectionManager = MCPConnectionManager;
exports.MCPToolSystem = MCPToolSystem;
exports.NavigateTool = NavigateTool;
exports.PRESET_CONFIGS = PRESET_CONFIGS;
exports.PROMPT_TEMPLATES = PROMPT_TEMPLATES;
exports.PromptBuilder = PromptBuilder;
exports.RISK_LEVELS = RISK_LEVELS;
exports.SECURITY_LEVELS = SECURITY_LEVELS;
exports.SMART_AGENT_PRESETS = SMART_AGENT_PRESETS;
exports.ScreenshotTool = ScreenshotTool;
exports.SelectorBuilder = SelectorBuilder;
exports.SelectorPatterns = SelectorPatterns;
exports.TOOL_STATUS = TOOL_STATUS;
exports.TypeTool = TypeTool;
exports.analyzePage = analyzePage;
exports.batchProcess = batchProcess;
exports.combineSelectors = combineSelectors;
exports.createAgent = createAgent;
exports.createAssistantPrompt = createAssistantPrompt;
exports.createBrowserInstancePool = createBrowserInstancePool;
exports.createBrowserSecurityManager = createBrowserSecurityManager;
exports.createBrowserToolChain = createBrowserToolChain;
exports.createBrowserToolManager = createBrowserToolManager;
exports.createBrowserToolMonitor = createBrowserToolMonitor;
exports.createBrowserToolSystem = createBrowserToolSystem;
exports.createFunctionPrompt = createFunctionPrompt;
exports.createLLMAgent = createLLMAgent;
exports.createMCPAgent = createMCPAgent;
exports.createMCPBrowserClient = createMCPBrowserClient;
exports.createMCPBrowserServer = createMCPBrowserServer;
exports.createMCPClient = createMCPClient;
exports.createMCPConnectionManager = createMCPConnectionManager;
exports.createMCPSystem = createMCPSystem;
exports.createOpenAIAgent = createOpenAIAgent;
exports.createOpenAILLM = createOpenAILLM;
exports.createPresetAgent = createPresetAgent;
exports.createSelectorBuilder = createSelectorBuilder;
exports.createSmartAgent = createSmartAgent;
exports.createSparkAgent = createSparkAgent;
exports.createSparkLLM = createSparkLLM;
exports.createSystemPrompt = createSystemPrompt;
exports.createUserPrompt = createUserPrompt;
exports.detectSelectorType = detectSelectorType;
exports.executeWorkflow = executeWorkflow;
exports.getSupportedTools = getSupportedTools;
exports.isValidCSSSelector = isValidCSSSelector;
exports.isValidXPathSelector = isValidXPathSelector;
exports.llmStreamRequest = llmStreamRequest;
exports.manipulateDOM = manipulateDOM;
exports.normalizeSelector = normalizeSelector;
exports.openaiRequestHandler = openaiRequestHandler;
exports.quickStart = quickStart;
exports.sparkRequestHandler = sparkRequestHandler;
exports.sparkStreamRequest = sparkStreamRequest;
exports.startMCPBrowserServer = startMCPBrowserServer;
