// Info: ExpandableTile public API, as data.

export default Object.freeze({
  name: 'ExpandableTile',
  props: Object.freeze({
    below: { type: 'node', required: false, description: 'The content the fold reveals.' },
    children: { type: 'node', required: false, description: 'The content always visible above the fold.' },
    defaultExpanded: { type: 'boolean', required: false, description: 'The initial expanded state for the uncontrolled form.' },
    disabled: { type: 'boolean', required: false, description: 'Whether the tile takes no press and draws the disabled cells.' },
    expanded: { type: 'boolean', required: false, description: 'The expanded state for the controlled form.' },
    interactive: { type: 'boolean', required: false, description: 'Whether the content holds its own controls; then the chevron alone toggles.' },
    onToggle: { type: 'function', required: false, description: 'Called with the new expanded state on toggle.' },
    tileMaxHeight: { type: 'number', required: false, description: 'The collapsed height in points, overriding the measured fold.' },
    tilePadding: { type: 'number', required: false, description: 'The collapsed padding allowance, overriding the theme padding.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tile.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tile_padding', 'control.tile_min_height', 'control.tile_min_width',
    'control.tile_focus_width', 'control.tile_chevron_seat', 'size.icon_01',
    'color.tile_container', 'color.tile_container_hover', 'color.tile_label',
    'color.tile_focus', 'color.tile_chevron', 'type.tile', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
