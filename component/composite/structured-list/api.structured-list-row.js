// Info: StructuredListRow public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'StructuredListRow',
  props: Object.freeze({
    head: { type: 'boolean', required: false, description: 'A head row: head cells and no rule.' },
    id: { type: 'string', required: false, description: 'The row\'s id, the value a selection list selects.' },
    cells: { type: 'array', required: false, description: 'The cells it draws: a string, or `{ text, noWrap }`.' },
    children: { type: 'node', required: false, description: 'Further cells (StructuredListCell) and the row\'s radio (StructuredListInput).' },
    previousId: { type: 'string', required: false, description: 'Composition prop: the id of the row before it, whose hover or selection colors its rule (StructuredListBody passes it).' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the row.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.structured_list_border', 'color.structured_list_row_container_hover', 'color.structured_list_row_container_selected', 'color.focus', 'border.width_01', 'border.width_02', 'control.structured_list_row_min_height']),
  colors: Object.freeze([])
});
