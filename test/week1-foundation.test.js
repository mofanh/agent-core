/**
 * Week 1 基础架构测试套件
 * 测试浏览器工具模块的核心框架和基础功能
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import {
  BrowserToolManager,
  BrowserInstance,
  BrowserSecurityPolicy,
  BROWSER_TOOLS,
  TOOL_STATUS,
  createBrowserToolManager,
  getSupportedTools
} from '../src/browser/index.js';

describe('Week 1 浏览器工具基础架构测试', () => {
  let browserToolManager;
  
  beforeAll(() => {
    // 30秒超时通过 Jest 配置处理
  });
  
  afterAll(async () => {
    if (browserToolManager) {
      await browserToolManager.cleanup();
    }
  });
  
  describe('1.1 浏览器工具管理器 (BrowserToolManager)', () => {
    test('应该能够创建浏览器工具管理器实例', () => {
      browserToolManager = new BrowserToolManager({
        enabled: true,
        engine: 'puppeteer',
        headless: true,
        timeout: 10000
      });
      
      expect(browserToolManager).toBeInstanceOf(BrowserToolManager);
      expect(browserToolManager.config.enabled).toBe(true);
      expect(browserToolManager.config.engine).toBe('puppeteer');
      expect(browserToolManager.config.headless).toBe(true);
      expect(browserToolManager.config.timeout).toBe(10000);
    });
    
    test('应该能够使用工厂函数创建管理器', () => {
      const manager = createBrowserToolManager({
        engine: 'puppeteer',
        headless: true
      });
      
      expect(manager).toBeInstanceOf(BrowserToolManager);
      expect(manager.config.engine).toBe('puppeteer');
      
      // 清理资源
      manager.cleanup();
    });
    
    test('应该具有正确的默认配置', () => {
      const manager = new BrowserToolManager();
      
      expect(manager.config.enabled).toBe(true);
      expect(manager.config.engine).toBe('puppeteer');
      expect(manager.config.headless).toBe(true);
      expect(manager.config.timeout).toBe(30000);
      expect(manager.config.viewport).toEqual({ width: 1920, height: 1080 });
      
      manager.cleanup();
    });
    
    test('应该能够初始化和清理', async () => {
      const manager = new BrowserToolManager({
        headless: true,
        instancePool: { enabled: false } // 禁用实例池以简化测试
      });
      
      expect(manager.isInitialized).toBe(false);
      
      await manager.initialize();
      expect(manager.isInitialized).toBe(true);
      
      await manager.cleanup();
      expect(manager.isInitialized).toBe(false);
    });
    
    test('应该能够获取支持的工具列表', () => {
      const manager = new BrowserToolManager();
      const tools = manager.getSupportedTools();
      
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
      
      // 验证工具包含基本信息
      tools.forEach(tool => {
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.parameters).toBeDefined();
      });
      
      manager.cleanup();
    });
    
    test('应该能够检查工具可用性', async () => {
      const manager = new BrowserToolManager({
        headless: true,
        instancePool: { enabled: false }
      });
      
      await manager.initialize();
      
      expect(manager.isToolAvailable(BROWSER_TOOLS.NAVIGATE)).toBe(true);
      expect(manager.isToolAvailable(BROWSER_TOOLS.EXTRACT)).toBe(true);
      expect(manager.isToolAvailable(BROWSER_TOOLS.CLICK)).toBe(true);
      expect(manager.isToolAvailable('non-existent-tool')).toBe(false);
      
      await manager.cleanup();
    });
    
    test('应该能够获取统计信息', () => {
      const manager = new BrowserToolManager();
      const stats = manager.getStats();
      
      expect(stats).toBeDefined();
      expect(stats.traditional).toBeDefined();
      expect(stats.monitoring).toBeDefined();
      expect(stats.combined).toBeDefined();
      
      // 验证统计信息结构
      expect(typeof stats.traditional.toolsExecuted).toBe('number');
      expect(typeof stats.traditional.totalExecutionTime).toBe('number');
      expect(typeof stats.traditional.successCount).toBe('number');
      expect(typeof stats.traditional.errorCount).toBe('number');
      
      manager.cleanup();
    });
    
    test('应该能够获取健康状态', async () => {
      const manager = new BrowserToolManager({
        headless: true,
        instancePool: { enabled: false }
      });
      
      const healthBefore = await manager.getHealthStatus();
      expect(healthBefore.manager.initialized).toBe(false);
      
      await manager.initialize();
      
      const healthAfter = await manager.getHealthStatus();
      expect(healthAfter.manager.initialized).toBe(true);
      expect(healthAfter.manager.enabled).toBe(true);
      
      await manager.cleanup();
    });
  });
  
  describe('1.2 浏览器实例管理 (BrowserInstance)', () => {
    let browserInstance;
    
    afterEach(async () => {
      if (browserInstance) {
        await browserInstance.destroy();
        browserInstance = null;
      }
    });
    
    test('应该能够创建浏览器实例', () => {
      browserInstance = new BrowserInstance({
        engine: 'puppeteer',
        headless: true,
        args: ['--no-sandbox'],
        defaultViewport: { width: 1280, height: 720 }
      });
      
      expect(browserInstance).toBeInstanceOf(BrowserInstance);
      expect(browserInstance.config.engine).toBe('puppeteer');
      expect(browserInstance.config.headless).toBe(true);
    });
    
    test('应该能够启动和关闭浏览器', async () => {
      browserInstance = new BrowserInstance({
        engine: 'puppeteer',
        headless: true
      });
      
      expect(browserInstance.isRunning()).toBe(false);
      
      await browserInstance.launch();
      expect(browserInstance.isRunning()).toBe(true);
      
      await browserInstance.close();
      expect(browserInstance.isRunning()).toBe(false);
    });
    
    test('应该能够创建和管理页面', async () => {
      browserInstance = new BrowserInstance({
        engine: 'puppeteer',
        headless: true
      });
      
      await browserInstance.launch();
      
      const page = await browserInstance.newPage();
      expect(page).toBeDefined();
      
      const pages = await browserInstance.getPages();
      expect(pages.length).toBeGreaterThan(0);
      
      await browserInstance.closePage(page);
      await browserInstance.close();
    });
    
    test('应该能够检查健康状态', async () => {
      browserInstance = new BrowserInstance({
        engine: 'puppeteer',
        headless: true
      });
      
      expect(await browserInstance.isHealthy()).toBe(false);
      
      await browserInstance.launch();
      expect(await browserInstance.isHealthy()).toBe(true);
      
      await browserInstance.close();
      expect(await browserInstance.isHealthy()).toBe(false);
    });
    
    test('应该能够获取性能指标', async () => {
      browserInstance = new BrowserInstance({
        engine: 'puppeteer',
        headless: true
      });
      
      await browserInstance.launch();
      
      const metrics = browserInstance.getMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics.pagesCreated).toBe('number');
      expect(typeof metrics.pagesClosed).toBe('number');
      expect(typeof metrics.uptime).toBe('number');
      
      await browserInstance.close();
    });
    
    test('应该能够设置和获取视口', async () => {
      browserInstance = new BrowserInstance({
        engine: 'puppeteer',
        headless: true
      });
      
      await browserInstance.launch();
      const page = await browserInstance.newPage();
      
      await browserInstance.setViewport(page, { width: 800, height: 600 });
      const viewport = await browserInstance.getViewport(page);
      
      expect(viewport.width).toBe(800);
      expect(viewport.height).toBe(600);
      
      await browserInstance.close();
    });
  });
  
  describe('1.3 安全策略 (BrowserSecurityPolicy)', () => {
    let securityPolicy;
    
    beforeEach(() => {
      securityPolicy = new BrowserSecurityPolicy({
        enableUrlValidation: true,
        allowedDomains: ['example.com', 'google.com'],
        blockedDomains: ['malicious-site.com'],
        maxNavigationTimeout: 10000,
        maxResourceSize: 10 * 1024 * 1024,
        enableScriptBlocking: true
      });
    });
    
    test('应该能够创建安全策略实例', () => {
      expect(securityPolicy).toBeInstanceOf(BrowserSecurityPolicy);
      expect(securityPolicy.config.enableUrlValidation).toBe(true);
      expect(securityPolicy.config.allowedDomains).toContain('example.com');
      expect(securityPolicy.config.blockedDomains).toContain('malicious-site.com');
    });
    
    test('应该能够验证URL安全性', async () => {
      // 测试允许的域名
      await expect(securityPolicy.validateOperation('navigate', {
        url: 'https://example.com'
      })).resolves.not.toThrow();
      
      // 测试被阻止的域名
      await expect(securityPolicy.validateOperation('navigate', {
        url: 'https://malicious-site.com'
      })).rejects.toThrow();
      
      // 测试不在白名单的域名（如果配置了白名单）
      await expect(securityPolicy.validateOperation('navigate', {
        url: 'https://unknown-site.com'
      })).rejects.toThrow();
    });
    
    test('应该能够验证选择器安全性', async () => {
      // 测试安全的选择器
      await expect(securityPolicy.validateOperation('extract', {
        selector: 'h1.title'
      })).resolves.not.toThrow();
      
      // 测试可能有风险的选择器
      await expect(securityPolicy.validateOperation('extract', {
        selector: 'input[type="password"]'
      })).resolves.not.toThrow(); // 可能会警告但不会阻止
    });
    
    test('应该能够验证脚本安全性', async () => {
      // 测试安全的脚本
      await expect(securityPolicy.validateOperation('evaluate', {
        code: 'document.title'
      })).resolves.not.toThrow();
      
      // 测试危险的脚本
      if (securityPolicy.config.enableScriptBlocking) {
        await expect(securityPolicy.validateOperation('evaluate', {
          code: 'eval("malicious code")'
        })).rejects.toThrow();
      }
    });
    
    test('应该能够检查资源限制', () => {
      const largeSize = 20 * 1024 * 1024; // 20MB
      const smallSize = 1 * 1024 * 1024;  // 1MB
      
      expect(securityPolicy.isResourceSizeAllowed(smallSize)).toBe(true);
      expect(securityPolicy.isResourceSizeAllowed(largeSize)).toBe(false);
    });
    
    test('应该能够获取安全统计', () => {
      const stats = securityPolicy.getSecurityStats();
      
      expect(stats).toBeDefined();
      expect(typeof stats.validationsPerformed).toBe('number');
      expect(typeof stats.violationsDetected).toBe('number');
      expect(Array.isArray(stats.allowedDomains)).toBe(true);
      expect(Array.isArray(stats.blockedDomains)).toBe(true);
    });
  });
  
  describe('1.4 工具常量和枚举', () => {
    test('应该定义正确的浏览器工具常量', () => {
      expect(BROWSER_TOOLS).toBeDefined();
      expect(typeof BROWSER_TOOLS.NAVIGATE).toBe('string');
      expect(typeof BROWSER_TOOLS.CLICK).toBe('string');
      expect(typeof BROWSER_TOOLS.EXTRACT).toBe('string');
      expect(typeof BROWSER_TOOLS.TYPE).toBe('string');
      expect(typeof BROWSER_TOOLS.SCREENSHOT).toBe('string');
      expect(typeof BROWSER_TOOLS.EVALUATE).toBe('string');
      
      // 验证工具名称符合命名规范
      Object.values(BROWSER_TOOLS).forEach(toolName => {
        expect(toolName).toMatch(/^browser\.[a-z_]+$/);
      });
    });
    
    test('应该定义正确的工具状态常量', () => {
      expect(TOOL_STATUS).toBeDefined();
      expect(TOOL_STATUS.PENDING).toBe('pending');
      expect(TOOL_STATUS.RUNNING).toBe('running');
      expect(TOOL_STATUS.SUCCESS).toBe('success');
      expect(TOOL_STATUS.FAILED).toBe('failed');
      expect(TOOL_STATUS.TIMEOUT).toBe('timeout');
    });
  });
  
  describe('1.5 模块导出和集成', () => {
    test('应该正确导出所有核心类', () => {
      expect(BrowserToolManager).toBeDefined();
      expect(BrowserInstance).toBeDefined();
      expect(BrowserSecurityPolicy).toBeDefined();
    });
    
    test('应该正确导出工具函数', () => {
      expect(typeof createBrowserToolManager).toBe('function');
      expect(typeof getSupportedTools).toBe('function');
    });
    
    test('应该正确导出常量', () => {
      expect(BROWSER_TOOLS).toBeDefined();
      expect(TOOL_STATUS).toBeDefined();
    });
    
    test('getSupportedTools 应该返回完整的工具列表', () => {
      const tools = getSupportedTools();
      
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThanOrEqual(6); // 至少6个核心工具
      
      // 验证每个工具都有必需的属性
      tools.forEach(tool => {
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.parameters).toBeDefined();
        expect(tool.parameters.type).toBe('object');
        expect(tool.parameters.properties).toBeDefined();
      });
      
      // 验证包含核心工具
      const toolNames = tools.map(t => t.name);
      expect(toolNames).toContain(BROWSER_TOOLS.NAVIGATE);
      expect(toolNames).toContain(BROWSER_TOOLS.EXTRACT);
      expect(toolNames).toContain(BROWSER_TOOLS.CLICK);
    });
  });
  
  describe('1.6 配置和扩展性', () => {
    test('应该支持不同的浏览器引擎配置', () => {
      const puppeteerManager = new BrowserToolManager({
        engine: 'puppeteer',
        headless: true
      });
      
      const playwrightManager = new BrowserToolManager({
        engine: 'playwright',
        headless: true
      });
      
      expect(puppeteerManager.config.engine).toBe('puppeteer');
      expect(playwrightManager.config.engine).toBe('playwright');
      
      puppeteerManager.cleanup();
      playwrightManager.cleanup();
    });
    
    test('应该支持自定义视口配置', () => {
      const manager = new BrowserToolManager({
        viewport: { width: 800, height: 600 }
      });
      
      expect(manager.config.viewport.width).toBe(800);
      expect(manager.config.viewport.height).toBe(600);
      
      manager.cleanup();
    });
    
    test('应该支持自定义超时配置', () => {
      const manager = new BrowserToolManager({
        timeout: 15000
      });
      
      expect(manager.config.timeout).toBe(15000);
      
      manager.cleanup();
    });
    
    test('应该支持禁用浏览器工具', () => {
      const manager = new BrowserToolManager({
        enabled: false
      });
      
      expect(manager.config.enabled).toBe(false);
      
      manager.cleanup();
    });
  });
  
  describe('1.7 错误处理和边界情况', () => {
    test('应该正确处理无效配置', () => {
      expect(() => new BrowserToolManager({
        engine: 'invalid-engine'
      })).not.toThrow(); // 应该使用默认引擎
      
      expect(() => new BrowserToolManager({
        timeout: -1
      })).not.toThrow(); // 应该使用默认超时
    });
    
    test('应该正确处理空配置', () => {
      expect(() => new BrowserToolManager()).not.toThrow();
      expect(() => new BrowserToolManager({})).not.toThrow();
      expect(() => new BrowserToolManager(null)).not.toThrow();
    });
    
    test('应该在未初始化时抛出适当的错误', async () => {
      const manager = new BrowserToolManager();
      
      // 在未初始化时执行工具应该失败
      await expect(manager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE, 
        { url: 'https://example.com' }, 
        'test'
      )).rejects.toThrow();
      
      manager.cleanup();
    });
  });
  
  describe('1.8 事件系统', () => {
    test('应该支持事件监听和发射', (done) => {
      const manager = new BrowserToolManager();
      
      // 监听初始化事件
      manager.once('initialized', () => {
        expect(manager.isInitialized).toBe(true);
        manager.cleanup().then(() => done());
      });
      
      // 初始化应该触发事件
      manager.initialize();
    });
    
    test('应该在清理时触发事件', (done) => {
      const manager = new BrowserToolManager();
      
      manager.once('cleanup', () => {
        done();
      });
      
      manager.initialize().then(() => {
        manager.cleanup();
      });
    });
  });
});

// Week 1 性能测试
describe('Week 1 性能基准测试', () => {
  test('BrowserToolManager 初始化性能', async () => {
    const startTime = Date.now();
    
    const manager = new BrowserToolManager({
      headless: true,
      instancePool: { enabled: false }
    });
    
    await manager.initialize();
    
    const initTime = Date.now() - startTime;
    
    console.log(`BrowserToolManager 初始化耗时: ${initTime}ms`);
    expect(initTime).toBeLessThan(10000); // 10秒内完成初始化
    
    await manager.cleanup();
  });
  
  test('BrowserInstance 启动性能', async () => {
    const startTime = Date.now();
    
    const instance = new BrowserInstance({
      engine: 'puppeteer',
      headless: true
    });
    
    await instance.initialize();
    
    const launchTime = Date.now() - startTime;
    
    console.log(`BrowserInstance 启动耗时: ${launchTime}ms`);
    expect(launchTime).toBeLessThan(8000); // 8秒内完成启动
    
    await instance.destroy();
  });
  
  test('内存使用测试', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    const manager = new BrowserToolManager({
      headless: true,
      instancePool: { enabled: false }
    });
    
    await manager.initialize();
    
    const afterInitMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = afterInitMemory - initialMemory;
    
    console.log(`内存增长: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    
    await manager.cleanup();
    
    // 强制垃圾回收（如果可用）
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryLeak = finalMemory - initialMemory;
    
    console.log(`潜在内存泄漏: ${(memoryLeak / 1024 / 1024).toFixed(2)}MB`);
    
    // 内存增长应该在合理范围内
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB
    expect(memoryLeak).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
});
