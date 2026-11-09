// Info: Column public API, as data.
export default Object.freeze({
  name: 'Column',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The column\'s content.' },
    sm: { type: 'one', required: false, description: 'The span at the sm breakpoint: a count, a `n%` string, `true` for auto, or `{ span, offset }`.' },
    md: { type: 'one', required: false, description: 'The span at the md breakpoint.' },
    lg: { type: 'one', required: false, description: 'The span at the lg breakpoint.' },
    xlg: { type: 'one', required: false, description: 'The span at the xlg breakpoint.' },
    max: { type: 'one', required: false, description: 'The span at the max breakpoint.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the column.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['grid.columns_lg', 'font.family.sans']),
  colors: Object.freeze([])
});
