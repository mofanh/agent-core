#!/usr/bin/env node

/**
 * MCP 浏览器服务启动脚本
 * 
 * 启动独立的 MCP 浏览器服务器进程
 * 
 * 使用方法:
 * node mcp-browser-server.js
 * 
 * 环境变量:
 * - HEADLESS=false     显示浏览器窗口
 * - DEVTOOLS=true      启用开发者工具
 */

import { startMCPBrowserServer } from '../src/mcp/browser-server.js';

// 启动服务器
startMCPBrowserServer().catch(error => {
  console.error('❌ 启动 MCP 浏览器服务器失败:', error);
  process.exit(1);
});
