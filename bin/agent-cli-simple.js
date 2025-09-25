#!/usr/bin/env node

/**
 * 简化版 Agent-CLI
 * 基于 test-simplified-agent-cli.js 的成功经验重新实现
 */

import { createLLMAgent } from '../src/llm/index.js';
import chalk from 'chalk';
import { Command } from 'commander';

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
  .option('--headless', '无头浏览器', false)
  .action(async (query, options) => {
    await runAgentAutoMode(query, options);
  });

async function runAgentAutoMode(query, options) {
  try {
    console.log(chalk.blue.bold('🚀 启动全自动 Agent-CLI (LLM 规划+工具调用)'));
    const agent = createLLMAgent({
      browser: {
        enabled: true,
        headless: !!options.headless,
        security: {
          level: 'normal',
          allowedDomains: ['*'],
          allowedProtocols: ['https:', 'http:']
        }
      },
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
    });

    await agent.initialize();
    console.log(chalk.green(`📝 已注册工具: ${agent.toolRegistry.size} 个`));
    for (const [name, info] of agent.toolRegistry) {
      console.log(`   - ${name} (${info.type})`);
    }

    const maxIterations = options.maxIterations || 5;
    let iteration = 0;
    let lastResult = null;
    let done = false;

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

      console.log("agent-cli-simple result--", result);

      // LLM响应现在是流式输出，已经在执行过程中显示了
      let llmMessage = '';
      if (result.data?.llmResponse) {
        llmMessage = result.data.llmResponse.choices?.[0]?.message?.content || '';
        
        // 检查是否任务完成 - 如果没有工具调用或明确表示完成，则结束
        if (/任务完成|已完成|总结完成|分析完毕/.test(llmMessage) || result.data.toolCalls.length === 0) {
          done = true;
        }
      }

      // 展示工具调用和结果
      let toolResultsSummary = '';
      if (result.data?.toolCalls?.length) {
        for (const [i, call] of result.data.toolCalls.entries()) {
          console.log(chalk.yellow(`\n🔧 工具调用 #${i + 1}: ${call.name}`));
          console.log('参数:', JSON.stringify(call.args, null, 2));
          const toolResult = result.data.toolResults?.[i];
          if (toolResult?.success) {
            console.log(chalk.green('✅ 工具执行成功'));
            toolResultsSummary += `工具 ${call.name} 执行成功。`;
          } else {
            console.log(chalk.red('❌ 工具执行失败'), toolResult?.error);
            toolResultsSummary += `工具 ${call.name} 执行失败: ${toolResult?.error}。`;
          }
          if (toolResult?.data) {
            console.log('结果:', JSON.stringify(toolResult.data, null, 2).slice(0, 1000) + '...');
          }
        }
      } else {
        // 没有工具调用，直接完成
        done = true;
      }

      lastResult = result;
      
      // 构建下一轮 prompt，包含用户原始意图、LLM回复和工具执行结果
      if (!done && iteration < maxIterations) {
        prompt = {
          content: `原始用户请求: ${query}

之前的分析: ${llmMessage}

工具执行结果: ${toolResultsSummary}

请根据以上信息继续分析或总结回答用户的原始问题。如果已经获得足够信息，请给出最终答案。如果不需要使用任何工具，请直接回答用户问题。`
        };
      }
    }

    if (done) {
      console.log(chalk.green.bold('\n✅ 任务完成!'));
    } else {
      console.log(chalk.yellow(`\n⚠️ 达到最大迭代次数 (${maxIterations})，任务可能未完全完成`));
    }

    await agent.cleanup();
    console.log(chalk.gray('🧹 Agent 资源已清理'));
  } catch (error) {
    console.error(chalk.red('❌ 执行失败:'), error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
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
