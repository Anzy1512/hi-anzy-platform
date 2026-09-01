# PHASE 3 HANDOFF — Advanced Experience & Performance Engineering

Branch `feat/work-ecosystem-coming-soon`. Built on `01-audit-content-seo.md`, `01-validation.md` and `02-motion-implementation.md`, with current repository behaviour taking precedence over all of them.

**Headline: Phase 3 added no new WebGL and removed a large amount of wasted GPU work.**

The phase opened by applying its own core principle — *does WebGL produce a materially better result than DOM + CSS + GSAP?* — to every deferred candidate. The answer was no in every case, for evidenced reasons. Meanwhile a measurement of the seven WebGL scenes already in production found that **scenes kept rendering at full rate while completely invisible**. Fixing that was worth more than any eighth scene, and it is what this phase delivers.

---

## 1. Advanced Feature Decision Matrix

| Feature | Phase 2 status | Decision | Reason |
|---|---|---|---|
| Chaos → Order advanced | Light DOM version shipped | **KEPT PHASE-2 VERSION** | The DOM/CSS version reaches the intended quality. A particle field would duplicate `SystemDiagnostic` (scattered→connected, Home) and `PinnedSequence` (the five stages), both already shipped. WebGL adds no meaning here. |
| ANZY / Reality Mode | Flags shipped, toggle deferred | **SKIPPED** | Every candidate advanced module below was skipped or deferred, so the mode would toggle nothing. A switch with no payload is architecture theatre. The `MOTION_FEATURES` object remains for when there is something to gate. |
| Interactive Service Universe | Skipped (already exists) | **KEPT EXISTING** | `Constellation.js` already is this, in WebGL, with cluster→filter→deep-dive and fullscreen. Rebuilding it would be a strictly worse second implementation. |
| Shader / Media System | Deferred | **SKIPPED** | Only four raster images exist sitewide, and they are decorative brand illustrations, not portfolio media. One (`WhyHiAnzy`) already has scroll-scrubbed `feDisplacementMap` via SVG filters — cheaper than WebGL for the same result. Two of the remaining three sit on `/what-we-do` and `/contact`; adding a GPU context to the conversion page fails the priority hierarchy. |
| Particle Brand Reconstruction | Deferred | **SKIPPED** | Would be the site's fourth particle-adjacent system (`HalftoneBackdrop`, `SystemCore`, `Constellation` already own that language) and the eighth WebGL context, landing on the highest-protection surface. Needs an explicit product decision, not an engineering one. |
| Reality Lens | Deferred | **SKIPPED** | Blocker unchanged since Phase 2: there is no second information layer to reveal. The site is already explicit about provenance, case anatomy and verification dates, so a lens would reveal what is already on screen — the magnifying-glass gimmick the brief prohibits. |
| Shared spatial/depth environment | — | **SKIPPED** | Would require unifying seven independent, working scenes into one renderer. Enormous blast radius across LOCKED files for no user-visible gain. |
| **Scene visibility gating** | — | **IMPLEMENTED** | Not on the original list; found by measurement. See §4. |

**Implemented 1 · Kept 2 · Skipped 5.**

## 2. Rendering Architecture

Unchanged, deliberately. The site's existing architecture was audited and found sound:

- **Canvas strategy:** one canvas per scene, seven scenes total, never more than three on a route. No canvas-per-card or canvas-per-button anywhere. No change made.
- **R3F/Three:** each scene is a self-contained `<Canvas>` with its own `SceneInner`. No shared renderer. Unifying them was considered and rejected (§1).
- **Shared systems already present:** `AdaptiveQuality` (FPS-driven tiering), `Fallbacks.js` (`ThreeSafe` error boundary + static SVG fallbacks), `webglAvailable()` capability detection, `subscribeScroll` (single scroll source). Phase 3 extended this set with one hook rather than building a parallel framework.
- **Lazy loading:** already in place — every scene is behind `React.lazy` + `Suspense`, so Three.js ships in separate chunks, not the main bundle.
- **Render-loop strategy: changed.** Previously every scene ran `frameloop="always"` unconditionally. Now the five scenes that scroll out of view run only while visible.

