// Info: Button sample states for the showcase, the browser gates and the docs.
// Each entry is one rendered instance: a label and the props it takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Primary' }) }),
  Object.freeze({ label: 'secondary', props: Object.freeze({ children: 'Secondary', kind: 'secondary' }) }),
  Object.freeze({ label: 'tertiary', props: Object.freeze({ children: 'Tertiary', kind: 'tertiary' }) }),
  Object.freeze({ label: 'ghost', props: Object.freeze({ children: 'Ghost', kind: 'ghost' }) }),
  Object.freeze({ label: 'danger', props: Object.freeze({ children: 'Danger', kind: 'danger' }) }),
  Object.freeze({ label: 'danger tertiary', props: Object.freeze({ children: 'Danger tertiary', kind: 'danger_tertiary' }) }),
  Object.freeze({ label: 'danger ghost', props: Object.freeze({ children: 'Danger ghost', kind: 'danger_ghost' }) }),
  Object.freeze({ label: 'tonal', props: Object.freeze({ children: 'Tonal', kind: 'tonal' }) }),
  Object.freeze({ label: 'elevated', props: Object.freeze({ children: 'Elevated', kind: 'elevated' }) }),
  Object.freeze({ label: 'with icon', props: Object.freeze({ children: 'Add item', icon: 'add' }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ children: 'Selected', kind: 'ghost', selected: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Disabled', disabled: true }) }),
  Object.freeze({ label: 'disabled tertiary', props: Object.freeze({ children: 'Disabled tertiary', kind: 'tertiary', disabled: true }) }),
  Object.freeze({ label: 'extra small', props: Object.freeze({ children: 'Extra small', size: 'xs' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ children: 'Small', size: 'sm' }) }),
  Object.freeze({ label: 'medium', props: Object.freeze({ children: 'Medium', size: 'md' }) }),
  Object.freeze({ label: 'extra large', props: Object.freeze({ children: 'Extra large', size: 'xl' }) }),
  Object.freeze({ label: '2x large', props: Object.freeze({ children: '2x large', size: '2xl' }) })
]);
