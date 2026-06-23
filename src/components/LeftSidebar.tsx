import { ListTree } from "lucide-react";
import type { Locale, OutlineItem } from "../types";

interface LeftSidebarProps {
  locale: Locale;
  outline: OutlineItem[];
  activeHeading?: string;
}

const copy = {
  en: {
    outline: "Outline",
    emptyOutline: "No heading hierarchy found."
  },
  zh: {
    outline: "大纲",
    emptyOutline: "当前文档没有标题层级。"
  }
};

export function LeftSidebar({
  locale,
  outline,
  activeHeading
}: LeftSidebarProps) {
  const text = copy[locale];

  return (
    <aside className="left-panel panel">
      <div className="panel-heading">
        <ListTree size={15} />
        <span>{text.outline}</span>
      </div>

      <nav className="outline-list" aria-label={text.outline}>
        {outline.length ? (
          outline.map((item) => (
            <button
              key={item.id}
              className={`outline-item depth-${Math.min(item.depth, 4)} ${activeHeading === item.id ? "is-active" : ""}`}
              type="button"
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              {item.text}
            </button>
          ))
        ) : (
          <div className="empty-note">{text.emptyOutline}</div>
        )}
      </nav>
    </aside>
  );
}
