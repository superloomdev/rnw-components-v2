// Info: RadioButton sample states for the showcase, the browser gates and
// the docs. Each entry is one rendered instance: a label and the props it
// takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Unchecked' }) }),
  Object.freeze({ label: 'checked', props: Object.freeze({ label: 'Checked', checked: true }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Invalid', invalid: true }) }),
  Object.freeze({ label: 'invalid checked', props: Object.freeze({ label: 'Invalid checked', invalid: true, checked: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Disabled', disabled: true }) }),
  Object.freeze({ label: 'disabled checked', props: Object.freeze({ label: 'Disabled checked', disabled: true, checked: true }) })
]);
