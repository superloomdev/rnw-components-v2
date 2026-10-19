// Info: TimePicker spec sheet. The frame's border, fill, paddings, label
// placement and message come from the context's field presentation (the
// theme's `field` cells), shared with the text input; this sheet holds the
// field's own height, corner, icon size, fixed input widths and the gap to
// and between the select members. Every metric names a token; the theme
// supplies the number.

export default Object.freeze({
  height: 'control.field_height',
  heightSmall: 'size.size_small',
  heightLarge: 'size.size_large',
  radius: 'control.field_radius',
  iconSize: 'control.field_icon_size',
  width: 'control.time_picker_input_width',
  widthInvalid: 'control.time_picker_input_width_invalid',
  selectGap: 'control.time_picker_select_gap',
  // The invalid icon's overlay seat: an end inset, then the glyph's own
  // box margins (the reference's start/end/top margins)
  invalidIconInset: 'spacing.spacing_05',
  invalidIconMarginStart: { tokens: ['spacing.spacing_01', 'border.width_01'], operation: 'sum' },
  invalidIconMarginEnd: 'border.width_01',
  invalidIconMarginTop: 'border.width_01'
});
