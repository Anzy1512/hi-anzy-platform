import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { NotesSubscribe } from "@/components/NotesSubscribe";
import { LensFocus } from "@/components/deck/LensFocus";
import { Reveal } from "@/components/Reveal";
import { CardCarousel } from "@/components/CardCarousel";
import { SignalFieldFallback, ThreeSafe } from "@/components/three/Fallbacks";
import { useRevealObserver, useReducedMotion, webglAvailable } from "@/lib/motion";
import { getInsights } from "@/lib/api";
import { INSIGHT_CATEGORIES } from "@/data/content";
import { CharacterQuote } from "@/components/CharacterQuote";
import { NextSteps } from "@/components/NextSteps";

const SignalField = lazy(() => import("@/components/three/SignalField"));

export default function Insights() {
  const ref = useRevealObserver();
  const reduced = useReducedMotion();
  const [show3d, setShow3d] = useState(false);
  const [active, setActive] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    setShow3d(!reduced && webglAvailable());
  }, [reduced]);

  useEffect(() => {
    setPosts(null);
    getInsights(active).then(setPosts).catch(() => setPosts([]));
  }, [active]);

  return (
    <div ref={ref} className="pt-[84px]" data-testid="insights-page">
      <Seo title="Notes From the Work | hiAnzy Insights" description="Business systems, brand clarity, technology without theatre and growth with receipts. Useful first. Search engine second." />
      <section className="container-page section-pad relative">
       <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> INSIGHTS
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="insights-h1">
            Notes From the Work
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="font-mono-sys mt-5 text-[13px] text-[#232A2A]/55">Useful first. Search engine second.</Reveal>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <LensFocus />
        </div>
       </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter insights by category" data-testid="insights-category-filter">
          <button type="button" onClick={() => setActive(null)} className={`sys-chip rounded-full border px-3.5 py-1.5 transition-colors ${!active ? "border-[#232A2A] bg-[#232A2A] text-[#F7F5EE]" : "border-[#232A2A]/30 text-[#232A2A]/70 hover:border-[#232A2A]"}`} data-testid="insights-filter-all">ALL</button>
          {INSIGHT_CATEGORIES.map((c) => (
            <button key={c.name} type="button" onClick={() => setActive(c.name)} title={c.blurb} className={`sys-chip rounded-full border px-3.5 py-1.5 transition-colors ${active === c.name ? "border-[#232A2A] bg-[#232A2A] text-[#F7F5EE]" : "border-[#232A2A]/30 text-[#232A2A]/70 hover:border-[#232A2A]"}`} data-testid={`insights-filter-${c.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              {c.name.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* A note becomes public the same way it got written: one observation
          tested against a category until it holds. The field shows that —
          quietly, a couple of pulses at a time, never the whole notebook
          lighting up at once. */}
      <section className="container-page" data-testid="insights-signal-section">
        <div className="panel-dark relative overflow-hidden rounded-[18px]" data-testid="insights-signal-frame">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 p-7 sm:p-9 lg:flex-row lg:items-center lg:p-12">
            <div className="max-w-[38ch]">
              <p className="sys-chip flex items-center gap-3 text-[#F7F5EE]/55">
                <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> HOW A NOTE GETS FILED
              </p>
              <p className="font-editorial mt-4 text-[clamp(1.25rem,1.9vw,1.7rem)] font-medium leading-[1.3] text-[#F7F5EE]">
                One observation, tested against every category until it holds.
              </p>
              <p className="font-mono-sys mt-4 text-[12.5px] leading-relaxed text-[#F7F5EE]/50">
                Nothing here is generated. The system is just how the notebook is organised.
              </p>
            </div>
            <div className="h-[220px] w-full shrink-0 sm:h-[260px] lg:h-[300px] lg:w-[46%]" data-testid="insights-signal-canvas">
              {show3d ? (
                <ThreeSafe fallback={<SignalFieldFallback />}>
                  <Suspense fallback={<SignalFieldFallback />}>
                    <SignalField />
                  </Suspense>
                </ThreeSafe>
              ) : (
                <SignalFieldFallback />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page section-pad-b">
        {!posts && <div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="panel-paper h-[200px] animate-pulse" />)}</div>}
        {posts && posts.length === 0 && <p className="panel-paper p-6 text-[14px] text-[#232A2A]/70" data-testid="insights-empty">Nothing filed here yet. The notebook is thick; the typing takes time.</p>}
        {posts && posts.length > 0 && (
          <div data-testid="insights-grid">
            <CardCarousel label={`DRAG OR SCROLL · ${posts.length} NOTE${posts.length === 1 ? "" : "S"}`} testId="insights-carousel">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/insights/${p.slug}`}
                  className="case-card group flex h-full w-[86vw] shrink-0 snap-start flex-col rounded-[18px] border border-[#232A2A]/15 bg-[#F7F5EE] p-7 sm:w-[420px] lg:w-[440px]"
                  data-testid={`insight-card-${p.slug}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="sys-chip rounded-full border border-[#F19020]/70 px-3 py-1 text-[#232A2A]/70">{p.category.toUpperCase()}</span>
                    <span className="sys-chip text-[#232A2A]/45">{p.readingTime}</span>
                  </div>
                  <h2 className="font-display mt-4 text-[clamp(1.6rem,2.2vw,2.1rem)] leading-[1.04] text-[#232A2A]">{p.title}</h2>
                  <p className="mt-3 text-[16.5px] leading-[1.58] text-[#232A2A]/78">{p.excerpt}</p>
                  <span className="link-draw mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-[#232A2A]">
                    Read it <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </CardCarousel>
          </div>
        )}
      </section>
      <div className="container-page pb-4">
        <NotesSubscribe source="insights-index" className="max-w-3xl" />
      </div>
      <div className="pb-16">
        <CharacterQuote />
      </div>
      <NextSteps from="/insights" />
    </div>
  );
}
