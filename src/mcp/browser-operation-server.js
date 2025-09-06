/**
 * 轻量级浏览器服务
 * 不依赖 MCP SDK，使用简单的 WebSocket 通信
 */

import { WebSocketServer } from 'ws';
import { createBrowserToolSystem } from '../browser/index.js';

/**
 * 浏览器操作服务器
 * 提供浏览器自动化功能的独立服务
 */
export class BrowserOperationServer {
  constructor(options = {}) {
    this.port = options.port || 8080;
    this.host = options.host || 'localhost';
    this.wss = null;
    this.toolSystem = null;
    this.clients = new Set();
  }

  /**
   * 启动服务器
   */
  async start() {
    try {
      // 初始化浏览器工具系统
      this.toolSystem = createBrowserToolSystem({
        headless: true,
        devtools: false
      });
      
      await this.toolSystem.initialize();
      console.log('🌐 浏览器工具系统已初始化');

      // 启动 WebSocket 服务器
      this.wss = new WebSocketServer({ 
        port: this.port,
        host: this.host 
      });

      this.wss.on('connection', (ws) => {
        console.log('🔗 新客户端连接');
        this.clients.add(ws);
        
        ws.on('message', async (data) => {
          try {
            const request = JSON.parse(data.toString());
            const response = await this.handleRequest(request);
            ws.send(JSON.stringify(response));
          } catch (error) {
            ws.send(JSON.stringify({
              id: 'error',
              error: {
                code: -1,
                message: error.message
              }
            }));
          }
        });

        ws.on('close', () => {
          console.log('🔌 客户端断开连接');
          this.clients.delete(ws);
        });

        // 发送欢迎消息
        ws.send(JSON.stringify({
          type: 'welcome',
          message: '浏览器操作服务已就绪'
        }));
      });

      console.log(`🚀 浏览器操作服务已启动: ws://${this.host}:${this.port}`);
    } catch (error) {
      console.error('❌ 服务启动失败:', error);
      throw error;
    }
  }

  /**
   * 处理客户端请求
   */
  async handleRequest(request) {
    const { id, method, params = {} } = request;

    try {
      let result;

      switch (method) {
        case 'browser.navigate':
          result = await this.toolSystem.toolManager.executeTool('browser.navigate', params);
          break;

        case 'browser.extract':
          result = await this.toolSystem.toolManager.executeTool('browser.extract', params);
          break;

        case 'browser.click':
          result = await this.toolSystem.toolManager.executeTool('browser.click', params);
          break;

        case 'browser.type':
          result = await this.toolSystem.toolManager.executeTool('browser.type', params);
          break;

        case 'browser.screenshot':
          result = await this.toolSystem.toolManager.executeTool('browser.screenshot', params);
          break;

        case 'browser.evaluate':
          result = await this.toolSystem.toolManager.executeTool('browser.evaluate', params);
          break;

        case 'browser.getStats':
          result = this.toolSystem.getStats();
          break;

        case 'browser.ping':
          result = { pong: true, timestamp: Date.now() };
          break;

        default:
          throw new Error(`未知方法: ${method}`);
      }

      return {
        id,
        result
      };
    } catch (error) {
      return {
        id,
        error: {
          code: -1,
          message: error.message
        }
      };
    }
  }

  /**
   * 停止服务器
   */
  async stop() {
    if (this.wss) {
      this.wss.close();
    }
    
    if (this.toolSystem) {
      await this.toolSystem.cleanup();
    }

    console.log('🛑 浏览器操作服务已停止');
  }
}

/**
 * 创建并启动浏览器操作服务
 */
export function createBrowserOperationServer(options = {}) {
  return new BrowserOperationServer(options);
}

/**
 * 快速启动服务器的工具函数
 */
export async function startBrowserServer(port = 8080) {
  const server = createBrowserOperationServer({ port });
  await server.start();
  return server;
}
