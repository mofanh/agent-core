# 🚨 CRITICAL: evaluate_script 用法修正

## ❌ 错误理解

之前的文档 (`chrome-devtools-mcp-evaluate-syntax.md`) **错误地建议**可以直接传入表达式如 `'document.title'`。

这是**错误的**!虽然测试通过了,但实际上返回的是错误消息 "fn is not a function"。

## 🔍 问题根源

### Chrome DevTools MCP 源码分析

从 `src/tools/script.ts` 第 43 行可以看到:

```typescript
const fn = await page.evaluateHandle(`(${request.params.function})`);
```

**这意味着传入的字符串会被包裹在括号里,然后作为函数调用!**

### 为什么会报错?

```javascript
// 你传入: 'document.title'
// 实际执行: (document.title)
// 结果: ❌ "fn is not a function" 因为 document.title 是字符串,不是函数!

// 你传入: '() => document.title'
// 实际执行: (() => document.title)
// 结果: ✅ 这是一个函数,可以正常调用!
```

## ✅ 正确用法 (来自官方测试)

从 `tests/tools/script.test.ts` 可以看到官方推荐的用法:

### 1. 简单返回值 - 使用箭头函数

```javascript
// ✅ 正确
{
  tool: 'evaluate_script',
  args: {
    function: '() => document.title'
  }
}

// ✅ 正确
{
  tool: 'evaluate_script',
  args: {
    function: '() => 2 * 5'
  }
}
```

### 2. 复杂逻辑 - 使用箭头函数 + 花括号

```javascript
// ✅ 正确
{
  tool: 'evaluate_script',
  args: {
    function: `() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent : null;
    }`
  }
}
```

### 3. 异步操作

```javascript
// ✅ 正确
{
  tool: 'evaluate_script',
  args: {
    function: `async () => {
      await new Promise(res => setTimeout(res, 100));
      return 'Done';
    }`
  }
}
```

### 4. 返回复杂对象

```javascript
// ✅ 正确
{
  tool: 'evaluate_script',
  args: {
    function: `() => {
      const scripts = Array.from(document.head.querySelectorAll('script'))
        .map(s => ({ src: s.src, async: s.async }));
      return { scripts };
    }`
  }
}
```

### 5. 使用参数 (通过 args)

```javascript
// ✅ 正确 - 带参数的函数
{
  tool: 'evaluate_script',
  args: {
    function: '(el) => el.innerText',
    args: [{ uid: '1_1' }]  // 传入元素 UID
  }
}

// ✅ 正确 - 多个参数
{
  tool: 'evaluate_script',
  args: {
    function: '(container, child) => container.contains(child)',
    args: [{ uid: '1_0' }, { uid: '1_1' }]
  }
}
```

### 6. 传统函数语法也可以

```javascript
// ✅ 正确 - 使用 function 关键字
{
  tool: 'evaluate_script',
  args: {
    function: 'function() { return document.title; }'
  }
}
```

## 🐛 为什么之前的测试"通过"了?

看 `test-real-website-mcp.js` 的验证代码:

```javascript
if (!result.success || !result.data?.content?.[0]?.text) {
  console.log('    ❌ 验证失败');
  return false;
}
```

**问题:** 验证只检查了 `result.success`,没有检查返回内容是否是错误消息!

即使返回 "fn is not a function",只要 MCP 调用成功 (`result.success = true`),测试就会通过。

## 📋 正确的测试验证

应该这样验证:

```javascript
// ❌ 不够严格
if (result.success) { /* ... */ }

// ✅ 严格验证
if (result.success && !result.data.content[0].text.includes('is not a function')) {
  // 真正成功
}
```

## 🔧 需要修复的文件

1. **`docs/chrome-devtools-mcp-evaluate-syntax.md`**
   - 删除所有 `function: 'document.title'` 的例子
   - 全部改为 `function: '() => document.title'`

2. **`test-real-website-mcp.js`**
   - 修复测试 3 和 4 的 function 参数
   - 增强验证逻辑,检查返回内容不包含错误消息

3. **`docs/chrome-devtools-mcp-quickstart.md`**
   - 更新所有示例代码

## 📚 参考资料

- **Chrome DevTools MCP 源码**: `src/tools/script.ts`
- **官方测试**: `tests/tools/script.test.ts`
- **工具文档**: https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md#evaluate_script

## 🎯 总结

| 写法 | 是否正确 | 原因 |
|------|---------|------|
| `'document.title'` | ❌ | 这是字符串,不是函数 |
| `'() => document.title'` | ✅ | 这是函数定义 |
| `'function() { return document.title; }'` | ✅ | 这是函数定义 |
| `'(() => document.title)()'` | ❌ | 会被双重执行 `((() => ...)())()` |

**核心规则**: 传入的必须是**函数定义**(可以不立即执行),Chrome DevTools MCP 内部会负责调用它!
