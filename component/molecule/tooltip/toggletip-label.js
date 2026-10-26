// Info: ToggletipLabel molecule. The text beside a Toggletip's button: the
// theme's label type in the secondary ink. Composed only inside Toggletip.

import SPEC from './spec.toggletip-label.js';


/********************************************************************
ToggletipLabel factory.

@param {Object} ctx - Component context

@return {Function} - The ToggletipLabel component
*********************************************************************/
export default function ToggletipLabel (ctx) {

  const React = ctx.React;
  const { Text } = ctx.ReactNative;


  /********************************************************************
  ToggletipLabel component.

  @param {Object} props - See `api.toggletip-label.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggletipLabelComponent (props) {

    return React.createElement(Text, {
      style: [ctx.typeStyle('label01'), {
        color: ctx.color('text_secondary'),
        marginEnd: ctx.token('spacing.spacing_03'),
        paddingTop: 0
      }],
      testID: props.testID
    }, props.children);

  }

  ToggletipLabelComponent.displayName = 'ToggletipLabel';

  return ToggletipLabelComponent;

}

ToggletipLabel.spec = SPEC;
