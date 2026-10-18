// Info: CheckboxSkeleton molecule. The checkbox's loading shape: a single
// label-width bar seated where the row's text would start - the space the
// missing box and its gap take stays empty, as the primary reference's
// skeleton draws it.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholder hides itself (`aria-hidden`); the row
// carries nothing else.

import SPEC from './spec.checkbox-skeleton.js';


/********************************************************************
CheckboxSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The CheckboxSkeleton component
*********************************************************************/
export default function CheckboxSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  CheckboxSkeleton component.

  @param {Object} props - See `api.checkbox-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function CheckboxSkeletonComponent (props) {

    return React.createElement(View, {
      style: {
        alignSelf: 'stretch',
        height: ctx.metric('CheckboxSkeleton', 'rootHeight'),
        marginBottom: ctx.metric('CheckboxSkeleton', 'marginBottom')
      },
      testID: props.testID
    },
    React.createElement(View, {
      // The live row's label starts after the box and its gap; the bar
      // keeps that offset so a loaded row lands in the same place
      style: {
        position: 'absolute',
        start: ctx.metric('CheckboxSkeleton', 'insetStart'),
        top: ctx.metric('CheckboxSkeleton', 'insetTop')
      }
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('CheckboxSkeleton', 'height'),
      testID: 'checkbox-skeleton-label',
      width: ctx.metric('CheckboxSkeleton', 'width')
    })));

  }

  CheckboxSkeletonComponent.displayName = 'CheckboxSkeleton';

  return CheckboxSkeletonComponent;

}

CheckboxSkeleton.spec = SPEC;
