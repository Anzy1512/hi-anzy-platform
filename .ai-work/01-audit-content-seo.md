# Phase 1 — Full Repository Audit + Content + SEO + Contextual Completion

Branch: `feat/work-ecosystem-coming-soon`. Scope: read-only discovery across the whole repo, then a bounded set of safe content/SEO/internal-linking fixes. No layout, styling, animation, component-output, route, or API-contract changes were made. Verified with a clean `npm run build` (CRA's own ESLint gate + the repo's own `check-seo-output.js`/`check-opacity-scale.js` self-checks) and a live browser pass against the built bundle for every route touched.

> **Reviewed in Phase 1.5** (see `.ai-work/01-validation.md`). Verdict: PASS WITH CORRECTIONS. This document has been updated in place with those corrections — sections carrying a **[1.5]** marker were changed or added during validation. Do not treat the original Phase 1 wording as authoritative where it conflicts.

---

## 1. Route map

Source of truth: `frontend/src/App.js`. **23** declared routes + catch-all 404, none of them server-rendered (CRA SPA, client-side routing only). *[1.5] — Phase 1 said 22; recount confirms 23.*

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

**[1.5] Critical handoff fact Phase 1 omitted:** `ECOSYSTEM_ITEMS` is **derived**, not authored. It is generated at seed time from `CASE_STUDIES` + `NETWORK_RESOURCES` by a mapping function in `seed_data.py`, and both source collections are read-only inputs that are never mutated. Consequences for any later phase: (a) editing an ecosystem item directly is meaningless — it will be regenerated on next seed; change the source case study or network resource instead; (b) the six Orbit categories are a deterministic bucketing of existing provenance/relationship fields, so adding a category or moving an item is a change to that mapping function, not a content edit; (c) `HI ANZY DIRECT` network resources (hiAnzy's own internal studios) are deliberately excluded from the collaborator roster, and that exclusion is load-bearing for the site's provenance honesty — do not "fix" it.

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

**[1.5] — this section was materially corrected. Phase 1's original wording was too permissive and is superseded by the table in §11.**

Genuinely static, no motion of their own: `ProvenanceTag`, `OrbitGlyphs` (static inline SVGs by design), `Picture.js`, `Seo.js`, `three/Fallbacks.js`, `three/HalftoneStatic.js`, the four `components/ui/*` primitives, and the `lib/*` modules.

Two corrections to Phase 1's framing:

1. **"Static page" ≠ "the components on it are editable."** Phase 1 listed `WhoWeWorkWith.js` as a static/safe target. The page itself is a fair target for *additive* motion, but it renders `Reveal`, `MagneticButton`, `CharacterQuote` and `NextSteps` — all shared, LOCKED components used across the whole site. A Phase 2 model must not read "page marked safe" as licence to edit those. Add motion *around* them, never *to* them.
2. **`components/ui/input.jsx` / `textarea.jsx` are not a safe target.** They are the contact form's fields. The Master Contract classifies forms as **E — CRITICAL SYSTEM**, and `/contact` is the site's primary conversion path. Reclassified **CAUTION** (see §11).

## 6. Content changes made this phase

1. **Removed a rendered `TODO before launch:` disclaimer paragraph from the live Privacy section** (`pages/Resources.js`) — it was shipping as real, visible copy on a production consultancy site, undermining the section around it. Removed rather than replaced with a fabricated "this has been reviewed" claim (no such review is evidenced anywhere in the repo). The two paragraphs of accurate, specific privacy copy around it are untouched and still stand on their own.
   **[1.5] Correct action, but Phase 1 under-recorded the risk — escalated here.** That paragraph was the only *visible* reminder of a real, still-open compliance gap: the privacy notice states no retention period, names no data controller, and states no lawful basis, while the backend does store personal data (name, email, phone, message, IP) on every contact submission. Deleting the note removed the reminder, not the gap. Filing this as an **open pre-launch blocker** rather than a completed content tidy-up — see §9. It must not be read as "privacy is done."
2. **Deduplicated a verbatim-repeated pull-quote.** "Clever ideas get attention. Reliable execution gets remembered." appeared identically as Home's Trust-section quote (`pages/home/Trust.js`, kept — it's the flagship decorative treatment) and as the Advisory/Security/Scale service's `why` line (`data/content.js`). Only the `content.js` occurrence was changed.
   **[1.5] The Phase 1 replacement was itself weak and has been rewritten.** Phase 1 wrote "Scale does not reward the cleverest idea. It rewards whichever version was actually built to hold." Two problems: "built to hold" is awkward, and it broke a pattern all five sibling `why` lines hold without exception — an aphorism, then a sentence landing it back on *this specific service* ("This is where we make sure yours doesn't", "The network exists so both happen on purpose"). Since `why` renders under a literal "Why it matters:" label on `/what-we-do` and in a "WHY IT MATTERS" panel on the service page, the second half genuinely has to answer *why this service*. Now reads: **"Growth does not break a business. The corners it cut on the way up do. This is where those get closed."** — in-pattern, plainer words, and it ties to that service's own lede about scale finding every shortcut you took.
