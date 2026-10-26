// Info: TabList public API, as data.

export default Object.freeze({
  name: 'TabList',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The tabs: `{ label, disabled?, icon?, secondaryLabel?, iconOnly? }` entries, in order.' },
    selectedIndex: { type: 'number', required: false, description: 'Controlled selection. Absent: the list keeps its own, starting from `defaultSelectedIndex`.' },
    defaultSelectedIndex: { type: 'number', required: false, description: 'Initially selected while uncontrolled; default 0.' },
    onChange: { type: 'function', required: false, description: 'Called with `{ selectedIndex }` when the selection changes.' },
    variant: { type: 'string', required: false, description: '`line` (default) draws the track underline; `contained` draws the contained cells.' },
    activation: { type: 'string', required: false, description: '`automatic` (default) selects on arrow moves; `manual` moves the active tab and selects on Enter or Space.' },
    dismissable: { type: 'boolean', required: false, description: 'Each tab draws a close button; Delete closes the active tab.' },
    onTabCloseRequest: { type: 'function', required: false, description: 'Called with the index when a tab asks to close.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the tab list.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tab list.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['line', 'contained']),
  tokens: Object.freeze([
    'control.tab_height', 'control.tab_contained_height', 'control.tab_contained_padding_block', 'control.tab_contained_tall_height',
    'control.tab_item_gap', 'control.tab_padding_inline', 'control.tab_divider_width',
    'control.tab_overflow_button_width', 'control.tab_contained_overflow_button_width', 'control.tab_overflow_fade_width',
    'color.tab_container', 'color.tab_divider',
    'color.tab_overflow_button', 'color.tab_overflow_button_hover', 'color.tab_overflow_button_active',
    'color.tab_contained_overflow_button', 'color.tab_contained_overflow_button_hover', 'color.tab_contained_overflow_button_active',
    'color.tab_overflow_icon',
    'anatomy.tab_overflow', 'anatomy.tab_indicator'
  ]),
  colors: Object.freeze([])
});
