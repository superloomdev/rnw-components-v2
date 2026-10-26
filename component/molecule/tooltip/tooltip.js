// Info: Tooltip molecule. An anchor wrapper whose pointer, focus and touch
// open a popover after the theme-independent delay: a bubble in the theme's
// `tooltip` role cells (the `tooltip_compact` member cells under `compact`)
// holding one label and a caret clipped from a rotated square, placed by the
// `anchored-position` behavior on the side `align` names and flipped at the
// viewport edge. The caret's seat mounts under every template; a zero caret
// cell draws nothing where the theme draws none. `open` is controllable and
// reports through `onOpenChange`; where an overlay host is mounted the
// popover renders through it, else in place, `fixed` on the web and
// `absolute` natively.
//
// Accessibility: the popover is `role="tooltip"`, describing the anchor
// through `aria-describedby`; Escape closes it, and a touch toggles it where
// no pointer exists (the roster's touch fallback).

import SPEC from './spec.js';


/********************************************************************
Tooltip factory.

@param {Object} ctx - Component context

@return {Function} - The Tooltip component
*********************************************************************/
export default function Tooltip (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useAnchoredPosition, useControllableState, useEscapeKey, useOverlay, useA11yId } = ctx.behaviors;

  // The edge the caret's clipping box sits on for a placement base
  const CARET_EDGE = Object.freeze({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' });


  /********************************************************************
  The caret element: a square rotated 45 degrees, clipped to
  `width` x `height` of the theme's caret cells (transposed on a side
  edge), mounted (undrawn at zero) on the edge the placement says the
  anchor is on, centered on the popover's cross axis unless an alignment
  holds it to the edge nearest the anchor's middle.

  @param {Object} options - { placement, width, height, color, anchor }

  @return {Object} - React element
  *********************************************************************/
  function caret (options) {

    const parsed = String(options.placement || 'top').split('-');
    const edge = CARET_EDGE[parsed[0]] || 'bottom';
    const alignment = parsed[1] || 'center';
    const horizontal = edge === 'bottom' || edge === 'top';
    const boxWidth = horizontal ? options.width : options.height;
    const boxHeight = horizontal ? options.height : options.width;
    const side = options.width / Math.SQRT2;
    const drawn = options.width > 0 && options.height > 0;
    // An aligned popover holds its edge to the anchor's, so the caret sits
    // the anchor's half-extent in from that edge; a centered one centers
    const extent = options.anchor ? (horizontal ? options.anchor.width : options.anchor.height) : 0;
    const lead = Math.max(0, extent / 2 - (horizontal ? boxWidth : boxHeight) / 2);
    const inner = { backgroundColor: options.color, height: side, position: 'absolute', transform: [{ rotate: '45deg' }], width: side };
    if (horizontal) {
      inner.left = (boxWidth - side) / 2;
      inner.top = edge === 'bottom' ? -side / 2 : boxHeight - side / 2;
    } else {
      inner.top = (boxHeight - side) / 2;
      inner.left = edge === 'right' ? -side / 2 : boxWidth - side / 2;
    }

    // The clipping box reads the caret cells and hides the square's
    // run-out; `relative` so the rotated square anchors to it
    const clip = React.createElement(View, { 'aria-hidden': true, style: { height: boxHeight, overflow: 'hidden', position: 'relative', width: boxWidth } },
      React.createElement(View, { style: drawn ? inner : { height: 0, width: 0 } }));

    // Neither auto margins nor a percentage offset centers an absolute
    // child on a native platform (`auto` reads as 0, a percentage reads the
    // parent's content box), so a centered caret hangs from a full-span
    // flex wrapper that centers it on every platform; an aligned one keeps
    // its pixel offset from the edge
    if (alignment === 'center') {
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
    const position = { position: 'absolute' };
    position[edge] = -(horizontal ? boxHeight : boxWidth);
    position[horizontal ? (alignment === 'start' ? 'left' : 'right') : (alignment === 'start' ? 'top' : 'bottom')] = lead;
    return React.cloneElement(clip, { style: [clip.props.style, position] });

  }


  /********************************************************************
  Tooltip component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function TooltipComponent (props) {

    // Init the controllable open state and the theme's cells
    const [shown, setShown] = useControllableState({
      value: props.open,
      defaultValue: props.defaultOpen === true,
      onChange: props.onOpenChange
    });
    const compact = props.compact === true;
    const paddingBlock = ctx.metric('Tooltip', compact ? 'paddingBlockCompact' : 'paddingBlock');
    const caretWidth = ctx.metric('Tooltip', compact ? 'caretWidthCompact' : 'caretWidth');
    const caretHeight = ctx.metric('Tooltip', compact ? 'caretHeightCompact' : 'caretHeight');
    const offset = ctx.metric('Tooltip', compact ? 'offsetCompact' : 'offset');
    const delayOpen = Utils.isNumber(props.enterDelayMs) ? props.enterDelayMs : ctx.metric('Tooltip', 'delayOpen');
    const delayClose = Utils.isNumber(props.leaveDelayMs) ? props.leaveDelayMs : ctx.metric('Tooltip', compact ? 'delayCloseCompact' : 'delayClose');
    const tooltipId = useA11yId('sl-tooltip');

    // The anchor is measured for the popover's placement, re-measured while
    // open so the fixed surface follows it on scroll and resize
    const anchorRef = React.useRef(null);
    const anchored = useAnchoredPosition({
      anchor: anchorRef,
      placement: Utils.isString(props.align) ? props.align : 'top',
      offset: offset,
      track: shown === true
    });

    // Open on hover, focus or touch after the delay; close on leave, blur or
    // Escape, after the delay where a delay is named. A touch toggles.
    const timer = React.useRef(null);
    const schedule = function (next, delay) {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      if (delay <= 0) {
        setShown(next);
        return;
      }
      timer.current = setTimeout(function () {
        timer.current = null;
        setShown(next);
      }, delay);
    };
    React.useEffect(function () {
      return function () {
        if (timer.current !== null) {
          clearTimeout(timer.current);
        }
      };
    }, []);
    React.useEffect(function () {
      if (shown === true) {
        anchored.measure();
      }
    }, [shown, anchored.measure]);
    useEscapeKey(function () {
      setShown(false);
    }, shown === true);

    // The popover: the caret's clipping box on the anchor-facing edge of the
    // bubble; both mount under every template, a zero caret cell undrawn.
    // The layer style the positioner returns mounts the box `fixed` at
    // viewport coordinates on the web and `absolute` at window coordinates
    // inside the overlay host on a native platform; the box carries the
    // shift (percents of itself) on every platform
    const placement = anchored.actualPlacement || 'top';
    const shift = anchored.shift || { x: 0, y: 0 };
    const popover = React.createElement(View, {
      nativeID: tooltipId,
      // `role` carries the ARIA name on every platform; `accessibilityRole`
      // would throw on Android, whose TalkBack enum has no tooltip value
      role: 'tooltip',
      pointerEvents: 'none',
      style: [anchored.layerStyle, {
        transform: [{ translateX: shift.x + '%' }, { translateY: shift.y + '%' }],
        zIndex: ctx.metric('Tooltip', 'level')
      }]
    },
    React.createElement(View, {
      style: [{
        alignItems: 'center',
        backgroundColor: ctx.color('tooltip_container'),
        borderRadius: ctx.metric('Tooltip', 'radius'),
        maxWidth: ctx.metric('Tooltip', 'maxWidth'),
        paddingHorizontal: Utils.isNumber(props.paddingInline) ? props.paddingInline : ctx.metric('Tooltip', 'paddingInline'),
        paddingVertical: paddingBlock
      }]
    },
    React.createElement(Text, {
      style: [ctx.typeStyle(compact ? 'tooltip_compact_label' : 'tooltip_label'), {
        color: ctx.color('tooltip_label')
      }]
    }, props.label),
    caret({ anchor: anchored.anchor, color: ctx.color('tooltip_container'), height: caretHeight, placement: placement, width: caretWidth })));

    // The popover renders through an overlay host where one is mounted
    const overlay = useOverlay({
      isOpen: shown === true,
      name: 'Tooltip',
      onClose: function () {
        setShown(false);
      },
      render: function () {
        return popover;
      }
    });

    // The anchor wrapper: pointer, focus and touch drive the open state
    return React.createElement(View, {
      style: props.anchorStyle,
      onPointerEnter: function () {
        schedule(true, delayOpen);
      },
      onPointerLeave: function () {
        schedule(false, delayClose);
      },
      onFocus: function () {
        schedule(true, delayOpen);
      },
      onBlur: function () {
        schedule(false, delayClose);
      },
      onTouchEnd: function () {
        if (timer.current !== null) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        setShown(true);
      }
    },
    React.createElement(View, { ref: anchorRef, 'aria-describedby': tooltipId, testID: props.testID },
      // A bare string anchor renders through the registry Text (the theme's
      // typography) and gets a tab stop: a tooltip opens on focus, so a
      // keyboard has to reach it; an element child brings its own
      Utils.isString(props.children) ? React.createElement(ctx.Registry.Text, {
        focusable: true
      }, props.children) : props.children),
    overlay.hosted ? null : shown === true ? popover : null);

  }

  TooltipComponent.displayName = 'Tooltip';

  return TooltipComponent;

}

Tooltip.spec = SPEC;
