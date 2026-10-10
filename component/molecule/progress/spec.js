// Info: ProgressBar spec sheet. Every metric names a token; the theme
// supplies the number. The track's height is the progress family's own
// cell (the primary's big size); the small size is the second spacing step
// (the primary's 4). The label and helper gaps are the third spacing step;
// the track and label's minimum width is the ninth (the primary's 48); the
// status icon is the first icon step and its inset the fifth spacing step.
// The fill transition is the fast duration at the standard easing; the
// indeterminate cycle is the slowest duration, linear.

export default Object.freeze({
  height: 'control.progress_height',
  heightSmall: 'spacing.spacing_02',
  radius: 'control.progress_radius',
  minWidth: 'spacing.spacing_09',
  labelGap: 'spacing.spacing_03',
  helperGap: 'spacing.spacing_03',
  iconSize: 'size.icon_01',
  iconGap: 'spacing.spacing_05',
  fillDuration: 'motion.duration_fast_02',
  fillEasing: 'motion.easing_standard_productive',
  sweepDuration: 'motion.duration_extra_slow_04',
  sweepEasing: 'motion.easing_linear'
});
