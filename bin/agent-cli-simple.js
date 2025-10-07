#!/usr/bin/env node

/**
 * 简化版 Agent-CLI
 * 基于 test-simplified-agent-cli.js 的成功经验重新实现
 * 支持 MCP (Model Context Protocol) 配置调用框架
 */

import { createLLMAgent } from '../src/llm/index.js';
import { loadConfig, extractMcpServers } from '../src/utils/config-loader.js';
import chalk from 'chalk';
import { Command } from 'commander';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const MAX_TOOL_RESULT_CHARS = 800;

function truncateForPrompt(text, limit = MAX_TOOL_RESULT_CHARS) {
  if (!text) return '';
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  if (str.length <= limit) return str;
  return `${str.slice(0, limit)}...`;
}

function summarizeToolResultForPrompt(callName, toolResult, limit = MAX_TOOL_RESULT_CHARS) {
  if (!toolResult) return '';

  const nestedData = toolResult?.data?.data?.data ?? toolResult?.data?.data ?? toolResult?.data;

  switch (callName) {
    case 'browser.extract': {
      const results = nestedData?.results;
      if (results && typeof results === 'object') {
        const sections = [];
        for (const [key, entry] of Object.entries(results)) {
          if (!entry?.success || !entry?.elements?.length) continue;
          const elementSnippets = entry.elements
            .map((element) => {
              if (element?.text && typeof element.text === 'string') {
                return element.text.trim().slice(0, 160);
              }
              if (element?.attributes && typeof element.attributes === 'object') {
                const attrs = Object.entries(element.attributes)
                  .map(([attrKey, attrValue]) => `${attrKey}=${String(attrValue).trim().slice(0, 60)}`)
                  .join(', ');
                return attrs ? `属性: ${attrs}` : '';
              }
              return '';
            })
            .filter(Boolean)
            .slice(0, 2);

          if (elementSnippets.length) {
            sections.push(`${key}: ${elementSnippets.join(' | ')}`);
          }

          if (sections.length >= 4) break;
        }

        if (sections.length) {
          return truncateForPrompt(sections.join('\n'), limit);
        }
      }
      break;
    }
    case 'browser.evaluate': {
      const evaluation = nestedData?.result ?? nestedData;
      if (evaluation && typeof evaluation === 'object') {
        return truncateForPrompt(JSON.stringify(evaluation, null, 2), limit);
      }
      if (evaluation) {
        return truncateForPrompt(String(evaluation), limit);
      }
      break;
    }
    case 'browser.navigate': {
      if (nestedData && typeof nestedData === 'object') {
        const parts = [];
        if (nestedData.finalUrl) parts.push(`finalUrl=${nestedData.finalUrl}`);
        if (nestedData.title) parts.push(`title=${nestedData.title}`);
        if (typeof nestedData.statusCode !== 'undefined') parts.push(`status=${nestedData.statusCode}`);
        if (typeof nestedData.loadTime === 'number') parts.push(`loadTime=${nestedData.loadTime}ms`);
        if (nestedData.pageInfo?.description) {
          parts.push(`description=${nestedData.pageInfo.description.slice(0, 120)}`);
        }
        if (parts.length) {
          return truncateForPrompt(parts.join(', '), limit);
        }
      }
      break;
    }
    case 'browser.screenshot': {
      const dataUrl = nestedData?.dataUrl;
      if (typeof dataUrl === 'string') {
        const match = dataUrl.match(/^data:(.*?);/);
        const meta = match ? match[1] : 'unknown';
        return `截图(${meta}, 长度 ${dataUrl.length})`;
      }
      break;
    }
    default:
      break;
  }

  if (nestedData) {
    return truncateForPrompt(JSON.stringify(nestedData, null, 2), limit);
  }

  if (toolResult?.result) {
    return truncateForPrompt(JSON.stringify(toolResult.result, null, 2), limit);
  }

  return '';
}

const program = new Command();

program
  .name('agent-cli-simple')
  .description('简化版 Agent-CLI 智能代理命令行工具')
  .version('1.0.0');


program
  .command('exec <query>')
  .description('执行智能代理任务 (LLM 自动规划+工具调用)')
  .option('--provider <provider>', 'LLM 提供商', 'spark')
  .option('--max-iterations <number>', '最大迭代次数', parseInt, 5)
  .option('--headless', '无头浏览器 (仅当未配置MCP时生效)')
  .option('--no-mcp', '禁用 MCP，强制使用内置浏览器工具')
  .action(async (query, options) => {
    await runAgentAutoMode(query, options);
  });

