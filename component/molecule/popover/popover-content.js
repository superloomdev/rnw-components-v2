// Info: PopoverContent molecule. The floating body of a Popover: the fill,
// border, radius and shadow cells the `popover` role names, the `tooltip`
// inverse cells under `highContrast`, and the caret clipped from a rotated
// square on the edge `align` names. It draws its `layerStyle` position only
// when a Popover supplies it; standalone it lays out in place. Composed only
// inside Popover.

import SPEC from './spec.popover-content.js';


/********************************************************************
PopoverContent factory.

@param {Object} ctx - Component context

@return {Function} - The PopoverContent component
*********************************************************************/
export default function PopoverContent (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;

  // The edge the caret's clipping box sits on for a placement base
  const CARET_EDGE = Object.freeze({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' });


  /********************************************************************
  The caret element: a square rotated 45 degrees, clipped to
  `width` x `height` of the theme's caret cells (transposed on a side
  edge), mounted on the edge the placement says the anchor is on,
  centered on the popover's cross axis.

  @param {Object} options - { placement, width, height, color }

  @return {Object} - React element
  *********************************************************************/
  function caret (options) {

    const parsed = String(options.placement || 'bottom').split('-');
    const edge = CARET_EDGE[parsed[0]] || 'top';
    const horizontal = edge === 'bottom' || edge === 'top';
    const boxWidth = horizontal ? options.width : options.height;
    const boxHeight = horizontal ? options.height : options.width;
    const side = options.width / Math.SQRT2;
    const inner = { backgroundColor: options.color, height: side, position: 'absolute', transform: [{ rotate: '45deg' }], width: side };
    if (horizontal) {
      inner.left = (boxWidth - side) / 2;
      inner.top = edge === 'bottom' ? -side / 2 : boxHeight - side / 2;
    } else {
      inner.top = (boxHeight - side) / 2;
      inner.left = edge === 'right' ? -side / 2 : boxWidth - side / 2;
    }

    // The clipping box reads the caret cells and hides the square's
    // run-out; a full-span wrapper centers it on the cross axis, which
    // neither auto margins nor a percentage offset do on a native platform
    const clip = React.createElement(View, { 'aria-hidden': true, style: { color: options.ink, height: boxHeight, overflow: 'hidden', position: 'relative', width: boxWidth } },
      React.createElement(View, { style: inner }));
    const wrapper = { position: 'absolute' };
    wrapper[edge] = -(horizontal ? boxHeight : boxWidth);
    if (horizontal) {
      wrapper.left = 0;
      wrapper.right = 0;
      wrapper.flexDirection = 'row';
      wrapper.justifyContent = 'center';
    } else {
      wrapper.top = 0;
      wrapper.bottom = 0;
      wrapper.flexDirection = 'column';
      wrapper.justifyContent = 'center';
    }
    return React.createElement(View, { style: wrapper }, clip);

  }


  /********************************************************************
  PopoverContent component.

  @param {Object} props - See `api.popover-content.js`

  @return {Object} - React element
  *********************************************************************/
  function PopoverContentComponent (props) {

    const highContrast = props.highContrast === true;
    const fill = ctx.color(highContrast === true ? 'tooltip_container' : 'popover_container');
    const caretWidth = ctx.metric('Popover', 'caretWidth');
    const caretHeight = ctx.metric('Popover', 'caretHeight');
    // The inverse surface draws no shadow and no border, as the reference's
    // high-contrast popover does
    const shadow = props.dropShadow === true && highContrast === false ? ctx.token('shadow.popover') : {};

    return React.createElement(View, {
      testID: props.testID,
      style: [Utils.isNullOrUndefined(props.layerStyle) ? {} : props.layerStyle, {
        backgroundColor: fill,
        color: ctx.color(highContrast === true ? 'tooltip_label' : 'popover_label'),
        borderColor: props.border === true && highContrast === false ? ctx.color('popover_border') : undefined,
        borderRadius: ctx.metric('Popover', 'radius'),
        borderWidth: props.border === true && highContrast === false ? 1 : 0,
        maxWidth: ctx.metric('Popover', 'maxWidth')
      }, shadow]
    },
    Utils.isString(props.children) ? React.createElement(Text, {
      style: { color: ctx.color(highContrast === true ? 'tooltip_label' : 'popover_label') }
    }, props.children) : props.children,
    props.caret === true ? caret({ color: fill, height: caretHeight, ink: ctx.color('popover_label'), placement: props.align, width: caretWidth }) : null);

  }

  PopoverContentComponent.displayName = 'PopoverContent';

  return PopoverContentComponent;

}

PopoverContent.spec = SPEC;
