// Info: ButtonSet spec sheet. Every metric names a token; the theme
// supplies the number. `itemMaxWidth` caps a seat's share of the row,
// `separatorWidth` is the line between seats, `fluidMinWidth` the floor the
// fluid rules multiply by the item count, `fluidMaxWidth` the fluid seat's
// ceiling and `fluidGhostPaddingStart` a fluid ghost item's start padding;
// `columnGhostPaddingStart` is the tighter one a stacked fluid set draws.

export default Object.freeze({
  itemMaxWidth: 'control.button_set_item_max_width',
  gap: 'control.button_set_gap',
  separatorWidth: 'border.width_01',
  fluidMinWidth: 'control.button_set_fluid_min_width',
  fluidMaxWidth: 'control.button_set_fluid_max_width',
  fluidGhostPaddingStart: 'control.button_set_fluid_ghost_padding_start',
  columnGhostPaddingStart: 'spacing.spacing_05'
});