## 3. Quality Tiers

These already existed in `AdaptiveQuality.js` and were **not** rebuilt. Documented here because Phase 3 asked for them and they are real:

| Tier | DPR cap | Selection |
|---|---|---|
| **HIGH** | 2 | `PerformanceMonitor` incline, or pointer hover on a scene (deliberate intent to look closely) |
| **MEDIUM** (`standard`) | 1.75 | Default for every scene |
| **LOW** | 1 | `PerformanceMonitor` decline on sustained frame drops |
| **FALLBACK** | none | No WebGL, reduced motion, or a scene throwing — hand-drawn static SVG diagrams with `role="img"` and real `aria-label` text |

Tier changes step one level per event with a floor and ceiling (hysteresis), so borderline hardware does not oscillate. DPR is capped by tier *and* by `window.devicePixelRatio`, so it is never blindly used at full value. `onTier` lets a scene thin its own effects, not just resolution.

**Phase 3 adds a fifth state orthogonal to these: not rendering at all** when the scene cannot be seen.

## 4. Advanced Features Implemented

### Scene visibility gating

- **Feature:** stop a WebGL scene's render loop while it is off screen or its tab is hidden.
- **Routes:** `/` (hero + network preview), `/network`, `/insights`, `/collaborate` — i.e. every scene that scrolls out of view.
- **Components:** new hook `components/three/useSceneVisibility.js`, applied in `SystemCore`, `Constellation`, `SignalField`, `LensField`, `SparkGap`.
- **Technology:** native `IntersectionObserver` + `visibilitychange`, driving R3F's own `frameloop` prop. No new dependency, no new rAF loop, no new global listener beyond one observer per scene.
- **Trigger:** the scene entering/leaving a 400px margin around the viewport, or the tab being hidden/restored.

**The problem it fixes, measured.** On the home page, before the change:

| Scroll position | Scenes actually visible | Draw calls / 2s |
|---|---|---|
| Top | backdrop + hero | 20,230 |
| Bottom (hero 11,500px above viewport) | backdrop only | 20,160 |

Scrolling 11,500px past the hero changed GPU draw work by **0.3%**. Browsers only throttle `requestAnimationFrame` for a hidden *tab*, never for an element scrolled out of view, so every scene rendered into nothing. The dominant cost was `Constellation`, mounted inside the home page's NetworkPreview roughly 8,000px below the fold and drawing ~150 calls per frame while invisible.

**After the change**, measured in a single consistent session: hero visible **1,734** draws / 2s vs hero off screen **288** — an **83% reduction**. Mechanism confirmed independently on `/insights`: **0** draw calls while scrolled away, **3,114** on return.

- **Desktop:** full behaviour as above.
- **Tablet:** identical — the gate is viewport-based, not device-based.
- **Mobile:** identical, and worth more there: the same wasted rendering costs battery and thermal headroom on exactly the hardware least able to absorb it.
- **Reduced motion:** no effect, by construction. `Home.js` and `Network.js` compute `show3d = !prefersReducedMotion() && webglAvailable()`, so under reduced motion the scenes are never mounted and this hook never runs. The static SVG fallbacks render instead.
- **Fallback:** if `IntersectionObserver` is unavailable the hook returns early and leaves the scene running — failing toward the previous behaviour rather than toward a blank canvas.
- **Loading behaviour:** unchanged; scenes remain lazy-loaded behind Suspense.
- **Cleanup:** the observer is disconnected and the `visibilitychange` listener removed on unmount. Verified across 13 navigations (§16).

## 5. Shader System

**Not built** — see §1. No new shaders, materials or textures were introduced in Phase 3. The existing scenes' materials were not modified.

## 6. Particle System

**Not built** — see §1. The existing particle-adjacent scenes (`HalftoneBackdrop`, `SystemCore`, `Constellation`, `SignalField`) were not modified other than the visibility gate, which changes when they render, never what they render.

## 7. ANZY Mode

