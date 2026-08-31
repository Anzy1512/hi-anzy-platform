import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * A horizontal, snap-scrolling deck of cards.
 *
 * Built for the discipline grid on /network and the insight list on
 * /insights, both of which used to lay every card out flat — sixteen tiles
 * or a full column, all visible and all competing for attention at once.
 * This shows a handful at a time and lets the reader deal themselves the
 * next: drag, scroll, or the arrows.
 *
 * The "deck" read comes from a scroll-driven scale/opacity pass on each
 * child — centred cards sit full-size and full-opacity, cards nearer the
 * edge recede — rather than from any layout trick, so the caller can pass
 * plain cards and this stays in charge of nothing but motion.
 */
export const CardCarousel = ({ children, label = "", testId = "card-carousel" }) => {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    Array.from(el.children).forEach((child) => {
      const r = child.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - cx) / (rect.width / 2 || 1);
      const t = Math.min(dist, 1);
      child.style.opacity = String(1 - t * 0.4);
      child.style.transform = `scale(${(1 - t * 0.06).toFixed(3)})`;
    });
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };
    sync();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sync, children]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[0];
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.82;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative" data-testid={testId}>
      <div ref={trackRef} className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2" data-testid={`${testId}-track`}>
        {children}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="sys-chip text-[#232A2A]/45">{label}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#232A2A]/20 text-[#232A2A] transition-colors hover:border-[#F19020] disabled:opacity-30"
            aria-label="Scroll back"
            data-testid={`${testId}-prev`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#232A2A]/20 text-[#232A2A] transition-colors hover:border-[#F19020] disabled:opacity-30"
            aria-label="Scroll forward"
            data-testid={`${testId}-next`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
