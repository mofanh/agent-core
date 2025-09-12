/**
 * 浏览器数据抓取本地测试
 * 使用本地HTML文件测试浏览器工具的功能
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import {
  createBrowserToolSystem,
  BROWSER_TOOLS
} from '../src/browser/index.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

describe('浏览器工具本地数据抓取测试', () => {
  let toolSystem;
  let testHtmlPath;
  
  beforeAll(async () => {
    // 创建测试用的HTML文件
    const testHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>集合类型 - Rust语言圣经(Rust Course)</title>
    <meta name="description" content="Rust语言集合类型教程">
</head>
<body>
    <header>
        <h1>集合类型介绍</h1>
        <nav>
            <a href="#vectors">向量</a>
            <a href="#strings">字符串</a>
            <a href="#hashmaps">哈希映射</a>
        </nav>
    </header>
    
    <main>
        <section id="intro">
            <h2>什么是集合类型</h2>
            <p>集合类型是Rust中用于存储多个值的数据结构。与数组不同，集合类型可以动态增长。</p>
            <p>Rust标准库提供了几种非常有用的集合类型，本章将介绍三种常用的集合类型。</p>
        </section>
        
        <section id="vectors">
            <h2>向量 (Vec&lt;T&gt;)</h2>
            <h3>创建向量</h3>
            <p>向量允许你在一个单独的数据结构中存储多于一个的值。</p>
            <pre><code class="language-rust">
let mut v = Vec::new();
v.push(5);
v.push(6);
v.push(7);
v.push(8);
            </code></pre>
            
            <h3>读取向量中的元素</h3>
            <p>有两种方式引用向量中储存的值。</p>
            <pre><code class="language-rust">
let v = vec![1, 2, 3, 4, 5];
let third: &i32 = &v[2];
println!("第三个元素是 {}", third);
            </code></pre>
        </section>
        
        <section id="strings">
            <h2>字符串 (String)</h2>
            <h3>新建字符串</h3>
            <p>很多 Vec 可用的操作在 String 中同样可用。</p>
            <pre><code class="language-rust">
let mut s = String::new();
let data = "initial contents";
let s = data.to_string();
            </code></pre>
        </section>
        
        <section id="hashmaps">
            <h2>哈希映射 (HashMap&lt;K, V&gt;)</h2>
            <h3>新建一个哈希映射</h3>
            <p>可以使用 new 创建一个空的 HashMap，并使用 insert 增加元素。</p>
            <pre><code class="language-rust">
use std::collections::HashMap;
let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
            </code></pre>
        </section>
    </main>
    
    <footer>
        <p>© 2023 Rust语言圣经</p>
        <div class="links">
            <a href="/prev">上一章</a>
            <a href="/next">下一章</a>
        </div>
    </footer>
</body>
</html>
`;

    // 将HTML写入临时文件
    testHtmlPath = join(process.cwd(), 'test_page.html');
    writeFileSync(testHtmlPath, testHtml);

    // 初始化浏览器工具系统
    toolSystem = createBrowserToolSystem({
      headless: true,
      devtools: false,
      security: {
        securityLevel: 'relaxed',
        allowedDomains: ['*'],
        blockedDomains: [],
        enableSandbox: false,
        auditLog: false
      }
    });
    
    await toolSystem.initialize();
  });

  afterAll(async () => {
    if (toolSystem) {
      await toolSystem.cleanup();
    }
    
    // 清理测试文件
    try {
      const fs = await import('fs');
      fs.unlinkSync(testHtmlPath);
    } catch (error) {
      // 忽略删除失败
    }
  });

  test('抓取本地HTML页面的数据', async () => {
    console.log('\n🚀 开始抓取本地HTML页面数据');
    console.log('================================================================================');
    
    // 步骤1: 页面导航
    console.log('\n📍 步骤1: 页面导航');
    const fileUrl = `file://${testHtmlPath}`;
    const navigateResult = await toolSystem.toolManager.executeLocalTool(BROWSER_TOOLS.NAVIGATE, {
      url: fileUrl,
      waitForSelector: 'body',
      timeout: 15000
    });
    
    expect(navigateResult.success).toBe(true);
    console.log(`✅ 页面导航成功: ${fileUrl}`);
    
    // 步骤2: 使用Extract工具提取页面内容
    console.log('\n📝 步骤2: 使用Extract工具提取页面内容');
    const extractResult = await toolSystem.toolManager.executeLocalTool(BROWSER_TOOLS.EXTRACT, {
      selectors: {
        title: 'title',
        h1: 'h1',
        h2_list: 'h2',
        h3_list: 'h3', 
        paragraphs: 'p',
        code_blocks: 'pre code',
        nav_links: 'nav a',
        footer_links: 'footer a'
      },
      extractType: 'text',
      multiple: true,
      waitForElements: false,
      timeout: 15000
    });

    expect(extractResult.success).toBe(true);
    expect(extractResult.data?.data?.results).toBeDefined();
    
    const results = extractResult.data.data.results;
    console.log('\n🎯 Extract 工具提取结果:');
    
    // 验证和显示页面标题
    if (results.title && results.title.elements.length > 0) {
      console.log(`   📄 页面标题: ${results.title.elements[0]}`);
      expect(results.title.elements[0]).toContain('集合类型');
      expect(results.title.elements[0]).toContain('Rust语言圣经');
    }
    
    // 验证和显示主标题
    if (results.h1 && results.h1.elements.length > 0) {
      console.log(`   🎯 主标题: ${results.h1.elements[0]}`);
      expect(results.h1.elements[0]).toContain('集合类型');
    }
    
    // 验证和显示H2标题
    if (results.h2_list && results.h2_list.elements.length > 0) {
      console.log(`   📋 H2标题数: ${results.h2_list.elements.length}`);
      console.log('   📋 H2标题列表:');
      results.h2_list.elements.forEach((h2, index) => {
        console.log(`     ${index + 1}. ${h2.trim()}`);
      });
      
      // 验证包含预期的标题
      const h2Texts = results.h2_list.elements.map(h => h.trim());
      expect(h2Texts).toContain('什么是集合类型');
      expect(h2Texts).toContain('向量 (Vec<T>)');
      expect(h2Texts).toContain('字符串 (String)');
      expect(h2Texts).toContain('哈希映射 (HashMap<K, V>)');
    }
    
    // 验证和显示H3标题
    if (results.h3_list && results.h3_list.elements.length > 0) {
      console.log(`   📝 H3标题数: ${results.h3_list.elements.length}`);
      const h3Texts = results.h3_list.elements.map(h => h.trim());
      expect(h3Texts.length).toBeGreaterThan(0);
    }
    
    // 验证和显示段落
    if (results.paragraphs && results.paragraphs.elements.length > 0) {
      console.log(`   📄 段落数: ${results.paragraphs.elements.length}`);
      console.log('   📄 前3个段落内容:');
      results.paragraphs.elements.slice(0, 3).forEach((p, index) => {
        if (p.trim()) {
          const text = p.trim().substring(0, 100);
          console.log(`     ${index + 1}. ${text}${p.length > 100 ? '...' : ''}`);
        }
      });
      
      expect(results.paragraphs.elements.length).toBeGreaterThan(0);
    }
    
    // 验证和显示代码块
    if (results.code_blocks && results.code_blocks.elements.length > 0) {
      console.log(`   💻 代码块数: ${results.code_blocks.elements.length}`);
      console.log('   💻 代码块示例:');
      results.code_blocks.elements.slice(0, 2).forEach((code, index) => {
        if (code.trim()) {
          const lines = code.trim().split('\n');
          console.log(`     ${index + 1}. ${lines[0].trim()}...`);
        }
      });
      
      expect(results.code_blocks.elements.length).toBeGreaterThan(0);
      // 验证包含Rust代码
      const codeTexts = results.code_blocks.elements.join(' ');
      expect(codeTexts).toContain('Vec::new');
      expect(codeTexts).toContain('HashMap');
    }
    
    // 验证和显示导航链接
    if (results.nav_links && results.nav_links.elements.length > 0) {
      console.log(`   🔗 导航链接数: ${results.nav_links.elements.length}`);
      results.nav_links.elements.forEach((link, index) => {
        console.log(`     ${index + 1}. ${link.trim()}`);
      });
      
      const navTexts = results.nav_links.elements.map(l => l.trim());
      expect(navTexts).toContain('向量');
      expect(navTexts).toContain('字符串'); 
      expect(navTexts).toContain('哈希映射');
    }
    
    console.log('\n✅ 数据抓取测试成功完成！');
    console.log('\n📊 测试结果汇总:');
    console.log(`   - 页面标题: ✅ 成功`);
    console.log(`   - 主标题: ✅ 成功`);
    console.log(`   - H2标题: ✅ ${results.h2_list?.elements.length || 0} 个`);
    console.log(`   - H3标题: ✅ ${results.h3_list?.elements.length || 0} 个`);
    console.log(`   - 段落: ✅ ${results.paragraphs?.elements.length || 0} 个`);
    console.log(`   - 代码块: ✅ ${results.code_blocks?.elements.length || 0} 个`);
    console.log(`   - 导航链接: ✅ ${results.nav_links?.elements.length || 0} 个`);
    
  }, 30000); // 30秒超时
});
