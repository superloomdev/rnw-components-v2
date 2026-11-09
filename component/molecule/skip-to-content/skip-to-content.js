// Info: SkipToContent molecule dispatcher. An anchor to the main content
// that stays visually hidden - a one-pixel clipped box - until keyboard
// focus reaches it, then draws at the top start of its containing block
// on the skip-link cells: the height, the inline padding, the border and
// the page-top stacking, the label in its type set. Web only: the native
// half draws nothing (`skip-to-content.web.js` is the whole component).

import SPEC from './spec.js';
import SkipToContentWeb from './skip-to-content.web.js';


/********************************************************************
SkipToContent factory.

@param {Object} ctx - Component context

@return {Function} - The SkipToContent component
*********************************************************************/
export default function SkipToContent (ctx) {

  const React = ctx.React;
  const WebComponent = SkipToContentWeb(ctx);


  /********************************************************************
  SkipToContent component: the web half only; native draws nothing.

  @param {Object} props - See `api.js`

  @return {Object} - React element, or null on a native platform
  *********************************************************************/
  function SkipToContentComponent (props) {

    return ctx.platform.split({ web: React.createElement(WebComponent, props) });

  }

  SkipToContentComponent.displayName = 'SkipToContent';

  return SkipToContentComponent;

}

SkipToContent.spec = SPEC;
