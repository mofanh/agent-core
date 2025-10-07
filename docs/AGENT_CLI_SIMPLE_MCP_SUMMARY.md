# agent-cli-simple MCP 优化完成总结

## 问题诊断

### 原始问题
- LLM 调用了不存在的工具 `web_browser`
- 工具注册表显示 0 个工具
- MCP 工具虽然加载但未正确注册

### 根本原因
1. **时序问题**：Agent 初始化时 MCP 工具还未加载
2. **缺少描述**：工具注册时没有保存 MCP 工具的描述信息
3. **初始化缺失**：没有显式调用 `mcpSystem.initialize()`

## 解决方案

### 1. 修复 src/llm/index.js

```javascript
// 注册 MCP 工具时保存描述
for (const tool of mcpTools) {
  this.toolRegistry.set(tool.name, {
    type: 'mcp',
    handler: this.mcpSystem.toolSystem,
    schema: tool.inputSchema,
    description: tool.description  // ✅ 添加描述
  });
}

// 生成工具描述时优先使用工具自带描述
generateToolDescription(name, info) {
  if (info.description) {
    return info.description;  // ✅ 优先使用
  }
  // fallback...
}
```

### 2. 修复 bin/agent-cli-simple.js

```javascript
// 添加 MCP 配置支持
import { loadConfig, extractMcpServers } from '../src/utils/config-loader.js';

// 加载配置
const { config } = loadConfig();
const mcpServers = extractMcpServers(config);

// 创建 Agent 时使用 MCP 配置
const agent = createLLMAgent({
  mcp: { servers: mcpServers },
  llm: { /*...*/ }
});

// 初始化 Agent
await agent.initialize();

// ✅ 关键修复：初始化 MCP 连接
if (agent.mcpSystem) {
  await agent.mcpSystem.initialize();
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // ✅ 重新注册工具（包含完整描述）
  const mcpTools = agent.mcpSystem.toolSystem.getTools();
  for (const tool of mcpTools) {
    agent.toolRegistry.set(tool.name, {
      type: 'mcp',
      handler: agent.mcpSystem.toolSystem,
      schema: tool.inputSchema,
      description: tool.description
    });
  }
}
```

### 3. 添加配置管理

```bash
# 显示配置信息
node bin/agent-cli-simple.js config

# 执行任务（自动使用 MCP）
node bin/agent-cli-simple.js exec "访问网站"

# 强制使用内置工具
node bin/agent-cli-simple.js exec "任务" --no-mcp
```

## 测试结果

### Before（优化前）
```
[INFO] 📝 注册了 0 个 MCP 工具
📝 已注册工具: 0 个

LLM 调用: web_browser ❌
错误: 未知工具: web_browser
```

### After（优化后）
```
✅ MCP 连接初始化完成
📦 MCP 工具已加载: 26 个
✅ 已重新注册 26 个 MCP 工具
📝 已注册工具: 26 个
   - list_console_messages (mcp): List all console messages...
   - navigate_page (mcp): Navigate to a URL...
   - click (mcp): Clicks on the provided element
   ...

LLM 调用: navigate_page ✅
成功: { success: true, data: {...} }
```

## 文件变更清单

### 修改的文件
1. `src/llm/index.js`
   - 保存 MCP 工具描述
   - 优先使用工具自带描述

2. `bin/agent-cli-simple.js`
   - 添加 MCP 配置支持
   - 初始化 MCP 连接
   - 重新注册工具
   - 添加 config 命令

3. `test-cli-simple-mcp.sh`
   - 添加 Node.js 版本切换
   - 自动使用 22.20.0

### 新增的文件
1. `test-mcp-tool-registration.js` - 工具注册测试脚本
2. `config.toml.example` - 配置文件示例
3. `docs/AGENT_CLI_SIMPLE_MCP.md` - 使用文档
4. `bin/mcp-wrapper.sh` - MCP 包装脚本（可选）

## 最佳实践

### 1. Node.js 版本
MCP 服务器需要 Node.js 22.20.0+：
```bash
nvm use 22.20.0
node bin/agent-cli-simple.js exec "任务"
```

### 2. 配置文件
推荐使用 TOML 格式（`~/.agent-core/config.toml`）：
```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["-y", "chrome-devtools-mcp@latest"]
```

### 3. 工具重新注册
在 MCP 系统初始化后，必须重新注册工具以获取完整描述：
```javascript
await agent.mcpSystem.initialize();
await new Promise(resolve => setTimeout(resolve, 3000)); // 等待工具加载
// 重新注册
```

### 4. 调试
启用调试模式查看详细信息：
```bash
DEBUG=true node bin/agent-cli-simple.js exec "任务"
```

## 已知问题

1. **连接错误**：MCP 服务器可能会超时重连，但不影响功能
2. **等待时间**：需要 3 秒等待工具加载，可以根据实际情况调整
3. **内置工具**：当前暂时禁用，如需使用可取消注释

## 下一步

1. ✅ 完善错误处理
2. ✅ 添加配置验证
3. ✅ 支持多个 MCP 服务器
4. ⬜ 添加工具缓存机制
5. ⬜ 优化工具加载时间
6. ⬜ 支持热重载工具

## 参考文档

- `docs/AGENT_CLI_SIMPLE_MCP.md` - 详细使用文档
- `test-real-website-mcp.js` - MCP 测试示例
- `docs/mcp_config.md` - MCP 配置说明
