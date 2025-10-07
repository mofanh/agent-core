# Chrome DevTools MCP evaluate_script 语法指南

## 问题背景

在使用 Chrome DevTools MCP 的 `evaluate_script` 工具时，需要注意其特殊的语法要求，与传统的 JavaScript 执行有所不同。

## 语法规则

### ✅ 正确用法

#### 1. 简单表达式（推荐）

对于简单的计算或属性访问，直接写表达式：

```javascript
{
  tool: 'evaluate_script',
  args: {
    function: '1 + 1'  // ✅ 直接写表达式
  }
}

{
  tool: 'evaluate_script',
  args: {
    function: 'document.title'  // ✅ 直接访问属性
  }
}
```

#### 2. 复杂逻辑使用 IIFE

对于需要多行代码或临时变量的情况，使用立即执行函数表达式（IIFE）：

```javascript
{
  tool: 'evaluate_script',
  args: {
    function: `(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent : null;
    })()`  // ✅ 使用 IIFE 包裹
  }
}
```

#### 3. 复杂数据提取

```javascript
{
  tool: 'evaluate_script',
  args: {
    function: `(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return JSON.stringify(
        links.map(a => ({ 
          text: a.textContent.trim(), 
          href: a.href 
        })).slice(0, 5)
      );
    })()`
  }
}
```

### ❌ 错误用法

#### 1. 使用 `script` 参数而不是 `function`

```javascript
// ❌ 错误：参数名应该是 'function' 而不是 'script'
{
  tool: 'evaluate_script',
  args: {
    script: 'document.title'  // ❌ 错误的参数名
  }
}
```

#### 2. 顶层使用 `const`/`let`/`var`

```javascript
// ❌ 错误：不能在顶层使用变量声明
{
  tool: 'evaluate_script',
  args: {
    function: `
      const h1 = document.querySelector('h1');
      h1.textContent;
    `  // ❌ 错误：Unexpected token 'const'
  }
}
```

#### 3. 顶层使用 `return`

```javascript
// ❌ 错误：不能在顶层使用 return
{
  tool: 'evaluate_script',
  args: {
    function: 'return 1 + 1;'  // ❌ 错误：Unexpected token 'return'
  }
}
```

## 完整示例对比

### 旧写法（browser.evaluate）vs 新写法（Chrome DevTools MCP）

#### 示例 1：获取页面标题

```javascript
// 旧写法（browser.evaluate）
{
  tool: 'browser.evaluate',
  args: {
    script: 'document.title',  // 使用 'script' 参数
    allowDangerousAPIs: false
  }
}

// 新写法（Chrome DevTools MCP）
{
  tool: 'evaluate_script',
  args: {
    function: 'document.title'  // 使用 'function' 参数，语法相同
  }
}
```

#### 示例 2：复杂提取

```javascript
// 旧写法（browser.evaluate）
{
  tool: 'browser.evaluate',
  args: {
    script: `
      const headers = Array.from(document.querySelectorAll('h1, h2, h3'));
      headers.map(h => ({
        tag: h.tagName,
        text: h.textContent.trim()
      })).slice(0, 5);
    `
  }
}

// 新写法（Chrome DevTools MCP）
{
  tool: 'evaluate_script',
  args: {
    function: `(() => {
      const headers = Array.from(document.querySelectorAll('h1, h2, h3'));
      return headers.map(h => ({
        tag: h.tagName,
        text: h.textContent.trim()
      })).slice(0, 5);
    })()`  // 使用 IIFE 包裹，并显式 return
  }
}
```

## 返回值格式

Chrome DevTools MCP 的返回格式：

```javascript
{
  success: true,
  data: {
    content: [
      {
        type: 'text',
        text: '执行结果字符串'
      }
    ]
  },
  duration: 123,
  context: { /* ... */ }
}
```

## 最佳实践

### 1. 优先使用简单表达式

```javascript
// ✅ 好：简洁直接
function: 'document.title'

// ⚠️ 可以但不必要
function: `(() => { return document.title; })()`
```

### 2. 复杂逻辑才用 IIFE

只有当需要多行代码、临时变量或控制流时才使用 IIFE：

```javascript
// ✅ 好：需要临时变量和逻辑
function: `(() => {
  const elements = document.querySelectorAll('.item');
  if (elements.length === 0) return null;
  return Array.from(elements).map(el => el.textContent);
})()`
```

### 3. 使用 JSON.stringify 返回复杂对象

```javascript
// ✅ 好：返回结构化数据
function: `(() => {
  return JSON.stringify({
    url: window.location.href,
    title: document.title,
    linkCount: document.querySelectorAll('a').length
  });
})()`
```

## 调试技巧

### 1. 检查返回值

```javascript
const result = await agent.mcpSystem.callTool('evaluate_script', {
  function: 'document.title'
});

console.log('Success:', result.success);
console.log('Result:', result.data.content[0].text);
```

### 2. 错误处理

```javascript
try {
  const result = await agent.mcpSystem.callTool('evaluate_script', {
    function: `(() => {
      const el = document.querySelector('#not-exist');
      return el ? el.textContent : 'Element not found';
    })()`
  });
} catch (error) {
  console.error('Evaluation failed:', error.message);
}
```

## 常见错误及解决方案

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `Field 'function' is required` | 使用了 `script` 而不是 `function` | 将参数名改为 `function` |
| `Unexpected token 'const'` | 顶层使用了变量声明 | 用 IIFE 包裹代码 |
| `Unexpected token 'return'` | 顶层使用了 return 语句 | 移除 return 或用 IIFE 包裹 |
| `fn is not a function` | 语法正确但语义错误 | 检查 JavaScript 代码逻辑 |

## 总结

Chrome DevTools MCP 的 `evaluate_script` 工具要求：

1. ✅ 使用 `function` 参数（不是 `script`）
2. ✅ 简单表达式直接写
3. ✅ 复杂逻辑用 IIFE `(() => { ... })()`
4. ❌ 不能在顶层使用 `const`/`let`/`var`
5. ❌ 不能在顶层使用 `return`

遵循这些规则，就能正确使用 Chrome DevTools MCP 进行页面自动化操作！
