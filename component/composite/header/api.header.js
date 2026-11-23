// Info: Header public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Header',
  props: Object.freeze({
    accessibilityLabel: { type: 'string', required: false, description: 'The banner landmark\'s name.' },
    menuButton: { type: 'object', required: false, description: 'The side navigation toggle at the start: `{ label, isActive, isCollapsible, onPress }` (see HeaderMenuButton).' },
    name: { type: 'object', required: false, description: 'The product name: `{ prefix, label, href, onPress }` (see HeaderName).' },
    navigation: { type: 'object', required: false, description: 'The menu bar: `{ accessibilityLabel, items }`, each item `{ label, href, isActive, onPress }` or a menu `{ label, items }` (see HeaderNavigation).' },
    actions: { type: 'array', required: false, description: 'The global actions at the end: `{ icon, label, isActive, onPress }` entries (see HeaderGlobalAction).' },
    panel: { type: 'object', required: false, description: 'The panel under the header at its end: `{ expanded, children, onHeaderPanelFocus }` (see HeaderPanel).' },
    children: { type: 'node', required: false, description: 'Further members, drawn after the data-driven ones.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the banner.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.header_container', 'color.header_border']),
  colors: Object.freeze([])
});
