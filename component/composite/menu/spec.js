// Info: Menu spec sheet. Every metric names a token; the theme supplies
// the number. `markSize` is the selected item's mark, `itemGap` the space
// between an item's seats, its label and its shortcut. `minWidth` floors the
// surface, `iconMinWidth` the floor for a menu whose items carry icons.
// `spacing` is the viewport margin the positioner keeps, a decision shared
// with the popovers.

export default Object.freeze({
  itemHeight: 'control.menu_item_height',
  paddingBlock: 'control.menu_padding_block',
  paddingInline: 'control.list_item_padding_inline',
  iconSize: 'control.menu_icon_size',
  markSize: 'size.icon_01',
  dividerWidth: 'control.menu_divider_width',
  level: 'stacking.dropdown',
  itemGap: 'control.menu_item_gap',
  minWidth: 'control.menu_min_width',
  iconMinWidth: 'control.menu_icon_min_width',
  radius: 'control.list_radius',
  spacing: { constant: 8 }
});
