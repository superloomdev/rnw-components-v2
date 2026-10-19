// Info: RadioButtonSkeleton public API, as data. The docs generator and
// the accessibility tests read this; the component implements exactly this
// and nothing more.

export default Object.freeze({
  name: 'RadioButtonSkeleton',
  props: Object.freeze({
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.selection_skeleton_label_width',
    'control.radio_skeleton_label_height'
  ]),
  colors: Object.freeze([])
});
