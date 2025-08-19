import { llmStreamRequest } from '../src/llm/stream.js';
// const { llmStreamRequest } = require('../src/llm/stream.js');

// 讯飞星火大模型 HTTP 流式请求实现
async function* sparkStreamRequest(payload) {
  const apiKey = process.env.SPARK_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau'; // 请替换为真实key
  const url = 'https://spark-api-open.xf-yun.com/v1/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.body) throw new Error('No response body');
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          yield JSON.parse(data);
        } catch {}
      }
    }
  }
}

describe('llmStreamRequest (Spark)', () => {
  it('should stream response from Spark API', async () => {
    const payload = {
      model: '4.0Ultra',
      messages: [
        { role: 'user', content: '说一个程序员才懂的笑话' }
      ],
      stream: true
    };
    const chunks = [];
    for await (const chunk of llmStreamRequest({ requestImpl: sparkStreamRequest, payload })) {
      chunks.push(chunk);
      console.log('llmStreamRequest chunk--', chunk.choices[0].delta);
    }
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]).toHaveProperty('code', 0);
    expect(chunks[0]).toHaveProperty('choices');
  }, 20000);
});