**Not built.** Phase 2's `MOTION_FEATURES` flag object in `lib/motionFeatures.js` remains the extension point. Phase 3 deliberately did not promote it to a user-facing mode because every advanced module that would have justified one was skipped for the evidenced reasons in §1. Building the toggle first and finding a payload later inverts the priority hierarchy.

If a future phase does build it: promote `MOTION_FEATURES` to a React context, force `standard` under `prefers-reduced-motion`, mount the control outside `Nav.js` unless the owner approves editing that LOCKED, route-critical component, and have each effect read the context independently so one failure cannot cascade.

## 8. Service Universe

**Kept as-is.** `Constellation.js` on `/network` remains the implementation. Verified this phase: all **16 disciplines are real `<a href="/network/…">` elements in the DOM**, so the canvas is an enhancement and never the only route to the content. Mobile renders the same scene with `touchAction: "pan-y"` so a finger landing on the diagram still scrolls the page. Fullscreen mode verified working, closing on Escape, and leaving no orphaned canvas.

## 9. Reality Lens

**Not built** — see §1.

## 10. Performance Engineering

- **DPR:** capped per tier (1 / 1.75 / 2) and additionally clamped to the real `devicePixelRatio`. Never used raw. Pre-existing; verified.
- **Render scheduling: the phase's main change.** Five scenes moved from unconditional `frameloop="always"` to visibility-gated. 83% fewer draw calls on the home page once scrolled past the hero, 100% fewer on a scene fully off screen.
- **Visibility pausing:** both axes — element off screen (`IntersectionObserver`) and tab hidden (`visibilitychange`). The tab axis proved to matter: the test browser was observed rendering ~10,000 draw calls/second while `document.hidden === true`, so rAF throttling in background tabs cannot be relied on.
- **Draw-call management:** no scene's geometry was changed. The reduction comes from not drawing at all when nothing can be seen, which is the cheapest possible optimisation.
- **Texture optimisation:** not applicable — no new textures; existing scenes are procedural geometry, not textured.
- **Lazy loading:** already in place and unchanged; Three.js remains in separate chunks behind `React.lazy`.
- **Bundle impact:** main bundle **219.32 kB → 220.4 kB gzipped across Phases 2 *and* 3 combined** (+1.08 kB). Phase 3's own contribution is one small hook. No dependency added in either phase.

## 11. Accessibility

- **Reduced motion:** unchanged and still correct — scenes are not mounted at all under `prefers-reduced-motion`, and the hand-drawn SVG fallbacks (`SystemCoreFallback`, `SignalFieldFallback`, `ConstellationFallback`) carry `role="img"` with descriptive `aria-label`s.
- **Semantic fallback:** verified this phase that no critical information is canvas-only — all 16 discipline links exist as real anchors in the DOM on `/network`, including at 375px.
- **Keyboard/touch:** no focusable element was added or removed; no keyboard trap introduced. The gate is invisible to assistive technology because it changes only whether frames are drawn.
- **No new canvas** means no new accessibility surface to mitigate.

## 12. Failure Handling

- **No WebGL:** `webglAvailable()` gates scene mounting; static SVG fallbacks render. Unchanged.
- **Scene throws at runtime:** `ThreeSafe` error boundary catches it and swaps in the fallback, including for a context lost after first paint. Unchanged.
- **Initialisation failure of the gate itself:** the hook returns early without `IntersectionObserver`, leaving `active` true — the scene runs exactly as it did before Phase 3. It fails toward working, not toward blank.
- **A defect was found and fixed in this phase** — see §17.

## 13. Files Added

| File | Purpose |
|---|---|
| `frontend/src/components/three/useSceneVisibility.js` | The only new file. Returns `{ ref, active }`; gates a scene's `frameloop` on element and tab visibility. |

## 14. Files Modified

Five scene files, two to three lines each — an import, a hook call, and the `frameloop` prop:

| File | Change |
|---|---|
| `components/three/SystemCore.js` | Gate on the existing wrapper div. |
| `components/three/Constellation.js` | Gate on the existing wrapper div. |
| `components/three/SignalField.js` | Gate on the existing wrapper div (component converted from implicit to explicit return). |
| `components/three/LensField.js` | Gate via ref on the `<Canvas>` itself — this component's root *is* the canvas, and adding a wrapper would change the DOM its parent lays out. |
| `components/three/SparkGap.js` | Same as `LensField`. |

