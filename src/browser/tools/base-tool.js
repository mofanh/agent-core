/**
 * Base Browser Tool
 * 
 * @fileoverview 浏览器工具基类，定义通用接口和功能
 */

import { EventEmitter } from 'events';
import Logger from '../../utils/logger.js';
import { TOOL_STATUS } from '../index.js';

/**
 * 浏览器工具基类
 * 所有具体工具都应该继承此类
 */
export class BaseBrowserTool extends EventEmitter {
  /**
   * 构造函数
   * @param {string} toolName - 工具名称
   */
  constructor(toolName) {
    super();
    this.toolName = toolName;
    this.logger = new Logger(`BrowserTool:${toolName}`);
  }

  /**
   * 执行工具的主方法
   * @param {Object} context - 执行上下文
   * @param {string} context.toolName - 工具名称
   * @param {Object} context.args - 工具参数
   * @param {string} context.callId - 调用ID
   * @param {Date} context.startTime - 开始时间
   * @param {Object} context.browser - 浏览器实例
   * @param {Object} context.securityPolicy - 安全策略
   * @param {number} context.timeout - 超时时间
   * @returns {Promise<Object>} 执行结果
   */
  async execute(context) {
    const { toolName, args, callId, browser, timeout } = context;
    
    this.logger.info(`开始执行工具: ${toolName}`, { callId, args });
    
    try {
      // 预处理：验证参数和环境
      await this.preExecute(context);
      
      // 获取当前页面
      const page = await this.getCurrentPage(browser);
      context.page = page;
      
      // 执行具体工具逻辑
      const result = await this.doExecute(context);
      
      // 后处理：清理和验证结果
      await this.postExecute(context, result);
      
      this.logger.info(`工具执行成功: ${toolName}`, { callId, result });
      
      return result;
      
    } catch (error) {
      this.logger.error(`工具执行失败: ${toolName}`, { callId, error: error.message });
      throw error;
    }
  }

  /**
   * 执行前的预处理
   * @param {Object} context - 执行上下文
   * @returns {Promise<void>}
   * @protected
   */
  async preExecute(context) {
    // 验证必要参数
    await this.validateArgs(context.args);
    
    // 验证浏览器状态
    if (!context.browser) {
      throw new Error('浏览器实例不可用');
    }
  }

  /**
   * 获取当前页面实例
   * @param {Object} browser - 浏览器实例
   * @returns {Promise<Object>} 页面实例
   * @protected
   */
  async getCurrentPage(browser) {
    // 如果browser有getCurrentPage方法，则直接调用（BrowserInstance对象）
    if (browser.getCurrentPage && typeof browser.getCurrentPage === 'function') {
      return await browser.getCurrentPage();
    }
    
    // 如果是原始的Puppeteer Browser对象，则获取或创建页面
    if (browser.pages && typeof browser.pages === 'function') {
      const pages = await browser.pages();
      if (pages.length > 0) {
        return pages[0];
      } else {
        return await browser.newPage();
      }
    }
    
    // 如果是Playwright Browser对象
    if (browser.newPage && typeof browser.newPage === 'function') {
      const contexts = browser.contexts();
      if (contexts.length > 0) {
        const pages = contexts[0].pages();
        if (pages.length > 0) {
          return pages[0];
        } else {
          return await contexts[0].newPage();
        }
      } else {
        const context = await browser.newContext();
        return await context.newPage();
      }
    }
    
    throw new Error('无法识别的浏览器实例类型');
  }

  /**
   * 执行具体工具逻辑（子类必须实现）
   * @param {Object} context - 执行上下文
   * @returns {Promise<Object>} 执行结果
   * @protected
   * @abstract
   */
  async doExecute(context) {
    throw new Error('子类必须实现 doExecute 方法');
  }

  /**
   * 执行后的后处理
   * @param {Object} context - 执行上下文
   * @param {Object} result - 执行结果
   * @returns {Promise<void>}
   * @protected
   */
  async postExecute(context, result) {
    // 可以在这里添加通用的后处理逻辑
    // 如日志记录、指标收集等
  }

