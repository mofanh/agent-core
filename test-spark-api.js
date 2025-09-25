#!/usr/bin/env node

/**
 * 测试星火API直接调用
 */

async function* sparkStreamRequest(payload) {
  console.log("sparkStreamRequest called with payload:", payload);
  const apiKey = process.env.SPARK_API_KEY || "nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau";
  const url = "https://spark-api-open.xf-yun.com/v1/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  console.log('Response status:', res.status);
  console.log('Response headers:', Object.fromEntries(res.headers.entries()));
  
  if (!res.body) throw new Error("No response body");
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log('Error response:', errorText);
    throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
  }
  
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (line.startsWith("data:")) {
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;
        try {
          console.log('Received chunk:', data);
          yield JSON.parse(data);
        } catch {
          console.log('Failed to parse chunk:', data);
        }
      }
    }
  }
}

async function testSparkAPI() {
  try {
    // 尝试不同的模型和参数配置
    const testConfigs = [
      {
        name: "Test 1: 无模型参数",
        payload: {
          messages: [{ role: "user", content: "你好" }],
          max_tokens: 100,
          stream: false
        }
      },
      {
        name: "Test 2: general模型",
        payload: {
          model: "general",
          messages: [{ role: "user", content: "你好" }],
          max_tokens: 100,
          stream: false
        }
      },
      {
        name: "Test 3: generalv2模型",
        payload: {
          model: "generalv2",
          messages: [{ role: "user", content: "你好" }],
          max_tokens: 100,
          stream: false
        }
      },
      {
        name: "Test 4: 4.0Ultra模型",
        payload: {
          model: "4.0Ultra",
          messages: [{ role: "user", content: "你好" }],
          max_tokens: 100,
          stream: false
        }
      }
    ];

    for (const config of testConfigs) {
      console.log(`\n=== ${config.name} ===`);
      console.log('Payload:', JSON.stringify(config.payload, null, 2));
      
      try {
        const generator = sparkStreamRequest(config.payload);
        
        for await (const chunk of generator) {
          console.log('✅ Success! Result:', JSON.stringify(chunk, null, 2));
          return; // 成功了就退出
        }
      } catch (error) {
        console.log('❌ Failed:', error.message);
      }
    }
    
  } catch (error) {
    console.error('All tests failed:', error.message);
  }
}

testSparkAPI();
