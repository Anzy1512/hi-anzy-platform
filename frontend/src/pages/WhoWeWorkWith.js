import React from "react";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { useRevealObserver } from "@/lib/motion";
import { AUDIENCES, FILTER_LIST } from "@/data/content";

export default function WhoWeWorkWith() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[68px]" data-testid="who-we-work-with-page">
      <Seo title="Who We Work With — Hi Anzy" description="Founders, founder-led companies, businesses modernising systems, D2C and commerce brands, hospitality and teams entering the next stage of growth." />
      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> WHO WE WORK WITH
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 max-w-4xl uppercase leading-[0.88] text-[#232A2A] text-6xl sm:text-7xl lg:text-8xl" data-testid="wwww-h1">
            People building things that have to work<span className="text-[#E54A25]">.</span>
          </h1>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a, i) => (
            <Reveal key={a} delay={(i % 3) * 70}>
              <div className="cap-tile flex h-full items-center gap-4 rounded-[14px] border border-[#232A2A]/14 bg-[#F7F5EE] p-5">
                <span className="font-mono-sys text-[11px] text-[#F19020]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] font-semibold text-[#232A2A]/85">{a}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150} as="p" className="mt-10 max-w-xl text-[15px] leading-relaxed text-[#232A2A]/82">
          We especially like people who ask good questions. You do not need every answer.
          <span className="font-semibold"> That is partly why we are here.</span>
        </Reveal>
        <Reveal delay={200}>
          <div className="panel-dark mt-10 max-w-2xl p-7 sm:p-9">
            <p className="sys-chip flex items-center gap-2 text-[#E54A25]"><span className="red-bar" /> SMALL FILTER</p>
            <p className="mt-3 font-semibold text-[#F7F5EE]">We probably won&rsquo;t be brilliant together if…</p>
            <ul className="mt-4 space-y-2.5">
              {FILTER_LIST.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[14px] leading-relaxed text-[#F7F5EE]/78">
                  <span className="font-mono-sys mt-0.5 text-[11px] text-[#E54A25]">✕</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={240} className="mt-12">
          <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="wwww-cta">
            Start a Conversation <ArrowRight size={15} />
          </MagneticButton>
        </Reveal>
      </section>
    </div>
  );
}
