// Info: ButtonSet public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'ButtonSet',
  props: Object.freeze({
    items: { type: 'array', required: true, description: 'The set\'s buttons, as Button props: `{ children, kind, disabled, icon, onPress }`.' },
    fluid: { type: 'boolean', required: false, description: 'End-aligns the buttons at a quarter of the row each, sorted by kind; a row narrower than the items\' floor stacks them full-width.' },
    stacked: { type: 'boolean', required: false, description: 'Stacks the buttons in a column, each sharing the row\'s width up to the set\'s item width.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.button_set_item_max_width', 'control.button_set_gap', 'control.button_set_fluid_min_width',
    'control.button_set_fluid_max_width', 'control.button_set_fluid_ghost_padding_start',
    'color.button_set_separator', 'color.button_set_separator_disabled', 'color.button_set_separator_stacked_disabled',
    'border.width_01', 'spacing.spacing_05'
  ]),
  colors: Object.freeze([])
});
