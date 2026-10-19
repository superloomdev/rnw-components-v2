// Info: Editable single-choice control behavior (combobox).
//
// Composes the controls layer's useSelect: the base hook owns the
// value-keyed selection, the open answer, option ids and the disabled
// boundary over the FILTERED items; this hook owns only the raw draft
// text and its dirty flag. A committed selection shows its label and an
// unfiltered list; editing marks the draft dirty and filters by it.
//
// This layer owns state, keyboard, focus and accessibility props. It owns
// no appearance: no color, size, radius, border, font, token read or
// design system name appears anywhere in this package, and a test
// enforces that.
//
// New item contract for this hook: values are unique strings or finite
// numbers (null is reserved for the controlled-empty selection) and
// labels are strings. The base useSelect keeps its opaque-value promise.


/********************************************************************
Build the combobox behaviors for one component system.

@param {Object} deps           - Injected dependencies
@param {Object} deps.React     - The host's React
@param {Object} deps.Utils     - helper-utils
@param {Object} deps.useSelect - The controls layer's select behavior

@return {Object} - { useCombobox }
*********************************************************************/
export default function createComboboxBehaviors (deps) {

  const React = deps.React;
  const Utils = deps.Utils;
  const useSelect = deps.useSelect;
  const { useCallback, useEffect, useMemo, useRef, useState } = React;

  // Fallbacks keep identity stable so memos do not churn on bad props,
  // and the sentinel marks a ref that has not seen a commit
  const NO_ITEMS = [];
  const NOT_MOUNTED = {};

  /********************************************************************
  The curated filter policy: an empty query keeps every item, otherwise
  the item's label contains the query, case-insensitive.

  @param {Object} args - { item, inputValue }

  @return {Boolean}
  *********************************************************************/
  function defaultFilter (args) {

    const query = args.inputValue;
    if (Utils.isEmptyString(query)) {
      return true;
    }
    return args.item.label.toLowerCase().includes(query.toLowerCase());

  }

  // The displayed text under the latest live fields: the host's answer
  // when the text is controlled, the raw draft while editing, the
  // committed label otherwise
  function syncDisplayed (live) {
    live.displayed = live.inputControlled ? live.inputText : (live.dirty ? live.raw : live.storedLabel);
  }

  // onInputChange is a user text REQUEST: an edit, a selection or a
  // clear/cancel restoration - never an external-sync notification
  function requestInput (live, text) {
    if (typeof live.onInputChange === 'function') {
      live.onInputChange(text);
    }
  }

  // The index of the first enabled filtered row whose label matches the
  // text exactly, or -1
  function filteredIndexOfLabel (live, text) {
    for (let index = 0; index < live.filtered.length; index = index + 1) {
      const item = live.filtered[index];
      if (item.disabled !== true && item.label === text) {
        return index;
      }
    }
    return -1;
  }

  // The input's ref focus capability, duck-typed; a clear or caret press
  // returns focus to the input without any DOM or platform read
  function focusInput (inputRef) {
    const node = inputRef.current;
    if (node !== null && node !== undefined && typeof node.focus === 'function') {
      node.focus();
    }
  }

  /********************************************************************
  Combobox behavior: an editable text field owning a draft over one
  committed selection.

  `value` undefined means an uncontrolled selection, null a controlled
  empty one; `inputValue` supplied makes the text controlled - the
  caller's query, which always filters. `onChange` receives the selected
  value or null on clear; `onInputChange` is a user text REQUEST (edit,
  selection or clear/cancel restoration), never an external-sync echo.

  @param {Object} props - { items, value, defaultValue, onChange,
                          inputValue, defaultInputValue, onInputChange,
                          shouldFilterItem, open, onOpenChange, disabled,
                          invalid, label, clearLabel }

  @return {Object} - { rootProps, labelProps, listProps, inputProps,
                      toggleProps, clearProps, getOptionProps, setOpen,
                      dismiss, clearSelection, items, selectedItem,
                      value, inputRef, state }
  *********************************************************************/
  function useCombobox (props) {

    const items = Utils.isArray(props.items) ? props.items : NO_ITEMS;

    // This hook's item contract: every option is a non-null object whose
    // value is a unique string or finite number and whose label is a
    // string. The label and record maps cover the FULL list, so a
    // selection filtered out of the visible rows still resolves
    const labelByValue = new Map();
    const itemByValue = new Map();
    for (const item of items) {
      if (!Utils.isObject(item) ||
          (!Utils.isString(item.value) && !(Utils.isNumber(item.value) && Number.isFinite(item.value)))) {
        throw new TypeError('useCombobox: every item requires a string or finite-number value');
      }
      if (!Utils.isString(item.label)) {
        throw new TypeError('useCombobox: every item requires a string label');
      }
      if (labelByValue.has(item.value)) {
        throw new TypeError('useCombobox: duplicate item value');
      }
      labelByValue.set(item.value, item.label);
      itemByValue.set(item.value, item);
    }

    const disabled = props.disabled === true;
    const invalid = props.invalid === true && !disabled;
    // The text contract is strings: a provided inputValue, a seeded
    // defaultInputValue and every edit payload are strings, undefined
    // means absent
    const inputControlled = props.inputValue !== undefined;
    if (inputControlled && !Utils.isString(props.inputValue)) {
      throw new TypeError('useCombobox: inputValue must be a string');
    }
    if (props.defaultInputValue !== undefined && !Utils.isString(props.defaultInputValue)) {
      throw new TypeError('useCombobox: defaultInputValue must be a string');
    }
    const inputText = inputControlled ? props.inputValue : undefined;

    // The draft: the raw edit plus the dirty flag that says the user, not
    // the committed label, owns the text. A seeded defaultInputValue
    // arrives already dirty so it both shows and filters
    const [raw, setRaw] = useState(function () {
      return props.defaultInputValue === undefined ? '' : props.defaultInputValue;
    });
    const [dirty, setDirty] = useState(props.defaultInputValue !== undefined);

    // The filter query: the host's text when controlled, the raw draft
    // while editing, empty while a committed label shows
    const query = inputControlled ? inputText : (dirty ? raw : '');

    const predicate = typeof props.shouldFilterItem === 'function' ? props.shouldFilterItem : defaultFilter;
    const filtered = useMemo(function () {
      return items.filter(function (item) {
        return predicate({ item: item, inputValue: query }) === true;
      });
    }, [items, query, predicate]);

    // Everything an action needs, latest: the draft, the committed label,
    // the displayed text, the open answer and the current callbacks.
    // liveRef.current is rebuilt every render; eager writes during one
    // act compose the same way the base hook's do
    const liveRef = useRef(null);
    const mountedRef = useRef(false);
    const inputRef = useRef(null);

    // The base hook owns the selection, the open answer and traversal
    // over the filtered rows. Its internal onSelect seam reports every
    // accepted choice - including a reselect - so the draft can be
    // canonicalized even when the value cannot change; its onChange
    // reports real changes and the clear, translated here to the public
    // null
    const select = useSelect({
      items: filtered,
      value: props.value,
      defaultValue: props.defaultValue,
      open: props.open,
      onOpenChange: props.onOpenChange,
      disabled: props.disabled,
      label: props.label,
      onSelect: function (value) {
        const live = liveRef.current;
        if (live === null) {
          return;
        }
        // An accepted choice commits its label as the next text: applied
        // to the uncontrolled draft, requested of the host either way.
        // For uncontrolled the store already moved, so the committed
        // label is the chosen label; for controlled it stays the
        // caller's answer until the echo, and a refused request renders
        // that old label
        const before = live.displayed;
        const label = live.labelByValue.get(value);
        if (!live.inputControlled) {
          live.dirty = false;
          setDirty(false);
          live.raw = label;
          setRaw(label);
          if (!live.controlled) {
            live.storedLabel = label;
          }
          syncDisplayed(live);
        }
        if (!live.controlled) {
          live.storedValue = value;
        }
        if (label !== before) {
          requestInput(live, label);
        }
      },
      onChange: function (value) {
        const live = liveRef.current;
        if (live === null) {
          return;
        }
        // The value request only: the text request already went out in
        // onSelect, preserving text-before-value order, and a reselect
        // never reaches here so it can never fake a change
        if (typeof live.onChange === 'function') {
          live.onChange(value === undefined ? null : value);
        }
      }
    });

    const storedValue = select.value;
    const storedLabel = storedValue === undefined || !labelByValue.has(storedValue) ? '' : labelByValue.get(storedValue);
    const displayed = inputControlled ? inputText : (dirty ? raw : storedLabel);
    const open = select.state.open;
    const highlightedIndex = select.state.highlightedIndex;
    // The base hook's stable keydown handler, delegated to for the arrows
    const selectKeyDown = select.triggerProps.onKeyDown;

    liveRef.current = {
      controlled: props.value !== undefined,
      inputControlled: inputControlled,
      inputText: inputControlled ? inputText : '',
      raw: raw,
      dirty: dirty,
      storedValue: storedValue,
      storedLabel: storedLabel,
      displayed: displayed,
      labelByValue: labelByValue,
      filtered: filtered,
      open: open,
      highlightedIndex: highlightedIndex,
      onChange: props.onChange,
      onInputChange: props.onInputChange,
      disabled: disabled
    };

    useEffect(function () {
      mountedRef.current = true;
      return function () {
        mountedRef.current = false;
      };
    }, []);

    // The one live boundary every interactive path answers to: mounted
    // and not currently disabled
    const canInteract = useCallback(function () {
      return mountedRef.current === true && liveRef.current !== null && liveRef.current.disabled !== true;
    }, []);

    // The committed label restores on caret, dismiss, Escape and Tab:
    // the uncontrolled draft drops its edit; a controlled text keeps the
    // host's answer and only requests the restoration
    const restoreDraft = useCallback(function (live) {
      const before = live.displayed;
      if (!live.inputControlled && live.dirty) {
        live.dirty = false;
        setDirty(false);
        syncDisplayed(live);
      }
      if (live.storedLabel !== before) {
        requestInput(live, live.storedLabel);
      }
    }, []);

    // A prop-driven selection change resets the draft silently: nothing
    // fires for a mount, an external value or text echo, a rename, a
    // reorder or a changed default
    const lastValue = useRef(NOT_MOUNTED);
    useEffect(function () {
      const current = select.value;
      const changed = lastValue.current !== NOT_MOUNTED && current !== lastValue.current;
      lastValue.current = current;
      const live = liveRef.current;
      if (changed === true && !live.inputControlled && live.dirty) {
        live.dirty = false;
        setDirty(false);
        syncDisplayed(live);
      }
    });

    // Typing highlights the first enabled row of the NEW filter once it
    // has rendered, never a stale row of the pre-edit array. The
    // reconcile is keyed to the actual query: a fresh array identity or
    // a keyboard-only highlight move never resets it, a still-valid
    // value highlight survives a mere reorder, and a membership change
    // that dropped the active result while editing falls back to the
    // first enabled one
    const lastQuery = useRef(NOT_MOUNTED);
    useEffect(function () {
      const prev = lastQuery.current;
      lastQuery.current = query;
      if (open !== true) {
        return;
      }
      if (prev !== NOT_MOUNTED && prev !== query) {
        select.highlightFirst();
        return;
      }
      if ((liveRef.current.inputControlled === true || liveRef.current.dirty === true) &&
          highlightedIndex < 0 &&
          filtered.some(function (item) {
            return item.disabled !== true;
          })) {
        select.highlightFirst();
      }
    });

    // An edit writes the draft, requests the new text and opens the
    // list; a request matching the displayed text emits nothing
    const onChangeText = useCallback(function (text) {
      if (!Utils.isString(text)) {
        throw new TypeError('useCombobox: text edits must be strings');
      }
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const before = live.displayed;
      if (!live.inputControlled) {
        live.raw = text;
        setRaw(text);
        live.dirty = true;
        setDirty(true);
        syncDisplayed(live);
      }
      if (text !== before) {
        requestInput(live, text);
      }
      select.setOpen(true);
    }, [canInteract, select.setOpen]);

    // A pointer press in the input opens, never toggles closed
    const onInputPress = useCallback(function () {
      if (canInteract() === true) {
        select.setOpen(true);
      }
    }, [canInteract, select.setOpen]);

    // Dismiss: restore the committed label, then request the close. The
    // overlay host's dismissal lands here too
    const dismiss = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      restoreDraft(liveRef.current);
      select.setOpen(false);
    }, [canInteract, restoreDraft, select.setOpen]);

    // Clear empties the selection and the draft, requests the empty text
    // and null selection once each and only for real changes, closes the
    // menu and keeps the input focused. A numeric zero selection clears
    // like any other
    const clearSelection = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const before = live.displayed;
      if (!live.inputControlled) {
        live.dirty = false;
        setDirty(false);
        live.raw = '';
        setRaw('');
        if (!live.controlled) {
          live.storedLabel = '';
        }
        syncDisplayed(live);
      }
      if (!Utils.isEmptyString(before)) {
        requestInput(live, '');
      }
      // Only a real stored choice notifies a clear: the controlled-empty
      // null and an already-cleared answer have nothing to report. The
      // live store moves only for uncontrolled - a controlled answer the
      // owner refuses stays requestable on the next clear
      if (live.storedValue !== undefined && live.storedValue !== null) {
        select.clearSelection();
        if (!live.controlled) {
          live.storedValue = undefined;
        }
      }
      select.setOpen(false);
      focusInput(inputRef);
    }, [canInteract, select.clearSelection, select.setOpen]);

    // The caret toggles the list and returns focus to the input
    const onTogglePress = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      if (select.getOpen() === true) {
        dismiss();
      } else {
        select.setOpen(true);
      }
      focusInput(inputRef);
    }, [canInteract, dismiss, select.getOpen, select.setOpen]);

    // Keyboard on the input: arrows delegate to the base traversal over
    // the filtered rows, Enter commits the highlight or an exact enabled
    // label match and otherwise opens, Escape and Tab restore and close,
    // and Space, Home, End, ArrowLeft and ArrowRight stay native text
    // editing. A composing (IME) event is ignored entirely: no commit,
    // no claimed default
    const onKeyDown = useCallback(function (event) {
      if (event === null || event === undefined) {
        return;
      }
      const composing = event.isComposing === true ||
        (event.nativeEvent !== null && event.nativeEvent !== undefined && event.nativeEvent.isComposing === true);
      if (composing === true || canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const key = event.key || (event.nativeEvent && event.nativeEvent.key);
      const prevent = function () {
        if (typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
      };
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        // The base handler opens or moves over the filtered rows and
        // claims the default
        selectKeyDown(event);
        return;
      }
      if (key === 'Enter') {
        prevent();
        // An open list commits its LIVE highlight - including one set by
        // an ArrowDown earlier in this act that no render snapshot saw
        if (select.getOpen() === true && select.commitHighlighted() === true) {
          return;
        }
        const match = filteredIndexOfLabel(live, live.displayed);
        if (match >= 0) {
          select.selectValue(live.filtered[match].value);
          return;
        }
        // Never accept arbitrary text: open the filtered list
        select.setOpen(true);
        return;
      }
      if (key === 'Escape') {
        // Restore the committed label and close; the default is claimed
        // only while there is something to cancel: an open list, a dirty
        // draft, or a host-provided text that is not the stored label
        if (select.getOpen() === true || live.dirty === true || live.displayed !== live.storedLabel) {
          prevent();
          dismiss();
        }
        return;
      }
      if (key === 'Tab') {
        // Restore and close, but never claim the default: focus still
        // leaves the input
        if (select.getOpen() === true || live.dirty === true || live.displayed !== live.storedLabel) {
          dismiss();
        }
        return;
      }
    }, [canInteract, dismiss, select.getOpen, select.commitHighlighted, select.selectValue,
      select.setOpen, selectKeyDown]);

    // Focus only tracks; blur never unmounts the menu, so an option
    // press can still finish
    const state = useMemo(function () {
      return {
        open: open,
        focused: select.state.focused,
        hovered: select.state.hovered,
        disabled: disabled,
        selectedIndex: select.state.selectedIndex,
        highlightedIndex: highlightedIndex,
        inputValue: displayed,
        query: query,
        populated: Utils.isString(displayed) && !Utils.isEmptyString(displayed),
        invalid: invalid
      };
    }, [open, select.state.focused, select.state.hovered, disabled, select.state.selectedIndex,
      highlightedIndex, displayed, query, invalid]);

    return {
      rootProps: select.rootProps,
      labelProps: select.labelProps,
      listProps: select.listProps,
      // The input is the combobox: it reuses the base hook's label, list
      // and active-descendant wiring on the editable element
      inputProps: {
        ref: inputRef,
        accessibilityRole: 'combobox',
        'aria-autocomplete': 'list',
        'aria-labelledby': select.triggerProps['aria-labelledby'],
        'aria-expanded': open,
        'aria-controls': select.triggerProps['aria-controls'],
        'aria-activedescendant': select.triggerProps['aria-activedescendant'],
        'aria-disabled': disabled ? true : undefined,
        'aria-invalid': invalid ? true : undefined,
        editable: !disabled,
        disabled: disabled,
        value: displayed,
        onChangeText: onChangeText,
        onKeyDown: onKeyDown,
        onPress: onInputPress,
        onFocus: select.triggerProps.onFocus,
        onBlur: select.triggerProps.onBlur,
        onPointerEnter: select.triggerProps.onPointerEnter,
        onPointerLeave: select.triggerProps.onPointerLeave
      },
      // The caret is not a tab stop; the input is
      toggleProps: {
        accessibilityRole: 'button',
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled,
        tabIndex: -1,
        onPress: onTogglePress
      },
      // Rendered only when the component chooses; visibility is not
      // policy this hook owns
      clearProps: {
        accessibilityRole: 'button',
        accessibilityLabel: Utils.isString(props.clearLabel) && !Utils.isEmptyString(props.clearLabel)
          ? props.clearLabel : 'Clear selection',
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled,
        onPress: clearSelection
      },
      getOptionProps: select.getOptionProps,
      setOpen: select.setOpen,
      dismiss: dismiss,
      clearSelection: clearSelection,
      items: filtered,
      selectedItem: storedValue === undefined || !itemByValue.has(storedValue) ? null : itemByValue.get(storedValue),
      value: storedValue === undefined ? null : storedValue,
      inputRef: inputRef,
      state: state
    };

  }

  useCombobox.stateKeys = ['open', 'focused', 'hovered', 'disabled', 'selectedIndex', 'highlightedIndex',
    'inputValue', 'query', 'populated', 'invalid'];

  return {
    useCombobox: useCombobox
  };

}
