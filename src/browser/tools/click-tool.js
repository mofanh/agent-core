/**
 * Click Tool
 * 
 * @fileoverview 元素点击工具 - 用于点击页面元素
 */

import { BaseBrowserTool } from './base-tool.js';
import { logger } from '../../utils/logger.js';
import { 
  isValidCSSSelector, 
  isValidXPathSelector, 
  detectSelectorType, 
  SelectorPatterns 
} from '../utils/selector-utils.js';

/**
 * 元素点击工具类
 */
export class ClickTool extends BaseBrowserTool {
  constructor(browserInstance, securityPolicy) {
    super('click', browserInstance, securityPolicy);
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
          description: '要点击的元素选择器（CSS或XPath）'
        },
        selectorType: {
          type: 'string',
          description: '选择器类型',
          enum: ['css', 'xpath', 'auto'],
          default: 'auto'
        },
        index: {
          type: 'number',
          description: '当有多个匹配元素时，点击第几个（从0开始）',
          default: 0,
          minimum: 0
        },
        clickType: {
          type: 'string',
          description: '点击类型',
          enum: ['left', 'right', 'middle', 'double'],
          default: 'left'
        },
        waitForElement: {
          type: 'boolean',
          description: '是否等待元素出现',
          default: true
        },
        waitForNavigation: {
          type: 'boolean',
          description: '点击后是否等待页面导航',
          default: false
        },
        scrollIntoView: {
          type: 'boolean',
          description: '点击前是否滚动到元素可见位置',
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
          description: '点击偏移量（相对于元素中心）',
          properties: {
            x: { type: 'number', default: 0 },
            y: { type: 'number', default: 0 }
          },
          default: { x: 0, y: 0 }
        },
        modifiers: {
          type: 'array',
          description: '按键修饰符',
          items: {
            type: 'string',
            enum: ['Alt', 'Control', 'Meta', 'Shift']
          },
          default: []
        },
        force: {
          type: 'boolean',
          description: '是否强制点击（即使元素不可见）',
          default: false
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
    const baseValidation = super.validateParameters(params);
    if (!baseValidation.valid) {
      return baseValidation;
    }

    const { 
      selector, 
      selectorType = 'auto', 
      index = 0, 
      timeout = 10000,
      offset = { x: 0, y: 0 },
      modifiers = []
    } = params;

    // 验证选择器
    if (!selector || typeof selector !== 'string') {
      return {
        valid: false,
        error: '选择器必须是非空字符串'
      };
    }

    // 验证选择器类型和格式
    if (selectorType === 'css' && !isValidCSSSelector(selector)) {
      return {
        valid: false,
        error: '无效的CSS选择器格式'
      };
    }

    if (selectorType === 'xpath' && !isValidXPathSelector(selector)) {
      return {
        valid: false,
        error: '无效的XPath选择器格式'
      };
    }

    if (selectorType === 'auto') {
      const detectedType = detectSelectorType(selector);
      if (detectedType === 'unknown') {
        return {
          valid: false,
          error: '无法识别选择器类型，请指定selectorType'
        };
      }
    }

    // 验证索引
    if (index < 0 || !Number.isInteger(index)) {
      return {
        valid: false,
        error: 'index必须是非负整数'
      };
    }

    // 验证超时时间
    if (timeout < 1000 || timeout > 60000) {
      return {
        valid: false,
        error: '超时时间必须在1-60秒之间'
      };
    }

    // 验证偏移量
    if (offset && (typeof offset !== 'object' || 
                  typeof offset.x !== 'number' || 
                  typeof offset.y !== 'number')) {
      return {
        valid: false,
        error: 'offset必须包含数字类型的x和y属性'
      };
    }

    // 验证修饰符
    if (modifiers && Array.isArray(modifiers)) {
      const validModifiers = ['Alt', 'Control', 'Meta', 'Shift'];
      for (const modifier of modifiers) {
        if (!validModifiers.includes(modifier)) {
          return {
            valid: false,
            error: `无效的修饰符: ${modifier}`
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * 执行点击操作
   * @param {Object} params - 工具参数
   * @returns {Promise<Object>} 执行结果
   */
  async executeInternal(params) {
    const {
      selector,
      selectorType = 'auto',
      index = 0,
      clickType = 'left',
      waitForElement = true,
      waitForNavigation = false,
      scrollIntoView = true,
      timeout = 10000,
      offset = { x: 0, y: 0 },
      modifiers = [],
      force = false
    } = params;

    const page = await this.browserInstance.getCurrentPage();
    const startTime = Date.now();
    
    try {
      // 确定选择器类型
      const finalSelectorType = selectorType === 'auto' 
        ? detectSelectorType(selector) 
        : selectorType;

      logger.info(`开始点击元素: ${selector} (类型: ${finalSelectorType}, 索引: ${index})`);

      // 等待元素出现
      let element;
      if (waitForElement) {
        element = await this.waitForElementBySelector(
          page, 
          selector, 
          finalSelectorType, 
          index, 
          timeout
        );
      } else {
        element = await this.findElementBySelector(
          page, 
          selector, 
          finalSelectorType, 
          index
        );
      }

      if (!element) {
        throw new Error(`未找到匹配的元素: ${selector}`);
      }

      // 检查元素可见性和可点击性
      if (!force) {
        const elementInfo = await this.getElementInfo(element);
        
        if (!elementInfo.visible) {
          throw new Error('元素不可见，无法点击');
        }

        if (!elementInfo.enabled) {
          logger.warn('元素已禁用，但仍将尝试点击');
        }
      }

      // 滚动到元素位置
      if (scrollIntoView) {
        await element.scrollIntoView();
        logger.debug('已滚动到元素位置');
        
        // 等待滚动完成
        await page.waitForTimeout(100);
      }

      // 获取元素位置和尺寸
      const boundingBox = await element.boundingBox();
      if (!boundingBox && !force) {
        throw new Error('无法获取元素位置信息');
      }

      // 计算点击坐标
      const clickX = boundingBox ? boundingBox.x + boundingBox.width / 2 + offset.x : 0;
      const clickY = boundingBox ? boundingBox.y + boundingBox.height / 2 + offset.y : 0;

      // 设置导航等待
      const navigationPromise = waitForNavigation 
        ? page.waitForNavigation({ 
            waitUntil: 'networkidle0', 
            timeout 
          })
        : Promise.resolve();

      // 执行点击
      let clickResult;
      const clickOptions = {
        button: this.getClickButton(clickType),
        clickCount: clickType === 'double' ? 2 : 1,
        delay: clickType === 'double' ? 0 : undefined
      };

      // 添加修饰符
      if (modifiers.length > 0) {
        for (const modifier of modifiers) {
          await page.keyboard.down(modifier);
        }
      }

      try {
        if (boundingBox) {
          // 在指定坐标点击
          clickResult = await page.mouse.click(clickX, clickY, clickOptions);
        } else {
          // 直接点击元素
          clickResult = await element.click(clickOptions);
        }
      } finally {
        // 释放修饰符
        if (modifiers.length > 0) {
          for (const modifier of modifiers.reverse()) {
            await page.keyboard.up(modifier);
          }
        }
      }

      // 等待导航完成
      if (waitForNavigation) {
        try {
          await navigationPromise;
          logger.debug('页面导航完成');
        } catch (error) {
          logger.warn('等待导航超时，继续执行');
        }
      }

      const executionTime = Date.now() - startTime;
      logger.info(`点击操作完成，耗时: ${executionTime}ms`);

      // 获取点击后的页面状态
      const afterClickInfo = await this.getClickResult(page, element);

      return {
        success: true,
        data: {
          selector,
          selectorType: finalSelectorType,
          index,
          clickType,
          coordinates: { x: clickX, y: clickY },
          elementInfo: await this.getElementInfo(element),
          afterClick: afterClickInfo,
          modifiers,
          navigationOccurred: waitForNavigation
        },
        timestamp: new Date().toISOString(),
        executionTime
      };

    } catch (error) {
      logger.error('点击操作失败:', error);
      throw new Error(`点击操作失败: ${error.message}`);
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
   * 等待元素出现并返回
   * @param {Object} page - Puppeteer页面对象
   * @param {string} selector - 选择器
   * @param {string} selectorType - 选择器类型
   * @param {number} index - 元素索引
   * @param {number} timeout - 超时时间
   * @returns {Promise<Object>} 元素对象
   */
  async waitForElementBySelector(page, selector, selectorType, index, timeout) {
    if (selectorType === 'xpath') {
      // XPath选择器需要特殊处理
      await page.waitForXPath(selector, { visible: true, timeout });
      const elements = await page.$x(selector);
      return elements[index] || null;
    } else {
      await page.waitForSelector(selector, { visible: true, timeout });
      const elements = await page.$$(selector);
      return elements[index] || null;
    }
  }

  /**
   * 获取元素信息
   * @param {Object} element - 元素对象
   * @returns {Promise<Object>} 元素信息
   */
  async getElementInfo(element) {
    try {
      const info = await element.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        return {
          tagName: el.tagName.toLowerCase(),
          id: el.id,
          className: el.className,
          text: el.textContent ? el.textContent.trim() : '',
          visible: rect.width > 0 && rect.height > 0 && 
                  computedStyle.visibility !== 'hidden' && 
                  computedStyle.display !== 'none',
          enabled: !el.disabled && !el.hasAttribute('disabled'),
          bounds: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          },
          attributes: Array.from(el.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {}),
          isClickable: el.tagName === 'BUTTON' || 
                      el.tagName === 'A' || 
                      el.tagName === 'INPUT' ||
                      el.onclick !== null ||
                      el.hasAttribute('onclick') ||
                      computedStyle.cursor === 'pointer'
        };
      });

      return info;
    } catch (error) {
      logger.warn('获取元素信息失败:', error.message);
      return {
        tagName: 'unknown',
        visible: false,
        enabled: false,
        isClickable: false
      };
    }
  }

  /**
   * 获取点击操作结果
   * @param {Object} page - Puppeteer页面对象
   * @param {Object} element - 被点击的元素
   * @returns {Promise<Object>} 点击结果信息
   */
  async getClickResult(page, element) {
    try {
      const pageInfo = await page.evaluate(() => ({
        url: window.location.href,
        title: document.title,
        activeElementTag: document.activeElement ? document.activeElement.tagName : null,
        scrollPosition: {
          x: window.scrollX,
          y: window.scrollY
        }
      }));

      return pageInfo;
    } catch (error) {
      logger.warn('获取点击结果失败:', error.message);
      return {
        url: 'unknown',
        title: 'unknown',
        activeElementTag: null,
        scrollPosition: { x: 0, y: 0 }
      };
    }
  }

  /**
   * 获取点击按钮类型
   * @param {string} clickType - 点击类型
   * @returns {string} Puppeteer按钮类型
   */
  getClickButton(clickType) {
    switch (clickType) {
      case 'right':
        return 'right';
      case 'middle':
        return 'middle';
      case 'left':
      case 'double':
      default:
        return 'left';
    }
  }

  /**
   * 获取工具使用提示
   * @returns {string} 使用提示
   */
  getUsageHint() {
    return `
元素点击工具使用说明:
- selector: 必需，要点击的元素选择器（CSS或XPath）
- selectorType: 可选，选择器类型 (css/xpath/auto，默认auto)
- index: 可选，匹配多个元素时的索引（默认0）
- clickType: 可选，点击类型 (left/right/middle/double，默认left)
- waitForElement: 可选，是否等待元素出现（默认true）
- waitForNavigation: 可选，点击后是否等待页面导航（默认false）
- scrollIntoView: 可选，点击前是否滚动到元素（默认true）
- timeout: 可选，超时时间1-60秒（默认10秒）
- offset: 可选，点击偏移量 {x: 0, y: 0}
- modifiers: 可选，按键修饰符 ['Alt', 'Control', 'Meta', 'Shift']
- force: 可选，是否强制点击不可见元素（默认false）

示例:
{
  "selector": "button.submit-btn",
  "clickType": "left",
  "waitForNavigation": true
}

{
  "selector": "//button[contains(text(), '提交')]",
  "selectorType": "xpath",
  "modifiers": ["Control"]
}
    `.trim();
  }
}

export default ClickTool;
