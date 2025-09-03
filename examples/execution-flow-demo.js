/**
 * MCP集成后Agent运行流程演示
 * 
 * 这个示例展示了从用户请求到最终结果的完整执行过程
 */

import { createSmartAgent } from '../src/index.js';

// 模拟一个完整的执行流程演示
async function demonstrateAgentFlow() {
  console.log('🚀 开始演示MCP集成后的Agent运行流程\n');

  // ============================================================================
  // 阶段1: Agent初始化
  // ============================================================================
  console.log('📋 阶段1: Agent初始化');
  console.log('   1.1 创建AgentCore实例...');
  console.log('   1.2 初始化LLM组件...');
  console.log('   1.3 初始化MCP系统...');
  console.log('   1.4 建立MCP服务器连接...');
  console.log('   1.5 发现可用工具...');
  
  const agent = await createSmartAgent({
    llm: {
      provider: 'mock', // 使用模拟LLM进行演示
      options: {}
    },
    mcp: {
      servers: [
        { name: 'web', transport: 'stdio', command: 'mock-web-server' },
        { name: 'file', transport: 'http', url: 'http://localhost:3000' }
      ],
      loadBalancing: 'round-robin',
      healthCheckInterval: 30000
    }
  });
  
  console.log('   ✅ Agent初始化完成\n');

  // ============================================================================
  // 阶段2: 任务执行 - 混合工作流演示
  // ============================================================================
  console.log('📋 阶段2: 执行混合任务');
  
  const hybridTask = {
    type: 'hybrid',
    initialPrompt: {
      messages: [
        { role: 'system', content: '你是一个网页分析专家' },
        { role: 'user', content: '我需要分析一个网站的内容并生成报告' }
      ]
    },
    workflow: [
      // 步骤1: 获取网页内容 (MCP工具调用)
      {
        type: 'mcp_tool',
        name: 'fetchPage',
        toolName: 'fetch_page',
        args: { url: 'https://example.com' }
      },
      
      // 步骤2: 提取文本内容 (MCP工具调用)
      {
        type: 'mcp_tool', 
        name: 'extractText',
        toolName: 'extract_text',
        args: (data) => ({ 
          html: data.fetchPage?.content || '' 
        })
      },
      
      // 步骤3: LLM分析内容
      {
        type: 'llm',
        name: 'analyzeContent',
        prompt: (data) => ({
          messages: [
            { 
              role: 'system', 
              content: '请分析以下网页文本内容，提取关键信息和主题' 
            },
            { 
              role: 'user', 
              content: `网页文本内容：\n${data.extractText?.text || '无内容'}` 
            }
          ]
        })
      },
      
      // 步骤4: 保存分析报告 (MCP工具调用)
      {
        type: 'mcp_tool',
        name: 'saveReport',
        toolName: 'write_file', 
        args: (data) => ({
          path: '/tmp/website_analysis_report.md',
          content: `# 网站分析报告\n\n## 原始内容\n${data.extractText?.text}\n\n## AI分析结果\n${data.analyzeContent}`
        })
      }
    ],
    finalPrompt: (data) => ({
      messages: [
        { 
          role: 'system', 
          content: '基于分析结果，生成一个简洁的执行摘要' 
        },
        { 
          role: 'user', 
          content: `请为以下分析生成摘要：\n${data.analyzeContent}` 
        }
      ]
    })
  };

  console.log('   🔄 开始执行混合工作流...');
  
  // 演示执行流程的各个步骤
  await demonstrateExecutionSteps(agent, hybridTask);
  
  console.log('   ✅ 混合任务执行完成\n');

  // ============================================================================
  // 阶段3: 系统监控和状态检查
  // ============================================================================
  console.log('📋 阶段3: 系统监控');
  
  // 3.1 检查MCP系统状态
  console.log('   3.1 MCP系统状态:');
  try {
    const mcpStatus = agent.getMCPStatus();
    console.log('      - 系统健康:', mcpStatus.healthy ? '✅' : '❌');
    console.log('      - 总连接数:', mcpStatus.totalConnections || 0);
    console.log('      - 就绪连接数:', mcpStatus.readyConnections || 0);
    console.log('      - 可用工具数:', mcpStatus.tools?.totalTools || 0);
  } catch (error) {
    console.log('      - MCP状态检查失败:', error.message);
  }
  
  // 3.2 检查整体健康状态
  console.log('   3.2 Agent整体健康状态:');
  try {
    const health = await agent.getHealth();
    console.log('      - 状态:', health.status);
    console.log('      - LLM状态:', health.llm?.status || 'N/A');
    console.log('      - MCP状态:', health.mcp?.status || 'N/A');
  } catch (error) {
    console.log('      - 健康检查失败:', error.message);
  }
  
  // 3.3 检查系统能力
  console.log('   3.3 系统能力:');
  try {
    const capabilities = await agent.getCapabilities();
    console.log('      - LLM能力:', capabilities.llm ? '✅' : '❌');
    console.log('      - MCP能力:', capabilities.mcp ? '✅' : '❌');
    console.log('      - 工作流能力:', capabilities.workflow ? '✅' : '❌');
  } catch (error) {
    console.log('      - 能力检查失败:', error.message);
  }

  console.log('   ✅ 系统监控完成\n');

  // ============================================================================
  // 阶段4: 清理和关闭
  // ============================================================================
  console.log('📋 阶段4: 清理资源');
  console.log('   4.1 关闭MCP连接...');
  console.log('   4.2 清理系统资源...');
  
  await agent.shutdown();
  
  console.log('   ✅ 资源清理完成\n');
  
  console.log('🎉 Agent运行流程演示完成！');
}

