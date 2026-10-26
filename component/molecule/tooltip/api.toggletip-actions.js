// Info: ToggletipActions public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ToggletipActions',
  props: Object.freeze({
    actions: { type: 'array', required: false, description: 'The action list, at most two; the Toggletip supplies it.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the actions row.' }
  }),
  composition: Object.freeze({}),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.link_label_inverse', 'color.link_label_inverse_hover', 'color.focus_ring_inverse', 'spacing.spacing_05']),
  colors: Object.freeze([])
});
