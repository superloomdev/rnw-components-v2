// Info: Grid public API, as data.
export default Object.freeze({
  name: 'Grid',
  props: Object.freeze({
    columns: { type: 'array', required: false, description: 'Composition prop: the columns as data (samples cannot carry element children); each becomes a Column.' },
    children: { type: 'node', required: false, description: 'The Columns (CSS-grid mode) or Rows (flexbox mode) to lay out.' },
    condensed: { type: 'boolean', required: false, description: 'The one-pixel gutter.' },
    fullWidth: { type: 'boolean', required: false, description: 'The grid spans the whole width; no max.' },
    narrow: { type: 'boolean', required: false, description: 'The 16px gutter.' },
    withRowGap: { type: 'boolean', required: false, description: 'A gutter-height gap between lines / rows.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the grid.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'grid.columns_lg', 'grid.gutter', 'grid.gutter_condensed', 'grid.gutter_narrow',
    'grid.margin_sm', 'grid.margin_md', 'grid.margin_lg', 'grid.margin_xlg', 'grid.margin_max',
    'breakpoint.md', 'breakpoint.lg', 'breakpoint.xlg', 'breakpoint.max', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