/**
 * 演示任务执行的各个步骤
 */
async function demonstrateExecutionSteps(agent, task) {
  console.log('      📝 任务类型:', task.type);
  console.log('      📝 工作流步骤数:', task.workflow.length);
  
  console.log('\n      🔄 执行流程追踪:');
  
  // 步骤1: 初始Prompt处理
  if (task.initialPrompt) {
    console.log('         1️⃣ 处理初始Prompt...');
    console.log('            → 发送到LLM:', task.initialPrompt.messages[0].content.substring(0, 50) + '...');
  }
  
  // 步骤2: 工作流步骤执行
  task.workflow.forEach((step, index) => {
    console.log(`         ${index + 2}️⃣ 执行步骤 "${step.name}" (${step.type}):`);
    
    if (step.type === 'mcp_tool') {
      console.log(`            → 调用MCP工具: ${step.toolName}`);
      console.log(`            → 参数准备: ${typeof step.args === 'function' ? '动态生成' : '静态参数'}`);
      console.log(`            → 连接选择: 负载均衡策略`);
      console.log(`            → 发送JSON-RPC请求`);
      console.log(`            → 等待MCP服务器响应`);
      console.log(`            → 结果验证和处理`);
    } else if (step.type === 'llm') {
      console.log(`            → 构建Prompt: ${typeof step.prompt === 'function' ? '动态生成' : '静态Prompt'}`);
      console.log(`            → 发送到LLM提供商`);
      console.log(`            → 等待AI生成响应`);
      console.log(`            → 响应处理和验证`);
    }
    
    console.log(`            → 结果存储到: executionData.${step.name}`);
  });
  
  // 步骤3: 最终Prompt处理
  if (task.finalPrompt) {
    console.log(`         ${task.workflow.length + 2}️⃣ 处理最终Prompt...`);
    console.log('            → 基于所有执行数据生成最终Prompt');
    console.log('            → 发送到LLM生成最终结果');
  }
  
  console.log('\n      📊 执行结果:');
  console.log('         ✅ 所有步骤执行成功');
  console.log('         📈 执行数据已收集');
  console.log('         🎯 最终结果已生成');
}

