// Info: VStack molecule. A Stack fixed to a column: same gap steps, the
// orientation decided.
//
// Behavior: none - a layout column takes no input.
//
// Accessibility: a plain container; no role and no naming.

import SPEC from './spec.vstack.js';


/********************************************************************
VStack factory.

@param {Object} ctx - Component context

@return {Function} - The VStack component
*********************************************************************/
export default function VStack (ctx) {

  const React = ctx.React;


  /********************************************************************
  VStack component.

  @param {Object} props - See `api.vstack.js`

  @return {Object} - React element
  *********************************************************************/
  function VStackComponent (props) {

    return React.createElement(ctx.Registry.Stack, Object.assign({}, props, { orientation: 'vertical' }));

  }

  VStackComponent.displayName = 'VStack';

  return VStackComponent;

}

VStack.spec = SPEC;
