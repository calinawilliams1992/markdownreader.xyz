import { ArrowRight, FileText, Globe2, Moon, Sun } from "lucide-react";
import type { Locale, ThemeMode } from "../types";

export type LegalPageKind = "privacy" | "terms";

interface LegalPageProps {
  locale: Locale;
  page: LegalPageKind;
  theme: ThemeMode;
  onThemeToggle: () => void;
}

interface LegalSectionCopy {
  title: string;
  body: string;
  items?: string[];
}

interface LegalDocumentCopy {
  kicker: string;
  title: string;
  intro: string;
  updated: string;
  cta: string;
  sections: LegalSectionCopy[];
}

interface FooterLinkCopy {
  label: string;
  href: string;
  external?: boolean;
}

interface LegalLocaleCopy {
  logoAlt: string;
  languageLabel: string;
  navCta: string;
  themeToggle: string;
  pages: Record<LegalPageKind, LegalDocumentCopy>;
  footer: {
    navLabel: string;
    rights: string;
    bottomLinks: FooterLinkCopy[];
  };
}

export function LegalPage({ locale, page, theme, onThemeToggle }: LegalPageProps) {
  const copy = legalCopy[locale];
  const pageCopy = copy.pages[page];
  const appHref = locale === "zh" ? "/zh/app/" : "/app/";
  const homeHref = locale === "zh" ? "/zh/" : "/";
  const enHref = page === "privacy" ? "/privacy/" : "/terms/";
  const zhHref = page === "privacy" ? "/zh/privacy/" : "/zh/terms/";
  const currentYear = new Date().getFullYear();

  return (
    <div className="home-page legal-page">
      <header className="home-nav">
        <a className="home-brand" href={homeHref} aria-label="Markdown Reader home">
          <span className="home-brand-mark">
            <img src="/assets/markdown-reader-logo-96.png" width="28" height="28" alt={copy.logoAlt} />
          </span>
          <strong>Markdown Reader</strong>
        </a>
        <div className="home-actions">
          <div className="home-lang-switcher" role="navigation" aria-label={copy.languageLabel}>
            <Globe2 size={15} />
            <a href={enHref} lang="en" aria-current={locale === "en" ? "page" : undefined}>
              EN
            </a>
            <span aria-hidden="true">|</span>
            <a href={zhHref} lang="zh" aria-current={locale === "zh" ? "page" : undefined}>
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

      <main className="legal-main">
        <section className="legal-hero">
          <p className="hero-kicker">{pageCopy.kicker}</p>
          <h1 id="legal-title">{pageCopy.title}</h1>
          <p>{pageCopy.intro}</p>
        </section>

        <article className="legal-content" aria-labelledby="legal-title">
          <div className="legal-meta">
            <FileText size={18} />
            <span>{pageCopy.updated}</span>
          </div>
          <div className="legal-section-list">
            {pageCopy.sections.map((section) => (
              <section key={section.title} className="legal-section">
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.items ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          <a className="home-button primary legal-return" href={appHref}>
            {pageCopy.cta}
            <ArrowRight size={17} />
          </a>
        </article>
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

const legalCopy: Record<Locale, LegalLocaleCopy> = {
  en: {
    logoAlt: "Markdown Reader logo",
    languageLabel: "Language switcher",
    navCta: "Launch Reader",
    themeToggle: "Toggle theme",
    pages: {
      privacy: {
        kicker: "Privacy",
        title: "Privacy Policy",
        intro: "Markdown Reader is built around local-first reading. This page explains what stays in your browser and what can leave it.",
        updated: "Last updated: June 29, 2026",
        cta: "Launch Reader",
        sections: [
          {
            title: "Local file processing",
            body: "When you open or paste Markdown in the web app, the document is processed in your browser. Markdown Reader does not require an account or upload your file to a Markdown Reader server for normal reading, editing or exporting."
          },
          {
            title: "Cookies and analytics",
            body: "The site may use essential browser storage for preferences such as theme choice. The public website currently includes Google Analytics to understand aggregate usage.",
            items: [
              "Analytics events are used for product measurement, not for reading the contents of your Markdown files.",
              "Your browser, extensions or privacy settings may block analytics scripts."
            ]
          },
          {
            title: "Export data flow",
            body: "Exports are created from the document currently rendered in your browser. PDF export uses the browser print dialog, HTML export creates a downloadable file, and Markdown export downloads the source text you are editing."
          },
          {
            title: "Browser extension prototype",
            body: "The repository includes an unpacked browser extension prototype. If you install it manually, it can read the active page only when you ask it to send that page into Markdown Reader."
          },
          {
            title: "Contact",
            body: "For privacy questions or deletion requests related to site analytics, contact calinawilliams1992@gmail.com."
          }
        ]
      },
      terms: {
        kicker: "Terms",
        title: "Terms of Use",
        intro: "These terms keep expectations clear for a free browser-based Markdown reading tool.",
        updated: "Last updated: June 29, 2026",
        cta: "Launch Reader",
        sections: [
          {
            title: "Using Markdown Reader",
            body: "You may use Markdown Reader to open, read, edit and export Markdown documents in your browser. You are responsible for the files you choose to open and the content you export."
          },
          {
            title: "Your content",
            body: "You keep ownership of your Markdown files and exported documents. Markdown Reader does not claim ownership of content you open, paste, edit or export."
          },
          {
            title: "Exports and compatibility",
            body: "Markdown rendering depends on browser behavior and supported syntax. Review exported PDF, HTML and Markdown files before sharing them in production or legal contexts."
          },
          {
            title: "Browser extension prototype",
            body: "The included extension is a prototype for manual installation from the repository. Use it only if you are comfortable with its permissions and source code."
          },
          {
            title: "Service changes",
            body: "Markdown Reader may change, pause or remove features as the product evolves. The project is provided without a guaranteed service level."
          },
          {
            title: "Contact",
            body: "Questions about these terms can be sent to calinawilliams1992@gmail.com."
          }
        ]
      }
    },
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
    languageLabel: "语言切换",
    navCta: "打开阅读器",
    themeToggle: "切换主题",
    pages: {
      privacy: {
        kicker: "隐私",
        title: "隐私政策",
        intro: "Markdown Reader 以本地优先阅读为核心。这里说明哪些内容留在浏览器中，哪些情况可能离开浏览器。",
        updated: "最后更新：2026 年 6 月 29 日",
        cta: "打开阅读器",
        sections: [
          {
            title: "本地文件处理",
            body: "当你在网页应用中打开或粘贴 Markdown 时，文档会在浏览器中处理。常规阅读、编辑和导出不需要账号，也不会把文件上传到 Markdown Reader 服务器。"
          },
          {
            title: "Cookie 和统计",
            body: "网站可能使用必要的浏览器存储来保存主题等偏好。当前公开网站包含 Google Analytics，用于了解整体访问情况。",
            items: [
              "统计事件用于产品度量，不用于读取你的 Markdown 文件内容。",
              "你的浏览器、扩展或隐私设置可能会阻止统计脚本。"
            ]
          },
          {
            title: "导出数据流",
            body: "导出基于当前浏览器中渲染的文档生成。PDF 导出使用浏览器打印对话框，HTML 导出生成可下载文件，Markdown 导出下载你正在编辑的源文本。"
          },
          {
            title: "浏览器扩展原型",
            body: "仓库中包含一个可手动安装的浏览器扩展原型。只有在你主动要求发送页面时，它才会读取当前活动页面并交给 Markdown Reader。"
          },
          {
            title: "联系",
            body: "如有隐私问题，或需要咨询网站统计相关删除请求，请联系 calinawilliams1992@gmail.com。"
          }
        ]
      },
      terms: {
        kicker: "条款",
        title: "使用条款",
        intro: "这些条款用于说明这款免费浏览器 Markdown 阅读工具的基本使用边界。",
        updated: "最后更新：2026 年 6 月 29 日",
        cta: "打开阅读器",
        sections: [
          {
            title: "使用 Markdown Reader",
            body: "你可以使用 Markdown Reader 在浏览器中打开、阅读、编辑和导出 Markdown 文档。你需要对自己选择打开的文件和导出的内容负责。"
          },
          {
            title: "你的内容",
            body: "你保留 Markdown 文件和导出文档的所有权。Markdown Reader 不会主张拥有你打开、粘贴、编辑或导出的内容。"
          },
          {
            title: "导出与兼容性",
            body: "Markdown 渲染会受到浏览器行为和语法支持范围影响。在生产或法律场景分享 PDF、HTML 或 Markdown 导出文件前，请自行检查结果。"
          },
          {
            title: "浏览器扩展原型",
            body: "仓库中的扩展是手动安装原型。请仅在你理解其权限和源代码的情况下使用。"
          },
          {
            title: "服务变化",
            body: "随着产品演进，Markdown Reader 可能调整、暂停或移除部分功能。本项目不承诺固定服务等级。"
          },
          {
            title: "联系",
            body: "关于这些条款的问题可以发送至 calinawilliams1992@gmail.com。"
          }
        ]
      }
    },
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
};
