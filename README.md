# agent-core

[![npm version](https://badge.fury.io/js/agent-core.svg)](https://badge.fury.io/js/agent-core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)

agent-core 是一个基于动态流循环架构的智能网页操作代理包，支持页面分析、DOM操作、表单填充等功能。

## 特性

- 🔄 **动态流循环架构**: in → buildprompt → LLM Provider → out → MCP → buildprompt → in
- 🎯 **智能页面分析**: 自动分析页面结构和内容
- 🛠️ **DOM操作**: 强大的页面元素操作能力  
- 📝 **表单填充**: 智能表单自动填充
- 🔧 **可扩展配置**: 支持多种预设配置和自定义
- 📊 **性能监控**: 内置日志和性能监控
- 🔒 **类型安全**: 完整的 TypeScript 类型定义

## 安装

yarn add agent-core
```bash
npm install agent-core
# 或
yarn add agent-core
# 或
pnpm add agent-core
```

## 快速开始

### 基本使用

```typescript
import { AgentCore, quickStart } from 'agent-core';

// 手动创建代理
const agent = new AgentCore({
  llmProvider: {
    type: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  },
  mcpServers: ['dom', 'page']
});

await agent.initialize();
const result = await agent.execute({
  task: 'analyze_page',
  target: 'https://example.com'
});
```

### 页面分析

```typescript
import { analyzePage } from 'agent-core';

const analysis = await analyzePage('https://example.com', {
  includeImages: true,
  extractText: true,
  analyzeStructure: true
});

console.log(analysis.pageInfo);
console.log(analysis.domStructure);
```

### DOM操作

```typescript
import { manipulateDOM } from 'agent-core';

const result = await manipulateDOM('https://example.com', {
  actions: [
    { type: 'click', selector: '#submit-button' },
    { type: 'fill', selector: '#email', value: 'user@example.com' },
    { type: 'wait', duration: 1000 }
  ]
});
```

### 批量处理

```typescript
import { batchProcess } from 'agent-core';

const tasks = [
  { task: 'analyze_page', target: 'https://example1.com' },
  { task: 'analyze_page', target: 'https://example2.com' },
  { task: 'fill_form', target: 'https://example3.com', data: { email: 'test@example.com' } }
];

const results = await batchProcess(tasks, {
  concurrency: 3,
  failFast: false
});
```

## 配置选项

### 预设配置

- `performance`: 性能优化配置，适合大量操作
- `debug`: 调试配置，包含详细日志

```typescript
import { createAgent, PRESET_CONFIGS } from 'agent-core';

// 使用预设配置
const agent = createAgent('performance', {
  llmProvider: {
    apiKey: process.env.OPENAI_API_KEY
  }
});

// 查看预设配置
console.log(PRESET_CONFIGS.basic);
```

### 自定义配置

```typescript
const customConfig = {
  llmProvider: {
    type: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  },
  mcpServers: ['dom', 'page', 'forms'],
  performance: {
    timeout: 30000,
    maxRetries: 3,
    cacheEnabled: true
  },
  validation: {
    strict: true,
    validateInputs: true,
    validateOutputs: true
  },
  logging: {
    level: 'info',
    enablePerformanceLogging: true,
    enableErrorTracking: true
  }
};

const agent = new AgentCore(customConfig);
```

## API 参考

### AgentCore

主要的代理类，提供完整的功能。

#### 方法

- `initialize()`: 初始化代理
- `execute(task)`: 执行单个任务
- `executeBatch(tasks, options?)`: 批量执行任务
- `executeStream(task)`: 流式执行任务
- `getHealth()`: 获取代理健康状态
- `getCapabilities()`: 获取代理能力信息
- `shutdown()`: 关闭代理

#### 配置接口

详细的配置选项请参考 TypeScript 类型定义。

## 开发

### 本地开发

```bash
# 克隆项目
git clone <repository-url>
cd agent-core

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm run test

# 代码检查
npm run lint
```

### 构建

项目使用 Rollup 进行构建，支持 ES 模块和 CommonJS 格式：

```bash
npm run build
```

构建产物：
- `lib/m.js` - ES 模块格式
- `lib/cjs.js` - CommonJS 格式
- `lib/umd.js` - UMD 格式
- `lib/amd.js` - AMD 格式

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
