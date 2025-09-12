#!/usr/bin/env node

/**
 * 测试 agent-cli 的浏览器工具集成
 * 
 * 基于成功的抓取案例，直接测试浏览器工具调用
 */

import { MCPBrowserClient } from './src/mcp/browser-client.js';
import { startMCPBrowserServer } from './src/mcp/browser-server.js';
import chalk from 'chalk';

console.log(chalk.blue.bold('🧪 Agent-CLI 浏览器工具集成测试'));

async function testAgentCLIBrowserIntegration() {
  let client;
  
  try {
    console.log(chalk.yellow('🔧 启动 MCP 浏览器服务器...'));
    await startMCPBrowserServer();
    
    console.log(chalk.yellow('🔗 连接到 MCP 浏览器客户端...'));
    client = new MCPBrowserClient();
    await client.connect();
    
    console.log(chalk.green('✅ MCP 浏览器客户端连接成功'));
    
    // 测试 1: 获取可用工具
    console.log(chalk.cyan('\n📋 步骤1: 获取可用工具'));
    const tools = await client.listTools();
    console.log('可用工具:', tools.map(t => t.name).join(', '));
    
    // 测试 2: 导航到目标页面
    console.log(chalk.cyan('\n🌐 步骤2: 导航到 course.rs 页面'));
    const navigateResult = await client.callTool('browser_navigate', {
      url: 'https://course.rs/basic/collections/intro.html',
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    console.log('导航结果:');
    console.log(`- URL: ${navigateResult.finalUrl}`);
    console.log(`- 状态码: ${navigateResult.statusCode}`);
    console.log(`- 标题: ${navigateResult.title}`);
    
    // 测试 3: 提取页面内容
    console.log(chalk.cyan('\n📄 步骤3: 提取页面内容'));
    const extractResult = await client.callTool('browser_extract', {
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
    
    console.log('提取结果:');
    console.log(`- 标题: ${extractResult.title || '未找到'}`);
    console.log(`- 主标题: ${extractResult.mainHeading || '未找到'}`);
    console.log(`- 内容长度: ${extractResult.content ? extractResult.content.length : 0} 字符`);
    console.log(`- 段落数量: ${extractResult.paragraphs ? (Array.isArray(extractResult.paragraphs) ? extractResult.paragraphs.length : 1) : 0}`);
    
    // 显示内容预览
    if (extractResult.content) {
      console.log(chalk.green('\n📖 内容预览:'));
      console.log(extractResult.content.substring(0, 300) + (extractResult.content.length > 300 ? '...' : ''));
    }
    
    // 测试 4: 获取当前 URL
    console.log(chalk.cyan('\n🔗 步骤4: 获取当前 URL'));
    const urlResult = await client.callTool('browser_get_url');
    console.log('当前URL:', urlResult.url);
    
    console.log(chalk.green.bold('\n✅ Agent-CLI 浏览器工具集成测试完成!'));
    
    // 生成总结报告
    console.log(chalk.blue('\n📊 测试总结报告:'));
    console.log(`✅ MCP 浏览器服务器: 启动成功`);
    console.log(`✅ 浏览器客户端连接: 连接成功`);
    console.log(`✅ 工具列表获取: ${tools.length} 个工具`);
    console.log(`✅ 页面导航: ${navigateResult.statusCode === 200 ? '成功' : '失败'}`);
    console.log(`✅ 内容提取: ${extractResult.content ? '成功' : '失败'}`);
    console.log(`✅ URL 获取: ${urlResult.url ? '成功' : '失败'}`);
    
  } catch (error) {
    console.error(chalk.red('❌ 测试失败:'), error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
  } finally {
    // 清理资源
    if (client) {
      try {
        await client.disconnect();
        console.log(chalk.gray('🧹 MCP 客户端连接已断开'));
      } catch (cleanupError) {
        console.error(chalk.yellow('⚠️  清理连接时出错:'), cleanupError.message);
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
testAgentCLIBrowserIntegration();
