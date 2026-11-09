// Info: TabPanel public API, as data.

export default Object.freeze({
  name: 'TabPanel',
  props: Object.freeze({
    children: { type: 'node', required: true, description: 'The panel\'s content.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the panel.' }
  }),
  composition: Object.freeze({
    id: { type: 'string', description: 'The panel\'s id, wired from the tab\'s `aria-controls`.' },
    labelledBy: { type: 'string', description: 'The tab\'s id (`aria-labelledby`).' },
    hidden: { type: 'boolean', description: 'The unselected panel stays mounted but hidden.' },
    contained: { type: 'boolean', description: 'Draws the `tab_panel_contained_container` fill.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze(['control.tab_panel_padding', 'color.tab_panel_contained_container']),
  colors: Object.freeze([])
});
