// Info: ContainedListItem public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more. Composed through ContainedList - see `notes.md`.
export default Object.freeze({
  name: 'ContainedListItem',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The row\'s text.' },
    onPress: { type: 'function', required: false, description: 'Makes the row a pressable with hover/active fills and the inset ring.' },
    disabled: { type: 'boolean', required: false, description: 'Dims the label and drops the press - only on a clickable row.' },
    icon: { type: 'string', required: false, description: 'A glyph name drawn in the icon column.' },
    action: { type: 'node', required: false, description: 'An end action over the row (`tag`, `button`, or a node).' },
    size: { type: 'string', required: false, description: 'Composition prop: the row\'s minimum height class from the list.' },
    inset: { type: 'boolean', required: false, description: 'Composition prop: the list insets the ruler.' },
    last: { type: 'boolean', required: false, description: 'Composition prop: the last row draws no ruler.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.contained_list_item_label', 'color.contained_list_item_label_disabled',
    'color.contained_list_item_container_hover', 'color.contained_list_item_container_active',
    'color.contained_list_divider', 'color.button_focus_ring',
    'type.contained_list_item',
    'control.contained_list_action_space', 'control.contained_list_icon_gap', 'control.contained_list_icon_size',
    'control.contained_list_icon_top', 'control.contained_list_padding_inline',
    'size.size_small', 'size.size_medium', 'size.size_large', 'size.size_xlarge',
    'control.tag_height', 'control.tag_height_small'
  ])
});
