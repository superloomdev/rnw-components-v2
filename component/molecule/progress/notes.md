# ProgressBar

A labelled progress bar: a label row, a track with a fill bar or the theme's indeterminate anatomy, and an optional helper line. Every color, height, radius, spacing and duration comes from the theme's `progress` role cells and type sets (`body_compact_01`, `helper_text_01`); `anatomy.progress_indeterminate` chooses the indeterminate drawing.

## Decisions

- **A molecule, not an atom.** The bar draws its finished and error status marks through the Icon component (`ctx.Registry.Icon`), so it composes a library component - the same rule that makes IconButton a molecule.
- **The label row always mounts.** The primary reference renders its label element whether or not a label was passed - an empty flex row whose bottom margin still lifts the track - and puts the status icon inside it. The component does the same: the row is present, the text only when `label` is a non-empty string, the icon only while `finished` or `error`.
- **The indeterminate anatomy owns its geometry.** `sweep` is a band an eighth of a doubled background wide carried across the track, resting past its end for the last fifth of a cycle (the primary's drawing). `travel` is two bars, each a wrapper sliding and an inner scaling (the retired second reference's drawing). The stop positions are constants of the anatomy - structure, not theme values; the theme supplies the colors and the timing (`motion.duration_extra_slow_04`, `motion.easing_linear`).
- **A stable element tree across templates.** The fill, the sweep overlay and both travelling bars always mount; the inactive ones hide with `display`. An element count that changed with the template would make the accessibility tree differ across themes, which the identity gate forbids.
- **`finished` and `error` fill the bar.** Both references draw a full-width bar in the status color - the fill is `scaleX(1)` upstream - not a bar at the last value. `error` reports `aria-valuenow` 0; the indeterminate state reports no `aria-value*` at all.
- **No live region.** The primary hides an English `Loading`/`Done` live region inside its helper; a fixed language string a white-label library cannot carry is left out - `aria-busy`, `aria-invalid` and the value attributes carry the state.
- **RTL is unhandled.** The sweep and the fill assume left-to-right layout, as the other components do; right-to-left mirroring is a future concern for the layer that owns direction.

## Platform

Both, with one caveat: the indeterminate anatomies use style animations (`animationKeyframes`), which React Native Web compiles to CSS on the web. On iOS and Android the determinate bar and every static state render; an indeterminate bar there is static at its first frame unless the host's RNW build applies the same animation shim.

# InlineLoading

A status mark beside a status text: the small Loading while `active`, a success or error glyph once settled, nothing while `inactive` - upstream mounts its animation block only when a status draws a mark, so the seat mounts only then. A `finished` status calls `onSuccess` once, `successDelay` after it arrives (the upstream default 1500ms is an API constant, not a theme value).

## Decisions

- **A molecule.** The `finished` and `error` marks draw through Icon, and `active` composes Loading itself - two library components it draws, the same rule that makes IconButton a molecule.
- **The row is a live region.** `aria-live` off while inactive, assertive otherwise, as upstream; the text is the announcement and the mark is named by `iconDescription` (the status word by default, "loading" while active).
- **No second reference.** The second system has no inline-loading row - the linear bar the roster names has no status-text semantics - the roster's `superloom_decision`: the gap is the shared spacing cell upstream uses (`spacing-03`), the colors map its own semantic roles.

# ProgressIndicator and ProgressStep

The indicator is the ordered list: each `items` entry mounts a ProgressStep with its state from `currentIndex` - before it `complete`, at it `current` unless the entry already passed `complete`, after it incomplete - plus the indicator's `vertical`, `spaceEqually` and `onChange` (as the step's `onPress`, fired with the index). That is upstream's clone math verbatim; `items` is a data prop because samples and native callers pass data, the way Tabs takes `items`.

## Decisions

- **`items`, not `children`.** The catalog's sample states are pure data and cannot pass element children; the indicator mounts `ctx.Registry.ProgressStep` per entry and injects the state - the same composition upstream performs with `cloneElement`. The injected `vertical` and `spaceEqually` are the step's `api.composition` props, so no sample may set them: the indicator's own samples cover the layouts. The roster keeps `requires_parent` on ProgressStep: it is not a standalone component.
- **The step's pressable is the whole row.** Upstream's `button` wraps the glyph, the text column and the connector line. A step is clickable only with an `onPress` and not while `current` - upstream drops the handler for the current step but keeps the button focusable. A disabled step reports `aria-disabled` and leaves the tab order.
- **Focus is drawn by hand.** Upstream's ring is `outline: 1px solid $focus` on the label, not the control's ring, so `ctx.focusRing` does not fit. The label draws `control.progress_step_focus_width` of `color.progress_step_label_focus` at offset 0, gated by `feedback.focus_trigger` the way `focusRing` gates (keyboard-only themes require focus-visible); the text takes the focus color while it shows. A press's specificity wins over focus in the reference, so the label's color chain is disabled, then press, then focus, then hover.
- **The underline is a box-shadow.** Hovered or pressed, a clickable step's label casts `0 1px` of the same cell the text reads (the hover cell on hover, the resting cell on press) - upstream's exact construction, a 1px band under the label box.
- **The line keeps upstream's border-box math.** The reference's `border: 1px inset transparent` under a `box-sizing: border-box` reset folds a pixel of transparent edge into every side, so the drawn strip is `max(cell, 2)` thick - the vertical connector measures 2 wide although its cell says 1. The line mounts inside the pressable as its last child, as upstream's `span` does. The glyph box rounds to `shape.radius_max` (upstream's `svg { border-radius: 50% }`).
- **The space-equal text column is plain.** Upstream's `padding: $spacing-01; margin: -$spacing-01` pair exists only so `overflow: hidden` does not clip the label's 1px focus outline; with neither drawn the pair would only push the column past the cell, so the column mounts bare.
- **The secondary label mounts two ways.** In the row it is absolutely positioned at the amendment cells (`secondary_label_top`, `secondary_label_start`), measured against the step; in the column it flows under the label inside the text column, as upstream's `position: static` override does.
- **No second reference.** The second system has no step indicator - the roster's `superloom_decision`; the cells the v7 amendment wrote carry its own answers (focus width 3, line widths 4, vertical icon top 1).

# ProgressIndicatorSkeleton

The indicator's stand-in: upstream's fixed four incomplete steps, each the dashed glyph in `progress_step_icon_incomplete`, a `progress_step_skeleton_label` block and the resting connector line on the step's own geometry.

## Decisions

- **The label block shares the glyph's top margin.** Upstream gives the skeleton label `margin-block-start` 10px in the row and 1px in the column - the same values the state glyph's top margin carries - so the block reads `icon_top` / `vertical_icon_top` and both tops align.
- **Four steps, always.** The count is a drawing constant of the reference's markup, declared in the spec.
- **No pressable.** Upstream's skeleton step is a `div`, not a button: the stand-in takes no input, so the row mounts a plain View.
- **No second reference.** As the indicator, a `superloom_decision` for that system's values - it inherits the step cells the amendment wrote.
