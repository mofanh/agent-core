/**
 * 测试CSDN网站数据抓取
 */
import { createBrowserToolSystem, BROWSER_TOOLS } from './src/browser/index.js';

async function scrapeCSdnWebsite() {
  console.log('🎯 开始抓取CSDN网站数据');
  
  let toolSystem;
  try {
    toolSystem = await createBrowserToolSystem({
      security: 'relaxed'
    });
    
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 导航到CSDN博客
    console.log('📍 步骤1: 导航到CSDN博客');
    const navigateResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.NAVIGATE,
      { 
        url: 'https://blog.csdn.net/xiaqiuguniang/article/details/115180237',
        timeout: 15000,
        waitUntil: 'domcontentloaded' // 使用较宽松的等待条件
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
    
    // 短暂等待页面加载
    console.log('⏳ 等待页面加载...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 先尝试提取基本页面信息
    console.log('📊 步骤2: 提取基本页面信息');
    const basicExtract = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          page_title: 'title',
          body_text: 'body',
          html_tag: 'html'
        },
        options: {
          timeout: 8000,
          extractType: 'text'
        }
      }
    );
    
    if (basicExtract.success && basicExtract.data?.data?.results) {
      console.log('✅ 基本信息提取成功');
      const results = basicExtract.data.data.results;
      
      console.log('\n📄 页面基本信息:');
      Object.entries(results).forEach(([key, result]) => {
        if (result.success && result.elements && result.elements.length > 0) {
          const text = result.elements[0].text || '';
          console.log(`  ${key}: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
        } else {
          console.log(`  ${key}: ${result.error || '未找到'}`);
        }
      });
      
      // 如果是403页面，尝试提取403页面的具体信息
      const bodyText = results.body_text?.elements?.[0]?.text || '';
      if (bodyText.includes('403') || bodyText.includes('Forbidden')) {
        console.log('\n🚫 检测到403 Forbidden页面');
        
        // 尝试提取403页面的详细信息
        console.log('📊 步骤3: 提取403页面详细信息');
        const errorExtract = await toolSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.EXTRACT,
          {
            selectors: {
              error_title: 'h1, h2, .error-title, .title',
              error_message: '.error-message, .message, p',
              all_headings: 'h1, h2, h3, h4, h5, h6',
              all_paragraphs: 'p',
              all_divs: 'div'
            },
            options: {
              timeout: 5000,
              multiple: true,
              extractType: 'text'
            }
          }
        );
        
        if (errorExtract.success) {
          console.log('\n🔍 403页面结构分析:');
          const errorResults = errorExtract.data.data.results;
          Object.entries(errorResults).forEach(([key, result]) => {
            if (result.success && result.elements && result.elements.length > 0) {
              console.log(`\n  ${key} (${result.elements.length}个):`);
              result.elements.slice(0, 3).forEach((element, index) => {
                const text = element.text?.trim() || '';
                if (text) {
                  console.log(`    [${index + 1}] ${text.substring(0, 150)}${text.length > 150 ? '...' : ''}`);
                }
              });
            }
          });
        }
      }
      
      // 显示页面元数据
      const metadata = basicExtract.data.data.metadata;
      console.log('\n📊 页面元数据:');
      console.log(`  URL: ${metadata.pageInfo.url}`);
      console.log(`  标题: ${metadata.pageInfo.title}`);
      console.log(`  提取元素总数: ${metadata.totalElements}`);
      console.log(`  页面就绪状态: ${metadata.pageInfo.readyState || 'unknown'}`);
      
    } else {
      console.log('❌ 基本信息提取失败:', basicExtract.error);
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

scrapeCSdnWebsite().catch(console.error);
