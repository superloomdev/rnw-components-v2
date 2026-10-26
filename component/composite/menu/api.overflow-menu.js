// Info: OverflowMenu public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this
// and nothing more.

export default Object.freeze({
  name: 'OverflowMenu',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The panel\'s options: `{ label, disabled, danger, divider, href, onPress }` per row.' },
    size: { type: 'string', required: false, description: 'One of `xs`, `sm`, `md`, `lg`: the trigger square\'s side off the size scale. Default `md`.' },
    open: { type: 'boolean', required: false, description: 'Whether the panel is open; a given value seeds it and re-syncs on change, otherwise the trigger toggles it.' },
    onOpen: { type: 'function', required: false, description: 'Called when the panel opens (the trigger press).' },
    flipped: { type: 'boolean', required: false, description: 'Align the panel\'s end edge to the trigger\'s instead of the start edge. Default false.' },
    direction: { type: 'string', required: false, description: '`bottom` (default) or `top`: the trigger edge the panel opens from.' },
    iconDescription: { type: 'string', required: false, description: 'The trigger\'s accessible name and its tooltip label. Default `Options`.' },
    align: { type: 'string', required: false, description: 'The trigger tooltip\'s alignment, forwarded to the icon button.' },
    onChange: { type: 'function', required: false, description: 'Called with the chosen option\'s data.' },
    onClose: { type: 'function', required: false, description: 'Called when the panel closes (Escape, Tab, outside press, focus leaving or after an option is chosen).' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the panel.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the container.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.overflow_menu_width', 'control.overflow_menu_connector_size', 'control.overflow_menu_option_max_width',
    'control.option_height', 'size.size_large', 'control.list_item_padding_inline', 'control.menu_divider_width',
    'control.menu_item_danger_focus_inset_width',
    'color.overflow_menu_icon', 'color.overflow_menu_trigger_hover', 'color.overflow_menu_trigger_open',
    'color.list_container', 'shadow.list', 'stacking.dropdown',
    'color.list_item_container_hover', 'color.list_item_label', 'color.list_item_label_hover', 'color.list_item_label_disabled',
    'color.menu_divider', 'color.menu_item_danger_container_hover', 'color.menu_item_danger_label', 'color.menu_item_danger_label_hover',
    'color.menu_item_danger_focus_inset',
    'type.list_item', 'size.icon_01',
    'anatomy.overflow_menu_connector',
    'size.size_xsmall', 'size.size_small', 'size.size_medium', 'control.icon_button_size'
  ]),
  colors: Object.freeze([])
});
