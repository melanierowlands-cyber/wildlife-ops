# Wildlife Ops — Session Handoff

_Last updated: 2026-06-16 (rev 4 — click-to-track + selected-card state BUILT) · Status: working doc; fully regenerated when context approaches ~70–75% capacity._

This document lets a new session resume without re-deriving state. Two parallel tracks exist: a **React app** (deployed) and a **Figma design file** (the current source of truth). They have **diverged** — see the warning below.

---

## 0. TL;DR / Resume here

- **Current source of truth = the Figma file** (Mziki cream/teal design). The deployed React app is an **older, abandoned** "Field Instrument" redesign — do NOT treat it as current.
- **Design system + Phase A (tokens/styles bound) = done.** **Phase B (component instances) = ~70% done.**
- **Animal click-to-track = ✅ BUILT** (rev 3, shared-map / flat-string-var approach — see feature section near the bottom). Test it in prototype preview.
- **Next likely tasks:** finish Phase B chrome (Sidebar/TopBar → auto-layout/components), resolve Nav Item + Vital Cell style mismatches, then optionally generate production code from the Figma design and/or implement the UX-review interactions in Figma Make.
- **Before any `use_figma` call:** load the `figma-use` skill (and `figma-generate-design` / `figma-generate-library` as relevant).
- **Durable IDs** are in this file (Section 5) and in `/tmp/dsb-state.json`.

---

## 1. Projects & locations

**React app (deployed, but NOT the current design):**
- Path: `/Users/melanierowlands/Library/CloudStorage/Dropbox/APPS (Selective Sync Conflict)/Wildlife Ops`
- Stack: React + Vite + Tailwind. Single-file app: `src/App.jsx`, plus `src/index.css`, `tailwind.config.js`, `index.html`.
- Scope: 3 views only — Dashboard (Overview), Animal Health, Team Dispatch.
- Last design = "Field Instrument" (Fraunces + Hanken Grotesk + Geist Mono, hand-built SVG charts, Recharts removed).
- Git: branch `main`, remote `github.com/melanierowlands-cyber/wildlife-ops`.
- Netlify: site `mziki-wildlife-ops`, live at https://mziki-wildlife-ops.netlify.app, `siteId 05784c14-8abc-451e-bbb0-9941eada3b9c`. **Manual CLI deploy** (`netlify deploy --prod --dir=dist`), not git-connected. Stored CLI auth exists on this machine.

**Figma file (CURRENT design source of truth):**
- `fileKey: zvH6mVg3mHu7Dk6eo5qMJN` (file name "Wildlife Ops")
- Theme: **Mziki** — warm cream + deep teal. Font: **Hanken Grotesk** (Light/Regular/Medium/SemiBold/Bold).

> ⚠️ **Divergence:** The Figma "Mziki" design is NOT yet reflected in code. The Netlify app shows the old Field-Instrument look. If asked to "ship the design," generate fresh code from Figma — don't assume the repo matches.

---

## 2. Figma file structure

**Page "Page 1"** — three 1280×832 screen frames:
| Screen | Node ID | x |
|---|---|---|
| Reserve Overview | `4:2` | 147 |
| Animal Health Record | `50:2` | 1492 |
| Team Dispatch | `50:193` | 2818 |

**Page "🧩 Mziki — Design System"** — node `81:2`: foundations colour swatches + the 8 components.

Screen content summary:
- **Overview:** sidebar + topbar (chrome) · KPI row (5 Stat Cards) · animal list (5 photo rows w/ badges) · live-tracking panel (satellite map + vitals + Log observation/Schedule Vet buttons).
- **Animal Health:** chrome · animal roster (6 Roster Rows) · individual profile (photo, vitals grid, health-trend SVG chart, clinical note, 2 buttons) · recent-activity timeline.
- **Team Dispatch:** chrome · 4 dispatch Stat Cards · 6 Team Cards (3×2 wrap grid) · Task Assignment panel (5 Task Items).

---

## 3. Status by phase

**Screens built:** ✅ all three complete and visually validated.

**Live-tracking map:** ✅ Overview node `9:162` = real Esri satellite imagery (reserve coords 27.9128°S, 32.2041°E) + baked GPS track / markers / legend. `cornerRadius: 0`. Legend was clipped at the vitals boundary → fixed by re-baking with the legend raised. Then the **panel was widened (card/panel rebalance 2026-06-16)**: animal card rects `6:97/6:98/6:99/6:100/7:103` narrowed 563→**508w**; the panel (group `33:273`) shifted left + widened via proportional x-transform to **x885, 355w** (right edge 1240); map node `9:162` resized to **355×383 at x885** and re-baked at 710×766 aspect → **current `imageHash c166f529121650693d519ce1e021b789e690b517`**. Cached base `/tmp/sat_base.png`; wide compose script (Python/PIL).

