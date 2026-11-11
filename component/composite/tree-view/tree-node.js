// Info: TreeNode molecule. One row of a TreeView: the toggle for a
// parent, the optional icon, the label - indent by the frozen
// `calcOffset` expression (children+icon depth+1+depth/2, children
// depth+1, icon depth+2+depth/2, leaf depth+2.5) applied as a negative
// margin with the matching padding, in `control.tree_indent` units.
//
// Accessibility: `treeitem` role with `aria-selected`, `aria-expanded`,
// `aria-disabled`, `aria-current`; the active row carries the indicator.
import SPEC from './spec.tree-node.js';
import createTreeContext from './tree-context.js';

export default function TreeNode (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const TreeContext = createTreeContext(ctx);

  function TreeNodeComponent (props) {
    const context = React.useContext(TreeContext);
    const depth = Utils.isNumber(props.depth) ? props.depth : 0;
    const isParent = props.isParent === true;
    const expanded = props.expanded === true;
    const disabled = props.disabled === true;
    const hasIcon = Utils.isString(props.icon);
    const indent = ctx.metric('TreeNode', 'indent');
    const offset = isParent && hasIcon ? depth + 1 + depth * 0.5 : isParent ? depth + 1 : hasIcon ? depth + 2 + depth * 0.5 : depth + 2.5;
    const size = context.size === 'xs' ? 'heightSmall' : 'heightMedium';
    const height = ctx.metric('TreeNode', size);
    const leafPad = isParent ? 'paddingStart' : hasIcon ? 'leafPaddingStartIcon' : (depth > 0 && hasIcon) ? 'leafPaddingStartNestedIcon' : 'leafPaddingStart';
    const selected = Utils.isArray(context.selected) && context.selected.includes(props.nodeId);
    const active = context.active === props.nodeId;
    const focused = context.focusEnabled === props.index;
    const toggle = isParent ? React.createElement(View, {
      dataSet: { part: 'toggle' },
      style: { alignItems: 'center', height: ctx.metric('TreeNode', 'toggleSize'), justifyContent: 'center', marginEnd: ctx.metric('TreeNode', 'iconGap'), transform: expanded ? [] : [{ rotate: '-90deg' }], width: ctx.metric('TreeNode', 'toggleSize') }
    },
    React.createElement(ctx.Registry.Icon, { color: 'tree_node_icon', name: 'caret_down', size: ctx.metric('TreeNode', 'toggleSize') })) : null;
    const icon = hasIcon ? React.createElement(View, { dataSet: { part: 'icon' }, style: { marginEnd: ctx.metric('TreeNode', 'iconGap') } },
      React.createElement(ctx.Registry.Icon, { color: 'tree_node_icon', name: props.icon, size: ctx.metric('TreeNode', 'iconSize') })) : null;
    const label = React.createElement(View, {
      dataSet: { part: 'label' },
      style: { alignItems: 'center', flexDirection: 'row', marginStart: -offset * indent, paddingStart: offset * indent }
    },
    toggle, icon,
    React.createElement(Text, {
      dataSet: { part: 'text' },
      style: [{ color: disabled ? ctx.color('tree_node_label_disabled') : selected ? ctx.color('tree_node_label_selected') : ctx.color('tree_node_label'), paddingStart: ctx.metric('TreeNode', 'labelTextPaddingStart') }, ctx.typeStyle('tree_node_label')]
    }, props.label));
    return React.createElement(Pressable, {
      accessibilityRole: 'treeitem',
      'aria-current': active ? 'true' : undefined,
      'aria-disabled': disabled || undefined,
      'aria-expanded': isParent ? expanded : undefined,
      'aria-selected': disabled ? undefined : selected,
      dataSet: { part: 'node' },
      disabled: disabled,
      onFocus: props.onFocus,
      onPress: props.onPress,
      ref: props.rootRef,
      style: function (state) {
        return [{
          alignItems: 'center',
          backgroundColor: selected ? (state.hovered === true ? ctx.color('tree_node_container_selected_hover') : ctx.color('tree_node_container_selected')) : (state.hovered === true ? ctx.color('tree_node_container_hover') : ctx.color('tree_node_container')),
          borderStartColor: active ? ctx.color('tree_node_indicator') : 'transparent',
          borderStartWidth: ctx.metric('TreeNode', 'indicatorWidth'),
          flexDirection: 'row',
          height: height,

          outlineColor: focused && state.focused === true ? ctx.color('tree_focus') : undefined,
          outlineStyle: focused && state.focused === true ? 'solid' : undefined,
          outlineWidth: focused && state.focused === true ? ctx.metric('TreeNode', 'focusWidth') : undefined,
          paddingEnd: ctx.metric('TreeNode', 'leafPaddingBlock'),
          paddingStart: ctx.metric('TreeNode', leafPad)
        }, props.style];
      },
      focusable: focused && !disabled,
      tabIndex: disabled ? undefined : focused ? 0 : -1,
      testID: props.testID
    }, label);
  }

  TreeNodeComponent.displayName = 'TreeNode';
  return TreeNodeComponent;
}
TreeNode.spec = SPEC;
