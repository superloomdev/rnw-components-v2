// Info: StructuredListCell public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'StructuredListCell',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The cell\'s content: a text, measured for its column, or elements.' },
    head: { type: 'boolean', required: false, description: 'A head cell.' },
    noWrap: { type: 'boolean', required: false, description: 'The text keeps one line: its column is never narrower.' },
    marker: { type: 'string', required: false, description: 'Composition prop: a marker cell the row draws, \'radio\' or \'check\'.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the cell.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.structured_list_head', 'type.structured_list_cell',
    'color.structured_list_head_label', 'color.structured_list_cell_label', 'color.structured_list_cell_label_selected', 'color.structured_list_check', 'border.width_01'
  ]),
  colors: Object.freeze([])
});
