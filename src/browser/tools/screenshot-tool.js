/**
 * Screenshot Tool
 * 
 * @fileoverview 屏幕截图工具 - 用于截取页面或元素的截图
 */

import { BaseBrowserTool } from './base-tool.js';
import { logger } from '../../utils/logger.js';
import { 
  isValidCSSSelector, 
  isValidXPathSelector, 
  detectSelectorType 
} from '../utils/selector-utils.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * 屏幕截图工具类
 */
export class ScreenshotTool extends BaseBrowserTool {
  constructor(browserInstance, securityPolicy) {
    super('screenshot', browserInstance, securityPolicy);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: '截图类型',
          enum: ['fullPage', 'viewport', 'element'],
          default: 'viewport'
        },
        selector: {
          type: 'string',
          description: '元素选择器（当type为element时必需）'
        },
        selectorType: {
          type: 'string',
          description: '选择器类型',
          enum: ['css', 'xpath', 'auto'],
          default: 'auto'
        },
        index: {
          type: 'number',
          description: '元素索引（当有多个匹配元素时）',
          default: 0,
          minimum: 0
        },
        format: {
          type: 'string',
          description: '图片格式',
          enum: ['png', 'jpeg', 'webp'],
          default: 'png'
        },
        quality: {
          type: 'number',
          description: '图片质量（仅JPEG和WebP格式）',
          default: 80,
          minimum: 1,
          maximum: 100
        },
        filePath: {
          type: 'string',
          description: '保存文件路径（可选，不提供则返回base64）'
        },
        clip: {
          type: 'object',
          description: '自定义裁剪区域',
          properties: {
            x: { type: 'number', minimum: 0 },
            y: { type: 'number', minimum: 0 },
            width: { type: 'number', minimum: 1 },
            height: { type: 'number', minimum: 1 }
          }
        },
        waitForElement: {
          type: 'boolean',
          description: '是否等待元素出现（仅element类型）',
          default: true
        },
        hideElements: {
          type: 'array',
          description: '要隐藏的元素选择器数组',
          items: { type: 'string' },
          default: []
        },
        scrollToElement: {
          type: 'boolean',
          description: '截图前是否滚动到元素（仅element类型）',
          default: true
        },
        addPadding: {
          type: 'object',
          description: '元素截图时添加的内边距',
          properties: {
            top: { type: 'number', default: 0 },
            right: { type: 'number', default: 0 },
            bottom: { type: 'number', default: 0 },
            left: { type: 'number', default: 0 }
          },
          default: {}
        },
        retina: {
          type: 'boolean',
          description: '是否使用高分辨率（2倍像素密度）',
          default: false
        },
        timeout: {
          type: 'number',
          description: '超时时间（毫秒）',
          default: 10000,
          minimum: 1000,
          maximum: 60000
        }
      },
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
      type = 'viewport',
      selector,
      selectorType = 'auto',
      quality = 80,
      format = 'png',
      filePath,
      clip,
      timeout = 10000
    } = params;

    // 验证截图类型
    if (type === 'element' && !selector) {
      return {
        valid: false,
        error: '元素截图必须提供selector参数'
      };
    }

    // 验证选择器
    if (selector) {
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
    }

    // 验证图片质量
    if ((format === 'jpeg' || format === 'webp') && (quality < 1 || quality > 100)) {
      return {
        valid: false,
        error: '图片质量必须在1-100之间'
      };
    }

    // 验证文件路径
    if (filePath) {
      try {
        const parsedPath = path.parse(filePath);
        if (!parsedPath.dir || !parsedPath.name) {
          return {
            valid: false,
            error: '无效的文件路径'
          };
        }
      } catch (error) {
        return {
          valid: false,
          error: `文件路径解析失败: ${error.message}`
        };
      }
    }

    // 验证裁剪区域
    if (clip) {
      const { x, y, width, height } = clip;
      if (typeof x !== 'number' || typeof y !== 'number' || 
          typeof width !== 'number' || typeof height !== 'number') {
        return {
          valid: false,
          error: '裁剪区域的坐标和尺寸必须是数字'
        };
      }
      if (x < 0 || y < 0 || width <= 0 || height <= 0) {
        return {
          valid: false,
          error: '裁剪区域的坐标不能为负数，尺寸必须大于0'
        };
      }
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
   * 执行截图操作
   * @param {Object} params - 工具参数
   * @returns {Promise<Object>} 执行结果
   */
  async executeInternal(params) {
    const {
      type = 'viewport',
      selector,
      selectorType = 'auto',
      index = 0,
      format = 'png',
      quality = 80,
      filePath,
      clip,
      waitForElement = true,
      hideElements = [],
      scrollToElement = true,
      addPadding = {},
      retina = false,
      timeout = 10000
    } = params;

    const page = await this.browserInstance.getCurrentPage();
    const startTime = Date.now();
    
    try {
      logger.info(`开始截图: 类型=${type}, 格式=${format}`);

      // 设置设备像素比
      if (retina) {
        await page.setViewport({
          ...page.viewport(),
          deviceScaleFactor: 2
        });
      }

      // 隐藏指定元素
      if (hideElements.length > 0) {
        await this.hideElements(page, hideElements);
      }

      let screenshotOptions = {
        type: format,
        encoding: filePath ? 'binary' : 'base64'
      };

      // 添加质量参数（仅适用于JPEG和WebP）
      if (format === 'jpeg' || format === 'webp') {
        screenshotOptions.quality = quality;
      }

      let screenshotData;
      let elementInfo = null;

      // 根据截图类型执行不同的截图操作
      switch (type) {
        case 'fullPage':
          screenshotOptions.fullPage = true;
          screenshotData = await page.screenshot(screenshotOptions);
          break;

        case 'viewport':
          if (clip) {
            screenshotOptions.clip = clip;
          }
          screenshotData = await page.screenshot(screenshotOptions);
          break;

        case 'element':
          const result = await this.screenshotElement(
            page, 
            selector, 
            selectorType, 
            index, 
            screenshotOptions,
            { waitForElement, scrollToElement, addPadding, timeout }
          );
          screenshotData = result.data;
          elementInfo = result.elementInfo;
          break;

        default:
          throw new Error(`不支持的截图类型: ${type}`);
      }

      // 恢复隐藏的元素
      if (hideElements.length > 0) {
        await this.showElements(page, hideElements);
      }

      // 保存文件或返回base64数据
      let fileInfo = null;
      let dataUrl = null;

      if (filePath) {
        // 保存到文件
        await this.saveScreenshotToFile(screenshotData, filePath);
        fileInfo = {
          path: filePath,
          size: screenshotData.length,
          format: format.toUpperCase()
        };
        logger.info(`截图已保存到: ${filePath}`);
      } else {
        // 返回base64数据
        const base64Data = screenshotData.toString('base64');
        dataUrl = `data:image/${format};base64,${base64Data}`;
      }

      // 获取页面信息
      const pageInfo = await this.getPageInfo(page);

      const executionTime = Date.now() - startTime;
      logger.info(`截图完成，耗时: ${executionTime}ms`);

      return {
        success: true,
        data: {
          type,
          format,
          selector,
          selectorType: selector ? (selectorType === 'auto' ? detectSelectorType(selector) : selectorType) : null,
          elementInfo,
          fileInfo,
          dataUrl,
          pageInfo,
          settings: {
            quality: format === 'jpeg' || format === 'webp' ? quality : null,
            retina,
            clip,
            hideElements: hideElements.length,
            padding: addPadding
          },
          metadata: {
            timestamp: new Date().toISOString(),
            viewport: page.viewport(),
            url: page.url()
          }
        },
        timestamp: new Date().toISOString(),
        executionTime
      };

    } catch (error) {
      logger.error('截图操作失败:', error);
      throw new Error(`截图操作失败: ${error.message}`);
    }
  }

  /**
   * 截取元素截图
   * @param {Object} page - 页面对象
   * @param {string} selector - 选择器
   * @param {string} selectorType - 选择器类型
   * @param {number} index - 元素索引
   * @param {Object} screenshotOptions - 截图选项
   * @param {Object} options - 其他选项
   * @returns {Promise<Object>} 截图数据和元素信息
   */
  async screenshotElement(page, selector, selectorType, index, screenshotOptions, options) {
    const { waitForElement, scrollToElement, addPadding, timeout } = options;

    // 确定选择器类型
    const finalSelectorType = selectorType === 'auto' 
      ? detectSelectorType(selector) 
      : selectorType;

    // 查找元素
    let element;
    if (waitForElement) {
      if (finalSelectorType === 'xpath') {
        await page.waitForXPath(selector, { visible: true, timeout });
        const elements = await page.$x(selector);
        element = elements[index] || null;
      } else {
        await page.waitForSelector(selector, { visible: true, timeout });
        const elements = await page.$$(selector);
        element = elements[index] || null;
      }
    } else {
      if (finalSelectorType === 'xpath') {
        const elements = await page.$x(selector);
        element = elements[index] || null;
      } else {
        const elements = await page.$$(selector);
        element = elements[index] || null;
      }
    }

    if (!element) {
      throw new Error(`未找到匹配的元素: ${selector}`);
    }

    // 滚动到元素
    if (scrollToElement) {
      await element.scrollIntoView();
      await page.waitForTimeout(500); // 等待滚动完成
    }

    // 获取元素信息
    const elementInfo = await this.getElementBoundingBox(element);

    // 计算带内边距的截图区域
    let screenshotClip = { ...elementInfo };
    if (addPadding && Object.keys(addPadding).length > 0) {
      const padding = {
        top: addPadding.top || 0,
        right: addPadding.right || 0,
        bottom: addPadding.bottom || 0,
        left: addPadding.left || 0
      };

      screenshotClip.x = Math.max(0, screenshotClip.x - padding.left);
      screenshotClip.y = Math.max(0, screenshotClip.y - padding.top);
      screenshotClip.width = screenshotClip.width + padding.left + padding.right;
      screenshotClip.height = screenshotClip.height + padding.top + padding.bottom;
    }

    // 执行元素截图
    screenshotOptions.clip = screenshotClip;
    const screenshotData = await page.screenshot(screenshotOptions);

    return {
      data: screenshotData,
      elementInfo: {
        ...elementInfo,
        actualClip: screenshotClip,
        padding: addPadding
      }
    };
  }

  /**
   * 隐藏指定元素
   * @param {Object} page - 页面对象
   * @param {Array<string>} selectors - 要隐藏的元素选择器数组
   * @returns {Promise<void>}
   */
  async hideElements(page, selectors) {
    try {
      await page.evaluate((selectorList) => {
        selectorList.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.style.visibility = 'hidden';
            el.setAttribute('data-screenshot-hidden', 'true');
          });
        });
      }, selectors);
      logger.debug(`已隐藏 ${selectors.length} 种元素`);
    } catch (error) {
      logger.warn('隐藏元素失败:', error.message);
    }
  }

  /**
   * 显示之前隐藏的元素
   * @param {Object} page - 页面对象
   * @param {Array<string>} selectors - 元素选择器数组
   * @returns {Promise<void>}
   */
  async showElements(page, selectors) {
    try {
      await page.evaluate(() => {
        const hiddenElements = document.querySelectorAll('[data-screenshot-hidden="true"]');
        hiddenElements.forEach(el => {
          el.style.visibility = '';
          el.removeAttribute('data-screenshot-hidden');
        });
      });
      logger.debug('已恢复隐藏的元素');
    } catch (error) {
      logger.warn('恢复隐藏元素失败:', error.message);
    }
  }

  /**
   * 获取元素边界框信息
   * @param {Object} element - 元素对象
   * @returns {Promise<Object>} 边界框信息
   */
  async getElementBoundingBox(element) {
    try {
      const boundingBox = await element.boundingBox();
      if (!boundingBox) {
        throw new Error('无法获取元素边界框');
      }

      const elementInfo = await element.evaluate((el) => {
        return {
          tagName: el.tagName.toLowerCase(),
          id: el.id,
          className: el.className,
          text: el.textContent ? el.textContent.trim().substring(0, 100) : ''
        };
      });

      return {
        x: Math.round(boundingBox.x),
        y: Math.round(boundingBox.y),
        width: Math.round(boundingBox.width),
        height: Math.round(boundingBox.height),
        ...elementInfo
      };
    } catch (error) {
      logger.warn('获取元素边界框失败:', error.message);
      throw error;
    }
  }

  /**
   * 保存截图到文件
   * @param {Buffer} screenshotData - 截图数据
   * @param {string} filePath - 文件路径
   * @returns {Promise<void>}
   */
  async saveScreenshotToFile(screenshotData, filePath) {
    try {
      // 确保目录存在
      const directory = path.dirname(filePath);
      await fs.mkdir(directory, { recursive: true });

      // 写入文件
      await fs.writeFile(filePath, screenshotData);
    } catch (error) {
      logger.error('保存截图文件失败:', error);
      throw new Error(`保存截图文件失败: ${error.message}`);
    }
  }

  /**
   * 获取页面信息
   * @param {Object} page - 页面对象
   * @returns {Promise<Object>} 页面信息
   */
  async getPageInfo(page) {
    try {
      return await page.evaluate(() => ({
        url: window.location.href,
        title: document.title,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        scroll: {
          x: window.scrollX,
          y: window.scrollY
        }
      }));
    } catch (error) {
      return {
        url: 'unknown',
        title: 'unknown',
        viewport: { width: 0, height: 0 },
        scroll: { x: 0, y: 0 }
      };
    }
  }

  /**
   * 获取工具使用提示
   * @returns {string} 使用提示
   */
  getUsageHint() {
    return `
屏幕截图工具使用说明:
- type: 可选，截图类型 (fullPage/viewport/element，默认viewport)
- selector: 元素选择器（当type为element时必需）
- selectorType: 可选，选择器类型 (css/xpath/auto，默认auto)
- index: 可选，元素索引（默认0）
- format: 可选，图片格式 (png/jpeg/webp，默认png)
- quality: 可选，图片质量1-100（仅JPEG和WebP，默认80）
- filePath: 可选，保存文件路径（不提供则返回base64）
- clip: 可选，自定义裁剪区域 {x, y, width, height}
- waitForElement: 可选，是否等待元素出现（默认true）
- hideElements: 可选，要隐藏的元素选择器数组
- scrollToElement: 可选，是否滚动到元素（默认true）
- addPadding: 可选，元素截图内边距 {top, right, bottom, left}
- retina: 可选，是否使用高分辨率（默认false）
- timeout: 可选，超时时间1-60秒（默认10秒）

示例:
{
  "type": "viewport",
  "format": "png",
  "filePath": "./screenshots/page.png"
}

{
  "type": "element",
  "selector": ".header",
  "format": "jpeg",
  "quality": 90,
  "addPadding": {"top": 10, "bottom": 10}
}

{
  "type": "fullPage",
  "hideElements": [".ads", ".popup"],
  "retina": true
}
    `.trim();
  }
}

export default ScreenshotTool;
