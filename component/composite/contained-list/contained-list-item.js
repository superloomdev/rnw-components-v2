// Info: ContainedListItem - one row of a ContainedList. The label paints
// `type.contained_list_item` / `color.contained_list_item_label`; `onPress`
// makes the content a pressable (hover/active fills, the inset button
// ring); `disabled` dims the label only on a clickable item; the icon sits
// in a fixed column `control.contained_list_icon_top` from the top; the
// action hangs at the end over a `control.contained_list_action_space`
// reservation; a 1 px ruler `color.contained_list_divider` under every
// item but the last, inset by `control.contained_list_padding_inline`
// when the list is inset.

import SPEC from './spec.contained-list-item.js';


/********************************************************************
ContainedListItem factory.

@param {Object} ctx - Component context

@return {Function} - The ContainedListItem component
*********************************************************************/
export default function ContainedListItem (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;

  const SIZES = Object.freeze({ lg: 'size_large', md: 'size_medium', sm: 'size_small', xl: 'size_xlarge' });


  /********************************************************************
  ContainedListItem component.

  @param {Object} props - See `api.contained-list-item.js`

  @return {Object} - React element
  *********************************************************************/
  function ContainedListItemComponent (props) {

    // Init the metrics and the interaction state
    const metrics = {
      actionSpace: ctx.metric('ContainedListItem', 'actionSpace'),
      iconGap: ctx.metric('ContainedListItem', 'iconGap'),
      iconSize: ctx.metric('ContainedListItem', 'iconSize'),
      iconTop: ctx.metric('ContainedListItem', 'iconTop'),
      paddingInline: ctx.metric('ContainedListItem', 'paddingInline'),
      rowHeight: ctx.token('size.' + (SIZES[props.size] || SIZES.lg))
    };
    const clickable = Utils.isFunction(props.onPress);
    const disabled = clickable && props.disabled === true;
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const state = { focused: focused, hovered: hovered, pressed: pressed };
    const labelLeaf = disabled ? 'contained_list_item_label_disabled' : 'contained_list_item_label';

    // Build the content: optional icon column, label, optional end action
    const content = React.createElement(View, {
      dataSet: { part: 'content' },
      style: [
        { alignItems: 'flex-start', flexDirection: 'row', minHeight: metrics.rowHeight, paddingEnd: props.action !== null && props.action !== undefined ? metrics.actionSpace : metrics.paddingInline, paddingStart: metrics.paddingInline },
        state.hovered === true ? { backgroundColor: ctx.color('contained_list_item_container_hover') } : null,
        state.pressed === true ? { backgroundColor: ctx.color('contained_list_item_container_active') } : null,
        ctx.focusRing('button', state, 0, { gap: false })
      ]
    },
    Utils.isString(props.icon) ? React.createElement(View, { dataSet: { part: 'icon' }, style: { marginEnd: metrics.iconGap, paddingTop: metrics.iconTop, width: metrics.iconSize } },
      React.createElement(ctx.Registry.Icon, { name: props.icon, size: metrics.iconSize })) : null,
    React.createElement(Text, { style: [ctx.typeStyle('contained_list_item'), { color: ctx.color(labelLeaf), flexShrink: 1 }] }, props.label));

    // Draw the action at the end over the reserved space, the tag at least
    // the layout's small size, as upstream's action constraint floors it
    const action = props.action === 'tag'
      ? React.createElement(ctx.Registry.Tag, { height: ctx.token('size.size_small'), kind: 'default', label: 'Tag', size: props.size === 'sm' ? 'sm' : 'md' })
      : props.action === 'button'
        ? React.createElement(ctx.Registry.IconButton, { icon: 'close', kind: 'ghost' })
        : props.action !== undefined ? props.action : null;

    // The pressable wrapper when clickable; the ruler under all but the last
    const body = clickable ? React.createElement(Pressable, { accessibilityRole: 'button', disabled: disabled, onPress: props.onPress, onHoverIn: function () {
      setHovered(true);
    }, onHoverOut: function () {
      setHovered(false);
    }, onPressIn: function () {
      setPressed(true);
    }, onPressOut: function () {
      setPressed(false);
    }, onFocus: function () {
      setFocused(true);
    }, onBlur: function () {
      setFocused(false);
    } }, content) : content;

    // Return the item with its ruler
    return React.createElement(View, { dataSet: { part: 'item' }, testID: props.testID },
      body,
      action !== null ? React.createElement(View, { dataSet: { part: 'action' }, pointerEvents: 'box-none', style: { alignItems: 'flex-start', end: 0, flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', start: 0, top: 0 } }, action) : null,
      props.last !== true ? React.createElement(View, { dataSet: { part: 'ruler' }, style: { backgroundColor: ctx.color('contained_list_divider'), height: ctx.token('border.width_01'), marginStart: props.inset === true ? metrics.paddingInline : 0 } }) : null);
  }

  ContainedListItemComponent.displayName = 'ContainedListItem';
  return ContainedListItemComponent;
}
ContainedListItem.spec = SPEC;
