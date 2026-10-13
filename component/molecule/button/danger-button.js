// Info: DangerButton molecule. A kind wrapper over Button: the kind is
// always `danger`, whatever the call passes (`Object.assign` with the
// `danger` kind last). It adds and reads no token: the Button molecule
// owns the whole contract surface.
//
// Behavior: none - the Button the wrapper mounts owns the input state.
//
// Accessibility: the mounted Button's; this wrapper passes every prop
// through unchanged.

import SPEC from './spec.danger-button.js';


/********************************************************************
DangerButton factory.

@param {Object} ctx - Component context

@return {Function} - The DangerButton component
*********************************************************************/
export default function DangerButton (ctx) {

  const React = ctx.React;


  /********************************************************************
  DangerButton component.

  @param {Object} props - See `api.danger-button.js`

  @return {Object} - React element
  *********************************************************************/
  function DangerButtonComponent (props) {

    // The `danger` kind wins over whatever the call passes
    return React.createElement(ctx.Registry.Button, Object.assign({}, props, { kind: 'danger' }));

  }

  DangerButtonComponent.displayName = 'DangerButton';

  return DangerButtonComponent;

}

DangerButton.spec = SPEC;
