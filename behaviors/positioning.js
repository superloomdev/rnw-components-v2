// Info: Anchored positioning - pure placement arithmetic for a floating
// surface relative to an anchor rectangle within a viewport, the hook that
// measures the anchor and applies it, and outside-press or escape dismissal.
// The offset is caller policy; nothing here reads a token.

/********************************************************************
Build the positioning behaviors for one component system.

@param {Object} deps - { Utils, React, ReactNative, platform, OverlayContext? }
        `OverlayContext` is the overlay family's context, wired by
        createBehaviors; a context-free call gets an empty one

@return {Object} - { getAnchoredPosition, useAnchoredPosition, useLayerSpace, usePopoverDismiss, useViewportLayer, useViewportSize }
*********************************************************************/
export default function createPositioningBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;
  const ReactNative = deps.ReactNative;
  const platform = deps.platform;
  // The overlay host's context carries `origin`, the layer root's window
  // position; a native layer computes window coordinates and must shift
  // them back into the host's own space
  const OverlayContext = deps.OverlayContext === undefined ? React.createContext(null) : deps.OverlayContext;


  function parsePlacement (placement) {

    const dashIndex = placement.indexOf('-');
    if (dashIndex < 0) {
      return { base: placement, alignment: null };
    }
    return { base: placement.substring(0, dashIndex), alignment: placement.substring(dashIndex + 1) };

  }

  function getAnchoredPosition (rect, placement = 'bottom', offset = 8, viewport = { width: 0, height: 0 }, flip = true, alignmentAxisOffset = 0) {

    const parsed = parsePlacement(placement);
    let base = parsed.base;
    const alignment = parsed.alignment;
    let actualPlacement = placement;
    let top = 0;
    let left = 0;

    if (flip) {
      if (base === 'bottom' && rect.bottom + offset > viewport.height) {
        actualPlacement = alignment ? 'top-' + alignment : 'top';
        base = 'top';
      } else if (base === 'top' && rect.top - offset < 0) {
        actualPlacement = alignment ? 'bottom-' + alignment : 'bottom';
        base = 'bottom';
      } else if (base === 'right' && rect.right + offset > viewport.width) {
        actualPlacement = alignment ? 'left-' + alignment : 'left';
        base = 'left';
      } else if (base === 'left' && rect.left - offset < 0) {
        actualPlacement = alignment ? 'right-' + alignment : 'right';
        base = 'right';
      }
    }

    if (base === 'bottom') {
      top = rect.bottom + offset;
    } else if (base === 'top') {
      top = rect.top - offset;
    } else if (base === 'right') {
      left = rect.right + offset;
    } else if (base === 'left') {
      left = rect.left - offset;
    }

    if (base === 'top' || base === 'bottom') {
      if (alignment === 'start') {
        left = rect.left;
      } else if (alignment === 'end') {
        left = rect.right;
      } else {
        left = rect.left + rect.width / 2;
      }
    } else {
      if (alignment === 'start') {
        top = rect.top;
      } else if (alignment === 'end') {
        top = rect.bottom;
      } else {
        top = rect.top + rect.height / 2;
      }
    }

    if (base === 'top' || base === 'bottom') {
      left += alignmentAxisOffset;
    } else {
      top += alignmentAxisOffset;
    }

    // The position names the point on the anchor's edge the popover anchors
    // to; `shift` is the popover's own translation (in percents of itself) so
    // the right edge lands there: a top popover sits its bottom edge at the
    // point, a left one its right edge, and the cross axis centers unless an
    // alignment names an edge
    const shiftX = base === 'left' ? -100
      : (base === 'top' || base === 'bottom') ? (alignment === 'start' ? 0 : alignment === 'end' ? -100 : -50)
        : 0;
    const shiftY = base === 'top' ? -100
      : (base === 'left' || base === 'right') ? (alignment === 'start' ? 0 : alignment === 'end' ? -100 : -50)
        : 0;

    return {
      position: { top: top, left: left },
      actualPlacement: actualPlacement,
      shift: { x: shiftX, y: shiftY }
    };

  }

  // The space an unhosted layer positions against: the live window on the
  // web, `Dimensions.get('window')` on a native platform (there is no
  // `window` there, so an unguarded read would answer a zero box and make
  // every placement flip)
  function currentViewport () {

    if (platform.isNative) {
      const size = ReactNative.Dimensions !== undefined && typeof ReactNative.Dimensions.get === 'function'
        ? ReactNative.Dimensions.get('window')
        : { width: 0, height: 0 };
      return { width: size.width, height: size.height };
    }
    return {
      width: typeof window === 'undefined' ? 0 : window.innerWidth,
      height: typeof window === 'undefined' ? 0 : window.innerHeight
    };

  }

  function defaultSource () {

    return {
      platform: platform.os,
      viewport: currentViewport()
    };

  }

  function resolveAnchor (anchor) {

    if (Utils.isNullOrUndefined(anchor)) {
      return null;
    }
    return anchor.current === undefined ? anchor : anchor.current;

  }

  function useAnchoredPosition (options = {}) {

    const placement = options.placement === undefined ? 'bottom' : options.placement;
    const offset = options.offset === undefined ? 8 : options.offset;
    const flip = options.flip !== false;
    const alignmentAxisOffset = options.alignmentAxisOffset === undefined ? 0 : options.alignmentAxisOffset;
    const [state, setState] = React.useState({
      position: null,
      actualPlacement: placement,
      shift: null,
      anchor: null
    });

    // The overlay context at call time, not render time: `measure` is
    // memoized, and the host's origin and size may arrive after mount
    const overlay = React.useContext(OverlayContext);
    const overlayRef = React.useRef(overlay);
    overlayRef.current = overlay;

    const measure = React.useCallback(function () {

      const anchor = resolveAnchor(options.anchor);
      if (!anchor) {
        return;
      }
      const source = options.source || {};
      const defaults = defaultSource();
      const platform = source.platform || defaults.platform;
      const viewport = source.viewport || defaults.viewport;

      if (platform === 'web' && typeof anchor.getBoundingClientRect === 'function') {
        const rect = anchor.getBoundingClientRect();
        const computed = getAnchoredPosition(rect, placement, offset, viewport, flip, alignmentAxisOffset);
        setState({
          position: computed.position,
          actualPlacement: computed.actualPlacement,
          shift: computed.shift,
          anchor: { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
        });
        return;
      }

      if (typeof anchor.measureInWindow === 'function') {
        anchor.measureInWindow(function (x, y, width, height) {
          // Inside a host on a native platform the host's space is the
          // coordinate space: the window rect shifts back by the host's
          // origin and the placement is bounded by the host's own size
          const current = overlayRef.current;
          const hosted = current !== null && current.hosted === true;
          const origin = hosted && current.origin !== undefined ? current.origin : { x: 0, y: 0 };
          const rect = {
            left: x - origin.x,
            top: y - origin.y,
            width: width,
            height: height,
            right: x - origin.x + width,
            bottom: y - origin.y + height
          };
          let measuredViewport;
          if (typeof source.getViewport === 'function') {
            const deviceViewport = source.getViewport();
            if (deviceViewport && deviceViewport.success) {
              measuredViewport = { width: deviceViewport.width, height: deviceViewport.height };
            }
          }
          if (measuredViewport === undefined) {
            measuredViewport = hosted && current.size !== undefined
              ? { width: current.size.width, height: current.size.height }
              : currentViewport();
          }
          const computed = getAnchoredPosition(rect, placement, offset, measuredViewport, flip, alignmentAxisOffset);
          setState({
            position: computed.position,
            actualPlacement: computed.actualPlacement,
            shift: computed.shift,
            anchor: { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
          });
        });
      }

    }, [options.anchor, options.source, placement, offset, flip, alignmentAxisOffset]);

    // A fixed surface does not scroll with its anchor: while tracking, every
    // scroll (any ancestor, so capture) or viewport resize re-measures it
    React.useEffect(function () {
      if (options.track !== true || platform.os !== 'web' || typeof window === 'undefined' ||
          typeof window.addEventListener !== 'function' || typeof window.removeEventListener !== 'function') {
        return undefined;
      }
      window.addEventListener('scroll', measure, true);
      window.addEventListener('resize', measure);
      return function () {
        window.removeEventListener('scroll', measure, true);
        window.removeEventListener('resize', measure);
      };
    }, [options.track, measure]);

    // The style the measured layer mounts with: `fixed` at viewport
    // coordinates on the web, `absolute` on a native platform. Hosted on a
    // native platform the position was already converted into the host's
    // space at measure time, so the style mounts it directly. Before the
    // first measure the layer sits at the frame origin
    const layerStyle = {
      left: state.position === null ? 0 : state.position.left,
      position: platform.isNative ? 'absolute' : 'fixed',
      top: state.position === null ? 0 : state.position.top
    };

    return {
      position: state.position,
      actualPlacement: state.actualPlacement,
      shift: state.shift,
      anchor: state.anchor,
      layerStyle: layerStyle,
      measure: measure
    };

  }

  /********************************************************************
  The layer a viewport-covering surface mounts with. Inside a host the
  layer covers the host's space instead: `absolute` inset 0 on every
  platform, because a hosted layer is meant to live in the host's bounds
  (a staged cell, the app root), not the window's. Unhosted keeps the old
  answer: `fixed` sized to the live viewport on the web, `absolute` inset
  0 on a native platform.

  @return {Object} - The layer style
  *********************************************************************/
  function useViewportLayer () {

    const viewport = useViewportSize();
    const overlay = React.useContext(OverlayContext);
    const hosted = overlay !== null && overlay.hosted === true;

    return hosted || platform.isNative
      ? { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }
      : { height: viewport.height, left: 0, position: 'fixed', top: 0, width: viewport.width };

  }

  /********************************************************************
  The viewport's live size. A fixed layer sized to the screen reads it
  here: a component never touches `window` itself, and on a platform with
  no window the answer is the zero box.
  *********************************************************************/
  function useViewportSize () {

    const [size, setSize] = React.useState(function () {
      return defaultSource().viewport;
    });

    React.useEffect(function () {
      const onResize = function () {
        setSize(defaultSource().viewport);
      };
      // The window on a native platform is Dimensions'; the web stays on
      // the resize listener
      if (platform.isNative) {
        if (ReactNative.Dimensions === undefined || typeof ReactNative.Dimensions.addEventListener !== 'function') {
          return undefined;
        }
        const subscription = ReactNative.Dimensions.addEventListener('change', onResize);
        return function () {
          if (subscription !== null && subscription !== undefined && typeof subscription.remove === 'function') {
            subscription.remove();
          }
        };
      }
      if (platform.os !== 'web' || typeof window === 'undefined' ||
          typeof window.addEventListener !== 'function' || typeof window.removeEventListener !== 'function') {
        return undefined;
      }
      window.addEventListener('resize', onResize);
      return function () {
        window.removeEventListener('resize', onResize);
      };
    }, []);

    return size;

  }

  /********************************************************************
  The space a layer lives in: the host's laid-out box when one is mounted
  and has reported one, else the viewport.

  @return {Object} - { width, height }
  *********************************************************************/
  function useLayerSpace () {

    const overlay = React.useContext(OverlayContext);
    const viewport = useViewportSize();
    const size = overlay !== null && overlay.hosted === true ? overlay.size : undefined;
    return size !== undefined && size !== null && size.width > 0 && size.height > 0 ? size : viewport;

  }

  function usePopoverDismiss (options = {}) {

    const latestRef = React.useRef(options);
    latestRef.current = options;
    const pointerInsideRef = React.useRef(false);
    const timerRef = React.useRef(null);
    const open = options.open === true;
    const eventSource = options.eventSource;

    const onMouseDown = React.useCallback(function (event) {
      const current = latestRef.current;
      const timers = current.timerSource || { setTimeout: setTimeout, clearTimeout: clearTimeout };
      pointerInsideRef.current = Boolean(
        current.contentRef &&
        current.contentRef.current &&
        current.contentRef.current.contains(event.target)
      );
      if (timerRef.current !== null) {
        timers.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (pointerInsideRef.current) {
        timerRef.current = timers.setTimeout(function () {
          pointerInsideRef.current = false;
          timerRef.current = null;
        }, 0);
      }
    }, []);

    const onBlur = React.useCallback(function (event) {
      const current = latestRef.current;
      const related = event.relatedTarget;
      if (related === null && pointerInsideRef.current) {
        pointerInsideRef.current = false;
        return;
      }
      const root = current.rootRef && current.rootRef.current;
      if (!root || !root.contains(related)) {
        if (typeof current.onRequestClose === 'function') {
          current.onRequestClose(event);
        }
      }
    }, []);

    React.useEffect(function () {
      return function () {
        const current = latestRef.current;
        const timers = current.timerSource || { setTimeout: setTimeout, clearTimeout: clearTimeout };
        if (timerRef.current !== null) {
          timers.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, []);

    React.useEffect(function () {
      const source = eventSource || (typeof document === 'undefined' ? null : document);
      if (!open || !source ||
          typeof source.addEventListener !== 'function' ||
          typeof source.removeEventListener !== 'function') {
        return undefined;
      }
      const onKeyDown = function (event) {
        if (event.key !== 'Escape' || event.defaultPrevented) {
          return;
        }
        const current = latestRef.current;
        const content = current.contentRef && current.contentRef.current;
        if (!content || !content.contains(event.target)) {
          return;
        }
        if (typeof current.onRequestClose === 'function') {
          current.onRequestClose(event);
        }
        const trigger = current.triggerRef && current.triggerRef.current;
        if (trigger && typeof trigger.focus === 'function') {
          trigger.focus();
        }
      };
      const onClick = function (event) {
        const current = latestRef.current;
        const root = current.rootRef && current.rootRef.current;
        if (event.target && root && !root.contains(event.target)) {
          if (typeof current.onRequestClose === 'function') {
            current.onRequestClose(event);
          }
        }
      };
      source.addEventListener('keydown', onKeyDown);
      source.addEventListener('click', onClick);
      return function () {
        source.removeEventListener('keydown', onKeyDown);
        source.removeEventListener('click', onClick);
      };
    }, [open, eventSource]);

    return {
      rootProps: {
        onMouseDown: onMouseDown,
        onBlur: onBlur
      }
    };

  }


  return {
    getAnchoredPosition: getAnchoredPosition,
    useAnchoredPosition: useAnchoredPosition,
    useLayerSpace: useLayerSpace,
    usePopoverDismiss: usePopoverDismiss,
    useViewportLayer: useViewportLayer,
    useViewportSize: useViewportSize
  };

}
