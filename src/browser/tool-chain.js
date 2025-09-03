/**
 * 浏览器工具链批量执行系统
 * 支持工具链组合、并行执行和复杂工作流
 */

import { EventEmitter } from 'events';

export class BrowserToolChain extends EventEmitter {
  constructor(toolManager, config = {}) {
    super();
    
    this.toolManager = toolManager;
    this.config = {
      maxConcurrency: config.maxConcurrency || 3,
      defaultTimeout: config.defaultTimeout || 60000,
      retryAttempts: config.retryAttempts || 2,
      retryDelay: config.retryDelay || 1000,
      continueOnError: config.continueOnError || false,
      ...config
    };
    
    this.chains = new Map(); // chainId -> ChainExecution
    this.templates = new Map(); // templateName -> ChainTemplate
    
    // 注册内置模板
    this.registerBuiltinTemplates();
  }
  
  /**
   * 注册内置工具链模板
   * @private
   */
  registerBuiltinTemplates() {
    // 页面分析模板
    this.registerTemplate('page-analysis', {
      name: 'page-analysis',
      description: '完整的页面分析流程',
      steps: [
        {
          id: 'navigate',
          tool: 'browser.navigate',
          params: {
            url: '{{url}}',
            waitFor: '{{waitSelector}}'
          }
        },
        {
          id: 'screenshot',
          tool: 'browser.screenshot',
          params: {
            format: 'png',
            fullPage: true
          },
          dependsOn: ['navigate']
        },
        {
          id: 'extract-title',
          tool: 'browser.extract',
          params: {
            selector: 'title',
            attribute: 'text'
          },
          dependsOn: ['navigate']
        },
        {
          id: 'extract-content',
          tool: 'browser.extract',
          params: {
            selector: '{{contentSelector}}',
            attribute: 'text',
            multiple: true
          },
          dependsOn: ['navigate']
        }
      ],
      variables: {
        url: { required: true, type: 'string' },
        waitSelector: { required: false, type: 'string', default: 'body' },
        contentSelector: { required: false, type: 'string', default: 'p, h1, h2, h3' }
      }
    });
    
    // 表单填写模板
    this.registerTemplate('form-filling', {
      name: 'form-filling',
      description: '自动化表单填写流程',
      steps: [
        {
          id: 'navigate',
          tool: 'browser.navigate',
          params: {
            url: '{{url}}',
            waitFor: '{{formSelector}}'
          }
        },
        {
          id: 'fill-fields',
          tool: 'browser.type',
          params: {
            selector: '{{fieldSelector}}',
            text: '{{fieldValue}}',
            clear: true
          },
          dependsOn: ['navigate'],
          repeat: '{{fields}}' // 支持重复执行
        },
        {
          id: 'submit',
          tool: 'browser.click',
          params: {
            selector: '{{submitSelector}}'
          },
          dependsOn: ['fill-fields']
        },
        {
          id: 'verify',
          tool: 'browser.extract',
          params: {
            selector: '{{successSelector}}',
            attribute: 'text'
          },
          dependsOn: ['submit'],
          optional: true
        }
      ],
      variables: {
        url: { required: true, type: 'string' },
        formSelector: { required: false, type: 'string', default: 'form' },
        fields: { required: true, type: 'array' },
        submitSelector: { required: true, type: 'string' },
        successSelector: { required: false, type: 'string' }
      }
    });
    
    // 数据采集模板
    this.registerTemplate('data-scraping', {
      name: 'data-scraping',
      description: '数据采集和分页处理',
      steps: [
        {
          id: 'navigate',
          tool: 'browser.navigate',
          params: {
            url: '{{url}}'
          }
        },
        {
          id: 'extract-data',
          tool: 'browser.extract',
          params: {
            selector: '{{dataSelector}}',
            attribute: '{{dataAttribute}}',
            multiple: true
          },
          dependsOn: ['navigate']
        },
        {
          id: 'check-next',
          tool: 'browser.evaluate',
          params: {
            code: 'document.querySelector("{{nextSelector}}") !== null'
          },
          dependsOn: ['extract-data']
        },
        {
          id: 'next-page',
          tool: 'browser.click',
          params: {
            selector: '{{nextSelector}}'
          },
          dependsOn: ['check-next'],
          condition: 'prev.result === true',
          loop: true
        }
      ],
      variables: {
        url: { required: true, type: 'string' },
        dataSelector: { required: true, type: 'string' },
        dataAttribute: { required: false, type: 'string', default: 'text' },
        nextSelector: { required: false, type: 'string', default: '.next' }
      }
    });
  }
  
