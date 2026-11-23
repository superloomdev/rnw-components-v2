// Info: HeaderPanel member. The panel a global action opens: expanded, a
// `control.header_panel_width` column at the end of the space it covers,
// from `control.header_height` down to its bottom, on
// `color.header_panel_container` between two `border.width_01` rules in
// `color.header_border`, its text in `color.header_panel_label`, stacked
// at `stacking.header`. Collapsed it takes no room. It mounts through an
// overlay host where one is mounted and covers the viewport otherwise, as
// upstream's fixed panel does; Escape calls `onHeaderPanelFocus`. It must
// be composed inside Header.

import SPEC from './spec.header-panel.js';


/********************************************************************
HeaderPanel factory.

@param {Object} ctx - Component context

@return {Function} - The HeaderPanel component
*********************************************************************/
export default function HeaderPanel (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useEscapeKey, useOverlay, useViewportLayer } = ctx.behaviors;


  /********************************************************************
  HeaderPanel component.

  @param {Object} props - See `api.header-panel.js`

  @return {Object|null} - React element, or null when collapsed or hosted
  *********************************************************************/
  function HeaderPanelComponent (props) {

    const expanded = props.expanded === true;
    const requestClose = function () {
      if (Utils.isFunction(props.onHeaderPanelFocus)) {
        props.onHeaderPanelFocus();
      }
    };
    useEscapeKey(requestClose, expanded);

    // The layer covers its space and lets every press through but the
    // panel's; the panel hangs under the header at the end edge
    // (`_header-panel.scss:22-41`)
    const layerStyle = useViewportLayer();
    const rule = ctx.color('header_border');
    const content = Utils.isString(props.children)
      ? React.createElement(Text, { dir: 'auto', style: [ctx.typeStyle('body_compact_01'), { color: ctx.color('header_panel_label') }] }, props.children)
      : props.children;
    const layer = React.createElement(View, {
      pointerEvents: 'box-none',
      style: [layerStyle, { zIndex: ctx.metric('HeaderPanel', 'level') }]
    }, React.createElement(View, {
      'aria-label': props.accessibilityLabel,
      testID: Utils.isString(props.testID) ? props.testID : 'header-panel',
      style: {
        backgroundColor: ctx.color('header_panel_container'),
        borderEndColor: rule,
        borderEndWidth: ctx.metric('HeaderPanel', 'borderWidth'),
        borderStartColor: rule,
        borderStartWidth: ctx.metric('HeaderPanel', 'borderWidth'),
        bottom: 0,
        end: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: ctx.metric('HeaderPanel', 'top'),
        width: ctx.metric('HeaderPanel', 'width')
      }
    }, content));

    // The layer renders through an overlay host where one is mounted
    const overlay = useOverlay({
      isOpen: expanded,
      name: 'HeaderPanel',
      onClose: requestClose,
      render: function () {
        return layer;
      }
    });

    if (!expanded) {
      return null;
    }
    return overlay.hosted ? null : layer;

  }

  HeaderPanelComponent.displayName = 'HeaderPanel';

  return HeaderPanelComponent;

}

HeaderPanel.spec = SPEC;
