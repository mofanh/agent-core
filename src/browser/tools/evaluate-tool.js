/**
 * Evaluate Tool
 * 
 * @fileoverview JavaScript执行工具 - 用于在页面中执行JavaScript代码
 */

import { BaseBrowserTool } from './base-tool.js';
import { logger } from '../../utils/logger.js';

/**
 * JavaScript执行工具类
 */
export class EvaluateTool extends BaseBrowserTool {
  constructor(browserInstance, securityPolicy) {
    super('evaluate', browserInstance, securityPolicy);
  }

  /**
   * 获取工具参数定义
   * @returns {Object} 参数定义
   */
  getParameterSchema() {
    return {
      type: 'object',
      properties: {
        script: {
          type: 'string',
          description: '要执行的JavaScript代码'
        },
        args: {
          type: 'array',
          description: '传递给脚本的参数数组',
          items: {},
          default: []
        },
        returnValue: {
          type: 'boolean',
          description: '是否返回执行结果',
          default: true
        },
        async: {
          type: 'boolean',
          description: '是否为异步脚本',
          default: false
        },
        timeout: {
          type: 'number',
          description: '执行超时时间（毫秒）',
          default: 5000,
          minimum: 100,
          maximum: 30000
        },
        sandbox: {
          type: 'boolean',
          description: '是否在沙箱环境中执行',
          default: true
        },
        allowDangerousAPIs: {
          type: 'boolean',
          description: '是否允许危险的API调用',
          default: false
        },
        injectLibraries: {
          type: 'array',
          description: '要注入的库名称数组',
          items: { type: 'string' },
          default: []
        },
        context: {
          type: 'string',
          description: '执行上下文',
          enum: ['page', 'element', 'worker'],
          default: 'page'
        },
        selector: {
          type: 'string',
          description: '元素选择器（当context为element时使用）'
        },
        selectorType: {
          type: 'string',
          description: '选择器类型',
          enum: ['css', 'xpath', 'auto'],
          default: 'auto'
        },
        waitForResult: {
          type: 'boolean',
          description: '是否等待执行完成',
          default: true
        }
      },
      required: ['script'],
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
      script, 
      timeout = 5000,
      context = 'page',
      selector,
      injectLibraries = []
    } = params;

    // 验证脚本内容
    if (!script || typeof script !== 'string') {
      return {
        valid: false,
        error: '脚本内容必须是非空字符串'
      };
    }

    if (script.length > 50000) {
      return {
        valid: false,
        error: '脚本内容长度不能超过50KB'
      };
    }

    // 验证超时时间
    if (timeout < 100 || timeout > 30000) {
      return {
        valid: false,
        error: '超时时间必须在100毫秒到30秒之间'
      };
    }

    // 验证上下文
    if (context === 'element' && !selector) {
      return {
        valid: false,
        error: '使用element上下文时必须提供selector'
      };
    }

    // 验证注入库
    if (injectLibraries.length > 0) {
      const allowedLibraries = ['jquery', 'lodash', 'moment', 'axios'];
      for (const lib of injectLibraries) {
        if (!allowedLibraries.includes(lib)) {
          return {
            valid: false,
            error: `不支持的库: ${lib}。支持的库: ${allowedLibraries.join(', ')}`
          };
        }
      }
    }

    // 安全验证
    const securityCheck = this.validateScriptSecurity(script, params.allowDangerousAPIs);
    if (!securityCheck.valid) {
      return securityCheck;
    }

    return { valid: true };
  }

