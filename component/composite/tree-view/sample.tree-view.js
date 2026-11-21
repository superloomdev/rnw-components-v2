// Info: TreeView sample states for the showcase, the browser gates and
// the docs. Mirrors `recipes/probe/TreeView.mount.js` through `nodes`.

const NODES = [
  { id: 'one', label: 'Node one' },
  { children: [{ id: 'two-one', label: 'Node two one' }, { id: 'two-two', label: 'Node two two' }], expanded: true, id: 'two', label: 'Node two' },
  { disabled: true, id: 'three', label: 'Node three' },
  { children: [{ id: 'four-one', label: 'Node four one' }], expanded: false, id: 'four', label: 'Node four' }
];
const ICON_NODES = NODES.map(function (n) {
  return Object.assign({}, n, { icon: 'document' });
});

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Tree view', nodes: NODES }) }),
  Object.freeze({ label: 'focus', props: Object.freeze({ label: 'Tree view', nodes: NODES }) }),
  Object.freeze({ label: 'selected', props: Object.freeze({ active: 'one', defaultSelected: ['one'], label: 'Tree view', nodes: NODES }) }),
  Object.freeze({ label: 'icons', props: Object.freeze({ label: 'Tree view', nodes: ICON_NODES }) }),
  Object.freeze({ label: 'xs', props: Object.freeze({ label: 'Tree view', nodes: NODES, size: 'xs' }) }),
  Object.freeze({ label: 'hideLabel', props: Object.freeze({ accessibilityLabel: 'Tree view', hideLabel: true, nodes: NODES }) })
]);
