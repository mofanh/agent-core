/**
 * 统一浏览器工具 MCP 服务器
 * 将所有浏览器操作（本地 + MCP）统一为 MCP 工具接口
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { BrowserToolManager } from '../browser/tool-manager.js';
import Logger from '../utils/logger.js';

/**
 * 统一浏览器 MCP 服务器类
 */
export class UnifiedBrowserMCPServer {
  constructor(config = {}) {
    this.config = {
      browser: {
        enabled: true,
        headless: false,
        viewport: { width: 1280, height: 800 },
        security: {
          level: 'normal',
          enableAuditLog: true
        },
        ...config.browser
      }
    };
    
    this.logger = new Logger('info');
    this.server = new Server({
      name: 'unified-browser-tools',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });
    
    this.browserToolManager = null;
    this.initialized = false;
  }

  /**
   * 启动服务器
   */
  async start() {
    try {
      // 初始化浏览器工具管理器
      await this.initializeBrowserTools();
      
      // 设置 MCP 处理器
      this.setupHandlers();
      
      // 启动 MCP 服务器
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      this.initialized = true;
      this.logger.info('🚀 统一浏览器 MCP 服务器启动成功');
      
    } catch (error) {
      this.logger.error('❌ 服务器启动失败:', error);
      throw error;
    }
  }

  /**
   * 初始化浏览器工具
   */
  async initializeBrowserTools() {
    this.browserToolManager = new BrowserToolManager(this.config.browser);
    
    // 监听浏览器工具事件
    this.browserToolManager.on('initialized', () => {
      this.logger.info('✅ 浏览器工具管理器初始化完成');
    });
    
    this.browserToolManager.on('toolExecuted', (event) => {
      this.logger.info(`🔧 工具执行完成: ${event.toolName}`);
    });
    
    this.logger.info('🌐 浏览器工具管理器初始化完成');
  }

