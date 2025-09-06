/**
 * MCP 浏览器客户端 - 基于 @modelcontextprotocol/sdk
 * 
 * 连接到 MCP 浏览器服务器并提供浏览器自动化功能
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

/**
 * MCP 浏览器客户端类
 */
export class MCPBrowserClient {
  constructor(config = {}) {
    this.config = {
      serverCommand: 'node',
      serverArgs: ['-e', `
        import { startMCPBrowserServer } from '@mofanh/agent-core/mcp/browser-server.js';
        startMCPBrowserServer();
      `],
      ...config
    };
    
    this.client = new Client(
      {
        name: 'browser-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );
    
    this.serverProcess = null;
    this.transport = null;
    this.isConnected = false;
  }

  /**
   * 连接到 MCP 浏览器服务器
   */
  async connect() {
    try {
      // 启动服务器进程
      this.serverProcess = spawn(this.config.serverCommand, this.config.serverArgs, {
        stdio: ['pipe', 'pipe', 'inherit']
      });
      
      // 创建传输层
      this.transport = new StdioClientTransport({
        stdin: this.serverProcess.stdout,
        stdout: this.serverProcess.stdin
      });
      
      // 连接客户端
      await this.client.connect(this.transport);
      this.isConnected = true;
      
      console.log('🔗 已连接到 MCP 浏览器服务器');
      
      // 处理服务器进程退出
      this.serverProcess.on('exit', (code) => {
        console.log(`📴 MCP 浏览器服务器进程退出，代码: ${code}`);
        this.isConnected = false;
      });
      
      return true;
    } catch (error) {
      console.error('❌ 连接 MCP 浏览器服务器失败:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * 断开连接
   */
  async disconnect() {
    try {
      if (this.client && this.isConnected) {
        await this.client.close();
      }
      
      if (this.serverProcess) {
        this.serverProcess.kill('SIGTERM');
        
        // 等待进程退出，如果超时则强制终止
        setTimeout(() => {
          if (this.serverProcess && !this.serverProcess.killed) {
            this.serverProcess.kill('SIGKILL');
          }
        }, 5000);
      }
      
      this.isConnected = false;
      console.log('🔌 已断开 MCP 浏览器服务器连接');
    } catch (error) {
      console.error('❌ 断开连接时出错:', error);
    }
  }

  /**
   * 确保连接状态
   */
  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
    
    if (!this.isConnected) {
      throw new Error('无法连接到 MCP 浏览器服务器');
    }
  }

  /**
   * 获取可用工具列表
   */
  async listTools() {
    await this.ensureConnected();
    
    try {
      const response = await this.client.request(
        { method: 'tools/list' },
        { method: 'tools/list' }
      );
      return response.tools;
    } catch (error) {
      console.error('❌ 获取工具列表失败:', error);
      throw error;
    }
  }

  /**
   * 调用浏览器工具
   */
  async callTool(name, args = {}) {
    await this.ensureConnected();
    
    try {
      const response = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name,
            arguments: args
          }
        },
        { method: 'tools/call' }
      );
      
      if (response.isError) {
        throw new Error(`工具调用失败: ${response.content[0]?.text || '未知错误'}`);
      }
      
      // 解析响应内容
      const resultText = response.content[0]?.text;
      if (resultText) {
        try {
          return JSON.parse(resultText);
        } catch {
          return { success: true, data: resultText };
        }
      }
      
      return { success: true, data: null };
    } catch (error) {
      console.error(`❌ 调用工具 ${name} 失败:`, error);
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
   * 获取当前URL
   */
  async getCurrentUrl() {
    return await this.callTool('browser_get_url');
  }
}

/**
 * 创建 MCP 浏览器客户端
 */
export async function createMCPBrowserClient(config = {}) {
  const client = new MCPBrowserClient(config);
  await client.connect();
  return client;
}
