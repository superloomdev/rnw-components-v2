// Info: ProgressStep spec sheet. Every metric names a token or a declared
// constant; the theme supplies the numbers. The step's width bounds, icon
// placement, line widths and label measures are the `progress_step` cells
// the v7 amendment wrote for the parts the grid had no cells for (the
// focus width, the vertical icon top and line width, and the secondary
// label's offsets). The glyph is the first icon size. The label's
// underline travels at the fast-02 duration and the standard productive
// easing, as the references' label transition does.
//
// The constants: the label's line-height ratio the reference writes over
// its type set (`line-height: 1.45`,
// progress-indicator/_progress-indicator.scss:94); and the line's
// transparent border - `border: 1px inset transparent` under a border-box
// reset (`:25`, `:58`) folds a pixel of transparent edge into every side,
// so the drawn strip is never thinner than two pixels whatever the cell
// says.

export default Object.freeze({
  width: 'control.progress_step_width',
  minWidth: 'control.progress_step_min_width',
  verticalMinHeight: 'control.progress_step_vertical_min_height',
  iconTop: 'control.progress_step_icon_top',
  iconGap: 'control.progress_step_icon_gap',
  verticalIconTop: 'control.progress_step_vertical_icon_top',
  lineWidth: 'control.progress_step_line_width',
  verticalLineWidth: 'control.progress_step_vertical_line_width',
  focusWidth: 'control.progress_step_focus_width',
  labelMaxWidth: 'control.progress_step_label_max_width',
  labelMaxWidthVertical: 'control.progress_step_label_max_width_vertical',
  labelGap: 'control.progress_step_label_gap',
  secondaryTop: 'control.progress_step_secondary_label_top',
  secondaryStart: 'control.progress_step_secondary_label_start',
  labelEndInset: 'spacing.spacing_04',
  iconSize: 'size.icon_01',
  iconRadius: 'shape.radius_max',
  labelDuration: 'motion.duration_fast_02',
  labelEasing: 'motion.easing_standard_productive',
  labelLineHeight: { constant: 1.45 },
  lineBorder: { constant: 1 }
});
