// Info: ComboButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ComboButton',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The primary action\'s label. It is also the action\'s accessible name.' },
    items: { type: 'array', required: true, description: 'The menu\'s entries, as Menu\'s `items`: `{ label, icon, disabled, danger, selected, shortcut }` or `{ divider: true }`.' },
    size: { type: 'string', required: false, description: 'One of `variants`: `xs`, `sm`, `md`, `lg`. Default `lg`; `xs` draws the small trigger.' },
    disabled: { type: 'boolean', required: false, description: 'Disables both seats and announces them as disabled.' },
    menuAlignment: { type: 'string', required: false, description: '`bottom` (default), `top`, `bottom-start`, `bottom-end`, `top-start` or `top-end`: the container edge the menu opens against, and the edge `-start`/`-end` aligns to. The plain alignments draw the menu at the container\'s width.' },
    onPress: { type: 'function', required: false, description: 'Called when the primary action is pressed.' },
    onChange: { type: 'function', required: false, description: 'Called with the chosen menu item\'s data.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the menu the trigger opens.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the container.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['xs', 'sm', 'md', 'lg']),
  tokens: Object.freeze([
    'control.combo_button_min_width', 'control.combo_button_max_width', 'border.width_01',
    'control.icon_button_size', 'size.size_small', 'size.size_medium',
    'motion.duration_fast_02', 'motion.easing_standard_productive'
  ]),
  colors: Object.freeze([])
});
