// Info: Generic local-state behavior primitives.
//
// The small owned-state machines that component behavior composes from:
// open/close disclosure, focus tracking, press/hover/focus interaction,
// and a timed flag. They own state and event wiring only - no appearance,
// no geometry, no token read.
//
// Timers live here because timing is behavior: a component's duration is
// policy and is passed in by the caller, never defaulted inside the
// primitive.


/********************************************************************
Build the local behaviors for one component system.

@param {Object} deps - { Utils, React, ReactNative, platform, useControllableState }

@return {Object} - { useDisclosure, useFocusState, useInteractionState, useTimedFlag,
  useReducedMotion, useLiveRegionHost, useFormSubmit,
  useResponsiveStack }
*********************************************************************/
export default function createLocalBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;
  const { AccessibilityInfo } = deps.ReactNative;
  const platform = deps.platform;
  const useControllableState = deps.useControllableState;


  /********************************************************************
  Open/close disclosure with controlled and uncontrolled modes.

  @param {Object}   options
  @param {Boolean}  [options.open]         - Controlled open value
  @param {Boolean}  [options.defaultOpen]  - Initial uncontrolled value
  @param {Function} [options.onOpenChange] - Called with the next open value
  @param {Boolean}  [options.disabled]     - Suppresses open/close/toggle

  @return {Object} - { state: { open, disabled }, open, close, toggle }
  *********************************************************************/
  function useDisclosure (options) {

    const disabled = options.disabled === true;

    const pair = useControllableState({
      value: options.open,
      defaultValue: options.defaultOpen === true,
      onChange: options.onOpenChange
    });
    const resolved = pair[0];
    const setValue = pair[1];

    const disabledRef = React.useRef(disabled);
    disabledRef.current = disabled;

    const open = React.useCallback(function () {
      if (!disabledRef.current) {
        setValue(true);
      }
    }, [setValue]);

    const close = React.useCallback(function () {
      if (!disabledRef.current) {
        setValue(false);
      }
    }, [setValue]);

    const toggle = React.useCallback(function () {
      if (!disabledRef.current) {
        setValue(function (current) {
          return current !== true;
        });
      }
    }, [setValue]);

    return {
      state: {
        open: resolved === true,
        disabled: disabled
      },
      open: open,
      close: close,
      toggle: toggle
    };

  }

  useDisclosure.stateKeys = ['open', 'disabled'];


  /********************************************************************
  Focused flag with callback delegation.

  Focus is ignored while disabled; blur always clears a prior state and
  always delegates. Callbacks are read through a latest-value ref so an
  inline onFocus/onBlur never churns the returned handlers.

  @param {Object}   options
  @param {Function} [options.onFocus]  - Delegated focus callback
  @param {Function} [options.onBlur]   - Delegated blur callback
  @param {Boolean}  [options.disabled] - Suppresses focus entry

  @return {Object} - { focusProps, state: { focused, disabled } }
  *********************************************************************/
  function useFocusState (options) {

    const [focused, setFocused] = React.useState(false);
    const disabled = options.disabled === true;

    const liveRef = React.useRef(null);
    liveRef.current = {
      onFocus: options.onFocus,
      onBlur: options.onBlur,
      disabled: disabled
    };

    // A control disabled while focused may never receive the exit event;
    // the disabled state must not retain an active visual state.
    React.useEffect(function () {
      if (disabled) {
        setFocused(false);
      }
    }, [disabled]);

    const onFocus = React.useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled) {
        return;
      }
      setFocused(true);
      if (typeof live.onFocus === 'function') {
        live.onFocus(event);
      }
    }, []);

    const onBlur = React.useCallback(function (event) {
      const live = liveRef.current;
      setFocused(false);
      if (typeof live.onBlur === 'function') {
        live.onBlur(event);
      }
    }, []);

    return {
      focusProps: {
        onFocus: onFocus,
        onBlur: onBlur
      },
      state: {
        focused: focused,
        disabled: disabled
      }
    };

  }

  useFocusState.stateKeys = ['focused', 'disabled'];


  /********************************************************************
  Press/hover/focus interaction state for a pressable surface.

  Entry handlers (press, hover, focus) are suppressed while disabled; exit
  handlers always clear existing state and always delegate. Every handler
  is a stable callback reading a latest-value ref, so fresh inline options
  never churn the props a component spreads.

  @param {Object}   options
  @param {Boolean}  [options.disabled]
  @param {Function} [options.onPress]
  @param {Function} [options.onPressIn]
  @param {Function} [options.onPressOut]
  @param {Function} [options.onHoverIn]
  @param {Function} [options.onHoverOut]
  @param {Function} [options.onFocus]
  @param {Function} [options.onBlur]

  @return {Object} - { rootProps, state: { focused, hovered, pressed, disabled } }
  *********************************************************************/
  function useInteractionState (options) {

    const [focused, setFocused] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);
    const disabled = options.disabled === true;

    const liveRef = React.useRef(null);
    liveRef.current = {
      disabled: disabled,
      onPress: options.onPress,
      onPressIn: options.onPressIn,
      onPressOut: options.onPressOut,
      onHoverIn: options.onHoverIn,
      onHoverOut: options.onHoverOut,
      onFocus: options.onFocus,
      onBlur: options.onBlur
    };

    // A control disabled while focused/hovered/pressed may never receive the
    // exit events; disabled must not retain an active visual state.
    React.useEffect(function () {
      if (disabled) {
        setFocused(false);
        setHovered(false);
        setPressed(false);
      }
    }, [disabled]);

    const onPress = React.useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled) {
        return;
      }
      if (typeof live.onPress === 'function') {
        live.onPress(event);
      }
    }, []);

    const onPressIn = React.useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled) {
        return;
      }
      setPressed(true);
      if (typeof live.onPressIn === 'function') {
        live.onPressIn(event);
      }
    }, []);

    const onPressOut = React.useCallback(function (event) {
      const live = liveRef.current;
      setPressed(false);
      if (typeof live.onPressOut === 'function') {
        live.onPressOut(event);
      }
    }, []);

    const onHoverIn = React.useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled) {
        return;
      }
      setHovered(true);
      if (typeof live.onHoverIn === 'function') {
        live.onHoverIn(event);
      }
    }, []);

    const onHoverOut = React.useCallback(function (event) {
      const live = liveRef.current;
      setHovered(false);
      if (typeof live.onHoverOut === 'function') {
        live.onHoverOut(event);
      }
    }, []);

    const onFocus = React.useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled) {
        return;
      }
      setFocused(true);
      if (typeof live.onFocus === 'function') {
        live.onFocus(event);
      }
    }, []);

    const onBlur = React.useCallback(function (event) {
      const live = liveRef.current;
      setFocused(false);
      if (typeof live.onBlur === 'function') {
        live.onBlur(event);
      }
    }, []);

    return {
      rootProps: {
        delayPressIn: 0,
        onPress: onPress,
        onPressIn: onPressIn,
        onPressOut: onPressOut,
        onHoverIn: onHoverIn,
        onHoverOut: onHoverOut,
        onFocus: onFocus,
        onBlur: onBlur
      },
      state: {
        focused: focused,
        hovered: hovered,
        pressed: pressed,
        disabled: disabled
      }
    };

  }

  useInteractionState.stateKeys = ['focused', 'hovered', 'pressed', 'disabled'];


  /********************************************************************
  A flag that activates immediately and resets after a duration.

  The duration is required caller policy - a component like a copy button
  passes its own; the generic primitive hides no default.

  @param {Object} options
  @param {Number} options.duration - Milliseconds until the flag resets

  @return {Object} - { state: { active }, activate, clear }
  *********************************************************************/
  function useTimedFlag (options) {

    const duration = options && options.duration;
    if (!Utils.isNumber(duration) || !Number.isFinite(duration) || duration < 0) {
      throw new TypeError('useTimedFlag: duration must be a finite number greater than or equal to 0');
    }

    const [active, setActive] = React.useState(false);
    const timerRef = React.useRef(null);
    const durationRef = React.useRef(duration);
    durationRef.current = duration;

    const activate = React.useCallback(function () {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      setActive(true);
      timerRef.current = setTimeout(function () {
        timerRef.current = null;
        setActive(false);
      }, durationRef.current);
    }, []);

    const clear = React.useCallback(function () {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setActive(false);
    }, []);

    // Unmount cancels the pending timer without touching state
    React.useEffect(function () {
      return function () {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, []);

    return {
      state: {
        active: active
      },
      activate: activate,
      clear: clear
    };

  }

  useTimedFlag.stateKeys = ['active'];


  function useReducedMotion (source) {

    const resolvedSource = source || AccessibilityInfo;

    if (typeof resolvedSource.isReduceMotionEnabled !== 'function' ||
        typeof resolvedSource.addEventListener !== 'function') {
      throw new TypeError('useReducedMotion: source must provide isReduceMotionEnabled and addEventListener');
    }

    const [reducedMotion, setReducedMotion] = React.useState(false);

    React.useEffect(function () {
      let active = true;
      const update = function (value) {
        if (active) {
          setReducedMotion(Boolean(value));
        }
      };
      Promise.resolve(resolvedSource.isReduceMotionEnabled()).then(update);
      const subscription = resolvedSource.addEventListener('reduceMotionChanged', update);
      return function () {
        active = false;
        if (subscription && typeof subscription.remove === 'function') {
          subscription.remove();
        }
      };
    }, [resolvedSource]);

    return {
      state: {
        reducedMotion: reducedMotion
      }
    };

  }

  useReducedMotion.stateKeys = ['reducedMotion'];


  /********************************************************************
  Live-region host: announcement routing and the message state the two
  mounted regions display. Native delegates to the platform announcer;
  web stores the exact message text and bumps a per-channel revision on
  every announcement so an identical repeated message still remounts its
  region text and re-announces.

  @param {Object}   [source]
  @param {String}   [source.platform] - Overrides platform.os
  @param {Function} [source.announce] - Overrides the native announcer

  @return {Object} - { announce, state: { isWeb, politeMessage,
    assertiveMessage, politeRevision, assertiveRevision } }
  *********************************************************************/
  function useLiveRegionHost (source) {

    const os = !Utils.isNullOrUndefined(source) &&
      !Utils.isNullOrUndefined(source.platform)
      ? source.platform
      : platform.os;
    const announcer = !Utils.isNullOrUndefined(source) &&
      typeof source.announce === 'function'
      ? source.announce
      : AccessibilityInfo.announceForAccessibility;

    const [messages, setMessages] = React.useState({
      politeMessage: '',
      assertiveMessage: '',
      politeRevision: 0,
      assertiveRevision: 0
    });

    const announce = React.useCallback(function (message, politeness) {

      const level = politeness || 'polite';

      if (os !== 'web') {
        if (typeof announcer === 'function') {
          announcer(message);
        }
        return;
      }

      const text = String(message);
      setMessages(function (current) {
        if (level === 'assertive') {
          return Object.assign({}, current, {
            assertiveMessage: text,
            assertiveRevision: current.assertiveRevision + 1
          });
        }
        return Object.assign({}, current, {
          politeMessage: text,
          politeRevision: current.politeRevision + 1
        });
      });

    }, [os, announcer]);

    return {
      announce: announce,
      state: {
        isWeb: os === 'web',
        politeMessage: messages.politeMessage,
        assertiveMessage: messages.assertiveMessage,
        politeRevision: messages.politeRevision,
        assertiveRevision: messages.assertiveRevision
      }
    };

  }

  useLiveRegionHost.stateKeys = [
    'isWeb',
    'politeMessage',
    'assertiveMessage',
    'politeRevision',
    'assertiveRevision'
  ];


  /********************************************************************
  Form submit handling: native submission prevention plus latest-callback
  delegation. The returned formProps spreads onto the form element. The
  options are read through a latest-value ref, so a fresh inline onSubmit
  never churns the stable submit handler a component spreads.

  @param {Object}   [options]
  @param {Function} [options.onSubmit] - Delegated submit callback

  @return {Object} - { formProps: { onSubmit }, state: {} }
  *********************************************************************/
  function useFormSubmit (options) {

    const liveRef = React.useRef(null);
    liveRef.current = options;

    const handleSubmit = React.useCallback(function (event) {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      const live = liveRef.current;
      if (live && typeof live.onSubmit === 'function') {
        live.onSubmit(event);
      }
    }, []);

    return {
      formProps: {
        onSubmit: handleSubmit
      },
      state: {}
    };

  }

  useFormSubmit.stateKeys = [];

  function useResponsiveStack (options = {}) {

    const enabled = options.enabled === true;
    const forced = options.stacked === true;
    const itemCount = Number.isFinite(options.itemCount) ? Math.max(0, options.itemCount) : 0;
    const minItemWidth = Number.isFinite(options.minItemWidth) ? Math.max(0, options.minItemWidth) : 0;
    const [width, setWidth] = React.useState(undefined);

    const onLayout = React.useCallback(function (event) {
      const next = event && event.nativeEvent && event.nativeEvent.layout
        ? event.nativeEvent.layout.width
        : undefined;
      if (Number.isFinite(next)) {
        setWidth(Math.max(0, next));
      }
    }, []);

    const responsive = enabled && width !== undefined && itemCount > 0 &&
      width <= itemCount * minItemWidth;

    return {
      onLayout: onLayout,
      state: { stacked: enabled ? responsive : forced }
    };

  }

  useResponsiveStack.stateKeys = ['stacked'];


  return {
    useDisclosure: useDisclosure,
    useFocusState: useFocusState,
    useInteractionState: useInteractionState,
    useTimedFlag: useTimedFlag,
    useReducedMotion: useReducedMotion,
    useLiveRegionHost: useLiveRegionHost,
    useFormSubmit: useFormSubmit,
    useResponsiveStack: useResponsiveStack
  };

}
