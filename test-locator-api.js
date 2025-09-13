#!/usr/bin/env node

/**
 * 测试优化后的浏览器工具 (使用 Locator API)
 */

import { AgentCore } from './src/index.js';
import Logger from './src/utils/logger.js';

const logger = new Logger('BrowserLocatorTest');

async function testBrowserToolsLocatorAPI() {
  console.log('\n🚀 开始测试优化后的浏览器工具 (Locator API)...\n');

  try {
    // 创建 AgentCore 实例并启用浏览器功能
    const agent = new AgentCore({
      provider: 'mock', // 使用 mock LLM，主要测试浏览器功能
      browser: {
        enabled: true,
        headless: false, // 显示浏览器方便观察
        viewport: { width: 1280, height: 720 }
      }
    });

    await agent.initialize();

    // 使用HTTP服务器提供测试页面
    const testPageUrl = 'http://localhost:8081/test-locator-improvements.html';
    console.log(`📄 测试页面: ${testPageUrl}\n`);

    // 1. 测试页面导航
    console.log('🔍 测试1: 页面导航...');
    const navResult = await agent.handleToolCall('browser.navigate', {
      url: testPageUrl,
      waitForSelector: '#test-button1',
      timeout: 10000
    });
    
    if (navResult.success) {
      console.log('✅ 页面导航成功');
      const data = navResult.data;
      console.log(`   - URL: ${data?.finalUrl || data?.url || '未知'}`);
      console.log(`   - 标题: ${data?.pageInfo?.title || data?.title || '未知'}`);
    } else {
      console.log('❌ 页面导航失败:', navResult.error);
      return;
    }

    // 2. 测试点击功能 (使用 Locator API)
    console.log('\n🖱️ 测试2: 点击功能...');
    
    const clickTests = [
      { selector: '#test-button1', desc: 'ID选择器点击' },
      { selector: 'button.special-btn', desc: '类选择器点击' },
      { selector: '//button[contains(text(), "测试按钮 2")]', desc: 'XPath选择器点击', selectorType: 'xpath' }
    ];

    for (const test of clickTests) {
      try {
        console.log(`   测试: ${test.desc}`);
        const clickResult = await agent.handleToolCall('browser.click', {
          selector: test.selector,
          selectorType: test.selectorType || 'auto',
          timeout: 5000
        });
        
        if (clickResult.success) {
          console.log(`   ✅ ${test.desc} - 成功`);
          console.log(`      方法: ${clickResult.data?.method || '未知'}`);
          if (clickResult.data?.coordinates) {
            console.log(`      坐标: (${clickResult.data.coordinates.x}, ${clickResult.data.coordinates.y})`);
          }
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, clickResult.error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
      } catch (error) {
        console.log(`   ❌ ${test.desc} - 异常:`, error.message);
      }
    }

    // 3. 测试悬停功能 (新功能)
    console.log('\n🎯 测试3: 悬停功能...');
    
    const hoverTests = [
      { selector: '#hover-area1', desc: '悬停区域1' },
      { selector: '#hover-area2', desc: '悬停区域2' },
      { selector: '.hover-area', desc: '类选择器悬停', index: 0 }
    ];

    for (const test of hoverTests) {
      try {
        console.log(`   测试: ${test.desc}`);
        const hoverResult = await agent.handleToolCall('browser.hover', {
          selector: test.selector,
          index: test.index || 0,
          timeout: 5000
        });
        
        if (hoverResult.success) {
          console.log(`   ✅ ${test.desc} - 成功`);
          console.log(`      方法: ${hoverResult.data.method}`);
          if (hoverResult.data.coordinates) {
            console.log(`      坐标: (${hoverResult.data.coordinates.x}, ${hoverResult.data.coordinates.y})`);
          }
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, hoverResult.error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
      } catch (error) {
        console.log(`   ❌ ${test.desc} - 异常:`, error.message);
      }
    }

    // 4. 测试文本输入功能 (使用 Locator API)
    console.log('\n⌨️ 测试4: 文本输入功能...');
    
    const typeTests = [
      { 
        selector: '#text-input', 
        text: 'Hello Locator API!', 
        desc: '文本输入框' 
      },
      { 
        selector: '#password-input', 
        text: 'password123', 
        desc: '密码输入框' 
      },
      { 
        selector: '#textarea-input', 
        text: '这是多行文本\\n第二行\\n第三行', 
        desc: '文本区域' 
      }
    ];

    for (const test of typeTests) {
      try {
        console.log(`   测试: ${test.desc}`);
        const typeResult = await agent.handleToolCall('browser.type', {
          selector: test.selector,
          text: test.text,
          clearBefore: true,
          timeout: 5000
        });
        
        if (typeResult.success) {
          console.log(`   ✅ ${test.desc} - 成功`);
          console.log(`      方法: ${typeResult.data?.method || '未知'}`);
          console.log(`      输入文本: ${typeResult.data?.inputText || test.text}`);
          console.log(`      最终值: ${typeResult.data?.finalValue || '未知'}`);
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, typeResult.error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
      } catch (error) {
        console.log(`   ❌ ${test.desc} - 异常:`, error.message);
      }
    }

    // 5. 测试内容提取
    console.log('\n📊 测试5: 内容提取...');
    const extractResult = await agent.handleToolCall('browser.extract', {
      selectors: {
        title: 'h1',
        buttons: 'button:not([disabled])',
        inputs: 'input',
        result: '#result-text'
      },
      extractType: 'text',
      multiple: true
    });
    
    if (extractResult.success) {
      console.log('   ✅ 内容提取成功');
      const results = extractResult.data?.results || {};
      console.log(`      标题: ${results.title?.elements?.[0] || '未找到'}`);
      console.log(`      按钮数量: ${results.buttons?.elements?.length || 0}`);
      console.log(`      输入框数量: ${results.inputs?.elements?.length || 0}`);
      console.log(`      结果文本: ${results.result?.elements?.[0] || '未找到'}`);
    } else {
      console.log('   ❌ 内容提取失败:', extractResult.error);
    }

    // 6. 测试复杂交互链
    console.log('\n🔗 测试6: 复杂交互链...');
    try {
      // 悬停 -> 点击 -> 输入
      await agent.handleToolCall('browser.hover', {
        selector: '#hover-area1'
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await agent.handleToolCall('browser.click', {
        selector: '#test-button1'
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await agent.handleToolCall('browser.type', {
        selector: '#text-input',
        text: '复杂交互测试完成!',
        clearBefore: true
      });
      
      console.log('   ✅ 复杂交互链测试完成');
    } catch (error) {
      console.log('   ❌ 复杂交互链测试失败:', error.message);
    }

    console.log('\n🎉 所有测试完成!');
    console.log('\n💡 观察要点:');
    console.log('   1. 优先使用现代化的 Locator API');
    console.log('   2. 如果 Locator API 失败，自动回退到传统方法');
    console.log('   3. 更好的元素等待和可见性检查');
    console.log('   4. 支持 XPath 和 CSS 选择器');
    console.log('   5. 新增悬停功能');

    // 等待用户观察结果
    console.log('\n⏰ 请观察浏览器中的测试结果，10秒后自动关闭...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 关闭浏览器实例
    if (agent.browserInstance) {
      await agent.browserInstance.close();
    }

  } catch (error) {
    logger.error('测试过程中出现错误:', error);
    
    // 清理资源
    try {
      if (agent && agent.browserInstance) {
        await agent.browserInstance.close();
      }
    } catch (cleanupError) {
      logger.error('清理资源时出错:', cleanupError);
    }
  }
}

// 运行测试
testBrowserToolsLocatorAPI().catch(console.error);