No scene's geometry, materials, camera, lighting or visual output was altered. No layout, content, routing, SEO or Phase 1/2 behaviour was touched.

## 15. Dependencies

- **Added: none.**
- **Reused:** native `IntersectionObserver`, native Page Visibility API, R3F's own `frameloop` prop, the existing `AdaptiveQuality` and `ThreeSafe` systems.
- **Rejected:** `@react-three/postprocessing` (no effect justified it), any GPU-particle library (no particle feature approved), any state-management package for ANZY Mode (the existing flag object suffices and the mode was not built).

## 16. Resource Lifecycle

- **Geometry / materials / textures:** none created or destroyed by Phase 3. R3F continues to own the lifecycle of everything declared in the existing scenes.
- **Renderer:** not created or disposed by Phase 3. Critically, gating uses `frameloop`, which *pauses the loop* rather than unmounting the canvas — so no WebGL context is destroyed or recreated on scroll. Context churn would have been far worse than the waste being fixed.
- **Listeners:** one `IntersectionObserver` and one `visibilitychange` listener per gated scene, both removed on unmount.
- **rAF:** no new loop. The gate manipulates R3F's existing one.
- **Verified:** three full navigation cycles across `/` → `/network` → `/insights` → `/collaborate` (13 navigations) produced identical canvas counts every time — Home 3, Network 1, Insights 1, Collaborate 0 — with the Phase 2 cursor at exactly one instance throughout. No accumulation of canvases, renderers or listeners. Fullscreen constellation opened, rendered, closed on Escape, and returned the canvas count to 1.

## 17. Performance Risks Remaining

Stated explicitly rather than buried:

1. **Occluded scenes still render.** `IntersectionObserver` reports geometric intersection, not occlusion. While the network constellation's fullscreen overlay is open, the inline constellation underneath is still "intersecting" and keeps drawing — measured at 43,200 draws/1.5s versus 21,600 with fullscreen closed, i.e. exactly double. It is a transient state the user opts into, and fixing it would mean threading fullscreen state from `Network.js` into `Constellation.js` — more coupling into LOCKED files than the transient saving justifies. Worth doing if fullscreen becomes a common path.
2. **`SystemCore` runs a permanent rAF loop of its own**, separate from R3F's, driving the hero intro progress. It continues after the intro completes and is not visibility-gated. The per-frame work is one clamp and one assignment — negligible CPU — but it prevents the main thread going fully idle on the home page. Left alone because touching it means editing more LOCKED code for a very small win.
3. **`HalftoneBackdrop` and `IndexSpine` are not gated** because they are `fixed` and always on screen, so intersection gating would be a no-op. Both are already the cheapest scenes (`dpr={1}`, `antialias: false`, `powerPreference: "low-power"` on the backdrop).
4. **The 400px resume margin is a judgement call.** It exists because THREE's clock keeps advancing while the loop is stopped, so a scene resumes at a different phase of its own animation than where it paused. Resuming early means that discontinuity happens off screen. On a very fast flick-scroll a scene could still become visible within a frame or two of resuming; no visible artefact was observed, but the margin may need raising if one is reported.

## 18. Features Skipped

Full reasoning in §1. In brief: **Shader/Media** (no suitable media — four decorative illustrations, one already treated with cheaper SVG filters, two on pages where a GPU context is unjustified); **Particle Reconstruction** (fourth particle system, eighth context, highest-protection surface, needs a product decision); **Reality Lens** (no second information layer exists to reveal); **ANZY Mode** (nothing left to gate behind it); **Shared spatial environment** (huge blast radius, no user-visible gain); **Service Universe** and **Chaos→Order** kept in their existing forms.

## 19. Build Status

