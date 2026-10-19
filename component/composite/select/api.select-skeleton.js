// Info: SelectSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SelectSkeleton',
  props: Object.freeze({
    hideLabel: { type: 'boolean', required: false, description: 'Skips the label placeholder.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.field_height', 'control.field_skeleton_label_height', 'control.field_skeleton_label_width',
    'spacing.spacing_03'
  ]),
  colors: Object.freeze([])
});
