// Info: UnorderedList public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.
export default Object.freeze({
  name: 'UnorderedList',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The rows: `string` labels or `{ label, items }` for a nested list.' },
    isExpressive: { type: 'boolean', required: false, description: 'Draws the expressive list type.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The list landmark\'s name.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.text_list_indent', 'control.text_list_nested_indent'
  ])
});
