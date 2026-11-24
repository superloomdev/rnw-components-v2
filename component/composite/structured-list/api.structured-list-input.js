// Info: StructuredListInput public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'StructuredListInput',
  props: Object.freeze({
    accessibilityLabel: { type: 'string', required: false, description: 'The radio\'s label; the row\'s id when omitted.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the radio.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
