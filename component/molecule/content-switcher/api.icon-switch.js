// Info: IconSwitch public API, as data.

export default Object.freeze({
  name: 'IconSwitch',
  props: Object.freeze({
    icon: { type: 'string', required: true, description: 'The icon name.' },
    label: { type: 'string', required: true, description: 'The accessible name, also drawn as the tooltip.' },
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
    separatorFull: { type: 'boolean', description: 'The separator runs the full height.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['feedback.press',
    'control.content_switcher_padding_inline', 'control.content_switcher_padding_inline_large', 'control.content_switcher_icon_size', 'control.content_switcher_icon_size_large',
    'control.content_switcher_separator_height', 'control.content_switcher_radius', 'size.size_medium', 'control.content_switcher_outline_width', 'control.content_switcher_focus_width',
    'color.content_switcher_icon_only', 'color.content_switcher_icon_hover', 'color.content_switcher_icon_selected', 'color.content_switcher_icon_disabled',
    'color.content_switcher_container_hover', 'color.content_switcher_container_selected', 'color.content_switcher_container_selected_disabled',
    'color.content_switcher_separator', 'color.content_switcher_separator_disabled',
    'color.content_switcher_focus', 'color.content_switcher_focus_inset', 'color.content_switcher_low_contrast_icon_selected', 'color.content_switcher_low_contrast_container_active', 'color.content_switcher_low_contrast_container_selected',
    'feedback.focus_trigger'
  ]),
  colors: Object.freeze([])
});
