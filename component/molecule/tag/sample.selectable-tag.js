// Info: SelectableTag sample states for the showcase, the browser gates
// and the docs. Each entry is one rendered instance: a label and the props
// it takes. Props only; no composition props.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ text: 'Tag content' }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ selected: true, text: 'Tag content' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ size: 'sm', text: 'Tag content' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ size: 'lg', text: 'Tag content' }) }),
  Object.freeze({ label: 'icon', props: Object.freeze({ icon: 'add', text: 'Tag content' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ disabled: true, text: 'Tag content' }) }),
  Object.freeze({ label: 'disabled selected', props: Object.freeze({ disabled: true, selected: true, text: 'Tag content' }) })
]);
