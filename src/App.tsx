import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { FileWarning, X } from "lucide-react";
import { EditorWorkspace } from "./components/EditorWorkspace";
import { HomePage } from "./components/HomePage";
import { ImportPanel } from "./components/ImportPanel";
import { LeftSidebar } from "./components/LeftSidebar";
import { TopBar } from "./components/TopBar";
import { sampleFileName, sampleMarkdown } from "./data/sampleMarkdown";
import { buildOutline, estimateReadingTime } from "./lib/markdown";
import { useSeoMeta } from "./lib/seo";
import type { ExportChoice, Locale, SyncState, ThemeMode, ViewMode } from "./types";

const THEME_KEY = "markdown-reader.theme.v1";
export function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const locale: Locale = path.startsWith("/zh") ? "zh" : "en";
  const isReaderRoute = path === "/app" || path === "/zh/app" || window.location.hash.startsWith("#import=");
  const [theme, setTheme] = useState<ThemeMode>(() => readTheme());

  useSeoMeta(isReaderRoute ? "app" : "home", locale);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  if (!isReaderRoute) {
    return <HomePage locale={locale} theme={theme} onThemeToggle={toggleTheme} />;
  }

  return <ReaderApp locale={locale} theme={theme} onThemeToggle={toggleTheme} />;
}

