// Info: CheckboxSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'CheckboxSkeleton',
  props: Object.freeze({
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.selection_skeleton_label_width',
    'spacing.spacing_01', 'spacing.spacing_02', 'spacing.spacing_03', 'spacing.spacing_05',
    'border.width_01'
  ]),
  colors: Object.freeze([])
});
