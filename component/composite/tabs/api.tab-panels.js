// Info: TabPanels public API, as data.

export default Object.freeze({
  name: 'TabPanels',
  props: Object.freeze({
    panels: { type: 'array', required: true, description: 'One node or string per tab.' },
    selectedIndex: { type: 'number', required: false, description: 'The drawn panel; default 0.' },
    baseId: { type: 'string', required: false, description: 'The id stem shared with the tabs.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the panels region.' }
  }),
  composition: Object.freeze({
    contained: { type: 'boolean', description: 'Draws the contained fill on each panel.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
