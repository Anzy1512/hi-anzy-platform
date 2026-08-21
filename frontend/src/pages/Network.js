import React, { Suspense, lazy, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minimize2 } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { ConstellationFallback, ThreeSafe } from "@/components/three/Fallbacks";
import { useRevealObserver, useReducedMotion, webglAvailable, resyncScroll } from "@/lib/motion";
import { getNetwork, getNetworkCategories, track } from "@/lib/api";
import { NETWORK_SUBCATS } from "@/data/content";
import { PunPop } from "@/components/PunPop";
import { NextSteps } from "@/components/NextSteps";

const Constellation = lazy(() => import("@/components/three/Constellation"));

const LEGEND = [
  { tag: "HI ANZY DIRECT", text: "Owned and delivered by the Hi Anzy core layer." },
  { tag: "HI ANZY + COLLABORATOR", text: "Hi Anzy led, specialists executed alongside." },
  { tag: "COLLABORATOR CREDENTIAL", text: "Independent track record of a network member." },
  { tag: "NETWORK ACCESS", text: "Relationships we can activate. Not client work." },
];

export default function Network() {
  const ref = useRevealObserver();
  const reduced = useReducedMotion();
  const [show3d, setShow3d] = useState(false);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);
  const [resources, setResources] = useState(null);

  useEffect(() => {
    setShow3d(!reduced && webglAvailable());
  }, [reduced]);

  useEffect(() => {
    getNetworkCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setResources(null);
    getNetwork(active).then(setResources).catch(() => setResources([]));
  }, [active]);

  const selectCategory = (c) => {
    setActive(c);
    if (c) track("network_category_selected", { category: c, from: "network_page" });
  };

  /** Deep dive: constellation cluster click → filter + glide to the specialist cards. */
  const deepDive = (c) => {
    const next = active === c ? null : c;
    setActive(next);
    if (next) {
      track("network_deep_dive", { category: next, from: "constellation" });
      setTimeout(() => {
        const el = document.getElementById("network-specialists");
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -96, duration: 1.1 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    }
  };

  const subTotal = Object.values(NETWORK_SUBCATS).reduce((a, v) => a + v.length, 0);
  const allServices = Object.values(NETWORK_SUBCATS).flat();

  /** Fullscreen constellation — same frame aesthetics, expanded to the viewport. */
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (!fullscreen) return undefined;
    // Lock both elements — body alone still lets some browsers scroll the root.
    const prevBody = document.body.style.overflow;
    const prevRoot = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    const onKey = (e) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevRoot;
      if (window.__lenis) window.__lenis.start();
      window.removeEventListener("keydown", onKey);
      // Document height changed while locked — re-measure or the progress bar
      // and any ScrollTriggers stay calibrated to the locked layout.
      resyncScroll();
    };
  }, [fullscreen]);

  return (
    <div ref={ref} className="pt-[84px]" data-testid="network-page">
      <Seo title="The Hi Anzy Network — Strategists, Creators, Technologists, Operators" description="A consultancy doesn't need to own every skill. It needs to know what the problem demands and who is exceptionally good at solving it." />
      <section className="bg-[#1D2424] pb-14 pt-16 lg:pt-24">
        <div className="container-page">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#F7F5EE]/55">
                <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> THE NETWORK
              </Reveal>
              <Reveal delay={80}>
                <h1 className="font-display mt-5 leading-[0.92] text-[#F7F5EE] text-[clamp(3rem,6.8vw,6rem)]" data-testid="network-h1">
                  The Hi Anzy Network
                </h1>
              </Reveal>
              <Reveal delay={160} as="p" className="mt-6 max-w-[48ch] font-editorial text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.45] text-[#F7F5EE]/85">
                A consultancy doesn&rsquo;t need to own every skill. It needs to know exactly what the problem demands
                — and who is exceptionally good at solving it. These are the minds we bring into the room.
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={220}>
                <div className="rounded-[18px] border border-[#F7F5EE]/14 bg-[#F7F5EE]/[0.04] p-6 sm:p-7" data-testid="network-hero-stats">
                  <p className="sys-chip text-[#F19020]">NETWORK AT A GLANCE</p>
                  <div className="mt-5 grid grid-cols-3 gap-4">
                    <div data-testid="network-stat-disciplines">
                      <p className="font-display text-[clamp(2.1rem,3.2vw,3rem)] leading-none text-[#F7F5EE]">{categories.length || 12}</p>
                      <p className="sys-chip mt-2 text-[#F7F5EE]/50">DISCIPLINES</p>
                    </div>
                    <div data-testid="network-stat-specialisms">
                      <p className="font-display text-[clamp(2.1rem,3.2vw,3rem)] leading-none text-[#F7F5EE]">{subTotal}+</p>
                      <p className="sys-chip mt-2 text-[#F7F5EE]/50">SPECIALISMS</p>
                    </div>
                    <div data-testid="network-stat-tiers">
                      <p className="font-display text-[clamp(2.1rem,3.2vw,3rem)] leading-none text-[#F7F5EE]">{LEGEND.length}</p>
                      <p className="sys-chip mt-2 text-[#F7F5EE]/50">PROVENANCE TIERS</p>
                    </div>
                  </div>
                  <p className="font-mono-sys mt-5 border-t border-[#F7F5EE]/10 pt-4 text-[12px] leading-relaxed text-[#F7F5EE]/45">Assembled per problem. Never a fixed bench. Every relationship labelled honestly below.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <div
            className="relative mt-10 h-[380px] overflow-hidden rounded-[18px] border border-[#F7F5EE]/12 sm:h-[460px] lg:aspect-[16/9.5] lg:h-auto"
            data-testid="network-constellation-frame"
          >
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="sys-chip absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#F7F5EE]/30 bg-[#1D2424]/80 px-3.5 py-2 text-[#F7F5EE]/80 backdrop-blur-sm transition-colors hover:border-[#F19020] hover:text-[#F19020]"
              data-testid="network-fullscreen-toggle"
              aria-label="Expand constellation to full screen"
            >
              <Maximize2 size={13} /> FULL SCREEN
            </button>
            <div className="absolute inset-0">
              {show3d && categories.length > 0 ? (
                <ThreeSafe fallback={<ConstellationFallback categories={categories} />}>
                  <Suspense fallback={<ConstellationFallback categories={categories} />}>
                    <Constellation categories={categories} active={active} subs={NETWORK_SUBCATS} onSelect={deepDive} />
                  </Suspense>
                </ThreeSafe>
              ) : (
                <ConstellationFallback categories={categories} />
              )}
            </div>
          </div>

          {/* Fullscreen constellation — portal above everything, same aesthetics */}
          {fullscreen && createPortal(
            <div className="fixed inset-0 z-[200] overflow-hidden bg-[#1D2424]" data-testid="network-constellation-fullscreen" role="dialog" aria-label="Network constellation, full screen">
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="sys-chip absolute right-5 top-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#F7F5EE]/30 bg-[#1D2424]/80 px-4 py-2.5 text-[#F7F5EE]/85 backdrop-blur-sm transition-colors hover:border-[#F19020] hover:text-[#F19020]"
                data-testid="network-fullscreen-exit"
                aria-label="Exit full screen"
              >
                <Minimize2 size={13} /> EXIT
              </button>
              <span className="sys-chip absolute left-5 top-5 z-20 text-[#F7F5EE]/50">THE HI ANZY NETWORK — CONSTELLATION</span>
              <div className="absolute inset-0">
                {show3d && categories.length > 0 ? (
                  <ThreeSafe fallback={<ConstellationFallback categories={categories} />}>
                    <Suspense fallback={<ConstellationFallback categories={categories} />}>
                      <Constellation categories={categories} active={active} subs={NETWORK_SUBCATS} onSelect={(c) => { setFullscreen(false); deepDive(c); }} />
                    </Suspense>
                  </ThreeSafe>
                ) : (
                  <ConstellationFallback categories={categories} />
                )}
              </div>
            </div>,
            document.body
          )}

          {/* The service map — every specialism in the room */}
          <div className="mt-6" data-testid="network-service-marquee">
            <p className="sys-chip text-[#F7F5EE]/45">THE SERVICE MAP — {subTotal}+ SPECIALISMS ACROSS {categories.length || 12} DISCIPLINES</p>
            <div className="relative mt-3 overflow-hidden border-y border-[#F7F5EE]/12 py-3">
              <div className="marquee-track items-center gap-x-6" aria-hidden="true" style={{ animationDuration: "70s" }}>
                {[...allServices, ...allServices].map((s, i) => (
                  <React.Fragment key={`${s}-${i}`}>
                    <span className="font-display whitespace-nowrap text-[16px] font-semibold tracking-[0.04em] text-[#F7F5EE]/65 transition-colors hover:text-[#F19020]">{s}</span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-[#F19020]/70" />
                  </React.Fragment>
                ))}
              </div>
              <ul className="sr-only">{allServices.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter network by category" data-testid="network-category-filter">
            <button type="button" onClick={() => selectCategory(null)} data-testid="network-filter-all" className={`sys-chip rounded-full border px-3.5 py-1.5 transition-colors ${!active ? "border-[#F19020] bg-[#F19020] text-[#232A2A]" : "border-[#F7F5EE]/25 text-[#F7F5EE]/75 hover:border-[#F19020]/70"}`}>
              ALL
            </button>
            {categories.map((c) => (
              <button key={c} type="button" onClick={() => selectCategory(c)} data-testid={`network-filter-${c.toLowerCase()}`} className={`sys-chip rounded-full border px-3.5 py-1.5 transition-colors ${active === c ? "border-[#F19020] bg-[#F19020] text-[#232A2A]" : "border-[#F7F5EE]/25 text-[#F7F5EE]/75 hover:border-[#F19020]/70"}`}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="network-specialists" className="container-page section-pad">
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="network-legend">
          {LEGEND.map((l) => (
            <div key={l.tag} className="rounded-[14px] border border-[#232A2A]/14 bg-[#F7F5EE]/60 p-4">
              <ProvenanceTag value={l.tag} />
              <p className="mt-2.5 text-[15px] leading-[1.5] text-[#232A2A]/70">{l.text}</p>
            </div>
          ))}
        </div>

        {!resources && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="panel-paper h-[190px] animate-pulse" />)}</div>}
        {resources && resources.length === 0 && <p className="panel-paper p-6 text-[14px] text-[#232A2A]/70" data-testid="network-empty">Nothing public in this category yet. The relationships exist — the write-ups are being verified.</p>}
        {resources && resources.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="network-resource-grid">
            {resources.map((r, i) => (
              <Reveal key={r.slug} delay={(i % 3) * 70}>
                <article tabIndex={0} onClick={() => track("network_profile_opened", { slug: r.slug })} data-testid={`network-card-${r.slug}`} className="cap-tile h-full cursor-default rounded-[16px] border border-[#232A2A]/15 bg-[#F7F5EE] p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-2xl leading-none text-[#232A2A]">{r.name}</h2>
                    <span className="sys-chip shrink-0 text-[#232A2A]/45">{r.category.toUpperCase()}</span>
                  </div>
                  <div className="mt-3">
                    <ProvenanceTag value={r.relationshipType} />
                  </div>
                  <p className="sys-chip mt-3 text-[#232A2A]/50">{r.geography}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {(r.capabilities || []).slice(0, 6).map((cap) => (
                      <li key={cap} className="sys-chip rounded-full border border-[#232A2A]/20 px-2.5 py-0.5 text-[#232A2A]/70">{cap}</li>
                    ))}
                  </ul>
                  {r.note && <p className="font-mono-sys mt-3 text-[12px] leading-relaxed text-[#232A2A]/55">{r.note}</p>}
                  <p className="sys-chip mt-3 text-[#232A2A]/35">VERIFIED {r.lastVerified}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
        <p className="font-mono-sys mt-8 max-w-2xl text-[12.5px] leading-relaxed text-[#232A2A]/55">
          A network relationship is not the same thing as Hi Anzy-delivered client work — which is why every card says which one it is.
        </p>
        <div className="mt-8 flex justify-end pr-[8%]">
          <PunPop text="It's not who you know. It's who you can activate." rot={-1.5} variant="orange" testId="pun-network" />
        </div>
      </section>
      <NextSteps from="/network" />
    </div>
  );
}
