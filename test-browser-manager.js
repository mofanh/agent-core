#!/usr/bin/env node
import { BrowserToolManager } from './src/browser/tool-manager.js';

console.log('测试浏览器工具管理器...');

try {
  const manager = new BrowserToolManager({
    enabled: true,
    engine: 'puppeteer',
    headless: true,
    instancePool: {
      enabled: false
    }
  });
  
  console.log('管理器创建成功');
  
  await manager.initialize();
  console.log('管理器初始化成功');
  
  const result = await manager.executeLocalTool('navigate', {
    url: 'https://www.baidu.com'
  }, 'test-001');
  
  console.log('导航成功:', result);
  
  await manager.destroy();
  console.log('管理器销毁成功');
  
} catch (error) {
  console.error('测试失败:', error.message);
  console.error(error.stack);
  process.exit(1);
}
