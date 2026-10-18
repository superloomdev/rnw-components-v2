// Info: Radio group behavior: one selection shared by value-keyed members.
//
// The group holds the selection; every member is told its checked and
// focusable answers. Exactly one enabled member sits in the tab order -
// the selected member when enabled, else the first enabled member - so
// the group is one tab stop. Child focus records the active member
// without selecting it; a press, Space or Enter selects, and arrow keys
// on the root move selection and DOM focus together, skipping disabled
// members and wrapping at the ends. Members are addressed by value, not
// ordinal, so removing or reordering items keeps the selection and its
// refs; the generic roving behavior is not reused because it cannot skip
// disabled members.


/********************************************************************
Build the radio-group behavior for one component system.

@param {Object} deps                        - Injected dependencies
@param {Object} deps.React                  - The host's React
@param {Object} deps.Utils                  - helper-utils
@param {Object} deps.useControllableState   - state family hook

@return {Object} - { useRadioGroup }
*********************************************************************/
export default function createRadioGroupBehaviors (deps) {

  const React = deps.React;
  const Utils = deps.Utils;
  const useControllableState = deps.useControllableState;

  const { isArray, isFunction, isNumber, isString } = Utils;


  /********************************************************************
  A member value is a string or a finite number; zero is a value.

  @param {*} value - Candidate

  @return {Boolean}
  *********************************************************************/
  function isValidValue (value) {
    return isString(value) || (isNumber(value) && Number.isFinite(value));
  }


  /********************************************************************
  The index of the first enabled member at or after `start`, scanning
  `count` candidates in `direction` with wraparound; -1 when none is
  enabled.

  @param {Array}    items     - Group items
  @param {Number}   start     - Index to scan from (inclusive)
  @param {Number}   direction - 1 or -1

  @return {Number}
  *********************************************************************/
  function scanEnabled (items, start, direction) {
    const count = items.length;
    for (let step = 0; step < count; step = step + 1) {
      const index = (((start + direction * step) % count) + count) % count;
      if (items[index].disabled !== true) {
        return index;
      }
    }
    return -1;
  }


  /********************************************************************
  Value-keyed radio group state: selection, the roving tab stop and the
  keyboard contract.

  @param {Object}   options
  @param {Array}    [options.items]        - Members, each `{ value, disabled? }`
  @param {*}        [options.value]        - Controlled selection
  @param {*}        [options.defaultValue] - Initial uncontrolled selection
  @param {Function} [options.onChange]     - Called with the selected value
  @param {Boolean}  [options.disabled]     - Disables the whole group

  @return {Object} - { containerProps, getItemProps, state }
  *********************************************************************/
  function useRadioGroup (options) {

    const items = isArray(options.items) ? options.items : [];
    const disabled = options.disabled === true;

    // Member values are the identity: each must be present, valid and
    // unique before any state is read
    const values = new Set();
    for (const item of items) {
      const itemValue = item === null || item === undefined ? undefined : item.value;
      if (!isValidValue(itemValue)) {
        throw new TypeError('useRadioGroup: every item requires a string or finite-number value');
      }
      if (values.has(itemValue)) {
        throw new TypeError('useRadioGroup: duplicate item value ' + JSON.stringify(itemValue));
      }
      values.add(itemValue);
    }

    const [value, setValue] = useControllableState({
      value: options.value,
      defaultValue: options.defaultValue,
      onChange: options.onChange
    });

    // The member that last reported focus, stored by value so a reorder
    // cannot leave a stale ordinal; the DOM is the source of truth for
    // which member an arrow moves from
    const [activeValue, setActiveValue] = React.useState();

    // One stable ref object per member value; refs of removed members are
    // dropped so a deleted value can never receive focus
    const refs = React.useRef(new Map()).current;
    React.useEffect(function () {
      for (const refValue of Array.from(refs.keys())) {
        if (!values.has(refValue)) {
          refs.delete(refValue);
        }
      }
    });

    const selectedIndex = items.findIndex(function (item) {
      return item.value === value;
    });
    const activeIndex = items.findIndex(function (item) {
      return item.value === activeValue;
    });

    // The one tab stop: the selected member when enabled, else the first
    // enabled member; a disabled group has no tab stop at all
    let focusIndex = -1;
    if (!disabled) {
      const selectedEnabled = items.findIndex(function (item) {
        return item.value === value && item.disabled !== true;
      });
      focusIndex = selectedEnabled !== -1 ? selectedEnabled : items.findIndex(function (item) {
        return item.disabled !== true;
      });
    }

    // Everything a stable handler needs, latest
    const liveRef = React.useRef(null);
    liveRef.current = {
      disabled: disabled,
      items: items,
      value: value
    };

    // A genuine selection only, decided against the live members: a
    // missing or disabled member, a disabled group and the already-
    // selected value are no-ops; the controllable setter decides who
    // mutates
    const select = React.useCallback(function (next) {
      const live = liveRef.current;
      const member = live.items.find(function (item) {
        return item.value === next;
      });
      if (live.disabled || member === undefined || member.disabled === true || next === live.value) {
        return;
      }
      setValue(next);
    }, [setValue]);

    // Focus records the member only while it is an enabled member of an
    // enabled group; a retained callback on a removed or disabled member
    // activates nothing
    const activate = React.useCallback(function (memberValue) {
      const live = liveRef.current;
      const member = live.items.find(function (item) {
        return item.value === memberValue;
      });
      if (live.disabled || member === undefined || member.disabled === true) {
        return;
      }
      setActiveValue(memberValue);
    }, []);

    const getItemProps = function (index) {
      const item = items[index];
      const memberValue = item.value;
      let ref = refs.get(memberValue);
      if (ref === undefined) {
        ref = React.createRef();
        refs.set(memberValue, ref);
      }
      return {
        checked: memberValue === value,
        disabled: disabled || item.disabled === true,
        focusable: index === focusIndex,
        onChange: function (nextChecked) {
          if (nextChecked === true) {
            select(memberValue);
          }
        },
        onGroupFocus: function () {
          activate(memberValue);
        },
        rootRef: ref
      };
    };

    const onKeyDown = function (event) {
      if (disabled) {
        return;
      }
      const key = event === null || event === undefined ? undefined : event.key;
      // Arrows move from the member holding focus, falling back to the
      // selection; Home and End jump to the ends
      const from = activeIndex >= 0 ? activeIndex : selectedIndex;
      let target;
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        target = scanEnabled(items, from < 0 ? 0 : from + 1, 1);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        target = scanEnabled(items, from < 0 ? items.length - 1 : from - 1, -1);
      } else if (key === 'Home') {
        target = scanEnabled(items, 0, 1);
      } else if (key === 'End') {
        target = scanEnabled(items, items.length - 1, -1);
      } else {
        return;
      }
      if (target === -1) {
        return;
      }
      event.preventDefault();
      select(items[target].value);
      const ref = refs.get(items[target].value);
      if (ref !== undefined && ref.current !== null && isFunction(ref.current.focus)) {
        ref.current.focus();
      }
    };

    return {
      containerProps: {
        onKeyDown: onKeyDown
      },
      getItemProps: getItemProps,
      state: {
        value: value,
        selectedIndex: selectedIndex,
        activeIndex: activeIndex,
        disabled: disabled
      }
    };

  }

  useRadioGroup.stateKeys = ['value', 'selectedIndex', 'activeIndex', 'disabled'];


  return {
    useRadioGroup: useRadioGroup
  };

}
