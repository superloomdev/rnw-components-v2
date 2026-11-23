// Info: HeaderGlobalBar public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderGlobalBar',
  props: Object.freeze({
    actions: { type: 'array', required: false, description: 'The actions: `{ icon, label, isActive, onPress }` entries (HeaderGlobalAction), in order.' },
    children: { type: 'node', required: false, description: 'Further HeaderGlobalAction members, after `actions`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the bar.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
