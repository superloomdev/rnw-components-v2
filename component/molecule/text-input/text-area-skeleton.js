// Info: TextAreaSkeleton molecule. The text area's loading shape: a label
// placeholder over the area's fixed-height skeleton box, as the primary
// reference's skeleton draws it.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholders hide themselves (`aria-hidden`); the root
// carries nothing else.

import SPEC from './spec.text-area-skeleton.js';

const PCT = '%';


/********************************************************************
TextAreaSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The TextAreaSkeleton component
*********************************************************************/
export default function TextAreaSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  TextAreaSkeleton component.

  @param {Object} props - See `api.text-area-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function TextAreaSkeletonComponent (props) {

    return React.createElement(View, {
      style: { alignSelf: 'stretch' },
      testID: props.testID
    },
    props.hideLabel === true ? null : React.createElement(View, {
      style: { marginBottom: ctx.metric('TextAreaSkeleton', 'labelGap') }
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('TextAreaSkeleton', 'labelHeight'),
      testID: 'text-area-skeleton-label',
      width: ctx.metric('TextAreaSkeleton', 'labelWidth')
    })),
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('TextAreaSkeleton', 'height'),
      testID: 'text-area-skeleton-field',
      width: 100 + PCT
    }));

  }

  TextAreaSkeletonComponent.displayName = 'TextAreaSkeleton';

  return TextAreaSkeletonComponent;

}

TextAreaSkeleton.spec = SPEC;
