# MCP 配置（Codex 风格）

本文档介绍如何通过配置文件为 agent-core 启用/禁用 MCP 服务器（不直接引入第三方代码），方式参考 Codex 的 `mcp_servers`。

## 配置文件位置

默认位置：`~/.agent-core/config.toml`

也兼容：`~/.agent-core/config.json`

CLI 可生成模板：

- 生成默认配置模板
  - `agent-cli config init`
- 查看当前配置
  - `agent-cli config show`

## 基本结构（TOML）

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]
# 可选：传递 flags
# args = ["chrome-devtools-mcp@latest", "--headless=true", "--isolated=true"]
# env = { "EXAMPLE_KEY" = "" }
```

以上等效于 Cursor/Claude 的 JSON：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"],
      "env": {}
    }
  }
}
```

以及 agent-core 原生结构（同样被支持）：

```json
{
  "mcp": {
    "servers": [
      { "name": "chrome-devtools", "transport": "stdio", "command": "npx", "args": ["chrome-devtools-mcp@latest"], "env": {} }
    ]
  }
}
```

注意：
- `enabled = false` 将跳过该服务器（便于临时禁用）。
- `transport` 缺省为 `stdio`；也可配 `http` + `url`（若你的服务器支持）。
- 其他字段：`maxRetries`、`retryDelay`、`autoReconnect`、`capabilities`。

## Chrome DevTools MCP 示例

Chrome DevTools MCP 的官方说明建议通过 `npx` 启动，并可传递多个运行参数：

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = [
  "chrome-devtools-mcp@latest",
  "--headless=true",
  "--isolated=true"
]
# 也可以指定 Canary 渠道：
# args = ["chrome-devtools-mcp@latest", "--channel=canary"]
```

更多可用参数，可运行：
- `npx chrome-devtools-mcp@latest --help`

或参考其 README。

## agent-core 中的加载与启用

- CLI 会在启动时自动读取 `~/.agent-core/config.toml|.json`。
- 将 `[mcp_servers]` 中的各项映射为 agent-core 的 MCP 服务器配置，并自动初始化连接。
- 你可以通过 `--config <path>` 指定不同的配置文件。

## 与 CLI 的配合

- 交互模式：`agent-cli interactive --enable-mcp`
  - 若配置中存在 `[mcp_servers]`，将自动启用这些 MCP 服务器。
- 非交互执行：`agent-cli exec "你的问题" --enable-mcp`
- MCP 服务模式：`agent-cli mcp`（提供本地工具，不影响外接 MCP 客户端配置）

## 故障排查

- 未能解析 TOML：请安装 `toml` 依赖或改用 JSON 配置。
- Chrome DevTools MCP 启动失败：确保 Node >= 20、已安装 Chrome、CLI 沙箱未阻止浏览器启动。
- 可设置服务器字段 `maxRetries`/`retryDelay`/`autoReconnect` 以提升稳定性。

---

通过这种方式，你可以在不修改代码的前提下，以配置形式增删 MCP 服务器（包括 Chrome DevTools MCP）。