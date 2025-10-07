#!/usr/bin/env node
/**
 * 测试 Chrome DevTools MCP 配置
 */

import { AgentCore } from './src/index.js';
import { loadConfig, extractMcpServers } from './src/utils/config-loader.js';

async function testChromeDevToolsMCP() {
  console.log('🔧 测试 Chrome DevTools MCP 配置...\n');

  // 1. 加载配置
  console.log('📖 加载配置文件...');
  const { config } = loadConfig();
  console.log('✅ 配置加载成功\n');

  // 2. 提取 MCP 服务器
  console.log('🔍 提取 MCP 服务器配置...');
  const mcpServers = extractMcpServers(config);
  console.log(`✅ 发现 ${mcpServers.length} 个 MCP 服务器:\n`);
  
  mcpServers.forEach(server => {
    console.log(`   📌 ${server.name}`);
    console.log(`      命令: ${server.command} ${server.args.join(' ')}`);
    console.log(`      传输: ${server.transport}\n`);
  });

  // 3. 创建 Agent 并初始化 MCP 系统
  console.log('🚀 初始化 Agent 和 MCP 系统...');
  const agent = new AgentCore({
    mcp: {
      servers: mcpServers,
      manager: {},
      toolSystem: {}
    }
  });

  try {
    await agent.initialize();
    console.log('✅ Agent 初始化成功\n');

    // 4. 检查 MCP 系统状态
    if (agent.mcpSystem) {
      console.log('🔗 MCP 系统已启动');
      const status = agent.mcpSystem.getStatus();
      console.log(`   - 总连接数: ${status.totalConnections}`);
      console.log(`   - 就绪连接: ${status.readyConnections}`);
      console.log(`   - 可用工具: ${status.tools.totalTools}\n`);

      // 5. 列出可用工具
      if (status.readyConnections > 0) {
        console.log('🛠️  可用的 Chrome DevTools 工具:');
        const tools = agent.mcpSystem.getTools();
        tools.slice(0, 10).forEach(tool => {
          console.log(`   - ${tool.name}: ${tool.description || '(无描述)'}`);
        });
        if (tools.length > 10) {
          console.log(`   ... 还有 ${tools.length - 10} 个工具\n`);
        }
      }

      // 清理
      console.log('\n🧹 清理资源...');
      await agent.mcpSystem.shutdown();
      console.log('✅ 测试完成！\n');
      console.log('💡 你现在可以使用以下命令来运行 Agent:');
      console.log('   node bin/agent-cli.js interactive --enable-mcp');
    } else {
      console.log('⚠️  MCP 系统未初始化');
    }
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    console.error('\n💡 提示:');
    console.error('   1. 确保已安装 Node.js >= 20');
    console.error('   2. 确保已安装 Chrome 浏览器');
    console.error('   3. 检查配置文件: ~/.agent-core/config.toml');
    process.exit(1);
  }
}

testChromeDevToolsMCP().catch(console.error);
