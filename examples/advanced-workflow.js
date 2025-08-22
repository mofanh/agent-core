/**
 * 高级 AgentCore 工作流示例
 * 展示更复杂的多阶段工作流程
 */

import { 
  AgentCore, 
  EXAMPLE_CONFIGS 
} from '../src/index.js';

// 模拟不同类型的 MCP 服务器
const mcpServers = {
  // 数据分析服务器
  dataAnalysis: (data) => {
    return {
      action: 'analyze_more',
      suggestions: ['请提供更多数据细节', '建议进行对比分析'],
      nextPrompt: 'data_analysis'
    };
  },

  // 代码生成服务器
  codeGeneration: (data) => {
    return {
      action: 'refine_code',
      feedback: ['代码结构需要优化', '添加错误处理'],
      nextPrompt: 'code_review'
    };
  },

  // 对话管理服务器
  conversation: (data) => {
    return {
      action: 'continue_chat',
      context: data,
      nextPrompt: 'conversation'
    };
  }
};

class AdvancedWorkflow {
  constructor(config) {
    this.agent = new AgentCore(config);
    this.workflowState = {
      stage: 'initial',
      history: [],
      context: {}
    };
  }

  async initialize() {
    await this.agent.initialize();
  }

  async processStage(input, stage = 'conversation') {
    // 根据不同阶段选择不同的 prompt 配置
    const promptConfigs = {
      initial: {
        templateName: 'system_analysis',
        variables: { task: input }
      },
      data_analysis: {
        templateName: 'data_analysis',
        variables: { 
          query: input,
          previousResults: this.workflowState.context.lastResult || ''
        }
      },
      code_review: {
        templateName: 'code_review',
        variables: { 
          code: input,
          issues: this.workflowState.context.issues || []
        }
      },
      conversation: {
        templateName: 'conversation',
        variables: { 
          userMessage: input,
          context: this.workflowState.context.chatHistory || ''
        }
      }
    };

    const task = {
      type: 'llm',
      buildPrompt: promptConfigs[stage] || promptConfigs.conversation,
      payload: {
        temperature: 0.7,
        max_tokens: 1000
      },
      onComplete: async (llmResult, agentCore) => {
        // 更新工作流状态
        this.workflowState.history.push({
          stage,
          input,
          output: llmResult,
          timestamp: new Date().toISOString()
        });

        // 根据当前阶段选择对应的 MCP 服务器
        let mcpServer;
        if (stage.includes('analysis')) {
          mcpServer = mcpServers.dataAnalysis;
        } else if (stage.includes('code')) {
          mcpServer = mcpServers.codeGeneration;
        } else {
          mcpServer = mcpServers.conversation;
        }

        const mcpResponse = mcpServer(llmResult);

        // 更新上下文
        this.workflowState.context = {
          ...this.workflowState.context,
          lastResult: llmResult.content || llmResult.text,
          lastMcpResponse: mcpResponse
        };

        return {
          stage: this.workflowState.stage,
          llmResult,
          mcpResponse,
          nextStage: mcpResponse.nextPrompt,
          shouldContinue: mcpResponse.action !== 'complete'
        };
      }
    };

    return await this.agent.execute(task);
  }

  async runWorkflow(initialInput, maxIterations = 5) {
    let currentInput = initialInput;
    let currentStage = 'initial';
    let iteration = 0;

    console.log('开始高级工作流...\n');

    while (iteration < maxIterations) {
      console.log(`=== 迭代 ${iteration + 1}, 阶段: ${currentStage} ===`);
      console.log(`输入: ${currentInput}`);

      try {
        const result = await this.processStage(currentInput, currentStage);
        
        console.log(`LLM 输出: ${result.llmResult.content || JSON.stringify(result.llmResult)}`);
        console.log(`MCP 响应:`, result.mcpResponse);

        if (!result.shouldContinue) {
          console.log('\n工作流完成');
          break;
        }

        // 准备下一次迭代
        currentStage = result.nextStage || 'conversation';
        
        // 根据 MCP 响应生成下一个输入
        if (result.mcpResponse.suggestions && result.mcpResponse.suggestions.length > 0) {
          currentInput = result.mcpResponse.suggestions[0];
        } else {
          currentInput = "请继续处理";
        }

        iteration++;

      } catch (error) {
        console.error('工作流执行出错:', error);
        break;
      }

      console.log(''); // 空行分隔
    }

    if (iteration >= maxIterations) {
      console.log('达到最大迭代次数');
    }

    // 返回完整的工作流历史
    return {
      completed: true,
      iterations: iteration,
      history: this.workflowState.history,
      finalContext: this.workflowState.context
    };
  }

  async shutdown() {
    await this.agent.shutdown();
  }
}

// 运行高级工作流示例
async function runAdvancedWorkflowExample() {
  const workflow = new AdvancedWorkflow({
    prompt: EXAMPLE_CONFIGS.system_analysis, // 使用系统分析配置
    llm: {
      provider: 'openai',
      options: {
        apiKey: 'your-api-key',
        model: 'gpt-4'
      }
    }
  });

  await workflow.initialize();

  const result = await workflow.runWorkflow(
    "请分析当前AI技术的发展趋势，并提出改进建议",
    3 // 最多3次迭代
  );

  console.log('\n=== 工作流总结 ===');
  console.log(`总迭代次数: ${result.iterations}`);
  console.log(`历史记录数: ${result.history.length}`);
  console.log('最终上下文:', result.finalContext);

  await workflow.shutdown();
  return result;
}

// 导出
export { AdvancedWorkflow, runAdvancedWorkflowExample };

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAdvancedWorkflowExample().catch(console.error);
}
