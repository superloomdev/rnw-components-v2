// Info: OrderedList sample states for the showcase, the browser gates
// and the docs. Each entry is one rendered instance.
const ROWS = Object.freeze(['List item 1', 'List item 2', 'List item 3']);
const NESTED = Object.freeze([
  Object.freeze({ label: 'List item 1' }),
  Object.freeze({ label: 'List item 2', items: Object.freeze(['Nested item 1', 'Nested item 2']) }),
  Object.freeze({ label: 'List item 3' })
]);
export default Object.freeze([
  Object.freeze({ label: 'ordered', props: Object.freeze({ items: ROWS }) }),
  Object.freeze({ label: 'orderedExpressive', props: Object.freeze({ items: ROWS, isExpressive: true }) }),
  Object.freeze({ label: 'orderedNested', props: Object.freeze({ items: NESTED }) }),
  Object.freeze({ label: 'orderedNative', props: Object.freeze({ items: ROWS, native: true }) }),
  Object.freeze({ label: 'orderedNativeNested', props: Object.freeze({ items: NESTED, native: true }) })
]);
