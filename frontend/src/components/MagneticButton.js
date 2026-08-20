import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Button/link with a subtle magnetic hover pull and a micro-copy swap.
 * Props:
 *   to        — react-router Link target (renders <Link>); omit for <button>
 *   hoverText — text to show on hover (swaps with children)
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
    transition: "transform 0.2s ease",
  };

  const sharedProps = {
    ref: elRef,
    style,
    className,
    "data-testid": testId,
    onMouseMove: onMove,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: onLeave,
    onClick,
    ...rest,
  };

  const content = hoverText && hovered ? hoverText : children;

  return to ? (
    <Link to={to} {...sharedProps}>{content}</Link>
  ) : (
    <button type={type} {...sharedProps}>{content}</button>
  );
};
