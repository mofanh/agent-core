// 导出 LLM 相关功能
export { llmStreamRequest } from './llm/stream.js';
export { 
  LLM, 
  LLMFactory, 
  sparkRequestHandler, 
  openaiRequestHandler,
  createSparkLLM, 
  createOpenAILLM,
  sparkStreamRequest 
} from './llm/index.js';

// 导出 Prompt 相关功能
export { PromptBuilder } from './prompt/index.js';
export { 
  PROMPT_TEMPLATES,
  createSystemPrompt,
  createUserPrompt,
  createAssistantPrompt,
  createFunctionPrompt
} from './prompt/templates.js';
// agent-core 主入口，根据 README 示例导出核心 API

// 引入日志类
import Logger from './utils/logger.js';

// 预设配置，适配日志等级
export const PRESET_CONFIGS = {
  basic: { name: 'basic', description: '基础配置', logger: new Logger('info') },
  performance: { name: 'performance', description: '性能优化配置', logger: new Logger('warn') },
  debug: { name: 'debug', description: '调试配置', logger: new Logger('debug') }
};

// AgentCore 主类
export class AgentCore {
  constructor(config = {}) {
    this.config = config;
    this.initialized = false;
    this.llm = null; // LLM 实例
    this.promptBuilder = null; // Prompt 构建器
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
    
    // 其他任务类型的处理逻辑
    return { status: 'completed', task: processedTask };
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

    return health;
  }

  async getCapabilities() {
    const capabilities = {
      core: ['execute', 'executeBatch', 'executeStream', 'getHealth'],
      llm: this.llm ? ['post', 'isConnect', 'streamRequest'] : [],
      prompt: this.promptBuilder ? ['build', 'getTemplates', 'addTemplate'] : []
    };
    return capabilities;
  }

  async shutdown() {
    this.initialized = false;
    this.llm = null;
    this.promptBuilder = null;
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

// 页面分析
export async function analyzePage(url, options = {}) {
  return {
    pageInfo: { url, title: 'Demo Page' },
    domStructure: '<html>...</html>'
  };
}

// DOM 操作
export async function manipulateDOM(url, actions = []) {
  return {
    url,
    actions,
    result: 'DOM 操作已模拟执行'
  };
}

// 批量处理
export async function batchProcess(tasks, options = {}) {
  return tasks.map(task => ({ ...task, status: 'done' }));
}

// 创建 agent（支持预设名或自定义配置）
export function createAgent(presetOrConfig, options = {}) {
  if (typeof presetOrConfig === 'string') {
    const config = { ...PRESET_CONFIGS[presetOrConfig], ...options };
    return new AgentCore(config);
  }
  return new AgentCore({ ...presetOrConfig, ...options });
}

// 创建带 LLM 的 Agent
export function createLLMAgent(provider, options = {}) {
  let llmConfig;
  
  if (typeof provider === 'string') {
    // 使用预注册的提供商
    llmConfig = {
      provider,
      options
    };
  } else if (typeof provider === 'function') {
    // 直接传入请求处理函数
    llmConfig = {
      requestHandler: provider,
      provider: options.provider || 'custom',
      options: options.options || {}
    };
  } else {
    // 完整配置对象
    llmConfig = provider;
  }

  const config = {
    ...PRESET_CONFIGS[options.preset || 'basic'],
    llm: llmConfig,
    ...options
  };
  
  return new AgentCore(config);
}

// 便捷的创建函数
export function createSparkAgent(options = {}) {
  return createLLMAgent('spark', options);
}

export function createOpenAIAgent(options = {}) {
  return createLLMAgent('openai', options);
}
