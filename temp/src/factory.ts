/**
 * WebPilot Agent 工厂函数
 * 提供多种方式创建和配置 Agent 实例
 */

import { WebPilotAgent } from './core/agent'
import { AgentValidator } from './validator'
import * as utils from './utils'

import type {
  WebPilotAgentConfig,
  WebPilotAgentOptions,
  PresetConfigName
} from './types'

/**
 * 创建 WebPilot Agent 实例
 */
export function createWebPilotAgent(
  config: WebPilotAgentConfig,
  options?: WebPilotAgentOptions
): WebPilotAgent {
  // 验证配置
  const validation = AgentValidator.validateConfig(config)
  if (!validation.valid) {
    throw utils.createError(
      'CONFIG_INVALID',
      `Configuration validation failed: ${validation.errors.map(e => e.message).join(', ')}`
    )
  }

  // 验证选项
  if (options) {
    const optionsValidation = AgentValidator.validateOptions(options)
    if (!optionsValidation.valid) {
      throw utils.createError(
        'OPTIONS_INVALID',
        `Options validation failed: ${optionsValidation.errors.map(e => e.message).join(', ')}`
      )
    }
  }

  // 验证环境
  const envValidation = AgentValidator.validateEnvironment()
  if (envValidation.warnings.length > 0) {
    console.warn('Environment warnings:', envValidation.warnings.map(w => w.message).join(', '))
  }

  return new WebPilotAgent(config, options || {})
}

/**
 * 从预设配置创建 Agent
 */
export function createFromPreset(
  preset: PresetConfigName,
  overrides?: Partial<WebPilotAgentConfig>,
  options?: WebPilotAgentOptions
): WebPilotAgent {
  const presetConfigs = {
    basic: createBasicConfig(),
    performance: createPerformanceConfig(),
    debug: createDebugConfig()
  }

  const baseConfig = presetConfigs[preset]
  const finalConfig = overrides ? utils.mergeConfigs(baseConfig, overrides) : baseConfig

  return createWebPilotAgent(finalConfig, options)
}

/**
 * 从环境变量创建 Agent
 */
export function createFromEnvironment(
  overrides?: Partial<WebPilotAgentConfig>,
  options?: WebPilotAgentOptions
): WebPilotAgent {
  const envConfig = utils.createConfigFromEnv(overrides)
  
  if (!envConfig.llm?.provider) {
    throw utils.createError(
      'CONFIG_MISSING',
      'LLM provider not specified in environment or overrides'
    )
  }

  return createWebPilotAgent(envConfig as WebPilotAgentConfig, options)
}

/**
 * 创建用于测试的 Agent
 */
export function createTestAgent(
  customConfig?: Partial<WebPilotAgentConfig>
): WebPilotAgent {
  const testConfig = utils.mergeConfigs(
    createDebugConfig(),
    {
      logging: {
        level: 'debug',
        enabled: false // 测试时默认关闭日志
      },
      features: {
        streaming: false,
        caching: false,
        validation: true,
        debugging: true
      },
      ...customConfig
    }
  )

  return createWebPilotAgent(testConfig, {
    autoStart: false,
    maxConcurrency: 1
  })
}

/**
 * 创建生产环境 Agent
 */
export function createProductionAgent(
  apiKey: string,
  customConfig?: Partial<WebPilotAgentConfig>
): WebPilotAgent {
  const productionConfig = utils.mergeConfigs(
    createPerformanceConfig(),
    {
      llm: {
        provider: 'openai' as const,
        model: 'gpt-4',
        apiKey,
        ...customConfig?.llm
      },
      logging: {
        level: 'warn',
        enabled: true
      },
      features: {
        streaming: true,
        caching: true,
        validation: true,
        parallelProcessing: true,
        debugging: false
      },
      ...customConfig
    }
  )

  return createWebPilotAgent(productionConfig, {
    autoStart: true,
    maxConcurrency: 10,
    errorRetry: {
      maxAttempts: 3,
      backoffMs: 1000,
      exponentialBackoff: true
    }
  })
}

/**
 * 批量创建多个 Agent 实例
 */
export function createAgentPool(
  configs: WebPilotAgentConfig[],
  sharedOptions?: WebPilotAgentOptions
): WebPilotAgent[] {
  return configs.map(config => createWebPilotAgent(config, sharedOptions))
}

// ============ 预设配置创建函数 ============

function createBasicConfig(): WebPilotAgentConfig {
  return {
    llm: {
      provider: 'spark',
      model: 'generalv3.5',
      temperature: 0.7,
      maxTokens: 4096,
      timeout: 30000
    },
    mcp: {
      enabledServers: ['dom'],
      timeout: 30000,
      retryAttempts: 3,
      batchSize: 5
    },
    features: {
      streaming: true,
      caching: true,
      validation: true,
      parallelProcessing: false,
      debugging: false
    },
    logging: {
      level: 'info',
      enabled: true
    },
    dom: {
      extractionDepth: 3,
      includeStyles: false,
      cacheTimeout: 30000,
      sanitizeHTML: true
    }
  }
}

