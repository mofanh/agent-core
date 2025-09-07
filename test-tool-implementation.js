#!/usr/bin/env node

/**
 * 测试浏览器工具的调用方式 - MCP vs 本地
 */

import { MCPBrowserClient, createBrowserToolSystem } from './lib/m.js';

async function testBrowserToolImplementation() {
  console.log('=== 测试浏览器工具实现方式 ===');
  console.log('');
  
  // 1. 测试 MCP 方式调用
  console.log('🔧 1. 测试 MCP 浏览器客户端...');
  try {
    const mcpClient = new MCPBrowserClient({
      serverPath: './bin/mcp-browser-server.js'
    });
    
    await mcpClient.connect();
    console.log('✅ MCP 连接成功');
    
    // 尝试调用一个简单的工具
    console.log('📋 调用 browser_get_url 工具...');
    const mcpResult = await mcpClient.callTool('browser_get_url', {});
    console.log('✅ MCP 工具调用成功:', mcpResult?.success ? '成功' : '失败');
    console.log('   结果类型:', typeof mcpResult);
    
    await mcpClient.disconnect();
    console.log('🔌 MCP 断开连接');
    
  } catch (error) {
    console.log('❌ MCP 测试失败:', error.message);
  }
  
  console.log('');
  
  // 2. 测试直接本地调用
  console.log('🏠 2. 测试直接本地浏览器工具...');
  try {
    const toolSystem = createBrowserToolSystem();
    await toolSystem.initialize();
    console.log('✅ 本地工具系统初始化成功');
    
    // 尝试调用同样的工具
    console.log('📋 调用 executeLocalTool...');
    const localResult = await toolSystem.toolManager.executeLocalTool(
      'browser.get_url', 
      {}, 
      `local-${Date.now()}`
    );
    console.log('✅ 本地工具调用成功:', localResult?.success ? '成功' : '失败');
    console.log('   结果类型:', typeof localResult);
    
    await toolSystem.cleanup();
    console.log('🧹 本地工具系统清理完成');
    
  } catch (error) {
    console.log('❌ 本地测试失败:', error.message);
  }
  
  console.log('');
  console.log('📊 **结论分析**:');
  console.log('1. **MCP 方式**: 通过 MCPBrowserClient → MCP 服务器进程 → 本地工具实现');
  console.log('2. **直接方式**: 直接调用本地 BrowserToolManager.executeLocalTool');
  console.log('3. **MCP 服务器内部**: 实际上调用的是本地工具实现 (executeLocalTool)');
  console.log('4. **架构模式**: MCP 服务器是本地工具的 **代理层**，不是重新实现');
  console.log('');
  console.log('🎯 **当前实现方式**: MCP 请求 → 进程隔离 → 本地工具执行');
}

testBrowserToolImplementation();
