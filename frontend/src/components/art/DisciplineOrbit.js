import React from "react";

/**
 * The What We Do banner art, redrawn again — this time as a motion
 * infographic instead of an illustration. Six nodes, one for each discipline
 * on this page (Business Audit & Strategy through Advisory, Security &
 * Scale, in card order below), connect to one core and stay in gentle
 * motion: the lines draw themselves in on arrival, a signal keeps travelling
 * each connection, and the whole cluster drifts. It is the same argument the
 * copy above it makes — disconnected functions, meshed into one system —
 * told as a diagram instead of a figure, so the art and the six cards under
 * it are describing the same thing rather than sitting next to each other.
 *
 * Pure CSS/SVG, no WebGL: this is a page of static content with one hero
 * scene already spending the WebGL budget on Home. A second canvas here
 * would cost more than the moment is worth.
 */
const CORE = { x: 100, y: 120, r: 22 };
const RADIUS = 75;
const ANGLES = [-90, -30, 30, 90, 150, 210];
const NODES = ANGLES.map((deg, i) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: Math.round((CORE.x + Math.cos(rad) * RADIUS) * 100) / 100,
    y: Math.round((CORE.y + Math.sin(rad) * RADIUS) * 100) / 100,
    delay: i * 0.35,
    tone: i % 3,
  };
});
const TONE_FILL = ["url(#do-orange)", "url(#do-ink)", "url(#do-signal)"];

export const DisciplineOrbit = ({ className = "" }) => (
  <svg
    viewBox="0 0 200 240"
    className={className}
    role="img"
    aria-label="A diagram of six business disciplines connecting into one system"
  >
    <defs>
      <linearGradient id="do-core" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F19020" />
        <stop offset="100%" stopColor="#E54A25" />
      </linearGradient>
      <linearGradient id="do-orange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7C948" />
        <stop offset="100%" stopColor="#F19020" />
      </linearGradient>
      <linearGradient id="do-ink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#394343" />
        <stop offset="100%" stopColor="#1A2020" />
      </linearGradient>
      <linearGradient id="do-signal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F19020" />
        <stop offset="100%" stopColor="#E54A25" />
      </linearGradient>
      <radialGradient id="do-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F19020" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#F19020" stopOpacity="0" />
      </radialGradient>
    </defs>

    <g className="do-cluster">
      <circle cx={CORE.x} cy={CORE.y} r={RADIUS + 34} fill="url(#do-halo)" />

      {NODES.map((n, i) => (
        <line
          key={`line-${i}`}
          className="do-connector"
          x1={CORE.x}
          y1={CORE.y}
          x2={n.x}
          y2={n.y}
          stroke="#232A2A"
          strokeOpacity="0.28"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ animationDelay: `${n.delay}s` }}
        />
      ))}

      {NODES.map((n, i) => (
        <circle
          key={`pulse-${i}`}
          className="do-pulse"
          r="3.2"
          fill="#F19020"
          style={{
            offsetPath: `path("M${CORE.x},${CORE.y} L${n.x},${n.y}")`,
            animationDelay: `${1.4 + n.delay * 1.3}s`,
          }}
        />
      ))}

      {NODES.map((n, i) => (
        <circle
          key={`node-${i}`}
          className="do-node"
          cx={n.x}
          cy={n.y}
          r="13"
          fill={TONE_FILL[n.tone]}
          style={{ animationDelay: `${0.9 + n.delay}s, ${n.delay * 0.6}s` }}
        />
      ))}

      <circle className="do-core" cx={CORE.x} cy={CORE.y} r={CORE.r} fill="url(#do-core)" />
    </g>
  </svg>
);

export default DisciplineOrbit;
