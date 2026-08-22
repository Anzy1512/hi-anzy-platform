import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { NextSteps } from "@/components/NextSteps";
import { PopIllustration } from "@/components/PopIllustration";
import { ProgressRule } from "@/components/ProgressRule";
import { useRevealObserver } from "@/lib/motion";
import { track } from "@/lib/api";
import { CATEGORIES, CATEGORY_BY_SLUG } from "@/data/content";

/**
 * One figure per service, keyed off position, so the six pages do not all open
 * with the same illustration. They are drawn from the shared deck set, which
 * means a figure can appear on another route too — what must not happen is the
 * same figure twice on one page.
 */
const FIGURES = [
  "/brand/pop-cube-thinker.png",
  "/brand/pop-hands-a.png",
  "/brand/pop-camera-duo.png",
  "/brand/pop-hat-balloon.png",
  "/brand/pop-white-flag.png",
  "/brand/pop-clock-watch.png",
];

/**
 * One service, on its own page.
 *
 * The six systems used to exist only as cards on /what-we-do, which meant a
 * search for "business audit" landed someone on a menu they then had to read.
 * Each now has an address, a lede that answers "is this my problem?", and its
 * own FAQ block so the answer can be lifted directly into a search result.
 */
export default function ServiceDetail() {
  const { slug } = useParams();
  const ref = useRevealObserver();
  const c = CATEGORY_BY_SLUG[slug];

  if (!c) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center pt-[84px]" data-testid="service-not-found">
        <p className="font-display text-5xl text-[#232A2A]">Not one of the six.</p>
        <p className="max-w-md text-[17px] text-[#232A2A]/75">
          That service is not something we run — which is either a typo or a genuinely intriguing brief.
        </p>
        <MagneticButton to="/what-we-do" className="btn-ink">See what we do</MagneticButton>
      </div>
    );
  }

  const others = CATEGORIES.filter((x) => x.slug !== c.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${c.title} — hiAnzy`,
      serviceType: c.title,
      description: c.lede,
      provider: { "@type": "Organization", name: "hiAnzy" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${c.title} capabilities`,
        itemListElement: c.capabilities.map((cap) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: cap },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "What We Do", item: "/what-we-do" },
        { "@type": "ListItem", position: 2, name: c.title, item: `/what-we-do/${c.slug}` },
      ],
    },
  ];

  if (c.faqs && c.faqs.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <div ref={ref} className="pt-[84px]" data-testid="service-detail-page">
      <Seo title={`${c.title} — hiAnzy`} description={c.lede} jsonLd={jsonLd} />

      {/* Hero */}
      <section className="container-page section-pad">
        <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
          <Link to="/what-we-do" className="link-draw inline-flex items-center gap-1.5 text-[#232A2A]/70">
            <ArrowLeft size={13} aria-hidden="true" /> WHAT WE DO
          </Link>
          <span className="text-[#232A2A]/70" aria-hidden="true">/</span>
          <span>{c.title}</span>
        </Reveal>

        <div className="mt-5 grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[clamp(3rem,5vw,4.5rem)] leading-none accent-orange-text">{c.num}</span>
                <h1 className="font-display leading-[0.94] text-[#232A2A] text-[clamp(2.4rem,5vw,4.4rem)]" data-testid="service-h1">
                  {c.label}
                </h1>
              </div>
            </Reveal>
            <Reveal delay={140} as="p" className="font-editorial mt-3 text-[clamp(1.3rem,2vw,1.9rem)] font-medium leading-[1.2] text-[#232A2A]/70">
              {c.title}
            </Reveal>
            <Reveal delay={200} as="p" className="font-editorial mt-6 max-w-[46ch] text-[clamp(1.15rem,1.5vw,1.4rem)] leading-[1.45] text-[#232A2A]/85">
              {c.lede}
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={220}>
              <div className="rounded-[16px] border border-[#232A2A]/12 bg-[#F7F5EE]/55 p-6">
                <p className="sys-chip text-[#232A2A]/50">AT A GLANCE</p>
                <dl className="mt-4 space-y-3.5">
                  <div className="flex items-baseline justify-between gap-4 border-b border-[#232A2A]/10 pb-3">
                    <dt className="font-mono-sys text-[12.5px] text-[#232A2A]/55">Method stage</dt>
                    <dd className="sys-chip rounded-full bg-[#232A2A] px-2.5 py-1 text-[#F7F5EE]">{c.methodStage}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[#232A2A]/10 pb-3">
                    <dt className="font-mono-sys text-[12.5px] text-[#232A2A]/55">Typical shape</dt>
                    <dd className="text-right text-[15px] font-semibold text-[#232A2A]/85">{c.typical}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono-sys text-[12.5px] text-[#232A2A]/55">Capabilities</dt>
                    <dd className="text-right text-[15px] font-semibold text-[#232A2A]/85">{c.capabilities.length}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Signals — "is this me?" before "here is what we sell" */}
      <section className="container-page section-pad-b">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal as="h2" className="font-display text-[clamp(1.9rem,3vw,2.9rem)] leading-[1.02] text-[#232A2A]">
              You might be here because&hellip;
            </Reveal>
            <ul className="mt-6 space-y-3" data-testid="service-signals">
              {c.signals.map((s, i) => (
                <Reveal as="li" key={s} delay={i * 70} className="flex items-start gap-3 border-b border-[#232A2A]/10 pb-3">
                  <span className="font-mono-sys mt-0.5 shrink-0 text-[12.5px] accent-signal-text">{`[${String(i + 1).padStart(2, "0")}]`}</span>
                  <span className="text-[16.5px] leading-[1.55] text-[#232A2A]/85">{s}</span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="panel-dark relative overflow-hidden p-7">
                <p className="sys-chip text-[#F7F5EE]/50">WHY IT MATTERS</p>
                <p className="font-editorial mt-3 text-[19px] leading-[1.45] text-[#F7F5EE]/90">{c.why}</p>
              </div>
            </Reveal>
            <PopIllustration
              src={FIGURES[CATEGORIES.findIndex((x) => x.slug === c.slug) % FIGURES.length]}
              width={150}
              rotate={-3}
              drift={16}
              halo={false}
              className="ml-auto mt-4 hidden lg:block"
              testId="pop-service-detail"
            />
          </div>
        </div>
      </section>

      {/* The work itself */}
      <section className="container-page section-pad-b">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            {c.body.map((para, i) => (
              <Reveal as="p" key={i} delay={i * 80} className="text-[18px] leading-[1.66] text-[#232A2A]/85">
                {para}
              </Reveal>
            ))}
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <p className="sys-chip text-[#232A2A]/50">WHAT YOU GET</p>
              <ul className="mt-4 space-y-2.5" data-testid="service-deliverables">
                {c.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[16px] leading-[1.5] text-[#232A2A]/85">
                    <Check size={15} className="mt-1 shrink-0 accent-orange-text" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <p className="sys-chip mt-8 text-[#232A2A]/50">CAPABILITIES</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.capabilities.map((cap) => (
                  <li key={cap} className="sys-chip rounded-full border border-[#F19020]/70 px-3 py-1.5 text-[#232A2A]/80">{cap}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-page">
        <ProgressRule
          total={c.deliverables.length}
          label="SCOPE, ASSEMBLED"
          trailing="Fixed before we start. Changed only in writing, and only by you."
          testId="service-progress-rule"
        />
      </div>

      {/* FAQ — also the schema source */}
      {c.faqs && c.faqs.length > 0 && (
        <section className="container-page section-pad-b" aria-label="Frequently asked questions">
          <Reveal as="h2" className="font-display text-[clamp(1.9rem,3vw,2.9rem)] leading-[1.02] text-[#232A2A]">
            Reasonable questions
          </Reveal>
          <div className="mt-6 space-y-3" data-testid="service-faq">
            {c.faqs.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <details className="faq-item rounded-[14px] border border-[#232A2A]/15 bg-[#F7F5EE] p-5 sm:p-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 text-[17.5px] font-semibold leading-[1.4] text-[#232A2A] marker:content-['']">
                    {f.q}
                    <span className="faq-plus mt-1 shrink-0 accent-orange-text" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-[17px] leading-[1.65] text-[#232A2A]/80">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Onward */}
      <section className="container-page section-pad-b">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[18px] bg-[#D8CFB4]/60 p-8">
            <p className="font-display max-w-[22ch] text-3xl text-[#232A2A] sm:text-4xl">
              Sounds like your problem? Say so in your own words.
            </p>
            <MagneticButton
              to="/contact"
              className="btn-ink"
              hoverText="Good start."
              testId="service-cta"
              onClick={() => track("cta_primary_click", { cta: "service_detail", service: c.slug })}
            >
              Start a Conversation <ArrowRight size={15} />
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="sys-chip mt-12 text-[#232A2A]/50">THE OTHER FIVE</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="service-siblings">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  to={`/what-we-do/${o.slug}`}
                  className="group flex h-full items-start gap-3 rounded-[14px] border border-[#232A2A]/12 bg-[#F7F5EE]/45 p-4 transition-colors hover:border-[#F19020]"
                  onClick={() => track("service_explored", { category: o.label, to: "service_detail" })}
                >
                  <span className="font-display text-2xl leading-none accent-orange-text">{o.num}</span>
                  <span>
                    <span className="font-display block text-[17px] leading-tight text-[#232A2A]">{o.label}</span>
                    <span className="font-mono-sys mt-1 block text-[12.5px] leading-[1.4] text-[#232A2A]/60">{o.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <NextSteps from="/what-we-do" />
    </div>
  );
}
