import { 
  LLM, 
  LLMFactory, 
  createSparkLLM, 
  createOpenAILLM,
  createSparkAgent,
  createLLMAgent,
  sparkRequestHandler 
} from '../src/index.js';

describe('LLM 可扩展库测试', () => {
  test('LLM 类应该接受配置对象', () => {
    const mockHandler = async function* (payload) {
      yield { content: 'test' };
    };

    const llm = new LLM({
      requestHandler: mockHandler,
      provider: 'test',
      options: { timeout: 5000 }
    });

    expect(llm.provider).toBe('test');
    expect(llm.requestHandler).toBe(mockHandler);
    expect(llm.options.timeout).toBe(5000);
  });

  test('应该能注册自定义提供商', () => {
    const customHandler = async function* (payload) {
      yield { message: 'custom response' };
    };

    LLMFactory.register('custom', customHandler, null, { 
      defaultModel: 'custom-model' 
    });

    expect(LLMFactory.getProviders()).toContain('custom');

    const llm = LLMFactory.create('custom');
    expect(llm.provider).toBe('custom');
    expect(llm.options.defaultModel).toBe('custom-model');
  });

  test('createSparkLLM 应该创建星火 LLM 实例', () => {
    const llm = createSparkLLM({ apiKey: 'test-key' });
    expect(llm.provider).toBe('spark');
    expect(llm.options.apiKey).toBe('test-key');
  });

  test('createOpenAILLM 应该创建 OpenAI LLM 实例', () => {
    const llm = createOpenAILLM({ model: 'gpt-4' });
    expect(llm.provider).toBe('openai');
    expect(llm.options.model).toBe('gpt-4');
  });

  test('LLM 应该支持连接检查缓存', async () => {
    let callCount = 0;
    const mockChecker = async () => {
      callCount++;
      return true;
    };
    const mockHandler = async function* () { yield {}; };

    const llm = new LLM({
      requestHandler: mockHandler,
      connectionChecker: mockChecker,
      provider: 'test'
    });

    // 第一次检查
    await llm.isConnect();
    expect(callCount).toBe(1);

    // 第二次检查应该使用缓存
    await llm.isConnect();
    expect(callCount).toBe(1);

    // 强制检查应该绕过缓存
    await llm.isConnect(true);
    expect(callCount).toBe(2);
  });

  test('应该能处理流式和非流式请求', async () => {
    const mockHandler = async function (payload, options) {
      if (payload.stream) {
        // 返回生成器函数
        return (async function* () {
          yield { delta: { content: 'chunk 1' } };
          yield { delta: { content: 'chunk 2' } };
        })();
      } else {
        // 返回普通对象
        return { choices: [{ message: { content: 'complete response' } }] };
      }
    };

    const llm = new LLM({
      requestHandler: mockHandler,
      provider: 'test',
      options: { checkConnection: false }
    });

    // 非流式请求
    const nonStreamResult = await llm.post({ 
      messages: [{ role: 'user', content: 'hello' }],
      stream: false
    });
    expect(nonStreamResult.choices[0].message.content).toBe('complete response');

    // 流式请求
    const streamResult = await llm.stream({ 
      messages: [{ role: 'user', content: 'hello' }] 
    });
    
    const chunks = [];
    for await (const chunk of streamResult) {
      chunks.push(chunk);
    }
    expect(chunks).toHaveLength(2);
    expect(chunks[0].delta.content).toBe('chunk 1');
  });
});

describe('Agent 集成测试', () => {
  test('createSparkAgent 应该创建带星火 LLM 的 Agent', async () => {
    const agent = createSparkAgent({ apiKey: 'test-key' });
    await agent.initialize();

    expect(agent.llm).toBeDefined();
    expect(agent.llm.provider).toBe('spark');
  });

  test('createLLMAgent 应该支持多种创建方式', async () => {
    // 方式1：使用提供商名称
    const agent1 = createLLMAgent('spark', { apiKey: 'test-key' });
    await agent1.initialize();
    expect(agent1.llm.provider).toBe('spark');

    // 方式2：使用自定义处理函数
    const customHandler = async function* () { yield {}; };
    const agent2 = createLLMAgent(customHandler, { provider: 'custom' });
    await agent2.initialize();
    expect(agent2.llm.provider).toBe('custom');

    // 方式3：使用完整配置
    const agent3 = createLLMAgent({
      requestHandler: customHandler,
      provider: 'test',
      options: { model: 'test-model' }
    });
    await agent3.initialize();
    expect(agent3.llm.provider).toBe('test');
  });
});
