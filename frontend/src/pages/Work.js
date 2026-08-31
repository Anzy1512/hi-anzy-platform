import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Seo } from "@/components/Seo";
import { ClientMarquee } from "@/components/ClientMarquee";
import { Reveal } from "@/components/Reveal";
import { CardCarousel } from "@/components/CardCarousel";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { RouteLine } from "@/components/RouteLine";
import { CaseAnatomy } from "@/components/CaseAnatomy";
import { OrbitSection } from "@/components/OrbitSection";
import { announceExpanded, onCollapse } from "@/components/CollapseOnScroll";
import { useRevealObserver } from "@/lib/motion";
import { getCaseStudies, getCaseStudy, track, API } from "@/lib/api";
import { PunPop } from "@/components/PunPop";
import axios from "axios";

/**
 * One portfolio item as a chip, for the normally-sized groups.
 * Items carry a deck link where one exists; the rest stay as plain chips
 * rather than becoming dead anchors.
 */
const PortfolioChip = ({ item: raw, dark, group }) => {
  const item = typeof raw === "string" ? { name: raw } : raw;
  const chip = `sys-chip rounded-full border px-3 py-1.5 transition-colors ${
    dark
      ? "border-[#F7F5EE]/25 text-[#F7F5EE]/80 hover:border-[#F19020]"
      : "border-[#232A2A]/25 text-[#232A2A]/75 hover:border-[#F19020]"
  }`;
  if (!item.url) return <li className={chip}>{item.name}</li>;
  return (
    <li>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("portfolio_item_opened", { group, item: item.name })}
        data-testid={`portfolio-link-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        className={`${chip} inline-flex items-center gap-1.5 ${dark ? "hover:text-[#F19020]" : "hover:text-[#232A2A]"}`}
      >
        {item.name}
        <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    </li>
  );
};

/**
 * One item in the oversized group's roster. A ruled row rather than a chip:
 * at 25 names a chip cloud reads as noise, while aligned rows scan like a
 * client list, which is what it is.
 */
const PortfolioRosterItem = ({ item: raw, group }) => {
  const item = typeof raw === "string" ? { name: raw } : raw;
  const base = "flex items-center justify-between gap-3 border-b border-[#F7F5EE]/12 py-2.5 text-[15px] leading-[1.35]";
  if (!item.url) {
    return <li className={`${base} text-[#F7F5EE]/70`}>{item.name}</li>;
  }
  return (
    <li className={base}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("portfolio_item_opened", { group, item: item.name })}
        data-testid={`portfolio-link-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        className="group inline-flex w-full items-center justify-between gap-3 text-[#F7F5EE]/85 transition-colors hover:text-[#F19020]"
      >
        <span>{item.name}</span>
        <ArrowUpRight size={13} aria-hidden="true" className="shrink-0 opacity-45 transition-opacity group-hover:opacity-100" />
      </a>
    </li>
  );
};

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

  // An expanded case is the tallest thing on this page; leaving it open while
  // the reader scrolls away changes the page length under them.
  useEffect(() => onCollapse(() => setExpanded(null)), []);

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
      const el = document.getElementById("work-expand-panel");
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -104, duration: 0.9 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Announce only once the reveal scroll above has had time to land, so
      // the global scroll-away rule (CollapseOnScroll) starts watching from
      // the settled position. The panel now sits after the whole carousel
      // rather than right beside the card that opened it, so that scroll
      // can easily cover more than CollapseOnScroll's 260px threshold —
      // announcing at click time made that reveal look identical to the
      // reader scrolling away, so the panel closed itself the instant it
      // opened.
      setTimeout(announceExpanded, 950);
    }, 150);
  };

  const expandedCase = cases && cases.find((cs) => cs.slug === expanded);

  return (
    <div ref={ref} className="pt-[84px]" data-testid="work-page">
      <Seo title="Work | hiAnzy" description="Case studies with business context: situation, gap, insight, decision, build, result, and what happened next." />
      <section className="container-page section-pad">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> WORK
        </Reveal>
        {/* The copy names the seven-part shape in a sentence; the diagram beside
            it shows the same seven, which is easier to hold than a list read
            aloud — and it takes a hero column that was empty. */}
        <div className="mt-5 grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <h1 className="font-display leading-[0.92] text-[#232A2A] text-[clamp(3rem,6.8vw,6rem)]" data-testid="work-h1">
                Proof has context<span className="accent-signal-text">.</span>
              </h1>
            </Reveal>
            {/* Used to open "No endless logo wall." — which a crawling client
                strip a few lines below would have flatly contradicted. The
                actual promise survives without that clause: not vanity
                numbers, not footnotes doing the work a real answer should. */}
            <Reveal delay={160} as="p" className="mt-7 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#232A2A]/85">
              No unexplained numbers. No tiny footnotes doing heavy lifting. Every case here
              reads the same way: situation, gap, insight, decision, build, result, and what happened next.
            </Reveal>
            <Reveal delay={220} as="p" className="font-mono-sys mt-4 text-[13px] text-[#232A2A]/55">
              Provenance is labelled honestly. Network credentials are not dressed up as client work.
            </Reveal>
          </div>
          <Reveal delay={240} className="hidden lg:col-span-5 lg:block">
            <CaseAnatomy steps={CASE_SECTIONS} className="panel-paper p-6 sm:p-7" testId="work-case-anatomy" />
          </Reveal>
        </div>
        <div className="mt-12">
          <ClientMarquee />
        </div>
      </section>

      <section className="container-page section-pad-b" data-index-label="CASE STUDIES">
        {error && <p className="panel-paper p-6 text-[14px] text-[#232A2A]/75" data-testid="work-error">The case files are being stubborn. Refresh, or just say hi and we will walk you through them in person.</p>}
        {!cases && !error && (
          <div className="grid gap-6 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="panel-paper h-[260px] animate-pulse" />)}</div>
        )}
        {cases && (
          <div data-testid="work-case-grid">
            <CardCarousel label={`DRAG OR SCROLL · ${cases.length} CASE STUDIES`} testId="work-carousel">
              {cases.map((cs) => (
                <Link
                  key={cs.slug}
                  to={`/work/${cs.slug}`}
                  id={`case-${cs.slug}`}
                  onClick={(e) => { e.preventDefault(); toggleCase(cs); }}
                  aria-expanded={expanded === cs.slug}
                  data-testid={`work-index-card-${cs.slug}`}
                  className={`case-card group flex h-full w-[86vw] shrink-0 snap-start flex-col rounded-[18px] border bg-[#F7F5EE] p-7 sm:w-[420px] sm:p-8 lg:w-[440px] ${expanded === cs.slug ? "border-[#F19020]" : "border-[#232A2A]/15"}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <ProvenanceTag value={cs.provenance} />
                    <span className="sys-chip text-[#232A2A]/45">{cs.industry} · {cs.year}</span>
                  </div>
                  <h2 className="font-display mt-5 text-[clamp(1.8rem,2.4vw,2.25rem)] leading-[1.02] text-[#232A2A]">{cs.title}</h2>
                  <p className="sys-chip mt-3 text-[#232A2A]/55">{cs.client}</p>
                  <p className="mt-4 text-[17px] leading-[1.6] text-[#232A2A]/80">{cs.summary}</p>
                  <div className="mt-5 grid gap-2 border-t border-[#232A2A]/10 pt-5">
                    <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/72"><span className="font-mono-sys text-[12.5px] accent-signal-text">GAP: </span>{cs.gap.slice(0, 100)}…</p>
                    <p className="text-[15.5px] leading-[1.55] text-[#232A2A]/72"><span className="accent-orange-text font-mono-sys text-[12.5px] font-bold">RESULT: </span>{cs.result.slice(0, 100)}…</p>
                  </div>
                  <span className="link-draw mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-[#232A2A]">
                    {expanded === cs.slug ? "Close case" : "Read the full case"}
                    <ArrowRight size={14} className={`transition-transform ${expanded === cs.slug ? "rotate-90" : "group-hover:translate-x-1"}`} />
                  </span>
                </Link>
              ))}
            </CardCarousel>

            {/* In-place case story — unfolds beneath the carousel, no page
                change. Pulled out of the per-card loop (it used to be a
                sibling of each card, spanning the grid via lg:col-span-2 —
                a trick that only makes sense in a grid) so there is exactly
                one of these regardless of which card opened it. */}
            <AnimatePresence initial={false}>
              {expandedCase && (
                <motion.div
                  key={`${expandedCase.slug}-panel`}
                  id="work-expand-panel"
                  className="mt-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                  data-testid={`work-expand-panel-${expandedCase.slug}`}
                >
                  <article className="rounded-[18px] border border-[#F19020]/50 bg-[#EFEAD8] p-7 sm:p-9">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <ProvenanceTag value={expandedCase.provenance} />
                        <span className="sys-chip text-[#232A2A]/50">{expandedCase.client} · {expandedCase.industry} · {expandedCase.year}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpanded(null)}
                        className="sys-chip inline-flex items-center gap-1.5 rounded-full border border-[#232A2A]/25 px-3 py-1.5 text-[#232A2A]/70 transition-colors hover:border-[#E54A25] hover:text-[#E54A25]"
                        data-testid={`work-expand-close-${expandedCase.slug}`}
                      >
                        CLOSE <X size={13} />
                      </button>
                    </div>
                    <h3 className="font-display mt-4 leading-[0.95] text-[#232A2A] text-[clamp(2rem,3.4vw,3.1rem)]">{expandedCase.title}</h3>

                    {!details[expandedCase.slug] && (
                      <div className="mt-8 space-y-4">{Array.from({ length: 3 }).map((_, k) => <div key={k} className="panel-paper h-20 animate-pulse rounded-[14px]" />)}</div>
                    )}
                    {details[expandedCase.slug] && (
                      <>
                        <div className="mt-8 space-y-4">
                          {CASE_SECTIONS.map((s, k) => (
                            <section key={s.key} className={`grid gap-3 rounded-[14px] p-5 sm:grid-cols-12 sm:p-6 ${s.key === "result" ? "panel-dark" : "bg-[#F7F5EE]"}`} data-testid={`work-expand-${expandedCase.slug}-${s.key}`}>
                              <div className="sm:col-span-3">
                                <p className={`sys-chip flex items-center gap-2 ${s.key === "result" ? "accent-orange-text" : "text-[#232A2A]/55"}`}>
                                  {s.key === "gap" && <span className="red-bar" />}
                                  {String(k + 1).padStart(2, "0")} {s.label}
                                </p>
                              </div>
                              <p className={`text-[16.5px] leading-[1.6] sm:col-span-9 ${s.key === "result" ? "text-[#F7F5EE]/88" : "text-[#232A2A]/85"}`}>{details[expandedCase.slug][s.key]}</p>
                            </section>
                          ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {(details[expandedCase.slug].services || []).map((s) => (
                            <span key={s} className="sys-chip rounded-full border border-[#F19020]/70 px-3 py-1 text-[#232A2A]/75">{s}</span>
                          ))}
                        </div>
                        {details[expandedCase.slug].metricEvidence && (
                          <p className="font-mono-sys mt-5 text-[12.5px] leading-relaxed text-[#232A2A]/55">{details[expandedCase.slug].metricEvidence}</p>
                        )}
                      </>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#232A2A]/12 pt-6">
                      <Link to="/contact" className="btn-ink" data-testid={`work-expand-cta-${expandedCase.slug}`} onClick={() => track("cta_primary_click", { cta: "work_expand", slug: expandedCase.slug })}>
                        Start a Conversation <ArrowRight size={15} />
                      </Link>
                      <Link to={`/work/${expandedCase.slug}`} className="link-draw text-[13.5px] font-semibold text-[#232A2A]/70" data-testid={`work-expand-full-link-${expandedCase.slug}`} onClick={() => track("case_opened", { slug: expandedCase.slug, from: "expand_panel" })}>
                        Open dedicated case page
                      </Link>
                    </div>
                  </article>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <p className="font-mono-sys mt-8 text-[12.5px] text-[#232A2A]/50">Metrics are only published when the evidence supports them. Everything else we will happily show you in a conversation.</p>
        <div className="mt-8 flex justify-end pr-[6%]">
          <PunPop text="Proof beats promise. Every time." rot={2} variant="dark" testId="pun-work" />
        </div>
      </section>

      <OrbitSection />

      <section className="container-page section-pad-b" data-index-label="PORTFOLIO ARCHIVE">
        {/* ============ THE PORTFOLIO WALL — migrated from the deck ============ */}
        <div data-testid="work-portfolio-wall">
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
              Brand decks, packaging, web builds, commerce, motion, audio, social and film, delivered by hiAnzy and collaborator studios in the network. Credited honestly, as always.
            </Reveal>
          </div>

          {!portfolio && <div className="mt-10 grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="panel-paper h-[150px] animate-pulse" />)}</div>}
          {portfolio && portfolio.length > 0 && (() => {
            /* One group (social) carries 25 items against 4–9 everywhere else.
               In a two-column grid that card grew several times the height of its
               neighbour and dragged a column of dead space beside it. Oversized
               groups are pulled out, sent to the end and given the full width,
               where the count reads as range rather than as a layout accident.
               Keyed off size rather than slug so the rule still holds if the
               data changes. */
            const WIDE_AT = 15;
            const regular = portfolio.filter((g) => g.items.length < WIDE_AT);
            const wide = portfolio.filter((g) => g.items.length >= WIDE_AT);

            return (
              <>
                <div className="mt-10 grid gap-5 lg:grid-cols-2">
                  {regular.map((g, gi) => (
                    /* An odd number of groups leaves the last one alone in a
                       two-column row with dead paper beside it. Letting it span
                       both columns reads as deliberate instead of orphaned. */
                    <Reveal key={g.slug} delay={(gi % 2) * 90} className={gi === regular.length - 1 && regular.length % 2 === 1 ? "lg:col-span-2" : undefined}>
                      <article className={`h-full rounded-[18px] p-6 sm:p-7 ${gi % 3 === 0 ? "panel-dark" : "panel-paper"}`} data-testid={`portfolio-group-${g.slug}`}>
                        <div className="flex items-center justify-between gap-3">
                          <h3 className={`font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-none ${gi % 3 === 0 ? "text-[#F7F5EE]" : "text-[#232A2A]"}`}>{g.category}</h3>
                          <span className={`sys-chip shrink-0 rounded-full border px-3 py-1 ${gi % 3 === 0 ? "border-[#F19020]/60 accent-orange-text" : "border-[#232A2A]/25 text-[#232A2A]/74"}`}>{g.items.length} PROJECTS</span>
                        </div>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {g.items.map((it) => (
                            <PortfolioChip key={(typeof it === "string" ? it : it.name)} item={it} dark={gi % 3 === 0} group={g.slug} />
                          ))}
                        </ul>
                      </article>
                    </Reveal>
                  ))}
                </div>

                {wide.map((g) => (
                  <Reveal key={g.slug} delay={80}>
                    <article className="panel-dark relative mt-5 overflow-hidden rounded-[18px] p-6 sm:p-8 lg:p-10" data-testid={`portfolio-group-${g.slug}`}>
                      <RouteLine
                        d="M0,86 C 22,58 48,96 72,52 C 86,26 94,58 100,36"
                        viewBox="0 0 100 100"
                        strokeWidth={1.1}
                        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
                      />
                      <div className="relative flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="sys-chip accent-orange-text">THE LONG TAIL</p>
                          <h3 className="font-display mt-2 text-[clamp(1.8rem,3.2vw,2.9rem)] leading-none text-[#F7F5EE]">{g.category}</h3>
                          <p className="font-mono-sys mt-3 max-w-[52ch] text-[13px] leading-[1.5] text-[#F7F5EE]/60">
                            The largest single body of work here, running accounts, not one-off posts.
                            Every name below is a brand whose feed we have actually had to fill on a Monday.
                          </p>
                        </div>
                        <span className="sys-chip shrink-0 rounded-full border border-[#F19020]/60 px-3.5 py-1.5 accent-orange-text">{g.items.length} ACCOUNTS</span>
                      </div>
                      {/* Columns rather than a wrapped chip cloud: at this count a
                          cloud reads as noise, a column reads as a roster. */}
                      <ul className="relative mt-7 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid={`portfolio-roster-${g.slug}`}>
                        {g.items.map((it) => (
                          <PortfolioRosterItem key={(typeof it === "string" ? it : it.name)} item={it} group={g.slug} />
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
              </>
            );
          })()}
          <p className="font-mono-sys mt-6 text-[12.5px] text-[#232A2A]/50">Live links and walk-throughs shared in conversation. Some builds live behind client walls.</p>
        </div>
      </section>
    </div>
  );
}
