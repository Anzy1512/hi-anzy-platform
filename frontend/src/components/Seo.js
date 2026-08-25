import React from "react";
import { Helmet } from "react-helmet-async";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "hiAnzy",
  description: "Business Systems & Transformation Consultancy. We build brand operating systems. From ABC to ROI.",
  slogan: "From ABC to ROI",
  knowsAbout: ["Business Systems Consulting", "Business Transformation", "Business Audit", "Brand Strategy", "Digital Transformation", "AI Automation Consulting", "E-commerce Consulting", "Growth Strategy", "Technology Advisory"],
};

/**
 * This app has no server-side render — the HTML nginx hands out is the same
 * static shell for every route, and only fills in per-page title/meta/schema
 * once JavaScript runs. Anything that reads raw HTML without executing JS
 * (link-preview bots on Slack/WhatsApp/LinkedIn, some SEO crawlers in their
 * default mode) previously saw an identical, generic page for all 49 routes.
 * Google's own render pass does execute JS and picks these up correctly, but
 * that is a second, delayed pass — it is not the same as being right the
 * first time. canonical/og:url/twitter:card close the correctness gap for
 * every JS-executing consumer; a real prerendered og:image per page is a
 * separate, larger piece of work (see the audit notes) and is deliberately
 * not faked here with a stretched wordmark.
 */
export const Seo = ({ title, description, jsonLd, image }) => {
  const blocks = [ORG_JSONLD, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];
  const url = typeof window !== "undefined" ? window.location.href.split("#")[0] : undefined;
  const ogImage = image
    ? new URL(image, typeof window !== "undefined" ? window.location.origin : undefined).href
    : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:site_name" content="hiAnzy" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
};
