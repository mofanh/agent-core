/**
 * MCP Connection Manager 实现
 * 
 * @fileoverview 管理多个MCP客户端连接，提供连接池、负载均衡、故障转移等功能
 */

import { EventEmitter } from 'events';
import MCPClient from './client.js';
import Logger from '../utils/logger.js';

/**
 * MCP服务器配置
 * @typedef {Object} MCPServerConfig
 * @property {string} name - 服务器名称
 * @property {string} transport - 传输方式
 * @property {string} [command] - 命令行程序
 * @property {string[]} [args] - 命令行参数
 * @property {Object} [env] - 环境变量
 * @property {string} [url] - HTTP端点
 * @property {number} [maxRetries] - 最大重试次数
 * @property {number} [retryDelay] - 重试延迟(毫秒)
 * @property {boolean} [autoReconnect] - 是否自动重连
 * @property {Object} [capabilities] - 服务器能力
 */

/**
 * 连接管理器配置
 * @typedef {Object} MCPConnectionManagerConfig
 * @property {MCPServerConfig[]} servers - MCP服务器列表
 * @property {number} [maxConnections] - 最大连接数
 * @property {number} [connectionTimeout] - 连接超时时间
 * @property {number} [healthCheckInterval] - 健康检查间隔
 * @property {string} [loadBalanceStrategy] - 负载均衡策略: 'round-robin' | 'random' | 'least-connections'
 * @property {Object} [logger] - 日志实例
 */

/**
 * 连接状态枚举
 */
export const CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting', 
  CONNECTED: 'connected',
  INITIALIZING: 'initializing',
  READY: 'ready',
  ERROR: 'error',
  RECONNECTING: 'reconnecting'
};

/**
 * 连接信息
 * @typedef {Object} ConnectionInfo
 * @property {string} name - 连接名称
 * @property {MCPClient} client - MCP客户端实例
 * @property {string} status - 连接状态
 * @property {Date} connectedAt - 连接时间
 * @property {Date} lastActivity - 最后活动时间
 * @property {number} requestCount - 请求计数
 * @property {number} errorCount - 错误计数
 * @property {number} retryCount - 重试计数
 * @property {MCPServerConfig} config - 服务器配置
 */

/**
 * MCP连接管理器
 * 
 * 功能特性：
 * - 管理多个MCP服务器连接
 * - 连接池和负载均衡
 * - 自动重连和故障转移
 * - 健康检查和监控
 * - 工具发现和路由
 */
export class MCPConnectionManager extends EventEmitter {
  /**
   * 构造函数
   * @param {MCPConnectionManagerConfig} config - 管理器配置
   */
  constructor(config) {
    super();
    
    this.config = {
      maxConnections: 10,
      connectionTimeout: 30000,
      healthCheckInterval: 60000, // 1分钟
      loadBalanceStrategy: 'round-robin',
      ...config
    };
    
    this.logger = this.config.logger || new Logger('MCPConnectionManager');
    
    // 连接管理
    this.connections = new Map(); // name -> ConnectionInfo
    this.toolRegistry = new Map(); // toolName -> connectionName[]
    this.nextConnectionIndex = 0; // for round-robin
    
    // 状态管理
    this.isShuttingDown = false;
    this.healthCheckTimer = null;
    
    // 设置事件处理
    this.setupEventHandlers();
  }

  /**
   * 设置事件处理器
   * @private
   */
  setupEventHandlers() {
    this.on('error', (error) => {
      this.logger.error('Connection Manager error:', error);
    });
  }

