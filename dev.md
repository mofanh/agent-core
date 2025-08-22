# Agent-Core 开发文档

## 项目概述

Agent-Core 是一个现代化的智能代理框架，提供统一的 LLM 接口、强大的 Prompt 构建系统和灵活的工作流编排能力。项目采用模块化设计，支持多种 LLM 提供商，具备完整的流式处理能力。

## 项目结构

```
agent-core/
├── src/                          # 源代码
│   ├── index.js                  # 主入口文件，导出所有核心 API
│   ├── llm/                      # LLM 处理模块
│   │   ├── index.js              # LLM 核心类，工厂模式，内置提供商
│   │   └── stream.js             # 流式请求底层工具
│   ├── prompt/                   # Prompt 构建系统
│   │   ├── index.js              # PromptBuilder 核心类
│   │   └── templates.js          # 预定义模板和工具函数
│   └── utils/                    # 工具模块
│       └── logger.js             # 日志工具类
├── lib/                          # 构建产物
│   ├── cjs.js                    # CommonJS 格式
│   ├── umd.js                    # UMD 格式
│   ├── amd.js                    # AMD 格式
│   └── m.js                      # ES 模块格式
├── test/                         # 测试文件
│   ├── agent-prompt-integration.test.js  # 集成测试
│   ├── llm.test.js               # LLM 功能测试
│   ├── llm-extensible.test.js    # LLM 扩展性测试
│   └── llmStreamRequest.test.js  # 流式请求测试
├── examples/                     # 示例代码
│   ├── agent-workflow.js         # 基础工作流示例
│   ├── advanced-workflow.js      # 高级工作流示例
│   └── llm-extensible.js         # LLM 扩展性示例
├── docs/                         # 文档目录
├── package.json                  # 项目配置
├── rollup.config.js              # 构建配置
├── jest.config.js                # 测试配置
└── README.md                     # 项目说明
```

## 核心模块详解

### 1. AgentCore 主类 (`src/index.js`)

AgentCore 是框架的核心控制器，负责协调各个模块的工作。

#### 主要功能
- **初始化管理**：协调 LLM 和 PromptBuilder 的初始化
- **任务执行**：支持单任务、批量任务、流式任务执行
- **工作流编排**：通过 `onComplete` 回调支持复杂工作流
- **生命周期管理**：提供完整的启动、运行、关闭生命周期

#### 核心方法
```javascript
class AgentCore {
  async initialize()                    // 初始化代理
  async execute(task)                   // 执行单个任务
  async executeBatch(tasks, options)    // 批量执行任务
  async executeStream(task)             // 流式执行任务
  async getHealth()                     // 健康检查
  async getCapabilities()               // 获取能力信息
  async shutdown()                      // 关闭代理
}
```

#### 执行模型
- **无回调模式**：直接返回 LLM 响应（可能是流）
- **有回调模式**：执行 `onComplete` 回调，返回处理后的结果

### 2. LLM 处理模块 (`src/llm/`)

#### LLM 核心类 (`src/llm/index.js`)
提供统一的 LLM 接口，支持多提供商扩展。

**设计特点**：
- **可插拔架构**：通过 `requestHandler` 支持任意 LLM 提供商
- **智能连接管理**：自动连接检测和缓存机制
- **统一接口**：所有提供商使用相同的 API
- **错误处理**：完善的错误处理和日志记录

**核心方法**：
```javascript
class LLM {
  async isConnect(force)           // 连接检测
  async post(payload)              // 发送请求
  async stream(payload)            // 流式请求
  getProvider()                    // 获取提供商信息
  updateConfig(newConfig)          // 更新配置
}
```

#### LLM 工厂类
```javascript
class LLMFactory {
  static register(provider, factory)    // 注册提供商
  static create(provider, options)      // 创建 LLM 实例
  static getProviders()                 // 获取可用提供商
}
```

#### 内置提供商
- **Spark（星火大模型）**：`createSparkLLM(options)`
- **OpenAI**：`createOpenAILLM(options)`

#### 流式处理工具 (`src/llm/stream.js`)
提供底层的流式请求处理功能：
```javascript
export async function llmStreamRequest(url, payload, options)
```

### 3. Prompt 构建系统 (`src/prompt/`)

#### PromptBuilder 类 (`src/prompt/index.js`)
强大的 Prompt 构建器，支持模板化、变量注入、条件逻辑等高级功能。

