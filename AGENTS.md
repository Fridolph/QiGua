# QiGua · Agents Guide

> 项目协作规范，适用于 opencode 等 AI CLI 协作场景。

---

## 1. 这是什么项目

**QiGua（起卦）** 是一个零依赖的 Chrome MV3 浏览器插件，在工具栏弹窗中提供六十四卦快速查询。

核心功能：时间起卦、硬币起卦、名字起卦 → 查卦 → 展示卦象符号、卦名、上卦下卦、工程语义。

---

## 2. 技术约束

| 约束 | 说明 |
|------|------|
| **前端工程化** | pnpm monorepo + Vue 3 + Vite + TypeScript，`pnpm build` 产出插件文件 |
| **Manifest V3** | 使用 Chrome MV3 规范，Side Panel API 替代 popup |
| **Side Panel · Drawer 布局** | 工具栏图标点击 → 右侧滑出面板，380px 内容 + 60px 固定侧边栏 |
| **trigrams.ts 是唯一数据源** | 与 dao-commit 项目同源，修改卦象语义需同步两边 |
| **lunar-typescript** | 引入 [lunar-typescript](https://github.com/6tail/lunar-typescript)（MIT），通过 npm 管理，Vite bundle |
| **lightweight** | 不引入 UI 组件库，纯 CSS 变量 |

---

## 3. 项目结构

```
QiGua/
├── packages/
│   ├── chrome-extension/   ← Vue 3 + Vite 源码
│   │   ├── src/            ← Vue 组件 + handbook 模块 + 数据
│   │   ├── public/         ← manifest.json, background.js, icons/
│   │   ├── sidepanel.html  ← Side Panel 入口
│   │   ├── vite.config.ts
│   │   └── dist/           ← 构建产出（加载到 Chrome）
│   ├── web-app/            ← 未来：Web Page 应用
│   ├── miniapp/            ← 未来：小程序
│   ├── mobile/             ← 未来：Android/iOS
│   └── desktop/            ← 未来：桌面应用
├── pnpm-workspace.yaml
├── turbo.json
├── package.json            ← workspace root
├── AGENTS.md
├── README.md
└── LICENSE
```

---

## 4. 开发流程

### 修改代码
1. 修改 `packages/chrome-extension/src/` 下的文件
2. `pnpm build` 构建到 `dist/`
3. 打开 `chrome://extensions/`
4. 找到 QiGua，点击刷新图标

### 验证清单
- [ ] 工具栏图标点击 → 右侧滑出 Side Panel
- [ ] 时间 tab：自动显示当前时间起卦结果
- [ ] 硬币 tab：点击掷硬币后显示结果
- [ ] 名字 tab：输入文字后显示结果
- [ ] 三个 tab 展示的卦象格式一致（符号 + 卦名 + 上下卦 + 语义）
- [ ] 侧边栏布局不溢出（60px sidebar + 380px content）

### 提交规范
- 日常开发使用 Conventional Commit（`feat`/`fix`/`chore`/`refactor`）
- 使用中文写 commit message
- 格式：`type(scope): 简短描述`

---

## 5. 边界与限制

- **不做** 完整的命理解读——这是工程卦象手册，不是算命工具
- **不做** 历史记录持久化——当前 popup 关闭后状态不保留
- **不做** 梅花易数高级变卦——当前支持简单变卦（动爻翻转），不做互卦/错综复杂

---

## 6. AI 协作约定

- 改动范围严格限制在 `packages/chrome-extension/` 目录内
- 当改动涉及 trigrams.json 数据结构时，先确认 dao-commit 项目是否需要同步
- UI 改动需在 360px 宽度下验证不溢出
- 不加不必要的动画，保持轻量
