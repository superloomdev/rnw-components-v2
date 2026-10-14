// Info: TagSkeleton spec sheet. The skeleton is the tag's height (the small
// height at `sm`) and corner at the theme's skeleton tag width.

export default Object.freeze({
  width: 'control.tag_skeleton_width',
  height: 'control.tag_height',
  heightSmall: { tokens: ['size.icon_01', 'spacing.spacing_01'], operation: 'sum' },
  radius: 'control.tag_radius'
});
