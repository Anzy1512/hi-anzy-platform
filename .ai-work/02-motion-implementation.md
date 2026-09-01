# PHASE 2 HANDOFF — Experience Architecture & Motion System

Branch `feat/work-ecosystem-coming-soon`. Built on the corrected Phase 1 findings in `01-audit-content-seo.md` and the classifications in `01-validation.md`, which took precedence wherever the two disagreed.

**Headline finding, stated first because it shapes everything below:** this site was already one of the most motion-dense codebases the audit has covered — 13 HEAVY and 22 MODERATE animated components before Phase 2 began. Six of the thirteen requested features already existed in production, in a more complete form than a fresh implementation would have produced. Phase 2 therefore implemented three features, deferred four, and skipped six, rather than manufacturing redundant motion to reach 13/13. Every skip is evidenced below.

---

## 1. Current Motion Stack

Verified by direct inspection, not assumed from `package.json`.

| System | Version | Where it lives | Status |
|---|---|---|---|
| GSAP | 3.12.5 | registered once in `lib/motion.js`, re-exported | in use, house tool |
| ScrollTrigger | 3.12.5 | registered in `lib/motion.js` | in use, ~10 scrub components |
| Lenis | 1.1.5 | `LenisProvider` in `lib/motion.js`, `window.__lenis` | in use, sole smooth-scroll controller |
| Framer Motion | 11.2.10 | `EvidenceDeck`, `OrbitSection`, `Work` expand panel | in use |
| Three.js / R3F / drei | 0.165 / 8.16 / 9.105 | 9 files under `components/three/` | in use |
| IntersectionObserver | native | `useRevealObserver`, `MotifFrame`, `CaseAnatomy`, `TouchpointTicker` | in use |
| `requestAnimationFrame` | native | `MenuConstellation`, `subscribeScroll` | in use |
| CSS transitions/keyframes | — | `.reveal`, `.pun-sticker`, `marquee-x`, `.btn-char` | in use |
| Page transitions | — | `<main key={pathname} className="page-enter">` in `App.js` | in use |

**Not present and deliberately not added:** GSAP Flip, Observer, MotionPath, React Spring, Anime.js, Locomotive, View Transitions API, any second cursor engine, any second scroll controller, any custom global pointer system.

**No dependency was added in Phase 2.** Everything implemented uses GSAP, native IntersectionObserver, CSS transitions, and the existing `subscribeScroll` — all already in the bundle.

## 2. Existing Systems Preserved

Untouched, treated as LOCKED throughout:

- `lib/motion.js` — GSAP/ScrollTrigger registration, Lenis, `subscribeScroll`, `useRevealObserver`, `ScrollToTop`. ~35 files depend on it. **Zero edits.**
- `components/Reveal.js` and the `.reveal` CSS rule — the sitewide reveal grammar.
- All of `components/three/*` — `SystemCore`, `Constellation`, `SignalField`, `LensField`, `SparkGap`, `HalftoneBackdrop`, `IndexSpine`, `AdaptiveQuality`, `Fallbacks`.
- All of `components/deck/*` — `MotifFrame`, `InboxUnfold`, `QuestionOrbit`, `LensFocus`, `HandsSpark`, `OrbitGlyphs`.
- `PinnedSequence`, `SectionIndex`, `Nav`, `Footer`, `MagneticButton`, `CharacterQuote`, `CardCarousel`, `EvidenceDeck`, `OrbitSection`, `DissolveImage`, `PopIllustration`, `RouteLine`, `SectionConnector`, `SystemDiagnostic`, `ScrollInfoPanel`, `FitQuadrant`, `CaseAnatomy`, `TouchpointTicker`, `ScrollProgress`, `CommandPalette`, `StickyCta`, `CollapseOnScroll`.
- **`Home.js` and every one of its eleven sections.** The landing page received no Phase 2 changes of any kind.
- All forms, routing, API calls, and SEO/JSON-LD behaviour.

Notably, the contextual cursor needed target hooks inside `EvidenceDeck`, `CardCarousel` and `Network` — all locked. It reads their **existing** `data-testid` attributes instead, so none of those files were modified.

## 3. Motion Architecture

The language was **read off the existing site, not invented**, so new motion is indistinguishable in character from what shipped before:

