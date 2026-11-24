// Info: SideNavLink public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavLink',
  props: Object.freeze({
    children: { type: 'node', required: true, description: 'The link text (drawn by SideNavLinkText), or a SideNavLinkText the caller composed.' },
    href: { type: 'string', required: false, description: 'Where the link goes.' },
    icon: { type: 'string', required: false, description: 'A semantic icon name drawn before the text (SideNavIcon).' },
    isActive: { type: 'boolean', required: false, description: 'The current page: the selected fill and the bar at its start, `aria-current` set.' },
    large: { type: 'boolean', required: false, description: 'The large row height.' },
    onPress: { type: 'function', required: false, description: 'Called when the link is pressed.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the link.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.side_nav_link_container_hover', 'color.side_nav_link_container_selected', 'color.side_nav_link_indicator', 'color.focus']),
  colors: Object.freeze([])
});
