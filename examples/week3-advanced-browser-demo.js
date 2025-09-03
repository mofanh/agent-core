/**
 * 浏览器工具 Week 3 高级功能演示
 * 展示实例池、性能监控、工具链批量执行等新功能
 */

import { 
  createBrowserToolSystem,
  BrowserToolChain,
  BROWSER_TOOLS 
} from '../src/browser/index.js';

/**
 * Week 3 高级功能演示
 */
async function runAdvancedBrowserToolsDemo() {
  console.log('🚀 Week 3 浏览器工具高级功能演示开始');
  console.log('=' .repeat(60));
  
  // 1. 创建完整的浏览器工具系统
  console.log('\n📦 1. 创建浏览器工具系统（带实例池和监控）');
  const browserSystem = createBrowserToolSystem({
    // 实例池配置
    instancePool: {
      enabled: true,
      maxInstances: 2,
      maxIdleTime: 30000, // 30秒
      warmupInstances: 1
    },
    
    // 监控配置
    monitoring: {
      enabled: true,
      alertThresholds: {
        errorRate: 0.2, // 20%错误率
        avgExecutionTime: 10000, // 10秒
        timeoutRate: 0.1 // 10%超时率
      }
    },
    
    // 工具链配置
    toolChain: {
      maxConcurrency: 2,
      continueOnError: true,
      retryAttempts: 1
    },
    
    // 基础配置
    headless: true,
    timeout: 15000
  });
  
  try {
    // 初始化系统
    await browserSystem.initialize();
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 监听性能警报
    browserSystem.monitor.on('alert', (alert) => {
      console.log(`⚠️  性能警报 [${alert.level}]: ${alert.message}`);
    });
    
    // 监听实例池事件
    if (browserSystem.instancePool) {
      browserSystem.instancePool.on('instanceCreated', (data) => {
        console.log(`🔧 创建浏览器实例: ${data.instanceId}`);
      });
      
      browserSystem.instancePool.on('instanceDestroyed', (data) => {
        console.log(`🗑️  销毁浏览器实例: ${data.instanceId}, 重用${data.reuseCount}次`);
      });
    }
    
    // 2. 演示单工具执行（测试实例池）
    console.log('\n🔧 2. 单工具执行测试（实例池复用）');
    
    for (let i = 0; i < 3; i++) {
      console.log(`\n执行第 ${i + 1} 次导航...`);
      const result = await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'https://example.com' },
        `test_${i}`
      );
      console.log(`✅ 导航完成: ${result.data.title || 'Unknown Title'}`);
    }
    
    // 3. 演示预定义工具链
    console.log('\n📋 3. 预定义工具链演示 - 页面分析');
    
    const pageAnalysisResult = await browserSystem.toolChain.executeChain({
      template: 'page-analysis',
      variables: {
        url: 'https://example.com',
        waitSelector: 'body',
        contentSelector: 'h1, p'
      }
    });
    
    console.log('📊 页面分析结果:');
    console.log(`- 总步骤: ${pageAnalysisResult.stepsExecuted}`);
    console.log(`- 成功率: ${pageAnalysisResult.summary.successRate}`);
    console.log(`- 耗时: ${pageAnalysisResult.duration}ms`);
    
    // 显示部分结果
    if (pageAnalysisResult.results['extract-title']) {
      const title = pageAnalysisResult.results['extract-title'];
      console.log(`- 页面标题: ${title.data || 'N/A'}`);
    }
    
    // 4. 演示自定义工具链
    console.log('\n🔗 4. 自定义工具链演示 - 搜索引擎测试');
    
    const customChainResult = await browserSystem.toolChain.executeChain({
      steps: [
        {
          id: 'navigate-search',
          tool: BROWSER_TOOLS.NAVIGATE,
          params: {
            url: 'https://www.google.com',
            waitFor: 'input[name="q"]'
          }
        },
        {
          id: 'search-input',
          tool: BROWSER_TOOLS.TYPE,
          params: {
            selector: 'input[name="q"]',
            text: 'example website',
            clear: true
          },
          dependsOn: ['navigate-search']
        },
        {
          id: 'take-screenshot',
          tool: BROWSER_TOOLS.SCREENSHOT,
          params: {
            format: 'png',
            fullPage: false
          },
          dependsOn: ['search-input']
        },
        {
          id: 'check-results',
          tool: BROWSER_TOOLS.EVALUATE,
          params: {
            code: 'document.querySelectorAll("input[name=\\"q\\"]").length > 0'
          },
          dependsOn: ['search-input']
        }
      ]
    });
    
    console.log('🔍 搜索引擎测试结果:');
    console.log(`- 工具链ID: ${customChainResult.chainId}`);
    console.log(`- 总耗时: ${customChainResult.duration}ms`);
    console.log(`- 成功步骤: ${customChainResult.stepsExecuted}`);
    
    // 5. 演示并发执行和性能监控
    console.log('\n⚡ 5. 并发执行测试');
    
    const concurrentPromises = [];
    for (let i = 0; i < 3; i++) {
      const promise = browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: `https://httpbin.org/delay/${i + 1}` },
        `concurrent_${i}`
      );
      concurrentPromises.push(promise);
    }
    
    const concurrentResults = await Promise.allSettled(concurrentPromises);
    console.log(`✅ 并发执行完成: ${concurrentResults.filter(r => r.status === 'fulfilled').length}/3 成功`);
    
    // 6. 性能统计展示
    console.log('\n📊 6. 性能统计报告');
    
    const stats = browserSystem.getStats();
    
    console.log('🔧 工具管理器统计:');
    console.log(`- 总执行次数: ${stats.toolManager.combined.totalExecutions}`);
    console.log(`- 成功率: ${stats.toolManager.combined.successRate.toFixed(2)}%`);
    console.log(`- 平均耗时: ${stats.toolManager.combined.avgExecutionTime.toFixed(2)}ms`);
    console.log(`- 错误率: ${stats.toolManager.combined.errorRate.toFixed(2)}%`);
    
    if (stats.toolManager.instancePool) {
      console.log('\n🏊 实例池统计:');
      console.log(`- 池大小: ${stats.toolManager.instancePool.poolSize}`);
      console.log(`- 可用实例: ${stats.toolManager.instancePool.availableCount}`);
      console.log(`- 忙碌实例: ${stats.toolManager.instancePool.busyCount}`);
      console.log(`- 命中率: ${(stats.toolManager.instancePool.hitRate * 100).toFixed(2)}%`);
      console.log(`- 平均重用次数: ${stats.toolManager.instancePool.avgReuseCount.toFixed(2)}`);
    }
    
    console.log('\n📋 工具链统计:');
    console.log(`- 总工具链: ${stats.toolChain.totalChains}`);
    console.log(`- 完成: ${stats.toolChain.completedChains}`);
    console.log(`- 失败: ${stats.toolChain.failedChains}`);
    
    // 7. 工具性能趋势分析
    console.log('\n📈 7. 工具性能趋势分析');
    
    const navigateStats = browserSystem.toolManager.getToolStats(BROWSER_TOOLS.NAVIGATE);
    if (navigateStats) {
      console.log(`${BROWSER_TOOLS.NAVIGATE} 工具统计:`);
      console.log(`- 执行次数: ${navigateStats.totalExecutions}`);
      console.log(`- 平均耗时: ${navigateStats.avgDuration.toFixed(2)}ms`);
      console.log(`- 最快: ${navigateStats.minDuration}ms`);
      console.log(`- 最慢: ${navigateStats.maxDuration}ms`);
      console.log(`- 错误率: ${(navigateStats.errorRate * 100).toFixed(2)}%`);
    }
    
    // 8. 模板使用统计
    console.log('\n📝 8. 工具链模板使用统计');
    
    const templates = browserSystem.toolChain.getTemplates();
    console.log('可用模板:');
    templates.forEach(template => {
      console.log(`- ${template.name}: 使用${template.usageCount}次`);
      console.log(`  描述: ${template.description}`);
    });
    
    console.log('\n🎯 Week 3 高级功能演示完成！');
    console.log('新功能亮点:');
    console.log('✨ 浏览器实例池 - 提高性能和资源利用率');
    console.log('✨ 性能监控系统 - 实时监控和警报');
    console.log('✨ 工具链批量执行 - 复杂工作流支持');
    console.log('✨ 预定义模板 - 常见场景快速使用');
    console.log('✨ 并发执行 - 提升处理效率');
    console.log('✨ 详细统计报告 - 性能优化依据');
    
  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error.message);
    console.error('详细错误:', error);
  } finally {
    // 清理资源
    console.log('\n🧹 清理系统资源...');
    await browserSystem.cleanup();
    console.log('✅ 资源清理完成');
  }
}

