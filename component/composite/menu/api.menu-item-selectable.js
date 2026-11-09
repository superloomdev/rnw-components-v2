// Info: MenuItemSelectable public API, as data.

export default Object.freeze({
  name: 'MenuItemSelectable',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The item\'s text.' },
    selected: { type: 'boolean', required: false, description: 'Whether the item is on (marked). Default false.' },
    disabled: { type: 'boolean', required: false, description: 'Draws the disabled cells and skips the roving focus. Default false.' },
    onChange: { type: 'function', required: false, description: 'Called when the item toggles.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the item.' }
  }),
  composition: Object.freeze({
    registerItem: { type: 'function', required: false, description: 'Composition prop: registers the item with the parent\'s roving collection.' },
    onChoose: { type: 'function', required: false, description: 'Composition prop: the parent\'s choice handler.' },
    seats: { type: 'object', required: false, description: 'Composition prop: the parent\'s seat metrics.' },
    list: { type: 'object', required: false, description: 'Composition prop: the parent\'s shared list presentation.' },
    icons: { type: 'boolean', required: false, description: 'Composition prop: the menu has any icons.' },
    iconsShared: { type: 'boolean', required: false, description: 'Composition prop: `anatomy.menu_icon_seat` is `shared`.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.list_item_label', 'color.list_item_label_selected', 'color.list_item_label_hover', 'color.list_item_label_disabled',
    'color.list_item_container_hover', 'color.list_item_container_selected', 'color.list_item_container_selected_hover',
    'color.menu_item_container_selected', 'color.menu_item_icon', 'size.icon_01', 'type.list_item'
  ]),
  colors: Object.freeze([])
});
