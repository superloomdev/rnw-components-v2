// Info: PopoverContent public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'PopoverContent',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The bubble\'s body; a string wraps into the theme\'s default text in the surface\'s ink.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the bubble.' }
  }),
  composition: Object.freeze({
    align: { type: 'string', required: false, description: 'Composition prop: the resolved placement, which seats the caret on the anchor-facing edge.' },
    caret: { type: 'boolean', required: false, description: 'Composition prop: draws the caret on the anchor-facing edge.' },
    border: { type: 'boolean', required: false, description: 'Composition prop: draws the 1px `popover_border` outline.' },
    dropShadow: { type: 'boolean', required: false, description: 'Composition prop: draws the surface\'s drop shadow where the surface is not inverse.' },
    highContrast: { type: 'boolean', required: false, description: 'Composition prop: draws the inverse surface from the `tooltip` cells.' },
    layerStyle: { type: 'object', required: false, description: 'Composition prop: the positioned style the Popover computes for the open surface.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.popover_container', 'color.popover_label', 'color.popover_border',
    'color.tooltip_container', 'color.tooltip_label',
    'control.popover_radius', 'control.popover_caret_width', 'control.popover_caret_height',
    'control.popover_max_width', 'shadow.popover'
  ]),
  colors: Object.freeze([])
});
