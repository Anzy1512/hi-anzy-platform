import React from "react";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { CAREER_PRINCIPLES } from "@/data/content";

export default function Careers() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[68px]" data-testid="careers-page">
      <Seo title="Careers — Hi Anzy" description="We hire the way we work: slowly, then decisively. There is no open-roles wall — when someone genuinely sharp introduces themselves, we pay attention." />
      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> CAREERS
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 max-w-4xl leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="careers-h1">
            We hire the way we work.
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="mt-7 max-w-[52ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
          Slowly, then decisively. There is no open-roles wall here right now. There is a standing rule instead:
          when someone genuinely sharp introduces themselves, we pay attention.
          <span className="font-semibold"> Consider this the introduction form.</span>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {CAREER_PRINCIPLES.map((p, i) => (
            <Reveal key={p.num} delay={i * 90}>
              <div className="cap-tile panel-paper h-full p-7" data-testid={`careers-principle-${p.num}`}>
                <span className="font-mono-sys text-[11px] text-[#F19020]">{p.num}</span>
                <h2 className="font-display mt-2 text-3xl text-[#232A2A]">{p.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#232A2A]/78">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[18px] bg-[#D8CFB4]/60 p-8">
            <div>
              <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="careers-cta" onClick={() => track("cta_primary_click", { cta: "careers_bottom" })}>
                Introduce Yourself <ArrowRight size={15} />
              </MagneticButton>
              <p className="font-mono-sys mt-4 text-[11.5px] text-[#232A2A]/55">// Mention "careers" in the message. A person reads every one.</p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
