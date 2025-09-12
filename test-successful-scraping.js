/**
 * 成功的数据抓取流程测试
 */
import { createBrowserToolSystem, BROWSER_TOOLS } from './src/browser/index.js';

async function testSuccessfulScraping() {
  console.log('🎯 测试成功的数据抓取流程');
  
  let toolSystem;
  try {
    toolSystem = await createBrowserToolSystem({
      security: 'relaxed'
    });
    
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 导航到一个简单可靠的网站
    console.log('📍 步骤1: 导航到 https://example.com');
    const navigateResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.NAVIGATE,
      { 
        url: 'https://example.com', 
        timeout: 10000,
        waitUntil: 'domcontentloaded'
      }
    );
    
    if (!navigateResult.success) {
      throw new Error(`导航失败: ${navigateResult.error}`);
    }
    
    const navData = navigateResult.data?.data || navigateResult.data;
    console.log('✅ 导航成功:', {
      url: navData?.finalUrl,
      status: navData?.statusCode,
      title: navData?.title
    });
    
    // 等待一下确保页面完全加载
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 提取页面数据
    console.log('📊 步骤2: 提取页面数据');
    const extractResult = await toolSystem.toolManager.executeLocalTool(
      BROWSER_TOOLS.EXTRACT,
      {
        selectors: {
          title: 'title',
          heading: 'h1',
          paragraphs: 'p',
          all_text: 'body'
        },
        options: {
          timeout: 5000,
          multiple: false,
          extractType: 'text'
        }
      }
    );
    
    if (extractResult.success && extractResult.data?.data?.results) {
      console.log('✅ 数据提取成功!');
      
      const results = extractResult.data.data.results;
      Object.entries(results).forEach(([key, result]) => {
        if (result.success && result.elements && result.elements.length > 0) {
          const text = result.elements[0].text || 'N/A';
          console.log(`  ${key}: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        } else {
          console.log(`  ${key}: 未找到`);
        }
      });
      
      // 显示页面元数据
      const metadata = extractResult.data.data.metadata;
      console.log('\n📄 页面元数据:');
      console.log(`  URL: ${metadata.pageInfo.url}`);
      console.log(`  标题: ${metadata.pageInfo.title}`);
      console.log(`  提取元素数量: ${metadata.totalElements}`);
      
      console.log('\n🎉 完整的导航→提取工作流测试成功!');
      
    } else {
      console.log('❌ 数据提取失败');
    }
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    if (toolSystem) {
      await toolSystem.cleanup();
      console.log('🧹 资源清理完成');
    }
  }
}

testSuccessfulScraping().catch(console.error);
