#!/usr/bin/env node

/**
 * 测试简单的 MCP 客户端连接
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testSimpleConnection() {
  console.log('=== 测试简单 MCP 连接 ===');
  
  try {
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['./simple-mcp-server.js']
    });
    
    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );
    
    await client.connect(transport);
    console.log('✅ 连接成功');
    
    // 测试 listTools
    console.log('📋 获取工具列表...');
    const tools = await client.listTools();
    console.log('✅ 工具列表:', tools);
    
    // 测试工具调用
    if (tools.tools && tools.tools.length > 0) {
      console.log('🔧 调用测试工具...');
      const result = await client.callTool({
        name: 'test_tool',
        arguments: { message: 'Hello MCP!' }
      });
      console.log('✅ 工具调用结果:', result);
    }
    
    await client.close();
    console.log('✅ 连接关闭');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
  }
}

testSimpleConnection();
