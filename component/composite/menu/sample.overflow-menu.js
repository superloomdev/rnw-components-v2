// Info: OverflowMenu sample states for the showcase, the browser gates
// and the docs. The panel opens inside the cell (the container anchors
// it), so no staging; the opened states each take a different trigger
// position so the panels do not sit on top of one another and steal
// each other's hovers. 320 x 240 fits the largest panel (160 wide, four
// rows at 40 plus the connector).

export const FRAME = Object.freeze({ width: 320, height: 240 });

const ITEMS = Object.freeze([
  Object.freeze({ label: 'Edit' }),
  Object.freeze({ label: 'Duplicate' }),
  Object.freeze({ label: 'Archive', disabled: true }),
  Object.freeze({ label: 'Delete', danger: true, divider: true })
]);

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ items: ITEMS, iconDescription: 'Options' }) }),
  Object.freeze({ label: 'xs', props: Object.freeze({ items: ITEMS, size: 'xs', iconDescription: 'Options' }) }),
  Object.freeze({ label: 'sm', props: Object.freeze({ items: ITEMS, size: 'sm', iconDescription: 'Options' }) }),
  Object.freeze({ label: 'lg', props: Object.freeze({ items: ITEMS, size: 'lg', iconDescription: 'Options' }) }),
  Object.freeze({ label: 'open', props: Object.freeze({ items: ITEMS, open: true, iconDescription: 'Options' }) }),
  Object.freeze({ label: 'openLg', props: Object.freeze({ items: ITEMS, open: true, size: 'lg', iconDescription: 'Options' }) }),
  Object.freeze({ label: 'openFlipped', props: Object.freeze({ items: ITEMS, open: true, flipped: true, iconDescription: 'Options' }) }),
  Object.freeze({ label: 'openTop', props: Object.freeze({ items: ITEMS, open: true, direction: 'top', iconDescription: 'Options' }) }),
  Object.freeze({ label: 'openOption', props: Object.freeze({ items: ITEMS, open: true, iconDescription: 'Options' }) }),
  Object.freeze({ label: 'openDanger', props: Object.freeze({ items: ITEMS, open: true, iconDescription: 'Options' }) })
]);
