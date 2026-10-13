// Info: SecondaryButton molecule. A kind wrapper over Button: the call's
// kind wins over the `secondary` default (`Object.assign` with the call's
// props last), so a `kind` prop draws that kind. It adds and reads no
// token: the Button molecule owns the whole contract surface.
//
// Behavior: none - the Button the wrapper mounts owns the input state.
//
// Accessibility: the mounted Button's; this wrapper passes every prop
// through unchanged.

import SPEC from './spec.secondary-button.js';


/********************************************************************
SecondaryButton factory.

@param {Object} ctx - Component context

@return {Function} - The SecondaryButton component
*********************************************************************/
export default function SecondaryButton (ctx) {

  const React = ctx.React;


  /********************************************************************
  SecondaryButton component.

  @param {Object} props - See `api.secondary-button.js`

  @return {Object} - React element
  *********************************************************************/
  function SecondaryButtonComponent (props) {

    // The call's kind wins over the `secondary` default
    return React.createElement(ctx.Registry.Button, Object.assign({ kind: 'secondary' }, props));

  }

  SecondaryButtonComponent.displayName = 'SecondaryButton';

  return SecondaryButtonComponent;

}

SecondaryButton.spec = SPEC;
