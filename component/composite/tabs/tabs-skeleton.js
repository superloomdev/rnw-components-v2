// Info: TabsSkeleton - the placeholder shape of a tab list while content
// loads: five items, each a `tab_skeleton` cell bar over a thin underline.

import API from './api.tabs-skeleton.js';
import SPEC from './spec.tabs-skeleton.js';


/********************************************************************
TabsSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The TabsSkeleton component
*********************************************************************/
export default function TabsSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  function TabsSkeletonComponent (props) {

    const width = ctx.metric('TabsSkeleton', 'itemWidth');
    const barHeight = ctx.metric('TabsSkeleton', 'barHeight');
    const padding = ctx.metric('TabsSkeleton', 'paddingInline');
    const fill = ctx.color('skeleton_element');
    const barFill = ctx.color('skeleton_background');

    return React.createElement(View, { 'aria-hidden': true, role: 'none', testID: props.testID, style: { flexDirection: 'row' } },
      [1, 2, 3, 4, 5].map(function (n) {
        return React.createElement(View, { key: n, style: { borderBottomColor: fill, borderBottomWidth: ctx.metric('TabsSkeleton', 'trackWidth'), height: ctx.metric('TabsSkeleton', 'itemHeight'), justifyContent: 'center', paddingHorizontal: padding, width: width } },
          React.createElement(View, { style: { backgroundColor: barFill, height: barHeight } }));
      }));

  }

  TabsSkeletonComponent.displayName = 'TabsSkeleton';

  return TabsSkeletonComponent;

}

TabsSkeleton.api = API;

TabsSkeleton.spec = SPEC;
