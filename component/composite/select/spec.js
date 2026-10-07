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
  optionPadding: 'control.field_padding_inline',
  optionHeight: 'control.option_height',
  listLevel: 'stacking.dropdown'
});
