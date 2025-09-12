/**
 * 简化的浏览器集成测试 - 专注于数据抓取
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import {
  createBrowserToolSystem,
  BROWSER_TOOLS
} from '../src/browser/index.js';

describe('Course.rs 数据抓取测试', () => {
  let toolSystem;
  
  beforeAll(async () => {
    toolSystem = createBrowserToolSystem({
      headless: false,
      devtools: true,
      browser: {
        engine: 'puppeteer',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
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

  test('抓取 Rust 语言圣经集合类型页面的数据', async () => {
    console.log('\n🚀 开始抓取 https://course.rs/basic/collections/intro.html');
    console.log('================================================================================');
    
    // 1. 导航到页面
    console.log('\n📍 步骤1: 页面导航');
    const navigateResult = await toolSystem.toolManager.executeLocalTool(BROWSER_TOOLS.NAVIGATE, {
      url: 'https://course.rs/basic/collections/intro.html',
      timeout: 30000
    });
    
    expect(navigateResult.success).toBe(true);
    console.log(`✅ 页面导航成功: ${navigateResult.data.data.url}`);
    console.log(`📄 页面标题: ${navigateResult.data.data.pageInfo?.title || '未知'}`);
    
    // 2. 等待页面加载
    console.log('\n⏳ 等待页面内容完全加载...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 3. 使用 Extract 工具提取内容
    console.log('\n📊 步骤2: 提取页面内容');
    const extractResult = await toolSystem.toolManager.executeLocalTool(BROWSER_TOOLS.EXTRACT, {
      selectors: {
        title: 'title',
        h1: 'h1',
        h2_list: 'h2',
        h3_list: 'h3',
        paragraphs: 'p',
        main_content: 'main, .content, article, #content',
        nav_items: 'nav a, .nav a, .sidebar a'
      },
      extractType: 'text',
      multiple: true,
      waitForElements: false,
      timeout: 15000
    });

    if (extractResult.success) {
      const results = extractResult.data.data.results;
      console.log('\n🎯 页面内容提取成功:');
      
      // 页面标题
      if (results.title && results.title.elements.length > 0) {
        console.log(`   📄 页面标题: ${results.title.elements[0]}`);
      }
      
      // 主标题
      if (results.h1 && results.h1.elements.length > 0) {
        console.log(`   📌 主标题: ${results.h1.elements[0]}`);
      }
      
      // H2标题
      if (results.h2_list && results.h2_list.elements.length > 0) {
        console.log(`   📋 H2标题数量: ${results.h2_list.elements.length}`);
        console.log('   📝 H2标题列表:');
        results.h2_list.elements.slice(0, 8).forEach((h2, index) => {
          if (h2.trim()) {
            console.log(`      ${index + 1}. ${h2.trim()}`);
          }
        });
      }
      
      // H3标题
      if (results.h3_list && results.h3_list.elements.length > 0) {
        console.log(`   📝 H3标题数量: ${results.h3_list.elements.length}`);
      }
      
      // 段落内容
      if (results.paragraphs && results.paragraphs.elements.length > 0) {
        console.log(`   📄 段落数量: ${results.paragraphs.elements.length}`);
        console.log('   📖 部分段落内容:');
        results.paragraphs.elements.slice(0, 3).forEach((p, index) => {
          if (p.trim() && p.trim().length > 10) {
            console.log(`      ${index + 1}. ${p.trim().substring(0, 120)}${p.length > 120 ? '...' : ''}`);
          }
        });
      }
      
      // 导航项
      if (results.nav_items && results.nav_items.elements.length > 0) {
        console.log(`   🧭 导航项数量: ${results.nav_items.elements.length}`);
      }
      
      console.log('\n✅ 数据抓取完成！成功提取了页面的主要内容结构');
      
      // 验证我们至少提取到了一些内容
      expect(results.title?.elements?.length || 0).toBeGreaterThan(0);
      expect(results.h1?.elements?.length || results.h2_list?.elements?.length || 0).toBeGreaterThan(0);
      
    } else {
      console.error('❌ Extract工具执行失败:', extractResult.error);
      throw new Error(`数据提取失败: ${extractResult.error || '未知错误'}`);
    }

    console.log('\n🎉 测试完成！成功演示了网页数据抓取的组合执行流程');
    
  }, 60000); // 60秒超时
});
