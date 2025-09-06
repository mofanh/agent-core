#!/usr/bin/env node

/**
 * 简单的 MCP 服务器测试 - 检查是否是我们的实现问题
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'simple-test-server',
    version: '1.0.0',
    description: '简单的测试服务器'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 最简单的工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error('📋 收到 listTools 请求');
  
  const response = {
    tools: [
      {
        name: 'test_tool',
        description: '测试工具',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: '测试消息'
            }
          },
          required: ['message']
        }
      }
    ]
  };
  
  console.error('📋 返回工具列表:', JSON.stringify(response, null, 2));
  return response;
});

// 工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error('🔧 收到工具调用:', request.params);
  
  return {
    content: [
      {
        type: 'text',
        text: `测试工具执行成功: ${JSON.stringify(request.params)}`
      }
    ]
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 简单测试服务器已启动');
}

main().catch(console.error);
