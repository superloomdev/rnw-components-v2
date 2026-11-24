// Info: StructuredListWrapper public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'StructuredListWrapper',
  props: Object.freeze({
    columns: { type: 'array', required: false, description: 'The head\'s labels, drawn as one StructuredListHead row of head cells.' },
    rows: { type: 'array', required: false, description: 'The body\'s rows `{ id, cells }`, drawn as one StructuredListBody: a cell is a string or `{ text, noWrap }`.' },
    children: { type: 'node', required: false, description: 'Further members after `columns` and `rows`: a StructuredListHead, a StructuredListBody.' },
    selection: { type: 'boolean', required: false, description: 'A body row is pressed to select it, one at a time.' },
    marker: { type: 'string', required: false, description: 'Under `selection`, how a row shows it: \'check\' (the default) a trailing checkmark on the selected row, \'radio\' a leading radio glyph on every row.' },
    selectedInitialRow: { type: 'string', required: false, description: 'The id of the row selected first.' },
    onSelect: { type: 'function', required: false, description: 'Called with the id of the row a press or key selects.' },
    isCondensed: { type: 'boolean', required: false, description: 'The condensed paddings.' },
    isFlush: { type: 'boolean', required: false, description: 'No start space; ignored under `selection`.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The table\'s label.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the table.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['control.structured_list_marker_column']),
  colors: Object.freeze([])
});
