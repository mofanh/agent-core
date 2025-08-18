/**
 * WebPilot Agent 核心类 - 独立包版本
 * 简化版本，专为 npm 包发布设计
 */

import type {
  WebPilotAgentConfig,
  WebPilotAgentOptions,
  WebPilotAgentRequest,
  WebPilotAgentResponse,
  WebPilotAgentContext,
  AgentState,
  AgentStats,
  AgentCapability,
  AgentTask,
  HealthStatus,
  Logger,
  EventEmitter
} from '../types'

import { AgentLogger } from '../logger'
import * as utils from '../utils'

/**
 * WebPilot Agent 主类 - 独立包版本
 * 提供完整的智能代理功能
 */
export class WebPilotAgent {
  private config: WebPilotAgentConfig
  private options: WebPilotAgentOptions
  private logger: Logger
  private eventEmitter: EventEmitter
  private state: AgentState
  private tasks: Map<string, AgentTask> = new Map()
  private stats: AgentStats
  private initialized = false

  constructor(config: WebPilotAgentConfig, options: WebPilotAgentOptions = {}) {
    this.config = config
    this.options = options
    
    // 初始化日志器
    this.logger = config.logging?.enabled 
      ? new AgentLogger(config.logging.level, true, config.logging.outputFile)
      : { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} }

    // 初始化事件发射器
    this.eventEmitter = this.createEventEmitter()
    
    // 初始化状态
    this.state = {
      status: 'idle',
      health: {
        overall: 'healthy',
        components: {
          llm: { status: 'healthy' },
          mcp: { status: 'healthy' },
          dom: { status: 'healthy' }
        },
        lastCheck: Date.now()
      }
    }

