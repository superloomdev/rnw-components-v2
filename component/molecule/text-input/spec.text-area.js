// Info: TextArea spec sheet. Every metric names a token; the theme supplies
// the number. The frame's border, fill, paddings, label placement and text
// come from the context's field presentation (the theme's `field` cells);
// this sheet holds the field's own minimum height, corner, icon size and
// icon insets. The field's top padding is the room one value line takes
// centered in the minimum height: the component computes it as
// (minHeight - field_value lineHeight) / 2. The bottom padding is its own
// step (`_text-area.scss:43` `padding-block: 11px $spacing-03`).

export default Object.freeze({
  minHeight: 'control.field_height',
  radius: 'control.field_radius',
  iconSize: 'control.field_icon_size',
  iconInsetEnd: 'control.field_icon_inset',
  iconInsetTop: 'spacing.spacing_04',
  paddingBottom: 'spacing.spacing_03',
  messageInset: 'control.field_message_inset'
});
