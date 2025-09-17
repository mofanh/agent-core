/**
 * 统一浏览器 MCP 客户端
 * 与统一浏览器 MCP 服务器通信的客户端
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import Logger from '../utils/logger.js';

/**
 * 统一浏览器 MCP 客户端类
 */
export class UnifiedBrowserMCPClient extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      serverCommand: config.serverCommand || 'node',
      serverArgs: config.serverArgs || [
        '-e', `
        import { startUnifiedBrowserMCPServer } from './src/mcp/unified-browser-server.js';
        startUnifiedBrowserMCPServer(${JSON.stringify(config.serverConfig || {})});
        `
      ],
      timeout: config.timeout || 30000,
      ...config
    };
    
    this.logger = new Logger('info');
    this.client = new Client(
      {
        name: 'unified-browser-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );
    
    this.serverProcess = null;
    this.transport = null;
    this.isConnected = false;
    this.availableTools = [];
  }

  /**
   * 连接到统一浏览器 MCP 服务器
   */
  async connect() {
    if (this.isConnected) {
      return;
    }

    try {
      this.logger.info('🔗 连接到统一浏览器 MCP 服务器...');
      
      // 启动 MCP 服务器进程
      this.serverProcess = spawn(this.config.serverCommand, this.config.serverArgs, {
        stdio: ['pipe', 'pipe', 'inherit']
      });

      // 监听服务器进程事件
      this.serverProcess.on('error', (error) => {
        this.logger.error('服务器进程错误:', error);
        this.emit('serverError', error);
      });

      this.serverProcess.on('exit', (code, signal) => {
        this.logger.info(`服务器进程退出: code=${code}, signal=${signal}`);
        this.isConnected = false;
        this.emit('serverExit', { code, signal });
      });

      // 创建传输层
      this.transport = new StdioClientTransport({
        reader: this.serverProcess.stdout,
        writer: this.serverProcess.stdin
      });

      // 连接客户端
      await this.client.connect(this.transport);
      
      // 获取可用工具列表
      await this.refreshToolsList();
      
      this.isConnected = true;
      this.logger.info('✅ 已连接到统一浏览器 MCP 服务器');
      this.emit('connected');
      
    } catch (error) {
      this.logger.error('❌ 连接失败:', error);
      await this.cleanup();
      throw error;
    }
  }

  /**
   * 断开连接
   */
  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      this.logger.info('🔌 断开与统一浏览器 MCP 服务器的连接...');
      
      await this.cleanup();
      
      this.isConnected = false;
      this.logger.info('✅ 已断开连接');
      this.emit('disconnected');
      
    } catch (error) {
      this.logger.error('❌ 断开连接时出错:', error);
      throw error;
    }
  }

  /**
   * 清理资源
   */
  async cleanup() {
    if (this.transport) {
      await this.client.close();
      this.transport = null;
    }
    
    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = null;
    }
  }

  /**
   * 确保连接状态
   */
  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  /**
   * 刷新工具列表
   */
  async refreshToolsList() {
    try {
      const response = await this.client.listTools();
      this.availableTools = response.tools;
      this.logger.info(`📝 获取到 ${this.availableTools.length} 个可用工具`);
      
    } catch (error) {
      this.logger.error('❌ 获取工具列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取可用工具列表
   */
  async getAvailableTools() {
    await this.ensureConnected();
    return this.availableTools;
  }

  /**
   * 调用浏览器工具
   */
  async callTool(name, args = {}) {
    await this.ensureConnected();
    
    try {
      this.logger.info(`🔧 调用工具: ${name}`, args);
      
      const response = await this.client.callTool({ name, arguments: args });
      
      if (response.content && response.content[0]) {
        const resultText = response.content[0].text;
        const result = JSON.parse(resultText);
        
        this.emit('toolCalled', { name, args, result });
        
        return result;
      }
      
      return response;
      
    } catch (error) {
      this.logger.error(`❌ 工具调用失败 [${name}]:`, error);
      this.emit('toolError', { name, args, error });
      throw error;
    }
  }

  // 便捷方法

  /**
   * 导航到指定URL
   */
  async navigate(url, options = {}) {
    return await this.callTool('browser_navigate', { url, ...options });
  }

  /**
   * 提取页面内容
   */
  async extract(selector, options = {}) {
    return await this.callTool('browser_extract', { selector, ...options });
  }

  /**
   * 点击元素
   */
  async click(selector, options = {}) {
    return await this.callTool('browser_click', { selector, ...options });
  }

  /**
   * 悬停元素
   */
  async hover(selector, options = {}) {
    return await this.callTool('browser_hover', { selector, ...options });
  }

  /**
   * 输入文本
   */
  async type(selector, text, options = {}) {
    return await this.callTool('browser_type', { selector, text, ...options });
  }

  /**
   * 截图
   */
  async screenshot(options = {}) {
    return await this.callTool('browser_screenshot', options);
  }

  /**
   * 执行JavaScript
   */
  async evaluate(code, options = {}) {
    return await this.callTool('browser_evaluate', { code, ...options });
  }

  /**
   * 获取页面信息
   */
  async getPageInfo() {
    return await this.callTool('browser_get_page_info');
  }

  /**
   * 等待元素
   */
  async waitFor(selector, options = {}) {
    return await this.callTool('browser_wait_for', { selector, ...options });
  }

  /**
   * 获取连接状态
   */
  isConnectedToServer() {
    return this.isConnected;
  }

  /**
   * 获取工具信息
   */
  getToolInfo(toolName) {
    return this.availableTools.find(tool => tool.name === toolName);
  }
}

/**
 * 创建统一浏览器 MCP 客户端
 */
export function createUnifiedBrowserMCPClient(config = {}) {
  return new UnifiedBrowserMCPClient(config);
}

export default UnifiedBrowserMCPClient;
