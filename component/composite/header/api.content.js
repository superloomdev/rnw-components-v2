// Info: Content public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Content',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The page\'s main content; a string is drawn as text.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The main landmark\'s name.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the region.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.content_label', 'type.body01']),
  colors: Object.freeze([])
});
