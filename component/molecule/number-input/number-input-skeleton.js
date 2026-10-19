// Info: NumberInputSkeleton molecule. The number field's loading shape: the
// text input's own skeleton - label placeholder over a field-height box -
// kept at the number field's minimum width, as the primary reference's
// skeleton keeps its input's width.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves (`aria-hidden`); the root
// carries nothing else.

import SPEC from './spec.number-input-skeleton.js';


/********************************************************************
NumberInputSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The NumberInputSkeleton component
*********************************************************************/
export default function NumberInputSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  NumberInputSkeleton component.

  @param {Object} props - See `api.number-input-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function NumberInputSkeletonComponent (props) {

    return React.createElement(View, {
      style: { alignSelf: 'stretch', minWidth: ctx.metric('NumberInputSkeleton', 'minWidth') },
      testID: props.testID
    },
    React.createElement(ctx.Registry.TextInputSkeleton, {
      hideLabel: props.hideLabel === true,
      size: props.size
    }));

  }

  NumberInputSkeletonComponent.displayName = 'NumberInputSkeleton';

  return NumberInputSkeletonComponent;

}

NumberInputSkeleton.spec = SPEC;
