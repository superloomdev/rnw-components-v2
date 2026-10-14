// Info: SkeletonIcon molecule. The skeleton placeholder drawn at the
// smallest icon size.
//
// Behavior: none - the placeholder carries the reduced-motion answer.
//
// Accessibility: the placeholder hides itself; the wrapper announces
// nothing more.

import SPEC from './spec.js';


/********************************************************************
SkeletonIcon factory.

@param {Object} ctx - Component context

@return {Function} - The SkeletonIcon component
*********************************************************************/
export default function SkeletonIcon (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  SkeletonIcon component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function SkeletonIconComponent (props) {

    const size = ctx.metric('SkeletonIcon', 'size');

    return React.createElement(View, {
      testID: props.testID,
      style: { alignSelf: 'flex-start' }
    }, React.createElement(ctx.Registry.SkeletonPlaceholder, {
      width: size,
      height: size
    }));

  }

  SkeletonIconComponent.displayName = 'SkeletonIcon';

  return SkeletonIconComponent;

}

SkeletonIcon.spec = SPEC;
