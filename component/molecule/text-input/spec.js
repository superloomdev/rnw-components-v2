// Info: TextInput spec sheet. Every metric names a token; the theme supplies
// the number. The frame's border, fill, paddings, label placement and text
// come from the context's field presentation (the theme's `field` cells);
// this sheet holds the field's own height, corner and icon size.

export default Object.freeze({
  height: 'control.field_height',
  heightSmall: 'size.size_small',
  heightLarge: 'size.size_large',
  radius: 'control.field_radius',
  iconSize: 'control.field_icon_size'
});
