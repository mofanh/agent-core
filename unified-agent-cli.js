#!/usr/bin/env node

/**
 * 统一架构 CLI 工具
 * 演示如何将真实 LLM 与统一工具调用架构结合使用
 */

import { createUnifiedLLMAgent } from './src/llm/index.js';
import Logger from './src/utils/logger.js';
import express from 'express';
import http from 'http';
import { Command } from 'commander';

const logger = new Logger('info');

// 启动测试服务器
let testServer = null;

async function startTestServer() {
  if (testServer) return;
  
  const app = express();
  app.use(express.static('.'));
  testServer = http.createServer(app);
  const PORT = 8081;

  return new Promise((resolve, reject) => {
    testServer.listen(PORT, () => {
      logger.info(`🌐 测试服务器启动: http://localhost:${PORT}`);
      resolve();
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.info('🌐 使用现有服务器');
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

/**
 * 使用真实 LLM 进行智能工具调用
 */
async function runSmartAgent(userQuery, options = {}) {
  const {
    provider = 'spark',
    apiKey = process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau',
    headless = false,
    maxIterations = 5
  } = options;

  // 启动测试服务器
  await startTestServer();

  logger.info('🚀 初始化智能 Agent...');
  
  // 创建配置了真实 LLM 的统一 Agent
  const agent = createUnifiedLLMAgent({
    llm: {
      provider,
      options: {
        apiKey,
        baseUrl: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
        model: '4.0Ultra'
      }
    },
    browser: {
      enabled: true,
      headless,
      viewport: { width: 1280, height: 800 }
    }
  });

  await agent.initialize();
  
  logger.info(`📝 可用工具: ${agent.toolRegistry.size} 个`);
  logger.info('🤖 开始 LLM 任务执行...\n');

  try {
    // 构建系统提示，教 LLM 如何使用工具
    const systemPrompt = `你是一个智能网页操作助手，可以调用以下工具来帮助用户完成任务：

可用工具：
- browser.navigate: 导航到网页
- browser.extract: 提取页面内容  
- browser.click: 点击页面元素
- browser.type: 在输入框中输入文本
- browser.hover: 悬停在元素上
- browser.screenshot: 截取页面截图
- browser.evaluate: 执行 JavaScript 代码

当你需要使用工具时，请输出以下格式的 JSON：

\`\`\`json
[
  {
    "id": "call_1",
    "name": "工具名称",
    "args": {
      "参数名": "参数值"
    }
  }
]
\`\`\`

测试页面地址：http://localhost:8081/test-locator-improvements.html

请根据用户需求智能地选择和组合使用这些工具。`;

    const result = await agent.executeTask({
      type: 'llm_with_tools',
      prompt: {
        model: '4.0Ultra',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ]
      },
      maxIterations,
      autoExecuteTools: true
    });

    logger.info('✅ 任务执行完成！');
    logger.info('\n📋 执行结果:');
    
    if (result.data && result.data.llmResponse) {
      logger.info('🤖 LLM 响应:');
      const content = result.data.llmResponse.choices?.[0]?.message?.content || 
                     result.data.llmResponse.content || 
                     JSON.stringify(result.data.llmResponse);
      logger.info(content.slice(0, 500) + (content.length > 500 ? '...' : ''));
    }

    if (result.data && result.data.toolCalls && result.data.toolCalls.length > 0) {
      logger.info(`\n🔧 执行了 ${result.data.toolCalls.length} 个工具调用:`);
      result.data.toolCalls.forEach((call, index) => {
        logger.info(`   ${index + 1}. ${call.name}`);
      });
    }

    if (result.data && result.data.toolResults && result.data.toolResults.length > 0) {
      logger.info('\n📊 工具执行结果:');
      result.data.toolResults.forEach((toolResult, index) => {
        logger.info(`   ${index + 1}. ${toolResult.toolName}: ${toolResult.success ? '✅ 成功' : '❌ 失败'}`);
        if (!toolResult.success && toolResult.error) {
          logger.info(`      错误: ${toolResult.error}`);
        }
      });
    }

    // 显示统计
    const stats = agent.getStats();
    logger.info('\n📊 执行统计:');
    logger.info(`   LLM 调用: ${stats.llmCalls}`);
    logger.info(`   工具调用: ${stats.toolCalls}`);
    logger.info(`   浏览器调用: ${stats.browserCalls}`);
    logger.info(`   错误: ${stats.errors}`);

    await agent.cleanup();

  } catch (error) {
    logger.error('❌ 任务执行失败:', error);
    await agent.cleanup();
    throw error;
  } finally {
    if (testServer) {
      testServer.close();
    }
  }
}

/**
 * 预设任务示例
 */
const PRESET_TASKS = {
  'web-analysis': '访问测试页面，分析页面结构，找到所有按钮并点击第一个按钮，然后截取页面截图',
  'button-test': '访问测试页面，找到所有按钮，依次点击前3个按钮，记录每次点击的结果',
  'page-info': '访问测试页面，提取页面标题、所有按钮文本和页面主要内容',
  'screenshot': '访问测试页面并截取完整页面截图',
  'hover-test': '访问测试页面，找到悬停区域并测试悬停功能'
};

// 设置 CLI 命令
const program = new Command();

program
  .name('unified-agent-cli')
  .description('统一架构 LLM Agent CLI 工具')
  .version('1.0.0');

program
  .command('run')
  .description('执行自定义任务')
  .argument('<query>', '用户查询或任务描述')
  .option('-p, --provider <provider>', 'LLM 提供商', 'spark')
  .option('-k, --api-key <key>', 'API 密钥')
  .option('--headless', '无头模式运行浏览器')
  .option('-i, --iterations <number>', '最大迭代次数', '5')
  .action(async (query, options) => {
    try {
      await runSmartAgent(query, {
        provider: options.provider,
        apiKey: options.apiKey,
        headless: options.headless,
        maxIterations: parseInt(options.iterations)
      });
    } catch (error) {
      logger.error('执行失败:', error);
      process.exit(1);
    }
  });

program
  .command('preset')
  .description('执行预设任务')
  .argument('<task>', `预设任务名称 (${Object.keys(PRESET_TASKS).join(', ')})`)
  .option('-p, --provider <provider>', 'LLM 提供商', 'spark')
  .option('-k, --api-key <key>', 'API 密钥')
  .option('--headless', '无头模式运行浏览器')
  .action(async (task, options) => {
    if (!PRESET_TASKS[task]) {
      logger.error(`未知的预设任务: ${task}`);
      logger.info(`可用任务: ${Object.keys(PRESET_TASKS).join(', ')}`);
      process.exit(1);
    }

    try {
      logger.info(`🎯 执行预设任务: ${task}`);
      logger.info(`📋 任务描述: ${PRESET_TASKS[task]}\n`);
      
      await runSmartAgent(PRESET_TASKS[task], {
        provider: options.provider,
        apiKey: options.apiKey,
        headless: options.headless
      });
    } catch (error) {
      logger.error('执行失败:', error);
      process.exit(1);
    }
  });

program
  .command('list-tasks')
  .description('列出所有预设任务')
  .action(() => {
    logger.info('📋 可用的预设任务:\n');
    Object.entries(PRESET_TASKS).forEach(([name, description]) => {
      logger.info(`  ${name}:`);
      logger.info(`    ${description}\n`);
    });
  });

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('未处理的 Promise 拒绝:', reason);
  process.exit(1);
});

// 解析命令行参数
program.parse();

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
