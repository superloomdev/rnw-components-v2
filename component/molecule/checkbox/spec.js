// Info: Checkbox spec sheet. Every metric names a token; the theme supplies
// the number. The mark fills the box inside its two borders; the state
// layer is a disc centered on the box. The primary reference states the
// row height, the label inset and the error-icon margins in rem steps that
// fall between scale tokens, so each is the sum of the two tokens it equals.

export default Object.freeze({
  boxSize: 'control.checkbox_size',
  borderWidth: 'control.checkbox_border',
  radius: 'shape.radius_02',
  markSize: { tokens: ['control.checkbox_size', 'control.checkbox_border', 'control.checkbox_border'], operation: 'subtract' },
  labelGap: { tokens: ['spacing.spacing_04', 'spacing.spacing_01'], operation: 'sum' },
  minHeight: { tokens: ['spacing.spacing_05', 'spacing.spacing_02'], operation: 'sum' },
  layerSize: 'size.size_medium',
  layerRadius: 'shape.radius_max',
  messageGap: 'spacing.spacing_02',
  iconSize: 'size.icon_01',
  iconInsetStart: { tokens: ['spacing.spacing_01', 'border.width_01'], operation: 'sum' },
  iconInsetEnd: 'border.width_01',
  iconInsetTop: 'border.width_01',
  messageTextGap: 'spacing.spacing_03'
});
