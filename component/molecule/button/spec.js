// Info: Button spec sheet. Every metric names a token; the theme supplies
// the number. The border is always drawn (transparent unless the kind is
// outlined), so every kind has the same outer size and the paddings are
// measured from the border inward.

export default Object.freeze({
  height: 'size.size_large',
  heightXsmall: 'size.size_xsmall',
  heightSmall: 'size.size_small',
  heightMedium: 'size.size_medium',
  heightXlarge: 'size.size_xlarge',
  height2xlarge: 'size.size_2xlarge',
  borderWidth: 'border.width_01',
  paddingStart: { tokens: ['spacing.spacing_05', 'border.width_01'], operation: 'subtract' },
  paddingEnd: { tokens: ['spacing.spacing_10', 'border.width_01'], operation: 'subtract' },
  iconSize: 'size.icon_01',
  iconInset: 'spacing.spacing_05',
  iconGap: 'spacing.spacing_03',
  radius: 'shape.radius_00'
});
