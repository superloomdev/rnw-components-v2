# Tooltip

A popover that describes its anchor: the element the wrapper holds is
described by the label through `aria-describedby`, and the popover opens
above it on hover, focus or touch.

## Decisions

- The wrapper, not the anchor, owns the listeners: pointer, focus and touch
  events propagate to it, so the anchor keeps its own role and focusability
  and nothing is cloned.
- The popover is a bubble plus a caret clipped from a square rotated 45
  degrees; the seat mounts under every template and a theme whose caret
  cells are zero draws nothing, keeping the tree identical.
- `open` is controllable through `onOpenChange`; `enterDelayMs` and
  `leaveDelayMs` override the decision delays (100 ms both ways).
- A touch opens the popover immediately where no pointer exists - the
  roster's touch fallback - and Escape closes it.
- Where an `OverlayHost` is mounted the popover renders through it; else it
  renders in place, `fixed` on the web and `absolute` natively, positioned
  by `useAnchoredPosition` from the anchor's measured rect and flipped at
  the viewport edge.
- The compact kind draws the `tooltip_compact` member cells: the tooltip an
  icon button shows.

## Cells

- `color.tooltip_container` - bubble and caret fill
- `color.tooltip_label` - label color
- `type.tooltip_label`, `type.tooltip_compact_label` - label type styles
- `control.tooltip_padding_block`, `control.tooltip_padding_inline` - bubble padding
- `control.tooltip_radius` - bubble radius
- `control.tooltip_caret_width`, `control.tooltip_caret_height` - caret clipping box
- `control.tooltip_offset` - anchor-to-bubble spacing
- `control.tooltip_max_width` - bubble width ceiling
- `control.tooltip_compact_*` - the compact kind's padding, caret and offset
- `stacking.floating` - the popover's z-level

## Accessibility

- `role="tooltip"` on the popover; `aria-describedby` on the anchor names
  it; the caret is `aria-hidden`.
- Escape closes while open.

## Second reference

`none` - the compact geometry comes from the theme's `tooltip_compact`
cells.
