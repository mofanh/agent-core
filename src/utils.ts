/**
 * WebPilot Agent 工具函数
 * 提供常用的辅助工具和实用函数
 */

import type {
  WebPilotAgentConfig,
  WebPilotAgentRequest,
  WebPilotAgentResponse,
  AgentError,
  AgentResult,
  PresetConfigName
} from './types'

// ============ 配置工具函数 ============

/**
 * 合并配置对象
 */
export function mergeConfigs(
  base: Partial<WebPilotAgentConfig>,
  override: Partial<WebPilotAgentConfig>
): WebPilotAgentConfig {
  return {
    llm: {
      ...base.llm,
      ...override.llm
    },
    mcp: {
      ...base.mcp,
      ...override.mcp,
      enabledServers: override.mcp?.enabledServers || base.mcp?.enabledServers || []
    },
    features: {
      ...base.features,
      ...override.features
    },
    logging: {
      ...base.logging,
      ...override.logging
    },
    dom: {
      ...base.dom,
      ...override.dom
    }
  } as WebPilotAgentConfig
}

/**
 * 克隆配置对象
 */
export function cloneConfig(config: WebPilotAgentConfig): WebPilotAgentConfig {
  return JSON.parse(JSON.stringify(config))
}

/**
 * 从环境变量创建配置
 */
export function createConfigFromEnv(overrides?: Partial<WebPilotAgentConfig>): Partial<WebPilotAgentConfig> {
  const envConfig: Partial<WebPilotAgentConfig> = {}

  // LLM 配置
  if (typeof process !== 'undefined' && process.env) {
    const env = process.env
    
    if (env.WEBPILOT_LLM_PROVIDER) {
      envConfig.llm = {
        provider: env.WEBPILOT_LLM_PROVIDER as any,
        model: env.WEBPILOT_LLM_MODEL || 'generalv3.5',
        apiKey: env.WEBPILOT_LLM_API_KEY,
        baseURL: env.WEBPILOT_LLM_BASE_URL,
        temperature: env.WEBPILOT_LLM_TEMPERATURE ? parseFloat(env.WEBPILOT_LLM_TEMPERATURE) : undefined,
        maxTokens: env.WEBPILOT_LLM_MAX_TOKENS ? parseInt(env.WEBPILOT_LLM_MAX_TOKENS) : undefined
      }
    }

    // MCP 配置
    if (env.WEBPILOT_MCP_SERVERS) {
      envConfig.mcp = {
        enabledServers: env.WEBPILOT_MCP_SERVERS.split(',').map(s => s.trim()),
        timeout: env.WEBPILOT_MCP_TIMEOUT ? parseInt(env.WEBPILOT_MCP_TIMEOUT) : undefined
      }
    }

    // 日志配置
    if (env.WEBPILOT_LOG_LEVEL) {
      envConfig.logging = {
        level: env.WEBPILOT_LOG_LEVEL as any,
        enabled: env.WEBPILOT_LOG_ENABLED !== 'false'
      }
    }
  }

  return overrides ? mergeConfigs(envConfig, overrides) : envConfig
}

// ============ 请求/响应工具函数 ============

/**
 * 生成唯一的请求 ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建标准化的请求对象
 */
export function createRequest(
  type: WebPilotAgentRequest['type'],
  data: any,
  options?: Partial<WebPilotAgentRequest>
): WebPilotAgentRequest {
  return {
    id: generateRequestId(),
    type,
    instructions: data.instructions || data.task || '',
    target: data.target,
    operation: data.operation,
    context: data.context,
    ...options
  }
}

/**
 * 创建成功响应
 */
export function createSuccessResponse(
  requestId: string,
  data: AgentResult,
  metadata: Partial<WebPilotAgentResponse['metadata']> = {}
): WebPilotAgentResponse {
  return {
    id: `resp_${requestId}`,
    success: true,
    data,
    metadata: {
      processingTime: 0,
      timestamp: Date.now(),
      ...metadata
    }
  }
}

/**
 * 创建错误响应
 */
export function createErrorResponse(
  requestId: string,
  error: AgentError | string,
  metadata: Partial<WebPilotAgentResponse['metadata']> = {}
): WebPilotAgentResponse {
  const agentError: AgentError = typeof error === 'string' 
    ? createError('UNKNOWN', error)
    : error

  return {
    id: `resp_${requestId}`,
    success: false,
    error: agentError,
    metadata: {
      processingTime: 0,
      timestamp: Date.now(),
      ...metadata
    }
  }
}

/**
 * 创建标准化的错误对象
 */
