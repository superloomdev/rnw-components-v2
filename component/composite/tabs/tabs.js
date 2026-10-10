// Info: Tabs composite. A `role="tablist"` bar of `role="tab"` buttons, one
// per `items` entry, with the theme's tab family cells: the bar's container
// and divider, each tab's track (the `line` variant, the selected tab's
// track carrying the indicator color) or contained fill and separator, the
// selected tab's indicator (`full` or `content` width by
// `anatomy.tab_indicator`, on the bottom edge for `line` and the top for
// `contained`), the label's color and type per state, the state layer, and
// the focus ring. Selection is controllable through `selectedIndex` /
// `onChange`; the tab order roves to the active tab and arrows move and
// select (automatic activation), skipping disabled tabs. Fill, layer,
// separator, track, indicator and label seats mount under every template,
// so the element tree is the same whichever cells the theme fills.

import SPEC from './spec.js';


/********************************************************************
Tabs factory.

@param {Object} ctx - Component context

@return {Function} - The Tabs component
*********************************************************************/
export default function Tabs (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton, useRovingTabIndex, useTabsState } = ctx.behaviors;


  /********************************************************************
  One tab. The press behavior supplies hover, focus, press, selected and
  disabled; every visual seat mounts unconditionally.

  @param {Object} props - { item, index, active, selected, contained, metrics, onActivate, onSelect }

  @return {Object} - React element
  *********************************************************************/
  function TabItem (props) {

    // Init the behavior and the state-derived cells
    const item = useButton({ disabled: props.item.disabled === true, onPress: props.onSelect, selected: props.selected });
    const state = item.state;
    const m = props.metrics;
    const live = state.disabled !== true;
    const engaged = live && (state.hovered === true || state.pressed === true);

    // The label's color and type follow the state; the layer is the theme's state cells
    const labelLeaf = !live ? 'tab_label_disabled'
      : state.selected === true ? (engaged ? 'tab_label_selected_hover' : 'tab_label_selected')
        : engaged ? 'tab_label_hover' : 'tab_label';
    const layerLeaf = !live ? null
      : state.pressed === true ? (state.selected === true ? 'tab_layer_selected_active' : 'tab_layer_active')
        : state.hovered === true ? (state.selected === true ? 'tab_layer_selected_hover' : 'tab_layer_hover') : null;
    const containerLeaf = props.contained
      ? (!live ? 'tab_contained_container' : state.selected === true ? 'tab_contained_container_selected' : state.hovered === true ? 'tab_contained_container_hover' : 'tab_contained_container')
      : null;
    const trackLeaf = !live ? 'tab_track_disabled' : engaged ? 'tab_track_hover' : 'tab_track';

    // The track carries the selected tab's indicator color where a system
    // draws the full-width answer as the tab's own bottom line
    const edgeColor = !props.contained && state.selected === true && live && !m.content
      ? 'tab_indicator' : trackLeaf;

    // The indicator draws only on the selected tab; both seats mount under
    // every template, the undrawn one empty at zero height
    const edge = props.contained ? 'top' : 'bottom';
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
    // tab (nothing leads it), the one after the selected tab and the
    // selected tab itself, whose leading edge reads as part of the selection
    const separator = props.contained === true && props.first !== true && state.selected !== true && props.afterSelected !== true;

    // The focus ring is the family's cells
    const ring = ctx.focusRing('tab', state, 0);

    // Render the tab: fill, layer, separator, label and indicator seats
    return React.createElement(Pressable, Object.assign({}, item.rootProps, {
      role: 'tab',
      'aria-selected': state.selected === true,
      disabled: !live,
      tabIndex: props.active ? 0 : -1,
      style: [
        {
          backgroundColor: containerLeaf === null ? 'transparent' : ctx.color(containerLeaf),
          borderBottomColor: props.contained ? 'transparent' : ctx.color(edgeColor),
          borderBottomWidth: props.contained ? 0 : m.trackWidth,
          height: props.contained ? m.containedHeight : m.height,
          justifyContent: 'flex-start',
          marginEnd: props.contained ? 0 : m.itemGap,
          outlineStyle: 'none',
          paddingHorizontal: m.paddingInline
        },
        ring
      ]
    }),
    React.createElement(View, { 'aria-hidden': true, style: [{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }, { backgroundColor: layerLeaf === null ? 'transparent' : ctx.color(layerLeaf) }] }),
    React.createElement(View, { 'aria-hidden': true, style: { bottom: 0, left: -m.separatorWidth, position: 'absolute', top: 0, width: m.separatorWidth, backgroundColor: separator ? ctx.color('tab_contained_separator') : 'transparent' } }),
    React.createElement(View, { style: { alignSelf: 'center', height: props.contained ? m.containedHeight : m.height, justifyContent: 'center' } },
      React.createElement(Text, {
        style: [ctx.typeStyle(state.selected === true ? 'tab_label_selected' : 'tab_label'), { color: ctx.color(labelLeaf) }, props.contained ? { lineHeight: m.containedHeight - m.containedPaddingBlock * 2 } : null]
      }, props.item.label),
      React.createElement(View, { 'aria-hidden': true, style: indicatorContent })),
    React.createElement(View, { 'aria-hidden': true, style: indicatorFull }));

  }


  /********************************************************************
  Tabs component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function TabsComponent (props) {

    // Init the items, the shared metrics and the state
    const items = Utils.isArray(props.items) ? props.items : [];
    const tabs = useTabsState({
      selectedIndex: props.selectedIndex,
      defaultSelectedIndex: props.defaultSelectedIndex,
      onChange: props.onChange
    });
    const activeIndex = tabs.state.activeIndex;
    const selectedIndex = tabs.state.selectedIndex;
    const contained = props.variant === 'contained';
    const metrics = {
      containedHeight: ctx.metric('Tabs', 'containedHeight'),
      containedPaddingBlock: ctx.metric('Tabs', 'containedPaddingBlock'),
      content: ctx.enum('anatomy.tab_indicator') === 'content' && !contained,
      height: ctx.metric('Tabs', 'height'),
      itemGap: ctx.metric('Tabs', 'itemGap'),
      indicatorRadius: ctx.metric('Tabs', 'indicatorRadius'),
      indicatorWidth: ctx.metric('Tabs', 'indicatorWidth'),
      paddingInline: ctx.metric('Tabs', 'paddingInline'),
      separatorWidth: ctx.metric('Tabs', 'separatorWidth'),
      trackWidth: ctx.metric('Tabs', 'trackWidth')
    };

    // Select a tab: the selection follows activation
    const select = function (index) {
      tabs.setActiveIndex(index);
      tabs.setSelectedIndex(index);
    };

    // The roving move skips disabled tabs in the move's direction
    const move = function (next) {
      const diff = next - activeIndex;
      const dir = Math.abs(diff) === 1 ? Math.sign(diff) : diff > 0 ? -1 : 1;
      let target = next;
      for (let step = 0; step < items.length && items[target] && items[target].disabled === true; step = step + 1) {
        target = (target + dir + items.length) % items.length;
      }
      if (!(items[target] && items[target].disabled === true)) {
        select(target);
      }
    };
    const roving = useRovingTabIndex({
      count: items.length,
      activeIndex: activeIndex,
      onActiveIndexChange: move,
      orientation: 'horizontal'
    });

    // Render the bar
    return React.createElement(View, Object.assign({}, roving.containerProps, {
      role: 'tablist',
      accessibilityLabel: props.accessibilityLabel,
      testID: props.testID,
      style: {
        alignSelf: 'flex-start',
        // The bar hugs its tabs; on web, where a block parent would stretch
        // a plain flex box, the inline form keeps the shrink-wrap
        display: ctx.platform.os === 'web' ? 'inline-flex' : 'flex',
        backgroundColor: ctx.color('tab_container'),
        borderBottomColor: ctx.color('tab_divider'),
        borderBottomWidth: ctx.metric('Tabs', 'dividerWidth'),
        flexDirection: 'row'
      }
    }),
    items.map(function (item, index) {
      return React.createElement(TabItem, {
        active: index === activeIndex,
        afterSelected: index === selectedIndex + 1,
        contained: contained,
        first: index === 0,
        item: item,
        key: index,
        metrics: metrics,
        onSelect: function () {
          select(index);
        },
        selected: index === selectedIndex
      });
    }));

  }

  TabsComponent.displayName = 'Tabs';

  return TabsComponent;

}

Tabs.spec = SPEC;
