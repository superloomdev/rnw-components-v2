// Info: Stack public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Stack',
  props: Object.freeze({
    gap: { type: 'number', required: false, description: 'Gap between children as a step of the spacing scale, 1 through 13 (`spacing.spacing_01` .. `spacing.spacing_13`). Anything else draws no gap.' },
    orientation: { type: 'string', required: false, description: '`vertical` (default) lays children in a column; `horizontal` lays them in a row sized to the content.' },
    children: { type: 'node', required: false, description: 'The children the stack spaces.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['vertical', 'horizontal']),
  tokens: Object.freeze([
    'spacing.spacing_01', 'spacing.spacing_02', 'spacing.spacing_03', 'spacing.spacing_04', 'spacing.spacing_05',
    'spacing.spacing_06', 'spacing.spacing_07', 'spacing.spacing_08', 'spacing.spacing_09', 'spacing.spacing_10',
    'spacing.spacing_11', 'spacing.spacing_12', 'spacing.spacing_13'
  ]),
  colors: Object.freeze([])
});
