// Info: Text atom. Wraps the one React Native text element: the type set
// and the color are token leaves read through the context, and the break
// mode decides whether a single line is cut with an ellipsis. It composes
// no behavior and no other component.

import SPEC from './spec.js';


/********************************************************************
Text factory.

@param {Object} ctx - Component context

@return {Function} - The Text component
*********************************************************************/
export default function Text (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const NativeText = ctx.ReactNative.Text;

  // Break modes that cut a single line; `wrap` and absent wrap freely
  const CUT_MODES = ['head', 'middle', 'tail'];


  /********************************************************************
  Text component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function TextComponent (props) {

    // Read the type set and the color through the context
    const typeStyle = ctx.typeStyle(Utils.isString(props.type) ? props.type : 'body_compact_02');
    const textColor = ctx.color(Utils.isString(props.color) ? props.color : 'text_primary');

    // A cut mode renders one line with the ellipsis where it says
    const cut = Utils.inArray(CUT_MODES, props.breakMode);

    // Render the text element
    return React.createElement(NativeText, {
      accessibilityRole: props.accessibilityRole,
      ellipsizeMode: cut ? props.breakMode : undefined,
      numberOfLines: cut ? 1 : undefined,
      style: [typeStyle, { color: textColor }, props.style],
      testID: props.testID
    }, Utils.isNullOrUndefined(props.text) ? props.children : props.text);

  }

  TextComponent.displayName = 'Text';

  return TextComponent;

}

Text.spec = SPEC;
