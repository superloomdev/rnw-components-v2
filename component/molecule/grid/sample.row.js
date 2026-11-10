// Info: Row sample states for the showcase, the browser gates and the
// docs. `requires_parent`: every state wraps the Row in a Grid so the
// negative inline margins sit under the grid's padding, as upstream's
// FlexGrid. Mirrors `recipes/probe/Row.mount.js` through `columns`.

// The parent holds the Row and its columns
const PARENT = Object.freeze({
  component: 'Grid',
  props: Object.freeze({}),
  referenceProps: Object.freeze({})
});
const FOUR = [
  { children: 'Column', lg: 4 },
  { children: 'Column', lg: 4 },
  { children: 'Column', lg: 4 },
  { children: 'Column', lg: 4 }
];
const parentFor = function (extra) {
  return Object.freeze([Object.assign({}, PARENT, {
    props: Object.freeze(extra),
    referenceProps: Object.freeze(extra)
  })]);
};

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ columns: FOUR }), wrappers: Object.freeze([PARENT]) }),
  Object.freeze({ label: 'condensed', props: Object.freeze({ columns: FOUR }), wrappers: parentFor({ condensed: true }) }),
  Object.freeze({ label: 'narrow', props: Object.freeze({ columns: FOUR }), wrappers: parentFor({ narrow: true }) }),
  Object.freeze({ label: 'offset', props: Object.freeze({ columns: [{ children: 'Column', lg: { offset: 4, span: 4 } }, { children: 'Column', lg: 8 }] }), wrappers: Object.freeze([PARENT]) }),
  Object.freeze({ label: 'auto', props: Object.freeze({ columns: [{ children: 'Column' }, { children: 'Column' }, { children: 'Column' }] }), wrappers: Object.freeze([PARENT]) }),
  Object.freeze({ label: 'rowGap', props: Object.freeze({ columns: FOUR }), wrappers: parentFor({ withRowGap: true }) })
]);
