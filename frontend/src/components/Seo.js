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

export const Seo = ({ title, description, jsonLd }) => {
  const blocks = [ORG_JSONLD, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
};
