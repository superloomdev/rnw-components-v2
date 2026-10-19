// Info: Form public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Form',
  props: Object.freeze({
    accessibilityLabel: { type: 'string', required: false, description: 'Names the form; the `form` role exists only when a label is set.' },
    children: { type: 'node', required: false, description: 'The fields the form groups.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.body_compact_01', 'color.text_primary', 'font.family.sans']),
  colors: Object.freeze([])
});
