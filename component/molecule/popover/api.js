// Info: Popover public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Popover',
  props: Object.freeze({
    open: { type: 'boolean', required: true, description: 'The open state; the caller owns it.' },
    onRequestClose: { type: 'function', required: false, description: 'Called on Escape and on an outside press while open.' },
    align: { type: 'string', required: false, description: 'The side and alignment the surface opens on: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`. Default `bottom`.' },
    autoAlign: { type: 'boolean', required: false, description: 'Flips the placement at the viewport edge.' },
    caret: { type: 'boolean', required: false, description: 'Draws the caret on the anchor-facing edge. Default true.' },
    dropShadow: { type: 'boolean', required: false, description: 'Draws the surface\'s drop shadow. Default true; the inverse surface never draws one.' },
    border: { type: 'boolean', required: false, description: 'Draws the 1px `popover_border` outline. Default false.' },
    highContrast: { type: 'boolean', required: false, description: 'Draws the inverse surface from the `tooltip` cells: no shadow, no border.' },
    content: { type: 'node', required: false, description: 'The popover body; a string wraps into the theme\'s default text in the `popover_label` ink.' },
    children: { type: 'node', required: true, description: 'The anchor the surface is placed beside; a string wraps into the theme\'s default text.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the anchor wrapper.' }
  }),
  composition: Object.freeze({
    offset: { type: 'number', required: false, description: 'Composition prop: the offset cell a composing host (the toggletip) substitutes for `popover_offset`.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.popover_container', 'color.popover_label', 'color.popover_border',
    'color.tooltip_container', 'color.tooltip_label',
    'control.popover_radius', 'control.popover_caret_width', 'control.popover_caret_height',
    'control.popover_offset', 'control.popover_max_width',
    'shadow.popover', 'stacking.floating'
  ]),
  colors: Object.freeze([])
});
