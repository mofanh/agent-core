#!/usr/bin/env node

/**
 * 简化版 Agent-CLI 网页访问测试
 * 
 * 直接使用浏览器工具系统，不通过 MCP，测试完整的网页访问和总结流程
 */

import { AgentCore, createSparkLLM } from './src/index.js';
import { BrowserToolManager } from './src/browser/tool-manager.js';
import chalk from 'chalk';

console.log(chalk.blue.bold('🧪 简化版 Agent-CLI 网页访问测试'));

async function testSimplifiedAgentCLI() {
  let browserToolManager;
  let sparkLLM;
  
  try {
    // 初始化星火 LLM
    console.log(chalk.yellow('🤖 初始化星火 LLM...'));
    sparkLLM = createSparkLLM({
      apiKey: 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau'
    });
    console.log(chalk.green('✅ 星火 LLM 初始化成功'));
    
    // 初始化浏览器工具管理器
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
    
    const targetUrl = 'https://course.rs/basic/collections/intro.html';
    
    // 步骤 1: 使用 LLM 分析任务
    console.log(chalk.cyan('\n🧠 步骤1: LLM 分析任务'));
    const taskAnalysis = await sparkLLM.request({
      model: '4.0Ultra',
      messages: [{
        role: 'user',
        content: `请分析以下任务：访问 ${targetUrl} 网页，并总结页面的主要内容。
        
请简要说明需要执行哪些步骤。`
      }],
      max_tokens: 200
    });
    
    console.log('任务分析:', taskAnalysis.choices[0]?.message?.content);
    
    // 步骤 2: 导航到目标页面
    console.log(chalk.cyan('\n🌐 步骤2: 导航到目标页面'));
    const navigateResponse = await browserToolManager.executeLocalTool('navigate', {
      url: targetUrl,
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    console.log('完整导航响应:', JSON.stringify(navigateResponse, null, 2));
    
    const navigateResult = navigateResponse.data.data; // 双层嵌套
    console.log('导航结果:');
    console.log(`- URL: ${navigateResult?.finalUrl}`);
    console.log(`- 状态码: ${navigateResult?.statusCode}`);
    console.log(`- 标题: ${navigateResult?.title}`);
    
    // 步骤 3: 提取页面内容
    console.log(chalk.cyan('\n📄 步骤3: 提取页面内容'));
    const extractResponse = await browserToolManager.executeLocalTool('extract', {
      selectors: {
        title: 'title',
        mainHeading: 'h1',
        content: 'main, article, .content',
        paragraphs: 'p'
      },
      extractType: 'text',
      multiple: false,
      timeout: 10000
    });
    
    console.log('完整提取响应:', JSON.stringify(extractResponse, null, 2));
    
    const extractResult = extractResponse.data.data || extractResponse.data; // 尝试双层或单层
    const results = extractResult.results || extractResult;
    
    console.log('提取结果:');
    console.log(`- 标题: ${results.title?.elements?.[0]?.text || '未找到'}`);
    console.log(`- 主标题: ${results.mainHeading?.elements?.[0]?.text || '未找到'}`);
    console.log(`- 内容长度: ${results.content?.elements?.[0]?.text?.length || 0} 字符`);
    console.log(`- 段落数量: ${results.paragraphs?.elements?.length || 0}`);
    
    // 显示内容预览
    if (results.content?.elements?.[0]?.text) {
      console.log(chalk.green('\n📖 内容预览:'));
      console.log(results.content.elements[0].text.substring(0, 300) + (results.content.elements[0].text.length > 300 ? '...' : ''));
    }
    
    // 步骤 4: 使用 LLM 总结内容
    console.log(chalk.cyan('\n🧠 步骤4: LLM 总结页面内容'));
    
    const contentToSummarize = `
页面标题: ${results.title?.elements?.[0]?.text || '无标题'}
主标题: ${results.mainHeading?.elements?.[0]?.text || '无主标题'}
页面内容: ${results.content?.elements?.[0]?.text || '无内容'}
`;
    
    const summaryResult = await sparkLLM.request({
      model: '4.0Ultra',
      messages: [{
        role: 'user',
        content: `请总结以下网页内容，重点关注主题、核心概念和主要信息点：

${contentToSummarize}

请提供一个简洁清晰的总结，包括：
1. 页面主题
2. 核心内容
3. 主要知识点`
      }],
      max_tokens: 500
    });
    
    console.log(chalk.green('\n📖 内容总结:'));
    console.log(summaryResult.choices[0]?.message?.content);
    
    console.log(chalk.green.bold('\n✅ 简化版 Agent-CLI 网页访问测试完成!'));
    
    // 生成总结报告
    console.log(chalk.blue('\n📊 测试总结报告:'));
    console.log(`✅ 星火 LLM: 初始化成功`);
    console.log(`✅ 浏览器工具: 初始化成功`);
    console.log(`✅ 页面导航: ${navigateResult?.statusCode === 200 ? '成功' : '失败'}`);
    console.log(`✅ 内容提取: ${results?.content?.elements?.[0]?.text ? '成功' : '失败'} (${results?.content?.elements?.[0]?.text?.length || 0} 字符)`);
    console.log(`✅ 内容总结: ${summaryResult.choices[0]?.message?.content ? '成功' : '失败'}`);
    
  } catch (error) {
    console.error(chalk.red('❌ 测试失败:'), error.message);
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
        console.error(chalk.yellow('⚠️  清理浏览器工具时出错:'), cleanupError.message);
      }
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

// 启动测试
testSimplifiedAgentCLI();
