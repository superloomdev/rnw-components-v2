// Info: ProgressIndicatorSkeleton spec sheet. Every metric names a token;
// the theme supplies the number. The skeleton reuses the step family's
// cells: the step's width bounds, the glyph's size and top margins (the
// skeleton label shares the icon's top margin, so both align - the
// reference gives its label the same 10px and 1px), and the line's
// thickness. `count` is the reference's fixed four steps; `lineBorder`
// the transparent border pixel the reference folds into every line edge.

export default Object.freeze({
  count: { constant: 4 },
  width: 'control.progress_step_width',
  minWidth: 'control.progress_step_min_width',
  verticalMinHeight: 'control.progress_step_vertical_min_height',
  iconTop: 'control.progress_step_icon_top',
  iconGap: 'control.progress_step_icon_gap',
  verticalIconTop: 'control.progress_step_vertical_icon_top',
  lineWidth: 'control.progress_step_line_width',
  verticalLineWidth: 'control.progress_step_vertical_line_width',
  labelWidth: 'control.progress_step_skeleton_label_width',
  labelHeight: 'control.progress_step_skeleton_label_height',
  iconSize: 'size.icon_01',
  iconRadius: 'shape.radius_max',
  lineBorder: { constant: 1 }
});
