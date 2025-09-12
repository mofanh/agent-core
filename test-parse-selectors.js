#!/usr/bin/env node

/**
 * 简化测试 - 直接测试extract工具的parseSelectors方法
 */

async function testParseSelectors() {
  console.log('🧪 测试 parseSelectors 方法...');
  
  // 模拟ExtractTool的parseSelectors方法
  function parseSelectors(selectors) {
    console.log('输入selectors:', selectors, '类型:', typeof selectors);
    
    if (typeof selectors === 'string') {
      console.log('→ 字符串类型，返回 { main: selectors }');
      return { main: selectors };
    }
    if (Array.isArray(selectors)) {
      console.log('→ 数组类型');
      const result = {};
      selectors.forEach((selector, index) => {
        result[`selector_${index}`] = selector;
      });
      return result;
    }
    if (typeof selectors === 'object') {
      console.log('→ 对象类型，直接返回');
      return selectors;
    }
    console.log('→ 其他类型，返回空对象');
    return {};
  }
  
  // 测试各种输入情况
  console.log('\n1. 测试 undefined:');
  console.log('结果:', parseSelectors(undefined));
  
  console.log('\n2. 测试空字符串:');
  console.log('结果:', parseSelectors(''));
  
  console.log('\n3. 测试 "title":');
  console.log('结果:', parseSelectors('title'));
  
  console.log('\n4. 测试 ["h1", "title"]:');
  console.log('结果:', parseSelectors(['h1', 'title']));
  
  console.log('\n5. 测试 { title: "title", heading: "h1" }:');
  console.log('结果:', parseSelectors({ title: "title", heading: "h1" }));
}

testParseSelectors();
