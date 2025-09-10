# Agent-Core CLI 配置示例

## 环境变量配置

```bash
# OpenAI 配置
export OPENAI_API_KEY="your-api-key-here"
export OPENAI_BASE_URL="https://api.openai.com/v1"  # 可选

# 讯飞星火配置
export SPARK_API_KEY="your-spark-api-key"
export SPARK_APP_ID="your-spark-app-id"
export SPARK_API_SECRET="your-spark-api-secret"

# 浏览器配置
export HEADLESS=false  # 显示浏览器窗口
export DEVTOOLS=true   # 启用开发者工具
```

## CLI 使用示例

### 1. 交互式模式（推荐）

```bash
# 基本交互模式
npm run cli:interactive

# 启用浏览器工具的交互模式
npm run cli:interactive -- --enable-browser

# 启用所有功能的交互模式
npm run cli:interactive -- --enable-browser --enable-mcp --auto-approve

# 使用特定 LLM 提供商
npm run cli:interactive -- --provider openai --model gpt-4
```

### 2. 非交互式执行

```bash
# 简单查询
npm run cli:exec -- "介绍一下人工智能的发展历史"

# 需要浏览器工具的查询
npm run cli:exec -- "访问 https://github.com 并告诉我今天的热门项目" --enable-browser

# JSON 格式输出
npm run cli:exec -- "什么是 MCP 协议？" --output json

# 设置最大迭代次数
npm run cli:exec -- "分析当前的技术趋势" --max-iterations 3
```

### 3. MCP 服务器模式

```bash
# 启动 stdio MCP 服务器
npm run cli:mcp

# 启动浏览器 MCP 服务器
npm run cli:browser

# 或者直接使用现有脚本
npm run mcp:browser
```

### 4. 调试和测试

```bash
# 测试 LLM 连接
node bin/agent-cli.js debug llm

# 测试 MCP 连接
node bin/agent-cli.js debug mcp

# 测试浏览器工具
node bin/agent-cli.js debug browser

# 显示配置信息
node bin/agent-cli.js config show
```

## 使用场景示例

### 场景 1: 网页内容分析

```bash
npm run cli:interactive -- --enable-browser
```

然后在交互模式中输入：
```
请访问 https://news.ycombinator.com 并总结今天的热门技术新闻
```

### 场景 2: 代码问题解答

```bash
npm run cli:exec -- "解释一下 JavaScript 的闭包概念，并给出实际应用示例"
```

### 场景 3: 循环思考和推理

```bash
npm run cli:interactive -- --max-iterations 15
```

然后输入复杂问题：
```
设计一个分布式系统来处理大规模用户数据，需要考虑哪些技术选型和架构决策？
```

### 场景 4: 作为 MCP 服务提供工具

启动服务器：
```bash
npm run cli:mcp
```

然后在其他应用中连接此服务器，使用 Agent-Core 的 LLM 和浏览器工具能力。

## 配置文件支持

创建 `~/.agent-core/config.json`：

```json
{
  "llm": {
    "provider": "openai",
    "options": {
      "model": "gpt-4",
      "temperature": 0.7,
      "maxTokens": 2000
    }
  },
  "browser": {
    "headless": false,
    "devtools": true,
    "timeout": 30000
  },
  "tui": {
    "maxIterations": 10,
    "showThinking": true,
    "theme": "default"
  }
}
```

然后使用：
```bash
npm run cli:interactive -- --config ~/.agent-core/config.json
```

## 与 Codex 的对比

| 功能 | Codex | Agent-Core CLI |
|------|-------|----------------|
| 交互式模式 | ✅ | ✅ |
| 非交互式执行 | ✅ | ✅ |
| MCP 服务器 | ✅ | ✅ |
| 循环思考 | ✅ | ✅ |
| 工具调用 | ✅ | ✅ (浏览器工具) |
| 多 LLM 支持 | ✅ | ✅ (OpenAI, 星火) |
| 配置管理 | ✅ | ✅ |
| 命令补全 | ✅ | 🔄 (待实现) |

## 开发和扩展

### 添加新的工具

1. 在 `src/browser/tools/` 下实现新工具
2. 在 `src/mcp/browser-server.js` 中注册工具
3. 更新 CLI 的工具解析逻辑

### 添加新的 LLM 提供商

1. 在 `src/llm/` 下实现新的提供商
2. 在 `LLMFactory` 中注册
3. 更新 CLI 的 `--provider` 选项

### 自定义 TUI 主题

1. 修改 `src/tui/index.js` 中的样式配置
2. 添加新的主题选项到配置文件
