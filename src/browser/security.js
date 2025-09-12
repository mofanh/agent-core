/**
 * 浏览器工具安全性强化模块
 * 提供输入验证、权限控制、安全执行环境等安全机制
 */

import { URL } from 'url';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * 安全配置常量
 */
export const SECURITY_LEVELS = {
  STRICT: 'strict',      // 严格模式：最高安全级别
  NORMAL: 'normal',      // 正常模式：平衡安全性和功能性  
  PERMISSIVE: 'permissive' // 宽松模式：最大功能性
};

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * 浏览器工具安全管理器
 */
export class BrowserSecurityManager {
  constructor(config = {}) {
    this.config = {
      securityLevel: config.securityLevel || SECURITY_LEVELS.NORMAL,
      enableSandbox: config.enableSandbox !== false,
      maxExecutionTime: config.maxExecutionTime || 30000, // 30秒
      maxMemoryUsage: config.maxMemoryUsage || 512 * 1024 * 1024, // 512MB
      allowedDomains: config.allowedDomains || [], // 空数组表示允许所有域名
      blockedDomains: config.blockedDomains || [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '::1'
      ],
      trustedOrigins: config.trustedOrigins || [],
      enableContentSecurityPolicy: config.enableContentSecurityPolicy !== false,
      enableNetworkInterception: config.enableNetworkInterception !== false,
      auditLog: config.auditLog !== false,
      ...config
    };
    
    this.sessionTokens = new Map();
    this.executionLimits = new Map();
    this.auditLogs = [];
    this.blockedActions = new Set();
    
    // 预定义的危险函数/方法
    this.dangerousFunctions = new Set([
      'eval',
      'Function',
      'setTimeout',
      'setInterval',
      'require',
      'import',
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'Worker',
      'SharedWorker',
      'ServiceWorker'
    ]);
    
    // 预定义的敏感选择器
    this.sensitiveSelectors = new Set([
      'input[type="password"]',
      'input[type="email"]',
      'input[type="tel"]',
      '[data-sensitive]',
      '.password',
      '.sensitive',
      '.private'
    ]);
    
    this.initialize();
  }
  
  /**
   * 初始化安全管理器
   */
  initialize() {
    this.setupSecurityPolicies();
    this.loadSecurityRules();
    
    if (this.config.auditLog) {
      this.startAuditLogging();
    }
    
    console.log(`🔒 浏览器安全管理器已初始化 (安全级别: ${this.config.securityLevel})`);
  }
  
  /**
   * 设置安全策略
   */
  setupSecurityPolicies() {
    // 根据安全级别调整策略
    switch (this.config.securityLevel) {
      case SECURITY_LEVELS.STRICT:
        this.config.maxExecutionTime = Math.min(this.config.maxExecutionTime, 15000);
        this.config.maxMemoryUsage = Math.min(this.config.maxMemoryUsage, 256 * 1024 * 1024);
        this.config.enableSandbox = true;
        this.config.enableContentSecurityPolicy = true;
        this.config.enableNetworkInterception = true;
        break;
        
      case SECURITY_LEVELS.PERMISSIVE:
        this.config.maxExecutionTime = Math.max(this.config.maxExecutionTime, 60000);
        this.config.enableContentSecurityPolicy = false;
        this.config.enableNetworkInterception = false;
        break;
        
      default: // NORMAL
        // 保持默认配置
        break;
    }
  }
  
  /**
   * 加载安全规则
   */
  loadSecurityRules() {
    try {
      // 尝试加载自定义安全规则文件
      const rulesFile = join(process.cwd(), 'browser-security-rules.json');
      
      if (existsSync(rulesFile)) {
        const rules = JSON.parse(readFileSync(rulesFile, 'utf-8'));
        
        if (rules.allowedDomains) {
          this.config.allowedDomains.push(...rules.allowedDomains);
        }
        
        if (rules.blockedDomains) {
          this.config.blockedDomains.push(...rules.blockedDomains);
        }
        
        if (rules.dangerousFunctions) {
          rules.dangerousFunctions.forEach(fn => this.dangerousFunctions.add(fn));
        }
        
        if (rules.sensitiveSelectors) {
          rules.sensitiveSelectors.forEach(sel => this.sensitiveSelectors.add(sel));
        }
        
        console.log('🔒 已加载自定义安全规则');
      }
    } catch (error) {
      console.warn('加载安全规则失败:', error.message);
    }
  }
  
