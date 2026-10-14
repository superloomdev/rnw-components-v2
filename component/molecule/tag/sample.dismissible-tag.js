// Info: DismissibleTag sample states for the showcase, the browser gates
// and the docs. Each entry is one rendered instance: a label and the props
// it takes. Props only; no composition props.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ text: 'Tag content', title: 'Dismiss' }) }),
  Object.freeze({ label: 'typed', props: Object.freeze({ text: 'Tag content', title: 'Dismiss', type: 'blue' }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ size: 'sm', text: 'Tag content', title: 'Dismiss' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ size: 'lg', text: 'Tag content', title: 'Dismiss' }) }),
  Object.freeze({ label: 'icon', props: Object.freeze({ icon: 'add', text: 'Tag content', title: 'Dismiss' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ disabled: true, text: 'Tag content', title: 'Dismiss' }) })
]);
