/**
 * 预定义的 Prompt 模板配置
 * 包含各种常用的 prompt 模板和配置
 */

/**
 * 任务类型枚举
 */
export const TaskTypes = {
  CHAT: 'chat',
  ANALYSIS: 'analysis',
  TASK_EXECUTION: 'task',
  MCP_INTERACTION: 'mcp',
  WORKFLOW: 'workflow',
  CODE_GENERATION: 'code',
  TRANSLATION: 'translation',
  SUMMARIZATION: 'summary'
};

/**
 * 基础模板配置
 */
export const BaseTemplates = {
  // 基础对话模板
  [TaskTypes.CHAT]: {
    system: '你是一个有用、准确且友善的AI助手。请用清晰、简洁的方式回答用户的问题。',
    user: '{{content}}',
    variables: ['content']
  },

  // 数据分析模板
  [TaskTypes.ANALYSIS]: {
    system: `你是一个专业的数据分析师。请对提供的数据进行深入分析：

分析要求：
- 数据类型：{{dataType}}
- 分析维度：{{dimensions}}
- 分析目标：{{objective}}
- 期望格式：{{outputFormat}}

请提供：
1. 数据概览和质量评估
2. 关键发现和趋势
3. 深入洞察和建议
4. 数据可视化建议（如适用）`,
    user: `请分析以下数据：

{{data}}

{{#additionalContext}}
附加上下文：{{additionalContext}}
{{/additionalContext}}`,
    variables: ['dataType', 'dimensions', 'objective', 'outputFormat', 'data', 'additionalContext']
  },

  // 任务执行模板
  [TaskTypes.TASK_EXECUTION]: {
    system: `你是一个高效的任务执行助手。请根据以下任务信息执行相应操作：

任务信息：
- 任务类型：{{taskType}}
- 优先级：{{priority}}
- 截止时间：{{deadline}}
- 期望输出：{{expectedOutput}}

执行原则：
1. 准确理解任务需求
2. 制定清晰的执行计划
3. 提供高质量的结果
4. 注明任何限制或假设`,
    user: `任务描述：{{description}}

{{#constraints}}
约束条件：{{constraints}}
{{/constraints}}

{{#resources}}
可用资源：{{resources}}
{{/resources}}`,
    variables: ['taskType', 'priority', 'deadline', 'expectedOutput', 'description', 'constraints', 'resources']
  },

  // MCP 服务器交互模板
  [TaskTypes.MCP_INTERACTION]: {
    system: `你是一个 MCP (Model Context Protocol) 服务器的智能接口。你需要：

1. 理解用户的请求意图
2. 选择合适的 MCP 工具
3. 生成正确的调用参数
4. 处理返回结果

可用工具：{{availableTools}}
当前会话ID：{{sessionId}}
上下文信息：{{context}}`,
    user: `用户请求：{{userRequest}}

期望操作：{{expectedAction}}

{{#previousResults}}
前置结果：{{previousResults}}
{{/previousResults}}`,
    variables: ['availableTools', 'sessionId', 'context', 'userRequest', 'expectedAction', 'previousResults']
  },

  // 工作流模板
  [TaskTypes.WORKFLOW]: {
    system: `你是一个工作流程管理器。当前执行工作流程中的一个步骤：

工作流信息：
- 流程名称：{{workflowName}}
- 当前步骤：{{currentStep}} / {{totalSteps}}
- 步骤描述：{{stepDescription}}
- 流程状态：{{workflowStatus}}

前置条件：{{prerequisites}}
成功标准：{{successCriteria}}`,
    user: `步骤输入：{{stepInput}}

{{#previousStepResults}}
前序步骤结果：{{previousStepResults}}
{{/previousStepResults}}

{{#nextStepRequirements}}
下一步需求：{{nextStepRequirements}}
{{/nextStepRequirements}}`,
    variables: ['workflowName', 'currentStep', 'totalSteps', 'stepDescription', 'workflowStatus', 'prerequisites', 'successCriteria', 'stepInput', 'previousStepResults', 'nextStepRequirements']
  },

  // 代码生成模板
  [TaskTypes.CODE_GENERATION]: {
    system: `你是一个专业的软件开发工程师。请根据要求生成高质量的代码：

开发环境：
- 编程语言：{{language}}
- 框架/库：{{framework}}
- 代码风格：{{codeStyle}}
- 目标平台：{{targetPlatform}}

编码原则：
1. 代码简洁、可读性强
2. 遵循最佳实践
3. 包含必要的注释
4. 考虑错误处理
5. 提供使用示例`,
    user: `需求描述：{{requirements}}

{{#specifications}}
技术规格：{{specifications}}
{{/specifications}}

{{#constraints}}
技术约束：{{constraints}}
{{/constraints}}

{{#examples}}
参考示例：{{examples}}
{{/examples}}`,
    variables: ['language', 'framework', 'codeStyle', 'targetPlatform', 'requirements', 'specifications', 'constraints', 'examples']
  },

  // 翻译模板
  [TaskTypes.TRANSLATION]: {
    system: `你是一个专业的翻译专家。请提供准确、自然的翻译：

翻译设置：
- 源语言：{{sourceLanguage}}
- 目标语言：{{targetLanguage}}
- 翻译风格：{{translationStyle}}
- 领域专业性：{{domain}}

翻译原则：
1. 保持原文的准确性和完整性
2. 符合目标语言的表达习惯
3. 考虑文化背景和语境
4. 专业术语保持一致性`,
    user: `请翻译以下内容：

{{sourceText}}

{{#context}}
上下文信息：{{context}}
{{/context}}

{{#glossary}}
术语对照：{{glossary}}
{{/glossary}}`,
    variables: ['sourceLanguage', 'targetLanguage', 'translationStyle', 'domain', 'sourceText', 'context', 'glossary']
  },

  // 总结模板
  [TaskTypes.SUMMARIZATION]: {
    system: `你是一个专业的内容总结专家。请根据要求提供高质量的总结：

总结要求：
- 总结类型：{{summaryType}}
- 目标长度：{{targetLength}}
- 关注重点：{{focusAreas}}
- 目标受众：{{targetAudience}}

总结原则：
1. 准确提取关键信息
2. 保持逻辑结构清晰
3. 语言简洁明了
4. 突出重要观点`,
    user: `请总结以下内容：

{{originalContent}}

{{#additionalRequirements}}
附加要求：{{additionalRequirements}}
{{/additionalRequirements}}

{{#keyPoints}}
关键要点：{{keyPoints}}
{{/keyPoints}}`,
    variables: ['summaryType', 'targetLength', 'focusAreas', 'targetAudience', 'originalContent', 'additionalRequirements', 'keyPoints']
  }
};

