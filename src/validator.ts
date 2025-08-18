/**
 * WebPilot Agent 配置验证器
 * 提供完整的配置验证和错误检查功能
 */

import type {
  WebPilotAgentConfig,
  WebPilotAgentOptions,
  ConfigValidationResult,
  ValidationError,
  ValidationWarning
} from './types'

export class AgentValidator {
  /**
   * 验证 Agent 配置
   */
  static validateConfig(config: WebPilotAgentConfig): ConfigValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    try {
      // 验证基本结构
      if (!config || typeof config !== 'object') {
        errors.push({
          path: 'config',
          message: 'Configuration must be a valid object',
          code: 'INVALID_CONFIG_TYPE'
        })
        return { valid: false, errors, warnings }
      }

      // 验证 LLM 配置
      this.validateLLMConfig(config.llm, errors, warnings)

      // 验证 MCP 配置
      this.validateMCPConfig(config.mcp, errors, warnings)

      // 验证功能配置
      if (config.features) {
        this.validateFeaturesConfig(config.features, errors, warnings)
      }

      // 验证日志配置
      if (config.logging) {
        this.validateLoggingConfig(config.logging, errors, warnings)
      }

      // 验证 DOM 配置
      if (config.dom) {
        this.validateDOMConfig(config.dom, errors, warnings)
      }

    } catch (error) {
      errors.push({
        path: 'config',
        message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        code: 'VALIDATION_ERROR'
      })
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * 验证 Agent 选项
   */
  static validateOptions(options: WebPilotAgentOptions): ConfigValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    if (!options || typeof options !== 'object') {
      return { valid: true, errors, warnings } // 选项是可选的
    }

    // 验证数值范围
    if (options.maxConcurrency !== undefined) {
      if (!Number.isInteger(options.maxConcurrency) || options.maxConcurrency < 1) {
        errors.push({
          path: 'options.maxConcurrency',
          message: 'maxConcurrency must be a positive integer',
          code: 'INVALID_CONCURRENCY'
        })
      }
    }

    if (options.requestTimeout !== undefined) {
      if (!Number.isInteger(options.requestTimeout) || options.requestTimeout < 1000) {
        errors.push({
          path: 'options.requestTimeout',
          message: 'requestTimeout must be at least 1000ms',
          code: 'INVALID_TIMEOUT'
        })
      }
    }

    // 验证错误重试配置
    if (options.errorRetry) {
      const retry = options.errorRetry
      
      if (!Number.isInteger(retry.maxAttempts) || retry.maxAttempts < 1) {
        errors.push({
          path: 'options.errorRetry.maxAttempts',
          message: 'maxAttempts must be a positive integer',
          code: 'INVALID_RETRY_ATTEMPTS'
        })
      }

      if (!Number.isInteger(retry.backoffMs) || retry.backoffMs < 0) {
        errors.push({
          path: 'options.errorRetry.backoffMs',
          message: 'backoffMs must be a non-negative integer',
          code: 'INVALID_BACKOFF'
        })
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * 验证环境要求
   */
  static validateEnvironment(): ConfigValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // 检查浏览器环境
    if (typeof window === 'undefined') {
      warnings.push({
        path: 'environment',
        message: 'Running in Node.js environment, some features may be limited',
        suggestion: 'Consider using in browser environment for full functionality'
      })
    }

    // 检查必要的 API
    if (typeof window !== 'undefined') {
      if (!window.chrome?.runtime) {
        warnings.push({
          path: 'environment.chrome',
          message: 'Chrome extension APIs not available',
          suggestion: 'Ensure running as Chrome extension or use standalone mode'
        })
      }

      if (!window.performance) {
        warnings.push({
          path: 'environment.performance',
          message: 'Performance API not available',
          suggestion: 'Performance monitoring will be disabled'
        })
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  // ============ 私有验证方法 ============

  private static validateLLMConfig(
    llm: WebPilotAgentConfig['llm'],
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!llm) {
      errors.push({
        path: 'llm',
        message: 'LLM configuration is required',
        code: 'MISSING_LLM_CONFIG'
      })
      return
    }

    // 验证提供商
    const supportedProviders = ['spark', 'openai', 'claude']
    if (!supportedProviders.includes(llm.provider)) {
      errors.push({
        path: 'llm.provider',
        message: `Unsupported LLM provider: ${llm.provider}. Supported: ${supportedProviders.join(', ')}`,
        code: 'UNSUPPORTED_PROVIDER'
      })
    }

    // 验证模型
    if (!llm.model || typeof llm.model !== 'string') {
      errors.push({
        path: 'llm.model',
        message: 'Model name is required and must be a string',
        code: 'INVALID_MODEL'
      })
    }

    // 验证 API 密钥
    if (!llm.apiKey) {
      warnings.push({
        path: 'llm.apiKey',
        message: 'API key not provided for LLM provider',
        suggestion: 'Provide API key for better reliability'
      })
    }

    // 验证数值参数
    if (llm.temperature !== undefined) {
      if (typeof llm.temperature !== 'number' || llm.temperature < 0 || llm.temperature > 2) {
        errors.push({
          path: 'llm.temperature',
          message: 'Temperature must be a number between 0 and 2',
          code: 'INVALID_TEMPERATURE'
        })
      }
    }

    if (llm.maxTokens !== undefined) {
      if (!Number.isInteger(llm.maxTokens) || llm.maxTokens < 1) {
        errors.push({
          path: 'llm.maxTokens',
          message: 'maxTokens must be a positive integer',
          code: 'INVALID_MAX_TOKENS'
        })
      }
    }

    if (llm.timeout !== undefined) {
      if (!Number.isInteger(llm.timeout) || llm.timeout < 1000) {
        errors.push({
          path: 'llm.timeout',
          message: 'timeout must be at least 1000ms',
          code: 'INVALID_LLM_TIMEOUT'
        })
      }
    }
  }

  private static validateMCPConfig(
    mcp: WebPilotAgentConfig['mcp'],
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!mcp) {
      errors.push({
        path: 'mcp',
        message: 'MCP configuration is required',
        code: 'MISSING_MCP_CONFIG'
      })
      return
    }

    // 验证启用的服务器
    if (!Array.isArray(mcp.enabledServers)) {
      errors.push({
        path: 'mcp.enabledServers',
        message: 'enabledServers must be an array',
        code: 'INVALID_ENABLED_SERVERS'
      })
    } else if (mcp.enabledServers.length === 0) {
      warnings.push({
        path: 'mcp.enabledServers',
        message: 'No MCP servers enabled',
        suggestion: 'Enable at least one MCP server for functionality'
      })
    }

    // 验证超时
    if (mcp.timeout !== undefined) {
      if (!Number.isInteger(mcp.timeout) || mcp.timeout < 1000) {
        errors.push({
          path: 'mcp.timeout',
          message: 'timeout must be at least 1000ms',
          code: 'INVALID_MCP_TIMEOUT'
        })
      }
    }

    // 验证重试次数
    if (mcp.retryAttempts !== undefined) {
      if (!Number.isInteger(mcp.retryAttempts) || mcp.retryAttempts < 0) {
        errors.push({
          path: 'mcp.retryAttempts',
          message: 'retryAttempts must be a non-negative integer',
          code: 'INVALID_RETRY_ATTEMPTS'
        })
      }
    }

    // 验证批处理大小
    if (mcp.batchSize !== undefined) {
      if (!Number.isInteger(mcp.batchSize) || mcp.batchSize < 1) {
        errors.push({
          path: 'mcp.batchSize',
          message: 'batchSize must be a positive integer',
          code: 'INVALID_BATCH_SIZE'
        })
      }
    }
  }

  private static validateFeaturesConfig(
    features: NonNullable<WebPilotAgentConfig['features']>,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const booleanFeatures = ['streaming', 'caching', 'validation', 'parallelProcessing', 'debugging']
    
    for (const feature of booleanFeatures) {
      const featureValue = (features as any)[feature]
      if (featureValue !== undefined && typeof featureValue !== 'boolean') {
        errors.push({
          path: `features.${feature}`,
          message: `${feature} must be a boolean`,
          code: 'INVALID_FEATURE_TYPE'
        })
      }
    }

    // 兼容性检查
    if (features.parallelProcessing && !features.validation) {
      warnings.push({
        path: 'features',
        message: 'Parallel processing without validation may cause issues',
        suggestion: 'Enable validation when using parallel processing'
      })
    }
  }

  private static validateLoggingConfig(
    logging: NonNullable<WebPilotAgentConfig['logging']>,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const validLevels = ['debug', 'info', 'warn', 'error']
    
    if (!validLevels.includes(logging.level)) {
      errors.push({
        path: 'logging.level',
        message: `Invalid log level: ${logging.level}. Valid levels: ${validLevels.join(', ')}`,
        code: 'INVALID_LOG_LEVEL'
      })
    }

    if (typeof logging.enabled !== 'boolean') {
      errors.push({
        path: 'logging.enabled',
        message: 'enabled must be a boolean',
        code: 'INVALID_ENABLED_TYPE'
      })
    }

    if (logging.outputFile !== undefined && typeof logging.outputFile !== 'string') {
      errors.push({
        path: 'logging.outputFile',
        message: 'outputFile must be a string',
        code: 'INVALID_OUTPUT_FILE'
      })
    }
  }

  private static validateDOMConfig(
    dom: NonNullable<WebPilotAgentConfig['dom']>,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (dom.extractionDepth !== undefined) {
      if (!Number.isInteger(dom.extractionDepth) || dom.extractionDepth < 1) {
        errors.push({
          path: 'dom.extractionDepth',
          message: 'extractionDepth must be a positive integer',
          code: 'INVALID_EXTRACTION_DEPTH'
        })
      }
    }

    if (dom.includeStyles !== undefined && typeof dom.includeStyles !== 'boolean') {
      errors.push({
        path: 'dom.includeStyles',
        message: 'includeStyles must be a boolean',
        code: 'INVALID_INCLUDE_STYLES'
      })
    }

    if (dom.cacheTimeout !== undefined) {
      if (!Number.isInteger(dom.cacheTimeout) || dom.cacheTimeout < 0) {
        errors.push({
          path: 'dom.cacheTimeout',
          message: 'cacheTimeout must be a non-negative integer',
          code: 'INVALID_CACHE_TIMEOUT'
        })
      }
    }

    if (dom.sanitizeHTML !== undefined && typeof dom.sanitizeHTML !== 'boolean') {
      errors.push({
        path: 'dom.sanitizeHTML',
        message: 'sanitizeHTML must be a boolean',
        code: 'INVALID_SANITIZE_HTML'
      })
    }
  }

  /**
   * 提供配置建议
   */
  static suggestOptimizations(config: WebPilotAgentConfig): string[] {
    const suggestions: string[] = []

    // LLM 优化建议
    if (config.llm.temperature === undefined) {
      suggestions.push('Consider setting LLM temperature for more consistent results')
    }

    if (config.llm.maxTokens === undefined) {
      suggestions.push('Set maxTokens to control response length and costs')
    }

    // MCP 优化建议
    if (config.mcp.batchSize === undefined && config.mcp.enabledServers.length > 1) {
      suggestions.push('Set batchSize for better performance with multiple MCP servers')
    }

    // 功能优化建议
    if (!config.features?.caching) {
      suggestions.push('Enable caching to improve performance for repeated requests')
    }

    if (!config.features?.validation) {
      suggestions.push('Enable validation to catch errors early')
    }

    // 日志优化建议
    if (!config.logging || config.logging.level === 'debug') {
      suggestions.push('Use info or warn log level in production for better performance')
    }

    return suggestions
  }

  /**
   * 验证配置安全性
   */
  static validateSecurity(config: WebPilotAgentConfig): ValidationError[] {
    const errors: ValidationError[] = []

    // 检查敏感信息
    if (config.llm.apiKey && config.llm.apiKey.length < 10) {
      errors.push({
        path: 'llm.apiKey',
        message: 'API key appears to be too short',
        code: 'WEAK_API_KEY'
      })
    }

    // 检查不安全的配置
    if (config.dom?.sanitizeHTML === false) {
      errors.push({
        path: 'dom.sanitizeHTML',
        message: 'Disabling HTML sanitization may pose security risks',
        code: 'SECURITY_RISK'
      })
    }

    return errors
  }
}
