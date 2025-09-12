#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMCPCall() {
  try {
    console.log('=== 测试 MCP 调用 ===');
    
    // 导入必要的模块
    const { startMCPBrowserServer } = await import('./src/mcp/browser-server.js');
    const { MCPClient } = await import('./src/mcp/client.js');
    
    // 启动 MCP 服务器
    console.log('🔧 启动 MCP 浏览器服务器...');
    await startMCPBrowserServer();
    
    // 创建客户端连接
    console.log('🔗 连接到 MCP 服务器...');
    const client = new MCPClient();
    
    console.log('🚀 初始化浏览器工具系统...');
    const { BrowserToolManager } = await import('./src/browser/tool-manager.js');
    const toolManager = new BrowserToolManager();
    await toolManager.initialize();
    
    // 测试工具调用
    console.log('📋 测试工具调用...');
    const result = await client.callTool('browser_navigate', {
      url: 'https://www.baidu.com'
    });
    
    console.log('✅ 工具调用成功:', result);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error(error.stack);
  }
}

testMCPCall().catch(console.error);
