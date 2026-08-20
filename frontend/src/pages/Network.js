import React, { Suspense, lazy, useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { ConstellationFallback } from "@/components/three/Fallbacks";
import { useRevealObserver, useReducedMotion, webglAvailable } from "@/lib/motion";
import { getNetwork, getNetworkCategories, track } from "@/lib/api";

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

  return (
    <div ref={ref} className="pt-[68px]" data-testid="network-page">
      <Seo title="The Hi Anzy Network — Strategists, Creators, Technologists, Operators" description="A consultancy doesn't need to own every skill. It needs to know what the problem demands and who is exceptionally good at solving it." />
      <section className="bg-[#1D2424] pb-14 pt-16 lg:pt-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
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

          <div className="relative mt-10 overflow-hidden rounded-[18px] border border-[#F7F5EE]/12" style={{ aspectRatio: "16/8" }}>
            <span className="sys-chip absolute left-4 top-4 z-10 text-[#F7F5EE]/50">FIG.02 — NETWORK CONSTELLATION</span>
            <div className="absolute inset-0">
              {show3d && categories.length > 0 ? (
                <Suspense fallback={<ConstellationFallback categories={categories} />}>
                  <Constellation categories={categories} active={active} />
                </Suspense>
              ) : (
                <ConstellationFallback categories={categories} />
              )}
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

      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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
                  {r.note && <p className="font-mono-sys mt-3 text-[10.5px] leading-relaxed text-[#232A2A]/55">// {r.note}</p>}
                  <p className="sys-chip mt-3 text-[#232A2A]/35">VERIFIED {r.lastVerified}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
        <p className="font-mono-sys mt-8 max-w-2xl text-[11px] leading-relaxed text-[#232A2A]/55">
          A network relationship is not the same thing as Hi Anzy-delivered client work — which is why every card says which one it is.
        </p>
      </section>
    </div>
  );
}
