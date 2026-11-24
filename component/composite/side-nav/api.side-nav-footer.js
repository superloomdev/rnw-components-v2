// Info: SideNavFooter public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavFooter',
  props: Object.freeze({
    expanded: { type: 'boolean', required: false, description: 'The navigation is open: the toggle shows the close glyph, else the chevron.' },
    onToggle: { type: 'function', required: false, description: 'Called when the toggle is pressed.' },
    assistiveText: { type: 'string', required: false, description: 'The toggle\'s accessible label; `Toggle opening or closing the side navigation` by default.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.side_nav_icon', 'color.side_nav_link_container_hover', 'color.focus', 'icon.close', 'icon.chevron_right']),
  colors: Object.freeze([])
});
