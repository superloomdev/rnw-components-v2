// Info: SideNavItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavItem',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'What the item holds; a string is drawn in the navigation\'s text.' },
    large: { type: 'boolean', required: false, description: 'Every SideNavLink and SideNavMenu inside the item takes the large row height.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.body_compact_01', 'color.side_nav_link_label']),
  colors: Object.freeze([])
});
