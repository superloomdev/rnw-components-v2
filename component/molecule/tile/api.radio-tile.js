// Info: RadioTile public API, as data.

export default Object.freeze({
  name: 'RadioTile',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The content the tile groups.' },
    checked: { type: 'boolean', required: false, description: 'The checked state for the controlled form; a group injects it.' },
    defaultChecked: { type: 'boolean', required: false, description: 'The initial checked state for the uncontrolled form.' },
    disabled: { type: 'boolean', required: false, description: 'Whether the tile takes no press and draws the disabled cells.' },
    name: { type: 'string', required: false, description: 'The group name the option answers to; a group injects it.' },
    value: { type: 'string', required: false, description: 'The value this option contributes when selected.' },
    onChange: { type: 'function', required: false, description: 'Called with the new checked state on selection; a group injects it.' },
    onGroupFocus: { type: 'function', required: false, description: 'Called on focus; a group injects it to track the tab stop.' },
    focusable: { type: 'boolean', required: false, description: 'Whether the tile holds the group\'s tab stop; a group injects it.' },
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
