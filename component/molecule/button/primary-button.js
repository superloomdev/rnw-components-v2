// Info: PrimaryButton molecule. A kind wrapper over Button: the call's
// kind wins over the `primary` default (`Object.assign` with the call's
// props last), so a `kind` prop draws that kind. It adds and reads no
// token: the Button molecule owns the whole contract surface.
//
// Behavior: none - the Button the wrapper mounts owns the input state.
//
// Accessibility: the mounted Button's; this wrapper passes every prop
// through unchanged.

import SPEC from './spec.primary-button.js';


/********************************************************************
PrimaryButton factory.

@param {Object} ctx - Component context

@return {Function} - The PrimaryButton component
*********************************************************************/
export default function PrimaryButton (ctx) {

  const React = ctx.React;


  /********************************************************************
  PrimaryButton component.

  @param {Object} props - See `api.primary-button.js`

  @return {Object} - React element
  *********************************************************************/
  function PrimaryButtonComponent (props) {

    // The call's kind wins over the `primary` default
    return React.createElement(ctx.Registry.Button, Object.assign({ kind: 'primary' }, props));

  }

  PrimaryButtonComponent.displayName = 'PrimaryButton';

  return PrimaryButtonComponent;

}

PrimaryButton.spec = SPEC;
