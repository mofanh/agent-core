/**
 * Prompt 构建器 - 根据配置对象生成不同的 prompt
 * 支持模板化、条件逻辑、数据注入等功能
 */

import Logger from '../utils/logger.js';

/**
 * Prompt 构建器类
 */
export class PromptBuilder {
  constructor(options = {}) {
    this.logger = options.logger || new Logger('PromptBuilder');
    this.templates = new Map();
    this.globalVariables = new Map();
    this.middlewares = [];
    
    // 默认模板
    this.loadDefaultTemplates();
  }

  /**
   * 加载默认模板
   */
  loadDefaultTemplates() {
    // 基础对话模板
    this.registerTemplate('chat', {
      system: '你是一个有用的AI助手。',
      user: '{{content}}',
      assistant: null
    });

    // 任务执行模板
    this.registerTemplate('task', {
      system: `你是一个专业的任务执行助手。请根据以下任务描述执行相应操作：

任务类型：{{taskType}}
任务描述：{{description}}
期望输出：{{expectedOutput}}

请按照以下格式回复：
1. 理解确认：简述你对任务的理解
2. 执行步骤：列出具体的执行步骤
3. 结果输出：提供最终结果`,
      user: '任务详情：{{taskDetails}}',
      assistant: null
    });

    // 数据分析模板
    this.registerTemplate('analysis', {
      system: `你是一个专业的数据分析师。请对提供的数据进行深入分析：

分析维度：{{dimensions}}
数据类型：{{dataType}}
分析目标：{{objective}}`,
      user: '数据内容：{{data}}',
      assistant: null
    });

    // MCP 服务器交互模板
    this.registerTemplate('mcp', {
      system: `你是一个 MCP (Model Context Protocol) 服务器的接口助手。
你需要根据用户的请求生成相应的 MCP 调用指令。

可用的 MCP 工具：{{availableTools}}
当前上下文：{{context}}`,
      user: '用户请求：{{userRequest}}\n期望操作：{{expectedAction}}',
      assistant: null
    });

    // 流程链模板
    this.registerTemplate('workflow', {
      system: `你是一个工作流程管理器。当前处于流程的第 {{stepNumber}} 步。

流程名称：{{workflowName}}
当前步骤：{{currentStep}}
前置结果：{{previousResults}}
下一步骤：{{nextStep}}`,
      user: '当前输入：{{input}}',
      assistant: null
    });
  }

  /**
   * 注册新的模板
   * @param {string} name - 模板名称
   * @param {Object} template - 模板对象
   */
  registerTemplate(name, template) {
    this.templates.set(name, template);
    this.logger.info(`注册模板: ${name}`);
  }

  /**
   * 设置全局变量
   * @param {string} key - 变量名
   * @param {any} value - 变量值
   */
  setGlobalVariable(key, value) {
    this.globalVariables.set(key, value);
  }

  /**
   * 添加中间件
   * @param {Function} middleware - 中间件函数
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * 构建 prompt
   * @param {Object} config - 配置对象
   * @returns {Object} 构建好的 prompt 对象
   */
  build(config) {
    try {
      // 验证配置
      this.validateConfig(config);

      // 获取模板
      const template = this.getTemplate(config.template);
      
      // 合并变量
      const variables = this.mergeVariables(config);
      
      // 应用中间件
      let context = { config, template, variables };
      for (const middleware of this.middlewares) {
        context = middleware(context) || context;
      }

      // 构建消息
      const messages = this.buildMessages(context.template, context.variables);
      
      // 添加额外配置
      const prompt = {
        messages,
        template: config.template,
        timestamp: new Date().toISOString(),
        metadata: config.metadata || {}
      };

      // 应用后处理
      return this.postProcess(prompt, config);

    } catch (error) {
      this.logger.error('构建 prompt 失败:', error);
      throw error;
    }
  }

