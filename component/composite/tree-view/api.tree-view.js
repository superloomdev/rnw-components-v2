// Info: TreeView public API, as data.
export default Object.freeze({
  name: 'TreeView',
  props: Object.freeze({
    active: { type: 'one', required: false, description: 'The controlled active node id.' },
    defaultActive: { type: 'one', required: false, description: 'The initial active node id for the uncontrolled form.' },
    defaultSelected: { type: 'array', required: false, description: 'The initial selected node ids for the uncontrolled form.' },
    hideLabel: { type: 'boolean', required: false, description: 'Hides the visible label; an accessibilityLabel is required instead.' },
    label: { type: 'string', required: false, description: 'The visible field label.' },
    multiselect: { type: 'boolean', required: false, description: 'Several nodes can be selected.' },
    nodes: { type: 'array', required: true, description: 'The tree data: `{ id, label, disabled, expanded, children, icon, href }`; children nest the same shape.' },
    onSelect: { type: 'function', required: false, description: 'Called with the selected node.' },
    onToggle: { type: 'function', required: false, description: 'Called with the toggled node and its expanded state.' },
    selected: { type: 'array', required: false, description: 'The controlled selected node ids.' },
    size: { type: 'string', required: false, description: 'One of `xs`, `sm`. Default `sm`.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the tree.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze(['xs', 'sm']),
  tokens: Object.freeze([
    'control.tree_indent', 'control.tree_toggle_size', 'control.tree_toggle_offset', 'control.tree_icon_size',
    'control.tree_icon_gap', 'control.tree_focus_width', 'control.tree_node_indicator_width',
    'control.tree_node_padding_start', 'control.tree_leaf_padding_block', 'control.tree_leaf_padding_start',
    'control.tree_leaf_padding_start_icon', 'control.tree_leaf_padding_start_nested_icon',
    'control.tree_label_text_padding_start', 'control.tree_label_padding_end',
    'size.size_xsmall', 'size.size_small', 'type.tree_node_label', 'type.field_label',
    'color.tree_node_container', 'color.tree_node_container_hover', 'color.tree_node_container_selected',
    'color.tree_node_container_selected_hover', 'color.tree_node_label', 'color.tree_node_label_hover',
    'color.tree_node_label_selected', 'color.tree_node_icon', 'color.tree_node_icon_hover', 'color.tree_node_indicator',
    'color.tree_node_container_disabled', 'color.tree_node_label_disabled', 'color.tree_node_icon_disabled',
    'color.tree_focus', 'color.field_label', 'color.layer_01'
  ]),
  colors: Object.freeze([])
});
