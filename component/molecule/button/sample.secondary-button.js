// Info: SecondaryButton sample states for the showcase, the browser gates and
// the docs: the default kind, an icon, a size, the disabled state and a
// caller kind that wins over the secondary default.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Secondary' }) }),
  Object.freeze({ label: 'with icon', props: Object.freeze({ children: 'Secondary', icon: 'add' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ children: 'Secondary', size: 'sm' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Secondary', disabled: true }) }),
  Object.freeze({ label: 'other kind', props: Object.freeze({ children: 'Secondary', kind: 'tertiary' }) })
]);
