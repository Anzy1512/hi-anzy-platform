import React from "react";

/** Error boundary: if a 3D scene ever fails at runtime, fall back to the editorial diagram. */
export class ThreeSafe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * Static system diagram — shown while the 3D core loads, when WebGL is
 * unavailable, or when the user prefers reduced motion. Content-complete:
 * same nodes, same route, same resolution to ROI.
 */
const NODES = [
  { l: "BRAND", x: 24, y: 30 }, { l: "CUSTOMER", x: 66, y: 20 }, { l: "SALES", x: 82, y: 44 },
  { l: "TECH", x: 30, y: 56 }, { l: "CONTENT", x: 58, y: 50 }, { l: "DATA", x: 18, y: 78 },
  { l: "OPERATIONS", x: 48, y: 78 }, { l: "GROWTH", x: 78, y: 72 },
];
const STAGES = ["AUDIT", "ARCHITECT", "BUILD", "CONNECT", "SCALE"];

export const SystemCoreFallback = () => (
  <div className="relative h-full w-full" data-testid="hero-system-core-fallback">
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Diagram: disconnected business functions — brand, customer, sales, tech, content, data, operations, growth — connected by one orange route resolving to ROI">
      <path d="M6,14 C 20,26 18,34 24,30 C 40,34 60,12 66,20 C 80,26 88,36 82,44 C 70,54 40,50 30,56 C 20,64 12,72 18,78 C 30,86 40,82 48,78 C 60,74 70,70 78,72 C 86,74 92,80 94,86" fill="none" stroke="#F19020" strokeWidth="1.6" strokeLinecap="round" />
      {NODES.map((n) => (
        <g key={n.l}>
          <rect x={n.x - 9} y={n.y - 4} width="18" height="8" rx="1.6" fill="#F7F5EE" stroke="#232A2A" strokeWidth="0.4" />
          <text x={n.x} y={n.y + 1.3} textAnchor="middle" fontSize="3.1" fontFamily="'Rajdhani', sans-serif" fill="#232A2A" fontWeight="600">{n.l}</text>
        </g>
      ))}
      <circle cx="94" cy="86" r="4.4" fill="#E54A25" />
      <text x="94" y="87.4" textAnchor="middle" fontSize="3.4" fontFamily="'Rajdhani', sans-serif" fill="#F7F5EE" fontWeight="700">ROI</text>
      {STAGES.map((s, i) => (
        <text key={s} x={8 + i * 20} y="97" fontSize="2.6" fontFamily="'Rajdhani', sans-serif" fill="#F7F5EE" opacity="0.75">{`0${i + 1} ${s}`}</text>
      ))}
    </svg>
  </div>
);

export const ConstellationFallback = ({ categories = [] }) => (
  <div className="flex h-full w-full items-center justify-center p-6" data-testid="network-constellation-fallback">
    <svg viewBox="0 0 100 60" className="h-full max-h-[360px] w-full" role="img" aria-label="Diagram: hiAnzy at the centre of a specialist network">
      <circle cx="50" cy="30" r="5" fill="#F19020" />
      <text x="50" y="31.5" textAnchor="middle" fontSize="3" fontFamily="'Rajdhani', sans-serif" fill="#232A2A" fontWeight="700">hiAnzy</text>
      {categories.slice(0, 12).map((c, i) => {
        const a = (i / Math.min(categories.length, 12)) * Math.PI * 2;
        const x = 50 + Math.cos(a) * 34;
        const y = 30 + Math.sin(a) * 22;
        return (
          <g key={c}>
            <line x1="50" y1="30" x2={x} y2={y} stroke="#F19020" strokeWidth="0.35" opacity="0.45" strokeDasharray="1.5 1.5" />
            <circle cx={x} cy={y} r="1.6" fill="#F7F5EE" />
            <text x={x} y={y - 3} textAnchor="middle" fontSize="2.2" fontFamily="'Rajdhani', sans-serif" fill="#F7F5EE" opacity="0.85">{c.toUpperCase()}</text>
          </g>
        );
      })}
    </svg>
  </div>
);
