// Info: Stack molecule. A column or a row whose children sit a spacing
// step apart: `gap` is a step of the spacing scale, never a free literal,
// and a horizontal stack sizes itself to its content.
//
// Behavior: none - a layout row takes no input.
//
// Accessibility: a plain container; no role and no naming.

import SPEC from './spec.js';

// The deepest gap step the scale carries
const MAX_STEP = 13;


/********************************************************************
Stack factory.

@param {Object} ctx - Component context

@return {Function} - The Stack component
*********************************************************************/
export default function Stack (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  Resolve a gap step to its spacing value; anything outside the steps
  draws no gap, as upstream draws none for a value off the scale.

  @param {*} gap - The `gap` prop

  @return {Number|undefined} - The gap, or none
  *********************************************************************/
  function gapOf (gap) {

    if (!Utils.isNumber(gap) || !Number.isInteger(gap) || gap < 1 || gap > MAX_STEP) {
      return undefined;
    }

    return ctx.metric('Stack', 'gap' + (gap < 10 ? '0' + gap : String(gap)));

  }


  /********************************************************************
  Stack component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function StackComponent (props) {

    const horizontal = props.orientation === 'horizontal';

    return React.createElement(View, {
      testID: props.testID,
      style: {
        // The horizontal stack wraps its content, as the inline grid does
        alignSelf: horizontal ? 'flex-start' : undefined,
        flexDirection: horizontal ? 'row' : 'column',
        gap: gapOf(props.gap)
      }
    },
    // Bare string or number children render through the registry Text:
    // raw text inside a View crashes a native render
    React.Children.toArray(props.children).map(function (child, index) {
      return Utils.isString(child) || Utils.isNumber(child)
        ? React.createElement(ctx.Registry.Text, { key: index }, child)
        : child;
    }));

  }

  StackComponent.displayName = 'Stack';

  return StackComponent;

}

Stack.spec = SPEC;
