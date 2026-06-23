# Markdown Reader

[English](#english) | [中文](#中文)

![Markdown Reader interface](public/assets/markdown-reader-hero.jpg)

## English

Markdown Reader is a local-first online Markdown reader for opening, reading, editing, and exporting long `.md` documents. It runs in the browser, does not require file uploads by default, and supports smart outlines, GFM, KaTeX math, Mermaid diagrams, syntax highlighting, live preview, and multi-format export.

Live site: <https://www.markdownreader.xyz/>

### Features

- Open local `.md`, `.markdown`, and text files
- Import by drag and drop or pasted Markdown text
- Generate a smart outline for long documents
- Switch between Read, Edit, and Source modes
- Edit with a live rendered preview
- Render GFM, tables, task lists, highlighted code, KaTeX, and Mermaid
- Export to HTML, PDF, or clean Markdown
- English and Chinese UI with localized SEO pages
- Light and dark themes
- PWA icons, sitemap, robots, and structured data
- Includes a browser extension prototype for sending the current page to Markdown Reader

### Tech Stack

- React
- TypeScript
- Vite
- react-markdown
- remark-gfm / remark-math
- rehype-highlight / rehype-katex
- Mermaid
- DOMPurify
- Lucide React

### Local Development

Use Node.js `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev
```

The dev server runs at:

```text
http://127.0.0.1:5173/
```

### Build and Preview

```bash
npm run build
npm run preview
```

`npm run build` runs the TypeScript build, the Vite production build, and `scripts/render-static-seo.mjs` to generate static SEO pages.

### Routes

- `/`: English home page
- `/zh/`: Chinese home page
- `/app/`: English reader app
- `/zh/app/`: Chinese reader app

### Browser Extension

This repository includes a Manifest V3 browser extension prototype in `extension/`.

To load it locally:

1. Open the Chrome or Edge extensions page.
2. Enable developer mode.
3. Choose "Load unpacked".
4. Select the `extension` folder in this project.

### Project Structure

```text
.
├── extension/              # Browser extension prototype
├── public/                 # Favicons, PWA icons, robots, sitemap, static assets
├── scripts/                # Static SEO rendering script
├── src/
│   ├── components/         # Page and reader components
│   ├── data/               # Sample Markdown and SEO config
│   ├── lib/                # Markdown outline, reading time, and SEO helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.ts
```

### Troubleshooting

If you see `Cannot find native binding` on macOS, the native packages inside `node_modules` may not match the architecture of the Node.js runtime you are using. Reinstall dependencies:

```bash
rm -rf node_modules
npm install
npm run dev
```

### Privacy

Markdown Reader reads and renders files locally in the browser by default. File content is not automatically uploaded when you open, read, or edit a document; it only leaves your machine when you explicitly export, copy, or share it.

### License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 中文

Markdown Reader 是一个本地优先的在线 Markdown 阅读器，适合打开、阅读、编辑和导出长篇 `.md` 文档。它在浏览器中运行，默认不需要上传文件，支持智能大纲、GFM、KaTeX 数学公式、Mermaid 图表、代码高亮、实时预览和多格式导出。

线上地址：<https://www.markdownreader.xyz/>

### 主要功能

- 本地打开 `.md` / `.markdown` / 文本文档
- 拖拽导入或粘贴 Markdown 文本
- 自动生成文档大纲，方便阅读长文档
- 阅读、编辑、源码三种视图模式
- 编辑模式支持实时预览
- 支持 GFM、表格、任务列表、代码高亮、KaTeX 和 Mermaid
- 支持导出为 HTML、PDF 或纯净 Markdown
- 中英文界面与中英文 SEO 页面
- 明暗主题切换
- PWA 图标、站点地图、robots 和结构化数据
- 附带浏览器扩展原型，可把当前网页内容发送到 Markdown Reader

### 技术栈

- React
- TypeScript
- Vite
- react-markdown
- remark-gfm / remark-math
- rehype-highlight / rehype-katex
- Mermaid
- DOMPurify
- Lucide React

### 本地运行

请使用 Node.js `^20.19.0` 或 `>=22.12.0`。

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://127.0.0.1:5173/
```

### 构建与预览

```bash
npm run build
npm run preview
```

`npm run build` 会执行 TypeScript 构建、Vite 生产构建，并运行 `scripts/render-static-seo.mjs` 生成静态 SEO 页面。

### 路由

- `/`：英文首页
- `/zh/`：中文首页
- `/app/`：英文阅读器
- `/zh/app/`：中文阅读器

### 浏览器扩展

项目包含一个 Manifest V3 浏览器扩展原型，位于 `extension/`。

本地安装方式：

1. 打开 Chrome 或 Edge 的扩展管理页面。
2. 启用开发者模式。
3. 选择“加载已解压的扩展程序”。
4. 选择本项目中的 `extension` 文件夹。

### 项目结构

```text
.
├── extension/              # 浏览器扩展原型
├── public/                 # favicon、PWA 图标、robots、sitemap、静态资源
├── scripts/                # SEO 静态页面生成脚本
├── src/
│   ├── components/         # 页面和阅读器组件
│   ├── data/               # 示例 Markdown 和 SEO 配置
│   ├── lib/                # Markdown 大纲、阅读时间和 SEO 工具
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.ts
```

### 常见问题

如果在 macOS 上遇到类似 `Cannot find native binding` 的错误，通常是因为 `node_modules` 中安装的平台 native 依赖和当前 Node 运行架构不一致。可以重新安装依赖：

```bash
rm -rf node_modules
npm install
npm run dev
```

### 隐私说明

Markdown Reader 默认在浏览器本地读取和渲染文件。文件内容不会因为打开、阅读或编辑而自动上传到服务器；只有当你主动导出、复制或通过其他方式分享时，内容才会离开本机环境。

### License

本项目使用 MIT 许可证开源。详情请查看 [LICENSE](LICENSE)。
