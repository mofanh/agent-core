# agent-cli-simple 优化说明

## 概述

基于 `test-real-website-mcp.js` 的成功经验，`agent-cli-simple.js` 已优化支持 MCP (Model Context Protocol) 配置调用框架。

## 主要改进

### 1. MCP 配置支持

- 自动加载 `~/.agent-core/config.toml` 或 `config.json` 配置文件
- 支持 Codex 风格的 `[mcp_servers]` 配置
- 优先使用 MCP 工具，如果未配置则回退到内置浏览器工具
- 支持 `--no-mcp` 选项强制使用内置工具

### 2. 配置管理命令

```bash
# 显示当前配置信息
node bin/agent-cli-simple.js config
```

输出包括：
- 配置文件路径和格式
- MCP 服务器列表
- 每个服务器的详细信息（命令、参数、环境变量等）

### 3. 增强的工具结果展示

- 支持 MCP 工具返回格式：`{ success: true, data: { content: [...] } }`
- 支持内置工具返回格式
- 智能识别和格式化不同类型的内容（文本、图片、资源等）
- 更友好的结果摘要显示

### 4. 改进的初始化流程

```javascript
// 1. 加载 MCP 配置
// 2. 创建 Agent（根据配置选择 MCP 或内置工具）
// 3. 初始化 Agent
// 4. 初始化 MCP 系统（如果配置了）
// 5. 显示所有可用工具
```

### 5. 更好的错误处理

- 配置加载失败时自动回退到内置工具
- MCP 初始化失败时给出明确提示
- 异常时确保资源正确清理

## 使用示例

### 前置条件

确保使用 Node.js 22.20.0：

```bash
# 使用 nvm 切换版本
nvm use 22.20.0

# 或者设置默认版本
nvm alias default 22.20.0
```

### 基本使用（自动使用 MCP 配置）

```bash
node bin/agent-cli-simple.js exec "访问 https://course.rs 并告诉我页面标题"
```

### 使用内置浏览器工具

```bash
node bin/agent-cli-simple.js exec "访问网站" --no-mcp --headless
```

### 查看配置

```bash
node bin/agent-cli-simple.js config
```

### 指定最大迭代次数

```bash
node bin/agent-cli-simple.js exec "复杂任务" --max-iterations 10
```

## 配置文件示例

### TOML 格式 (`~/.agent-core/config.toml`)

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = [
  "-y",
  "@automatalabs/mcp-server-chrome-devtools@latest"
]
transport = "stdio"
enabled = true

[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
transport = "stdio"
enabled = true
```

### JSON 格式 (`~/.agent-core/config.json`)

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "@automatalabs/mcp-server-chrome-devtools@latest"
      ],
      "env": {}
    }
  }
}
```

## MCP 工具映射

| 内置工具 | MCP 工具 | 说明 |
|---------|---------|------|
| `browser.navigate` | `navigate_page` | 页面导航 |
| `browser.evaluate` | `evaluate_script` | 执行 JavaScript |
| `browser.screenshot` | `take_screenshot` | 页面截图 |
| `browser.extract` | - | 数据提取（MCP 通过 evaluate 实现） |

## 优势

1. **标准化接口**：使用 MCP 标准协议，可以轻松集成各种工具服务器
2. **灵活配置**：通过配置文件管理工具，无需修改代码
3. **向后兼容**：保留内置浏览器工具支持，平滑过渡
4. **可扩展性**：可以轻松添加新的 MCP 服务器（文件系统、数据库等）
5. **统一体验**：MCP 和内置工具使用相同的接口和流程

## 注意事项

1. **Node.js 版本要求**：MCP 服务器需要 Node.js 22.20.0 或更高版本
   ```bash
   # 如果使用 nvm，请先切换版本
   nvm use 22.20.0
   ```
2. **初始化时间**：MCP 服务器需要额外的初始化时间（约 2-5 秒）
3. **工具可用性**：确保 MCP 服务器命令可执行（如 `npx` 可用）
4. **环境变量**：某些 MCP 服务器可能需要特定的环境变量
5. **错误处理**：如果 MCP 初始化失败，会自动回退到内置工具

## 调试

启用调试模式：

```bash
DEBUG=true node bin/agent-cli-simple.js exec "任务"
```

## 测试

运行测试脚本（会自动切换到 Node.js 22.20.0）：

```bash
bash test-cli-simple-mcp.sh
```

或者手动测试：

```bash
# 先切换 Node.js 版本
nvm use 22.20.0

# 运行测试
node bin/agent-cli-simple.js exec "测试任务"
```

## 相关文件

- `bin/agent-cli-simple.js` - 主 CLI 程序
- `src/utils/config-loader.js` - 配置加载器
- `test-real-website-mcp.js` - MCP 测试示例
- `test-cli-simple-mcp.sh` - CLI 测试脚本
