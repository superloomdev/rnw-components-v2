// Info: ContentSwitcher public API, as data.

export default Object.freeze({
  name: 'ContentSwitcher',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The segments: `{ text?, icon?, label?, disabled? }`; an item with `icon` and no `text` renders `IconSwitch`.' },
    selectedIndex: { type: 'number', required: false, description: 'Controlled selection.' },
    defaultSelectedIndex: { type: 'number', required: false, description: 'Initially selected while uncontrolled; default 0.' },
    onChange: { type: 'function', required: false, description: 'Called with `{ selectedIndex }` when the selection changes.' },
    size: { type: 'string', required: false, description: '`sm` | `md` (default) | `lg`.' },
    lowContrast: { type: 'boolean', required: false, description: 'Draws the low-contrast cells.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the switcher.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the switcher.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['feedback.press',
    'control.content_switcher_radius', 'control.content_switcher_outline_width',
    'size.size_small', 'size.size_medium', 'size.size_large',
    'color.content_switcher_outline', 'color.content_switcher_outline_disabled',
    'color.content_switcher_low_contrast_container', 'color.content_switcher_low_contrast_outline',
    'anatomy.content_switcher_separator', 'anatomy.content_switcher_selected_mark'
  ]),
  colors: Object.freeze([])
});
