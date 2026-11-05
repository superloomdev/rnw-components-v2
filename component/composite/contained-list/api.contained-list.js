// Info: ContainedList public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.
export default Object.freeze({
  name: 'ContainedList',
  props: Object.freeze({
    label: { type: 'string', required: true, description: 'The header text labelling the list.' },
    kind: { type: 'string', required: false, description: '`on-page` (default) or `disclosed` - the header\'s cells.' },
    size: { type: 'string', required: false, description: '`sm` | `md` | `lg` (default) | `xl` - every item\'s minimum height and the tag height.' },
    isInset: { type: 'boolean', required: false, description: 'Insets the row rulers by the list\'s inline padding.' },
    action: { type: 'node', required: false, description: 'A header action; a `Search`/`ExpandableSearch` renders under the header and filters the items by label.' },
    items: { type: 'array', required: true, description: 'The rows: `{ label, onPress, disabled, icon, action }`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'color.contained_list_header_container', 'color.contained_list_header_container_disclosed',
    'color.contained_list_header_label', 'color.contained_list_header_label_disclosed',
    'color.contained_list_divider', 'color.contained_list_search_container', 'color.contained_list_search_border',
    'type.contained_list_header', 'type.contained_list_header_disclosed',
    'control.contained_list_header_height_disclosed', 'control.contained_list_padding_inline', 'size.size_large'
  ])
});
