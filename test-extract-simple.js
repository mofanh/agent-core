/**
 * 简单的ExtractTool功能测试
 */
import { createBrowserToolSystem, BROWSER_TOOLS } from './src/browser/index.js';

async function testExtractToolBasic() {
  console.log('🎯 开始简单ExtractTool测试');
  
  let toolSystem;
  try {
    // 创建浏览器工具系统
    toolSystem = await createBrowserToolSystem({
      security: 'relaxed'
    });
    
    console.log('✅ 浏览器工具系统初始化完成');
    
    // 1. 导航到一个最简单的HTML页面
    console.log('📍 步骤1: 导航到data: URL');
    const simpleHtml = 'data:text/html,<html><head><title>Simple Test</title></head><body><h1>Test Heading</h1><p>Test paragraph</p></body></html>';
    
    try {
      const navigateResult = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.NAVIGATE,
        { 
          url: simpleHtml,
          timeout: 5000
        }
      );
      
      console.log('导航结果:', navigateResult.success ? '✅成功' : '❌失败');
      
      if (!navigateResult.success) {
        console.log('导航错误:', navigateResult.error);
        throw new Error('导航失败');
      }
      
    } catch (error) {
      console.log('data: URL导航失败，尝试空页面测试');
      // 如果data: URL不工作，直接在空页面创建内容
    }
    
    // 等待一下确保页面加载完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. 尝试最简单的提取 - 获取页面标题
    console.log('📊 步骤2: 提取页面标题');
    
    try {
      const titleResult = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.EXTRACT,
        {
          selectors: 'title',
          timeout: 5000, // 缩短timeout
          waitForElements: false // 不等待元素
        }
      );
      
      console.log('标题提取结果:', JSON.stringify(titleResult, null, 2));
      
    } catch (error) {
      console.log('标题提取失败:', error.message);
    }
    
    // 3. 尝试提取body内容
    console.log('📊 步骤3: 提取body文本');
    
    try {
      const bodyResult = await toolSystem.toolManager.executeLocalTool(
        BROWSER_TOOLS.EXTRACT,
        {
          selectors: 'body',
          timeout: 5000,
          waitForElements: false
        }
      );
      
      console.log('Body提取结果:', JSON.stringify(bodyResult, null, 2));
      
    } catch (error) {
      console.log('Body提取失败:', error.message);
    }
    
    console.log('🎉 ExtractTool基本功能测试完成');
    
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
testExtractToolBasic().catch(console.error);
