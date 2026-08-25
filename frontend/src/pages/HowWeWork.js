import React from "react";
import { ArrowRight, Clock } from "lucide-react";
import { Seo } from "@/components/Seo";
import { InboxUnfold } from "@/components/deck/InboxUnfold";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { RouteLine } from "@/components/RouteLine";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { METHOD_STAGES } from "@/data/content";
import { CharacterQuote } from "@/components/CharacterQuote";
import { NextSteps } from "@/components/NextSteps";
import { PopIllustration } from "@/components/PopIllustration";
import { ScrollInfoPanel } from "@/components/ScrollInfoPanel";

export default function HowWeWork() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[84px]" data-testid="how-we-work-page">
      <Seo title="How We Work — hiAnzy" description="The hiAnzy operating model: Audit, Architect, Build, Connect, Scale. Less ceremony. More consequence." />
      <section className="container-page section-pad">
       <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> HOW WE WORK
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 max-w-4xl leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="how-we-work-h1">
            How does this work<span className="accent-signal-text">?</span>
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
          Usually with a conversation. Sometimes with a brief. Sometimes with screenshots and
          <span className="font-mono-sys text-[15px]"> “Can you tell me what’s wrong here?”</span> Both work.
        </Reveal>
        <Reveal delay={220} as="p" className="font-mono-sys mt-4 text-[13px] text-[#232A2A]/55">The brief can be messy. The thinking won’t be.</Reveal>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <InboxUnfold />
        </div>
       </div>
      </section>

      {/* The orange route physically continues through the page */}
      <section className="relative container-page section-pad-b" data-index-label="THE FIVE STAGES">
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
                <div className={`lg:col-span-5 ${i % 2 === 0 ? "" : "lg:col-start-8 lg:row-start-1"}`}>
                  <div className={`panel-dark p-7 sm:p-8 ${i % 2 === 0 ? "" : "lg:ml-auto"}`}>
                    <div className={`flex items-center gap-3 ${i % 2 === 0 ? "" : "lg:justify-end"}`}>
                      <span className="sys-chip accent-orange-text">{`STAGE 0${i + 1}`}</span>
                      <span className="red-bar" />
                    </div>
                    <h2 className="font-display mt-3 text-[clamp(2.2rem,3.6vw,3.75rem)] leading-none text-[#F7F5EE]">{s.label}</h2>
                    <p className="font-display mt-2 text-[19px] font-semibold accent-orange-text">{s.page}</p>
                    <p className="font-editorial mt-1 text-[16.5px] font-medium text-[#F7F5EE]/85">{s.title}</p>
                    <p className={`mt-4 text-[16.5px] leading-[1.58] text-[#F7F5EE]/72 ${i % 2 === 0 ? "" : "lg:ml-auto"}`}>{s.body}</p>
                    <p className={`font-mono-sys mt-5 flex items-center gap-2 text-[12.5px] text-[#F7F5EE]/55 ${i % 2 === 0 ? "" : "lg:justify-end"}`}>
                      <Clock size={13} aria-hidden="true" /> {s.duration}
                    </p>
                  </div>
                </div>

                {/* The other seven columns were empty on every stage. */}
                <div className={`lg:col-span-6 lg:self-center ${i % 2 === 0 ? "lg:col-start-7" : "lg:col-start-1 lg:row-start-1"}`}>
                  <ScrollInfoPanel
                    align={i % 2 === 0 ? "left" : "right"}
                    testId={`hww-info-${s.label.toLowerCase()}`}
                    cards={[
                      { label: "WHAT WE NEED FROM YOU", items: s.inputs },
                      { label: "WHAT YOU END UP WITH", items: s.outputs },
                      { label: "WHERE THIS USUALLY GOES WRONG", text: s.pitfall },
                    ]}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="relative mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[18px] bg-[#D8CFB4]/60 p-8">
            <PopIllustration
              src="/brand/pop-clock-watch.png"
              width={150}
              rotate={-2.5}
              drift={18}
              halo={false}
              className="absolute -top-24 right-10 xl:right-16"
              testId="pop-how-we-work"
            />
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
        <CharacterQuote />
      </div>
      <NextSteps from="/how-we-work" />
    </div>
  );
}
