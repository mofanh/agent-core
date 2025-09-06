/**
 * WebPilot 浏览器工具测试脚本
 * 在 webpilot 浏览器插件环境中测试 agent-core 的浏览器功能
 */

// 导入 agent-core 浏览器工具
import { 
  createBrowserToolSystem,
  BROWSER_TOOLS 
} from '@mofanh/agent-core';

/**
 * WebPilot 浏览器测试套件
 */
class WebPilotBrowserTester {
  constructor() {
    this.toolSystem = null;
    this.testResults = [];
  }

  /**
   * 初始化测试环境
   */
  async initialize() {
    try {
      // 在浏览器插件环境中，我们可以直接使用当前标签页
      this.toolSystem = createBrowserToolSystem({
        useCurrentTab: true, // webpilot特有选项：使用当前标签页
        headless: false,
        devtools: false
      });

      await this.toolSystem.initialize();
      console.log('🚀 WebPilot 浏览器测试环境初始化完成');
      return true;
    } catch (error) {
      console.error('❌ 测试环境初始化失败:', error);
      return false;
    }
  }

  /**
   * 运行完整测试套件
   */
  async runTests() {
    const tests = [
      { name: '页面导航测试', fn: this.testNavigation.bind(this) },
      { name: '内容提取测试', fn: this.testExtraction.bind(this) },
      { name: '元素交互测试', fn: this.testInteraction.bind(this) },
      { name: 'JavaScript执行测试', fn: this.testJavaScript.bind(this) },
      { name: '截图功能测试', fn: this.testScreenshot.bind(this) },
      { name: '工具链测试', fn: this.testToolChain.bind(this) }
    ];

    console.log('🧪 开始运行 WebPilot 浏览器工具测试');
    
    for (const test of tests) {
      try {
        console.log(`\n📋 运行测试: ${test.name}`);
        const result = await test.fn();
        this.testResults.push({
          name: test.name,
          success: true,
          result,
          duration: result.duration
        });
        console.log(`✅ ${test.name} - 通过 (${result.duration}ms)`);
      } catch (error) {
        this.testResults.push({
          name: test.name,
          success: false,
          error: error.message
        });
        console.error(`❌ ${test.name} - 失败:`, error.message);
      }
    }

    this.printSummary();
  }

  /**
   * 测试页面导航功能
   */
  async testNavigation() {
    const startTime = Date.now();
    
    // 测试导航到一个简单页面
    const result = await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.NAVIGATE, {
      url: 'https://httpbin.org/html',
      waitFor: 'h1',
      timeout: 10000
    });

    if (!result.success) {
      throw new Error(`导航失败: ${result.error}`);
    }

    return {
      duration: Date.now() - startTime,
      url: result.url,
      title: result.title
    };
  }

  /**
   * 测试内容提取功能
   */
  async testExtraction() {
    const startTime = Date.now();
    
    // 提取页面标题
    const titleResult = await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.EXTRACT, {
      selector: 'title',
      attribute: 'text'
    });

    // 提取所有链接
    const linksResult = await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.EXTRACT, {
      selector: 'a',
      attribute: 'href',
      multiple: true
    });

    if (!titleResult.success || !linksResult.success) {
      throw new Error('内容提取失败');
    }

    return {
      duration: Date.now() - startTime,
      title: titleResult.data,
      linkCount: Array.isArray(linksResult.data) ? linksResult.data.length : 0
    };
  }

  /**
   * 测试元素交互功能
   */
  async testInteraction() {
    const startTime = Date.now();
    
    // 导航到一个有表单的页面
    await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.NAVIGATE, {
      url: 'https://httpbin.org/forms/post',
      waitFor: 'form'
    });

    // 测试输入文本
    const typeResult = await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.TYPE, {
      selector: 'input[name="custname"]',
      text: 'WebPilot Test User'
    });

    // 测试点击
    const clickResult = await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.CLICK, {
      selector: 'input[type="submit"]'
    });

    if (!typeResult.success) {
      throw new Error(`文本输入失败: ${typeResult.error}`);
    }

    return {
      duration: Date.now() - startTime,
      typeSuccess: typeResult.success,
      clickSuccess: clickResult.success
    };
  }

  /**
   * 测试JavaScript执行功能
   */
  async testJavaScript() {
    const startTime = Date.now();
    
    const result = await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.EVALUATE, {
      code: `
        // 测试基本JavaScript执行
        const testData = {
          url: window.location.href,
          title: document.title,
          timestamp: Date.now(),
          userAgent: navigator.userAgent.substring(0, 50)
        };
        return testData;
      `
    });

    if (!result.success) {
      throw new Error(`JavaScript执行失败: ${result.error}`);
    }

    return {
      duration: Date.now() - startTime,
      data: result.data
    };
  }

  /**
   * 测试截图功能
   */
  async testScreenshot() {
    const startTime = Date.now();
    
    const result = await this.toolSystem.toolManager.executeTool(BROWSER_TOOLS.SCREENSHOT, {
      format: 'png',
      quality: 80,
      fullPage: false
    });

    if (!result.success) {
      throw new Error(`截图失败: ${result.error}`);
    }

    return {
      duration: Date.now() - startTime,
      imageSize: result.data ? result.data.length : 0,
      format: 'png'
    };
  }

  /**
   * 测试工具链功能
   */
  async testToolChain() {
    const startTime = Date.now();
    
    // 创建一个简单的工具链：导航 -> 提取 -> 截图
    const toolChain = this.toolSystem.toolChain;
    
    const chainResult = await toolChain.execute([
      {
        tool: BROWSER_TOOLS.NAVIGATE,
        args: { url: 'https://httpbin.org/html', waitFor: 'body' }
      },
      {
        tool: BROWSER_TOOLS.EXTRACT,
        args: { selector: 'h1', attribute: 'text' }
      },
      {
        tool: BROWSER_TOOLS.SCREENSHOT,
        args: { format: 'png', fullPage: false }
      }
    ]);

    if (!chainResult.success) {
      throw new Error(`工具链执行失败: ${chainResult.error}`);
    }

    return {
      duration: Date.now() - startTime,
      steps: chainResult.steps.length,
      success: chainResult.success
    };
  }

  /**
   * 打印测试摘要
   */
  printSummary() {
    const passed = this.testResults.filter(t => t.success).length;
    const total = this.testResults.length;
    
    console.log('\n📊 测试摘要');
    console.log('='.repeat(50));
    console.log(`总测试数: ${total}`);
    console.log(`通过: ${passed}`);
    console.log(`失败: ${total - passed}`);
    console.log(`成功率: ${(passed / total * 100).toFixed(1)}%`);
    
    if (passed === total) {
      console.log('🎉 所有测试通过！WebPilot 浏览器工具集成成功');
    } else {
      console.log('⚠️  部分测试失败，请检查详细信息');
    }

    // 返回结果供插件UI显示
    return {
      total,
      passed,
      failed: total - passed,
      successRate: passed / total,
      details: this.testResults
    };
  }

  /**
   * 清理资源
   */
  async cleanup() {
    if (this.toolSystem) {
      await this.toolSystem.cleanup();
    }
  }
}

// 导出给webpilot使用
export { WebPilotBrowserTester };

// 如果在浏览器环境中直接运行
if (typeof window !== 'undefined') {
  window.WebPilotBrowserTester = WebPilotBrowserTester;
  
  // 添加全局测试函数
  window.runWebPilotBrowserTests = async () => {
    const tester = new WebPilotBrowserTester();
    if (await tester.initialize()) {
      await tester.runTests();
      await tester.cleanup();
    }
  };
}
