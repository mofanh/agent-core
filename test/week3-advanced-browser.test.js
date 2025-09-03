/**
 * Week 3 浏览器工具高级功能测试
 * 测试实例池、性能监控、工具链等新功能
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import {
  BrowserInstancePool,
  BrowserToolMonitor,
  BrowserToolChain,
  BrowserToolManager,
  createBrowserToolSystem,
  BROWSER_TOOLS
} from '../src/browser/index.js';

describe('Week 3 浏览器工具高级功能测试', () => {
  let browserSystem;
  
  beforeAll(async () => {
    browserSystem = createBrowserToolSystem({
      headless: true,
      instancePool: {
        enabled: true,
        maxInstances: 2,
        warmupInstances: 0 // 测试时不预热
      },
      monitoring: {
        enabled: true
      }
    });
  });
  
  afterAll(async () => {
    if (browserSystem) {
      await browserSystem.cleanup();
    }
  });

  describe('BrowserInstancePool 实例池测试', () => {
    let instancePool;
    
    beforeEach(() => {
      instancePool = new BrowserInstancePool({
        maxInstances: 2,
        maxIdleTime: 10000,
        maxReuseCount: 5,
        warmupInstances: 0,
        engine: 'puppeteer'
      });
    });
    
    afterEach(async () => {
      if (instancePool) {
        await instancePool.destroy();
      }
    });

    test('应该能够创建和管理浏览器实例', async () => {
      const context1 = await instancePool.getInstance();
      expect(context1).toBeDefined();
      expect(context1.browser).toBeDefined();
      expect(context1.instanceId).toBeDefined();
      expect(typeof context1.returnInstance).toBe('function');
      
      // 归还实例
      await context1.returnInstance();
      
      // 获取统计信息
      const stats = instancePool.getStats();
      expect(stats.poolSize).toBe(1);
      expect(stats.created).toBe(1);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(1);
    });

    test('应该能够重用实例', async () => {
      // 第一次获取
      const context1 = await instancePool.getInstance();
      const instanceId1 = context1.instanceId;
      await context1.returnInstance();
      
      // 第二次获取应该重用
      const context2 = await instancePool.getInstance();
      const instanceId2 = context2.instanceId;
      await context2.returnInstance();
      
      expect(instanceId1).toBe(instanceId2);
      
      const stats = instancePool.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    test('应该遵守最大实例数限制', async () => {
      const context1 = await instancePool.getInstance();
      const context2 = await instancePool.getInstance();
      
      // 第三个请求应该等待
      const context3Promise = instancePool.getInstance({ timeout: 1000 });
      
      // 归还一个实例
      setTimeout(() => context1.returnInstance(), 500);
      
      const context3 = await context3Promise;
      expect(context3).toBeDefined();
      
      await context2.returnInstance();
      await context3.returnInstance();
    });
  });

  describe('BrowserToolMonitor 性能监控测试', () => {
    let monitor;
    
    beforeEach(() => {
      monitor = new BrowserToolMonitor({
        enabled: true,
        alertThresholds: {
          errorRate: 0.5,
          avgExecutionTime: 1000,
          timeoutRate: 0.3
        }
      });
    });
    
    afterEach(() => {
      if (monitor) {
        monitor.destroy();
      }
    });

    test('应该能够监控工具执行', async () => {
      const session = monitor.startExecution('test.tool', { param: 'value' });
      
      // 模拟执行
      await new Promise(resolve => setTimeout(resolve, 100));
      session.finish({ result: 'success' });
      
      const stats = monitor.getStats();
      expect(stats.global.totalExecutions).toBe(1);
      expect(stats.tools).toHaveLength(1);
      expect(stats.tools[0].toolName).toBe('test.tool');
      expect(stats.tools[0].successCount).toBe(1);
    });

    test('应该能够记录错误', async () => {
      const session = monitor.startExecution('test.tool');
      session.error(new Error('Test error'));
      
      const stats = monitor.getStats();
      expect(stats.global.totalErrors).toBe(1);
      expect(stats.tools[0].errorCount).toBe(1);
      expect(stats.tools[0].errorRate).toBe(1);
    });

    test('应该能够记录超时', async () => {
      const session = monitor.startExecution('test.tool');
      session.timeout();
      
      const stats = monitor.getStats();
      expect(stats.global.totalTimeouts).toBe(1);
      expect(stats.tools[0].timeoutCount).toBe(1);
    });

    test('应该能够触发性能警报', (done) => {
      monitor.on('alert', (alert) => {
        expect(alert.type).toBe('performance');
        expect(alert.level).toBeDefined();
        expect(alert.message).toContain('执行时间');
        done();
      });
      
      // 创建一个超过阈值的执行
      const session = monitor.startExecution('slow.tool');
      setTimeout(() => {
        session.finish({ result: 'slow' });
      }, 1100); // 超过1000ms阈值
    });
  });

  describe('BrowserToolChain 工具链测试', () => {
    let toolManager;
    let toolChain;
    
    beforeEach(async () => {
      toolManager = new BrowserToolManager({
        headless: true,
        instancePool: { enabled: false } // 简化测试
      });
      await toolManager.initialize();
      
      toolChain = new BrowserToolChain(toolManager, {
        maxConcurrency: 2,
        continueOnError: true
      });
    });
    
    afterEach(async () => {
      if (toolManager) {
        await toolManager.cleanup();
      }
    });

    test('应该能够注册和获取模板', () => {
      const templates = toolChain.getTemplates();
      expect(templates.length).toBeGreaterThan(0);
      
      // 检查内置模板
      const pageAnalysisTemplate = templates.find(t => t.name === 'page-analysis');
      expect(pageAnalysisTemplate).toBeDefined();
      expect(pageAnalysisTemplate.steps).toBeDefined();
      expect(pageAnalysisTemplate.variables).toBeDefined();
    });

    test('应该能够执行简单的工具链', async () => {
      const result = await toolChain.executeChain({
        steps: [
          {
            id: 'navigate',
            tool: BROWSER_TOOLS.NAVIGATE,
            params: {
              url: 'about:blank'
            }
          },
          {
            id: 'extract',
            tool: BROWSER_TOOLS.EXTRACT,
            params: {
              selector: 'title',
              attribute: 'text'
            },
            dependsOn: ['navigate']
          }
        ]
      });
      
      expect(result.success).toBe(true);
      expect(result.stepsExecuted).toBe(2);
      expect(result.stepsFailed).toBe(0);
      expect(result.results).toBeDefined();
    }, 30000);

    test('应该能够处理工具链中的错误', async () => {
      const result = await toolChain.executeChain({
        steps: [
          {
            id: 'navigate',
            tool: BROWSER_TOOLS.NAVIGATE,
            params: {
              url: 'about:blank'
            }
          },
          {
            id: 'invalid',
            tool: BROWSER_TOOLS.CLICK,
            params: {
              selector: '#nonexistent'
            },
            dependsOn: ['navigate']
          },
          {
            id: 'recovery',
            tool: BROWSER_TOOLS.EXTRACT,
            params: {
              selector: 'title',
              attribute: 'text'
            },
            dependsOn: ['navigate'] // 不依赖失败的步骤
          }
        ]
      });
      
      expect(result.success).toBe(true);
      expect(result.stepsExecuted).toBe(2); // navigate + recovery
      expect(result.stepsFailed).toBe(1); // invalid step
    }, 30000);

    test('应该能够使用模板执行工具链', async () => {
      // 注册自定义测试模板
      toolChain.registerTemplate('test-template', {
        name: 'test-template',
        description: '测试模板',
        steps: [
          {
            id: 'navigate',
            tool: BROWSER_TOOLS.NAVIGATE,
            params: {
              url: '{{url}}'
            }
          }
        ],
        variables: {
          url: { required: true, type: 'string' }
        }
      });
      
      const result = await toolChain.executeChain({
        template: 'test-template',
        variables: {
          url: 'about:blank'
        }
      });
      
      expect(result.success).toBe(true);
      expect(result.stepsExecuted).toBe(1);
    }, 30000);
  });

  describe('BrowserToolSystem 集成测试', () => {
    test('应该能够创建完整的浏览器工具系统', () => {
      const system = createBrowserToolSystem({
        instancePool: { enabled: true },
        monitoring: { enabled: true }
      });
      
      expect(system.toolManager).toBeDefined();
      expect(system.toolChain).toBeDefined();
      expect(system.monitor).toBeDefined();
      expect(typeof system.initialize).toBe('function');
      expect(typeof system.cleanup).toBe('function');
    });

    test('应该能够获取系统统计信息', async () => {
      await browserSystem.initialize();
      
      // 执行一些操作
      await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'about:blank' },
        'test'
      );
      
      const stats = browserSystem.getStats();
      expect(stats.toolManager).toBeDefined();
      expect(stats.toolChain).toBeDefined();
      expect(stats.toolManager.combined.totalExecutions).toBeGreaterThan(0);
    }, 30000);
  });

  describe('性能和并发测试', () => {
    test('应该能够处理并发工具执行', async () => {
      await browserSystem.initialize();
      
      const promises = [];
      for (let i = 0; i < 3; i++) {
        const promise = browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url: 'about:blank' },
          `concurrent_${i}`
        );
        promises.push(promise);
      }
      
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      expect(successful).toBeGreaterThan(0);
      
      // 检查实例池统计
      if (browserSystem.instancePool) {
        const poolStats = browserSystem.instancePool.getStats();
        expect(poolStats.totalReuseCount).toBeGreaterThan(0);
      }
    }, 45000);

    test('应该能够正确处理实例池的资源管理', async () => {
      await browserSystem.initialize();
      
      const initialStats = browserSystem.instancePool.getStats();
      
      // 执行多次操作
      for (let i = 0; i < 5; i++) {
        await browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url: 'about:blank' },
          `pool_test_${i}`
        );
      }
      
      const finalStats = browserSystem.instancePool.getStats();
      
      // 验证实例被重用
      expect(finalStats.totalReuseCount).toBeGreaterThan(initialStats.totalReuseCount);
      expect(finalStats.hits).toBeGreaterThan(0);
    }, 60000);
  });

  describe('错误处理和恢复测试', () => {
    test('应该能够处理工具执行超时', async () => {
      await browserSystem.initialize();
      
      await expect(
        browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { url: 'https://httpbin.org/delay/10', timeout: 1000 },
          'timeout_test'
        )
      ).rejects.toThrow('超时');
      
      // 验证监控记录了超时
      const stats = browserSystem.monitor.getStats();
      expect(stats.global.totalTimeouts).toBeGreaterThan(0);
    }, 15000);

    test('应该能够在错误后继续执行', async () => {
      await browserSystem.initialize();
      
      // 第一个工具调用失败
      try {
        await browserSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.CLICK,
          { selector: '#nonexistent' },
          'error_test'
        );
      } catch (error) {
        expect(error.message).toContain('浏览器工具执行失败');
      }
      
      // 第二个工具调用应该成功
      const result = await browserSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { url: 'about:blank' },
        'recovery_test'
      );
      
      expect(result.success).toBe(true);
    }, 30000);
  });
});
