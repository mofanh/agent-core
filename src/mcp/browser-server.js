/**
 * MCP 浏览器服务器 - 基于 @modelcontextprotocol/sdk
 * 
 * 提供浏览器自动化功能的 MCP 服务
 * 支持页面导航、内容提取、元素交互、截图等功能
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createBrowserToolSystem } from '../browser/index.js';

/**
 * MCP 浏览器服务器类
 */
export class MCPBrowserServer {
  constructor(config = {}) {
    this.config = {
      headless: false,
      devtools: true,
      timeout: 30000,
      browser: {
        engine: 'puppeteer',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      },
      security: {
        securityLevel: 'relaxed',
        allowedDomains: ['*'],
        blockedDomains: [],
        enableSandbox: false,
        auditLog: false
      },
      ...config
    };
    
    this.server = new Server(
      {
        name: 'browser-automation-server',
        version: '1.0.0',
        description: '浏览器自动化 MCP 服务器，支持页面导航、内容提取、元素交互等功能'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
    
    this.toolSystem = null;
    this.setupHandlers();
  }

  /**
   * 设置 MCP 处理器
   */
  setupHandlers() {
    // 工具列表处理器
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
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
                waitFor: {
                  type: 'string',
                  description: '等待的CSS选择器（可选）'
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
          {
            name: 'browser_extract',
            description: '从页面提取内容',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS选择器'
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
                }
              },
              required: ['selector']
            }
          },
          {
            name: 'browser_click',
            description: '点击页面元素',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS选择器'
                },
                waitForSelector: {
                  type: 'boolean',
                  description: '是否等待元素出现',
                  default: true
                },
                timeout: {
                  type: 'number',
                  description: '超时时间（毫秒）',
                  default: 30000
                }
              },
              required: ['selector']
            }
          },
          {
            name: 'browser_type',
            description: '在输入框中输入文本',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: '输入框的CSS选择器'
                },
                text: {
                  type: 'string',
                  description: '要输入的文本'
                },
                clear: {
                  type: 'boolean',
                  description: '输入前是否清空',
                  default: true
                }
              },
              required: ['selector', 'text']
            }
          },
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
          {
            name: 'browser_get_url',
            description: '获取当前页面URL',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    // 工具调用处理器
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        // 确保浏览器工具系统已初始化
        if (!this.toolSystem) {
          await this.initializeBrowserSystem();
        }

        let result;
        
        switch (name) {
          case 'browser_navigate':
            result = await this.toolSystem.toolManager.executeLocalTool('browser.navigate', args, `mcp-${Date.now()}`);
            break;
          case 'browser_extract':
            result = await this.toolSystem.toolManager.executeLocalTool('browser.extract', args, `mcp-${Date.now()}`);
            break;
          case 'browser_click':
            result = await this.toolSystem.toolManager.executeLocalTool('browser.click', args, `mcp-${Date.now()}`);
            break;
          case 'browser_type':
            result = await this.toolSystem.toolManager.executeLocalTool('browser.type', args, `mcp-${Date.now()}`);
            break;
          case 'browser_screenshot':
            result = await this.toolSystem.toolManager.executeLocalTool('browser.screenshot', args, `mcp-${Date.now()}`);
            break;
          case 'browser_evaluate':
            result = await this.toolSystem.toolManager.executeLocalTool('browser.evaluate', args, `mcp-${Date.now()}`);
            break;
          case 'browser_get_url':
            result = await this.getCurrentUrl();
            break;
          default:
            throw new Error(`未知的工具: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
        
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message,
                stack: error.stack
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }

  /**
   * 初始化浏览器工具系统
   */
  async initializeBrowserSystem() {
    this.toolSystem = createBrowserToolSystem(this.config);
    await this.toolSystem.initialize();
    
    console.error('🚀 浏览器工具系统已初始化');
  }

  /**
   * 获取当前页面URL
   */
  async getCurrentUrl() {
    if (!this.toolSystem) {
      throw new Error('浏览器工具系统未初始化');
    }
    
    return await this.toolSystem.toolManager.executeTool('browser.evaluate', {
      code: 'return window.location.href;'
    });
  }

  /**
   * 启动服务器
   */
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('🔧 MCP 浏览器服务器已启动');
  }

  /**
   * 停止服务器
   */
  async stop() {
    if (this.toolSystem) {
      await this.toolSystem.cleanup();
    }
    await this.server.close();
    
    console.error('🛑 MCP 浏览器服务器已停止');
  }
}

/**
 * 创建并启动 MCP 浏览器服务器
 */
export async function createMCPBrowserServer(config = {}) {
  const server = new MCPBrowserServer(config);
  return server;
}

/**
 * 命令行启动入口
 */
export async function startMCPBrowserServer() {
  const server = new MCPBrowserServer({
    enabled: true,
    engine: 'puppeteer',
    headless: process.env.HEADLESS !== 'false',
    devtools: process.env.DEVTOOLS === 'true',
    instancePool: {
      enabled: false
    },
    security: {
      allowedDomains: ['*'], // 允许所有域名
      blockedDomains: ['localhost', '127.0.0.1']
    }
  });
  
  // 处理进程退出
  process.on('SIGINT', async () => {
    console.error('🔄 收到退出信号，正在关闭服务器...');
    await server.stop();
    process.exit(0);
  });
  
  await server.start();
}
