// Info: TileGroup public API, as data.

export default Object.freeze({
  name: 'TileGroup',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The options: `{ value, children, disabled }` entries, one RadioTile each.' },
    defaultSelected: { type: 'string', required: false, description: 'The initially selected value for the uncontrolled form.' },
    disabled: { type: 'boolean', required: false, description: 'Whether every tile in the group is disabled.' },
    legend: { type: 'string', required: false, description: 'The label that names the group.' },
    name: { type: 'string', required: false, description: 'The name every tile answers to.' },
    onChange: { type: 'function', required: false, description: 'Called with the new selected value.' },
    valueSelected: { type: 'string', required: false, description: 'The selected value for the controlled form.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the group.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'spacing.spacing_03', 'color.field_label', 'type.field_label', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
