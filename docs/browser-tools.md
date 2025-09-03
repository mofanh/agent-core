# Browser Tools for Agent-Core

浏览器工具模块为 Agent-Core 提供了强大的网页自动化能力，参考了 codex-rs 的本地工具架构设计。

## 🌟 特性

- **🔧 统一工具接口**: 遵循 codex 的本地工具调用模式
- **🛡️ 安全策略**: 内置安全验证和资源控制
- **🎯 智能选择器**: 支持 CSS 和 XPath 选择器自动检测
- **⚡ 高性能**: 延迟加载和资源池管理
- **📊 监控能力**: 完整的执行日志和性能指标
- **🔄 分页支持**: 自动分页内容提取

## 🛠️ 核心工具

### 1. 页面导航 (browser.navigate)

导航到指定页面并等待加载完成。

```javascript
await agent.handleToolCall('browser.navigate', {
  url: 'https://example.com',
  waitForSelector: '.main-content',
  timeout: 15000,
  userAgent: 'CustomBot/1.0'
});
```

**参数说明:**
- `url` (必需): 目标页面URL
- `waitForSelector` (可选): 等待出现的CSS选择器
- `timeout` (可选): 超时时间（默认30秒）
- `userAgent` (可选): 自定义User-Agent
- `referer` (可选): 引用页面URL
- `extraHeaders` (可选): 额外HTTP头部

### 2. 元素点击 (browser.click)

点击页面元素，支持多种点击方式。

```javascript
await agent.handleToolCall('browser.click', {
  selector: 'button.submit-btn',
  clickType: 'left',
  waitForNavigation: true,
  modifiers: ['Control']
});
```

**参数说明:**
- `selector` (必需): 元素选择器（CSS或XPath）
- `selectorType` (可选): 选择器类型（auto/css/xpath）
- `clickType` (可选): 点击类型（left/right/middle/double）
- `index` (可选): 多个匹配元素时的索引
- `waitForNavigation` (可选): 是否等待页面导航
- `modifiers` (可选): 按键修饰符数组
- `offset` (可选): 点击偏移量 `{x: 0, y: 0}`

### 3. 内容提取 (browser.extract)

从页面提取文本、HTML或属性信息。

```javascript
// 提取单个元素
await agent.handleToolCall('browser.extract', {
  selectors: 'h1.title',
  extractType: 'text'
});

// 提取多个元素
await agent.handleToolCall('browser.extract', {
  selectors: {
    title: 'h1',
    price: '.price',
    description: '.description'
  },
  extractType: 'all',
  multiple: true
});

// 分页提取
await agent.handleToolCall('browser.extract', {
  selectors: '.product-item',
  multiple: true,
  pagination: {
    enabled: true,
    nextButtonSelector: '.next-page',
    maxPages: 5
  }
});
```

**参数说明:**
- `selectors` (必需): 选择器（字符串、数组或对象）
- `extractType` (可选): 提取类型（text/html/attributes/all）
- `multiple` (可选): 是否提取所有匹配元素
- `attributes` (可选): 要提取的属性列表
- `pagination` (可选): 分页提取配置
- `textOptions` (可选): 文本提取选项

## 🚀 快速开始

### 1. 初始化 AgentCore

```javascript
import { AgentCore } from 'agent-core';

const agent = new AgentCore({
  browser: {
    enabled: true,
    engine: 'puppeteer',        // 或 'playwright'
    headless: true,             // 无头模式
    viewport: { width: 1280, height: 720 },
    security: {
      allowedDomains: ['*.example.com'],
      blockResources: ['image', 'font'],
      maxExecutionTime: 30000
    }
  }
});

await agent.initialize();
```

### 2. 执行工具调用

```javascript
// 导航到页面
const navResult = await agent.handleToolCall('browser.navigate', {
  url: 'https://github.com/trending'
});

// 提取趋势项目
const projects = await agent.handleToolCall('browser.extract', {
  selectors: {
    name: '.h3.lh-condensed a',
    description: 'p.color-fg-muted',
    stars: '.d-inline-block.float-sm-right'
  },
  multiple: true,
  extractType: 'text'
});

console.log('发现', projects.data.results.name.elements.length, '个趋势项目');
```

### 3. 使用选择器工具

```javascript
import { 
  detectSelectorType, 
  SelectorPatterns, 
  createSelectorBuilder 
} from 'agent-core/browser';

// 自动检测选择器类型
const type = detectSelectorType('//button[contains(text(), "Submit")]'); // 'xpath'

// 使用选择器模式
const textSelector = SelectorPatterns.byText('提交'); 
const attrSelector = SelectorPatterns.byAttribute('data-testid', 'submit-btn');

// 构建复杂选择器
const builder = createSelectorBuilder();
const complexSelector = builder
  .tag('form')
  .id('login-form')
  .descendant()
  .tag('input')
  .attribute('type', 'password')
  .build(); // 'form#login-form input[type="password"]'
```

