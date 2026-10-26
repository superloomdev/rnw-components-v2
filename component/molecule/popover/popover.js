// Info: Popover molecule. A floating surface anchored to its `children`
// trigger, placed by the `anchored-position` behavior on the side `align`
// names and flipped at the viewport edge when `autoAlign` asks. The caller
// owns `open`; Escape and an outside press call `onRequestClose`. The drawn
// bubble is `ctx.Registry.PopoverContent`; a `content` string wraps into the
// theme's default text there. Where an overlay host is mounted the surface
// renders through it, else in place, `fixed` on the web and `absolute`
// natively.

import SPEC from './spec.js';


/********************************************************************
Popover factory.

@param {Object} ctx - Component context

@return {Function} - The Popover component
*********************************************************************/
export default function Popover (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useAnchoredPosition, useEscapeKey, useOverlay } = ctx.behaviors;


  /********************************************************************
  Popover component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function PopoverComponent (props) {

    // The caller owns the open state; content mounts only while open
    const open = props.open === true;
    const align = Utils.isString(props.align) ? props.align : 'bottom';
    const caret = props.caret !== false;
    const caretHeight = ctx.metric('Popover', 'caretHeight');
    // The caret lifts the surface half its height off the anchor, the way
    // the reference's calc does
    // A composing host (the toggletip) may seat its own offset cell in place
    // of the popover's
    const offset = (Utils.isNumber(props.offset) ? props.offset : ctx.metric('Popover', 'offset')) + (caret === true ? caretHeight / 2 : 0);

    // The anchor is measured for the surface's placement, re-measured while
    // open so the fixed surface follows it on scroll and resize
    const anchorRef = React.useRef(null);
    const anchored = useAnchoredPosition({
      anchor: anchorRef,
      placement: align,
      offset: offset,
      track: open === true,
      flip: props.autoAlign === true
    });
    React.useEffect(function () {
      if (open === true) {
        anchored.measure();
      }
    }, [open, anchored.measure]);

    // Escape and an outside press ask the caller to close
    const requestClose = function () {
      if (typeof props.onRequestClose === 'function') {
        props.onRequestClose();
      }
    };
    useEscapeKey(requestClose, open === true);

    const placement = anchored.actualPlacement || align;
    const shift = anchored.shift || { x: 0, y: 0 };
    const bubble = React.createElement(ctx.Registry.PopoverContent, {
      align: placement,
      border: props.border === true,
      caret: caret,
      dropShadow: props.dropShadow !== false,
      highContrast: props.highContrast === true,
      layerStyle: [anchored.layerStyle, {
        transform: [{ translateX: shift.x + '%' }, { translateY: shift.y + '%' }],
        zIndex: ctx.metric('Popover', 'level')
      }]
    }, props.content);

    // The surface renders through an overlay host where one is mounted
    const overlay = useOverlay({
      isOpen: open === true,
      name: 'Popover',
      onClose: requestClose,
      render: function () {
        return bubble;
      }
    });

    // The positioned bubble mounts first in document order: an
    // `aria-controls` on the anchor serializes to the bubble's element index,
    // which stays identical across templates only when nothing
    // template-varying (the anchor's icon glyphs) precedes it
    return React.createElement(View, { ref: anchorRef, testID: props.testID },
      overlay.hosted ? null : open === true ? bubble : null,
      Utils.isString(props.children) ? React.createElement(ctx.Registry.Text, null, props.children) : props.children);

  }

  PopoverComponent.displayName = 'Popover';

  return PopoverComponent;

}

Popover.spec = SPEC;
