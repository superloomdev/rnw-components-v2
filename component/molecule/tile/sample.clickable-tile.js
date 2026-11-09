// Info: ClickableTile sample states for the showcase, the browser gates and
// the docs. Each entry is one rendered instance: a label and the props it
// takes.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Tile content', href: '#' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ children: 'Tile content', disabled: true }) }),
  Object.freeze({ label: 'icon', props: Object.freeze({ children: 'Tile content', icon: 'arrow_right' }) }),
  Object.freeze({ label: 'iconDisabled', props: Object.freeze({ children: 'Tile content', disabled: true, icon: 'arrow_right' }) })
]);
