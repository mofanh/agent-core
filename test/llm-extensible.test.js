import {
  LLM,
  LLMFactory,
  createSparkLLM,
  createOpenAILLM,
  createSparkAgent,
  createLLMAgent,
  sparkRequestHandler,
} from "../src/index.js";

async function* sparkStreamRequest(payload) {
  console.log("sparkStreamRequest called with payload:", payload);
  const apiKey =
    process.env.SPARK_API_KEY || "nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau";
  const url = "https://spark-api-open.xf-yun.com/v1/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.body) throw new Error("No response body");
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
          // console.log('Received chunk:', data);
          yield JSON.parse(data);
        } catch {}
      }
    }
  }
}

describe("LLM 可扩展库测试", () => {
  test("LLM 类应该接受配置对象", async () => {
    const llm = new LLM({
      requestHandler: sparkStreamRequest,
      provider: "test",
      options: { timeout: 5000 },
    });

    try {
      const result = await llm.post({
        model: "4.0Ultra",
        messages: [{ role: "user", content: "说一个程序员才懂的笑话" }],
        stream: true,
      });

      // 遍历异步生成器获取数据
      const chunks = [];

      try {
        for await (const chunk of result) {
          chunks.push(chunk);
          console.log("收到数据块:", chunk.choices?.[0]?.delta || chunk);
        }
      } catch (error) {
        console.log("数据接收过程中出错:", error.message);
      }

      console.log("总共收到", chunks.length, "个数据块");
    } catch (error) {
      console.log("请求过程中发生错误:", error.message);
    }

    expect(llm.provider).toBe("test");
    expect(llm.requestHandler).toBe(sparkStreamRequest);
    expect(llm.options.timeout).toBe(5000);
  }, 30000); // 设置测试超时为30秒，允许完整接收流式数据

  test("应该能注册自定义提供商", () => {
    const customHandler = async function* (payload) {
      yield { message: "custom response" };
    };

    LLMFactory.register("custom", customHandler, null, {
      defaultModel: "custom-model",
    });

    expect(LLMFactory.getProviders()).toContain("custom");

    const llm = LLMFactory.create("custom");
    expect(llm.provider).toBe("custom");
    expect(llm.options.defaultModel).toBe("custom-model");
  });

  test("createSparkLLM 应该创建星火 LLM 实例", () => async () => {
    const llm = createSparkLLM({
      apiKey: "nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau",
    });

    // await llm.post({
    //   model: "4.0Ultra",
    //   messages: [{ role: "user", content: "说一个程序员才懂的笑话" }],
    //   stream: true,
    // });
    try {
      const result = await llm.post({
        model: "4.0Ultra",
        messages: [{ role: "user", content: "说一个程序员才懂的笑话" }],
        stream: true,
      });

      // 遍历异步生成器获取数据
      const chunks = [];

      try {
        for await (const chunk of result) {
          chunks.push(chunk);
          console.log("收到数据块:", chunk.choices?.[0]?.delta || chunk);
        }
      } catch (error) {
        console.log("数据接收过程中出错:", error.message);
      }

      console.log("总共收到", chunks.length, "个数据块");
    } catch (error) {
      console.log("请求过程中发生错误:", error.message);
    }

    expect(llm.provider).toBe("spark");
    expect(llm.options.apiKey).toBe(
      "nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau"
    );
  });

  test("createOpenAILLM 应该创建 OpenAI LLM 实例", () => {
    const llm = createOpenAILLM({ model: "gpt-4" });
    expect(llm.provider).toBe("openai");
    expect(llm.options.model).toBe("gpt-4");
  });

  test("LLM 应该支持连接检查缓存", async () => {
    let callCount = 0;
    const mockChecker = async () => {
      callCount++;
      return true;
    };
    const mockHandler = async function* () {
      yield {};
    };

    const llm = new LLM({
      requestHandler: mockHandler,
      connectionChecker: mockChecker,
      provider: "test",
    });

    // 第一次检查
    await llm.isConnect();
    expect(callCount).toBe(1);

    // 第二次检查应该使用缓存
    await llm.isConnect();
    expect(callCount).toBe(1);

    // 强制检查应该绕过缓存
    await llm.isConnect(true);
    expect(callCount).toBe(2);
  });

  test("应该能处理流式和非流式请求", async () => {
    const mockHandler = async function (payload, options) {
      if (payload.stream) {
        // 返回生成器函数
        return (async function* () {
          yield { delta: { content: "chunk 1" } };
          yield { delta: { content: "chunk 2" } };
        })();
      } else {
        // 返回普通对象
        return { choices: [{ message: { content: "complete response" } }] };
      }
    };

    const llm = new LLM({
      requestHandler: mockHandler,
      provider: "test",
      options: { checkConnection: false },
    });

    // 非流式请求
    const nonStreamResult = await llm.post({
      messages: [{ role: "user", content: "hello" }],
      stream: false,
    });
    expect(nonStreamResult.choices[0].message.content).toBe(
      "complete response"
    );

    // 流式请求
    const streamResult = await llm.stream({
      messages: [{ role: "user", content: "hello" }],
    });

    const chunks = [];
    for await (const chunk of streamResult) {
      chunks.push(chunk);
    }
    expect(chunks).toHaveLength(2);
    expect(chunks[0].delta.content).toBe("chunk 1");
  });
});

describe("Agent 集成测试", () => {
  test("createSparkAgent 应该创建带星火 LLM 的 Agent", async () => {
    const agent = createSparkAgent({ apiKey: "test-key" });
    await agent.initialize();

    expect(agent.llm).toBeDefined();
    expect(agent.llm.provider).toBe("spark");
  });

  test("createLLMAgent 应该支持多种创建方式", async () => {
    // 方式1：使用提供商名称
    const agent1 = createLLMAgent("spark", { apiKey: "test-key" });
    await agent1.initialize();
    expect(agent1.llm.provider).toBe("spark");

    // 方式2：使用自定义处理函数
    const customHandler = async function* () {
      yield {};
    };
    const agent2 = createLLMAgent(customHandler, { provider: "custom" });
    await agent2.initialize();
    expect(agent2.llm.provider).toBe("custom");

    // 方式3：使用完整配置
    const agent3 = createLLMAgent({
      requestHandler: customHandler,
      provider: "test",
      options: { model: "test-model" },
    });
    await agent3.initialize();
    expect(agent3.llm.provider).toBe("test");
  });
});
