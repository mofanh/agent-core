(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DemoLib = {}));
})(this, (function (exports) { 'use strict';

  // 一个简单的第三方库 demo，支持多种模块规范导出

  function hello() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'World';
    return "Hello, ".concat(name, "!");
  }

  // CommonJS 导出
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      hello: hello
    };
  }

  // UMD 导出
  if (typeof window !== 'undefined') {
    window.DemoLib = {
      hello: hello
    };
  }

  exports.hello = hello;

}));
