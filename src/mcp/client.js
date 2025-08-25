/**
 * MCP Client 实现
 * 基于 codex-rs/mcp-client 实现
 * 
 * @fileoverview 提供 MCP 客户端功能，支持 stdio 和 HTTP 传输
 */

import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { 
  JSONRPC_VERSION, 
  createJsonRpcRequest, 
  createJsonRpcResponse, 
  createJsonRpcError,
  isValidJsonRpcResponse,
  JSONRPC_ERROR_CODES,
  MCP_METHODS 
} from './types.js';
import Logger from '../utils/logger.js';

/**
 * MCP客户端配置
 * @typedef {Object} MCPClientConfig
 * @property {string} transport - 传输方式: 'stdio' | 'http'
 * @property {string} [command] - 命令行程序 (stdio模式)
 * @property {string[]} [args] - 命令行参数 (stdio模式)
 * @property {Object} [env] - 环境变量 (stdio模式)
 * @property {string} [url] - HTTP端点 (http模式)
 * @property {number} [timeout] - 请求超时时间(毫秒)
 * @property {Object} [logger] - 日志实例
 */

/**
 * MCP客户端类
 * 
 * 功能特性：
 * - 支持stdio和HTTP传输
 * - JSON-RPC协议处理
 * - 请求/响应配对
 * - 自动重连机制
 * - 事件驱动架构
 */
export class MCPClient extends EventEmitter {
  /**
   * 构造函数
   * @param {MCPClientConfig} config - 客户端配置
   */
  constructor(config) {
    super();
    
    this.config = {
      transport: 'stdio',
      timeout: 30000, // 30秒默认超时
      ...config
    };
    
    this.logger = this.config.logger || new Logger('MCPClient');
    
    // 连接状态
    this.connected = false;
    this.initialized = false;
    
    // 请求管理
    this.requestId = 1;
    this.pendingRequests = new Map();
    
    // 传输层
    this.transport = null;
    this.process = null; // for stdio mode
    
    // 事件处理
    this.setupEventHandlers();
  }

  /**
   * 设置事件处理器
   * @private
   */
  setupEventHandlers() {
    this.on('error', (error) => {
      this.logger.error('MCP Client error:', error);
    });
    
    this.on('disconnect', () => {
      this.connected = false;
      this.initialized = false;
      this.logger.info('MCP Client disconnected');
    });
  }

