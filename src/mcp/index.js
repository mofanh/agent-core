/**
 * MCP (Model Context Protocol) 模块主入口
 * 
 * @fileoverview 提供完整的 MCP 协议支持，包括客户端、连接管理和工具系统
 */

// 导入主要类
import { MCPClient } from './client.js';
import { MCPConnectionManager, CONNECTION_STATUS } from './connection-manager.js';
import { MCPToolSystem } from './tool-system.js';

// 导出类型定义
export {
  MCP_SCHEMA_VERSION,
  JSONRPC_VERSION,
  JSONRPC_ERROR_CODES,
  MCP_METHODS,
  createJsonRpcRequest,
  createJsonRpcResponse,
  createJsonRpcError,
  createTextContent,
  createImageContent,
  createTool,
  createCallToolResult,
  isValidJsonRpcMessage,
  isValidJsonRpcRequest,
  isValidJsonRpcResponse,
  isValidTool
} from './types.js';

// 导出核心类
export { MCPClient } from './client.js';
export { MCPConnectionManager, CONNECTION_STATUS } from './connection-manager.js';
export { MCPToolSystem } from './tool-system.js';

/**
 * 创建简单的MCP客户端
 * @param {Object} config - 客户端配置
 * @returns {MCPClient} MCP客户端实例
 */
export function createMCPClient(config) {
  return new MCPClient(config);
}

/**
 * 创建MCP连接管理器
 * @param {Object} config - 管理器配置
 * @returns {MCPConnectionManager} 连接管理器实例
 */
export function createMCPConnectionManager(config) {
  return new MCPConnectionManager(config);
}

/**
 * 创建完整的MCP系统（包含连接管理器和工具系统）
 * @param {Object} config - 系统配置
 * @param {Array} config.servers - MCP服务器配置列表
 * @param {Object} [config.manager] - 连接管理器配置
 * @param {Object} [config.toolSystem] - 工具系统配置
 * @returns {Object} 包含connectionManager和toolSystem的对象
 */
export function createMCPSystem(config) {
  const { servers, manager = {}, toolSystem = {} } = config;
  
  // 创建连接管理器
  const connectionManager = new MCPConnectionManager({
    servers,
    ...manager
  });
  
  // 创建工具系统
  const tools = new MCPToolSystem({
    connectionManager,
    ...toolSystem
  });
  
  return {
    connectionManager,
    toolSystem: tools,
    
    // 初始化方法
    async initialize() {
      await connectionManager.initialize();
      await tools.initialize();
    },
    
    // 便捷方法
    async callTool(toolName, args, options) {
      return await tools.callTool(toolName, args, options);
    },
    
    getTools() {
      return tools.getTools();
    },
    
    async executeToolChain(toolChain, initialData, options) {
      return await tools.executeToolChain(toolChain, initialData, options);
    },
    
    getStatus() {
      const connectionStatus = connectionManager.getStatus();
      
      return {
        healthy: connectionStatus.readyConnections > 0,
        connections: connectionStatus.connections,
        totalConnections: connectionStatus.totalConnections,
        readyConnections: connectionStatus.readyConnections,
        tools: {
          totalTools: tools.getTools().length,
          metrics: tools.getMetrics()
        }
      };
    },
    
    async shutdown() {
      await connectionManager.shutdown();
    }
  };
}

/**
 * 预设的工具链模板
 */
export const TOOL_CHAIN_TEMPLATES = {
  /**
   * 网页分析工具链
   */
  WEB_ANALYSIS: [
    {
      tool: 'fetch_page',
      args: { url: null }, // url will be provided at runtime
      dataMapping: (data) => ({ url: data.url })
    },
    {
      tool: 'extract_text',
      dataMapping: (data, results) => ({ html: results[0]?.data?.html })
    },
    {
      tool: 'analyze_content',
      dataMapping: (data, results) => ({ text: results[1]?.data?.text })
    }
  ],
  
  /**
   * DOM操作工具链
   */
  DOM_MANIPULATION: [
    {
      tool: 'find_elements',
      args: { selector: null },
      dataMapping: (data) => ({ selector: data.selector })
    },
    {
      tool: 'click_element',
      dataMapping: (data, results) => ({ element: results[0]?.data?.elements?.[0] })
    }
  ],
  
  /**
   * 文件处理工具链
   */
  FILE_PROCESSING: [
    {
      tool: 'read_file',
      args: { path: null },
      dataMapping: (data) => ({ path: data.path })
    },
    {
      tool: 'process_content',
      dataMapping: (data, results) => ({ content: results[0]?.data?.content })
    },
    {
      tool: 'write_file',
      args: { path: null },
      dataMapping: (data, results) => ({ 
        path: data.outputPath || data.path,
        content: results[1]?.data?.processedContent 
      })
    }
  ]
};

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  client: {
    transport: 'stdio',
    timeout: 30000
  },
  
  manager: {
    maxConnections: 10,
    connectionTimeout: 30000,
    healthCheckInterval: 60000,
    loadBalanceStrategy: 'round-robin'
  },
  
  toolSystem: {
    enableValidation: true,
    enableMetrics: true
  }
};

// 默认导出
export default {
  MCPClient,
  MCPConnectionManager,
  MCPToolSystem,
  CONNECTION_STATUS,
  createMCPClient,
  createMCPConnectionManager,
  createMCPSystem,
  TOOL_CHAIN_TEMPLATES,
  DEFAULT_CONFIG
};
