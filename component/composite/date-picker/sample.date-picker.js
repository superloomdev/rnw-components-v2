// Info: DatePicker sample states for the showcase, the browser gates and
// the docs: the three picker forms, the field sizes, the short simple
// form, invalid, disabled and read-only, and the open calendar for a
// single date and a range (March 2024, so the day grid holds no today).
// The fields are given as data. The frame is a stage that holds the open
// calendar, so the measurement grid never squeezes the cell under it.

export const FRAME = Object.freeze({ height: 420, stage: true, width: 320 });

const DATE = Object.freeze({ labelText: 'Date', placeholder: 'mm/dd/yyyy' });
const PAIR = Object.freeze([
  Object.freeze({ labelText: 'Start date', placeholder: 'mm/dd/yyyy' }),
  Object.freeze({ labelText: 'End date', placeholder: 'mm/dd/yyyy' })
]);

export default Object.freeze([
  Object.freeze({ label: 'simple', props: Object.freeze({ datePickerType: 'simple', inputs: Object.freeze([DATE]) }) }),
  Object.freeze({ label: 'shortSimple', props: Object.freeze({ datePickerType: 'simple', short: true, inputs: Object.freeze([DATE]) }) }),
  Object.freeze({ label: 'default', props: Object.freeze({ datePickerType: 'single', inputs: Object.freeze([DATE]) }) }),
  Object.freeze({ label: 'value', props: Object.freeze({ datePickerType: 'single', value: '03/15/2024', inputs: Object.freeze([DATE]) }) }),
  Object.freeze({ label: 'sm', props: Object.freeze({ datePickerType: 'single', inputs: Object.freeze([Object.assign({ size: 'sm' }, DATE)]) }) }),
  Object.freeze({ label: 'lg', props: Object.freeze({ datePickerType: 'single', inputs: Object.freeze([Object.assign({ size: 'lg' }, DATE)]) }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ datePickerType: 'single', inputs: Object.freeze([Object.assign({ invalid: true, invalidText: 'Enter a valid date.' }, DATE)]) }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ datePickerType: 'single', disabled: true, inputs: Object.freeze([DATE]) }) }),
  Object.freeze({ label: 'readOnly', props: Object.freeze({ datePickerType: 'single', 'isReadOnly': true, value: '03/15/2024', inputs: Object.freeze([DATE]) }) }),
  Object.freeze({ label: 'range', props: Object.freeze({ datePickerType: 'range', inputs: PAIR }) }),
  Object.freeze({ label: 'open', props: Object.freeze({ datePickerType: 'single', open: true, value: '03/15/2024', inputs: Object.freeze([DATE]) }) }),
  Object.freeze({ label: 'openRange', props: Object.freeze({ datePickerType: 'range', open: true, value: Object.freeze(['03/12/2024', '03/18/2024']), inputs: PAIR }) })
]);
