/**
 * Browser Tool Manager
 * 
 * @fileoverview 浏览器工具管理器，参考 codex-rs 的本地工具分发逻辑
 */

import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';
import { BrowserInstance } from './browser-instance.js';
import { BrowserSecurityPolicy } from './security/sandbox-policy.js';
import { BrowserInstancePool } from './instance-pool.js';
import { BrowserToolMonitor } from './monitor.js';
import { 
  createBrowserSecurityManager,
  SECURITY_LEVELS,
  RISK_LEVELS,
  DEFAULT_SECURITY_CONFIG
} from './security.js';
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
      
      // 实例池配置
      instancePool: {
        maxInstances: config.instancePool?.maxInstances || 3,
        maxIdleTime: config.instancePool?.maxIdleTime || 5 * 60 * 1000,
        maxReuseCount: config.instancePool?.maxReuseCount || 100,
        warmupInstances: config.instancePool?.warmupInstances || 1,
        enabled: config.instancePool?.enabled !== false,
        ...config.instancePool
      },
      
      // 监控配置
      monitoring: {
        enabled: config.monitoring?.enabled !== false,
        metricsRetention: config.monitoring?.metricsRetention || 24 * 60 * 60 * 1000,
        alertThresholds: {
          errorRate: 0.1,
          avgExecutionTime: 30000,
          timeoutRate: 0.05,
          ...config.monitoring?.alertThresholds
        },
        ...config.monitoring
      },
      
      // 安全配置 - 强制允许所有域名
      security: {
        ...DEFAULT_SECURITY_CONFIG,
        securityLevel: config.security?.securityLevel || SECURITY_LEVELS.NORMAL,
        enableSandbox: config.security?.enableSandbox !== false,
        maxExecutionTime: config.security?.maxExecutionTime || 30000,
        maxMemoryUsage: config.security?.maxMemoryUsage || 512 * 1024 * 1024,
        allowedDomains: ['*'], // 强制允许所有域名
        blockedDomains: config.security?.blockedDomains || ['localhost', '127.0.0.1'],
        auditLog: config.security?.auditLog !== false,
        ...config.security,
        // 再次确保 allowedDomains 不被覆盖
        allowedDomains: ['*']
      },
      
      ...config
    };
    
    this.logger = new Logger('BrowserToolManager');
    
    // 浏览器实例管理
    this.sessionBrowserContext = null; // 新增：会话级浏览器上下文
    if (this.config.instancePool.enabled) {
      this.instancePool = new BrowserInstancePool({
        ...this.config.instancePool,
        engine: this.config.engine,
        launchOptions: {
          headless: this.config.headless,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
          defaultViewport: this.config.viewport
        }
      });
    } else {
      this.browserInstance = null; // 传统单实例模式
    }
    
    // 性能监控
    this.monitor = new BrowserToolMonitor(this.config.monitoring);
    
    // 安全管理器
    this.securityManager = createBrowserSecurityManager(this.config.security);
    
    this.securityPolicy = new BrowserSecurityPolicy(this.config.security);
    this.tools = new Map();
    this.executionHistory = [];
    this.isInitialized = false;
    
    // 传统性能监控（保持向后兼容）
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
      [BROWSER_TOOLS.HOVER]: () => import('./tools/hover-tool.js').then(m => m.HoverTool),
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
    this.logger.info('安全配置:', JSON.stringify(this.config.security, null, 2));
    
    try {
      // 初始化浏览器实例或实例池
      if (this.instancePool) {
        this.logger.info('使用浏览器实例池模式');
        
        // 设置实例池事件监听
        this.setupInstancePoolEventHandlers();
        
        // 预热实例池
        await this.instancePool.warmup();
        this.logger.info(`实例池预热完成，当前实例数: ${this.instancePool.getStats().poolSize}`);
        
      } else {
        this.logger.info('使用单浏览器实例模式');
        
        // 初始化单个浏览器实例
        this.browserInstance = new BrowserInstance(this.config);
        await this.browserInstance.initialize();
        
        // 监听浏览器事件
        this.setupBrowserEventHandlers();
      }
      
      // 设置监控事件监听
      this.setupMonitorEventHandlers();
      
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
   * 设置实例池事件处理器
   * @private
   */
  setupInstancePoolEventHandlers() {
    this.instancePool.on('instanceCreated', (data) => {
      this.logger.debug(`创建新浏览器实例: ${data.instanceId}, 池大小: ${data.poolSize}`);
      this.emit('instanceCreated', data);
    });
    
    this.instancePool.on('instanceDestroyed', (data) => {
      this.logger.debug(`销毁浏览器实例: ${data.instanceId}, 重用次数: ${data.reuseCount}`);
      this.emit('instanceDestroyed', data);
    });
    
    this.instancePool.on('instanceAcquired', (data) => {
      this.logger.debug(`获取浏览器实例: ${data.instanceId}, 来源池: ${data.fromPool}`);
    });
    
    this.instancePool.on('instanceReturned', (data) => {
      this.logger.debug(`归还浏览器实例: ${data.instanceId}, 重用次数: ${data.reuseCount}`);
    });
    
    this.instancePool.on('cleanupCompleted', (data) => {
      this.logger.debug(`实例池清理完成, 销毁: ${data.destroyedCount}, 池大小: ${data.poolSize}`);
    });
    
    this.instancePool.on('error', (data) => {
      this.logger.error('实例池错误:', data.error);
      this.emit('instancePoolError', data);
    });
  }

  /**
   * 设置监控事件处理器
   * @private
   */
  setupMonitorEventHandlers() {
    this.monitor.on('alert', (alert) => {
      this.logger.warn(`性能警报 [${alert.level}]: ${alert.message}`);
      this.emit('performanceAlert', alert);
    });
    
    this.monitor.on('executionCompleted', (data) => {
      this.logger.debug(`工具执行完成: ${data.toolName}, 耗时: ${data.duration}ms`);
    });
    
    this.monitor.on('executionError', (data) => {
      this.logger.warn(`工具执行错误: ${data.toolName}, 错误: ${data.error.message}`);
    });
    
    this.monitor.on('executionTimeout', (data) => {
      this.logger.warn(`工具执行超时: ${data.toolName}, 耗时: ${data.duration}ms`);
    });
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
    // 标准化工具名（支持 'navigate' 和 'browser.navigate' 两种格式）
    const normalizedName = toolName.startsWith('browser.') ? toolName : `browser.${toolName}`;
    
    if (this.tools.has(normalizedName)) {
      return this.tools.get(normalizedName);
    }
    
    const toolLoader = this.toolLoaders[normalizedName];
    if (!toolLoader) {
      throw new Error(`未知的浏览器工具: ${toolName}`);
    }
    
    try {
      const ToolClass = await toolLoader();
      const toolInstance = new ToolClass();
      this.tools.set(normalizedName, toolInstance);
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
    
    // 开始性能监控
    const monitorSession = this.monitor.startExecution(toolName, { callId, args });
    
    let browserContext = null;
    
    try {
      // 检查是否已初始化
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // 安全验证
      context.status = TOOL_STATUS.RUNNING;
      
      // 现代安全管理器验证
      const securitySession = this.securityManager.createSecureSession({
        maxExecutionTime: this.config.security.maxExecutionTime,
        permissions: ['navigate', 'extract', 'interact', 'evaluate', 'capture']
      });
      
      const permissionCheck = this.securityManager.validateSessionPermission(
        securitySession.sessionId, 
        this.getOperationTypeFromTool(toolName),
        args
      );
      
      if (!permissionCheck.allowed) {
        throw new Error(`安全策略阻止操作: ${permissionCheck.reason}`);
      }
      
      // 参数安全验证
      if (args.url) {
        const urlValidation = this.securityManager.validateURL(args.url, 'navigation');
        if (!urlValidation.isValid) {
          throw new Error(`URL安全验证失败: ${urlValidation.violations.map(v => v.message).join(', ')}`);
        }
        args.url = urlValidation.sanitizedUrl;
      }
      
      if (args.selector) {
        const selectorValidation = this.securityManager.validateSelector(args.selector, 'extraction');
        if (!selectorValidation.isValid) {
          throw new Error(`选择器安全验证失败: ${selectorValidation.violations.map(v => v.message).join(', ')}`);
        }
        args.selector = selectorValidation.sanitizedSelector;
      }
      
      if (args.code) {
        const codeValidation = this.securityManager.validateJavaScript(args.code, 'evaluation');
        if (!codeValidation.isValid) {
          throw new Error(`JavaScript代码安全验证失败: ${codeValidation.violations.map(v => v.message).join(', ')}`);
        }
        args.code = codeValidation.sanitizedCode;
      }
      
      // 传统安全策略验证（保持向后兼容）
      await this.securityPolicy.validateOperation(toolName, args);
      
      // 获取浏览器实例
      browserContext = await this.getBrowserContext();
      
      // 获取工具实例
      const tool = await this.getToolInstance(toolName);
      
      // 执行工具
      const toolContext = {
        ...context,
        browser: browserContext.browser,
        instanceId: browserContext.instanceId, // 添加实例ID
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
      
      // 完成监控
      monitorSession.finish(result);
      
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
      const isTimeout = error.name === 'TimeoutError';
      
      context.status = isTimeout ? TOOL_STATUS.TIMEOUT : TOOL_STATUS.FAILED;
      context.duration = duration;
      context.error = error.message;
      
      this.recordExecution(context);
      this.updateMetrics(isTimeout ? 'timeout' : 'error', duration);
      
      // 记录监控错误
      if (isTimeout) {
        monitorSession.timeout();
      } else {
        monitorSession.error(error);
      }
      
      this.emit('toolExecuted', { 
        success: false, 
        toolName, 
        callId, 
        duration, 
        error: error.message 
      });
      
      this.logger.error(`工具执行失败: ${toolName}`, { callId, duration, error: error.message });
      
      throw new Error(`浏览器工具执行失败: ${error.message}`);
      
    } finally {
      // 归还浏览器实例到池中
      if (browserContext && browserContext.returnInstance) {
        try {
          await browserContext.returnInstance();
        } catch (error) {
          this.logger.warn('归还浏览器实例失败:', error);
        }
      }
    }
  }

  /**
   * 获取浏览器上下文 - 会话级实例管理
   * @returns {Promise<Object>} 浏览器上下文
   * @private
   */
  async getBrowserContext() {
    // 如果已有会话级实例，直接返回
    if (this.sessionBrowserContext) {
      return this.sessionBrowserContext;
    }
    
    if (this.instancePool) {
      // 使用实例池模式，但保持会话级
      console.log('[DEBUG INSTANCE] 获取会话级浏览器实例');
      const context = await this.instancePool.getInstance();
      
      // 保存会话级上下文，不立即归还
      this.sessionBrowserContext = {
        browser: context.browser,
        instanceId: context.instanceId,
        _originalReturnFn: context.returnInstance, // 保存原始归还函数
        returnInstance: () => {
          // 会话级实例不立即归还，在cleanup时统一归还
          console.log('[DEBUG INSTANCE] 会话级实例延迟归还');
          return Promise.resolve();
        }
      };
      
      return this.sessionBrowserContext;
    } else {
      // 使用传统单实例模式
      await this.ensureBrowserInstance();
      this.sessionBrowserContext = {
        browser: this.browserInstance,
        returnInstance: () => Promise.resolve() // 单实例模式不需要归还
      };
      return this.sessionBrowserContext;
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
    
    const traditionalMetrics = {
      ...this.metrics,
      avgExecutionTime,
      successRate: this.metrics.toolsExecuted > 0 
        ? (this.metrics.successCount / this.metrics.toolsExecuted * 100).toFixed(2) + '%'
        : '0%',
      browserMetrics: this.browserInstance ? this.browserInstance.getMetrics() : null
    };
    
    // 新的监控指标
    const monitorStats = this.monitor.getStats();
    
    // 实例池指标
    const instancePoolStats = this.instancePool ? this.instancePool.getStats() : null;
    
    // 安全指标
    const securityStats = this.getSecurityStats();
    
    return {
      traditional: traditionalMetrics,
      monitoring: monitorStats,
      instancePool: instancePoolStats,
      security: securityStats,
      combined: {
        totalExecutions: monitorStats.global.totalExecutions,
        successRate: (1 - monitorStats.global.errorRate) * 100,
        avgExecutionTime: monitorStats.global.avgDuration,
        errorRate: monitorStats.global.errorRate * 100,
        timeoutRate: monitorStats.global.timeoutRate * 100,
        uptime: monitorStats.global.uptime,
        securityLevel: securityStats.config.securityLevel,
        activeSessions: securityStats.manager.activeSessions
      }
    };
  }
  
  /**
   * 获取工具性能统计
   * @param {string} toolName - 工具名称（可选）
   * @returns {Object} 工具性能统计
   */
  getToolStats(toolName = null) {
    return this.monitor.getStats(toolName);
  }
  
  /**
   * 获取性能趋势数据
   * @param {string} toolName - 工具名称
   * @param {number} timeRange - 时间范围(毫秒)
   * @returns {Object} 趋势数据
   */
  getPerformanceTrends(toolName, timeRange) {
    return this.monitor.getTrends(toolName, timeRange);
  }
  
  /**
   * 重置监控指标
   * @param {string} toolName - 工具名称（可选）
   */
  resetMetrics(toolName = null) {
    this.monitor.resetMetrics(toolName);
    
    if (!toolName) {
      // 重置传统指标
      this.metrics = {
        toolsExecuted: 0,
        totalExecutionTime: 0,
        successCount: 0,
        errorCount: 0,
        timeoutCount: 0
      };
      this.executionHistory = [];
    }
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
   * 从工具名称映射到操作类型
   * @param {string} toolName - 工具名称
   * @returns {string} 操作类型
   */
  getOperationTypeFromTool(toolName) {
    // 标准化工具名（支持 'navigate' 和 'browser.navigate' 两种格式）
    const normalizedName = toolName.startsWith('browser.') ? toolName : `browser.${toolName}`;
    
    const operationMap = {
      [BROWSER_TOOLS.NAVIGATE]: 'navigate',
      [BROWSER_TOOLS.EXTRACT]: 'extract',
      [BROWSER_TOOLS.CLICK]: 'interact',
      [BROWSER_TOOLS.HOVER]: 'interact',
      [BROWSER_TOOLS.TYPE]: 'interact',
      [BROWSER_TOOLS.SCROLL]: 'interact',
      [BROWSER_TOOLS.WAIT]: 'interact',
      [BROWSER_TOOLS.SCREENSHOT]: 'capture',
      [BROWSER_TOOLS.PDF]: 'capture',
      [BROWSER_TOOLS.EVALUATE]: 'evaluate',
      [BROWSER_TOOLS.GET_CONTENT]: 'extract',
      [BROWSER_TOOLS.SET_VIEWPORT]: 'interact'
    };
    
    return operationMap[normalizedName] || 'unknown';
  }
  
  /**
   * 获取安全统计
   * @returns {Object} 安全统计信息
   */
  getSecurityStats() {
    return {
      manager: this.securityManager.getSecurityStats(),
      policy: this.securityPolicy.getStats ? this.securityPolicy.getStats() : null,
      config: {
        securityLevel: this.config.security.securityLevel,
        sandboxEnabled: this.config.security.enableSandbox,
        auditLogEnabled: this.config.security.auditLog
      }
    };
  }

  /**
   * 清理资源
   * @returns {Promise<void>}
   */
  async cleanup() {
    this.logger.info('开始清理浏览器工具管理器资源');
    
    try {
      // 清理会话级浏览器实例
      if (this.sessionBrowserContext && this.sessionBrowserContext._originalReturnFn) {
        console.log('[DEBUG INSTANCE] 清理会话级浏览器实例');
        await this.sessionBrowserContext._originalReturnFn();
        this.sessionBrowserContext = null;
      }
      
      // 清理实例池或单个浏览器实例
      if (this.instancePool) {
        await this.instancePool.destroy();
        this.instancePool = null;
      } else if (this.browserInstance) {
        await this.browserInstance.destroy();
        this.browserInstance = null;
      }
      
      // 清理监控器
      if (this.monitor) {
        this.monitor.destroy();
      }
      
      // 清理安全管理器
      if (this.securityManager) {
        this.securityManager.cleanup();
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
