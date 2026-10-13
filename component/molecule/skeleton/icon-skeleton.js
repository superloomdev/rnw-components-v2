// Info: IconSkeleton molecule. The skeleton placeholder drawn at the
// smallest icon size - the icon family's export of the placeholder
// SkeletonIcon draws.
//
// Behavior: none - the placeholder carries the reduced-motion answer.
//
// Accessibility: the placeholder hides itself; the wrapper announces
// nothing more.

import SPEC from './spec.icon-skeleton.js';


/********************************************************************
IconSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The IconSkeleton component
*********************************************************************/
export default function IconSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  IconSkeleton component.

  @param {Object} props - See `api.icon-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function IconSkeletonComponent (props) {

    const size = ctx.metric('IconSkeleton', 'size');

    return React.createElement(View, {
      testID: props.testID,
      style: { alignSelf: 'flex-start' }
    }, React.createElement(ctx.Registry.SkeletonPlaceholder, {
      width: size,
      height: size
    }));

  }

  IconSkeletonComponent.displayName = 'IconSkeleton';

  return IconSkeletonComponent;

}

IconSkeleton.spec = SPEC;
