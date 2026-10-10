// Info: Tag sample states for the showcase, the browser gates and the docs.
// Each entry is one rendered instance: a label and the props it takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Tag' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ children: 'Tag', size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ children: 'Tag', size: 'lg' }) }),
  Object.freeze({ label: 'type', props: Object.freeze({ children: 'Tag', type: 'blue' }) }),
  Object.freeze({ label: 'icon', props: Object.freeze({ children: 'Tag', icon: 'checkmark' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Tag', disabled: true }) })
]);
