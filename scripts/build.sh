#!/bin/bash
set -e

echo "🚀 开始构建 @webpilot/agent 包..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo "❌ 错误：请在 packages/webpilot-agent 目录下运行此脚本"
  exit 1
fi

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist
rm -rf node_modules/.cache

# 安装依赖
echo "📦 安装依赖..."
npm install

# 代码检查
echo "🔍 代码检查..."
npm run lint

# TypeScript 类型检查
echo "🔧 TypeScript 类型检查..."
npm run type-check

# 构建
echo "🏗️ 开始构建..."
npm run build

# 检查构建产物
echo "✅ 检查构建产物..."
if [ ! -f "dist/index.esm.js" ] || [ ! -f "dist/index.js" ]; then
  echo "❌ 构建失败：缺少构建产物"
  exit 1
fi

echo "📊 构建产物大小："
ls -lh dist/

echo "🎉 构建完成！"
echo ""
echo "📋 构建产物："
echo "  - dist/index.esm.js (ES 模块)"
echo "  - dist/index.js (CommonJS)"
echo "  - dist/index.d.ts (TypeScript 类型定义)"
echo ""
echo "🚀 准备发布？运行: npm run publish:check"
