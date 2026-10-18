// Info: TextInputSkeleton molecule. The text field's loading shape: a label
// placeholder over a field-sized skeleton box, as the primary reference's
// skeleton draws it.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves (`aria-hidden`); the root
// carries nothing else.

import SPEC from './spec.text-input-skeleton.js';

const PCT = '%';


/********************************************************************
TextInputSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The TextInputSkeleton component
*********************************************************************/
export default function TextInputSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  TextInputSkeleton component.

  @param {Object} props - See `api.text-input-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function TextInputSkeletonComponent (props) {

    return React.createElement(View, {
      style: { alignSelf: 'stretch' },
      testID: props.testID
    },
    props.hideLabel === true ? null : React.createElement(View, {
      style: { marginBottom: ctx.metric('TextInputSkeleton', 'labelGap') }
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('TextInputSkeleton', 'labelHeight'),
      testID: 'text-input-skeleton-label',
      width: ctx.metric('TextInputSkeleton', 'labelWidth')
    })),
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('TextInputSkeleton', SIZES[props.size] || 'height'),
      testID: 'text-input-skeleton-field',
      width: 100 + PCT
    }));

  }

  TextInputSkeletonComponent.displayName = 'TextInputSkeleton';

  return TextInputSkeletonComponent;

}

TextInputSkeleton.spec = SPEC;
