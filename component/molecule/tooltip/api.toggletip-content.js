// Info: ToggletipContent public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ToggletipContent',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The bubble\'s body text; a second node after it is the actions row.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the content.' }
  }),
  composition: Object.freeze({
    id: { type: 'string', required: false, description: 'Composition prop: the bubble id the trigger\'s `aria-controls` names.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.tooltip_label', 'control.toggletip_max_width', 'spacing.spacing_05', 'type.body_compact_01']),
  colors: Object.freeze([])
});