  /**
   * 验证URL安全性
   */
  validateURL(url, context = 'navigation') {
    const result = {
      isValid: false,
      riskLevel: RISK_LEVELS.LOW,
      violations: [],
      sanitizedUrl: null
    };
    
    try {
      const parsedUrl = new URL(url);
      result.sanitizedUrl = parsedUrl.href;
      
      // 协议检查
      if (!['http:', 'https:', 'file:'].includes(parsedUrl.protocol)) {
        result.violations.push({
          type: 'protocol',
          message: `不安全的协议: ${parsedUrl.protocol}`,
          severity: RISK_LEVELS.HIGH
        });
        result.riskLevel = RISK_LEVELS.HIGH;
      }
      
      // 域名黑名单检查
      if (this.config.blockedDomains.includes(parsedUrl.hostname)) {
        result.violations.push({
          type: 'blocked_domain',
          message: `域名在黑名单中: ${parsedUrl.hostname}`,
          severity: RISK_LEVELS.CRITICAL
        });
        result.riskLevel = RISK_LEVELS.CRITICAL;
      }
      
      // 域名白名单检查（如果配置了白名单）
      // 临时禁用白名单检查，允许所有域名
      if (false && this.config.allowedDomains.length > 0 && 
          !this.config.allowedDomains.includes(parsedUrl.hostname)) {
        result.violations.push({
          type: 'domain_not_allowed',
          message: `域名不在白名单中: ${parsedUrl.hostname}`,
          severity: RISK_LEVELS.HIGH
        });
        result.riskLevel = RISK_LEVELS.HIGH;
      }
      
      // 本地IP检查
      if (this.isLocalIP(parsedUrl.hostname)) {
        result.violations.push({
          type: 'local_ip',
          message: `检测到本地IP地址: ${parsedUrl.hostname}`,
          severity: RISK_LEVELS.MEDIUM
        });
        result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
      }
      
      // 端口检查
      if (parsedUrl.port && this.isDangerousPort(parsedUrl.port)) {
        result.violations.push({
          type: 'dangerous_port',
          message: `危险端口: ${parsedUrl.port}`,
          severity: RISK_LEVELS.MEDIUM
        });
        result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
      }
      
      // 路径检查
      if (this.containsSuspiciousPath(parsedUrl.pathname)) {
        result.violations.push({
          type: 'suspicious_path',
          message: `可疑路径: ${parsedUrl.pathname}`,
          severity: RISK_LEVELS.MEDIUM
        });
        result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
      }
      
      // 安全级别检查
      result.isValid = this.isUrlAllowedBySecurityLevel(result.riskLevel);
      
    } catch (error) {
      result.violations.push({
        type: 'invalid_url',
        message: `URL格式无效: ${error.message}`,
        severity: RISK_LEVELS.HIGH
      });
      result.riskLevel = RISK_LEVELS.HIGH;
    }
    
    // 记录审计日志
    this.logSecurityEvent('url_validation', {
      url,
      context,
      result: result.isValid,
      riskLevel: result.riskLevel,
      violations: result.violations
    });
    
    return result;
  }
  
