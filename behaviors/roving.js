// Info: Roving tab index for composite widgets.
//
// For tabs, radio groups, menus, switchers, trees, pagination navs.
// Exactly one item carries focusable=true; every other carries
// focusable=false. Arrows move the active index, Home and End jump to the
// ends, and movement loops or clamps by the loop option.
//
// focusable=false must be passed explicitly: react-native-web auto-assigns
// tabindex=0 to radio and checkbox roles, so omitting it leaves a tab stop
// on every item. On native there is no key handler - screen readers use
// swipe order, not tab order - but the item props are identical.


/********************************************************************
Build the roving behaviors for one component system.

@param {Object} deps - { React, platform }

@return {Object} - { useRovingTabIndex }
*********************************************************************/
export default function createRovingBehaviors (deps) {

  const React = deps.React;
  const platform = deps.platform;


  /********************************************************************
  Arrow/Home/End navigation over an indexable item set.

  @param {Object}   options
  @param {Number}   options.count               - Item count
  @param {Number}   options.activeIndex         - The focusable item's index
  @param {Function} [options.onActiveIndexChange] - Called with the next index
  @param {String}   [options.orientation]       - 'horizontal' (default) or 'vertical'
  @param {Boolean}  [options.loop]              - Wrap at the ends (default true)

  @return {Object} - { getItemProps, containerProps }
  *********************************************************************/
  function useRovingTabIndex (options) {

    const count = options.count;
    const activeIndex = options.activeIndex;
    const onActiveIndexChange = options.onActiveIndexChange;
    const orientation = options.orientation || 'horizontal';
    const loop = options.loop !== false;

    const handleKeyDown = React.useCallback(function (event) {

      // An empty set has no valid index to move to
      if (count <= 0) {
        return;
      }

      const isHorizontal = orientation === 'horizontal';
      const forwardKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
      const backwardKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

      let nextIndex;
      if (event.key === forwardKey) {
        nextIndex = activeIndex + 1;
      } else if (event.key === backwardKey) {
        nextIndex = activeIndex - 1;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = count - 1;
      } else {
        return;
      }

      if (loop) {
        if (nextIndex >= count) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = count - 1;
        }
      } else {
        nextIndex = Math.max(0, Math.min(count - 1, nextIndex));
      }

      // Only handled keys suppress the browser's default scroll/focus move
      event.preventDefault();

      if (nextIndex !== activeIndex && typeof onActiveIndexChange === 'function') {
        onActiveIndexChange(nextIndex);
      }

    }, [activeIndex, count, orientation, loop, onActiveIndexChange]);

    const getItemProps = function (index) {
      return {
        focusable: index === activeIndex
      };
    };

    const containerProps = {};
    if (platform.os === 'web') {
      containerProps.onKeyDown = handleKeyDown;
    }

    return {
      getItemProps: getItemProps,
      containerProps: containerProps
    };

  }


  return {
    useRovingTabIndex: useRovingTabIndex
  };

}
