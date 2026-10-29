// Info: Button public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

// Kinds, each drawn from its own role cells in the theme
const KINDS = Object.freeze(['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger_tertiary', 'danger_ghost', 'tonal', 'elevated']);

export default Object.freeze({
  name: 'Button',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The label. It is also the accessible name unless `accessibilityLabel` is given.' },
    kind: { type: 'string', required: false, description: 'One of `kinds`. Default `primary`.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. Default `lg`.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn at the trailing edge; decorative, the label names the button.' },
    disabled: { type: 'boolean', required: false, description: 'Disables press, hover and focus feedback and announces the button as disabled.' },
    selected: { type: 'boolean', required: false, description: 'Draws the selected fill and label of the kind while true, for a button that toggles.' },
    fill: { type: 'boolean', required: false, description: 'Stretches the button to fill its seat instead of sizing to its height cell (the dialog\'s stretched actions).' },
    onPress: { type: 'function', required: false, description: 'Called on activation (press, Enter, Space).' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when the label alone does not say what the button does.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable root.' }
  }),
  composition: Object.freeze({
    iconRotation: { type: 'number', required: false, description: 'Composition prop: degrees the trailing icon turns by, transitioning on the web (the menu button\'s chevron while open). Default 0.' },
    minWidth: { type: 'number', required: false, description: 'Composition prop: overrides the computed minimum width (the combo button\'s action).' },
    maxWidth: { type: 'number', required: false, description: 'Composition prop: caps the computed width (the combo button\'s action).' },
    paddingStart: { type: 'number', required: false, description: 'Composition prop: overrides the computed start padding (the fluid set\'s ghost items).' },
    paddingTop: { type: 'number', required: false, description: 'Composition prop: overrides the top padding (the dialog actions row reads it from its cells).' },
    paddingBottom: { type: 'number', required: false, description: 'Composition prop: overrides the bottom padding (the dialog actions row reads it from its cells).' },
    buttonRef: { type: 'object', required: false, description: 'Composition prop: a ref forwarded to the root pressable (a dialog\'s initial focus).' },
    fillLeaf: { type: 'string', required: false, description: 'Composition prop: the color leaf the face draws at rest (the notification action); default the kind\'s container cell.' },
    fillHoverLeaf: { type: 'string', required: false, description: 'Composition prop: the color leaf the face draws on hover (the notification action); default the kind\'s hover cell.' },
    fillActiveLeaf: { type: 'string', required: false, description: 'Composition prop: the color leaf the face draws on press (the notification action); default the kind\'s active cell.' },
    labelLeaf: { type: 'string', required: false, description: 'Composition prop: the color leaf the label draws at rest (the notification action); default the kind\'s label cell.' },
    labelHoverLeaf: { type: 'string', required: false, description: 'Composition prop: the color leaf the label draws on hover or press (the notification action); default the label cell\'s phase.' },
    borderLeaf: { type: 'string', required: false, description: 'Composition prop: the color leaf the border draws (the notification action); default the kind\'s border cell.' },
    focusRingLeaf: { type: 'string', required: false, description: 'Composition prop: a color leaf the focus ring reads instead of the kind ring leaf - the inverse surface\'s `focus_ring_inverse`.' },
    onMouseDown: { type: 'function', required: false, description: 'Composition prop: a mousedown handler forwarded to the pressable root (the menu button\'s press, which prevents the default so an open menu keeps its focus).' }
  }),
  kinds: KINDS,
  variants: Object.freeze(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  tokens: Object.freeze([
    'control.button_height', 'control.button_radius', 'control.button_padding_start', 'control.button_padding_end', 'control.button_icon_size',
    'control.button_ghost_padding_start', 'control.button_ghost_padding_end', 'control.button_min_width',
    'control.button_focus_width', 'control.button_focus_offset', 'control.button_focus_gap_width',
    'size.size_xsmall', 'size.size_small', 'size.size_medium', 'size.size_xlarge', 'size.size_2xlarge',
    'border.width_01', 'spacing.spacing_05', 'spacing.spacing_03',
    'type.button_label', 'font.family.sans',
    'color.button_focus_ring', 'color.button_focus_gap', 'feedback.focus_trigger',
    'feedback.press', 'anatomy.button_label', 'state.hover_opacity', 'state.pressed_opacity',
    'motion.duration_fast_01', 'motion.duration_fast_02', 'motion.easing_standard_productive'
  ].concat(KINDS.flatMap(function (kind) {
    // Every kind's role cells: fill and label per state, border per state, elevation per state
    return ['', '_hover', '_active', '_focus', '_disabled', '_selected'].flatMap(function (state) {
      return ['color.button_' + kind + '_container' + state, 'color.button_' + kind + '_label' + state];
    }).concat(['', '_hover', '_active', '_disabled'].flatMap(function (state) {
      return ['color.button_' + kind + '_border' + state, 'shadow.button_' + kind + state];
    }));
  }))),
  colors: Object.freeze([])
});