/**
 * 错误处理演示
 */
async function runErrorHandlingDemo() {
  console.log('\n🛡️  错误处理和容错机制演示');
  console.log('-'.repeat(40));
  
  const browserSystem = createBrowserToolSystem({
    instancePool: { enabled: false }, // 使用单实例模式测试
    monitoring: { enabled: true },
    toolChain: { 
      continueOnError: true,
      retryAttempts: 2,
      retryDelay: 1000
    }
  });
  
  try {
    await browserSystem.initialize();
    
    // 测试超时处理
    console.log('\n⏰ 测试超时处理...');
    try {
      await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'https://httpbin.org/delay/10', timeout: 3000 },
        'timeout_test'
      );
    } catch (error) {
      console.log(`✅ 超时处理正常: ${error.message}`);
    }
    
    // 测试错误恢复
    console.log('\n🔧 测试错误恢复机制...');
    const errorChainResult = await browserSystem.toolChain.executeChain({
      steps: [
        {
          id: 'valid-step',
          tool: BROWSER_TOOLS.NAVIGATE,
          params: { url: 'https://example.com' }
        },
        {
          id: 'invalid-step',
          tool: BROWSER_TOOLS.CLICK,
          params: { selector: '#nonexistent-element' },
          dependsOn: ['valid-step']
        },
        {
          id: 'recovery-step',
          tool: BROWSER_TOOLS.EXTRACT,
          params: { selector: 'title', attribute: 'text' },
          dependsOn: ['valid-step'] // 不依赖失败的步骤
        }
      ]
    });
    
    console.log('🔄 错误恢复结果:');
    console.log(`- 完成步骤: ${errorChainResult.stepsExecuted}`);
    console.log(`- 失败步骤: ${errorChainResult.stepsFailed}`);
    console.log(`- 成功率: ${errorChainResult.summary.successRate}`);
    
  } catch (error) {
    console.error('错误处理演示失败:', error.message);
  } finally {
    await browserSystem.cleanup();
  }
}

// 主函数
async function main() {
  try {
    await runAdvancedBrowserToolsDemo();
    await runErrorHandlingDemo();
  } catch (error) {
    console.error('演示程序执行失败:', error);
  }
}

// 检查是否作为主模块运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runAdvancedBrowserToolsDemo, runErrorHandlingDemo };
