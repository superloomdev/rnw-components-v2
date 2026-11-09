// Info: SelectableTile public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SelectableTile',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The content the tile groups.' },
    defaultSelected: { type: 'boolean', required: false, description: 'The initial checked state for the uncontrolled form.' },
    disabled: { type: 'boolean', required: false, description: 'Whether the tile takes no press and draws the disabled cells.' },
    onChange: { type: 'function', required: false, description: 'Called with the new checked state on toggle.' },
    selected: { type: 'boolean', required: false, description: 'The checked state for the controlled form.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tile.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tile_padding', 'control.tile_min_height', 'control.tile_min_width',
    'control.tile_focus_width', 'control.tile_border_width', 'control.tile_mark_space',
    'control.tile_mark_size', 'control.tile_mark_inset',
    'color.tile_container', 'color.tile_container_hover', 'color.tile_label', 'color.tile_label_disabled',
    'color.tile_focus', 'color.tile_mark', 'color.tile_mark_selected', 'color.tile_mark_disabled',
    'color.tile_border_selected', 'color.tile_border_selected_disabled', 'type.tile', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
