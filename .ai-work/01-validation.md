# Phase 1.5 — Strategic Validation of Phase 1

Independent review of `.ai-work/01-audit-content-seo.md` and the commit it describes (`b8ec115`). Scope was validation, not re-audit: Phase 1's discovery was spot-checked rather than repeated, and reasoning was spent on decisions that would become expensive if carried forward. Corrections were applied in place; `01-audit-content-seo.md` now carries **[1.5]** markers wherever validation changed it.

---

## Verdict

**PASS WITH CORRECTIONS.**

Phase 1's understanding of the business, the stack and the site was accurate. Its judgement was mostly conservative in the right direction — it declined to invent facts, declined to touch LOCKED motion, and declined several plausible-but-unsupported SEO additions for defensible reasons. Six findings needed correcting, of which one was a real defect shipped to the branch, one was an under-delivery justified by an inaccurate claim, and one was a classification that would have been genuinely expensive if Phase 2 had acted on it.

Nothing found rises to REQUIRES REWORK. The audit's route map, stack description, animation inventory and LOCKED list were verified accurate and are safe to build on.

---

## Critical corrections made

**1. Document-head rewrite on every keystroke in the contact form.** *(defect, shipped in `b8ec115`, now fixed)*

`Seo.js` lists `jsonLd` in its `useEffect` dependency array, and that effect rewrites the entire document head — title, ~10 meta upserts, and a remove-and-recreate of every JSON-LD block. Phase 1 passed all four of its new schema blocks as **inline object literals in JSX**, which produces a new object reference on every render. On `Contact.js` — whose `form` state updates on every character — this meant a full head rewrite per keystroke. Phase 1 did not notice because it verified the JSON-LD *output* was correct, which it was, and never checked the cost of producing it.

All four call sites are now `useMemo`-wrapped with correct dependencies. Verified empirically rather than by inspection: a `MutationObserver` on `document.head` recorded **0 mutations across 19 keystrokes**, with a control route-change recording **21** — confirming the observer was live and the zero was real rather than an instrumentation failure. Expanding the Orbit deck on `/work` likewise now records 0, and still expands correctly.

A standing rule has been written into the handoff doc: never pass an inline object or array to `Seo`'s `jsonLd` prop.

**2. `InsightDetail.js` was left a content silo on an inaccurate justification.** *(under-delivery, now fixed)*

Phase 1 grouped `WorkDetail.js` and `InsightDetail.js` together and justified skipping both with one sentence: that both "already carry dedicated, page-appropriate contextual links". Verification showed that is true of `WorkDetail` and false of `InsightDetail`, which linked only to `/insights`, to other insight posts, and to `/contact` — **no link to any service or case study**. A reader arriving from search could circulate between articles or hit a contact form, but never reach a capability or a piece of proof.

"Blog/editorial → relevant commercial content" is a named requirement of this phase, so this was a real gap resting on a claim that did not hold. Fixed with `<NextSteps from="/insights" />` after the `</article>`. The `JOURNEY["/insights"]` entry already existed and already pointed at `/what-we-do#packages`, `/work` and `/resources` — no new component, styling, or map entry was required. `WorkDetail`'s exclusion was re-examined and stands.

**3. An open compliance gap was recorded as a completed tidy-up.** *(risk-accounting, escalated)*

Phase 1 was right to delete the rendered `TODO before launch:` paragraph from `/resources#privacy` — it was an engineering note addressed to the operator that had leaked into visitor-facing copy. But it filed the removal under "content changes" as finished work. The note was the only visible reminder of a still-open gap: the privacy notice states no retention period, names no data controller, and states no lawful basis, while the backend stores name, email, phone, message and IP on every submission. Deleting the reminder did not close the gap.

Now recorded in §9 of the audit as an **open pre-launch blocker** requiring a business decision and qualified review. It cannot be resolved by writing better copy, and must not be read as "privacy is done."

---

## Content corrections

- **The deduplicated `why` line was replaced again.** Phase 1 correctly identified that "Clever ideas get attention. Reliable execution gets remembered." appeared verbatim in both Home's Trust section and the Advisory/Security/Scale service copy, and correctly changed the service occurrence rather than Home's. But its replacement — "Scale does not reward the cleverest idea. It rewards whichever version was actually built to hold." — was itself weak on two counts. "Built to hold" is awkward, and it broke a pattern that all five sibling `why` lines hold without exception: an aphorism followed by a sentence landing it back on *that specific service* ("This is where we make sure yours doesn't", "The network exists so both happen on purpose"). Because `why` renders under a literal "Why it matters:" label, the second half has to answer *why this service*, and Phase 1's version never did. Now: **"Growth does not break a business. The corners it cut on the way up do. This is where those get closed."** In-pattern, plainer, and tied to that service's own lede about scale finding every shortcut taken.
- **Two of six new Orbit meta descriptions were overclaiming or editorialising.** `built_here` ended "full case studies, not vanity summaries" — a flourish that merely repeats a posture the Work page already states, in a field where plain and useful beats clever. `venue` described partner venues as "available for" events, implying a booking guarantee the site never makes; the site's own legend language for these relationships is "Relationships we can activate". Both rewritten to match. The other four already used that language and were left alone.
- No other Phase 1 content change required intervention. The decision to leave the rest of the site's copy alone was correct — the underlying content audit found it unusually strong and specific, and broad rewriting would have destroyed value.

---

## SEO corrections

