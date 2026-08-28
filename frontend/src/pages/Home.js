import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MagneticButton } from "@/components/MagneticButton";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { RouteLine } from "@/components/RouteLine";
import { SystemCoreFallback, ConstellationFallback, ThreeSafe } from "@/components/three/Fallbacks";
import { HalftoneStatic } from "@/components/three/HalftoneStatic";
import { PunRow } from "@/components/PunPop";
import { SectionConnector } from "@/components/SectionConnector";
import { PinnedSequence } from "@/components/PinnedSequence";
import { PopIllustration } from "@/components/PopIllustration";
import { ProgressRule } from "@/components/ProgressRule";
import { SystemDiagnostic } from "@/components/SystemDiagnostic";
import { TouchpointTicker } from "@/components/TouchpointTicker";
import { FitQuadrant } from "@/components/FitQuadrant";
import { ProofStrip } from "@/components/ProofStrip";
import { useRevealObserver, useReducedMotion, webglAvailable, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { getCaseStudies, track } from "@/lib/api";
import {
  CATEGORIES, METHOD_STAGES, WHY_HOW_NOW, SOMETHINGS_OFF, DIAGNOSTIC_AREAS,
  DIAGNOSTIC_OUTCOMES, TRUST_PRINCIPLES, AUDIENCES, FILTER_LIST, NETWORK_CATEGORIES_HOME, NETWORK_SUBCATS,
} from "@/data/content";

const HalftoneBackdrop = lazy(() => import("@/components/three/HalftoneBackdrop").then((m) => ({ default: m.HalftoneBackdrop })));
const SystemCore = lazy(() => import("@/components/three/SystemCore"));
const Constellation = lazy(() => import("@/components/three/Constellation"));

/* ============================== S01 — HERO ============================== */
const Hero = ({ show3d }) => {
  const headRef = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion() || !headRef.current) return undefined;
    const spans = headRef.current.querySelectorAll(".hero-line > span");
    const tween = gsap.fromTo(
      spans,
      { yPercent: 105, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.15 }
    );
    return () => tween.kill();
  }, []);

  // The diagram underneath is only a placeholder once the canvas is actually
  // painting over it — the canvas itself has a transparent background (by
  // design, so it can sit on this panel in either theme), which means the
  // diagram would otherwise stay visible forever *through* it, doubled up
  // with whatever the scene draws.
  //
  // Driven by the canvas's own onCreated, not a timer. SystemCore is a lazy
  // chunk, so any guessed delay races its download: too short on a slow line
  // and the diagram fades out before there is anything behind it, leaving an
  // empty panel.
  const [coreReady, setCoreReady] = useState(false);
  useEffect(() => {
    if (!show3d) setCoreReady(false);
  }, [show3d]);
  const handleCoreReady = useCallback(() => setCoreReady(true), []);
  // A scene can fail well after its first frame — a GPU context lost when a
  // laptop sleeps, a driver crash. Bringing the diagram back is what keeps
  // that from leaving a blank panel for the rest of the session.
  const handleCoreFailed = useCallback(() => setCoreReady(false), []);

  return (
    <section className="relative container-page pb-10 pt-[124px] lg:pb-14 lg:pt-[148px]" data-testid="home-hero-section">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal as="p" className="font-display text-[clamp(0.82rem,1vw,1.06rem)] font-semibold uppercase leading-[1.1] tracking-[0.08em]" testId="hero-kicker">
            <span className="sticker-orange">From ABC to ROI</span>
          </Reveal>
          <h1 ref={headRef} className="font-display mt-6 leading-[0.93] tracking-[-0.025em] text-[#232A2A] text-[clamp(2.55rem,11.5vw,3.6rem)] lg:leading-[0.9] lg:text-[clamp(3.75rem,5.7vw,5.3rem)]" data-testid="hero-headline">
            <span className="hero-line"><span>We Build Brand</span></span>
            <span className="hero-line">
              <span className="relative inline-block">
                Operating <span className="hl-marker">Systems</span><span className="accent-signal-text">.</span>
                <RouteLine d="M2,10 C 30,2 70,16 118,6" viewBox="0 0 120 14" strokeWidth={5} className="absolute -bottom-2 left-0 h-[14px] w-[70%]" start="top 95%" end="top 60%" />
              </span>
            </span>
          </h1>
          <Reveal delay={160}>
            <p className="font-editorial mt-7 max-w-[46ch] text-[clamp(1.15rem,1.55vw,1.5rem)] leading-[1.45] text-[#232A2A]/85" data-testid="hero-body">
              Strategy. Brand. Technology. Growth. Operations. They look like separate departments until you
              realise they are all working on the same business. hiAnzy finds what is disconnected, figures out
              what belongs together and builds the system around it.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="hero-primary-cta" onClick={() => track("cta_primary_click", { cta: "start_a_conversation" })}>
              Start a Conversation <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton to="/how-we-work" className="btn-paper" testId="hero-secondary-cta" onClick={() => track("method_explored", { from: "hero" })}>
              See How It Works
            </MagneticButton>
          </Reveal>
          <Reveal delay={320} as="p" className="font-accent mt-6 text-[17px] text-[#232A2A]/70" testId="hero-microcopy">
            Bring the brief. Or bring the problem. <span className="accent-orange-text font-semibold">We can start with either.</span>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={200}>
            <div className="panel-dark relative overflow-hidden" style={{ aspectRatio: "4/4.6" }} data-testid="hero-core-frame">
              {/* The diagram paints first — same layering .motif-frame uses for its
                  deck scenes — and the canvas fades in on top once it is truly
                  ready, instead of popping in over what had been an empty frame.
                  Once that fade has had time to land, the diagram is hidden
                  outright: the canvas is transparent by design, so leaving the
                  diagram mounted underneath forever would let it show through
                  every gap in the scene, doubled up with whatever draws there. */}
              <div className="absolute inset-0">
                {/* absolute inset-0, not a bare div: SystemCoreFallback sizes
                    itself with h-full, which resolves against its parent — a
                    plain wrapper would collapse it to its own square aspect
                    ratio instead of filling the panel. aria-hidden once the
                    canvas is up so the retired diagram's label does not linger
                    in the accessibility tree behind the live scene. */}
                <div
                  className={`absolute inset-0 ${coreReady ? "hero-core-fallback-out" : ""}`}
                  aria-hidden={coreReady ? "true" : undefined}
                >
                  <SystemCoreFallback />
                </div>
                {show3d && (
                  <ThreeSafe fallback={null} onError={handleCoreFailed}>
                    <Suspense fallback={null}>
                      <div className="absolute inset-0 hero-core-fade-in">
                        <SystemCore onReady={handleCoreReady} />
                      </div>
                    </Suspense>
                  </ThreeSafe>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ========================= S02 — SOMETHING'S OFF ========================= */
const SomethingsOff = () => (
  <section className="container-page section-pad" data-testid="home-somethings-off-section">
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <SectionHeading kicker="SOUND FAMILIAR?" title={<>Something&rsquo;s off<span className="accent-signal-text">.</span></>} testId="somethings-off-heading" />
        <Reveal delay={140} as="p" className="font-mono-sys mt-6 max-w-sm text-[13px] leading-relaxed text-[#232A2A]/55">
          Symptoms observed in the wild. Names withheld. Patterns, unfortunately, not.
        </Reveal>
        <Reveal delay={220}>
          {/* Was the cube-head collage, which reappears as the pop figure two
              sections below. A diagram makes the section's argument instead. */}
          <SystemDiagnostic className="relative mt-8 hidden max-w-[300px] lg:block" testId="somethings-off-diagnostic" />
        </Reveal>
      </div>
      <div className="lg:col-span-7">
        <div className="panel-paper relative overflow-hidden p-6 sm:p-8">
          <ul className="divide-y divide-[#232A2A]/10">
            {SOMETHINGS_OFF.map((line, i) => (
              <Reveal as="li" key={i} delay={i * 90} className="flex items-start gap-4 py-4">
                <span className="mt-[9px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#E54A25]" aria-hidden="true" />
                <p className="text-[17px] leading-[1.6] text-[#232A2A]/88">{line}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={200}>
          <div className="panel-dark mt-5 p-6 sm:p-8">
            <p className="text-[17px] leading-[1.6] text-[#F7F5EE]/90">
              We find the gap. Then we decide whether it needs fixing, rebuilding or simply getting out of the way.
            </p>
            <p className="font-accent mt-3 text-2xl accent-orange-text sm:text-[1.7rem]">More activity is not always more progress.</p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ========================== S03 — WHY / HOW / NOW ========================== */
const WhyHowNow = () => (
  <section className="container-page section-pad" data-testid="home-why-how-now-section">
    {/* Heading sat alone across the full width; the figure takes the empty
        right-hand third rather than leaving it as dead paper. */}
    <div className="flex items-end justify-between gap-10">
      <SectionHeading kicker="THE QUESTIONS" title="Three questions. Surprisingly useful." testId="why-how-now-heading" />
      <PopIllustration
        src="/brand/pop-cube-thinker.png"
        width={200}
        rotate={-3.5}
        drift={24}
        className="-mb-6 shrink-0"
        testId="pop-questions"
      />
    </div>
    <div className="relative mt-12 grid gap-6 lg:grid-cols-3">
      <RouteLine d="M0,30 C 25,5 40,55 55,30 C 70,8 85,50 100,25" viewBox="0 0 100 60" strokeWidth={2.4} className="pointer-events-none absolute -top-8 left-0 hidden h-16 w-full lg:block" />
      {WHY_HOW_NOW.map((b, i) => (
        <Reveal key={b.key} delay={i * 120} className={i === 1 ? "lg:mt-10" : i === 2 ? "lg:mt-20" : ""}>
          <div className={`${i === 1 ? "panel-paper" : "panel-dark"} cap-tile h-full p-7 sm:p-8`} data-testid={`why-how-now-panel-${b.key.toLowerCase()}`}>
            <div className="flex items-center justify-between">
              <span className="font-display accent-orange-text text-6xl leading-none">{b.key}</span>
            </div>
            <p className={`font-editorial mt-4 text-[clamp(1.15rem,1.45vw,1.4rem)] font-medium leading-[1.35] ${i === 1 ? "text-[#232A2A]" : "text-[#F7F5EE]"}`}>{b.q}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {b.items.map((it) => (
                <li key={it} className={`sys-chip rounded-full border px-3 py-1 ${i === 1 ? "border-[#232A2A]/25 text-[#232A2A]/75" : "border-[#F7F5EE]/25 text-[#F7F5EE]/75"}`}>{it}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={160} as="p" className="font-display mt-12 text-3xl text-[#232A2A] sm:text-4xl">
      Ideas matter. Execution decides. <span className="hl-marker">Systems endure.</span>
    </Reveal>
  </section>
);

/* ============================ S04 — WHAT WE DO ============================ */
const spans = ["lg:col-span-5", "lg:col-span-7", "lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-8"];
const WhatWeDoGrid = () => (
  <section className="container-page section-pad" data-testid="home-what-we-do-section">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <SectionHeading kicker="CAPABILITIES" title={<>A business is one system.<br />Our capabilities behave like one too.</>} testId="what-we-do-heading" className="max-w-3xl" />
      <Reveal delay={150}>
        <MagneticButton to="/what-we-do" className="btn-paper" testId="what-we-do-cta" onClick={() => track("service_explored", { from: "home_grid_cta" })}>
          Explore What We Do <ArrowRight size={15} />
        </MagneticButton>
      </Reveal>
    </div>
    <div className="mt-12 grid gap-5 lg:grid-cols-12">
      {CATEGORIES.map((c, i) => (
        <Reveal key={c.num} delay={(i % 3) * 100} className={spans[i]}>
          <Link
            to="/what-we-do"
            onClick={() => track("service_explored", { category: c.label })}
            data-testid={`category-tile-${c.num}`}
            className="cap-tile group block h-full rounded-[18px] border border-[#232A2A]/15 bg-[#F7F5EE] p-6 sm:p-7"
          >
            <h3 className="font-display mt-4 text-[clamp(1.85rem,2.7vw,3.1rem)] leading-[0.98] text-[#232A2A]">{c.label}</h3>
            <p className="font-editorial mt-1 text-[clamp(1.15rem,1.35vw,1.45rem)] font-medium text-[#232A2A]/65">{c.title}</p>
            <p className="mt-3 text-[16px] leading-[1.55] text-[#232A2A]/78">{c.copy}</p>
            <div className="mt-4 flex flex-wrap gap-1.5 opacity-90 transition-all duration-500 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:group-hover:max-h-32 lg:group-hover:opacity-100">
              {c.capabilities.slice(0, 5).map((cap) => (
                <span key={cap} className="sys-chip rounded-full border border-[#F19020]/70 px-2.5 py-0.5 text-[#232A2A]/75">{cap}</span>
              ))}
              <span className="sys-chip rounded-full px-2 py-0.5 text-[#232A2A]/45">+{c.capabilities.length - 5} more</span>
            </div>
            <div className="mt-4 h-[3px] w-10 rounded-full bg-[#F19020] transition-all duration-500 group-hover:w-24" />
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ============================ S05 — THE METHOD ============================ */
const MethodSection = () => {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) return undefined;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    let current = -1;
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 65%",
      end: "bottom 60%",
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        path.style.strokeDashoffset = `${len * (1 - p)}`;
        const idx = Math.min(4, Math.floor(p * 5.2));
        if (idx !== current) {
          current = idx;
          setActive(idx);
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section className="bg-[#D8CFB4]/60 section-pad" data-testid="home-method-section">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading kicker={<>THE <span className="brand-mark">hiAnzy</span> METHOD</>} title={<>See it. Shape it. Build it.<br />Bring it together. Make it grow.</>} testId="method-heading" className="max-w-3xl" />
          <Reveal delay={150}>
            <MagneticButton to="/how-we-work" className="btn-paper" testId="method-cta" onClick={() => track("method_explored", { from: "home_method" })}>
              See the Method <ArrowRight size={15} />
            </MagneticButton>
          </Reveal>
        </div>

        <div ref={wrapRef} className="relative mt-14">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="pointer-events-none absolute -top-6 left-0 hidden h-14 w-full lg:block" aria-hidden="true">
            <path ref={pathRef} d="M0,45 C 100,10 160,55 250,30 C 340,8 400,52 500,30 C 600,10 660,55 750,30 C 840,8 920,45 1000,22" fill="none" stroke="#F19020" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <ol className="grid gap-4 lg:grid-cols-5">
            {METHOD_STAGES.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 90}>
                <div className={`method-stage h-full rounded-[16px] p-5 ${!reduced && i !== active ? "inactive" : ""} ${i === active || reduced ? "bg-[#232A2A] text-[#F7F5EE]" : "bg-[#F7F5EE] text-[#232A2A]"}`} data-testid={`method-stage-${s.label.toLowerCase()}`}>
                  <div className="flex items-center justify-between">
                    <span className={`sys-chip ${i === active || reduced ? "accent-orange-text" : "text-[#232A2A]/50"}`}>{`0${i + 1}`}</span>
                    {(i === active || reduced) && <span className="red-bar" />}
                  </div>
                  <p className="font-display mt-3 text-3xl leading-none">{s.label}</p>
                  <p className={`font-editorial mt-2 text-[15.5px] font-medium leading-[1.3] ${i === active || reduced ? "text-[#F7F5EE]/85" : "text-[#232A2A]/70"}`}>{s.title}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={120} as="p" className="mt-10 max-w-2xl text-base leading-relaxed text-[#232A2A]/80">
          Right problem. Right people. Right move. <span className="font-accent text-[19px] text-[#232A2A]">That is how momentum becomes <span className="hl-marker">measurable</span>.</span>
        </Reveal>
      </div>
    </section>
  );
};

/* =========================== S06 — DIAGNOSTIC =========================== */
const Diagnostic = () => (
  <section className="container-page section-pad" data-testid="home-diagnostic-section">
    <div className="panel-dark diag-grid relative overflow-hidden p-7 sm:p-10 lg:p-14">
      <div className="scanline" style={{ "--scan-h": "100%" }} />
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="sys-chip flex items-center gap-3 text-[#F7F5EE]/55">
            <span className="inline-block h-[3px] w-8 rounded-full bg-[#F19020]" />
            BUSINESS SYSTEMS DIAGNOSTIC
          </p>
          <Reveal as="h2" delay={80} className="font-editorial mt-5 max-w-[20ch] text-[clamp(1.8rem,3.1vw,3.4rem)] font-medium leading-[1.12] text-[#F7F5EE]" testId="diagnostic-heading">
            Maybe you don&rsquo;t need <em>what you think</em> you need.
          </Reveal>
          <Reveal delay={140} as="p" className="mt-6 max-w-lg text-[17px] leading-[1.6] text-[#F7F5EE]/80">
            You might not need a rebrand. Or a new CRM. Or AI, whatever the conference said. The hiAnzy
            Business Systems Diagnostic looks at the whole machine before recommending a part.
          </Reveal>
          <Reveal delay={200} className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton to="/contact" className="btn-orange" testId="diagnostic-cta" onClick={() => track("diagnostic_cta_click", { from: "home" })}>
              Find the Gap <ArrowRight size={15} />
            </MagneticButton>
          </Reveal>
          <Reveal delay={260} as="p" className="font-mono-sys mt-5 max-w-md text-[12.5px] leading-relaxed text-[#F7F5EE]/45">
            Prescription follows diagnosis. Your business deserves at least the same courtesy as your headache.
          </Reveal>
        </div>
        <div className="lg:col-span-6">
          <p className="sys-chip text-[#F7F5EE]/50">WHAT WE LOOK AT</p>
          <div className="mt-4 flex flex-wrap gap-2" data-testid="diagnostic-areas">
            {DIAGNOSTIC_AREAS.map((a, i) => (
              <Reveal key={a} delay={i * 40} as="span" className="sys-chip inline-flex items-center gap-2 rounded-full border border-[#F7F5EE]/20 px-3 py-1.5 text-[#F7F5EE]/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F19020]" /> {a}
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <p className="sys-chip text-[#F7F5EE]/50">YOU LEAVE KNOWING</p>
              <ol className="mt-4 space-y-2.5">
                {DIAGNOSTIC_OUTCOMES.map((o, i) => (
                  <Reveal as="li" key={o} delay={i * 60} className="flex items-center gap-3 text-[14px] text-[#F7F5EE]/85">
                    {o}
                  </Reveal>
                ))}
              </ol>
            </div>
            <Reveal delay={200} className="hidden shrink-0 xl:block">
              <img src="/brand/art-thinker.png" width="354" height="354" alt="Etched illustration — a person thinking, surrounded by question marks" loading="lazy" className="w-[170px] opacity-90" data-parallax="12" />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================= S07 — WORK ============================= */
const WorkPreview = () => {
  const [cases, setCases] = useState(null);
  useEffect(() => {
    getCaseStudies(true).then(setCases).catch(() => setCases([]));
  }, []);
  return (
    <section className="container-page section-pad" data-testid="home-work-section">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading kicker="PROOF" title="Less portfolio. More proof." testId="work-heading" />
        <Reveal delay={150}>
          <MagneticButton to="/work" className="btn-paper" hoverText="Receipts this way." testId="work-cta">
            See the Work <ArrowRight size={15} />
          </MagneticButton>
        </Reveal>
      </div>
      <Reveal delay={100} as="p" className="mt-5 max-w-xl text-[17px] leading-[1.6] text-[#232A2A]/78">
        Outcomes over aesthetics. Every case reads the same way: situation, gap, move, build, result, next.
      </Reveal>
      <div className="h-scroll mt-10 flex gap-5 overflow-x-auto pb-4" data-testid="work-cards-row">
        {(cases || Array.from({ length: 3 }).map((_, i) => ({ _skeleton: true, slug: `s${i}` }))).map((cs) =>
          cs._skeleton ? (
            <div key={cs.slug} className="panel-paper h-[300px] w-[340px] shrink-0 animate-pulse" />
          ) : (
            <Link
              key={cs.slug}
              to={`/work/${cs.slug}`}
              onClick={() => track("case_opened", { slug: cs.slug, from: "home" })}
              data-testid={`work-card-${cs.slug}`}
              className="case-card group block w-[340px] shrink-0 rounded-[18px] border border-[#232A2A]/15 bg-[#F7F5EE] p-6 sm:w-[400px]"
            >
              <div className="flex items-center justify-between gap-3">
                <ProvenanceTag value={cs.provenance} />
                <span className="sys-chip text-[#232A2A]/45">{cs.year}</span>
              </div>
              <h3 className="font-display mt-4 text-3xl leading-[0.95] text-[#232A2A]">{cs.title}</h3>
              <p className="sys-chip mt-2 text-[#232A2A]/50">{cs.client} · {cs.industry}</p>
              <div className="mt-4 space-y-2.5 border-t border-[#232A2A]/10 pt-4">
                <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/75"><span className="font-mono-sys text-[12.5px] accent-signal-text">GAP — </span>{cs.gap.slice(0, 110)}…</p>
                <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/75"><span className="accent-orange-text font-mono-sys text-[12.5px] font-bold">RESULT — </span>{cs.result.slice(0, 110)}…</p>
              </div>
              <span className="link-draw mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#232A2A]">
                Read the thinking <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )
        )}
      </div>
      <p className="font-mono-sys mt-3 text-[12.5px] text-[#232A2A]/50">The final screen is nice. The thinking that made it useful is nicer.</p>
    </section>
  );
};

/* ============================ S08 — NETWORK ============================ */
const NetworkPreview = ({ show3d }) => {
  const [activeCat, setActiveCat] = useState(null);
  return (
    <section className="bg-[#1D2424] section-pad" data-testid="home-network-section">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading dark kicker="THE NETWORK" title={<>The team changes. The accountability doesn&rsquo;t.</>} testId="network-heading" />
            <Reveal delay={140} as="p" className="mt-6 max-w-md text-[17px] leading-[1.6] text-[#F7F5EE]/78">
              hiAnzy combines a core strategic layer with a wider network of specialists, creators,
              technologists, producers, media partners, venues and operators. The problem decides the roster.
            </Reveal>
            <div className="mt-7 flex flex-wrap gap-2" data-testid="network-category-chips">
              {NETWORK_CATEGORIES_HOME.map((c) => (
                <button
                  key={c}
                  type="button"
                  onMouseEnter={() => setActiveCat(c)}
                  onFocus={() => setActiveCat(c)}
                  onMouseLeave={() => setActiveCat(null)}
                  onBlur={() => setActiveCat(null)}
                  onClick={() => track("network_category_selected", { category: c, from: "home" })}
                  data-testid={`network-chip-${c.toLowerCase()}`}
                  className={`sys-chip rounded-full border px-3 py-1.5 transition-colors ${activeCat === c ? "border-[#F19020] bg-[#F19020] text-[#232A2A]" : "border-[#F7F5EE]/25 text-[#F7F5EE]/75 hover:border-[#F19020]/70"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <Reveal delay={200} className="mt-8">
              <MagneticButton to="/network" className="btn-orange" hoverText="Meet the minds." testId="network-cta">
                Explore the Network <ArrowRight size={15} />
              </MagneticButton>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[18px] border border-[#F7F5EE]/12" style={{ aspectRatio: "16/10" }}>
              <div className="absolute inset-0">
                {show3d ? (
                  <ThreeSafe fallback={<ConstellationFallback categories={NETWORK_CATEGORIES_HOME.map((c) => c[0] + c.slice(1).toLowerCase())} />}>
                    <Suspense fallback={<ConstellationFallback categories={NETWORK_CATEGORIES_HOME.map((c) => c[0] + c.slice(1).toLowerCase())} />}>
                      <Constellation categories={NETWORK_CATEGORIES_HOME.map((c) => c[0] + c.slice(1).toLowerCase())} active={activeCat ? activeCat[0] + activeCat.slice(1).toLowerCase() : null} subs={NETWORK_SUBCATS} />
                    </Suspense>
                  </ThreeSafe>
                ) : (
                  <ConstellationFallback categories={NETWORK_CATEGORIES_HOME.map((c) => c[0] + c.slice(1).toLowerCase())} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================= S09 — TRUST ============================= */
const Trust = () => (
  <section className="container-page section-pad" data-testid="home-trust-section">
    <SectionHeading kicker="HOW TRUST GETS BUILT" title={<>Creative enough to find another answer.<br />Practical enough to make it work.</>} testId="trust-heading" className="max-w-4xl" />

    <Reveal delay={80} as="p" className="mt-6 max-w-[60ch] text-[17.5px] leading-[1.6] text-[#232A2A]/80">
      Nine promises. Open any of them and you will find what it actually costs us to keep it —
      because a principle nobody has to pay for is just a poster.
    </Reveal>

    {/* Each principle opens in place. <details> rather than a custom widget:
        keyboard, screen readers and find-in-page all work without help. */}
    <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="trust-principles">
      {TRUST_PRINCIPLES.map((p, i) => (
        <Reveal as="li" key={p.name} delay={(i % 3) * 80}>
          <details className="trust-item group h-full rounded-[14px] border border-[#232A2A]/12 px-4 py-3.5 transition-colors" data-testid={`trust-principle-${i + 1}`}>
            <summary className="flex cursor-pointer items-center gap-4 marker:content-['']">
              <span className="font-display text-[19px] font-semibold text-[#232A2A]/85 transition-colors group-hover:text-[#232A2A]">{p.name}</span>
              <span className="faq-plus ml-auto shrink-0 accent-orange-text" aria-hidden="true">+</span>
            </summary>
            <p className="trust-detail mt-3 text-[15.5px] leading-[1.62] text-[#232A2A]/78">{p.detail}</p>
          </details>
        </Reveal>
      ))}
    </ul>

    {/* Bridges the list and the closing line, which previously met as a hard
        cut across a wide band of empty paper. */}
    <ProgressRule
      total={TRUST_PRINCIPLES.length}
      label="TRUST, ASSEMBLED"
      trailing="None of these are negotiable. All of them are checkable."
      testId="trust-progress-rule"
    />

    {/* The closing line ran the full width with a lot of empty paper to its
        right — the figure fills it without crowding the sentence. */}
    <div className="mt-6 flex items-end justify-between gap-10">
      <Reveal delay={120} as="p" className="font-display max-w-[24ch] text-3xl text-[#232A2A] sm:text-4xl">
        Clever ideas get attention. <span className="hl-marker hl-marker-draw">Reliable execution gets remembered.</span>
      </Reveal>
      <PopIllustration
        src="/brand/pop-hands-a.png"
        width={230}
        rotate={2.5}
        drift={20}
        className="-mb-2 shrink-0"
        testId="pop-trust"
      />
    </div>
  </section>
);

/* ======================== S10 — WHO WE WORK WITH ======================== */
const MarqueeRow = ({ items, reverse = false }) => (
  <div className="overflow-hidden" aria-hidden="true">
    <div className="marquee-track items-center gap-x-5 py-1" style={reverse ? { animationDirection: "reverse", animationDuration: "42s" } : undefined}>
      {[...items, ...items].map((a, i) => (
        <React.Fragment key={`${a}-${i}`}>
          <span className="font-display whitespace-nowrap text-3xl leading-none text-[#232A2A]/80 sm:text-4xl">{a}</span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#F19020]" />
        </React.Fragment>
      ))}
    </div>
  </div>
);

const WhoWith = () => (
  <section className="container-page section-pad relative" data-testid="home-who-section">
    <SectionHeading kicker="WHO WE WORK WITH" title="People building things that have to work." testId="who-heading" className="max-w-3xl" />
    <div className="mt-10 space-y-3" data-testid="who-audience-wall">
      <MarqueeRow items={AUDIENCES.slice(0, 6)} />
      <MarqueeRow items={AUDIENCES.slice(6)} reverse />
      {/* Accessible static list for screen readers */}
      <ul className="sr-only">
        {AUDIENCES.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
    <Reveal delay={160} as="p" className="mt-8 max-w-xl text-[17px] leading-[1.6] text-[#232A2A]/80">
      We especially like people who ask good questions. You do not need every answer.
      <span className="font-accent text-[17px]"> That is partly why we are here.</span>
    </Reveal>
    {/* The filter panel was capped at max-w-2xl and left the right half of the
        section empty. The diagram is its counterweight: the panel says when it
        goes badly, this says when it goes well. */}
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
    <Reveal delay={220} className="lg:col-span-7">
      <div className="panel-paper h-full p-6 sm:p-8" data-testid="who-filter-panel">
        <p className="accent-signal-text sys-chip flex items-center gap-2 font-bold">
          <span className="red-bar" /> SMALL FILTER
        </p>
        <p className="mt-3 font-semibold text-[#232A2A]">We probably won&rsquo;t be brilliant together if…</p>
        <ul className="mt-4 space-y-2.5">
          {FILTER_LIST.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[16.5px] leading-[1.58] text-[#232A2A]/78">
              <span className="font-mono-sys mt-0.5 text-[12.5px] accent-signal-text">✕</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
    <Reveal delay={280} className="lg:col-span-5">
      <FitQuadrant className="panel-paper h-full p-6 sm:p-7" testId="who-fit-quadrant" />
    </Reveal>
    </div>
  </section>
);

/* ============================ S11 — CLOSING ============================ */
const Closing = () => (
  <section className="container-page section-pad-b pt-4" data-testid="home-closing-section">
    <div className="panel-dark relative overflow-hidden p-8 sm:p-12 lg:p-16">
      <RouteLine d="M0,80 C 20,20 45,95 65,45 C 80,10 92,60 100,30" viewBox="0 0 100 100" strokeWidth={1.6} className="pointer-events-none absolute inset-0 h-full w-full opacity-30" />
      {/* Copy is capped at 24ch, so the right half of this panel was empty:
          the ticker takes the top corner, the figure takes the bottom. */}
      <TouchpointTicker className="absolute right-8 top-8 hidden w-[380px] xl:block xl:right-16" testId="closing-ticker" />
      <PopIllustration
        src="/brand/pop-hat-balloon.png"
        width={260}
        rotate={3}
        drift={30}
        halo={false}
        className="absolute bottom-0 right-8 xl:right-16"
        testId="pop-closing"
      />
      <div className="relative">
        <Reveal>
          <p className="font-editorial max-w-[24ch] text-[clamp(1.75rem,3vw,3.3rem)] font-medium leading-[1.12] text-[#F7F5EE]" data-testid="closing-large-type">
            Brands are not campaigns. They are businesses people experience through <em className="accent-orange-text">hundreds of small interactions</em>.
          </p>
        </Reveal>
        <Reveal delay={120} as="p" className="font-mono-sys mt-6 max-w-2xl text-[15px] leading-[1.5] text-[#F7F5EE]/55">
          The website. The salesperson. The delivery. The reply that came fast — or didn&rsquo;t. The checkout.
          The invoice. The follow-up. When those things work together, the brand feels effortless.
        </Reveal>
        <Reveal delay={180} as="p" className="font-accent mt-5 text-2xl accent-orange-text">
          It rarely is. That&rsquo;s the work.
        </Reveal>
        <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-5">
          <MagneticButton to="/contact" className="btn-orange" testId="closing-primary-cta" onClick={() => track("cta_primary_click", { cta: "build_it_right" })}>
            Build It Right <ArrowRight size={15} />
          </MagneticButton>
          <Link to="/contact" className="link-draw text-[14px] text-[#F7F5EE]/80" data-testid="closing-secondary-cta">
            Have an idea? A problem? Something you cannot quite explain yet? Say hi.
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ================================ PAGE ================================ */
export default function Home() {
  const ref = useRevealObserver();
  const reduced = useReducedMotion();
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

  // Gentle parallax on editorial artwork
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
        title="hiAnzy — We Build Brand Operating Systems"
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
      <SectionConnector variant="left" label="CAPABILITY → METHOD" testId="connector-capability-method" />
      <MethodSection />
      <PinnedSequence
        kicker="THE SEQUENCE"
        title={<>One system, five moves.<br />In this order, on purpose.</>}
        testId="home-pinned-method"
        steps={METHOD_STAGES}
      />
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
