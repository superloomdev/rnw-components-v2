// Info: Tab - one item of a tab list: the label, an optional icon and
// secondary line, the selected and disabled states, the state layer, the
// indicator seats and, when the list is dismissable, the close button.
// Composed inside Tabs (the list passes the state and callbacks); standing
// alone it draws one unselected line tab.

import API from './api.tab.js';
import SPEC from './spec.tab.js';


/********************************************************************
Tab factory.

@param {Object} ctx - Component context

@return {Function} - The Tab component
*********************************************************************/
export default function Tab (ctx) {

  const React = ctx.React;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  /********************************************************************
  Tab component.

  @param {Object} props - See `api.tab.js`

  @return {Object} - React element
  *********************************************************************/
  function TabComponent (props) {

    // Init the behavior and the state-derived cells
    const item = useButton({ disabled: props.disabled === true, onPress: props.onSelect, selected: props.selected === true });
    const [faceSize, onFaceLayout] = ctx.useFaceSize();
    const [closeFaceSize, onCloseFaceLayout] = ctx.useFaceSize();
    const state = item.state;
    // The list passes its resolved metrics; standing alone the tab reads
    // its own spec numbers so one item draws without a parent
    const m = props.metrics !== undefined ? props.metrics : {
      containedHeight: ctx.metric('Tab', 'containedHeight'),
      containedPaddingBlock: ctx.metric('Tab', 'containedPaddingBlock'),
      content: ctx.enum('anatomy.tab_indicator') === 'content',
      height: ctx.metric('Tab', 'height'),
      itemGap: ctx.metric('Tab', 'itemGap'),
      indicatorRadius: ctx.metric('Tab', 'indicatorRadius'),
      indicatorWidth: ctx.metric('Tab', 'indicatorWidth'),
      paddingInline: ctx.metric('Tab', 'paddingInline'),
      separatorWidth: ctx.metric('Tab', 'separatorWidth'),
      trackWidth: ctx.metric('Tab', 'trackWidth')
    };
    const live = state.disabled !== true;
    const engaged = live && (state.hovered === true || state.pressed === true);
    const contained = props.variant === 'contained';

    // The label's color and type follow the state; the layer is the theme's state cells
    const labelLeaf = !live ? 'tab_label_disabled'
      : state.selected === true ? (engaged ? 'tab_label_selected_hover' : 'tab_label_selected')
        : engaged ? 'tab_label_hover' : 'tab_label';
    const layerLeaf = !live ? null
      : state.pressed === true ? (state.selected === true ? 'tab_layer_selected_active' : 'tab_layer_active')
        : state.hovered === true ? (state.selected === true ? 'tab_layer_selected_hover' : 'tab_layer_hover') : null;
    const containerLeaf = contained
      ? (!live ? 'tab_contained_container' : state.selected === true ? 'tab_contained_container_selected' : state.hovered === true ? 'tab_contained_container_hover' : 'tab_contained_container')
      : null;
    const trackLeaf = !live ? 'tab_track_disabled' : engaged ? 'tab_track_hover' : 'tab_track';
    const edgeColor = !contained && state.selected === true && live && !m.content
      ? 'tab_indicator' : trackLeaf;

    // The indicator draws only on the selected tab; both seats mount under
    // every template, the undrawn one empty at zero height
    const edge = contained ? 'top' : 'bottom';
    const indicatorBase = { height: m.indicatorWidth, position: 'absolute' };
    const indicatorRadius = edge === 'bottom'
      ? { borderTopLeftRadius: m.indicatorRadius, borderTopRightRadius: m.indicatorRadius }
      : { borderBottomLeftRadius: m.indicatorRadius, borderBottomRightRadius: m.indicatorRadius };
    const indicatorFull = Object.assign({ left: 0, right: 0, backgroundColor: 'transparent' }, indicatorBase, indicatorRadius);
    const indicatorContent = Object.assign({ left: 0, right: 0, backgroundColor: 'transparent' }, indicatorBase, indicatorRadius);
    indicatorFull[edge] = edge === 'bottom' ? -m.trackWidth : 0;
    indicatorContent[edge] = 0;
    if (state.selected === true) {
      const drawn = { backgroundColor: ctx.color('tab_indicator') };
      if (m.content) {
        Object.assign(indicatorContent, drawn);
      } else {
        Object.assign(indicatorFull, drawn);
      }
    }

    // A contained tab draws a separator on its leading edge, save the first
    // tab, the one after the selected tab and the selected tab itself
    const separator = contained === true && props.first !== true && state.selected !== true && props.afterSelected !== true;

    // The dismissable close button sits at the end; Delete closes from the tab
    const dismissable = props.dismissable === true;
    const onCloseKey = function (event) {
      if (event.key === 'Delete' && dismissable && typeof props.onClose === 'function') {
        props.onClose(props.index);
      }
    };
    const closeLeaf = !live ? 'tab_close_icon_disabled' : state.selected === true ? 'tab_close_icon_selected' : 'tab_close_icon';

    // The icon: leading on a dismissable tab, trailing otherwise; its ink
    // aliases the label's cell for the state it is in
    const iconSize = ctx.metric('Tab', 'iconSize');
    const icon = props.icon !== undefined && props.icon !== null
      ? React.createElement(View, { 'aria-hidden': true, style: { alignItems: 'center', height: iconSize, justifyContent: 'center', width: iconSize, [dismissable ? 'marginEnd' : 'marginStart']: ctx.metric('Tab', 'iconGap') } },
        React.createElement(ctx.Registry.Icon, { color: labelLeaf, name: props.icon, size: iconSize }))
      : null;
    const closeFace = dismissable
      ? React.createElement(View, { 'aria-hidden': true, onLayout: onCloseFaceLayout, style: { alignItems: 'center', height: ctx.metric('Tab', 'closeSize'), justifyContent: 'center', position: 'absolute', end: ctx.metric('Tab', 'closeSize') / 4, top: 0, bottom: 0, width: ctx.metric('Tab', 'closeSize') } },
        React.createElement(ctx.Registry.Icon, { color: closeLeaf, name: 'close', size: ctx.metric('Tab', 'closeIconSize') }))
      : null;
    const closeLayer = dismissable
      ? React.createElement(Pressable, {
        'aria-label': 'Remove ' + props.label + ' tab',
        onPress: function () {
          if (typeof props.onClose === 'function') {
            props.onClose(props.index);
          }
        },
        role: 'button',
        tabIndex: -1,
        style: [{ position: 'absolute', end: ctx.metric('Tab', 'closeSize') / 4, top: ctx.metric('Tab', 'closeSize') / 4 }, ctx.pressTarget(closeFaceSize)]
      })
      : null;

    // The focus ring is the family's cells
    const ring = ctx.focusRing('tab', state, 0);
    const paddingEnd = dismissable ? ctx.metric('Tab', contained ? 'containedDismissPaddingEnd' : 'dismissPaddingEnd') : m.paddingInline;

    // Render the tab: fill, layer, separator, icon, label, secondary label,
    // indicator seats and the close button
    return React.createElement(View, { style: { marginEnd: contained ? 0 : m.itemGap, position: 'relative' } },
      React.createElement(View, {
        onLayout: onFaceLayout,
        style: [
          {
            alignItems: 'center',
            backgroundColor: containerLeaf === null ? 'transparent' : ctx.color(containerLeaf),
            borderBottomColor: contained ? 'transparent' : ctx.color(edgeColor),
            borderBottomWidth: contained ? 0 : m.trackWidth,
            flexDirection: 'row',
            minHeight: props.tall === true ? ctx.metric('Tab', 'containedTallHeight') : contained ? m.containedHeight : m.height,
            justifyContent: 'flex-start',
            outlineStyle: 'none',
            paddingEnd: paddingEnd,
            paddingStart: m.paddingInline,
            position: 'relative'
          },
          ring
        ]
      },
      React.createElement(View, { 'aria-hidden': true, style: [{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, { backgroundColor: layerLeaf === null ? 'transparent' : ctx.color(layerLeaf) }] }),
      React.createElement(View, { 'aria-hidden': true, style: { bottom: 0, left: -m.separatorWidth, position: 'absolute', top: 0, width: m.separatorWidth, backgroundColor: separator ? ctx.color('tab_contained_separator') : 'transparent' } }),
      // The label column keeps the anchor's DOM: its second child is the
      // content indicator seat; the icon sits beside the label text inside it
      // The label wrapper sits half a track width down on a line template (the
      // track-less content-indicator template leaves it at zero)
      React.createElement(View, { style: { alignSelf: 'center', justifyContent: 'center', position: 'relative', top: contained ? 0 : m.trackWidth / 2 } },
        React.createElement(View, { style: { alignItems: 'center', flexDirection: 'row' } },
          dismissable === true ? icon : null,
          React.createElement(Text, {
            style: [ctx.typeStyle(state.selected === true ? 'tab_label_selected' : 'tab_label'), { color: ctx.color(labelLeaf) }, contained && props.tall !== true ? { lineHeight: m.containedHeight - m.containedPaddingBlock * 2 } : null]
          }, props.label),
          dismissable !== true ? icon : null),
        React.createElement(View, { 'aria-hidden': true, style: indicatorContent }),
        props.secondaryLabel !== undefined && props.tall === true
          ? React.createElement(Text, { style: [ctx.typeStyle('tab_secondary_label'), { color: ctx.color(labelLeaf) }] }, props.secondaryLabel)
          : null),
      React.createElement(View, { 'aria-hidden': true, style: indicatorFull })),
      React.createElement(Pressable, Object.assign({}, item.rootProps, props.rovingProps, {
        onKeyDown: onCloseKey,
        role: 'tab',
        'aria-selected': state.selected === true,
        disabled: !live,
        tabIndex: props.active === true ? 0 : -1,
        style: ctx.pressTarget(faceSize)
      })),
      closeFace,
      closeLayer);

  }

  TabComponent.displayName = 'Tab';

  return TabComponent;

}

Tab.api = API;
Tab.spec = SPEC;