3. **Added a distinct `seoDescription` field per Hi Anzy Orbit category** (`data/content.js`, `ORBIT_CATEGORIES`) — the existing `copy` field is a short on-page tagline (e.g. "Some ideas need more than a screen.") that was also being reused verbatim as the page's `<meta description>`. Each category now has both: the original tagline (visually unchanged) and a fuller, distinct sentence describing what the category page actually contains.
   **[1.5] Two of the six were corrected for overclaim and tone.** `built_here` said "full case studies, not vanity summaries" — the trailing clause is editorialising in a meta description and merely repeats a posture the Work page already states; now "Projects hiAnzy built and delivered directly, each written up as a full case study." `venue` said partner venues were "available for" events, which overclaims a booking guarantee the site never makes; the site's own legend language for these relationships is "Relationships we can activate", so it now reads "…the network can activate for events, launches and experiences…". The other four already matched that language and were left alone.

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

   **[1.5] A performance defect in how Phase 1 passed these was found and fixed. Read this before adding any further JSON-LD.** `Seo.js` lists `jsonLd` in its `useEffect` dependency array, and its effect rewrites the whole document head (title, ~10 meta upserts, remove-and-recreate every JSON-LD block). Phase 1 passed all four new blocks as **inline object literals in JSX**, which creates a fresh object reference on every render — so the effect re-ran on every state change on those pages. On `Contact.js`, whose form state updates per keystroke, that meant a full document-head rewrite **on every character typed into the contact form**. All four are now wrapped in `useMemo` with correct dependencies (`[]`, `[cases]`, `[meta, items, isCaseStudy]`). Measured after the fix with a `MutationObserver` on `document.head`: 19 keystrokes → **0** head mutations, against a control route-change → 21 mutations (proving the observer was live and the zero is real). **Standing rule for later phases: never pass an inline object/array literal to `Seo`'s `jsonLd` prop — always memoise it.** Note `Discipline.js` and `ServiceDetail.js` carry the same inline pattern from before Phase 1; they were left alone because their state churn is negligible, but the same fix applies if they ever gain interactive state.

