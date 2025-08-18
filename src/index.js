// 一个简单的第三方库 demo，支持多种模块规范导出

function hello(name = 'World') {
  return `Hello, ${name}!`;
}

// CommonJS 导出
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { hello };
}

// ES6 导出
export { hello };

// UMD 导出
if (typeof window !== 'undefined') {
  window.DemoLib = { hello };
}
