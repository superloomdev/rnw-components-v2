// Info: FormItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'FormItem',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'One field\'s parts, stacked in a column. A bare string renders through Text in the compact body type.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['type.body_compact_01', 'font.family.sans']),
  colors: Object.freeze([])
});
