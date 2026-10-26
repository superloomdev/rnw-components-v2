// Info: TabPanel - the content one tab labels. Composition only: Tabs/TabPanels
// pass `id`, `labelledBy` and `hidden` (the panel stays mounted for the id
// wiring, as upstream keeps them in the DOM); `contained` draws the
// tab_panel_contained fill behind the content.

import API from './api.tab-panel.js';
import SPEC from './spec.tab-panel.js';


/********************************************************************
TabPanel factory.

@param {Object} ctx - Component context

@return {Function} - The TabPanel component
*********************************************************************/
export default function TabPanel (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  function TabPanelComponent (props) {

    return React.createElement(View, {
      'aria-hidden': props.hidden === true,
      'aria-labelledby': props.labelledBy,
      id: props.id,
      role: 'tabpanel',
      testID: props.testID,
      style: {
        backgroundColor: props.contained === true ? ctx.color('tab_panel_contained_container') : 'transparent',
        display: props.hidden === true ? 'none' : 'flex',
        outlineColor: ctx.color('tab_focus_ring'),
        outlineStyle: 'none',
        outlineWidth: ctx.metric('TabPanel', 'focusWidth'),
        padding: ctx.metric('TabPanel', 'padding')
      }
    }, props.children);

  }

  TabPanelComponent.displayName = 'TabPanel';

  return TabPanelComponent;

}

TabPanel.api = API;

TabPanel.spec = SPEC;
