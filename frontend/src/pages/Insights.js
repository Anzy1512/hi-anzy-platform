import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { useRevealObserver } from "@/lib/motion";
import { getInsights } from "@/lib/api";
import { INSIGHT_CATEGORIES } from "@/data/content";
import { CharacterQuote } from "@/components/CharacterQuote";
import { NextSteps } from "@/components/NextSteps";

export default function Insights() {
  const ref = useRevealObserver();
  const [active, setActive] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    setPosts(null);
    getInsights(active).then(setPosts).catch(() => setPosts([]));
  }, [active]);

  return (
    <div ref={ref} className="pt-[84px]" data-testid="insights-page">
      <Seo title="Notes From the Work — Hi Anzy Insights" description="Business systems, brand clarity, technology without theatre and growth with receipts. Useful first. Search engine second." />
      <section className="container-page section-pad relative">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> INSIGHTS
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="insights-h1">
            Notes From the Work
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="font-mono-sys mt-5 text-[13px] text-[#232A2A]/55">Useful first. Search engine second.</Reveal>
        <div className="pointer-events-none absolute right-[6%] top-[16%] hidden w-[190px] xl:block" aria-hidden="true">
          <div className="float-el scrap" style={{ "--rot": "2deg" }}>
            <img src="/brand/char-challenger.jpg" alt="" loading="lazy" />
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

      <section className="container-page section-pad-b">
        {!posts && <div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="panel-paper h-[200px] animate-pulse" />)}</div>}
        {posts && posts.length === 0 && <p className="panel-paper p-6 text-[14px] text-[#232A2A]/70" data-testid="insights-empty">Nothing filed here yet. The notebook is thick; the typing takes time.</p>}
        {posts && posts.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2" data-testid="insights-grid">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 90}>
                <Link to={`/insights/${p.slug}`} className="case-card group block h-full rounded-[18px] border border-[#232A2A]/15 bg-[#F7F5EE] p-7" data-testid={`insight-card-${p.slug}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="sys-chip rounded-full border border-[#F19020]/70 px-3 py-1 text-[#232A2A]/70">{p.category.toUpperCase()}</span>
                    <span className="sys-chip text-[#232A2A]/45">{p.readingTime}</span>
                  </div>
                  <h2 className="font-display mt-4 text-[clamp(1.6rem,2.2vw,2.1rem)] leading-[1.04] text-[#232A2A]">{p.title}</h2>
                  <p className="mt-3 text-[16.5px] leading-[1.58] text-[#232A2A]/78">{p.excerpt}</p>
                  <span className="link-draw mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#232A2A]">
                    Read it <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
      <div className="pb-16">
        <CharacterQuote startIndex={1} />
      </div>
      <NextSteps from="/insights" />
    </div>
  );
}
