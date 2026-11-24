// Info: StructuredListHead public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'StructuredListHead',
  props: Object.freeze({
    columns: { type: 'array', required: false, description: 'The labels of the head row it draws.' },
    children: { type: 'node', required: false, description: 'Further members: a head StructuredListRow.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the row group.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
