// Info: TabPanels - the panel region below a TabList: one mounted panel per
// tab, the selected one drawn and the rest hidden for the id wiring.

import API from './api.tab-panels.js';
import SPEC from './spec.tab-panels.js';


/********************************************************************
TabPanels factory.

@param {Object} ctx - Component context

@return {Function} - The TabPanels component
*********************************************************************/
export default function TabPanels (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  function TabPanelsComponent (props) {

    const panels = ctx.Utils.isArray(props.panels) ? props.panels : [];
    const selectedIndex = props.selectedIndex || 0;
    const contained = props.contained === true;

    return React.createElement(View, null,
      panels.map(function (panel, index) {
        return React.createElement(ctx.Registry.TabPanel, {
          children: panel,
          contained: contained,
          hidden: index !== selectedIndex,
          id: props.baseId + '-tabpanel-' + index,
          key: index,
          labelledBy: props.baseId + '-tab-' + index
        });
      }));

  }

  TabPanelsComponent.displayName = 'TabPanels';

  return TabPanelsComponent;

}

TabPanels.api = API;

TabPanels.spec = SPEC;
