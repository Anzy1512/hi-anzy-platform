import React from "react";
import { Reveal } from "@/components/Reveal";

export const SectionHeading = ({ kicker, title, dark = false, className = "", testId }) => (
  <div className={`space-y-4 ${className}`}>
    {kicker && (
      <Reveal as="p" className={`sys-chip flex items-center gap-3 ${dark ? "text-[#F7F5EE]/60" : "text-[#232A2A]/60"}`}>
        <span className="inline-block h-[3px] w-8 rounded-full bg-[#F19020]" />
        {kicker}
      </Reveal>
    )}
    <Reveal as="h2" delay={80} testId={testId}
      className={`font-display leading-[0.95] text-[clamp(2.4rem,5.5vw,5.25rem)] ${dark ? "text-[#F7F5EE]" : "text-[#232A2A]"}`}>
      {title}
    </Reveal>
  </div>
);
