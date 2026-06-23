import { useState } from "react";
import { FileText, X } from "lucide-react";
import type { Locale } from "../types";

interface ImportPanelProps {
  open: boolean;
  locale: Locale;
  onClose: () => void;
  onUseText: (markdown: string, fileName?: string) => void;
}

const copy = {
  en: {
    title: "Import Markdown",
    placeholder: "# Paste Markdown text",
    textarea: "Paste Markdown text",
    read: "Read Text",
    close: "Close import panel"
  },
  zh: {
    title: "导入 Markdown",
    placeholder: "# 粘贴 Markdown 文本",
    textarea: "粘贴 Markdown 文本",
    read: "读取文本",
    close: "关闭导入面板"
  }
};

export function ImportPanel({ open, locale, onClose, onUseText }: ImportPanelProps) {
  const [value, setValue] = useState("");
  const text = copy[locale];

  if (!open) return null;

  return (
    <section className="import-panel panel" aria-label={text.title}>
      <textarea
        className="import-textarea"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={text.placeholder}
        aria-label={text.textarea}
      />
      <div className="import-actions">
        <button className="toolbar-button is-primary" type="button" disabled={!value.trim()} onClick={() => onUseText(value, "pasted-document.md")}>
          <FileText size={15} />
          {text.read}
        </button>
        <button className="icon-button" type="button" onClick={onClose} title={text.close}>
          <X size={16} />
        </button>
      </div>
    </section>
  );
}
