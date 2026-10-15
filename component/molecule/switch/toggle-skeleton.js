// Info: ToggleSkeleton molecule. The toggle's loading shape: the handle's
// circle and a short bar a spacing step after it, both skeleton
// placeholders - the upstream skeleton draws exactly this pair.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves (`aria-hidden`); the
// row carries nothing else.

import SPEC from './spec.toggle-skeleton.js';


/********************************************************************
ToggleSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The ToggleSkeleton component
*********************************************************************/
export default function ToggleSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  ToggleSkeleton component.

  @param {Object} props - See `api.toggle-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggleSkeletonComponent (props) {

    const circle = ctx.metric('ToggleSkeleton', 'circleSize');

    return React.createElement(View, {
      style: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: ctx.metric('ToggleSkeleton', 'barGap')
      },
      testID: props.testID
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: circle,
      radius: ctx.metric('ToggleSkeleton', 'circleRadius'),
      width: circle
    }),
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('ToggleSkeleton', 'barHeight'),
      width: ctx.metric('ToggleSkeleton', 'barWidth')
    }));

  }

  ToggleSkeletonComponent.displayName = 'ToggleSkeleton';

  return ToggleSkeletonComponent;

}

ToggleSkeleton.spec = SPEC;
