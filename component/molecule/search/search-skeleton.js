// Info: SearchSkeleton molecule. The search field's loading shape: a single
// skeleton box at the field's size, as the primary reference's search
// skeleton draws it - no label placeholder.
//
// Behavior: none - a skeleton takes no input.
//
// Accessibility: the placeholder hides itself (`aria-hidden`); the root
// carries nothing else.

import SPEC from './spec.search-skeleton.js';

const PCT = '%';


/********************************************************************
SearchSkeleton factory.

@param {Object} ctx - Component context

@return {Function} - The SearchSkeleton component
*********************************************************************/
export default function SearchSkeleton (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;

  // Size -> height metric in the spec sheet
  const SIZES = Object.freeze({ sm: 'heightSmall', md: 'height', lg: 'heightLarge' });


  /********************************************************************
  SearchSkeleton component.

  @param {Object} props - See `api.search-skeleton.js`

  @return {Object} - React element
  *********************************************************************/
  function SearchSkeletonComponent (props) {

    return React.createElement(View, {
      style: { alignSelf: 'stretch' },
      testID: props.testID
    },
    React.createElement(ctx.Registry.SkeletonPlaceholder, {
      height: ctx.metric('SearchSkeleton', SIZES[props.size] || 'height'),
      testID: 'search-skeleton-field',
      width: 100 + PCT
    }));

  }

  SearchSkeletonComponent.displayName = 'SearchSkeleton';

  return SearchSkeletonComponent;

}

SearchSkeleton.spec = SPEC;
