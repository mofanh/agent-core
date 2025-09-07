#!/usr/bin/env node

/**
 * 测试浏览器工具调用方式
 */

import { createBrowserToolSystem } from './lib/m.js';

async function testBrowserToolCalls() {
  console.log('=== 测试浏览器工具调用方式 ===');
  
  try {
    // 1. 测试直接使用浏览器工具系统
    console.log('📋 1. 测试直接浏览器工具系统...');
    const toolSystem = createBrowserToolSystem();
    
    console.log('toolSystem.toolManager methods:');
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(toolSystem.toolManager))
      .filter(method => typeof toolSystem.toolManager[method] === 'function');
    console.log('Available methods:', methods);
    
    // 检查是否有 executeTool 方法
    if (typeof toolSystem.toolManager.executeTool === 'function') {
      console.log('✅ toolManager.executeTool 方法存在');
    } else {
      console.log('❌ toolManager.executeTool 方法不存在');
      console.log('尝试查找替代方法...');
      
      if (typeof toolSystem.toolManager.executeLocalTool === 'function') {
        console.log('✅ 找到 toolManager.executeLocalTool 方法');
      }
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testBrowserToolCalls();
