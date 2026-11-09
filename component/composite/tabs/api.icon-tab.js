// Info: IconTab public API, as data.

export default Object.freeze({
  name: 'IconTab',
  props: Object.freeze({
    icon: { type: 'string', required: true, description: 'The icon name.' },
    label: { type: 'string', required: true, description: 'The accessible name, also drawn as the tooltip.' },
    disabled: { type: 'boolean', required: false, description: 'Out of the order and inert.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tab.' }
  }),
  composition: Object.freeze({
    selected: { type: 'boolean', description: 'Drawn selected.' },
    active: { type: 'boolean', description: 'Carries the roving tab index.' },
    onSelect: { type: 'function', description: 'Selects this tab.' },
    listHeight: { type: 'number', description: 'The list\'s height; the tab is that square.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tab_height', 'control.tab_icon_size', 'control.tab_item_gap', 'control.tab_track_width',
    'color.tab_track', 'color.tab_track_hover', 'color.tab_track_disabled', 'color.tab_indicator',
    'color.tab_label', 'color.tab_label_hover', 'color.tab_label_selected', 'color.tab_label_disabled',
    'feedback.focus_trigger'
  ]),
  colors: Object.freeze([])
});
