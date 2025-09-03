/**
 * Agent-Core MCP 集成使用示例
 * 
 * 本文件展示如何使用集成了MCP功能的agent-core
 */

import { 
  AgentCore,
  createMCPAgent,
  createSmartAgent,
  createPresetAgent,
  executeWorkflow,
  SMART_AGENT_PRESETS,
  TOOL_CHAIN_TEMPLATES
} from '../src/index.js';

// ============================================================================
// 示例1: 基础MCP工具调用
// ============================================================================

async function basicMCPExample() {
  console.log('\n=== 基础MCP工具调用示例 ===');
  
  const agent = await createMCPAgent({
    servers: [
      { 
        name: 'web', 
        transport: 'stdio', 
        command: 'web-mcp-server' // 假设的MCP服务器
      }
    ]
  });

  try {
    // 获取可用工具
    const tools = agent.getTools();
    console.log('可用工具:', tools.map(t => t.name));

    // 调用单个工具
    const pageResult = await agent.callTool('fetch_page', { 
      url: 'https://example.com' 
    });
    console.log('页面获取结果:', pageResult);

    // 执行工具链
    const chainResult = await agent.executeToolChain([
      {
        tool: 'fetch_page',
        args: { url: 'https://example.com' }
      },
      {
        tool: 'extract_text',
        dataMapping: (data, results) => ({ 
          html: results[0]?.data?.content 
        })
      }
    ]);
    console.log('工具链执行结果:', chainResult);

  } catch (error) {
    console.error('MCP调用失败:', error.message);
  } finally {
    await agent.shutdown();
  }
}

// ============================================================================
// 示例2: LLM + MCP 混合任务
// ============================================================================

async function hybridTaskExample() {
  console.log('\n=== LLM + MCP 混合任务示例 ===');
  
  const agent = await createSmartAgent({
    llm: {
      provider: 'openai',
      options: { 
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4'
      }
    },
    mcp: {
      servers: [
        { name: 'web', transport: 'stdio', command: 'web-mcp-server' },
        { name: 'file', transport: 'stdio', command: 'file-mcp-server' }
      ]
    }
  });

  try {
    const result = await agent.execute({
      type: 'hybrid',
      initialPrompt: {
        messages: [
          { role: 'user', content: '请分析网站 https://example.com 并总结其主要内容' }
        ]
      },
      workflow: [
        {
          type: 'mcp_tool',
          name: 'fetchPage',
          toolName: 'fetch_page',
          args: { url: 'https://example.com' }
        },
        {
          type: 'mcp_tool',
          name: 'extractText',
          toolName: 'extract_text',
          args: (data) => ({ html: data.fetchPage?.content })
        },
        {
          type: 'llm',
          name: 'analysis',
          prompt: (data) => ({
            messages: [
              { 
                role: 'system', 
                content: '你是一个网页内容分析专家。请分析以下网页文本并提供结构化总结。' 
              },
              { 
                role: 'user', 
                content: `请分析以下网页内容：\n\n${data.extractText?.text}` 
              }
            ]
          })
        }
      ],
      finalPrompt: (data) => ({
        messages: [
          { 
            role: 'system', 
            content: '请基于之前的分析结果，提供一个简洁的最终总结。' 
          },
          { 
            role: 'user', 
            content: `分析结果：${data.analysis}，请提供最终总结。` 
          }
        ]
      })
    });

    console.log('混合任务结果:', result);

  } catch (error) {
    console.error('混合任务失败:', error.message);
  } finally {
    await agent.shutdown();
  }
}

// ============================================================================
// 示例3: 使用预设代理
// ============================================================================

async function presetAgentExample() {
  console.log('\n=== 预设代理示例 ===');
  
  // 创建网页操作代理
  const webAgent = await createPresetAgent('webAgent');

  try {
    // 执行网页分析任务
    const result = await webAgent.execute({
      type: 'mcp_chain',
      toolChain: TOOL_CHAIN_TEMPLATES.WEB_ANALYSIS,
      initialData: { url: 'https://example.com' }
    });

    console.log('网页分析结果:', result);

    // 获取代理状态
    const status = webAgent.getMCPStatus();
    console.log('MCP系统状态:', status);

  } catch (error) {
    console.error('预设代理执行失败:', error.message);
  } finally {
    await webAgent.shutdown();
  }
}

