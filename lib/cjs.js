'use strict';

function _OverloadYield(e, d) {
  this.v = e, this.k = d;
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
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
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

// agent-core 主入口，根据 README 示例导出核心 API

// 预设配置
var PRESET_CONFIGS = {
  basic: {
    name: 'basic',
    description: '基础配置'
  },
  performance: {
    name: 'performance',
    description: '性能优化配置'
  },
  debug: {
    name: 'debug',
    description: '调试配置'
  }
};

// AgentCore 主类（简化实现）
var AgentCore = /*#__PURE__*/function () {
  function AgentCore() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, AgentCore);
    this.config = config;
    this.initialized = false;
  }
  return _createClass(AgentCore, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              this.initialized = true;
              return _context.a(2, true);
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
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              return _context2.a(2, {
                status: 'executed',
                task: task
              });
          }
        }, _callee2);
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
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              return _context3.a(2, tasks.map(function (task) {
                return {
                  status: 'executed',
                  task: task
                };
              }));
          }
        }, _callee3);
      }));
      function executeBatch(_x2) {
        return _executeBatch.apply(this, arguments);
      }
      return executeBatch;
    }()
  }, {
    key: "executeStream",
    value: function () {
      var _executeStream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(task) {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              return _context4.a(2, {
                status: 'streaming',
                task: task
              });
          }
        }, _callee4);
      }));
      function executeStream(_x3) {
        return _executeStream.apply(this, arguments);
      }
      return executeStream;
    }()
  }, {
    key: "getHealth",
    value: function () {
      var _getHealth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              return _context5.a(2, {
                healthy: true
              });
          }
        }, _callee5);
      }));
      function getHealth() {
        return _getHealth.apply(this, arguments);
      }
      return getHealth;
    }()
  }, {
    key: "getCapabilities",
    value: function () {
      var _getCapabilities = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              return _context6.a(2, {
                capabilities: ['analyze', 'dom', 'form']
              });
          }
        }, _callee6);
      }));
      function getCapabilities() {
        return _getCapabilities.apply(this, arguments);
      }
      return getCapabilities;
    }()
  }, {
    key: "shutdown",
    value: function () {
      var _shutdown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              this.initialized = false;
              return _context7.a(2, true);
          }
        }, _callee7, this);
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
  _quickStart = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var preset,
      options,
      agent,
      _args8 = arguments;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          preset = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : 'basic';
          options = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
          agent = new AgentCore(_objectSpread2(_objectSpread2({}, PRESET_CONFIGS[preset]), options));
          _context8.n = 1;
          return agent.initialize();
        case 1:
          return _context8.a(2, agent.execute(options));
      }
    }, _callee8);
  }));
  return _quickStart.apply(this, arguments);
}
function analyzePage(_x4) {
  return _analyzePage.apply(this, arguments);
}

// DOM 操作
function _analyzePage() {
  _analyzePage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(url) {
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          return _context9.a(2, {
            pageInfo: {
              url: url,
              title: 'Demo Page'
            },
            domStructure: '<html>...</html>'
          });
      }
    }, _callee9);
  }));
  return _analyzePage.apply(this, arguments);
}
function manipulateDOM(_x5) {
  return _manipulateDOM.apply(this, arguments);
}

// 批量处理
function _manipulateDOM() {
  _manipulateDOM = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(url) {
    var actions,
      _args0 = arguments;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          actions = _args0.length > 1 && _args0[1] !== undefined ? _args0[1] : [];
          return _context0.a(2, {
            url: url,
            actions: actions,
            result: 'DOM 操作已模拟执行'
          });
      }
    }, _callee0);
  }));
  return _manipulateDOM.apply(this, arguments);
}
function batchProcess(_x6) {
  return _batchProcess.apply(this, arguments);
}

// 创建 agent（支持预设名或自定义配置）
function _batchProcess() {
  _batchProcess = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(tasks) {
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          return _context1.a(2, tasks.map(function (task) {
            return _objectSpread2(_objectSpread2({}, task), {}, {
              status: 'done'
            });
          }));
      }
    }, _callee1);
  }));
  return _batchProcess.apply(this, arguments);
}
function createAgent(presetOrConfig) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof presetOrConfig === 'string') {
    return new AgentCore(_objectSpread2(_objectSpread2({}, PRESET_CONFIGS[presetOrConfig]), options));
  }
  return new AgentCore(_objectSpread2({}, presetOrConfig));
}

exports.AgentCore = AgentCore;
exports.PRESET_CONFIGS = PRESET_CONFIGS;
exports.analyzePage = analyzePage;
exports.batchProcess = batchProcess;
exports.createAgent = createAgent;
exports.llmStreamRequest = llmStreamRequest;
exports.manipulateDOM = manipulateDOM;
exports.quickStart = quickStart;