program
  .command('config')
  .description('显示配置信息')
  .action(async () => {
    try {
      console.log(chalk.blue.bold('📋 配置信息'));
      console.log('');
      
      const { config, path, format } = loadConfig();
      
      if (!path) {
        console.log(chalk.yellow('⚠️  未找到配置文件'));
        console.log(chalk.gray('   提示: 运行 `node bin/agent-cli.js config init` 初始化配置'));
        return;
      }
      
      console.log(chalk.green('✅ 配置文件路径:'), path);
      console.log(chalk.green('✅ 配置文件格式:'), format);
      console.log('');
      
      const mcpServers = extractMcpServers(config);
      
      if (mcpServers.length === 0) {
        console.log(chalk.yellow('⚠️  没有配置 MCP 服务器'));
        console.log(chalk.gray('   将使用内置浏览器工具'));
      } else {
        console.log(chalk.green(`✅ MCP 服务器数量: ${mcpServers.length}`));
        console.log('');
        mcpServers.forEach((server, idx) => {
          console.log(chalk.cyan(`[${idx + 1}] ${server.name}`));
          console.log(chalk.gray(`    命令: ${server.command}`));
          console.log(chalk.gray(`    参数: ${server.args.join(' ')}`));
          console.log(chalk.gray(`    传输: ${server.transport || 'stdio'}`));
          if (server.env && Object.keys(server.env).length > 0) {
            console.log(chalk.gray(`    环境变量: ${Object.keys(server.env).join(', ')}`));
          }
          console.log('');
        });
      }
      
    } catch (error) {
      console.error(chalk.red('❌ 配置加载失败:'), error.message);
    }
  });

