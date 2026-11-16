// Info: DatePicker measurement reference. The upstream picker takes the
// same `datePickerType`, `value` and `short`, `readOnly` for our
// `isReadOnly`, and its fields as DatePickerInput children (the disabled
// flag goes on each field). Its calendar is appended to a positioned stage
// that fills the cell body (`appendTo`), where it draws flush under the
// first field as ours does; an `open` state opens it after mount and
// re-opens it whenever it closes, so the open cells stay open while other
// cells take focus. The stage repairs two upstream states the harness's
// leave steps reach and a person's next press would not show: a picker
// left open without its `open` class, and an open range that lost its
// selection. The parts compared are the label, the field, its text
// and icon, the message, and on the open calendar its box, header, arrows,
// month name, year box, weekday row and day cells by state.

const PCT = '%';
let counter = 0;


/********************************************************************
The positioned stage the upstream calendar is appended to; an open state
keeps the calendar open on the value's selection and month.

@param {Object} props - { React, picker, open, value }: `value` is the
                        state's value (a date text or a pair of them)

@return {Object} - React element
*********************************************************************/
function Stage (props) {

  const React = props.React;
  const [stage, setStage] = React.useState(null);
  React.useEffect(function () {
    if (stage === null) {
      return undefined;
    }
    const pickerOf = function () {
      const input = stage.querySelector('.cds--date-picker__input');
      return input === null ? undefined : input._flatpickr;
    };
    // Escape on a field drops the calendar's `open` class without closing
    // the picker (`DatePicker.js:308`), so flatpickr's next `open` is a
    // no-op (`flatpickr index.js:1248-1255`) and a press shows no calendar;
    // the stage closes such a picker before the next key, focus or press
    const sync = function () {
      const picker = pickerOf();
      if (picker !== undefined && picker.isOpen === true && !picker.calendarContainer.classList.contains('open')) {
        picker.close();
      }
    };
    document.addEventListener('pointerdown', sync, true);
    document.addEventListener('focusin', sync, true);
    document.addEventListener('keyup', sync, true);
    const release = function () {
      document.removeEventListener('pointerdown', sync, true);
      document.removeEventListener('focusin', sync, true);
      document.removeEventListener('keyup', sync, true);
    };
    if (props.open !== true) {
      return release;
    }
    const values = Array.isArray(props.value) ? props.value : typeof props.value === 'string' ? [props.value] : null;
    const reopen = function () {
      sync();
      const picker = pickerOf();
      if (picker === undefined) {
        return;
      }
      // A click outside lets flatpickr re-read the first field alone
      // (`flatpickr index.js:927-931`), which empties a range; the open
      // state keeps the value's selection, as ours does
      if (values !== null && picker.selectedDates.length !== values.length) {
        picker.setDate(values, false, picker.config.dateFormat);
      }
      if (picker.isOpen !== true) {
        picker.open();
      }
      // The open state shows the first selected day's month, as ours does
      const first = picker.selectedDates[0];
      if (first !== undefined && (picker.currentMonth !== first.getMonth() || picker.currentYear !== first.getFullYear())) {
        picker.jumpToDate(first);
      }
    };
    // The stage hears a field's focus and press after the field's own
    // handlers (they bubble up to it), so the view turns back before a
    // state is read rather than at the next tick of the interval; once
    // more on the next task, after any handler the field defers
    const turn = function () {
      reopen();
      setTimeout(reopen, 0);
    };
    reopen();
    const timer = setInterval(reopen, 200);
    stage.addEventListener('focusin', turn);
    stage.addEventListener('click', turn);
    return function () {
      release();
      clearInterval(timer);
      stage.removeEventListener('focusin', turn);
      stage.removeEventListener('click', turn);
    };
  }, [stage, props.open]);
  return React.createElement('div', { ref: setStage, style: { height: 100 + PCT, position: 'relative', width: 100 + PCT } },
    stage === null ? null : props.picker(stage));

}


