// Info: ToggletipLabel public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ToggletipLabel',
  props: Object.freeze({
    children: { type: 'string', required: false, description: 'The label text beside the button.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the label.' }
  }),
  composition: Object.freeze({}),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.text_secondary', 'spacing.spacing_03', 'type.label01']),
  colors: Object.freeze([])
});
