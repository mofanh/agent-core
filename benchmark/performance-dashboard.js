/**
 * 浏览器工具性能监控仪表盘
 * 实时性能监控、历史趋势分析和性能告警
 */

import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 性能监控仪表盘类
 */
export class PerformanceDashboard extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      dataRetentionDays: config.dataRetentionDays || 7,
      metricsInterval: config.metricsInterval || 5000, // 5秒
      alertThresholds: {
        avgResponseTime: config.alertThresholds?.avgResponseTime || 10000, // 10秒
        errorRate: config.alertThresholds?.errorRate || 0.1, // 10%
        memoryUsage: config.alertThresholds?.memoryUsage || 500 * 1024 * 1024, // 500MB
        ...config.alertThresholds
      },
      storageDir: config.storageDir || join(__dirname, '../data/performance'),
      ...config
    };
    
    this.metrics = {
      current: this.createEmptyMetrics(),
      history: [],
      alerts: []
    };
    
    this.isMonitoring = false;
    this.metricsTimer = null;
    this.connectedSystems = new Map();
    
    // 确保存储目录存在
    this.ensureStorageDir();
    
    // 加载历史数据
    this.loadHistoricalData();
  }
  
  /**
   * 创建空的指标对象
   */
  createEmptyMetrics() {
    return {
      timestamp: Date.now(),
      system: {
        memory: {
          heapUsed: 0,
          heapTotal: 0,
          external: 0,
          rss: 0
        },
        cpu: {
          user: 0,
          system: 0
        }
      },
      browser: {
        instances: {
          active: 0,
          pooled: 0,
          total: 0
        },
        operations: {
          total: 0,
          successful: 0,
          failed: 0,
          avgResponseTime: 0,
          throughput: 0
        }
      },
      tools: {
        executions: new Map(),
        errorRates: new Map(),
        avgTimes: new Map()
      },
      chains: {
        executions: 0,
        successful: 0,
        failed: 0,
        avgSteps: 0,
        avgTime: 0
      }
    };
  }
  
  /**
   * 开始监控
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.log('⚠️ 性能监控已经在运行中');
      return;
    }
    
    console.log('🚀 启动性能监控仪表盘');
    this.isMonitoring = true;
    
    // 启动定期指标收集
    this.metricsTimer = setInterval(() => {
      this.collectMetrics();
    }, this.config.metricsInterval);
    
    // 立即收集一次指标
    this.collectMetrics();
    
    this.emit('monitoring-started');
  }
  
  /**
   * 停止监控
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }
    
    console.log('🛑 停止性能监控');
    this.isMonitoring = false;
    
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }
    
    // 保存最终数据
    this.saveHistoricalData();
    
    this.emit('monitoring-stopped');
  }
  
  /**
   * 注册浏览器工具系统
   */
  registerSystem(systemId, browserSystem) {
    this.connectedSystems.set(systemId, browserSystem);
    
    // 监听系统事件
    if (browserSystem.on) {
      browserSystem.on('tool-executed', (data) => {
        this.recordToolExecution(systemId, data);
      });
      
      browserSystem.on('tool-error', (data) => {
        this.recordToolError(systemId, data);
      });
      
      browserSystem.on('chain-executed', (data) => {
        this.recordChainExecution(systemId, data);
      });
    }
    
    console.log(`📊 注册系统监控: ${systemId}`);
    this.emit('system-registered', { systemId, browserSystem });
  }
  
  /**
   * 取消注册系统
   */
  unregisterSystem(systemId) {
    this.connectedSystems.delete(systemId);
    console.log(`📊 取消注册系统监控: ${systemId}`);
    this.emit('system-unregistered', { systemId });
  }
  
  /**
   * 收集当前指标
   */
  collectMetrics() {
    const timestamp = Date.now();
    const newMetrics = this.createEmptyMetrics();
    newMetrics.timestamp = timestamp;
    
    // 收集系统指标
    this.collectSystemMetrics(newMetrics);
    
    // 收集浏览器工具指标
    this.collectBrowserMetrics(newMetrics);
    
    // 更新当前指标
    this.metrics.current = newMetrics;
    
    // 添加到历史记录
    this.metrics.history.push(newMetrics);
    
    // 清理过期数据
    this.cleanupOldMetrics();
    
    // 检查告警
    this.checkAlerts(newMetrics);
    
    // 发出指标更新事件
    this.emit('metrics-updated', newMetrics);
    
    // 定期保存数据
    if (this.metrics.history.length % 12 === 0) { // 每分钟保存一次
      this.saveHistoricalData();
    }
  }
  
  /**
   * 收集系统指标
   */
  collectSystemMetrics(metrics) {
    // 内存使用
    const memUsage = process.memoryUsage();
    metrics.system.memory = {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss
    };
    
    // CPU 使用 (简化版)
    const cpuUsage = process.cpuUsage();
    metrics.system.cpu = {
      user: cpuUsage.user,
      system: cpuUsage.system
    };
  }
  
  /**
   * 收集浏览器工具指标
   */
  collectBrowserMetrics(metrics) {
    let totalInstances = 0;
    let totalPooled = 0;
    let totalOperations = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;
    let totalResponseTime = 0;
    let operationCount = 0;
    
    // 从已注册的系统收集指标
    this.connectedSystems.forEach((browserSystem, systemId) => {
      try {
        const stats = browserSystem.getStats();
        
        // 实例统计
        if (stats.toolManager?.instancePool) {
          totalInstances += stats.toolManager.instancePool.poolSize || 0;
          totalPooled += stats.toolManager.instancePool.available || 0;
        }
        
        // 操作统计
        if (stats.toolManager) {
          totalOperations += stats.toolManager.totalExecutions || 0;
          totalSuccessful += stats.toolManager.successfulExecutions || 0;
          totalFailed += stats.toolManager.failedExecutions || 0;
          
          if (stats.toolManager.avgResponseTime && stats.toolManager.totalExecutions) {
            totalResponseTime += stats.toolManager.avgResponseTime * stats.toolManager.totalExecutions;
            operationCount += stats.toolManager.totalExecutions;
          }
        }
        
        // 工具级别统计
        if (stats.tools) {
          Object.entries(stats.tools).forEach(([toolName, toolStats]) => {
            if (!metrics.tools.executions.has(toolName)) {
              metrics.tools.executions.set(toolName, 0);
              metrics.tools.errorRates.set(toolName, 0);
              metrics.tools.avgTimes.set(toolName, 0);
            }
            
            metrics.tools.executions.set(
              toolName, 
              metrics.tools.executions.get(toolName) + (toolStats.executions || 0)
            );
            
            if (toolStats.errorRate !== undefined) {
              metrics.tools.errorRates.set(toolName, toolStats.errorRate);
            }
            
            if (toolStats.avgTime !== undefined) {
              metrics.tools.avgTimes.set(toolName, toolStats.avgTime);
            }
          });
        }
        
      } catch (error) {
        console.warn(`收集系统 ${systemId} 指标时出错:`, error.message);
      }
    });
    
    // 计算聚合指标
    metrics.browser.instances = {
      active: totalInstances - totalPooled,
      pooled: totalPooled,
      total: totalInstances
    };
    
    metrics.browser.operations = {
      total: totalOperations,
      successful: totalSuccessful,
      failed: totalFailed,
      avgResponseTime: operationCount > 0 ? totalResponseTime / operationCount : 0,
      throughput: this.calculateThroughput(totalOperations)
    };
  }
  
  /**
   * 计算吞吐量
   */
  calculateThroughput(totalOperations) {
    if (this.metrics.history.length < 2) {
      return 0;
    }
    
    const lastMetrics = this.metrics.history[this.metrics.history.length - 1];
    const prevOperations = lastMetrics?.browser?.operations?.total || 0;
    const timeDiff = (Date.now() - lastMetrics.timestamp) / 1000;
    
    return timeDiff > 0 ? (totalOperations - prevOperations) / timeDiff : 0;
  }
  
  /**
   * 记录工具执行
   */
  recordToolExecution(systemId, data) {
    // 这将在下次指标收集时被包含
    this.emit('tool-execution-recorded', { systemId, data });
  }
  
  /**
   * 记录工具错误
   */
  recordToolError(systemId, data) {
    this.emit('tool-error-recorded', { systemId, data });
  }
  
  /**
   * 记录工具链执行
   */
  recordChainExecution(systemId, data) {
    this.emit('chain-execution-recorded', { systemId, data });
  }
  
  /**
   * 检查告警条件
   */
  checkAlerts(metrics) {
    const alerts = [];
    
    // 响应时间告警
    if (metrics.browser.operations.avgResponseTime > this.config.alertThresholds.avgResponseTime) {
      alerts.push({
        type: 'performance',
        level: 'warning',
        message: `平均响应时间过高: ${metrics.browser.operations.avgResponseTime.toFixed(2)}ms (阈值: ${this.config.alertThresholds.avgResponseTime}ms)`,
        timestamp: metrics.timestamp,
        value: metrics.browser.operations.avgResponseTime,
        threshold: this.config.alertThresholds.avgResponseTime
      });
    }
    
    // 错误率告警
    const errorRate = metrics.browser.operations.total > 0 
      ? metrics.browser.operations.failed / metrics.browser.operations.total 
      : 0;
    
    if (errorRate > this.config.alertThresholds.errorRate) {
      alerts.push({
        type: 'reliability',
        level: 'error',
        message: `错误率过高: ${(errorRate * 100).toFixed(2)}% (阈值: ${(this.config.alertThresholds.errorRate * 100).toFixed(2)}%)`,
        timestamp: metrics.timestamp,
        value: errorRate,
        threshold: this.config.alertThresholds.errorRate
      });
    }
    
    // 内存使用告警
    if (metrics.system.memory.heapUsed > this.config.alertThresholds.memoryUsage) {
      alerts.push({
        type: 'resource',
        level: 'warning',
        message: `内存使用过高: ${(metrics.system.memory.heapUsed / 1024 / 1024).toFixed(2)}MB (阈值: ${(this.config.alertThresholds.memoryUsage / 1024 / 1024).toFixed(2)}MB)`,
        timestamp: metrics.timestamp,
        value: metrics.system.memory.heapUsed,
        threshold: this.config.alertThresholds.memoryUsage
      });
    }
    
    // 实例池健康检查
    if (metrics.browser.instances.total > 0 && metrics.browser.instances.active === 0) {
      alerts.push({
        type: 'availability',
        level: 'error',
        message: '没有活跃的浏览器实例可用',
        timestamp: metrics.timestamp,
        value: metrics.browser.instances.active,
        threshold: 1
      });
    }
    
    // 发出新告警
    alerts.forEach(alert => {
      // 检查是否是新告警（避免重复）
      const isNewAlert = !this.metrics.alerts.some(existingAlert => 
        existingAlert.type === alert.type && 
        existingAlert.level === alert.level &&
        Math.abs(existingAlert.timestamp - alert.timestamp) < 60000 // 1分钟内的相同告警视为重复
      );
      
      if (isNewAlert) {
        this.metrics.alerts.push(alert);
        this.emit('alert', alert);
        console.warn(`🚨 性能告警 [${alert.level}]: ${alert.message}`);
      }
    });
    
    // 清理过期告警
    this.cleanupOldAlerts();
  }
  
  /**
   * 清理过期指标
   */
  cleanupOldMetrics() {
    const cutoffTime = Date.now() - (this.config.dataRetentionDays * 24 * 60 * 60 * 1000);
    this.metrics.history = this.metrics.history.filter(metric => metric.timestamp > cutoffTime);
  }
  
  /**
   * 清理过期告警
   */
  cleanupOldAlerts() {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 保留24小时的告警
    this.metrics.alerts = this.metrics.alerts.filter(alert => alert.timestamp > cutoffTime);
  }
  
  /**
   * 获取当前性能概览
   */
  getPerformanceOverview() {
    const current = this.metrics.current;
    const history = this.metrics.history;
    
    // 计算趋势
    const trends = this.calculateTrends();
    
    return {
      timestamp: current.timestamp,
      system: {
        memory: {
          current: (current.system.memory.heapUsed / 1024 / 1024).toFixed(2) + 'MB',
          trend: trends.memory
        },
        cpu: {
          current: current.system.cpu,
          trend: trends.cpu
        }
      },
      browser: {
        instances: current.browser.instances,
        operations: {
          ...current.browser.operations,
          avgResponseTime: current.browser.operations.avgResponseTime.toFixed(2) + 'ms',
          throughput: current.browser.operations.throughput.toFixed(2) + ' ops/s',
          errorRate: current.browser.operations.total > 0 
            ? ((current.browser.operations.failed / current.browser.operations.total) * 100).toFixed(2) + '%'
            : '0%'
        }
      },
      tools: {
        totalExecutions: Array.from(current.tools.executions.values()).reduce((sum, val) => sum + val, 0),
        topTools: this.getTopTools(),
        slowestTools: this.getSlowestTools()
      },
      alerts: {
        total: this.metrics.alerts.length,
        recent: this.metrics.alerts.filter(alert => 
          Date.now() - alert.timestamp < 60 * 60 * 1000 // 最近1小时
        ),
        byLevel: this.groupAlertsByLevel()
      },
      trends: trends
    };
  }
  
  /**
   * 计算性能趋势
   */
  calculateTrends() {
    if (this.metrics.history.length < 2) {
      return {
        memory: 'stable',
        cpu: 'stable',
        responseTime: 'stable',
        throughput: 'stable'
      };
    }
    
    const recent = this.metrics.history.slice(-5); // 最近5个数据点
    const earlier = this.metrics.history.slice(-10, -5); // 更早的5个数据点
    
    if (earlier.length === 0) {
      return {
        memory: 'stable',
        cpu: 'stable',
        responseTime: 'stable',
        throughput: 'stable'
      };
    }
    
    const recentAvg = {
      memory: recent.reduce((sum, m) => sum + m.system.memory.heapUsed, 0) / recent.length,
      responseTime: recent.reduce((sum, m) => sum + m.browser.operations.avgResponseTime, 0) / recent.length,
      throughput: recent.reduce((sum, m) => sum + m.browser.operations.throughput, 0) / recent.length
    };
    
    const earlierAvg = {
      memory: earlier.reduce((sum, m) => sum + m.system.memory.heapUsed, 0) / earlier.length,
      responseTime: earlier.reduce((sum, m) => sum + m.browser.operations.avgResponseTime, 0) / earlier.length,
      throughput: earlier.reduce((sum, m) => sum + m.browser.operations.throughput, 0) / earlier.length
    };
    
    const getTrend = (recent, earlier, threshold = 0.1) => {
      const change = (recent - earlier) / earlier;
      if (Math.abs(change) < threshold) return 'stable';
      return change > 0 ? 'increasing' : 'decreasing';
    };
    
    return {
      memory: getTrend(recentAvg.memory, earlierAvg.memory),
      responseTime: getTrend(recentAvg.responseTime, earlierAvg.responseTime),
      throughput: getTrend(recentAvg.throughput, earlierAvg.throughput, 0.2),
      cpu: 'stable' // CPU趋势计算比较复杂，暂时固定
    };
  }
  
  /**
   * 获取使用最多的工具
   */
  getTopTools() {
    const executions = Array.from(this.metrics.current.tools.executions.entries());
    return executions
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tool, count]) => ({ tool, executions: count }));
  }
  
  /**
   * 获取最慢的工具
   */
  getSlowestTools() {
    const avgTimes = Array.from(this.metrics.current.tools.avgTimes.entries());
    return avgTimes
      .filter(([, time]) => time > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tool, time]) => ({ tool, avgTime: time.toFixed(2) + 'ms' }));
  }
  
  /**
   * 按级别分组告警
   */
  groupAlertsByLevel() {
    const groups = { error: 0, warning: 0, info: 0 };
    this.metrics.alerts.forEach(alert => {
      groups[alert.level] = (groups[alert.level] || 0) + 1;
    });
    return groups;
  }
  
  /**
   * 获取历史性能数据
   */
  getHistoricalData(timeRange = '1h') {
    const now = Date.now();
    const ranges = {
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };
    
    const cutoff = now - (ranges[timeRange] || ranges['1h']);
    
    return this.metrics.history
      .filter(metric => metric.timestamp > cutoff)
      .map(metric => ({
        timestamp: metric.timestamp,
        memory: metric.system.memory.heapUsed,
        responseTime: metric.browser.operations.avgResponseTime,
        throughput: metric.browser.operations.throughput,
        errorRate: metric.browser.operations.total > 0 
          ? metric.browser.operations.failed / metric.browser.operations.total 
          : 0,
        activeInstances: metric.browser.instances.active
      }));
  }
  
  /**
   * 生成性能报告
   */
  generatePerformanceReport(timeRange = '24h') {
    const data = this.getHistoricalData(timeRange);
    const overview = this.getPerformanceOverview();
    
    if (data.length === 0) {
      return {
        timeRange,
        message: '指定时间范围内没有数据'
      };
    }
    
    const stats = {
      memory: {
        avg: data.reduce((sum, d) => sum + d.memory, 0) / data.length,
        max: Math.max(...data.map(d => d.memory)),
        min: Math.min(...data.map(d => d.memory))
      },
      responseTime: {
        avg: data.reduce((sum, d) => sum + d.responseTime, 0) / data.length,
        max: Math.max(...data.map(d => d.responseTime)),
        min: Math.min(...data.map(d => d.responseTime))
      },
      throughput: {
        avg: data.reduce((sum, d) => sum + d.throughput, 0) / data.length,
        max: Math.max(...data.map(d => d.throughput)),
        min: Math.min(...data.map(d => d.throughput))
      },
      errorRate: {
        avg: data.reduce((sum, d) => sum + d.errorRate, 0) / data.length,
        max: Math.max(...data.map(d => d.errorRate)),
        min: Math.min(...data.map(d => d.errorRate))
      }
    };
    
    return {
      timeRange,
      period: {
        start: new Date(data[0].timestamp).toISOString(),
        end: new Date(data[data.length - 1].timestamp).toISOString(),
        dataPoints: data.length
      },
      statistics: stats,
      currentState: overview,
      recommendations: this.generateRecommendations(stats, overview),
      alerts: this.metrics.alerts.filter(alert => 
        alert.timestamp > Date.now() - (24 * 60 * 60 * 1000)
      )
    };
  }
  
  /**
   * 生成性能建议
   */
  generateRecommendations(stats, overview) {
    const recommendations = [];
    
    // 内存建议
    if (stats.memory.avg > 200 * 1024 * 1024) { // 200MB
      recommendations.push({
        type: 'memory',
        level: 'warning',
        message: '平均内存使用较高，建议考虑实例池优化或增加清理频率'
      });
    }
    
    // 响应时间建议
    if (stats.responseTime.avg > 5000) { // 5秒
      recommendations.push({
        type: 'performance',
        level: 'warning',
        message: '平均响应时间较慢，建议检查网络连接或增加实例池大小'
      });
    }
    
    // 吞吐量建议
    if (stats.throughput.avg < 0.5) { // 0.5 ops/s
      recommendations.push({
        type: 'throughput',
        level: 'info',
        message: '吞吐量较低，可考虑增加并发级别或优化工具链'
      });
    }
    
    // 错误率建议
    if (stats.errorRate.avg > 0.05) { // 5%
      recommendations.push({
        type: 'reliability',
        level: 'error',
        message: '错误率较高，需要检查目标网站稳定性和工具配置'
      });
    }
    
    // 实例池建议
    if (overview.browser.instances.pooled === 0 && overview.browser.instances.total > 0) {
      recommendations.push({
        type: 'optimization',
        level: 'info',
        message: '未使用实例池功能，建议启用以提高性能'
      });
    }
    
    return recommendations;
  }
  
  /**
   * 确保存储目录存在
   */
  ensureStorageDir() {
    if (!existsSync(this.config.storageDir)) {
      mkdirSync(this.config.storageDir, { recursive: true });
    }
  }
  
  /**
   * 保存历史数据
   */
  saveHistoricalData() {
    try {
      const dataFile = join(this.config.storageDir, 'performance-history.json');
      const data = {
        lastUpdated: Date.now(),
        metrics: this.metrics.history.slice(-1000), // 只保存最近1000个数据点
        alerts: this.metrics.alerts
      };
      
      writeFileSync(dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('保存性能历史数据失败:', error);
    }
  }
  
  /**
   * 加载历史数据
   */
  loadHistoricalData() {
    try {
      const dataFile = join(this.config.storageDir, 'performance-history.json');
      
      if (existsSync(dataFile)) {
        const data = JSON.parse(readFileSync(dataFile, 'utf-8'));
        
        if (data.metrics && Array.isArray(data.metrics)) {
          this.metrics.history = data.metrics;
        }
        
        if (data.alerts && Array.isArray(data.alerts)) {
          this.metrics.alerts = data.alerts;
        }
        
        console.log(`📊 加载了 ${this.metrics.history.length} 条历史记录和 ${this.metrics.alerts.length} 条告警`);
      }
    } catch (error) {
      console.warn('加载性能历史数据失败:', error.message);
    }
  }
  
  /**
   * 导出性能数据
   */
  exportData(format = 'json') {
    const exportData = {
      exportTime: new Date().toISOString(),
      config: this.config,
      currentMetrics: this.metrics.current,
      historicalData: this.metrics.history,
      alerts: this.metrics.alerts,
      overview: this.getPerformanceOverview()
    };
    
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      
      case 'csv':
        return this.convertToCSV(exportData.historicalData);
      
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }
  
  /**
   * 转换为CSV格式
   */
  convertToCSV(data) {
    if (!data || data.length === 0) {
      return 'timestamp,memory,responseTime,throughput,errorRate,activeInstances\n';
    }
    
    const headers = 'timestamp,memory,responseTime,throughput,errorRate,activeInstances\n';
    const rows = data.map(metric => [
      new Date(metric.timestamp).toISOString(),
      metric.system.memory.heapUsed,
      metric.browser.operations.avgResponseTime,
      metric.browser.operations.throughput,
      metric.browser.operations.total > 0 ? metric.browser.operations.failed / metric.browser.operations.total : 0,
      metric.browser.instances.active
    ].join(','));
    
    return headers + rows.join('\n');
  }
  
  /**
   * 清理资源
   */
  cleanup() {
    this.stopMonitoring();
    this.connectedSystems.clear();
    this.removeAllListeners();
    console.log('📊 性能监控仪表盘已清理');
  }
}

/**
 * 创建性能监控仪表盘
 */
export function createPerformanceDashboard(config = {}) {
  return new PerformanceDashboard(config);
}

// 导出默认配置
export const DEFAULT_DASHBOARD_CONFIG = {
  dataRetentionDays: 7,
  metricsInterval: 5000,
  alertThresholds: {
    avgResponseTime: 10000,
    errorRate: 0.1,
    memoryUsage: 500 * 1024 * 1024
  }
};
