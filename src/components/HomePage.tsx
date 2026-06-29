import {
  ArrowRight,
  Braces,
  CheckCircle2,
  Download,
  FileText,
  Globe2,
  LockKeyhole,
  MessageSquareText,
  Moon,
  PanelLeft,
  ShieldCheck,
  Sun,
  UploadCloud
} from "lucide-react";
import type { ComponentType } from "react";
import type { Locale, ThemeMode } from "../types";

interface HomePageProps {
  locale: Locale;
  theme: ThemeMode;
  onThemeToggle: () => void;
}

export function HomePage({ locale, theme, onThemeToggle }: HomePageProps) {
  const copy = homeCopy[locale];
  const appHref = locale === "zh" ? "/zh/app/" : "/app/";
  const homeHref = locale === "zh" ? "/zh/" : "/";
  const currentYear = new Date().getFullYear();

  return (
    <div className="home-page">
      <header className="home-nav">
        <a className="home-brand" href={homeHref} aria-label="Markdown Reader home">
          <span className="home-brand-mark">
            <img src="/assets/markdown-reader-logo-96.png" width="28" height="28" alt={copy.logoAlt} />
          </span>
          <strong>Markdown Reader</strong>
        </a>
        <div className="home-actions">
          <div className="home-lang-switcher" role="navigation" aria-label="Language switcher">
            <Globe2 size={15} />
            <a href="/" lang="en" aria-current={locale === "en" ? "page" : undefined}>
              EN
            </a>
            <span aria-hidden="true">|</span>
            <a href="/zh/" lang="zh" aria-current={locale === "zh" ? "page" : undefined}>
              中文
            </a>
          </div>
          <button className="home-theme-toggle" type="button" onClick={onThemeToggle} aria-label={copy.themeToggle}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a className="home-nav-cta" href={appHref}>
            {copy.navCta}
          </a>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <p className="hero-kicker">{copy.hero.kicker}</p>
            <h1>{copy.hero.title}</h1>
            <p className="hero-subtitle">{copy.hero.body}</p>
            <div className="hero-actions">
              <a className="home-button primary" href={appHref}>
                {copy.hero.cta}
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <HeroVisual locale={locale} />
        </section>

        <section className="home-section product-section" id="product">
          <div className="product-copy">
            <div className="product-text">
              <h2>{copy.product.title}</h2>
              <p>{copy.product.body}</p>
            </div>
            <div className="feature-list">
              {copy.product.features.map((item) => (
                <FeatureLine key={item.title} icon={item.icon} title={item.title} body={item.body} />
              ))}
            </div>
          </div>
        </section>

        <section className="home-section workflow-section" id="workflow">
          <div className="section-intro">
            <h2>{copy.workflowTitle}</h2>
            <p>{copy.workflowBody}</p>
          </div>
          <div className="workflow-grid">
            {copy.workflows.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="workflow-card">
                  <Icon size={19} />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-section privacy-section" id="privacy">
          <div className="privacy-card">
            <h2>{copy.privacy.title}</h2>
            <p>{copy.privacy.body}</p>
          </div>
          <div className="privacy-points">
            {copy.privacy.points.map((item) => (
              <FeatureLine key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </section>

        <section className="home-final-cta" aria-labelledby="home-final-cta-title">
          <div className="final-cta-mark" aria-hidden="true">
            <FileText size={22} />
          </div>
          <h2 id="home-final-cta-title">{copy.finalCta.title}</h2>
          <p>{copy.finalCta.body}</p>
          <a className="home-button primary" href={appHref}>
            {copy.finalCta.cta}
            <ArrowRight size={17} />
          </a>
        </section>

        <section className="home-section faq-section" id="faq">
          <div className="section-intro compact">
            <h2>{copy.faqTitle}</h2>
            <p>{copy.faqBody}</p>
          </div>
          <div className="faq-list">
            {copy.faqs.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer" aria-label={copy.footer.navLabel}>
        <div className="footer-bottom">
          <p>{copy.footer.rights.replace("{year}", String(currentYear))}</p>
          <div className="footer-bottom-links">
            {copy.footer.bottomLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={"external" in link && link.external ? "_blank" : undefined}
                rel={"external" in link && link.external ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroVisual({ locale }: { locale: Locale }) {
  const alt =
    locale === "zh"
      ? "Markdown Reader Markdown 阅读器界面，包含文档正文、大纲和导出控件"
      : "Markdown Reader interface with rendered document, outline and export controls";
  return (
    <figure className="hero-media">
      <img src="/assets/markdown-reader-hero.jpg" width="1672" height="941" alt={alt} loading="eager" decoding="async" fetchPriority="high" />
    </figure>
  );
}

function FeatureLine({
  icon: Icon,
  title,
  body
}: {
  icon: ComponentType<{ size?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="feature-line">
      <Icon size={18} />
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}

const homeCopy = {
  en: {
    logoAlt: "Markdown Reader logo",
    navCta: "Launch Reader",
    themeToggle: "Toggle theme",
    hero: {
      kicker: "The Markdown Reader for Long Documents",
      title: "Read Every Markdown File Better",
      body: "Import any .md file with auto layout, smart outline, local editing and export. Your source stays intact.",
      cta: "Open Your First .md"
    },
    finalCta: {
      title: "Open a Markdown File in Seconds",
      body: "Start in the browser with a local file, then read, edit and export when the document is ready.",
      cta: "Try the Sample"
    },
    workflowTitle: "A Complete Path from Import to Export",
    workflowBody: "Move from raw Markdown to a readable document without migrating into a knowledge base.",
    workflows: [
      { title: "Import", body: "Drag in a .md file, paste a README, or start with the sample document.", icon: UploadCloud },
      { title: "Read", body: "Use generated outlines, readable typography, KaTeX formulas, Mermaid diagrams and highlighted code.", icon: PanelLeft },
      { title: "Edit", body: "Switch into a focused Markdown editing surface with a live rendered preview.", icon: MessageSquareText },
      { title: "Export", body: "Take the result as HTML, PDF or clean Markdown while keeping the original format portable.", icon: Download }
    ],
    product: {
      title: "Better Reading, Clean Source",
      body: "Markdown Reader improves the presentation layer while the Markdown file remains standard, portable and easy to version.",
      features: [
        { title: "One Source File", body: "Your Markdown is never converted to a proprietary format.", icon: FileText },
        { title: "Full Syntax Support", body: "Tables, code blocks, math and Mermaid diagrams render cleanly.", icon: Braces },
        { title: "Portable Output", body: "Export a polished document without locking it into Markdown Reader.", icon: Download }
      ]
    },
    privacy: {
      title: "Local-First, No Upload Required",
      body: "By default, documents are processed in your browser. Markdown Reader does not require an account to open and read files.",
      points: [
        { title: "Browser Local", body: "File content stays on your device during normal use.", icon: LockKeyhole },
        { title: "Explicit Export", body: "Changes leave the browser only when you export or copy them.", icon: ShieldCheck },
        { title: "No Account Needed", body: "Open the reader and start with a file or the sample document.", icon: CheckCircle2 }
      ]
    },
    faqTitle: "Frequently Asked Questions",
    faqBody: "Clear answers for people deciding whether Markdown Reader fits their document workflow.",
    faqs: [
      {
        q: "How is Markdown Reader different from a regular Markdown editor?",
        a: "Markdown Reader is a reader-first markdown reader. It renders any .md file as a clean web document while keeping the original file as the single source of truth."
      },
      {
        q: "Can I use Markdown Reader as a markdown viewer online without installing anything?",
        a: "Yes. Markdown Reader runs entirely in the browser at markdownreader.xyz, so you can open .md files instantly on any modern desktop browser."
      },
      {
        q: "Does Markdown Reader support KaTeX and Mermaid?",
        a: "Yes. Markdown Reader supports GFM tables, syntax-highlighted code, KaTeX formulas and Mermaid diagrams out of the box."
      },
      {
        q: "Is my file uploaded to the cloud?",
        a: "No. Markdown Reader is a local-first markdown reader; files are read in your browser and only leave the device when you explicitly export."
      },
      {
        q: "Can I export from Markdown Reader to PDF or HTML?",
        a: "Yes. Markdown Reader exports polished PDF and HTML, plus a clean Markdown copy if you need to share the source."
      },
      {
        q: "Is Markdown Reader a good Obsidian or Typora alternative?",
        a: "For reading long documents, yes. Obsidian is a knowledge base, Typora is a local editor, and Markdown Reader is for single-file reading plus export."
      },
      {
        q: "Does Markdown Reader work offline?",
        a: "Once loaded, Markdown Reader can open and render local .md files without a network connection."
      }
    ],
    footer: {
      navLabel: "Footer navigation",
      rights: "© 2024-{year} Markdown Reader. All Rights Reserved.",
      bottomLinks: [
        { label: "Privacy", href: "/privacy/" },
        { label: "Terms", href: "/terms/" },
        { label: "GitHub", href: "https://github.com/calinawilliams1992/markdownreader.xyz", external: true },
        { label: "Email", href: "mailto:calinawilliams1992@gmail.com" }
      ]
    }
  },
  zh: {
    logoAlt: "Markdown Reader 标志",
    navCta: "打开阅读器",
    themeToggle: "切换主题",
    hero: {
      kicker: "面向长文档的 Markdown 阅读器",
      title: "读好每一份 Markdown",
      body: "导入任意 .md，获得自动排版、智能大纲、本地编辑和多格式导出。源文件始终保持标准文本。",
      cta: "打开第一份 .md"
    },
    finalCta: {
      title: "打开文件，马上开始阅读",
      body: "在浏览器中处理本地 Markdown，读清楚后再编辑和导出。",
      cta: "试用示例文档"
    },
    workflowTitle: "从导入到导出的完整路径",
    workflowBody: "把原始 Markdown 变成清晰可读的文档，不需要迁移到知识库。",
    workflows: [
      { title: "导入", body: "拖入 .md 文件，粘贴 README，或从示例文档开始。", icon: UploadCloud },
      { title: "阅读", body: "使用自动大纲、清晰排版、KaTeX 公式、Mermaid 图表和代码高亮。", icon: PanelLeft },
      { title: "编辑", body: "切换到聚焦的 Markdown 编辑界面，并同步查看渲染预览。", icon: MessageSquareText },
      { title: "导出", body: "导出 HTML、PDF 或纯净 Markdown，保持内容可移植。", icon: Download }
    ],
    product: {
      title: "增强阅读，保留源码",
      body: "Markdown Reader 只增强呈现层。Markdown 文件仍然是标准文本、可版本管理、可随时带走。",
      features: [
        { title: "一份源文件", body: "不会把 Markdown 转成私有格式。", icon: FileText },
        { title: "完整语法", body: "表格、代码、公式和 Mermaid 图表都能清晰呈现。", icon: Braces },
        { title: "可移植导出", body: "导出整理后的文档，不被工具锁定。", icon: Download }
      ]
    },
    privacy: {
      title: "本地优先，无需上传",
      body: "默认在浏览器中处理文档。Markdown Reader 不要求登录，也不要求上传文件才能开始阅读。",
      points: [
        { title: "浏览器本地", body: "常规使用时，文件内容停留在你的设备上。", icon: LockKeyhole },
        { title: "明确导出", body: "只有导出或复制时，内容才会离开当前页面。", icon: ShieldCheck },
        { title: "无需账号", body: "打开阅读器，选择文件或示例文档即可开始。", icon: CheckCircle2 }
      ]
    },
    faqTitle: "常见问题",
    faqBody: "给第一次访问的用户一个明确判断：Markdown Reader 是否适合他们的文档工作流。",
    faqs: [
      {
        q: "Markdown Reader 和普通 Markdown 编辑器有什么区别？",
        a: "Markdown Reader 是一款以阅读为核心的 Markdown 阅读器，把 .md 文件渲染成整洁的网页文档，同时保持源文件不被改写。"
      },
      {
        q: "Markdown Reader 算在线 Markdown 阅读器吗？需要安装吗？",
        a: "是。Markdown Reader 是浏览器内运行的在线 Markdown 阅读器，访问 markdownreader.xyz 即可使用，无需安装任何客户端。"
      },
      {
        q: "这款 Markdown 阅读器支持哪些语法？",
        a: "Markdown Reader 原生支持 GFM、表格、代码高亮、KaTeX 数学公式与 Mermaid 图表。"
      },
      {
        q: "文件会被上传到云端吗？",
        a: "不会。Markdown Reader 是本地优先的 Markdown 阅读器，文件在浏览器内读取，只有在你主动导出时才离开本机。"
      },
      {
        q: "Markdown 阅读器能导出 PDF 或 HTML 吗？",
        a: "可以。Markdown Reader 支持导出排版良好的 PDF、HTML，以及一份干净的 Markdown 副本。"
      },
      {
        q: "可以替代 Obsidian 或 Typora 用来读长文档吗？",
        a: "适合用来读单篇长文档。Obsidian 是知识库，Typora 是本地编辑器，Markdown Reader 是单文件阅读加导出工具。"
      },
      {
        q: "Markdown 阅读器可以离线使用吗？",
        a: "页面加载完成后，这款 Markdown 阅读器可在无网络环境下打开并渲染本地 .md 文件。"
      }
    ],
    footer: {
      navLabel: "页脚导航",
      rights: "© 2024-{year} Markdown Reader. All Rights Reserved.",
      bottomLinks: [
        { label: "隐私", href: "/zh/privacy/" },
        { label: "条款", href: "/zh/terms/" },
        { label: "GitHub", href: "https://github.com/calinawilliams1992/markdownreader.xyz", external: true },
        { label: "邮箱", href: "mailto:calinawilliams1992@gmail.com" }
      ]
    }
  }
} satisfies Record<Locale, any>;
