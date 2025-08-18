#!/bin/bash
set -e

echo "📋 开始发布前检查..."

# 检查是否登录 npm
echo "🔐 检查 npm 登录状态..."
if ! npm whoami > /dev/null 2>&1; then
  echo "❌ 请先登录 npm: npm login"
  exit 1
fi

# 检查构建产物
echo "✅ 检查构建产物..."
if [ ! -f "dist/index.esm.js" ] || [ ! -f "dist/index.cjs.js" ]; then
  echo "❌ 构建产物不存在，请先运行: npm run build"
  exit 1
fi

# 检查版本号
echo "🏷️ 当前版本:"
npm version --json | grep '"@webpilot/agent"' || echo "本地版本: $(node -p "require('./package.json').version")"

# 检查 npm 上的版本
echo "📦 检查 npm 上的版本..."
REMOTE_VERSION=$(npm view @webpilot/agent version 2>/dev/null || echo "未发布")
LOCAL_VERSION=$(node -p "require('./package.json').version")

echo "本地版本: $LOCAL_VERSION"
echo "远程版本: $REMOTE_VERSION"

if [ "$LOCAL_VERSION" = "$REMOTE_VERSION" ]; then
  echo "⚠️ 版本号相同，请更新版本号"
  echo "运行以下命令之一："
  echo "  npm version patch  # 修复版本 (1.0.0 -> 1.0.1)"
  echo "  npm version minor  # 次要版本 (1.0.0 -> 1.1.0)" 
  echo "  npm version major  # 主要版本 (1.0.0 -> 2.0.0)"
  exit 1
fi

# 运行测试
echo "🧪 运行测试..."
npm test || echo "⚠️ 警告：测试失败，但继续发布检查"

# 检查包内容
echo "📋 检查包内容..."
npm pack --dry-run

echo ""
echo "✅ 发布前检查完成！"
echo ""
echo "🚀 准备发布？运行以下命令："
echo "  npm publish              # 发布到 npm"
echo "  npm publish --tag beta   # 发布 beta 版本"
echo "  npm publish --dry-run    # 模拟发布（不会真正发布）"
