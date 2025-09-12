/**
 * Type Tool
 * 
 * @fileoverview 文本输入工具 - 用于在页面元素中输入文本
 */

import { BaseBrowserTool } from './base-tool.js';
import { 
  isValidCSSSelector, 
  isValidXPathSelector, 
  detectSelectorType 
} from '../utils/selector-utils.js';

/**
 * 文本输入工具类
 */
export class TypeTool extends BaseBrowserTool {
  constructor(browserInstance, securityPolicy) {
    super('type', browserInstance, securityPolicy);
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
          description: '目标输入元素的选择器（CSS或XPath）'
        },
        text: {
          type: 'string',
          description: '要输入的文本内容'
        },
        selectorType: {
          type: 'string',
          description: '选择器类型',
          enum: ['css', 'xpath', 'auto'],
          default: 'auto'
        },
        index: {
          type: 'number',
          description: '当有多个匹配元素时，选择第几个（从0开始）',
          default: 0,
          minimum: 0
        },
        clearBefore: {
          type: 'boolean',
          description: '输入前是否清空原有内容',
          default: true
        },
        typeSpeed: {
          type: 'number',
          description: '打字速度（字符间延迟毫秒数）',
          default: 0,
          minimum: 0,
          maximum: 1000
        },
        waitForElement: {
          type: 'boolean',
          description: '是否等待元素出现',
          default: true
        },
        focusFirst: {
          type: 'boolean',
          description: '输入前是否先聚焦元素',
          default: true
        },
        pressEnter: {
          type: 'boolean',
          description: '输入完成后是否按回车键',
          default: false
        },
        timeout: {
          type: 'number',
          description: '超时时间（毫秒）',
          default: 10000,
          minimum: 1000,
          maximum: 60000
        },
        validateInput: {
          type: 'boolean',
          description: '是否验证输入结果',
          default: true
        },
        inputMode: {
          type: 'string',
          description: '输入模式',
          enum: ['type', 'paste', 'setValue'],
          default: 'type'
        }
      },
      required: ['selector', 'text'],
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
      text, 
      selectorType = 'auto', 
      index = 0,
      typeSpeed = 0,
      timeout = 10000
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

    // 验证文本内容
    if (typeof text !== 'string') {
      return {
        valid: false,
        error: '文本内容必须是字符串'
      };
    }

    // 验证索引
    if (index < 0 || !Number.isInteger(index)) {
      return {
        valid: false,
        error: 'index必须是非负整数'
      };
    }

    // 验证打字速度
    if (typeSpeed < 0 || typeSpeed > 1000) {
      return {
        valid: false,
        error: '打字速度必须在0-1000毫秒之间'
      };
    }

    // 验证超时时间
    if (timeout < 1000 || timeout > 60000) {
      return {
        valid: false,
        error: '超时时间必须在1-60秒之间'
      };
    }

    return { valid: true };
  }

  /**
   * 执行文本输入操作
   * @param {Object} context - 执行上下文
   * @returns {Promise<Object>} 执行结果
   */
  async doExecute(context) {
    const params = context.args;
    const page = context.page;
    const {
      selector,
      text,
      selectorType = 'auto',
      index = 0,
      clearBefore = true,
      typeSpeed = 0,
      waitForElement = true,
      focusFirst = true,
      pressEnter = false,
      timeout = 10000,
      validateInput = true,
      inputMode = 'type'
    } = params;

    const startTime = Date.now();
    
    try {
      // 确定选择器类型
      const finalSelectorType = selectorType === 'auto' 
        ? detectSelectorType(selector) 
        : selectorType;

      this.logger.info(`开始文本输入: "${text}" 到元素 ${selector} (索引: ${index})`);

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

      // 获取元素信息
      const elementInfo = await this.getElementInfo(element);
      
      // 验证元素是否可输入
      if (!this.isInputElement(elementInfo)) {
        this.logger.warn(`元素可能不支持文本输入: ${elementInfo.tagName}`);
      }

      // 检查元素是否可见和启用
      if (!elementInfo.visible) {
        throw new Error('目标元素不可见');
      }

      if (!elementInfo.enabled) {
        throw new Error('目标元素已禁用');
      }

      // 滚动到元素位置
      await element.scrollIntoView();
      await page.waitForTimeout(100);

      // 聚焦元素
      if (focusFirst) {
        await element.focus();
        await page.waitForTimeout(100);
        this.logger.debug('已聚焦目标元素');
      }

      // 获取输入前的值
      const beforeValue = await this.getElementValue(element);

      // 清空现有内容
      if (clearBefore && beforeValue) {
        await this.clearElementContent(element, elementInfo);
        this.logger.debug('已清空元素原有内容');
      }

      // 执行文本输入
      let inputResult;
      switch (inputMode) {
        case 'paste':
          inputResult = await this.pasteText(page, text);
          break;
        case 'setValue':
          inputResult = await this.setElementValue(element, text);
          break;
        case 'type':
        default:
          inputResult = await this.typeText(element, text, typeSpeed);
          break;
      }

      // 按回车键
      if (pressEnter) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        this.logger.debug('已按下回车键');
      }

      // 获取输入后的值
      const afterValue = await this.getElementValue(element);

      // 验证输入结果
      let validationResult = { success: true, message: '输入成功' };
      if (validateInput) {
        validationResult = this.validateInputResult(text, afterValue, clearBefore);
      }

      const executionTime = Date.now() - startTime;
      this.logger.info(`文本输入完成，耗时: ${executionTime}ms`);

      return {
        success: true,
        data: {
          selector,
          selectorType: finalSelectorType,
          index,
          inputText: text,
          inputMode,
          beforeValue,
          afterValue,
          elementInfo,
          validation: validationResult,
          settings: {
            clearBefore,
            typeSpeed,
            pressEnter,
            focusFirst
          }
        },
        timestamp: new Date().toISOString(),
        executionTime
      };

    } catch (error) {
      this.logger.error('文本输入失败:', error);
      throw new Error(`文本输入失败: ${error.message}`);
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
          type: el.type,
          id: el.id,
          className: el.className,
          placeholder: el.placeholder,
          maxLength: el.maxLength,
          readOnly: el.readOnly,
          disabled: el.disabled,
          visible: rect.width > 0 && rect.height > 0 && 
                  computedStyle.visibility !== 'hidden' && 
                  computedStyle.display !== 'none',
          enabled: !el.disabled && !el.hasAttribute('disabled'),
          bounds: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          }
        };
      });

      return info;
    } catch (error) {
      this.logger.warn('获取元素信息失败:', error.message);
      return {
        tagName: 'unknown',
        visible: false,
        enabled: false
      };
    }
  }

  /**
   * 判断元素是否为输入元素
   * @param {Object} elementInfo - 元素信息
   * @returns {boolean} 是否为输入元素
   */
  isInputElement(elementInfo) {
    const inputTags = ['input', 'textarea', 'select'];
    const inputTypes = ['text', 'password', 'email', 'search', 'url', 'tel', 'number'];
    
    if (inputTags.includes(elementInfo.tagName)) {
      if (elementInfo.tagName === 'input') {
        return !elementInfo.type || inputTypes.includes(elementInfo.type);
      }
      return true;
    }
    
    // 检查 contenteditable 元素
    return elementInfo.contentEditable === 'true';
  }

  /**
   * 获取元素当前值
   * @param {Object} element - 元素对象
   * @returns {Promise<string>} 元素值
   */
  async getElementValue(element) {
    try {
      const value = await element.evaluate((el) => {
        if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
          return el.value || '';
        }
        if (el.tagName.toLowerCase() === 'select') {
          return el.selectedOptions[0]?.text || '';
        }
        if (el.isContentEditable) {
          return el.textContent || '';
        }
        return el.textContent || '';
      });

      return value;
    } catch (error) {
      this.logger.warn('获取元素值失败:', error.message);
      return '';
    }
  }

  /**
   * 清空元素内容
   * @param {Object} element - 元素对象
   * @param {Object} elementInfo - 元素信息
   * @returns {Promise<void>}
   */
  async clearElementContent(element, elementInfo) {
    try {
      if (['input', 'textarea'].includes(elementInfo.tagName)) {
        // 对于表单元素，使用三次点击选中所有内容，然后删除
        await element.click({ clickCount: 3 });
        await element.press('Backspace');
      } else if (elementInfo.contentEditable) {
        // 对于 contenteditable 元素
        await element.evaluate(el => {
          el.textContent = '';
        });
      }
    } catch (error) {
      this.logger.warn('清空元素内容失败:', error.message);
    }
  }

  /**
   * 输入文本
   * @param {Object} element - 元素对象
   * @param {string} text - 要输入的文本
   * @param {number} typeSpeed - 打字速度
   * @returns {Promise<void>}
   */
  async typeText(element, text, typeSpeed) {
    if (typeSpeed > 0) {
      // 逐字符输入
      for (const char of text) {
        await element.type(char);
        await new Promise(resolve => setTimeout(resolve, typeSpeed));
      }
    } else {
      // 一次性输入
      await element.type(text);
    }
  }

  /**
   * 粘贴文本
   * @param {Object} page - 页面对象
   * @param {string} text - 要粘贴的文本
   * @returns {Promise<void>}
   */
  async pasteText(page, text) {
    // 模拟粘贴操作
    await page.evaluate((textToPaste) => {
      navigator.clipboard.writeText(textToPaste);
    }, text);
    
    await page.keyboard.down('Control');
    await page.keyboard.press('v');
    await page.keyboard.up('Control');
  }

  /**
   * 设置元素值
   * @param {Object} element - 元素对象
   * @param {string} text - 要设置的文本
   * @returns {Promise<void>}
   */
  async setElementValue(element, text) {
    await element.evaluate((el, value) => {
      if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (el.isContentEditable) {
        el.textContent = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, text);
  }

  /**
   * 验证输入结果
   * @param {string} expectedText - 期望的文本
   * @param {string} actualValue - 实际值
   * @param {boolean} clearBefore - 是否清空了原有内容
   * @returns {Object} 验证结果
   */
  validateInputResult(expectedText, actualValue, clearBefore) {
    if (clearBefore) {
      // 如果清空了原有内容，应该完全匹配
      if (actualValue === expectedText) {
        return { success: true, message: '输入验证成功' };
      } else {
        return { 
          success: false, 
          message: `输入验证失败: 期望 "${expectedText}", 实际 "${actualValue}"` 
        };
      }
    } else {
      // 如果没有清空，检查是否包含输入的文本
      if (actualValue.includes(expectedText)) {
        return { success: true, message: '输入验证成功（追加模式）' };
      } else {
        return { 
          success: false, 
          message: `输入验证失败: 实际值 "${actualValue}" 不包含期望文本 "${expectedText}"` 
        };
      }
    }
  }

  /**
   * 获取工具使用提示
   * @returns {string} 使用提示
   */
  getUsageHint() {
    return `
文本输入工具使用说明:
- selector: 必需，目标输入元素的选择器（CSS或XPath）
- text: 必需，要输入的文本内容
- selectorType: 可选，选择器类型 (css/xpath/auto，默认auto)
- index: 可选，多个匹配元素时的索引（默认0）
- clearBefore: 可选，输入前是否清空原有内容（默认true）
- typeSpeed: 可选，打字速度（字符间延迟毫秒数，默认0）
- waitForElement: 可选，是否等待元素出现（默认true）
- focusFirst: 可选，输入前是否先聚焦元素（默认true）
- pressEnter: 可选，输入完成后是否按回车键（默认false）
- timeout: 可选，超时时间1-60秒（默认10秒）
- validateInput: 可选，是否验证输入结果（默认true）
- inputMode: 可选，输入模式 (type/paste/setValue，默认type)

示例:
{
  "selector": "input[name='username']",
  "text": "john_doe",
  "clearBefore": true
}

{
  "selector": "//textarea[@placeholder='请输入内容']",
  "selectorType": "xpath",
  "text": "这是一段测试文本",
  "typeSpeed": 50,
  "pressEnter": true
}

{
  "selector": "#editor",
  "text": "快速输入内容",
  "inputMode": "setValue",
  "validateInput": false
}
    `.trim();
  }
}

export default TypeTool;
