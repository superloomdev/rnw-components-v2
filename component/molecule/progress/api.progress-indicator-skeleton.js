// Info: ProgressIndicatorSkeleton public API, as data. The docs generator
// and the accessibility tests read this; the component implements exactly
// this and nothing more.

export default Object.freeze({
  name: 'ProgressIndicatorSkeleton',
  props: Object.freeze({
    vertical: { type: 'boolean', required: false, description: 'Stacks the skeleton steps in the column form.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.progress_step_width', 'control.progress_step_min_width', 'control.progress_step_vertical_min_height',
    'control.progress_step_icon_top', 'control.progress_step_icon_gap', 'control.progress_step_vertical_icon_top',
    'control.progress_step_line_width', 'control.progress_step_vertical_line_width',
    'control.progress_step_skeleton_label_width', 'control.progress_step_skeleton_label_height',
    'size.icon_01', 'shape.radius_max',
    'color.progress_step_icon_incomplete', 'color.progress_step_line'
  ]),
  colors: Object.freeze([])
});
