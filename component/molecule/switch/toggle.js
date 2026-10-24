// Info: Toggle molecule dispatcher. The web platform answer always draws
// the theme's switch (`toggle.web.js`): no browser can draw the operating
// system's control. The native answer renders `toggle.native.js`, which
// mounts the host's OS switch adapter when the theme's
// `anatomy.toggle_widget` enum says `system` and falls back to the drawn
// switch otherwise. This dispatcher is the only Toggle file that reads the
// platform answer.

import SPEC from './spec.js';
import ToggleNative from './toggle.native.js';
import ToggleWeb from './toggle.web.js';


/********************************************************************
Toggle factory.

@param {Object} ctx - Component context

@return {Function} - The Toggle component
*********************************************************************/
export default function Toggle (ctx) {

  const React = ctx.React;
  const NativeComponent = ToggleNative(ctx);
  const WebComponent = ToggleWeb(ctx);


  /********************************************************************
  Toggle component: dispatch to the platform's half.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ToggleComponent (props) {

    return ctx.platform.split({
      web: React.createElement(WebComponent, props),
      native: React.createElement(NativeComponent, props)
    });

  }

  ToggleComponent.displayName = 'Toggle';

  return ToggleComponent;

}

Toggle.spec = SPEC;
