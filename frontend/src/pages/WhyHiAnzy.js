import React from "react";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { RouteLine } from "@/components/RouteLine";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { CHARACTERS, TEAM_QUOTE } from "@/data/content";
import { PunPop } from "@/components/PunPop";
import { NextSteps } from "@/components/NextSteps";
import { DissolveImage } from "@/components/DissolveImage";

export default function WhyHiAnzy() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[84px]" data-testid="why-hi-anzy-page">
      <Seo title="Why hiAnzy — The Name, The Instinct, The Work" description="Anzy began as a signature under poems. It grew into a way of seeing businesses: see differently, make thoughtfully." />
      <section className="container-page section-pad">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
              <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> WHY <span className="brand-mark">hiAnzy</span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display mt-5 leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="why-h1">
                Who is Anzy, anyway<span className="text-[#E54A25]">?</span>
              </h1>
            </Reveal>
            <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
              Anzy began as a signature under poems. A name for the part of a person that notices things — the
              detail everyone walked past, the question nobody asked. Over the years the signature travelled:
              from verses to stories, from stories to stages, from stages to brands, to technology, to whole
              businesses. The medium kept changing. The instinct never did.
            </Reveal>
            {/* Deepened from raw brand orange — at this size on paper the
                original read 1.7:1. Still the accent, now legible. */}
            <Reveal delay={220} as="p" className="font-accent mt-6 text-[clamp(1.5rem,2.4vw,2.2rem)] text-[#A85A12]">
              See differently. Make thoughtfully.
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={200}>
              {/* Left plain on purpose: this sits above the fold, and a
                  scroll-scrubbed reveal there would either never play or delay
                  the first thing the reader sees. */}
              <figure className="cutout-img rounded-[18px]" style={{ aspectRatio: "4/5" }}>
                  <img src="https://images.unsplash.com/flagged/photo-1559487098-6174e343345c?auto=format&fit=crop&w=1200&q=80" alt="Black and white editorial portrait — a person mid-thought" loading="lazy" />
                </figure>
              </Reveal>
          </div>
        </div>
      </section>

      <section className="relative container-page section-pad-b">
        <RouteLine d="M10,0 C 40,20 0,45 30,60 C 60,75 20,90 50,100" viewBox="0 0 100 100" strokeWidth={0.8} className="pointer-events-none absolute left-0 top-0 hidden h-full w-1/2 opacity-40 lg:block" />
        <div className="space-y-8">
          <Reveal>
            <article className="panel-dark relative grid gap-6 p-8 sm:p-10 lg:grid-cols-12" data-testid="why-section-hi">
              <div className="lg:col-span-4">
                <p className="sys-chip text-[#F19020]">THE GREETING</p>
                <h2 className="font-display mt-2 text-5xl text-[#F7F5EE]">Why “Hi”?</h2>
              </div>
              <div className="lg:col-span-8">
                <p className="text-[17px] leading-[1.6] text-[#F7F5EE]/85">
                  Because most good things begin with a conversation. A partnership. A new idea. A question someone
                  finally asked out loud. “Hi” is the smallest possible unit of beginning — and beginnings are our
                  favourite part of the work.
                </p>
                <p className="mt-4 text-[17px] leading-[1.6] text-[#F7F5EE]/85">
                  The name is approachable. The work is rigorous. <span className="text-[#F19020]">The contrast is intentional.</span>
                </p>
                <p className="font-mono-sys mt-4 text-[12.5px] text-[#F7F5EE]/45">We take the brief seriously. Ourselves, slightly less.</p>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <article className="panel-paper h-full p-8 sm:p-10" data-testid="why-section-dreamers">
                <p className="sys-chip text-[#232A2A]/55">THE TEMPERAMENT</p>
                <h2 className="font-display mt-2 text-5xl text-[#232A2A]">Dreamers + Doers</h2>
                <p className="mt-5 text-[17px] leading-[1.6] text-[#232A2A]/82">
                  We sit between <span className="font-mono-sys text-[14px]">“What if?”</span> and
                  <span className="font-mono-sys text-[14px]"> “It works.”</span> Close enough to the dream to protect
                  its ambition. Close enough to the build to guarantee its delivery. It is a strange place to stand.
                  It is also where the interesting problems get solved.
                </p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="panel-paper h-full p-8 sm:p-10" data-testid="why-section-compass">
                <p className="sys-chip text-[#232A2A]/55">THE MECHANICS</p>
                <h2 className="font-display mt-2 text-5xl text-[#232A2A]">Compass + Engine</h2>
                <p className="mt-5 text-[17px] leading-[1.6] text-[#232A2A]/82">
                  The compass finds direction. The engine creates movement. Direction without movement is theory.
                  Movement without direction is <span className="accent-signal-text font-semibold">expensive</span>.
                  Every engagement carries both — which is why the strategy deck and the shipped system come from
                  the same accountable place.
                </p>
              </article>
            </Reveal>
          </div>

          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-[18px] bg-[#D8CFB4]/60 p-8">
              <p className="font-display max-w-xl text-3xl leading-tight text-[#232A2A] sm:text-4xl">
                Complexity is common. <span className="accent-orange-text">Clarity is engineered.</span>
              </p>
              <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="why-cta" onClick={() => track("cta_primary_click", { cta: "why_hi_anzy" })}>
                Say Hi <ArrowRight size={15} />
              </MagneticButton>
            </div>
          </Reveal>

          <div className="flex justify-start pl-[8%]">
            <PunPop text="Curiosity is a business model." rot={-2.5} variant="dark" testId="pun-why" />
          </div>

          {/* ============ THE ARCHITECTS — motion character parade ============ */}
          <div className="pt-6" data-testid="why-character-parade">
            <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
              <span className="inline-block h-[3px] w-8 rounded-full bg-[#F19020]" /> THE ARCHITECTS
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-4 leading-[0.95] text-[clamp(2.2rem,4.5vw,4.2rem)] text-[#232A2A]">Meet the architects of our crazy dream.</h2>
            </Reveal>
            <Reveal delay={140} as="p" className="font-editorial mt-5 max-w-[52ch] text-[clamp(1.1rem,1.4vw,1.35rem)] italic leading-[1.5] text-[#232A2A]/78">
              {TEAM_QUOTE}
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {CHARACTERS.map((c, i) => (
                <Reveal key={c.name} delay={i * 80}>
                  <figure className="char-card scrap float-el" style={{ "--rot": `${(i % 2 === 0 ? -1 : 1) * (0.8 + (i % 3) * 0.5)}deg`, animationDelay: `${i * 0.45}s` }} data-testid={`character-${c.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    {/* Well below the fold, so the grain actually has room to
                        resolve as you scroll into the parade. */}
                    <div style={{ aspectRatio: "3/4" }}>
                      <DissolveImage
                        src={c.img}
                        alt={`${c.name} — halftone collage figure`}
                        className="h-full w-full"
                        maxScale={70}
                        start="top 92%"
                        end="top 55%"
                        testId={`character-dissolve-${i}`}
                      />
                    </div>
                    <figcaption className="border-t-[3px] border-[#F19020] bg-[#232A2A] p-3">
                      <p className="font-display text-[17px] leading-none text-[#F7F5EE]">{c.name}</p>
                      <p className="font-editorial mt-1.5 text-[13.5px] italic leading-[1.35] text-[#F7F5EE]/70">{c.line}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <p className="font-mono-sys mt-5 text-[12.5px] text-[#232A2A]/50">The team changes shape per problem. These are the instincts that never leave the room.</p>
          </div>
        </div>
      </section>
      <NextSteps from="/why-hi-anzy" />
    </div>
  );
}
