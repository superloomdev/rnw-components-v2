// Info: RadioButtonSkeleton molecule. The radio's loading shape: a single
// label-width bar at the row's own height - the primary reference's
// skeleton draws the label block alone, no circle.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholder hides itself (`aria-hidden`); the row
// carries nothing else.

import SPEC from './spec.radio-button-skeleton.js';


/********************************************************************
RadioButtonSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The RadioButtonSkeleton component
*********************************************************************/
export default function RadioButtonSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  RadioButtonSkeleton component.

  @param {Object} props - See `api.radio-button-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function RadioButtonSkeletonComponent (props) {

    return React.createElement(View, {
      style: {
        alignSelf: 'stretch',
        height: ctx.metric('RadioButtonSkeleton', 'rootHeight')
      },
      testID: props.testID
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('RadioButtonSkeleton', 'height'),
      testID: 'radio-skeleton-label',
      width: ctx.metric('RadioButtonSkeleton', 'width')
    }));

  }

  RadioButtonSkeletonComponent.displayName = 'RadioButtonSkeleton';

  return RadioButtonSkeletonComponent;

}

RadioButtonSkeleton.spec = SPEC;
