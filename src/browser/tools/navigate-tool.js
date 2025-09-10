/**
 * Navigate Tool
 * 
 * @fileoverview 页面导航工具 - 用于浏览器页面导航操作
 */

import { BaseBrowserTool } from './base-tool.js';
import { isValidCSSSelector } from '../utils/selector-utils.js';

/**
 * 页面导航工具类
 */
export class NavigateTool extends BaseBrowserTool {
  constructor() {
    super('navigate');
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '要导航到的URL',
          pattern: '^https?://.*'
        },
        waitForSelector: {
          type: 'string',
          description: '等待出现的CSS选择器 (可选)',
          default: null
        },
        waitForNavigation: {
          type: 'boolean',
          description: '是否等待页面完全加载',
          default: true
        },
        timeout: {
          type: 'number',
          description: '超时时间（毫秒）',
          default: 30000,
          minimum: 1000,
          maximum: 120000
        },
        userAgent: {
          type: 'string',
          description: '自定义User-Agent (可选)',
          default: null
        },
        referer: {
          type: 'string',
          description: '引用页面URL (可选)',
          default: null
        },
        extraHeaders: {
          type: 'object',
          description: '额外的HTTP头部 (可选)',
          default: null,
          additionalProperties: {
            type: 'string'
          }
        }
      },
      required: ['url'],
      additionalProperties: false
    };
  }

  /**
   * 验证参数
   * @param {Object} params - 工具参数
   * @returns {Object} 验证结果
   */
  validateParameters(params) {
    const baseValidation = super.validateParameters(params);
    if (!baseValidation.valid) {
      return baseValidation;
    }

    const { url, waitForSelector, timeout, userAgent, referer, extraHeaders } = params;

    // 验证URL格式
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          valid: false,
          error: '只支持HTTP和HTTPS协议的URL'
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: `无效的URL格式: ${error.message}`
      };
    }

    // 验证等待选择器
    if (waitForSelector && !isValidCSSSelector(waitForSelector)) {
      return {
        valid: false,
        error: '无效的CSS选择器格式'
      };
    }

    // 验证超时时间
    if (timeout && (timeout < 1000 || timeout > 120000)) {
      return {
        valid: false,
        error: '超时时间必须在1秒到120秒之间'
      };
    }

    // 验证User-Agent
    if (userAgent && (typeof userAgent !== 'string' || userAgent.length > 1000)) {
      return {
        valid: false,
        error: 'User-Agent必须是字符串且长度不超过1000字符'
      };
    }

    // 验证Referer
    if (referer) {
      try {
        new URL(referer);
      } catch (error) {
        return {
          valid: false,
          error: `无效的Referer URL: ${error.message}`
        };
      }
    }

    // 验证额外头部
    if (extraHeaders) {
      if (typeof extraHeaders !== 'object' || Array.isArray(extraHeaders)) {
        return {
          valid: false,
          error: 'extraHeaders必须是对象'
        };
      }

      for (const [key, value] of Object.entries(extraHeaders)) {
        if (typeof key !== 'string' || typeof value !== 'string') {
          return {
            valid: false,
            error: 'extraHeaders的键值都必须是字符串'
          };
        }

        // 检查是否为禁止的头部
        const forbiddenHeaders = ['host', 'content-length', 'connection', 'authorization'];
        if (forbiddenHeaders.includes(key.toLowerCase())) {
          return {
            valid: false,
            error: `不允许设置头部: ${key}`
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * 执行导航操作（基类接口实现）
   * @param {Object} context - 执行上下文
   * @returns {Promise<Object>} 执行结果
   */
  async doExecute(context) {
    return await this.executeInternal(context);
  }

  /**
   * 内部执行导航操作
   * @param {Object} context - 执行上下文
   * @returns {Promise<Object>} 导航结果
   */
  async executeInternal(context) {
    const {
      url,
      waitForSelector,
      waitForNavigation = true,
      timeout = 30000,
      userAgent,
      referer,
      extraHeaders
    } = context.args;

    const page = context.page;
    
    try {
      // 设置用户代理
      if (userAgent) {
        await page.setUserAgent(userAgent);
        this.logger.debug('设置User-Agent:', userAgent);
      }

      // 设置额外的HTTP头部
      if (extraHeaders || referer) {
        const headers = { ...extraHeaders };
        if (referer) {
          headers['Referer'] = referer;
        }
        await page.setExtraHTTPHeaders(headers);
        this.logger.debug('设置HTTP头部:', headers);
      }

      // 记录导航开始
      const startTime = Date.now();
      this.logger.info(`开始导航到: ${url}`);

      // 执行导航
      const navigationPromise = waitForNavigation 
        ? page.waitForNavigation({ 
            waitUntil: 'networkidle0', 
            timeout 
          })
        : Promise.resolve();

      const response = await Promise.all([
        page.goto(url, { 
          waitUntil: waitForNavigation ? 'domcontentloaded' : 'networkidle0',
          timeout 
        }),
        navigationPromise
      ]);

      const navigationResponse = response[0];
      const navigationTime = Date.now() - startTime;

      this.logger.info(`页面导航完成，耗时: ${navigationTime}ms`);

      // 检查响应状态
      if (navigationResponse && !navigationResponse.ok()) {
        this.logger.warn(`页面响应状态码: ${navigationResponse.status()}`);
      }

      // 等待指定选择器出现
      let selectorFound = false;
      if (waitForSelector) {
        try {
          await page.waitForSelector(waitForSelector, { 
            visible: true, 
            timeout: Math.min(timeout, 10000) // 选择器等待时间最多10秒
          });
          selectorFound = true;
          this.logger.debug(`选择器已出现: ${waitForSelector}`);
        } catch (error) {
          this.logger.warn(`等待选择器超时: ${waitForSelector}`, error.message);
          // 选择器超时不算失败，继续执行
        }
      }

      // 获取页面信息
      const pageInfo = await this.getPageInfo(page);

      return {
        success: true,
        data: {
          url: page.url(),
          finalUrl: page.url(),
          title: pageInfo.title,
          statusCode: navigationResponse ? navigationResponse.status() : null,
          loadTime: navigationTime,
          selectorFound,
          waitedForSelector: waitForSelector,
          pageInfo: {
            url: pageInfo.url,
            title: pageInfo.title,
            description: pageInfo.description,
            keywords: pageInfo.keywords,
            viewport: pageInfo.viewport,
            readyState: pageInfo.readyState
          }
        },
        timestamp: new Date().toISOString(),
        executionTime: navigationTime
      };

    } catch (error) {
      this.logger.error('页面导航失败:', error);
      
      // 尝试获取当前页面状态用于错误诊断
      let currentUrl = 'unknown';
      let currentTitle = 'unknown';
      try {
        currentUrl = page.url();
        currentTitle = await page.title();
      } catch (e) {
        // 忽略获取状态时的错误
      }

      throw new Error(`页面导航失败: ${error.message} (当前页面: ${currentUrl})`);
    }
  }

  /**
   * 获取页面基本信息
   * @param {Object} page - Puppeteer页面对象
   * @returns {Promise<Object>} 页面信息
   */
  async getPageInfo(page) {
    try {
      const info = await page.evaluate(() => {
        const getMetaContent = (name) => {
          const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
          return meta ? meta.getAttribute('content') : null;
        };

        return {
          url: window.location.href,
          title: document.title,
          description: getMetaContent('description') || getMetaContent('og:description'),
          keywords: getMetaContent('keywords'),
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
          },
          readyState: document.readyState,
          referrer: document.referrer,
          lastModified: document.lastModified,
          characterSet: document.characterSet,
          contentType: document.contentType
        };
      });

      return info;
    } catch (error) {
      this.logger.warn('获取页面信息失败:', error.message);
      return {
        url: page.url(),
        title: await page.title().catch(() => 'Unknown'),
        description: null,
        keywords: null,
        viewport: { width: 0, height: 0, devicePixelRatio: 1 },
        readyState: 'unknown'
      };
    }
  }

  /**
   * 获取工具使用提示
   * @returns {string} 使用提示
   */
  getUsageHint() {
    return `
页面导航工具使用说明:
- url: 必需，要导航到的完整URL（支持HTTP/HTTPS）
- waitForSelector: 可选，等待出现的CSS选择器
- waitForNavigation: 可选，是否等待页面完全加载（默认true）
- timeout: 可选，超时时间，1-120秒（默认30秒）
- userAgent: 可选，自定义浏览器标识
- referer: 可选，引用页面URL
- extraHeaders: 可选，额外的HTTP请求头

示例:
{
  "url": "https://example.com",
  "waitForSelector": ".main-content",
  "timeout": 15000
}
    `.trim();
  }
}

export default NavigateTool;
