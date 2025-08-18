/**
 * @webpilot/agent - WebPilot Agent Package
 * 独立可调用的智能代理包，基于动态流程循环架构
 * 
 * @description 实现 in → buildprompt → LLM Provider → out → MCP 服务器 → buildprompt → in 的动态流程循环
 * @version 1.0.0
 * @author WebPilot Team
 */

// ============ 核心导出 ============
export { WebPilotAgent } from './core/agent'
export { 
  createWebPilotAgent,
  createFromPreset,
  createFromEnvironment,
  createTestAgent,
  createProductionAgent,
  createAgentPool,
  validateAndSuggest,
  compareConfigs,
  generateConfigTemplate,
  createConfigFromParams
} from './factory'

// ============ 类型导出 ============
export type {
  WebPilotAgentConfig,
  WebPilotAgentRequest,
  WebPilotAgentResponse,
  WebPilotAgentContext,
  WebPilotAgentOptions,
  AgentCapability,
  AgentTask,
  AgentResult,
  AgentState,
  AgentStats,
  HealthStatus,
  LogLevel,
  Logger,
  EventEmitter,
  PresetConfigName,
  AgentError,
  ConfigValidationResult,
  ValidationError,
  ValidationWarning
} from './types'

// ============ 工具导出 ============
export { AgentLogger, PerformanceLogger, createDefaultLogger, silentLogger } from './logger'
export { AgentValidator } from './validator'

// ============ 便捷导出 ============
export * from './utils'

// ============ 预设配置 ============
import type { WebPilotAgentConfig, WebPilotAgentOptions } from './types'
import { createWebPilotAgent } from './factory'

export const PRESET_CONFIGS = {
  // 基础配置
  basic: {
    llm: {
      provider: 'spark' as const,
      model: 'generalv3.5',
      temperature: 0.7,
      maxTokens: 4096
    },
    mcp: {
      enabledServers: ['dom'],
      timeout: 30000,
      retryAttempts: 3
    },
    features: {
      streaming: true,
      caching: true,
      validation: true
    }
  } as WebPilotAgentConfig,
  
  // 高性能配置
  performance: {
    llm: {
      provider: 'spark' as const,
      model: 'generalv3.5',
      temperature: 0.3,
      maxTokens: 8192
    },
    mcp: {
      enabledServers: ['dom', 'web', 'analysis'],
      timeout: 60000,
      retryAttempts: 5,
      batchSize: 10
    },
    features: {
      streaming: true,
      caching: true,
      validation: true,
      parallelProcessing: true
    }
  } as WebPilotAgentConfig,
  
  // 调试配置
  debug: {
    llm: {
      provider: 'spark' as const,
      model: 'generalv3.5',
      temperature: 0.1,
      maxTokens: 2048
    },
    mcp: {
      enabledServers: ['dom'],
      timeout: 10000,
      retryAttempts: 1
    },
    features: {
      streaming: false,
      caching: false,
      validation: true,
      debugging: true
    },
    logging: {
      level: 'debug' as const,
      enabled: true
    }
  } as WebPilotAgentConfig
}

// ============ 快速启动函数 ============

/**
 * 快速创建并启动 WebPilot Agent
 * @param config 配置选项，可以使用预设配置或自定义配置
 * @param options 额外选项
 * @returns 初始化完成的 Agent 实例
 */
export async function quickStart(
  config: WebPilotAgentConfig | keyof typeof PRESET_CONFIGS = 'basic',
  options?: Partial<WebPilotAgentOptions>
) {
  const finalConfig = typeof config === 'string' ? PRESET_CONFIGS[config] : config
  
  const agent = createWebPilotAgent(finalConfig, options)
  await agent.initialize()
  
  return agent
}

/**
 * 简化的页面分析函数
 */
export async function analyzePage(
  tabId: number,
  task: string,
  config?: Partial<WebPilotAgentConfig>
) {
  const agent = await quickStart(config ? { ...PRESET_CONFIGS.basic, ...config } : 'basic')
  
  try {
    const result = await agent.execute({
      type: 'analyze',
      target: { tabId },
      instructions: task
    })
    
    return result
  } finally {
    await agent.cleanup()
  }
}

/**
 * 简化的 DOM 操作函数
 */
export async function manipulateDOM(
  tabId: number,
  operations: Array<{
    type: 'click' | 'input' | 'extract' | 'modify'
    selector: string
    value?: string
    options?: any
  }>,
  config?: Partial<WebPilotAgentConfig>
) {
  const agent = await quickStart(config ? { ...PRESET_CONFIGS.basic, ...config } : 'basic')
  
  try {
    const results = []
    
    for (const operation of operations) {
      const result = await agent.execute({
        type: 'dom_operation',
        target: { tabId },
        operation
      })
      results.push(result)
    }
    
    return results
  } finally {
    await agent.cleanup()
  }
}

/**
 * 批量任务处理函数
 */
export async function batchProcess(
  tasks: Array<{
    type: string
    target?: any
    instructions?: string
    operation?: any
  }>,
  config?: Partial<WebPilotAgentConfig>
) {
  const agent = await quickStart(config ? { ...PRESET_CONFIGS.performance, ...config } : 'performance')
  
  try {
    const results = await agent.executeBatch(tasks.map(task => ({
      type: task.type as any,
      target: task.target,
      instructions: task.instructions,
      operation: task.operation
    })))
    return results
  } finally {
    await agent.cleanup()
  }
}

// ============ 版本信息 ============
export const VERSION = '1.0.0'
export const BUILD_TIME = new Date().toISOString()

// ============ 调试工具 ============
export const DEBUG_TOOLS = {
  /**
   * 验证配置是否正确
   */
  validateConfig(config: WebPilotAgentConfig): boolean {
    try {
      const { AgentValidator } = require('./validator')
      AgentValidator.validateConfig(config)
      return true
    } catch (error) {
      console.error('Config validation failed:', error)
      return false
    }
  },
  
  /**
   * 获取系统信息
   */
  getSystemInfo() {
    return {
      version: VERSION,
      buildTime: BUILD_TIME,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js',
      timestamp: new Date().toISOString()
    }
  },
  
  /**
   * 测试连接
   */
  async testConnection(config: WebPilotAgentConfig) {
    try {
      const agent = createWebPilotAgent(config)
      await agent.initialize()
      const health = await agent.getHealth()
      await agent.cleanup()
      return health
    } catch (error) {
      return { status: 'error', error: (error as Error).message }
    }
  }
}
