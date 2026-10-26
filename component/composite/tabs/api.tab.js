// Info: Tab public API, as data.

export default Object.freeze({
  name: 'Tab',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The tab\'s text.' },
    disabled: { type: 'boolean', required: false, description: 'Out of the order and inert.' },
    icon: { type: 'string', required: false, description: 'An icon name; leading when the tab is dismissable, trailing otherwise.' },
    secondaryLabel: { type: 'string', required: false, description: 'A second line, drawn only on the tall contained list.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tab.' }
  }),
  composition: Object.freeze({
    selected: { type: 'boolean', description: 'Drawn selected.' },
    index: { type: 'number', description: 'The tab\'s index in the list.' },
    variant: { type: 'string', description: '`line` or `contained`.' },
    tall: { type: 'boolean', description: 'The tall contained list.' },
    active: { type: 'boolean', description: 'Carries the roving tab index.' },
    dismissable: { type: 'boolean', description: 'Draws the close button.' },
    onSelect: { type: 'function', description: 'Selects this tab.' },
    onClose: { type: 'function', description: 'Called with the index on Delete or the close button.' },
    rovingProps: { type: 'object', description: 'Focus/keyboard props from the list\'s roving behavior.' },
    metrics: { type: 'object', description: 'The list\'s resolved spec numbers.' },
    first: { type: 'boolean', description: 'The first tab (no leading separator).' },
    afterSelected: { type: 'boolean', description: 'Follows the selected tab (no leading separator).' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tab_height', 'control.tab_contained_height', 'control.tab_contained_padding_block', 'control.tab_item_gap',
    'control.tab_padding_inline', 'control.tab_dismiss_padding_end', 'control.tab_contained_dismiss_padding_end',
    'control.tab_close_size', 'control.tab_close_icon_size', 'control.tab_icon_size', 'control.tab_icon_gap',
    'control.tab_contained_tall_height',
    'control.tab_track_width', 'control.tab_indicator_width', 'control.tab_indicator_radius',
    'control.tab_focus_width', 'control.tab_focus_offset', 'border.width_01',
    'color.tab_focus_ring',
    'color.tab_track', 'color.tab_track_hover', 'color.tab_track_disabled', 'color.tab_indicator',
    'color.tab_label', 'color.tab_label_hover', 'color.tab_label_selected', 'color.tab_label_selected_hover', 'color.tab_label_disabled',
    'color.tab_layer_hover', 'color.tab_layer_active', 'color.tab_layer_selected_hover', 'color.tab_layer_selected_active',
    'color.tab_contained_container', 'color.tab_contained_container_hover', 'color.tab_contained_container_selected', 'color.tab_contained_separator',
    'color.tab_close_icon', 'color.tab_close_icon_selected', 'color.tab_close_icon_disabled',
    'type.tab_label', 'type.tab_label_selected', 'type.tab_secondary_label', 'font.family.sans',
    'anatomy.tab_indicator', 'feedback.focus_trigger'
  ]),
  colors: Object.freeze([])
});
