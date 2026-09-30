// Info: View public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'View',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'Content laid out inside the box.' },
    background: { type: 'string', required: false, description: 'Color token leaf under `color.` for the fill. Absent draws no fill.' },
    borderColor: { type: 'string', required: false, description: 'Color token leaf under `color.` for the border. Requires `borderWidth`.' },
    borderWidth: { type: 'string', required: false, description: 'Border width leaf under `border.` (`width_01` .. `width_04`). Absent draws no border.' },
    radius: { type: 'string', required: false, description: 'Corner radius leaf under `shape.` (`radius_00` .. `radius_max`).' },
    padding: { type: 'string', required: false, description: 'Padding leaf under `spacing.` applied on every side.' },
    gap: { type: 'string', required: false, description: 'Gap leaf under `spacing.` between children.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the box.' },
    style: { type: 'object', required: false, description: 'Style merged last (layout only; values the theme owns are props).' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([
    'background', 'layer_01', 'layer_02', 'layer_03', 'layer_accent_01', 'layer_accent_02', 'layer_accent_03',
    'field_01', 'field_02', 'field_03', 'background_inverse', 'background_brand',
    'border_subtle_00', 'border_subtle_01', 'border_subtle_02', 'border_subtle_03',
    'border_strong_01', 'border_strong_02', 'border_strong_03', 'border_interactive', 'border_inverse', 'border_disabled',
    'border_tile_01', 'border_tile_02', 'border_tile_03'
  ])
});
