# LESSONS - contributor notes

One line per lesson: what failed, what worked, where to look. Every working session appends; the file is tidied once
before launch. Read this before building or converging a component; add to it when something cost more than an hour.
American spelling, no em dashes (the tracked-content gates grep the whole repo).

## Working method

- One session converges one family. Longer sessions lose their context and repeat the same probes; the fix is to end the session, not to try harder.
- Three focused guarded runs per failing test, each with a written hypothesis (part, property, upstream line or probe value, the cell or code line that changes). Then record the residual with `scripts/defects.js` and move on; a fresh session with a new hypothesis is cheaper than a fourth run.
- Every `node`, `npx` and `node --test` runs through `scripts/guard.js`; the guard's log (`_test/test-results/last-run.log`) holds the output and only its last 60 lines are read. Test logs, screenshots and pixel dumps in a conversation are what fills a context.
- A test file that does not exit in seconds is bisected by `--test-name-pattern`, never waited on: two React update loops (effect -> measure -> setState) were the 375 GB memory events; the jsdom harness now throws past 2000 commits in one render.
- Playwright: `workers: 1`, one browser run at a time, no `test.setTimeout` in a spec (G17), no `--timeout` flag on the command. `--grep "<describe> <Row>[ :/]"` with one space; ` . ` matches nothing.
- Build to the recipe and the probe (`__dev__/evidence/0160/recipes/`), never to a guess: nearly every fidelity failure in batches 12-14 was on the reference side (mount, selector, stylesheet), not in the component.
- A published template cell can be wrong. The B0 cells check compares the probe's upstream value with the built theme's value for every cell the recipe names; a mismatch is an amendment before the build.
- A fire-harness pattern that matches no test must fail, not pass: `_test/fire.js` looks for the indented inner result line and reports Playwright "No tests found".
- A guard test's allocation must stay below the outer guard's real ceiling: `GUARD_PROC_MB` applies to the whole `npm test` tree, and an outer guard at the same ceiling wins the kill because the inner guard's first sample lands a full interval after its spawn.
- A reparented orphan can enter the guard's `seen` set only while its parent still lives; macOS reparents before the exit event fires, so the orphan test's child idles 1.5 s before exiting.
- A killed orphan can still answer `process.kill(pid, 0)` for a moment after the SIGKILL (a zombie awaiting launchd's reap); probe it in a poll, not once.
- `fire.js` proves a row only from an indented result line on stdout: node tests need a `describe` wrapper for the indent, and the guard replays its tail to stdout as well as stderr so the recover run still sees it.

## Harness and measurement

- Edit a JSON data file in place with its existing indent - the roster was re-indented whole once (slice 4 U9) and the diff swallowed the real change.
- Every element in a children array passed to `createElement` needs a `key`, including one rendered conditionally (`inline ? action : null`) - the structural `zero errors` gate catches it, the Node gates do not.
- A fire row whose `find` line moved is repointed with its `why` intact; `fire.js` reports "DID NOT RECOVER" when the named test is already red on clean code.


- A fixed-position layer (modal, menu, popover) is measured inside a transformed cell wrapper so the layer's containing block is the cell; the reference mount pins its fixed layer the same way (`oursHosted`), or the two pages measure different coordinate spaces.
- Cells that hold an open layer are settled with `settleLayout` before a screenshot; perceptual reopens reopen the state; pressed frames keep the press's focus (`settleBeforePress` opt-in).
- The perceptual gate compares the sample root's box on both pages (expanded to overflowing descendants), not the whole cell; a clipped layer at the cell edge otherwise dominates the percentage.
- Positioning hooks cap their re-measures at 8 per open cycle and warn once; an anchor that moves on every read is a harness defect.
- A hit-expander target that should be absent is asserted as `hitEl === null`, not as a size.
- The purity scan's `unit string` rule flags `'100%'` style literals (currently `actionable-notification.js:97`, `notification-parts.js:69`, `modal/reference.js:23`, `modal/reference.composed-modal.js:27`), so `npm run check` stays red on this tree until they go.
- Fidelity can fail where measure passes: the no-close action seat matched upstream geometry yet 28 cells were over the pixel budget, so a fidelity failure is a state-layer or colour gap, not a position one.
- A `stage: true` cell body was squeezed to ~110 px by `.measure .grid`'s 160 px `grid-auto-rows` plus column-flex shrink; a fit made in that regime (Modal's header negative margin) was a squeeze artifact - the row spans in `harness/entry.js` and `reference-entry.js` hold the declared frame, so check a staged body's rendered height before trusting a staged fidelity number.
- jsdom drops the `borderWidth` shorthand from `style`; assert one long-hand side (`borderBottomWidth`).
- `docs:generate` regenerates every stale family page, not just the touched one; commit the regenerated pages with the unit.
- `scripts/defects.js` rebuilds `__dev__/DEFECTS.md` from the last `browser.json` only: a probe run overwrites it, and a later focused run drops earlier slices' rows. Run defects.js straight after the gate run, before any probe; carry earlier residuals in NOW.md until the closing `npm run batch` regenerates the full list.
- A part-dump probe must read colours from the innermost element holding the label text; reading the pressable root reported a label colour the screen never showed (slice 3 U5).
- A clean `_test` install (node_modules and lockfile removed) also drops Playwright's browser binary: reinstall chromium through the guard before the first browser run, or every browser test fails at `browserType.launch` (slice 6 U5).
- Carbon's Tag height follows its layout context (`_tag.scss:42,53` `layout.use('size', md, sm, lg)` + `layout.size('height')`): inside an `md` ContainedList the tag draws 32 (lg), not its own `md` 24 (slice 6; `control.tag_height_large` needed).

