#!/bin/bash

# MCP Server Wrapper Script
# 确保使用正确的 Node.js 版本运行 MCP 服务器

# 加载 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 切换到 Node.js 22.20.0
nvm use 22.20.0 > /dev/null 2>&1

# 执行传入的命令
exec "$@"
