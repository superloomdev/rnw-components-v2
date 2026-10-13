// Info: preview__ChatButtonSkeleton molecule. The skeleton placeholder in
// the chat button's pill: the button's height for the size, half of it as
// the corner and the skeleton button width. It draws the
// SkeletonPlaceholder atom; the second system ships no skeleton, so the
// shape is a Superloom decision.
//
// Behavior: reduced motion, through the placeholder.
//
// Accessibility: the placeholder's `aria-hidden` - a skeleton announces
// nothing.

import SPEC from './spec.preview-chat-button-skeleton.js';


/********************************************************************
preview__ChatButtonSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The preview__ChatButtonSkeleton component
*********************************************************************/
export default function ChatButtonSkeleton (ctx) {

  const React = ctx.React;

  // Size -> height metric in the spec sheet; the chat button keeps the
  // small, medium and large sizes, anything else draws the large
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'heightMedium', lg: 'height' });


  /********************************************************************
  preview__ChatButtonSkeleton component.

  @param {Object} props - See `api.preview-chat-button-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function ChatButtonSkeletonComponent (props) {

    const height = ctx.metric('preview__ChatButtonSkeleton', SIZES[props.size] || 'height');

    return React.createElement(ctx.Registry.SkeletonPlaceholder, {
      // The chat button's pill: half its height
      height: height,
      radius: height / 2,
      testID: props.testID,
      width: ctx.metric('preview__ChatButtonSkeleton', 'width')
    });

  }

  ChatButtonSkeletonComponent.displayName = 'preview__ChatButtonSkeleton';

  return ChatButtonSkeletonComponent;

}

ChatButtonSkeleton.spec = SPEC;