function ReaderApp({
  locale,
  theme,
  onThemeToggle
}: {
  locale: Locale;
  theme: ThemeMode;
  onThemeToggle: () => void;
}) {
  const hashImport = readHashImport();
  const [markdown, setMarkdown] = useState(hashImport || sampleMarkdown[locale]);
  const [fileName, setFileName] = useState(hashImport ? "captured-page.md" : sampleFileName[locale]);
  const [mode, setMode] = useState<ViewMode>("read");
  const [syncState, setSyncState] = useState<SyncState>("clean");
  const [activeHeading, setActiveHeading] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pendingMode, setPendingMode] = useState<ViewMode | null>(null);

  const copy = readerCopy[locale];
  const outline = useMemo(() => buildOutline(markdown), [markdown]);
  const reading = useMemo(() => estimateReadingTime(markdown), [markdown]);
  const hasUnsavedEditChanges = mode === "edit" && syncState === "edited";

  useEffect(() => {
    const next = readHashImport();
    if (!next) return;
    setMarkdown(next);
    setFileName("captured-page.md");
    setSyncState("clean");
    window.history.replaceState(null, "", locale === "zh" ? "/zh/app/" : "/app/");
  }, [locale]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTextInput(event.target)) return;
      const command = event.metaKey || event.ctrlKey;
      if (event.key === "Escape") {
        setExportOpen(false);
        setSettingsOpen(false);
        setShortcutsOpen(false);
        setImportOpen(false);
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      if (command && event.key === "1") {
        event.preventDefault();
        requestModeChange("read");
      }
      if (command && event.key === "2") {
        event.preventDefault();
        requestModeChange("edit");
      }
      if (command && event.key === "3") {
        event.preventDefault();
        requestModeChange("source");
      }
      if (command && event.key.toLowerCase() === "o") {
        event.preventDefault();
        setImportOpen(true);
      }
      if (command && event.shiftKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        setExportOpen((open) => !open);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, syncState]);

  useEffect(() => {
    if (!hasUnsavedEditChanges) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
      return "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.onbeforeunload = handleBeforeUnload;
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (window.onbeforeunload === handleBeforeUnload) window.onbeforeunload = null;
    };
  }, [hasUnsavedEditChanges]);

  function updateMarkdown(next: string) {
    setMarkdown(next);
    setSyncState("edited");
  }

  function requestModeChange(nextMode: ViewMode) {
    if (nextMode === mode) return;
    if (hasUnsavedEditChanges) {
      setPendingMode(nextMode);
      setExportOpen(false);
      setSettingsOpen(false);
      setShortcutsOpen(false);
      setImportOpen(false);
      return;
    }
    setMode(nextMode);
  }

  function downloadMarkdown() {
    downloadBlob(fileName.endsWith(".md") ? fileName : `${baseName(fileName)}.md`, markdown, "text/markdown;charset=utf-8");
  }

  function saveAndLeaveEditMode() {
    if (!pendingMode) return;
    downloadMarkdown();
    setSyncState("clean");
    setMode(pendingMode);
    setPendingMode(null);
  }

  function leaveEditModeWithoutSaving() {
    if (!pendingMode) return;
    setMode(pendingMode);
    setPendingMode(null);
  }

  async function handleFileSelect(file: File) {
    const text = await file.text();
    setMarkdown(text);
    setFileName(file.name);
    setMode("read");
    setImportOpen(false);
    setSyncState("clean");
  }

  function handleUseText(text: string, nextFileName = "pasted-document.md") {
    setMarkdown(text);
    setFileName(nextFileName);
    setMode("read");
    setImportOpen(false);
    setSyncState("clean");
  }

  function handleUseSample() {
    handleUseText(sampleMarkdown[locale], sampleFileName[locale]);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFileSelect(file);
  }

  function handleExport(choice: ExportChoice["id"]) {
    setExportOpen(false);
    if (choice === "pdf") {
      window.print();
      return;
    }
    if (choice === "markdown") {
      downloadMarkdown();
      setSyncState("clean");
      return;
    }
    const article = document.querySelector(".markdown-export-scope")?.innerHTML || "";
    const clean = DOMPurify.sanitize(article);
    const html = buildExportHtml(clean, fileName, locale);
    downloadBlob(`${baseName(fileName)}.html`, html, "text/html;charset=utf-8");
  }

  return (
    <div
      className={`app-shell ${importOpen ? "has-import-panel" : ""} ${dragActive ? "is-dragging" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <TopBar
        fileName={fileName}
        mode={mode}
        exportOpen={exportOpen}
        theme={theme}
        locale={locale}
        onModeChange={requestModeChange}
        onFileSelect={handleFileSelect}
        onPasteClick={() => setImportOpen(true)}
        onSampleClick={handleUseSample}
        onToggleExport={() => setExportOpen((open) => !open)}
        onExport={handleExport}
        onShowShortcuts={() => setShortcutsOpen(true)}
        onToggleSettings={() => setSettingsOpen((open) => !open)}
        onThemeToggle={onThemeToggle}
      />

      {importOpen ? (
        <ImportPanel
          open={importOpen}
          locale={locale}
          onClose={() => setImportOpen(false)}
          onUseText={handleUseText}
        />
      ) : null}

      <main className="workspace-grid">
        <LeftSidebar locale={locale} outline={outline} activeHeading={activeHeading} />

        <section className={`content-column content-column-${mode}`}>
          <EditorWorkspace
            mode={mode}
            markdown={markdown}
            outline={outline}
            activeHeading={activeHeading}
            locale={locale}
            onChange={updateMarkdown}
            onActiveHeading={setActiveHeading}
          />
        </section>
      </main>

      <footer className="trust-footer" aria-label={copy.statusLabel}>
        <span>{syncState === "clean" ? copy.cleanStatus : copy.editedStatus}</span>
        <span>
          {reading.words.toLocaleString()} words, {reading.minutes} min read
        </span>
        <span>{copy.localStatus}</span>
      </footer>

      {settingsOpen ? <SettingsPanel locale={locale} theme={theme} onThemeToggle={onThemeToggle} onClose={() => setSettingsOpen(false)} /> : null}
      {shortcutsOpen ? <ShortcutsDialog locale={locale} onClose={() => setShortcutsOpen(false)} /> : null}
      {pendingMode ? (
        <UnsavedChangesDialog
          locale={locale}
          onSave={saveAndLeaveEditMode}
          onLeave={leaveEditModeWithoutSaving}
          onCancel={() => setPendingMode(null)}
        />
      ) : null}

      {dragActive ? (
        <div className="drop-overlay">
          <FileWarning size={24} />
          <span>{copy.dropFile}</span>
        </div>
      ) : null}
    </div>
  );
}

function UnsavedChangesDialog({
  locale,
  onSave,
  onLeave,
  onCancel
}: {
  locale: Locale;
  onSave: () => void;
  onLeave: () => void;
  onCancel: () => void;
}) {
  const copy = readerCopy[locale].unsaved;
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-panel unsaved-panel" role="alertdialog" aria-modal="true" aria-labelledby="unsaved-title" aria-describedby="unsaved-desc">
        <h2 id="unsaved-title">{copy.title}</h2>
        <p id="unsaved-desc">{copy.body}</p>
        <div className="unsaved-actions">
          <button className="toolbar-button" type="button" onClick={onCancel}>
            {copy.cancel}
          </button>
          <button className="toolbar-button" type="button" onClick={onLeave}>
            {copy.leave}
          </button>
          <button className="toolbar-button is-primary" type="button" onClick={onSave}>
            {copy.save}
          </button>
        </div>
      </section>
    </div>
  );
}

function ShortcutsDialog({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const copy = readerCopy[locale].shortcuts;
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label={copy.close}>
          <X size={16} />
        </button>
        <h2 id="shortcuts-title">{copy.title}</h2>
        <div className="shortcut-list">
          {copy.items.map((item) => (
            <div key={item.keys}>
              <kbd>{item.keys}</kbd>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SettingsPanel({
  locale,
  theme,
  onThemeToggle,
  onClose
}: {
  locale: Locale;
  theme: ThemeMode;
  onThemeToggle: () => void;
  onClose: () => void;
}) {
  const copy = readerCopy[locale].settings;
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label={copy.close}>
          <X size={16} />
        </button>
        <h2 id="settings-title">{copy.title}</h2>
        <div className="settings-row">
          <div>
            <strong>{copy.theme}</strong>
            <p>{copy.themeHelp}</p>
          </div>
          <button className="toolbar-button is-primary" type="button" onClick={onThemeToggle}>
            {theme === "dark" ? copy.light : copy.dark}
          </button>
        </div>
        <div className="settings-row">
          <div>
            <strong>{copy.language}</strong>
            <p>{copy.languageHelp}</p>
          </div>
          <div className="settings-links">
            <a href="/app/" lang="en">
              EN
            </a>
            <a href="/zh/app/" lang="zh">
              中文
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function readHashImport() {
  if (!window.location.hash.startsWith("#import=")) return "";
  try {
    return decodeURIComponent(window.location.hash.replace("#import=", ""));
  } catch {
    return "";
  }
}

function readTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function isTextInput(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
}

function baseName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "") || "markdown-reader-document";
}

function downloadBlob(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function buildExportHtml(article: string, fileName: string, locale: Locale) {
  return `<!doctype html>
<html lang="${locale === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(fileName)}</title>
  <style>
    body{margin:0;background:#f4f4f6;color:#25211e;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    main{max-width:860px;margin:40px auto;padding:42px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:14px}
    h1,h2,h3{letter-spacing:0;line-height:1.2} p,li{line-height:1.75} pre{overflow:auto;padding:16px;border-radius:10px;background:#f6f6f7}
    table{width:100%;border-collapse:collapse} td,th{border-bottom:1px solid rgba(0,0,0,.08);padding:10px;text-align:left}
    blockquote{border-left:3px solid #f3a04c;margin-left:0;padding-left:16px;color:#5f5750}
  </style>
</head>
<body><main>${article}</main></body>
</html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[char];
  });
}

const readerCopy = {
  en: {
    statusLabel: "Document status",
    cleanStatus: "Source intact",
    editedStatus: "Unsaved local edits",
    localStatus: "Local-first",
    dropFile: "Drop to open this Markdown file",
    unsaved: {
      title: "Save your edits?",
      body: "This Markdown has been changed in Edit mode. Export a Markdown copy before leaving, or continue without saving.",
      save: "Save and Leave",
      leave: "Continue Without Saving",
      cancel: "Keep Editing"
    },
    shortcuts: {
      title: "Keyboard Shortcuts",
      close: "Close shortcuts",
      items: [
        { keys: "Cmd/Ctrl + O", label: "Open paste panel" },
        { keys: "Cmd/Ctrl + 1", label: "Read mode" },
        { keys: "Cmd/Ctrl + 2", label: "Edit mode" },
        { keys: "Cmd/Ctrl + 3", label: "Source mode" },
        { keys: "Cmd/Ctrl + Shift + E", label: "Toggle export menu" },
        { keys: "?", label: "Show shortcuts" },
        { keys: "Esc", label: "Close panels" }
      ]
    },
    settings: {
      title: "Settings",
      close: "Close settings",
      theme: "Theme",
      themeHelp: "Switch between light and dark reading surfaces.",
      light: "Light",
      dark: "Dark",
      language: "Language",
      languageHelp: "Choose the interface route you want to use."
    }
  },
  zh: {
    statusLabel: "文档状态",
    cleanStatus: "源文件未修改",
    editedStatus: "本地编辑未导出",
    localStatus: "本地优先",
    dropFile: "松开即可读取 Markdown 文件",
    unsaved: {
      title: "保存编辑改动？",
      body: "当前 Markdown 已在编辑模式中修改。离开编辑模式前，你可以先导出 Markdown 文件，或者暂不保存并继续切换。",
      save: "保存并退出",
      leave: "暂不保存",
      cancel: "继续编辑"
    },
    shortcuts: {
      title: "键盘快捷键",
      close: "关闭快捷键",
      items: [
        { keys: "Cmd/Ctrl + O", label: "打开粘贴面板" },
        { keys: "Cmd/Ctrl + 1", label: "阅读模式" },
        { keys: "Cmd/Ctrl + 2", label: "编辑模式" },
        { keys: "Cmd/Ctrl + 3", label: "源码模式" },
        { keys: "Cmd/Ctrl + Shift + E", label: "切换导出菜单" },
        { keys: "?", label: "显示快捷键" },
        { keys: "Esc", label: "关闭面板" }
      ]
    },
    settings: {
      title: "设置",
      close: "关闭设置",
      theme: "主题",
      themeHelp: "切换浅色或深色阅读界面。",
      light: "浅色",
      dark: "深色",
      language: "语言",
      languageHelp: "选择你想使用的界面语言路径。"
    }
  }
} satisfies Record<Locale, any>;
