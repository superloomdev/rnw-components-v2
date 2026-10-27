// Info: TabListVertical - the column of tabs inside TabsVertical: one
// `role="tab"` per item on the vertical container, the selected tab's
// 3px leading indicator, 1px dividers and the hover track.

import API from './api.tab-list-vertical.js';
import SPEC from './spec.tab-list-vertical.js';


/********************************************************************
TabListVertical factory.

@param {Object} ctx - Component context

@return {Function} - The TabListVertical component
*********************************************************************/
export default function TabListVertical (ctx) {

  const React = ctx.React;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton, useRovingTabIndex, useTabsState } = ctx.behaviors;

  const clampLines = ctx.metric('TabListVertical', 'labelLines');


  function VerticalTab (props) {
    const item = useButton({ disabled: props.disabled === true, onPress: props.onSelect, selected: props.selected === true });
    const state = item.state;
    const live = state.disabled !== true;
    const labelLeaf = !live ? 'tab_label_disabled' : state.selected === true ? 'tab_label_selected' : 'tab_label';
    const fillLeaf = !live ? 'tab_vertical_item' : state.hovered === true || state.pressed === true ? 'tab_vertical_item_hover' : 'tab_vertical_item';
    const trackLeaf = state.selected === true ? 'tab_indicator' : (live && (state.hovered === true || state.pressed === true)) ? 'tab_vertical_track_hover' : 'tab_vertical_track';
    const ring = ctx.focusRing('tab', state, 0);
    return React.createElement(Pressable, Object.assign({}, item.rootProps, {
      role: 'tab',
      'aria-selected': state.selected === true,
      disabled: !live,
      tabIndex: props.active === true ? 0 : -1,
      style: [{
        backgroundColor: ctx.color(fillLeaf),
        borderBottomColor: ctx.color('tab_vertical_divider'),
        borderBottomWidth: ctx.metric('TabListVertical', 'dividerWidth'),
        borderRightColor: ctx.color('tab_vertical_divider'),
        borderRightWidth: state.selected === true ? 0 : ctx.metric('TabListVertical', 'dividerWidth'),
        height: ctx.metric('TabListVertical', 'height'),
        justifyContent: 'center',
        outlineStyle: 'none',
        paddingHorizontal: ctx.metric('TabListVertical', 'paddingInline')
      }, ring]
    }),
    React.createElement(View, { 'aria-hidden': true, style: { backgroundColor: ctx.color(trackLeaf), bottom: 0, left: 0, position: 'absolute', top: 0, width: ctx.metric('TabListVertical', 'indicatorWidth') } }),
    React.createElement(Text, {
      numberOfLines: clampLines,
      style: [ctx.typeStyle(state.selected === true ? 'tab_label_selected' : 'tab_label'), { color: ctx.color(labelLeaf) }]
    }, props.label));
  }


  function TabListVerticalComponent (props) {

    const items = ctx.Utils.isArray(props.items) ? props.items : [];
    const tabs = useTabsState({
      defaultSelectedIndex: props.defaultSelectedIndex,
      onChange: props.onChange,
      selectedIndex: props.selectedIndex
    });
    const activeIndex = tabs.state.activeIndex;
    const selectedIndex = tabs.state.selectedIndex;

    const select = function (index) {
      tabs.setActiveIndex(index);
      tabs.setSelectedIndex(index);
    };
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
      orientation: 'vertical'
    });

    return React.createElement(View, Object.assign({}, roving.containerProps, {
      role: 'tablist',
      accessibilityLabel: props.accessibilityLabel,
      testID: props.testID,
      style: { flexDirection: 'column', minHeight: 0, overflow: 'hidden' }
    }),
    items.map(function (item, index) {
      return React.createElement(VerticalTab, {
        active: index === activeIndex,
        disabled: item.disabled === true,
        key: index,
        label: item.label,
        onSelect: function () {
          select(index);
        },
        selected: index === selectedIndex
      });
    }));

  }

  TabListVerticalComponent.displayName = 'TabListVertical';

  return TabListVerticalComponent;

}

TabListVertical.api = API;

TabListVertical.spec = SPEC;
