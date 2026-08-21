/**
 * Tailwind's default opacity scale is coarse (…70, 75, 80, 90…), and the colour
 * modifier `text-[#F7F5EE]/78` resolves against it. An off-scale value emits no
 * rule at all — the class silently does nothing and the element falls back to
 * inherited colour, which on a charcoal panel meant ink-on-ink at 1.08:1.
 *
 * A full 0–100 scale removes that failure mode entirely. Tailwind only emits
 * the values actually used, so this costs nothing in the bundle.
 */
const fullOpacityScale = Object.fromEntries(
  Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      opacity: fullOpacityScale,
      colors: {
        paper: "#E0D8C1",
        ink: "#232A2A",
        orange: "#F19020",
        signal: "#E54A25",
        "digital-white": "#F7F5EE",
        panel: "#1F2525",
      },
      fontFamily: {
        display: ["Rajdhani", "system-ui", "sans-serif"],
        editorial: ["Figtree", "system-ui", "sans-serif"],
        "mono-sys": ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "1280px",
      },
      animation: {
        "marquee-left": "marquee-left 28s linear infinite",
      },
      keyframes: {
        "marquee-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
