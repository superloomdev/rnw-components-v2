// Info: HeaderMenuItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderMenuItem',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The link text, truncated at its end.' },
    href: { type: 'string', required: false, description: 'Where the link goes.' },
    isActive: { type: 'boolean', required: false, description: 'The current page: the indicator under the link (beside it in a menu), `aria-current` set.' },
    'aria-current': { type: 'string', required: false, description: 'An explicit `aria-current`; `page` names the current page without the indicator\'s class rule upstream draws for `isActive`.' },
    onPress: { type: 'function', required: false, description: 'Called when the link is pressed.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the link.' }
  }),
  composition: Object.freeze({
    inMenu: { type: 'boolean', required: false, description: 'Composition prop: a row of an open HeaderMenu (its height, fills and side indicator).' },
    stacked: { type: 'boolean', required: false, description: 'Composition prop: a line of HeaderSideNavItems, at least the side navigation row\'s height, in its type and hover fill.' },
    onBlur: { type: 'function', required: false, description: 'Composition prop: the menu\'s blur handler, so leaving the menu closes it.' },
    itemRef: { type: 'object', required: false, description: 'Composition prop: a ref to the link (the menu checks where focus went).' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.header_menu_item', 'color.header_menu_item_label', 'color.header_menu_item_label_hover', 'color.header_menu_item_label_active',
    'color.header_menu_item_container', 'color.header_menu_item_container_hover', 'color.header_menu_item_container_active',
    'color.header_menu_item_indicator', 'color.header_menu_container',
    'color.header_submenu_item_container_hover', 'color.header_submenu_item_container_active',
    'color.header_submenu_item_container_selected', 'color.header_submenu_item_container_selected_hover', 'color.focus',
    'type.side_nav_menu_title', 'color.side_nav_link_container_hover'
  ]),
  colors: Object.freeze([])
});
