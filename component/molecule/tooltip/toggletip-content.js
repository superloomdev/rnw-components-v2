// Info: ToggletipContent molecule. The body of a Toggletip's inverse bubble:
// the body type in the tooltip ink on the `toggletip` padding and max width,
// with the actions row after the text. Composed only inside Toggletip.

import SPEC from './spec.toggletip-content.js';


/********************************************************************
ToggletipContent factory.

@param {Object} ctx - Component context

@return {Function} - The ToggletipContent component
*********************************************************************/
export default function ToggletipContent (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  ToggletipContent component.

  @param {Object} props - See `api.toggletip-content.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggletipContentComponent (props) {

    // The body children are the text; a second child (the actions row) lays
    // out `spacing_05` below it
    const children = React.Children.toArray(props.children);
    const text = children[0];
    const rest = children.slice(1);

    return React.createElement(View, {
      nativeID: props.id,
      style: {
        backgroundColor: ctx.color('tooltip_container'),
        maxWidth: ctx.metric('Toggletip', 'maxWidth'),
        padding: ctx.token('spacing.spacing_05')
      },
      testID: props.testID
    },
    Utils.isString(text) ? React.createElement(Text, {
      style: [ctx.typeStyle('body01'), { color: ctx.color('tooltip_label') }]
    }, text) : text,
    Utils.isEmptyArray(rest) ? null : React.createElement(View, { style: { marginTop: ctx.token('spacing.spacing_05') } }, rest));

  }

  ToggletipContentComponent.displayName = 'ToggletipContent';

  return ToggletipContentComponent;

}

ToggletipContent.spec = SPEC;
