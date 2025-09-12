/**
 * 使用本地HTTP服务器的Extract Tool测试
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import http from 'http';
import {
  createBrowserToolSystem,
  BROWSER_TOOLS
} from '../src/browser/index.js';

describe('Extract Tool 真实测试', () => {
  let toolSystem;
  let server;
  let serverUrl;
  
  beforeAll(async () => {
    // 创建简单的HTTP服务器
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>测试页面标题</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>主要标题</h1>
        <h2>第一个副标题</h2>
        <h2>第二个副标题</h2>
        <p>这是第一段文字内容。</p>
        <p>这是第二段文字内容。</p>
        <div class="content">内容区域</div>
        <ul>
          <li>列表项1</li>
          <li>列表项2</li>
          <li>列表项3</li>
        </ul>
      </body>
      </html>
    `;
    
    server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(testHtml);
    });
    
    await new Promise((resolve) => {
      server.listen(0, 'localhost', () => {
        const port = server.address().port;
        serverUrl = `http://localhost:${port}`;
        console.log(`🌐 测试服务器启动: ${serverUrl}`);
        resolve();
      });
    });
    
    // 创建浏览器工具系统
    toolSystem = createBrowserToolSystem({
      headless: true,
      security: {
        securityLevel: 'relaxed',
        allowedDomains: ['localhost', '127.0.0.1'],
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
    if (server) {
      server.close();
    }
  });

  test('验证Extract Tool完整功能', async () => {
    console.log('🎯 开始完整的Extract Tool测试');
    
    // 1. 导航到测试页面
    console.log(`📍 步骤1: 导航到 ${serverUrl}`);
    const navigateResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.NAVIGATE,
      { url: serverUrl, timeout: 10000 }
    );
    
    console.log('导航结果:', navigateResult.success ? '✅成功' : '❌失败');
    expect(navigateResult.success).toBe(true);
    
    // 1.5. 检查页面内容 (调试)
    console.log('🔍 步骤1.5: 检查页面实际内容');
    const pageCheck = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EVALUATE,
      { script: 'document.documentElement.innerHTML' }
    );
    console.log('页面HTML内容:', pageCheck.data?.substring(0, 300) + '...');
    
    // 2. 提取单个元素
    console.log('📊 步骤2: 提取单个元素');
    const singleExtract = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          title: 'title',
          h1: 'h1'
        },
        extractType: 'text',
        multiple: false,
        waitForElements: false
      }
    );
    
    console.log('单个元素提取:', singleExtract.success ? '✅成功' : '❌失败');
    if (singleExtract.success && singleExtract.data?.data?.results) {
      const results = singleExtract.data.data.results;
      console.log('提取结果:');
      Object.entries(results).forEach(([key, result]) => {
        if (result.success && result.elements?.length > 0) {
          console.log(`  ${key}: "${result.elements[0]}"`);
        } else {
          console.log(`  ${key}: 未找到 (${result.error || '无错误信息'})`);
        }
      });
    }
    
    // 3. 提取多个元素
    console.log('📊 步骤3: 提取多个元素');
    const multipleExtract = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          h2_all: 'h2',
          paragraphs: 'p',
          list_items: 'li'
        },
        extractType: 'text',
        multiple: true,
        waitForElements: false
      }
    );
    
    console.log('多元素提取:', multipleExtract.success ? '✅成功' : '❌失败');
    if (multipleExtract.success && multipleExtract.data?.data?.results) {
      const results = multipleExtract.data.data.results;
      console.log('多元素结果:');
      Object.entries(results).forEach(([key, result]) => {
        if (result.success && result.elements?.length > 0) {
          console.log(`  ${key}: 找到${result.elements.length}个元素`);
          result.elements.forEach((element, index) => {
            console.log(`    ${index + 1}. "${element}"`);
          });
        } else {
          console.log(`  ${key}: 未找到`);
        }
      });
    }
    
    // 4. 验证Extract Tool的数据结构
    expect(singleExtract.success).toBe(true);
    expect(multipleExtract.success).toBe(true);
    
    console.log('🎉 Extract Tool功能验证完成');
  }, 30000);
});
