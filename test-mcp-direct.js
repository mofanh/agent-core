import { createMCPSystem } from './src/mcp/index.js';

async function test() {
  // 正确创建 MCP 系统
  const mcpSystem = createMCPSystem({
    servers: {
      'chrome-devtools': {
        command: 'npx',
        args: ['chrome-devtools-mcp@latest']
      }
    }
  });
  
  await mcpSystem.initialize();
  
  console.log('\n=== 测试 Chrome DevTools MCP evaluate_script ===\n');
  
  // 先导航到页面
  console.log('1. 导航到测试页面...');
  await mcpSystem.callTool('navigate_page', {
    url: 'https://example.com'
  });
  
  console.log('\n2. 测试不同的 function 参数格式:\n');
  
  // 测试 1: 直接表达式 (预期失败)
  console.log('测试 A: function = "document.title"');
  try {
    const result = await mcpSystem.callTool('evaluate_script', {
      function: 'document.title'
    });
    console.log('✓ 调用成功');
    const text = result.data.content[0].text;
    if (text.includes('is not a function')) {
      console.log('  ❌ 返回错误:', text);
    } else {
      console.log('  ✅ 返回:', text);
    }
  } catch (e) {
    console.log('✗ 调用失败:', e.message);
  }
  
  // 测试 2: 箭头函数 (预期成功)
  console.log('\n测试 B: function = "() => document.title"');
  try {
    const result = await mcpSystem.callTool('evaluate_script', {
      function: '() => document.title'
    });
    console.log('✓ 调用成功');
    const text = result.data.content[0].text;
    if (text.includes('is not a function')) {
      console.log('  ❌ 返回错误:', text);
    } else {
      console.log('  ✅ 返回:', text);
    }
  } catch (e) {
    console.log('✗ 调用失败:', e.message);
  }
  
  // 测试 3: 传统函数 (预期成功)
  console.log('\n测试 C: function = "function() { return document.title; }"');
  try {
    const result = await mcpSystem.callTool('evaluate_script', {
      function: 'function() { return document.title; }'
    });
    console.log('✓ 调用成功');
    const text = result.data.content[0].text;
    if (text.includes('is not a function')) {
      console.log('  ❌ 返回错误:', text);
    } else {
      console.log('  ✅ 返回:', text);
    }
  } catch (e) {
    console.log('✗ 调用失败:', e.message);
  }
  
  await mcpSystem.cleanup();
}

test().catch(console.error);