**核心特性**：
- **模板注册**：支持自定义模板注册和管理
- **变量系统**：全局变量和局部变量支持
- **中间件机制**：可扩展的处理管道
- **条件逻辑**：支持复杂的条件判断和分支
- **多角色支持**：system、user、assistant 等角色模板

**主要方法**：
```javascript
class PromptBuilder {
  registerTemplate(name, template)     // 注册模板
  build(config)                        // 构建 prompt
  setGlobalVariable(key, value)        // 设置全局变量
  use(middleware)                      // 添加中间件
  listTemplates()                      // 列出可用模板
  validateTemplate(template)           // 验证模板
}
```

#### 预定义模板 (`src/prompt/templates.js`)
提供丰富的预定义模板和工具函数：

**模板类型**：
- `chat` - 基础对话模板
- `analysis` - 数据分析模板
- `task` - 任务执行模板
- `mcp` - MCP 交互模板
- `workflow` - 工作流模板
- `code` - 代码生成模板
- `translation` - 翻译模板
- `summary` - 总结模板

**工具函数**：
```javascript
export function createSystemPrompt(content, metadata)
export function createUserPrompt(content, metadata)
export function createAssistantPrompt(content, metadata)
export function createFunctionPrompt(name, description, parameters)
```

### 4. 工具模块 (`src/utils/`)

#### Logger 类 (`src/utils/logger.js`)
提供分级日志功能：
```javascript
class Logger {
  info(...args)     // 信息日志
  warn(...args)     // 警告日志
  error(...args)    // 错误日志
  debug(...args)    // 调试日志
}
```

**日志级别**：
- `debug` - 显示所有日志
- `info` - 显示 info、warn、error
- `warn` - 显示 warn、error
- `error` - 仅显示 error

## 配置系统

### 预设配置
```javascript
export const PRESET_CONFIGS = {
  basic: { 
    name: 'basic', 
    description: '基础配置', 
    logger: new Logger('info') 
  },
  performance: { 
    name: 'performance', 
    description: '性能优化配置', 
    logger: new Logger('warn') 
  },
  debug: { 
    name: 'debug', 
    description: '调试配置', 
    logger: new Logger('debug') 
  }
};
```

### AgentCore 配置示例
```javascript
const agent = new AgentCore({
  prompt: {
    customTemplates: {
      'my-template': {
        system: '你是{{role}}',
        user: '请处理：{{content}}'
      }
    }
  },
  llm: {
    requestHandler: sparkStreamRequest,
    provider: 'spark',
    options: {
      apiKey: 'your-api-key',
      model: '4.0Ultra'
    }
  }
});
```

## 工作流设计模式

### 1. 基础执行模式
```javascript
const task = {
  type: 'llm',
  buildPrompt: {
    template: 'chat',
    variables: { content: '你好' }
  },
  payload: {
    model: '4.0Ultra',
    temperature: 0.7,
    stream: true
  }
};

const result = await agent.execute(task);
```

### 2. 回调处理模式
```javascript
const task = {
  type: 'llm',
  buildPrompt: { /* ... */ },
  payload: { /* ... */ },
  onComplete: async (llmResult, agentCore) => {
    // 处理 LLM 流式响应
    let content = '';
    for await (const chunk of llmResult) {
      if (chunk.choices?.[0]?.delta?.content) {
        content += chunk.choices[0].delta.content;
      }
    }
    
    // 返回处理后的结果
    return {
      analysis: '处理完成',
      result: content,
      nextAction: 'complete'
    };
  }
};

const result = await agent.execute(task);
// result 是 onComplete 的返回值
```

### 3. 批量处理模式
```javascript
const tasks = [task1, task2, task3];
const results = await agent.executeBatch(tasks, {
  concurrency: 2,
  failFast: false
});
```

## 测试架构

### 测试文件组织
- **`llm.test.js`** - LLM 核心功能测试
- **`llm-extensible.test.js`** - LLM 扩展性和工厂模式测试
- **`llmStreamRequest.test.js`** - 流式请求工具测试
- **`agent-prompt-integration.test.js`** - 集成测试和工作流测试

### 测试策略
- **单元测试**：各模块独立功能测试
- **集成测试**：模块间协作测试
- **工作流测试**：完整业务场景测试
- **性能测试**：流式处理和并发测试

### 测试最佳实践
```javascript
// 安全的流式处理测试
const maxChunks = 20;
let chunkCount = 0;

for await (const chunk of result) {
  chunkCount++;
  // 处理逻辑
  
  if (chunkCount >= maxChunks) break; // 防止无限循环
}
```

