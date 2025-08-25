/**
 * MCP Tool System 实现
 * 
 * @fileoverview 提供高级工具调用功能，包括参数验证、结果处理、工具链等
 */

import { EventEmitter } from 'events';
import { createJsonRpcError, JSONRPC_ERROR_CODES, createTextContent } from './types.js';
import Logger from '../utils/logger.js';

/**
 * 工具执行上下文
 * @typedef {Object} ToolExecutionContext
 * @property {string} toolName - 工具名称
 * @property {Object} args - 工具参数
 * @property {string} connectionName - 连接名称
 * @property {Date} startTime - 开始时间
 * @property {string} [sessionId] - 会话ID
 * @property {Object} [metadata] - 元数据
 */

/**
 * 工具执行结果
 * @typedef {Object} ToolExecutionResult
 * @property {boolean} success - 是否成功
 * @property {Object} [data] - 结果数据
 * @property {string} [error] - 错误信息
 * @property {number} duration - 执行时间(毫秒)
 * @property {ToolExecutionContext} context - 执行上下文
 */

/**
 * 工具验证规则
 * @typedef {Object} ToolValidationRule
 * @property {string} field - 字段名
 * @property {string} type - 类型: 'string' | 'number' | 'boolean' | 'object' | 'array'
 * @property {boolean} [required] - 是否必需
 * @property {any} [default] - 默认值
 * @property {function} [validator] - 自定义验证函数
 * @property {string} [pattern] - 正则表达式模式 (string类型)
 * @property {number} [min] - 最小值 (number类型)
 * @property {number} [max] - 最大值 (number类型)
 * @property {Array} [enum] - 枚举值
 */

/**
 * MCP工具系统
 * 
 * 功能特性：
 * - 工具发现和注册
 * - 参数验证
 * - 结果处理和转换
 * - 工具链执行
 * - 性能监控
 */
export class MCPToolSystem extends EventEmitter {
  /**
   * 构造函数
   * @param {Object} config - 配置选项
   * @param {Object} config.connectionManager - MCP连接管理器实例
   * @param {Object} [config.logger] - 日志实例
   * @param {boolean} [config.enableValidation] - 是否启用参数验证
   * @param {boolean} [config.enableMetrics] - 是否启用性能指标
   */
  constructor(config) {
    super();
    
    this.connectionManager = config.connectionManager;
    this.logger = config.logger || new Logger('MCPToolSystem');
    this.enableValidation = config.enableValidation !== false;
    this.enableMetrics = config.enableMetrics !== false;
    
    // 工具注册表和缓存
    this.toolRegistry = new Map(); // toolName -> ToolDefinition
    this.validationRules = new Map(); // toolName -> ValidationRule[]
    this.resultProcessors = new Map(); // toolName -> function
    this.executionHistory = []; // 执行历史
    this.metrics = new Map(); // 性能指标
    
    // 设置事件处理
    this.setupEventHandlers();
  }

  /**
   * 设置事件处理器
   * @private
   */
  setupEventHandlers() {
    this.connectionManager.on('toolRegistryUpdated', () => {
      this.refreshToolRegistry();
    });
    
    this.connectionManager.on('initialized', () => {
      this.refreshToolRegistry();
    });
  }

  /**
   * 初始化工具系统
   * @returns {Promise<void>}
   */
  async initialize() {
    this.logger.info('Initializing MCP Tool System');
    
    await this.refreshToolRegistry();
    
    this.logger.info(`Initialized with ${this.toolRegistry.size} tools`);
    this.emit('initialized');
  }

  /**
   * 刷新工具注册表
   * @private
   */
  async refreshToolRegistry() {
    try {
      const tools = await this.connectionManager.getAllTools();
      
      this.toolRegistry.clear();
      
      for (const tool of tools) {
        this.toolRegistry.set(tool.name, {
          ...tool,
          registeredAt: new Date()
        });
        
        // 从inputSchema生成验证规则
        if (this.enableValidation && tool.inputSchema) {
          this.generateValidationRules(tool.name, tool.inputSchema);
        }
      }
      
      this.emit('toolRegistryUpdated', this.toolRegistry);
      this.logger.debug(`Updated tool registry with ${tools.length} tools`);
      
    } catch (error) {
      this.logger.error('Failed to refresh tool registry:', error);
    }
  }

