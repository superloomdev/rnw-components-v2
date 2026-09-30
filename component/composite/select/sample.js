// Info: Select sample states for the showcase, the browser gates and the docs.
// Each entry is one rendered instance: a label and the props it takes.

const ITEMS = Object.freeze([
  Object.freeze({ value: 'small', label: 'Small' }),
  Object.freeze({ value: 'medium', label: 'Medium' }),
  Object.freeze({ value: 'large', label: 'Large' })
]);


export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Size', placeholder: 'Choose a size', items: ITEMS }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ label: 'Size', items: ITEMS, value: 'medium' }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'Size', placeholder: 'Choose a size', items: ITEMS, helperText: 'Helper text' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Size', items: ITEMS, invalid: true, invalidText: 'Choose a size' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Size', items: ITEMS, value: 'small', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Size', placeholder: 'Small', items: ITEMS, size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Size', placeholder: 'Large', items: ITEMS, size: 'lg' }) }),
  Object.freeze({ label: 'unlabelled', props: Object.freeze({ accessibilityLabel: 'Size', placeholder: 'Choose a size', items: ITEMS }) })
]);
