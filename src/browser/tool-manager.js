/**
 * Browser Tool Manager
 * 
 * @fileoverview 浏览器工具管理器，参考 codex-rs 的本地工具分发逻辑
 */

import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';
import { BrowserInstance } from './browser-instance.js';
import { BrowserSecurityPolicy } from './security/sandbox-policy.js';
import { BROWSER_TOOLS, TOOL_STATUS, getSupportedTools } from './index.js';

/**
 * 浏览器工具管理器
 * 负责管理浏览器实例、工具注册、安全策略和工具执行
 */
export class BrowserToolManager extends EventEmitter {
  /**
   * 构造函数
   * @param {Object} config - 配置选项
   * @param {string} config.engine - 浏览器引擎
   * @param {boolean} config.headless - 是否无头模式
   * @param {Object} config.viewport - 默认视口
   * @param {Object} config.security - 安全策略配置
   * @param {number} config.timeout - 默认超时时间
   * @param {boolean} config.enabled - 是否启用浏览器工具
   */
  constructor(config = {}) {
    super();
    
    this.config = {
      enabled: config.enabled !== false,
      engine: config.engine || 'puppeteer',
      headless: config.headless !== false,
      viewport: config.viewport || { width: 1920, height: 1080 },
      timeout: config.timeout || 30000,
      security: config.security || {},
      ...config
    };
    
    this.logger = new Logger('BrowserToolManager');
    this.browserInstance = null;
    this.securityPolicy = new BrowserSecurityPolicy(this.config.security);
    this.tools = new Map();
    this.executionHistory = [];
    this.isInitialized = false;
    
    // 性能监控
    this.metrics = {
      toolsExecuted: 0,
      totalExecutionTime: 0,
      successCount: 0,
      errorCount: 0,
      timeoutCount: 0
    };
    
    // 初始化工具注册
    this.registerDefaultTools();
  }

  /**
   * 注册默认工具
   * @private
   */
  registerDefaultTools() {
    // 延迟加载工具类以避免循环依赖
    this.toolLoaders = {
      [BROWSER_TOOLS.NAVIGATE]: () => import('./tools/navigate-tool.js').then(m => m.NavigateTool),
      [BROWSER_TOOLS.CLICK]: () => import('./tools/click-tool.js').then(m => m.ClickTool),
      [BROWSER_TOOLS.EXTRACT]: () => import('./tools/extract-tool.js').then(m => m.ExtractTool),
      [BROWSER_TOOLS.TYPE]: () => import('./tools/type-tool.js').then(m => m.TypeTool),
      [BROWSER_TOOLS.SCREENSHOT]: () => import('./tools/screenshot-tool.js').then(m => m.ScreenshotTool),
      [BROWSER_TOOLS.EVALUATE]: () => import('./tools/evaluate-tool.js').then(m => m.EvaluateTool)
    };
    
    this.logger.info(`已注册 ${Object.keys(this.toolLoaders).length} 个浏览器工具`);
  }

  /**
   * 初始化工具管理器
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }
    
    if (!this.config.enabled) {
      this.logger.info('浏览器工具已禁用');
      return;
    }
    
    this.logger.info('初始化浏览器工具管理器');
    
    try {
      // 初始化浏览器实例
      this.browserInstance = new BrowserInstance(this.config);
      
      // 监听浏览器事件
      this.setupBrowserEventHandlers();
      
      // 预加载常用工具
      await this.preloadTools([BROWSER_TOOLS.NAVIGATE, BROWSER_TOOLS.EXTRACT]);
      
      this.isInitialized = true;
      this.emit('initialized');
      this.logger.info('浏览器工具管理器初始化完成');
      
    } catch (error) {
      this.logger.error('浏览器工具管理器初始化失败:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * 设置浏览器事件处理器
   * @private
   */
  setupBrowserEventHandlers() {
    this.browserInstance.on('initialized', () => {
      this.emit('browserReady');
    });
    
    this.browserInstance.on('disconnected', () => {
      this.emit('browserDisconnected');
      this.logger.warn('浏览器连接已断开');
    });
    
    this.browserInstance.on('error', (error) => {
      this.emit('browserError', error);
      this.logger.error('浏览器错误:', error);
    });
  }

