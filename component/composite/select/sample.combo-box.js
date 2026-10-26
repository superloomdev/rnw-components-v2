// Info: ComboBox sample states for the showcase, the browser gates and the
// docs: empty, selected, helped, invalid in both population states, disabled
// and the size extremes.

const ITEMS = Object.freeze([
  Object.freeze({ value: 'apple', label: 'Apple' }),
  Object.freeze({ value: 'banana', label: 'Banana' }),
  Object.freeze({ value: 'cherry', label: 'Cherry' }),
  Object.freeze({ value: 'durian', label: 'Durian', disabled: true })
]);


// A field fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Fruit', placeholder: 'Choose a fruit', items: ITEMS }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ label: 'Fruit', items: ITEMS, value: 'banana' }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'Fruit', placeholder: 'Choose a fruit', items: ITEMS, helperText: 'Helper text' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Fruit', placeholder: 'Choose a fruit', items: ITEMS, invalid: true, invalidText: 'Choose a fruit' }) }),
  Object.freeze({ label: 'invalid-selected', props: Object.freeze({ label: 'Fruit', items: ITEMS, value: 'banana', invalid: true, invalidText: 'Choose a fruit' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Fruit', items: ITEMS, value: 'apple', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Fruit', placeholder: 'Small', items: ITEMS, size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Fruit', placeholder: 'Large', items: ITEMS, size: 'lg' }) })
]);
