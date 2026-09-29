// Info: Controlled/uncontrolled state hook.
//
// Every form component supports both controlled and uncontrolled use; this
// hook implements the pattern once. Controlled iff `value` is not
// undefined. The initial mode is remembered and a switch is reported at
// most once through onModeSwitch - a caller surfaces it how it chooses,
// so the behavior layer never reaches for a logging or debug dependency.
//
// The setter holds its identity across renders: it reads the live mode,
// resolved value, and callbacks through a latest-value ref, so an inline
// onChange never churns the setter.


/********************************************************************
Build the state behaviors for one component system.

@param {Object} deps - { React }

@return {Object} - { useControllableState, useAccordionItemState, useTabsState }
*********************************************************************/
export default function createStateBehaviors (deps) {

  const React = deps.React;


  /********************************************************************
  Resolve a controlled or uncontrolled value with a stable setter.

  @param {Object}   options
  @param {*}        [options.value]        - Controlled value
  @param {*}        [options.defaultValue] - Initial uncontrolled value
  @param {Function} [options.onChange]     - Called with the next value
  @param {Function} [options.onModeSwitch] - Called at most once with
    { from, to } when the mode diverges from the initial mode

  @return {Array} - [resolvedValue, setValue]
  *********************************************************************/
  function useControllableState (options) {

    const value = options.value;
    const controlled = value !== undefined;

    const [internalValue, setInternalValue] = React.useState(options.defaultValue);

    const resolvedValue = controlled ? value : internalValue;

    // Live box for everything the setter needs, so the setter's identity
    // does not depend on callback or value identity.
    const liveRef = React.useRef(null);
    liveRef.current = {
      controlled: controlled,
      resolved: resolvedValue,
      onChange: options.onChange,
      onModeSwitch: options.onModeSwitch
    };

    const initialControlledRef = React.useRef(controlled);
    const reportedRef = React.useRef(false);

    React.useEffect(function () {

      if (reportedRef.current || controlled === initialControlledRef.current) {
        return;
      }

      reportedRef.current = true;
      if (typeof liveRef.current.onModeSwitch === 'function') {
        liveRef.current.onModeSwitch({
          from: initialControlledRef.current ? 'controlled' : 'uncontrolled',
          to: controlled ? 'controlled' : 'uncontrolled'
        });
      }

    }, [controlled]);

    const setValue = React.useCallback(function (nextValue) {

      const live = liveRef.current;

      // Functional updates evaluate against the resolved current value in
      // both modes: setValue(v => v + 1) works controlled and uncontrolled.
      let actual = nextValue;
      if (typeof actual === 'function') {
        actual = actual(live.resolved);
      }

      // Controlled delegates without mutating; uncontrolled mutates then
      // notifies. The live box is updated before scheduling so a second
      // setter call in the same batch composes on the first's result.
      if (!live.controlled) {
        live.resolved = actual;
        setInternalValue(actual);
      }
      if (typeof live.onChange === 'function') {
        live.onChange(actual);
      }

    }, []);

    return [resolvedValue, setValue];

  }

  function useAccordionItemState (options = {}) {

    const [open, setOpen] = React.useState(options.open === true);
    const previousOpenRef = React.useRef(options.open);
    const liveRef = React.useRef(null);
    liveRef.current = {
      open: open,
      disabled: options.disabled === true,
      onHeadingClick: options.onHeadingClick
    };

    React.useEffect(function () {
      if (options.open !== previousOpenRef.current) {
        previousOpenRef.current = options.open;
        liveRef.current.open = options.open === true;
        setOpen(options.open === true);
      }
    }, [options.open]);

    const toggle = React.useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled) {
        return;
      }
      const next = !live.open;
      live.open = next;
      setOpen(next);
      if (typeof live.onHeadingClick === 'function') {
        live.onHeadingClick({ isOpen: next, event: event });
      }
    }, []);

    return {
      toggle: toggle,
      state: {
        open: open,
        disabled: options.disabled === true
      }
    };

  }

  useAccordionItemState.stateKeys = ['open', 'disabled'];

  function useTabsState (options = {}) {

    const initial = options.defaultSelectedIndex === undefined ? 0 : options.defaultSelectedIndex;
    const [activeIndex, setActiveIndex] = React.useState(initial);
    const selected = useControllableState({
      value: options.selectedIndex,
      defaultValue: initial,
      onChange: function (nextIndex) {
        if (typeof options.onChange === 'function') {
          options.onChange({ selectedIndex: nextIndex });
        }
      }
    });

    return {
      setActiveIndex: setActiveIndex,
      setSelectedIndex: selected[1],
      state: {
        activeIndex: activeIndex,
        selectedIndex: selected[0]
      }
    };

  }

  useTabsState.stateKeys = ['activeIndex', 'selectedIndex'];


  return {
    useControllableState: useControllableState,
    useAccordionItemState: useAccordionItemState,
    useTabsState: useTabsState
  };

}