  /**
   * 预加载工具类
   * @param {Array<string>} toolNames - 要预加载的工具名称
   * @private
   */
  async preloadTools(toolNames) {
    const loadPromises = toolNames.map(async (toolName) => {
      try {
        const ToolClass = await this.toolLoaders[toolName]();
        this.tools.set(toolName, new ToolClass());
        this.logger.debug(`预加载工具: ${toolName}`);
      } catch (error) {
        this.logger.warn(`预加载工具失败: ${toolName}`, error);
      }
    });
    
    await Promise.allSettled(loadPromises);
  }

  /**
   * 获取工具实例
   * @param {string} toolName - 工具名称
   * @returns {Promise<Object>} 工具实例
   * @private
   */
  async getToolInstance(toolName) {
    if (this.tools.has(toolName)) {
      return this.tools.get(toolName);
    }
    
    const toolLoader = this.toolLoaders[toolName];
    if (!toolLoader) {
      throw new Error(`未知的浏览器工具: ${toolName}`);
    }
    
    try {
      const ToolClass = await toolLoader();
      const toolInstance = new ToolClass();
      this.tools.set(toolName, toolInstance);
      return toolInstance;
    } catch (error) {
      throw new Error(`加载工具失败: ${toolName} - ${error.message}`);
    }
  }

  /**
   * 执行本地工具（参考 codex 的 handle_function_call 逻辑）
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @param {string} callId - 调用ID
   * @returns {Promise<Object>} 执行结果
   */
  async executeLocalTool(toolName, args, callId) {
    const startTime = Date.now();
    const context = {
      toolName,
      args,
      callId,
      startTime: new Date(startTime),
      status: TOOL_STATUS.PENDING
    };
    
    this.logger.info(`执行浏览器工具: ${toolName}`, { callId, args });
    
    try {
      // 检查是否已初始化
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // 安全验证
      context.status = TOOL_STATUS.RUNNING;
      await this.securityPolicy.validateOperation(toolName, args);
      
      // 确保浏览器实例可用
      await this.ensureBrowserInstance();
      
      // 获取工具实例
      const tool = await this.getToolInstance(toolName);
      
      // 执行工具
      const toolContext = {
        ...context,
        browser: this.browserInstance,
        securityPolicy: this.securityPolicy,
        timeout: args.timeout || this.config.timeout
      };
      
      const result = await this.executeWithTimeout(
        () => tool.execute(toolContext),
        toolContext.timeout
      );
      
      // 记录成功执行
      const duration = Date.now() - startTime;
      context.status = TOOL_STATUS.SUCCESS;
      context.duration = duration;
      context.result = result;
      
      this.recordExecution(context);
      this.updateMetrics('success', duration);
      
      this.emit('toolExecuted', { 
        success: true, 
        toolName, 
        callId, 
        duration, 
        result 
      });
      
      this.logger.info(`工具执行成功: ${toolName}`, { callId, duration });
      
      return {
        success: true,
        data: result,
        duration,
        toolName,
        callId
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      context.status = error.name === 'TimeoutError' ? TOOL_STATUS.TIMEOUT : TOOL_STATUS.FAILED;
      context.duration = duration;
      context.error = error.message;
      
      this.recordExecution(context);
      this.updateMetrics(context.status === TOOL_STATUS.TIMEOUT ? 'timeout' : 'error', duration);
      
      this.emit('toolExecuted', { 
        success: false, 
        toolName, 
        callId, 
        duration, 
        error: error.message 
      });
      
      this.logger.error(`工具执行失败: ${toolName}`, { callId, duration, error: error.message });
      
      throw new Error(`浏览器工具执行失败: ${error.message}`);
    }
  }

  /**
   * 带超时的执行包装器
   * @param {Function} fn - 要执行的函数
   * @param {number} timeout - 超时时间
   * @returns {Promise<*>} 执行结果
   * @private
   */
  async executeWithTimeout(fn, timeout) {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const error = new Error(`工具执行超时: ${timeout}ms`);
        error.name = 'TimeoutError';
        reject(error);
      }, timeout);
      
