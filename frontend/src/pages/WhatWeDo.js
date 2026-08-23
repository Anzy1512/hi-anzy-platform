import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { RouteLine } from "@/components/RouteLine";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { CATEGORIES } from "@/data/content";
import { CharacterQuote } from "@/components/CharacterQuote";
import { Packages } from "@/components/Packages";
import { PackageBuilder } from "@/components/PackageBuilder";

export default function WhatWeDo() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[84px]" data-testid="what-we-do-page">
      <Seo title="What We Do — hiAnzy" description="Business audit and strategy, brand and experience, technology and automation, growth, media and creators, advisory and scale — run as one connected system." />
      <section className="container-page section-pad">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> WHAT WE DO
        </Reveal>
        {/* The headline sat alone with the right half of the page empty. The
            collage banner takes it — it moved here from the home page, where it
            was duplicating the pop figure two sections below it. */}
        <div className="mt-5 grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <h1 className="font-display leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="what-we-do-h1">
                What does hiAnzy actually do<span className="accent-signal-text">?</span>
              </h1>
            </Reveal>
            <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
              We work on how a business is understood, how it operates and how it grows. Which often means
              connecting departments that did not realise they were working on the same problem.
              <span className="font-semibold"> Everything connects.</span>
            </Reveal>
            <Reveal delay={220} className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#build" className="btn-ink inline-flex items-center gap-2" data-testid="wwd-build-jump">
                Build your own <ArrowRight size={15} />
              </a>
              <Link to="/how-we-work" className="link-draw text-[14px] font-semibold text-[#232A2A]">
                Or see how the work actually runs
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <figure className="banner-figure relative mx-auto max-w-[380px]" data-parallax="16">
                <span className="banner-figure-halo" aria-hidden="true" />
                <img
                  src="/brand/art-cube-head.png"
                  alt="Halftone collage — a person with a puzzle cube for a head"
                  loading="lazy"
                  className="relative w-full"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-page space-y-8 section-pad-b">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.num}>
            <article className={`relative grid gap-8 overflow-hidden rounded-[18px] p-7 sm:p-10 lg:grid-cols-12 ${i % 2 === 0 ? "panel-paper" : "panel-dark"}`} data-testid={`wwd-category-${c.num}`}>
              <RouteLine d="M0,90 C 30,60 60,100 100,55" viewBox="0 0 100 100" strokeWidth={1.2} className="pointer-events-none absolute inset-0 h-full w-full opacity-25" />
              <div className="relative lg:col-span-5">
                {/* Bright orange is 2.2:1 on paper. The accent token resolves
                    per ground, so the same class stays legible on both tiles. */}
                <span className="font-display accent-orange-text block text-6xl leading-none">{c.num}</span>
                <h2 className={`font-display mt-4 text-[clamp(2.1rem,3.3vw,3.5rem)] leading-[0.98] ${i % 2 === 0 ? "text-[#232A2A]" : "text-[#F7F5EE]"}`}>
                  <Link
                    to={`/what-we-do/${c.slug}`}
                    className="link-draw-heading"
                    onClick={() => track("service_explored", { category: c.label, to: "service_detail" })}
                  >
                    {c.label}
                  </Link>
                </h2>
                <p className={`font-editorial mt-2 text-[clamp(1.2rem,1.5vw,1.5rem)] font-medium ${i % 2 === 0 ? "text-[#232A2A]/65" : "text-[#F7F5EE]/65"}`}>{c.title}</p>
                <p className={`mt-4 text-[17px] leading-[1.6] ${i % 2 === 0 ? "text-[#232A2A]/80" : "text-[#F7F5EE]/80"}`}>{c.copy}</p>
                <p className={`mt-4 text-[16.5px] leading-[1.58] ${i % 2 === 0 ? "text-[#232A2A]/70" : "text-[#F7F5EE]/70"}`}><span className={`font-mono-sys text-[12.5px] font-bold tracking-widest ${i % 2 === 0 ? "text-[#A8351A]" : "text-[#FF7A52]"}`}>Why it matters — </span>{c.why}</p>
              </div>
              <div className="relative lg:col-span-7">
                <p className={`sys-chip ${i % 2 === 0 ? "text-[#232A2A]/45" : "text-[#F7F5EE]/45"}`}>CAPABILITIES</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.capabilities.map((cap) => (
                    <li key={cap} className={`sys-chip rounded-full border px-3 py-1.5 ${i % 2 === 0 ? "border-[#F19020]/70 text-[#232A2A]/80" : "border-[#F19020]/60 text-[#F7F5EE]/85"}`}>{cap}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className={`sys-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${i % 2 === 0 ? "bg-[#232A2A] text-[#F7F5EE]" : "bg-[#F7F5EE] text-[#232A2A]"}`}>
                    METHOD STAGE · {c.methodStage}
                  </span>
                  <Link to="/work" className={`link-draw text-[13.5px] font-semibold ${i % 2 === 0 ? "text-[#232A2A]" : "accent-orange-text"}`} onClick={() => track("service_explored", { category: c.label, to: "work" })}>
                    Related work
                  </Link>
                  <Link to="/contact" className={`link-draw text-[13.5px] font-semibold ${i % 2 === 0 ? "text-[#232A2A]" : "accent-orange-text"}`}>
                    Talk about this
                  </Link>
                  <Link
                    to={`/what-we-do/${c.slug}`}
                    className={`inline-flex items-center gap-1.5 text-[13.5px] font-semibold ${i % 2 === 0 ? "text-[#232A2A]" : "accent-orange-text"}`}
                    data-testid={`wwd-read-more-${c.slug}`}
                    onClick={() => track("service_explored", { category: c.label, to: "service_detail" })}
                  >
                    Read the full page <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}

        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[18px] bg-[#D8CFB4]/60 p-8">
            <p className="font-display text-3xl text-[#232A2A] sm:text-4xl">One business. One system. One brief away.</p>
            <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="wwd-bottom-cta" onClick={() => track("cta_primary_click", { cta: "what_we_do_bottom" })}>
              Start a Conversation <ArrowRight size={15} />
            </MagneticButton>
          </div>
        </Reveal>
      </div>
      <Packages />
      <PackageBuilder />
      <div className="pb-16">
        <CharacterQuote />
      </div>
    </div>
  );
}
