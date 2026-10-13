// Info: DangerButton sample states for the showcase, the browser gates and
// the docs: the default kind, an icon, a size, the disabled state and a
// caller kind the danger default ignores.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Danger' }) }),
  Object.freeze({ label: 'with icon', props: Object.freeze({ children: 'Danger', icon: 'add' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ children: 'Danger', size: 'sm' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Danger', disabled: true }) }),
  Object.freeze({ label: 'kind ignored', props: Object.freeze({ children: 'Danger', kind: 'primary' }) })
]);
