// Info: TextInput sample states for the showcase, the browser gates and the docs.
// Each entry is one rendered instance: a label and the props it takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Label', placeholder: 'Placeholder' }) }),
  Object.freeze({ label: 'filled', props: Object.freeze({ label: 'Label', value: 'Filled value' }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'Label', placeholder: 'Placeholder', helperText: 'Helper text' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Label', value: 'Wrong value', invalid: true, invalidText: 'Enter a valid value' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Label', value: 'Disabled value', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Label', placeholder: 'Small', size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Label', placeholder: 'Large', size: 'lg' }) }),
  Object.freeze({ label: 'unlabelled', props: Object.freeze({ accessibilityLabel: 'Search', placeholder: 'Search' }) })
]);
