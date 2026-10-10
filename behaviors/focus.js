// Info: Focus behavior core for overlay components.
//
// Owns the managed-overlay obligations that are behavior, not appearance:
// record and restore focus, move focus in on open, wrap Tab inside the
// container, dismiss on Escape (web) or hardware back (Android), and emit
// the dialog semantics. It returns no geometry, zIndex, or token value.
//
// `active` separates the topmost overlay from the layers beneath it: only
// the active layer listens for dismissal or wraps Tab, so a stacked layer
// under a Modal never intercepts its input.


/********************************************************************
Build the focus behaviors for one component system.

@param {Object} deps - { Utils, React, ReactNative, platform }

@return {Object} - { useFocusTrap }
*********************************************************************/
export default function createFocusBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;
  const { AccessibilityInfo, BackHandler, findNodeHandle } = deps.ReactNative;
  const platform = deps.platform;


  /********************************************************************
  Focus trap hook for a single overlay layer.

  @param {Object}   options
  @param {Boolean}  options.isOpen          - Whether the overlay is open
  @param {Boolean}  [options.active]        - Whether this is the topmost layer
  @param {Boolean}  [options.trap]          - Whether Tab cycles inside it
  @param {Function} [options.onClose]       - Called on Escape/back/outside press
  @param {Object}   [options.initialFocusRef] - Focused on open (default: container)
  @param {Object}   [options.finalFocusRef]   - Focused on close (default: previous)

  @return {Object} - { containerRef, onOutsidePress, accessibilityProps }
  *********************************************************************/
  function useFocusTrap (options) {

    const isOpen = options.isOpen;
    const trap = options.trap !== false;
    const active = options.active !== false;

    const containerRef = React.useRef(null);
    const previousFocusRef = React.useRef(null);

    // Latest-value box so an inline onClose never detaches and reattaches
    // the global listeners on every render.
    const onCloseRef = React.useRef(options.onClose);
    onCloseRef.current = options.onClose;


    // Focus memory lifecycle: record on open, restore on close or unmount.
    React.useEffect(function () {

      if (!isOpen) {
        return;
      }

      if (platform.os === 'web' && typeof document !== 'undefined') {
        previousFocusRef.current = document.activeElement;
      }

      return function () {
        const explicit = options.finalFocusRef && options.finalFocusRef.current;
        if (explicit && typeof explicit.focus === 'function') {
          explicit.focus();
        } else if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      };

      // finalFocusRef is a ref object; reading .current at cleanup time is
      // the point of the pattern, so it is intentionally not a dependency.
    }, [isOpen]);


    // Active lifecycle: only the topmost layer takes focus.
    React.useEffect(function () {

      if (!isOpen || !active) {
        return;
      }

      const initial = options.initialFocusRef && options.initialFocusRef.current;
      if (initial && typeof initial.focus === 'function') {
        initial.focus();
      } else if (containerRef.current && typeof containerRef.current.focus === 'function') {
        containerRef.current.focus();
      }

      // Native rendering remains unconfirmed; preserve the existing timing
      // workaround (two setAccessibilityFocus calls) rather than inventing a
      // different native behavior.
      if (platform.os !== 'web' && containerRef.current) {
        const tag = findNodeHandle(containerRef.current);
        if (tag != null) {
          AccessibilityInfo.setAccessibilityFocus(tag);
          AccessibilityInfo.setAccessibilityFocus(tag);
        }
      }

    }, [isOpen, active]);


    // Dismissal input: Escape on web, hardware back on Android, only while
    // this layer is the active one.
    React.useEffect(function () {

      if (!isOpen || !active) {
        return;
      }

      if (platform.os === 'web' && typeof document !== 'undefined' &&
          typeof document.addEventListener === 'function') {

        const handleKeyDown = function (event) {
          if (event.key === 'Escape' && typeof onCloseRef.current === 'function') {
            onCloseRef.current();
          }
        };

        document.addEventListener('keydown', handleKeyDown);

        return function () {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }

      if (platform.os === 'android') {

        const handleBackPress = function () {
          if (typeof onCloseRef.current === 'function') {
            onCloseRef.current();
          }

          return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return function () {
          if (subscription && typeof subscription.remove === 'function') {
            subscription.remove();
          } else if (typeof BackHandler.removeEventListener === 'function') {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          }
        };
      }

    }, [isOpen, active]);


    // Tab wrapping: only while the layer is open, active, and trapping.
    React.useEffect(function () {

      if (!isOpen || !active || !trap || platform.os !== 'web' || typeof document === 'undefined' ||
          typeof document.addEventListener !== 'function') {
        return;
      }

      const handleTabKey = function (event) {

        if (event.key !== 'Tab') {
          return;
        }

        const container = containerRef.current;
        if (!container) {
          return;
        }

        const focusable = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (Utils.isEmptyArray(focusable)) {
          event.preventDefault();

          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }

      };

      document.addEventListener('keydown', handleTabKey);

      return function () {
        document.removeEventListener('keydown', handleTabKey);
      };

    }, [isOpen, active, trap]);


    const onOutsidePress = function () {
      if (active && typeof onCloseRef.current === 'function') {
        onCloseRef.current();
      }
    };


    // A non-trapping popover is still a dialog; it is simply not modal.
    const accessibilityProps = {
      accessibilityRole: 'dialog',
      'aria-modal': trap ? true : undefined,
      focusable: true
    };

    return {
      containerRef: containerRef,
      onOutsidePress: onOutsidePress,
      accessibilityProps: accessibilityProps
    };

  }


  return {
    useFocusTrap: useFocusTrap
  };

}
