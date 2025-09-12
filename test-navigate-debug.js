/**
 * 测试NavigateTool的导航功能
 */
import { createBrowserToolSystem, BROWSER_TOOLS } from './src/browser/index.js';

async function testNavigateTool() {
  console.log('🎯 测试NavigateTool导航功能');
  
  let toolSystem;
  try {
    toolSystem = await createBrowserToolSystem({
      security: 'relaxed'
    });
    
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 测试简单的导航
    const testUrls = [
      'https://httpbin.org/html',
      'https://example.com',
      'https://blog.csdn.net/xiaqiuguniang/article/details/115180237'
    ];
    
    for (const url of testUrls) {
      console.log(`\n📍 测试导航: ${url}`);
      
      try {
        const result = await toolSystem.toolManager.executeLocalTool(
          BROWSER_TOOLS.NAVIGATE,
          { 
            url: url, 
            timeout: 10000,
            waitUntil: 'domcontentloaded'  // 使用最基础的等待条件
          }
        );
        
        if (result.success) {
          console.log('✅ 导航成功');
          console.log('原始结果结构:', {
            hasData: !!result.data,
            dataKeys: result.data ? Object.keys(result.data) : 'null'
          });
          
          // 修正数据访问路径
          const navData = result.data?.data || result.data;
          console.log('导航数据:', {
            finalUrl: navData?.finalUrl,
            statusCode: navData?.statusCode,
            title: navData?.title
          });
          
          // 立即在同一个调用中检查页面，避免实例切换
          console.log('🔍 立即检查页面状态...');
          const immediateCheck = await toolSystem.toolManager.executeLocalTool(
            BROWSER_TOOLS.EXTRACT,
            { 
              selectors: 'title',
              options: { timeout: 2000 }
            }
          );
          
          if (immediateCheck.success && immediateCheck.data?.data?.metadata) {
            const metadata = immediateCheck.data.data.metadata;
            console.log('立即检查结果:', {
              url: metadata.pageInfo.url,
              title: metadata.pageInfo.title
            });
            
            if (metadata.pageInfo.url !== 'about:blank') {
              console.log('🎉 NavigateTool工作正常，问题在实例管理');
              break;
            } else {
              console.log('❌ 即使立即检查，页面也是about:blank');
            }
          } else {
            console.log('❌ 立即检查失败');
          }
        } else {
          console.log('❌ 导航失败:', result.error);
        }
      } catch (error) {
        console.log('❌ 导航异常:', error.message);
      }
      
      // 间隔一下避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error('❌ 测试异常:', error);
  } finally {
    if (toolSystem) {
      await toolSystem.cleanup();
      console.log('🧹 资源清理完成');
    }
  }
}

testNavigateTool().catch(console.error);
