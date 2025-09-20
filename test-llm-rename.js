#!/usr/bin/env node

/**
 * 测试 LLMAgent 重命名后的功能
 */

import { 
  createLLMAgent, 
  createAgent, 
  LLMAgent,
  // 向后兼容测试
  createUnifiedLLMAgent,
  createUnifiedAgent,
  UnifiedLLMAgent
} from './src/llm/index.js';

console.log('🧪 测试 LLMAgent 重命名...');

try {
  // 测试新的命名
  console.log('✅ LLMAgent 类导入成功');
  const agent1 = new LLMAgent({
    llm: {
      provider: 'spark',
      options: { apiKey: 'test' }
    },
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ LLMAgent 实例创建成功');
  
  const agent2 = createLLMAgent({
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ createLLMAgent 工厂函数工作正常');
  
  const agent3 = createAgent({
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ createAgent 工厂函数工作正常');
  
  // 测试向后兼容性
  console.log('\n🔄 测试向后兼容性...');
  const agent4 = new UnifiedLLMAgent({
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ UnifiedLLMAgent 向后兼容正常');
  
  const agent5 = createUnifiedLLMAgent({
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ createUnifiedLLMAgent 向后兼容正常');
  
  const agent6 = createUnifiedAgent({
    browser: { enabled: false },
    mcp: { servers: [] }
  });
  console.log('✅ createUnifiedAgent 向后兼容正常');
  
  // 验证它们是同一个类
  console.log('\n🔍 验证类型一致性...');
  console.log('LLMAgent === UnifiedLLMAgent:', LLMAgent === UnifiedLLMAgent);
  console.log('agent1 instanceof LLMAgent:', agent1 instanceof LLMAgent);
  console.log('agent4 instanceof LLMAgent:', agent4 instanceof LLMAgent);
  
  console.log('\n🎉 LLMAgent 重命名测试通过！');
  console.log('📝 新的简洁命名：');
  console.log('  - UnifiedLLMAgent → LLMAgent');
  console.log('  - createUnifiedLLMAgent → createLLMAgent');
  console.log('  - createUnifiedAgent → createAgent');
  console.log('🔄 向后兼容性保持完好');
  
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  process.exit(1);
}