      try {
        const result = await fn();
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * 确保浏览器实例可用
   * @private
   */
  async ensureBrowserInstance() {
    if (!this.browserInstance) {
      throw new Error('浏览器实例未初始化');
    }
    
    // 检查浏览器健康状态
    const isHealthy = await this.browserInstance.isHealthy();
    if (!isHealthy) {
      this.logger.warn('浏览器实例不健康，尝试重新初始化');
      await this.browserInstance.initialize();
    }
  }

  /**
   * 记录执行历史
   * @param {Object} context - 执行上下文
   * @private
   */
  recordExecution(context) {
    this.executionHistory.push({
      ...context,
      timestamp: new Date()
    });
    
    // 保持历史记录在合理范围内
    if (this.executionHistory.length > 1000) {
      this.executionHistory = this.executionHistory.slice(-500);
    }
  }

  /**
   * 更新性能指标
   * @param {string} type - 结果类型 (success|error|timeout)
   * @param {number} duration - 执行时间
   * @private
   */
  updateMetrics(type, duration) {
    this.metrics.toolsExecuted++;
    this.metrics.totalExecutionTime += duration;
    
    switch (type) {
      case 'success':
        this.metrics.successCount++;
        break;
      case 'error':
        this.metrics.errorCount++;
        break;
      case 'timeout':
        this.metrics.timeoutCount++;
        break;
    }
  }

  /**
   * 获取工具定义列表（用于注册到工具系统）
   * @returns {Array} 工具定义列表
   */
  getToolDefinitions() {
    return getSupportedTools();
  }

  /**
   * 检查工具是否可用
   * @param {string} toolName - 工具名称
   * @returns {boolean} 是否可用
   */
  isToolAvailable(toolName) {
    return this.config.enabled && this.toolLoaders.hasOwnProperty(toolName);
  }

  /**
   * 获取性能指标
   * @returns {Object} 性能指标
   */
  getMetrics() {
    const avgExecutionTime = this.metrics.toolsExecuted > 0 
      ? this.metrics.totalExecutionTime / this.metrics.toolsExecuted 
      : 0;
    
    return {
      ...this.metrics,
      avgExecutionTime,
      successRate: this.metrics.toolsExecuted > 0 
        ? (this.metrics.successCount / this.metrics.toolsExecuted * 100).toFixed(2) + '%'
        : '0%',
      browserMetrics: this.browserInstance ? this.browserInstance.getMetrics() : null
    };
  }

  /**
   * 获取执行历史
   * @param {number} limit - 限制数量
   * @returns {Array} 执行历史
   */
  getExecutionHistory(limit = 50) {
    return this.executionHistory.slice(-limit);
  }

  /**
   * 清理资源
   * @returns {Promise<void>}
   */
  async cleanup() {
    this.logger.info('开始清理浏览器工具管理器资源');
    
    try {
      if (this.browserInstance) {
        await this.browserInstance.destroy();
        this.browserInstance = null;
      }
      
      this.tools.clear();
      this.executionHistory = [];
      this.isInitialized = false;
      
      this.emit('cleanup');
      this.logger.info('浏览器工具管理器资源清理完成');
      
    } catch (error) {
      this.logger.error('清理浏览器工具管理器资源失败:', error);
      throw error;
    }
  }

  /**
   * 获取健康状态
   * @returns {Promise<Object>} 健康状态信息
   */
  async getHealthStatus() {
    const isManagerHealthy = this.isInitialized && this.config.enabled;
    const isBrowserHealthy = this.browserInstance ? await this.browserInstance.isHealthy() : false;
    
    return {
      manager: {
        initialized: this.isInitialized,
        enabled: this.config.enabled,
        toolsRegistered: Object.keys(this.toolLoaders).length,
        toolsLoaded: this.tools.size
      },
      browser: {
        healthy: isBrowserHealthy,
        info: this.browserInstance ? await this.browserInstance.getBrowserInfo() : null
      },
      metrics: this.getMetrics(),
      overall: isManagerHealthy && isBrowserHealthy
    };
  }
}
