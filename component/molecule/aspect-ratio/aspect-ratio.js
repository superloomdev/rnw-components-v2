// Info: AspectRatio molecule. A box that keeps its `ratio` (`W x H`)
// whatever width its container gives it, holding its children. A string
// child renders through the Text atom, so the row is a molecule. It reads
// no token: the proportion is prop data, not theme data.
//
// Behavior: none - the box takes no input.
//
// Accessibility: a plain container; no role and no naming.

import SPEC from './spec.js';


// The ratios the api declares, as [width, height] pairs
const RATIOS = Object.freeze({
  '16x9': Object.freeze([16, 9]),
  '9x16': Object.freeze([9, 16]),
  '2x1': Object.freeze([2, 1]),
  '1x2': Object.freeze([1, 2]),
  '4x3': Object.freeze([4, 3]),
  '3x4': Object.freeze([3, 4]),
  '3x2': Object.freeze([3, 2]),
  '2x3': Object.freeze([2, 3]),
  '1x1': Object.freeze([1, 1])
});


/********************************************************************
AspectRatio factory.

@param {Object} ctx - Component context

@return {Function} - The AspectRatio component
*********************************************************************/
export default function AspectRatio (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  AspectRatio component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function AspectRatioComponent (props) {

    // The proportion: the named ratio as W / H, `1x1` when the name is unknown
    const pair = Object.prototype.hasOwnProperty.call(RATIOS, props.ratio) ? RATIOS[props.ratio] : RATIOS['1x1'];

    // A string child renders through the Text atom; anything else renders as passed
    const children = Utils.isString(props.children)
      ? React.createElement(ctx.Registry.Text, null, props.children)
      : props.children;

    return React.createElement(View, {
      testID: props.testID,
      style: { alignSelf: 'stretch', aspectRatio: pair[0] / pair[1] }
    }, children);

  }

  AspectRatioComponent.displayName = 'AspectRatio';

  return AspectRatioComponent;

}

AspectRatio.spec = SPEC;
