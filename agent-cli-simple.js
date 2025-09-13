#!/usr/bin/env node

/**
 * 简化版 Agent-CLI
 * 基于 test-simplified-agent-cli.js 的成功经验重新实现
 */

import { AgentCore, createSparkLLM } from './src/index.js';
import { BrowserToolManager } from './src/browser/tool-manager.js';
import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

program
  .name('agent-cli-simple')
  .description('简化版 Agent-CLI 智能代理命令行工具')
  .version('1.0.0');

program
  .command('exec <query>')
  .description('执行查询并访问网页')
  .option('--provider <provider>', 'LLM 提供商', 'spark')
  .option('--enable-browser', '启用浏览器工具')
  .option('--max-iterations <number>', '最大迭代次数', parseInt, 3)
  .action(async (query, options) => {
    await runSimpleExecMode(query, options);
  });

async function runSimpleExecMode(query, options) {
  let browserToolManager;
  let sparkLLM;
  
  try {
    console.log(chalk.blue.bold('🚀 启动简化版 Agent-CLI'));
    
    // 初始化星火 LLM
    console.log(chalk.yellow('🤖 初始化星火 LLM...'));
    sparkLLM = createSparkLLM({
      apiKey: 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau'
    });
    console.log(chalk.green('✅ 星火 LLM 初始化成功'));
    
    // 初始化浏览器工具（如果启用）
    if (options.enableBrowser) {
      console.log(chalk.yellow('🌐 初始化浏览器工具系统...'));
      browserToolManager = new BrowserToolManager({
        headless: true,
        defaultTimeout: 30000,
        security: {
          level: 'normal',
          allowedDomains: ['*'],
          allowedProtocols: ['https:', 'http:']
        }
      });
      
      await browserToolManager.initialize();
      console.log(chalk.green('✅ 浏览器工具系统初始化成功'));
    }
    
    console.log(chalk.cyan(`\n🧠 开始处理任务: ${query}`));
    
    // 智能任务执行循环
    let currentQuery = query;
    let iteration = 0;
    const maxIterations = options.maxIterations || 3;
    
    while (iteration < maxIterations) {
      iteration++;
      console.log(chalk.cyan(`\n--- 第 ${iteration}/${maxIterations} 轮思考 ---`));
      
      // 分析任务并获取LLM响应
      const analysisResult = await analyzeTask(sparkLLM, currentQuery, browserToolManager, iteration, maxIterations);
      
      console.log(chalk.green('🤖 LLM 分析:'));
      console.log(analysisResult.content);
      
      // 检查是否需要使用浏览器工具
      const needsBrowser = await checkIfNeedsBrowserTools(analysisResult.content);
      
      if (needsBrowser.needsNavigation && browserToolManager) {
        console.log(chalk.cyan('\n🌐 执行网页导航...'));
        const url = extractUrlFromContent(analysisResult.content) || extractUrlFromQuery(query);
        
        if (url) {
          const navigateResponse = await browserToolManager.executeLocalTool('navigate', {
            url: url,
            waitUntil: 'domcontentloaded',
            timeout: 15000
          });
          
          const navigateResult = navigateResponse.data.data;
          console.log(`✅ 导航成功: ${navigateResult.title} (${navigateResult.statusCode})`);
          
          // 如果导航成功，继续提取内容
          if (navigateResult.statusCode === 200) {
            console.log(chalk.cyan('\n📄 提取页面内容...'));
            const extractResponse = await browserToolManager.executeLocalTool('extract', {
              selectors: {
                title: 'title',
                mainHeading: 'h1, h2',
                content: 'main, article, .content, body',
                paragraphs: 'p'
              },
              extractType: 'text',
              multiple: false,
              timeout: 10000
            });
            console.log('完整提取响应:', JSON.stringify(extractResponse, null, 2));

            const extractResult = extractResponse.data.data;
            const results = extractResult.results || extractResult;
            
            const pageContent = {
              title: results.title?.elements?.[0]?.text || '无标题',
              mainHeading: results.mainHeading?.elements?.[0]?.text || '无主标题',
              content: results.content?.elements?.[0]?.text || '无内容',
              paragraphs: results.paragraphs?.elements?.length || 0
            };
            
            console.log(`✅ 内容提取成功: ${pageContent.content.length} 字符`);
            
            // 使用提取的内容进行最终总结
            console.log(chalk.cyan('\n🧠 生成内容总结...'));
            const summaryResult = await generateSummary(sparkLLM, pageContent, query);
            
            console.log(chalk.green.bold('\n📖 最终总结:'));
            console.log(summaryResult.choices[0]?.message?.content);
            
            console.log(chalk.green.bold('\n✅ 任务完成!'));
            return;
          }
        }
      }
      
      // 检查是否任务已完成
      if (isTaskComplete(analysisResult.content)) {
        console.log(chalk.green.bold('\n✅ 任务完成!'));
        return;
      }
      
      // 更新查询内容供下一轮迭代
      currentQuery = `基于前面的分析，继续处理原始任务: ${query}`;
    }
    
    console.log(chalk.yellow(`⚠️  达到最大迭代次数 (${maxIterations})，任务可能未完全完成`));
    
  } catch (error) {
    console.error(chalk.red('❌ 执行失败:'), error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
  } finally {
    // 清理资源
    if (browserToolManager) {
      try {
        await browserToolManager.cleanup();
        console.log(chalk.gray('🧹 浏览器工具系统已清理'));
      } catch (cleanupError) {
        console.error(chalk.yellow('⚠️  清理时出错:'), cleanupError.message);
      }
    }
  }
}

async function analyzeTask(llm, query, hasBrowserTools, iteration, maxIterations) {
  const toolsInfo = hasBrowserTools ? `

可用工具:
🌐 浏览器工具: 可以访问网页、提取内容、进行网页操作
使用格式：
- 访问网页: 在回答中明确提到需要访问的具体网址
- 提取内容: 说明需要提取网页内容进行分析` : '';

  const prompt = `你是一个智能助手。请分析用户的问题并提供帮助。

当前任务: ${query}
${toolsInfo}

当前是第 ${iteration}/${maxIterations} 轮分析。

请按照以下要求回答:
1. 分析用户的具体需求
2. 如果需要访问网页，明确说明需要访问哪个网址
3. 提供当前能给出的分析或答案
4. 如果任务需要多步骤，说明下一步计划
5. 如果任务已经完成，明确指出"任务完成"

注意：如果用户要求访问网页并总结，请务必明确指出需要访问的URL。`;

  const response = await llm.request({
    model: '4.0Ultra',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800
  });

  return response.choices[0]?.message || {};
}

async function checkIfNeedsBrowserTools(content) {
  const needsNavigation = content.includes('访问') && (content.includes('http') || content.includes('网页') || content.includes('网站'));
  const needsExtraction = content.includes('提取') || content.includes('总结');
  
  return {
    needsNavigation,
    needsExtraction
  };
}

function extractUrlFromContent(content) {
  const urlMatch = content.match(/https?:\/\/[^\s\u4e00-\u9fff\]）)}>]+/);
  return urlMatch ? urlMatch[0] : null;
}

function extractUrlFromQuery(query) {
  const urlMatch = query.match(/https?:\/\/[^\s\u4e00-\u9fff\]）)}>]+/);
  return urlMatch ? urlMatch[0] : null;
}

function isTaskComplete(content) {
  return content.includes('任务完成') || 
         content.includes('总结完成') || 
         content.includes('分析完毕') ||
         content.includes('已完成');
}

async function generateSummary(llm, pageContent, originalQuery) {
  const prompt = `基于以下网页内容，请生成一个简洁清晰的总结，回答用户的原始问题：

原始问题: ${originalQuery}

网页内容:
标题: ${pageContent.title}
主标题: ${pageContent.mainHeading}
正文内容: ${pageContent.content.substring(0, 1500)}...

请提供结构化的总结，包括：
1. 页面主题和核心内容
2. 主要知识点或信息
3. 与用户问题相关的要点`;

  return await llm.request({
    model: '4.0Ultra',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600
  });
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
