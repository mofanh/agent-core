/**
 * LLM 可扩展库使用示例
 */

import { 
  LLM, 
  LLMFactory, 
  createSparkLLM, 
  createOpenAILLM,
  createLLMAgent 
} from '../src/index.js';

// 示例1：使用内置的星火大模型
async function exampleSpark() {
  const sparkLLM = createSparkLLM({
    apiKey: process.env.SPARK_API_KEY,
    timeout: 30000
  });

  // 检查连接
  const connected = await sparkLLM.isConnect();
  console.log('星火连接状态:', connected);

  if (connected) {
    // 发送非流式请求
    const response = await sparkLLM.post({
      messages: [{ role: 'user', content: '你好' }],
      stream: false
    });
    console.log('非流式响应:', response);

    // 发送流式请求
    const stream = await sparkLLM.stream({
      messages: [{ role: 'user', content: '讲个笑话' }]
    });

    console.log('流式响应:');
    for await (const chunk of stream) {
      console.log(chunk);
    }
  }
}

// 示例2：自定义 LLM 提供商
async function exampleCustomProvider() {
  // 定义自定义请求处理函数
  async function* customRequestHandler(payload, options = {}) {
    const baseUrl = options.baseUrl || 'https://api.your-llm-service.com/v1/chat';
    const apiKey = options.apiKey || process.env.CUSTOM_API_KEY;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        model: options.model || 'default-model'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!payload.stream) {
      return await response.json();
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            yield JSON.parse(data);
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  }

  // 注册自定义提供商
  LLMFactory.register('custom', customRequestHandler, null, {
    model: 'custom-model-v1',
    baseUrl: 'https://api.your-llm-service.com/v1/chat',
    timeout: 60000
  });

  // 使用自定义提供商
  const customLLM = LLMFactory.create('custom', {
    apiKey: 'your-api-key',
    model: 'custom-model-v2'
  });

  console.log('自定义提供商信息:', customLLM.getProviderInfo());
}

// 示例3：直接创建 LLM 实例
async function exampleDirectLLM() {
  // 简单的模拟 LLM 处理函数
  async function* mockLLMHandler(payload, options = {}) {
    const responses = [
      '这是一个模拟的',
      'LLM 响应示例。',
      '你可以根据需要',
      '自定义处理逻辑。'
    ];

    for (const text of responses) {
      await new Promise(resolve => setTimeout(resolve, 100)); // 模拟延迟
      yield {
        choices: [{
          delta: { content: text }
        }]
      };
    }
  }

  const mockLLM = new LLM({
    requestHandler: mockLLMHandler,
    provider: 'mock',
    options: {
      responseDelay: 100,
      maxTokens: 1000
    }
  });

  console.log('模拟 LLM 流式响应:');
  const stream = await mockLLM.stream({
    messages: [{ role: 'user', content: '测试' }]
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
  console.log('\n');
}

// 示例4：在 Agent 中使用自定义 LLM
async function exampleAgentWithCustomLLM() {
  // 创建带自定义 LLM 的 Agent
  const agent = createLLMAgent(async function* (payload) {
    // 简化的 LLM 实现
    yield {
      choices: [{
        message: {
          role: 'assistant',
          content: `收到消息: ${payload.messages[0].content}`
        }
      }]
    };
  }, {
    provider: 'echo',
    preset: 'debug'
  });

  await agent.initialize();

  // 执行 LLM 任务
  const result = await agent.execute({
    type: 'llm',
    payload: {
      messages: [{ role: 'user', content: 'Hello Agent!' }]
    }
  });

  console.log('Agent 执行结果:', result);

  // 获取健康状态
  const health = await agent.getHealth();
  console.log('Agent 健康状态:', health);
}

// 运行示例
async function runExamples() {
  console.log('=== LLM 可扩展库示例 ===\n');

  try {
    console.log('1. 星火大模型示例:');
    await exampleSpark();
    console.log('\n');

    console.log('2. 自定义提供商示例:');
    await exampleCustomProvider();
    console.log('\n');

    console.log('3. 直接创建 LLM 示例:');
    await exampleDirectLLM();
    console.log('\n');

    console.log('4. Agent 集成示例:');
    await exampleAgentWithCustomLLM();
    console.log('\n');

  } catch (error) {
    console.error('示例执行错误:', error);
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}

export { 
  exampleSpark, 
  exampleCustomProvider, 
  exampleDirectLLM, 
  exampleAgentWithCustomLLM 
};
