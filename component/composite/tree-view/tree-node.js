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
      // The 24 toggle box pulls back by the offset and keeps it after
      // (probe: toggle x 48 = row 36 + 16 - 4, margin -4 / 4, its 16 caret)
      style: { alignItems: 'center', height: ctx.metric('TreeNode', 'toggleSize'), justifyContent: 'center', marginEnd: ctx.metric('TreeNode', 'toggleOffset'), marginStart: -ctx.metric('TreeNode', 'toggleOffset'), transform: expanded ? [] : [{ rotate: '-90deg' }], width: ctx.metric('TreeNode', 'toggleSize') }
    },
    React.createElement(ctx.Registry.Icon, { color: 'tree_node_icon', name: 'caret_down', size: ctx.metric('TreeNode', 'iconSize') })) : null;
    const icon = hasIcon ? React.createElement(View, { dataSet: { part: 'icon' }, style: { marginEnd: ctx.metric('TreeNode', 'iconGap') } },
      React.createElement(ctx.Registry.Icon, { color: 'tree_node_icon', name: props.icon, size: ctx.metric('TreeNode', 'iconSize') })) : null;
    // Upstream nests a child's row inside its parent's padding (probe:
    // depth-1 nodes x 52, width 304) and the label cancels the sum to span
    // the tree (`TreeNode.js` calcOffset; probe: every label x 0, width 320,
    // margin-left -40 / -16 / -56, padding-left the same, padding-right 16).
    // Our rows are flat: a row steps in by its depth in indents and its
    // label reaches back over that and the row's own start padding
    const rowPad = ctx.metric('TreeNode', leafPad);
    const stepIn = depth * indent;
    // The label paints the hover and selected fills, the ring and the ink;
    // the row keeps the container (probe: `labels` carry them, `nodes` the
    // container cell in every state)
    const label = function (state) {
      const live = !disabled;
      const hovered = live && state.hovered === true;
      const ring = live && focused && state.focused === true;
      return React.createElement(View, {
        dataSet: { part: 'label' },
        key: 'label',
        style: {
          alignItems: 'center',
          alignSelf: 'stretch',
          backgroundColor: live && selected ? ctx.color(hovered ? 'tree_node_container_selected_hover' : 'tree_node_container_selected') : hovered ? ctx.color('tree_node_container_hover') : 'transparent',
          flexDirection: 'row',
          flexGrow: 1,
          marginStart: -(stepIn + rowPad),
          outlineColor: ring ? ctx.color('tree_focus') : undefined,
          outlineOffset: ring ? -ctx.metric('TreeNode', 'focusWidth') : undefined,
          outlineStyle: ring ? 'solid' : undefined,
          outlineWidth: ring ? ctx.metric('TreeNode', 'focusWidth') : undefined,
          paddingEnd: ctx.metric('TreeNode', 'labelPaddingEnd'),
          paddingStart: offset * indent
        }
      },
      toggle, icon,
      React.createElement(Text, {
        dataSet: { part: 'text' },
        style: [{ color: disabled ? ctx.color('tree_node_label_disabled') : selected ? ctx.color('tree_node_label_selected') : hovered ? ctx.color('tree_node_label_hover') : ctx.color('tree_node_label'), paddingStart: ctx.metric('TreeNode', 'labelTextPaddingStart') }, ctx.typeStyle('tree_node_label')]
      }, props.label));
    };
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
      style: [{
        alignItems: 'center',
        backgroundColor: ctx.color(disabled ? 'tree_node_container_disabled' : 'tree_node_container'),
        flexDirection: 'row',
        // A floor, as upstream's label `min-block-size`: scaled text grows the row
        minHeight: height,
        marginStart: stepIn,
        outlineStyle: 'none',
        paddingStart: rowPad
      }, props.style],
      focusable: focused && !disabled,
      tabIndex: disabled ? undefined : focused ? 0 : -1,
      testID: props.testID
    }, function (state) {
      // The active bar is an overlay at the tree's edge, as upstream's
      // `::before`: it takes no room from the row (probe: node
      // `borderLeftWidth` 0)
      return [
        label(state),
        active ? React.createElement(View, { 'aria-hidden': true, dataSet: { part: 'indicator' }, key: 'indicator', style: { backgroundColor: ctx.color('tree_node_indicator'), bottom: 0, position: 'absolute', start: -stepIn, top: 0, width: ctx.metric('TreeNode', 'indicatorWidth') } }) : null
      ];
    });
  }

  TreeNodeComponent.displayName = 'TreeNode';
  return TreeNodeComponent;
}
TreeNode.spec = SPEC;
