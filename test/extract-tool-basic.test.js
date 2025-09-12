/**
 * 基础 Extract Tool 测试
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import {
  createBrowserToolSystem,
  BROWSER_TOOLS
} from '../src/browser/index.js';

describe('Extract Tool 基础功能测试', () => {
  let toolSystem;
  
  beforeAll(async () => {
    // 创建最宽松的安全策略
    toolSystem = createBrowserToolSystem({
      headless: true,
      security: {
        securityLevel: 'relaxed',
        allowedDomains: ['*'],
        blockedDomains: [],
        enableSandbox: false,
        auditLog: false
      }
    });
    
    await toolSystem.initialize();
  });

  afterAll(async () => {
    if (toolSystem) {
      await toolSystem.cleanup();
    }
  });

  test('应该能够导航到简单的HTML页面', async () => {
    console.log('🔍 测试1: 基础页面导航');
    
    // 使用一个简单的在线HTML页面
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><title>测试页面</title></head>
      <body>
        <h1>主标题</h1>
        <h2>副标题1</h2>
        <h2>副标题2</h2>
        <p>第一段内容</p>
        <p>第二段内容</p>
        <div class="content">内容区域</div>
      </body>
      </html>
    `;
    
    // 创建data URL
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    
    try {
      const navigateResult = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: dataUrl, timeout: 10000 }
      );
      
      console.log('导航结果:', navigateResult.success ? '成功' : '失败');
      if (!navigateResult.success) {
        console.log('导航错误:', navigateResult.error);
      }
      
      expect(navigateResult.success).toBe(true);
    } catch (error) {
      console.error('导航失败:', error.message);
      throw error;
    }
  }, 15000);

  test('应该能够使用Extract工具提取基本元素', async () => {
    console.log('🔍 测试2: Extract工具基础功能');
    
    try {
      const extractResult = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.EXTRACT,
        {
          selectors: {
            title: 'title',
            h1: 'h1',
            h2_list: 'h2'
          },
          extractType: 'text',
          multiple: false,
          waitForElements: false,
          timeout: 5000
        }
      );
      
      console.log('Extract结果:', extractResult.success ? '成功' : '失败');
      if (extractResult.success && extractResult.data?.data?.results) {
        const results = extractResult.data.data.results;
        console.log('提取到的元素:');
        Object.keys(results).forEach(key => {
          const result = results[key];
          if (result.success && result.elements?.length > 0) {
            console.log(`  ${key}: ${result.elements[0]}`);
          } else {
            console.log(`  ${key}: 未找到`);
          }
        });
      } else {
        console.log('Extract错误:', extractResult.error);
      }
      
      expect(extractResult.success).toBe(true);
      
    } catch (error) {
      console.error('Extract测试失败:', error.message);
      throw error;
    }
  }, 15000);

  test('应该能够验证Extract工具的错误处理', async () => {
    console.log('🔍 测试3: Extract工具错误处理');
    
    try {
      // 测试不存在的选择器
      const extractResult = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.EXTRACT,
        {
          selectors: {
            nonexistent: '.does-not-exist'
          },
          extractType: 'text',
          waitForElements: false,
          timeout: 2000
        }
      );
      
      console.log('不存在选择器的结果:', extractResult.success ? '成功' : '失败');
      if (extractResult.success && extractResult.data?.data?.results) {
        const results = extractResult.data.data.results;
        const nonexistentResult = results.nonexistent;
        console.log('非存在元素结果:', nonexistentResult);
        
        // 应该返回成功但元素为空
        expect(nonexistentResult.success).toBe(false);
        expect(nonexistentResult.elements).toEqual([]);
      }
      
    } catch (error) {
      console.error('错误处理测试失败:', error.message);
      throw error;
    }
  }, 10000);
});
