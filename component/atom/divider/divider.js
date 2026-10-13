// Info: Divider atom. A horizontal rule: a flex row whose only child is the
// line, indented at either end when `inset`, `insetStart` or `insetEnd` ask.
// The line keeps the theme's divider width whatever the indents.
//
// Behavior: none - a rule takes no input.
//
// Accessibility: `role="separator"` on the root; `role`, never
// `accessibilityRole` (a native separator is a different prop answer).

import SPEC from './spec.js';


/********************************************************************
Divider factory.

@param {Object} ctx - Component context

@return {Function} - The Divider component
*********************************************************************/
export default function Divider (ctx) {

  const React = ctx.React;
  const { View } = ctx.ReactNative;


  /********************************************************************
  Divider component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function DividerComponent (props) {

    // Read the geometry through the spec sheet
    const width = ctx.metric('Divider', 'width');
    const inset = ctx.metric('Divider', 'inset');

    // `inset` indents both ends; `insetStart`/`insetEnd` indent one
    const start = props.inset === true || props.insetStart === true;
    const end = props.inset === true || props.insetEnd === true;

    return React.createElement(View, {
      role: 'separator',
      testID: props.testID,
      style: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingEnd: end ? inset : 0,
        paddingStart: start ? inset : 0
      }
    }, React.createElement(View, {
      style: {
        backgroundColor: ctx.color('divider'),
        flexBasis: 'auto',
        flexGrow: 1,
        flexShrink: 1,
        height: width
      }
    }));

  }

  DividerComponent.displayName = 'Divider';

  return DividerComponent;

}

Divider.spec = SPEC;