export default Object.freeze({
  kind: 'render-web',
  body: Object.freeze({ width: 320, height: 420, stage: true }),
  mount: function (React, upstream, props) {
    counter = counter + 1;
    const id = counter;
    const inputs = Array.isArray(props.inputs) ? props.inputs : [];
    return React.createElement(Stage, {
      React: React,
      open: props.open === true,
      value: props.value,
      picker: function (node) {
        return React.createElement(upstream.DatePicker, {
          appendTo: node,
          datePickerType: props.datePickerType || 'single',
          'readOnly': props['isReadOnly'] === true,
          short: props.short === true,
          value: props.value
        }, inputs.map(function (input, index) {
          return React.createElement(upstream.DatePickerInput, {
            disabled: props.disabled === true || input.disabled === true,
            id: 'reference-date-picker-' + id + '-' + index,
            invalid: input.invalid === true,
            invalidText: input.invalidText,
            key: index,
            labelText: input.labelText,
            placeholder: input.placeholder,
            size: input.size
          });
        }));
      }
    });
  },
  // The element a person hovers and focuses
  target: Object.freeze({ upstream: '.cds--date-picker__input', ours: '[data-part="input"] input' }),
  parts: Object.freeze({
    label: Object.freeze({ upstream: '.cds--label', ours: '[data-part="input"] > [dir="auto"]:first-child', measure: 'text' }),
    input: Object.freeze({ upstream: '.cds--date-picker__input', ours: '[data-part="input"] > div:has(> input)', measure: 'box' }),
    value: Object.freeze({ upstream: '.cds--date-picker__input', ours: '[data-part="input"] input', measure: 'type' }),
    icon: Object.freeze({ upstream: '.cds--date-picker__icon', ours: '[data-part="input"] svg', measure: 'box', optional: true }),
    message: Object.freeze({ upstream: '.cds--form-requirement', ours: '[data-part="input"] > [dir="auto"]:not(:first-child)', measure: 'text', optional: true }),
    calendar: Object.freeze({ upstream: '.flatpickr-calendar.open', ours: '[data-part="calendar"]', measure: 'box', optional: true }),
    month: Object.freeze({ upstream: '.flatpickr-month', ours: '[data-part="month"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    monthLabel: Object.freeze({ upstream: '.flatpickr-current-month .cur-month', ours: '[data-part="monthLabel"]', measure: 'text', optional: true }),
    year: Object.freeze({ upstream: '.flatpickr-current-month .numInputWrapper', ours: '[data-part="year"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    prevNav: Object.freeze({ upstream: '.flatpickr-prev-month', ours: '[data-part="prevNav"]', measure: 'box', optional: true }),
    nextNav: Object.freeze({ upstream: '.flatpickr-next-month', ours: '[data-part="nextNav"]', measure: 'box', optional: true }),
    navIcon: Object.freeze({ upstream: '.flatpickr-next-month svg', ours: '[data-part="nextNav"] svg', measure: 'box', optional: true }),
    weekday: Object.freeze({ upstream: '.flatpickr-weekday', ours: '[data-part="weekday"]', measure: 'text', optional: true }),
    days: Object.freeze({ upstream: '.dayContainer', ours: '[data-part="days"]', measure: 'box', optional: true, compare: ['x', 'y', 'width', 'height'] }),
    day: Object.freeze({ upstream: '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay):not(.selected):not(.inRange):not(.today)', ours: '[data-part="day"]', measure: 'box', optional: true }),
    outside: Object.freeze({ upstream: '.flatpickr-day.prevMonthDay, .flatpickr-day.nextMonthDay', ours: '[data-part="outside"]', measure: 'box', optional: true }),
    selected: Object.freeze({ upstream: '.flatpickr-day.selected', ours: '[data-part="selected"]', measure: 'box', optional: true }),
    inRange: Object.freeze({ upstream: '.flatpickr-day.inRange', ours: '[data-part="inRange"]', measure: 'box', optional: true })
  })
});
