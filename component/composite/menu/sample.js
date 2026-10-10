// Info: Menu sample states for the showcase, the browser gates and the
// docs. Each entry is one rendered instance: a label and the props it
// takes. The menu opens at a fixed point inside its cell so the measured
// surface is in view; each state takes a different point so the surfaces
// do not sit on top of one another and steal each other's hovers. The
// cell is a stage for the layer: the body frames it and becomes the
// fixed surface's containing block, wide and tall enough for the surface
// at each point in every template.

// The stage: the selectable surface sits 240 points in and the tallest
// surface is 257 tall, so the cell frames 400 by 280
export const FRAME = Object.freeze({ width: 400, height: 280, stage: true });

const ITEMS = Object.freeze([
  Object.freeze({ label: 'Cut', shortcut: 'Ctrl+X' }),
  Object.freeze({ label: 'Copy', icon: 'add' }),
  Object.freeze({ label: 'Paste', disabled: true }),
  Object.freeze({ divider: true }),
  Object.freeze({ label: 'Delete', danger: true })
]);

const SELECTED_ITEMS = Object.freeze([
  Object.freeze({ label: 'List view', selected: false }),
  Object.freeze({ label: 'Grid view', selected: true }),
  Object.freeze({ label: 'Board view', selected: false })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: ITEMS, open: true, x: 8, y: 8, accessibilityLabel: 'Actions' }) }),
  Object.freeze({ label: 'selectable', props: Object.freeze({ items: SELECTED_ITEMS, open: true, x: 240, y: 8, accessibilityLabel: 'Views' }) })
]);