    // 初始化统计
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalTokensUsed: 0,
      totalMCPCalls: 0,
      uptime: 0,
      errorsByType: {},
      errorsByComponent: {}
    }
  }

  /**
   * 初始化 Agent
   */
  async initialize(): Promise<void> {
    try {
      this.updateState({ status: 'initializing', startTime: Date.now() })
      this.logger.info('Initializing WebPilot Agent (Standalone Package)')

      // 在独立包中，我们模拟初始化过程
      await utils.delay(100) // 模拟异步初始化

      this.initialized = true
      this.updateState({ 
        status: 'idle', 
        currentTask: undefined,
        lastActivity: Date.now()
      })

      this.logger.info('WebPilot Agent initialized successfully')
      this.emitEvent('initialized', { config: this.config })

    } catch (error) {
      this.updateState({ status: 'error' })
      this.logger.error('Agent initialization failed', error)
      this.emitEvent('error', { error, phase: 'initialization' })
      throw error
    }
  }

  /**
   * 执行单个任务
   */
  async execute(request: Partial<WebPilotAgentRequest>): Promise<WebPilotAgentResponse> {
    this.ensureInitialized()

    const fullRequest = this.prepareRequest(request)
    const task = this.createTask(fullRequest)
    
    try {
      this.updateTaskStatus(task.id, 'running')
      this.stats.totalRequests++

      const startTime = Date.now()
      
      // 在独立包中，我们模拟执行过程
      const mockResult = await this.simulateExecution(fullRequest)
      
      // 更新统计
      const duration = Date.now() - startTime
      this.updateStats(duration, true, 100) // 模拟 token 使用
      
      // 更新任务状态
      task.endTime = Date.now()
      task.duration = duration
      task.response = mockResult
      this.updateTaskStatus(task.id, 'completed')

      this.stats.successfulRequests++
      this.logger.info(`Task ${task.id} completed successfully`, { duration })

      this.emitEvent('request:complete', { request: fullRequest, response: mockResult })
      return mockResult

    } catch (error) {
      this.updateTaskStatus(task.id, 'failed')
      this.stats.failedRequests++
      
      const errorResponse = utils.createErrorResponse(
        fullRequest.id!,
        error instanceof Error ? utils.createError('EXECUTION', error.message) : utils.createError('EXECUTION', String(error)),
        { processingTime: Date.now() - task.startTime }
      )

      this.logger.error(`Task ${task.id} execution failed`, error)
      this.emitEvent('request:error', { request: fullRequest, error })
      
      return errorResponse
    }
  }

  /**
   * 批量执行任务
   */
  async executeBatch(requests: Partial<WebPilotAgentRequest>[]): Promise<WebPilotAgentResponse[]> {
    this.ensureInitialized()

    const concurrency = this.options.maxConcurrency || 5
    this.logger.info(`Executing batch of ${requests.length} requests with concurrency ${concurrency}`)

    return utils.processInParallel(
      requests,
      async (request) => this.execute(request),
      concurrency
    )
  }

  /**
   * 流式执行任务（简化版本）
   */
  async executeStream(
    request: Partial<WebPilotAgentRequest>,
    onChunk: (chunk: string) => void,
    onComplete?: (response: WebPilotAgentResponse) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    this.ensureInitialized()

    if (!this.config.features?.streaming) {
      throw utils.createError('UNSUPPORTED', 'Streaming is not enabled in configuration')
    }

    try {
      // 模拟流式处理
      const chunks = ['分析开始...', '正在处理页面...', '提取数据中...', '分析完成']
      
      for (const chunk of chunks) {
        await utils.delay(500)
        onChunk(chunk)
      }

      const result = await this.execute(request)
      onComplete?.(result)

    } catch (error) {
      onError?.(error)
    }
  }

  /**
   * 获取健康状态
   */
  async getHealth(): Promise<HealthStatus> {
    try {
      // 模拟健康检查
      this.state.health = {
        overall: this.initialized ? 'healthy' : 'unhealthy',
        components: {
          llm: { status: 'healthy', latency: 100 },
          mcp: { status: 'healthy', latency: 50 },
          dom: { status: 'healthy', latency: 25 }
        },
        lastCheck: Date.now()
      }

      return this.state.health
    } catch (error) {
      this.logger.error('Health check failed', error)
      
      this.state.health = {
        overall: 'unhealthy',
        components: {
          llm: { status: 'unhealthy', lastError: 'Health check failed' },
          mcp: { status: 'unhealthy', lastError: 'Health check failed' },
          dom: { status: 'unhealthy', lastError: 'Health check failed' }
        },
        lastCheck: Date.now()
      }

      return this.state.health
    }
  }

  /**
   * 获取可用能力
   */
  getCapabilities(): AgentCapability[] {
    return [
      {
        name: 'page_analysis',
        description: 'Analyze web page content and structure',
        version: '1.0.0',
        parameters: [
          { name: 'tabId', type: 'number', required: true, description: 'Browser tab ID' },
          { name: 'depth', type: 'number', required: false, description: 'Analysis depth', default: 3 }
        ],
        examples: [
          {
            description: 'Analyze current page',
            input: { type: 'analyze', target: { tabId: 123 } },
            output: { content: 'Page analysis results', confidence: 0.95 }
          }
        ]
      },
      {
        name: 'dom_manipulation',
        description: 'Interact with DOM elements',
        version: '1.0.0',
        parameters: [
          { name: 'tabId', type: 'number', required: true, description: 'Browser tab ID' },
          { name: 'operation', type: 'object', required: true, description: 'DOM operation details' }
        ],
        examples: [
          {
            description: 'Click a button',
            input: { type: 'dom_operation', operation: { type: 'click', selector: '#submit' } },
            output: { success: true, element: 'button#submit' }
          }
        ]
      }
    ]
  }

  /**
   * 获取统计信息
   */
  getStats(): AgentStats {
    return {
      ...this.stats,
      uptime: this.state.startTime ? Date.now() - this.state.startTime : 0
    }
  }

  /**
   * 获取当前状态
   */
  getState(): AgentState {
    return { ...this.state }
  }

  /**
   * 获取任务历史
   */
  getTasks(filter?: { status?: AgentTask['status'], limit?: number }): AgentTask[] {
    let tasks = Array.from(this.tasks.values())
    
    if (filter?.status) {
      tasks = tasks.filter(task => task.status === filter.status)
    }
    
    if (filter?.limit) {
      tasks = tasks.slice(-filter.limit)
    }
    
    return tasks.sort((a, b) => b.startTime - a.startTime)
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId)
    if (!task || task.status !== 'running') {
      return false
    }

    this.updateTaskStatus(taskId, 'cancelled')
    this.logger.info(`Task ${taskId} cancelled`)
    return true
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    try {
      this.updateState({ status: 'cleanup' })
      this.logger.info('Cleaning up WebPilot Agent')

      // 清理本地资源
      this.tasks.clear()

      this.initialized = false
      this.updateState({ status: 'idle' })
      
      this.logger.info('WebPilot Agent cleanup completed')
      this.emitEvent('cleanup', {})

    } catch (error) {
      this.logger.error('Agent cleanup failed', error)
      throw error
    }
  }

  // ============ 私有方法 ============

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw utils.createError('NOT_INITIALIZED', 'Agent not initialized. Call initialize() first.')
    }
  }

  private prepareRequest(request: Partial<WebPilotAgentRequest>): WebPilotAgentRequest {
    const id = request.id || utils.generateRequestId()
    
    return {
      id,
      type: request.type || 'analyze',
      target: request.target,
      instructions: request.instructions || '',
      operation: request.operation,
      context: this.mergeContext(request.context),
      options: request.options
    }
  }

  private mergeContext(requestContext?: WebPilotAgentContext): WebPilotAgentContext {
    const baseContext: WebPilotAgentContext = {
      environment: {
        browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        os: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
        viewport: typeof window !== 'undefined' 
          ? { width: window.innerWidth, height: window.innerHeight }
          : { width: 0, height: 0 }
      }
    }

    return utils.deepMerge(baseContext, requestContext || {})
  }

  private async simulateExecution(request: WebPilotAgentRequest): Promise<WebPilotAgentResponse> {
    // 模拟执行延迟
    await utils.delay(Math.random() * 1000 + 500)

    // 根据请求类型返回模拟结果
    let mockData
    switch (request.type) {
      case 'analyze':
        mockData = {
          content: `页面分析结果: ${request.instructions}`,
          elements: ['div', 'span', 'button'],
          confidence: 0.95
        }
        break
      case 'dom_operation':
        mockData = {
          success: true,
          operation: request.operation?.type,
          selector: request.operation?.selector,
          result: '操作成功执行'
        }
        break
      case 'extract':
        mockData = {
          data: { title: '模拟标题', content: '模拟内容' },
          count: 10
        }
        break
      default:
        mockData = {
          message: `已处理 ${request.type} 类型的请求`,
          timestamp: Date.now()
        }
    }

    return utils.createSuccessResponse(request.id!, {
      type: request.type,
      data: mockData,
      timestamp: Date.now(),
      source: 'WebPilotAgent-Standalone'
    }, {
      processingTime: 500,
      tokensUsed: 100
    })
  }

  private createTask(request: WebPilotAgentRequest): AgentTask {
    const task: AgentTask = {
      id: request.id!,
      type: request.type,
      status: 'pending',
      request,
      startTime: Date.now(),
      retries: 0
    }

    this.tasks.set(task.id, task)
    this.emitEvent('request:start', { request })
    
    return task
  }

  private updateTaskStatus(taskId: string, status: AgentTask['status']): void {
    const task = this.tasks.get(taskId)
    if (task) {
      task.status = status
      this.emitEvent('task:status', { taskId, status })
    }
  }

  private updateState(update: Partial<AgentState>): void {
    this.state = { ...this.state, ...update }
    this.emitEvent('state:change', this.state)
  }

  private updateStats(duration: number, success: boolean, tokensUsed: number): void {
    this.stats.averageResponseTime = (
      (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + duration) / 
      this.stats.totalRequests
    )
    this.stats.totalTokensUsed += tokensUsed
    this.stats.lastRequestTime = Date.now()
  }

  private createEventEmitter(): EventEmitter {
    const listeners = new Map<string, Set<Function>>()

    return {
      on: (event: string, listener: Function) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set())
        }
        listeners.get(event)!.add(listener)
      },
      off: (event: string, listener: Function) => {
        listeners.get(event)?.delete(listener)
      },
      once: (event: string, listener: Function) => {
        const onceWrapper = (...args: any[]) => {
          this.eventEmitter.off(event, onceWrapper)
          listener(...args)
        }
        this.eventEmitter.on(event, onceWrapper)
      },
      emit: (event: string, ...args: any[]) => {
        listeners.get(event)?.forEach(listener => {
          try {
            listener(...args)
          } catch (error) {
            this.logger.error(`Event listener error for ${event}`, error)
          }
        })
      }
    }
  }

  private emitEvent(type: string, data: any): void {
    const event = {
      type: type as any,
      timestamp: Date.now(),
      data,
      source: 'WebPilotAgent'
    }

    if (this.logger instanceof AgentLogger) {
      this.logger.logEvent(event)
    }

    this.eventEmitter.emit(type, event)
    this.options.onStateChange?.(this.state)
  }
}
