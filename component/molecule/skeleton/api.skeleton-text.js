// Info: SkeletonText public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SkeletonText',
  props: Object.freeze({
    paragraph: { type: 'boolean', required: false, description: 'Draw `lineCount` lines instead of one.' },
    lineCount: { type: 'number', required: false, description: 'The lines a paragraph draws; three when omitted.' },
    width: { type: 'string', required: false, description: 'A line width in points, or a percent string; the full row when omitted.' },
    heading: { type: 'boolean', required: false, description: 'Draw the lines at heading height.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
