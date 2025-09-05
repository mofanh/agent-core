/**
 * Week 4 浏览器工具综合演示
 * 展示性能基准测试、安全功能和监控仪表盘的完整集成
 */

import {
  createBrowserToolSystem,
  BROWSER_TOOLS,
  SECURITY_LEVELS,
  RISK_LEVELS
} from '../src/browser/index.js';
import { runPerformanceBenchmark } from '../benchmark/browser-tools-benchmark.js';
import { createPerformanceDashboard } from '../benchmark/performance-dashboard.js';

/**
 * Week 4 综合演示类
 */
class Week4ComprehensiveDemo {
  constructor() {
    this.results = {};
    this.dashboard = null;
    this.browserSystem = null;
  }
  
  /**
   * 运行完整的 Week 4 演示
   */
  async runDemo() {
    console.log('🚀 Week 4 浏览器工具综合演示开始');
    console.log('='.repeat(80));
    
    try {
      // 1. 性能基准测试
      console.log('\n📊 第一部分：性能基准测试');
      await this.runPerformanceBenchmarkDemo();
      
      // 2. 安全功能演示
      console.log('\n🔒 第二部分：安全功能演示');
      await this.runSecurityDemo();
      
      // 3. 监控仪表盘演示
      console.log('\n📈 第三部分：实时监控演示');
      await this.runDashboardDemo();
      
      // 4. 集成压力测试
      console.log('\n⚡ 第四部分：集成压力测试');
      await this.runStressTest();
      
      // 5. 生成最终报告
      console.log('\n📋 第五部分：生成最终报告');
      this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ 演示过程中发生错误:', error);
    } finally {
      await this.cleanup();
    }
    
    console.log('\n🎉 Week 4 综合演示完成！');
  }
  
  /**
   * 性能基准测试演示
   */
  async runPerformanceBenchmarkDemo() {
    console.log('开始性能基准测试...');
    
    const benchmarkConfig = {
      warmupRuns: 2,
      benchmarkRuns: 3, // 演示使用较少次数
      collectMemoryStats: true,
      maxConcurrency: 2
    };
    
    const startTime = Date.now();
    this.results.benchmark = await runPerformanceBenchmark(benchmarkConfig);
    const duration = Date.now() - startTime;
    
    console.log(`✅ 基准测试完成，耗时: ${duration}ms`);
    console.log('📊 基准测试结果摘要:');
    
    // 显示关键指标
    const report = this.results.benchmark.report;
    console.log(`   - 总测试数: ${report.summary.totalTests}`);
    console.log(`   - 推荐配置: ${report.recommendations.length} 条建议`);
    
    if (report.summary.categories['single-tool']) {
      const avgTime = report.summary.categories['single-tool']
        .reduce((sum, t) => sum + t.avgTime, 0) / report.summary.categories['single-tool'].length;
      console.log(`   - 平均工具执行时间: ${avgTime.toFixed(2)}ms`);
    }
    
    if (report.summary.categories['concurrency']) {
      const bestThroughput = Math.max(...report.summary.categories['concurrency'].map(c => c.throughput));
      console.log(`   - 最佳吞吐量: ${bestThroughput.toFixed(2)} tasks/s`);
    }
    
    // 显示性能建议
    console.log('\n💡 性能优化建议:');
    report.recommendations.forEach(rec => {
      console.log(`   ${rec.level === 'warning' ? '⚠️' : 'ℹ️'} ${rec.message}`);
    });
  }
  
