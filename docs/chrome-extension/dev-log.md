# 从零搭一个 Chrome 起卦插件：技术选型、踩坑与复盘

> 一枚浏览器右边滑出来的小面板——点一下图标，时间、硬币、名字三种方式起卦，翻出卦名、卦象、体用生克、变卦，即查即走。这是我给自己写的一个 Chrome 侧边栏插件。这篇文章记录整个开发过程、关键决策和踩过的坑。

---

## 一、起初的想法

我一直想做一个"随手可查"的六十四卦手册。不是算命工具，而是工程卦象手册——每卦有对应的工程语义（比如「乾为天 → 创始 Init → 新项目启动、架构搭建」），起卦后能快速看到体用生克和变卦。

最初的想法很简单：一个 Chrome 弹窗，纯 HTML + CSS + JS，零依赖，打开就能用。

但做着做着发现，这条路走到一定程度就走不下去了。

---

## 二、从"零依赖"到"前端工程化"

### 第一版：纯 HTML 的原型

刚开始确实做了一版纯 HTML 的——`popup.html`、`popup.js`、`popup.css` 三个文件搞定。三种起卦算法（时间、硬币、名字）写在 `handbook.js` 里，64 卦数据和 2400+ 汉字笔画映射分别放在两个 JSON 文件里，用 `fetch` 异步加载。

这个版本能跑，但问题很快暴露出来：

1. **农历转换不能将就**。时间起卦要求农历，用公历月日近似算出来的结果，在立春前后会有一天的误差。我折腾了一下午，最后决定引入专业的农历库。
2. **代码复用性差**。后续要做 Web App、小程序、桌面端，纯 HTML 的逻辑拆不出去。
3. **UI 修改效率低**。改一个字体大小要在 CSS 里翻半天，没有组件化。

### 转向 Vue 3 + Vite + TypeScript

决定工程化之后，选了这套技术栈：

| 工具 | 用途 |
|------|------|
| pnpm workspace | monorepo 管理，后续多端扩展 |
| Vue 3 + Composition API | 组件化 UI |
| Vite | 构建工具，原生 TS 支持 |
| TypeScript | 类型安全，尤其是八卦五行数据结构 |
| lunar-typescript | 农历库，npm 管理，Vite bundle |
| turbo | 构建编排 |
| oxlint + oxfmt | 轻量级 lint 和格式化 |

整个项目结构变成了 monorepo：

```
QiGua/
├── packages/
│   └── chrome-extension/   ← Vue 源码 + Vite 构建
│       ├── src/
│       │   ├── handbook/   ← 起卦算法（纯逻辑，后续可抽 shared 包）
│       │   ├── data/       ← 64 卦 + 笔画数据
│       │   └── components/ ← Vue 组件
│       └── dist/           ← 构建产物 → 直接加载到 Chrome
```

### 关键决策：Side Panel 替代 Popup

Chrome MV3 提供了 Side Panel API（Chrome 114+），工具栏图标点击后从浏览器右侧滑出一个固定面板。比传统 popup 好在：

- **不随点击关闭**。popup 点了其他地方就消失，side panel 可以保持打开
- **宽度可控**。popup 有 800x600 限制且不灵活，side panel 宽度可以拖拽调整
- **更适合展示结果**。卦象结果需要一定的空间，380px 内容区 + 60px 侧边栏，刚好

只需一个轻量的 `background.js`：

```javascript
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
```

---

## 三、三种起卦算法

### 时间起卦（梅花易数）

这是最复杂的一个，核心是用农历时间取数：

```
上卦 = (年支 + 月 + 日) mod 8，余 0 取 8（坤）
下卦 = (年支 + 月 + 日 + 时支) mod 8，余 0 取 8
动爻 = (年支 + 月 + 日 + 时支) mod 6，余 0 取 6
```

这里的**年支以立春为界、月数以节月为准、日数用农历日**，三个细节缺一不可。我用了 `lunar-typescript` 库（MIT 协议，300KB+），它提供了完整的农历转换、节气计算和干支推算：

```typescript
const solar = Solar.fromDate(new Date());
const lunar = solar.getLunar();

lunar.getYearZhiByLiChun();  // 年支（立春为界）
lunar.getMonthZhi();          // 月支（节月）
lunar.getDay();               // 农历日
```

### 硬币起卦

