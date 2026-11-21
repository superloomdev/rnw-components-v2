// Info: SelectableTile sample states for the showcase, the browser gates and
// the docs. Each entry is one rendered instance: a label and the props it
// takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Tile content' }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ children: 'Tile content', selected: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Tile content', disabled: true }) }),
  Object.freeze({ label: 'selectedDisabled', props: Object.freeze({ children: 'Tile content', disabled: true, selected: true }) })
]);
