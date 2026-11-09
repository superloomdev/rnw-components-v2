// Info: SelectItemGroup public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'SelectItemGroup',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The group label, drawn on one line above the group\'s options.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the group and every option in it.' },
    items: { type: 'array', required: false, description: 'Options, each `{ value, label }`; used only when the group renders standalone.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the group.' }
  }),
  composition: Object.freeze({
    options: { type: 'array', required: false, description: 'Composition prop: the option elements Select built for the group; when present the group renders them instead of `items`.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.list_item_height', 'control.list_item_padding_inline',
    'type.select_group_label', 'font.family.sans',
    'color.select_group_label', 'color.list_item_label_disabled'
  ]),
  colors: Object.freeze([])
});
