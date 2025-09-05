/**
 * Browser Module 主入口
 * 
 * @fileoverview 提供浏览器自动化工具支持，参考 codex-rs 本地工具设计
 */

// 导入核心类
import { BrowserToolManager } from './tool-manager.js';
import { BrowserInstance } from './browser-instance.js';
import { BrowserSecurityPolicy } from './security/sandbox-policy.js';
import { BrowserInstancePool } from './instance-pool.js';
import { BrowserToolMonitor } from './monitor.js';
import { BrowserToolChain } from './tool-chain.js';

// 导入工具类
import { NavigateTool } from './tools/navigate.js';
import { ClickTool } from './tools/click.js';
import { ExtractTool } from './tools/extract.js';
import { TypeTool } from './tools/type.js';
import { ScreenshotTool } from './tools/screenshot.js';
import { EvaluateTool } from './tools/evaluate.js';

// 导出工具类
export { BaseBrowserTool } from './tools/base-tool.js';
export { NavigateTool } from './tools/navigate-tool.js';
export { ClickTool } from './tools/click-tool.js';
export { ExtractTool } from './tools/extract-tool.js';
export { TypeTool } from './tools/type-tool.js';
export { ScreenshotTool } from './tools/screenshot-tool.js';
export { EvaluateTool } from './tools/evaluate-tool.js';

// 导出工具管理器和实例
export { BrowserToolManager } from './tool-manager.js';
export { BrowserInstance } from './browser-instance.js';
export { BrowserSecurityPolicy } from './security/sandbox-policy.js';

// 导出 Week 3 新增功能
export { BrowserInstancePool } from './instance-pool.js';
export { BrowserToolMonitor } from './monitor.js';
export { BrowserToolChain } from './tool-chain.js';

// 导出 Week 4 安全功能
export {
  BrowserSecurityManager,
  createBrowserSecurityManager,
  SECURITY_LEVELS,
  RISK_LEVELS,
  DEFAULT_SECURITY_CONFIG
} from './security.js';

// 导出工具函数
export * from './utils/selector-utils.js';

// 导出工具类
export {
  NavigateTool,
  ClickTool,
  ExtractTool,
  TypeTool,
  ScreenshotTool,
  EvaluateTool
};

// 浏览器工具常量定义（参考 codex 的本地工具命名）
export const BROWSER_TOOLS = {
  NAVIGATE: 'browser.navigate',
  CLICK: 'browser.click',
  EXTRACT: 'browser.extract',
  TYPE: 'browser.type',
  SCREENSHOT: 'browser.screenshot',
  EVALUATE: 'browser.evaluate'
};

// 浏览器引擎类型
export const BROWSER_ENGINES = {
  PUPPETEER: 'puppeteer',
  PLAYWRIGHT: 'playwright'
};

// 工具执行状态
export const TOOL_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
  TIMEOUT: 'timeout'
};

/**
 * 创建浏览器工具管理器
 * @param {Object} config - 配置选项
 * @returns {BrowserToolManager} 浏览器工具管理器实例
 */
export function createBrowserToolManager(config) {
  return new BrowserToolManager(config);
}

/**
 * 获取支持的工具列表
 * @returns {Array} 工具定义列表
 */
export function getSupportedTools() {
  return [
    {
      name: BROWSER_TOOLS.NAVIGATE,
      description: 'Navigate to a web page and optionally wait for specific elements',
      parameters: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Target URL to navigate to' },
          waitFor: { type: 'string', description: 'CSS selector to wait for (optional)' },
          timeout: { type: 'number', description: 'Timeout in milliseconds', default: 30000 },
          viewport: { 
            type: 'object', 
            description: 'Viewport configuration',
            properties: {
              width: { type: 'number', default: 1920 },
              height: { type: 'number', default: 1080 }
            }
          }
        },
        required: ['url']
      }
    },
    {
      name: BROWSER_TOOLS.CLICK,
      description: 'Click on an element specified by selector',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector or XPath' },
          waitForSelector: { type: 'boolean', description: 'Wait for element to appear', default: true },
          timeout: { type: 'number', description: 'Timeout in milliseconds', default: 30000 },
          button: { type: 'string', description: 'Mouse button', enum: ['left', 'right', 'middle'], default: 'left' }
        },
        required: ['selector']
      }
    },
    {
      name: BROWSER_TOOLS.EXTRACT,
      description: 'Extract content from the current page',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector for content extraction' },
          attribute: { type: 'string', description: 'Attribute to extract', default: 'text' },
          multiple: { type: 'boolean', description: 'Extract multiple elements', default: false },
          format: { type: 'string', description: 'Output format', enum: ['text', 'json', 'html'], default: 'text' }
        },
        required: ['selector']
      }
    },
    {
      name: BROWSER_TOOLS.TYPE,
      description: 'Type text into an input element',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'Input element selector' },
          text: { type: 'string', description: 'Text to type' },
          clear: { type: 'boolean', description: 'Clear input before typing', default: true },
          delay: { type: 'number', description: 'Typing delay in milliseconds', default: 0 }
        },
        required: ['selector', 'text']
      }
    },
    {
      name: BROWSER_TOOLS.SCREENSHOT,
      description: 'Take a screenshot of the current page or specific element',
      parameters: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'Element selector (optional, defaults to full page)' },
          format: { type: 'string', description: 'Image format', enum: ['png', 'jpeg'], default: 'png' },
          quality: { type: 'number', description: 'Image quality (1-100)', default: 90 },
          fullPage: { type: 'boolean', description: 'Capture full page', default: true }
        }
      }
    },
    {
      name: BROWSER_TOOLS.EVALUATE,
      description: 'Execute JavaScript code in the browser context',
      parameters: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'JavaScript code to execute' },
          args: { type: 'array', description: 'Arguments to pass to the code', default: [] },
          timeout: { type: 'number', description: 'Execution timeout in milliseconds', default: 30000 },
          returnType: { type: 'string', description: 'Return value type', enum: ['json', 'text', 'binary'], default: 'json' }
        },
        required: ['code']
      }
    }
  ];
}

/**
 * 创建浏览器实例池
 * @param {Object} config - 配置选项
 * @returns {BrowserInstancePool} 浏览器实例池
 */
export function createBrowserInstancePool(config) {
  return new BrowserInstancePool(config);
}

/**
 * 创建浏览器工具监控器
 * @param {Object} config - 配置选项
 * @returns {BrowserToolMonitor} 浏览器工具监控器
 */
export function createBrowserToolMonitor(config) {
  return new BrowserToolMonitor(config);
}

/**
 * 创建浏览器工具链
 * @param {BrowserToolManager} toolManager - 工具管理器
 * @param {Object} config - 配置选项
 * @returns {BrowserToolChain} 浏览器工具链
 */
export function createBrowserToolChain(toolManager, config) {
  return new BrowserToolChain(toolManager, config);
}

/**
 * 创建完整的浏览器工具系统
 * @param {Object} config - 配置选项
 * @returns {Object} 完整的浏览器工具系统
 */
export function createBrowserToolSystem(config = {}) {
  const toolManager = new BrowserToolManager(config);
  const toolChain = new BrowserToolChain(toolManager, config.toolChain);
  
  return {
    toolManager,
    toolChain,
    instancePool: toolManager.instancePool,
    monitor: toolManager.monitor,
    async initialize() {
      await toolManager.initialize();
    },
    async cleanup() {
      await toolManager.cleanup();
    },
    getStats() {
      return {
        toolManager: toolManager.getMetrics(),
        toolChain: toolChain.getStats()
      };
    }
  };
}