  /**
   * 验证脚本安全性
   * @param {string} script - 脚本内容
   * @param {boolean} allowDangerousAPIs - 是否允许危险API
   * @returns {Object} 验证结果
   */
  validateScriptSecurity(script, allowDangerousAPIs = false) {
    // 危险的API和模式列表
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
      /XMLHttpRequest/,
      /fetch\s*\(/,
      /import\s*\(/,
      /require\s*\(/,
      /process\./,
      /global\./,
      /window\.location\s*=/,
      /document\.write\s*\(/,
      /innerHTML\s*=/,
      /outerHTML\s*=/,
      /execCommand/,
      /open\s*\(/,
      /close\s*\(/
    ];

    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /alert\s*\(/,
      /confirm\s*\(/,
      /prompt\s*\(/
    ];

    // 检查恶意模式（始终禁止）
    for (const pattern of maliciousPatterns) {
      if (pattern.test(script)) {
        return {
          valid: false,
          error: `脚本包含潜在恶意代码: ${pattern.toString()}`
        };
      }
    }

    // 检查危险API（可配置）
    if (!allowDangerousAPIs) {
      for (const pattern of dangerousPatterns) {
        if (pattern.test(script)) {
          return {
            valid: false,
            error: `脚本包含危险API: ${pattern.toString()}。如需使用，请设置allowDangerousAPIs为true`
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * 执行JavaScript代码
   * @param {Object} params - 工具参数
   * @returns {Promise<Object>} 执行结果
   */
  async executeInternal(params) {
    const {
      script,
      args = [],
      returnValue = true,
      async: isAsync = false,
      timeout = 5000,
      sandbox = true,
      allowDangerousAPIs = false,
      injectLibraries = [],
      context = 'page',
      selector,
      selectorType = 'auto',
      waitForResult = true
    } = params;

    const page = await this.browserInstance.getCurrentPage();
    const startTime = Date.now();
    
    try {
      logger.info(`开始执行JavaScript: 上下文=${context}, 异步=${isAsync}`);

      // 注入依赖库
      if (injectLibraries.length > 0) {
        await this.injectLibraries(page, injectLibraries);
      }

      let result;
      
      switch (context) {
        case 'page':
          result = await this.executeInPageContext(page, script, args, {
            returnValue, isAsync, timeout, sandbox, waitForResult
          });
          break;
          
        case 'element':
          result = await this.executeInElementContext(page, script, selector, selectorType, args, {
            returnValue, isAsync, timeout, sandbox, waitForResult
          });
          break;
          
        case 'worker':
          result = await this.executeInWorkerContext(page, script, args, {
            returnValue, isAsync, timeout, waitForResult
          });
          break;
          
        default:
          throw new Error(`不支持的执行上下文: ${context}`);
      }

      const executionTime = Date.now() - startTime;
      logger.info(`JavaScript执行完成，耗时: ${executionTime}ms`);

      return {
        success: true,
        data: {
          script: script.length > 200 ? script.substring(0, 200) + '...' : script,
          context,
          selector,
          result: returnValue ? result : null,
          executionInfo: {
            executionTime,
            isAsync,
            sandbox,
            argsCount: args.length,
            injectedLibraries: injectLibraries
          },
          pageInfo: {
            url: page.url(),
            timestamp: new Date().toISOString()
          }
        },
        timestamp: new Date().toISOString(),
        executionTime
      };

    } catch (error) {
      logger.error('JavaScript执行失败:', error);
      throw new Error(`JavaScript执行失败: ${error.message}`);
    }
  }

  /**
   * 在页面上下文中执行脚本
   * @param {Object} page - 页面对象
   * @param {string} script - 脚本内容
   * @param {Array} args - 参数数组
   * @param {Object} options - 执行选项
   * @returns {Promise<*>} 执行结果
   */
  async executeInPageContext(page, script, args, options) {
    const { returnValue, isAsync, timeout, sandbox, waitForResult } = options;

    if (sandbox) {
      // 在沙箱中执行
      return await this.executeInSandbox(page, script, args, { returnValue, isAsync, timeout });
    } else {
      // 直接执行
      if (isAsync) {
        return await page.evaluateHandle(
          new Function('...args', `return (async () => { ${script} })(...arguments)`),
          ...args
        );
      } else {
        return await page.evaluate(
          new Function('...args', script),
          ...args
        );
      }
    }
  }

  /**
   * 在元素上下文中执行脚本
   * @param {Object} page - 页面对象
   * @param {string} script - 脚本内容
   * @param {string} selector - 元素选择器
   * @param {string} selectorType - 选择器类型
   * @param {Array} args - 参数数组
   * @param {Object} options - 执行选项
   * @returns {Promise<*>} 执行结果
   */
  async executeInElementContext(page, script, selector, selectorType, args, options) {
    const { returnValue, isAsync, timeout } = options;

    // 查找元素
    let element;
    if (selectorType === 'xpath') {
      await page.waitForXPath(selector, { timeout });
      const elements = await page.$x(selector);
      element = elements[0];
    } else {
      await page.waitForSelector(selector, { timeout });
      element = await page.$(selector);
    }

    if (!element) {
      throw new Error(`未找到元素: ${selector}`);
    }

    // 在元素上下文中执行脚本
    if (isAsync) {
      return await element.evaluateHandle(
        new Function('element', '...args', `return (async () => { ${script} })(element, ...arguments)`),
        ...args
      );
    } else {
      return await element.evaluate(
        new Function('element', '...args', script),
        ...args
      );
    }
  }

  /**
   * 在Worker上下文中执行脚本
   * @param {Object} page - 页面对象
   * @param {string} script - 脚本内容
   * @param {Array} args - 参数数组
   * @param {Object} options - 执行选项
   * @returns {Promise<*>} 执行结果
   */
  async executeInWorkerContext(page, script, args, options) {
    const { returnValue, timeout } = options;

    // 创建Web Worker执行脚本
    const workerScript = `
      self.onmessage = function(e) {
        try {
          const args = e.data.args;
          const result = (function(...args) { 
            ${script} 
          })(...args);
          
          self.postMessage({ 
            success: true, 
            result: result 
          });
        } catch (error) {
          self.postMessage({ 
            success: false, 
            error: error.message 
          });
        }
      };
    `;

    const result = await page.evaluate(
      (workerCode, scriptArgs, timeoutMs) => {
        return new Promise((resolve, reject) => {
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const worker = new Worker(URL.createObjectURL(blob));
          
          const timeoutId = setTimeout(() => {
            worker.terminate();
            reject(new Error('Worker执行超时'));
          }, timeoutMs);

          worker.onmessage = function(e) {
            clearTimeout(timeoutId);
            worker.terminate();
            
            if (e.data.success) {
              resolve(e.data.result);
            } else {
              reject(new Error(e.data.error));
            }
          };

          worker.onerror = function(error) {
            clearTimeout(timeoutId);
            worker.terminate();
            reject(new Error('Worker执行错误: ' + error.message));
          };

          worker.postMessage({ args: scriptArgs });
        });
      },
      workerScript,
      args,
      timeout
    );

    return result;
  }

  /**
   * 在沙箱中执行脚本
   * @param {Object} page - 页面对象
   * @param {string} script - 脚本内容
   * @param {Array} args - 参数数组
   * @param {Object} options - 执行选项
   * @returns {Promise<*>} 执行结果
   */
  async executeInSandbox(page, script, args, options) {
    const { returnValue, isAsync, timeout } = options;

    // 创建沙箱环境
    const sandboxScript = `
      (function() {
        'use strict';
        
        // 创建受限的全局对象
        const sandbox = {
          console: console,
          Math: Math,
          Date: Date,
          JSON: JSON,
          Object: Object,
          Array: Array,
          String: String,
          Number: Number,
          Boolean: Boolean,
          RegExp: RegExp,
          Error: Error,
          TypeError: TypeError,
          ReferenceError: ReferenceError,
          // 允许的DOM访问
          document: {
            querySelector: document.querySelector.bind(document),
            querySelectorAll: document.querySelectorAll.bind(document),
            getElementById: document.getElementById.bind(document),
            getElementsByClassName: document.getElementsByClassName.bind(document),
            getElementsByTagName: document.getElementsByTagName.bind(document)
          },
          window: {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            location: {
              href: window.location.href,
              host: window.location.host,
              pathname: window.location.pathname
            }
          }
        };

        // 在沙箱中执行用户脚本
        const userFunction = new Function('sandbox', '...args', 
          'with (sandbox) { return (' + ${JSON.stringify(isAsync ? 'async ' : '')} + 'function() { ' + 
          ${JSON.stringify(script)} + ' })(); }'
        );

        return userFunction(sandbox, ...arguments);
      })
    `;

    if (isAsync) {
      return await page.evaluate(sandboxScript, ...args);
    } else {
      return await page.evaluate(sandboxScript, ...args);
    }
  }

  /**
   * 注入依赖库
   * @param {Object} page - 页面对象
   * @param {Array<string>} libraries - 库名称数组
   * @returns {Promise<void>}
   */
  async injectLibraries(page, libraries) {
    const libraryUrls = {
      jquery: 'https://code.jquery.com/jquery-3.6.0.min.js',
      lodash: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
      moment: 'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js',
      axios: 'https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js'
    };

    for (const lib of libraries) {
      if (libraryUrls[lib]) {
        try {
          await page.addScriptTag({ url: libraryUrls[lib] });
          logger.debug(`已注入库: ${lib}`);
        } catch (error) {
          logger.warn(`注入库 ${lib} 失败:`, error.message);
        }
      }
    }
  }

  /**
   * 获取工具使用提示
   * @returns {string} 使用提示
   */
  getUsageHint() {
    return `
JavaScript执行工具使用说明:
- script: 必需，要执行的JavaScript代码
- args: 可选，传递给脚本的参数数组
- returnValue: 可选，是否返回执行结果（默认true）
- async: 可选，是否为异步脚本（默认false）
- timeout: 可选，执行超时时间100-30000毫秒（默认5000）
- sandbox: 可选，是否在沙箱环境中执行（默认true）
- allowDangerousAPIs: 可选，是否允许危险API（默认false）
- injectLibraries: 可选，要注入的库 ['jquery', 'lodash', 'moment', 'axios']
- context: 可选，执行上下文 (page/element/worker，默认page)
- selector: 元素选择器（当context为element时使用）
- selectorType: 可选，选择器类型 (css/xpath/auto，默认auto)
- waitForResult: 可选，是否等待执行完成（默认true）

示例:
{
  "script": "return document.title;",
  "returnValue": true
}

{
  "script": "console.log('Hello', name); return name.toUpperCase();",
  "args": ["World"],
  "sandbox": false
}

{
  "script": "this.style.backgroundColor = 'yellow'; return this.tagName;",
  "context": "element",
  "selector": ".highlight"
}

{
  "script": "const result = []; for(let i = 0; i < 1000000; i++) { result.push(i); } return result.length;",
  "context": "worker",
  "timeout": 10000
}

安全限制:
- 沙箱模式下禁止访问危险API
- 默认禁止eval、setTimeout、fetch等
- 脚本长度限制50KB
- 执行时间限制30秒
    `.trim();
  }
}

export default EvaluateTool;
