// 导出 LLM 相关功能
export { llmStreamRequest } from './llm/stream.js';
export { 
  LLM, 
  LLMFactory, 
  sparkRequestHandler, 
  openaiRequestHandler,
  createSparkLLM, 
  createOpenAILLM,
  sparkStreamRequest,
  LLMAgent,
  createLLMAgent,
  createAgent,
  // 向后兼容
  UnifiedLLMAgent,
  createUnifiedLLMAgent,
  createUnifiedAgent
} from './llm/index.js';

// 导出统一 LLM Agent（移除独立文件导入）
// export {
//   UnifiedLLMAgent,
//   createUnifiedLLMAgent
// } from './llm/unified-agent.js';

// 导出 Prompt 相关功能
export { PromptBuilder } from './prompt/index.js';
export { 
  PROMPT_TEMPLATES,
  createSystemPrompt,
  createUserPrompt,
  createAssistantPrompt,
  createFunctionPrompt
} from './prompt/templates.js';

// 导出 MCP 相关功能
export {
  MCPClient,
  MCPConnectionManager,
  MCPToolSystem,
  CONNECTION_STATUS,
  createMCPClient,
  createMCPConnectionManager,
  createMCPSystem
} from './mcp/index.js';

// 导出 MCP 浏览器功能
export { 
  MCPBrowserClient,
  createMCPBrowserClient
} from './mcp/browser-client.js';

// 导出浏览器工具模块
export * from './browser/index.js';

// 导出统一浏览器 MCP 服务
export {
  UnifiedBrowserMCPServer,
  createUnifiedBrowserMCPServer,
  startUnifiedBrowserMCPServer
} from './mcp/unified-browser-server.js';

export {
  UnifiedBrowserMCPClient,
  createUnifiedBrowserMCPClient
} from './mcp/unified-browser-client.js';

// agent-core 主入口，根据 README 示例导出核心 API

// 引入日志类和事件发射器
import { EventEmitter } from 'events';
import Logger from './utils/logger.js';

// 预设配置，适配日志等级
export const PRESET_CONFIGS = {
  basic: { name: 'basic', description: '基础配置', logger: new Logger('info') },
  performance: { name: 'performance', description: '性能优化配置', logger: new Logger('warn') },
  debug: { name: 'debug', description: '调试配置', logger: new Logger('debug') }
};

