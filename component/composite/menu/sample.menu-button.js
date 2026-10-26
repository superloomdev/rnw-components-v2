// Info: MenuButton sample states for the showcase, the browser gates and
// the docs. The menu opens at the trigger's bottom edge inside the cell,
// so no staging; the opened states each take a different position so the
// menus do not sit on top of one another. 320 x 280 fits a three-item
// menu at any size.

export const FRAME = Object.freeze({ width: 320, height: 280 });

const ITEMS = Object.freeze([
  Object.freeze({ label: 'First action' }),
  Object.freeze({ label: 'Second action' }),
  Object.freeze({ label: 'Third action' })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: ITEMS, label: 'Actions' }) }),
  Object.freeze({ label: 'open', props: Object.freeze({ items: ITEMS, label: 'Actions', open: true }) }),
  Object.freeze({ label: 'tertiary', props: Object.freeze({ items: ITEMS, label: 'Actions', kind: 'tertiary' }) }),
  Object.freeze({ label: 'ghost', props: Object.freeze({ items: ITEMS, label: 'Actions', kind: 'ghost' }) }),
  Object.freeze({ label: 'xs', props: Object.freeze({ items: ITEMS, label: 'Actions', size: 'xs' }) }),
  Object.freeze({ label: 'sm', props: Object.freeze({ items: ITEMS, label: 'Actions', open: true, size: 'sm' }) }),
  Object.freeze({ label: 'md', props: Object.freeze({ items: ITEMS, label: 'Actions', size: 'md' }) }),
  Object.freeze({ label: 'alignStart', props: Object.freeze({ items: ITEMS, label: 'Actions', menuAlignment: 'bottom-start', open: true }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ items: ITEMS, label: 'Actions', disabled: true }) })
]);