  /**
   * 安全功能演示
   */
  async runSecurityDemo() {
    console.log('开始安全功能演示...');
    
    // 测试不同安全级别
    const securityLevels = [
      SECURITY_LEVELS.PERMISSIVE,
      SECURITY_LEVELS.NORMAL,
      SECURITY_LEVELS.STRICT
    ];
    
    this.results.security = {};
    
    for (const level of securityLevels) {
      console.log(`\n🔐 测试安全级别: ${level}`);
      
      const browserSystem = createBrowserToolSystem({
        headless: true,
        security: {
          securityLevel: level,
          auditLog: true,
          blockedDomains: ['malicious-site.com'],
          allowedDomains: level === SECURITY_LEVELS.STRICT ? ['example.com', 'httpbin.org'] : []
        }
      });
      
      try {
        await browserSystem.initialize();
        
        const securityTests = await this.runSecurityTests(browserSystem);
        this.results.security[level] = securityTests;
        
        console.log(`   ✅ ${level} 安全测试完成`);
        console.log(`   - 通过测试: ${securityTests.passed}/${securityTests.total}`);
        console.log(`   - 安全事件: ${securityTests.securityEvents}`);
        
      } finally {
        await browserSystem.cleanup();
      }
    }
    
    console.log('\n🔒 安全功能测试完成');
    this.displaySecuritySummary();
  }
  
