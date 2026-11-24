// Info: SideNavMenu public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavMenu',
  props: Object.freeze({
    title: { type: 'string', required: true, description: 'The menu\'s title, on its button, truncated at its end.' },
    items: { type: 'array', required: false, description: 'The menu\'s links: `{ label, href, isActive, onPress }` entries (SideNavMenuItem).' },
    children: { type: 'node', required: false, description: 'Further SideNavMenuItem links, after `items`.' },
    defaultExpanded: { type: 'boolean', required: false, description: 'The menu starts open.' },
    icon: { type: 'string', required: false, description: 'A semantic icon name drawn before the title; the links then start after it.' },
    isActive: { type: 'boolean', required: false, description: 'Draws the menu active; a closed menu holding the current link draws itself active too.' },
    large: { type: 'boolean', required: false, description: 'The large row height, for the button and its links.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the button.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.side_nav_menu_title', 'color.side_nav_link_label', 'color.side_nav_link_label_hover', 'color.side_nav_link_label_selected',
    'color.side_nav_link_container_hover', 'color.side_nav_link_container_selected', 'color.side_nav_menu_container_selected_hover',
    'color.side_nav_link_indicator', 'color.side_nav_icon', 'color.side_nav_icon_selected', 'color.focus', 'icon.chevron_down'
  ]),
  colors: Object.freeze([])
});
