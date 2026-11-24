// Info: SideNavDetails public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavDetails',
  props: Object.freeze({
    title: { type: 'string', required: true, description: 'The details\' title, a level-2 heading, truncated at its end.' },
    children: { type: 'node', required: false, description: 'What follows the title; a string is drawn in the menu link\'s type.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.side_nav_menu_title', 'type.side_nav_menu_link', 'color.side_nav_link_label', 'color.side_nav_link_label_selected']),
  colors: Object.freeze([])
});
