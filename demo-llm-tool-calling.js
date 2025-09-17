#!/usr/bin/env node

/**
 * LLM 工具调用 JSON 解析演示
 * 展示如何解析 LLM 输出的工具调用 JSON
 */

import { createUnifiedLLMAgent } from './src/llm/unified-agent.js';
import Logger from './src/utils/logger.js';
import express from 'express';
import http from 'http';

const logger = new Logger('info');

// 模拟 LLM 响应示例
const mockLLMResponses = [
  {
    content: `我需要访问测试页面并分析其内容。让我分步骤完成：

首先导航到测试页面：

\`\`\`json
[
  {
    "id": "call_1",
    "name": "browser.navigate",
    "args": {
      "url": "http://localhost:8081/test-locator-improvements.html",
      "waitUntil": "networkidle2"
    }
  }
]
\`\`\``
  },
  {
    content: `现在提取页面中的所有按钮：

\`\`\`json
[
  {
    "id": "call_2", 
    "name": "browser.extract",
    "args": {
      "selector": "button",
      "multiple": true,
      "attribute": "text"
    }
  }
]
\`\`\``
  },
  {
    content: `现在让我点击第一个按钮并截取页面截图：

\`\`\`json
[
  {
    "id": "call_3",
    "name": "browser.click", 
    "args": {
      "selector": "#test-button1"
    }
  },
  {
    "id": "call_4",
    "name": "browser.screenshot",
    "args": {
      "fullPage": false
    }
  }
]
\`\`\``
  }
];

async function demonstrateLLMToolCalling() {
  logger.info('🧪 开始演示 LLM 工具调用 JSON 解析...\n');

  // 启动测试服务器
  const app = express();
  app.use(express.static('.'));
  const server = http.createServer(app);
  const PORT = 8081;

  server.listen(PORT, () => {
    logger.info(`🌐 测试服务器启动: http://localhost:${PORT}`);
    runDemo();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.info('🌐 使用现有服务器');
      setTimeout(runDemo, 1000);
    } else {
      logger.error('服务器启动失败:', err);
    }
  });

  async function runDemo() {
    try {
      // 创建统一 Agent
      const agent = createUnifiedLLMAgent({
        browser: {
          enabled: true,
          headless: false,
          viewport: { width: 1280, height: 800 }
        }
      });

      await agent.initialize();
      logger.info('✅ 统一 Agent 初始化完成\n');

      // 演示 1：解析单个工具调用
      logger.info('📋 演示 1: 解析单个工具调用');
      logger.info('模拟 LLM 响应:');
      logger.info(mockLLMResponses[0].content);
      logger.info('');

      const toolCalls1 = agent.parseToolCallsFromLLMResponse({
        choices: [{ message: { content: mockLLMResponses[0].content } }]
      });

      logger.info(`🔍 解析结果: 发现 ${toolCalls1.length} 个工具调用`);
      for (const call of toolCalls1) {
        logger.info(`   - ${call.name}: ${JSON.stringify(call.args)}`);
        
        // 执行工具调用
        const result = await agent.executeUnifiedToolCall(call);
        logger.info(`   ✅ 执行结果: ${result.success ? '成功' : '失败'}`);
      }
      logger.info('');

      // 演示 2：解析多个工具调用
      logger.info('📋 演示 2: 解析单步骤多个工具调用');
      logger.info('模拟 LLM 响应:');
      logger.info(mockLLMResponses[2].content);
      logger.info('');

      const toolCalls2 = agent.parseToolCallsFromLLMResponse({
        content: mockLLMResponses[2].content
      });

      logger.info(`🔍 解析结果: 发现 ${toolCalls2.length} 个工具调用`);
      for (const call of toolCalls2) {
        logger.info(`   - ${call.name}: ${JSON.stringify(call.args)}`);
        
        try {
          const result = await agent.executeUnifiedToolCall(call);
          logger.info(`   ✅ 执行结果: ${result.success ? '成功' : '失败'}`);
          if (result.success && call.name === 'browser.extract') {
            logger.info(`      提取的内容: ${JSON.stringify(result.data?.data)}`);
          }
        } catch (error) {
          logger.info(`   ❌ 执行失败: ${error.message}`);
        }
      }
      logger.info('');

      // 演示 3：完整工作流
      logger.info('📋 演示 3: 完整的 LLM + 工具协作工作流');
      logger.info('模拟连续的 LLM 对话...\n');

      for (let i = 0; i < mockLLMResponses.length; i++) {
        logger.info(`🤖 LLM 回合 ${i + 1}:`);
        logger.info(mockLLMResponses[i].content);
        logger.info('');

        const toolCalls = agent.parseToolCallsFromLLMResponse({
          content: mockLLMResponses[i].content
        });

        if (toolCalls.length > 0) {
          logger.info(`🔧 执行 ${toolCalls.length} 个工具调用...`);
          
          for (const call of toolCalls) {
            try {
              const result = await agent.executeUnifiedToolCall(call);
              logger.info(`   ✅ ${call.name}: ${result.success ? '成功' : '失败'}`);
            } catch (error) {
              logger.info(`   ❌ ${call.name}: 失败 - ${error.message}`);
            }
          }
        } else {
          logger.info('🤖 这是纯文本响应，无需工具调用');
        }
        
        logger.info('');
      }

      // 统计信息
      logger.info('📊 最终统计:');
      const stats = agent.getStats();
      for (const [key, value] of Object.entries(stats)) {
        logger.info(`   - ${key}: ${value}`);
      }

      logger.info('\n🎉 演示完成！');

      // 清理
      await agent.cleanup();
      server.close();

    } catch (error) {
      logger.error('❌ 演示失败:', error);
      server.close();
      process.exit(1);
    }
  }

  // 处理退出信号
  process.on('SIGINT', () => {
    logger.info('\n🔚 退出演示...');
    server.close();
    process.exit(0);
  });
}

// 启动演示
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateLLMToolCalling();
}
