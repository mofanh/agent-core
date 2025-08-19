# WebPilot Agent 包构建和发布指南

## 📦 完整的构建和发布流程

### 1. 项目结构

```
packages/webpilot-agent/
├── src/
│   ├── index.ts                 # 主入口文件
│   ├── core/
│   │   ├── agent.ts            # 核心 Agent 类
│   │   ├── types.ts            # 类型定义
│   │   ├── logger.ts           # 日志系统
│   │   ├── validator.ts        # 验证系统
│   │   ├── utils.ts            # 工具函数
│   │   └── factory.ts          # 工厂函数
├── dist/                        # 构建输出目录
├── examples/                    # 使用示例
├── scripts/                     # 构建脚本
├── package.json                 # 包配置
├── tsconfig.json               # TypeScript 配置
├── rollup.config.js            # 构建配置
├── .eslintrc.json              # ESLint 配置
└── README.md                   # 文档
```

### 2. 开发环境设置

```bash
# 1. 进入包目录
cd packages/webpilot-agent

# 2. 安装依赖
npm install

# 3. 开发模式（监听文件变化）
npm run build:watch

# 4. 运行示例
npm run dev
```

### 3. 构建流程

#### 方式一：快速构建
```bash
npm run build
```

#### 方式二：完整构建（推荐）
```bash
npm run build:full
```

完整构建包含：
- 🧹 清理旧构建
- 📦 安装依赖
- 🔍 代码检查 (ESLint)
- 🔧 类型检查 (TypeScript)
- 🏗️ 构建 (Rollup)
- ✅ 构建产物验证

#### 构建产物

构建完成后，`dist/` 目录包含：
- `index.esm.js` - ES 模块格式
- `index.cjs.js` - CommonJS 格式
- `index.d.ts` - TypeScript 类型定义
- `types/` - 详细类型定义文件

### 4. 发布前检查

```bash
# 运行发布前检查
npm run publish:check
```

检查内容：
- ✅ npm 登录状态
- 📋 构建产物完整性
- 🏷️ 版本号对比
- 🧪 测试运行
- 📦 包内容预览

### 5. 版本管理

```bash
# 修复版本 (1.0.0 -> 1.0.1)
npm run version:patch

# 次要版本 (1.0.0 -> 1.1.0)
npm run version:minor

# 主要版本 (1.0.0 -> 2.0.0)
npm run version:major
```

### 6. 发布到 npm

#### 发布正式版本
```bash
npm run publish:latest
```

#### 发布 Beta 版本
```bash
npm run publish:beta
```

#### 模拟发布（不会真正发布）
```bash
npm publish --dry-run
```

### 7. 完整发布流程示例

```bash
# 1. 进入项目目录
cd packages/webpilot-agent

# 2. 确保代码最新
git pull origin main

# 3. 完整构建
npm run build:full

# 4. 发布前检查
npm run publish:check

# 5. 更新版本号
npm run version:patch

# 6. 提交版本更新
git add .
git commit -m "chore: bump version to $(node -p "require('./package.json').version")"
git push origin main

# 7. 发布到 npm
npm run publish:latest

# 8. 创建 Git 标签
git tag v$(node -p "require('./package.json').version")
git push origin --tags
```

### 8. 使用已发布的包

#### 安装
```bash
npm install @webpilot/agent
```

#### 基本使用
```typescript
import { quickStart, AgentCore } from '@webpilot/agent';

// 快速开始
const result = await quickStart('basic', {
  task: 'analyze_page',
  target: 'https://example.com'
});

// 或手动创建
const agent = new AgentCore({
  llmProvider: {
    type: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  }
});
```

### 9. 故障排除

#### 构建失败
```bash
# 清理并重新构建
npm run clean
npm install
npm run build:full
```

#### 类型错误
```bash
# 只检查类型，不构建
npm run type-check
```

#### 发布权限问题
```bash
# 检查登录状态
npm whoami

# 重新登录
npm login

# 检查包权限
npm access list packages
```

#### 版本冲突
```bash
# 查看当前版本
npm version --json

# 查看远程版本
npm view @webpilot/agent version

# 手动设置版本
npm version 1.0.1 --no-git-tag-version
```

### 10. 开发建议

1. **代码质量**
   - 运行 `npm run lint` 检查代码风格
   - 运行 `npm run type-check` 检查类型
   - 遵循 TypeScript 最佳实践

2. **版本管理**
   - 使用语义化版本号
   - 修复问题时使用 patch 版本
   - 新功能时使用 minor 版本
   - 破坏性更改时使用 major 版本

3. **文档更新**
   - 更新 README.md
   - 更新 CHANGELOG.md
   - 更新代码注释

4. **测试**
   - 在发布前充分测试
   - 使用 `npm run dev` 测试示例代码
   - 验证在不同环境下的兼容性

### 11. 自动化发布（可选）

可以设置 GitHub Actions 自动发布：

```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: cd packages/webpilot-agent && npm ci
      - run: cd packages/webpilot-agent && npm run build:full
      - run: cd packages/webpilot-agent && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

这样每次推送版本标签时，就会自动构建和发布到 npm。
