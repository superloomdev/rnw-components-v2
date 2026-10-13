// Info: Divider public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Divider',
  props: Object.freeze({
    inset: { type: 'boolean', required: false, description: 'Indent the line at both ends by the `inset` metric.' },
    insetStart: { type: 'boolean', required: false, description: 'Indent the line at its start end by the `inset` metric.' },
    insetEnd: { type: 'boolean', required: false, description: 'Indent the line at its end by the `inset` metric.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.divider']),
  colors: Object.freeze([])
});