/**
 * 中间件配置
 */
export const MiddlewareConfigs = {
  // 变量验证中间件
  variableValidator: (requiredVars = []) => (context) => {
    const { variables } = context;
    const missing = requiredVars.filter(varName => !(varName in variables));
    if (missing.length > 0) {
      throw new Error(`缺少必需的变量: ${missing.join(', ')}`);
    }
    return context;
  },

  // 内容长度限制中间件
  contentLimiter: (maxLength = 10000) => (context) => {
    const { template, variables } = context;
    for (const [role, content] of Object.entries(template)) {
      if (typeof content === 'string' && content.length > maxLength) {
        throw new Error(`${role} 内容超过长度限制 (${maxLength} 字符)`);
      }
    }
    return context;
  },

  // 敏感词过滤中间件
  contentFilter: (bannedWords = []) => (context) => {
    const { variables } = context;
    const found = [];
    
    for (const [key, value] of Object.entries(variables)) {
      if (typeof value === 'string') {
        for (const word of bannedWords) {
          if (value.toLowerCase().includes(word.toLowerCase())) {
            found.push(`${key}: ${word}`);
          }
        }
      }
    }
    
    if (found.length > 0) {
      throw new Error(`检测到敏感词: ${found.join(', ')}`);
    }
    
    return context;
  },

  // 时间戳注入中间件
  timestampInjector: () => (context) => {
    const now = new Date();
    context.variables = {
      ...context.variables,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('zh-CN'),
      time: now.toLocaleTimeString('zh-CN'),
      unixTimestamp: Math.floor(now.getTime() / 1000)
    };
    return context;
  },

  // 追踪信息中间件
  traceInjector: (traceId) => (context) => {
    context.variables = {
      ...context.variables,
      traceId: traceId || `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    return context;
  }
};

/**
 * 预设配置组合
 */
export const PresetConfigs = {
  // 基础配置
  basic: {
    middlewares: [
      MiddlewareConfigs.timestampInjector()
    ]
  },

  // 严格模式配置
  strict: {
    middlewares: [
      MiddlewareConfigs.contentLimiter(5000),
      MiddlewareConfigs.contentFilter(['hack', 'crack', 'attack']),
      MiddlewareConfigs.timestampInjector()
    ]
  },

  // 调试模式配置
  debug: {
    middlewares: [
      MiddlewareConfigs.traceInjector(),
      MiddlewareConfigs.timestampInjector()
    ]
  },

  // 生产环境配置
  production: {
    middlewares: [
      MiddlewareConfigs.contentLimiter(8000),
      MiddlewareConfigs.contentFilter(['hack', 'crack', 'attack', 'spam']),
      MiddlewareConfigs.timestampInjector()
    ]
  }
};

/**
 * 工具函数
 */
export const PromptUtils = {
  /**
   * 创建变量映射
   * @param {Object} data - 原始数据
   * @param {Object} mapping - 字段映射
   * @returns {Object} 映射后的变量对象
   */
  mapVariables(data, mapping) {
    const variables = {};
    for (const [templateVar, dataKey] of Object.entries(mapping)) {
      if (dataKey in data) {
        variables[templateVar] = data[dataKey];
      }
    }
    return variables;
  },

  /**
   * 合并配置对象
   * @param {Object} base - 基础配置
   * @param {Object} override - 覆盖配置
   * @returns {Object} 合并后的配置
   */
  mergeConfigs(base, override) {
    return {
      ...base,
      ...override,
      variables: {
        ...base.variables,
        ...override.variables
      },
      metadata: {
        ...base.metadata,
        ...override.metadata
      }
    };
  },

  /**
   * 验证模板配置
   * @param {Object} template - 模板对象
   * @returns {boolean} 是否有效
   */
  validateTemplate(template) {
    if (!template || typeof template !== 'object') {
      return false;
    }
    
    // 至少需要 system 或 user 角色
    return !!(template.system || template.user);
  },

  /**
   * 提取所有变量名
   * @param {string} text - 模板文本
   * @returns {Array} 变量名数组
   */
  extractVariables(text) {
    if (typeof text !== 'string') {
      return [];
    }
    
    const regex = /\{\{(\w+)\}\}/g;
    const variables = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  }
};

// 汇总所有模板为 PROMPT_TEMPLATES
export const PROMPT_TEMPLATES = {
  TaskTypes,
  BaseTemplates,
  MiddlewareConfigs,
  PresetConfigs,
  PromptUtils
};

// 便捷的创建函数
export function createSystemPrompt(template, variables = {}) {
  return PromptUtils.processTemplate(template, variables);
}

export function createUserPrompt(template, variables = {}) {
  return PromptUtils.processTemplate(template, variables);
}

export function createAssistantPrompt(template, variables = {}) {
  return PromptUtils.processTemplate(template, variables);
}

export function createFunctionPrompt(template, variables = {}) {
  return PromptUtils.processTemplate(template, variables);
}

export default {
  TaskTypes,
  BaseTemplates,
  MiddlewareConfigs,
  PresetConfigs,
  PromptUtils
};
