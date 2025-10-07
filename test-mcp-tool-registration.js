#!/usr/bin/env node

/**
 * 测试 MCP 工具注册
 */

import { createLLMAgent } from './src/llm/index.js';
import { loadConfig, extractMcpServers } from './src/utils/config-loader.js';

async function testMcpToolRegistration() {
  console.log('=== MCP 工具注册测试 ===\n');
  
  // 1. 加载配置
  const { config } = loadConfig();
  const mcpServers = extractMcpServers(config);
  console.log(`发现 ${mcpServers.length} 个 MCP 服务器\n`);
  
  // 2. 创建 Agent
  const agent = createLLMAgent({
    mcp: { servers: mcpServers },
    llm: {
      provider: 'spark',
      options: { apiKey: 'test' }
    }
  });
  
  // 3. 初始化
  await agent.initialize();
  console.log(`初始化后 toolRegistry 大小: ${agent.toolRegistry.size}\n`);
  
  // 4. 初始化 MCP 连接
  if (agent.mcpSystem) {
    console.log('开始初始化 MCP 连接...');
    await agent.mcpSystem.initialize();
    console.log('等待 2 秒让工具加载...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mcpTools = agent.mcpSystem.getTools();
    console.log(`MCP 工具数量: ${mcpTools.length}\n`);
    
    // 5. 重新注册工具
    console.log('重新注册 MCP 工具...');
    for (const tool of mcpTools) {
      agent.toolRegistry.set(tool.name, {
        type: 'mcp',
        handler: agent.mcpSystem.toolSystem,
        schema: tool.inputSchema,
        description: tool.description
      });
    }
    
    console.log(`重新注册后 toolRegistry 大小: ${agent.toolRegistry.size}\n`);
    
    // 6. 显示已注册工具
    console.log('已注册工具列表:');
    for (const [name, info] of Array.from(agent.toolRegistry.entries()).slice(0, 10)) {
      const desc = info.description || 'No description';
      console.log(`  - ${name}: ${desc.substring(0, 60)}`);
    }
    if (agent.toolRegistry.size > 10) {
      console.log(`  ... 还有 ${agent.toolRegistry.size - 10} 个工具`);
    }
  }
  
  await agent.cleanup();
  console.log('\n✅ 测试完成');
}

testMcpToolRegistration().catch(console.error);
