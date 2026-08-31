# Phase 1 — Full Repository Audit + Content + SEO + Contextual Completion

Branch: `feat/work-ecosystem-coming-soon`. Scope: read-only discovery across the whole repo, then a bounded set of safe content/SEO/internal-linking fixes. No layout, styling, animation, component-output, route, or API-contract changes were made. Verified with a clean `npm run build` (CRA's own ESLint gate + the repo's own `check-seo-output.js`/`check-opacity-scale.js` self-checks) and a live browser pass against the built bundle for every route touched.

---

## 1. Route map

Source of truth: `frontend/src/App.js`. 22 declared routes + catch-all 404, none of them server-rendered (CRA SPA, client-side routing only).

| Route | Page component | Notes |
|---|---|---|
| `/` | `Home.js` | eagerly loaded (not lazy) |
| `/what-we-do` | `WhatWeDo.js` | service index |
| `/what-we-do/:slug` | `ServiceDetail.js` | 6 slugs (see sitemap) |
| `/how-we-work` | `HowWeWork.js` | 5-stage method |
| `/work` | `Work.js` | case studies + portfolio wall + Orbit |
| `/work/built-here`, `/work/built-together` | `EcosystemCategoryPage.js` | literal segments, ranked above `/work/:slug` in RRv6 |
| `/work/:slug` | `WorkDetail.js` | 5 case studies |
| `/network` | `Network.js` | discipline hub + constellation |
| `/network/collaborators`, `/network/artists-creators`, `/network/venue-partners`, `/network/partners` | `EcosystemCategoryPage.js` | the other 4 Orbit categories |
| `/network/:slug` | `Discipline.js` | 16 disciplines |
| `/why-hi-anzy` | `WhyHiAnzy.js` | brand/origin/team |
| `/insights` | `Insights.js` | notes index |
| `/insights/:slug` | `InsightDetail.js` | 10 posts |
| `/contact` | `Contact.js` | |
| `/who-we-work-with` | `WhoWeWorkWith.js` | |
| `/collaborate` | `Collaborate.js` | network recruiting |
| `/careers` | `Careers.js` | |
| `/resources` | `Resources.js` | worksheets + privacy + terms |
| `/coming-soon` | `ComingSoon.js` | Hi Anzy AI + Imkaan, `#hi-anzy-ai` / `#imkaan` |
| `*` | `NotFound.js` | now emits `noindex,follow` (see §7) |

No legal/utility routes exist beyond `/resources#privacy` and `/resources#terms` (there is no standalone `/privacy` or `/terms`). No blog/marketplace/AI-product routes exist yet beyond the `/coming-soon` teaser. Auth (`/auth/session` callback via URL hash) is backend-driven, optional, and gates no marketing route.

## 2. Technology stack

- **Frontend**: React 18.3.1, CRA 5 + `@craco/craco` 7 (no Next.js, no SSR), react-router-dom 6.23 (`BrowserRouter`, v7 future flags on), Tailwind 3.4 + hand-written CSS (`App.css`, `dark.css`), no TypeScript.
- **Motion**: GSAP 3.12 + ScrollTrigger, Framer Motion 11, Lenis 1.1 (smooth scroll), Three.js 0.165 + @react-three/fiber 8 + drei 9.
- **State/data**: plain `useState`/`useEffect` + axios (`lib/api.js`); `@tanstack/react-query` is installed and its provider is mounted in `index.js` but no page actually calls a query hook (confirmed again this pass — still true).
- **UI primitives**: a small hand-copied shadcn/Radix set (`components/ui/*.jsx` — dialog, dropdown-menu, sheet, sonner, input, textarea).
- **Build**: `craco build`, with a `prebuild` chain (`check-opacity-scale.js`, `check-seo-output.js`, `generate-sitemap.js`) that runs automatically before every build.
- **Backend**: FastAPI + Motor (async Mongo), single file `backend/server.py`, content seeded idempotently from `backend/seed_data.py` (`CASE_STUDIES`, `NETWORK_RESOURCES`, `INSIGHTS`, `PORTFOLIO_GROUPS`, `ECOSYSTEM_ITEMS`). Auth is an Emergent-managed Google sign-in exchange, session cookie based, optional everywhere. Rate limiting, CORS allowlisting, and an analytics event allow-list are already in place (see prior cleanup pass).

## 3. Animation inventory (full detail from the dedicated audit pass)

Core infra: `lib/motion.js` wires GSAP + ScrollTrigger + Lenis globally (`LenisProvider`/`ScrollToTop` in `App.js`) and exports `useRevealObserver`, which `components/Reveal.js` wraps; **~35 files** use `Reveal` for scroll fade/slide-in.

