/**
 * Selector Utilities
 * 
 * @fileoverview 选择器相关的工具函数
 */

/**
 * 验证CSS选择器格式
 * @param {string} selector - CSS选择器
 * @returns {boolean} 是否有效
 */
export function isValidCSSSelector(selector) {
  if (!selector || typeof selector !== 'string') {
    return false;
  }
  
  try {
    // 尝试使用 CSS.supports 验证选择器
    if (typeof CSS !== 'undefined' && CSS.supports) {
      return CSS.supports('selector(' + selector + ')');
    }
    
    // Node.js环境的备用验证：检查CSS选择器特征
    // 允许常见的CSS选择器字符，包括下划线
    const cssPattern = /^[a-zA-Z0-9\s\.\#\[\]\:\-\>\+\~\(\)\,\*\"\'=_]+$/;
    const hasCSSFeatures = /[.#][\w-]|[\[\]:>+~,]/.test(selector);
    
    return cssPattern.test(selector) && (hasCSSFeatures || /^[a-zA-Z][\w-]*$/.test(selector.trim()));
  } catch (error) {
    return false;
  }
}

/**
 * 验证XPath选择器格式
 * @param {string} selector - XPath选择器
 * @returns {boolean} 是否有效
 */
export function isValidXPathSelector(selector) {
  if (!selector || typeof selector !== 'string') {
    return false;
  }
  
  // 更严格的XPath检测
  // XPath必须以/或//开头，或包含明确的XPath轴和函数
  const startsWithPath = /^(\/\/|\/(?=\w))/.test(selector);
  const hasXPathFunctions = /\b(contains|text|position|last|count|normalize-space|substring)\s*\(/.test(selector);
  const hasXPathAxes = /\b(ancestor|ancestor-or-self|attribute|child|descendant|descendant-or-self|following|following-sibling|namespace|parent|preceding|preceding-sibling|self)::|@[\w-]+/.test(selector);
  
  // 检查是否是XPath轴表达式（如 descendant::div）
  const isAxisExpression = /^\w+::/.test(selector);
  
  // 排除明显的CSS选择器特征
  const hasCSSFeatures = /^[.#][\w-]|[,>\+~\[\]]/.test(selector);
  
  // 如果有CSS特征，不是XPath（除非有明确的XPath特征）
  if (hasCSSFeatures && !startsWithPath && !hasXPathFunctions && !hasXPathAxes && !isAxisExpression) {
    return false;
  }
  
  return startsWithPath || hasXPathFunctions || hasXPathAxes || isAxisExpression;
}

/**
 * 自动检测选择器类型
 * @param {string} selector - 选择器字符串
 * @returns {string} 选择器类型 ('css' | 'xpath' | 'unknown')
 */
export function detectSelectorType(selector) {
  if (!selector || typeof selector !== 'string') {
    return 'unknown';
  }
  
  // 先检查XPath的强特征（明确的XPath语法）
  const hasStrongXPathFeatures = /^(\/\/|\/)/.test(selector) || 
    /\b(contains|text|position|last|count)\s*\(/.test(selector) ||
    /^\w+::/.test(selector) ||
    /@[\w-]+/.test(selector);
    
  if (hasStrongXPathFeatures && isValidXPathSelector(selector)) {
    return 'xpath';
  }
  
  // 然后检查CSS
  if (isValidCSSSelector(selector)) {
    return 'css';
  }
  
  // 最后检查弱XPath特征
  if (isValidXPathSelector(selector)) {
    return 'xpath';
  }
  
  return 'unknown';
}

/**
 * 标准化选择器
 * @param {string} selector - 原始选择器
 * @returns {Object} 标准化后的选择器信息
 */
export function normalizeSelector(selector) {
  const type = detectSelectorType(selector);
  
  return {
    original: selector,
    type,
    normalized: selector.trim(),
    isValid: type !== 'unknown'
  };
}

/**
 * 构建复合选择器
 * @param {Array<string>} selectors - 选择器数组
 * @param {string} combinator - 组合符 (',' | ' ' | '>' | '+' | '~')
 * @returns {string} 组合后的选择器
 */
export function combineSelectors(selectors, combinator = ',') {
  if (!Array.isArray(selectors) || selectors.length === 0) {
    return '';
  }
  
  const validSelectors = selectors.filter(s => isValidCSSSelector(s));
  
  if (validSelectors.length === 0) {
    throw new Error('没有有效的CSS选择器');
  }
  
  return validSelectors.join(` ${combinator} `);
}

/**
 * 生成常用的选择器模式
 */
export const SelectorPatterns = {
  /**
   * 按文本内容查找元素
   * @param {string} text - 文本内容
   * @param {string} tag - 标签名 (可选)
   * @returns {string} XPath选择器
   */
  byText(text, tag = '*') {
    const escapedText = text.replace(/'/g, "\\'");
    return `//${tag}[contains(text(), '${escapedText}')]`;
  },

  /**
   * 按精确文本查找元素
   * @param {string} text - 精确文本
   * @param {string} tag - 标签名 (可选)
   * @returns {string} XPath选择器
   */
  byExactText(text, tag = '*') {
    const escapedText = text.replace(/'/g, "\\'");
    return `//${tag}[text()='${escapedText}']`;
  },

  /**
   * 按属性值查找元素
   * @param {string} attribute - 属性名
   * @param {string} value - 属性值
   * @param {string} tag - 标签名 (可选)
   * @returns {string} CSS选择器
   */
  byAttribute(attribute, value, tag = '') {
    const escapedValue = value.replace(/"/g, '\\"');
    return `${tag}[${attribute}="${escapedValue}"]`;
  },

  /**
   * 按属性包含查找元素
   * @param {string} attribute - 属性名
   * @param {string} value - 包含的值
   * @param {string} tag - 标签名 (可选)
   * @returns {string} CSS选择器
   */
  byAttributeContains(attribute, value, tag = '') {
    const escapedValue = value.replace(/"/g, '\\"');
    return `${tag}[${attribute}*="${escapedValue}"]`;
  },

  /**
   * 按类名查找元素
   * @param {string} className - 类名
   * @param {string} tag - 标签名 (可选)
   * @returns {string} CSS选择器
   */
  byClass(className, tag = '') {
    return `${tag}.${className}`;
  },

  /**
   * 按ID查找元素
   * @param {string} id - ID值
   * @returns {string} CSS选择器
   */
  byId(id) {
    return `#${id}`;
  },

  /**
   * 按占位符文本查找输入框
   * @param {string} placeholder - 占位符文本
   * @returns {string} CSS选择器
   */
  byPlaceholder(placeholder) {
    const escapedPlaceholder = placeholder.replace(/"/g, '\\"');
    return `input[placeholder="${escapedPlaceholder}"], textarea[placeholder="${escapedPlaceholder}"]`;
  },

  /**
   * 按标签名和索引查找元素
   * @param {string} tag - 标签名
   * @param {number} index - 索引（从1开始）
   * @returns {string} CSS选择器
   */
  byTagAndIndex(tag, index) {
    return `${tag}:nth-child(${index})`;
  },

  /**
   * 查找可见的元素
   * @param {string} baseSelector - 基础选择器
   * @returns {string} CSS选择器
   */
  visible(baseSelector) {
    return `${baseSelector}:not([hidden]):not([style*="display: none"]):not([style*="visibility: hidden"])`;
  },

  /**
   * 查找可点击的元素
   * @returns {string} CSS选择器
   */
  clickable() {
    return 'a, button, input[type="button"], input[type="submit"], [onclick], [role="button"], [tabindex]:not([tabindex="-1"])';
  },

  /**
   * 查找输入元素
   * @returns {string} CSS选择器
   */
  inputs() {
    return 'input, textarea, select, [contenteditable="true"]';
  }
};

/**
 * 选择器构建器类
 */
export class SelectorBuilder {
  constructor() {
    this.parts = [];
  }

  /**
   * 添加标签选择器
   * @param {string} tag - 标签名
   * @returns {SelectorBuilder} 链式调用
   */
  tag(tag) {
    this.parts.push(tag);
    return this;
  }

  /**
   * 添加ID选择器
   * @param {string} id - ID值
   * @returns {SelectorBuilder} 链式调用
   */
  id(id) {
    this.parts.push(`#${id}`);
    return this;
  }

  /**
   * 添加类选择器
   * @param {string} className - 类名
   * @returns {SelectorBuilder} 链式调用
   */
  class(className) {
    this.parts.push(`.${className}`);
    return this;
  }

  /**
   * 添加属性选择器
   * @param {string} attribute - 属性名
   * @param {string} value - 属性值 (可选)
   * @param {string} operator - 操作符 ('=', '*=', '^=', '$=', '~=', '|=')
   * @returns {SelectorBuilder} 链式调用
   */
  attribute(attribute, value = null, operator = '=') {
    if (value === null) {
      this.parts.push(`[${attribute}]`);
    } else {
      const escapedValue = value.replace(/"/g, '\\"');
      this.parts.push(`[${attribute}${operator}"${escapedValue}"]`);
    }
    return this;
  }

  /**
   * 添加后代选择器
   * @returns {SelectorBuilder} 链式调用
   */
  descendant() {
    this.parts.push(' ');
    return this;
  }

  /**
   * 添加子元素选择器
   * @returns {SelectorBuilder} 链式调用
   */
  child() {
    this.parts.push(' > ');
    return this;
  }

  /**
   * 添加相邻兄弟选择器
   * @returns {SelectorBuilder} 链式调用
   */
  adjacentSibling() {
    this.parts.push(' + ');
    return this;
  }

  /**
   * 添加通用兄弟选择器
   * @returns {SelectorBuilder} 链式调用
   */
  generalSibling() {
    this.parts.push(' ~ ');
    return this;
  }

  /**
   * 添加伪类选择器
   * @param {string} pseudoClass - 伪类名
   * @param {string} value - 伪类参数 (可选)
   * @returns {SelectorBuilder} 链式调用
   */
  pseudo(pseudoClass, value = null) {
    if (value === null) {
      this.parts.push(`:${pseudoClass}`);
    } else {
      this.parts.push(`:${pseudoClass}(${value})`);
    }
    return this;
  }

  /**
   * 构建最终的选择器
   * @returns {string} CSS选择器
   */
  build() {
    return this.parts.join('');
  }

  /**
   * 重置构建器
   * @returns {SelectorBuilder} 链式调用
   */
  reset() {
    this.parts = [];
    return this;
  }
}

/**
 * 创建选择器构建器实例
 * @returns {SelectorBuilder} 构建器实例
 */
export function createSelectorBuilder() {
  return new SelectorBuilder();
}
