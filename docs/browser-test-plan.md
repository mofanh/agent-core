# 浏览器工具测试方案

## 🎯 测试目标
验证 `@mofanh/agent-core` 浏览器工具模块在真实浏览器环境中的功能完整性和性能表现。

## 📋 方案概览

### 方案1: WebPilot 插件集成测试 ⭐⭐⭐⭐⭐ （推荐）

**优势：**
- ✅ 真实浏览器环境测试
- ✅ 无需额外安装依赖（Puppeteer/Playwright）
- ✅ 可视化测试界面
- ✅ 适合开发和调试

**实施步骤：**
1. 在 WebPilot 插件中集成测试组件 `BrowserToolsTestPage.tsx`
2. 添加测试路由到插件导航
3. 在浏览器中加载插件并运行测试

**测试覆盖：**
- 内容提取 (`EXTRACT`)
- JavaScript执行 (`EVALUATE`)
- 页面导航 (`NAVIGATE`)
- 元素交互 (`CLICK`, `TYPE`)
- 截图功能 (`SCREENSHOT`)

### 方案2: 独立浏览器集成测试

**实施：**
```bash
# 安装浏览器引擎
npm install puppeteer

# 运行集成测试
npm test -- test/browser-integration.test.js
```

**优势：**
- ✅ 完整的自动化测试流程
- ✅ 适合CI/CD集成
- ✅ 详细的性能指标

**挑战：**
- ⚠️ 需要安装额外依赖
- ⚠️ 可能遇到无头浏览器限制

### 方案3: 开发环境测试服务器

**实施：**
```bash
# 启动测试服务器
npm run test:browser-server

# 在浏览器中访问测试页面
open http://localhost:3000/browser-test
```

## 🚀 推荐实施步骤

### 第一阶段：WebPilot 集成测试

1. **添加测试组件到 WebPilot**
   ```bash
   cd webpilot
   # 测试组件已创建在 components/BrowserToolsTestPage.tsx
   ```

2. **更新 WebPilot 导航**
   在 WebPilot 的主界面添加"浏览器工具测试"选项

3. **运行测试**
   - 加载 WebPilot 插件
   - 导航到测试页面
   - 点击"开始测试"按钮
   - 查看实时日志和结果

### 第二阶段：自动化测试集成

1. **安装依赖**
   ```bash
   cd agent-core
   npm install puppeteer --save-dev
   ```

2. **运行完整测试套件**
   ```bash
   npm test -- test/browser-integration.test.js
   ```

## 📊 测试指标

### 功能测试
- [ ] 页面导航成功率
- [ ] 内容提取准确性
- [ ] 元素交互响应性
- [ ] JavaScript执行稳定性
- [ ] 截图质量和完整性

### 性能测试
- [ ] 工具初始化时间 < 5秒
- [ ] 页面导航时间 < 10秒
- [ ] 内容提取时间 < 3秒
- [ ] 截图生成时间 < 5秒

### 错误处理
- [ ] 无效选择器处理
- [ ] 网络超时处理
- [ ] JavaScript错误处理
- [ ] 权限问题处理

## 🛠️ 快速开始

### 使用 WebPilot 测试（推荐）

1. 确保 WebPilot 插件已安装并启用
2. 打开 WebPilot 侧边栏
3. 导航到"浏览器工具测试"页面
4. 点击"开始测试"
5. 查看实时测试结果

### 使用独立测试

1. 安装依赖：`npm install puppeteer`
2. 运行测试：`npm test -- test/browser-integration.test.js`
3. 查看测试报告

## 📝 测试记录

### 预期测试结果
- 总测试数：5-8个
- 预期通过率：> 90%
- 平均执行时间：< 30秒

### 常见问题排查
1. **权限问题**：确保浏览器允许插件访问页面
2. **网络问题**：使用本地测试页面或data URL
3. **超时问题**：调整测试超时配置
4. **兼容性问题**：确认浏览器版本支持

## 🎉 成功标准

测试通过标准：
- ✅ 所有基础功能测试通过
- ✅ 性能指标达到预期
- ✅ 错误处理机制正常
- ✅ WebPilot 集成无问题

这样就能确保浏览器工具在真实环境中的可靠性和性能！
