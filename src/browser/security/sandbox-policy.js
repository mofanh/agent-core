/**
 * Browser Security Policy
 * 
 * @fileoverview 浏览器操作安全策略，参考 codex-rs 的沙箱策略设计
 */

import Logger from '../../utils/logger.js';
import { BROWSER_TOOLS } from '../index.js';

/**
 * 浏览器安全策略
 * 提供URL验证、脚本安全检查、资源控制等安全功能
 */
export class BrowserSecurityPolicy {
  /**
   * 构造函数
   * @param {Object} config - 安全配置
   * @param {Array} config.allowedDomains - 允许的域名列表
   * @param {Array} config.blockResources - 阻止的资源类型
   * @param {number} config.maxExecutionTime - 最大执行时间
   * @param {string} config.maxMemory - 最大内存使用
   * @param {boolean} config.allowScriptExecution - 是否允许脚本执行
   * @param {Array} config.blockedPatterns - 阻止的脚本模式
   */
  constructor(config = {}) {
    this.config = {
      allowedDomains: config.allowedDomains || ['*'],
      blockResources: config.blockResources || ['image', 'font'],
      maxExecutionTime: config.maxExecutionTime || 30000,
      maxMemory: config.maxMemory || '512MB',
      allowScriptExecution: config.allowScriptExecution !== false,
      blockedPatterns: config.blockedPatterns || [],
      ...config
    };
    
    this.logger = new Logger('BrowserSecurityPolicy');
    
    // 默认危险脚本模式
    this.dangerousPatterns = [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /document\.write/gi,
      /window\.location\s*=/gi,
      /location\.href\s*=/gi,
      /XMLHttpRequest/gi,
      /fetch\s*\(/gi,
      /WebSocket/gi,
      /localStorage/gi,
      /sessionStorage/gi,
      /indexedDB/gi,
      /alert\s*\(/gi,
      /confirm\s*\(/gi,
      /prompt\s*\(/gi
    ];
    
    // 合并用户自定义的阻止模式
    if (this.config.blockedPatterns.length > 0) {
      this.dangerousPatterns.push(...this.config.blockedPatterns);
    }
  }

  /**
   * 验证工具操作是否被允许
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @returns {Promise<boolean>} 是否允许执行
   * @throws {Error} 如果操作被拒绝
   */
  async validateOperation(toolName, args) {
    this.logger.debug(`验证工具操作: ${toolName}`, args);
    
    try {
      // URL 验证
      if (args.url) {
        await this.validateUrl(args.url);
      }
      
      // 脚本执行验证
      if (toolName === BROWSER_TOOLS.EVALUATE) {
        await this.validateScript(args.script || args.code);
      }
      
      // 选择器验证
      if (args.selector) {
        await this.validateSelector(args.selector);
      }
      
      // 执行时间验证
      if (args.timeout) {
        await this.validateTimeout(args.timeout);
      }
      
      // 工具特定验证
      await this.validateToolSpecific(toolName, args);
      
      this.logger.debug(`工具操作验证通过: ${toolName}`);
      return true;
      
    } catch (error) {
      this.logger.warn(`工具操作验证失败: ${toolName}`, error.message);
      throw error;
    }
  }

  /**
   * 验证URL是否被允许
   * @param {string} url - 要验证的URL
   * @returns {Promise<boolean>} 是否允许
   * @throws {Error} 如果URL被拒绝
   */
  async validateUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // 检查协议
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error(`不支持的协议: ${urlObj.protocol}`);
      }
      
      // 检查域名白名单
      if (!this.isAllowedDomain(hostname)) {
        throw new Error(`域名不在允许列表中: ${hostname}`);
      }
      
      // 检查端口（避免访问内部服务）
      const port = urlObj.port;
      if (port && this.isBlockedPort(parseInt(port))) {
        throw new Error(`不允许访问端口: ${port}`);
      }
      
      return true;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`无效的URL: ${url}`);
      }
      throw error;
    }
  }

  /**
   * 检查域名是否被允许
   * @param {string} hostname - 主机名
   * @returns {boolean} 是否允许
   */
  isAllowedDomain(hostname) {
    // 如果允许所有域名
    if (this.config.allowedDomains.includes('*')) {
      return true;
    }
    
    // 检查精确匹配
    if (this.config.allowedDomains.includes(hostname)) {
      return true;
    }
    
    // 检查通配符匹配
    return this.config.allowedDomains.some(domain => {
      if (domain.startsWith('*.')) {
        const baseDomain = domain.slice(2);
        return hostname === baseDomain || hostname.endsWith('.' + baseDomain);
      }
      return false;
    });
  }

  /**
   * 检查端口是否被阻止
   * @param {number} port - 端口号
   * @returns {boolean} 是否被阻止
   */
  isBlockedPort(port) {
    // 阻止常见的内部服务端口
    const blockedPorts = [
      22,    // SSH
      23,    // Telnet
      25,    // SMTP
      53,    // DNS
      135,   // RPC
      139,   // NetBIOS
      445,   // SMB
      993,   // IMAPS
      995,   // POP3S
      1433,  // SQL Server
      3306,  // MySQL
      3389,  // RDP
      5432,  // PostgreSQL
      6379,  // Redis
      27017  // MongoDB
    ];
    
    return blockedPorts.includes(port);
  }

  /**
   * 验证JavaScript代码是否安全
   * @param {string} code - 要验证的代码
   * @returns {Promise<boolean>} 是否安全
   * @throws {Error} 如果代码包含危险操作
   */
  async validateScript(code) {
    if (!this.config.allowScriptExecution) {
      throw new Error('脚本执行已被禁用');
    }
    
    if (!code || typeof code !== 'string') {
      throw new Error('无效的脚本代码');
    }
    
    // 检查代码长度
    if (code.length > 10000) {
      throw new Error('脚本代码过长，最大允许10000字符');
    }
    
    // 检查危险模式
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error(`脚本包含不被允许的操作: ${pattern.source}`);
      }
    }
    
    // 检查嵌套深度（防止复杂的恶意代码）
    const maxNestingLevel = 10;
    const nestingLevel = this.calculateNestingLevel(code);
    if (nestingLevel > maxNestingLevel) {
      throw new Error(`脚本嵌套层级过深: ${nestingLevel} > ${maxNestingLevel}`);
    }
    
    return true;
  }

  /**
   * 计算代码嵌套层级
   * @param {string} code - 代码字符串
   * @returns {number} 嵌套层级
   */
  calculateNestingLevel(code) {
    let currentLevel = 0;
    let maxLevel = 0;
    
    for (const char of code) {
      if (char === '{' || char === '(' || char === '[') {
        currentLevel++;
        maxLevel = Math.max(maxLevel, currentLevel);
      } else if (char === '}' || char === ')' || char === ']') {
        currentLevel--;
      }
    }
    
    return maxLevel;
  }

  /**
   * 验证CSS选择器是否安全
   * @param {string} selector - CSS选择器
   * @returns {Promise<boolean>} 是否安全
   * @throws {Error} 如果选择器不安全
   */
  async validateSelector(selector) {
    if (!selector || typeof selector !== 'string') {
      throw new Error('无效的选择器');
    }
    
    // 选择器长度限制
    if (selector.length > 1000) {
      throw new Error('选择器过长，最大允许1000字符');
    }
    
    // 检查危险的选择器模式
    const dangerousSelectorPatterns = [
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /<script/gi,
      /onload=/gi,
      /onclick=/gi,
      /onerror=/gi
    ];
    
    for (const pattern of dangerousSelectorPatterns) {
      if (pattern.test(selector)) {
        throw new Error(`选择器包含不安全的内容: ${pattern.source}`);
      }
    }
    
    return true;
  }

  /**
   * 验证超时时间是否合理
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise<boolean>} 是否合理
   * @throws {Error} 如果超时时间不合理
   */
  async validateTimeout(timeout) {
    if (typeof timeout !== 'number' || timeout < 0) {
      throw new Error('无效的超时时间');
    }
    
    if (timeout > this.config.maxExecutionTime) {
      throw new Error(`超时时间过长: ${timeout}ms > ${this.config.maxExecutionTime}ms`);
    }
    
    return true;
  }

  /**
   * 工具特定的验证逻辑
   * @param {string} toolName - 工具名称
   * @param {Object} args - 工具参数
   * @returns {Promise<boolean>} 是否通过验证
   */
  async validateToolSpecific(toolName, args) {
    switch (toolName) {
      case BROWSER_TOOLS.TYPE:
        return this.validateTypeOperation(args);
      
      case BROWSER_TOOLS.SCREENSHOT:
        return this.validateScreenshotOperation(args);
      
      case BROWSER_TOOLS.CLICK:
        return this.validateClickOperation(args);
      
      default:
        return true;
    }
  }

  /**
   * 验证文本输入操作
   * @param {Object} args - 参数
   * @returns {Promise<boolean>} 是否允许
   */
  async validateTypeOperation(args) {
    const { text } = args;
    
    if (!text || typeof text !== 'string') {
      throw new Error('无效的输入文本');
    }
    
    // 文本长度限制
    if (text.length > 10000) {
      throw new Error('输入文本过长，最大允许10000字符');
    }
    
    // 检查是否包含脚本代码
    if (/<script|javascript:|data:/gi.test(text)) {
      throw new Error('输入文本包含不安全的内容');
    }
    
    return true;
  }

  /**
   * 验证截图操作
   * @param {Object} args - 参数
   * @returns {Promise<boolean>} 是否允许
   */
  async validateScreenshotOperation(args) {
    const { quality, format } = args;
    
    // 验证图片质量
    if (quality !== undefined) {
      if (typeof quality !== 'number' || quality < 1 || quality > 100) {
        throw new Error('图片质量必须在1-100之间');
      }
    }
    
    // 验证图片格式
    if (format && !['png', 'jpeg', 'jpg'].includes(format.toLowerCase())) {
      throw new Error('不支持的图片格式');
    }
    
    return true;
  }

  /**
   * 验证点击操作
   * @param {Object} args - 参数
   * @returns {Promise<boolean>} 是否允许
   */
  async validateClickOperation(args) {
    const { button } = args;
    
    // 验证鼠标按键
    if (button && !['left', 'right', 'middle'].includes(button)) {
      throw new Error('无效的鼠标按键');
    }
    
    return true;
  }

  /**
   * 获取安全策略配置
   * @returns {Object} 配置信息
   */
  getConfig() {
    return {
      ...this.config,
      dangerousPatternsCount: this.dangerousPatterns.length
    };
  }

  /**
   * 更新安全策略配置
   * @param {Object} newConfig - 新配置
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('安全策略配置已更新');
  }
}
