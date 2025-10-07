#!/bin/bash

# 测试优化后的 agent-cli-simple.js
# 使用 MCP 配置调用框架

# 加载 nvm 并切换到 Node.js 22.20.0
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "========================================"
echo "测试 agent-cli-simple with MCP"
echo "========================================"
echo ""

# 切换 Node.js 版本
echo "📦 切换 Node.js 版本到 22.20.0..."
nvm use 22.20.0
echo "✅ 当前 Node.js 版本: $(node -v)"
echo ""

# 1. 显示配置信息
echo "1️⃣ 显示配置信息"
echo "----------------------------------------"
node bin/agent-cli-simple.js config
echo ""

# 2. 使用 MCP 执行简单任务
echo "2️⃣ 使用 MCP 执行简单浏览任务"
echo "----------------------------------------"
node bin/agent-cli-simple.js exec "访问 https://course.rs/basic/trait/trait-object.html 并告诉我页面标题和主要内容" --max-iterations 100
echo ""

# 3. 使用 --no-mcp 强制使用内置工具
# echo "3️⃣ 使用 --no-mcp 强制使用内置浏览器工具"
# echo "----------------------------------------"
# node bin/agent-cli-simple.js exec "访问 https://www.baidu.com 并告诉我页面标题" --no-mcp --headless --max-iterations 2
# echo ""

echo "========================================"
echo "测试完成"
echo "========================================"