**HEAVY** (core visual identity — 3D scenes, pinned/scrub sequences):
`lib/motion.js` (sitewide) · `components/three/SystemCore.js` (Home hero) · `pages/home/Hero.js` + `pages/home/hooks/useHeroEntrance.js` · `components/three/Constellation.js` (Network, Home NetworkPreview) · `components/three/SignalField.js` (Insights) · `components/three/LensField.js` (Insights, via `deck/LensFocus.js`) · `components/three/SparkGap.js` (Collaborate, via `deck/HandsSpark.js`) · `components/three/HalftoneBackdrop.js` (Home) · `components/three/IndexSpine.js` + `components/SectionIndex.js` (all pages) · `components/PinnedSequence.js` (Home) · `components/deck/InboxUnfold.js` (HowWeWork) · `components/deck/QuestionOrbit.js` (Careers) · `components/deck/MotifFrame.js` (HowWeWork, Careers, Insights, Collaborate).

**MODERATE**: `components/CardCarousel.js` (Work, Insights, Network) · `components/EvidenceDeck.js`/`OrbitSection.js` (Work) · `components/DissolveImage.js` (WhyHiAnzy) · `components/PopIllustration.js` (Contact, Discipline, HowWeWork, Network, Home) · `components/ProgressRule.js` (ServiceDetail, Home Trust) · `components/RouteLine.js` (HowWeWork, Work, WhyHiAnzy, WhatWeDo, NotFound, Home) · `components/SectionConnector.js` (Home) · `components/SystemDiagnostic.js` (Home SomethingsOff) · `components/ScrollInfoPanel.js` (HowWeWork) · `components/FitQuadrant.js` (Home WhoWith) · `components/CaseAnatomy.js` (Work) · `components/TouchpointTicker.js` (Home Closing) · `components/MenuConstellation.js` (Nav mobile menu, all pages) · `components/ui/sheet.jsx` (Nav mobile menu) · `components/Nav.js`, `StickyCta.js`, `CommandPalette.js`, `Footer.js` (all pages) · `components/ProofStrip.js`/`ClientMarquee.js` · `components/PackageBuilder.js` (WhatWeDo) · `pages/ecosystem/EcosystemCategoryPage.js`.

**LIGHT**: `components/MagneticButton.js` (nearly every CTA) · `components/Reveal.js` (~35 files) · `components/PunPop.js` (Home) · `components/ScrollProgress.js` (all pages) · `components/ThemeToggle.js` (Nav) · `components/CharacterQuote.js` (7 pages) · `components/ui/dropdown-menu.jsx` (Nav) · `components/CollapseOnScroll.js` (Work, WhatWeDo) · `components/SectionHeading.js` (most pages).

**NONE (static, candidates for future motion)**: `components/Picture.js`, `components/Seo.js`, `components/ProvenanceTag.js`, `components/deck/OrbitGlyphs.js`, `components/three/Fallbacks.js`, `components/three/HalftoneStatic.js`, `components/ui/input.jsx`, `components/ui/textarea.jsx`, `components/ui/sonner.jsx`, `lib/absoluteUrl.js`, `lib/api.js`, `lib/auth.js`, `lib/commandIndex.js`, `lib/utils.js`.

## 4. LOCKED areas (do not touch without explicit instruction)

`lib/motion.js`, `components/Reveal.js`, everything under `components/three/*` and `components/deck/*`, `PinnedSequence.js`, `SectionIndex.js`, `Nav.js`, `Footer.js`, `App.js`'s orchestration, and every component listed HEAVY/MODERATE above. All scroll-scrub components (`ProgressRule`, `RouteLine`, `PopIllustration`, `SectionConnector`, `SystemDiagnostic`, `ScrollInfoPanel`, `FitQuadrant`, `DissolveImage`) share `lib/motion.js`'s `ScrollTrigger` idiom — a change there has sitewide blast radius. This phase touched **zero** files in this list beyond passing plain string/data props into already-rendering components (see §6/§7 — every edit was a text/metadata/JSON-LD change, never a structural or animation change).

## 5. STATIC / safe future-motion targets

`ProvenanceTag`, `OrbitGlyphs` (already static inline SVGs by design), the four `components/ui/*` primitives, and — at a page level — `WhoWeWorkWith.js` (thinnest page on the site, no JS motion beyond `Reveal`) and the ecosystem category cards for the 4 non-case-study categories (currently plain `<article>` elements with zero motion). None of these were touched this phase; flagged only as candidates for the later motion phase.

## 6. Content changes made this phase

