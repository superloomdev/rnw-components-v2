// Info: Section molecule. A plain container that raises the heading level
// of every Heading inside it by one, up to six - the shared heading
// context carries the level and the registry Text reads it.
//
// Behavior: `useSectionLevel` - the level for the section's subtree: the
// enclosing level plus one, or the `level` override, clamped to six.
//
// Accessibility: a plain container; no role and no naming.

import SPEC from './spec.section.js';


/********************************************************************
Section factory.

@param {Object} ctx - Component context

@return {Function} - The Section component
*********************************************************************/
export default function Section (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useSectionLevel, HeadingLevelProvider } = ctx.behaviors;


  /********************************************************************
  One child to an element: bare text renders through the registry Text -
  a raw string or number inside a View crashes a native render - while
  real nodes pass through.

  @param {*}      child - The child
  @param {Number} key   - List key

  @return {Object} - React element
  *********************************************************************/
  function childOf (child, key) {

    if (Utils.isString(child) || Utils.isNumber(child)) {
      return React.createElement(ctx.Registry.Text, { key: key }, child);
    }

    return child;

  }


  /********************************************************************
  Section component.

  @param {Object} props - See `api.section.js`

  @return {Object} - React element
  *********************************************************************/
  function SectionComponent (props) {

    const level = useSectionLevel(props.level);

    return React.createElement(HeadingLevelProvider, { level: level },
      React.createElement(View, { testID: props.testID },
        React.Children.toArray(props.children).map(childOf)));

  }

  SectionComponent.displayName = 'Section';

  return SectionComponent;

}

Section.spec = SPEC;
