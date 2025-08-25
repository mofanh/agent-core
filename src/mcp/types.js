/**
 * MCP (Model Context Protocol) 类型定义
 * 基于 codex-rs/mcp-types 实现
 * 
 * @fileoverview 提供完整的 MCP 协议类型定义（JavaScript 版本）
 */

// 协议版本和常量
export const MCP_SCHEMA_VERSION = '2025-06-18';
export const JSONRPC_VERSION = '2.0';

// ============================================================================
// 错误代码常量
// ============================================================================

export const JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // MCP 特定错误代码
  MCP_INVALID_TOOL: -32000,
  MCP_TOOL_EXECUTION_ERROR: -32001,
  MCP_RESOURCE_NOT_FOUND: -32002,
  MCP_PERMISSION_DENIED: -32003,
};

// ============================================================================
// 工厂函数和验证器
// ============================================================================

/**
 * 创建 JSON-RPC 请求
 * @param {string} method - 方法名
 * @param {any} [params] - 参数
 * @param {string|number} [id] - 请求ID
 * @returns {Object} JSON-RPC请求对象
 */
export function createJsonRpcRequest(method, params, id) {
  const request = {
    jsonrpc: JSONRPC_VERSION,
    method,
  };
  
  if (params !== undefined) {
    request.params = params;
  }
  
  if (id !== undefined) {
    request.id = id;
  }
  
  return request;
}

/**
 * 创建 JSON-RPC 响应
 * @param {string|number} id - 请求ID
 * @param {any} [result] - 结果
 * @param {Object} [error] - 错误对象
 * @returns {Object} JSON-RPC响应对象
 */
export function createJsonRpcResponse(id, result, error) {
  const response = {
    jsonrpc: JSONRPC_VERSION,
    id,
  };
  
  if (error) {
    response.error = error;
  } else {
    response.result = result || null;
  }
  
  return response;
}

/**
 * 创建 JSON-RPC 错误对象
 * @param {number} code - 错误代码
 * @param {string} message - 错误消息
 * @param {any} [data] - 错误数据
 * @returns {Object} 错误对象
 */
export function createJsonRpcError(code, message, data) {
  const error = { code, message };
  if (data !== undefined) {
    error.data = data;
  }
  return error;
}

/**
 * 创建文本内容块
 * @param {string} text - 文本内容
 * @param {Object} [annotations] - 注解
 * @returns {Object} 文本内容对象
 */
export function createTextContent(text, annotations) {
  const content = { type: 'text', text };
  if (annotations) {
    content.annotations = annotations;
  }
  return content;
}

/**
 * 创建图片内容块
 * @param {string} data - base64编码的图片数据
 * @param {string} mimeType - MIME类型
 * @param {Object} [annotations] - 注解
 * @returns {Object} 图片内容对象
 */
export function createImageContent(data, mimeType, annotations) {
  const content = { type: 'image', data, mimeType };
  if (annotations) {
    content.annotations = annotations;
  }
  return content;
}

/**
 * 创建工具定义
 * @param {string} name - 工具名称
 * @param {Object} inputSchema - 输入Schema
 * @param {string} [title] - 工具标题
 * @param {string} [description] - 工具描述
 * @returns {Object} 工具对象
 */
export function createTool(name, inputSchema, title, description) {
  const tool = { name, inputSchema };
  if (title) tool.title = title;
  if (description) tool.description = description;
  return tool;
}

/**
 * 创建工具调用结果
 * @param {Array} content - 内容数组
 * @param {boolean} [isError] - 是否错误
 * @param {any} [structuredContent] - 结构化内容
 * @returns {Object} 工具调用结果
 */
export function createCallToolResult(content, isError, structuredContent) {
  const result = { content };
  if (isError !== undefined) result.isError = isError;
  if (structuredContent !== undefined) result.structuredContent = structuredContent;
  return result;
}

// ============================================================================
// 验证函数
// ============================================================================

/**
 * 验证是否为有效的JSON-RPC消息
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
export function isValidJsonRpcMessage(obj) {
  return obj && 
         typeof obj === 'object' && 
         obj.jsonrpc === JSONRPC_VERSION;
}

/**
 * 验证是否为有效的JSON-RPC请求
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
export function isValidJsonRpcRequest(obj) {
  return isValidJsonRpcMessage(obj) &&
         typeof obj.method === 'string' &&
         obj.id !== undefined;
}

/**
 * 验证是否为有效的JSON-RPC响应
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
export function isValidJsonRpcResponse(obj) {
  return isValidJsonRpcMessage(obj) &&
         obj.id !== undefined &&
         (obj.result !== undefined || obj.error !== undefined);
}

/**
 * 验证是否为有效的工具定义
 * @param {any} obj - 要验证的对象
 * @returns {boolean} 是否有效
 */
export function isValidTool(obj) {
  return obj &&
         typeof obj === 'object' &&
         typeof obj.name === 'string' &&
         obj.inputSchema &&
         typeof obj.inputSchema === 'object';
}

