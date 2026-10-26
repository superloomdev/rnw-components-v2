// Info: Tabs composite. Renders `ctx.Registry.TabList` (the `role="tablist"`
// bar of `role="tab"` buttons with the selection indicator, keyboard
// movement and the theme's tab cells) and, when `panels` is given,
// `ctx.Registry.TabPanels` below it, wiring each tab's id to its panel
// (`aria-controls` / `aria-labelledby`).

import API from './api.js';
import SPEC from './spec.js';


/********************************************************************
Tabs factory.

@param {Object} ctx - Component context

@return {Function} - The Tabs component
*********************************************************************/
export default function Tabs (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;
  const { useTabsState } = ctx.behaviors;


  /********************************************************************
  Tabs component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function TabsComponent (props) {

    const items = ctx.Utils.isArray(props.items) ? props.items : [];
    const panels = ctx.Utils.isArray(props.panels) ? props.panels : null;
    const tabs = useTabsState({
      activation: props.activation,
      defaultSelectedIndex: props.defaultSelectedIndex,
      onChange: props.onChange,
      selectedIndex: props.selectedIndex
    });
    const baseId = 'tabs-' + React.useId();

    // The bar is the list; the panels draw under it when given
    return React.createElement(View, null,
      React.createElement(ctx.Registry.TabList, {
        accessibilityLabel: props.accessibilityLabel,
        activation: props.activation,
        baseId: baseId,
        defaultSelectedIndex: props.defaultSelectedIndex,
        dismissable: props.dismissable,
        items: items,
        onChange: props.onChange,
        onTabCloseRequest: props.onTabCloseRequest,
        selectedIndex: props.selectedIndex,
        testID: props.testID,
        variant: props.variant
      }),
      panels === null ? null : React.createElement(ctx.Registry.TabPanels, {
        baseId: baseId,
        contained: props.variant === 'contained',
        panels: panels,
        selectedIndex: tabs.state.selectedIndex
      }));

  }

  TabsComponent.displayName = 'Tabs';

  return TabsComponent;

}

Tabs.api = API;
Tabs.spec = SPEC;
