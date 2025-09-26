#!/usr/bin/env node

/**
 * 真实网页浏览器工具测试
 * 测试腾讯云开发者文章页面：https://course.rs/basic/collections/intro.html
 */

import { createLLMAgent } from './src/llm/index.js';
import Logger from './src/utils/logger.js';

const logger = new Logger('info');
const TEST_URL = 'https://course.rs/basic/collections/intro.html';

async function realWebsiteTest() {
  logger.info('🚀 启动真实网页浏览器工具测试...\n');

  let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };

  try {
    // 创建统一 Agent
    const agent = createLLMAgent({
      browser: {
        enabled: true,
        headless: true,
        security: {
          level: 'permissive',
          allowNavigation: true,
          allowExtraction: true,
          allowInput: true,
          allowScreenshots: true
        }
      }
    });

    await agent.initialize();

    logger.info(`📝 已注册浏览器工具: ${agent.toolRegistry.size} 个`);
    for (const [name, info] of agent.toolRegistry) {
      if (info.category === 'browser') {
        logger.info(`   - ${name} (${info.category})`);
      }
    }
    logger.info('\n');

    // 测试用例定义
    const testSuites = [
      // 1. 页面导航测试
      {
        name: '页面导航测试',
        category: 'navigation',
        tests: [
          {
            name: '基础页面导航',
            tool: 'browser.navigate',
            args: {
              url: TEST_URL,
              waitUntil: 'networkidle2',
              timeout: 30000
            },
            validate: (result) => {
              return result.success && result.data?.data?.data?.statusCode === 200 &&
                     result.data?.data?.data?.title && 
                     result.data?.data?.data?.finalUrl?.includes('cloud.tencent.com');
            }
          }
        ]
      },

      // 2. 内容提取测试
      {
        name: '内容提取测试',
        category: 'extraction',
        tests: [
          {
            name: '提取文章标题',
            tool: 'browser.extract',
            args: {
              selectors: 'h1, .title, [class*="title"]',
              extractType: 'text'
            },
            validate: (result) => {
              if (!result.success || !result.data?.data?.data?.results) {
                return false;
              }
              const results = result.data.data.data.results;
              const mainResult = results.main;
              return mainResult && mainResult.success && mainResult.elements && 
                     mainResult.elements.length > 0 && mainResult.elements[0].text;
            }
          },
          {
            name: '提取文章内容段落',
            tool: 'browser.extract',
            args: {
              selectors: 'p, .content p, [class*="content"] p',
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
            name: '提取链接属性',
            tool: 'browser.extract',
            args: {
              selectors: 'a[href]',
              extractType: 'attributes',
              attributes: ['href', 'title'],
              multiple: true
            },
            validate: (result) => {
              if (!result.success || !result.data?.data?.data?.results) {
                return false;
              }
              const results = result.data.data.data.results;
              const mainResult = results.main;
              return mainResult && mainResult.success && mainResult.elements &&
                     mainResult.elements.length > 0 && mainResult.elements[0].attributes;
            }
          }
        ]
      },

      // 3. JavaScript执行测试
      {
        name: 'JavaScript执行测试',
        category: 'execution',
        tests: [
          {
            name: '获取页面基本信息',
            tool: 'browser.evaluate',
            args: {
              script: `
                var info = {
                  title: document.title,
                  url: window.location.href,
                  linksCount: document.querySelectorAll('a').length,
                  imagesCount: document.querySelectorAll('img').length,
                  hasH1: !!document.querySelector('h1')
                };
                info;
              `,
              allowDangerousAPIs: true
            },
            validate: (result) => {
              return result.success && 
                     result.data?.data?.data?.result?.title &&
                     result.data?.data?.data?.result?.url &&
                     typeof result.data?.data?.data?.result?.linksCount === 'number';
            }
          },
          {
            name: '获取文章元信息',
            tool: 'browser.evaluate',
            args: {
              script: `
                var meta = {
                  author: document.querySelector('[class*="author"], .author, meta[name="author"]')?.textContent || 
                         document.querySelector('[class*="author"], .author, meta[name="author"]')?.content || '',
                  publishDate: document.querySelector('[class*="date"], .date, time')?.textContent || '',
                  readTime: document.querySelector('[class*="read"], [class*="time"]')?.textContent || '',
                  tags: Array.from(document.querySelectorAll('[class*="tag"], .tag')).map(el => el.textContent).filter(t => t.trim())
                };
                meta;
              `,
              allowDangerousAPIs: true
            },
            validate: (result) => {
              return result.success && 
                     result.data?.data?.data?.result && 
                     typeof result.data?.data?.data?.result === 'object';
            }
          }
        ]
      },

      // 4. 截图测试
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
          }
        ]
      },

      // 5. 高级选择器测试
      {
        name: '高级选择器测试',
        category: 'selectors',
        tests: [
          {
            name: 'CSS复合选择器',
            tool: 'browser.extract',
            args: {
              selectors: 'div[class*="content"] > p:first-child, .article-content p:first-child, main p:first-child',
              extractType: 'text'
            },
            validate: (result) => {
              return result.success && result.data?.data?.data?.results;
            }
          },
          {
            name: '属性选择器',
            tool: 'browser.extract',
            args: {
              selectors: 'meta[name="description"], meta[property="og:description"]',
              extractType: 'attributes',
              attributes: ['content']
            },
            validate: (result) => {
              return result.success && result.data?.data?.data?.results;
            }
          }
        ]
      }
    ];

    // 执行所有测试
    for (const suite of testSuites) {
      logger.info('============================================================');
      logger.info(`🧪 ${suite.name} (${suite.category})`);
      logger.info('============================================================\n');

      for (const test of suite.tests) {
        logger.info(`🔍 执行: ${test.name}`);
        logger.info(`   工具: ${test.tool}`);
        logger.info(`   参数: ${JSON.stringify(test.args, null, 2).replace(/\n/g, '\\n')}`);

        const startTime = Date.now();
        testResults.total++;

        try {
          const result = await agent.executeUnifiedToolCall({
            id: `test_${Date.now()}`,
            name: test.tool,
            args: test.args
          });

          const duration = Date.now() - startTime;

          if (test.validate(result)) {
            logger.info(`   ✅ 通过 (${duration}ms)`);
            
            // 显示提取结果的具体内容
            if (test.tool === 'browser.extract' && result.data?.data?.data?.results) {
                console.log('   📋 结果详情:', JSON.stringify(result.data.data.data.results, null, 50).substring(0, 5000) + '...');
              const results = result.data.data.data.results;
              const mainResult = results.main;
              
              if (mainResult && mainResult.elements) {
                logger.info(`   📋 提取到 ${mainResult.elements.length} 个元素:`);
                mainResult.elements.slice(0, 3).forEach((element, index) => {
                  if (element.text) {
                    const text = element.text.trim().substring(0, 100);
                    logger.info(`     ${index + 1}. ${text}${element.text.length > 100 ? '...' : ''}`);
                  }
                  if (element.attributes) {
                    Object.entries(element.attributes).forEach(([key, value]) => {
                      if (value && typeof value === 'string' && value.trim()) {
                        const attrValue = value.trim().substring(0, 80);
                        logger.info(`     ${index + 1}. ${key}: ${attrValue}${value.length > 80 ? '...' : ''}`);
                      }
                    });
                  }
                });
                if (mainResult.elements.length > 3) {
                  logger.info(`     ... 还有 ${mainResult.elements.length - 3} 个元素`);
                }
              }
            }
            
            // 显示JavaScript执行结果
            if (test.tool === 'browser.evaluate' && result.data?.data?.data?.result) {
              const jsResult = result.data.data.data.result;
              logger.info(`   📋 JavaScript执行结果:`);
              if (typeof jsResult === 'object') {
                Object.entries(jsResult).forEach(([key, value]) => {
                  if (Array.isArray(value)) {
                    logger.info(`     ${key}: [${value.length} 个项目] ${value.slice(0, 2).join(', ')}${value.length > 2 ? '...' : ''}`);
                  } else if (typeof value === 'string' && value.length > 50) {
                    logger.info(`     ${key}: ${value.substring(0, 50)}...`);
                  } else {
                    logger.info(`     ${key}: ${value}`);
                  }
                });
              } else {
                logger.info(`     结果: ${jsResult}`);
              }
            }
            
            testResults.passed++;
            testResults.details.push({
              suite: suite.name,
              test: test.name,
              tool: test.tool,
              status: 'passed',
              duration,
              result: 'Success'
            });
          } else {
            logger.info(`   ❌ 失败 (${duration}ms) - 验证不通过`);
            logger.info(`   📋 结果: ${JSON.stringify(result, null, 2).substring(0, 500)}...`);
            testResults.failed++;
            testResults.details.push({
              suite: suite.name,
              test: test.name,
              tool: test.tool,
              status: 'failed',
              duration,
              error: 'Validation failed'
            });
          }
        } catch (error) {
          const duration = Date.now() - startTime;
          logger.error(`   ❌ 异常 - ${error.message}`);
          testResults.failed++;
          testResults.details.push({
            suite: suite.name,
            test: test.name,
            tool: test.tool,
            status: 'error',
            duration,
            error: error.message
          });
        }

        logger.info('');
      }
    }

    // 输出测试结果汇总
    logger.info('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
    logger.info('🏁 真实网页浏览器工具测试完成');
    logger.info('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n');

    logger.info('📊 测试结果汇总:');
    logger.info(`   总计: ${testResults.total} 个测试`);
    logger.info(`   通过: ${testResults.passed} 个 ✅`);
    logger.info(`   失败: ${testResults.failed} 个 ❌`);
    logger.info(`   成功率: ${(testResults.passed / testResults.total * 100).toFixed(1)}%\n`);

    // 按类别统计
    const categoryStats = {};
    testResults.details.forEach(detail => {
      if (!categoryStats[detail.suite]) {
        categoryStats[detail.suite] = { total: 0, passed: 0 };
      }
      categoryStats[detail.suite].total++;
      if (detail.status === 'passed') {
        categoryStats[detail.suite].passed++;
      }
    });

    logger.info('📋 分类统计:');
    Object.entries(categoryStats).forEach(([suite, stats]) => {
      const percentage = (stats.passed / stats.total * 100).toFixed(1);
      const status = stats.passed === stats.total ? '✅' : '⚠️';
      logger.info(`   ${suite}: ${stats.passed}/${stats.total} (${percentage}%) ${status}`);
    });

    // 显示失败的测试
    const failedTests = testResults.details.filter(d => d.status !== 'passed');
    if (failedTests.length > 0) {
      logger.info('\n❌ 失败的测试:');
      failedTests.forEach(test => {
        logger.info(`   - ${test.suite} > ${test.test}`);
        logger.info(`     工具: ${test.tool}`);
        logger.info(`     错误: ${test.error}`);
      });
    }

    await agent.cleanup();

  } catch (error) {
    logger.error('❌ 测试执行失败:', error);
    process.exit(1);
  }
}

realWebsiteTest();
