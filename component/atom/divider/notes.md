# Divider

A horizontal rule: a flex row holding one line child of the theme's divider width, indented at either end by the theme's divider inset when `inset`, `insetStart` or `insetEnd` ask.

## Decisions (roster flag `superloom_decision`)

- **No primary reference.** The first system draws no standalone divider — the roster's `superloom_decision`. Two templates answer the line as `border_subtle_01` at `border.width_01` with a `spacing_05` inset; the third draws its own outline color at one pixel with a sixteen-point inset. Where the primary is silent the template decides.
- **A row and a line, not a stretched strip.** The second reference draws the rule as a host row's pseudo-element inset by its own padding; ours draws the same anatomy with real elements — a padded row whose line child keeps the divider width.

## Platform

Both platforms. The rule is layout and paint only; it takes no input.
