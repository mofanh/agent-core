 /**
 * 测试从 course.rs 抓取数据
 */
import { createBrowserToolSystem, BROWSER_TOOLS } from './src/browser/index.js';

async function testCourseRsExtraction() {
  console.log('🎯 开始测试 CSDN博客 数据抓取');
  
  let toolSystem;
  try {
    // 创建浏览器工具系统
    toolSystem = await createBrowserToolSystem({
      security: 'relaxed'  // 使用宽松安全策略
    });
    
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 1. 导航到目标页面 (使用CSDN博客)
    console.log('📍 步骤1: 导航到 https://blog.csdn.net/xiaqiuguniang/article/details/115180237');
    const navigateResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.NAVIGATE,
      { 
        url: 'https://blog.csdn.net/xiaqiuguniang/article/details/115180237', 
        timeout: 15000,
        waitUntil: 'networkidle2'
      }
    );
    
    if (!navigateResult.success) {
      throw new Error(`导航失败: ${navigateResult.error}`);
    }
    console.log('✅ 页面导航成功');
    
    // 等待页面完全加载
    console.log('⏳ 等待页面完全加载...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 添加页面状态检查
    console.log('🔍 检查页面实际加载状态');
    try {
      const pageInfo = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.EXTRACT,
        {
          selectors: { current_url: 'html', page_title: 'title' },
          options: { timeout: 3000 }
        }
      );
      console.log('页面信息:', JSON.stringify(pageInfo.data?.data?.metadata?.pageInfo || {}, null, 2));
    } catch (e) {
      console.log('页面状态检查失败:', e.message);
    }
    
    // 等待页面完全加载
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. 提取页面标题和文章信息
    console.log('📊 步骤2: 提取CSDN文章信息');
    const titleResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          page_title: 'title',
          article_title: '.title-article, #articleTitle, h1.title, .article-title',
          author: '.follow-nickName, .username, .author-name',
          content_preview: '.article_content, .content, #content_views'
        },
        options: {
          timeout: 10000,
          waitForElements: true
        }
      }
    );
    
    console.log('标题提取结果:', JSON.stringify(titleResult, null, 2));
    
    // 3. 提取文章具体内容
    console.log('📊 步骤3: 提取文章结构化内容');
    const contentResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          headings: 'h1, h2, h3, h4',
          paragraphs: '.article_content p, .content p, #content_views p',
          code_blocks: 'pre, .hljs, code',
          publish_time: '.time, [data-articleTime], .article-bar-top time'
        },
        options: {
          timeout: 8000,
          multiple: true,
          extractType: 'text'
        }
      }
    );
    
    console.log('内容提取结果:');
    if (contentResult.success && contentResult.data?.data?.results) {
      Object.entries(contentResult.data.data.results).forEach(([key, result]) => {
        if (Array.isArray(result.elements)) {
          console.log(`  ${key}: 找到 ${result.elements.length} 个元素`);
          if (result.elements.length > 0 && result.elements[0].text) {
            console.log(`    示例: ${result.elements[0].text.substring(0, 100)}...`);
          }
        } else {
          console.log(`  ${key}: ${result.success ? '找到内容' : '未找到'}`);
          if (result.error) {
            console.log(`    错误: ${result.error}`);
          }
        }
      });
    } else {
      console.log('  内容提取失败或无数据');
    }
    
    // 4. 尝试更通用的选择器
    console.log('📊 步骤4: 使用通用选择器');
    const genericResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          page_text: 'body',
          all_text_elements: '*:not(script):not(style)'
        },
        options: {
          maxElements: 10  // 限制元素数量避免输出过多
        }
      }
    );
    
    console.log('通用选择器结果:');
    Object.entries(genericResult.data || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        console.log(`  ${key}: 找到 ${value.length} 个元素`);
      } else {
        console.log(`  ${key}: ${value ? '找到内容 (' + value.length + ' 字符)' : '未找到'}`);
      }
    });
    
    console.log('🎉 CSDN博客 数据抓取测试完成');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    console.error('错误详情:', error);
  } finally {
    if (toolSystem) {
      await toolSystem.cleanup();
      console.log('🧹 资源清理完成');
    }
  }
}

// 运行测试
testCourseRsExtraction().catch(console.error);
