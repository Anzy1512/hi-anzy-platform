import React, { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A small ticker for the top-right of the closing panel, which was empty
 * because the copy beside it is capped at 24ch.
 *
 * The panel argues that a brand is "hundreds of small interactions". Printing
 * a few of them, one at a time, with a count that keeps climbing, makes that
 * argument better than another sentence would. The count is deliberately
 * larger than the list — the point is that these are a sample, not the set.
 *
 * Pauses when off-screen or when the tab is hidden, so it is not animating
 * into an empty room.
 */
const TOUCHPOINTS = [
  "The pricing page at 11pm",
  "The reply that took four days",
  "The checkout that asked twice",
  "The invoice with the wrong name",
  "The delivery that arrived early",
  "The onboarding email nobody read",
  "The support call that got solved",
  "The renewal notice, unannounced",
  "The receipt that never came",
  "The follow-up that felt human",
];

export const TouchpointTicker = ({ className = "", testId = "touchpoint-ticker" }) => {
  const wrapRef = useRef(null);
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(214);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || prefersReducedMotion()) return undefined;

    let timer = null;
    let onScreen = false;

    const tick = () => {
      setVisible(false);
      window.setTimeout(() => {
        setI((p) => (p + 1) % TOUCHPOINTS.length);
        setCount((c) => c + Math.floor(Math.random() * 3) + 1);
        setVisible(true);
      }, 300);
    };

    const start = () => {
      if (timer) return;
      timer = window.setInterval(tick, 2600);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0.2 }
    );
    io.observe(wrap);

    const onVisibility = () => {
      if (document.hidden || !onScreen) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} data-testid={testId} aria-hidden="true">
      <div className="rounded-[14px] border border-[#F7F5EE]/15 bg-[#F7F5EE]/[0.04] px-5 py-4 backdrop-blur-[1px]">
        <div className="flex items-center justify-between gap-4">
          <span className="sys-chip text-[#F7F5EE]/45">INTERACTIONS, TODAY</span>
          <span className="font-display text-[26px] leading-none accent-orange-text tabular-nums">{count}</span>
        </div>
        <p
          className="font-mono-sys mt-3 min-h-[34px] text-[13px] leading-[1.45] text-[#F7F5EE]/70"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(5px)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}
        >
          {TOUCHPOINTS[i]}
        </p>
        <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-[#F7F5EE]/12">
          <span
            className="block h-full bg-[#F19020]"
            style={{
              width: `${((i + 1) / TOUCHPOINTS.length) * 100}%`,
              transition: "width 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
        <p className="font-mono-sys mt-2.5 text-[11.5px] leading-[1.4] text-[#F7F5EE]/40">
          A sample. Not the set. Every one of them is the brand.
        </p>
      </div>
    </div>
  );
};
