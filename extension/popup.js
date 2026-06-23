const appUrlInput = document.getElementById("app-url");
const statusEl = document.getElementById("status");

document.getElementById("capture-open").addEventListener("click", async () => {
  const markdown = await captureCurrentPage();
  if (!markdown) return;
  const appUrl = normalizeUrl(appUrlInput.value);
  const encoded = encodeURIComponent(markdown.slice(0, 12000));
  await navigator.clipboard.writeText(markdown);
  chrome.tabs.create({ url: `${appUrl}#import=${encoded}` });
  statusEl.textContent = "已打开 Markdown Reader，并同步复制完整内容。";
});

document.getElementById("capture-copy").addEventListener("click", async () => {
  const markdown = await captureCurrentPage();
  if (!markdown) return;
  await navigator.clipboard.writeText(markdown);
  statusEl.textContent = "Markdown 已复制，可直接粘贴到 Markdown Reader。";
});

async function captureCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    statusEl.textContent = "没有可抓取的活动标签页。";
    return "";
  }

  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: pageToMarkdown
  });

  return result?.result || "";
}

function pageToMarkdown() {
  const title = document.title || "Untitled Page";
  const url = location.href;
  const selected = window.getSelection()?.toString().trim();
  const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
    .slice(0, 12)
    .map((node) => `${"#".repeat(Number(node.tagName.slice(1)))} ${node.textContent.trim()}`)
    .filter(Boolean)
    .join("\n\n");
  const article = document.querySelector("article, main") || document.body;
  const text = (selected || article.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
  return `# ${title}\n\n> Source: ${url}\n\n${headings ? `${headings}\n\n` : ""}${text}`;
}

function normalizeUrl(value) {
  const fallback = "http://127.0.0.1:5173/";
  try {
    const url = new URL(value || fallback);
    return url.href;
  } catch {
    return fallback;
  }
}