**Design system:** ✅ 4 variable collections + 22 text styles + 8 components (Section 5).

**Phase A — colours→variables + text→styles:** ✅ done on all 3 screens. Coverage ≈ 88–91% fills, 86–89% text. Context-aware binding (text fills → `text/*`; shapes → `bg/surface/status/*`), value-exact (no visual change). Intentionally left raw (no clean token): `#a8a294` faint labels, `#7d8a6f` team footer, `#d9e1d3` assigned-task tint, `#edeadf` vital-grid bg, icon internals `#068071`/`#01554b`, photo scrim `#003b34`, `#f7f7f2`.

**Phase B — auto-layout + component instances:** 🟡 ~70% done.
- ✅ **45 instances placed:**
  - Overview: KPI row → 5 **Stat Card** instances (auto-layout row `120:2`); 5 row **Badge** instances.
  - Team Dispatch: 4 **Stat Card** (row `60:2`), 6 **Team Card** (grid `61:6`), 5 **Task Item** (list `63:7`) — incl. nested badges.
  - Animal Health: 6 **Roster Row** (list `55:6`, photo + health-colour overrides per row), profile **Badge**, 2 **Button**.
- ⬜ **Remaining:**
  1. **Chrome → auto-layout** (sidebar + topbar are still absolute on all 3 screens). Recommended: build **Sidebar** (with active-page prop) + **TopBar** components and instance them. Biggest "Auto Layout everywhere" gap.
  2. **Nav Item swap** — blocked by style mismatch: component = rounded pill; screens = full-width active bar. Edit component to match first.
  3. **Vital Cell swap** — blocked by style mismatch: component = separate rounded card; screen = seamless 1px-gap grid. Edit component first.
  4. Overview **panel buttons** (Log observation / Schedule Vet) are fused to panel corners — intentionally left.
  5. Overview **animal photo-rows** + **tracking panel** have no matching component — auto-layout only if desired.

**UX review (open recommendations):** delivered as Figma Make prompts (motion system, command palette, interactive map, optimistic assignment+toast+undo, view transitions, onboarding/coachmarks, inline glossary, relative time, count-ups, skeletons, card hover/press, chart crosshair). Not yet implemented.

---

## 4. Critical gotchas (learned this session)