- The `useMemo` defect above was the only SEO-adjacent defect; the schema *content* Phase 1 emitted was verified correct on `/work`, `/network`, `/contact`, `/work/built-here` and `/network/venue-partners`.
- **Duplicate search intent flagged.** `/network/venues` (the Events & Venue Production discipline) and `/network/venue-partners` (the Orbit roster of partner venues) both target venue intent. Phase 1 recorded that the *routing* collision had been resolved by renaming, but never flagged the *SEO* collision. The distinct descriptions added this phase mitigate it; recorded as a monitored risk rather than a pre-emptive restructure.
- **`index,follow` redundancy documented rather than removed.** Emitting an explicit `index,follow` on every page is technically redundant, but it is what guarantees the shared robots tag resets when a visitor navigates away from the 404. A future "cleanup" that makes the tag conditional would strand `noindex` on the next page viewed. Now documented so it does not get optimised away.
- Checked for and did not find: keyword stuffing, unnatural link insertion, text added purely for ranking, or unsupported schema. Phase 1's restraint here was appropriate — in particular its refusal to add `datePublished`/`image` to `Article` schema without confirming those fields exist, and its refusal to fill `sameAs` or a `ContactPoint` email with placeholder values, were the right calls and remain open on real data rather than invention.
- One schema choice re-examined and kept: `CollectionPage` + `hasPart: Service[]` on `/network` lists all 16 disciplines. This risks implying hiAnzy delivers all 16 directly, against the site's careful provenance distinctions — but each `Discipline.js` page already declares itself a `Service` with `provider: hiAnzy` in pre-existing, pre-approved schema, and the new block adds no `provider` claim of its own. Consistent with established site behaviour; no change.

---

## LOCKED-area corrections

- Phase 1's LOCKED list (§4) was verified against the animation inventory and is accurate. No polished, animated or scroll-driven component was misclassified as safe. No LOCKED file was modified in Phase 1 or in this validation pass.
- **One framing correction.** Phase 1's §5 described `WhoWeWorkWith.js` as a "static/safe" target. The page qualifies, but it renders `Reveal`, `MagneticButton`, `CharacterQuote` and `NextSteps` — all shared LOCKED components. The wording risked a later model reading "page marked safe" as licence to edit those. §5 now states explicitly: add motion *around* shared components, never *to* them.
- All Phase 1 and Phase 1.5 edits were confined to text, metadata, JSON-LD props, and one memoisation. The only structural change in either pass was moving a `useMemo` above an early return in `EcosystemCategoryPage.js` to satisfy the rules of hooks — verified by a clean build with `eslint-plugin-react-hooks` active, and by the page rendering correctly live.

---

## Motion-target corrections

Phase 1 presented four candidates as a ranked list of recommendations, which reads as permission. Every one has been reclassified SAFE / CAUTION / LOCKED in §11 of the audit doc, applying the contract's own rule that uncertainty resolves to LOCKED.

The consequential change: **`components/ui/input.jsx` and `textarea.jsx` were reclassified from "recommended target" to CAUTION.** These are the `/contact` form fields. The Master Contract lists forms under *E — CRITICAL SYSTEM*, and `/contact` is the primary conversion path. Phase 1 recommended them precisely *because* they were static, without weighing what they are. Had Phase 2 acted on that ranking, a decorative input animation could have been introduced into the site's conversion path with no corresponding guardrail. Any work there is now constrained to additive focus/fill polish, must not touch validation, submit, error or honeypot behaviour, and must be verified against a real submission.

Also downgraded to CAUTION: the Orbit category cards (Phase 1 called them "zero motion"; the page around them runs an existing reveal choreography they would have to cooperate with), and the shared static components `Picture`/`ProvenanceTag`/`OrbitGlyphs` (static, but rendered so widely that motion added there appears inside LOCKED compositions).

A landing-page integrity note was added: `Home.js` appears nowhere in the SAFE column and should be reached last, behind a disableable toggle, if at all.

---

## Remaining uncertainty

- **The "13 experiential features" do not exist in this repository or in any session context.** Searched `.ai-work/`, `plan.md`, `design_guidelines.md`, and the stored plan-mode document. Phase 1 flagged this and substituted its own candidate list; validation has reclassified that list by risk, but it is still not the requested list. **Phase 2 must not invent these features.** This is an input the business holds.
- **`ItemList` schema on `/work` and the Orbit pages could not be observed populated.** The production bundle calls the API at its build-time-baked origin, unreachable from the local static test server, so only the absence-safe fallback (schema correctly omitted, no broken empty list) was verified. Same limitation applies to visually confirming the new `NextSteps` block on a real insight article — its placement was verified structurally and by clean build, and the component itself was verified rendering on `/what-we-do`. Both need a Docker rebuild against the live API to close out.
- **Insight and case-study body copy remains unaudited.** It lives in the database via `seed_data.py`, not in the page components the content audit read. Thin or duplicated copy inside individual articles would not have been caught by either pass.
- **No automated test suite exists.** Every verification in Phases 1 and 1.5 was a build check plus manual browser instrumentation. This is adequate for changes of this size and would not be adequate for the motion work Phase 2 implies.

---

## Phase 2 readiness

**READY** — as a foundation. Phase 1's audit is accurate, its corrections are applied and verified, its LOCKED classifications hold, and the motion targets now carry honest risk labels rather than an implicit ranking.

Two things to resolve before Phase 2 work actually starts, neither of which is a Phase 1 defect:

1. **Supply the 13 experiential features.** Phase 2 is blocked on this input and must not proceed by inventing them.
2. **The privacy gap is a launch blocker, not a Phase 2 blocker** — it does not prevent motion work starting, but it must be closed before the site takes real traffic.

Stopping here as instructed. Phase 2 not begun.
