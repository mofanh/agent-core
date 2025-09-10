#!/usr/bin/env node
import puppeteer from 'puppeteer';

console.log('启动浏览器测试...');

try {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  console.log('浏览器启动成功');
  
  const page = await browser.newPage();
  console.log('页面创建成功');
  
  await page.goto('https://www.baidu.com', { waitUntil: 'networkidle0', timeout: 10000 });
  console.log('页面访问成功');
  
  const title = await page.title();
  console.log('页面标题:', title);
  
  await browser.close();
  console.log('浏览器关闭成功');
  
} catch (error) {
  console.error('浏览器测试失败:', error.message);
  process.exit(1);
}