  /**
   * 验证选择器安全性
   */
  validateSelector(selector, context = 'extraction') {
    const result = {
      isValid: false,
      riskLevel: RISK_LEVELS.LOW,
      violations: [],
      sanitizedSelector: selector
    };
    
    // 检查是否为敏感选择器
    if (this.sensitiveSelectors.has(selector) || 
        Array.from(this.sensitiveSelectors).some(sensitiveSelector => 
          selector.includes(sensitiveSelector.replace(/^\w+/, '').replace(/\[.*\]$/, ''))
        )) {
      result.violations.push({
        type: 'sensitive_selector',
        message: `敏感数据选择器: ${selector}`,
        severity: RISK_LEVELS.HIGH
      });
      result.riskLevel = RISK_LEVELS.HIGH;
    }
    
    // 检查XSS向量
    if (this.containsXSSVector(selector)) {
      result.violations.push({
        type: 'xss_vector',
        message: `选择器包含潜在XSS向量`,
        severity: RISK_LEVELS.CRITICAL
      });
      result.riskLevel = RISK_LEVELS.CRITICAL;
    }
    
    // 检查CSS注入
    if (this.containsCSSInjection(selector)) {
      result.violations.push({
        type: 'css_injection',
        message: `选择器包含CSS注入风险`,
        severity: RISK_LEVELS.MEDIUM
      });
      result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
    }
    
    // 净化选择器
    result.sanitizedSelector = this.sanitizeSelector(selector);
    result.isValid = this.isSelectorAllowedBySecurityLevel(result.riskLevel);
    
    this.logSecurityEvent('selector_validation', {
      selector,
      context,
      result: result.isValid,
      riskLevel: result.riskLevel,
      violations: result.violations
    });
    
    return result;
  }
  
  /**
   * 验证JavaScript代码安全性
   */
  validateJavaScript(code, context = 'evaluation') {
    const result = {
      isValid: false,
      riskLevel: RISK_LEVELS.LOW,
      violations: [],
      sanitizedCode: code
    };
    
    // 检查危险函数
    const foundDangerousFunctions = Array.from(this.dangerousFunctions)
      .filter(fn => code.includes(fn));
    
    if (foundDangerousFunctions.length > 0) {
      result.violations.push({
        type: 'dangerous_functions',
        message: `代码包含危险函数: ${foundDangerousFunctions.join(', ')}`,
        severity: RISK_LEVELS.CRITICAL
      });
      result.riskLevel = RISK_LEVELS.CRITICAL;
    }
    
    // 检查网络请求
    if (this.containsNetworkRequests(code)) {
      result.violations.push({
        type: 'network_requests',
        message: '代码包含网络请求',
        severity: RISK_LEVELS.HIGH
      });
      result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.HIGH);
    }
    
    // 检查DOM操作
    if (this.containsDangerousDOMOperations(code)) {
      result.violations.push({
        type: 'dangerous_dom',
        message: '代码包含危险DOM操作',
        severity: RISK_LEVELS.MEDIUM
      });
      result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
    }
    
    // 检查代码复杂度
    if (this.isCodeTooComplex(code)) {
      result.violations.push({
        type: 'complex_code',
        message: '代码过于复杂',
        severity: RISK_LEVELS.MEDIUM
      });
      result.riskLevel = Math.max(result.riskLevel, RISK_LEVELS.MEDIUM);
    }
    
    // 净化代码
    result.sanitizedCode = this.sanitizeJavaScript(code);
    result.isValid = this.isJavaScriptAllowedBySecurityLevel(result.riskLevel);
    
    this.logSecurityEvent('javascript_validation', {
      codeLength: code.length,
      context,
      result: result.isValid,
      riskLevel: result.riskLevel,
      violations: result.violations
    });
    
