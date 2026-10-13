// Info: PrimaryButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more. The props are Button's: the wrapper passes every one
// through, and a `kind` prop wins over the `primary` default.

export default Object.freeze({
  name: 'PrimaryButton',
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
    labelAlign: { type: 'string', required: false, description: 'Composition prop: `start` holds the label at the start padding when the button is wider than its content (the combo button\'s action); any other value centers it.' },
    minWidth: { type: 'number', required: false, description: 'Composition prop: overrides the computed minimum width (the combo button\'s action).' },
    maxWidth: { type: 'number', required: false, description: 'Composition prop: caps the computed width (the combo button\'s action).' },
    paddingStart: { type: 'number', required: false, description: 'Composition prop: overrides the computed start padding (the fluid set\'s ghost items).' }
  }),
  kinds: Object.freeze(['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'danger_tertiary', 'danger_ghost', 'tonal', 'elevated']),
  variants: Object.freeze(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
