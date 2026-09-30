// Info: Headless control behaviors: text field, button, checkbox, select.
//
// This layer owns state, keyboard, focus, and accessibility props. It owns no
// appearance: no color, size, radius, border, font, token read, or design
// system name appears anywhere in this package, and a test enforces that.
//
// Every hook returns prop getters plus one flat `state` object. A component consumes
// `state` and never recomputes it; this layer never knows what `focused` looks
// like. React Native has no CSS, so an explicit state object is the RN-correct
// equivalent of the `data-state` attribute seam a web headless library uses.
//
// Each hook publishes its own `stateKeys` so the contract is assertable without
// rendering anything.


/********************************************************************
Build the controls behaviors for one component system.

@param {Object} deps - { Utils, React }

@return {Object} - { useTextField, useButton, useCheckbox, useSelect }
*********************************************************************/
export default function createControlsBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;
  const { useCallback, useEffect, useId, useMemo, useState } = React;


  // Press timing is BEHAVIOR, so it lives here rather than in a component. React
  // Native Web's PressResponder applies a 50ms DEFAULT_PRESS_DELAY_MS when
  // `delayPressIn` is unset, which emulates touch latency and is wrong for a
  // pointer-driven surface: a press-driven visual would lag the pointer by a
  // frame or three. Zeroing it once here keeps the decision in one place instead
  // of duplicated in every component.
  const PRESS_DELAY_IN = 0;

  /********************************************************************
  Resolve a controlled or uncontrolled value without branching at the
  call site.

  @param {*} controlled - The caller's value, or undefined
  @param {*} fallback - Internal value

  @return {*} - The value in effect
  *********************************************************************/
  function effective (controlled, fallback) {

    return controlled === undefined ? fallback : controlled;

  }

  /********************************************************************
  Text field behavior: focus, hover, populated, invalid, disabled, and
  the label relation.

  `populated` exists because a floating-label field opens its notch
  when the field is focused OR already has a value. A core exposing only
  `focused` could not drive that anatomy, and the omission would surface
  only once the notch test ran.

  @param {Object} props - { value, onChangeText, label, invalid, disabled }

  @return {Object} - { rootProps, inputProps, labelProps, state }
  *********************************************************************/
  function useTextField (props) {

    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    const labelId = useId();
    const value = effective(props.value, internalValue);
    const disabled = props.disabled === true;
    const invalid = props.invalid === true;

    const onChangeText = useCallback(function (next) {
      setInternalValue(next);
      if (props.onChangeText) {
        props.onChangeText(next);
      }
    }, [props.onChangeText]);

    useEffect(function () {
      if (disabled) {
        setFocused(false);
        setHovered(false);
      }
    }, [disabled]);

    const state = useMemo(function () {
      return {
        focused: focused,
        hovered: hovered,
        disabled: disabled,
        invalid: invalid,
        populated: Utils.isString(value) && !Utils.isEmptyString(value)
      };
    }, [focused, hovered, disabled, invalid, value]);

    return {
      rootProps: {
        onPointerEnter: function () {
          if (disabled) {
            return;
          }
          setHovered(true);
        },
        onPointerLeave: function () {
          setHovered(false);
        }
      },
      inputProps: {
        value: value,
        onChangeText: onChangeText,
        editable: !disabled,
        'aria-labelledby': props.label ? labelId : undefined,
        'aria-invalid': invalid ? true : undefined,
        'aria-disabled': disabled ? true : undefined,
        onFocus: function (event) {
          if (disabled) {
            return;
          }
          setFocused(true);
          if (typeof props.onFocus === 'function') {
            props.onFocus(event);
          }
        },
        onBlur: function (event) {
          setFocused(false);
          if (typeof props.onBlur === 'function') {
            props.onBlur(event);
          }
        }
      },
      labelProps: props.label ? { nativeID: labelId } : {},
      state: state
    };

  }

  useTextField.stateKeys = ['focused', 'hovered', 'disabled', 'invalid', 'populated'];

  /********************************************************************
  Button behavior: press, hover, focus, selected, disabled.

  State priority is disabled first, then selected, then pressed, then
  hovered, then focused.

  @param {Object} props - { children, disabled, selected, onPress }

  @return {Object} - { rootProps, state }
  *********************************************************************/
  function useButton (props) {

    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);

    const disabled = props.disabled === true;
    const selected = props.selected === true;

    const state = useMemo(function () {
      return {
        focused: focused,
        hovered: hovered,
        pressed: pressed,
        disabled: disabled,
        selected: selected
      };
    }, [focused, hovered, pressed, disabled, selected]);

    const label = Utils.isString(props.children) ? props.children : props.accessibilityLabel;

    return {
      rootProps: {
        accessibilityRole: 'button',
        accessibilityLabel: label,
        delayPressIn: PRESS_DELAY_IN,
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled,
        onPress: disabled ? undefined : props.onPress,
        onPressIn: function () {
          setPressed(true);
        },
        onPressOut: function () {
          setPressed(false);
        },
        onPointerEnter: function () {
          setHovered(true);
        },
        onPointerLeave: function () {
          setHovered(false);
        },
        onFocus: function () {
          setFocused(true);
        },
        onBlur: function () {
          setFocused(false);
        }
      },
      state: state
    };

  }

  useButton.stateKeys = ['focused', 'hovered', 'pressed', 'disabled', 'selected'];

  /********************************************************************
  Checkbox behavior: checked, indeterminate, and the interaction states.

  @param {Object} props - { checked, indeterminate, disabled, label, onChange }

  @return {Object} - { rootProps, inputProps, labelProps, state }
  *********************************************************************/
  function useCheckbox (props) {

    const [internalChecked, setInternalChecked] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);

    const labelId = useId();
    const checked = effective(props.checked, internalChecked);
    const indeterminate = props.indeterminate === true;
    const disabled = props.disabled === true;

    const toggle = useCallback(function () {
      const next = !checked;
      setInternalChecked(next);
      if (props.onChange) {
        props.onChange(next);
      }
    }, [checked, props.onChange]);

    const state = useMemo(function () {
      return {
        checked: checked === true,
        indeterminate: indeterminate,
        focused: focused,
        hovered: hovered,
        pressed: pressed,
        disabled: disabled
      };
    }, [checked, indeterminate, focused, hovered, pressed, disabled]);

    return {
      rootProps: {
        accessibilityRole: 'checkbox',
        delayPressIn: PRESS_DELAY_IN,
        'aria-labelledby': labelId,
        'aria-checked': indeterminate ? 'mixed' : checked === true,
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled,
        onPress: disabled ? undefined : toggle,
        // The web press responder activates a checkbox on Enter only; the
        // checkbox pattern toggles on Space, so Space is handled here
        onKeyDown: function (event) {
          if (disabled || event.key !== ' ') {
            return;
          }
          event.preventDefault();
          toggle();
        },
        onPressIn: function () {
          setPressed(true);
        },
        onPressOut: function () {
          setPressed(false);
        },
        onPointerEnter: function () {
          setHovered(true);
        },
        onPointerLeave: function () {
          setHovered(false);
        },
        onFocus: function () {
          setFocused(true);
        },
        onBlur: function () {
          setFocused(false);
        }
      },
      inputProps: { value: checked === true },
      labelProps: { nativeID: labelId },
      state: state
    };

  }

  useCheckbox.stateKeys = ['checked', 'indeterminate', 'focused', 'hovered', 'pressed', 'disabled'];

  /********************************************************************
  Select behavior: open and close, selection, keyboard traversal.

  Keyboard handling lives here, never in a component. Arrow keys move the
  highlight, Enter and Space commit, Escape closes and restores focus to
  the trigger.

  @param {Object} props - { items, value, disabled, label, onChange }

  @return {Object} - { rootProps, triggerProps, listProps, getOptionProps, state }
  *********************************************************************/
  function useSelect (props) {

    const items = Array.isArray(props.items) ? props.items : [];

    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [internalIndex, setInternalIndex] = useState(-1);

    const labelId = useId();
    const listId = useId();
    const disabled = props.disabled === true;

    const selectedIndex = props.value === undefined
      ? internalIndex
      : items.findIndex(function (item) {
        return item.value === props.value;
      });

    const commit = useCallback(function (index) {
      setInternalIndex(index);
      setOpen(false);
      if (props.onChange && items[index]) {
        props.onChange(items[index].value);
      }
    }, [items, props.onChange]);

    const move = useCallback(function (delta) {
      setHighlightedIndex(function (current) {
        if (Utils.isEmptyArray(items)) {
          return -1;
        }
        const next = current + delta;
        if (next < 0) {
          return items.length - 1;
        }
        if (next >= items.length) {
          return 0;
        }

        return next;
      });
    }, [items]);

    const onKeyDown = useCallback(function (event) {
      const key = event && (event.key || (event.nativeEvent && event.nativeEvent.key));
      if (disabled) {
        return;
      }
      if (key === 'ArrowDown') {
        setOpen(true);
        move(1);

        return;
      }
      if (key === 'ArrowUp') {
        setOpen(true);
        move(-1);

        return;
      }
      if (key === 'Escape') {
        setOpen(false);

        return;
      }
      if (key === 'Enter' || key === ' ') {
        if (!open) {
          setOpen(true);

          return;
        }
        if (highlightedIndex >= 0) {
          commit(highlightedIndex);
        }
      }
    }, [disabled, open, highlightedIndex, move, commit]);

    const state = useMemo(function () {
      return {
        open: open,
        focused: focused,
        disabled: disabled,
        selectedIndex: selectedIndex,
        highlightedIndex: highlightedIndex
      };
    }, [open, focused, disabled, selectedIndex, highlightedIndex]);

    return {
      rootProps: {},
      triggerProps: {
        accessibilityRole: 'combobox',
        'aria-labelledby': labelId,
        'aria-expanded': open,
        'aria-controls': listId,
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled,
        onKeyDown: onKeyDown,
        onPress: disabled ? undefined : function () {
          setOpen(!open);
        },
        onFocus: function () {
          setFocused(true);
        },
        onBlur: function () {
          setFocused(false);
        }
      },
      listProps: { nativeID: listId, accessibilityRole: 'listbox' },
      labelProps: { nativeID: labelId },
      getOptionProps: function (index) {
        return {
          accessibilityRole: 'option',
          'aria-selected': index === selectedIndex,
          onPress: function () {
            commit(index);
          },
          onPointerEnter: function () {
            setHighlightedIndex(index);
          }
        };
      },
      state: state
    };

  }

  useSelect.stateKeys = ['open', 'focused', 'disabled', 'selectedIndex', 'highlightedIndex'];


  return {
    useTextField: useTextField,
    useButton: useButton,
    useCheckbox: useCheckbox,
    useSelect: useSelect
  };

}
