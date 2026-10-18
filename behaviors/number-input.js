// Info: Bounded numeric text-field behavior.
//
// A number field keeps the user's editing text verbatim while a companion
// callback reports a parsed number only when the parse is finite, or the
// empty string when the field may be empty. Steppers and the arrow keys
// step from a finite parse or the step start, stay inside [min, max], and
// never emit callbacks for a clamped no-op.


/********************************************************************
Build the numeric field behavior for one component system.

@param {Object} deps                        - Injected dependencies
@param {Object} deps.Utils                  - helper-utils
@param {Object} deps.React                  - The host's React
@param {Object} deps.useControllableState   - state family hook
@param {Object} deps.useButton              - controls family hook

@return {Object} - { useNumberInput }
*********************************************************************/
export default function createNumberInputBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;
  const useControllableState = deps.useControllableState;
  const useButton = deps.useButton;

  const { isEmptyString, isNullOrUndefined, isNumber, isString } = Utils;
  const { useCallback } = React;


  /********************************************************************
  A finite JS number only; NaN and infinities are not bounds or steps.

  @param {*} value - Candidate

  @return {Boolean}
  *********************************************************************/
  function isFiniteNumber (value) {
    return isNumber(value) && Number.isFinite(value);
  }


  /********************************************************************
  Serialize a numeric prop to editing text; absent stays absent.

  @param {*} value - Prop value

  @return {String|undefined}
  *********************************************************************/
  function asText (value) {
    return isNullOrUndefined(value) ? undefined : String(value);
  }


  /********************************************************************
  Parse whole editing text to a finite number; a partial token, a lone
  sign or an exponent with no digits is not a number at all.

  @param {*} text - Editing text

  @return {Number|undefined}
  *********************************************************************/
  function parseText (text) {
    const trimmed = String(text).trim();
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) {
      return undefined;
    }
    const value = Number(trimmed);
    return Number.isFinite(value) ? value : undefined;
  }


  /********************************************************************
  Decimal places in a number's shortest JS serialization, including
  scientific notation.

  @param {Number} value - Finite number

  @return {Number}
  *********************************************************************/
  function decimalsOf (value) {
    const text = String(value);
    const exponent = /[eE][+-]?\d+$/.exec(text);
    const mantissa = exponent === null ? text : text.slice(0, exponent.index);
    const point = mantissa.indexOf('.');
    const digits = point === -1 ? 0 : mantissa.length - point - 1;
    const shift = exponent === null ? 0 : parseInt(text.slice(exponent.index + 1), 10);
    return Math.max(0, digits - shift);
  }


  /********************************************************************
  Own the raw editing text, bounded stepping and the parsed-value
  callback contract for a number field.

  @param {Object}   props                   - Component props
  @param {String|Number} [props.value]      - Controlled editing text
  @param {String|Number} [props.defaultValue] - Initial text
  @param {Function} [props.onChangeText]    - Raw text callback
  @param {Function} [props.onChange]        - Finite number or '' callback
  @param {Number}   [props.min]             - Lower bound
  @param {Number}   [props.max]             - Upper bound
  @param {Number}   [props.step=1]          - Step increment
  @param {Boolean}  [props.allowEmpty]      - Empty input is permitted
  @param {Boolean}  [props.disabled]        - Disables editing
  @param {Boolean}  [props.invalid]         - External invalid flag
  @param {String}   [props.decrementLabel]  - Stepper name
  @param {String}   [props.incrementLabel]  - Stepper name

  @return {Object} - { state, setText, increment, decrement, onKeyPress, actions }
  *********************************************************************/
  function useNumberInput (props) {

    const disabled = props.disabled === true;
    const allowEmpty = props.allowEmpty === true;

    const min = props.min;
    const max = props.max;
    const step = isNullOrUndefined(props.step) ? 1 : props.step;

    if (!isNullOrUndefined(min) && !isFiniteNumber(min)) {
      throw new TypeError('useNumberInput: min must be a finite number');
    }
    if (!isNullOrUndefined(max) && !isFiniteNumber(max)) {
      throw new TypeError('useNumberInput: max must be a finite number');
    }
    if (!isNullOrUndefined(min) && !isNullOrUndefined(max) && min > max) {
      throw new TypeError('useNumberInput: min must not exceed max');
    }
    if (!isFiniteNumber(step) || step <= 0) {
      throw new TypeError('useNumberInput: step must be a finite number greater than 0');
    }

    // Every text request reports the raw text; the number callback reports a
    // finite parse, or '' when the empty request is allowed
    const report = useCallback(function (next) {
      if (typeof props.onChangeText === 'function') {
        props.onChangeText(next);
      }
      if (typeof props.onChange !== 'function') {
        return;
      }
      if (!isString(next) || isEmptyString(next.trim())) {
        if (allowEmpty) {
          props.onChange('');
        }
        return;
      }
      const parsed = parseText(next);
      if (parsed !== undefined) {
        props.onChange(parsed);
      }
    }, [props.onChangeText, props.onChange, allowEmpty]);

    const [text, setTextInternal] = useControllableState({
      value: asText(props.value),
      defaultValue: asText(props.defaultValue) === undefined ? '0' : asText(props.defaultValue),
      onChange: report
    });

    // An empty request rewrites to '' when allowed, else the step start;
    // every other edit is preserved verbatim
    const setText = useCallback(function (request) {
      if (disabled) {
        return;
      }
      const empty = !isString(request) || isEmptyString(request.trim());
      setTextInternal(empty ? (allowEmpty ? '' : '0') : request);
    }, [disabled, allowEmpty, setTextInternal]);

    const number = parseText(text);
    const outOfBounds = number !== undefined && (
      (!isNullOrUndefined(min) && number < min) ||
      (!isNullOrUndefined(max) && number > max));
    const emptyText = !isString(text) || isEmptyString(text.trim());
    const invalid = !disabled && (props.invalid === true || outOfBounds === true
      || (!emptyText && number === undefined) || (emptyText && !allowEmpty));

    // Stepping keeps decimal precision through integer math when the scaled
    // operands and their sum stay safe integers
    const applyStep = useCallback(function (direction) {
      if (disabled) {
        return;
      }
      const base = parseText(text) === undefined ? 0 : parseText(text);
      const delta = step * direction;
      const places = Math.max(decimalsOf(base), decimalsOf(delta));
      let next;
      if (places > 0) {
        const scale = Math.pow(10, places);
        const a = Math.round(base * scale);
        const b = Math.round(delta * scale);
        next = Number.isSafeInteger(a) && Number.isSafeInteger(b) && Number.isSafeInteger(a + b)
          ? (a + b) / scale
          : base + delta;
      } else {
        next = base + delta;
      }
      if (!isNullOrUndefined(min) && next < min) {
        next = min;
      }
      if (!isNullOrUndefined(max) && next > max) {
        next = max;
      }
      const nextText = String(next);
      if (nextText === text) {
        return;
      }
      setTextInternal(nextText);
    }, [disabled, text, step, min, max, setTextInternal]);

    const increment = useCallback(function () {
      applyStep(1);
    }, [applyStep]);
    const decrement = useCallback(function () {
      applyStep(-1);
    }, [applyStep]);

    const onKeyPress = useCallback(function (event) {
      if (disabled || isNullOrUndefined(event)) {
        return;
      }
      const key = event.key !== undefined
        ? event.key
        : (isNullOrUndefined(event.nativeEvent) ? undefined : event.nativeEvent.key);
      if (key === 'ArrowUp') {
        if (typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        applyStep(1);
      } else if (key === 'ArrowDown') {
        if (typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        applyStep(-1);
      }
    }, [disabled, applyStep]);

    // Parent-owned seats render these results; hooks stay unconditional
    const decrementAction = useButton({
      accessibilityLabel: props.decrementLabel === undefined ? 'Decrement number' : props.decrementLabel,
      disabled: disabled,
      onPress: decrement
    });
    const incrementAction = useButton({
      accessibilityLabel: props.incrementLabel === undefined ? 'Increment number' : props.incrementLabel,
      disabled: disabled,
      onPress: increment
    });

    return {
      state: {
        value: text,
        number: number,
        disabled: disabled,
        invalid: invalid
      },
      setText: setText,
      increment: increment,
      decrement: decrement,
      onKeyPress: onKeyPress,
      actions: {
        decrement: decrementAction,
        increment: incrementAction
      }
    };

  }


  useNumberInput.stateKeys = ['value', 'number', 'disabled', 'invalid'];

  return {
    useNumberInput: useNumberInput
  };

}
