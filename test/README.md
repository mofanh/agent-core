# Agent-Core 测试文件说明

## 📁 测试目录结构

### 🚀 CLI 相关测试
- **`cli-comprehensive.test.js`** - CLI功能综合测试，包含所有主要命令和功能
- **`spark-real-api.test.js`** - 讯飞星火API真实连接测试

### 🧪 核心功能测试 (Jest)
- **`llm.test.js`** - LLM基础功能测试
- **`llm-extensible.test.js`** - LLM扩展性测试
- **`llmStreamRequest.test.js`** - 流式请求测试
- **`mcp-integration.test.js`** - MCP协议集成测试
- **`agent-prompt-integration.test.js`** - Agent和Prompt集成测试

### 🌐 浏览器工具测试
- **`browser-integration.test.js`** - 浏览器集成测试
- **`browser-tools.test.js`** - 浏览器工具测试
- **`webpilot-browser-test.js`** - WebPilot浏览器测试

### 📅 里程碑测试
- **`week1-foundation.test.js`** - 第一周基础架构测试
- **`week3-advanced-browser.test.js`** - 第三周高级浏览器功能测试
- **`week4-comprehensive.test.js`** - 第四周综合功能测试

## 🏃‍♂️ 运行测试

### 快速测试
```bash
# CLI功能测试
npm run test:cli

# 星火API测试
npm run test:spark

# Jest单元测试
npm test
```

### 单独运行
```bash
# CLI综合测试
node test/cli-comprehensive.test.js

# 星火API测试
node test/spark-real-api.test.js

# Jest测试
npm run test:watch
```

## 📊 测试覆盖

- ✅ **CLI功能** - 命令行界面完整测试
- ✅ **LLM集成** - 多提供商LLM测试
- ✅ **MCP协议** - Model Context Protocol测试
- ✅ **浏览器工具** - 7个浏览器自动化工具测试
- ✅ **流式处理** - 流式请求和响应测试
- ✅ **错误处理** - 网络和API错误处理测试

## 🔧 测试环境

### 环境变量
```bash
# 讯飞星火API (可选，有默认测试key)
export SPARK_API_KEY="your-key"

# OpenAI API (测试时需要)
export OPENAI_API_KEY="your-key"

# 调试模式
export DEBUG=true
```

### 依赖检查
```bash
# 检查必要依赖
npm list commander chalk ora inquirer

# 安装缺失依赖
npm install
```
