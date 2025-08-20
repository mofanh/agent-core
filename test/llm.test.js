import { LLM, sparkStreamRequest, AgentCore, createLLMAgent } from '../src/index.js';

describe('LLM 类测试', () => {
  let llm;

  beforeEach(() => {
    // 创建 LLM 实例用于测试
    llm = new LLM(sparkStreamRequest, false);
  });

  test('LLM 构造函数应该正确设置参数', () => {
    expect(llm.requestImpl).toBe(sparkStreamRequest);
    expect(llm.isConnected).toBe(false);
  });

  test('构造函数应该验证 requestImpl 参数', () => {
    expect(() => {
      new LLM('not a function');
    }).toThrow('requestImpl 必须是一个函数');
  });

  test('setBaseUrl 应该正确设置基础 URL', () => {
    const testUrl = 'https://test-api.com';
    llm.setBaseUrl(testUrl);
    expect(llm.baseUrl).toBe(testUrl);
  });

  test('getConnectionStatus 应该返回当前连接状态', () => {
    expect(llm.getConnectionStatus()).toBe(false);
    llm.isConnected = true;
    expect(llm.getConnectionStatus()).toBe(true);
  });

  // 注意：实际的网络请求测试可能需要模拟
  test('isConnect 应该尝试检查连接', async () => {
    // 这个测试可能会因为网络问题失败，在实际环境中应该使用模拟
    const result = await llm.isConnect();
    expect(typeof result).toBe('boolean');
  });
});

describe('AgentCore 与 LLM 集成测试', () => {
  test('createLLMAgent 应该创建带 LLM 配置的 Agent', () => {
    const agent = createLLMAgent(sparkStreamRequest, {
      isConnected: true,
      baseUrl: 'https://test-api.com'
    });

    expect(agent).toBeInstanceOf(AgentCore);
    expect(agent.config.llm).toBeDefined();
    expect(agent.config.llm.requestImpl).toBe(sparkStreamRequest);
    expect(agent.config.llm.isConnected).toBe(true);
    expect(agent.config.llm.baseUrl).toBe('https://test-api.com');
  });

  test('AgentCore 应该在初始化时设置 LLM', async () => {
    const agent = createLLMAgent(sparkStreamRequest, { isConnected: true });
    await agent.initialize();

    expect(agent.llm).toBeDefined();
    expect(agent.llm).toBeInstanceOf(LLM);
  });

  test('AgentCore 应该能处理 LLM 任务', async () => {
    const mockRequestImpl = async function* (payload) {
      yield { role: 'assistant', content: 'Test response' };
    };

    const agent = createLLMAgent(mockRequestImpl, { isConnected: true });
    await agent.initialize();

    const task = {
      type: 'llm',
      payload: {
        messages: [{ role: 'user', content: 'Hello' }]
      }
    };

    const result = await agent.execute(task);
    expect(result).toBeDefined();
  });

  test('getHealth 应该包含 LLM 状态', async () => {
    const agent = createLLMAgent(sparkStreamRequest, { isConnected: false });
    await agent.initialize();

    const health = await agent.getHealth();
    expect(health.status).toBe('healthy');
    expect(health.components.llm).toBeDefined();
    expect(typeof health.components.llm.connected).toBe('boolean');
  });

  test('getCapabilities 应该包含 LLM 能力', async () => {
    const agent = createLLMAgent(sparkStreamRequest);
    await agent.initialize();

    const capabilities = await agent.getCapabilities();
    expect(capabilities.core).toContain('execute');
    expect(capabilities.llm).toContain('post');
    expect(capabilities.llm).toContain('isConnect');
  });
});
