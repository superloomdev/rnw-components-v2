// Info: Section public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Section',
  props: Object.freeze({
    level: { type: 'number', required: false, description: 'Heading level override for the subtree: an integer 1 through 6. Omitted, the section raises the enclosing level by one, clamped at 6.' },
    children: { type: 'node', required: false, description: 'Content under the deeper heading level.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
