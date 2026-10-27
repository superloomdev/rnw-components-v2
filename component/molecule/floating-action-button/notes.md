# FloatingActionButton

A raised icon button, optionally extended with a label, for a screen's
primary action.

## Decisions

- **Neutral and reference values are Superloom decisions.** The roster flags
  this row `superloom_decision`: the retired second reference's FAB answered
  the contract's `fab_*` cells directly, while the neutral and reference
  templates map the reference's action scale onto the same cells (census S).
  The reference's own answer to the primary screen action is
  BottomToolbarPrimaryAction, a separate component (M9), so the row records
  no reference-template twin.

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
