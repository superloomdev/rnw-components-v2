// Info: The drawn half of the DatePicker composite. It owns the value (one
// date, or a start and end for `range`), the open state and the shown
// month, publishes them through the compound context its DatePickerInputs
// read, and draws the calendar under the first input while open, in place
// at the field's start edge (logical, so it stays over the field in rtl).
// The native half reuses this drawing with the host's OS date picker
// adapter in place of the calendar.
//
// Behavior: a field's press or focus opens the calendar unless the picker
// is `simple`, read-only or disabled; a day press selects (a range takes
// its start, then its end) and closes; Escape closes; typed text that
// parses as `m/d/Y` sets the value.

import createDatePickerContext from './date-picker-context.js';
import createDatePickerCalendar, { compareDates } from './date-picker-calendar.js';


/********************************************************************
DatePickerWeb factory.

@param {Object} ctx       - Component context
@param {Object} [options] - { Adapter }: the host's OS date picker; the
                            fields then seat it and no calendar draws

@return {Function} - The drawn DatePicker component
*********************************************************************/
export default function DatePickerWeb (ctx, options) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;
  const { useControllableState, useDatePickerCalendar, useEscapeKey } = ctx.behaviors;
  const DatePickerContext = createDatePickerContext(ctx);
  const Calendar = createDatePickerCalendar(ctx);
  const Adapter = Utils.isObject(options) ? options.Adapter : undefined;


  /********************************************************************
  Zero-pad a number to two digits.

  @param {Number} value - Integer

  @return {String} - Two digits or more
  *********************************************************************/
  function pad2 (value) {
    return value < 10 ? '0' + value : String(value);
  }


  /********************************************************************
  Parse an `m/d/Y` text into a calendar date.

  @param {*} text - Candidate text

  @return {Object|null} - { year, month, day } with zero-based month
  *********************************************************************/
  function parseDate (text) {
    const match = Utils.isString(text) ? /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text.trim()) : null;
    if (match === null) {
      return null;
    }
    const month = Number(match[1]) - 1;
    const day = Number(match[2]);
    const year = Number(match[3]);
    if (month < 0 || month > 11 || day < 1 || day > new Date(year, month + 1, 0).getDate()) {
      return null;
    }
    return { year: year, month: month, day: day };
  }


  /********************************************************************
  Format a calendar date as `m/d/Y` text.

  @param {Object|null} date - { year, month, day }

  @return {String} - `mm/dd/yyyy`, empty for null
  *********************************************************************/
  function formatDate (date) {
    return date === null ? '' : pad2(date.month + 1) + '/' + pad2(date.day) + '/' + date.year;
  }


  /********************************************************************
  DatePicker component (drawn).

  @param {Object} props - See `api.date-picker.js`

  @return {Object} - React element
  *********************************************************************/
  function DatePickerWebComponent (props) {

    const type = Utils.isString(props.datePickerType) ? props.datePickerType : 'single';
    const range = type === 'range';
    const disabled = props.disabled === true;
    const locked = props['isReadOnly'] === true;

    // The value is text in `m/d/Y`, a pair of texts for a range; typed
    // text that does not parse yet is a per-field draft
    const [value, setValue] = useControllableState({
      value: props.value,
      defaultValue: props.defaultValue !== undefined ? props.defaultValue : range ? ['', ''] : '',
      onChange: props.onChange
    });
    const texts = range ? (Array.isArray(value) ? [value[0] || '', value[1] || ''] : ['', '']) : [Utils.isString(value) ? value : ''];
    const dates = texts.map(parseDate);
    const [drafts, setDrafts] = React.useState([null, null]);

    // The calendar opens only where it can draw: never `simple`, read-only,
    // disabled, or while the host's OS picker replaces it
    const canOpen = type !== 'simple' && !disabled && !locked && Adapter === undefined;
    const [open, setOpenState] = useControllableState({ value: props.open, defaultValue: false, onChange: props.onOpenChange });
    const isOpen = open === true && canOpen;
    const setOpen = function (next) {
      if (next !== true || canOpen) {
        setOpenState(next === true);
      }
    };
    useEscapeKey(function () {
      setOpen(false);
    }, isOpen);

    // The shown month follows the first date each time the calendar opens
    const first = dates[0];
    const calendar = useDatePickerCalendar({
      open: isOpen,
      value: first === null ? undefined : first.year + '-' + pad2(first.month + 1) + '-' + pad2(first.day)
    });

    const commit = function (next) {
      setDrafts([null, null]);
      setValue(range ? [formatDate(next[0]), formatDate(next[1])] : formatDate(next[0]));
    };

    // A single date closes the calendar; a range takes its start, then
    // its end (in date order) and closes
    const select = function (date) {
      if (!range) {
        commit([date]);
        setOpen(false);
        return;
      }
      const start = dates[0];
      if (start !== null && dates[1] === null) {
        commit(compareDates(date, start) < 0 ? [date, start] : [start, date]);
        setOpen(false);
        return;
      }
      commit([date, null]);
    };

    // Typed text sets the value once it parses, or once it is cleared
    const setText = function (index, text) {
      const parsed = parseDate(text);
      if (parsed === null && !Utils.isEmptyString(text)) {
        const next = drafts.slice();
        next[index] = text;
        setDrafts(next);
        return;
      }
      const next = dates.slice();
      next[index] = parsed;
      commit(next);
    };

    // The calendar hangs from the first field's frame, at its start edge
    const now = new Date();
    const layer = isOpen ? React.createElement(View, {
      style: { position: 'absolute', start: 0, top: '100%', zIndex: ctx.token('stacking.dropdown') }
    }, React.createElement(Calendar, {
      locale: props.locale,
      maxDate: parseDate(props.maxDate),
      minDate: parseDate(props.minDate),
      onEscape: function () {
        setOpen(false);
      },
      onNext: calendar.nextMonth,
      onPrevious: calendar.previousMonth,
      onSelect: select,
      range: range,
      selection: dates,
      today: { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() },
      view: { year: calendar.state.viewYear, month: calendar.state.viewMonth }
    })) : null;

    const context = {
      Adapter: Adapter,
      calendar: layer,
      dates: dates,
      disabled: disabled,
      flags: Object.freeze({ short: props.short === true }),
      'isReadOnly': locked,
      open: isOpen,
      selectDate: function (index, date) {
        const next = dates.slice();
        next[index] = date;
        commit(next);
      },
      setOpen: setOpen,
      setText: setText,
      texts: texts.map(function (text, index) {
        return drafts[index] === null ? text : drafts[index];
      }),
      type: type
    };

    // Each field takes its seat index: the first of a range carries the
    // one-gap and the calendar's anchor. Fields given as data render
    // where no children are given
    const fields = props.children !== undefined && props.children !== null
      ? React.Children.map(props.children, function (child, index) {
        return child === null ? null : React.cloneElement(child, { pickerIndex: index });
      })
      : (Array.isArray(props.inputs) ? props.inputs : []).map(function (input, index) {
        return React.createElement(ctx.Registry.DatePickerInput, Object.assign({ key: index }, input, { pickerIndex: index }));
      });

    return React.createElement(DatePickerContext.Provider, { value: context },
      React.createElement(View, {
        dataSet: { part: 'root' },
        style: { alignSelf: 'flex-start', flexDirection: 'row' },
        testID: props.testID
      }, fields));

  }

  DatePickerWebComponent.displayName = 'DatePickerWeb';

  return DatePickerWebComponent;

}
