# 测试迁移指南：从内置 Browser 工具到 Chrome DevTools MCP

## 概述

本文档说明如何将使用内置 `browser.*` 工具的测试代码迁移到使用配置化的 Chrome DevTools MCP。

## 核心差异对比

### 1. 初始化方式

#### 旧方式 (`test-real-website.js`)
```javascript
const agent = createLLMAgent({
  model: 'spark',
  apiKey: process.env.SPARK_API_KEY,
  appId: process.env.SPARK_APP_ID,
  apiSecret: process.env.SPARK_API_SECRET,
  browser: {
    headless: true,
    defaultTimeout: 30000
  }
});
```

#### 新方式 (`test-real-website-mcp.js`)
```javascript
// 1. 加载配置文件
const config = await loadConfig();
const mcpServers = extractMcpServers(config);

// 2. 创建 Agent 时传入 MCP 配置
const agent = createLLMAgent({
  model: 'spark',
  apiKey: process.env.SPARK_API_KEY,
  appId: process.env.SPARK_APP_ID,
  apiSecret: process.env.SPARK_API_SECRET,
  mcp: {
    servers: mcpServers  // 从配置文件加载
  }
});
```

**优势**：
- ✅ 配置与代码分离
- ✅ 无需修改代码即可切换 MCP 服务器
- ✅ 支持多个 MCP 服务器同时使用

### 2. 工具调用方式

#### 旧方式
```javascript
// 统一工具调用接口
const result = await agent.executeUnifiedToolCall({
  id: `test_${Date.now()}`,
  name: 'browser.navigate',
  args: { url: TEST_URL, waitUntil: 'networkidle2' }
});

// 结果格式：
// result.data?.data?.data?.statusCode
```

#### 新方式
```javascript
// 直接使用 MCP 系统
const result = await agent.mcpSystem.callTool('navigate_page', {
  url: TEST_URL
});

// 结果格式（MCP 标准）：
// result.content[0].text
```

**优势**：
- ✅ 使用 MCP 协议标准接口
- ✅ 结果格式统一 (MCP Content 格式)
- ✅ 更好的跨 MCP 服务器兼容性

### 3. 工具名称映射

| 内置工具 | Chrome DevTools MCP | 说明 |
|---------|-------------------|------|
| `browser.navigate` | `navigate_page` | 页面导航 |
| `browser.extract` | `evaluate_script` | 内容提取需用 JS 实现 |
| `browser.evaluate` | `evaluate_script` | JavaScript 执行 |
| `browser.screenshot` | `take_screenshot` | 页面截图 |

### 4. 内容提取重构

#### 旧方式：使用 `browser.extract`
```javascript
{
  tool: 'browser.extract',
  args: {
    selectors: 'h1',
    extractType: 'text'
  },
  validate: (result) => {
    return result.success && result.data?.data?.data?.results;
  }
}
```

#### 新方式：使用 `evaluate_script`（正确语法）
```javascript
{
  tool: 'evaluate_script',
  args: {
    function: `(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent : null;
    })()`  // 注意：使用 IIFE 包裹代码，参数名是 'function' 不是 'script'
  },
  validate: (result) => {
    return result && 
           result.success === true &&
           result.data &&
           result.data.content;
  }
}
```

**变化**：
- ❌ 没有专门的 extract 工具
- ✅ 使用 JavaScript 自己实现选择器逻辑
- ✅ 更灵活，可以执行复杂的提取逻辑
- ⚠️ 参数名是 `function` 而不是 `script`
- ⚠️ 复杂代码需要用 IIFE `(() => { ... })()` 包裹

### 5. 结果验证重构

#### 旧方式：深层嵌套
```javascript
validate: (result) => {
  return result.success && 
         result.data?.data?.data?.statusCode === 200;
}
```

#### 新方式：MCP 标准格式
```javascript
validate: (result) => {
  return result && 
         result.content && 
         Array.isArray(result.content) &&
         result.content.length > 0;
}
```

**MCP Content 标准格式**：
```javascript
{
  content: [
    {
      type: 'text',
      text: '结果内容'
    }
  ]
}
```

## 完整测试套件对比

### 导航测试

#### 旧实现
```javascript
{
  name: '导航到目标页面',
  tool: 'browser.navigate',
  args: {
    url: TEST_URL,
    waitUntil: 'networkidle2'
  },
  validate: (result) => {
    return result.success && result.data?.data?.data?.statusCode === 200;
  }
}
```

#### 新实现
```javascript
{
  name: '导航到目标页面',
  tool: 'navigate_page',
  args: {
    url: TEST_URL
  },
  validate: (result) => {
    return result && 
           result.content && 
           Array.isArray(result.content) &&
           result.content.length > 0;
  }
}
```

### 内容提取测试

#### 旧实现
```javascript
{
  name: '提取所有链接',
  tool: 'browser.extract',
  args: {
    selectors: 'a',
    extractType: 'attributes',
    attributes: ['href', 'text']
  },
  validate: (result) => {
    return result.success && result.data?.data?.data?.results?.main?.elements?.length > 0;
  }
}
```

