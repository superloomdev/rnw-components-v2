// Info: TabsVertical - the vertical tab composition: a column of tabs
// (`ctx.Registry.TabListVertical`) beside the selected panel, the list
// scrolling with fades when `height` constrains it.

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
  const { useTabsState } = ctx.behaviors;


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

    return React.createElement(View, { role: 'none', style: { flexDirection: 'row', height: height === null ? 'auto' : height, position: 'relative' } },
      React.createElement(View, { style: { position: 'relative', width: (listWidth * 100) + '%' } },
        React.createElement(ScrollView, {
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
      panels === null ? null : React.createElement(View, { style: { flexGrow: 1 } },
        React.createElement(ctx.Registry.TabPanels, {
          baseId: baseId,
          panels: panels,
          selectedIndex: tabs.state.selectedIndex
        })));

  }

  TabsVerticalComponent.displayName = 'TabsVertical';

  return TabsVerticalComponent;

}

TabsVertical.api = API;
TabsVertical.spec = SPEC;
