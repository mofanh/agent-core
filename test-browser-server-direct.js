#!/usr/bin/env node

/**
 * 直接测试我们的浏览器服务器
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testBrowserServer() {
  console.log('=== 测试浏览器 MCP 服务器 ===');
  
  try {
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['./bin/mcp-browser-server.js']
    });
    
    const client = new Client(
      {
        name: 'debug-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );
    
    console.log('🔗 连接到浏览器服务器...');
    await client.connect(transport);
    console.log('✅ 连接成功');
    
    console.log('📋 获取工具列表...');
    const tools = await client.listTools();
    console.log('✅ 工具列表获取成功:', tools.tools.length, '个工具');
    console.log('工具名称:', tools.tools.map(t => t.name).join(', '));
    
    await client.close();
    console.log('✅ 测试完成');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误类型:', error.constructor.name);
    console.error('Stack trace:');
    console.error(error.stack);
  }
}

testBrowserServer();
