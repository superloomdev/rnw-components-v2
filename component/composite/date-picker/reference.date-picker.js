// Info: DatePicker measurement reference. The upstream picker takes the
// same `datePickerType`, `value` and `short`, `readOnly` for our
// `isReadOnly`, and its fields as DatePickerInput children (the disabled
// flag goes on each field). Its calendar is appended to a positioned stage
// that fills the cell body (`appendTo`), where it draws flush under the
// first field as ours does; an `open` state opens it after mount and
// re-opens it whenever it closes, so the open cells stay open while other
// cells take focus. The parts compared are the label, the field, its text
// and icon, the message, and on the open calendar its box, header, arrows,
// month name, year box, weekday row and day cells by state.

const PCT = '%';
let counter = 0;


/********************************************************************
The positioned stage the upstream calendar is appended to; an open state
keeps the calendar open.

@param {Object} props - { React, picker, open }

@return {Object} - React element
*********************************************************************/
function Stage (props) {

  const React = props.React;
  const [node, setNode] = React.useState(null);
  React.useEffect(function () {
    if (node === null || props.open !== true) {
      return undefined;
    }
    const reopen = function () {
      const input = node.querySelector('.cds--date-picker__input');
      const picker = input === null ? undefined : input._flatpickr;
      if (picker === undefined) {
        return;
      }
      if (picker.isOpen !== true) {
        picker.open();
      }
      // A press or focus on a range field turns the view to the current
      // month; the open state shows the value's month, as ours does
      const first = picker.selectedDates[0];
      if (first !== undefined && (picker.currentMonth !== first.getMonth() || picker.currentYear !== first.getFullYear())) {
        picker.jumpToDate(first);
      }
    };
    reopen();
    const timer = setInterval(reopen, 200);
    return function () {
      clearInterval(timer);
    };
  }, [node, props.open]);
  return React.createElement('div', { ref: setNode, style: { height: 100 + PCT, position: 'relative', width: 100 + PCT } },
    node === null ? null : props.picker(node));

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
