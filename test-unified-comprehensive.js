#!/usr/bin/env node

/**
 * 统一架构综合测试
 * 展示 LLM 模型调用路径的统一：MCP + 浏览器本地工具
 */

import { createUnifiedLLMAgent } from './src/llm/index.js';
import { createSparkLLM } from './src/llm/index.js';
import Logger from './src/utils/logger.js';
import express from 'express';
import http from 'http';

const logger = new Logger('info');

async function comprehensiveUnifiedTest() {
  logger.info('🚀 启动统一架构综合测试...\n');

  // 启动测试服务器
  const app = express();
  app.use(express.static('.'));
  const server = http.createServer(app);
  const PORT = 8081;

  server.listen(PORT, () => {
    logger.info(`🌐 测试服务器启动: http://localhost:${PORT}`);
    runComprehensiveTests();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.info('🌐 使用现有服务器');
      setTimeout(runComprehensiveTests, 1000);
    } else {
      logger.error('服务器启动失败:', err);
    }
  });

  async function runComprehensiveTests() {
    try {
      // 1. 测试：仅浏览器本地工具
      logger.info('=' .repeat(60));
      logger.info('🧪 测试 1: 浏览器本地工具路径');
      logger.info('=' .repeat(60));
      
      await testBrowserOnlyPath();
      
      // 2. 测试：混合 MCP + 浏览器工具
      logger.info('\n' + '=' .repeat(60));
      logger.info('🧪 测试 2: 混合 MCP + 浏览器工具路径');
      logger.info('=' .repeat(60));
      
      await testMixedPath();
      
      // 3. 测试：LLM 智能工具调用解析
      logger.info('\n' + '=' .repeat(60));
      logger.info('🧪 测试 3: LLM 智能工具调用解析');
      logger.info('=' .repeat(60));
      
      await testLLMSmartParsing();

      logger.info('\n🎉 所有测试完成！');
      server.close();

    } catch (error) {
      logger.error('❌ 测试失败:', error);
      server.close();
      process.exit(1);
    }
  }

  /**
   * 测试浏览器本地工具路径
   */
  async function testBrowserOnlyPath() {
    const agent = createUnifiedLLMAgent({
      browser: {
        enabled: true,
        headless: false,
        viewport: { width: 1280, height: 800 }
      }
    });

    await agent.initialize();
    
    logger.info(`📋 可用工具: ${agent.toolRegistry.size} 个`);
    for (const [name, info] of agent.toolRegistry) {
      logger.info(`   - ${name} (${info.type})`);
    }

    // 模拟 LLM 输出的工具调用序列
    const mockLLMToolCalls = [
      {
        id: 'test_nav',
        name: 'browser.navigate',
        args: {
          url: 'http://localhost:8081/test-locator-improvements.html',
          waitUntil: 'networkidle2'
        }
      },
      {
        id: 'test_extract',
        name: 'browser.extract',
        args: {
          selector: 'button',
          multiple: true,
          attribute: 'textContent'
        }
      },
      {
        id: 'test_click',
        name: 'browser.click',
        args: {
          selector: '#test-button1'
        }
      }
    ];

    logger.info('\n🔧 执行工具调用序列...');
    for (const toolCall of mockLLMToolCalls) {
      try {
        const result = await agent.executeUnifiedToolCall(toolCall);
        logger.info(`✅ ${toolCall.name}: ${result.success ? '成功' : '失败'}`);
        if (result.success && result.data?.data) {
          logger.info(`   数据: ${JSON.stringify(result.data.data).slice(0, 100)}...`);
        }
      } catch (error) {
        logger.error(`❌ ${toolCall.name}: ${error.message}`);
      }
    }

    const stats = agent.getStats();
    logger.info(`\n📊 统计: 工具调用 ${stats.toolCalls} 次，浏览器调用 ${stats.browserCalls} 次`);
    
    await agent.cleanup();
  }

  /**
   * 测试混合 MCP + 浏览器工具路径
   */
  async function testMixedPath() {
    // 这里展示如何同时使用 MCP 和浏览器工具
    // 实际部署时可以配置真实的 MCP 服务器
    
    const agent = createUnifiedLLMAgent({
      browser: {
        enabled: true,
        headless: false
      },
      // mcp: {
      //   servers: [
      //     {
      //       name: 'unified-browser',
      //       transport: 'stdio',
      //       command: 'node',
      //       args: ['-e', `
      //         import { startUnifiedBrowserMCPServer } from './src/mcp/unified-browser-server.js';
      //         startUnifiedBrowserMCPServer();
      //       `]
      //     }
      //   ]
      // }
    });

    await agent.initialize();
    
    logger.info('🔗 模拟混合工具调用场景');
    logger.info('   - 本地浏览器工具：直接调用');
    logger.info('   - MCP 工具：通过 MCP 协议调用');
    
    // 演示统一接口的威力：LLM 不需要知道工具是本地还是 MCP
    const unifiedToolCall = {
      id: 'unified_test',
      name: 'browser.navigate',  // LLM 只需要知道工具名
      args: {
        url: 'http://localhost:8081/test-locator-improvements.html'
      }
    };

    const result = await agent.executeUnifiedToolCall(unifiedToolCall);
    logger.info(`✅ 统一工具调用: ${result.success ? '成功' : '失败'}`);
    logger.info(`   工具类型: ${result.type} (LLM 无需关心此信息)`);
    
    await agent.cleanup();
  }

  /**
   * 测试 LLM 智能工具调用解析
   */
  async function testLLMSmartParsing() {
    const agent = createUnifiedLLMAgent({
      browser: {
        enabled: true,
        headless: false
      }
    });

    await agent.initialize();

    // 测试不同格式的 LLM 输出解析
    const testCases = [
      {
        name: 'JSON 代码块格式',
        llmOutput: `我需要访问页面并截图：

\`\`\`json
[
  {
    "id": "call_1",
    "name": "browser.navigate",
    "args": {
      "url": "http://localhost:8081/test-locator-improvements.html"
    }
  },
  {
    "id": "call_2", 
    "name": "browser.screenshot",
    "args": {
      "fullPage": false
    }
  }
]
\`\`\``
      },
      
      {
        name: '混合文本格式',
        llmOutput: `让我分步骤完成任务：

首先导航到页面：
\`\`\`json
{
  "id": "step_1",
  "name": "browser.navigate", 
  "args": {
    "url": "http://localhost:8081/test-locator-improvements.html"
  }
}
\`\`\`

然后点击按钮：
\`\`\`json
{
  "id": "step_2",
  "name": "browser.click",
  "args": {
    "selector": "#test-button1"
  }
}
\`\`\``
      }
    ];

    for (const testCase of testCases) {
      logger.info(`\n🧠 测试解析: ${testCase.name}`);
      
      const mockLLMResponse = { content: testCase.llmOutput };
      const toolCalls = agent.parseToolCallsFromLLMResponse(mockLLMResponse);
      
      logger.info(`   解析结果: 发现 ${toolCalls.length} 个工具调用`);
      for (const call of toolCalls) {
        logger.info(`   - ${call.name}: ${JSON.stringify(call.args).slice(0, 50)}...`);
      }

      // 执行解析出的工具调用
      if (toolCalls.length > 0) {
        logger.info('   执行工具调用...');
        for (const toolCall of toolCalls.slice(0, 2)) { // 只执行前两个
          try {
            const result = await agent.executeUnifiedToolCall(toolCall);
            logger.info(`   ✅ ${toolCall.name}: 成功`);
          } catch (error) {
            logger.info(`   ❌ ${toolCall.name}: ${error.message}`);
          }
        }
      }
    }

    const finalStats = agent.getStats();
    logger.info(`\n📊 最终统计:`);
    logger.info(`   总调用: ${finalStats.totalCalls}`);
    logger.info(`   工具调用: ${finalStats.toolCalls}`);
    logger.info(`   浏览器调用: ${finalStats.browserCalls}`);
    logger.info(`   MCP 调用: ${finalStats.mcpCalls}`);
    logger.info(`   错误: ${finalStats.errors}`);

    await agent.cleanup();
  }

  // 处理退出信号
  process.on('SIGINT', () => {
    logger.info('\n🔚 退出测试...');
    server.close();
    process.exit(0);
  });
}

// 启动综合测试
if (import.meta.url === `file://${process.argv[1]}`) {
  comprehensiveUnifiedTest();
}