## 📋 工具配置

### 浏览器配置

```javascript
const browserConfig = {
  enabled: true,                    // 是否启用浏览器工具
  engine: 'puppeteer',             // 浏览器引擎 (puppeteer/playwright)
  headless: true,                  // 无头模式
  viewport: {                      // 默认视口
    width: 1920, 
    height: 1080
  },
  timeout: 30000,                  // 默认超时时间
  args: [                          // 浏览器启动参数
    '--no-sandbox',
    '--disable-dev-shm-usage'
  ]
};
```

### 安全策略配置

```javascript
const securityConfig = {
  allowedDomains: [                // 允许访问的域名
    '*.github.com',
    'stackoverflow.com',
    'developer.mozilla.org'
  ],
  blockedDomains: [                // 禁止访问的域名
    '*.ads.com',
    'tracker.com'
  ],
  blockResources: [                // 阻止的资源类型
    'image', 'font', 'media'
  ],
  maxExecutionTime: 60000,         // 最大执行时间
  maxMemoryUsage: '512MB',         // 最大内存使用
  allowJavaScript: true,           // 是否允许JavaScript
  allowPlugins: false              // 是否允许插件
};
```

## 🔧 高级用法

### 1. 自定义工具类

```javascript
import { BaseBrowserTool } from 'agent-core/browser';

class CustomTool extends BaseBrowserTool {
  constructor(browserInstance, securityPolicy) {
    super('custom', browserInstance, securityPolicy);
  }

  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        customParam: { type: 'string' }
      },
      required: ['customParam']
    };
  }

  async executeInternal(params) {
    const page = await this.browserInstance.getCurrentPage();
    // 自定义逻辑
    return { success: true, data: {} };
  }
}
```

### 2. 工具组合使用

```javascript
// 登录流程示例
async function loginFlow(agent, username, password) {
  // 1. 导航到登录页
  await agent.handleToolCall('browser.navigate', {
    url: 'https://example.com/login'
  });

  // 2. 填写用户名
  await agent.handleToolCall('browser.click', {
    selector: 'input[name="username"]'
  });
  await agent.handleToolCall('browser.type', {
    text: username
  });

  // 3. 填写密码
  await agent.handleToolCall('browser.click', {
    selector: 'input[name="password"]'
  });
  await agent.handleToolCall('browser.type', {
    text: password
  });

  // 4. 点击登录按钮
  await agent.handleToolCall('browser.click', {
    selector: 'button[type="submit"]',
    waitForNavigation: true
  });

  // 5. 验证登录结果
  const result = await agent.handleToolCall('browser.extract', {
    selectors: {
      success: '.success-message',
      error: '.error-message'
    },
    extractType: 'text'
  });

  return result;
}
```

### 3. 分页数据抓取

```javascript
async function scrapeAllPages(agent, url) {
  await agent.handleToolCall('browser.navigate', { url });

  const allData = await agent.handleToolCall('browser.extract', {
    selectors: {
      items: '.data-item',
      titles: '.item-title',
      descriptions: '.item-desc'
    },
    multiple: true,
    extractType: 'text',
    pagination: {
      enabled: true,
      nextButtonSelector: '.pagination .next',
      maxPages: 10,
      waitAfterClick: 2000
    }
  });

  return allData.data.results;
}
```

## 🧪 测试

运行浏览器工具测试:

```bash
npm test -- test/browser-tools.test.js
```

运行演示示例:

```bash
node examples/browser-tools-demo.js
```

## 📈 性能监控

工具执行过程中会收集性能指标:

```javascript
// 获取工具执行统计
const stats = await agent.getBrowserStats();
console.log({
  toolsExecuted: stats.toolsExecuted,
  averageExecutionTime: stats.totalExecutionTime / stats.toolsExecuted,
  successRate: stats.successCount / stats.toolsExecuted,
  memoryUsage: stats.memoryUsage
});

// 获取浏览器健康状态  
const health = await agent.getBrowserHealth();
console.log(health);
```

## 🛡️ 安全考虑

1. **域名白名单**: 只允许访问预设的可信域名
2. **资源阻止**: 阻止图片、字体等非必要资源加载
3. **执行时间限制**: 防止工具执行时间过长
4. **内存使用监控**: 监控和限制内存使用
5. **脚本注入防护**: 验证和清理注入的JavaScript代码

## 🔗 参考

- [Codex-rs 架构文档](../codex/README.md)
- [Agent-Core 核心文档](../README.md)
- [Puppeteer API](https://pptr.dev/)
- [Playwright API](https://playwright.dev/)

## 📝 更新日志

### v1.0.0 (2024-12-20)
- ✅ 实现核心浏览器工具框架
- ✅ NavigateTool (页面导航)
- ✅ ClickTool (元素点击) 
- ✅ ExtractTool (内容提取)
- ✅ 选择器工具库
- ✅ 安全策略和权限控制
- ✅ 性能监控和资源管理
