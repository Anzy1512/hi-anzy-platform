import React, { useRef, useState } from "react";
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
    <footer className="relative overflow-hidden bg-[#1D2424] text-[#F7F5EE]" data-testid="site-footer">
      <div className="container-page section-pad">
        <p className="font-editorial max-w-[26ch] text-[clamp(1.7rem,2.9vw,3.1rem)] leading-[1.14]" data-testid="footer-large-text">
          Still here? You are either <span className="hl-marker">thorough</span>. Curious. Or successfully avoiding another meeting.
          <em className="text-[#F19020]"> We respect all three.</em>
        </p>
        <p className="mt-6 font-editorial text-[18px] text-[#F7F5EE]/75">
          Have something worth discussing?{" "}
          <Link to="/contact" className="link-draw font-semibold text-[#F19020]" data-testid="footer-say-hi-link">
            Say hi.
          </Link>
        </p>

        {/* Contextual micro-interaction: the tagline as a live route — ABC drifts toward ROI */}
        <div
          ref={zoneRef}
          onMouseMove={onMove}
          onMouseLeave={() => { setOffset({ x: 0, y: 0 }); setConnected(false); }}
          className="relative mt-12 hidden h-16 items-center rounded-xl border border-dashed border-[#F7F5EE]/15 px-8 lg:flex"
          data-testid="footer-easter-egg"
          aria-hidden="true"
        >
          <span className="sys-chip absolute -top-2.5 left-6 bg-[#1D2424] px-2 text-[11px] tracking-[0.18em] text-[#F7F5EE]/40">
            THE ROUTE
          </span>
          <span
            className="qmark-node font-mono-sys inline-flex h-8 items-center justify-center rounded-full border border-[#F19020] px-3 text-[12px] tracking-[0.14em] text-[#F19020]"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          >
            ABC
          </span>
          <span className="absolute left-[82%] top-1/2 flex -translate-y-1/2 items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F19020]" />
            <span className="font-mono-sys text-[12px] tracking-[0.14em] text-[#F19020]">ROI</span>
          </span>
          <span className="absolute left-[30%] right-[20%] top-1/2 hidden border-t-[3px] border-dotted border-[#F19020]/35 lg:block" />
          <span className={`sys-chip absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1D2424] px-3 text-[#F19020] transition-opacity duration-300 ${connected ? "opacity-100" : "opacity-0"}`}>
            That's the whole journey.
          </span>
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
            <p className="font-mono-sys mt-4 text-[12.5px] leading-relaxed text-[#F7F5EE]/40">Bring the brief. Or bring the problem. We can start with either.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#F7F5EE]/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[22px] tracking-wide" data-testid="footer-bottom-line">
            From ABC to ROI. <span className="text-[#F7F5EE]/50">© Hi Anzy.</span>
          </p>
          <p className="font-mono-sys text-[12.5px] text-[#F7F5EE]/38" data-testid="footer-small-line">Built with strategy, curiosity and far too many browser tabs.</p>
        </div>
      </div>
    </footer>
  );
};
