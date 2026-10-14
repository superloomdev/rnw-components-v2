// Info: Tag spec sheet. Every metric names a token; the theme supplies the
// number. The small size's height is the theme's own cell - the label's
// line box must fit the pill (the primary's 18, the second's 24); the
// large size is the small size step.
// `iconGap` and `paddingInlineIcon` share the tag's icon-spacing cell: both
// references answer it with the same number for the start padding and the
// gap after the icon.

export default Object.freeze({
  height: 'control.tag_height',
  heightSmall: 'control.tag_height_small',
  heightLarge: 'size.size_small',
  radius: 'control.tag_radius',
  paddingInline: 'control.tag_padding_inline',
  paddingInlineIcon: 'control.tag_padding_icon',
  paddingInlineLarge: 'spacing.spacing_04',
  paddingInlineLargeIcon: 'spacing.spacing_03',
  iconGap: 'control.tag_padding_icon',
  iconSize: 'control.tag_icon_size',
  outlineWidth: 'control.tag_outline_width'
});
