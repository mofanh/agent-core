/**
 * Agent-Core 交互式终端用户界面
 * 
 * 参考 codex-rs/tui 设计，提供交互式的命令行界面
 * 支持循环对话、思考过程显示和工具调用
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { EventEmitter } from 'events';

export class AgentTUI extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      maxHistoryItems: 50,
      showThinking: true,
      autoScroll: true,
      theme: 'default',
      ...config
    };
    
    this.history = [];
    this.currentSession = null;
    this.isRunning = false;
  }

  /**
   * 启动 TUI 界面
   */
  async start(agent) {
    this.agent = agent;
    this.isRunning = true;
    
    // 显示欢迎信息
    this.showWelcome();
    
    // 主循环
    while (this.isRunning) {
      try {
        await this.runInteraction();
      } catch (error) {
        if (error.name === 'ExitPromptError') {
          break;
        }
        this.showError(error);
      }
    }
    
    this.showGoodbye();
  }

  /**
   * 停止 TUI
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * 显示欢迎信息
   */
  showWelcome() {
    console.clear();
    console.log(chalk.blue.bold('🤖 Agent-Core 交互式终端'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.green('欢迎使用 Agent-Core 智能助手'));
    console.log(chalk.gray('输入 /help 查看帮助，/exit 退出程序'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log();
  }

  /**
   * 显示再见信息
   */
  showGoodbye() {
    console.log();
    console.log(chalk.yellow('👋 感谢使用 Agent-Core，再见！'));
  }

  /**
   * 运行单次交互
   */
  async runInteraction() {
    // 获取用户输入
    const input = await this.getUserInput();
    
    // 检查特殊命令
    if (input.startsWith('/')) {
      return await this.handleCommand(input);
    }
    
    // 处理普通查询
    return await this.processQuery(input);
  }

  /**
   * 获取用户输入
   */
  async getUserInput() {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: chalk.cyan('👤 您:'),
        validate: (value) => {
          if (!value.trim()) {
            return '请输入您的问题或命令';
          }
          return true;
        }
      }
    ]);
    
    return input.trim();
  }

  /**
   * 处理特殊命令
   */
  async handleCommand(command) {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    switch (cmd.toLowerCase()) {
      case 'help':
        this.showHelp();
        break;
        
      case 'exit':
      case 'quit':
        this.stop();
        break;
        
      case 'clear':
        console.clear();
        this.showWelcome();
        break;
        
      case 'history':
        this.showHistory();
        break;
        
      case 'config':
        await this.showConfig();
        break;
        
      case 'tools':
        await this.showAvailableTools();
        break;
        
      case 'debug':
        await this.runDebugMode(args[0]);
        break;
        
      default:
        console.log(chalk.red(`❌ 未知命令: ${cmd}`));
        console.log(chalk.gray('输入 /help 查看可用命令'));
    }
  }

  /**
   * 处理查询
   */
  async processQuery(query) {
    const sessionId = Date.now();
    this.currentSession = {
      id: sessionId,
      query,
      startTime: new Date(),
      iterations: [],
      status: 'processing'
    };

    const spinner = ora({
      text: '🤔 Agent 正在思考...',
      spinner: 'dots'
    }).start();

    try {
      // 执行思考循环
      const result = await this.executeThinkingLoop(query, spinner);
      
      // 更新会话状态
      this.currentSession.status = result.success ? 'completed' : 'failed';
      this.currentSession.endTime = new Date();
      this.currentSession.result = result;
      
      // 添加到历史记录
      this.addToHistory(this.currentSession);
      
      // 显示结果
      this.showResult(result);
      
      spinner.stop();
      
    } catch (error) {
      spinner.fail('❌ 处理失败');
      this.showError(error);
      
      this.currentSession.status = 'error';
      this.currentSession.error = error.message;
      this.addToHistory(this.currentSession);
    }
  }

  /**
   * 执行思考循环
   */
  async executeThinkingLoop(query, spinner) {
    const maxIterations = this.config.maxIterations || 10;
    let iteration = 0;
    let currentQuery = query;
    let context = [];

    while (iteration < maxIterations) {
      iteration++;
      
      if (this.config.showThinking) {
        spinner.text = `🤔 第 ${iteration}/${maxIterations} 轮思考...`;
      }

      try {
        // 构建提示
        const prompt = this.buildPrompt(currentQuery, context, iteration, maxIterations);
        
        // 调用 LLM
        const response = await this.agent.llm.request({
          messages: [{ role: 'user', content: prompt }],
          stream: false
        });

        const content = response.choices[0]?.message?.content || '';
        
        // 解析响应
        const analysis = this.parseAgentResponse(content);
        
        // 记录迭代
        const iterationData = {
          number: iteration,
          query: currentQuery,
          response: content,
          analysis,
          timestamp: new Date()
        };
        
        context.push(iterationData);
        this.currentSession.iterations.push(iterationData);

        // 显示思考过程
        if (this.config.showThinking) {
          this.showThinkingStep(iterationData);
        }

        // 执行工具调用
        if (analysis.needsTools && analysis.tools.length > 0) {
          spinner.text = '🔧 执行工具调用...';
          
          for (const tool of analysis.tools) {
            const toolResult = await this.executeToolCall(tool);
            iterationData.toolResults = iterationData.toolResults || [];
            iterationData.toolResults.push({
              tool: tool.name,
              args: tool.args,
              result: toolResult,
              timestamp: new Date()
            });
            
            if (this.config.showThinking) {
              this.showToolResult(tool, toolResult);
            }
          }
          
          // 更新查询以包含工具结果
          currentQuery = `基于工具执行结果，继续处理: ${query}`;
        }

        // 检查是否完成
        if (analysis.isComplete) {
          return {
            success: true,
            result: content,
            iterations: iteration,
            context
          };
        }

      } catch (error) {
        return {
          success: false,
          error: error.message,
          iterations: iteration,
          context
        };
      }
    }

    return {
      success: false,
      reason: 'MAX_ITERATIONS_REACHED',
      iterations: maxIterations,
      context
    };
  }

  /**
   * 构建提示
   */
  buildPrompt(query, context, iteration, maxIterations) {
    let prompt = `你是一个智能助手。请分析用户的问题并提供帮助。

当前任务: ${query}

`;

    if (context.length > 0) {
      prompt += '历史上下文:\n';
      context.forEach((ctx, idx) => {
        prompt += `第${ctx.number}轮: ${ctx.response.substring(0, 200)}...\n`;
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
   * 解析 Agent 响应
   */
  parseAgentResponse(content) {
    const analysis = {
      needsTools: false,
      tools: [],
      isComplete: false,
      reasoning: content
    };

    const lines = content.split('\n');
    
    for (const line of lines) {
      // 检查浏览器工具需求
      if (line.includes('需要浏览') || line.includes('访问网页')) {
        analysis.needsTools = true;
        const urlMatch = line.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          analysis.tools.push({
            name: 'browser_navigate',
            args: { url: urlMatch[0] }
          });
        }
      }

      // 检查其他工具需求
      if (line.includes('需要搜索') || line.includes('搜索文件')) {
        analysis.needsTools = true;
        analysis.tools.push({
          name: 'file_search',
          args: { query: line }
        });
      }

      // 检查完成状态
      if (line.includes('任务完成') || line.includes('回答完毕') || line.includes('COMPLETE')) {
        analysis.isComplete = true;
      }
    }

    // 默认完成逻辑
    if (!analysis.needsTools && !analysis.isComplete) {
      analysis.isComplete = true;
    }

    return analysis;
  }

  /**
   * 执行工具调用
   */
  async executeToolCall(tool) {
    try {
      if (tool.name.startsWith('browser_')) {
        if (this.agent.browserClient) {
          return await this.agent.browserClient.callTool(tool.name, tool.args);
        } else {
          throw new Error('浏览器工具未启用');
        }
      } else if (this.agent.mcpManager) {
        return await this.agent.mcpManager.callTool(tool.name, tool.args);
      } else {
        throw new Error(`未知工具: ${tool.name}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 显示思考步骤
   */
  showThinkingStep(iteration) {
    console.log(chalk.blue(`\n🤔 第 ${iteration.number} 轮思考:`));
    console.log(chalk.gray('─'.repeat(30)));
    console.log(iteration.response);
  }

  /**
   * 显示工具执行结果
   */
  showToolResult(tool, result) {
    console.log(chalk.yellow(`\n🔧 工具 ${tool.name} 执行结果:`));
    console.log(chalk.gray('─'.repeat(30)));
    if (result.success !== false) {
      console.log(chalk.green('✅ 执行成功'));
      if (result.content) {
        console.log(result.content.substring(0, 200) + '...');
      }
    } else {
      console.log(chalk.red('❌ 执行失败:'), result.error);
    }
  }

  /**
   * 显示最终结果
   */
  showResult(result) {
    console.log(chalk.green('\n🎯 最终回答:'));
    console.log(chalk.gray('─'.repeat(30)));
    console.log(result.result);
    
    console.log(chalk.gray(`\n📊 统计信息:`));
    console.log(chalk.gray(`   思考轮数: ${result.iterations}`));
    console.log(chalk.gray(`   状态: ${result.success ? '成功' : '失败'}`));
    
    if (result.context && result.context.length > 0) {
      const toolCalls = result.context.reduce((acc, ctx) => {
        return acc + (ctx.toolResults ? ctx.toolResults.length : 0);
      }, 0);
      console.log(chalk.gray(`   工具调用: ${toolCalls} 次`));
    }
    
    console.log();
  }

  /**
   * 显示错误
   */
  showError(error) {
    console.log(chalk.red('\n❌ 发生错误:'));
    console.log(chalk.red(error.message));
    if (this.config.debug && error.stack) {
      console.log(chalk.gray(error.stack));
    }
    console.log();
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(chalk.blue('\n📖 Agent-Core 命令帮助:'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(chalk.yellow('/help') + chalk.gray('     - 显示此帮助信息'));
    console.log(chalk.yellow('/exit') + chalk.gray('     - 退出程序'));
    console.log(chalk.yellow('/clear') + chalk.gray('    - 清屏'));
    console.log(chalk.yellow('/history') + chalk.gray('  - 显示对话历史'));
    console.log(chalk.yellow('/config') + chalk.gray('   - 显示配置信息'));
    console.log(chalk.yellow('/tools') + chalk.gray('    - 显示可用工具'));
    console.log(chalk.yellow('/debug') + chalk.gray('    - 进入调试模式'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(chalk.gray('直接输入问题开始对话'));
    console.log();
  }

  /**
   * 显示历史记录
   */
  showHistory() {
    if (this.history.length === 0) {
      console.log(chalk.gray('\n📋 暂无对话历史'));
      return;
    }

    console.log(chalk.blue('\n📋 对话历史:'));
    console.log(chalk.gray('─'.repeat(40)));
    
    this.history.slice(-10).forEach((session, idx) => {
      const duration = session.endTime ? 
        Math.round((session.endTime - session.startTime) / 1000) : 
        '进行中';
      
      console.log(chalk.cyan(`${idx + 1}. ${session.query.substring(0, 50)}...`));
      console.log(chalk.gray(`   状态: ${session.status} | 耗时: ${duration}s | 迭代: ${session.iterations.length}`));
    });
    console.log();
  }

  /**
   * 显示配置
   */
  async showConfig() {
    console.log(chalk.blue('\n⚙️ 当前配置:'));
    console.log(chalk.gray('─'.repeat(30)));
    console.log(chalk.yellow('最大迭代次数:'), this.config.maxIterations || 10);
    console.log(chalk.yellow('显示思考过程:'), this.config.showThinking ? '是' : '否');
    console.log(chalk.yellow('主题:'), this.config.theme);
    
    if (this.agent) {
      console.log(chalk.yellow('LLM 提供商:'), this.agent.config.llm?.provider || '未配置');
      console.log(chalk.yellow('浏览器工具:'), this.agent.browserClient ? '已启用' : '未启用');
      console.log(chalk.yellow('MCP 管理器:'), this.agent.mcpManager ? '已启用' : '未启用');
    }
    console.log();
  }

  /**
   * 显示可用工具
   */
  async showAvailableTools() {
    console.log(chalk.blue('\n🔧 可用工具:'));
    console.log(chalk.gray('─'.repeat(30)));
    
    try {
      if (this.agent?.browserClient) {
        const tools = await this.agent.browserClient.listTools();
        console.log(chalk.green('浏览器工具:'));
        tools.forEach(tool => {
          console.log(chalk.cyan(`  • ${tool.name}`), chalk.gray(`- ${tool.description}`));
        });
      }
      
      if (this.agent?.mcpManager) {
        console.log(chalk.green('MCP 工具:'));
        // TODO: 实现 MCP 工具列表
        console.log(chalk.gray('  暂无连接的 MCP 服务'));
      }
      
      if (!this.agent?.browserClient && !this.agent?.mcpManager) {
        console.log(chalk.gray('未启用任何工具'));
      }
    } catch (error) {
      console.log(chalk.red('获取工具列表失败:'), error.message);
    }
    console.log();
  }

  /**
   * 运行调试模式
   */
  async runDebugMode(target) {
    console.log(chalk.blue(`\n🐛 调试模式: ${target || '通用'}`));
    console.log(chalk.gray('─'.repeat(30)));
    
    switch (target) {
      case 'llm':
        await this.debugLLM();
        break;
      case 'mcp':
        await this.debugMCP();
        break;
      case 'browser':
        await this.debugBrowser();
        break;
      default:
        console.log(chalk.yellow('可用调试目标: llm, mcp, browser'));
    }
    console.log();
  }

  /**
   * 调试 LLM
   */
  async debugLLM() {
    const spinner = ora('测试 LLM 连接...').start();
    try {
      const response = await this.agent.llm.request({
        messages: [{ role: 'user', content: '这是一个连接测试，请回复"连接正常"' }]
      });
      spinner.succeed('LLM 连接正常');
      console.log(chalk.green('响应:'), response.choices[0]?.message?.content);
    } catch (error) {
      spinner.fail('LLM 连接失败');
      console.log(chalk.red('错误:'), error.message);
    }
  }

  /**
   * 调试 MCP
   */
  async debugMCP() {
    if (!this.agent.mcpManager) {
      console.log(chalk.yellow('MCP 管理器未启用'));
      return;
    }
    
    console.log(chalk.gray('MCP 调试功能待实现'));
  }

  /**
   * 调试浏览器
   */
  async debugBrowser() {
    if (!this.agent.browserClient) {
      console.log(chalk.yellow('浏览器工具未启用'));
      return;
    }
    
    const spinner = ora('测试浏览器工具...').start();
    try {
      const result = await this.agent.browserClient.callTool('browser_navigate', {
        url: 'https://example.com'
      });
      spinner.succeed('浏览器工具正常');
      console.log(chalk.green('测试结果:'), result.success ? '成功' : '失败');
    } catch (error) {
      spinner.fail('浏览器工具测试失败');
      console.log(chalk.red('错误:'), error.message);
    }
  }

  /**
   * 添加到历史记录
   */
  addToHistory(session) {
    this.history.push(session);
    
    // 限制历史记录数量
    if (this.history.length > this.config.maxHistoryItems) {
      this.history.shift();
    }
  }
}

export default AgentTUI;
