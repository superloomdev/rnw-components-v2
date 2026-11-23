// Info: HeaderNavigation public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderNavigation',
  props: Object.freeze({
    accessibilityLabel: { type: 'string', required: false, description: 'The navigation landmark\'s name.' },
    items: { type: 'array', required: false, description: 'The menu bar: `{ label, href, isActive, onPress }` links (HeaderMenuItem) or `{ label, items }` menus (HeaderMenu), in order.' },
    children: { type: 'node', required: false, description: 'Further HeaderMenuItem or HeaderMenu members, after `items`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the landmark.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.header_border']),
  colors: Object.freeze([])
});
