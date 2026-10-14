// Info: SkeletonPlaceholder public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SkeletonPlaceholder',
  props: Object.freeze({
    width: { type: 'number', required: false, description: 'The box\'s width; the placeholder size when omitted.' },
    height: { type: 'number', required: false, description: 'The box\'s height; the placeholder size when omitted.' },
    radius: { type: 'number', required: false, description: 'Composition prop: the corner radius; the skeleton radius when omitted (the chat button\'s pill passes half its height).' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.skeleton_container', 'color.skeleton_shimmer', 'motion.skeleton_cycle']),
  colors: Object.freeze([])
});
