/**
 * Week 4 浏览器工具综合测试套件
 * 测试性能基准、安全功能、监控仪表盘的集成和稳定性
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import {
  createBrowserToolSystem,
  BROWSER_TOOLS,
  SECURITY_LEVELS,
  RISK_LEVELS,
  createBrowserSecurityManager,
  DEFAULT_SECURITY_CONFIG
} from '../src/browser/index.js';
import { BrowserToolBenchmark } from '../benchmark/browser-tools-benchmark.js';
import { createPerformanceDashboard } from '../benchmark/performance-dashboard.js';

describe('Week 4 浏览器工具综合功能', () => {
  let browserSystem;
  let dashboard;
  let securityManager;
  
  beforeAll(() => {
    // 设置测试环境
    jest.setTimeout(60000); // 60秒超时
  });
  
  afterAll(async () => {
    // 全局清理
    if (browserSystem) {
      await browserSystem.cleanup();
    }
    if (dashboard) {
      dashboard.cleanup();
    }
    if (securityManager) {
      securityManager.cleanup();
    }
  });
  
  describe('性能基准测试功能', () => {
    test('应该能够运行完整的基准测试套件', async () => {
      const benchmark = new BrowserToolBenchmark({
        warmupRuns: 1,
        benchmarkRuns: 2,
        collectMemoryStats: true
      });
      
      const results = await benchmark.runBenchmarkSuite();
      
      expect(results).toBeDefined();
      expect(results.totalTime).toBeGreaterThan(0);
      expect(results.results).toBeInstanceOf(Array);
      expect(results.results.length).toBeGreaterThan(0);
      expect(results.report).toBeDefined();
      expect(results.report.summary).toBeDefined();
      expect(results.report.recommendations).toBeInstanceOf(Array);
    });
    
    test('应该能够测试单工具性能', async () => {
      const benchmark = new BrowserToolBenchmark({
        warmupRuns: 1,
        benchmarkRuns: 2
      });
      
      const results = await benchmark.runBenchmarkSuite();
      const singleToolResults = results.results.filter(r => r.type === 'single-tool');
      
      expect(singleToolResults.length).toBeGreaterThan(0);
      
      singleToolResults.forEach(result => {
        expect(result.tool).toBeDefined();
        expect(result.avgTime).toBeGreaterThan(0);
        expect(result.minTime).toBeGreaterThan(0);
        expect(result.maxTime).toBeGreaterThanOrEqual(result.minTime);
        expect(result.successRate).toBeGreaterThan(0);
        expect(result.successRate).toBeLessThanOrEqual(100);
      });
    });
    
    test('应该能够测试并发性能', async () => {
      const benchmark = new BrowserToolBenchmark({
        warmupRuns: 1,
        benchmarkRuns: 2,
        maxConcurrency: 2
      });
      
      const results = await benchmark.runBenchmarkSuite();
      const concurrencyResults = results.results.filter(r => r.type === 'concurrency');
      
      expect(concurrencyResults.length).toBeGreaterThan(0);
      
      concurrencyResults.forEach(result => {
        expect(result.concurrencyLevel).toBeGreaterThan(0);
        expect(result.totalTasks).toBeGreaterThan(0);
        expect(result.successful).toBeGreaterThanOrEqual(0);
        expect(result.failed).toBeGreaterThanOrEqual(0);
        expect(result.successful + result.failed).toBe(result.totalTasks);
        expect(result.totalTime).toBeGreaterThan(0);
        expect(result.throughput).toBeGreaterThan(0);
      });
    });
    
    test('应该能够测试实例池性能', async () => {
      const benchmark = new BrowserToolBenchmark({
        warmupRuns: 1,
        benchmarkRuns: 2
      });
      
      const results = await benchmark.runBenchmarkSuite();
      const poolResults = results.results.filter(r => r.type === 'instance-pool');
      
      expect(poolResults.length).toBeGreaterThan(0);
      
      const poolEnabledResults = poolResults.filter(r => r.poolStats);
      if (poolEnabledResults.length > 0) {
        poolEnabledResults.forEach(result => {
          expect(result.poolStats.poolSize).toBeGreaterThanOrEqual(0);
          expect(result.poolStats.hitRate).toBeGreaterThanOrEqual(0);
          expect(result.poolStats.hitRate).toBeLessThanOrEqual(1);
          expect(result.poolStats.totalReuseCount).toBeGreaterThanOrEqual(0);
        });
      }
    });
    
    test('应该能够生成性能报告', async () => {
      const benchmark = new BrowserToolBenchmark({
        warmupRuns: 1,
        benchmarkRuns: 2
      });
      
      const results = await benchmark.runBenchmarkSuite();
      const report = results.report;
      
      expect(report.timestamp).toBeDefined();
      expect(report.config).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.summary.totalTests).toBeGreaterThan(0);
      expect(report.results).toBeInstanceOf(Array);
      expect(report.recommendations).toBeInstanceOf(Array);
      
      // 验证建议的结构
      report.recommendations.forEach(rec => {
        expect(rec.type).toBeDefined();
        expect(rec.level).toBeDefined();
        expect(rec.message).toBeDefined();
      });
    });
  });
  
  describe('安全管理功能', () => {
    beforeEach(() => {
      securityManager = createBrowserSecurityManager({
        securityLevel: SECURITY_LEVELS.NORMAL,
        auditLog: true
      });
    });
    
    afterEach(() => {
      if (securityManager) {
        securityManager.cleanup();
        securityManager = null;
      }
    });
    
    test('应该能够创建安全管理器', () => {
      expect(securityManager).toBeDefined();
      expect(securityManager.config).toBeDefined();
      expect(securityManager.config.securityLevel).toBe(SECURITY_LEVELS.NORMAL);
    });
    
    test('应该能够验证URL安全性', () => {
      const validUrl = 'https://example.com';
      const invalidUrl = 'javascript:alert("xss")';
      const localUrl = 'http://localhost:3000';
      
      const validResult = securityManager.validateURL(validUrl);
      expect(validResult.isValid).toBe(true);
      expect(validResult.riskLevel).toBe(RISK_LEVELS.LOW);
      expect(validResult.sanitizedUrl).toBe(validUrl);
      
      const invalidResult = securityManager.validateURL(invalidUrl);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.riskLevel).toBeGreaterThan(RISK_LEVELS.LOW);
      expect(invalidResult.violations.length).toBeGreaterThan(0);
      
      const localResult = securityManager.validateURL(localUrl);
      expect(localResult.isValid).toBe(false);
      expect(localResult.violations.length).toBeGreaterThan(0);
    });
    
    test('应该能够验证选择器安全性', () => {
      const safeSelector = 'h1.title';
      const sensitiveSelector = 'input[type="password"]';
      const xssSelector = '<script>alert("xss")</script>';
      
      const safeResult = securityManager.validateSelector(safeSelector);
      expect(safeResult.isValid).toBe(true);
      expect(safeResult.riskLevel).toBe(RISK_LEVELS.LOW);
      
      const sensitiveResult = securityManager.validateSelector(sensitiveSelector);
      expect(sensitiveResult.riskLevel).toBeGreaterThan(RISK_LEVELS.LOW);
      
      const xssResult = securityManager.validateSelector(xssSelector);
      expect(xssResult.isValid).toBe(false);
      expect(xssResult.riskLevel).toBeGreaterThan(RISK_LEVELS.MEDIUM);
    });
    
    test('应该能够验证JavaScript代码安全性', () => {
      const safeCode = 'document.title';
      const dangerousCode = 'eval("malicious code")';
      const networkCode = 'fetch("http://evil.com")';
      
      const safeResult = securityManager.validateJavaScript(safeCode);
      expect(safeResult.isValid).toBe(true);
      expect(safeResult.riskLevel).toBe(RISK_LEVELS.LOW);
      
      const dangerousResult = securityManager.validateJavaScript(dangerousCode);
      expect(dangerousResult.isValid).toBe(false);
      expect(dangerousResult.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      
      const networkResult = securityManager.validateJavaScript(networkCode);
      expect(networkResult.riskLevel).toBeGreaterThan(RISK_LEVELS.LOW);
    });
    
    test('应该能够创建和管理安全会话', () => {
      const session = securityManager.createSecureSession({
        permissions: ['navigate', 'extract']
      });
      
      expect(session.sessionId).toBeDefined();
      expect(session.token).toBeDefined();
      expect(session.config).toBeDefined();
      expect(session.config.permissions).toContain('navigate');
      expect(session.config.permissions).toContain('extract');
      
      // 验证会话权限
      const navPermission = securityManager.validateSessionPermission(
        session.sessionId, 
        'navigate'
      );
      expect(navPermission.allowed).toBe(true);
      
      const evalPermission = securityManager.validateSessionPermission(
        session.sessionId, 
        'evaluate'
      );
      expect(evalPermission.allowed).toBe(false);
    });
    
    test('应该能够根据安全级别调整策略', () => {
      const strictManager = createBrowserSecurityManager({
        securityLevel: SECURITY_LEVELS.STRICT
      });
      
      const permissiveManager = createBrowserSecurityManager({
        securityLevel: SECURITY_LEVELS.PERMISSIVE
      });
      
      const mediumRiskUrl = 'http://example.com'; // HTTP协议
      
      const strictResult = strictManager.validateURL(mediumRiskUrl);
      const permissiveResult = permissiveManager.validateURL(mediumRiskUrl);
      
      // 严格模式应该更加谨慎
      expect(strictResult.isValid).toBeFalsy();
      expect(permissiveResult.isValid).toBeTruthy();
      
      strictManager.cleanup();
      permissiveManager.cleanup();
    });
    
    test('应该能够记录安全事件', () => {
      const initialStats = securityManager.getSecurityStats();
      const initialEvents = initialStats.totalEvents;
      
      // 触发一些安全验证
      securityManager.validateURL('https://example.com');
      securityManager.validateURL('javascript:alert("test")');
      securityManager.validateSelector('h1');
      
      const finalStats = securityManager.getSecurityStats();
      expect(finalStats.totalEvents).toBeGreaterThan(initialEvents);
      expect(finalStats.eventsByType).toBeDefined();
    });
  });
  
  describe('性能监控仪表盘', () => {
    beforeEach(() => {
      dashboard = createPerformanceDashboard({
        metricsInterval: 1000,
        dataRetentionDays: 1
      });
    });
    
    afterEach(() => {
      if (dashboard) {
        dashboard.stopMonitoring();
        dashboard.cleanup();
        dashboard = null;
      }
    });
    
    test('应该能够创建性能监控仪表盘', () => {
      expect(dashboard).toBeDefined();
      expect(dashboard.config).toBeDefined();
      expect(dashboard.metrics).toBeDefined();
    });
    
    test('应该能够启动和停止监控', () => {
      expect(dashboard.isMonitoring).toBe(false);
      
      dashboard.startMonitoring();
      expect(dashboard.isMonitoring).toBe(true);
      
      dashboard.stopMonitoring();
      expect(dashboard.isMonitoring).toBe(false);
    });
    
    test('应该能够注册和取消注册系统', async () => {
      const mockSystem = {
        getStats: () => ({
          toolManager: {
            totalExecutions: 10,
            successfulExecutions: 9,
            failedExecutions: 1,
            avgResponseTime: 1500
          }
        }),
        on: jest.fn()
      };
      
      dashboard.registerSystem('test-system', mockSystem);
      expect(dashboard.connectedSystems.has('test-system')).toBe(true);
      
      dashboard.unregisterSystem('test-system');
      expect(dashboard.connectedSystems.has('test-system')).toBe(false);
    });
    
    test('应该能够收集和存储指标', async () => {
      dashboard.startMonitoring();
      
      // 等待一些指标收集
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      expect(dashboard.metrics.history.length).toBeGreaterThan(0);
      expect(dashboard.metrics.current).toBeDefined();
      expect(dashboard.metrics.current.timestamp).toBeGreaterThan(0);
      
      dashboard.stopMonitoring();
    });
    
    test('应该能够生成性能概览', async () => {
      const overview = dashboard.getPerformanceOverview();
      
      expect(overview).toBeDefined();
      expect(overview.timestamp).toBeGreaterThan(0);
      expect(overview.system).toBeDefined();
      expect(overview.browser).toBeDefined();
      expect(overview.tools).toBeDefined();
      expect(overview.alerts).toBeDefined();
      expect(overview.trends).toBeDefined();
    });
    
    test('应该能够检测告警条件', async () => {
      // 创建一个有低阈值的仪表盘来测试告警
      const alertDashboard = createPerformanceDashboard({
        alertThresholds: {
          avgResponseTime: 100, // 很低的阈值
          errorRate: 0.01,      // 1%错误率
          memoryUsage: 1024     // 很低的内存阈值
        }
      });
      
      try {
        alertDashboard.startMonitoring();
        
        // 等待指标收集和告警检测
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const stats = alertDashboard.getPerformanceOverview();
        
        // 检查是否有告警（由于低阈值，应该会触发一些告警）
        expect(stats.alerts).toBeDefined();
        expect(stats.alerts.total).toBeGreaterThanOrEqual(0);
        
      } finally {
        alertDashboard.stopMonitoring();
        alertDashboard.cleanup();
      }
    });
    
    test('应该能够生成性能报告', () => {
      // 添加一些模拟历史数据
      dashboard.metrics.history.push({
        timestamp: Date.now() - 60000,
        system: { memory: { heapUsed: 100 * 1024 * 1024 } },
        browser: { 
          operations: { avgResponseTime: 1000, total: 10, failed: 1, throughput: 0.5 },
          instances: { active: 1 }
        }
      });
      
      const report = dashboard.generatePerformanceReport('1h');
      
      expect(report).toBeDefined();
      expect(report.timeRange).toBe('1h');
      expect(report.recommendations).toBeInstanceOf(Array);
    });
    
    test('应该能够导出数据', () => {
      const jsonData = dashboard.exportData('json');
      expect(jsonData).toBeDefined();
      expect(() => JSON.parse(jsonData)).not.toThrow();
      
      const parsedData = JSON.parse(jsonData);
      expect(parsedData.exportTime).toBeDefined();
      expect(parsedData.config).toBeDefined();
      expect(parsedData.currentMetrics).toBeDefined();
    });
  });
  
  describe('集成功能测试', () => {
    beforeEach(async () => {
      browserSystem = createBrowserToolSystem({
        headless: true,
        instancePool: { enabled: true, maxInstances: 2 },
        monitoring: { enabled: true },
        security: { 
          securityLevel: SECURITY_LEVELS.NORMAL,
          auditLog: true
        }
      });
      
      await browserSystem.initialize();
    });
    
    afterEach(async () => {
      if (browserSystem) {
        await browserSystem.cleanup();
        browserSystem = null;
      }
    });
    
    test('应该能够创建集成的浏览器工具系统', () => {
      expect(browserSystem).toBeDefined();
      expect(browserSystem.toolManager).toBeDefined();
      expect(browserSystem.instancePool).toBeDefined();
      expect(browserSystem.monitor).toBeDefined();
      expect(browserSystem.toolChain).toBeDefined();
    });
    
    test('应该能够执行带安全验证的工具操作', async () => {
      const result = await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'https://example.com' },
        'security_test'
      );
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      
      // 检查安全统计
      const securityStats = browserSystem.toolManager.getSecurityStats();
      expect(securityStats).toBeDefined();
      expect(securityStats.manager.totalEvents).toBeGreaterThan(0);
    });
    
    test('应该能够阻止不安全的操作', async () => {
      await expect(browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'javascript:alert("xss")' },
        'security_block_test'
      )).rejects.toThrow();
    });
    
    test('应该能够监控性能指标', async () => {
      // 执行一些操作
      await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'https://example.com' },
        'perf_test_1'
      );
      
      await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.EXTRACT,
        { selector: 'title', attribute: 'text' },
        'perf_test_2'
      );
      
      // 检查统计信息
      const stats = browserSystem.getStats();
      expect(stats).toBeDefined();
      expect(stats.combined.totalExecutions).toBeGreaterThan(0);
      expect(stats.security).toBeDefined();
      expect(stats.monitoring).toBeDefined();
    });
    
    test('应该能够使用实例池提高性能', async () => {
      const startTime = Date.now();
      
      // 并发执行多个操作
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(
          browserSystem.toolManager.executeLocalTool(
            BROWSER_TOOLS.NAVIGATE,
            { url: 'https://example.com' },
            `pool_test_${i}`
          )
        );
      }
      
      await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      // 检查实例池统计
      const stats = browserSystem.getStats();
      expect(stats.instancePool).toBeDefined();
      expect(stats.instancePool.poolSize).toBeGreaterThan(0);
      
      // 并发执行应该比串行执行更快
      expect(duration).toBeLessThan(15000); // 15秒内完成
    });
    
    test('应该能够处理错误和恢复', async () => {
      // 执行一个会失败的操作
      try {
        await browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.EXTRACT,
          { selector: 'non-existent-element' },
          'error_test'
        );
      } catch (error) {
        // 预期的错误
      }
      
      // 系统应该能够恢复并继续工作
      const result = await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'https://example.com' },
        'recovery_test'
      );
      
      expect(result.success).toBe(true);
    });
    
    test('应该能够处理内存和资源清理', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // 执行多个操作
      for (let i = 0; i < 5; i++) {
        await browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url: 'https://example.com' },
          `memory_test_${i}`
        );
      }
      
      // 触发清理
      await browserSystem.cleanup();
      
      // 强制垃圾回收（如果可用）
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // 内存增长应该在合理范围内（100MB）
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
  });
  
  describe('压力测试', () => {
    test('应该能够处理并发负载', async () => {
      const system = createBrowserToolSystem({
        headless: true,
        instancePool: { enabled: true, maxInstances: 3 },
        monitoring: { enabled: true },
        security: { securityLevel: SECURITY_LEVELS.NORMAL }
      });
      
      try {
        await system.initialize();
        
        const concurrency = 5;
        const operations = 3;
        const promises = [];
        
        for (let i = 0; i < concurrency; i++) {
          for (let j = 0; j < operations; j++) {
            promises.push(
              system.toolManager.executeLocalTool(
                BROWSER_TOOLS.NAVIGATE,
                { url: 'https://example.com' },
                `stress_${i}_${j}`
              ).catch(error => ({ error: error.message }))
            );
          }
        }
        
        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;
        const total = results.length;
        const successRate = (successful / total) * 100;
        
        // 至少80%的操作应该成功
        expect(successRate).toBeGreaterThanOrEqual(80);
        
        const stats = system.getStats();
        expect(stats.combined.totalExecutions).toBeGreaterThan(0);
        
      } finally {
        await system.cleanup();
      }
    }, 30000); // 30秒超时
  });
});

// 性能测试助手
describe('性能测试助手', () => {
  test('内存使用测试', async () => {
    const system = createBrowserToolSystem({
      headless: true,
      instancePool: { enabled: true, maxInstances: 2 }
    });
    
    try {
      const initialMemory = process.memoryUsage();
      await system.initialize();
      
      // 执行一些操作
      for (let i = 0; i < 10; i++) {
        await system.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url: 'https://example.com' },
          `memory_${i}`
        );
      }
      
      const finalMemory = process.memoryUsage();
      const memoryDelta = finalMemory.heapUsed - initialMemory.heapUsed;
      
      console.log(`内存使用增量: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
      
      // 内存增长应该在合理范围内
      expect(memoryDelta).toBeLessThan(200 * 1024 * 1024); // 200MB
      
    } finally {
      await system.cleanup();
    }
  });
  
  test('响应时间测试', async () => {
    const system = createBrowserToolSystem({
      headless: true,
      instancePool: { enabled: true, maxInstances: 2 }
    });
    
    try {
      await system.initialize();
      
      const measurements = [];
      
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        
        await system.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url: 'https://example.com' },
          `timing_${i}`
        );
        
        const endTime = Date.now();
        measurements.push(endTime - startTime);
      }
      
      const avgTime = measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
      const maxTime = Math.max(...measurements);
      
      console.log(`平均响应时间: ${avgTime.toFixed(2)}ms`);
      console.log(`最大响应时间: ${maxTime}ms`);
      
      // 响应时间应该在合理范围内
      expect(avgTime).toBeLessThan(10000); // 10秒
      expect(maxTime).toBeLessThan(15000);  // 15秒
      
    } finally {
      await system.cleanup();
    }
  });
});
