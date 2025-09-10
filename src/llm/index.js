/**
 * LLM 可扩展库
 * 支持多种 LLM 服务提供商的统一接口
 */
export class LLM {
  /**
   * 构造函数
   * @param {object} config - LLM 配置
   * @param {function} config.requestHandler - 请求处理函数
   * @param {function} [config.connectionChecker] - 连接检查函数
   * @param {string} [config.provider] - 服务提供商名称
   * @param {object} [config.options] - 额外配置选项
   */
  constructor(config) {
    if (!config || typeof config.requestHandler !== 'function') {
      throw new Error('必须提供 requestHandler 函数');
    }

    this.provider = config.provider || 'unknown';
    this.requestHandler = config.requestHandler;
    this.connectionChecker = config.connectionChecker || this._defaultConnectionChecker.bind(this);
    this.options = config.options || {};
    this.isConnected = false;
    this.lastConnectionCheck = null;
  }

  /**
   * 默认连接检查函数
   * @returns {Promise<boolean>}
   */
  async _defaultConnectionChecker() {
    try {
      // 尝试发送一个简单的测试请求
      const testPayload = {
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
        stream: false
      };
      
      await this.requestHandler(testPayload);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 检查连接状态
   * @param {boolean} [force=false] - 是否强制检查（忽略缓存）
   * @returns {Promise<boolean>}
   */
  async isConnect(force = false) {
    const now = Date.now();
    const cacheExpiry = 60000; // 1分钟缓存

    // 如果不强制检查且缓存未过期，返回缓存结果
    if (!force && this.lastConnectionCheck && (now - this.lastConnectionCheck) < cacheExpiry) {
      return this.isConnected;
    }

    try {
      this.isConnected = await this.connectionChecker();
      this.lastConnectionCheck = now;
      return this.isConnected;
    } catch (error) {
      console.warn(`[${this.provider}] 连接检查失败:`, error.message);
      this.isConnected = false;
      this.lastConnectionCheck = now;
      return false;
    }
  }

  /**
   * 发送请求
   * @param {object} payload - 请求负载
   * @param {object} [options] - 请求选项
   * @returns {Promise<any>} 响应结果
   */
  async post(payload, options = {}) {
    const mergedOptions = { ...this.options, ...options };
    
    // 如果启用了连接检查
    if (mergedOptions.checkConnection !== false) {
      const connected = await this.isConnect();
      if (!connected) {
        throw new Error(`[${this.provider}] 无法连接到服务，请检查网络或配置`);
      }
    }

    try {
      const result = await this.requestHandler(payload, mergedOptions);
      
      // 如果返回的是生成器（流式），需要检查是否为非流式请求
      if (result && typeof result[Symbol.asyncIterator] === 'function' && !payload.stream) {
        // 非流式请求但返回了生成器，收集所有结果
        const chunks = [];
        for await (const chunk of result) {
          chunks.push(chunk);
        }
        return chunks[chunks.length - 1]; // 返回最后一个结果
      }
      
      return result;
    } catch (error) {
      console.error(`[${this.provider}] 请求失败:`, error.message);
      throw error;
    }
  }

  /**
   * 发送请求（request 方法的别名，用于兼容性）
   * @param {object} payload - 请求负载
   * @param {object} [options] - 请求选项
   * @returns {Promise<any>} 响应结果
   */
  async request(payload, options = {}) {
    return this.post(payload, options);
  }

  /**
   * 流式请求
   * @param {object} payload - 请求负载
   * @param {object} [options] - 请求选项
   * @returns {AsyncGenerator} 流式响应
   */
  async stream(payload, options = {}) {
    const streamPayload = { ...payload, stream: true };
    return this.post(streamPayload, options);
  }

  /**
   * 获取提供商信息
   * @returns {object} 提供商信息
   */
  getProviderInfo() {
    return {
      provider: this.provider,
      connected: this.isConnected,
      lastCheck: this.lastConnectionCheck ? new Date(this.lastConnectionCheck) : null,
      options: this.options
    };
  }

  /**
   * 更新配置
   * @param {object} newOptions - 新的配置选项
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }
}

/**
 * LLM 工厂类 - 用于创建不同提供商的 LLM 实例
 */
export class LLMFactory {
  static providers = new Map();

  /**
   * 注册提供商
   * @param {string} name - 提供商名称
   * @param {function} requestHandler - 请求处理函数
   * @param {function} [connectionChecker] - 连接检查函数
   * @param {object} [defaultOptions] - 默认选项
   */
  static register(name, requestHandler, connectionChecker, defaultOptions = {}) {
    this.providers.set(name, {
      requestHandler,
      connectionChecker,
      defaultOptions
    });
  }

  /**
   * 创建 LLM 实例
   * @param {string} provider - 提供商名称
   * @param {object} [options] - 配置选项
   * @returns {LLM} LLM 实例
   */
  static create(provider, options = {}) {
    const providerConfig = this.providers.get(provider);
    if (!providerConfig) {
      throw new Error(`未知的 LLM 提供商: ${provider}`);
    }

    return new LLM({
      provider,
      requestHandler: providerConfig.requestHandler,
      connectionChecker: providerConfig.connectionChecker,
      options: { ...providerConfig.defaultOptions, ...options }
    });
  }

  /**
   * 获取已注册的提供商列表
   * @returns {string[]} 提供商名称列表
   */
  static getProviders() {
    return Array.from(this.providers.keys());
  }
}

/**
 * 星火大模型请求处理函数
 */
export async function* sparkRequestHandler(payload, options = {}) {
  const apiKey = options.apiKey || process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau';
  const baseUrl = options.baseUrl || 'https://spark-api-open.xf-yun.com/v1/chat/completions';
  
  // 调试输出
  if (process.env.DEBUG) {
    console.log('[DEBUG] Spark Request:', JSON.stringify(payload, null, 2));
  }
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (process.env.DEBUG) {
      console.log('[DEBUG] Spark Error Response:', errorText);
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
  }

  if (!payload.stream) {
    // 非流式响应 - 直接yield结果
    const result = await response.json();
    yield result;
    return;
  }

  // 流式响应处理
  if (!response.body) throw new Error('No response body');
  
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop();
    
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
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

/**
 * OpenAI 兼容的请求处理函数
 */
export async function* openaiRequestHandler(payload, options = {}) {
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  const baseUrl = options.baseUrl || 'https://api.openai.com/v1/chat/completions';
  
  if (!apiKey) {
    throw new Error('OpenAI API Key 未设置');
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (!payload.stream) {
    return await response.json();
  }

  // 流式响应处理（与星火类似）
  if (!response.body) throw new Error('No response body');
  
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop();
    
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
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

// 注册内置提供商
LLMFactory.register('spark', sparkRequestHandler, null, {
  checkConnection: true,
  timeout: 30000
});

LLMFactory.register('openai', openaiRequestHandler, null, {
  checkConnection: true,
  timeout: 30000
});

// 便捷的创建函数
export function createSparkLLM(options = {}) {
  return LLMFactory.create('spark', options);
}

export function createOpenAILLM(options = {}) {
  return LLMFactory.create('openai', options);
}

// 导出向后兼容的函数
export const sparkStreamRequest = sparkRequestHandler;

export default LLM;
