// Info: TabsVertical - the vertical tab composition: a column of tabs
// (`ctx.Registry.TabListVertical`) beside the selected panel, the list
// scrolling with fades when `height` constrains it. Below `breakpoint.md`
// the reference draws a contained horizontal tab list above the panel
// instead, with no height (`Tabs.tsx:272-280,1116-1126`; plan 0162 E13).

import API from './api.tabs-vertical.js';
import SPEC from './spec.tabs-vertical.js';


/********************************************************************
TabsVertical factory.

@param {Object} ctx - Component context

@return {Function} - The TabsVertical component
*********************************************************************/
export default function TabsVertical (ctx) {

  const React = ctx.React;
  const { ScrollView, View } = ctx.ReactNative;
  const { useTabsState, useViewportSize } = ctx.behaviors;


  function TabsVerticalComponent (props) {

    const items = ctx.Utils.isArray(props.items) ? props.items : [];
    const panels = ctx.Utils.isArray(props.panels) ? props.panels : null;
    const tabs = useTabsState({
      defaultSelectedIndex: props.defaultSelectedIndex,
      onChange: props.onChange,
      selectedIndex: props.selectedIndex
    });
    const listWidth = ctx.metric('TabsVertical', 'listRatio');
    const fade = ctx.metric('TabsVertical', 'fadeHeight');
    const container = ctx.color('tab_vertical_container');
    const baseId = 'tabs-v-' + React.useId();
    const height = ctx.Utils.isNumber(props.height) ? props.height : null;
    const panelsNode = panels === null ? null : React.createElement(ctx.Registry.TabPanels, {
      baseId: baseId,
      panels: panels,
      selectedIndex: tabs.state.selectedIndex
    });
    // Below md: the contained TabList over the panel; an unknown window is
    // not narrow
    const viewportWidth = useViewportSize().width;
    if (viewportWidth > 0 && viewportWidth < ctx.metric('TabsVertical', 'bpMd')) {
      return React.createElement(View, { role: 'none' },
        React.createElement(ctx.Registry.TabList, {
          accessibilityLabel: props.accessibilityLabel,
          defaultSelectedIndex: props.defaultSelectedIndex,
          items: items,
          onChange: props.onChange,
          selectedIndex: props.selectedIndex,
          testID: props.testID,
          variant: 'contained'
        }),
        panelsNode);
    }

    return React.createElement(View, { role: 'none', style: { flexDirection: 'row', height: height === null ? 'auto' : height, position: 'relative' } },
      React.createElement(View, { style: { position: 'relative', width: (listWidth * 100) + '%' } },
        React.createElement(ScrollView, {
          dataSet: { part: 'list' },
          showsVerticalScrollIndicator: false,
          style: { backgroundColor: container, flexGrow: 1 }
        }, React.createElement(ctx.Registry.TabListVertical, {
          accessibilityLabel: props.accessibilityLabel,
          defaultSelectedIndex: props.defaultSelectedIndex,
          items: items,
          onChange: props.onChange,
          selectedIndex: props.selectedIndex,
          testID: props.testID
        })),
        height === null ? null : React.createElement(View, { 'aria-hidden': true, style: { backgroundColor: container, height: fade, left: 0, opacity: 0.9, position: 'absolute', right: 0, top: 0 } }),
        height === null ? null : React.createElement(View, { 'aria-hidden': true, style: { backgroundColor: container, bottom: 0, height: fade, left: 0, opacity: 0.9, position: 'absolute', right: 0 } })),
      panelsNode === null ? null : React.createElement(View, { style: { flexGrow: 1 } }, panelsNode));

  }

  TabsVerticalComponent.displayName = 'TabsVertical';

  return TabsVerticalComponent;

}

TabsVertical.api = API;
TabsVertical.spec = SPEC;
