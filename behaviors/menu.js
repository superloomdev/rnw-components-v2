// Info: Menu behavior - anchored placement for a menu surface and the
// collection state of its items (typeahead, highlight, selection). Owns
// geometry arithmetic and state only; the surface's appearance is the
// component's.

/********************************************************************
Build the menu behaviors for one component system.

@param {Object} deps - { Utils, React, ReactNative, platform, OverlayContext? }
        `OverlayContext` is the overlay family's context, wired by
        createBehaviors; a context-free call gets an empty one

@return {Object} - { getMenuPosition, useMenuPosition, useMenuCollection }
*********************************************************************/
export default function createMenuBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;
  const ReactNative = deps.ReactNative;
  const Debug = deps.Debug;
  const platform = deps.platform;
  // Inside a host the layer mounts `absolute` at the host's own
  // coordinates; unhosted keeps the window answer
  const OverlayContext = deps.OverlayContext === undefined ? React.createContext(null) : deps.OverlayContext;


  function finiteNumber (value) {

    return Utils.isNumber(value) && Number.isFinite(value);

  }

  function normalizeRange (value) {

    if (Array.isArray(value)) {
      const filtered = value.filter(function (entry) {
        return !Utils.isNullOrUndefined(entry);
      });
      if (filtered.length === 2 && finiteNumber(filtered[0]) && finiteNumber(filtered[1])) {
        return [filtered[0], filtered[1]];
      }
      return null;
    }
    return finiteNumber(value) ? [value, value] : null;

  }

  function fitMenuAxis (axis, name, spacing, topAlignment, preferEnd) {

    // At the anchor edge the surface starts (or ends) flush with the range's
    // start (end); a `-end` alignment or a `top` menu prefers the end side,
    // falling back to the start side, then clamping to the viewport margin
    const atStart = axis.max - spacing - axis.size - axis.anchor >= 0 ? axis.anchor - axis.offset : false;
    const atEnd = axis.reversedAnchor - axis.size >= 0 && axis.reversedAnchor <= axis.max - spacing
      ? axis.reversedAnchor - axis.size + axis.offset
      : false;
    const clamped = axis.max - spacing - axis.size;
    const candidates = preferEnd === true ? [atEnd, atStart, clamped] : [atStart, atEnd, clamped];
    if (topAlignment && candidates[0] === false && name === 'y') {
      candidates[0] = axis.anchor - axis.offset;
    }
    const best = candidates.find(function (candidate) {
      return candidate !== false;
    });
    return best >= spacing ? best : spacing;

  }

  function getMenuPosition (options = {}) {

    const spacing = finiteNumber(options.spacing) ? options.spacing : 8;
    const menuSize = options.menuSize || { width: 0, height: 0 };
    const viewport = options.viewport || { width: 0, height: 0 };
    const menuAlignment = options.menuAlignment;
    const actionButtonWidth = options.actionButtonWidth;
    const rangeX = normalizeRange(options.x === undefined ? 0 : options.x);
    const rangeY = normalizeRange(options.y === undefined ? 0 : options.y);
    if (!rangeX || !rangeY) {
      return { left: -1, top: -1 };
    }
    const axes = {
      x: {
        max: viewport.width,
        size: menuSize.width,
        anchor: rangeX[0],
        reversedAnchor: rangeX[1],
        offset: 0
      },
      y: {
        max: viewport.height,
        size: menuSize.height,
        anchor: rangeY[1],
        reversedAnchor: rangeY[0],
        offset: 0
      }
    };
    if (finiteNumber(actionButtonWidth) && actionButtonWidth < axes.x.size &&
        (menuAlignment === 'bottom' || menuAlignment === 'top')) {
      axes.x.size = actionButtonWidth;
    }
    if (finiteNumber(actionButtonWidth) &&
        (menuAlignment === 'bottom-end' || menuAlignment === 'top-end') &&
        axes.x.anchor >= 87 && actionButtonWidth < axes.x.size) {
      const diff = axes.x.anchor + axes.x.reversedAnchor;
      axes.x.anchor = axes.x.anchor + diff;
    }
    const topAlignment =
      menuAlignment === 'top' || menuAlignment === 'top-end' || menuAlignment === 'top-start';
    // An `-end` alignment hangs the surface's end on the range's end; a `top`
    // alignment ends the surface at the range's start (the container's top)
    const endAligned = menuAlignment === 'bottom-end' || menuAlignment === 'top-end';
    // `fit: false` places by direction alone, as upstream's FloatingMenu:
    // below or above the anchor, start- or end-aligned, with no viewport
    // fitting or clamping
    if (options.fit === false) {
      return {
        left: endAligned ? rangeX[1] - menuSize.width : rangeX[0],
        top: topAlignment ? rangeY[0] - menuSize.height : rangeY[1]
      };
    }
    return {
      left: fitMenuAxis(axes.x, 'x', spacing, topAlignment, endAligned),
      top: fitMenuAxis(axes.y, 'y', spacing, topAlignment, topAlignment)
    };

  }

  // A fit that never converges loops a measure per commit (the surface's
  // own layout event re-fires measure, and a changed answer re-renders).
  // The cap ends the loop inside the open it started in: measures per
  // cycle, not the hook's life (D43)
  const MEASURE_CAP = 8;
  const CAP_WINDOW_MS = 1000;

  function useMenuPosition (options = {}) {

    const latestRef = React.useRef(options);
    latestRef.current = options;
    const [position, setPosition] = React.useState(null);
    const capRef = React.useRef({ count: 0, since: 0, warned: false });
    const lastRef = React.useRef(null);

    // The overlay context at call time, not render time: `measure` is
    // memoized, and the host's size may arrive after mount
    const overlay = React.useContext(OverlayContext);
    const overlayRef = React.useRef(overlay);
    overlayRef.current = overlay;

    const measure = React.useCallback(function () {
      const cap = capRef.current;
      const now = Date.now();
      if (now - cap.since > CAP_WINDOW_MS) {
        cap.count = 0;
        cap.since = now;
        cap.warned = false;
      }
      if (cap.count >= MEASURE_CAP) {
        if (!cap.warned) {
          cap.warned = true;
          Debug.warn('useMenuPosition: 8 re-measures in one open; the fit did not converge');
        }
        return;
      }
      const current = latestRef.current;
      const menu = current.menuRef && current.menuRef.current;
      if (!menu) {
        return;
      }
      const source = current.source || {};
      const finish = function (rect) {
        let viewport = source.viewport;
        if (!viewport && typeof source.getViewport === 'function') {
          const measured = source.getViewport();
          if (measured && measured.success) {
            viewport = { width: measured.width, height: measured.height };
          }
        }
        if (!viewport) {
          const host = overlayRef.current;
          const hosted = host !== null && host.hosted === true;
          if (hosted && host.size !== undefined) {
            // A hosted menu's x/y are already host coordinates, so the
            // space it fits is the host's own
            viewport = { width: host.size.width, height: host.size.height };
          } else if (platform.isNative && ReactNative.Dimensions !== undefined &&
              typeof ReactNative.Dimensions.get === 'function') {
            // There is no `window` on a native platform; the window the
            // layer's coordinates live in is Dimensions'
            viewport = ReactNative.Dimensions.get('window');
          } else {
            viewport = {
              width: typeof window === 'undefined' ? 0 : window.innerWidth,
              height: typeof window === 'undefined' ? 0 : window.innerHeight
            };
          }
        }
        const container = current.containerRef && current.containerRef.current;
        let actionButtonWidth = current.actionButtonWidth;
        if (actionButtonWidth === undefined && container &&
            typeof container.getBoundingClientRect === 'function') {
          actionButtonWidth = container.getBoundingClientRect().width;
        }
        // No state write when the answer is unchanged: the surface's own
        // onLayout re-fires measure, and a same-position write would loop
        const next = getMenuPosition({
          x: current.x,
          y: current.y,
          menuAlignment: current.menuAlignment,
          menuSize: { width: rect.width, height: rect.height },
          viewport: viewport,
          spacing: current.spacing,
          actionButtonWidth: actionButtonWidth,
          fit: current.fit
        });
        // Only a changed answer can re-render, so only a changed answer can
        // loop: the budget spends on those, never on a re-measure that lands
        // on the same spot
        const last = lastRef.current;
        if (last === null || last.left !== next.left || last.top !== next.top) {
          cap.count += 1;
          lastRef.current = next;
        }
        setPosition(function (previous) {
          return previous !== null && previous.left === next.left && previous.top === next.top ? previous : next;
        });
      };
      if (typeof menu.getBoundingClientRect === 'function') {
        finish(menu.getBoundingClientRect());
        return;
      }
      if (typeof menu.measureInWindow === 'function') {
        menu.measureInWindow(function (x, y, width, height) {
          finish({
            left: x,
            top: y,
            right: x + width,
            bottom: y + height,
            width: width,
            height: height
          });
        });
      }
    }, []);

    // A tracked anchor moves on scroll and resize: re-fit the surface when
    // the range it opens against changes
    const rangeX = normalizeRange(options.x === undefined ? 0 : options.x);
    const rangeY = normalizeRange(options.y === undefined ? 0 : options.y);
    React.useEffect(function () {
      measure();
    }, [measure,
      rangeX === null ? 0 : rangeX[0], rangeX === null ? 0 : rangeX[1],
      rangeY === null ? 0 : rangeY[0], rangeY === null ? 0 : rangeY[1]]);

    // A new open cycle gets a fresh measure budget
    React.useEffect(function () {
      if (options.active === true) {
        const cap = capRef.current;
        cap.count = 0;
        cap.since = Date.now();
        cap.warned = false;
      }
    }, [options.active]);

    // The style the measured surface mounts with: inside a host `absolute`
    // at host coordinates on every platform; unhosted `fixed` at viewport
    // coordinates on the web, `absolute` at window coordinates on a native
    // platform. Before the first measure it sits at the point the menu
    // opened on
    const hosted = overlay !== null && overlay.hosted === true;
    return {
      layerStyle: {
        left: position === null ? (finiteNumber(latestRef.current.x) ? latestRef.current.x : 0) : position.left,
        position: hosted || platform.isNative ? 'absolute' : 'fixed',
        top: position === null ? (finiteNumber(latestRef.current.y) ? latestRef.current.y : 0) : position.top
      },
      position: position,
      measure: measure
    };

  }

  const DIRECTIONS = Object.freeze({
    ArrowDown: 'next',
    ArrowUp: 'previous',
    Home: 'first',
    End: 'last'
  });

  function useMenuCollection (options = {}) {

    const latestRef = React.useRef(options);
    latestRef.current = options;
    const itemsRef = React.useRef([]);
    const [state, setState] = React.useState({
      items: [],
      hasIcons: false,
      hasSelectableItems: false
    });

    const registerItem = React.useCallback(function (item) {
      if (item === null || typeof item !== 'object' || !item.ref) {
        return function () {};
      }
      itemsRef.current = itemsRef.current.filter(function (entry) {
        return entry.ref.current && entry.ref !== item.ref;
      });
      itemsRef.current.push(item);
      setState(function (previous) {
        return {
          items: itemsRef.current.slice(),
          hasIcons: previous.hasIcons,
          hasSelectableItems: previous.hasSelectableItems
        };
      });
      return function () {
        itemsRef.current = itemsRef.current.filter(function (entry) {
          return entry.ref !== item.ref;
        });
        setState(function (previous) {
          return {
            items: itemsRef.current.slice(),
            hasIcons: previous.hasIcons,
            hasSelectableItems: previous.hasSelectableItems
          };
        });
      };
    }, []);

    const enableIcons = React.useCallback(function () {
      setState(function (previous) {
        return previous.hasIcons
          ? previous
          : {
            items: previous.items,
            hasIcons: true,
            hasSelectableItems: previous.hasSelectableItems
          };
      });
    }, []);

    const enableSelectableItems = React.useCallback(function () {
      setState(function (previous) {
        return previous.hasSelectableItems
          ? previous
          : {
            items: previous.items,
            hasIcons: previous.hasIcons,
            hasSelectableItems: true
          };
      });
    }, []);

    const focusItem = React.useCallback(function (direction, currentRef) {
      const valid = itemsRef.current.filter(function (item) {
        return item.ref.current && item.disabled !== true;
      });
      if (Utils.isEmptyArray(valid)) {
        return null;
      }
      const index = currentRef
        ? valid.findIndex(function (item) {
          return item.ref === currentRef;
        })
        : -1;
      let target = null;
      if (direction === 'first') {
        target = valid[0];
      } else if (direction === 'last') {
        target = valid[valid.length - 1];
      } else if (direction === 'next') {
        target = valid[(index + 1) % valid.length];
      } else if (direction === 'previous') {
        target = valid[(index - 1 + valid.length) % valid.length];
      }

      if (target && target.ref.current && typeof target.ref.current.focus === 'function') {
        target.ref.current.focus();
      }
      return target;
    }, []);

    const onKeyDown = React.useCallback(function (event) {
      const current = latestRef.current;
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape' && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        if (typeof current.onRequestClose === 'function') {
          current.onRequestClose(event);
        }
        return;
      }
      const direction = DIRECTIONS[event.key];
      if (!direction) {
        return;
      }
      const target = focusItem(direction, null);
      if (target && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
    }, [focusItem]);

    const onBlur = React.useCallback(function (event) {
      const current = latestRef.current;
      const isRoot = current.isRoot !== false;
      const root = current.rootRef && current.rootRef.current;
      if (isRoot && root && !root.contains(event.relatedTarget)) {
        if (typeof current.onRequestClose === 'function') {
          current.onRequestClose(event);
        }
      }
    }, []);

    return {
      registerItem: registerItem,
      enableIcons: enableIcons,
      enableSelectableItems: enableSelectableItems,
      focusItem: focusItem,
      containerProps: {
        onKeyDown: onKeyDown,
        onBlur: onBlur
      },
      state: {
        hasIcons: state.hasIcons,
        hasSelectableItems: state.hasSelectableItems,
        items: state.items
      }
    };

  }

  useMenuCollection.stateKeys = ['hasIcons', 'hasSelectableItems', 'items'];


  return {
    getMenuPosition: getMenuPosition,
    useMenuPosition: useMenuPosition,
    useMenuCollection: useMenuCollection
  };

}
