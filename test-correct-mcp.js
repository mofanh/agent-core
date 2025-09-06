/**
 * 正确的 MCP 浏览器客户端测试 - 使用 StdioClientTransport 的正确方式
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testCorrectMCPClient() {
  console.log('🚀 测试正确的 MCP 浏览器客户端...');
  
  try {
    // 创建传输层 - StdioClientTransport 会自动启动服务器进程
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['/Users/bojingli/self/project/agent/agent-core/bin/mcp-browser-server.js']
    });
    
    // 创建客户端
    const client = new Client(
      {
        name: 'browser-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );
    
    // 连接
    console.log('🔗 连接到服务器...');
    await client.connect(transport);
    console.log('✅ 已连接到 MCP 浏览器服务器');
    
    // 列出可用工具
    const tools = await client.listTools();
    console.log('🛠️ 可用工具:', tools.tools.map(t => t.name));
    
    // 测试导航功能
    console.log('🌐 测试导航功能...');
    const navResult = await client.callTool({
      name: 'browser_navigate',
      arguments: { url: 'https://example.com' }
    });
    console.log('导航结果:', navResult);
    
    // 关闭
    await client.close();
    console.log('✅ 测试完成');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testCorrectMCPClient();
