// Info: TagSkeleton molecule. The skeleton placeholder in the tag's height
// and corner at the theme's skeleton tag width - a tag stand-in while data
// loads.

import SPEC from './spec.tag-skeleton.js';


/********************************************************************
TagSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The TagSkeleton component
*********************************************************************/
export default function TagSkeleton (ctx) {

  const React = ctx.React;


  /********************************************************************
  TagSkeleton component.

  @param {Object} props - See `api.tag-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function TagSkeletonComponent (props) {

    return React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('TagSkeleton', props.size === 'sm' ? 'heightSmall' : 'height'),
      radius: ctx.metric('TagSkeleton', 'radius'),
      testID: props.testID,
      width: ctx.metric('TagSkeleton', 'width')
    });

  }

  TagSkeletonComponent.displayName = 'TagSkeleton';

  return TagSkeletonComponent;

}

TagSkeleton.spec = SPEC;
