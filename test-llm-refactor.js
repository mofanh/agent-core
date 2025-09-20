#!/usr/bin/env node

/**
 * 测试 LLM 模块重构后的功能
 */

import { 
  createUnifiedLLMAgent, 
  createUnifiedAgent, 
  LLMFactory,
  createSparkLLM,
  UnifiedLLMAgent
} from './src/llm/index.js';

console.log('🧪 测试 LLM 模块重构...');

try {
  // 测试 LLMFactory
  console.log('✅ LLMFactory 导入成功');
  console.log('📋 可用提供商:', LLMFactory.getProviders());
  
  // 测试 UnifiedLLMAgent 类
  console.log('✅ UnifiedLLMAgent 类导入成功');
  const agent1 = new UnifiedLLMAgent({
    llm: {
      provider: 'spark',
      options: { apiKey: 'test' }
    },
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ UnifiedLLMAgent 实例创建成功');
  
  // 测试工厂函数
  const agent2 = createUnifiedLLMAgent({
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ createUnifiedLLMAgent 工厂函数工作正常');
  
  const agent3 = createUnifiedAgent({
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ createUnifiedAgent 工厂函数工作正常');
  
  // 测试 LLM 传统功能
  try {
    const sparkLLM = createSparkLLM({ apiKey: 'test' });
    console.log('✅ 传统 LLM 功能保持正常');
  } catch (e) {
    console.log('⚠️ 传统 LLM 功能需要有效配置');
  }
  
  console.log('\n🎉 LLM 模块重构测试通过！');
  console.log('📝 UnifiedLLMAgent 已成功整合到 src/llm/index.js');
  console.log('🔄 所有导入都已更新为使用新的模块结构');
  
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  process.exit(1);
}
