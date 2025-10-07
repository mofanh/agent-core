/**
 * 真实网页测试 - 使用 Chrome DevTools MCP
 * 
 * 这个测试文件使用配置文件中定义的 Chrome DevTools MCP 来执行浏览器自动化测试
 * 不依赖内置的 browser 工具，而是使用 MCP 系统的标准化接口
 */

import { createLLMAgent } from './src/llm/index.js';
import { loadConfig, extractMcpServers } from './src/utils/config-loader.js';

const logger = console;
const TEST_URL = 'https://course.rs/basic/collections/intro.html';

async function realWebsiteMCPTest() {
  let agent = null;
  
  try {
    logger.info('🚀 开始真实网页测试 - 使用 Chrome DevTools MCP');
    logger.info('📋 测试地址:', TEST_URL);
    logger.info('');

    // 1. 加载配置文件 (loadConfig 是同步函数)
    logger.info('📄 正在加载配置文件...');
    const { config, path, format } = loadConfig();
    logger.info(`✅ 配置文件: ${path} (${format})`);
    
    const mcpServers = extractMcpServers(config);
    
    if (mcpServers.length === 0) {
      throw new Error('配置文件中没有找到 MCP 服务器配置，请运行: node bin/agent-cli.js config init');
    }
    
    logger.info(`✅ 发现 ${mcpServers.length} 个 MCP 服务器:`);
    mcpServers.forEach(server => {
      logger.info(`   - ${server.name}: ${server.command} ${server.args.join(' ')}`);
    });
    logger.info('');

    // 2. 创建 Agent (使用配置中的 MCP 服务器)
    logger.info('🤖 正在创建 Agent...');
    agent = createLLMAgent({
      model: 'spark',
      apiKey: process.env.SPARK_API_KEY,
      appId: process.env.SPARK_APP_ID,
      apiSecret: process.env.SPARK_API_SECRET,
      mcp: {
        servers: mcpServers
      }
    });

    // 必须手动调用 initialize() 来初始化 MCP 系统
    logger.info('⏳ 正在初始化 Agent (包括 MCP 系统)...');
    await agent.initialize();
    
    logger.info('✅ Agent 初始化完成');
    
    // MCP 系统可能需要单独初始化连接
    if (agent.mcpSystem && agent.mcpSystem.initialize) {
      logger.info('⏳ 正在初始化 MCP 连接...');
      await agent.mcpSystem.initialize();
      logger.info('✅ MCP 连接初始化完成');
    }
    
    logger.info('');

    // 3. 检查可用工具
    logger.info('🔍 检查 agent.mcpSystem:', agent.mcpSystem);
    logger.info('🔍 mcpSystem 类型:', typeof agent.mcpSystem);
    logger.info('🔍 mcpSystem 是否为null:', agent.mcpSystem === null);
    logger.info('🔍 mcpSystem 是否为undefined:', agent.mcpSystem === undefined);
    
    if (agent.mcpSystem && typeof agent.mcpSystem === 'object') {
      logger.info('🔍 mcpSystem 方法:', Object.getOwnPropertyNames(Object.getPrototypeOf(agent.mcpSystem)));
    }
    
    if (!agent.mcpSystem) {
      throw new Error('MCP 系统未初始化 - agent.mcpSystem 不存在');
    }

    // 使用 getTools() 获取所有可用工具
    const availableTools = agent.mcpSystem.getTools();
    logger.info(`� MCP 工具数量: ${availableTools.length}`);
    
    if (availableTools.length === 0) {
      logger.warn('⚠️  没有找到 MCP 工具，MCP 服务器可能需要更多时间初始化');
      logger.info('⏳ 等待 5 秒后重试...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const retryTools = agent.mcpSystem.getTools();
      logger.info(`📦 重试后工具数量: ${retryTools.length}`);
      
      if (retryTools.length === 0) {
        throw new Error('没有可用的 MCP 工具，请检查配置和 MCP 服务器状态');
      }
    }
    
    // 显示前几个工具
    logger.info('📋 可用工具列表:');
    availableTools.slice(0, 10).forEach(tool => {
      logger.info(`   - ${tool.name}: ${tool.description || '无描述'}`);
    });
    if (availableTools.length > 10) {
      logger.info(`   ... 还有 ${availableTools.length - 10} 个工具`);
    }
    logger.info('');

    // 4. 定义测试套件
    const testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      details: []
    };

    const testSuites = [
      // 1. 导航测试
      {
        name: '页面导航测试',
        category: 'navigation',
        tests: [
          {
            name: '导航到目标页面',
            tool: 'navigate_page',
            args: {
              url: TEST_URL
            },
            validate: (result) => {
              // MCP 工具返回格式：{ success: true, data: { content: [...] } }
              return result && 
                     result.success === true &&
                     result.data &&
                     result.data.content &&
                     Array.isArray(result.data.content);
            }
          },
          {
            name: '获取页面标题',
            tool: 'evaluate_script',
            args: {
              function: '() => document.title'  // ✅ 必须是函数定义!
            },
            validate: (result) => {
              const text = result?.data?.content?.[0]?.text || '';
              if (text.includes('is not a function') || text.includes('error')) {
                console.log('      ❌ 返回错误:', text);
                return false;
              }
              return result && 
                     result.success === true &&
                     result.data &&
                     result.data.content;
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
            name: '提取页面主标题',
            tool: 'evaluate_script',
            args: {
              function: `() => {
                const h1 = document.querySelector('h1');
                return h1 ? h1.textContent : null;
              }`  // ✅ 箭头函数,不要加 ()
            },
            validate: (result) => {
              const text = result?.data?.content?.[0]?.text || '';
              if (text.includes('is not a function') || text.includes('error')) {
                console.log('      ❌ 返回错误:', text);
                return false;
              }
              return result && 
                     result.success === true &&
                     result.data &&
                     result.data.content;
            }
          },
          {
            name: '提取所有链接',
            tool: 'evaluate_script',
            args: {
              function: `() => {
                const links = Array.from(document.querySelectorAll('a'));
                return JSON.stringify(links.map(a => ({ text: a.textContent.trim(), href: a.href })).slice(0, 5));
              }`  // ✅ 箭头函数,不要加 ()
            },
            validate: (result) => {
              const text = result?.data?.content?.[0]?.text || '';
              if (text.includes('is not a function') || text.includes('error')) {
                console.log('      ❌ 返回错误:', text);
                return false;
              }
              return result && 
                     result.success === true &&
                     result.data &&
                     result.data.content;
            }
          }
        ]
      },

      // 3. JavaScript 执行测试
      {
        name: 'JavaScript执行测试',
        category: 'execution',
        tests: [
          {
            name: '执行简单表达式',
            tool: 'evaluate_script',
            args: {
              function: '() => 1 + 1'  // ✅ 必须是函数定义!
            },
            validate: (result) => {
              const text = result?.data?.content?.[0]?.text || '';
              if (text.includes('is not a function') || text.includes('error')) {
                console.log('      ❌ 返回错误:', text);
                return false;
              }
              return result && 
                     result.success === true &&
                     result.data &&
                     result.data.content;
            }
          },
          {
            name: '获取页面元数据',
            tool: 'evaluate_script',
            args: {
              function: `() => {
                return JSON.stringify({
                  url: window.location.href,
                  title: document.title,
                  bodyLength: document.body.textContent.length,
                  linkCount: document.querySelectorAll('a').length
                });
              }`  // ✅ 箭头函数,不要加 ()
            },
            validate: (result) => {
              const text = result?.data?.content?.[0]?.text || '';
              if (text.includes('is not a function') || text.includes('error')) {
                console.log('      ❌ 返回错误:', text);
                return false;
              }
              return result && 
                     result.success === true &&
                     result.data &&
                     result.data.content;
            }
          }
        ]
      },

      // 4. 截图测试
      {
        name: '页面截图测试',
        category: 'capture',
        tests: [
          {
            name: '全页面截图',
            tool: 'take_screenshot',
            args: {
              name: 'test-full-page'
            },
            validate: (result) => {
              return result && 
                     result.success === true &&
                     result.data &&
                     result.data.content &&
                     Array.isArray(result.data.content);
            }
          }
        ]
      }
    ];

    // 5. 执行所有测试
    for (const suite of testSuites) {
      logger.info('============================================================');
      logger.info(`🧪 ${suite.name} (${suite.category})`);
      logger.info('============================================================\n');

      for (const test of suite.tests) {
        logger.info(`🔍 执行: ${test.name}`);
        logger.info(`   工具: ${test.tool}`);
        logger.info(`   参数: ${JSON.stringify(test.args).substring(0, 200)}`);

        const startTime = Date.now();
        testResults.total++;

        try {
          // 使用 MCP 系统调用工具
          const result = await agent.mcpSystem.callTool(test.tool, test.args);
          const duration = Date.now() - startTime;

          if (test.validate(result)) {
            logger.info(`   ✅ 通过 (${duration}ms)`);
            
            // 显示结果摘要（适配 MCP 工具的返回格式）
            if (result.data && result.data.content && Array.isArray(result.data.content)) {
              const firstContent = result.data.content[0];
              if (firstContent?.text) {
                const text = typeof firstContent.text === 'string' 
                  ? firstContent.text 
                  : JSON.stringify(firstContent.text);
                logger.info(`   📋 结果: ${text.substring(0, 150)}${text.length > 150 ? '...' : ''}`);
              }
              if (firstContent?.type === 'image') {
                logger.info(`   📋 结果: 图片 (${firstContent.mimeType || 'unknown'})`);
              }
            }
            
            testResults.passed++;
            testResults.details.push({
              suite: suite.name,
              test: test.name,
              tool: test.tool,
              status: 'passed',
              duration
            });
          } else {
            logger.info(`   ❌ 失败 (${duration}ms) - 验证不通过`);
            logger.info(`   📋 结果: ${JSON.stringify(result).substring(0, 300)}...`);
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
          logger.error(`   ❌ 异常 (${duration}ms) - ${error.message}`);
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

    // 6. 输出测试结果汇总
    logger.info('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
    logger.info('🏁 Chrome DevTools MCP 测试完成');
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

    // 7. 清理
    if (agent && agent.cleanup) {
      await agent.cleanup();
    }

    logger.info('\n✅ 测试完成，资源已清理');

  } catch (error) {
    logger.error('❌ 测试执行失败:', error.message);
    
    if (agent && agent.cleanup) {
      await agent.cleanup();
    }
    
    process.exit(1);
  }
}

// 运行测试
realWebsiteMCPTest();
