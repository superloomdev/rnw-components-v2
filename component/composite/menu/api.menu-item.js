// Info: MenuItem public API, as data. Composed inside Menu it is one
// entry: an action with an optional icon and shortcut, a danger kind, or
// a submenu of further items. The docs generator and the accessibility
// tests read this.

export default Object.freeze({
  name: 'MenuItem',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The item\'s text.' },
    icon: { type: 'string', required: false, description: 'Semantic icon name drawn in the icon seat.' },
    shortcut: { type: 'string', required: false, description: 'The shortcut run drawn at the item\'s end.' },
    disabled: { type: 'boolean', required: false, description: 'Draws the disabled cells and skips the roving focus. Default false.' },
    danger: { type: 'boolean', required: false, description: 'The destructive kind: the danger cells and the focused inset ring. Default false.' },
    items: { type: 'array', required: false, description: 'Sub-items: the item opens a submenu of them on hover.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the item.' }
  }),
  composition: Object.freeze({
    registerItem: { type: 'function', required: false, description: 'Composition prop: registers the item with the parent\'s roving collection.' },
    onChoose: { type: 'function', required: false, description: 'Composition prop: the parent\'s choice handler (fires `onChange` then `onClose` on a leaf).' },
    seats: { type: 'object', required: false, description: 'Composition prop: the parent\'s computed seat metrics (mark/icon place and sizes).' },
    list: { type: 'object', required: false, description: 'Composition prop: the parent\'s shared list presentation.' },
    selectable: { type: 'boolean', required: false, description: 'Composition prop: reserve the mark seat for every item of this menu.' },
    icons: { type: 'boolean', required: false, description: 'Composition prop: the menu has any icons.' },
    iconsShared: { type: 'boolean', required: false, description: 'Composition prop: `anatomy.menu_icon_seat` is `shared` - reserve the seat for every item.' },
    first: { type: 'boolean', required: false, description: 'Composition prop: the first item draws no top inset.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.list_item_label', 'color.list_item_label_hover', 'color.list_item_label_disabled', 'color.list_item_label_selected',
    'color.list_item_container_hover', 'color.list_item_container_active', 'color.list_item_container_selected', 'color.list_item_container_selected_hover',
    'color.menu_item_danger_container_hover', 'color.menu_item_danger_label', 'color.menu_item_danger_label_hover', 'color.menu_item_danger_focus_inset',
    'control.menu_item_danger_focus_inset_width',
    'color.menu_item_shortcut', 'color.menu_item_shortcut_hover', 'type.menu_item_shortcut',
    'color.menu_item_icon', 'color.menu_item_icon_hover', 'color.menu_item_icon_disabled',
    'control.menu_item_gap', 'control.menu_icon_size', 'control.list_item_padding_inline', 'control.menu_item_height',
    'size.icon_01', 'icon.caret_right', 'type.list_item',
    'control.menu_submenu_offset_end', 'control.menu_submenu_offset_start', 'control.menu_submenu_offset_block'
  ]),
  colors: Object.freeze([])
});
