#!/usr/bin/env node

/**
 * 测试优化后的浏览器工具 (使用 Locator API)
 */

import { AgentCore } from './src/index.js';
import Logger from './src/utils/logger.js'        if (typeResult.success) {
          console.log(`   ✅ ${test.desc} - 成功`);
          console.log(`      方法: ${typeResult.data?.data?.method || '未知'}`);
          console.log(`      输入文本: ${test.text}`);
          console.log(`      最终值: ${typeResult.data?.data?.finalValue || '未知'}`);
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, typeResult.error);
        } logger = new Logger('BrowserLocatorTest');

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
          console.log(`      方法: ${hoverResult.data?.data?.method || '未知'}`);
          if (hoverResult.data?.data?.coordinates) {
            console.log(`      坐标: (${hoverResult.data.data.coordinates.x}, ${hoverResult.data.data.coordinates.y})`);
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

    // 4.1. 测试下拉选择框
    console.log('\n📋 测试4.1: 下拉选择框测试...');
    
    const selectTests = [
      { selector: '#select-input', value: 'option1', desc: '选择选项1' },
      { selector: '#select-input', value: 'option2', desc: '选择选项2' },
      { selector: '#select-input', value: 'option3', desc: '选择选项3' }
    ];

    for (const test of selectTests) {
      try {
        console.log(`   测试: ${test.desc}`);
        
        // 使用点击方式打开下拉框
        const clickResult = await agent.handleToolCall('browser.click', {
          selector: test.selector,
          timeout: 5000
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 选择特定选项
        const selectResult = await agent.handleToolCall('browser.click', {
          selector: `#select-input option[value="${test.value}"]`,
          timeout: 5000
        });
        
        if (selectResult.success) {
          console.log(`   ✅ ${test.desc} - 成功`);
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, selectResult.error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
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

    // 5.1. 测试 XPath 选择器
    console.log('\n🎯 测试5.1: XPath 选择器测试...');
    
    const xpathTests = [
      { 
        selector: '//button[contains(text(), "XPath测试按钮")]', 
        desc: 'XPath按钮点击（文本匹配）' 
      },
      { 
        selector: '//span[@class="xpath-text"]', 
        desc: 'XPath文本提取（属性匹配）', 
        action: 'extract' 
      },
      { 
        selector: '//div[@data-testid="xpath-test"]//button', 
        desc: 'XPath嵌套选择器点击' 
      },
      { 
        selector: '//input[@type="text"]', 
        desc: 'XPath输入框选择',
        action: 'type',
        text: 'XPath输入测试'
      }
    ];

    for (const test of xpathTests) {
      try {
        console.log(`   测试: ${test.desc}`);
        
        let result;
        if (test.action === 'extract') {
          result = await agent.handleToolCall('browser.extract', {
            selectors: { target: test.selector },
            extractType: 'text',
            selectorType: 'xpath'
          });
        } else if (test.action === 'type') {
          result = await agent.handleToolCall('browser.type', {
            selector: test.selector,
            text: test.text,
            selectorType: 'xpath',
            timeout: 5000
          });
        } else {
          result = await agent.handleToolCall('browser.click', {
            selector: test.selector,
            selectorType: 'xpath',
            timeout: 5000
          });
        }
        
        if (result.success) {
          console.log(`   ✅ ${test.desc} - 成功`);
          if (test.action === 'extract' && result.data?.results?.target) {
            console.log(`      提取内容: ${result.data.results.target.elements?.[0] || '无内容'}`);
          }
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, result.error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`   ❌ ${test.desc} - 异常:`, error.message);
      }
    }

    // 5.2. 测试链接功能
    console.log('\n🔗 测试5.2: 链接测试...');
    
    const linkTests = [
      { 
        selector: 'a[href="#"]', 
        desc: '第一个测试链接点击' 
      },
      { 
        selector: 'a[href="javascript:void(0)"]', 
        desc: '第二个测试链接点击' 
      },
      { 
        selector: '//a[contains(text(), "测试链接")]', 
        desc: 'XPath链接点击（文本匹配）',
        selectorType: 'xpath' 
      },
      { 
        selector: '//a[contains(text(), "另一个链接")]', 
        desc: 'XPath另一个链接点击',
        selectorType: 'xpath' 
      }
    ];

    for (const test of linkTests) {
      try {
        console.log(`   测试: ${test.desc}`);
        const clickResult = await agent.handleToolCall('browser.click', {
          selector: test.selector,
          selectorType: test.selectorType || 'auto',
          timeout: 5000
        });
        
        if (clickResult.success) {
          console.log(`   ✅ ${test.desc} - 成功`);
          console.log(`      方法: ${clickResult.data?.data?.method || '未知'}`);
          console.log(`      选择器: ${clickResult.data?.data?.selector || '未知'}`);
          console.log(`      执行时间: ${clickResult.data?.executionTime || 0}ms`);
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, clickResult.error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`   ❌ ${test.desc} - 异常:`, error.message);
      }
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
