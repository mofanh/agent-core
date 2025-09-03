# MCP (Model Context Protocol) 集成文档

## 📋 项目概述

基于对codex-rs中MCP实现的分析，我们已经在agent-core中完成了完整的MCP协议支持，使其能够真正调用外部服务而不是仅仅模拟响应。

## ✅ 完成状态

**🎉 所有计划的功能已经完成！** MCP模块现已完全集成到agent-core的主工作流中。

**项目状态**: ✅ 完成  
**完成日期**: 2025年8月25日  
**开发阶段**: 5个阶段全部完成  

## 🗂️ 文件结构

```
src/mcp/
├── types.js              # MCP协议类型定义和验证
├── client.js             # MCP客户端实现
├── connection-manager.js # 连接池和负载均衡
├── tool-system.js        # 工具调用系统
└── index.js              # MCP模块入口

examples/
└── mcp-integration.js    # 完整使用示例

test/
└── mcp-integration.test.js # 集成测试套件

docs/
└── mcp_dev.md           # 本文档
```

## 🚀 实施阶段

### ✅ 阶段1: MCP类型定义和基础结构
- [x] 参考codex-rs创建MCP协议类型定义 (`/src/mcp/types.js`)
- [x] 实现JSON-RPC通信基础
- [x] 创建消息验证系统
- [x] 添加工厂函数和常量定义

**关键实现**:
- `createJsonRpcRequest()` - JSON-RPC请求构造器
- `validateMCPMessage()` - 消息验证器
- `MCP_METHODS` - 协议方法常量
- 完整的JSDoc类型定义

### ✅ 阶段2: MCP客户端实现  
- [x] 实现stdio和HTTP传输层 (`/src/mcp/client.js`)
- [x] 添加连接生命周期管理
- [x] 实现协议握手和能力协商
- [x] 错误处理和重试机制

**关键实现**:
- `MCPClient` 类 - 主要客户端实现
- `connect()` - 连接建立和握手
- `sendRequest()` - 请求发送和响应处理
- stdio/HTTP双传输层支持

### ✅ 阶段3: 连接管理和负载均衡
- [x] 连接池管理 (`/src/mcp/connection-manager.js`)
- [x] 多种负载均衡策略（轮询、随机、最少连接）
- [x] 健康检查和自动重连
- [x] 连接状态监控

**关键实现**:
- `MCPConnectionManager` 类 - 连接池管理器
- `getConnection()` - 智能连接选择
- `healthCheck()` - 连接健康监控
- 多种负载均衡算法

### ✅ 阶段4: 工具系统集成
- [x] 工具发现和调用 (`/src/mcp/tool-system.js`)
- [x] 参数验证和类型检查
- [x] 工具链执行器
- [x] 执行指标和监控

**关键实现**:
- `MCPToolSystem` 类 - 高级工具调用系统
- `callTool()` - 工具调用接口
- `executeToolChain()` - 工具链执行
- `validateArgs()` - 参数验证

### ✅ 阶段5: 主工作流集成
- [x] 集成MCP到AgentCore (`/src/index.js`)
- [x] 实现混合LLM+MCP任务类型
- [x] 添加预设代理和工厂函数
- [x] 完整的事件系统集成

**关键实现**:
- `AgentCore` 扩展了MCP功能
- 新任务类型：`mcp_tool`, `mcp_chain`, `hybrid`
- 工厂函数：`createMCPAgent()`, `createSmartAgent()`
- 事件驱动架构支持

## 🛠️ 核心功能

### MCP协议支持
- ✅ JSON-RPC 2.0完整实现
- ✅ stdio和HTTP传输层
- ✅ 协议版本协商
- ✅ 能力发现和交换

### 连接管理
- ✅ 连接池和负载均衡
- ✅ 自动故障转移
- ✅ 健康检查和监控
- ✅ 连接重试和恢复

### 工具调用
- ✅ 动态工具发现
- ✅ 参数验证和类型检查
- ✅ 工具链执行
- ✅ 结果缓存和指标

### 任务执行
- ✅ MCP工具任务
- ✅ MCP工具链任务
- ✅ 混合LLM+MCP任务
- ✅ 复杂工作流支持

## 📖 使用示例

