/**
 * 测试 Chrome DevTools MCP evaluate_script 的正确语法
 */

import { createLLMAgent } from './src/llm/index.js';
import { loadConfig, extractMcpServers } from './src/utils/config-loader.js';

const logger = console;

async function testEvaluateScriptSyntax() {
  let agent = null;
  
  try {
    logger.info('🧪 测试 evaluate_script 语法优化\n');

    // 1. 加载配置
    const { config } = loadConfig();
    const mcpServers = extractMcpServers(config);
    
    // 2. 创建 Agent
    agent = createLLMAgent({
      model: 'spark',
      apiKey: process.env.SPARK_API_KEY,
      appId: process.env.SPARK_APP_ID,
      apiSecret: process.env.SPARK_API_SECRET,
      mcp: { servers: mcpServers }
    });
    
    await agent.initialize();
    await agent.mcpSystem.initialize();
    
    logger.info('✅ MCP 系统初始化完成\n');

    // 测试不同的语法形式
    const tests = [
      {
        name: '简单表达式',
        function: '1 + 1',
        expected: '2'
      },
      {
        name: '直接访问属性',
        function: 'document.title',
        expected: (result) => result && result.length > 0
      },
      {
        name: 'IIFE 包裹代码',
        function: `(() => {
          const h1 = document.querySelector('h1');
          return h1 ? h1.textContent : 'no h1';
        })()`,
        expected: (result) => result !== 'no h1'
      },
      {
        name: '复杂对象返回',
        function: `(() => {
          return JSON.stringify({
            url: window.location.href,
            title: document.title,
            linkCount: document.querySelectorAll('a').length
          });
        })()`,
        expected: (result) => {
          try {
            const data = JSON.parse(result);
            return data.url && data.title;
          } catch {
            return false;
          }
        }
      }
    ];

    // 先导航到页面
    logger.info('📄 导航到测试页面...');
    await agent.mcpSystem.callTool('navigate_page', {
      url: 'https://course.rs/basic/collections/intro.html'
    });
    logger.info('✅ 导航完成\n');

    // 执行测试
    for (const test of tests) {
      logger.info(`🔍 测试: ${test.name}`);
      logger.info(`   代码: ${test.function.substring(0, 80)}${test.function.length > 80 ? '...' : ''}`);
      
      try {
        const result = await agent.mcpSystem.callTool('evaluate_script', {
          function: test.function
        });
        
        if (result && result.success && result.data && result.data.content) {
          const content = result.data.content[0];
          const resultText = content.text;
          
          // 验证结果
          const isValid = typeof test.expected === 'function' 
            ? test.expected(resultText)
            : resultText === test.expected;
          
          if (isValid) {
            logger.info(`   ✅ 通过`);
            logger.info(`   📋 结果: ${resultText.substring(0, 100)}${resultText.length > 100 ? '...' : ''}`);
          } else {
            logger.info(`   ❌ 失败: 结果不符合预期`);
            logger.info(`   📋 结果: ${resultText}`);
          }
        } else {
          logger.info(`   ❌ 失败: ${JSON.stringify(result).substring(0, 200)}`);
        }
      } catch (error) {
        logger.error(`   ❌ 异常: ${error.message}`);
      }
      
      logger.info('');
    }

    logger.info('🎉 测试完成！\n');
    
    await agent.cleanup();
    
  } catch (error) {
    logger.error('❌ 测试失败:', error.message);
    if (agent && agent.cleanup) {
      await agent.cleanup();
    }
    process.exit(1);
  }
}

testEvaluateScriptSyntax();
