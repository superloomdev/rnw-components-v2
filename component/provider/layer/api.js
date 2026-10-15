// Info: Layer public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Layer',
  props: Object.freeze({
    level: { type: 'number', required: false, description: 'Surface level override: `0`, `1` or `2` paints the children at levels 1, 2 or 3. Omitted, the layer paints one level deeper than the layer it sits inside.' },
    withBackground: { type: 'boolean', required: false, description: 'Paint the layer\'s own level surface behind the children. Default `false`, as upstream.' },
    children: { type: 'node', required: false, description: 'Content that reads its tokens at the deeper level.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.layer_background_01', 'color.layer_background_02', 'color.layer_background_03']),
  colors: Object.freeze([])
});
