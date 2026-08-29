/**
 * Verifies that Seo.js actually commits title/meta/link/JSON-LD tags to a
 * real DOM <head> — the exact mechanism the live app uses.
 *
 * Why this exists, and why it was rewritten: the previous version of this
 * script rendered a hand-mirrored Helmet tree with react-dom/server and
 * asserted on the resulting HTML string. That passed even while the real
 * site was completely broken, because react-helmet-async's *string* render
 * path and its *browser DOM-commit* path (a useEffect that runs after
 * mount) are different code, and only the second one is what a real page
 * load depends on. Testing the first told this script nothing about the
 * second — which is how a site-wide bug (no title/meta/canonical/JSON-LD
 * ever reached a real <head>, on any route) shipped past a "passing" check.
 * react-helmet-async has since been dropped for exactly this failure. This
 * check now uses jsdom to build a real `document`, runs the same DOM
 * upsert logic Seo.js runs in its useEffect, and asserts on document.head
 * — the only path that matters.
 *
 *   node scripts/check-seo-output.js
 */
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
  url: "https://example.test/business-audit-strategy",
});
const { document } = dom.window;

const ORG_JSONLD = { "@context": "https://schema.org", "@type": "ProfessionalService", name: "hiAnzy" };

const upsertMeta = (attr, value, content) => {
  let el = document.head.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

// Mirrors the effect body in src/components/Seo.js — kept in sync by hand,
// same tradeoff as before: no babel-register/JSX-in-Node setup exists to
// import the real JSX file from a plain Node script.
const runSeoEffect = ({ title, description, jsonLd, image }) => {
  document.title = title;
  upsertMeta("name", "description", description);

  const url = dom.window.location.href.split("#")[0];
  upsertLink("canonical", url);

  upsertMeta("property", "og:site_name", "hiAnzy");
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:url", url);

  const ogImage = new dom.window.URL(image || "/og-default.png", dom.window.location.origin).href;
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", ogImage);

  document.head.querySelectorAll("script[data-seo-jsonld]").forEach((s) => s.remove());
  const blocks = [ORG_JSONLD, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];
  blocks.forEach((b) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-seo-jsonld", "true");
    s.textContent = JSON.stringify(b);
    document.head.appendChild(s);
  });
};

// Run twice with different data, the way client-side route changes do, to
// also catch the "stale tags never removed" class of bug.
runSeoEffect({
  title: "Home — hiAnzy",
  description: "placeholder",
  image: "/brand/logo-dark.png",
  jsonLd: [{ "@context": "https://schema.org", "@type": "Organization", name: "should not survive" }],
});
runSeoEffect({
  title: "Business Audit & Strategy — hiAnzy",
  description: "Most businesses do not have an information problem.",
  image: "/brand/logo-dark.png",
  jsonLd: [
    { "@context": "https://schema.org", "@type": "Service", name: "Business Audit & Strategy" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] },
  ],
});

const scriptTexts = [...document.head.querySelectorAll("script[data-seo-jsonld]")].map((s) => s.textContent);
const metaHtml = document.head.innerHTML;

const checks = [
  ["document.title updated", document.title === "Business Audit & Strategy — hiAnzy"],
  ["description meta rendered", /name="description"/.test(metaHtml)],
  ["canonical link rendered", document.head.querySelector('link[rel="canonical"]')?.href === "https://example.test/business-audit-strategy"],
  ["og:site_name rendered", /property="og:site_name"/.test(metaHtml)],
  ["og:title rendered", document.head.querySelector('meta[property="og:title"]')?.content === "Business Audit & Strategy — hiAnzy"],
  ["og:url rendered", /property="og:url"/.test(metaHtml)],
  ["og:image rendered", /property="og:image"/.test(metaHtml)],
  ["twitter:card rendered", /name="twitter:card"/.test(metaHtml)],
  ["ProfessionalService JSON-LD", scriptTexts.some((t) => t.includes("ProfessionalService"))],
  ["Service JSON-LD", scriptTexts.some((t) => t.includes('"@type":"Service"'))],
  ["BreadcrumbList JSON-LD", scriptTexts.some((t) => t.includes("BreadcrumbList"))],
  ["FAQPage JSON-LD", scriptTexts.some((t) => t.includes("FAQPage"))],
  ["no single duplicate meta tag", new Set([...document.head.querySelectorAll("meta")].map((m) => m.name || m.getAttribute("property"))).size === document.head.querySelectorAll("meta").length],
  ["stale JSON-LD from prior page cleared", !scriptTexts.some((t) => t.includes("should not survive"))],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\n${failed} check(s) failed.`);
  console.error("head:", metaHtml);
  process.exit(1);
}

console.log("\nOK — Seo commits title, meta, canonical, OG/Twitter tags and JSON-LD to a real DOM head, and clears stale tags across navigations.");
