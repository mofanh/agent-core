/**
 * WebPilot Agent 包的类型定义
 * 基于新架构设计的完整类型系统
 */

// ============ 基础类型 ============

export interface WebPilotAgentConfig {
  // LLM 配置
  llm: {
    provider: 'spark' | 'openai' | 'claude'
    model: string
    apiKey?: string
    baseURL?: string
    temperature?: number
    maxTokens?: number
    timeout?: number
  }
  
  // MCP 服务器配置
  mcp: {
    enabledServers: string[]
    timeout?: number
    retryAttempts?: number
    batchSize?: number
    healthCheckInterval?: number
  }
  
  // 功能配置
  features?: {
    streaming?: boolean
    caching?: boolean
    validation?: boolean
    parallelProcessing?: boolean
    debugging?: boolean
  }
  
  // 日志配置
  logging?: {
    level: 'debug' | 'info' | 'warn' | 'error'
    enabled: boolean
    outputFile?: string
  }
  
  // DOM 配置
  dom?: {
    extractionDepth?: number
    includeStyles?: boolean
    cacheTimeout?: number
    sanitizeHTML?: boolean
  }
}

export interface WebPilotAgentOptions {
  // 初始化选项
  autoStart?: boolean
  lazy?: boolean
  
  // 性能选项
  maxConcurrency?: number
  requestTimeout?: number
  
  // 错误处理
  errorRetry?: {
    maxAttempts: number
    backoffMs: number
    exponentialBackoff: boolean
  }
  
  // 事件监听
  onStateChange?: (state: AgentState) => void
  onError?: (error: AgentError) => void
  onProgress?: (progress: AgentProgress) => void
}

// ============ 请求和响应类型 ============

export interface WebPilotAgentRequest {
  id?: string
  type: AgentTaskType
  target?: AgentTarget
  instructions?: string
  operation?: AgentOperation
  context?: WebPilotAgentContext
  options?: RequestOptions
}

export interface WebPilotAgentResponse {
  id: string
  success: boolean
  data?: AgentResult
  error?: AgentError
  metadata: ResponseMetadata
}

export interface WebPilotAgentContext {
  // 页面上下文
  page?: {
    url: string
    title: string
    domain: string
    timestamp: number
  }
  
  // 用户上下文
  user?: {
    preferences: Record<string, any>
    history: Array<AgentTask>
    session: string
  }
  
  // 环境上下文
  environment?: {
    browser: string
    os: string
    viewport: { width: number; height: number }
  }
  
  // 自定义上下文
  custom?: Record<string, any>
}

// ============ 任务和操作类型 ============

export type AgentTaskType = 
  | 'analyze'           // 页面分析
  | 'extract'           // 数据提取
  | 'dom_operation'     // DOM 操作
  | 'navigate'          // 页面导航
  | 'form_fill'         // 表单填写
  | 'screenshot'        // 截图
  | 'monitor'           // 监控变化
  | 'custom'            // 自定义任务

export interface AgentTarget {
  tabId?: number
  url?: string
  selector?: string
  element?: HTMLElement
  frame?: string
}

export interface AgentOperation {
  type: 'click' | 'input' | 'extract' | 'modify' | 'scroll' | 'wait' | 'custom'
  selector?: string
  value?: string | number | boolean
  options?: OperationOptions
  validation?: ValidationRule[]
}

export interface OperationOptions {
  timeout?: number
  retries?: number
  waitFor?: 'element' | 'network' | 'time'
  waitTime?: number
  force?: boolean
  screenshot?: boolean
}

export interface ValidationRule {
  type: 'exists' | 'visible' | 'text' | 'value' | 'count' | 'custom'
  selector?: string
  expected?: any
  validator?: (element: HTMLElement) => boolean
}

// ============ 结果和错误类型 ============

export interface AgentResult {
  type: string
  data: any
  timestamp: number
  source: string
  confidence?: number
  metadata?: Record<string, any>
}

export interface AgentError {
  code: string
  message: string
  details?: Record<string, any>
  stack?: string
  timestamp: number
  recoverable: boolean
}

