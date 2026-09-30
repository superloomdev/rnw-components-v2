// Info: Checkbox spec sheet. Every metric names a token; the theme supplies
// the number. The mark fills the box inside its two borders; the state
// layer is a disc centered on the box.

export default Object.freeze({
  boxSize: 'size.icon_01',
  borderWidth: 'border.width_01',
  radius: 'shape.radius_02',
  markSize: { tokens: ['size.icon_01', 'border.width_01', 'border.width_01'], operation: 'subtract' },
  labelGap: 'spacing.spacing_03',
  minHeight: 'size.size_xsmall',
  layerSize: 'size.size_medium',
  layerRadius: 'shape.radius_max',
  messageGap: 'spacing.spacing_02'
});
