/**
 * 统一 LLM 调用层
 * 让 LLM 通过统一接口调用所有工具（浏览器本地工具 + MCP 工具）
 */

import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';

/**
 * 统一 Agent 调用层
 * 封装 LLM 与工具调用的接口，让 LLM 只需要输出标准的工具调用 JSON
 */
export class UnifiedLLMAgent extends EventEmitter {
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

    this.logger.info('🚀 初始化统一 LLM Agent...');

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
      this.logger.info('✅ 统一 LLM Agent 初始化完成');
      this.emit('initialized');
      
    } catch (error) {
      this.logger.error('❌ 统一 LLM Agent 初始化失败:', error);
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

    const { LLM, LLMFactory } = await import('../llm/index.js');
    
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
      const mcpTools = await this.mcpSystem.toolSystem.listTools();
      
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
      throw new Error('UnifiedLLMAgent 未初始化，请先调用 initialize()');
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
    if (this.mcpSystem) {
      await this.mcpSystem.cleanup();
    }
    
    if (this.browserToolManager) {
      await this.browserToolManager.cleanup();
    }
    
    this.initialized = false;
    this.emit('cleanup');
  }
}

/**
 * 创建统一 LLM Agent
 */
export function createUnifiedLLMAgent(config = {}) {
  return new UnifiedLLMAgent(config);
}

export default UnifiedLLMAgent;
