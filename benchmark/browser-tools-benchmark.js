/**
 * 浏览器工具性能基准测试套件
 * 用于性能调优、回归测试和生产环境基准对比
 */

import { performance } from 'perf_hooks';
import { 
  createBrowserToolSystem,
  BROWSER_TOOLS 
} from '../src/browser/index.js';

/**
 * 性能基准测试类
 */
export class BrowserToolBenchmark {
  constructor(config = {}) {
    this.config = {
      warmupRuns: config.warmupRuns || 3,
      benchmarkRuns: config.benchmarkRuns || 10,
      maxConcurrency: config.maxConcurrency || 3,
      timeout: config.timeout || 30000,
      collectMemoryStats: config.collectMemoryStats !== false,
      ...config
    };
    
    this.results = [];
    this.systemStats = [];
  }
  
  /**
   * 运行完整的基准测试套件
   */
  async runBenchmarkSuite() {
    console.log('🚀 开始浏览器工具性能基准测试');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    
    // 1. 单工具性能测试
    console.log('\n📊 1. 单工具性能基准测试');
    await this.runSingleToolBenchmarks();
    
    // 2. 工具链性能测试
    console.log('\n🔗 2. 工具链性能基准测试');
    await this.runToolChainBenchmarks();
    
    // 3. 并发性能测试
    console.log('\n⚡ 3. 并发执行性能测试');
    await this.runConcurrencyBenchmarks();
    
    // 4. 实例池性能测试
    console.log('\n🏊 4. 实例池性能测试');
    await this.runInstancePoolBenchmarks();
    
    // 5. 内存性能测试
    console.log('\n💾 5. 内存使用基准测试');
    await this.runMemoryBenchmarks();
    
    const totalTime = Date.now() - startTime;
    
    // 6. 生成性能报告
    console.log('\n📈 6. 生成性能基准报告');
    const report = this.generateBenchmarkReport();
    
    console.log(`\n🎯 基准测试完成！总耗时: ${totalTime}ms`);
    
    return {
      totalTime,
      results: this.results,
      systemStats: this.systemStats,
      report
    };
  }
  
  /**
   * 单工具性能基准测试
   */
  async runSingleToolBenchmarks() {
    const browserSystem = createBrowserToolSystem({
      headless: true,
      instancePool: { enabled: false }, // 单实例模式基准
      monitoring: { enabled: true }
    });
    
    try {
      await browserSystem.initialize();
      
      // 测试每个核心工具
      const tools = [
        {
          name: BROWSER_TOOLS.NAVIGATE,
          args: { url: 'https://example.com' },
          category: 'navigation'
        },
        {
          name: BROWSER_TOOLS.EXTRACT,
          args: { selector: 'title', attribute: 'text' },
          category: 'extraction',
          dependsOn: BROWSER_TOOLS.NAVIGATE
        },
        {
          name: BROWSER_TOOLS.CLICK,
          args: { selector: 'body' },
          category: 'interaction',
          dependsOn: BROWSER_TOOLS.NAVIGATE
        },
        {
          name: BROWSER_TOOLS.TYPE,
          args: { selector: 'body', text: 'test' },
          category: 'interaction',
          dependsOn: BROWSER_TOOLS.NAVIGATE
        },
        {
          name: BROWSER_TOOLS.SCREENSHOT,
          args: { format: 'png', fullPage: false },
          category: 'capture',
          dependsOn: BROWSER_TOOLS.NAVIGATE
        },
        {
          name: BROWSER_TOOLS.EVALUATE,
          args: { code: 'document.title' },
          category: 'evaluation',
          dependsOn: BROWSER_TOOLS.NAVIGATE
        }
      ];
      
      // 预导航到页面
      await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'https://example.com' },
        'setup'
      );
      