/**
 * 演示事件监听
 */
function setupEventListeners(agent) {
  console.log('📡 设置事件监听器...');
  
  // MCP连接状态变化
  agent.on('mcpConnectionChanged', ({ name, status }) => {
    console.log(`   🔌 MCP连接状态变化: ${name} → ${status}`);
  });
  
  // MCP工具调用
  agent.on('mcpToolCalled', ({ toolName, connection, duration, success }) => {
    const statusIcon = success ? '✅' : '❌';
    console.log(`   🔧 MCP工具调用: ${toolName} [${connection}] ${duration}ms ${statusIcon}`);
  });
  
  // 任务开始
  agent.on('taskStarted', ({ type, taskId }) => {
    console.log(`   🚀 任务开始: ${type} [${taskId}]`);
  });
  
  // 任务完成
  agent.on('taskCompleted', ({ type, taskId, success, duration }) => {
    const statusIcon = success ? '✅' : '❌';
    console.log(`   🏁 任务完成: ${type} [${taskId}] ${duration}ms ${statusIcon}`);
  });
  
  // LLM调用
  agent.on('llmCalled', ({ provider, model, tokenCount, duration }) => {
    console.log(`   🧠 LLM调用: ${provider}/${model} ${tokenCount}tokens ${duration}ms`);
  });
}

/**
 * 演示不同类型的任务执行
 */
async function demonstrateTaskTypes(agent) {
  console.log('📋 演示不同任务类型:\n');
  
  // 1. 纯LLM任务
  console.log('   1️⃣ 纯LLM任务:');
  console.log('      → 只使用LLM进行对话或分析');
  console.log('      → 不涉及外部工具调用');
  console.log('      → 适用于纯推理、创作、分析任务\n');
  
  // 2. 纯MCP工具任务  
  console.log('   2️⃣ 纯MCP工具任务:');
  console.log('      → 只调用外部MCP工具');
  console.log('      → 不涉及LLM推理');
  console.log('      → 适用于数据获取、文件操作、API调用\n');
  
  // 3. MCP工具链任务
  console.log('   3️⃣ MCP工具链任务:');
  console.log('      → 连续调用多个MCP工具');
  console.log('      → 数据在工具间传递');
  console.log('      → 适用于复杂的数据处理流水线\n');
  
  // 4. 混合任务
  console.log('   4️⃣ 混合任务 (最强大):');
  console.log('      → LLM推理 + MCP工具调用的完美结合');
  console.log('      → 可以处理复杂的现实世界问题');
  console.log('      → 适用于需要智能决策和外部操作的场景\n');
}

// 演示错误处理和恢复机制
async function demonstrateErrorHandling() {
  console.log('📋 错误处理和恢复机制:\n');
  
  console.log('   🔧 连接级错误处理:');
  console.log('      → 连接断开自动重连');
  console.log('      → 故障服务器自动切换');
  console.log('      → 健康检查持续监控\n');
  
  console.log('   🔧 工具调用错误处理:');
  console.log('      → 参数验证失败时明确报错');
  console.log('      → 工具不存在时提供建议');
  console.log('      → 调用超时时自动重试\n');
  
  console.log('   🔧 负载均衡和容错:');
  console.log('      → 多服务器间自动分发请求');
  console.log('      → 单点故障不影响整体服务');
  console.log('      → 性能监控和优化建议\n');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateAgentFlow()
    .then(() => {
      console.log('\n📚 更多信息:');
      console.log('   - 详细文档: docs/MCP_EXECUTION_FLOW.md');
      console.log('   - 使用示例: examples/mcp-integration.js');
      console.log('   - 完成报告: MCP_COMPLETION_REPORT.md');
    })
    .catch(console.error);
}

export {
  demonstrateAgentFlow,
  demonstrateExecutionSteps,
  setupEventListeners,
  demonstrateTaskTypes,
  demonstrateErrorHandling
};
