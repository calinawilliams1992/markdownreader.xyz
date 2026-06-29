import type { Locale } from "../types";

export const sampleFileName = {
  en: "markdown-reader-rendering-report.md",
  zh: "markdown-reader-rendering-report-zh.md"
} satisfies Record<Locale, string>;

export const sampleMarkdown = {
  en: `# Markdown Reader Rendering Engine Research Report

## Executive Summary

Markdown Reader keeps standard Markdown as the single source file while adding readable typography, structural navigation, live preview and portable export. This sample document demonstrates the read, edit, source and export workflow.

## Market Context

Long Markdown documents are scattered across code repositories, research notes, meeting records and writing tools. People often copy the same content between windows, but different tools render layout, formulas, tables and code blocks inconsistently.

## Core Method

We build an end-to-end processing pipeline that turns raw Markdown into an adaptive visual document structure. The optimization target is:

$$
L(\\theta) = -\\sum_{i} \\log p(y_i \\mid x_i; \\theta) + \\lambda \\lVert \\theta \\rVert^2
$$

### Data Flow

\`\`\`mermaid
flowchart LR
  A[Markdown file] --> B[Parse AST]
  B --> C[Classify document]
  C --> D[Choose layout]
  D --> E[Render reading view]
  E --> F[Edit and source views]
  F --> G[HTML / PDF / Markdown export]
\`\`\`

### Model Selection

\`\`\`python
def render(md: str) -> str:
    ast = parse_markdown(md)
    preset = classify_document(ast)
    return apply_layout(ast, preset)
\`\`\`

| Module | Preferred Option | Acceptance Signal |
| --- | --- | --- |
| Markdown parsing | remark + GFM | Matches GitHub rendering |
| Math | KaTeX | Fast first-screen render |
| Diagrams | Mermaid | Common flowcharts stay readable |
| Export | HTML / PDF / Markdown | Content remains portable |

## Results

In the demo dataset, rendering fidelity reaches 98.6%, and round-trip consistency stays at 100%. The current version focuses on local reading, structural navigation, source editing and stable export.

> This is a blockquote. Markdown Reader preserves the original Markdown semantics while making the reading layer clearer.

## Conclusion

The Markdown Reader MVP should make single-document reading stable first, then expand toward desktop file-system support, annotation workflows and stricter round-trip test fixtures.
`,
  zh: `# Markdown Reader 渲染内核研究报告

## 摘要

Markdown Reader 将标准 Markdown 保持为唯一源文件，同时在阅读层提供版式增强、结构导航、即时预览和多格式导出。本文档用于演示阅读、编辑、源码和导出流程。

## 市场背景

大量长 Markdown 文档分散在代码仓库、研究资料、会议纪要和写作工具中。用户经常在不同窗口之间复制内容，但不同工具的排版、公式、表格和代码块呈现并不一致。

## 核心方法

我们构建一条端到端的数据处理管道，将原始 Markdown 文档转换为语义自适应的可视结构。优化目标如下：

$$
L(\\theta) = -\\sum_{i} \\log p(y_i \\mid x_i; \\theta) + \\lambda \\lVert \\theta \\rVert^2
$$

### 数据流

\`\`\`mermaid
flowchart LR
  A[Markdown 文件] --> B[解析 AST]
  B --> C[识别文档类型]
  C --> D[选择阅读版式]
  D --> E[渲染阅读视图]
  E --> F[编辑与源码视图]
  F --> G[HTML / PDF / Markdown 导出]
\`\`\`

### 模型选型

\`\`\`python
def render(md: str) -> str:
    ast = parse_markdown(md)
    preset = classify_document(ast)
    return apply_layout(ast, preset)
\`\`\`

| 模块 | 首选方案 | 验收指标 |
| --- | --- | --- |
| Markdown 解析 | remark + GFM | 与 GitHub 渲染一致 |
| 公式 | KaTeX | 首屏渲染快 |
| 图表 | Mermaid | 常见流程图可读 |
| 导出 | HTML / PDF / Markdown | 内容可移植 |

## 实验结果

在演示数据中，渲染保真度达到 98.6%，双向往返一致性保持 100%。当前版本聚焦本地阅读、结构导航、源码编辑和稳定导出。

> 这是一段引用内容。Markdown Reader 会保持原始 Markdown 语义，并在阅读层提供更清晰的呈现。

## 结论

Markdown Reader 的 MVP 需要先把单文档阅读体验做到稳定可靠，再逐步扩展桌面端文件系统能力、批注体系和更严格的 round-trip 测试语料。
`
} satisfies Record<Locale, string>;