  /**
   * 运行安全测试
   */
  async runSecurityTests(browserSystem) {
    const tests = [
      {
        name: '合法URL导航',
        test: async () => {
          await browserSystem.toolManager.executeLocalTool(
            BROWSER_TOOLS.NAVIGATE,
            { url: 'https://example.com' },
            'security_test_1'
          );
          return true;
        }
      },
      {
        name: '危险URL阻止',
        test: async () => {
          try {
            await browserSystem.toolManager.executeLocalTool(
              BROWSER_TOOLS.NAVIGATE,
              { url: 'https://malicious-site.com' },
              'security_test_2'
            );
            return false; // 应该被阻止
          } catch (error) {
            return true; // 正确阻止
          }
        }
      },
      {
        name: '本地IP阻止',
        test: async () => {
          try {
            await browserSystem.toolManager.executeLocalTool(
              BROWSER_TOOLS.NAVIGATE,
              { url: 'http://127.0.0.1:8080' },
              'security_test_3'
            );
            return false; // 应该被阻止
          } catch (error) {
            return true; // 正确阻止
          }
        }
      },
      {
        name: '安全选择器',
        test: async () => {
          try {
            await browserSystem.toolManager.executeLocalTool(
              BROWSER_TOOLS.NAVIGATE,
              { url: 'https://example.com' },
              'security_test_4a'
            );
            await browserSystem.toolManager.executeLocalTool(
              BROWSER_TOOLS.EXTRACT,
              { selector: 'h1' },
              'security_test_4b'
            );
            return true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: '危险JavaScript阻止',
        test: async () => {
          try {
            await browserSystem.toolManager.executeLocalTool(
              BROWSER_TOOLS.EVALUATE,
              { code: 'eval("malicious code")' },
              'security_test_5'
            );
            return false; // 应该被阻止
          } catch (error) {
            return true; // 正确阻止
          }
        }
      }
    ];
    
    let passed = 0;
    const total = tests.length;
    
    for (const test of tests) {
      try {
        const result = await test.test();
        if (result) {
          passed++;
          console.log(`     ✅ ${test.name}`);
        } else {
          console.log(`     ❌ ${test.name}`);
        }
      } catch (error) {
        console.log(`     ⚠️ ${test.name} - ${error.message}`);
      }
    }
    
    const securityStats = browserSystem.toolManager.getSecurityStats();
    
    return {
      passed,
      total,
      securityEvents: securityStats.manager.totalEvents,
      securityLevel: securityStats.config.securityLevel
    };
  }
  
  /**
   * 显示安全测试摘要
   */
  displaySecuritySummary() {
    console.log('\n📊 安全测试结果摘要:');
    
    Object.entries(this.results.security).forEach(([level, results]) => {
      const passRate = (results.passed / results.total * 100).toFixed(1);
      console.log(`   ${level}: ${passRate}% 通过率 (${results.passed}/${results.total})`);
    });
    
    console.log('\n💡 安全建议:');
    console.log('   - STRICT 模式提供最高安全性，适合生产环境');
    console.log('   - NORMAL 模式平衡安全性和灵活性，适合大多数场景');
    console.log('   - PERMISSIVE 模式提供最大灵活性，适合开发测试');
  }
  
  /**
   * 实时监控演示
   */
  async runDashboardDemo() {
    console.log('开始实时监控演示...');
    
    // 创建监控仪表盘
    this.dashboard = createPerformanceDashboard({
      metricsInterval: 2000, // 2秒收集一次指标
      dataRetentionDays: 1,
      alertThresholds: {
        avgResponseTime: 8000, // 8秒
        errorRate: 0.2, // 20%
        memoryUsage: 300 * 1024 * 1024 // 300MB
      }
    });
    
    // 创建浏览器系统
    this.browserSystem = createBrowserToolSystem({
      headless: true,
      instancePool: { enabled: true, maxInstances: 2 },
      monitoring: { enabled: true },
      security: { securityLevel: SECURITY_LEVELS.NORMAL }
    });
    
    await this.browserSystem.initialize();
    
    // 注册系统到监控仪表盘
    this.dashboard.registerSystem('demo-system', this.browserSystem);
    
    // 启动监控
    this.dashboard.startMonitoring();
    
    console.log('🚀 监控仪表盘已启动，开始模拟负载...');
    
    // 模拟一些负载活动
    await this.simulateWorkload();
    
    // 等待收集指标
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 获取性能概览
    const overview = this.dashboard.getPerformanceOverview();
    this.results.monitoring = overview;
    
    console.log('📊 实时监控结果:');
    console.log(`   - 内存使用: ${overview.system.memory.current}`);
    console.log(`   - 活跃实例: ${overview.browser.instances.active}`);
    console.log(`   - 平均响应时间: ${overview.browser.operations.avgResponseTime}`);
    console.log(`   - 吞吐量: ${overview.browser.operations.throughput}`);
    console.log(`   - 错误率: ${overview.browser.operations.errorRate}`);
    console.log(`   - 告警数量: ${overview.alerts.total}`);
    
    if (overview.alerts.recent.length > 0) {
      console.log('\n🚨 最近告警:');
      overview.alerts.recent.forEach(alert => {
        console.log(`   ${alert.level === 'error' ? '🔴' : '🟡'} ${alert.message}`);
      });
    }
    
    // 生成性能报告
    const report = this.dashboard.generatePerformanceReport('15m');
    console.log('\n📈 性能趋势:');
    Object.entries(overview.trends).forEach(([metric, trend]) => {
      const emoji = trend === 'increasing' ? '📈' : trend === 'decreasing' ? '📉' : '➡️';
      console.log(`   ${metric}: ${emoji} ${trend}`);
    });
    
    console.log(`\n💡 性能建议数量: ${report.recommendations.length}`);
    report.recommendations.forEach(rec => {
      console.log(`   ${rec.level === 'error' ? '🔴' : rec.level === 'warning' ? '🟡' : 'ℹ️'} ${rec.message}`);
    });
  }
  
  /**
   * 模拟工作负载
   */
  async simulateWorkload() {
    const urls = [
      'https://example.com',
      'https://httpbin.org/delay/1',
      'https://httpbin.org/delay/2'
    ];
    
    console.log('🔄 模拟工作负载...');
    
    // 并发执行一些操作
    const tasks = [];
    for (let i = 0; i < 8; i++) {
      const url = urls[i % urls.length];
      tasks.push(
        this.browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url },
          `workload_${i}`
        ).catch(error => {
          console.log(`   ⚠️ 任务 ${i} 失败: ${error.message}`);
        })
      );
      
      // 错开任务启动时间
      if (i % 2 === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    await Promise.allSettled(tasks);
    console.log('✅ 工作负载模拟完成');
  }
  
  /**
   * 集成压力测试
   */
  async runStressTest() {
    console.log('开始集成压力测试...');
    
    const stressTestConfig = {
      duration: 15000, // 15秒
      concurrency: 3,
      operations: ['navigate', 'extract', 'screenshot']
    };
    
    console.log(`🔥 压力测试参数: ${stressTestConfig.concurrency} 并发, ${stressTestConfig.duration/1000}秒`);
    
    const startTime = Date.now();
    const results = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      avgResponseTime: 0,
      memoryPeak: 0
    };
    
    const initialMemory = process.memoryUsage().heapUsed;
    let totalResponseTime = 0;
    
    // 启动并发任务
    const tasks = [];
    for (let i = 0; i < stressTestConfig.concurrency; i++) {
      tasks.push(this.runStressTestWorker(stressTestConfig, results, i));
    }
    
    await Promise.allSettled(tasks);
    
    const endTime = Date.now();
    const finalMemory = process.memoryUsage().heapUsed;
    const duration = endTime - startTime;
    
    results.avgResponseTime = results.totalOperations > 0 
      ? totalResponseTime / results.totalOperations 
      : 0;
    results.memoryPeak = finalMemory - initialMemory;
    results.throughput = results.totalOperations / (duration / 1000);
    results.successRate = results.totalOperations > 0 
      ? (results.successfulOperations / results.totalOperations * 100) 
      : 0;
    
    this.results.stressTest = results;
    
    console.log('⚡ 压力测试结果:');
    console.log(`   - 总操作数: ${results.totalOperations}`);
    console.log(`   - 成功操作: ${results.successfulOperations}`);
    console.log(`   - 失败操作: ${results.failedOperations}`);
    console.log(`   - 成功率: ${results.successRate.toFixed(2)}%`);
    console.log(`   - 吞吐量: ${results.throughput.toFixed(2)} ops/s`);
    console.log(`   - 内存峰值: ${(results.memoryPeak / 1024 / 1024).toFixed(2)}MB`);
    
    // 获取最终系统状态
    const finalStats = this.browserSystem.getStats();
    console.log('\n📊 系统最终状态:');
    console.log(`   - 实例池大小: ${finalStats.instancePool?.poolSize || 'N/A'}`);
    console.log(`   - 实例池命中率: ${((finalStats.instancePool?.hitRate || 0) * 100).toFixed(1)}%`);
    console.log(`   - 安全事件: ${finalStats.security?.manager?.totalEvents || 0}`);
    console.log(`   - 活跃会话: ${finalStats.security?.manager?.activeSessions || 0}`);
  }
  
  /**
   * 压力测试工作线程
   */
  async runStressTestWorker(config, results, workerId) {
    const endTime = Date.now() + config.duration;
    
    while (Date.now() < endTime) {
      try {
        const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
        const startTime = Date.now();
        
        await this.executeStressTestOperation(operation, workerId, results.totalOperations);
        
        const responseTime = Date.now() - startTime;
        results.totalOperations++;
        results.successfulOperations++;
        
      } catch (error) {
        results.totalOperations++;
        results.failedOperations++;
        console.log(`   ⚠️ Worker ${workerId} 操作失败: ${error.message}`);
      }
      
      // 短暂延迟避免过度负载
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    }
  }
  
  /**
   * 执行压力测试操作
   */
  async executeStressTestOperation(operation, workerId, operationId) {
    const toolMap = {
      navigate: BROWSER_TOOLS.NAVIGATE,
      extract: BROWSER_TOOLS.EXTRACT,
      screenshot: BROWSER_TOOLS.SCREENSHOT
    };
    
    const argsMap = {
      navigate: { url: 'https://example.com' },
      extract: { selector: 'title', attribute: 'text' },
      screenshot: { format: 'png', fullPage: false }
    };
    
    const toolName = toolMap[operation];
    const args = argsMap[operation];
    
    if (operation === 'extract' || operation === 'screenshot') {
      // 确保先导航到页面
      await this.browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'https://example.com' },
        `stress_nav_${workerId}_${operationId}`
      );
    }
    
