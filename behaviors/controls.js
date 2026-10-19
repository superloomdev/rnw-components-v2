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
  const { useCallback, useEffect, useId, useMemo, useRef, useState } = React;


  /********************************************************************
  Whether a control's focus came from the keyboard: a pointer press
  focuses a control after its pointer goes down, so focus that arrives
  with no pointer down is keyboard focus. A theme that shows a focus ring
  on keyboard focus only reads this.

  @return {Object} - { focusVisible, onPointerDown, enter(), leave() }
  *********************************************************************/
  function useFocusSource () {

    const pointer = useRef(false);
    const [focusVisible, setFocusVisible] = useState(false);

    return {
      focusVisible: focusVisible,
      onPointerDown: function () {
        pointer.current = true;
      },
      enter: function () {
        setFocusVisible(!pointer.current);
        pointer.current = false;
      },
      leave: function () {
        setFocusVisible(false);
        pointer.current = false;
      }
    };

  }


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
  The index of the first/last enabled item, or -1 when none qualifies.

  @param {Array} items - Option items

  @return {Number}
  *********************************************************************/
  function firstEnabledItem (items) {
    for (let index = 0; index < items.length; index = index + 1) {
      if (items[index].disabled !== true) {
        return index;
      }
    }
    return -1;
  }

  function lastEnabledItem (items) {
    for (let index = items.length - 1; index >= 0; index = index - 1) {
      if (items[index].disabled !== true) {
        return index;
      }
    }
    return -1;
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
    // An uncontrolled field starts at its defaultValue, once; a controlled
    // value always wins
    const [internalValue, setInternalValue] = useState(props.defaultValue === undefined ? '' : props.defaultValue);

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
        populated: Utils.isString(value) && !Utils.isEmptyString(value),
        value: value
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

  useTextField.stateKeys = ['focused', 'hovered', 'disabled', 'invalid', 'populated', 'value'];

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
    const source = useFocusSource();

    const disabled = props.disabled === true;
    const selected = props.selected === true;

    const state = useMemo(function () {
      return {
        focused: focused,
        focusVisible: focused && source.focusVisible,
        hovered: hovered,
        pressed: pressed,
        disabled: disabled,
        selected: selected
      };
    }, [focused, source.focusVisible, hovered, pressed, disabled, selected]);

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
        onPointerDown: source.onPointerDown,
        onFocus: function (event) {
          source.enter();
          setFocused(true);
          if (typeof props.onFocus === 'function') {
            props.onFocus(event);
          }
        },
        onBlur: function (event) {
          source.leave();
          setFocused(false);
          if (typeof props.onBlur === 'function') {
            props.onBlur(event);
          }
        }
      },
      state: state
    };

  }

  useButton.stateKeys = ['focused', 'focusVisible', 'hovered', 'pressed', 'disabled', 'selected'];

  /********************************************************************
  Checkbox behavior: checked, indeterminate, and the interaction states.

  @param {Object} props - { checked, defaultChecked, indeterminate, disabled, label, onChange }

  @return {Object} - { rootProps, inputProps, labelProps, state }
  *********************************************************************/
  function useCheckbox (props) {

    const [internalChecked, setInternalChecked] = useState(props.defaultChecked === true);
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const source = useFocusSource();

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
        focusVisible: focused && source.focusVisible,
        hovered: hovered,
        pressed: pressed,
        disabled: disabled
      };
    }, [checked, indeterminate, focused, source.focusVisible, hovered, pressed, disabled]);

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
        onPointerDown: source.onPointerDown,
        onFocus: function () {
          source.enter();
          setFocused(true);
        },
        onBlur: function () {
          source.leave();
          setFocused(false);
        }
      },
      inputProps: { value: checked === true },
      labelProps: { nativeID: labelId },
      state: state
    };

  }

  useCheckbox.stateKeys = ['checked', 'indeterminate', 'focused', 'focusVisible', 'hovered', 'pressed', 'disabled'];

  /********************************************************************
  Select behavior: open and close, selection, keyboard traversal.

  Keyboard handling lives here, never in a component. Arrow keys move the
  highlight, Enter and Space commit, Escape closes and restores focus to
  the trigger.

  Options are addressed by VALUE, not ordinal: an index-only selection
  silently follows a different item after a reorder, and a retained
  option callback would commit whatever row now sits at its old index.
  The stored selection and highlight therefore hold the option's value,
  and the reported indices are derived from the current items.

  @param {Object} props - { items, value, defaultValue, disabled, label,
                          onChange, onOpenChange, closeOnSelect, onSelect }

  @return {Object} - { rootProps, triggerProps, listProps, labelProps,
                      setOpen, getOptionProps, items, value, selectValue,
                      clearSelection, highlightValue, highlightFirst,
                      highlightLast, state }
  *********************************************************************/
  function useSelect (props) {

    const items = Array.isArray(props.items) ? props.items : [];

    // An internal sentinel no valid user value can equal: `undefined`
    // stays free to mean "no selection" on the returned surface
    const EMPTY = useMemo(function () {
      return Symbol('empty');
    }, []);

    // Options are the identity: each must be a non-null option object with
    // a defined value, and values must be unique. Map identity is
    // SameValueZero, so the number 0 and the string '0' stay distinct
    // while NaN and object references still match themselves.
    const indexByValue = new Map();
    for (const item of items) {
      if (!Utils.isObject(item) || item.value === undefined) {
        throw new TypeError('useSelect: every item requires a defined value');
      }
      if (indexByValue.has(item.value)) {
        throw new TypeError('useSelect: duplicate item value');
      }
      indexByValue.set(item.value, indexByValue.size);
    }

    const disabled = props.disabled === true;
    const controlled = props.value !== undefined;
    const closeOnSelect = props.closeOnSelect !== false;

    // State boxes keep values wrapped so a function used as an opaque
    // option value is stored, never invoked as an initializer or updater
    const [openState, setOpenState] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [selectionBox, setSelectionBox] = useState({
      value: props.defaultValue === undefined ? EMPTY : props.defaultValue
    });
    const [highlightBox, setHighlightBox] = useState({ value: EMPTY });

    const labelId = useId();
    const listId = useId();
    // Option IDs are issued per VALUE through one map and counter, so an
    // option keeps its id across reorder, filter, removal and re-addition,
    // and the number 0 and string '0' can never collide the way the old
    // `key: item.value` did
    const optionBaseId = useId();
    const optionIds = useRef(new Map()).current;
    const optionCounter = useRef(0);
    const optionId = function (value) {
      let id = optionIds.get(value);
      if (id === undefined) {
        optionCounter.current = optionCounter.current + 1;
        id = optionBaseId + '-' + optionCounter.current;
        optionIds.set(value, id);
      }
      return id;
    };

    // The effective open answer: a disabled control is never open, even
    // when the caller holds open:true; re-enabling resumes whatever the
    // caller still requests
    const requestedOpen = props.open === undefined ? openState : props.open === true;
    const open = requestedOpen && disabled !== true;
    const storedValue = controlled ? props.value : selectionBox.value;
    // Removing the selected item leaves an unmatched value whose index is
    // -1; the value itself is retained, so restoring the item restores the
    // selection without a callback
    const selectedIndex = indexByValue.has(storedValue) ? indexByValue.get(storedValue) : -1;

    const highlightIndex = highlightBox.value === EMPTY ? -1 : indexByValue.get(highlightBox.value);
    const highlighted = highlightIndex >= 0 && items[highlightIndex].disabled !== true ? highlightIndex
      : open && selectedIndex >= 0 && items[selectedIndex].disabled !== true ? selectedIndex : -1;

    // Everything a stable action needs, latest: props, the current items,
    // the resolved selection and the open answer
    const liveRef = useRef(null);
    liveRef.current = {
      items: items,
      indexByValue: indexByValue,
      controlled: controlled,
      storedValue: storedValue,
      selectedIndex: selectedIndex,
      highlighted: highlighted,
      open: open,
      openProp: props.open,
      disabled: disabled,
      closeOnSelect: closeOnSelect,
      onSelect: props.onSelect,
      onChange: props.onChange,
      onOpenChange: props.onOpenChange
    };

    // Handlers retained past unmount do nothing
    const mountedRef = useRef(false);
    useEffect(function () {
      mountedRef.current = true;
      return function () {
        mountedRef.current = false;
      };
    }, []);

    const firstEnabled = firstEnabledItem;
    const lastEnabled = lastEnabledItem;

    // The one live boundary every interactive path answers to: mounted and
    // not currently disabled. Disabled and unmounted paths have no
    // callbacks, no state changes and no claimed defaults.
    const canInteract = useCallback(function () {
      return mountedRef.current === true && liveRef.current !== null && liveRef.current.disabled !== true;
    }, []);

    // Open and close report the next state through onOpenChange, whether the
    // caller holds `open` or the control keeps it; a request matching the
    // effective answer emits nothing, the internal fallback moves only for
    // an uncontrolled `open`, and closing clears the highlight so the next
    // open starts clean
    const setOpen = useCallback(function (next) {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const wanted = next === true;
      if (live.open === wanted) {
        return;
      }
      if (wanted === false) {
        live.highlighted = -1;
        setHighlightBox({ value: EMPTY });
      } else if (live.highlighted < 0 && live.selectedIndex >= 0 &&
          live.items[live.selectedIndex].disabled !== true) {
        // The derived open fallback: an open list carries the highlight on
        // the selected enabled option when no explicit highlight exists
        live.highlighted = live.selectedIndex;
      }
      if (live.openProp === undefined) {
        live.open = wanted;
        setOpenState(wanted);
      }
      if (typeof live.onOpenChange === 'function') {
        live.onOpenChange(wanted);
      }
    }, [canInteract]);

    // A controlled close skips setOpen, so the highlight reset also runs
    // when the open answer goes false for any reason
    useEffect(function () {
      if (open === false) {
        setHighlightBox(function (box) {
          return box.value === EMPTY ? box : { value: EMPTY };
        });
      }
    }, [open]);

    // Disabled suppresses interaction and clears the internal uncontrolled
    // open, highlight, focus and hover without callbacks, so re-enabling
    // does not reopen a menu the caller never asked for
    useEffect(function () {
      if (disabled === true) {
        setOpenState(false);
        setHighlightBox({ value: EMPTY });
        setFocused(false);
        setHovered(false);
      }
    }, [disabled]);

    // Opening lands the highlight on the selection; a keyboard open falls
    // to the first enabled option ('down') or the last ('up') while a
    // pointer open highlights nothing and the derived fallback shows the
    // selected enabled value
    const openList = useCallback(function (direction) {
      if (canInteract() !== true) {
        return;
      }
      setOpen(true);
      if (direction !== 'down' && direction !== 'up') {
        return;
      }
      const live = liveRef.current;
      const index = live.selectedIndex >= 0 && live.items[live.selectedIndex].disabled !== true
        ? live.selectedIndex
        : direction === 'down' ? firstEnabled(live.items) : lastEnabled(live.items);
      live.highlighted = index;
      setHighlightBox({ value: index >= 0 ? live.items[index].value : EMPTY });
    }, [canInteract, setOpen]);

    const highlightValue = useCallback(function (value) {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const index = live.indexByValue.get(value);
      if (index === undefined || live.items[index].disabled === true) {
        return;
      }
      live.highlighted = index;
      setHighlightBox({ value: value });
    }, [canInteract]);

    const highlightFirst = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const index = firstEnabled(live.items);
      live.highlighted = index;
      setHighlightBox({ value: index >= 0 ? live.items[index].value : EMPTY });
    }, [canInteract]);

    const highlightLast = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const index = lastEnabled(live.items);
      live.highlighted = index;
      setHighlightBox({ value: index >= 0 ? live.items[index].value : EMPTY });
    }, [canInteract]);

    // Choose a live enabled value: a removed, disabled or control-disabled
    // target does nothing, so a callback retained by an old row can never
    // select whatever now sits at its old index. onChange reports a real
    // value change only; reselecting the current option still closes.
    const selectValue = useCallback(function (value) {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const index = live.indexByValue.get(value);
      if (index === undefined || live.items[index].disabled === true) {
        return;
      }
      // SameValueZero: NaN is the one value not equal to itself
      const changed = !(live.storedValue === value || (Number.isNaN(live.storedValue) && Number.isNaN(value)));
      if (changed && !live.controlled) {
        // The uncontrolled store moves immediately, before the scheduled
        // state lands, so a same-batch action reads the new answer
        live.storedValue = value;
        live.selectedIndex = index;
        setSelectionBox({ value: value });
      }
      // The internal onSelect seam reports every accepted choice -
      // including a reselect - so a text owner can canonicalize its
      // draft; onChange still reports real value changes only
      if (typeof live.onSelect === 'function') {
        live.onSelect(value);
      }
      if (changed && typeof live.onChange === 'function') {
        live.onChange(value);
      }
      if (live.closeOnSelect) {
        setOpen(false);
      }
    }, [canInteract, setOpen]);

    // Empty the stored selection without opening or closing; a control
    // holding nothing reports nothing
    const clearSelection = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      if (live.storedValue === EMPTY) {
        return;
      }
      if (!live.controlled) {
        live.storedValue = EMPTY;
        live.selectedIndex = -1;
        setSelectionBox({ value: EMPTY });
      }
      if (typeof live.onChange === 'function') {
        live.onChange(undefined);
      }
    }, [canInteract, EMPTY]);

    // The composite-facing live open read: a caller's own render snapshot
    // can never see an eager same-act update, but this always can.
    // Unmounted (and disabled-suppressed) answers read false
    const getOpen = useCallback(function () {
      if (mountedRef.current !== true || liveRef.current === null) {
        return false;
      }
      return liveRef.current.open === true;
    }, []);

    // Commit the latest highlighted row as a choice: the one canonical
    // activation path for the base keys and composite handlers. Reports
    // whether a live enabled row actually accepted
    const commitHighlighted = useCallback(function () {
      if (canInteract() !== true) {
        return false;
      }
      const live = liveRef.current;
      if (live.highlighted < 0 || live.highlighted >= live.items.length) {
        return false;
      }
      const item = live.items[live.highlighted];
      if (!Utils.isObject(item) || item.disabled === true) {
        return false;
      }
      selectValue(item.value);
      return true;
    }, [canInteract, selectValue]);

    const move = useCallback(function (delta) {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const list = live.items;
      let next = live.highlighted;
      for (let steps = 0; steps < list.length; steps = steps + 1) {
        next = next + delta;
        if (next < 0) {
          next = list.length - 1;
        }
        if (next >= list.length) {
          next = 0;
        }
        if (list[next].disabled !== true) {
          live.highlighted = next;
          setHighlightBox({ value: list[next].value });
          return;
        }
      }
    }, [canInteract]);

    const onKeyDown = useCallback(function (event) {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const key = event && (event.key || (event.nativeEvent && event.nativeEvent.key));
      const prevent = function () {
        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
      };
      if (key === 'ArrowDown') {
        prevent();
        if (live.open) {
          move(1);
        } else {
          openList('down');
        }
        return;
      }
      if (key === 'ArrowUp') {
        prevent();
        if (live.open) {
          move(-1);
        } else {
          openList('up');
        }
        return;
      }
      if (key === 'Home' || key === 'End') {
        if (live.open) {
          prevent();
          if (key === 'Home') {
            highlightFirst();
          } else {
            highlightLast();
          }
        }
        return;
      }
      if (key === 'Escape') {
        if (live.open) {
          prevent();
          setOpen(false);
        }
        return;
      }
      if (key === 'Tab') {
        // Tab closes but never takes the default: focus must still leave
        if (live.open) {
          setOpen(false);
        }
        return;
      }
      if (key === 'Enter' || key === ' ') {
        prevent();
        if (!live.open) {
          openList('down');
        } else {
          commitHighlighted();
        }
      }
    }, [openList, move, highlightFirst, highlightLast, commitHighlighted, setOpen]);

    const state = useMemo(function () {
      return {
        open: open,
        focused: focused,
        hovered: hovered,
        disabled: disabled,
        selectedIndex: selectedIndex,
        highlightedIndex: highlighted
      };
    }, [open, focused, hovered, disabled, selectedIndex, highlighted]);

    return {
      rootProps: {},
      triggerProps: {
        accessibilityRole: 'combobox',
        // A labelless select names itself through its own label prop; an
        // absent label leaves no element for the relation to name
        'aria-labelledby': props.label ? labelId : undefined,
        'aria-expanded': open,
        'aria-controls': listId,
        // A live enabled option only, and only while open
        'aria-activedescendant': open && highlighted >= 0 ? optionId(items[highlighted].value) : undefined,
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled,
        onKeyDown: onKeyDown,
        onPress: disabled ? undefined : function () {
          if (canInteract() !== true) {
            return;
          }
          if (liveRef.current.open) {
            setOpen(false);

            return;
          }
          openList();
        },
        onPointerEnter: function () {
          if (canInteract() === true) {
            setHovered(true);
          }
        },
        onPointerLeave: function () {
          if (canInteract() === true) {
            setHovered(false);
          }
        },
        onFocus: function () {
          if (canInteract() === true) {
            setFocused(true);
          }
        },
        onBlur: function () {
          if (canInteract() === true) {
            setFocused(false);
          }
        }
      },
      // `role`, not `accessibilityRole`: the TalkBack enum backs the latter
      // and throws on ARIA names it lacks (option, listbox), which a Release
      // build never survives
      listProps: { nativeID: listId, role: 'listbox' },
      labelProps: { nativeID: labelId },
      // The open/close channel an overlay host's dismissal uses
      setOpen: setOpen,
      getOptionProps: function (index) {
        const item = items[index];
        if (!Utils.isObject(item)) {
          // An out-of-range index yields inert disabled props, never a
          // callback that could select an unrelated row
          return {
            role: 'option',
            'aria-selected': false,
            'aria-disabled': true,
            disabled: true
          };
        }
        // The value, not the ordinal, is captured: a later reorder cannot
        // retarget this row's handlers at another option
        const value = item.value;
        const id = optionId(value);
        const optionDisabled = disabled || item.disabled === true;
        return {
          role: 'option',
          'aria-selected': index === selectedIndex,
          'aria-disabled': optionDisabled ? true : undefined,
          disabled: optionDisabled ? true : undefined,
          nativeID: id,
          key: id,
          onPress: optionDisabled ? undefined : function () {
            selectValue(value);
          },
          onPointerEnter: optionDisabled ? undefined : function () {
            highlightValue(value);
          }
        };
      },
      items: items,
      value: storedValue === EMPTY ? undefined : storedValue,
      getOpen: getOpen,
      commitHighlighted: commitHighlighted,
      selectValue: selectValue,
      clearSelection: clearSelection,
      highlightValue: highlightValue,
      highlightFirst: highlightFirst,
      highlightLast: highlightLast,
      state: state
    };

  }

  useSelect.stateKeys = ['open', 'focused', 'hovered', 'disabled', 'selectedIndex', 'highlightedIndex'];


  return {
    useTextField: useTextField,
    useButton: useButton,
    useCheckbox: useCheckbox,
    useSelect: useSelect
  };

}
