// Info: preview__ChatButton public API, as data. The docs generator and
// the accessibility tests read this; the component implements exactly this
// and nothing more.

export default Object.freeze({
  name: 'preview__ChatButton',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The label. It is also the accessible name unless `accessibilityLabel` is given.' },
    kind: { type: 'string', required: false, description: 'One of `kinds`. Default `primary`; `isQuickAction` overrides it.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `sm`, `md`, `lg`. Default `lg`; `isQuickAction` draws `sm`.' },
    isQuickAction: { type: 'boolean', required: false, description: 'Draws the quick-action button: the `quick_action` kind in the small size.' },
    isSelected: { type: 'boolean', required: false, description: 'Draws the selected fill and label while true.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn at the trailing edge; decorative, the label names the button.' },
    disabled: { type: 'boolean', required: false, description: 'Disables press, hover and focus feedback and announces the button as disabled.' },
    onPress: { type: 'function', required: false, description: 'Called on activation (press, Enter, Space).' },
    accessibilityLabel: { type: 'string', required: false, description: 'Accessible name when the label alone does not say what the button does.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the pressable root.' }
  }),
  kinds: Object.freeze(['primary', 'secondary', 'tertiary', 'ghost', 'danger', 'quick_action']),
  variants: Object.freeze(['sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.button_padding_start', 'control.button_ghost_padding_start', 'border.width_01'
  ]),
  colors: Object.freeze([])
});
