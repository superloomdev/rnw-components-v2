// Info: NumberInputSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'NumberInputSkeleton',
  props: Object.freeze({
    size: { type: 'string', required: false, description: 'Field height the box draws: `sm`, `md`, `lg`. Default `md`.' },
    hideLabel: { type: 'boolean', required: false, description: 'Skips the label placeholder.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze(['control.number_input_min_width']),
  colors: Object.freeze([])
});
