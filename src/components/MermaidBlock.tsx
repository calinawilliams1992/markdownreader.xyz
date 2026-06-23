import { useEffect, useId, useState } from "react";

let mermaidConfigured = false;

interface MermaidBlockProps {
  chart: string;
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const id = `markdown-reader-mermaid-${reactId}-${Math.random().toString(36).slice(2)}`;

    loadMermaid()
      .then((mermaid) => mermaid.render(id, chart))
      .then((result) => {
        if (!cancelled) {
          setSvg(result.svg);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Mermaid 图表解析失败");
          setSvg("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <pre className="diagram-error">
        <code>{error}</code>
      </pre>
    );
  }

  return <div className="mermaid-frame" dangerouslySetInnerHTML={{ __html: svg }} />;
}

async function loadMermaid() {
  const module = await import("mermaid");
  const mermaid = module.default;
  if (!mermaidConfigured) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        primaryColor: "#fff7ed",
        primaryBorderColor: "#f3a04c",
        primaryTextColor: "#24201c",
        lineColor: "#b66c1a",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      }
    });
    mermaidConfigured = true;
  }
  return mermaid;
}
