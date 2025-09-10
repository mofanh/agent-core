#!/usr/bin/env node

/**
 * Agent-Core CLI 完整功能测试
 * 
 * 测试所有主要功能，包括与讯飞星火API的真实集成
 */

import chalk from 'chalk';
import { spawn } from 'child_process';

console.log(chalk.blue.bold('🚀 Agent-Core CLI 完整功能测试'));
console.log(chalk.gray('='  .repeat(60)));

const tests = [
  {
    name: '1. 版本显示',
    command: ['--version'],
    timeout: 3000
  },
  {
    name: '2. 帮助信息',
    command: ['--help'],
    timeout: 3000
  },
  {
    name: '3. LLM调试(OpenAI-无密钥)',
    command: ['debug', 'llm', '--provider', 'openai', '--api-key', 'test'],
    timeout: 5000
  },
  {
    name: '4. LLM调试(Spark-真实)',
    command: ['debug', 'llm', '--provider', 'spark'],
    timeout: 10000
  },
  {
    name: '5. 简单查询(Spark)',
    command: ['exec', '你好', '--provider', 'spark'],
    timeout: 15000
  },
  {
    name: '6. 复杂查询(Spark)',
    command: ['exec', '什么是人工智能？请简要说明', '--provider', 'spark', '--max-iterations', '2'],
    timeout: 20000
  },
  {
    name: '7. JSON输出格式',
    command: ['exec', '你好世界', '--provider', 'spark', '--output', 'json'],
    timeout: 15000
  }
];

async function runTest(test) {
  return new Promise((resolve) => {
    console.log(chalk.yellow(`\n🔍 测试: ${test.name}`));
    console.log(chalk.gray(`命令: agent-cli ${test.command.join(' ')}`));
    
    const startTime = Date.now();
    const child = spawn('node', ['bin/agent-cli.js', ...test.command], {
      stdio: 'pipe',
      env: { ...process.env }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      const output = stdout + stderr;
      
      // 判断测试结果
      let passed = false;
      let reason = '';
      
      if (test.name.includes('版本显示')) {
        passed = output.includes('1.1.0');
        reason = passed ? '版本信息正确' : '版本信息不匹配';
      } else if (test.name.includes('帮助信息')) {
        passed = output.includes('Agent-Core 智能代理命令行工具');
        reason = passed ? '帮助信息显示正常' : '帮助信息不完整';
      } else if (test.name.includes('OpenAI-无密钥')) {
        passed = output.includes('fetch failed') || output.includes('连接失败');
        reason = passed ? '预期的连接失败' : '意外的结果';
      } else if (test.name.includes('Spark-真实')) {
        passed = output.includes('LLM 连接正常');
        reason = passed ? 'Spark API连接成功' : 'Spark API连接失败';
      } else if (test.name.includes('简单查询')) {
        passed = output.includes('思考完成') && output.includes('任务完成');
        reason = passed ? '查询执行成功' : '查询执行失败';
      } else if (test.name.includes('复杂查询')) {
        passed = output.includes('人工智能') || output.includes('AI');
        reason = passed ? '复杂查询回答正确' : '复杂查询回答不符合预期';
      } else if (test.name.includes('JSON输出')) {
        passed = output.includes('"result"') || output.includes('"success"');
        reason = passed ? 'JSON格式输出正常' : 'JSON格式输出异常';
      } else {
        passed = code === 0;
        reason = `退出码: ${code}`;
      }

      // 显示结果
      if (passed) {
        console.log(chalk.green('✅ 通过'), chalk.gray(`(${duration}ms) - ${reason}`));
      } else {
        console.log(chalk.red('❌ 失败'), chalk.gray(`(${duration}ms) - ${reason}`));
        console.log(chalk.gray('输出预览:'), output.substring(0, 150).replace(/\n/g, ' ') + '...');
      }

      resolve({ test, passed, duration, output, reason });
    });

    // 超时处理
    setTimeout(() => {
      child.kill('SIGTERM');
      console.log(chalk.red('⏰ 超时'));
      resolve({ 
        test, 
        passed: false, 
        duration: test.timeout, 
        output: '测试超时',
        reason: '超时'
      });
    }, test.timeout);
  });
}

async function runAllTests() {
  console.log(chalk.cyan('开始运行测试...\n'));
  
  const results = [];
  let totalDuration = 0;
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    totalDuration += result.duration;
    
    // 短暂停顿，避免API频率限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 统计结果
  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  console.log(chalk.blue('\n📊 测试总结:'));
  console.log(chalk.gray('=' .repeat(40)));
  console.log(chalk.green(`✅ 通过: ${passed}/${total}`));
  console.log(chalk.red(`❌ 失败: ${total - passed}/${total}`));
  console.log(chalk.blue(`⏱️  总耗时: ${Math.round(totalDuration/1000)}秒`));

  // 详细结果
  console.log(chalk.blue('\n📋 详细结果:'));
  results.forEach((result, idx) => {
    const status = result.passed ? chalk.green('✅') : chalk.red('❌');
    console.log(`${status} ${idx + 1}. ${result.test.name} - ${result.reason}`);
  });

  // 失败的测试
  const failed = results.filter(r => !r.passed);
  if (failed.length > 0) {
    console.log(chalk.red('\n💥 失败的测试:'));
    failed.forEach(result => {
      console.log(chalk.red(`- ${result.test.name}: ${result.reason}`));
    });
  }

  // 成功率
  const successRate = Math.round((passed / total) * 100);
  console.log(chalk.blue(`\n🎯 成功率: ${successRate}%`));

  if (successRate >= 80) {
    console.log(chalk.green.bold('\n🎉 测试基本通过！CLI功能正常'));
  } else if (successRate >= 60) {
    console.log(chalk.yellow.bold('\n⚠️  部分功能需要优化'));
  } else {
    console.log(chalk.red.bold('\n💥 多个功能存在问题，需要修复'));
  }

  console.log(chalk.blue('\n🔗 接下来可以尝试:'));
  console.log(chalk.gray('1. 交互式模式: node bin/agent-cli.js interactive --provider spark'));
  console.log(chalk.gray('2. 浏览器工具: node bin/agent-cli.js browser'));
  console.log(chalk.gray('3. MCP服务器: node bin/agent-cli.js mcp'));
}

// 运行测试
runAllTests().catch(error => {
  console.error(chalk.red('💥 测试运行失败:'), error);
  process.exit(1);
});
