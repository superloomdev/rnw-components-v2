// Info: HeaderSideNavItems public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderSideNavItems',
  props: Object.freeze({
    items: { type: 'array', required: false, description: 'The header\'s links again: `{ label, href, isActive, onPress }` entries (HeaderMenuItem).' },
    children: { type: 'node', required: false, description: 'Further HeaderMenuItem members, after `items`.' },
    hasDivider: { type: 'boolean', required: false, description: 'Draws a rule under the list, between it and what follows.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the list.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.header_border']),
  colors: Object.freeze([])
});
