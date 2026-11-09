// Info: IconTab - the icon-only tab: a square of the list's height carrying
// the icon glyph, named by `label` (the Tooltip content and the accessible
// name). Standalone it draws one unselected line icon tab.

import API from './api.icon-tab.js';
import SPEC from './spec.icon-tab.js';


/********************************************************************
IconTab factory.

@param {Object} ctx - Component context

@return {Function} - The IconTab component
*********************************************************************/
export default function IconTab (ctx) {

  const React = ctx.React;
  const { Pressable } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  function IconTabComponent (props) {

    const item = useButton({ disabled: props.disabled === true, onPress: props.onSelect, selected: props.selected === true });
    const state = item.state;
    const live = state.disabled !== true;
    const side = props.listHeight || ctx.metric('IconTab', 'height');
    const engaged = live && (state.hovered === true || state.pressed === true);
    const labelLeaf = !live ? 'tab_label_disabled'
      : state.selected === true ? 'tab_label_selected' : engaged ? 'tab_label_hover' : 'tab_label';
    const trackLeaf = !live ? 'tab_track_disabled' : engaged ? 'tab_track_hover' : 'tab_track';
    const edgeColor = state.selected === true && live ? 'tab_indicator' : trackLeaf;
    const iconSize = ctx.metric('IconTab', 'iconSize');
    const ring = ctx.focusRing('tab', state, 0);

    const face = React.createElement(Pressable, Object.assign({}, item.rootProps, {
      'aria-label': props.label,
      role: 'tab',
      'aria-selected': state.selected === true,
      disabled: !live,
      tabIndex: props.active === true ? 0 : -1,
      testID: props.testID,
      style: [{
        alignItems: 'center',
        borderBottomColor: ctx.color(edgeColor),
        borderBottomWidth: ctx.metric('IconTab', 'trackWidth'),
        height: side,
        justifyContent: 'center',
        marginEnd: ctx.metric('IconTab', 'itemGap'),
        outlineStyle: 'none',
        width: side
      }, ring]
    }), React.createElement(ctx.Registry.Icon, {
      color: labelLeaf,
      name: props.icon,
      size: iconSize
    }));

    // The accessible name shows as a tooltip, the way the IconButton does
    return React.createElement(ctx.Registry.Tooltip, { label: props.label }, face);

  }

  IconTabComponent.displayName = 'IconTab';

  return IconTabComponent;

}

IconTab.api = API;

IconTab.spec = SPEC;
