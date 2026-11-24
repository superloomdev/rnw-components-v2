// Info: SideNav public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNav',
  props: Object.freeze({
    items: { type: 'array', required: false, description: 'The navigation\'s entries, drawn in one SideNavItems (its `items`): links `{ label, href, icon, isActive, large, onPress }` (SideNavLink), menus `{ title, icon, isActive, defaultExpanded, large, items }` (SideNavMenu of SideNavMenuItem links) and `{ divider: true }` (SideNavDivider).' },
    children: { type: 'node', required: false, description: 'Further members after `items`: a SideNavItems, HeaderSideNavItems, SideNavHeader, SideNavDetails or SideNavFooter.' },
    expanded: { type: 'boolean', required: false, description: 'Opens the navigation; given, the open state is the caller\'s (controlled).' },
    defaultExpanded: { type: 'boolean', required: false, description: 'The open state the navigation starts with when `expanded` is not given.' },
    onToggle: { type: 'function', required: false, description: 'Called with the next open state when the navigation asks to open or close (Escape, a rail under the pointer).' },
    isRail: { type: 'boolean', required: false, description: 'A rail: the icons\' width at every window width, the full width while the pointer is over it or it is open.' },
    isPersistent: { type: 'boolean', required: false, description: 'Shown from `breakpoint.lg` while closed (the default); `false` draws it only while open.' },
    isFixedNav: { type: 'boolean', required: false, description: 'A standalone navigation: drawn only while open, at every window width, and without the overlay.' },
    onOverlayClick: { type: 'function', required: false, description: 'Called when the overlay a navigation open below `breakpoint.lg` lays over the window is pressed.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The navigation landmark\'s label.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the navigation.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.side_nav_container', 'color.side_nav_overlay']),
  colors: Object.freeze([])
});
