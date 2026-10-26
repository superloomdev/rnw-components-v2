// Info: Toggletip public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'Toggletip',
  props: Object.freeze({
    label: { type: 'string', required: false, description: 'The ToggletipLabel text beside the button.' },
    buttonLabel: { type: 'string', required: false, description: 'The button\'s accessible name. Default `Show information`.' },
    content: { type: 'node', required: true, description: 'The bubble\'s text.' },
    actions: { type: 'array', required: false, description: 'Up to two `{ label, kind: "link" | "button", href?, onPress? }` laid out at the bubble\'s base.' },
    align: { type: 'string', required: false, description: 'The side and alignment the bubble opens on; the 12 Popover placements. Default `bottom`.' },
    autoAlign: { type: 'boolean', required: false, description: 'Flips the placement at the viewport edge.' },
    defaultOpen: { type: 'boolean', required: false, description: 'Initially open.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the toggletip root.' }
  }),
  composition: Object.freeze({}),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.toggletip_icon', 'color.toggletip_icon_active',
    'color.tooltip_container', 'color.tooltip_label', 'color.text_secondary',
    'color.link_label_inverse', 'color.link_label_inverse_hover', 'color.focus_ring_inverse',
    'control.toggletip_offset', 'control.toggletip_max_width',
    'size.icon_01', 'spacing.spacing_03', 'spacing.spacing_05',
    'type.label01', 'type.body_compact_01', 'stacking.floating'
  ]),
  colors: Object.freeze([])
});
