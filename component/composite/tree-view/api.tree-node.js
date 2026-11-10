// Info: TreeNode public API, as data.
export default Object.freeze({
  name: 'TreeNode',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'Nested TreeNodes.' },
    disabled: { type: 'boolean', required: false, description: 'Disables the node.' },
    expanded: { type: 'boolean', required: false, description: 'A controlled expanded state for a parent.' },
    href: { type: 'string', required: false, description: 'The node is a link.' },
    icon: { type: 'string', required: false, description: 'A semantic icon name drawn before the label.' },
    id: { type: 'string', required: false, description: 'The node id used by the tree\'s selection.' },
    label: { type: 'string', required: false, description: 'The node\'s text.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the node.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([
    'control.tree_indent', 'control.tree_toggle_size', 'control.tree_icon_size', 'control.tree_icon_gap',
    'control.tree_focus_width', 'control.tree_node_indicator_width', 'control.tree_node_padding_start',
    'control.tree_leaf_padding_block', 'control.tree_leaf_padding_start', 'control.tree_leaf_padding_start_icon',
    'control.tree_leaf_padding_start_nested_icon', 'control.tree_label_text_padding_start',
    'size.size_xsmall', 'size.size_small', 'type.tree_node_label',
    'color.tree_node_container', 'color.tree_node_container_hover', 'color.tree_node_container_selected',
    'color.tree_node_label', 'color.tree_node_label_selected', 'color.tree_node_icon', 'color.tree_node_icon_hover',
    'color.tree_node_indicator', 'color.tree_node_container_disabled', 'color.tree_node_label_disabled',
    'color.tree_node_icon_disabled', 'color.tree_focus'
  ]),
  colors: Object.freeze([])
});
