// Info: SelectItemGroup sample states for the showcase, the browser gates
// and the docs: the labelled group and the disabled group.

// A group row fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({
    label: 'Fruits',
    items: [
      Object.freeze({ value: 'apple', label: 'Apple' }),
      Object.freeze({ value: 'banana', label: 'Banana' })
    ]
  }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({
    label: 'Fruits',
    disabled: true,
    items: [
      Object.freeze({ value: 'apple', label: 'Apple' }),
      Object.freeze({ value: 'banana', label: 'Banana' })
    ]
  }) })
]);
