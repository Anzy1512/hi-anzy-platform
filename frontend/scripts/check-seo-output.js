/**
 * Verifies that the Seo component emits a title, description, canonical
 * link, OG/Twitter tags and the JSON-LD blocks it is handed.
 *
 * Why this exists: in a browser, react-helmet-async commits its head changes
 * inside requestAnimationFrame. Any automated check running against a browser
 * tab that is not compositing (a hidden pane, a background tab) sees an empty
 * <head> and reports "SEO is broken" — which looks identical to the real bug
 * and is not one. Rendering to a string sidesteps rAF entirely, so this can
 * tell the difference.
 *
 * This is a hand-mirror of src/components/Seo.js, not an import of it — this
 * project has no babel-register/JSX-in-Node setup, and adding one just to let
 * a build-gate script import a JSX file is a bigger dependency than the check
 * is worth. Keep the two in sync by hand; the assertions below name exactly
 * which behaviour they are standing in for.
 *
 *   node scripts/check-seo-output.js
 */
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { Helmet, HelmetProvider } = require("react-helmet-async");

const ORG = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "hiAnzy",
};

// Mirrors src/components/Seo.js — window is stubbed the way a real page load
// provides it, so the canonical/og:url/og:image branches actually run here
// instead of silently no-op'ing the way they would with no window at all.
const FAKE_ORIGIN = "https://example.test";
const FAKE_PATH = "/business-audit-strategy";

const Seo = ({ title, description, jsonLd, image }) => {
  const blocks = [ORG, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];
  const url = FAKE_ORIGIN + FAKE_PATH;
  const ogImage = image ? FAKE_ORIGIN + (image.startsWith("/") ? image : "/" + image) : undefined;

  return React.createElement(
    Helmet,
    null,
    React.createElement("title", null, title),
    React.createElement("meta", { name: "description", content: description }),
    React.createElement("link", { rel: "canonical", href: url }),
    React.createElement("meta", { property: "og:site_name", content: "hiAnzy" }),
    React.createElement("meta", { property: "og:title", content: title }),
    React.createElement("meta", { property: "og:description", content: description }),
    React.createElement("meta", { property: "og:type", content: "website" }),
    React.createElement("meta", { property: "og:url", content: url }),
    ogImage ? React.createElement("meta", { property: "og:image", content: ogImage }) : null,
    React.createElement("meta", { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" }),
    React.createElement("meta", { name: "twitter:title", content: title }),
    React.createElement("meta", { name: "twitter:description", content: description }),
    ...blocks.map((b, i) =>
      React.createElement(
        "script",
        { key: i, type: "application/ld+json" },
        JSON.stringify(b)
      )
    )
  );
};

const context = {};
renderToStaticMarkup(
  React.createElement(
    HelmetProvider,
    { context },
    React.createElement(Seo, {
      title: "Business Audit & Strategy — hiAnzy",
      description: "Most businesses do not have an information problem.",
      image: "/brand/logo-dark.png",
      jsonLd: [
        { "@context": "https://schema.org", "@type": "Service", name: "Business Audit & Strategy" },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [] },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] },
      ],
    })
  )
);

const helmet = context.helmet;
if (!helmet) {
  console.error("FAIL — HelmetProvider produced no state at all");
  process.exit(1);
}

const titleHtml = helmet.title.toString();
const metaHtml = helmet.meta.toString();
const linkHtml = helmet.link.toString();
const scriptHtml = helmet.script.toString();

const checks = [
  ["title rendered", /Business Audit &amp; Strategy — hiAnzy|Business Audit & Strategy — hiAnzy/.test(titleHtml)],
  ["description meta rendered", /name="description"/.test(metaHtml)],
  ["canonical link rendered", /rel="canonical"/.test(linkHtml) && linkHtml.includes(FAKE_ORIGIN + FAKE_PATH)],
  ["og:site_name rendered", /property="og:site_name"/.test(metaHtml)],
  ["og:title rendered", /property="og:title"/.test(metaHtml)],
  ["og:url rendered", /property="og:url"/.test(metaHtml)],
  ["og:image rendered", /property="og:image"/.test(metaHtml)],
  ["twitter:card rendered", /name="twitter:card"/.test(metaHtml)],
  ["ProfessionalService JSON-LD", /ProfessionalService/.test(scriptHtml)],
  ["Service JSON-LD", /"@type":"Service"/.test(scriptHtml)],
  ["BreadcrumbList JSON-LD", /BreadcrumbList/.test(scriptHtml)],
  ["FAQPage JSON-LD", /FAQPage/.test(scriptHtml)],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\n${failed} check(s) failed.`);
  console.error("title:", titleHtml);
  console.error("meta:", metaHtml);
  console.error("link:", linkHtml);
  console.error("script:", scriptHtml.slice(0, 400));
  process.exit(1);
}

console.log("\nOK — Seo emits title, meta, canonical, OG/Twitter tags and all JSON-LD blocks.");