  /**
   * 初始化管理器
   * @returns {Promise<void>}
   */
  async initialize() {
    this.logger.info('Initializing MCP Connection Manager');
    
    try {
      // 启动所有配置的连接
      const connectionPromises = this.config.servers.map(serverConfig => 
        this.addConnection(serverConfig)
      );
      
      await Promise.allSettled(connectionPromises);
      
      // 启动健康检查
      this.startHealthCheck();
      
      // 初始化工具注册表
      await this.refreshToolRegistry();
      
      this.logger.info(`Initialized with ${this.connections.size} connections`);
      this.emit('initialized');
      
    } catch (error) {
      this.logger.error('Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * 添加连接
   * @param {MCPServerConfig} serverConfig - 服务器配置
   * @returns {Promise<ConnectionInfo>}
   */
  async addConnection(serverConfig) {
    const { name } = serverConfig;
    
    if (this.connections.has(name)) {
      throw new Error(`Connection '${name}' already exists`);
    }

    if (this.connections.size >= this.config.maxConnections) {
      throw new Error(`Maximum connections limit (${this.config.maxConnections}) reached`);
    }

    const connectionInfo = {
      name,
      client: null,
      status: CONNECTION_STATUS.DISCONNECTED,
      connectedAt: null,
      lastActivity: new Date(),
      requestCount: 0,
      errorCount: 0,
      retryCount: 0,
      config: { 
        maxRetries: 3,
        retryDelay: 5000,
        autoReconnect: true,
        ...serverConfig 
      }
    };

    this.connections.set(name, connectionInfo);
    
    try {
      await this.connectServer(connectionInfo);
      this.emit('connectionAdded', connectionInfo);
      return connectionInfo;
      
    } catch (error) {
      this.logger.error(`Failed to add connection '${name}':`, error);
      this.connections.delete(name);
      throw error;
    }
  }

  /**
   * 连接到服务器
   * @param {ConnectionInfo} connectionInfo - 连接信息
   * @private
   */
  async connectServer(connectionInfo) {
    const { name, config } = connectionInfo;
    
    try {
      connectionInfo.status = CONNECTION_STATUS.CONNECTING;
      this.emit('connectionStatusChanged', name, CONNECTION_STATUS.CONNECTING);
      
      // 创建客户端
      const client = new MCPClient({
        transport: config.transport,
        command: config.command,
        args: config.args,
        env: config.env,
        url: config.url,
        timeout: this.config.connectionTimeout,
        logger: this.logger
      });

      // 设置客户端事件处理
      this.setupClientEventHandlers(client, connectionInfo);
      
      // 连接客户端
      await client.connect();
      connectionInfo.status = CONNECTION_STATUS.CONNECTED;
      this.emit('connectionStatusChanged', name, CONNECTION_STATUS.CONNECTED);
      
      // 初始化客户端
      connectionInfo.status = CONNECTION_STATUS.INITIALIZING;
      await client.initialize();
      
      // 更新连接信息
      connectionInfo.client = client;
      connectionInfo.status = CONNECTION_STATUS.READY;
      connectionInfo.connectedAt = new Date();
      connectionInfo.retryCount = 0;
      
      this.emit('connectionStatusChanged', name, CONNECTION_STATUS.READY);
      this.logger.info(`Connected to MCP server '${name}'`);
      
    } catch (error) {
      connectionInfo.status = CONNECTION_STATUS.ERROR;
      connectionInfo.errorCount++;
      this.emit('connectionStatusChanged', name, CONNECTION_STATUS.ERROR);
      throw error;
    }
  }

  /**
   * 设置客户端事件处理器
   * @param {MCPClient} client - 客户端实例
   * @param {ConnectionInfo} connectionInfo - 连接信息
   * @private
   */
  setupClientEventHandlers(client, connectionInfo) {
    const { name } = connectionInfo;
    
    client.on('disconnect', () => {
      connectionInfo.status = CONNECTION_STATUS.DISCONNECTED;
      this.emit('connectionStatusChanged', name, CONNECTION_STATUS.DISCONNECTED);
      
      // 自动重连
      if (connectionInfo.config.autoReconnect && !this.isShuttingDown) {
        this.scheduleReconnect(connectionInfo);
      }
    });

    client.on('error', (error) => {
      connectionInfo.errorCount++;
      this.logger.error(`Client error for '${name}':`, error);
      this.emit('connectionError', name, error);
    });

    client.on('toolsChanged', () => {
      this.refreshToolRegistry();
    });
  }

  /**
   * 安排重连
   * @param {ConnectionInfo} connectionInfo - 连接信息
   * @private
   */
  scheduleReconnect(connectionInfo) {
    const { name, config } = connectionInfo;
    
    if (connectionInfo.retryCount >= config.maxRetries) {
      this.logger.error(`Max retries reached for connection '${name}'`);
      return;
    }

    connectionInfo.retryCount++;
    connectionInfo.status = CONNECTION_STATUS.RECONNECTING;
    this.emit('connectionStatusChanged', name, CONNECTION_STATUS.RECONNECTING);
    
    const delay = config.retryDelay * Math.pow(2, connectionInfo.retryCount - 1); // 指数退避
    
    setTimeout(async () => {
      if (!this.isShuttingDown && this.connections.has(name)) {
        try {
          await this.connectServer(connectionInfo);
        } catch (error) {
          this.logger.error(`Reconnect failed for '${name}':`, error);
          this.scheduleReconnect(connectionInfo);
        }
      }
    }, delay);
  }

  /**
   * 移除连接
   * @param {string} name - 连接名称
   * @returns {Promise<void>}
   */
  async removeConnection(name) {
    const connectionInfo = this.connections.get(name);
    if (!connectionInfo) {
      throw new Error(`Connection '${name}' not found`);
    }

    try {
      if (connectionInfo.client) {
        await connectionInfo.client.disconnect();
      }
    } catch (error) {
      this.logger.error(`Error disconnecting '${name}':`, error);
    }

    this.connections.delete(name);
    this.emit('connectionRemoved', name);
    
    // 更新工具注册表
    await this.refreshToolRegistry();
  }

  /**
   * 获取可用连接
   * @param {string} [toolName] - 工具名称（可选，用于工具路由）
   * @returns {ConnectionInfo|null}
   */
  getAvailableConnection(toolName) {
    // 如果指定了工具名称，尝试找到支持该工具的连接
    if (toolName) {
      const availableConnections = this.toolRegistry.get(toolName);
      if (availableConnections && availableConnections.length > 0) {
        return this.selectConnection(availableConnections.map(name => this.connections.get(name)));
      }
    }

    // 否则从所有可用连接中选择
    const availableConnections = Array.from(this.connections.values())
      .filter(conn => conn.status === CONNECTION_STATUS.READY);
    
    return this.selectConnection(availableConnections);
  }

  /**
   * 根据负载均衡策略选择连接
   * @param {ConnectionInfo[]} connections - 可选连接列表
   * @returns {ConnectionInfo|null}
   * @private
   */
  selectConnection(connections) {
    if (!connections || connections.length === 0) {
      return null;
    }

    switch (this.config.loadBalanceStrategy) {
      case 'round-robin':
        const selected = connections[this.nextConnectionIndex % connections.length];
        this.nextConnectionIndex++;
        return selected;
        
      case 'random':
        return connections[Math.floor(Math.random() * connections.length)];
        
      case 'least-connections':
        return connections.reduce((min, conn) => 
          conn.requestCount < min.requestCount ? conn : min
        );
        
      default:
        return connections[0];
    }
  }

  /**
   * 执行工具调用
   * @param {string} toolName - 工具名称
   * @param {Object} [args] - 工具参数
   * @returns {Promise<Object>} 工具调用结果
   */
  async callTool(toolName, args) {
    const connection = this.getAvailableConnection(toolName);
    if (!connection) {
      throw new Error(`No available connection for tool '${toolName}'`);
    }

    try {
      connection.requestCount++;
      connection.lastActivity = new Date();
      
      const result = await connection.client.callTool(toolName, args);
      
      this.emit('toolCalled', {
        toolName,
        args,
        result,
        connection: connection.name
      });
      
      return result;
      
    } catch (error) {
      connection.errorCount++;
      this.logger.error(`Tool call failed for '${toolName}' on '${connection.name}':`, error);
      throw error;
    }
  }

  /**
   * 获取所有可用工具
   * @returns {Promise<Array>} 工具列表
   */
  async getAllTools() {
    const toolsMap = new Map();
    
    for (const [name, connectionInfo] of this.connections) {
      if (connectionInfo.status === CONNECTION_STATUS.READY) {
        try {
          const tools = await connectionInfo.client.listTools();
          tools.forEach(tool => {
            if (!toolsMap.has(tool.name)) {
              toolsMap.set(tool.name, {
                ...tool,
                connections: [name]
              });
            } else {
              toolsMap.get(tool.name).connections.push(name);
            }
          });
        } catch (error) {
          this.logger.error(`Failed to get tools from '${name}':`, error);
        }
      }
    }
    
    return Array.from(toolsMap.values());
  }

  /**
   * 刷新工具注册表
   * @private
   */
  async refreshToolRegistry() {
    this.toolRegistry.clear();
    
    for (const [name, connectionInfo] of this.connections) {
      if (connectionInfo.status === CONNECTION_STATUS.READY) {
        try {
          const tools = await connectionInfo.client.listTools();
          tools.forEach(tool => {
            if (!this.toolRegistry.has(tool.name)) {
              this.toolRegistry.set(tool.name, []);
            }
            this.toolRegistry.get(tool.name).push(name);
          });
        } catch (error) {
          this.logger.error(`Failed to refresh tools from '${name}':`, error);
        }
      }
    }
    
    this.emit('toolRegistryUpdated', this.toolRegistry);
  }

  /**
   * 启动健康检查
   * @private
   */
  startHealthCheck() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * 执行健康检查
   * @private
   */
  async performHealthCheck() {
    for (const [name, connectionInfo] of this.connections) {
      if (connectionInfo.status === CONNECTION_STATUS.READY) {
        try {
          await connectionInfo.client.ping();
          connectionInfo.lastActivity = new Date();
        } catch (error) {
          this.logger.warn(`Health check failed for '${name}':`, error);
          connectionInfo.errorCount++;
          
          // 如果ping失败，标记为错误状态并尝试重连
          connectionInfo.status = CONNECTION_STATUS.ERROR;
          this.emit('connectionStatusChanged', name, CONNECTION_STATUS.ERROR);
          
          if (connectionInfo.config.autoReconnect) {
            this.scheduleReconnect(connectionInfo);
          }
        }
      }
    }
  }

  /**
   * 获取连接状态
   * @returns {Object} 连接状态摘要
   */
  getStatus() {
    const status = {
      totalConnections: this.connections.size,
      readyConnections: 0,
      errorConnections: 0,
      connectingConnections: 0,
      connections: {}
    };

    for (const [name, info] of this.connections) {
      status.connections[name] = {
        status: info.status,
        connectedAt: info.connectedAt,
        lastActivity: info.lastActivity,
        requestCount: info.requestCount,
        errorCount: info.errorCount,
        retryCount: info.retryCount
      };

      switch (info.status) {
        case CONNECTION_STATUS.READY:
          status.readyConnections++;
          break;
        case CONNECTION_STATUS.ERROR:
          status.errorConnections++;
          break;
        case CONNECTION_STATUS.CONNECTING:
        case CONNECTION_STATUS.INITIALIZING:
        case CONNECTION_STATUS.RECONNECTING:
          status.connectingConnections++;
          break;
      }
    }

    return status;
  }

  /**
   * 关闭管理器
   * @returns {Promise<void>}
   */
  async shutdown() {
    this.logger.info('Shutting down MCP Connection Manager');
    this.isShuttingDown = true;

    // 停止健康检查
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    // 关闭所有连接
    const disconnectPromises = Array.from(this.connections.values()).map(async (connectionInfo) => {
      try {
        if (connectionInfo.client) {
          await connectionInfo.client.disconnect();
        }
      } catch (error) {
        this.logger.error(`Error disconnecting '${connectionInfo.name}':`, error);
      }
    });

    await Promise.allSettled(disconnectPromises);
    
    this.connections.clear();
    this.toolRegistry.clear();
    
    this.emit('shutdown');
    this.logger.info('MCP Connection Manager shutdown complete');
  }
}

export default MCPConnectionManager;
