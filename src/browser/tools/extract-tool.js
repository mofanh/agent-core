/**
 * Extract Tool
 * 
 * @fileoverview 内容提取工具 - 用于从页面提取文本、属性和数据
 */

import { BaseBrowserTool } from './base-tool.js';
import { 
  isValidCSSSelector, 
  isValidXPathSelector, 
  detectSelectorType,
  combineSelectors 
} from '../utils/selector-utils.js';

/**
 * 内容提取工具类
 */
export class ExtractTool extends BaseBrowserTool {
  constructor(browserInstance, securityPolicy) {
    super('extract', browserInstance, securityPolicy);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        selectors: {
          oneOf: [
            {
              type: 'string',
              description: '单个选择器'
            },
            {
              type: 'array',
              description: '多个选择器数组',
              items: {
                type: 'string'
              },
              minItems: 1
            },
            {
              type: 'object',
              description: '命名选择器对象',
              additionalProperties: {
                type: 'string'
              }
            }
          ]
        },
        selectorType: {
          type: 'string',
          description: '选择器类型',
          enum: ['css', 'xpath', 'auto'],
          default: 'auto'
        },
        extractType: {
          type: 'string',
          description: '提取类型',
          enum: ['text', 'html', 'attributes', 'all'],
          default: 'text'
        },
        attributes: {
          type: 'array',
          description: '要提取的属性列表',
          items: {
            type: 'string'
          },
          default: []
        },
        multiple: {
          type: 'boolean',
          description: '是否提取所有匹配的元素',
          default: false
        },
        waitForElements: {
          type: 'boolean',
          description: '是否等待元素出现',
          default: true
        },
        timeout: {
          type: 'number',
          description: '超时时间（毫秒）',
          default: 10000,
          minimum: 1000,
          maximum: 60000
        },
        includeMetadata: {
          type: 'boolean',
          description: '是否包含元素元数据',
          default: false
        },
        textOptions: {
          type: 'object',
          description: '文本提取选项',
          properties: {
            trim: {
              type: 'boolean',
              description: '是否去除首尾空白',
              default: true
            },
            normalizeWhitespace: {
              type: 'boolean',
              description: '是否标准化空白字符',
              default: true
            },
            includeHidden: {
              type: 'boolean',
              description: '是否包含隐藏元素的文本',
              default: false
            }
          },
          default: {}
        },
        pagination: {
          type: 'object',
          description: '分页提取选项',
          properties: {
            enabled: {
              type: 'boolean',
              description: '是否启用分页提取',
              default: false
            },
            maxPages: {
              type: 'number',
              description: '最大页数',
              default: 5,
              minimum: 1,
              maximum: 20
            },
            nextButtonSelector: {
              type: 'string',
              description: '下一页按钮选择器'
            },
            waitAfterClick: {
              type: 'number',
              description: '点击后等待时间（毫秒）',
              default: 2000
            }
          },
          default: {}
        }
      },
      required: ['selectors'],
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
      selectors, 
      selectorType = 'auto', 
      attributes = [],
      timeout = 10000,
      pagination = {}
    } = params;

    // 验证选择器
    if (!selectors) {
      return {
        valid: false,
        error: '必须提供selectors参数'
      };
    }

    // 验证选择器格式
    const selectorsList = this.normalizeSelectors(selectors);
    for (const selector of selectorsList) {
      if (selectorType === 'css' && !isValidCSSSelector(selector)) {
        return {
          valid: false,
          error: `无效的CSS选择器: ${selector}`
        };
      }
      
      if (selectorType === 'xpath' && !isValidXPathSelector(selector)) {
        return {
          valid: false,
          error: `无效的XPath选择器: ${selector}`
        };
      }

      if (selectorType === 'auto') {
        const detectedType = detectSelectorType(selector);
        if (detectedType === 'unknown') {
          return {
            valid: false,
            error: `无法识别选择器类型: ${selector}`
          };
        }
      }
    }

    // 验证属性列表
    if (attributes && !Array.isArray(attributes)) {
      return {
        valid: false,
        error: 'attributes必须是字符串数组'
      };
    }

    // 验证超时时间
    if (timeout < 1000 || timeout > 60000) {
      return {
        valid: false,
        error: '超时时间必须在1-60秒之间'
      };
    }

    // 验证分页选项
    if (pagination.enabled) {
      if (!pagination.nextButtonSelector) {
        return {
          valid: false,
          error: '启用分页时必须提供nextButtonSelector'
        };
      }

      if (pagination.maxPages && (pagination.maxPages < 1 || pagination.maxPages > 20)) {
        return {
          valid: false,
          error: 'maxPages必须在1-20之间'
        };
      }
    }

    return { valid: true };
  }

  /**
   * 执行内容提取
   * @param {Object} context - 执行上下文
   * @returns {Promise<Object>} 执行结果
   */
  async doExecute(context) {
    const params = context.args;
    const page = context.page;
    
    console.log(`[DEBUG EXTRACT] 浏览器实例ID: ${context.instanceId || 'unknown'}`);
    console.log(`[DEBUG EXTRACT] 当前页面URL: ${page.url()}`);
    
    const {
      selectors,
      selectorType = 'auto',
      extractType = 'text',
      attributes = [],
      multiple = false,
      waitForElements = true,
      timeout = 10000,
      includeMetadata = false,
      textOptions = {},
      pagination = {}
    } = params;

    const startTime = Date.now();
    
    try {
      this.logger.info(`开始提取内容: ${JSON.stringify(selectors)}`);

      // 标准化选择器
      const selectorData = this.parseSelectors(selectors);
      const results = {};
      let totalElements = 0;

      // 执行分页提取或单页提取
      if (pagination.enabled) {
        const paginationResults = await this.extractWithPagination(
          page, selectorData, { 
            selectorType, extractType, attributes, multiple, 
            waitForElements, timeout, includeMetadata, textOptions 
          }, pagination
        );
        Object.assign(results, paginationResults.data);
        totalElements = paginationResults.totalElements;
      } else {
        const extractResults = await this.extractFromPage(
          page, selectorData, {
            selectorType, extractType, attributes, multiple,
            waitForElements, timeout, includeMetadata, textOptions
          }
        );
        Object.assign(results, extractResults.data);
        totalElements = extractResults.totalElements;
      }

      const executionTime = Date.now() - startTime;
      this.logger.info(`内容提取完成，共提取 ${totalElements} 个元素，耗时: ${executionTime}ms`);

      return {
        success: true,
        data: {
          results,
          metadata: {
            totalElements,
            extractType,
            selectorType,
            paginationUsed: pagination.enabled,
            pageInfo: await this.getPageInfo(page)
          }
        },
        timestamp: new Date().toISOString(),
        executionTime
      };

    } catch (error) {
      this.logger.error('内容提取失败:', error);
      throw new Error(`内容提取失败: ${error.message}`);
    }
  }

  /**
   * 从单页提取内容
   * @param {Object} page - Puppeteer页面对象
   * @param {Object} selectorData - 选择器数据
   * @param {Object} options - 提取选项
   * @returns {Promise<Object>} 提取结果
   */
  async extractFromPage(page, selectorData, options) {
    const results = {};
    let totalElements = 0;

    for (const [key, selector] of Object.entries(selectorData)) {
      try {
        const extractResult = await this.extractBySelector(page, selector, options);
        results[key] = extractResult;
        totalElements += extractResult.elements ? extractResult.elements.length : 
                       (extractResult.element ? 1 : 0);
      } catch (error) {
        this.logger.warn(`选择器 ${key} 提取失败:`, error.message);
        results[key] = {
          success: false,
          error: error.message,
          selector,
          elements: []
        };
      }
    }

    return { data: results, totalElements };
  }

  /**
   * 分页提取内容
   * @param {Object} page - Puppeteer页面对象
   * @param {Object} selectorData - 选择器数据
   * @param {Object} extractOptions - 提取选项
   * @param {Object} paginationOptions - 分页选项
   * @returns {Promise<Object>} 提取结果
   */
  async extractWithPagination(page, selectorData, extractOptions, paginationOptions) {
    const {
      maxPages = 5,
      nextButtonSelector,
      waitAfterClick = 2000
    } = paginationOptions;

    const allResults = {};
    let totalElements = 0;
    let currentPage = 1;

    // 初始化结果结构
    for (const key of Object.keys(selectorData)) {
      allResults[key] = {
        success: true,
        selector: selectorData[key],
        elements: [],
        pages: []
      };
    }

    while (currentPage <= maxPages) {
      this.logger.info(`提取第 ${currentPage} 页内容`);

      // 提取当前页内容
      const pageResults = await this.extractFromPage(selectorData, extractOptions);
      
      // 合并结果
      for (const [key, result] of Object.entries(pageResults.data)) {
        if (result.success && result.elements) {
          allResults[key].elements.push(...result.elements);
          allResults[key].pages.push({
            page: currentPage,
            count: result.elements.length,
            url: page.url()
          });
          totalElements += result.elements.length;
        }
      }

      // 尝试点击下一页
      if (currentPage < maxPages) {
        try {
          const nextButton = await page.$(nextButtonSelector);
          if (!nextButton) {
            this.logger.info('未找到下一页按钮，分页结束');
            break;
          }

          // 检查按钮是否可点击
          const isClickable = await nextButton.evaluate(el => {
            const style = window.getComputedStyle(el);
            return !el.disabled && 
                   style.display !== 'none' && 
                   style.visibility !== 'hidden';
          });

          if (!isClickable) {
            this.logger.info('下一页按钮不可点击，分页结束');
            break;
          }

          // 点击下一页
          await nextButton.click();
          await page.waitForTimeout(waitAfterClick);
          
          // 等待页面加载
          await page.waitForLoadState('networkidle');

        } catch (error) {
          this.logger.warn(`第 ${currentPage} 页导航失败:`, error.message);
          break;
        }
      }

      currentPage++;
    }

    return { data: allResults, totalElements };
  }

  /**
   * 根据选择器提取内容
   * @param {Object} page - Puppeteer页面对象
   * @param {string} selector - 选择器
   * @param {Object} options - 提取选项
   * @returns {Promise<Object>} 提取结果
   */
  async extractBySelector(page, selector, options) {
    const {
      selectorType = 'auto',
      extractType = 'text',
      attributes = [],
      multiple = false,
      waitForElements = true,
      timeout = 10000,
      includeMetadata = false,
      textOptions = {}
    } = options;

    // 确定选择器类型
    const finalSelectorType = selectorType === 'auto' 
      ? detectSelectorType(selector) 
      : selectorType;

    // 使用现代 Locator API 等待和查找元素
    let elements = [];
    try {
      let locator;
      
      if (finalSelectorType === 'xpath') {
        // XPath 选择器：使用 ::-p-xpath() 语法
        locator = page.locator(`::-p-xpath(${selector})`);
      } else {
        // CSS 选择器
        locator = page.locator(selector);
      }

      // 配置 Locator：对于内容提取，我们不需要严格的可见性检查
      // 因为我们可能需要提取隐藏元素或不在视口中的元素
      locator = locator
        .setVisibility(null)  // 不检查可见性
        .setWaitForEnabled(false)  // 不等待启用状态
        .setWaitForStableBoundingBox(false)  // 不等待稳定边界框
        .setEnsureElementIsInTheViewport(false);  // 不确保在视口中

      // 等待元素出现（如果需要）
      if (waitForElements) {
        try {
          await locator.waitFor({ timeout });
        } catch (error) {
          this.logger.warn(`等待元素超时: ${selector}`, error.message);
          // 继续执行，不抛出错误
        }
      }

      // 获取所有匹配的元素
      let elementHandles = [];
      if (multiple) {
        // 对于多个元素，使用传统API
        if (finalSelectorType === 'xpath') {
          elementHandles = await page.$$(`xpath/${selector}`);
        } else {
          elementHandles = await page.$$(selector);
        }
      } else {
        // 对于单个元素，使用Locator API
        try {
          const elementHandle = await locator.waitHandle();
          if (elementHandle) {
            elementHandles = [elementHandle];
          }
        } catch (error) {
          this.logger.warn(`Locator获取元素失败: ${selector}`, error.message);
          // 回退到传统API
          try {
            if (finalSelectorType === 'xpath') {
              const element = await page.$(`xpath/${selector}`);
              if (element) elementHandles = [element];
            } else {
              const element = await page.$(selector);
              if (element) elementHandles = [element];
            }
          } catch (fallbackError) {
            this.logger.warn(`传统API也失败: ${selector}`, fallbackError.message);
          }
        }
      }
      elements = elementHandles;

    } catch (error) {
      this.logger.warn(`查找元素失败: ${selector}`, error.message);
      elements = [];
    }

    if (elements.length === 0) {
      return {
        success: false,
        selector,
        elements: [],
        error: '未找到匹配的元素'
      };
    }

    // 提取内容
    const extractedElements = [];
    const elementsToProcess = multiple ? elements : [elements[0]];

    for (let i = 0; i < elementsToProcess.length; i++) {
      const element = elementsToProcess[i];
      const elementData = await this.extractElementData(
        element, extractType, attributes, textOptions, includeMetadata
      );
      elementData.index = i;
      extractedElements.push(elementData);
    }

    return {
      success: true,
      selector,
      selectorType: finalSelectorType,
      elements: extractedElements,
      count: extractedElements.length
    };
  }

  /**
   * 提取单个元素的数据
   * @param {Object} element - 元素对象
   * @param {string} extractType - 提取类型
   * @param {Array} attributes - 属性列表
   * @param {Object} textOptions - 文本选项
   * @param {boolean} includeMetadata - 是否包含元数据
   * @returns {Promise<Object>} 元素数据
   */
  async extractElementData(element, extractType, attributes, textOptions, includeMetadata) {
    const data = {};

    try {
      // 执行提取
      const extractedData = await element.evaluate((el, options) => {
        const { extractType, attributes, textOptions } = options;
        const result = {};

        // 提取文本
        if (extractType === 'text' || extractType === 'all') {
          let text = textOptions.includeHidden ? 
            el.textContent : 
            el.innerText || el.textContent;

          if (text && textOptions.trim) {
            text = text.trim();
          }

          if (text && textOptions.normalizeWhitespace) {
            text = text.replace(/\s+/g, ' ');
          }

          result.text = text || '';
        }

        // 提取HTML
        if (extractType === 'html' || extractType === 'all') {
          result.html = el.outerHTML;
          result.innerHTML = el.innerHTML;
        }

        // 提取属性
        if (extractType === 'attributes' || extractType === 'all' || attributes.length > 0) {
          result.attributes = {};
          
          if (attributes.length > 0) {
            // 提取指定属性
            for (const attr of attributes) {
              result.attributes[attr] = el.getAttribute(attr);
            }
          } else {
            // 提取所有属性
            for (const attr of el.attributes) {
              result.attributes[attr.name] = attr.value;
            }
          }
        }

        return result;
      }, { extractType, attributes, textOptions });

      Object.assign(data, extractedData);

      // 添加元数据
      if (includeMetadata) {
        const metadata = await element.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(el);
          
          return {
            tagName: el.tagName.toLowerCase(),
            id: el.id,
            className: el.className,
            bounds: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            },
            visible: rect.width > 0 && rect.height > 0 && 
                    computedStyle.visibility !== 'hidden' && 
                    computedStyle.display !== 'none',
            computedStyle: {
              display: computedStyle.display,
              visibility: computedStyle.visibility,
              position: computedStyle.position,
              zIndex: computedStyle.zIndex
            }
          };
        });

        data.metadata = metadata;
      }

    } catch (error) {
      this.logger.warn('提取元素数据失败:', error.message);
      data.error = error.message;
    }

    return data;
  }

  /**
   * 标准化选择器
   * @param {*} selectors - 选择器输入
   * @returns {Array<string>} 选择器数组
   */
  normalizeSelectors(selectors) {
    if (typeof selectors === 'string') {
      return [selectors];
    }
    if (Array.isArray(selectors)) {
      return selectors;
    }
    if (typeof selectors === 'object') {
      return Object.values(selectors);
    }
    return [];
  }

  /**
   * 解析选择器为键值对
   * @param {*} selectors - 选择器输入
   * @returns {Object} 选择器键值对
   */
  parseSelectors(selectors) {
    if (typeof selectors === 'string') {
      return { main: selectors };
    }
    if (Array.isArray(selectors)) {
      const result = {};
      selectors.forEach((selector, index) => {
        result[`selector_${index}`] = selector;
      });
      return result;
    }
    if (typeof selectors === 'object') {
      return selectors;
    }
    return {};
  }

  /**
   * 获取页面信息
   * @param {Object} page - Puppeteer页面对象
   * @returns {Promise<Object>} 页面信息
   */
  async getPageInfo(page) {
    try {
      return await page.evaluate(() => ({
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      return {
        url: 'unknown',
        title: 'unknown',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 获取工具使用提示
   * @returns {string} 使用提示
   */
  getUsageHint() {
    return `
内容提取工具使用说明:
- selectors: 必需，选择器（字符串、数组或对象）
- selectorType: 可选，选择器类型 (css/xpath/auto，默认auto)
- extractType: 可选，提取类型 (text/html/attributes/all，默认text)
- attributes: 可选，要提取的属性列表
- multiple: 可选，是否提取所有匹配元素（默认false）
- waitForElements: 可选，是否等待元素出现（默认true）
- timeout: 可选，超时时间1-60秒（默认10秒）
- includeMetadata: 可选，是否包含元素元数据（默认false）
- textOptions: 可选，文本提取选项
- pagination: 可选，分页提取设置

示例:
{
  "selectors": ".product-title",
  "multiple": true,
  "extractType": "text"
}

{
  "selectors": {
    "title": "h1",
    "price": ".price",
    "description": ".description"
  },
  "extractType": "all"
}

{
  "selectors": ["//h1", "//p[@class='content']"],
  "selectorType": "xpath",
  "pagination": {
    "enabled": true,
    "nextButtonSelector": ".next-page",
    "maxPages": 3
  }
}
    `.trim();
  }
}

export default ExtractTool;