## Component patterns

- A low-contrast outline is an inset `box-shadow`, not a border: a border changes the box and shifts every inner measurement by its width.
- Inline widths that the reference derives from its container are `100%` capped by the family's width cell (`notification_inline_width`), never a fixed width; the toast keeps the fixed cell.
- An overlay heading that the reference pulls up over its label is a token-derived negative margin (header space minus heading line height, minus the label line height and gap relative to the body padding); never a measured constant.
- Separators in a breadcrumb stay unless both `last` and `noTrailingSlash` hold; the reference's rule, not the obvious one.
- Composition props (`api.composition`) exist only for a composing parent (breadcrumb overflow trigger size, icon offsets, menu offset, focus underline); a prop with no composing consumer is deleted.
- Modal width and max height are ratios of the layer space (`control.dialog_width_ratio[_xs|_sm|_lg]`, `control.dialog_height_ratio[...]`) with the form variants holding the compact values; no breakpoint read in a component.
- Submenus dismiss against their parent (`dismissRootRef`); a menu's own outside-press handler must not close its parent.
- Values a template never specifies come from the reference's own scale and are marked `superloom_decision`; a derived number without an upstream line is a defect (D21c).
- Enum values are named by behavior or shape (`floating`, `ripple`, `grows`), never by a design system; a value no shipped template picks stays when a unit test and the enum-render gate cover it (a brand layer may pin it).
- A CSS flex item's automatic minimum is its min-content (Carbon modal footer buttons: `flex: 0 1 50%` plus the 15/63 padding); react-native-web defaults `minWidth: 0`, so reproduce it as `minWidth: <ratio>%` + `flexShrink: 0`.
- A composing parent recolours a focus ring through `ctx.focusRing(..., { ringLeaf })` (outline, border and inset shadow together); `Button` `focusRingGap: false` drops the page-colour line. Overriding `outlineColor`/`borderColor` after the call misses the inset shadow.
- A component wrapper inside a row-flex cell body is only as wide as its content: a child's `width: 100%` (Carbon `inline-size: 100%`) needs the wrapper itself at `100%` too (ActionableNotification trap wrapper, slice 3 U8).
- Carbon notifications apply their inverse button themes only `:not(--low-contrast)`: a low-contrast action is the plain ghost/tertiary kind in every state, so pass it no recolour leaves.
- A `reference.*.js` for a `no_reference` member breaks the harness: `reference.mount is not a function` renders at gate time; no-reference members ship no reference file.
- A standalone reference needs its `parts` map before any gate run; grep for `parts: Object.freeze` after any scripted insert - a replace-pattern miss once failed silently.
- `docs.test.js` hard-codes every sample `FRAME` as a `name:width` list; adding a `FRAME` to a sample means adding its entry there.
