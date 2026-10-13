// Info: AspectRatio public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'AspectRatio',
  props: Object.freeze({
    ratio: { type: 'string', required: false, description: 'The box proportion, one of `variants`: width `x` height. Default `1x1`.' },
    children: { type: 'node', required: false, description: 'Content inside the box. A string renders through the Text atom.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['16x9', '9x16', '2x1', '1x2', '4x3', '3x4', '3x2', '2x3', '1x1']),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
