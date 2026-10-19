// Info: Heading molecule. A semantic heading in the theme's type set for
// its level: the shared heading context answers the level (one deeper
// inside each Section), the type set steps down it (heading-06 at level 1
// to heading-01 at level 6) and the color is the primary text. Level and
// header semantics ride the registry Text, which owns text anatomy.
//
// Behavior: `useHeadingLevel` - reads the heading level the enclosing
// Sections publish.
//
// Accessibility: `header` role with the level as its aria level; the host
// maps both to the heading element of that level.

import SPEC from './spec.js';


/********************************************************************
Heading factory.

@param {Object} ctx - Component context

@return {Function} - The Heading component
*********************************************************************/
export default function Heading (ctx) {

  const React = ctx.React;
  const { useHeadingLevel } = ctx.behaviors;


  /********************************************************************
  Heading component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function HeadingComponent (props) {

    // The clamp lives in useSectionLevel; a context fed past the range
    // still renders the deepest heading
    const level = Math.min(useHeadingLevel(), 6);

    return React.createElement(ctx.Registry.Text, {
      accessibilityRole: 'header',
      color: 'text_primary',
      headingLevel: level,
      testID: props.testID,
      type: 'heading0' + (7 - level)
    }, props.children);

  }

  HeadingComponent.displayName = 'Heading';

  return HeadingComponent;

}

Heading.spec = SPEC;
