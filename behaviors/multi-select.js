// Info: Multiple-choice listbox behavior (multiselect).
//
// Composes the controls layer's useSelect for navigation, open and focus
// only: the base hook sees an internal navigation selection (the first
// selected enabled row, or null), closeOnSelect:false, and its accepted-
// choice onSelect seam toggles membership - so reselecting an already
// chosen row unchecks it where the single-select onChange suppression
// would not. The selected ARRAY is owned once by useControllableState;
// this hook owns the optional filterable query text.
//
// Rows display selected-first by the snapshot taken when the open
// session committed: toggling a row while open never moves it, a
// close/reopen re-partitions, and a host reorder still applies to the
// current catalog with the highlight following the value.
//
// This layer owns state, keyboard, focus and accessibility props. It owns
// no appearance: no color, size, radius, border, font, token read or
// design system name appears anywhere in this package, and a test
// enforces that.
//
// Item contract: values are unique strings or finite numbers, labels are
// strings, and selected arrays hold unique scalar values that are never
// mutated. Unknown selected values survive catalog removal and still
// count until explicitly cleared.


/********************************************************************
Build the multiselect behaviors for one component system.

@param {Object} deps                        - Injected dependencies
@param {Object} deps.React                  - The host's React
@param {Object} deps.Utils                  - helper-utils
@param {Object} deps.useSelect              - The controls layer's select behavior
@param {Object} deps.useControllableState   - The state family's resolver

@return {Object} - { useMultiSelect }
*********************************************************************/
export default function createMultiSelectBehaviors (deps) {

  const React = deps.React;
  const Utils = deps.Utils;
  const useSelect = deps.useSelect;
  const useControllableState = deps.useControllableState;
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

  /********************************************************************
  Validate a selected-values array: unique strings or finite numbers,
  never a repeated value and never a non-array shape.

  @param {String} name   - The prop name for the error
  @param {*}      values - The value under test
  *********************************************************************/
  function checkSelectedArray (name, values) {

    if (!Utils.isArray(values)) {
      throw new TypeError('useMultiSelect: ' + name + ' must be an array');
    }
    const seen = new Set();
    for (const value of values) {
      if (!Utils.isString(value) && !(Utils.isNumber(value) && Number.isFinite(value))) {
        throw new TypeError('useMultiSelect: ' + name + ' values must be strings or finite numbers');
      }
      if (seen.has(value)) {
        throw new TypeError('useMultiSelect: ' + name + ' contains a duplicate value');
      }
      seen.add(value);
    }

  }

  // onInputChange is a user text REQUEST: an edit or a clear/cancel -
  // never an external-sync notification
  function requestInput (live, text) {
    if (typeof live.onInputChange === 'function') {
      live.onInputChange(text);
    }
  }

  // The focus target's ref capability, duck-typed; a clear or caret press
  // returns focus to the input or trigger without any DOM or platform read
  function focusInput (inputRef) {
    const node = inputRef.current;
    if (node !== null && node !== undefined && typeof node.focus === 'function') {
      node.focus();
    }
  }


  /********************************************************************
  Multiselect behavior: a many-valued listbox, optionally filterable
  through an inline text field.

  `value` undefined means an uncontrolled selection, a provided array a
  controlled one ([] is the controlled empty); `onChange` receives the
  next fresh array. `inputValue` supplied makes the query text controlled;
  `onInputChange` is a user text REQUEST, never an external-sync echo.
  `filterable` is an internal option: without it the trigger alone drives
  the list and there is no text or query at all.

  @param {Object} props - { items, value, defaultValue, onChange,
                          open, onOpenChange, disabled, invalid, label,
                          filterable, inputValue, defaultInputValue,
                          onInputChange, shouldFilterItem, clearLabel,
                          selectionCountLabel, clearAnnouncement }

  @return {Object} - { rootProps, triggerProps, inputProps, toggleProps,
                      clearProps, listProps, labelProps, getOptionProps,
                      setOpen, toggleValue, clearSelection, setInputValue,
                      inputRef, selectedValues, items, state }
  *********************************************************************/
  function useMultiSelect (props) {

    const items = Utils.isArray(props.items) ? props.items : NO_ITEMS;

    // This hook's item contract: every option is a non-null object whose
    // value is a unique string or finite number and whose label is a
    // string
    const itemByValue = new Map();
    for (const item of items) {
      if (!Utils.isObject(item) ||
          (!Utils.isString(item.value) && !(Utils.isNumber(item.value) && Number.isFinite(item.value)))) {
        throw new TypeError('useMultiSelect: every item requires a string or finite-number value');
      }
      if (!Utils.isString(item.label)) {
        throw new TypeError('useMultiSelect: every item requires a string label');
      }
      if (itemByValue.has(item.value)) {
        throw new TypeError('useMultiSelect: duplicate item value');
      }
      itemByValue.set(item.value, item);
    }

    // The selected array contract: a provided `value` controls, empty is
    // []; `defaultValue` seeds once. Values may be absent from the
    // catalog - a removed or filtered-out selection still counts until
    // explicitly cleared
    const controlled = props.value !== undefined;
    if (controlled) {
      checkSelectedArray('value', props.value);
    }
    if (props.defaultValue !== undefined) {
      checkSelectedArray('defaultValue', props.defaultValue);
    }

    const disabled = props.disabled === true;
    const invalid = props.invalid === true && !disabled;
    const filterable = props.filterable === true;

    // The query text contract is strings, undefined absent; a
    // nonfilterable control has no text at all and never filters
    const inputControlled = props.inputValue !== undefined;
    if (inputControlled && !Utils.isString(props.inputValue)) {
      throw new TypeError('useMultiSelect: inputValue must be a string');
    }
    if (props.defaultInputValue !== undefined && !Utils.isString(props.defaultInputValue)) {
      throw new TypeError('useMultiSelect: defaultInputValue must be a string');
    }
    const [raw, setRaw] = useState(function () {
      return props.defaultInputValue === undefined ? '' : props.defaultInputValue;
    });
    const text = filterable ? (inputControlled ? props.inputValue : raw) : '';
    const query = filterable ? text : '';

    // The selected array: useControllableState owns it once. The setter
    // eagerly resolves uncontrolled updates before scheduling and always
    // reports the next array through onChange; controlled waits for the
    // echo
    const [selectedValues, setSelected] = useControllableState({
      value: props.value,
      defaultValue: props.defaultValue === undefined ? NO_ITEMS : props.defaultValue,
      onChange: props.onChange
    });
    const selectedSet = useMemo(function () {
      return new Set(selectedValues);
    }, [selectedValues]);

    const predicate = typeof props.shouldFilterItem === 'function' ? props.shouldFilterItem : defaultFilter;
    const filtered = useMemo(function () {
      if (filterable !== true) {
        return items;
      }
      return items.filter(function (item) {
        return predicate({ item: item, inputValue: query }) === true;
      });
    }, [items, filterable, query, predicate]);

    // The open-session ordering: while the last COMMITTED open answer is
    // true, rows partition by the snapshot latched when that session
    // opened; otherwise by the live selection. A committed close returns
    // ordering to the live values, so the next open re-partitions
    const sessionRef = useRef(null);
    const session = sessionRef.current;
    const ordering = session !== null && session.open === true ? session.values : selectedValues;
    const orderingSet = new Set(ordering);
    const rows = [];
    const rest = [];
    for (const item of filtered) {
      if (orderingSet.has(item.value)) {
        rows.push(item);
      } else {
        rest.push(item);
      }
    }
    const displayed = rows.concat(rest);

    // The base hook's navigation selection: the first selected enabled
    // displayed row, or null. It is internal only - real membership
    // lives in the array
    let navValue = null;
    for (const item of displayed) {
      if (item.disabled !== true && selectedSet.has(item.value)) {
        navValue = item.value;
        break;
      }
    }

    const liveRef = useRef(null);
    const mountedRef = useRef(false);
    const inputRef = useRef(null);
    // Measured list geometry, all keyed by option VALUE so a reorder
    // never scrolls a different row: the viewport extent, the current
    // offset, and each row's top/bottom as its own onLayout reports it
    const scrollRef = useRef(null);
    const viewportRef = useRef(0);
    const offsetRef = useRef(0);
    const rowRef = useRef(new Map());

    // The one live boundary every interactive path answers to: mounted
    // and not currently disabled
    const canInteract = useCallback(function () {
      return mountedRef.current === true && liveRef.current !== null && liveRef.current.disabled !== true;
    }, []);

    // Toggle one catalog value: a removed or item-disabled target is not
    // an accepted choice and cannot mutate the selection. The next array
    // is fresh and insertion ordered - removal preserves the order of
    // the rest. The uncontrolled live mirror moves before notifying so
    // same-act toggles compose; a controlled selection never moves
    // without the echo
    const toggleValue = useCallback(function (value) {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      const item = live.itemByValue.get(value);
      if (item === undefined || item.disabled === true) {
        return;
      }
      const next = live.selected.slice();
      const at = next.indexOf(value);
      if (at >= 0) {
        next.splice(at, 1);
      } else {
        next.push(value);
      }
      if (!live.controlled) {
        live.selected = next;
      }
      setSelected(next);
    }, [canInteract, setSelected]);

    // Navigation, open, focus and traversal only: the internal selection
    // is navigation, closeOnSelect keeps the list open, and every
    // accepted choice - reselect included - toggles through onSelect,
    // then returns focus to the input or trigger the ref already names so
    // a pointer option doesn't strand focus on its row; the imperative
    // toggle itself never steals focus and an inert press focuses nothing
    const select = useSelect({
      items: displayed,
      value: navValue,
      closeOnSelect: false,
      onSelect: function (value) {
        toggleValue(value);
        if (canInteract() === true) {
          focusInput(inputRef);
        }
      },
      open: props.open,
      onOpenChange: props.onOpenChange,
      disabled: props.disabled,
      label: props.label
    });

    const open = select.state.open;
    const highlightedIndex = select.state.highlightedIndex;
    // The base trigger's stable keydown delegates arrows, ends and
    // activation; activation toggles through onSelect and stays open
    const selectKeyDown = select.triggerProps.onKeyDown;

    liveRef.current = {
      controlled: controlled,
      inputControlled: inputControlled,
      filterable: filterable,
      disabled: disabled,
      itemByValue: itemByValue,
      selected: selectedValues,
      selectedSet: selectedSet,
      rows: displayed,
      text: text,
      query: query,
      open: open,
      highlightedIndex: highlightedIndex,
      onInputChange: props.onInputChange
    };

    useEffect(function () {
      mountedRef.current = true;
      return function () {
        mountedRef.current = false;
      };
    }, []);

    // Record the committed open answer; a false->true edge latches the
    // selection snapshot the next open session orders by. The opening
    // render already partitioned by the live values, so latching the
    // same values here cannot produce a wrong frame, and a same-act
    // close/reopen without a committed close stays one visible session
    useEffect(function () {
      const record = sessionRef.current;
      if (record === null) {
        sessionRef.current = { open: open === true, values: selectedValues.slice() };
        return;
      }
      if (record.open !== true && open === true) {
        record.values = selectedValues.slice();
      }
      record.open = open === true;
    });

    // Typing highlights the first enabled row of the NEW filter once it
    // has rendered, never a stale row of the pre-edit array; a still-
    // valid value highlight survives a reorder, and a lost highlight
    // while editing a nonempty query falls back to the first enabled
    // displayed row. A plain opening with an empty query keeps the base
    // answer - no invented highlight - so the open list may carry an
    // empty active descendant; the press-only owner's trigger press
    // highlights first explicitly
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
      if (Utils.isEmptyString(query) !== true &&
          highlightedIndex < 0 &&
          displayed.some(function (item) {
            return item.disabled !== true;
          })) {
        select.highlightFirst();
      }
    });

    // Announce the ACTUAL committed count change, never a fabricated
    // controlled request before its echo: initial is empty, a changed
    // count reads the caller's formatter (or the default) and zero reads
    // clearAnnouncement. This effect fires no onChange
    const [announcement, setAnnouncement] = useState('');
    const lastCount = useRef(NOT_MOUNTED);
    useEffect(function () {
      const count = selectedValues.length;
      const prev = lastCount.current;
      lastCount.current = count;
      if (prev === NOT_MOUNTED || prev === count) {
        return;
      }
      const message = count === 0
        ? (Utils.isString(props.clearAnnouncement) ? props.clearAnnouncement : 'All items cleared')
        : (typeof props.selectionCountLabel === 'function'
          ? props.selectionCountLabel(count)
          : count + ' selected');
      if (!Utils.isString(message)) {
        throw new TypeError('useMultiSelect: selectionCountLabel and clearAnnouncement must produce a string');
      }
      setAnnouncement(message);
    });

    // A user text request: applies to the uncontrolled draft, requests
    // the host's echo either way, and opens the list. A request matching
    // the displayed text emits nothing; a nonfilterable control has no
    // text to edit
    const setInputValue = useCallback(function (next) {
      if (!Utils.isString(next)) {
        throw new TypeError('useMultiSelect: text edits must be strings');
      }
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      if (live.filterable !== true) {
        return;
      }
      const before = live.text;
      if (!live.inputControlled) {
        live.raw = next;
        setRaw(next);
        live.text = next;
        live.query = next;
      }
      if (next !== before) {
        requestInput(live, next);
      }
      select.setOpen(true);
    }, [canInteract, select.setOpen]);

    // A pointer press in the input opens, never toggles closed
    const onInputPress = useCallback(function () {
      if (canInteract() === true) {
        select.setOpen(true);
      }
    }, [canInteract, select.setOpen]);

    // The count-tag clear: empties the values and the query, closes and
    // keeps the focus target's focus. The empty-array request fires only
    // while the stored array is nonempty, so a controlled refusal stays
    // requestable and an already-empty clear reports nothing
    const clearSelection = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      const live = liveRef.current;
      if (live.filterable === true) {
        const before = live.text;
        if (!live.inputControlled) {
          live.raw = '';
          setRaw('');
          live.text = '';
          live.query = '';
        }
        if (!Utils.isEmptyString(before)) {
          requestInput(live, '');
        }
      }
      if (!Utils.isEmptyArray(live.selected)) {
        const next = [];
        if (!live.controlled) {
          live.selected = next;
        }
        setSelected(next);
      }
      select.setOpen(false);
      focusInput(inputRef);
    }, [canInteract, select.setOpen, setSelected]);

    // The caret toggles the list and returns focus to the input/trigger
    const onTogglePress = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      select.setOpen(select.getOpen() !== true);
      focusInput(inputRef);
    }, [canInteract, select.getOpen, select.setOpen]);

    // The nonfilterable trigger's pointer press only toggles the list: a
    // plain pointer open invents no highlight, the base open answer still
    // supplies the selected-value fallback when one exists, and keyboard
    // traversal keeps its own highlight answers
    const onTriggerPress = useCallback(function () {
      if (canInteract() !== true) {
        return;
      }
      select.setOpen(select.getOpen() !== true);
    }, [canInteract, select.getOpen, select.setOpen]);

    // The nonfilterable trigger's keyboard: Delete/Backspace on a CLOSED
    // trigger clears the stored values; everything else delegates to the
    // base traversal and activation, whose Enter/Space toggle through
    // onSelect without closing, Escape only closes and Tab closes
    // without claiming the default
    const onTriggerKeyDown = useCallback(function (event) {
      if (event === null || event === undefined || canInteract() !== true) {
        return;
      }
      const key = event.key || (event.nativeEvent && event.nativeEvent.key);
      if (key === 'Backspace' || key === 'Delete') {
        const live = liveRef.current;
        if (select.getOpen() !== true && !Utils.isEmptyArray(live.selected)) {
          if (typeof event.preventDefault === 'function') {
            event.preventDefault();
          }
          clearSelection();
        }
        return;
      }
      selectKeyDown(event);
    }, [canInteract, select.getOpen, selectKeyDown, clearSelection]);

    // The filterable input's keyboard: arrows and Enter delegate to the
    // base navigation/activation, Escape closes and clears the query
    // while preserving values, Tab closes without claiming, a closed
    // empty-query Backspace/Delete clears the values, and Space, Home,
    // End, ArrowLeft and ArrowRight stay native text editing. A
    // composing (IME) event is ignored entirely: no commit, no claimed
    // default
    const onInputKeyDown = useCallback(function (event) {
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
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter') {
        selectKeyDown(event);
        return;
      }
      if (key === 'Escape') {
        // Close and clear the query, keeping the values; the default is
        // claimed only while there is something to cancel
        if (select.getOpen() === true || !Utils.isEmptyString(live.query)) {
          prevent();
          const before = live.text;
          if (!live.inputControlled) {
            live.raw = '';
            setRaw('');
            live.text = '';
            live.query = '';
          }
          if (!Utils.isEmptyString(before)) {
            requestInput(live, '');
          }
          select.setOpen(false);
        }
        return;
      }
      if (key === 'Tab') {
        // Close, but never claim the default: focus still leaves
        if (select.getOpen() === true) {
          select.setOpen(false);
        }
        return;
      }
      if (key === 'Backspace' || key === 'Delete') {
        // Only a closed control with an empty query clears: while typing
        // the key edits the text and never touches the selection
        if (select.getOpen() !== true && Utils.isEmptyString(live.query) && !Utils.isEmptyArray(live.selected)) {
          prevent();
          clearSelection();
        }
        return;
      }
    }, [canInteract, select.getOpen, selectKeyDown, select.setOpen, clearSelection]);

    // Scroll one row into the measured viewport: only while interactive
    // and open, and only when the row actually falls outside
    // [offset, offset + viewport]. A row taller than the viewport aligns
    // its top once instead of alternating top and bottom targets
    const scrollRowIntoView = useCallback(function (value) {
      if (canInteract() !== true || select.getOpen() !== true) {
        return;
      }
      const node = scrollRef.current;
      const row = rowRef.current.get(value);
      const viewport = viewportRef.current;
      const offset = offsetRef.current;
      if (node === null || node === undefined || typeof node.scrollTo !== 'function' ||
          row === undefined || viewport <= 0 ||
          !Number.isFinite(row.top) || !Number.isFinite(row.bottom)) {
        return;
      }
      let target;
      if (row.bottom - row.top > viewport) {
        if (row.top === offset) {
          return;
        }
        target = row.top;
      } else if (row.top < offset) {
        target = row.top;
      } else if (row.bottom > offset + viewport) {
        target = row.bottom - viewport;
      } else {
        return;
      }
      if (!Number.isFinite(target)) {
        return;
      }
      // Track the request BEFORE the call: a synchronous scroll event can
      // report the actual clamped offset, which must not be overwritten
      // by the stale requested target afterward
      offsetRef.current = target;
      node.scrollTo({ y: target, animated: false });
    }, [canInteract, select.getOpen]);

    // The ScrollView's measured extent and offset; invalid, nonfinite or
    // negative reports are ignored
    const onScrollLayout = useCallback(function (event) {
      const layout = event !== null && event !== undefined &&
        event.nativeEvent !== null && event.nativeEvent !== undefined ? event.nativeEvent.layout : undefined;
      const height = layout === null || layout === undefined ? undefined : layout.height;
      if (!Utils.isNumber(height) || !Number.isFinite(height) || height < 0) {
        return;
      }
      viewportRef.current = height;
      // A late-arriving or resized viewport reconciles the current active
      // row itself: the active value did not change, so no effect reruns.
      // scrollRowIntoView still gates on interactive and open
      const live = liveRef.current;
      if (live !== null && live.highlightedIndex >= 0 &&
          Utils.isObject(live.rows[live.highlightedIndex])) {
        scrollRowIntoView(live.rows[live.highlightedIndex].value);
      }
    }, [scrollRowIntoView]);

    const onScrollTrack = useCallback(function (event) {
      const content = event !== null && event !== undefined &&
        event.nativeEvent !== null && event.nativeEvent !== undefined ? event.nativeEvent.contentOffset : undefined;
      const y = content === null || content === undefined ? undefined : content.y;
      if (Utils.isNumber(y) && Number.isFinite(y) && y >= 0) {
        offsetRef.current = y;
      }
    }, []);

    // The open active highlight scrolls into view when it CHANGES; a row
    // whose layout has not been measured yet reconciles when its own
    // onLayout lands
    const lastActive = useRef(NOT_MOUNTED);
    useEffect(function () {
      const active = open === true && highlightedIndex >= 0 && Utils.isObject(displayed[highlightedIndex])
        ? displayed[highlightedIndex].value : NOT_MOUNTED;
      if (active === lastActive.current) {
        return;
      }
      lastActive.current = active;
      if (active !== NOT_MOUNTED) {
        scrollRowIntoView(active);
      }
    });

    // The membership truth lives in the selected set, not the navigation
    // index; the base row's key, id, disabled state and stale-callback
    // guards carry over unchanged. Each row's onLayout records its own
    // measured top/bottom by value - a removed value's late callback
    // writes nothing - and reconciles the scroll when it is the active
    // row
    const getOptionProps = function (index) {
      const option = select.getOptionProps(index);
      const item = displayed[index];
      const chosen = Utils.isObject(item) && selectedSet.has(item.value);
      const overridden = Object.assign({}, option);
      overridden['aria-selected'] = chosen === true;
      overridden['aria-checked'] = chosen === true;
      if (Utils.isObject(item)) {
        const value = item.value;
        overridden.onLayout = function (event) {
          const layout = event !== null && event !== undefined &&
            event.nativeEvent !== null && event.nativeEvent !== undefined ? event.nativeEvent.layout : undefined;
          if (layout === null || layout === undefined) {
            return;
          }
          const top = layout.y;
          const height = layout.height;
          if (!Utils.isNumber(top) || !Number.isFinite(top) || top < 0 ||
              !Utils.isNumber(height) || !Number.isFinite(height) || height < 0) {
            return;
          }
          const live = liveRef.current;
          if (live === null || !live.itemByValue.has(value)) {
            return;
          }
          rowRef.current.set(value, { top: top, bottom: top + height });
          if (select.getOpen() === true && live.highlightedIndex >= 0 &&
              Utils.isObject(live.rows[live.highlightedIndex]) &&
              live.rows[live.highlightedIndex].value === value) {
            scrollRowIntoView(value);
          }
        };
      }
      return overridden;
    };

    const state = useMemo(function () {
      return {
        open: open,
        focused: select.state.focused,
        hovered: select.state.hovered,
        disabled: disabled,
        highlightedIndex: highlightedIndex,
        selectedCount: selectedValues.length,
        inputValue: text,
        query: query,
        invalid: invalid,
        populated: !Utils.isEmptyArray(selectedValues) || !Utils.isEmptyString(text),
        announcement: announcement
      };
    }, [open, select.state.focused, select.state.hovered, disabled, highlightedIndex,
      selectedValues, text, query, invalid, announcement]);

    return {
      rootProps: select.rootProps,
      // The nonfilterable trigger delegates everything but the toggle
      // press and the closed-control Delete/Backspace clear
      triggerProps: Object.assign({}, select.triggerProps, {
        ref: inputRef,
        onPress: onTriggerPress,
        onKeyDown: onTriggerKeyDown
      }),
      // The filterable input is the combobox: it reuses the base label,
      // list and active-descendant wiring on the editable element
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
        value: text,
        onChangeText: setInputValue,
        onKeyDown: onInputKeyDown,
        onPress: onInputPress,
        onFocus: select.triggerProps.onFocus,
        onBlur: select.triggerProps.onBlur,
        onPointerEnter: select.triggerProps.onPointerEnter,
        onPointerLeave: select.triggerProps.onPointerLeave
      },
      // The caret is not a tab stop; the input/trigger is
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
      listProps: Object.assign({}, select.listProps, {
        'aria-multiselectable': true
      }),
      // The real scroll capability: the renderer mounts an injected
      // ScrollView and reports viewport, offset and per-row geometry
      scrollProps: {
        ref: scrollRef,
        onLayout: onScrollLayout,
        onScroll: onScrollTrack
      },
      labelProps: select.labelProps,
      getOptionProps: getOptionProps,
      setOpen: select.setOpen,
      toggleValue: toggleValue,
      clearSelection: clearSelection,
      setInputValue: setInputValue,
      inputRef: inputRef,
      selectedValues: selectedValues,
      items: displayed,
      state: state
    };

  }

  useMultiSelect.stateKeys = ['open', 'focused', 'hovered', 'disabled', 'highlightedIndex',
    'selectedCount', 'inputValue', 'query', 'invalid', 'populated', 'announcement'];

  return {
    useMultiSelect: useMultiSelect
  };

}
