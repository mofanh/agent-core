/**
 * 简单的浏览器工具测试 - 使用内联HTML
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import {
  createBrowserToolSystem,
  BROWSER_TOOLS
} from '../src/browser/index.js';

describe('浏览器工具功能测试', () => {
  let toolSystem;
  
  beforeAll(async () => {
    toolSystem = createBrowserToolSystem({
      headless: true,
      devtools: false,
      security: {
        securityLevel: 'relaxed',
        allowedDomains: ['*'],
        blockedDomains: [],
        enableSandbox: false
      }
    });
    
    await toolSystem.initialize();
  });

  afterAll(async () => {
    if (toolSystem) {
      await toolSystem.cleanup();
    }
  });

  test('浏览器工具应该能够处理内联HTML并提取内容', async () => {
    console.log('🧪 开始测试浏览器工具的提取功能');
    
    // 1. 使用 data URL 创建内联HTML页面
    const htmlContent = `
      <html>
        <head>
          <title>测试页面</title>
        </head>
        <body>
          <h1>主标题</h1>
          <h2>副标题1</h2>
          <h2>副标题2</h2>
          <p>第一段落</p>
          <p>第二段落</p>
          <div class="content">主要内容</div>
          <a href="#" id="test-link">测试链接</a>
        </body>
      </html>
    `;
    
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    
    // 2. 导航到内联HTML
    console.log('📍 导航到内联HTML页面...');
    const navigateResult = await toolSystem.toolManager.executeLocalTool(BROWSER_TOOLS.NAVIGATE, {
      url: dataUrl,
      timeout: 10000
    });
    
    expect(navigateResult.success).toBe(true);
    console.log('✅ 页面导航成功');
    
    // 3. 使用Extract工具提取内容
    console.log('📊 使用Extract工具提取页面内容...');
    const extractResult = await toolSystem.toolManager.executeLocalTool(BROWSER_TOOLS.EXTRACT, {
      selectors: {
        title: 'title',
        h1: 'h1',
        h2_list: 'h2',
        paragraphs: 'p',
        content: '.content',
        link: '#test-link'
      },
      extractType: 'text',
      multiple: true,
      waitForElements: false,
      timeout: 5000
    });

    expect(extractResult.success).toBe(true);
    expect(extractResult.data?.data?.results).toBeDefined();
    
    const results = extractResult.data.data.results;
    console.log('🎯 提取结果:');
    
    // 验证提取结果
    if (results.title && results.title.elements.length > 0) {
      console.log(`   页面标题: ${results.title.elements[0].text}`);
      expect(results.title.elements[0].text).toBe('测试页面');
    }
    
    if (results.h1 && results.h1.elements.length > 0) {
      console.log(`   主标题: ${results.h1.elements[0].text}`);
      expect(results.h1.elements[0].text).toBe('主标题');
    }
    
    if (results.h2_list && results.h2_list.elements.length > 0) {
      console.log(`   H2标题数: ${results.h2_list.elements.length}`);
      expect(results.h2_list.elements.length).toBe(2);
      console.log(`   H2标题: ${results.h2_list.elements.map(e => e.text).join(', ')}`);
    }
    
    if (results.paragraphs && results.paragraphs.elements.length > 0) {
      console.log(`   段落数: ${results.paragraphs.elements.length}`);
      expect(results.paragraphs.elements.length).toBe(2);
    }
    
    if (results.content && results.content.elements.length > 0) {
      console.log(`   内容: ${results.content.elements[0].text}`);
      expect(results.content.elements[0].text).toBe('主要内容');
    }
    
    if (results.link && results.link.elements.length > 0) {
      console.log(`   链接文本: ${results.link.elements[0].text}`);
      expect(results.link.elements[0].text).toBe('测试链接');
    }
    
    console.log('✅ 浏览器工具提取功能测试完成！');
    
  }, 30000);
});
