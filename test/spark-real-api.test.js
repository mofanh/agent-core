#!/usr/bin/env node

/**
 * 讯飞星火API真实测试脚本
 * 
 * 使用真实的讯飞星火API进行测试
 */

import { createSparkLLM } from '../src/index.js';

// 从环境变量或使用提供的API密钥
const SPARK_API_KEY = process.env.SPARK_API_KEY || "nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau";

console.log('🧪 讯飞星火API真实测试');
console.log('=' .repeat(50));
console.log('API Key:', SPARK_API_KEY.substring(0, 10) + '...');
console.log('');

async function testSparkAPI() {
  try {
    // 创建星火LLM实例
    const sparkLLM = createSparkLLM({
      apiKey: SPARK_API_KEY
    });

    console.log('📡 创建LLM实例成功');
    console.log('Provider:', sparkLLM.provider);
    console.log('');

    // 测试非流式请求
    console.log('🔄 测试非流式请求...');
    const nonStreamResponse = await sparkLLM.request({
      model: "4.0Ultra",
      messages: [
        {
          role: "user",
          content: "你好，请简单介绍一下你自己。"
        }
      ],
      stream: false,
      max_tokens: 100
    });

    console.log('✅ 非流式响应:');
    console.log(JSON.stringify(nonStreamResponse, null, 2));
    console.log('');

    // 测试流式请求
    console.log('🌊 测试流式请求...');
    const streamResponse = await sparkLLM.request({
      model: "4.0Ultra", 
      messages: [
        {
          role: "user",
          content: "请用50个字简单介绍一下人工智能。"
        }
      ],
      stream: true,
      max_tokens: 100
    });

    console.log('✅ 流式响应开始:');
    let fullContent = '';
    let chunkCount = 0;

    for await (const chunk of streamResponse) {
      chunkCount++;
      const content = chunk.choices?.[0]?.delta?.content || '';
      if (content) {
        fullContent += content;
        process.stdout.write(content);
      }
      
      // 调试信息
      if (process.env.DEBUG) {
        console.log('\n[DEBUG] Chunk', chunkCount, ':', JSON.stringify(chunk));
      }
    }

    console.log('\n');
    console.log(`📊 流式响应完成 - 收到 ${chunkCount} 个数据块`);
    console.log('完整内容长度:', fullContent.length);
    console.log('');

  } catch (error) {
    console.error('❌ 测试失败:');
    console.error('错误类型:', error.constructor.name);
    console.error('错误消息:', error.message);
    
    if (error.cause) {
      console.error('原因:', error.cause);
    }
    
    if (process.env.DEBUG && error.stack) {
      console.error('错误堆栈:', error.stack);
    }
    
    // 网络错误的特殊处理
    if (error.message.includes('fetch')) {
      console.error('');
      console.error('💡 提示: 这可能是网络连接问题');
      console.error('   1. 检查网络连接');
      console.error('   2. 确认API密钥是否正确');
      console.error('   3. 检查防火墙设置');
    }
    
    // HTTP错误的特殊处理
    if (error.message.includes('HTTP')) {
      console.error('');
      console.error('💡 提示: 这是HTTP响应错误');
      console.error('   1. 检查API密钥是否有效');
      console.error('   2. 确认请求参数是否正确');
      console.error('   3. 查看API配额是否已用完');
    }
  }
}

// 连接测试
async function testConnection() {
  console.log('🔗 测试API连接...');
  
  try {
    const response = await fetch('https://spark-api-open.xf-yun.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SPARK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "4.0Ultra",
        messages: [{ role: "user", content: "hello" }],
        max_tokens: 1,
        stream: false
      })
    });

    console.log('HTTP状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('错误响应:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ 连接测试成功');
    console.log('响应数据:', JSON.stringify(data, null, 2));
    return true;
    
  } catch (error) {
    console.error('❌ 连接测试失败:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  // 首先测试连接
  const connected = await testConnection();
  console.log('');
  
  if (connected) {
    // 连接成功，进行完整测试
    await testSparkAPI();
  } else {
    console.log('❌ 由于连接失败，跳过完整测试');
  }
  
  console.log('🎯 测试完成');
}

// 执行测试
main().catch(error => {
  console.error('💥 测试执行失败:', error);
  process.exit(1);
});
