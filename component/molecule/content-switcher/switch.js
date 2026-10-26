// Info: Switch - one text segment of a ContentSwitcher: the label, the state
// cells, the selected slab and the separator rule. Composed inside
// ContentSwitcher; standing alone it draws one unselected segment.

import API from './api.switch.js';
import SPEC from './spec.switch.js';


/********************************************************************
Switch factory.

@param {Object} ctx - Component context

@return {Function} - The Switch component
*********************************************************************/
export default function Switch (ctx) {

  const React = ctx.React;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  function SwitchComponent (props) {

    const item = useButton({ disabled: props.disabled === true, onPress: props.onSelect, selected: props.selected === true });
    const state = item.state;
    const live = state.disabled !== true;
    const selected = state.selected === true;
    const engaged = live && (state.hovered === true || state.pressed === true);
    const low = props.lowContrast === true;

    const labelLeaf = !live ? 'content_switcher_label_disabled'
      : selected ? (low ? 'content_switcher_low_contrast_label_selected' : 'content_switcher_label_selected')
        : engaged ? 'content_switcher_label_hover' : 'content_switcher_label';
    const hoverCell = low ? 'content_switcher_low_contrast_container_hover' : 'content_switcher_container_hover';
    const press = ctx.pressPresentation(state, 'content_switcher', {
      colors: {
        '': null,
        '_active': hoverCell,
        '_disabled': null,
        '_focus': null,
        '_hover': hoverCell,
        '_selected': null
      }
    });
    const ring = state.focused === true
      ? React.createElement(View, { 'aria-hidden': true, pointerEvents: 'none', style: {
        borderColor: ctx.color('content_switcher_focus'),
        borderRadius: props.first !== false ? ctx.metric('Switch', 'radius') : 0,
        borderWidth: ctx.metric('Switch', 'focusWidth'),
        bottom: 0, left: 0, position: 'absolute', right: 0, top: 0
      } }, React.createElement(View, { style: {
        borderColor: ctx.color('content_switcher_focus_inset'),
        borderRadius: Math.max(0, ctx.metric('Switch', 'radius') - ctx.metric('Switch', 'focusWidth')),
        borderWidth: 1, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0
      } }))
      : null;
    const size = props.size || 'md';
    const padInline = ctx.metric('Switch', 'paddingInline');
    const iconSize = size === 'lg' ? ctx.metric('Switch', 'iconSizeLarge') : ctx.metric('Switch', 'iconSize');
    const iconLeaf = !live ? 'content_switcher_icon_disabled' : selected ? 'content_switcher_icon_selected' : 'content_switcher_icon';
    const separatorLeaf = !live ? 'content_switcher_separator_disabled' : 'content_switcher_separator';

    const typeName = selected && low ? 'content_switcher_label_selected_low_contrast' : 'content_switcher_label';

    return React.createElement(Pressable, Object.assign({}, item.rootProps, {
      role: 'tab',
      'aria-selected': selected,
      disabled: !live,
      tabIndex: props.active === true ? 0 : -1,
      style: [{
        alignItems: 'center',
        flexDirection: 'row',
        flexBasis: 0,
        flexGrow: props.flex === true ? 1 : 0,

        borderBottomLeftRadius: props.first !== false ? ctx.metric('Switch', 'radius') : 0,
        borderBottomRightRadius: props.last !== false ? ctx.metric('Switch', 'radius') : 0,
        borderTopLeftRadius: props.first !== false ? ctx.metric('Switch', 'radius') : 0,
        borderTopRightRadius: props.last !== false ? ctx.metric('Switch', 'radius') : 0,
        borderBottomColor: live ? ctx.color(low ? 'content_switcher_low_contrast_outline' : 'content_switcher_outline') : ctx.color('content_switcher_outline_disabled'),
        borderBottomWidth: selected === true || state.focused === true || state.pressed === true ? 0 : ctx.metric('Switch', 'outlineWidth'),
        borderTopColor: live ? ctx.color(low ? 'content_switcher_low_contrast_outline' : 'content_switcher_outline') : ctx.color('content_switcher_outline_disabled'),
        borderTopWidth: selected === true || state.focused === true || state.pressed === true ? 0 : ctx.metric('Switch', 'outlineWidth'),
        height: props.segmentHeight === undefined ? ctx.metric('Switch', 'heightMedium') : props.segmentHeight,
        justifyContent: 'flex-start',
        outlineStyle: 'none',
        paddingHorizontal: padInline,
        paddingVertical: ctx.metric('Switch', 'paddingBlock'),
        position: 'relative'
      }, press.container]
    }),
    // The separator: full-height outline under `full`, a short mark under
    // `short` (hidden beside the selected segment by the parent's rule)
    React.createElement(View, { 'aria-hidden': true, style: {
      alignSelf: 'center',
      backgroundColor: props.separator === true ? ctx.color(separatorLeaf) : 'transparent',
      bottom: props.separatorFull === true ? 0 : undefined,
      height: props.separatorFull === true ? undefined : ctx.metric('Switch', 'separatorHeight'),
      left: -ctx.metric('Switch', 'separatorWidth') / 2,
      position: 'absolute',
      top: props.separatorFull === true ? 0 : undefined,
      width: ctx.metric('Switch', 'separatorWidth')
    } }),
    // The selected slab draws as its own layer (upstream ::after) growing from
    // the bottom; the segment's own fill stays transparent at rest
    React.createElement(View, { 'aria-hidden': true, style: {
      backgroundColor: selected === true ? ctx.color(!live ? 'content_switcher_container_selected_disabled' : low ? 'content_switcher_low_contrast_container_selected' : 'content_switcher_container_selected') : 'transparent',
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      ['transform']: selected === true || state.focused === true ? [] : [{ scaleY: 0 }],
      ['transformOrigin']: 'bottom'
    } }),

    React.createElement(View, { 'aria-hidden': true, style: [{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, press.layer] }),
    // The selected-mark seat mounts under every template and on every
    // segment; `hidden` or an unselected segment leaves it display:none
    // so the element tree is the same
    React.createElement(ctx.Registry.Icon, { color: 'content_switcher_icon_selected', name: 'selected_indicator', size: iconSize, style: { display: props.selectedMark === true && selected === true ? 'flex' : 'none', marginEnd: ctx.metric('Switch', 'iconGap') } }),
    props.icon !== undefined
      ? React.createElement(ctx.Registry.Icon, { color: iconLeaf, name: props.icon, size: iconSize, style: { marginEnd: ctx.metric('Switch', 'iconGap') } })
      : null,
    React.createElement(Text, { numberOfLines: 1, style: [ctx.typeStyle(typeName), { color: ctx.color(labelLeaf) }] }, props.text),
    ring);

  }

  SwitchComponent.displayName = 'Switch';

  return SwitchComponent;

}

Switch.api = API;

Switch.spec = SPEC;
