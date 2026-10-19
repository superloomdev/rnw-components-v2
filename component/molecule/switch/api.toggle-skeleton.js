// Info: ToggleSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ToggleSkeleton',
  props: Object.freeze({
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.switch_handle_size', 'control.toggle_skeleton_bar_width', 'control.toggle_skeleton_bar_height',
    'spacing.spacing_03', 'shape.radius_max'
  ]),
  colors: Object.freeze([])
});
