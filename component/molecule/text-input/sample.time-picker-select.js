// Info: TimePickerSelect sample states for the showcase, the browser gates
// and the docs: the member mounts only inside a TimePicker, so every state
// wraps it in the parent - `props` and `referenceProps` describe the same
// composition for our registry and the upstream adapter.

// The parent row shrink-wraps its members; the showcase, the walker and
// the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

const ITEMS = Object.freeze([
  Object.freeze({ value: 'AM', label: 'AM' }),
  Object.freeze({ value: 'PM', label: 'PM' })
]);
const PARENT = Object.freeze({
  component: 'TimePicker',
  props: Object.freeze({ label: 'Time', value: '12:00' }),
  // Fixture metadata for the upstream adapter only - never a component prop
  referenceProps: Object.freeze({ labelText: 'Time', value: '12:00' })
});

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ accessibilityLabel: 'Period', testID: 'time-select', items: ITEMS }), wrappers: Object.freeze([PARENT]) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ accessibilityLabel: 'Period', testID: 'time-select', items: ITEMS, disabled: true }), wrappers: Object.freeze([PARENT]) }),
  Object.freeze({ label: 'small', props: Object.freeze({ accessibilityLabel: 'Period', testID: 'time-select', items: ITEMS }), wrappers: Object.freeze([Object.assign({}, PARENT, {
    props: Object.freeze({ label: 'Time', value: '12:00', size: 'sm' }),
    referenceProps: Object.freeze({ labelText: 'Time', value: '12:00', size: 'sm' })
  })]) }),
  Object.freeze({ label: 'large', props: Object.freeze({ accessibilityLabel: 'Period', testID: 'time-select', items: ITEMS }), wrappers: Object.freeze([Object.assign({}, PARENT, {
    props: Object.freeze({ label: 'Time', value: '12:00', size: 'lg' }),
    referenceProps: Object.freeze({ labelText: 'Time', value: '12:00', size: 'lg' })
  })]) })
]);
