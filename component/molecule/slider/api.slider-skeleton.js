// Info: SliderSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SliderSkeleton',
  props: Object.freeze({
    hideLabel: { type: 'boolean', required: false, description: 'Omits the label placeholder bar.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.slider_gap', 'control.slider_min_width', 'control.slider_max_width',
    'control.slider_height', 'control.slider_track_height', 'control.slider_track_radius',
    'control.slider_track_inset', 'control.slider_handle_inset', 'control.slider_handle_size',
    'control.slider_handle_size_active', 'control.slider_tick_height',
    'control.slider_skeleton_range_width', 'control.slider_skeleton_range_height',
    'control.field_skeleton_label_width', 'control.field_skeleton_label_height',
    'border.width_01', 'border.width_02', 'spacing.spacing_03',
    'anatomy.slider_focus', 'shadow.slider_handle',
    'color.slider_track', 'color.slider_track_filled', 'color.slider_handle'
  ]),
  colors: Object.freeze([])
});