// ============================================================================
// MCP 方法常量
// ============================================================================

export const MCP_METHODS = {
  // 初始化
  INITIALIZE: 'initialize',
  INITIALIZED: 'notifications/initialized',
  
  // 工具相关
  TOOLS_LIST: 'tools/list',
  TOOLS_CALL: 'tools/call',
  
  // 资源相关
  RESOURCES_LIST: 'resources/list',
  RESOURCES_READ: 'resources/read',
  RESOURCES_SUBSCRIBE: 'resources/subscribe',
  RESOURCES_UNSUBSCRIBE: 'resources/unsubscribe',
  
  // Prompt相关
  PROMPTS_LIST: 'prompts/list',
  PROMPTS_GET: 'prompts/get',
  
  // 通用
  PING: 'ping',
  
  // 通知
  CANCELLED: 'notifications/cancelled',
  PROGRESS: 'notifications/progress',
  ROOTS_LIST_CHANGED: 'notifications/roots/list_changed',
  RESOURCES_LIST_CHANGED: 'notifications/resources/list_changed',
  RESOURCES_UPDATED: 'notifications/resources/updated',
  TOOLS_LIST_CHANGED: 'notifications/tools/list_changed',
  PROMPTS_LIST_CHANGED: 'notifications/prompts/list_changed',
};

// ============================================================================
// JSDoc 类型定义（为IDE提供类型提示）
// ============================================================================

/**
 * @typedef {Object} JsonRpcRequest
 * @property {string} jsonrpc - JSON-RPC版本 "2.0"
 * @property {string} method - 请求方法
 * @property {any} [params] - 请求参数
 * @property {string|number} [id] - 请求ID
 */

/**
 * @typedef {Object} JsonRpcResponse
 * @property {string} jsonrpc - JSON-RPC版本 "2.0"
 * @property {string|number} id - 响应ID
 * @property {any} [result] - 响应结果
 * @property {JsonRpcError} [error] - 错误信息
 */

/**
 * @typedef {Object} JsonRpcError
 * @property {number} code - 错误代码
 * @property {string} message - 错误消息
 * @property {any} [data] - 错误数据
 */

/**
 * @typedef {Object} JsonRpcNotification
 * @property {string} jsonrpc - JSON-RPC版本 "2.0"
 * @property {string} method - 通知方法
 * @property {any} [params] - 通知参数
 */

/**
 * @typedef {Object} Annotations
 * @property {Array<string>} [audience] - 目标受众
 * @property {string} [lastModified] - 最后修改时间
 * @property {number} [priority] - 优先级
 */

/**
 * @typedef {Object} TextContent
 * @property {string} type - 内容类型 "text"
 * @property {string} text - 文本内容
 * @property {Annotations} [annotations] - 注解
 */

/**
 * @typedef {Object} ImageContent
 * @property {string} type - 内容类型 "image"
 * @property {string} data - base64编码图片数据
 * @property {string} mimeType - MIME类型
 * @property {Annotations} [annotations] - 注解
 */

/**
 * @typedef {Object} AudioContent
 * @property {string} type - 内容类型 "audio"
 * @property {string} data - base64编码音频数据
 * @property {string} mimeType - MIME类型
 * @property {Annotations} [annotations] - 注解
 */

/**
 * @typedef {Object} Tool
 * @property {string} name - 工具名称
 * @property {string} [title] - 工具标题
 * @property {string} [description] - 工具描述
 * @property {Object} inputSchema - 输入Schema
 */

/**
 * @typedef {Object} CallToolResult
 * @property {Array} content - 结果内容
 * @property {boolean} [isError] - 是否错误
 * @property {any} [structuredContent] - 结构化内容
 */

/**
 * @typedef {Object} ClientCapabilities
 * @property {Object} [experimental] - 实验性功能
 * @property {Object} [roots] - 根目录能力
 * @property {boolean} [roots.listChanged] - 支持根目录变更通知
 * @property {Object} [sampling] - 采样能力
 * @property {Object} [elicitation] - 引导能力
 */

/**
 * @typedef {Object} ServerCapabilities
 * @property {Object} [experimental] - 实验性功能
 * @property {Object} [logging] - 日志能力
 * @property {Object} [prompts] - Prompt能力
 * @property {boolean} [prompts.listChanged] - 支持Prompt列表变更通知
 * @property {Object} [resources] - 资源能力
 * @property {boolean} [resources.subscribe] - 支持资源订阅
 * @property {boolean} [resources.listChanged] - 支持资源列表变更通知
 * @property {Object} [tools] - 工具能力
 * @property {boolean} [tools.listChanged] - 支持工具列表变更通知
 */

/**
 * @typedef {Object} Implementation
 * @property {string} name - 实现名称
 * @property {string} version - 实现版本
 */

export default {
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
  isValidTool,
};
