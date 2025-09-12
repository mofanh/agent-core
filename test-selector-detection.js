/**
 * 测试选择器类型检测问题
 */
import { detectSelectorType, isValidXPathSelector, isValidCSSSelector } from './src/browser/utils/selector-utils.js';

// 测试有问题的选择器
const testSelectors = [
  '.title-article, #articleTitle, h1.title, .article-title',
  '.follow-nickName, .username, .author-name',
  '.article_content, .content, #content_views',
  'title',
  'h1',
  '.content',
  '#content_views'
];

console.log('🔍 测试选择器类型检测');

testSelectors.forEach(selector => {
  const detectedType = detectSelectorType(selector);
  const isXPath = isValidXPathSelector(selector);
  const isCSS = isValidCSSSelector(selector);
  
  console.log(`\n选择器: "${selector}"`);
  console.log(`  检测类型: ${detectedType}`);
  console.log(`  XPath验证: ${isXPath}`);
  console.log(`  CSS验证: ${isCSS}`);
  
  if (isXPath && selector.includes('.') && selector.includes(',')) {
    console.log(`  ⚠️  WARNING: CSS选择器被错误识别为XPath!`);
  }
});

console.log('\n🧪 验证具体的XPath和CSS特征:');
const xpathExamples = [
  '//div[@class="title"]',
  '/html/body/div',
  '//text()[contains(., "hello")]',
  'descendant::div'
];

const cssExamples = [
  '.class-name',
  '#id-name', 
  'div.class',
  'h1, h2, h3',
  'div > p',
  '[data-attribute]'
];

console.log('\nXPath示例:');
xpathExamples.forEach(selector => {
  console.log(`  "${selector}" -> ${detectSelectorType(selector)}`);
});

console.log('\nCSS示例:');
cssExamples.forEach(selector => {
  console.log(`  "${selector}" -> ${detectSelectorType(selector)}`);
});
