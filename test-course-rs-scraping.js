/**
 * 测试抓取 course.rs 网站数据
 */
import { createBrowserToolSystem, BROWSER_TOOLS } from './src/browser/index.js';

async function scrapeCourseRs() {
  console.log('🎯 开始抓取 course.rs 网站数据');
  
  let toolSystem;
  try {
    toolSystem = await createBrowserToolSystem({
      security: 'relaxed'
    });
    
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 导航到course.rs
    console.log('📍 步骤1: 导航到 https://course.rs/basic/collections/intro.html');
    const navigateResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.NAVIGATE,
      { 
        url: 'https://course.rs/basic/collections/intro.html',
        timeout: 15000,
        waitUntil: 'domcontentloaded'
      }
    );
    
    if (!navigateResult.success) {
      throw new Error(`导航失败: ${navigateResult.error}`);
    }
    
    const navData = navigateResult.data?.data || navigateResult.data;
    console.log('📊 导航结果:', {
      url: navData?.finalUrl,
      status: navData?.statusCode,
      title: navData?.title
    });
    
    if (navData?.statusCode !== 200) {
      console.log(`⚠️  状态码异常: ${navData.statusCode}`);
    }
    
    // 等待页面完全加载
    console.log('⏳ 等待页面完全加载...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 提取页面基本信息
    console.log('📊 步骤2: 提取页面基本结构');
    const basicExtract = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          page_title: 'title',
          main_heading: 'h1',
          all_headings: 'h1, h2, h3, h4, h5, h6',
          article_content: 'article, .content, main, #content'
        },
        options: {
          timeout: 10000,
          multiple: true,
          extractType: 'text'
        }
      }
    );
    
    if (basicExtract.success && basicExtract.data?.data?.results) {
      console.log('✅ 基本结构提取成功');
      
      const results = basicExtract.data.data.results;
      const metadata = basicExtract.data.data.metadata;
      
      console.log(`\n📄 页面基本信息:`);
      console.log(`  URL: ${metadata.pageInfo.url}`);
      console.log(`  标题: ${metadata.pageInfo.title}`);
      console.log(`  总元素数: ${metadata.totalElements}`);
      
      // 显示页面标题
      if (results.page_title?.success) {
        console.log(`\n📋 页面标题:`);
        console.log(`  ${results.page_title.elements[0]?.text || 'N/A'}`);
      }
      
      // 显示主标题
      if (results.main_heading?.success && results.main_heading.elements?.length > 0) {
        console.log(`\n🎯 主标题:`);
        console.log(`  ${results.main_heading.elements[0]?.text || 'N/A'}`);
      }
      
      // 显示所有标题结构
      if (results.all_headings?.success && results.all_headings.elements?.length > 0) {
        console.log(`\n📚 标题结构 (${results.all_headings.elements.length}个):`);
        results.all_headings.elements.slice(0, 10).forEach((element, index) => {
          const text = element.text?.trim();
          if (text && text.length > 5) {
            console.log(`  [${index + 1}] ${text}`);
          }
        });
      }
      
      // 显示文章内容区域
      if (results.article_content?.success && results.article_content.elements?.length > 0) {
        console.log(`\n📝 文章内容区域:`);
        const content = results.article_content.elements[0]?.text || '';
        if (content.length > 0) {
          console.log(`  内容长度: ${content.length} 字符`);
          console.log(`  内容预览: ${content.substring(0, 300)}${content.length > 300 ? '...' : ''}`);
        }
      }
      
      // 提取更详细的内容
      console.log('\n📊 步骤3: 提取详细内容');
      const detailedExtract = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.EXTRACT,
        {
          selectors: {
            paragraphs: 'p',
            code_blocks: 'pre, code, .highlight',
            lists: 'ul li, ol li',
            links: 'a[href]',
            nav_menu: 'nav, .nav, .sidebar, .menu'
          },
          options: {
            timeout: 8000,
            multiple: true,
            extractType: 'text'
          }
        }
      );
      
      if (detailedExtract.success) {
        const detailedResults = detailedExtract.data.data.results;
        
        // 显示段落内容
        if (detailedResults.paragraphs?.success && detailedResults.paragraphs.elements?.length > 0) {
          console.log(`\n📄 段落内容 (${detailedResults.paragraphs.elements.length}个):`);
          detailedResults.paragraphs.elements.slice(0, 5).forEach((element, index) => {
            const text = element.text?.trim();
            if (text && text.length > 20) {
              console.log(`  [${index + 1}] ${text.substring(0, 150)}${text.length > 150 ? '...' : ''}`);
            }
          });
        }
        
        // 显示代码块
        if (detailedResults.code_blocks?.success && detailedResults.code_blocks.elements?.length > 0) {
          console.log(`\n💻 代码块 (${detailedResults.code_blocks.elements.length}个):`);
          detailedResults.code_blocks.elements.slice(0, 3).forEach((element, index) => {
            const code = element.text?.trim();
            if (code && code.length > 10) {
              console.log(`  [${index + 1}] ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
            }
          });
        }
        
        // 显示列表项
        if (detailedResults.lists?.success && detailedResults.lists.elements?.length > 0) {
          console.log(`\n📝 列表项 (${detailedResults.lists.elements.length}个):`);
          detailedResults.lists.elements.slice(0, 8).forEach((element, index) => {
            const text = element.text?.trim();
            if (text && text.length > 5) {
              console.log(`  • ${text}`);
            }
          });
        }
        
        // 显示链接
        if (detailedResults.links?.success && detailedResults.links.elements?.length > 0) {
          console.log(`\n🔗 页面链接 (${detailedResults.links.elements.length}个):`);
          detailedResults.links.elements.slice(0, 10).forEach((element, index) => {
            const text = element.text?.trim();
            if (text && text.length > 3 && text.length < 100) {
              console.log(`  [${index + 1}] ${text}`);
            }
          });
        }
      }
      
      console.log('\n🎉 course.rs 数据抓取完成!');
      
    } else {
      console.log('❌ 基本结构提取失败:', basicExtract.error);
    }
    
  } catch (error) {
    console.error('❌ 抓取过程中发生错误:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  } finally {
    if (toolSystem) {
      await toolSystem.cleanup();
      console.log('🧹 资源清理完成');
    }
  }
}

scrapeCourseRs().catch(console.error);
