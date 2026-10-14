// Info: ComboButton sample states for the showcase, the browser gates and
// the docs: the joined action and trigger resting, the small size, the
// disabled pair and the menu that opens upward. No frame: the root seats
// itself at its content width, and no stage is needed because the open
// menu is not a measured part.

const ITEMS = Object.freeze([
  Object.freeze({ label: 'Edit' }),
  Object.freeze({ label: 'Duplicate' }),
  Object.freeze({ label: 'Delete', danger: true })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Create', items: ITEMS }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Create', items: ITEMS, size: 'sm' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Create', items: ITEMS, disabled: true }) }),
  Object.freeze({ label: 'top', props: Object.freeze({ label: 'Create', items: ITEMS, menuAlignment: 'top' }) })
]);
