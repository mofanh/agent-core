/**
 * MCP集成后的Agent完整运行流程演示
 * 使用真实的Spark LLM + 模拟MCP服务器
 */

import { 
  createSmartAgent, 
  createMCPAgent,
  AgentCore 
} from '../src/index.js';

// 使用你提供的真实Spark请求处理器
async function* sparkStreamRequest(payload) {
  console.log('🔥 Spark LLM 调用开始:', {
    model: payload.model,
    messagesCount: payload.messages?.length,
    temperature: payload.temperature
  });
  
  const apiKey = process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau';
  const url = 'https://spark-api-open.xf-yun.com/v1/chat/completions';
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.body) throw new Error('No response body');
  
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let chunkCount = 0;
  
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop();
    
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (data === '[DONE]') {
          console.log('🔥 Spark LLM 流式响应完成，共', chunkCount, '个chunk');
          return;
        }
        try {
          chunkCount++;
          const parsed = JSON.parse(data);
          if (chunkCount % 5 === 0) {
            console.log(`🔥 Spark LLM chunk ${chunkCount}:`, parsed.choices?.[0]?.delta?.content || '...');
          }
          yield parsed;
        } catch {}
      }
    }
  }
}

// 模拟MCP工具服务器
class MockMCPToolServer {
  constructor(name) {
    this.name = name;
    this.tools = [
      {
        name: 'fetch_webpage',
        description: '获取网页内容',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: '网页URL' }
          },
          required: ['url']
        }
      },
      {
        name: 'analyze_data',
        description: '分析数据',
        inputSchema: {
          type: 'object',
          properties: {
            data: { type: 'string', description: '要分析的数据' },
            type: { type: 'string', description: '分析类型' }
          },
          required: ['data']
        }
      },
      {
        name: 'save_result',
        description: '保存结果',
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: '要保存的内容' },
            filename: { type: 'string', description: '文件名' }
          },
          required: ['content', 'filename']
        }
      }
    ];
  }

  async callTool(toolName, args) {
    console.log(`🔧 MCP工具调用 [${this.name}] ${toolName}:`, args);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    switch (toolName) {
      case 'fetch_webpage':
        return {
          content: `trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}

impl Human {
    fn fly(&self) {
        println!("*waving arms furiously*");
    }
}
<html><head><title>${args.url}</title></head><body><h1>示例网页</h1><p>这是从${args.url}获取的模拟内容。包含一些重要信息和数据。</p></body></html>`,
          status: 'success',
          url: args.url,
          timestamp: new Date().toISOString()
        };
      
      case 'analyze_data':
        return {
          analysis: `对数据进行了${args.type || '基础'}分析`,
          summary: `数据长度: ${args.data.length}字符，包含关键信息`,
          insights: ['数据质量良好', '包含结构化信息', '适合进一步处理'],
          confidence: 0.85,
          timestamp: new Date().toISOString()
        };
      
      case 'save_result':
        return {
          saved: true,
          filename: args.filename,
          path: `/tmp/${args.filename}`,
          size: args.content.length,
          timestamp: new Date().toISOString()
        };
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  getTools() {
    return this.tools;
  }
}

// 创建模拟的MCP系统
function createMockMCPSystem() {
  const servers = {
    'web-server': new MockMCPToolServer('web-server'),
    'data-server': new MockMCPToolServer('data-server')
  };

  return {
    async initialize() {
      console.log('🔌 模拟MCP系统初始化完成');
    },

    async callTool(toolName, args, options = {}) {
      const serverName = options.server || 'web-server';
      const server = servers[serverName];
      if (!server) {
        throw new Error(`MCP服务器 ${serverName} 不存在`);
      }
      
      const result = await server.callTool(toolName, args);
      console.log(`✅ MCP工具调用完成 [${serverName}/${toolName}]`);
      return result;
    },

    getTools() {
      const allTools = [];
      for (const [serverName, server] of Object.entries(servers)) {
        const tools = server.getTools().map(tool => ({
          ...tool,
          server: serverName
        }));
        allTools.push(...tools);
      }
      return allTools;
    },

    getStatus() {
      return {
        healthy: true,
        connections: Object.keys(servers),
        totalConnections: Object.keys(servers).length,
        readyConnections: Object.keys(servers).length,
        tools: {
          totalTools: this.getTools().length
        }
      };
    },

    async shutdown() {
      console.log('🔌 模拟MCP系统关闭');
    }
  };
}

// 演示1: 纯MCP工具调用流程
async function demonstrateMCPToolFlow() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 演示1: 纯MCP工具调用流程');
  console.log('='.repeat(60));

  const mcpSystem = createMockMCPSystem();
  await mcpSystem.initialize();

  console.log('\n🚀 步骤1: 获取可用工具');
  const tools = mcpSystem.getTools();
  console.log('可用工具:', tools.map(t => `${t.server}/${t.name}`));

  console.log('\n🚀 步骤2: 调用网页获取工具');
  const webContent = await mcpSystem.callTool('fetch_webpage', {
    url: 'https://example.com/news'
  }, { server: 'web-server' });

  console.log('\n🚀 步骤3: 调用数据分析工具');
  const analysis = await mcpSystem.callTool('analyze_data', {
    data: webContent.content,
    type: '内容分析'
  }, { server: 'data-server' });

  console.log('\n🚀 步骤4: 保存分析结果');
  const saveResult = await mcpSystem.callTool('save_result', {
    content: JSON.stringify(analysis, null, 2),
    filename: 'analysis_result.json'
  });

  console.log('\n✅ 纯MCP工具链执行完成');
  console.log('最终结果:', {
    webContentLength: webContent.content.length,
    analysisInsights: analysis.insights.length,
    savedFile: saveResult.filename
  });

  await mcpSystem.shutdown();
}

