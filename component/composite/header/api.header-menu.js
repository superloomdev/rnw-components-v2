// Info: HeaderMenu public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderMenu',
  props: Object.freeze({
    menuLinkName: { type: 'string', required: true, description: 'The title the menu opens from.' },
    items: { type: 'array', required: false, description: 'The menu\'s links: `{ label, href, isActive, onPress }` entries (HeaderMenuItem).' },
    isActive: { type: 'boolean', required: false, description: 'Draws the title current. A closed menu holding a current link draws it current too.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The menu\'s name. Default the title.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the title.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.header_menu_item', 'color.header_menu_item_label', 'color.header_menu_item_label_hover', 'color.header_menu_item_label_active',
    'color.header_menu_item_container', 'color.header_menu_item_container_hover', 'color.header_menu_item_container_active',
    'color.header_menu_item_indicator', 'color.header_menu_container', 'color.header_menu_arrow',
    'color.header_menu_arrow_hover', 'color.header_menu_arrow_active', 'shadow.header_menu',
    'color.focus', 'icon.chevron_down'
  ]),
  colors: Object.freeze([])
});
