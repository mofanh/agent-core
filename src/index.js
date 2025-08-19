// 导出 LLM 相关功能
export { llmStreamRequest } from './llm/stream.js';
// agent-core 主入口，根据 README 示例导出核心 API



// 引入日志类
import Logger from './utils/logger.js';

// 预设配置，适配日志等级
export const PRESET_CONFIGS = {
  basic: { name: 'basic', description: '基础配置', logger: new Logger('info') },
  performance: { name: 'performance', description: '性能优化配置', logger: new Logger('warn') },
  debug: { name: 'debug', description: '调试配置', logger: new Logger('debug') }
};

// AgentCore 主类
export class AgentCore {
  constructor(config = {}) {
    this.config = config;
    this.initialized = false;
  }
  async initialize() {}
  async execute(task) {}
  async executeBatch(tasks, options = {}) {}
  async executeStream(task) {}
  async getHealth() {}
  async getCapabilities() {}
  async shutdown() {}
}

// 快速启动
export async function quickStart(preset = 'basic', options = {}) {
  const agent = new AgentCore({ ...PRESET_CONFIGS[preset], ...options });
  await agent.initialize();
  return agent.execute(options);
}

// 页面分析
export async function analyzePage(url, options = {}) {
  return {
    pageInfo: { url, title: 'Demo Page' },
    domStructure: '<html>...</html>'
  };
}

// DOM 操作
export async function manipulateDOM(url, actions = []) {
  return {
    url,
    actions,
    result: 'DOM 操作已模拟执行'
  };
}

// 批量处理
export async function batchProcess(tasks, options = {}) {
  return tasks.map(task => ({ ...task, status: 'done' }));
}

// 创建 agent（支持预设名或自定义配置）
export function createAgent(presetOrConfig, options = {}) {
  if (typeof presetOrConfig === 'string') {
    return new AgentCore({ ...PRESET_CONFIGS[presetOrConfig], ...options });
  }
  return new AgentCore({ ...presetOrConfig });
}
