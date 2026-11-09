// Info: ListItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more. Composed through the lists - see `notes.md`.
export default Object.freeze({
  name: 'ListItem',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The row\'s text.' },
    kind: { type: 'string', required: false, description: 'Composition prop: `unordered`, `ordered` or `native` - the marker glyph and offset.' },
    index: { type: 'number', required: false, description: 'Composition prop: the 1-based ordinal for the `n.`/`a.` markers.' },
    nested: { type: 'boolean', required: false, description: 'Composition prop: the item sits in a nested list (square/lower-latin marker, nested padding).' },
    expressive: { type: 'boolean', required: false, description: 'Composition prop: the expressive list type.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.text_list_label', 'type.text_list', 'type.text_list_expressive', 'control.text_list_nested_item_padding', 'control.text_list_marker_offset', 'control.text_list_nested_marker_offset', 'control.text_list_ordinal_offset'
  ])
});