export function createError(
  code: string,
  message: string,
  details?: Record<string, any>,
  recoverable: boolean = true
): AgentError {
  return {
    code,
    message,
    details,
    timestamp: Date.now(),
    recoverable
  }
}

// ============ 数据处理工具函数 ============

/**
 * 安全的 JSON 解析
 */
export function safeJsonParse<T = any>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return defaultValue
  }
}

/**
 * 安全的 JSON 序列化
 */
export function safeJsonStringify(obj: any, indent?: number): string {
  try {
    return JSON.stringify(obj, null, indent)
  } catch {
    return '{}'
  }
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]
      
      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue as any, sourceValue as any) as any
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue as any
      }
    }
  }
  
  return result
}

/**
 * 检查是否为对象
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

// ============ 时间和延迟工具函数 ============

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 带超时的 Promise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(createError('TIMEOUT', timeoutMessage)), timeoutMs)
    )
  ])
}

/**
 * 重试机制
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    backoffMs?: number
    exponentialBackoff?: boolean
    shouldRetry?: (error: any) => boolean
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    backoffMs = 1000,
    exponentialBackoff = true,
    shouldRetry = () => true
  } = options

  let lastError: any
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error
      }
      
      const delayMs = exponentialBackoff 
        ? backoffMs * Math.pow(2, attempt - 1)
        : backoffMs
        
      await delay(delayMs)
    }
  }
  
  throw lastError
}

// ============ 性能监控工具函数 ============

/**
 * 性能计时器
 */
export class PerformanceTimer {
  private startTime: number
  private endTime?: number

  constructor() {
    this.startTime = performance.now()
  }

  /**
   * 停止计时并返回耗时（毫秒）
   */
  stop(): number {
    this.endTime = performance.now()
    return this.getDuration()
  }

  /**
   * 获取当前耗时（毫秒）
   */
  getDuration(): number {
    const end = this.endTime || performance.now()
    return end - this.startTime
  }
}

/**
 * 性能测量装饰器
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  onComplete?: (duration: number, result: any) => void
): T {
  return ((...args: any[]) => {
    const timer = new PerformanceTimer()
    
    try {
      const result = fn(...args)
      
      if (result instanceof Promise) {
        return result.then((value) => {
          const duration = timer.stop()
          onComplete?.(duration, value)
          return value
        })
      } else {
        const duration = timer.stop()
        onComplete?.(duration, result)
        return result
      }
    } catch (error) {
      timer.stop()
      throw error
    }
  }) as T
}

// ============ 验证工具函数 ============

/**
 * 验证字符串格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证选择器格式
 */
export function isValidSelector(selector: string): boolean {
  try {
    document.querySelector(selector)
    return true
  } catch {
    return false
  }
}

/**
 * 验证 Tab ID
 */
export function isValidTabId(tabId: any): tabId is number {
  return typeof tabId === 'number' && tabId > 0 && Number.isInteger(tabId)
}

// ============ 数组和集合工具函数 ============

/**
 * 数组去重
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * 数组分批处理
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  
  return chunks
}

/**
 * 并行处理数组项目
 */
export async function processInParallel<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  const chunks = chunk(items, concurrency)
  
  for (const chunk of chunks) {
    const promises = chunk.map(async (item, chunkIndex) => {
      const originalIndex = chunks.indexOf(chunk) * concurrency + chunkIndex
      const result = await processor(item, originalIndex)
      results[originalIndex] = result
      return result
    })
    
    await Promise.all(promises)
  }
  
  return results
}

// ============ 调试工具函数 ============

/**
 * 调试信息收集器
 */
export function collectDebugInfo() {
  const info = {
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    memory: typeof performance !== 'undefined' && (performance as any).memory 
      ? {
          used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024)
        }
      : undefined,
    extensions: typeof chrome !== 'undefined' && chrome.runtime ? {
      id: chrome.runtime.id,
      version: chrome.runtime.getManifest?.()?.version
    } : undefined
  }

  return info
}

/**
 * 生成调试报告
 */
export function generateDebugReport(
  config: WebPilotAgentConfig,
  error?: any,
  context?: any
): string {
  const report = {
    timestamp: new Date().toISOString(),
    config: {
      llm: {
        provider: config.llm.provider,
        model: config.llm.model,
        hasApiKey: !!config.llm.apiKey
      },
      mcp: {
        enabledServers: config.mcp.enabledServers,
        serverCount: config.mcp.enabledServers.length
      },
      features: config.features
    },
    systemInfo: collectDebugInfo(),
    error: error ? {
      message: error.message || String(error),
      stack: error.stack,
      code: error.code
    } : undefined,
    context
  }

  return safeJsonStringify(report, 2)
}