  /**
   * 验证配置对象
   * @param {Object} config - 配置对象
   */
  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('配置对象不能为空');
    }

    if (!config.template) {
      throw new Error('必须指定模板名称');
    }

    if (!this.templates.has(config.template)) {
      throw new Error(`未找到模板: ${config.template}`);
    }
  }

  /**
   * 获取模板
   * @param {string} templateName - 模板名称
   * @returns {Object} 模板对象
   */
  getTemplate(templateName) {
    return this.templates.get(templateName);
  }

  /**
   * 合并变量
   * @param {Object} config - 配置对象
   * @returns {Object} 合并后的变量对象
   */
  mergeVariables(config) {
    const variables = new Map();

    // 添加全局变量
    for (const [key, value] of this.globalVariables) {
      variables.set(key, value);
    }

    // 添加配置中的变量
    if (config.variables) {
      for (const [key, value] of Object.entries(config.variables)) {
        variables.set(key, value);
      }
    }

    // 添加动态变量
    variables.set('timestamp', new Date().toISOString());
    variables.set('date', new Date().toLocaleDateString());
    variables.set('time', new Date().toLocaleTimeString());

    return Object.fromEntries(variables);
  }

  /**
   * 构建消息数组
   * @param {Object} template - 模板对象
   * @param {Object} variables - 变量对象
   * @returns {Array} 消息数组
   */
  buildMessages(template, variables) {
    const messages = [];

    // 系统消息
    if (template.system) {
      messages.push({
        role: 'system',
        content: this.interpolate(template.system, variables)
      });
    }

    // 用户消息
    if (template.user) {
      messages.push({
        role: 'user',
        content: this.interpolate(template.user, variables)
      });
    }

    // 助手消息（如果有预设回复）
    if (template.assistant) {
      messages.push({
        role: 'assistant',
        content: this.interpolate(template.assistant, variables)
      });
    }

    return messages;
  }

  /**
   * 字符串插值 - 替换模板中的变量
   * @param {string} template - 模板字符串
   * @param {Object} variables - 变量对象
   * @returns {string} 插值后的字符串
   */
  interpolate(template, variables) {
    if (typeof template !== 'string') {
      return template;
    }

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (key in variables) {
        const value = variables[key];
        return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      }
      this.logger.warn(`未找到变量: ${key}`);
      return match; // 保留原始占位符
    });
  }

  /**
   * 后处理
   * @param {Object} prompt - prompt 对象
   * @param {Object} config - 配置对象
   * @returns {Object} 处理后的 prompt 对象
   */
  postProcess(prompt, config) {
    // 应用配置中的后处理选项
    if (config.maxTokens) {
      prompt.maxTokens = config.maxTokens;
    }

    if (config.temperature !== undefined) {
      prompt.temperature = config.temperature;
    }

    if (config.stream !== undefined) {
      prompt.stream = config.stream;
    }

    // 添加追踪信息
    if (config.traceId) {
      prompt.metadata.traceId = config.traceId;
    }

    return prompt;
  }

  /**
   * 获取所有模板名称
   * @returns {Array} 模板名称数组
   */
  getTemplateNames() {
    return Array.from(this.templates.keys());
  }

  /**
   * 获取模板信息
   * @param {string} name - 模板名称
   * @returns {Object} 模板信息
   */
  getTemplateInfo(name) {
    const template = this.templates.get(name);
    if (!template) {
      return null;
    }

    return {
      name,
      hasSystem: !!template.system,
      hasUser: !!template.user,
      hasAssistant: !!template.assistant,
      variables: this.extractVariables(template)
    };
  }

  /**
   * 提取模板中的变量
   * @param {Object} template - 模板对象
   * @returns {Array} 变量名数组
   */
  extractVariables(template) {
    const variables = new Set();
    const regex = /\{\{(\w+)\}\}/g;

    for (const [role, content] of Object.entries(template)) {
      if (typeof content === 'string') {
        let match;
        while ((match = regex.exec(content)) !== null) {
          variables.add(match[1]);
        }
      }
    }

    return Array.from(variables);
  }
}

/**
 * 创建 prompt 构建器实例
 * @param {Object} options - 选项
 * @returns {PromptBuilder} 构建器实例
 */
export function createPromptBuilder(options = {}) {
  return new PromptBuilder(options);
}

/**
 * 快速构建 prompt
 * @param {string} template - 模板名称
 * @param {Object} variables - 变量对象
 * @param {Object} options - 选项
 * @returns {Object} 构建好的 prompt
 */
export function buildPrompt(template, variables = {}, options = {}) {
  const builder = new PromptBuilder(options);
  return builder.build({
    template,
    variables,
    ...options
  });
}

// 默认导出
export default PromptBuilder;
