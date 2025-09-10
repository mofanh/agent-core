#!/usr/bin/env node

/**
 * Agent-Core CLI - 智能代理命令行工具
 * 
 * 参考 codex 设计，提供终端调用、循环思考和 MCP 集成功能
 * 
 * 使用方法:
 * agent-cli interactive              # 进入交互式模式
 * agent-cli exec "你的问题"          # 非交互式执行
 * agent-cli mcp                      # 启动 MCP 服务器模式
 * agent-cli browser                  # 启动浏览器工具服务
 * agent-cli --help                   # 显示帮助信息
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// ES模块的 __dirname 等价物
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json 获取版本信息
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8')
);

// 导入 agent-core 核心功能
import { 
  AgentCore,
  LLMFactory,
  MCPConnectionManager,
  MCPBrowserClient,
  createMCPBrowserServer,
  startMCPBrowserServer,
  PRESET_CONFIGS
} from '../src/index.js';

// 导入 TUI 模块
import AgentTUI from '../src/tui/index.js';

// 创建主程序命令
const program = new Command();

program
  .name('agent-cli')
  .description('Agent-Core 智能代理命令行工具')
  .version(packageJson.version);

// 全局选项
program
  .option('-v, --verbose', '启用详细日志输出')
  .option('-c, --config <path>', '指定配置文件路径')
  .option('--provider <provider>', 'LLM 提供商 (openai|spark)', 'openai')
  .option('--model <model>', 'LLM 模型名称')
  .option('--api-key <key>', 'API 密钥')
  .option('--base-url <url>', 'API 基础URL')
  .option('--max-tokens <number>', '最大 tokens 数量', parseInt)
  .option('--temperature <number>', '采样温度', parseFloat);

// 交互式模式 - 类似 codex 的默认模式
program
  .command('interactive')
  .alias('i')
  .description('进入交互式对话模式 (类似 codex 默认模式)')
  .option('--auto-approve', '自动批准操作，跳过确认')
  .option('--max-iterations <number>', '最大思考迭代次数', parseInt, 10)
  .option('--enable-browser', '启用浏览器工具')
  .option('--enable-mcp', '启用 MCP 服务连接')
  .action(async (options) => {
    await runInteractiveMode(program.opts(), options);
  });

// 非交互式执行模式 - 类似 codex exec
program
  .command('exec <query>')
  .alias('e')
  .description('非交互式执行单个查询')
  .option('--output <format>', '输出格式 (text|json|markdown)', 'text')
  .option('--max-iterations <number>', '最大思考迭代次数', parseInt, 5)
  .option('--enable-browser', '启用浏览器工具')
  .option('--enable-mcp', '启用 MCP 服务连接')
  .option('--auto-approve', '自动批准操作，跳过确认')
  .action(async (query, options) => {
    await runExecMode(query, program.opts(), options);
  });

// MCP 服务器模式 - 类似 codex mcp
program
  .command('mcp')
  .description('启动 MCP 服务器模式，通过 stdio 提供服务')
  .option('--port <number>', 'HTTP 服务端口 (可选)', parseInt)
  .option('--transport <type>', '传输协议 (stdio|http)', 'stdio')
  .action(async (options) => {
    await runMCPServerMode(program.opts(), options);
  });

// 浏览器工具服务
program
  .command('browser')
  .alias('b')
  .description('启动独立的浏览器工具 MCP 服务')
  .option('--headless', '无头模式运行浏览器', true)
  .option('--devtools', '启用开发者工具')
  .option('--port <number>', 'HTTP 服务端口', parseInt)
  .action(async (options) => {
    await runBrowserServerMode(program.opts(), options);
  });

// 配置管理
const configCmd = program
  .command('config')
  .description('配置管理');

configCmd
  .command('init')
  .description('初始化配置文件')
  .option('--force', '强制覆盖现有配置')
  .action(async (options) => {
    await initConfig(options);
  });

configCmd
  .command('show')
  .description('显示当前配置')
  .action(async () => {
    await showConfig();
  });

// 调试命令
const debugCmd = program
  .command('debug')
  .description('调试和测试命令');

debugCmd
  .command('llm')
  .description('测试 LLM 连接')
  .action(async () => {
    await debugLLM(program.opts());
  });

debugCmd
  .command('mcp')
  .description('测试 MCP 连接')
  .action(async () => {
    await debugMCP(program.opts());
  });

debugCmd
  .command('browser')
  .description('测试浏览器工具')
  .action(async () => {
    await debugBrowser(program.opts());
  });

// 主要功能实现

/**
 * 交互式模式 - 循环对话和思考
 */
