/**
 * Verifies that the Seo component actually emits a title, description and the
 * JSON-LD blocks it is handed.
 *
 * Why this exists: in a browser, react-helmet-async commits its head changes
 * inside requestAnimationFrame. Any automated check running against a browser
 * tab that is not compositing (a hidden pane, a background tab) sees an empty
 * <head> and reports "SEO is broken" — which looks identical to the real bug
 * and is not one. Rendering to a string sidesteps rAF entirely, so this can
 * tell the difference.
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

// Mirrors src/components/Seo.js
const Seo = ({ title, description, jsonLd }) => {
  const blocks = [ORG, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];
  return React.createElement(
    Helmet,
    null,
    React.createElement("title", null, title),
    React.createElement("meta", { name: "description", content: description }),
    React.createElement("meta", { property: "og:title", content: title }),
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
const scriptHtml = helmet.script.toString();

const checks = [
  ["title rendered", /Business Audit &amp; Strategy — hiAnzy|Business Audit & Strategy — hiAnzy/.test(titleHtml)],
  ["description meta rendered", /name="description"/.test(metaHtml)],
  ["og:title rendered", /property="og:title"/.test(metaHtml)],
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
  console.error("script:", scriptHtml.slice(0, 400));
  process.exit(1);
}

console.log("\nOK — Seo emits title, meta and all JSON-LD blocks.");
