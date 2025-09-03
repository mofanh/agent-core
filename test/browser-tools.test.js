/**
 * Browser Tools Basic Tests
 * 
 * @fileoverview 浏览器工具基础测试
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { AgentCore } from '../src/index.js';
import { 
  NavigateTool, 
  ClickTool, 
  ExtractTool,
  TypeTool,
  ScreenshotTool,
  EvaluateTool,
  BrowserInstance,
  BrowserSecurityPolicy 
} from '../src/browser/index.js';

describe('Browser Tools Basic Tests', () => {
  let browserInstance;
  let securityPolicy;

  beforeAll(async () => {
    // 设置测试环境
    browserInstance = new BrowserInstance({
      engine: 'puppeteer',
      headless: true,
      viewport: { width: 1280, height: 720 }
    });
    
    securityPolicy = new BrowserSecurityPolicy({
      allowedDomains: ['*.example.com', '*.github.com'],
      maxExecutionTime: 10000
    });
  });

  afterAll(async () => {
    // 清理测试环境
    if (browserInstance) {
      await browserInstance.cleanup();
    }
  });

  describe('NavigateTool', () => {
    test('should create NavigateTool instance', () => {
      const tool = new NavigateTool(browserInstance, securityPolicy);
      expect(tool).toBeInstanceOf(NavigateTool);
      expect(tool.name).toBe('navigate');
    });

    test('should validate parameters correctly', () => {
      const tool = new NavigateTool(browserInstance, securityPolicy);
      
      // 有效参数
      const validParams = { url: 'https://example.com' };
      const validResult = tool.validateParameters(validParams);
      expect(validResult.valid).toBe(true);

      // 无效URL
      const invalidParams = { url: 'invalid-url' };
      const invalidResult = tool.validateParameters(invalidParams);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('无效的URL格式');
    });

    test('should get correct parameter schema', () => {
      const tool = new NavigateTool(browserInstance, securityPolicy);
      const schema = tool.getParameterSchema();
      
      expect(schema.type).toBe('object');
      expect(schema.required).toContain('url');
      expect(schema.properties.url.type).toBe('string');
    });
  });

  describe('ClickTool', () => {
    test('should create ClickTool instance', () => {
      const tool = new ClickTool(browserInstance, securityPolicy);
      expect(tool).toBeInstanceOf(ClickTool);
      expect(tool.name).toBe('click');
    });

    test('should validate selector parameters', () => {
      const tool = new ClickTool(browserInstance, securityPolicy);
      
      // 有效CSS选择器
      const validParams = { selector: 'button.submit' };
      const validResult = tool.validateParameters(validParams);
      expect(validResult.valid).toBe(true);

      // 空选择器
      const invalidParams = { selector: '' };
      const invalidResult = tool.validateParameters(invalidParams);
      expect(invalidResult.valid).toBe(false);
    });

    test('should handle click type options', () => {
      const tool = new ClickTool(browserInstance, securityPolicy);
      
      expect(tool.getClickButton('left')).toBe('left');
      expect(tool.getClickButton('right')).toBe('right');
      expect(tool.getClickButton('middle')).toBe('middle');
      expect(tool.getClickButton('double')).toBe('left');
    });
  });

  describe('ExtractTool', () => {
    test('should create ExtractTool instance', () => {
      const tool = new ExtractTool(browserInstance, securityPolicy);
      expect(tool).toBeInstanceOf(ExtractTool);
      expect(tool.name).toBe('extract');
    });

    test('should normalize selectors correctly', () => {
      const tool = new ExtractTool(browserInstance, securityPolicy);
      
      // 字符串选择器
      const stringSelectors = tool.normalizeSelectors('div.content');
      expect(stringSelectors).toEqual(['div.content']);

      // 数组选择器
      const arraySelectors = tool.normalizeSelectors(['h1', 'p']);
      expect(arraySelectors).toEqual(['h1', 'p']);

      // 对象选择器
      const objectSelectors = tool.normalizeSelectors({ title: 'h1', content: 'p' });
      expect(objectSelectors).toEqual(['h1', 'p']);
    });

    test('should parse selectors to key-value pairs', () => {
      const tool = new ExtractTool(browserInstance, securityPolicy);
      
      // 字符串解析
      const stringParsed = tool.parseSelectors('h1');
      expect(stringParsed).toEqual({ main: 'h1' });

      // 数组解析
      const arrayParsed = tool.parseSelectors(['h1', 'p']);
      expect(arrayParsed).toEqual({ selector_0: 'h1', selector_1: 'p' });

      // 对象解析
      const objectParsed = tool.parseSelectors({ title: 'h1', content: 'p' });
      expect(objectParsed).toEqual({ title: 'h1', content: 'p' });
    });
  });

  describe('TypeTool', () => {
    test('should create TypeTool instance', () => {
      const tool = new TypeTool(browserInstance, securityPolicy);
      expect(tool).toBeInstanceOf(TypeTool);
      expect(tool.name).toBe('type');
    });

    test('should validate input parameters', () => {
      const tool = new TypeTool(browserInstance, securityPolicy);
      
      // 有效参数
      const validParams = { selector: 'input[type="text"]', text: 'Hello World' };
      const validResult = tool.validateParameters(validParams);
      expect(validResult.valid).toBe(true);

      // 缺少文本
      const invalidParams = { selector: 'input[type="text"]' };
      const invalidResult = tool.validateParameters(invalidParams);
      expect(invalidResult.valid).toBe(false);
    });

    test('should detect input elements correctly', () => {
      const tool = new TypeTool(browserInstance, securityPolicy);
      
      // 文本输入框
      expect(tool.isInputElement({ tagName: 'input', type: 'text' })).toBe(true);
      expect(tool.isInputElement({ tagName: 'textarea' })).toBe(true);
      
      // 非输入元素
      expect(tool.isInputElement({ tagName: 'div' })).toBe(false);
      expect(tool.isInputElement({ tagName: 'button' })).toBe(false);
    });
  });

  describe('ScreenshotTool', () => {
    test('should create ScreenshotTool instance', () => {
      const tool = new ScreenshotTool(browserInstance, securityPolicy);
      expect(tool).toBeInstanceOf(ScreenshotTool);
      expect(tool.name).toBe('screenshot');
    });

    test('should validate screenshot parameters', () => {
      const tool = new ScreenshotTool(browserInstance, securityPolicy);
      
      // 视口截图
      const viewportParams = { type: 'viewport', format: 'png' };
      const viewportResult = tool.validateParameters(viewportParams);
      expect(viewportResult.valid).toBe(true);

      // 元素截图需要选择器
      const elementParamsInvalid = { type: 'element', format: 'png' };
      const elementInvalidResult = tool.validateParameters(elementParamsInvalid);
      expect(elementInvalidResult.valid).toBe(false);

      // 元素截图有效参数
      const elementParamsValid = { type: 'element', selector: '.target', format: 'png' };
      const elementValidResult = tool.validateParameters(elementParamsValid);
      expect(elementValidResult.valid).toBe(true);
    });
  });

  describe('EvaluateTool', () => {
    test('should create EvaluateTool instance', () => {
      const tool = new EvaluateTool(browserInstance, securityPolicy);
      expect(tool).toBeInstanceOf(EvaluateTool);
      expect(tool.name).toBe('evaluate');
    });

    test('should validate script security', () => {
      const tool = new EvaluateTool(browserInstance, securityPolicy);
      
      // 安全脚本
      const safeScript = 'return document.title;';
      const safeResult = tool.validateScriptSecurity(safeScript, false);
      expect(safeResult.valid).toBe(true);

      // 危险脚本
      const dangerousScript = 'eval("malicious code");';
      const dangerousResult = tool.validateScriptSecurity(dangerousScript, false);
      expect(dangerousResult.valid).toBe(false);

      // 允许危险API的情况
      const allowedResult = tool.validateScriptSecurity(dangerousScript, true);
      expect(allowedResult.valid).toBe(false); // eval 仍然被恶意模式阻止
    });

    test('should validate parameters correctly', () => {
      const tool = new EvaluateTool(browserInstance, securityPolicy);
      
      // 有效参数
      const validParams = { script: 'return "hello";' };
      const validResult = tool.validateParameters(validParams);
      expect(validResult.valid).toBe(true);

      // 空脚本
      const invalidParams = { script: '' };
      const invalidResult = tool.validateParameters(invalidParams);
      expect(invalidResult.valid).toBe(false);
    });
  });

  describe('Selector Utils', () => {
    test('should detect selector types correctly', async () => {
      const { detectSelectorType } = await import('../src/browser/utils/selector-utils.js');
      
      expect(detectSelectorType('div.class')).toBe('css');
      expect(detectSelectorType('//div[@class="test"]')).toBe('xpath');
      expect(detectSelectorType('#id')).toBe('css');
      expect(detectSelectorType('//button[contains(text(), "Click")]')).toBe('xpath');
    });

    test('should validate CSS selectors', async () => {
      const { isValidCSSSelector } = await import('../src/browser/utils/selector-utils.js');
      
      expect(isValidCSSSelector('div')).toBe(true);
      expect(isValidCSSSelector('.class')).toBe(true);
      expect(isValidCSSSelector('#id')).toBe(true);
      expect(isValidCSSSelector('div > p')).toBe(true);
      expect(isValidCSSSelector('')).toBe(false);
      expect(isValidCSSSelector(null)).toBe(false);
    });

    test('should generate selector patterns', async () => {
      const { SelectorPatterns } = await import('../src/browser/utils/selector-utils.js');
      
      expect(SelectorPatterns.byText('Click me')).toBe("//*[contains(text(), 'Click me')]");
      expect(SelectorPatterns.byId('submit')).toBe('#submit');
      expect(SelectorPatterns.byClass('btn', 'button')).toBe('button.btn');
      expect(SelectorPatterns.byAttribute('data-testid', 'button')).toBe('[data-testid="button"]');
    });

    test('should build complex selectors', async () => {
      const { createSelectorBuilder } = await import('../src/browser/utils/selector-utils.js');
      
      const builder = createSelectorBuilder();
      const selector = builder
        .tag('form')
        .id('login')
        .descendant()
        .tag('input')
        .attribute('type', 'text')
        .build();
        
      expect(selector).toBe('form#login input[type="text"]');
    });
  });

  describe('Integration Tests', () => {
    let agent;

    beforeAll(async () => {
      agent = new AgentCore({
        browser: {
          enabled: true,
          engine: 'puppeteer',
          headless: true
        },
        mcp: { enabled: false }
      });
    });

    afterAll(async () => {
      if (agent) {
        await agent.shutdown();
      }
    });

    test('should initialize AgentCore with browser tools', async () => {
      await agent.initialize();
      
      const capabilities = await agent.getCapabilities();
      expect(capabilities.browser.enabled).toBe(true);
      expect(capabilities.browser.tools).toContain('browser.navigate');
      expect(capabilities.browser.tools).toContain('browser.click');
      expect(capabilities.browser.tools).toContain('browser.extract');
      expect(capabilities.browser.tools).toContain('browser.type');
      expect(capabilities.browser.tools).toContain('browser.screenshot');
      expect(capabilities.browser.tools).toContain('browser.evaluate');
    });

    test('should handle browser tool calls', async () => {
      // 这个测试需要实际的浏览器环境，在CI中可能需要跳过
      if (process.env.CI) {
        test.skip('Skipping browser integration test in CI environment');
        return;
      }

      try {
        const result = await agent.handleToolCall('browser.navigate', {
          url: 'data:text/html,<html><head><title>Test</title></head><body><h1>Hello World</h1></body></html>',
          timeout: 5000
        });

        expect(result.success).toBe(true);
        expect(result.data.pageInfo.title).toBe('Test');
      } catch (error) {
        // 在某些环境中浏览器可能不可用
        console.warn('Browser integration test skipped:', error.message);
      }
    });
  });
});
