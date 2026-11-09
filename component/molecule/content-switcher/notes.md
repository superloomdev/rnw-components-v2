# ContentSwitcher

A row of segments where exactly one is selected, for switching between
views of the same content. `Switch` is one text segment; `IconSwitch` is the
icon-only member whose name appears in a tooltip.

## Decisions

- **Selection is single.** Exactly one segment is selected at a time;
  `selectedIndex` / `onChange` control it.
- **The slab.** The selected segment draws `content_switcher_container_selected`
  (or the low-contrast cells); the label and icon read their selected cells.
- **Separators.** `anatomy.content_switcher_separator` picks `short` (a 1px
  mark between adjacent unselected segments) or `full` (a full-height
  outline on every segment).
`IconSwitch` is a member-only component (`requires_parent`): it must be
composed inside `ContentSwitcher`; the parent supplies `selected`, the roving
focus and the separator rule. `Switch` stands alone as one segment.
`no_reference`: the reference draws a segment only inside a content switcher,
so it is measured through ContentSwitcher's samples.

- **Icon-only segments.** `IconSwitch` draws the glyph and names itself with
  `label`, shown as a tooltip.

## Cells

- `color.content_switcher_outline*` and `control.content_switcher_radius` - the container
- `color.content_switcher_label*`, `type.content_switcher_label` - the label
- `color.content_switcher_container_*` - the selected slab and hover fill
- `color.content_switcher_icon*` and `control.content_switcher_icon_size*` - the icon
- `color.content_switcher_separator*`, `control.content_switcher_separator_height` - the separator
- `color.content_switcher_low_contrast_*` - the low-contrast variant
- `anatomy.content_switcher_separator`, `anatomy.content_switcher_selected_mark` - structure

## Accessibility

- `role="tablist"` on the container, `role="tab"` with `aria-selected` on
  each segment, `tabIndex` roved to the active one.
