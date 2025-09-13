# Agent-Core 开发指南

Agent-Core 是一个现代化的智能代理框架，采用**分层模块化架构**设计，提供 LLM、浏览器自动化和 MCP 协议集成能力。

## 🏗️ 系统架构

### 核心分层设计

```
API Layer (index.js)     → 统一入口、工厂模式、配置管理
Service Layer            → LLM、Browser、MCP、Prompt 模块
Integration Layer        → MCP 服务器进程、工具链编排
Infrastructure Layer     → JSON-RPC、安全策略、日志系统
```

### 关键设计原则

- **模块化松耦合**：每个模块独立可测试，通过事件系统通信
- **工厂模式**：`LLMFactory`、`createMCPSystem`、`createBrowserToolSystem` 统一创建实例
- **进程隔离**：MCP 浏览器服务运行在独立进程，通过 stdio 通信
- **流式优先**：原生支持流式 LLM 响应和实时数据处理

## 🔧 开发工作流

### 构建和测试

```bash
# 开发构建（监听模式）
npm run build:watch

# 运行测试套件
npm test                    # Jest 测试
npm run test:cli           # CLI 集成测试
npm run test:spark         # 真实 API 测试

# MCP 浏览器服务
npm run mcp:browser        # 启动独立 MCP 服务器

# CLI 工具调试
npm run cli:debug          # LLM 连接调试
npm run cli:mcp            # MCP 系统调试
```

### 模块依赖关系

```javascript
// 核心依赖链
AgentCore → LLM/Prompt/Browser/MCP → EventEmitter
BrowserToolManager → Puppeteer → SecurityPolicy
MCPBrowserServer → @modelcontextprotocol/sdk → BrowserToolManager
```

## 🧩 关键模块实现模式

### 1. 浏览器工具系统

遵循 **两层架构模式**：MCP 代理层 + 本地工具执行层

```javascript
// MCP 服务器仅作为代理，实际执行由本地工具完成
case 'browser_navigate':
  result = await this.toolSystem.toolManager.executeLocalTool(
    'browser.navigate', args, `mcp-${Date.now()}`
  );
```

工具名称约定：`browser.{action}` (navigate/click/extract/type/screenshot/evaluate)

### 2. LLM 提供商扩展

使用**可插拔架构**，通过 `LLMFactory` 注册新提供商：

```javascript
// 注册新提供商的标准模式
LLMFactory.register(
  "provider-name",
  handlerFunction,
  connectionChecker,
  defaultOptions
);

// 内置提供商：'spark'（星火）、'openai'
const llm = createSparkLLM({ apiKey: "..." });
```

### 3. MCP 工具调用链路

**统一工具调用接口** (`handleToolCall`) 处理本地工具和 MCP 工具：

```javascript
// 本地浏览器工具优先匹配
if (this.browserToolManager?.isToolAvailable(toolName)) {
  return await this.browserToolManager.executeLocalTool(toolName, args, callId);
}

// 然后尝试 MCP 工具
if (this.mcpSystem?.toolSystem) {
  return await this.mcpSystem.toolSystem.callTool(toolName, args, { callId });
}
```

## 📦 项目特定约定

### 文件命名模式

- **Core modules**: `src/{module}/index.js` 作为模块入口
- **Tool implementations**: `src/browser/tools/{action}-tool.js`
- **MCP components**: `src/mcp/{component}.js` 和 `src/mcp/{component}-new.js` (新版本)
- **Examples**: `examples/{feature}-demo.js`，包含完整使用示例

### 配置系统约定

所有模块支持**预设配置** + **自定义覆盖**模式：

```javascript
// 预设：basic, performance, debug
const agent = new AgentCore({
  ...PRESET_CONFIGS.basic,
  browser: { enabled: true, headless: true },
  mcp: { servers: [...] }
});
```

### 错误处理模式

采用**结构化错误返回**，避免抛异常影响工作流：

```javascript
// 工具调用失败时返回结构化结果
return {
  success: false,
  error: `unsupported tool: ${toolName}`,
  toolName,
  callId,
};
```

## 🧪 测试和示例策略

### 测试文件组织

- `test/{feature}.test.js` - 单元测试
- `test/{feature}-integration.test.js` - 集成测试
- `examples/{feature}-demo.js` - 功能演示

### 关键测试模式

```javascript
// 流式响应安全测试模式
const maxChunks = 20;
let chunkCount = 0;
for await (const chunk of result) {
  if (chunkCount++ >= maxChunks) break; // 防止无限循环
}

// 浏览器工具安全测试
const agent = new AgentCore({
  browser: {
    security: {
      allowedDomains: ["*.example.com"],
      maxExecutionTime: 30000,
    },
  },
});
```

### 示例代码模式

每个示例包含**完整的生命周期管理**：

```javascript
async function demoFunction() {
  const agent = new AgentCore(config);
  try {
    await agent.initialize();
    // 功能演示代码
    const result = await agent.execute(task);
  } finally {
    await agent.shutdown(); // 确保资源清理
  }
}
```

## 💡 开发最佳实践

### 添加新的浏览器工具

1. 继承 `BaseBrowserTool` 类
2. 在 `BrowserToolManager.registerDefaultTools()` 中注册
3. 更新 `getSupportedTools()` 工具定义
4. 在 MCP 服务器中添加对应的 case 分支

### 扩展 MCP 集成

1. 在 `src/mcp/types.js` 中定义新的工具 schema
2. 使用 `createMCPSystem()` 统一创建和管理连接
3. 利用 `TOOL_CHAIN_TEMPLATES` 实现复杂工作流

### 性能优化指南

- **实例池化**：`BrowserInstancePool` 实现浏览器实例复用
- **连接缓存**：LLM 连接状态智能缓存 (`isConnect()`)
- **流控制**：合理限制流式响应的 chunk 数量
- **资源管理**：确保所有异步资源在 `shutdown()` 中正确清理

这个框架的核心价值在于**统一多种 AI 工具集成模式**，通过标准化的接口和工作流，让开发者能够快速构建复杂的智能代理应用。
