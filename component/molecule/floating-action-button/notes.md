# FloatingActionButton

A raised icon button, optionally extended with a label, for a screen's
primary action.

## Decisions

- **Default and carbon values are Superloom decisions.** The roster flags
  this row `superloom_decision`: Material's FAB answers the contract's
  `fab_*` cells directly, while the default and carbon templates map
  Carbon's action scale onto the same cells (census S). Carbon's own answer
  to the primary screen action is BottomToolbarPrimaryAction, a separate
  component (M9), so `carbon_twin` is `none` here.

## Not carried

- `lowered`: upstream draws a flat variant, but the contract has no flat
  cells; adding them would invent tokens.
- `disabled`: the reference system draws no disabled FAB state; a screen's
  primary action either exists or doesn't.
- `hidden`/`visible`: upstream's visibility animation has no cells.

## Accessibility

`role="button"`. The label names the extended form; a bare icon button
requires `accessibilityLabel` and the component throws a `TypeError`
without one.
