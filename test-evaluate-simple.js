import { createLLMAgent } from './src/llm/index.js';
import { loadConfig, extractMcpServers } from './src/utils/config-loader.js';

async function test() {
  const { config } = loadConfig();
  const mcpServers = extractMcpServers(config);
  
  const agent = createLLMAgent({
    model: 'spark',
    mcp: { servers: mcpServers }
  });
  
  await agent.initialize();
  await agent.mcpSystem.initialize();
  
  // 先导航到页面
  await agent.mcpSystem.callTool('navigate_page', {
    url: 'https://course.rs/basic/collections/intro.html'
  });
  
  console.log('\n测试不同的 function 参数写法:\n');
  
  // 测试 1: 直接表达式
  console.log('1. 测试: document.title');
  let result = await agent.mcpSystem.callTool('evaluate_script', {
    function: 'document.title'
  });
  console.log('结果:', JSON.stringify(result.data.content[0], null, 2));
  
  // 测试 2: 带括号的表达式
  console.log('\n2. 测试: (document.title)');
  result = await agent.mcpSystem.callTool('evaluate_script', {
    function: '(document.title)'
  });
  console.log('结果:', JSON.stringify(result.data.content[0], null, 2));
  
  // 测试 3: 函数形式
  console.log('\n3. 测试: () => document.title');
  result = await agent.mcpSystem.callTool('evaluate_script', {
    function: '() => document.title'
  });
  console.log('结果:', JSON.stringify(result.data.content[0], null, 2));
  
  // 测试 4: 函数体
  console.log('\n4. 测试: function() { return document.title; }');
  result = await agent.mcpSystem.callTool('evaluate_script', {
    function: 'function() { return document.title; }'
  });
  console.log('结果:', JSON.stringify(result.data.content[0], null, 2));
  
  await agent.cleanup();
}

test().catch(console.error);
