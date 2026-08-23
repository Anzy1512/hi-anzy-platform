import React from "react";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { useRevealObserver } from "@/lib/motion";
import { CharacterQuote } from "@/components/CharacterQuote";
import { NextSteps } from "@/components/NextSteps";

const VALUES = [
  { t: "Curiosity over credentials", b: "Degrees are nice. Noticing things is nicer." },
  { t: "Writing is thinking", b: "If it cannot be explained in a paragraph, it is not understood yet." },
  { t: "Ownership over activity", b: "Looking busy is not a growth strategy. Internally, either." },
  { t: "Kind and direct", b: "We disagree in the room, commit outside it, and credit loudly." },
];

export default function Careers() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[84px]" data-testid="careers-page">
      <Seo title="Careers — hiAnzy" description="We hire slowly and deliberately. If you notice things other people miss, introduce yourself anyway." />
      <section className="container-page section-pad">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> CAREERS
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 max-w-4xl leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="careers-h1">
            We hire the way we work. Slowly, then decisively<span className="accent-signal-text">.</span>
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
          There is no open-roles wall here right now. There is a standing rule instead: when someone genuinely
          sharp introduces themselves, we pay attention. Consider this the introduction form.
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={(i % 2) * 90}>
              <div className="cap-tile panel-paper h-full p-7">
                <h2 className="font-display mt-2 text-2xl text-[#232A2A]">{v.t}</h2>
                <p className="mt-2 text-[16.5px] leading-[1.58] text-[#232A2A]/75">{v.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={180} className="mt-12 flex flex-wrap items-center gap-5">
          <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="careers-cta">
            Introduce Yourself <ArrowRight size={15} />
          </MagneticButton>
          <p className="font-mono-sys text-[12.5px] text-[#232A2A]/50">Mention “careers” in the message. A person reads every one.</p>
        </Reveal>
      </section>
      <div className="pb-16">
        <CharacterQuote />
      </div>
      <NextSteps from="/careers" />
    </div>
  );
}
