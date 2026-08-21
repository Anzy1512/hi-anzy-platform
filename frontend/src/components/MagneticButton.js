import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Soft magnetic button (max ~8px pull) with optional hover micro-copy swap.
 * Renders a <Link> when `to` is provided, otherwise a <button>.
 */
export const MagneticButton = ({ children, hoverText, to, href, onClick, className = "btn-ink", testId, type = "button", ariaLabel }) => {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);

  const onMove = (e) => {
    if (prefersReducedMotion() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const max = 8;
    const x = Math.max(-max, Math.min(max, dx * 0.15));
    const y = Math.max(-max, Math.min(max, dy * 0.15));
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    setHover(false);
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const inner = (
    <span className="grid overflow-hidden">
      <span
        className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300"
        style={hoverText ? { opacity: hover ? 0 : 1, transform: hover ? "translateY(-110%)" : "none" } : undefined}
      >
        {children}
      </span>
      {hoverText && (
        <span
          className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300"
          aria-hidden="true"
          style={{ opacity: hover ? 1 : 0, transform: hover ? "none" : "translateY(110%)" }}
        >
          {hoverText}
        </span>
      )}
    </span>
  );

  const common = {
    ref,
    className: `${className} will-change-transform`,
    style: { transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)" },
    onMouseMove: onMove,
    onMouseEnter: () => setHover(true),
    onMouseLeave: onLeave,
    onClick,
    "data-testid": testId,
    "aria-label": ariaLabel,
  };

  if (to) return <Link to={to} {...common}>{inner}</Link>;
  if (href) return <a href={href} {...common}>{inner}</a>;
  return <button type={type} {...common}>{inner}</button>;
};
