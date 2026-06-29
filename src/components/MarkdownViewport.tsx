import React, { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { createHeadingSlugger, estimateReadingTime } from "../lib/markdown";
import type { Locale, OutlineItem } from "../types";
import { MermaidBlock } from "./MermaidBlock";

interface MarkdownViewportProps {
  markdown: string;
  outline: OutlineItem[];
  activeHeading?: string;
  onActiveHeading?: (id: string) => void;
  locale?: Locale;
  compact?: boolean;
}

export function MarkdownViewport({
  markdown,
  outline,
  activeHeading,
  onActiveHeading,
  locale = "en",
  compact = false
}: MarkdownViewportProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const reading = useMemo(() => estimateReadingTime(markdown), [markdown]);
  const slug = createHeadingSlugger();
  const meta = locale === "zh" ? { headings: "个标题", minutes: "分钟阅读" } : { headings: "headings", minutes: "min read" };

  useEffect(() => {
    if (!rootRef.current || !onActiveHeading) return;
    const headings = Array.from(rootRef.current.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id]"));
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) onActiveHeading(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 1] }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [markdown, onActiveHeading]);

  return (
    <article ref={rootRef} className={`markdown-body markdown-export-scope ${compact ? "is-compact" : ""}`}>
      {!compact ? (
        <div className="reader-meta">
          <span>
            {outline.length || 1} {meta.headings}
          </span>
          <span>
            {reading.minutes} {meta.minutes}
          </span>
          <span>CommonMark + GFM</span>
        </div>
      ) : null}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }], rehypeHighlight]}
        components={{
          h1: createHeading("h1", slug, activeHeading),
          h2: createHeading("h2", slug, activeHeading),
          h3: createHeading("h3", slug, activeHeading),
          h4: createHeading("h4", slug, activeHeading),
          code(props: any) {
            const { className, children, ...rest } = props;
            const content = String(children).replace(/\n$/, "");
            const language = /language-(\w+)/.exec(className || "")?.[1];
            if (language === "mermaid") return <MermaidBlock chart={content} />;
            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
          a(props) {
            return <a {...props} target="_blank" rel="noreferrer" />;
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}

function createHeading(tag: "h1" | "h2" | "h3" | "h4", slug: (text: string) => string, activeHeading?: string) {
  return function Heading({ children }: { children?: React.ReactNode }) {
    const text = textFromChildren(children);
    const id = slug(text);
    return React.createElement(
      tag,
      {
        id,
        className: activeHeading === id ? "heading-active" : undefined
      },
      children
    );
  };
}

function textFromChildren(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (React.isValidElement<{ children?: React.ReactNode }>(child)) return textFromChildren(child.props.children);
      return "";
    })
    .join("")
    .trim();
}
