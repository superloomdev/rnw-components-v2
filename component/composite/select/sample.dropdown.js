// Info: Dropdown sample states for the showcase, the browser gates and the
// docs. Each entry is one rendered instance: a label and the props it takes.
// The `open` entry mounts the list but is grid-excluded: its overlay would
// escape the cell, so the open state is covered by the `open` interaction.

const ITEMS = Object.freeze([
  Object.freeze({ value: 'small', label: 'Small' }),
  Object.freeze({ value: 'medium', label: 'Medium' }),
  Object.freeze({ value: 'large', label: 'Large' })
]);


// A field fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Size', placeholder: 'Choose a size', items: ITEMS }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ label: 'Size', items: ITEMS, value: 'medium' }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'Size', placeholder: 'Choose a size', items: ITEMS, helperText: 'Helper text' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Size', items: ITEMS, invalid: true, invalidText: 'Choose a size' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Size', items: ITEMS, value: 'small', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Size', placeholder: 'Small', items: ITEMS, size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Size', placeholder: 'Large', items: ITEMS, size: 'lg' }) }),
  Object.freeze({ label: 'unlabelled', props: Object.freeze({ accessibilityLabel: 'Size', placeholder: 'Choose a size', items: ITEMS }) }),
  // The `open` entry keeps the list mounted for the unit gates that walk the
  // sample statically; `cell: false` keeps it out of the grids, where its
  // overlay would escape the cell and block hovers on the cells below (the
  // `open` interaction covers the open list in the browser gates)
  Object.freeze({ label: 'open', props: Object.freeze({ label: 'Size', items: ITEMS, value: 'medium', open: true }), cell: false })
]);