## 构建和发布

### 构建配置 (`rollup.config.js`)
支持多种输出格式：
- **ES 模块** (`.m.js`) - 现代 JavaScript 环境
- **CommonJS** (`.cjs.js`) - Node.js 环境
- **UMD** (`.umd.js`) - 浏览器和 Node.js 通用
- **AMD** (`.amd.js`) - AMD 模块加载器

### 依赖管理
- **运行时依赖**：仅需 fetch API（现代环境原生支持）
- **开发依赖**：Jest（测试）、Rollup（构建）
- **零外部依赖**：提高安全性和稳定性

## API 参考

### 主要导出
```javascript
// 核心类
export { AgentCore, PRESET_CONFIGS }

// LLM 相关
export { 
  LLM, 
  LLMFactory, 
  createSparkLLM, 
  createOpenAILLM,
  sparkRequestHandler,
  openaiRequestHandler,
  sparkStreamRequest,
  llmStreamRequest
}

// Prompt 相关
export { 
  PromptBuilder,
  PROMPT_TEMPLATES,
  createSystemPrompt,
  createUserPrompt,
  createAssistantPrompt,
  createFunctionPrompt
}
```

### 快速开始
```javascript
import { AgentCore, createSparkLLM } from 'agent-core';

// 1. 创建并初始化代理
const agent = new AgentCore({
  llm: {
    requestHandler: sparkStreamRequest,
    provider: 'spark',
    options: { apiKey: 'your-key' }
  }
});

await agent.initialize();

// 2. 执行任务
const result = await agent.execute({
  type: 'llm',
  payload: {
    messages: [{ role: 'user', content: '你好' }],
    stream: true
  }
});

// 3. 处理结果
for await (const chunk of result) {
  console.log(chunk.choices?.[0]?.delta?.content);
}
```

## 开发建议

### 1. 错误处理
```javascript
try {
  const connected = await agent.llm.isConnect();
  if (!connected) {
    throw new Error('LLM 服务不可用');
  }
  
  const result = await agent.execute(task);
  return result;
} catch (error) {
  console.error('执行失败:', error);
  // 实现降级策略
}
```

### 2. 性能优化
- 使用连接缓存减少网络请求
- 限制流处理的 chunk 数量
- 合理设置 token 限制
- 实现请求超时和取消机制

### 3. 扩展开发
- 实现自定义 LLM 提供商
- 创建自定义 Prompt 模板
- 开发中间件插件
- 构建复杂工作流

---

*最后更新：2025年8月22日*

// 创建星火大模型实例
const sparkLLM = createSparkLLM({
  apiKey: 'your-spark-api-key',
  timeout: 30000
});

// 创建 OpenAI 实例
const openaiLLM = createOpenAILLM({
  apiKey: 'your-openai-api-key',
  model: 'gpt-4'
});

// 使用示例
const connected = await sparkLLM.isConnect();
if (connected) {
  // 非流式请求
  const response = await sparkLLM.post({
    messages: [{ role: 'user', content: '你好' }],
    stream: false
  });
  
  // 流式请求
  const stream = await sparkLLM.stream({
    messages: [{ role: 'user', content: '讲个笑话' }]
  });
  
  for await (const chunk of stream) {
    console.log(chunk);
  }
}
```
**方式2：注册自定义提供商**
```javascript
import { LLMFactory } from 'agent-core';

// 自定义请求处理函数
async function* customRequestHandler(payload, options) {
  const response = await fetch(options.baseUrl || 'https://api.custom-llm.com/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (!payload.stream) {
    return await response.json();
  }

  // 处理流式响应
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop();
    
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          yield JSON.parse(data);
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }
}

// 注册提供商
LLMFactory.register('custom', customRequestHandler, null, {
  baseUrl: 'https://api.custom-llm.com/v1/chat',
  timeout: 60000,
  model: 'custom-model-v1'
});

// 使用自定义提供商
const customLLM = LLMFactory.create('custom', {
  apiKey: 'your-api-key',
  model: 'custom-model-v2'
});
```
**方式3：直接创建 LLM 实例**
```javascript
import { LLM } from 'agent-core';

// 简单的模拟处理函数
async function* mockHandler(payload, options) {
  const responses = ['Hello', ' ', 'World', '!'];
  for (const text of responses) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield { choices: [{ delta: { content: text } }] };
  }
}

const llm = new LLM({
  requestHandler: mockHandler,
  provider: 'mock',
  connectionChecker: async () => true, // 自定义连接检查
  options: { 
    timeout: 30000,
    retries: 3 
  }
});

