// Info: StructuredListSkeleton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'StructuredListSkeleton',
  props: Object.freeze({
    rowCount: { type: 'number', required: false, description: 'The body rows drawn; 5 when omitted.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.structured_list_border']),
  colors: Object.freeze([])
});