  /**
   * 设置 MCP 处理器
   */
  setupHandlers() {
    // 工具列表处理器
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [
        // 浏览器导航工具
        {
          name: 'browser_navigate',
          description: '导航到指定URL',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: '要导航到的URL'
              },
              waitUntil: {
                type: 'string',
                description: '等待条件',
                enum: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
                default: 'networkidle2'
              },
              timeout: {
                type: 'number',
                description: '超时时间（毫秒）',
                default: 30000
              }
            },
            required: ['url']
          }
        },
        
        // 页面内容提取工具
        {
          name: 'browser_extract',
          description: '从页面提取内容',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS选择器或XPath'
              },
              selectorType: {
                type: 'string',
                description: '选择器类型',
                enum: ['css', 'xpath', 'auto'],
                default: 'auto'
              },
              attribute: {
                type: 'string',
                description: '要提取的属性',
                default: 'text'
              },
              multiple: {
                type: 'boolean',
                description: '是否提取多个元素',
                default: false
              },
              timeout: {
                type: 'number',
                description: '超时时间（毫秒）',
                default: 10000
              }
            },
            required: ['selector']
          }
        },
        
        // 点击操作工具
        {
          name: 'browser_click',
          description: '点击页面元素',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS选择器或XPath'
              },
              selectorType: {
                type: 'string',
                description: '选择器类型',
                enum: ['css', 'xpath', 'auto'],
                default: 'auto'
              },
              index: {
                type: 'number',
                description: '元素索引（多个匹配时）',
                default: 0
              },
              timeout: {
                type: 'number',
                description: '超时时间（毫秒）',
                default: 10000
              }
            },
            required: ['selector']
          }
        },
        
        // 悬停操作工具
        {
          name: 'browser_hover',
          description: '悬停在页面元素上',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS选择器或XPath'
              },
              selectorType: {
                type: 'string',
                description: '选择器类型',
                enum: ['css', 'xpath', 'auto'],
                default: 'auto'
              },
              index: {
                type: 'number',
                description: '元素索引（多个匹配时）',
                default: 0
              },
              timeout: {
                type: 'number',
                description: '超时时间（毫秒）',
                default: 10000
              }
            },
            required: ['selector']
          }
        },
        
        // 文本输入工具
        {
          name: 'browser_type',
          description: '在输入框中输入文本',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS选择器或XPath'
              },
              text: {
                type: 'string',
                description: '要输入的文本'
              },
              selectorType: {
                type: 'string',
                description: '选择器类型',
                enum: ['css', 'xpath', 'auto'],
                default: 'auto'
              },
              clear: {
                type: 'boolean',
                description: '输入前是否清空',
                default: true
              },
              delay: {
                type: 'number',
                description: '输入延迟（毫秒）',
                default: 0
              },
              timeout: {
                type: 'number',
                description: '超时时间（毫秒）',
                default: 10000
              }
            },
            required: ['selector', 'text']
          }
        },
        
        // 截图工具
        {
          name: 'browser_screenshot',
          description: '截取页面截图',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: '元素选择器（可选，截取特定元素）'
              },
              format: {
                type: 'string',
                description: '图片格式',
                enum: ['png', 'jpeg'],
                default: 'png'
              },
              quality: {
                type: 'number',
                description: '图片质量（1-100）',
                default: 90
              },
              fullPage: {
                type: 'boolean',
                description: '是否截取整页',
                default: false
              }
            }
          }
        },
        
        // JavaScript 执行工具
        {
          name: 'browser_evaluate',
          description: '在页面中执行JavaScript代码',
          inputSchema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: '要执行的JavaScript代码'
              },
              timeout: {
                type: 'number',
                description: '执行超时时间（毫秒）',
                default: 30000
              }
            },
            required: ['code']
          }
        },
        
        // 获取页面信息工具
        {
          name: 'browser_get_page_info',
          description: '获取当前页面信息',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        
        // 等待元素工具
        {
          name: 'browser_wait_for',
          description: '等待页面元素出现或条件满足',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS选择器或XPath'
              },
              selectorType: {
                type: 'string',
                description: '选择器类型',
                enum: ['css', 'xpath', 'auto'],
                default: 'auto'
              },
              state: {
                type: 'string',
                description: '等待状态',
                enum: ['attached', 'detached', 'visible', 'hidden'],
                default: 'visible'
              },
              timeout: {
                type: 'number',
                description: '超时时间（毫秒）',
                default: 30000
              }
            },
            required: ['selector']
          }
        }
      ];
      
      return { tools };
    });

    // 工具调用处理器
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        // 确保浏览器工具系统已初始化
        if (!this.browserToolManager) {
          await this.initializeBrowserTools();
        }

        let result;
        const callId = `unified-mcp-${Date.now()}`;
        
        // 将 MCP 工具名映射到内部工具名
        const toolNameMap = {
          'browser_navigate': 'browser.navigate',
          'browser_extract': 'browser.extract', 
          'browser_click': 'browser.click',
          'browser_hover': 'browser.hover',
          'browser_type': 'browser.type',
          'browser_screenshot': 'browser.screenshot',
          'browser_evaluate': 'browser.evaluate',
          'browser_get_page_info': 'browser.getPageInfo',
          'browser_wait_for': 'browser.waitFor'
        };
        
        const internalToolName = toolNameMap[name];
        
        if (!internalToolName) {
          throw new Error(`未知的工具: ${name}`);
        }

        // 执行工具
        if (this.browserToolManager.isToolAvailable(internalToolName)) {
          result = await this.browserToolManager.executeLocalTool(internalToolName, args, callId);
        } else {
          throw new Error(`工具不可用: ${internalToolName}`);
        }

        // 返回统一格式的结果
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: result,
                toolName: name,
                callId,
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
        
      } catch (error) {
        this.logger.error(`工具调用失败 [${name}]:`, error);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack,
                toolName: name,
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }

  /**
   * 停止服务器
   */
  async stop() {
    if (this.browserToolManager) {
      await this.browserToolManager.cleanup();
    }
    
    this.initialized = false;
    this.logger.info('🔚 统一浏览器 MCP 服务器已停止');
  }
}

/**
 * 启动统一浏览器 MCP 服务器
 */
export async function startUnifiedBrowserMCPServer(config = {}) {
  const server = new UnifiedBrowserMCPServer(config);
  
  // 监听进程退出事件
  process.on('SIGINT', async () => {
    console.log('\n🔚 收到退出信号，正在关闭服务器...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🔚 收到终止信号，正在关闭服务器...');
    await server.stop();
    process.exit(0);
  });

  await server.start();
  return server;
}

/**
 * 创建统一浏览器 MCP 服务器
 */
export function createUnifiedBrowserMCPServer(config = {}) {
  return new UnifiedBrowserMCPServer(config);
}

export default UnifiedBrowserMCPServer;
