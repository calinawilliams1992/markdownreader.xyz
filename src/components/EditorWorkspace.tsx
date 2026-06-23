import type { Locale, OutlineItem, ViewMode } from "../types";
import { MarkdownViewport } from "./MarkdownViewport";

interface EditorWorkspaceProps {
  mode: ViewMode;
  markdown: string;
  outline: OutlineItem[];
  activeHeading?: string;
  locale: Locale;
  onChange: (markdown: string) => void;
  onActiveHeading: (id: string) => void;
}

const copy = {
  en: {
    editTitle: "Structured Edit",
    previewTitle: "Live Preview",
    sourceTitle: "Source Code"
  },
  zh: {
    editTitle: "结构编辑",
    previewTitle: "即时预览",
    sourceTitle: "字节级源码"
  }
};

export function EditorWorkspace({ mode, markdown, outline, activeHeading, locale, onChange, onActiveHeading }: EditorWorkspaceProps) {
  const text = copy[locale];

  if (mode === "read") {
    return (
      <div className="reader-card">
        <MarkdownViewport markdown={markdown} outline={outline} activeHeading={activeHeading} locale={locale} onActiveHeading={onActiveHeading} />
      </div>
    );
  }

  if (mode === "edit") {
    return (
      <div className="edit-grid">
        <section className="editor-pane" aria-label={text.editTitle}>
          <div className="pane-title">{text.editTitle}</div>
          <textarea value={markdown} onChange={(event) => onChange(event.target.value)} spellCheck={false} />
        </section>
        <section className="preview-pane" aria-label={text.previewTitle}>
          <div className="pane-title">{text.previewTitle}</div>
          <div className="preview-scroll">
            <MarkdownViewport markdown={markdown} outline={outline} activeHeading={activeHeading} locale={locale} onActiveHeading={onActiveHeading} compact />
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className="source-pane" aria-label={text.sourceTitle}>
      <div className="pane-title">{text.sourceTitle}</div>
      <textarea value={markdown} onChange={(event) => onChange(event.target.value)} spellCheck={false} />
    </section>
  );
}
