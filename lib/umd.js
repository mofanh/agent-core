(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DemoLib = {}));
})(this, (function (exports) { 'use strict';

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
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
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

  var index$1 = /*#__PURE__*/Object.freeze({
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

  var index = /*#__PURE__*/Object.freeze({
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
  var AgentCore = /*#__PURE__*/function () {
    function AgentCore() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, AgentCore);
      this.config = config;
      this.initialized = false;
      this.llm = null; // LLM 实例
      this.promptBuilder = null; // Prompt 构建器
    }
    return _createClass(AgentCore, [{
      key: "initialize",
      value: function () {
        var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
          var _yield$import, PromptBuilder, _i, _Object$entries, _Object$entries$_i, name, template, _yield$import2, LLM, LLMFactory;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                this.initialized = true;

                // 初始化 Prompt 构建器
                if (!this.config.prompt) {
                  _context.n = 2;
                  break;
                }
                _context.n = 1;
                return Promise.resolve().then(function () { return index; });
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
                return Promise.resolve().then(function () { return index$1; });
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
                return _context.a(2);
            }
          }, _callee, this);
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
          var processedTask, prompt, llmResult;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.n) {
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
                return _context2.a(2, {
                  status: 'completed',
                  task: processedTask
                });
            }
          }, _callee2, this);
        }));
        function execute(_x) {
          return _execute.apply(this, arguments);
        }
        return execute;
      }()
    }, {
      key: "executeBatch",
      value: function () {
        var _executeBatch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(tasks) {
          var results,
            _iterator,
            _step,
            task,
            result,
            _t,
            _t2;
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.p = _context3.n) {
              case 0:
                results = [];
                _iterator = _createForOfIteratorHelper(tasks);
                _context3.p = 1;
                _iterator.s();
              case 2:
                if ((_step = _iterator.n()).done) {
                  _context3.n = 7;
                  break;
                }
                task = _step.value;
                _context3.p = 3;
                _context3.n = 4;
                return this.execute(task);
              case 4:
                result = _context3.v;
                results.push({
                  success: true,
                  result: result
                });
                _context3.n = 6;
                break;
              case 5:
                _context3.p = 5;
                _t = _context3.v;
                results.push({
                  success: false,
                  error: _t.message
                });
              case 6:
                _context3.n = 2;
                break;
              case 7:
                _context3.n = 9;
                break;
              case 8:
                _context3.p = 8;
                _t2 = _context3.v;
                _iterator.e(_t2);
              case 9:
                _context3.p = 9;
                _iterator.f();
                return _context3.f(9);
              case 10:
                return _context3.a(2, results);
            }
          }, _callee3, this, [[3, 5], [1, 8, 9, 10]]);
        }));
        function executeBatch(_x2) {
          return _executeBatch.apply(this, arguments);
        }
        return executeBatch;
      }()
    }, {
      key: "executeStream",
      value: function () {
        var _executeStream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(task) {
          return _regenerator().w(function (_context5) {
            while (1) switch (_context5.n) {
              case 0:
                if (this.initialized) {
                  _context5.n = 1;
                  break;
                }
                throw new Error('AgentCore 未初始化，请先调用 initialize()');
              case 1:
                if (!(task.type === 'llm' && this.llm)) {
                  _context5.n = 2;
                  break;
                }
                return _context5.a(2, this.llm.post(task.payload));
              case 2:
                return _context5.a(2, _wrapAsyncGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
                  return _regenerator().w(function (_context4) {
                    while (1) switch (_context4.n) {
                      case 0:
                        _context4.n = 1;
                        return {
                          status: 'completed',
                          task: task
                        };
                      case 1:
                        return _context4.a(2);
                    }
                  }, _callee4);
                }))());
            }
          }, _callee5, this);
        }));
        function executeStream(_x3) {
          return _executeStream.apply(this, arguments);
        }
        return executeStream;
      }()
    }, {
      key: "getHealth",
      value: function () {
        var _getHealth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
          var health, llmConnected, _t3;
          return _regenerator().w(function (_context6) {
            while (1) switch (_context6.p = _context6.n) {
              case 0:
                health = {
                  status: this.initialized ? 'healthy' : 'not_initialized',
                  timestamp: new Date().toISOString(),
                  components: {}
                }; // 检查 LLM 连接状态
                if (!this.llm) {
                  _context6.n = 4;
                  break;
                }
                _context6.p = 1;
                _context6.n = 2;
                return this.llm.isConnect();
              case 2:
                llmConnected = _context6.v;
                health.components.llm = {
                  status: llmConnected ? 'connected' : 'disconnected',
                  connected: llmConnected
                };
                _context6.n = 4;
                break;
              case 3:
                _context6.p = 3;
                _t3 = _context6.v;
                health.components.llm = {
                  status: 'error',
                  error: _t3.message
                };
              case 4:
                return _context6.a(2, health);
            }
          }, _callee6, this, [[1, 3]]);
        }));
        function getHealth() {
          return _getHealth.apply(this, arguments);
        }
        return getHealth;
      }()
    }, {
      key: "getCapabilities",
      value: function () {
        var _getCapabilities = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
          var capabilities;
          return _regenerator().w(function (_context7) {
            while (1) switch (_context7.n) {
              case 0:
                capabilities = {
                  core: ['execute', 'executeBatch', 'executeStream', 'getHealth'],
                  llm: this.llm ? ['post', 'isConnect', 'streamRequest'] : [],
                  prompt: this.promptBuilder ? ['build', 'getTemplates', 'addTemplate'] : []
                };
                return _context7.a(2, capabilities);
            }
          }, _callee7, this);
        }));
        function getCapabilities() {
          return _getCapabilities.apply(this, arguments);
        }
        return getCapabilities;
      }()
    }, {
      key: "shutdown",
      value: function () {
        var _shutdown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
          return _regenerator().w(function (_context8) {
            while (1) switch (_context8.n) {
              case 0:
                this.initialized = false;
                this.llm = null;
                this.promptBuilder = null;
              case 1:
                return _context8.a(2);
            }
          }, _callee8, this);
        }));
        function shutdown() {
          return _shutdown.apply(this, arguments);
        }
        return shutdown;
      }()
    }]);
  }();

  // 快速启动
  function quickStart() {
    return _quickStart.apply(this, arguments);
  }

  // 页面分析
  function _quickStart() {
    _quickStart = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var preset,
        options,
        agent,
        _args9 = arguments;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            preset = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : 'basic';
            options = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {};
            agent = new AgentCore(_objectSpread2(_objectSpread2({}, PRESET_CONFIGS[preset]), options));
            _context9.n = 1;
            return agent.initialize();
          case 1:
            if (!options.task) {
              _context9.n = 2;
              break;
            }
            return _context9.a(2, agent.execute(options.task));
          case 2:
            return _context9.a(2, agent);
        }
      }, _callee9);
    }));
    return _quickStart.apply(this, arguments);
  }
  function analyzePage(_x4) {
    return _analyzePage.apply(this, arguments);
  }

  // DOM 操作
  function _analyzePage() {
    _analyzePage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(url) {
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            return _context0.a(2, {
              pageInfo: {
                url: url,
                title: 'Demo Page'
              },
              domStructure: '<html>...</html>'
            });
        }
      }, _callee0);
    }));
    return _analyzePage.apply(this, arguments);
  }
  function manipulateDOM(_x5) {
    return _manipulateDOM.apply(this, arguments);
  }

  // 批量处理
  function _manipulateDOM() {
    _manipulateDOM = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(url) {
      var actions,
        _args1 = arguments;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            actions = _args1.length > 1 && _args1[1] !== undefined ? _args1[1] : [];
            return _context1.a(2, {
              url: url,
              actions: actions,
              result: 'DOM 操作已模拟执行'
            });
        }
      }, _callee1);
    }));
    return _manipulateDOM.apply(this, arguments);
  }
  function batchProcess(_x6) {
    return _batchProcess.apply(this, arguments);
  }

  // 创建 agent（支持预设名或自定义配置）
  function _batchProcess() {
    _batchProcess = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(tasks) {
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            return _context10.a(2, tasks.map(function (task) {
              return _objectSpread2(_objectSpread2({}, task), {}, {
                status: 'done'
              });
            }));
        }
      }, _callee10);
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

  exports.AgentCore = AgentCore;
  exports.LLM = LLM;
  exports.LLMFactory = LLMFactory;
  exports.PRESET_CONFIGS = PRESET_CONFIGS;
  exports.PROMPT_TEMPLATES = PROMPT_TEMPLATES;
  exports.PromptBuilder = PromptBuilder;
  exports.analyzePage = analyzePage;
  exports.batchProcess = batchProcess;
  exports.createAgent = createAgent;
  exports.createAssistantPrompt = createAssistantPrompt;
  exports.createFunctionPrompt = createFunctionPrompt;
  exports.createLLMAgent = createLLMAgent;
  exports.createOpenAIAgent = createOpenAIAgent;
  exports.createOpenAILLM = createOpenAILLM;
  exports.createSparkAgent = createSparkAgent;
  exports.createSparkLLM = createSparkLLM;
  exports.createSystemPrompt = createSystemPrompt;
  exports.createUserPrompt = createUserPrompt;
  exports.llmStreamRequest = llmStreamRequest;
  exports.manipulateDOM = manipulateDOM;
  exports.openaiRequestHandler = openaiRequestHandler;
  exports.quickStart = quickStart;
  exports.sparkRequestHandler = sparkRequestHandler;
  exports.sparkStreamRequest = sparkStreamRequest;

}));
