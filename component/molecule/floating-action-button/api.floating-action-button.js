// Info: FloatingActionButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'FloatingActionButton',
  props: Object.freeze({
    icon: { type: 'string', required: true, description: 'Semantic icon name from the theme\'s icon set; it draws the button\'s glyph.' },
    label: { type: 'string', required: false, description: 'The extended form\'s text. With a label the button is always the medium size.' },
    kind: { type: 'string', required: false, description: 'One of `kinds`: `surface`, `primary`, `secondary`, `tertiary`. Default `surface`.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `md`. Ignored with a label.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name; required when there is no label.' },
    onPress: { type: 'function', required: false, description: 'Called when the button activates.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the button.' }
  }),
  kinds: Object.freeze(['surface', 'primary', 'secondary', 'tertiary']),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'color.fab_surface_container', 'color.fab_surface_icon',
    'color.fab_primary_container', 'color.fab_primary_icon',
    'color.fab_secondary_container', 'color.fab_secondary_icon',
    'color.fab_tertiary_container', 'color.fab_tertiary_icon',
    'color.fab_surface_layer_hover', 'color.fab_surface_layer_active',
    'color.fab_primary_layer_hover', 'color.fab_primary_layer_active',
    'color.fab_secondary_layer_hover', 'color.fab_secondary_layer_active',
    'color.fab_tertiary_layer_hover', 'color.fab_tertiary_layer_active',
    'control.fab_size', 'control.fab_size_small', 'control.fab_size_large',
    'control.fab_icon_size', 'control.fab_icon_size_large',
    'control.fab_radius', 'control.fab_radius_small', 'control.fab_radius_large',
    'control.fab_extended_padding', 'control.fab_extended_padding_end', 'control.fab_label_gap',
    'control.target_min', 'type.fab_label', 'shadow.fab', 'shadow.fab_hover',
    'motion.duration_fast_02', 'motion.easing_standard_productive',
    'color.button_focus_ring', 'control.button_focus_width', 'control.button_focus_offset', 'control.button_focus_gap_width'
  ]),
  colors: Object.freeze([])
});
