// Info: Menu public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Menu',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The menu\'s entries: `{ label, icon, disabled, danger, selected, shortcut }` for an item, `{ divider: true }` for a separator.' },
    open: { type: 'boolean', required: true, description: 'Whether the menu is open; the caller owns it and closes through `onClose`.' },
    x: { type: 'number', required: false, description: 'The viewport x coordinate (or `[min, max]` range) the menu opens at. Default 0.' },
    y: { type: 'number', required: false, description: 'The viewport y coordinate (or `[min, max]` range) the menu opens at. Default 0.' },
    menuAlignment: { type: 'string', required: false, description: '`bottom` (default) or `top`: the edge of `y` the menu grows from.' },
    onClose: { type: 'function', required: false, description: 'Called on Escape, Tab, outside press or after an item is chosen.' },
    onChange: { type: 'function', required: false, description: 'Called with the chosen item\'s data.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the menu.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the menu.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.menu_item_height', 'control.menu_padding_block', 'control.menu_icon_size', 'control.menu_divider_width',
    'control.list_item_padding_inline', 'control.field_icon_gap', 'control.list_radius',
    'color.list_container', 'shadow.list', 'stacking.dropdown',
    'color.list_item_container_hover', 'color.list_item_container_active',
    'color.list_item_container_selected', 'color.list_item_container_selected_hover',
    'color.list_item_label', 'color.list_item_label_hover', 'color.list_item_label_selected', 'color.list_item_label_disabled',
    'color.menu_divider', 'color.menu_item_danger_container_hover', 'color.menu_item_danger_label', 'color.menu_item_danger_label_hover',
    'color.icon_secondary', 'color.icon_disabled',
    'type.list_item', 'font.family.sans',
    'anatomy.list_selected_mark', 'anatomy.menu_icon_seat', 'motion.duration_fast_01', 'motion.easing_standard_productive',
    'size.icon_01'
  ]),
  colors: Object.freeze([])
});