      for (const tool of tools) {
        if (tool.dependsOn) {
          // 跳过需要预导航的工具（已经预导航）
          console.log(`⏭️  跳过 ${tool.name} (依赖预导航)`);
          continue;
        }
        
        console.log(`🔧 测试 ${tool.name}...`);
        
        // 预热运行
        await this.warmupTool(browserSystem, tool);
        
        // 基准测试运行
        const benchmark = await this.benchmarkTool(browserSystem, tool);
        
        this.results.push({
          type: 'single-tool',
          tool: tool.name,
          category: tool.category,
          ...benchmark
        });
        
        console.log(`   ✅ 平均: ${benchmark.avgTime.toFixed(2)}ms, 最快: ${benchmark.minTime}ms, 最慢: ${benchmark.maxTime}ms`);
      }
      
      // 测试依赖工具（在已导航页面上）
      for (const tool of tools) {
        if (!tool.dependsOn) continue;
        
        console.log(`🔧 测试 ${tool.name} (页面已加载)...`);
        
        // 预热运行
        await this.warmupTool(browserSystem, tool);
        
        // 基准测试运行
        const benchmark = await this.benchmarkTool(browserSystem, tool);
        
        this.results.push({
          type: 'single-tool-loaded',
          tool: tool.name,
          category: tool.category,
          ...benchmark
        });
        
        console.log(`   ✅ 平均: ${benchmark.avgTime.toFixed(2)}ms, 最快: ${benchmark.minTime}ms, 最慢: ${benchmark.maxTime}ms`);
      }
      
    } finally {
      await browserSystem.cleanup();
    }
  }
  
  /**
   * 工具链性能基准测试
   */
  async runToolChainBenchmarks() {
    const browserSystem = createBrowserToolSystem({
      headless: true,
      instancePool: { enabled: true, maxInstances: 2 },
      monitoring: { enabled: true }
    });
    
    try {
      await browserSystem.initialize();
      
      const chainTests = [
        {
          name: 'simple-chain',
          description: '简单页面分析链',
          template: 'page-analysis',
          variables: {
            url: 'https://example.com',
            contentSelector: 'h1, p'
          }
        },
        {
          name: 'complex-chain',
          description: '复杂工具链',
          steps: [
            {
              id: 'nav1',
              tool: BROWSER_TOOLS.NAVIGATE,
              params: { url: 'https://example.com' }
            },
            {
              id: 'extract1',
              tool: BROWSER_TOOLS.EXTRACT,
              params: { selector: 'title', attribute: 'text' },
              dependsOn: ['nav1']
            },
            {
              id: 'screenshot1',
              tool: BROWSER_TOOLS.SCREENSHOT,
              params: { format: 'png' },
              dependsOn: ['nav1']
            },
            {
              id: 'eval1',
              tool: BROWSER_TOOLS.EVALUATE,
              params: { code: 'document.querySelectorAll("*").length' },
              dependsOn: ['extract1']
            }
          ]
        }
      ];
      
      for (const chainTest of chainTests) {
        console.log(`🔗 测试工具链: ${chainTest.description}`);
        
        // 预热运行
        for (let i = 0; i < this.config.warmupRuns; i++) {
          try {
            await browserSystem.toolChain.executeChain(chainTest);
          } catch (error) {
            console.warn(`预热运行 ${i + 1} 失败:`, error.message);
          }
        }
        
        // 基准测试运行
        const times = [];
        const errors = [];
        
        for (let i = 0; i < this.config.benchmarkRuns; i++) {
          const startTime = performance.now();
          const startMemory = this.config.collectMemoryStats ? process.memoryUsage().heapUsed : 0;
          
          try {
            const result = await browserSystem.toolChain.executeChain(chainTest);
            const endTime = performance.now();
            const endMemory = this.config.collectMemoryStats ? process.memoryUsage().heapUsed : 0;
            
            times.push({
              duration: endTime - startTime,
              stepsExecuted: result.stepsExecuted,
              stepsFailed: result.stepsFailed,
              memoryDelta: endMemory - startMemory
            });
          } catch (error) {
            errors.push(error.message);
          }
        }
        
        if (times.length > 0) {
          const avgTime = times.reduce((sum, t) => sum + t.duration, 0) / times.length;
          const minTime = Math.min(...times.map(t => t.duration));
          const maxTime = Math.max(...times.map(t => t.duration));
          const avgSteps = times.reduce((sum, t) => sum + t.stepsExecuted, 0) / times.length;
          const avgMemory = this.config.collectMemoryStats 
            ? times.reduce((sum, t) => sum + t.memoryDelta, 0) / times.length 
            : 0;
          
          this.results.push({
            type: 'tool-chain',
            name: chainTest.name,
            description: chainTest.description,
            runs: times.length,
            errors: errors.length,
            avgTime: avgTime,
            minTime: minTime,
            maxTime: maxTime,
            avgSteps: avgSteps,
            avgMemoryDelta: avgMemory,
            successRate: (times.length / this.config.benchmarkRuns) * 100
          });
          
          console.log(`   ✅ 平均: ${avgTime.toFixed(2)}ms, 步骤: ${avgSteps.toFixed(1)}, 成功率: ${((times.length / this.config.benchmarkRuns) * 100).toFixed(1)}%`);
        }
      }
      
    } finally {
      await browserSystem.cleanup();
    }
  }
  
  /**
   * 并发性能基准测试
   */
  async runConcurrencyBenchmarks() {
    const concurrencyLevels = [1, 2, 3];
    
    for (const concurrency of concurrencyLevels) {
      console.log(`⚡ 测试并发级别: ${concurrency}`);
      
      const browserSystem = createBrowserToolSystem({
        headless: true,
        instancePool: { 
          enabled: true, 
          maxInstances: concurrency,
          warmupInstances: concurrency 
        },
        monitoring: { enabled: true }
      });
      
      try {
        await browserSystem.initialize();
        
        const startTime = performance.now();
        const startMemory = this.config.collectMemoryStats ? process.memoryUsage().heapUsed : 0;
        
        // 创建并发任务
        const tasks = [];
        for (let i = 0; i < concurrency * 2; i++) {
          const task = browserSystem.toolManager.executeLocalTool(
            BROWSER_TOOLS.NAVIGATE,
            { url: `https://httpbin.org/delay/${Math.floor(i/2) + 1}` },
            `concurrent_${i}`
          );
          tasks.push(task);
        }
        
        // 执行并发任务
        const results = await Promise.allSettled(tasks);
        const endTime = performance.now();
        const endMemory = this.config.collectMemoryStats ? process.memoryUsage().heapUsed : 0;
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        this.results.push({
          type: 'concurrency',
          concurrencyLevel: concurrency,
          totalTasks: tasks.length,
          successful: successful,
          failed: failed,
          totalTime: endTime - startTime,
          avgTimePerTask: (endTime - startTime) / tasks.length,
          successRate: (successful / tasks.length) * 100,
          memoryDelta: endMemory - startMemory,
          throughput: tasks.length / ((endTime - startTime) / 1000) // tasks per second
        });
        
        console.log(`   ✅ 成功: ${successful}/${tasks.length}, 总时间: ${(endTime - startTime).toFixed(2)}ms, 吞吐量: ${(tasks.length / ((endTime - startTime) / 1000)).toFixed(2)} tasks/s`);
        
      } finally {
        await browserSystem.cleanup();
      }
    }
  }
  
  /**
   * 实例池性能基准测试
   */
  async runInstancePoolBenchmarks() {
    const poolConfigs = [
      { enabled: false, description: '单实例模式' },
      { enabled: true, maxInstances: 1, description: '实例池(1实例)' },
      { enabled: true, maxInstances: 2, description: '实例池(2实例)' },
      { enabled: true, maxInstances: 3, description: '实例池(3实例)' }
    ];
    
    for (const poolConfig of poolConfigs) {
      console.log(`🏊 测试: ${poolConfig.description}`);
      
      const browserSystem = createBrowserToolSystem({
        headless: true,
        instancePool: poolConfig,
        monitoring: { enabled: true }
      });
      
      try {
        await browserSystem.initialize();
        
        // 执行一系列导航任务来测试实例复用
        const startTime = performance.now();
        const tasks = 5;
        
        for (let i = 0; i < tasks; i++) {
          await browserSystem.toolManager.executeLocalTool(
            BROWSER_TOOLS.NAVIGATE,
            { url: 'https://example.com' },
            `pool_test_${i}`
          );
        }
        
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        
        // 获取统计信息
        const stats = browserSystem.getStats();
        const poolStats = stats.toolManager.instancePool;
        
        this.results.push({
          type: 'instance-pool',
          config: poolConfig.description,
          tasks: tasks,
          totalTime: totalTime,
          avgTimePerTask: totalTime / tasks,
          poolStats: poolStats ? {
            poolSize: poolStats.poolSize,
            hitRate: poolStats.hitRate,
            totalReuseCount: poolStats.totalReuseCount,
            created: poolStats.created,
            destroyed: poolStats.destroyed
          } : null
        });
        
        if (poolStats) {
          console.log(`   ✅ 平均: ${(totalTime / tasks).toFixed(2)}ms/task, 命中率: ${(poolStats.hitRate * 100).toFixed(1)}%, 重用: ${poolStats.totalReuseCount}次`);
        } else {
          console.log(`   ✅ 平均: ${(totalTime / tasks).toFixed(2)}ms/task (单实例模式)`);
        }
        
      } finally {
        await browserSystem.cleanup();
      }
    }
  }
  
  /**
   * 内存使用基准测试
   */
  async runMemoryBenchmarks() {
    if (!this.config.collectMemoryStats) {
      console.log('💾 跳过内存测试 (已禁用)');
      return;
    }
    
    console.log('💾 开始内存使用基准测试...');
    
    const browserSystem = createBrowserToolSystem({
      headless: true,
      instancePool: { enabled: true, maxInstances: 2 },
      monitoring: { enabled: true }
    });
    
    try {
      // 记录初始内存
      const initialMemory = process.memoryUsage();
      
      await browserSystem.initialize();
      const postInitMemory = process.memoryUsage();
      
      // 执行内存密集型操作
      const memorySnapshots = [
        { stage: 'initial', memory: initialMemory },
        { stage: 'post-init', memory: postInitMemory }
      ];
      
      // 执行多个导航操作
      for (let i = 0; i < 10; i++) {
        await browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url: 'https://example.com' },
          `memory_test_${i}`
        );
        
        if (i % 3 === 0) {
          memorySnapshots.push({
            stage: `after-nav-${i}`,
            memory: process.memoryUsage()
          });
        }
      }
      
      // 执行工具链操作
      await browserSystem.toolChain.executeChain({
        template: 'page-analysis',
        variables: {
          url: 'https://example.com',
          contentSelector: 'h1, p'
        }
      });
      
      const postChainMemory = process.memoryUsage();
      memorySnapshots.push({ stage: 'post-chain', memory: postChainMemory });
      
      // 强制垃圾回收（如果可用）
      if (global.gc) {
        global.gc();
        const postGCMemory = process.memoryUsage();
        memorySnapshots.push({ stage: 'post-gc', memory: postGCMemory });
      }
      
      this.results.push({
        type: 'memory-usage',
        snapshots: memorySnapshots,
        peakHeapUsed: Math.max(...memorySnapshots.map(s => s.memory.heapUsed)),
        totalHeapDelta: postChainMemory.heapUsed - initialMemory.heapUsed,
        initializationCost: postInitMemory.heapUsed - initialMemory.heapUsed
      });
      
      console.log(`   ✅ 峰值堆内存: ${(Math.max(...memorySnapshots.map(s => s.memory.heapUsed)) / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   ✅ 初始化成本: ${((postInitMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
      
    } finally {
      await browserSystem.cleanup();
    }
  }
  
  /**
   * 预热工具
   */
  async warmupTool(browserSystem, tool) {
    for (let i = 0; i < this.config.warmupRuns; i++) {
      try {
        await browserSystem.toolManager.executeLocalTool(
          tool.name,
          tool.args,
          `warmup_${i}`
        );
      } catch (error) {
        // 忽略预热错误
      }
    }
  }
  
  /**
   * 基准测试工具
   */
  async benchmarkTool(browserSystem, tool) {
    const times = [];
    const errors = [];
    
    for (let i = 0; i < this.config.benchmarkRuns; i++) {
      const startTime = performance.now();
      
      try {
        await browserSystem.toolManager.executeLocalTool(
          tool.name,
          tool.args,
          `benchmark_${i}`
        );
        const endTime = performance.now();
        times.push(endTime - startTime);
      } catch (error) {
        errors.push(error.message);
      }
    }
    
    if (times.length === 0) {
      throw new Error(`工具 ${tool.name} 所有测试运行都失败`);
    }
    
    return {
      runs: times.length,
      errors: errors.length,
      avgTime: times.reduce((sum, t) => sum + t, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      stdDev: this.calculateStandardDeviation(times),
      successRate: (times.length / this.config.benchmarkRuns) * 100
    };
  }
  
  /**
   * 计算标准差
   */
  calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }
  
  /**
   * 生成性能基准报告
   */
  generateBenchmarkReport() {
    const report = {
      timestamp: new Date().toISOString(),
      config: this.config,
      summary: {
        totalTests: this.results.length,
        categories: {}
      },
      results: this.results,
      recommendations: []
    };
    
    // 按类型分组统计
    const byType = {};
    this.results.forEach(result => {
      if (!byType[result.type]) {
        byType[result.type] = [];
      }
      byType[result.type].push(result);
    });
    
    report.summary.categories = byType;
    
    // 生成性能建议
    if (byType['single-tool']) {
      const slowTools = byType['single-tool'].filter(t => t.avgTime > 5000);
      if (slowTools.length > 0) {
        report.recommendations.push({
          type: 'performance',
          level: 'warning',
          message: `发现 ${slowTools.length} 个慢工具 (>5s): ${slowTools.map(t => t.tool).join(', ')}`
        });
      }
    }
    
    if (byType['concurrency']) {
      const best = byType['concurrency'].reduce((best, current) => 
        current.throughput > best.throughput ? current : best
      );
      report.recommendations.push({
        type: 'optimization',
        level: 'info',
        message: `最佳并发级别: ${best.concurrencyLevel} (吞吐量: ${best.throughput.toFixed(2)} tasks/s)`
      });
    }
    
    if (byType['instance-pool']) {
      const poolResults = byType['instance-pool'].filter(r => r.poolStats);
      if (poolResults.length > 0) {
        const bestPool = poolResults.reduce((best, current) => 
          current.avgTimePerTask < best.avgTimePerTask ? current : best
        );
        report.recommendations.push({
          type: 'optimization',
          level: 'info',
          message: `推荐实例池配置: ${bestPool.config} (平均: ${bestPool.avgTimePerTask.toFixed(2)}ms/task)`
        });
      }
    }
    
    return report;
  }
}

/**
 * 运行基准测试的主函数
 */
export async function runPerformanceBenchmark(config = {}) {
  const benchmark = new BrowserToolBenchmark(config);
  return await benchmark.runBenchmarkSuite();
}

// 检查是否作为主模块运行
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceBenchmark({
    warmupRuns: 2,
    benchmarkRuns: 5,
    collectMemoryStats: true
  }).then(results => {
    console.log('\n📊 基准测试报告已生成');
    console.log('建议:', results.report.recommendations);
  }).catch(console.error);
}
