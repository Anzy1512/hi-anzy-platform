import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { useRevealObserver } from "@/lib/motion";
import { getCaseStudies, getCaseStudy, track, API } from "@/lib/api";
import { PunPop } from "@/components/PunPop";
import axios from "axios";

const CASE_SECTIONS = [
  { key: "situation", label: "SITUATION" },
  { key: "gap", label: "GAP" },
  { key: "insight", label: "INSIGHT" },
  { key: "decision", label: "DECISION" },
  { key: "build", label: "BUILD" },
  { key: "result", label: "RESULT" },
  { key: "next", label: "WHAT HAPPENED NEXT" },
];

export default function Work() {
  const ref = useRevealObserver();
  const [cases, setCases] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({});
  useEffect(() => {
    getCaseStudies().then(setCases).catch(() => setError(true));
    axios.get(`${API}/portfolio`).then((r) => setPortfolio(r.data)).catch(() => setPortfolio([]));
  }, []);

  /** Expand a case in place — the card unfolds into the full story without leaving the page. */
  const toggleCase = (cs) => {
    if (expanded === cs.slug) {
      setExpanded(null);
      return;
    }
    setExpanded(cs.slug);
    track("case_expanded", { slug: cs.slug, from: "work_index" });
    if (!details[cs.slug]) {
      getCaseStudy(cs.slug).then((d) => setDetails((prev) => ({ ...prev, [cs.slug]: d }))).catch(() => {});
    }
    setTimeout(() => {
      const el = document.getElementById(`case-${cs.slug}`);
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -104, duration: 0.9 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div ref={ref} className="pt-[84px]" data-testid="work-page">
      <Seo title="Work — Hi Anzy" description="Case studies with business context: situation, gap, insight, decision, build, result, and what happened next." />
      <section className="container-page section-pad">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> WORK
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-5 leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="work-h1">
            Proof has context<span className="text-[#E54A25]">.</span>
          </h1>
        </Reveal>
        <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
          No endless logo wall. No unexplained numbers. No tiny footnotes doing heavy lifting. Every case here
          reads the same way: situation, gap, insight, decision, build, result — and what happened next.
        </Reveal>
        <Reveal delay={220} as="p" className="font-mono-sys mt-4 text-[13px] text-[#232A2A]/55">
          Provenance is labelled honestly. Network credentials are not dressed up as client work.
        </Reveal>
      </section>

      <section className="container-page section-pad-b">
        {error && <p className="panel-paper p-6 text-[14px] text-[#232A2A]/75" data-testid="work-error">The case files are being stubborn. Refresh, or just say hi and we will walk you through them in person.</p>}
        {!cases && !error && (
          <div className="grid gap-6 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="panel-paper h-[260px] animate-pulse" />)}</div>
        )}
        {cases && (
          <div className="grid gap-6 lg:grid-cols-2" data-testid="work-case-grid">
            {cases.map((cs, i) => (
              <React.Fragment key={cs.slug}>
                <Reveal delay={(i % 2) * 100}>
                  <Link
                    to={`/work/${cs.slug}`}
                    id={`case-${cs.slug}`}
                    onClick={(e) => { e.preventDefault(); toggleCase(cs); }}
                    aria-expanded={expanded === cs.slug}
                    data-testid={`work-index-card-${cs.slug}`}
                    className={`case-card group block h-full rounded-[18px] border bg-[#F7F5EE] p-7 sm:p-8 ${expanded === cs.slug ? "border-[#F19020]" : "border-[#232A2A]/15"}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <ProvenanceTag value={cs.provenance} />
                      <span className="sys-chip text-[#232A2A]/45">{cs.industry} · {cs.year}</span>
                    </div>
                    <h2 className="font-display mt-5 text-[clamp(1.8rem,2.4vw,2.25rem)] leading-[1.02] text-[#232A2A]">{cs.title}</h2>
                    <p className="sys-chip mt-3 text-[#232A2A]/55">{cs.client}</p>
                    <p className="mt-4 text-[17px] leading-[1.6] text-[#232A2A]/80">{cs.summary}</p>
                    <div className="mt-5 grid gap-2 border-t border-[#232A2A]/10 pt-5 sm:grid-cols-2">
                      <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/72"><span className="font-mono-sys text-[11.5px] text-[#E54A25]">GAP — </span>{cs.gap.slice(0, 100)}…</p>
                      <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/72"><span className="accent-orange-text font-mono-sys text-[11.5px] font-bold">RESULT — </span>{cs.result.slice(0, 100)}…</p>
                    </div>
                    <span className="link-draw mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#232A2A]">
                      {expanded === cs.slug ? "Close case" : "Read the full case"}
                      <ArrowRight size={14} className={`transition-transform ${expanded === cs.slug ? "rotate-90" : "group-hover:translate-x-1"}`} />
                    </span>
                  </Link>
                </Reveal>

                {/* In-place case story — unfolds beneath the card, no page change */}
                <AnimatePresence initial={false}>
                  {expanded === cs.slug && (
                    <motion.div
                      key={`${cs.slug}-panel`}
                      className="lg:col-span-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                      data-testid={`work-expand-panel-${cs.slug}`}
                    >
                      <article className="rounded-[18px] border border-[#F19020]/50 bg-[#EFEAD8] p-7 sm:p-9">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <ProvenanceTag value={cs.provenance} />
                            <span className="sys-chip text-[#232A2A]/50">{cs.client} · {cs.industry} · {cs.year}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpanded(null)}
                            className="sys-chip inline-flex items-center gap-1.5 rounded-full border border-[#232A2A]/25 px-3 py-1.5 text-[#232A2A]/70 transition-colors hover:border-[#E54A25] hover:text-[#E54A25]"
                            data-testid={`work-expand-close-${cs.slug}`}
                          >
                            CLOSE <X size={13} />
                          </button>
                        </div>
                        <h3 className="font-display mt-4 leading-[0.95] text-[#232A2A] text-[clamp(2rem,3.4vw,3.1rem)]">{cs.title}</h3>

                        {!details[cs.slug] && (
                          <div className="mt-8 space-y-4">{Array.from({ length: 3 }).map((_, k) => <div key={k} className="panel-paper h-20 animate-pulse rounded-[14px]" />)}</div>
                        )}
                        {details[cs.slug] && (
                          <>
                            <div className="mt-8 space-y-4">
                              {CASE_SECTIONS.map((s, k) => (
                                <section key={s.key} className={`grid gap-3 rounded-[14px] p-5 sm:grid-cols-12 sm:p-6 ${s.key === "result" ? "panel-dark" : "bg-[#F7F5EE]"}`} data-testid={`work-expand-${cs.slug}-${s.key}`}>
                                  <div className="sm:col-span-3">
                                    <p className={`sys-chip flex items-center gap-2 ${s.key === "result" ? "text-[#F19020]" : "text-[#232A2A]/55"}`}>
                                      {s.key === "gap" && <span className="red-bar" />}
                                      {String(k + 1).padStart(2, "0")} {s.label}
                                    </p>
                                  </div>
                                  <p className={`text-[16.5px] leading-[1.6] sm:col-span-9 ${s.key === "result" ? "text-[#F7F5EE]/88" : "text-[#232A2A]/85"}`}>{details[cs.slug][s.key]}</p>
                                </section>
                              ))}
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                              {(details[cs.slug].services || []).map((s) => (
                                <span key={s} className="sys-chip rounded-full border border-[#F19020]/70 px-3 py-1 text-[#232A2A]/75">{s}</span>
                              ))}
                            </div>
                            {details[cs.slug].metricEvidence && (
                              <p className="font-mono-sys mt-5 text-[12.5px] leading-relaxed text-[#232A2A]/55">{details[cs.slug].metricEvidence}</p>
                            )}
                          </>
                        )}

                        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#232A2A]/12 pt-6">
                          <Link to="/contact" className="btn-ink" data-testid={`work-expand-cta-${cs.slug}`} onClick={() => track("cta_primary_click", { cta: "work_expand", slug: cs.slug })}>
                            Start a Conversation <ArrowRight size={15} />
                          </Link>
                          <Link to={`/work/${cs.slug}`} className="link-draw text-[13.5px] font-semibold text-[#232A2A]/70" data-testid={`work-expand-full-link-${cs.slug}`} onClick={() => track("case_opened", { slug: cs.slug, from: "expand_panel" })}>
                            Open dedicated case page
                          </Link>
                        </div>
                      </article>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </div>
        )}
        <p className="font-mono-sys mt-8 text-[12.5px] text-[#232A2A]/50">Metrics are only published when the evidence supports them. Everything else we will happily show you in a conversation.</p>
        <div className="mt-8 flex justify-end pr-[6%]">
          <PunPop text="Proof beats promise. Every time." rot={2} variant="dark" testId="pun-work" />
        </div>

        {/* ============ THE PORTFOLIO WALL — migrated from the deck ============ */}
        <div className="mt-20" data-testid="work-portfolio-wall">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
                <span className="inline-block h-[3px] w-8 rounded-full bg-[#F19020]" /> THE PORTFOLIO WALL
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display mt-4 leading-[0.95] text-[clamp(2.2rem,4.5vw,4.2rem)] text-[#232A2A]">Shipped. Across the whole system.</h2>
              </Reveal>
            </div>
            <Reveal delay={140} as="p" className="font-editorial max-w-[38ch] text-[17px] italic leading-[1.5] text-[#232A2A]/70">
              Brand decks, packaging, web builds, commerce, motion, audio, social and film — delivered by Hi Anzy and collaborator studios in the network. Credited honestly, as always.
            </Reveal>
          </div>

          {!portfolio && <div className="mt-10 grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="panel-paper h-[150px] animate-pulse" />)}</div>}
          {portfolio && portfolio.length > 0 && (
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {portfolio.map((g, gi) => (
                <Reveal key={g.slug} delay={(gi % 2) * 90}>
                  <article className={`h-full rounded-[18px] p-6 sm:p-7 ${gi % 3 === 0 ? "panel-dark" : "panel-paper"}`} data-testid={`portfolio-group-${g.slug}`}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={`font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-none ${gi % 3 === 0 ? "text-[#F7F5EE]" : "text-[#232A2A]"}`}>{g.category}</h3>
                      <span className={`sys-chip rounded-full border px-3 py-1 ${gi % 3 === 0 ? "border-[#F19020]/60 text-[#F19020]" : "border-[#232A2A]/25 text-[#232A2A]/74"}`}>{g.items.length} PROJECTS</span>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {g.items.map((it) => {
                        // Items carry a deck link where one exists; the rest stay
                        // as plain chips rather than dead anchors.
                        const item = typeof it === "string" ? { name: it } : it;
                        const dark = gi % 3 === 0;
                        const chip = `sys-chip rounded-full border px-3 py-1.5 transition-colors ${
                          dark
                            ? "border-[#F7F5EE]/25 text-[#F7F5EE]/80 hover:border-[#F19020]"
                            : "border-[#232A2A]/25 text-[#232A2A]/75 hover:border-[#F19020]"
                        }`;
                        if (!item.url) {
                          return <li key={item.name} className={chip}>{item.name}</li>;
                        }
                        return (
                          <li key={item.name}>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => track("portfolio_item_opened", { group: g.slug, item: item.name })}
                              data-testid={`portfolio-link-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                              className={`${chip} inline-flex items-center gap-1.5 ${dark ? "hover:text-[#F19020]" : "hover:text-[#232A2A]"}`}
                            >
                              {item.name}
                              <ArrowUpRight size={12} aria-hidden="true" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
          <p className="font-mono-sys mt-6 text-[12.5px] text-[#232A2A]/50">Live links and walk-throughs shared in conversation. Some builds live behind client walls.</p>
        </div>
      </section>
    </div>
  );
}