- **TypeScript:** N/A — the repository is plain JavaScript; there is no `tsc` step.
- **Lint:** **PASS.** CRA's bundled ESLint (including `eslint-plugin-react-hooks`) reported zero warnings, confirming correct hook usage in the five modified scenes.
- **Production build:** **PASS.** Compiles cleanly including `check-opacity-scale.js`, `check-seo-output.js` and sitemap generation. Main bundle 220.4 kB gzipped.
- **Console:** clean. The only errors on the local test server are the pre-existing CORS failures from the API being unreachable at its build-time origin — no WebGL, shader, React or lifecycle errors.

## 20. Phase 4 Readiness

**READY WITH WARNINGS.**

The codebase is in better shape than when Phase 3 began: materially less wasted GPU work, no new dependencies, no new complexity, and one genuine defect found and fixed. Warnings, none blocking:

1. **Reduced motion and cross-browser remain device-unverified**, carried forward from Phase 2. Nothing in Phase 3 uses a browser-specific API (`IntersectionObserver`, Page Visibility and R3F's `frameloop` are universal), and reduced motion is safe by construction here since scenes are not mounted at all in that mode — but neither has been confirmed on real Safari or Firefox.
2. **Absolute frame-rate numbers could not be measured reliably** in the automation harness: the browser pane's `document.visibilityState` flipped between sessions, and rAF throttling with it, so cross-session magnitudes are not comparable. Every figure quoted in this document is a within-session comparison taken back-to-back under identical conditions, which is what makes the ratios trustworthy. A profiling pass on real hardware would be worth doing before Phase 4 adds anything heavy.
3. **The privacy notice is still an open pre-launch blocker** carried from Phase 1.5 — no retention period, data controller or lawful basis, while the backend stores PII. Not a rendering issue, but it gates launch.

---

## Final Acceptance Gate

| Question | Answer |
|---|---|
| Did every WebGL feature genuinely justify WebGL? | **YES** — no new WebGL was added; every candidate failed the test and was skipped. |
| Did we avoid turning the site into a 3D demo? | **YES** — the scene count is unchanged at seven. |
| Does core content work without WebGL? | **YES** — verified: 16 discipline links are real DOM anchors; SVG fallbacks carry `role="img"` labels. |
| Does standard mode work independently of ANZY Mode? | **YES** — ANZY Mode does not exist; the site has no mode dependency. |
| Can ANZY Mode be repeatedly enabled/disabled safely? | **N/A** — not built (§7). |
| Are advanced modules lazy-loaded where appropriate? | **YES** — pre-existing `React.lazy` + Suspense on every scene, unchanged. |
| Are invisible advanced scenes paused? | **YES** — this is the phase's principal deliverable. 83% fewer draw calls off screen; 0 when fully away. |
| Is DPR controlled? | **YES** — capped per tier and clamped to the real device ratio. |
| Are particle counts tiered? | **YES** — via `AdaptiveQuality`'s `onTier`, pre-existing. |
| Are draw calls reasonably controlled? | **YES** — materially better than before this phase. |
| Are textures appropriately optimized? | **YES** — no new textures; existing scenes are procedural. |
| Are shaders restrained and performant? | **YES** — none added. |
| Are owned GPU resources correctly cleaned? | **YES** — Phase 3 owns none; it pauses loops rather than destroying contexts, avoiding context churn. |
| Does route navigation avoid duplicated render systems? | **YES** — 13 navigations, identical canvas counts throughout. |
| Does mobile receive a deliberate simplified experience? | **YES** — same tiering and fallbacks, plus the gate now saves battery and thermal headroom where it matters most. |
| Does reduced-motion work? | **YES in code, NOT DEVICE-VERIFIED** — safe by construction (scenes unmounted), but see §20. |
| Is no critical information canvas-only? | **YES** — verified on `/network` at 375px. |
| Do advanced failures fall back safely? | **YES** — `ThreeSafe` + capability checks + a gate that fails toward rendering. |
| Did we preserve Phase-2 interactions? | **YES** — re-verified: 12/12 tiles settle to identity, cursor present on desktop and absent on touch, velocity at rest. |
| Did we preserve SEO/content architecture? | **YES** — no content, metadata, heading or link changed. |
| Does production build pass? | **YES.** |
| Is Phase 4 safe to begin? | **YES**, with the warnings in §20. |

*Phase 3 complete. Phase 4 not begun.*
