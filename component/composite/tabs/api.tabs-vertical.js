// Info: TabsVertical public API, as data.

export default Object.freeze({
  name: 'TabsVertical',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The tabs: `{ label, disabled? }` entries, in order.' },
    panels: { type: 'array', required: false, description: 'One node or string per tab; renders `TabPanels` beside the list.' },
    height: { type: 'number', required: false, description: 'The container height; the list scrolls with fades when content exceeds it.' },
    selectedIndex: { type: 'number', required: false, description: 'Controlled selection.' },
    defaultSelectedIndex: { type: 'number', required: false, description: 'Initially selected while uncontrolled; default 0.' },
    onChange: { type: 'function', required: false, description: 'Called with `{ selectedIndex }` when the selection changes.' },
    accessibilityLabel: { type: 'string', required: false, description: 'Names the tab list.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the list.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tab_vertical_list_ratio', 'control.tab_vertical_fade_height',
    'color.tab_vertical_container'
  ]),
  colors: Object.freeze([])
});
