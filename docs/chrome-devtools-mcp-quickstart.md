# Chrome DevTools MCP 快速使用指南

## 🎯 已完成的配置

你的 Agent Core 已经配置好 Chrome DevTools MCP！配置文件位于：
```
~/.agent-core/config.toml
```

## 📋 当前配置

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]
```

这会自动通过 npx 运行最新版本的 Chrome DevTools MCP 服务器。

## 🚀 使用方法

### 方法 1: 交互式模式

```bash
cd /Users/bojingli/self/project/agent/agent-core
node bin/agent-cli.js interactive
```

然后输入类似的问题：
- "打开 https://example.com 并截图"
- "导航到 Google 首页并点击搜索框"
- "检查 https://github.com 的网络请求"

### 方法 2: 非交互式执行

```bash
node bin/agent-cli.js exec "打开 https://example.com 并获取页面标题"
```

### 方法 3: 通过代码使用

```javascript
import { AgentCore } from '@mofanh/agent-core';
import { loadConfig, extractMcpServers } from '@mofanh/agent-core/utils/config-loader';

// 加载配置
const { config } = loadConfig();
const mcpServers = extractMcpServers(config);

// 创建 Agent
const agent = new AgentCore({
  llm: {
    provider: 'openai',
    options: {
      model: 'gpt-4',
      apiKey: process.env.OPENAI_API_KEY
    }
  },
  mcp: {
    servers: mcpServers
  }
});

await agent.initialize();

// 使用 Chrome DevTools 工具
const result = await agent.mcpSystem.callTool('navigate_page', {
  url: 'https://example.com'
});
```

## 🛠️ 可用的 Chrome DevTools 工具

Chrome DevTools MCP 提供了以下工具（会在首次使用时自动安装）：

### 导航工具
- `navigate_page` - 导航到指定 URL
- `new_page` - 打开新标签页
- `close_page` - 关闭当前页面
- `list_pages` - 列出所有打开的页面
- `select_page` - 切换到指定页面

### 交互工具
- `click` - 点击元素
- `fill` - 填充表单字段
- `hover` - 鼠标悬停
- `drag` - 拖拽元素
- `upload_file` - 上传文件
- `handle_dialog` - 处理对话框

### 调试工具
- `take_screenshot` - 截取屏幕截图
- `evaluate_script` - 执行 JavaScript
- `list_console_messages` - 获取控制台消息
- `take_snapshot` - 获取 DOM 快照

### 网络工具
- `list_network_requests` - 列出网络请求
- `get_network_request` - 获取特定请求详情

### 性能工具
- `performance_start_trace` - 开始性能追踪
- `performance_stop_trace` - 停止性能追踪
- `performance_analyze_insight` - 分析性能洞察

### 仿真工具
- `emulate_cpu` - CPU 节流仿真
- `emulate_network` - 网络节流仿真
- `resize_page` - 调整页面大小

## ⚙️ 高级配置

### 启用无头模式和隔离环境

编辑 `~/.agent-core/config.toml`:

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = [
  "chrome-devtools-mcp@latest",
  "--headless=true",
  "--isolated=true"
]
```

### 使用 Canary 版本

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = [
  "chrome-devtools-mcp@latest",
  "--channel=canary"
]
```

### 指定日志文件

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = [
  "chrome-devtools-mcp@latest",
  "--logFile=/tmp/chrome-devtools-mcp.log"
]
env = { "DEBUG" = "*" }
```

## 🔍 故障排查

### 问题 1: Chrome DevTools MCP 未启动

**症状**: 看到连接错误或工具不可用

**解决方案**:
1. 确保已安装 Node.js >= 20: `node --version`
2. 确保已安装 Chrome: `which google-chrome` 或 `which chrome`
3. 手动测试 MCP 服务器: `npx chrome-devtools-mcp@latest --help`

### 问题 2: 沙箱权限问题

**症状**: 浏览器无法启动，提示沙箱错误

**解决方案**: 使用 `--isolated=false` 或配置 `--browserUrl` 连接到已运行的浏览器

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = [
  "chrome-devtools-mcp@latest",
  "--isolated=false"
]
```

### 问题 3: 工具调用超时

**症状**: 工具执行很慢或超时

**解决方案**: 在配置中增加超时时间

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]
maxRetries = 5
retryDelay = 10000
```

## 🎓 示例场景

### 场景 1: 自动化网页测试

```bash
node bin/agent-cli.js exec "打开 https://example.com，检查页面是否包含 'Example Domain' 文本，然后截图"
```

### 场景 2: 性能分析

```bash
node bin/agent-cli.js exec "打开 https://github.com，开始性能追踪，等待3秒，停止追踪并分析结果"
```

### 场景 3: 表单填充

```bash
node bin/agent-cli.js exec "打开登录页面，填写用户名和密码，然后点击登录按钮"
```

## 📚 更多信息

- Chrome DevTools MCP GitHub: https://github.com/ChromeDevTools/chrome-devtools-mcp
- MCP 配置文档: /Users/bojingli/self/project/agent/agent-core/docs/mcp_config.md
- Agent Core 文档: /Users/bojingli/self/project/agent/agent-core/README.md

## 🔄 移除 Chrome DevTools MCP

如果你想移除这个功能，只需编辑 `~/.agent-core/config.toml` 并删除 `[mcp_servers.chrome-devtools]` 部分，或者设置：

```toml
[mcp_servers.chrome-devtools]
enabled = false
command = "npx"
args = ["chrome-devtools-mcp@latest"]
```

---

**提示**: 首次使用时，npx 会自动下载 chrome-devtools-mcp 包，可能需要几秒钟。后续使用会更快。
