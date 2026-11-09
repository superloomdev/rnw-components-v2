// Info: Tile public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Tile',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The content the tile groups.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tile.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tile_padding', 'control.tile_min_height', 'control.tile_min_width',
    'color.tile_container', 'color.tile_label', 'type.tile', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