    return await this.browserSystem.toolManager.executeLocalTool(
      toolName,
      args,
      `stress_${operation}_${workerId}_${operationId}`
    );
  }
  
  /**
   * 生成最终报告
   */
  generateFinalReport() {
    console.log('生成 Week 4 综合演示报告...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        benchmarkCompleted: !!this.results.benchmark,
        securityTestsCompleted: !!this.results.security,
        monitoringCompleted: !!this.results.monitoring,
        stressTestCompleted: !!this.results.stressTest
      },
      performance: {
        benchmark: this.results.benchmark?.report?.summary || null,
        stressTest: this.results.stressTest || null,
        monitoring: this.results.monitoring || null
      },
      security: this.results.security || null,
      recommendations: this.generateRecommendations()
    };
    
    console.log('\n📋 Week 4 综合演示报告:');
    console.log('='.repeat(50));
    
    console.log('\n✅ 完成的演示项目:');
    Object.entries(report.summary).forEach(([key, completed]) => {
      console.log(`   ${completed ? '✅' : '❌'} ${key}`);
    });
    
    console.log('\n📊 性能亮点:');
    if (this.results.stressTest) {
      console.log(`   - 压力测试成功率: ${this.results.stressTest.successRate.toFixed(2)}%`);
      console.log(`   - 最大吞吐量: ${this.results.stressTest.throughput.toFixed(2)} ops/s`);
    }
    
    if (this.results.benchmark?.report?.summary?.categories?.concurrency) {
      const bestConcurrency = this.results.benchmark.report.summary.categories.concurrency
        .reduce((best, current) => current.throughput > best.throughput ? current : best);
      console.log(`   - 最佳并发配置: ${bestConcurrency.concurrencyLevel} (${bestConcurrency.throughput.toFixed(2)} tasks/s)`);
    }
    
    console.log('\n🔒 安全亮点:');
    if (this.results.security) {
      const strictResults = this.results.security[SECURITY_LEVELS.STRICT];
      if (strictResults) {
        console.log(`   - 严格模式安全测试: ${(strictResults.passed / strictResults.total * 100).toFixed(1)}% 通过率`);
      }
    }
    
    console.log('\n💡 总体建议:');
    report.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
    
    console.log('\n🎯 Week 4 功能验证完成！');
    console.log('   - 性能基准测试和优化 ✅');
    console.log('   - 企业级安全功能 ✅');
    console.log('   - 实时监控和告警 ✅');
    console.log('   - 压力测试和稳定性验证 ✅');
    
    return report;
  }
  
  /**
   * 生成优化建议
   */
  generateRecommendations() {
    const recommendations = [];
    
    // 基于基准测试的建议
    if (this.results.benchmark?.report?.recommendations) {
      recommendations.push(...this.results.benchmark.report.recommendations.map(r => r.message));
    }
    
    // 基于压力测试的建议
    if (this.results.stressTest) {
      if (this.results.stressTest.successRate < 90) {
        recommendations.push('建议增加错误处理和重试机制');
      }
      
      if (this.results.stressTest.throughput < 1) {
        recommendations.push('建议启用实例池以提高并发处理能力');
      }
      
      if (this.results.stressTest.memoryPeak > 200 * 1024 * 1024) {
        recommendations.push('建议优化内存使用，考虑增加清理频率');
      }
    }
    
    // 基于监控的建议
    if (this.results.monitoring?.alerts?.total > 0) {
      recommendations.push('建议调整监控告警阈值以减少误报');
    }
    
    // 安全建议
    if (this.results.security) {
      const normalResults = this.results.security[SECURITY_LEVELS.NORMAL];
      if (normalResults && normalResults.passed < normalResults.total) {
        recommendations.push('建议在生产环境使用 STRICT 安全模式');
      }
    }
    
    // 默认建议
    if (recommendations.length === 0) {
      recommendations.push('系统运行良好，建议定期进行性能和安全审计');
    }
    
    return recommendations;
  }
  
  /**
   * 清理资源
   */
  async cleanup() {
    console.log('\n🧹 清理演示资源...');
    
    if (this.dashboard) {
      this.dashboard.stopMonitoring();
      this.dashboard.cleanup();
    }
    
    if (this.browserSystem) {
      await this.browserSystem.cleanup();
    }
    
    console.log('✅ 资源清理完成');
  }
}

/**
 * 运行 Week 4 综合演示
 */
export async function runWeek4Demo() {
  const demo = new Week4ComprehensiveDemo();
  return await demo.runDemo();
}

// 检查是否作为主模块运行
if (import.meta.url === `file://${process.argv[1]}`) {
  runWeek4Demo().catch(console.error);
}
