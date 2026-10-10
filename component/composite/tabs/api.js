// Info: Tabs public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Tabs',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The tabs: `{ label, disabled }` entries, in order.' },
    selectedIndex: { type: 'number', required: false, description: 'Controlled selection. Absent: the bar keeps its own, starting from `defaultSelectedIndex`.' },
    defaultSelectedIndex: { type: 'number', required: false, description: 'Initially selected while uncontrolled; default 0.' },
    onChange: { type: 'function', required: false, description: 'Called with `{ selectedIndex }` when the selection changes.' },
    variant: { type: 'string', required: false, description: '`line` (default) draws the track underline; `contained` draws the tab_contained cells: filled tabs with separators and a top indicator.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the tab list.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tab list.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['line', 'contained']),
  tokens: Object.freeze([
    'control.tab_height', 'control.tab_contained_height', 'control.tab_contained_padding_block', 'control.tab_item_gap',
    'control.tab_padding_inline', 'control.tab_divider_width',
    'control.tab_track_width', 'control.tab_indicator_width', 'control.tab_indicator_radius',
    'control.tab_focus_width', 'control.tab_focus_offset', 'border.width_01',
    'color.tab_container', 'color.tab_divider', 'color.tab_focus_ring',
    'color.tab_track', 'color.tab_track_hover', 'color.tab_track_disabled',
    'color.tab_indicator',
    'color.tab_label', 'color.tab_label_hover', 'color.tab_label_selected', 'color.tab_label_selected_hover', 'color.tab_label_disabled',
    'color.tab_layer_hover', 'color.tab_layer_active', 'color.tab_layer_selected_hover', 'color.tab_layer_selected_active',
    'color.tab_contained_container', 'color.tab_contained_container_hover', 'color.tab_contained_container_selected', 'color.tab_contained_separator',
    'type.tab_label', 'type.tab_label_selected', 'font.family.sans',
    'anatomy.tab_indicator', 'feedback.focus_trigger',
    'motion.duration_fast_01', 'motion.easing_standard_productive'
  ]),
  colors: Object.freeze([])
});