1. **Removed a rendered `TODO before launch:` disclaimer paragraph from the live Privacy section** (`pages/Resources.js`) — it was shipping as real, visible copy on a production consultancy site, undermining the section around it. Removed rather than replaced with a fabricated "this has been reviewed" claim (no such review is evidenced anywhere in the repo). The two paragraphs of accurate, specific privacy copy around it are untouched and still stand on their own.
2. **Deduplicated a verbatim-repeated pull-quote.** "Clever ideas get attention. Reliable execution gets remembered." appeared identically as Home's Trust-section quote (`pages/home/Trust.js`, kept — it's the flagship decorative treatment) and as the Advisory/Security/Scale service's `why` line (`data/content.js`). Changed only the `content.js` occurrence to "Scale does not reward the cleverest idea. It rewards whichever version was actually built to hold." — same meaning, ties directly into that service's own `lede` ("Scale is an excellent stress test..."), no longer a copy-paste of Home.
3. **Added a distinct `seoDescription` field per Hi Anzy Orbit category** (`data/content.js`, `ORBIT_CATEGORIES`) — the existing `copy` field is a short on-page tagline (e.g. "Some ideas need more than a screen.") that was also being reused verbatim as the page's `<meta description>`. Each category now has both: the original tagline (visually unchanged) and a fuller, distinct sentence describing what the category page actually contains, built only from what the page's own code already establishes (case-study links vs. informational cards) — nothing invented.

No other page copy was rewritten. Every other page came back from the dedicated content audit as either strong/specific (leave alone) or thin-but-intentional (e.g. `WhoWeWorkWith.js`, `Careers.js`) rather than actually broken — see §9 for the one deliberately-deferred item.

## 7. SEO changes made this phase

