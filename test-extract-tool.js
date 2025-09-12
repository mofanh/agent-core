#!/usr/bin/env node

/**
 * 测试 ExtractTool 独立执行
 */

import { ExtractTool } from './src/browser/tools/extract-tool.js';
import { BrowserInstance } from './src/browser/browser-instance.js';

async function testExtractTool() {
  console.log('🧪 开始测试 ExtractTool...');
  
  let browser;
  try {
    // 1. 创建浏览器实例
    console.log('1. 创建浏览器实例...');
    browser = new BrowserInstance({
      headless: true,
      devtools: false
    });
    
    await browser.initialize();
    console.log('✅ 浏览器实例创建成功');
    
    // 2. 创建ExtractTool
    console.log('2. 创建 ExtractTool...');
    const extractTool = new ExtractTool(browser);
    console.log('✅ ExtractTool 创建成功');
    
    // 3. 导航到测试页面
    console.log('3. 导航到测试页面...');
    const page = await browser.getCurrentPage();
    await page.goto('https://httpbin.org/html', { waitUntil: 'networkidle2' });
    console.log('✅ 页面加载完成');
    
    // 4. 测试基本的文本提取
    console.log('4. 测试基本的title提取...');
    const context = {
      args: {
        selectors: 'title'  // 提取title标签
      },
      page: page
    };
    
    console.log('参数:', JSON.stringify(context.args, null, 2));
    
    const result = await extractTool.doExecute(context);
    console.log('✅ 提取成功!');
    console.log('结果:', JSON.stringify(result, null, 2));
    
    // 5. 测试提取h1标签
    console.log('5. 测试提取h1标签...');
    const h1Context = {
      args: {
        selectors: 'h1'
      },
      page: page
    };
    
    const h1Result = await extractTool.doExecute(h1Context);
    console.log('✅ h1提取成功!');
    console.log('h1结果:', JSON.stringify(h1Result, null, 2));
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error.stack);
  } finally {
    if (browser) {
      console.log('6. 清理浏览器实例...');
      await browser.close();
      console.log('✅ 清理完成');
    }
  }
}

// 运行测试
testExtractTool().catch(console.error);