#### 新实现（正确语法）
```javascript
{
  name: '提取所有链接',
  tool: 'evaluate_script',
  args: {
    function: `(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return JSON.stringify(
        links.map(a => ({ text: a.textContent.trim(), href: a.href })).slice(0, 5)
      );
    })()`  // 使用 IIFE 包裹，并使用 JSON.stringify 返回结构化数据
  },
  validate: (result) => {
    return result && 
           result.success === true &&
           result.data &&
           result.data.content;
  }
}
```

### 截图测试

#### 旧实现
```javascript
{
  name: '全页面截图',
  tool: 'browser.screenshot',
  args: {
    fullPage: true,
    format: 'png'
  },
  validate: (result) => {
    return result.success && 
           result.data?.data?.data?.dataUrl &&
           result.data.data.data.dataUrl.startsWith('data:image/');
  }
}
```

#### 新实现
```javascript
{
  name: '全页面截图',
  tool: 'take_screenshot',
  args: {
    name: 'test-full-page'
  },
  validate: (result) => {
    return result && (
      (result.content && result.content.length > 0) ||
      (result.content && Array.isArray(result.content) && result.content[0]?.text)
    );
  }
}
```

## 迁移步骤

### 1. 配置 Chrome DevTools MCP

```bash
# 初始化配置文件
node bin/agent-cli.js config init

# 查看配置
node bin/agent-cli.js config show
```

配置文件 `~/.agent-core/config.toml`:
```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]
env = {}
```

### 2. 修改测试代码

1. **添加配置加载**：
   ```javascript
   const { loadConfig, extractMcpServers } = require('./src/utils/config-loader');
   ```

2. **更新 Agent 初始化**：
   ```javascript
   const config = await loadConfig();
   const mcpServers = extractMcpServers(config);
   
   const agent = createLLMAgent({
     // ... 其他配置
     mcp: { servers: mcpServers }
   });
   ```

3. **更新工具调用**：
   - 将 `browser.navigate` 改为 `navigate_page`
   - 将 `browser.extract` 改为 `evaluate_script` + 自定义 JS
   - 将 `browser.evaluate` 改为 `evaluate_script`
   - 将 `browser.screenshot` 改为 `take_screenshot`
   - 使用 `agent.mcpSystem.callTool()` 替代 `agent.executeUnifiedToolCall()`

4. **更新结果验证**：
   - 修改为 MCP Content 格式: `result.content[0].text`
   - 移除深层嵌套: `result.data?.data?.data...`

### 3. 运行测试

```bash
# 旧版本
node test-real-website.js

# 新版本 (使用 MCP)
node test-real-website-mcp.js
```

## Chrome DevTools MCP 可用工具

测试代码中主要使用的工具：

| 工具名 | 功能 | 参数 |
|-------|------|------|
| `navigate_page` | 导航到 URL | `url` |
| `evaluate_script` | 执行 JavaScript | `script` |
| `take_screenshot` | 页面截图 | `name` (可选) |
| `get_dom_tree` | 获取 DOM 树 | 无 |
| `get_console_logs` | 获取控制台日志 | 无 |

完整工具列表参考：[chrome-devtools-mcp-quickstart.md](./chrome-devtools-mcp-quickstart.md)

## 常见问题

### Q: 为什么没有 `extract` 工具？

A: Chrome DevTools MCP 遵循原生浏览器 API，提供 `evaluate_script` 让你用 JavaScript 实现任何提取逻辑。这样更灵活且功能更强大。

### Q: 结果格式为什么变了？

A: MCP 协议使用标准的 Content 格式：
```javascript
{
  content: [
    { type: 'text', text: '...' },
    { type: 'image', data: '...' }
  ]
}
```
这是跨 MCP 服务器的统一格式。

### Q: 如何处理复杂的选择器？

A: 使用 `evaluate_script` 编写 JavaScript：
```javascript
{
  tool: 'evaluate_script',
  args: {
    script: `
      const selectors = ['h1', '.title', '#main-title'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el.textContent;
      }
      return null;
    `
  }
}
```

### Q: 如何同时使用多个 MCP 服务器？

A: 在配置文件中添加多个 `[mcp_servers.*]` 块：
```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]

[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
```

所有工具会自动合并到 `agent.mcpSystem` 中。

## 总结

**迁移收益**：
- ✅ 配置与代码完全分离
- ✅ 使用 MCP 标准协议
- ✅ 更好的可维护性
- ✅ 支持多 MCP 服务器组合
- ✅ 无需重新发布代码即可更换工具

**代码改动**：
- 📝 工具名称变化 (browser.* → MCP 工具名)
- 📝 调用方式变化 (executeUnifiedToolCall → mcpSystem.callTool)
- 📝 结果格式变化 (data.data.data → content[0].text)
- 📝 提取逻辑需自己用 JS 实现

**建议**：
1. 先运行 `node bin/agent-cli.js config init` 生成配置
2. 保留旧测试文件作为参考
3. 创建新测试文件使用 MCP
4. 逐步迁移，测试对比结果
