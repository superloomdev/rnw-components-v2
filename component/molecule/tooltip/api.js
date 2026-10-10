// Info: Tooltip public API, as data. The docs generator and the accessibility
// tests read this; the component implements exactly this and nothing more.

export default Object.freeze({
  name: 'Tooltip',
  props: Object.freeze({
    children: { type: 'node', required: true, description: 'The anchor: the tooltip opens when it is hovered, focused or pressed and describes it.' },
    label: { type: 'string', required: true, description: 'The tooltip\'s text; it describes the anchor through `aria-describedby`.' },
    align: { type: 'string', required: false, description: 'The side and alignment the tooltip opens on: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`. Default `top`; flips at the viewport edge.' },
    compact: { type: 'boolean', required: false, description: 'Draws the compact kind - the tooltip an icon button shows - from the `tooltip_compact` member cells.' },
    open: { type: 'boolean', required: false, description: 'Controlled open state. Absent: the tooltip keeps its own state, starting from `defaultOpen`.' },
    defaultOpen: { type: 'boolean', required: false, description: 'Initially open while uncontrolled.' },
    onOpenChange: { type: 'function', required: false, description: 'Called with the next open state on every open or close.' },
    enterDelayMs: { type: 'number', required: false, description: 'Milliseconds before a hover or focus opens the tooltip.' },
    leaveDelayMs: { type: 'number', required: false, description: 'Milliseconds before the pointer leaving or blur closes the tooltip.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the anchor wrapper.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.tooltip_container', 'color.tooltip_label',
    'control.tooltip_padding_block', 'control.tooltip_padding_inline',
    'control.tooltip_radius', 'control.tooltip_caret_width', 'control.tooltip_caret_height',
    'control.tooltip_offset', 'control.tooltip_max_width',
    'control.tooltip_compact_padding_block', 'control.tooltip_compact_caret_width',
    'control.tooltip_compact_caret_height', 'control.tooltip_compact_offset',
    'type.tooltip_label', 'type.tooltip_compact_label',
    'font.family.sans', 'stacking.floating'
  ]),
  colors: Object.freeze([])
});
