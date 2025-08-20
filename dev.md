# agent-core 代码结构文档

## 目录结构
```
- src/
  - index.js         // 主入口，导出核心 API（包含 AgentCore 类）
  - llm/
    - index.js       // LLM 类定义，包含连接检测和请求功能
    - stream.js      // LLM 流式请求底层工具函数
  - utils/
    - logger.js      // 日志工具类
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

### 2. LLM 可扩展库
- 位置：src/llm/index.js
- 说明：可扩展的大语言模型接口库，支持多种 LLM 服务提供商的统一接口，采用插件化设计。
- 核心组件：
  - **LLM 类**：统一的 LLM 接口，支持连接检测、流式/非流式请求、配置管理
  - **LLMFactory 工厂类**：用于注册和创建不同提供商的 LLM 实例
  - **内置提供商**：星火大模型 (spark)、OpenAI (openai)
  - **请求处理器**：可插拔的请求处理函数，支持自定义 LLM 服务
- 主要特性：
  - ✅ **可插拔设计**：通过注册机制支持任意 LLM 提供商
  - ✅ **统一接口**：所有提供商使用相同的 API (post, stream, isConnect)
  - ✅ **智能连接管理**：自动连接检测和缓存机制，减少网络请求
  - ✅ **流式支持**：原生支持流式和非流式响应，自动处理流数据
  - ✅ **错误处理**：完善的错误处理和提供商级别的日志记录
  - ✅ **配置灵活性**：支持运行时配置更新和提供商信息查询

#### 使用方式

**方式1：使用内置提供商**
```javascript
import { createSparkLLM, createOpenAILLM } from 'agent-core';

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
