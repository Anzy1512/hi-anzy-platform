import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { CharacterQuote } from "@/components/CharacterQuote";
import { NextSteps } from "@/components/NextSteps";

const RESOURCES = [
  { t: "The Busy-ness Test", b: "A one-page exercise: map every recurring activity to the decision it serves. Watch the calendar lose weight.", tag: "WORKSHEET" },
  { t: "Five-Second Homepage Check", b: "Show a stranger your homepage for five seconds. The questions to ask and what the answers mean.", tag: "CHECKLIST" },
  { t: "The AI Use-Case Sentence", b: "One sentence that separates AI initiatives from AI theatre. Fill in the blanks before the budget does.", tag: "TEMPLATE" },
];

export default function Resources() {
  const ref = useRevealObserver();
  return (
    <div ref={ref} className="pt-[84px]" data-testid="resources-page">
      <Seo title="Resources | hiAnzy" description="Worksheets and checklists from the hiAnzy diagnostic practice, plus the privacy and terms fine print in humane language." />
      <section className="container-page section-pad">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> RESOURCES
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="resources-h1">
            Tools we actually use<span className="accent-signal-text">.</span>
          </h1>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {RESOURCES.map((r, i) => (
            <Reveal key={r.t} delay={i * 90}>
              <div className="cap-tile panel-paper flex h-full flex-col p-7" data-testid={`resource-card-${i}`}>
                <span className="sys-chip w-fit rounded-full border border-[#F19020]/70 px-2.5 py-0.5 text-[#232A2A]/70">{r.tag}</span>
                <h2 className="font-display mt-3 text-3xl text-[#232A2A]">{r.t}</h2>
                <p className="mt-3 flex-1 text-[16.5px] leading-[1.58] text-[#232A2A]/78">{r.b}</p>
                {/* This routes to the contact form, so it says so. It used to
                    fire `resource_downloaded`, which counted a click as a
                    delivered file and made the number meaningless. */}
                <Link to="/contact" onClick={() => track("resource_requested", { resource: r.t })} className="link-draw mt-5 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#232A2A]">
                  Ask us for it <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <section id="privacy" className="panel-paper p-7 sm:p-9" data-testid="resources-privacy">
              <p className="sys-chip text-[#232A2A]/55">PRIVACY</p>
              <h2 className="font-display mt-2 text-3xl text-[#232A2A]">Your data, plainly.</h2>
              {/* The IP sentence is not decoration. The contact endpoint stores
                  the sender's IP address (server.py, on every submission) for
                  abuse handling, and IP is personal data under both GDPR and
                  India's DPDP Act — so it has to be disclosed here rather than
                  only existing in the database. The analytics claim below is
                  accurate as written: /api/analytics/event records name, path
                  and timestamp, and deliberately no IP. */}
              <p className="mt-4 text-[16.5px] leading-[1.58] text-[#232A2A]/78">
                When you write to us, we store what you send so a person can read it and reply: your name, your
                email, anything else you chose to fill in, and the IP address the message arrived from. The IP is
                kept for one reason only: stopping the form being abused by bots. We do not sell any of it, rent
                it, or feed it to a mailing list you never asked for. Analytics on this site record which pages
                were used and when, and never your IP address. They measure what is useful, not who you are.
              </p>
              <p className="mt-4 text-[16.5px] leading-[1.58] text-[#232A2A]/78">
                Want a copy of what we hold, or want it deleted? Say the word and it is done. Write to the address
                in the footer{/* TODO(hiAnzy): once a real inbox is published, name it here explicitly. */} and a
                person will action it. No ticket queue, no form to fill in twice.
              </p>
            </section>
          </Reveal>
          <Reveal delay={100}>
            <section id="terms" className="panel-paper p-7 sm:p-9" data-testid="resources-terms">
              <p className="sys-chip text-[#232A2A]/55">TERMS</p>
              <h2 className="font-display mt-2 text-3xl text-[#232A2A]">The fine print, humane.</h2>
              <p className="mt-4 text-[16.5px] leading-[1.58] text-[#232A2A]/78">
                Content on this site is hiAnzy&rsquo;s unless credited otherwise, and network work is always
                credited otherwise. Case narratives are shared with client consent. Nothing here is formal advice
                until we have actually looked at your business; every engagement gets its own written scope.
              </p>
            </section>
          </Reveal>
        </div>
      </section>
      <div className="pb-16">
        <CharacterQuote />
      </div>
      <NextSteps from="/resources" />
    </div>
  );
}
