import React, { useMemo } from "react";
import { Reveal } from "@/components/Reveal";
import { EvidenceDeck } from "@/components/EvidenceDeck";
import { ORBIT_CATEGORIES } from "@/data/content";
import { ORBIT_GLYPHS } from "@/components/deck/OrbitGlyphs";

/**
 * "The Hi Anzy Orbit" — sits between the verified case studies and the
 * portfolio archive on /work. Six ecosystem categories, one deck: in-house
 * work, joint work, collaborators, creators, venues, partners.
 */
export const OrbitSection = () => {
  const items = useMemo(
    () => ORBIT_CATEGORIES.map((c) => ({ ...c, id: c.key, Glyph: ORBIT_GLYPHS[c.key] })),
    []
  );

  return (
    <section className="container-page section-pad" data-index-label="THE HI ANZY ORBIT" data-testid="orbit-section">
      <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
        <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> THE HI ANZY ORBIT
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-display mt-4 leading-[0.98] text-[#232A2A] text-[clamp(2.2rem,4.2vw,3.8rem)]">
          One consultancy.<br />A much wider operating system.
        </h2>
      </Reveal>
      <Reveal delay={140} as="p" className="font-editorial mt-6 max-w-[60ch] text-[clamp(1.05rem,1.3vw,1.3rem)] italic leading-[1.5] text-[#232A2A]/80">
        Some things are built here. Some are built together. And sometimes the real advantage is knowing exactly
        who, what or where the brief needs next.
      </Reveal>

      <div className="mt-14">
        <EvidenceDeck items={items} testId="orbit-deck" />
      </div>

      <p className="font-mono-sys mt-10 text-center text-[12.5px] text-[#232A2A]/50">
        Each card opens its own index — real names, honestly labelled, verified on the date shown.
      </p>
    </section>
  );
};
