/**
 * 浏览器工具性能监控系统
 * 收集工具执行指标、性能统计和故障监控
 */

import { EventEmitter } from 'events';

export class BrowserToolMonitor extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      enabled: config.enabled !== false,
      metricsRetention: config.metricsRetention || 24 * 60 * 60 * 1000, // 24小时
      alertThresholds: {
        errorRate: config.alertThresholds?.errorRate || 0.1, // 10%错误率
        avgExecutionTime: config.alertThresholds?.avgExecutionTime || 30000, // 30秒
        timeoutRate: config.alertThresholds?.timeoutRate || 0.05, // 5%超时率
        ...config.alertThresholds
      },
      ...config
    };
    
    this.metrics = {
      toolExecutions: new Map(), // toolName -> ExecutionMetrics
      globalStats: {
        totalExecutions: 0,
        totalErrors: 0,
        totalTimeouts: 0,
        totalDuration: 0,
        startTime: Date.now()
      },
      recentExecutions: [], // 最近执行的记录（用于趋势分析）
      alerts: [] // 警报记录
    };
    
    this.cleanupTimer = null;
    if (this.config.enabled) {
      this.startMetricsCleanup();
    }
  }
  
  /**
   * 开始监控工具执行
   * @param {string} toolName - 工具名称
   * @param {Object} context - 执行上下文
   * @returns {Object} 监控会话对象
   */
  startExecution(toolName, context = {}) {
    if (!this.config.enabled) {
      return { finish: () => {}, error: () => {}, timeout: () => {} };
    }
    
    const executionId = `${toolName}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const startTime = Date.now();
    const memoryUsage = this.getMemoryUsage();
    
    const execution = {
      executionId,
      toolName,
      startTime,
      context: { ...context },
      memoryStart: memoryUsage,
      status: 'running'
    };
    
    // 初始化工具指标
    if (!this.metrics.toolExecutions.has(toolName)) {
      this.metrics.toolExecutions.set(toolName, {
        toolName,
        totalExecutions: 0,
        successCount: 0,
        errorCount: 0,
        timeoutCount: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        avgDuration: 0,
        errorRate: 0,
        timeoutRate: 0,
        recentExecutions: [],
        memoryUsage: {
          min: Infinity,
          max: 0,
          avg: 0,
          total: 0
        }
      });
    }
    
    const toolMetrics = this.metrics.toolExecutions.get(toolName);
    toolMetrics.totalExecutions++;
    this.metrics.globalStats.totalExecutions++;
    
    this.emit('executionStarted', {
      executionId,
      toolName,
      startTime,
      context
    });
    
    return {
      finish: (result = {}) => this.finishExecution(execution, result),
      error: (error) => this.errorExecution(execution, error),
      timeout: () => this.timeoutExecution(execution)
    };
  }
  
  /**
   * 完成工具执行监控
   * @param {Object} execution - 执行对象
   * @param {Object} result - 执行结果
   */
  finishExecution(execution, result = {}) {
    const endTime = Date.now();
    const duration = endTime - execution.startTime;
    const memoryEnd = this.getMemoryUsage();
    const memoryDelta = memoryEnd.heapUsed - execution.memoryStart.heapUsed;
    
    execution.endTime = endTime;
    execution.duration = duration;
    execution.memoryEnd = memoryEnd;
    execution.memoryDelta = memoryDelta;
    execution.result = result;
    execution.status = 'success';
    
    const toolMetrics = this.metrics.toolExecutions.get(execution.toolName);
    
    // 更新成功统计
    toolMetrics.successCount++;
    toolMetrics.totalDuration += duration;
    toolMetrics.minDuration = Math.min(toolMetrics.minDuration, duration);
    toolMetrics.maxDuration = Math.max(toolMetrics.maxDuration, duration);
    toolMetrics.avgDuration = toolMetrics.totalDuration / toolMetrics.totalExecutions;
    
    // 更新内存使用统计
    const memUsage = toolMetrics.memoryUsage;
    memUsage.min = Math.min(memUsage.min, memoryEnd.heapUsed);
    memUsage.max = Math.max(memUsage.max, memoryEnd.heapUsed);
    memUsage.total += memoryEnd.heapUsed;
    memUsage.avg = memUsage.total / toolMetrics.totalExecutions;
    
    // 更新全局统计
    this.metrics.globalStats.totalDuration += duration;
    
    // 更新最近执行记录
    this.addRecentExecution(execution);
    toolMetrics.recentExecutions.push({
      ...execution,
      timestamp: endTime
    });
    
    // 保持最近执行记录的数量限制
    if (toolMetrics.recentExecutions.length > 100) {
      toolMetrics.recentExecutions = toolMetrics.recentExecutions.slice(-100);
    }
    
    // 计算错误率和超时率
    this.updateRates(toolMetrics);
    
    // 检查性能警报
    this.checkPerformanceAlerts(execution.toolName, toolMetrics);
    
    this.emit('executionCompleted', {
      executionId: execution.executionId,
      toolName: execution.toolName,
      duration,
      memoryDelta,
      result
    });
  }
  
  /**
   * 记录工具执行错误
   * @param {Object} execution - 执行对象
   * @param {Error} error - 错误对象
   */
  errorExecution(execution, error) {
    const endTime = Date.now();
    const duration = endTime - execution.startTime;
    
    execution.endTime = endTime;
    execution.duration = duration;
    execution.error = error;
    execution.status = 'error';
    
    const toolMetrics = this.metrics.toolExecutions.get(execution.toolName);
    toolMetrics.errorCount++;
    this.metrics.globalStats.totalErrors++;
    
    // 更新最近执行记录
    this.addRecentExecution(execution);
    
    // 更新错误率
    this.updateRates(toolMetrics);
    
    // 检查错误率警报
    this.checkErrorAlerts(execution.toolName, toolMetrics);
    
    this.emit('executionError', {
      executionId: execution.executionId,
      toolName: execution.toolName,
      duration,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    });
  }
  
  /**
   * 记录工具执行超时
   * @param {Object} execution - 执行对象
   */
  timeoutExecution(execution) {
    const endTime = Date.now();
    const duration = endTime - execution.startTime;
    
    execution.endTime = endTime;
    execution.duration = duration;
    execution.status = 'timeout';
    
    const toolMetrics = this.metrics.toolExecutions.get(execution.toolName);
    toolMetrics.timeoutCount++;
    this.metrics.globalStats.totalTimeouts++;
    
    // 更新最近执行记录
    this.addRecentExecution(execution);
    
    // 更新超时率
    this.updateRates(toolMetrics);
    
    // 检查超时率警报
    this.checkTimeoutAlerts(execution.toolName, toolMetrics);
    
    this.emit('executionTimeout', {
      executionId: execution.executionId,
      toolName: execution.toolName,
      duration
    });
  }
  
  /**
   * 添加到最近执行记录
   * @param {Object} execution - 执行对象
   */
  addRecentExecution(execution) {
    this.metrics.recentExecutions.push({
      ...execution,
      timestamp: execution.endTime || Date.now()
    });
    
    // 保持最近执行记录的数量限制
    if (this.metrics.recentExecutions.length > 1000) {
      this.metrics.recentExecutions = this.metrics.recentExecutions.slice(-1000);
    }
  }
  
  /**
   * 更新错误率和超时率
   * @param {Object} toolMetrics - 工具指标
   */
  updateRates(toolMetrics) {
    const total = toolMetrics.totalExecutions;
    toolMetrics.errorRate = total > 0 ? toolMetrics.errorCount / total : 0;
    toolMetrics.timeoutRate = total > 0 ? toolMetrics.timeoutCount / total : 0;
  }
  
  /**
   * 检查性能警报
   * @param {string} toolName - 工具名称
   * @param {Object} toolMetrics - 工具指标
   */
  checkPerformanceAlerts(toolName, toolMetrics) {
    const thresholds = this.config.alertThresholds;
    
    // 检查平均执行时间
    if (toolMetrics.avgDuration > thresholds.avgExecutionTime) {
      this.createAlert('performance', {
        toolName,
        metric: 'avgExecutionTime',
        value: toolMetrics.avgDuration,
        threshold: thresholds.avgExecutionTime,
        message: `工具 ${toolName} 平均执行时间 ${toolMetrics.avgDuration}ms 超过阈值 ${thresholds.avgExecutionTime}ms`
      });
    }
  }
  
  /**
   * 检查错误率警报
   * @param {string} toolName - 工具名称
   * @param {Object} toolMetrics - 工具指标
   */
  checkErrorAlerts(toolName, toolMetrics) {
    const thresholds = this.config.alertThresholds;
    
    if (toolMetrics.errorRate > thresholds.errorRate && toolMetrics.totalExecutions >= 10) {
      this.createAlert('error_rate', {
        toolName,
        metric: 'errorRate',
        value: toolMetrics.errorRate,
        threshold: thresholds.errorRate,
        message: `工具 ${toolName} 错误率 ${(toolMetrics.errorRate * 100).toFixed(2)}% 超过阈值 ${(thresholds.errorRate * 100).toFixed(2)}%`
      });
    }
  }
  
  /**
   * 检查超时率警报
   * @param {string} toolName - 工具名称
   * @param {Object} toolMetrics - 工具指标
   */
  checkTimeoutAlerts(toolName, toolMetrics) {
    const thresholds = this.config.alertThresholds;
    
    if (toolMetrics.timeoutRate > thresholds.timeoutRate && toolMetrics.totalExecutions >= 10) {
      this.createAlert('timeout_rate', {
        toolName,
        metric: 'timeoutRate',
        value: toolMetrics.timeoutRate,
        threshold: thresholds.timeoutRate,
        message: `工具 ${toolName} 超时率 ${(toolMetrics.timeoutRate * 100).toFixed(2)}% 超过阈值 ${(thresholds.timeoutRate * 100).toFixed(2)}%`
      });
    }
  }
  
  /**
   * 创建警报
   * @param {string} type - 警报类型
   * @param {Object} data - 警报数据
   */
  createAlert(type, data) {
    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      timestamp: Date.now(),
      level: this.getAlertLevel(type, data),
      ...data
    };
    
    this.metrics.alerts.push(alert);
    
    // 保持警报记录数量限制
    if (this.metrics.alerts.length > 500) {
      this.metrics.alerts = this.metrics.alerts.slice(-500);
    }
    
    this.emit('alert', alert);
  }
  
  /**
   * 获取警报级别
   * @param {string} type - 警报类型
   * @param {Object} data - 警报数据
   * @returns {string} 警报级别
   */
  getAlertLevel(type, data) {
    switch (type) {
      case 'error_rate':
        return data.value > 0.3 ? 'critical' : data.value > 0.2 ? 'high' : 'medium';
      case 'timeout_rate':
        return data.value > 0.2 ? 'high' : 'medium';
      case 'performance':
        return data.value > 60000 ? 'high' : 'medium';
      default:
        return 'medium';
    }
  }
  
  /**
   * 获取内存使用情况
   * @returns {Object} 内存使用信息
   */
  getMemoryUsage() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage();
    }
    return { heapUsed: 0, heapTotal: 0 };
  }
  
  /**
   * 获取工具性能统计
   * @param {string} toolName - 工具名称（可选）
   * @returns {Object} 性能统计
   */
  getStats(toolName = null) {
    if (toolName) {
      const toolMetrics = this.metrics.toolExecutions.get(toolName);
      if (!toolMetrics) {
        return null;
      }
      
      return {
        ...toolMetrics,
        recentExecutions: toolMetrics.recentExecutions.slice(-10) // 只返回最近10次
      };
    }
    
    // 返回全局统计
    const globalStats = { ...this.metrics.globalStats };
    globalStats.avgDuration = globalStats.totalExecutions > 0 
      ? globalStats.totalDuration / globalStats.totalExecutions 
      : 0;
    globalStats.errorRate = globalStats.totalExecutions > 0 
      ? globalStats.totalErrors / globalStats.totalExecutions 
      : 0;
    globalStats.timeoutRate = globalStats.totalExecutions > 0 
      ? globalStats.totalTimeouts / globalStats.totalExecutions 
      : 0;
    globalStats.uptime = Date.now() - globalStats.startTime;
    
    return {
      global: globalStats,
      tools: Array.from(this.metrics.toolExecutions.values()).map(tool => ({
        toolName: tool.toolName,
        totalExecutions: tool.totalExecutions,
        successCount: tool.successCount,
        errorCount: tool.errorCount,
        timeoutCount: tool.timeoutCount,
        avgDuration: tool.avgDuration,
        errorRate: tool.errorRate,
        timeoutRate: tool.timeoutRate,
        memoryUsage: tool.memoryUsage
      })),
      alerts: this.metrics.alerts.slice(-20), // 最近20个警报
      recentExecutions: this.metrics.recentExecutions.slice(-50) // 最近50次执行
    };
  }
  
  /**
   * 获取性能趋势数据
   * @param {string} toolName - 工具名称
   * @param {number} timeRange - 时间范围(毫秒)
   * @returns {Object} 趋势数据
   */
  getTrends(toolName, timeRange = 60 * 60 * 1000) { // 默认1小时
    const now = Date.now();
    const startTime = now - timeRange;
    
    const toolMetrics = this.metrics.toolExecutions.get(toolName);
    if (!toolMetrics) {
      return null;
    }
    
    const recentExecutions = toolMetrics.recentExecutions.filter(
      exec => exec.timestamp >= startTime
    );
    
    if (recentExecutions.length === 0) {
      return { noData: true };
    }
    
    // 按时间段分组统计
    const timeSlots = 10; // 分成10个时间段
    const slotDuration = timeRange / timeSlots;
    const trends = [];
    
    for (let i = 0; i < timeSlots; i++) {
      const slotStart = startTime + i * slotDuration;
      const slotEnd = slotStart + slotDuration;
      
      const slotExecutions = recentExecutions.filter(
        exec => exec.timestamp >= slotStart && exec.timestamp < slotEnd
      );
      
      const successCount = slotExecutions.filter(exec => exec.status === 'success').length;
      const errorCount = slotExecutions.filter(exec => exec.status === 'error').length;
      const timeoutCount = slotExecutions.filter(exec => exec.status === 'timeout').length;
      const avgDuration = slotExecutions.length > 0
        ? slotExecutions.reduce((sum, exec) => sum + exec.duration, 0) / slotExecutions.length
        : 0;
      
      trends.push({
        timestamp: slotStart,
        totalExecutions: slotExecutions.length,
        successCount,
        errorCount,
        timeoutCount,
        avgDuration,
        errorRate: slotExecutions.length > 0 ? errorCount / slotExecutions.length : 0
      });
    }
    
    return {
      toolName,
      timeRange,
      trends,
      summary: {
        totalExecutions: recentExecutions.length,
        avgDuration: recentExecutions.reduce((sum, exec) => sum + exec.duration, 0) / recentExecutions.length,
        errorRate: recentExecutions.filter(exec => exec.status === 'error').length / recentExecutions.length
      }
    };
  }
  
  /**
   * 重置指标数据
   * @param {string} toolName - 工具名称（可选，不提供则重置所有）
   */
  resetMetrics(toolName = null) {
    if (toolName) {
      this.metrics.toolExecutions.delete(toolName);
    } else {
      this.metrics.toolExecutions.clear();
      this.metrics.globalStats = {
        totalExecutions: 0,
        totalErrors: 0,
        totalTimeouts: 0,
        totalDuration: 0,
        startTime: Date.now()
      };
      this.metrics.recentExecutions = [];
      this.metrics.alerts = [];
    }
    
    this.emit('metricsReset', { toolName });
  }
  
  /**
   * 启动指标清理定时器
   */
  startMetricsCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanupOldMetrics();
    }, 60 * 60 * 1000); // 每小时清理一次
  }
  
  /**
   * 清理过期的指标数据
   */
  cleanupOldMetrics() {
    const now = Date.now();
    const retention = this.config.metricsRetention;
    
    // 清理过期的最近执行记录
    this.metrics.recentExecutions = this.metrics.recentExecutions.filter(
      exec => (now - exec.timestamp) <= retention
    );
    
    // 清理过期的工具执行记录
    for (const [toolName, toolMetrics] of this.metrics.toolExecutions) {
      toolMetrics.recentExecutions = toolMetrics.recentExecutions.filter(
        exec => (now - exec.timestamp) <= retention
      );
    }
    
    // 清理过期的警报
    this.metrics.alerts = this.metrics.alerts.filter(
      alert => (now - alert.timestamp) <= retention
    );
    
    this.emit('metricsCleanup', {
      recentExecutionsCount: this.metrics.recentExecutions.length,
      alertsCount: this.metrics.alerts.length
    });
  }
  
  /**
   * 销毁监控器
   */
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    this.removeAllListeners();
    
    this.emit('monitorDestroyed', {
      finalStats: this.getStats()
    });
  }
}

export default BrowserToolMonitor;