  /**
   * 注册工具链模板
   * @param {string} name - 模板名称
   * @param {Object} template - 模板定义
   */
  registerTemplate(name, template) {
    this.templates.set(name, {
      ...template,
      createdAt: new Date(),
      usageCount: 0
    });
  }
  
  /**
   * 获取模板列表
   * @returns {Array} 模板列表
   */
  getTemplates() {
    return Array.from(this.templates.values());
  }
  
  /**
   * 执行工具链
   * @param {Object} chainConfig - 工具链配置
   * @returns {Promise<Object>} 执行结果
   */
  async executeChain(chainConfig) {
    const chainId = `chain_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const chain = {
      id: chainId,
      config: chainConfig,
      startTime: Date.now(),
      status: 'running',
      steps: new Map(),
      results: new Map(),
      errors: [],
      completedSteps: new Set(),
      failedSteps: new Set()
    };
    
    this.chains.set(chainId, chain);
    
    try {
      this.emit('chainStarted', { chainId, config: chainConfig });
      
      let steps;
      
      if (chainConfig.template) {
        // 使用模板执行
        steps = await this.executeFromTemplate(chain, chainConfig.template, chainConfig.variables);
      } else if (chainConfig.steps) {
        // 自定义步骤执行
        steps = await this.executeCustomSteps(chain, chainConfig.steps);
      } else {
        throw new Error('工具链配置缺少 template 或 steps');
      }
      
      const endTime = Date.now();
      chain.endTime = endTime;
      chain.duration = endTime - chain.startTime;
      chain.status = 'completed';
      
      const result = {
        success: true,
        chainId,
        duration: chain.duration,
        stepsExecuted: chain.completedSteps.size,
        stepsFailed: chain.failedSteps.size,
        results: Object.fromEntries(chain.results),
        summary: this.generateChainSummary(chain)
      };
      
      this.emit('chainCompleted', { chainId, result });
      
      return result;
      
    } catch (error) {
      chain.status = 'failed';
      chain.error = error.message;
      chain.endTime = Date.now();
      chain.duration = chain.endTime - chain.startTime;
      
      this.emit('chainFailed', { chainId, error: error.message });
      
      throw new Error(`工具链执行失败: ${error.message}`);
    }
  }
  
  /**
   * 使用模板执行工具链
   * @param {Object} chain - 工具链对象
   * @param {string} templateName - 模板名称
   * @param {Object} variables - 变量值
   * @returns {Promise<Array>} 执行步骤
   * @private
   */
  async executeFromTemplate(chain, templateName, variables = {}) {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`未找到模板: ${templateName}`);
    }
    
    // 验证变量
    this.validateVariables(template.variables, variables);
    
    // 处理模板步骤
    const processedSteps = this.processTemplateSteps(template.steps, variables);
    
    // 更新模板使用次数
    template.usageCount++;
    
    return await this.executeSteps(chain, processedSteps);
  }
  
  /**
   * 执行自定义步骤
   * @param {Object} chain - 工具链对象
   * @param {Array} steps - 步骤列表
   * @returns {Promise<Array>} 执行结果
   * @private
   */
  async executeCustomSteps(chain, steps) {
    return await this.executeSteps(chain, steps);
  }
  
  /**
   * 执行步骤列表
   * @param {Object} chain - 工具链对象
   * @param {Array} steps - 步骤列表
   * @returns {Promise<Array>} 执行结果
   * @private
   */
  async executeSteps(chain, steps) {
    const stepMap = new Map(steps.map(step => [step.id, step]));
    const executionOrder = this.calculateExecutionOrder(steps);
    const concurrencyQueue = [];
    
    for (const batch of executionOrder) {
      const batchPromises = batch.map(stepId => 
        this.executeStep(chain, stepMap.get(stepId))
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      // 处理批次结果
      for (let i = 0; i < batch.length; i++) {
        const stepId = batch[i];
        const result = batchResults[i];
        
        if (result.status === 'fulfilled') {
          chain.completedSteps.add(stepId);
          chain.results.set(stepId, result.value);
        } else {
          chain.failedSteps.add(stepId);
          chain.errors.push({
            stepId,
            error: result.reason.message,
            timestamp: Date.now()
          });
          
          // 检查是否继续执行
          if (!this.config.continueOnError) {
            throw new Error(`步骤 ${stepId} 执行失败: ${result.reason.message}`);
          }
        }
      }
    }
    
    return steps;
  }
  
  /**
   * 执行单个步骤
   * @param {Object} chain - 工具链对象
   * @param {Object} step - 步骤定义
   * @returns {Promise<*>} 执行结果
   * @private
   */
  async executeStep(chain, step) {
    const stepId = step.id;
    const startTime = Date.now();
    
    try {
      this.emit('stepStarted', { chainId: chain.id, stepId, step });
      
      // 检查条件
      if (step.condition && !this.evaluateCondition(step.condition, chain)) {
        this.emit('stepSkipped', { chainId: chain.id, stepId, reason: 'condition not met' });
        return { skipped: true, reason: 'condition not met' };
      }
      
      // 处理重复执行
      if (step.repeat) {
        return await this.executeRepeatedStep(chain, step);
      }
      
      // 执行工具
      const result = await this.toolManager.executeLocalTool(
        step.tool,
        step.params,
        `${chain.id}_${stepId}`
      );
      
      const duration = Date.now() - startTime;
      
      this.emit('stepCompleted', { 
        chainId: chain.id, 
        stepId, 
        duration, 
        result 
      });
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.emit('stepFailed', { 
        chainId: chain.id, 
        stepId, 
        duration, 
        error: error.message 
      });
      
      // 尝试重试
      if (step.retryAttempts || this.config.retryAttempts > 0) {
        const retryAttempts = step.retryAttempts || this.config.retryAttempts;
        return await this.retryStep(chain, step, error, retryAttempts);
      }
      
      throw error;
    }
  }
  
  /**
   * 执行重复步骤
   * @param {Object} chain - 工具链对象
   * @param {Object} step - 步骤定义
   * @returns {Promise<Array>} 执行结果数组
   * @private
   */
  async executeRepeatedStep(chain, step) {
    const repeatData = this.resolveRepeatData(step.repeat, chain);
    const results = [];
    
    for (let i = 0; i < repeatData.length; i++) {
      const item = repeatData[i];
      const instanceParams = this.replaceVariables(step.params, item);
      
      try {
        const result = await this.toolManager.executeLocalTool(
          step.tool,
          instanceParams,
          `${chain.id}_${step.id}_${i}`
        );
        results.push(result);
      } catch (error) {
        if (!this.config.continueOnError) {
          throw error;
        }
        results.push({ error: error.message, index: i });
      }
    }
    
    return results;
  }
  
  /**
   * 重试步骤执行
   * @param {Object} chain - 工具链对象
   * @param {Object} step - 步骤定义
   * @param {Error} lastError - 上次的错误
   * @param {number} attemptsLeft - 剩余重试次数
   * @returns {Promise<*>} 执行结果
   * @private
   */
  async retryStep(chain, step, lastError, attemptsLeft) {
    if (attemptsLeft <= 0) {
      throw lastError;
    }
    
    const retryDelay = step.retryDelay || this.config.retryDelay;
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    this.emit('stepRetry', { 
      chainId: chain.id, 
      stepId: step.id, 
      attemptsLeft, 
      lastError: lastError.message 
    });
    
    try {
      return await this.executeStep(chain, step);
    } catch (error) {
      return await this.retryStep(chain, step, error, attemptsLeft - 1);
    }
  }
  
  /**
   * 计算执行顺序
   * @param {Array} steps - 步骤列表
   * @returns {Array<Array>} 批次执行顺序
   * @private
   */
  calculateExecutionOrder(steps) {
    const stepMap = new Map(steps.map(step => [step.id, step]));
    const visited = new Set();
    const batches = [];
    
    while (visited.size < steps.length) {
      const batch = [];
      
      for (const step of steps) {
        if (visited.has(step.id)) continue;
        
        // 检查依赖是否已完成
        const dependencies = step.dependsOn || [];
        const dependenciesComplete = dependencies.every(dep => visited.has(dep));
        
        if (dependenciesComplete) {
          batch.push(step.id);
        }
      }
      
      if (batch.length === 0) {
        throw new Error('检测到循环依赖或无法解决的依赖关系');
      }
      
      batch.forEach(stepId => visited.add(stepId));
      batches.push(batch);
    }
    
    return batches;
  }
  
  /**
   * 验证模板变量
   * @param {Object} templateVariables - 模板变量定义
   * @param {Object} providedVariables - 提供的变量值
   * @private
   */
  validateVariables(templateVariables, providedVariables) {
    for (const [name, definition] of Object.entries(templateVariables)) {
      if (definition.required && !(name in providedVariables)) {
        throw new Error(`缺少必需的变量: ${name}`);
      }
      
      if (name in providedVariables) {
        const value = providedVariables[name];
        const type = definition.type;
        
        if (type && !this.validateVariableType(value, type)) {
          throw new Error(`变量 ${name} 类型错误，期望 ${type}，实际 ${typeof value}`);
        }
      }
    }
  }
  
  /**
   * 验证变量类型
   * @param {*} value - 变量值
   * @param {string} expectedType - 期望类型
   * @returns {boolean} 是否匹配
   * @private
   */
  validateVariableType(value, expectedType) {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }
  
  /**
   * 处理模板步骤（替换变量）
   * @param {Array} steps - 步骤列表
   * @param {Object} variables - 变量值
   * @returns {Array} 处理后的步骤
   * @private
   */
  processTemplateSteps(steps, variables) {
    return steps.map(step => ({
      ...step,
      params: this.replaceVariables(step.params, variables)
    }));
  }
  
  /**
   * 替换变量
   * @param {Object} obj - 要处理的对象
   * @param {Object} variables - 变量值
   * @returns {Object} 处理后的对象
   * @private
   */
  replaceVariables(obj, variables) {
    if (typeof obj === 'string') {
      return obj.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        return variables[varName] !== undefined ? variables[varName] : match;
      });
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceVariables(item, variables));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceVariables(value, variables);
      }
      return result;
    }
    
    return obj;
  }
  
  /**
   * 评估条件
   * @param {string} condition - 条件表达式
   * @param {Object} chain - 工具链对象
   * @returns {boolean} 条件结果
   * @private
   */
  evaluateCondition(condition, chain) {
    // 简单的条件评估器
    // 支持 prev.result === true 等表达式
    try {
      const context = {
        prev: chain.results.size > 0 ? Array.from(chain.results.values()).pop() : null,
        results: Object.fromEntries(chain.results)
      };
      
      // 简单的表达式评估（生产环境需要更安全的实现）
      return new Function('context', `with(context) { return ${condition}; }`)(context);
    } catch (error) {
      console.warn('条件评估失败:', condition, error);
      return false;
    }
  }
  
  /**
   * 解析重复数据
   * @param {string|Array} repeatConfig - 重复配置
   * @param {Object} chain - 工具链对象
   * @returns {Array} 重复数据
   * @private
   */
  resolveRepeatData(repeatConfig, chain) {
    if (Array.isArray(repeatConfig)) {
      return repeatConfig;
    }
    
    if (typeof repeatConfig === 'string') {
      // 从链结果中获取数据
      const steps = Array.from(chain.results.keys());
      const lastStep = steps[steps.length - 1];
      const lastResult = chain.results.get(lastStep);
      
      if (lastResult && Array.isArray(lastResult.data)) {
        return lastResult.data;
      }
    }
    
    return [];
  }
  
  /**
   * 生成工具链摘要
   * @param {Object} chain - 工具链对象
   * @returns {Object} 摘要信息
   * @private
   */
  generateChainSummary(chain) {
    const totalSteps = chain.completedSteps.size + chain.failedSteps.size;
    
    return {
      totalSteps,
      completedSteps: chain.completedSteps.size,
      failedSteps: chain.failedSteps.size,
      successRate: totalSteps > 0 ? (chain.completedSteps.size / totalSteps * 100).toFixed(2) + '%' : '0%',
      errors: chain.errors.length,
      duration: chain.duration
    };
  }
  
  /**
   * 获取工具链状态
   * @param {string} chainId - 工具链ID
   * @returns {Object|null} 工具链状态
   */
  getChainStatus(chainId) {
    const chain = this.chains.get(chainId);
    if (!chain) return null;
    
    return {
      id: chain.id,
      status: chain.status,
      startTime: chain.startTime,
      endTime: chain.endTime,
      duration: chain.duration,
      completedSteps: Array.from(chain.completedSteps),
      failedSteps: Array.from(chain.failedSteps),
      currentResults: Object.fromEntries(chain.results),
      errors: chain.errors
    };
  }
  
  /**
   * 取消工具链执行
   * @param {string} chainId - 工具链ID
   */
  cancelChain(chainId) {
    const chain = this.chains.get(chainId);
    if (chain && chain.status === 'running') {
      chain.status = 'cancelled';
      chain.endTime = Date.now();
      chain.duration = chain.endTime - chain.startTime;
      
      this.emit('chainCancelled', { chainId });
    }
  }
  
  /**
   * 获取执行统计
   * @returns {Object} 统计信息
   */
  getStats() {
    const chains = Array.from(this.chains.values());
    
    return {
      totalChains: chains.length,
      completedChains: chains.filter(c => c.status === 'completed').length,
      failedChains: chains.filter(c => c.status === 'failed').length,
      runningChains: chains.filter(c => c.status === 'running').length,
      templates: Array.from(this.templates.values()).map(t => ({
        name: t.name,
        usageCount: t.usageCount
      }))
    };
  }
}

export default BrowserToolChain;
