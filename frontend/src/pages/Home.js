import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { HalftoneStatic } from "@/components/three/HalftoneStatic";
import { PunRow } from "@/components/PunPop";
import { SectionConnector } from "@/components/SectionConnector";
import { PinnedSequence } from "@/components/PinnedSequence";
import { ProofStrip } from "@/components/ProofStrip";
import { useRevealObserver, useReducedMotion, webglAvailable, gsap, prefersReducedMotion } from "@/lib/motion";
import { track } from "@/lib/api";
import { METHOD_STAGES } from "@/data/content";

import { Hero } from "@/pages/home/Hero";
import { SomethingsOff } from "@/pages/home/SomethingsOff";
import { WhyHowNow } from "@/pages/home/WhyHowNow";
import { WhatWeDoGrid } from "@/pages/home/WhatWeDoGrid";
import { Diagnostic } from "@/pages/home/Diagnostic";
import { WorkPreview } from "@/pages/home/WorkPreview";
import { NetworkPreview } from "@/pages/home/NetworkPreview";
import { Trust } from "@/pages/home/Trust";
import { WhoWith } from "@/pages/home/WhoWith";
import { Closing } from "@/pages/home/Closing";

const HalftoneBackdrop = lazy(() => import("@/components/three/HalftoneBackdrop").then((m) => ({ default: m.HalftoneBackdrop })));

/* ================================ PAGE ================================ */
export default function Home() {
  const ref = useRevealObserver();
  const reduced = useReducedMotion();
  // Title/body/duration only — the full breakdown (inputs/outputs/pitfall)
  // lives at /how-we-work, which this teaser now links to explicitly instead
  // of restating it. PinnedSequence already renders inputs/outputs
  // conditionally, so simply not including them here is enough.
  const methodTeaserStages = useMemo(
    () => METHOD_STAGES.map(({ label, title, page, body, duration }) => ({ label, title, page, body, duration })),
    []
  );
  // Computed synchronously on first render, not after it: this state used to
  // start false and only flip in an effect, so the lazy `import()` for the
  // hero canvas — a 215KB chunk — did not even begin downloading until a
  // whole extra tick after mount. On desktop, where the WebGL check nearly
  // always passes, that tick was the entire visible delay between the page
  // appearing and the hero canvas showing up late behind it. Reading the same
  // two checks the effect already ran eagerly means the fetch starts in the
  // same tick as everything else on the page.
  const [show3d, setShow3d] = useState(() => !prefersReducedMotion() && webglAvailable());
  // Only re-evaluate when the motion preference actually changes. Without the
  // guard this fires once on mount too, and webglAvailable() builds a real
  // WebGL context to test with — a driver round-trip, repeated for an answer
  // the initialiser above already has.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setShow3d(!reduced && webglAvailable());
  }, [reduced]);

  // Gentle parallax on editorial artwork. Stays here, not in whichever
  // section renders the [data-parallax] element (currently just Diagnostic):
  // this queries ref.current's full subtree once, from the one outer div
  // every section renders inside, so it keeps working regardless of which
  // extracted section a future [data-parallax] attribute shows up in.
  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return undefined;
    const els = ref.current.querySelectorAll("[data-parallax]");
    const tweens = [];
    els.forEach((el) => {
      const amt = parseFloat(el.getAttribute("data-parallax")) || 14;
      tweens.push(
        gsap.fromTo(el, { y: amt }, { y: -amt, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } })
      );
    });
    return () => tweens.forEach((t) => { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} data-testid="home-page">
      {/* Deck-referenced halftone texture — minor 3JS motion backdrop */}
      {show3d ? (
        <Suspense fallback={<HalftoneStatic />}>
          <HalftoneBackdrop />
        </Suspense>
      ) : (
        <HalftoneStatic />
      )}
      <Seo
        title="hiAnzy | We Build Brand Operating Systems"
        description="hiAnzy is a Business Systems & Transformation Consultancy. We find what is disconnected in your business, figure out what belongs together and build the system around it. From ABC to ROI."
      />
      <Hero show3d={show3d} />
      <ProofStrip />
      <div className="container-page -mt-4 mb-4">
        <PunRow
          testId="pun-home-1"
          puns={[
            { text: "Loud is easy. Clear is rare.", rot: 2.5, variant: "orange" },
            { text: "Complexity is clarity, procrastinating.", rot: -1.8 },
            { text: "Alignment beats effort.", rot: 1.2, variant: "dark" },
          ]}
        />
      </div>
      <SomethingsOff />
      <SectionConnector variant="right" label="SYMPTOM → QUESTION" testId="connector-symptom-question" />
      <WhyHowNow />
      <div className="container-page -mt-2 mb-6">
        <PunRow
          testId="pun-home-2"
          puns={[
            { text: "Strategy is spellcheck for ambition.", rot: -2, variant: "dark" },
            { text: "Opinions are cheap. Systems compound.", rot: 1.6 },
            { text: "A brand is a promise with receipts.", rot: -1.2, variant: "orange" },
          ]}
        />
      </div>
      <WhatWeDoGrid />
      {/* The method used to be explained twice back-to-back here: a compact
          MethodSection (deleted) immediately followed by this same
          PinnedSequence, both reading METHOD_STAGES — that duplication was
          fixed within Home.js itself. It turned out /how-we-work
          independently re-explains the same five stages at the same depth
          (and one field further: it also carries `pitfall`, "where this
          usually goes wrong", which this teaser never showed anyway) — so
          PinnedSequence here now gets a stripped-down `steps` array
          (title/body/duration only; inputs/outputs dropped) rather than the
          full METHOD_STAGES, and leads into an explicit link to the fuller
          page instead of silently restating everything it says. */}
      <SectionConnector variant="left" label="CAPABILITY → METHOD" testId="connector-capability-method" />
      <PinnedSequence
        kicker="THE SEQUENCE"
        title={<>One system, five moves.<br />In this order, on purpose.</>}
        testId="home-pinned-method"
        steps={methodTeaserStages}
      />
      <div className="bg-[#1D2424] pb-10 pt-2 lg:pb-14">
        <p className="container-page flex justify-center">
          <Link to="/how-we-work" onClick={() => track("method_explored", { from: "home_pinned_sequence" })} className="link-draw inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#F7F5EE]" data-testid="home-method-full-link">
            See the full breakdown, stage by stage <ArrowRight size={14} />
          </Link>
        </p>
      </div>
      <Diagnostic />
      <SectionConnector variant="centre" label="METHOD → PROOF" testId="connector-method-proof" />
      <WorkPreview />
      <div className="container-page -mt-2 mb-6">
        <PunRow
          testId="pun-home-3"
          puns={[
            { text: "ROI: Return On Intention.", rot: 1.5 },
            { text: "If it only works when you're watching, it doesn't work.", rot: -2.2, variant: "dark" },
            { text: "Growth without a system is expensive noise.", rot: 1.9, variant: "orange" },
          ]}
        />
      </div>
      <NetworkPreview show3d={show3d} />
      <Trust />
      <WhoWith />
      <Closing />
    </div>
  );
}
