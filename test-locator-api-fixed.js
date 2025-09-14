#!/usr/bin/env node

/**
 * 测试优化后的浏览器工具 (使用 Locator API)
 */

import { AgentCore } from './src/index.js';
import Logger from './src/utils/logger.js';
import express from 'express';
import http from 'http';
import path from 'path';

// 创建简单的测试函数
async function testLocatorAPI() {
  // 启动简单的HTTP服务器
  const app = express();
  app.use(express.static('.'));

  const server = http.createServer(app);
  const PORT = 8081;

  server.listen(PORT, () => {
    console.log(`🌐 连接到现有测试服务器: http://localhost:${PORT}`);
    runTests();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`🌐 使用现有服务器: http://localhost:${PORT}`);
      // 端口被占用，直接运行测试（使用你已经启动的服务器）
      setTimeout(runTests, 1000);
    } else {
      console.error('服务器启动失败:', err);
    }
  });

  process.on('SIGINT', () => {
    console.log('\n🔚 关闭服务器...');
    server.close();
    process.exit(0);
  });

  async function runTests() {
    try {
      console.log('\n🚀 开始测试优化后的浏览器工具 (Locator API)...\n');

      // 等待服务器完全启动
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 创建agent配置
      const agent = new AgentCore({
        browser: {
          enabled: true,
          headless: false, // 显示浏览器界面
          viewport: { width: 1280, height: 800 },
          security: {
            level: 'normal',
            enableAuditLog: true
          }
        }
      });

      await agent.initialize();

      console.log('📄 测试页面: http://localhost:8081/test-locator-improvements.html\n');

      // 1. 测试页面导航
      console.log('🔍 测试1: 页面导航...');
      const navigateResult = await agent.handleToolCall('browser.navigate', {
        url: 'http://localhost:8081/test-locator-improvements.html',
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      if (navigateResult.success) {
        console.log('   ✅ 页面导航成功');
        console.log(`      - URL: ${navigateResult.data?.data?.finalUrl || '未知'}`);
        console.log(`      - 标题: ${navigateResult.data?.data?.title || '未知'}`);
      } else {
        console.log('   ❌ 页面导航失败:', navigateResult.error);
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
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.log(`   ❌ ${test.desc} - 异常:`, error.message);
        }
      }

      // 4. 测试文本输入功能 (使用 Locator API)
      console.log('\n⌨️ 测试4: 文本输入功能...');
      
      const typeTests = [
        { selector: '#text-input', text: 'Hello Locator API!', desc: '文本输入框' },
        { selector: '#password-input', text: 'password123', desc: '密码输入框' },
        { selector: '#textarea-input', text: '这是多行文本\n第二行\n第三行', desc: '文本区域' }
      ];

      for (const test of typeTests) {
        try {
          console.log(`   测试: ${test.desc}`);
          const typeResult = await agent.handleToolCall('browser.type', {
            selector: test.selector,
            text: test.text,
            timeout: 5000,
            clearFirst: true
          });
          
          if (typeResult.success) {
            console.log(`   ✅ ${test.desc} - 成功`);
            console.log(`      方法: ${typeResult.data?.data?.method || '未知'}`);
            console.log(`      输入文本: ${test.text}`);
            console.log(`      最终值: ${typeResult.data?.data?.finalValue || '未知'}`);
          } else {
            console.log(`   ❌ ${test.desc} - 失败:`, typeResult.error);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.log(`   ❌ ${test.desc} - 异常:`, error.message);
        }
      }

      // 4.1. 测试下拉选择框 (使用简化方法)
      console.log('\n📋 测试4.1: 下拉选择框测试...');
      
      console.log('   ⚠️  注意: 下拉选择框需要专门的工具实现');
      console.log('   💡 原因: option元素不能直接点击，需要使用page.select()方法');
      console.log('   🔧 建议: 后续版本中添加专门的 browser.select 工具');
      
      // 暂时跳过下拉框测试，显示说明信息
      const selectTests = [
        { value: 'option1', desc: '选择选项1' },
        { value: 'option2', desc: '选择选项2' },
        { value: 'option3', desc: '选择选项3' }
      ];

      for (const test of selectTests) {
        console.log(`   ⏭️  跳过: ${test.desc} (需要专门的select工具)`);
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
        const results = extractResult.data?.data?.results || {};
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
          if (test.action === 'extract') {
            console.log('      📊 调试信息: 提取结果完整结构');
            console.log('      result.data:', JSON.stringify(result.data, null, 2));
            if (result.data?.data?.results?.target) {
              console.log(`      提取内容: ${result.data.data.results.target.elements?.[0] || '无内容'}`);
            } else {
              console.log('      提取内容: 数据结构路径不匹配');
            }
          }
        } else {
          console.log(`   ❌ ${test.desc} - 失败:`, result.error);
        }          await new Promise(resolve => setTimeout(resolve, 1000));
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
      
      // 悬停 -> 点击 -> 输入的组合
      await agent.handleToolCall('browser.hover', { selector: '#hover-area1' });
      await agent.handleToolCall('browser.click', { selector: '#test-button1' });
      await agent.handleToolCall('browser.type', { 
        selector: '#text-input', 
        text: 'Complex interaction test' 
      });
      
      console.log('   ✅ 复杂交互链测试完成');

      console.log('\n🎉 所有测试完成!');
      
      console.log('\n💡 观察要点:');
      console.log('   1. 优先使用现代化的 Locator API');
      console.log('   2. 如果 Locator API 失败，自动回退到传统方法');
      console.log('   3. 更好的元素等待和可见性检查');
      console.log('   4. 支持 XPath 和 CSS 选择器');
      console.log('   5. 新增悬停功能');

      console.log('\n⏰ 请观察浏览器中的测试结果，10秒后自动关闭...');
      setTimeout(() => {
        console.log('\n🔚 测试完成，保持服务器运行供浏览器观察...');
        // 不关闭服务器，让用户在浏览器中观察结果
        process.exit(0);
      }, 10000);

    } catch (error) {
      console.error('测试失败:', error);
      server.close();
      process.exit(1);
    }
  }
}

export default testLocatorAPI;

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  testLocatorAPI().catch(console.error);
}
