/**
 * 浏览器集成测试 - 在真实浏览器环境中测试
 * 配合 webpilot 浏览器插件进行测试
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import {
  BrowserToolManager,
  BROWSER_TOOLS,
  createBrowserToolSystem
} from '../src/browser/index.js';

describe('浏览器工具集成测试', () => {
  let toolSystem;
  
  beforeAll(async () => {
    // 初始化浏览器工具系统
    toolSystem = createBrowserToolSystem({
      headless: false, // 在可见浏览器中测试
      devtools: true,  // 启用开发者工具
      browser: {
        engine: 'puppeteer', // 或者使用已安装的浏览器
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
  });

  afterAll(async () => {
    if (toolSystem) {
      await toolSystem.cleanup();
    }
  });

  describe('基础浏览器操作测试', () => {
    test('应该能够导航到测试页面', async () => {
      // 使用简单的HTML页面进行测试
      const testHtml = `
        <!DOCTYPE html>
        <html>
        <head><title>Test Page</title></head>
        <body>
          <h1 id="title">Test Page</h1>
          <button id="test-btn">Click Me</button>
          <input id="test-input" type="text" placeholder="Type here">
          <div id="result"></div>
        </body>
        </html>
      `;
      
      // 创建data URL避免需要web服务器
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(testHtml)}`;
      
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.NAVIGATE, {
        url: dataUrl,
        waitFor: '#title'
      });
      
      expect(result.success).toBe(true);
      expect(result.url).toBe(dataUrl);
    });

    test('应该能够提取页面内容', async () => {
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.EXTRACT, {
        selector: '#title',
        attribute: 'text'
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('Test Page');
    });

    test('应该能够点击按钮', async () => {
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.CLICK, {
        selector: '#test-btn'
      });
      
      expect(result.success).toBe(true);
    });

    test('应该能够输入文本', async () => {
      const testText = 'Hello WebPilot!';
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.TYPE, {
        selector: '#test-input',
        text: testText
      });
      
      expect(result.success).toBe(true);
      
      // 验证输入内容
      const extractResult = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.EXTRACT, {
        selector: '#test-input',
        attribute: 'value'
      });
      
      expect(extractResult.data).toBe(testText);
    });

    test('应该能够执行JavaScript', async () => {
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.EVALUATE, {
        code: `
          document.getElementById('result').textContent = 'JavaScript Executed!';
          return document.getElementById('result').textContent;
        `
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('JavaScript Executed!');
    });

    test('应该能够截图', async () => {
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.SCREENSHOT, {
        format: 'png',
        fullPage: true
      });
      
      expect(result.success).toBe(true);
      expect(result.data).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('错误处理测试', () => {
    test('应该正确处理无效选择器', async () => {
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.CLICK, {
        selector: '#non-existent-element',
        timeout: 1000
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Element not found');
    });

    test('应该正确处理JavaScript错误', async () => {
      const result = await toolSystem.toolManager.executeTool(BROWSER_TOOLS.EVALUATE, {
        code: 'throw new Error("Test error");'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Test error');
    });
  });

  describe('性能测试', () => {
    test('工具执行应该在合理时间内完成', async () => {
      const startTime = Date.now();
      
      await toolSystem.toolManager.executeTool(BROWSER_TOOLS.EXTRACT, {
        selector: 'body',
        attribute: 'text'
      });
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5秒内完成
    });
  });
});
