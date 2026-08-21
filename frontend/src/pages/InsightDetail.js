import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { MagneticButton } from "@/components/MagneticButton";
import { useRevealObserver } from "@/lib/motion";
import { getInsight, getInsights, track } from "@/lib/api";

export default function InsightDetail() {
  const { slug } = useParams();
  const ref = useRevealObserver();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState([]);
  const depthTracked = useRef(false);

  useEffect(() => {
    setPost(null);
    setNotFound(false);
    depthTracked.current = false;
    getInsight(slug)
      .then((p) => {
        setPost(p);
        return getInsights();
      })
      .then((all) => setRelated((all || []).filter((x) => x.slug !== slug).slice(0, 2)))
      .catch(() => setNotFound(true));
  }, [slug]);

  // article read-depth analytics
  useEffect(() => {
    if (!post) return undefined;
    const onScroll = () => {
      const p = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (p > 0.75 && !depthTracked.current) {
        depthTracked.current = true;
        track("article_read_depth", { slug, depth: "75" });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post, slug]);

  if (notFound) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 pt-[84px]" data-testid="insight-not-found">
        <p className="font-display text-5xl text-[#232A2A]">That note wandered off.</p>
        <MagneticButton to="/insights" className="btn-ink">Back to Insights</MagneticButton>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-[760px] space-y-6 px-[var(--page-x)] pb-24 pt-[136px]">
        <div className="panel-paper h-24 animate-pulse" />
        <div className="panel-paper h-[420px] animate-pulse" />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    author: { "@type": "Organization", name: "Hi Anzy" },
    publisher: { "@type": "Organization", name: "Hi Anzy" },
  };

  return (
    <div ref={ref} className="pt-[84px]" data-testid="insight-detail-page">
      <Seo title={post.seo?.title || `${post.title} — Hi Anzy`} description={post.seo?.description || post.excerpt} jsonLd={jsonLd} />
      <article className="mx-auto max-w-[780px] px-[var(--page-x)] py-14 lg:py-20">
        <Link to="/insights" className="link-draw sys-chip inline-flex items-center gap-2 text-[#232A2A]/60" data-testid="insight-back">
          <ArrowLeft size={13} /> ALL NOTES
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="sys-chip rounded-full border border-[#F19020]/70 px-3 py-1 text-[#232A2A]/70">{post.category.toUpperCase()}</span>
          <span className="sys-chip text-[#232A2A]/45">{post.readingTime} READ</span>
        </div>
        <h1 className="font-display mt-4 leading-[0.92] text-[#232A2A] text-[clamp(2.4rem,4.5vw,4rem)]" data-testid="insight-title">{post.title}</h1>
        <p className="font-editorial mt-5 max-w-[46ch] text-[clamp(1.2rem,1.6vw,1.5rem)] leading-[1.42] text-[#232A2A]/80">{post.excerpt}</p>
        <div className="mt-4 h-[3px] w-16 rounded-full bg-[#F19020]" />

        <div className="mt-10 space-y-6" data-testid="insight-body">
          {(post.body || []).map((b, i) => {
            if (b.type === "h2") return <h2 key={i} className="font-display pt-4 text-3xl text-[#232A2A]">{b.text}</h2>;
            if (b.type === "quote")
              return (
                <blockquote key={i} className="panel-dark relative p-6 sm:p-7">
                  <span className="red-bar absolute left-6 top-0 -translate-y-1/2" style={{ width: 28 }} />
                  <p className="font-editorial italic text-[clamp(1.35rem,2vw,1.8rem)] leading-[1.28] text-[#F19020]">{b.text}</p>
                </blockquote>
              );
            return <p key={i} className="text-[18.5px] leading-[1.65] text-[#232A2A]/85">{b.text}</p>;
          })}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-[18px] bg-[#D8CFB4]/60 p-7">
          <p className="font-display max-w-md text-2xl leading-tight text-[#232A2A]">Reading is free. The diagnosis is a conversation.</p>
          <MagneticButton to="/contact" className="btn-ink" hoverText="Good start." testId="insight-cta" onClick={() => track("cta_primary_click", { cta: "insight_detail", slug })}>
            Say Hi <ArrowRight size={15} />
          </MagneticButton>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <p className="sys-chip text-[#232A2A]/50">KEEP READING</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} to={`/insights/${r.slug}`} className="case-card block rounded-[14px] border border-[#232A2A]/15 bg-[#F7F5EE] p-5" data-testid={`insight-related-${r.slug}`}>
                  <span className="sys-chip text-[#232A2A]/50">{r.category.toUpperCase()}</span>
                  <p className="font-display mt-2 text-xl leading-tight text-[#232A2A]">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
