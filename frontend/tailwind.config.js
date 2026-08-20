/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
