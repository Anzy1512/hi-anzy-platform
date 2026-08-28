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
 * unavailable, or when the user prefers reduced motion. Same concept as the
 * WebGL scene it stands in for: a scattered network of business functions,
 * meshed together and unified by one core — not a literal frame-by-frame
 * match (a static picture cannot orbit or pulse), but the same idea.
 */
const CORE_SPOKES = [
  [65.0, 55.5], [44.5, 65.0], [34.9, 44.5], [55.5, 34.9],
];
const MESH_EDGES = [
  // ring A -> ring B
  [[65.0, 55.5], [79.0, 57.8]], [[65.0, 55.5], [57.8, 79.0]],
  [[44.5, 65.0], [57.8, 79.0]], [[44.5, 65.0], [28.8, 71.2]],
  [[34.9, 44.5], [21.0, 42.2]], [[34.9, 44.5], [42.2, 21.0]],
  [[55.5, 34.9], [42.2, 21.0]], [[55.5, 34.9], [71.2, 28.8]],
  // ring B -> ring C
  [[79.0, 57.8], [79, 79]], [[57.8, 79.0], [79, 79]],
  [[28.8, 71.2], [21, 79]], [[21.0, 42.2], [21, 21]],
  [[42.2, 21.0], [21, 21]], [[71.2, 28.8], [79, 21]],
  // ring C outer loop
  [[79, 79], [21, 79]], [[21, 79], [21, 21]], [[21, 21], [79, 21]], [[79, 21], [79, 79]],
];
const NODES = [
  ...CORE_SPOKES, [79.0, 57.8], [57.8, 79.0], [28.8, 71.2], [21.0, 42.2], [42.2, 21.0], [71.2, 28.8],
  [79, 79], [21, 79], [21, 21], [79, 21],
];
const STAGES = ["AUDIT", "ARCHITECT", "BUILD", "CONNECT", "SCALE"];

export const SystemCoreFallback = () => (
  <div className="relative h-full w-full" data-testid="hero-system-core-fallback">
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Diagram: a scattered network of business functions, meshed together and unified by one central system">
      {MESH_EDGES.map(([[x1, y1], [x2, y2]], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#232A2A" strokeWidth="0.5" opacity="0.32" />
      ))}
      {CORE_SPOKES.map(([x, y], i) => (
        <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="#F19020" strokeWidth="0.9" opacity="0.85" />
      ))}
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill="#F7F5EE" stroke="#232A2A" strokeWidth="0.5" />
      ))}
      <circle cx="50" cy="50" r="5.6" fill="#F19020" />
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
