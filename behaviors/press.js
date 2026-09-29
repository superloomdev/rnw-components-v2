// Info: Keyboard activation per role.
//
// Covers the react-native-web PressResponder gap where Space does not
// activate non-button roles: the responder gates Space behind role=button,
// so a checkbox, radio, switch, menuitem, option, or tab never fires on
// Space. Enter activates every role.
//
// Hooks run unconditionally on every platform so the call order never
// depends on where the code executes; the platform decides only what the
// hook returns. The handler reads options through a latest-value ref so an
// inline onActivate never recreates the listener.


/********************************************************************
Build the press behaviors for one component system.

@param {Object} deps - { React, platform }

@return {Object} - { usePressKeys }
*********************************************************************/
export default function createPressBehaviors (deps) {

  const React = deps.React;
  const platform = deps.platform;


  // Roles that activate on Space in addition to Enter
  const SPACE_ACTIVATING_ROLES = {
    checkbox: true,
    radio: true,
    switch: true,
    menuitem: true,
    option: true,
    tab: true
  };


  /********************************************************************
  Normalize Enter and Space activation for a pressable role.

  @param {Object} options
  @param {String}   options.role       - The element's accessibility role
  @param {Function} options.onActivate - Called on Enter or gated Space
  @param {Boolean}  [options.disabled] - Suppresses activation

  @return {Object} - { onKeyDown } on web, {} on native
  *********************************************************************/
  function usePressKeys (options) {

    const optionsRef = React.useRef(null);
    optionsRef.current = {
      role: options.role,
      onActivate: options.onActivate,
      disabled: options.disabled
    };

    const handleKeyDown = React.useCallback(function (event) {

      const live = optionsRef.current;
      if (live.disabled) {
        return;
      }

      if (event.key === 'Enter') {
        if (typeof live.onActivate === 'function') {
          live.onActivate(event);
        }

        return;
      }

      // preventDefault keeps Space from scrolling the page
      if (event.key === ' ' && SPACE_ACTIVATING_ROLES[live.role]) {
        event.preventDefault();
        if (typeof live.onActivate === 'function') {
          live.onActivate(event);
        }
      }

    }, []);

    // Native activation already works; the key handler is web-only
    if (platform.os !== 'web') {
      return {};
    }

    return {
      onKeyDown: handleKeyDown
    };

  }


  return {
    usePressKeys: usePressKeys
  };

}
