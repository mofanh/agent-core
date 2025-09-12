#!/usr/bin/env node
import { createBrowserToolSystem } from './src/browser/index.js';

console.log('测试 MCP 风格的浏览器工具系统...');

try {
  // 使用与 MCP 服务器相同的配置
  const config = {
    headless: process.env.HEADLESS !== 'false',
    devtools: process.env.DEVTOOLS === 'true',
    security: {
      allowedDomains: ['*'],
      blockedDomains: ['localhost', '127.0.0.1']
    }
  };
  
  console.log('配置:', JSON.stringify(config, null, 2));
  
  const toolSystem = createBrowserToolSystem(config);
  console.log('工具系统创建成功');
  
  await toolSystem.initialize();
  console.log('工具系统初始化成功');
  
  console.log('工具管理器状态:', {
    initialized: toolSystem.toolManager.isInitialized,
    browserInstance: !!toolSystem.toolManager.browserInstance,
    hasGetCurrentPage: toolSystem.toolManager.browserInstance && 
                      typeof toolSystem.toolManager.browserInstance.getCurrentPage === 'function'
  });
  
  // 测试工具调用
  const result = await toolSystem.toolManager.executeLocalTool('browser.navigate', {
    url: 'https://www.baidu.com'
  }, `test-mcp-${Date.now()}`);
  
  console.log('MCP 风格导航成功:', result);
  
  await toolSystem.cleanup();
  console.log('清理完成');
  
} catch (error) {
  console.error('测试失败:', error.message);
  console.error(error.stack);
  process.exit(1);
}
