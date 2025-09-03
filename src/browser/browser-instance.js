/**
 * Browser Instance Manager
 * 
 * @fileoverview 管理浏览器实例的生命周期，支持多种浏览器引擎
 */

import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';
import { BROWSER_ENGINES } from './index.js';

/**
 * 浏览器实例管理器
 * 负责创建、管理和销毁浏览器实例
 */
export class BrowserInstance extends EventEmitter {
  /**
   * 构造函数
   * @param {Object} config - 配置选项
   * @param {string} config.engine - 浏览器引擎 (puppeteer|playwright)
   * @param {boolean} config.headless - 是否无头模式
   * @param {Object} config.viewport - 默认视口配置
   * @param {Array} config.args - 浏览器启动参数
   * @param {number} config.timeout - 默认超时时间
   */
  constructor(config = {}) {
    super();
    
    this.config = {
      engine: config.engine || BROWSER_ENGINES.PUPPETEER,
      headless: config.headless !== false, // 默认无头模式
      viewport: config.viewport || { width: 1920, height: 1080 },
      args: config.args || [],
      timeout: config.timeout || 30000,
      ...config
    };
    
    this.logger = new Logger('BrowserInstance');
    this.browser = null;
    this.pages = new Map(); // pageId -> page instance
    this.currentPageId = null;
    this.isInitialized = false;
    
    // 性能监控
    this.metrics = {
      pagesCreated: 0,
      pagesClosed: 0,
      startTime: null,
      lastActivity: Date.now()
    };
  }

