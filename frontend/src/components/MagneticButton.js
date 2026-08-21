import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Button/link with a subtle magnetic hover pull and a micro-copy swap.
 *
 * Both the label and the hover micro-copy are rendered into the same grid cell
 * and cross-faded with a vertical slide, so the button never changes width and
 * the icon + text never wrap.
 *
 * Props:
 *   to        — react-router Link target (renders <Link>); omit for <button>
 *   hoverText — micro-copy revealed on hover
 *   testId    — data-testid value
 *   className — extra classes (appended after base btn class)
 *   onClick   — click handler
 */
export const MagneticButton = ({
  to,
  children,
  hoverText,
  className = "",
  testId,
  onClick,
  type = "button",
  ...rest
}) => {
  const elRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (prefersReducedMotion() || !elRef.current) return;
    const r = elRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left - r.width / 2) / r.width) * 10;
    const y = ((e.clientY - r.top - r.height / 2) / r.height) * 10;
    setPos({ x, y });
  };

  const onLeave = () => {
    setPos({ x: 0, y: 0 });
    setHovered(false);
  };

  const style = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const sharedProps = {
    ref: elRef,
    style,
    className: `${className} will-change-transform`.trim(),
    "data-testid": testId,
    onMouseMove: onMove,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: onLeave,
    onClick,
    ...rest,
  };

  const layer =
    "col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300";

  const content = (
    <span className="grid overflow-hidden">
      <span
        className={`${layer} ${
          hovered && hoverText ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {children}
      </span>
      {hoverText && (
        <span
          className={`${layer} ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {hoverText}
        </span>
      )}
    </span>
  );

  return to ? (
    <Link to={to} {...sharedProps}>{content}</Link>
  ) : (
    <button type={type} {...sharedProps}>{content}</button>
  );
};
