# 统一 LLM Agent 架构

## 概述

新的统一 LLM Agent 架构解决了您提出的问题：让 LLM 只通过标准的工具调用 JSON 格式来操作所有工具，而不需要直接接触底层实现。这个架构统一了浏览器本地工具和 MCP 工具的调用方式。

## 架构特点

### 🎯 核心理念
- **统一接口**：LLM 只需要输出标准的工具调用 JSON
- **透明调用**：LLM 不需要知道工具是本地浏览器工具还是 MCP 工具
- **智能解析**：自动解析 LLM 响应中的工具调用
- **统一管理**：所有工具通过统一的注册表进行管理

### 🏗️ 架构层次

```
┌─────────────────────┐
│       LLM 层        │  输出标准 JSON 格式的工具调用
├─────────────────────┤
│   统一调用解析层     │  解析 LLM 输出，分发工具调用
├─────────────────────┤
│   统一工具注册表     │  管理所有可用工具
├─────────────────────┤
│  本地工具 │ MCP工具 │  实际的工具实现
└─────────────────────┘
```

## 核心组件

### 1. UnifiedLLMAgent
主要的统一 Agent 类，负责：
- 初始化和管理所有工具系统
- 解析 LLM 输出的工具调用 JSON
- 分发工具调用到正确的处理器
- 统计和监控功能

### 2. 工具注册表
统一管理所有工具，包括：
- 浏览器本地工具
- MCP 远程工具
- 工具元数据和 Schema

### 3. 智能解析器
自动解析多种格式的 LLM 输出：
- JSON 代码块格式
- 函数调用格式
- 混合文本中的工具调用

## 使用示例

### 基础用法

```javascript
import { createUnifiedLLMAgent } from './src/llm/unified-agent.js';

// 创建统一 Agent
const agent = createUnifiedLLMAgent({
  // 配置 LLM
  llm: {
    provider: 'spark',
    options: { apiKey: 'your-api-key' }
  },
  
  // 配置浏览器工具（本地）
  browser: {
    enabled: true,
    headless: false
  },
  
  // 配置 MCP 服务器（可选）
  mcp: {
    servers: [
      { name: 'web-search', command: 'web-search-server' }
    ]
  }
});

// 初始化
await agent.initialize();

// LLM 输出工具调用的示例
const llmResponse = {
  content: `我需要访问网页：

\`\`\`json
[
  {
    "id": "call_1",
    "name": "browser.navigate", 
    "args": {
      "url": "https://example.com"
    }
  }
]
\`\`\``
};

// 自动解析和执行工具调用
const result = await agent.executeTask({
  type: 'llm_with_tools',
  prompt: { messages: [{ role: 'user', content: '访问示例网站' }] },
  autoExecuteTools: true
});
```

### LLM 工具调用格式

LLM 只需要输出以下标准格式：

```json
[
  {
    "id": "call_1", 
    "name": "browser.navigate",
    "args": {
      "url": "https://example.com",
      "waitUntil": "networkidle2"
    }
  },
  {
    "id": "call_2",
    "name": "browser.extract", 
    "args": {
      "selector": "h1",
      "attribute": "text"
    }
  }
]
```

## 支持的工具

### 浏览器工具（本地）
- `browser.navigate` - 页面导航
- `browser.extract` - 内容提取
- `browser.click` - 点击操作
- `browser.type` - 文本输入
- `browser.hover` - 悬停操作
- `browser.screenshot` - 页面截图
- `browser.evaluate` - JavaScript 执行

### MCP 工具（远程）
- 可以集成任意 MCP 服务器提供的工具
- 自动发现和注册 MCP 工具
- 统一的调用接口

## 运行演示

### 1. 基础架构测试
```bash
node test-unified-basic.js
```

### 2. LLM 工具调用解析演示
```bash
node demo-llm-tool-calling.js
```

### 3. 完整的 LLM + 工具协作演示
```bash
node demo-unified-architecture.js
```

## 优势

### 🎯 对 LLM 来说
- **简单统一**：只需要输出标准 JSON 格式
- **无需区分**：不需要知道工具是本地还是远程
- **灵活组合**：可以在一次响应中调用多个工具

### 🔧 对开发者来说
- **易于扩展**：新工具自动集成到统一接口
- **透明管理**：统一的工具注册和管理
- **性能监控**：内置统计和监控功能

### 🏗️ 对系统来说
- **架构清晰**：明确的层次分离
- **易于维护**：统一的错误处理和日志
- **高度可测试**：每个层次都可以独立测试

## 与原有架构的对比

### 原有架构问题
- LLM 需要直接调用不同类型的工具
- 浏览器工具和 MCP 工具调用方式不统一
- 工具管理分散，难以统一监控

### 新架构优势
- LLM 只需要输出标准 JSON
- 所有工具调用统一到一个接口
- 集中式工具管理和监控
- 更好的扩展性和维护性

## 技术实现

### 核心文件
- `src/llm/unified-agent.js` - 统一 Agent 实现
- `src/mcp/unified-browser-server.js` - 统一浏览器 MCP 服务器
- `src/mcp/unified-browser-client.js` - 统一浏览器 MCP 客户端

### 集成到现有系统
新架构完全向后兼容，可以逐步迁移：

```javascript
// 旧方式（仍然支持）
const result = await agent.handleToolCall('browser.navigate', { url: 'https://example.com' });

// 新方式（推荐）
const agent = createUnifiedLLMAgent(config);
await agent.executeTask({
  type: 'llm_with_tools',
  prompt: llmPrompt,
  autoExecuteTools: true
});
```

这个统一架构实现了您要求的目标：让 LLM 通过标准的工具调用 JSON 来统一操作所有工具，而不需要直接接触底层实现细节。
