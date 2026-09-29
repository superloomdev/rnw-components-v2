// Info: Date and time picker behavior primitives.
//
// These hooks own the draft/view state a picker popover needs: the
// calendar view year/month a date picker displays, and the hour/minute
// draft a time picker edits before confirm. They own state and event
// wiring only - no appearance, no geometry, no token read.
//
// Both resync from the incoming value when the picker opens, so a closed
// picker never churns the view while a controlled value moves. Callbacks
// are read through latest-value refs so inline options never churn the
// returned actions or the resync effect.


/********************************************************************
Build the pickers behaviors for one component system.

@param {Object} deps - { Utils, React }

@return {Object} - { useDatePickerCalendar, useTimePickerDraft }
*********************************************************************/
export default function createPickersBehaviors (deps) {

  const Utils = deps.Utils;
  const React = deps.React;


  /********************************************************************
  Zero-pad a number to two digits.

  @param {Number} value - Integer to pad

  @return {String} - Two-digit string
  *********************************************************************/
  function pad2 (value) {
    return value < 10 ? '0' + value : String(value);
  }


  /********************************************************************
  Parse a `YYYY-MM-DD` value into a calendar base.

  A date is valid only when the year is an integer, the month is 1..12,
  and the day is 1..daysInMonth for that month.

  @param {*} value - Candidate date string

  @return {Object|null} - { year, month, day } with zero-based month
  *********************************************************************/
  function parseDateValue (value) {

    if (!Utils.isString(value)) {
      return null;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (match === null) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!Number.isInteger(year) || month < 1 || month > 12) {
      return null;
    }
    if (day < 1 || day > new Date(year, month, 0).getDate()) {
      return null;
    }

    return { year: year, month: month - 1, day: day };

  }


  /********************************************************************
  Resolve the fallback date for an absent or invalid value.

  Reads getNow when the caller supplies one, otherwise the current date.
  A supplied getNow must return a valid Date.

  @param {Function} [getNow] - Caller-supplied now source

  @return {Object} - { year, month, day } with zero-based month
  *********************************************************************/
  function fallbackDate (getNow) {

    const now = typeof getNow === 'function' ? getNow() : new Date();

    if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
      throw new TypeError('useDatePickerCalendar: getNow must return a valid Date');
    }

    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    };

  }


  /********************************************************************
  Resolve the calendar base from the value or the fallback.

  @param {*}        value   - Candidate `YYYY-MM-DD` string
  @param {Function} [getNow] - Caller-supplied now source

  @return {Object} - { year, month, day } with zero-based month
  *********************************************************************/
  function resolveDateBase (value, getNow) {

    const parsed = parseDateValue(value);

    return parsed === null ? fallbackDate(getNow) : parsed;

  }


  /********************************************************************
  Parse a `HH:MM` value into a time draft.

  Each piece is validated independently; an invalid hour falls back to 9
  and an invalid minute to 0.

  @param {*} value - Candidate time string

  @return {Object} - { hour, minute }
  *********************************************************************/
  function parseTimeValue (value) {

    if (!Utils.isString(value) || Utils.isEmptyString(value)) {
      return { hour: 9, minute: 0 };
    }

    const parts = value.split(':');
    const hour = Utils.isEmptyArray(parts) ? NaN : Number(parts[0]);
    const minute = parts.length > 1 ? Number(parts[1]) : NaN;

    return {
      hour: Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : 9,
      minute: Number.isInteger(minute) && minute >= 0 && minute <= 59 ? minute : 0
    };

  }


  /********************************************************************
  Calendar view state for a date picker.

  The view initializes from the parsed value (or fallback) so there is no
  first-open null frame, and resyncs whenever the picker opens. Month
  navigation rolls the year at January and December. Selection delegates
  to onSelect with a zero-padded `YYYY-MM-DD` value.

  @param {Object}   options
  @param {*}        [options.value]    - `YYYY-MM-DD` string
  @param {Boolean}  [options.open]     - Resyncs the view when true
  @param {Function} [options.getNow]   - Fallback now source
  @param {Function} [options.onSelect] - Called with the padded selection

  @return {Object} - { state, previousMonth, nextMonth, selectDay }
  *********************************************************************/
  function useDatePickerCalendar (options) {

    const open = options.open === true;
    const value = options.value;

    const [view, setView] = React.useState(function () {
      const base = resolveDateBase(value, options.getNow);
      return { year: base.year, month: base.month };
    });

    // Latest callbacks and the current view, so stable actions read fresh
    // values without depending on option identity.
    const liveRef = React.useRef(null);
    liveRef.current = {
      getNow: options.getNow,
      onSelect: options.onSelect,
      view: view
    };

    // Reopening resyncs the view to the current value/fallback; the live
    // box is updated alongside state so a same-batch select sees it.
    React.useEffect(function () {
      if (open) {
        const base = resolveDateBase(value, liveRef.current.getNow);
        const next = { year: base.year, month: base.month };
        liveRef.current.view = next;
        setView(next);
      }
    }, [open, value]);

    const previousMonth = React.useCallback(function () {
      const current = liveRef.current.view;
      const next = current.month === 0
        ? { year: current.year - 1, month: 11 }
        : { year: current.year, month: current.month - 1 };
      liveRef.current.view = next;
      setView(next);
    }, []);

    const nextMonth = React.useCallback(function () {
      const current = liveRef.current.view;
      const next = current.month === 11
        ? { year: current.year + 1, month: 0 }
        : { year: current.year, month: current.month + 1 };
      liveRef.current.view = next;
      setView(next);
    }, []);

    const selectDay = React.useCallback(function (day) {
      const live = liveRef.current;
      const days = new Date(live.view.year, live.view.month + 1, 0).getDate();

      if (!Number.isInteger(day) || day < 1 || day > days) {
        throw new TypeError(
          'useDatePickerCalendar: day must be an integer between 1 and ' + days
        );
      }

      if (typeof live.onSelect === 'function') {
        live.onSelect(
          live.view.year + '-' + pad2(live.view.month + 1) + '-' + pad2(day)
        );
      }
    }, []);

    const parsed = parseDateValue(value);
    const selectedDay = parsed !== null &&
      parsed.year === view.year && parsed.month === view.month
      ? parsed.day
      : null;

    return {
      state: {
        viewYear: view.year,
        viewMonth: view.month,
        daysInMonth: new Date(view.year, view.month + 1, 0).getDate(),
        firstDayOfWeek: new Date(view.year, view.month, 1).getDay(),
        selectedDay: selectedDay
      },
      previousMonth: previousMonth,
      nextMonth: nextMonth,
      selectDay: selectDay
    };

  }

  useDatePickerCalendar.stateKeys = [
    'viewYear',
    'viewMonth',
    'daysInMonth',
    'firstDayOfWeek',
    'selectedDay'
  ];


  /********************************************************************
  Hour/minute draft for a time picker.

  The draft initializes from the parsed value and resyncs whenever the
  picker opens. Selection callbacks validate synchronously, and the draft
  ref is updated alongside state so an hour+minute edit in one batch is
  visible to an immediate confirm.

  @param {Object}   options
  @param {*}        [options.value]     - `HH:MM` string
  @param {Boolean}  [options.open]      - Resyncs the draft when true
  @param {Function} [options.onConfirm] - Called with the padded `HH:MM`

  @return {Object} - { state, selectHour, selectMinute, confirm }
  *********************************************************************/
  function useTimePickerDraft (options) {

    const open = options.open === true;
    const value = options.value;

    const [draft, setDraft] = React.useState(function () {
      return parseTimeValue(value);
    });

    const liveRef = React.useRef(null);
    liveRef.current = {
      onConfirm: options.onConfirm
    };

    // Mirror of the draft so a same-batch select-then-confirm never reads
    // stale values; every mutator updates it alongside the state.
    const draftRef = React.useRef(draft);
    draftRef.current = draft;

    // Reopening resyncs the draft to the current value
    React.useEffect(function () {
      if (open) {
        const next = parseTimeValue(value);
        draftRef.current = next;
        setDraft(next);
      }
    }, [open, value]);

    const selectHour = React.useCallback(function (hour) {
      if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
        throw new TypeError('useTimePickerDraft: hour must be an integer between 0 and 23');
      }
      const next = { hour: hour, minute: draftRef.current.minute };
      draftRef.current = next;
      setDraft(next);
    }, []);

    const selectMinute = React.useCallback(function (minute) {
      if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
        throw new TypeError('useTimePickerDraft: minute must be an integer between 0 and 59');
      }
      const next = { hour: draftRef.current.hour, minute: minute };
      draftRef.current = next;
      setDraft(next);
    }, []);

    const confirm = React.useCallback(function () {
      const live = liveRef.current;
      const current = draftRef.current;
      if (typeof live.onConfirm === 'function') {
        live.onConfirm(pad2(current.hour) + ':' + pad2(current.minute));
      }
    }, []);

    return {
      state: {
        hour: draft.hour,
        minute: draft.minute
      },
      selectHour: selectHour,
      selectMinute: selectMinute,
      confirm: confirm
    };

  }

  useTimePickerDraft.stateKeys = ['hour', 'minute'];


  return {
    useDatePickerCalendar: useDatePickerCalendar,
    useTimePickerDraft: useTimePickerDraft
  };

}
