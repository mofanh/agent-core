#!/usr/bin/env node

import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

console.log('=== MCP ListToolsRequestSchema 分析 ===');
console.log('ListToolsRequestSchema:', JSON.stringify(ListToolsRequestSchema, null, 2));

// 让我们也检查一下正确的响应格式
console.log('\n=== 检查官方文档或示例 ===');
console.log('根据 MCP 规范，listTools 响应应该是:');
console.log(`{
  "tools": [
    {
      "name": "tool_name",
      "description": "tool description", 
      "inputSchema": { ... }
    }
  ]
}`);
