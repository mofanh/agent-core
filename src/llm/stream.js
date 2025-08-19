/**
 * 发起 LLM 流式请求
 * @param {object} options
 * @param {function} options.requestImpl - 外部注入的请求实现 (必须返回 AsyncIterable/ReadableStream)
 * @param {any} options.payload - 请求参数
 * @returns {AsyncGenerator} - 返回流式响应
 */
export async function* llmStreamRequest({ requestImpl, payload }) {
  if (typeof requestImpl !== 'function') {
    throw new Error('llmStreamRequest 需要外部传入 requestImpl 实现');
  }
  // 假设 requestImpl 返回 AsyncIterable
  for await (const chunk of requestImpl(payload)) {
    // console.log('core llmStreamRequest chunk--', chunk);
    yield chunk;
  }
}
