// Info: Menu behavior - anchored placement for a menu surface and the
// collection state of its items (typeahead, highlight, selection). Owns
// geometry arithmetic and state only; the surface's appearance is the
// component's.

/********************************************************************
Build the menu behaviors for one component system.

@param {Object} deps - { Utils, React }

@return {Object} - { getMenuPosition, useMenuPosition, useMenuCollection }
*********************************************************************/
export default function createMenuBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;


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

  function fitMenuAxis (axis, name, spacing, topAlignment) {

    const candidates = [
      axis.max - spacing - axis.size - axis.anchor >= 0 ? axis.anchor - axis.offset : false,
      axis.reversedAnchor - axis.size >= 0 && axis.reversedAnchor <= axis.max - spacing
        ? axis.reversedAnchor - axis.size + axis.offset
        : false,
      axis.max - spacing - axis.size
    ];
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
    return {
      left: fitMenuAxis(axes.x, 'x', spacing, topAlignment),
      top: fitMenuAxis(axes.y, 'y', spacing, topAlignment)
    };

  }

  function useMenuPosition (options = {}) {

    const latestRef = React.useRef(options);
    latestRef.current = options;
    const [position, setPosition] = React.useState(null);

    const measure = React.useCallback(function () {
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
          viewport = {
            width: typeof window === 'undefined' ? 0 : window.innerWidth,
            height: typeof window === 'undefined' ? 0 : window.innerHeight
          };
        }
        const container = current.containerRef && current.containerRef.current;
        let actionButtonWidth = current.actionButtonWidth;
        if (actionButtonWidth === undefined && container &&
            typeof container.getBoundingClientRect === 'function') {
          actionButtonWidth = container.getBoundingClientRect().width;
        }
        setPosition(getMenuPosition({
          x: current.x,
          y: current.y,
          menuAlignment: current.menuAlignment,
          menuSize: { width: rect.width, height: rect.height },
          viewport: viewport,
          spacing: current.spacing,
          actionButtonWidth: actionButtonWidth
        }));
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

    return {
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
