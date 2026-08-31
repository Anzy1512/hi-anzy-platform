import React from "react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { NotesSubscribe } from "@/components/NotesSubscribe";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";

/**
 * Two brands, kept deliberately distinct rather than presented as a matched
 * pair — Hi Anzy AI in the site's systematic/dark register, Imkaan in its
 * warmer editorial one. Exactly two sections, no speculative feature roadmap
 * for either: positioning, not a spec sheet.
 */
export default function ComingSoon() {
  const ref = useRevealObserver();

  React.useEffect(() => {
    track("coming_soon_viewed", {});
  }, []);

  return (
    <div ref={ref} className="pt-[84px]" data-testid="coming-soon-page">
      <Seo
        title="Coming Soon: Hi Anzy AI & Imkaan | hiAnzy"
        description="Two ideas quietly becoming something more: Hi Anzy AI, the intelligence layer behind the system, and Imkaan, returning."
      />

      <section id="hi-anzy-ai" className="bg-[#1D2424] pb-16 pt-16 text-[#F7F5EE] lg:pt-24" data-index-label="HI ANZY AI" data-testid="coming-soon-hianzy-ai">
        <div className="container-page">
          <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#F7F5EE]/55">
            <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> COMING INTO VIEW · 01
          </Reveal>
          <div className="mt-5 grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal delay={80}>
                <h1 className="font-display leading-[0.95] text-[#F7F5EE] text-[clamp(2.6rem,5.6vw,4.6rem)]" data-testid="coming-soon-hianzy-ai-h1">
                  Hi Anzy AI
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="font-display mt-4 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.3] text-[#F7F5EE]/85">
                  The intelligence layer behind the system.
                </p>
              </Reveal>
              <Reveal delay={180} as="p" className="mt-5 max-w-[56ch] text-[16.5px] leading-[1.6] text-[#F7F5EE]/75">
                Every business we work with ends up needing the same thing eventually: a way to see itself
                clearly, without waiting for a quarterly report to say so. Hi Anzy AI is the diagnostic and
                execution layer we have been building alongside the client work itself — internal tooling
                first, with pieces of it destined to reach clients directly once they earn that trust.
              </Reveal>
            </div>
            <Reveal delay={220} className="lg:col-span-4">
              <div className="rounded-[16px] border border-[#F7F5EE]/15 bg-[#F7F5EE]/[0.04] p-6" data-testid="coming-soon-hianzy-ai-status">
                <span className="sys-chip inline-flex rounded-full border border-[#F19020]/60 px-3 py-1 accent-orange-text">IN DEVELOPMENT</span>
                <p className="font-mono-sys mt-4 text-[12.5px] leading-relaxed text-[#F7F5EE]/55">
                  No dates, no waitlist gimmicks. Leave an address below and we will say something when
                  there is something worth saying.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="mt-10 max-w-[520px]">
            <NotesSubscribe
              source="coming-soon-hi-anzy-ai"
              heading="NOTIFY ME — HI ANZY AI"
              body="Be first to see it."
              bodyDetail="One note, when Hi Anzy AI actually has something to show. Nothing before that."
              ctaLabel="Notify Me"
              testId="coming-soon-hianzy-ai-notify"
            />
          </div>
        </div>
      </section>

      <section id="imkaan" className="section-pad" data-index-label="IMKAAN" data-testid="coming-soon-imkaan">
        <div className="container-page">
          <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
            <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> COMING INTO VIEW · 02
          </Reveal>
          <div className="mt-5 grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal delay={80}>
                <h2 className="font-display leading-[0.95] text-[#232A2A] text-[clamp(2.6rem,5.6vw,4.6rem)]" data-testid="coming-soon-imkaan-h1">
                  Imkaan
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="font-editorial mt-4 max-w-[52ch] text-[clamp(1.1rem,1.6vw,1.4rem)] italic leading-[1.4] text-[#232A2A]/85">
                  Some things are built for business. Some are built because people need somewhere to belong.
                </p>
              </Reveal>
              <Reveal delay={180} as="p" className="font-editorial mt-5 max-w-[56ch] text-[16.5px] leading-[1.6] text-[#232A2A]/78">
                Imkaan is the side of the system built around culture — artists, creators, talent, and the
                live experiences and conversations that never fit neatly into a business case. It is
                returning. Not as a pivot away from the consultancy, just as itself.
              </Reveal>
            </div>
            <Reveal delay={220} className="lg:col-span-4">
              <div className="rounded-[16px] border border-[#232A2A]/15 bg-[#F7F5EE] p-6" data-testid="coming-soon-imkaan-status">
                <span className="sys-chip inline-flex rounded-full border border-[#232A2A]/25 px-3 py-1 text-[#232A2A]/70">RETURNING SOON</span>
                <p className="font-mono-sys mt-4 text-[12.5px] leading-relaxed text-[#232A2A]/55">
                  Same posture as Hi Anzy AI — no dates promised. An address gets you the one note that matters.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="mt-10 max-w-[520px]">
            <NotesSubscribe
              source="coming-soon-imkaan"
              heading="NOTIFY ME — IMKAAN"
              body="Be first to know."
              bodyDetail="One note, when Imkaan is back. Nothing before that."
              ctaLabel="Notify Me"
              testId="coming-soon-imkaan-notify"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
