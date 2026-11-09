// Info: Row sample states for the showcase, the browser gates and the
// docs. Mirrors the mount's states through the `columns` composition prop.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ columns: [{ children: 'Column' }, { children: 'Column' }, { children: 'Column' }] }) }),
  Object.freeze({ label: 'spans', props: Object.freeze({ columns: [{ children: 'Column', lg: 4 }, { children: 'Column', lg: 8 }] }) }),
  Object.freeze({ label: 'offset', props: Object.freeze({ columns: [{ children: 'Column', lg: { offset: 4, span: 4 } }, { children: 'Column', lg: 8 }] }) })
]);
