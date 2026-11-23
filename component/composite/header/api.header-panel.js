// Info: HeaderPanel public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'HeaderPanel',
  props: Object.freeze({
    expanded: { type: 'boolean', required: false, description: 'Draws the panel. Default false: it takes no room.' },
    children: { type: 'node', required: false, description: 'The panel\'s content; a string is drawn as text.' },
    onHeaderPanelFocus: { type: 'function', required: false, description: 'Called on Escape inside the panel, to collapse it.' },
    accessibilityLabel: { type: 'string', required: false, description: 'The panel region\'s name.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the panel.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['color.header_panel_container', 'color.header_panel_label', 'color.header_border', 'type.body_compact_01']),
  colors: Object.freeze([])
});