  /**
   * 初始化浏览器实例
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    this.logger.info(`初始化浏览器引擎: ${this.config.engine}`);
    this.metrics.startTime = Date.now();

    try {
      if (this.config.engine === BROWSER_ENGINES.PUPPETEER) {
        await this.initializePuppeteer();
      } else if (this.config.engine === BROWSER_ENGINES.PLAYWRIGHT) {
        await this.initializePlaywright();
      } else {
        throw new Error(`不支持的浏览器引擎: ${this.config.engine}`);
      }

      this.isInitialized = true;
      this.emit('initialized', { engine: this.config.engine });
      this.logger.info('浏览器实例初始化完成');
      
    } catch (error) {
      this.logger.error('浏览器实例初始化失败:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * 初始化 Puppeteer
   * @private
   */
  async initializePuppeteer() {
    let puppeteer;
    try {
      puppeteer = await import('puppeteer');
    } catch (error) {
      throw new Error('Puppeteer 未安装。请运行: npm install puppeteer');
    }

    const browserArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      ...this.config.args
    ];

    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      args: browserArgs,
      timeout: this.config.timeout
    });

    // 监听浏览器关闭事件
    this.browser.on('disconnected', () => {
      this.emit('disconnected');
      this.isInitialized = false;
    });
  }

  /**
   * 初始化 Playwright
   * @private
   */
  async initializePlaywright() {
    let playwright;
    try {
      playwright = await import('playwright');
    } catch (error) {
      throw new Error('Playwright 未安装。请运行: npm install playwright');
    }

    this.browser = await playwright.chromium.launch({
      headless: this.config.headless,
      args: this.config.args,
      timeout: this.config.timeout
    });

    // 监听浏览器关闭事件
    this.browser.on('disconnected', () => {
      this.emit('disconnected');
      this.isInitialized = false;
    });
  }

  /**
   * 创建新页面
   * @param {Object} options - 页面选项
   * @returns {Promise<Object>} 页面实例和ID
   */
  async newPage(options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const page = await this.browser.newPage();
    const pageId = `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 设置视口
    const viewport = options.viewport || this.config.viewport;
    if (viewport) {
      await page.setViewport(viewport);
    }

    // 设置用户代理（如果指定）
    if (options.userAgent) {
      await page.setUserAgent(options.userAgent);
    }

    // 配置页面行为
    if (options.blockResources && options.blockResources.length > 0) {
      await this.setupResourceBlocking(page, options.blockResources);
    }

    // 存储页面实例
    this.pages.set(pageId, page);
    this.currentPageId = pageId;
    this.metrics.pagesCreated++;
    this.metrics.lastActivity = Date.now();

    // 监听页面关闭事件
    page.on('close', () => {
      this.pages.delete(pageId);
      this.metrics.pagesClosed++;
      if (this.currentPageId === pageId) {
        this.currentPageId = null;
      }
    });

    this.emit('pageCreated', { pageId, page });
    this.logger.debug(`创建新页面: ${pageId}`);

    return { page, pageId };
  }

  /**
   * 获取当前页面
   * @returns {Promise<Object>} 当前页面实例
   */
  async getCurrentPage() {
    if (!this.currentPageId || !this.pages.has(this.currentPageId)) {
      const { page, pageId } = await this.newPage();
      return page;
    }
    return this.pages.get(this.currentPageId);
  }

  /**
   * 根据ID获取页面
   * @param {string} pageId - 页面ID
   * @returns {Object|null} 页面实例
   */
  getPage(pageId) {
    return this.pages.get(pageId) || null;
  }

  /**
   * 关闭页面
   * @param {string} pageId - 页面ID
   * @returns {Promise<void>}
   */
  async closePage(pageId) {
    const page = this.pages.get(pageId);
    if (page) {
      await page.close();
      this.pages.delete(pageId);
      if (this.currentPageId === pageId) {
        this.currentPageId = null;
      }
      this.logger.debug(`关闭页面: ${pageId}`);
    }
  }

  /**
   * 设置资源阻止
   * @param {Object} page - 页面实例
   * @param {Array} blockedResources - 要阻止的资源类型
   * @private
   */
  async setupResourceBlocking(page, blockedResources) {
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (blockedResources.includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  /**
   * 获取浏览器信息
   * @returns {Object} 浏览器信息
   */
  async getBrowserInfo() {
    if (!this.browser) {
      return null;
    }

    try {
      const version = await this.browser.version();
      const userAgent = await this.browser.userAgent();
      
      return {
        engine: this.config.engine,
        version,
        userAgent,
        isConnected: this.browser.isConnected(),
        pagesCount: this.pages.size,
        metrics: { ...this.metrics }
      };
    } catch (error) {
      this.logger.error('获取浏览器信息失败:', error);
      return null;
    }
  }

  /**
   * 检查浏览器健康状态
   * @returns {Promise<boolean>} 是否健康
   */
  async isHealthy() {
    try {
      if (!this.browser || !this.browser.isConnected()) {
        return false;
      }

      // 创建测试页面检查连接
      const testPage = await this.browser.newPage();
      await testPage.close();
      
      return true;
    } catch (error) {
      this.logger.error('浏览器健康检查失败:', error);
      return false;
    }
  }

  /**
   * 关闭所有页面
   * @returns {Promise<void>}
   */
  async closeAllPages() {
    const closePromises = Array.from(this.pages.values()).map(page => 
      page.close().catch(err => this.logger.warn('关闭页面失败:', err))
    );
    
    await Promise.allSettled(closePromises);
    this.pages.clear();
    this.currentPageId = null;
    this.logger.info('已关闭所有页面');
  }

  /**
   * 销毁浏览器实例
   * @returns {Promise<void>}
   */
  async destroy() {
    this.logger.info('开始销毁浏览器实例');
    
    try {
      // 关闭所有页面
      await this.closeAllPages();
      
      // 关闭浏览器
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      
      this.isInitialized = false;
      this.emit('destroyed');
      this.logger.info('浏览器实例已销毁');
      
    } catch (error) {
      this.logger.error('销毁浏览器实例失败:', error);
      throw error;
    }
  }

  /**
   * 获取性能指标
   * @returns {Object} 性能指标
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: this.metrics.startTime ? Date.now() - this.metrics.startTime : 0,
      activePagesCount: this.pages.size,
      timeSinceLastActivity: Date.now() - this.metrics.lastActivity
    };
  }
}