三枚铜钱掷六次，从下往上排。正正正 = 老阳(9)，正正反 = 少阴(8)，正反反 = 少阳(7)，反反反 = 老阴(6)。9 和 6 为变爻：

```typescript
const heads = t1 + t2 + t3;
if (heads === 3) value = 9;       // 老阳 → 变爻
else if (heads === 2) value = 8;  // 少阴
else if (heads === 1) value = 7;  // 少阳
else value = 6;                   // 老阴 → 变爻
```

六爻组成 binary string，查表得卦。变爻翻转后得到变卦。

UI 设计上，改成了**每次点一下出一爻**的交互，而不是一键出 6 爻——让用户有参与感。爻线用 SVG 绘制，阳线淡红、阴线淡蓝，老阳/老阴分别加深，一眼能看出哪些爻变了。

### 名字起卦

按简体汉字笔画数取模。内置了 2400+ 常用字的笔画映射，每个字拆分上下半，分别求和后 mod 8 得上下卦。输入限 4 个字，用米字格展示每字的笔画数。

---

## 四、体用生克：五行判定引擎

动爻所在决定体用：

- 动爻在 1-3 爻（下卦） → 体卦 = 上卦，用卦 = 下卦
- 动爻在 4-6 爻（上卦） → 体卦 = 下卦，用卦 = 上卦

八卦各有五行属性：乾兑金、离火、震巽木、坎水、艮坤土。体用五行比对后得出生克关系：

| 关系 | 判定 | 含义 |
|------|------|------|
| 用生体 | 吉 ✅ | 外事生助自身 |
| 体生用 | 耗 ⚠️ | 自身消耗于外 |
| 体克用 | 小吉 👍 | 自身克制外事 |
| 用克体 | 凶 ❌ | 外事克制自身 |
| 体用同 | 平 ⚖️ | 五行一致 |

变卦就是动爻翻转（阳 → 阴，阴 → 阳），查表得新卦。

---

## 五、踩坑记录

### 坑 1：ESM 下 `__dirname` 不可用

`vite.config.ts` 里用了 `__dirname`，在 ESM 模式下直接报错。修复：

```typescript
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
```

### 坑 2：`packageManager` 字段缺失导致 turbo 报错

turbo 2.x 要求 `package.json` 里有 `"packageManager": "pnpm@x.x.x"`，否则 `Missing 'packageManager' field`。而且版本号必须在镜像里存在——我写的 `10.9.3` 实际不存在，改为 `10.33.4` 才通过。

### 坑 3：pnpm 的 `onlyBuiltDependencies`

esbuild 和 sharp 都需要运行 postinstall 脚本，pnpm 默认不执行。需要显式声明：

```json
"pnpm": {
  "onlyBuiltDependencies": ["esbuild", "sharp"]
}
```

### 坑 4：Vite base 路径导致插件资源 404

默认 `base: '/'` 生成 `<script src="/assets/...">`，在 Chrome 插件里路径解析可能出问题。改为 `base: './'` 生成相对路径 `<script src="./assets/...">`。

### 坑 5：lunar-javascript 是 CommonJS 模块

最初手动下载了 `lunar.min.js`，发现它是 `module.exports = ...` 的 CommonJS 格式，浏览器不能直接用。后来通过 npm 安装 `lunar-typescript`，Vite 自动处理模块导入，丝滑。

---

## 六、Chrome 插件入门：原来没那么难

作为一个前端工程师，写 Chrome 插件其实比想象中简单很多。本质上，它就是一个**运行在浏览器里的迷你 Web 应用**，用你熟悉的 HTML + CSS + JS 就能搞定。下面是我这次开发中理解到的核心概念。

### 一个插件的最小骨架

Chrome 插件最核心的文件只有一个：`manifest.json`。它是插件的身份证，告诉 Chrome"我是谁、我能干什么、需要什么权限"。

```json
{
  "manifest_version": 3,
  "name": "我的插件",
  "version": "0.1",
  "action": {
    "default_popup": "popup.html"
  }
}
```

就这么四行，你就能在 Chrome 工具栏看到一个图标，点击后弹出一个 HTML 页面。这个 HTML 页面和你平时写的网页**完全一样**——可以写 CSS、引用 JS、用你熟悉的任何前端技术。

### 插件能做哪些事

Chrome 插件的能力比普通网页大得多，核心就几类：

**1. Popup（弹窗）** — 点击工具栏图标弹出的小窗口，最常用的入口。生命周期很短——打开时加载，关闭时销毁。适合"看一眼就走"的场景。

