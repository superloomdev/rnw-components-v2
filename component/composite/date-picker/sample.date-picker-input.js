// Info: DatePickerInput sample states, rendered through its parent
// DatePicker per the requires_parent rule: the default field and the
// invalid one.

export const PARENT = Object.freeze({ component: 'DatePicker' });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ labelText: 'Date' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ invalid: true, invalidText: 'Enter a valid date.', labelText: 'Date' }) })
]);