  /**
   * 连接到MCP服务器
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.connected) {
      throw new Error('Client is already connected');
    }

    try {
      if (this.config.transport === 'stdio') {
        await this.connectStdio();
      } else if (this.config.transport === 'http') {
        await this.connectHttp();
      } else {
        throw new Error(`Unsupported transport: ${this.config.transport}`);
      }
      
      this.connected = true;
      this.emit('connect');
      this.logger.info('MCP Client connected');
      
    } catch (error) {
      this.logger.error('Failed to connect:', error);
      throw error;
    }
  }

  /**
   * 连接到stdio传输
   * @private
   */
  async connectStdio() {
    if (!this.config.command) {
      throw new Error('Command is required for stdio transport');
    }

    return new Promise((resolve, reject) => {
      try {
        this.process = spawn(this.config.command, this.config.args || [], {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env, ...this.config.env }
        });

        this.process.on('error', (error) => {
          this.logger.error('Process error:', error);
          this.emit('error', error);
          reject(error);
        });

        this.process.on('exit', (code, signal) => {
          this.logger.info(`Process exited with code ${code}, signal ${signal}`);
          this.emit('disconnect');
        });

        // 设置输出处理
        this.setupStdioHandlers();
        
        // 等待进程启动
        setTimeout(() => {
          if (this.process && !this.process.killed) {
            resolve();
          } else {
            reject(new Error('Process failed to start'));
          }
        }, 100);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 设置stdio处理器
   * @private
   */
  setupStdioHandlers() {
    if (!this.process) return;

    let buffer = '';
    
    this.process.stdout.on('data', (data) => {
      buffer += data.toString();
      
      // 处理行分隔的JSON消息
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留不完整的行
      
      for (const line of lines) {
        if (line.trim()) {
          this.handleMessage(line.trim());
        }
      }
    });

    this.process.stderr.on('data', (data) => {
      this.logger.debug('Server stderr:', data.toString());
    });
  }

  /**
   * 连接到HTTP传输 
   * @private
   */
  async connectHttp() {
    if (!this.config.url) {
      throw new Error('URL is required for http transport');
    }
    
    // HTTP传输的实现
    // 这里可以使用fetch或其他HTTP客户端
    this.transport = {
      type: 'http',
      url: this.config.url
    };
  }

  /**
   * 处理接收到的消息
   * @param {string} message - JSON消息字符串
   * @private
   */
  handleMessage(message) {
    try {
      const data = JSON.parse(message);
      this.logger.debug('Received message:', data);

      if (data.jsonrpc !== JSONRPC_VERSION) {
        this.logger.warn('Invalid JSON-RPC version:', data.jsonrpc);
        return;
      }

      // 处理响应
      if (data.id !== undefined && (data.result !== undefined || data.error !== undefined)) {
        this.handleResponse(data);
      }
      // 处理通知
      else if (data.method && data.id === undefined) {
        this.handleNotification(data);
      }
      // 处理其他消息类型
      else {
        this.logger.debug('Unhandled message type:', data);
      }
      
    } catch (error) {
      this.logger.error('Failed to parse message:', error, 'Raw message:', message);
    }
  }

  /**
   * 处理响应消息
   * @param {Object} response - 响应对象
   * @private
   */
  handleResponse(response) {
    const requestId = response.id;
    const pending = this.pendingRequests.get(requestId);
    
    if (pending) {
      this.pendingRequests.delete(requestId);
      clearTimeout(pending.timeout);
      
      if (response.error) {
        pending.reject(new Error(`MCP Error ${response.error.code}: ${response.error.message}`));
      } else {
        pending.resolve(response.result);
      }
    } else {
      this.logger.warn('Received response for unknown request ID:', requestId);
    }
  }

  /**
   * 处理通知消息
   * @param {Object} notification - 通知对象
   * @private
   */
  handleNotification(notification) {
    this.emit('notification', notification);
    
    // 处理特定通知
    switch (notification.method) {
      case MCP_METHODS.INITIALIZED:
        this.initialized = true;
        this.emit('initialized');
        break;
        
      case MCP_METHODS.TOOLS_LIST_CHANGED:
        this.emit('toolsChanged');
        break;
        
      case MCP_METHODS.RESOURCES_LIST_CHANGED:
        this.emit('resourcesChanged');
        break;
        
      default:
        this.logger.debug('Unhandled notification:', notification.method);
    }
  }

  /**
   * 发送请求
   * @param {string} method - 请求方法
   * @param {any} [params] - 请求参数
   * @param {number} [timeout] - 超时时间
   * @returns {Promise<any>} 响应结果
   */
  async sendRequest(method, params, timeout) {
    if (!this.connected) {
      throw new Error('Client is not connected');
    }

    const requestId = this.requestId++;
    const request = createJsonRpcRequest(method, params, requestId);
    
    return new Promise((resolve, reject) => {
      // 设置超时
      const timeoutMs = timeout || this.config.timeout;
      const timeoutHandle = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      // 存储待处理请求
      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        timeout: timeoutHandle
      });

      // 发送请求
      this.sendMessage(request).catch(reject);
    });
  }

  /**
   * 发送消息
   * @param {Object} message - 要发送的消息
   * @private
   */
  async sendMessage(message) {
    const messageStr = JSON.stringify(message);
    this.logger.debug('Sending message:', messageStr);

    if (this.config.transport === 'stdio') {
      if (!this.process || !this.process.stdin) {
        throw new Error('Process stdin not available');
      }
      
      return new Promise((resolve, reject) => {
        this.process.stdin.write(messageStr + '\n', (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      
    } else if (this.config.transport === 'http') {
      // HTTP传输实现
      const response = await fetch(this.transport.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: messageStr
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }
  }

  /**
   * 初始化客户端
   * @param {Object} params - 初始化参数
   * @returns {Promise<Object>} 初始化结果
   */
  async initialize(params = {}) {
    const initParams = {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: { listChanged: true },
        sampling: {},
        experimental: {}
      },
      clientInfo: {
        name: 'agent-core-mcp-client',
        version: '1.0.0'
      },
      ...params
    };

    const result = await this.sendRequest(MCP_METHODS.INITIALIZE, initParams);
    
    // 发送初始化完成通知
    await this.sendNotification(MCP_METHODS.INITIALIZED);
    
    return result;
  }

  /**
   * 发送通知
   * @param {string} method - 通知方法
   * @param {any} [params] - 通知参数
   */
  async sendNotification(method, params) {
    const notification = {
      jsonrpc: JSONRPC_VERSION,
      method,
      ...(params && { params })
    };
    
    await this.sendMessage(notification);
  }

  /**
   * 断开连接
   */
  async disconnect() {
    if (!this.connected) {
      return;
    }

    // 清理待处理请求
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Client disconnected'));
    }
    this.pendingRequests.clear();

    // 关闭传输
    if (this.process) {
      this.process.kill();
      this.process = null;
    }

    this.connected = false;
    this.initialized = false;
    this.emit('disconnect');
  }

  /**
   * 获取连接状态
   * @returns {boolean} 是否已连接
   */
  isConnected() {
    return this.connected;
  }

  /**
   * 获取初始化状态  
   * @returns {boolean} 是否已初始化
   */
  isInitialized() {
    return this.initialized;
  }

  // ==================== 便捷方法 ====================

  /**
   * 获取工具列表
   * @returns {Promise<Array>} 工具列表
   */
  async listTools() {
    const result = await this.sendRequest(MCP_METHODS.TOOLS_LIST);
    return result.tools || [];
  }

  /**
   * 调用工具
   * @param {string} name - 工具名称
   * @param {Object} [args] - 工具参数
   * @returns {Promise<Object>} 工具调用结果
   */
  async callTool(name, args) {
    return await this.sendRequest(MCP_METHODS.TOOLS_CALL, {
      name,
      arguments: args
    });
  }

  /**
   * 获取资源列表
   * @returns {Promise<Array>} 资源列表
   */
  async listResources() {
    const result = await this.sendRequest(MCP_METHODS.RESOURCES_LIST);
    return result.resources || [];
  }

  /**
   * 读取资源
   * @param {string} uri - 资源URI
   * @returns {Promise<Object>} 资源内容
   */
  async readResource(uri) {
    return await this.sendRequest(MCP_METHODS.RESOURCES_READ, { uri });
  }

  /**
   * 获取Prompt列表
   * @returns {Promise<Array>} Prompt列表
   */
  async listPrompts() {
    const result = await this.sendRequest(MCP_METHODS.PROMPTS_LIST);
    return result.prompts || [];
  }

  /**
   * 获取Prompt
   * @param {string} name - Prompt名称
   * @param {Object} [args] - Prompt参数
   * @returns {Promise<Object>} Prompt内容
   */
  async getPrompt(name, args) {
    return await this.sendRequest(MCP_METHODS.PROMPTS_GET, {
      name,
      arguments: args
    });
  }

  /**
   * Ping服务器
   * @returns {Promise<Object>} Ping结果
   */
  async ping() {
    return await this.sendRequest(MCP_METHODS.PING);
  }
}

export default MCPClient;
