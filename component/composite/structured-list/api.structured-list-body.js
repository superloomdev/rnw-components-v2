// Info: StructuredListBody public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'StructuredListBody',
  props: Object.freeze({
    rows: { type: 'array', required: false, description: 'The rows it draws, `{ id, cells }` (StructuredListRow).' },
    children: { type: 'node', required: false, description: 'Further rows: StructuredListRow.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the row group.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.structured_list_border', 'color.structured_list_row_container_hover', 'color.structured_list_row_container_selected', 'border.width_01']),
  colors: Object.freeze([])
});
