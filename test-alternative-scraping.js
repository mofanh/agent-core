/**
 * 测试抓取更容易访问的中文网站
 */
import { createBrowserToolSystem, BROWSER_TOOLS } from './src/browser/index.js';

async function scrapeAlternativeWebsite() {
  console.log('🎯 测试抓取中文技术网站数据');
  
  let toolSystem;
  try {
    toolSystem = await createBrowserToolSystem({
      security: 'relaxed'
    });
    
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 尝试几个不同的网站
    const testUrls = [
      'https://www.runoob.com/python/python-tutorial.html',
      'https://segmentfault.com',
      'https://juejin.cn',
      'https://www.zhihu.com'
    ];
    
    for (const url of testUrls) {
      console.log(`\n📍 测试网站: ${url}`);
      
      try {
        // 导航
        const navigateResult = await toolSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { 
            url: url,
            timeout: 10000,
            waitUntil: 'domcontentloaded'
          }
        );
        
        if (!navigateResult.success) {
          console.log(`❌ 导航失败: ${navigateResult.error}`);
          continue;
        }
        
        const navData = navigateResult.data?.data || navigateResult.data;
        console.log(`✅ 导航成功 - 状态码: ${navData?.statusCode}`);
        
        if (navData?.statusCode && navData.statusCode !== 200) {
          console.log(`⚠️  非200状态码: ${navData.statusCode} - ${navData.title}`);
          continue;
        }
        
        // 等待加载
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 提取数据
        console.log('📊 提取页面数据...');
        const extractResult = await toolSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.EXTRACT,
          {
            selectors: {
              title: 'title',
              main_heading: 'h1',
              headings: 'h1, h2, h3',
              paragraphs: 'p',
              links: 'a',
              content_area: 'main, .content, #content, .main-content'
            },
            options: {
              timeout: 8000,
              multiple: true,
              extractType: 'text'
            }
          }
        );
        
        if (extractResult.success && extractResult.data?.data?.results) {
          console.log('🎉 数据提取成功!');
          
          const results = extractResult.data.data.results;
          const metadata = extractResult.data.data.metadata;
          
          console.log(`\n📄 页面信息 (${url}):`);
          console.log(`  标题: ${metadata.pageInfo.title}`);
          console.log(`  总元素数: ${metadata.totalElements}`);
          
          // 显示提取的主要内容
          Object.entries(results).forEach(([key, result]) => {
            if (result.success && result.elements && result.elements.length > 0) {
              console.log(`\n  ${key} (${result.elements.length}个):`);
              
              if (key === 'title' || key === 'main_heading') {
                // 标题类完整显示
                result.elements.slice(0, 1).forEach(element => {
                  console.log(`    ${element.text || 'N/A'}`);
                });
              } else {
                // 其他内容限制长度
                result.elements.slice(0, 3).forEach((element, index) => {
                  const text = element.text?.trim() || '';
                  if (text && text.length > 10) { // 过滤掉太短的文本
                    console.log(`    [${index + 1}] ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
                  }
                });
              }
            } else {
              console.log(`\n  ${key}: ${result.error || '未找到'}`);
            }
          });
          
          // 成功了就停止测试其他网站
          console.log(`\n🎉 成功抓取 ${url} 的数据!`);
          break;
          
        } else {
          console.log('❌ 数据提取失败');
        }
        
      } catch (error) {
        console.log(`❌ 处理 ${url} 时出错: ${error.message}`);
      }
      
      // 间隔一下
      await new Promise(resolve => setTimeout(resolve, 1000));
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

scrapeAlternativeWebsite().catch(console.error);
