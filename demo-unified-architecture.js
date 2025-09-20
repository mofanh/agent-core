#!/usr/bin/env node

/**
 * 统一 LLM Agent 架构演示
 * 展示如何使用新的统一调用层让 LLM 输出工具调用 JSON 来控制所有操作
 */

import { createUnifiedLLMAgent } from './src/llm/index.js';
import { createSparkLLM } from './src/llm/index.js';
import Logger from './src/utils/logger.js';

const logger = new Logger('info');

async function demonstrateUnifiedArchitecture() {
  logger.info('🚀 开始演示统一 LLM Agent 架构...\n');

  try {
    // 1. 创建统一 LLM Agent
    const agent = createUnifiedLLMAgent({
      // LLM 配置
      llm: {
        provider: 'spark',
        options: {
          apiKey: process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau',
          baseUrl: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
          model: '4.0Ultra'
        }
      },
      
      // 浏览器工具配置（本地）
      browser: {
        enabled: true,
        headless: false,
        viewport: { width: 1280, height: 800 },
        security: {
          level: 'normal',
          enableAuditLog: true
        }
      },
      
      // MCP 配置（可选，用于其他 MCP 服务器）
      mcp: {
        servers: [
          // 可以添加其他 MCP 服务器
          // {
          //   name: 'web-search',
          //   transport: 'stdio',
          //   command: 'web-search-server'
          // }
        ]
      }
    });

    // 2. 初始化 Agent
    logger.info('📡 初始化统一 LLM Agent...');
    await agent.initialize();
    
    // 3. 获取统计信息
    logger.info('📊 Agent 状态:');
    logger.info(`   - 可用工具数量: ${agent.toolRegistry.size}`);
    logger.info('   - 工具列表:');
    
    for (const [name, info] of agent.toolRegistry) {
      logger.info(`     * ${name} (${info.type})`);
    }
    
    logger.info('');

    // 4. 演示：让 LLM 分析网页并执行操作
    logger.info('🤖 演示任务：让 LLM 访问测试页面并进行交互');
    logger.info('🌐 测试页面: http://localhost:8081/test-locator-improvements.html\n');
    
    const task = {
      type: 'llm_with_tools',
      prompt: {
        messages: [
          {
            role: 'user', 
            content: `请帮我完成以下任务：
1. 访问 http://localhost:8081/test-locator-improvements.html 页面
2. 分析页面内容，找到所有可点击的按钮
3. 依次点击前3个按钮
4. 最后截取页面截图

请按步骤执行，每一步都使用相应的工具。`
          }
        ]
      },
      tools: ['browser_navigate', 'browser_extract', 'browser_click', 'browser_screenshot'],
      maxIterations: 10,
      autoExecuteTools: true
    };

    const result = await agent.executeTask(task);
    
    logger.info('✅ 任务执行完成！');
    logger.info('📋 执行结果:', JSON.stringify(result, null, 2));

    // 5. 展示统计信息
    logger.info('\n📊 执行统计:');
    const stats = agent.getStats();
    for (const [key, value] of Object.entries(stats)) {
      logger.info(`   - ${key}: ${value}`);
    }

  } catch (error) {
    logger.error('❌ 演示执行失败:', error);
  }
}

// 启动演示
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateUnifiedArchitecture()
    .then(() => {
      logger.info('🎉 演示完成！');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 演示失败:', error);
      process.exit(1);
    });
}
