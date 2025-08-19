# agent-core 代码结构文档

## 目录结构
```
- src/
  - index.js         // 主入口，导出核心 API
  - llm/stream.js    // LLM 流式请求实现
  - ...（其他 TypeScript 辅助文件）
- lib/               // 构建产物
- test/              // 测试用例
- docs/              // 文档
```
## 主要模块与功能

### 1. AgentCore 主类
- 位置：src/index.js
- 说明：核心代理类，负责初始化、任务执行、批量处理、流式执行、健康检查、能力查询、关闭等。
- 主要方法：
  - initialize()
  - execute(task)
  - executeBatch(tasks, options?)
  - executeStream(task)
  - getHealth()
  - getCapabilities()
  - shutdown()

### 2. 预设配置
- 位置：src/index.js
- 说明：内置 basic、performance、debug 三种预设配置，可用于快速启动或自定义。

### 3. 快速启动
- 位置：src/index.js
- 方法：quickStart(preset, options)
- 说明：一行代码快速创建并执行任务，适合简单场景。


### 4. 批量处理
- 位置：src/index.js
- 方法：batchProcess(tasks, options)
- 说明：批量处理任务，提升多任务执行效率。

### 5. Agent 工厂
- 位置：src/index.js
- 方法：createAgent(presetOrConfig, options)
- 说明：通过预设名或自定义配置创建 AgentCore 实例，灵活适配不同业务场景。

### 6. LLM 流式请求
- 位置：src/llm/stream.js
- 方法：llmStreamRequest({ requestImpl, payload })
- 说明：发起 LLM 流式请求，需外部注入 requestImpl 实现，适合大模型对话、流式输出场景。

### 7. 外部服务集成（如 MCP）
- agent-core 仅负责任务调度与转发，具体的 DOM 操作、页面分析等能力需通过 MCP（Model Context Protocol）等外部服务实现。
- agent-core 通过 execute/executeBatch/executeStream 等方法，将相关任务请求转发给 MCP，由 MCP 完成实际操作。

## 依赖与构建
- 构建工具：Rollup
- 支持输出格式：ESM、CJS、UMD、AMD

## 参考
- 详细 API 用法、配置与示例请见 README.md
- 推荐：开发时结合 test/ 目录下用例理解各 API 行为
