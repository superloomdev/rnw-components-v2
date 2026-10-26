// Info: TabListVertical public API, as data.

export default Object.freeze({
  name: 'TabListVertical',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The tabs: `{ label, disabled? }` entries, in order.' },
    selectedIndex: { type: 'number', required: false, description: 'Controlled selection.' },
    defaultSelectedIndex: { type: 'number', required: false, description: 'Initially selected while uncontrolled; default 0.' },
    onChange: { type: 'function', required: false, description: 'Called with `{ selectedIndex }` when the selection changes.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the tab list.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the list.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tab_vertical_height', 'control.tab_vertical_indicator_width', 'control.tab_vertical_label_lines', 'control.tab_padding_inline',
    'color.tab_vertical_container', 'color.tab_vertical_item', 'color.tab_vertical_item_hover',
    'color.tab_vertical_track', 'color.tab_vertical_track_hover', 'color.tab_vertical_divider',
    'color.tab_indicator', 'color.tab_label', 'color.tab_label_selected', 'color.tab_label_disabled',
    'type.tab_label', 'type.tab_label_selected', 'feedback.focus_trigger'
  ]),
  colors: Object.freeze([])
});
