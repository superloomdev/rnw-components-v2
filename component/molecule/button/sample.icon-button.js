// Info: IconButton sample states for the showcase, the browser gates and
// the docs. Each entry is one rendered instance: a label and the props it
// takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ icon: 'add', label: 'Add' }) }),
  Object.freeze({ label: 'secondary', props: Object.freeze({ icon: 'add', label: 'Add', kind: 'secondary' }) }),
  Object.freeze({ label: 'ghost', props: Object.freeze({ icon: 'add', label: 'Add', kind: 'ghost' }) }),
  Object.freeze({ label: 'tertiary', props: Object.freeze({ icon: 'add', label: 'Add', kind: 'tertiary' }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ icon: 'add', label: 'Add', kind: 'ghost', selected: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ icon: 'add', label: 'Add', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ icon: 'add', label: 'Add', kind: 'ghost', size: 'sm' }) }),
  Object.freeze({ label: 'medium', props: Object.freeze({ icon: 'add', label: 'Add', kind: 'ghost', size: 'md' }) })
]);
