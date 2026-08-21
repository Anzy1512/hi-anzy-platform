import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "@/App.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LenisProvider, ScrollToTop } from "@/lib/motion";

const Home = lazy(() => import("@/pages/Home"));
const WhatWeDo = lazy(() => import("@/pages/WhatWeDo"));
const HowWeWork = lazy(() => import("@/pages/HowWeWork"));
const Work = lazy(() => import("@/pages/Work"));
const WorkDetail = lazy(() => import("@/pages/WorkDetail"));
const Network = lazy(() => import("@/pages/Network"));
const WhyHiAnzy = lazy(() => import("@/pages/WhyHiAnzy"));
const Insights = lazy(() => import("@/pages/Insights"));
const InsightDetail = lazy(() => import("@/pages/InsightDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const WhoWeWorkWith = lazy(() => import("@/pages/WhoWeWorkWith"));
const Resources = lazy(() => import("@/pages/Resources"));
const Collaborate = lazy(() => import("@/pages/Collaborate"));
const Careers = lazy(() => import("@/pages/Careers"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <LenisProvider>
      <ScrollToTop />
      <Nav />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/network" element={<Network />} />
          <Route path="/why-hi-anzy" element={<WhyHiAnzy />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/who-we-work-with" element={<WhoWeWorkWith />} />
          <Route path="/collaborate" element={<Collaborate />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </LenisProvider>
  );
}
