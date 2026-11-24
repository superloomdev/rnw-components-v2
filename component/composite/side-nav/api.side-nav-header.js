// Info: SideNavHeader public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavHeader',
  props: Object.freeze({
    icon: { type: 'string', required: true, description: 'A semantic icon name drawn before the text (SideNavIcon).' },
    children: { type: 'node', required: false, description: 'The header\'s text; a string is drawn in the menu title\'s type.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.side_nav_menu_title', 'color.side_nav_link_label_selected']),
  colors: Object.freeze([])
});
