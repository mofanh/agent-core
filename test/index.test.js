const { hello } = require('../lib/cjs');

describe('hello', () => {
  it('默认参数', () => {
    expect(hello()).toBe('Hello, World!');
  });
  it('自定义参数', () => {
    expect(hello('WebPilot')).toBe('Hello, WebPilot!');
  });
});
