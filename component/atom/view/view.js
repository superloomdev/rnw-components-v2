// Info: View atom, the library's layout box. Wraps the one React Native
// view element; the fill, border, radius, padding and gap it draws are
// token leaves the caller names, resolved through the context, and it
// draws nothing a caller did not ask for. It composes no behavior and no
// other component.

import SPEC from './spec.js';


/********************************************************************
View factory.

@param {Object} ctx - Component context

@return {Function} - The View component
*********************************************************************/
export default function View (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const NativeView = ctx.ReactNative.View;


  /********************************************************************
  View component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function ViewComponent (props) {

    // Init the style: only what the caller named
    const style = {};

    // Resolve each named token leaf through the context
    if (Utils.isString(props.background)) {
      style.backgroundColor = ctx.color(props.background);
    }
    if (Utils.isString(props.borderWidth)) {
      style.borderWidth = ctx.token('border.' + props.borderWidth);
      style.borderColor = ctx.color(Utils.isString(props.borderColor) ? props.borderColor : 'border_subtle_01');
    }
    if (Utils.isString(props.radius)) {
      style.borderRadius = ctx.token('shape.' + props.radius);
    }
    if (Utils.isString(props.padding)) {
      style.padding = ctx.token('spacing.' + props.padding);
    }
    if (Utils.isString(props.gap)) {
      style.gap = ctx.token('spacing.' + props.gap);
    }

    // Render the box
    return React.createElement(NativeView, {
      style: [style, props.style],
      testID: props.testID
    }, props.children);

  }

  ViewComponent.displayName = 'View';

  return ViewComponent;

}

View.spec = SPEC;
