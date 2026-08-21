import React from "react";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { COLLABORATE_CATEGORIES, CREDIT_LEGEND } from "@/data/content";

export default function Collaborate() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[68px]" data-testid="collaborate-page">
      <Seo title="Collaborate — Join the Hi Anzy Network" description="The Hi Anzy network is assembled per problem, credited honestly and briefed properly. If you are exceptional at something businesses need, we would like to know you exist." />
      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> COLLABORATE
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 max-w-4xl leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="collaborate-h1">
            Good problems attract good company.
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="mt-7 max-w-[52ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
          The Hi Anzy network is assembled per problem, credited honestly and briefed properly. If you are
          exceptional at something businesses need, we would like to know you exist.
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {COLLABORATE_CATEGORIES.map((c, i) => (
            <Reveal key={c.num} delay={i * 90}>
              <div className="cap-tile panel-paper h-full p-7" data-testid={`collaborate-category-${c.num}`}>
                <span className="font-mono-sys text-[11px] text-[#F19020]">{c.num}</span>
                <h2 className="font-display mt-2 text-3xl text-[#232A2A]">{c.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#232A2A]/78">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <div className="panel-dark mt-10 p-7 sm:p-9" data-testid="collaborate-credit-legend">
            <p className="sys-chip flex items-center gap-2 text-[#F19020]"><span className="red-bar" /> HOW CREDIT WORKS HERE</p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#F7F5EE]/85">
              Every relationship is classified truthfully, in public:
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CREDIT_LEGEND.map((l) => (
                <div key={l.tag} className="rounded-[14px] border border-[#F7F5EE]/15 p-4">
                  <ProvenanceTag label={l.tag} />
                  <p className="mt-2.5 text-[13.5px] leading-[1.5] text-[#F7F5EE]/70">{l.text}</p>
                </div>
              ))}
            </div>
            <p className="font-mono-sys mt-5 text-[11px] text-[#F7F5EE]/45">// Your work stays your work. We just make sure the world knows who did what.</p>
          </div>
        </Reveal>

        <Reveal delay={340} className="mt-12">
          <MagneticButton to="/contact" className="btn-ink" hoverText="Meet the minds." testId="collaborate-cta" onClick={() => track("cta_primary_click", { cta: "collaborate_bottom" })}>
            Introduce Yourself <ArrowRight size={15} />
          </MagneticButton>
        </Reveal>
      </section>
    </div>
  );
}
