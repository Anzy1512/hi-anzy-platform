import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { getCaseStudies, track } from "@/lib/api";

/* ============================= S07 — WORK ============================= */
export const WorkPreview = () => {
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
                <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/75"><span className="font-mono-sys text-[12.5px] accent-signal-text">GAP: </span>{cs.gap.slice(0, 110)}…</p>
                <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/75"><span className="accent-orange-text font-mono-sys text-[12.5px] font-bold">RESULT: </span>{cs.result.slice(0, 110)}…</p>
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