### 基础MCP工具调用
```javascript
import { createMCPAgent } from 'agent-core';

const agent = await createMCPAgent({
  servers: [
    { name: 'web', transport: 'stdio', command: 'web-mcp-server' }
  ]
});

const result = await agent.callTool('fetch_page', { 
  url: 'https://example.com' 
});
```

### 混合LLM+MCP任务
```javascript
import { createSmartAgent } from 'agent-core';

const agent = await createSmartAgent({
  llm: { provider: 'openai', options: { model: 'gpt-4' } },
  mcp: { servers: [{ name: 'web', transport: 'stdio', command: 'web-server' }] }
});

const result = await agent.execute({
  type: 'hybrid',
  initialPrompt: { messages: [{ role: 'user', content: '分析网站内容' }] },
  workflow: [
    { type: 'mcp_tool', name: 'fetch', toolName: 'fetch_page', args: { url: 'https://example.com' } },
    { type: 'llm', name: 'analyze', prompt: (data) => ({ messages: [{ role: 'user', content: `分析: ${data.fetch}` }] }) }
  ]
});
```

### 工具链执行
```javascript
const chainResult = await agent.executeToolChain([
  { tool: 'fetch_page', args: { url: 'https://example.com' } },
  { tool: 'extract_text', dataMapping: (data, results) => ({ html: results[0]?.data?.content }) },
  { tool: 'summarize', dataMapping: (data, results) => ({ text: results[1]?.data?.text }) }
]);
```

## 🧪 测试覆盖

完整的测试套件位于 `/test/mcp-integration.test.js`，覆盖：

- ✅ MCP系统创建和初始化
- ✅ 工具调用和参数验证
- ✅ 工具链执行
- ✅ 混合任务执行
- ✅ 错误处理和恢复
- ✅ 状态监控和事件
- ✅ 端到端集成测试

## 🔧 配置选项

### MCP服务器配置
```javascript
{
  servers: [
    {
      name: 'server-name',           // 服务器标识
      transport: 'stdio' | 'http',  // 传输方式
      command: 'server-command',    // stdio命令
      url: 'http://localhost:3000', // HTTP URL
      timeout: 30000,               // 超时时间
      retries: 3                    // 重试次数
    }
  ],
  loadBalancing: 'round-robin' | 'random' | 'least-connections',
  healthCheckInterval: 30000,
  maxConnections: 10
}
```

### 代理配置
```javascript
{
  llm: {
    provider: 'openai' | 'anthropic' | 'mock',
    options: { /* provider-specific options */ }
  },
  mcp: { /* MCP configuration */ },
  timeout: 120000,
  retries: 3
}
```

## 📈 性能特性

- **连接复用**: 智能连接池避免重复建立连接
- **负载均衡**: 多种策略优化服务器利用率
- **故障转移**: 自动切换到健康的服务器
- **并行执行**: 工具链支持并行调用
- **缓存机制**: 工具结果和连接状态缓存
- **监控指标**: 完整的执行和性能指标

## 🔍 监控和调试

### 状态检查
```javascript
const status = agent.getMCPStatus();     // MCP系统状态
const health = await agent.getHealth();  // 整体健康状态
const caps = await agent.getCapabilities(); // 系统能力
```

### 事件监听
```javascript
agent.on('mcpConnectionChanged', ({ name, status }) => {
  console.log(`连接 ${name} 状态: ${status}`);
});

agent.on('mcpToolCalled', ({ toolName, connection, duration }) => {
  console.log(`工具 ${toolName} 执行时间: ${duration}ms`);
});
```

## 🚦 使用建议

### 开发环境
1. 确保所需的MCP服务器已安装和配置
2. 使用 `examples/mcp-integration.js` 作为起点
3. 启用详细日志进行调试

### 生产环境
1. 配置适当的超时和重试策略
2. 监控连接健康状态
3. 实施错误处理和降级方案
4. 定期检查性能指标

### 最佳实践
- 使用连接池避免频繁连接建立
- 实施工具参数验证防止错误调用
- 配置健康检查确保服务可用性
- 使用工具链优化复杂操作流程

## 🔗 相关链接

- [MCP协议规范](https://modelcontextprotocol.io/)
- [agent-core主文档](../README.md)
- [使用示例](../examples/mcp-integration.js)
- [测试套件](../test/mcp-integration.test.js)

---

**项目完成** ✅  
MCP集成已全面完成，agent-core现在具备了真正的外部服务调用能力！
