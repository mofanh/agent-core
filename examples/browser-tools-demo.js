/**
 * Browser Tools Demo
 * 
 * @fileoverview 浏览器工具演示示例
 */

import { AgentCore } from '../src/index.js';
import { logger } from '../src/utils/logger.js';

/**
 * 演示浏览器工具的基本功能
 */
async function demoBrowserTools() {
  logger.info('=== 浏览器工具演示开始 ===');

  // 1. 创建 AgentCore 实例，启用浏览器工具
  const agent = new AgentCore({
    browser: {
      enabled: true,
      engine: 'puppeteer',
      headless: true, // 无头模式运行
      viewport: { width: 1280, height: 720 },
      security: {
        allowedDomains: ['*.github.com', '*.npmjs.com'],
        maxExecutionTime: 30000
      }
    },
    mcp: {
      enabled: false // 为了演示简化，禁用MCP
    }
  });

  try {
    // 2. 初始化代理
    await agent.initialize();
    logger.info('AgentCore 初始化完成');

    // 3. 测试页面导航
    logger.info('\n📍 测试1: 页面导航');
    const navigateResult = await agent.handleToolCall('browser.navigate', {
      url: 'https://github.com',
      waitForSelector: '.header-menu-wrapper',
      timeout: 15000
    });
    
    logger.info('导航结果:', {
      success: navigateResult.success,
      url: navigateResult.data?.finalUrl,
      title: navigateResult.data?.pageInfo?.title,
      loadTime: navigateResult.data?.loadTime
    });

    // 4. 测试内容提取
    logger.info('\n📊 测试2: 内容提取');
    const extractResult = await agent.handleToolCall('browser.extract', {
      selectors: {
        title: 'title',
        description: 'meta[name="description"]',
        navigation: '.header-menu-wrapper a'
      },
      extractType: 'all',
      multiple: true
    });

    logger.info('提取结果:', {
      success: extractResult.success,
      resultsCount: Object.keys(extractResult.data?.results || {}).length,
      totalElements: extractResult.data?.metadata?.totalElements
    });

    // 5. 测试元素点击（搜索按钮）
    logger.info('\n🖱️ 测试3: 元素点击');
    try {
      const clickResult = await agent.handleToolCall('browser.click', {
        selector: '[aria-label="Search"]',
        clickType: 'left',
        waitForElement: true,
        timeout: 10000
      });

      logger.info('点击结果:', {
        success: clickResult.success,
        coordinates: clickResult.data?.coordinates,
        elementTag: clickResult.data?.elementInfo?.tagName
      });
    } catch (error) {
      logger.warn('点击测试可能因为页面结构变化而失败:', error.message);
    }

    // 6. 演示工具链调用
    logger.info('\n🔗 测试4: 工具链组合使用');
    
    // 导航到NPM首页
    await agent.handleToolCall('browser.navigate', {
      url: 'https://www.npmjs.com',
      waitForSelector: 'input[type="search"]',
      timeout: 15000
    });

    // 提取搜索框信息
    const searchBoxInfo = await agent.handleToolCall('browser.extract', {
      selectors: {
        searchInput: 'input[type="search"]',
        searchButton: 'button[type="submit"]'
      },
      extractType: 'attributes',
      attributes: ['placeholder', 'name', 'id']
    });

    logger.info('搜索框信息:', searchBoxInfo.data?.results);

    // 7. 获取浏览器健康状态
    const healthStatus = await agent.getBrowserHealth();
    logger.info('\n💻 浏览器健康状态:', healthStatus);

  } catch (error) {
    logger.error('演示过程中发生错误:', error);
  } finally {
    // 8. 清理资源
    await agent.shutdown();
    logger.info('\n✅ 浏览器工具演示完成，资源已清理');
  }
}

/**
 * 演示选择器工具的使用
 */
async function demoSelectorUtils() {
  logger.info('\n=== 选择器工具演示 ===');

  // 导入选择器工具
  const { 
    detectSelectorType, 
    SelectorPatterns, 
    createSelectorBuilder 
  } = await import('../src/browser/utils/selector-utils.js');

  // 1. 选择器类型检测
  const selectors = [
    'button.submit-btn',
    '//button[contains(text(), "Submit")]',
    '#login-form input[name="username"]',
    '//div[@class="content"]//p[1]'
  ];

  logger.info('选择器类型检测:');
  selectors.forEach(selector => {
    const type = detectSelectorType(selector);
    logger.info(`  "${selector}" -> ${type}`);
  });

  // 2. 选择器模式使用
  logger.info('\n选择器模式示例:');
  logger.info('按文本查找:', SelectorPatterns.byText('提交'));
  logger.info('按属性查找:', SelectorPatterns.byAttribute('data-testid', 'submit-btn'));
  logger.info('按占位符查找:', SelectorPatterns.byPlaceholder('请输入用户名'));

  // 3. 选择器构建器
  logger.info('\n选择器构建器示例:');
  const builder = createSelectorBuilder();
  
  const complexSelector = builder
    .tag('form')
    .id('login-form')
    .descendant()
    .tag('input')
    .attribute('type', 'text')
    .pseudo('first-child')
    .build();
    
  logger.info('构建的选择器:', complexSelector);
}

/**
 * 运行所有演示
 */
async function runDemo() {
  try {
    await demoSelectorUtils();
    await demoBrowserTools();
  } catch (error) {
    logger.error('演示运行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件，则执行演示
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}

export { demoBrowserTools, demoSelectorUtils, runDemo };
