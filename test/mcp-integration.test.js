/**
 * MCP 集成测试
 * 
 * 测试 agent-core 的 MCP 功能集成
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { 
  AgentCore,
  createMCPAgent,
  createSmartAgent,
  createMCPSystem
} from '../src/index.js';

// Mock MCP server responses
const mockMCPServer = {
  initialize: jest.fn().mockResolvedValue({
    protocolVersion: '1.0',
    capabilities: {
      tools: {
        list: true
      }
    }
  }),
  listTools: jest.fn().mockResolvedValue({
    tools: [
      {
        name: 'test_tool',
        description: 'A test tool',
        inputSchema: {
          type: 'object',
          properties: {
            input: { type: 'string' }
          }
        }
      }
    ]
  }),
  callTool: jest.fn().mockResolvedValue({
    result: { output: 'test output' }
  })
};

describe('MCP 集成测试', () => {
  let agent;

  afterEach(async () => {
    if (agent && typeof agent.shutdown === 'function') {
      await agent.shutdown();
    }
  });

  describe('MCP 系统创建', () => {
    test('应该能够创建MCP系统', async () => {
      const mcpSystem = createMCPSystem({
        servers: [
          { name: 'test', transport: 'stdio', command: 'test-server' }
        ]
      });

      expect(mcpSystem).toBeDefined();
      expect(typeof mcpSystem.initialize).toBe('function');
      expect(typeof mcpSystem.callTool).toBe('function');
    });

    test('应该能够创建MCP代理', async () => {
      agent = await createMCPAgent({
        servers: [
          { name: 'test', transport: 'stdio', command: 'test-server' }
        ]
      });

      expect(agent).toBeDefined();
      expect(agent instanceof AgentCore).toBe(true);
      expect(typeof agent.callTool).toBe('function');
      expect(typeof agent.executeToolChain).toBe('function');
    });

    test('应该能够创建智能代理', async () => {
      agent = await createSmartAgent({
        llm: {
          provider: 'mock',
          options: {}
        },
        mcp: {
          servers: [
            { name: 'test', transport: 'stdio', command: 'test-server' }
          ]
        }
      });

      expect(agent).toBeDefined();
      expect(agent instanceof AgentCore).toBe(true);
      expect(typeof agent.execute).toBe('function');
    });
  });

  describe('MCP 工具调用', () => {
    beforeEach(async () => {
      agent = await createMCPAgent({
        servers: [
          { name: 'test', transport: 'stdio', command: 'test-server' }
        ]
      });
      
      // Mock the MCP system
      agent.mcpSystem.connectionManager.getConnection = jest.fn().mockResolvedValue({
        client: mockMCPServer,
        isHealthy: () => true
      });
    });

    test('应该能够获取可用工具', async () => {
      const tools = agent.getTools();
      expect(Array.isArray(tools)).toBe(true);
    });

    test('应该能够调用MCP工具', async () => {
      const result = await agent.callTool('test_tool', { input: 'test' });
      expect(result).toBeDefined();
      expect(mockMCPServer.callTool).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'tools/call',
          params: {
            name: 'test_tool',
            arguments: { input: 'test' }
          }
        })
      );
    });

    test('应该能够执行工具链', async () => {
      const toolChain = [
        {
          tool: 'test_tool',
          args: { input: 'step1' }
        },
        {
          tool: 'test_tool',
          args: (data, results) => ({ input: `step2_${results[0]?.output}` })
        }
      ];

      const result = await agent.executeToolChain(toolChain);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('任务执行', () => {
    beforeEach(async () => {
      agent = await createSmartAgent({
        llm: {
          provider: 'mock',
          options: {}
        },
        mcp: {
          servers: [
            { name: 'test', transport: 'stdio', command: 'test-server' }
          ]
        }
      });

      // Mock LLM responses
      agent.llm.generateResponse = jest.fn().mockResolvedValue({
        content: 'Mocked LLM response'
      });

      // Mock MCP system
      agent.mcpSystem.connectionManager.getConnection = jest.fn().mockResolvedValue({
        client: mockMCPServer,
        isHealthy: () => true
      });
    });

    test('应该能够执行MCP工具任务', async () => {
      const result = await agent.execute({
        type: 'mcp_tool',
        toolName: 'test_tool',
        args: { input: 'test' }
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    test('应该能够执行MCP工具链任务', async () => {
      const result = await agent.execute({
        type: 'mcp_chain',
        toolChain: [
          { tool: 'test_tool', args: { input: 'test1' } },
          { tool: 'test_tool', args: { input: 'test2' } }
        ]
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('应该能够执行混合任务', async () => {
      const result = await agent.execute({
        type: 'hybrid',
        initialPrompt: {
          messages: [
            { role: 'user', content: 'Test prompt' }
          ]
        },
        workflow: [
          {
            type: 'mcp_tool',
            name: 'toolStep',
            toolName: 'test_tool',
            args: { input: 'test' }
          },
          {
            type: 'llm',
            name: 'llmStep',
            prompt: (data) => ({
              messages: [
                { role: 'user', content: `Process: ${data.toolStep}` }
              ]
            })
          }
        ],
        finalPrompt: (data) => ({
          messages: [
            { role: 'user', content: `Final: ${data.llmStep}` }
          ]
        })
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('错误处理', () => {
    beforeEach(async () => {
      agent = await createMCPAgent({
        servers: [
          { name: 'test', transport: 'stdio', command: 'test-server' }
        ]
      });
    });

    test('应该处理工具调用错误', async () => {
      // Mock error response
      agent.mcpSystem.connectionManager.getConnection = jest.fn().mockResolvedValue({
        client: {
          ...mockMCPServer,
          callTool: jest.fn().mockRejectedValue(new Error('Tool call failed'))
        },
        isHealthy: () => true
      });

      await expect(agent.callTool('test_tool', { input: 'test' }))
        .rejects.toThrow('Tool call failed');
    });

    test('应该处理连接错误', async () => {
      // Mock connection failure
      agent.mcpSystem.connectionManager.getConnection = jest.fn().mockRejectedValue(
        new Error('No healthy connections available')
      );

      await expect(agent.callTool('test_tool', { input: 'test' }))
        .rejects.toThrow('No healthy connections available');
    });

    test('应该验证工具参数', async () => {
      // Mock tool with required parameters
      agent.mcpSystem.connectionManager.getConnection = jest.fn().mockResolvedValue({
        client: {
          ...mockMCPServer,
          listTools: jest.fn().mockResolvedValue({
            tools: [
              {
                name: 'strict_tool',
                description: 'A tool with required parameters',
                inputSchema: {
                  type: 'object',
                  properties: {
                    required_param: { type: 'string' }
                  },
                  required: ['required_param']
                }
              }
            ]
          })
        },
        isHealthy: () => true
      });

      await expect(agent.callTool('strict_tool', {}))
        .rejects.toThrow(/validation/i);
    });
  });

  describe('状态和监控', () => {
    beforeEach(async () => {
      agent = await createMCPAgent({
        servers: [
          { name: 'test', transport: 'stdio', command: 'test-server' }
        ]
      });
    });

    test('应该报告MCP状态', () => {
      const status = agent.getMCPStatus();
      expect(status).toBeDefined();
      expect(typeof status.healthy).toBe('boolean');
      expect(Array.isArray(status.connections)).toBe(true);
    });

    test('应该报告健康状态', async () => {
      const health = await agent.getHealth();
      expect(health).toBeDefined();
      expect(typeof health.status).toBe('string');
      expect(health.mcp).toBeDefined();
    });

    test('应该报告能力', async () => {
      const capabilities = await agent.getCapabilities();
      expect(capabilities).toBeDefined();
      expect(capabilities.mcp).toBeDefined();
      expect(Array.isArray(capabilities.mcp.tools)).toBe(true);
    });

    test('应该发出MCP事件', (done) => {
      let eventCount = 0;
      
      agent.on('mcpToolCalled', (event) => {
        expect(event.toolName).toBeDefined();
        eventCount++;
        if (eventCount === 1) done();
      });

      // Mock successful tool call
      agent.mcpSystem.connectionManager.getConnection = jest.fn().mockResolvedValue({
        client: mockMCPServer,
        isHealthy: () => true
      });

      agent.callTool('test_tool', { input: 'test' });
    });
  });

  describe('集成测试', () => {
    test('应该能够创建完整的代理并执行复杂工作流', async () => {
      agent = await createSmartAgent({
        llm: {
          provider: 'mock',
          options: {}
        },
        mcp: {
          servers: [
            { name: 'test', transport: 'stdio', command: 'test-server' }
          ]
        }
      });

      // Mock all dependencies
      agent.llm.generateResponse = jest.fn().mockResolvedValue({
        content: 'Mocked analysis result'
      });

      agent.mcpSystem.connectionManager.getConnection = jest.fn().mockResolvedValue({
        client: mockMCPServer,
        isHealthy: () => true
      });

      const result = await agent.execute({
        type: 'hybrid',
        initialPrompt: {
          messages: [
            { role: 'user', content: 'Analyze data' }
          ]
        },
        workflow: [
          {
            type: 'mcp_tool',
            name: 'getData',
            toolName: 'test_tool',
            args: { input: 'fetch data' }
          },
          {
            type: 'llm',
            name: 'analyze',
            prompt: (data) => ({
              messages: [
                { role: 'user', content: `Analyze: ${JSON.stringify(data.getData)}` }
              ]
            })
          }
        ],
        finalPrompt: (data) => ({
          messages: [
            { role: 'user', content: `Summarize: ${data.analyze}` }
          ]
        })
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(agent.llm.generateResponse).toHaveBeenCalledTimes(2); // analyze + final
      expect(mockMCPServer.callTool).toHaveBeenCalledTimes(1); // getData
    });
  });
});
