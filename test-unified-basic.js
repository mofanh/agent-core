#!/usr/bin/env node

/**
 * 简化版统一架构测试
 * 测试新的统一调用层基本功能
 */

import { createUnifiedLLMAgent } from './src/llm/unified-agent.js';
import Logger from './src/utils/logger.js';
import express from 'express';
import http from 'http';

const logger = new Logger('info');

async function testUnifiedArchitecture() {
  logger.info('🧪 开始测试统一架构...\n');

  // 启动测试服务器
  const app = express();
  app.use(express.static('.'));
  const server = http.createServer(app);
  const PORT = 8081;

  server.listen(PORT, () => {
    logger.info(`🌐 测试服务器启动: http://localhost:${PORT}`);
    runTests();
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.info('🌐 使用现有服务器');
      setTimeout(runTests, 1000);
    } else {
      logger.error('服务器启动失败:', err);
    }
  });

  async function runTests() {
    try {
      // 1. 创建简化的统一 Agent（只使用浏览器工具）
      const agent = createUnifiedLLMAgent({
        // 浏览器工具配置
        browser: {
          enabled: true,
          headless: false,
          viewport: { width: 1280, height: 800 }
        }
        // 暂时不使用 LLM，先测试工具注册和调用
      });

      // 2. 初始化 Agent
      logger.info('📡 初始化统一 Agent...');
      await agent.initialize();
      
      // 3. 验证工具注册
      logger.info('📝 验证工具注册:');
      logger.info(`   - 已注册工具数量: ${agent.toolRegistry.size}`);
      
      for (const [name, info] of agent.toolRegistry) {
        logger.info(`     * ${name} (${info.type})`);
      }

      // 4. 测试工具调用
      logger.info('\n🔧 测试工具调用...');
      
      // 测试导航
      const navigateResult = await agent.executeUnifiedToolCall({
        id: 'test_nav_1',
        name: 'browser.navigate',
        args: {
          url: 'http://localhost:8081/test-locator-improvements.html',
          waitUntil: 'networkidle2'
        }
      });
      
      logger.info('✅ 导航测试结果:', navigateResult.success ? '成功' : '失败');
      if (navigateResult.success) {
        logger.info('   页面标题:', navigateResult.data?.data?.title);
      }

      // 测试内容提取
      const extractResult = await agent.executeUnifiedToolCall({
        id: 'test_extract_1', 
        name: 'browser.extract',
        args: {
          selector: 'button',
          multiple: true,
          attribute: 'text'
        }
      });
      
      logger.info('✅ 内容提取测试结果:', extractResult.success ? '成功' : '失败');
      if (extractResult.success && extractResult.data?.data) {
        logger.info('   找到按钮:', extractResult.data.data.length, '个');
      }

      // 测试点击
      const clickResult = await agent.executeUnifiedToolCall({
        id: 'test_click_1',
        name: 'browser.click', 
        args: {
          selector: '#test-button1'
        }
      });
      
      logger.info('✅ 点击测试结果:', clickResult.success ? '成功' : '失败');

      // 5. 显示统计
      logger.info('\n📊 执行统计:');
      const stats = agent.getStats();
      for (const [key, value] of Object.entries(stats)) {
        logger.info(`   - ${key}: ${value}`);
      }

      logger.info('\n🎉 基础测试完成！');

      // 清理
      await agent.cleanup();
      server.close();

    } catch (error) {
      logger.error('❌ 测试失败:', error);
      server.close();
      process.exit(1);
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
  testUnifiedArchitecture();
}
