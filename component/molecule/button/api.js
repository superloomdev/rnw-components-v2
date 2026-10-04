// Info: Button public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Button',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The label. It is also the accessible name unless `accessibilityLabel` is given.' },
    kind: { type: 'string', required: false, description: 'One of `kinds`. Default `primary`.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Default `lg`.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn at the trailing edge; decorative, the label names the button.' },
    disabled: { type: 'boolean', required: false, description: 'Disables press, hover and focus feedback and announces the button as disabled.' },
    selected: { type: 'boolean', required: false, description: 'Draws the pressed fill while true, for a button that toggles.' },
    onPress: { type: 'function', required: false, description: 'Called on activation (press, Enter, Space).' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when the label alone does not say what the button does.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable root.' }
  }),
  kinds: Object.freeze(['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger_tertiary', 'danger_ghost', 'tonal', 'elevated']),
  variants: Object.freeze(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  tokens: Object.freeze([
    'control.button_height', 'control.button_radius', 'control.button_padding_start', 'control.button_padding_end', 'control.button_icon_size',
    'size.size_xsmall', 'size.size_small', 'size.size_medium', 'size.size_xlarge', 'size.size_2xlarge',
    'border.width_01', 'spacing.spacing_05', 'spacing.spacing_03',
    'type.button_label', 'font.family.sans',
    'color.button_primary', 'color.button_primary_hover', 'color.button_primary_active', 'color.text_on_color',
    'color.button_disabled', 'color.text_on_color_disabled', 'color.text_disabled', 'color.border_disabled',
    'feedback.press', 'state.hover_opacity', 'state.pressed_opacity', 'state.focus_opacity',
    'motion.duration_fast_01', 'motion.easing_standard_productive', 'shadow.level_01'
  ]),
  colors: Object.freeze([
    'button_secondary', 'button_secondary_hover', 'button_secondary_active',
    'button_tertiary', 'button_tertiary_hover', 'button_tertiary_active', 'text_inverse',
    'background_hover', 'background_active', 'link_primary',
    'button_danger_primary', 'button_danger_secondary', 'button_danger_hover', 'button_danger_active',
    'button_tonal', 'button_tonal_hover', 'button_tonal_active', 'text_on_button_tonal',
    'button_elevated', 'button_elevated_hover', 'button_elevated_active', 'interactive'
  ])
});
