# QiGua · 起卦

> 一枚 Chrome 浏览器侧边栏里的易经手册——随手点开，时间起卦、掷硬币、写名字，三秒得卦，即查即走。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Chrome MV3](https://img.shields.io/badge/Chrome-MV3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/)

<p align="center">
  <img src="./packages/chrome-extension/public/icons/icon.svg" width="96" alt="QiGua Logo" />
</p>

---

## 这是什么

QiGua 是一个 Chrome 浏览器 Side Panel 插件。点击工具栏图标，浏览器右侧滑出面板，三种方式起卦：

| 方式 | 原理 | 操作 |
|------|------|------|
| 时间起卦 | 梅花易数 · 农历 + 节月 + 地支取数 | 点开即得，查看结果 |
| 硬币起卦 | 模拟三枚铜钱掷六次 | 逐次点击掷爻 |
| 名字起卦 | 简体汉字笔画数取模 | 输入名字后起卦 |

每种方式都能得到：**卦象符号、卦名、上卦/下卦、体用生克判定、变卦、工程语义**。

---

## 安装

### 方式一：开发者模式加载（推荐）

1. 下载本项目或克隆仓库

```bash
git clone https://github.com/Fridolph/QiGua.git
cd QiGua
pnpm install
pnpm build
```

2. 打开 Chrome，进入 [chrome://extensions/](chrome://extensions/)
3. 开启右上角「**开发者模式**」
4. 点击「**加载已解压的扩展程序**」
5. 选择 `packages/chrome-extension/dist/` 目录
6. 点击工具栏插件图标，右侧滑出起卦面板

### 方式二：从 GitHub Releases 安装

1. 前往 [Releases](https://github.com/Fridolph/QiGua/releases) 页面
2. 下载最新版本 `qigua-vX.X.X.zip`
3. 解压到本地文件夹
4. Chrome `chrome://extensions/` → 加载已解压 → 选择解压后的文件夹

---

## 使用

### 时间起卦

点击「时间起卦」卡片，右侧面板展示当前公历时间（精确到秒）、农历信息（年/月/日/时辰）和梅花易数计算公式。点击「查看结果」得出卦象。

### 硬币起卦

点击「硬币起卦」卡片，进入掷爻页面。每次点一下出一爻，六次成卦。爻线用 SVG 绘制，阳爻淡红、阴爻淡蓝，变爻加深。掷满六爻后点击「查看结果」。

### 名字起卦

点击「名字起卦」卡片，输入姓名（最多 4 个汉字），米字格展示每个字的笔画数。点击「起卦」得出卦象。

### 查看结果

结果页展示：
- **卦象符号** + **卦名**
- **上卦 / 下卦**（含五行属性）
- **体用生克**判定（吉/耗/小吉/凶/平 + 详细解读）
- **变卦**（动爻翻转后的新卦）
- **工程语义**（如「创始 Init → 新项目启动、架构搭建」）

---

## 技术架构

```
QiGua/
├── packages/
│   └── chrome-extension/          ← Vue 3 + Vite + TypeScript 源码
│       ├── src/
│       │   ├── handbook/          ← 起卦算法（纯逻辑，可跨端复用）
│       │   │   ├── time.ts        ← 时间起卦（农历库集成）
│       │   │   ├── coin.ts        ← 硬币起卦
│       │   │   ├── name.ts        ← 名字起卦（笔画查表）
│       │   │   ├── lookup.ts      ← 卦象查表
│       │   │   └── wuxing.ts      ← 体用生克判定
│       │   ├── data/              ← 数据模块
│       │   │   ├── trigrams.ts    ← 64 卦工程语义
│       │   │   └── strokes.ts     ← 2400+ 简体字笔画映射
│       │   └── components/        ← Vue UI 组件
│       ├── public/                ← 静态资源（manifest, icons）
│       ├── sidepanel.html         ← Side Panel 入口
│       └── dist/                  ← 构建产物（= Chrome 插件）
├── docs/
│   └── chrome-extension/          ← 开发文档与日志
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### 技术栈

| 工具 | 用途 |
|------|------|
| pnpm workspace | monorepo 包管理 |
| Vue 3 + Composition API | UI 框架 |
| Vite | 构建工具 |
| TypeScript | 类型安全 |
| lunar-typescript | 农历/节气/干支计算 |
| turbo | 构建编排 |
| oxlint + oxfmt | 代码检查 & 格式化 |

---

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 格式化
pnpm format

# 类型检查
pnpm typecheck
```

开发模式下，Vite 启动 `http://localhost:5173`，在浏览器中预览 UI。修改代码后 Chrome 插件需手动刷新（`chrome://extensions/` → 点击刷新图标）。

---

## 数据同源

本项目与 [Dao Commit](https://github.com/Fridolph/Dao-commit) 共享同一份 `trigrams.ts` 六十四卦工程语义数据。Dao Commit 用卦象做版本锚点，QiGua 把同一套数据做成随手可查的浏览器手册。修改卦象语义时，需确认是否需要同步两边。

---

## 路线图

以下为暂定规划，不代表承诺交付时间。

### v0.1（已完成）
- [x] 三种起卦方式（时间 / 硬币 / 名字）
- [x] 农历库集成（立春为年界，节月为月界）
- [x] 体用生克 + 变卦
- [x] Side Panel 右侧面板布局

### v0.2（计划中）
- [ ] 硬币掷爻动画过渡
- [ ] 笔画库补全至 GB2312 全套 6763 字
- [ ] 卦象详情页（含彖辞、象辞、爻辞）
- [ ] 算法单元测试覆盖

### v1.0（远期）
- [ ] 历史记录（本地存储，跨会话保留）
- [ ] Web App 版（移动端适配）
- [ ] 微信小程序版
- [ ] 桌面端（Tauri / Electron）

---

## License

[MIT](./LICENSE) © 2026 Fridolph
