/**
 * Hover Tool
 * 
 * @fileoverview 鼠标悬停工具 - 用于悬停在页面元素上
 */

import { BaseBrowserTool } from './base-tool.js';
import { 
  isValidCSSSelector, 
  isValidXPathSelector, 
  detectSelectorType 
} from '../utils/selector-utils.js';

/**
 * 鼠标悬停工具类
 */
export class HoverTool extends BaseBrowserTool {
  constructor(browserInstance, securityPolicy) {
    super('hover', browserInstance, securityPolicy);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: '要悬停的元素选择器（CSS或XPath）'
        },
        selectorType: {
          type: 'string',
          description: '选择器类型',
          enum: ['css', 'xpath', 'auto'],
          default: 'auto'
        },
        index: {
          type: 'number',
          description: '当有多个匹配元素时，悬停第几个（从0开始）',
          default: 0,
          minimum: 0
        },
        waitForElement: {
          type: 'boolean',
          description: '是否等待元素出现',
          default: true
        },
        scrollIntoView: {
          type: 'boolean',
          description: '悬停前是否滚动到元素可见位置',
          default: true
        },
        timeout: {
          type: 'number',
          description: '超时时间（毫秒）',
          default: 10000,
          minimum: 1000,
          maximum: 60000
        },
        offset: {
          type: 'object',
          description: '悬停偏移量（相对于元素中心）',
          properties: {
            x: { type: 'number', default: 0 },
            y: { type: 'number', default: 0 }
          },
          default: { x: 0, y: 0 }
        }
      },
      required: ['selector'],
      additionalProperties: false
    };
  }

  /**
   * 验证参数
   * @param {Object} params - 工具参数
   * @returns {Object} 验证结果
   */
  validateParameters(params) {
    const errors = [];

    // 验证选择器
    if (!params.selector || typeof params.selector !== 'string') {
      errors.push('selector 参数必须是非空字符串');
    } else {
      const selectorType = params.selectorType === 'auto' 
        ? detectSelectorType(params.selector) 
        : params.selectorType;
        
      if (selectorType === 'css' && !isValidCSSSelector(params.selector)) {
        errors.push('无效的CSS选择器格式');
      } else if (selectorType === 'xpath' && !isValidXPathSelector(params.selector)) {
        errors.push('无效的XPath选择器格式');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 执行悬停操作
   * @param {Object} context - 执行上下文
   * @returns {Promise<Object>} 执行结果
   */
  async doExecute(context) {
    const params = context.args;
    const page = context.page;
    const {
      selector,
      selectorType = 'auto',
      index = 0,
      waitForElement = true,
      scrollIntoView = true,
      timeout = 10000,
      offset = { x: 0, y: 0 }
    } = params;

    const startTime = Date.now();
    
    try {
      // 确定选择器类型
      const finalSelectorType = selectorType === 'auto' 
        ? detectSelectorType(selector) 
        : selectorType;

      this.logger.info(`开始悬停元素: ${selector} (类型: ${finalSelectorType}, 索引: ${index})`);

      // 使用 Locator API 进行现代化的元素交互
      let locator;
      if (finalSelectorType === 'xpath') {
        // XPath 选择器需要特殊处理
        locator = page.locator(`::-p-xpath(${selector})`);
      } else {
        // CSS 选择器直接使用
        locator = page.locator(selector);
      }

      // 如果有多个匹配元素且需要特定索引，使用 nth
      if (index > 0) {
        locator = locator.nth(index);
      }

      // 配置 locator 的行为选项
      locator = locator
        .setVisibility('visible')  // 确保元素可见
        .setTimeout(timeout)       // 设置超时
        .setEnsureElementIsInTheViewport(scrollIntoView); // 设置滚动行为

      let hoverResult;
      let hoverMethod = 'locator';

      try {
        // 使用 Locator API 进行悬停
        await locator.hover();
        hoverResult = true;
        
        this.logger.debug(`成功使用 Locator API 悬停元素: ${selector}`);
      } catch (locatorError) {
        // 如果 Locator API 失败，回退到传统方法
        this.logger.warn(`Locator API 悬停失败，回退到传统方法: ${locatorError.message}`);
        hoverMethod = 'fallback';
        
        // 查找元素
        const element = await this.findElementBySelector(page, selector, finalSelectorType, index);
        if (!element) {
          throw new Error(`未找到匹配的元素: ${selector}`);
        }

        // 滚动到元素位置
        if (scrollIntoView) {
          await element.scrollIntoView();
          await page.waitForTimeout(100);
        }

        // 传统方法：获取元素位置并悬停
        const boundingBox = await element.boundingBox();
        if (boundingBox) {
          const hoverX = boundingBox.x + boundingBox.width / 2 + offset.x;
          const hoverY = boundingBox.y + boundingBox.height / 2 + offset.y;
          
          await page.mouse.move(hoverX, hoverY);
          hoverResult = { x: hoverX, y: hoverY };
        } else {
          await element.hover();
          hoverResult = true;
        }
      }

      const executionTime = Date.now() - startTime;
      this.logger.info(`悬停操作完成，耗时: ${executionTime}ms`);

      // 获取悬停后的页面信息
      const pageInfo = await page.evaluate(() => ({
        url: window.location.href,
        title: document.title,
        scrollPosition: {
          x: window.scrollX,
          y: window.scrollY
        }
      }));

      return {
        success: true,
        data: {
          selector,
          selectorType: finalSelectorType,
          index,
          coordinates: typeof hoverResult === 'object' ? hoverResult : null,
          pageInfo,
          method: hoverMethod
        },
        timestamp: new Date().toISOString(),
        executionTime
      };

    } catch (error) {
      this.logger.error('悬停操作失败:', error);
      
      const executionTime = Date.now() - startTime;
      
      return {
        success: false,
        error: `悬停失败: ${error.message}`,
        data: {
          selector,
          selectorType: selectorType === 'auto' 
            ? detectSelectorType(selector) 
            : selectorType,
          index
        },
        timestamp: new Date().toISOString(),
        executionTime
      };
    }
  }

  /**
   * 根据选择器查找元素
   * @param {Object} page - Puppeteer页面对象
   * @param {string} selector - 选择器
   * @param {string} selectorType - 选择器类型
   * @param {number} index - 元素索引
   * @returns {Promise<Object>} 元素对象
   */
  async findElementBySelector(page, selector, selectorType, index) {
    if (selectorType === 'xpath') {
      const elements = await page.$x(selector);
      return elements[index] || null;
    } else {
      const elements = await page.$$(selector);
      return elements[index] || null;
    }
  }

  /**
   * 获取工具使用提示
   * @returns {string} 使用提示
   */
  getUsageHint() {
    return `
悬停工具使用提示:
1. 支持CSS和XPath选择器
2. 支持元素索引选择
3. 自动等待元素出现和可见
4. 支持自动滚动到元素位置
5. 使用现代化的 Locator API，提供更好的稳定性
6. 如果 Locator API 失败，会自动回退到传统方法

示例:
- 悬停按钮: { selector: "button", selectorType: "css" }
- 悬停链接: { selector: "//a[text()='点击这里']", selectorType: "xpath" }
- 悬停第二个元素: { selector: ".item", index: 1 }
    `.trim();
  }
}