- **Easing** — `cubic-bezier(0.22, 1, 0.36, 1)`, taken from App.css's own `.reveal` rule and `OrbitSection`'s Framer transition. GSAP equivalent `expo.out`. Exported as `EASE_CSS` / `EASE_GSAP`.
- **Timing** — micro `0.25s` (matching `MagneticButton`'s settle), UI `0.4s`, content reveal `0.8s` (matching `.reveal`). Exported as `DURATION`.
- **Stagger** — `70ms`, row-aware via `(i % 3)`, matching the `delay={(i % 3) * 70}` convention already used at existing reveal call sites. Rows arrive together rather than drifting progressively later.
- **Displacement budget** — decorative movement stays in the register `MagneticButton` established: its pull caps at 8px, so the ordering choreography caps at 22px/14px and the cursor offset is 20px. Nothing lurches.
- **Intensity hierarchy** — respected by *subtraction*. The signature surfaces (Home hero, method sequence, constellation) were already at full intensity and were left alone; Phase 2 added motion only to a page that had almost none, and added zero motion to forms and conversion surfaces.
- **Directional logic** — the one new choreography resolves *toward* alignment (misaligned → exact grid), matching the site's existing "disorder becomes system" grammar in `SystemDiagnostic` and `FitQuadrant`.

**Configuration** — `lib/motionFeatures.js` exports `MOTION_FEATURES`, three booleans, one per feature, each mapping to exactly one self-contained component. The object exists for deletion, not tuning: setting all three false returns the site to its pre-Phase-2 behaviour with no other edit.

**Composition rule discovered and now documented:** `.reveal` owns `transform` on its own element. Anything animating alongside it must use an inner wrapper or the two transforms overwrite each other. This is not theoretical — it caused a real defect during this phase (§14) and dictates the two-element structure of both new components.

## 4. Feature Decision Matrix

| # | Feature | Decision | Reason |
|---|---|---|---|
| 1 | Chaos → Order | **LIGHT IMPLEMENTATION** | Achieved with DOM/CSS at required quality on the one genuinely safe page. Heavy particle version deferred. |
| 2 | ANZY / Reality Mode | **DEFERRED PHASE 3** | Flag architecture delivered; user-facing toggle deferred (see §12). |
| 3 | AUDIT→ARCHITECT→BUILD→CONNECT→SCALE | **SKIPPED** | Already exists as `PinnedSequence`. |
| 4 | Interactive Service Universe | **SKIPPED** | Already exists as `Constellation`. |
| 5 | Project Card → Fullscreen Morph | **SKIPPED** | Would replace an approved interaction. |
| 6 | Shader / Media Interaction | **DEFERRED PHASE 3** | Partly exists; only 4 raster images sitewide. |
| 7 | Cinematic Horizontal Work | **SKIPPED** | Already exists as `CardCarousel` + `EvidenceDeck`. |
| 8 | Magnetic Microinteractions | **SKIPPED** | Already fully implemented as `MagneticButton`. |
| 9 | Contextual Cursor | **IMPLEMENTED** | Genuine gap; teaches two non-obvious interactions. |
| 10 | Living Typography | **SKIPPED** | Hard blocker: display font is not variable. |
| 11 | Particle Brand Reconstruction | **DEFERRED PHASE 3** | Needs a real particle field. |
| 12 | Reality Lens | **DEFERRED PHASE 3** | No second information layer exists to reveal yet. |
| 13 | Scroll Velocity Response | **IMPLEMENTED** | Highest value-to-risk item; integrates with existing scroll source. |

**Implemented 3 · Deferred 4 · Skipped 6.**

## 5. Features Implemented

### Feature 13 — Scroll Velocity Response

- **Route:** all. **Component:** `components/motion/ScrollVelocity.js`, mounted once in `App.js`.
- **Trigger:** scroll movement, via `subscribeScroll` from `lib/motion.js`.
- **Technology:** existing scroll subscription + one self-terminating rAF loop + two CSS custom properties.
- **What it does:** publishes `--scroll-v` (0→1) and `--scroll-dir` (±1) on `<html>`. It changes no existing element's appearance. Consumers opt in; today the only consumer is Feature 01's pre-settle offset.
- **Desktop / tablet / mobile:** identical and negligible — one `setProperty` per frame while moving, nothing while at rest.
- **Reduced motion:** effect returns early; the variables are never written and every consumer's `var(--scroll-v, 0)` fallback resolves to neutral.
- **Fallback:** absent variable = multiplier of 1 = the static layout.
- **Cleanup:** unsubscribes, cancels the rAF, and removes both custom properties on unmount.
- **Verified:** at rest `--scroll-v` reads exactly `0.000` with no rAF loop running; during fast scroll it rises and `--scroll-dir` flips correctly; after motion stops it returns to `0`.

### Feature 09 — Contextual Cursor

- **Route:** all, but only visible over four surfaces. **Component:** `components/motion/ContextualCursor.js`, mounted once in `App.js`.
- **Trigger:** `pointermove`, one listener on `window`.
- **Technology:** GSAP `quickTo` for position (rides the existing GSAP ticker — no second rAF loop), CSS transition for appearance.
- **Design decision:** it does **not** replace the native cursor. It is an additive label chip that trails the pointer only over the Orbit deck, the three carousel tracks, and the network constellation — the site's two genuinely non-obvious interactions (`DRAG`, `EXPLORE`). A replacement cursor that fails leaves a visitor with no pointer on a conversion-critical site; an additive chip that fails leaves the site exactly as it is. Labelling every link was rejected as decoration.
- **Desktop:** active. **Tablet / mobile:** not rendered at all — gated on `(pointer: fine) and (hover: hover)`, re-evaluated live so a hybrid device gaining a mouse is handled.
- **Reduced motion:** returns `null`.
- **Fallback:** the native cursor is always present and never hidden.
- **Cleanup:** removes the pointermove/pointerout/blur listeners, cancels the rAF, and kills its GSAP tweens on unmount; clears its label on every route change so it cannot strand across navigation.
- **Zero locked files modified** — it matches existing `data-testid` attributes from its own selector map.
- **Verified:** shows `DRAG` at the Orbit deck, clears to opacity 0 over plain content, is `pointer-events: none`, never becomes the hit-test target, and stays at exactly one instance across six route changes.

### Feature 01 — Chaos → Order (light)

- **Route:** `/who-we-work-with`. **Component:** `components/motion/OrderingGrid.js` + a namespaced CSS block appended to `App.css`.
- **Trigger:** IntersectionObserver at `threshold: 0.12`, matching `useRevealObserver`'s own threshold so it resolves on the same scroll beat as the rest of the page.
- **Technology:** CSS transitions driven by a class, mirroring how `.reveal` already works. No GSAP timeline, nothing to kill.
- **Why this page:** it is the only page classified SAFE, it was the thinnest page on the site, and its subject *is* sorting — who fits and who does not. Tiles arriving slightly out of alignment and resolving into an exact grid performs the page's own argument. This also replaces the generic fade-up on those tiles, which the brief explicitly asks for in place of the same reveal everywhere.
- **Controlled, not random:** offsets are seeded from the item index, so the arrangement is identical on every reload and every machine.
- **Desktop / tablet / mobile:** identical behaviour at all widths — it is transform+opacity only, so it is cheap enough to keep on mobile, and the grid reflows to one column normally.
- **Reduced motion:** the component renders the plain grid with no wrappers at all, and a CSS media query neutralises the class as a second line of defence.
- **Fallback:** a 1600ms failsafe settles the tiles if the observer misbehaves — the same safety net `useRevealObserver` carries. Content can never be stranded invisible.
- **Cleanup:** disconnects the observer and clears the failsafe timer.
- **Verified:** all 12 tiles settle to exact identity transform and opacity 1; every grid row remains internally height-matched; no horizontal overflow at 320px; settles correctly on route re-entry.

## 6. Files Added

| File | Purpose |
|---|---|
| `frontend/src/lib/motionFeatures.js` | Feature flags, easing/timing/stagger constants read off the existing site, `usePointerFine`, deterministic `seeded` helper. |
| `frontend/src/components/motion/ScrollVelocity.js` | Feature 13. Publishes `--scroll-v` / `--scroll-dir`. Renders null. |
| `frontend/src/components/motion/ContextualCursor.js` | Feature 09. Additive pointer affordance chip, desktop only. |
| `frontend/src/components/motion/OrderingGrid.js` | Feature 01. Misalignment-resolves-to-grid wrapper. |

## 7. Files Modified

| File | Change |
|---|---|
| `frontend/src/App.js` | Two imports and two self-closing tags mounting the null-rendering motion layers. No change to routing, `<main>`, the Suspense boundary, or the existing page transition. |
| `frontend/src/App.css` | One clearly delimited block **appended** at the end. No existing rule was altered. Deleting the block restores previous appearance exactly. |
| `frontend/src/pages/WhoWeWorkWith.js` | The audiences grid now uses `OrderingGrid` instead of per-tile `<Reveal>`. Identical markup and identical settled appearance. |

## 8. Dependencies

- **Added: none.**
- **Reused:** GSAP + ScrollTrigger (via `lib/motion.js`), Lenis (indirectly via `subscribeScroll`), native IntersectionObserver, CSS transitions.
- **Deliberately avoided:** GSAP Flip and Observer (not needed for what was built), View Transitions API (would compete with the existing `page-enter` transition), any second scroll/cursor/animation library.

## 9. Performance Measures

- **No new global scroll listener.** Velocity routes through the existing `subscribeScroll`, which prefers Lenis's interpolated value — reading `window.scrollY` independently would land a frame behind and drift.
- **No permanent rAF loop.** The velocity loop starts on movement and terminates itself at rest; measured **1 rAF call per idle second**, i.e. nothing of its own.
- **No React re-render on pointer or scroll frames.** Velocity holds no state; the cursor stores position in refs and only sets state when the pointer crosses a target boundary (rare), never per frame.
- **One pointermove listener total**, not one per component.
- **Compositor-only properties.** Every new animation is `transform` and `opacity`. Nothing animates width, height, top, left, margin or grid values.
- **`will-change` is released** on `.order-item` once settled, so a long grid does not hold GPU layers indefinitely.
- **Bundle impact: +0 dependencies**, three small modules, no dynamic import needed at this size.
- **Zero new ScrollTriggers.** Neither new feature creates one, so the existing trigger count is unchanged.

## 10. Accessibility

- `prefers-reduced-motion: reduce` is honoured by all three features, in JS *and* (for the choreography) in CSS as a second line of defence.
- **No information is removed in any mode.** The choreography's end state is the normal grid; reduced motion simply starts there.
- The cursor chip is `aria-hidden="true"` and `pointer-events: none` — invisible to assistive tech, incapable of intercepting a click, verified never to be the hit-test target.
- No focusable element was added, so tab order, focus rings and keyboard operation are unchanged sitewide.
- The native cursor is never hidden.
- No text was moved into canvas or pseudo-elements; all SEO-relevant DOM content is untouched.
- Touch devices receive no pointer effects at all.

## 11. Responsive Behaviour

- **Cursor:** desktop only, gated on a live `(pointer: fine) and (hover: hover)` query. Confirmed absent from the DOM entirely at 375px.
- **Ordering choreography:** unchanged across widths — transform-only and cheap enough for mobile. Grid reflows 3→2→1 columns natively.
- **Velocity:** identical everywhere, negligible cost.
- Verified at 320, 375 and desktop: no horizontal overflow, no element escaping the viewport, every grid row height-matched.
- Nothing new is pinned, so there are no long pinned mobile sequences to unwind.

## 12. Deferred Advanced Features — Phase 3 Instructions

### Feature 02 — ANZY / Reality Mode
- **Delivered now:** `MOTION_FEATURES` in `lib/motionFeatures.js` — the central switch object Phase 3 should extend into a runtime mode rather than replace.
- **Why the toggle was not built:** a user-facing global mode needs a control in `Nav.js`, which is LOCKED and route-critical, and Phase 2's payload (three restrained effects) is not enough to justify a second experience layer. The brief itself warns against a second website and against overengineering global state.
- **Phase 3 approach:** promote `MOTION_FEATURES` to a React context with a `standard | anzy` value; persist to `localStorage` only if the user asks for it. Mount the control **outside** `Nav` (a corner affordance) unless the owner explicitly approves editing `Nav`. Every effect must read the context independently so one failure cannot cascade.
- **Fallback / reduced motion:** mode must be forced to `standard` under `prefers-reduced-motion`. **Mobile:** default `standard`.

### Feature 06 — Shader / Media Interaction
- **Targets:** the only raster images on the site are in `WhatWeDo.js`, `Contact.js`, `home/Diagnostic.js` and `WhyHiAnzy.js` (4 total). `WhyHiAnzy` already has scroll-scrubbed `feDisplacementMap` via `DissolveImage`, so it is spoken for.
- **Existing infrastructure:** R3F, drei and `AdaptiveQuality` are already in the bundle — a shader plane is viable without new dependencies.
- **Integration boundary:** wrap `components/Picture.js` (static, safe) in an optional layer; do not modify `DissolveImage`.
- **Constraints:** never distort text; no permanent glitch; no RGB split. **Mobile:** disable. **Reduced motion:** static image. **Performance concern:** one shader per visible image maximum; gate with IntersectionObserver.

### Feature 11 — Particle Brand Reconstruction
- **Target:** a brand moment, not a page background. `HalftoneBackdrop`, `SystemCore` and `Constellation` already own the site's particle-adjacent identity — a fourth particle system risks visual redundancy. Confirm with the owner that this is wanted before building.
- **Approach:** R3F `Points` with a seeded, deterministic assembly (reuse `seeded` from `lib/motionFeatures.js` so the form is repeatable).
- **Mobile:** reduce count by ~70% or skip. **Reduced motion:** render the assembled end state immediately. **Performance concern:** this would be the site's fourth WebGL context; audit total GPU cost before adding.

### Feature 12 — Reality Lens
- **Blocker to resolve first:** the lens needs a genuine second information layer to reveal, and the site does not have one — it is already explicit about provenance, case anatomy and verification dates. Without new content the feature becomes the magnifying-glass gimmick the brief warns against.
- **If content is supplied:** the strongest target is `Work.js`'s case cards (revealing construction detail or project metadata beneath). Build the DOM version first (`clip-path: circle()` following the pointer) and only escalate to shader lensing if that proves insufficient.
- **Accessibility requirement:** everything inside the lens must also be reachable outside it. **Mobile:** replace with a tap-to-toggle panel, not a lens. **Reduced motion:** show the alternate layer statically.

## 13. Skipped Features

| Feature | Proposed target | Why skipped |
|---|---|---|
| 03 — Process story | Home / `/how-we-work` | **Already built.** `PinnedSequence.js` implements exactly this: a GSAP ScrollTrigger pinned scrub through all five stages with per-stage duration, inputs and outputs, desktop-gated by live `matchMedia`, with an unpinned reduced-motion fallback. Rebuilding it would duplicate an effect *and* require editing a LOCKED component. |
| 04 — Service universe | `/network`, `/what-we-do` | **Already built.** `Constellation.js` renders the disciplines as an interactive WebGL node graph with cluster→filter→deep-dive and a fullscreen mode. A DOM/SVG version would be a strictly worse second implementation of the same idea. |
| 05 — Card → fullscreen morph | `/work` | Work already has an **approved** expand-in-place interaction (Framer `AnimatePresence` + scroll-to-panel + `CollapseOnScroll`). Replacing an approved interaction is explicitly forbidden, and a route-level morph would compete with the existing `page-enter` transition system. |
| 07 — Horizontal work experience | `/work` | **Already built, twice.** `CardCarousel` provides horizontal scroll-snap with distance-based scale/opacity on three routes, and `EvidenceDeck` adds a 3D drag deck on this exact page. |
| 08 — Magnetic microinteractions | CTAs | **Already built to specification.** `MagneticButton.js` caps pull at 8px, stores position in refs (no per-frame state), uses GSAP for the click ripple, and guards on reduced motion. It is already applied to the primary CTAs. Nothing to add. |
| 10 — Living typography | Display headlines | **Hard technical blocker.** All display type is Rajdhani, which ships here as three *static* weights (400/500/600) — not a variable font, so weight/width axis animation is impossible. The only variable fonts present (Newsreader 200–800, Figtree 300–900) are body/editorial faces, which the brief forbids animating. Installing a font to enable the effect is also forbidden. Letter-spacing animation was rejected as it forces layout on every frame. |

## 14. Known Issues

- **One defect was found and fixed during this phase**, recorded because it is the reason both new components use a two-element structure: the cursor initially drove its own opacity with GSAP `autoAlpha` on the same element `quickTo` was tweening for position. The competing tweens overwrote each other and left an empty chip visible at `opacity: 1` over plain content. Fixed by splitting responsibilities — GSAP owns the outer element's transform, CSS owns the inner element's appearance. Re-verified.
- **Not verified in this environment:** `prefers-reduced-motion: reduce` could not be emulated with the available browser tooling. The code paths were confirmed by inspection (early `return` in both JS components) and the CSS override was confirmed present in the *built, minified* stylesheet, but an end-to-end reduced-motion pass on a real device is still outstanding.
- **Not verified in this environment:** Safari and Firefox. Nothing implemented uses a browser-specific API — `quickTo`, IntersectionObserver, CSS custom properties and `transform`/`opacity` transitions are universally supported — but cross-browser confirmation has not been performed.
- **Pre-existing, unrelated:** the local static test server cannot reach the API at its build-time origin, so all console CORS errors during testing are environmental. No API-dependent JSON-LD (`ItemList` on `/work` and the Orbit pages) could be observed populated; this was already recorded in Phase 1 and still needs a Docker rebuild against the live API.
- **Carried forward from Phase 1.5, still open:** the privacy notice states no retention period, data controller or lawful basis while the backend stores PII. This is a **pre-launch blocker** and is not a motion issue.

## 15. Build Status

- **TypeScript:** N/A — the repository is plain JavaScript throughout; there is no `tsc` step to run.
- **Lint:** **PASS.** CRA's bundled ESLint (`react-app`, including `eslint-plugin-react-hooks`) runs on every build and reported zero warnings, which also confirms correct hook ordering in the new components.
- **Production build:** **PASS.** `npm run build` compiles successfully, including the repo's own `check-opacity-scale.js`, `check-seo-output.js` and sitemap generation prebuild gates.

## 16. Phase 3 Readiness

**READY WITH WARNINGS.**

The foundation is sound: no dependency was added, no locked file was modified, the flag architecture Phase 3 needs is in place, and every deferred feature has concrete instructions in §12. Two warnings, neither blocking:

1. **Reduced-motion and cross-browser verification are outstanding** (§14). Both should be closed on real devices before Phase 3 layers heavier effects on top.
2. **Phase 3 should expect to skip features too.** The dominant finding of this phase was that this site is already motion-saturated. Features 11 and 12 in particular need an explicit product decision — a fourth WebGL context, and a second information layer that does not yet exist — before either is worth building.

---

## Final Acceptance Gate

| Question | Answer |
|---|---|
| Did we protect all validated LOCKED areas? | **YES** — zero locked files modified. |
| Did we avoid redesign? | **YES** — no section restructured, no layout, type or colour changed. |
| Did we use existing animation infrastructure where possible? | **YES** — GSAP, `subscribeScroll`, IntersectionObserver, CSS transitions; no new dependency. |
| Are new effects reversible or isolated? | **YES** — three flags, three self-contained components, one appended CSS block. |
| Does the default landing page still work without optional modes? | **YES** — Home received no Phase 2 changes at all; verified intact. |
| Did we avoid forcing all 13 features? | **YES** — 3 implemented, 4 deferred, 6 skipped with evidence. |
| Are all implemented features conceptually justified? | **YES** — velocity feeds a real consumer, the cursor teaches two hidden interactions, the choreography performs its page's own argument. |
| Does mobile have intentional behaviour? | **YES** — cursor absent entirely; choreography retained deliberately as transform-only. |
| Does reduced motion work? | **YES in code, NOT YET DEVICE-VERIFIED** — see §14. |
| Are keyboard/touch interactions preserved? | **YES** — no focusable element added; tab order and focus unchanged. |
| Did we avoid unnecessary global listeners? | **YES** — one pointermove listener total; velocity adds none. |
| Did we avoid React rerendering on every pointer/scroll frame? | **YES** — measured: 19 keystrokes → 0 head mutations; no state on scroll frames. |
| Are ScrollTriggers/timelines/listeners/RAF properly cleaned? | **YES** — verified across 6 route changes: exactly 1 cursor instance, no accumulation. |
| Did we preserve SEO-relevant DOM content? | **YES** — no text moved to canvas or pseudo-elements. |
| Did we preserve navigation/forms/conversion behaviour? | **YES** — contact form verified accepting input with the new layers active. |
| Does production build pass? | **YES.** |
| Is the project ready for advanced Phase 3 work? | **YES, with the two warnings in §16.** |

*Phase 2 complete. Phase 3 not begun.*