  /**
   * 从JSON Schema生成验证规则
   * @param {string} toolName - 工具名称
   * @param {Object} schema - JSON Schema
   * @private
   */
  generateValidationRules(toolName, schema) {
    const rules = [];
    
    if (schema.properties) {
      for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
        const rule = {
          field: fieldName,
          type: fieldSchema.type || 'any',
          required: schema.required?.includes(fieldName) || false,
          default: fieldSchema.default
        };
        
        // 添加类型特定的验证
        if (fieldSchema.type === 'string') {
          if (fieldSchema.pattern) rule.pattern = fieldSchema.pattern;
          if (fieldSchema.minLength) rule.minLength = fieldSchema.minLength;
          if (fieldSchema.maxLength) rule.maxLength = fieldSchema.maxLength;
          if (fieldSchema.enum) rule.enum = fieldSchema.enum;
        } else if (fieldSchema.type === 'number' || fieldSchema.type === 'integer') {
          if (fieldSchema.minimum !== undefined) rule.min = fieldSchema.minimum;
          if (fieldSchema.maximum !== undefined) rule.max = fieldSchema.maximum;
        }
        
        rules.push(rule);
      }
    }
    
    this.validationRules.set(toolName, rules);
  }

  /**
   * 注册自定义验证规则
   * @param {string} toolName - 工具名称
   * @param {ToolValidationRule[]} rules - 验证规则
   */
  setValidationRules(toolName, rules) {
    this.validationRules.set(toolName, rules);
    this.logger.debug(`Set custom validation rules for tool '${toolName}'`);
  }

  /**
   * 注册结果处理器
   * @param {string} toolName - 工具名称
   * @param {function} processor - 结果处理函数
   */
  setResultProcessor(toolName, processor) {
    this.resultProcessors.set(toolName, processor);
    this.logger.debug(`Set result processor for tool '${toolName}'`);
  }

  /**
   * 验证工具参数
   * @param {string} toolName - 工具名称
   * @param {Object} args - 参数对象
   * @returns {Object} 验证结果 { valid: boolean, errors: string[], processedArgs: Object }
   */
  validateArgs(toolName, args = {}) {
    const rules = this.validationRules.get(toolName);
    if (!rules || !this.enableValidation) {
      return { valid: true, errors: [], processedArgs: args };
    }

    const errors = [];
    const processedArgs = { ...args };

    for (const rule of rules) {
      const { field, type, required, default: defaultValue } = rule;
      const value = processedArgs[field];

      // 检查必需字段
      if (required && (value === undefined || value === null)) {
        errors.push(`Field '${field}' is required`);
        continue;
      }

      // 设置默认值
      if (value === undefined && defaultValue !== undefined) {
        processedArgs[field] = defaultValue;
        continue;
      }

      // 跳过可选的空值
      if (value === undefined || value === null) {
        continue;
      }

      // 类型验证
      if (!this.validateType(value, type)) {
        errors.push(`Field '${field}' must be of type '${type}'`);
        continue;
      }

      // 特定类型验证
      const typeError = this.validateTypeSpecific(field, value, rule);
      if (typeError) {
        errors.push(typeError);
      }

      // 自定义验证器
      if (rule.validator && typeof rule.validator === 'function') {
        try {
          const customError = rule.validator(value, field, processedArgs);
          if (customError) {
            errors.push(customError);
          }
        } catch (error) {
          errors.push(`Validation error for '${field}': ${error.message}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      processedArgs
    };
  }

  /**
   * 验证值的类型
   * @param {any} value - 值
   * @param {string} expectedType - 期望类型
   * @returns {boolean}
   * @private
   */
  validateType(value, expectedType) {
    switch (expectedType) {
      case 'string': return typeof value === 'string';
      case 'number': return typeof value === 'number' && !isNaN(value);
      case 'integer': return Number.isInteger(value);
      case 'boolean': return typeof value === 'boolean';
      case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array': return Array.isArray(value);
      case 'any': return true;
      default: return true;
    }
  }

  /**
   * 类型特定验证
   * @param {string} field - 字段名
   * @param {any} value - 值
   * @param {ToolValidationRule} rule - 验证规则
   * @returns {string|null} 错误消息或null
   * @private
   */
  validateTypeSpecific(field, value, rule) {
    if (rule.type === 'string') {
      if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
        return `Field '${field}' does not match pattern '${rule.pattern}'`;
      }
      if (rule.minLength && value.length < rule.minLength) {
        return `Field '${field}' must be at least ${rule.minLength} characters`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Field '${field}' must be at most ${rule.maxLength} characters`;
      }
      if (rule.enum && !rule.enum.includes(value)) {
        return `Field '${field}' must be one of: ${rule.enum.join(', ')}`;
      }
    } else if (rule.type === 'number' || rule.type === 'integer') {
      if (rule.min !== undefined && value < rule.min) {
        return `Field '${field}' must be at least ${rule.min}`;
      }
      if (rule.max !== undefined && value > rule.max) {
        return `Field '${field}' must be at most ${rule.max}`;
      }
    }
    
    return null;
  }

  /**
   * 调用工具
   * @param {string} toolName - 工具名称
   * @param {Object} [args] - 工具参数
   * @param {Object} [options] - 调用选项
   * @param {string} [options.sessionId] - 会话ID
   * @param {Object} [options.metadata] - 元数据
   * @param {boolean} [options.skipValidation] - 跳过验证
   * @returns {Promise<ToolExecutionResult>}
   */
  async callTool(toolName, args = {}, options = {}) {
    const startTime = new Date();
    const context = {
      toolName,
      args,
      startTime,
      sessionId: options.sessionId,
      metadata: options.metadata
    };

    try {
      // 检查工具是否存在
      if (!this.toolRegistry.has(toolName)) {
        throw new Error(`Tool '${toolName}' not found`);
      }

      // 参数验证
      if (!options.skipValidation) {
        const validation = this.validateArgs(toolName, args);
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
        context.args = validation.processedArgs;
      }

      this.emit('toolCallStarted', context);
      
      // 执行工具调用
      const rawResult = await this.connectionManager.callTool(toolName, context.args);
      context.connectionName = rawResult.connection;
      
      // 处理结果
      const processedResult = await this.processResult(toolName, rawResult);
      
      const duration = Date.now() - startTime.getTime();
      
      const result = {
        success: true,
        data: processedResult,
        duration,
        context
      };

      // 记录执行历史
      this.recordExecution(result);
      
      // 更新指标
      if (this.enableMetrics) {
        this.updateMetrics(toolName, duration, true);
      }
      
      this.emit('toolCallCompleted', result);
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime.getTime();
      
      const result = {
        success: false,
        error: error.message,
        duration,
        context
      };

      this.recordExecution(result);
      
      if (this.enableMetrics) {
        this.updateMetrics(toolName, duration, false);
      }
      
      this.emit('toolCallFailed', result);
      throw error;
    }
  }

  /**
   * 处理工具调用结果
   * @param {string} toolName - 工具名称
   * @param {Object} rawResult - 原始结果
   * @returns {Promise<any>} 处理后的结果
   * @private
   */
  async processResult(toolName, rawResult) {
    const processor = this.resultProcessors.get(toolName);
    
    if (processor && typeof processor === 'function') {
      try {
        return await processor(rawResult);
      } catch (error) {
        this.logger.warn(`Result processor failed for '${toolName}':`, error);
        return rawResult;
      }
    }
    
    return rawResult;
  }

  /**
   * 执行工具链
   * @param {Array} toolChain - 工具链定义
   * @param {Object} [initialData] - 初始数据
   * @param {Object} [options] - 选项
   * @returns {Promise<Array>} 工具链执行结果
   */
  async executeToolChain(toolChain, initialData = {}, options = {}) {
    const results = [];
    let currentData = initialData;

    for (const step of toolChain) {
      const { tool, args = {}, dataMapping } = step;
      
      // 数据映射：将前一步的结果映射到当前步骤的参数
      let mappedArgs = { ...args };
      if (dataMapping && typeof dataMapping === 'function') {
        mappedArgs = { ...mappedArgs, ...dataMapping(currentData, results) };
      } else if (dataMapping && typeof dataMapping === 'object') {
        for (const [targetField, sourceField] of Object.entries(dataMapping)) {
          if (currentData[sourceField] !== undefined) {
            mappedArgs[targetField] = currentData[sourceField];
          }
        }
      }

      try {
        const result = await this.callTool(tool, mappedArgs, options);
        results.push(result);
        
        // 更新当前数据为最新结果
        if (result.success && result.data) {
          currentData = { ...currentData, ...result.data };
        }
        
      } catch (error) {
        this.logger.error(`Tool chain failed at step ${results.length + 1} (${tool}):`, error);
        
        // 根据配置决定是否继续执行
        if (options.continueOnError) {
          results.push({
            success: false,
            error: error.message,
            context: { toolName: tool, args: mappedArgs }
          });
        } else {
          throw error;
        }
      }
    }

    return results;
  }

  /**
   * 记录执行历史
   * @param {ToolExecutionResult} result - 执行结果
   * @private
   */
  recordExecution(result) {
    this.executionHistory.push({
      ...result,
      timestamp: new Date()
    });

    // 限制历史记录数量
    if (this.executionHistory.length > 1000) {
      this.executionHistory = this.executionHistory.slice(-500);
    }
  }

  /**
   * 更新性能指标
   * @param {string} toolName - 工具名称
   * @param {number} duration - 执行时间
   * @param {boolean} success - 是否成功
   * @private
   */
  updateMetrics(toolName, duration, success) {
    if (!this.metrics.has(toolName)) {
      this.metrics.set(toolName, {
        totalCalls: 0,
        successCalls: 0,
        errorCalls: 0,
        totalDuration: 0,
        avgDuration: 0,
        minDuration: Infinity,
        maxDuration: 0
      });
    }

    const metrics = this.metrics.get(toolName);
    metrics.totalCalls++;
    
    if (success) {
      metrics.successCalls++;
    } else {
      metrics.errorCalls++;
    }
    
    metrics.totalDuration += duration;
    metrics.avgDuration = metrics.totalDuration / metrics.totalCalls;
    metrics.minDuration = Math.min(metrics.minDuration, duration);
    metrics.maxDuration = Math.max(metrics.maxDuration, duration);
  }

  /**
   * 获取工具列表
   * @returns {Array} 工具列表
   */
  getTools() {
    return Array.from(this.toolRegistry.values());
  }

  /**
   * 获取工具定义
   * @param {string} toolName - 工具名称
   * @returns {Object|null} 工具定义
   */
  getTool(toolName) {
    return this.toolRegistry.get(toolName) || null;
  }

  /**
   * 获取性能指标
   * @param {string} [toolName] - 工具名称（可选）
   * @returns {Object} 性能指标
   */
  getMetrics(toolName) {
    if (toolName) {
      return this.metrics.get(toolName) || null;
    }
    
    return Object.fromEntries(this.metrics);
  }

  /**
   * 获取执行历史
   * @param {Object} [filter] - 过滤条件
   * @param {number} [limit] - 限制数量
   * @returns {Array} 执行历史
   */
  getExecutionHistory(filter = {}, limit = 100) {
    let history = this.executionHistory;

    // 应用过滤条件
    if (filter.toolName) {
      history = history.filter(h => h.context.toolName === filter.toolName);
    }
    if (filter.success !== undefined) {
      history = history.filter(h => h.success === filter.success);
    }
    if (filter.since) {
      history = history.filter(h => h.timestamp >= filter.since);
    }

    return history.slice(-limit);
  }

  /**
   * 清空执行历史
   */
  clearHistory() {
    this.executionHistory = [];
    this.logger.debug('Cleared execution history');
  }

  /**
   * 重置指标
   */
  resetMetrics() {
    this.metrics.clear();
    this.logger.debug('Reset performance metrics');
  }
}

export default MCPToolSystem;