// AgentCore 主类
export class AgentCore extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.initialized = false;
    this.llm = null; // LLM 实例
    this.promptBuilder = null; // Prompt 构建器
    this.mcpSystem = null; // MCP 系统
    this.browserToolManager = null; // 浏览器工具管理器
  }

  async initialize() {
    this.initialized = true;
    
    // 初始化 Prompt 构建器
    if (this.config.prompt) {
      const { PromptBuilder } = await import('./prompt/index.js');
      this.promptBuilder = new PromptBuilder(this.config.prompt);
      
      // 注册自定义模板
      if (this.config.prompt.customTemplates) {
        for (const [name, template] of Object.entries(this.config.prompt.customTemplates)) {
          this.promptBuilder.registerTemplate(name, template);
        }
      }
    }
    
    // 如果配置中包含 LLM 设置，初始化 LLM 实例
    if (this.config.llm) {
      const { LLM, LLMFactory } = await import('./llm/index.js');
      
      if (this.config.llm.provider && LLMFactory.getProviders().includes(this.config.llm.provider)) {
        // 使用工厂模式创建已注册的提供商
        this.llm = LLMFactory.create(this.config.llm.provider, this.config.llm.options);
      } else if (this.config.llm.requestHandler) {
        // 直接使用配置创建
        this.llm = new LLM(this.config.llm);
      } else {
        // 兼容旧版本配置或自定义处理器
        this.llm = new LLM({
          requestHandler: this.config.llm.requestImpl || this.config.llm.requestHandler,
          provider: this.config.llm.provider || 'custom',
          options: this.config.llm.options || {}
        });
      }
    }
    
    // 如果配置中包含 MCP 设置，初始化 MCP 系统
    if (this.config.mcp) {
      const { createMCPSystem } = await import('./mcp/index.js');
      
      try {
        this.mcpSystem = await createMCPSystem({
          servers: this.config.mcp.servers || [],
          manager: this.config.mcp.manager || {},
          toolSystem: this.config.mcp.toolSystem || {}
        });
        
        // 监听 MCP 事件
        this.mcpSystem.connectionManager.on('connectionStatusChanged', (name, status) => {
          this.emit('mcpConnectionChanged', { name, status });
        });
        
        this.mcpSystem.toolSystem.on('toolCalled', (event) => {
          this.emit('mcpToolCalled', event);
        });
        
      } catch (error) {
        console.warn('MCP 系统初始化失败:', error.message);
        this.mcpSystem = null;
      }
    }
    
    // 如果配置中包含浏览器设置，初始化浏览器工具管理器
    if (this.config.browser && this.config.browser.enabled) {
      const { BrowserToolManager } = await import('./browser/tool-manager.js');
      
      try {
        this.browserToolManager = new BrowserToolManager(this.config.browser);
        
        // 监听浏览器工具事件
        this.browserToolManager.on('initialized', () => {
          this.emit('browserToolsReady');
        });
        
        this.browserToolManager.on('toolExecuted', (event) => {
          this.emit('browserToolExecuted', event);
        });
        
        this.browserToolManager.on('error', (error) => {
          this.emit('browserToolError', error);
        });
        
        // 初始化浏览器工具管理器
        await this.browserToolManager.initialize();
        
        // 如果有 MCP 系统，注册浏览器工具到工具系统
        if (this.mcpSystem && this.mcpSystem.toolSystem) {
          const browserTools = this.browserToolManager.getToolDefinitions();
          for (const tool of browserTools) {
            await this.mcpSystem.toolSystem.registerLocalTool(tool.name, tool);
          }
        }
        
      } catch (error) {
        console.warn('浏览器工具系统初始化失败:', error.message);
        this.browserToolManager = null;
      }
    }
  }

  async execute(task) {
    if (!this.initialized) {
      throw new Error('AgentCore 未初始化，请先调用 initialize()');
    }
    
    let processedTask = task;
    
    // 1. 构建 prompt（如果任务需要）
    if (task.buildPrompt && this.promptBuilder) {
      const prompt = this.promptBuilder.build(task.buildPrompt);
      processedTask = {
        ...task,
        payload: {
          ...task.payload,
          messages: prompt.messages
        }
      };
    }
    
    // 2. LLM 处理
    if (processedTask.type === 'llm' && this.llm) {
      const llmResult = await this.llm.post(processedTask.payload);
      
      // 3. 处理 LLM 输出，可能触发下一轮循环
      if (processedTask.onComplete && typeof processedTask.onComplete === 'function') {
        return await processedTask.onComplete(llmResult, this);
      }
      
      return llmResult;
    }
    
    // 4. 浏览器工具调用处理
    if (processedTask.type === 'browser_tool' && this.browserToolManager) {
      const { toolName, args = {}, callId, options = {} } = processedTask;
      
      try {
        const toolResult = await this.browserToolManager.executeLocalTool(toolName, args, callId);
        
        // 处理工具调用结果
        if (processedTask.onComplete && typeof processedTask.onComplete === 'function') {
          return await processedTask.onComplete(toolResult, this);
        }
        
        return toolResult;
      } catch (error) {
        if (processedTask.onError && typeof processedTask.onError === 'function') {
          return await processedTask.onError(error, this);
        }
        throw error;
      }
    }

    // 5. 统一工具调用处理（支持浏览器工具和MCP工具）
    if (processedTask.type === 'tool_call') {
      const { toolName, args = {}, callId } = processedTask;
      
      try {
        const toolResult = await this.handleToolCall(toolName, args, callId);
        
        // 处理工具调用结果
        if (processedTask.onComplete && typeof processedTask.onComplete === 'function') {
          return await processedTask.onComplete(toolResult, this);
        }
        
        return toolResult;
      } catch (error) {
        if (processedTask.onError && typeof processedTask.onError === 'function') {
          return await processedTask.onError(error, this);
        }
        throw error;
      }
    }

    // 6. MCP 工具调用处理
    if (processedTask.type === 'mcp_tool' && this.mcpSystem) {
      const { toolName, args = {}, options = {} } = processedTask;
      
      try {
        const toolResult = await this.mcpSystem.callTool(toolName, args, options);
        
        // 处理工具调用结果
        if (processedTask.onComplete && typeof processedTask.onComplete === 'function') {
          return await processedTask.onComplete(toolResult, this);
        }
        
        return toolResult;
      } catch (error) {
        if (processedTask.onError && typeof processedTask.onError === 'function') {
          return await processedTask.onError(error, this);
        }
        throw error;
      }
    }
    
    // 7. MCP 工具链执行
    if (processedTask.type === 'mcp_chain' && this.mcpSystem) {
      const { toolChain, initialData = {}, options = {} } = processedTask;
      
      try {
        const chainResult = await this.mcpSystem.executeToolChain(toolChain, initialData, options);
        
        if (processedTask.onComplete && typeof processedTask.onComplete === 'function') {
          return await processedTask.onComplete(chainResult, this);
        }
        
        return chainResult;
      } catch (error) {
        if (processedTask.onError && typeof processedTask.onError === 'function') {
          return await processedTask.onError(error, this);
        }
        throw error;
      }
    }
    
    // 8. 混合任务：LLM + MCP 协作
    if (processedTask.type === 'hybrid' && this.llm && this.mcpSystem) {
      return await this.executeHybridTask(processedTask);
    }
    
    // 其他任务类型的处理逻辑
    return { status: 'completed', task: processedTask };
  }

  /**
   * 处理工具调用（参考 codex-rs 的 handle_function_call 逻辑）
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @param {string} callId - 调用ID
   * @returns {Promise<Object>} 工具执行结果
   */
  async handleToolCall(toolName, args, callId) {
    if (!this.initialized) {
      throw new Error('AgentCore 未初始化，请先调用 initialize()');
    }

    // 本地浏览器工具优先匹配（类似 codex 的本地工具处理）
    if (this.browserToolManager && this.browserToolManager.isToolAvailable(toolName)) {
      try {
        return await this.browserToolManager.executeLocalTool(toolName, args, callId);
      } catch (error) {
        // 浏览器工具执行失败，返回结构化错误
        return {
          success: false,
          error: error.message,
          toolName,
          callId
        };
      }
    }

    // 尝试 MCP 工具解析（类似 codex 的 mcp_connection_manager.parse_tool_name）
    if (this.mcpSystem && this.mcpSystem.toolSystem) {
      try {
        const mcpResult = await this.mcpSystem.toolSystem.callTool(toolName, args, { callId });
        return {
          success: true,
          data: mcpResult,
          toolName,
          callId
        };
      } catch (error) {
        // 如果 MCP 工具也失败，检查是否是未知工具
        if (error.message.includes('Unknown tool') || error.message.includes('not found')) {
          // 未知工具：返回结构化失败信息，让模型能够适应
          return {
            success: false,
            error: `unsupported tool: ${toolName}`,
            toolName,
            callId
          };
        }
        
        // 其他 MCP 工具执行错误
        return {
          success: false,
          error: error.message,
          toolName,
          callId
        };
      }
    }

    // 完全未知的工具
    return {
      success: false,
      error: `unsupported tool: ${toolName}`,
      toolName,
      callId
    };
  }

  /**
   * 执行混合任务：LLM和MCP协作
   * @private
   */
  async executeHybridTask(task) {
    const { workflow, initialPrompt, finalPrompt } = task;
    let currentData = {};
    let results = [];

    // 1. 初始LLM调用获取计划或参数
    if (initialPrompt) {
      const llmResult = await this.llm.post(initialPrompt);
      currentData = { llmResult };
      results.push({ type: 'llm', result: llmResult });
    }

    // 2. 执行工作流步骤
    for (const step of workflow || []) {
      if (step.type === 'llm') {
        const prompt = this.buildDynamicPrompt(step.prompt, currentData);
        const llmResult = await this.llm.post(prompt);
        currentData = { ...currentData, [step.name || 'llmResult']: llmResult };
        results.push({ type: 'llm', name: step.name, result: llmResult });
        
      } else if (step.type === 'mcp_tool') {
        const args = this.buildDynamicArgs(step.args, currentData);
        const toolResult = await this.mcpSystem.callTool(step.toolName, args);
        currentData = { ...currentData, [step.name || 'toolResult']: toolResult };
        results.push({ type: 'mcp_tool', name: step.name, result: toolResult });
        
      } else if (step.type === 'mcp_chain') {
        const mappedChain = this.buildDynamicToolChain(step.toolChain, currentData);
        const chainResult = await this.mcpSystem.executeToolChain(mappedChain, currentData);
        currentData = { ...currentData, [step.name || 'chainResult']: chainResult };
        results.push({ type: 'mcp_chain', name: step.name, result: chainResult });
      }
    }

    // 3. 最终LLM总结
    if (finalPrompt) {
      const prompt = this.buildDynamicPrompt(finalPrompt, currentData);
      const finalResult = await this.llm.post(prompt);
      results.push({ type: 'llm_final', result: finalResult });
      return finalResult;
    }

    return { results, finalData: currentData };
  }

  /**
   * 构建动态Prompt
   * @private
   */
  buildDynamicPrompt(promptTemplate, data) {
    if (typeof promptTemplate === 'function') {
      return promptTemplate(data);
    }
    if (typeof promptTemplate === 'string') {
      // 简单的模板替换
      return promptTemplate.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match;
      });
    }
    return promptTemplate;
  }

  /**
   * 构建动态参数
   * @private
   */
  buildDynamicArgs(argsTemplate, data) {
    if (typeof argsTemplate === 'function') {
      return argsTemplate(data);
    }
    if (typeof argsTemplate === 'object') {
      const result = {};
      for (const [key, value] of Object.entries(argsTemplate)) {
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          const dataKey = value.slice(2, -2);
          result[key] = data[dataKey];
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    return argsTemplate;
  }

  /**
   * 构建动态工具链
   * @private
   */
  buildDynamicToolChain(chainTemplate, data) {
    return chainTemplate.map(step => ({
      ...step,
      args: this.buildDynamicArgs(step.args, data)
    }));
  }

  async executeBatch(tasks, options = {}) {
    const results = [];
    for (const task of tasks) {
      try {
        const result = await this.execute(task);
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    return results;
  }

  async executeStream(task) {
    if (!this.initialized) {
      throw new Error('AgentCore 未初始化，请先调用 initialize()');
    }
    
    // 如果任务需要 LLM 流式处理
    if (task.type === 'llm' && this.llm) {
      return this.llm.post(task.payload);
    }
    
    // 其他流式任务处理
    return async function* () {
      yield { status: 'completed', task };
    }();
  }

  async getHealth() {
    const health = {
      status: this.initialized ? 'healthy' : 'not_initialized',
      timestamp: new Date().toISOString(),
      components: {}
    };

    // 检查 LLM 连接状态
    if (this.llm) {
      try {
        const llmConnected = await this.llm.isConnect();
        health.components.llm = {
          status: llmConnected ? 'connected' : 'disconnected',
          connected: llmConnected
        };
      } catch (error) {
        health.components.llm = {
          status: 'error',
          error: error.message
        };
      }
    }

    // 检查 MCP 系统状态
    if (this.mcpSystem) {
      try {
        const mcpStatus = this.mcpSystem.getStatus();
        health.components.mcp = {
          status: mcpStatus.readyConnections > 0 ? 'connected' : 'disconnected',
          totalConnections: mcpStatus.totalConnections,
          readyConnections: mcpStatus.readyConnections,
          errorConnections: mcpStatus.errorConnections,
          connectingConnections: mcpStatus.connectingConnections
        };
      } catch (error) {
        health.components.mcp = {
          status: 'error',
          error: error.message
        };
      }
    }

    // 检查浏览器工具状态
    if (this.browserToolManager) {
      try {
        const browserHealth = await this.browserToolManager.getHealthStatus();
        health.components.browser = {
          status: browserHealth.overall ? 'healthy' : 'unhealthy',
          manager: browserHealth.manager,
          browser: browserHealth.browser,
          metrics: browserHealth.metrics
        };
      } catch (error) {
        health.components.browser = {
          status: 'error',
          error: error.message
        };
      }
    }

    return health;
  }

  async getCapabilities() {
    const capabilities = {
      core: ['execute', 'executeBatch', 'executeStream', 'getHealth', 'handleToolCall'],
      llm: this.llm ? ['post', 'isConnect', 'streamRequest'] : [],
      prompt: this.promptBuilder ? ['build', 'getTemplates', 'addTemplate'] : [],
      mcp: this.mcpSystem ? ['callTool', 'executeToolChain', 'getTools', 'getStatus'] : [],
      browser: this.browserToolManager ? ['executeLocalTool', 'getToolDefinitions', 'getMetrics'] : []
    };
    
    // 添加可用的MCP工具列表
    if (this.mcpSystem) {
      try {
        const tools = this.mcpSystem.getTools();
        capabilities.mcpTools = tools.map(tool => ({
          name: tool.name,
          title: tool.title,
          description: tool.description
        }));
      } catch (error) {
        capabilities.mcpTools = [];
      }
    }
    
    // 添加可用的浏览器工具列表
    if (this.browserToolManager) {
      try {
        const browserTools = this.browserToolManager.getToolDefinitions();
        capabilities.browserTools = browserTools.map(tool => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }));
      } catch (error) {
        capabilities.browserTools = [];
      }
    }
    
    return capabilities;
  }

  async shutdown() {
    this.initialized = false;
    
    // 关闭浏览器工具管理器
    if (this.browserToolManager) {
      try {
        await this.browserToolManager.cleanup();
      } catch (error) {
        console.warn('浏览器工具管理器关闭时出错:', error.message);
      }
      this.browserToolManager = null;
    }
    
    // 关闭 MCP 系统
    if (this.mcpSystem) {
      try {
        await this.mcpSystem.shutdown();
      } catch (error) {
        console.warn('MCP系统关闭时出错:', error.message);
      }
      this.mcpSystem = null;
    }
    
    this.llm = null;
    this.promptBuilder = null;
  }

  // ==================== MCP 便捷方法 ====================

  /**
   * 调用MCP工具
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @param {Object} options - 调用选项
   * @returns {Promise<Object>} 工具调用结果
   */
  async callTool(toolName, args = {}, options = {}) {
    if (!this.mcpSystem) {
      throw new Error('MCP系统未初始化');
    }
    return await this.mcpSystem.callTool(toolName, args, options);
  }

  /**
   * 执行工具链
   * @param {Array} toolChain - 工具链定义
   * @param {Object} initialData - 初始数据
   * @param {Object} options - 执行选项
   * @returns {Promise<Array>} 工具链执行结果
   */
  async executeToolChain(toolChain, initialData = {}, options = {}) {
    if (!this.mcpSystem) {
      throw new Error('MCP系统未初始化');
    }
    return await this.mcpSystem.executeToolChain(toolChain, initialData, options);
  }

  /**
   * 获取可用工具列表
   * @returns {Array} 工具列表
   */
  getTools() {
    if (!this.mcpSystem) {
      return [];
    }
    return this.mcpSystem.getTools();
  }

  /**
   * 获取MCP系统状态
   * @returns {Object} 系统状态
   */
  getMCPStatus() {
    if (!this.mcpSystem) {
      return { status: 'not_initialized' };
    }
    return this.mcpSystem.getStatus();
  }
}

// 快速启动
export async function quickStart(preset = 'basic', options = {}) {
  const agent = new AgentCore({ ...PRESET_CONFIGS[preset], ...options });
  await agent.initialize();
  
  if (options.task) {
    return agent.execute(options.task);
  }
  
  return agent;
}

// 页面分析 - 现在使用真实的MCP工具
export async function analyzePage(url, options = {}) {
  // 尝试使用MCP工具进行真实的页面分析
  try {
    const agent = await createMCPAgent({
      servers: [
        { name: 'web', transport: 'stdio', command: 'web-mcp-server' }
      ]
    });
    
    return await agent.executeToolChain([
      {
        tool: 'fetch_page',
        args: { url }
      },
      {
        tool: 'extract_page_info',
        dataMapping: (data, results) => ({ 
          html: results[0]?.data?.content 
        })
      },
      {
        tool: 'analyze_dom_structure',
        dataMapping: (data, results) => ({ 
          html: results[0]?.data?.content 
        })
      }
    ], { url });
    
  } catch (error) {
    // 如果MCP工具不可用，返回模拟数据
    console.warn('MCP工具不可用，返回模拟数据:', error.message);
    return {
      pageInfo: { 
        url, 
        title: 'Demo Page', 
        description: '模拟页面分析结果',
        status: 'simulated'
      },
      domStructure: '<html>...</html>'
    };
  }
}

// DOM 操作 - 现在使用真实的MCP工具
export async function manipulateDOM(url, actions = []) {
  try {
    const agent = await createMCPAgent({
      servers: [
        { name: 'dom', transport: 'stdio', command: 'dom-mcp-server' }
      ]
    });
    
    const results = [];
    
    // 首先导航到页面
    await agent.callTool('navigate', { url });
    
    // 执行每个动作
    for (const action of actions) {
      let result;
      
      switch (action.type) {
        case 'click':
          result = await agent.callTool('click_element', { 
            selector: action.selector 
          });
          break;
          
        case 'fill':
          result = await agent.callTool('fill_input', { 
            selector: action.selector, 
            value: action.value 
          });
          break;
          
        case 'wait':
          result = await agent.callTool('wait', { 
            duration: action.duration 
          });
          break;
          
        default:
          result = { error: `Unknown action type: ${action.type}` };
      }
      
      results.push({ action, result });
    }
    
    return {
      url,
      actions: results,
      status: 'completed'
    };
    
  } catch (error) {
    console.warn('DOM操作工具不可用，返回模拟结果:', error.message);
    return {
      url,
      actions: actions.map(action => ({ 
        action, 
        result: { status: 'simulated', message: 'DOM 操作已模拟执行' }
      })),
      status: 'simulated'
    };
  }
}

// 批量处理 - 现在支持真实的MCP任务
export async function batchProcess(tasks, options = {}) {
  const results = [];
  
  for (const task of tasks) {
    try {
      let result;
      
      if (task.task === 'analyze_page') {
        result = await analyzePage(task.target, task.options);
      } else if (task.task === 'fill_form') {
        result = await manipulateDOM(task.target, [
          { type: 'fill', selector: '#email', value: task.data?.email || '' }
        ]);
      } else {
        // 通用任务处理
        result = { ...task, status: 'done' };
      }
      
      results.push({ 
        task, 
        result, 
        success: true, 
        timestamp: new Date().toISOString() 
      });
      
    } catch (error) {
      results.push({ 
        task, 
        error: error.message, 
        success: false, 
        timestamp: new Date().toISOString() 
      });
    }
  }
  
  return results;
}

// 便捷的创建函数（使用从 llm/index.js 导入的 createLLMAgent 和 createAgent）
export function createSparkAgent(options = {}) {
  return createLLMAgent('spark', options);
}

export function createOpenAIAgent(options = {}) {
  return createLLMAgent('openai', options);
}

// 创建带 MCP 的 Agent
export async function createMCPAgent(mcpConfig, agentOptions = {}) {
  const config = {
    ...PRESET_CONFIGS[agentOptions.preset || 'basic'],
    mcp: mcpConfig,
    ...agentOptions
  };
  
  const agent = new AgentCore(config);
  await agent.initialize();
  return agent;
}

// 创建完整的智能代理 (LLM + MCP)
export async function createSmartAgent(config = {}) {
  const {
    llm = {},
    mcp = {},
    prompt = {},
    preset = 'basic',
    ...otherOptions
  } = config;
  
  const agentConfig = {
    ...PRESET_CONFIGS[preset],
    llm,
    mcp,
    prompt,
    ...otherOptions
  };
  
  const agent = new AgentCore(agentConfig);
  await agent.initialize();
  return agent;
}

// 预设的智能代理配置
export const SMART_AGENT_PRESETS = {
  // 网页操作代理
  webAgent: {
    mcp: {
      servers: [
        { 
          name: 'web', 
          transport: 'stdio', 
          command: 'web-mcp-server',
          args: ['--headless']
        },
        { 
          name: 'dom', 
          transport: 'stdio', 
          command: 'dom-mcp-server' 
        }
      ]
    },
    llm: {
      provider: 'openai',
      options: { model: 'gpt-4' }
    }
  },
  
  // 文件处理代理
  fileAgent: {
    mcp: {
      servers: [
        { 
          name: 'file', 
          transport: 'stdio', 
          command: 'file-mcp-server' 
        },
        { 
          name: 'text', 
          transport: 'stdio', 
          command: 'text-processor-server' 
        }
      ]
    },
    llm: {
      provider: 'openai',
      options: { model: 'gpt-4' }
    }
  },
  
  // 数据分析代理
  dataAgent: {
    mcp: {
      servers: [
        { 
          name: 'data', 
          transport: 'stdio', 
          command: 'data-analysis-server' 
        },
        { 
          name: 'chart', 
          transport: 'stdio', 
          command: 'chart-generator-server' 
        }
      ]
    },
    llm: {
      provider: 'openai',
      options: { model: 'gpt-4' }
    }
  },
  
  // 全能代理
  universalAgent: {
    mcp: {
      servers: [
        { name: 'web', transport: 'stdio', command: 'web-mcp-server' },
        { name: 'file', transport: 'stdio', command: 'file-mcp-server' },
        { name: 'data', transport: 'stdio', command: 'data-analysis-server' },
        { name: 'system', transport: 'stdio', command: 'system-mcp-server' }
      ],
      manager: {
        loadBalanceStrategy: 'least-connections',
        healthCheckInterval: 30000
      }
    },
    llm: {
      provider: 'openai',
      options: { model: 'gpt-4' }
    }
  }
};

// 使用预设创建智能代理
export async function createPresetAgent(presetName, overrides = {}) {
  const preset = SMART_AGENT_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }
  
  const config = {
    ...preset,
    ...overrides,
    // 深度合并MCP配置
    mcp: {
      ...preset.mcp,
      ...overrides.mcp,
      servers: overrides.mcp?.servers || preset.mcp?.servers
    }
  };
  
  return await createSmartAgent(config);
}

// 高级工作流执行器
export async function executeWorkflow(workflowDefinition, options = {}) {
  const {
    agentPreset = 'universalAgent',
    agentConfig = {},
    sessionId,
    timeout = 300000 // 5分钟默认超时
  } = options;
  
  // 创建代理
  const agent = await createPresetAgent(agentPreset, agentConfig);
  
  try {
    // 执行工作流
    const result = await Promise.race([
      agent.execute({
        type: 'hybrid',
        workflow: workflowDefinition.steps,
        initialPrompt: workflowDefinition.initialPrompt,
        finalPrompt: workflowDefinition.finalPrompt,
        sessionId
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Workflow timeout')), timeout)
      )
    ]);
    
    return {
      success: true,
      result,
      workflowId: workflowDefinition.id,
      executedAt: new Date().toISOString()
    };
    
  } finally {
    // 清理资源
    await agent.shutdown();
  }
}
