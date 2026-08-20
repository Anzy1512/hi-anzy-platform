import React from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { useRevealObserver } from "@/lib/motion";

export default function Collaborate() {
  const ref = useRevealObserver();
  return (
    <>
      <Seo title="Collaborate — Hi Anzy" description="Join the Hi Anzy network as a collaborator, specialist or partner." />
      <main ref={ref} className="container-page section-pad pt-[120px]">
        <p className="sys-chip mb-4 text-[#232A2A]/50">COLLABORATE</p>
        <h1 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] uppercase leading-[1.05] tracking-wide text-[#232A2A]">
          Work With Us.
        </h1>
        <p className="reveal mt-6 max-w-[55ch] font-editorial text-[18px] leading-[1.65] text-[#232A2A]/70">
          We build with specialists, not generalists. If you do one thing exceptionally well and want to work on interesting problems — we'd like to hear from you.
        </p>
        <div className="reveal mt-10">
          <Link to="/contact" className="btn-ink">Start a conversation</Link>
        </div>
      </main>
    </>
  );
}
