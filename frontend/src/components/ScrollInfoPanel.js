import React, { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * A panel of detail that advances itself as the section scrolls past.
 *
 * The stage cards on /how-we-work occupy five of twelve columns, so the other
 * seven were empty paper on every one of the five stages. This fills them with
 * the detail people actually want at that moment — what we need from you, what
 * lands at the end, and where it usually goes wrong — advancing one card at a
 * time so the space stays quiet rather than becoming a wall of text.
 *
 * Scroll position drives which card is showing, so it is never animating for
 * its own sake: stop scrolling and it stops. Reduced motion and small screens
 * get every card stacked and static, because a scroll-driven reveal on a phone
 * is just content you cannot reach.
 */
export const ScrollInfoPanel = ({
  cards = [],
  align = "left",
  className = "",
  testId = "scroll-info-panel",
}) => {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);
  const [scrubbed, setScrubbed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || cards.length === 0) return undefined;

    // Below lg the panel renders stacked, and on reduced motion we never
    // hijack scroll position for presentation.
    const enabled = window.matchMedia("(min-width: 1024px)").matches && !prefersReducedMotion();
    if (!enabled) {
      setScrubbed(false);
      return undefined;
    }
    setScrubbed(true);

    // scrub fires on every frame; only re-render when the card actually
    // changes, which is at most `cards.length` times across the whole section.
    let current = -1;
    const apply = (p) => {
      const idx = Math.min(cards.length - 1, Math.max(0, Math.floor(p * cards.length)));
      if (idx === current) return;
      current = idx;
      setActive(idx);
    };

    const st = gsap.to(
      {},
      {
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 78%",
          end: "bottom 35%",
          scrub: 0.4,
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => apply(self.progress),
        },
      }
    );

    return () => {
      st.scrollTrigger && st.scrollTrigger.kill();
      st.kill();
    };
  }, [cards.length]);

  if (cards.length === 0) return null;

  return (
    <div
      ref={wrapRef}
      className={`scroll-info ${align === "right" ? "scroll-info--right" : ""} ${className}`}
      data-testid={testId}
      data-scrubbed={scrubbed ? "true" : "false"}
    >
      {/* Progress pips double as the affordance that there is more here. */}
      {scrubbed && (
        <div className="scroll-info-pips" aria-hidden="true">
          {cards.map((c, i) => (
            <span key={c.label} className={`scroll-info-pip ${i === active ? "is-active" : ""}`} />
          ))}
        </div>
      )}

      <div className={scrubbed ? "scroll-info-stack" : "space-y-4"}>
        {cards.map((card, i) => (
          <article
            key={card.label}
            className={`scroll-info-card ${scrubbed && i !== active ? "is-hidden" : "is-shown"}`}
            aria-hidden={scrubbed && i !== active ? "true" : undefined}
            data-testid={`${testId}-card-${i}`}
          >
            <p className="sys-chip text-[#232A2A]/50">{card.label}</p>
            {card.items ? (
              <ul className="mt-3 space-y-2">
                {card.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[16px] leading-[1.55] text-[#232A2A]/85">
                    <span className="scroll-info-bullet" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[16px] leading-[1.6] text-[#232A2A]/85">{card.text}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
