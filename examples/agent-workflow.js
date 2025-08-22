/**
 * AgentCore 工作流示例
 * 展示 in → buildprompt → llm → out → mcp → buildprompt → in 的循环流程
 */

import { 
  AgentCore, 
  createLLMAgent,
  EXAMPLE_CONFIGS 
} from '../src/index.js';

// 模拟 MCP 服务器响应
function mockMCPServer(data) {
  // 模拟一些处理逻辑
  return {
    action: 'next_query',
    data: {
      userInput: `基于上次结果，请分析：${data.content?.slice(0, 100)}...`,
      context: data
    }
  };
}

// 创建一个完整的工作流示例
async function runWorkflowExample() {
  // 1. 创建配置了 prompt 和 llm 的 AgentCore
  const agent = new AgentCore({
    prompt: EXAMPLE_CONFIGS.chatbot,
    llm: {
      provider: 'openai', // 或其他提供商
      options: {
        apiKey: 'your-api-key',
        model: 'gpt-3.5-turbo'
      }
    }
  });

  await agent.initialize();

  // 2. 定义初始输入
  let userInput = "你好，请介绍一下人工智能的发展历史";
  let loopCount = 0;
  const maxLoops = 3; // 最多循环3次

  while (loopCount < maxLoops) {
    console.log(`\n=== 循环 ${loopCount + 1} ===`);
    console.log(`用户输入: ${userInput}`);

    try {
      // 3. 执行任务：input → buildprompt → llm → output
      const task = {
        type: 'llm',
        buildPrompt: {
          templateName: 'conversation',
          variables: {
            userMessage: userInput,
            context: loopCount > 0 ? '这是一个续接对话' : ''
          }
        },
        payload: {
          // 其他 LLM 参数
          temperature: 0.7,
          max_tokens: 500
        },
        // 定义完成后的处理逻辑
        onComplete: async (llmResult, agentCore) => {
          console.log(`LLM 响应: ${llmResult.content || JSON.stringify(llmResult)}`);

          // 4. 将输出发送到 MCP 服务器
          const mcpResponse = mockMCPServer({
            content: llmResult.content || llmResult.text,
            timestamp: new Date().toISOString()
          });

          console.log(`MCP 服务器响应:`, mcpResponse);

          // 5. 根据 MCP 响应决定是否继续循环
          if (mcpResponse.action === 'next_query' && mcpResponse.data.userInput) {
            // 更新用户输入，准备下一轮循环
            userInput = mcpResponse.data.userInput;
            return {
              status: 'continue',
              nextInput: userInput,
              mcpResponse
            };
          }

          return {
            status: 'completed',
            llmResult,
            mcpResponse
          };
        }
      };

      // 执行任务
      const result = await agent.execute(task);

      // 6. 检查是否需要继续循环
      if (result.status === 'continue') {
        userInput = result.nextInput;
        loopCount++;
      } else {
        console.log('\n工作流完成');
        break;
      }

    } catch (error) {
      console.error('执行出错:', error);
      break;
    }
  }

  if (loopCount >= maxLoops) {
    console.log('\n达到最大循环次数，工作流结束');
  }

  await agent.shutdown();
}

// 运行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runWorkflowExample().catch(console.error);
}

export { runWorkflowExample };
