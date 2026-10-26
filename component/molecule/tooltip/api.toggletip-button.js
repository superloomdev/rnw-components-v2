// Info: ToggletipButton public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ToggletipButton',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'The button\'s accessible name.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the button.' }
  }),
  composition: Object.freeze({
    expanded: { type: 'boolean', required: false, description: 'Composition prop: whether the bubble is open; sets `aria-expanded` and the active icon.' },
    controls: { type: 'string', required: false, description: 'Composition prop: the bubble\'s id for `aria-controls`.' },
    onPress: { type: 'function', required: false, description: 'Composition prop: the toggle the Toggletip wires.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.toggletip_icon', 'color.toggletip_icon_active', 'size.icon_01', 'control.button_focus_width', 'control.button_focus_offset', 'control.button_focus_gap_width']),
  colors: Object.freeze([])
});
