import type { ReactNode } from "react";
import { BookOpen, ClipboardPaste, Code2, Download, FileText, FolderOpen, HelpCircle, Moon, PencilLine, Settings, Sun } from "lucide-react";
import type { ExportChoice, Locale, ThemeMode, ViewMode } from "../types";

interface TopBarProps {
  fileName: string;
  mode: ViewMode;
  exportOpen: boolean;
  theme: ThemeMode;
  locale: Locale;
  onModeChange: (mode: ViewMode) => void;
  onFileSelect: (file: File) => void;
  onPasteClick: () => void;
  onSampleClick: () => void;
  onToggleExport: () => void;
  onExport: (choice: ExportChoice["id"]) => void;
  onShowShortcuts: () => void;
  onToggleSettings: () => void;
  onThemeToggle: () => void;
}

const copy = {
  en: {
    read: "Read",
    edit: "Edit",
    source: "Source",
    open: "Open Markdown",
    paste: "Paste Markdown",
    sample: "Load Sample",
    shortcuts: "Keyboard shortcuts",
    settings: "Settings",
    theme: "Toggle theme",
    export: "Export",
    exportChoices: [
      { id: "html", label: "HTML" },
      { id: "pdf", label: "PDF" },
      { id: "markdown", label: "Markdown" }
    ] satisfies ExportChoice[]
  },
  zh: {
    read: "阅读",
    edit: "编辑",
    source: "源码",
    open: "打开 Markdown",
    paste: "粘贴 Markdown",
    sample: "载入示例",
    shortcuts: "键盘快捷键",
    settings: "设置",
    theme: "切换主题",
    export: "导出",
    exportChoices: [
      { id: "html", label: "HTML" },
      { id: "pdf", label: "PDF" },
      { id: "markdown", label: "纯净 Markdown" }
    ] satisfies ExportChoice[]
  }
};

export function TopBar({
  fileName,
  mode,
  exportOpen,
  theme,
  locale,
  onModeChange,
  onFileSelect,
  onPasteClick,
  onSampleClick,
  onToggleExport,
  onExport,
  onShowShortcuts,
  onToggleSettings,
  onThemeToggle
}: TopBarProps) {
  const text = copy[locale];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <a className="brand-lockup" href={locale === "zh" ? "/zh/" : "/"} aria-label="Markdown Reader home">
          <span className="brand-mark" aria-hidden="true">
            <img src="/assets/markdown-reader-logo-96.png" width="24" height="24" alt="" />
          </span>
          <span className="brand-name">Markdown Reader</span>
        </a>

        <div className="toolbar-group import-actions-top" aria-label={text.open}>
          <label className="toolbar-button file-action" title={`${text.open}: ${fileName}`} aria-label={`${text.open}: ${fileName}`}>
            <FolderOpen size={15} />
            <span className="action-label">{text.open}</span>
            <input
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) onFileSelect(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
          <button className="toolbar-button" type="button" onClick={onPasteClick} title={text.paste} aria-label={text.paste}>
            <ClipboardPaste size={15} />
            <span className="action-label">{text.paste}</span>
          </button>
          <button className="toolbar-button" type="button" onClick={onSampleClick} title={text.sample} aria-label={text.sample}>
            <FileText size={15} />
            <span className="action-label">{text.sample}</span>
          </button>
          <div className="export-menu">
            <button className="toolbar-button" type="button" onClick={onToggleExport} title={text.export} aria-label={text.export}>
              <Download size={15} />
              <span className="action-label">{text.export}</span>
            </button>
            {exportOpen ? (
              <div className="export-popover">
                {text.exportChoices.map((choice) => (
                  <button key={choice.id} type="button" onClick={() => onExport(choice.id)}>
                    {choice.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="toolbar-group mode-switcher" role="tablist" aria-label="View switcher">
        <ModeButton active={mode === "read"} icon={<BookOpen size={15} />} label={text.read} onClick={() => onModeChange("read")} />
        <ModeButton active={mode === "edit"} icon={<PencilLine size={15} />} label={text.edit} onClick={() => onModeChange("edit")} />
        <ModeButton active={mode === "source"} icon={<Code2 size={15} />} label={text.source} onClick={() => onModeChange("source")} />
      </div>

      <div className="topbar-right">
        <button className="icon-button optional-control" type="button" onClick={onShowShortcuts} title={text.shortcuts}>
          <HelpCircle size={16} />
        </button>
        <button className="icon-button optional-control" type="button" onClick={onToggleSettings} title={text.settings}>
          <Settings size={16} />
        </button>
        <button className="icon-button optional-control" type="button" onClick={onThemeToggle} title={text.theme}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <nav className="app-lang-switcher" aria-label="Language">
          <a href="/app/" lang="en" aria-current={locale === "en" ? "page" : undefined}>
            EN
          </a>
          <a href="/zh/app/" lang="zh" aria-current={locale === "zh" ? "page" : undefined}>
            中文
          </a>
        </nav>
      </div>
    </header>
  );
}

function ModeButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className={`toolbar-button ${active ? "is-active" : ""}`} type="button" role="tab" aria-selected={active} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}
