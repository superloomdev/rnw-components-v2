// Info: BreadcrumbSkeleton molecule. A plain row of shimmer bars at
// `control.breadcrumb_skeleton_width` x `_height` through
// `ctx.Registry.SkeletonPlaceholder`, the separators as Breadcrumb's (the
// `control.breadcrumb_gap` `_small` margin and `color.breadcrumb_separator`
// ink after every item, none after the last with `noTrailingSlash`); no
// landmark, as upstream.

import SPEC from './spec.breadcrumb-skeleton.js';


/********************************************************************
BreadcrumbSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The BreadcrumbSkeleton component
*********************************************************************/
export default function BreadcrumbSkeleton (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  BreadcrumbSkeleton component.

  @param {Object} props - See `api.breadcrumb-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function BreadcrumbSkeletonComponent (props) {

    // Init the count, the size and the bar box
    const count = Utils.isNumber(props.items) ? props.items : 3;
    const small = props.size === 'sm';
    const metrics = {
      barHeight: ctx.metric('BreadcrumbSkeleton', 'barHeight'),
      barWidth: ctx.metric('BreadcrumbSkeleton', 'barWidth'),
      gap: ctx.metric('BreadcrumbSkeleton', small ? 'gapSmall' : 'gap')
    };

    // Render the row: one `li`-shaped item per bar, the separator after
    // every item, the last one only without `noTrailingSlash`
    const rows = [];
    for (let index = 0; index < count; index++) {
      rows.push(React.createElement(View, {
        dataSet: { part: 'item' },
        key: index,
        style: { alignItems: 'center', flexDirection: 'row', marginEnd: metrics.gap }
      },
      React.createElement(ctx.Registry.SkeletonPlaceholder, {
        height: metrics.barHeight,
        width: metrics.barWidth
      }),
      index === count - 1 && props.noTrailingSlash === true ? null
        : React.createElement(Text, {
          'aria-hidden': 'true',
          dir: 'auto',
          style: [ctx.typeStyle(small ? 'breadcrumb_small' : 'breadcrumb'), { color: ctx.color('breadcrumb_separator'), marginStart: metrics.gap }]
        }, '/')));
    }
    return React.createElement(View, {
      style: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' },
      testID: props.testID
    }, rows);

  }

  BreadcrumbSkeletonComponent.displayName = 'BreadcrumbSkeleton';

  return BreadcrumbSkeletonComponent;

}

BreadcrumbSkeleton.spec = SPEC;
