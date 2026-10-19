// Info: Layer provider. Everything inside it paints one surface level
// deeper: the shared painted-level context carries the level, and the
// reader seam resolves each descendant's tokens against that level's
// table. With `withBackground` the layer paints its own level's surface
// behind the children; without it the layer is transparent, as upstream.
//
// Behavior: none - a provider takes no input.
//
// Accessibility: a plain container; no role and no naming.

import SPEC from './spec.js';


/********************************************************************
Layer factory.

@param {Object} ctx - Component context

@return {Function} - The Layer component
*********************************************************************/
export default function Layer (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const LayerContext = ctx.LayerContext;

  // The explicit level overrides, each naming the painted level minus one
  const LEVELS = [0, 1, 2];


  /********************************************************************
  Layer component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function LayerComponent (props) {

    if (props.level !== undefined && !Utils.inArray(LEVELS, props.level)) {
      throw new TypeError('Layer level must be 0, 1 or 2');
    }

    // The painted level descendants read: an override counts from the page
    // surface, so level + 1 names the child level; an omitted level paints
    // one deeper than the level this component itself reads (a bare Layer
    // first paints level 2, matching the upstream context default of 1),
    // clamped to the deepest level
    const childLevel = Math.min(Math.max((props.level === undefined ? ctx.level : props.level) + 1, 1), 3);

    return React.createElement(LayerContext.Provider, { value: childLevel },
      React.createElement(View, {
        style: props.withBackground === true ? { backgroundColor: ctx.colorAt(1, 'layer_background_0' + childLevel) } : undefined,
        testID: props.testID
      },
      // Bare string or number children render through the registry Text:
      // raw text inside a View crashes a native render
      React.Children.toArray(props.children).map(function (child, index) {
        return Utils.isString(child) || Utils.isNumber(child)
          ? React.createElement(ctx.Registry.Text, { key: index }, child)
          : child;
      })));

  }

  LayerComponent.displayName = 'Layer';

  return LayerComponent;

}

Layer.spec = SPEC;
