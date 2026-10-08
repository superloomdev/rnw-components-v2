// Info: Checkbox sample states for the showcase, the browser gates and the docs.
// Each entry is one rendered instance: a label and the props it takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Unchecked' }) }),
  Object.freeze({ label: 'checked', props: Object.freeze({ label: 'Checked', checked: true }) }),
  Object.freeze({ label: 'indeterminate', props: Object.freeze({ label: 'Indeterminate', indeterminate: true }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'With helper', helperText: 'Helper text' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Invalid', invalid: true, invalidText: 'Select this option' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Disabled', disabled: true }) }),
  Object.freeze({ label: 'disabled checked', props: Object.freeze({ label: 'Disabled checked', disabled: true, checked: true }) })
]);