**2. Side Panel（侧边栏）** — Chrome 114 新增。从浏览器右侧滑出一个固定面板，不会随着点击其他地方而关闭。我的起卦插件用的就是这个，因为用户需要仔细看卦象结果。

**3. Content Script（内容脚本）** — 注入到当前网页里运行的 JS。可以用来修改页面 DOM、读取页面内容、和页面交互。比如广告拦截器、网页翻译插件就是靠这个。

**4. Service Worker（后台服务）** — 插件的后台进程，不依赖任何页面独立运行。可以用来处理定时任务、网络请求、消息中转。我的 Side Panel 就是用 Service Worker 来接管工具栏图标点击行为。

**5. Options Page（设置页）** — 右键插件图标 → "选项"打开的配置页面，适合放用户设置。

### 作为前端工程师，需要注意什么

**1. CSP 比你想象中严格。** Chrome 插件默认禁止 inline script 和 eval。你写的所有 JS 必须是外部文件（`<script src="...">`），不能用 `<script>alert(1)</script>` 这种内联写法。好消息是：用 Vite / Webpack 构建的项目天然满足这个要求。

**2. 路径要写相对路径。** 插件里所有资源（HTML、JS、CSS、图片）都在同一个根目录下，路径解析规则和普通网页略有不同。建议全部用相对路径（`./xxx`），避免绝对路径（`/xxx`）可能的解析问题。

**3. MV3 是唯一选择。** Manifest V2 已经不再接受新插件上架，所有新项目必须用 MV3。主要变化：Service Worker 替代 Background Page、声明式网络请求替代 webRequest、更严格的权限模型。

**4. 调试很方便。** 在 `chrome://extensions/` 页面，找到你的插件，点击"Service Worker"后面的链接可以打开后台的 DevTools。页面右键"检查"就能像普通网页一样调试。

**5. 
不需要上架也能用。** 开启开发者模式后，"加载已解压的扩展程序"可以直接加载本地文件夹作为插件。这意味着你可以用自己写的插件，不经过 Chrome Web Store。

### 我的开发流程

```
修改代码 → pnpm build → 打开 chrome://extensions/ → 刷新插件 → 测试
```

没有发布流程、没有审核等待、没有环境差异——改了就能看效果。这种即时反馈让开发体验非常舒服。

老实说，在真正动手之前，我一直觉得"浏览器插件开发"是个很硬核的事情，可能要看 Chrome 源码文档、要学 C++ 写 Native 扩展。结果发现就是一个 `manifest.json` 配上一个 HTML 页面——和我们日常写的前端项目没有本质区别。

---

## 七、复盘

### 做对了的

1. **农历库一步到位**。如果一开始用公历近似，后续再改会动到算法根基，所有测试结果都会变。一次投入，持续受益。
2. **把逻辑和数据从 UI 里拆出来**。`handbook/` 目录里的 TypeScript 模块是纯函数，不依赖 Vue，后续做 Web App 或小程序可以直接引用。
3. **Side Panel 的选择**。对于"查看结果"类的工具，侧边栏比 popup 体验好太多。
4. **数据用 TS 常量而不是 JSON fetch**。64 卦和笔画数据直接 `import`，TypeScript 有类型检查，构建时内联到 bundle，没有运行时加载开销。

### 可以更好的

1. **SVG 图标生成**。目前用 `sharp` 在构建时将 SVG 转为 PNG，增加了 30MB 的 node_modules。后续可以换成更轻量的方案，或者直接在 `background.js` 中用 OffscreenCanvas 动态生成图标。
2. **笔画库的覆盖率**。2400+ 字还不够，遇到生僻字会走 fallback 估算。后续需要补全到 GB2312 全套 6763 字。
3. **测试**。算法模块目前靠手工验证，应该加上单元测试。`vitest` 和 Vite 生态天然兼容，加进来成本很低。

### 后续

- 硬币起卦的掷爻动画过渡
- Web App、小程序、移动端多端复用

---

> 写这个小插件的初衷是「随手可查」，做下来发现最有价值的反而是把梅花易数的算法用代码严谨地实现了一遍。农历、节气、地支、五行——每一个细节都不能将就。如果你也想做类似的工具，建议先把数据层和算法层做扎实，UI 只是最后一层皮。

---

*2026 年 5 月 · 起卦 QiGua Chrome Extension 开发笔记*
