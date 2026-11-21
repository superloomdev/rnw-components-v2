// Info: DatePickerSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'DatePickerSkeleton',
  props: Object.freeze({
    range: { type: 'boolean', required: false, description: 'Draws the two input bars a range picker holds.' },
    hideLabel: { type: 'boolean', required: false, description: 'Skips the label placeholders.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['default', 'range', 'hideLabel']),
  tokens: Object.freeze([
    'control.field_height', 'control.field_skeleton_label_height', 'control.field_skeleton_label_width',
    'control.date_picker_range_input_width', 'control.date_picker_short_input_width',
    'color.skeleton_background', 'spacing.spacing_03'
  ]),
  colors: Object.freeze([])
});
