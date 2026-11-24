// Info: SideNavLinkText public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavLinkText',
  props: Object.freeze({
    children: { type: 'string', required: true, description: 'The link text, truncated at its end.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.side_nav_link', 'type.side_nav_menu_link',
    'color.side_nav_link_label', 'color.side_nav_link_label_hover', 'color.side_nav_link_label_selected'
  ]),
  colors: Object.freeze([])
});
