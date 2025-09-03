/**
 * 浏览器实例池管理器
 * 实现浏览器实例的池化管理，提高性能和资源利用率
 */

import { EventEmitter } from 'events';

export class BrowserInstancePool extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      maxInstances: config.maxInstances || 3,
      maxIdleTime: config.maxIdleTime || 5 * 60 * 1000, // 5分钟
      maxReuseCount: config.maxReuseCount || 100,
      warmupInstances: config.warmupInstances || 1,
      engine: config.engine || 'puppeteer',
      launchOptions: config.launchOptions || {
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      },
      ...config
    };
    
    this.instances = new Map(); // instanceId -> InstanceInfo
    this.availableInstances = new Set(); // 可用实例ID集合
    this.busyInstances = new Set(); // 忙碌实例ID集合
    this.cleanupTimer = null;
    this.stats = {
      created: 0,
      destroyed: 0,
      hits: 0,
      misses: 0,
      totalReuseCount: 0
    };
    
    this.startCleanupTimer();
  }
  
  /**
   * 获取浏览器实例
   * @param {Object} options - 获取选项
   * @returns {Promise<Object>} 实例信息 {browser, instanceId, returnInstance}
   */
  async getInstance(options = {}) {
    try {
      // 优先从池中获取可用实例
      const availableId = this.getAvailableInstance();
      if (availableId) {
        const instance = this.instances.get(availableId);
        this.markInstanceBusy(availableId);
        this.stats.hits++;
        
        this.emit('instanceAcquired', {
          instanceId: availableId,
          fromPool: true,
          poolSize: this.instances.size
        });
        
        return {
          browser: instance.browser,
          instanceId: availableId,
          returnInstance: () => this.returnInstance(availableId)
        };
      }
      
      // 池中无可用实例，创建新实例
      if (this.instances.size < this.config.maxInstances) {
        const instanceId = await this.createNewInstance();
        this.markInstanceBusy(instanceId);
        this.stats.misses++;
        
        const instance = this.instances.get(instanceId);
        
        this.emit('instanceAcquired', {
          instanceId,
          fromPool: false,
          poolSize: this.instances.size
        });
        
        return {
          browser: instance.browser,
          instanceId,
          returnInstance: () => this.returnInstance(instanceId)
        };
      }
      
      // 达到最大实例数，等待可用实例
      this.stats.misses++;
      return await this.waitForAvailableInstance(options.timeout || 30000);
      
    } catch (error) {
      this.emit('error', { operation: 'getInstance', error });
      throw error;
    }
  }
  
  /**
   * 归还实例到池中
   * @param {string} instanceId - 实例ID
   */
  async returnInstance(instanceId) {
    try {
      const instance = this.instances.get(instanceId);
      if (!instance) {
        console.warn(`尝试归还不存在的实例: ${instanceId}`);
        return;
      }
      
      // 检查实例是否仍然可用
      const isHealthy = await this.checkInstanceHealth(instance);
      if (!isHealthy || instance.reuseCount >= this.config.maxReuseCount) {
        await this.destroyInstance(instanceId);
        return;
      }
      
      // 清理实例状态（关闭多余页面等）
      await this.cleanupInstance(instance);
      
      // 标记为可用
      this.markInstanceAvailable(instanceId);
      instance.lastReturnTime = Date.now();
      instance.reuseCount++;
      this.stats.totalReuseCount++;
      
      this.emit('instanceReturned', {
        instanceId,
        reuseCount: instance.reuseCount,
        poolSize: this.instances.size
      });
      
    } catch (error) {
      console.error(`归还实例失败: ${instanceId}`, error);
      await this.destroyInstance(instanceId);
    }
  }
  
  /**
   * 创建新的浏览器实例
   * @returns {Promise<string>} 实例ID
   */
  async createNewInstance() {
    const instanceId = `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      let browser;
      
      if (this.config.engine === 'puppeteer') {
        const puppeteer = await import('puppeteer');
        browser = await puppeteer.launch(this.config.launchOptions);
      } else if (this.config.engine === 'playwright') {
        const { chromium } = await import('playwright');
        browser = await chromium.launch(this.config.launchOptions);
      } else {
        throw new Error(`不支持的浏览器引擎: ${this.config.engine}`);
      }
      
      const instance = {
        browser,
        instanceId,
        createdTime: Date.now(),
        lastUsedTime: Date.now(),
        lastReturnTime: Date.now(),
        reuseCount: 0,
        engine: this.config.engine
      };
      
      this.instances.set(instanceId, instance);
      this.stats.created++;
      
      // 设置浏览器断开连接监听
      browser.on('disconnected', () => {
        console.warn(`浏览器实例断开连接: ${instanceId}`);
        this.destroyInstance(instanceId);
      });
      
      this.emit('instanceCreated', {
        instanceId,
        engine: this.config.engine,
        poolSize: this.instances.size
      });
      
      return instanceId;
      
    } catch (error) {
      console.error(`创建浏览器实例失败:`, error);
      this.instances.delete(instanceId);
      throw error;
    }
  }
  
  /**
   * 销毁浏览器实例
   * @param {string} instanceId - 实例ID
   */
  async destroyInstance(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) return;
    
    try {
      await instance.browser.close();
    } catch (error) {
      console.warn(`关闭浏览器实例失败: ${instanceId}`, error);
    }
    
    this.instances.delete(instanceId);
    this.availableInstances.delete(instanceId);
    this.busyInstances.delete(instanceId);
    this.stats.destroyed++;
    
    this.emit('instanceDestroyed', {
      instanceId,
      reuseCount: instance.reuseCount,
      poolSize: this.instances.size
    });
  }
  
  /**
   * 获取可用实例ID
   * @returns {string|null}
   */
  getAvailableInstance() {
    for (const instanceId of this.availableInstances) {
      const instance = this.instances.get(instanceId);
      if (instance && instance.reuseCount < this.config.maxReuseCount) {
        return instanceId;
      }
    }
    return null;
  }
  
  /**
   * 标记实例为忙碌状态
   * @param {string} instanceId
   */
  markInstanceBusy(instanceId) {
    this.availableInstances.delete(instanceId);
    this.busyInstances.add(instanceId);
    
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.lastUsedTime = Date.now();
    }
  }
  
  /**
   * 标记实例为可用状态
   * @param {string} instanceId
   */
  markInstanceAvailable(instanceId) {
    this.busyInstances.delete(instanceId);
    this.availableInstances.add(instanceId);
  }
  
  /**
   * 等待可用实例
   * @param {number} timeout - 超时时间(ms)
   * @returns {Promise<Object>}
   */
  async waitForAvailableInstance(timeout = 30000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.removeListener('instanceReturned', onInstanceReturned);
        reject(new Error('等待可用浏览器实例超时'));
      }, timeout);
      
      const onInstanceReturned = async () => {
        clearTimeout(timeoutId);
        this.removeListener('instanceReturned', onInstanceReturned);
        
        try {
          const result = await this.getInstance();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      this.once('instanceReturned', onInstanceReturned);
    });
  }
  
  /**
   * 检查实例健康状态
   * @param {Object} instance - 实例对象
   * @returns {Promise<boolean>}
   */
  async checkInstanceHealth(instance) {
    try {
      // 检查浏览器是否仍然连接
      if (!instance.browser.isConnected || !instance.browser.isConnected()) {
        return false;
      }
      
      // 尝试创建一个新页面来测试功能
      const page = await instance.browser.newPage();
      await page.close();
      
      return true;
    } catch (error) {
      console.warn(`实例健康检查失败: ${instance.instanceId}`, error);
      return false;
    }
  }
  
  /**
   * 清理实例状态
   * @param {Object} instance - 实例对象
   */
  async cleanupInstance(instance) {
    try {
      const pages = await instance.browser.pages();
      
      // 保留第一个页面，关闭其他页面
      for (let i = 1; i < pages.length; i++) {
        try {
          await pages[i].close();
        } catch (error) {
          console.warn(`关闭页面失败:`, error);
        }
      }
      
      // 重置第一个页面
      if (pages.length > 0) {
        const firstPage = pages[0];
        try {
          await firstPage.goto('about:blank');
          await firstPage.setViewport({ width: 1920, height: 1080 });
        } catch (error) {
          console.warn(`重置页面失败:`, error);
        }
      }
      
    } catch (error) {
      console.warn(`清理实例状态失败: ${instance.instanceId}`, error);
    }
  }
  
  /**
   * 启动定期清理任务
   */
  startCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.performCleanup();
    }, 60 * 1000); // 每分钟检查一次
  }
  
  /**
   * 执行清理任务
   */
  async performCleanup() {
    const now = Date.now();
    const instancesToDestroy = [];
    
    for (const [instanceId, instance] of this.instances) {
      // 清理空闲时间过长的实例
      if (
        this.availableInstances.has(instanceId) &&
        (now - instance.lastReturnTime) > this.config.maxIdleTime
      ) {
        instancesToDestroy.push(instanceId);
      }
      
      // 清理重用次数过多的实例
      if (instance.reuseCount >= this.config.maxReuseCount) {
        instancesToDestroy.push(instanceId);
      }
    }
    
    // 销毁需要清理的实例
    for (const instanceId of instancesToDestroy) {
      await this.destroyInstance(instanceId);
    }
    
    this.emit('cleanupCompleted', {
      destroyedCount: instancesToDestroy.length,
      poolSize: this.instances.size
    });
  }
  
  /**
   * 预热实例池
   */
  async warmup() {
    const warmupCount = Math.min(this.config.warmupInstances, this.config.maxInstances);
    const promises = [];
    
    for (let i = 0; i < warmupCount; i++) {
      promises.push(this.createNewInstance().then(instanceId => {
        this.markInstanceAvailable(instanceId);
      }));
    }
    
    await Promise.all(promises);
    
    this.emit('warmupCompleted', {
      instanceCount: warmupCount,
      poolSize: this.instances.size
    });
  }
  
  /**
   * 获取池统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      ...this.stats,
      poolSize: this.instances.size,
      availableCount: this.availableInstances.size,
      busyCount: this.busyInstances.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      avgReuseCount: this.stats.totalReuseCount / this.stats.destroyed || 0
    };
  }
  
  /**
   * 销毁整个实例池
   */
  async destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    const destroyPromises = Array.from(this.instances.keys()).map(instanceId =>
      this.destroyInstance(instanceId)
    );
    
    await Promise.all(destroyPromises);
    
    this.emit('poolDestroyed', {
      finalStats: this.getStats()
    });
  }
}

export default BrowserInstancePool;
