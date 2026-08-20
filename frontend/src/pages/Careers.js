import React from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { useRevealObserver } from "@/lib/motion";

export default function Careers() {
  const ref = useRevealObserver();
  return (
    <>
      <Seo title="Careers — Hi Anzy" description="Opportunities to work at Hi Anzy." />
      <main ref={ref} className="container-page section-pad pt-[120px]">
        <p className="sys-chip mb-4 text-[#232A2A]/50">CAREERS</p>
        <h1 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] uppercase leading-[1.05] tracking-wide text-[#232A2A]">
          Join Hi Anzy.
        </h1>
        <p className="reveal mt-6 max-w-[55ch] font-editorial text-[18px] leading-[1.65] text-[#232A2A]/70">
          We don't post jobs for the sake of posting. When we need someone, we'll know exactly who — and we'll probably already know you. In the meantime, say hi.
        </p>
        <div className="reveal mt-10">
          <Link to="/contact" className="btn-ink">Say hi anyway</Link>
        </div>
      </main>
    </>
  );
}
