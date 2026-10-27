// Info: IconSwitch - the icon-only segment of a ContentSwitcher: the icon
// glyph centered on the segment, named by `label` (the Tooltip content and
// the accessible name). Composed inside ContentSwitcher.

import API from './api.icon-switch.js';
import SPEC from './spec.icon-switch.js';


/********************************************************************
IconSwitch factory.

@param {Object} ctx - Component context

@return {Function} - The IconSwitch component
*********************************************************************/
export default function IconSwitch (ctx) {

  const React = ctx.React;
  const { Pressable, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  function IconSwitchComponent (props) {

    const [faceSize, onFaceLayout] = ctx.useFaceSize();
    const item = useButton({ disabled: props.disabled === true, onPress: props.onSelect, selected: props.selected === true });
    const state = item.state;
    const live = state.disabled !== true;
    const selected = state.selected === true;
    const engaged = live && (state.hovered === true || state.pressed === true);
    const low = props.lowContrast === true;
    const size = props.size || 'md';
    const iconSize = size === 'lg' ? ctx.metric('IconSwitch', 'iconSizeLarge') : ctx.metric('IconSwitch', 'iconSize');
    const padInline = size === 'lg' ? ctx.metric('IconSwitch', 'paddingInlineLarge') : ctx.metric('IconSwitch', 'paddingInline');

    const iconLeaf = !live ? 'content_switcher_icon_disabled'
      : selected ? (low ? 'content_switcher_low_contrast_icon_selected' : 'content_switcher_icon_selected')
        : engaged ? 'content_switcher_icon_hover' : 'content_switcher_icon_only';
    const hoverCell = low ? 'content_switcher_low_contrast_container_hover' : 'content_switcher_container_hover';
    const press = ctx.pressPresentation(state, 'content_switcher', {
      colors: {
        '': null,
        '_active': low ? 'content_switcher_low_contrast_container_hover' : 'content_switcher_container_hover',
        '_disabled': null,
        '_focus': null,
        '_hover': hoverCell,
        '_selected': null
      }
    });
    const separatorLeaf = !live ? 'content_switcher_separator_disabled' : 'content_switcher_separator';
    const ring = state.focused === true
      ? React.createElement(View, { 'aria-hidden': true, pointerEvents: 'none', style: {
        borderColor: ctx.color('content_switcher_focus'),
        borderRadius: low === true || props.first !== false ? ctx.metric('IconSwitch', 'radius') : 0,
        borderWidth: ctx.metric('IconSwitch', 'focusWidth'),
        bottom: 0, left: 0, position: 'absolute', right: 0, top: 0
      } }, low === true ? null : React.createElement(View, { style: {
        borderColor: ctx.color('content_switcher_focus_inset'),
        borderRadius: Math.max(0, ctx.metric('IconSwitch', 'radius') - ctx.metric('IconSwitch', 'focusWidth')),
        borderWidth: 1, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0
      } }))
      : null;


    const face = React.createElement(View, {
      onLayout: onFaceLayout,
      style: [{
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row',

        borderBottomLeftRadius: props.first !== false ? ctx.metric('IconSwitch', 'radius') : 0,
        borderBottomRightRadius: props.last !== false ? ctx.metric('IconSwitch', 'radius') : 0,
        borderTopLeftRadius: props.first !== false ? ctx.metric('IconSwitch', 'radius') : 0,
        borderTopRightRadius: props.last !== false ? ctx.metric('IconSwitch', 'radius') : 0,
        borderBottomColor: state.focused === true || state.pressed === true ? ctx.color(iconLeaf) : live ? ctx.color('content_switcher_outline') : ctx.color('content_switcher_outline_disabled'),
        borderBottomWidth: selected === true || state.focused === true || state.pressed === true ? 0 : ctx.metric('IconSwitch', 'outlineWidth'),
        borderTopColor: state.focused === true || state.pressed === true ? ctx.color(iconLeaf) : live ? ctx.color('content_switcher_outline') : ctx.color('content_switcher_outline_disabled'),
        borderTopWidth: selected === true || state.focused === true || state.pressed === true ? 0 : ctx.metric('IconSwitch', 'outlineWidth'),
        height: props.segmentHeight === undefined ? ctx.metric('IconSwitch', 'heightMedium') : props.segmentHeight,
        justifyContent: 'center',
        outlineStyle: 'none',
        paddingHorizontal: padInline,
        width: props.segmentHeight === undefined ? ctx.metric('IconSwitch', 'heightMedium') : props.segmentHeight,
        position: 'relative'
      }, press.container]
    },
    React.createElement(View, { 'aria-hidden': true, style: {
      alignSelf: 'center',
      backgroundColor: props.separator === true ? ctx.color(separatorLeaf) : 'transparent',
      bottom: props.separatorFull === true ? 0 : undefined,
      height: props.separatorFull === true ? undefined : ctx.metric('IconSwitch', 'separatorHeight'),
      left: -ctx.metric('IconSwitch', 'separatorWidth') / 2,
      position: 'absolute',
      top: props.separatorFull === true ? 0 : undefined,
      width: ctx.metric('IconSwitch', 'separatorWidth')
    } }),

    // The selected slab draws as its own layer (upstream ::after); the
    // segment's own fill stays transparent at rest
    React.createElement(View, { 'aria-hidden': true, style: {
      backgroundColor: selected === true ? ctx.color(!live ? 'content_switcher_container_selected_disabled' : low ? 'content_switcher_low_contrast_container_selected' : 'content_switcher_container_selected') : (low === true && live === true && state.focused === true && state.hovered === true ? ctx.color('content_switcher_low_contrast_container_hover') : 'transparent'),
      borderRadius: low === true && selected === true && live === true ? ctx.metric('IconSwitch', 'radius') : 0,
      bottom: 0,
      boxShadow: low === true && selected === true && live === true ? 'inset 0 0 0 ' + ctx.metric('IconSwitch', 'outlineWidth') + 'px ' + ctx.color('content_switcher_outline') : undefined,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      ['transform']: selected === true || state.focused === true ? [] : [{ scaleY: 0 }],
      ['transformOrigin']: 'bottom'
    } }),
    React.createElement(View, { 'aria-hidden': true, style: [{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, press.layer] }),
    React.createElement(ctx.Registry.Icon, { color: iconLeaf, name: props.icon, size: iconSize }),
    ring);

    const pressLayer = React.createElement(Pressable, Object.assign({}, item.rootProps, {
      'aria-label': props.label,
      role: 'tab',
      'aria-selected': selected,
      disabled: !live,
      tabIndex: props.active === true ? 0 : -1,
      style: ctx.pressTarget(faceSize)
    }));
    const segment = React.createElement(View, { style: { alignSelf: 'stretch', position: 'relative' } }, face, pressLayer);

    return React.createElement(ctx.Registry.Tooltip, { anchorStyle: props.flex !== false ? { alignSelf: 'stretch', flexBasis: 0, flexGrow: 1 } : { alignSelf: 'stretch' }, label: props.label }, segment);

  }

  IconSwitchComponent.displayName = 'IconSwitch';

  return IconSwitchComponent;

}

IconSwitch.api = API;

IconSwitch.spec = SPEC;