  /**
   * 验证参数（子类可以重写）
   * @param {Object} args - 工具参数
   * @returns {Promise<void>}
   * @protected
   */
  async validateArgs(args) {
    if (!args || typeof args !== 'object') {
      throw new Error('无效的工具参数');
    }
  }

  /**
   * 等待页面加载完成
   * @param {Object} page - 页面实例
   * @param {Object} options - 等待选项
   * @returns {Promise<void>}
   * @protected
   */
  async waitForPageLoad(page, options = {}) {
    const { 
      waitUntil = 'networkidle2', 
      timeout = 30000 
    } = options;
    
    try {
      // 等待网络空闲
      await page.waitForLoadState(waitUntil, { timeout });
    } catch (error) {
      // 如果是 Puppeteer，使用不同的方法
      if (page.waitForNavigation) {
        await page.waitForNavigation({ waitUntil, timeout });
      } else {
        throw error;
      }
    }
  }

  /**
   * 等待元素出现
   * @param {Object} page - 页面实例
   * @param {string} selector - 选择器
   * @param {Object} options - 等待选项
   * @returns {Promise<Object>} 元素
   * @protected
   */
  async waitForElement(page, selector, options = {}) {
    const { timeout = 30000, visible = false } = options;
    
    try {
      if (visible) {
        return await page.waitForSelector(selector, { 
          visible: true, 
          timeout 
        });
      } else {
        return await page.waitForSelector(selector, { timeout });
      }
    } catch (error) {
      throw new Error(`等待元素超时: ${selector} (${timeout}ms)`);
    }
  }

  /**
   * 安全地获取元素属性
   * @param {Object} page - 页面实例
   * @param {string} selector - 选择器
   * @param {string} attribute - 属性名
   * @returns {Promise<string|null>} 属性值
   * @protected
   */
  async getElementAttribute(page, selector, attribute) {
    try {
      const element = await page.$(selector);
      if (!element) {
        return null;
      }
      
      return await element.getAttribute(attribute);
    } catch (error) {
      this.logger.warn(`获取元素属性失败: ${selector}.${attribute}`, error);
      return null;
    }
  }

  /**
   * 安全地获取元素文本
   * @param {Object} page - 页面实例
   * @param {string} selector - 选择器
   * @returns {Promise<string|null>} 文本内容
   * @protected
   */
  async getElementText(page, selector) {
    try {
      const element = await page.$(selector);
      if (!element) {
        return null;
      }
      
      return await element.textContent();
    } catch (error) {
      this.logger.warn(`获取元素文本失败: ${selector}`, error);
      return null;
    }
  }

  /**
   * 检查元素是否存在
   * @param {Object} page - 页面实例
   * @param {string} selector - 选择器
   * @returns {Promise<boolean>} 是否存在
   * @protected
   */
  async elementExists(page, selector) {
    try {
      const element = await page.$(selector);
      return element !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * 检查元素是否可见
   * @param {Object} page - 页面实例
   * @param {string} selector - 选择器
   * @returns {Promise<boolean>} 是否可见
   * @protected
   */
  async elementVisible(page, selector) {
    try {
      const element = await page.$(selector);
      if (!element) {
        return false;
      }
      
      return await element.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * 滚动到元素位置
   * @param {Object} page - 页面实例
   * @param {string} selector - 选择器
   * @returns {Promise<void>}
   * @protected
   */
  async scrollToElement(page, selector) {
    try {
      const element = await page.$(selector);
      if (element) {
        await element.scrollIntoViewIfNeeded();
      }
    } catch (error) {
      this.logger.warn(`滚动到元素失败: ${selector}`, error);
    }
  }

  /**
   * 格式化工具执行结果
   * @param {Object} data - 原始数据
   * @param {Object} metadata - 元数据
   * @returns {Object} 格式化后的结果
   * @protected
   */
  formatResult(data, metadata = {}) {
    return {
      success: true,
      toolName: this.toolName,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
  }

  /**
   * 创建错误结果
   * @param {string} message - 错误消息
   * @param {Object} details - 错误详情
   * @returns {Object} 错误结果
   * @protected
   */
  createError(message, details = {}) {
    return {
      success: false,
      toolName: this.toolName,
      error: message,
      details: {
        timestamp: new Date().toISOString(),
        ...details
      }
    };
  }
}
