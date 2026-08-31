import React from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { FitQuadrant } from "@/components/FitQuadrant";
import { AUDIENCES, FILTER_LIST } from "@/data/content";

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

export const WhoWith = () => (
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