Left explicitly untouched this phase (documented, not forgotten): enriching `Article` JSON-LD on `InsightDetail.js`/`WorkDetail.js` with `datePublished`/`image` (the underlying case/insight data doesn't confirm those fields exist yet — adding them risks fabricating dates); the commented-out `sameAs` array in `Seo.js`'s org schema (needs real social-profile URLs from the user, explicitly flagged in-code already); the card-level h2-without-section-h2 pattern on `Discipline.js`/`Network.js`/`EcosystemCategoryPage.js` (a real but lower-value a11y/SEO nuance, moderate JSX-structure risk for the value delivered — better as a scoped follow-up than bundled in here).

## 8. Contextual / internal-linking improvements

Wired the existing `NextSteps` component (`components/NextSteps.js`) into `WhatWeDo.js` (the service index) — the `"/what-we-do"` entry in its `JOURNEY` map already existed and was already used by `ServiceDetail.js`, but the index page itself had no onward-journey block, making it a comparative dead end relative to every other major page. This was a one-line, zero-risk addition (the map entry, the component, and its styling all already existed and are already proven elsewhere).

`WorkDetail.js` was flagged as also lacking `NextSteps` and was deliberately left alone: it already carries dedicated, page-appropriate contextual links (related services via `/what-we-do/:slug`, next case, back to `/work`) that the SEO audit independently called "genuinely good cross-linking" — adding a second, more generic link block would be content added "because space exists". That decision stands.

**[1.5] Phase 1 got `InsightDetail.js` wrong and it has now been fixed.** Phase 1 grouped it with `WorkDetail.js` and justified skipping both with the same sentence. That justification is accurate for `WorkDetail` but false for `InsightDetail`, which was verified during validation to link *only* to `/insights`, to other `/insights/:slug` posts, and to `/contact` — **zero links to any service or case study**. It was a content silo: a reader arriving on an article from search could reach more articles or a contact form, but never a capability or a piece of proof. Since "Blog/editorial → relevant services/projects" is an explicitly named requirement of this phase, this was a real under-delivery resting on an inaccurate claim. Fixed by rendering `<NextSteps from="/insights" />` after the `</article>` (outside it — the onward journey is not part of the piece). The `JOURNEY["/insights"]` map entry already existed and already points at `/what-we-do#packages`, `/work` and `/resources`, i.e. exactly the blog→commercial relationship required; no new component, styling or map entry was needed.

`EcosystemCategoryPage.js` remains the closest thing to a dead end on the site (only a "Back to the Orbit" link for 4 of its 6 categories, since those categories don't yet have individual detail routes) — the new `BreadcrumbList` JSON-LD helps machine-readable context, but a real fix here is either new detail routes (out of scope — this is new-feature territory, not cleanup) or linking each item's own external URL more prominently in the UI (a visible-frontend change, out of scope for this phase). Flagged for the next phase.

## 9. Factual limitations (things intentionally not fixed because the facts aren't available)

- **[1.5] OPEN PRE-LAUNCH BLOCKER — privacy notice is incomplete.** `/resources#privacy` accurately describes *what* is collected, but states no **retention period**, names no **data controller**, and states no **lawful basis**, while `backend/server.py` does store name, email, phone, message and IP on every contact submission. IP is personal data under both GDPR and India's DPDP Act. Phase 1 deleted the visible `TODO before launch` note that flagged this (correct — it was addressed to the operator, not the visitor) but that removed the reminder rather than the gap. This needs a decision from the business and, per the deleted note's own advice, a qualified practitioner — it cannot be resolved by writing more copy. **Do not ship to real traffic without closing this.**

- **`Seo.js`'s `sameAs` array** (LinkedIn/Instagram/etc.) is still commented out — no real profile URLs exist anywhere in the repo to fill it with, and the code's own comment already flags this as "the single biggest schema gap left." Needs real URLs from the user.
- **No `ContactPoint`/email in the new `ContactPage` schema** — `Footer.js` still renders a literal `CONTACT_EMAIL` placeholder (`href="mailto:CONTACT_EMAIL"`), confirmed still unresolved this pass. Adding a fabricated or placeholder email to structured data would be worse than omitting it. Same root cause as the Resources.js privacy-page footer-email reference (a pre-existing `TODO(hiAnzy)` code comment, left as-is since it's not rendered content).
- **`Article` JSON-LD `datePublished`/`dateModified`/`image`** on `InsightDetail.js`/`WorkDetail.js` were not added — the audit could not confirm these fields are actually populated in the underlying `insights`/`case_studies` seed data without risking a fabricated date if they aren't. Needs a data-layer check before adding.

## 10. Unresolved risks / methodology notes

- All four JSON-LD additions and both title/heading fixes were verified by building the production bundle (`npm run build`, clean — CRA's own ESLint gate and the repo's `check-seo-output.js` self-check both passed) and serving it locally, then reading `document.title`, injected `<meta name="robots">`, and `script[data-seo-jsonld]` blocks directly in a real browser for `/work`, `/network`, `/work/built-here`, `/contact`, `/coming-soon`, `/resources`, `/what-we-do`, `/what-we-do/advisory-security-scale`, and an unknown route (404 check). All matched expectations exactly.
- The local build calls the API at its build-time-baked origin (`localhost:8001` in this checkout), which isn't reachable from the static-file test server, so case-study/ecosystem-item data (and therefore the conditional `ItemList` blocks) couldn't be observed populated in this pass — only their absence-safe fallback was verified. This is a CORS/environment artifact of local testing, not a defect; re-verify the populated JSON-LD once deployed against the real API (Docker rebuild + live check, same as prior milestones).
- No TypeScript exists in this repo (plain JS throughout), so there is no `tsc` step to run — CRA's bundled ESLint (`react-app`/`react-app/jest`) is the only static-analysis gate, and it ran clean on every build this phase.
- No automated test suite exists to run beyond the build's own checks (confirmed again this pass, matching the prior cleanup audit's finding).
- **[1.5] Duplicate search intent between two live routes.** `/network/venues` (the Events & Venue Production *discipline* page) and `/network/venue-partners` (the Orbit *roster* of partner venues) both target venue-related intent. Phase 1 recorded that the *routing* collision was resolved by renaming, but never flagged the *SEO* collision — two indexable pages competing on the same topic risks cannibalisation and reader confusion. The distinct `seoDescription` added this phase mitigates it (capability page vs. roster page), but if only one of the two ever ranks, that is the likely cause. Worth watching in Search Console once live rather than pre-emptively restructuring.
- **[1.5] `index,follow` is now emitted explicitly on every page.** This is redundant (it is the crawler default) but deliberate: `Seo` upserts a single shared robots tag, so an explicit default is what guarantees the tag resets when a visitor navigates *away* from the 404. A conditional add would have left `noindex` stuck on the next page viewed. Do not "clean this up" without re-testing that navigation path.

## 11. Recommended locations for future experiential/motion features — **[1.5] reclassified**

No list of "13 experiential features" was provided in this session or found anywhere in the repository (checked `.ai-work/`, `plan.md`, `design_guidelines.md`, and the saved plan-mode document). **This remains unreconciled — Phase 2 must not invent the list.** Until it is supplied, the table below is a risk classification of *candidate locations*, not an endorsement of any particular feature landing there.

Phase 1 presented these as a ranked list of recommendations, which reads as permission. Validation reclassified every one against the Master Contract, applying its own rule — *if uncertain, classify as LOCKED*.

| Target | Class | Reasoning |
|---|---|---|
| `WhoWeWorkWith.js` (page-level) | **SAFE** | Thinnest page on the site; only `Reveal`-level motion of its own. Home's teaser ("the full filter, and where we tend to earn our fee") promises more than it delivers, so added depth is justified by the site's own copy. Additive motion only, **around** its shared components, never inside them. |
| `EcosystemCategoryPage.js` empty/error states | **SAFE** | Genuinely static plain text; a voiced illustrated state would match `PopIllustration`'s established idiom elsewhere. Lowest-risk target on the site — the states are rarely rendered and carry no conversion weight. |
| The 4 non-case-study Orbit category **cards** | **CAUTION** | Phase 1 called these "zero motion". They are static `<article>` elements, but the page around them runs `useRevealObserver` (classified MODERATE in §3), so card-level motion has to cooperate with an existing reveal choreography rather than replace it. Also still awaiting detail routes — motion here may be premature. |
| `components/ui/input.jsx`, `textarea.jsx` | **CAUTION** *(was: recommended)* | **Phase 1's clearest strategic misclassification.** These are the `/contact` form fields. The Master Contract lists forms under *E — CRITICAL SYSTEM*, and `/contact` is the primary conversion path. Any change must be purely additive CSS focus/fill polish, must not touch validation, submit, error or honeypot behaviour, and must be verified against a real submission. A "nice input animation" is not worth a conversion regression. |
| `Picture.js`, `ProvenanceTag.js`, `OrbitGlyphs.js` | **CAUTION** | Genuinely static, but each is rendered on many pages. Motion added here appears everywhere at once, including inside LOCKED compositions. Treat as a shared-component change, not a page change. |
| Anything in §4's LOCKED list | **LOCKED** | Unchanged. Includes every `three/*` and `deck/*` file, `PinnedSequence`, `SectionIndex`, `Nav`, `Footer`, `Reveal`, `MagneticButton`, `CharacterQuote`, `lib/motion.js`, and the whole Home landing page composition. |

**Landing-page integrity note for Phase 2:** `Home.js` composes eleven sections, several of them the site's heaviest motion work (`SystemCore` WebGL hero, `HalftoneBackdrop`, `PinnedSequence`, `SystemDiagnostic`, `FitQuadrant`, `TouchpointTicker`). It is the most polished and most conversion-critical surface in the repo and appears nowhere in the SAFE column above. New experiential work should prove itself on a SAFE page first and reach Home last, if at all — and only behind a toggle that can be disabled without the page changing, per the contract's reversibility rule.

---

*Compiled by the Phase 1 audit pass. Next phase per the Master Production Execution Contract: awaiting explicit instruction — no further phase has been started.*