1. **Added `noIndex` support to `Seo.js`** — previously there was no robots-meta mechanism anywhere in the codebase (confirmed by grep before starting). `Seo` now always emits an explicit `<meta name="robots">`, `index,follow` by default, `noindex,follow` when `noIndex` is passed. Applied to `NotFound.js` only.
2. **Fixed a genuine heading-hierarchy defect**: `pages/ComingSoon.js` rendered two literal `<h1>` elements ("Hi Anzy AI" and "Imkaan"). "Hi Anzy AI" (the page's primary section) keeps the `<h1>`; "Imkaan" is now an `<h2>` with identical classes, so there is zero visual change.
3. **Rewrote five bare-template `<Seo title>` values** into unique, specific, non-keyword-stuffed titles (all still under ~60 characters, all still ending `| hiAnzy`): `WhatWeDo.js` → "What We Do | Six Capabilities, One System", `HowWeWork.js` → "How We Work | Five Stages, One Method", `Work.js` → "Work | Proof, With Context" (matches the page's own headline motif), `WhoWeWorkWith.js` → "Who We Work With | Founders & Growing Teams", `ComingSoon.js` → "Coming Soon: Hi Anzy AI & Imkaan". Descriptions were already good on all five and were left untouched.
4. **Added JSON-LD where hub/index pages had none**, following the exact `BreadcrumbList`/`Service` pattern already established on `Discipline.js`/`ServiceDetail.js` (same `abs()` helper from `lib/absoluteUrl.js`, same shape):
   - `Work.js` — `ItemList` of the fetched case studies (title + `/work/:slug` URL), added conditionally once the API response lands so it never emits an empty/broken list.
   - `Network.js` — `CollectionPage` with `hasPart` listing all 16 disciplines (built from the static `DISCIPLINES` import, so it's always present, no fetch dependency).
   - `EcosystemCategoryPage.js` — `BreadcrumbList` (Orbit → category) always present, plus a conditional `ItemList` of the category's items once loaded.
   - `Contact.js` — a minimal `ContactPage` block (name + canonical URL only — see §9 for why no `ContactPoint`/email was added).
   All four verified live in a built, browser-rendered bundle (see §10 methodology note).

Left explicitly untouched this phase (documented, not forgotten): enriching `Article` JSON-LD on `InsightDetail.js`/`WorkDetail.js` with `datePublished`/`image` (the underlying case/insight data doesn't confirm those fields exist yet — adding them risks fabricating dates); the commented-out `sameAs` array in `Seo.js`'s org schema (needs real social-profile URLs from the user, explicitly flagged in-code already); the card-level h2-without-section-h2 pattern on `Discipline.js`/`Network.js`/`EcosystemCategoryPage.js` (a real but lower-value a11y/SEO nuance, moderate JSX-structure risk for the value delivered — better as a scoped follow-up than bundled in here).

## 8. Contextual / internal-linking improvements

Wired the existing `NextSteps` component (`components/NextSteps.js`) into `WhatWeDo.js` (the service index) — the `"/what-we-do"` entry in its `JOURNEY` map already existed and was already used by `ServiceDetail.js`, but the index page itself had no onward-journey block, making it a comparative dead end relative to every other major page. This was a one-line, zero-risk addition (the map entry, the component, and its styling all already existed and are already proven elsewhere).

`WorkDetail.js` and `InsightDetail.js` were flagged as also lacking `NextSteps`, but were deliberately left alone: both already carry dedicated, page-appropriate contextual links (related services, next case, related posts) that the SEO audit independently called "genuinely good cross-linking" — adding a second, more generic link block on top would be exactly the kind of content added "because space exists" the brief warns against. Noted as a considered decision, not an oversight.

`EcosystemCategoryPage.js` remains the closest thing to a dead end on the site (only a "Back to the Orbit" link for 4 of its 6 categories, since those categories don't yet have individual detail routes) — the new `BreadcrumbList` JSON-LD helps machine-readable context, but a real fix here is either new detail routes (out of scope — this is new-feature territory, not cleanup) or linking each item's own external URL more prominently in the UI (a visible-frontend change, out of scope for this phase). Flagged for the next phase.

## 9. Factual limitations (things intentionally not fixed because the facts aren't available)

- **`Seo.js`'s `sameAs` array** (LinkedIn/Instagram/etc.) is still commented out — no real profile URLs exist anywhere in the repo to fill it with, and the code's own comment already flags this as "the single biggest schema gap left." Needs real URLs from the user.
- **No `ContactPoint`/email in the new `ContactPage` schema** — `Footer.js` still renders a literal `CONTACT_EMAIL` placeholder (`href="mailto:CONTACT_EMAIL"`), confirmed still unresolved this pass. Adding a fabricated or placeholder email to structured data would be worse than omitting it. Same root cause as the Resources.js privacy-page footer-email reference (a pre-existing `TODO(hiAnzy)` code comment, left as-is since it's not rendered content).
- **`Article` JSON-LD `datePublished`/`dateModified`/`image`** on `InsightDetail.js`/`WorkDetail.js` were not added — the audit could not confirm these fields are actually populated in the underlying `insights`/`case_studies` seed data without risking a fabricated date if they aren't. Needs a data-layer check before adding.

## 10. Unresolved risks / methodology notes

- All four JSON-LD additions and both title/heading fixes were verified by building the production bundle (`npm run build`, clean — CRA's own ESLint gate and the repo's `check-seo-output.js` self-check both passed) and serving it locally, then reading `document.title`, injected `<meta name="robots">`, and `script[data-seo-jsonld]` blocks directly in a real browser for `/work`, `/network`, `/work/built-here`, `/contact`, `/coming-soon`, `/resources`, `/what-we-do`, `/what-we-do/advisory-security-scale`, and an unknown route (404 check). All matched expectations exactly.
- The local build calls the API at its build-time-baked origin (`localhost:8001` in this checkout), which isn't reachable from the static-file test server, so case-study/ecosystem-item data (and therefore the conditional `ItemList` blocks) couldn't be observed populated in this pass — only their absence-safe fallback was verified. This is a CORS/environment artifact of local testing, not a defect; re-verify the populated JSON-LD once deployed against the real API (Docker rebuild + live check, same as prior milestones).
- No TypeScript exists in this repo (plain JS throughout), so there is no `tsc` step to run — CRA's bundled ESLint (`react-app`/`react-app/jest`) is the only static-analysis gate, and it ran clean on every build this phase.
- No automated test suite exists to run beyond the build's own checks (confirmed again this pass, matching the prior cleanup audit's finding).

## 11. Recommended locations for future experiential/motion features

No list of "13 experiential features" was provided in this session or found anywhere in the repository (checked `.ai-work/`, `plan.md`, `design_guidelines.md`, and the saved plan-mode document) — this section can't be reconciled against that list until it's shared. In its absence, here are the candidate locations this audit itself surfaces, based on the STATIC (§5) and NONE (§3) inventories plus the content audit's findings, ranked by how well-justified each is by what's already on the page:

1. **`WhoWeWorkWith.js`** — the thinnest page on the site (no motion beyond `Reveal`, plain lists), and Home's own teaser for it ("The full filter, and where we tend to earn our fee") promises more depth than the page currently delivers. Strongest single candidate for both content depth and a first real motion treatment.
2. **The 4 non-case-study Orbit category pages** (`/network/collaborators`, `/network/artists-creators`, `/network/venue-partners`, `/network/partners`) — currently static `<article>` cards with zero motion, in contrast to `built_here`/`built_together`'s case-study cards which at least link somewhere. A good candidate for a lighter card-reveal or hover treatment once detail routes exist.
3. **`components/ui/*` form primitives** (`input.jsx`, `textarea.jsx`) — used on `Contact.js`, the site's primary conversion point; currently no focus/fill micro-interaction beyond browser defaults.
4. **`EcosystemCategoryPage.js`'s empty/error states** — currently plain text, unlike most other empty/error states on the site which are voiced but still static; a small illustrated or motion treatment (matching `PopIllustration`'s existing pattern elsewhere) would fit the site's established idiom.

---

*Compiled by the Phase 1 audit pass. Next phase per the Master Production Execution Contract: awaiting explicit instruction — no further phase has been started.*