// 演示2: LLM + MCP 混合工作流
async function demonstrateHybridFlow() {
  console.log('\n' + '='.repeat(60));
  console.log('🧠 演示2: LLM + MCP 混合工作流');
  console.log('='.repeat(60));

  // 创建一个包含LLM和MCP的智能代理
  const agent = new AgentCore({
    llm: {
      requestHandler: sparkStreamRequest,
      provider: 'spark',
      options: {
        apiKey: process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau',
        model: '4.0Ultra'
      }
    }
  });

  // 手动集成模拟MCP系统
  agent.mcpSystem = createMockMCPSystem();
  await agent.initialize();
  await agent.mcpSystem.initialize();

  console.log('\n🚀 步骤1: MCP获取数据');
  const webData = await agent.mcpSystem.callTool('fetch_webpage', {
    url: 'https://tech-news.com/ai-breakthrough'
  });

  console.log('\n🚀 步骤2: LLM分析数据');
  const llmTask = {
    type: 'llm',
    payload: {
      model: '4.0Ultra',
      messages: [
        {
          role: 'system',
          content: '你是一个技术新闻分析专家。请分析以下网页内容并提供见解。'
        },
        {
          role: 'user',
          content: `请分析这个网页内容，并提供关键见解：\n\n${webData.content.substring(0, 500)}...`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    }
  };

  console.log('🧠 开始LLM分析...');
  const llmResult = await agent.execute(llmTask);

  // 收集LLM流式响应
  let llmAnalysis = '';
  let chunkCount = 0;
  try {
    for await (const chunk of llmResult) {
      chunkCount++;
      if (chunk.choices?.[0]?.delta?.content) {
        llmAnalysis += chunk.choices[0].delta.content;
      }
      if (chunkCount % 3 === 0) {
        console.log(`🧠 LLM分析进行中... (${chunkCount} chunks)`);
      }
    }
  } catch (error) {
    console.log('⚠️ LLM流处理完成:', error.message);
  }

  console.log('\n🚀 步骤3: MCP保存LLM分析结果');
  const saveResult = await agent.mcpSystem.callTool('save_result', {
    content: llmAnalysis,
    filename: 'llm_analysis.txt'
  });

  console.log('\n🚀 步骤4: MCP对LLM结果进行二次分析');
  const finalAnalysis = await agent.mcpSystem.callTool('analyze_data', {
    data: llmAnalysis,
    type: 'LLM输出质量分析'
  });

  console.log('\n✅ 混合工作流执行完成');
  console.log('流程总结:', {
    原始数据长度: webData.content.length,
    LLM分析长度: llmAnalysis.length,
    LLM处理块数: chunkCount,
    保存文件: saveResult.filename,
    最终分析置信度: finalAnalysis.confidence,
    关键见解: finalAnalysis.insights
  });

  // 安全的关闭处理
  try {
    if (agent && typeof agent.shutdown === 'function') {
      await agent.shutdown();
    }
  } catch (error) {
    console.log('⚠️ Agent关闭时出现错误:', error.message);
  }
  
  try {
    if (agent.mcpSystem && typeof agent.mcpSystem.shutdown === 'function') {
      await agent.mcpSystem.shutdown();
    }
  } catch (error) {
    console.log('⚠️ MCP系统关闭时出现错误:', error.message);
  }
}

// 演示3: 复杂的多步骤工作流
async function demonstrateComplexWorkflow() {
  console.log('\n' + '='.repeat(60));
  console.log('🔄 演示3: 复杂多步骤工作流');
  console.log('='.repeat(60));

  const agent = new AgentCore({
    llm: {
      requestHandler: sparkStreamRequest,
      provider: 'spark',
      options: {
        apiKey: process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau',
        model: '4.0Ultra'
      }
    }
  });

  agent.mcpSystem = createMockMCPSystem();
  await agent.initialize();
  await agent.mcpSystem.initialize();

  // 模拟复杂业务场景：网站内容分析和报告生成
  const workflow = [
    {
      name: '数据收集',
      type: 'mcp',
      action: async () => {
        console.log('\n📊 阶段1: 数据收集');
        const sites = [
          'https://tech-blog.com/latest',
          'https://news-site.com/tech',
          'https://industry-report.com/trends'
        ];

        const results = [];
        for (const site of sites) {
          const data = await agent.mcpSystem.callTool('fetch_webpage', { url: site });
          results.push({ url: site, data: data.content });
        }
        return results;
      }
    },
    {
      name: 'LLM预处理',
      type: 'llm',
      action: async (inputData) => {
        console.log('\n🧠 阶段2: LLM预处理');
        
        const combinedContent = inputData.map(item => 
          `来源: ${item.url}\n内容摘要: ${item.data.substring(0, 200)}...`
        ).join('\n\n');

        const task = {
          type: 'llm',
          payload: {
            model: '4.0Ultra',
            messages: [
              {
                role: 'system',
                content: '你是一个内容预处理专家。请对以下多个网站内容进行预处理，提取关键信息。'
              },
              {
                role: 'user',
                content: `请对以下内容进行预处理和关键信息提取：\n\n${combinedContent}`
              }
            ],
            temperature: 0.3,
            max_tokens: 300,
            stream: true
          }
        };

        const result = await agent.execute(task);
        let processed = '';
        for await (const chunk of result) {
          if (chunk.choices?.[0]?.delta?.content) {
            processed += chunk.choices[0].delta.content;
          }
        }
        return { originalData: inputData, processedSummary: processed };
      }
    },
    {
      name: 'MCP深度分析',
      type: 'mcp',
      action: async (inputData) => {
        console.log('\n🔍 阶段3: MCP深度分析');
        
        const analysis = await agent.mcpSystem.callTool('analyze_data', {
          data: inputData.processedSummary,
          type: '深度内容分析'
        });
        
        return {
          ...inputData,
          deepAnalysis: analysis
        };
      }
    },
    {
      name: 'LLM报告生成',
      type: 'llm',
      action: async (inputData) => {
        console.log('\n📝 阶段4: LLM报告生成');
        
        const task = {
          type: 'llm',
          payload: {
            model: '4.0Ultra',
            messages: [
              {
                role: 'system',
                content: '你是一个专业的报告生成专家。基于分析结果生成结构化报告。'
              },
              {
                role: 'user',
                content: `基于以下分析结果，生成一份专业报告：\n\n预处理摘要: ${inputData.processedSummary}\n\n深度分析: ${JSON.stringify(inputData.deepAnalysis, null, 2)}`
              }
            ],
            temperature: 0.5,
            max_tokens: 400,
            stream: true
          }
        };

        const result = await agent.execute(task);
        let report = '';
        for await (const chunk of result) {
          if (chunk.choices?.[0]?.delta?.content) {
            report += chunk.choices[0].delta.content;
          }
        }
        
        return {
          ...inputData,
          finalReport: report
        };
      }
    },
    {
      name: '结果保存',
      type: 'mcp',
      action: async (inputData) => {
        console.log('\n💾 阶段5: 结果保存');
        
        const saveResult = await agent.mcpSystem.callTool('save_result', {
          content: JSON.stringify({
            originalSources: inputData.originalData.length,
            processedSummary: inputData.processedSummary,
            deepAnalysis: inputData.deepAnalysis,
            finalReport: inputData.finalReport,
            timestamp: new Date().toISOString()
          }, null, 2),
          filename: 'complex_workflow_result.json'
        });
        
        return {
          ...inputData,
          saved: saveResult
        };
      }
    }
  ];

  // 执行复杂工作流
  let workflowData = null;
  for (const [index, step] of workflow.entries()) {
    console.log(`\n⏱️  执行步骤 ${index + 1}/${workflow.length}: ${step.name}`);
    const stepStart = Date.now();
    
    try {
      workflowData = await step.action(workflowData);
      const stepDuration = Date.now() - stepStart;
      console.log(`✅ 步骤 "${step.name}" 完成 (耗时: ${stepDuration}ms)`);
    } catch (error) {
      console.error(`❌ 步骤 "${step.name}" 失败:`, error.message);
      break;
    }
  }

  console.log('\n🎉 复杂工作流执行完成');
  console.log('最终结果总览:', {
    数据源数量: workflowData?.originalData?.length || 0,
    预处理摘要长度: workflowData?.processedSummary?.length || 0,
    分析置信度: workflowData?.deepAnalysis?.confidence || 0,
    最终报告长度: workflowData?.finalReport?.length || 0,
    保存文件: workflowData?.saved?.filename || 'none'
  });

  // 安全的关闭处理
  try {
    if (agent && typeof agent.shutdown === 'function') {
      await agent.shutdown();
    }
  } catch (error) {
    console.log('⚠️ Agent关闭时出现错误:', error.message);
  }
  
  try {
    if (agent.mcpSystem && typeof agent.mcpSystem.shutdown === 'function') {
      await agent.mcpSystem.shutdown();
    }
  } catch (error) {
    console.log('⚠️ MCP系统关闭时出现错误:', error.message);
  }
}

// 主程序
async function main() {
  console.log('🚀 MCP集成后的Agent完整运行流程演示');
  console.log('基于真实Spark LLM + 模拟MCP服务器');
  console.log('演示时间:', new Date().toLocaleString());

  try {
    // 演示1: 纯MCP工具调用
    await demonstrateMCPToolFlow();
    
    // 等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 演示2: LLM + MCP 混合工作流
    await demonstrateHybridFlow();
    
    // 等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 演示3: 复杂多步骤工作流
    await demonstrateComplexWorkflow();

  } catch (error) {
    console.error('\n❌ 演示过程中出现错误:', error.message);
    console.error('错误详情:', error.stack);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 所有演示完成！');
  console.log('='.repeat(60));
  console.log('\n📋 运行流程总结:');
  console.log('1. 纯MCP工具调用: MCP服务器直接提供外部服务能力');
  console.log('2. LLM+MCP混合: 结合AI推理和外部工具的强大能力'); 
  console.log('3. 复杂工作流: 多步骤协调，展现完整业务场景');
  console.log('\n✨ agent-core现在具备了真正的外部服务集成能力！');
}

// 运行演示
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  demonstrateMCPToolFlow,
  demonstrateHybridFlow,
  demonstrateComplexWorkflow,
  sparkStreamRequest
};
