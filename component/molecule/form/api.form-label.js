// Info: FormLabel public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'FormLabel',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The label text.' },
    disabled: { type: 'boolean', required: false, description: 'Draws the label in the disabled label color.' },
    id: { type: 'string', required: false, description: 'The label element\'s id, for a control to name itself by `aria-labelledby`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the label.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.field_label', 'color.field_label', 'color.field_label_disabled', 'font.family.sans']),
  colors: Object.freeze([])
});
