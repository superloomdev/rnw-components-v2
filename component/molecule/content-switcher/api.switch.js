// Info: Switch public API, as data.

export default Object.freeze({
  name: 'Switch',
  props: Object.freeze({
    text: { type: 'string', required: true, description: 'The segment\'s label.' },
    disabled: { type: 'boolean', required: false, description: 'Inert and out of the order.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the segment.' }
  }),
  composition: Object.freeze({
    selected: { type: 'boolean', description: 'Drawn selected (the slab).' },
    active: { type: 'boolean', description: 'Carries the roving tab index.' },
    index: { type: 'number', description: 'The segment\'s index.' },
    onSelect: { type: 'function', description: 'Selects this segment.' },
    size: { type: 'string', description: '`sm` | `md` | `lg`.' },
    lowContrast: { type: 'boolean', description: 'The low-contrast cells.' },
    separator: { type: 'boolean', description: 'Draws the leading separator.' },
    separatorFull: { type: 'boolean', description: 'The separator runs the full height.' },
    selectedMark: { type: 'boolean', description: 'Draws the selected-indicator mark.' },
    icon: { type: 'string', description: 'An icon beside the text.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['feedback.press',
    'control.content_switcher_padding_block', 'control.content_switcher_padding_inline',
    'control.content_switcher_icon_size', 'control.content_switcher_icon_size_large', 'control.content_switcher_icon_gap',
    'control.content_switcher_separator_height', 'control.content_switcher_radius', 'size.size_medium', 'control.content_switcher_outline_width', 'control.content_switcher_focus_width',
    'color.content_switcher_label', 'color.content_switcher_label_hover', 'color.content_switcher_label_selected', 'color.content_switcher_label_disabled',
    'color.content_switcher_container_hover', 'color.content_switcher_container_selected', 'color.content_switcher_container_selected_disabled',
    'color.content_switcher_separator', 'color.content_switcher_separator_disabled',
    'color.content_switcher_icon', 'color.content_switcher_icon_selected', 'color.content_switcher_icon_disabled',
    'color.content_switcher_low_contrast_label_selected', 'color.content_switcher_low_contrast_container_selected', 'color.content_switcher_low_contrast_container_hover',
    'color.content_switcher_focus', 'color.content_switcher_focus_inset',
    'type.content_switcher_label', 'type.content_switcher_label_selected_low_contrast', 'font.family.sans',
    'feedback.focus_trigger', 'motion.duration_fast_01'
  ]),
  colors: Object.freeze([])
});
