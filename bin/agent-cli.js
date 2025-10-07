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
  PRESET_CONFIGS
} from '../src/index.js';
import { MCPBrowserClient } from '../src/mcp/browser-client.js';
import { createMCPBrowserServer, startMCPBrowserServer } from '../src/mcp/browser-server.js';
import { loadConfig, extractMcpServers, ensureDefaultConfigTemplate, resolveConfigPath } from '../src/utils/config-loader.js';

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

      // 确定启用的工具
      const enabledTools = [];
      if (options.enableBrowser || agent.browserClient || agent.browserToolManager) {
        enabledTools.push('browser');
      }
      if (options.enableMcp || agent.mcpManager || agent.mcpSystem) {
        enabledTools.push('mcp');
      }

      // 构建上下文提示
      const prompt = buildPromptTemplate(currentQuery, context, iteration, maxIterations, enabledTools);
      console.log(chalk.gray('\n--- Prompt ---\n'), prompt, chalk.gray('\n---------------\n'));

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
            
            // 格式化显示不同类型的工具结果
            if (tool.name === 'browser_navigate' && toolResult) {
              console.log(`- URL: ${toolResult.finalUrl || toolResult.url || 'N/A'}`);
              console.log(`- 状态: ${toolResult.statusCode || 'N/A'}`);
              console.log(`- 标题: ${toolResult.title || 'N/A'}`);
            } else if (tool.name === 'browser_extract' && toolResult) {
              // 处理提取结果的显示
              if (toolResult.results) {
                const results = toolResult.results;
                console.log(`- 页面标题: ${results.title?.elements?.[0]?.text || 'N/A'}`);
                console.log(`- 主标题: ${results.mainHeading?.elements?.[0]?.text || 'N/A'}`);
                
                const contentText = results.content?.elements?.[0]?.text;
                if (contentText) {
                  console.log(`- 内容长度: ${contentText.length} 字符`);
                  console.log(`- 内容预览: ${contentText.substring(0, 100)}${contentText.length > 100 ? '...' : ''}`);
                } else {
                  console.log('- 内容: 未提取到内容');
                }
              } else {
                console.log(JSON.stringify(toolResult, null, 2));
              }
            } else {
              console.log(JSON.stringify(toolResult, null, 2));
            }
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
function buildPromptTemplate(query, context, iteration, maxIterations, enabledTools = []) {
  let prompt = `你是一个智能助手。请分析用户的问题并提供帮助。

当前任务: ${query}

`;

  // 添加可用工具信息
  if (enabledTools.length > 0) {
    prompt += `可用工具:
`;
    if (enabledTools.includes('browser')) {
      prompt += `🌐 浏览器工具:
- browser_navigate: 访问网页 - 使用格式 "需要浏览 [URL]"
- browser_extract: 提取网页内容 - 使用格式 "需要提取内容"
- browser_click: 点击页面元素 - 使用格式 "需要点击 [选择器]"
- browser_type: 输入文本 - 使用格式 "需要输入 [文本] 到 [选择器]"
- browser_screenshot: 截图 - 使用格式 "需要截图"
- browser_evaluate: 执行JavaScript - 使用格式 "需要执行脚本 [代码]"
- browser_get_url: 获取当前URL - 使用格式 "需要获取当前网址"

`;
    }
    if (enabledTools.includes('mcp')) {
      prompt += `🔧 MCP工具: 根据连接的MCP服务器提供的工具

`;
    }
  }

  if (context.length > 0) {
    prompt += '历史上下文:\n';
    context.forEach((ctx) => {
      if (ctx.response) {
        prompt += `第${ctx.iteration}轮: ${ctx.response.substring(0, 200)}...\n`;
      }
      if (ctx.toolResults && ctx.toolResults.length > 0) {
        prompt += `工具调用结果: ${ctx.toolResults.map(tr => `${tr.tool}成功`).join(', ')}\n`;
      }
    });
    prompt += '\n';
  }

  prompt += `当前是第 ${iteration}/${maxIterations} 轮思考。

请按照以下格式回答:
1. 分析问题
2. 如果需要使用工具，明确说明具体的工具调用需求（如 "需要浏览 [URL]"）
3. 提供当前能给出的答案
4. 如果任务已完成，在最后说明"任务完成"

重要提示: 如果用户要求浏览网页，请务必使用浏览器工具实际访问，不要只是说明网站内容。`;

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

  // 更智能的模式匹配，基于成功的简化版逻辑
  const lines = content.split('\n');
  
  // 检查是否需要访问网页
  const needsNavigation = content.includes('访问') && (content.includes('http') || content.includes('网页') || content.includes('网站'));
  
  if (needsNavigation) {
    analysis.needsTools = true;
    
    // 提取URL - 更宽松的匹配，排除URL编码问题
    const urlMatch = content.match(/https?:\/\/[^\s\u4e00-\u9fff\]）)}>，。！？]+/);
    let url = null;
    if (urlMatch) {
      url = urlMatch[0].replace(/[，。！？]$/, ''); // 移除末尾的中文标点
    }
    
    if (url) {
      analysis.tools.push({
        name: 'browser_navigate',
        args: { 
          url: url,
          waitUntil: 'domcontentloaded',
          timeout: 15000
        }
      });
      
      // 如果导航成功，自动添加内容提取工具
      analysis.tools.push({
        name: 'browser_extract',
        args: {
          selectors: {
            'title': 'title',
            'heading': 'h1, h2',
            'content': 'main, article, .content, body',
            'paragraphs': 'p'
          },
          extractType: 'text',
          multiple: false,
          timeout: 10000
        }
      });
    }
  }
  
  for (const line of lines) {
    
    // 检查提取内容需求
    if (line.includes('需要提取内容') || line.includes('提取页面内容') || line.includes('提取页面') || line.includes('提取')) {
      analysis.needsTools = true;
      analysis.tools.push({
        name: 'browser_extract',
        args: {
          selectors: {
            'title': 'title',
            'mainHeading': 'h1',
            'content': 'main, article, .content, .post-content, .article-content, .markdown-body',
            'paragraphs': 'p'
          },
          extractType: 'text',
          multiple: false,
          timeout: 30000
        }
      });
    }
    
    // 检查点击需求
    if (line.includes('需要点击')) {
      analysis.needsTools = true;
      const selectorMatch = line.match(/需要点击\s*\[([^\]]+)\]/);
      if (selectorMatch) {
        analysis.tools.push({
          name: 'browser_click',
          args: { selector: selectorMatch[1] }
        });
      }
    }
    
    // 检查输入需求
    if (line.includes('需要输入')) {
      analysis.needsTools = true;
      const inputMatch = line.match(/需要输入\s*\[([^\]]+)\]\s*到\s*\[([^\]]+)\]/);
      if (inputMatch) {
        analysis.tools.push({
          name: 'browser_type',
          args: { text: inputMatch[1], selector: inputMatch[2] }
        });
      }
    }
    
    // 检查截图需求
    if (line.includes('需要截图')) {
      analysis.needsTools = true;
      analysis.tools.push({
        name: 'browser_screenshot',
        args: {}
      });
    }
    
    // 检查执行脚本需求
    if (line.includes('需要执行脚本')) {
      analysis.needsTools = true;
      const scriptMatch = line.match(/需要执行脚本\s*\[([^\]]+)\]/);
      if (scriptMatch) {
        analysis.tools.push({
          name: 'browser_evaluate',
          args: { script: scriptMatch[1] }
        });
      }
    }
    
    // 检查获取URL需求
    if (line.includes('需要获取当前网址') || line.includes('需要获取当前URL')) {
      analysis.needsTools = true;
      analysis.tools.push({
        name: 'browser_get_url',
        args: {}
      });
    }

    // 检查是否完成
    if (line.includes('任务完成') || line.includes('回答完毕') || line.includes('COMPLETE')) {
      analysis.isComplete = true;
    }
  }

  // 如果有工具调用需求，优先执行工具，忽略完成标识
  if (analysis.needsTools) {
    analysis.isComplete = false;
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
    console.log(chalk.blue(`🔧 执行工具: ${tool.name}`), tool.args);
    
    if (tool.name.startsWith('browser_')) {
      // 浏览器工具调用
      if (agent.browserClient) {
        const result = await agent.browserClient.callTool(tool.name, tool.args);
        
        // 处理MCP响应格式，提取实际数据
        let extractedData = result;
        if (result && typeof result === 'object') {
          // 如果是MCP格式响应，提取数据
          if (result.content && Array.isArray(result.content)) {
            extractedData = result.content[0]?.text || result.content[0] || result;
          } else if (result.data) {
            extractedData = result.data;
          }
        }
        
        console.log(chalk.green(`✅ 工具 ${tool.name} 执行成功`));
        return extractedData;
      } else if (agent.browserToolManager) {
        // 直接使用 BrowserToolManager
        const response = await agent.browserToolManager.executeLocalTool(tool.name.replace('browser_', ''), tool.args);
        
        // 处理双层嵌套的响应数据
        let extractedData = response.data;
        if (response.data && response.data.data) {
          extractedData = response.data.data;
        }
        
        console.log(chalk.green(`✅ 工具 ${tool.name} 执行成功`));
        return extractedData;
      } else {
        throw new Error('浏览器工具未启用');
      }
    } else if (agent.mcpSystem && agent.mcpSystem.callTool) {
      // 通过配置化的 MCP 系统调用
      return await agent.mcpSystem.callTool(tool.name, tool.args);
    } else if (agent.mcpManager) {
      // 兼容旧的 mcpManager
      return await agent.mcpManager.callTool(tool.name, tool.args);
    } else {
      throw new Error(`未知的工具: ${tool.name}`);
    }
  } catch (error) {
    console.error(chalk.red(`❌ 工具 ${tool.name} 执行失败:`), error.message);
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
  // Load external config (TOML/JSON) and merge
  const { config: fileCfg } = loadConfig(globalOpts.config);

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
      provider: fileCfg?.llm?.provider || globalOpts.provider,
      options: {
        model: fileCfg?.llm?.options?.model || globalOpts.model,
        apiKey: globalOpts.apiKey || fileCfg?.llm?.options?.apiKey ||
                ((fileCfg?.llm?.provider || globalOpts.provider) === 'spark' ? process.env.SPARK_API_KEY : process.env.OPENAI_API_KEY),
        baseURL: fileCfg?.llm?.options?.baseURL || globalOpts.baseUrl,
        maxTokens: fileCfg?.llm?.options?.maxTokens || globalOpts.maxTokens,
        temperature: fileCfg?.llm?.options?.temperature || globalOpts.temperature
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

  // Inject MCP servers from config
  const mcpServers = extractMcpServers(fileCfg);
  if (mcpServers.length > 0) {
    config.mcp = {
      servers: mcpServers,
      manager: fileCfg?.mcp?.manager || {},
      toolSystem: fileCfg?.mcp?.toolSystem || {}
    };
  }

  const agent = new AgentCore(config);
  await agent.initialize();

  // 启用浏览器工具
  if (cmdOpts.enableBrowser) {
    try {
      // 方法1: 尝试使用 MCP 浏览器服务器
      await startMCPBrowserServer();
      
      const { MCPBrowserClient } = await import('../src/mcp/browser-client.js');
      agent.browserClient = new MCPBrowserClient();
      await agent.browserClient.connect();
      
      console.log(chalk.green('✅ MCP 浏览器客户端连接成功'));
    } catch (mcpError) {
      console.log(chalk.yellow('⚠️  MCP 浏览器连接失败，尝试直接使用浏览器工具管理器...'));
      
      try {
        // 方法2: 直接使用 BrowserToolManager
        const { BrowserToolManager } = await import('../src/browser/tool-manager.js');
        agent.browserToolManager = new BrowserToolManager({
          headless: true,
          defaultTimeout: 30000,
          security: {
            level: 'normal',
            allowedDomains: ['*'],
            allowedProtocols: ['https:', 'http:']
          }
        });
        
        await agent.browserToolManager.initialize();
        console.log(chalk.green('✅ 浏览器工具管理器初始化成功'));
      } catch (directError) {
        console.error(chalk.red('❌ 浏览器工具初始化完全失败:'), directError.message);
        console.log(chalk.yellow('⚠️  继续运行，但浏览器工具将不可用'));
      }
    }
  }

  // 启用 MCP 连接
  // If CLI flag requests MCP, and not provided by config, create empty manager (no servers)
  if (cmdOpts.enableMcp && !agent.mcpSystem) {
    agent.mcpManager = new MCPConnectionManager({ servers: [] });
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
  if (agent.browserToolManager) {
    await agent.browserToolManager.cleanup();
  }
  if (agent.mcpSystem) {
    await agent.mcpSystem.shutdown();
  } else if (agent.mcpManager && agent.mcpManager.shutdown) {
    await agent.mcpManager.shutdown();
  }
}

/**
 * 配置初始化
 */
async function initConfig(options) {
  console.log(chalk.blue('🔧 初始化 Agent-Core 配置...'));
  const path = ensureDefaultConfigTemplate();
  console.log(chalk.green('✅ 配置初始化完成'));
  console.log('配置路径:', chalk.cyan(path));
}

/**
 * 显示配置
 */
async function showConfig() {
  const { path, format, config } = (() => {
    const p = resolveConfigPath();
    if (!p) return { path: null, format: null, config: {} };
    const loaded = loadConfig(p);
    return { path: loaded.path, format: loaded.format, config: loaded.config };
  })();

  console.log(chalk.blue('📋 当前配置:'));
  if (!path) {
    console.log(chalk.yellow('未找到配置文件。可运行 `agent-cli config init` 生成模板。'));
    return;
  }
  console.log('路径:', chalk.cyan(path), '格式:', chalk.cyan(format || 'unknown'));
  try {
    console.log(JSON.stringify(config, null, 2));
  } catch {
    console.log(config);
  }
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
