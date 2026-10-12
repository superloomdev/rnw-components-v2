// Info: Select spec sheet. Every metric names a token; the theme supplies
// the number. The frame's border, fill, paddings, label placement and text
// come from the context's field presentation (the theme's `field` cells),
// shared with the text input; this sheet holds the select's own height,
// corner, icon size and its list.

export default Object.freeze({
  height: 'control.field_height',
  heightSmall: 'size.size_small',
  heightLarge: 'size.size_large',
  radius: 'control.field_radius',
  iconSize: 'control.field_icon_size',
  itemHeight: 'control.list_item_height',
  itemPaddingInline: 'control.list_item_padding_inline',
  itemDividerWidth: 'control.list_item_divider_width',
  listPaddingBlock: 'control.list_padding_block',
  listRadius: 'control.list_radius',
  listLevel: 'stacking.dropdown',
  listMaxRows: { constant: 5.5 }
});
