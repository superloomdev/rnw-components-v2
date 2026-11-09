// Info: Row public API, as data.
export default Object.freeze({
  name: 'Row',
  props: Object.freeze({
    columns: { type: 'array', required: false, description: 'Composition prop: the columns as data (samples cannot carry element children); each becomes a Column.' },
    children: { type: 'node', required: false, description: 'The Columns to lay out.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the row.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['grid.gutter', 'font.family.sans']),
  colors: Object.freeze([])
});