- **`resize()` resets the PRIMARY-axis sizing mode to FIXED.** Set sizing modes AFTER resize, or restore `primaryAxisSizingMode`/`counterAxisSizingMode` to `AUTO` afterward. This caused collapse bugs on Stat Card, Vital Cell, Task Item, Roster Row.
- **Editing a component's size does NOT resize already-placed instances** — resize instances directly (e.g., Team Card 272→271 to fix wrap).
- **Wrap auto-layout** (`layoutWrap='WRAP'`) needs `primaryAxisSizingMode='FIXED'` to actually wrap (AUTO hugs everything into one line).
- **Every paint carries a `boundVariables` object**, so `!p.boundVariables` is always false. Check `p.boundVariables && p.boundVariables.color`.
- **`setBoundVariableForPaint(existingPaint, 'color', v)`** preserves opacity; but spreading `{...p, opacity}` on a bound paint did NOT apply opacity reliably (used a literal for the assigned-task tint).
- **`figma.createPage()`** only works in design files.
- Nested instance props (e.g., a Team Card's status Badge): set via `instance.findOne(n=>n.type==='INSTANCE').setProperties({'Status':..., 'Label#85:0':...})`.

---

## 5. Durable IDs (Figma)

**Variable collections:** Primitives `VariableCollectionId:75:2` · Color `76:2` · Radius `79:2` · Spacing `79:8`

**Semantic colour vars** (`VariableID:`): bg/canvas `76:3` · bg/topbar `76:4` · surface/stat `76:5` · surface/panel `76:6` · surface/panel-strong `76:7` · surface/inset `76:8` · surface/white `76:9` · accent/gold `76:10` · status/healthy `76:11` · status/monitor `76:12` · status/critical `76:13` · status/info `76:14` · text/inverse `76:15` · text/ink `76:16` · text/muted `76:17` · text/label `76:18` · text/cream `76:19` · border/default `76:20` · (primitive white/0 `75:16`)

**Radius vars:** card `79:3` · panel `79:4` · inset `79:5` · control `79:6` · full `79:7`
**Spacing vars:** xs `79:9` · sm `79:10` · md `79:11` · lg `79:12` · xl `79:13` · 2xl `79:14`

**Key hexes:** canvas `#004b42` · topbar `#05907f` · stat `#02695d` · panel `#e4e4d5` · panel-strong `#cacabb` · inset `#f4f1ea` · white `#fbfaf6` · gold `#d29b00` · healthy `#5a8021` · critical `#b0492f` · info `#4c6a88` · muted `#828174` · label `#52524d` · border `#cdcdbe`

**Text styles** (`S:`): Stat Value `325caaa…` · Heading/Card `c517f5…` · Heading/Name `3958103b…` · Body `89ba78…` · Body/Small `087f3c…` · Caption `57ba6f…` · Label/Caps `6992e04f…` · Badge `ef2df5…` · Display/Wordmark `0677cf…` · Heading/Topbar `5d22ce…` · Label/Stat `c0bde4…` · Value/Vital `2bc06b…` · Body/Compact `46469f…` · Body/XSmall `58521f…` · Caption/Note `f5c959…` · Heading/Small `fa0f1ab6…` · Heading/Body `531f8d…` · Label/Strong `e6c797…` · Label/Medium `14730d…` · Body/10 `483e8f…` · Caption/XSmall `fa0a018a…` · Badge/Small `c0172b…`
_(Full IDs in `/tmp/dsb-state.json`.)_

**Components & props:**
- **Badge** set `85:12` — variant prop `Status` = Healthy `85:2` / Monitoring `85:4` / Critical `85:6` / Info `85:8` / Neutral `85:10`; text `Label#85:0`.
- **Button** set `86:8` — variant `Variant` = Primary `86:2` / Secondary `86:4` / Ghost `86:6`; text `Label#86:0`.
- **Stat Card** `92:2` — `Label#92:0` `Value#92:1` `Delta#92:2` `Note#92:3`; hug height ≈126.
- **Vital Cell** `93:2` — `Label`, `Value`.
- **Nav Item** set `94:14` — variant `State` = Active/Default; `Label`.
- **Roster Row** set `95:14` — variant `State` = Selected/Default; `Name#95:0` `Meta#95:3` `Health#95:6`. (child[0]=thumb ellipse, child[2]=health text.)
- **Team Card** `96:2` — `Name#96:0` `Meta#96:1` `Task#96:2` `Footer#96:3`; nested Badge; width 271.
- **Task Item** set `97:21` — variant `State` = Assigned/Unassigned; `Location#97:0` `Title#97:3` `Team#97:6`; nested Badge.

**Phase B containers / instances:**
- Overview: KPI row `120:2`; KPI Stat Cards `120:3/10/17/24/31`; badges `123:22/24/26/28/30`.
- Team Dispatch: stat row `60:2` (`129:118/123/128/133`); team grid `61:6` (`125:27/37/47/57/66/76`); task list `63:7` (`128:76/86/104/114/132`).
- Animal Health: roster list `55:6` (`131:134/140/146/152/158/164`); profile badge `133:164`; buttons `133:166/168`.

**Animal photo imageHashes:** lion `6d5c95fab162508929b1e5fb0b08d4b1fbf8a18b` · cheetah `8f42d647193635d6f5586ae0c3f153c89c683abc` · elephant `4ead71a6dbaf0d58a61efc844ae5e22a07cb475e` · buffalo `0d72f8ea7b3d65c1974cd3e4bd67d980b930fd59` · rhino `acf43d92aee3687460a7c3a42e0f54dabbc1d2df`.

---

## 6. Conventions & decisions

- **Scope is fixed to 3 views** (Dashboard / Animal Health / Team Dispatch). Don't add more.
- Phase A binding is **context-aware + value-exact** (no visual change). Type ramp has some near-duplicate sizes (11/11.5/12; 9/9.5/10) — a Phase B type-scale rationalisation is optional cleanup.
- Validation tip to save context: prefer `get_metadata` (text) over screenshots; request screenshots at lower `maxDimension`.

---

## ▶ FEATURE: Animal click-to-track — ✅ BUILT (2026-06-16, rev 3)

**Shipped approach (user changed map decision 2026-06-16): flat string variables + ONE shared map reused on every animal.** The original "unique map per animal" plan was dropped — user asked to reuse the same map for now, which removed the need for a variant set / instance-swap / 5 baked maps. Map node `9:162` is untouched (shared).

**What was built (the fallback path in the old plan, now the primary):**
- New variable collection **`Mziki/Tracking`** `VariableCollectionId:145:167` (mode `145:0`), 7 STRING vars (scope TEXT_CONTENT), defaults = canonical Elephant:
  - `track/title` `VariableID:145:168` → text `22:254`
  - `track/health` `145:169` → `12:186` · `track/collar` `145:170` → `12:187` · `track/age` `145:171` → `12:188`
  - `track/weight` `145:172` → `12:189` · `track/lastSeen` `145:173` → `12:190` · `track/location` `145:174` → `12:191`
- Each panel text bound via `node.setBoundVariable('characters', variable)` (confirmed: `'characters'` IS a `VariableBindableNodeField`, so string→text-content binding works directly).
- **5 transparent hotspot frames** overlaid on the cards (fill opacity 0, topmost children of `4:2`), each with an `ON_CLICK` reaction of 7 `SET_VARIABLE` actions:
  - `Hotspot · Lion` `147:167` · `Cheetah` `147:169` · `Elephant` `147:171` · `Buffalo` `147:173` · `Rhino` `147:175`
  - Hotspots were used instead of reparenting the loose card nodes — non-destructive, reliable prototype hit target.
- Validated: panel renders bound values; hotspots invisible at rest.

**Selected-card state — ✅ BUILT (rev 4).** 5 BOOLEAN vars in `Mziki/Tracking` (default Elephant=true): `sel/lion` `VariableID:149:167` · `sel/cheetah` `149:168` · `sel/elephant` `149:169` · `sel/buffalo` `149:170` · `sel/rhino` `149:171`. Each card has a gold (#d29b00) stroke-only outline rect (2.5px, INSIDE, r21) with `visible` bound to its boolean: `Selected · Lion` `150:167` · `Cheetah` `150:168` · `Elephant` `150:169` · `Buffalo` `150:170` · `Rhino` `150:171`. Each hotspot reaction now has **12 actions** (7 string + 5 boolean: own=true, others=false). Outlines sit above card content, below the hotspots (hotspots re-appended last to stay the click layer). Confirmed in screenshot: Elephant outlined by default.

**Fit fix (rev 4):** the 6 vital VALUE boxes (`12:186–191`) + title (`22:254`) were `textAutoResize: NONE` at widths sized for the old short placeholders ("24kg"/"C4"), so the longer realistic data wrapped + clipped below the panel. Fixed by setting all to `WIDTH_AND_HEIGHT` (auto-width, single line). Verified vs every animal's longest string: tightest clearance is WEIGHT col (max right 991 vs divider `8:111` at x999); AGE/LOCATION col right ≤1216 vs panel edge 1240; titles ≤1075. Value boxes are LEFT-aligned, anchored at their current x, so auto-width grows rightward within the column. Column dividers: `8:111` x999, `8:112` x1124; panel right edge 1240.

**Map-overflow fix (rev 4):** the cream panel background is rect **`6:96`** (fill #e4e4d5, radius 21) — a sibling of the content group, NOT inside group `33:273/33:274`. The earlier "card/panel rebalance" shifted the content+map to x885–1240 but left `6:96` at its old x940/w304 (940–1244), so the map (885–1240) overhung the cream ~55px on the LEFT. Fixed by resizing `6:96` → **x881, width 363** (881–1244), giving ~4px margins around the map/buttons. (Verified via pixel-sampling the render — satellite greens classify as "teal", so trust the right edge / cream edges, not the map's dark left edge.) If the panel is ever re-balanced again, move `6:96` WITH the content.

**Note on motion:** Figma's design-file prototype updates variable-bound text/visibility **instantly** — no cross-fade/count-up easing on SET_VARIABLE. For animated transitions, that's a Figma Make (web) thing, not the design-file prototype.

**Remaining / optional:** (1) test in prototype preview by clicking each card (set-variable reactions only run in preview, not static canvas). (2) If unique maps are wanted later, re-bake per-animal maps (steps below) and either swap `9:162`'s fill via a boolean/INT var + stacked images, or convert to the variant set.

**Per-animal data wired into the hotspots** (title / health / collar / age / weight / lastSeen / location):
- Lion `Lion Pride "Mthethwa"` / 94% / 92% / Mixed / 160kg / 05.47 / B2
- Cheetah `Cheetah "Duma"` / 95% / 88% / 5 yrs / 54kg / 05.20 / A3
- Elephant `Elephant Herd "Thandi"` / 97% / 88% / 38 yrs / 3,200kg / 04.58 / N.Cor (= variable defaults)
- Buffalo `Buffalo "Nkulu"` / 79% / — / 14 yrs / 720kg / 02.55 / C2
- Rhino `White Rhino Pair` / 88% / SDR / Adult / 2,100kg / 04.15 / A4

---

### (archived) original plan — unique map per animal (NOT taken)

Goal: clicking any animal card on the Overview updates the tracking panel (title + 6 vitals + map) to that animal.

**Current panel** = group `33:273` (x885, y215, 355×595 after rebalance) of 28 loose nodes:
- map image `9:162` (355×383, x885) · title `22:254` ("Elephant Herd "Thandi"") · "LIVE ANIMAL TRACKING" `11:170`
- buttons: rects `8:119`/`8:121`, texts `8:120`(Log observation)/`8:122`(Schedule Vet)
- vital labels `9:130`HEALTH `9:131`COLLAR `9:132`AGE `9:133`WEIGHT `9:134`LAST SEEN `9:135`LOCATION
- vital values `12:186`62% `12:187`74% `12:188`3 yrs `12:189`24kg `12:190`05.12 `12:191`C4
- vital icons `9:150/9:154/9:155/9:156/9:157/9:161` · dividers `7:110/8:111/8:112`

**Animal card rows (click targets):** Lion `6:97`(y215) · Cheetah `6:98`(y337) · Elephant `6:99`(y459) · Buffalo `6:100`(y580) · Rhino `7:103`(y702). Each row = rect + image + title/sub/desc texts + Badge instance (loose; likely wrap each row in a frame to make one click target).

**Per-animal data** (title / health / collar / age / weight / last-seen / location · map callout):
- Lion Pride "Mthethwa" / 94% / 92% / Mixed / 160kg / 05.47 / B2 · "PR-01 · Pride of 6"
- Cheetah "Duma" / 95% / 88% / 5 yrs / 54kg / 05.20 / A3 · "CH-05 · Solitary"
- Elephant Herd "Thandi" / 97% / 88% / 38 yrs / 3,200kg / 04.58 / N.Cor · "EH-03 · Herd of 12"
- Buffalo "Nkulu" / 79% / — / 14 yrs / 720kg / 02.55 / C2 · "BF-11 · Dagga boy"
- White Rhino Pair / 88% / SDR / Adult / 2,100kg / 04.15 / A4 · "SDR-07 · Pair"

**Build steps:**
1. Re-bake 5 maps from `/tmp/sat_base.png` (same reserve; different GPS track + current-position marker + callout each; legend raised — reuse the working compose script). Elephant already done = `/tmp/elephant_tracking2.png` (`90682c1d…`).
2. Convert panel group `33:273` → COMPONENT "Tracking Panel" (Elephant variant). Clone ×4 (Lion/Cheetah/Buffalo/Rhino); per variant set its map image (upload that map to the variant's map node) + title + 6 vital values.
3. `combineAsVariants` → set with property `Animal` = Lion/Cheetah/Elephant/Buffalo/Rhino. Park the set on the DS page; place ONE INSTANCE back in the Overview at x939, y215.
4. Create STRING variable `selectedAnimal`; **bind the instance's `Animal` variant property to it** (verify Plugin-API support for variant-prop→variable binding EARLY).
5. Add `onClick` reaction on each of the 5 card rows → `SET_VARIABLE selectedAnimal = <animal>`.
6. Optional: "selected" visual state on the active card (accent rail/tint).
7. Validate in prototype preview.
**Fallback** if variant-prop binding fails: flat string vars (title + 6 vitals) bound to the panel texts + 5 stacked map images toggled by boolean visibility vars; cards set all vars on click.
**Recommendation:** start this with a fresh/clean context budget — it is the heaviest build and prototype-wiring is intolerant of mid-build context loss.

## 7. Context-management protocol (active)

I warn the user when usage reaches **~70–75% of the practical window** OR when compression artifacts threaten accuracy (lost IDs, summarized-away detail). On trigger: stop, flag at top of reply, **regenerate this file**, and recommend continue-vs-new-session. Critical IDs persist in this file + `/tmp/dsb-state.json` so a fresh session can resume cleanly.
