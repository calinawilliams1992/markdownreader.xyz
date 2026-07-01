import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(root);
const distDir = join(projectRoot, "dist");
const seoData = JSON.parse(await readFile(join(projectRoot, "src/data/seo.json"), "utf8"));
const baseHtml = await readFile(join(distDir, "index.html"), "utf8");

for (const route of Object.values(seoData.routes)) {
  const html = renderRouteHtml(baseHtml, route);
  const outputPath = route.path === "/" ? join(distDir, "index.html") : join(distDir, route.path.slice(1), "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

function renderRouteHtml(html, route) {
  const cleaned = stripSeoTags(html).replace(/<html\s+lang="[^"]*"/i, `<html lang="${escapeAttribute(route.htmlLang)}"`);
  return cleaned.replace("</head>", `${buildSeoHead(route)}\n  </head>`);
}

function stripSeoTags(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>\s*/gi, "\n")
    .replace(
      /\s*<meta\b[^>]*(?:name|property)=["'](?:description|keywords|robots|og:title|og:description|og:image|og:image:width|og:image:height|og:image:type|og:image:alt|og:url|og:type|og:site_name|twitter:card|twitter:title|twitter:description|twitter:image|twitter:image:alt)["'][^>]*>\s*/gi,
      "\n"
    )
    .replace(/\s*<link\b[^>]*rel=["'](?:canonical|alternate)["'][^>]*>\s*/gi, "\n")
    .replace(/\s*<link\b(?=[^>]*rel=["']preload["'])(?=[^>]*as=["']image["'])[^>]*>\s*/gi, "\n")
    .replace(/\s*<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>\s*/gi, "\n");
}

function buildSeoHead(route) {
  const canonical = absoluteUrl(route.path);
  const ogImage = absoluteUrl(seoData.ogImagePath);
  const twitterImage = absoluteUrl(seoData.twitterImagePath || seoData.ogImagePath);
  const socialImageAlt = "Markdown Reader social preview showing the app interface, outline, local-first reading and export.";
  const lines = [
    `    <title>${escapeHtml(route.title)}</title>`,
    `    <meta name="description" content="${escapeAttribute(route.description)}" />`,
    `    <meta name="keywords" content="${escapeAttribute(route.keywords)}" />`,
    `    <meta name="robots" content="index, follow" />`,
    `    <link rel="canonical" href="${canonical}" />`,
    ...route.alternates.map((alternate) => `    <link rel="alternate" hreflang="${escapeAttribute(alternate.hreflang)}" href="${absoluteUrl(alternate.path)}" />`),
    route.preloadImagePath ? `    <link rel="preload" as="image" href="${escapeAttribute(route.preloadImagePath)}" data-seo-preload="true" />` : "",
    `    <meta property="og:title" content="${escapeAttribute(route.ogTitle)}" />`,
    `    <meta property="og:description" content="${escapeAttribute(route.ogDescription)}" />`,
    `    <meta property="og:image" content="${ogImage}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:type" content="image/png" />`,
    `    <meta property="og:image:alt" content="${escapeAttribute(socialImageAlt)}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:type" content="${escapeAttribute(route.ogType)}" />`,
    `    <meta property="og:site_name" content="${escapeAttribute(seoData.brandName)}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeAttribute(route.ogTitle)}" />`,
    `    <meta name="twitter:description" content="${escapeAttribute(route.ogDescription)}" />`,
    `    <meta name="twitter:image" content="${twitterImage}" />`,
    `    <meta name="twitter:image:alt" content="${escapeAttribute(socialImageAlt)}" />`,
    ...route.jsonLd.map((item, index) => `    <script type="application/ld+json" data-seo-json-ld="${index + 1}">${escapeScriptJson(item)}</script>`)
  ];

  return lines.filter(Boolean).join("\n");
}

function absoluteUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  if (path === "/") return `${seoData.siteUrl}/`;
  return `${seoData.siteUrl}${path}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function escapeScriptJson(value) {
  return JSON.stringify(value).replaceAll("</script", "<\\/script");
}
