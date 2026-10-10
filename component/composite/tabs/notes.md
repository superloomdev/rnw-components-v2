# Tabs

A `role="tablist"` bar of `role="tab"` buttons, one per `items` entry.
Selection is controllable through `selectedIndex` / `onChange`; activation
is automatic: a click, an arrow key, Home or End moves and selects, and the
roving tab index puts only the active tab in the tab order. Disabled tabs
are skipped by the arrows and stay out of the order.

## Decisions

- **Variants.** `line` (default) draws each tab's track, the `tab_track`
  cells per state; `contained` draws the `tab_contained` cells: a filled tab,
  an end separator between tabs, and the indicator on the top edge.
- **The indicator.** Only the selected tab draws it: `anatomy.tab_indicator`
  `full` spans the tab, `content` spans the label's own box (mounted inside
  it, offset to the tab's edge); the edge is `bottom` for `line`, `top` for
  `contained`, and `tab_indicator_radius` rounds the edge-facing corners.
- **Every seat mounts under every template** - the layer, the track (or the
  separator), both indicator seats and the divider - so the element tree is
  the same whichever cells the theme fills (a zero `tab_track_width` draws
  no line, a content-width template leaves the full seat empty).
- **The label follows the state:** the `tab_label` cells for color and the
  `tab_label` / `tab_label_selected` type cells; the state layer is the
  `tab_layer_*` cells, drawn by a seat that covers the tab.
- **Focus.** `ctx.focusRing('tab', ...)` reads the family's focus cells;
  under `feedback.focus_trigger: keyboard` it shows on keyboard focus only.
- **Panels are the host's.** The bar is the whole component; what each tab
  shows is the app's region, as the first reference's `TabPanels` is a
  separate composition.

## Cells

- `color.tab_container`, `color.tab_divider`, `control.tab_divider_width` - the bar
- `color.tab_track`, `_hover`, `_disabled`, `control.tab_track_width` - the `line` underline
- `color.tab_indicator`, `control.tab_indicator_width`, `control.tab_indicator_radius`, `anatomy.tab_indicator` - the selected mark
- `color.tab_label*` (rest, hover, selected, selected hover, disabled), `type.tab_label`, `type.tab_label_selected` - the label
- `color.tab_layer_*` (hover, active, selected variants) - the state layer
- `color.tab_contained_container*` (rest, hover, selected), `color.tab_contained_separator`, `border.width_01` - the contained variant
- `control.tab_height`, `control.tab_padding_inline`, `control.tab_focus_width`, `control.tab_focus_offset`, `color.tab_focus_ring` - geometry and focus

## Accessibility

- `role="tablist"` on the bar (with `aria-label`), `role="tab"` with
  `aria-selected` and `aria-disabled` on each tab, `tabIndex` roved to the
  active one; decorative seats are `aria-hidden`.

## Second reference

`md-tabs` of `md-primary-tab` elements (the content-width indicator). It
has no contained variant, so `contained` samples are unmeasured there.
