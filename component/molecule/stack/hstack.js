// Info: HStack molecule. A Stack fixed to a row: same gap steps, same
// shrink-wrapped width, the orientation decided.
//
// Behavior: none - a layout row takes no input.
//
// Accessibility: a plain container; no role and no naming.

import SPEC from './spec.hstack.js';


/********************************************************************
HStack factory.

@param {Object} ctx - Component context

@return {Function} - The HStack component
*********************************************************************/
export default function HStack (ctx) {

  const React = ctx.React;


  /********************************************************************
  HStack component.

  @param {Object} props - See `api.hstack.js`

  @return {Object} - React element
  *********************************************************************/
  function HStackComponent (props) {

    return React.createElement(ctx.Registry.Stack, Object.assign({}, props, { orientation: 'horizontal' }));

  }

  HStackComponent.displayName = 'HStack';

  return HStackComponent;

}

HStack.spec = SPEC;