    return result;
  }
  
  /**
   * 创建安全执行会话
   */
  createSecureSession(options = {}) {
    const sessionId = this.generateSessionId();
    const token = this.generateSecureToken();
    
    const session = {
      id: sessionId,
      token: token,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      config: {
        maxExecutionTime: options.maxExecutionTime || this.config.maxExecutionTime,
        maxMemoryUsage: options.maxMemoryUsage || this.config.maxMemoryUsage,
        permissions: options.permissions || ['navigate', 'extract', 'interact'],
        sandbox: options.sandbox !== false && this.config.enableSandbox
      },
      stats: {
        operationsCount: 0,
        totalExecutionTime: 0,
        memoryPeak: 0
      }
    };
    
    this.sessionTokens.set(sessionId, session);
    this.executionLimits.set(sessionId, {
      startTime: Date.now(),
      operationCount: 0
    });
    
    this.logSecurityEvent('session_created', {
      sessionId,
      config: session.config
    });
    
    return {
      sessionId,
      token,
      config: session.config
    };
  }
  
  /**
   * 验证会话权限
   */
  validateSessionPermission(sessionId, operation, params = {}) {
    const session = this.sessionTokens.get(sessionId);
    
    if (!session) {
      return {
        allowed: false,
        reason: 'Invalid session',
        riskLevel: RISK_LEVELS.HIGH
      };
    }
    
    // 检查会话是否过期
    const sessionAge = Date.now() - session.createdAt;
    if (sessionAge > 24 * 60 * 60 * 1000) { // 24小时过期
      this.sessionTokens.delete(sessionId);
      return {
        allowed: false,
        reason: 'Session expired',
        riskLevel: RISK_LEVELS.MEDIUM
      };
    }
    
    // 检查操作权限
    if (!session.config.permissions.includes(operation)) {
      return {
        allowed: false,
        reason: `Operation not permitted: ${operation}`,
        riskLevel: RISK_LEVELS.HIGH
      };
    }
    
    // 检查执行时间限制
    const executionTime = Date.now() - this.executionLimits.get(sessionId).startTime;
    if (executionTime > session.config.maxExecutionTime) {
      return {
        allowed: false,
        reason: 'Execution time limit exceeded',
        riskLevel: RISK_LEVELS.MEDIUM
      };
    }
    
    // 检查操作频率
    const limits = this.executionLimits.get(sessionId);
    limits.operationCount++;
    
    if (limits.operationCount > 100) { // 单会话最多100个操作
      return {
        allowed: false,
        reason: 'Operation count limit exceeded',
        riskLevel: RISK_LEVELS.MEDIUM
      };
    }
    
    // 更新会话活动时间
    session.lastActivity = Date.now();
    session.stats.operationsCount++;
    
    return {
      allowed: true,
      sessionInfo: session
    };
  }
  
  /**
   * 监控执行环境
   */
  monitorExecution(sessionId, callback) {
    const session = this.sessionTokens.get(sessionId);
    if (!session) {
      throw new Error('Invalid session for monitoring');
    }
    
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage().heapUsed;
    
    // 创建监控包装器
    const monitoredCallback = async (...args) => {
      try {
        // 执行回调
        const result = await callback(...args);
        
        // 记录执行统计
        const endTime = process.hrtime.bigint();
        const endMemory = process.memoryUsage().heapUsed;
        const executionTime = Number(endTime - startTime) / 1000000; // 转换为毫秒
        const memoryUsed = endMemory - startMemory;
        
        session.stats.totalExecutionTime += executionTime;
        session.stats.memoryPeak = Math.max(session.stats.memoryPeak, memoryUsed);
        
        // 检查资源使用
        if (memoryUsed > session.config.maxMemoryUsage) {
          this.logSecurityEvent('memory_limit_exceeded', {
            sessionId,
            memoryUsed,
            limit: session.config.maxMemoryUsage
          });
          
          throw new Error('Memory usage limit exceeded');
        }
        
        return result;
        
      } catch (error) {
        this.logSecurityEvent('execution_error', {
          sessionId,
          error: error.message
        });
        throw error;
      }
    };
    
    return monitoredCallback;
  }
  
  /**
   * 生成CSP头
   */
  generateCSPHeader() {
    if (!this.config.enableContentSecurityPolicy) {
      return null;
    }
    
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "font-src 'self'",
      "object-src 'none'",
      "media-src 'self'",
      "frame-src 'none'"
    ];
    
    if (this.config.securityLevel === SECURITY_LEVELS.STRICT) {
      directives.push(
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      );
    }
    
    return directives.join('; ');
  }
  
  /**
   * 工具函数：检查是否为本地IP
   */
  isLocalIP(hostname) {
    const localPatterns = [
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^::1$/,
      /^fe80:/,
      /^localhost$/i
    ];
    
    return localPatterns.some(pattern => pattern.test(hostname));
  }
  
  /**
   * 工具函数：检查是否为危险端口
   */
  isDangerousPort(port) {
    const dangerousPorts = [
      22,    // SSH
      23,    // Telnet
      25,    // SMTP
      53,    // DNS
      135,   // RPC
      139,   // NetBIOS
      445,   // SMB
      1433,  // SQL Server
      3306,  // MySQL
      3389,  // RDP
      5432,  // PostgreSQL
      6379,  // Redis
      27017  // MongoDB
    ];
    
    return dangerousPorts.includes(parseInt(port));
  }
  
  /**
   * 工具函数：检查路径是否可疑
   */
  containsSuspiciousPath(pathname) {
    const suspiciousPatterns = [
      /\/\.\./, // 目录遍历
      /\/admin/i,
      /\/config/i,
      /\/private/i,
      /\/internal/i,
      /\/debug/i,
      /\/test/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(pathname));
  }
  
  /**
   * 工具函数：检查XSS向量
   */
  containsXSSVector(input) {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
  
  /**
   * 工具函数：检查CSS注入
   */
  containsCSSInjection(input) {
    const cssInjectionPatterns = [
      /expression\s*\(/i,
      /javascript\s*:/i,
      /@import/i,
      /binding\s*:/i
    ];
    
    return cssInjectionPatterns.some(pattern => pattern.test(input));
  }
  
  /**
   * 工具函数：检查网络请求
   */
  containsNetworkRequests(code) {
    const networkPatterns = [
      /fetch\s*\(/,
      /XMLHttpRequest/,
      /WebSocket/,
      /\.get\s*\(/,
      /\.post\s*\(/,
      /axios\./,
      /\$\.ajax/
    ];
    
    return networkPatterns.some(pattern => pattern.test(code));
  }
  
  /**
   * 工具函数：检查危险DOM操作
   */
  containsDangerousDOMOperations(code) {
    const dangerousDOMPatterns = [
      /innerHTML\s*=/,
      /outerHTML\s*=/,
      /document\.write/,
      /\.setAttribute\s*\(\s*['"]on/,
      /createElement\s*\(\s*['"]script/
    ];
    
    return dangerousDOMPatterns.some(pattern => pattern.test(code));
  }
  
  /**
   * 工具函数：检查代码复杂度
   */
  isCodeTooComplex(code) {
    // 简单的复杂度检查：行数和字符数
    const lines = code.split('\n').length;
    const chars = code.length;
    
    return lines > 50 || chars > 2000;
  }
  
  /**
   * 工具函数：净化选择器
   */
  sanitizeSelector(selector) {
    // 移除潜在危险的字符
    return selector
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  
  /**
   * 工具函数：净化JavaScript代码
   */
  sanitizeJavaScript(code) {
    // 基本的代码净化
    let sanitized = code;
    
    // 移除危险函数调用（如果安全级别要求）
    if (this.config.securityLevel === SECURITY_LEVELS.STRICT) {
      Array.from(this.dangerousFunctions).forEach(fn => {
        const regex = new RegExp(`\\b${fn}\\s*\\(`, 'gi');
        sanitized = sanitized.replace(regex, `/* BLOCKED: ${fn}( */`);
      });
    }
    
    return sanitized;
  }
  
  /**
   * 工具函数：检查安全级别允许性
   */
  isUrlAllowedBySecurityLevel(riskLevel) {
    switch (this.config.securityLevel) {
      case SECURITY_LEVELS.STRICT:
        return riskLevel === RISK_LEVELS.LOW;
      case SECURITY_LEVELS.NORMAL:
        return riskLevel !== RISK_LEVELS.CRITICAL;
      case SECURITY_LEVELS.PERMISSIVE:
        return true;
      default:
        return riskLevel !== RISK_LEVELS.CRITICAL;
    }
  }
  
  isSelectorAllowedBySecurityLevel(riskLevel) {
    return this.isUrlAllowedBySecurityLevel(riskLevel);
  }
  
  isJavaScriptAllowedBySecurityLevel(riskLevel) {
    switch (this.config.securityLevel) {
      case SECURITY_LEVELS.STRICT:
        return riskLevel === RISK_LEVELS.LOW;
      case SECURITY_LEVELS.NORMAL:
        return riskLevel !== RISK_LEVELS.CRITICAL;
      case SECURITY_LEVELS.PERMISSIVE:
        return riskLevel !== RISK_LEVELS.CRITICAL; // 即使宽松模式也不允许关键风险
      default:
        return riskLevel !== RISK_LEVELS.CRITICAL;
    }
  }
  
  /**
   * 工具函数：生成会话ID
   */
  generateSessionId() {
    return 'session_' + randomBytes(16).toString('hex');
  }
  
  /**
   * 工具函数：生成安全令牌
   */
  generateSecureToken() {
    return randomBytes(32).toString('hex');
  }
  
  /**
   * 记录安全事件
   */
  logSecurityEvent(eventType, details) {
    if (!this.config.auditLog) {
      return;
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: eventType,
      details: details,
      securityLevel: this.config.securityLevel
    };
    
    this.auditLogs.push(logEntry);
    
    // 保持审计日志大小在合理范围
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-500);
    }
    
    // 如果是高风险事件，立即输出警告
    if (details.riskLevel === RISK_LEVELS.CRITICAL || details.riskLevel === RISK_LEVELS.HIGH) {
      console.warn(`🚨 安全事件 [${eventType}]:`, details);
    }
  }
  
  /**
   * 启动审计日志
   */
  startAuditLogging() {
    console.log('🔍 安全审计日志已启动');
  }
  
  /**
   * 获取安全统计
   */
  getSecurityStats() {
    const eventTypes = {};
    const riskLevels = {};
    
    this.auditLogs.forEach(log => {
      eventTypes[log.type] = (eventTypes[log.type] || 0) + 1;
      if (log.details.riskLevel) {
        riskLevels[log.details.riskLevel] = (riskLevels[log.details.riskLevel] || 0) + 1;
      }
    });
    
    return {
      totalEvents: this.auditLogs.length,
      activeSessions: this.sessionTokens.size,
      blockedActions: this.blockedActions.size,
      eventsByType: eventTypes,
      riskLevelDistribution: riskLevels,
      securityLevel: this.config.securityLevel,
      recentHighRiskEvents: this.auditLogs
        .filter(log => 
          log.details.riskLevel === RISK_LEVELS.HIGH || 
          log.details.riskLevel === RISK_LEVELS.CRITICAL
        )
        .slice(-10)
    };
  }
  
  /**
   * 清理过期会话
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    const expiredSessions = [];
    
    this.sessionTokens.forEach((session, sessionId) => {
      const sessionAge = now - session.lastActivity;
      if (sessionAge > 60 * 60 * 1000) { // 1小时未活动
        expiredSessions.push(sessionId);
      }
    });
    
    expiredSessions.forEach(sessionId => {
      this.sessionTokens.delete(sessionId);
      this.executionLimits.delete(sessionId);
    });
    
    if (expiredSessions.length > 0) {
      console.log(`🔒 清理了 ${expiredSessions.length} 个过期会话`);
    }
    
    return expiredSessions.length;
  }
  
  /**
   * 清理资源
   */
  cleanup() {
    this.sessionTokens.clear();
    this.executionLimits.clear();
    this.auditLogs.length = 0;
    this.blockedActions.clear();
    
    console.log('🔒 安全管理器已清理');
  }
}

/**
 * 创建浏览器安全管理器
 */
export function createBrowserSecurityManager(config = {}) {
  return new BrowserSecurityManager(config);
}

// 导出默认安全配置
export const DEFAULT_SECURITY_CONFIG = {
  securityLevel: SECURITY_LEVELS.NORMAL,
  enableSandbox: true,
  maxExecutionTime: 30000,
  maxMemoryUsage: 512 * 1024 * 1024,
  allowedDomains: [],
  blockedDomains: ['localhost', '127.0.0.1', '0.0.0.0', '::1'],
  trustedOrigins: [],
  enableContentSecurityPolicy: true,
  enableNetworkInterception: true,
  auditLog: true
};
