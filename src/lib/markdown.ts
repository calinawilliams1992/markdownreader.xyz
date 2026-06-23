import type { OutlineItem } from "../types";

export function createHeadingSlugger() {
  const counts = new Map<string, number>();
  return (text: string) => {
    const fallback = "section";
    const base =
      text
        .toLowerCase()
        .trim()
        .replace(/[`*_~[\](){}<>#.!?:;"'，。！？：；、]/g, "")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || fallback;
    const next = (counts.get(base) ?? 0) + 1;
    counts.set(base, next);
    return next === 1 ? base : `${base}-${next}`;
  };
}

export function buildOutline(markdown: string): OutlineItem[] {
  const slug = createHeadingSlugger();
  const outline: OutlineItem[] = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = stripMarkdown(match[2]);
    outline.push({
      id: slug(text),
      text,
      depth: match[1].length
    });
  }

  return outline;
}

export function stripMarkdown(value: string) {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_~>#-]/g, "")
    .trim();
}

export function estimateReadingTime(markdown: string) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[#>*_~|[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cjk = plain.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const words = plain.replace(/[\u4e00-\u9fff]/g, "").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil((cjk / 450 + words / 220) || 1));
  return { minutes, words: words + Math.round(cjk / 2) };
}

export function getFirstReadableSentence(markdown: string) {
  const body = markdown
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith("#") && !line.startsWith("```") && !line.startsWith("|"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return body.split(/(?<=[。.!?？])\s*/)[0] || body.slice(0, 80);
}
