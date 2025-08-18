// 使用 dist 构建文件（推荐）
// import { quickStart } from '../dist/index.esm.js';
// 使用 src 源码需要 tsx 运行：npx tsx index.js
// import { quickStart } from '../src/index.ts';

// 示例 1: 基本页面分析
// import { quickStart } from '../src/index.ts';

// async function basicPageAnalysis() {
//   console.log('开始页面分析...');
  
//   const result = await quickStart('basic', {
//     task: 'analyze_page',
//     target: 'https://example.com'
//   });
  
//   console.log('页面分析结果:', result);
// }

// // 示例 2: 表单填充
// import { WebPilotAgent } from '@webpilot/agent';

// async function formFilling() {
//   const agent = new WebPilotAgent({
//     llmProvider: {
//       type: 'openai',
//       apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
//       model: 'gpt-4'
//     },
//     mcpServers: ['dom', 'forms']
//   });

//   await agent.initialize();

//   const result = await agent.execute({
//     task: 'fill_form',
//     target: 'https://example.com/contact',
//     data: {
//       name: 'John Doe',
//       email: 'john@example.com',
//       message: 'Hello from WebPilot Agent!'
//     }
//   });

//   console.log('表单填充结果:', result);
//   await agent.shutdown();
// }

// // 示例 3: 批量处理
// import { batchProcess } from '@webpilot/agent';

// async function batchExample() {
//   const tasks = [
//     {
//       task: 'analyze_page',
//       target: 'https://example1.com'
//     },
//     {
//       task: 'analyze_page', 
//       target: 'https://example2.com'
//     },
//     {
//       task: 'extract_data',
//       target: 'https://example3.com',
//       selectors: {
//         title: 'h1',
//         content: '.content',
//         links: 'a[href]'
//       }
//     }
//   ];

//   const results = await batchProcess(tasks, {
//     concurrency: 2,
//     failFast: false
//   });

//   console.log('批量处理结果:', results);
// }

// // 示例 4: 流式处理
// import { createAgent } from '@webpilot/agent';

// async function streamExample() {
//   const agent = createAgent('debug', {
//     llmProvider: {
//       apiKey: process.env.OPENAI_API_KEY || 'your-api-key'
//     }
//   });

//   await agent.initialize();

//   // 流式执行，可以实时获取进度
//   const stream = agent.executeStream({
//     task: 'complex_analysis',
//     target: 'https://complex-page.com'
//   });

//   for await (const chunk of stream) {
//     console.log('进度更新:', chunk);
//   }

//   await agent.shutdown();
// }

// 示例 5: 自定义配置
import { WebPilotAgent, PRESET_CONFIGS } from '../src/index.ts';

async function customConfigExample() {
  // 基于预设配置进行扩展
  const customConfig = {
    ...PRESET_CONFIGS.performance,
    llmProvider: {
      type: 'spark',
      apiKey: process.env.OPENAI_API_KEY || 'nPLgqzEHEtEjZcnsDKdS:mZIvrDDeVfZRpYejdKau',
      model: '4.0Ultra',
      temperature: 0.5
    },
    performance: {
      ...PRESET_CONFIGS.performance.performance,
      timeout: 60000, // 1分钟超时
      maxRetries: 5
    },
    logging: {
      level: 'debug',
      enablePerformanceLogging: true,
      enableErrorTracking: true
    }
  };

  const agent = new WebPilotAgent(customConfig);
  await agent.initialize();

  // 执行复杂任务
  const result = await agent.execute({
    task: 'comprehensive_analysis',
    target: 'https://complex-site.com',
    options: {
      includeScreenshot: true,
      analyzeAccessibility: true,
      extractMetadata: true
    }
  });

  console.log('复杂分析结果:', result);
  
  // 获取代理状态
  const health = await agent.getHealth();
  console.log('代理健康状态:', health);
  
  const capabilities = await agent.getCapabilities();
  console.log('代理能力:', capabilities);

  await agent.shutdown();
}

// 运行示例
async function runExamples() {
  try {
    // console.log('=== 基本页面分析 ===');
    // await basicPageAnalysis();

    // console.log('\n=== 表单填充 ===');
    // await formFilling();

    // console.log('\n=== 批量处理 ===');
    // await batchExample();

    // console.log('\n=== 流式处理 ===');
    // await streamExample();

    console.log('\n=== 自定义配置 ===');
    await customConfigExample();

  } catch (error) {
    console.error('示例执行出错:', error);
  }
}

// 如果直接运行此文件
// if (require.main === module) {
  runExamples();
// }

export {
  // basicPageAnalysis,
  // formFilling,
  // batchExample,
  // streamExample,
  customConfigExample
};