async function runAgentAutoMode(query, options) {
  let rl;
  let agent = null;
  
  try {
    console.log(chalk.blue.bold('🚀 启动全自动 Agent-CLI (LLM 规划+工具调用)'));
    
    // 1. 加载 MCP 配置
    console.log(chalk.cyan('📄 正在加载配置文件...'));
    let mcpServers = [];
    
    if (options.mcp !== false) {
      // 默认启用 MCP，除非使用 --no-mcp
      try {
        const { config, path, format } = loadConfig();
        if (path) {
          console.log(chalk.green(`✅ 配置文件: ${path} (${format})`));
          mcpServers = extractMcpServers(config);
          
          if (mcpServers.length > 0) {
            console.log(chalk.green(`✅ 发现 ${mcpServers.length} 个 MCP 服务器:`));
            mcpServers.forEach(server => {
              console.log(chalk.gray(`   - ${server.name}: ${server.command} ${server.args.join(' ')}`));
            });
          } else {
            console.log(chalk.yellow('⚠️  配置文件中没有 MCP 服务器，将使用内置浏览器工具'));
          }
        } else {
          console.log(chalk.yellow('⚠️  未找到配置文件，将使用内置浏览器工具'));
          console.log(chalk.gray('   提示: 运行 `node bin/agent-cli.js config init` 初始化配置'));
        }
      } catch (error) {
        console.log(chalk.yellow(`⚠️  配置加载失败: ${error.message}`));
        console.log(chalk.yellow('   将使用内置浏览器工具'));
      }
    } else {
      console.log(chalk.yellow('⚠️  已禁用 MCP (--no-mcp)，将使用内置浏览器工具'));
    }
    console.log('');
    
    // 2. 创建 Agent
    console.log(chalk.cyan('🤖 正在创建 Agent...'));
    const agentConfig = {
      llm: {
        provider: options.provider || 'spark',
        options: {
          apiKey: process.env.LLM_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau'
        }
      },
      agent: {
        maxRetries: 2,
        timeout: 60000
      }
    };
    
    // 优先使用 MCP 工具，如果没有配置则使用内置浏览器工具
    if (mcpServers.length > 0) {
      agentConfig.mcp = {
        servers: mcpServers
      };
      console.log(chalk.green('✅ 使用 MCP 工具系统'));
    } else {
      // 暂时注释掉内置浏览器工具，专注测试 MCP
      // agentConfig.browser = {
      //   enabled: true,
      //   headless: !!options.headless,
      //   security: {
      //     level: 'normal',
      //     allowedDomains: ['*'],
      //     allowedProtocols: ['https:', 'http:']
      //   }
      // };
      console.log(chalk.yellow('⚠️  未配置 MCP 且内置浏览器工具已禁用'));
      console.log(chalk.yellow('   请配置 MCP 服务器后重试'));
      // console.log(chalk.green('✅ 使用内置浏览器工具'));
    }
    
    agent = createLLMAgent(agentConfig);

    await agent.initialize();
    
    // 如果配置了 MCP，需要初始化连接并等待工具加载后重新注册
    if (agent.mcpSystem) {
      console.log(chalk.cyan('⏳ 正在初始化 MCP 连接...'));
      
      // 初始化 MCP 连接
      if (agent.mcpSystem.initialize) {
        await agent.mcpSystem.initialize();
        console.log(chalk.green('✅ MCP 连接初始化完成'));
      }
      
      // 等待工具加载
      console.log(chalk.cyan('⏳ 等待 MCP 工具加载...'));
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mcpTools = agent.mcpSystem.toolSystem ? agent.mcpSystem.toolSystem.getTools() : [];
      if (mcpTools.length > 0) {
        console.log(chalk.green(`� MCP 工具已加载: ${mcpTools.length} 个`));
        
        // 重新注册 MCP 工具到 toolRegistry（包含完整描述）
        for (const tool of mcpTools) {
          agent.toolRegistry.set(tool.name, {
            type: 'mcp',
            handler: agent.mcpSystem.toolSystem,
            schema: tool.inputSchema,
            description: tool.description
          });
        }
        console.log(chalk.green(`✅ 已重新注册 ${mcpTools.length} 个 MCP 工具`));
      }
    }
    
    console.log(chalk.green(`�📝 已注册工具: ${agent.toolRegistry.size} 个`));
    for (const [name, info] of Array.from(agent.toolRegistry.entries()).slice(0, 5)) {
      const desc = info.description ? `: ${info.description.substring(0, 50)}` : '';
      console.log(chalk.gray(`   - ${name} (${info.type})${desc}`));
    }
    if (agent.toolRegistry.size > 5) {
      console.log(chalk.gray(`   ... 还有 ${agent.toolRegistry.size - 5} 个工具`));
    }

    const maxIterations = options.maxIterations || 5;
    let iteration = 0;
    let lastResult = null;
    let done = false;
    rl = process.stdin.isTTY
      ? readline.createInterface({ input, output })
      : null;

    let prompt = {
      content: query
    };

    while (iteration < maxIterations && !done) {
      iteration++;
      console.log(chalk.cyan(`\n--- 第 ${iteration}/${maxIterations} 轮 ---`));
      
      const result = await agent.executeTask({
        type: 'llm_with_tools',
        prompt,
        tools: [], // 为空表示所有工具可用
        autoExecuteTools: true
      });

      // console.log("agent-cli-simple result--");
      // console.dir(result, { depth: 10, colors: true });

      // LLM响应现在是流式输出，已经在执行过程中显示了
      let llmMessage = '';
      if (result.data) {
        llmMessage = result.data.choices?.[0]?.message?.content || '';

        // console.log("result.data.toolCalls--", result?.data?.toolCalls);

        // 检查是否任务完成 - 如果没有工具调用或明确表示完成，则结束
        if (/任务完成|已完成|总结完成|分析完毕/.test(llmMessage)) {
          done = true;
        }
      }

      // 展示工具调用和结果
      let toolResultsSummary = '';
      if (result.data?.toolCalls?.length) {
        const toolSummaries = [];
        for (const [i, call] of result.data.toolCalls.entries()) {
          console.log(chalk.yellow(`\n🔧 工具调用 #${i + 1}: ${call.name}`));
          console.log('参数:', JSON.stringify(call.args, null, 2));
          const toolResult = result.data.toolResults?.[i];
          const summaryLines = [];
          if (toolResult?.success) {
            console.log(chalk.green('✅ 工具执行成功'));
            summaryLines.push(`工具 ${call.name} 执行成功`);
          } else {
            console.log(chalk.red('❌ 工具执行失败'), toolResult?.error);
            summaryLines.push(`工具 ${call.name} 执行失败: ${toolResult?.error || '未知错误'}`);
          }
          if (toolResult?.data) {
            console.log('结果:', JSON.stringify(toolResult.data, null, 2).slice(0, 1000) + '...');
          }

          const formattedResult = summarizeToolResultForPrompt(call.name, toolResult);
          if (formattedResult) {
            summaryLines.push(`结果摘录: ${formattedResult}`);
          }

          toolSummaries.push(summaryLines.join('\n'));
        }
        toolResultsSummary = toolSummaries.join('\n\n');
      } else {
        // 没有工具调用，直接完成
        // done = true;
      }

      lastResult = result;
      
      // 构建下一轮 prompt，包含用户原始意图、LLM回复、工具执行结果以及用户新增指令
      if (!done && iteration < maxIterations) {
        let userAppendix = '';
        if (rl) {
          const answer = await rl.question(
            chalk.magenta('\n💬 请输入额外指令（回车跳过）：')
          );
          userAppendix = answer.trim();
          if (userAppendix) {
            console.log(chalk.magenta(`➡️  已记录额外指令: ${userAppendix}`));
          }
        }

        prompt = {
          content: `原始用户请求: ${query}

之前的分析: ${llmMessage}

工具执行结果: ${toolResultsSummary || '无工具输出'}

${userAppendix ? `用户额外指令: ${userAppendix}\n\n` : ''}请根据以上信息继续分析或总结回答用户的原始问题。如果已经获得足够信息，请给出最终答案。如果不需要使用任何工具，请直接回答用户问题。`
        };
      }
    }

    if (done) {
      console.log(chalk.green.bold('\n✅ 任务完成!'));
    } else {
      console.log(chalk.yellow(`\n⚠️ 达到最大迭代次数 (${maxIterations})，任务可能未完全完成`));
    }

    if (rl) {
      rl.close();
    }

    await agent.cleanup();
    console.log(chalk.gray('🧹 Agent 资源已清理'));
  } catch (error) {
    console.error(chalk.red('❌ 执行失败:'), error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
  } finally {
    if (rl) {
      rl.close();
    }
  }
}

// 错误处理
process.on('uncaughtException', (error) => {
  console.error(chalk.red('🚨 未捕获异常:'), error.message);
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

// 解析命令行参数
program.parse();
