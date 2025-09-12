#!/usr/bin/env node

// 测试响应解析逻辑
function parseAgentResponse(content) {
  const analysis = {
    needsTools: false,
    tools: [],
    isComplete: false,
    reasoning: ''
  };

  // 简单的模式匹配 - 生产环境中应该使用更复杂的 NLP 解析
  const lines = content.split('\n');
  
  for (const line of lines) {
    console.log('检查行:', line);
    
    // 检查是否需要浏览器工具
    if (line.includes('需要浏览') || line.includes('访问网页') || line.includes('打开页面')) {
      console.log('✅ 找到浏览器工具需求:', line);
      analysis.needsTools = true;
      // 修复URL提取，排除末尾的标点符号
      const urlMatch = line.match(/https?:\/\/[^\s\]）)}>]+/);
      if (urlMatch) {
        console.log('✅ 提取到URL:', urlMatch[0]);
        analysis.tools.push({
          name: 'browser_navigate',
          args: { url: urlMatch[0] }
        });
      } else {
        console.log('❌ 未找到URL');
      }
    }

    // 检查是否完成
    if (line.includes('任务完成') || line.includes('回答完毕') || line.includes('COMPLETE')) {
      console.log('✅ 找到完成标识:', line);
      analysis.isComplete = true;
    }
  }

  // 如果没有明确的完成标识，但也没有工具调用需求，认为是完成
  if (!analysis.needsTools && !analysis.isComplete) {
    analysis.isComplete = true;
  }

  return analysis;
}

// 测试实际的响应
const testResponse = `1. 分析问题：用户明确要求浏览指定网址https://www.baidu.com，这是一个直接的网页访问需求，无需额外解析或复杂处理。
2. 需要浏览 [https://www.baidu.com]
3. 由于我是文本交互型AI助手，无法直接展示实时网页内容，但可以告知您：该链接指向百度首页，作为中国主流搜索引擎，提供搜索框、新闻资讯、地图服务、学术资源等多功能入口。建议您自行打开浏览器粘贴此URL进行访问。
4. 任务完成（已按需求提供对应操作指引）`;

console.log('=== 测试响应解析 ===');
const result = parseAgentResponse(testResponse);
console.log('\n=== 解析结果 ===');
console.log(JSON.stringify(result, null, 2));
