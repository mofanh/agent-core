/**
 * WebPilot Agent 日志系统
 * 提供结构化的日志记录和监控功能
 */

import type { Logger, LogLevel, AgentEvent } from './types'

export class AgentLogger implements Logger {
  private level: LogLevel
  private enabled: boolean
  private outputFile?: string
  private events: AgentEvent[] = []
  private maxEvents: number = 1000

  constructor(level: LogLevel = 'info', enabled: boolean = true, outputFile?: string) {
    this.level = level
    this.enabled = enabled
    this.outputFile = outputFile
  }

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.level = level
  }

  /**
   * 启用或禁用日志
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * 调试级别日志
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data)
  }

  /**
   * 信息级别日志
   */
  info(message: string, data?: any): void {
    this.log('info', message, data)
  }

  /**
   * 警告级别日志
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data)
  }

  /**
   * 错误级别日志
   */
  error(message: string, data?: any): void {
    this.log('error', message, data)
  }

  /**
   * 记录事件
   */
  logEvent(event: AgentEvent): void {
    this.events.push(event)
    
    // 限制事件数量，防止内存泄漏
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }
    
    this.log('debug', `Event: ${event.type}`, event.data)
  }

  /**
   * 获取事件历史
   */
  getEvents(type?: string, limit?: number): AgentEvent[] {
    let filteredEvents = this.events
    
    if (type) {
      filteredEvents = this.events.filter(event => event.type === type)
    }
    
    if (limit) {
      filteredEvents = filteredEvents.slice(-limit)
    }
    
    return filteredEvents
  }

  /**
   * 清除事件历史
   */
  clearEvents(): void {
    this.events = []
  }

  /**
   * 创建子日志器
   */
  createChild(prefix: string): Logger {
    return {
      debug: (message: string, data?: any) => this.debug(`[${prefix}] ${message}`, data),
      info: (message: string, data?: any) => this.info(`[${prefix}] ${message}`, data),
      warn: (message: string, data?: any) => this.warn(`[${prefix}] ${message}`, data),
      error: (message: string, data?: any) => this.error(`[${prefix}] ${message}`, data)
    }
  }

  /**
   * 导出日志为 JSON
   */
  exportLogs(includeEvents: boolean = true): string {
    const exportData = {
      level: this.level,
      enabled: this.enabled,
      timestamp: new Date().toISOString(),
      events: includeEvents ? this.events : []
    }
    
    return JSON.stringify(exportData, null, 2)
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const eventCounts = this.events.reduce((counts, event) => {
      counts[event.type] = (counts[event.type] || 0) + 1
      return counts
    }, {} as Record<string, number>)

    return {
      totalEvents: this.events.length,
      eventsByType: eventCounts,
      level: this.level,
      enabled: this.enabled,
      oldestEvent: this.events[0]?.timestamp,
      newestEvent: this.events[this.events.length - 1]?.timestamp
    }
  }

  // ============ 私有方法 ============

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.enabled || !this.shouldLog(level)) {
      return
    }

    const timestamp = new Date().toISOString()
    const logLevel = level.toUpperCase()
    const logMessage = `[${timestamp}] [${logLevel}] ${message}`
    
    // 控制台输出
    const consoleMethod = this.getConsoleMethod(level)
    if (data !== undefined) {
      consoleMethod(logMessage, data)
    } else {
      consoleMethod(logMessage)
    }

    // 文件输出（如果配置了）
    if (this.outputFile && typeof window === 'undefined') {
      // Node.js 环境下写入文件
      this.writeToFile(logMessage, data)
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.level)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case 'debug':
        return console.debug.bind(console)
      case 'info':
        return console.info.bind(console)
      case 'warn':
        return console.warn.bind(console)
      case 'error':
        return console.error.bind(console)
      default:
        return console.log.bind(console)
    }
  }

  private async writeToFile(message: string, data?: any): Promise<void> {
    // 在 Node.js 环境中写入文件
    if (typeof window === 'undefined' && this.outputFile) {
      try {
        const fs = await import('fs')
        const logLine = data 
          ? `${message} ${JSON.stringify(data)}\n`
          : `${message}\n`
        
        fs.appendFileSync(this.outputFile, logLine)
      } catch (error) {
        console.error('Failed to write log to file:', error)
      }
    }
  }
}

/**
 * 性能日志器 - 专门用于性能监控
 */
export class PerformanceLogger extends AgentLogger {
  private performanceMarks: Map<string, number> = new Map()

  /**
   * 开始性能计时
   */
  startTiming(label: string): void {
    this.performanceMarks.set(label, performance.now())
    this.debug(`Performance: Started timing "${label}"`)
  }

  /**
   * 结束性能计时并记录
   */
  endTiming(label: string): number {
    const startTime = this.performanceMarks.get(label)
    
    if (startTime === undefined) {
      this.warn(`Performance: No start mark found for "${label}"`)
      return 0
    }

    const duration = performance.now() - startTime
    this.performanceMarks.delete(label)
    
    this.info(`Performance: "${label}" took ${duration.toFixed(2)}ms`)
    return duration
  }

  /**
   * 记录内存使用情况
   */
  logMemoryUsage(label?: string): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory
      const memoryInfo = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
      
      const message = label 
        ? `Memory usage at "${label}"`
        : 'Memory usage'
      
      this.info(`${message}: ${memoryInfo.used}MB / ${memoryInfo.total}MB (limit: ${memoryInfo.limit}MB)`)
    }
  }

  /**
   * 获取性能统计
   */
  getPerformanceStats() {
    return {
      activeTimers: this.performanceMarks.size,
      activeTimerLabels: Array.from(this.performanceMarks.keys()),
      memorySupported: typeof performance !== 'undefined' && !!(performance as any).memory
    }
  }
}

/**
 * 创建默认日志器实例
 */
export function createDefaultLogger(
  level: LogLevel = 'info',
  options?: {
    enabled?: boolean
    outputFile?: string
    performance?: boolean
  }
): Logger {
  const { enabled = true, outputFile, performance = false } = options || {}
  
  if (performance) {
    return new PerformanceLogger(level, enabled, outputFile)
  }
  
  return new AgentLogger(level, enabled, outputFile)
}

/**
 * 静默日志器 - 用于测试或不需要日志的场景
 */
export const silentLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {}
}
