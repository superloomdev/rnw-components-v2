// Info: FloatingActionButton sample states for the showcase, the browser
// gates and the docs: the four kinds, the two size extremes and the extended
// form in its default and primary kinds. The button sizes to content, so
// samples carry no frame.

const ADD = Object.freeze({ icon: 'add', accessibilityLabel: 'Add' });

export default Object.freeze([
  Object.freeze({ label: 'surface', props: Object.freeze(Object.assign({}, ADD)) }),
  Object.freeze({ label: 'primary', props: Object.freeze(Object.assign({}, ADD, { kind: 'primary' })) }),
  Object.freeze({ label: 'secondary', props: Object.freeze(Object.assign({}, ADD, { kind: 'secondary' })) }),
  Object.freeze({ label: 'tertiary', props: Object.freeze(Object.assign({}, ADD, { kind: 'tertiary' })) }),
  Object.freeze({ label: 'small', props: Object.freeze(Object.assign({}, ADD, { size: 'sm' })) }),
  Object.freeze({ label: 'large', props: Object.freeze(Object.assign({}, ADD, { size: 'lg' })) }),
  Object.freeze({ label: 'extended', props: Object.freeze({ icon: 'add', label: 'Create' }) }),
  Object.freeze({ label: 'extended-primary', props: Object.freeze({ icon: 'add', label: 'Create', kind: 'primary' }) })
]);