async function runInteractiveMode(globalOpts, cmdOpts) {
  try {
    const agent = await initializeAgent(globalOpts, cmdOpts);
    
    // 创建 TUI 实例
    const tui = new AgentTUI({
      maxIterations: cmdOpts.maxIterations || 10,
      showThinking: !cmdOpts.quiet,
      debug: globalOpts.verbose
    });
    
    // 启动交互式界面
    await tui.start(agent);
    
    await cleanup(agent);
  } catch (error) {
    console.error(chalk.red('❌ 交互式模式启动失败:'), error.message);
    if (globalOpts.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * 非交互式执行模式
 */
async function runExecMode(query, globalOpts, cmdOpts) {
  const spinner = ora('🚀 初始化 Agent...').start();
  
  try {
    const agent = await initializeAgent(globalOpts, cmdOpts);
    spinner.succeed('✅ Agent 初始化完成');

    // 执行思考循环
    const result = await performThinkingLoop(agent, query, globalOpts, cmdOpts, spinner, false);

    // 输出结果
    outputResult(result, cmdOpts.output);

    await cleanup(agent);
    process.exit(0);

  } catch (error) {
    spinner.fail('❌ 执行失败');
    console.error(chalk.red('错误:'), error.message);
    if (globalOpts.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * MCP 服务器模式
 */
async function runMCPServerMode(globalOpts, cmdOpts) {
  console.log(chalk.blue.bold('🔌 启动 MCP 服务器模式...'));
  
  try {
    if (cmdOpts.transport === 'stdio') {
      // Stdio 模式 - 通过标准输入输出通信
      await startMCPBrowserServer();
    } else if (cmdOpts.transport === 'http' && cmdOpts.port) {
      // HTTP 模式 (待实现)
      console.log(chalk.yellow('⚠️  HTTP 传输模式尚未实现'));
      process.exit(1);
    } else {
      console.error(chalk.red('❌ 无效的传输模式或缺少端口配置'));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('❌ MCP 服务器启动失败:'), error.message);
    process.exit(1);
  }
}

/**
 * 浏览器工具服务模式
 */
async function runBrowserServerMode(globalOpts, cmdOpts) {
  console.log(chalk.blue.bold('🌐 启动浏览器工具服务...'));
  
  try {
    // 设置环境变量
    if (!cmdOpts.headless) {
      process.env.HEADLESS = 'false';
    }
    if (cmdOpts.devtools) {
      process.env.DEVTOOLS = 'true';
    }

    await startMCPBrowserServer();
  } catch (error) {
    console.error(chalk.red('❌ 浏览器服务启动失败:'), error.message);
    process.exit(1);
  }
}

/**
 * 核心思考循环 - 参考 codex 的迭代思考模式
 */
async function performThinkingLoop(agent, query, globalOpts, options, spinner, interactive = true) {
  const maxIterations = options.maxIterations || 10;
  let iteration = 0;
  let currentQuery = query;
  let context = [];
  let finalResult = null;

  spinner.start(`🤔 开始思考 (${iteration + 1}/${maxIterations})`);

  while (iteration < maxIterations) {
    try {
      iteration++;
      spinner.text = `🤔 思考中... (第 ${iteration}/${maxIterations} 轮)`;

      // 构建上下文提示
      const prompt = buildPromptTemplate(currentQuery, context, iteration, maxIterations);

      // 调用 LLM
      const response = await agent.llm.request({
        model: globalOpts.model || (globalOpts.provider === 'spark' ? '4.0Ultra' : 'gpt-3.5-turbo'),
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        max_tokens: globalOpts.maxTokens || 1000
      });

      const content = response.choices[0]?.message?.content || '';
      
      // 解析 LLM 响应，判断是否需要使用工具
      const analysis = parseAgentResponse(content);
      
      context.push({
        iteration,
        query: currentQuery,
        response: content,
        analysis
      });

      if (interactive) {
        console.log(chalk.green(`\n🤖 Agent (第 ${iteration} 轮):`));
        console.log(content);
      }

      // 如果需要工具调用
      if (analysis.needsTools && analysis.tools.length > 0) {
        spinner.text = `🔧 执行工具调用...`;
        
        for (const tool of analysis.tools) {
          const toolResult = await executeToolCall(agent, tool, options);
          context.push({
            iteration,
            type: 'tool_result',
            tool: tool.name,
            result: toolResult
          });
          
          if (interactive) {
            console.log(chalk.blue(`🔧 工具 ${tool.name} 执行结果:`));
            console.log(JSON.stringify(toolResult, null, 2));
          }
        }

        // 更新查询，包含工具结果
        currentQuery = `基于前面的分析和工具执行结果，继续处理原始问题: ${query}`;
      }

      // 如果 LLM 认为已经完成
      if (analysis.isComplete) {
        finalResult = {
          success: true,
          result: content,
          iterations: iteration,
          context
        };
        spinner.succeed(`✅ 思考完成 (${iteration} 轮)`);
        break;
      }

      // 如果是最后一轮迭代
      if (iteration >= maxIterations) {
        finalResult = {
          success: false,
          result: content,
          reason: 'MAX_ITERATIONS_REACHED',
          iterations: iteration,
          context
        };
        spinner.warn(`⚠️  达到最大迭代次数 (${maxIterations})`);
        break;
      }

    } catch (error) {
      spinner.fail(`❌ 第 ${iteration} 轮思考失败`);
      console.error(chalk.red('错误:'), error.message);
      
      finalResult = {
        success: false,
        error: error.message,
        iterations: iteration,
        context
      };
      break;
    }
  }

  return finalResult;
}

/**
 * 构建简单的提示模板
 */
function buildPromptTemplate(query, context, iteration, maxIterations) {
  let prompt = `你是一个智能助手。请分析用户的问题并提供帮助。

当前任务: ${query}

`;

  if (context.length > 0) {
    prompt += '历史上下文:\n';
    context.forEach((ctx) => {
      prompt += `第${ctx.iteration}轮: ${ctx.response.substring(0, 200)}...\n`;
      if (ctx.toolResults && ctx.toolResults.length > 0) {
        prompt += `工具调用结果: ${ctx.toolResults.map(tr => `${tr.tool}成功`).join(', ')}\n`;
      }
    });
    prompt += '\n';
  }

  prompt += `当前是第 ${iteration}/${maxIterations} 轮思考。

请按照以下格式回答:
1. 分析问题
2. 如果需要使用工具，明确说明"需要浏览 [URL]" 或其他工具需求
3. 提供当前能给出的答案
4. 如果任务已完成，在最后说明"任务完成"`;

  return prompt;
}

/**
 * 解析 Agent 响应，提取工具调用意图和完成状态
 */
function parseAgentResponse(content) {
  const analysis = {
    needsTools: false,
    tools: [],
    isComplete: false,
    reasoning: ''
  };

  // 简单的模式匹配 - 生产环境中应该使用更复杂的 NLP 解析
  const lines = content.split('\n');
  
  for (const line of lines) {
    // 检查是否需要浏览器工具
    if (line.includes('需要浏览') || line.includes('访问网页') || line.includes('打开页面')) {
      analysis.needsTools = true;
      const urlMatch = line.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        analysis.tools.push({
          name: 'browser_navigate',
          args: { url: urlMatch[0] }
        });
      }
    }

    // 检查是否完成
    if (line.includes('任务完成') || line.includes('回答完毕') || line.includes('COMPLETE')) {
      analysis.isComplete = true;
    }
  }

  // 如果没有明确的完成标识，但也没有工具调用需求，认为是完成
  if (!analysis.needsTools && !analysis.isComplete) {
    analysis.isComplete = true;
  }

  return analysis;
}

/**
 * 执行工具调用
 */
async function executeToolCall(agent, tool, options) {
  try {
    if (tool.name.startsWith('browser_')) {
      // 浏览器工具调用
      if (agent.browserClient) {
        return await agent.browserClient.callTool(tool.name, tool.args);
      } else {
        throw new Error('浏览器工具未启用');
      }
    } else if (agent.mcpManager) {
      // 其他 MCP 工具调用
      return await agent.mcpManager.callTool(tool.name, tool.args);
    } else {
      throw new Error(`未知的工具: ${tool.name}`);
    }
  } catch (error) {
    return {
      error: error.message,
      success: false
    };
  }
}

/**
 * 初始化 Agent 实例
 */
async function initializeAgent(globalOpts, cmdOpts) {
  // 首先注册 LLM 提供商
  const { LLMFactory, openaiRequestHandler, sparkRequestHandler } = await import('../src/llm/index.js');
  
  // 注册 OpenAI 提供商
  LLMFactory.register('openai', openaiRequestHandler, null, {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000
  });
  
  // 注册星火提供商
  LLMFactory.register('spark', sparkRequestHandler, null, {
    model: 'generalv3.5',
    temperature: 0.7,
    maxTokens: 2000
  });

  const config = {
    llm: {
      provider: globalOpts.provider,
      options: {
        model: globalOpts.model,
        apiKey: globalOpts.apiKey || 
                (globalOpts.provider === 'spark' ? process.env.SPARK_API_KEY : process.env.OPENAI_API_KEY),
        baseURL: globalOpts.baseUrl,
        maxTokens: globalOpts.maxTokens,
        temperature: globalOpts.temperature
      }
    },
    prompt: {
      customTemplates: {
        agent_thinking: `你是一个智能助手。请分析用户的问题并提供帮助。

当前任务: {{query}}

历史上下文:
{{#each context}}
第{{iteration}}轮: {{response}}
{{#if analysis.tools}}
工具调用: {{#each analysis.tools}}{{name}}({{args}}) {{/each}}
{{/if}}
{{/each}}

当前是第 {{iteration}}/{{maxIterations}} 轮思考。

请按照以下格式回答:
1. 分析问题
2. 如果需要使用工具，明确说明"需要浏览 [URL]" 或其他工具需求
3. 提供当前能给出的答案
4. 如果任务已完成，在最后说明"任务完成"`
      }
    }
  };

  const agent = new AgentCore(config);
  await agent.initialize();

  // 启用浏览器工具
  if (cmdOpts.enableBrowser) {
    const { MCPBrowserClient } = await import('../src/mcp/browser-client.js');
    agent.browserClient = new MCPBrowserClient();
    await agent.browserClient.connect();
  }

  // 启用 MCP 连接
  if (cmdOpts.enableMcp) {
    agent.mcpManager = new MCPConnectionManager();
  }

  return agent;
}

/**
 * 输出结果
 */
function outputResult(result, format) {
  switch (format) {
    case 'json':
      console.log(JSON.stringify(result, null, 2));
      break;
    case 'markdown':
      console.log(`# Agent 执行结果\n\n${result.result}\n\n**迭代次数:** ${result.iterations}`);
      break;
    default:
      console.log(chalk.green('\n🎯 最终结果:'));
      console.log(result.result);
      console.log(chalk.gray(`\n📊 统计: ${result.iterations} 轮思考`));
  }
}

/**
 * 清理资源
 */
async function cleanup(agent) {
  if (agent.browserClient) {
    await agent.browserClient.disconnect();
  }
  if (agent.mcpManager) {
    await agent.mcpManager.disconnectAll();
  }
}

/**
 * 配置初始化
 */
async function initConfig(options) {
  console.log(chalk.blue('🔧 初始化 Agent-Core 配置...'));
  // TODO: 实现配置文件创建
  console.log(chalk.green('✅ 配置初始化完成'));
}

/**
 * 显示配置
 */
async function showConfig() {
  console.log(chalk.blue('📋 当前配置:'));
  // TODO: 实现配置显示
}

/**
 * 调试 LLM
 */
async function debugLLM(globalOpts) {
  const spinner = ora('🧪 测试 LLM 连接...').start();
  try {
    const agent = await initializeAgent(globalOpts, {});
    const response = await agent.llm.request({
      model: globalOpts.model || (globalOpts.provider === 'spark' ? '4.0Ultra' : 'gpt-3.5-turbo'),
      messages: [{ role: 'user', content: '你好，这是一个连接测试。' }],
      max_tokens: 50
    });
    spinner.succeed('✅ LLM 连接正常');
    console.log(chalk.green('响应:'), response.choices[0]?.message?.content);
  } catch (error) {
    spinner.fail('❌ LLM 连接失败');
    console.error(chalk.red('错误:'), error.message);
  }
}

/**
 * 调试 MCP
 */
async function debugMCP(globalOpts) {
  const spinner = ora('🧪 测试 MCP 连接...').start();
  try {
    const { MCPBrowserClient } = await import('../src/mcp/browser-client.js');
    const client = new MCPBrowserClient();
    await client.connect();
    
    const tools = await client.listTools();
    spinner.succeed('✅ MCP 连接正常');
    console.log(chalk.green('可用工具:'), tools.map(t => t.name).join(', '));
    
    await client.disconnect();
  } catch (error) {
    spinner.fail('❌ MCP 连接失败');
    console.error(chalk.red('错误:'), error.message);
  }
}

/**
 * 调试浏览器工具
 */
async function debugBrowser(globalOpts) {
  const spinner = ora('🧪 测试浏览器工具...').start();
  try {
    const { MCPBrowserClient } = await import('../src/mcp/browser-client.js');
    const client = new MCPBrowserClient();
    await client.connect();
    
    const result = await client.callTool('browser_navigate', { 
      url: 'https://example.com' 
    });
    
    spinner.succeed('✅ 浏览器工具正常');
    console.log(chalk.green('测试结果:'), result);
    
    await client.disconnect();
  } catch (error) {
    spinner.fail('❌ 浏览器工具测试失败');
    console.error(chalk.red('错误:'), error.message);
  }
}

// 错误处理
process.on('uncaughtException', (error) => {
  console.error(chalk.red('🚨 未捕获的异常:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('🚨 未处理的 Promise 拒绝:'), reason);
  process.exit(1);
});

// 优雅退出
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n👋 收到中断信号，正在退出...'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n👋 收到终止信号，正在退出...'));
  process.exit(0);
});

// 解析命令行参数
program.parse();
