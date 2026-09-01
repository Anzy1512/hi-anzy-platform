import React, { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { EvidenceDeck } from "@/components/EvidenceDeck";
import { ORBIT_CATEGORIES } from "@/data/content";
import { ORBIT_GLYPHS } from "@/components/deck/OrbitGlyphs";

/**
 * "The Hi Anzy Orbit" — sits between the verified case studies and the
 * portfolio archive on /work. Opens collapsed behind a single tappable bar
 * and expands into the full section in place, rather than dropping the full
 * 3D fan-deck on the reader outright.
 */
export const OrbitSection = () => {
  const [expanded, setExpanded] = useState(false);
  const items = useMemo(
    () => ORBIT_CATEGORIES.map((c) => ({ ...c, id: c.key, Glyph: ORBIT_GLYPHS[c.key] })),
    []
  );

  // Plain section-pad, no extra margin. This section used to carry an added
  // mt-10 lg:mt-14 on top of the standard system, on the reasoning that
  // App.css's adjacent-.section-pad-b rule zeroed its own top padding and
  // left nothing between it and Case Studies. Measured live, that reasoning
  // was wrong: the rule was already working, and the extra margin sat on top
  // of a gap that was already correct — this was the one boundary on the
  // entire site with visibly more space than every other section-to-section
  // transition. Removed so this boundary matches the standard rhythm exactly
  // like every other one does.
  return (
    <section className="container-page section-pad" data-index-label="THE HI ANZY ORBIT" data-testid="orbit-section">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-expanded={expanded}
        disabled={expanded}
        data-testid="orbit-explore-bar"
        className={`group flex w-full items-center justify-between gap-4 rounded-full border border-[#232A2A]/15 bg-[#F7F5EE] px-6 py-4 text-left transition-colors ${expanded ? "cursor-default" : "hover:border-[#F19020]"}`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="inline-block h-[3px] w-8 shrink-0 rounded-full bg-[#F19020]" />
          <span className="sys-chip shrink-0 text-[#232A2A]/60">THE HI ANZY ORBIT</span>
          <span className="truncate font-display text-[17px] text-[#232A2A]">Six ways into the wider system.</span>
        </span>
        {/* "Tap to explore" removed: the whole bar is already the tappable
            surface (onClick + hover:border-orange on the button itself), so
            the prompt was redundant microcopy rather than the only signal of
            interactivity. */}
        {!expanded && <ArrowRight size={14} className="shrink-0 text-[#232A2A]/50 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
            data-testid="orbit-section-expanded"
          >
            <div className="pt-10">
              <Reveal delay={80}>
                <h2 className="font-display leading-[0.98] text-[#232A2A] text-[clamp(2.2rem,4.2vw,3.8rem)]">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
