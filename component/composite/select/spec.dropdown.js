// Info: Dropdown spec sheet. Every metric names a token; the theme supplies
// the number. The frame's border, fill, paddings, label placement and text
// come from the context's field presentation (the theme's `field` cells) and
// the option list from the context's list presentation (the theme's `list`
// cells); this sheet holds the dropdown's own height, corner, icon size and
// its list. `listMaxRows` is a decision: the list shows at most five and a
// half options before scrolling. `itemMarkRoom` is the room the selected
// mark takes at an item's end where the theme draws it. `iconZone`,
// `iconInset` and `iconGapEnd` place the caret and error icon: the caret sits
// in a square zone inset from the frame's end, the error icon ahead of it.
// `labelInset` is the offset the 'above' label takes from the root's top:
// the reference draws the label inline, whose line box sits a little below.

export default Object.freeze({
  height: 'control.field_height',
  heightSmall: 'size.size_small',
  heightLarge: 'size.size_large',
  radius: 'control.field_radius',
  iconSize: 'control.field_icon_size',
  iconZone: 'size.size_xsmall',
  iconInset: 'spacing.spacing_04',
  iconGapEnd: 'spacing.spacing_02',
  labelInset: 'spacing.spacing_01',
  restingEdge: 'control.field_outline_width',
  itemPaddingInline: 'control.list_item_padding_inline',
  itemDividerWidth: 'control.list_item_divider_width',
  itemMarkRoom: 'spacing.spacing_06',
  listPaddingBlock: 'control.list_padding_block',
  listRadius: 'control.list_radius',
  listLevel: 'stacking.dropdown',
  listMaxRows: { constant: 5.5 },
  markSize: 'control.field_icon_size'
});
