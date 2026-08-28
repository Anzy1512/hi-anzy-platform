import React from "react";

/**
 * The What We Do banner art, redrawn.
 *
 * The original was a grayscale halftone photo collage — a person with a
 * Rubik's cube for a head — which is why the hover treatment used to be a
 * duotone wash: there was no colour in the source to reveal, only ink to
 * tint. This replaces the photo outright with a flat brand-coloured
 * illustration built from the same handful of shapes (backdrop, body, arm,
 * cube), each one a bold gradient rather than a grayscale region — so the
 * colour is the artwork now, not an effect layered on top of it.
 *
 * Same brand three: ink, paper, orange, signal. No new hue introduced.
 * Left colour-invariant across themes on purpose — a self-contained
 * illustration like this reads fine on both grounds without a dark-mode
 * remap, the way the rest of the brand's collage art already does.
 */
export const CubeHeadArt = ({ className = "" }) => (
  <svg
    viewBox="0 0 200 260"
    className={className}
    role="img"
    aria-label="A person with a Rubik's cube for a head, rendered in bold brand gradients"
  >
    <defs>
      <linearGradient id="cha-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F19020" />
        <stop offset="100%" stopColor="#E54A25" />
      </linearGradient>
      <linearGradient id="cha-face-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7F5EE" />
        <stop offset="100%" stopColor="#F19020" />
      </linearGradient>
      <linearGradient id="cha-face-left" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#394343" />
        <stop offset="100%" stopColor="#1A2020" />
      </linearGradient>
      <linearGradient id="cha-face-right" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F19020" />
        <stop offset="100%" stopColor="#E54A25" />
      </linearGradient>
      <linearGradient id="cha-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F7F5EE" />
      </linearGradient>
    </defs>

    <circle className="cha-backdrop" cx="100" cy="145" r="108" fill="url(#cha-bg)" />

    {/* arm, bent up to meet the cube */}
    <path
      className="cha-arm"
      d="M82,158 Q52,140 58,104"
      fill="none"
      stroke="#232A2A"
      strokeWidth="17"
      strokeLinecap="round"
    />

    {/* body */}
    <path className="cha-body" d="M70,152 Q100,128 132,152 L145,226 Q100,247 55,226 Z" fill="url(#cha-body)" />
    <path
      className="cha-collar"
      d="M83,150 Q100,163 119,150"
      fill="none"
      stroke="#232A2A"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.18"
    />

    {/* isometric cube head */}
    <g className="cha-cube">
      <path className="cha-face cha-face-left" d="M52.2,42.5 L100,70 L100,125 L52.2,97.5 Z" fill="url(#cha-face-left)" />
      <path className="cha-face cha-face-right" d="M100,70 L147.8,42.5 L147.8,97.5 L100,125 Z" fill="url(#cha-face-right)" />
      <path className="cha-face cha-face-top" d="M100,15 L147.8,42.5 L100,70 L52.2,42.5 Z" fill="url(#cha-face-top)" />
      <path
        className="cha-cube-lines"
        d="M100,15 L100,70 M52.2,42.5 L100,70 M147.8,42.5 L100,70"
        fill="none"
        stroke="#232A2A"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </g>
  </svg>
);

export default CubeHeadArt;