function createPerformanceConfig(): WebPilotAgentConfig {
  return {
    llm: {
      provider: 'spark',
      model: 'generalv3.5',
      temperature: 0.3,
      maxTokens: 8192,
      timeout: 60000
    },
    mcp: {
      enabledServers: ['dom', 'web', 'analysis'],
      timeout: 60000,
      retryAttempts: 5,
      batchSize: 10,
      healthCheckInterval: 30000
    },
    features: {
      streaming: true,
      caching: true,
      validation: true,
      parallelProcessing: true,
      debugging: false
    },
    logging: {
      level: 'warn',
      enabled: true
    },
    dom: {
      extractionDepth: 5,
      includeStyles: true,
      cacheTimeout: 60000,
      sanitizeHTML: true
    }
  }
}

function createDebugConfig(): WebPilotAgentConfig {
  return {
    llm: {
      provider: 'spark',
      model: 'generalv3.5',
      temperature: 0.1,
      maxTokens: 2048,
      timeout: 10000
    },
    mcp: {
      enabledServers: ['dom'],
      timeout: 10000,
      retryAttempts: 1,
      batchSize: 1
    },
    features: {
      streaming: false,
      caching: false,
      validation: true,
      parallelProcessing: false,
      debugging: true
    },
    logging: {
      level: 'debug',
      enabled: true
    },
    dom: {
      extractionDepth: 2,
      includeStyles: false,
      cacheTimeout: 10000,
      sanitizeHTML: true
    }
  }
}

// ============ 工具函数 ============

/**
 * 验证配置并提供建议
 */
export function validateAndSuggest(config: WebPilotAgentConfig): {
  valid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
} {
  const validation = AgentValidator.validateConfig(config)
  const suggestions = AgentValidator.suggestOptimizations(config)
  const securityErrors = AgentValidator.validateSecurity(config)

  return {
    valid: validation.valid && securityErrors.length === 0,
    errors: [
      ...validation.errors.map(e => e.message),
      ...securityErrors.map(e => e.message)
    ],
    warnings: validation.warnings.map(w => w.message),
    suggestions
  }
}

/**
 * 比较两个配置的差异
 */
export function compareConfigs(
  config1: WebPilotAgentConfig,
  config2: WebPilotAgentConfig
): {
  differences: Array<{
    path: string
    value1: any
    value2: any
  }>
  summary: {
    identical: boolean
    differenceCount: number
  }
} {
  const differences: Array<{ path: string; value1: any; value2: any }> = []

  function comparePath(obj1: any, obj2: any, path: string = '') {
    if (typeof obj1 !== typeof obj2) {
      differences.push({ path, value1: obj1, value2: obj2 })
      return
    }

    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        differences.push({ path, value1: obj1, value2: obj2 })
      }
      return
    }

    if (typeof obj1 === 'object') {
      const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])
      
      for (const key of keys) {
        const newPath = path ? `${path}.${key}` : key
        
        if (!(key in obj1)) {
          differences.push({ path: newPath, value1: undefined, value2: obj2[key] })
        } else if (!(key in obj2)) {
          differences.push({ path: newPath, value1: obj1[key], value2: undefined })
        } else {
          comparePath(obj1[key], obj2[key], newPath)
        }
      }
    } else if (obj1 !== obj2) {
      differences.push({ path, value1: obj1, value2: obj2 })
    }
  }

  comparePath(config1, config2)

  return {
    differences,
    summary: {
      identical: differences.length === 0,
      differenceCount: differences.length
    }
  }
}

/**
 * 生成配置模板
 */
export function generateConfigTemplate(
  provider: 'spark' | 'openai' | 'claude' = 'spark',
  includeComments: boolean = true
): string {
  const template = {
    llm: {
      provider,
      model: provider === 'spark' ? 'generalv3.5' : provider === 'openai' ? 'gpt-4' : 'claude-3-sonnet-20240229',
      apiKey: '${YOUR_API_KEY}',
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
    },
    logging: {
      level: 'info' as const,
      enabled: true
    }
  }

  if (includeComments) {
    return `/**
 * WebPilot Agent Configuration Template
 * 
 * This is a template configuration for the WebPilot Agent.
 * Replace the placeholder values with your actual configuration.
 */

const config = ${JSON.stringify(template, null, 2)}

// Remember to:
// 1. Replace \${YOUR_API_KEY} with your actual API key
// 2. Adjust the model name according to your provider
// 3. Configure MCP servers based on your needs
// 4. Set appropriate logging level for your environment

export default config`
  }

  return JSON.stringify(template, null, 2)
}

/**
 * 从 URL 参数创建配置
 */
export function createConfigFromParams(params: URLSearchParams): Partial<WebPilotAgentConfig> {
  const config: Partial<WebPilotAgentConfig> = {}

  // LLM 配置
  const provider = params.get('llm_provider')
  if (provider) {
    config.llm = {
      provider: provider as any,
      model: params.get('llm_model') || 'generalv3.5',
      apiKey: params.get('llm_api_key') || undefined,
      temperature: params.get('llm_temperature') ? parseFloat(params.get('llm_temperature')!) : undefined,
      maxTokens: params.get('llm_max_tokens') ? parseInt(params.get('llm_max_tokens')!) : undefined
    }
  }

  // MCP 配置
  const mcpServers = params.get('mcp_servers')
  if (mcpServers) {
    config.mcp = {
      enabledServers: mcpServers.split(',').map(s => s.trim()),
      timeout: params.get('mcp_timeout') ? parseInt(params.get('mcp_timeout')!) : undefined
    }
  }

  // 日志配置
  const logLevel = params.get('log_level')
  if (logLevel) {
    config.logging = {
      level: logLevel as any,
      enabled: params.get('log_enabled') !== 'false'
    }
  }

  return config
}
