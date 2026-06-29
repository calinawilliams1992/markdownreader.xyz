import { useEffect } from "react";
import seoData from "../data/seo.json";
import type { Locale } from "../types";

export type SeoPage = "home" | "app" | "privacy" | "terms";

interface AlternateLink {
  hreflang: string;
  path: string;
}

interface SeoRoute {
  page: SeoPage;
  locale: Locale;
  path: string;
  htmlLang: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  preloadImagePath?: string;
  alternates: AlternateLink[];
  jsonLd: unknown[];
}

const data = seoData as {
  siteUrl: string;
  brandName: string;
  ogImagePath: string;
  routes: Record<string, SeoRoute>;
};

export const SITE_URL = data.siteUrl;
export const BRAND_NAME = data.brandName;
export const OG_IMAGE_URL = absoluteUrl(data.ogImagePath);

export function getSeoRoute(page: SeoPage, locale: Locale) {
  return data.routes[`${page}.${locale}`];
}

export function canonicalUrl(route: SeoRoute) {
  return absoluteUrl(route.path);
}

export function useSeoMeta(page: SeoPage, locale: Locale) {
  const route = getSeoRoute(page, locale);

  useEffect(() => {
    if (!route) return;

    const canonical = canonicalUrl(route);
    document.documentElement.lang = route.htmlLang;
    document.title = route.title;

    setMeta("description", route.description);
    setMeta("keywords", route.keywords);
    setMeta("robots", "index, follow");
    setMeta("og:title", route.ogTitle, "property");
    setMeta("og:description", route.ogDescription, "property");
    setMeta("og:image", OG_IMAGE_URL, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:type", route.ogType, "property");
    setMeta("og:site_name", BRAND_NAME, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", route.ogTitle);
    setMeta("twitter:description", route.ogDescription);
    setMeta("twitter:image", OG_IMAGE_URL);

    setCanonical(canonical);
    setAlternates(route.alternates);
    setPreloadImage(route.preloadImagePath);
    setJsonLd(route.jsonLd);
  }, [route]);
}

function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  const selector = `meta[${attr}="${name}"]`;
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, name);
    document.head.appendChild(node);
  }
  node.content = content;
}

function setCanonical(href: string) {
  let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.appendChild(node);
  }
  node.href = href;
}

function setAlternates(alternates: AlternateLink[]) {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
  alternates.forEach((alternate) => {
    const node = document.createElement("link");
    node.rel = "alternate";
    node.hreflang = alternate.hreflang;
    node.href = absoluteUrl(alternate.path);
    document.head.appendChild(node);
  });
}

function setPreloadImage(path?: string) {
  document.head.querySelectorAll('link[rel="preload"][as="image"][data-seo-preload]').forEach((node) => node.remove());
  if (!path) return;

  const node = document.createElement("link");
  node.rel = "preload";
  node.as = "image";
  node.href = path;
  node.dataset.seoPreload = "true";
  document.head.appendChild(node);
}

function setJsonLd(items: unknown[]) {
  document.head.querySelectorAll('script[type="application/ld+json"][data-seo-json-ld]').forEach((node) => node.remove());

  items.forEach((item, index) => {
    const node = document.createElement("script");
    node.type = "application/ld+json";
    node.dataset.seoJsonLd = String(index + 1);
    node.textContent = JSON.stringify(item);
    document.head.appendChild(node);
  });
}
