// Info: ContainedList sample states for the showcase, the browser gates
// and the docs. Each entry is one rendered instance.
const ROWS = Object.freeze([
  Object.freeze({ label: 'List item 1' }),
  Object.freeze({ label: 'List item 2' }),
  Object.freeze({ label: 'List item 3' })
]);
const CLICKABLE = Object.freeze([
  Object.freeze({ label: 'List item 1', onPress: function () {} }),
  Object.freeze({ disabled: true, label: 'List item 2', onPress: function () {} }),
  Object.freeze({ label: 'List item 3', onPress: function () {} })
]);
const ICONS = Object.freeze([
  Object.freeze({ icon: 'add', label: 'List item 1' }),
  Object.freeze({ icon: 'add', label: 'List item 2' })
]);
const ACTIONS = Object.freeze([
  Object.freeze({ action: 'tag', label: 'List item 1' }),
  Object.freeze({ action: 'button', label: 'List item 2' })
]);
export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: ROWS, label: 'List title' }) }),
  Object.freeze({ label: 'disclosed', props: Object.freeze({ items: ROWS, kind: 'disclosed', label: 'List title' }) }),
  Object.freeze({ label: 'sm', props: Object.freeze({ items: ROWS, label: 'List title', size: 'sm' }) }),
  Object.freeze({ label: 'md', props: Object.freeze({ items: ROWS, label: 'List title', size: 'md' }) }),
  Object.freeze({ label: 'xl', props: Object.freeze({ items: ROWS, label: 'List title', size: 'xl' }) }),
  Object.freeze({ label: 'inset', props: Object.freeze({ isInset: true, items: ROWS, label: 'List title' }) }),
  Object.freeze({ label: 'clickable', props: Object.freeze({ items: CLICKABLE, label: 'List title' }) }),
  Object.freeze({ label: 'icons', props: Object.freeze({ items: ICONS, label: 'List title' }) }),
  Object.freeze({ label: 'actions', props: Object.freeze({ items: ACTIONS, label: 'List title', size: 'md' }) }),
  Object.freeze({ label: 'search', props: Object.freeze({ action: 'search', items: ROWS, label: 'List title' }) })
]);
