// Info: SideNavIcon public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SideNavIcon',
  props: Object.freeze({
    icon: { type: 'string', required: true, description: 'A semantic icon name.' },
    small: { type: 'boolean', required: false, description: 'Accepted for parity; it changes nothing drawn.' }
  }),
  composition: Object.freeze({
    isSelected: { type: 'boolean', required: false, description: 'Composition prop: an active SideNavMenu\'s icon, in the selected icon color.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.side_nav_icon', 'color.side_nav_icon_selected']),
  colors: Object.freeze([])
});
