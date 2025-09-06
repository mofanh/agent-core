/**
 * 测试 MCP 浏览器客户端
 */

import { MCPBrowserClient } from './lib/m.js';

async function testMCPClient() {
  console.log('🚀 测试 MCP 浏览器客户端...');
  
  try {
    // 创建客户端
    const client = new MCPBrowserClient({
      serverPath: '/Users/bojingli/self/project/agent/agent-core/bin/mcp-browser-server.js',
      timeout: 10000
    });
    
    console.log('📦 客户端已创建');
    
    // 连接到服务器
    await client.connect();
    console.log('🔗 已连接到 MCP 浏览器服务器');
    
    // 列出可用工具
    const tools = await client.listTools();
    console.log('🛠️ 可用工具:', tools.tools.map(t => t.name));
    
    // 测试导航功能
    console.log('🌐 测试导航功能...');
    const navResult = await client.navigate('https://example.com');
    console.log('导航结果:', navResult);
    
    // 测试获取当前 URL
    const currentUrl = await client.getCurrentUrl();
    console.log('当前 URL:', currentUrl);
    
    // 关闭客户端
    await client.disconnect();
    console.log('✅ MCP 客户端测试完成');
    
  } catch (error) {
    console.error('❌ MCP 客户端测试失败:', error);
  }
}

// 运行测试
testMCPClient();
