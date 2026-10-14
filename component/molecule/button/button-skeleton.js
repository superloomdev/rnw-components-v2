// Info: ButtonSkeleton molecule. The skeleton placeholder in the button's
// shape: the button's height for the size, the button's corner and the
// skeleton button width. It draws the SkeletonPlaceholder atom; the second
// system ships no skeleton, so the shape is a Superloom decision.
//
// Behavior: reduced motion, through the placeholder.
//
// Accessibility: the placeholder's `aria-hidden` - a skeleton announces
// nothing.

import SPEC from './spec.button-skeleton.js';


/********************************************************************
ButtonSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The ButtonSkeleton component
*********************************************************************/
export default function ButtonSkeleton (ctx) {

  const React = ctx.React;

  // Size -> height metric in the spec sheet, as Button's
  const SIZES = Object.freeze({
    xs: 'heightXsmall',
    sm: 'heightSmall',
    md: 'heightMedium',
    lg: 'height',
    xl: 'heightXlarge',
    '2xl': 'height2xlarge'
  });


  /********************************************************************
  ButtonSkeleton component.

  @param {Object} props - See `api.button-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function ButtonSkeletonComponent (props) {

    return React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('ButtonSkeleton', SIZES[props.size] || 'height'),
      radius: ctx.metric('ButtonSkeleton', 'radius'),
      testID: props.testID,
      width: ctx.metric('ButtonSkeleton', 'width')
    });

  }

  ButtonSkeletonComponent.displayName = 'ButtonSkeleton';

  return ButtonSkeletonComponent;

}

ButtonSkeleton.spec = SPEC;
