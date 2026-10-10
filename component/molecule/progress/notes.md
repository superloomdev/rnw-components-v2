# ProgressBar

A labelled progress bar: a label row, a track with a fill bar or the theme's indeterminate anatomy, and an optional helper line. Every color, height, radius, spacing and duration comes from the theme's `progress` role cells and type sets (`body_compact_01`, `helper_text_01`); `anatomy.progress_indeterminate` chooses the indeterminate drawing.

## Decisions

- **A molecule, not an atom.** The bar draws its finished and error status marks through the Icon component (`ctx.Registry.Icon`), so it composes a library component - the same rule that makes IconButton a molecule.
- **The label row always mounts.** The primary reference renders its label element whether or not a label was passed - an empty flex row whose bottom margin still lifts the track - and puts the status icon inside it. The component does the same: the row is present, the text only when `label` is a non-empty string, the icon only while `finished` or `error`.
- **The indeterminate anatomy owns its geometry.** `sweep` is a band an eighth of a doubled background wide carried across the track, resting past its end for the last fifth of a cycle (the primary's drawing). `travel` is two bars, each a wrapper sliding and an inner scaling (the second reference's drawing). The stop positions are constants of the anatomy - structure, not theme values; the theme supplies the colors and the timing (`motion.duration_extra_slow_04`, `motion.easing_linear`).
- **A stable element tree across templates.** The fill, the sweep overlay and both travelling bars always mount; the inactive ones hide with `display`. An element count that changed with the template would make the accessibility tree differ across themes, which the identity gate forbids.
- **`finished` and `error` fill the bar.** Both references draw a full-width bar in the status color - the fill is `scaleX(1)` upstream - not a bar at the last value. `error` reports `aria-valuenow` 0; the indeterminate state reports no `aria-value*` at all.
- **No live region.** The primary hides an English `Loading`/`Done` live region inside its helper; a fixed language string a white-label library cannot carry is left out - `aria-busy`, `aria-invalid` and the value attributes carry the state.
- **RTL is unhandled.** The sweep and the fill assume left-to-right layout, as the other components do; right-to-left mirroring is a future concern for the layer that owns direction.

## Platform

Both, with one caveat: the indeterminate anatomies use style animations (`animationKeyframes`), which React Native Web compiles to CSS on the web. On iOS and Android the determinate bar and every static state render; an indeterminate bar there is static at its first frame unless the host's RNW build applies the same animation shim.
