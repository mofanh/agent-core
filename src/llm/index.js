/**
 * LLM 可扩展库
 * 支持多种 LLM 服务提供商的统一接口
 */

import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';

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

/**
 * LLM Agent 调用层
 * 封装 LLM 与工具调用的接口，让 LLM 只需要输出标准的工具调用 JSON
 */
export class LLMAgent extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      // LLM 配置
      llm: config.llm || {},
      
      // MCP 配置
      mcp: config.mcp || {},
      
      // 浏览器工具配置
      browser: config.browser || {},
      
      // 调用层配置
      agent: {
        maxRetries: 3,
        timeout: 30000,
        enableFallback: true,
        ...config.agent
      }
    };
    
    this.logger = new Logger('info');
    this.llm = null;
    this.mcpSystem = null;
    this.browserToolManager = null;
    this.initialized = false;
    
    // 工具注册表
    this.toolRegistry = new Map();
    
    // 统计信息
    this.stats = {
      totalCalls: 0,
      llmCalls: 0,
      toolCalls: 0,
      mcpCalls: 0,
      browserCalls: 0,
      errors: 0
    };
  }

  /**
   * 初始化统一 Agent
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    this.logger.info('🚀 初始化 LLM Agent...');

    try {
      // 1. 初始化 LLM
      await this.initializeLLM();
      
      // 2. 初始化 MCP 系统
      await this.initializeMCP();
      
      // 3. 初始化浏览器工具
      await this.initializeBrowserTools();
      
      // 4. 注册统一工具
      await this.registerUnifiedTools();
      
      this.initialized = true;
      this.logger.info('✅ LLM Agent 初始化完成');
      this.emit('initialized');
      
    } catch (error) {
      this.logger.error('❌ LLM Agent 初始化失败:', error);
      throw error;
    }
  }

  /**
   * 初始化 LLM
   */
  async initializeLLM() {
    if (!this.config.llm || !this.config.llm.provider) {
      this.logger.warn('⚠️ 未配置 LLM，跳过初始化');
      return;
    }
    
    if (LLMFactory.getProviders().includes(this.config.llm.provider)) {
      this.llm = LLMFactory.create(this.config.llm.provider, this.config.llm.options);
    } else if (this.config.llm.requestHandler) {
      this.llm = new LLM(this.config.llm);
    }
    
    if (this.llm) {
      this.logger.info(`📡 LLM 初始化完成 (${this.config.llm.provider})`);
    }
  }

  /**
   * 初始化 MCP 系统
   */
  async initializeMCP() {
    if (!this.config.mcp || !this.config.mcp.servers) {
      this.logger.warn('⚠️ 未配置 MCP 服务器，跳过初始化');
      return;
    }

    try {
      const { createMCPSystem } = await import('../mcp/index.js');
      
      this.mcpSystem = await createMCPSystem({
        servers: this.config.mcp.servers || [],
        manager: this.config.mcp.manager || {},
        toolSystem: this.config.mcp.toolSystem || {}
      });
      
      // 监听 MCP 事件
      this.mcpSystem.connectionManager.on('connectionStatusChanged', (name, status) => {
        this.emit('mcpConnectionChanged', { name, status });
      });
      
      this.logger.info('🔗 MCP 系统初始化完成');
      
    } catch (error) {
      this.logger.warn('⚠️ MCP 系统初始化失败:', error.message);
    }
  }

  /**
   * 初始化浏览器工具
   */
  async initializeBrowserTools() {
    if (!this.config.browser || !this.config.browser.enabled) {
      this.logger.warn('⚠️ 未启用浏览器工具，跳过初始化');
      return;
    }

    try {
      const { BrowserToolManager } = await import('../browser/tool-manager.js');
      
      this.browserToolManager = new BrowserToolManager(this.config.browser);
      
      // 初始化浏览器工具管理器
      await this.browserToolManager.initialize();
      
      // 监听浏览器工具事件
      this.browserToolManager.on('toolExecuted', (event) => {
        this.emit('browserToolExecuted', event);
      });
      
      this.logger.info('🌐 浏览器工具初始化完成');
      
    } catch (error) {
      this.logger.warn('⚠️ 浏览器工具初始化失败:', error.message);
    }
  }

  /**
   * 注册统一工具
   */
  async registerUnifiedTools() {
    // 注册浏览器工具到统一接口
    if (this.browserToolManager) {
      const browserTools = this.browserToolManager.getToolDefinitions();
      
      for (const tool of browserTools) {
        this.toolRegistry.set(tool.name, {
          type: 'browser',
          handler: this.browserToolManager,
          schema: tool.parameters
        });
      }
      
      this.logger.info(`📝 注册了 ${browserTools.length} 个浏览器工具`);
    }

    // 注册 MCP 工具到统一接口
    if (this.mcpSystem && this.mcpSystem.toolSystem) {
      const mcpTools = this.mcpSystem.toolSystem.getTools();
      
      for (const tool of mcpTools) {
        this.toolRegistry.set(tool.name, {
          type: 'mcp',
          handler: this.mcpSystem.toolSystem,
          schema: tool.inputSchema
        });
      }
      
      this.logger.info(`📝 注册了 ${mcpTools.length} 个 MCP 工具`);
    }

    this.logger.info(`📝 工具注册完成，总计 ${this.toolRegistry.size} 个工具`);
  }

  /**
   * 执行智能任务
   * @param {Object} task - 任务配置
   * @returns {Promise<Object>} 执行结果
   */
  async executeTask(task) {
    if (!this.initialized) {
      throw new Error('LLMAgent 未初始化，请先调用 initialize()');
    }

    this.stats.totalCalls++;

    try {
      // 根据任务类型分发处理
      switch (task.type) {
        case 'llm_with_tools':
          return await this.executeLLMWithTools(task);
          
        case 'tool_call':
          return await this.executeToolCall(task);
          
        case 'llm_planning':
          return await this.executeLLMPlanning(task);
          
        case 'workflow':
          return await this.executeWorkflow(task);
          
        default:
          throw new Error(`不支持的任务类型: ${task.type}`);
      }
      
    } catch (error) {
      this.stats.errors++;
      this.logger.error('❌ 任务执行失败:', error);
      throw error;
    }
  }

  /**
   * 执行 LLM + 工具组合任务
   */
  async executeLLMWithTools(task) {
    const { prompt, tools, maxIterations = 5, autoExecuteTools = true } = task;
    
    if (!this.llm) {
      throw new Error('LLM 未初始化');
    }

    this.stats.llmCalls++;
    
    // 构建带工具定义的提示
    const enhancedPrompt = this.buildToolAwarePrompt(prompt, tools);
    
    // LLM 推理
    const llmResponse = await this.llm.post(enhancedPrompt);
    
    this.logger.info('🤖 LLM 响应:', llmResponse);

    // 解析工具调用
    const toolCalls = this.parseToolCallsFromLLMResponse(llmResponse);
    
    if (toolCalls.length === 0) {
      // 没有工具调用，直接返回 LLM 响应
      return {
        success: true,
        type: 'llm_response',
        data: llmResponse,
        toolCalls: []
      };
    }

    // 执行工具调用
    const toolResults = [];
    
    if (autoExecuteTools) {
      for (const toolCall of toolCalls) {
        try {
          const result = await this.executeUnifiedToolCall(toolCall);
          toolResults.push(result);
        } catch (error) {
          toolResults.push({
            success: false,
            error: error.message,
            toolName: toolCall.name,
            callId: toolCall.id
          });
        }
      }
    }

    return {
      success: true,
      type: 'llm_with_tools',
      data: {
        llmResponse,
        toolCalls,
        toolResults
      }
    };
  }

  /**
   * 执行统一工具调用
   */
  async executeUnifiedToolCall(toolCall) {
    const { name, args, id } = toolCall;
    
    if (!this.toolRegistry.has(name)) {
      throw new Error(`未知工具: ${name}`);
    }

    const toolInfo = this.toolRegistry.get(name);
    this.stats.toolCalls++;

    this.logger.info(`🔧 执行工具: ${name}`, args);

    try {
      let result;
      
      if (toolInfo.type === 'browser') {
        this.stats.browserCalls++;
        result = await this.browserToolManager.executeLocalTool(name, args, id);
        
      } else if (toolInfo.type === 'mcp') {
        this.stats.mcpCalls++;
        result = await this.mcpSystem.toolSystem.callTool(name, args, { callId: id });
        
      } else {
        throw new Error(`不支持的工具类型: ${toolInfo.type}`);
      }

      this.emit('toolExecuted', { name, args, result, type: toolInfo.type });
      
      return {
        success: true,
        toolName: name,
        callId: id,
        data: result,
        type: toolInfo.type
      };
      
    } catch (error) {
      this.emit('toolError', { name, args, error, type: toolInfo.type });
      throw error;
    }
  }

  /**
   * 从 LLM 响应中解析工具调用
   */
  parseToolCallsFromLLMResponse(llmResponse) {
    const toolCalls = [];
    
    try {
      // 尝试解析 JSON 格式的工具调用
      let content = llmResponse.choices?.[0]?.message?.content || llmResponse.content || '';
      
      // 查找 JSON 代码块
      const jsonMatches = content.match(/```json\s*(\[[\s\S]*?\]|\{[\s\S]*?\})\s*```/g);
      
      if (jsonMatches) {
        for (const match of jsonMatches) {
          const jsonStr = match.replace(/```json\s*/, '').replace(/\s*```/, '');
          
          try {
            const parsed = JSON.parse(jsonStr);
            
            if (Array.isArray(parsed)) {
              toolCalls.push(...parsed);
            } else if (parsed.name && parsed.args) {
              toolCalls.push(parsed);
            }
          } catch (e) {
            this.logger.warn('解析工具调用 JSON 失败:', e);
          }
        }
      }
      
      // 如果没有找到 JSON，尝试查找其他格式
      if (toolCalls.length === 0) {
        // 查找函数调用格式
        const functionCallPattern = /(\w+)\((.*?)\)/g;
        let match;
        
        while ((match = functionCallPattern.exec(content)) !== null) {
          const [, funcName, argsStr] = match;
          
          if (this.toolRegistry.has(funcName)) {
            try {
              const args = argsStr ? JSON.parse(`{${argsStr}}`) : {};
              toolCalls.push({
                id: `call_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                name: funcName,
                args
              });
            } catch (e) {
              this.logger.warn('解析函数调用参数失败:', e);
            }
          }
        }
      }
      
    } catch (error) {
      this.logger.error('解析工具调用失败:', error);
    }
    
    return toolCalls;
  }

  /**
   * 构建带工具定义的提示
   */
  buildToolAwarePrompt(originalPrompt, requestedTools = []) {
    const availableTools = this.getAvailableToolsInfo(requestedTools);
    
    const toolDefinitions = availableTools.map(tool => ({
      name: tool.name,
      description: tool.description || `${tool.name} 工具`,
      parameters: tool.schema || {}
    }));

    const systemPrompt = `你是一个智能助手，可以调用以下工具来完成任务：

可用工具列表：
${JSON.stringify(toolDefinitions, null, 2)}

工具调用规则：
1. 当需要使用工具时，请输出标准的 JSON 格式工具调用
2. 格式示例：
\`\`\`json
[
  {
    "id": "call_1",
    "name": "tool_name",
    "args": {
      "param1": "value1",
      "param2": "value2"
    }
  }
]
\`\`\`

3. 可以同时调用多个工具
4. 工具执行结果会自动返回给你

请根据用户需求智能选择和使用工具。`;

    return {
      messages: [
        { role: 'system', content: systemPrompt },
        ...(Array.isArray(originalPrompt.messages) ? originalPrompt.messages : [
          { role: 'user', content: originalPrompt.content || originalPrompt }
        ])
      ],
      ...originalPrompt
    };
  }

  /**
   * 获取可用工具信息
   */
  getAvailableToolsInfo(requestedTools = []) {
    const tools = [];
    
    for (const [name, info] of this.toolRegistry) {
      if (requestedTools.length === 0 || requestedTools.includes(name)) {
        tools.push({
          name,
          type: info.type,
          schema: info.schema,
          description: this.generateToolDescription(name, info)
        });
      }
    }
    
    return tools;
  }

  /**
   * 生成工具描述
   */
  generateToolDescription(name, info) {
    const typeMap = {
      browser: '浏览器操作',
      mcp: 'MCP服务'
    };
    
    return `${typeMap[info.type] || '工具'} - ${name}`;
  }

  /**
   * 兼容 AgentCore 的 callTool 方法
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @param {Object} options - 调用选项
   * @returns {Promise<Object>} 工具调用结果
   */
  async callTool(toolName, args = {}, options = {}) {
    const toolCall = {
      id: options.callId || `call_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: toolName,
      args
    };
    
    return await this.executeUnifiedToolCall(toolCall);
  }

  /**
   * 兼容 AgentCore 的 handleToolCall 方法
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @param {string} callId - 调用ID
   * @returns {Promise<Object>} 工具执行结果
   */
  async handleToolCall(toolName, args, callId) {
    const toolCall = {
      id: callId,
      name: toolName,
      args
    };
    
    try {
      return await this.executeUnifiedToolCall(toolCall);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        toolName,
        callId
      };
    }
  }

  /**
   * 执行工具链 (兼容 AgentCore)
   * @param {Array} toolChain - 工具链定义
   * @param {Object} initialData - 初始数据
   * @param {Object} options - 执行选项
   * @returns {Promise<Array>} 工具链执行结果
   */
  async executeToolChain(toolChain, initialData = {}, options = {}) {
    const results = [];
    let currentData = { ...initialData };
    
    for (const toolStep of toolChain) {
      try {
        // 支持动态参数注入
        const resolvedArgs = typeof toolStep.args === 'function' 
          ? toolStep.args(currentData) 
          : toolStep.args;
          
        const result = await this.callTool(toolStep.name, resolvedArgs, options);
        
        results.push({
          step: toolStep.name,
          success: result.success,
          data: result.data || result,
          error: result.error
        });
        
        // 更新上下文数据
        if (result.success && result.data) {
          currentData = { ...currentData, ...result.data };
        }
        
      } catch (error) {
        results.push({
          step: toolStep.name,
          success: false,
          error: error.message
        });
        
        if (!options.continueOnError) {
          break;
        }
      }
    }
    
    return results;
  }

  /**
   * 获取可用工具列表 (兼容 AgentCore)
   * @returns {Array} 工具列表
   */
  getTools() {
    return Array.from(this.toolRegistry.keys()).map(name => ({
      name,
      type: this.toolRegistry.get(name).type,
      description: this.generateToolDescription(name, this.toolRegistry.get(name))
    }));
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      totalCalls: 0,
      llmCalls: 0,
      toolCalls: 0,
      mcpCalls: 0,
      browserCalls: 0,
      errors: 0
    };
  }

  /**
   * 清理资源
   */
  async cleanup() {
    if (this.mcpSystem && typeof this.mcpSystem.cleanup === 'function') {
      await this.mcpSystem.cleanup();
    }
    
    if (this.browserToolManager && typeof this.browserToolManager.cleanup === 'function') {
      await this.browserToolManager.cleanup();
    }
    
    this.initialized = false;
    this.emit('cleanup');
  }
}

/**
 * 创建 LLM Agent
 */
export function createLLMAgent(config = {}) {
  return new LLMAgent(config);
}

/**
 * 创建兼容 AgentCore 的 Agent (可直接替代 AgentCore)
 * @param {Object} config - 配置项
 * @returns {LLMAgent} Agent 实例
 */
export function createAgent(config = {}) {
  // 默认启用浏览器和 MCP 功能，保持与 AgentCore 的兼容性
  const defaultConfig = {
    browser: {
      enabled: true,
      headless: true,
      ...config.browser
    },
    mcp: {
      servers: [],
      ...config.mcp
    },
    llm: config.llm || null,
    agent: {
      maxRetries: 3,
      timeout: 30000,
      enableFallback: true,
      ...config.agent
    }
  };

  return new LLMAgent(defaultConfig);
}

// 向后兼容的导出
export const UnifiedLLMAgent = LLMAgent;
export const createUnifiedLLMAgent = createLLMAgent;
export const createUnifiedAgent = createAgent;

export default LLM;
