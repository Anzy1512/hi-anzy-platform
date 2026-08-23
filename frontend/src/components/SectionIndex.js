import React, { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { subscribeScroll, webglAvailable, prefersReducedMotion, gsap } from "@/lib/motion";

const IndexSpine = lazy(() => import("@/components/three/IndexSpine"));

/**
 * The page index: where you are, what else is here, and one click to any of it.
 *
 * Sections are discovered from the DOM rather than declared per page. A
 * hand-maintained list would drift the moment a section is added or renamed,
 * and this site has seventeen route types.
 *
 * Placement is the whole design problem. A fixed rail floating over a centred
 * column covers the first inch of every line, and .container-page is capped at
 * 1360px with its own padding, so on a 1440 laptop the natural gutter measures
 * 33px — nowhere near enough to sit in. So the rail does not hunt for leftover
 * space: it reserves its own by widening the left padding of every container
 * through --rail-w, and the column starts where the rail ends. Nothing is ever
 * painted over.
 *
 * That also rules out hover-to-expand. An expanding panel would either overlap
 * the text it just made room beside, or shove the page sideways on a mouseover.
 * Instead there are two fixed modes chosen by how much width the viewport can
 * spare — labelled when there is room, dots-only when there is not — and
 * neither moves once chosen.
 *
 * Three layers of motion, each doing a job the others cannot:
 *  - three.js spine: the reader's position as a travelling node with motes that
 *    brighten around it. Decorative — the dots already carry the information.
 *  - GSAP: the active marker slides between rows, easing from wherever it is
 *    when the next section arrives mid-flight.
 *  - CSS: dot scale and hover, cheap enough to leave on the compositor.
 */
const MIN_SECTIONS = 2;

/** Dots only. */
const RAIL_NARROW = 88;
/** Dots plus labels. */
const RAIL_WIDE = 216;
/** Below this the page needs its full width more than it needs an index. */
const MIN_VIEWPORT = 1180;
/** Above this there is room to carry the labels as well. */
const LABEL_VIEWPORT = 1460;

/**
 * A heading broken across lines comes back from textContent with the lines run
 * together — "We Build Brand<span>Operating Systems" reads as "BrandOperating".
 * innerText respects the line boxes, so it is preferred, with textContent only
 * as the fallback for an element that is not currently rendered.
 */
const flatten = (el) => {
  const raw = (el.innerText && el.innerText.trim()) || el.textContent || "";
  return raw.replace(/\s+/g, " ").trim();
};

/** How far into a section its own kicker/heading may sit before it is judged
 *  to belong to a card inside the section rather than to the section itself. */
const OWN_LABEL_ZONE = 260;

/**
 * Label priority: an explicit override, then the section's kicker, then its
 * heading. The kicker is preferred because it is already the short name for the
 * section — "THE SEQUENCE", "HOW TRUST GETS BUILT" — whereas a heading is a
 * sentence written to be read in place, and truncating one to fit a rail gives
 * "A business is one system.Our cap…", which helps nobody.
 *
 * The hard part is telling a section's own label from one belonging to a card
 * nested inside it. Depth does not separate them — a real kicker was found at
 * depth 4 and a provenance chip inside a card at depth 3. Vertical position
 * does: a section labels itself at its top, so anything more than a screenful
 * down is a component's label, not the section's. Without this the network page
 * was indexed as "hiAnzy DIRECT" and the closing panel as "INTERACTIONS,
 * TODAY", both chips belonging to widgets inside those sections.
 */
const nearTopOf = (el, section) => {
  const top = el.getBoundingClientRect().top - section.getBoundingClientRect().top;
  return top >= -4 && top <= OWN_LABEL_ZONE;
};

const labelFor = (el) => {
  const explicit = el.getAttribute("data-index-label");
  if (explicit) return explicit;

  const heading = [...el.querySelectorAll("h1, h2")].find((h) => nearTopOf(h, el));
  if (!heading) return null;

  const kicker = [...el.querySelectorAll(".sys-chip")].find((k) => nearTopOf(k, el));
  if (kicker) {
    const precedes = heading.compareDocumentPosition(kicker) & Node.DOCUMENT_POSITION_PRECEDING;
    if (precedes) {
      const k = flatten(kicker);
      if (k && k.length <= 30) return k;
    }
  }

  const text = flatten(heading);
  if (!text) return null;
  if (text.length <= 26) return text;
  const cut = text.slice(0, 26);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 12 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

export const SectionIndex = () => {
  const { pathname } = useLocation();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("off"); // off | dots | labels

  const progressRef = useRef(0);
  const listRef = useRef(null);
  const markerRef = useRef(null);
  const [use3d, setUse3d] = useState(false);

  const width = mode === "labels" ? RAIL_WIDE : RAIL_NARROW;

  // Which mode the viewport can afford, re-evaluated on resize so a resized
  // window is never stuck in the mode it happened to load in.
  useEffect(() => {
    const measure = () => {
      if (prefersReducedMotion() || window.innerWidth < MIN_VIEWPORT) {
        setMode("off");
        return;
      }
      setMode(window.innerWidth >= LABEL_VIEWPORT ? "labels" : "dots");
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (mode !== "off") setUse3d(webglAvailable());
  }, [mode]);

  /**
   * Reserve the space before paint. --rail-w widens the left padding of every
   * .container-page, so the column starts where the rail ends. Cleared on
   * teardown, because a stale value would indent the whole site with nothing
   * sitting in the gap.
   */
  useLayoutEffect(() => {
    const root = document.documentElement;
    const on = mode !== "off" && items.length >= MIN_SECTIONS;
    root.style.setProperty("--rail-w", on ? `${width}px` : "0px");
    return () => root.style.setProperty("--rail-w", "0px");
  }, [mode, width, items.length]);

  // Discover this route's sections, then again once fetched content lands.
  useEffect(() => {
    if (mode === "off") {
      setItems([]);
      return undefined;
    }
    let cancelled = false;

    const scan = () => {
      if (cancelled) return;
      const main = document.querySelector("main");
      if (!main) return;
      const found = [];
      const seen = new Set();
      main.querySelectorAll("section, [data-index-label]").forEach((el) => {
        const label = labelFor(el);
        if (!label || seen.has(label)) return;
        if (el.getBoundingClientRect().height < 120) return;
        seen.add(label);
        found.push({ label, el });
      });
      setItems(found.length >= MIN_SECTIONS ? found : []);
      setActive(0);
    };

    const t1 = window.setTimeout(scan, 400);
    const t2 = window.setTimeout(scan, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname, mode]);

  // Active row and page progress, from the one scroll source Lenis feeds.
  useEffect(() => {
    if (mode === "off" || items.length === 0) return undefined;
    let current = -1;
    const off = subscribeScroll((y, limit) => {
      progressRef.current = limit > 0 ? Math.min(1, Math.max(0, y / limit)) : 0;
      const line = y + window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < items.length; i += 1) {
        const top = items[i].el.getBoundingClientRect().top + window.scrollY;
        if (top <= line) idx = i;
      }
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
    });
    return () => off && off();
  }, [mode, items]);

  /**
   * GSAP slides the active marker between rows. A CSS transition would restart
   * from the new position each time; scrolling quickly through several sections
   * should read as one continuous travel, which means easing from wherever the
   * marker currently is.
   */
  useEffect(() => {
    const marker = markerRef.current;
    const list = listRef.current;
    if (!marker || !list || items.length === 0) return undefined;
    const row = list.children[active + 1]; // child 0 is the marker itself
    if (!row) return undefined;
    const tween = gsap.to(marker, {
      y: row.offsetTop,
      height: row.offsetHeight,
      duration: 0.5,
      ease: "power3.out",
    });
    return () => tween.kill();
  }, [active, items.length, mode]);

  const jump = useCallback((el) => {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.05 });
    else window.scrollTo({ top, behavior: "smooth" });
  }, []);

  if (mode === "off" || items.length === 0) return null;

  return (
    <nav
      className={`section-index section-index--${mode}`}
      aria-label="Page sections"
      data-testid="section-index"
      data-mode={mode}
      style={{ width: `${width - 20}px` }}
    >
      <div className="section-index-shell">
        <div className="section-index-spine" aria-hidden="true">
          {use3d && (
            <Suspense fallback={null}>
              <IndexSpine progressRef={progressRef} />
            </Suspense>
          )}
        </div>

        <ol className="section-index-list" ref={listRef}>
          <span ref={markerRef} className="section-index-marker" aria-hidden="true" />
          {items.map((it, i) => (
            <li key={it.label}>
              <button
                type="button"
                onClick={() => jump(it.el)}
                aria-current={i === active ? "true" : undefined}
                title={it.label}
                className={`section-index-row ${i === active ? "is-active" : ""}`}
                data-testid={`section-index-row-${i}`}
              >
                <span className="section-index-dot" aria-hidden="true" />
                <span className="section-index-text">
                  <span className="section-index-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="section-index-label">{it.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
