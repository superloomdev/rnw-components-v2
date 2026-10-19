// Info: NumberInput spec sheet. The frame's border, fill, paddings, label
// placement and text come from the context's field presentation (the
// theme's `field` cells); this sheet holds the field's own height, corner,
// icon size, minimum width, the steppers' slot geometry under
// `anatomy.field_action`, the divider and the text-to-steppers gap. Every
// metric names a token; the theme supplies the number.

export default Object.freeze({
  height: 'control.field_height',
  heightSmall: 'size.size_small',
  heightLarge: 'size.size_large',
  radius: 'control.field_radius',
  minWidth: 'control.number_input_min_width',
  iconSize: 'control.field_icon_size',
  actionInset: 'control.field_action_inset',
  actionSize: 'control.field_action_size',
  actionGap: 'control.field_action_gap',
  squareRadius: 'shape.radius_00',
  roundRadius: 'shape.radius_max',
  dividerHeight: 'control.number_input_divider_height',
  dividerWidth: 'border.width_01',
  ruleWidth: 'border.width_01',
  reserveGap: 'spacing.spacing_05'
});
