// Info: SideNavItems public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavItems',
  props: Object.freeze({
    items: { type: 'array', required: false, description: 'The list\'s entries: links `{ label, href, icon, isActive, large, onPress }` (SideNavLink), menus `{ title, icon, isActive, defaultExpanded, large, items }` (SideNavMenu) and `{ divider: true }` (SideNavDivider).' },
    children: { type: 'node', required: false, description: 'Further members after `items`: SideNavLink, SideNavMenu, SideNavDivider, SideNavItem.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the list.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
