// Info: Slider behavior: bounded numeric selection by keys, pointer drag
// and a raw text draft.
//
// The hook owns the value on a min-anchored step grid, a draft the text
// edit may hold verbatim, and the track responder gesture that maps a
// page coordinate onto the measured host width. Values clamp to the
// inclusive endpoints and snap to grid points; the endpoints themselves
// always stay reachable even when the span is not divisible by the step.
// Every handler is a stable callback reading a latest-value box, so a
// retained gesture, text or accessibility callback cannot modify a
// now-disabled hook. Appearance is never decided here.


/********************************************************************
Build the slider behavior for one component system.

@param {Object} deps                        - Injected dependencies
@param {Object} deps.React                  - The host's React
@param {Object} deps.Utils                  - helper-utils
@param {Object} deps.platform               - The injected platform answer
@param {Object} deps.useControllableState   - state family hook
@param {Object} deps.useInteractionState    - local family hook

@return {Object} - { useSlider }
*********************************************************************/
export default function createSliderBehaviors (deps) {

  const React = deps.React;
  const Utils = deps.Utils;
  const platform = deps.platform;
  const useControllableState = deps.useControllableState;
  const useInteractionState = deps.useInteractionState;

  const { isFunction, isNullOrUndefined, isNumber, isString } = Utils;
  const { useCallback, useEffect, useRef, useState } = React;


  /********************************************************************
  A finite JS number only; NaN and infinities are not geometry or values.

  @param {*} value - Candidate

  @return {Boolean}
  *********************************************************************/
  function isFiniteNumber (value) {
    return isNumber(value) && Number.isFinite(value);
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
  The scale and integer grid for min-anchored arithmetic, defined by min
  and step alone so request noise cannot shrink it; null when the scaled
  endpoints cannot be represented safely.

  @param {Number} min  - Lower endpoint
  @param {Number} step - Grid step

  @return {Object|null} - { scale, minI, stepI }
  *********************************************************************/
  function scaledGrid (min, step) {
    const places = Math.max(decimalsOf(min), decimalsOf(step));
    const scale = Math.pow(10, places);
    const minI = Math.round(min * scale);
    const stepI = Math.round(step * scale);
    if (!Number.isSafeInteger(minI) || !Number.isSafeInteger(stepI) || stepI < 1) {
      return null;
    }
    return { scale: scale, minI: minI, stepI: stepI };
  }


  /********************************************************************
  Normalize a request: clamp to the inclusive endpoints, then snap onto
  the min-anchored grid. The endpoints answer as themselves even off-grid.

  @param {Number} min   - Lower endpoint
  @param {Number} max   - Upper endpoint
  @param {Number} step  - Grid step
  @param {Number} value - Requested value

  @return {Number}
  *********************************************************************/
  function snapValue (min, max, step, value) {
    if (value <= min) {
      return min;
    }
    if (value >= max) {
      return max;
    }
    const grid = scaledGrid(min, step);
    if (grid !== null) {
      const index = Math.round((value * grid.scale - grid.minI) / grid.stepI);
      const snappedI = grid.minI + index * grid.stepI;
      if (Number.isSafeInteger(snappedI)) {
        const snapped = snappedI / grid.scale;
        return snapped <= min ? min : snapped >= max ? max : snapped;
      }
    }
    const index = (value - min) / step;
    if (!isFiniteNumber(index) || !Number.isSafeInteger(Math.round(index))) {
      // The quotient carries no usable grid unit: the value stays where it
      // is rather than collapsing to a wrong quotient product
      return value;
    }
    const next = min + Math.round(index) * step;
    if (!Number.isFinite(next)) {
      return value;
    }
    return next <= min ? min : next >= max ? max : next;
  }


  /********************************************************************
  The grid point `multiplier` steps in `direction` from `value`. An
  off-grid endpoint steps to the immediately preceding grid point, not
  to a value re-snapped toward it.

  @param {Number} min        - Lower endpoint
  @param {Number} max        - Upper endpoint
  @param {Number} step       - Grid step
  @param {Number} value      - Value to step from (on grid or an endpoint)
  @param {Number} direction  - 1 or -1
  @param {Number} multiplier - Positive integer step count

  @return {Number}
  *********************************************************************/
  function steppedValue (min, max, step, value, direction, multiplier) {
    const grid = scaledGrid(min, step);
    if (grid !== null) {
      const index = (value * grid.scale - grid.minI) / grid.stepI;
      const nearest = Math.round(index);
      const onGrid = Number.isSafeInteger(nearest) &&
        (grid.minI + nearest * grid.stepI) / grid.scale === value;
      const k = direction > 0
        ? (onGrid ? nearest + multiplier : Math.floor(index) + multiplier)
        : (onGrid ? nearest - multiplier : Math.ceil(index) - multiplier);
      const nextI = grid.minI + k * grid.stepI;
      const next = nextI / grid.scale;
      return next <= min ? min : next >= max ? max : next;
    }
    const index = (value - min) / step;
    const nearest = Math.round(index);
    if (!isFiniteNumber(index) || !Number.isSafeInteger(nearest)) {
      // The quotient carries no usable grid unit: step directly from the
      // current value and clamp; a sub-ULP candidate equal to the current
      // value is a no-op
      const candidate = value + direction * step * multiplier;
      return candidate <= min ? min : candidate >= max ? max : candidate;
    }
    const onGrid = min + nearest * step === value;
    const k = direction > 0
      ? (onGrid ? nearest + multiplier : Math.floor(index) + multiplier)
      : (onGrid ? nearest - multiplier : Math.ceil(index) - multiplier);
    const next = min + k * step;
    return next <= min ? min : next >= max ? max : next;
  }


  /********************************************************************
  Ratio into a value. A finite difference maps linearly; when the finite
  endpoints span an overflowing difference the half-scaled difference is
  equivalent and stays finite.

  @param {Number} min   - Lower endpoint
  @param {Number} max   - Upper endpoint
  @param {Number} ratio - Ratio in [0, 1] (callers clamp)

  @return {Number}
  *********************************************************************/
  function valueForRatio (min, max, ratio) {
    const span = max - min;
    if (Number.isFinite(span)) {
      return min + ratio * span;
    }
    return 2 * (min / 2 + ratio * (max / 2 - min / 2));
  }


  /********************************************************************
  Value into its ratio along the span; half-scaled when the finite
  endpoints span an overflowing difference.

  @param {Number} min   - Lower endpoint
  @param {Number} max   - Upper endpoint
  @param {Number} value - Value in [min, max]

  @return {Number}
  *********************************************************************/
  function ratioForValue (min, max, value) {
    const span = max - min;
    if (Number.isFinite(span)) {
      return (value - min) / span;
    }
    return (value / 2 - min / 2) / (max / 2 - min / 2);
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
  The pointer page coordinate of a gesture event; anything else is
  unusable geometry.

  @param {*} event - Gesture event

  @return {Number|undefined}
  *********************************************************************/
  function pageXOf (event) {
    const nativeEvent = isNullOrUndefined(event) ? undefined : event.nativeEvent;
    return isNullOrUndefined(nativeEvent) ? undefined : nativeEvent.pageX;
  }


  /********************************************************************
  Whether a gesture event is a primary press; a button code other than
  the primary one is ignored.

  @param {*} event - Gesture event

  @return {Boolean}
  *********************************************************************/
  function isPrimaryPress (event) {
    const nativeEvent = isNullOrUndefined(event) ? undefined : event.nativeEvent;
    const button = isNullOrUndefined(nativeEvent) ? undefined : nativeEvent.button;
    return button === undefined || button === 0;
  }


  const ACCESSIBILITY_ACTIONS = Object.freeze([
    Object.freeze({ name: 'increment' }),
    Object.freeze({ name: 'decrement' })
  ]);

  // The web half measures synchronously from the viewport rect plus the
  // node's own document scroll, so a page coordinate compares to it; the
  // native half measures asynchronously through the node
  const measureSync = platform.split({
    web: function (node) {
      const rect = node.getBoundingClientRect();
      const view = isNullOrUndefined(node.ownerDocument) ? undefined : node.ownerDocument.defaultView;
      const scrollX = isNullOrUndefined(view) ? 0 : view.scrollX;
      return { x: rect.left + scrollX, width: rect.width };
    }
  });
  const measureAsync = platform.split({
    native: function (node, done) {
      node.measureInWindow(function (x, y, width) {
        done({ x: x, width: width });
      });
    }
  });


  /********************************************************************
  Bounded slider state: the value on its min-anchored grid, the raw text
  draft, the measured host width and the pointer/keyboard contract.

  @param {Object}   props                          - Component props
  @param {Number}   [props.min=0]                  - Lower endpoint
  @param {Number}   [props.max=100]                - Upper endpoint
  @param {Number}   [props.step=1]                 - Grid step
  @param {Number}   [props.value]                  - Controlled value
  @param {Number}   [props.defaultValue]           - Initial uncontrolled value
  @param {Function} [props.onChange]               - Called with the next number
  @param {Function} [props.onRelease]              - Called once when a drag ends
  @param {Boolean}  [props.disabled]               - Disables the control
  @param {Boolean}  [props.invalid]                - External invalid flag
  @param {Number}   [props.stepMultiplier=4]       - Shift/Page step count
  @param {Number}   [props.travelInset=0]          - Handle travel inset inside the host

  @return {Object} - { state, setValue, setRatio, setText, commitText, trackProps, thumbProps }
  *********************************************************************/
  function useSlider (props) {

    const min = props.min === undefined ? 0 : props.min;
    const max = props.max === undefined ? 100 : props.max;
    const step = props.step === undefined ? 1 : props.step;
    const stepMultiplier = props.stepMultiplier === undefined ? 4 : props.stepMultiplier;
    const travelInset = props.travelInset === undefined ? 0 : props.travelInset;

    if (!isFiniteNumber(min)) {
      throw new TypeError('useSlider: min must be a finite number');
    }
    if (!isFiniteNumber(max)) {
      throw new TypeError('useSlider: max must be a finite number');
    }
    if (!(min < max)) {
      throw new TypeError('useSlider: min must be less than max');
    }
    if (!isFiniteNumber(step) || step <= 0) {
      throw new TypeError('useSlider: step must be a finite number greater than 0');
    }
    if (props.value !== undefined && !isFiniteNumber(props.value)) {
      throw new TypeError('useSlider: value must be a finite number');
    }
    if (props.defaultValue !== undefined && !isFiniteNumber(props.defaultValue)) {
      throw new TypeError('useSlider: defaultValue must be a finite number');
    }
    if (!Number.isInteger(stepMultiplier) || stepMultiplier <= 0) {
      throw new TypeError('useSlider: stepMultiplier must be a positive integer');
    }
    if (!isFiniteNumber(travelInset) || travelInset < 0) {
      throw new TypeError('useSlider: travelInset must be a nonnegative finite number');
    }

    const disabled = props.disabled === true;

    const [rawValue, setRawValue] = useControllableState({
      value: props.value,
      defaultValue: props.defaultValue === undefined ? min : snapValue(min, max, step, props.defaultValue),
      onChange: props.onChange
    });
    const value = snapValue(min, max, step, rawValue);

    const [draft, setDraft] = useState();
    const [trackWidth, setTrackWidth] = useState(0);

    const trackRef = useRef(null);
    const thumbRef = useRef(null);
    const hostRef = useRef(null);
    const baseRef = useRef(value);
    const anchorRef = useRef();
    const echoRef = useRef();
    const dragRef = useRef({ generation: 0, active: false, measured: false, lastPageX: undefined, lastRequested: undefined, requested: false });
    const liveRef = useRef(null);

    // The issued base re-anchors to the effective value on every render;
    // requests in the same batch (before any render) step from the last
    // issued value, and a controlled prop that never moved re-anchors
    baseRef.current = value;

    // A draft stays while the effective value is where the edit started
    // or is the echo the draft itself requested; any other external value
    // replaces it
    let draftText;
    if (draft !== undefined) {
      if (echoRef.current === value || anchorRef.current === value) {
        anchorRef.current = value;
        draftText = draft;
      }
    }
    const parsedDraft = draftText === undefined ? undefined : parseText(draftText);
    const draftBad = draftText !== undefined &&
      (parsedDraft === undefined || parsedDraft < min || parsedDraft > max);
    const invalid = !disabled && (props.invalid === true || draftBad);

    liveRef.current = {
      min: min,
      max: max,
      step: step,
      stepMultiplier: stepMultiplier,
      travelInset: travelInset,
      disabled: disabled,
      value: value,
      draft: draftText,
      onRelease: props.onRelease
    };

    // A genuine numeric request only: normalized onto the grid, reported
    // once per distinct value, guarded live against disablement
    const issueNumber = useCallback(function (requested) {
      const live = liveRef.current;
      if (live.disabled || !isFiniteNumber(requested)) {
        return undefined;
      }
      const next = snapValue(live.min, live.max, live.step, requested);
      if (next === baseRef.current) {
        return undefined;
      }
      baseRef.current = next;
      setRawValue(next);
      return next;
    }, [setRawValue]);

    // A request from keys, pointer or commit also serializes its
    // normalized value into the draft so the text echoes the requested
    // number - even when the numeric boundary suppresses a duplicate
    // callback, the draft still resets to the requested serialization
    const issueValue = useCallback(function (requested) {
      const live = liveRef.current;
      if (live.disabled || !isFiniteNumber(requested)) {
        return;
      }
      const next = snapValue(live.min, live.max, live.step, requested);
      anchorRef.current = live.value;
      echoRef.current = next;
      setDraft(String(next));
      issueNumber(requested);
    }, [issueNumber]);

    const setValue = useCallback(function (request) {
      issueValue(request);
    }, [issueValue]);

    const setRatio = useCallback(function (request) {
      const live = liveRef.current;
      if (live.disabled || !isFiniteNumber(request)) {
        return;
      }
      const clamped = request <= 0 ? 0 : request >= 1 ? 1 : request;
      issueValue(valueForRatio(live.min, live.max, clamped));
    }, [issueValue]);

    // The draft keeps raw valid formatting and partial invalid text; a
    // whole in-range number requests its snapped value without rewriting
    // the text, out-of-range stays put until commit
    const setText = useCallback(function (next) {
      const live = liveRef.current;
      if (live.disabled || !isString(next)) {
        return;
      }
      anchorRef.current = live.value;
      echoRef.current = undefined;
      setDraft(next);
      const parsed = parseText(next);
      if (parsed !== undefined && parsed >= live.min && parsed <= live.max) {
        const requested = issueNumber(parsed);
        if (requested !== undefined) {
          echoRef.current = requested;
        }
      }
    }, [issueNumber]);

    // Commit: valid text clamps/snaps into a request; malformed or empty
    // text resets to the actual value and clears draft invalidity
    const commitText = useCallback(function () {
      const live = liveRef.current;
      if (live.disabled || live.draft === undefined) {
        return;
      }
      const parsed = parseText(live.draft);
      if (parsed === undefined) {
        anchorRef.current = live.value;
        echoRef.current = undefined;
        setDraft(undefined);
        return;
      }
      issueValue(parsed);
    }, [issueValue]);

    const interaction = useInteractionState({
      disabled: disabled
    });

    // An external effective value that is neither the draft's anchor nor
    // its accepted echo permanently retires the draft, so returning to
    // the old anchor can never resurrect stale text
    useEffect(function () {
      if (draft !== undefined && echoRef.current !== value && anchorRef.current !== value) {
        anchorRef.current = undefined;
        echoRef.current = undefined;
        setDraft(undefined);
      }
    }, [value, draft]);

    // Becoming disabled or unmounting cancels any active or pending drag;
    // a late measurement can never move the value or report a release
    useEffect(function () {
      const drag = dragRef.current;
      if (disabled) {
        drag.active = false;
        drag.measured = false;
        drag.generation += 1;
        anchorRef.current = undefined;
        echoRef.current = undefined;
        setDraft(undefined);
      }
    }, [disabled]);

    useEffect(function () {
      return function () {
        dragRef.current.active = false;
        dragRef.current.generation += 1;
      };
    }, []);

    const applyHost = useCallback(function (host) {
      hostRef.current = host;
      if (!isNullOrUndefined(host) && isFiniteNumber(host.width)) {
        setTrackWidth(host.width);
      }
    }, []);

    // Measure the host now when the platform answers synchronously, else
    // start the asynchronous measure; a stale generation discards the
    // late answer entirely
    const measureHost = useCallback(function (onMeasured) {
      const node = trackRef.current;
      if (isNullOrUndefined(node)) {
        return undefined;
      }
      if (measureSync !== null) {
        const host = measureSync(node);
        applyHost(host);
        return host;
      }
      if (measureAsync !== null) {
        const generation = dragRef.current.generation;
        measureAsync(node, function (host) {
          if (dragRef.current.generation !== generation) {
            return;
          }
          applyHost(host);
          if (isFunction(onMeasured)) {
            onMeasured(host);
          }
        });
      }
      return undefined;
    }, [applyHost]);

    // A page coordinate becomes a ratio against the measured host minus
    // the travel inset on both ends; unusable geometry emits nothing. A
    // repeated position inside one drag does not request again, even
    // after an interleaved render re-anchors the numeric base
    const applyPageX = useCallback(function (pageX) {
      const live = liveRef.current;
      const drag = dragRef.current;
      const host = hostRef.current;
      if (live.disabled || !drag.active || isNullOrUndefined(host) ||
          !isFiniteNumber(host.x) || !isFiniteNumber(host.width) || host.width <= 0 ||
          !isFiniteNumber(pageX)) {
        return;
      }
      const width = host.width - 2 * live.travelInset;
      if (width <= 0) {
        return;
      }
      const next = snapValue(live.min, live.max, live.step,
        valueForRatio(live.min, live.max, (pageX - host.x - live.travelInset) / width));
      // The first accepted request always serializes its value into the
      // draft - a grant on the unchanged value still resets a stale draft
      // without emitting; only later repeats of the same position dedup
      if (drag.requested === true && next === drag.lastRequested) {
        return;
      }
      drag.requested = true;
      drag.lastRequested = next;
      issueValue(next);
    }, [issueValue]);

    const onLayout = useCallback(function () {
      measureHost();
    }, [measureHost]);

    const onStartShouldSetResponderCapture = useCallback(function (event) {
      return liveRef.current.disabled !== true && isPrimaryPress(event);
    }, []);

    const onMoveShouldSetResponderCapture = useCallback(function () {
      return false;
    }, []);

    const onResponderTerminationRequest = useCallback(function () {
      return true;
    }, []);

    // Grant: mark the pointer origin before the thumb takes focus, press
    // in, then measure; the latest pointer applies the moment a pending
    // measurement resolves
    const onResponderGrant = useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled || !isPrimaryPress(event)) {
        return;
      }
      interaction.rootProps.onPointerDown(event);
      const thumb = thumbRef.current;
      if (!isNullOrUndefined(thumb) && isFunction(thumb.focus)) {
        thumb.focus();
      }
      interaction.rootProps.onPressIn(event);
      const drag = dragRef.current;
      drag.generation += 1;
      drag.active = true;
      drag.measured = false;
      drag.lastPageX = pageXOf(event);
      drag.lastRequested = live.value;
      drag.requested = false;
      const host = measureHost(function () {
        const current = dragRef.current;
        current.measured = true;
        applyPageX(current.lastPageX);
      });
      if (host !== undefined) {
        drag.measured = true;
        applyPageX(drag.lastPageX);
      }
    }, [interaction, measureHost, applyPageX]);

    const onResponderMove = useCallback(function (event) {
      const drag = dragRef.current;
      if (!drag.active || liveRef.current.disabled) {
        return;
      }
      const pageX = pageXOf(event);
      if (!isFiniteNumber(pageX)) {
        return;
      }
      drag.lastPageX = pageX;
      if (drag.measured) {
        applyPageX(pageX);
      }
    }, [applyPageX]);

    // Release an established drag reports once with its last requested
    // value (or the current value when it never moved); a drag that never
    // measured cancels silently
    const onResponderRelease = useCallback(function (event) {
      const live = liveRef.current;
      const drag = dragRef.current;
      if (!drag.active || live.disabled) {
        return;
      }
      const established = drag.measured;
      const lastRequested = drag.lastRequested;
      drag.active = false;
      drag.measured = false;
      drag.generation += 1;
      interaction.rootProps.onPressOut(event);
      if (established && isFunction(live.onRelease)) {
        live.onRelease(lastRequested);
      }
    }, [interaction]);

    const onResponderTerminate = useCallback(function (event) {
      const drag = dragRef.current;
      if (!drag.active) {
        return;
      }
      drag.active = false;
      drag.measured = false;
      drag.generation += 1;
      interaction.rootProps.onPressOut(event);
    }, [interaction]);

    // Arrows step by one grid point, Shift and Page by the multiplier,
    // Home and End reach the endpoints; only handled keys preventDefault
    const onKeyDown = useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled || isNullOrUndefined(event)) {
        return;
      }
      const key = event.key;
      let next;
      if (key === 'ArrowRight' || key === 'ArrowUp') {
        next = steppedValue(live.min, live.max, live.step, baseRef.current, 1,
          event.shiftKey === true ? live.stepMultiplier : 1);
      } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
        next = steppedValue(live.min, live.max, live.step, baseRef.current, -1,
          event.shiftKey === true ? live.stepMultiplier : 1);
      } else if (key === 'PageUp') {
        next = steppedValue(live.min, live.max, live.step, baseRef.current, 1, live.stepMultiplier);
      } else if (key === 'PageDown') {
        next = steppedValue(live.min, live.max, live.step, baseRef.current, -1, live.stepMultiplier);
      } else if (key === 'Home') {
        next = live.min;
      } else if (key === 'End') {
        next = live.max;
      } else {
        return;
      }
      if (isFunction(event.preventDefault)) {
        event.preventDefault();
      }
      issueValue(next);
    }, [issueValue]);

    const onAccessibilityAction = useCallback(function (event) {
      const live = liveRef.current;
      if (live.disabled || isNullOrUndefined(event) || isNullOrUndefined(event.nativeEvent)) {
        return;
      }
      if (event.nativeEvent.actionName === 'increment') {
        issueValue(steppedValue(live.min, live.max, live.step, baseRef.current, 1, 1));
      } else if (event.nativeEvent.actionName === 'decrement') {
        issueValue(steppedValue(live.min, live.max, live.step, baseRef.current, -1, 1));
      }
    }, [issueValue]);

    return {
      state: {
        value: value,
        ratio: ratioForValue(min, max, value),
        text: draftText === undefined ? String(value) : draftText,
        invalid: invalid,
        disabled: disabled,
        focused: interaction.state.focused,
        focusVisible: interaction.state.focusVisible,
        hovered: interaction.state.hovered,
        pressed: interaction.state.pressed,
        trackWidth: trackWidth
      },
      setValue: setValue,
      setRatio: setRatio,
      setText: setText,
      commitText: commitText,
      trackProps: {
        ref: trackRef,
        onLayout: onLayout,
        onStartShouldSetResponderCapture: onStartShouldSetResponderCapture,
        onMoveShouldSetResponderCapture: onMoveShouldSetResponderCapture,
        onResponderGrant: onResponderGrant,
        onResponderMove: onResponderMove,
        onResponderRelease: onResponderRelease,
        onResponderTerminate: onResponderTerminate,
        onResponderTerminationRequest: onResponderTerminationRequest
      },
      thumbProps: Object.assign({}, interaction.rootProps, {
        ref: thumbRef,
        onKeyDown: onKeyDown,
        onAccessibilityAction: onAccessibilityAction,
        accessibilityRole: 'adjustable',
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-valuetext': String(value),
        'aria-disabled': disabled ? true : undefined,
        accessibilityActions: ACCESSIBILITY_ACTIONS,
        tabIndex: disabled ? -1 : 0
      })
    };

  }

  useSlider.stateKeys = ['value', 'ratio', 'text', 'invalid', 'disabled',
    'focused', 'focusVisible', 'hovered', 'pressed', 'trackWidth'];


  return {
    useSlider: useSlider
  };

}
