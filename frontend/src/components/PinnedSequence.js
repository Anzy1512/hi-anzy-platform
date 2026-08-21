import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Pinned storytelling.
 *
 * The section holds still while scroll advances it through its steps, so the
 * method reads as one continuous move instead of five stacked blocks.
 *
 * Two deliberate constraints:
 *  - Pinning is desktop-only. On a short viewport a pin eats the whole screen
 *    and the reader loses their place, which is exactly the continuity break
 *    we are trying to avoid.
 *  - Every step is in the DOM the whole time; only opacity/transform change.
 *    Reduced motion drops the pin entirely and renders a plain list, so the
 *    content is never gated behind an animation.
 */
export const PinnedSequence = ({ steps = [], kicker, title, testId = "pinned-sequence" }) => {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || steps.length === 0) return undefined;

    const canPin = window.matchMedia("(min-width: 1024px)").matches && !prefersReducedMotion();
    if (!canPin) {
      setPinned(false);
      setActive(0);
      return undefined;
    }

    setPinned(true);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      // one viewport of scroll per step keeps the pacing even
      end: () => `+=${window.innerHeight * steps.length * 0.85}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.4,
      anticipatePin: 1,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        setActive((prev) => (prev === idx ? prev : idx));
      },
    });

    // Layout settles after fonts/lazy content — recalculate or the pin ends early.
    const settle = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(settle);
      trigger.kill();
    };
  }, [steps.length]);

  if (steps.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="pinned-sequence bg-[#1D2424] py-16 lg:py-0"
      data-testid={testId}
      data-pinned={pinned ? "true" : "false"}
    >
      <div className="container-page flex min-h-[auto] flex-col justify-center lg:min-h-screen">
        {kicker && (
          <p className="sys-chip flex items-center gap-3 text-[#F7F5EE]/70">
            <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> {kicker}
          </p>
        )}
        {title && (
          <h2 className="font-display mt-5 max-w-3xl leading-[0.98] text-[#F7F5EE] text-[clamp(2.2rem,4.4vw,3.8rem)]">
            {title}
          </h2>
        )}

        {/* progress rail */}
        <ol className="mt-10 flex flex-wrap gap-2" aria-label="Sequence progress">
          {steps.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                data-testid={`${testId}-step-${i}`}
                className={`sys-chip rounded-full border px-3.5 py-1.5 transition-colors ${
                  i === active
                    ? "border-[#F19020] bg-[#F19020] text-[#232A2A]"
                    : i < active
                      ? "border-[#F7F5EE]/45 text-[#F7F5EE]/75"
                      : "border-[#F7F5EE]/20 text-[#F7F5EE]/50"
                }`}
              >
                {String(i + 1).padStart(2, "0")} {s.label}
              </button>
            </li>
          ))}
        </ol>

        {/* steps: all mounted, cross-faded */}
        <div className="relative mt-8 grid" data-testid={`${testId}-panels`}>
          {steps.map((s, i) => (
            <article
              key={s.label}
              aria-hidden={i !== active}
              className="col-start-1 row-start-1 max-w-3xl transition-all duration-500"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? "translateY(0)" : "translateY(14px)",
                pointerEvents: i === active ? "auto" : "none",
                visibility: i === active ? "visible" : "hidden",
              }}
            >
              <p className="font-editorial text-[clamp(1.4rem,2.4vw,2.1rem)] font-medium leading-[1.25] text-[#F7F5EE]">
                {s.title}
              </p>
              <p className="mt-4 max-w-[58ch] text-[17px] leading-[1.65] text-[#F7F5EE]/80">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
