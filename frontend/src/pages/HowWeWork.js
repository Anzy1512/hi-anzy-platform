import React from "react";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { RouteLine } from "@/components/RouteLine";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { METHOD_STAGES } from "@/data/content";
import { CharacterQuote } from "@/components/CharacterQuote";
import { NextSteps } from "@/components/NextSteps";

export default function HowWeWork() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[84px]" data-testid="how-we-work-page">
      <Seo title="How We Work — Hi Anzy" description="The Hi Anzy operating model: Audit, Architect, Build, Connect, Scale. Less ceremony. More consequence." />
      <section className="container-page section-pad">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> HOW WE WORK
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 max-w-4xl leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="how-we-work-h1">
            How does this work<span className="text-[#E54A25]">?</span>
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
          Usually with a conversation. Sometimes with a brief. Sometimes with screenshots and
          <span className="font-mono-sys text-[15px]"> “Can you tell me what’s wrong here?”</span> Both work.
        </Reveal>
        <Reveal delay={220} as="p" className="font-mono-sys mt-4 text-[13px] text-[#232A2A]/55">The brief can be messy. The thinking won’t be.</Reveal>
      </section>

      {/* The orange route physically continues through the page */}
      <section className="relative container-page section-pad-b">
        <RouteLine
          d="M50,0 C 20,8 20,14 50,20 C 80,26 80,32 50,38 C 20,44 20,52 50,58 C 80,64 80,72 50,78 C 20,84 20,92 50,100"
          viewBox="0 0 100 100"
          strokeWidth={0.9}
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-full lg:block"
          start="top 70%"
          end="bottom 90%"
        />
        <div className="relative space-y-10 lg:space-y-16">
          {METHOD_STAGES.map((s, i) => (
            <Reveal key={s.label}>
              <article className={`grid gap-6 lg:grid-cols-12 ${i % 2 === 0 ? "" : "lg:text-right"}`} data-testid={`hww-stage-${s.label.toLowerCase()}`}>
                <div className={`lg:col-span-5 ${i % 2 === 0 ? "" : "lg:col-start-8"}`}>
                  <div className={`panel-dark p-7 sm:p-8 ${i % 2 === 0 ? "" : "lg:ml-auto"}`}>
                    <div className={`flex items-center gap-3 ${i % 2 === 0 ? "" : "lg:justify-end"}`}>
                      <span className="sys-chip text-[#F19020]">{`STAGE 0${i + 1}`}</span>
                      <span className="red-bar" />
                    </div>
                    <h2 className="font-display mt-3 text-[clamp(2.2rem,3.6vw,3.75rem)] leading-none text-[#F7F5EE]">{s.label}</h2>
                    <p className="font-display mt-2 text-[19px] font-semibold text-[#F19020]">{s.page}</p>
                    <p className="font-editorial mt-1 text-[16.5px] font-medium text-[#F7F5EE]/85">{s.title}</p>
                    <p className={`mt-4 text-[16.5px] leading-[1.58] text-[#F7F5EE]/72 ${i % 2 === 0 ? "" : "lg:ml-auto"}`}>{s.body}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="relative mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[18px] bg-[#D8CFB4]/60 p-8">
            <p className="font-display text-3xl text-[#232A2A] sm:text-5xl" data-testid="hww-closing">
              Less ceremony. <span className="accent-orange-text">More consequence.</span>
            </p>
            <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="hww-cta" onClick={() => track("cta_primary_click", { cta: "how_we_work_bottom" })}>
              Start a Conversation <ArrowRight size={15} />
            </MagneticButton>
          </div>
        </Reveal>
      </section>
      <div className="pb-16">
        <CharacterQuote startIndex={0} />
      </div>
      <NextSteps from="/how-we-work" />
    </div>
  );
}
