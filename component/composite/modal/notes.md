# Modal

A `role="dialog"` container on a full `dialog_scrim` layer. The header
carries an optional eyebrow label (`label01`, `text_secondary`) and the
heading; the body takes the children; the actions row renders the `actions`
array; the close button composes `IconButton` (ghost) at
`control.dialog_close_icon_size` where `anatomy.dialog_close` says `shown`
- the seat is `display: none` elsewhere so the tree never depends on the
theme.

## Decisions

- **Width.** `control.dialog_min_width` / `max_width` decide: both zero
  means the reference's percentage-width rule (`xs` 24, `sm` 32, `md` 48,
  `lg` 84 of the viewport); any bound means the dialog sizes to content
  inside the bounds. The percentages are the reference's own rule and stay
  component constants.
- **Actions.** `anatomy.dialog_actions` `stretched` rows the buttons edge
  to edge at `dialog_actions_height` (each `Button` gets `fill`), last is
  `primary` and the rest `secondary`. `trailing` rows them right with
  `dialog_actions_gap` and `dialog_actions_padding` on the inline sides and
  bottom; the top space is `spacing_05` and the body's own bottom padding
  falls to `dialog_header_gap` when a row follows - the second
  reference's content-then-actions geometry. Trailing actions default to
  `ghost`. An action's `kind` overrides.
- **Header padding end** reserves the close button's square where shown
  (`icon_button_size`), else the inline cell.
- **Scrim** centers the container, paints `dialog_scrim`, sits at
  `stacking.overlay`, and a press that lands on it (not inside the
  container) asks for a close unless `preventCloseOnClickOutside`.
- **Focus.** The focus-trap behavior takes initial focus (the container,
  `tabIndex=-1`), wraps Tab, binds Escape, and restores the previous focus.
- **The layer renders through an overlay host where one is mounted**, else
  in place, `fixed` on the web and `absolute` natively.
- The `IconButton` gains an `iconSize` prop and the `Button` a `fill` prop
  for these compositions; both are API additions this component owns.

## Cells

- `color.dialog_scrim`, `stacking.overlay` - the layer
- `color.dialog_container`, `color.dialog_border`, `control.dialog_border_width`, `control.dialog_radius`, `shadow.dialog` - the surface
- `control.dialog_min_width`, `control.dialog_max_width` - width bounds
- `control.dialog_padding_inline`, `control.dialog_padding_top`, `control.dialog_header_gap` - the header
- `type.dialog_heading`, `color.dialog_heading`, `type.label01`, `color.text_secondary` - the texts
- `type.dialog_body`, `color.dialog_body`, `control.dialog_body_padding_top`, `control.dialog_body_padding_bottom` - the body
- `control.dialog_actions_height`, `control.dialog_actions_gap`, `control.dialog_actions_padding` - the row
- `control.dialog_close_icon_size`, `control.icon_button_size`, `icon.close` - the close control
- `anatomy.dialog_actions`, `anatomy.dialog_close` - the discrete choices

## Accessibility

- `role="dialog"` (`alertdialog` under `alert`, with `aria-describedby` on
  the body); `aria-modal`; `aria-labelledby` the heading unless
  `accessibilityLabel` names it; Escape and focus trap; focus returns on
  close.

## Second reference

`md-dialog` with `headline`, content and `actions` slots of
`md-text-button`. No eyebrow label, no close control, and bounded
content-sized width.
