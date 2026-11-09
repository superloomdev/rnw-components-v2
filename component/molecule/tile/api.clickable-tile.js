// Info: ClickableTile public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ClickableTile',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The content the tile groups.' },
    disabled: { type: 'boolean', required: false, description: 'Whether the tile takes no press and draws the disabled cells.' },
    href: { type: 'string', required: false, description: 'A link target; without it the tile acts as a button.' },
    icon: { type: 'string', required: false, description: 'A glyph name drawn in the bottom end corner.' },
    onPress: { type: 'function', required: false, description: 'Called on press when the tile has no href.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tile.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tile_padding', 'control.tile_min_height', 'control.tile_min_width',
    'control.link_focus_width', 'control.tile_icon_size', 'control.tile_icon_inset',
    'color.tile_container', 'color.tile_container_hover', 'color.tile_label', 'color.tile_label_disabled',
    'color.link_focus_ring', 'color.link_label_active', 'color.tile_icon', 'type.tile', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
