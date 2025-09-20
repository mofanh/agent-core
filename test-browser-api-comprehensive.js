#!/usr/bin/env node

/**
 * 全面浏览器操作 API 测试
 * 使用统一 LLM Agent 架构测试所有浏览器工具功能
 */

import { createUnifiedLLMAgent } from './src/llm/index.js';
import Logger from './src/utils/logger.js';
import express from 'express';
import http from 'http';
import { promises as fs } from 'fs';

const logger = new Logger('info');

async function comprehensiveBrowserAPITest() {
  logger.info('🚀 启动全面浏览器操作 API 测试...\n');

  // 启动测试服务器
  const app = express();
  app.use(express.static('.'));
  const server = http.createServer(app);
  const PORT = 8081;

  server.listen(PORT, () => {
    logger.info(`🌐 测试服务器启动: http://localhost:${PORT}`);
    runAllTests();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.info('🌐 使用现有服务器');
      setTimeout(runAllTests, 1000);
    } else {
      logger.error('服务器启动失败:', err);
    }
  });

  let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };

  async function runAllTests() {
    try {
      // 创建统一 Agent
      const agent = createUnifiedLLMAgent({
        browser: {
          enabled: true,
          headless: false,
          viewport: { width: 1280, height: 800 },
          security: {
            securityLevel: 'permissive',
            enableAuditLog: true
          }
        }
      });

      await agent.initialize();

      logger.info(`📝 已注册浏览器工具: ${agent.toolRegistry.size} 个`);
      for (const [name, info] of agent.toolRegistry) {
        logger.info(`   - ${name} (${info.type})`);
      }
      logger.info('');

      const testSuite = [
        // 1. 导航测试
        {
          name: '页面导航测试',
          category: 'navigation',
          tests: [
            {
              name: '基础页面导航',
              tool: 'browser.navigate',
              args: {
                url: 'http://localhost:8081/test-locator-improvements.html',
                waitUntil: 'networkidle2'
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.finalUrl?.includes('test-locator-improvements.html') &&
                       result.data?.data?.data?.title?.includes('浏览器工具测试页面');
              }
            },
            {
              name: '等待特定元素导航',
              tool: 'browser.navigate',
              args: {
                url: 'http://localhost:8081/test-locator-improvements.html',
                waitUntil: 'networkidle2',
                timeout: 15000
              },
              validate: (result) => result.success
            }
          ]
        },

        // 2. 内容提取测试
        {
          name: '内容提取测试',
          category: 'extraction',
          tests: [
            {
              name: '提取页面标题',
              tool: 'browser.extract',
              args: {
                selectors: 'h1',
                extractType: 'text'
              },
              validate: (result) => {
                if (!result.success || !result.data?.data?.data?.results) {
                  return false;
                }
                const results = result.data.data.data.results;
                const mainResult = results.main;
                return mainResult && mainResult.success && mainResult.elements && 
                       mainResult.elements.length > 0 && mainResult.elements[0].text && 
                       mainResult.elements[0].text.includes('浏览器工具测试页面');
              }
            },
            {
              name: '提取单个按钮文本',
              tool: 'browser.extract',
              args: {
                selectors: '#test-button1',
                extractType: 'text'
              },
              validate: (result) => {
                if (!result.success || !result.data?.data?.data?.results) {
                  return false;
                }
                const results = result.data.data.data.results;
                const mainResult = results.main;
                return mainResult && mainResult.success && mainResult.elements && 
                       mainResult.elements.length > 0 && mainResult.elements[0].text && 
                       mainResult.elements[0].text.includes('测试按钮 1');
              }
            },
            {
              name: '提取多个按钮文本',
              tool: 'browser.extract',
              args: {
                selectors: 'button:not([disabled])',
                extractType: 'text',
                multiple: true
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.results &&
                       (typeof result.data.data.data.results === 'object' &&
                        Object.keys(result.data.data.data.results).length > 0);
              }
            },
            {
              name: '提取元素属性',
              tool: 'browser.extract',
              args: {
                selectors: '#test-button1',
                extractType: 'attributes',
                attributes: ['id']
              },
              validate: (result) => {
                if (!result.success || !result.data?.data?.data?.results) {
                  return false;
                }
                const results = result.data.data.data.results;
                const mainResult = results.main;
                return mainResult && mainResult.success && mainResult.elements &&
                       mainResult.elements.length > 0 && mainResult.elements[0].attributes &&
                       mainResult.elements[0].attributes.id === 'test-button1';
              }
            },
            {
              name: 'XPath 内容提取',
              tool: 'browser.extract',
              args: {
                selectors: '//span[@class="xpath-text"]',
                selectorType: 'xpath',
                extractType: 'text'
              },
              validate: (result) => {
                if (!result.success || !result.data?.data?.data?.results) {
                  return false;
                }
                const results = result.data.data.data.results;
                const mainResult = results.main;
                return mainResult && mainResult.success && mainResult.elements && 
                       mainResult.elements.length > 0 && mainResult.elements[0].text && 
                       mainResult.elements[0].text.includes('XPath文本');
              }
            }
          ]
        },

        // 3. 点击操作测试
        {
          name: '点击操作测试',
          category: 'interaction',
          tests: [
            {
              name: 'ID选择器点击',
              tool: 'browser.click',
              args: {
                selector: '#test-button1'
              },
              validate: (result) => result.success
            },
            {
              name: '类选择器点击',
              tool: 'browser.click',
              args: {
                selector: '.special-btn'
              },
              validate: (result) => result.success
            },
            {
              name: 'XPath选择器点击',
              tool: 'browser.click',
              args: {
                selector: '//button[contains(text(), "测试按钮 2")]',
                selectorType: 'xpath'
              },
              validate: (result) => result.success
            },
            {
              name: '链接点击',
              tool: 'browser.click',
              args: {
                selector: 'a[href="#"]'
              },
              validate: (result) => result.success
            },
            {
              name: '数据属性选择器点击',
              tool: 'browser.click',
              args: {
                selector: '[data-testid="xpath-test"] button'
              },
              validate: (result) => result.success
            }
          ]
        },

        // 4. 悬停操作测试
        {
          name: '悬停操作测试',
          category: 'interaction',
          tests: [
            {
              name: 'ID选择器悬停',
              tool: 'browser.hover',
              args: {
                selector: '#hover-area1'
              },
              validate: (result) => result.success
            },
            {
              name: '类选择器悬停',
              tool: 'browser.hover',
              args: {
                selector: '.hover-area',
                index: 0
              },
              validate: (result) => result.success
            },
            {
              name: '第二个悬停区域',
              tool: 'browser.hover',
              args: {
                selector: '#hover-area2'
              },
              validate: (result) => result.success
            }
          ]
        },

        // 5. 文本输入测试
        {
          name: '文本输入测试',
          category: 'input',
          tests: [
            {
              name: '文本输入框输入',
              tool: 'browser.type',
              args: {
                selector: '#text-input',
                text: 'Hello 统一架构！',
                clear: true
              },
              validate: (result) => result.success
            },
            {
              name: '密码输入框输入',
              tool: 'browser.type',
              args: {
                selector: '#password-input',
                text: 'password123',
                clear: true
              },
              validate: (result) => result.success
            },
            {
              name: '文本区域输入',
              tool: 'browser.type',
              args: {
                selector: '#textarea-input',
                text: '多行文本测试\\n第二行\\n第三行',
                clear: true
              },
              validate: (result) => result.success
            },
            {
              name: '追加文本输入',
              tool: 'browser.type',
              args: {
                selector: '#text-input',
                text: ' 追加内容',
                clear: false
              },
              validate: (result) => result.success
            }
          ]
        },

        // 6. 截图测试
        {
          name: '截图测试',
          category: 'capture',
          tests: [
            {
              name: '全页面截图',
              tool: 'browser.screenshot',
              args: {
                fullPage: true,
                format: 'png'
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.dataUrl &&
                       typeof result.data.data.data.dataUrl === 'string' &&
                       result.data.data.data.dataUrl.startsWith('data:image/');
              }
            },
            {
              name: '视口截图',
              tool: 'browser.screenshot',
              args: {
                fullPage: false,
                format: 'jpeg',
                quality: 80
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.dataUrl &&
                       typeof result.data.data.data.dataUrl === 'string' &&
                       result.data.data.data.dataUrl.startsWith('data:image/');
              }
            },
            {
              name: '元素截图',
              tool: 'browser.screenshot',
              args: {
                selector: '.test-section:first-child',
                format: 'png'
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.dataUrl &&
                       typeof result.data.data.data.dataUrl === 'string' &&
                       result.data.data.data.dataUrl.startsWith('data:image/');
              }
            }
          ]
        },

        // 7. JavaScript 执行测试
        {
          name: 'JavaScript执行测试',
          category: 'execution',
          tests: [
            {
              name: '简单表达式执行',
              tool: 'browser.evaluate',
              args: {
                script: 'document.title;',
                allowDangerousAPIs: true
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.result &&
                       result.data.data.data.result.includes('浏览器工具测试页面');
              }
            },
            {
              name: 'DOM操作执行',
              tool: 'browser.evaluate',
              args: {
                script: `var button = document.querySelector('#test-button1');
                         var result = {
                           exists: !!button,
                           text: button ? button.textContent : null,
                           id: button ? button.id : null
                         };
                         result;`,
                allowDangerousAPIs: true
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.result?.exists === true &&
                       result.data?.data?.data?.result?.id === 'test-button1';
              }
            },
            {
              name: '页面信息获取',
              tool: 'browser.evaluate',
              args: {
                script: `var pageInfo = {
                           url: window.location.href,
                           title: document.title,
                           buttonsCount: document.querySelectorAll('button').length,
                           linksCount: document.querySelectorAll('a').length
                         };
                         pageInfo;`,
                allowDangerousAPIs: true
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.result?.buttonsCount > 0;
              }
            }
          ]
        },

        // 8. 高级选择器测试
        {
          name: '高级选择器测试',
          category: 'selectors',
          tests: [
            {
              name: 'CSS组合选择器',
              tool: 'browser.click',
              args: {
                selector: '.test-section:first-child button:first-child'
              },
              validate: (result) => result.success
            },
            {
              name: '属性选择器',
              tool: 'browser.extract',
              args: {
                selectors: 'input[type="text"]',
                extractType: 'attributes',
                attributes: ['placeholder']
              },
              validate: (result) => {
                if (!result.success || !result.data?.data?.data?.results) {
                  return false;
                }
                const results = result.data.data.data.results;
                const mainResult = results.main;
                return mainResult && mainResult.success && mainResult.elements &&
                       mainResult.elements.length > 0 && mainResult.elements[0].attributes &&
                       mainResult.elements[0].attributes.placeholder && 
                       mainResult.elements[0].attributes.placeholder.includes('请输入');
              }
            },
            {
              name: '伪类选择器',
              tool: 'browser.extract',
              args: {
                selectors: 'button:not([disabled])',
                extractType: 'text',
                multiple: true
              },
              validate: (result) => {
                return result.success && 
                       result.data?.data?.data?.results &&
                       (typeof result.data.data.data.results === 'object' &&
                        Object.keys(result.data.data.data.results).length > 0);
              }
            },
            {
              name: '复杂XPath选择器',
              tool: 'browser.extract',
              args: {
                selectors: '//div[@class="test-section"][2]//div[@class="hover-area"]',
                selectorType: 'xpath',
                extractType: 'text',
                multiple: true
              },
              validate: (result) => {
                return result.success &&
                       result.data?.data?.data?.results &&
                       (typeof result.data.data.data.results === 'object');
              }
            }
          ]
        }
      ];

      // 执行所有测试
      for (const suite of testSuite) {
        logger.info(`\n${'='.repeat(60)}`);
        logger.info(`🧪 ${suite.name} (${suite.category})`);
        logger.info(`${'='.repeat(60)}`);

        for (const test of suite.tests) {
          testResults.total++;

          try {
            logger.info(`\n🔍 执行: ${test.name}`);
            logger.info(`   工具: ${test.tool}`);
            logger.info(`   参数: ${JSON.stringify(test.args, null, 2).replace(/\n/g, '\\n')}`);

            const startTime = Date.now();
            
            const result = await agent.executeUnifiedToolCall({
              id: `test_${Date.now()}`,
              name: test.tool,
              args: test.args
            });

            const duration = Date.now() - startTime;

            if (test.validate(result)) {
              testResults.passed++;
              logger.info(`   ✅ 通过 (${duration}ms)`);
              
              testResults.details.push({
                suite: suite.name,
                test: test.name,
                status: 'PASSED',
                duration,
                tool: test.tool,
                args: test.args
              });
            } else {
              testResults.failed++;
              logger.info(`   ❌ 失败 (${duration}ms) - 验证不通过`);
              logger.info(`   📋 结果: ${JSON.stringify(result, null, 2).slice(0, 200)}...`);
              
              testResults.details.push({
                suite: suite.name,
                test: test.name,
                status: 'FAILED',
                duration,
                tool: test.tool,
                args: test.args,
                error: 'Validation failed',
                result: result
              });
            }

            // 测试间隔
            await new Promise(resolve => setTimeout(resolve, 500));

          } catch (error) {
            testResults.failed++;
            logger.error(`   ❌ 异常 - ${error.message}`);
            
            testResults.details.push({
              suite: suite.name,
              test: test.name,
              status: 'ERROR',
              tool: test.tool,
              args: test.args,
              error: error.message
            });
          }
        }
      }

      // 显示最终结果
      await displayFinalResults();
      await agent.cleanup();
      server.close();

    } catch (error) {
      logger.error('❌ 测试执行失败:', error);
      server.close();
      process.exit(1);
    }
  }

  async function displayFinalResults() {
    logger.info('\n' + '🎉'.repeat(20));
    logger.info('🏁 全面浏览器操作 API 测试完成');
    logger.info('🎉'.repeat(20));

    logger.info(`\n📊 测试结果汇总:`);
    logger.info(`   总计: ${testResults.total} 个测试`);
    logger.info(`   通过: ${testResults.passed} 个 ✅`);
    logger.info(`   失败: ${testResults.failed} 个 ❌`);
    logger.info(`   成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

    // 按分类统计
    const categoryStats = {};
    testResults.details.forEach(detail => {
      if (!categoryStats[detail.suite]) {
        categoryStats[detail.suite] = { total: 0, passed: 0, failed: 0 };
      }
      categoryStats[detail.suite].total++;
      if (detail.status === 'PASSED') {
        categoryStats[detail.suite].passed++;
      } else {
        categoryStats[detail.suite].failed++;
      }
    });

    logger.info(`\n📋 分类统计:`);
    Object.entries(categoryStats).forEach(([category, stats]) => {
      const rate = ((stats.passed / stats.total) * 100).toFixed(1);
      logger.info(`   ${category}: ${stats.passed}/${stats.total} (${rate}%) ${rate === '100.0' ? '✅' : '⚠️'}`);
    });

    // 显示失败的测试
    const failedTests = testResults.details.filter(d => d.status !== 'PASSED');
    if (failedTests.length > 0) {
      logger.info(`\n❌ 失败的测试:`);
      failedTests.forEach(test => {
        logger.info(`   - ${test.suite} > ${test.test}`);
        logger.info(`     工具: ${test.tool}`);
        logger.info(`     错误: ${test.error || 'Validation failed'}`);
      });
    }

    // 生成测试报告
    await generateTestReport();
  }

  async function generateTestReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: testResults.total,
        passed: testResults.passed,
        failed: testResults.failed,
        successRate: ((testResults.passed / testResults.total) * 100).toFixed(1) + '%'
      },
      details: testResults.details
    };

    try {
      await fs.writeFile('browser-api-test-report.json', JSON.stringify(report, null, 2));
      logger.info(`\n📄 测试报告已生成: browser-api-test-report.json`);
    } catch (error) {
      logger.warn('⚠️ 无法生成测试报告:', error.message);
    }
  }

  // 处理退出信号
  process.on('SIGINT', () => {
    logger.info('\n🔚 退出测试...');
    server.close();
    process.exit(0);
  });
}

// 启动测试
if (import.meta.url === `file://${process.argv[1]}`) {
  comprehensiveBrowserAPITest();
}
