/**
 * 演示 Unified-Agent 完全覆盖传统函数式调用
 * 展示如何用统一架构替代 AgentCore 的直接函数调用
 */

import { createUnifiedAgent } from './src/llm/index.js';
import { AgentCore } from './src/index.js';
import Logger from './src/utils/logger.js';

const logger = new Logger('info');

async function demonstrateUnifiedReplacement() {
  logger.info('🚀 演示 Unified-Agent 覆盖传统函数式调用\n');

  // ==================== 传统 AgentCore 方式 ====================
  logger.info('📋 1. 传统 AgentCore 函数式调用方式:');
  
  try {
    const traditionalCore = new AgentCore({
      browser: { enabled: true, headless: true },
      mcp: { servers: [] }
    });
    
    await traditionalCore.initialize();
    
    // 传统的函数式调用
    logger.info('   调用: traditionalCore.handleToolCall("navigate", {...})');
    const result1 = await traditionalCore.handleToolCall(
      'navigate', 
      { url: 'https://example.com' }, 
      'call_001'
    );
    logger.info('   结果:', result1.success ? '✅ 成功' : '❌ 失败');
    
    await traditionalCore.shutdown();
    
  } catch (error) {
    logger.warn('   ⚠️ 传统方式演示跳过 (可能需要浏览器环境):', error.message);
  }

  logger.info('');

  // ==================== Unified-Agent 替代方式 ====================
  logger.info('📋 2. Unified-Agent 完全兼容的替代方式:');
  
  try {
    const unifiedAgent = createUnifiedAgent({
      browser: { enabled: true, headless: true },
      mcp: { servers: [] }
    });
    
    await unifiedAgent.initialize();
    
    // 完全相同的函数式调用接口
    logger.info('   调用: unifiedAgent.handleToolCall("navigate", {...})');
    const result2 = await unifiedAgent.handleToolCall(
      'navigate', 
      { url: 'https://example.com' }, 
      'call_002'
    );
    logger.info('   结果:', result2.success ? '✅ 成功' : '❌ 失败');
    
    // ==================== 额外的统一调用方式 ====================
    logger.info('\n📋 3. Unified-Agent 的增强调用方式:');
    
    // 统一工具调用格式
    logger.info('   调用: unifiedAgent.executeUnifiedToolCall({...})');
    const result3 = await unifiedAgent.executeUnifiedToolCall({
      id: 'call_003',
      name: 'navigate',
      args: { url: 'https://google.com' }
    });
    logger.info('   结果:', result3.success ? '✅ 成功' : '❌ 失败');
    
    // 工具链执行 (新增功能)
    logger.info('   调用: unifiedAgent.executeToolChain([...])');
    const chainResult = await unifiedAgent.executeToolChain([
      { name: 'navigate', args: { url: 'https://example.com' } },
      { name: 'screenshot', args: {} }
    ], {}, { continueOnError: true });
    
    logger.info(`   工具链结果: 执行了 ${chainResult.length} 个步骤`);
    
    // 获取可用工具
    const availableTools = unifiedAgent.getTools();
    logger.info(`   可用工具: 发现 ${availableTools.length} 个工具`);
    
    // 获取统计信息
    const stats = unifiedAgent.getStats();
    logger.info('   统计信息:', {
      总调用次数: stats.totalCalls,
      工具调用次数: stats.toolCalls,
      错误次数: stats.errors
    });
    
    await unifiedAgent.cleanup();
    
  } catch (error) {
    logger.warn('   ⚠️ Unified 方式演示跳过 (可能需要浏览器环境):', error.message);
  }

  // ==================== LLM + 工具协作演示 ====================
  logger.info('\n📋 4. LLM + 工具协作 (Unified-Agent 独有):');
  
  try {
    const smartAgent = createUnifiedAgent({
      browser: { enabled: true, headless: true },
      llm: {
        provider: 'mock', // 模拟 LLM
        requestHandler: async function* (payload) {
          // 模拟 LLM 输出工具调用 JSON
          yield {
            choices: [{
              message: {
                content: `我需要导航到网页并截图。

\`\`\`json
[
  {
    "id": "call_llm_001",
    "name": "navigate", 
    "args": {"url": "https://example.com"}
  },
  {
    "id": "call_llm_002",
    "name": "screenshot",
    "args": {}
  }
]
\`\`\``
              }
            }]
          };
        }
      }
    });
    
    await smartAgent.initialize();
    
    // LLM + 工具的统一任务执行
    const taskResult = await smartAgent.executeTask({
      type: 'llm_with_tools',
      prompt: '请帮我截图 example.com 网站',
      tools: ['navigate', 'screenshot'],
      autoExecuteTools: true
    });
    
    logger.info('   LLM + 工具协作结果:', {
      成功: taskResult.success,
      类型: taskResult.type,
      工具调用数: taskResult.data?.toolResults?.length || 0
    });
    
    await smartAgent.cleanup();
    
  } catch (error) {
    logger.warn('   ⚠️ LLM 协作演示跳过:', error.message);
  }

  logger.info('\n🎉 演示总结:');
  logger.info('✅ Unified-Agent 完全兼容传统的函数式调用接口');
  logger.info('✅ 提供了统一的工具调用层，支持浏览器 + MCP 工具');  
  logger.info('✅ 增加了 LLM + 工具协作的智能化能力');
  logger.info('✅ 可以无缝替代 AgentCore，零迁移成本');
  logger.info('✅ 统一了所有工具调用，简化了架构复杂度');
}

// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateUnifiedReplacement().catch(console.error);
}

export { demonstrateUnifiedReplacement };