// 获取提供商信息
console.log(llm.getProviderInfo());

// 更新配置
llm.updateOptions({ timeout: 60000 });
```

### 3. 预设配置
- 位置：src/index.js
- 说明：内置 basic、performance、debug 三种预设配置，可用于快速启动或自定义。

### 4. 快速启动
- 位置：src/index.js
- 方法：quickStart(preset, options)
- 说明：一行代码快速创建并执行任务，适合简单场景。

### 5. 批量处理
- 位置：src/index.js
- 方法：batchProcess(tasks, options)
- 说明：批量处理任务，提升多任务执行效率。

### 6. Agent 工厂
- 位置：src/index.js
- 说明：提供多种方式创建 AgentCore 实例，支持不同的 LLM 配置和集成方式。
- 主要方法：
  - `createAgent(presetOrConfig, options)`：通用 Agent 创建
  - `createLLMAgent(provider, options)`：创建带 LLM 的 Agent，支持多种参数形式
  - `createSparkAgent(options)`：创建星火大模型 Agent
  - `createOpenAIAgent(options)`：创建 OpenAI Agent
- 使用示例：
  ```javascript
  // 方式1：创建星火 Agent
  const sparkAgent = createSparkAgent({ 
    apiKey: 'your-spark-key',
    preset: 'performance',
    timeout: 30000
  });
  
  // 方式2：使用提供商名称创建
  const openaiAgent = createLLMAgent('openai', {
    apiKey: 'your-openai-key',
    model: 'gpt-4'
  });
  
  // 方式3：使用自定义函数创建
  const customAgent = createLLMAgent(customHandler, {
    provider: 'custom',
    preset: 'debug'
  });
  
  // 方式4：使用完整配置创建
  const configAgent = createLLMAgent({
    requestHandler: myHandler,
    provider: 'my-llm',
    options: { timeout: 60000 }
  });
  
  // 初始化并使用
  await sparkAgent.initialize();
  
  const result = await sparkAgent.execute({
    type: 'llm',
    payload: {
      messages: [{ role: 'user', content: 'Hello' }]
    }
  });
  ```

### 7. LLM 流式请求工具函数
- 位置：src/llm/stream.js
- 方法：llmStreamRequest({ requestImpl, payload })
- 说明：底层流式请求工具函数，需外部注入 requestImpl 实现，适合大模型对话、流式输出场景。

### 8. 外部服务集成（如 MCP）
- agent-core 仅负责任务调度与转发，具体的 DOM 操作、页面分析等能力需通过 MCP（Model Context Protocol）等外部服务实现。
- agent-core 通过 execute/executeBatch/executeStream 等方法，将相关任务请求转发给 MCP，由 MCP 完成实际操作。
- LLM 类提供统一的大语言模型接口，支持多种 LLM 服务提供商的流式请求，内置连接检测机制确保服务可用性。

## LLM 模块架构
LLM 模块采用现代化的可扩展插件设计，具有以下层次结构：

### 核心架构层次
- **LLM 核心类**（`src/llm/index.js`）：
  - 提供统一的接口 (post, stream, isConnect)
  - 智能连接管理和缓存
  - 配置管理和运行时更新
  - 错误处理和日志记录
  
- **LLMFactory 工厂**：
  - 提供商注册和管理
  - 实例创建和配置合并
  - 提供商发现机制
  
- **请求处理器**：
  - 可插拔的处理函数设计
  - 支持同步/异步/生成器函数
  - 自动适配流式和非流式响应
  
- **连接检测层**：
  - 智能的连接状态检测
  - 基于时间的缓存机制
  - 自定义检测逻辑支持
  
- **流式工具层**（`src/llm/stream.js`）：
  - 底层流式处理工具函数
  - 向后兼容的接口

### 扩展新的 LLM 提供商

**完整示例：集成新的 LLM 服务**
```javascript
// 1. 定义请求处理函数
async function* newProviderHandler(payload, options = {}) {
  const { apiKey, baseUrl = 'https://api.new-llm.com/v1', model = 'default' } = options;
  
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'agent-core/1.0.0'
      },
      body: JSON.stringify({
        ...payload,
        model: payload.model || model
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (!payload.stream) {
      // 非流式响应
      return await response.json();
    }

    // 流式响应处理
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              yield parsed;
            } catch (parseError) {
              console.warn('JSON parse error:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// 2. 可选：定义自定义连接检查
async function newProviderConnectionChecker() {
  try {
    const response = await fetch('https://api.new-llm.com/v1/models', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.options.apiKey}` }
    });
    return response.ok;
  } catch {
    return false;
  }
}

// 3. 注册提供商
LLMFactory.register('new-llm', newProviderHandler, newProviderConnectionChecker, {
  baseUrl: 'https://api.new-llm.com/v1',
  model: 'new-llm-v1',
  timeout: 30000,
  maxRetries: 3
});

// 4. 使用新提供商
const newLLM = LLMFactory.create('new-llm', {
  apiKey: 'your-api-key',
  model: 'new-llm-v2'
});

// 5. 或者创建专用的便捷函数
export function createNewLLM(options = {}) {
  return LLMFactory.create('new-llm', options);
}
```

### 内置提供商详情

**星火大模型 (spark)**
- 端点：`https://spark-api-open.xf-yun.com/v1/chat/completions`
- 认证：Bearer Token
- 支持：流式/非流式响应

**OpenAI (openai)**  
- 端点：`https://api.openai.com/v1/chat/completions`
- 认证：Bearer Token
- 支持：流式/非流式响应，所有 GPT 模型

## 核心设计理念

### 可扩展性 (Extensibility)
- **插件化架构**：通过 LLMFactory 注册机制，轻松添加新的 LLM 提供商
- **统一接口**：所有 LLM 提供商使用相同的 API，降低学习成本
- **配置驱动**：通过配置对象控制行为，无需修改核心代码

### 流式优先 (Stream-First)
- **原生流式支持**：优先考虑流式响应，提升实时性用户体验
- **自动适配**：智能处理流式和非流式响应，开发者无需关心底层差异
- **背压处理**：合理的流控制，避免内存溢出

### 智能连接管理 (Smart Connection Management)
- **自动检测**：智能检测服务可用性，避免无效请求
- **缓存机制**：基于时间的连接状态缓存，减少网络开销
- **故障恢复**：连接失败时的重试和降级策略

### 开发者友好 (Developer Experience)
- **类型安全**：完整的类型定义和文档
- **错误处理**：详细的错误信息和调试日志
- **测试友好**：易于模拟和测试的设计
- **向后兼容**：保持 API 稳定性，平滑升级

### 生产就绪 (Production Ready)
- **性能优化**：连接池、请求缓存等性能优化
- **监控支持**：内置健康检查和指标收集
- **配置管理**：支持运行时配置更新
- **安全性**：安全的 API 密钥管理和请求签名

## 最佳实践

### 1. 提供商选择
```javascript
// 开发环境：使用模拟提供商
const devLLM = new LLM({
  requestHandler: mockHandler,
  provider: 'mock'
});

// 生产环境：使用真实提供商
const prodLLM = createSparkLLM({
  apiKey: process.env.SPARK_API_KEY
});
```

### 2. 错误处理
```javascript
try {
  const connected = await llm.isConnect();
  if (!connected) {
    throw new Error('LLM 服务不可用');
  }
  
  const response = await llm.post(payload);
  return response;
} catch (error) {
  console.error('LLM 请求失败:', error);
  // 实现降级策略
  return fallbackResponse;
}
```

### 3. 配置管理
```javascript
// 集中配置管理
const llmConfig = {
  provider: process.env.LLM_PROVIDER || 'spark',
  options: {
    apiKey: process.env.LLM_API_KEY,
    timeout: parseInt(process.env.LLM_TIMEOUT) || 30000,
    maxRetries: 3
  }
};

const llm = LLMFactory.create(llmConfig.provider, llmConfig.options);
```

## 性能指标
- **连接检测**：< 100ms (缓存命中时)
- **请求延迟**：取决于具体提供商
- **内存使用**：流式处理，内存占用稳定
- **并发支持**：支持多个并发请求

## 依赖与构建
- 构建工具：Rollup
- 支持输出格式：ESM、CJS、UMD、AMD
- 运行时依赖：仅需原生 fetch API
- 开发依赖：Jest (测试)、Rollup (构建)

## 参考
- 详细 API 用法、配置与示例请见 README.md
- 完整的使用示例在 `examples/llm-extensible.js`
- 推荐：开发时结合 test/ 目录下用例理解各 API 行为
- 扩展指南：参考内置提供商的实现方式

---

## 最新代码分析 (2025年8月22日)

### 1. AgentCore 工作流测试优化

#### 问题修复：异步迭代器类型错误
在 `test/agent-prompt-integration.test.js` 中修复了一个关键的类型理解错误：

**问题原因**：
- 测试代码错误地期望 `agent.execute(task)` 返回异步迭代器
- 实际上当任务包含 `onComplete` 回调时，`execute` 返回回调函数的返回值
- 导致 "result is not async iterable" 错误

**修复方案**：
```javascript
// 错误的用法（修复前）
const result = await agent.execute(task);
for await (const chunk of result) { // ❌ result 不是异步迭代器
  // 处理流数据
}

// 正确的用法（修复后）
const result = await agent.execute(task);
// result 是 onComplete 回调的返回值，直接使用
expect(result).toBe(mcpResponse);
```

#### AgentCore.execute() 方法行为澄清

**设计原则**：
1. **无回调模式**：返回 LLM 的原始响应（可能是流）
2. **有回调模式**：返回 `onComplete` 回调的处理结果

**实现逻辑**：
```javascript
async execute(task) {
  // 1. 处理 prompt 构建
  if (task.buildPrompt && this.promptBuilder) {
    // 构建消息模板
  }
  
  // 2. LLM 处理
  if (task.type === 'llm' && this.llm) {
    const llmResult = await this.llm.post(task.payload);
    
    // 3. 关键分支：是否有 onComplete 回调
    if (task.onComplete && typeof task.onComplete === 'function') {
      return await task.onComplete(llmResult, this); // 返回回调结果
    }
    
    return llmResult; // 返回原始 LLM 响应
  }
}
```

### 2. 新增工作流仿真测试

#### AgentCore Workflow Simulation 测试套件
新增了完整的工作流仿真测试，展示了 AgentCore 在复杂场景下的能力：

**核心特性**：
1. **系统分析场景**：使用自定义模板进行数据分析
2. **流式处理优化**：限制 chunk 数量和 token 数，避免测试超时
3. **完整生命周期**：从 prompt 构建到 LLM 调用到结果处理

**测试配置**：
```javascript
const systemAnalysisConfig = {
  customTemplates: {
    'system-analysis': {
      system: '你是一个系统分析专家。请分析以下数据：{{data}}',
      user: '分析请求：{{request}}'
    }
  }
};
```

**安全机制**：
- **chunk 限制**：最大 20 个 chunk，防止无限循环
- **token 限制**：max_tokens: 100，快速完成测试
- **超时保护**：45秒超时，适合 CI/CD 环境

#### onComplete 回调最佳实践

**流式数据处理模式**：
```javascript
onComplete: async (llmResult) => {
  let fullContent = '';
  let chunkCount = 0;
  const maxChunks = 20; // 安全限制
  
  try {
    for await (const chunk of llmResult) {
      chunkCount++;
      if (chunk.choices?.[0]?.delta?.content) {
        fullContent += chunk.choices[0].delta.content;
      }
      
      // 安全退出条件
      if (chunkCount >= maxChunks) break;
    }
  } catch (error) {
    console.log('流处理错误:', error.message);
  }

  return {
    status: 'completed',
    step: 1,
    llmResult: { content: fullContent },
    chunkCount
  };
}
```

### 3. 架构设计洞察

#### 流式处理的双重角色
1. **LLM 层面**：生成异步迭代器流
2. **应用层面**：在 `onComplete` 中消费流，返回结构化结果

#### 工作流编排模式
- **任务定义**：类型、模板、参数、回调
- **执行引擎**：AgentCore.execute()
- **结果转换**：onComplete 回调处理
- **状态管理**：支持多步骤工作流

#### 测试策略优化
- **模块化测试**：分离基础功能和工作流测试
- **性能友好**：限制资源使用，快速反馈
- **错误容忍**：完善的异常处理和日志记录

### 4. 开发建议

#### 使用 onComplete 回调的场景
1. **数据后处理**：格式化 LLM 输出
2. **多服务集成**：调用 MCP 服务器或其他 API
3. **工作流控制**：实现多步骤任务编排
4. **结果聚合**：将流式数据转换为结构化结果

#### 错误处理最佳实践
```javascript
// 在 onComplete 中处理流时，始终包含错误处理
try {
  for await (const chunk of llmResult) {
    // 处理逻辑
  }
} catch (error) {
  console.log('流处理错误:', error.message);
  // 实现降级或重试逻辑
}
```

#### 性能优化建议
- 使用 chunk 限制避免无限循环
- 设置合理的 token 限制
- 实现超时和取消机制
- 监控流处理性能指标

---