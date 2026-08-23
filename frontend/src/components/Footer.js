import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NAV_LINKS, FOOTER_LINKS } from "@/data/content";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Footer with a contextual micro-interaction: the brand tagline as a live route.
 * An "ABC" node drifts toward the "ROI" endpoint when the pointer gets close.
 * On connection: "That's the whole journey."
 */
export const Footer = () => {
  const zoneRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [connected, setConnected] = useState(false);

  /**
   * The footer sits outside <main>, and useRevealObserver only watches inside
   * the page container it is given. Anything using .reveal down here therefore
   * never receives .is-visible — the route's rail stayed at scaleX(0) and was
   * simply invisible. The footer keeps its own observer.
   */
  useEffect(() => {
    const el = zoneRef.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) {
      el.classList.add("is-visible");
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-visible");
        io.disconnect();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e) => {
    if (prefersReducedMotion() || !zoneRef.current) return;
    const r = zoneRef.current.getBoundingClientRect();
    const nodeX = r.left + r.width * 0.18;
    const nodeY = r.top + r.height * 0.5;
    const targetX = r.left + r.width * 0.82;
    const dx = e.clientX - nodeX;
    const dy = e.clientY - nodeY;
    const dist = Math.hypot(dx, dy);
    if (dist < 180) {
      const pull = 1 - dist / 180;
      const toTargetX = (targetX - nodeX) * pull;
      setOffset({ x: toTargetX, y: (e.clientY - nodeY) * 0.12 * pull });
      setConnected(pull > 0.82);
    } else {
      setOffset({ x: 0, y: 0 });
      setConnected(false);
    }
  };

  return (
    <footer className="site-footer relative overflow-hidden bg-[#1D2424] text-[#F7F5EE]" data-testid="site-footer">
      <div className="container-page section-pad">
        {/* The closing line is capped at 26ch, so the right of the footer was
            empty while the ABC → ROI route sat in a full-width strip below it
            doing the same job with less room. The route moves into that column
            and the strip goes. It also draws itself on reveal now: it used to
            animate only when a pointer came near, so on a phone it was a
            static diagram of nothing happening. */}
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-editorial max-w-[26ch] text-[clamp(1.7rem,2.9vw,3.1rem)] leading-[1.14]" data-testid="footer-large-text">
              Still here? You are either <span className="hl-marker hl-marker-draw">thorough</span>. Curious. Or successfully avoiding another meeting.
              <em className="accent-orange-text"> We respect all three.</em>
            </p>
            <p className="mt-6 font-editorial text-[18px] text-[#F7F5EE]/75">
              Have something worth discussing?{" "}
              <Link to="/contact" className="link-draw font-semibold accent-orange-text" data-testid="footer-say-hi-link">
                Say hi.
              </Link>
            </p>
          </div>

          <div className="lg:col-span-5">
            <div
              ref={zoneRef}
              onMouseMove={onMove}
              onMouseLeave={() => { setOffset({ x: 0, y: 0 }); setConnected(false); }}
              className="footer-route reveal rounded-[18px] border border-[#F7F5EE]/15 bg-[#F7F5EE]/[0.04] p-6 sm:p-7"
              data-testid="footer-easter-egg"
            >
              <p className="sys-chip text-[#F7F5EE]/50">THE WHOLE JOURNEY</p>

              <div className="relative mt-6 flex h-14 items-center" aria-hidden="true">
                <span
                  className="qmark-node font-mono-sys relative z-10 inline-flex h-9 items-center justify-center rounded-full border border-[#F19020] bg-[#1D2424] px-3.5 text-[12.5px] tracking-[0.14em] accent-orange-text"
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
                >
                  ABC
                </span>

                <span className="footer-route-rail absolute left-[16%] right-[24%] top-1/2 -translate-y-1/2" />

                <span className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 bg-[#1D2424] pl-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F19020]" />
                  <span className="font-mono-sys text-[12.5px] tracking-[0.14em] accent-orange-text">ROI</span>
                </span>

                <span className={`sys-chip absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1D2424] px-3 py-1 accent-orange-text transition-opacity duration-300 ${connected ? "opacity-100" : "opacity-0"}`}>
                  That&rsquo;s the whole journey.
                </span>
              </div>

              <p className="font-mono-sys mt-5 text-[12.5px] leading-[1.5] text-[#F7F5EE]/55">
                Everything on this site sits somewhere on that line. Drag your
                cursor across it if you want to watch it close.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#F7F5EE]/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/brand/logo-light.png" alt="hiAnzy" className="h-12 w-auto" />
            <p className="mt-4 max-w-[260px] font-editorial text-[16.5px] leading-[1.5] text-[#F7F5EE]/60">Business Systems & Transformation Consultancy.</p>
          </div>
          <nav aria-label="Footer primary">
            <p className="sys-chip mb-4 text-[#F7F5EE]/45">Explore</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-draw text-[16px] text-[#F7F5EE]/80" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer secondary">
            <p className="sys-chip mb-4 text-[#F7F5EE]/45">More</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="link-draw text-[16px] text-[#F7F5EE]/80" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="sys-chip mb-4 text-[#F7F5EE]/45">Start</p>
            <Link to="/contact" className="btn-orange" data-testid="footer-say-hi-cta">Say Hi</Link>
            <p className="font-mono-sys mt-4 text-[12.5px] leading-relaxed text-[#F7F5EE]/62">Bring the brief. Or bring the problem. We can start with either.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#F7F5EE]/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[22px] tracking-wide" data-testid="footer-bottom-line">
            From ABC to ROI. <span className="text-[#F7F5EE]/50">© hiAnzy.</span>
          </p>
          <p className="font-mono-sys text-[12.5px] text-[#F7F5EE]/62" data-testid="footer-small-line">Built with strategy, curiosity and far too many browser tabs.</p>
        </div>
      </div>
    </footer>
  );
};