// ============================================================================
// 示例4: 复杂工作流执行
// ============================================================================

async function complexWorkflowExample() {
  console.log('\n=== 复杂工作流执行示例 ===');
  
  const workflowDefinition = {
    id: 'web-research-workflow',
    name: '网页研究工作流',
    initialPrompt: {
      messages: [
        { 
          role: 'system', 
          content: '你是一个研究助手，需要收集和分析网页信息。' 
        },
        { 
          role: 'user', 
          content: '请研究网站列表中的内容，并生成研究报告。' 
        }
      ]
    },
    steps: [
      {
        type: 'mcp_tool',
        name: 'fetchSite1',
        toolName: 'fetch_page',
        args: { url: 'https://example1.com' }
      },
      {
        type: 'mcp_tool',
        name: 'fetchSite2',
        toolName: 'fetch_page',
        args: { url: 'https://example2.com' }
      },
      {
        type: 'mcp_tool',
        name: 'extractText1',
        toolName: 'extract_text',
        args: (data) => ({ html: data.fetchSite1?.content })
      },
      {
        type: 'mcp_tool',
        name: 'extractText2',
        toolName: 'extract_text',
        args: (data) => ({ html: data.fetchSite2?.content })
      },
      {
        type: 'llm',
        name: 'compareContent',
        prompt: (data) => ({
          messages: [
            { 
              role: 'system', 
              content: '比较以下两个网站的内容，找出相似点和差异。' 
            },
            { 
              role: 'user', 
              content: `网站1内容：${data.extractText1?.text}\n\n网站2内容：${data.extractText2?.text}` 
            }
          ]
        })
      },
      {
        type: 'mcp_tool',
        name: 'saveReport',
        toolName: 'write_file',
        args: (data) => ({
          path: '/tmp/research_report.md',
          content: `# 研究报告\n\n${data.compareContent}`
        })
      }
    ],
    finalPrompt: (data) => ({
      messages: [
        { 
          role: 'system', 
          content: '基于研究结果，生成执行摘要。' 
        },
        { 
          role: 'user', 
          content: `研究已完成，比较结果：${data.compareContent}。请生成执行摘要。` 
        }
      ]
    })
  };

  try {
    const result = await executeWorkflow(workflowDefinition, {
      agentPreset: 'universalAgent',
      timeout: 120000 // 2分钟超时
    });

    console.log('工作流执行结果:', result);

  } catch (error) {
    console.error('工作流执行失败:', error.message);
  }
}

// ============================================================================
// 示例5: 实时监控和事件处理
// ============================================================================

async function monitoringExample() {
  console.log('\n=== 实时监控和事件处理示例 ===');
  
  const agent = await createSmartAgent({
    mcp: {
      servers: [
        { name: 'web', transport: 'stdio', command: 'web-mcp-server' }
      ]
    }
  });

  // 监听MCP事件
  agent.on('mcpConnectionChanged', ({ name, status }) => {
    console.log(`MCP连接 ${name} 状态变更: ${status}`);
  });

  agent.on('mcpToolCalled', (event) => {
    console.log(`工具调用: ${event.toolName}, 连接: ${event.connection}`);
  });

  try {
    // 执行一些任务并观察事件
    await agent.callTool('fetch_page', { url: 'https://example.com' });
    
    // 获取健康状态
    const health = await agent.getHealth();
    console.log('代理健康状态:', health);

    // 获取能力信息
    const capabilities = await agent.getCapabilities();
    console.log('代理能力:', capabilities);

  } catch (error) {
    console.error('监控示例失败:', error.message);
  } finally {
    await agent.shutdown();
  }
}

// ============================================================================
// 主程序
// ============================================================================

async function main() {
  console.log('Agent-Core MCP 集成示例');
  console.log('================================');

  try {
    // 运行各个示例
    await basicMCPExample();
    await hybridTaskExample();
    await presetAgentExample();
    await complexWorkflowExample();
    await monitoringExample();

  } catch (error) {
    console.error('示例执行失败:', error);
  }

  console.log('\n所有示例执行完成！');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  basicMCPExample,
  hybridTaskExample,
  presetAgentExample,
  complexWorkflowExample,
  monitoringExample
};
