// Info: NumberInput sample states for the showcase, the browser gates and
// the docs: the states the references draw.

// A field fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Quantity', value: 2 }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'Quantity', value: 2, helperText: 'Pick a count' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Quantity', value: 99, max: 10, invalidText: 'Choose 10 or fewer' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Quantity', value: 2, disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Quantity', value: 2, size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Quantity', value: 2, size: 'lg' }) }),
  Object.freeze({ label: 'empty', props: Object.freeze({ label: 'Quantity', allowEmpty: true, value: '' }) }),
  Object.freeze({ label: 'no steppers', props: Object.freeze({ label: 'Quantity', value: 2, hideSteppers: true }) })
]);
