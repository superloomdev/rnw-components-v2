// Info: Heading public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Heading',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The heading text.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the heading.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'type.heading01', 'type.heading02', 'type.heading03', 'type.heading04', 'type.heading05', 'type.heading06',
    'color.text_primary', 'font.family.sans'
  ]),
  colors: Object.freeze([])
});