export interface ResponseMetadata {
  processingTime: number
  tokensUsed?: number
  mcpCallsCount?: number
  retryCount?: number
  cacheHit?: boolean
  timestamp: number
}

// ============ 状态和进度类型 ============

export interface AgentState {
  status: 'idle' | 'initializing' | 'processing' | 'error' | 'cleanup'
  currentTask?: string
  progress?: number
  startTime?: number
  lastActivity?: number
  health: HealthStatus
}

export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  components: {
    llm: ComponentHealth
    mcp: ComponentHealth
    dom: ComponentHealth
  }
  lastCheck: number
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency?: number
  errors?: number
  lastError?: string
}

export interface AgentProgress {
  phase: string
  step: number
  total: number
  message?: string
  data?: any
}

// ============ 能力和任务类型 ============

export interface AgentCapability {
  name: string
  description: string
  version: string
  parameters: CapabilityParameter[]
  examples: CapabilityExample[]
}

export interface CapabilityParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  default?: any
  validation?: any
}

export interface CapabilityExample {
  description: string
  input: any
  output: any
}

export interface AgentTask {
  id: string
  type: AgentTaskType
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  request: WebPilotAgentRequest
  response?: WebPilotAgentResponse
  startTime: number
  endTime?: number
  duration?: number
  retries: number
}

// ============ 配置验证类型 ============

export interface ConfigValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  path: string
  message: string
  code: string
}

export interface ValidationWarning {
  path: string
  message: string
  suggestion?: string
}

// ============ 请求选项类型 ============

export interface RequestOptions {
  timeout?: number
  priority?: 'low' | 'normal' | 'high'
  streaming?: boolean
  cache?: boolean | string
  retries?: number
  validation?: boolean
  context?: Record<string, any>
}

// ============ 统计和监控类型 ============

export interface AgentStats {
  // 基本统计
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  
  // 性能统计
  averageResponseTime: number
  totalTokensUsed: number
  totalMCPCalls: number
  
  // 时间统计
  uptime: number
  lastRequestTime?: number
  
  // 错误统计
  errorsByType: Record<string, number>
  errorsByComponent: Record<string, number>
  
  // 资源使用
  memoryUsage?: number
  cpuUsage?: number
}

export interface MonitoringData {
  timestamp: number
  metrics: {
    responseTime: number
    tokensPerSecond: number
    requestsPerSecond: number
    errorRate: number
    memoryUsage: number
  }
  health: HealthStatus
  activeRequests: number
}

// ============ 事件类型 ============

export type AgentEventType = 
  | 'initialized'
  | 'request:start'
  | 'request:progress' 
  | 'request:complete'
  | 'request:error'
  | 'state:change'
  | 'health:change'
  | 'error'
  | 'cleanup'

export interface AgentEvent {
  type: AgentEventType
  timestamp: number
  data?: any
  source: string
}

// ============ LLM 相关类型 ============

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  name?: string
  tool_call_id?: string
}

export interface LLMToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export interface LLMResponse {
  content: string
  toolCalls?: LLMToolCall[]
  metadata: {
    model: string
    tokensUsed: number
    processingTime: number
    finishReason: string
  }
}

// ============ MCP 相关类型 ============

export interface MCPServerInfo {
  name: string
  version: string
  description: string
  capabilities: string[]
  status: 'active' | 'inactive' | 'error'
  lastHeartbeat?: number
}

export interface MCPExecutionResult {
  serverId: string
  capability: string
  success: boolean
  data?: any
  error?: string
  executionTime: number
}

// ============ 工具函数类型 ============

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface Logger {
  debug(message: string, data?: any): void
  info(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, data?: any): void
}

export interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): void
  off(event: string, listener: (...args: any[]) => void): void
  once(event: string, listener: (...args: any[]) => void): void
  emit(event: string, ...args: any[]): void
}

// ============ 预设类型 ============

export type PresetConfigName = 'basic' | 'performance' | 'debug'

export interface PresetConfig {
  name: PresetConfigName
  description: string
  config: WebPilotAgentConfig
  useCase: string[]
}
