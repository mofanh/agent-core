/**
 * AgentCore 与 Prompt 集成测试 - 使用真实的 Spark LLM
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { 
  AgentCore, 
  PromptBuilder,
  PROMPT_TEMPLATES,
  createSparkAgent,
  sparkRequestHandler
} from '../src/index.js';

// 真实的 Spark 流式请求处理器
async function* sparkStreamRequest(payload) {
  console.log('sparkStreamRequest called with payload:', payload);
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
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          yield JSON.parse(data);
        } catch {}
      }
    }
  }
}

describe('AgentCore Prompt Integration', () => {
  let agent;

  // 简单的测试配置
  const testPromptConfig = {
    // 注册一个自定义模板
    customTemplates: {
      'test-chat': {
        system: '你是一个有用的AI助手。',
        user: '用户问题：{{question}}'
      }
    }
  };

  beforeEach(async () => {
    // 创建带有 prompt 配置和真实 Spark LLM 的 AgentCore
    agent = new AgentCore({
      prompt: testPromptConfig,
      llm: {
        requestHandler: sparkStreamRequest,
        provider: 'spark',
        options: {
          apiKey: process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau',
          model: '4.0Ultra'
        }
      }
    });
    await agent.initialize();
  });

  afterEach(async () => {
    await agent.shutdown();
  });

  test('should initialize with prompt builder', async () => {
    expect(agent.promptBuilder).toBeDefined();
    expect(agent.promptBuilder).toBeInstanceOf(PromptBuilder);
  });

  test('should build prompt and execute LLM task', async () => {
    const task = {
      type: 'llm',
      buildPrompt: {
        template: 'test-chat',
        variables: {
          question: '请说一个程序员笑话'
        }
      },
      payload: {
        model: '4.0Ultra',
        temperature: 0.7,
        stream: true
      }
    };

    const result = await agent.execute(task);
    
    // 收集流式响应
    const chunks = [];
    let fullContent = '';
    
    try {
      for await (const chunk of result) {
        chunks.push(chunk);
        if (chunk.choices?.[0]?.delta?.content) {
          fullContent += chunk.choices[0].delta.content;
        }
      }
    } catch (error) {
      console.log('流式数据接收错误:', error.message);
    }

    console.log('总共收到', chunks.length, '个数据块');
    console.log('完整响应内容:', fullContent);
    
    expect(chunks.length).toBeGreaterThan(0);
    expect(fullContent.length).toBeGreaterThan(0);
  }, 30000); // 30秒超时

  test('should handle workflow with onComplete callback', async () => {
    let callbackExecuted = false;
    let mcpResponse = null;

    const task = {
      type: 'llm',
      buildPrompt: {
        template: 'test-chat',
        variables: {
          question: '简单回答：1+1等于几？'
        }
      },
      payload: {
        model: '4.0Ultra',
        temperature: 0.1,
        stream: true
      },
      onComplete: async (llmResult, agentCore) => {
        callbackExecuted = true;
        
        // 模拟 MCP 服务器处理
        let fullResponse = '';
        try {
          for await (const chunk of llmResult) {
            if (chunk.choices?.[0]?.delta?.content) {
              fullResponse += chunk.choices[0].delta.content;
            }
          }
        } catch (error) {
          console.log('MCP处理流数据错误:', error.message);
        }
        
        mcpResponse = {
          analysis: '数学计算结果',
          result: fullResponse,
          nextAction: 'complete'
        };
        
        console.log('MCP 服务器处理完成:', mcpResponse);
        return mcpResponse;
      }
    };

    const result = await agent.execute(task);
    
    expect(callbackExecuted).toBe(true);
    expect(mcpResponse).toBeDefined();
    expect(mcpResponse.analysis).toBe('数学计算结果');
    expect(mcpResponse.result.length).toBeGreaterThan(0);
  }, 30000);

  test('should report prompt capabilities', async () => {
    const capabilities = await agent.getCapabilities();
    
    expect(capabilities.prompt).toBeDefined();
    expect(capabilities.prompt).toContain('build');
  });

  test('should handle task without buildPrompt', async () => {
    const task = {
      type: 'llm',
      payload: {
        model: '4.0Ultra',
        messages: [
          { role: 'user', content: '直接的消息：简单回答你好' }
        ],
        stream: true,
        temperature: 0.1
      }
    };

    const result = await agent.execute(task);
    
    // 收集流式响应
    let fullContent = '';
    try {
      for await (const chunk of result) {
        if (chunk.choices?.[0]?.delta?.content) {
          fullContent += chunk.choices[0].delta.content;
        }
      }
    } catch (error) {
      console.log('直接消息流数据错误:', error.message);
    }
    
    expect(result).toBeDefined();
    expect(fullContent.length).toBeGreaterThan(0);
    console.log('直接消息响应:', fullContent);
  }, 30000);

  test('should handle non-llm tasks', async () => {
    const task = {
      type: 'other',
      payload: { data: 'test' }
    };

    const result = await agent.execute(task);
    expect(result.status).toBe('completed');
    expect(result.task.type).toBe('other');
  });
});

describe('AgentCore Workflow Simulation', () => {
  let agent;

  // 系统分析配置
  const systemAnalysisConfig = {
    customTemplates: {
      'system-analysis': {
        system: '你是一个系统分析专家。请分析以下数据：{{data}}',
        user: '分析请求：{{request}}'
      }
    }
  };

  beforeEach(async () => {
    agent = new AgentCore({
      prompt: systemAnalysisConfig,
      llm: {
        requestHandler: sparkStreamRequest,
        provider: 'spark',
        options: {
          apiKey: process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau',
          model: '4.0Ultra'
        }
      }
    });

    await agent.initialize();
  });

  afterEach(async () => {
    await agent.shutdown();
  });

  test('should simulate complete workflow cycle', async () => {
    // 简化的工作流测试，只测试一步
    const task = {
      type: 'llm',
      buildPrompt: {
        template: 'system-analysis',
        variables: {
          data: '用户留存数据样本',
          request: '简单分析'
        }
      },
      payload: {
        model: '4.0Ultra',
        temperature: 0.1,
        stream: true,
        max_tokens: 100  // 极少的token数来快速完成
      },
      onComplete: async (llmResult) => {
        console.log('开始收集工作流流式响应');
        
        let fullContent = '';
        let chunkCount = 0;
        const maxChunks = 20; // 限制最大chunk数
        
        try {
          for await (const chunk of llmResult) {
            chunkCount++;
            console.log(`工作流收到chunk ${chunkCount}:`, chunk.choices?.[0]?.delta?.content || '无内容');
            
            if (chunk.choices?.[0]?.delta?.content) {
              fullContent += chunk.choices[0].delta.content;
            }
            
            // 安全退出条件
            if (chunkCount >= maxChunks) {
              console.log('达到最大chunk限制，停止处理');
              break;
            }
          }
        } catch (error) {
          console.log('工作流流处理错误:', error.message);
        }

        console.log(`工作流收集完成，总计 ${chunkCount} chunks，内容: ${fullContent.substring(0, 100)}...`);

        return {
          status: 'completed',
          step: 1,
          llmResult: { content: fullContent },
          chunkCount
        };
      }
    };

    console.log('执行简化工作流测试');
    const result = await agent.execute(task);
    
    console.log('工作流测试完成，结果:', {
      status: result.status,
      step: result.step,
      contentLength: result.llmResult?.content?.length,
      chunkCount: result.chunkCount
    });
    
    expect(result.status).toBe('completed');
    expect(result.step).toBe(1);
    expect(result.llmResult).toBeDefined();
    expect(result.llmResult.content).toBeDefined();
    expect(result.llmResult.content.length).toBeGreaterThan(0);
  }, 45000); // 45秒超时
});
