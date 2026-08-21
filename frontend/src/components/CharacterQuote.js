import React, { useEffect, useState } from "react";
import { CHARACTERS } from "@/data/content";

/**
 * Mini marketing-character quote strip — fills quiet page regions with the
 * deck's collage figures and their voice lines. Rotates every 6s; only
 * opacity/transform are animated.
 */
const LINES = [
  { who: "The Visionary", quote: "If the plan fits on a sticky note, it's a direction. If it survives a quarter, it's a strategy." },
  { who: "The Challenger", quote: "Best practice is just the average of everyone else's habits." },
  { who: "The Fixer", quote: "Every bottleneck was once somebody's clever shortcut." },
  { who: "The Anchor", quote: "Momentum without a calendar is just enthusiasm." },
  { who: "The Expressionist", quote: "People don't remember information. They remember how it arrived." },
  { who: "The Trendsetter", quote: "Culture moves first. Metrics catch up later." },
];

export const CharacterQuote = ({ startIndex = 0, testId = "character-quote-strip" }) => {
  const [i, setI] = useState(startIndex % LINES.length);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setI((p) => (p + 1) % LINES.length);
        setVisible(true);
      }, 320);
    }, 6000);
    return () => clearInterval(t);
  }, []);
  const line = LINES[i];
  const char = CHARACTERS.find((c) => c.name === line.who);
  return (
    <div className="container-page" data-testid={testId}>
      <div className="flex items-center gap-5 rounded-[18px] border border-[#232A2A]/12 bg-[#D8CFB4]/45 p-5 sm:p-6">
        {char && (
          <div className="h-16 w-14 shrink-0 overflow-hidden rounded-[10px] border-2 border-[#232A2A]/15 sm:h-20 sm:w-16">
            <img src={char.img} alt={`${line.who} — collage figure`} loading="lazy" className="h-full w-full object-cover object-top" />
          </div>
        )}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
          <p className="font-pun text-[clamp(1.05rem,1.35vw,1.3rem)] italic leading-[1.4] text-[#232A2A]/85">“{line.quote}”</p>
          <p className="sys-chip mt-2 text-[#F19020]">— {line.who.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};
